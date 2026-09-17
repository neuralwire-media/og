import type { MiddlewareHandler } from 'hono';

/**
 * Security headers and performance timing middleware.
 */
export function securityHeaders(): MiddlewareHandler {
  return async (c, next) => {
    const start = performance.now();

    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-Frame-Options', 'SAMEORIGIN');
    c.header('X-XSS-Protection', '1; mode=block');
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');

    await next();

    const duration = Math.round(performance.now() - start);
    c.header('Server-Timing', `render;dur=${duration}`);
    c.header('X-Response-Time', `${duration}ms`);
  };
}
