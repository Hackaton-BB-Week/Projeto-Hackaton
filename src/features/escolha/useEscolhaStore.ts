import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cenários em que a pessoa já ganhou as moedas (uma vez por cenário). Salvo no aparelho.
interface EscolhaState {
  rewarded: string[];
  /** Marca o cenário. Retorna false se as moedas dele já tinham sido dadas. */
  claim: (scenarioId: string) => boolean;
}

export const useEscolhaStore = create<EscolhaState>()(
  persist(
    (set, get) => ({
      rewarded: [],
      claim: (id) => {
        if (get().rewarded.includes(id)) return false;
        set((s) => ({ rewarded: [...s.rewarded, id] }));
        return true;
      },
    }),
    { name: 'rqr-escolha', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
