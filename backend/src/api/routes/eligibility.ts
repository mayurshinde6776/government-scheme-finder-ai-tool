import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import pool from '../../db/index';
import { validateBody } from '../middleware/validate';
import { findEligibleSchemes } from '../../rag/index';
import { UserProfile } from '../../rag/types';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const eligibilitySchema = z.object({
  profile_id: z.string().uuid().optional(),
  // Allow inline profile fields for immediate checking without DB insert if needed
  state: z.string().optional(),
  age: z.number().int().min(1).max(130).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  caste_category: z.enum(['general', 'obc', 'sc', 'st']).optional(),
  income_annual: z.number().int().min(0).optional(),
  occupation: z.string().optional(),
  is_disabled: z.boolean().optional(),
  has_bpl_card: z.boolean().optional(),
}).refine(data => data.profile_id || (data.state && data.age && data.gender && data.caste_category && data.income_annual !== undefined && data.occupation && data.is_disabled !== undefined && data.has_bpl_card !== undefined), {
  message: "Provide either profile_id or all inline profile fields",
});

router.post(
  '/',
  validateBody(eligibilitySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const startMs = Date.now();
    try {
      const data = req.body;
      let profile: UserProfile;

      if (data.profile_id) {
        const { rows } = await pool.query<UserProfile>(
          'SELECT * FROM user_profiles WHERE id = $1',
          [data.profile_id]
        );
        if (rows.length === 0) {
          const err: AppError = new Error('Profile not found');
          err.statusCode = 404;
          err.code = 'NOT_FOUND';
          throw err;
        }
        profile = rows[0];
      } else {
        profile = {
          id: 'inline-' + Date.now(),
          session_id: 'inline',
          state: data.state!,
          age: data.age!,
          gender: data.gender!,
          caste_category: data.caste_category!,
          income_annual: data.income_annual!,
          occupation: data.occupation!,
          is_disabled: data.is_disabled!,
          has_bpl_card: data.has_bpl_card!,
        };
      }

      const results = await findEligibleSchemes(profile);
      
      const query_time_ms = Date.now() - startMs;

      res.json({
        results,
        total_found: results.length,
        query_time_ms,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
