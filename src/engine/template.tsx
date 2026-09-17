import type { SanitizedOGParams } from '../types/index.js';

/**
 * Returns formatted date string for the issue badge.
 */
function getIssueDate(customDate?: string): string {
  if (customDate) return customDate.toUpperCase();
  const now = new Date();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[now.getUTCMonth()];
  const year = now.getUTCFullYear();
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${day} ${month} ${year}`;
}

/**
 * Calculates responsive font size based on title length to maintain
 * optimal editorial layout balance within the 3-line limit.
 */
function getTitleFontSize(title: string): number {
  const len = title.length;
  if (len <= 45) return 56;
  if (len <= 80) return 48;
  if (len <= 110) return 42;
  return 36;
}

/**
 * Formats the score display and determines the status dot color.
 */
function getScoreConfig(score?: number): { text: string; dotColor: string; textColor: string } | null {
  if (score === undefined || score === null) return null;
  
  if (score >= 80) {
    return {
      text: `IMPACT SCORE: ${score}/100`,
      dotColor: '#10B981', // Emerald Green
      textColor: '#34D399',
    };
  }
  if (score >= 50) {
    return {
      text: `IMPACT SCORE: ${score}/100`,
      dotColor: '#22D3EE', // Cyber Cyan
      textColor: '#38BDF8',
    };
  }
  return {
    text: `IMPACT SCORE: ${score}/100`,
    dotColor: '#F59E0B', // Amber
    textColor: '#FBBF24',
  };
}

/**
 * Open Graph Template for Neuralwire
 * Dimensions: Exactly 1200 x 630 pixels
 * Aesthetic: Editorial Cyberpunk / Technical Dark Mode
 */
export function OGTemplate(params: SanitizedOGParams) {
  const { title, category, source, score, read_time, dateStr } = params;
  const issueDate = getIssueDate(dateStr);
  const fontSize = getTitleFontSize(title);
  const scoreConfig = getScoreConfig(score);

  // Normalize category to have '//' prefix if not present
  const formattedCategory = category.startsWith('//')
    ? category.toUpperCase()
    : `// ${category.toUpperCase()}`;

  const formattedReadTime = read_time.toUpperCase().includes('READ')
    ? read_time.toUpperCase()
    : `${read_time.toUpperCase()} READ`;

  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        backgroundColor: '#0A0E17',
        backgroundImage: `
          radial-gradient(circle at 92% 8%, rgba(34, 211, 238, 0.14) 0%, transparent 42%),
          radial-gradient(circle at 8% 92%, rgba(99, 102, 241, 0.12) 0%, transparent 48%),
          radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.6) 0%, transparent 100%)
        `,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 56px',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Outer Technical Frame Border */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
          pointerEvents: 'none',
          display: 'flex',
        }}
      />

      {/* Top Left Corner Bracket */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '16px',
          height: '16px',
          borderTop: '2px solid #22D3EE',
          borderLeft: '2px solid #22D3EE',
          display: 'flex',
        }}
      />

      {/* Top Right Corner Bracket */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '16px',
          height: '16px',
          borderTop: '2px solid #22D3EE',
          borderRight: '2px solid #22D3EE',
          display: 'flex',
        }}
      />

      {/* Bottom Left Corner Bracket */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          width: '16px',
          height: '16px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
          borderLeft: '2px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
        }}
      />

      {/* Bottom Right Corner Bracket */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '16px',
          height: '16px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
          borderRight: '2px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
        }}
      />

      {/* Subtle Top Ambient Glow Line */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '120px',
          width: '280px',
          height: '2px',
          background: 'linear-gradient(90deg, #22D3EE, transparent)',
          display: 'flex',
        }}
      />

      {/* 1. Header Component */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Brand Logo with Glowing Cyan Dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#22D3EE',
              boxShadow: '0 0 12px #22D3EE, 0 0 24px rgba(34, 211, 238, 0.5)',
              display: 'flex',
            }}
          />
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              fontSize: '20px',
              letterSpacing: '0.18em',
              color: '#F8FAFC',
              display: 'flex',
            }}
          >
            NEURALWIRE
          </div>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: '#22D3EE',
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.25)',
              padding: '2px 8px',
              borderRadius: '2px',
              marginLeft: '6px',
              display: 'flex',
            }}
          >
            DISPATCH
          </div>
        </div>

        {/* Live Issue Date & System Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              letterSpacing: '0.12em',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: '#475569' }}>[</span>
            <span>{issueDate}</span>
            <span style={{ color: '#475569' }}>]</span>
          </div>
        </div>
      </div>

      {/* 2. Middle Content Area (Category Pill + Editorial Headline) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          margin: '24px 0',
        }}
      >
        {/* Category Pill */}
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: '#22D3EE',
              backgroundColor: 'rgba(34, 211, 238, 0.08)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              padding: '6px 16px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {formattedCategory}
          </div>
        </div>

        {/* Main Title - Large Editorial Serif */}
        <div
          style={{
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: `${fontSize}px`,
            lineHeight: 1.14,
            fontWeight: 600,
            color: '#F8FAFC',
            letterSpacing: '-0.02em',
            display: 'flex',
            maxHeight: '220px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>
      </div>

      {/* 3. Footer Info Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Left Side: Source Attribution + Read Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Source Attribution Badge */}
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              color: '#94A3B8',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '6px 14px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ color: '#64748B' }}>SRC //</span>
            <span style={{ color: '#E2E8F0' }}>{source}</span>
          </div>

          {/* Read Time Pill */}
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              color: '#94A3B8',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '6px 14px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ color: '#64748B' }}>TIME //</span>
            <span style={{ color: '#E2E8F0' }}>{formattedReadTime}</span>
          </div>

          {/* Score Badge (if available) */}
          {scoreConfig && (
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                fontWeight: 700,
                color: scoreConfig.textColor,
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '6px 14px',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: scoreConfig.dotColor,
                  boxShadow: `0 0 8px ${scoreConfig.dotColor}`,
                  display: 'flex',
                }}
              />
              <span>{scoreConfig.text}</span>
            </div>
          )}
        </div>

        {/* Right Side: Technical Domain Watermark */}
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
            letterSpacing: '0.08em',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ color: '#22D3EE' }}>›</span>
          <span style={{ color: '#94A3B8' }}>neuralwire.info</span>
        </div>
      </div>
    </div>
  );
}
