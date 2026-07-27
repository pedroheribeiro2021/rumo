import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateTrip, useDeleteTrip, useTrips } from '../hooks/useTrips'
import { Button, Card, CurrencySelect, EmptyState, Input, ListRow, LoadingState } from '../components/ui'

export function TripsPage() {
  const { data: trips, isLoading } = useTrips()
  const createTrip = useCreateTrip()
  const deleteTrip = useDeleteTrip()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [baseCurrency, setBaseCurrency] = useState('BRL')

  function resetForm() {
    setName('')
    setDestination('')
    setStartDate('')
    setEndDate('')
    setBaseCurrency('BRL')
    setShowForm(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    await createTrip.mutateAsync({
      name,
      destination: destination || null,
      start_date: startDate || null,
      end_date: endDate || null,
      base_currency: baseCurrency,
    })
    resetForm()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>Suas viagens</h1>
        <Button size="md" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancelar' : '+ Nova viagem'}
        </Button>
      </div>

      {showForm && (
        <Card style={{ marginTop: 16 }}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input required autoFocus placeholder="Nome da viagem" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Destino (opcional)" value={destination} onChange={(e) => setDestination(e.target.value)} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ flex: '1 1 140px' }} />
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ flex: '1 1 140px' }} />
            </div>
            <CurrencySelect label="Moeda base" value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)} />
            <Button type="submit" fullWidth loading={createTrip.isPending}>
              Criar viagem
            </Button>
          </form>
        </Card>
      )}

      <div style={{ marginTop: 20 }}>
        {isLoading && <LoadingState />}
        {!isLoading && trips?.length === 0 && <EmptyState icon="🧭" title="Nenhuma viagem ainda" message="Crie a primeira acima." />}
        {!isLoading && trips && trips.length > 0 && (
          <Card padding="sm">
            {trips.map((trip, i) => (
              <ListRow
                key={trip.id}
                title={trip.name}
                subtitle={`${trip.destination ? `${trip.destination} · ` : ''}${trip.start_date ?? '?'} a ${trip.end_date ?? '?'} · ${trip.base_currency}`}
                trailing={
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Excluir a viagem "${trip.name}"? Essa ação não pode ser desfeita.`)) {
                        deleteTrip.mutate(trip.id)
                      }
                    }}
                    style={{
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
                }
                onClick={() => navigate(`/trips/${trip.id}`)}
                divider={i < trips.length - 1}
              />
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}
