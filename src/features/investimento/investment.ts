// Regras puras da simulação de investimentos (sem React, fáceis de testar).
// Tudo é estimativa educativa: rentabilidade bruta, sem IR, taxas ou garantia.

/** Taxa de um mês, em % ao mês (ex.: 1.08 = 1,08% a.m.). */
export interface MonthlyRate {
  /** Primeiro dia do mês, "AAAA-MM". */
  month: string;
  rate: number;
}

export interface SimPoint {
  /** 1..12 = meses passados, 13..24 = projeção. */
  index: number;
  label: string;
  balance: number;
  invested: number;
  projected: boolean;
}

export interface Simulation {
  points: SimPoint[];
  /** Saldo hoje, se tivesse aplicado nos últimos 12 meses. */
  today: number;
  investedToday: number;
  /** Saldo estimado daqui a 12 meses (continuando os aportes). */
  in12: number;
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
 * Simula aportes mensais iguais: 12 meses passados com as taxas reais e 12 meses
 * de projeção repetindo a taxa do último mês. Aporte no início de cada mês.
 */
export function simulate(rates: MonthlyRate[], monthly: number): Simulation {
  const past = [...rates].sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
  const projectionRate = past.length ? past[past.length - 1].rate : 0;
  const points: SimPoint[] = [];
  let balance = 0;
  let invested = 0;
  let growth = 1;

  past.forEach((r, i) => {
    invested += monthly;
    balance = (balance + monthly) * (1 + r.rate / 100);
    growth *= 1 + r.rate / 100;
    points.push({ index: i + 1, label: monthLabel(r.month), balance, invested, projected: false });
  });
  const today = balance;
  const investedToday = invested;

  const last = past.length ? past[past.length - 1].month : '2000-01';
  for (let i = 1; i <= 12; i++) {
    invested += monthly;
    balance = (balance + monthly) * (1 + projectionRate / 100);
    points.push({
      index: past.length + i,
      label: monthLabel(addMonths(last, i)),
      balance,
      invested,
      projected: true,
    });
  }

  return {
    points,
    today,
    investedToday,
    in12: balance,
    investedIn12: invested,
    rate12m: (growth - 1) * 100,
    projectionRate,
  };
}

/** "01/10/2026" (formato do Banco Central) → "2026-10" */
export function bcbDateToMonth(date: string) {
  const [, m, y] = date.split('/');
  return `${y}-${m}`;
}
