import { Router, Request, Response } from 'express';
import pool from '../../db/index';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query<{ vector_enabled: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM pg_extension WHERE extname = 'vector'
       ) AS vector_enabled`
    );
    res.json({
      status: 'ok',
      db: rows[0]?.vector_enabled ? 'connected' : 'error',
      version: '1.0.0',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      db: 'error',
      version: '1.0.0',
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

export default router;
