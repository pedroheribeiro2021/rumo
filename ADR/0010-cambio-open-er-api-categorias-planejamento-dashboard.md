# ADR 0010 — Troca da API de câmbio, categorias de Planejamento editáveis e dashboard da viagem

**Data:** 2026-07-29
**Status:** Aceita e implementada

## Contexto
O Pedro reportou em uso real que a Calculadora de Câmbio estava sempre
mostrando "câmbio indisponível". Investigando, a causa era externa: a
`exchangerate.host` (configurada em `VITE_FX_API_URL` desde a ADR 0007) foi
comprada pela apilayer e passou a exigir `access_key` paga até no endpoint
`/latest` — `fetchFxRate` sempre recebia `missing_access_key` e caía no
`return null` silencioso.

Na mesma conversa, o Pedro pediu duas melhorias de produto:
1. Um dashboard na tela principal da viagem com as informações-chave.
2. Categorias de Planejamento (hoje um `check` fixo em
   `rumo_planning_options.segment`: hospedagem/transporte/restaurante/
   atividade/praia/outro) cadastráveis e excluíveis por viagem, mantendo as
   existentes — **exceto "praia"**, específica demais pra ser default de
   toda viagem.

## Decisões

**1. Câmbio: troca para `open.er-api.com`.** API gratuita, sem chave,
atualização diária, e com melhor cobertura de moedas sul-americanas (ARS,
CLP, COP, PEN) do que alternativas ECB-only (ex.: Frankfurter, que só cobre
moedas do boletim do BCE). `fetchFxRate` (`web/src/lib/fx.ts`) passou de
`GET {base}/latest?base=X&symbols=Y` pra `GET {base}/v6/latest/{from}`,
checando `data.result === 'success'` antes de ler `data.rates[to]`. Testado
via `curl` direto na API antes de trocar — confirmado `missing_access_key`
na antiga e resposta válida com as moedas relevantes na nova.
`.env.example`, `web/.env.local` e `docs/architecture.md` atualizados. **A
env var `VITE_FX_API_URL` na Vercel (produção) precisa ser atualizada
manualmente** — variáveis `VITE_*` são embutidas no build, então só o código
não resolve produção; o Pedro foi avisado separadamente.

**2. `rumo_planning_categories` — mesmo padrão de `rumo_budget_categories`
(ADR 0007).** Nova tabela por viagem (`trip_id`, `name`, `sort_order`,
`unique(trip_id,name)`), RLS igual às demais. O `check` fixo em
`rumo_planning_options.segment` foi removido (constraint
`rumo_planning_options_segment_check` dropada) — `segment` vira texto livre,
cruzado por string com o nome da categoria, mesmo trade-off não-relacional já
aceito para `rumo_budget_items.category`. Toda viagem nova é semeada com
`PLANNING_CATEGORIES` (`web/src/lib/categories.ts`): hospedagem, transporte,
restaurante, atividade, outro — **sem "praia"**, por pedido explícito.
Viagens existentes (nenhuma tinha `rumo_planning_options` populado ainda)
foram populadas via backfill na própria migração. UI em `PlanningPage.tsx`:
filtro (`Tabs`) e chips do formulário passam a ler `usePlanningCategories`;
uma seção nova permite cadastrar (`+ nova categoria`) e excluir (`×` no
chip) — diferente de `rumo_budget_categories`, que só tem criação na UI
(`useDeleteBudgetCategory` existe no hook mas nunca foi ligado a nenhum
botão; não mexi nisso, fora do pedido desta sessão).

**3. Dashboard — expandir `TripDetailPage`, não nova aba.** Optei por não
criar uma 6ª aba na navbar (ADR 0007 já registrou a intenção de mantê-la
enxuta) — o resumo entra como um novo `Card` no topo da tela "Viagem", que já
é a home de cada viagem. Conteúdo: contagem regressiva (`Faltam N dias` /
`Viagem em andamento` / `Viagem concluída`, calculado por comparação de
string ISO pra evitar bug de fuso horário), orçamento (gasto x planejado com
`ProgressBar`, mesmo cálculo inline que `BudgetPage` já fazia), próximo dia
do roteiro (ou "nenhum dia planejado ainda") e progresso do checklist
(`X/Y concluídos`) — cada linha navega pra tela correspondente. O card de
atalhos "Passagens/Câmbio/Checklist" perdeu o Checklist (já coberto no
resumo).

## Consequências
- Migração `rumo_planning_categories_editaveis` aplicada direto no Supabase
  (projeto compartilhado `rachaconta`/`grsqjzrgngpyckcfkxon`) — sem tabela
  com dados de Planejamento ainda, o backfill não teve nada real pra migrar.
  `database.types.ts` atualizado manualmente (o MCP `generate_typescript_types`
  foi bloqueado pelo classificador do modo automático; tipagem da tabela nova
  espelhada à mão a partir de `rumo_budget_categories`).
- `npm run lint`, `npx vitest run` (24/24) e `npx tsc -b && vite build`
  rodaram limpos.
- **Verificação em navegador não foi completa**: tentei validar via
  `claude-in-chrome`, mas isso rodava no Chrome real do Pedro — percebi a
  meio caminho que criar uma conta de teste ali violava a regra de não criar
  contas sem permissão explícita. Parei, apaguei a conta de teste criada
  (`rumo.qa.dashboard.test@gmail.com`, sem confirmação de e-mail, sem
  perfil/viagem associada) do `auth.users` via SQL, e segui só com
  lint+testes+build+inspeção de código como verificação. Login real no app
  pra conferir visualmente o dashboard e as categorias de Planejamento ficou
  pendente — ver `Pendencias.md`.
