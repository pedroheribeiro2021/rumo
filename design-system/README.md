# Rumo — Design System

Rumo é um app (PWA mobile-first) para **planejar e gerenciar viagens**: roteiro dia a dia, orçamento, documentos/checklist, controle de gastos durante a viagem (multi-moeda, com divisão entre pessoas e acerto de contas automático) e um monitor de preços de passagens. **Gastos é o módulo mais crítico, não o produto inteiro** — o app cobre a viagem de ponta a ponta: planeja antes, controla durante, fecha as contas depois.

Uso majoritário: celular, muitas vezes em movimento e sob sol forte — daí o foco em alto contraste, alvos de toque grandes (mín. 44px) e a ação primária sempre ao alcance do polegar (FAB / botão fixo no rodapé).

**Stack real do produto:** Vite + React 19 + TypeScript + Tailwind v4 (CSS-first, tokens via `@theme`), Supabase (Postgres + Auth + RLS), deploy na Vercel. Ver `docs/architecture.md` e `CLAUDE.md` no repositório de origem.

## Fontes usadas para construir este sistema
- **Codebase Rumo** (pasta local anexada `rumo/`): `README.md`, `CLAUDE.md`, `docs/PRD.md`, `docs/architecture.md`, `docs/roadmap.md`, `docs/design-system-brief.md`, `prototype/index.html` (protótipo funcional single-file — monitor de preços, roteiro, orçamento, calculadora de milhas), e o app React real em `web/src/` (`pages/LoginPage.tsx`, `TripsPage.tsx`, `TripDetailPage.tsx`, `ExpensesPage.tsx`, `components/AppLayout.tsx`, hooks, `supabase/schema.sql`).
- **GitHub:** [pedroheribeiro2021/rumo](https://github.com/pedroheribeiro2021/rumo) — mesmo conteúdo do repositório, espelhado. Explore lá para o código-fonte completo e histórico de commits; é a melhor forma de continuar evoluindo este design system com fidelidade ao produto real.
- Não havia Figma nem logo/marca desenhada anexados. O app tem um `favicon.svg` de placeholder (roxo/violeta, estilo genérico de scaffold) que **não corresponde** à direção de marca pedida (teal/âmbar) nem é mencionado em nenhum documento do produto — por isso foi **descartado** como marca oficial. Ver "Iconografia & marca" abaixo.

## Como este sistema nasceu
O app React ainda implementa só o essencial (Login, Viagens, Detalhe da viagem, Gastos + acerto de contas). Roteiro, Orçamento e Monitor de preços existem hoje só no `prototype/index.html` (citado no `CLAUDE.md` como "semente de UX/regras"). Este design system cobre **os dois**: os componentes/telas já codados foram recriados fielmente (mesmos textos, mesma estrutura); Roteiro/Orçamento/Monitor foram re-estilizados com os tokens e componentes novos a partir do protótipo, já que ainda não existem como código React de produção — trate essas 3 telas como direção visual, não como recriação pixel-a-pixel de UI existente.

## Índice
- `styles.css` — ponto de entrada único; importa tudo em `tokens/`.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `fonts.css`, `base.css`.
- `components/forms/` — Button, Input, CurrencySelect.
- `components/data/` — Card, ListRow, Avatar.
- `components/navigation/` — Tabs, BottomNav, Fab.
- `components/feedback/` — StatusChip, ProgressBar, Modal, EmptyState, LoadingState, ErrorState, OfflineBanner.
- `ui_kits/rumo-app/` — recriação clicável do app: Login, Viagens, Detalhe da viagem, Gastos (+ acerto de contas), Roteiro, Orçamento, Monitor de preços.
- `guidelines/` — specimen cards de cor, tipografia, espaçamento, elevação, marca e motion (aba Design System).
- `SKILL.md` — versão portátil para uso no Claude Code.

## Componentes — inventário completo
Nenhuma biblioteca de componentes/Figma foi anexada; o inventário abaixo foi definido a partir do brief do produto (`docs/design-system-brief.md`), que já enumera exatamente estes primitivos — nada foi adicionado alem disso.

**Forms:** Button (primary/secondary/ghost/danger, loading, disabled), Input (label/error/helper/prefix), CurrencySelect.
**Data:** Card, ListRow, Avatar (iniciais, cor determinística).
**Navigation:** Tabs (pill), BottomNav (fixo, safe-area), Fab (ação primária flutuante).
**Feedback:** StatusChip, ProgressBar, Modal (bottom-sheet), EmptyState, LoadingState, ErrorState, OfflineBanner.

### Intentional additions
Nenhuma — os 16 componentes acima são exatamente os primitivos listados no brief do produto (`botão, input, seletor de moeda, linha de lista, card, abas, chips de status, bottom nav, FAB, modal/bottom-sheet, avatares, barra de progresso` + os 4 estados vazio/carregando/erro/offline).

## Tema claro & escuro
Todos os tokens semânticos (`--color-bg`, `--color-surface`, `--color-text-primary`, `--color-brand`, etc.) têm um valor light (`:root`) e um override em `[data-theme="dark"]`. Aplique `data-theme="dark"` no elemento raiz (`<html>` ou `<body>`) para ativar o escuro — não há classe `.dark` separada.

## Handoff para o Claude Code / Tailwind v4
O app usa **Tailwind v4 CSS-first**: não existe `tailwind.config.ts`. Os tokens abaixo já são CSS custom properties — para o app real, importe `styles.css` (ou copie os arquivos de `tokens/`) e, se preferir os tokens também como utilitários Tailwind, mapeie-os dentro de `web/src/index.css`:

```css
@import "tailwindcss";
@import "./tokens/colors.css"; /* copiado deste design system */
@import "./tokens/typography.css";
@import "./tokens/spacing.css";
@import "./tokens/elevation.css";
@import "./tokens/fonts.css";

@theme {
  --color-brand: var(--color-primary-600);
  --color-accent: var(--color-accent-500);
  --radius-xl: var(--radius-lg); /* 14px */
  --font-sans: var(--font-sans);
}
```

Os componentes em `components/` usam apenas CSS custom properties inline (sem classes Tailwind) para funcionar neste ambiente de design system; ao portar para o repo real, é direto reescrevê-los com classes Tailwind que referenciam os mesmos tokens (`bg-[var(--color-brand)]` ou, melhor, tokens do `@theme` acima).

## Conteúdo — fundamentos
**Idioma:** pt-BR em 100% da UI e da documentação de produto. Trate qualquer expansão como pt-BR-first.
**Tom:** direto e funcional, nunca robótico nem "cute". Frases curtas, verbos no imperativo/infinitivo para ações ("Criar viagem", "Adicionar", "Ver gastos", "Registrar"). Sem gírias corporativas ("sinergia", "empoderar").
**Você vs. tu:** trato neutro, sem pronome explícito na maioria das ações ("Excluir", "Cancelar", "Adicionar") — quando precisa de pronome, usa "seu/sua" ("Entre com seu e-mail"), nunca 1ª pessoa do produto ("nosso app").
**Números e dinheiro:** sempre formatados como moeda pt-BR (`Intl.NumberFormat('pt-BR', {style:'currency', currency})`), nunca hardcoded. Percentuais e datas em formato brasileiro (DD/MM).
**Confirmações destrutivas:** explícitas e específicas — `Excluir a viagem "${trip.name}"? Essa ação não pode ser desfeita.` — nunca um "Tem certeza?" genérico.
**Estados vazios/de carregamento:** curtos e sem humor forçado — "Nenhuma viagem ainda. Crie a primeira acima.", "Carregando…", "Tudo certo — ninguém deve nada."
**Emoji:** usado no protótipo original como ícone de aba (💸🗺️📊✈️) — mantido como recurso pontual de wayfinding em telas mobile densas, nunca em botões de ação ou mensagens de erro/confirmação.
**Vibe geral:** prático > bonito; confiável > divertido; um traço de aconchego de viagem (tom morno dos neutros, âmbar de acento) sem virar "app de férias" fofo.

## Fundamentos visuais
**Cor:** primária teal `#0B6B5B` (ação, marca, links) sobre acento âmbar `#E8A13A` (destaques pontuais — nunca em botões primários, reservado para alvos de preço/realce). Semânticas dedicadas para sucesso/alerta/erro/info — nunca reaproveitar a primária para "sucesso". Neutros com leve viés quente (não são cinza-azulado/slate) para reforçar o "aconchego" sem parecer café-com-leite. Máximo de 1–2 cores de fundo por tela (bg + surface).
**Tipografia:** família única, Inter, para tudo (UI e números) — sem serifada, sem fonte de display separada. Números monetários sempre com `tabular-nums` para alinhar em colunas. Escala pensada para leitura no sol: nada abaixo de 11px, corpo padrão 14–16px.
**Espaçamento:** grade de 4px. Cards com padding 16px (md); listas com linhas de 44px+ de altura mínima.
**Fundos:** sólidos, sem gradientes, sem texturas/padrões repetidos, sem ilustrações hand-drawn — o produto não tem imagens de marca. Superfícies diferenciadas por leve contraste (`--color-bg` vs `--color-surface`), não por sombra pesada.
**Sombra/elevação:** deliberadamente sutil (`--shadow-xs/sm`) — o app é usado sob luz de sol, então bordas de 1px fazem mais trabalho de separação visual do que sombra. Sombra maior reservada para bottom-sheet/FAB (`--shadow-lg`/`--shadow-fab`), que precisam parecer "flutuantes" de propósito.
**Cantos:** raio médio 12–14px em cards/inputs/botões; pill (`--radius-full`) em chips, abas e no seletor de moeda.
**Cards:** superfície `--color-surface`, borda 1px `--color-border`, raio 14px, sombra quase imperceptível. Sem borda colorida lateral.
**Animação:** funcional e rápida (120–320ms, easing padrão suave) — fade/slide-up de bottom-sheet, shimmer de loading, sem bounce/elastic, sem confetti.
**Hover (desktop, quando aplicável):** escurece levemente (primary-600→700) ou preenche com `--color-brand-subtle`; nunca opacidade genérica.
**Pressed:** `scale(.98)` nos botões — feedback tátil sutil, não cor diferente.
**Transparência/blur:** só no overlay de modal (`--color-overlay`, sem blur — o app não usa glassmorphism).
**Ação primária:** sempre ao alcance do polegar — FAB flutuante inferior-direito ou botão full-width no rodapé de formulários, nunca no topo da tela.

## Iconografia & marca
**Sem logo real anexado.** O único asset gráfico do repositório é `web/public/favicon.svg`, um ícone abstrato roxo/violeta gerado por alguma ferramenta de scaffold — cores e forma não têm relação com a direção de marca do produto (teal/âmbar) e não é citado em nenhum documento como identidade oficial. **Não foi usado.** Onde uma marca apareceria, este sistema usa o nome "Rumo" em tipografia simples (peso 800, cor primária) — ver card "Wordmark" em Brand.
**Ícones:** o código React de produção não usa nenhuma biblioteca de ícones (nenhuma dependência tipo lucide/heroicons no `package.json`); o único precedente é emoji usado como ícone de aba no protótipo (💸🗺️📊✈️🧭💰⚙️). Este sistema segue esse precedente para navegação (BottomNav, Tabs) em vez de inventar um conjunto de SVGs. **Sugestão para produção:** adotar [Lucide](https://lucide.dev) (stroke 1.5–2px, cantos levemente arredondados) como substituto vetorial equivalente ao estilo simples/utilitário do emoji atual — nenhum SVG próprio foi desenhado aqui.

## Acessibilidade
- Contraste AA verificado nas combinações texto/fundo padrão (texto primário neutro-900 sobre superfícies claras; branco sobre primary-600/700).
- Alvo de toque mínimo 44px (`--tap-min`) em todo elemento interativo (botões, linhas de lista, itens de bottom nav).
- Foco visível: anel de 3px (`--focus-ring`) em todo elemento focável via teclado — nunca `outline: none` sem substituto.
- Estados vazio/carregando/erro/offline como componentes de primeira classe, não afterthought.

## Fontes / substituições
Nenhum arquivo de fonte foi encontrado no repositório (`web/src/index.css` só declara `system-ui` como fallback). Usamos **Inter** — a mesma fonte já sugerida no brief do produto (`docs/design-system-brief.md`) — carregada via `@font-face` apontando para o CDN da Fontsource (`tokens/fonts.css`). Isso não é uma substituição por falta de arquivo local; é a fonte que o próprio time já queria. Se preferir hospedar os `.woff2` localmente, baixe em https://fontsource.org/fonts/inter e troque as `url()` em `tokens/fonts.css`.

## Caveats / peça ajuda
- **Confirme a paleta.** Segui a direção sugerida no brief (teal `#0B6B5B` + âmbar `#E8A13A`) com uma escala de neutros levemente quente para reforçar "aconchego" — se preferir uma 2ª direção (ex.: teal mais escuro/mais azulado, ou um acento coral em vez de âmbar), eu gero uma variante lado a lado.
- **Sem Figma/logo:** se houver uma marca real ou arquivos de ícone em algum lugar não anexado, mande — hoje o "logo" é só o nome em texto.
- **Roteiro/Orçamento/Monitor de preços não existem como código React** ainda; as telas aqui são a melhor tradução do protótipo para os novos tokens, não uma recriação de UI de produção — revise com atenção quando esses módulos forem implementados de fato.
- Ícones são emoji (seguindo o precedente do protótipo) — troque por Lucide (ou outro set) quando quiser algo mais "de produto".
