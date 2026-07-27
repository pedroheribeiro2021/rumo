function TripsScreen({ trips, onOpen }) {
  const { Button, Card, ListRow, EmptyState } = window.RumoDesignSystem_15b2c0;
  const [showForm, setShowForm] = React.useState(false);
  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--text-h1)', color: 'var(--color-text-primary)' }}>Suas viagens</h1>
        <Button size="md" onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancelar' : '+ Nova viagem'}</Button>
      </div>

      {showForm && (
        <Card style={{ marginTop: 16 }}>
          <p style={{ margin: '0 0 10px', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>Formulário de exemplo — nome, destino, datas e moeda base.</p>
          <Button fullWidth onClick={() => setShowForm(false)}>Criar viagem</Button>
        </Card>
      )}

      <div style={{ marginTop: 20 }}>
        {trips.length === 0 ? (
          <EmptyState icon="🧭" title="Nenhuma viagem ainda" message="Crie a primeira acima." />
        ) : (
          <Card padding="sm">
            {trips.map((t, i) => (
              <ListRow
                key={t.id}
                title={t.name}
                subtitle={`${t.destination} · ${t.dates} · ${t.baseCurrency}`}
                trailing="›"
                onClick={() => onOpen(t)}
                divider={i < trips.length - 1}
              />
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
window.TripsScreen = TripsScreen;
