# ADR 0009 — Unificação de Ideias+Logística em "Planejamento" + Checklist

**Data:** 2026-07-29
**Status:** Aceita e implementada

## Contexto
O Pedro pediu uma seção de "planejamento" parecida com a aba Ideias (ADR
0007), dando como exemplo concreto: "opções de hotéis/airbnbs cidade XX,
onde o usuário cadastraria as opções viáveis e afins — e isso aconteceria
com outros itens". Junto, ele anexou a planilha que usou pra planejar a
última viagem (Cartagena/San Andrés), pedindo pra eu usar como referência
antes de implementar.

A planilha tinha 7 abas. A maioria já está bem coberta pelo Rumo (orçamento
planejado x real, acerto de contas, controle de gastos multi-moeda,
passagens). Duas coisas chamaram atenção:
- **PasseiosRestaurantes** e **Hospedagem**: as duas seguem o mesmo padrão —
  lista de opções pesquisadas por cidade, com preço, local, link e
  observação, pra comparar antes de decidir. É exatamente o mesmo conceito
  que já tínhamos em duas tabelas separadas (`rumo_itinerary_ideas` e
  `rumo_logistics_entries`), só que sem preço nem cidade em nenhuma das duas.
- **Checklist**: lista simples de itens pra levar/fazer — não existia nada
  parecido no app.

Antes de implementar, propus ao Pedro unificar os dois módulos e ele
confirmou (junto com a navbar e o checklist) via pergunta estruturada.

## Decisões

**1. `rumo_itinerary_ideas` + `rumo_logistics_entries` → uma tabela só,
`rumo_planning_options`.** Colunas novas em relação às duas tabelas antigas:
`city` (pesquisa geralmente acontece por cidade, antes de saber o dia exato),
`price`/`currency` (não existia em `itinerary_ideas`), `date_from`/`date_to`
(generaliza o `check_in`/`check_out` de `logistics_entries` pra qualquer
segmento — data de passeio, data de voo, etc.). `segment` substitui
`idea_type`/`entry_type` com um conjunto maior: `hospedagem`, `transporte`,
`restaurante`, `atividade`, `praia`, `outro`. Migração de dados das duas
tabelas antigas pra essa (nenhuma linha existia ainda em produção — só
Foz do Iguaçu populada, sem ideias/logística cadastradas), depois `drop
table` das duas.

**2. "Promover" generalizado, com exclusividade só onde faz sentido.** A
versão antiga tinha um caso especial (`idea_type='day_plan'`) pra "escolher
um entre alternativas do mesmo dia descarta as outras". Generalizar isso
pra "mesmo dia + mesmo segmento sempre descarta os irmãos" criaria uma
regressão: 3 atividades candidatas pro mesmo dia normalmente **não** são
alternativas mutuamente exclusivas (dá pra fazer museu de manhã E parque à
tarde), diferente de hospedagem (não faz sentido "escolher" 2 hotéis pra
mesma cidade). Solução adotada: exclusividade por **cidade** (não por dia) e
só pros segmentos `hospedagem`/`transporte` — promover uma opção desses dois
segmentos descarta as candidatas concorrentes da mesma cidade; promover
`restaurante`/`atividade`/`praia`/`outro` só marca como escolhida, sem
descartar nada. Se a opção promovida tiver `day_id` vinculado, o
comportamento antigo se mantém: escreve `title`/`notes` no dia do roteiro.
Como bônus, "Promover" deixou de exigir `day_id` (antes só habilitava se
houvesse um dia vinculado) — faz sentido escolher um hotel sem estar restrito
a um dia específico do roteiro.

**3. Navbar: "Logística" vira "Planejamento".** Mesma posição na bottom nav
(5 abas), rota muda de `/logistica` pra `/planejamento`. A sub-aba "Ideias"
que vivia dentro de Roteiro foi removida — o conteúdo agora mora inteiro em
Planejamento (com filtro por segmento, incluindo `atividade`/`restaurante`/
`praia`, que cobrem o que Ideias fazia).

**4. Checklist — tabela nova e simples, sem categorização.**
`rumo_checklist_items` (`title`, `done` boolean, `sort_order`). Acesso via
link na tela Viagem (junto de Passagens/Câmbio), não ganhou aba própria na
navbar — é uma lista simples de marcar item, não precisa de destaque igual
aos outros módulos.

**5. Lógica de agrupamento por cidade extraída e testada.** `groupByCity`
(novo, `web/src/lib/planning.ts`) segue o padrão estabelecido na ADR 0008 —
agrupa preservando ordem de aparição, com "Sem cidade definida" sempre por
último. Testado (4 casos).

## O que ficou de fora, deliberadamente
- **Divisão do dia do roteiro em períodos (Manhã/Almoço/Tarde/Noite)** — a
  planilha usa isso na aba Roteiro, mas `rumo_itinerary_days` ainda só tem um
  `title`/`notes` por dia. Promover mais de uma opção com o mesmo `day_id`
  sobrescreve o conteúdo anterior do dia (ex.: promover uma atividade de
  manhã e depois um restaurante pro almoço do mesmo dia apaga o texto da
  atividade). Sinalizei isso ao Pedro como melhoria de fase 2 antes de
  implementar — ele optou por deixar pra depois. Se isso incomodar no uso
  real, é a próxima coisa a revisitar.

## Consequências
- `npm run lint`, `npm run test` (24/24, 4 novos testes de `groupByCity`) e
  `npm run build` (env vars placeholder) rodados localmente.
- `get_advisors` (security) sem lacunas novas nas duas tabelas novas.
- Nenhuma perda de dados na migração (tabelas antigas estavam vazias em
  produção).
- Trabalho feito em branch (`feat/planejamento-unificado-e-checklist`), não
  direto em `main` — primeira aplicação da convenção estabelecida no mesmo
  dia (ver `CLAUDE.md`, seção "Fluxo de trabalho").
