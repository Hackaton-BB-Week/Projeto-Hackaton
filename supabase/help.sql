-- Rolê que Rende — aba Ajuda. Rode depois de schema.sql (pode rodar mais de uma vez).

-- Canais oficiais de apoio. Catálogo público: qualquer um lê, ninguém escreve pelo app
-- (edite pelo painel do Supabase). O app tem a mesma lista embutida como reserva,
-- em src/features/help/channels.ts — mantenha as duas iguais.
create table if not exists help_channels (
  id          text primary key,
  name        text not null,
  description text not null,
  icon        text not null default 'users' check (icon in ('phone', 'hospital', 'users')),
  tone        text not null default 'brand' check (tone in ('danger', 'green', 'brand')),
  phone       text check (phone ~ '^[0-9]+$'),
  sort_order  int  not null default 0,
  active      boolean not null default true,
  updated_at  timestamptz not null default now()
);

alter table help_channels enable row level security;

drop policy if exists "help channels are public" on help_channels;
create policy "help channels are public" on help_channels
  for select to anon, authenticated using (active);

-- Só informação pública e verificada. Não invente números ou serviços.
insert into help_channels (id, name, description, icon, tone, phone, sort_order) values
  ('cvv', 'CVV — Centro de Valorização da Vida',
   'Apoio emocional e prevenção do suicídio, 24h, por telefone, chat ou e-mail.',
   'phone', 'danger', '188', 1),
  ('caps', 'CAPS — Atenção Psicossocial',
   'Serviços públicos e gratuitos de saúde mental do SUS. Procure a unidade mais próxima pelo posto de saúde da sua região.',
   'hospital', 'green', null, 2),
  ('jogadores-anonimos', 'Jogadores Anônimos',
   'Grupos de apoio mútuo e gratuitos, presenciais e online, para quem quer parar de apostar.',
   'users', 'brand', null, 3)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  tone = excluded.tone,
  phone = excluded.phone,
  sort_order = excluded.sort_order,
  updated_at = now();

-- Exercícios de respiração concluídos (para missões/estatísticas futuras).
-- Cada usuário só vê e cria os próprios registros.
create table if not exists breathing_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  duration_seconds int  not null check (duration_seconds between 1 and 3600),
  completed_at     timestamptz not null default now()
);

create index if not exists breathing_sessions_user_idx
  on breathing_sessions (user_id, completed_at desc);

alter table breathing_sessions enable row level security;

drop policy if exists "own breathing select" on breathing_sessions;
drop policy if exists "own breathing insert" on breathing_sessions;
create policy "own breathing select" on breathing_sessions
  for select to authenticated using (auth.uid() = user_id);
create policy "own breathing insert" on breathing_sessions
  for insert to authenticated with check (auth.uid() = user_id);
