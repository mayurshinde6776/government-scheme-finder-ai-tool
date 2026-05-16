/**
 * migrate.ts
 *
 * Reads every *.sql file from  backend/src/db/migrations/  in lexicographic
 * (numeric-prefix) order, skips files already recorded in schema_migrations,
 * and executes the rest inside individual transactions so a failure is safely
 * rolled back.
 *
 * Usage:
 *   npx ts-node src/db/migrate.ts
 *   -- or via package.json script --
 *   npm run migrate
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pool from './index';

const MIGRATIONS_DIR = path.resolve(__dirname, 'migrations');

async function ensureMigrationsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id          SERIAL      PRIMARY KEY,
      filename    VARCHAR(255) NOT NULL UNIQUE,
      applied_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );
  `);
  console.log('[migrate] schema_migrations table ready');
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const { rows } = await pool.query<{ filename: string }>(
    'SELECT filename FROM schema_migrations ORDER BY id'
  );
  return new Set(rows.map((r) => r.filename));
}

async function runMigration(filename: string, sql: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query(
      'INSERT INTO schema_migrations (filename) VALUES ($1)',
      [filename]
    );
    await client.query('COMMIT');
    console.log(`[migrate] ✓ Applied: ${filename}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`[migrate] ✗ Failed: ${filename}`, err);
    throw err;
  } finally {
    client.release();
  }
}

async function migrate(): Promise<void> {
  console.log('[migrate] Starting database migration…');
  console.log(`[migrate] Migration directory: ${MIGRATIONS_DIR}`);

  // Ensure the migrations directory exists
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    throw new Error(`[migrate] Migrations directory not found: ${MIGRATIONS_DIR}`);
  }

  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  // Collect .sql files and sort them lexicographically (001_, 002_, …)
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('[migrate] No migration files found.');
    return;
  }

  let pendingCount = 0;
  for (const filename of files) {
    if (applied.has(filename)) {
      console.log(`[migrate] – Skipping (already applied): ${filename}`);
      continue;
    }

    const filepath = path.join(MIGRATIONS_DIR, filename);
    const sql = fs.readFileSync(filepath, 'utf8');
    await runMigration(filename, sql);
    pendingCount++;
  }

  if (pendingCount === 0) {
    console.log('[migrate] Database is already up to date.');
  } else {
    console.log(`[migrate] Done — applied ${pendingCount} migration(s).`);
  }

  await pool.end();
}

migrate().catch((err) => {
  console.error('[migrate] Fatal error:', err);
  process.exit(1);
});
