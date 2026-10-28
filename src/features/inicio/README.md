# Feature: inicio (tela Início)

Peças da tela Início (`app/(tabs)/index.tsx`) que não são da vila nem da planta.
Layout de cima para baixo, como no protótipo:

1. `HomeHud` — fixo no topo: ☰, "Olá, *nome*", pílulas do multiplicador e das moedas,
   e os quadros de sequência, dias no total e R$ preservado.
2. Vila (`features/vila`) com o selo da planta.
3. Banner de retomada e botões de registro (`features/planta`).
4. `HomeShortcuts` — Missões e Ajuda lado a lado.
5. Lista "Construir a vila" (`features/vila`).

Pré-jogo, painel financeiro e as demais ferramentas ficam no menu ☰.
