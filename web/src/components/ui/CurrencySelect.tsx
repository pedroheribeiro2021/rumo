import { useState } from 'react'
import type { ChangeEventHandler } from 'react'

export interface CurrencySelectProps {
  value: string
  onChange: ChangeEventHandler<HTMLSelectElement>
  currencies?: string[]
  label?: string
  size?: 'md' | 'lg'
}

const NAMES: Record<string, string> = { BRL: 'Real', USD: 'Dólar', EUR: 'Euro', ARS: 'Peso arg.', PYG: 'Guarani' }

/** Seletor de moeda estilo pill — usado nos formulários de gasto/viagem. */
export function CurrencySelect({
  value,
  onChange,
  currencies = ['BRL', 'USD', 'EUR', 'ARS', 'PYG'],
  label,
  size = 'md',
}: CurrencySelectProps) {
  const [focused, setFocused] = useState(false)
  const height = size === 'lg' ? 52 : 44
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)' }}>
      {label && (
        <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
          {label}
        </span>
      )}
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            height,
            padding: '0 34px 0 14px',
            borderRadius: 'var(--radius-full)',
            border: `1.5px solid ${focused ? 'var(--color-brand)' : 'var(--color-border)'}`,
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-body)',
            fontWeight: 'var(--weight-semibold)',
            appearance: 'none',
            outline: 'none',
            boxShadow: focused ? 'var(--focus-ring)' : 'none',
            cursor: 'pointer',
          }}
        >
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c} · {NAMES[c] || c}
            </option>
          ))}
        </select>
        <span
          style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-tertiary)',
            fontSize: 11,
            pointerEvents: 'none',
          }}
        >
          ▾
        </span>
      </span>
    </label>
  )
}
