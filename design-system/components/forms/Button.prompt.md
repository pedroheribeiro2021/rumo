Primary action button — use for the one thumb-reachable CTA per screen; secondary/ghost for lower-emphasis actions; danger for destructive confirms.

```jsx
<Button variant="primary" size="lg" fullWidth onClick={save}>Salvar gasto</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost" size="md">+ mais opções</Button>
<Button variant="danger">Excluir viagem</Button>
<Button loading>Salvando…</Button>
```

Variants: `primary` (solid teal, main CTA), `secondary` (outlined teal), `ghost` (text-only, low emphasis), `danger` (solid error red). Sizes: `md` (44px, default) and `lg` (52px, use for the single most important action on a screen — e.g. "Salvar gasto"). `loading` disables and shows a spinner + "Carregando…"; `disabled` dims to neutral. `fullWidth` stretches to the container — common in forms and bottom-sheets.
