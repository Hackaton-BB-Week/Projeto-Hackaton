import Svg, { Circle, Defs, G, LinearGradient, Path, Polygon, Polyline, Rect, Stop } from 'react-native-svg';

// Ilustrações da tela de boas-vindas, desenhadas em SVG a partir do protótipo HTML.

/** Plantinha minimalista do selo da marca (ícone "leaf" do protótipo). */
export function SproutIcon({ size = 24, color = '#5a3f00' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M12 21v-8" />
        <Path d="M12 13c0-3.3 2.2-5.5 5.5-5.5 0 3.3-2.2 5.5-5.5 5.5Z" />
        <Path d="M12 16c0-2.8-1.9-4.7-4.7-4.7 0 2.8 1.9 4.7 4.7 4.7Z" />
      </G>
    </Svg>
  );
}

/** Moeda dourada com "$". */
export function Coin({ size = 88 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Defs>
        <LinearGradient id="coin" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ffe79a" />
          <Stop offset="1" stopColor="#ffc62b" />
        </LinearGradient>
      </Defs>
      <Circle cx={30} cy={30} r={28} fill="url(#coin)" />
      <Path
        d="M30 15v30M37.5 21.5h-10a5 5 0 0 0 0 10h5a5 5 0 0 1 0 10h-10.5"
        stroke="#5a3f00"
        strokeWidth={4.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** Caule e folhas do girassol (a flor é separada para animar à parte). */
export function SunflowerStem({ width = 80 }: { width?: number }) {
  return (
    <Svg width={width} height={width * (60 / 68)} viewBox="-36 -58 68 60">
      <Path d="M0 0V-56" stroke="#38b06e" strokeWidth={4.5} strokeLinecap="round" />
      <Path d="M0 -30C-22 -38 -34 -28 -34 -28C-14 -22 0 -30 0 -30Z" fill="#1f9b57" />
      <Path d="M0 -38C18 -46 30 -36 30 -36C12 -30 0 -38 0 -38Z" fill="#38b06e" />
    </Svg>
  );
}

/** Miolo amarelo do girassol. */
export function SunflowerHead({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22">
      <Circle cx={11} cy={11} r={10.5} fill="#ffc62b" />
    </Svg>
  );
}

// ---------- casinha isométrica (mesma projeção da vila no protótipo) ----------
const HW = 30;
const HH = 15;
const OX = 30;
const OY = 32;
type Pt = [number, number];
const iso = (gx: number, gy: number): Pt => [OX + (gx - gy) * HW, OY + (gx + gy) * HH];
const pts = (a: Pt[]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
const up = (p: Pt, h: number): Pt => [p[0], p[1] - h];

function box(gx: number, gy: number, w: number, d: number, h: number) {
  const p1 = iso(gx, gy);
  const p2 = iso(gx + w, gy);
  const p3 = iso(gx + w, gy + d);
  const p4 = iso(gx, gy + d);
  return { p1, p2, p3, p4, t1: up(p1, h), t2: up(p2, h), t3: up(p3, h), t4: up(p4, h) };
}

export const ROOF = {
  green: ['#4f9f48', '#357d33'],
  red: ['#c9393a', '#a1282b'],
} as const;

/** Casinha da vila: paredes creme, telhado em pirâmide e porta. */
export function IsoHouse({ width = 96, roof }: { width?: number; roof: readonly [string, string] }) {
  const wall = box(0.2, 0.2, 0.6, 0.6, 17);
  const r = box(0.1, 0.1, 0.8, 0.8, 17);
  const apex: Pt = [(r.t1[0] + r.t3[0]) / 2, (r.t1[1] + r.t3[1]) / 2 - 13];
  const door = iso(0.8, 0.52);
  const sh = box(0.2, 0.2, 0.6, 0.6, 0);
  return (
    <Svg width={width} height={width * (66 / 60)} viewBox="0 0 60 66">
      <Polygon
        points={pts([sh.p1, sh.p2, sh.p3, sh.p4].map((p) => [p[0], p[1] + 3] as Pt))}
        fill="rgba(0,0,0,0.22)"
      />
      {/* paredes: esquerda (frente), direita, topo */}
      <Polygon points={pts([wall.p4, wall.p3, wall.t3, wall.t4])} fill="#f6e7c1" />
      <Polygon points={pts([wall.p2, wall.p3, wall.t3, wall.t2])} fill="#e2c48d" />
      <Rect x={door[0] - 3.5} y={door[1] - 13} width={5} height={10} rx={1} fill="#8a5a2b" />
      {/* telhado */}
      <Polygon points={pts([r.t1, r.t2, apex])} fill={roof[0]} />
      <Polygon points={pts([r.t4, r.t1, apex])} fill={roof[0]} />
      <Polygon points={pts([r.t2, r.t3, apex])} fill={roof[1]} />
      <Polygon points={pts([r.t3, r.t4, apex])} fill={roof[1]} />
      <Polyline
        points={pts([r.t4, apex, r.t2])}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={0.8}
      />
    </Svg>
  );
}

/** Degradê do fundo (azul-marinho no topo → azul no rodapé). */
export function NightGradient() {
  return (
    <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1 1">
      <Defs>
        <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0f2353" />
          <Stop offset="0.6" stopColor="#173375" />
          <Stop offset="1" stopColor="#1f4396" />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={1} height={1} fill="url(#bg)" />
    </Svg>
  );
}

/** Degradê dourado do botão principal. */
export function GoldGradient() {
  return (
    <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1 1">
      <Defs>
        <LinearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ffd861" />
          <Stop offset="1" stopColor="#ffc62b" />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={1} height={1} fill="url(#gold)" />
    </Svg>
  );
}
