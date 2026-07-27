function money(v, c) { try { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: c }).format(v); } catch { return `${c} ${v.toFixed(2)}`; } }

function ExpensesScreen({ trip, expenses, onBack }) {
  const { Button, Card, ListRow, Modal, Input, CurrencySelect, Fab } = window.RumoDesignSystem_15b2c0;
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [currency, setCurrency] = React.useState(trip.baseCurrency);
  const CATEGORIES = ['alimentação', 'transporte', 'hospedagem', 'passeio', 'compras', 'outros'];
  const [category, setCategory] = React.useState('outros');

  const total = expenses.reduce((s, e) => s + e.amountBase, 0);
  const transfers = [{ from: 'Pedro', to: 'Ana', amount: 220 }];

  return (
    <div style={{ padding: '20px 16px 110px', position: 'relative' }}>
      <a onClick={onBack} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>← {trip.name}</a>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 6 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 'var(--text-h1)' }}>Gastos</h1>
          <p style={{ margin: '4px 0 0', fontSize: 'var(--text-body)' }}>Total: <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{money(total, trip.baseCurrency)}</strong></p>
        </div>
      </div>

      <Card padding="sm" style={{ marginTop: 16 }}>
        {expenses.map((e, i) => (
          <ListRow
            key={e.id}
            title={`${e.description} · ${e.category}`}
            subtitle={`${e.date} · pago por ${e.paidBy}`}
            trailing={money(e.amount, e.currency)}
            trailingSub={e.currency !== trip.baseCurrency ? `≈ ${money(e.amountBase, trip.baseCurrency)}` : undefined}
            divider={i < expenses.length - 1}
          />
        ))}
      </Card>

      <Card style={{ marginTop: 20 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--text-h3)' }}>Acerto de contas</h2>
        <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', fontSize: 'var(--text-body)' }}>
          {transfers.map((t, i) => (
            <li key={i} style={{ marginBottom: 4 }}><strong>{t.from}</strong> deve <strong>{money(t.amount, trip.baseCurrency)}</strong> para <strong>{t.to}</strong></li>
          ))}
        </ul>
      </Card>

      <Fab icon="+" label="Novo gasto" onClick={() => setOpen(true)} offsetBottom={24} />

      <Modal open={open} onClose={() => setOpen(false)} title="Novo gasto" footer={<Button fullWidth size="lg" onClick={() => setOpen(false)}>Salvar gasto</Button>}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input label="Valor" prefix="R$" size="lg" type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ flex: 1 }} />
          <CurrencySelect label="Moeda" value={currency} onChange={(e) => setCurrency(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} style={{
              borderRadius: 'var(--radius-full)', border: 'none', padding: '6px 12px', fontSize: 12, fontWeight: 600,
              background: category === c ? 'var(--color-brand)' : 'var(--color-surface-sunken)', color: category === c ? '#fff' : 'var(--color-text-secondary)', cursor: 'pointer',
            }}>{c}</button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
window.ExpensesScreen = ExpensesScreen;
