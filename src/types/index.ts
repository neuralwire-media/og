/**
 * Core type definitions for Neuralwire Open Graph Image Generation Service
 */

export interface OGQueryParams {
  title: string;
  category?: string;
  source?: string;
  score?: number | string;
  read_time?: string;
}

export interface SanitizedOGParams {
  title: string;
  category: string;
  source: string;
  score?: number;
  read_time: string;
  dateStr?: string;
}

export interface RenderResult {
  buffer: Buffer;
  etag: string;
  svg: string;
  width: number;
  height: number;
  contentType: string;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  service: 'og';
  timestamp?: string;
  uptime?: number;
}
