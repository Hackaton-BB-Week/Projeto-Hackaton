# Gamificação — Vila que Rende

Jogo principal, no modelo "restauração com escolhas" (estilo Gardenscapes, sem o
match-3). Uma vila abandonada que o usuário reconstrói por partes.

## Economia
- **Dinheiro preservado → moedas:** cada R$ 1 que o usuário deixa de apostar = 1 moeda.
- **Ganho diário:** `arredondar( (gastoSemanal / 7) * multiplicador )`.
- **Multiplicador por sequência de dias:**

| Dias em sequência | Multiplicador |
|---|---|
| 0–2  | ×1   |
| 3–6  | ×1,2 |
| 7–13 | ×1,5 |
| 14–29| ×2   |
| 30+  | ×3   |

- **Missão diária:** bônus fixo de moedas.
- **Recaída:** zera a sequência (multiplicador volta a ×1) mas **mantém moedas e
  construções**; o céu da vila fica cinza até o próximo dia. Nunca destrói progresso.

A regra da economia vive em `src/store/useGameStore.ts` (funções puras
`multiplierForStreak` e `dailyCoinGain`).

## Obras (MVP)
Zona **Casa**: telhado, fachada, jardim da frente. Zona **Praça** (desbloqueia
após a Casa): árvore, banco+poste. Cada obra oferece 2 estilos cosméticos; o
usuário paga em moedas e escolhe. Sem sorte, sem dinheiro real, sem paywall.

## Proibido (edital)
Qualquer mecânica de sorte/recompensa aleatória. Ver `docs/EDITAL.md`.
