# Registro de Sessões — Rumo

## 2026-07-29 (cont. 2) — Unificação Ideias+Logística em "Planejamento" + Checklist

**Objetivo:** o Pedro pediu uma seção de planejamento parecida com a aba
Ideias, dando hospedagem como exemplo ("opções de hotéis/airbnbs cidade XX")
e anexou a planilha que usou pra planejar a última viagem
(`Viagem .xlsx`, Cartagena/San Andrés) como referência — pedindo
explicitamente pra eu trazer a ideia antes de implementar. Analisei as 7
abas da planilha (a maioria já coberta pelo app) e propus unificar Ideias +
Logística num módulo só ("Planejamento", com preço e cidade nas opções) mais
um Checklist de bagagem (achado extra na planilha, não pedido originalmente).
O Pedro confirmou os 3 pontos via pergunta estruturada. A partir daqui,
primeira vez seguindo a nova convenção (branch + PR, não commit direto em
`main`, combinada mais cedo no mesmo dia).

**Decisões:** ver `ADR/0009-unificacao-planejamento-e-checklist.md`.

**Alterações:**
- `rumo_itinerary_ideas` + `rumo_logistics_entries` → **`rumo_planning_options`**
  (nova tabela unificada, com `city`/`price`/`currency`/`date_from`/`date_to`
  novos); as duas antigas foram dropadas (sem dados em produção ainda).
  `usePromotePlanningOption` generaliza o "promover", com exclusividade
  (descarta concorrentes) só por cidade+segmento pra `hospedagem`/
  `transporte` — resolveu uma regressão que a generalização ingênua
  causaria pra atividades/restaurantes do mesmo dia (ver ADR 0009).
- **`rumo_checklist_items`** (nova): lista simples de bagagem/pré-viagem,
  acessível por link na tela Viagem (não é aba da navbar).
- Navbar: aba "Logística" virou **"Planejamento"**; sub-aba "Ideias" (que
  vivia dentro de Roteiro) foi removida — o conteúdo mora inteiro na nova
  página.
- `lib/planning.ts` (`groupByCity`, novo, testado) — agrupamento por cidade
  seguindo o padrão de extração de lógica pura da ADR 0008.

**Validação:** `npm run lint`, `npm run test` (24/24) e `npm run build`
(env vars placeholder) rodados localmente; `get_advisors` sem lacunas novas.

**Arquivos modificados/criados:** `supabase/schema.sql`,
`web/src/lib/database.types.ts`, `web/src/lib/types.ts`,
`web/src/hooks/usePlanningOptions.ts` (novo, substitui `useItineraryIdeas.ts`
e `useLogistics.ts`, removidos), `web/src/hooks/useChecklist.ts` (novo),
`web/src/lib/planning.ts` + `planning.test.ts` (novos),
`web/src/pages/PlanningPage.tsx` (novo, substitui `LogisticsPage.tsx`,
removido), `web/src/pages/ChecklistPage.tsx` (novo),
`web/src/pages/ItineraryPage.tsx` (revertido, tira a sub-aba Ideias),
`web/src/pages/TripDetailPage.tsx`, `web/src/components/AppBottomNav.tsx`,
`web/src/App.tsx`, `ADR/0009-*.md` (novo), `Pendencias.md`,
`Registro-de-Sessoes.md`.

---

## 2026-07-29 (cont.) — CI no GitHub + testes automatizados

**Objetivo:** depois do pacote de mudanças da sessão anterior (mesmo dia), o
Pedro pediu CI no GitHub e testes automatizados — motivado em parte por eu
não ter conseguido testar visualmente no navegador (extensão Claude in Chrome
sem permissão de host pra `localhost` nesta máquina). Decidiu também que,
daqui pra frente, não vamos mais commitar direto em `main` — passamos a usar
branch + PR.

**Decisões:** ver `ADR/0008-testes-automatizados-e-ci.md`.

**Alterações:**
- `.github/workflows/ci.yml` (novo): lint (oxlint) + testes (vitest) + build
  em todo push/PR pra `main`.
- `vitest` + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`
  como dev deps; `vite.config.ts` com bloco `test` (import de `defineConfig`
  trocado pra `vitest/config`); script `npm run test`.
- **Extraído lógica de negócio pra funções puras testáveis** (antes viviam
  dentro de `useMemo` nas páginas): `computeBalances` (novo, em
  `lib/settlement.ts`, extraído de `ExpensesPage.tsx` — cobre exatamente o
  bug do acerto de contas corrigido na sessão anterior) e
  `computeSpentByCategory`/`computeSpentByDay` (novo, `lib/budget.ts`,
  extraído de `BudgetPage.tsx`).
- 4 arquivos de teste, 20 testes: `settlement.test.ts`, `budget.test.ts`,
  `format.test.ts`, `ProgressBar.test.tsx` (este último prova que o setup
  também renderiza componentes React via `jsdom`, não só funções puras).

**Validação:** `npm run lint`, `npm run test` (20/20) e `npm run build` (com
env vars placeholder do Supabase, igual à CI) rodados localmente antes do
commit.

**Arquivos modificados/criados:** `.github/workflows/ci.yml` (novo),
`web/vite.config.ts`, `web/package.json`, `web/src/test/setup.ts` (novo),
`web/src/lib/{settlement,budget}.ts`, `web/src/lib/*.test.ts` (novos),
`web/src/components/ui/ProgressBar.test.tsx` (novo),
`web/src/pages/{ExpensesPage,BudgetPage}.tsx`, `ADR/0008-*.md` (novo),
`Pendencias.md`, `Registro-de-Sessoes.md`.

---

## 2026-07-29 — Navbar, orçamento flexível, divisão opcional, edição e 2 módulos novos

**Objetivo:** o Pedro trouxe uma lista de 9 pedidos usando o app no dia a dia
(viagem real de Foz do Iguaçu): navbar de verdade, categorias de orçamento
cadastráveis, divisão de gasto opcional, orçamento por dia, calculadora de
câmbio, editar viagem/roteiro, módulo de ideias de roteiro (planos A/B/C),
cadastro de hospedagens/aeroportos, e upload de capa (prioridade mínima).
Entrei em modo de planejamento (Plan Mode), rodei 3 agentes de exploração em
paralelo pra levantar o estado atual do código, esclareci 3 pontos ambíguos
com `AskUserQuestion` (base de dados pra futuras viagens = já coberto;
categorias por viagem, não globais; navbar com 5 abas, não 6) e implementei
tudo em 8 fases sequenciais.

**Decisões e detalhes técnicos:** ver `ADR/0007-navbar-orcamento-flexivel-divisao-opcional-modulos-novos.md`.

**Alterações principais:**
- `AppBottomNav.tsx` (novo) + `AppLayout.tsx`: navbar fixa reaproveitando o
  `BottomNav` do design system (existia, nunca tinha sido usado).
- `useUpdateItineraryDay` (novo) + modais de edição em `TripDetailPage.tsx`
  (viagem, usando `useUpdateTrip` que já existia mas nunca era chamado) e
  `ItineraryPage.tsx` (dia, incluindo campo `title` até então morto).
- `ExpensesPage.tsx`/`useExpenses.ts`: modo "não dividir" (default) além de
  igual/manual; **corrigido junto** um bug latente no acerto de contas que
  creditaria o valor cheio ao pagador mesmo sem nenhum split.
- `rumo_budget_categories` (nova tabela, por viagem) + `day_date` em
  `rumo_budget_items`: `BudgetPage.tsx` ganhou cadastro de categoria inline e
  seção "Por dia"; `ExpensesPage.tsx` passou a usar as mesmas categorias.
- `rumo_logistics_entries` (nova, hospedagens+aeroportos com discriminador
  `entry_type`) → `LogisticsPage.tsx` em `/trips/:tripId/logistica`.
- `rumo_itinerary_ideas` (nova, ideias/planos A-B-C) → sub-aba "Ideias" em
  `ItineraryPage.tsx`, com `usePromoteIdea` escrevendo o conteúdo escolhido
  de volta no dia do roteiro.
- `CurrencyCalculatorPage.tsx` (nova) em `/trips/:tripId/cambio`, reaproveita
  `fetchFxRate` já existente.
- `cover_image_url` em `rumo_trips` + bucket Storage `rumo-trip-covers` +
  `useUploadTripCover`: upload de imagem de fundo no cabeçalho da viagem.

**Validação:** `tsc --noEmit` e `npm run build` limpos ao final de cada fase;
`get_advisors` (security) rodado depois de cada migração — nenhuma lacuna de
RLS nova introduzida.

**Arquivos modificados/criados:** ver lista completa na ADR 0007. Resumo:
`web/src/components/AppBottomNav.tsx` (novo), `AppLayout.tsx`,
`web/src/pages/{TripDetailPage,ItineraryPage,BudgetPage,ExpensesPage}.tsx`,
`web/src/pages/{LogisticsPage,CurrencyCalculatorPage}.tsx` (novos),
`web/src/hooks/{useBudgetCategories,useLogistics,useItineraryIdeas}.ts`
(novos), `useItinerary.ts`, `useBudget.ts`, `useTrips.ts`, `useExpenses.ts`,
`web/src/lib/types.ts`, `web/src/lib/database.types.ts`, `supabase/schema.sql`,
`web/src/App.tsx`, `ADR/0007-*.md` (novo), `Pendencias.md`.

---

## 2026-07-28 — Reset de senha + recuperação de senha (OTP)

**Objetivo:** Pedro esqueceu a senha; resetei direto no banco (a pedido, pra
`123456` — senha temporária/fraca de propósito, ele troca depois) e
implementei o "esqueci minha senha" que estava pendente.

**Alterações:**
- `ForgotPasswordPage.tsx` (nova, rota `/esqueci-senha`): 3 passos sem
  nenhum link clicável — e-mail → código de 6 dígitos → nova senha
  (`resetPasswordForEmail` → `verifyOtp({type:'recovery'})` →
  `updateUser({password})`). Link "Esqueci minha senha" adicionado em
  `LoginPage` (modo entrar).
- Mesma lógica do ADR 0004 (magic link comido pelo scanner de e-mail):
  código digitado é mais robusto que link clicável.

**Validado ponta a ponta o que dava pra validar sem acesso ao dashboard:**
testei o formulário completo (todos os 3 passos, mensagens de erro) usando
o `token_hash` do link como código inválido de propósito — confirmei que
`verifyOtp` rejeita corretamente ("Código inválido ou expirado"). Isso
provou uma coisa importante: **o `token_hash` da URL do link não é o mesmo
valor que o código de 6 dígitos** — só aparece um código digitável se o
template do e-mail usar `{{ .Token }}` em vez de `{{ .ConfirmationURL }}`,
e essa edição só dá pra fazer manualmente no dashboard (mesma limitação já
registrada no ADR 0004, sem endpoint MCP/API pra isso).

**Pendência real**: o Pedro precisa editar o template "Reset Password" no
Supabase (texto sugerido no ADR 0006) antes do fluxo funcionar de ponta a
ponta pra um usuário de verdade.

**Decisões:** ver `ADR/0006-recuperacao-de-senha-otp.md`.

**Arquivos modificados:** `web/src/pages/ForgotPasswordPage.tsx` (novo),
`web/src/pages/LoginPage.tsx`, `web/src/App.tsx`, `ADR/0006-*.md` (novo),
`Pendencias.md`, `Registro-de-Sessoes.md`.

---

## 2026-07-27 (madrugada, cont. 2) — Fix de produção (404 em rotas profundas) + viagem real populada

**Objetivo:** limpar a conta de teste do convite (Pedro ia convidar a
namorada de verdade) e popular a viagem real com dados de uma planilha do
Pedro.

**Achado crítico ao validar em produção:** rotas profundas
(`/trips/:id/roteiro`, etc.) davam **404 em produção** ao acessar
direto/recarregar — a Vercel não sabia que devia servir `index.html` pra
qualquer rota que não fosse um arquivo estático (comportamento padrão de
SPA com client-side routing). Corrigido com `web/vercel.json` (rewrite
catch-all, configuração oficial da Vercel pra Vite SPA). Sem isso, qualquer
link direto compartilhado (inclusive o convite de membro) quebraria.

**Limpeza:**
- Removida a conta de teste (`+namorada@gmail.com`) e seu vínculo em
  `rumo_trip_members` — confirmado sem sobra (`rumo_profiles` também
  limpo via cascade).
- Removidos os dados de teste que eu tinha criado na viagem real durante a
  validação do Sprint 2/3/convite: 1 dia de roteiro solto, 1 item de
  orçamento (`alimentação` R$300), os gastos "Almoço"/"Uber offline", e o
  monitor de passagens BSB→IGU com observações inventadas.

**Populado com dados reais:** a viagem "Foz do Iguaçu" recebeu
`destination`/`start_date`/`end_date` (31/10 a 09/11/2026) e o roteiro
completo de 10 dias + orçamento por categoria, extraídos da planilha
`Comparativo_Viagens_2026_V2` (Google Sheets, acessada via
`mcp__claude_ai_Google_Drive`, já que o arquivo `.gsheet` local é só um
ponteiro do Google Drive Desktop — não dá pra ler pelo filesystem direto,
`Read`/`Get-Content` falham com "Função incorreta"/EISDIR). A planilha
compara 6 destinos; "Foz + Argentina + Paraguai (+ Buenos Aires)" é a opção
vencedora (~R$9 mil o casal, 9–10 dias) e já bate com a viagem existente no
app.

**Decisão de mapeamento**: a planilha agrupa "hospedagem + alimentação +
transporte local" num valor só (R$5.600); o app rastreia essas 3 categorias
separadas. Coloquei o valor inteiro em `hospedagem` por ora e documentei em
`Pendencias.md` — não inventei uma quebra que a planilha não informava.

**Pendências:** ver `Pendencias.md`.

**Arquivos modificados:** `web/vercel.json` (novo — fix crítico),
`Pendencias.md`, `Registro-de-Sessoes.md`. Dados de produto alterados
diretamente no Supabase (não são arquivo de repositório): `rumo_trips`,
`rumo_itinerary_days`, `rumo_budget_items`, `rumo_trip_members`,
`rumo_expenses`, `rumo_price_watches`.

---

## 2026-07-27 (madrugada, cont.) — Convite de membro por e-mail (multi-usuário real)

**Objetivo:** responder e resolver se dois usuários reais conseguem
compartilhar/co-gerenciar a mesma viagem (pergunta do Pedro: viajar com a
namorada).

**Achado ao investigar:** o modelo de dados (`trip_members.profile_id` +
RLS via `rumo_is_trip_member`) já suportava isso desde o início, mas
"Adicionar membro" só criava um nome pra divisão de gasto — sem vínculo de
conta real. Faltava o fluxo de convite.

**Alterações:**
- `rumo_invite_trip_member` (função `SECURITY DEFINER` nova, migration
  `rumo_trip_member_invite_by_email`): vincula `profile_id` na hora se o
  e-mail convidado já tiver conta (precisa ser definer pra contornar a RLS
  de `rumo_profiles`, que só deixa ver o próprio perfil).
- `rumo_handle_new_user` (trigger existente, só adicionei uma linha): ao
  cadastrar, vincula automaticamente qualquer convite pendente com esse
  e-mail.
- `useInviteTripMember` (hook novo) + campo de e-mail opcional em
  `TripDetailPage`, com `StatusChip` mostrando "conta vinculada" ou "convite
  pendente" por membro.
- Tipos regenerados (`database.types.ts`), `supabase/schema.sql` atualizado.

**Validado ponta a ponta:** convidei um e-mail sem conta (ficou "convite
pendente"), criei a conta de teste com esse e-mail, confirmei o vínculo
automático via SQL, logei com a conta nova — acesso completo à viagem do
Pedro (gastos, total, acerto de contas, membros), sem precisar escrever
nenhum código extra de leitura (a RLS já cobria).

**Decisões:** ver `ADR/0005-convite-membro-por-email.md`.

**Pendências:** ver `Pendencias.md` — não envia e-mail de convite de
verdade (só cria/vincula o registro); ficaram uma conta e uma viagem de
teste reais no Supabase compartilhado.

**Arquivos modificados:** `supabase/schema.sql`,
`web/src/lib/database.types.ts`, `web/src/hooks/useTripMembers.ts`,
`web/src/pages/TripDetailPage.tsx`, `ADR/0005-*.md` (novo), `Pendencias.md`,
`Registro-de-Sessoes.md`. Vault do Obsidian também atualizado (`Índice.md`,
`Projetos/README.md`, `Infra-Cloud-Compartilhada.md`).

---

## 2026-07-27 (madrugada) — Sprint 3: Monitor de passagens, PWA offline, deploy

**Objetivo:** monitor de passagens, PWA com fila offline de gastos, e deploy
em produção na Vercel.

**Alterações:**
- `usePriceWatches.ts`/`usePriceObservations.ts` + `PriceWatchesPage.tsx`
  (lista de trechos com `StatusChip` indicando alvo atingido) +
  `PriceWatchDetailPage.tsx` (histórico + `PriceHistoryChart.tsx` — gráfico
  de linha SVG com crosshair/tooltip no hover, seguindo a skill `dataviz`:
  marca fina 2px, alvo como linha tracejada, labels seletivos, tabela de
  histórico como view acessível). Entrada 100% manual (arquitetura já
  documentava que scraping de milhas/tarifas não é viável).
- **PWA**: `vite-plugin-pwa` (manifest + service worker via Workbox,
  `registerType: autoUpdate`). Ícones reais gerados (antes só existia um
  favicon genérico) renderizando um HTML com o teal da marca + "R" e
  capturando via screenshot do Chrome — `web/public/icon-192.png`,
  `icon-512.png`, `apple-touch-icon.png`.
- **Fila offline de gastos** (`web/src/lib/offlineQueue.ts`, localStorage em
  vez de IndexedDB por simplicidade): `useCreateExpense` cai pra fila local
  quando a rede falha de verdade; `useExpenses` mescla pendentes + servidor
  e sobrevive a uma falha de fetch mantendo o cache anterior;
  `useSyncPendingExpenses` reenvia sozinho quando a conexão volta.
  `OfflineBanner` (já existia no design system) mostra a pendência.
- **Achado importante:** o React Query pausa mutations/queries por padrão
  quando `navigator.onLine` é `false` e nunca chama `mutationFn`/`queryFn` —
  precisei `networkMode: 'always'` nos dois hooks pra que meu próprio
  try/catch (que decide se guarda na fila) rode de verdade.
- **Deploy:** Pedro conectou a Vercel ao GitHub
  (`pedroheribeiro2021/rumo`, root `web/`) e configurou as env vars.
  Confirmado build `READY` em produção.

**Validado ponta a ponta no navegador:**
- Monitor de passagens: criei trecho BSB→IGU (alvo R$700), registrei 2
  observações (R$900 e R$650) — gráfico e `StatusChip` ("no alvo") corretos.
- Offline: bloqueei o `fetch` de verdade pro Supabase (não só
  `navigator.onLine`, que sozinho não bastava — ver achado acima), lancei um
  gasto, confirmei fila + banner, restaurei a rede, confirmei sincronização
  automática e o registro real no banco via SQL.

**Decisões:** nenhum ADR novo nesta sessão — decisões de escopo (localStorage
em vez de IndexedDB, entrada manual em vez de scraping) já estavam
documentadas em `architecture.md`/ADRs anteriores.

**Pendências:** ver `Pendencias.md` — Relatórios/export é o único item do
roadmap ainda não feito; recuperação de senha; sync offline não é
Background Sync de verdade (só funciona com a tela aberta).

**Arquivos modificados:** `web/src/hooks/{usePriceWatches,usePriceObservations,useOnlineStatus}.ts` (novo),
`web/src/pages/{PriceWatchesPage,PriceWatchDetailPage}.tsx` (novo),
`web/src/components/PriceHistoryChart.tsx` (novo),
`web/src/lib/offlineQueue.ts` (novo), `web/src/lib/types.ts`,
`web/src/hooks/useExpenses.ts`, `web/src/pages/{ExpensesPage,TripDetailPage}.tsx`,
`web/src/App.tsx`, `web/vite.config.ts`, `web/index.html`,
`web/public/{icon-192,icon-512,apple-touch-icon}.png` (novo),
`docs/roadmap.md`, `Pendencias.md`, `Registro-de-Sessoes.md`.

---

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
