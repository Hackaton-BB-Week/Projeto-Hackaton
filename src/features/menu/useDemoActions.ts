import { router } from 'expo-router';
import { useGameStore } from '@/store/useGameStore';
import { usePlantStore } from '@/store/usePlantStore';
import { useUserStore } from '@/store/useUserStore';
import { useVilaStore } from '@/store/useVilaStore';
import { useMissionsStore } from '@/features/missoes/useMissionsStore';
import { showToast } from '@/components/Toast';
import { formatCoins } from '@/lib/format';

// Atalhos de demonstração (apresentação do hackathon). Passam pelo mesmo registro de
// dias do botão "Registrar novo dia sem apostar", então planta, sequência e moedas
// ficam coerentes (como "Simular +1 dia" do protótipo).
export function useDemoActions() {
  const earnCoins = useGameStore((s) => s.earnCoins);
  const logout = useUserStore((s) => s.logout);

  return {
    /**
     * Simula dias passando. `register: false` (Simular +1 dia) só avança o dia: a pessoa
     * registra pelo botão "Registrar novo dia sem apostar", e as missões do dia trocam.
     * `register: true` (Simular +7 dias) já registra cada dia como sem apostar.
     */
    addDays: (n: number, register = true) => {
      const plant = usePlantStore.getState();
      let coins = 0;
      for (let i = 0; i < n; i++) {
        plant.devAdvanceDay();
        if (!register) continue;
        const r = usePlantStore.getState().registerDay();
        if (r.ok) coins += r.coins;
      }
      usePlantStore.getState().checkAbsence();
      const label = n === 1 ? '1 dia simulado' : `${n} dias simulados`;
      if (!register) {
        showToast(`${label} · registre o dia pelo botão "Registrar novo dia"`);
        return;
      }
      const { streak } = useGameStore.getState();
      showToast(`${label} e registrados · +${formatCoins(coins)} moedas · Sequência: ${streak}`);
    },
    addCoins: (n: number) => {
      earnCoins(n);
      showToast(`+${n} moedas (demonstração)`);
    },
    /** Apaga o login e todo o progresso e volta para as boas-vindas. */
    resetAll: () => {
      useGameStore.setState(useGameStore.getInitialState());
      useVilaStore.setState(useVilaStore.getInitialState());
      usePlantStore.getState().reset();
      useMissionsStore.setState({ day: null, done: [] });
      logout();
      router.replace('/');
      showToast('Demonstração reiniciada');
    },
  };
}
