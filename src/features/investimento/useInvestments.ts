import { useQuery } from '@tanstack/react-query';
import { useGameStore } from '@/store/useGameStore';
import { FALLBACK_SELIC, fetchMonthlyRates } from '@/services/rates';
import { applyPercent, monthlyContribution, simulate, type MonthlyRate } from './investment';

/** CDB do Banco do Brasil considerado a 100% do CDI (referência, não oferta). */
export const CDB_PERCENT_CDI = 100;

export type RatesSource = 'bcb' | 'fallback';

const DAY = 24 * 60 * 60 * 1000;

function useRates(series: 'selic' | 'cdi') {
  return useQuery<MonthlyRate[]>({
    queryKey: ['bcb-rates', series],
    queryFn: () => fetchMonthlyRates(series),
    staleTime: DAY,
    retry: 1,
  });
}

/**
 * Simula o gasto com apostas (aporte mensal) no CDB a 100% do CDI e no Tesouro
 * Selic. Taxas reais do Banco Central; offline, usa a tabela embutida. Se só o CDI
 * falhar, usa a Selic do mês (as duas andam praticamente juntas).
 */
export function useInvestments() {
  const weeklySpend = useGameStore((s) => s.weeklySpend);
  const selicQ = useRates('selic');
  const cdiQ = useRates('cdi');

  const selic = selicQ.data ?? FALLBACK_SELIC;
  const cdi = cdiQ.data ?? selic;
  const monthly = monthlyContribution(weeklySpend);

  return {
    weeklySpend,
    monthly,
    loading: selicQ.isLoading || cdiQ.isLoading,
    source: (selicQ.data ? 'bcb' : 'fallback') as RatesSource,
    cdb: simulate(applyPercent(cdi, CDB_PERCENT_CDI), monthly),
    tesouro: simulate(selic, monthly),
  };
}
