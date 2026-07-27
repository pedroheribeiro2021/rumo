# Guia de Próximos Passos — Rumo

Documento de orientação para as próximas sessões de Claude Code. Reflete o estado real do repo em 2026-07-27 e as decisões tomadas. Contexto detalhado nos ADRs, `Registro-de-Sessoes.md` e `Pendencias.md`.

## Estado atual (confirmado)
- **Produto:** app para **gerenciar viagens** (roteiro, orçamento, documentos, monitor de passagens). Controle de gastos é *uma* das funcionalidades.
- **Stack (decidido: manter Vite):** Vite + React 19 + TS + Tailwind v4 (CSS-first) + react-query + react-router. App em `web/`. Não migrar para Next.js.
- **Banco (já aplicado no Supabase):** projeto `rachaconta` (`grsqjzrgngpyckcfkxon`), tabelas com prefixo `rumo_` no schema `public` (ADR 0001), RLS + hardening + auto-provisioning de perfil (ADR 0002). Tipos em `web/src/lib/database.types.ts` — regenerar via MCP após mudanças no `schema.sql`, não editar à mão.
- **Feito (Sprint 0+1):** auth magic link (`AuthContext`, `RequireAuth`), CRUD de viagens (`useTrips`, `TripsPage`, `TripDetailPage`), gastos com divisão e acerto de contas (`ExpensesPage`, `settlement.ts`, `fx.ts`).

## Login — resolvido (2026-07-27 noite)
Magic link trocado por e-mail + senha (ADR 0004) depois que o scanner de e-mail do Gmail se mostrou capaz de consumir o link antes do clique real (ADR 0003). Validado ponta a ponta no navegador com dados reais.

## Design system — feito (2026-07-27 tarde)
Integrado a partir do export do Claude Design. Tokens em `web/src/styles/tokens/` + `@theme` em `web/src/index.css`; 16 componentes em `web/src/components/ui/`; as 4 páginas existentes já usam os componentes novos. Fonte visual original preservada em `design-system/`. Ver ADR 0003. **Toda tela nova (Sprint 2 em diante) deve puxar de `web/src/components/ui/`, não estilizar com classes Tailwind soltas.**

## Sprint 2 — feito (2026-07-27 noite)
Orçamento (`useBudget.ts`, `BudgetPage.tsx`) e Roteiro (`useItinerary.ts`, `ItineraryPage.tsx`) implementados e validados no navegador. Rotas `/trips/:tripId/{orcamento,roteiro}`, linkadas em `TripDetailPage`. Categorias compartilhadas em `web/src/lib/categories.ts` para o cruzamento planejado×real funcionar.

## Sprint 3 — feito (2026-07-27 madrugada), exceto relatórios
- **Monitor de passagens**: `usePriceWatches.ts`/`usePriceObservations.ts`, `PriceWatchesPage.tsx` (lista com `StatusChip`), `PriceWatchDetailPage.tsx` (histórico + `PriceHistoryChart.tsx`). Entrada manual, como já era a limitação honesta documentada — nenhuma automação de scraping foi construída.
- **PWA/offline**: `vite-plugin-pwa` configurado (manifest, ícones reais, service worker); fila offline de gastos em `web/src/lib/offlineQueue.ts` (localStorage, não IndexedDB) com sincronização automática via `useSyncPendingExpenses`. **Achado importante**: React Query pausa mutations/queries quando `navigator.onLine=false` por padrão — precisa `networkMode: 'always'` pra rodar a lógica própria de fallback.
- **Deploy**: em produção na Vercel, conectado ao GitHub com auto-deploy. Lembrar de manter o Site URL do Supabase Auth sincronizado com o domínio de produção.
- **Ainda falta:** Relatórios/export (totais por categoria, por pessoa e por dia; CSV/PDF) — único item do roadmap pendente.

## Reuso futuro (não bloqueia)
`rachaconta` (divisão de conta) e `zerosheet-finance` (gastos/orçamento) têm padrões potencialmente reaproveitáveis. Avaliar quando fizer sentido; hoje o Rumo segue independente.
