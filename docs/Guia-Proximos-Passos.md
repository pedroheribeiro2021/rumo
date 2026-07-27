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

## Sprint 3 — Passagens e polish
- **Monitor de passagens** (`rumo_price_watches`, `rumo_price_observations`): hook + tela com alvo, trechos e histórico (gráfico). **Limitação honesta:** milhas não são scrapáveis; alimentar preços em dinheiro (entrada manual e/ou a tarefa agendada do Cowork que já existe) e usar rastreamento nativo do Google Voos como rede de segurança. Toda função `SECURITY DEFINER` nova segue o padrão do ADR 0002 (`set search_path`, `revoke from public`, grant explícito).
- **PWA/offline:** adicionar `vite-plugin-pwa`; priorizar que o lançamento de gasto funcione offline (fila local → sync).
- **Relatórios/export:** totais por categoria, por pessoa e por dia; export CSV/PDF.

## Reuso futuro (não bloqueia)
`rachaconta` (divisão de conta) e `zerosheet-finance` (gastos/orçamento) têm padrões potencialmente reaproveitáveis. Avaliar quando fizer sentido; hoje o Rumo segue independente.
