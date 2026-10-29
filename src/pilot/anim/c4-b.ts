// 'lf12', staging c4b · C₄ slide in the style of the picked C₂ animation c2sb (anim/c2s-b.ts; lecturer, 30 Oct 2026:
// "the C₄ animation should be similar to what I picked for C₂"). Captions: C4B below (one caption per step).
// - c2sb's layout: the photorespiration strip on the left (dk2-common.ts sceneSvg), 2 stacked panels on the right, C₃
//   and C₄, each a light micrograph with its bundle sheath ringed, a lens and a round magnifier.
// - C₃ panel (Steinchisma laxum, Khoshravesh et al. 2016, CC BY 3.0): as in c2sb, drawn magnifier; glycine reaches the
//   mesophyll mitochondrion, 4 CO₂ characters are released one at a time, 3 escape to the air space, 1 is caught.
// - C₄ panel (maize, Berkshire Community College Bioscience Image Library, CC0): the magnifier is the same micrograph
//   magnified on the big bundle-sheath cell right of the vein (no openly licensed C₄ bundle-sheath TEM found in time),
//   labelled with leaders: vein, bundle-sheath cell, chloroplasts, mesophyll cell; PEPC (PDB 3ZGE) in the mesophyll and
//   RuBisCO (PDB 8RUC) on the bundle-sheath chloroplasts. A CO₂ from the air is fixed by PEPC, carried as malate (4 C)
//   through the wall into the bundle sheath, released at RuBisCO and held there; 3 more follow (one moving at a time),
//   so many CO₂ crowd round RuBisCO beside a single O₂; one leaks back out. Then the pill, the band glows, the question.
// - Every fade ≥ 0.8 s, every move eased, one thing moving at a time, a hold after each step.
// The C₄ magnifier is built in maize-photo pixels (zmap), so c4-b2.ts reuses it at another place and size.
import steJpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import gdcPng from '../../assets/cell/gdcp.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import pepcPng from '../../assets/rf/pepc-3zge.png';
import { atomBall, row } from '../figs/carbon-form';
import { arrow, balls, bilayer } from '../figs/cell-schema';
import { bilayerE, flashDefs, flashG, kidG, T, tangents, type Anchor } from './co2-kit';
import {
  attrSetter, camTf, cardSvg, curve, ease, f, frame, gasPath, glide, lerpV, litOf, mixLit, moverSvg, placer, sceneSvg, SP,
  Strip, uNear, type Cam, type LitMap, type Mover, type Path, type Put, type V,
} from './dk2-common';
import type { Beat, Cite, Staging } from './types';

const P = 'c4b';
const R = 11, ST = 2.15 * R;
/** Every fade lasts FD s (lecturer: "every fade ≥ 0.8 s"). */
export const FD = 0.8;

/* ---------------------------------------------------------------- captions (one per step) */

const KHOSH16: Cite = { label: 'Khoshravesh et al. 2016, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erw150' };
const BUSCH13: Cite = { label: 'Busch, Sage, Cousins & Sage 2013, Plant Cell Environ.', url: 'https://doi.org/10.1111/j.1365-3040.2012.02567.x' };
const SAGE12: Cite = { label: 'Sage, Sage & Kocacinar 2012, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' };
const HS66: Cite = { label: 'Hatch & Slack 1966, Biochem. J.', url: 'https://doi.org/10.1042/bj1010103' };
const VCF03: Cite = { label: 'von Caemmerer & Furbank 2003, Photosynth. Res.', url: 'https://doi.org/10.1023/A:1025830019591' };
const FURB11: Cite = { label: 'Furbank 2011, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/err080' };
export const CITES = { KHOSH16, BUSCH13, SAGE12, HS66, VCF03, FURB11 };

/** The C₄ beat's steps, shared with c4-b2. */
export const C4_STEPS: Array<{ tag: string; say: string }> = [
  { tag: 'C₄: PEPC fixes CO₂', say: 'In the maize mesophyll, PEPC fixes the CO₂ from the air, as bicarbonate, onto PEP: a 4-carbon acid (malate). PEPC does not react with O₂.' },
  { tag: 'Into the bundle sheath', say: 'Malate moves through plasmodesmata into the bundle-sheath cell next door.' },
  { tag: 'CO₂ released at RuBisCO', say: 'In the bundle-sheath chloroplasts malate releases its CO₂, right at RuBisCO.' },
  { tag: 'CO₂ crowds round RuBisCO', say: 'The pump keeps going: CO₂ in the bundle sheath rises to about 10 times that of the air, so RuBisCO there hardly takes up O₂.' },
  { tag: 'A little leaks', say: 'Some CO₂ leaks back out (about 20–30 % of what is pumped). The price: 2 extra ATP per CO₂, to make PEP again.' },
];

export const C4B: Beat[] = [
  {
    tag: 'C₃ and C₄ leaves', say: '', cite: [KHOSH16, SAGE12],
    steps: [
      { tag: 'C₃ and C₄ leaves', say: 'A C₃ grass and maize (C₄), cut across a vein: a ring of bundle-sheath cells around the vein, the mesophyll outside it. In maize every mesophyll cell touches a bundle-sheath cell (Kranz).' },
      { tag: 'Magnified', say: 'In maize the bundle-sheath cells are full of chloroplasts, with RuBisCO; PEPC sits in the mesophyll.' },
    ],
  },
  {
    tag: 'Photorespiration, as before', say: '', cite: [SAGE12],
    steps: [
      { tag: 'RuBisCO fixes CO₂', say: 'In a C₃ leaf, RuBisCO in the mesophyll fixes CO₂ onto RuBP: 2 × 3-PGA.' },
      { tag: 'RuBisCO also takes O₂', say: 'It also takes up O₂: one 3-PGA and the toxic 2-PG.' },
      { tag: '2-PG to glycine', say: '2-PG is recycled to glycine, as on the photorespiration slide.' },
    ],
  },
  {
    tag: 'C₃: the CO₂ escapes', say: '', cite: [BUSCH13],
    steps: [
      { tag: 'C₃: glycine', say: 'Glycine reaches the mesophyll mitochondria.' },
      { tag: 'C₃: the CO₂ escapes', say: 'They release CO₂ from glycine next to the air spaces: only about a quarter is recaptured, the rest escapes. RuBisCO gets only the CO₂ that diffuses in.' },
    ],
  },
  { tag: 'C₄: CO₂ pumped in', say: '', cite: [HS66, VCF03, FURB11], steps: C4_STEPS },
];

/* ---------------------------------------------------------------- glyphs (dk-rf6.ts, without the numbers) */

const bond = (x0: number, x1: number): string => `<path d="M${f(x0)},0H${f(x1)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>`;
/** 2-PG → glycolate → glycine: a 2-C body whose end atom changes (P, none, N); a red glow while it is 2-PG. */
const c2G = (k: string): string => `<ellipse data-k="${k}G" rx="44" ry="26" fill="url(#${P}-red)" opacity="0"/>`
  + `<g data-k="${k}P">${bond(0, ST)}${atomBall(ST, 0, 'P', R)}</g><g data-k="${k}N" opacity="0">${bond(0, ST)}${atomBall(ST, 0, 'N', R)}</g>`
  + `${row(-ST / 2, 0, 'CC', { r: R })}`;
const glyG = `${bond(0, ST)}${atomBall(ST, 0, 'N', R)}${row(-ST / 2, 0, 'CC', { r: R })}`;
/** Malate's carbon skeleton, as the strip's carbon rows (4 C). */
export const malG = row(0, 0, 'CCCC', { r: R });
const co2B = `<g class="chn-g">${balls(0, 0, 'OCO')}</g>`;
export const o2B = `<g class="chn-g">${balls(0, 0, 'OO')}</g>`;

const MOV: Mover[] = [
  { k: 'rbA', svg: row(0, 0, 'PCCCCCP', { r: R }), label: 'RuBP', at: [0, 32] },
  { k: 'rbB', svg: row(0, 0, 'PCCCCCP', { r: R }), label: 'RuBP', at: [0, 32] },
  { k: 'co2', svg: co2B, label: 'CO₂', at: [0, -22] },
  { k: 'o2', svg: o2B, label: 'O₂', at: [0, -22] },
  { k: 'pgaC', svg: `${row(0, -13, 'CCCP', { r: R })}${row(0, 13, 'CCCP', { r: R })}` },
  { k: 'xp', svg: row(0, 0, 'CCCP', { r: R }) },
  { k: 'pg', svg: c2G('pg') },
];

/* ---------------------------------------------------------------- the strip: framing and paths (strip units) */

const CAM: Cam = frame(-10, 1180, 0, 952, -40, 52);
const WIN = { x: 0, y: 52, w: 952, h: 512 };
const toStage = (q: V): V => [800 + (q[0] - CAM.c[0]) * CAM.s, 370 + (q[1] - CAM.c[1]) * CAM.s];
export const G = CAM.s;

const PG_AT: V = [SP.pg2[0] + 34, SP.pg2[1]];
const XP_AT: V = SP.oxyPga;
const GLY0: V = [SP.pg2[0] + 36, SP.pg2[1] + 2], GLY1: V = [606, 352];
const GOX_AT: V = [SP.gox[0] - 22, SP.gox[1] - 8];
const GW: V = [1138, 116];
const P_RB = curve([[SP.rubp[0], SP.rubp[1] + 40], SP.rubp, SP.rubpFrom, SP.rubpTo]);
const P_CO2 = gasPath('co2', 110), P_O2 = gasPath('o2', 110);
const P_PGA = curve([[SP.rub[0] - 34, SP.rub[1] - 10], SP.carboxFrom, SP.carboxTo, SP.pga]);
const P_XP = curve([[SP.oxyPgaTo[0] - 5, SP.oxyPgaTo[1] + 24], SP.oxyPgaTo, XP_AT]);
const P_PG = curve([SP.oxyFrom, SP.oxyTo, PG_AT]);
const RUN = curve([PG_AT, lerpV(GLY0, GLY1, 0.5), [690, 380], [760, 370], [818, 374], [880, 336], [934, 296], [982, 254], GOX_AT,
  [1084, 186], [1112, 150], GW]);
const U_GOX = uNear(RUN, GOX_AT);
/** Beat 2's times (s), each glide's start and length; the fades between them last FD. Holds after the carboxylation
 *  (ox) and after the toxic 2-PG (tox + FD). */
const T2 = {
  rbA: [0.6, 1.2], co2: [2.0, 1.2], pga: [4.1, 1.0], ox: 5.2,
  rbB: [5.9, 1.2], o2: [7.3, 1.2], xp: [9.4, 0.8], pg: [10.3, 1.0], tox: 11.4, run: [12.6, 4.0],
} as const;

/* ---------------------------------------------------------------- the panels (stage units) */

const CX = 1146, RM = 142, C3: V = [CX, 158], C4: V = [CX, 466];
const PH = { x: 1330, w: 256, k: 0.256, y3: 46, y4: 356 };
const ph = (y0: number, q: V): V => [PH.x + q[0] * PH.k, y0 + q[1] * PH.k];
const MT3: V = [1084, 180], CP3: V = [1098, 72], W3 = 1176;

const GWs = toStage(GW), FORK: V = [952, 173];
const G3: Path = curve([GWs, FORK, [992, 167], [1040, 172], [MT3[0], MT3[1] - 2]]);
const F3: V[] = [FORK, [992, 167], [1026, 165]];

const band = (a: number, b: number, c: V, cls: string): string => `<rect class="${cls}" x="${f(a)}" y="${f(c[1] - RM)}" width="${f(b - a)}" height="${2 * RM}"/>`;
const fibres = (x: number, c: V): string => Array.from({ length: 12 }, (_, i) => {
  const y = c[1] - RM + 6 + i * 25;
  return `<path class="co2k-fib" d="M${f(x + (i % 3) * 4)},${f(y)}q4,7 0,14t0,14"/>`;
}).join('');
const pmV = (x: number, y0: number, y1: number): string => bilayer([{ L: [x, y0, x, y1] }], 5, 1.4, 3.8);
const granum = (x: number, y: number, w: number, n: number): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 7.5)}" width="${f(w)}" height="5" rx="2.5" style="stroke:#9fbf6e;stroke-width:1.1"/>`).join('');
function mitoM(c: V, rx: number, ry: number, gw: number): string {
  return `<ellipse class="cel-matrix" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}"/>${bilayerE(c[0], c[1], rx, ry, 5)}${bilayerE(c[0], c[1], rx - 16, ry - 14, 5)}
    <image href="${gdcPng}" x="${f(c[0] - gw / 2)}" y="${f(c[1] - (gw * 222) / 302 / 2)}" width="${gw}" height="${f((gw * 222) / 302)}"/>`;
}
function chloroM(c: V, rx: number, ry: number, rw: number): string {
  return `<ellipse class="co2k-strm" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}"/>${granum(c[0] - 30, c[1] - 6, 14, 2)}${granum(c[0] + 30, c[1] - 6, 14, 2)}
    ${bilayerE(c[0], c[1], rx, ry, 4)}${bilayerE(c[0], c[1], rx + 8, ry + 8, 4)}
    <image href="${rubPng}" x="${f(c[0] - rw / 2)}" y="${f(c[1] - (rw * 471) / 548 / 2)}" width="${rw}" height="${f((rw * 471) / 548)}"/>`;
}
const lab = (x: number, y: number, s: string, a: Anchor = 'middle'): string => T(x, y, s, 'co2k-il cel-halo', a);

function mag3(): string {
  return `${band(CX - RM, W3, C3, 'co2k-cyt')}${band(W3, W3 + 16, C3, 'co2k-wallb')}${band(W3 + 16, CX + RM, C3, 'co2k-ias')}
    ${fibres(W3 + 4, C3)}${pmV(W3 - 6, C3[1] - RM, C3[1] + RM)}${chloroM(CP3, 46, 20, 34)}${mitoM(MT3, 64, 44, 44)}
    ${lab(MT3[0] + 16, 250, 'mitochondrion')}${lab(CP3[0] + 6, 124, 'chloroplast')}${lab(1236, 126, 'air space')}`;
}
/** A lens on a photo, its tangents and the round magnifier with `inner` clipped to it. */
export function magnifier(p: string, k: string, c: V, rm: number, lens: V, lr: number, inner: string): string {
  return `<g data-k="${p}-${k}l" opacity="0"><path class="co2k-tan" d="${tangents(lens, lr, c, rm)}"/><circle class="co2k-lens" cx="${f(lens[0])}" cy="${f(lens[1])}" r="${f(lr)}"/></g>
    <g data-k="${p}-${k}" opacity="0"><clipPath id="${p}-${k}c"><circle cx="${f(c[0])}" cy="${f(c[1])}" r="${rm}"/></clipPath>
    <circle class="co2k-inbg" cx="${f(c[0])}" cy="${f(c[1])}" r="${rm}"/><g clip-path="url(#${p}-${k}c)">${inner}</g><circle class="co2k-inring" cx="${f(c[0])}" cy="${f(c[1])}" r="${rm}"/></g>`;
}

/* ---------------------------------------------------------------- labels with leaders */

const LD = 'fill:none;stroke-linecap:round';
export function leader(from: V, to: V[]): string {
  const d = to.map(p => `M${f(from[0])},${f(from[1])}L${f(p[0])},${f(p[1])}`).join('');
  return `<path d="${d}" style="${LD};stroke:#fffdf8;stroke-width:4;opacity:.9"/><path d="${d}" style="${LD};stroke:#141413;stroke-width:1.5"/>`
    + to.map(q => `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="2.4" style="fill:#141413;stroke:#fffdf8;stroke-width:1.2"/>`).join('');
}
export interface Lab { k: string; s: string[]; at: V; a: Anchor; from?: V; to?: V[] }
export const labSvg = (p: string, l: Lab): string => `<g data-k="${p}-t-${l.k}" opacity="0">${l.from && l.to ? leader(l.from, l.to) : ''}${l.s.map((s, i) => lab(l.at[0], l.at[1] + i * 17, s, l.a)).join('')}</g>`;

/* ---------------------------------------------------------------- the C₄ magnifier (maize-photo pixels) */

/** A C₄ magnifier: its centre and radius on the stage, stage units per photo pixel, the CO₂ characters' radius. */
export interface Zm { c: V; rm: number; zs: number; kr: number }
/** The maize-photo pixel on the magnifier's centre: the big bundle-sheath cell right of the vein, its chloroplast band
 *  on the side away from the vein, the mesophyll beyond its outer wall (checked on a gridded crop of the photo). */
export const ZC: V = [688, 382];
export const zmap = (m: Zm) => (x: number, y: number): V => [m.c[0] + (x - ZC[0]) * m.zs, m.c[1] + (y - ZC[1]) * m.zs];
/** In photo pixels: the chloroplast band, PEPC (mesophyll cytoplasm against the wall), RuBisCO (on the band). */
const BAND_PX: V[] = [[612, 288], [665, 298], [698, 326], [709, 370], [707, 412], [695, 446], [664, 469], [616, 477]];
export const PEPC_PX: V = [800, 386], RUB_PX: V = [712, 392];
/** A CO₂ from the air (right edge) to PEPC; malate from PEPC through the wall to RuBisCO. */
const ENTRY_PX: V[] = [[832, 350], [822, 366], [808, 374], [PEPC_PX[0] + 4, PEPC_PX[1] - 4]];
const MAL_PX: V[] = [PEPC_PX, [782, 392], [760, 395], [740, 392], [RUB_PX[0] + 10, RUB_PX[1] - 6]];
/** Each released CO₂'s short bounce near RuBisCO to where it is held (4 places round RuBisCO, on the band). */
const HELD_PX: V[][] = [
  [[714, 384], [700, 360], [722, 344], [702, 330], [690, 318]],
  [[714, 384], [728, 368], [706, 358], [724, 350], [718, 346]],
  [[714, 384], [700, 410], [726, 420], [708, 430], [718, 436]],
  [[714, 384], [728, 410], [702, 440], [714, 452], [690, 462]],
];
/** The leak: the last held CO₂ back out through the outer wall into the mesophyll. */
const LEAK_PX: V[] = [[690, 462], [712, 452], [700, 470], [728, 472], [748, 478], [764, 474], [784, 486], [800, 498]];
export const O2_PX: V = [640, 452];

/** The C₄ magnifier's inner markup: the photo magnified, the glow over the chloroplast band, PEPC and RuBisCO. */
export function magC4(p: string, m: Zm): string {
  const z = zmap(m), [x0, y0] = z(0, 0), w = (s: number): number => s * m.zs;
  const bd = BAND_PX.map(q => z(q[0], q[1])), d = `M${bd.map(q => `${f(q[0])},${f(q[1])}`).join('L')}`;
  const pw = 34 * (m.zs / 0.9), rw = 34 * (m.zs / 0.9), pc = z(PEPC_PX[0], PEPC_PX[1]), rc = z(RUB_PX[0], RUB_PX[1]);
  return `<image href="${zeaJpg}" x="${f(x0)}" y="${f(y0)}" width="${f(w(1000))}" height="${f(w(740))}" preserveAspectRatio="none"/>
    <path data-k="${p}-glow" opacity="0" d="${d}" style="fill:none;stroke:#f6c453;stroke-opacity:.5;stroke-width:${f(w(34))};stroke-linecap:round;stroke-linejoin:round"/>
    <image href="${pepcPng}" x="${f(pc[0] - pw / 2)}" y="${f(pc[1] - (pw * 517) / 608 / 2)}" width="${f(pw)}" height="${f((pw * 517) / 608)}"/>
    <image href="${rubPng}" x="${f(rc[0] - rw / 2)}" y="${f(rc[1] - (rw * 471) / 548 / 2)}" width="${f(rw)}" height="${f((rw * 471) / 548)}"/>`;
}

/* ---------------------------------------------------------------- the CO₂ walks */

function rnd(seed: number): () => number {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** The walk through its bounce points, each nudged by up to ±j (seeded); the first and last stay where they are. */
export function walk(q: V[], seed: number, j = 4): Path {
  const r = rnd(seed);
  return curve(q.map((p, i) => (i === 0 || i === q.length - 1 ? p : [p[0] + (r() * 2 - 1) * j, p[1] + (r() * 2 - 1) * j] as V)));
}
/** One CO₂'s state: place, opacity, strained (s) and glad (h) faces. */
export interface Kid { at: V; o: number; s?: number; h?: number; sweat?: number }
/** One released CO₂ (C₃ or C₂ style): its walk, release time and end. */
export interface Run { p: Path; t0: number; end: 'out' | 'caught'; glad: (at: V, u: number) => number; fl?: V }
export const WALK = 1.6, STEP = 2.3;
export function kidOf(r: Run, t: number): Kid | undefined {
  if (t < r.t0) return undefined;
  const t1 = r.t0 + 0.15, u = ease(t, t1, t1 + WALK), at = r.p(u);
  const o = ease(t, r.t0, r.t0 + FD) * (r.end === 'out' ? 1 - ease(t, t1 + WALK - FD, t1 + WALK) : 1);
  return { at, o, h: r.glad(at, u), s: r.end === 'caught' ? ease(t, t1 + WALK - 0.4, t1 + WALK + 0.4) : 0 };
}
export const catchT = (r: Run): number => r.t0 + 0.15 + WALK;
/** The catch flash (one per leaf): in and out over FD each, centred on the catch. */
export function flashOf(runs: Run[], t: number): { o: number; at: V } {
  for (const r of runs) {
    const tc = catchT(r);
    if (r.end === 'caught' && t > tc - FD / 2 && t < tc + 1.5 * FD) return { o: ease(t, tc - FD / 2, tc + FD / 2) * (1 - ease(t, tc + FD / 2, tc + 1.5 * FD)), at: r.fl ?? r.p(1) };
  }
  return { o: 0, at: [0, 0] };
}

const KR = 7;
const out3 = (at: V): number => Math.min(1, Math.max(0, (at[0] - W3 - 20) / 30));
const T3 = 3.4;
const RUN3: Run[] = [
  { p: walk([[1078, 176], [1122, 198], [1100, 160], [1148, 186], [1188, 176], [1226, 172], [1282, 176]], 31), t0: T3, end: 'out', glad: out3 },
  { p: walk([[1090, 184], [1128, 206], [1056, 200], [1044, 150], [1032, 118], [1062, 98]], 47), t0: T3 + STEP, end: 'caught', glad: () => 0, fl: CP3 },
  { p: walk([[1080, 188], [1056, 204], [1130, 212], [1150, 196], [1190, 210], [1232, 220], [1276, 218]], 59), t0: T3 + 2 * STEP, end: 'out', glad: out3 },
  { p: walk([[1088, 174], [1120, 160], [1064, 186], [1146, 176], [1192, 190], [1236, 196], [1282, 190]], 73), t0: T3 + 3 * STEP, end: 'out', glad: out3 },
];

/* ---------------------------------------------------------------- the C₄ pump (shared with c4-b2) */

/** The pump's times (s into its beat): cycle 0 slowly, with holds (after the fixation, the move, the release); then 3
 *  quicker cycles one after the other; the O₂; the leak; the pill and the glow. */
export interface PumpT { c: Array<{ s: number; ge: number; ga: number; gb: number }>; o2: number; leak: number; pill: number; glow: number; holds: number[] }
export function pumpTimes(t0: number): PumpT {
  const c: PumpT['c'] = [{ s: t0, ge: 1.8, ga: 2.0, gb: 1.2 }];
  // cycle 0: fixation ends s + 0.2 + ge, then the cross-fade FD; malate glides after a hold; release after a hold
  const c0 = c[0], fix0 = c0.s + 0.2 + c0.ge, h1 = fix0 + FD + 0.1, mv0 = h1 + 0.1, h2 = mv0 + c0.ga + 0.1, rel0 = h2 + 0.1, h3 = rel0 + FD + c0.gb + 0.1;
  let s = h3 + 0.2;
  // cycles 1–3: malate glides as it fades in, the CO₂ bounces as it fades in (nothing else moves meanwhile)
  for (let i = 1; i < 4; i++) { c.push({ s, ge: 1.0, ga: 1.2, gb: FD }); s += 0.2 + 1.0 + 1.2 + FD + 0.2; }
  const o2 = s, h4 = o2 + FD + 0.1, leak = h4 + 0.1, pill = leak + 1.8 + 0.2, glow = pill + FD + 0.1;
  return { c, o2, leak, pill, glow, holds: [h1, h2, h3, h4] };
}
interface PumpState { kid: Array<Kid | undefined>; mal: { at: V; o: number }; fl: { o: number; at: V }; o2: number }
/** The pump at t: each cycle's CO₂ (entering, then fading into malate at PEPC; reappearing at RuBisCO, bouncing to where
 *  it is held), malate's glide, PEPC's flash. Cycle 0 has holds between its parts (mv0, rel0 from pumpTimes). */
export function pumpAt(m: Zm, T: PumpT, t: number): PumpState {
  const z = zmap(m), Z = (q: V[]): V[] => q.map(p => z(p[0], p[1]));
  const entry = curve(Z(ENTRY_PX)), mal = curve(Z(MAL_PX));
  const kid: Array<Kid | undefined> = [];
  let malS = { at: z(PEPC_PX[0], PEPC_PX[1]), o: 0 }, fl = { o: 0, at: z(PEPC_PX[0], PEPC_PX[1]) };
  T.c.forEach((c, i) => {
    const fix = c.s + 0.2 + c.ge;
    // cycle 0's malate waits for the hold; later cycles go straight on
    const mv = i === 0 ? T.holds[0] + 0.1 : fix, rel = i === 0 ? T.holds[1] + 0.1 : mv + c.ga, held = i === 0 ? rel + FD : rel;
    const bounce = walk(Z(HELD_PX[i]), 101 + i * 17, 3 * m.zs);
    if (t < c.s) { kid.push(undefined); return; }
    if (t < rel) {
      // entering, then fading into malate at PEPC
      const o = ease(t, c.s, c.s + FD) * (1 - ease(t, fix, fix + FD));
      kid.push(o > 0.004 ? { at: glide(entry, t, c.s + 0.2, c.ge), o } : undefined);
      const mo = ease(t, fix, fix + FD);
      if (mo > 0) malS = { at: glide(mal, t, mv, c.ga), o: mo };
      if (t > fix - FD / 2 && t < fix + 1.5 * FD) fl = { o: ease(t, fix - FD / 2, fix + FD / 2) * (1 - ease(t, fix + FD / 2, fix + 1.5 * FD)), at: z(PEPC_PX[0], PEPC_PX[1]) };
      return;
    }
    // released at RuBisCO: malate fades as the CO₂ appears, then it bounces to its place and stays
    const mo = 1 - ease(t, rel, rel + FD);
    if (mo > 0.004) malS = { at: mal(1), o: mo };
    const leakU = i === 3 ? ease(t, T.leak, T.leak + 1.8) : 0;
    const at = leakU > 0 ? walk(Z(LEAK_PX), 211, 3 * m.zs)(leakU) : bounce(ease(t, held, held + c.gb));
    const o = ease(t, rel, rel + FD) * (i === 3 ? 1 - ease(t, T.leak + 1.8 - FD, T.leak + 1.8) : 1);
    kid.push({ at, o, h: i === 3 ? ease(leakU, 0.5, 0.8) : 0 });
  });
  return { kid, mal: malS, fl, o2: ease(t, T.o2, T.o2 + FD) };
}
/** The leader labels of a C₄ magnifier; label places (stage) given by the layout. */
export function c4Labels(m: Zm, at: { vein: V; bs: V; cp: V; ms: V; pepc: V; rub: V }): Lab[] {
  const z = zmap(m);
  return [
    { k: 'vein', s: ['vein'], at: at.vein, a: 'middle', from: [at.vein[0] + 8, at.vein[1] + 6], to: [z(542, 386)] },
    { k: 'bs', s: ['bundle-sheath', 'cell'], at: at.bs, a: 'middle', from: [at.bs[0] + 30, at.bs[1] + 22], to: [z(628, 336)] },
    { k: 'cp', s: ['chloroplasts'], at: at.cp, a: 'start', from: [at.cp[0] + 40, at.cp[1] - 13], to: [z(640, 474), z(704, 430)] },
    { k: 'ms', s: ['mesophyll cell'], at: at.ms, a: 'middle', from: [at.ms[0] - 10, at.ms[1] + 6], to: [z(812, 334)] },
    { k: 'pepc', s: ['PEPC'], at: at.pepc, a: 'middle' },
    { k: 'rub', s: ['RuBisCO'], at: at.rub, a: 'end' },
  ];
}

/* ---------------------------------------------------------------- the panels' photos */

interface Photo { y: number; href: string; ring: [number, number, number, number]; bs: V; ms: V; lens: V; lr: number }
const PH3: Photo = { y: PH.y3, href: steJpg, ring: [478, 360, 305, 345], bs: [480, 655], ms: [170, 165], lens: [110, 330], lr: 55 };
/** Maize: the wreath of 7 bundle-sheath cells round the vein; the lens on the big one right of the vein. */
const ZM4: Zm = { c: C4, rm: RM, zs: 0.9, kr: KR };
const PH4: Photo = { y: PH.y4, href: zeaJpg, ring: [517, 382, 252, 210], bs: [200, 640], ms: [820, 80], lens: ZC, lr: RM / ZM4.zs };
function photo(k: string, p: Photo): string {
  const [cx, cy] = ph(p.y, [p.ring[0], p.ring[1]]), H = 740 * PH.k;
  return `<image href="${p.href}" x="${PH.x}" y="${p.y}" width="${PH.w}" height="${f(H)}" preserveAspectRatio="none"/>
    <rect x="${PH.x}" y="${p.y}" width="${PH.w}" height="${f(H)}" style="fill:none;stroke:#bdb9ad;stroke-width:1"/>
    <g data-k="${P}-bs${k}" opacity="0"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(p.ring[2] * PH.k)}" ry="${f(p.ring[3] * PH.k)}" style="fill:none;stroke:#2f6f5f;stroke-width:2;stroke-dasharray:6 4"/></g>`;
}
const photoNames = (k: string, p: Photo): string => {
  const bs = ph(p.y, p.bs), ms = ph(p.y, p.ms);
  return `<g data-k="${P}-bsn${k}" opacity="0">${T(bs[0], bs[1], 'bundle sheath', 'co2k-zl cel-halo', 'middle', ' style="font-size:16px"')}</g>
    <g data-k="${P}-ms${k}" opacity="0">${T(ms[0], ms[1], 'mesophyll', 'co2k-zl cel-halo', 'middle', ' style="font-size:16px"')}</g>`;
};
/** On the maize photo: what the dark bands in the bundle-sheath cells are (leader to the bottom cell's band). */
const VS_AT: V = [1458, 561];
const vsSvg = (): string => `<g data-k="${P}-vs" opacity="0">${leader([1446, 549], [ph(PH.y4, [405, 548])])}
  ${T(VS_AT[0], VS_AT[1], 'bundle-sheath cells,', 'co2k-il cel-halo', 'middle', ' style="font-size:15px"')}
  ${T(VS_AT[0], VS_AT[1] + 16, 'full of chloroplasts', 'co2k-il cel-halo', 'middle', ' style="font-size:15px"')}</g>`;

export const hudMover = (k: string, g: string, name: string, ny: number, sc = G, fs = 0): string =>
  `<g data-k="m-${k}" opacity="0"><g transform="scale(${f(sc)})">${g}${fs ? '' : `<text class="cel-mn cel-halo" x="0" y="${ny}" text-anchor="middle">${name}</text>`}</g>`
  + `${fs ? `<text class="co2k-kl cel-halo" x="0" y="${f(ny * sc)}" text-anchor="middle" style="font-size:${fs}px">${name}</text>` : ''}</g>`;
export const pill = (p: string, k: string, at: V, s: string, ink: string): string => `<g data-k="${p}-${k}" opacity="0"><rect data-k="${p}-${k}r" x="${at[0] - 140}" y="${at[1] - 15}" width="280" height="30" rx="15" style="fill:#fffdf8;stroke:#8a877d;stroke-width:1.4"/>
  ${T(at[0], at[1] + 5.5, s, 'co2k-ilb', 'middle', ` data-k="${p}-${k}t" style="font-size:16px;fill:${ink}"`)}</g>`;
const PILL3: V = [1458, 268], PILL4: V = [1458, 597];

const TL4 = c4Labels(ZM4, { vein: [985, 452], bs: [1022, 338], cp: [985, 604], ms: [1270, 340], pepc: [1251, 503], rub: [1140, 482] });

function hudSvg(): string {
  const defs = `<defs><radialGradient id="${P}-red"><stop offset="0" class="dk2-red0"/><stop offset=".6" class="dk2-red1"/><stop offset="1" class="dk2-red2"/></radialGradient>
    ${flashDefs(P)}</defs>`;
  const L3 = ph(PH3.y, PH3.lens), L4 = ph(PH4.y, PH4.lens);
  const kid = (k: string): string => kidG(`${P}-${k}`, KR, 'CO₂', -KR - 7).replace('co2k-kl"', 'co2k-kl" style="font-size:14px"');
  const fl = (k: string): string => `<g data-k="${P}-${k}" opacity="0">${flashG(P, 22)}</g>`;
  return `${defs}${cardSvg(966, 4, 628, 302)}${cardSvg(966, 314, 628, 302)}
    ${photo('3', PH3)}${photo('4', PH4)}
    ${magnifier(P, 'm3', C3, RM, L3, PH3.lr * PH.k, mag3())}${magnifier(P, 'm4', C4, RM, L4, PH4.lr * PH.k, magC4(P, ZM4))}
    ${photoNames('3', PH3)}${photoNames('4', PH4)}${vsSvg()}
    ${T(PH.x + PH.w / 2, 36, 'C₃ leaf', 'co2k-zl', 'middle', ' style="font-size:24px"')}${T(PH.x + PH.w / 2, 346, 'C₄ leaf (maize)', 'co2k-zl', 'middle', ' style="font-size:24px"')}
    <g class="chn-off">${arrow(F3, 'pr', { thin: true })}</g><g data-k="${P}-f3" opacity="0">${arrow(F3, 'pr', { thin: true })}</g>
    ${TL4.map(l => labSvg(P, l)).join('')}${fl('fl3')}${fl('fl4')}
    ${hudMover('o2b', o2B, 'O₂', -24, 0.62, 14)}${hudMover('mal', malG, 'malate', -24, 0.62, 14)}
    ${RUN3.map((_, i) => kid(`a${i}`)).join('')}${[0, 1, 2, 3].map(i => kid(`c${i}`)).join('')}
    ${hudMover('g3', glyG, 'glycine', -26)}
    ${pill(P, 'p3', PILL3, 'C₃: about 1 in 4 recaptured', '#b0431f')}${pill(P, 'p4', PILL4, 'C₄: CO₂ pumped to RuBisCO, a little leaks', '#2f6f5f')}
    ${T(8, 734, '<tspan font-style="italic">Steinchisma laxum</tspan> (C₃): Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0) · maize (C₄): Berkshire Community College Bioscience Image Library (CC0)', 'co2k-cr', 'start')}
    ${T(1592, 734, 'RuBisCO: PDB 8RUC · PEPC: PDB 3ZGE · mitochondrial protein: PDB 4LHC', 'co2k-cr', 'end')}`;
}

/* ---------------------------------------------------------------- lighting (the strip) */

const L_C0: LitMap = litOf(['rubisco', 'co2']), L_C: LitMap = { ...L_C0, carbox: 1 };
const L_O0: LitMap = { ...litOf(['co2', 'carbox'], 0.35), ...litOf(['rubisco', 'o2']) }, L_O: LitMap = { ...L_O0, oxy: 1 };
const L_R: LitMap = { ...litOf(['rubisco', 'co2', 'carbox', 'o2', 'oxy'], 0.35), 'glycolate:flow': 1, 'glycolate:body': 1, 'perox:mem': 1, 'perox-name': 1, 'glycine:flow': 1 };
const L_E: LitMap = { ...Object.fromEntries(Object.keys(L_R).map(k => [k, 0.3])), 'glycine:flow': 0.6 };
function lit(beat: number, t: number): LitMap {
  if (beat === 0) return {};
  if (beat === 1) {
    if (t < 3.9) return mixLit({}, L_C0, ease(t, 0, FD));
    if (t < T2.ox) return mixLit(L_C0, L_C, ease(t, 3.9, 3.9 + FD));
    if (t < 9.3) return mixLit(L_C, L_O0, ease(t, T2.ox + 0.1, T2.ox + 0.1 + FD));
    if (t < T2.run[0]) return mixLit(L_O0, L_O, ease(t, 9.3, 9.3 + FD));
    return mixLit(L_O, L_R, ease(t, T2.run[0], T2.run[0] + FD));
  }
  return beat === 2 ? mixLit(L_R, L_E, ease(t, 0, FD)) : L_E;
}

const NAMES: Array<[string, number, number, number, number, string?]> = [
  ['3-PGA', SP.pga[0], SP.pga[1] + 50, 4.3, 99],
  ['3-PGA', SP.oxyPga[0] + 80, SP.oxyPga[1] + 6, 9.4, 99],
  ['2-PG', SP.pg2[0] + 66, SP.pg2[1] - 32, 10.4, T2.run[0]],
  ['toxic: inhibits', SP.pg2[0] + 44, SP.pg2[1] + 62, T2.tox, T2.run[0], 'dk2-toxic'], ['enzymes of the cycle', SP.pg2[0] + 44, SP.pg2[1] + 82, T2.tox, T2.run[0], 'dk2-toxic'],
  ['glycine', GW[0], GW[1] - 26, T2.run[0] + T2.run[1] - 0.2, 99],
];

/* ---------------------------------------------------------------- the script */

/** Beat 1: the photo names, the C₄ photo's note (hold), the lenses, the magnifiers, the magnifier's names. */
const B1 = { bs: 0.3, ms: 1.2, vs: 2.1, hold: 3.0, lens: 3.1, mag: 4.0, tl: 4.9, tlStep: 0.5 } as const;
const B3 = { gly: [0.4, 2.2], hold: 3.3, pill: catchT(RUN3[3]) + 0.3 } as const;
const PT = pumpTimes(0.3);

function script(beat: number, t: number): { pos: Record<string, Put>; att: Record<string, number>; kid: Record<string, Kid> } {
  const pos: Record<string, Put> = {}, att: Record<string, number> = {}, kid: Record<string, Kid> = {};
  const g = (p: Path, s: readonly [number, number]): V => glide(p, t, s[0], s[1]);
  if (beat === 1) {
    // each mover fades in over FD before it glides; the reactants fade out over FD as the products fade in
    const cx1 = T2.pga[0] - FD, cx2 = T2.xp[0] - FD;
    pos.rbA = { at: g(P_RB, T2.rbA), o: ease(t, T2.rbA[0] - FD + 0.2, T2.rbA[0] + 0.2) * (1 - ease(t, cx1, T2.pga[0])) };
    pos.co2 = { at: g(P_CO2, T2.co2), o: ease(t, T2.co2[0] - FD + 0.2, T2.co2[0] + 0.2) * (1 - ease(t, cx1, T2.pga[0])) };
    pos.pgaC = { at: g(P_PGA, T2.pga), o: ease(t, cx1, T2.pga[0]) };
    pos.rbB = { at: g(P_RB, T2.rbB), o: ease(t, T2.rbB[0] - FD + 0.2, T2.rbB[0] + 0.2) * (1 - ease(t, cx2, T2.xp[0])) };
    pos.o2 = { at: g(P_O2, T2.o2), o: ease(t, T2.o2[0] - FD + 0.2, T2.o2[0] + 0.2) * (1 - ease(t, cx2, T2.xp[0])) };
    pos.xp = { at: g(P_XP, T2.xp), o: ease(t, cx2, T2.xp[0]) };
    const u = ease(t, T2.run[0], T2.run[0] + T2.run[1]);
    pos.pg = { at: t < T2.run[0] ? g(P_PG, T2.pg) : RUN(u), o: ease(t, cx2, T2.xp[0]) };
    att.pgP = 1 - ease(t, T2.run[0], T2.run[0] + FD);
    att.pgN = ease(t, T2.run[0] + U_GOX * T2.run[1] - FD / 2, T2.run[0] + U_GOX * T2.run[1] + FD / 2);
    att.pgG = ease(t, T2.tox, T2.tox + FD) * (1 - ease(t, T2.run[0], T2.run[0] + FD));
  }
  if (beat >= 2) {
    const o = 1 - 0.6 * (beat === 2 ? ease(t, 0, FD) : 1);
    pos.pgaC = { at: SP.pga, o }; pos.xp = { at: XP_AT, o };
  }
  if (beat === 2) {
    pos.g3 = { at: g(G3, B3.gly), o: 1 - ease(t, B3.gly[0] + B3.gly[1] - 0.1, B3.gly[0] + B3.gly[1] + FD - 0.1) };
    RUN3.forEach((r, i) => { const q = kidOf(r, t); if (q) kid[`a${i}`] = q; });
  }
  if (beat === 3) {
    RUN3.forEach((r, i) => { const q = kidOf(r, 99); if (q) kid[`a${i}`] = q; });
    pumpAt(ZM4, PT, t).kid.forEach((q, i) => { if (q) kid[`c${i}`] = q; });
  }
  return { pos, att, kid };
}

/** Sets one CO₂ character (co2-kit kidG) on the stage: hidden unless shown, one face at a time. */
export function setKid(A: (k: string, a: string, v: string | number) => void, key: string, q: Kid | undefined): void {
  const o = q ? q.o : 0;
  A(key, 'display', o < 0.004 ? 'none' : 'inline'); A(key, 'opacity', o);
  if (!q || o < 0.004) return;
  const s = q.s ?? 0, h = q.h ?? 0;
  A(key, 'transform', `translate(${f(q.at[0])} ${f(q.at[1])})`);
  A(`${key}-fn`, 'opacity', Math.max(0, 1 - s - h)); A(`${key}-fs`, 'opacity', s); A(`${key}-fh`, 'opacity', h);
  A(`${key}-sw`, 'opacity', 0); A(`${key}-sh`, 'opacity', 0); A(`${key}-l`, 'opacity', 1);
}
/** Fits each pill's rounded box to its text. */
export function fitPills(stage: SVGSVGElement, A: (k: string, a: string, v: string | number) => void, p: string, pills: Array<[string, V]>): void {
  for (const [k, c] of pills) {
    const tx = stage.querySelector(`[data-k="${p}-${k}t"]`) as SVGTextElement | null, w = (tx?.getBBox().width ?? 250) + 30;
    const x = Math.min(c[0] - w / 2, 1588 - w);
    A(`${p}-${k}r`, 'x', x); A(`${p}-${k}r`, 'width', w); if (tx) A(`${p}-${k}t`, 'x', x + w / 2);
  }
}

export const STAGING: Staging = {
  id: 'c4b',
  name: 'c4b · c2sb with C₄: CO₂ pumped into the bundle sheath',
  note: 'The picked c2sb layout (the strip, 2 stacked panels) with maize in the C₂ place: C₃ 1 of 4 CO₂ recaptured, 3 escape; C₄ (the maize micrograph magnified, labelled) PEPC fixes CO₂, malate carries it into the bundle sheath, released at RuBisCO and held; 4 crowd round RuBisCO beside one O₂, one leaks; pill, glow, the question',
  beats: C4B,
  holds: [[B1.hold], [T2.ox, T2.tox + FD + 0.1], [B3.hold], PT.holds],
  keys: [
    { beat: 3, text: 'What if one cell did both steps,', x: 800, y: 656, size: 44 },
    { beat: 3, text: 'at different times?', x: 800, y: 704, size: 44 },
  ],
  svg: () => {
    const names = NAMES.map(([s, x, y, , , c], i) => `<text data-k="${P}-nm${i}" class="${c ?? 'cel-mn'} cel-halo" x="${x}" y="${y}" text-anchor="middle" opacity="0">${s}</text>`).join('');
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
    const put = placer(stage, [...MOV.map(m => m.k), 'g3', 'mal', 'o2b']), A = attrSetter(stage);
    fitPills(stage, A, P, [['p3', PILL3], ['p4', PILL4]]);
    const kids = [...RUN3.map((_, i) => `a${i}`), ...[0, 1, 2, 3].map(i => `c${i}`)];
    return (beat, t) => {
      S.light(lit(beat, t));
      const { pos, att, kid } = script(beat, t);
      const pump = beat === 3 ? pumpAt(ZM4, PT, t) : undefined;
      if (pump && pump.mal.o > 0.004) pos.mal = pump.mal;
      pos.o2b = { at: zmap(ZM4)(O2_PX[0], O2_PX[1]), o: pump ? pump.o2 : 0 };
      put(pos);
      for (const k of kids) setKid(A, `${P}-${k}`, kid[k]);
      const f3 = beat === 2 ? flashOf(RUN3, t) : { o: 0, at: [0, 0] as V };
      A(`${P}-fl3`, 'opacity', f3.o); if (f3.o > 0) A(`${P}-fl3`, 'transform', `translate(${f(f3.at[0])} ${f(f3.at[1])})`);
      const f4 = pump ? pump.fl : { o: 0, at: [0, 0] as V };
      A(`${P}-fl4`, 'opacity', f4.o); if (f4.o > 0) A(`${P}-fl4`, 'transform', `translate(${f(f4.at[0])} ${f(f4.at[1])})`);
      A(`${P}-p3`, 'opacity', beat === 2 ? ease(t, B3.pill, B3.pill + FD) : beat === 3 ? 1 : 0);
      A(`${P}-p4`, 'opacity', beat === 3 ? ease(t, PT.pill, PT.pill + FD) : 0);
      for (const [k, v] of Object.entries(att)) A(k, 'opacity', v);
      NAMES.forEach(([s, , , t0, t1], i) => A(`${P}-nm${i}`, 'opacity', beat === 1 ? ease(t, t0, t0 + FD) * (t1 === 99 ? 1 : 1 - ease(t, t1, t1 + FD))
        : beat === 2 && t1 === 99 && s !== 'glycine' ? 1 - ease(t, 0, FD) : 0));
      const on = (t0: number): number => (beat > 0 ? 1 : ease(t, t0, t0 + FD));
      for (const k of ['3', '4']) { A(`${P}-bs${k}`, 'opacity', on(B1.bs)); A(`${P}-bsn${k}`, 'opacity', on(B1.bs)); A(`${P}-ms${k}`, 'opacity', on(B1.ms)); }
      A(`${P}-vs`, 'opacity', on(B1.vs));
      for (const k of ['m3l', 'm4l']) A(`${P}-${k}`, 'opacity', on(B1.lens));
      for (const k of ['m3', 'm4']) A(`${P}-${k}`, 'opacity', on(B1.mag));
      TL4.forEach((l, i) => A(`${P}-t-${l.k}`, 'opacity', on(B1.tl + i * B1.tlStep)));
      A(`${P}-f3`, 'opacity', beat === 2 ? ease(t, 0, FD) : beat === 3 ? 1 - 0.5 * ease(t, 0, FD) : 0);
      A(`${P}-glow`, 'opacity', beat === 3 ? ease(t, PT.glow, PT.glow + FD) : 0);
    };
  },
};
