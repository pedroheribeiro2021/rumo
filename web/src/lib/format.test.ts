import { describe, expect, it } from 'vitest'
import { formatDayWithWeekday, formatMoney, todayLocalISO } from './format'

describe('formatMoney', () => {
  it('formata em reais com duas casas decimais', () => {
    const result = formatMoney(1234.5, 'BRL')
    expect(result).toContain('1.234,50')
  })

  it('formata em dólar', () => {
    const result = formatMoney(10, 'USD')
    expect(result).toContain('10,00')
  })

  it('não quebra com um código de moeda inválido', () => {
    expect(() => formatMoney(10, 'XXX')).not.toThrow()
  })
})

describe('todayLocalISO', () => {
  it('usa o dia local, não o UTC', () => {
    // 22h em Brasília já é dia seguinte em UTC; o construtor local evita depender do fuso da máquina de CI
    expect(todayLocalISO(new Date(2026, 10, 2, 22, 30))).toBe('2026-11-02')
  })
})

describe('formatDayWithWeekday', () => {
  it('mostra dia da semana e dia/mês', () => {
    expect(formatDayWithWeekday('2026-10-31')).toBe('sáb, 31/10')
    expect(formatDayWithWeekday('2026-11-01')).toBe('dom, 01/11')
  })
})
