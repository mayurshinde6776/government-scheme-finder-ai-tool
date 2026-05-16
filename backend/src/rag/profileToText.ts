/**
 * profileToText.ts
 *
 * Converts a UserProfile into a dense, readable paragraph that is used as:
 *   1. The query string for pgvector semantic search (after embedding).
 *   2. The user-context block in the GPT-4o-mini reasoning prompt.
 *
 * Example output:
 *   "The applicant is a 34-year-old female farmer from Maharashtra.
 *    She belongs to the OBC category with an annual household income of
 *    Rs 1,20,000. She holds a BPL card and is not disabled."
 */

import type { UserProfile } from './types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CASTE_LABELS: Record<string, string> = {
  general: 'General',
  obc: 'Other Backward Class (OBC)',
  sc: 'Scheduled Caste (SC)',
  st: 'Scheduled Tribe (ST)',
};

/** Format an integer income figure in Indian number style with Rs prefix */
function formatIncome(amount: number): string {
  // Use Indian locale for grouping (1,00,000 style)
  return 'Rs ' + amount.toLocaleString('en-IN');
}

/** Return grammatically correct pronoun set for the profile gender */
function pronouns(gender: string): { subject: string; possessive: string } {
  if (gender === 'female') return { subject: 'She', possessive: 'Her' };
  if (gender === 'male') return { subject: 'He', possessive: 'His' };
  return { subject: 'They', possessive: 'Their' };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Converts a UserProfile into a natural-language paragraph.
 * Keeps sentences short and factual — optimised for embedding similarity
 * and LLM comprehension, not for human reading beauty.
 */
export function profileToText(profile: UserProfile): string {
  const { subject, possessive } = pronouns(profile.gender);

  const casteLabel = CASTE_LABELS[profile.caste_category] ?? profile.caste_category.toUpperCase();
  const incomeStr = formatIncome(profile.income_annual);

  const parts: string[] = [];

  // Sentence 1 — identity
  parts.push(
    `The applicant is a ${profile.age}-year-old ${profile.gender} ${profile.occupation} from ${profile.state}.`
  );

  // Sentence 2 — category + income
  parts.push(
    `${subject} belongs to the ${casteLabel} category with an annual household income of ${incomeStr}.`
  );

  // Sentence 3 — BPL status
  if (profile.has_bpl_card) {
    parts.push(`${subject} holds a valid Below Poverty Line (BPL) card.`);
  } else {
    parts.push(`${subject} does not hold a BPL card.`);
  }

  // Sentence 4 — disability status
  if (profile.is_disabled) {
    parts.push(`${subject} is a person with disability (PwD).`);
  } else {
    parts.push(`${subject} does not have a disability.`);
  }

  return parts.join(' ');
}
