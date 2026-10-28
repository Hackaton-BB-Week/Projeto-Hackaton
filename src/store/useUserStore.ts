import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameStore } from './useGameStore';

// Login local (sem auth real, ver docs/MVP.md). Fica salvo no aparelho.
export type Trigger = 'tedio' | 'recuperar' | 'ansiedade' | 'promo';

interface UserState {
  name: string;
  email: string;
  weeklySpend: number;
  trigger: Trigger | null;
  /** Objetivo escolhido na pesquisa (0–3). */
  goal: number;
  onboarded: boolean;
  /** true quando os dados salvos já foram lidos do aparelho. */
  hydrated: boolean;

  setIdentity: (name: string, email: string) => void;
  completeOnboarding: (v: { weeklySpend: number; trigger: Trigger; goal: number }) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: '',
      email: '',
      weeklySpend: 0,
      trigger: null,
      goal: 0,
      onboarded: false,
      hydrated: false,

      setIdentity: (name, email) => set({ name, email }),
      completeOnboarding: (v) => set({ ...v, onboarded: true }),
      logout: () =>
        set({ name: '', email: '', weeklySpend: 0, trigger: null, goal: 0, onboarded: false }),
    }),
    {
      name: 'rqr-user',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ hydrated: _h, ...rest }) => rest,
      onRehydrateStorage: () => (state) => {
        // O gasto semanal também alimenta a economia de moedas.
        if (state?.onboarded) useGameStore.setState({ weeklySpend: state.weeklySpend });
        useUserStore.setState({ hydrated: true });
      },
    },
  ),
);
