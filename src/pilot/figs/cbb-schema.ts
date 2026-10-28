// CO₂ fixation in one overview, in the style of the light-reaction chain 7m1 (lecturer, 28 Oct 2026: "for the dark part we
// should do the same … one overview, then focus on one component at a time"). Brief: research/redo-2026-10-28/
// CBB_SCHEMA_BRIEF.md.
//
// Content (the relations of slide C6's picks a and v10): RuBisCO adds CO₂ to RuBP (carboxylation → 3-PGA) or O₂
// (oxygenation → 3-PGA + 2-phosphoglycolate); 3-PGA is reduced to triose phosphate with ATP and NADPH from the thylakoids;
// 5 of 6 triose phosphates regenerate RuBP with ATP, 1 of 6 leaves: to sucrose in the cytosol (in exchange for Pᵢ) or to
// starch in the chloroplast. Photorespiration: 2-phosphoglycolate → glycolate → peroxisome → glycine → mitochondrion
// (2 glycine → serine + CO₂ + NH₃) → serine → peroxisome → glycerate → chloroplast → 3-PGA (1 ATP); NH₃ is refixed in the
// chloroplast with 1 ATP and 2 reduced ferredoxin (Peterhänsel et al. 2010, §2.1–2.2). FvCB limits on request.
// Counts (numerals with units, per 3 CO₂ fixed): 3 CO₂ + 3 RuBP (3 × 5 C) → 6 3-PGA (6 × 3 C = 18 C); 6 ATP + 6 NADPH →
// 6 triose phosphate; 5 triose phosphate (15 C) → 3 RuBP with 3 ATP; 1 triose phosphate (3 C) leaves. The loop, per 2 O₂:
// 4 C in, 3 C back, 1 C lost as CO₂, 1 NH₃.
//
// Style (GLYPH_BRIEF.md): RuBisCO is our render of spinach L8S8 (PDB 8RUC, scripts/rf_rubisco_render.mjs) at the chain's
// scale (0.95 figure units per Å) where the layout allows; ferredoxin the chain's render (1A70); molecules in carbon form
// (figs/carbon-form.ts: one C ball per carbon, a P disc per phosphate, an N ball per amino N); CO₂, O₂ atom balls; ATP,
// NADPH, ADP, NADP⁺, Pᵢ the chain's tags; names in ink; gas arrows grey. Looks: 'bil' (as 7m1: dimmed render grey, dimmed
// glyphs at reduced opacity) and 'glow' (as c2c3: lit render and lit molecules glow, dimmed render a pale silhouette).
// Layouts: 'cycle' (A: pick a's upright cycle, loop to the right), 'chain' (B: the thylakoid strip of 7m1 enters at the
// left edge, flush with the chain's right edge: membrane centre y 300, ±19, lumen to y 452), 'chloro' (C: the cycle in a
// chloroplast with grana, organelles outside, as v10).
//
// Markup: every piece of a part sits in <g data-p="<part>" class="chn-on|chn-off"> (chain.css dims .chn-off), so a later
// animation can select [data-p="…"] as on the rf schema.
import './cbb-schema.css';
import rubiscoPng from '../../assets/rf/rubisco-8ruc.png';
import { LIT_ALL as RF_ALL, PART_NAME as RF_NAME, type Part as RfPart } from './rf-schema';
import { atoms, carrierImg, rowG, tagG } from './chain';
import { row, rowWidth } from './carbon-form';

export { LIT_C5, LIT_C6, LIT_C7, LIT_C8, LIT_C8C, LIT_C8J, LIT_C8P } from './rf-schema';

/* ================================================================ API */

/** The rf schema's parts (so every slide's lit set maps directly) plus starch. */
export type Part = RfPart | 'starch';
export type Layout = 'cycle' | 'chain' | 'chloro';
export type Look = 'bil' | 'glow';

/** C1 · the cycle: carboxylation, reduction with ATP and NADPH, regeneration, one triose phosphate out. */
export const LIT_C1: Part[] = ['co2', 'rubisco', 'carbox', 'pga', 'supply', 'reduce', 'tp', 'regen', 'export'];
/** C2 · RuBisCO: CO₂ + RuBP → 2 3-PGA. */
export const LIT_C2: Part[] = ['co2', 'rubisco', 'carbox', 'pga'];
/** C3 · reduction (ATP, NADPH) and regeneration (ATP) back to RuBP. */
export const LIT_C3: Part[] = ['pga', 'supply', 'reduce', 'tp', 'regen'];
/** C4 · triose phosphate out: sucrose in the cytosol (Pᵢ back), starch in the chloroplast. */
export const LIT_C4: Part[] = ['tp', 'export', 'starch'];
/** Everything on. */
export const LIT_ALL: Part[] = [...RF_ALL, 'starch'];

const PART_NAME: Record<Part, string> = { ...RF_NAME, starch: 'starch made from triose phosphate in the chloroplast', export: 'export of 1 of 6 triose phosphates to the cytosol for sucrose, in exchange for phosphate' };
const PARTS = Object.keys(PART_NAME) as Part[];
const LIMITS = new Set<Part>(['lim-c', 'lim-j', 'lim-p']);

export interface CbbOpts {
  /** Draw the FvCB limits (boxes Ac, Aj, Ap) of the lit lim-* parts (slide C8). */
  limits?: boolean;
  /** viewBox [x, y, w, h]: a crop on part of the figure. */
  view?: [number, number, number, number];
  /** Layout 'chain' placed right of the chain figure: the supply arrows start at the chain's NADPH and ATP tags. */
  join?: boolean;
  /** Inner markup only (no <svg>), for a combined figure. */
  bare?: boolean;
  /** Leave out the key and the credit (a crop). */
  noKey?: boolean;
}

const SAY: Record<Layout, string> = {
  cycle: 'The Calvin–Benson–Bassham cycle drawn upright: RuBisCO, a render of its structure, at the bottom, fed by CO2 and O2; RuBP above it, 3-PGA above that, triose phosphate at the top; regeneration runs back down the left; ATP and NADPH come from a thylakoid on the right; the photorespiratory loop runs to a peroxisome and a mitochondrion on the right',
  chain: 'The end of the thylakoid membrane of the light-reaction chain at the left edge, with ATP and NADPH flowing right into the Calvin–Benson–Bassham cycle drawn as a ring in the stroma: reduction on the left facing the thylakoid, triose phosphate at the top, regeneration down the right to RuBP, RuBisCO, a render of its structure, at the bottom; beyond the chloroplast envelope on the right the photorespiratory loop through a mitochondrion and a peroxisome',
  chloro: 'A chloroplast drawn in outline with grana stacks of thylakoids, the Calvin–Benson–Bassham cycle in its stroma, RuBisCO a render of its structure; the peroxisome and the mitochondrion outside the chloroplast on the right',
};
const MOLS = 'Molecules drawn in carbon form: one red ball per carbon, an orange disc per phosphate, a blue ball per amino nitrogen; CO2 and O2 as atom balls; ATP, NADPH, ADP, NADP+ and phosphate as tags. Counts per 3 CO2 fixed: 3 CO2 and 3 RuBP (15 C) give 6 3-PGA (18 C); 6 ATP and 6 NADPH reduce them to 6 triose phosphates; 5 triose phosphates (15 C) and 3 ATP regenerate 3 RuBP; 1 triose phosphate (3 C) leaves. Photorespiration per 2 O2: 4 C in, 3 C back as 3-PGA, 1 C lost as CO2, 1 NH3 refixed with ATP and ferredoxin.';

/** The overview in one layout and look, the `lit` parts highlighted and the rest dimmed. `id` must be unique on the page. */
export function cbbSvg(id: string, layout: Layout, look: Look, lit: Iterable<Part>, o: CbbOpts = {}): string {
  const on = new Set(lit);
  const d = new Draw(id, look, on, o);
  d.add('bg', null, defs(id));
  LAYOUT[layout](d);
  if (!o.noKey) { keyLine(d); limitLegend(d); }
  if (o.bare) return d.out();
  const vb = o.view ?? [0, 0, 800, 600];
  const names = PARTS.filter(p => on.has(p) && (!LIMITS.has(p) || o.limits)).map(p => PART_NAME[p]);
  const label = `${SAY[layout]}. ${MOLS} Highlighted: ${names.join('; ')}. Everything else is drawn dimmed.`;
  return `<svg class="fig-svg cbb cbb-${layout} cbb-${look}" viewBox="${vb.join(' ')}" role="img" aria-label="${label}">${d.out()}</svg>`;
}

/* ================================================================ drawing kit */

export type Pt = [number, number];
type A = 'start' | 'middle' | 'end';
type Layer = 'bg' | 'pool' | 'mem' | 'flow' | 'body' | 'node' | 'text' | 'top';
const LAYERS: Layer[] = ['bg', 'pool', 'mem', 'flow', 'body', 'node', 'text', 'top'];
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

class Draw {
  private L: Record<Layer, string[]> = { bg: [], pool: [], mem: [], flow: [], body: [], node: [], text: [], top: [] };
  constructor(readonly id: string, readonly look: Look, readonly lit: Set<Part>, readonly o: CbbOpts) {}
  on(...ps: Part[]): boolean { return ps.some(p => this.lit.has(p)); }
  /** Adds svg to a layer; with parts, wrapped lit (any of them lit) or dimmed. */
  add(layer: Layer, part: Part | Part[] | null, svg: string, cls = ''): void {
    if (!part) { this.L[layer].push(svg); return; }
    const ps = Array.isArray(part) ? part : [part];
    this.L[layer].push(`<g data-p="${ps[0]}" class="chn-${this.on(...ps) ? 'on' : 'off'}${cls ? ` ${cls}` : ''}">${svg}</g>`);
  }
  out(): string { return LAYERS.map(k => this.L[k].join('')).join(''); }
}

/** Filters (dimmed render grey; glow look: lit glow, dimmed silhouette, as chain.ts) and the amber pool. */
function defs(p: string): string {
  return `<defs><filter id="${p}-grey" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".12 .24 .05 0 .53 .12 .24 .05 0 .53 .12 .24 .05 0 .53 0 0 0 1 0"/></filter>
    <filter id="${p}-sil" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius="1.1" result="d"/><feFlood flood-color="#aca89d"/><feComposite in2="d" operator="in" result="o"/>
      <feFlood flood-color="#f3f1ec"/><feComposite in2="SourceAlpha" operator="in" result="i"/><feMerge><feMergeNode in="o"/><feMergeNode in="i"/></feMerge></filter>
    <filter id="${p}-glow" x="-25%" y="-35%" width="150%" height="170%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="9" result="b"/><feFlood flood-color="#f6b42c" flood-opacity=".8"/><feComposite in2="b" operator="in" result="g"/>
      <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <radialGradient id="${p}-pool"><stop offset="0" class="chn-pool0"/><stop offset=".55" class="chn-pool1"/><stop offset="1" class="chn-pool2"/></radialGradient></defs>`;
}

/** A smooth open path through points (Catmull-Rom as cubic Béziers). */
function smooth(q: Pt[]): string {
  let s = `M${f(q[0][0])},${f(q[0][1])}`;
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    s += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return s;
}
function head(tip: Pt, dir: Pt, cls: string, hl = 13, hw = 7.5): string {
  const L = Math.hypot(dir[0], dir[1]), u: Pt = [dir[0] / L, dir[1] / L], n: Pt = [-u[1], u[0]];
  const b: Pt = [tip[0] - u[0] * hl, tip[1] - u[1] * hl];
  return `<path class="${cls}" d="M${f(tip[0])},${f(tip[1])}L${f(b[0] + n[0] * hw)},${f(b[1] + n[1] * hw)}L${f(b[0] - n[0] * hw)},${f(b[1] - n[1] * hw)}Z"/>`;
}
type Kind = 'c' | 'pr' | 'gas' | 'atp' | 'nadph' | 'ret';
/** An arrow along points (smoothed): carbon (ink), photorespiration (rust), gas (grey), ATP (clay), NADPH (blue), the
 *  spent carriers going back (grey dashes). `halo` for lines that cross others. */
function arrow(q: Pt[], k: Kind, o: { halo?: boolean; thin?: boolean; hl?: number; hw?: number } = {}): string {
  const thin = o.thin ?? false, hl = o.hl ?? (thin ? 11 : 13), hw = o.hw ?? (thin ? 6.5 : 7.5);
  const tip = q[q.length - 1], prev = q[q.length - 2];
  const dir: Pt = [tip[0] - prev[0], tip[1] - prev[1]], L = Math.hypot(dir[0], dir[1]);
  const back: Pt = [tip[0] - (dir[0] / L) * hl * 0.75, tip[1] - (dir[1] / L) * hl * 0.75];
  const dd = smooth([...q.slice(0, -1), back]);
  return `${o.halo ? `<path class="cbb-halo-l" d="${dd}"/>` : ''}<path class="cbb-a cbb-a-${k}${thin ? ' cbb-a-thin' : ''}" d="${dd}"/>${head(tip, dir, `cbb-h-${k}`, hl, hw)}`;
}
/** Light arriving: the chain's amber wave. */
function wave(a: Pt, b: Pt, n = 3.5, amp = 6.5): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, pts: string[] = [];
  const stop = 1 - 15 / L;
  for (let i = 0; i <= 70; i++) {
    const t = (i / 70) * stop, w = Math.sin(t * n * 2 * Math.PI) * amp * Math.min(1, (stop - t) * 8);
    pts.push(`${i ? 'L' : 'M'}${f(a[0] + dx * t - uy * w)},${f(a[1] + dy * t + ux * w)}`);
  }
  return `<path class="chn-lw" d="${pts.join('')}"/>${head(b, [dx, dy], 'chn-lwh', 15, 8.5)}`;
}

/* ---------- glyphs ---------- */

/** Ball radius of the carbon form here: letters 11.9 px. */
const RB = 9.5;
const molW = (formula: string, r = RB): number => rowWidth(formula.length, r);
const gl = (svg: string): string => `<g class="chn-g">${svg}</g>`;
/** CO₂, O₂ as atom balls (chain.ts glyph mode). */
const gasG = (x: number, y: number, el: string, r = 10): string => gl(atoms(x, y, el, r));
/** NH₃: an amino-N ball (carbon form's N) with three small H balls. */
function nh3G(x: number, y: number): string {
  const h = (dx: number, dy: number): string => `<circle class="atom atom-H" cx="${f(x + dx)}" cy="${f(y + dy)}" r="5.5"/>`;
  return gl(`${h(-12, 7)}${h(12, 7)}${h(0, -13)}<circle class="cbb-n" cx="${f(x)}" cy="${f(y)}" r="${RB}"/>${T(x, y + 4.3, 'N', 'cbb-nt')}`);
}
const tag = (x: number, y: number, s: string, k: 'nadph' | 'atp' | 'plain' | 'pi'): string => gl(tagG(x, y, s, k));
const tagW = (s: string): number => s.replace(/<[^>]+>/g, '').length * 9.6 + 18;

/** A soft amber pool behind a lit part (glow look). */
function pool(d: Draw, part: Part | Part[], c: Pt, rx: number, ry: number): void {
  if (d.look !== 'glow') return;
  const ps = Array.isArray(part) ? part : [part];
  if (d.on(...ps)) d.add('pool', null, `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(rx)}" ry="${f(ry)}" fill="url(#${d.id}-pool)"/>`);
}

/** Where a molecule's name (and count line) stands. */
interface Lab { name: string; count?: string; at?: 'below' | 'above' | 'right' | 'left'; dx?: number; dy?: number }
/** A metabolite in carbon form with its name in ink and, under it, its count. */
function mol(d: Draw, part: Part | Part[], at: Pt, formula: string, lab: Lab, r = RB): void {
  const [x, y] = at, w = molW(formula, r), side = lab.at ?? 'below', dx = lab.dx ?? 0, dy = lab.dy ?? 0;
  pool(d, part, at, w / 2 + 26, r + 22);
  d.add('node', part, gl(row(x, y, formula, { r })));
  let s = '';
  const nm = (xx: number, yy: number, a: A): string => T(xx, yy, lab.name, 'cbb-mn cbb-halo', a);
  const ct = (xx: number, yy: number, a: A): string => (lab.count ? T(xx, yy, lab.count, 'cbb-cnt cbb-halo', a) : '');
  if (side === 'below') s = nm(x + dx, y + r + 21 + dy, 'middle') + ct(x + dx, y + r + 39 + dy, 'middle');
  else if (side === 'above') s = nm(x + dx, y - r - (lab.count ? 28 : 10) + dy, 'middle') + ct(x + dx, y - r - 10 + dy, 'middle');
  else if (side === 'right') s = nm(x + w / 2 + 10 + dx, y + (lab.count ? -2 : 6) + dy, 'start') + ct(x + w / 2 + 10 + dx, y + 16 + dy, 'start');
  else s = nm(x - w / 2 - 10 + dx, y + (lab.count ? -2 : 6) + dy, 'end') + ct(x - w / 2 - 10 + dx, y + 16 + dy, 'end');
  d.add('text', part, s);
}
/** A gas (CO₂, O₂) as atom balls with its name. */
function gas(d: Draw, part: Part, at: Pt, el: string, name: string, lab: Pt, a: A = 'middle'): void {
  pool(d, part, at, 40, 26);
  d.add('node', part, gasG(at[0], at[1], el));
  d.add('text', part, T(lab[0], lab[1], name, 'cbb-mn cbb-halo', a));
}

/** RuBisCO: the 8RUC render (548 × 471 px at 4 px per Å); k = 1 is the chain's scale, 0.95 figure units per Å. */
const RUB = { w: 548, h: 471, s: 0.95 / 4 };
function rubisco(d: Draw, c: Pt, k: number, lab: Pt, a: A = 'middle'): void {
  const w = RUB.w * RUB.s * k, h = RUB.h * RUB.s * k, on = d.on('rubisco');
  const fl = d.look === 'glow' ? (on ? 'glow' : 'sil') : (on ? '' : 'grey');
  d.add('body', 'rubisco', `<image class="cbb-rub" href="${rubiscoPng}" x="${f(c[0] - w / 2)}" y="${f(c[1] - h / 2)}" width="${f(w)}" height="${f(h)}"${fl ? ` filter="url(#${d.id}-${fl})"` : ''}/>`);
  d.add('text', 'rubisco', T(lab[0], lab[1], 'RuBisCO', 'chn-name cbb-halo', a));
}
/** Ferredoxin, the chain's render (1A70) at true size × k. */
function ferredoxin(d: Draw, part: Part, c: Pt, k = 1): string {
  const on = d.on(part);
  if (d.look === 'glow') return carrierImg('fd', c[0], c[1], k, false, ` filter="url(#${d.id}-${on ? 'glow' : 'sil'})"`);
  return carrierImg('fd', c[0], c[1], k, !on);
}

/* ---------- compartments ---------- */

/** The peroxisome: one membrane. */
function perox(d: Draw, c: Pt, r: number, lab: Pt = [c[0], c[1] + 6]): void {
  d.add('mem', 'perox', `<circle class="cbb-perox" cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}"/>`);
  d.add('text', 'perox', T(lab[0], lab[1], 'peroxisome', 'cbb-org cbb-halo'));
}
/** The mitochondrion: outer membrane and the folded inner one. */
function mito(d: Draw, c: Pt, rx: number, ry: number, lab: Pt = [c[0], c[1] + 6]): void {
  const [x, y] = c, ix = rx - 7, iy = ry - 7;
  // inner membrane with cristae: an ellipse whose edge folds inwards five times from the top and from the bottom
  const pts: string[] = [];
  const N = 240, folds = [-0.62, -0.31, 0, 0.31, 0.62];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 2 * Math.PI, ex = x + ix * Math.cos(t), ey = y + iy * Math.sin(t);
    let dep = 0;
    for (const u of folds) { const dxu = (ex - x) / ix - u; dep = Math.max(dep, Math.exp(-(dxu * dxu) / 0.0035)); }
    const k = 1 - dep * 0.52;
    pts.push(`${i ? 'L' : 'M'}${f(x + (ex - x) * (1 - dep * 0.04))},${f(y + (ey - y) * k)}`);
  }
  d.add('mem', 'mito', `<ellipse class="cbb-mito" cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"/><path class="cbb-mito-in" d="${pts.join('')}Z"/>`);
  d.add('text', 'mito', T(lab[0], lab[1], 'mitochondrion', 'cbb-org cbb-halo'));
}
/** The chloroplast envelope: two membranes, drawn as one tan band with a pale line inside. */
const envelope = (path: string): string => `<path class="cbb-env" d="${path}"/><path class="cbb-env2" d="${path}"/>`;
/** A rounded rectangle path. */
function rrect(x: number, y: number, w: number, h: number, r: number): string {
  return `M${f(x + r)},${f(y)}H${f(x + w - r)}A${r},${r} 0 0 1 ${f(x + w)},${f(y + r)}V${f(y + h - r)}A${r},${r} 0 0 1 ${f(x + w - r)},${f(y + h)}H${f(x + r)}A${r},${r} 0 0 1 ${f(x)},${f(y + h - r)}V${f(y + r)}A${r},${r} 0 0 1 ${f(x + r)},${f(y)}Z`;
}

/* ---------- the thylakoid membrane, as in 7m1 (chain.ts bilayerR): heads on both faces, two tails each ---------- */

type Seg = { L: [number, number, number, number] } | { A: [number, number, number, number, number, number] };
/** Samples [x, y, nx, ny] every `step` along line and elliptic-arc segments (angles in degrees, y down). */
function sample(segs: Seg[], step: number): Array<[number, number, number, number]> {
  const fine: Array<[number, number]> = [];
  for (const s of segs) {
    if ('L' in s) { const [x0, y0, x1, y1] = s.L; for (let i = 0; i <= 60; i++) fine.push([x0 + (x1 - x0) * i / 60, y0 + (y1 - y0) * i / 60]); }
    else { const [cx, cy, rx, ry, a0, a1] = s.A; for (let i = 0; i <= 120; i++) { const t = ((a0 + (a1 - a0) * i / 120) * Math.PI) / 180; fine.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]); } }
  }
  const out: Array<[number, number, number, number]> = [];
  let acc = step;
  for (let i = 1; i < fine.length; i++) {
    const [ax, ay] = fine[i - 1], [bx, by] = fine[i], L = Math.hypot(bx - ax, by - ay);
    if (L < 1e-6) continue;
    acc += L;
    if (acc >= step) { acc = 0; out.push([bx, by, -(by - ay) / L, (bx - ax) / L]); }
  }
  return out;
}
const segPath = (segs: Seg[]): string => segs.map((s, i) => {
  if ('L' in s) return `${i ? 'L' : 'M'}${f(s.L[0])},${f(s.L[1])}L${f(s.L[2])},${f(s.L[3])}`;
  const [cx, cy, rx, ry, a0, a1] = s.A, p = (a: number): Pt => [cx + rx * Math.cos((a * Math.PI) / 180), cy + ry * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `${i ? 'L' : 'M'}${f(x0)},${f(y0)}A${f(rx)},${f(ry)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${f(x1)},${f(y1)}`;
}).join('');
/** A bilayer along segments: half-thickness `half`, head radius r, head spacing `step`. */
function bilayer(segs: Seg[], half = 19, r = 3.1, step = 7.2): string {
  const heads: string[] = [], tails: string[] = [], tl = half - r - 3;
  for (const [x, y, nx, ny] of sample(segs, step)) for (const sg of [1, -1]) {
    const hx = x + sg * nx * (half - r), hy = y + sg * ny * (half - r);
    heads.push(`M${f(hx - r)},${f(hy)}a${r},${r} 0 1 0 ${f(2 * r)},0a${r},${r} 0 1 0 ${f(-2 * r)},0`);
    const ax = x + sg * nx * (half - 2 * r), ay = y + sg * ny * (half - 2 * r), tx = -ny, ty = nx;
    for (const o of [-1.2, 1.2]) tails.push(`M${f(ax + tx * o)},${f(ay + ty * o)}l${f(-sg * nx * tl)},${f(-sg * ny * tl)}`);
  }
  return `<path class="cbb-band" d="${segPath(segs)}" stroke-width="${f(2 * half)}"/><path class="chn-tail" d="${tails.join('')}"/><path class="chn-head" d="${heads.join('')}"/>`;
}
/** One thylakoid disc: a closed bilayer (stadium) around its lumen. */
function disc(x: number, y: number, w: number, h: number, half = 6, r = 2.1, step = 5.4): string {
  const rr = h / 2, x0 = x + rr, x1 = x + w - rr, cy = y + rr;
  const segs: Seg[] = [{ L: [x0, y, x1, y] }, { A: [x1, cy, rr, rr, -90, 90] }, { L: [x1, y + h, x0, y + h] }, { A: [x0, cy, rr, rr, 90, 270] }];
  return `<path class="cbb-disc-in" d="${segPath(segs)}Z"/>${bilayer(segs, half, r, step)}`;
}

/* ---------- key, credit, limits ---------- */

function keyLine(d: Draw): void {
  const x = 14, y = 590;
  const ball = (cx: number, a: 'C' | 'P' | 'N' | 'O'): string => a === 'O' ? gasG(cx, y - 5, 'O', 8.5) : gl(row(cx, y - 5, a, { r: 8.5 }));
  d.add('text', null, `${arrow([[x, y - 5], [x + 34, y - 5]], 'c', { thin: true })}${T(x + 42, y, 'carbon', 'cbb-key', 'start')}
    ${arrow([[x + 108, y - 5], [x + 142, y - 5]], 'pr', { thin: true })}${T(x + 150, y, 'photorespiration', 'cbb-key', 'start')}
    ${ball(x + 292, 'C')}${ball(x + 316, 'P')}${ball(x + 340, 'N')}${ball(x + 364, 'O')}
    ${T(790, y, 'numbers per 3 CO₂ fixed; photorespiration per 2 O₂', 'cbb-cnt', 'end')}
    ${T(794, 13, 'structures: PDB 8RUC (RuBisCO), 1A70 (ferredoxin)', 'cbb-cr', 'end')}`);
}

/** A model symbol with a real subscript: A_c, V_cmax. */
const sym = (s: string): string => s.replace(/\b([AVJ])_(\w+)/g, '$1<tspan class="cbb-sub" dy="4">$2</tspan><tspan dy="-4"> </tspan>');
type Lim = 'c' | 'j' | 'p';
const LIM_SYM: Record<Lim, string> = { c: 'A_c', j: 'A_j', p: 'A_p' };
const LIM_SAY: Record<Lim, [string, string]> = { c: ['A_c ~ V_cmax', 'RuBisCO'], j: ['A_j ~ J', 'electron transport'], p: ['A_p ~ TPU', 'triose-phosphate use'] };
/** An FvCB limit: a dashed box round its part of the figure and its symbol in a small tag at `tag`; the legend line (key)
 *  says what each symbol is set by. */
function limit(d: Draw, k: Lim, box: [number, number, number, number], tagAt: Pt): void {
  const part = `lim-${k}` as Part;
  if (!d.o.limits || !d.on(part)) return;
  d.add('top', part, `<rect class="cbb-box cbb-box-${k}" x="${f(box[0])}" y="${f(box[1])}" width="${f(box[2])}" height="${f(box[3])}" rx="16"/>
    <rect class="cbb-limtag cbb-box-${k}" x="${f(tagAt[0] - 22)}" y="${f(tagAt[1] - 14)}" width="44" height="28" rx="9"/>${T(tagAt[0] - 1, tagAt[1] + 5, sym(LIM_SYM[k]), `cbb-lim cbb-lim-${k}`)}`);
}
/** The limits' legend, above the key (C8). */
function limitLegend(d: Draw): void {
  if (!d.o.limits) return;
  const X: Record<Lim, [number, number]> = { c: [14, 120], j: [200, 252], p: [400, 474] };
  let s = '';
  for (const k of ['c', 'j', 'p'] as Lim[]) {
    if (!d.on(`lim-${k}` as Part)) continue;
    const [a, b] = LIM_SAY[k];
    s += `${T(X[k][0], 566, sym(a), `cbb-limk cbb-lim-${k}`, 'start')}${T(X[k][1], 566, b, 'cbb-cnt', 'start')}`;
  }
  d.add('text', null, s);
}

/* ================================================================ layout A · the upright cycle (and C, framed) */

function cycleLayout(d: Draw, framed: boolean): void {
  const X = 222, ENV = 520;
  const th: Pt = [420, 172];
  if (framed) {
    // C · the chloroplast (stroma, envelope) with a granum stack where ATP and NADPH are made, two more grana as context
    const envD = rrect(6, 30, ENV - 6, 518, 40);
    d.add('bg', null, `<path class="cbb-stroma" d="${envD}"/>`);
    d.add('mem', null, envelope(envD));
    d.add('text', null, `${T(16, 20, 'chloroplast', 'cbb-zone', 'start')}${T(790, 164, 'cytosol', 'cbb-zone', 'end')}${T(376, 322, 'stroma', 'chn-zone', 'middle')}`);
    const stack = (x: number, y: number, n: number, w: number): string => Array.from({ length: n }, (_, k) => disc(x, y + k * 21, w, 19, 4.6, 1.7, 4.6)).join('');
    d.add('mem', ['thyl', 'light'], stack(th[0] - 60, th[1] - 40, 4, 120), 'cbb-thyl');
    pool(d, 'thyl', th, 92, 60);
    d.add('text', 'thyl', T(th[0], th[1] + 64, 'granum', 'cbb-org cbb-halo'));
  } else {
    // A · as pick a: no chloroplast outline; one thylakoid disc stands for the light reactions
    d.add('mem', ['thyl', 'light'], `${disc(th[0] - 64, th[1] - 30, 128, 26)}${disc(th[0] - 64, th[1] + 2, 128, 26)}`, 'cbb-thyl');
    pool(d, 'thyl', th, 92, 52);
    d.add('text', 'thyl', T(th[0], th[1] + 52, 'thylakoid', 'cbb-org cbb-halo'));
  }
  d.add('flow', 'light', `${wave([484, 72], [456, 132])}${T(446, 108, 'light', 'chn-light', 'end')}`);
  // ATP and NADPH to the reduction step; the spent carriers back
  d.add('flow', 'supply', `${arrow([[354, 158], [300, 158], [X + 12, 168]], 'nadph')}${arrow([[354, 186], [300, 188], [X + 12, 194]], 'atp')}`);
  d.add('node', 'supply', `${tag(294, 158, '6 NADPH', 'nadph')}${tag(294, 188, '6 ATP', 'atp')}`);
  d.add('flow', 'supply', arrow([[X + 12, 216], [300, 220], [352, 204]], 'ret', { thin: true }));
  d.add('node', 'supply', rowG(300, 242, [['NADP⁺', 'plain'], ['ADP', 'atp'], ['', 'pi']]));

  // the cycle: triose phosphate, 3-PGA, RuBP on one spine, RuBisCO below
  const tp: Pt = [X, 84], pga: Pt = [X, 300], rubp: Pt = [X, 410], rub: Pt = [X, 503];
  mol(d, 'tp', tp, 'CCCP', { name: 'triose phosphate', count: '6 × 3 C = 18 C' });
  mol(d, 'pga', pga, 'CCCP', { name: '3-PGA', count: '6 × 3 C = 18 C' });
  mol(d, ['rubisco', 'regen'], rubp, 'PCCCCCP', { name: 'RuBP', count: '3 × 5 C = 15 C' });
  rubisco(d, rub, 0.68, [X - 54, 540], 'end');
  pool(d, 'rubisco', rub, 66, 50);
  d.add('flow', 'carbox', arrow([[X, rubp[1] - 13], [X, pga[1] + 54]], 'c'));
  d.add('text', 'carbox', T(X - 12, 382, 'carboxylation', 'cbb-proc cbb-halo', 'end'));
  d.add('flow', 'reduce', arrow([[X, pga[1] - 14], [X, tp[1] + 54]], 'c'));
  d.add('text', 'reduce', T(X - 12, 226, 'reduction', 'cbb-proc cbb-halo', 'end'));
  // CO₂ and O₂ at RuBisCO
  gas(d, 'co2', [104, 488], 'OCO', '3 CO₂', [104, 514]);
  d.add('flow', 'co2', arrow([[134, 491], [X - 46, 499]], 'gas', { thin: true }));
  gas(d, 'o2', [352, 512], 'OO', '2 O₂', [352, 540]);
  d.add('flow', 'o2', arrow([[330, 508], [X + 48, 504]], 'gas', { thin: true }));
  // regeneration, round the left: 5 triose phosphates, 3 ATP
  d.add('flow', 'regen', arrow([[X - 44, 80], [96, 112], [46, 232], [62, 352], [X - 78, 410]], 'c'));
  d.add('text', 'regen', `${T(72, 290, 'regeneration', 'cbb-proc cbb-halo', 'start')}${T(72, 310, '5 × 3 C = 15 C', 'cbb-cnt cbb-halo', 'start')}`);
  d.add('node', 'regen', tag(52, 200, '3 ATP', 'atp'));
  // out: starch in the chloroplast; triose phosphate to the cytosol for sucrose, Pᵢ back
  d.add('flow', 'starch', arrow([[X - 36, 70], [134, 56]], 'c', { thin: true }));
  d.add('node', 'starch', tag(90, 56, 'starch', 'plain'));
  pool(d, 'starch', [90, 56], 50, 22);
  d.add('flow', 'export', arrow([[X + 44, 74], [300, 52], [ENV + 12, 52], [604, 52]], 'c'));
  if (framed) d.add('mem', 'export', `<ellipse class="cbb-trans" cx="${ENV}" cy="52" rx="9" ry="16"/>`);
  d.add('node', 'export', `${tag(650, 52, 'sucrose', 'plain')}${tag(568, 98, '', 'pi')}`);
  d.add('flow', 'export', arrow([[554, 92], [ENV + 3, 68]], 'gas', { thin: true }));
  d.add('text', 'export', T(650, 94, '1 × 3 C = 3 C', 'cbb-cnt cbb-halo'));
  pool(d, 'export', [650, 52], 60, 24);

  // oxygenation → 2-phosphoglycolate (+ 3-PGA to the pool)
  const pg2: Pt = [400, 398];
  d.add('flow', 'oxy', `${arrow([[X + 78, 408], [pg2[0] - 36, pg2[1]]], 'pr')}${arrow([[X + 106, 402], [300, 352], [X + 46, 306]], 'pr', { thin: true })}`);
  d.add('text', 'oxy', T(X + 80, 476, 'oxygenation', 'cbb-proc cbb-proc-pr cbb-halo', 'start'));
  mol(d, 'pg2', pg2, 'CCP', { name: '2-phosphoglycolate', count: '2 × 2 C = 4 C' });

  // photorespiration: peroxisome and mitochondrion in the cytosol
  const px: Pt = [690, 236], pr = 52, mx: Pt = [676, 440];
  perox(d, px, pr, [px[0] + 4, px[1] + 2]);
  mito(d, mx, 92, 50, [mx[0], mx[1] + 6]);
  d.add('flow', 'glycolate', arrow([[pg2[0] + 34, pg2[1] - 6], [478, 356], [ENV + 10, 306], [px[0] - pr - 6, px[1] + 22]], 'pr'));
  mol(d, 'glycolate', [596, 276], 'CC', { name: '2 glycolate', dy: -2 });
  d.add('flow', 'glycine', arrow([[px[0] - 26, px[1] + pr - 4], [px[0] - 26, mx[1] - 52]], 'pr'));
  mol(d, 'glycine', [px[0] - 26, 334], 'CCN', { name: '2 glycine', at: 'left' });
  d.add('flow', 'serine', arrow([[px[0] + 40, mx[1] - 50], [px[0] + 40, px[1] + pr - 6]], 'pr'));
  mol(d, 'serine', [px[0] + 40, 364], 'CCCN', { name: 'serine', at: 'above' });
  // CO₂ lost; NH₃ refixed in the chloroplast with ATP and ferredoxin
  d.add('flow', 'co2-out', arrow([[mx[0] + 56, mx[1] + 42], [748, 514]], 'gas', { thin: true }));
  gas(d, 'co2-out', [762, 530], 'OCO', 'CO₂', [722, 536], 'end');
  d.add('text', 'co2-out', T(790, 504, '1 C lost', 'cbb-cnt cbb-halo', 'end'));
  d.add('flow', 'nh3', arrow([[mx[0] - 92, mx[1] + 10], [ENV - 4, 466], [492, 470]], 'pr'));
  d.add('node', 'nh3', nh3G(474, 472));
  d.add('text', 'nh3', `${T(474, 448, 'NH₃', 'cbb-mn cbb-halo')}${T(470, 542, '1 ATP · 2 ferredoxin', 'cbb-cnt cbb-halo')}`);
  d.add('node', 'nh3', `${tag(446, 510, 'ATP', 'atp')}${ferredoxin(d, 'nh3', [496, 510], 0.9)}`);
  // glycerate back into the chloroplast → 3-PGA, 1 ATP
  d.add('flow', 'glycerate', arrow([[px[0] - pr + 8, px[1] - 26], [588, 210], [ENV + 4, 234], [420, 262], [X + 48, 292]], 'pr', { halo: true }));
  mol(d, 'glycerate', [588, 210], 'CCC', { name: 'glycerate', count: '3 C back', at: 'above' });
  d.add('node', 'glycerate', tag(342, 280, 'ATP', 'atp'));

  // FvCB limits (C8)
  limit(d, 'c', [26, 468, 272, 82], [48, 468]);
  limit(d, 'j', [228, 132, 288, 134], [494, 266]);
  limit(d, 'p', [50, 32, 662, 44], [400, 32]);
}

/* ================================================================ layout B · the chain's thylakoid strip, the cycle as a ring */

/** The supply arrows' start in the chain figure (7m1, glyph mode): right of its NADPH tag (row at x 548, y 64) and of its
 *  ATP tag (row at x 716, y 92), in this figure's units when it sits right of the chain (x − 800). */
const CHAIN_NADPH: Pt = [657 - 800, 64], CHAIN_ATP: Pt = [807 - 800, 92];

function chainLayout(d: Draw): void {
  const ENV = 588, yM = 300, xe = 52;
  d.add('bg', null, `<defs><linearGradient id="${d.id}-sfade" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
      <mask id="${d.id}-ms" maskUnits="userSpaceOnUse" x="0" y="0" width="${ENV}" height="560"><rect x="0" y="0" width="${ENV}" height="560" fill="#fff"/><rect x="0" y="452" width="150" height="110" fill="url(#${d.id}-sfade)"/></mask></defs>
    <rect class="chn-stromaf" x="0" y="0" width="${ENV}" height="556" mask="url(#${d.id}-ms)"/>`);
  d.add('mem', null, envelope(`M${ENV},-10V552`));
  d.add('text', null, `${T(300, 290, 'stroma', 'chn-zone', 'middle')}${T(790, 530, 'cytosol', 'cbb-zone', 'end')}`);
  // the thylakoid membrane comes in at the left edge (centre y 300, ±19, lumen to 452 as in 7m1) and closes round its lumen
  const segs: Seg[] = [{ L: [-8, yM, xe, yM] }, { A: [xe, 376, 40, 76, -90, 90] }, { L: [xe, 452, -8, 452] }];
  d.add('mem', ['thyl', 'light'], `<defs><linearGradient id="${d.id}-fade" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
      <mask id="${d.id}-mfade" maskUnits="userSpaceOnUse" x="-10" y="0" width="820" height="620"><rect x="-10" y="0" width="820" height="620" fill="#fff"/><rect x="-10" y="404" width="80" height="90" fill="url(#${d.id}-fade)"/></mask></defs>
    <path class="chn-lumenf" d="${segPath(segs)}Z"/><g mask="url(#${d.id}-mfade)">${bilayer(segs)}</g>`, 'cbb-thyl');
  pool(d, 'thyl', [40, 376], 76, 100);
  d.add('text', 'thyl', `${d.o.join ? '' : T(10, 392, 'lumen', 'chn-zone', 'start')}${T(8, 500, 'thylakoid', 'cbb-org', 'start')}`);
  if (!d.o.join) d.add('flow', 'light', `${wave([62, 164], [54, 270], 3, 6)}${T(76, 190, 'light', 'chn-light', 'start')}`);

  // the ring: triose phosphate top, 3-PGA left, RuBP right, RuBisCO bottom
  const tp: Pt = [290, 84], pga: Pt = [178, 388], rubp: Pt = [446, 362], rub: Pt = [310, 470];
  mol(d, 'tp', tp, 'CCCP', { name: 'triose phosphate', count: '6 × 3 C = 18 C', dx: 22 });
  mol(d, 'pga', pga, 'CCCP', { name: '3-PGA', count: '6 × 3 C = 18 C', dx: -26 });
  mol(d, ['rubisco', 'regen'], rubp, 'PCCCCCP', { name: 'RuBP', count: '3 × 5 C = 15 C', dx: 6 });
  rubisco(d, rub, 0.8, [rub[0], rub[1] + 68]);
  pool(d, 'rubisco', rub, 76, 58);
  d.add('flow', 'reduce', arrow([[pga[0] - 6, pga[1] - 14], [146, 290], [156, 182], [196, 112], [tp[0] - 46, tp[1]]], 'c'));
  d.add('text', 'reduce', T(180, 252, 'reduction', 'cbb-proc cbb-halo', 'start'));
  d.add('flow', 'regen', arrow([[tp[0] + 46, tp[1] - 2], [404, 100], [458, 178], [470, 276], [rubp[0] + 34, rubp[1] - 15]], 'c'));
  d.add('text', 'regen', `${T(444, 222, 'regeneration', 'cbb-proc cbb-halo', 'end')}${T(444, 242, '5 × 3 C = 15 C', 'cbb-cnt cbb-halo', 'end')}`);
  d.add('node', 'regen', tag(434, 136, '3 ATP', 'atp'));
  d.add('flow', ['rubisco', 'regen'], arrow([[396, 372], [374, 412], [rub[0] + 46, rub[1] - 32]], 'c'));
  d.add('flow', 'carbox', arrow([[rub[0] - 54, rub[1] - 2], [218, 446], [pga[0] + 22, pga[1] + 13]], 'c'));
  d.add('text', 'carbox', T(240, 508, 'carboxylation', 'cbb-proc cbb-halo', 'end'));
  // CO₂ and O₂ inside the ring, onto RuBisCO
  gas(d, 'co2', [276, 376], 'OCO', '3 CO₂', [276, 356]);
  d.add('flow', 'co2', arrow([[282, 390], [292, 422]], 'gas', { thin: true }));
  gas(d, 'o2', [350, 376], 'OO', '2 O₂', [350, 356]);
  d.add('flow', 'o2', arrow([[344, 390], [334, 422]], 'gas', { thin: true }));

  // ATP and NADPH from the thylakoid (from the chain's own tags when joined); the spent carriers back
  const n0: Pt = d.o.join ? CHAIN_NADPH : [-4, 64], a0: Pt = d.o.join ? CHAIN_ATP : [-4, 96];
  d.add('flow', 'supply', `${arrow([n0, [100, 64], [140, 90], [154, 168]], 'nadph')}${arrow([a0, [86, 98], [124, 126], [148, 196]], 'atp')}`);
  d.add('node', 'supply', `${tag(94, 64, '6 NADPH', 'nadph')}${tag(66, 98, '6 ATP', 'atp')}`);
  d.add('flow', 'supply', arrow([[196, 112], [172, 54], [120, 32], [d.o.join ? -70 : -2, 30]], 'ret', { thin: true }));
  d.add('node', 'supply', rowG(70, 30, [['NADP⁺', 'plain'], ['ADP', 'atp'], ['', 'pi']]));

  // out: starch in the chloroplast; triose phosphate to the cytosol for sucrose, Pᵢ back
  d.add('flow', 'starch', arrow([[tp[0] + 4, tp[1] + 50], [tp[0] + 4, 168]], 'c', { thin: true }));
  d.add('node', 'starch', tag(tp[0] + 4, 186, 'starch', 'plain'));
  pool(d, 'starch', [tp[0] + 4, 186], 50, 22);
  d.add('flow', 'export', arrow([[tp[0] + 44, tp[1] - 10], [400, 44], [ENV + 10, 40], [628, 40]], 'c'));
  d.add('mem', 'export', `<ellipse class="cbb-trans" cx="${ENV}" cy="40" rx="9" ry="16"/>`);
  d.add('node', 'export', `${tag(676, 40, 'sucrose', 'plain')}${tag(632, 86, '', 'pi')}`);
  d.add('flow', 'export', arrow([[618, 82], [ENV + 3, 56]], 'gas', { thin: true }));
  d.add('text', 'export', T(462, 36, '1 × 3 C = 3 C', 'cbb-cnt cbb-halo'));
  pool(d, 'export', [676, 40], 60, 24);

  // oxygenation → 2-phosphoglycolate
  const pg2: Pt = [462, 474];
  d.add('flow', 'oxy', arrow([[rub[0] + 56, rub[1] + 6], [pg2[0] - 36, pg2[1]]], 'pr'));
  d.add('text', 'oxy', T(382, 520, 'oxygenation', 'cbb-proc cbb-proc-pr cbb-halo', 'start'));
  mol(d, 'pg2', pg2, 'CCP', { name: '2-phosphoglycolate', count: '2 × 2 C = 4 C', at: 'above', dx: 14 });

  // photorespiration in the cytosol: mitochondrion above, peroxisome below
  const px: Pt = [702, 448], pr = 52, mx: Pt = [692, 196];
  perox(d, px, pr, [px[0] + 6, px[1] + 22]);
  mito(d, mx, 92, 48, [mx[0], mx[1] + 6]);
  d.add('flow', 'glycolate', arrow([[pg2[0] + 34, pg2[1] + 4], [540, 500], [ENV + 12, 498], [px[0] - pr - 2, px[1] + 22]], 'pr'));
  mol(d, 'glycolate', [628, 516], 'CC', { name: '2 glycolate', dy: -2 });
  d.add('flow', 'glycine', arrow([[px[0] - 26, px[1] - pr + 2], [px[0] - 26, mx[1] + 50]], 'pr'));
  mol(d, 'glycine', [px[0] - 26, 300], 'CCN', { name: '2 glycine', at: 'above' });
  d.add('flow', 'serine', arrow([[px[0] + 36, mx[1] + 48], [px[0] + 36, px[1] - pr]], 'pr'));
  mol(d, 'serine', [px[0] + 36, 340], 'CCCN', { name: 'serine', dy: 0 });
  d.add('flow', 'co2-out', arrow([[mx[0] + 58, mx[1] - 38], [752, 128]], 'gas', { thin: true }));
  gas(d, 'co2-out', [756, 112], 'OCO', 'CO₂', [714, 118], 'end');
  d.add('text', 'co2-out', T(790, 92, '1 C lost', 'cbb-cnt cbb-halo', 'end'));
  // NH₃ back into the chloroplast, refixed with ATP and ferredoxin
  d.add('flow', 'nh3', arrow([[mx[0] - 92, mx[1] + 4], [ENV - 4, 202], [558, 204]], 'pr'));
  d.add('node', 'nh3', nh3G(540, 204));
  d.add('text', 'nh3', `${T(540, 180, 'NH₃', 'cbb-mn cbb-halo')}${T(538, 278, '1 ATP', 'cbb-cnt cbb-halo')}${T(538, 296, '2 ferredoxin', 'cbb-cnt cbb-halo')}`);
  d.add('node', 'nh3', `${tag(518, 244, 'ATP', 'atp')}${ferredoxin(d, 'nh3', [562, 244], 0.9)}`);
  // glycerate back across the ring to 3-PGA (1 ATP)
  d.add('flow', 'glycerate', arrow([[px[0] - pr + 6, px[1] - 24], [ENV + 18, 360], [ENV - 30, 326], [420, 316], [300, 318], [pga[0] + 42, pga[1] - 13]], 'pr', { halo: true }));
  mol(d, 'glycerate', [622, 370], 'CCC', { name: 'glycerate', count: '3 C back', at: 'below' });
  d.add('node', 'glycerate', tag(372, 316, 'ATP', 'atp'));

  limit(d, 'c', [226, 334, 162, 216], [226, 334]);
  limit(d, 'j', [-2, 48, 202, 218], [120, 266]);
  limit(d, 'p', [272, 22, 450, 46], [300, 22]);
}

const LAYOUT: Record<Layout, (d: Draw) => void> = { cycle: d => cycleLayout(d, false), chain: chainLayout, chloro: d => cycleLayout(d, true) };
