// 'lf11a', staging c2sc · C₂ slide, a variant of the picked c2s (anim/c2-stack.ts): "side by side, bigger" (captions
// C2S, anim/beats-c2s.ts; brief C2S_BRIEF.md, 30 Oct 2026). One fixed framing; one thing moves at a time.
// - Top band: the photorespiration slide's strip (dk2-common.ts sceneSvg, at 0.79 as in c2s), shortened to RuBisCO →
//   2-PG → glycine, played once in beat 2: RuBP and O₂ into RuBisCO, 3-PGA and the toxic 2-PG out, the 2-PG through
//   PLGG1 and the peroxisome to glycine, which waits on the strip's glycine arrow. Flanking it, the 2 light micrographs
//   (Khoshravesh et al. 2016, J. Exp. Bot., Fig. 1, CC BY 3.0), C₃ left and C₂ right, each labelled (vein, bundle
//   sheath, mesophyll; C₃ the air space; C₂ the chloroplasts and mitochondria packed on the vein side), each with a lens.
// - Below: 2 large magnifiers side by side at the same scale (the same chloroplast and mitochondrion sizes), drawn in
//   the strip's look (bilayers, RuBisCO PDB 8RUC).
//   - C₃: a mesophyll cell, its mitochondrion near the wall to the air space, chloroplasts along the walls.
//   - C₂: the mesophyll, the wall with a plasmodesma, the bundle-sheath cell with its mitochondria in a row on the
//     vein-side wall and its chloroplasts packed in front of them, the vein.
// - Beat 3 (C₃ only): the glycine goes into the mitochondrion; 4 CO₂ characters (slide 19's, labelled) come out one by
//   one and bounce (seeded random walks, smooth and eased): 1 is caught by a chloroplast (flash at RuBisCO, strained),
//   3 cross the wall into the air space (glad). Beat 4 (C₂ only): the glycine through the plasmodesma into a
//   vein-side mitochondrion; its 4 CO₂ bounce between the wall and the chloroplasts: 3 caught, the last slips out
//   through a gap. Under each magnifier its pill; then the question, centred between them (anim/player.ts).
// No enzyme names (lecturer, 30 Oct 2026): the mitochondria release CO₂ from glycine.
import steJpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import homJpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { atomBall, row } from '../figs/carbon-form';
import { arrow, balls, bilayer } from '../figs/cell-schema';
import { bilayerE, flashDefs, kidG, T, tangents } from './co2-kit';
import {
  attrSetter, camTf, clamp01, curve, ease, f, frame, gasPath, glide, lerpV, litOf, mixLit, moverSvg, placer, sceneSvg, SP,
  Strip, uNear, type Cam, type LitMap, type Mover, type Path, type Put, type V,
} from './dk2-common';
import { C2S } from './beats-c2s';
import type { Staging } from './types';

const P = 'c2sc';
const R = 11, ST = 2.15 * R;

/* ---------------------------------------------------------------- glyphs (dk-rf6.ts / c2-stack.ts, unchanged) */

const bond = (x0: number, x1: number): string => `<path d="M${f(x0)},0H${f(x1)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>`;
const c2G = (k: string): string => `<ellipse data-k="${k}G" rx="44" ry="26" fill="url(#${P}-red)" opacity="0"/>`
  + `<g data-k="${k}P">${bond(0, ST)}${atomBall(ST, 0, 'P', R)}</g><g data-k="${k}N" opacity="0">${bond(0, ST)}${atomBall(ST, 0, 'N', R)}</g>`
  + `${row(-ST / 2, 0, 'CC', { r: R })}`;
const glyG = `${bond(0, ST)}${atomBall(ST, 0, 'N', R)}${row(-ST / 2, 0, 'CC', { r: R })}`;
const o2B = `<g class="chn-g">${balls(0, 0, 'OO')}</g>`;

const MOV: Mover[] = [
  { k: 'rb', svg: row(0, 0, 'PCCCCCP', { r: R }), label: 'RuBP', at: [-92, 6], anchor: 'end' },
  { k: 'o2', svg: o2B, label: 'O₂', at: [0, -22] },
  { k: 'xp', svg: row(0, 0, 'CCCP', { r: R }) },
  { k: 'pg', svg: c2G('pg') },
];

/* ---------------------------------------------------------------- the band: the strip window and the 2 photos */

/** The strip from RuBisCO to the peroxisome, at 0.81, in the window x 372–1218, y 8–270 (strip x 200–1250, y 92–417). */
const WIN = { x: 372, y: 8, w: 846, h: 262 };
const CAM: Cam = frame(210, 1240, 380, 1210, 92, 8);
const G = CAM.s;
const toStage = (q: V): V => [800 + (q[0] - CAM.c[0]) * G, 370 + (q[1] - CAM.c[1]) * G];

const PG_AT: V = [SP.pg2[0] + 34, SP.pg2[1]];
const XP_AT: V = SP.oxyPga;
const GLY0: V = [SP.pg2[0] + 36, SP.pg2[1] + 2], GLY1: V = [606, 352];
const GOX_AT: V = [SP.gox[0] - 22, SP.gox[1] - 8];
/** Where the glycine waits: on the strip's glycine arrow, just out of the peroxisome. */
const GW: V = [1138, 118];
const P_RB = curve([[SP.rubp[0], SP.rubp[1] + 40], SP.rubp, SP.rubpFrom, SP.rubpTo]);
const P_O2 = gasPath('o2', 110);
const P_XP = curve([[SP.oxyPgaTo[0] - 5, SP.oxyPgaTo[1] + 24], SP.oxyPgaTo, XP_AT]);
const P_PG = curve([SP.oxyFrom, SP.oxyTo, PG_AT]);
const RUN = curve([PG_AT, lerpV(GLY0, GLY1, 0.5), [690, 380], [760, 370], [818, 374], [880, 336], [934, 296], [982, 254], GOX_AT,
  [1084, 186], [1112, 150], GW]);
const U_GOX = uNear(RUN, GOX_AT);
/** Beat 2's times (s). */
const T2 = { rb: [0.4, 1.0], o2: [1.2, 1.2], ox: 2.5, xp: [2.6, 0.8], pg: [2.8, 1.0], tox: 3.8, run: [4.8, 4.0] } as const;

/** The photos: 352 × 260 at the band's ends (photo units 1000 × 740). */
const PK = 0.352, PW = 1000 * PK, PH = 740 * PK, PY = 8;
interface Photo { x: number; href: string; ring: [number, number, number, number]; lens: V; lr: number }
const PH3: Photo = { x: 8, href: steJpg, ring: [478, 360, 305, 345], lens: [842, 362], lr: 56 };
const PH2: Photo = { x: 1240, href: homJpg, ring: [488, 414, 294, 240], lens: [440, 262], lr: 100 };
const ph = (p: Photo, q: V): V => [p.x + q[0] * PK, PY + q[1] * PK];

/* ---------------------------------------------------------------- the magnifiers (stage units; rel. to the centre) */

const RM = 194, M3: V = [214, 478], M2: V = [1386, 478];
const at = (c: V, q: V): V => [c[0] + q[0], c[1] + q[1]];
/** The same organelle sizes in both: chloroplast 72 × 40 (+ envelope), mitochondrion 38 × 26. */
const CPA = 36, CPB = 20, MTA = 22, MTB = 15;

/** C₃: the plasma membrane and wall (horizontal) between the cell (above) and the air space (below). */
const W3 = { pm: 58, w0: 64, w1: 80 };
const MT3: V = [-4, 32];
const CP3: V[] = [[-112, 30], [104, 30], [52, -110]];
/** C₂: the mesophyll (above), the wall with the plasmodesma, the bundle-sheath cell, its vein-side wall, the vein. */
const W2 = { pmM: -104, w0: -98, w1: -84, pmB: -78, pd: -90, pmV: 108, v0: 114, v1: 130 };
const CP2X = [-150, -100, -50, 50, 100, 150], CP2Y = -12;
const MT2X = [-132, -88, -44, 0, 44, 88, 132], MT2Y = 88;

const cls = (s: string): string => `class="${s}"`;
const lab = (c: V, q: V, s: string, a: 'start' | 'middle' | 'end' = 'middle', k = ''): string =>
  T(c[0] + q[0], c[1] + q[1], s, 'co2k-il cel-halo', a, k ? ` data-k="${k}" opacity="0"` : '');
/** A chloroplast in the strip's look: stroma, 2 grana, the double envelope (2 bilayers), RuBisCO inside. */
function cpS(p: V, rx: number, ry: number): string {
  const lying = rx > ry, gw = lying ? 16 : 14;
  const gr = (gx: number, gy: number): string => [0, 1, 2].map(k => `<rect class="cel-lumen" x="${f(gx - gw / 2)}" y="${f(gy + k * 5.5 - 7)}" width="${gw}" height="3.6" rx="1.8" style="stroke:#9fbf6e;stroke-width:.9"/>`).join('');
  const g1: V = lying ? [p[0] - rx * 0.62, p[1]] : [p[0], p[1] - ry * 0.62], g2: V = lying ? [p[0] + rx * 0.62, p[1]] : [p[0], p[1] + ry * 0.62];
  const w = 30, h = (w * 471) / 548;
  return `<ellipse class="co2k-strm" cx="${f(p[0])}" cy="${f(p[1])}" rx="${rx}" ry="${ry}"/>${gr(g1[0], g1[1])}${gr(g2[0], g2[1])}
    ${bilayerE(p[0], p[1], rx, ry, 2.6)}${bilayerE(p[0], p[1], rx + 6, ry + 6, 2.6)}
    <image href="${rubPng}" x="${f(p[0] - w / 2)}" y="${f(p[1] - h / 2)}" width="${w}" height="${f(h)}"/>`;
}
/** A mitochondrion in the strip's look: matrix, outer bilayer, cristae. */
function mtS(p: V): string {
  const cr = [-9, 0, 9].map((x, i) => `M${f(p[0] + x)},${f(p[1] + (i % 2 ? -MTB + 4 : MTB - 4))}v${i % 2 ? 11 : -11}`).join('');
  return `<ellipse class="cel-matrix" cx="${f(p[0])}" cy="${f(p[1])}" rx="${MTA}" ry="${MTB}"/>${bilayerE(p[0], p[1], MTA, MTB, 2.6)}
    <path class="co2k-crista" d="${cr}"/>`;
}
const hBand = (c: V, y0: number, y1: number, k: string): string => `<rect class="${k}" x="${c[0] - RM}" y="${f(c[1] + y0)}" width="${2 * RM}" height="${f(y1 - y0)}"/>`;
/** Wall fibres along a horizontal wall from y0 (rel). */
const fibH = (c: V, y0: number, skip: (x: number) => boolean = () => false): string => Array.from({ length: 16 }, (_, i) => {
  const x = -RM + 8 + i * 25;
  return skip(x + 7) ? '' : `<path class="co2k-fib" d="M${f(c[0] + x)},${f(c[1] + y0 + 4 + (i % 3) * 3)}q7,-4 14,0t14,0"/>`;
}).join('');
const pmH = (c: V, y: number, x0 = -RM, x1 = RM): string => bilayer([{ L: [c[0] + x0, c[1] + y, c[0] + x1, c[1] + y] }], 5, 1.4, 3.8);

function mag3(): string {
  const c = M3;
  return `${hBand(c, -RM, W3.w0, 'co2k-cyt')}${hBand(c, W3.w0, W3.w1, 'co2k-wallb')}${hBand(c, W3.w1, RM, 'co2k-ias')}
    ${fibH(c, W3.w0)}${pmH(c, W3.pm)}
    ${CP3.map((q, i) => cpS(at(c, q), CPA, CPB) + (i === 0 ? `<g data-k="${P}-fl3">${flashAt(at(c, q))}</g>` : '')).join('')}${mtS(at(c, MT3))}`;
}
function mag2(): string {
  const c = M2, h = 9, x = W2.pd;
  const pd = `<rect class="co2k-cyt" x="${f(c[0] + x - h)}" y="${f(c[1] + W2.pmM - 1)}" width="${2 * h}" height="${f(W2.pmB - W2.pmM + 2)}"/>
    ${bilayer([{ L: [c[0] + x - h, c[1] + W2.pmM - 4, c[0] + x - h, c[1] + W2.pmB + 4] }], 4, 1.3, 3.6)}${bilayer([{ L: [c[0] + x + h, c[1] + W2.pmM - 4, c[0] + x + h, c[1] + W2.pmB + 4] }], 4, 1.3, 3.6)}
    <path d="M${f(c[0] + x)},${f(c[1] + W2.pmM - 4)}V${f(c[1] + W2.pmB + 4)}" style="stroke:#b9a27a;stroke-width:2.4;stroke-dasharray:2 3;fill:none"/>`;
  const pms = pmH(c, W2.pmM, -RM, x - h - 4) + pmH(c, W2.pmM, x + h + 4, RM) + pmH(c, W2.pmB, -RM, x - h - 4) + pmH(c, W2.pmB, x + h + 4, RM);
  // the vein: a few of its cells under the vein-side wall
  const vein = [[-96, 168, 58, 40], [-30, 160, 60, 46], [38, 164, 56, 42], [100, 170, 50, 34]].map(([vx, vy, w, hh]) =>
    `<rect class="co2k-phl" x="${f(c[0] + vx - w / 2)}" y="${f(c[1] + vy - hh / 2)}" width="${w}" height="${hh}" rx="10"/>`).join('');
  return `${hBand(c, -RM, W2.w0, 'co2k-cyt')}${hBand(c, W2.w0, W2.w1, 'co2k-wallb')}${hBand(c, W2.w1, W2.v0, 'co2k-cyt')}
    ${hBand(c, W2.v0, W2.v1, 'co2k-wallb')}<rect x="${c[0] - RM}" y="${c[1] + W2.v1}" width="${2 * RM}" height="${RM - W2.v1}" style="fill:#f1eee6"/>${vein}
    ${fibH(c, W2.w0, xx => Math.abs(xx - x) < 16)}${fibH(c, W2.v0)}${pms}${pd}${pmH(c, W2.pmV)}
    ${CP2X.map(cx => cpS(at(c, [cx, CP2Y]), CPB, CPA)).join('')}
    ${[0, 1, 2].map(i => `<g data-k="${P}-fl2${i}">${flashAt(at(c, [CAUGHT2[i], CP2Y]))}</g>`).join('')}
    ${MT2X.map(mx => mtS(at(c, [mx, MT2Y]))).join('')}`;
}
const flashAt = (p: V): string => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="30" fill="url(#${P}-flash)" opacity="0"/>`;

function magnifier(k: string, c: V, lens: V, lr: number, inner: string): string {
  return `<g data-k="${P}-${k}l" opacity="0"><path class="co2k-tan" d="${tangents(lens, lr, c, RM)}"/><circle class="co2k-lens" cx="${f(lens[0])}" cy="${f(lens[1])}" r="${f(lr)}"/></g>
    <g data-k="${P}-${k}" opacity="0"><clipPath id="${P}-${k}c"><circle cx="${c[0]}" cy="${c[1]}" r="${RM}"/></clipPath>
    <circle class="co2k-inbg" cx="${c[0]}" cy="${c[1]}" r="${RM}"/><g clip-path="url(#${P}-${k}c)">${inner}</g><circle class="co2k-inring" cx="${c[0]}" cy="${c[1]}" r="${RM}"/></g>`;
}
/** The magnifiers' labels (each part named). */
function magLabels(): string {
  const c3 = M3, c2 = M2;
  const l3 = `${lab(c3, [-80, -108], 'mesophyll cell')}${lab(c3, [CP3[2][0], CP3[2][1] - 48], 'chloroplast')}${lab(c3, [CP3[2][0], CP3[2][1] - 32], 'with RuBisCO')}
    ${lab(c3, [MT3[0], MT3[1] - 22], 'mitochondrion')}${lab(c3, [132, 77], 'cell wall')}${lab(c3, [132, 120], 'air space')}`;
  const l2 = `${lab(c2, [86, -138], 'mesophyll')}${lab(c2, [W2.pd + 14, -112], 'plasmodesma', 'start')}
    ${lab(c2, [-96, -58], 'chloroplasts')}${lab(c2, [98, -58], 'bundle-sheath cell')}
    ${lab(c2, [0, 176], 'vein')}${lab(c2, [56, 127], 'mitochondria')}`;
  return `<g data-k="${P}-ml3" opacity="0">${l3}</g><g data-k="${P}-ml2" opacity="0">${l2}</g>`;
}

/* ---------------------------------------------------------------- the CO₂ characters' walks (seeded, smooth) */

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** A bouncing walk from a: n turns inside the box [x0, x1, y0, y1] (rel), alternately near its top and its bottom
 *  (each turn a bump off a wall or a chloroplast), x stepping by up to ±dx. */
function bounce(seed: number, a: V, n: number, box: [number, number, number, number], dx: number, topFirst = true): V[] {
  const r = rng(seed), out: V[] = [a];
  let x = a[0];
  for (let i = 0; i < n; i++) {
    x = Math.max(box[0], Math.min(box[1], x + (r() * 2 - 1) * dx));
    const top = (i % 2 === 0) === topFirst;
    out.push([x, top ? box[2] + r() * 5 : box[3] - r() * 5]);
  }
  return out;
}
interface Walk { c: V; path: Path; t0: number; d: number; fate: 'esc' | 'caught' | 'leak'; seed?: number }
const mk = (c: V, q: V[], t0: number, d: number, fate: Walk['fate']): Walk => ({ c, path: curve(q.map(p => at(c, p))), t0, d, fate });

/** C₃: the 4 CO₂ leave the mitochondrion one after another (one moves at a time); B is caught by the left chloroplast,
 *  A, C, D reach the air space. */
const OUT3: V = [MT3[0], MT3[1] - 20];
const BOX3: [number, number, number, number] = [-56, 44, -30, 40];
const T3 = { gly: [0.4, 2.8] } as const;
const WALK3: Walk[] = [
  mk(M3, [...bounce(31, OUT3, 3, BOX3, 46), [24, 70], [44, 100], [62, 124]], 4.0, 1.5, 'esc'),
  mk(M3, [...bounce(7, OUT3, 3, BOX3, 46, false), [-62, 10], [-90, 24], CP3[0]], 5.8, 1.5, 'caught'),
  mk(M3, [...bounce(12, OUT3, 2, BOX3, 46), [-36, 66], [-50, 104], [-40, 134]], 7.6, 1.5, 'esc'),
  mk(M3, [...bounce(44, OUT3, 3, BOX3, 40, false), [0, 70], [-70, 100], [-128, 112]], 9.4, 1.5, 'esc'),
];
/** C₂: the chloroplasts that catch A, B, C; D slips out through the gap between the middle 2, last. */
const CAUGHT2 = [-100, 100, -150];
const BOX2: [number, number, number, number] = [-150, 150, 40, 64];
const T4 = { gly: [0.4, 3.2] } as const;
const WALK2: Walk[] = [
  mk(M2, [...bounce(5, [-88, 62], 4, BOX2, 70), [CAUGHT2[0], 34], [CAUGHT2[0], CP2Y]], 4.4, 1.9, 'caught'),
  mk(M2, [...bounce(23, [44, 62], 4, BOX2, 80, false), [CAUGHT2[1], 34], [CAUGHT2[1], CP2Y]], 6.6, 1.9, 'caught'),
  mk(M2, [...bounce(17, [-44, 62], 4, BOX2, 80), [CAUGHT2[2], 34], [CAUGHT2[2], CP2Y]], 8.8, 1.9, 'caught'),
  mk(M2, [...bounce(61, [0, 62], 5, [-120, 120, 40, 64], 80, false), [0, 46], [0, 0], [6, -50], [10, -91], [8, -128], [0, -150]], 11.0, 2.8, 'leak'),
];
const tEnd = (w: Walk): number => w.t0 + w.d;

/* ---------------------------------------------------------------- the glycine's way from the strip into each magnifier */

const GWs = toStage(GW), FORK: V = [1229, 290];
const TRUNK: V[] = [GWs, [1188, 50], [1220, 110], [1229, 190], [1229, 262], FORK];
const A3: V[] = [[1180, 298], [800, 298], [520, 298], [468, 318], [450, 370], [438, 418], at(M3, [190, -40])];
const IN3: V[] = [at(M3, [110, -40]), at(M3, [44, -14]), at(M3, [MT3[0] + 10, MT3[1] - 12])];
const A2: V[] = [[1238, 314], at(M2, [-140, -128]), at(M2, [-112, -120]), at(M2, [W2.pd, W2.pmM - 12])];
const IN2: V[] = [at(M2, [W2.pd, W2.pmB + 10]), at(M2, [-50, -64]), at(M2, [-6, -36]), at(M2, [0, -6]), at(M2, [0, 40]), at(M2, [0, MT2Y - 8])];
const G3: Path = curve([...TRUNK, ...A3, ...IN3]);
const G2: Path = curve([...TRUNK, ...A2, ...IN2]);

/* ---------------------------------------------------------------- the stage */

const hudMover = (k: string, g: string, name: string, ny: number): string =>
  `<g data-k="m-${k}" opacity="0"><g transform="scale(${f(G)})">${g}<text class="cel-mn cel-halo" x="0" y="${ny}" text-anchor="middle">${name}</text></g></g>`;
function photo(k: string, p: Photo): string {
  const [cx, cy] = ph(p, [p.ring[0], p.ring[1]]);
  return `<image href="${p.href}" x="${p.x}" y="${PY}" width="${f(PW)}" height="${f(PH)}" preserveAspectRatio="none"/>
    <rect x="${p.x}" y="${PY}" width="${f(PW)}" height="${f(PH)}" style="fill:none;stroke:#bdb9ad;stroke-width:1"/>
    <g data-k="${P}-bs${k}" opacity="0"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(p.ring[2] * PK)}" ry="${f(p.ring[3] * PK)}" style="fill:none;stroke:#2f6f5f;stroke-width:2;stroke-dasharray:6 4"/></g>`;
}
/** A name on a photo (photo units), keyed for its fade. */
const onPh = (p: Photo, q: V, s: string, k: string, a: 'start' | 'middle' | 'end' = 'middle'): string => {
  const [x, y] = ph(p, q);
  return T(x, y, s, 'co2k-zl cel-halo', a, ` data-k="${k}" opacity="0" style="font-size:15px"`);
};
function photoNames(): string {
  const lead = (p: Photo, a: V, b: V, k: string): string => { const [x0, y0] = ph(p, a), [x1, y1] = ph(p, b); return `<path data-k="${k}" opacity="0" class="co2k-ld" d="M${f(x0)},${f(y0)}L${f(x1)},${f(y1)}"/>`; };
  return `${onPh(PH3, [478, 436], 'vein', `${P}-n3v`)}${onPh(PH3, [478, 690], 'bundle sheath', `${P}-n3b`)}
    ${onPh(PH3, [850, 70], 'mesophyll', `${P}-n3m`)}${onPh(PH3, [878, 520], 'air space', `${P}-n3a`)}
    ${onPh(PH2, [500, 432], 'vein', `${P}-n2v`)}${onPh(PH2, [250, 610], 'bundle sheath', `${P}-n2b`)}
    ${onPh(PH2, [850, 250], 'mesophyll', `${P}-n2m`)}
    ${lead(PH2, [640, 560], [585, 478], `${P}-n2cl`)}${onPh(PH2, [770, 590], 'chloroplasts +', `${P}-n2c`)}${onPh(PH2, [770, 640], 'mitochondria', `${P}-n2c2`)}`;
}

/** The pills under the magnifiers (their fate) and the credits. */
const pill = (k: string, x: number, w: number, s: string, fill: string, stroke: string, ink: string): string =>
  `<g data-k="${P}-${k}" opacity="0"><rect x="${f(x - w / 2)}" y="681" width="${w}" height="34" rx="17" style="fill:${fill};stroke:${stroke};stroke-width:1.4"/>
    ${T(x, 705, s, '', 'middle', ` style="font-size:20px;font-weight:700;fill:${ink}"`)}</g>`;

function hudSvg(): string {
  const defs = `<defs><radialGradient id="${P}-red"><stop offset="0" class="dk2-red0"/><stop offset=".6" class="dk2-red1"/><stop offset="1" class="dk2-red2"/></radialGradient>${flashDefs(P)}</defs>`;
  const L3 = ph(PH3, PH3.lens), L2 = ph(PH2, PH2.lens);
  const arm3 = arrow([...TRUNK, ...A3, IN3[0]], 'pr', { thin: true }), arm2 = arrow([...TRUNK, ...A2], 'pr', { thin: true });
  const kids = ['3a', '3b', '3c', '3d', '2a', '2b', '2c', '2d'].map(k => kidG(`${P}-k${k}`, 8)).join('');
  return `${defs}${photo('3', PH3)}${photo('2', PH2)}${photoNames()}
    ${T(PH3.x + 10, PY + 26, 'C₃ leaf', 'co2k-zl cel-halo', 'start', ' style="font-size:22px"')}${T(PH2.x + PW - 10, PY + 26, 'C₂ leaf', 'co2k-zl cel-halo', 'end', ' style="font-size:22px"')}
    ${magnifier('m3', M3, L3, PH3.lr * PK, mag3())}${magnifier('m2', M2, L2, PH2.lr * PK, mag2())}${magLabels()}
    <g class="chn-off">${arm3}${arm2}</g>
    <g data-k="${P}-f3" opacity="0">${arm3}</g><g data-k="${P}-f2" opacity="0">${arm2}</g>
    ${hudMover('g3', glyG, 'glycine', -26)}${hudMover('g2', glyG, 'glycine', -26)}${kids}
    ${pill('p3', M3[0], 300, 'C₃: about 1 in 4 recaptured', '#f8e9e0', '#dcae97', '#a8401c')}
    ${pill('p2', M2[0], 366, 'C₂: most recaptured, a little leaks', '#e1eee8', '#9cc2b3', '#2b6a59')}
    ${T(8, 734, '<tspan font-style="italic">Steinchisma laxum</tspan> (C₃), <tspan font-style="italic">Homolepis aturensis</tspan> (C₂): Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0)', 'co2k-cr', 'start')}
    ${T(1592, 734, 'RuBisCO: PDB 8RUC', 'co2k-cr', 'end')}`;
}

/* ---------------------------------------------------------------- lighting (the strip) */

const L_O0: LitMap = litOf(['rubisco', 'o2']), L_O: LitMap = { ...L_O0, oxy: 1 };
const L_R: LitMap = { ...litOf(['rubisco', 'o2', 'oxy'], 0.35), 'glycolate:flow': 1, 'glycolate:body': 1, 'perox:mem': 1, 'perox-name': 1, 'glycine:flow': 1 };
const L_E: LitMap = { ...Object.fromEntries(Object.keys(L_R).map(k => [k, 0.3])), 'glycine:flow': 0.6 };
function lit(beat: number, t: number): LitMap {
  if (beat === 0) return {};
  if (beat === 1) {
    if (t < T2.ox - 0.1) return mixLit({}, L_O0, ease(t, 0.1, 0.6));
    if (t < T2.run[0] - 0.1) return mixLit(L_O0, L_O, ease(t, T2.ox - 0.1, T2.ox + 0.3));
    return mixLit(L_O, L_R, ease(t, T2.run[0] - 0.1, T2.run[0] + 0.4));
  }
  return beat === 2 ? mixLit(L_R, L_E, ease(t, 0, 0.5)) : L_E;
}
/** The strip's names (strip units): [text, x, y, from (beat 2, s), to (99: kept), class]. */
const NAMES: Array<[string, number, number, number, number, string?]> = [
  ['3-PGA', SP.oxyPga[0] + 80, SP.oxyPga[1] + 6, 3.1, 99],
  ['2-PG', SP.pg2[0] + 66, SP.pg2[1] - 32, 3.5, T2.run[0]],
  ['toxic', SP.pg2[0] + 44, SP.pg2[1] + 62, T2.tox, T2.run[0], 'dk2-toxic'],
  ['glycine', GW[0] + 44, GW[1] + 6, T2.run[0] + T2.run[1] - 0.2, 99],
];

/* ---------------------------------------------------------------- the script */

interface Kid { at: V; o: number; s?: number; h?: number }
function kidOf(w: Walk, t: number, region: 'c3' | 'c2'): Kid | undefined {
  if (t < w.t0 - 0.3) return undefined;
  const q = w.path(ease(t, w.t0, tEnd(w))), rel: V = [q[0] - w.c[0], q[1] - w.c[1]];
  const o = ease(t, w.t0 - 0.3, w.t0);
  if (w.fate === 'caught') return { at: q, o, s: ease(t, tEnd(w) - 0.1, tEnd(w) + 0.4) };
  // glad once past the wall: C₃ into the air space (below), C₂ out of the bundle sheath (above)
  const h = region === 'c3' ? clamp01((rel[1] - W3.w1) / 24) : clamp01((W2.w0 - rel[1]) / 24);
  return { at: q, o, h };
}
function script(beat: number, t: number): { pos: Record<string, Put>; att: Record<string, number>; kid: Record<string, Kid> } {
  const pos: Record<string, Put> = {}, att: Record<string, number> = {}, kid: Record<string, Kid> = {};
  const g = (p: Path, s: readonly [number, number]): V => glide(p, t, s[0], s[1]);
  if (beat === 1) {
    pos.rb = { at: g(P_RB, T2.rb), o: ease(t, 0.2, 0.5) * (1 - ease(t, 2.4, 2.7)) };
    pos.o2 = { at: g(P_O2, T2.o2), o: ease(t, 1.0, 1.3) * (1 - ease(t, 2.4, 2.7)) };
    pos.xp = { at: g(P_XP, T2.xp), o: ease(t, 2.5, 2.8) };
    const u = ease(t, T2.run[0], T2.run[0] + T2.run[1]);
    pos.pg = { at: t < T2.run[0] ? g(P_PG, T2.pg) : RUN(u), o: ease(t, 2.7, 3.0) };
    att.pgP = 1 - ease(t, T2.run[0], T2.run[0] + 0.4);
    att.pgN = ease(u, U_GOX - 0.03, U_GOX + 0.03);
    att.pgG = ease(t, T2.tox, T2.tox + 0.5) * (1 - ease(t, T2.run[0], T2.run[0] + 0.4));
  }
  if (beat >= 2) pos.xp = { at: XP_AT, o: 1 - 0.6 * (beat === 2 ? ease(t, 0, 0.5) : 1) };
  // C₃: the glycine (taking over from the strip's, in place) into the mesophyll mitochondrion; its 4 CO₂ bounce out
  if (beat === 2) {
    pos.g3 = { at: glide(G3, t, T3.gly[0], T3.gly[1]), o: 1 - ease(t, T3.gly[0] + T3.gly[1] + 0.05, T3.gly[0] + T3.gly[1] + 0.3) };
  }
  if (beat >= 2) WALK3.forEach((w, i) => { const q = kidOf(w, beat === 2 ? t : 99, 'c3'); if (q) kid[`3${'abcd'[i]}`] = q; });
  // C₂: the glycine through the plasmodesma into a vein-side mitochondrion; its 4 CO₂ bounce in the trap
  if (beat === 3) {
    pos.g2 = { at: glide(G2, t, T4.gly[0], T4.gly[1]), o: ease(t, 0, 0.3) * (1 - ease(t, T4.gly[0] + T4.gly[1] + 0.05, T4.gly[0] + T4.gly[1] + 0.3)) };
    WALK2.forEach((w, i) => { const q = kidOf(w, t, 'c2'); if (q) kid[`2${'abcd'[i]}`] = q; });
  }
  return { pos, att, kid };
}

export const STAGING: Staging = {
  id: 'c2sc',
  name: 'c2sc · Side by side, bigger',
  note: 'The photorespiration strip (RuBisCO → 2-PG → glycine) in a top band between the 2 labelled micrographs; below, 2 large magnifiers side by side at the same scale: C₃ (a mesophyll cell, its mitochondrion near the air space) and C₂ (the bundle-sheath mitochondria on the vein-side wall, chloroplasts packed in front, the plasmodesma, the mesophyll); 4 labelled CO₂ bounce out of the mitochondria: C₃ 1 caught, 3 escape; C₂ 3 caught, 1 leaks; a pill under each, then the question between them',
  beats: C2S,
  holds: [[1.9], [4.6], [3.6], [4.0]],
  keys: [
    { beat: 3, text: 'What if the leaf pumped CO₂', x: 800, y: 660, size: 44 },
    { beat: 3, text: 'into the bundle sheath directly?', x: 800, y: 708, size: 44 },
  ],
  svg: () => {
    const names = NAMES.map(([s, x, y, , , c], i) => `<text data-k="${P}-nm${i}" class="${c ?? 'cel-mn'} cel-halo" x="${x}" y="${y}" text-anchor="${s === 'glycine' ? 'start' : 'middle'}" opacity="0">${s}</text>`).join('');
    const scene = sceneSvg(P, { over: names, movers: MOV.map(moverSvg).join('') });
    return `<defs><clipPath id="${P}-win"><rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}" rx="14"/></clipPath></defs>
      <g clip-path="url(#${P}-win)">${scene}</g>
      <rect x="${WIN.x + 0.6}" y="${WIN.y + 0.6}" width="${WIN.w - 1.2}" height="${WIN.h - 1.2}" rx="14" style="fill:none;stroke:#d8d5cb;stroke-width:1.2"/>
      <g class="dk1 fig dk2 co2k">${hudSvg()}</g>`;
  },
  bind(stage) {
    const S = new Strip(stage);
    S.retag('perox', 'text', el => !!el.textContent?.includes('peroxisome'), 'perox-name');
    for (const p of ['o2', 'pg2', 'glycine', 'serine', 'co2-out', 'glycolate', 'glycerate', 'nh3']) { S.hide(p, 'node'); S.hide(p, 'text'); }
    S.hide('perox', 'node'); S.hide('perox', 'text'); S.hide('mito', 'text');
    (stage.querySelector('[data-k="cam"]') as SVGGElement).setAttribute('transform', camTf(CAM));
    const put = placer(stage, [...MOV.map(m => m.k), 'g3', 'g2']), A = attrSetter(stage);
    const flash = (k: string, tf: number, t: number): void => {
      const el = stage.querySelector(`[data-k="${k}"] circle`);
      if (el) el.setAttribute('opacity', f(ease(t, tf - 0.15, tf) * (1 - ease(t, tf + 0.1, tf + 0.6))));
    };
    return (beat, t) => {
      S.light(lit(beat, t));
      const { pos, att, kid } = script(beat, t);
      put(pos);
      for (const k of ['3a', '3b', '3c', '3d', '2a', '2b', '2c', '2d']) {
        const q = kid[k], key = `${P}-k${k}`, o = q ? q.o : 0;
        A(key, 'display', o < 0.004 ? 'none' : 'inline'); A(key, 'opacity', o);
        if (!q || o < 0.004) continue;
        const s = q.s ?? 0, h = q.h ?? 0;
        A(key, 'transform', `translate(${f(q.at[0])} ${f(q.at[1])})`);
        A(`${key}-fn`, 'opacity', Math.max(0, 1 - s - h)); A(`${key}-fs`, 'opacity', s); A(`${key}-fh`, 'opacity', h);
        A(`${key}-sw`, 'opacity', 0); A(`${key}-sh`, 'opacity', 0); A(`${key}-l`, 'opacity', 1);
      }
      for (const [k, v] of Object.entries(att)) A(k, 'opacity', v);
      NAMES.forEach(([s, , , t0, t1], i) => A(`${P}-nm${i}`, 'opacity', beat === 1 ? ease(t, t0, t0 + 0.4) * (t1 === 99 ? 1 : 1 - ease(t, t1, t1 + 0.4))
        : beat === 2 && t1 === 99 && s !== 'glycine' ? 1 - ease(t, 0, 0.4) : 0));
      // beat 1: the bundle sheath ringed and named, the vein, the mesophyll, the air space, the chloroplasts and
      // mitochondria; then (after the hold) the lenses, the magnifiers and their labels
      const on = (t0: number): number => (beat > 0 ? 1 : ease(t, t0, t0 + 0.4));
      for (const k of ['3', '2']) { A(`${P}-bs${k}`, 'opacity', on(0.2)); A(`${P}-n${k}b`, 'opacity', on(0.2)); A(`${P}-n${k}v`, 'opacity', on(0.6)); A(`${P}-n${k}m`, 'opacity', on(1.0)); }
      A(`${P}-n3a`, 'opacity', on(1.3)); for (const k of ['n2c', 'n2c2', 'n2cl']) A(`${P}-${k}`, 'opacity', on(1.3));
      for (const k of ['m3l', 'm2l']) A(`${P}-${k}`, 'opacity', on(2.1));
      for (const k of ['m3', 'm2']) A(`${P}-${k}`, 'opacity', on(2.5));
      for (const k of ['ml3', 'ml2']) A(`${P}-${k}`, 'opacity', on(3.0));
      // the arm of the path that plays is lit
      A(`${P}-f3`, 'opacity', beat === 2 ? ease(t, 0, 0.4) : beat === 3 ? 1 - 0.5 * ease(t, 0, 0.4) : 0);
      A(`${P}-f2`, 'opacity', beat === 3 ? ease(t, 0, 0.4) : 0);
      // the catches: a flash at RuBisCO
      const t3 = beat === 2 ? t : beat > 2 ? 99 : -9, t4 = beat === 3 ? t : -9;
      flash(`${P}-fl3`, tEnd(WALK3[1]), t3);
      [0, 1, 2].forEach(i => flash(`${P}-fl2${i}`, tEnd(WALK2[i]), t4));
      // the pills: each after its walks
      A(`${P}-p3`, 'opacity', beat === 2 ? ease(t, tEnd(WALK3[3]) + 0.3, tEnd(WALK3[3]) + 0.8) : beat === 3 ? 1 : 0);
      A(`${P}-p2`, 'opacity', beat === 3 ? ease(t, tEnd(WALK2[3]) + 0.3, tEnd(WALK2[3]) + 0.8) : 0);
    };
  },
};
