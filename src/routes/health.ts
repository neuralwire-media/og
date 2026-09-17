import { Hono } from 'hono';

export const healthRouter = new Hono();

const startTime = Date.now();

const healthHandler = (c: any) => {
  return c.json({
    status: 'ok',
    service: 'og',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
  });
};

healthRouter.get('/health', healthHandler);
healthRouter.get('/healthz', healthHandler);
