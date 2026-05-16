/**
 * reason.ts
 *
 * Sends the retrieved schemes + user profile to GPT-4o-mini and asks it to
 * decide eligibility for each scheme.
 *
 * Returns a typed EligibilityResult[] array.
 * On JSON parse failure, retries once with an explicit repair instruction.
 *
 * Exported:
 *   reasonEligibility(profile, schemes): Promise<EligibilityResult[]>
 */

import OpenAI from 'openai';
import type { UserProfile, SchemeRow, EligibilityResult, MatchLevel } from './types';
import { profileToText } from './profileToText';

const MODEL = 'gpt-4o-mini';
const MAX_TOKENS = 4096;

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) throw new Error('[reason] OPENAI_API_KEY is not set');
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a government scheme eligibility advisor for India.
Using ONLY the scheme information provided, determine which schemes the user qualifies for.
Do not invent scheme details. Do not include schemes that are clearly not applicable.
Return ONLY valid JSON — no markdown fences, no prose, no explanation outside the JSON.

Output format (JSON array):
[
  {
    "scheme_id": "<uuid>",
    "scheme_name": "<exact name>",
    "match_level": "high" | "medium" | "low",
    "reason": "<2-3 sentence explanation of why the user qualifies or partially qualifies>",
    "missing_criteria": ["<criterion not met>", ...]
  }
]

match_level rules:
- "high"   → user meets all or nearly all eligibility criteria
- "medium" → user meets most criteria but one or two are uncertain or partially met
- "low"    → user may potentially benefit but has significant gaps or uncertainties

Only include schemes where there is at least some plausible eligibility (omit clearly ineligible ones).
missing_criteria should be an empty array [] when the user fully qualifies.`;

function buildSchemeContext(schemes: SchemeRow[]): string {
  return schemes
    .map(
      (s, i) => `
--- Scheme ${i + 1} ---
ID: ${s.id}
Name: ${s.name}
Ministry: ${s.ministry}
Category: ${s.category}
State: ${s.state ?? 'Central (all India)'}
Eligibility: ${s.eligibility_text}
Benefits: ${s.benefits_text}
`.trim()
    )
    .join('\n\n');
}

function buildUserPrompt(profile: UserProfile, schemes: SchemeRow[]): string {
  return `SCHEME INFORMATION:\n${buildSchemeContext(schemes)}\n\nUSER PROFILE:\n${profileToText(profile)}\n\nAnalyse each scheme above and return the JSON eligibility array.`;
}

// ---------------------------------------------------------------------------
// JSON parsing with one retry
// ---------------------------------------------------------------------------

const VALID_MATCH_LEVELS: MatchLevel[] = ['high', 'medium', 'low'];

function isValidMatchLevel(v: unknown): v is MatchLevel {
  return VALID_MATCH_LEVELS.includes(v as MatchLevel);
}

function parseResults(raw: string): EligibilityResult[] {
  // Strip accidental markdown fences the model sometimes adds despite instructions
  const cleaned = raw.replace(/^```(?:json)?/m, '').replace(/```$/m, '').trim();
  const parsed = JSON.parse(cleaned) as unknown;

  if (!Array.isArray(parsed)) throw new Error('LLM output is not a JSON array');

  return (parsed as Record<string, unknown>[]).map((item, idx) => {
    if (typeof item.scheme_id !== 'string') throw new Error(`Item ${idx}: scheme_id missing`);
    if (typeof item.scheme_name !== 'string') throw new Error(`Item ${idx}: scheme_name missing`);
    if (!isValidMatchLevel(item.match_level)) throw new Error(`Item ${idx}: invalid match_level`);
    if (typeof item.reason !== 'string') throw new Error(`Item ${idx}: reason missing`);
    if (!Array.isArray(item.missing_criteria)) throw new Error(`Item ${idx}: missing_criteria not array`);

    return {
      scheme_id: item.scheme_id as string,
      scheme_name: item.scheme_name as string,
      match_level: item.match_level,
      reason: item.reason as string,
      missing_criteria: item.missing_criteria as string[],
    } satisfies EligibilityResult;
  });
}

// ---------------------------------------------------------------------------
// Core reasoning call
// ---------------------------------------------------------------------------

async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  repairContext?: string
): Promise<string> {
  const client = getClient();
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  if (repairContext) {
    // Repair attempt: feed back the bad output and ask for a fix
    messages.push({ role: 'assistant', content: repairContext });
    messages.push({
      role: 'user',
      content:
        'Your previous response was not valid JSON. Fix it and return ONLY the corrected JSON array, no markdown or prose.',
    });
  }

  const response = await client.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: MAX_TOKENS,
    temperature: 0.1, // Low temperature for deterministic, factual output
    response_format: { type: 'json_object' }, // Enables JSON mode — wraps array in object
  });

  return response.choices[0]?.message?.content ?? '';
}

/**
 * GPT-4o-mini sometimes wraps the array in {"results": [...]} when json_object
 * mode is active (it cannot return a bare array). Unwrap it.
 */
function unwrapIfNeeded(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('[')) return trimmed; // already an array

  const obj = JSON.parse(trimmed) as Record<string, unknown>;
  // Find the first array-valued key
  for (const val of Object.values(obj)) {
    if (Array.isArray(val)) return JSON.stringify(val);
  }
  throw new Error('Could not find an array in LLM JSON object response');
}

// ---------------------------------------------------------------------------
// Exported function
// ---------------------------------------------------------------------------

/**
 * Runs GPT-4o-mini reasoning over the retrieved schemes and returns
 * a structured EligibilityResult[] sorted by match_level (high first).
 *
 * Retries JSON parsing exactly once if the first attempt fails.
 */
export async function reasonEligibility(
  profile: UserProfile,
  schemes: SchemeRow[]
): Promise<EligibilityResult[]> {
  if (schemes.length === 0) {
    console.warn('[reason] No schemes passed to reasonEligibility — returning empty array');
    return [];
  }

  console.log(`[reason] Sending ${schemes.length} schemes to GPT-4o-mini for reasoning…`);

  const systemPrompt = SYSTEM_PROMPT;
  const userPrompt = buildUserPrompt(profile, schemes);

  // Attempt 1
  let rawOutput = await callLLM(systemPrompt, userPrompt);

  try {
    const unwrapped = unwrapIfNeeded(rawOutput);
    const results = parseResults(unwrapped);
    console.log(`[reason] ✓ Parsed ${results.length} eligibility results`);
    return results;
  } catch (err) {
    console.warn(
      `[reason] JSON parse failed on attempt 1 (${err instanceof Error ? err.message : err}). Retrying…`
    );
  }

  // Attempt 2 — send back the bad output and ask for repair
  rawOutput = await callLLM(systemPrompt, userPrompt, rawOutput);

  try {
    const unwrapped = unwrapIfNeeded(rawOutput);
    const results = parseResults(unwrapped);
    console.log(`[reason] ✓ Parsed ${results.length} eligibility results (after retry)`);
    return results;
  } catch (err) {
    console.error(
      `[reason] JSON parse failed on attempt 2. Returning empty array. Raw output:\n${rawOutput}`
    );
    return [];
  }
}
