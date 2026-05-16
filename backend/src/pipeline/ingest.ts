/**
 * ingest.ts
 * Main ingestion pipeline entry point.
 *
 * Flow:
 *   1. scrapeSchemes()  → SchemeRaw[]
 *   2. For each scheme:  embed(eligibility_text) → vector
 *   3. Upsert into `schemes` table (ON CONFLICT (name) DO UPDATE)
 *
 * Usage:
 *   npm run ingest
 *   npx ts-node src/pipeline/ingest.ts
 */

import 'dotenv/config';
import pool from '../db/index';
import { scrapeSchemes } from './scraper';
import { embed } from './embedder';
import type { SchemeRaw } from './types';

// How many schemes to embed+upsert concurrently (avoid rate-limit hammering)
const CONCURRENCY = 3;

async function upsertScheme(scheme: SchemeRaw, vector: number[]): Promise<void> {
  // pgvector expects an array literal like '[0.1, 0.2, …]'
  const embeddingLiteral = `[${vector.join(',')}]`;

  await pool.query(
    `INSERT INTO schemes
       (name, ministry, category, state, description,
        eligibility_text, benefits_text, documents_required, apply_url, embedding)
     VALUES ($1, $2, $3::scheme_category, $4, $5, $6, $7, $8, $9, $10::vector)
     ON CONFLICT (name)
     DO UPDATE SET
       ministry           = EXCLUDED.ministry,
       category           = EXCLUDED.category,
       state              = EXCLUDED.state,
       description        = EXCLUDED.description,
       eligibility_text   = EXCLUDED.eligibility_text,
       benefits_text      = EXCLUDED.benefits_text,
       documents_required = EXCLUDED.documents_required,
       apply_url          = EXCLUDED.apply_url,
       embedding          = EXCLUDED.embedding,
       updated_at         = NOW()`,
    [
      scheme.name,
      scheme.ministry,
      scheme.category,
      scheme.state,
      scheme.description,
      scheme.eligibility_text,
      scheme.benefits_text,
      scheme.documents_required,
      scheme.apply_url,
      embeddingLiteral,
    ]
  );
}

/**
 * Process schemes in chunks of `size`, respecting concurrency limits
 * to avoid overwhelming the OpenAI embeddings rate limit.
 */
async function processChunk(
  chunk: Array<{ scheme: SchemeRaw; index: number; total: number }>
): Promise<void> {
  await Promise.all(
    chunk.map(async ({ scheme, index, total }) => {
      console.log(`[ingest] Ingesting scheme ${index}/${total}: ${scheme.name}`);
      try {
        const vector = await embed(scheme.eligibility_text);
        await upsertScheme(scheme, vector);
        console.log(`[ingest] ✓ Done ${index}/${total}: ${scheme.name}`);
      } catch (err) {
        console.error(
          `[ingest] ✗ Failed ${index}/${total}: ${scheme.name} —`,
          err instanceof Error ? err.message : err
        );
        // Do not throw; allow the rest of the pipeline to continue
      }
    })
  );
}

async function ensureUniqueIndex(): Promise<void> {
  // ON CONFLICT (name) requires a unique constraint/index on the name column.
  // Create it if the migration hasn't added it yet.
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS uq_schemes_name ON schemes (name);
  `);
}

async function ingest(): Promise<void> {
  const startTime = Date.now();
  console.log('[ingest] ═══════════════════════════════════════════════');
  console.log('[ingest] Government Scheme RAG — Ingestion Pipeline');
  console.log('[ingest] ═══════════════════════════════════════════════');

  // 1. Ensure unique index exists for upsert
  await ensureUniqueIndex();

  // 2. Scrape
  const schemes = await scrapeSchemes();
  const total = schemes.length;
  console.log(`[ingest] Total schemes to process: ${total}`);

  if (total === 0) {
    console.warn('[ingest] No schemes found. Exiting.');
    await pool.end();
    return;
  }

  // 3. Embed + upsert in concurrent batches
  const items = schemes.map((scheme, i) => ({
    scheme,
    index: i + 1,
    total,
  }));

  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const chunk = items.slice(i, i + CONCURRENCY);
    await processChunk(chunk);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('[ingest] ═══════════════════════════════════════════════');
  console.log(`[ingest] Pipeline complete — ${total} schemes processed in ${elapsed}s`);
  console.log('[ingest] ═══════════════════════════════════════════════');

  await pool.end();
}

ingest().catch((err) => {
  console.error('[ingest] Fatal error:', err);
  process.exit(1);
});
