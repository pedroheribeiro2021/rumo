export interface MemberBalance {
  memberId: string
  name: string
  balance: number // positivo = a receber, negativo = deve
}

export interface Transfer {
  fromId: string
  fromName: string
  toId: string
  toName: string
  amount: number
}

const EPSILON = 0.005

// Minimiza o número de transferências casando o maior credor com o maior devedor a cada passo.
export function computeSettlement(balances: MemberBalance[]): Transfer[] {
  const creditors = balances
    .filter((b) => b.balance > EPSILON)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.balance - a.balance)
  const debtors = balances
    .filter((b) => b.balance < -EPSILON)
    .map((b) => ({ ...b, balance: -b.balance }))
    .sort((a, b) => b.balance - a.balance)

  const transfers: Transfer[] = []
  let i = 0
  let j = 0

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i]
    const debtor = debtors[j]
    const amount = Math.min(creditor.balance, debtor.balance)

    if (amount > EPSILON) {
      transfers.push({
        fromId: debtor.memberId,
        fromName: debtor.name,
        toId: creditor.memberId,
        toName: creditor.name,
        amount: Math.round(amount * 100) / 100,
      })
    }

    creditor.balance -= amount
    debtor.balance -= amount

    if (creditor.balance <= EPSILON) i++
    if (debtor.balance <= EPSILON) j++
  }

  return transfers
}

// Divide um total (em centavos) igualmente entre n pessoas, sem perder centavos por arredondamento.
export function splitEquallyCents(totalCents: number, n: number): number[] {
  const base = Math.floor(totalCents / n)
  const remainder = totalCents - base * n
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0))
}
