/**
 * AI-specific rate limiter middleware
 * Separate from general API rate limiting to allow stricter control over AI usage
 */

import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for AI endpoints
 * Configurable via AI_RATE_LIMIT environment variable
 * Default is high (100/min) for development - lower in production
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: parseInt(process.env.AI_RATE_LIMIT || '100', 10),
  message: { error: 'Too many AI requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  // Use IP + user ID as key when authenticated
  keyGenerator: (req) => {
    const userId = (req as any).user?.id;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return userId ? `ai:${userId}` : `ai:${ip}`;
  },
});
