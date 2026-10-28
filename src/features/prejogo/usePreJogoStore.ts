import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dia (dayKey) em que a recompensa do pré-jogo já foi dada. Salvo no aparelho.
interface PreJogoState {
  rewardDay: string | null;
  /** Marca a recompensa do dia. Retorna false se já tinha sido dada hoje. */
  claimReward: (day: string) => boolean;
}

export const usePreJogoStore = create<PreJogoState>()(
  persist(
    (set, get) => ({
      rewardDay: null,
      claimReward: (day) => {
        if (get().rewardDay === day) return false;
        set({ rewardDay: day });
        return true;
      },
    }),
    { name: 'rqr-prejogo', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
