import { useGameStore } from '@/store/useGameStore';
import { multiplierForStreak } from '@/store/useGameStore';

// Exemplo de hook: deriva valores de exibição a partir do store.
export function useProfile() {
  const { weeklySpend, streak, total, coins } = useGameStore();
  return {
    weeklySpend,
    monthlyEstimate: weeklySpend * 4.3,
    preserved: (weeklySpend / 7) * total,
    multiplier: multiplierForStreak(streak),
    coins,
  };
}
