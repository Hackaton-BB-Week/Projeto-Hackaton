import { useCallback, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { ESCOLHA_REWARD, SCENARIOS } from './scenarios';
import { useEscolhaStore } from './useEscolhaStore';

/**
 * Fluxo do "Aposta ou Escolha?": um cenário por vez → escolha → retorno educativo.
 * Escolha protetora dá moedas na primeira vez em cada cenário.
 */
export function useEscolha() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [protectiveCount, setProtectiveCount] = useState(0);
  const [earned, setEarned] = useState(0);
  const [lastGain, setLastGain] = useState(0);
  const claim = useEscolhaStore((s) => s.claim);
  const earnCoins = useGameStore((s) => s.earnCoins);

  const finished = index >= SCENARIOS.length;
  const scenario = finished ? null : SCENARIOS[index];

  const choose = useCallback(
    (optionIndex: number) => {
      if (!scenario || picked !== null) return;
      setPicked(optionIndex);
      const option = scenario.options[optionIndex];
      let gain = 0;
      if (option.protective) {
        setProtectiveCount((c) => c + 1);
        if (claim(scenario.id)) {
          gain = ESCOLHA_REWARD;
          earnCoins(gain);
          setEarned((e) => e + gain);
        }
      }
      setLastGain(gain);
    },
    [scenario, picked, claim, earnCoins],
  );

  const next = useCallback(() => {
    setPicked(null);
    setLastGain(0);
    setIndex((i) => i + 1);
  }, []);

  const restart = useCallback(() => {
    setIndex(0);
    setPicked(null);
    setLastGain(0);
    setProtectiveCount(0);
    setEarned(0);
  }, []);

  return {
    index,
    total: SCENARIOS.length,
    scenario,
    picked,
    pickedOption: scenario && picked !== null ? scenario.options[picked] : null,
    lastGain,
    finished,
    protectiveCount,
    earned,
    choose,
    next,
    restart,
  };
}
