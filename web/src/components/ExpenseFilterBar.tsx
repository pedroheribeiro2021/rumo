import { useState, type ReactNode } from 'react'
import { Tabs } from './ui'
import { formatDateShort } from '../lib/format'
import { PAYMENT_METHODS } from '../lib/paymentMethods'
import { EMPTY_FILTERS, hasActiveFilters, type DayOption, type ExpenseFilters } from '../lib/expenseFilters'

interface Props {
  filters: ExpenseFilters
  onChange: (next: ExpenseFilters) => void
  dayOptions: DayOption[]
  categories: string[]
  members: { id: string; display_name: string }[]
}

function dayLabel(o: DayOption): string {
  if (o.kind === 'all') return 'Todos'
  if (o.kind === 'before') return 'Antes'
  if (o.kind === 'after') return 'Depois'
  return o.isToday ? 'Hoje' : formatDateShort(o.date)
}

/**
 * Barra de filtros da lista de gastos. Dia fica sempre à vista (é o recorte mais usado,
 * 1 toque); o resto fica atrás de "Filtros" pra não empurrar a lista pra baixo no celular.
 */
export function ExpenseFilterBar({ filters, onChange, dayOptions, categories, members }: Props) {
  const secondaryActive = !!filters.category || !!filters.paidBy || !!filters.payment || filters.unsplitOnly || filters.query.trim() !== ''
  const [expanded, setExpanded] = useState(secondaryActive)
  const set = (patch: Partial<ExpenseFilters>) => onChange({ ...filters, ...patch })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Tabs items={dayOptions.map((o) => ({ value: o.value, label: dayLabel(o) }))} value={filters.day} onChange={(day) => set({ day })} />

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="search"
          placeholder="Buscar gasto…"
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          aria-label="Buscar gasto"
          style={{
            flex: 1,
            minWidth: 0,
            height: 36,
            padding: '0 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-body-sm)',
          }}
        />
        <Chip active={expanded || secondaryActive} onClick={() => setExpanded((v) => !v)}>
          Filtros{secondaryActive ? ' •' : ''}
        </Chip>
        {hasActiveFilters(filters) && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            style={{ border: 'none', background: 'none', color: 'var(--color-brand)', fontSize: 'var(--text-body-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)', flexShrink: 0 }}
          >
            Limpar
          </button>
        )}
      </div>

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ChipRow label="Categoria">
            {categories.map((c) => (
              <Chip key={c} active={filters.category === c} onClick={() => set({ category: filters.category === c ? null : c })}>
                {c}
              </Chip>
            ))}
          </ChipRow>
          <ChipRow label="Pagou">
            {members.map((m) => (
              <Chip key={m.id} active={filters.paidBy === m.id} onClick={() => set({ paidBy: filters.paidBy === m.id ? null : m.id })}>
                {m.display_name.split(' ')[0]}
              </Chip>
            ))}
            <Chip active={filters.unsplitOnly} onClick={() => set({ unsplitOnly: !filters.unsplitOnly })}>
              Sem divisão
            </Chip>
          </ChipRow>
          <ChipRow label="Pagamento">
            {[...PAYMENT_METHODS, { value: 'none', label: 'Não informado' }].map((p) => (
              <Chip key={p.value} active={filters.payment === p.value} onClick={() => set({ payment: filters.payment === p.value ? null : p.value })}>
                {p.label}
              </Chip>
            ))}
          </ChipRow>
        </div>
      )}
    </div>
  )
}

function ChipRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', overflowX: 'auto', paddingBottom: 2, WebkitOverflowScrolling: 'touch' }}>
      <span style={{ flexShrink: 0, fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', minWidth: 64 }}>{label}</span>
      {children}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        flexShrink: 0,
        height: 32,
        padding: '0 12px',
        borderRadius: 'var(--radius-full)',
        border: 'none',
        background: active ? 'var(--color-brand)' : 'var(--color-surface)',
        color: active ? 'var(--color-text-on-primary)' : 'var(--color-text-secondary)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-body-sm)',
        fontWeight: 'var(--weight-medium)',
        boxShadow: active ? 'none' : 'inset 0 0 0 1px var(--color-border)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}
