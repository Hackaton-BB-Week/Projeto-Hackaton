# Supabase

## Schema
Rode `schema.sql` no SQL Editor do seu projeto Supabase (cria tabelas + RLS).

## Edge Function do chat
```bash
supabase functions deploy chat
supabase secrets set LLM_API_KEY=sua-chave   # nunca commitar a chave
```
A URL pública vai em `EXPO_PUBLIC_CHAT_FUNCTION_URL` no `.env` do app.
