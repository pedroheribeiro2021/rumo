import { describe, expect, it } from 'vitest'
import { computeSpentByCategory, computeSpentByDay } from './budget'

describe('computeSpentByCategory', () => {
  it('soma gastos da mesma categoria', () => {
    const expenses = [
      { category: 'alimentação', spent_on: '2026-11-01', amount: 30, fx_to_base: 1 },
      { category: 'alimentação', spent_on: '2026-11-02', amount: 20, fx_to_base: 1 },
      { category: 'transporte', spent_on: '2026-11-01', amount: 10, fx_to_base: 1 },
    ]
    expect(computeSpentByCategory(expenses)).toEqual({ alimentação: 50, transporte: 10 })
  })

  it('categoria nula cai em "outros"', () => {
    const expenses = [{ category: null, spent_on: '2026-11-01', amount: 15, fx_to_base: 1 }]
    expect(computeSpentByCategory(expenses)).toEqual({ outros: 15 })
  })

  it('converte pra moeda base usando fx_to_base', () => {
    const expenses = [{ category: 'passeio', spent_on: '2026-11-01', amount: 10, fx_to_base: 5.5 }]
    expect(computeSpentByCategory(expenses)).toEqual({ passeio: 55 })
  })
})

describe('computeSpentByDay', () => {
  it('soma gastos do mesmo dia independente da categoria', () => {
    const expenses = [
      { category: 'alimentação', spent_on: '2026-11-01', amount: 30, fx_to_base: 1 },
      { category: 'transporte', spent_on: '2026-11-01', amount: 20, fx_to_base: 1 },
      { category: 'passeio', spent_on: '2026-11-02', amount: 10, fx_to_base: 1 },
    ]
    expect(computeSpentByDay(expenses)).toEqual({ '2026-11-01': 50, '2026-11-02': 10 })
  })
})
