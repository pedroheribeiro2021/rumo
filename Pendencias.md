# Pendências — Rumo

## Em aberto
- **Relatórios + export CSV/PDF** — único item do Sprint 3 ainda não feito. Ver `docs/roadmap.md`.
- **Convite por e-mail não envia e-mail de verdade** — só cria/vincula o registro (ADR 0005). O dono precisa avisar a pessoa fora do app pra criar conta com aquele e-mail. Automatizar exigiria Edge Function + serviço de e-mail transacional.
- Nenhuma tela de edição de gasto/orçamento/roteiro/monitor existente ainda (só criar/excluir).
- **Recuperação de senha: falta 1 ajuste manual seu pra funcionar de verdade.**
  Implementei o fluxo (código de 6 dígitos, não link — ADR 0006), mas o
  e-mail só vai mostrar o código depois que você trocar o template "Reset
  Password" no dashboard do Supabase (Authentication → Email Templates) pra
  usar `{{ .Token }}` em vez de `{{ .ConfirmationURL }}`. Sem isso, o e-mail
  só tem o link (mesmo problema do scanner do ADR 0003/0004). Texto sugerido
  no ADR 0006.
- Orçamento compara categoria por string exata com `rumo_expenses.category`
  — ambos usam a mesma lista fixa (`EXPENSE_CATEGORIES` em
  `web/src/lib/categories.ts`), então funciona, mas se algum dia a categoria
  virar texto livre em algum dos dois lados o cruzamento quebra.
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
