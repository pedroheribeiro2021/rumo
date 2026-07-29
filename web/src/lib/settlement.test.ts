import { describe, expect, it } from 'vitest'
import { computeBalances, computeSettlement, splitEquallyCents } from './settlement'

describe('splitEquallyCents', () => {
  it('divide igualmente quando divide sem resto', () => {
    expect(splitEquallyCents(1000, 4)).toEqual([250, 250, 250, 250])
  })

  it('distribui o resto de centavos entre os primeiros', () => {
    expect(splitEquallyCents(1000, 3)).toEqual([334, 333, 333])
  })

  it('não perde nem cria centavos por arredondamento', () => {
    const shares = splitEquallyCents(9999, 7)
    expect(shares.reduce((a, b) => a + b, 0)).toBe(9999)
  })
})

describe('computeBalances', () => {
  const members = [
    { id: 'a', display_name: 'Ana' },
    { id: 'b', display_name: 'Bruno' },
  ]

  it('gasto sem nenhum split não gera crédito nem débito pra ninguém', () => {
    // Este é o caso do bug corrigido nesta sessão: um gasto lançado sem
    // divisão não pode fazer o pagador parecer credor do grupo.
    const expenses = [{ paid_by: 'a', amount: 100, fx_to_base: 1, splits: [] }]
    const balances = computeBalances(expenses, members)
    expect(balances).toEqual([
      { memberId: 'a', name: 'Ana', balance: 0 },
      { memberId: 'b', name: 'Bruno', balance: 0 },
    ])
  })

  it('gasto dividido igualmente entre 2 gera saldo +50/-50', () => {
    const expenses = [
      {
        paid_by: 'a',
        amount: 100,
        fx_to_base: 1,
        splits: [
          { member_id: 'a', share: 50 },
          { member_id: 'b', share: 50 },
        ],
      },
    ]
    const balances = computeBalances(expenses, members)
    expect(balances.find((b) => b.memberId === 'a')?.balance).toBe(50)
    expect(balances.find((b) => b.memberId === 'b')?.balance).toBe(-50)
  })

  it('mistura gasto dividido com gasto sem divisão — só o dividido conta no acerto', () => {
    const expenses = [
      {
        paid_by: 'a',
        amount: 100,
        fx_to_base: 1,
        splits: [
          { member_id: 'a', share: 50 },
          { member_id: 'b', share: 50 },
        ],
      },
      { paid_by: 'a', amount: 9999, fx_to_base: 1, splits: [] }, // gasto pessoal, não deve afetar o saldo
    ]
    const balances = computeBalances(expenses, members)
    expect(balances.find((b) => b.memberId === 'a')?.balance).toBe(50)
    expect(balances.find((b) => b.memberId === 'b')?.balance).toBe(-50)
  })

  it('converte pra moeda base usando fx_to_base', () => {
    const expenses = [
      {
        paid_by: 'a',
        amount: 100, // moeda original
        fx_to_base: 5, // 1 unidade = 5 na moeda base
        splits: [
          { member_id: 'a', share: 250 },
          { member_id: 'b', share: 250 },
        ],
      },
    ]
    const balances = computeBalances(expenses, members)
    expect(balances.find((b) => b.memberId === 'a')?.balance).toBe(250)
  })
})

describe('computeSettlement', () => {
  it('não gera transferência quando todos os saldos são zero', () => {
    expect(computeSettlement([{ memberId: 'a', name: 'Ana', balance: 0 }])).toEqual([])
  })

  it('gera uma transferência direta entre devedor e credor', () => {
    const transfers = computeSettlement([
      { memberId: 'a', name: 'Ana', balance: 50 },
      { memberId: 'b', name: 'Bruno', balance: -50 },
    ])
    expect(transfers).toEqual([{ fromId: 'b', fromName: 'Bruno', toId: 'a', toName: 'Ana', amount: 50 }])
  })

  it('minimiza transferências com múltiplos credores/devedores', () => {
    const transfers = computeSettlement([
      { memberId: 'a', name: 'Ana', balance: 100 },
      { memberId: 'b', name: 'Bruno', balance: -60 },
      { memberId: 'c', name: 'Carla', balance: -40 },
    ])
    expect(transfers).toHaveLength(2)
    expect(transfers.reduce((s, t) => s + t.amount, 0)).toBe(100)
  })
})
