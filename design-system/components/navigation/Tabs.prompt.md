Horizontal pill tabs for switching sections within a trip (Roteiro/Orçamento/Gastos/Monitor). Scrolls horizontally if it overflows — never wraps.

```jsx
<Tabs items={[{value:'monitor',label:'Monitor'},{value:'roteiro',label:'Roteiro'}]} value={tab} onChange={setTab} />
```
