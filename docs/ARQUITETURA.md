# Arquitetura

Feature-based / modular. Sem DDD e sem MVC clássico — escopo pequeno, 3 dias.

## Camadas
`UI (app/, components) → hooks (src/hooks, src/features/*) → services (src/services) → Supabase`

- Telas não falam direto com o Supabase; passam por hooks e services.
- `src/store` guarda estado global e as **regras da economia** (puras, testáveis).
- Alias `@/*` → `src/*`.

## Pastas
- `app/` rotas (Expo Router).
- `src/features/<nome>/` lógica e componentes de cada feature.
- `src/services/` `supabase.ts` (client) e `ai.ts` (chama a Edge Function).
- `src/store/` `useGameStore.ts` (zustand) — moedas, multiplicador, vila.
- `src/lib/` helpers (`format.ts`).
- `src/theme/` tokens (`tokens.ts`).

## Dados (Supabase)
Tabelas: `profiles`, `survey_answers`, `game_state`, `village_tasks`. Toda tabela
com **RLS** restringindo cada linha ao seu `user_id`. Ver `supabase/schema.sql`.
