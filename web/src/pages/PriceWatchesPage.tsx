import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import { useCreatePriceWatch, useDeletePriceWatch, usePriceWatches } from '../hooks/usePriceWatches'
import { useLatestObservations } from '../hooks/usePriceObservations'
import { formatMoney as money } from '../lib/format'
import { Button, Card, CurrencySelect, EmptyState, Input, LoadingState, StatusChip } from '../components/ui'

export function PriceWatchesPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { data: trip } = useTrip(tripId)
  const { data: watches, isLoading } = usePriceWatches(tripId)
  const latestByWatch = useLatestObservations((watches ?? []).map((w) => w.id))
  const createWatch = useCreatePriceWatch(tripId!)
  const deleteWatch = useDeletePriceWatch(tripId!)

  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departDate, setDepartDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [currency, setCurrency] = useState('BRL')
  const [notes, setNotes] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!origin.trim() || !destination.trim()) return
    await createWatch.mutateAsync({
      origin: origin.trim().toUpperCase(),
      destination: destination.trim().toUpperCase(),
      depart_date: departDate || null,
      return_date: returnDate || null,
      target_price: targetPrice ? parseFloat(targetPrice.replace(',', '.')) : null,
      currency,
      notes: notes.trim() || null,
    })
    setOrigin('')
    setDestination('')
    setDepartDate('')
    setReturnDate('')
    setTargetPrice('')
    setNotes('')
  }

  if (!trip) return <LoadingState />

  return (
    <div>
      <Link to={`/trips/${tripId}`} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        ← {trip.name}
      </Link>
      <h1 style={{ margin: '6px 0 4px', fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>Monitor de passagens</h1>
      <p style={{ margin: '0 0 16px', color: 'var(--color-text-secondary)', fontSize: 'var(--text-body-sm)' }}>
        Preço em dinheiro, entrada manual. Como rede de segurança extra, ative o rastreamento nativo do Google Voos pros
        trechos que te importam.
      </p>

      {isLoading && <LoadingState />}
      {!isLoading && watches?.length === 0 && (
        <EmptyState icon="✈️" title="Nenhum trecho monitorado ainda" message="Adicione um abaixo." />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {watches?.map((w) => {
          const latest = latestByWatch.data?.[w.id]
          const tone = !latest || !w.target_price ? 'neutral' : latest.price <= w.target_price ? 'good' : 'bad'
          const tag = !latest ? 'sem dados' : !w.target_price ? 'sem alvo' : latest.price <= w.target_price ? 'no alvo' : 'acima do alvo'
          return (
            <Card key={w.id} padding="sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Link to={`/trips/${tripId}/passagens/${w.id}`} style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-body)', color: 'var(--color-text-primary)' }}>
                    {w.origin} → {w.destination}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
                    {w.depart_date ?? '?'}
                    {w.return_date ? ` a ${w.return_date}` : ''}
                    {w.target_price ? ` · alvo ${money(w.target_price, w.currency)}` : ''}
                  </p>
                </Link>
                <div style={{ textAlign: 'right' }}>
                  {latest && (
                    <p style={{ margin: 0, fontSize: 'var(--text-money)', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-primary)' }}>
                      {money(latest.price, w.currency)}
                    </p>
                  )}
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                    <StatusChip tone={tone}>{tag}</StatusChip>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Excluir o monitoramento ${w.origin} → ${w.destination}?`)) deleteWatch.mutate(w.id)
                    }}
                    style={{ marginTop: 4, border: 'none', background: 'none', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-body-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card style={{ marginTop: 16 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 'var(--text-h3)', color: 'var(--color-text-primary)' }}>Novo trecho</h2>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input placeholder="Origem (ex.: BSB)" required value={origin} onChange={(e) => setOrigin(e.target.value)} style={{ flex: '1 1 120px' }} />
            <Input placeholder="Destino (ex.: IGU)" required value={destination} onChange={(e) => setDestination(e.target.value)} style={{ flex: '1 1 120px' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input type="date" label="Ida" value={departDate} onChange={(e) => setDepartDate(e.target.value)} style={{ flex: '1 1 140px' }} />
            <Input type="date" label="Volta (opcional)" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} style={{ flex: '1 1 140px' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Preço alvo (opcional)"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              style={{ flex: 1 }}
            />
            <CurrencySelect value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </div>
          <Input placeholder="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button type="submit" fullWidth loading={createWatch.isPending}>
            Adicionar trecho
          </Button>
        </form>
      </Card>
    </div>
  )
}
