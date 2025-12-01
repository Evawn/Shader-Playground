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
  // Use user ID as key when authenticated, otherwise fall back to default IP handling
  keyGenerator: (req) => {
    const userId = (req as any).user?.id;
    if (userId) {
      return `ai:${userId}`;
    }
    // Return undefined to let express-rate-limit use its default IP-based key generator
    // which properly handles IPv6 addresses
    return req.ip ?? 'unknown';
  },
  validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },
});
