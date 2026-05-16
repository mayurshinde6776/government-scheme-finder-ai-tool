import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query<{ vector_enabled: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM pg_extension WHERE extname = 'vector'
       ) AS vector_enabled`
    );
    res.json({
      status: 'ok',
      database: 'connected',
      pgvector: rows[0]?.vector_enabled ?? false,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

app.listen(port, () => {
  console.log(`[backend] listening on http://localhost:${port}`);
});
