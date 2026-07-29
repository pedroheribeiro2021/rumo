import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import { fetchFxRate } from '../lib/fx'
import { formatMoney as money } from '../lib/format'
import { Card, CurrencySelect, Input, LoadingState } from '../components/ui'

export function CurrencyCalculatorPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { data: trip } = useTrip(tripId)

  const [amount, setAmount] = useState('1')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('BRL')
  const [rate, setRate] = useState<number | null>(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (trip) setTo(trip.base_currency)
  }, [trip])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchFxRate(from, to).then((r) => {
      if (!cancelled) {
        setRate(r)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [from, to])

  const amountNum = parseFloat(amount.replace(',', '.')) || 0
  const converted = rate != null ? amountNum * rate : null

  if (!trip) return <LoadingState />

  return (
    <div>
      <Link to={`/trips/${tripId}`} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        ← {trip.name}
      </Link>
      <h1 style={{ margin: '6px 0 16px', fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>Câmbio</h1>

      <Card>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <Input label="Valor" type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ flex: 1 }} />
          <CurrencySelect label="De" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0', fontSize: 20, color: 'var(--color-text-tertiary)' }}>↓</div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 'var(--text-money)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {loading ? '…' : converted != null ? money(converted, to) : 'câmbio indisponível'}
            </p>
          </div>
          <CurrencySelect label="Para" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>

        {rate != null && (
          <p style={{ marginTop: 12, fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
            1 {from} = {rate.toFixed(4)} {to}
          </p>
        )}
      </Card>
    </div>
  )
}
