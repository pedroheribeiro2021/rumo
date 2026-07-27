-- Rumo — schema inicial (Postgres / Supabase)
-- Rode no SQL Editor do Supabase. RLS habilitado: usuário só vê viagens onde é membro.

create extension if not exists "pgcrypto";

-- Perfis (1:1 com auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz default now()
);

-- Viagens
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references profiles(id) on delete cascade,
  name text not null,
  destination text,
  start_date date,
  end_date date,
  base_currency text not null default 'BRL',
  created_at timestamptz default now()
);

-- Membros da viagem (viajantes)
create table if not exists trip_members (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  display_name text not null,           -- permite membro sem conta
  email text,
  role text not null default 'member',  -- 'owner' | 'member'
  unique (trip_id, display_name)
);

-- Roteiro dia a dia
create table if not exists itinerary_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  day_date date,
  base_city text,                       -- ex.: "Foz do Iguaçu"
  country text,                         -- ex.: "Brasil"
  title text,
  notes text,
  sort_order int default 0
);

-- Orçamento planejado (pré-viagem)
create table if not exists budget_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  category text not null,               -- passagens, hospedagem, alimentação...
  planned_amount numeric(12,2) not null default 0,
  currency text not null default 'BRL'
);

-- Gastos reais (durante a viagem) — o coração do app
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  spent_on date not null default current_date,
  description text,
  category text,                        -- alimentação, transporte, passeio...
  amount numeric(12,2) not null,        -- valor na moeda original
  currency text not null default 'BRL',
  fx_to_base numeric(14,6) not null default 1, -- taxa p/ moeda base da viagem no momento
  paid_by uuid references trip_members(id) on delete set null,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- Divisão de cada gasto entre membros
create table if not exists expense_splits (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references expenses(id) on delete cascade,
  member_id uuid not null references trip_members(id) on delete cascade,
  share numeric(12,2) not null,         -- parte devida por este membro (moeda base)
  unique (expense_id, member_id)
);

-- Monitor de passagens
create table if not exists price_watches (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  origin text not null,                 -- ex.: BSB
  destination text not null,            -- ex.: IGU
  depart_date date,
  return_date date,
  target_price numeric(12,2),           -- alvo em moeda
  currency text not null default 'BRL',
  notes text,
  created_at timestamptz default now()
);

create table if not exists price_observations (
  id uuid primary key default gen_random_uuid(),
  watch_id uuid not null references price_watches(id) on delete cascade,
  observed_at date not null default current_date,
  price numeric(12,2) not null,
  source text,                          -- Google Voos, Momondo...
  note text
);

-- ---------- RLS ----------
alter table trips enable row level security;
alter table trip_members enable row level security;
alter table itinerary_days enable row level security;
alter table budget_items enable row level security;
alter table expenses enable row level security;
alter table expense_splits enable row level security;
alter table price_watches enable row level security;
alter table price_observations enable row level security;

-- Helper: viagens em que o usuário é membro
create or replace function is_trip_member(t uuid) returns boolean
language sql security definer stable as $$
  select exists(
    select 1 from trip_members m
    where m.trip_id = t and m.profile_id = auth.uid()
  ) or exists(
    select 1 from trips tr where tr.id = t and tr.owner = auth.uid()
  );
$$;

create policy "membros leem/escrevem trip" on trips
  for all using (owner = auth.uid() or is_trip_member(id)) with check (owner = auth.uid() or is_trip_member(id));

-- Mesmo padrão para tabelas-filhas (via trip_id)
create policy "membros: itinerary" on itinerary_days for all using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));
create policy "membros: budget"    on budget_items  for all using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));
create policy "membros: expenses"  on expenses      for all using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));
create policy "membros: members"   on trip_members  for all using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));
create policy "membros: watches"   on price_watches for all using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));
create policy "membros: splits"    on expense_splits for all using (
  exists(select 1 from expenses e where e.id = expense_id and is_trip_member(e.trip_id))
) with check (
  exists(select 1 from expenses e where e.id = expense_id and is_trip_member(e.trip_id))
);
create policy "membros: observations" on price_observations for all using (
  exists(select 1 from price_watches w where w.id = watch_id and is_trip_member(w.trip_id))
) with check (
  exists(select 1 from price_watches w where w.id = watch_id and is_trip_member(w.trip_id))
);
