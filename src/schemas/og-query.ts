import { z } from 'zod';
import type { SanitizedOGParams } from '../types/index.js';

/**
 * Sanitizes input string by stripping ASCII control characters, HTML tags,
 * and normalizing excessive whitespace while preserving unicode text and emojis.
 */
export function sanitizeString(input: string, maxLength: number): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    // Strip control characters except newline and tab
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Strip HTML tags to avoid markup injection in rendering
    .replace(/<[^>]*>?/gm, '')
    // Replace multiple spaces with a single space
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Zod schema for validating and transforming GET /api/og query parameters.
 */
export const OGQuerySchema = z.object({
  title: z
    .string({
      required_error: 'Title parameter is required',
      invalid_type_error: 'Title must be a string',
    })
    .min(1, { message: 'Title cannot be empty' })
    .transform((val) => sanitizeString(val, 150))
    .refine((val) => val.length > 0, { message: 'Title cannot be empty after sanitization' }),

  category: z
    .string()
    .optional()
    .default('AI & Systems')
    .transform((val) => sanitizeString(val, 50) || 'AI & Systems'),

  source: z
    .string()
    .optional()
    .default('Neuralwire Editorial')
    .transform((val) => sanitizeString(val, 60) || 'Neuralwire Editorial'),

  score: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const num = typeof val === 'number' ? val : Number.parseInt(String(val), 10);
      if (Number.isNaN(num)) return undefined;
      return Math.max(0, Math.min(100, Math.round(num)));
    }),

  read_time: z
    .string()
    .optional()
    .default('3 min')
    .transform((val) => sanitizeString(val, 30) || '3 min'),
});

/**
 * Parses and validates raw URL query parameters.
 */
export function parseOGQueryParams(rawQuery: Record<string, unknown>): SanitizedOGParams {
  const result = OGQuerySchema.safeParse(rawQuery);
  if (!result.success) {
    const firstError = result.error.errors[0]?.message || 'Invalid query parameters';
    throw new Error(firstError);
  }
  return result.data as SanitizedOGParams;
}
