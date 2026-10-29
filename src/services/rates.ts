import { bcbDateToMonth, type MonthlyRate } from '@/features/investimento/investment';

// Taxas públicas do Banco Central (API SGS, sem chave). Séries mensais em % a.m.:
// 4390 = Selic acumulada no mês, 4391 = CDI acumulado no mês.

const SERIES = { selic: 4390, cdi: 4391 } as const;
export type RateSeries = keyof typeof SERIES;

/** Reserva offline: Selic mensal real de nov/25 a out/26 (BCB, série 4390). */
export const FALLBACK_SELIC: MonthlyRate[] = [
  ['2025-11', 1.05], ['2025-12', 1.22], ['2026-01', 1.16], ['2026-02', 1.0],
  ['2026-03', 1.21], ['2026-04', 1.09], ['2026-05', 1.07], ['2026-06', 1.12],
  ['2026-07', 1.22], ['2026-08', 1.09], ['2026-09', 1.08], ['2026-10', 0.97],
].map(([month, rate]) => ({ month: month as string, rate: rate as number }));

type BcbRow = { data: string; valor: string };

/** Últimos 12 meses de uma série. Lança erro se a API falhar. */
export async function fetchMonthlyRates(series: RateSeries): Promise<MonthlyRate[]> {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${SERIES[series]}/dados/ultimos/12?formato=json`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`BCB ${res.status}`);
  const rows = (await res.json()) as BcbRow[];
  const rates = rows
    .map((r) => ({ month: bcbDateToMonth(r.data), rate: Number(r.valor) }))
    .filter((r) => Number.isFinite(r.rate));
  if (rates.length < 12) throw new Error('BCB: série incompleta');
  return rates;
}
