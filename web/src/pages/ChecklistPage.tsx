import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import { useChecklistItems, useCreateChecklistItem, useDeleteChecklistItem, useToggleChecklistItem } from '../hooks/useChecklist'
import { Button, Card, EmptyState, Input, LoadingState } from '../components/ui'

export function ChecklistPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { data: trip } = useTrip(tripId)
  const { data: items, isLoading } = useChecklistItems(tripId)
  const createItem = useCreateChecklistItem(tripId!)
  const toggleItem = useToggleChecklistItem(tripId!)
  const deleteItem = useDeleteChecklistItem(tripId!)

  const [title, setTitle] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await createItem.mutateAsync(title.trim())
    setTitle('')
  }

  if (!trip) return <LoadingState />

  const doneCount = (items ?? []).filter((i) => i.done).length

  return (
    <div>
      <Link to={`/trips/${tripId}`} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
        ← {trip.name}
      </Link>
      <h1 style={{ margin: '6px 0 4px', fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>Checklist</h1>
      {items && items.length > 0 && (
        <p style={{ margin: '0 0 16px', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
          {doneCount} de {items.length} concluídos
        </p>
      )}

      {isLoading && <LoadingState />}
      {!isLoading && items?.length === 0 && (
        <EmptyState icon="🧳" title="Nenhum item ainda" message="Adicione o que não pode esquecer de levar/fazer antes da viagem." />
      )}
      {!isLoading && items && items.length > 0 && (
        <Card padding="sm">
          {items.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 4px',
                borderBottom: i < items.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <input
                type="checkbox"
                checked={item.done}
                onChange={(e) => toggleItem.mutate({ id: item.id, done: e.target.checked })}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: 'var(--text-body)',
                  color: item.done ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                  textDecoration: item.done ? 'line-through' : 'none',
                }}
              >
                {item.title}
              </span>
              <button
                onClick={() => deleteItem.mutate(item.id)}
                style={{ border: 'none', background: 'none', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-body-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                Excluir
              </button>
            </div>
          ))}
        </Card>
      )}

      <Card style={{ marginTop: 16 }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8 }}>
          <Input placeholder="Novo item (ex.: passaporte)" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 1 }} />
          <Button type="submit" loading={createItem.isPending}>
            Adicionar
          </Button>
        </form>
      </Card>
    </div>
  )
}
