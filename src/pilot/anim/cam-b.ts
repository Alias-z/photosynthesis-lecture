// 'lf13', staging camb · CAM slide: C₃ against CAM in the style of the picked C₂ animation c2sb (anim/c2s-b.ts; lecturer,
// 30 Oct 2026: "compare each type with C₃ on its own slide ... show how CO₂ gets trapped, similar to the C₂ slide").
// - The picked layout: the RuBisCO strip on the left (dk2-common.ts sceneSvg; only RuBisCO's 2 reactions are lit, when
//   they matter), 2 stacked panels on the right, C₃ and CAM, each a real micrograph with a lens and a round magnifier.
//   C₃: Steinchisma laxum (Khoshravesh et al. 2016, J. Exp. Bot., CC BY 3.0), the lens on a mesophyll cell by an air
//   space. CAM: a succulent leaf cut through a stoma (Berkshire Community College Bioscience Image Library, CC0), the
//   lens on the stoma.
// - Both magnifiers draw the same thing, so they compare: the outside air, the epidermis with a stoma (2 guard cells
//   that open and close), the air space, one mesophyll cell (wall, plasma membrane, a chloroplast with RuBisCO, PDB 8RUC,
//   the vacuole). The CAM cell adds PEPC (PDB 3ZGE) and the vacuole's malic acid, drawn as a fill level.
// - Slide 19's CO₂ characters (co2-kit.ts kidG, each labelled "CO₂"), each on a fixed, seeded bouncing walk; one moves
//   at a time. Water leaves as the deck's H₂O glyph (co2-kit.ts h2oG), labelled.
// - Beats: 1 the parts named on the photos, then the magnifiers; 2 C₃ by day: CO₂ in, H₂O out through the open stoma |
//   a hot, dry day: the stoma closes | RuBisCO takes up O₂ (the strip's oxygenation lit, an O₂ to RuBisCO);
//   3 CAM at night (moon): the stoma opens | 3 CO₂ in, each fixed by PEPC, the vacuole's acid rising, 1 H₂O out;
//   4 CAM by day (sun): the stoma shuts | the acid falls, releasing 3 CO₂ that bounce in the cell, one against the shut
//   stoma, and crowd round RuBisCO | RuBisCO fixes them one by one (the strip's carboxylation lit); the question.
import steJpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import sucJpg from '../../assets/photos/c13-cam-succulent.jpg';
import pepcPng from '../../assets/rf/pepc-3zge.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { bilayerE, bilayerH, clamp, flashDefs, flashG, h2oG, kidG, lerp, o2G, sunG, T, tangents, type Anchor } from './co2-kit';
import { attrSetter, camTf, cardSvg, curve, ease, f, frame, litOf, mixLit, sceneSvg, Strip, type Cam, type LitMap, type Path, type V } from './dk2-common';
import type { Beat, Cite, Staging } from './types';

const P = 'camb';

/* ---------------------------------------------------------------- captions */

const KHOSH16: Cite = { label: 'Khoshravesh et al. 2016, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erw150' };
const SAGE12: Cite = { label: 'Sage, Sage & Kocacinar 2012, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' };
const WS22: Cite = { label: 'Winter & Smith 2022, New Phytol.', url: 'https://doi.org/10.1111/nph.17790' };
const SIL10: Cite = { label: 'Silvera et al. 2010, Funct. Plant Biol.', url: 'https://doi.org/10.1071/FP10084' };
// the next slide is now the lecturer's research on night opening (lecturer, 30 Oct 2026, late: "move my research right after CAM")
const Q = 'Do only CAM plants open their stomata at night?';

const BEATS: Beat[] = [
  {
    tag: 'C₃ and CAM leaves', say: 'A C₃ grass leaf and a CAM succulent leaf, each with one mesophyll cell magnified under a stoma.', cite: [KHOSH16, WS22],
    steps: [
      { tag: 'C₃ and CAM leaves', say: 'A C₃ grass leaf, cut across a vein, and a CAM succulent leaf, cut through a stoma.' },
      { tag: 'One cell under a stoma', say: 'In both, CO₂ enters through a stoma into the air space and reaches RuBisCO in the chloroplasts of a mesophyll cell. In the CAM cell a large vacuole fills most of the cell.' },
    ],
  },
  {
    tag: 'C₃ by day', say: 'A C₃ leaf takes in CO₂ by day, so its stomata must stay open, and water vapour leaves through them.', cite: [SAGE12],
    steps: [
      { tag: 'C₃ by day', say: 'A C₃ leaf takes in CO₂ by day, so its stomata must stay open, and water vapour leaves through them.' },
      { tag: 'A hot, dry day', say: 'On a hot, dry day the stomata close to save water.' },
      { tag: 'Less CO₂, more O₂', say: 'Then CO₂ in the leaf falls, and RuBisCO takes up more O₂.' },
    ],
  },
  {
    tag: 'CAM at night', say: 'At night the stomata open, and PEPC stores CO₂ as malic acid in the vacuole.', cite: [WS22],
    steps: [
      { tag: 'Night: stomata open', say: 'At night the stomata open; the cool night air draws little water from the leaf.' },
      { tag: 'CO₂ stored as malic acid', say: 'PEPC fixes CO₂ (as bicarbonate) into a 4-carbon acid, stored as malic acid in the vacuole: the vacuole’s acid rises through the night.' },
    ],
  },
  {
    tag: 'CAM by day', say: 'By day the stomata are shut; the malic acid releases CO₂, trapped round RuBisCO.', cite: [WS22, SIL10],
    steps: [
      { tag: 'Day: stomata shut', say: 'By day the stomata are shut.' },
      { tag: 'CO₂ trapped', say: 'Malic acid leaves the vacuole and releases CO₂ inside the cell. Behind the closed stomata it cannot escape, and it builds up around RuBisCO in the chloroplasts.' },
      { tag: 'RuBisCO in high CO₂', say: `In high CO₂ RuBisCO hardly takes up O₂, and the Calvin–Benson–Bassham cycle runs on the day’s light. CAM plants (agave, pineapple, cacti, many orchids) lose very little water but usually grow slowly: each day’s CO₂ is what the vacuole stored that night. <b>${Q}</b>` },
    ],
  },
];

/* ---------------------------------------------------------------- the strip (RuBisCO's 2 reactions) */

const CAM: Cam = frame(-10, 1180, 0, 952, -40, 52);
const WIN = { x: 0, y: 52, w: 952, h: 512 };
const RXN = ['rubisco', 'co2', 'carbox', 'o2', 'oxy'];
const L_D: LitMap = litOf(RXN, 0.3);
const L_C: LitMap = { ...litOf(['rubisco', 'co2', 'carbox']), ...litOf(['o2', 'oxy'], 0.3) };
const L_O: LitMap = { ...litOf(['co2', 'carbox'], 0.3), ...litOf(['rubisco', 'o2', 'oxy']) };

/* ---------------------------------------------------------------- the panels (stage units) */

const CX = 1146, RM = 142, C3: V = [CX, 158], CM: V = [CX, 466];
const PH = { x: 1330, w: 256, k: 0.256, y3: 46, ym: 356 };
const ph = (y0: number, q: V): V => [PH.x + q[0] * PH.k, y0 + q[1] * PH.k];
/** The bands of both magnifiers, from the centre's y: the cuticle, the epidermis's base, the wall, the plasma membrane. */
const Y = { cut: -100, epi: -78, w0: -52, w1: -46, pm: -43 };
/** The pore's x from the centre; the guard cells' outer sides from the pore. */
const PX = -20, GOUT = 44;
/** The chloroplast (centre, radii) and RuBisCO in it; PEPC (CAM); the vacuole (centre, radii); the acid's full height. */
const CP: V = [56, -16], CPR: V = [62, 19], RUB: V = [14, -16], PEPC: V = [-96, -16];
const VAC = { c: [-10, 86] as V, rx: 100, ry: 44 }, FULL = 72;
const at = (c: V, q: V): V => [c[0] + q[0], c[1] + q[1]];

const lab = (x: number, y: number, s: string, a: Anchor = 'middle', size = 15): string => T(x, y, s, 'co2k-il cel-halo', a, ` style="font-size:${size}px"`);
const granum = (x: number, y: number, w: number, n: number): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 6.5)}" width="${f(w)}" height="4.5" rx="2.2" style="stroke:#9fbf6e;stroke-width:1"/>`).join('');

/** A guard cell's outline: its outer side at xo, its pore side at xi, between y0 and y1 (as cam-kranz.ts). */
function guardPath(xo: number, xi: number, y0: number, y1: number): string {
  const s = Math.sign(xi - xo), h = y1 - y0, rr = Math.min(22, h / 2 - 2), b = 3 * s;
  return `M${f(xo + s * rr)},${f(y0)}H${f(xi - s * 6)}Q${f(xi + b)},${f(y0 + h / 2)} ${f(xi - s * 6)},${f(y1)}H${f(xo + s * rr)}Q${f(xo)},${f(y1)} ${f(xo)},${f(y1 - rr)}V${f(y0 + rr)}Q${f(xo)},${f(y0)} ${f(xo + s * rr)},${f(y0)}Z`;
}
/** The guard cells of magnifier k for an opening u (0 shut, 1 open: a pore 24 units wide). */
function guardD(c: V, u: number): { l: string; r: string; lw: string; rw: string } {
  const px = c[0] + PX, y0 = c[1] + Y.cut + 1, y1 = c[1] + Y.epi - 1, g = lerp(0.5, 12, u), ym = (y0 + y1) / 2;
  return {
    l: guardPath(px - GOUT, px - g, y0, y1), r: guardPath(px + GOUT, px + g, y0, y1),
    lw: `M${f(px - g - 4)},${f(y0 + 6)}Q${f(px - g)},${f(ym)} ${f(px - g - 4)},${f(y1 - 6)}`,
    rw: `M${f(px + g + 4)},${f(y0 + 6)}Q${f(px + g)},${f(ym)} ${f(px + g + 4)},${f(y1 - 6)}`,
  };
}

/** One magnifier's content: the same cell in both leaves; CAM adds PEPC and the acid fill. */
function cell(k: string, c: V, cam: boolean): string {
  const [cx, cy] = c, x0 = cx - RM - 10, w = 2 * RM + 20;
  const band = (a: number, b: number, cls: string): string => `<rect class="${cls}" x="${x0}" y="${f(cy + a)}" width="${w}" height="${f(b - a)}"/>`;
  const px = cx + PX, ey = cy + Y.cut + 1, eh = Y.epi - Y.cut - 2;
  const epi = [[x0, px - GOUT - 2], [px + GOUT + 2, cx + 92], [cx + 96, x0 + w]]
    .map(([a, b]) => `<rect class="co2k-epi" x="${f(a)}" y="${f(ey)}" width="${f(b - a)}" height="${f(eh)}" rx="9"/>`).join('');
  const cut = `<path class="co2k-cut" d="M${x0},${f(cy + Y.cut)}H${f(px - 16)}M${f(px + 16)},${f(cy + Y.cut)}H${x0 + w}"/>`;
  const fib = Array.from({ length: 13 }, (_, i) => `<path class="co2k-fib" d="M${f(x0 + 8 + i * 24)},${f(cy + Y.w0 + 1 + (i % 2) * 2)}q6,3 12,0"/>`).join('');
  const g = guardD(c, 0);
  const guards = `<path data-k="${P}-${k}gl" class="co2k-guard" d="${g.l}"/><path data-k="${P}-${k}gr" class="co2k-guard" d="${g.r}"/>
    <path data-k="${P}-${k}glw" class="co2k-guardw" d="${g.lw}"/><path data-k="${P}-${k}grw" class="co2k-guardw" d="${g.rw}"/>`;
  const [vx, vy] = at(c, VAC.c), cp = at(c, CP), rb = at(c, RUB), rw = 26;
  const vac = `<ellipse cx="${f(vx)}" cy="${f(vy)}" rx="${VAC.rx}" ry="${VAC.ry}" style="fill:#edf1f5"/>
    ${cam ? `<clipPath id="${P}-vcl"><ellipse cx="${f(vx)}" cy="${f(vy)}" rx="${VAC.rx}" ry="${VAC.ry}"/></clipPath>
      <g clip-path="url(#${P}-vcl)"><rect data-k="${P}-fill" x="${f(vx - VAC.rx)}" y="${f(vy + VAC.ry)}" width="${2 * VAC.rx}" height="0" style="fill:#f3b49b;opacity:.78"/></g>` : ''}
    ${bilayerE(vx, vy, VAC.rx, VAC.ry, 4)}`;
  const chl = `<ellipse class="co2k-strm" cx="${f(cp[0])}" cy="${f(cp[1])}" rx="${CPR[0]}" ry="${CPR[1]}"/>
    ${bilayerE(cp[0], cp[1], CPR[0], CPR[1], 3.5)}${bilayerE(cp[0], cp[1], CPR[0] + 7, CPR[1] + 7, 3.5)}
    <image href="${rubPng}" x="${f(rb[0] - rw / 2)}" y="${f(rb[1] - (rw * 471) / 548 / 2)}" width="${rw}" height="${f((rw * 471) / 548)}"/>`;
  const pe = at(c, PEPC), pw = 30;
  const pepc = cam ? `<image href="${pepcPng}" x="${f(pe[0] - pw / 2)}" y="${f(pe[1] - (pw * 517) / 608 / 2)}" width="${pw}" height="${f((pw * 517) / 608)}"/>${lab(pe[0], cy + 14, 'PEPC', 'middle', 14)}` : '';
  return `${band(-RM - 10, Y.cut, 'co2k-air')}${band(Y.cut, Y.w0, 'co2k-ias')}${band(Y.w0, Y.w1, 'co2k-wallb')}${band(Y.w1, RM + 10, 'co2k-cyt')}
    ${fib}${bilayerH(x0, x0 + w, cy + Y.pm, 4)}${epi}${guards}${cut}${vac}${chl}${pepc}
    ${lab(cx + 30, cy - 106, 'stoma', 'start')}${lab(cx - 92, cy - 58, 'air space')}
    ${lab(cp[0] + 18, cp[1] + 5, 'RuBisCO', 'middle', 14)}${lab(cp[0], cy + 24, 'chloroplast', 'middle', 14)}${lab(vx, cy + 74, 'vacuole', 'middle', 14)}
    ${cam ? `<g data-k="${P}-mal" opacity="0">${lab(vx, cy + 122, 'malic acid', 'middle', 14)}</g>` : ''}
    ${cam ? `<rect data-k="${P}-veilm" x="${x0}" y="${cy - RM - 10}" width="${w}" height="${w}" style="fill:#1d2a52" opacity="0"/>` : ''}`;
}
function magnifier(k: string, c: V, lens: V, lr: number, inner: string): string {
  return `<g data-k="${P}-${k}l" opacity="0"><path class="co2k-tan" d="${tangents(lens, lr, c, RM)}"/><circle class="co2k-lens" cx="${f(lens[0])}" cy="${f(lens[1])}" r="${f(lr)}"/></g>
    <g data-k="${P}-${k}" opacity="0"><clipPath id="${P}-${k}c"><circle cx="${c[0]}" cy="${c[1]}" r="${RM}"/></clipPath>
    <circle class="co2k-inbg" cx="${c[0]}" cy="${c[1]}" r="${RM}"/><g clip-path="url(#${P}-${k}c)">${inner}</g><circle class="co2k-inring" cx="${c[0]}" cy="${c[1]}" r="${RM}"/></g>`;
}

/* ---------------------------------------------------------------- the photos and their names */

interface PLab { k: string; s: string; at: V }
/** C₃ (photo units): the bundle sheath ringed (c2s-b.ts), the mesophyll, the air space left of it; the lens on the
 *  mesophyll cell at the air space (as c2s-b.ts). */
const PL3: PLab[] = [{ k: 'bs', s: 'bundle sheath', at: [480, 655] }, { k: 'ms', s: 'mesophyll', at: [170, 165] }, { k: 'as', s: 'air space', at: [118, 488] }];
/** CAM (photo units): the stoma (above it, in the clear air), the chloroplasts lining the cells' walls, a cell's clear
 *  vacuole; the lens on the stoma. */
const PLM: PLab[] = [{ k: 'st', s: 'stoma', at: [480, 74] }, { k: 'cp', s: 'chloroplasts', at: [250, 520] }, { k: 'va', s: 'vacuole', at: [880, 492] }];
const LENS3: V = [110, 330], LR3 = 55, LENSM: V = [482, 268], LRM = 100;
function photo(href: string, y: number): string {
  const H = 740 * PH.k;
  return `<image href="${href}" x="${PH.x}" y="${y}" width="${PH.w}" height="${f(H)}" preserveAspectRatio="none"/>
    <rect x="${PH.x}" y="${y}" width="${PH.w}" height="${f(H)}" style="fill:none;stroke:#bdb9ad;stroke-width:1"/>`;
}
const pLab = (y0: number, l: PLab): string => { const q = ph(y0, l.at); return `<g data-k="${P}-p-${l.k}" opacity="0">${T(q[0], q[1], l.s, 'co2k-zl cel-halo', 'middle', ' style="font-size:16px"')}</g>`; };
const RING3 = (() => { const c = ph(PH.y3, [478, 360]); return `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(305 * PH.k)}" ry="${f(345 * PH.k)}" style="fill:none;stroke:#2f6f5f;stroke-width:2;stroke-dasharray:6 4"/>`; })();

/** A day/night pill (paper) under a photo: sun or moon, and its word. */
const moonG = `<path d="M-2.36,-11.77A12,12 0 1 0 11.77,2.36A10,10 0 0 1 -2.36,-11.77Z" style="fill:#c9cfe8;stroke:#5d6898;stroke-width:1.6;stroke-linejoin:round"/>`;
function pill(k: string, c: V, icon: string, word: string, w: number, o = 0): string {
  return `<g data-k="${P}-${k}" opacity="${o}"><rect x="${f(c[0] - w / 2)}" y="${f(c[1] - 17)}" width="${w}" height="34" rx="17" style="fill:#fffdf8;stroke:#8a877d;stroke-width:1.4"/>
    <g transform="translate(${f(c[0] - w / 2 + 24)} ${c[1]})">${icon}</g>${T(c[0] + 14, c[1] + 6, word, 'co2k-ilb', 'middle', ' style="font-size:16px"')}</g>`;
}
const PILL3: V = [1458, 268], PILLM: V = [1458, 580];

/* ---------------------------------------------------------------- the molecules' walks (stage units) */

/** A seeded generator (mulberry32): the same walk in every frame. */
function rnd(seed: number): () => number {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** The walk through its bounce points (offsets from the magnifier's centre c), each nudged by up to ±j (seeded). */
function walk(c: V, q: V[], seed: number, j = 3): Path {
  const r = rnd(seed);
  return curve(q.map((p, i) => (i === 0 || i === q.length - 1 ? at(c, p) : at(c, [p[0] + (r() * 2 - 1) * j, p[1] + (r() * 2 - 1) * j]))));
}
/** One molecule: its beat, glyph kind, walk and its window (s), when it fades in (0.8 s, while still or moving), when
 *  it fades out (0.8 s), the flash where it is fixed, and a second glide (to RuBisCO, beat 4). */
interface Mol { k: string; beat: number; kind: 'co2' | 'h2o' | 'o2'; c: V; p: Path; w: [number, number]; fin: number; fout?: number; fix?: number; p2?: Path; w2?: [number, number] }
const FD = 0.8;

const rub3 = RUB;
/** Water out: from the cell wall's surface across the air space and out through the open pore. */
const H2O_OUT: V[] = [[50, -54], [22, -64], [-12, -74], [PX, -89], [PX - 6, -106], [PX - 30, -126]];
const H2O_OUT2: V[] = [[84, -55], [40, -66], [6, -70], [PX, -89], [PX + 6, -108], [PX + 26, -128]];
const T1 = { c0: [1.0, 2.8], w0: [3.8, 4.9], w1: [5.1, 6.2], c1: [6.6, 8.4], w2: [9.4, 10.5], w3: [10.7, 11.8], h1: 12.4, day: 12.6, hot: 13.4, shut: [14.4, 15.6], h2: 15.8, lit: 16.0, ox: [17.0, 18.2] } as const;
/** CAM at night (beat 3): 3 CO₂ in through the open pore, across the air space and the wall to PEPC; 1 H₂O out. */
const T2 = { dim: 0, sun: 1.0, moon: 1.8, open: [2.8, 4.0], h1: 4.2, n: [[4.4, 6.2], [7.4, 9.2], [10.4, 12.2]], w: [13.4, 14.5] } as const;
/** CAM by day (beat 4): back, moon out, sun in, the stoma shuts; 3 releases (fill down, a CO₂ in, its walk); 3 fixed. */
const T3 = { back: 0, moon: 0.9, sun: 1.7, shut: [2.7, 3.9], h1: 4.1, r: [4.3, 8.1, 11.1], dw: [[5.3, 7.9], [9.1, 10.9], [12.1, 13.9]], h2: 14.1, lit: 14.2, fx: [[15.2, 15.9], [16.9, 17.6], [18.6, 19.3]] } as const;

/** The night's 3 CO₂: in from the outside air, through the open pore, across the air space and the wall to PEPC. */
const NIGHT: V[][] = [
  [[24, -128], [2, -112], [PX, -89], [PX - 3, -70], [12, -60], [-30, -56], [-44, -44], [-62, -26], [-40, -8], [PEPC[0] + 14, PEPC[1] + 2]],
  [[-36, -126], [-14, -112], [PX, -89], [PX - 3, -70], [-50, -62], [-14, -58], [-44, -44], [-40, -30], [-56, 0], [PEPC[0] + 14, PEPC[1] + 2]],
  [[8, -130], [-4, -110], [PX, -89], [PX - 3, -70], [16, -64], [-40, -58], [-44, -44], [-66, -32], [-36, -14], [PEPC[0] + 14, PEPC[1] + 2]],
];
const MOLS: Mol[] = [
  // C₃: 2 CO₂ in, each followed by 2 H₂O out
  { k: 'c0', beat: 1, kind: 'co2', c: C3, p: walk(C3, [[30, -130], [4, -112], [PX, -89], [PX + 2, -70], [26, -62], [-6, -58], [4, -44], [-10, -28], rub3], 31), w: [T1.c0[0], T1.c0[1]], fin: T1.c0[0], fix: T1.c0[1] + 0.1 },
  { k: 'w0', beat: 1, kind: 'h2o', c: C3, p: walk(C3, H2O_OUT, 41), w: [T1.w0[0], T1.w0[1]], fin: T1.w0[0], fout: T1.w0[1] - 0.6 },
  { k: 'w1', beat: 1, kind: 'h2o', c: C3, p: walk(C3, H2O_OUT2, 43), w: [T1.w1[0], T1.w1[1]], fin: T1.w1[0], fout: T1.w1[1] - 0.6 },
  { k: 'c1', beat: 1, kind: 'co2', c: C3, p: walk(C3, [[-30, -128], [-8, -110], [PX, -89], [PX - 4, -70], [34, -62], [6, -57], [-16, -40], [-4, -26], rub3], 47), w: [T1.c1[0], T1.c1[1]], fin: T1.c1[0], fix: T1.c1[1] + 0.1 },
  { k: 'w2', beat: 1, kind: 'h2o', c: C3, p: walk(C3, H2O_OUT, 53), w: [T1.w2[0], T1.w2[1]], fin: T1.w2[0], fout: T1.w2[1] - 0.6 },
  { k: 'w3', beat: 1, kind: 'h2o', c: C3, p: walk(C3, H2O_OUT2, 59), w: [T1.w3[0], T1.w3[1]], fin: T1.w3[0], fout: T1.w3[1] - 0.6 },
  // C₃, the stoma shut: an O₂ from the air space to RuBisCO
  { k: 'ox', beat: 1, kind: 'o2', c: C3, p: walk(C3, [[86, -62], [62, -50], [40, -30], rub3], 61), w: [T1.ox[0], T1.ox[1]], fin: T1.ox[0], fix: T1.ox[1] + 0.1 },
  // CAM at night: 3 CO₂ in to PEPC, then 1 H₂O out
  ...T2.n.map((w, i): Mol => ({
    k: `n${i}`, beat: 2, kind: 'co2', c: CM, w: [w[0], w[1]], fin: w[0], fix: w[1] + 0.1,
    p: walk(CM, NIGHT[i], 71 + 6 * i),
  })),
  { k: 'wn', beat: 2, kind: 'h2o', c: CM, p: walk(CM, H2O_OUT, 89), w: [T2.w[0], T2.w[1]], fin: T2.w[0], fout: T2.w[1] - 0.6 },
  // CAM by day: 3 CO₂ released at the vacuole; they bounce in the cell (the first up against the shut stoma) and wait
  // round RuBisCO; then RuBisCO fixes them one by one
  ...([
    { rel: [-40, 32], q: [[-4, 6], [-34, -30], [-26, -62], [PX + 2, -72], [4, -58], [34, -70]], end: [68, -62], back: [[40, -40]] },
    { rel: [0, 34], q: [[-30, 10], [-6, -30], [-60, -30], [-20, 0]], end: [-38, -14], back: [] },
    { rel: [-60, 34], q: [[-82, 18], [-50, -6], [-2, 18], [-44, 32]], end: [-24, 26], back: [[0, 4]] },
  ] as Array<{ rel: V; q: V[]; end: V; back: V[] }>).map((d, i): Mol => ({
    k: `d${i}`, beat: 3, kind: 'co2', c: CM, p: walk(CM, [d.rel, ...d.q, d.end], 97 + 5 * i), w: [T3.dw[i][0], T3.dw[i][1]], fin: T3.r[i],
    p2: walk(CM, [d.end, ...d.back, RUB], 101 + i), w2: [T3.fx[i][0], T3.fx[i][1]], fix: T3.fx[i][1] + 0.1,
  })),
];
/** The flashes (one per magnifier): where a molecule is fixed. */
const FIXES = MOLS.filter(m => m.fix !== undefined).map(m => ({ beat: m.beat, t: m.fix as number, at: (m.p2 ?? m.p)(1), mag: m.c === C3 ? 'fl3' : 'flm' }));

interface MolState { at: V; o: number; rot: number }
function molOf(m: Mol, beat: number, t: number): MolState | undefined {
  if (beat !== m.beat || t < m.fin) return undefined;
  const a = m.p2 && m.w2 && t >= m.w2[0] ? m.p2(ease(t, m.w2[0], m.w2[1])) : m.p(ease(t, m.w[0], m.w[1]));
  const out = m.fix !== undefined ? m.fix : m.fout;
  const o = ease(t, m.fin, m.fin + FD) * (out !== undefined ? 1 - ease(t, out, out + FD) : 1);
  // lined up with the pore while it passes through (only the CO₂ needs to turn to fit)
  const dy = Math.abs(a[1] - (m.c[1] - 89));
  const rot = m.kind === 'co2' ? 90 * clamp(1 - (dy - 9) / 16) : 0;
  return { at: a, o, rot };
}

/* ---------------------------------------------------------------- the states that drive the panels */

/** The stomata: 0 shut, 1 open. C₃ open by day until the hot, dry step; CAM shut by day, open at night. */
const open3 = (beat: number, t: number): number => (beat === 0 ? 1 : beat === 1 ? 1 - ease(t, T1.shut[0], T1.shut[1]) : 0);
const openM = (beat: number, t: number): number => (beat === 2 ? ease(t, T2.open[0], T2.open[1]) : beat === 3 ? 1 - ease(t, T3.shut[0], T3.shut[1]) : 0);
/** CAM's night: the moon's fade drives the veil. */
const nightOf = (beat: number, t: number): number => (beat === 2 ? ease(t, T2.moon, T2.moon + FD) : beat === 3 ? 1 - ease(t, T3.sun, T3.sun + FD) : 0);
/** The vacuole's malic acid (0–1): up a third at each PEPC fixation (in its flash's window), down a third at each release. */
function acidOf(beat: number, t: number): number {
  if (beat === 2) return T2.n.reduce((s, w) => s + ease(t, w[1] + 0.1, w[1] + 1.0) / 3, 0);
  if (beat === 3) return 1 - T3.r.reduce((s, r) => s + ease(t, r, r + 0.9) / 3, 0);
  return 0;
}
function lit(beat: number, t: number): LitMap {
  if (beat === 0) return L_D;
  if (beat === 1) return t < T1.lit ? mixLit(L_D, L_C, ease(t, 0, FD)) : mixLit(L_C, L_O, ease(t, T1.lit, T1.lit + FD));
  if (beat === 2) return mixLit(L_O, L_D, ease(t, 0, FD));
  return mixLit(L_D, L_C, ease(t, T3.lit, T3.lit + FD));
}
/** Beat 1's times: the photo names one at a time (hold), then each lens and magnifier. */
const B0 = { names: [0.3, 1.2, 2.1, 3.0, 3.9, 4.8], hold: 5.7, l3: 5.9, m3: 6.8, lm: 7.7, mm: 8.6 } as const;

function hudSvg(): string {
  const defs = `<defs>${flashDefs(P)}</defs>`;
  const kid = (k: string): string => kidG(`${P}-${k}`, 7, 'CO₂', -14).replace('co2k-kl"', 'co2k-kl" style="font-size:14px"');
  const glyph = (m: Mol): string => m.kind === 'co2' ? kid(m.k)
    : `<g data-k="${P}-${m.k}" display="none"><g data-k="${P}-${m.k}-b">${m.kind === 'h2o' ? h2oG(6) : o2G(6)}</g>${T(0, -12, m.kind === 'h2o' ? 'H₂O' : 'O₂', 'cel-mn cel-halo', 'middle', ' style="font-size:14px"')}</g>`;
  const fl = (k: string): string => `<g data-k="${P}-${k}" opacity="0">${flashG(P, 22)}</g>`;
  const L3 = ph(PH.y3, LENS3), LM = ph(PH.ym, LENSM);
  const c3 = `<g data-k="${P}-c3all">${cardSvg(966, 4, 628, 302)}${photo(steJpg, PH.y3)}<g data-k="${P}-p-ring" opacity="0">${RING3}</g>
      ${magnifier('m3', C3, L3, LR3 * PH.k, cell('3', C3, false))}${PL3.map(l => pLab(PH.y3, l)).join('')}
      ${T(PH.x + PH.w / 2, 36, 'C₃ leaf', 'co2k-zl', 'middle', ' style="font-size:24px"')}
      ${pill('d3', PILL3, sunG(7), 'day', 116, 1)}${pill('h3', PILL3, sunG(7), 'hot, dry day', 176)}
      ${MOLS.filter(m => m.c === C3).map(glyph).join('')}${fl('fl3')}</g>`;
  const cm = `${cardSvg(966, 314, 628, 302)}${photo(sucJpg, PH.ym)}
      <rect data-k="${P}-veilp" x="${PH.x}" y="${PH.ym}" width="${PH.w}" height="${f(740 * PH.k)}" style="fill:#1d2a52" opacity="0"/>
      ${magnifier('mm', CM, LM, LRM * PH.k, cell('m', CM, true))}${PLM.map(l => pLab(PH.ym, l)).join('')}
      ${T(PH.x + PH.w / 2, 346, 'CAM leaf', 'co2k-zl', 'middle', ' style="font-size:24px"')}
      ${pill('dm', PILLM, sunG(7), 'day', 116, 1)}${pill('nm', PILLM, moonG, 'night', 130)}
      ${MOLS.filter(m => m.c === CM).map(glyph).join('')}${fl('flm')}`;
  return `${defs}${c3}${cm}
    ${T(8, 734, '<tspan font-style="italic">Steinchisma laxum</tspan> (C₃): Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0) · succulent leaf (CAM): Berkshire Community College Bioscience Image Library (CC0)', 'co2k-cr', 'start')}
    ${T(1592, 734, 'RuBisCO: PDB 8RUC · PEPC: PDB 3ZGE', 'co2k-cr', 'end')}`;
}

export const STAGING: Staging = {
  id: 'camb',
  name: 'camb · C₃ against CAM: the CO₂ trapped behind shut stomata',
  note: 'The picked c2sb layout: the RuBisCO strip and 2 stacked panels, C₃ (Steinchisma) and CAM (a succulent leaf), each with a lens and a magnifier on one mesophyll cell under a stoma. C₃ by day: CO₂ in, H₂O out, then the stoma shuts and RuBisCO takes O₂; CAM at night: CO₂ in, PEPC, the vacuole’s acid rises; CAM by day: the stoma shut, the acid releases CO₂ that bounces in the cell, trapped, round RuBisCO; the question',
  beats: BEATS,
  holds: [[B0.hold], [T1.h1, T1.h2], [T2.h1], [T3.h1, T3.h2]],
  keys: [{ beat: 3, text: Q, x: 800, y: 676, size: 44 }],
  svg: () => {
    const scene = sceneSvg(P, { over: '', movers: '' });
    return `<defs><clipPath id="${P}-win"><rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}" rx="14"/></clipPath></defs>
      <g clip-path="url(#${P}-win)">${scene}</g>
      <rect x="${WIN.x + 0.6}" y="${WIN.y + 0.6}" width="${WIN.w - 1.2}" height="${WIN.h - 1.2}" rx="14" style="fill:none;stroke:#d8d5cb;stroke-width:1.2"/>
      <g class="dk1 fig dk2 co2k">${hudSvg()}</g>`;
  },
  bind(stage) {
    const S = new Strip(stage);
    S.retag('perox', 'text', el => !!el.textContent?.includes('peroxisome'), 'perox-name');
    for (const p of ['pg2', 'glycine', 'serine', 'co2-out', 'glycolate', 'glycerate', 'nh3']) { S.hide(p, 'node'); S.hide(p, 'text'); }
    S.hide('perox', 'node'); S.hide('perox', 'text'); S.hide('mito', 'text');
    (stage.querySelector('[data-k="cam"]') as SVGGElement).setAttribute('transform', camTf(CAM));
    const A = attrSetter(stage);
    const fill = stage.querySelector(`[data-k="${P}-fill"]`) as SVGRectElement | null;
    const vBot = CM[1] + VAC.c[1] + VAC.ry;
    return (beat, t) => {
      S.light(lit(beat, t));
      // beat 1: the photo names one at a time, then each lens and its magnifier
      const on = (t0: number): number => (beat > 0 ? 1 : ease(t, t0, t0 + FD));
      ['p-ring', 'p-bs', 'p-ms', 'p-as'].forEach((k, i) => A(`${P}-${k}`, 'opacity', on(B0.names[Math.max(0, i - 1)])));
      ['p-st', 'p-cp', 'p-va'].forEach((k, i) => A(`${P}-${k}`, 'opacity', on(B0.names[3 + i])));
      A(`${P}-m3l`, 'opacity', on(B0.l3)); A(`${P}-m3`, 'opacity', on(B0.m3));
      A(`${P}-mml`, 'opacity', on(B0.lm)); A(`${P}-mm`, 'opacity', on(B0.mm));
      // the C₃ panel steps back while CAM's night plays, and returns for CAM's day
      A(`${P}-c3all`, 'opacity', beat === 2 ? 1 - 0.55 * ease(t, T2.dim, T2.dim + FD) : beat === 3 ? 0.45 + 0.55 * ease(t, T3.back, T3.back + FD) : 1);
      // the stomata
      for (const [k, c, u] of [['3', C3, open3(beat, t)], ['m', CM, openM(beat, t)]] as Array<[string, V, number]>) {
        const g = guardD(c, u);
        A(`${P}-${k}gl`, 'd', g.l); A(`${P}-${k}gr`, 'd', g.r); A(`${P}-${k}glw`, 'd', g.lw); A(`${P}-${k}grw`, 'd', g.rw);
      }
      // the pills: C₃ "day", then "hot, dry day"; CAM "day" → "night" → "day" (the old word out, then the new one in)
      A(`${P}-d3`, 'opacity', beat === 0 ? 1 : beat === 1 ? 1 - ease(t, T1.day, T1.day + FD) : 0);
      A(`${P}-h3`, 'opacity', beat === 1 ? ease(t, T1.hot, T1.hot + FD) : beat > 1 ? 1 : 0);
      A(`${P}-dm`, 'opacity', beat < 2 ? 1 : beat === 2 ? 1 - ease(t, T2.sun, T2.sun + FD) : ease(t, T3.sun, T3.sun + FD));
      A(`${P}-nm`, 'opacity', beat === 2 ? ease(t, T2.moon, T2.moon + FD) : beat === 3 ? 1 - ease(t, T3.moon, T3.moon + FD) : 0);
      const n = nightOf(beat, t);
      A(`${P}-veilm`, 'opacity', 0.16 * n); A(`${P}-veilp`, 'opacity', 0.26 * n);
      // the vacuole's malic acid, a fill level rising from the vacuole's floor; its name with the first third
      const h = FULL * acidOf(beat, t);
      if (fill) { fill.setAttribute('y', f(vBot - h)); fill.setAttribute('height', f(h)); }
      A(`${P}-mal`, 'opacity', beat === 2 ? ease(t, T2.n[0][1] + 0.1, T2.n[0][1] + 0.1 + FD) : beat === 3 ? 1 - ease(t, T3.r[2], T3.r[2] + FD) : 0);
      // the molecules: hidden unless on; the CO₂ turned upright in the pore
      for (const m of MOLS) {
        const q = molOf(m, beat, t), key = `${P}-${m.k}`;
        A(key, 'display', !q || q.o < 0.004 ? 'none' : 'inline');
        if (!q || q.o < 0.004) continue;
        A(key, 'opacity', q.o); A(key, 'transform', `translate(${f(q.at[0])} ${f(q.at[1])})`);
        A(`${key}-b`, 'transform', q.rot > 0.5 ? `rotate(${q.rot.toFixed(1)})` : '');
        if (m.kind === 'co2') { A(`${key}-fn`, 'opacity', 1); A(`${key}-fs`, 'opacity', 0); A(`${key}-fh`, 'opacity', 0); A(`${key}-sw`, 'opacity', 0); A(`${key}-sh`, 'opacity', 0); A(`${key}-l`, 'opacity', 1); }
      }
      // the flashes where RuBisCO (or PEPC) fixes a molecule
      for (const mag of ['fl3', 'flm']) {
        const e = FIXES.find(x => x.mag === mag && x.beat === beat && t > x.t && t < x.t + 2 * FD);
        const o = e ? ease(t, e.t, e.t + FD) * (1 - ease(t, e.t + FD, e.t + 2 * FD)) : 0;
        A(`${P}-${mag}`, 'opacity', o); if (e) A(`${P}-${mag}`, 'transform', `translate(${f(e.at[0])} ${f(e.at[1])})`);
      }
    };
  },
};
