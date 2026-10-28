import { router } from 'expo-router';
import { useGameStore } from '@/store/useGameStore';
import { useUserStore } from '@/store/useUserStore';

// Ações do fluxo de entrada. As telas só chamam estas funções.
export function useOnboarding() {
  const setIdentity = useUserStore((s) => s.setIdentity);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  /** Salva nome + e-mail e segue para a pesquisa. */
  const submitIdentity = (name: string, email: string) => {
    setIdentity(name.trim(), email.trim());
    router.push('/onboarding/pesquisa');
  };

  /** Atalho "Explorar demonstração": dados de exemplo, pula a pesquisa. */
  const startDemo = (typedName: string) => {
    setIdentity(typedName.trim() || 'Alex (exemplo)', '');
    completeOnboarding({ weeklySpend: 100, trigger: 'recuperar', goal: 0 });
    useGameStore.setState({ weeklySpend: 100, streak: 6, total: 6, coins: 180 });
    router.replace('/(tabs)');
  };

  return { submitIdentity, startDemo };
}
