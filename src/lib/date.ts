const pad = (n: number) => String(n).padStart(2, '0');

/** Dia do calendário local, ex.: "2026-10-28". Vira à meia-noite no horário do aparelho. */
export function dayKey(date: Date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
