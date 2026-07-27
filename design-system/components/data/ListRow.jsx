import React from 'react';

/** Tappable list row — trips, expenses, members. Title + subtitle left, trailing value/action right. */
export function ListRow({ title, subtitle, leading, trailing, trailingSub, onClick, divider = true }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 4px', minHeight: 44,
        borderBottom: divider ? '1px solid var(--color-border)' : 'none',
        background: hover ? 'var(--color-surface-sunken)' : 'transparent', cursor: onClick ? 'pointer' : 'default',
        borderRadius: 'var(--radius-sm)', transition: 'background var(--duration-fast)',
      }}
    >
      {leading}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 'var(--text-body)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
        {subtitle && <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</p>}
      </div>
      {(trailing || trailingSub) && (
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {trailing && <p style={{ margin: 0, fontSize: 'var(--text-money)', fontWeight: 'var(--weight-semibold)', fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-primary)' }}>{trailing}</p>}
          {trailingSub && <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{trailingSub}</p>}
        </div>
      )}
    </div>
  );
}
