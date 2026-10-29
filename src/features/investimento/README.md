# Feature: investimento

Simula o dinheiro que deixou de ir para apostas aplicado hoje, mais aportes mensais, em renda
fixa: CDB do Banco do Brasil (100% do CDI, referência) e Tesouro Selic.

- Rota: `app/investimentos.tsx`, aberta pelo botão "Investimentos" no Painel financeiro.
- Tela: `InvestmentScreen.tsx`. Gráfico SVG: `components/GrowthChart.tsx`.
- Regras puras: `investment.ts`. Começa hoje aplicando o "deixou de apostar" do painel,
  e soma o gasto semanal × 52/12 todo mês por 12 meses, à taxa do último mês conhecido.
- Taxas: `src/services/rates.ts`, API pública SGS do Banco Central (séries 4390 Selic
  e 4391 CDI, % a.m.). Sem internet, usa a tabela embutida; se só o CDI falhar, usa a Selic.
- Valores brutos (sem IR/taxas). Simulação educativa, sem promessa de rendimento.
