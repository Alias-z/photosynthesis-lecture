// RuBisCO's two reactions drawn as a mirrored pair (lecturer, 28 Oct 2026; brief research/redo-2026-10-28/
// RUBISCO_LAYOUT_BRIEF.md): the shared input RuBP (5 C) at the bottom, carboxylation on the left (CO₂ in from the left,
// 2 × 3-PGA out up-left, towards the cycle), oxygenation on the right (O₂ in from the right, 3-PGA + 2-phosphoglycolate out
// up-right, 2-phosphoglycolate to photorespiration), as slide 1 sets the light reactions against the carbon reactions.
// RuBisCO is our 8RUC render; molecules in carbon form; CO₂, O₂ atom balls; gas arrows grey, carbon arrows ink,
// photorespiration arrows in the deck's photorespiration colour. Text: names, the two headers and, with `counts`, the
// per-reaction carbon counts (5 C + 1 C = 2 × 3 C; 5 C = 3 C + 2 C).
import './cbb-schema.css';
import './cell-schema.css';
import './rubside.css';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { arrow, balls } from './cell-schema';
import { row } from './carbon-form';

type Pt = [number, number];
type A = 'start' | 'middle' | 'end';
const f = (v: number): string => (Math.round(v * 100) / 100).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const gl = (svg: string): string => `<g class="chn-g">${svg}</g>`;
const R = 12;
/** The 8RUC render (548 × 471 px) centred on c, `w` wide. Returns the markup and its box. */
function rubisco(c: Pt, w: number): { svg: string; x0: number; y0: number; x1: number; y1: number; k: number } {
  const k = w / 548, h = 471 * k, x0 = c[0] - w / 2, y0 = c[1] - h / 2;
  return { svg: `<image href="${rubPng}" x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}"/>`, x0, y0, x1: x0 + w, y1: y0 + h, k };
}
const svg = (id: string, say: string, body: string): string =>
  `<svg class="fig-svg cel rbs rbs-${id}" viewBox="0 0 800 600" role="img" aria-label="${say}">${body}${T(14, 592, 'structure: PDB 8RUC', 'rbs-cr', 'start')}${T(786, 592, 'RuBP: ribulose-1,5-bisphosphate · 3-PGA: 3-phosphoglycerate · 2-PG: 2-phosphoglycolate', 'rbs-cr', 'end')}</svg>`;

/** The products of one side, from the top: destination labels, names, the molecules; arrows from RuBisCO end under them.
 *  `xs` the molecules' centres, `fs` their formulas. */
interface Prod { x: number; f: string; name: string[]; to?: string; toCls?: string; k: 'c' | 'pr' }
function products(ps: Prod[], yRow: number, from: Pt, toY?: number): string {
  let out = '';
  for (const q of ps) {
    out += gl(row(q.x, yRow, q.f, { r: R }));
    q.name.forEach((ln, i) => { out += T(q.x, yRow - R - 12 - (q.name.length - 1 - i) * 20, ln, 'rbs-mn'); });
    if (q.to) out += T(q.x, toY ?? yRow - R - 16 - q.name.length * 20, q.to, `rbs-to${q.toCls ? ` ${q.toCls}` : ''}`);
    const end: Pt = [q.x, yRow + R + 8], mid: Pt = [(from[0] + end[0]) / 2, Math.max(from[1], end[1]) + 6];
    out += arrow([from, [mid[0], mid[1] - 8], end], q.k);
  }
  return out;
}

/** Variant r2: two halves like slide 1, pale tints, headers at the top of each half. */
export function rubsidePanel(id: string, counts = false): string {
  const rb = rubisco([400, 360], 190), yG = 372, rubpY = 524, yRow = 236;
  const body = `
    <rect class="rbs-tint-c" x="0" y="0" width="400" height="600"/><rect class="rbs-tint-o" x="400" y="0" width="400" height="600"/>
    <path class="rbs-div" d="M400,18V240"/>
    ${T(200, 50, 'carboxylation', 'rbs-h')}${T(600, 50, 'oxygenation', 'rbs-h rbs-h-o')}
    ${counts ? `${T(200, 80, '5 C + 1 C = 2 × 3 C', 'rbs-cnt')}${T(600, 80, '5 C = 3 C + 2 C', 'rbs-cnt')}` : ''}
    ${T(164, 166, '→ Calvin–Benson–Bassham cycle', 'rbs-to')}
    ${products([{ x: 100, f: 'CCCP', name: ['3-PGA'], k: 'c' }, { x: 228, f: 'CCCP', name: ['3-PGA'], k: 'c' }], yRow, [rb.x0 + 34, rb.y0 + 24])}
    ${products([{ x: 572, f: 'CCCP', name: ['3-PGA'], to: '→ cycle', k: 'c' }, { x: 700, f: 'CCP', name: ['2-PG'], to: '→ photorespiration', toCls: 'rbs-to-o', k: 'pr' }], yRow, [rb.x1 - 34, rb.y0 + 24], 166)}
    ${rb.svg}${T(400, rb.y0 - 12, 'RuBisCO', 'rbs-mn rbs-halo')}
    ${balls(68, yG, 'OCO', 13)}${T(68, yG - 26, 'CO₂', 'rbs-mn')}${counts ? T(68, yG + 38, '1 C', 'rbs-cnt') : ''}
    ${arrow([[110, yG], [rb.x0 - 2, yG]], 'gas')}
    ${balls(732, yG, 'OO', 13)}${T(732, yG - 26, 'O₂', 'rbs-mn')}
    ${arrow([[690, yG], [rb.x1 + 2, yG]], 'gas')}
    ${gl(row(400, rubpY, 'PCCCCCP', { r: R }))}${T(400, rubpY + R + 24, 'RuBP', 'rbs-mn')}${counts ? T(400, rubpY + R + 44, '5 C', 'rbs-cnt') : ''}
    ${arrow([[400, rubpY - R - 6], [400, rb.y1 + 4]], 'c')}`;
  return svg('panel', `RuBisCO's two reactions as two halves. Left half, carboxylation: CO2 comes in from the left; two 3-PGA leave up-left to the Calvin–Benson–Bassham cycle. Right half, oxygenation: O2 comes in from the right; 3-PGA leaves to the cycle and 2-phosphoglycolate to photorespiration. Both start from RuBP, 5 carbons, which comes up from below.${counts ? ' Carbon counts: 5 C + 1 C = 2 × 3 C; 5 C = 3 C + 2 C.' : ''}`, body);
}

/** Variant r3: a Y, RuBP the root, one arm per reaction (the products); the gases come in to RuBisCO's two faces. */
export function rubsideY(id: string, counts = false): string {
  // the gases bind at RuBisCO itself (its left and right faces, below where the arms leave); the arms carry the products
  const rb = rubisco([400, 372], 160), rubpY = 530, yRow = 186, yG = 386;
  const armL: Pt[] = [[rb.x0 + 16, rb.y0 + 20], [296, 262], [168, yRow + R + 10]], armR: Pt[] = [[rb.x1 - 16, rb.y0 + 20], [504, 262], [632, yRow + R + 10]];
  const name = (x: number, ln: string[]): string => ln.map((t, i) => T(x, yRow - R - 12 - (ln.length - 1 - i) * 20, t, 'rbs-mn')).join('');
  const body = `
    <rect class="rbs-bg" x="0" y="0" width="800" height="600"/>
    ${T(168, 50, 'carboxylation', 'rbs-h')}${T(632, 50, 'oxygenation', 'rbs-h rbs-h-o')}
    ${counts ? `${T(168, 80, '5 C + 1 C = 2 × 3 C', 'rbs-cnt')}${T(632, 80, '5 C = 3 C + 2 C', 'rbs-cnt')}` : ''}
    ${gl(row(104, yRow, 'CCCP', { r: R }))}${gl(row(232, yRow, 'CCCP', { r: R }))}${name(104, ['3-PGA'])}${name(232, ['3-PGA'])}
    ${gl(row(568, yRow, 'CCCP', { r: R }))}${gl(row(696, yRow, 'CCP', { r: R }))}${name(568, ['3-PGA'])}${name(696, ['2-PG'])}
    ${arrow(armL, 'c')}${arrow(armR, 'pr')}
    ${balls(182, yG, 'OCO', 13)}${T(182, yG + 36, 'CO₂', 'rbs-mn')}${counts ? T(182, yG + 56, '1 C', 'rbs-cnt') : ''}
    ${arrow([[224, yG], [rb.x0 - 2, yG]], 'gas')}
    ${balls(618, yG, 'OO', 13)}${T(618, yG + 36, 'O₂', 'rbs-mn')}
    ${arrow([[588, yG], [rb.x1 + 2, yG]], 'gas')}
    ${rb.svg}${T(400, rb.y0 - 12, 'RuBisCO', 'rbs-mn rbs-halo')}
    ${gl(row(400, rubpY, 'PCCCCCP', { r: R }))}${T(400, rubpY + R + 24, 'RuBP', 'rbs-mn')}${counts ? T(400, rubpY + R + 44, '5 C', 'rbs-cnt') : ''}
    ${arrow([[400, rubpY - R - 6], [400, rb.y1 + 4]], 'c')}`;
  return svg('y', `RuBisCO's two reactions as a Y: RuBP, 5 carbons, at the root comes up into RuBisCO; the left arm, carboxylation, takes CO2 and ends in two 3-PGA; the right arm, oxygenation, takes O2 and ends in 3-PGA and 2-phosphoglycolate.${counts ? ' Carbon counts: 5 C + 1 C = 2 × 3 C; 5 C = 3 C + 2 C.' : ''}`, body);
}

/** Variant r4: the active site close up. The 8RUC render with the front large subunit's active site ringed (CABP position,
 *  rubisco-8ruc.json sites[0]) on the figure's axis; RuBP docked at the site from below in carbon form; CO₂ in from the
 *  left, O₂ from the right; the products leave on their own sides. */
export function rubsideClose(id: string, counts = false): string {
  const k = 440 / 548, x0 = 400 - 317.6 * k, y0 = 112, w = 548 * k, h = 471 * k;
  const site: Pt = [400, y0 + 309.5 * k];
  const yR = site[1] + 44, cap = (x: number, y: number, ww: number): string => `<rect class="dk-capr" x="${f(x - ww / 2 - 6)}" y="${f(y - R - 6)}" width="${f(ww + 12)}" height="${f(2 * R + 12)}" rx="${f(R + 6)}" style="fill:#fbfaf6;opacity:.92"/>`;
  const yP = 140;
  const lead = `M${f(site[0] + 22)},${f(site[1] - 12)}L${f(640)},${f(430)}`;
  const body = `
    <rect class="rbs-bg" x="0" y="0" width="800" height="600"/>
    <image href="${rubPng}" x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}"/>
    ${T(120, 46, 'carboxylation', 'rbs-h')}${T(680, 46, 'oxygenation', 'rbs-h rbs-h-o')}
    ${counts ? `${T(120, 74, '5 C + 1 C = 2 × 3 C', 'rbs-cnt')}${T(680, 74, '5 C = 3 C + 2 C', 'rbs-cnt')}` : ''}
    <circle class="rbs-siteh" cx="${f(site[0])}" cy="${f(site[1])}" r="24"/><circle class="rbs-site" cx="${f(site[0])}" cy="${f(site[1])}" r="24"/>
    ${cap(400, yR, 179)}${gl(row(400, yR, 'PCCCCCP', { r: R }))}
    ${arrow([[400, yR - R - 4], [400, site[1] + 26]], 'c', { halo: true })}
    ${T(400, yR + R + 26, 'RuBP', 'rbs-mn rbs-halo')}${counts ? T(400, yR + R + 46, '5 C', 'rbs-cnt rbs-halo') : ''}
    ${balls(64, site[1], 'OCO', 13)}${T(64, site[1] - 26, 'CO₂', 'rbs-mn')}${counts ? T(64, site[1] + 38, '1 C', 'rbs-cnt') : ''}
    ${arrow([[106, site[1]], [site[0] - 28, site[1]]], 'gas', { halo: true })}
    ${balls(736, site[1], 'OO', 13)}${T(736, site[1] - 26, 'O₂', 'rbs-mn')}
    ${arrow([[694, site[1]], [site[0] + 28, site[1]]], 'gas', { halo: true })}
    ${gl(row(70, yP, 'CCCP', { r: R }))}${gl(row(186, yP, 'CCCP', { r: R }))}${T(70, yP - R - 12, '3-PGA', 'rbs-mn')}${T(186, yP - R - 12, '3-PGA', 'rbs-mn')}
    ${arrow([[site[0] - 18, site[1] - 18], [260, 236], [128, yP + R + 12]], 'c', { halo: true })}
    ${gl(row(614, yP, 'CCCP', { r: R }))}${gl(row(730, yP, 'CCP', { r: R }))}${T(614, yP - R - 12, '3-PGA', 'rbs-mn')}${T(730, yP - R - 12, '2-PG', 'rbs-mn')}
    ${arrow([[site[0] + 18, site[1] - 18], [500, 230], [614, yP + R + 8]], 'c', { halo: true })}${arrow([[site[0] + 18, site[1] - 18], [580, 236], [730, yP + R + 8]], 'pr', { halo: true })}
    <path class="rbs-ldh" d="${lead}"/><path class="rbs-ld" d="${lead}"/>${T(646, 440, 'active site', 'rbs-mn rbs-halo', 'start')}
    ${T(400, y0 + h + 30, 'RuBisCO', 'rbs-mn rbs-halo')}`;
  void id;
  return svg('close', `Our space-filling render of spinach RuBisCO (PDB 8RUC) with one of its eight active sites ringed. RuBP, 5 carbons, sits docked at the site from below. CO2 comes in from the left: carboxylation, two 3-PGA leave up-left. O2 comes in from the right: oxygenation, 3-PGA and 2-phosphoglycolate leave up-right.${counts ? ' Carbon counts: 5 C + 1 C = 2 × 3 C; 5 C = 3 C + 2 C.' : ''}`, body);
}
