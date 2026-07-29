import { describe, expect, it } from 'vitest'
import { formatMoney } from './format'

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
