# ADR 0011 — Cache de leitura persistido no aparelho (consulta offline)

**Data:** 2026-10-31
**Status:** Aceita e implementada

## Contexto
O Pedro, em viagem, relatou que sem internet não conseguia ver nada do que
estava registrado no app. Causa: o cache do React Query vivia só na memória.
O service worker guardava só o app shell (de propósito, ver `vite.config.ts`),
então ao reabrir o PWA offline as telas abriam vazias ou ficavam no
carregando para sempre. A única coisa offline era a fila de gastos novos
(`offlineQueue.ts`), e até ela mostrava só os pendentes, porque o cache dos
gastos já sincronizados tinha sumido junto com a memória.

O login não era o problema: o `supabase-js` mantém a sessão no
`localStorage`, e falha de rede ao renovar o token (`AuthRetryableFetchError`)
não remove a sessão. Conferido no código do `auth-js` instalado.

## Decisão
- `PersistQueryClientProvider` (`@tanstack/react-query-persist-client`) +
  `createSyncStoragePersister` (`@tanstack/query-sync-storage-persister`)
  guardando o cache em `localStorage` na chave `rumo:query-cache`.
- `gcTime` e `maxAge` de **30 dias**: cobre uma viagem longa sem rede.
  `buster` `v1`: trocar quando o formato dos dados mudar de forma incompatível.
- `react-query` atualizado para 5.105 para usar o mesmo `query-core` dos
  pacotes de persistência.
- **Logout limpa o cache** (`clearOfflineCache` no evento `SIGNED_OUT` do
  `AuthContext`), para os dados de uma conta não ficarem para quem logar depois.

## Alternativas descartadas
- **Cache das respostas do Supabase no service worker (runtime caching do
  Workbox):** a chave do cache seria a URL + headers de auth, os dados
  ficariam fora do controle do React Query e a invalidação depois das
  mutations ficaria inconsistente.
- **IndexedDB (async persister):** só compensa se o volume passar do limite
  do `localStorage` (~5 MB). Hoje os dados de uma viagem cabem com folga.

## Limitações
- Só aparece offline o que já foi aberto online pelo menos uma vez naquele
  aparelho (a tela precisa ter carregado a query antes).
- Edições que não são lançamento de gasto (orçamento, roteiro etc.) continuam
  exigindo conexão. Só gasto novo entra na fila offline.
