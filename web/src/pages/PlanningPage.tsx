import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import { useTripMembers } from '../hooks/useTripMembers'
import { useAuth } from '../contexts/AuthContext'
import { useItineraryDays } from '../hooks/useItinerary'
import {
  useCreatePlanningOption,
  useDeletePlanningOption,
  usePlanningOptions,
  usePromotePlanningOption,
  useUpdatePlanningOption,
} from '../hooks/usePlanningOptions'
import { useCreatePlanningCategory, useDeletePlanningCategory, usePlanningCategories } from '../hooks/usePlanningCategories'
import type { PlanningOption } from '../lib/types'
import { groupByCity } from '../lib/planning'
import { formatMoney as money } from '../lib/format'
import { Button, Card, CurrencySelect, EmptyState, Fab, Input, LoadingState, Modal, StatusChip, Tabs } from '../components/ui'

function segmentLabel(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value
}

function formatDay(dayDate: string | null) {
  if (!dayDate) return '?'
  const [, month, day] = dayDate.split('-')
  return `${day}/${month}`
}

const EMPTY_FORM = {
  title: '',
  segment: 'atividade',
  city: '',
  address: '',
  price: '',
  currency: 'BRL',
  date_from: '',
  date_to: '',
  day_id: '',
  notes: '',
  link: '',
  status: 'candidate',
}

export function PlanningPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { session } = useAuth()
  const { data: trip } = useTrip(tripId)
  const { data: members } = useTripMembers(tripId)
  const { data: days } = useItineraryDays(tripId)
  const { data: options, isLoading } = usePlanningOptions(tripId)
  const { data: categories } = usePlanningCategories(tripId)
  const createOption = useCreatePlanningOption(tripId!)
  const updateOption = useUpdatePlanningOption(tripId!)
  const deleteOption = useDeletePlanningOption(tripId!)
  const promoteOption = usePromotePlanningOption(tripId!)
  const createCategory = useCreatePlanningCategory(tripId!)
  const deleteCategory = useDeletePlanningCategory(tripId!)

  const myMemberId = useMemo(() => members?.find((m) => m.profile_id === session?.user.id)?.id, [members, session])

  const [segmentFilter, setSegmentFilter] = useState('all')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PlanningOption | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [newCategoryName, setNewCategoryName] = useState('')

  const filtered = useMemo(
    () => (options ?? []).filter((o) => segmentFilter === 'all' || o.segment === segmentFilter),
    [options, segmentFilter],
  )
  const groups = useMemo(() => groupByCity(filtered), [filtered])

  const dayLabel = useMemo(() => {
    const map = new Map<string, string>()
    for (const d of days ?? []) map.set(d.id, `${formatDay(d.day_date)}${d.base_city ? ` · ${d.base_city}` : ''}`)
    return map
  }, [days])

  function openCreate() {
    setEditing(null)
    setForm({ ...EMPTY_FORM, segment: categories?.[0]?.name ?? 'outro' })
    setOpen(true)
  }

  async function handleAddCategory() {
    const name = newCategoryName.trim()
    if (!name) return
    await createCategory.mutateAsync(name)
    setNewCategoryName('')
  }

  function openEdit(option: PlanningOption) {
    setEditing(option)
    setForm({
      title: option.title,
      segment: option.segment,
      city: option.city ?? '',
      address: option.address ?? '',
      price: option.price != null ? String(option.price) : '',
      currency: option.currency ?? 'BRL',
      date_from: option.date_from ?? '',
      date_to: option.date_to ?? '',
      day_id: option.day_id ?? '',
      notes: option.notes ?? '',
      link: option.link ?? '',
      status: option.status,
    })
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    const payload = {
      title: form.title.trim(),
      segment: form.segment,
      city: form.city.trim() || null,
      address: form.address.trim() || null,
      price: form.price ? parseFloat(form.price.replace(',', '.')) : null,
      currency: form.currency,
      date_from: form.date_from || null,
      date_to: form.date_to || null,
      day_id: form.day_id || null,
      notes: form.notes.trim() || null,
      link: form.link.trim() || null,
    }
    if (editing) {
      await updateOption.mutateAsync({ id: editing.id, ...payload, status: form.status })
    } else {
      await createOption.mutateAsync({ ...payload, created_by: myMemberId })
    }
    setOpen(false)
  }

  if (!trip) return <LoadingState />

  return (
    <div style={{ position: 'relative' }}>
      <Link to={`/trips/${tripId}`} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        ← {trip.name}
      </Link>
      <h1 style={{ margin: '6px 0 16px', fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>Planejamento</h1>

      <Tabs
        items={[{ value: 'all', label: 'Todas' }, ...(categories ?? []).map((c) => ({ value: c.name, label: segmentLabel(c.name) }))]}
        value={segmentFilter}
        onChange={setSegmentFilter}
      />

      <Card padding="sm" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {categories?.map((c) => (
            <span
              key={c.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-surface-sunken)',
                padding: '6px 10px',
                fontSize: 12,
                color: 'var(--color-text-secondary)',
              }}
            >
              {segmentLabel(c.name)}
              <button
                onClick={() => deleteCategory.mutate(c.id)}
                aria-label={`Excluir categoria ${c.name}`}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', fontSize: 13, padding: 0, lineHeight: 1 }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <Input placeholder="+ nova categoria" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} style={{ flex: 1 }} />
          <Button type="button" variant="secondary" onClick={handleAddCategory} loading={createCategory.isPending}>
            Cadastrar
          </Button>
        </div>
      </Card>

      <div style={{ marginTop: 16 }}>
        {isLoading && <LoadingState />}
        {!isLoading && filtered.length === 0 && (
          <EmptyState
            icon="🗒️"
            title="Nenhuma opção cadastrada ainda"
            message="Toque no + pra registrar hospedagens, passeios, restaurantes e outras opções que você está comparando."
          />
        )}

        {!isLoading &&
          groups.map(({ city, options: cityOptions }) => (
            <div key={city} style={{ marginBottom: 20 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 'var(--text-h3)', color: 'var(--color-text-primary)' }}>{city}</h2>
              {cityOptions.map((option) => {
                const tone = option.status === 'chosen' ? 'good' : option.status === 'discarded' ? 'bad' : 'neutral'
                return (
                  <Card
                    key={option.id}
                    padding="sm"
                    style={{ marginBottom: 8, opacity: option.status === 'discarded' ? 0.5 : 1 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-body)', color: 'var(--color-text-primary)' }}>
                          {option.title}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
                          {segmentLabel(option.segment)}
                          {option.address ? ` · ${option.address}` : ''}
                          {option.day_id && dayLabel.has(option.day_id) ? ` · dia ${dayLabel.get(option.day_id)}` : ''}
                        </p>
                        {(option.date_from || option.date_to) && (
                          <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
                            {option.date_from ?? '?'}
                            {option.date_to ? ` a ${option.date_to}` : ''}
                          </p>
                        )}
                        {option.notes && (
                          <p style={{ margin: '4px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{option.notes}</p>
                        )}
                        {option.link && (
                          <a href={option.link} target="_blank" rel="noreferrer" style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-brand)' }}>
                            Link
                          </a>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {option.price != null && (
                          <p style={{ margin: '0 0 4px', fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                            {money(option.price, option.currency ?? 'BRL')}
                          </p>
                        )}
                        <StatusChip tone={tone}>
                          {option.status === 'chosen' ? 'escolhida' : option.status === 'discarded' ? 'descartada' : 'candidata'}
                        </StatusChip>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                      <button
                        onClick={() => promoteOption.mutate(option)}
                        disabled={option.status === 'chosen'}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: option.status === 'chosen' ? 'var(--color-text-tertiary)' : 'var(--color-brand)',
                          fontSize: 'var(--text-body-sm)',
                          fontWeight: 600,
                          cursor: option.status === 'chosen' ? 'default' : 'pointer',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        Promover
                      </button>
                      <button
                        onClick={() => openEdit(option)}
                        style={{ border: 'none', background: 'none', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-body-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteOption.mutate(option.id)}
                        style={{ border: 'none', background: 'none', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-body-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                      >
                        Excluir
                      </button>
                    </div>
                  </Card>
                )
              })}
            </div>
          ))}
      </div>

      <Fab icon="+" label="Nova opção" onClick={openCreate} offsetBottom={24} />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar opção' : 'Nova opção de planejamento'}
        footer={
          <Button type="submit" form="planning-form" fullWidth size="lg" loading={createOption.isPending || updateOption.isPending}>
            Salvar
          </Button>
        }
      >
        <form id="planning-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input required autoFocus placeholder="Nome (ex.: Hotel OZ, La Cevichería...)" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories?.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, segment: s.name }))}
                style={{
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  background: form.segment === s.name ? 'var(--color-brand)' : 'var(--color-surface-sunken)',
                  color: form.segment === s.name ? '#fff' : 'var(--color-text-secondary)',
                }}
              >
                {segmentLabel(s.name)}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input placeholder="Cidade" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} style={{ flex: '1 1 140px' }} />
            <Input placeholder="Endereço/local (opcional)" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} style={{ flex: '1 1 140px' }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              type="number"
              step="0.01"
              placeholder="Preço (opcional)"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              style={{ flex: 1 }}
            />
            <CurrencySelect value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input type="date" label="De (opcional)" value={form.date_from} onChange={(e) => setForm((f) => ({ ...f, date_from: e.target.value }))} style={{ flex: '1 1 140px' }} />
            <Input type="date" label="Até (opcional)" value={form.date_to} onChange={(e) => setForm((f) => ({ ...f, date_to: e.target.value }))} style={{ flex: '1 1 140px' }} />
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
                  {formatDay(d.day_date)} {d.base_city ? `· ${d.base_city}` : ''}
                </option>
              ))}
            </select>
          </label>

          <Input placeholder="Link (opcional)" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
          <Input placeholder="Notas (opcional)" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />

          {editing && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="radio" checked={form.status === 'candidate'} onChange={() => setForm((f) => ({ ...f, status: 'candidate' }))} />
                Candidata
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="radio" checked={form.status === 'chosen'} onChange={() => setForm((f) => ({ ...f, status: 'chosen' }))} />
                Escolhida
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="radio" checked={form.status === 'discarded'} onChange={() => setForm((f) => ({ ...f, status: 'discarded' }))} />
                Descartada
              </label>
            </div>
          )}
        </form>
      </Modal>
    </div>
  )
}
