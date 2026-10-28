// Regras puras do Painel financeiro (sem React, fáceis de testar).

/** Estimativa do que deixou de ir para apostas: gasto diário x dias sem apostar. */
export function estimatedNotBet(weeklySpend: number, totalDays: number): number {
  return (weeklySpend / 7) * totalDays;
}

/** Progresso da meta em % inteiro (0–100). Sem meta, retorna 0. */
export function goalProgress(saved: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((saved / goal) * 100));
}

export type BarTone = 'notBet' | 'saved' | 'losses' | 'goal';

export interface ComparisonBar {
  key: BarTone;
  label: string;
  value: number;
  /** Largura relativa ao maior valor, em % (0–100). */
  percent: number;
}

/** Monta as barras do comparativo, normalizadas pelo maior valor. */
export function buildComparison(v: {
  notBet: number;
  saved: number;
  losses: number;
  goal: number;
}): ComparisonBar[] {
  const max = Math.max(v.notBet, v.saved, v.losses, v.goal, 1);
  const pct = (n: number) => Math.min(100, (n / max) * 100);
  return [
    { key: 'notBet', label: 'Deixou de apostar', value: v.notBet, percent: pct(v.notBet) },
    { key: 'saved', label: 'Guardado de fato', value: v.saved, percent: pct(v.saved) },
    { key: 'losses', label: 'Perdas estimadas', value: v.losses, percent: pct(v.losses) },
    { key: 'goal', label: 'Meta financeira', value: v.goal, percent: pct(v.goal) },
  ];
}

/**
 * Converte o texto digitado em reais inteiros não negativos.
 * Aceita "1.200", "1200", "R$ 50", "50,90" (centavos são descartados).
 * Retorna null quando não há número nenhum.
 */
export function parseMoneyInput(text: string): number | null {
  const intPart = text.split(',')[0];
  const digits = intPart.replace(/\D/g, '');
  if (!digits) return null;
  return Math.min(Number(digits), 10_000_000);
}
