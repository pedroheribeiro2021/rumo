---
name: rumo-design
description: Use this skill to generate well-branded interfaces and assets for Rumo, a travel-planning and expense-management PWA, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, tokens, and UI kit components for prototyping.
user-invocable: true
---

The design system assets live in `design-system/` at the repo root (not alongside this file) — read `design-system/README.md` first, then explore `design-system/tokens/`, `design-system/components/` and `design-system/ui_kits/`.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, the real integration already lives in `web/src/styles/tokens/` and `web/src/components/ui/` — prefer reusing those over re-porting from `design-system/`.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key facts: mobile-first PWA (Vite + React + TypeScript + Tailwind v4, CSS-first tokens via `@theme`); primary teal `#0B6B5B`, accent amber `#E8A13A`; Inter everywhere with tabular numerals for money; pt-BR copy, practical/calm/trustworthy tone; 44px minimum touch targets; primary action always thumb-reachable (FAB or full-width bottom button); no real logo — brand mark is the wordmark "Rumo" in Inter 800.
