import { create } from 'zustand';
import { useGameStore } from '@/store/useGameStore';
import { usePlantStore } from '@/store/usePlantStore';
import { STAGE_NAMES, nextStageAt, plantStage, recoveryMissionFor } from './plant';

// Qual painel da planta está aberto (o selo no mapa e os botões abrem o mesmo host).
export type PlantSheetKind =
  | 'plant'
  | 'recovery'
  | 'relapseConfirm'
  | 'relapseThanks'
  | 'already'
  | 'relapseToday';

/** Micro-animações da bolinha, disparadas pelas ações da pessoa (nunca por sorte). */
/** `tick`: versão curta do crescer, para "Simular +7 dias" (vários dias em sequência). */
export type PlantFx = 'water' | 'grow' | 'tick' | 'heal' | 'relapse';

export const usePlantUi = create<{
  sheet: PlantSheetKind | null;
  /** `key` muda a cada disparo, para o mesmo efeito poder rodar de novo. */
  fx: { kind: PlantFx; key: number } | null;
  open: (s: PlantSheetKind) => void;
  close: () => void;
  play: (kind: PlantFx) => void;
}>((set) => ({
  sheet: null,
  fx: null,
  open: (sheet) => set({ sheet }),
  close: () => set({ sheet: null }),
  play: (kind) => set((s) => ({ fx: { kind, key: (s.fx?.key ?? 0) + 1 } })),
}));

/** Dados de exibição da planta, derivados dos stores. */
export function usePlant() {
  const total = useGameStore((s) => s.total);
  const streak = useGameStore((s) => s.streak);
  const mood = usePlantStore((s) => s.mood);
  const witherReason = usePlantStore((s) => s.witherReason);
  const dayOffset = usePlantStore((s) => s.dayOffset);
  const today = usePlantStore((s) => s.today);

  const stage = plantStage(total);
  const next = nextStageAt(total);
  const wither = mood === 'wither';

  return {
    total,
    streak,
    stage,
    wither,
    witherReason,
    stageName: STAGE_NAMES[stage],
    nextStageName: next === null ? null : STAGE_NAMES[plantStage(next)],
    daysToNext: next === null ? null : next - total,
    dayOffset,
    recoveryMission: recoveryMissionFor(today()),
  };
}
