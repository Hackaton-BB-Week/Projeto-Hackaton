# Feature: chat (Rô)

Chat de apoio, sem julgamento. Nunca promete resultados nem substitui tratamento.
**Guia completo (como funciona, como rodar, checklist da apresentação): [`docs/CHAT.md`](../../../docs/CHAT.md).**

- `ChatScreen.tsx` — tela (a rota `app/(tabs)/chat.tsx` só reexporta). Mostra a
  faixa "Sem internet" e o "Rô está escrevendo… / Aguardando a internet…".
- `useChat.ts` — estado das mensagens (só na memória; fechou o app, some),
  espera a internet voltar, "Tentar de novo" quando a IA falha.
- `crisis.ts` — detecta sinais de crise **no app, antes da IA** e mostra o
  `CrisisCard` (CVV 188 / SAMU 192), mesmo se a IA falhar. Também guarda o
  `HELP_NOTICE`, o aviso fixo que abre a 1ª resposta.
- `localReplies.ts` — respostas automáticas sem IA (sem conexão ou IA não
  configurada). Sempre aparecem marcadas como "resposta automática".
- `components/MessageBubble.tsx` — bolha com links tocáveis, aviso offline e botão de tentar de novo.
- IA real: `src/services/ai.ts` → Edge Function `supabase/functions/chat`
  (personalidade da Rô em `prompt.ts`).
