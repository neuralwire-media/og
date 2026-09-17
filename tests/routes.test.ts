import { describe, it, expect } from 'vitest';
import { app } from '../src/app.js';

describe('HTTP Route Endpoints', () => {
  describe('GET /api/health & GET /api/healthz', () => {
    it('should return 200 and healthy service payload for /api/health', async () => {
      const res = await app.request('/api/health');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe('ok');
      expect(data.service).toBe('og');
      expect(data.timestamp).toBeDefined();
    });

    it('should return 200 and healthy service payload for /api/healthz', async () => {
      const res = await app.request('/api/healthz');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe('ok');
      expect(data.service).toBe('og');
    });
  });

  describe('GET / (Playground UI)', () => {
    it('should return 200 and HTML content for playground UI', async () => {
      const res = await app.request('/');
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('Neuralwire // Dynamic OG Image Studio');
      expect(html).toContain('NEURALWIRE');
      expect(html).toContain('preview-img');
    });
  });

  describe('GET /api/og', () => {
    it('should generate and return a 200 image/png with caching headers', async () => {
      const res = await app.request('/api/og?title=Test%20Headline&category=AI&source=Test%20Src&score=90');
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toBe('image/png');
      expect(res.headers.get('cache-control')).toContain('public');
      expect(res.headers.get('cache-control')).toContain('max-age=86400');
      expect(res.headers.get('cache-control')).toContain('s-maxage=604800');
      expect(res.headers.get('etag')).toBeDefined();
      expect(res.headers.get('x-content-type-options')).toBe('nosniff');

      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      expect(buffer.length).toBeGreaterThan(1000);

      // Verify PNG magic number
      const expectedHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      expect(buffer.subarray(0, 8).equals(expectedHeader)).toBe(true);
    });

    it('should return 304 Not Modified when matching If-None-Match is supplied', async () => {
      // 1. Initial request to get ETag
      const res1 = await app.request('/api/og?title=Cache%20Test%20Title');
      expect(res1.status).toBe(200);
      const etag = res1.headers.get('etag');
      expect(etag).toBeDefined();

      // 2. Request with matching ETag
      const res2 = await app.request('/api/og?title=Cache%20Test%20Title', {
        headers: {
          'if-none-match': etag!,
        },
      });
      expect(res2.status).toBe(304);
      expect(res2.headers.get('etag')).toBe(etag);
    });

    it('should return 400 Bad Request when title parameter is missing', async () => {
      const res = await app.request('/api/og');
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Bad Request');
      expect(data.message).toContain('Title');
    });

    it('should return 400 Bad Request when title is empty', async () => {
      const res = await app.request('/api/og?title=%20%20');
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Bad Request');
    });
  });

  describe('404 Route Handling', () => {
    it('should return 404 JSON for non-existent routes', async () => {
      const res = await app.request('/api/unknown-endpoint');
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe('Not Found');
    });
  });

  describe('Rate Limiting Headers', () => {
    it('should set X-RateLimit headers on API routes', async () => {
      const res = await app.request('/api/health');
      expect(res.headers.get('x-ratelimit-limit')).toBe('120');
      expect(res.headers.get('x-ratelimit-remaining')).toBeDefined();
      expect(res.headers.get('x-ratelimit-reset')).toBeDefined();
    });
  });
});
