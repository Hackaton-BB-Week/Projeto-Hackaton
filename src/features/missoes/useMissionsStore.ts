import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Quais missões já foram concluídas hoje. Salvo no aparelho para que fechar e
// abrir o app não libere a mesma missão (e as mesmas moedas) duas vezes.

interface MissionsState {
  /** Dia (dayKey) a que `done` se refere. */
  day: string | null;
  done: string[];
  /** Marca a missão como concluída no dia. Retorna false se já estava concluída. */
  markDone: (id: string, day: string) => boolean;
}

export const useMissionsStore = create<MissionsState>()(
  persist(
    (set, get) => ({
      day: null,
      done: [],
      markDone: (id, day) => {
        const s = get();
        const done = s.day === day ? s.done : []; // dia novo: começa do zero
        if (done.includes(id)) return false;
        set({ day, done: [...done, id] });
        return true;
      },
    }),
    { name: 'rqr-missions', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
