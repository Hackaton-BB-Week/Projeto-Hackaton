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

/** Árvore em blocos: tronco no chão, copa apoiada no tronco e uma camada menor por cima. */
// A copa começa acima de ~5 de altura para o tronco aparecer embaixo dela (o canto da
// frente da copa fica 4,8 abaixo do canto da frente do tronco, por causa da perspectiva).
export function treeBlock(d: Painter, gx: number, gy: number, sc = 1, z = 0) {
  if (z === 0) d.shadow(gx + 0.3, gy + 0.3, 0.4, 0.4);
  d.box(gx + 0.44, gy + 0.44, 0.12, 0.12, 12 * sc, '#9c6b3f', '#86592f', '#6e4824', z);
  d.box(gx + 0.28, gy + 0.28, 0.44, 0.44, 8 * sc, '#5bbf3f', '#4aa832', '#3d9029', z + 10 * sc);
  d.box(gx + 0.35, gy + 0.35, 0.3, 0.3, 6 * sc, '#7ad95a', '#6bd14a', '#5bbf3f', z + 17 * sc);
}

function bigTree(d: Painter, gx: number, gy: number) {
  d.shadow(gx + 0.14, gy + 0.14, 0.72, 0.72);
  d.box(gx + 0.4, gy + 0.4, 0.2, 0.2, 16, '#9c6b3f', '#86592f', '#6e4824');
  d.box(gx + 0.1, gy + 0.1, 0.8, 0.8, 10, '#54b838', '#47a030', '#3a8928', 14);
  d.box(gx + 0.22, gy + 0.22, 0.56, 0.56, 8, '#64cc45', '#54b838', '#47a030', 24);
  d.box(gx + 0.33, gy + 0.33, 0.34, 0.34, 6, '#7ad95a', '#64cc45', '#54b838', 32);
}

function lamp(d: Painter, gx: number, gy: number) {
  const [x, y] = d.iso(gx + 0.5, gy + 0.5);
  d.ellipse(x + 3, y, 4, 2, 'rgba(20,34,24,.14)');
  d.rect(x - 1.4, y - 22, 2.8, 22, '#6a7486', 1);
  d.rect(x - 3, y - 26, 6, 5, '#ffd45e', 2);
}

// Banco em blocos isométricos: encosto (atrás), pés e assento, todos encostados.
function bench(d: Painter, gx: number, gy: number, z = 0) {
  d.box(gx + 0.3, gy + 0.4, 0.4, 0.05, 6, '#c98a4e', '#b5793f', '#8a5a2b', z + 3);
  d.box(gx + 0.32, gy + 0.47, 0.04, 0.08, 3, '#8a5a2b', '#7a4f25', '#6a441f', z);
  d.box(gx + 0.64, gy + 0.47, 0.04, 0.08, 3, '#8a5a2b', '#7a4f25', '#6a441f', z);
  d.box(gx + 0.3, gy + 0.45, 0.4, 0.14, 1.5, '#c98a4e', '#b5793f', '#9a6430', z + 3);
}

function fountain(d: Painter, gx: number, gy: number, z = 0) {
  const [x, yGround] = d.iso(gx + 0.5, gy + 0.5);
  const y = yGround - z;
  if (z === 0) d.shadow(gx + 0.3, gy + 0.3, 0.4, 0.4);
  d.box(gx + 0.3, gy + 0.3, 0.4, 0.4, 4, '#dcd9c6', '#ccc8b4', '#bbb7a2', z);
  // A água cabe dentro da borda de pedra (o losango do topo tem 12 x 6 de meia largura/altura).
  d.ellipse(x, y - 5, 8, 4, '#7fd0ec');
  d.ellipse(x, y - 5.5, 4, 2, '#bdeafb');
}

function palm(d: Painter, gx: number, gy: number) {
  d.shadow(gx + 0.4, gy + 0.4, 0.2, 0.2);
  d.box(gx + 0.46, gy + 0.46, 0.1, 0.1, 20, '#b9834a', '#a06f3a', '#8a5e2f');
  const [x, y] = d.iso(gx + 0.5, gy + 0.5);
  const ty = y - 20;
  d.rect(x - 14, ty - 4, 16, 7, '#4fc06a', 3, `rotate(-20 ${x - 14} ${ty - 4})`);
  d.rect(x - 2, ty - 4, 16, 7, '#4fc06a', 3, `rotate(20 ${x + 14} ${ty - 4})`);
  d.rect(x - 7, ty - 7, 14, 7, '#4fc06a', 3);
}

type Builder = (d: Painter, p: Spot, style: number) => void;

const BUILDERS: Record<BuildingType, Builder> = {
  house: (d, p, style) => {
    const [light, dark] = ROOFS[style] ?? ROOFS[0];
    d.shadow(p.gx + 0.2, p.gy + 0.2, 0.6, 0.6);
    d.box(p.gx + 0.2, p.gy + 0.2, 0.6, 0.6, 17, '#ffe6b0', '#f0cf84', '#dcb869');
    d.faceRight(p.gx + 0.8, p.gy + 0.43, p.gy + 0.57, 0, 10, '#8a5a2b');
    d.roofPrism(p.gx + 0.12, p.gy + 0.12, 0.76, 0.76, 17, 11, light, dark);
  },
  apartment: (d, p) => {
    d.shadow(p.gx + 0.22, p.gy + 0.22, 0.56, 0.56);
    d.box(p.gx + 0.22, p.gy + 0.22, 0.56, 0.56, 44, '#bfe3ff', '#98c7ec', '#7cb0da');
    for (let i = 0; i < 3; i++) {
      const z = 8 + i * 11;
      d.faceLeft(p.gy + 0.78, p.gx + 0.27, p.gx + 0.73, z, z + 5, '#ffffff');
      d.faceRight(p.gx + 0.78, p.gy + 0.27, p.gy + 0.73, z, z + 5, '#dfeefb');
    }
    d.box(p.gx + 0.44, p.gy + 0.28, 0.14, 0.14, 6, '#aecbe4', '#93b4d2', '#7ea3c6', 44);
  },
  civic: (d, p) => {
    d.shadow(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68);
    d.box(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68, 24, '#f3eefb', '#dcd2ee', '#c7bbdf');
    d.roofPrism(p.gx + 0.1, p.gy + 0.1, 0.8, 0.8, 24, 9, '#c9b6ef', '#b39ce0');
    const [x, y] = d.iso(p.gx + 0.5, p.gy + 0.5);
    d.rect(x - 1, y - 46, 2, 13, '#8b93a3');
    d.rect(x + 1, y - 46, 8, 5, '#ffc62b');
  },
  shop: (d, p, style) => {
    const awning = style === 1 ? '#49c2d6' : '#ff6b5e';
    d.shadow(p.gx + 0.22, p.gy + 0.22, 0.56, 0.56);
    d.box(p.gx + 0.22, p.gy + 0.22, 0.56, 0.56, 16, '#ffd98a', '#f0c05f', '#dcab45');
    const at = (gx: number, gy: number, z: number): [number, number] => {
      const [x, y] = d.iso(gx, gy);
      return [x, y - z];
    };
    d.poly(
      [
        at(p.gx + 0.24, p.gy + 0.78, 13),
        at(p.gx + 0.76, p.gy + 0.78, 13),
        at(p.gx + 0.76, p.gy + 0.93, 8),
        at(p.gx + 0.24, p.gy + 0.93, 8),
      ],
      awning,
    );
  },
  market: (d, p) => {
    d.shadow(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68);
    d.box(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68, 15, '#ffe9c2', '#f2d49a', '#e2c07f');
    d.box(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68, 4, '#2e9e5b', '#248049', '#1f6b3f', 11);
    d.roofPrism(p.gx + 0.1, p.gy + 0.1, 0.8, 0.8, 15, 6, '#8aa0b5', '#6f8599');
  },
  sport: (d, p) => {
    d.shadow(p.gx + 0.18, p.gy + 0.18, 0.64, 0.64);
    d.box(p.gx + 0.18, p.gy + 0.18, 0.64, 0.64, 4, '#7ec98a', '#6ab877', '#5aa667');
    const on = (gx: number, gy: number): [number, number] => {
      const [x, y] = d.iso(gx, gy);
      return [x, y - 4];
    };
    const [x, y] = on(p.gx + 0.5, p.gy + 0.5);
    d.ellipse(x, y, 9, 4.5, 'none', '#fff', 1.4);
    d.line(on(p.gx + 0.5, p.gy + 0.2), on(p.gx + 0.5, p.gy + 0.8), '#fff', 1.2);
  },
  garden: (d, p) => {
    d.shadow(p.gx + 0.2, p.gy + 0.2, 0.6, 0.6);
    d.box(p.gx + 0.2, p.gy + 0.2, 0.6, 0.6, 3, '#8fd888', '#7cc876', '#6ab767');
    const flowers: [number, number, string][] = [
      [0.35, 0.35, '#ff6f91'],
      [0.65, 0.35, '#ffd45e'],
      [0.5, 0.5, '#9b6dff'],
      [0.35, 0.65, '#ff914d'],
      [0.65, 0.65, '#4fc06a'],
    ];
    flowers.forEach(([fx, fy, c]) => {
      const [x, y] = d.iso(p.gx + fx, p.gy + fy);
      d.circle(x, y - 6, 3, c);
    });
  },
  park: (d, p) => {
    d.shadow(p.gx + 0.1, p.gy + 0.1, 0.8, 0.8);
    d.box(p.gx + 0.1, p.gy + 0.1, 0.8, 0.8, 2, '#9fd89a', '#8cc985', '#79b873');
    treeBlock(d, p.gx + 0.02, p.gy + 0.08, 0.9, 2);
    treeBlock(d, p.gx + 0.42, p.gy + 0.44, 0.75, 2);
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
  // Píer: deck de madeira saindo da areia (atrás) para o mar, apoiado em estacas,
  // com um poste de amarração na ponta.
  pier: (d, p) => {
    for (const ey of [0.12, 0.48, 0.84])
      for (const ex of [0.37, 0.59])
        d.box(p.gx + ex, p.gy + ey, 0.04, 0.04, 1.5, '#a37b3f', '#8a6534', '#6e4f27');
    d.box(p.gx + 0.35, p.gy - 0.05, 0.3, 0.97, 1.5, '#d8a86a', '#bd8f4f', '#a37b3f', 1.5);
    d.box(p.gx + 0.46, p.gy + 0.8, 0.08, 0.08, 4, '#8a6534', '#7a5a2e', '#6e4f27', 3);
  },
  plaza: (d, p) => {
    d.shadow(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68);
    d.box(p.gx + 0.16, p.gy + 0.16, 0.68, 0.68, 3, '#eceadb', '#dcd9c6', '#ccc8b4');
    // Fonte no centro e banco na ponta da frente, os dois apoiados na praça (3 de altura).
    fountain(d, p.gx, p.gy, 3);
    bench(d, p.gx + 0.24, p.gy + 0.24, 3);
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
