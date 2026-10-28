import { create } from 'zustand';

// Valores financeiros informados pelo próprio usuário (em reais inteiros).
// O gasto semanal fica no useGameStore, pois é ele que alimenta a economia de moedas.
export interface FinanceValues {
  /** Quanto o usuário de fato guardou (informado por ele). */
  saved: number;
  /** Perdas estimadas no período (informado por ele). */
  losses: number;
  /** Meta financeira (informado por ele). 0 = sem meta. */
  goal: number;
}

interface FinanceState extends FinanceValues {
  setValues: (v: Partial<FinanceValues>) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  saved: 0,
  losses: 0,
  goal: 0,
  setValues: (v) => set(v),
}));
