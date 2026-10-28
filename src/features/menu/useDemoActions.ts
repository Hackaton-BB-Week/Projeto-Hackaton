import { router } from 'expo-router';
import { useGameStore } from '@/store/useGameStore';
import { useUserStore } from '@/store/useUserStore';
import { showToast } from '@/components/Toast';

// Atalhos de demonstração (apresentação do hackathon). Usam as regras da economia.
export function useDemoActions() {
  const advanceDays = useGameStore((s) => s.advanceDays);
  const earnCoins = useGameStore((s) => s.earnCoins);
  const logout = useUserStore((s) => s.logout);

  return {
    addDays: (n: number) => {
      advanceDays(n);
      showToast(n === 1 ? '1 dia simulado' : `${n} dias simulados`);
    },
    addCoins: (n: number) => {
      earnCoins(n);
      showToast(`+${n} moedas (demonstração)`);
    },
    /** Apaga o login e o progresso e volta para as boas-vindas. */
    resetAll: () => {
      useGameStore.setState(useGameStore.getInitialState());
      logout();
      router.replace('/');
      showToast('Demonstração reiniciada');
    },
  };
}
