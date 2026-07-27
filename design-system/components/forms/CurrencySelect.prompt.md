Pill-shaped currency dropdown — pairs with the amount `Input` on the expense form when a spend was made in a foreign currency (multi-currency is core to Rumo).

```jsx
<CurrencySelect label="Moeda" value={currency} onChange={e => setCurrency(e.target.value)} currencies={['BRL','USD','EUR','ARS','PYG']} />
```

Default currency list matches the Southern-Cone trips Rumo is built around (BRL/USD/EUR/ARS/PYG) — pass a custom `currencies` array for other routes.
