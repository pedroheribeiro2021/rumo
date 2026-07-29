# ADR 0008 — Testes automatizados (Vitest) + CI no GitHub

**Data:** 2026-07-29
**Status:** Aceita e implementada

## Contexto
Depois do pacote de mudanças da ADR 0007, o Pedro pediu duas coisas: (1) CI no
GitHub pra "facilitar e manter boas práticas" e (2) testes automatizados, pra
não depender de teste visual manual toda vez (a extensão Claude in Chrome não
tinha permissão de host pra `localhost` nesta máquina, o que expôs a lacuna).

## Decisões

**CI**: `.github/workflows/ci.yml`, roda em push/PR pra `main` — `npm ci`,
`npm run lint` (oxlint), `npm run test` (vitest), depois `npm run build`
(`tsc -b && vite build`) com env vars placeholder do Supabase (o cliente só
lança erro se as env vars faltarem — não são realmente usadas em build
estático, mas manter o valor evita qualquer acoplamento futuro).

**Testes — Vitest + Testing Library, focado em lógica pura primeiro.**
Adicionado `vitest`, `@testing-library/react`, `@testing-library/jest-dom`,
`jsdom` como dev deps; `vite.config.ts` ganhou o bloco `test` (import de
`defineConfig` trocado pra `vitest/config`, padrão oficial pra projeto
Vite+Vitest único arquivo de config). Script `npm run test` = `vitest run`.

Escopo escolhido: **priorizar lógica de negócio pura, não renderização de
página inteira.** As páginas (`ExpensesPage`, `BudgetPage` etc.) dependem de
react-query + react-router + Supabase client — testar elas de ponta a ponta
exigiria mockar tudo isso, um investimento bem maior. Em vez disso, a lógica
de cálculo mais arriscada foi **extraída pra funções puras testáveis**:
- `computeBalances` (novo, em `web/src/lib/settlement.ts`) — extraído do
  `useMemo` que antes vivia dentro de `ExpensesPage.tsx`. É exatamente a
  lógica do bug corrigido na ADR 0007 (gasto sem split não pode virar crédito
  fantasma) — agora tem teste cobrindo esse caso específico, pra não
  regredir.
- `computeSpentByCategory`/`computeSpentByDay` (novo, `web/src/lib/budget.ts`)
  — extraído dos dois `useMemo` que viviam em `BudgetPage.tsx`.
- `splitEquallyCents`/`computeSettlement` (já existiam em `settlement.ts`) —
  ganharam testes que não existiam antes.
- `formatMoney` (`web/src/lib/format.ts`) — teste simples de formatação.

Um teste de componente (`ProgressBar.test.tsx`, via
`@testing-library/react`) foi incluído de propósito pra provar que o setup
também renderiza React de verdade (`jsdom`), não só funções puras — deixa o
caminho aberto pra testar outros componentes de apresentação (sem
dependência de rede) no futuro sem precisar reconfigurar nada.

**O que ficou de fora, deliberadamente**: testes de páginas completas (exigem
mock de Supabase/react-query/router), testes de integração contra o Supabase
de verdade, e testes E2E (Playwright/Cypress) — nenhum desses foi pedido
explicitamente e todos são investimentos bem maiores que o escopo desta
sessão. Se algum dia a página ficar complexa o suficiente pra justificar,
vale revisitar.

## Consequências
- `npm run test` roda 4 arquivos de teste, 20 testes, todos passando.
- `npm run lint`, `npm run test` e `npm run build` (com env vars placeholder)
  validados localmente antes de subir a CI.
- Toda lógica de cálculo nova/arriscada desta sessão (divisão opcional,
  orçamento por categoria/dia) agora tem teste — reduz a dependência de
  verificação visual manual pro que já está coberto, mas **não substitui**
  teste manual de UI/fluxo (formulários, modais, navegação) — isso continua
  precisando de teste no navegador quando o Pedro quiser validar visualmente.
