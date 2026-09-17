import { serve } from '@hono/node-server';
import { app } from './app.js';
import { getLoadedFonts } from './engine/fonts.js';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Pre-load fonts during startup to warm up cache
try {
  console.log('[Neuralwire OG] Pre-loading font assets into memory...');
  getLoadedFonts();
  console.log('[Neuralwire OG] Font assets successfully loaded and cached.');
} catch (err) {
  console.error('[Neuralwire OG] Warning: Failed to pre-load fonts:', err);
}

console.log(`[Neuralwire OG] Starting server on http://${HOST}:${PORT}`);

const server = serve(
  {
    fetch: app.fetch,
    port: PORT,
    hostname: HOST,
  },
  (info) => {
    console.log(`[Neuralwire OG] Server running at http://${info.address}:${info.port}`);
    console.log(`[Neuralwire OG] Playground UI: http://${info.address}:${info.port}/`);
    console.log(`[Neuralwire OG] Health endpoint: http://${info.address}:${info.port}/api/health`);
    console.log(`[Neuralwire OG] Image endpoint: http://${info.address}:${info.port}/api/og?title=Sample`);
  }
);

// Graceful Shutdown
function handleShutdown(signal: string) {
  console.log(`\n[Neuralwire OG] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[Neuralwire OG] Server stopped. Exiting process.');
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
