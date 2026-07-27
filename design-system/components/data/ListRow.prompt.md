The workhorse row for every list in Rumo: trips, expenses, members, transfers. Trailing value uses tabular numbers so amounts align in a stack.

```jsx
<ListRow title="Jantar churrascaria" subtitle="24/10 · pago por Ana" trailing="R$ 180,00" trailingSub="≈ US$ 33,50" onClick={openExpense} />
<ListRow leading={<Avatar name="Pedro" size="sm" />} title="Pedro" subtitle="dono" />
```

`divider` (default true) draws the 1px separator; set false for the last row in a group. Give it a hover tint automatically when `onClick` is set.
