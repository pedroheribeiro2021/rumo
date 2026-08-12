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

const EMBEDDED_URL = /https?:\/\/\S+/i

// Compartilhamento de apps (Airbnb, Hotels.com etc.) costuma colar uma frase
// inteira com o link no meio/fim ("Confira esta opção... https://..."), não
// só a URL pura. Extrai o link de dentro do texto quando existir; senão,
// trata o texto como domínio/URL sem esquema (ex.: "booking.com/x") e
// prefixa https:// — sem isso o navegador trataria como caminho relativo à
// página atual em vez de abrir o site externo.
export function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  const embedded = trimmed.match(EMBEDDED_URL)
  if (embedded) return stripTrailingPunctuation(embedded[0])
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed) ? trimmed : `https://${trimmed}`
}

// Frases que terminam em ponto final logo depois do link ("...aqui: https://x.com.")
// deixam a pontuação grudada na URL extraída — tira o que sobrar no final,
// preservando ")" quando ele fecha um "(" que faz parte da própria URL.
function stripTrailingPunctuation(url: string): string {
  let result = url.replace(/[.,;:!?'"]+$/, '')
  while (result.endsWith(')') && (result.match(/\(/g)?.length ?? 0) < (result.match(/\)/g)?.length ?? 0)) {
    result = result.slice(0, -1)
  }
  return result
}
