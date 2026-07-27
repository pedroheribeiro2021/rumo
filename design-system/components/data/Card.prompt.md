Base surface for grouped content — trip summaries, forms, the settlement panel. Rounded 14px, 1px border, barely-there shadow (kept subtle for outdoor/sunlight legibility — the border does most of the separation work, not the shadow).

```jsx
<Card><h2>Membros</h2>…</Card>
<Card interactive onClick={() => nav(trip.id)}>{/* lifts 1px + shows shadow-sm on hover */}</Card>
<Card padding="sm">…</Card>
```
