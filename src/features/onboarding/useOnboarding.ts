import { router } from 'expo-router';
import { useGameStore } from '@/store/useGameStore';
import { useUserStore } from '@/store/useUserStore';
import { usePlantStore } from '@/store/usePlantStore';
import { dayNumber } from '@/features/planta/plant';
import { restoreSnapshots } from '@/hooks/useCloudSync';
import { signInWithEmail, signUpWithEmail } from '@/services/sync';
import { useSurveyStore } from './useSurveyStore';
import type { StartingPoint } from './profile';

// Ações do fluxo de entrada. As telas só chamam estas funções.
export function useOnboarding() {
  const setIdentity = useUserStore((s) => s.setIdentity);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  /** Cria a conta (e-mail e senha), salva nome + e-mail e segue para a pesquisa. Retorna o erro, se houver. */
  const submitIdentity = async (name: string, email: string, password: string) => {
    const r = await signUpWithEmail(email.trim(), password);
    if (!r.ok) return r.error;
    setIdentity(name.trim(), email.trim());
    useSurveyStore.getState().reset();
    router.push('/onboarding/pesquisa');
    return null;
  };

  /** Entra numa conta existente e traz o progresso dela. Retorna o erro, se houver. */
  const login = async (email: string, password: string) => {
    const r = await signInWithEmail(email.trim(), password);
    if (!r.ok) return r.error;
    await restoreSnapshots(r.snapshots);
    if (useUserStore.getState().onboarded) {
      router.replace('/(tabs)');
    } else {
      // Conta sem pesquisa concluída: continua de onde parou.
      setIdentity(useUserStore.getState().name, email.trim());
      useSurveyStore.getState().reset();
      router.push('/onboarding/pesquisa');
    }
    return null;
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

  return { submitIdentity, login, finishOnboarding, startDemo };
}
