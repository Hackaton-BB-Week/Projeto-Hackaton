# Supabase

## Schema
Rode `schema.sql` no SQL Editor do seu projeto Supabase (cria tabelas + RLS).
Depois rode `help.sql` (aba Ajuda: catálogo `help_channels` e `breathing_sessions`).
Pode rodar `help.sql` de novo sem estragar nada.

## Edge Function do chat (Rô)

> ⚠️ **Obrigatório antes de apresentar.** Sem a função publicada, o chat só
> funciona no PC de quem roda `npm run chat:dev`.

As chaves ficam em `supabase/functions/.env` (ignorado pelo git; **nunca commitar**):

```
LLM_API_KEY=...      # Gemini, obrigatória (aistudio.google.com)
LLM_API_KEY_2=...    # reserva, outro projeto do Google (opcional)
LLM_API_KEY_3=...    # reserva, outro projeto do Google (opcional)
```

Publicar:
```bash
supabase login
supabase link --project-ref SEU-PROJETO
supabase secrets set --env-file supabase/functions/.env
supabase functions deploy chat --no-verify-jwt
```

A URL pública (`https://SEU-PROJETO.supabase.co/functions/v1/chat`) vai em
`EXPO_PUBLIC_CHAT_FUNCTION_URL` no `.env` do app e na Vercel.

Rodar no PC sem Supabase: `npm run chat:dev` (precisa do Deno).
Detalhes: [`docs/CHAT.md`](../docs/CHAT.md).
