import { create } from 'zustand';

// ----- Regras da economia (puras, testáveis) -----
export const MULTIPLIER_TIERS = [
  { minDays: 30, mult: 3 },
  { minDays: 14, mult: 2 },
  { minDays: 7, mult: 1.5 },
  { minDays: 3, mult: 1.2 },
  { minDays: 0, mult: 1 },
];

export function multiplierForStreak(streak: number): number {
  return MULTIPLIER_TIERS.find((t) => streak >= t.minDays)?.mult ?? 1;
}

/** Moedas ganhas em um dia: (gasto diário) x (multiplicador da sequência). */
export function dailyCoinGain(weeklySpend: number, streak: number): number {
  return Math.round((weeklySpend / 7) * multiplierForStreak(streak));
}

export type VillageTask = 'roof' | 'walls' | 'frontGarden' | 'tree' | 'bench';

type Village = Partial<Record<VillageTask, { style: number }>>;

interface GameState {
  weeklySpend: number;
  streak: number;
  total: number;
  relapses: number;
  coins: number;
  village: Village;
  villageGrey: boolean;
  missionDone: boolean;

  setWeeklySpend: (v: number) => void;
  advanceDays: (n: number) => void;
  registerRelapse: () => void;
  completeMission: (bonus?: number) => void;
  restore: (task: VillageTask, style: number, cost: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  weeklySpend: 0,
  streak: 1,
  total: 1,
  relapses: 0,
  coins: 0,
  village: {},
  villageGrey: false,
  missionDone: false,

  setWeeklySpend: (v) => set({ weeklySpend: v }),

  advanceDays: (n) =>
    set((s) => {
      let { streak, total, coins } = s;
      for (let i = 0; i < n; i++) {
        streak += 1;
        total += 1;
        coins += dailyCoinGain(s.weeklySpend, streak);
      }
      return { streak, total, coins, villageGrey: false, missionDone: false };
    }),

  // Recaída: zera a sequência, mantém moedas e construções.
  registerRelapse: () =>
    set((s) => ({
      streak: 0,
      relapses: s.relapses + 1,
      villageGrey: true,
      missionDone: false,
    })),

  completeMission: (bonus = 15) =>
    set((s) => (s.missionDone ? s : { missionDone: true, coins: s.coins + bonus })),

  restore: (task, style, cost) => {
    const s = get();
    if (s.coins < cost) return;
    set({ coins: s.coins - cost, village: { ...s.village, [task]: { style } } });
  },
}));
