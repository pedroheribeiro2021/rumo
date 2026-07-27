import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import { useAddTripMember, useRemoveTripMember, useTripMembers } from '../hooks/useTripMembers'
import { Avatar, Button, Card, Input, ListRow, LoadingState } from '../components/ui'

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { data: trip, isLoading } = useTrip(tripId)
  const { data: members } = useTripMembers(tripId)
  const addMember = useAddTripMember(tripId!)
  const removeMember = useRemoveTripMember(tripId!)
  const [newMemberName, setNewMemberName] = useState('')

  if (isLoading) return <LoadingState />
  if (!trip) return <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>Viagem não encontrada.</p>

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    if (!newMemberName.trim()) return
    await addMember.mutateAsync({ display_name: newMemberName.trim(), role: 'member' })
    setNewMemberName('')
  }

  return (
    <div>
      <Link to="/" style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        ← Viagens
      </Link>

      <div style={{ marginTop: 6 }}>
        <h1 style={{ margin: 0, fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>{trip.name}</h1>
        <p style={{ margin: '4px 0 0', color: 'var(--color-text-secondary)', fontSize: 'var(--text-body-sm)' }}>
          {trip.destination ? `${trip.destination} · ` : ''}
          {trip.start_date ?? '?'} a {trip.end_date ?? '?'} · moeda base {trip.base_currency}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        <Link to={`/trips/${trip.id}/gastos`}>
          <Button>Gastos</Button>
        </Link>
        <Link to={`/trips/${trip.id}/orcamento`}>
          <Button variant="secondary">Orçamento</Button>
        </Link>
        <Link to={`/trips/${trip.id}/roteiro`}>
          <Button variant="secondary">Roteiro</Button>
        </Link>
        <Link to={`/trips/${trip.id}/passagens`}>
          <Button variant="secondary">Passagens</Button>
        </Link>
      </div>

      <Card style={{ marginTop: 24 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--text-h3)', color: 'var(--color-text-primary)' }}>Membros</h2>
        <div style={{ marginTop: 10 }}>
          {members?.map((m, i) => (
            <ListRow
              key={m.id}
              leading={<Avatar name={m.display_name} size="sm" />}
              title={m.display_name}
              subtitle={m.role === 'owner' ? 'dono' : undefined}
              trailing={
                m.role !== 'owner' ? (
                  <button
                    onClick={() => removeMember.mutate(m.id)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: 'var(--color-text-tertiary)',
                      fontSize: 'var(--text-body-sm)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Remover
                  </button>
                ) : undefined
              }
              divider={i < (members?.length ?? 0) - 1}
            />
          ))}
        </div>
        <form onSubmit={handleAddMember} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Input placeholder="Nome do viajante" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} style={{ flex: 1 }} />
          <Button type="submit" variant="secondary" loading={addMember.isPending}>
            Adicionar
          </Button>
        </form>
        <p style={{ marginTop: 8, fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
          Membros sem conta (só nome) já podem participar da divisão de gastos.
        </p>
      </Card>
    </div>
  )
}
