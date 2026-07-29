import { describe, expect, it } from 'vitest'
import { groupByCity } from './planning'

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
