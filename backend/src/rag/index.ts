/**
 * rag/index.ts
 *
 * Public entry point for the RAG eligibility engine.
 *
 * Pipeline:
 *   1. retrieveSchemes(profile)   → top-15 semantically relevant SchemeRow[]
 *   2. reasonEligibility(profile, schemes) → EligibilityResult[] from GPT-4o-mini
 *   3. Sort by match_level (high → medium → low) and attach metadata
 *
 * Usage:
 *   import { findEligibleSchemes } from './rag';
 *   const results = await findEligibleSchemes(profile);
 */

import { retrieveSchemes } from './retrieve';
import { reasonEligibility } from './reason';
import type { UserProfile, EligibilityResult, MatchLevel, SchemeRow } from './types';

// Re-export all types so consumers only need to import from './rag'
export type { UserProfile, EligibilityResult, MatchLevel, SchemeRow };

// ---------------------------------------------------------------------------
// Sort order
// ---------------------------------------------------------------------------

const MATCH_LEVEL_ORDER: Record<MatchLevel, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function sortByMatchLevel(results: EligibilityResult[]): EligibilityResult[] {
  return [...results].sort(
    (a, b) => MATCH_LEVEL_ORDER[a.match_level] - MATCH_LEVEL_ORDER[b.match_level]
  );
}

// ---------------------------------------------------------------------------
// Enrich results with metadata from the retrieved rows
// ---------------------------------------------------------------------------

function enrichResults(
  results: EligibilityResult[],
  schemeRows: SchemeRow[]
): EligibilityResult[] {
  const rowMap = new Map(schemeRows.map((r) => [r.id, r]));

  return results.map((result) => {
    const row = rowMap.get(result.scheme_id);
    return {
      ...result,
      apply_url: row?.apply_url,
      distance: row?.distance,
    };
  });
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Full RAG pipeline: retrieve → reason → sort.
 *
 * @param profile  Completed UserProfile (all fields required)
 * @returns        EligibilityResult[] sorted high → medium → low
 */
export async function findEligibleSchemes(
  profile: UserProfile
): Promise<EligibilityResult[]> {
  const startMs = Date.now();

  console.log(
    `[rag] Starting eligibility search for session=${profile.session_id}, ` +
      `state=${profile.state}, age=${profile.age}, gender=${profile.gender}`
  );

  // Step 1 — Vector retrieval
  let schemeRows: SchemeRow[];
  try {
    schemeRows = await retrieveSchemes(profile);
  } catch (err) {
    console.error('[rag] retrieve step failed:', err);
    throw new Error(
      `[rag] Failed to retrieve schemes: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (schemeRows.length === 0) {
    console.warn('[rag] No schemes retrieved — returning empty results');
    return [];
  }

  // Step 2 — LLM reasoning
  let results: EligibilityResult[];
  try {
    results = await reasonEligibility(profile, schemeRows);
  } catch (err) {
    console.error('[rag] reason step failed:', err);
    throw new Error(
      `[rag] Failed to reason eligibility: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Step 3 — Enrich with apply_url + distance, then sort
  const enriched = enrichResults(results, schemeRows);
  const sorted = sortByMatchLevel(enriched);

  const elapsed = Date.now() - startMs;
  console.log(
    `[rag] ✓ Complete — ${sorted.length} results returned in ${elapsed}ms ` +
      `(high: ${sorted.filter((r) => r.match_level === 'high').length}, ` +
      `medium: ${sorted.filter((r) => r.match_level === 'medium').length}, ` +
      `low: ${sorted.filter((r) => r.match_level === 'low').length})`
  );

  return sorted;
}
