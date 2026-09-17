import type { MiddlewareHandler } from 'hono';

interface RateLimitRecord {
  timestamps: number[];
}

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 60,000ms = 1 minute)
  max?: number;      // Maximum requests per windowMs (default: 120)
  skipFailedRequests?: boolean;
}

/**
 * Creates an in-memory sliding window rate limiting middleware.
 */
export function rateLimiter(options: RateLimitOptions = {}): MiddlewareHandler {
  const windowMs = options.windowMs ?? 60_000;
  const max = options.max ?? 120;
  const hits = new Map<string, RateLimitRecord>();

  // Periodically clean up expired entries every 2 minutes
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (record.timestamps.length === 0) {
        hits.delete(key);
      }
    }
  }, 120_000);

  // Allow node process to exit cleanly without waiting for interval
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return async (c, next) => {
    // Check if client requested bypass in test environment
    if (process.env.NODE_ENV === 'test' && c.req.header('x-bypass-ratelimit') === 'true') {
      return next();
    }

    // Determine client identifier (Forwarded-For, Real-IP, or default fallback)
    const ip =
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
      c.req.header('x-real-ip') ||
      '127.0.0.1';

    const now = Date.now();
    let record = hits.get(ip);

    if (!record) {
      record = { timestamps: [] };
      hits.set(ip, record);
    }

    // Filter out timestamps older than the sliding window
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    const currentCount = record.timestamps.length;
    const remaining = Math.max(0, max - currentCount);
    const resetTime = Math.ceil(((record.timestamps[0] ?? now) + windowMs - now) / 1000);

    // Set standard rate limit headers
    c.header('X-RateLimit-Limit', String(max));
    c.header('X-RateLimit-Remaining', String(remaining));
    c.header('X-RateLimit-Reset', String(Math.max(1, resetTime)));

    if (currentCount >= max) {
      c.header('Retry-After', String(Math.max(1, resetTime)));
      return c.json(
        {
          error: 'Too Many Requests',
          message: `Rate limit of ${max} requests per ${windowMs / 1000}s exceeded. Try again in ${Math.max(1, resetTime)}s.`,
        },
        429
      );
    }

    record.timestamps.push(now);
    await next();
  };
}
