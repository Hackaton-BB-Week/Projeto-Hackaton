import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dailyCoinGain, useGameStore } from './useGameStore';
import {
  RECOVERY_BONUS,
  dayNumber,
  missedADay,
  type WitherReason,
} from '@/features/planta/plant';

// Planta diária + registro de dias. Salvo no aparelho, porque depende de datas reais.
// Sequência, total de dias e moedas continuam no useGameStore (economia).

export type RegisterDayResult =
  | { ok: true; coins: number; streak: number }
  | { ok: false; reason: 'already' | 'relapseToday' };

interface PlantState {
  /** Último dia registrado como "sem apostar". */
  lastDayNum: number | null;
  /** Último dia em que a planta recebeu cuidado (registro ou retomada). */
  lastCareDay: number | null;
  relapseDays: number[];
  mood: 'healthy' | 'wither';
  witherReason: WitherReason | null;
  /** Só para testes em desenvolvimento: avança o "hoje". */
  dayOffset: number;

  today: () => number;
  registerDay: () => RegisterDayResult;
  registerRelapse: () => void;
  completeRecovery: () => void;
  /** Murcha a planta se a pessoa passou um dia inteiro sem cuidar dela. */
  checkAbsence: () => void;
  devAdvanceDay: () => void;
}

export const usePlantStore = create<PlantState>()(
  persist(
    (set, get) => ({
      lastDayNum: null,
      lastCareDay: null,
      relapseDays: [],
      mood: 'healthy',
      witherReason: null,
      dayOffset: 0,

      today: () => dayNumber() + get().dayOffset,

      registerDay: () => {
        const s = get();
        const t = s.today();
        if (s.relapseDays.includes(t)) return { ok: false, reason: 'relapseToday' };
        if (s.lastDayNum === t) return { ok: false, reason: 'already' };

        const game = useGameStore.getState();
        const streak = s.lastDayNum === t - 1 ? game.streak + 1 : 1;
        const coins = dailyCoinGain(game.weeklySpend, streak);
        useGameStore.setState({
          streak,
          total: game.total + 1,
          coins: game.coins + coins,
          villageGrey: false,
        });
        // A planta cresce, mas se estiver murcha continua precisando da missão.
        set({ lastDayNum: t, lastCareDay: t });
        return { ok: true, coins, streak };
      },

      // Recaída pausa, nunca apaga: moedas, obras e tamanho da planta ficam.
      registerRelapse: () => {
        const t = get().today();
        useGameStore.getState().registerRelapse();
        set((s) => ({
          relapseDays: s.relapseDays.includes(t) ? s.relapseDays : [...s.relapseDays, t],
          lastCareDay: t,
          mood: 'wither',
          witherReason: 'relapse',
        }));
      },

      completeRecovery: () => {
        if (get().mood !== 'wither') return;
        useGameStore.setState((g) => ({ coins: g.coins + RECOVERY_BONUS, villageGrey: false }));
        set({ mood: 'healthy', witherReason: null, lastCareDay: get().today() });
      },

      checkAbsence: () => {
        const s = get();
        const t = s.today();
        // Primeiro uso: começa a contar a partir de hoje.
        if (s.lastCareDay === null) {
          set({ lastCareDay: t });
          return;
        }
        if (s.mood === 'healthy' && missedADay(s.lastCareDay, t)) {
          set({ mood: 'wither', witherReason: 'absence' });
        }
      },

      devAdvanceDay: () => set((s) => ({ dayOffset: s.dayOffset + 1 })),
    }),
    {
      name: 'rqr-plant',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ lastDayNum, lastCareDay, relapseDays, mood, witherReason, dayOffset }) => ({
        lastDayNum,
        lastCareDay,
        relapseDays,
        mood,
        witherReason,
        dayOffset,
      }),
    },
  ),
);
