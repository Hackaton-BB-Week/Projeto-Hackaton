import type { City } from '../data/cities';
import { SLAB, type Painter } from './painter';

// Chão da cidade: bloco flutuante com laterais de terra, grama xadrez e ruas.
function slab(d: Painter, c: City) {
  const b = d.iso(c.nx, 0);
  const cc = d.iso(c.nx, c.ny);
  const dd = d.iso(0, c.ny);
  d.poly([dd, cc, [cc[0], cc[1] + SLAB], [dd[0], dd[1] + SLAB]], c.soilL);
  d.poly([b, cc, [cc[0], cc[1] + SLAB], [b[0], b[1] + SLAB]], c.soilR);
  for (let gy = 0; gy < c.ny; gy++)
    for (let gx = 0; gx < c.nx; gx++) d.tile(gx, gy, (gx + gy) % 2 ? c.grassA : c.grassB);
}

function dash(d: Painter, gx1: number, gy1: number, gx2: number, gy2: number) {
  d.line(d.iso(gx1, gy1), d.iso(gx2, gy2), 'rgba(255,255,255,.5)', 1.4, '5 6');
}

function crosswalk(d: Painter, gx: number, gy: number, horiz: boolean) {
  for (let i = 0; i < 4; i++) {
    const o = i * 0.22 + 0.08;
    if (horiz) d.tileR(gx + o, gy + 0.2, 0.12, 0.6, 'rgba(255,255,255,.55)');
    else d.tileR(gx + 0.2, gy + o, 0.6, 0.12, 'rgba(255,255,255,.55)');
  }
}

function bairro(d: Painter) {
  for (let gy = 2; gy <= 4; gy++) for (let gx = 2; gx <= 4; gx++) d.tile(gx, gy, '#e7e3d2');
  const road: [number, number][] = [
    [3, 0],
    [3, 1],
    [3, 5],
    [3, 6],
    [0, 3],
    [1, 3],
    [5, 3],
    [6, 3],
  ];
  road.forEach(([gx, gy]) => d.tile(gx, gy, '#8b93a0'));
  dash(d, 3.5, 0, 3.5, 2);
  dash(d, 3.5, 5, 3.5, 7);
  dash(d, 0, 3.5, 2, 3.5);
  dash(d, 5, 3.5, 7, 3.5);
  crosswalk(d, 3, 1, false);
  crosswalk(d, 3, 5, false);
  crosswalk(d, 1, 3, true);
  crosswalk(d, 5, 3, true);
}

function orla(d: Painter) {
  for (let gy = 4; gy < 6; gy++) for (let gx = 0; gx < 6; gx++) d.tile(gx, gy, '#58c6e0');
  d.poly([d.iso(0, 4), d.iso(1.4, 4), d.iso(1.4, 4.5), d.iso(0, 4.5)], '#8fe0f2');
  d.poly([d.iso(3, 5), d.iso(4.2, 5), d.iso(4.2, 5.5), d.iso(3, 5.5)], '#8fe0f2');
  for (let gx = 0; gx < 6; gx++) d.tile(gx, 3, '#f3e2ad');
  d.tile(2, 0, '#d8c48c');
  d.tile(2, 1, '#d8c48c');
  d.tile(2, 2, '#d8c48c');
  dash(d, 2.5, 0, 2.5, 3);
}

export function drawGround(d: Painter, c: City) {
  slab(d, c);
  if (c.key === 'bairro') bairro(d);
  else orla(d);
}
