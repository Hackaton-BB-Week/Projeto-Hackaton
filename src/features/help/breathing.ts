// Regras do exercício de respiração (puras, testáveis). Ritmo 4-4-6, como no protótipo.

export const BREATH_PHASES = [
  { name: 'Inspire', seconds: 4, scale: 1 },
  { name: 'Segure', seconds: 4, scale: 1 },
  { name: 'Expire', seconds: 6, scale: 0.62 },
] as const;

export const CYCLE_SECONDS = BREATH_PHASES.reduce((sum, p) => sum + p.seconds, 0);

export const DURATIONS = [
  { seconds: 60, label: '1 min' },
  { seconds: 120, label: '2 min' },
  { seconds: 300, label: '5 min' },
] as const;

export const DEFAULT_DURATION = 60;

/** Fase do ciclo após `elapsed` segundos, e quantos segundos faltam nela. */
export function phaseAt(elapsed: number) {
  let t = ((elapsed % CYCLE_SECONDS) + CYCLE_SECONDS) % CYCLE_SECONDS;
  for (let index = 0; index < BREATH_PHASES.length; index++) {
    const phase = BREATH_PHASES[index];
    if (t < phase.seconds) return { index, phase, secondsLeft: phase.seconds - t };
    t -= phase.seconds;
  }
  return { index: 0, phase: BREATH_PHASES[0], secondsLeft: BREATH_PHASES[0].seconds };
}

/** 75 → "01:15" */
export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

/** 75 → "1 minuto e 15 segundos" (para leitor de tela). */
export function spokenDuration(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  const parts = [];
  if (m) parts.push(`${m} ${m === 1 ? 'minuto' : 'minutos'}`);
  if (r || !m) parts.push(`${r} ${r === 1 ? 'segundo' : 'segundos'}`);
  return parts.join(' e ');
}

// ----- Cronômetro (reducer) -----

export type TimerStatus = 'idle' | 'running' | 'paused' | 'done';
export type TimerState = { total: number; remaining: number; status: TimerStatus };
export type TimerAction =
  | { type: 'toggle' }
  | { type: 'tick' }
  | { type: 'reset' }
  | { type: 'setDuration'; seconds: number };

export const initialTimer = (total = DEFAULT_DURATION): TimerState => ({
  total,
  remaining: total,
  status: 'idle',
});

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'toggle':
      if (state.status === 'running') return { ...state, status: 'paused' };
      // Depois de concluído, "Iniciar" recomeça do início.
      if (state.status === 'done') return { ...initialTimer(state.total), status: 'running' };
      return { ...state, status: 'running' };
    case 'tick': {
      if (state.status !== 'running') return state;
      const remaining = state.remaining - 1;
      return remaining <= 0 ? { ...state, remaining: 0, status: 'done' } : { ...state, remaining };
    }
    case 'reset':
      return initialTimer(state.total);
    case 'setDuration':
      // Não troca a duração no meio de um exercício.
      if (state.status === 'running') return state;
      return initialTimer(action.seconds);
  }
}
