# Contexto para o Claude Code — projeto Rumo

Este arquivo orienta o desenvolvimento contínuo. Leia antes de codar.

## O que é
App de planejamento e gestão de viagens, reutilizável e multiusuário. Diferencial: **controle de gastos durante a viagem** que substitui a planilha (rápido, multi-moeda, divide entre pessoas e faz o acerto de contas). Um módulo de **monitor de preços de passagens** complementa o produto.

## Princípios de produto
- **Rápido acima de tudo:** lançar um gasto tem que levar ~3 toques. Nada de formulário longo.
- **Funciona no celular e offline:** PWA; gastos lançados offline sincronizam depois.
- **Multi-moeda de verdade:** cada gasto guarda moeda original + taxa p/ a moeda base da viagem.
- **Colaborativo:** vários viajantes numa viagem; divisão e saldo por pessoa.

## Stack e convenções
- React 18 + Vite + TypeScript + Tailwind. Componentes funcionais, hooks.
- Estado do servidor via `@tanstack/react-query` sobre o `@supabase/supabase-js`.
- Supabase para Auth (magic link/e-mail), Postgres e RLS. Nada de service key no frontend — só a anon/publishable key.
- Moeda: guardar valores em inteiro de centavos quando possível; conversão via taxa salva no lançamento (não recalcular retroativo).
- Datas em ISO (YYYY-MM-DD). Timezone-safe.

## Modelo de dados
Fonte da verdade: `supabase/schema.sql`. Tabelas: profiles, trips, trip_members, itinerary_days, budget_items, expenses, expense_splits, price_watches, price_observations. RLS: usuário só acessa viagens onde é membro.

## Ordem sugerida de implementação (MVP primeiro)
1. **Scaffold**: `npm create vite@latest web -- --template react-ts`, Tailwind, supabase client, react-query, react-router. (Mova para a raiz ou mantenha em `web/` — decidir e documentar.)
2. **Auth** (magic link) + tela de lista de **Viagens** (CRUD).
3. **Gastos** — a tela mais importante: adicionar gasto (valor, categoria, moeda, quem pagou, divisão igual/custom), lista corrida, total vs orçamento.
4. **Acerto de contas** — cálculo "quem deve a quem" (algoritmo de minimização de transferências).
5. **Roteiro** e **Orçamento** (CRUD simples).
6. **Monitor de passagens** — price_watches + price_observations, gráfico (reaproveitar lógica do `prototype/index.html`). Coleta automática via Edge Function — ver `docs/architecture.md` (limitação: scraping de milhas é inviável; usar tarifa em dinheiro + rastreamento nativo do Google Voos como rede de segurança).
7. **PWA** (offline para gastos) + Relatórios/export.

## Semente
`prototype/index.html` é um protótipo single-file já funcional (monitor, roteiro, orçamento, calc. de milhas) usado como referência de UX e regras.

## Não fazer
- Não colocar segredos no repo (use `.env`, veja `.env.example`).
- Não bloquear o lançamento de gasto atrás de conexão — tem que funcionar offline.
