import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import pool from '../../db/index';
import { validateBody } from '../middleware/validate';
import { UserProfile } from '../../rag/types';

const router = Router();

const profileSchema = z.object({
  state: z.string().min(1),
  age: z.number().int().min(1).max(130),
  gender: z.enum(['male', 'female', 'other']),
  caste_category: z.enum(['general', 'obc', 'sc', 'st']),
  income_annual: z.number().int().min(0),
  occupation: z.string().min(1),
  is_disabled: z.boolean(),
  has_bpl_card: z.boolean(),
});

router.post(
  '/',
  validateBody(profileSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const session_id = nanoid();

      const { rows } = await pool.query<{ id: string }>(
        `INSERT INTO user_profiles
           (session_id, state, age, gender, caste_category, income_annual, occupation, is_disabled, has_bpl_card)
         VALUES
           ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [
          session_id,
          data.state,
          data.age,
          data.gender,
          data.caste_category,
          data.income_annual,
          data.occupation,
          data.is_disabled,
          data.has_bpl_card,
        ]
      );

      res.status(201).json({
        profile_id: rows[0].id,
        session_id,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
