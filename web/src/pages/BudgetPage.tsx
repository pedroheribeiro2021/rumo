import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import { useExpenses } from '../hooks/useExpenses'
import { useBudgetItems, useCreateBudgetItem, useDeleteBudgetItem } from '../hooks/useBudget'
import { formatMoney as money } from '../lib/format'
import { EXPENSE_CATEGORIES } from '../lib/categories'
import { Button, Card, EmptyState, Input, LoadingState, ProgressBar } from '../components/ui'

export function BudgetPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { data: trip } = useTrip(tripId)
  const { data: expenses } = useExpenses(tripId)
  const { data: budgetItems, isLoading } = useBudgetItems(tripId)
  const createItem = useCreateBudgetItem(tripId!)
  const deleteItem = useDeleteBudgetItem(tripId!)

  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [plannedAmount, setPlannedAmount] = useState('')

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of expenses ?? []) {
      const key = e.category ?? 'outros'
      map[key] = (map[key] ?? 0) + e.amount * e.fx_to_base
    }
    return map
  }, [expenses])

  const totalSpent = useMemo(() => Object.values(spentByCategory).reduce((s, v) => s + v, 0), [spentByCategory])
  const totalPlanned = useMemo(() => (budgetItems ?? []).reduce((s, b) => s + b.planned_amount, 0), [budgetItems])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(plannedAmount.replace(',', '.'))
    if (!amount || amount <= 0 || !trip) return
    await createItem.mutateAsync({ category, planned_amount: amount, currency: trip.base_currency })
    setPlannedAmount('')
  }

  if (!trip) return <LoadingState />

  return (
    <div>
      <Link to={`/trips/${tripId}`} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        ← {trip.name}
      </Link>
      <h1 style={{ margin: '6px 0 16px', fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>Orçamento</h1>

      <div style={{ display: 'flex', gap: 10 }}>
        <Card style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 'var(--text-money)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {money(totalSpent, trip.base_currency)}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>gasto até agora</p>
        </Card>
        <Card style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 'var(--text-money)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {money(totalPlanned, trip.base_currency)}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>planejado</p>
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        {isLoading && <LoadingState />}
        {!isLoading && budgetItems?.length === 0 && (
          <EmptyState icon="📊" title="Nenhum item de orçamento ainda" message="Adicione uma categoria abaixo." />
        )}
        {!isLoading && budgetItems && budgetItems.length > 0 && (
          <Card>
            {budgetItems.map((item, i) => {
              const spent = spentByCategory[item.category] ?? 0
              const tone = spent > item.planned_amount ? 'bad' : spent > item.planned_amount * 0.85 ? 'warn' : 'brand'
              return (
                <div key={item.id} style={{ marginBottom: i < budgetItems.length - 1 ? 16 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-body-sm)', marginBottom: 6 }}>
                    <span style={{ color: 'var(--color-text-primary)' }}>{item.category}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-secondary)' }}>
                      {money(spent, item.currency)} / {money(item.planned_amount, item.currency)}
                      <button
                        onClick={() => deleteItem.mutate(item.id)}
                        style={{ border: 'none', background: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                      >
                        ×
                      </button>
                    </span>
                  </div>
                  <ProgressBar value={spent} max={item.planned_amount || 1} tone={tone} />
                </div>
              )
            })}
          </Card>
        )}
      </div>

      <Card style={{ marginTop: 16 }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)' }}>
            <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>Categoria</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                height: 44,
                padding: '0 14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-body)',
              }}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Valor planejado"
            value={plannedAmount}
            onChange={(e) => setPlannedAmount(e.target.value)}
            style={{ flex: 1, minWidth: 140 }}
          />
          <Button type="submit" loading={createItem.isPending}>
            Adicionar
          </Button>
        </form>
      </Card>
    </div>
  )
}
