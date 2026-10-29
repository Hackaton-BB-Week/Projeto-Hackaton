// Regras puras da simulação de investimentos (sem React, fáceis de testar).
// Tudo é estimativa educativa: rentabilidade bruta, sem IR, taxas ou garantia.

/** Taxa de um mês, em % ao mês (ex.: 1.08 = 1,08% a.m.). */
export interface MonthlyRate {
  /** Primeiro dia do mês, "AAAA-MM". */
  month: string;
  rate: number;
}

export interface SimPoint {
  /** 0 = hoje, 1..12 = meses à frente. */
  index: number;
  label: string;
  balance: number;
  invested: number;
}

export interface Simulation {
  points: SimPoint[];
  /** Valor aplicado hoje (o que já deixou de ir para apostas). */
  initial: number;
  /** Saldo estimado daqui a 12 meses. */
  in12: number;
  /** Total aportado em 12 meses (inicial + mensais). */
  investedIn12: number;
  /** Rentabilidade acumulada nos últimos 12 meses, em %. */
  rate12m: number;
  /** Taxa mensal usada na projeção (último mês conhecido), em % a.m. */
  projectionRate: number;
}

/** Semanas médias por mês (52 / 12). */
const WEEKS_PER_MONTH = 52 / 12;

/** Quanto entraria por mês: o gasto semanal com apostas vira aporte mensal. */
export const monthlyContribution = (weeklySpend: number) => weeklySpend * WEEKS_PER_MONTH;

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** "2026-03" → "mar/26" */
export function monthLabel(month: string) {
  const [y, m] = month.split('-').map(Number);
  return `${MONTHS[m - 1]}/${String(y).slice(2)}`;
}

/** Avança `n` meses a partir de "AAAA-MM". */
export function addMonths(month: string, n: number) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Converte a taxa do produto: `percentOfIndex` = 100 para 100% do CDI. */
export const applyPercent = (rates: MonthlyRate[], percentOfIndex: number) =>
  rates.map((r) => ({ ...r, rate: (r.rate * percentOfIndex) / 100 }));

/**
 * Aplica hoje o valor inicial e soma `monthly` no início de cada um dos próximos
 * 12 meses, rendendo a taxa do último mês conhecido. As taxas passadas servem só
 * para a referência de rentabilidade em 12 meses.
 */
export function simulate(
  rates: MonthlyRate[],
  initial: number,
  monthly: number,
  from: Date = new Date(),
): Simulation {
  const past = [...rates].sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
  const projectionRate = past.length ? past[past.length - 1].rate : 0;
  const rate12m = (past.reduce((g, r) => g * (1 + r.rate / 100), 1) - 1) * 100;
  const start = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}`;

  let balance = initial;
  let invested = initial;
  const points: SimPoint[] = [{ index: 0, label: 'hoje', balance, invested }];
  for (let i = 1; i <= 12; i++) {
    balance = balance * (1 + projectionRate / 100) + monthly;
    invested += monthly;
    points.push({ index: i, label: monthLabel(addMonths(start, i)), balance, invested });
  }

  return { points, initial, in12: balance, investedIn12: invested, rate12m, projectionRate };
}

/** "01/10/2026" (formato do Banco Central) → "2026-10" */
export function bcbDateToMonth(date: string) {
  const [, m, y] = date.split('/');
  return `${y}-${m}`;
}
