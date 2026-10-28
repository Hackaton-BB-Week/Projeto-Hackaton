import { useEffect, useReducer, useRef } from 'react';
import { initialTimer, phaseAt, timerReducer } from './breathing';

/**
 * Cronômetro regressivo do exercício. Pausar mantém o tempo; reiniciar volta à
 * duração escolhida. `onDone` é chamado uma vez quando chega a zero.
 */
export function useBreathingTimer(onDone?: (seconds: number) => void) {
  const [state, dispatch] = useReducer(timerReducer, undefined, () => initialTimer());

  useEffect(() => {
    if (state.status !== 'running') return;
    const id = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    if (state.status === 'done') onDoneRef.current?.(state.total);
  }, [state.status, state.total]);

  const elapsed = state.total - state.remaining;
  return {
    ...state,
    elapsed,
    current: phaseAt(elapsed),
    toggle: () => dispatch({ type: 'toggle' }),
    reset: () => dispatch({ type: 'reset' }),
    setDuration: (seconds: number) => dispatch({ type: 'setDuration', seconds }),
  };
}
