# Feature: escolha ("Aposta ou Escolha?")

Quiz **educativo**: situações reais das apostas, a pessoa escolhe como reagiria e vê
os riscos ou benefícios. Nenhuma aposta é simulada (regra do edital). Rota
`app/aposta-ou-escolha.tsx`.

- `scenarios.ts` — os cenários. Cada um tem opções (protetora ou não, com retorno) e
  um quadro **"Entenda"** com o mecanismo por trás (margem da casa, falácia do
  apostador, correr atrás do prejuízo…). Só conceitos gerais e verdadeiros: não
  invente números.
- Depois de uma escolha arriscada, mostra as escolhas que protegem naquela situação.
- No fim, um resumo "O que levar daqui" e o caminho para a aba Ajuda.
- Moedas: +10 na primeira escolha protetora de cada cenário (`useEscolhaStore`, salvo
  no aparelho). Refazer o quiz não dá moedas de novo.
- Entrada: item "Aposta ou Escolha?" do menu lateral (ligar em `menuItems.ts` com
  `href: '/aposta-ou-escolha'` quando `feat/menu-lateral` estiver no `dev`).
