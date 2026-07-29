# ADR 0007 — Navbar, orçamento flexível, divisão opcional e 2 módulos novos (Ideias de roteiro, Logística)

**Data:** 2026-07-29
**Status:** Aceita e implementada

## Contexto
Usando o Rumo no dia a dia pra planejar a viagem real (Foz do Iguaçu), o Pedro
bateu em 9 limitações de uma vez: navegação em fileira de botões (não parece
"app"), categorias de orçamento fixas demais, divisão de gasto sempre
obrigatória (atrapalha o uso principal — acompanhar gasto x orçamento sem se
preocupar com acerto de contas), orçamento só por categoria (não por dia),
falta de calculadora de câmbio, viagens/roteiro só criam/excluem (nunca
editam), e faltavam dois módulos inteiros: "ideias de roteiro" (planos A/B/C
antes de fechar o roteiro de verdade) e um cadastro de referência de
hospedagens/aeroportos. Um décimo pedido (upload de capa da viagem) foi
marcado como prioridade mínima.

Antes de implementar, esclarecemos 3 pontos com o Pedro:
- "App como base de dados pra futuras viagens" — **já coberto** pelo
  histórico de viagens existente, sem trabalho novo.
- Categorias de orçamento: **por viagem**, não um catálogo global entre
  viagens do usuário.
- Hospedagens/aeroportos: **só dado de referência pra consulta** — sem
  vínculo ativo/relacional com roteiro ou ideias.

## Decisões

**1. Navbar (bottom nav) com 5 abas.** `web/src/components/ui/BottomNav.tsx`
já existia no design system mas nunca tinha sido usado. Criamos
`AppBottomNav.tsx` como ponte entre esse componente controlado
(`value`/`onChange`) e o react-router (`useLocation`/`useNavigate`/`useParams`),
renderizado globalmente em `AppLayout.tsx` (só aparece quando há `tripId` na
rota). Pra não lotar a navbar com os 2 módulos novos, ficou em 5 abas: Viagem,
Gastos, Orçamento, Roteiro (com Ideias como sub-aba interna), Logística.
Passagens e Câmbio viraram links secundários dentro da tela Viagem.

**2. Categorias de orçamento por viagem.** Nova tabela `rumo_budget_categories`
(`trip_id`, `name`, `unique(trip_id,name)`). Toda viagem nova é semeada com as
6 categorias padrão (`EXPENSE_CATEGORIES`, que passa a servir só de lista-
semente). Viagens antigas foram populadas via backfill (categorias já usadas
em `rumo_budget_items`/`rumo_expenses`, ou o padrão se nenhuma). `BudgetPage`
e `ExpensesPage` passam a ler dessa tabela em vez do array hardcoded —
mantém o cruzamento orçamento×gasto por string exata, agora por viagem.

**3. Divisão de gasto opcional, default "não dividir".** `splitMode` ganhou um
terceiro estado (`'none' | 'equal' | 'custom'`), default `'none'`.
`rumo_expense_splits` já permitia zero linhas por gasto (sem constraint) — só
faltava a aplicação não forçar isso. **Corrigido junto**: o cálculo de acerto
de contas em `ExpensesPage.tsx` pulava incorretamente para `paid`/`owed`
mesmo sem nenhum split, o que faria o pagador parecer credor do grupo sem
ninguém devendo de volta — gastos sem divisão agora são ignorados
inteiramente nesse cálculo (mas continuam contando no total gasto x
orçamento, que nunca dependeu de splits).

**4. Orçamento por dia, opcional e adicional.** `rumo_budget_items` ganhou
`day_date` nullable + `category` passou a ser nullable, com
`check (category is not null or day_date is not null)`. Um item pode ser só
por categoria (como antes), só por dia, ou os dois.

**5. Editar viagem e dia de roteiro.** `useUpdateTrip` já existia e nunca era
chamado — só faltava UI. Criamos `useUpdateItineraryDay` (não existia) e
formulários de edição (`Modal`) nas duas telas.

**6. Logística (hospedagens/aeroportos) — uma tabela, não duas.**
`rumo_logistics_entries` com discriminador `entry_type` ('accommodation' |
'airport'). Justificativa: os dois compartilham quase todos os campos (nome,
endereço, datas, preço, link, notas) e são só consulta passiva (confirmado
com o Pedro) — duas tabelas seria duplicar RLS/hook/página pra pouco ganho.

**7. Ideias de roteiro — tabela própria com fluxo de "promover".**
`rumo_itinerary_ideas` (`idea_type`: restaurant/poi/activity/day_plan,
`day_id` opcional com `on delete set null`, `status`: candidate/chosen/
discarded). "Plano A/B/C" não precisou de coluna extra: várias linhas
`idea_type='day_plan'` compartilhando o mesmo `day_id`. "Promover" (hook
`usePromoteIdea`) escreve `title`/`notes` da ideia no
`rumo_itinerary_days` correspondente (via `useUpdateItineraryDay` da decisão
5) e, só para `day_plan`, descarta as ideias-irmãs do mesmo dia — pra
restaurante/ponto turístico/atividade, promover uma não descarta as outras
(um dia pode ter várias atividades confirmadas).

**8. Upload de capa da viagem — bucket público, path não-adivinhável.**
Bucket novo `rumo-trip-covers` (`insert into storage.buckets`, já que não é
`create table`), path `{trip_id}/cover.{ext}`, política reaproveitando
`rumo_is_trip_member` via `storage.foldername(name)[1]::uuid`. Bucket
público (não assinado) porque é uma imagem de capa de baixa sensibilidade —
mais simples que gerenciar URLs assinadas, mas é uma exceção ao padrão
"RLS em tudo" do resto do app (a política ainda restringe *upload/update/
delete* a membros da viagem; a *leitura* do arquivo em si depende só de
conhecer a URL pública, não de autenticação).

## Consequências
- Todas as 8 fases foram implementadas nesta sessão, na ordem: edição de
  viagem/roteiro → divisão opcional → navbar → categorias+orçamento por dia →
  logística → ideias de roteiro → calculadora de câmbio → upload de capa.
- 4 migrações aplicadas (`rumo_budget_categories`+`day_date`,
  `rumo_logistics_entries`, `rumo_itinerary_ideas`, `cover_image_url`+bucket),
  mais um backfill de categorias pras viagens já existentes. `database.types.ts`
  regenerado após cada uma.
- `npm run build` e `tsc --noEmit` passam limpos ao final de todas as fases.
- Nenhuma tela de edição de **gasto** ou **item de orçamento** foi adicionada
  (só viagem e dia de roteiro) — continua em aberto, ver `Pendencias.md`.
- `get_advisors` (security) não apontou nenhuma lacuna de RLS nova — os
  avisos existentes (`auth_allow_anonymous_sign_ins`) já existiam em todas as
  tabelas antigas e são de configuração do projeto, não desta mudança.
