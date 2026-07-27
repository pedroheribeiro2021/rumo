Fixed bottom tab bar, top-level nav for the app shell (Viagens / Gastos / Roteiro / Ajustes). Respects the safe-area inset on notched phones.

```jsx
<BottomNav items={[{value:'trips',label:'Viagens',icon:'🧭'},{value:'expenses',label:'Gastos',icon:'💰'}]} value={tab} onChange={setTab} />
```

Icon slot accepts any node — swap the placeholder glyphs for real icon-font/SVG icons once picked (see readme Iconography section).
