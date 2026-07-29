import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import { useTripMembers } from '../hooks/useTripMembers'
import { useAuth } from '../contexts/AuthContext'
import { useCreateItineraryDay, useDeleteItineraryDay, useItineraryDays, useUpdateItineraryDay } from '../hooks/useItinerary'
import { useCreateIdea, useDeleteIdea, useItineraryIdeas, usePromoteIdea, useUpdateIdea } from '../hooks/useItineraryIdeas'
import type { ItineraryDay, ItineraryIdea } from '../lib/types'
import { Button, Card, EmptyState, Fab, Input, LoadingState, Modal, StatusChip, Tabs } from '../components/ui'

function formatDayLabel(dayDate: string | null) {
  if (!dayDate) return '?'
  const [, month, day] = dayDate.split('-')
  return `${day}/${month}`
}

const IDEA_TYPES = [
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'poi', label: 'Ponto turístico' },
  { value: 'activity', label: 'Atividade' },
  { value: 'day_plan', label: 'Plano de dia' },
]

function ideaTypeLabel(value: string) {
  return IDEA_TYPES.find((t) => t.value === value)?.label ?? value
}

export function ItineraryPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { data: trip } = useTrip(tripId)
  const [section, setSection] = useState<'roteiro' | 'ideias'>('roteiro')

  if (!trip) return <LoadingState />

  return (
    <div>
      <Link to={`/trips/${tripId}`} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        ← {trip.name}
      </Link>
      <h1 style={{ margin: '6px 0 12px', fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>Roteiro</h1>

      <Tabs
        items={[
          { value: 'roteiro', label: 'Roteiro' },
          { value: 'ideias', label: 'Ideias' },
        ]}
        value={section}
        onChange={(v) => setSection(v as 'roteiro' | 'ideias')}
      />

      <div style={{ marginTop: 16 }}>
        {section === 'roteiro' ? <RoteiroSection tripId={tripId!} /> : <IdeiasSection tripId={tripId!} />}
      </div>
    </div>
  )
}

function RoteiroSection({ tripId }: { tripId: string }) {
  const { data: days, isLoading } = useItineraryDays(tripId)
  const createDay = useCreateItineraryDay(tripId)
  const updateDay = useUpdateItineraryDay(tripId)
  const deleteDay = useDeleteItineraryDay(tripId)

  const [dayDate, setDayDate] = useState('')
  const [baseCity, setBaseCity] = useState('')
  const [country, setCountry] = useState('')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')

  const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null)
  const [editDayDate, setEditDayDate] = useState('')
  const [editBaseCity, setEditBaseCity] = useState('')
  const [editCountry, setEditCountry] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editNotes, setEditNotes] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!baseCity.trim()) return
    await createDay.mutateAsync({
      day_date: dayDate || null,
      base_city: baseCity.trim(),
      country: country.trim() || null,
      title: title.trim() || null,
      notes: notes.trim() || null,
    })
    setDayDate('')
    setBaseCity('')
    setCountry('')
    setTitle('')
    setNotes('')
  }

  function openEdit(d: ItineraryDay) {
    setEditingDay(d)
    setEditDayDate(d.day_date ?? '')
    setEditBaseCity(d.base_city ?? '')
    setEditCountry(d.country ?? '')
    setEditTitle(d.title ?? '')
    setEditNotes(d.notes ?? '')
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingDay) return
    await updateDay.mutateAsync({
      id: editingDay.id,
      day_date: editDayDate || null,
      base_city: editBaseCity.trim() || null,
      country: editCountry.trim() || null,
      title: editTitle.trim() || null,
      notes: editNotes.trim() || null,
    })
    setEditingDay(null)
  }

  return (
    <>
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
                {d.title && <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-primary-700)' }}>{d.title}</p>}
                {d.notes && <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{d.notes}</p>}
              </div>
              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                <button
                  onClick={() => openEdit(d)}
                  style={{ border: 'none', background: 'none', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-body-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteDay.mutate(d.id)}
                  style={{ border: 'none', background: 'none', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-body-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                >
                  Excluir
                </button>
              </div>
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
          <Input placeholder="Título do dia (opcional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button type="submit" fullWidth loading={createDay.isPending}>
            Adicionar dia
          </Button>
        </form>
      </Card>

      <Modal open={!!editingDay} onClose={() => setEditingDay(null)} title="Editar dia">
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input type="date" value={editDayDate} onChange={(e) => setEditDayDate(e.target.value)} style={{ flex: '1 1 140px' }} />
            <Input placeholder="Cidade" required value={editBaseCity} onChange={(e) => setEditBaseCity(e.target.value)} style={{ flex: '1 1 140px' }} />
            <Input placeholder="País (opcional)" value={editCountry} onChange={(e) => setEditCountry(e.target.value)} style={{ flex: '1 1 140px' }} />
          </div>
          <Input placeholder="Título do dia (opcional)" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <Input placeholder="Notas (opcional)" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
          <Button type="submit" fullWidth loading={updateDay.isPending}>
            Salvar alterações
          </Button>
        </form>
      </Modal>
    </>
  )
}

const EMPTY_IDEA_FORM = { title: '', idea_type: 'activity', day_id: '', notes: '', link: '' }

function IdeiasSection({ tripId }: { tripId: string }) {
  const { session } = useAuth()
  const { data: members } = useTripMembers(tripId)
  const { data: days } = useItineraryDays(tripId)
  const { data: ideas, isLoading } = useItineraryIdeas(tripId)
  const createIdea = useCreateIdea(tripId)
  const updateIdea = useUpdateIdea(tripId)
  const deleteIdea = useDeleteIdea(tripId)
  const promoteIdea = usePromoteIdea(tripId)

  const myMemberId = useMemo(() => members?.find((m) => m.profile_id === session?.user.id)?.id, [members, session])

  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ItineraryIdea | null>(null)
  const [form, setForm] = useState(EMPTY_IDEA_FORM)

  const filtered = useMemo(
    () => (ideas ?? []).filter((idea) => typeFilter === 'all' || idea.idea_type === typeFilter),
    [ideas, typeFilter],
  )

  const groups = useMemo(() => {
    const withoutDay = filtered.filter((i) => !i.day_id)
    const byDay = (days ?? []).map((d) => ({ day: d, ideas: filtered.filter((i) => i.day_id === d.id) })).filter((g) => g.ideas.length > 0)
    return { withoutDay, byDay }
  }, [filtered, days])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_IDEA_FORM)
    setOpen(true)
  }

  function openEdit(idea: ItineraryIdea) {
    setEditing(idea)
    setForm({ title: idea.title, idea_type: idea.idea_type, day_id: idea.day_id ?? '', notes: idea.notes ?? '', link: idea.link ?? '' })
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    if (editing) {
      await updateIdea.mutateAsync({
        id: editing.id,
        title: form.title.trim(),
        idea_type: form.idea_type,
        day_id: form.day_id || null,
        notes: form.notes.trim() || null,
        link: form.link.trim() || null,
      })
    } else {
      await createIdea.mutateAsync({
        title: form.title.trim(),
        idea_type: form.idea_type,
        day_id: form.day_id || null,
        notes: form.notes.trim() || null,
        link: form.link.trim() || null,
        created_by: myMemberId,
      })
    }
    setOpen(false)
  }

  function renderIdea(idea: ItineraryIdea) {
    const tone = idea.status === 'chosen' ? 'good' : idea.status === 'discarded' ? 'bad' : 'neutral'
    return (
      <Card key={idea.id} padding="sm" style={{ marginBottom: 8, opacity: idea.status === 'discarded' ? 0.5 : 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-body)', color: 'var(--color-text-primary)' }}>{idea.title}</p>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{ideaTypeLabel(idea.idea_type)}</p>
            {idea.notes && <p style={{ margin: '4px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{idea.notes}</p>}
            {idea.link && (
              <a href={idea.link} target="_blank" rel="noreferrer" style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-brand)' }}>
                Link
              </a>
            )}
          </div>
          <StatusChip tone={tone}>{idea.status === 'chosen' ? 'escolhida' : idea.status === 'discarded' ? 'descartada' : 'candidata'}</StatusChip>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={() => promoteIdea.mutate(idea)}
            disabled={!idea.day_id || idea.status === 'chosen'}
            title={!idea.day_id ? 'Vincule a um dia do roteiro pra poder confirmar' : undefined}
            style={{
              border: 'none',
              background: 'none',
              color: !idea.day_id || idea.status === 'chosen' ? 'var(--color-text-tertiary)' : 'var(--color-brand)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 600,
              cursor: !idea.day_id || idea.status === 'chosen' ? 'default' : 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Promover
          </button>
          <button
            onClick={() => openEdit(idea)}
            style={{ border: 'none', background: 'none', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-body-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            Editar
          </button>
          <button
            onClick={() => deleteIdea.mutate(idea.id)}
            style={{ border: 'none', background: 'none', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-body-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            Excluir
          </button>
        </div>
      </Card>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <Tabs
        items={[{ value: 'all', label: 'Todas' }, ...IDEA_TYPES]}
        value={typeFilter}
        onChange={setTypeFilter}
      />

      <div style={{ marginTop: 16 }}>
        {isLoading && <LoadingState />}
        {!isLoading && filtered.length === 0 && (
          <EmptyState icon="💡" title="Nenhuma ideia ainda" message="Toque no + para brainstormar restaurantes, pontos turísticos, atividades ou planos alternativos." />
        )}

        {!isLoading && groups.withoutDay.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 'var(--text-h3)', color: 'var(--color-text-primary)' }}>Sem dia definido</h2>
            {groups.withoutDay.map(renderIdea)}
          </div>
        )}

        {!isLoading &&
          groups.byDay.map(({ day, ideas: dayIdeas }) => (
            <div key={day.id} style={{ marginBottom: 20 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 'var(--text-h3)', color: 'var(--color-text-primary)' }}>
                {formatDayLabel(day.day_date)} {day.base_city ? `· ${day.base_city}` : ''}
              </h2>
              {dayIdeas.map(renderIdea)}
            </div>
          ))}
      </div>

      <Fab icon="+" label="Nova ideia" onClick={openCreate} offsetBottom={24} />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar ideia' : 'Nova ideia'}
        footer={
          <Button type="submit" form="idea-form" fullWidth size="lg" loading={createIdea.isPending || updateIdea.isPending}>
            Salvar
          </Button>
        }
      >
        <form id="idea-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input required autoFocus placeholder="Título" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {IDEA_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, idea_type: t.value }))}
                style={{
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  background: form.idea_type === t.value ? 'var(--color-brand)' : 'var(--color-surface-sunken)',
                  color: form.idea_type === t.value ? '#fff' : 'var(--color-text-secondary)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)' }}>
            <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
              Dia do roteiro (opcional)
            </span>
            <select
              value={form.day_id}
              onChange={(e) => setForm((f) => ({ ...f, day_id: e.target.value }))}
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
              <option value="">Sem dia definido</option>
              {days?.map((d) => (
                <option key={d.id} value={d.id}>
                  {formatDayLabel(d.day_date)} {d.base_city ? `· ${d.base_city}` : ''}
                </option>
              ))}
            </select>
          </label>

          <Input placeholder="Notas (opcional)" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          <Input placeholder="Link (opcional)" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
        </form>
      </Modal>
    </div>
  )
}
