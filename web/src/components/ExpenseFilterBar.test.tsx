import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ExpenseFilterBar } from './ExpenseFilterBar'
import { EMPTY_FILTERS } from '../lib/expenseFilters'

const dayOptions = [
  { value: 'all', kind: 'all' as const },
  { value: '2026-11-01', kind: 'day' as const, date: '2026-11-01' },
  { value: '2026-11-02', kind: 'day' as const, date: '2026-11-02', isToday: true },
]
const members = [{ id: 'p', display_name: 'Pedro Ribeiro' }]

afterEach(cleanup)

describe('ExpenseFilterBar', () => {
  it('chip de dia filtra com 1 toque e "Hoje" aparece no lugar da data', () => {
    const onChange = vi.fn()
    render(<ExpenseFilterBar filters={EMPTY_FILTERS} onChange={onChange} dayOptions={dayOptions} categories={['transporte']} members={members} />)
    fireEvent.click(screen.getByText('01/11'))
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FILTERS, day: '2026-11-01' })
    expect(screen.getByText('Hoje')).toBeInTheDocument()
  })

  it('filtros secundários ficam atrás de "Filtros" e categoria alterna', () => {
    const onChange = vi.fn()
    render(<ExpenseFilterBar filters={EMPTY_FILTERS} onChange={onChange} dayOptions={dayOptions} categories={['transporte']} members={members} />)
    expect(screen.queryByText('transporte')).toBeNull()
    fireEvent.click(screen.getByText('Filtros'))
    fireEvent.click(screen.getByText('transporte'))
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FILTERS, category: 'transporte' })
    expect(screen.getByText('Pedro')).toBeInTheDocument()
  })

  it('"Limpar" só aparece com filtro ativo e zera tudo', () => {
    const onChange = vi.fn()
    render(<ExpenseFilterBar filters={{ ...EMPTY_FILTERS, query: 'uber' }} onChange={onChange} dayOptions={dayOptions} categories={[]} members={members} />)
    fireEvent.click(screen.getByText('Limpar'))
    expect(onChange).toHaveBeenCalledWith(EMPTY_FILTERS)
  })
})
