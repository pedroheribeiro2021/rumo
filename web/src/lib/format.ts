export function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

// Formata data ISO (YYYY-MM-DD) como dia/mês, sem ano — a viagem sempre é no ano corrente do planejamento.
export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return '?'
  const [, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

// Data de hoje (YYYY-MM-DD) no fuso do aparelho. toISOString() devolve UTC: em Brasília,
// depois das 21h ele já é "amanhã", e um gasto lançado à noite caía no dia seguinte.
export function todayLocalISO(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

// "sáb, 31/10" — dia da semana calculado em UTC sobre a data ISO, sem depender do fuso.
export function formatDayWithWeekday(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  return `${weekday}, ${formatDateShort(dateStr)}`
}
