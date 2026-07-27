import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import { useCreateItineraryDay, useDeleteItineraryDay, useItineraryDays } from '../hooks/useItinerary'
import { Button, Card, EmptyState, Input, LoadingState } from '../components/ui'

function formatDayLabel(dayDate: string | null) {
  if (!dayDate) return '?'
  const [, month, day] = dayDate.split('-')
  return `${day}/${month}`
}

export function ItineraryPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { data: trip } = useTrip(tripId)
  const { data: days, isLoading } = useItineraryDays(tripId)
  const createDay = useCreateItineraryDay(tripId!)
  const deleteDay = useDeleteItineraryDay(tripId!)

  const [dayDate, setDayDate] = useState('')
  const [baseCity, setBaseCity] = useState('')
  const [country, setCountry] = useState('')
  const [notes, setNotes] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!baseCity.trim()) return
    await createDay.mutateAsync({
      day_date: dayDate || null,
      base_city: baseCity.trim(),
      country: country.trim() || null,
      notes: notes.trim() || null,
    })
    setDayDate('')
    setBaseCity('')
    setCountry('')
    setNotes('')
  }

  if (!trip) return <LoadingState />

  return (
    <div>
      <Link to={`/trips/${tripId}`} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        ← {trip.name}
      </Link>
      <h1 style={{ margin: '6px 0 16px', fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>Roteiro</h1>

      {isLoading && <LoadingState />}
      {!isLoading && days?.length === 0 && <EmptyState icon="🗺️" title="Nenhum dia no roteiro ainda" message="Adicione o primeiro abaixo." />}
      {!isLoading && days && days.length > 0 && (
        <Card>
          {days.map((d, i) => (
            <div
              key={d.id}
              style={{
                display: 'flex',
                gap: 12,
                padding: '10px 0',
                borderBottom: i < days.length - 1 ? '1px dashed var(--color-border)' : 'none',
              }}
            >
              <div style={{ minWidth: 46, fontWeight: 700, color: 'var(--color-primary-600)', fontSize: 'var(--text-body-sm)' }}>
                {formatDayLabel(d.day_date)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-body)', color: 'var(--color-text-primary)' }}>
                  {d.base_city}
                  {d.country ? ` · ${d.country}` : ''}
                </p>
                {d.notes && <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{d.notes}</p>}
              </div>
              <button
                onClick={() => deleteDay.mutate(d.id)}
                style={{ border: 'none', background: 'none', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-body-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                Excluir
              </button>
            </div>
          ))}
        </Card>
      )}

      <Card style={{ marginTop: 16 }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input type="date" value={dayDate} onChange={(e) => setDayDate(e.target.value)} style={{ flex: '1 1 140px' }} />
            <Input placeholder="Cidade" required value={baseCity} onChange={(e) => setBaseCity(e.target.value)} style={{ flex: '1 1 140px' }} />
            <Input placeholder="País (opcional)" value={country} onChange={(e) => setCountry(e.target.value)} style={{ flex: '1 1 140px' }} />
          </div>
          <Input placeholder="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button type="submit" fullWidth loading={createDay.isPending}>
            Adicionar dia
          </Button>
        </form>
      </Card>
    </div>
  )
}
