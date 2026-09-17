import { Hono } from 'hono';
import { OGQuerySchema } from '../schemas/og-query.js';
import { renderOGImage } from '../engine/renderer.js';

export const ogRouter = new Hono();

ogRouter.get('/og', async (c) => {
  const query = c.req.query();

  // Validate and sanitize parameters
  const parseResult = OGQuerySchema.safeParse(query);
  if (!parseResult.success) {
    const errorDetails = parseResult.error.errors.map((e) => e.message).join(', ');
    return c.json(
      {
        error: 'Bad Request',
        message: errorDetails,
      },
      400
    );
  }

  const params = parseResult.data;

  try {
    const { buffer, etag, contentType } = await renderOGImage(params);

    // Conditional GET: check If-None-Match header
    const ifNoneMatch = c.req.header('if-none-match');
    if (ifNoneMatch && (ifNoneMatch === etag || ifNoneMatch === `W/${etag}`)) {
      return c.body(null, 304, {
        ETag: etag,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      });
    }

    return c.body(new Uint8Array(buffer), 200, {
      'Content-Type': contentType,
      'Content-Length': String(buffer.length),
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      ETag: etag,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown rendering failure';
    console.error('[OG Engine Error]:', error);
    return c.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to generate OG image',
        details: process.env.NODE_ENV === 'production' ? undefined : errorMessage,
      },
      500
    );
  }
});
