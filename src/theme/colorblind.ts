// Filtro de cor do "Modo para daltonismo" para desenhos (vila, planta).
// Para quem confunde vermelho e verde (o tipo mais comum): vermelhos viram
// laranja-avermelhado e verdes viram verde-azulado, como na paleta Okabe-Ito.
// A claridade de cada cor é mantida, então a cena continua com volume e sombras.

export type Tint = (color: string) => string;

export const noTint: Tint = (c) => c;

function hexToHsl(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let hue =
    max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  hue *= 60;
  return [hue, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
}

const cache = new Map<string, string>();

/** Converte uma cor para a versão amigável ao daltonismo. Cores não-hex passam direto. */
export const colorblindTint: Tint = (color) => {
  const hit = cache.get(color);
  if (hit) return hit;
  const hsl = hexToHsl(color);
  let out = color;
  // Só mexe em cores com saturação de verdade (cinzas e brancos ficam iguais).
  if (hsl && hsl[1] > 0.18) {
    const [h, s, l] = hsl;
    if (h >= 330 || h < 18) {
      out = hslToHex(22, s, l); // vermelho → laranja-avermelhado (vermillion)
    } else if (h >= 70 && h < 170) {
      out = hslToHex(172 + (h - 70) * 0.12, s, l); // verde → verde-azulado
    }
  }
  cache.set(color, out);
  return out;
};

export const tintFor = (colorblind: boolean): Tint => (colorblind ? colorblindTint : noTint);
