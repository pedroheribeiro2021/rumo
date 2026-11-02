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

~~O login não era o problema~~ — **errado, ver "Correção" abaixo.** O
`supabase-js` de fato não *apaga* a sessão em falha de rede, mas isso não
basta: ele avisa o app que não há sessão.

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

## Correção (2026-11-02) — sessão offline
Depois do deploy, o Pedro relatou que **nenhuma tela** funcionava offline.
Causa: o access token do Supabase dura 1h. Ao abrir o app sem rede depois
disso, o `supabase-js` tenta renovar o token com backoff por ~25s. Ao falhar,
emite `INITIAL_SESSION` com sessão **nula**, mesmo mantendo a sessão salva no
storage. O `RequireAuth` então mandava para `/login`, e o cache persistido
nunca chegava a aparecer. Na análise original foi lido só o `_callRefreshToken`,
não o `__loadSession`/`_emitInitialSession`. Confirmado agora com teste contra
o cliente real (`offlineSession.test.ts`).

**Decisão:**
- `AuthContext` começa já com a sessão salva no storage (`parseStoredSession`),
  sem esperar o `INITIAL_SESSION`, para não travar ~25s no "Carregando…".
  Exceção: URL com `?code=` (troca PKCE).
- Se o `INITIAL_SESSION` chega nulo mas a sessão continua no storage, segue com
  ela. O `supabase-js` só apaga a sessão quando o servidor recusa o refresh
  token, então sessão ainda salva quer dizer falha de rede. Quando a rede volta,
  o auto-refresh emite `TOKEN_REFRESHED`.
- `storageKey` passou a ser explícito em `supabase.ts` (`AUTH_STORAGE_KEY`), com
  o mesmo valor padrão, para não deslogar ninguém.

**Limitação:** "Sair" sem internet pode não funcionar, porque o `signOut`
precisa falar com o servidor.
