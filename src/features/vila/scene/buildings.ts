import type { Ambient, BuildingType } from '../data/cities';
import type { Painter } from './painter';

// Prédios, ruínas e enfeites da vila, portados do protótipo.
type Spot = { gx: number; gy: number };

const ROOFS: [string, string][] = [
  ['#ff6b5e', '#e0574b'],
  ['#5ec16f', '#48a258'],
  ['#5aa0ff', '#3f7fe0'],
  ['#ffb23a', '#e89524'],
];

export function treeBlock(d: Painter, gx: number, gy: number, sc = 1) {
  d.shadow(gx + 0.3, gy + 0.3, 0.4, 0.4);
  d.box(gx + 0.44, gy + 0.44, 0.12, 0.12, 9 * sc, '#9c6b3f', '#86592f', '#6e4824');
  d.box(gx + 0.28, gy + 0.28, 0.44, 0.44, 12 * sc, '#5bbf3f', '#4aa832', '#3d9029');
  d.box(gx + 0.35, gy + 0.35, 0.3, 0.3, 9 * sc, '#7ad95a', '#6bd14a', '#5bbf3f');
}

function bigTree(d: Painter, gx: number, gy: number) {
  d.shadow(gx + 0.14, gy + 0.14, 0.72, 0.72);
  d.box(gx + 0.4, gy + 0.4, 0.2, 0.2, 24, '#9c6b3f', '#86592f', '#6e4824');
  d.box(gx + 0.1, gy + 0.1, 0.8, 0.8, 20, '#54b838', '#47a030', '#3a8928');
  d.box(gx + 0.22, gy + 0.22, 0.56, 0.56, 30, '#64cc45', '#54b838', '#47a030');
  d.box(gx + 0.33, gy + 0.33, 0.34, 0.34, 37, '#7ad95a', '#64cc45', '#54b838');
}

function lamp(d: Painter, gx: number, gy: number) {
  const [x, y] = d.iso(gx + 0.5, gy + 0.5);
  d.ellipse(x, y + 2, 4, 2, 'rgba(20,34,24,.14)');
  d.rect(x - 1.4, y - 22, 2.8, 22, '#6a7486', 1);
  d.rect(x - 3, y - 26, 6, 5, '#ffd45e', 2);
}

function bench(d: Painter, gx: number, gy: number) {
  const [x, y] = d.iso(gx + 0.5, gy + 0.5);
  d.rect(x - 7, y - 4, 14, 3.4, '#b5793f', 1.4);
  d.rect(x - 7, y - 9, 14, 3, '#c98a4e', 1.4);
  d.rect(x - 6, y - 3, 2, 4, '#8a5a2b');
  d.rect(x + 4, y - 3, 2, 4, '#8a5a2b');
}

function fountain(d: Painter, gx: number, gy: number) {
  const [x, y] = d.iso(gx + 0.5, gy + 0.5);
  d.shadow(gx + 0.3, gy + 0.3, 0.4, 0.4);
  d.box(gx + 0.3, gy + 0.3, 0.4, 0.4, 4, '#dcd9c6', '#ccc8b4', '#bbb7a2');
  d.ellipse(x, y - 5, 10, 5, '#7fd0ec');
  d.ellipse(x, y - 6, 5, 2.6, '#bdeafb');
}

function palm(d: Painter, gx: number, gy: number) {
  d.shadow(gx + 0.4, gy + 0.4, 0.2, 0.2);
  d.box(gx + 0.46, gy + 0.46, 0.1, 0.1, 20, '#b9834a', '#a06f3a', '#8a5e2f');
  const [x, y] = d.iso(gx + 0.5, gy + 0.5);
  const ty = y - 20;
  d.rect(x - 14, ty - 4, 16, 7, '#4fc06a', 3, `rotate(-20 ${x - 14} ${ty - 4})`);
  d.rect(x - 2, ty - 4, 16, 7, '#4fc06a', 3, `rotate(20 ${x + 14} ${ty - 4})`);
  d.rect(x - 7, ty - 9, 14, 7, '#4fc06a', 3);
}

type Builder = (d: Painter, p: Spot, style: number) => void;

const BUILDERS: Record<BuildingType, Builder> = {
  house: (d, p, style) => {
    const [light, dark] = ROOFS[style] ?? ROOFS[0];
    d.shadow(p.gx + 0.2, p.gy + 0.2, 0.6, 0.6);
    d.box(p.gx + 0.2, p.gy + 0.2, 0.6, 0.6, 17, '#ffe6b0', '#f0cf84', '#dcb869');
    d.roofPrism(p.gx + 0.12, p.gy + 0.12, 0.76, 0.76, 17, 11, light, dark);
    const [x, y] = d.iso(p.gx + 0.74, p.gy + 0.5);
    d.rect(x - 3, y - 14, 5, 9, '#8a5a2b', 1);
  },
  apartment: (d, p) => {
    d.shadow(p.gx + 0.22, p.gy + 0.22, 0.56, 0.56);
    d.box(p.gx + 0.22, p.gy + 0.22, 0.56, 0.56, 44, '#bfe3ff', '#98c7ec', '#7cb0da');
    for (let i = 0; i < 3; i++)
      d.box(p.gx + 0.22, p.gy + 0.3, 0.56, 0.05, 34 - i * 11, '#ffffff', '#dfeefb', '#cfe2f4');
    d.box(p.gx + 0.44, p.gy + 0.28, 0.14, 0.14, 50, '#aecbe4', '#93b4d2', '#7ea3c6');
  },
  civic: (d, p) => {
    d.shadow(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68);
    d.box(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68, 24, '#f3eefb', '#dcd2ee', '#c7bbdf');
    d.roofPrism(p.gx + 0.1, p.gy + 0.1, 0.8, 0.8, 24, 9, '#c9b6ef', '#b39ce0');
    const [x, y] = d.iso(p.gx + 0.5, p.gy + 0.5);
    d.rect(x - 1, y - 46, 2, 11, '#8b93a3');
    d.rect(x + 1, y - 46, 8, 5, '#ffc62b');
  },
  shop: (d, p, style) => {
    const awning = style === 1 ? '#49c2d6' : '#ff6b5e';
    d.shadow(p.gx + 0.22, p.gy + 0.22, 0.56, 0.56);
    d.box(p.gx + 0.22, p.gy + 0.22, 0.56, 0.56, 16, '#ffd98a', '#f0c05f', '#dcab45');
    const [x, y] = d.iso(p.gx + 0.5, p.gy + 0.78);
    d.rect(x - 16, y - 9, 32, 6, awning, 2, `rotate(26 ${x} ${y})`);
  },
  market: (d, p) => {
    d.shadow(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68);
    d.box(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68, 15, '#ffe9c2', '#f2d49a', '#e2c07f');
    d.box(p.gx + 0.16, p.gy + 0.16, 0.68, 0.1, 19, '#2e9e5b', '#248049', '#1f6b3f');
    d.roofPrism(p.gx + 0.1, p.gy + 0.1, 0.8, 0.8, 19, 6, '#8aa0b5', '#6f8599');
  },
  sport: (d, p) => {
    d.shadow(p.gx + 0.18, p.gy + 0.18, 0.64, 0.64);
    d.box(p.gx + 0.18, p.gy + 0.18, 0.64, 0.64, 4, '#7ec98a', '#6ab877', '#5aa667');
    const [x, y] = d.iso(p.gx + 0.5, p.gy + 0.5);
    d.circle(x, y - 4, 7, 'none', '#fff', 1.4);
    d.line([x, y - 11], [x, y + 3], '#fff', 1.2);
  },
  garden: (d, p) => {
    d.shadow(p.gx + 0.2, p.gy + 0.2, 0.6, 0.6);
    d.box(p.gx + 0.2, p.gy + 0.2, 0.6, 0.6, 3, '#8fd888', '#7cc876', '#6ab767');
    const [x, y] = d.iso(p.gx + 0.5, p.gy + 0.5);
    const flowers = ['#ff6f91', '#ffd45e', '#9b6dff', '#ff914d', '#4fc06a'];
    flowers.forEach((c, i) => d.circle(x - 16 + i * 8, y - 8 - (i % 2) * 4, 3, c));
  },
  park: (d, p) => {
    d.shadow(p.gx + 0.1, p.gy + 0.1, 0.8, 0.8);
    d.box(p.gx + 0.1, p.gy + 0.1, 0.8, 0.8, 2, '#9fd89a', '#8cc985', '#79b873');
    treeBlock(d, p.gx + 0.02, p.gy + 0.08, 0.9);
    treeBlock(d, p.gx + 0.42, p.gy + 0.44, 0.75);
  },
  trees: (d, p) => {
    treeBlock(d, p.gx + 0.08, p.gy + 0.08, 1);
    treeBlock(d, p.gx + 0.48, p.gy + 0.46, 0.8);
  },
  beach: (d, p, style) => {
    const [light, dark] = style === 1 ? ['#ff9a52', '#e07a2e'] : ['#49c2d6', '#2f9bad'];
    d.shadow(p.gx + 0.2, p.gy + 0.2, 0.6, 0.6);
    d.box(p.gx + 0.2, p.gy + 0.2, 0.6, 0.6, 16, '#fff4e2', '#f0e0c2', '#dccba6');
    d.roofPrism(p.gx + 0.12, p.gy + 0.12, 0.76, 0.76, 16, 10, light, dark);
  },
  kiosk: (d, p) => {
    d.shadow(p.gx + 0.26, p.gy + 0.26, 0.48, 0.48);
    d.box(p.gx + 0.26, p.gy + 0.26, 0.48, 0.48, 13, '#ffe6a6', '#f3cd84', '#e4bb6a');
    d.roofPrism(p.gx + 0.2, p.gy + 0.2, 0.6, 0.6, 13, 7, '#ff8f6b', '#e0674a');
  },
  pier: (d, p) => {
    d.shadow(p.gx + 0.1, p.gy + 0.35, 0.8, 0.3);
    d.box(p.gx + 0.1, p.gy + 0.35, 0.8, 0.3, 6, '#d8a86a', '#bd8f4f', '#a37b3f');
    d.box(p.gx + 0.74, p.gy + 0.3, 0.2, 0.4, 14, '#f0dca8', '#dcc488', '#c6ad70');
  },
  plaza: (d, p) => {
    d.shadow(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68);
    d.box(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68, 3, '#eceadb', '#dcd9c6', '#ccc8b4');
    fountain(d, p.gx + 0.2, p.gy + 0.2);
    bench(d, p.gx + 0.72, p.gy + 0.22);
  },
  palm: (d, p) => palm(d, p.gx, p.gy),
};

export function drawBuilding(d: Painter, type: BuildingType, spot: Spot, style: number) {
  BUILDERS[type](d, spot, style);
}

/** Lote ainda não construído: escombros cinza. */
export function drawRuin(d: Painter, p: Spot) {
  d.shadow(p.gx + 0.3, p.gy + 0.3, 0.4, 0.4);
  d.box(p.gx + 0.3, p.gy + 0.3, 0.4, 0.4, 4, '#c3c7d0', '#aab0bc', '#949bab');
  const [x, y] = d.iso(p.gx + 0.5, p.gy + 0.5);
  d.rect(x - 5, y - 9, 2, 5, '#949bab');
  d.rect(x + 2, y - 7, 2, 3, '#aab0bc');
}

export function drawAmbient(d: Painter, a: Ambient) {
  if (a.type === 'tree') treeBlock(d, a.gx + 0.15, a.gy + 0.15, a.sc ?? 1);
  else if (a.type === 'bigtree') bigTree(d, a.gx, a.gy);
  else if (a.type === 'lamp') lamp(d, a.gx, a.gy);
  else if (a.type === 'bench') bench(d, a.gx, a.gy);
  else if (a.type === 'palm') palm(d, a.gx, a.gy);
}
