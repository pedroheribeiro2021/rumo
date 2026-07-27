function ItineraryScreen({ onBack }) {
  const { Card } = window.RumoDesignSystem_15b2c0;
  const DAYS = [
    ['1–2', 'Foz do Iguaçu', 'Chegada; Cataratas lado BR + Parque das Aves'],
    ['3', 'Foz (bate-volta)', 'Ciudad del Este: Itaipu, Saltos del Monday, compras'],
    ['4–5', 'Puerto Iguazú', 'Cataratas lado AR (Garganta del Diablo); Hito 3 Fronteiras'],
    ['6', 'IGR → Buenos Aires', 'Voo ~1h30; tarde livre San Telmo/Puerto Madero'],
    ['7–9', 'Buenos Aires', 'Recoleta, Palermo, tango, gastronomia'],
  ];
  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <a onClick={onBack} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>← Viagem</a>
      <h1 style={{ margin: '6px 0 16px', fontSize: 'var(--text-h1)' }}>Roteiro</h1>
      <Card>
        {DAYS.map(([d, place, note], i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < DAYS.length - 1 ? '1px dashed var(--color-border)' : 'none' }}>
            <div style={{ minWidth: 46, fontWeight: 700, color: 'var(--color-primary-600)', fontSize: 'var(--text-body-sm)' }}>{d}</div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-body)' }}>{place}</p>
              <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{note}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
window.ItineraryScreen = ItineraryScreen;
