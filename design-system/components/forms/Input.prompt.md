Labeled text field for forms — amount entry, trip name, dates. Use `size="lg"` + `prefix` for the primary money-amount field (biggest touch target, biggest number).

```jsx
<Input label="Valor" prefix="R$" size="lg" type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} />
<Input label="Nome da viagem" required value={name} onChange={e => setName(e.target.value)} />
<Input label="E-mail" type="email" error="E-mail inválido" value={email} onChange={...} />
```

`error` turns the border/helper red; `helper` shows neutral hint text when there's no error. `prefix` renders a fixed label (currency symbol) inside the field, left-aligned.
