# Feature: financeiro

Painel financeiro: compara o que deixou de ir para apostas (estimativa) com o que o
usuário guardou de fato, as perdas estimadas e uma meta. Tudo é informado pelo
próprio usuário — nada de dado real de banco, nada de promessa de ganho.

- Rota: `app/financeiro.tsx` (tela empilhada sobre as abas, sem barra inferior).
- Tela: `FinanceScreen.tsx`. Componentes em `components/`.
- Regras puras: `finance.ts`. Hook: `useFinance.ts`.
- Estado: gasto semanal em `useGameStore` (alimenta as moedas); guardado, perdas e
  meta em `src/store/useFinanceStore.ts`.
- **Para usar na Home:** `import { FinanceShortcut } from '@/features/financeiro/components/FinanceShortcut'`
  e coloque `<FinanceShortcut />` onde quiser. Ele já navega para `/financeiro`.

Pendente: persistência (local ou Supabase) — hoje os valores vivem só na memória,
igual ao restante do estado do jogo.
