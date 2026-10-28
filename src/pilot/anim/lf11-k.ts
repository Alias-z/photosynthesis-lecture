// 'lf11', staging k · C₃ leaves: refixation of photorespired CO₂ (slide C11; beats-co2.ts LF11K; brief
// research/redo-2026-10-29/CO2_DIFFUSION_STORY_BRIEF.md). Two mesophyll cells side by side in the drawn style of lf10,
// the leaf air space above them with parts of two neighbouring cells.
// - Left (hypothetical): mitochondria at the wall, in a gap between chloroplasts; all 4 CO₂ escape to the air space.
// - Right (C₃ leaf, e.g. rice, wheat): chloroplasts, joined by stromules, cover the wall facing the air space; the
//   mitochondria sit behind them, towards the vacuole (Sage & Sage 2009: chloroplasts and stromules cover > 95 % of the
//   cell periphery in rice, mitochondria in the cell interior; Busch et al. 2013: rice, wheat).
// Per 2 O₂: 2 glycolate → peroxisome → 2 glycine → mitochondrion → 1 CO₂; 4 rounds release CO₂ 1–4 in each cell. Right:
// CO₂ 1 is refixed in the chloroplast in front (24–38 % refixed inside the cell, Busch et al. 2013), CO₂ 2–4
// reach the air space, a neighbouring cell takes up CO₂ 3. Heat: 4 faster rounds release CO₂ 5–8; CO₂ 5 is refixed.
import { LF11K } from './beats-co2';
import {
  actor, along, blob, carbG, chloroG, closed, co2G, ease, f, fade, flash, flashDefs, flashG, glide, lerp, makeScene, mitoG,
  o2G, peroxG, rbox, stromuleG, T, thermoG, thermoSet, tickG, type Api, type V,
} from './co2-kit';
import { keyLines } from './stage-keys';
import type { Staging } from './types';

const p = 'lfk11';
const TOP = 112, H = 576;
const CELL = { l: rbox(40, TOP, 480, H, 90), r: rbox(570, TOP, 480, H, 90) };
/** The photorespiration unit of each cell: chloroplast (RuBisCO), peroxisome, mitochondrion, where its CO₂ waits. */
const U = {
  l: { cp: [200, 138] as V, px: [196, 236] as V, mt: [282, 136] as V, out: (i: number): V => [244 + i * 60, 190], air: [282, 112] as V },
  r: { cp: [810, 136] as V, px: [892, 196] as V, mt: [810, 190] as V, out: (i: number): V => [726 + i * 60, 246], air: [810, 112] as V },
};
type Side = 'l' | 'r';
const NB = { l: blob(150, -46, 150, 84, 2), r: blob(960, -44, 150, 84, 5) };
const NB_CP: V = [948, 34];

function cellSvg(side: Side): string {
  const q = CELL[side], x0 = side === 'l' ? 40 : 570, u = U[side];
  const vac = `<path class="co2k-vac" d="${closed(rbox(x0 + 64, TOP + 186, 352, H - 250, 60))}"/>`;
  // chloroplasts along the wall: in the right cell close-set, in the left with a gap at the top for the mitochondrion
  const skip = (pt: V): boolean => (side === 'l' ? Math.abs(pt[0] - u.mt[0]) < 58 && pt[1] < TOP + 60 : Math.abs(pt[0] - u.cp[0]) < 50 && pt[1] < TOP + 60) || (side === 'l' && Math.abs(pt[0] - u.cp[0]) < 40 && pt[1] < TOP + 60);
  const cps = along(q, side === 'r' ? 68 : 86, 22, skip).map(c => chloroG(c.p, c.a, side === 'r' ? 62 : 56, 22)).join('');
  // mitochondria and peroxisomes: in the right cell behind the chloroplasts, in the left at the wall
  const inner = side === 'r'
    ? [[640, 262, 1.4], [1000, 300, 1.7], [700, 640, 0.1], [960, 610, -0.4], [612, 450, 1.57]].map(([x, y, a]) => mitoG([x, y], a, 40, 22)).join('') + peroxG([620, 330], 11) + peroxG([986, 470], 11)
      + stromuleG([[780, 143], [766, 149], [748, 148]]) + stromuleG([[840, 143], [856, 149], [874, 147]]) + stromuleG([[1026, 246], [1024, 266], [1026, 286]]) + stromuleG([[594, 376], [592, 396], [594, 416]])
    : [[44 + 8, 330, 1.57], [520 - 8, 420, 1.57], [380, 688 - 6, 0]].map(([x, y, a]) => mitoG([x, y], a, 40, 22)).join('') + peroxG([496, 300], 11) + peroxG([80, 520], 11);
  return `<path class="co2k-cell" d="${closed(q)}" style="stroke-width:5"/>${vac}${cps}${inner}
    ${chloroG(u.cp, 0, 64, 24)}${mitoG(u.mt, 0, 48, 26)}${peroxG(u.px, 15)}`;
}

/* ---------------------------------------------------------------- actors: per cell, 4 rounds of 2 O₂ → 2 glycolate → 2 glycine → 1 CO₂ */

const ROUND = (k: number, fast = false): number => (fast ? 0.6 + k * 0.8 : 0.6 + k * 1.5);
function roundActors(side: Side, base: number): string {
  let s = '';
  for (let k = 0; k < 4; k++) for (const j of [0, 1]) {
    const n = base + k * 2 + j;
    s += actor(`${p}${side}o${n}`, o2G(8)) + actor(`${p}${side}g${n}`, carbG('CC', 9.6)) + actor(`${p}${side}y${n}`, carbG('CCN', 9.6));
  }
  return s;
}
const co2Actor = (side: Side, i: number): string => actor(`${p}${side}c${i}`, `${co2G(9)}${T(0, 27, `${i}`, 'co2k-num cel-halo')}`);
const ALL_C = [1, 2, 3, 4, 5, 6, 7, 8];

/** One round of photorespiration in a cell: 2 O₂ in, flash at RuBisCO, 2 glycolate to the peroxisome, 2 glycine to the
 *  mitochondrion, flash: 1 CO₂ (number i) appears at its waiting place. */
function round(a: Api, side: Side, n0: number, i: number, t: number, t0: number, k = 1): void {
  const u = U[side], d = (x: number): number => t0 + x * k;
  for (const j of [0, 1]) {
    const n = n0 + j, dx = j ? 14 : -14;
    const air: V = [u.cp[0] + dx * 2.2, 18];
    if (t > d(0) && t < d(1.0)) a.put(`${p}${side}o${n}`, glide([air, [u.cp[0] + dx, 70], [u.cp[0] + dx * 0.6, u.cp[1]]], t, d(0), d(0.75)), fade(t, d(0), d(0.15), d(0.75), d(0.9)));
    if (t > d(0.8) && t < d(1.7)) a.put(`${p}${side}g${n}`, glide([[u.cp[0] + 20, u.cp[1] + 6 * (j ? 1 : -1)], [(u.cp[0] + u.px[0]) / 2 + 6, u.px[1] - 18 + j * 10], [u.px[0] + (j ? 6 : -6), u.px[1]]], t, d(0.8), d(1.45)), fade(t, d(0.8), d(0.95), d(1.45), d(1.6)));
    if (t > d(1.5) && t < d(2.4)) a.put(`${p}${side}y${n}`, glide([[u.px[0] - 4, u.px[1] + (j ? 8 : -8)], [(u.px[0] + u.mt[0]) / 2, (u.px[1] + u.mt[1]) / 2 + 8 * (j ? 1 : -1)], [u.mt[0] + 10, u.mt[1]]], t, d(1.5), d(2.15)), fade(t, d(1.5), d(1.65), d(2.15), d(2.3)));
  }
  flash(a, t, d(0.8), u.cp, `${p}${side}f1`);
  flash(a, t, d(2.2), u.mt, `${p}${side}f2`);
  if (t > d(2.2)) a.put(`${p}${side}c${i}`, glide([u.mt, u.out((i - 1) % 4)], t, d(2.2), d(2.7)), ease(t, d(2.2), d(2.35)));
}

/* ---------------------------------------------------------------- the panel */

const PX = 1112, PW = 468;
// Only the 2 results (lecturer, 29 Oct 2026: "only the key information; too much text on the right side").
const rows = [
  { k: 'r3', y: 52, s: `<tspan class="co2k-pb">mitochondria at the wall:</tspan>` },
  { k: 'r3b', y: 80, s: 'the photorespired CO₂ escapes' },
  { k: 'r4', y: 136, s: `<tspan class="co2k-pb">chloroplasts in front (rice, wheat):</tspan>` },
  { k: 'r4b', y: 164, s: 'refixed inside the cell: 24–38 %' },
];
const panel = (): string => `<rect class="co2k-card" x="${PX}" y="16" width="${PW}" height="${184}" rx="16"/>
  ${rows.map(r => actor(`${p}${r.k}`, T(PX + 22, r.y, r.s, 'co2k-pr', 'start'))).join('')}
  ${actor(`${p}hot`, `${thermoG(`${p}th`, PX + 60, 470, 120)}<text data-k="${p}tt" class="co2k-zl" x="${PX + 92}" y="560" text-anchor="start">25 °C</text>${T(PX + 92, 586, 'leaf temperature', 'co2k-note', 'start')}`)}`;

/* ---------------------------------------------------------------- labels on the cells */

const lab = (k: string, x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle', ld?: [V, V]): string =>
  actor(`${p}L${k}`, `${ld ? `<path class="co2k-ld" d="M${f(ld[0][0])},${f(ld[0][1])}L${f(ld[1][0])},${f(ld[1][1])}"/>` : ''}${T(x, y, s, 'co2k-il cel-halo', a)}`);
const LABELS = [
  lab('cp', 676, 178, 'chloroplast', 'end', [[680, 172], [772, 140]]),
  lab('mt', 676, 206, 'mitochondrion', 'end', [[680, 200], [782, 192]]),
  lab('px', 946, 232, 'peroxisome', 'start', [[944, 226], [904, 206]]),
  lab('co', 692, 251, 'CO₂', 'end'),
  lab('vac', 810, 470, 'vacuole'),
  lab('as', 545, 64, 'air space'),
  lab('nb', 900, 22, 'neighbouring cell', 'middle'),
  lab('mtl', 420, 150, 'mitochondrion', 'start', [[416, 144], [310, 136]]),
  lab('cpl', 150, 196, 'chloroplast', 'middle', [[158, 182], [192, 152]]),
  lab('pxl', 196, 278, 'peroxisome'),
  lab('col', 438, 195, 'CO₂', 'start'),
  actor(`${p}Lsl`, `${T(280, 716, 'hypothetical:', 'co2k-zl')}${T(280, 736, 'mitochondria at the wall', 'co2k-zl')}`),
  actor(`${p}Lsr`, `${T(810, 716, 'C₃ leaf (rice, wheat):', 'co2k-zl')}${T(810, 736, 'chloroplasts in front of the mitochondria', 'co2k-zl')}`),
];

function svg(): string {
  return `<defs>${flashDefs(p)}</defs>
    <rect class="co2k-as" x="0" y="0" width="1096" height="740"/>
    ${(['l', 'r'] as Side[]).map(s => `<path class="co2k-cell" d="${closed(NB[s])}" style="stroke-width:4"/>${along(NB[s], 70, 20, pt => pt[1] < 0).map(c => chloroG(c.p, c.a, 58, 21)).join('')}`).join('')}
    ${chloroG(NB_CP, 0.06, 60, 22)}
    ${cellSvg('l')}${cellSvg('r')}
    ${LABELS.join('')}
    ${roundActors('l', 0)}${roundActors('r', 0)}${roundActors('r', 8)}
    ${ALL_C.slice(0, 4).map(i => co2Actor('l', i)).join('')}${ALL_C.map(i => co2Actor('r', i)).join('')}
    ${['l', 'r'].map(s => `${actor(`${p}${s}f1`, flashG(p, 26))}${actor(`${p}${s}f2`, flashG(p, 26))}`).join('')}${actor(`${p}f3`, flashG(p, 30))}${actor(`${p}f4`, flashG(p, 30))}
    ${actor(`${p}tk`, tickG('refixed'))}${actor(`${p}tk2`, tickG('taken up'))}
    ${panel()}`;
}

const LOST_L = (i: number): V[] => [U.l.out(i - 1), [U.l.mt[0] + 30 + (i - 2.5) * 8, 156], [U.l.mt[0] + 34 + (i - 2.5) * 8, U.l.air[1] - 2], [U.l.mt[0] + (i - 2.5) * 40, 56], [U.l.mt[0] + (i - 2.5) * 80, -30]];
const THROUGH = (i: number): V[] => [U.r.out(i - 1), [U.r.cp[0] + 40 + (i - 2.5) * 10, 214], [U.r.cp[0] + (i - 2.5) * 20, U.r.cp[1] + 6], [U.r.cp[0] + (i - 2.5) * 24, U.r.air[1] - 4]];
const OUT_R: Record<number, V[]> = {
  2: [[790, 98], [740, 54], [700, -30]], 3: [[810, 98], [870, 66], [NB_CP[0] - 10, NB_CP[1] + 4]], 4: [[830, 98], [880, 52], [900, -30]],
  6: [[790, 98], [720, 60], [660, -30]], 7: [[810, 98], [800, 50], [790, -30]], 8: [[830, 98], [870, 60], [930, -30]],
};

function frame(a: Api, beat: number, t: number): void {
  const from = (b: number, t0: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t0 + 0.5) : 0);
  // labels: name the parts first
  for (const k of ['cp', 'mt', 'px', 'as', 'cpl', 'mtl', 'pxl']) a.op(`${p}L${k}`, from(0, 0));
  // the vacuole's label goes in the last beat: the closing question takes its place
  a.op(`${p}Lvac`, beat < 3 ? from(0, 0) : 1 - ease(t, 0, 0.4));
  a.op(`${p}Lco`, beat < 2 ? from(0, 2.9) : beat === 2 ? 1 - ease(t, 0.4, 0.8) : 0); a.op(`${p}Lcol`, beat === 0 ? ease(t, 2.9, 3.4) : beat === 1 ? 1 - ease(t, 0.6, 1.0) : 0);
  a.op(`${p}Lnb`, from(2, 3.4));
  a.op(`${p}Lsl`, from(1, 0.2)); a.op(`${p}Lsr`, from(1, 0.4));
  // the panel
  a.op(`${p}r3`, from(1, 0.4)); a.op(`${p}r3b`, from(1, 3.8));
  a.op(`${p}r4`, from(2, 0.4)); a.op(`${p}r4b`, from(2, 2.4));
  a.op(`${p}hot`, from(3, 0));
  const temp = beat < 3 ? 25 : lerp(25, 35, ease(t, 0.3, 1.8));
  a.txt(`${p}tt`, `${Math.round(temp)} °C`); thermoSet(a, `${p}th`, 470, temp, 120);

  if (beat === 0) for (let k = 0; k < 4; k++) for (const s of ['l', 'r'] as Side[]) round(a, s, k * 2, k + 1, t, ROUND(k));
  // CO₂ 1–4 wait at their mitochondrion until they move
  const waitL = (i: number): boolean => beat === 0 ? t > ROUND(i - 1) + 2.7 : beat < 1;
  for (const i of [1, 2, 3, 4]) {
    if (beat === 0 && waitL(i)) { a.put(`${p}lc${i}`, U.l.out(i - 1)); a.put(`${p}rc${i}`, U.r.out(i - 1)); }
    if (beat >= 1) a.put(`${p}rc${i}`, U.r.out(i - 1));
  }
  if (beat === 1) for (const i of [1, 2, 3, 4]) {
    const t0 = 0.8 + (i - 1) * 0.7;
    a.put(`${p}lc${i}`, glide(LOST_L(i), t, t0, t0 + 2.2), 1);
  }
  if (beat === 2) {
    // CO₂ 1 is refixed in the chloroplast in front; CO₂ 2–4 cross it into the air space; a neighbour takes up CO₂ 3
    a.put(`${p}rc1`, glide([U.r.out(0), [U.r.cp[0] - 44, 210], [U.r.cp[0] - 22, U.r.cp[1] + 6]], t, 0.6, 1.8), 1 - ease(t, 1.8, 2.0));
    flash(a, t, 1.9, U.r.cp, `${p}f3`);
    a.put(`${p}tk`, [U.r.cp[0] + 44, U.r.cp[1] + 30], fade(t, 2.0, 2.4));
    for (const i of [2, 3, 4]) {
      const t0 = 1.4 + (i - 2) * 0.6, q = [...THROUGH(i), ...OUT_R[i]];
      a.put(`${p}rc${i}`, glide(q, t, t0, t0 + 3.0), i === 3 ? 1 - ease(t, t0 + 3.0, t0 + 3.2) : 1);
    }
    flash(a, t, 5.1, NB_CP, `${p}f4`);
    a.put(`${p}tk2`, [NB_CP[0] + 40, NB_CP[1] + 34], fade(t, 5.2, 5.6));
  }
  if (beat >= 2 && beat !== 2) for (const i of [1, 2, 3, 4]) a.op(`${p}rc${i}`, 0);
  if (beat === 3) {
    a.put(`${p}tk`, [U.r.cp[0] + 44, U.r.cp[1] + 30], 1 - ease(t, 0, 0.4));
    // 4 faster rounds: CO₂ 5–8; CO₂ 5 is refixed, 6–8 escape
    for (let k = 0; k < 4; k++) round(a, 'r', 8 + k * 2, 5 + k, t, 1.0 + k * 0.8, 0.8);
    for (const i of [5, 6, 7, 8]) {
      const tr = 1.0 + (i - 5) * 0.8 + 2.2 * 0.8 + 0.5, t0 = Math.max(tr + 0.2, 4.2 + (i - 5) * 0.8);
      if (t < tr) continue;
      if (i === 5) { a.put(`${p}rc5`, glide([U.r.out(0), [U.r.cp[0] - 44, 210], [U.r.cp[0] - 22, U.r.cp[1] + 6]], t, t0, t0 + 1.0), 1 - ease(t, t0 + 1.0, t0 + 1.2)); flash(a, t, t0 + 1.1, U.r.cp, `${p}f3`); }
      else a.put(`${p}rc${i}`, glide([...THROUGH(i - 4), ...OUT_R[i]], t, t0, t0 + 2.6), 1);
    }
  }
}

const BASE = makeScene({
  id: 'lf11k',
  name: 'k · Two cells: where the mitochondria sit',
  note: 'Two mesophyll cells in the drawn style of lf10: photorespiration releases CO₂ 1–4 in each; with mitochondria at the wall (left, hypothetical) all 4 escape; in the C₃ leaf (right) chloroplasts in front refix CO₂ 1 and a neighbouring cell takes up CO₂ 3; heat adds CO₂ 5–8',
  beats: LF11K,
  svg, frame,
});

/** The key lines on the stage (lecturer, 29 Oct 2026): each beat's take-home and the closing question. */
export const STAGING: Staging = { ...BASE, keys: [
  // not the beat's tag ('Photorespiration releases CO₂'), which the caption shows anyway
  ...keyLines(0, ['CO₂ released', 'in the mitochondria'], 1345, 300, { size: 38 }),
  ...keyLines(1, ['Chloroplasts between', 'mitochondria and air'], 1345, 300, { size: 38 }),
  ...keyLines(2, ['Chloroplasts in front', 'refix CO₂'], 1345, 300, { size: 38 }),
  ...keyLines(3, ['As the leaf warms,', 'oxygenation rises'], 1345, 300, { size: 38 }),
  // centred, inside the vacuole of the C₃ cell it asks about (its label is off in this beat), clear of the wall
  ...keyLines(3, ['Could a plant', 'release this CO₂', 'where RuBisCO', 'is concentrated?'], 800, 392, { size: 44, t0: 3.0 }),
] };
