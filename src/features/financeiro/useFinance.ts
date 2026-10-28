import { useGameStore } from '@/store/useGameStore';
import { useFinanceStore, type FinanceValues } from '@/store/useFinanceStore';
import { buildComparison, estimatedNotBet, goalProgress } from './finance';

export interface FinanceUpdate extends FinanceValues {
  weeklySpend: number;
}

// Junta o estado do jogo (gasto semanal, dias) com os valores informados pelo usuário.
export function useFinance() {
  const weeklySpend = useGameStore((s) => s.weeklySpend);
  const totalDays = useGameStore((s) => s.total);
  const setWeeklySpend = useGameStore((s) => s.setWeeklySpend);
  const saved = useFinanceStore((s) => s.saved);
  const losses = useFinanceStore((s) => s.losses);
  const goal = useFinanceStore((s) => s.goal);
  const setValues = useFinanceStore((s) => s.setValues);

  const notBet = estimatedNotBet(weeklySpend, totalDays);

  const update = (v: FinanceUpdate) => {
    setWeeklySpend(v.weeklySpend);
    setValues({ saved: v.saved, losses: v.losses, goal: v.goal });
  };

  return {
    weeklySpend,
    totalDays,
    notBet,
    saved,
    losses,
    goal,
    goalPercent: goalProgress(saved, goal),
    bars: buildComparison({ notBet, saved, losses, goal }),
    update,
  };
}
