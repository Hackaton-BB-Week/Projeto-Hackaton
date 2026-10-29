# Feature: prejogo (Modo pré-jogo)

Para o momento em que bate a vontade de apostar: 4 perguntas (textos do protótipo)
e um plano personalizado. Rota `app/pre-jogo.tsx`; atalho na tela inicial.

- `preJogo.ts` — perguntas e regras puras do resultado (`buildResult`, `rankActions`).
  O texto muda conforme o gatilho, o que a pessoa espera da aposta, a estratégia e
  como ela se sente; usa também o gatilho e o objetivo da pesquisa inicial.
- Para onde leva (botões, por relevância):
  - "Ainda está difícil" → cartão do **CVV 188** no topo + canais de ajuda e Rô primeiro.
  - Ansiedade, "aliviar a tensão" ou pausa → **respiração guiada** (`/ajuda?respirar=1`
    abre o exercício direto na aba Ajuda).
  - Missão ou atividade → Missões. Falar com alguém → Rô.
  - Recuperar perdas ou "dinheiro rápido" → painel financeiro.
  - O caminho para a ajuda profissional sempre aparece.
- `usePreJogo.ts` — o fluxo (avançar, voltar, refazer) e a recompensa.
- `usePreJogoStore.ts` — +15 moedas **uma vez por dia** ao concluir (salvo no aparelho).
