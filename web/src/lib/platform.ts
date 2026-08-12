// PWA instalado (standalone) não tem gerenciador de abas: target="_blank"
// é bloqueado pelo WebKit e cai em "about:blank#blocked" sem abrir nada.
export function isStandalonePwa(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}
