import { describe, expect, it } from 'vitest'
import {
  EMPTY_FILTERS,
  addDays,
  buildDayOptions,
  filterExpenses,
  filtersFromParams,
  filtersToParams,
  groupExpensesByDay,
  hasActiveFilters,
} from './expenseFilters'

const PEDRO = 'p'
const BRUNA = 'b'
const range = { start_date: '2026-10-31', end_date: '2026-11-09' }

function exp(over: Partial<Parameters<typeof filterExpenses>[0][number]> = {}) {
  return {
    spent_on: '2026-11-01',
    description: 'Gasto',
    category: 'alimentação',
    paid_by: PEDRO,
    amount: 10,
    fx_to_base: 1,
    splits: [{ member_id: PEDRO }, { member_id: BRUNA }],
    ...over,
  }
}

describe('filterExpenses', () => {
  it('sem filtro devolve tudo', () => {
    const list = [exp(), exp({ spent_on: '2026-08-08' })]
    expect(filterExpenses(list, EMPTY_FILTERS, range)).toHaveLength(2)
  })

  it('filtra por dia exato', () => {
    const list = [exp({ spent_on: '2026-11-01' }), exp({ spent_on: '2026-11-02' })]
    const out = filterExpenses(list, { ...EMPTY_FILTERS, day: '2026-11-02' }, range)
    expect(out.map((e) => e.spent_on)).toEqual(['2026-11-02'])
  })

  it('"before" pega só o que é anterior ao início da viagem', () => {
    const list = [exp({ spent_on: '2026-08-08' }), exp({ spent_on: '2026-10-31' })]
    const out = filterExpenses(list, { ...EMPTY_FILTERS, day: 'before' }, range)
    expect(out.map((e) => e.spent_on)).toEqual(['2026-08-08'])
  })

  it('"after" pega só o que é posterior ao fim da viagem', () => {
    const list = [exp({ spent_on: '2026-11-09' }), exp({ spent_on: '2026-11-15' })]
    const out = filterExpenses(list, { ...EMPTY_FILTERS, day: 'after' }, range)
    expect(out.map((e) => e.spent_on)).toEqual(['2026-11-15'])
  })

  it('categoria nula conta como "outros"', () => {
    const list = [exp({ category: null }), exp({ category: 'transporte' })]
    expect(filterExpenses(list, { ...EMPTY_FILTERS, category: 'outros' }, range)).toHaveLength(1)
  })

  it('filtra por quem pagou', () => {
    const list = [exp({ paid_by: PEDRO }), exp({ paid_by: BRUNA })]
    const out = filterExpenses(list, { ...EMPTY_FILTERS, paidBy: BRUNA }, range)
    expect(out.map((e) => e.paid_by)).toEqual([BRUNA])
  })

  it('filtra por forma de pagamento, e "none" pega os não informados', () => {
    const list = [exp({ payment_method: 'card' }), exp({ payment_method: 'pix' }), exp({ payment_method: null }), exp()]
    expect(filterExpenses(list, { ...EMPTY_FILTERS, payment: 'pix' }, range)).toHaveLength(1)
    expect(filterExpenses(list, { ...EMPTY_FILTERS, payment: 'none' }, range)).toHaveLength(2)
  })

  it('"sem divisão" mostra só gastos sem split', () => {
    const list = [exp(), exp({ description: 'Corta vento', splits: [] })]
    const out = filterExpenses(list, { ...EMPTY_FILTERS, unsplitOnly: true }, range)
    expect(out.map((e) => e.description)).toEqual(['Corta vento'])
  })

  it('busca ignora acento e maiúscula, e olha a categoria também', () => {
    const list = [exp({ description: 'Méqui' }), exp({ description: 'Uber hotel', category: 'transporte' })]
    expect(filterExpenses(list, { ...EMPTY_FILTERS, query: 'MEQUI' }, range)).toHaveLength(1)
    expect(filterExpenses(list, { ...EMPTY_FILTERS, query: 'transp' }, range)).toHaveLength(1)
  })

  it('combina filtros (E lógico)', () => {
    const list = [
      exp({ spent_on: '2026-11-01', category: 'transporte', paid_by: PEDRO }),
      exp({ spent_on: '2026-11-01', category: 'transporte', paid_by: BRUNA }),
      exp({ spent_on: '2026-11-02', category: 'transporte', paid_by: PEDRO }),
    ]
    const out = filterExpenses(list, { ...EMPTY_FILTERS, day: '2026-11-01', category: 'transporte', paidBy: PEDRO }, range)
    expect(out).toHaveLength(1)
  })
})

describe('groupExpensesByDay', () => {
  it('agrupa do dia mais recente pro mais antigo, com subtotal na moeda base', () => {
    const list = [
      exp({ spent_on: '2026-11-01', amount: 10 }),
      exp({ spent_on: '2026-11-02', amount: 5, fx_to_base: 5.66 }),
      exp({ spent_on: '2026-11-01', amount: 0.1 }),
      exp({ spent_on: '2026-11-01', amount: 0.2 }),
    ]
    const groups = groupExpensesByDay(list)
    expect(groups.map((g) => g.date)).toEqual(['2026-11-02', '2026-11-01'])
    expect(groups[0].total).toBe(28.3)
    // 10 + 0.1 + 0.2 sem lixo de ponto flutuante
    expect(groups[1].total).toBe(10.3)
    expect(groups[1].expenses).toHaveLength(3)
  })
})

describe('buildDayOptions', () => {
  it('lista os dias da viagem só até hoje, com "Antes" quando há gasto pré-viagem', () => {
    const list = [exp({ spent_on: '2026-08-08' }), exp({ spent_on: '2026-11-01' })]
    const opts = buildDayOptions(list, range, '2026-11-02')
    expect(opts.map((o) => o.value)).toEqual(['all', 'before', '2026-10-31', '2026-11-01', '2026-11-02'])
    expect(opts.find((o) => o.isToday)?.value).toBe('2026-11-02')
  })

  it('viagem já encerrada mostra todos os dias e "Depois" se houver', () => {
    const list = [exp({ spent_on: '2026-11-20' })]
    const opts = buildDayOptions(list, range, '2026-12-01')
    expect(opts[1].value).toBe('2026-10-31')
    expect(opts.at(-2)?.value).toBe('2026-11-09')
    expect(opts.at(-1)?.value).toBe('after')
  })

  it('viagem sem datas: um chip por dia com gasto', () => {
    const list = [exp({ spent_on: '2026-11-02' }), exp({ spent_on: '2026-11-01' }), exp({ spent_on: '2026-11-02' })]
    const opts = buildDayOptions(list, { start_date: null, end_date: null }, '2026-11-05')
    expect(opts.map((o) => o.value)).toEqual(['all', '2026-11-01', '2026-11-02'])
  })
})

describe('addDays', () => {
  it('vira mês e ano', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })
})

describe('filtros na URL', () => {
  it('ida e volta preserva os filtros', () => {
    const f = { day: '2026-11-01', category: 'transporte', paidBy: PEDRO, payment: 'card', unsplitOnly: true, query: 'uber' }
    expect(filtersFromParams(filtersToParams(f))).toEqual(f)
  })

  it('filtro vazio vira URL limpa', () => {
    expect(filtersToParams(EMPTY_FILTERS).toString()).toBe('')
    expect(hasActiveFilters(filtersFromParams(new URLSearchParams()))).toBe(false)
  })
})
