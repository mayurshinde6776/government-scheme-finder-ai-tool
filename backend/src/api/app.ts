import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health';
import profilesRoutes from './routes/profiles';
import eligibilityRoutes from './routes/eligibility';
import schemesRoutes from './routes/schemes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

// Request parsing
app.use(express.json());

// Logging
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/schemes', schemesRoutes);

// Error handling
app.use(errorHandler);

export default app;
