# ADR 0003 — Integração do design system (Claude Design) e achado sobre magic link

**Data:** 2026-07-27
**Status:** Aceita

## Contexto
O Pedro gerou um design system completo no Claude Design (`design-system-brief.md`
como brief) e exportou como zip: tokens (cor/tipografia/espaçamento/elevação,
claro+escuro), 16 componentes-base em `.jsx` + `.d.ts` com CSS custom properties
inline (sem Tailwind classes), e telas de referência (`ui_kits/rumo-app/`)
cobrindo os 4 módulos já codados e os 3 que ainda não existem (Roteiro,
Orçamento, Monitor de preços).

## Decisão
- **Guardar o export original em `design-system/`** na raiz do repo (tokens,
  componentes originais, ui_kits, readme) — mesmo papel que `prototype/index.html`
  já tem: fonte de verdade visual, não código de produção.
- **Instalar `SKILL.md` como skill do projeto** em `.claude/skills/rumo-design/`,
  ajustando o caminho dos assets (`design-system/`, não colocation) para não
  duplicar os arquivos.
- **Portar os 16 componentes para `web/src/components/ui/*.tsx`** mantendo a
  abordagem original (CSS custom properties inline via `style`, não classes
  Tailwind) — decisão deliberada: os componentes já são 100% dirigidos por
  `var(--color-*)` etc., então reescrever para Tailwind não ganharia nada em
  fidelidade e arriscaria introduzir divergência manual. Apenas adicionei tipos
  TS (a partir dos `.d.ts` do export) e ajustei imports para o padrão do
  projeto (sem `import React from 'react'`, já que usa o JSX transform novo).
- **Tokens religados via `@theme`** em `web/src/index.css`, importando os 6
  arquivos de `web/src/styles/tokens/` (cópia dos tokens do design system) e
  mapeando os principais para utilities Tailwind (`bg-brand`, `rounded-xl`
  etc.) — só necessário para código de página que ainda usa classe Tailwind
  direto; os componentes portados não dependem disso.
- **Retrofit das 4 páginas existentes** (Login, Trips, TripDetail, Expenses)
  para usar os componentes novos, seguindo a composição exata dos `ui_kits`
  (ex.: Gastos passou de painel inline expansível para `Fab` + `Modal`
  bottom-sheet, igual ao mockup) — mantendo 100% da lógica real (hooks,
  Supabase, câmbio, split, settlement).

## Achado importante durante a validação: magic link consumido por scanner de e-mail
Ao tentar validar visualmente o login no navegador, todo link mágico dava
"One-time token not found" mesmo em tentativas imediatas. Os logs do Supabase
(`get_logs`, serviço `auth`) mostraram a causa: um evento `login` bem-sucedido
(`login_method: implicit`) aparece no servidor **antes** de qualquer clique
manual — ou seja, algo (scanner de segurança do Gmail/Google, tipo Safe
Browsing) está seguindo o link do e-mail automaticamente segundos após o
envio, consumindo o token de uso único antes do destinatário real clicar.

**Isso não é um bug do Rumo** — é uma interação conhecida entre magic links
(uso único, expiração curta) e scanners de e-mail corporativos/Google. Mas
**pode afetar usuários reais** da mesma forma que afetou os testes aqui.

### Mitigação sugerida (não implementada ainda)
Trocar o fluxo de "magic link clicável" por **OTP de 6 dígitos** enviado por
e-mail (`supabase.auth.verifyOtp({ email, token, type: 'email' })`), que o
usuário digita manualmente na tela — não é uma URL, então scanners de e-mail
não conseguem consumir o código sozinhos. Requer trocar `LoginPage.tsx`
(campo de código depois do envio) e o template de e-mail no Supabase
(dashboard → Authentication → Email Templates → Magic Link, usar
`{{ .Token }}` em vez de `{{ .ConfirmationURL }}`). Ver `Pendencias.md`.

## Consequências
- Qualquer nova tela deve puxar de `web/src/components/ui/` em vez de estilizar
  com classes Tailwind soltas — mantém a UI nascendo consistente com o design
  system, como já era o objetivo do `design-system-brief.md`.
- `ui_kits/rumo-app/{ItineraryScreen,BudgetScreen,PriceMonitorScreen}.jsx` (em
  `design-system/`) são a referência visual para a Sprint 2 — não são
  recriação de produção, o próprio design system avisa isso no `readme.md`.
- A confirmação visual de Trips/TripDetail/Expenses no navegador ficou
  pendente (bloqueada pelo problema de login acima) — revisar quando o login
  for validado.
