# Rumo ✈️

**Planeje e gerencie viagens sem depender de planilha.** O Rumo junta, num só lugar, o que hoje fica espalhado em abas de spreadsheet: roteiro dia a dia, orçamento, **controle de gastos durante a viagem** (rápido, multi-moeda, com divisão entre pessoas) e um **monitor de preços de passagens** com histórico.

Feito para ser reutilizável — várias viagens, várias pessoas.

## Por que existe
Controlar gastos de viagem em planilha é chato: digitação lenta, câmbio na mão, "quem pagou o quê" vira bagunça. O Rumo resolve isso com lançamento em 3 toques, conversão automática de moeda e acerto de contas automático no fim.

## Módulos
1. **Viagens** — crie e gerencie várias viagens (datas, destinos, viajantes, moeda base).
2. **Roteiro** — plano dia a dia, por cidade/país, com anotações.
3. **Orçamento** — estimativa por categoria antes de viajar.
4. **Gastos (o coração)** — lançamento rápido durante a viagem: valor, categoria, moeda, quem pagou e divisão. Total corrido vs. orçamento, saldo por pessoa ("quem deve a quem").
5. **Monitor de passagens** — vigia rotas/datas, define alvo (ex.: ~30k milhas ≈ R$ 700/pessoa) e guarda o histórico de preços num gráfico.
6. **Relatórios** — totais por categoria, por pessoa e por dia; exportação.

## Stack
- **Frontend:** React + Vite + TypeScript + Tailwind (PWA — instala no celular, funciona offline p/ lançar gastos).
- **Backend:** Supabase (Postgres + Auth + Row Level Security + Edge Functions).
- **Monitor de preços:** Edge Function agendada (pg_cron) — ver `docs/architecture.md` sobre a estratégia de coleta de tarifas.
- **Deploy:** Vercel.

## Começar
```bash
# 1. instalar deps (após o app React ser scaffoldado — ver CLAUDE.md)
npm install
cp .env.example .env   # preencha as chaves do Supabase
npm run dev

# 2. banco de dados
#   crie um projeto no Supabase e rode supabase/schema.sql no SQL editor
```

Enquanto o app React não é montado, abra `prototype/index.html` no navegador — é a semente funcional (monitor + roteiro + orçamento + calculadora de milhas) da viagem Foz+Argentina+Paraguai.

## Roadmap
Veja `docs/roadmap.md`. Próximo passo é o MVP: Viagens + Gastos + acerto de contas.

## Licença
MIT.
