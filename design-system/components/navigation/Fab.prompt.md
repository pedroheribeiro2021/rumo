The single most important action on a screen with a bottom nav — almost always "+ Gasto" (add expense), which the product wants launchable in ~3 taps. `offsetBottom` defaults to sit just above a 56px BottomNav; set to 20 if there's no bottom nav on that screen.

```jsx
<Fab icon="+" label="Novo gasto" onClick={openExpenseForm} />
```
