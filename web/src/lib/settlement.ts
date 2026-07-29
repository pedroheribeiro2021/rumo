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

export interface ExpenseForBalance {
  paid_by: string | null
  amount: number
  fx_to_base: number
  splits: { member_id: string; share: number }[]
}

export interface MemberForBalance {
  id: string
  display_name: string
}

// Saldo de cada membro (pago - devido). Gastos sem nenhum split (divisão
// desativada) ficam de fora inteiramente — não geram nem crédito nem débito,
// já que ninguém foi designado a pagar a parte de ninguém.
export function computeBalances(expenses: ExpenseForBalance[], members: MemberForBalance[]): MemberBalance[] {
  const paid: Record<string, number> = {}
  const owed: Record<string, number> = {}

  for (const e of expenses) {
    if (e.splits.length === 0) continue
    const amountBase = e.amount * e.fx_to_base
    if (e.paid_by) paid[e.paid_by] = (paid[e.paid_by] ?? 0) + amountBase
    for (const s of e.splits) {
      owed[s.member_id] = (owed[s.member_id] ?? 0) + s.share
    }
  }

  return members.map((m) => ({
    memberId: m.id,
    name: m.display_name,
    balance: Math.round(((paid[m.id] ?? 0) - (owed[m.id] ?? 0)) * 100) / 100,
  }))
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
