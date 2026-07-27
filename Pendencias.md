# Pendências — Rumo

## Em aberto
- **Sprint 3 (Monitor de passagens + PWA)** não iniciado — ver `docs/roadmap.md`.
- Nenhuma tela de edição de gasto existente ainda (só criar/excluir). Editar
  fica pra quando surgir necessidade real. O mesmo vale para orçamento e
  roteiro (só criar/excluir por enquanto).
- **Recuperação de senha não implementada.** `resetPasswordForEmail` tem o
  mesmo risco de link-scanning do magic link (ver ADR 0004) — pensar na
  mitigação (ex.: OTP de 6 dígitos com template de e-mail ajustado no
  dashboard) antes de implementar, não só copiar o padrão padrão do Supabase.
- Orçamento compara categoria por string exata com `rumo_expenses.category`
  — ambos usam a mesma lista fixa (`EXPENSE_CATEGORIES` em
  `web/src/lib/categories.ts`), então funciona, mas se algum dia a categoria
  virar texto livre em algum dos dois lados o cruzamento quebra.

## Concluído
- Scaffold do frontend, Tailwind, Supabase client, CRUD de Viagens, tela de
  Gastos com divisão e acerto de contas — ver `Registro-de-Sessoes.md`.
- Design system (Claude Design) integrado: tokens + 16 componentes +
  retrofit das 4 páginas existentes — ver ADR 0003.
- **Login corrigido e validado ponta a ponta.** Trocado magic link por
  e-mail + senha (ADR 0004).
- **Sprint 2 completa:** Orçamento (planejado vs. real por categoria, com
  barra de progresso) e Roteiro (lista de dias) — `BudgetPage`,
  `ItineraryPage`, hooks `useBudget`/`useItinerary`. Validado ponta a ponta
  no navegador com dados reais.
