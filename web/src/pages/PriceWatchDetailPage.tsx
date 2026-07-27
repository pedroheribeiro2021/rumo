import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePriceWatch } from '../hooks/usePriceWatches'
import { useAddPriceObservation, useDeletePriceObservation, usePriceObservations } from '../hooks/usePriceObservations'
import { formatMoney as money } from '../lib/format'
import { PriceHistoryChart } from '../components/PriceHistoryChart'
import { Button, Card, EmptyState, Input, LoadingState } from '../components/ui'

export function PriceWatchDetailPage() {
  const { tripId, watchId } = useParams<{ tripId: string; watchId: string }>()
  const { data: watch } = usePriceWatch(watchId)
  const { data: observations, isLoading } = usePriceObservations(watchId)
  const addObservation = useAddPriceObservation(watchId!)
  const deleteObservation = useDeletePriceObservation(watchId!)

  const [observedAt, setObservedAt] = useState(() => new Date().toISOString().slice(0, 10))
  const [price, setPrice] = useState('')
  const [source, setSource] = useState('')
  const [note, setNote] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const priceNum = parseFloat(price.replace(',', '.'))
    if (!priceNum || priceNum <= 0) return
    await addObservation.mutateAsync({
      observed_at: observedAt,
      price: priceNum,
      source: source.trim() || null,
      note: note.trim() || null,
    })
    setPrice('')
    setSource('')
    setNote('')
  }

  if (!watch) return <LoadingState />

  return (
    <div>
      <Link to={`/trips/${tripId}/passagens`} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        ← Monitor de passagens
      </Link>
      <h1 style={{ margin: '6px 0 4px', fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>
        {watch.origin} → {watch.destination}
      </h1>
      <p style={{ margin: '0 0 16px', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        {watch.depart_date ?? '?'}
        {watch.return_date ? ` a ${watch.return_date}` : ''}
        {watch.target_price ? ` · alvo ${money(watch.target_price, watch.currency)}` : ' · sem alvo definido'}
      </p>

      {isLoading && <LoadingState />}
      {!isLoading && observations?.length === 0 && (
        <EmptyState icon="📈" title="Nenhuma observação ainda" message="Registre o primeiro preço abaixo." />
      )}

      {!isLoading && observations && observations.length > 0 && (
        <Card>
          <PriceHistoryChart observations={observations} targetPrice={watch.target_price} currency={watch.currency} />
        </Card>
      )}

      {!isLoading && observations && observations.length > 0 && (
        <Card style={{ marginTop: 16 }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 'var(--text-h3)', color: 'var(--color-text-primary)' }}>Histórico</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--color-text-tertiary)' }}>
                <th style={{ paddingBottom: 6, fontWeight: 500 }}>Data</th>
                <th style={{ paddingBottom: 6, fontWeight: 500 }}>Preço</th>
                <th style={{ paddingBottom: 6, fontWeight: 500 }}>Fonte</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {[...observations].reverse().map((o) => (
                <tr key={o.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '6px 0', color: 'var(--color-text-primary)' }}>{o.observed_at}</td>
                  <td style={{ padding: '6px 0', fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-primary)' }}>
                    {money(o.price, watch.currency)}
                  </td>
                  <td style={{ padding: '6px 0', color: 'var(--color-text-secondary)' }}>{o.source ?? '—'}</td>
                  <td style={{ padding: '6px 0', textAlign: 'right' }}>
                    <button
                      onClick={() => deleteObservation.mutate(o.id)}
                      style={{ border: 'none', background: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Card style={{ marginTop: 16 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 'var(--text-h3)', color: 'var(--color-text-primary)' }}>Registrar preço</h2>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input type="date" value={observedAt} onChange={(e) => setObservedAt(e.target.value)} style={{ flex: '1 1 140px' }} />
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Preço"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ flex: '1 1 140px' }}
            />
          </div>
          <Input placeholder="Fonte (ex.: Google Voos, Decolar)" value={source} onChange={(e) => setSource(e.target.value)} />
          <Input placeholder="Nota (opcional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button type="submit" fullWidth loading={addObservation.isPending}>
            Salvar observação
          </Button>
        </form>
      </Card>
    </div>
  )
}
