// 'lf11a', staging c2sa · C₂ slide, a variant of the picked c2s (anim/c2-stack.ts): "c2s, labelled" (captions C2S,
// anim/beats-c2s.ts; brief C2S_BRIEF.md). The picked layout, unchanged: the photorespiration strip on the left (played once
// in beat 2), 2 stacked panels on the right, C₃ on top and C₂ below, each a micrograph (Khoshravesh et al. 2016, J. Exp.
// Bot., Fig. 1D and 1B, CC BY 3.0) with a lens and a round magnifier drawn in the strip's look (bilayers, RuBisCO PDB 8RUC).
// What is new (lecturer, 30 Oct 2026: "label every part, otherwise people get confused"; "in C₃ only about a quarter of the
// released CO₂ is recaptured; in C₂ it bounces around, cannot escape, and a little leaks out"):
// - Labels with thin leader lines on both photos: vein, bundle-sheath cells, mesophyll cells, air space; on the C₂ photo the
//   dark band round the vein is named "chloroplasts + mitochondria, packed on the vein side" (Khoshravesh 2016: in
//   H. aturensis the bundle-sheath mitochondria sit at the centripetal pole, surrounded by chloroplasts); on the C₃ photo the
//   pale bundle-sheath cells, "few organelles".
// - The magnifiers, labelled: C₃ (lens on a mesophyll cell): mitochondrion, chloroplasts with RuBisCO along the wall, cell
//   wall, air space. C₂ (lens on the bundle-sheath cell above the vein, so the vein side is at the bottom): air space and a
//   mesophyll cell on top, the cell wall with a plasmodesma, a row of chloroplasts (RuBisCO), behind them the mitochondria
//   against the vein-side wall, the vein.
// - Beat 3, C₃: glycine enters the mitochondrion; 4 CO₂ characters (slide 19's, labelled "CO₂") leave it one at a time on a
//   fixed bouncing path: 1 is caught at a chloroplast's RuBisCO (strained, a flash), 3 cross the wall into the air space
//   (glad). The pill "C₃: about 1 in 4 recaptured" (Busch et al. 2013: 24–38 %).
// - Beat 4, C₂: glycine through the plasmodesma to a bundle-sheath mitochondrion; 4 CO₂ bounce one at a time between the
//   vein-side wall and the chloroplasts: 3 are caught one by one at RuBisCO, the last slips through a gap between 2
//   chloroplasts and leaks into the air space. The pill "C₂: most recaptured, a little leaks", the glow, the question.
// No enzyme is named; the mitochondria are drawn with their cristae only. One thing moves at a time; holds after each step.
import steJpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import homJpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { atomBall, row } from '../figs/carbon-form';
import { arrow, balls, bilayer } from '../figs/cell-schema';
import { C2S } from './beats-c2s';
import { bilayerE, kidG, T, tangents } from './co2-kit';
import {
  attrSetter, camTf, cardSvg, curve, ease, f, frame, gasPath, glide, lerpV, litOf, mixLit, moverSvg, placer, sceneSvg, SP,
  Strip, uNear, type Cam, type LitMap, type Mover, type Path, type Put, type V,
} from './dk2-common';
import type { Staging } from './types';

const P = 'c2sa';
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

const CAM: Cam = frame(-10, 1180, 0, 952, -40, 52);
const WIN = { x: 0, y: 52, w: 952, h: 512 };
const toStage = (q: V): V => [800 + (q[0] - CAM.c[0]) * CAM.s, 370 + (q[1] - CAM.c[1]) * CAM.s];
const G = CAM.s;

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
const T2 = { rbA: [0.5, 1.0], co2: [1.5, 1.2], pga: [2.9, 1.0], ox: 4.0, rbB: [4.4, 1.0], o2: [5.4, 1.2], xp: [6.8, 0.8], pg: [7.7, 1.0], tox: 8.7, run: [10.0, 4.0] } as const;

/* ---------------------------------------------------------------- the panels (stage units) */

const CX = 1146, RM = 142, C3: V = [CX, 158], C2: V = [CX, 466];
const PH = { x: 1330, w: 256, k: 0.256, y3: 46, y2: 356 };
const ph = (y0: number, q: V): V => [PH.x + q[0] * PH.k, y0 + q[1] * PH.k];
/** Label size inside the magnifiers and on the photos (px). */
const LS = 13;
const lab = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle', fs = LS): string => T(x, y, s, 'co2k-il cel-halo', a, ` style="font-size:${fs}px"`);
/** A thin leader line from a label to the part it names, a dot at the part. */
const lead = (a: V, b: V): string => `<path d="M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}" style="fill:none;stroke:#3d3d3a;stroke-width:1.1"/><circle cx="${f(b[0])}" cy="${f(b[1])}" r="2.2" style="fill:#3d3d3a"/>`;

const fibresV = (x: number, y0: number, y1: number, skip: (y: number) => boolean = () => false): string => {
  const n = Math.floor((y1 - y0) / 25);
  return Array.from({ length: n }, (_, i) => { const y = y0 + 6 + i * 25; return skip(y + 7) ? '' : `<path class="co2k-fib" d="M${f(x + (i % 3) * 4)},${f(y)}q4,7 0,14t0,14"/>`; }).join('');
};
const fibresH = (y: number, x0: number, x1: number, skip: (x: number) => boolean = () => false): string => {
  const n = Math.floor((x1 - x0) / 25);
  return Array.from({ length: n }, (_, i) => { const x = x0 + 6 + i * 25; return skip(x + 7) ? '' : `<path class="co2k-fib" d="M${f(x)},${f(y + (i % 3) * 3)}q7,-4 14,0t14,0"/>`; }).join('');
};
const pmL = (x0: number, y0: number, x1: number, y1: number, half = 5): string => bilayer([{ L: [x0, y0, x1, y1] }], half, 1.4, 3.8);
const granum = (x: number, y: number, w: number, n: number): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 6.5)}" width="${f(w)}" height="4.4" rx="2.2" style="stroke:#9fbf6e;stroke-width:1"/>`).join('');
const RUB_H = 471 / 548;
/** A chloroplast: stroma, 2 grana, the double envelope (2 bilayers), RuBisCO (render width rw) at its centre. */
function chloro(c: V, rx: number, ry: number, rw: number): string {
  return `<ellipse class="co2k-strm" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}"/>${granum(c[0] - rx * 0.62, c[1] - 6, rx * 0.42, 2)}${granum(c[0] + rx * 0.62, c[1] - 6, rx * 0.42, 2)}
    ${bilayerE(c[0], c[1], rx, ry, 3)}${bilayerE(c[0], c[1], rx + 8, ry + 8, 3)}
    <image href="${rubPng}" x="${f(c[0] - rw / 2)}" y="${f(c[1] - (rw * RUB_H) / 2)}" width="${rw}" height="${f(rw * RUB_H)}"/>`;
}
/** A mitochondrion: matrix, outer and inner bilayer, cristae (inner-membrane folds from its top and bottom). */
function mito(c: V, rx: number, ry: number, folds: number[], fl: number): string {
  const ri = rx - 7, qi = ry - 7;
  const cr = folds.map((u, i) => {
    const x = c[0] + u * ri, h = qi * Math.sqrt(1 - u * u), s = i % 2 ? 1 : -1, y0 = c[1] + s * (h - 1);
    return bilayer([{ L: [x, y0, x, y0 - s * fl] }], 2.8, 1.1, 3);
  }).join('');
  return `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${ri}" ry="${qi}" style="fill:#f8e4d8"/>${bilayerE(c[0], c[1], rx, ry, 3)}${bilayerE(c[0], c[1], ri, qi, 3)}${cr}`;
}
const flashC = (k: string, at: V): string => `<circle data-k="${k}" opacity="0" cx="${f(at[0])}" cy="${f(at[1])}" r="26" fill="url(#${P}-flash)"/>`;

/* -- C₃ magnifier: a mesophyll cell (cytosol, mitochondrion, 2 chloroplasts along the wall), the wall, the air space */
const W3 = 1158;
const MT3: V = [1052, 166], CPA: V = [1106, 82], CPB: V = [1106, 240];
/** Where the C₃ CO₂ leave the mitochondrion, and their fixed bouncing paths: a escapes, b is caught at CPB, c, d escape. */
const O3: V = [1088, 168];
const K3: Path[] = [
  curve([O3, [1110, 186], [1128, 168], [1150, 158], [1176, 166], [1204, 176], [1232, 182]]),
  curve([O3, [1116, 148], [1136, 168], [1130, 194], [1112, 214], [CPB[0] + 2, CPB[1] - 4]]),
  curve([O3, [1114, 150], [1134, 132], [1124, 146], [1150, 132], [1182, 124], [1230, 128]]),
  curve([O3, [1108, 196], [1134, 188], [1146, 206], [1170, 216], [1200, 230], [1228, 236]]),
];
const CAUGHT3 = [false, true, false, false];
/** Beat 3's times (s): the glycine; each CO₂'s start (it then moves for D3 s); the pill. */
const TB3 = { gly: [0.4, 2.0], co2: [3.0, 4.35, 6.2, 7.55], pill: 9.0 } as const, D3 = 1.25;

function mag3(): string {
  const y0 = C3[1] - RM, y1 = C3[1] + RM;
  const band = (a: number, b: number, cls: string): string => `<rect class="${cls}" x="${f(a)}" y="${f(y0)}" width="${f(b - a)}" height="${2 * RM}"/>`;
  return `${band(CX - RM, W3, 'co2k-cyt')}${band(W3, W3 + 16, 'co2k-wallb')}${band(W3 + 16, CX + RM, 'co2k-ias')}
    ${fibresV(W3 + 3, y0, y1)}${pmL(W3 - 6, y0, W3 - 6, y1)}
    ${chloro(CPA, 26, 17, 28)}${chloro(CPB, 26, 17, 28)}${mito(MT3, 38, 25, [-0.78, -0.5, 0.06, 0.5, 0.8], 10)}
    ${flashC(`${P}-fl3`, CPB)}
    ${lab(1104, 50, 'chloroplast')}${lab(1110, 288, 'RuBisCO')}${lead([1110, 277], [CPB[0] + 2, CPB[1] + 6])}
    ${lab(1066, 126, 'mitochondrion')}${lab(1168, 37, 'cell wall')}${lab(1234, 86, 'air space')}`;
}

/* -- C₂ magnifier: the bundle-sheath cell above the vein; top: a mesophyll cell (left) and an air space; the outer wall with
 *    a plasmodesma; a row of 3 chloroplasts; behind them 2 mitochondria against the vein-side wall; the vein below */
const OW0 = 370, OW1 = 384, MW = 1092, PDX = 1060, VW0 = 546, VW1 = 560;
const CPY = 466, CP2s: V[] = [[1060, CPY], [1148, CPY], [1236, CPY]];
const MTY = 518, MT2s: V[] = [[1062, MTY], [1234, MTY]];
/** The C₂ CO₂: each leaves the mitochondrion the glycine entered, bounces in the pocket between the chloroplasts and the
 *  vein-side wall; a, b, c are caught (at CP2s 1, 2, 0), d slips through the gap between chloroplasts 1 and 2 into the air
 *  space. */
const O2: V = [1094, 516];
const K2: Path[] = [
  curve([O2, [1122, 532], [1146, 500], [1176, 530], [1194, 506], [1166, 492], [CP2s[1][0] + 4, CPY + 4]]),
  curve([O2, [1116, 498], [1146, 532], [1182, 498], [1200, 528], [1222, 500], [CP2s[2][0] - 4, CPY + 4]]),
  curve([O2, [1130, 530], [1160, 502], [1176, 530], [1146, 512], [1112, 532], [1094, 500], [CP2s[0][0] + 6, CPY + 4]]),
  curve([O2, [1132, 502], [1164, 532], [1196, 504], [1168, 528], [1150, 506], [1186, 496], [1192, 470], [1194, 440], [1188, 408],
    [1186, 384], [1188, 362], [1192, 356]]),
];
const CAUGHT2 = [1, 2, 0, -1];
/** Beat 4's times (s): the glycine; each CO₂'s start and length; the pill, the glow. */
const TB4 = { gly: [0.4, 2.8], co2: [3.8, 5.7, 7.6, 9.5], dur: [1.3, 1.3, 1.3, 2.0], pill: 11.7, glow: [12.1, 13.1] } as const;

function mag2(): string {
  const x0 = CX - RM, x1 = CX + RM, y0 = C2[1] - RM, y1 = C2[1] + RM;
  const rect = (a: number, b: number, c: number, d: number, cls: string, st = ''): string => `<rect class="${cls}" x="${f(a)}" y="${f(c)}" width="${f(b - a)}" height="${f(d - c)}"${st}/>`;
  // the vein: pale tissue with a few small cells
  const veinCells = [[1076, 568, 34, 20], [1114, 566, 30, 24], [1148, 570, 36, 22], [1188, 566, 30, 24], [1222, 570, 34, 20], [1096, 594, 30, 18], [1134, 596, 28, 16], [1170, 594, 32, 18], [1206, 594, 28, 16]]
    .map(([x, y, w, h]) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" rx="6" style="fill:#eef0e4;stroke:#c9c6b4;stroke-width:1.2"/>`).join('');
  const h = 10;
  const pd = `${rect(PDX - h, PDX + h, OW0 - 1, OW1 + 1, 'co2k-cyt')}
    ${pmL(PDX - h, OW0 - 8, PDX - h, OW1 + 8, 3.6)}${pmL(PDX + h, OW0 - 8, PDX + h, OW1 + 8, 3.6)}
    <path d="M${PDX},${OW0 - 9}V${OW1 + 9}" style="stroke:#b9a27a;stroke-width:2.4;stroke-dasharray:2 3;fill:none"/>`;
  const glow = `<g clip-path="url(#${P}-bsc)"><ellipse data-k="${P}-glow" opacity="0" cx="${CX}" cy="${(OW1 + VW0) / 2}" rx="170" ry="110" fill="url(#${P}-glowg)"/></g>`;
  return `${rect(x0, x1, y0, OW0, 'co2k-ias')}${rect(x0, MW, y0, OW0, 'co2k-cyt')}${rect(MW, MW + 12, y0, OW0, 'co2k-wallb')}
    ${rect(x0, x1, OW0, OW1, 'co2k-wallb')}${rect(x0, x1, OW1, VW0, 'co2k-cyt')}${rect(x0, x1, VW0, VW1, 'co2k-wallb')}${rect(x0, x1, VW1, y1, '', ' style="fill:#f4f5ec"')}
    ${veinCells}
    ${fibresH(OW0 + 3, x0, x1, x => Math.abs(x - PDX) < 18)}${fibresH(VW0 + 3, x0, x1)}${fibresV(MW + 2, y0, OW0)}
    ${pmL(x0, OW0 - 6, PDX - h, OW0 - 6)}${pmL(PDX + h, OW0 - 6, MW - 6, OW0 - 6)}${pmL(MW - 6, y0, MW - 6, OW0 - 6)}
    ${pmL(x0, OW1 + 6, PDX - h, OW1 + 6)}${pmL(PDX + h, OW1 + 6, x1, OW1 + 6)}${pmL(x0, VW0 - 6, x1, VW0 - 6)}${pd}
    ${glow}
    ${CP2s.map(c => chloro(c, 26, 14, 26)).join('')}
    ${mito(MT2s[0], 30, 16, [-0.7, -0.35, 0.05, 0.4, 0.75], 6)}${mito(MT2s[1], 30, 16, [-0.7, -0.35, 0.05, 0.4, 0.75], 6)}
    ${CP2s.map((c, i) => flashC(`${P}-fl2${i}`, c)).join('')}
    ${lab(1140, 342, 'air space')}
    ${lab(1076, 410, 'plasmodesma', 'start')}${lead([1074, 405], [PDX + 4, OW1 + 4])}
    ${lab(1236, 410, 'cell wall')}${lead([1236, 399], [1236, OW1 - 4])}
    ${lab(1236, 434, 'chloroplast')}
    ${lab(1148, 432, 'RuBisCO')}${lead([1148, 436], [1148, CPY - 6])}
    <g data-k="${P}-mtl">${lab(1148, 522, 'mitochondria')}${lead([1106, 518], [MT2s[0][0] + 26, MTY])}${lead([1190, 518], [MT2s[1][0] - 26, MTY])}</g>
    ${lab(CX, 592, 'vein side', 'middle', 14)}`;
}
function magnifier(k: string, c: V, lens: V, lr: number, inner: string): string {
  return `<g data-k="${P}-${k}l" opacity="0"><path class="co2k-tan" d="${tangents(lens, lr, c, RM)}"/><circle class="co2k-lens" cx="${f(lens[0])}" cy="${f(lens[1])}" r="${lr}"/></g>
    <g data-k="${P}-${k}" opacity="0"><clipPath id="${P}-${k}c"><circle cx="${c[0]}" cy="${c[1]}" r="${RM}"/></clipPath>
    <circle class="co2k-inbg" cx="${c[0]}" cy="${c[1]}" r="${RM}"/><g clip-path="url(#${P}-${k}c)">${inner}</g><circle class="co2k-inring" cx="${c[0]}" cy="${c[1]}" r="${RM}"/></g>`;
}

/* -- the photos: the bundle sheath ringed (photo units: centre, radii), the lens, the labels with their leaders */
interface PLab { s: string[]; at: V; to: V; a?: 'start' | 'middle' | 'end'; from?: V }
interface Photo { y: number; href: string; ring: [number, number, number, number]; lens: V; lr: number; labs: PLab[]; key?: PLab }
const PH3: Photo = {
  y: PH.y3, href: steJpg, ring: [478, 360, 305, 345], lens: [110, 330], lr: 55,
  labs: [
    { s: ['mesophyll cells'], at: [300, 62], to: [190, 150] },
    { s: ['vein'], at: [250, 488], to: [420, 440], a: 'middle' },
    { s: ['bundle-sheath cells'], at: [478, 712], to: [470, 610] },
    { s: ['air space'], at: [870, 610], to: [870, 440] },
    { s: ['few organelles'], at: [650, 268], to: [650, 330] },
  ],
};
const PH2: Photo = {
  y: PH.y2, href: homJpg, ring: [488, 414, 294, 240], lens: [440, 262], lr: 82,
  labs: [
    { s: ['mesophyll cells'], at: [790, 66], to: [632, 120] },
    { s: ['vein'], at: [230, 468], to: [450, 430] },
    { s: ['bundle-sheath cells'], at: [752, 486], to: [700, 372] },
    { s: ['air space'], at: [118, 600], to: [262, 578] },
  ],
  key: { s: ['chloroplasts + mitochondria,', 'packed on the vein side'], at: [560, 652], to: [560, 505] },
};
function plab(p: Photo, l: PLab, dk: string): string {
  const at = ph(p.y, l.at), to = ph(p.y, l.to), lh = 15;
  const top = at[1] - LS + 1, bot = at[1] + (l.s.length - 1) * lh + 3;
  const from: V = l.from ? ph(p.y, l.from) : [at[0], to[1] < top ? top - 1 : bot + 1];
  return `<g data-k="${dk}" opacity="0">${lead(from, to)}${l.s.map((s, i) => lab(at[0], at[1] + i * lh, s, l.a ?? 'middle')).join('')}</g>`;
}
function photo(k: string, p: Photo): string {
  const [cx, cy] = ph(p.y, [p.ring[0], p.ring[1]]), H = 740 * PH.k;
  return `<image href="${p.href}" x="${PH.x}" y="${p.y}" width="${PH.w}" height="${f(H)}" preserveAspectRatio="none"/>
    <rect x="${PH.x}" y="${p.y}" width="${PH.w}" height="${f(H)}" style="fill:none;stroke:#bdb9ad;stroke-width:1"/>
    ${k === '2' ? `<ellipse data-k="${P}-pglow" opacity="0" cx="${f(cx)}" cy="${f(cy)}" rx="${f(200 * PH.k)}" ry="${f(168 * PH.k)}" style="fill:none;stroke:#f6c453;stroke-width:40;stroke-opacity:.5"/>` : ''}
    <g data-k="${P}-bs${k}" opacity="0"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(p.ring[2] * PH.k)}" ry="${f(p.ring[3] * PH.k)}" style="fill:none;stroke:#2f6f5f;stroke-width:2;stroke-dasharray:6 4"/></g>`;
}
const photoLabels = (k: string, p: Photo): string => `${p.labs.map((l, i) => plab(p, l, `${P}-pl${k}${i}`)).join('')}${p.key ? plab(p, p.key, `${P}-pk${k}`) : ''}`;

const hudMover = (k: string, g: string, name: string, ny: number): string =>
  `<g data-k="m-${k}" opacity="0"><g transform="scale(${f(G)})">${g}<text class="cel-mn cel-halo" x="0" y="${ny}" text-anchor="middle">${name}</text></g></g>`;
const GWs = toStage(GW), FORK: V = [952, 173];
const G3: Path = curve([GWs, FORK, [992, 167], [1030, 166], [MT3[0], MT3[1] - 2]]);
const G2: Path = curve([GWs, [FORK[0], FORK[1] + 3], [968, 230], [990, 300], [1030, 336], [PDX - 4, 352], [PDX, OW0 + 6], [PDX + 6, 402],
  [1092, 424], [1104, 452], [1100, 486], [1080, 506], [MT2s[0][0] + 6, MTY - 2]]);
const F3: V[] = [FORK, [992, 167], [1010, 166]];
const F2: V[] = [[FORK[0], FORK[1] + 3], [968, 230], [990, 300], [1030, 334], [1046, 342]];

/** The CO₂ characters: 4 per panel, slide 19's (co2-kit kidG), at r 8, named "CO₂" (13 px). */
const KR = 8;
const kidSvg = (k: string): string => kidG(k, KR).replace('co2k-kl"', 'co2k-kl" style="font-size:13px"');
const K3K = ['k3a', 'k3b', 'k3c', 'k3d'], K2K = ['k2a', 'k2b', 'k2c', 'k2d'];

/** The pill under each photo, in the verdict's place. */
function pill(k: string, cx: number, cy: number, w: number, s: string, col: string): string {
  return `<g data-k="${P}-${k}" opacity="0"><rect x="${f(cx - w / 2)}" y="${f(cy - 17)}" width="${w}" height="34" rx="17" style="fill:#fffdf8;stroke:${col};stroke-width:1.6"/>
    ${T(cx, cy + 6, s, '', 'middle', ` style="font-size:17px;font-weight:700;fill:${col}"`)}</g>`;
}

function hudSvg(): string {
  const defs = `<defs><radialGradient id="${P}-red"><stop offset="0" class="dk2-red0"/><stop offset=".6" class="dk2-red1"/><stop offset="1" class="dk2-red2"/></radialGradient>
    <radialGradient id="${P}-glowg"><stop offset="0" stop-color="#f6c453" stop-opacity=".55"/><stop offset=".7" stop-color="#f6c453" stop-opacity=".3"/><stop offset="1" stop-color="#f6c453" stop-opacity=".1"/></radialGradient>
    <radialGradient id="${P}-flash"><stop offset="0" stop-color="#fff4d6"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".8"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
    <clipPath id="${P}-bsc"><rect x="${CX - RM}" y="${OW1}" width="${2 * RM}" height="${VW0 - OW1}"/></clipPath></defs>`;
  const L3 = ph(PH3.y, PH3.lens), L2 = ph(PH2.y, PH2.lens);
  return `${defs}${cardSvg(966, 4, 628, 302)}${cardSvg(966, 314, 628, 302)}
    ${photo('3', PH3)}${photo('2', PH2)}
    ${magnifier('m3', C3, L3, PH3.lr * PH.k, mag3())}${magnifier('m2', C2, L2, PH2.lr * PH.k, mag2())}
    ${photoLabels('3', PH3)}${photoLabels('2', PH2)}
    ${T(PH.x + PH.w / 2, 36, 'C₃ leaf', 'co2k-zl', 'middle', ' style="font-size:24px"')}${T(PH.x + PH.w / 2, 346, 'C₂ leaf', 'co2k-zl', 'middle', ' style="font-size:24px"')}
    <g class="chn-off">${arrow(F3, 'pr', { thin: true })}${arrow(F2, 'pr', { thin: true })}</g>
    <g data-k="${P}-f3" opacity="0">${arrow(F3, 'pr', { thin: true })}</g><g data-k="${P}-f2" opacity="0">${arrow(F2, 'pr', { thin: true })}</g>
    <g clip-path="url(#${P}-m3c)">${K3K.map(k => kidSvg(`${P}-${k}`)).join('')}</g><g clip-path="url(#${P}-m2c)">${K2K.map(k => kidSvg(`${P}-${k}`)).join('')}</g>
    ${hudMover('g3', glyG, 'glycine', -26)}${hudMover('g2', glyG, 'glycine', -26)}
    ${pill('v3', 1414, 272, 270, 'C₃: about 1 in 4 recaptured', '#b0431f')}
    ${pill('v2', 1414, 582, 318, 'C₂: most recaptured, a little leaks', '#2f6f5f')}
    ${T(8, 734, '<tspan font-style="italic">Steinchisma laxum</tspan> (C₃), <tspan font-style="italic">Homolepis aturensis</tspan> (C₂): Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0)', 'co2k-cr', 'start')}
    ${T(1592, 734, 'RuBisCO: PDB 8RUC', 'co2k-cr', 'end')}`;
}

/* ---------------------------------------------------------------- lighting (the strip) */

const L_C0: LitMap = litOf(['rubisco', 'co2']), L_C: LitMap = { ...L_C0, carbox: 1 };
const L_O0: LitMap = { ...litOf(['co2', 'carbox'], 0.35), ...litOf(['rubisco', 'o2']) }, L_O: LitMap = { ...L_O0, oxy: 1 };
const L_R: LitMap = { ...litOf(['rubisco', 'co2', 'carbox', 'o2', 'oxy'], 0.35), 'glycolate:flow': 1, 'glycolate:body': 1, 'perox:mem': 1, 'perox-name': 1, 'glycine:flow': 1 };
const L_E: LitMap = { ...Object.fromEntries(Object.keys(L_R).map(k => [k, 0.3])), 'glycine:flow': 0.6 };
function lit(beat: number, t: number): LitMap {
  if (beat === 0) return {};
  if (beat === 1) {
    if (t < 2.8) return mixLit({}, L_C0, ease(t, 0.1, 0.6));
    if (t < T2.ox) return mixLit(L_C0, L_C, ease(t, 2.8, 3.2));
    if (t < 6.7) return mixLit(L_C, L_O0, ease(t, T2.ox, T2.ox + 0.5));
    if (t < T2.run[0] - 0.4) return mixLit(L_O0, L_O, ease(t, 6.7, 7.1));
    return mixLit(L_O, L_R, ease(t, T2.run[0] - 0.4, T2.run[0] + 0.2));
  }
  return beat === 2 ? mixLit(L_R, L_E, ease(t, 0, 0.5)) : L_E;
}

const NAMES: Array<[string, number, number, number, number, string?]> = [
  ['3-PGA', SP.pga[0], SP.pga[1] + 50, 3.4, 99],
  ['3-PGA', SP.oxyPga[0] + 80, SP.oxyPga[1] + 6, 7.3, 99],
  ['2-PG', SP.pg2[0] + 66, SP.pg2[1] - 32, 8.4, T2.run[0]],
  ['toxic: inhibits', SP.pg2[0] + 44, SP.pg2[1] + 62, T2.tox, T2.run[0], 'dk2-toxic'], ['enzymes of the cycle', SP.pg2[0] + 44, SP.pg2[1] + 82, T2.tox, T2.run[0], 'dk2-toxic'],
  ['glycine', GW[0], GW[1] - 26, T2.run[0] + T2.run[1] - 0.2, 99],
];

/* ---------------------------------------------------------------- the script */

/** The CO₂ character's state: place, opacity, face (s strained, h glad), its name's opacity. */
interface Kid { at: V; o: number; s?: number; h?: number; l?: number }
/** One CO₂ on its path from t0 for d s: it fades in at the mitochondrion; caught ones turn strained near the end and are
 *  taken up at RuBisCO (a flash, then gone); escaped ones turn glad in the air space (x beyond gx) and stay. */
function co2At(p: Path, t: number, t0: number, d: number, caught: boolean, gx: number, gy = Infinity): Kid | undefined {
  if (t < t0 - 0.2) return undefined;
  const at = glide(p, t, t0, d), te = t0 + d;
  if (caught) {
    const o = ease(t, t0 - 0.2, t0 + 0.05) * (1 - ease(t, te + 0.05, te + 0.4));
    return o < 0.004 ? undefined : { at, o, s: ease(t, te - 0.45, te - 0.1) };
  }
  const out = Math.max(Math.min(1, Math.max(0, (at[0] - gx) / 26)), Math.min(1, Math.max(0, (gy - at[1]) / 18)));
  return { at, o: ease(t, t0 - 0.2, t0 + 0.05), h: out, l: gy < Infinity ? 1 - out : 1 };
}
function script(beat: number, t: number): { pos: Record<string, Put>; att: Record<string, number>; kid: Record<string, Kid>; fl: Record<string, number> } {
  const pos: Record<string, Put> = {}, att: Record<string, number> = {}, kid: Record<string, Kid> = {}, fl: Record<string, number> = {};
  const g = (p: Path, s: readonly [number, number]): V => glide(p, t, s[0], s[1]);
  const flashAt = (tf: number): number => ease(t, tf - 0.15, tf) * (1 - ease(t, tf + 0.1, tf + 0.55));
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
  if (beat >= 2) {
    const o = 1 - 0.6 * (beat === 2 ? ease(t, 0, 0.5) : 1);
    pos.pgaC = { at: SP.pga, o }; pos.xp = { at: XP_AT, o };
  }
  // C₃: the glycine into the mesophyll mitochondrion; then 4 CO₂ leave it one at a time: 1 caught, 3 to the air space
  if (beat === 2) {
    pos.g3 = { at: glide(G3, t, TB3.gly[0], TB3.gly[1]), o: 1 - ease(t, 2.5, 2.75) };
    K3.forEach((p, i) => { const q = co2At(p, t, TB3.co2[i], D3, CAUGHT3[i], W3 + 6); if (q) kid[K3K[i]] = q; });
    fl[`${P}-fl3`] = flashAt(TB3.co2[1] + D3);
  }
  if (beat === 3) {
    K3.forEach((p, i) => { if (!CAUGHT3[i]) kid[K3K[i]] = { at: p(1), o: 1, h: 1 }; });
    pos.g2 = { at: glide(G2, t, TB4.gly[0], TB4.gly[1]), o: ease(t, 0, 0.4) * (1 - ease(t, 3.3, 3.55)) };
    // C₂: 4 CO₂ from the bundle-sheath mitochondrion, one at a time, bouncing between the vein-side wall and the
    // chloroplasts; 3 caught at RuBisCO, the last slips out through a gap into the air space
    K2.forEach((p, i) => {
      const q = co2At(p, t, TB4.co2[i], TB4.dur[i], CAUGHT2[i] >= 0, Infinity, OW0 + 4);
      if (q) kid[K2K[i]] = q;
      if (CAUGHT2[i] >= 0) fl[`${P}-fl2${CAUGHT2[i]}`] = Math.max(fl[`${P}-fl2${CAUGHT2[i]}`] ?? 0, flashAt(TB4.co2[i] + TB4.dur[i]));
    });
  }
  return { pos, att, kid, fl };
}

export const STAGING: Staging = {
  id: 'c2sa',
  name: 'c2sa · c2s, labelled',
  note: 'The picked c2s layout (strip left, C₃ and C₂ panels right) with every part labelled on both photos and in both magnifiers; C₃: 4 CO₂ leave the mesophyll mitochondrion, 1 caught at RuBisCO, 3 escape to the air space; C₂: 4 CO₂ bounce between the vein-side wall and the chloroplasts, 3 caught one by one, 1 leaks',
  beats: C2S,
  holds: [[2.3], [3.9, 9.7], [2.78, 8.95], [3.58, 11.6]],
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
    S.hide('perox', 'node'); S.hide('perox', 'text'); S.hide('mito', 'text');
    (stage.querySelector('[data-k="cam"]') as SVGGElement).setAttribute('transform', camTf(CAM));
    const put = placer(stage, [...MOV.map(m => m.k), 'g3', 'g2']), A = attrSetter(stage);
    return (beat, t) => {
      S.light(lit(beat, t));
      const { pos, att, kid, fl } = script(beat, t);
      put(pos);
      for (const k of [...K3K, ...K2K]) {
        const q = kid[k], key = `${P}-${k}`, o = q ? q.o : 0;
        A(key, 'display', o < 0.004 ? 'none' : 'inline'); A(key, 'opacity', o);
        if (!q || o < 0.004) continue;
        const s = q.s ?? 0, h = q.h ?? 0;
        A(key, 'transform', `translate(${f(q.at[0])} ${f(q.at[1])})`);
        A(`${key}-fn`, 'opacity', Math.max(0, 1 - s - h)); A(`${key}-fs`, 'opacity', s); A(`${key}-fh`, 'opacity', h);
        A(`${key}-sw`, 'opacity', 0); A(`${key}-sh`, 'opacity', 0); A(`${key}-l`, 'opacity', q.l ?? 1);
      }
      for (const k of [`${P}-fl3`, `${P}-fl20`, `${P}-fl21`, `${P}-fl22`]) A(k, 'opacity', fl[k] ?? 0);
      A(`${P}-v3`, 'opacity', beat === 2 ? ease(t, TB3.pill, TB3.pill + 0.4) : beat === 3 ? 1 : 0);
      A(`${P}-v2`, 'opacity', beat === 3 ? ease(t, TB4.pill, TB4.pill + 0.4) : 0);
      for (const [k, v] of Object.entries(att)) A(k, 'opacity', v);
      NAMES.forEach(([s, , , t0, t1], i) => A(`${P}-nm${i}`, 'opacity', beat === 1 ? ease(t, t0, t0 + 0.4) * (t1 === 99 ? 1 : 1 - ease(t, t1, t1 + 0.4))
        : beat === 2 && t1 === 99 && s !== 'glycine' ? 1 - ease(t, 0, 0.4) : 0));
      // beat 1: the C₃ photo's labels, then the C₂ photo's, then its dark band named; (hold) the lenses, the magnifiers
      const on = (t0: number): number => (beat > 0 ? 1 : ease(t, t0, t0 + 0.4));
      PH3.labs.forEach((_, i) => A(`${P}-pl3${i}`, 'opacity', on(0.3)));
      A(`${P}-bs3`, 'opacity', on(0.3));
      PH2.labs.forEach((_, i) => A(`${P}-pl2${i}`, 'opacity', on(0.9)));
      A(`${P}-bs2`, 'opacity', on(0.9));
      A(`${P}-pk2`, 'opacity', on(1.6));
      for (const k of ['m3l', 'm2l']) A(`${P}-${k}`, 'opacity', on(2.5));
      for (const k of ['m3', 'm2']) A(`${P}-${k}`, 'opacity', on(2.9));
      A(`${P}-f3`, 'opacity', beat === 2 ? ease(t, 0, 0.4) : beat === 3 ? 1 - 0.5 * ease(t, 0, 0.4) : 0);
      A(`${P}-f2`, 'opacity', beat === 3 ? ease(t, 0, 0.4) : 0);
      // while the C₂ CO₂ bounce in the pocket, the mitochondria's name steps back so that it never covers them
      A(`${P}-mtl`, 'opacity', beat === 3 ? 1 - 0.75 * ease(t, TB4.co2[0] - 0.3, TB4.co2[0]) * (1 - ease(t, TB4.co2[3] + 1.0, TB4.co2[3] + 1.4)) : 1);
      const glow = beat === 3 ? ease(t, TB4.glow[0], TB4.glow[1]) : 0;
      A(`${P}-glow`, 'opacity', glow); A(`${P}-pglow`, 'opacity', glow);
    };
  },
};
