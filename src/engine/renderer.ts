import crypto from 'node:crypto';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { SanitizedOGParams, RenderResult } from '../types/index.js';
import { getLoadedFonts } from './fonts.js';
import { OGTemplate } from './template.js';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/**
 * Computes a strong deterministic ETag hash for an image buffer or parameter set.
 */
export function generateETag(buffer: Buffer): string {
  const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 24);
  return `"${hash}"`;
}

/**
 * Renders the OG preview card to SVG and rasterizes it to a high-resolution PNG buffer.
 */
export async function renderOGImage(params: SanitizedOGParams): Promise<RenderResult> {
  const fonts = getLoadedFonts();

  // 1. Generate JSX element
  const element = OGTemplate(params);

  // 2. Generate SVG with Satori
  const svg = await satori(element as any, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  });

  // 3. Rasterize SVG to PNG using @resvg/resvg-js
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: OG_WIDTH,
    },
    shapeRendering: 2, // geometricPrecision
    textRendering: 1,  // optimizeLegibility
    imageRendering: 0, // optimizeQuality
  });

  const pngData = resvg.render();
  const pngBuffer = Buffer.from(pngData.asPng());
  const etag = generateETag(pngBuffer);

  return {
    buffer: pngBuffer,
    etag,
    svg,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    contentType: 'image/png',
  };
}
