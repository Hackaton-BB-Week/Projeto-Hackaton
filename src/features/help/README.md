# Feature: help (aba Ajuda)

Tela de ajuda: conversar com a Rô, respiração guiada e canais oficiais
(CVV 188, CAPS, Jogadores Anônimos). Sempre reforça que o app é apoio complementar.

## Arquivos
- `HelpScreen.tsx` — a tela (rota `app/(tabs)/ajuda.tsx`).
- `channels.ts` — lista **embutida** dos canais. É a reserva offline: a tela nunca fica vazia.
- `useHelpChannels.ts` — hooks: canais (TanStack Query), copiar/ligar, registrar respiração.
- `breathing.ts` — regras puras do exercício (fases 4-4-6, cronômetro em reducer, formatação).
- `useBreathingTimer.ts` — cronômetro regressivo (pausar mantém o tempo; reiniciar volta à duração).
- `components/BreathingSheet.tsx` — modal da respiração (orbe parado com "reduzir animações").
- `components/ChannelItem.tsx` — um canal; com telefone mostra "Ligar" e "Copiar".

## Dados (Supabase, opcional)
`supabase/help.sql` cria:
- `help_channels` — catálogo público (só leitura pelo app). Permite corrigir textos sem nova versão.
- `breathing_sessions` — exercícios concluídos por usuário (RLS). Sem login, nada é gravado.

Sem Supabase configurado, tudo funciona com a lista embutida.

## Regras
- Só canais públicos e verificados. Não invente números nem serviços.
- Se mudar um canal, mude em `channels.ts` **e** em `supabase/help.sql`.
