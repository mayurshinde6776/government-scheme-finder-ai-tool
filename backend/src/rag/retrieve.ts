/**
 * retrieve.ts
 *
 * Retrieves the top-15 most semantically relevant schemes for a user profile
 * by combining:
 *   - pgvector cosine similarity on the embedding column
 *   - SQL metadata filter on state (central + state-specific schemes)
 *
 * Exported:
 *   retrieveSchemes(profile: UserProfile): Promise<SchemeRow[]>
 */

import pool from '../db/index';
import { embed } from '../pipeline/embedder';
import { profileToText } from './profileToText';
import type { UserProfile, SchemeRow } from './types';

const TOP_K = 15;

/**
 * Converts a JS number[] to the Postgres vector literal format:
 *   [0.12345, -0.00123, …]
 */
function toVectorLiteral(vec: number[]): string {
  return `[${vec.join(',')}]`;
}

/**
 * Retrieves the top-K schemes most relevant to the user profile.
 *
 * SQL strategy:
 *   - Filter to active schemes in the user's state OR central (state IS NULL).
 *   - Order by cosine distance (embedding <=> query_vector) ascending.
 *   - LIMIT 15.
 */
export async function retrieveSchemes(profile: UserProfile): Promise<SchemeRow[]> {
  // 1. Build the query text and embed it
  const profileText = profileToText(profile);
  console.log(`[retrieve] Profile text: "${profileText}"`);

  const queryVector = await embed(profileText);
  const vectorLiteral = toVectorLiteral(queryVector);

  // 2. Run the hybrid vector + metadata query
  const sql = `
    SELECT
      id,
      name,
      ministry,
      category,
      state,
      description,
      eligibility_text,
      benefits_text,
      documents_required,
      apply_url,
      is_active,
      created_at,
      updated_at,
      (embedding <=> $1::vector) AS distance
    FROM schemes
    WHERE
      is_active = true
      AND (state = $2 OR state IS NULL)
    ORDER BY distance ASC
    LIMIT ${TOP_K}
  `;

  const { rows } = await pool.query<SchemeRow>(sql, [vectorLiteral, profile.state]);

  console.log(
    `[retrieve] Retrieved ${rows.length} schemes for state="${profile.state}" ` +
      `(top distance: ${rows[0]?.distance?.toFixed(4) ?? 'N/A'})`
  );

  return rows;
}
