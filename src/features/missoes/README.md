# Feature: missoes (Missões do dia)

3 missões por dia, tiradas de um catálogo de 6 (textos do protótipo). Cada uma
vale **12 moedas**, creditadas uma única vez por dia.

- `missions.ts` — catálogo e regras puras. As missões do dia saem de uma rotação
  fixa pela data (`missionsForDay`): previsível, igual para todos, **sem sorte**.
  O dia vira à meia-noite no horário do aparelho (`dayKey`).
- `useMissionsStore.ts` — o que foi concluído hoje, salvo no aparelho (AsyncStorage),
  para não dar moedas duas vezes ao reabrir o app.
- `useDailyMissions.ts` — junta tudo: missões de hoje, progresso e `complete(id)`,
  que credita as moedas via `useGameStore.earnCoins`. Troca as missões sozinho à
  meia-noite e quando o app volta do segundo plano.
- `MissionsScreen.tsx` — a tela (rota `app/missoes.tsx`).
- `components/MissionsShortcut.tsx` — botão da tela inicial com o progresso do dia.
