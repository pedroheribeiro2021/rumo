# Brief para o Claude Design — montar o design system do Rumo

> Objetivo: gerar o **design system** (tokens + componentes-base), **não** telas soltas. Ponto de partida limpo: aponte só para este repo.

## O que levar
1. Plano pago (Pro/Max/Team/Enterprise) com "Design" ativo no menu do claude.ai.
2. O prompt de abertura abaixo.
3. Aponte o Claude Design para **este repo** (ele lê o codebase). Sem herdar identidade de outros apps por ora.

## Prompt de abertura (copiar e colar)
Estou construindo o **design system** do **Rumo**, um app para **planejar e gerenciar viagens** (roteiro, orçamento, documentos/checklist, monitor de passagens e, como uma das funcionalidades, controle de gastos multi-moeda com divisão e acerto de contas). É gestão de viagem completa — gastos é *uma* parte, não o produto todo.

Contexto técnico:
- **Vite + React 19 + TypeScript + Tailwind v4** (CSS-first). Uso mobile-first/PWA.
- Uso majoritário no celular, às vezes sob sol: alto contraste, alvos de toque grandes, ação primária ao alcance do polegar.
- Comece limpo, sem herdar de outros projetos.

Personalidade (ajuste comigo): **prático, calmo, confiável, com um toque de viagem/aconchego**.

Entregue um **design system** com: (1) tokens — paleta (primária, acento, semânticas sucesso/alerta/erro, neutros), escala tipográfica, espaçamento, raios, sombra, tema claro **e** escuro; (2) componentes-base — botão (variações + estados), input, seletor de moeda, linha de lista, card, abas, chips de status, bottom nav, ação primária flutuante, bottom-sheet/modal, avatares, barra de progresso; (3) estados vazio/carregando/erro/offline; (4) acessibilidade AA. Comece pelos tokens e 2 direções de paleta; mostre um plano curto antes de gerar.

## Onde plugar a saída (IMPORTANTE — Tailwind v4)
O projeto usa **Tailwind v4 CSS-first**: não existe `tailwind.config.ts`. Os tokens entram como **`@theme`** dentro de **`web/src/index.css`**, logo após `@import "tailwindcss";`. Exemplo do formato esperado:

```css
@import "tailwindcss";

@theme {
  --color-brand: #0B6B5B;
  --color-accent: #E8A13A;
  --color-success: #178A53;
  --radius-xl: 14px;
  /* ...tipografia, espaçamento, etc. */
}
```

Peça ao Claude Design o export **nesse formato `@theme`** (e não em config JS), mais os componentes como React + classes Tailwind, para colar em `web/src/components/`.

## Direção inicial sugerida (o Design refina)
Primária teal ~#0B6B5B · acento âmbar ~#E8A13A · sucesso #178A53 · alerta #C9761A · erro #C0392B · sans neutra (ex.: Inter) com números tabulares · cantos 12–14px.
