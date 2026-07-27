# Pendências — Rumo

## Em aberto
- **Sprint 2 (Orçamento + Roteiro)** em andamento — ver `docs/roadmap.md` e
  `docs/Guia-Proximos-Passos.md`.
- **Sprint 3 (Monitor de passagens + PWA)** não iniciado.
- Nenhuma tela de edição de gasto existente ainda (só criar/excluir). Editar
  fica pra quando surgir necessidade real.
- **Recuperação de senha não implementada.** `resetPasswordForEmail` tem o
  mesmo risco de link-scanning do magic link (ver ADR 0004) — pensar na
  mitigação (ex.: OTP de 6 dígitos com template de e-mail ajustado no
  dashboard) antes de implementar, não só copiar o padrão padrão do Supabase.

## Concluído
- Scaffold do frontend, Tailwind, Supabase client, CRUD de Viagens, tela de
  Gastos com divisão e acerto de contas — ver `Registro-de-Sessoes.md`.
- Design system (Claude Design) integrado: tokens + 16 componentes +
  retrofit das 4 páginas existentes — ver ADR 0003.
- **Login corrigido e validado ponta a ponta.** Trocado magic link por
  e-mail + senha (ADR 0004) depois de descobrir que o Gmail consumia o link
  antes do clique real (ADR 0003). Testado no navegador: criar conta, criar
  viagem, lançar gasto, acerto de contas — tudo funcionando com o design
  system novo.
