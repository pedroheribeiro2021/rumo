function LoginScreen({ onLogin }) {
  const { Button, Input } = window.RumoDesignSystem_15b2c0;
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  return (
    <div style={{ display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--color-bg)' }}>
      <div style={{ width: '100%', maxWidth: 360, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 32, boxShadow: 'var(--shadow-md)' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--text-h1)', color: 'var(--color-primary-700)', fontWeight: 800 }}>Rumo</h1>
        <p style={{ marginTop: 6, color: 'var(--color-text-secondary)', fontSize: 'var(--text-body)' }}>Entre com seu e-mail para receber um link de acesso.</p>
        {sent ? (
          <div style={{ marginTop: 24, background: 'var(--color-success-subtle)', color: 'var(--color-success-strong)', borderRadius: 'var(--radius-md)', padding: 12, fontSize: 'var(--text-body-sm)' }}>
            Link enviado para <strong>{email || 'voce@email.com'}</strong>. Confira sua caixa de entrada.
          </div>
        ) : (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input placeholder="voce@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
            <Button fullWidth size="lg" onClick={() => { setSent(true); setTimeout(onLogin, 900); }}>Enviar link mágico</Button>
          </div>
        )}
      </div>
    </div>
  );
}
window.LoginScreen = LoginScreen;
