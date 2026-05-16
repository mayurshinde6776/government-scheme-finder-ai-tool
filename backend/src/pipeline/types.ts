/**
 * types.ts
 * Shared type definitions for the data ingestion pipeline.
 */

export type SchemeCategory =
  | 'agriculture'
  | 'housing'
  | 'education'
  | 'health'
  | 'social_welfare'
  | 'employment'
  | 'women_children';

/**
 * Normalised representation of a government scheme as it flows through
 * the ingestion pipeline (scrape → embed → upsert).
 */
export interface SchemeRaw {
  /** Official scheme name */
  name: string;
  /** Responsible ministry or department */
  ministry: string;
  /** Broad category matching the DB enum */
  category: SchemeCategory;
  /** State code / name for state-specific schemes; null for central schemes */
  state: string | null;
  /** Short public description */
  description: string;
  /**
   * Full eligibility criteria written in natural language,
   * mirroring the language used in official government notifications.
   * This field is embedded for RAG-based semantic search.
   */
  eligibility_text: string;
  /** Details of what the beneficiary receives */
  benefits_text: string;
  /** List of required supporting documents */
  documents_required: string[];
  /** Official application / scheme portal URL */
  apply_url: string;
}
