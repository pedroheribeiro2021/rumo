// Filtros e agrupamento da lista de gastos. Vive aqui (e não num useMemo da página)
// porque um filtro errado some com gasto da tela sem ninguém perceber — ver ADR 0008.

export interface FilterableExpense {
  spent_on: string
  description: string | null
  category: string | null
  paid_by: string | null
  payment_method?: string | null
  amount: number
  fx_to_base: number
  splits: { member_id: string }[]
}

/**
 * `day` aceita uma data ISO ou os buckets 'before'/'after' — gastos fora do período
 * da viagem (passagem comprada meses antes, por ex.) precisam continuar achados,
 * mas não merecem um chip por data cada.
 */
export type DayFilter = 'all' | 'before' | 'after' | string

export interface ExpenseFilters {
  day: DayFilter
  category: string | null
  paidBy: string | null
  // 'none' = sem forma informada (gastos lançados antes do campo existir)
  payment: string | null
  unsplitOnly: boolean
  query: string
}

export const EMPTY_FILTERS: ExpenseFilters = { day: 'all', category: null, paidBy: null, payment: null, unsplitOnly: false, query: '' }

export interface TripRange {
  start_date: string | null
  end_date: string | null
}

// Sem acento e minúsculo: "méqui" tem que achar "Mequi" e vice-versa.
function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

function matchesDay(spentOn: string, day: DayFilter, range: TripRange): boolean {
  if (day === 'all') return true
  // Datas ISO comparam certo como string — evita new Date() e problema de fuso.
  if (day === 'before') return !!range.start_date && spentOn < range.start_date
  if (day === 'after') return !!range.end_date && spentOn > range.end_date
  return spentOn === day
}

export function filterExpenses<T extends FilterableExpense>(expenses: T[], filters: ExpenseFilters, range: TripRange): T[] {
  const q = normalize(filters.query)
  return expenses.filter((e) => {
    if (!matchesDay(e.spent_on, filters.day, range)) return false
    if (filters.category && (e.category ?? 'outros') !== filters.category) return false
    if (filters.paidBy && e.paid_by !== filters.paidBy) return false
    if (filters.payment && (e.payment_method ?? 'none') !== filters.payment) return false
    if (filters.unsplitOnly && e.splits.length > 0) return false
    if (q) {
      const haystack = normalize(`${e.description ?? ''} ${e.category ?? ''}`)
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export function hasActiveFilters(filters: ExpenseFilters): boolean {
  return filters.day !== 'all' || !!filters.category || !!filters.paidBy || !!filters.payment || filters.unsplitOnly || filters.query.trim() !== ''
}

export interface DayGroup<T> {
  date: string
  total: number // na moeda base
  expenses: T[]
}

/** Agrupa por dia, do mais recente pro mais antigo, mantendo a ordem original dentro do dia. */
export function groupExpensesByDay<T extends FilterableExpense>(expenses: T[]): DayGroup<T>[] {
  const groups = new Map<string, DayGroup<T>>()
  for (const e of expenses) {
    let g = groups.get(e.spent_on)
    if (!g) {
      g = { date: e.spent_on, total: 0, expenses: [] }
      groups.set(e.spent_on, g)
    }
    g.expenses.push(e)
    g.total += e.amount * e.fx_to_base
  }
  return [...groups.values()]
    .map((g) => ({ ...g, total: Math.round(g.total * 100) / 100 }))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export interface DayOption {
  value: DayFilter
  kind: 'all' | 'before' | 'after' | 'day'
  date?: string
  isToday?: boolean
}

/**
 * Chips de dia: "Todos", "Antes" (se houver gasto antes da viagem), um chip por dia
 * da viagem até hoje — dias futuros não têm gasto, então só ocupariam espaço — e "Depois".
 * Dias da viagem sem gasto entram mesmo assim: ver "nada lançado em 02/11" também é auditoria.
 */
export function buildDayOptions(expenses: FilterableExpense[], range: TripRange, today: string): DayOption[] {
  const options: DayOption[] = [{ value: 'all', kind: 'all' }]
  const dates = new Set(expenses.map((e) => e.spent_on))

  if (range.start_date && [...dates].some((d) => d < range.start_date!)) {
    options.push({ value: 'before', kind: 'before' })
  }

  if (range.start_date && range.end_date) {
    const last = today < range.end_date ? today : range.end_date
    for (let d = range.start_date; d <= last; d = addDays(d, 1)) {
      options.push({ value: d, kind: 'day', date: d, isToday: d === today })
    }
  } else {
    // viagem sem datas: um chip por dia que tem gasto
    for (const d of [...dates].sort()) options.push({ value: d, kind: 'day', date: d, isToday: d === today })
  }

  if (range.end_date && [...dates].some((d) => d > range.end_date!)) {
    options.push({ value: 'after', kind: 'after' })
  }
  return options
}

// Soma dias numa data ISO usando UTC puro, pra não escorregar no horário de verão.
export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + n))
  return dt.toISOString().slice(0, 10)
}

// Filtros na URL: recarregar a página ou compartilhar o link mantém o recorte.
export function filtersFromParams(params: URLSearchParams): ExpenseFilters {
  return {
    day: params.get('dia') || 'all',
    category: params.get('categoria') || null,
    paidBy: params.get('pagou') || null,
    payment: params.get('pagamento') || null,
    unsplitOnly: params.get('semdivisao') === '1',
    query: params.get('q') ?? '',
  }
}

export function filtersToParams(filters: ExpenseFilters): URLSearchParams {
  const p = new URLSearchParams()
  if (filters.day !== 'all') p.set('dia', filters.day)
  if (filters.category) p.set('categoria', filters.category)
  if (filters.paidBy) p.set('pagou', filters.paidBy)
  if (filters.payment) p.set('pagamento', filters.payment)
  if (filters.unsplitOnly) p.set('semdivisao', '1')
  if (filters.query) p.set('q', filters.query)
  return p
}
