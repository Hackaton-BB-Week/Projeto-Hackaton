// Paletas claro/escuro (+ variação para daltonismo) — espelham as variáveis CSS do protótipo.
// Use via `useTheme()`; `tokens.ts` continua valendo para telas que ainda não migraram.

export type Palette = {
  ink: string;
  bg: string;
  surface: string;
  surface2: string;
  /** Divisores e bordas decorativas (pode ser bem suave). */
  line: string;
  /** Borda de campos de texto: precisa de 3:1 com o fundo (WCAG 1.4.11). */
  inputBorder: string;
  muted: string;
  /** Texto de apoio (avisos, rodapés, placeholder). Mantém 4,5:1 sobre surface/bg. */
  faint: string;
  brand: string;
  brand700: string;
  brandSoft: string;
  gold: string;
  /** Topo do degradê dos botões amarelos. */
  gold2: string;
  goldInk: string;
  /** Degradê do botão de conclusão (registrar dia): topo → base. Texto branco (AA). */
  success: string;
  success2: string;
  green600: string;
  /** Verde de destaque (barras, avisos de sucesso). */
  green: string;
  greenSoft: string;
  /** Vermelho para texto e borda. */
  danger: string;
  dangerSoft: string;
  /** Fundo vermelho de botões e barras com texto branco (4,5:1 nos dois temas). */
  dangerStrong: string;
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
  inputBorder: '#848ea3',
  muted: '#56637d',
  faint: '#5f6b84',
  brand: '#2050d8',
  brand700: '#17409e',
  brandSoft: '#e4ebfb',
  gold: '#ffc62b',
  gold2: '#ffd861',
  goldInk: '#5a3f00',
  success: '#146c3c',
  success2: '#23874e',
  green600: '#157a43',
  green: '#2e9e5b',
  greenSoft: '#e3f3e9',
  danger: '#b8401f',
  dangerSoft: '#fbe7e0',
  dangerStrong: '#b8401f',
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
  inputBorder: '#6b7994',
  muted: '#9fb0ca',
  faint: '#8a99b2',
  brand: '#6e97ff',
  brand700: '#9ab6ff',
  brandSoft: '#1f2b4a',
  gold: '#ffc62b',
  gold2: '#ffd861',
  goldInk: '#5a3f00',
  success: '#146c3c',
  success2: '#23874e',
  green600: '#4fc08a',
  green: '#4fc08a',
  greenSoft: '#1d3a2b',
  danger: '#ff7a5c',
  dangerSoft: '#3a241d',
  dangerStrong: '#c43d1f',
  navy: '#0c1627',
  feature: '#1d3a8a',
  featureMuted: '#c6d7f6',
  shadow: '#000000',
};

// Daltonismo: troca o par verde/vermelho por azul/laranja (paleta Okabe-Ito).
const colorblindLight: Partial<Palette> = {
  success: '#005a8f',
  success2: '#1c75b8',
  green600: '#0072b2',
  green: '#0072b2',
  greenSoft: '#d7e9f5',
  danger: '#a34600',
  dangerSoft: '#fbe6d6',
  dangerStrong: '#a34600',
};
const colorblindDark: Partial<Palette> = {
  success: '#005a8f',
  success2: '#1c75b8',
  green600: '#4ea3e0',
  green: '#4ea3e0',
  greenSoft: '#17344a',
  danger: '#ff8c42',
  dangerSoft: '#3a271a',
  dangerStrong: '#b84f00',
};

export function getPalette(isDark: boolean, colorblind: boolean): Palette {
  const base = isDark ? dark : light;
  if (!colorblind) return base;
  return { ...base, ...(isDark ? colorblindDark : colorblindLight) };
}

export const FONT_SCALE = { small: 0.9, default: 1, large: 1.15 } as const;
export type FontSize = keyof typeof FONT_SCALE;
