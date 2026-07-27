# Guia de Próximos Passos — Rumo

Documento de orientação para as próximas sessões de Claude Code. Reflete o estado real do repo em 2026-07-27 e as decisões tomadas. Contexto detalhado nos ADRs, `Registro-de-Sessoes.md` e `Pendencias.md`.

## Estado atual (confirmado)
- **Produto:** app para **gerenciar viagens** (roteiro, orçamento, documentos, monitor de passagens). Controle de gastos é *uma* das funcionalidades.
- **Stack (decidido: manter Vite):** Vite + React 19 + TS + Tailwind v4 (CSS-first) + react-query + react-router. App em `web/`. Não migrar para Next.js.
- **Banco (já aplicado no Supabase):** projeto `rachaconta` (`grsqjzrgngpyckcfkxon`), tabelas com prefixo `rumo_` no schema `public` (ADR 0001), RLS + hardening + auto-provisioning de perfil (ADR 0002). Tipos em `web/src/lib/database.types.ts` — regenerar via MCP após mudanças no `schema.sql`, não editar à mão.
- **Feito (Sprint 0+1):** auth magic link (`AuthContext`, `RequireAuth`), CRUD de viagens (`useTrips`, `TripsPage`, `TripDetailPage`), gastos com divisão e acerto de contas (`ExpensesPage`, `settlement.ts`, `fx.ts`).

## Pendência aberta a fechar antes de avançar
- Confirmar login end-to-end no navegador. Causa raiz identificada: o Gmail/Google consome o link mágico via scanner de segurança antes do clique real (confirmado nos logs de auth do Supabase) — não é bug do Rumo, mas pode afetar usuários reais também. Mitigação sugerida: trocar magic link por OTP de 6 dígitos. Ver ADR 0003 e `Pendencias.md`.

## Design system — feito (2026-07-27 tarde)
Integrado a partir do export do Claude Design. Tokens em `web/src/styles/tokens/` + `@theme` em `web/src/index.css`; 16 componentes em `web/src/components/ui/`; as 4 páginas existentes já usam os componentes novos. Fonte visual original preservada em `design-system/`. Ver ADR 0003. **Toda tela nova (Sprint 2 em diante) deve puxar de `web/src/components/ui/`, não estilizar com classes Tailwind soltas.**

## Sprint 2 — Núcleo de planejamento
Seguir os padrões já existentes (hook react-query + `supabase` client + página/seção em `TripDetailPage`).
- **Orçamento** (`rumo_budget_items`): hook `useBudget(tripId)` (CRUD por categoria); UI de planejado vs. real cruzando com a soma de `rumo_expenses` por categoria. Reusar `fmt`/moeda base da viagem.
- **Roteiro** (`rumo_itinerary_days`): hook `useItinerary(tripId)`; lista dia a dia ordenada por `sort_order`/`day_date`, com base_city, país e notas. CRUD simples.

## Sprint 3 — Passagens e polish
- **Monitor de passagens** (`rumo_price_watches`, `rumo_price_observations`): hook + tela com alvo, trechos e histórico (gráfico). **Limitação honesta:** milhas não são scrapáveis; alimentar preços em dinheiro (entrada manual e/ou a tarefa agendada do Cowork que já existe) e usar rastreamento nativo do Google Voos como rede de segurança. Toda função `SECURITY DEFINER` nova segue o padrão do ADR 0002 (`set search_path`, `revoke from public`, grant explícito).
- **PWA/offline:** adicionar `vite-plugin-pwa`; priorizar que o lançamento de gasto funcione offline (fila local → sync).
- **Relatórios/export:** totais por categoria, por pessoa e por dia; export CSV/PDF.

## Reuso futuro (não bloqueia)
`rachaconta` (divisão de conta) e `zerosheet-finance` (gastos/orçamento) têm padrões potencialmente reaproveitáveis. Avaliar quando fizer sentido; hoje o Rumo segue independente.
