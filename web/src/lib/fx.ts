export async function fetchFxRate(from: string, to: string): Promise<number | null> {
  if (from === to) return 1

  const base = import.meta.env.VITE_FX_API_URL
  if (!base) return null

  try {
    const res = await fetch(`${base}/latest?base=${from}&symbols=${to}`)
    if (!res.ok) return null
    const data = await res.json()
    const rate = data?.rates?.[to]
    return typeof rate === 'number' ? rate : null
  } catch {
    return null
  }
}
