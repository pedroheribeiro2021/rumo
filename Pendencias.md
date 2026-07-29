# Pendências — Rumo

## Em aberto
- **Dia do roteiro só tem um `title`/`notes`, não períodos (Manhã/Almoço/Tarde/Noite).**
  Promover mais de uma opção de Planejamento pro mesmo dia sobrescreve o
  conteúdo anterior. Identificado ao revisar a planilha de viagem do Pedro
  (aba Roteiro usa períodos) — deixado pra depois de propósito, ver ADR 0009.
- **`npm audit` acusa 10 vulnerabilidades "high"** (descoberto ao instalar as
  deps de teste em 2026-07-29): `react-router` 7.12.0–8.2.0 tem um CSRF
  bypass em modo RSC (não usamos RSC, mas vale atualizar) e `brace-expansion`
  (via `vite-plugin-pwa`→`workbox-build`) tem um DoS por expansão ilimitada.
  Ambos exigem `npm audit fix --force` (downgrade breaking de
  `react-router-dom` e `vite-plugin-pwa`) — não apliquei por ser fora do
  escopo pedido; avaliar depois com calma.
- **Relatórios + export CSV/PDF** — único item do Sprint 3 ainda não feito. Ver `docs/roadmap.md`.
- **Convite por e-mail não envia e-mail de verdade** — só cria/vincula o registro (ADR 0005). O dono precisa avisar a pessoa fora do app pra criar conta com aquele e-mail. Automatizar exigiria Edge Function + serviço de e-mail transacional.
- Nenhuma tela de edição de **gasto** ou **item de orçamento** ainda (só criar/excluir) — viagem e dia de roteiro já ganharam edição na sessão de 2026-07-29 (ADR 0007), monitor de passagens também segue só criar/excluir.
- **Sincronização offline só funciona com a tela de Gastos aberta.** Não é
  Background Sync de verdade (nível de service worker) — se o usuário lançar
  um gasto offline e fechar o app antes de reconectar, a sincronização só
  acontece na próxima vez que abrir a tela de Gastos já online. Suficiente
  pro MVP, mas é uma limitação a documentar caso vire reclamação real.
- Ícones do PWA (`web/public/icon-*.png`) são só um "R" sobre teal sólido —
  sem versão maskable com área de segurança (Android pode cortar em círculo
  e cortar a letra). Funcional, mas não é polimento final de marca.
- **Orçamento da viagem real** tem uma categoria "guarda-chuva": o item
  "hospedagem" (R$5.600) na verdade representa hospedagem + alimentação +
  transporte local combinados (é como a planilha de origem agrupava). Se
  quiser comparação por categoria mais precisa, vale quebrar esse valor em
  `hospedagem`/`alimentação`/`transporte` na tela de Orçamento.

## Concluído
- **Unificação de Ideias + Logística em "Planejamento"** (com preço e cidade
  nas opções, promover com exclusividade por cidade só pra hospedagem/
  transporte) **+ Checklist de bagagem** — a pedido do Pedro, usando a
  planilha da última viagem dele como referência. Ver ADR 0009.
- **CI no GitHub (lint + testes + build) + testes automatizados (Vitest)** —
  ver ADR 0008. Lógica de negócio arriscada (acerto de contas, orçamento por
  categoria/dia, agrupamento de planejamento por cidade) extraída pra
  funções puras com teste; testes de página completa (mock de Supabase/
  react-query/router) e E2E ficaram fora do escopo, ver ADR 0008.
- **Navbar, orçamento flexível, divisão opcional, edição de viagem/roteiro,
  calculadora de câmbio e upload de capa** — os pedidos da sessão de
  2026-07-29, ver ADR 0007 (os módulos "Ideias de roteiro" e "Logística"
  criados aqui foram depois unificados em "Planejamento", ver ADR 0009).
- **Recuperação de senha** — template "Reset Password" ajustado pelo Pedro no
  dashboard do Supabase; fluxo de código validado ponta a ponta (ADR 0006).
- Scaffold, Tailwind, Supabase, CRUD de Viagens, Gastos com divisão e
  acerto de contas, design system integrado, login por e-mail+senha,
  Orçamento, Roteiro — ver `Registro-de-Sessoes.md`.
- **Sprint 3:** Monitor de passagens (`PriceWatchesPage`,
  `PriceWatchDetailPage`, gráfico de histórico com hover/tooltip), PWA
  (`vite-plugin-pwa`, manifest, ícones reais, service worker) e fila offline
  de gastos com sincronização automática (`web/src/lib/offlineQueue.ts`).
  Validado ponta a ponta no navegador, inclusive simulando queda de conexão
  de verdade (fetch bloqueado) e reconexão.
- **Deploy em produção na Vercel**, conectado ao GitHub
  (`pedroheribeiro2021/rumo`) com auto-deploy a cada push. Env vars
  configuradas. Lembrar de manter o **Site URL** do Supabase Auth apontando
  pro domínio de produção (não localhost) — ver instrução passada ao Pedro
  na sessão de deploy.
- **Fix de produção: rotas profundas davam 404.** `/trips/:id/roteiro` etc.
  quebravam ao acessar direto ou recarregar (SPA sem rewrite configurado na
  Vercel). Corrigido com `web/vercel.json` (rewrite catch-all pra
  `index.html`, padrão oficial da Vercel pra SPA Vite).
- **Multi-usuário real (2+ contas na mesma viagem)** — convite por e-mail
  com vínculo automático de conta (ADR 0005). Validado ponta a ponta: convite
  pendente, criação de conta, vínculo automático via trigger, acesso
  completo à viagem (gastos, membros, acerto de contas) com login separado.
  Conta de teste usada na validação já foi removida do banco.
- **Viagem real populada**: "Foz do Iguaçu" (31/10 a 09/11/2026) com roteiro
  de 10 dias e orçamento por categoria, a partir do
  `Comparativo_Viagens_2026_V2` (Google Sheets) — opção vencedora da
  comparação entre 6 destinos. Dados de teste (gastos, monitor de passagens)
  removidos da viagem.
