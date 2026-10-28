// Regras puras da planta diária (mesmas do protótipo HTML).

/** Dia do calendário (UTC) como número inteiro, igual ao `baseDay` do protótipo. */
export function dayNumber(now = Date.now()): number {
  return Math.floor(now / 86_400_000);
}

/** Estágio de crescimento (0–5) pelo total de dias sem apostar registrados. */
export function plantStage(totalDays: number): number {
  if (totalDays <= 0) return 0;
  if (totalDays < 3) return 1;
  if (totalDays < 7) return 2;
  if (totalDays < 14) return 3;
  if (totalDays < 30) return 4;
  return 5;
}

export const STAGE_NAMES = [
  'Semente plantada',
  'Primeiro broto',
  'Muda crescendo',
  'Plantinha firme',
  'Botão florindo',
  'Jardim em flor',
];

/** Dias necessários para o próximo estágio (null no último). */
export function nextStageAt(totalDays: number): number | null {
  const marks = [1, 3, 7, 14, 30];
  return marks.find((m) => totalDays < m) ?? null;
}

/**
 * A planta murcha por ausência quando passa um dia inteiro sem cuidado
 * (registro de dia ou missão de retomada). Ex.: cuidou na segunda, não voltou na
 * terça → na quarta ela está murcha.
 */
export function missedADay(lastCareDay: number | null, today: number): boolean {
  return lastCareDay !== null && today - lastCareDay >= 2;
}

export type WitherReason = 'relapse' | 'absence';

// Missões de retomada: gestos simples de autocuidado. A do dia é escolhida pelo
// calendário (nada de sorteio).
export const RECOVERY_MISSIONS = [
  "Beba um copo d'água e respire fundo três vezes.",
  'Mande uma mensagem para alguém de confiança.',
  'Dê uma volta curta de cinco minutos.',
  'Lave o rosto e alongue o corpo por um minuto.',
];

export function recoveryMissionFor(today: number): string {
  return RECOVERY_MISSIONS[today % RECOVERY_MISSIONS.length];
}

export const RECOVERY_BONUS = 10;
