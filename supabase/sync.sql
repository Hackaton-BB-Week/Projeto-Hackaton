-- Progresso do app salvo na nuvem: uma linha por store do Zustand (rqr-game, rqr-plant…).
-- Cada aparelho entra com login anônimo; RLS liga cada linha ao seu dono.
-- Pode rodar de novo sem estragar nada.

create table if not exists app_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  store text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, store)
);

alter table app_state enable row level security;

drop policy if exists "own app state" on app_state;
create policy "own app state" on app_state for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
