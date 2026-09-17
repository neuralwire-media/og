import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SatoriOptions } from 'satori';

export type FontConfig = NonNullable<SatoriOptions['fonts']>;

let cachedFonts: FontConfig | null = null;

/**
 * Resolves the path to the assets/fonts directory safely in both ESM and CJS/dist setups.
 */
export function getFontsDirectory(): string {
  // If running from src or dist
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const candidatePaths = [
    path.resolve(currentDir, '../../assets/fonts'),
    path.resolve(currentDir, '../assets/fonts'),
    path.resolve(process.cwd(), 'assets/fonts'),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error(`Fonts directory not found. Searched in: ${candidatePaths.join(', ')}`);
}

/**
 * Loads and caches local TTF font buffers for Satori rendering.
 */
export function getLoadedFonts(): FontConfig {
  if (cachedFonts) {
    return cachedFonts;
  }

  const fontsDir = getFontsDirectory();

  const newsreaderBuffer = fs.readFileSync(path.join(fontsDir, 'Newsreader-SemiBold.ttf'));
  const jetbrainsMonoRegBuffer = fs.readFileSync(path.join(fontsDir, 'JetBrainsMono-Regular.ttf'));
  const jetbrainsMonoBoldBuffer = fs.readFileSync(path.join(fontsDir, 'JetBrainsMono-Bold.ttf'));
  const interSemiBoldBuffer = fs.readFileSync(path.join(fontsDir, 'Inter-SemiBold.ttf'));
  const interBoldBuffer = fs.readFileSync(path.join(fontsDir, 'Inter-Bold.ttf'));

  cachedFonts = [
    {
      name: 'Newsreader',
      data: newsreaderBuffer,
      weight: 600,
      style: 'normal',
    },
    {
      name: 'JetBrains Mono',
      data: jetbrainsMonoRegBuffer,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'JetBrains Mono',
      data: jetbrainsMonoBoldBuffer,
      weight: 700,
      style: 'normal',
    },
    {
      name: 'Inter',
      data: interSemiBoldBuffer,
      weight: 600,
      style: 'normal',
    },
    {
      name: 'Inter',
      data: interBoldBuffer,
      weight: 700,
      style: 'normal',
    },
  ];

  return cachedFonts;
}
