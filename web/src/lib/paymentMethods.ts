export type PaymentMethod = 'card' | 'pix' | 'cash'

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'card', label: 'Cartão' },
  { value: 'pix', label: 'Pix' },
  { value: 'cash', label: 'Espécie' },
]

export function paymentMethodLabel(value: string | null | undefined): string | null {
  return PAYMENT_METHODS.find((p) => p.value === value)?.label ?? null
}

const LAST_KEY = 'rumo:last-payment-method'

// Lembra a última forma usada: numa viagem quase tudo sai do mesmo meio, então o
// campo vem certo de cara e não custa toque nenhum (princípio dos ~3 toques).
export function getLastPaymentMethod(): PaymentMethod {
  try {
    const v = localStorage.getItem(LAST_KEY)
    if (v === 'card' || v === 'pix' || v === 'cash') return v
  } catch {
    // localStorage indisponível (modo privado etc.) — cai no padrão
  }
  return 'card'
}

export function setLastPaymentMethod(value: PaymentMethod) {
  try {
    localStorage.setItem(LAST_KEY, value)
  } catch {
    // sem persistência; não é crítico
  }
}
