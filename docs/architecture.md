# Arquitetura

## Camadas
- **Frontend** React+Vite+TS+Tailwind, PWA. `@supabase/supabase-js` + `react-query`.
- **Supabase**: Auth (magic link), Postgres (schema em `supabase/schema.sql`), RLS por membro da viagem, Edge Functions.
- **Deploy**: Vercel (frontend). Variáveis via `.env` (ver `.env.example`).

## Multi-moeda
Cada gasto guarda `amount` + `currency` + `fx_to_base` (taxa no momento do lançamento). Total da viagem = soma de `amount * fx_to_base`. Nunca recalcular taxas antigas. Buscar câmbio via API pública (exchangerate.host) e cachear por dia.

## Acerto de contas ("quem deve a quem")
1. Para cada membro: pago (soma de expenses.paid_by) − devido (soma de expense_splits.share).
2. Saldos positivos recebem, negativos pagam.
3. Minimizar transferências: casar maior credor com maior devedor iterativamente.

## Monitor de preços — estratégia de coleta (importante e honesto)
- **Milhas (Smiles/LATAM Pass/Azul) não são scrapáveis** de forma confiável (login + antibot). Não tentar.
- **Tarifa em dinheiro:** Edge Function agendada (pg_cron/pg_net) consulta busca web ou uma API de voos e grava em `price_observations`. APIs de voo boas são pagas; para v1, alimentar via a tarefa agendada do assistente (busca web) ou entrada manual.
- **Rede de segurança gratuita e robusta:** instruir o usuário a ativar o **rastreamento nativo do Google Voos** (e-mail automático quando o preço cai). O app foca em **histórico + alvo + decisão** (dinheiro vs. milhas), não em ser um scraper.

## Offline (PWA)
Gastos lançados offline vão para uma fila local (IndexedDB) e sincronizam quando volta a conexão.
