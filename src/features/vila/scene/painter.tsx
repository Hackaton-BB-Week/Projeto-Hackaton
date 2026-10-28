import type { ReactElement } from 'react';
import { Circle, Ellipse, Line, Polygon, Polyline, Rect } from 'react-native-svg';

// Desenho isométrico da vila, portado do protótipo. Cada célula da grade (gx, gy)
// vira um losango de 2*HW x 2*HH; `box` desenha um bloco com topo e duas laterais.
export const HW = 30;
export const HH = 15;
export const SLAB = 18;

export type Pt = [number, number];

const pts = (a: Pt[]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

export class Painter {
  els: ReactElement[] = [];
  private n = 0;

  constructor(
    private ox: number,
    private oy: number,
  ) {}

  private key() {
    return `e${this.n++}`;
  }

  iso(gx: number, gy: number): Pt {
    return [this.ox + (gx - gy) * HW, this.oy + (gx + gy) * HH];
  }

  poly(a: Pt[], fill: string) {
    this.els.push(<Polygon key={this.key()} points={pts(a)} fill={fill} />);
  }

  rect(
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string,
    rx = 0,
    transform?: string,
  ) {
    this.els.push(
      <Rect
        key={this.key()}
        x={x}
        y={y}
        width={width}
        height={height}
        rx={rx}
        fill={fill}
        transform={transform}
      />,
    );
  }

  ellipse(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    fill: string,
    stroke?: string,
    strokeWidth?: number,
  ) {
    this.els.push(
      <Ellipse
        key={this.key()}
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />,
    );
  }

  circle(cx: number, cy: number, r: number, fill: string, stroke?: string, strokeWidth?: number) {
    this.els.push(
      <Circle
        key={this.key()}
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />,
    );
  }

  line(a: Pt, b: Pt, stroke: string, strokeWidth: number, dash?: string) {
    this.els.push(
      <Line
        key={this.key()}
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
      />,
    );
  }

  box(
    gx: number,
    gy: number,
    w: number,
    d: number,
    h: number,
    top: string,
    left: string,
    right: string,
    z = 0,
  ) {
    // z: altura da base do bloco (0 = no chão). Permite empilhar copas, andares e detalhes.
    const lift = (p: Pt, dz: number): Pt => [p[0], p[1] - dz];
    const p1 = lift(this.iso(gx, gy), z);
    const p2 = lift(this.iso(gx + w, gy), z);
    const p3 = lift(this.iso(gx + w, gy + d), z);
    const p4 = lift(this.iso(gx, gy + d), z);
    const up = (p: Pt): Pt => lift(p, h);
    const [t1, t2, t3, t4] = [up(p1), up(p2), up(p3), up(p4)];
    this.poly([p4, p3, t3, t4], left);
    this.poly([p2, p3, t3, t2], right);
    this.poly([t1, t2, t3, t4], top);
    this.els.push(
      <Polyline
        key={this.key()}
        points={pts([t4, t1, t2])}
        fill="none"
        stroke="rgba(255,255,255,.3)"
        strokeWidth={1.1}
      />,
    );
  }

  roofPrism(
    gx: number,
    gy: number,
    w: number,
    d: number,
    bh: number,
    rh: number,
    light: string,
    dark: string,
  ) {
    const up = (p: Pt): Pt => [p[0], p[1] - bh];
    const t1 = up(this.iso(gx, gy));
    const t2 = up(this.iso(gx + w, gy));
    const t3 = up(this.iso(gx + w, gy + d));
    const t4 = up(this.iso(gx, gy + d));
    const ap: Pt = [(t1[0] + t3[0]) / 2, (t1[1] + t3[1]) / 2 - rh];
    this.poly([t1, t2, ap], light);
    this.poly([t4, t1, ap], light);
    this.poly([t2, t3, ap], dark);
    this.poly([t3, t4, ap], dark);
  }

  /** Retângulo colado na parede da frente-esquerda (plano gy fixo), entre as alturas z1 e z2. */
  faceLeft(gy: number, gx1: number, gx2: number, z1: number, z2: number, fill: string) {
    const at = (gx: number, z: number): Pt => {
      const p = this.iso(gx, gy);
      return [p[0], p[1] - z];
    };
    this.poly([at(gx1, z1), at(gx2, z1), at(gx2, z2), at(gx1, z2)], fill);
  }

  /** Retângulo colado na parede da frente-direita (plano gx fixo), entre as alturas z1 e z2. */
  faceRight(gx: number, gy1: number, gy2: number, z1: number, z2: number, fill: string) {
    const at = (gy: number, z: number): Pt => {
      const p = this.iso(gx, gy);
      return [p[0], p[1] - z];
    };
    this.poly([at(gy1, z1), at(gy2, z1), at(gy2, z2), at(gy1, z2)], fill);
  }

  /** Sombra no chão, projetada para a direita (sol vindo da esquerda). Fica rente à base,
   *  então o objeto parece apoiado; uma sombra deslocada para baixo dava ideia de flutuar. */
  shadow(gx: number, gy: number, w: number, d: number) {
    const sx = gx + 0.14;
    const sy = gy - 0.14;
    this.poly(
      [this.iso(sx, sy), this.iso(sx + w, sy), this.iso(sx + w, sy + d), this.iso(sx, sy + d)],
      'rgba(20,34,24,.15)',
    );
  }

  tileR(gx: number, gy: number, w: number, d: number, fill: string) {
    this.poly(
      [this.iso(gx, gy), this.iso(gx + w, gy), this.iso(gx + w, gy + d), this.iso(gx, gy + d)],
      fill,
    );
  }

  tile(gx: number, gy: number, fill: string) {
    this.tileR(gx, gy, 1, 1, fill);
  }
}
