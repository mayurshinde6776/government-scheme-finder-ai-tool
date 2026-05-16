import 'dotenv/config';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('[db] DATABASE_URL environment variable is not set');
}

/**
 * Singleton pg Pool instance.
 * Import this everywhere database access is needed — do NOT create new pools.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Keep a reasonable pool size; adjust via env if needed
  max: Number(process.env.DB_POOL_MAX) || 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err.message);
});

pool.on('connect', () => {
  // Useful during startup to confirm connectivity
  if (process.env.NODE_ENV !== 'production') {
    console.log('[db] New client connected to PostgreSQL');
  }
});

export default pool;

/** Convenience helper: run a query and return rows */
export async function query<T extends object = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
) {
  const start = Date.now();
  const result = await pool.query<T>(sql, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[db] query executed in ${duration}ms — rows: ${result.rowCount}`);
  }
  return result;
}
