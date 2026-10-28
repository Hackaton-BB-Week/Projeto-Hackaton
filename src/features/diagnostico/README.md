# Feature: diagnostico ("Refazer diagnóstico")

6 perguntas do protótipo e um novo "ponto de partida". Rota `app/diagnostico.tsx`,
aberta pelo menu ☰.

- `diagnosis.ts` — perguntas e regras puras (`buildDiagnosis`):
  - gatilho principal + recomendações do protótipo;
  - recomendações extras pelos outros sinais (recuperar perdas, dificuldade de parar,
    promoções), sem repetir o gatilho;
  - comparação com a estimativa semanal e o gatilho de antes;
  - sinais fortes (aposta quase todo dia, muita dificuldade de parar ou quase sempre
    tenta recuperar) → cartão sugerindo apoio gratuito (CAPS, Jogadores Anônimos);
  - um botão que leva à ferramenta que combina com o gatilho.
- Ao concluir, atualiza `weeklySpend` e `trigger` em `useUserStore.updateDiagnosis`
  (o gasto semanal também vai para a economia: moedas por dia).
- Sempre: "referência para reflexão, não diagnóstico clínico".
