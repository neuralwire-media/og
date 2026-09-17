import { describe, it, expect } from 'vitest';
import { renderOGImage, generateETag, OG_WIDTH, OG_HEIGHT } from '../src/engine/renderer.js';
import { getLoadedFonts } from '../src/engine/fonts.js';

describe('Rendering Engine', () => {
  it('should load all required fonts into memory', () => {
    const fonts = getLoadedFonts();
    expect(fonts).toBeDefined();
    expect(fonts.length).toBeGreaterThanOrEqual(3);

    const fontNames = fonts.map((f) => f.name);
    expect(fontNames).toContain('Newsreader');
    expect(fontNames).toContain('JetBrains Mono');
    expect(fontNames).toContain('Inter');
  });

  it('should generate deterministic ETag hashes', () => {
    const testBuf = Buffer.from('neuralwire-test-buffer');
    const etag1 = generateETag(testBuf);
    const etag2 = generateETag(testBuf);

    expect(etag1).toBe(etag2);
    expect(etag1.startsWith('"')).toBe(true);
    expect(etag1.endsWith('"')).toBe(true);
  });

  it('should render a valid 1200x630 PNG buffer', async () => {
    const result = await renderOGImage({
      title: 'Autonomous Agent Swarms: Emergence of Collective Intelligence',
      category: 'Research & Systems',
      source: 'MIT Technology Review',
      score: 94,
      read_time: '4 min',
      dateStr: '17 SEP 2026',
    });

    expect(result).toBeDefined();
    expect(result.width).toBe(OG_WIDTH);
    expect(result.height).toBe(OG_HEIGHT);
    expect(result.contentType).toBe('image/png');
    expect(result.etag).toBeDefined();
    expect(result.svg).toContain('svg');

    // Verify PNG magic header bytes: 0x89 'P' 'N' 'G' 0x0D 0x0A 0x1A 0x0A
    const header = result.buffer.subarray(0, 8);
    const expectedHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(header.equals(expectedHeader)).toBe(true);

    // PNG dimensions check in IHDR chunk (bytes 16-23: width & height in big-endian)
    const width = result.buffer.readUInt32BE(16);
    const height = result.buffer.readUInt32BE(20);
    expect(width).toBe(1200);
    expect(height).toBe(630);
  });

  it('should render correctly with optional parameters omitted', async () => {
    const result = await renderOGImage({
      title: 'Minimal Title Only Test',
      category: 'AI & Systems',
      source: 'Neuralwire Editorial',
      read_time: '3 min',
    });

    expect(result.buffer.length).toBeGreaterThan(1000);
    expect(result.contentType).toBe('image/png');
  });

  it('should handle different score tiers appropriately in template', async () => {
    // High score >= 80 (Emerald: #10B981)
    const highResult = await renderOGImage({
      title: 'High Score Article',
      category: 'AI',
      source: 'Neuralwire',
      score: 95,
      read_time: '5 min',
    });
    expect(highResult.buffer.length).toBeGreaterThan(1000);
    expect(highResult.svg).toMatch(/#10B981|rgb\(16,\s*185,\s*129\)/i);

    // Mid score 50-79 (Cyan: #22D3EE)
    const midResult = await renderOGImage({
      title: 'Mid Score Article',
      category: 'AI',
      source: 'Neuralwire',
      score: 65,
      read_time: '5 min',
    });
    expect(midResult.buffer.length).toBeGreaterThan(1000);
    expect(midResult.svg).toMatch(/#22D3EE|rgb\(34,\s*211,\s*238\)/i);

    // Low score < 50 (Amber: #F59E0B)
    const lowResult = await renderOGImage({
      title: 'Low Score Article',
      category: 'AI',
      source: 'Neuralwire',
      score: 35,
      read_time: '5 min',
    });
    expect(lowResult.buffer.length).toBeGreaterThan(1000);
    expect(lowResult.svg).toMatch(/#F59E0B|rgb\(245,\s*158,\s*11\)/i);
  });
});
