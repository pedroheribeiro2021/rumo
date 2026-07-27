function BudgetScreen({ onBack }) {
  const { Card, ProgressBar } = window.RumoDesignSystem_15b2c0;
  const ITEMS = [
    { label: 'Passagens', planned: 1600, spent: 1520 },
    { label: 'Trechos internos/regionais', planned: 400, spent: 230 },
    { label: 'Experiências/ingressos', planned: 1400, spent: 610 },
    { label: 'Hospedagem + alimentação + transporte', planned: 5600, spent: 4980 },
  ];
  const money = (v) => 'R$ ' + v.toLocaleString('pt-BR');
  const totalPlanned = ITEMS.reduce((s, i) => s + i.planned, 0);
  const totalSpent = ITEMS.reduce((s, i) => s + i.spent, 0);
  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <a onClick={onBack} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>← Viagem</a>
      <h1 style={{ margin: '6px 0 16px', fontSize: 'var(--text-h1)' }}>Orçamento</h1>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <Card style={{ flex: 1 }}><p style={{ margin: 0, fontSize: 'var(--text-money)', fontWeight: 700 }}>{money(totalSpent)}</p><p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>gasto até agora</p></Card>
        <Card style={{ flex: 1 }}><p style={{ margin: 0, fontSize: 'var(--text-money)', fontWeight: 700 }}>{money(totalPlanned)}</p><p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>planejado (casal)</p></Card>
      </div>
      <Card>
        {ITEMS.map((it, i) => (
          <div key={it.label} style={{ marginBottom: i < ITEMS.length - 1 ? 16 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-body-sm)', marginBottom: 6 }}>
              <span>{it.label}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-secondary)' }}>{money(it.spent)} / {money(it.planned)}</span>
            </div>
            <ProgressBar value={it.spent} max={it.planned} tone={it.spent > it.planned ? 'bad' : it.spent > it.planned * 0.85 ? 'warn' : 'brand'} />
          </div>
        ))}
      </Card>
    </div>
  );
}
window.BudgetScreen = BudgetScreen;
