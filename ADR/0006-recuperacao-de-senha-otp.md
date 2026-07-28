# ADR 0006 — Recuperação de senha com código de 6 dígitos (não link)

**Data:** 2026-07-28
**Status:** Aceita (implementação completa; falta 1 passo manual no dashboard)

## Contexto
Faltava a tela de "esqueci minha senha" (pendência aberta desde o ADR 0004).
O caminho padrão do Supabase (`resetPasswordForEmail` + link de e-mail) tem o
mesmo problema já diagnosticado no ADR 0003: o link é vulnerável a scanners
de segurança de e-mail (Gmail/Google Safe Browsing) que "clicam" nele antes
do usuário real, consumindo o token de uso único.

## Decisão
`ForgotPasswordPage.tsx` com 3 passos, sem nenhum link clicável no fluxo:
1. E-mail → `supabase.auth.resetPasswordForEmail(email)`.
2. Código de 6 dígitos digitado manualmente → `supabase.auth.verifyOtp({ email, token: code, type: 'recovery' })`.
3. Nova senha → `supabase.auth.updateUser({ password })` (a sessão já existe
   desde o passo 2 — `verifyOtp` com sucesso já autentica).

## Ação manual pendente (não automatizável)
O template de e-mail "Reset Password" do Supabase usa por padrão
`{{ .ConfirmationURL }}` (só o link) — o valor que aparece na URL do link
é um `token_hash`, **diferente** do código de 6 dígitos que `verifyOtp`
espera. Confirmei isso testando: usar o `token_hash` extraído do link como
"código" retorna "One-time token not found"/inválido.

**Para o código de 6 dígitos aparecer no e-mail de verdade**, o Pedro precisa
editar manualmente (dashboard do Supabase → Authentication → Email
Templates → **Reset Password**), trocando o corpo para usar `{{ .Token }}`
em vez de `{{ .ConfirmationURL }}`, por exemplo:

```html
<h2>Redefinir senha</h2>
<p>Seu código de recuperação: <strong>{{ .Token }}</strong></p>
<p>Ele expira em pouco tempo e só funciona uma vez.</p>
```

Não há endpoint MCP/API disponível pra automatizar essa edição — mesma
limitação já registrada no ADR 0004 para o template de Magic Link.

## Consequências
- Mecânica do formulário (3 passos, mensagens de erro, transição de estado)
  validada ponta a ponta — inclusive o caso de erro (token errado retorna
  "Código inválido ou expirado", mensagem traduzida corretamente).
- **Falta validar o caminho feliz completo** (código real de 6 dígitos)
  até o Pedro fazer o ajuste do template — ele mesmo pode testar depois.
- Mesmo padrão vale pra qualquer outro projeto do Pedro que use recuperação
  de senha do Supabase (anotado em
  `Claude-Memoria/Global/Infra-Cloud-Compartilhada.md`).
