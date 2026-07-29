export interface ExpenseForSpend {
  category: string | null
  spent_on: string
  amount: number
  fx_to_base: number
}

// Soma o gasto real (em moeda base) por categoria — gastos sem categoria caem em "outros".
export function computeSpentByCategory(expenses: ExpenseForSpend[]): Record<string, number> {
  const map: Record<string, number> = {}
  for (const e of expenses) {
    const key = e.category ?? 'outros'
    map[key] = (map[key] ?? 0) + e.amount * e.fx_to_base
  }
  return map
}

// Soma o gasto real (em moeda base) por dia (spent_on).
export function computeSpentByDay(expenses: ExpenseForSpend[]): Record<string, number> {
  const map: Record<string, number> = {}
  for (const e of expenses) {
    map[e.spent_on] = (map[e.spent_on] ?? 0) + e.amount * e.fx_to_base
  }
  return map
}
