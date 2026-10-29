import { useQuery } from '@tanstack/react-query';
import { useGameStore } from '@/store/useGameStore';
import { FALLBACK_SELIC, fetchMonthlyRates } from '@/services/rates';
import { estimatedNotBet } from '@/features/financeiro/finance';
import { applyPercent, monthlyContribution, simulate, type MonthlyRate } from './investment';

/** Rendimento de referência: 100% do CDI. */
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
 * Aplica hoje o que já deixou de ir para apostas e soma o gasto com apostas como
 * aporte mensal, a 100% do CDI e no Tesouro Selic, por 12 meses. Taxas reais
 * do Banco Central; offline, usa a tabela embutida. Se só o CDI falhar, usa a Selic.
 */
export function useInvestments() {
  const weeklySpend = useGameStore((s) => s.weeklySpend);
  const totalDays = useGameStore((s) => s.total);
  const selicQ = useRates('selic');
  const cdiQ = useRates('cdi');

  const selic = selicQ.data ?? FALLBACK_SELIC;
  const cdi = cdiQ.data ?? selic;
  const monthly = monthlyContribution(weeklySpend);
  const initial = estimatedNotBet(weeklySpend, totalDays);

  return {
    weeklySpend,
    monthly,
    initial,
    loading: selicQ.isLoading || cdiQ.isLoading,
    source: (selicQ.data ? 'bcb' : 'fallback') as RatesSource,
    cdb: simulate(applyPercent(cdi, CDB_PERCENT_CDI), initial, monthly),
    tesouro: simulate(selic, initial, monthly),
  };
}
