import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import { useExpenses } from '../hooks/useExpenses'
import { useBudgetItems, useCreateBudgetItem, useDeleteBudgetItem } from '../hooks/useBudget'
import { useBudgetCategories, useCreateBudgetCategory } from '../hooks/useBudgetCategories'
import { useItineraryDays } from '../hooks/useItinerary'
import { computeSpentByCategory, computeSpentByDay } from '../lib/budget'
import { formatMoney as money } from '../lib/format'
import { Button, Card, EmptyState, Input, LoadingState, ProgressBar, Tabs } from '../components/ui'

function formatDay(dayDate: string | null) {
  if (!dayDate) return '?'
  const [, month, day] = dayDate.split('-')
  return `${day}/${month}`
}

type Dimension = 'category' | 'day' | 'both'

export function BudgetPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { data: trip } = useTrip(tripId)
  const { data: expenses } = useExpenses(tripId)
  const { data: budgetItems, isLoading } = useBudgetItems(tripId)
  const { data: categories } = useBudgetCategories(tripId)
  const { data: days } = useItineraryDays(tripId)
  const createItem = useCreateBudgetItem(tripId!)
  const deleteItem = useDeleteBudgetItem(tripId!)
  const createCategory = useCreateBudgetCategory(tripId!)

  const [dimension, setDimension] = useState<Dimension>('category')
  const [category, setCategory] = useState('')
  const [dayDate, setDayDate] = useState('')
  const [plannedAmount, setPlannedAmount] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')

  const effectiveCategory = category || categories?.[0]?.name || ''

  const spentByCategory = useMemo(() => computeSpentByCategory(expenses ?? []), [expenses])
  const spentByDay = useMemo(() => computeSpentByDay(expenses ?? []), [expenses])

  const totalSpent = useMemo(() => Object.values(spentByCategory).reduce((s, v) => s + v, 0), [spentByCategory])
  const totalPlanned = useMemo(
    () => (budgetItems ?? []).filter((b) => b.category).reduce((s, b) => s + b.planned_amount, 0),
    [budgetItems],
  )

  const categoryItems = useMemo(() => (budgetItems ?? []).filter((b) => b.category), [budgetItems])
  const dayItems = useMemo(() => (budgetItems ?? []).filter((b) => b.day_date && !b.category), [budgetItems])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(plannedAmount.replace(',', '.'))
    if (!amount || amount <= 0 || !trip) return
    if (dimension === 'day' && !dayDate) return
    await createItem.mutateAsync({
      category: dimension !== 'day' ? effectiveCategory : null,
      day_date: dimension !== 'category' ? dayDate || null : null,
      planned_amount: amount,
      currency: trip.base_currency,
    })
    setPlannedAmount('')
  }

  async function handleAddCategory() {
    const name = newCategoryName.trim()
    if (!name) return
    await createCategory.mutateAsync(name)
    setCategory(name)
    setNewCategoryName('')
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
        {!isLoading && categoryItems.length > 0 && (
          <Card>
            <h2 style={{ margin: '0 0 12px', fontSize: 'var(--text-h3)', color: 'var(--color-text-primary)' }}>Por categoria</h2>
            {categoryItems.map((item, i) => {
              const spent = spentByCategory[item.category!] ?? 0
              const tone = spent > item.planned_amount ? 'bad' : spent > item.planned_amount * 0.85 ? 'warn' : 'brand'
              return (
                <div key={item.id} style={{ marginBottom: i < categoryItems.length - 1 ? 16 : 0 }}>
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

        {!isLoading && dayItems.length > 0 && (
          <Card style={{ marginTop: 16 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 'var(--text-h3)', color: 'var(--color-text-primary)' }}>Por dia</h2>
            {dayItems.map((item, i) => {
              const spent = spentByDay[item.day_date!] ?? 0
              const tone = spent > item.planned_amount ? 'bad' : spent > item.planned_amount * 0.85 ? 'warn' : 'brand'
              return (
                <div key={item.id} style={{ marginBottom: i < dayItems.length - 1 ? 16 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-body-sm)', marginBottom: 6 }}>
                    <span style={{ color: 'var(--color-text-primary)' }}>Dia {formatDay(item.day_date)}</span>
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
        <Tabs
          items={[
            { value: 'category', label: 'Por categoria' },
            { value: 'day', label: 'Por dia' },
            { value: 'both', label: 'Ambos' },
          ]}
          value={dimension}
          onChange={(v) => setDimension(v as Dimension)}
        />
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end', marginTop: 14 }}>
          {dimension !== 'day' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)' }}>
              <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>Categoria</span>
              <select
                value={effectiveCategory}
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
                {categories?.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          {dimension !== 'category' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)' }}>
              <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>Dia</span>
              <select
                value={dayDate}
                onChange={(e) => setDayDate(e.target.value)}
                required
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
                <option value="" disabled>
                  Selecione
                </option>
                {days?.map((d) => (
                  <option key={d.id} value={d.day_date ?? ''}>
                    {formatDay(d.day_date)} {d.base_city ? `· ${d.base_city}` : ''}
                  </option>
                ))}
              </select>
            </label>
          )}

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

        {dimension !== 'day' && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
            <Input
              placeholder="+ nova categoria"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button type="button" variant="secondary" onClick={handleAddCategory} loading={createCategory.isPending}>
              Cadastrar
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
