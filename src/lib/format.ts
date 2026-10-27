const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

export const formatBRL = (v: number) => brl.format(Math.round(v));
export const formatCoins = (n: number) => Math.round(n).toLocaleString('pt-BR');
