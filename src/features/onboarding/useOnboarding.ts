import { router } from 'expo-router';
import { useGameStore } from '@/store/useGameStore';
import { useUserStore } from '@/store/useUserStore';
import { usePlantStore } from '@/store/usePlantStore';
import { dayNumber } from '@/features/planta/plant';
import { useSurveyStore } from './useSurveyStore';
import type { StartingPoint } from './profile';

// Ações do fluxo de entrada. As telas só chamam estas funções.
export function useOnboarding() {
  const setIdentity = useUserStore((s) => s.setIdentity);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  /** Salva nome + e-mail e segue para a pesquisa. */
  const submitIdentity = (name: string, email: string) => {
    setIdentity(name.trim(), email.trim());
    useSurveyStore.getState().reset();
    router.push('/onboarding/pesquisa');
  };

  /** Conclui a pesquisa: salva o resultado e começa a vila do zero (80 moedas, como no protótipo). */
  const finishOnboarding = (sp: StartingPoint) => {
    completeOnboarding({ weeklySpend: sp.weekly, trigger: sp.trigger, goal: sp.goal });
    useGameStore.setState({ weeklySpend: sp.weekly, coins: 80, streak: 0, total: 0 });
    usePlantStore.getState().reset();
    useSurveyStore.getState().reset();
    router.replace('/(tabs)');
  };

  /** Atalho "Explorar demonstração": dados de exemplo, pula a pesquisa. */
  const startDemo = (typedName: string) => {
    setIdentity(typedName.trim() || 'Alex (exemplo)', '');
    completeOnboarding({ weeklySpend: 100, trigger: 'recuperar', goal: 0 });
    useGameStore.setState({ weeklySpend: 100, streak: 6, total: 6, coins: 180 });
    // Como no protótipo: o último dia registrado foi ontem, então hoje dá pra registrar.
    usePlantStore.getState().reset(dayNumber() - 1);
    router.replace('/(tabs)');
  };

  return { submitIdentity, finishOnboarding, startDemo };
}
