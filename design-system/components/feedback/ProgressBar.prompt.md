Budget-vs-actual bar. Switch `tone` to `warn`/`bad` as spend approaches or passes the planned amount.

```jsx
<ProgressBar value={spent} max={planned} tone={spent > planned ? 'bad' : spent > planned*0.8 ? 'warn' : 'brand'} />
```
