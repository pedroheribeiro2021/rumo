export async function fetchFxRate(from: string, to: string): Promise<number | null> {
  if (from === to) return 1

  const base = import.meta.env.VITE_FX_API_URL
  if (!base) return null

  try {
    const res = await fetch(`${base}/v6/latest/${from}`)
    if (!res.ok) return null
    const data = await res.json()
    if (data?.result !== 'success') return null
    const rate = data?.rates?.[to]
    return typeof rate === 'number' ? rate : null
  } catch {
    return null
  }
}
