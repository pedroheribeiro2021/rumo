# ADR 0004 — Trocar magic link por e-mail + senha

**Data:** 2026-07-27
**Status:** Aceita

## Contexto
Ver ADR 0003: o magic link estava sendo consumido por um scanner de
segurança do Gmail/Google antes de qualquer clique real, tornando o login
não confiável — tanto nos testes quanto potencialmente para usuários reais.

A alternativa mais óbvia (OTP de 6 dígitos por e-mail) ainda depende de um
e-mail chegar e do usuário digitar o código, e exigiria editar o template de
e-mail "Magic Link" no dashboard do Supabase (trocar `{{ .ConfirmationURL }}`
por `{{ .Token }}`) — uma configuração que não é editável via SQL/migration
nem pelas ferramentas MCP disponíveis, só pelo dashboard manualmente.

## Decisão
Trocar para **e-mail + senha** (`supabase.auth.signUp` /
`supabase.auth.signInWithPassword`). Motivo principal: **o login do dia a dia
para de depender de e-mail inteiramente** — só o cadastro inicial envia um
e-mail de confirmação (e mesmo esse, se for "clicado" pelo scanner do Gmail,
apenas confirma a conta como efeito colateral, sem prejudicar o usuário: ele
volta pro app e entra com a senha normalmente, sem precisar clicar em nada).

`LoginPage.tsx` agora tem duas ações (alternância "Entrar" / "Criar conta")
em vez do formulário único de e-mail. `AuthContext` não precisou mudar — a
correção anterior (depender só de `onAuthStateChange`, não de `getSession()`)
continua válida e inclusive fica menos crítica, já que login por senha não
envolve processar hash/código da URL.

## Consequências
- Nenhuma mudança necessária no dashboard do Supabase nem no schema.
- Perda de conveniência do "sem senha pra lembrar" do magic link — aceitável
  dado que o problema anterior tornava o login **não funcional**, não só
  menos conveniente.
- **Recuperação de senha não foi implementada** (ficaria pendente para depois
  — `supabase.auth.resetPasswordForEmail` tem o mesmo problema de link
  clicável, então precisaria da mesma reflexão se/quando for implementada).
- Se o Pedro preferir reintroduzir passwordless no futuro, o caminho é OTP de
  6 dígitos com o template de e-mail ajustado manualmente no dashboard (não
  magic link).
