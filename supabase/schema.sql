-- Rolê que Rende — schema inicial. RLS liga cada linha ao seu dono.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz default now()
);

create table if not exists survey_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  answers jsonb not null,
  weekly_spend numeric not null default 0,
  created_at timestamptz default now()
);

create table if not exists game_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  streak int not null default 1,
  total_days int not null default 1,
  relapses int not null default 0,
  coins int not null default 0,
  updated_at timestamptz default now()
);

create table if not exists village_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  task text not null,       -- roof | walls | frontGarden | tree | bench
  style int not null default 0,
  created_at timestamptz default now(),
  unique (user_id, task)
);

-- RLS
alter table profiles        enable row level security;
alter table survey_answers  enable row level security;
alter table game_state      enable row level security;
alter table village_tasks   enable row level security;

create policy "own profile"  on profiles       for all using (auth.uid() = id)      with check (auth.uid() = id);
create policy "own survey"   on survey_answers for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own state"    on game_state     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own village"  on village_tasks  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
