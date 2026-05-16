/**
 * rag/types.ts
 * Shared TypeScript types for the RAG retrieval and reasoning engine.
 */

import type { SchemeCategory } from '../pipeline/types';

// Re-export for convenience so RAG consumers need only one import path.
export type { SchemeCategory };

// ---------------------------------------------------------------------------
// User Profile
// ---------------------------------------------------------------------------

export type CasteCategory = 'general' | 'obc' | 'sc' | 'st';

export type Gender = 'male' | 'female' | 'other';

/**
 * Mirrors the `user_profiles` DB table.
 * All fields are required so the RAG engine always has a complete picture.
 */
export interface UserProfile {
  id: string;
  session_id: string;
  /** State of residence — e.g. "Maharashtra", "Uttar Pradesh" */
  state: string;
  age: number;
  gender: Gender;
  caste_category: CasteCategory;
  /** Gross annual household income in INR */
  income_annual: number;
  /** E.g. "farmer", "daily wage labourer", "student", "self-employed" */
  occupation: string;
  is_disabled: boolean;
  has_bpl_card: boolean;
  created_at?: Date;
}

// ---------------------------------------------------------------------------
// Scheme Row (as returned from PostgreSQL)
// ---------------------------------------------------------------------------

/**
 * Full row from the `schemes` table with the computed cosine distance column
 * added by the vector search query.
 */
export interface SchemeRow {
  id: string;
  name: string;
  ministry: string;
  category: SchemeCategory;
  state: string | null;
  description: string;
  eligibility_text: string;
  benefits_text: string;
  documents_required: string[];
  apply_url: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  /** Cosine distance from query vector — lower = more relevant (0 to 2) */
  distance: number;
}

// ---------------------------------------------------------------------------
// Eligibility Result (output of the reasoning step)
// ---------------------------------------------------------------------------

export type MatchLevel = 'high' | 'medium' | 'low';

/**
 * One reasoning result for a single scheme as returned by GPT-4o-mini.
 * The `scheme_id` and `scheme_name` fields let consumers correlate back to
 * the SchemeRow without re-querying.
 */
export interface EligibilityResult {
  scheme_id: string;
  scheme_name: string;
  match_level: MatchLevel;
  /** 2-3 sentence plain-language explanation of why the user qualifies. */
  reason: string;
  /**
   * Criteria the user does NOT currently meet.
   * Empty array means fully eligible.
   */
  missing_criteria: string[];
  /** Apply URL — copied from the scheme row for UI convenience */
  apply_url?: string;
  /** Distance score from vector search — retained for debugging */
  distance?: number;
}
