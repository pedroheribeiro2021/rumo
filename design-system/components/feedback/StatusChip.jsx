import React from 'react';

const TONES = {
  good: { fg: 'var(--color-success)', bg: 'var(--color-success-subtle)' },
  warn: { fg: 'var(--color-warning)', bg: 'var(--color-warning-subtle)' },
  bad: { fg: 'var(--color-error)', bg: 'var(--color-error-subtle)' },
  info: { fg: 'var(--color-info)', bg: 'var(--color-info-subtle)' },
  neutral: { fg: 'var(--color-text-secondary)', bg: 'var(--color-surface-sunken)' },
};

/** Small pill label for status — price-target hit, settlement state, category tags. */
export function StatusChip({ children, tone = 'neutral' }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 10px', borderRadius: 'var(--radius-full)',
      background: t.bg, color: t.fg, fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 'var(--weight-semibold)',
    }}>
      {children}
    </span>
  );
}
