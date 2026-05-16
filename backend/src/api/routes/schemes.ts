import { Router, Request, Response, NextFunction } from 'express';
import pool from '../../db/index';
import { SchemeRow } from '../../rag/types';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, state } = req.query;
    let sql = 'SELECT * FROM schemes WHERE is_active = true';
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      sql += ` AND category = $${paramIndex}::scheme_category`;
      params.push(category);
      paramIndex++;
    }

    if (state) {
      sql += ` AND (state = $${paramIndex} OR state IS NULL)`;
      params.push(state);
      paramIndex++;
    }

    sql += ' ORDER BY name ASC';

    const { rows } = await pool.query<SchemeRow>(sql, params);
    
    // Do not return embeddings in API response
    const schemes = rows.map(({ embedding, ...rest }: any) => rest);

    res.json(schemes);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query<SchemeRow>(
      'SELECT * FROM schemes WHERE id = $1',
      [id]
    );

    if (rows.length === 0) {
      const err: AppError = new Error('Scheme not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    const { embedding, ...scheme } = rows[0] as any;
    res.json(scheme);
  } catch (err) {
    next(err);
  }
});

export default router;
