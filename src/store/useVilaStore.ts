import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { syncedStorage } from '@/services/sync';
import { CITIES, type Plot } from '@/features/vila/data/cities';
import { useGameStore } from '@/store/useGameStore';

// ----- Regras da vila (puras, testáveis) -----
export type BuiltMap = Record<string, { style: number }>;

export const builtCount = (built: BuiltMap) => Object.keys(built).length;

/** Uma obra fica disponível quando a cidade já tem `unlock` obras concluídas. */
export const isAvailable = (plot: Plot, built: BuiltMap) => builtCount(built) >= plot.unlock;

export const isCityComplete = (cityIndex: number, built: BuiltMap) =>
  builtCount(built) >= CITIES[cityIndex].plots.length;

interface VilaState {
  cityIndex: number;
  /** Obras concluídas por cidade (índice de CITIES → id da obra → estilo escolhido). */
  built: BuiltMap[];

  /** Constrói uma obra pagando com moedas. Retorna false se não puder construir. */
  build: (plotId: string, style: number) => boolean;
  /** Vai para a próxima cidade, se a atual estiver concluída. */
  nextCity: () => void;
}

export const useVilaStore = create<VilaState>()(
  persist(
    (set, get) => ({
      cityIndex: 0,
      built: CITIES.map(() => ({})),

      build: (plotId, style) => {
        const { cityIndex, built } = get();
        const current = built[cityIndex];
        const plot = CITIES[cityIndex].plots.find((p) => p.id === plotId);
        if (!plot || current[plotId] || !isAvailable(plot, current)) return false;
        if (!useGameStore.getState().spendCoins(plot.cost)) return false;
        const next = [...built];
        next[cityIndex] = { ...current, [plotId]: { style: plot.hasStyle ? style : 0 } };
        set({ built: next });
        return true;
      },

      nextCity: () => {
        const { cityIndex, built } = get();
        if (cityIndex + 1 < CITIES.length && isCityComplete(cityIndex, built[cityIndex])) {
          set({ cityIndex: cityIndex + 1 });
        }
      },
    }),
    {
      name: 'rqr-vila',
      storage: createJSONStorage(() => syncedStorage),
      partialize: ({ cityIndex, built }) => ({ cityIndex, built }),
    },
  ),
);
