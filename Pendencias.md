# Pendências — Rumo

## Em aberto
- **Confirmar login end-to-end no navegador.** Causa raiz identificada com
  certeza (ver ADR/0003 e Registro-de-Sessoes.md, sessão 2026-07-27): o link
  mágico está sendo consumido por um scanner de segurança do Gmail/Google
  (Safe Browsing) segundos depois do envio, antes de qualquer clique real —
  confirmado nos logs do Supabase (`get_logs`, serviço `auth`): um login
  `implicit` bem-sucedido aparece no servidor sem que ninguém tenha clicado
  ainda. O fix do `AuthContext` (depender só de `onAuthStateChange`) está
  correto, mas nunca foi possível validar visualmente porque o token já
  chega queimado. **Isso pode afetar usuários reais também**, não só os
  testes — ver ADR/0003 para mitigação (trocar magic link por OTP de 6
  dígitos, que não é vulnerável a link-scanning).
- **Sprint 2 (Orçamento + Roteiro)** ainda não iniciado — ver `docs/roadmap.md`
  e `docs/Guia-Proximos-Passos.md`.
- **Sprint 3 (Monitor de passagens + PWA)** não iniciado.
- Nenhuma tela de edição de gasto existente ainda (só criar/excluir). Editar
  fica pra quando surgir necessidade real.
- Páginas de Trips/TripDetail/Expenses retrofitadas com os componentes do
  design system (`web/src/components/ui/`) e validadas por build + type-check,
  mas só a tela de Login foi confirmada visualmente no navegador (a
  confirmação das outras 3 ficou bloqueada pelo mesmo problema de login
  acima). Revisar visualmente assim que o login for validado.

## Concluído nesta sessão (sai daqui, entra no changelog/registro)
- Scaffold do frontend, Tailwind, Supabase client, Auth (magic link), CRUD de
  Viagens, tela de Gastos com divisão e acerto de contas — ver
  `Registro-de-Sessoes.md`.
- Design system (Claude Design) integrado: tokens + 16 componentes +
  retrofit das 4 páginas existentes — ver `Registro-de-Sessoes.md` e
  `ADR/0003-design-system-integracao.md`.
