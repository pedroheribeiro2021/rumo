import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import { useTripMembers } from '../hooks/useTripMembers'
import { equalSplit, useCreateExpense, useDeleteExpense, useExpenses, type ExpenseWithSplits } from '../hooks/useExpenses'
import { useAuth } from '../contexts/AuthContext'
import { computeSettlement, type MemberBalance } from '../lib/settlement'
import { fetchFxRate } from '../lib/fx'
import { Button, Card, CurrencySelect, EmptyState, Fab, Input, LoadingState, Modal } from '../components/ui'

const CATEGORIES = ['alimentação', 'transporte', 'hospedagem', 'passeio', 'compras', 'outros']

function money(value: number, currency: string) {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

export function ExpensesPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { session } = useAuth()
  const { data: trip } = useTrip(tripId)
  const { data: members } = useTripMembers(tripId)
  const { data: expenses, isLoading } = useExpenses(tripId)
  const createExpense = useCreateExpense(tripId!)
  const deleteExpense = useDeleteExpense(tripId!)

  const [open, setOpen] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('outros')
  const [currency, setCurrency] = useState<string | null>(null)
  const [fxRate, setFxRate] = useState(1)
  const [fxLoading, setFxLoading] = useState(false)
  const [spentOn, setSpentOn] = useState(() => new Date().toISOString().slice(0, 10))
  const [paidBy, setPaidBy] = useState<string | null>(null)
  const [splitMode, setSplitMode] = useState<'equal' | 'custom'>('equal')
  const [customShares, setCustomShares] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')

  const myMemberId = useMemo(() => members?.find((m) => m.profile_id === session?.user.id)?.id, [members, session])
  const effectiveCurrency = currency ?? trip?.base_currency ?? 'BRL'
  const effectivePaidBy = paidBy ?? myMemberId ?? members?.[0]?.id

  const total = useMemo(() => (expenses ?? []).reduce((sum, e) => sum + e.amount * e.fx_to_base, 0), [expenses])

  const balances: MemberBalance[] = useMemo(() => {
    if (!members) return []
    const paid: Record<string, number> = {}
    const owed: Record<string, number> = {}
    for (const e of expenses ?? []) {
      const amountBase = e.amount * e.fx_to_base
      if (e.paid_by) paid[e.paid_by] = (paid[e.paid_by] ?? 0) + amountBase
      for (const s of e.splits) {
        owed[s.member_id] = (owed[s.member_id] ?? 0) + s.share
      }
    }
    return members.map((m) => ({
      memberId: m.id,
      name: m.display_name,
      balance: Math.round(((paid[m.id] ?? 0) - (owed[m.id] ?? 0)) * 100) / 100,
    }))
  }, [members, expenses])

  const transfers = useMemo(() => computeSettlement(balances), [balances])

  async function handleCurrencyChange(next: string) {
    setCurrency(next)
    if (!trip || next === trip.base_currency) {
      setFxRate(1)
      return
    }
    setFxLoading(true)
    const rate = await fetchFxRate(next, trip.base_currency)
    setFxRate(rate ?? 1)
    setFxLoading(false)
  }

  function resetForm() {
    setAmount('')
    setDescription('')
    setCategory('outros')
    setCurrency(null)
    setFxRate(1)
    setSpentOn(new Date().toISOString().slice(0, 10))
    setPaidBy(null)
    setSplitMode('equal')
    setCustomShares({})
    setSubmitError('')
    setOpen(false)
    setShowMore(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError('')

    const amountNum = parseFloat(amount.replace(',', '.'))
    if (!amountNum || amountNum <= 0 || !members?.length || !effectivePaidBy) return

    const amountBaseCents = Math.round(amountNum * fxRate * 100)

    let splits
    if (splitMode === 'equal') {
      splits = equalSplit(
        amountBaseCents,
        members.map((m) => m.id),
      )
    } else {
      const entries = members.map((m) => ({
        memberId: m.id,
        shareCents: Math.round(parseFloat((customShares[m.id] ?? '0').replace(',', '.') || '0') * 100),
      }))
      const sum = entries.reduce((s, e) => s + e.shareCents, 0)
      if (Math.abs(sum - amountBaseCents) > 1) {
        setSubmitError('A soma da divisão precisa bater com o total do gasto.')
        return
      }
      splits = entries
    }

    await createExpense.mutateAsync({
      tripId: tripId!,
      description,
      category,
      amount: amountNum,
      currency: effectiveCurrency,
      fxToBase: fxRate,
      paidBy: effectivePaidBy,
      spentOn,
      splits,
    })
    resetForm()
  }

  if (!trip) return <LoadingState />

  return (
    <div style={{ position: 'relative' }}>
      <Link to={`/trips/${tripId}`} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        ← {trip.name}
      </Link>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 6 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>Gastos</h1>
          <p style={{ margin: '4px 0 0', fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)' }}>
            Total: <strong style={{ color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{money(total, trip.base_currency)}</strong>
          </p>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {isLoading && <LoadingState />}
        {!isLoading && expenses?.length === 0 && <EmptyState icon="💸" title="Nenhum gasto ainda" message="Toque no + para lançar o primeiro." />}
        {!isLoading && expenses && expenses.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {expenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                baseCurrency={trip.base_currency}
                payerName={members?.find((m) => m.id === expense.paid_by)?.display_name}
                onDelete={() => deleteExpense.mutate(expense.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Card style={{ marginTop: 20 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--text-h3)', color: 'var(--color-text-primary)' }}>Acerto de contas</h2>
        {transfers.length === 0 ? (
          <p style={{ margin: '10px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
            Tudo certo — ninguém deve nada.
          </p>
        ) : (
          <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', fontSize: 'var(--text-body)' }}>
            {transfers.map((t, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                <strong>{t.fromName}</strong> deve <strong>{money(t.amount, trip.base_currency)}</strong> para <strong>{t.toName}</strong>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Fab icon="+" label="Novo gasto" onClick={() => setOpen(true)} offsetBottom={24} />

      <Modal
        open={open}
        onClose={resetForm}
        title="Novo gasto"
        footer={
          <Button type="submit" form="expense-form" fullWidth size="lg" loading={createExpense.isPending}>
            Salvar gasto
          </Button>
        }
      >
        <form id="expense-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              label="Valor"
              size="lg"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              required
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ flex: 1 }}
            />
            <CurrencySelect label="Moeda" value={effectiveCurrency} onChange={(e) => handleCurrencyChange(e.target.value)} />
          </div>

          <Input placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                style={{
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  background: category === c ? 'var(--color-brand)' : 'var(--color-surface-sunken)',
                  color: category === c ? '#fff' : 'var(--color-text-secondary)',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowMore((s) => !s)}
            style={{
              alignSelf: 'flex-start',
              border: 'none',
              background: 'none',
              padding: 0,
              fontSize: 'var(--text-body-sm)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-brand)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {showMore ? '– menos opções' : '+ mais opções (quem pagou, data, divisão)'}
          </button>

          {showMore && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {effectiveCurrency !== trip.base_currency && (
                  <Input
                    type="number"
                    step="0.0001"
                    value={fxRate}
                    onChange={(e) => setFxRate(parseFloat(e.target.value) || 0)}
                    label={`Câmbio p/ ${trip.base_currency}`}
                    style={{ flex: '1 1 140px' }}
                  />
                )}
                {fxLoading && <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>buscando câmbio…</span>}
                <Input type="date" label="Data" value={spentOn} onChange={(e) => setSpentOn(e.target.value)} style={{ flex: '1 1 140px' }} />
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)' }}>
                <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
                  Pago por
                </span>
                <select
                  value={effectivePaidBy ?? ''}
                  onChange={(e) => setPaidBy(e.target.value)}
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
                  {members?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.display_name}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <div style={{ display: 'flex', gap: 12, fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input type="radio" checked={splitMode === 'equal'} onChange={() => setSplitMode('equal')} />
                    Dividir igual
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input type="radio" checked={splitMode === 'custom'} onChange={() => setSplitMode('custom')} />
                    Dividir manual
                  </label>
                </div>
                {splitMode === 'custom' && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {members?.map((m) => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 96, fontSize: 'var(--text-body-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.display_name}
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          value={customShares[m.id] ?? ''}
                          onChange={(e) => setCustomShares((s) => ({ ...s, [m.id]: e.target.value }))}
                          style={{ flex: 1 }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {submitError && <p style={{ margin: 0, fontSize: 'var(--text-body-sm)', color: 'var(--color-error)' }}>{submitError}</p>}
        </form>
      </Modal>
    </div>
  )
}

function ExpenseRow({
  expense,
  baseCurrency,
  payerName,
  onDelete,
}: {
  expense: ExpenseWithSplits
  baseCurrency: string
  payerName?: string
  onDelete: () => void
}) {
  const isForeign = expense.currency !== baseCurrency
  return (
    <Card padding="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 'var(--text-body)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)' }}>
          {expense.description || expense.category || 'Gasto'}{' '}
          <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-regular)', color: 'var(--color-text-tertiary)' }}>
            · {expense.category}
          </span>
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
          {expense.spent_on} · pago por {payerName ?? '—'}
        </p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: 'var(--text-money)', fontWeight: 'var(--weight-semibold)', fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-primary)' }}>
          {money(expense.amount, expense.currency)}
        </p>
        {isForeign && (
          <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
            ≈ {money(expense.amount * expense.fx_to_base, baseCurrency)}
          </p>
        )}
        <button
          onClick={onDelete}
          style={{
            marginTop: 4,
            border: 'none',
            background: 'none',
            color: 'var(--color-text-tertiary)',
            fontSize: 'var(--text-body-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Excluir
        </button>
      </div>
    </Card>
  )
}
