import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTrip, useUpdateTrip, useUploadTripCover } from '../hooks/useTrips'
import { useAddTripMember, useInviteTripMember, useRemoveTripMember, useTripMembers } from '../hooks/useTripMembers'
import { Avatar, Button, Card, CurrencySelect, Input, ListRow, LoadingState, Modal, StatusChip } from '../components/ui'

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const { data: trip, isLoading } = useTrip(tripId)
  const { data: members } = useTripMembers(tripId)
  const addMember = useAddTripMember(tripId!)
  const inviteMember = useInviteTripMember(tripId!)
  const removeMember = useRemoveTripMember(tripId!)
  const updateTrip = useUpdateTrip()
  const uploadCover = useUploadTripCover(tripId!)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')

  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDestination, setEditDestination] = useState('')
  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const [editCurrency, setEditCurrency] = useState('BRL')

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

  function openEdit() {
    setEditName(trip!.name)
    setEditDestination(trip!.destination ?? '')
    setEditStartDate(trip!.start_date ?? '')
    setEditEndDate(trip!.end_date ?? '')
    setEditCurrency(trip!.base_currency)
    setEditOpen(true)
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    await updateTrip.mutateAsync({
      id: trip!.id,
      name: editName,
      destination: editDestination || null,
      start_date: editStartDate || null,
      end_date: editEndDate || null,
      base_currency: editCurrency,
    })
    setEditOpen(false)
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) await uploadCover.mutateAsync(file)
    e.target.value = ''
  }

  return (
    <div>
      <Link to="/" style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        ← Viagens
      </Link>

      <div
        style={{
          marginTop: 6,
          padding: trip.cover_image_url ? 16 : 0,
          borderRadius: 'var(--radius-lg)',
          backgroundImage: trip.cover_image_url ? `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${trip.cover_image_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 'var(--text-h1)', color: trip.cover_image_url ? '#fff' : 'var(--color-text-primary)' }}>{trip.name}</h1>
            <p style={{ margin: '4px 0 0', color: trip.cover_image_url ? 'rgba(255,255,255,0.85)' : 'var(--color-text-secondary)', fontSize: 'var(--text-body-sm)' }}>
              {trip.destination ? `${trip.destination} · ` : ''}
              {trip.start_date ?? '?'} a {trip.end_date ?? '?'} · moeda base {trip.base_currency}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <label
              aria-label="Alterar capa"
              style={{
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-full)',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              🖼️
              <input type="file" accept="image/*" onChange={handleCoverChange} style={{ display: 'none' }} />
            </label>
            <button
              onClick={openEdit}
              aria-label="Editar viagem"
              style={{
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-full)',
                width: 36,
                height: 36,
                flexShrink: 0,
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              ✎
            </button>
          </div>
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar viagem">
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input required placeholder="Nome da viagem" value={editName} onChange={(e) => setEditName(e.target.value)} />
          <Input placeholder="Destino (opcional)" value={editDestination} onChange={(e) => setEditDestination(e.target.value)} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} style={{ flex: '1 1 140px' }} />
            <Input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} style={{ flex: '1 1 140px' }} />
          </div>
          <CurrencySelect label="Moeda base" value={editCurrency} onChange={(e) => setEditCurrency(e.target.value)} />
          <Button type="submit" fullWidth loading={updateTrip.isPending}>
            Salvar alterações
          </Button>
        </form>
      </Modal>

      <Card style={{ marginTop: 16 }} padding="sm">
        <ListRow title="Passagens" subtitle="Monitor de preços" onClick={() => navigate(`/trips/${trip.id}/passagens`)} divider />
        <ListRow title="Câmbio" subtitle="Calculadora de conversão" onClick={() => navigate(`/trips/${trip.id}/cambio`)} divider />
        <ListRow title="Checklist" subtitle="Lista de bagagem/pré-viagem" onClick={() => navigate(`/trips/${trip.id}/checklist`)} divider={false} />
      </Card>

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
