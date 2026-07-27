# ADR 0002 — RLS em `rumo_profiles` + auto-provisioning + hardening de funções

**Data:** 2026-07-27
**Status:** Aceita

## Contexto
O `supabase/schema.sql` original (semente do KICKOFF) tinha duas lacunas:
1. A tabela `profiles` nunca tinha RLS habilitado (só as tabelas com `trip_id`
   tinham policy). Como a tabela guarda e-mail do usuário, isso permitiria
   qualquer usuário autenticado ler/editar o perfil de qualquer outro.
2. Não existia nada que criasse a linha em `profiles` quando um usuário se
   cadastra — mas `trips.owner` referencia `profiles(id)`, então criar uma
   viagem falharia por FK para todo usuário novo.

Além disso, o Supabase Advisor (`get_advisors`, tipo `security`) apontou, após
aplicar o schema:
- `rumo_is_trip_member` com `search_path` mutável (risco de search_path
  hijacking).
- `rumo_handle_new_user` e `rumo_is_trip_member`, ambas `SECURITY DEFINER`,
  chamáveis diretamente via RPC pública (`/rest/v1/rpc/...`) por `anon` e
  `authenticated`, sem necessidade.
- Policies RLS criadas sem restringir a role (`for all` sem `to authenticated`),
  aplicando-se também a `anon`/`public`.

## Decisão
- Habilitar RLS em `rumo_profiles` com policy "cada um vê/edita só o próprio
  perfil" (`id = auth.uid()`).
- Adicionar trigger `rumo_on_auth_user_created` em `auth.users` que popula
  `rumo_profiles` automaticamente via `rumo_handle_new_user()`.
- Fixar `search_path = public` em `rumo_is_trip_member`.
- `revoke execute ... from public` nas duas funções SECURITY DEFINER, com
  `grant execute on rumo_is_trip_member to authenticated` (é a única role que
  precisa, pois é usada dentro das próprias policies).
- Todas as policies restritas com `to authenticated`.

## Consequências
- `supabase/schema.sql` já reflete o estado final (inclui os fixes — não é
  preciso rodar uma segunda migration ao recriar o banco do zero).
- Qualquer nova função `SECURITY DEFINER` adicionada no futuro (ex.: para o
  monitor de passagens) deve seguir o mesmo padrão: `set search_path`,
  `revoke ... from public`, grant explícito só pra quem precisa.
- Rodar `get_advisors` (tipo `security`) depois de qualquer alteração de
  schema é prática recomendada — pego pelo menos 3 classes de problema reais
  nesta sessão.
