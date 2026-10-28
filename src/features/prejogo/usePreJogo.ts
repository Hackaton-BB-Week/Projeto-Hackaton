import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useUserStore } from '@/store/useUserStore';
import { showToast } from '@/components/Toast';
import { dayKey } from '@/lib/date';
import { buildResult, PRE_JOGO_REWARD, STEPS, type PreJogoAnswers } from './preJogo';
import { usePreJogoStore } from './usePreJogoStore';

/** Fluxo do pré-jogo: uma pergunta por vez, depois o resultado personalizado. */
export function usePreJogo() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<PreJogoAnswers>>({});
  const { trigger, goal, onboarded } = useUserStore();
  const weeklySpend = useGameStore((s) => s.weeklySpend);
  const earnCoins = useGameStore((s) => s.earnCoins);
  const claimReward = usePreJogoStore((s) => s.claimReward);

  const finished = step >= STEPS.length;

  const result = useMemo(() => {
    if (!finished) return null;
    return buildResult(answers as PreJogoAnswers, {
      surveyTrigger: trigger,
      goal: onboarded ? goal : null,
      weeklySpend,
    });
  }, [finished, answers, trigger, goal, onboarded, weeklySpend]);

  // Recompensa por ter pausado: uma vez por dia, ao chegar no resultado.
  const rewarded = useRef(false);
  useEffect(() => {
    if (!finished || rewarded.current) return;
    rewarded.current = true;
    if (claimReward(dayKey())) {
      earnCoins(PRE_JOGO_REWARD);
      showToast(`+${PRE_JOGO_REWARD} moedas por cuidar de você`);
    }
  }, [finished, claimReward, earnCoins]);

  const choose = useCallback((key: keyof PreJogoAnswers, id: string) => {
    setAnswers((a) => ({ ...a, [key]: id }));
    setStep((s) => s + 1);
  }, []);

  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const restart = useCallback(() => {
    setAnswers({});
    setStep(0);
  }, []);

  return {
    step,
    total: STEPS.length,
    current: finished ? null : STEPS[step],
    selected: finished ? undefined : answers[STEPS[step].key],
    result,
    choose,
    back,
    restart,
  };
}
