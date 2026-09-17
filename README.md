# Neuralwire Dynamic Open Graph (OG) Generator

[![Build Status](https://img.shields.io/badge/status-active-10B981.svg?style=flat-square)](https://neuralwire.info)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/Hono-4.7-E36002.svg?style=flat-square&logo=hono&logoColor=white)](https://hono.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22D3EE.svg?style=flat-square)](LICENSE)

A blazing fast, standalone Dynamic Open Graph (OG) Image Generation microservice built for **[Neuralwire](https://neuralwire.info)**. Generates branded, high-resolution **1200 × 630** social preview cards on-the-fly featuring an **Editorial Cyberpunk / Technical Dark Mode** visual identity.

---

## ⚡ Key Highlights

- **Zero-Chromium Architecture**: Powered by **[Satori](https://github.com/vercel/satori)** (JSX to SVG flexbox layout) and **[@resvg/resvg-js](https://github.com/RazrFalcon/resvg-js)** (Rust-based SVG-to-PNG rasterizer). Renders cards in **~15–40ms** with minimal memory footprint.
- **Embedded Static Fonts**: Preloads and caches *Newsreader (Editorial Serif)*, *JetBrains Mono (Technical Monospace)*, and *Inter (Modern Sans)* directly in memory for sub-millisecond layout calculations without external network dependencies.
- **Production-Grade HTTP Caching**: Deterministic SHA-256 `ETag` validation with `304 Not Modified` support, `Cache-Control: public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400`.
- **Interactive Studio Playground**: Built-in visual playground UI at `/` with real-time side-by-side previews, quick presets, character limit counters, copyable meta tags, and instant PNG downloads.
- **Reliability & Security**: Zod input validation, XSS and ASCII control character sanitization, parameter length constraints, and in-memory sliding window rate limiting.
- **Multi-Runtime Ready**: Fully compatible with Node.js 20+, Bun, and multi-stage containerized deployments.

---

## 🎨 Visual Specifications

| Component | Specification |
|---|---|
| **Canvas Size** | Exactly `1200 × 630` pixels (`1.91:1` standard social aspect ratio) |
| **Palette** | Background `#0A0E17`, Cyber Cyan `#22D3EE`, Emerald Green `#10B981`, Slate `#94A3B8`, White `#F8FAFC` |
| **Header** | `NEURALWIRE` logo mark with pulsing cyan glow dot + live formatted issue date `[DD MMM YYYY]` |
| **Category Pill** | Monospace uppercase tag e.g. `// RESEARCH & SYSTEMS`, `// HARDWARE & CHIPS` |
| **Headline** | Newsreader Editorial Serif auto-scaled to max 3 lines with graceful clamp |
| **Footer Bar** | Source attribution (`SRC // ...`), Read time (`TIME // X MIN READ`), Impact Score badge (`IMPACT SCORE: 94/100`), domain watermark (`› neuralwire.info`) |

---

## 🚀 Quick Start

### 1. Local Development (Node.js & npm)

```bash
# Clone the repository
git clone https://github.com/neuralwire-media/og.git
cd og

# Install dependencies
npm install

# Start development server with live reload
npm run dev
```

Visit **`http://localhost:3000`** in your browser to open the interactive studio playground.

### 2. Local Development (Bun)

```bash
# Install dependencies
bun install

# Run server
bun run src/index.ts
```

### 3. Running via Docker & Docker Compose

```bash
# Build and run with Docker Compose
docker compose up --build -d

# Inspect health status
curl http://localhost:3000/api/health
```

---

## 📡 API Reference

### 1. `GET /api/og` (Generate OG Image)

Generates a 1200x630 PNG preview card.

#### Query Parameters

| Parameter | Type | Required | Default | Constraints / Description |
|---|---|---|---|---|
| `title` | `string` | **Yes** | — | Headline text (max 150 characters, auto-sanitized). |
| `category` | `string` | No | `AI & Systems` | Monospace category pill (max 50 characters). |
| `source` | `string` | No | `Neuralwire Editorial` | Attribution badge text (max 60 characters). |
| `score` | `number` | No | *None* | Impact score `0–100` (renders emerald/cyan/amber badge). |
| `read_time` | `string` | No | `3 min` | Estimated reading duration (e.g. `4 min`, `10 min`). |

#### Response Headers

```http
HTTP/1.1 200 OK
Content-Type: image/png
Content-Length: 217718
Cache-Control: public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400
ETag: "fac2a4f2841c458953af6ac0"
X-Content-Type-Options: nosniff
Server-Timing: render;dur=22
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 119
```

#### Example Requests

```bash
# Minimal request
curl "http://localhost:3000/api/og?title=Frontier%20AI%20Reasoning%20Benchmarks" -o card.png

# Full parameter request
curl "http://localhost:3000/api/og?title=Autonomous%20Agent%20Swarms%3A%20Emergence%20of%20Collective%20Intelligence&category=Research&source=MIT%20Technology%20Review&score=94&read_time=4%20min" -o preview.png
```

---

### 2. `GET /api/health` & `GET /api/healthz`

Returns microservice operational status, uptime, and timestamp.

```json
{
  "status": "ok",
  "service": "og",
  "uptime": 142,
  "timestamp": "2026-09-17T12:00:00.000Z"
}
```

---

### 3. `GET /` (Studio Playground)

Interactive web playground featuring:
- Real-time side-by-side card rendering.
- Quick preset buttons (*Agent Swarms*, *Neuromorphic*, *Frontier Models*, *Decentralized AI*).
- Form inputs for title, category, source, score, and read time.
- Direct URL generator, HTML `<meta>` tag generator, and Markdown code snippets.
- One-click PNG image download.

---

## 🛠️ HTML & Meta Tag Integration

### HTML `<head>` Integration

```html
<meta property="og:title" content="Autonomous Agent Swarms: Emergence of Collective Intelligence" />
<meta property="og:type" content="article" />
<meta property="og:image" content="https://og.neuralwire.info/api/og?title=Autonomous%20Agent%20Swarms%3A%20Emergence%20of%20Collective%20Intelligence&category=Research&source=MIT%20Technology%20Review&score=94&read_time=4%20min" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://og.neuralwire.info/api/og?title=Autonomous%20Agent%20Swarms%3A%20Emergence%20of%20Collective%20Intelligence&category=Research&source=MIT%20Technology%20Review&score=94&read_time=4%20min" />
```

### Next.js App Router Helper

```typescript
export function generateMetadata({ article }: { article: Article }): Metadata {
  const ogUrl = new URL('https://og.neuralwire.info/api/og');
  ogUrl.searchParams.set('title', article.title);
  ogUrl.searchParams.set('category', article.category);
  ogUrl.searchParams.set('source', article.source);
  if (article.impactScore) ogUrl.searchParams.set('score', String(article.impactScore));
  if (article.readingTime) ogUrl.searchParams.set('read_time', article.readingTime);

  return {
    title: article.title,
    openGraph: {
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          type: 'image/png',
        },
      ],
    },
  };
}
```

---

## 🧪 Testing

The repository includes comprehensive unit and integration tests powered by **Vitest**:

```bash
# Run test suite
npm run test

# Run tests in watch mode
npm run test:watch

# Run TypeScript type check
npm run typecheck
```

Test coverage includes:
- **Engine Tests**: Font loading, deterministic ETag generation, 1200x630 dimension verification, PNG binary magic header verification (`0x89504E470D0A1A0A`), dynamic score color tiers.
- **Sanitization Tests**: Control character stripping, HTML/XSS injection neutralization, whitespace normalization, parameter length bounds, score boundary clamping.
- **Route Tests**: `GET /api/health`, `GET /api/healthz`, `GET /api/og` (status 200, caching headers, 304 Not Modified, 400 validation errors), `GET /` playground UI, 404 handling, and rate limiter headers.

---

## 🐳 Production Deployment

### Multi-Stage Dockerfile Overview

The provided `Dockerfile` utilizes a two-stage build:
1. **Builder Stage (`node:22-alpine`)**: Installs build dependencies, compiles TypeScript to `dist/`, and prunes dev packages.
2. **Runner Stage (`node:22-alpine`)**: Runs as non-root user `nodejs` (`uid: 10001`), containing only production artifacts and font assets. Image footprint is **< 150MB**.

```bash
# Build standalone Docker image
docker build -t neuralwire/og:latest .

# Run container
docker run -d -p 3000:3000 --name neuralwire-og neuralwire/og:latest
```

---

## 🔄 CI/CD & Branch Protection

The repository includes GitHub Actions CI/CD workflows tailored to the `Main Branch Protection` ruleset:

### 1. Continuous Integration (`.github/workflows/ci.yml`)
- **Intelligent Path Filtering (`dorny/paths-filter@v3`)**: Detects modifications to code (`src/**`, `assets/**`, `tests/**`, dependencies, configs) vs Docker assets vs documentation. Documentation-only updates bypass resource-heavy testing suites automatically.
- **Type Checking**: Runs TypeScript verification with `tsc --noEmit`.
- **Test Matrix**: Executes Vitest suite across Node.js `20.x` and `22.x`.
- **Docker Validation**: Builds container image and runs container healthcheck test against `/api/health`.
- **Strict Status Check Gatekeeper (`CI / Required Status Checks`)**: Evaluates all sub-jobs and provides a unified required check compatible with GitHub's `strict_required_status_checks_policy: true`.

### 2. Continuous Delivery (`.github/workflows/cd.yml`)
- **Container Registry Publishing**: Automatically builds and pushes multi-architecture container images (`linux/amd64`, `linux/arm64`) to GitHub Container Registry (`ghcr.io/neuralwire-media/og`) upon release or merge to `main`.
- **Automated VPS Deployment (SSH)**: Connects to the host using organization secrets (`VPS_HOST`, `VPS_USERNAME`, `VPS_SSH_KEY`, and optional `VPS_PORT`), pulls the fresh image, gracefully replaces the running container `neuralwire-og`, and validates the `/api/health` check endpoint.

---

## 📁 Repository Structure

```
neuralwire/og/
├── assets/
│   └── fonts/
│       ├── Newsreader-SemiBold.ttf    # Editorial Headline Serif
│       ├── JetBrainsMono-Regular.ttf  # Technical Monospace
│       ├── JetBrainsMono-Bold.ttf     # Monospace Bold
│       ├── Inter-SemiBold.ttf         # Modern Sans SemiBold
│       └── Inter-Bold.ttf             # Modern Sans Bold
├── src/
│   ├── index.ts                       # Server bootstrap & process lifecycle
│   ├── app.ts                         # Hono application pipeline
│   ├── engine/
│   │   ├── fonts.ts                   # In-memory font loader & cache
│   │   ├── template.tsx               # Satori JSX 1200x630 Cyberpunk Template
│   │   └── renderer.ts                # Satori + Resvg pipeline with ETag hashing
│   ├── routes/
│   │   ├── og.ts                      # GET /api/og route with caching & validation
│   │   ├── health.ts                  # GET /api/health and /api/healthz
│   │   └── playground.ts              # GET / Studio Playground UI
│   ├── middleware/
│   │   ├── rate-limit.ts              # Sliding window rate limiter
│   │   └── security.ts                # Security & timing headers
│   ├── schemas/
│   │   └── og-query.ts                # Zod query schema & sanitization
│   └── types/
│       └── index.ts                   # TypeScript interfaces
├── tests/
│   ├── engine.test.ts                 # Unit tests for rendering & fonts
│   ├── routes.test.ts                 # Route integration tests & caching
│   └── sanitization.test.ts           # XSS, length & security tests
├── Dockerfile                         # Multi-stage production container build
├── compose.yml                        # Docker Compose service definition
├── .dockerignore
├── .gitignore
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## 📄 License

MIT License © 2026 [Neuralwire Media](https://neuralwire.info). All rights reserved.
