import { describe, expect, it } from 'vitest'
import { groupByCity, normalizeUrl } from './planning'

describe('groupByCity', () => {
  it('agrupa opções pela mesma cidade preservando a ordem de aparição', () => {
    const options = [
      { id: 1, city: 'Cartagena' },
      { id: 2, city: 'San Andrés' },
      { id: 3, city: 'Cartagena' },
    ]
    const groups = groupByCity(options)
    expect(groups.map((g) => g.city)).toEqual(['Cartagena', 'San Andrés'])
    expect(groups[0].options.map((o) => o.id)).toEqual([1, 3])
    expect(groups[1].options.map((o) => o.id)).toEqual([2])
  })

  it('opções sem cidade caem num grupo à parte, no final', () => {
    const options = [
      { id: 1, city: null },
      { id: 2, city: 'Cartagena' },
      { id: 3, city: '' },
    ]
    const groups = groupByCity(options)
    expect(groups.map((g) => g.city)).toEqual(['Cartagena', 'Sem cidade definida'])
    expect(groups[1].options.map((o) => o.id)).toEqual([1, 3])
  })

  it('não cria grupo "sem cidade" quando todas as opções têm cidade', () => {
    const groups = groupByCity([{ id: 1, city: 'Cartagena' }])
    expect(groups).toHaveLength(1)
  })

  it('lista vazia retorna lista de grupos vazia', () => {
    expect(groupByCity([])).toEqual([])
  })
})

describe('normalizeUrl', () => {
  it('mantém uma URL absoluta já bem formada', () => {
    expect(normalizeUrl('https://www.airbnb.com.br/rooms/950034064508491807?s=76')).toBe(
      'https://www.airbnb.com.br/rooms/950034064508491807?s=76',
    )
  })

  it('prefixa https:// quando falta o esquema', () => {
    expect(normalizeUrl('booking.com/hotel/123')).toBe('https://booking.com/hotel/123')
  })

  it('extrai a URL de um texto de compartilhamento (frase + link)', () => {
    const shared = 'Confira esta opção de hospedagem em Foz do Iguaçu que encontrei na Hoteis.com. https://hotelsapp.onelink.me/fSyN/g0hens0u'
    expect(normalizeUrl(shared)).toBe('https://hotelsapp.onelink.me/fSyN/g0hens0u')
  })

  it('remove pontuação de frase colada no final do link extraído', () => {
    expect(normalizeUrl('Veja aqui: https://example.com/oferta.')).toBe('https://example.com/oferta')
    expect(normalizeUrl('Reservei em (https://example.com/hotel)')).toBe('https://example.com/hotel')
  })

  it('preserva parênteses que fazem parte da própria URL', () => {
    expect(normalizeUrl('https://en.wikipedia.org/wiki/Rio_(disambiguation)')).toBe(
      'https://en.wikipedia.org/wiki/Rio_(disambiguation)',
    )
  })
})
