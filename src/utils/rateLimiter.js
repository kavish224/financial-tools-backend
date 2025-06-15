import rateLimit from 'express-rate-limit';
import { RATE_LIMITS } from '../constants.js';
import { logger } from './logger.js';

const createLimiter = (options, message = 'Too many requests') => {
  return rateLimit({
    ...options,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path
      });
      res.status(429).json({ success: false, message });
    }
  });
};

export const rateLimiters = {
  default: createLimiter(RATE_LIMITS.DEFAULT),
  auth: createLimiter(RATE_LIMITS.AUTH, 'Too many authentication attempts'),
  api: createLimiter(RATE_LIMITS.API, 'API rate limit exceeded')
};