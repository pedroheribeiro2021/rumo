# ADR 0005 — Convite de membro por e-mail (multi-usuário real)

**Data:** 2026-07-27
**Status:** Aceita

## Contexto
O Pedro perguntou se dois usuários reais (ex.: ele + namorada) conseguem
compartilhar e co-gerenciar a mesma viagem, cada um com login próprio. O
modelo de dados (`rumo_trip_members.profile_id` + RLS via
`rumo_is_trip_member`) já foi desenhado pra isso desde o ADR inicial, mas
não existia nenhum fluxo pra realmente vincular a conta de um segundo
usuário a uma viagem — "Adicionar membro" só criava um nome (pra divisão de
gasto), sem ligar a `profile_id` de ninguém.

## Decisão
Adicionar convite por e-mail com vínculo automático em dois momentos:

1. **Na hora do convite** (`rumo_invite_trip_member`, função `SECURITY
   DEFINER`): se o e-mail já tem conta, vincula `profile_id` na hora. Precisa
   ser `SECURITY DEFINER` porque `rumo_profiles` tem RLS restrita a
   `id = auth.uid()` — um membro não consegue, por padrão, buscar o perfil de
   outro usuário por e-mail.
2. **No cadastro** (`rumo_handle_new_user`, já existia — só adicionei uma
   linha): quando um usuário novo se registra, a trigger vincula
   automaticamente qualquer `trip_members` com esse e-mail e `profile_id`
   ainda nulo (convite pendente).

Sem envio de e-mail transacional de convite (não construído) — a UI só
mostra "convite pendente" e o dono avisa a pessoa por fora (WhatsApp etc.)
pra criar conta com aquele e-mail.

`TripDetailPage`: campo de e-mail opcional ao lado do nome; `StatusChip`
mostra "conta vinculada" (verde) ou "convite pendente" (âmbar) por membro.

## Consequências
- **Validado ponta a ponta**: criei um convite pendente, criei a conta de
  teste com o mesmo e-mail, confirmei o vínculo automático via SQL, logei
  com a conta nova e confirmei acesso completo à viagem do Pedro (gastos,
  membros, total, acerto de contas) — sem nenhum código extra além do que
  já existia via RLS.
- Enumeração de e-mail: a função revela (pro chamador, que já precisa ser
  membro da viagem) se um e-mail tem conta ou não, via o campo `profile_id`
  retornado. Aceitável pro perfil de risco do app (pessoal, não é alvo de
  phishing de alto valor) — mesmo trade-off comum em qualquer "convidar por
  e-mail" de SaaS.
- Convite por e-mail sem conta ainda **não notifica ninguém automaticamente**
  — é responsabilidade do dono avisar a pessoa fora do app. Enviar e-mail de
  convite de verdade ficaria pra depois (precisaria de Edge Function/serviço
  de e-mail transacional).
- Segue o padrão de hardening do ADR 0002 (`set search_path`, `revoke
  execute from public`, grant explícito só pra `authenticated`).
