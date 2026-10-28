// Paletas claro/escuro (+ variação para daltonismo) — espelham as variáveis CSS do protótipo.
// Use via `useTheme()`; `tokens.ts` continua valendo para telas que ainda não migraram.

export type Palette = {
  ink: string;
  bg: string;
  surface: string;
  surface2: string;
  line: string;
  muted: string;
  faint: string;
  brand: string;
  brand700: string;
  brandSoft: string;
  gold: string;
  goldInk: string;
  green600: string;
  /** Verde de destaque (barras, avisos de sucesso). */
  green: string;
  greenSoft: string;
  danger: string;
  dangerSoft: string;
  navy: string;
  /** Fundo do cartão de destaque azul ("Conversar com a Rô"). */
  feature: string;
  featureMuted: string;
  shadow: string;
};

const light: Palette = {
  ink: '#172338',
  bg: '#eceef4',
  surface: '#ffffff',
  surface2: '#f4f6fb',
  line: '#e2e6ef',
  muted: '#56637d',
  faint: '#8893a8',
  brand: '#2050d8',
  brand700: '#17409e',
  brandSoft: '#e4ebfb',
  gold: '#ffc62b',
  goldInk: '#5a3f00',
  green600: '#157a43',
  green: '#2e9e5b',
  greenSoft: '#e3f3e9',
  danger: '#d2502f',
  dangerSoft: '#fbe7e0',
  navy: '#122744',
  feature: '#1d46b4',
  featureMuted: '#d3e0f8',
  shadow: '#122744',
};

const dark: Palette = {
  ink: '#eaf0fb',
  bg: '#101828',
  surface: '#1a2338',
  surface2: '#222e46',
  line: '#2d3850',
  muted: '#9fb0ca',
  faint: '#73839d',
  brand: '#6e97ff',
  brand700: '#9ab6ff',
  brandSoft: '#1f2b4a',
  gold: '#ffc62b',
  goldInk: '#5a3f00',
  green600: '#4fc08a',
  green: '#4fc08a',
  greenSoft: '#1d3a2b',
  danger: '#ff7a5c',
  dangerSoft: '#3a241d',
  navy: '#0c1627',
  feature: '#1d3a8a',
  featureMuted: '#c6d7f6',
  shadow: '#000000',
};

// Daltonismo: troca o par verde/vermelho por azul/laranja (paleta Okabe-Ito).
const colorblindLight: Partial<Palette> = {
  green600: '#0072b2',
  green: '#0072b2',
  greenSoft: '#d7e9f5',
  danger: '#d55e00',
  dangerSoft: '#fbe6d6',
};
const colorblindDark: Partial<Palette> = {
  green600: '#4ea3e0',
  green: '#4ea3e0',
  greenSoft: '#17344a',
  danger: '#ff8c42',
  dangerSoft: '#3a271a',
};

export function getPalette(isDark: boolean, colorblind: boolean): Palette {
  const base = isDark ? dark : light;
  if (!colorblind) return base;
  return { ...base, ...(isDark ? colorblindDark : colorblindLight) };
}

export const FONT_SCALE = { small: 0.9, default: 1, large: 1.15 } as const;
export type FontSize = keyof typeof FONT_SCALE;
