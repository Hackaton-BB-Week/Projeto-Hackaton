import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { buildDiagnosis, QUESTIONS, type DiagAnswers, type Previous } from './diagnosis';

/** Fluxo do "Refazer diagnóstico": uma pergunta por vez; no fim atualiza o perfil. */
export function useDiagnostico() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<DiagAnswers>>({});
  const updateDiagnosis = useUserStore((s) => s.updateDiagnosis);

  // Valores de antes, para comparar no resultado (lidos uma vez, ao abrir).
  const prev = useRef<Previous>({
    weeklySpend: useUserStore.getState().weeklySpend,
    trigger: useUserStore.getState().trigger,
  });

  const finished = step >= QUESTIONS.length;
  const result = useMemo(
    () => (finished ? buildDiagnosis(answers as DiagAnswers, prev.current) : null),
    [finished, answers],
  );

  // Salva o novo ponto de partida uma vez, ao chegar no resultado.
  const saved = useRef(false);
  useEffect(() => {
    if (!result || saved.current) return;
    saved.current = true;
    updateDiagnosis({ weeklySpend: result.weeklySpend, trigger: result.trigger });
  }, [result, updateDiagnosis]);

  const current = finished ? null : QUESTIONS[step];

  const choose = useCallback(
    (id: string) => {
      if (!current) return;
      const option = current.options.find((o) => o.id === id);
      if (!option) return;
      setAnswers((a) => ({ ...a, [current.key]: option.value }));
      setStep((s) => s + 1);
    },
    [current],
  );

  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const selected = current ? answers[current.key] : undefined;
  return {
    step,
    total: QUESTIONS.length,
    current,
    selectedId: selected === undefined ? undefined : String(selected),
    result,
    choose,
    back,
  };
}
