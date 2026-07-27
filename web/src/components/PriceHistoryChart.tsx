import { useRef, useState } from 'react'
import { formatMoney } from '../lib/format'
import type { PriceObservation } from '../lib/types'

const WIDTH = 600
const HEIGHT = 220
const PAD_X = 12
const PAD_TOP = 16
const PAD_BOTTOM = 28

function formatDate(iso: string) {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

export function PriceHistoryChart({
  observations,
  targetPrice,
  currency,
}: {
  observations: PriceObservation[]
  targetPrice: number | null
  currency: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  if (observations.length === 0) return null

  const prices = observations.map((o) => o.price)
  const minPrice = Math.min(...prices, targetPrice ?? Infinity)
  const maxPrice = Math.max(...prices, targetPrice ?? -Infinity)
  const range = maxPrice - minPrice || 1
  const yPad = range * 0.1

  const plotW = WIDTH - PAD_X * 2
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM

  function xFor(i: number) {
    return observations.length === 1 ? WIDTH / 2 : PAD_X + (i / (observations.length - 1)) * plotW
  }
  function yFor(price: number) {
    return PAD_TOP + plotH - ((price - (minPrice - yPad)) / (range + yPad * 2)) * plotH
  }

  const linePath = observations.map((o, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(o.price)}`).join(' ')
  const targetY = targetPrice != null ? yFor(targetPrice) : null

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const relativeX = ((e.clientX - rect.left) / rect.width) * WIDTH
    let closest = 0
    let closestDist = Infinity
    observations.forEach((_, i) => {
      const dist = Math.abs(xFor(i) - relativeX)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    setHoverIndex(closest)
  }

  const hovered = hoverIndex != null ? observations[hoverIndex] : null

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%' }}
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {targetY != null && (
          <>
            <line x1={PAD_X} y1={targetY} x2={WIDTH - PAD_X} y2={targetY} stroke="var(--color-text-tertiary)" strokeWidth={1.5} strokeDasharray="4 4" />
            <text x={WIDTH - PAD_X} y={targetY - 6} textAnchor="end" fontSize={11} fill="var(--color-text-tertiary)" fontFamily="var(--font-sans)">
              alvo {formatMoney(targetPrice!, currency)}
            </text>
          </>
        )}

        <path d={linePath} fill="none" stroke="var(--color-brand)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {observations.map((o, i) => (
          <circle key={o.id} cx={xFor(i)} cy={yFor(o.price)} r={hoverIndex === i ? 5 : 4} fill="var(--color-brand)" />
        ))}

        {hoverIndex != null && (
          <line x1={xFor(hoverIndex)} y1={PAD_TOP} x2={xFor(hoverIndex)} y2={HEIGHT - PAD_BOTTOM} stroke="var(--color-border)" strokeWidth={1} />
        )}

        {/* label direto só no primeiro e no último ponto, não em todos */}
        <text x={xFor(0)} y={HEIGHT - 8} fontSize={11} fill="var(--color-text-tertiary)" fontFamily="var(--font-sans)" textAnchor="start">
          {formatDate(observations[0].observed_at)}
        </text>
        <text
          x={xFor(observations.length - 1)}
          y={HEIGHT - 8}
          fontSize={11}
          fill="var(--color-text-tertiary)"
          fontFamily="var(--font-sans)"
          textAnchor="end"
        >
          {formatDate(observations[observations.length - 1].observed_at)}
        </text>
      </svg>

      {hovered && (
        <div
          style={{
            position: 'absolute',
            left: `${(xFor(hoverIndex!) / WIDTH) * 100}%`,
            top: `${(yFor(hovered.price) / HEIGHT) * 100}%`,
            transform: 'translate(-50%, -130%)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
            padding: '4px 8px',
            fontSize: 11,
            fontFamily: 'var(--font-sans)',
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          <strong>{formatMoney(hovered.price, currency)}</strong> · {formatDate(hovered.observed_at)}
          {hovered.source ? ` · ${hovered.source}` : ''}
        </div>
      )}
    </div>
  )
}
