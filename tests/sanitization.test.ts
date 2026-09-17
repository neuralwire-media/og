import { describe, it, expect } from 'vitest';
import { sanitizeString, OGQuerySchema, parseOGQueryParams } from '../src/schemas/og-query.js';

describe('Sanitization and Validation Schema', () => {
  describe('sanitizeString', () => {
    it('should strip ASCII control characters and non-printables', () => {
      const input = 'Neuralwire\x00\x07\x1B\x7F Test';
      const output = sanitizeString(input, 100);
      expect(output).toBe('Neuralwire Test');
    });

    it('should strip HTML tags and markup injection', () => {
      const input = '<script>alert("xss")</script><b>Bold Headline</b>';
      const output = sanitizeString(input, 100);
      expect(output).toBe('alert("xss")Bold Headline');
      expect(output).not.toContain('<script>');
      expect(output).not.toContain('<b>');
    });

    it('should collapse multiple whitespaces into a single space', () => {
      const input = '  Neuralwire    AI   \n\n  Research  ';
      const output = sanitizeString(input, 100);
      expect(output).toBe('Neuralwire AI Research');
    });

    it('should truncate strings exceeding maxLength', () => {
      const input = 'a'.repeat(200);
      const output = sanitizeString(input, 150);
      expect(output.length).toBe(150);
    });

    it('should handle null, undefined, or empty inputs gracefully', () => {
      expect(sanitizeString('', 50)).toBe('');
      expect(sanitizeString(null as any, 50)).toBe('');
      expect(sanitizeString(undefined as any, 50)).toBe('');
    });
  });

  describe('OGQuerySchema', () => {
    it('should successfully parse valid query params', () => {
      const raw = {
        title: 'Frontier AI Reasoning',
        category: 'Research',
        source: 'ArXiv',
        score: '88',
        read_time: '5 min',
      };

      const parsed = parseOGQueryParams(raw);
      expect(parsed.title).toBe('Frontier AI Reasoning');
      expect(parsed.category).toBe('Research');
      expect(parsed.source).toBe('ArXiv');
      expect(parsed.score).toBe(88);
      expect(parsed.read_time).toBe('5 min');
    });

    it('should assign default values for optional parameters', () => {
      const raw = {
        title: 'Only Title Given',
      };

      const parsed = parseOGQueryParams(raw);
      expect(parsed.title).toBe('Only Title Given');
      expect(parsed.category).toBe('AI & Systems');
      expect(parsed.source).toBe('Neuralwire Editorial');
      expect(parsed.read_time).toBe('3 min');
      expect(parsed.score).toBeUndefined();
    });

    it('should throw error when title is missing or empty', () => {
      expect(() => parseOGQueryParams({})).toThrow();
      expect(() => parseOGQueryParams({ title: '' })).toThrow();
      expect(() => parseOGQueryParams({ title: '   ' })).toThrow();
      expect(() => parseOGQueryParams({ title: '<script></script>' })).toThrow();
    });

    it('should clamp scores between 0 and 100', () => {
      const parsedHigh = parseOGQueryParams({ title: 'Test', score: '150' });
      expect(parsedHigh.score).toBe(100);

      const parsedLow = parseOGQueryParams({ title: 'Test', score: '-20' });
      expect(parsedLow.score).toBe(0);

      const parsedInvalid = parseOGQueryParams({ title: 'Test', score: 'abc' });
      expect(parsedInvalid.score).toBeUndefined();
    });
  });
});
