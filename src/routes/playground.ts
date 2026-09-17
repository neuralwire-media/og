import { Hono } from 'hono';

export const playgroundRouter = new Hono();

const playgroundHTML = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neuralwire // Dynamic OG Image Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #070a10;
      --panel-bg: rgba(13, 19, 33, 0.85);
      --panel-border: rgba(255, 255, 255, 0.08);
      --cyan: #22D3EE;
      --cyan-glow: rgba(34, 211, 238, 0.25);
      --emerald: #10B981;
      --slate-dark: #1E293B;
      --slate-muted: #64748B;
      --slate-light: #94A3B8;
      --text-white: #F8FAFC;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-white);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-image: 
        radial-gradient(circle at 95% 5%, rgba(34, 211, 238, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 5% 95%, rgba(99, 102, 241, 0.06) 0%, transparent 45%),
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
    }

    /* Top Navigation */
    header {
      border-bottom: 1px solid var(--panel-border);
      background: rgba(10, 14, 23, 0.9);
      backdrop-filter: blur(12px);
      padding: 16px 40px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-inner {
      max-width: 1920px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .brand-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--cyan);
      box-shadow: 0 0 12px var(--cyan), 0 0 20px var(--cyan-glow);
      animation: pulse 2.5s infinite ease-in-out;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
    }

    .brand-title {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 18px;
      letter-spacing: 0.15em;
      color: var(--text-white);
    }

    .brand-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.08em;
      color: var(--cyan);
      background: rgba(34, 211, 238, 0.1);
      border: 1px solid rgba(34, 211, 238, 0.3);
      padding: 2px 8px;
      border-radius: 2px;
    }

    .header-links {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .nav-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: var(--slate-light);
      text-decoration: none;
      transition: color 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .nav-link:hover {
      color: var(--cyan);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--emerald);
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 12px;
      border-radius: 9999px;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--emerald);
      box-shadow: 0 0 6px var(--emerald);
    }

    /* Main Workspace */
    main {
      flex: 1;
      max-width: 1920px;
      width: 100%;
      margin: 0 auto;
      padding: 32px 40px 64px 40px;
      display: grid;
      grid-template-columns: minmax(380px, 460px) minmax(0, 1fr);
      gap: 36px;
      align-items: start;
      box-sizing: border-box;
    }

    @media (max-width: 1200px) {
      main {
        grid-template-columns: 1fr;
        padding: 24px 20px 48px 20px;
        gap: 24px;
      }
      header {
        padding: 16px 20px;
      }
      footer {
        padding: 20px 20px;
      }
    }

    @media (min-width: 1800px) {
      main {
        grid-template-columns: 500px minmax(0, 1fr);
        gap: 48px;
        padding: 40px 48px 80px 48px;
      }
      header {
        padding: 18px 48px;
      }
      footer {
        padding: 24px 48px;
      }
    }

    /* Panels */
    .card-panel {
      background: var(--panel-bg);
      border: 1px solid var(--panel-border);
      border-radius: 12px;
      padding: 24px;
      backdrop-filter: blur(16px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
      min-width: 0;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--panel-border);
      padding-bottom: 14px;
    }

    .panel-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--cyan);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Preset Buttons */
    .preset-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .preset-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.05em;
      color: var(--slate-muted);
      text-transform: uppercase;
    }

    .preset-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .preset-chip {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--panel-border);
      color: var(--slate-light);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      cursor: pointer;
      transition: all 0.2s;
    }

    .preset-chip:hover {
      background: rgba(34, 211, 238, 0.1);
      border-color: rgba(34, 211, 238, 0.4);
      color: var(--cyan);
    }

    /* Form Fields */
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .form-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 600;
      color: var(--slate-light);
      letter-spacing: 0.05em;
    }

    .char-count {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--slate-muted);
    }

    .form-control {
      width: 100%;
      background: rgba(10, 14, 23, 0.8);
      border: 1px solid var(--panel-border);
      border-radius: 8px;
      padding: 12px 14px;
      color: var(--text-white);
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
      outline: none;
    }

    .form-control:focus {
      border-color: var(--cyan);
      box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.15);
    }

    textarea.form-control {
      resize: vertical;
      min-height: 80px;
      line-height: 1.5;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    /* Score Slider */
    .slider-row {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    input[type=range] {
      flex: 1;
      accent-color: var(--cyan);
      cursor: pointer;
    }

    .score-badge-val {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 13px;
      color: var(--emerald);
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 10px;
      border-radius: 4px;
      min-width: 60px;
      text-align: center;
    }

    /* Preview Section */
    .preview-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .preview-canvas-wrapper {
      position: relative;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--panel-border);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
      background: #0A0E17;
      aspect-ratio: 1200 / 630;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      transition: opacity 0.2s ease-in-out;
    }

    .preview-img.loading {
      opacity: 0.4;
      filter: blur(2px);
    }

    .preview-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 36px;
      height: 36px;
      border: 3px solid rgba(34, 211, 238, 0.2);
      border-top-color: var(--cyan);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: none;
      z-index: 10;
    }

    .preview-spinner.visible {
      display: block;
    }

    @keyframes spin {
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    .preview-meta-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding: 10px 14px;
      background: rgba(10, 14, 23, 0.6);
      border: 1px solid var(--panel-border);
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--slate-light);
    }

    .meta-stat {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .meta-stat span.highlight {
      color: var(--cyan);
      font-weight: 700;
    }

    /* Output Integration Snippets */
    .output-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .snippet-box {
      background: rgba(10, 14, 23, 0.9);
      border: 1px solid var(--panel-border);
      border-radius: 8px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .snippet-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #E2E8F0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      user-select: all;
    }

    /* Action Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
      text-decoration: none;
      white-space: nowrap;
    }

    .btn-cyan {
      background: var(--cyan);
      color: #0A0E17;
      border-color: var(--cyan);
    }

    .btn-cyan:hover {
      background: #38BDF8;
      box-shadow: 0 0 16px rgba(34, 211, 238, 0.4);
    }

    .btn-outline {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--panel-border);
      color: var(--text-white);
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 10px;
    }

    /* API Documentation Table */
    .api-docs-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 8px;
    }

    .api-docs-table th, .api-docs-table td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid var(--panel-border);
    }

    .api-docs-table th {
      font-family: 'JetBrains Mono', monospace;
      color: var(--slate-muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .api-docs-table td code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--cyan);
      background: rgba(34, 211, 238, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* Footer */
    footer {
      border-top: 1px solid var(--panel-border);
      padding: 24px 40px;
      color: var(--slate-muted);
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
    }

    .footer-inner {
      max-width: 1920px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header>
    <div class="header-inner">
      <a href="/" class="brand">
        <div class="brand-dot"></div>
        <div class="brand-title">NEURALWIRE</div>
        <div class="brand-badge">OG ENGINE v1.0</div>
      </a>

      <div class="header-links">
        <div class="status-indicator">
          <div class="status-dot"></div>
          <span>ENGINE OPERATIONAL</span>
        </div>
        <a href="/api/health" class="nav-link" target="_blank">// HEALTH</a>
        <a href="https://neuralwire.info" class="nav-link" target="_blank">NEURALWIRE.INFO ↗</a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main>
    <!-- Left Configuration Panel -->
    <div class="card-panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>//</span>
          <span>CARD PARAMETERS</span>
        </div>
      </div>

      <!-- Presets -->
      <div class="preset-container">
        <div class="preset-label">Quick Presets</div>
        <div class="preset-chips">
          <button class="preset-chip" onclick="applyPreset('swarm')">Agent Swarms</button>
          <button class="preset-chip" onclick="applyPreset('silicon')">Neuromorphic</button>
          <button class="preset-chip" onclick="applyPreset('frontier')">Frontier Models</button>
          <button class="preset-chip" onclick="applyPreset('crypto')">Decentralized AI</button>
        </div>
      </div>

      <!-- Form Inputs -->
      <form id="og-form" onsubmit="event.preventDefault();">
        <div class="form-group" style="margin-bottom: 16px;">
          <div class="form-label-row">
            <label for="title-input" class="form-label">Headline / Title *</label>
            <span id="title-count" class="char-count">0 / 150</span>
          </div>
          <textarea
            id="title-input"
            class="form-control"
            maxlength="150"
            rows="3"
            placeholder="e.g. Autonomous Agent Swarms: Emergence of Collective Intelligence in Complex Environments"
          >Autonomous Agent Swarms: Emergence of Collective Intelligence in Complex Environments</textarea>
        </div>

        <div class="form-row" style="margin-bottom: 16px;">
          <div class="form-group">
            <label for="category-input" class="form-label">Category Tag</label>
            <input
              id="category-input"
              class="form-control"
              type="text"
              maxlength="50"
              value="Research & Systems"
              placeholder="e.g. AI & Systems"
            />
          </div>
          <div class="form-group">
            <label for="source-input" class="form-label">Source Attribution</label>
            <input
              id="source-input"
              class="form-control"
              type="text"
              maxlength="60"
              value="MIT Technology Review"
              placeholder="e.g. Neuralwire Editorial"
            />
          </div>
        </div>

        <div class="form-row" style="margin-bottom: 16px;">
          <div class="form-group">
            <label for="read-time-input" class="form-label">Read Time</label>
            <input
              id="read-time-input"
              class="form-control"
              type="text"
              maxlength="30"
              value="4 min"
              placeholder="e.g. 5 min"
            />
          </div>
          <div class="form-group">
            <div class="form-label-row">
              <label for="score-slider" class="form-label">Impact Score</label>
              <span id="score-val" class="score-badge-val">94/100</span>
            </div>
            <div class="slider-row">
              <input
                id="score-slider"
                type="range"
                min="0"
                max="100"
                value="94"
              />
            </div>
          </div>
        </div>
      </form>

      <!-- API Quick Reference -->
      <div class="panel-header" style="margin-top: 10px;">
        <div class="panel-title">
          <span>//</span>
          <span>API SPECIFICATION</span>
        </div>
      </div>

      <table class="api-docs-table">
        <thead>
          <tr>
            <th>Param</th>
            <th>Type</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>title</code></td>
            <td>string (req)</td>
            <td>Max 150 chars</td>
          </tr>
          <tr>
            <td><code>category</code></td>
            <td>string</td>
            <td>AI & Systems</td>
          </tr>
          <tr>
            <td><code>source</code></td>
            <td>string</td>
            <td>Neuralwire Editorial</td>
          </tr>
          <tr>
            <td><code>score</code></td>
            <td>number (0-100)</td>
            <td>Optional</td>
          </tr>
          <tr>
            <td><code>read_time</code></td>
            <td>string</td>
            <td>3 min</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Right Live Preview Panel -->
    <div class="card-panel preview-container">
      <div class="panel-header">
        <div class="panel-title">
          <span>//</span>
          <span>LIVE PREVIEW & EXPORT</span>
        </div>
        <div class="actions-grid" style="grid-template-columns: auto auto;">
          <button class="btn btn-cyan" onclick="downloadImage()">Download PNG</button>
        </div>
      </div>

      <!-- Preview Image Wrapper -->
      <div class="preview-canvas-wrapper">
        <div id="preview-spinner" class="preview-spinner"></div>
        <img
          id="preview-img"
          class="preview-img"
          src=""
          alt="Neuralwire Dynamic OG Card Preview"
        />
      </div>

      <!-- Metadata & Telemetry -->
      <div class="preview-meta-bar">
        <div class="meta-stat">
          <span>Dimensions:</span>
          <span class="highlight">1200 × 630 px (1.91:1)</span>
        </div>
        <div class="meta-stat">
          <span>Format:</span>
          <span class="highlight">image/png</span>
        </div>
        <div class="meta-stat">
          <span>Latency:</span>
          <span id="latency-stat" class="highlight">-- ms</span>
        </div>
      </div>

      <!-- Integration Code Snippets -->
      <div class="output-section">
        <div class="preset-label">Dynamic API URL</div>
        <div class="snippet-box">
          <div id="api-url-snippet" class="snippet-code"></div>
          <button class="btn btn-outline" onclick="copySnippet('api-url-snippet', this)">Copy URL</button>
        </div>

        <div class="preset-label" style="margin-top: 8px;">HTML Meta Tag Integration</div>
        <div class="snippet-box">
          <div id="html-tag-snippet" class="snippet-code"></div>
          <button class="btn btn-outline" onclick="copySnippet('html-tag-snippet', this)">Copy Tag</button>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer>
    <div class="footer-inner">
      <div>NEURALWIRE MEDIA // OPEN GRAPH GENERATOR MICROSERVICE</div>
      <div>HTTP CACHE: S-MAXAGE=604800 // SATORI + RESVG POWERED</div>
    </div>
  </footer>

  <script>
    const presets = {
      swarm: {
        title: 'Autonomous Agent Swarms: Emergence of Collective Intelligence in Complex Environments',
        category: 'Research & Systems',
        source: 'MIT Technology Review',
        read_time: '4 min',
        score: 94
      },
      silicon: {
        title: 'Neuromorphic Silicon Breakthroughs: Achieving 100x Efficiency in Edge Reasoning',
        category: 'Hardware & Chips',
        source: 'Nature Electronics',
        read_time: '6 min',
        score: 88
      },
      frontier: {
        title: 'Frontier AI Reasoning Benchmarks: Deep Analysis of State-of-the-Art Architectures',
        category: 'Frontier AI',
        source: 'Neuralwire Research',
        read_time: '8 min',
        score: 98
      },
      crypto: {
        title: 'Decentralized Intelligence: Byzantine Fault Tolerant Consensus for Model Weights',
        category: 'Decentralized Systems',
        source: 'ArXiv 2026',
        read_time: '5 min',
        score: 76
      }
    };

    const titleInput = document.getElementById('title-input');
    const categoryInput = document.getElementById('category-input');
    const sourceInput = document.getElementById('source-input');
    const readTimeInput = document.getElementById('read-time-input');
    const scoreSlider = document.getElementById('score-slider');
    const scoreVal = document.getElementById('score-val');
    const titleCount = document.getElementById('title-count');
    const previewImg = document.getElementById('preview-img');
    const previewSpinner = document.getElementById('preview-spinner');
    const latencyStat = document.getElementById('latency-stat');
    const apiUrlSnippet = document.getElementById('api-url-snippet');
    const htmlTagSnippet = document.getElementById('html-tag-snippet');

    let debounceTimer = null;

    function updateCharacterCount() {
      titleCount.textContent = \`\${titleInput.value.length} / 150\`;
    }

    function buildUrl() {
      const params = new URLSearchParams();
      const title = titleInput.value.trim() || 'Neuralwire Intelligence';
      params.set('title', title);

      if (categoryInput.value.trim()) {
        params.set('category', categoryInput.value.trim());
      }
      if (sourceInput.value.trim()) {
        params.set('source', sourceInput.value.trim());
      }
      if (readTimeInput.value.trim()) {
        params.set('read_time', readTimeInput.value.trim());
      }
      if (scoreSlider.value) {
        params.set('score', scoreSlider.value);
      }

      const fullUrl = \`\${window.location.origin}/api/og?\${params.toString()}\`;
      return { fullUrl, relativeUrl: \`/api/og?\${params.toString()}\` };
    }

    function refreshPreview() {
      updateCharacterCount();
      scoreVal.textContent = \`\${scoreSlider.value}/100\`;

      const { fullUrl, relativeUrl } = buildUrl();
      apiUrlSnippet.textContent = fullUrl;
      htmlTagSnippet.textContent = \`<meta property="og:image" content="\${fullUrl}" />\`;

      previewSpinner.classList.add('visible');
      previewImg.classList.add('loading');

      const startTime = performance.now();
      const img = new Image();
      img.onload = () => {
        const duration = Math.round(performance.now() - startTime);
        latencyStat.textContent = \`\${duration} ms\`;
        previewImg.src = img.src;
        previewImg.classList.remove('loading');
        previewSpinner.classList.remove('visible');
      };
      img.onerror = () => {
        previewImg.classList.remove('loading');
        previewSpinner.classList.remove('visible');
        latencyStat.textContent = 'Error';
      };
      img.src = fullUrl;
    }

    function debouncedRefresh() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(refreshPreview, 250);
    }

    function applyPreset(key) {
      const preset = presets[key];
      if (!preset) return;

      titleInput.value = preset.title;
      categoryInput.value = preset.category;
      sourceInput.value = preset.source;
      readTimeInput.value = preset.read_time;
      scoreSlider.value = preset.score;

      refreshPreview();
    }

    function downloadImage() {
      const { fullUrl } = buildUrl();
      const a = document.createElement('a');
      a.href = fullUrl;
      a.download = 'neuralwire-og.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    function copySnippet(elementId, btnElement) {
      const text = document.getElementById(elementId).textContent;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = btnElement.textContent;
        btnElement.textContent = 'Copied!';
        btnElement.style.borderColor = 'var(--cyan)';
        btnElement.style.color = 'var(--cyan)';
        setTimeout(() => {
          btnElement.textContent = originalText;
          btnElement.style.borderColor = '';
          btnElement.style.color = '';
        }, 1500);
      });
    }

    // Attach Event Listeners
    titleInput.addEventListener('input', () => {
      updateCharacterCount();
      debouncedRefresh();
    });
    categoryInput.addEventListener('input', debouncedRefresh);
    sourceInput.addEventListener('input', debouncedRefresh);
    readTimeInput.addEventListener('input', debouncedRefresh);
    scoreSlider.addEventListener('input', () => {
      scoreVal.textContent = \`\${scoreSlider.value}/100\`;
      debouncedRefresh();
    });

    // Initial load
    window.addEventListener('DOMContentLoaded', () => {
      refreshPreview();
    });
  </script>
</body>
</html>`;

playgroundRouter.get('/', (c) => {
  return c.html(playgroundHTML);
});
