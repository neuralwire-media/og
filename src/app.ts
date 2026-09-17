import { Hono } from 'hono';
import { securityHeaders } from './middleware/security.js';
import { rateLimiter } from './middleware/rate-limit.js';
import { healthRouter } from './routes/health.js';
import { ogRouter } from './routes/og.js';
import { playgroundRouter } from './routes/playground.js';

/**
 * Creates and configures the Hono application instance.
 */
export function createApp() {
  const app = new Hono();

  // 1. Global Middleware
  app.use('*', securityHeaders());
  app.use('/api/*', rateLimiter({ max: 120, windowMs: 60_000 }));

  // 2. Route Registration
  app.route('/api', healthRouter);
  app.route('/api', ogRouter);
  app.route('/', playgroundRouter);

  // 3. 404 Handler
  app.notFound((c) => {
    return c.json(
      {
        error: 'Not Found',
        message: `Route ${c.req.method} ${c.req.path} does not exist`,
      },
      404
    );
  });

  // 4. Global Error Handler
  app.onError((err, c) => {
    console.error(`[Unhandled Server Error] ${c.req.method} ${c.req.path}:`, err);
    return c.json(
      {
        error: 'Internal Server Error',
        message: err.message || 'An unexpected error occurred',
      },
      500
    );
  });

  return app;
}

export const app = createApp();
