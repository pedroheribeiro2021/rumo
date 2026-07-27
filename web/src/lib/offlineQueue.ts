const STORAGE_KEY = 'rumo:pending-expenses'

export interface PendingExpense {
  localId: string
  tripId: string
  description: string
  category: string | null
  amount: number
  currency: string
  fxToBase: number
  paidBy: string
  spentOn: string
  createdBy: string | undefined
  splits: { memberId: string; shareCents: number }[]
  queuedAt: string
}

function readAll(): PendingExpense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(items: PendingExpense[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getPendingExpenses(tripId: string): PendingExpense[] {
  return readAll().filter((e) => e.tripId === tripId)
}

export function enqueueExpense(item: Omit<PendingExpense, 'localId' | 'queuedAt'>): PendingExpense {
  const full: PendingExpense = { ...item, localId: crypto.randomUUID(), queuedAt: new Date().toISOString() }
  writeAll([...readAll(), full])
  return full
}

export function dequeueExpense(localId: string) {
  writeAll(readAll().filter((e) => e.localId !== localId))
}
