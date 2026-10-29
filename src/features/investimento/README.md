# Feature: investimento

Simula o que aconteceria se o gasto com apostas virasse um aporte mensal em renda
fixa: CDB do Banco do Brasil (100% do CDI, referência) e Tesouro Selic.

- Rota: `app/investimentos.tsx`, aberta pelo botão "Investimentos" no Painel financeiro.
- Tela: `InvestmentScreen.tsx`. Gráfico SVG: `components/GrowthChart.tsx`.
- Regras puras: `investment.ts` (aporte = gasto semanal × 52/12; 12 meses passados
  com as taxas reais + 12 de projeção repetindo a taxa do último mês).
- Taxas: `src/services/rates.ts`, API pública SGS do Banco Central (séries 4390 Selic
  e 4391 CDI, % a.m.). Sem internet, usa a tabela embutida; se só o CDI falhar, usa a Selic.
- Valores brutos (sem IR/taxas). Simulação educativa, sem promessa de rendimento.
