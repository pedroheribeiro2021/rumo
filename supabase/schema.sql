-- Rumo — schema inicial (Postgres / Supabase)
-- Rode no SQL Editor do Supabase. RLS habilitado: usuário só vê viagens onde é membro.
--
-- Convenção: todas as tabelas usam o prefixo `rumo_` porque o projeto Supabase
-- é compartilhado com outros apps (schema `public` único) — evita colisão de nomes.

create extension if not exists "pgcrypto";

-- Perfis (1:1 com auth.users)
create table if not exists rumo_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz default now()
);

-- Viagens
create table if not exists rumo_trips (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references rumo_profiles(id) on delete cascade,
  name text not null,
  destination text,
  start_date date,
  end_date date,
  base_currency text not null default 'BRL',
  created_at timestamptz default now()
);

-- Membros da viagem (viajantes)
create table if not exists rumo_trip_members (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references rumo_trips(id) on delete cascade,
  profile_id uuid references rumo_profiles(id) on delete set null,
  display_name text not null,           -- permite membro sem conta
  email text,
  role text not null default 'member',  -- 'owner' | 'member'
  unique (trip_id, display_name)
);

-- Roteiro dia a dia
create table if not exists rumo_itinerary_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references rumo_trips(id) on delete cascade,
  day_date date,
  base_city text,                       -- ex.: "Foz do Iguaçu"
  country text,                         -- ex.: "Brasil"
  title text,
  notes text,
  sort_order int default 0
);

-- Orçamento planejado (pré-viagem)
create table if not exists rumo_budget_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references rumo_trips(id) on delete cascade,
  category text not null,               -- passagens, hospedagem, alimentação...
  planned_amount numeric(12,2) not null default 0,
  currency text not null default 'BRL'
);

-- Gastos reais (durante a viagem) — o coração do app
create table if not exists rumo_expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references rumo_trips(id) on delete cascade,
  spent_on date not null default current_date,
  description text,
  category text,                        -- alimentação, transporte, passeio...
  amount numeric(12,2) not null,        -- valor na moeda original
  currency text not null default 'BRL',
  fx_to_base numeric(14,6) not null default 1, -- taxa p/ moeda base da viagem no momento
  paid_by uuid references rumo_trip_members(id) on delete set null,
  created_by uuid references rumo_profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- Divisão de cada gasto entre membros
create table if not exists rumo_expense_splits (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references rumo_expenses(id) on delete cascade,
  member_id uuid not null references rumo_trip_members(id) on delete cascade,
  share numeric(12,2) not null,         -- parte devida por este membro (moeda base)
  unique (expense_id, member_id)
);

-- Monitor de passagens
create table if not exists rumo_price_watches (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references rumo_trips(id) on delete cascade,
  origin text not null,                 -- ex.: BSB
  destination text not null,            -- ex.: IGU
  depart_date date,
  return_date date,
  target_price numeric(12,2),           -- alvo em moeda
  currency text not null default 'BRL',
  notes text,
  created_at timestamptz default now()
);

create table if not exists rumo_price_observations (
  id uuid primary key default gen_random_uuid(),
  watch_id uuid not null references rumo_price_watches(id) on delete cascade,
  observed_at date not null default current_date,
  price numeric(12,2) not null,
  source text,                          -- Google Voos, Momondo...
  note text
);

-- Cria automaticamente a linha em rumo_profiles quando um usuário se registra
create or replace function rumo_handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into rumo_profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists rumo_on_auth_user_created on auth.users;
create trigger rumo_on_auth_user_created
  after insert on auth.users
  for each row execute function rumo_handle_new_user();

-- ---------- RLS ----------
alter table rumo_profiles enable row level security;
alter table rumo_trips enable row level security;
alter table rumo_trip_members enable row level security;
alter table rumo_itinerary_days enable row level security;
alter table rumo_budget_items enable row level security;
alter table rumo_expenses enable row level security;
alter table rumo_expense_splits enable row level security;
alter table rumo_price_watches enable row level security;
alter table rumo_price_observations enable row level security;

-- Helper: viagens em que o usuário é membro
create or replace function rumo_is_trip_member(t uuid) returns boolean
language sql security definer stable set search_path = public as $$
  select exists(
    select 1 from rumo_trip_members m
    where m.trip_id = t and m.profile_id = auth.uid()
  ) or exists(
    select 1 from rumo_trips tr where tr.id = t and tr.owner = auth.uid()
  );
$$;

-- Funções SECURITY DEFINER não devem ser chamáveis via RPC pública:
-- rumo_handle_new_user só roda via trigger; rumo_is_trip_member só é usada dentro de policies.
revoke execute on function rumo_handle_new_user() from public;
revoke execute on function rumo_is_trip_member(uuid) from public;
grant execute on function rumo_is_trip_member(uuid) to authenticated;

create policy "usuário vê/edita seu próprio perfil" on rumo_profiles
  for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "membros leem/escrevem trip" on rumo_trips
  for all to authenticated using (owner = auth.uid() or rumo_is_trip_member(id)) with check (owner = auth.uid() or rumo_is_trip_member(id));

-- Mesmo padrão para tabelas-filhas (via trip_id)
create policy "membros: itinerary" on rumo_itinerary_days for all to authenticated using (rumo_is_trip_member(trip_id)) with check (rumo_is_trip_member(trip_id));
create policy "membros: budget"    on rumo_budget_items  for all to authenticated using (rumo_is_trip_member(trip_id)) with check (rumo_is_trip_member(trip_id));
create policy "membros: expenses"  on rumo_expenses      for all to authenticated using (rumo_is_trip_member(trip_id)) with check (rumo_is_trip_member(trip_id));
create policy "membros: members"   on rumo_trip_members  for all to authenticated using (rumo_is_trip_member(trip_id)) with check (rumo_is_trip_member(trip_id));
create policy "membros: watches"   on rumo_price_watches for all to authenticated using (rumo_is_trip_member(trip_id)) with check (rumo_is_trip_member(trip_id));
create policy "membros: splits"    on rumo_expense_splits for all to authenticated using (
  exists(select 1 from rumo_expenses e where e.id = expense_id and rumo_is_trip_member(e.trip_id))
) with check (
  exists(select 1 from rumo_expenses e where e.id = expense_id and rumo_is_trip_member(e.trip_id))
);
create policy "membros: observations" on rumo_price_observations for all to authenticated using (
  exists(select 1 from rumo_price_watches w where w.id = watch_id and rumo_is_trip_member(w.trip_id))
) with check (
  exists(select 1 from rumo_price_watches w where w.id = watch_id and rumo_is_trip_member(w.trip_id))
);
