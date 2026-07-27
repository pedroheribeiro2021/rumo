Bottom-sheet pattern (slides up from the bottom, rounded top corners, drag-handle) — used for the "+ Gasto" form and destructive confirmations so the primary action stays in thumb reach.

```jsx
<Modal open={open} onClose={close} title="Novo gasto" footer={<Button fullWidth>Salvar</Button>}>
  <Input label="Valor" prefix="R$" size="lg" />
</Modal>
```
