# Feature: onboarding

Boas-vindas, login local (nome + e-mail, sem auth real — ver `docs/MVP.md`),
pesquisa inicial e "ponto de partida". Visual e textos seguem o protótipo
(`#obWelcome`, `#obSurvey`, `#obProfile`).

Fluxo: `app/index.tsx` (lê o login salvo) → `/onboarding` → `/onboarding/pesquisa`
→ `/onboarding/ponto-de-partida` → `/(tabs)`. Quem já fez o login vai direto às abas.

- Telas: `WelcomeScreen`, `SurveyScreen`, `StartingPointScreen`. Componentes em `components/`.
- Ações: `useOnboarding.ts` (identidade, concluir, demonstração).
- Dados: perguntas em `questions.ts`; cálculo do resultado em `profile.ts` (puro).
- Estado: respostas em andamento em `useSurveyStore.ts` (memória); resultado final
  em `src/store/useUserStore.ts`, salvo no aparelho (AsyncStorage). O gasto semanal
  também vai para `useGameStore`, que gera as moedas.
- Sair / refazer: `useUserStore.getState().logout()` volta o app para as boas-vindas.
