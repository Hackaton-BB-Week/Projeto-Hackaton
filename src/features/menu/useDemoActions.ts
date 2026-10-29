import { router } from 'expo-router';
import { useGameStore } from '@/store/useGameStore';
import { usePlantStore } from '@/store/usePlantStore';
import { useUserStore } from '@/store/useUserStore';
import { useVilaStore } from '@/store/useVilaStore';
import { useMissionsStore } from '@/features/missoes/useMissionsStore';
import { showToast } from '@/components/Toast';
import { formatCoins } from '@/lib/format';
import { usePlantUi } from '@/features/planta/usePlant';
import { plantStage } from '@/features/planta/plant';
import { signOutCloud } from '@/services/sync';

// Atalhos de demonstração (apresentação do hackathon). Passam pelo mesmo registro de
// dias do botão "Registrar novo dia sem apostar", então planta, sequência e moedas
// ficam coerentes (como "Simular +1 dia" do protótipo).
export function useDemoActions() {
  const earnCoins = useGameStore((s) => s.earnCoins);
  const logout = useUserStore((s) => s.logout);

  /** Sai da conta, apaga o progresso do aparelho e volta para as boas-vindas.
   *  O progresso da conta continua na nuvem (entrar de novo traz tudo de volta). */
  const leave = async () => {
    await signOutCloud();
    useGameStore.setState(useGameStore.getInitialState());
    useVilaStore.setState(useVilaStore.getInitialState());
    usePlantStore.getState().reset();
    useMissionsStore.setState({ day: null, done: [] });
    logout();
    router.replace('/onboarding');
  };

  return {
    /**
     * Simula dias passando. `register: false` (Simular +1 dia) só avança o dia: a pessoa
     * registra pelo botão "Registrar novo dia sem apostar", e as missões do dia trocam.
     * `register: true` (Simular +7 dias) já registra cada dia como sem apostar.
     */
    addDays: (n: number, register = true) => {
      const plant = usePlantStore.getState();
      const stageBefore = plantStage(useGameStore.getState().total);
      let coins = 0;
      let registered = 0;
      for (let i = 0; i < n; i++) {
        plant.devAdvanceDay();
        if (!register) continue;
        const r = usePlantStore.getState().registerDay();
        if (r.ok) {
          coins += r.coins;
          registered++;
        }
      }
      usePlantStore.getState().checkAbsence();
      const label = n === 1 ? '1 dia simulado' : `${n} dias simulados`;
      if (!register) {
        showToast(`${label} · registre o dia pelo botão "Registrar novo dia"`);
        return;
      }
      // No fim, "Cresceu!" completo se a planta mudou de estágio.
      // (A bolinha ignora os efeitos com "reduzir animações".)
      const grew = plantStage(useGameStore.getState().total) > stageBefore;
      const { play } = usePlantUi.getState();
      // Crescimento rapidinho, um por dia, como se os dias passassem sendo checados.
      for (let i = 0; i < registered; i++) setTimeout(() => play('tick'), 400 + i * 300);
      if (grew) setTimeout(() => play('grow'), 400 + registered * 300 + 250);
      const { streak } = useGameStore.getState();
      showToast(`${label} e registrados · +${formatCoins(coins)} moedas · Sequência: ${streak}`);
    },
    addCoins: (n: number) => {
      earnCoins(n);
      showToast(`+${n} moedas (demonstração)`);
    },
    /** Reiniciar da demonstração: sai da conta e zera o aparelho. */
    resetAll: async () => {
      await leave();
      showToast('Demonstração reiniciada');
    },
    /** Botão "Sair da conta": o progresso fica na nuvem, entrar de novo traz tudo de volta. */
    signOut: async () => {
      await leave();
      showToast('Você saiu da conta');
    },
  };
}
