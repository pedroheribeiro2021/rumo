function TripDetailScreen({ trip, onOpenExpenses, onBack }) {
  const { Button, Card, ListRow, Avatar, Input } = window.RumoDesignSystem_15b2c0;
  const [name, setName] = React.useState('');
  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <a onClick={onBack} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>← Viagens</a>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 'var(--text-h1)' }}>{trip.name}</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-secondary)', fontSize: 'var(--text-body-sm)' }}>{trip.destination} · {trip.dates} · moeda base {trip.baseCurrency}</p>
        </div>
        <Button onClick={onOpenExpenses}>Ver gastos</Button>
      </div>

      <Card style={{ marginTop: 24 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--text-h3)' }}>Membros</h2>
        <div style={{ marginTop: 10 }}>
          {trip.members.map((m, i) => (
            <ListRow key={m} leading={<Avatar name={m} size="sm" />} title={m} subtitle={i === 0 ? 'dono' : undefined} divider={i < trip.members.length - 1} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Input placeholder="Nome do viajante" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1 }} />
          <Button variant="secondary" onClick={() => setName('')}>Adicionar</Button>
        </div>
        <p style={{ marginTop: 8, fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Membros sem conta (só nome) já podem participar da divisão de gastos.</p>
      </Card>
    </div>
  );
}
window.TripDetailScreen = TripDetailScreen;
