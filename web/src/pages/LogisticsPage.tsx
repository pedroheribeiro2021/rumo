import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import {
  useCreateLogisticsEntry,
  useDeleteLogisticsEntry,
  useLogisticsEntries,
  useUpdateLogisticsEntry,
} from '../hooks/useLogistics'
import type { LogisticsEntry } from '../lib/types'
import { formatMoney as money } from '../lib/format'
import { Button, Card, CurrencySelect, EmptyState, Fab, Input, ListRow, LoadingState, Modal, StatusChip, Tabs } from '../components/ui'

type EntryType = 'accommodation' | 'airport'

const EMPTY_FORM = {
  name: '',
  address: '',
  check_in: '',
  check_out: '',
  price: '',
  currency: 'BRL',
  link: '',
  notes: '',
  status: 'candidate',
}

export function LogisticsPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { data: trip } = useTrip(tripId)
  const { data: entries, isLoading } = useLogisticsEntries(tripId)
  const createEntry = useCreateLogisticsEntry(tripId!)
  const updateEntry = useUpdateLogisticsEntry(tripId!)
  const deleteEntry = useDeleteLogisticsEntry(tripId!)

  const [tab, setTab] = useState<EntryType>('accommodation')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<LogisticsEntry | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const filtered = useMemo(() => (entries ?? []).filter((e) => e.entry_type === tab), [entries, tab])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setOpen(true)
  }

  function openEdit(entry: LogisticsEntry) {
    setEditing(entry)
    setForm({
      name: entry.name,
      address: entry.address ?? '',
      check_in: entry.check_in ?? '',
      check_out: entry.check_out ?? '',
      price: entry.price != null ? String(entry.price) : '',
      currency: entry.currency ?? 'BRL',
      link: entry.link ?? '',
      notes: entry.notes ?? '',
      status: entry.status,
    })
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    const payload = {
      name: form.name.trim(),
      address: form.address.trim() || null,
      check_in: form.check_in || null,
      check_out: form.check_out || null,
      price: form.price ? parseFloat(form.price.replace(',', '.')) : null,
      currency: form.currency,
      link: form.link.trim() || null,
      notes: form.notes.trim() || null,
      status: form.status,
    }
    if (editing) {
      await updateEntry.mutateAsync({ id: editing.id, ...payload })
    } else {
      await createEntry.mutateAsync({ entry_type: tab, ...payload })
    }
    setOpen(false)
  }

  if (!trip) return <LoadingState />

  return (
    <div style={{ position: 'relative' }}>
      <Link to={`/trips/${tripId}`} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        ← {trip.name}
      </Link>
      <h1 style={{ margin: '6px 0 16px', fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>Logística</h1>

      <Tabs
        items={[
          { value: 'accommodation', label: 'Hospedagens' },
          { value: 'airport', label: 'Aeroportos' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as EntryType)}
      />

      <div style={{ marginTop: 16 }}>
        {isLoading && <LoadingState />}
        {!isLoading && filtered.length === 0 && (
          <EmptyState
            icon={tab === 'accommodation' ? '🛏️' : '✈️'}
            title={tab === 'accommodation' ? 'Nenhuma hospedagem cadastrada' : 'Nenhum aeroporto cadastrado'}
            message="Toque no + para adicionar."
          />
        )}
        {!isLoading && filtered.length > 0 && (
          <Card padding="sm">
            {filtered.map((entry, i) => (
              <ListRow
                key={entry.id}
                title={entry.name}
                subtitle={
                  [entry.address, entry.check_in ? `${entry.check_in}${entry.check_out ? ` a ${entry.check_out}` : ''}` : null]
                    .filter(Boolean)
                    .join(' · ') || undefined
                }
                onClick={() => openEdit(entry)}
                trailing={entry.price != null ? money(entry.price, entry.currency ?? 'BRL') : undefined}
                trailingSub={<StatusChip tone={entry.status === 'confirmed' ? 'good' : 'neutral'}>{entry.status === 'confirmed' ? 'confirmado' : 'candidato'}</StatusChip>}
                divider={i < filtered.length - 1}
              />
            ))}
          </Card>
        )}
      </div>

      <Fab icon="+" label="Novo item" onClick={openCreate} offsetBottom={24} />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar item' : tab === 'accommodation' ? 'Nova hospedagem' : 'Novo aeroporto'}
        footer={
          <Button type="submit" form="logistics-form" fullWidth size="lg" loading={createEntry.isPending || updateEntry.isPending}>
            Salvar
          </Button>
        }
      >
        <form id="logistics-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input required autoFocus placeholder="Nome" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Endereço (opcional)" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input
              type="date"
              label={tab === 'accommodation' ? 'Check-in' : 'Data'}
              value={form.check_in}
              onChange={(e) => setForm((f) => ({ ...f, check_in: e.target.value }))}
              style={{ flex: '1 1 140px' }}
            />
            {tab === 'accommodation' && (
              <Input
                type="date"
                label="Check-out"
                value={form.check_out}
                onChange={(e) => setForm((f) => ({ ...f, check_out: e.target.value }))}
                style={{ flex: '1 1 140px' }}
              />
            )}
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
          <Input placeholder="Link (opcional)" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
          <Input placeholder="Notas (opcional)" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />

          <div style={{ display: 'flex', gap: 12, fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="radio" checked={form.status === 'candidate'} onChange={() => setForm((f) => ({ ...f, status: 'candidate' }))} />
              Candidato
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="radio" checked={form.status === 'confirmed'} onChange={() => setForm((f) => ({ ...f, status: 'confirmed' }))} />
              Confirmado
            </label>
          </div>

          {editing && (
            <button
              type="button"
              onClick={async () => {
                await deleteEntry.mutateAsync(editing.id)
                setOpen(false)
              }}
              style={{ border: 'none', background: 'none', color: 'var(--color-error)', fontSize: 'var(--text-body-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)', alignSelf: 'flex-start' }}
            >
              Excluir
            </button>
          )}
        </form>
      </Modal>
    </div>
  )
}
