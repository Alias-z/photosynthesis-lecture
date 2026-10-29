// 'lf11a', staging c2sb · C₂ slide, a variant of the picked c2s (anim/c2-stack.ts): "the real cell" (captions C2S,
// anim/beats-c2s.ts; brief C2S_BRIEF.md, 30 Oct 2026).
// - The picked layout: the photorespiration strip on the left (dk2-common.ts sceneSvg, played once in beat 2), 2 stacked
//   panels on the right, C₃ and C₂, each a light micrograph (Khoshravesh et al. 2016, J. Exp. Bot., CC BY 3.0) with its
//   bundle sheath ringed, a lens and a round magnifier.
// - The C₂ magnifier IS the real bundle-sheath TEM (Khoshravesh et al. 2016, Homolepis aturensis, letters removed),
//   clipped to the circle. Its lens sits on the bundle-sheath cell to the right of the vein, so the TEM's orientation
//   matches the photo: vein on the left, mesophyll at the top right. Labelled with leaders: vein, mitochondria (the column
//   of small round bodies on the vein-side wall), chloroplasts (the long dark bodies stacked inward of them), vacuole,
//   mesophyll cell. Beat 1 also names, on the C₂ photo, "chloroplasts + mitochondria, packed on the vein side".
// - The C₃ magnifier stays drawn as in c2-stack.ts (no C₃ TEM): a mitochondrion (PDB 4LHC render), a chloroplast with
//   RuBisCO (PDB 8RUC), the plasma membrane, the wall, the air space.
// - The essence (lecturer, 30 Oct 2026: "in C₃ only about a quarter is recaptured; in C₂ it bounces around, cannot
//   escape, a little leaks out"): 4 CO₂ characters (slide 19's, co2-kit.ts kidG, each labelled "CO₂") per leaf, released
//   by the mitochondria one after the other; each takes a fixed, seeded bouncing walk (eased; one moves at a time).
//   C₃: 3 reach the air space and leave (glad), 1 touches the chloroplast and is caught (flash at RuBisCO, strained).
//   C₂: the walks bounce between the vein-side wall and the real chloroplasts; 3 are caught on a chloroplast (flash,
//   strained, they stay), the last slips out through the gap at the cell's corner (glad). Then each leaf's pill, the
//   C₂ chloroplast band glows, then the question (anim/player.ts, after the motion).
// - Glycine is dk-rf6's glyph (R = 11), at the strip's scale; in C₂ it comes from the mesophyll cell (top right) through
//   the wall and along the cell's rim to the mitochondria (it travels in the cytoplasm, not across the vacuole).
import steJpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import homJpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import temJpg from '../../assets/photos/c11a-homolepis-tem.jpg';
import gdcPng from '../../assets/cell/gdcp.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { atomBall, row } from '../figs/carbon-form';
import { arrow, balls, bilayer } from '../figs/cell-schema';
import { bilayerE, flashDefs, flashG, kidG, T, tangents, type Anchor } from './co2-kit';
import {
  attrSetter, camTf, cardSvg, curve, ease, f, frame, gasPath, glide, lerpV, litOf, mixLit, moverSvg, placer, sceneSvg, SP,
  Strip, uNear, type Cam, type LitMap, type Mover, type Path, type Put, type V,
} from './dk2-common';
import { C2S } from './beats-c2s';
import type { Staging } from './types';

const P = 'c2sb';
const R = 11, ST = 2.15 * R;

/* ---------------------------------------------------------------- glyphs (dk-rf6.ts, without the numbers) */

const bond = (x0: number, x1: number): string => `<path d="M${f(x0)},0H${f(x1)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>`;
/** 2-PG → glycolate → glycine: a 2-C body whose end atom changes (P, none, N); a red glow while it is 2-PG. */
const c2G = (k: string): string => `<ellipse data-k="${k}G" rx="44" ry="26" fill="url(#${P}-red)" opacity="0"/>`
  + `<g data-k="${k}P">${bond(0, ST)}${atomBall(ST, 0, 'P', R)}</g><g data-k="${k}N" opacity="0">${bond(0, ST)}${atomBall(ST, 0, 'N', R)}</g>`
  + `${row(-ST / 2, 0, 'CC', { r: R })}`;
/** The same glyph as glycine (its N on). */
const glyG = `${bond(0, ST)}${atomBall(ST, 0, 'N', R)}${row(-ST / 2, 0, 'CC', { r: R })}`;
const co2B = `<g class="chn-g">${balls(0, 0, 'OCO')}</g>`;
const o2B = `<g class="chn-g">${balls(0, 0, 'OO')}</g>`;

/** The strip's moving glyphs (strip units). */
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

/** The strip from the thylakoid end to just past the peroxisome, at 0.8, stage x 0–952, y 52–564. */
const CAM: Cam = frame(-10, 1180, 0, 952, -40, 52);
const WIN = { x: 0, y: 52, w: 952, h: 512 };
const toStage = (q: V): V => [800 + (q[0] - CAM.c[0]) * CAM.s, 370 + (q[1] - CAM.c[1]) * CAM.s];
const G = CAM.s;

const PG_AT: V = [SP.pg2[0] + 34, SP.pg2[1]];
const XP_AT: V = SP.oxyPga;
const GLY0: V = [SP.pg2[0] + 36, SP.pg2[1] + 2], GLY1: V = [606, 352];
const GOX_AT: V = [SP.gox[0] - 22, SP.gox[1] - 8];
/** Where the glycine waits: on the strip's glycine arrow, leaving the peroxisome for the mitochondrion. */
const GW: V = [1138, 116];
const P_RB = curve([[SP.rubp[0], SP.rubp[1] + 40], SP.rubp, SP.rubpFrom, SP.rubpTo]);
const P_CO2 = gasPath('co2', 110), P_O2 = gasPath('o2', 110);
const P_PGA = curve([[SP.rub[0] - 34, SP.rub[1] - 10], SP.carboxFrom, SP.carboxTo, SP.pga]);
const P_XP = curve([[SP.oxyPgaTo[0] - 5, SP.oxyPgaTo[1] + 24], SP.oxyPgaTo, XP_AT]);
const P_PG = curve([SP.oxyFrom, SP.oxyTo, PG_AT]);
/** dk-rf6's recycling run of molecule 1, out through PLGG1 and the peroxisome, ending on the glycine arrow. */
const RUN = curve([PG_AT, lerpV(GLY0, GLY1, 0.5), [690, 380], [760, 370], [818, 374], [880, 336], [934, 296], [982, 254], GOX_AT,
  [1084, 186], [1112, 150], GW]);
const U_GOX = uNear(RUN, GOX_AT);
/** Beat 2's times (s): each glide's start and length. */
const T2 = { rbA: [0.5, 1.0], co2: [1.5, 1.2], pga: [2.9, 1.0], ox: 4.0, rbB: [4.4, 1.0], o2: [5.4, 1.2], xp: [6.8, 0.8], pg: [7.7, 1.0], tox: 8.7, run: [10.0, 4.0] } as const;

/* ---------------------------------------------------------------- the panels (stage units) */

const CX = 1146, RM = 142, C3: V = [CX, 158], C2: V = [CX, 466];
const PH = { x: 1330, w: 256, k: 0.256, y3: 46, y2: 356 };
const ph = (y0: number, q: V): V => [PH.x + q[0] * PH.k, y0 + q[1] * PH.k];
/** C₃ magnifier: the mitochondrion, the chloroplast above it, the wall (W3 … W3 + 16) and the air space. */
const MT3: V = [1084, 180], CP3: V = [1098, 72], W3 = 1176;
/** C₂ magnifier: the TEM (741 × 744 px) at TS, its pixel TC on the magnifier's centre. */
const TS = 0.385, TC: V = [369, 375];
const tm = (x: number, y: number): V => [CX + (x - TC[0]) * TS, C2[1] + (y - TC[1]) * TS];

const GWs = toStage(GW), FORK: V = [952, 173];
const G3: Path = curve([GWs, FORK, [992, 167], [1040, 172], [MT3[0], MT3[1] - 2]]);
/** The C₂ arm: down past the C₃ magnifier, between the 2 cards, into the TEM's mesophyll cell (top right). */
const F2: V[] = [[FORK[0], FORK[1] + 3], [976, 246], [1024, 294], [1096, 309], [1180, 313], [1224, 338], [1238, 372]];
const F3: V[] = [FORK, [992, 167], [1026, 165]];
/** In the TEM: through the mesophyll/bundle-sheath wall, along the cell's rim (its cytoplasm, under the top-wall
 *  chloroplasts), down the top-left wall to the mitochondria on the vein side. */
const G2: Path = curve([GWs, ...F2, [1240, 382], tm(570, 175), tm(520, 150), tm(460, 127), tm(390, 134), tm(300, 146), tm(230, 152),
  tm(180, 178), tm(140, 218), tm(100, 268), tm(68, 322), tm(50, 360)]);

const band = (a: number, b: number, c: V, cls: string): string => `<rect class="${cls}" x="${f(a)}" y="${f(c[1] - RM)}" width="${f(b - a)}" height="${2 * RM}"/>`;
const fibres = (x: number, c: V): string => Array.from({ length: 12 }, (_, i) => {
  const y = c[1] - RM + 6 + i * 25;
  return `<path class="co2k-fib" d="M${f(x + (i % 3) * 4)},${f(y)}q4,7 0,14t0,14"/>`;
}).join('');
const pmV = (x: number, y0: number, y1: number): string => bilayer([{ L: [x, y0, x, y1] }], 5, 1.4, 3.8);
const granum = (x: number, y: number, w: number, n: number): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 7.5)}" width="${f(w)}" height="5" rx="2.5" style="stroke:#9fbf6e;stroke-width:1.1"/>`).join('');
/** A mitochondrion in the strip's look: the matrix, the outer and inner bilayer, its protein render (width gw). */
function mitoM(c: V, rx: number, ry: number, gw: number): string {
  return `<ellipse class="cel-matrix" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}"/>${bilayerE(c[0], c[1], rx, ry, 5)}${bilayerE(c[0], c[1], rx - 16, ry - 14, 5)}
    <image href="${gdcPng}" x="${f(c[0] - gw / 2)}" y="${f(c[1] - (gw * 222) / 302 / 2)}" width="${gw}" height="${f((gw * 222) / 302)}"/>`;
}
/** A chloroplast in the strip's look: stroma, 2 grana, the 2 envelope bilayers, RuBisCO (width rw). */
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
/** The C₂ magnifier: the TEM, and the glow over its chloroplast band (beat 4). */
function mag2(): string {
  const [x0, y0] = tm(0, 0), c = tm(112, 460);
  return `<image href="${temJpg}" x="${f(x0)}" y="${f(y0)}" width="${f(741 * TS)}" height="${f(744 * TS)}" preserveAspectRatio="none"/>
    <ellipse data-k="${P}-glow" opacity="0" cx="${f(c[0])}" cy="${f(c[1])}" rx="40" ry="96" transform="rotate(-21 ${f(c[0])} ${f(c[1])})" fill="url(#${P}-glowg)"/>`;
}
function magnifier(k: string, c: V, lens: V, lr: number, inner: string): string {
  return `<g data-k="${P}-${k}l" opacity="0"><path class="co2k-tan" d="${tangents(lens, lr, c, RM)}"/><circle class="co2k-lens" cx="${f(lens[0])}" cy="${f(lens[1])}" r="${lr}"/></g>
    <g data-k="${P}-${k}" opacity="0"><clipPath id="${P}-${k}c"><circle cx="${c[0]}" cy="${c[1]}" r="${RM}"/></clipPath>
    <circle class="co2k-inbg" cx="${c[0]}" cy="${c[1]}" r="${RM}"/><g clip-path="url(#${P}-${k}c)">${inner}</g><circle class="co2k-inring" cx="${c[0]}" cy="${c[1]}" r="${RM}"/></g>`;
}

/* ---------------------------------------------------------------- labels with leaders (on the TEM and the C₂ photo) */

const LD = 'fill:none;stroke-linecap:round';
/** Leader lines from `from` to each target, a dot at each target (dark on a paper halo, as cb-kit's leaders onto images). */
function leader(from: V, to: V[]): string {
  const d = to.map(p => `M${f(from[0])},${f(from[1])}L${f(p[0])},${f(p[1])}`).join('');
  return `<path d="${d}" style="${LD};stroke:#fffdf8;stroke-width:4;opacity:.9"/><path d="${d}" style="${LD};stroke:#141413;stroke-width:1.5"/>`
    + to.map(p => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="2.4" style="fill:#141413;stroke:#fffdf8;stroke-width:1.2"/>`).join('');
}
interface Lab { k: string; s: string; at: V; a: Anchor; from?: V; to?: V[] }
/** The TEM's names, in the order they come (beat 1). Targets checked on the image: the vein is the pale vascular cell
 *  beyond the left wall; the mitochondria the small round bodies at x 25–60, y 360–520; the chloroplasts the long dark
 *  bodies stacked inward of them (their lower end and the long one along the bottom wall); the mesophyll cell's
 *  chloroplast at the top right. */
const TL: Lab[] = [
  { k: 'vein', s: 'vein', at: [985, 452], a: 'middle', from: [994, 458], to: [tm(5, 400)] },
  { k: 'mt', s: 'mitochondria', at: [970, 606], a: 'start', from: [1004, 592], to: [tm(32, 455), tm(40, 497)] },
  { k: 'cp', s: 'chloroplasts', at: [1086, 578], a: 'start', from: [1090, 566], to: [tm(176, 586), tm(118, 548)] },
  { k: 'vac', s: 'vacuole', at: [1176, 500], a: 'middle' },
  { k: 'ms', s: 'mesophyll cell', at: [1268, 424], a: 'end', from: [1250, 410], to: [tm(640, 160)] },
];
const labSvg = (l: Lab): string => `<g data-k="${P}-t-${l.k}" opacity="0">${l.from && l.to ? leader(l.from, l.to) : ''}${lab(l.at[0], l.at[1], l.s, l.a)}</g>`;
/** Beat 1 on the C₂ photo: what the dark ring round the vein is (photo units: the ring's lower right, at the vein). */
const VS_AT: V = [1458, 561];
const vsSvg = (): string => `<g data-k="${P}-vs" opacity="0">${leader([1474, 549], [ph(PH.y2, [565, 490])])}
  ${T(VS_AT[0], VS_AT[1], 'chloroplasts + mitochondria,', 'co2k-il cel-halo', 'middle', ' style="font-size:15px"')}
  ${T(VS_AT[0], VS_AT[1] + 16, 'packed on the vein side', 'co2k-il cel-halo', 'middle', ' style="font-size:15px"')}</g>`;

/** A micrograph with its bundle sheath ringed (photo units: centre, radii) and its 2 names (photo units). */
interface Photo { y: number; href: string; ring: [number, number, number, number]; bs: V; ms: V; lens: V; lr: number }
const PH3: Photo = { y: PH.y3, href: steJpg, ring: [478, 360, 305, 345], bs: [480, 655], ms: [170, 165], lens: [110, 330], lr: 55 };
/** The C₂ lens on the bundle-sheath cell right of the vein (its vein side faces left, as in the TEM). */
const PH2: Photo = { y: PH.y2, href: homJpg, ring: [488, 414, 294, 240], bs: [254, 562], ms: [840, 105], lens: [690, 425], lr: 100 };
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
/** A moving glyph in stage units, at the strip's scale, its name inside the scaled group. */
const hudMover = (k: string, g: string, name: string, ny: number): string =>
  `<g data-k="m-${k}" opacity="0"><g transform="scale(${f(G)})">${g}<text class="cel-mn cel-halo" x="0" y="${ny}" text-anchor="middle">${name}</text></g></g>`;

/** Each leaf's fate of its 4 CO₂, on a paper pill under its photo (width fitted to the text in bind). */
const pill = (k: string, at: V, s: string, ink: string): string => `<g data-k="${P}-${k}" opacity="0"><rect data-k="${P}-${k}r" x="${at[0] - 140}" y="${at[1] - 15}" width="280" height="30" rx="15" style="fill:#fffdf8;stroke:#8a877d;stroke-width:1.4"/>
  ${T(at[0], at[1] + 5.5, s, 'co2k-ilb', 'middle', ` data-k="${P}-${k}t" style="font-size:16px;fill:${ink}"`)}</g>`;
const PILL3: V = [1458, 268], PILL2: V = [1458, 597];

/* ---------------------------------------------------------------- the CO₂ walks (stage units) */

/** A seeded generator (mulberry32): the same walk in every frame. */
function rnd(seed: number): () => number {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** The walk through its bounce points, each nudged by up to ±j px (seeded); the first and last stay where they are. */
function walk(q: V[], seed: number, j = 4): Path {
  const r = rnd(seed);
  return curve(q.map((p, i) => (i === 0 || i === q.length - 1 ? p : [p[0] + (r() * 2 - 1) * j, p[1] + (r() * 2 - 1) * j] as V)));
}
/** One CO₂: when it is released (t0, s into the beat), its walk, and its end: out (escapes) or caught (at the end). */
interface Run { p: Path; t0: number; end: 'out' | 'caught'; glad: (at: V, u: number) => number; fl?: V }
const WALK = 1.1, STEP = 1.4, KR = 7;
const out3 = (at: V): number => Math.min(1, Math.max(0, (at[0] - W3 - 20) / 30));
/** C₃: released in the mitochondrion one after the other; 3 leave through the wall to the air space, 1 is caught by the
 *  chloroplast (2nd). */
const RUN3: Run[] = [
  { p: walk([[1078, 176], [1122, 198], [1100, 160], [1148, 186], [1188, 176], [1226, 172], [1282, 176]], 31), t0: 3.0, end: 'out', glad: out3 },
  { p: walk([[1090, 184], [1128, 206], [1056, 200], [1044, 150], [1032, 118], [1062, 98]], 47), t0: 3.0 + STEP, end: 'caught', glad: () => 0, fl: CP3 },
  { p: walk([[1080, 188], [1056, 204], [1130, 212], [1150, 196], [1190, 210], [1232, 220], [1276, 218]], 59), t0: 3.0 + 2 * STEP, end: 'out', glad: out3 },
  { p: walk([[1088, 174], [1120, 160], [1064, 186], [1146, 176], [1192, 190], [1236, 196], [1282, 190]], 73), t0: 3.0 + 3 * STEP, end: 'out', glad: out3 },
];
/** C₂: released among the real mitochondria (vein-side wall); each bounces between the wall and the chloroplasts. 3 are
 *  caught at a chloroplast's tip (they stay, strained), the last slips out through the gap at the cell's lower corner. */
const T4 = 4.0;
const RUN2: Run[] = [
  { p: walk([[1032, 488], [1056, 500], [1032, 506], [1054, 516], [1032, 492], [1066, 478]], 11, 3), t0: T4, end: 'caught', glad: () => 0 },
  { p: walk([[1026, 460], [1044, 444], [1028, 434], [1046, 418], [1058, 436]], 23, 3), t0: T4 + STEP, end: 'caught', glad: () => 0 },
  { p: walk([[1032, 504], [1058, 530], [1040, 524], [1062, 544], [1048, 534], [1076, 520]], 37, 3), t0: T4 + 2 * STEP, end: 'caught', glad: () => 0 },
  { p: walk([[1028, 496], [1038, 510], [1038, 522], [1050, 540], [1052, 556], [1056, 578]], 53, 3), t0: T4 + 3 * STEP, end: 'out', glad: (_, u) => ease(u, 0.55, 0.85) },
];
/** The CO₂'s state at t (s into its beat): place, opacity, face; and the flash time if caught. */
interface Kid { at: V; o: number; s?: number; h?: number }
function kidOf(r: Run, t: number): Kid | undefined {
  if (t < r.t0) return undefined;
  const t1 = r.t0 + 0.15, u = ease(t, t1, t1 + WALK), at = r.p(u);
  const o = ease(t, r.t0, r.t0 + 0.25) * (r.end === 'out' ? 1 - ease(u, 0.8, 1) : 1);
  return { at, o, h: r.glad(at, u), s: r.end === 'caught' ? ease(t, t1 + WALK, t1 + WALK + 0.35) : 0 };
}
const catchT = (r: Run): number => r.t0 + 0.15 + WALK;

function hudSvg(): string {
  const defs = `<defs><radialGradient id="${P}-red"><stop offset="0" class="dk2-red0"/><stop offset=".6" class="dk2-red1"/><stop offset="1" class="dk2-red2"/></radialGradient>
    <radialGradient id="${P}-glowg"><stop offset="0" stop-color="#f6c453" stop-opacity=".6"/><stop offset=".7" stop-color="#f6c453" stop-opacity=".32"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient>
    ${flashDefs(P)}</defs>`;
  const L3 = ph(PH3.y, PH3.lens), L2 = ph(PH2.y, PH2.lens);
  const kid = (k: string): string => kidG(`${P}-${k}`, KR, 'CO₂', -KR - 7).replace('co2k-kl"', 'co2k-kl" style="font-size:14px"');
  const fl = (k: string): string => `<g data-k="${P}-${k}" opacity="0">${flashG(P, 22)}</g>`;
  return `${defs}${cardSvg(966, 4, 628, 302)}${cardSvg(966, 314, 628, 302)}
    ${photo('3', PH3)}${photo('2', PH2)}
    ${magnifier('m3', C3, L3, PH3.lr * PH.k, mag3())}${magnifier('m2', C2, L2, PH2.lr * PH.k, mag2())}
    ${photoNames('3', PH3)}${photoNames('2', PH2)}${vsSvg()}
    ${T(PH.x + PH.w / 2, 36, 'C₃ leaf', 'co2k-zl', 'middle', ' style="font-size:24px"')}${T(PH.x + PH.w / 2, 346, 'C₂ leaf', 'co2k-zl', 'middle', ' style="font-size:24px"')}
    <g class="chn-off">${arrow(F3, 'pr', { thin: true })}${arrow(F2, 'pr', { thin: true })}</g>
    <g data-k="${P}-f3" opacity="0">${arrow(F3, 'pr', { thin: true })}</g><g data-k="${P}-f2" opacity="0">${arrow(F2, 'pr', { thin: true })}</g>
    ${TL.map(labSvg).join('')}${fl('fl3')}${fl('fl2')}
    ${RUN3.map((_, i) => kid(`a${i}`)).join('')}${RUN2.map((_, i) => kid(`b${i}`)).join('')}
    ${hudMover('g3', glyG, 'glycine', -26)}${hudMover('g2', glyG, 'glycine', -26)}
    ${pill('p3', PILL3, 'C₃: about 1 in 4 recaptured', '#b0431f')}${pill('p2', PILL2, 'C₂: most recaptured, a little leaks', '#2f6f5f')}
    ${T(8, 734, '<tspan font-style="italic">Steinchisma laxum</tspan> (C₃), <tspan font-style="italic">Homolepis aturensis</tspan> (C₂, light micrograph and TEM): Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0)', 'co2k-cr', 'start')}
    ${T(1592, 734, 'RuBisCO: PDB 8RUC · mitochondrial protein: PDB 4LHC', 'co2k-cr', 'end')}`;
}

/* ---------------------------------------------------------------- lighting (the strip) */

const L_C0: LitMap = litOf(['rubisco', 'co2']), L_C: LitMap = { ...L_C0, carbox: 1 };
const L_O0: LitMap = { ...litOf(['co2', 'carbox'], 0.35), ...litOf(['rubisco', 'o2']) }, L_O: LitMap = { ...L_O0, oxy: 1 };
const L_R: LitMap = { ...litOf(['rubisco', 'co2', 'carbox', 'o2', 'oxy'], 0.35), 'glycolate:flow': 1, 'glycolate:body': 1, 'perox:mem': 1, 'perox-name': 1, 'glycine:flow': 1 };
const L_E: LitMap = { ...Object.fromEntries(Object.keys(L_R).map(k => [k, 0.3])), 'glycine:flow': 0.6 };
function lit(beat: number, t: number): LitMap {
  if (beat === 0) return {};
  // the gas and RuBisCO first; each reaction's word (and its product arrows) as its products leave, RuBP gone by then
  if (beat === 1) {
    if (t < 2.8) return mixLit({}, L_C0, ease(t, 0.1, 0.6));
    if (t < T2.ox) return mixLit(L_C0, L_C, ease(t, 2.8, 3.2));
    if (t < 6.7) return mixLit(L_C, L_O0, ease(t, T2.ox, T2.ox + 0.5));
    if (t < T2.run[0] - 0.4) return mixLit(L_O0, L_O, ease(t, 6.7, 7.1));
    return mixLit(L_O, L_R, ease(t, T2.run[0] - 0.4, T2.run[0] + 0.2));
  }
  return beat === 2 ? mixLit(L_R, L_E, ease(t, 0, 0.5)) : L_E;
}

/** The strip's names (strip units): [text, x, y, from (beat 2, s), to, class]; to = 99: kept to the end of beat 2. */
const NAMES: Array<[string, number, number, number, number, string?]> = [
  ['3-PGA', SP.pga[0], SP.pga[1] + 50, 3.4, 99],
  ['3-PGA', SP.oxyPga[0] + 80, SP.oxyPga[1] + 6, 7.3, 99],
  ['2-PG', SP.pg2[0] + 66, SP.pg2[1] - 32, 8.4, T2.run[0]],
  ['toxic: inhibits', SP.pg2[0] + 44, SP.pg2[1] + 62, T2.tox, T2.run[0], 'dk2-toxic'], ['enzymes of the cycle', SP.pg2[0] + 44, SP.pg2[1] + 82, T2.tox, T2.run[0], 'dk2-toxic'],
  ['glycine', GW[0], GW[1] - 26, T2.run[0] + T2.run[1] - 0.2, 99],
];

/* ---------------------------------------------------------------- the script */

/** Beat 1's times (s): the photo names, the vein-side note (hold), the lenses, the magnifiers, the TEM's names. */
const B1 = { bs: 0.4, ms: 1.2, vs: 2.0, hold: 2.6, lens: 2.8, mag: 3.2, tl: 3.9, tlStep: 0.3 } as const;
/** Beat 3 (C₃) and beat 4 (C₂): the glycine's glide, the hold before the CO₂, the pill, the glow. */
const B3 = { gly: [0.4, 2.2], hold: 2.9, pill: catchT(RUN3[3]) + 0.25 } as const;
const B4 = { gly: [0.5, 2.9], hold: T4 - 0.2, pill: catchT(RUN2[3]) + 0.25, glow: catchT(RUN2[3]) + 0.75 } as const;

function script(beat: number, t: number): { pos: Record<string, Put>; att: Record<string, number>; kid: Record<string, Kid> } {
  const pos: Record<string, Put> = {}, att: Record<string, number> = {}, kid: Record<string, Kid> = {};
  const g = (p: Path, s: readonly [number, number]): V => glide(p, t, s[0], s[1]);
  if (beat === 1) {
    pos.rbA = { at: g(P_RB, T2.rbA), o: ease(t, 0.3, 0.6) * (1 - ease(t, 2.6, 2.9)) };
    pos.co2 = { at: g(P_CO2, T2.co2), o: ease(t, 1.3, 1.6) * (1 - ease(t, 2.6, 2.9)) };
    pos.pgaC = { at: g(P_PGA, T2.pga), o: ease(t, 2.8, 3.1) };
    pos.rbB = { at: g(P_RB, T2.rbB), o: ease(t, 4.2, 4.5) * (1 - ease(t, 6.5, 6.8)) };
    pos.o2 = { at: g(P_O2, T2.o2), o: ease(t, 5.2, 5.5) * (1 - ease(t, 6.5, 6.8)) };
    pos.xp = { at: g(P_XP, T2.xp), o: ease(t, 6.7, 7.0) };
    const u = ease(t, T2.run[0], T2.run[0] + T2.run[1]);
    pos.pg = { at: t < T2.run[0] ? g(P_PG, T2.pg) : RUN(u), o: ease(t, 7.6, 7.9) };
    att.pgP = 1 - ease(t, T2.run[0], T2.run[0] + 0.4);
    att.pgN = ease(u, U_GOX - 0.03, U_GOX + 0.03);
    att.pgG = ease(t, T2.tox, T2.tox + 0.5) * (1 - ease(t, T2.run[0], T2.run[0] + 0.4));
  }
  // the strip's 3-PGA stay in the cycle, dimmed once the panels play
  if (beat >= 2) {
    const o = 1 - 0.6 * (beat === 2 ? ease(t, 0, 0.5) : 1);
    pos.pgaC = { at: SP.pga, o }; pos.xp = { at: XP_AT, o };
  }
  // C₃: the glycine (taking over from the strip's, in place) into the mesophyll mitochondrion; then its 4 CO₂, one at a time
  if (beat === 2) {
    pos.g3 = { at: g(G3, B3.gly), o: 1 - ease(t, 2.6, 2.85) };
    RUN3.forEach((r, i) => { const q = kidOf(r, t); if (q) kid[`a${i}`] = q; });
  }
  // C₂: a glycine from the mesophyll cell along the bundle-sheath cell's rim to its mitochondria; then its 4 CO₂
  if (beat === 3) {
    RUN3.forEach((r, i) => { const q = kidOf(r, 99); if (q) kid[`a${i}`] = q; });
    pos.g2 = { at: g(G2, B4.gly), o: ease(t, 0, 0.4) * (1 - ease(t, B4.gly[0] + B4.gly[1] + 0.1, B4.gly[0] + B4.gly[1] + 0.35)) };
    RUN2.forEach((r, i) => { const q = kidOf(r, t); if (q) kid[`b${i}`] = q; });
  }
  return { pos, att, kid };
}
/** The flash of the CO₂ being caught (one per leaf): its opacity and place. */
function flashOf(runs: Run[], t: number): { o: number; at: V } {
  for (const r of runs) {
    const tc = catchT(r);
    if (r.end === 'caught' && t > tc - 0.15 && t < tc + 0.6) return { o: ease(t, tc - 0.15, tc) * (1 - ease(t, tc + 0.1, tc + 0.6)), at: r.fl ?? r.p(1) };
  }
  return { o: 0, at: [0, 0] };
}

export const STAGING: Staging = {
  id: 'c2sb',
  name: 'c2sb · The real cell: the TEM in the C₂ magnifier',
  note: 'The picked c2s layout (the strip, 2 stacked panels); the C₂ magnifier is the real bundle-sheath TEM (Khoshravesh et al. 2016), labelled: vein, mitochondria, chloroplasts, vacuole, mesophyll cell. 4 labelled CO₂ characters per leaf, one bouncing at a time: C₃ 1 caught, 3 escape to the air space; C₂ 3 caught on the real chloroplasts, 1 leaks through a gap; the pills, the chloroplast band glows, the question',
  beats: C2S,
  holds: [[B1.hold], [T2.ox - 0.05, T2.run[0] - 0.5], [B3.hold], [B4.hold]],
  keys: [
    { beat: 3, text: 'What if the leaf pumped CO₂', x: 800, y: 656, size: 44 },
    { beat: 3, text: 'into the bundle sheath directly?', x: 800, y: 704, size: 44 },
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
    S.hide('perox', 'node'); S.hide('perox', 'text'); S.hide('mito', 'text');   // enzyme names and H₂O₂ off; "peroxisome" kept
    (stage.querySelector('[data-k="cam"]') as SVGGElement).setAttribute('transform', camTf(CAM));
    const put = placer(stage, [...MOV.map(m => m.k), 'g3', 'g2']), A = attrSetter(stage);
    // each pill fitted to its text
    for (const [k, c] of [['p3', PILL3], ['p2', PILL2]] as Array<[string, V]>) {
      const tx = stage.querySelector(`[data-k="${P}-${k}t"]`) as SVGTextElement | null, w = (tx?.getBBox().width ?? 250) + 30;
      const x = Math.min(c[0] - w / 2, 1588 - w);
      A(`${P}-${k}r`, 'x', x); A(`${P}-${k}r`, 'width', w); if (tx) A(`${P}-${k}t`, 'x', x + w / 2);
    }
    const kids = [...RUN3.map((_, i) => `a${i}`), ...RUN2.map((_, i) => `b${i}`)];
    return (beat, t) => {
      S.light(lit(beat, t));
      const { pos, att, kid } = script(beat, t);
      put(pos);
      // the CO₂ characters (co2-kit.ts kid(), on this staging's setter): hidden unless shown; one face at a time
      for (const k of kids) {
        const q = kid[k], key = `${P}-${k}`, o = q ? q.o : 0;
        A(key, 'display', o < 0.004 ? 'none' : 'inline'); A(key, 'opacity', o);
        if (!q || o < 0.004) continue;
        const s = q.s ?? 0, h = q.h ?? 0;
        A(key, 'transform', `translate(${f(q.at[0])} ${f(q.at[1])})`);
        A(`${key}-fn`, 'opacity', Math.max(0, 1 - s - h)); A(`${key}-fs`, 'opacity', s); A(`${key}-fh`, 'opacity', h);
        A(`${key}-sw`, 'opacity', 0); A(`${key}-sh`, 'opacity', 0); A(`${key}-l`, 'opacity', 1);
      }
      // the catch flashes, on the chloroplast where RuBisCO takes the CO₂
      for (const [k, runs, b] of [['fl3', RUN3, 2], ['fl2', RUN2, 3]] as Array<[string, Run[], number]>) {
        const fl = beat === b ? flashOf(runs, t) : { o: 0, at: [0, 0] as V };
        A(`${P}-${k}`, 'opacity', fl.o); if (fl.o > 0) A(`${P}-${k}`, 'transform', `translate(${f(fl.at[0])} ${f(fl.at[1])})`);
      }
      A(`${P}-p3`, 'opacity', beat === 2 ? ease(t, B3.pill, B3.pill + 0.5) : beat === 3 ? 1 : 0);
      A(`${P}-p2`, 'opacity', beat === 3 ? ease(t, B4.pill, B4.pill + 0.5) : 0);
      for (const [k, v] of Object.entries(att)) A(k, 'opacity', v);
      // the strip's names: in beat 2; the 3-PGA names fade as beat 3 begins; the glycine's passes to the panel's glycine
      NAMES.forEach(([s, , , t0, t1], i) => A(`${P}-nm${i}`, 'opacity', beat === 1 ? ease(t, t0, t0 + 0.4) * (t1 === 99 ? 1 : 1 - ease(t, t1, t1 + 0.4))
        : beat === 2 && t1 === 99 && s !== 'glycine' ? 1 - ease(t, 0, 0.4) : 0));
      // beat 1: on both photos the bundle sheath, then the mesophyll, named; on the C₂ photo what the dark ring is (hold);
      // then the lenses, the magnifiers and the TEM's names, one after the other
      const on = (t0: number): number => (beat > 0 ? 1 : ease(t, t0, t0 + 0.5));
      for (const k of ['3', '2']) { A(`${P}-bs${k}`, 'opacity', on(B1.bs)); A(`${P}-bsn${k}`, 'opacity', on(B1.bs)); A(`${P}-ms${k}`, 'opacity', on(B1.ms)); }
      A(`${P}-vs`, 'opacity', on(B1.vs));
      for (const k of ['m3l', 'm2l']) A(`${P}-${k}`, 'opacity', on(B1.lens));
      for (const k of ['m3', 'm2']) A(`${P}-${k}`, 'opacity', on(B1.mag));
      TL.forEach((l, i) => A(`${P}-t-${l.k}`, 'opacity', on(B1.tl + i * B1.tlStep)));
      // the arm of the split that plays is lit
      A(`${P}-f3`, 'opacity', beat === 2 ? ease(t, 0, 0.4) : beat === 3 ? 1 - 0.5 * ease(t, 0, 0.4) : 0);
      A(`${P}-f2`, 'opacity', beat === 3 ? ease(t, 0, 0.4) : 0);
      // beat 4, after the pill: the chloroplast band glows
      A(`${P}-glow`, 'opacity', beat === 3 ? ease(t, B4.glow, B4.glow + 0.9) : 0);
    };
  },
};
