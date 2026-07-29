export interface OptionWithCity {
  city: string | null
}

// Agrupa opções de planejamento por cidade (mantendo a ordem de primeira
// aparição) — quem não tem cidade definida cai num grupo à parte, sempre por
// último, já que ainda não foi pesquisado/decidido onde encaixar.
export function groupByCity<T extends OptionWithCity>(options: T[]): { city: string; options: T[] }[] {
  const order: string[] = []
  const map = new Map<string, T[]>()
  const withoutCity: T[] = []

  for (const option of options) {
    const city = option.city?.trim()
    if (!city) {
      withoutCity.push(option)
      continue
    }
    if (!map.has(city)) {
      map.set(city, [])
      order.push(city)
    }
    map.get(city)!.push(option)
  }

  const groups = order.map((city) => ({ city, options: map.get(city)! }))
  if (withoutCity.length > 0) groups.push({ city: 'Sem cidade definida', options: withoutCity })
  return groups
}
