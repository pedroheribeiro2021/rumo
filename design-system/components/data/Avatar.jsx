import React from 'react';

const SIZES = { sm: 28, md: 36, lg: 48 };
const PALETTE = ['#0b6b5b', '#e8a13a', '#3b6fb0', '#a96e1e', '#178a53', '#c0392b'];

function initials(name) {
  return (name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}
function colorFor(name) {
  let h = 0;
  for (const c of name || '') h = (h * 31 + c.charCodeAt(0)) % PALETTE.length;
  return PALETTE[h];
}

/** Circular avatar — initials-based (no photo upload in the product yet). */
export function Avatar({ name, size = 'md', ring = false }) {
  const d = SIZES[size] || SIZES.md;
  return (
    <span style={{
      width: d, height: d, borderRadius: '50%', background: colorFor(name), color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--weight-semibold)', fontSize: d * 0.4, flexShrink: 0,
      boxShadow: ring ? '0 0 0 2px var(--color-surface), 0 0 0 4px var(--color-brand-subtle)' : 'none',
    }}>
      {initials(name)}
    </span>
  );
}
