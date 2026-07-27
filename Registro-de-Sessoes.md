# Registro de Sessões — Rumo

## 2026-07-27 (noite, cont.) — Sprint 2: Orçamento + Roteiro

**Objetivo:** implementar Orçamento e Roteiro seguindo `docs/Guia-Proximos-Passos.md`.

**Alterações:**
- `useBudget.ts` (`useBudgetItems`, `useCreateBudgetItem`, `useDeleteBudgetItem`)
  e `BudgetPage.tsx`: cards de total gasto/planejado, lista por categoria com
  `ProgressBar` (tom muda pra warn/bad conforme o gasto se aproxima ou passa
  do planejado), cruzando `rumo_budget_items` com a soma de `rumo_expenses`
  por categoria (client-side, mesma abordagem do acerto de contas).
- `useItinerary.ts` (`useItineraryDays`, `useCreateItineraryDay`,
  `useDeleteItineraryDay`) e `ItineraryPage.tsx`: lista de dias ordenada por
  data, cada um com cidade/país/notas, seguindo o layout do
  `design-system/ui_kits/rumo-app/ItineraryScreen.jsx`.
- Categorias de gasto extraídas para `web/src/lib/categories.ts`
  (`EXPENSE_CATEGORIES`) — reusadas no formulário de gasto e no seletor de
  categoria do orçamento, garantindo que o cruzamento planejado×real bata.
- Formatação de moeda extraída para `web/src/lib/format.ts` (estava
  duplicada só em `ExpensesPage`).
- `TripDetailPage`: os 3 módulos (Gastos/Orçamento/Roteiro) agora aparecem
  como botões lado a lado, no lugar do botão único "Ver gastos".
- Novas rotas `/trips/:tripId/orcamento` e `/trips/:tripId/roteiro`.

**Validado ponta a ponta no navegador:** criei um item de orçamento
(alimentação, R$300 planejado) e confirmei que cruzou certo com o gasto
real de R$150 já lançado (barra em 50%); adicionei um dia de roteiro
(Foz do Iguaçu · Brasil) e confirmei a listagem.

**Pendências:** ver `Pendencias.md`.

**Arquivos modificados:** `web/src/hooks/{useBudget,useItinerary}.ts` (novo),
`web/src/pages/{BudgetPage,ItineraryPage}.tsx` (novo),
`web/src/lib/{categories,format}.ts` (novo), `web/src/lib/types.ts`,
`web/src/pages/{ExpensesPage,TripDetailPage}.tsx`, `web/src/App.tsx`,
`docs/roadmap.md`, `Pendencias.md`, `Registro-de-Sessoes.md`.

---

## 2026-07-27 (noite) — Login corrigido (e-mail+senha) e validação completa

**Objetivo:** resolver de vez o problema de login antes de avançar pra
Sprint 2, e commitar o trabalho acumulado.

**Alterações:**
- `LoginPage.tsx` trocado de magic link para e-mail + senha
  (`signUp`/`signInWithPassword`), com alternância "Entrar"/"Criar conta".
  Ver ADR 0004 — o motivo é que o magic link estava (e continuaria)
  funcionalmente quebrado pelo scanner de e-mail do Gmail (ADR 0003), não só
  incômodo de testar.
- Corrigido bug de responsividade: campos de data lado a lado (`TripsPage`,
  `ExpensesPage`) estouravam em telas estreitas — `flexWrap: 'wrap'` +
  `flex: '1 1 140px'`.
- **Validação completa no navegador com dados reais:** criei conta, criei a
  viagem "Foz do Iguaçu", lancei o gasto "Almoço" (R$150, categoria
  alimentação) via Fab+Modal, conferi total e "Acerto de contas" — as 4
  telas (Login, Viagens, Detalhe, Gastos) renderizam corretamente com o
  design system novo.
- Commit único cobrindo Sprint 0+1 (MVP) e a integração do design system
  (131 arquivos).

**Decisões:** ver `ADR/0004-login-email-senha.md`.

**Pendências:** ver `Pendencias.md` — recuperação de senha ainda não
implementada (mesmo risco de link-scanning se copiar o padrão do Supabase).

**Arquivos modificados:** `web/src/pages/LoginPage.tsx`,
`web/src/components/ui/Input.tsx` (prop `minLength`),
`web/src/pages/{TripsPage,ExpensesPage}.tsx` (fix responsivo),
`ADR/0004-*.md` (novo), `Pendencias.md`, `Registro-de-Sessoes.md`.

---

## 2026-07-27 (tarde) — Integração do design system

**Objetivo:** integrar o design system exportado do Claude Design
(`Rumo Design System.zip`) antes de começar a Sprint 2.

**Alterações:**
- Export guardado em `design-system/` (tokens, componentes originais,
  ui_kits de referência, readme) — mesmo papel que `prototype/index.html`.
- Skill do projeto instalada em `.claude/skills/rumo-design/SKILL.md`.
- Tokens religados em `web/src/index.css` via `@import` + bloco `@theme`
  (Tailwind v4 CSS-first).
- 16 componentes portados para `web/src/components/ui/*.tsx` (Button, Input,
  CurrencySelect, Card, ListRow, Avatar, Tabs, BottomNav, Fab, StatusChip,
  ProgressBar, Modal, EmptyState, LoadingState, ErrorState, OfflineBanner).
- `LoginPage`, `TripsPage`, `TripDetailPage`, `ExpensesPage` e `AppLayout`
  retrofitados para usar os componentes novos, mantendo toda a lógica real.
  `ExpensesPage` passou de painel inline para `Fab` + `Modal` bottom-sheet
  (padrão do `ui_kits/rumo-app/ExpensesScreen.jsx`).

**Achado importante:** ao tentar validar visualmente, descobri (via
`get_logs` do Supabase) que o link mágico está sendo consumido por um
scanner de segurança de e-mail (Gmail/Google Safe Browsing) segundos após o
envio — antes de qualquer clique real. Detalhes e mitigação sugerida (OTP de
6 dígitos em vez de link clicável) em `ADR/0003`.

**Decisões:** ver `ADR/0003-design-system-integracao.md`.

**Pendências:** ver `Pendencias.md` — confirmação visual de
Trips/TripDetail/Expenses no navegador (só Login foi confirmado; build e
type-check passaram para as 4 páginas).

**Arquivos modificados:** `design-system/` (novo), `.claude/skills/rumo-design/`
(novo), `web/src/styles/tokens/` (novo), `web/src/components/ui/` (novo),
`web/src/index.css`, `web/src/pages/{LoginPage,TripsPage,TripDetailPage,ExpensesPage}.tsx`,
`web/src/components/AppLayout.tsx`, `ADR/0003-*.md` (novo), `Pendencias.md`,
`Registro-de-Sessoes.md`.

---

## 2026-07-27 — MVP: Sprint 0 + Sprint 1 completos

**Objetivo:** scaffold do frontend + Auth + CRUD de Viagens + tela de Gastos
(divisão e acerto de contas), seguindo `docs/roadmap.md`.

**Alterações:**
- Scaffold `web/` (Vite + React 19 + TS + Tailwind v4), removido boilerplate
  padrão do template.
- Cliente Supabase (`web/src/lib/supabase.ts`), `AuthContext` com magic link,
  `RequireAuth`, `AppLayout`.
- `supabase/schema.sql` reescrito: todas as tabelas prefixadas com `rumo_`
  (projeto Supabase compartilhado com outros apps — ver ADR 0001), RLS
  habilitado em `rumo_profiles` (faltava no schema original), trigger de
  auto-provisioning de perfil, hardening de funções `SECURITY DEFINER` (ver
  ADR 0002).
- Schema aplicado no projeto `rachaconta` (`grsqjzrgngpyckcfkxon`) via MCP do
  Supabase; tipos TS gerados em `web/src/lib/database.types.ts`.
- CRUD de Viagens (`useTrips`, `TripsPage`, `TripDetailPage`) — criar viagem
  já insere o dono como `rumo_trip_members` automaticamente.
- Tela de Gastos (`ExpensesPage`): lançamento rápido (valor + descrição são
  os únicos campos visíveis por padrão; moeda, quem pagou, data e divisão
  ficam atrás de "+ mais opções"), divisão igual/manual, câmbio buscado via
  `VITE_FX_API_URL` quando a moeda difere da moeda base da viagem, total da
  viagem, e painel de acerto de contas (algoritmo guloso de minimização de
  transferências em `src/lib/settlement.ts`).

**Bug encontrado e corrigido:** `AuthContext` resolvia `loading = false`
usando `getSession()`, que não espera o client processar o hash/código do
link de e-mail. Isso fazia o `RequireAuth` redirecionar para `/login` antes
da sessão ser estabelecida, descartando o token. Corrigido para depender
só de `onAuthStateChange`. Confirmado via logs do Supabase (`get_logs`,
serviço `auth`) que o signup + login aconteceram com sucesso no servidor
antes da correção; o trigger de auto-provisioning também foi confirmado
(linha criada em `rumo_profiles` para o usuário de teste).

**Decisões:** ver `ADR/0001-schema-supabase-compartilhado.md` e
`ADR/0002-rls-hardening-e-auto-provisioning.md`.

**Pendências:** ver `Pendencias.md` — principalmente a confirmação visual do
login no navegador (bloqueada pelo rate limit de e-mail do Supabase nesta
sessão).

**Arquivos modificados:** `web/` (novo), `supabase/schema.sql`, `ADR/`
(novo), `Pendencias.md` (novo), `Registro-de-Sessoes.md` (novo).
