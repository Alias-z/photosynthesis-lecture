// 'ovc' · How plants cope with scarce CO₂ (slide C10o; captions OV, anim/beats-ov.ts), layout c: the climate band over
// the strategy table (lecturer, 29 Oct 2026: "a summarized table … the strategy is what matters most: how they do it";
// "no one understands what the bar of CO₂ means": no gauge anywhere).
// - Beat 1, the problem, without a gauge: slide 19's CO₂ characters (co2-kit kidG) come in through the open 3D stoma
//   (the lecturer's render) to RuBisCO (PDB 8RUC); the stoma closes; RuBisCO fixes the ones round it and only 1 new one
//   squeezes in; O₂ crowds round RuBisCO.
// - Then the compact band at the top (cool, moist → hot, dry) and, under each type's place on it, its column: the head
//   (name, plant photo, share of species, credit), then "How it copes", "What it gains", "What it costs".
// - Last beat: rust arrows C₃ → C₂ → C₄ and C₃ → CAM across the column heads, "evolved from C₃, many times"; the question.
// Photos as in ov-b.ts (Wikimedia Commons), cropped, never stretched. The page figure: figs/cov-c.ts.
import st0 from '../../assets/photos/c10-stoma-3d-0.webp';
import st1 from '../../assets/photos/c10-stoma-3d-1.webp';
import st2 from '../../assets/photos/c10-stoma-3d-2.webp';
import st3 from '../../assets/photos/c10-stoma-3d-3.webp';
import st4 from '../../assets/photos/c10-stoma-3d-4.webp';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { OV } from './beats-ov';
import { actor, clamp, ease, f, from, kid, kidG, lerp, makeScene, o2G, T, type Api, type V } from './co2-kit';
import { curve } from './lf-common';
import { bandDefs, headAt, KINDS, type Kind } from './ov-b';
import type { Staging } from './types';

const P = 'ovc';
const RUB_AR = 471 / 548;

/* ================================================================ the table's content (shared with ovd and the figures) */

export interface Col {
  id: string; name: string; kind: Kind;
  /** Where it lives (on the band), the share of species, the photo's credit. */
  climate: string; share: string[]; credit: string;
  /** The 3 rows, wrapped for the stage. */
  how: string[]; gain: string[]; cost: string[];
}
const kind = (id: string): Kind => KINDS.find(k => k.id === id) as Kind;
export const COLS: Col[] = [
  { id: 'c3', name: 'C₃', kind: kind('c3'), climate: 'cool, moist', share: ['≈ 90 % of species'], credit: 'Hans Hillewaert, CC BY-SA 3.0',
    how: ['no extra step:', 'RuBisCO uses the CO₂', 'that diffuses in'], gain: ['no extra energy,', 'no special anatomy'], cost: ['on hot, dry days', 'oxygenation rises'] },
  { id: 'c2', name: 'C₂', kind: kind('c2'), climate: 'warm, sunny, dry', share: ['rare'], credit: 'Krzysztof Ziarnek, Kenraiz, CC BY-SA 4.0',
    how: ['traps the CO₂ that', 'photorespiration releases,', 'in the bundle sheath'], gain: ['most of that CO₂', 'is fixed again'], cost: ['RuBisCO still takes O₂'] },
  { id: 'c4', name: 'C₄', kind: kind('c4'), climate: 'hot, sunny grasslands', share: ['≈ 3 % of species,', 'yet ≈ a quarter of', 'land photosynthesis'], credit: 'High Contrast, CC BY 3.0 DE',
    how: ['pumps CO₂ into', 'the bundle sheath'], gain: ['RuBisCO hardly takes O₂;', 'less water per sugar'], cost: ['2 extra ATP per CO₂'] },
  { id: 'cam', name: 'CAM', kind: kind('cam'), climate: 'hot, dry: deserts, epiphytes', share: ['≈ 6 % of species'], credit: 'Fawaz.tairou, CC BY 4.0',
    how: ['takes CO₂ in at night,', 'stores it as malic acid,', 'uses it by day'], gain: ['stomata shut by day:', 'very little water lost'], cost: ['usually slow growth,', 'limited by the night’s store'] },
];
export const ROW_NAMES = ['How it copes', 'What it gains', 'What it costs'];

/** The photo, cropped to the box (x, y, w, h) round its window (uniform scale: never stretched). */
export function photoBox(id: string, k: Kind, x: number, y: number, w: number, h: number, rx = 8): string {
  const [cu, cv, uw0] = k.win, ar = h / w;
  let uw = uw0, vh = uw * ar;
  if (vh > k.photo.h) { vh = k.photo.h; uw = vh / ar; }
  if (uw > k.photo.w) { uw = k.photo.w; vh = uw * ar; }
  const u0 = Math.max(0, Math.min(k.photo.w - uw, cu - uw / 2)), v0 = Math.max(0, Math.min(k.photo.h - vh, cv - vh / 2)), sc = w / uw;
  return `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}"/></clipPath>
    <g clip-path="url(#${id})"><image href="${k.photo.href}" x="${f(x - u0 * sc)}" y="${f(y - v0 * sc)}" width="${f(k.photo.w * sc)}" height="${f(k.photo.h * sc)}" preserveAspectRatio="none"/></g>
    <rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" style="fill:none;stroke:#cfcabb;stroke-width:1.2"/>`;
}
/** Lines of text from (x, y), step dy, font size fs. */
export const lines = (x: number, y: number, ls: string[], dy: number, fs: number, cls = 'co2k-note', a: 'start' | 'middle' | 'end' = 'start'): string =>
  ls.map((l, i) => T(x, y + i * dy, l, cls, a, ` style="font-size:${fs}px"`)).join('');

/* ================================================================ the problem (beat 1; shared with ovd) */

const ST3D = [st0, st1, st2, st3, st4];
const STO: V = [470, 330], STO_W = 290, RUB: V = [1120, 330], RUB_W = 236;
/** Places round RuBisCO: 4 for CO₂ (left-up, left-down, right-up, right-down), the O₂ take the right side, top, bottom. */
const SLOT: V[] = [[958, 268], [958, 396], [1282, 268], [1282, 396]];
const O2_TO: V[] = [[1282, 262], [1282, 402], [1112, 206], [1112, 456]];
const O2_FROM: V[] = [[1570, 230], [1570, 440], [1440, 110], [1440, 560]];
const KR = 15;
const co2Path = (i: number, slot: V): V[] => [[70, 300 + (i % 2) * 40], [300, STO[1] - 8 + (i % 2) * 16], STO, [760, lerp(STO[1], slot[1], 0.5)], slot];
const paths = new Map<string, (u: number) => V>();
const along = (key: string, q: V[], u: number): V => { let c = paths.get(key); if (!c) { c = curve(q); paths.set(key, c); } return c(u); };

export function problemSvg(p: string): string {
  const stoma = ST3D.map((src, i) => actor(`${p}-st${i}`, `<image href="${src}" x="${STO[0] - STO_W / 2}" y="${STO[1] - STO_W / 2}" width="${STO_W}" height="${STO_W}"/>`)).join('');
  const rub = `<image href="${rubPng}" x="${f(RUB[0] - RUB_W / 2)}" y="${f(RUB[1] - (RUB_W * RUB_AR) / 2)}" width="${RUB_W}" height="${f(RUB_W * RUB_AR)}"/>`;
  const labs = `${T(STO[0], STO[1] + STO_W / 2 + 34, 'stoma', 'co2k-ilb', 'middle', ' style="font-size:20px"')}${T(RUB[0], 540, 'RuBisCO', 'co2k-ilb', 'middle', ' style="font-size:20px"')}`;
  const o2 = O2_TO.map((_, i) => actor(`${p}-o${i}`, `${o2G(13)}${T(32, 7, 'O₂', 'co2k-ilb', 'start', ' style="font-size:18px"')}`)).join('');
  return `${stoma}${actor(`${p}-pr`, rub + labs)}${[0, 1, 2, 3, 4].map(i => kidG(`${p}-q${i}`, KR)).join('')}${o2}
    ${actor(`${p}-cr0`, T(1586, 732, '3D stoma: own data · RuBisCO: PDB 8RUC', 'co2k-cr', 'end', ' style="font-size:14px"'))}`;
}
/** The problem at time t (s into beat 1), all of it times k (its fade-out). */
export function problemFrame(a: Api, p: string, t: number, k: number): void {
  if (k < 0.004) return;
  const on = k * ease(t, 0.1, 0.9);
  a.op(`${p}-pr`, on); a.op(`${p}-cr0`, on);
  const close = ease(t, 4.5, 6.1), kk = close * (ST3D.length - 1), lo = Math.min(ST3D.length - 2, Math.floor(kk));
  ST3D.forEach((_, i) => a.op(`${p}-st${i}`, on * (i === lo ? 1 : i === lo + 1 ? kk - lo : 0)));
  // 4 CO₂ come in through the open stoma, one after another, to the places round RuBisCO
  for (let i = 0; i < 4; i++) {
    const t0 = 1.0 + 0.55 * i, u = ease(t, t0, t0 + 1.6);
    // after the stoma closed, RuBisCO fixes 3 of them (they glide into it and fade); the 2nd stays
    const used = [6.3, -1, 6.8, 7.3][i], w = used < 0 ? 0 : ease(t, used, used + 0.9);
    const at = along(`${p}-${i}`, co2Path(i, SLOT[i]), u), q: V = [lerp(at[0], RUB[0], w * 0.7), lerp(at[1], RUB[1], w * 0.7)];
    kid(a, `${p}-q${i}`, q, k * ease(t, t0, t0 + 0.8) * (1 - w), { lab: 1 });
  }
  // only 1 new CO₂ squeezes in through the nearly shut pore, slowly
  const u = ease(t, 8.2, 10.2);
  kid(a, `${p}-q4`, along(`${p}-4`, co2Path(0, SLOT[0]), u), k * ease(t, 8.2, 9.0), { lab: 1, s: clamp((u - 0.15) * 4) * (1 - clamp((u - 0.85) * 6)) });
  // O₂ crowds round RuBisCO
  O2_TO.forEach((q1, i) => {
    const t0 = 10.4 + 0.35 * i, v = ease(t, t0, t0 + 1.3);
    a.put(`${p}-o${i}`, [lerp(O2_FROM[i][0], q1[0], v), lerp(O2_FROM[i][1], q1[1], v)], k * ease(t, t0, t0 + 0.8));
  });
}
export const PROBLEM_HOLDS = [4.4, 10.3];

/* ================================================================ the stage table */

/** Columns: the row names' x, the first column's x, the column width; the band; the lane for the arrows. */
export const COL0 = 210, CW = 340, colX = (j: number): number => COL0 + CW * j, colC = (j: number): number => colX(j) + CW / 2;
const BAND = { x: COL0, y: 8, w: CW * 4 - 20, h: 36 };
/** Rows: head (top, bottom), How, gains, costs (top, bottom); a cell's first baseline sits 36 under its top. */
const HEAD: [number, number] = [104, 238], ROWS: Array<[number, number]> = [[238, 362], [362, 464], [464, 566]];
const FS = 21, STEP = 27;
/** The evolution arrows across the column heads: C₃ → C₂, C₂ → C₄, C₃ → CAM over both. */
export const ARROWS: string[] = [
  `M${colC(0) + 40},100C${colC(0) + 90},70 ${colC(1) - 90},70 ${colC(1) - 40},100`,
  `M${colC(1) + 40},100C${colC(1) + 90},70 ${colC(2) - 90},70 ${colC(2) - 40},100`,
  `M${colC(0) - 30},100C${colC(0) - 20},62 ${colC(0) + 20},56 ${colC(0) + 120},56C${colC(3) - 260},56 ${colC(3) - 10},56 ${colC(3) + 10},100`,
];
export const EVO: V = [colC(2) + 120, 92];
const RUST = 'fill:none;stroke:#a9532f;stroke-width:3.4;stroke-linecap:round';
const HALO = 'fill:none;stroke:#fbfaf6;stroke-width:9;stroke-linecap:round';

export function arrowsSvg(p: string): string {
  return ARROWS.map((d, i) => actor(`${p}-a${i}`, `<path data-k="${p}-a${i}-h" d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" style="${HALO}"/>
    <path data-k="${p}-a${i}-s" d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" style="${RUST}"/>`) + actor(`${p}-a${i}-hd`, headAt(d))).join('')
    + actor(`${p}-evo`, T(EVO[0], EVO[1], 'evolved from C₃, many times', 'co2k-q', 'middle', ' style="font-size:20px"'));
}
/** The arrows in the last beat: C₃ → C₂, C₂ → C₄, (hold), C₃ → CAM, the words. */
export function arrowsFrame(a: Api, p: string, on: boolean, t: number): void {
  const draw = (i: number, t0: number, t1: number): void => {
    const u = on ? ease(t, t0, t1) : 0;
    a.op(`${p}-a${i}`, u > 0 ? 1 : 0);
    a.attr(`${p}-a${i}-h`, 'stroke-dashoffset', (1 - u).toFixed(4)); a.attr(`${p}-a${i}-s`, 'stroke-dashoffset', (1 - u).toFixed(4));
    a.op(`${p}-a${i}-hd`, on ? ease(t, t1 - 0.4, t1 + 0.4) : 0);
  };
  draw(0, 0.3, 1.3); draw(1, 1.5, 2.5); draw(2, 2.9, 4.7);
  a.op(`${p}-evo`, on ? ease(t, 5.0, 5.8) : 0);
}

function svg(): string {
  const band = `<rect x="${BAND.x}" y="${BAND.y}" width="${BAND.w}" height="${BAND.h}" rx="${BAND.h / 2}" fill="url(#${P}-band)" style="stroke:#d3c9ad;stroke-width:1.2"/>`;
  const rowNames = ROW_NAMES.map((r, i) => T(30, (ROWS[i][0] + ROWS[i][1]) / 2 + 7, r, 'co2k-zl', 'start', ' style="font-size:20px"')).join('');
  const cols = COLS.map((c, j) => {
    const x = colX(j), q = `${P}-${c.id}`;
    const card = `<rect class="co2k-card" x="${x + 6}" y="${HEAD[0]}" width="${CW - 12}" height="${ROWS[2][1] - HEAD[0]}" rx="14"/>
      ${ROWS.map(r => `<path d="M${x + 20},${r[0]}H${x + CW - 20}" style="fill:none;stroke:#e4dfd2;stroke-width:1.4"/>`).join('')}`;
    const head = `${card}${photoBox(`${q}-pc`, c.kind, x + 16, HEAD[0] + 10, 138, 96)}
      ${T(x + 166, HEAD[0] + 46, c.name, 'co2k-zl', 'start', ' style="font-size:44px"')}
      ${lines(x + 166, HEAD[0] + 70, c.share, 18, 15)}
      ${T(x + 16, HEAD[0] + 126, c.credit, 'co2k-cr', 'start', ' style="font-size:14px"')}`;
    const cell = (i: number, ls: string[]): string => actor(`${q}-r${i}`, lines(x + 22, ROWS[i][0] + 36, ls, STEP, FS));
    return actor(`${q}-hd`, head) + actor(`${q}-cl`, T(colC(j), BAND.y + 25, c.climate, 'co2k-zl', 'middle', ' style="font-size:17px"'))
      + cell(0, c.how) + cell(1, c.gain) + cell(2, c.cost);
  }).join('');
  return `<defs>${bandDefs(`${P}-band`)}</defs>
    ${problemSvg(P)}
    ${actor(`${P}-band`, band)}${actor(`${P}-rows`, rowNames)}${cols}${arrowsSvg(P)}
    ${actor(`${P}-cr5`, T(1586, 732, 'Plant photos: Wikimedia Commons', 'co2k-cr', 'end', ' style="font-size:14px"'))}`;
}

function frame(a: Api, beat: number, t: number): void {
  if (beat === 0) problemFrame(a, P, t, 1);
  if (beat === 1) problemFrame(a, P, 99, 1 - ease(t, 0.1, 0.9));
  const bandOn = from(beat, t, 1, 1.0, 1.9);
  a.op(`${P}-band`, bandOn); a.op(`${P}-rows`, bandOn);
  COLS.forEach((c, j) => {
    const b = j + 1, t0 = j === 0 ? 2.1 : 0.2, q = `${P}-${c.id}`, hd = from(beat, t, b, t0, t0 + 0.9);
    a.op(`${q}-hd`, hd); a.op(`${q}-cl`, hd);
    if (j === 0) a.op(`${P}-cr5`, hd);
    [0, 1, 2].forEach(i => { const r0 = t0 + 1.2 + i * 1.2; a.op(`${q}-r${i}`, from(beat, t, b, r0, r0 + 0.9)); });
  });
  arrowsFrame(a, P, beat === 5, t);
}

export const STAGING: Staging = {
  ...makeScene({
    id: 'ovc', name: 'ovc · the climate band over the strategy table', beats: OV,
    note: 'The problem without a gauge (CO₂ characters come in through the open 3D stoma to RuBisCO; it closes, fewer come, O₂ crowds in); then a compact climate band at the top and, under each type\'s place, its column: photo, name, share, then how it copes, what it gains, what it costs; arrows from C₃',
    holds: [PROBLEM_HOLDS, [3.2], [1.3], [1.3], [1.3], [2.7]],
    svg, frame,
  }),
  keys: [
    { beat: 5, text: 'How does a C₂ plant', x: 800, y: 632, size: 44 },
    { beat: 5, text: 'trap its CO₂?', x: 800, y: 682, size: 44 },
  ],
};
