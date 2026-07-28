import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import { useAddTripMember, useInviteTripMember, useRemoveTripMember, useTripMembers } from '../hooks/useTripMembers'
import { Avatar, Button, Card, Input, ListRow, LoadingState, StatusChip } from '../components/ui'

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { data: trip, isLoading } = useTrip(tripId)
  const { data: members } = useTripMembers(tripId)
  const addMember = useAddTripMember(tripId!)
  const inviteMember = useInviteTripMember(tripId!)
  const removeMember = useRemoveTripMember(tripId!)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')

  if (isLoading) return <LoadingState />
  if (!trip) return <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>Viagem não encontrada.</p>

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    if (!newMemberName.trim()) return
    if (newMemberEmail.trim()) {
      await inviteMember.mutateAsync({ email: newMemberEmail.trim(), displayName: newMemberName.trim() })
    } else {
      await addMember.mutateAsync({ display_name: newMemberName.trim(), role: 'member' })
    }
    setNewMemberName('')
    setNewMemberEmail('')
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {m.role !== 'owner' && m.profile_id && <StatusChip tone="good">conta vinculada</StatusChip>}
                  {m.role !== 'owner' && !m.profile_id && m.email && <StatusChip tone="warn">convite pendente</StatusChip>}
                  {m.role !== 'owner' && (
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
                  )}
                </div>
              }
              divider={i < (members?.length ?? 0) - 1}
            />
          ))}
        </div>
        <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input
              placeholder="Nome do viajante"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              style={{ flex: '1 1 140px' }}
            />
            <Input
              type="email"
              placeholder="E-mail (opcional — pra ela(e) acessar com a própria conta)"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              style={{ flex: '1 1 220px' }}
            />
          </div>
          <Button type="submit" variant="secondary" loading={addMember.isPending || inviteMember.isPending}>
            {newMemberEmail.trim() ? 'Convidar' : 'Adicionar'}
          </Button>
        </form>
        <p style={{ marginTop: 8, fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
          Sem e-mail, o membro só participa da divisão de gastos. Com e-mail: se a pessoa já tem conta, o acesso libera
          na hora; se não tem, é só criar conta com esse mesmo e-mail que a viagem aparece pra ela sozinha.
        </p>
      </Card>
    </div>
  )
}
