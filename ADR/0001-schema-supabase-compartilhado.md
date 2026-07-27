# ADR 0001 — Reaproveitar projeto Supabase existente com prefixo `rumo_`

**Data:** 2026-07-27
**Status:** Aceita

## Contexto
O Pedro tem múltiplos apps rodando em poucos projetos Supabase (por exemplo,
o projeto `rachaconta` já hospeda duas aplicações diferentes no mesmo schema
`public`, uma delas usando prefixo `fi_`). Ele autorizou escolher livremente
onde rodar o `supabase/schema.sql` do Rumo, com a única restrição de que os
bancos de dados dos apps não podem interferir entre si.

## Decisão
- Rodar o schema do Rumo no projeto **rachaconta** (`grsqjzrgngpyckcfkxon`),
  em vez de criar um projeto novo.
- Prefixar **todas** as tabelas e a função helper com `rumo_`
  (`rumo_trips`, `rumo_expenses`, `rumo_is_trip_member`, etc.), seguindo o
  mesmo padrão de isolamento por nome já usado pelo app de pelada (`fi_`).
- Não usar um schema Postgres dedicado (`create schema rumo`), pois isso
  exigiria expor o schema na Data API do Supabase (configuração manual no
  dashboard) sem benefício real dado que o prefixo já resolve a colisão de
  nomes.

## Consequências
- Nenhuma tabela do Rumo colide com as tabelas existentes (`rooms`,
  `participants`, `items`, `fi_*`) nem com as do outro projeto
  (`zerosheet-judotracker`).
- Os tipos TypeScript gerados (`web/src/lib/database.types.ts`) incluem as
  tabelas de todos os apps do projeto — é esperado e não é para editar à mão;
  regenerar via `mcp__claude_ai_Supabase__generate_typescript_types` após
  qualquer mudança em `supabase/schema.sql`.
- Se o Rumo crescer muito ou precisar de isolamento mais forte (ex.: cotas de
  billing separadas), migrar para projeto próprio é uma opção futura — os
  nomes prefixados facilitam extrair as tabelas depois.
