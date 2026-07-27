function PriceMonitorScreen({ onBack }) {
  const { Card, StatusChip } = window.RumoDesignSystem_15b2c0;
  const LEGS = [
    { rt: 'BSB → IGU', dt: 'ida · 30–31/10', pr: 520, tone: 'good', tag: 'no alvo' },
    { rt: 'BUE → BSB', dt: 'volta · ~09–11/11', pr: 900, tone: 'bad', tag: 'acima' },
    { rt: 'IGR → BUE', dt: 'regional · ~04/11', pr: 230, tone: 'good', tag: 'no alvo' },
  ];
  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <a onClick={onBack} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>← Viagem</a>
      <h1 style={{ margin: '6px 0 4px', fontSize: 'var(--text-h1)' }}>Monitor de preços</h1>
      <p style={{ margin: '0 0 16px', color: 'var(--color-text-secondary)', fontSize: 'var(--text-body-sm)' }}>Alvo: ≤ R$ 700/pessoa · ida+volta trechos BR</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {LEGS.map((l) => (
          <Card key={l.rt} padding="sm">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-body)' }}>{l.rt}</p>
                <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{l.dt}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-money)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>R$ {l.pr}</p>
                <div style={{ marginTop: 4 }}><StatusChip tone={l.tone}>{l.tag}</StatusChip></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
window.PriceMonitorScreen = PriceMonitorScreen;
