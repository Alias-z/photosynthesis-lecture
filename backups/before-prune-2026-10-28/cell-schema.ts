// The dark reactions drawn in the real cell, like the 7m1 strip (lecturer, 28 Oct 2026; brief research/redo-2026-10-28/
// SPATIAL_DARK_BRIEF.md): every protein where it really is. Rubisco, GAPDH, PRK, glycerate kinase and glutamine synthetase
// float in the stroma; the triose-phosphate translocator and PLGG1 sit across the inner envelope bilayer; sucrose is made
// in the cytosol; glycolate oxidase and catalase are in the peroxisome (one bilayer); glycine decarboxylase and SHMT in
// the mitochondrial matrix (two bilayers).
//
// Arrangement 'strip': one panorama at the chain's scale (0.95 figure units per Å; proteins as our renders at 2.4 px per
// Å, scripts/cell_render.mjs; bilayers 38 units thick as in 7m1), left to right: the end of the thylakoid (membrane centre
// y 300, lumen to 452, so that x 0 sits flush on the right edge of the 7m1 chain), the stroma, the envelope (inner and outer
// bilayer), the cytosol, the peroxisome, the mitochondrion. Compartments are cut to fit (a peroxisome is about 1 µm
// across); proteins and membranes are at true scale. A slide shows a window of it: the left 800 × 600 (scale 1) or the
// organelles (scale 0.87).
// Counts: one unit per figure, on the lit part only (lecturer, 28 Oct 2026): the cycle per 3 CO₂ fixed (C1–C4, C7, C8;
// the O₂ side and the loop then carry no numbers), per reaction (C5: RuBP + CO₂ → 2 3-PGA, 5 C + 1 C = 2 × 3 C;
// RuBP + O₂ → 3-PGA + 2-phosphoglycolate, 5 C = 3 C + 2 C) or per 2 O₂ (C6: 4 C in, 3 C back, 1 C lost; the cycle
// side then carries none). The key names that unit only.
// Markup: every piece of a part sits in <g data-p="<part>" class="chn-on|chn-off"> (chain.css dims .chn-off).
import './cbb-schema.css';
import './cell-schema.css';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import rubG from '../../assets/cell/rubisco-g.png';
import prkPng from '../../assets/cell/prk.png';
import prkG from '../../assets/cell/prk-g.png';
import gapdhPng from '../../assets/cell/gapdh.png';
import gapdhG from '../../assets/cell/gapdh-g.png';
import tptPng from '../../assets/cell/tpt.png';
import tptG from '../../assets/cell/tpt-g.png';
import goxPng from '../../assets/cell/gox.png';
import goxG from '../../assets/cell/gox-g.png';
import catPng from '../../assets/cell/cat.png';
import catG from '../../assets/cell/cat-g.png';
import gdcpPng from '../../assets/cell/gdcp.png';
import gdcpG from '../../assets/cell/gdcp-g.png';
import gdchPng from '../../assets/cell/gdch.png';
import gdchG from '../../assets/cell/gdch-g.png';
import shmtPng from '../../assets/cell/shmt.png';
import shmtG from '../../assets/cell/shmt-g.png';
import glykPng from '../../assets/cell/glyk.png';
import glykG from '../../assets/cell/glyk-g.png';
import gsPng from '../../assets/cell/gs.png';
import gsG from '../../assets/cell/gs-g.png';
import { carrierImg, tagG, rowG } from './chain';
import { row, rowWidth } from './carbon-form';
import { LIT_C1, LIT_C2, LIT_C3, LIT_C4, LIT_ALL, type Part } from './cbb-schema';
import { LIT_C5, LIT_C6, LIT_C7, LIT_C8, LIT_C8C, LIT_C8J, LIT_C8P } from './rf-schema';

export { LIT_C1, LIT_C2, LIT_C3, LIT_C4, LIT_C5, LIT_C6, LIT_C7, LIT_C8, LIT_C8C, LIT_C8J, LIT_C8P, LIT_ALL, type Part };
export type Arr = 'strip' | 'cell';
export type Pt = [number, number];
type A = 'start' | 'middle' | 'end';

export interface CellOpts {
  /** The window [x, y, w] of the panorama shown in the 800 × 600 figure (height w × 0.75). Default: the arrangement's. */
  win?: [number, number, number];
  /** FvCB limits as boxes (C8). */
  limits?: boolean;
  /** Inner markup of the panorama only, untransformed (for a combined figure). */
  bare?: boolean;
  /** Supply arrows start at the chain's NADPH and ATP tags (the strip placed right of 7m1). */
  join?: boolean;
  /** The one unit of the numbers: per 3 CO₂ fixed, per reaction, per 2 O₂, or none (default 'cycle'). */
  unit?: Unit;
  /** Leave out the cycle's molecules and the supply tags (an animation moves its own). */
  noMol?: boolean;
}
export type Unit = 'cycle' | 'reaction' | 'loop' | 'none';
const UNIT_SAY: Record<Unit, string> = { cycle: 'numbers per 3 CO₂ fixed', reaction: 'numbers per reaction', loop: 'numbers per 2 O₂', none: '' };
/** The default windows: the strip's left 800 × 600 (flush with 7m1) and its organelles; the cell section whole. */
export const WIN = { left: [0, 0, 800] as [number, number, number], right: [560, -40, 980] as [number, number, number], export: [280, -30, 800] as [number, number, number], cell: [0, 0, 800] as [number, number, number] };

const SAY: Record<Arr, string> = {
  strip: 'The dark reactions drawn where they happen, continuing the thylakoid strip of the light reactions to the right: the end of the thylakoid membrane, the stroma with Rubisco, GAPDH, phosphoribulokinase, glycerate kinase and glutamine synthetase as renders of their structures, the two bilayers of the chloroplast envelope with the triose-phosphate translocator and the glycolate/glycerate transporter PLGG1 in the inner one, the cytosol where sucrose is made, the peroxisome with glycolate oxidase and catalase, and the mitochondrion with glycine decarboxylase and SHMT',
  cell: 'A section through a leaf mesophyll cell: cell wall and plasma membrane at the top, a chloroplast pressed against them with its envelope, a granum and the stroma with Rubisco; on its vacuole side a peroxisome and a mitochondrion pressed against it, the cytosol between them, the vacuole below',
};

/** The figure: a window of the panorama in the 800 × 600 frame, the key fixed in the frame. */
export function cellSvg(id: string, arr: Arr, lit: Iterable<Part>, o: CellOpts = {}): string {
  const on = new Set(lit);
  const d = new Draw(id, on, arr === 'cell' ? { ...o, unit: 'none' } : o, arr);
  d.add('bg', null, defs(id));
  (arr === 'strip' ? stripPano : cellPano)(d);
  if (o.bare) return d.out();
  const [x, y, w] = o.win ?? (arr === 'strip' ? WIN.left : WIN.cell), s = 800 / w;
  const label = `${SAY[arr]}. Highlighted: ${[...on].join(', ')}. Everything else is drawn dimmed. Counts per 3 CO2 fixed on the cycle, per 2 O2 on the photorespiratory loop.`;
  return `<svg class="fig-svg cel cel-${arr}" viewBox="0 0 800 600" role="img" aria-label="${label}"><defs><clipPath id="${id}-win"><rect x="0" y="0" width="800" height="556"/></clipPath></defs>
    <g clip-path="url(#${id}-win)"><g transform="scale(${f(s)}) translate(${f(-x)} ${f(-y)})">${d.out()}</g></g>${keyLine(d, arr)}</svg>`;
}

/* ================================================================ kit */

const f = (v: number): string => (Math.round(v * 100) / 100).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** The molecules an animation moves itself (CellOpts.noMol). */
const NO_MOL = new Set(['3-PGA', 'triose phosphate', 'RuBP']);
type Layer = 'bg' | 'pool' | 'mem' | 'body' | 'flow' | 'node' | 'text' | 'top';
const LAYERS: Layer[] = ['bg', 'pool', 'mem', 'body', 'flow', 'node', 'text', 'top'];
class Draw {
  private L: Record<Layer, string[]> = { bg: [], pool: [], mem: [], body: [], flow: [], node: [], text: [], top: [] };
  constructor(readonly id: string, readonly lit: Set<Part>, readonly o: CellOpts, readonly arr: Arr) {}
  on(...ps: Part[]): boolean { return ps.some(p => this.lit.has(p)); }
  /** The count `s` when the figure's unit is `u` and the part is lit, else ''. */
  n(u: Unit, part: Part | Part[], s: string): string { const ps = Array.isArray(part) ? part : [part]; return (this.o.unit ?? 'cycle') === u && this.on(...ps) ? s : ''; }
  add(layer: Layer, part: Part | Part[] | null, svg: string, cls = ''): void {
    if (!part) { this.L[layer].push(svg); return; }
    const ps = Array.isArray(part) ? part : [part];
    this.L[layer].push(`<g data-p="${ps[0]}" class="chn-${this.on(...ps) ? 'on' : 'off'}${cls ? ` ${cls}` : ''}">${svg}</g>`);
  }
  out(): string { return LAYERS.map(k => this.L[k].join('')).join(''); }
}
function defs(p: string): string {
  return `<defs><filter id="${p}-grey" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".12 .24 .05 0 .53 .12 .24 .05 0 .53 .12 .24 .05 0 .53 0 0 0 1 0"/></filter></defs>`;
}
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
/** An arrow: carbon (ink), photorespiration (rust), gas (grey), ATP (clay), NADPH (blue), spent carriers (grey dashes). */
export function arrow(q: Pt[], k: Kind, o: { halo?: boolean; thin?: boolean } = {}): string {
  const thin = o.thin ?? false, hl = thin ? 11 : 13, hw = thin ? 6.5 : 7.5;
  const tip = q[q.length - 1], prev = q[q.length - 2];
  const dir: Pt = [tip[0] - prev[0], tip[1] - prev[1]], L = Math.hypot(dir[0], dir[1]);
  const back: Pt = [tip[0] - (dir[0] / L) * hl * 0.75, tip[1] - (dir[1] / L) * hl * 0.75];
  const dd = smooth([...q.slice(0, -1), back]);
  return `${o.halo ? `<path class="cbb-halo-l" d="${dd}"/>` : ''}<path class="cbb-a cbb-a-${k}${thin ? ' cbb-a-thin' : ''}" d="${dd}"/>${head(tip, dir, `cbb-h-${k}`, hl, hw)}`;
}
function wave(a: Pt, b: Pt, n = 3, amp = 6): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, pts: string[] = [];
  const stop = 1 - 15 / L;
  for (let i = 0; i <= 70; i++) {
    const t = (i / 70) * stop, w = Math.sin(t * n * 2 * Math.PI) * amp * Math.min(1, (stop - t) * 8);
    pts.push(`${i ? 'L' : 'M'}${f(a[0] + dx * t - uy * w)},${f(a[1] + dy * t + ux * w)}`);
  }
  return `<path class="chn-lw" d="${pts.join('')}"/>${head(b, [dx, dy], 'chn-lwh', 15, 8.5)}`;
}

/* ---------- glyphs (sizes for a window shown at 0.87: letters stay ≥ 11 px) ---------- */
export const RB = 11;
const gl = (svg: string): string => `<g class="chn-g">${svg}</g>`;
/** Atom balls in a row, touching (CO₂ 'OCO', O₂ 'OO'), the deck's colours. */
export function balls(x: number, y: number, el: string, r = 11): string {
  return gl([...el].map((a, i) => {
    const cx = x + (i - (el.length - 1) / 2) * r * 1.7;
    return `<circle class="atom atom-${a}" cx="${f(cx)}" cy="${f(y)}" r="${r}"/>${T(cx, y + r * 0.42, a, `cel-att cel-att-${a}`)}`;
  }).join(''));
}
/** Water and hydrogen peroxide: O balls with small H balls. */
function h2oG(x: number, y: number): string {
  return gl(`<circle class="atom atom-H" cx="${f(x - 12)}" cy="${f(y + 9)}" r="6"/><circle class="atom atom-H" cx="${f(x + 12)}" cy="${f(y + 9)}" r="6"/>`) + balls(x, y, 'O');
}
function h2o2G(x: number, y: number): string {
  return gl(`<circle class="atom atom-H" cx="${f(x - 26)}" cy="${f(y + 8)}" r="6"/><circle class="atom atom-H" cx="${f(x + 26)}" cy="${f(y + 8)}" r="6"/>`) + balls(x, y, 'OO');
}
function nh3G(x: number, y: number): string {
  const h = (dx: number, dy: number): string => `<circle class="atom atom-H" cx="${f(x + dx)}" cy="${f(y + dy)}" r="6"/>`;
  return gl(`${h(-13, 8)}${h(13, 8)}${h(0, -14)}<circle class="cbb-n" cx="${f(x)}" cy="${f(y)}" r="${RB}"/>${T(x, y + 4.8, 'N', 'cbb-nt')}`);
}
const tag = (x: number, y: number, s: string, k: 'nadph' | 'atp' | 'plain' | 'pi'): string => gl(tagG(x, y, s, k));

/** A metabolite in carbon form with its name and, in the figure's unit and when its part is lit, its count. */
interface Lab { name: string; c?: Partial<Record<Unit, string>>; at?: 'below' | 'above' | 'right' | 'left'; dx?: number; dy?: number }
function mol(d: Draw, part: Part | Part[], at: Pt, formula: string, lab: Lab, r = RB): void {
  const [x, y] = at, w = rowWidth(formula.length, r), side = lab.at ?? 'below', dx = lab.dx ?? 0, dy = lab.dy ?? 0;
  const u = d.o.unit ?? 'cycle', cnt = d.n(u, part, lab.c?.[u] ?? '');
  if (d.o.noMol && NO_MOL.has(lab.name)) return;
  d.add('node', part, gl(row(x, y, formula, { r })));
  const nm = (xx: number, yy: number, a: A): string => T(xx, yy, lab.name, 'cel-mn cel-halo', a);
  const ct = (xx: number, yy: number, a: A): string => (cnt ? T(xx, yy, cnt, 'cel-cnt cel-halo', a) : '');
  let s = '';
  if (side === 'below') s = nm(x + dx, y + r + 21 + dy, 'middle') + ct(x + dx, y + r + 39 + dy, 'middle');
  else if (side === 'above') s = nm(x + dx, y - r - (cnt ? 28 : 10) + dy, 'middle') + ct(x + dx, y - r - 10 + dy, 'middle');
  else if (side === 'right') s = nm(x + w / 2 + 10 + dx, y + (cnt ? -2 : 6) + dy, 'start') + ct(x + w / 2 + 10 + dx, y + 16 + dy, 'start');
  else s = nm(x - w / 2 - 10 + dx, y + (cnt ? -2 : 6) + dy, 'end') + ct(x - w / 2 - 10 + dx, y + 16 + dy, 'end');
  d.add('text', part, s);
}

/* ---------- proteins: our renders (2.4 px per Å), k = 1 is the chain's scale ---------- */
const PXU = 0.95 / 2.4;
type Prot = 'rubisco' | 'prk' | 'gapdh' | 'tpt' | 'gox' | 'cat' | 'gdcp' | 'gdch' | 'shmt' | 'glyk' | 'gs';
const PROT: Record<Prot, { href: string; g: string; w: number; h: number; s?: number; memX?: number }> = {
  rubisco: { href: rubPng, g: rubG, w: 548, h: 471, s: 0.95 / 4 },
  prk: { href: prkPng, g: prkG, w: 292, h: 170 }, gapdh: { href: gapdhPng, g: gapdhG, w: 234, h: 236 },
  tpt: { href: tptPng, g: tptG, w: 159, h: 263, memX: 83.7 }, gox: { href: goxPng, g: goxG, w: 252, h: 252 },
  cat: { href: catPng, g: catG, w: 264, h: 250 }, gdcp: { href: gdcpPng, g: gdcpG, w: 302, h: 222 },
  gdch: { href: gdchPng, g: gdchG, w: 128, h: 111 }, shmt: { href: shmtPng, g: shmtG, w: 300, h: 226 },
  glyk: { href: glykPng, g: glykG, w: 178, h: 149 }, gs: { href: gsPng, g: gsG, w: 310, h: 311 },
};
/** Size of a protein in figure units at scale k. */
export const protSize = (p: Prot, k = 1): [number, number] => { const P = PROT[p], s = (P.s ?? PXU) * k; return [P.w * s, P.h * s]; };
/** A protein centred on c (for the membrane protein: c is on its membrane centre line); dimmed: the grey copy. */
function prot(d: Draw, part: Part | Part[], p: Prot, c: Pt, k = 1, name?: [string, Pt, A?]): void {
  const P = PROT[p], s = (P.s ?? PXU) * k, w = P.w * s, h = P.h * s, ps = Array.isArray(part) ? part : [part];
  const x = P.memX !== undefined ? c[0] - P.memX * s : c[0] - w / 2;
  d.add('body', part, `<image class="cel-p cel-p-${p}" href="${d.on(...ps) ? P.href : P.g}" x="${f(x)}" y="${f(c[1] - h / 2)}" width="${f(w)}" height="${f(h)}"/>`);
  if (name) d.add('text', part, T(name[1][0], name[1][1], name[0], 'cel-prot cel-halo', name[2] ?? 'middle'));
}
/** A protein without a structure (PLGG1): a drawn outline of its size across the membrane, marked as drawn. */
function drawnProt(d: Draw, part: Part | Part[], c: Pt, w: number, h: number): void {
  const r = w * 0.32;
  d.add('body', part, `<rect class="cel-drawn" x="${f(c[0] - w / 2)}" y="${f(c[1] - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}"/>
    <path class="cel-wallf" d="M${f(c[0] - w / 4)},${f(c[1] - h / 2 + 6)}V${f(c[1] + h / 2 - 6)}M${f(c[0])},${f(c[1] - h / 2 + 4)}V${f(c[1] + h / 2 - 4)}M${f(c[0] + w / 4)},${f(c[1] - h / 2 + 6)}V${f(c[1] + h / 2 - 6)}" style="stroke:#5f8f87;stroke-width:1.4"/>`);
}
function ferredoxin(d: Draw, part: Part, c: Pt, k = 1): string { return carrierImg('fd', c[0], c[1], k, !d.on(part)); }

/* ---------- bilayers, as chain.ts bilayerR: heads on both faces, two tails each ---------- */
type Seg = { L: [number, number, number, number] } | { A: [number, number, number, number, number, number] };
function sample(segs: Seg[], step: number): Array<[number, number, number, number]> {
  const fine: Array<[number, number]> = [];
  for (const s of segs) {
    if ('L' in s) { const [x0, y0, x1, y1] = s.L, n = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 2)); for (let i = 0; i <= n; i++) fine.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]); }
    else { const [cx, cy, rx, ry, a0, a1] = s.A, n = 360; for (let i = 0; i <= n; i++) { const t = ((a0 + (a1 - a0) * i / n) * Math.PI) / 180; fine.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]); } }
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
  const [x0, y0] = p(a0), [x1, y1] = p(a1), big = Math.abs(a1 - a0) > 180 ? 1 : 0, sw = a1 > a0 ? 1 : 0;
  if (Math.abs(a1 - a0) >= 359.9) { const [xm, ym] = p((a0 + a1) / 2); return `${i ? 'L' : 'M'}${f(x0)},${f(y0)}A${f(rx)},${f(ry)} 0 1 ${sw} ${f(xm)},${f(ym)}A${f(rx)},${f(ry)} 0 1 ${sw} ${f(x1)},${f(y1)}`; }
  return `${i ? 'L' : 'M'}${f(x0)},${f(y0)}A${f(rx)},${f(ry)} 0 ${big} ${sw} ${f(x1)},${f(y1)}`;
}).join('');
/** A bilayer along segments: half-thickness `half` (19 = 7m1), head radius r, head spacing `step`. */
export function bilayer(segs: Seg[], half = 19, r = 3.1, step = 7.2): string {
  const heads: string[] = [], tails: string[] = [], tl = half - r - 3;
  for (const [x, y, nx, ny] of sample(segs, step)) for (const sg of [1, -1]) {
    const hx = x + sg * nx * (half - r), hy = y + sg * ny * (half - r);
    heads.push(`M${f(hx - r)},${f(hy)}a${r},${r} 0 1 0 ${f(2 * r)},0a${r},${r} 0 1 0 ${f(-2 * r)},0`);
    const ax = x + sg * nx * (half - 2 * r), ay = y + sg * ny * (half - 2 * r), tx = -ny, ty = nx;
    for (const o of [-1.2, 1.2]) tails.push(`M${f(ax + tx * o)},${f(ay + ty * o)}l${f(-sg * nx * tl)},${f(-sg * ny * tl)}`);
  }
  return `<path class="cbb-band" d="${segPath(segs)}" stroke-width="${f(2 * half)}" fill="none"/><path class="chn-tail" d="${tails.join('')}"/><path class="chn-head" d="${heads.join('')}"/>`;
}
const ell = (cx: number, cy: number, rx: number, ry: number): Seg[] => [{ A: [cx, cy, rx, ry, -90, 270] }];

/* ---------- key ---------- */
function keyLine(d: Draw, arr: Arr): string {
  const x = 14, y = 590;
  const ball = (cx: number, a: 'C' | 'P' | 'N'): string => gl(row(cx, y - 5, a, { r: 8.5 }));
  let s = `<rect class="cel-band" x="0" y="556" width="800" height="44"/>${arrow([[x, y - 5], [x + 34, y - 5]], 'c', { thin: true })}${T(x + 42, y, 'carbon', 'cbb-key', 'start')}
    ${arrow([[x + 108, y - 5], [x + 142, y - 5]], 'pr', { thin: true })}${T(x + 150, y, 'photorespiration', 'cbb-key', 'start')}
    ${ball(x + 292, 'C')}${ball(x + 316, 'P')}${ball(x + 340, 'N')}${balls(x + 364, y - 5, 'O', 8.5)}
    ${T(790, y, UNIT_SAY[d.o.unit ?? 'cycle'], 'cbb-cnt', 'end')}
    ${d.o.limits ? '' : T(790, y - 20, arr === 'strip' ? 'proteins at the chain’s scale; compartments cut to fit' : 'proteins and membranes at half the chain’s scale; compartments not to scale', 'cel-note', 'end')}`;
  if (d.o.limits) {
    const X: Record<'c' | 'j' | 'p', [number, number, string, string]> = { c: [14, 120, 'A<tspan class="cbb-sub" dy="4">c</tspan><tspan dy="-4"> ~ V</tspan><tspan class="cbb-sub" dy="4">cmax</tspan>', 'Rubisco'],
      j: [200, 252, 'A<tspan class="cbb-sub" dy="4">j</tspan><tspan dy="-4"> ~ J</tspan>', 'electron transport'], p: [400, 474, 'A<tspan class="cbb-sub" dy="4">p</tspan><tspan dy="-4"> ~ TPU</tspan>', 'triose-phosphate use'] };
    for (const k of ['c', 'j', 'p'] as const) if (d.on(`lim-${k}` as Part)) s += `${T(X[k][0], 568, X[k][2], `cbb-limk cbb-lim-${k}`, 'start')}${T(X[k][1], 568, X[k][3], 'cbb-cnt', 'start')}`;
  }
  return s;
}
function limit(d: Draw, k: 'c' | 'j' | 'p', box: [number, number, number, number], tagAt: Pt): void {
  const part = `lim-${k}` as Part;
  if (!d.o.limits || !d.on(part)) return;
  const sym = { c: 'A<tspan class="cbb-sub" dy="4">c</tspan>', j: 'A<tspan class="cbb-sub" dy="4">j</tspan>', p: 'A<tspan class="cbb-sub" dy="4">p</tspan>' }[k];
  d.add('top', part, `<rect class="cbb-box cbb-box-${k}" x="${f(box[0])}" y="${f(box[1])}" width="${f(box[2])}" height="${f(box[3])}" rx="16"/>
    <rect class="cbb-limtag cbb-box-${k}" x="${f(tagAt[0] - 22)}" y="${f(tagAt[1] - 14)}" width="44" height="28" rx="9"/>${T(tagAt[0] - 1, tagAt[1] + 5, sym, `cbb-lim cbb-lim-${k}`)}`);
}

/* ================================================================ the strip (true scale) */

/** The strip's x: inner and outer envelope membranes, peroxisome and mitochondrion centres, panorama width. */
export const SX = { inner: 760, outer: 818, perox: [1022, 300] as Pt, mito: [1362, 300] as Pt, width: 1540 };
/** Where the chain's NADPH and ATP tags end (7m1 glyph mode), in strip units when the strip sits right of it. */
const CHAIN_NADPH: Pt = [657 - 800, 64], CHAIN_ATP: Pt = [807 - 800, 92];

function stripPano(d: Draw): void {
  const yM = 300, xe = 52, IN = SX.inner, OUT = SX.outer;
  d.add('bg', null, `<rect class="cel-stroma" x="0" y="-60" width="${IN}" height="720"/><rect class="cel-ims" x="${IN}" y="-60" width="${OUT - IN}" height="720"/>`);
  // the thylakoid end: membrane in from the left (7m1: centre y 300, ±19; lumen to 452), closing round its lumen
  const segs: Seg[] = [{ L: [-8, yM, xe, yM] }, { A: [xe, 376, 40, 76, -90, 90] }, { L: [xe, 452, -8, 452] }];
  d.add('mem', ['thyl', 'light'], `<defs><linearGradient id="${d.id}-fade" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
      <mask id="${d.id}-mf" maskUnits="userSpaceOnUse" x="-10" y="-60" width="200" height="720"><rect x="-10" y="-60" width="200" height="720" fill="#fff"/><rect x="-10" y="404" width="80" height="90" fill="url(#${d.id}-fade)"/></mask></defs>
    <path class="cel-lumen" d="${segPath(segs)}Z"/><g mask="url(#${d.id}-mf)">${bilayer(segs)}</g>`, 'cbb-thyl');
  d.add('text', 'thyl', `${d.o.join ? '' : T(10, 392, 'lumen', 'chn-zone', 'start')}${T(8, 500, 'thylakoid', 'cbb-org', 'start')}`);
  if (!d.o.join) d.add('flow', 'light', `${wave([62, 164], [54, 270])}${T(76, 190, 'light', 'chn-light', 'start')}`);
  // the envelope: inner and outer bilayer, cut by the frame
  d.add('mem', null, `${bilayer([{ L: [IN, -60, IN, 660] }])}${bilayer([{ L: [OUT, -60, OUT, 660] }])}`);
  d.add('text', null, `${T(IN - 26, 30, 'stroma', 'chn-zone', 'end')}${T(OUT + 32, 590, 'cytosol', 'cel-zone', 'start')}`);
  d.add('text', null, `<g transform="translate(${(IN + OUT) / 2} 236) rotate(-90)">${T(0, 6, 'envelope', 'cbb-org')}</g>`);

  // ATP and NADPH from the thylakoid (from the chain's own tags when joined); the spent carriers back
  const n0: Pt = d.o.join ? CHAIN_NADPH : [-4, 64], a0: Pt = d.o.join ? CHAIN_ATP : [-4, 96];
  const gap: Pt = [232, 200];
  d.add('flow', 'supply', `${arrow([n0, [100, 64], [150, 96], [gap[0] - 46, gap[1] - 34]], 'nadph')}${arrow([a0, [86, 98], [124, 146], [gap[0] - 50, gap[1] + 4]], 'atp')}`);
  if (!d.o.noMol) d.add('node', 'supply', `${tag(94, 64, d.n('cycle', 'supply', '6 ') + 'NADPH', 'nadph')}${tag(70, 100, d.n('cycle', 'supply', '6 ') + 'ATP', 'atp')}`);
  d.add('flow', 'supply', arrow([[gap[0] - 16, gap[1] - 50], [176, 52], [120, 32], [d.o.join ? -70 : -2, 30]], 'ret', { thin: true }));
  d.add('node', 'supply', rowG(70, 30, [['NADP⁺', 'plain'], ['ADP', 'atp'], ['', 'pi']]));

  // the cycle: Rubisco (bottom), 3-PGA → GAPDH → triose phosphate (left, up), PRK → RuBP (right, down)
  const rub: Pt = [312, 430], pga: Pt = [162, 338], tp: Pt = [352, 98], prk: Pt = [504, 236], rubp: Pt = [470, 330];
  prot(d, 'rubisco', 'rubisco', rub, 1, ['Rubisco', [rub[0], rub[1] + 76]]);
  prot(d, 'reduce', 'gapdh', gap, 1, ['GAPDH', [gap[0] + 52, gap[1] - 2], 'start']);
  prot(d, 'regen', 'prk', prk, 1, ['PRK', [prk[0] + 30, prk[1] - 40]]);
  mol(d, 'pga', pga, 'CCCP', { name: '3-PGA', c: { cycle: '6 × 3 C = 18 C', reaction: '3 C' } });
  mol(d, 'tp', tp, 'CCCP', { name: 'triose phosphate', c: { cycle: '6 × 3 C = 18 C' }, at: 'above' });
  mol(d, ['rubisco', 'regen'], rubp, 'PCCCCCP', { name: 'RuBP', c: { cycle: '3 × 5 C = 15 C', reaction: '5 C' }, dx: 18 });
  d.add('flow', ['rubisco', 'regen'], arrow([[rubp[0] - 66, rubp[1] + 14], [rub[0] + 62, rub[1] - 50]], 'c'));
  d.add('flow', 'carbox', arrow([[rub[0] - 66, rub[1] - 20], [pga[0] + 52, pga[1] + 8]], 'c'));
  d.add('text', 'carbox', `${T(170, 456, 'carboxylation', 'cbb-proc cbb-halo')}${d.n('reaction', 'carbox', T(170, 476, '5 C + 1 C = 2 × 3 C', 'cel-cnt cel-halo'))}`);
  d.add('flow', 'reduce', `${arrow([[pga[0] + 6, pga[1] - 14], [gap[0] - 34, gap[1] + 50]], 'c')}${arrow([[gap[0] + 30, gap[1] - 48], [tp[0] - 50, tp[1] + 12]], 'c')}`);
  d.add('text', 'reduce', T(gap[0] + 52, gap[1] + 20, 'reduction', 'cbb-proc cbb-halo', 'start'));
  d.add('flow', 'regen', `${arrow([[tp[0] + 48, tp[1] + 8], [446, 150], [prk[0] - 20, prk[1] - 36]], 'c')}${arrow([[prk[0] - 14, prk[1] + 34], [rubp[0] - 4, rubp[1] - 14]], 'c')}`);
  d.add('text', 'regen', `${T(474, 138, 'regeneration', 'cbb-proc cbb-halo', 'start')}${d.n('cycle', 'regen', T(474, 158, '5 × 3 C = 15 C', 'cel-cnt cel-halo', 'start'))}`);
  d.add('node', 'regen', tag(600, 226, d.n('cycle', 'regen', '3 ') + 'ATP', 'atp'));
  // CO₂ and O₂ at Rubisco
  if (!d.o.noMol) d.add('node', 'co2', balls(306, 330, 'OCO'));
  if (!d.o.noMol) d.add('text', 'co2', `${T(306, 308, d.n('cycle', 'co2', '3 ') + 'CO₂', 'cel-mn cel-halo')}${d.n('reaction', 'co2', T(348, 308, '1 C', 'cel-cnt cel-halo', 'start'))}`);
  d.add('flow', 'co2', arrow([[306, 344], [306, 372]], 'gas', { thin: true }));
  d.add('node', 'o2', balls(206, 524, 'OO'));
  d.add('text', 'o2', T(182, 530, 'O₂', 'cel-mn cel-halo', 'end'));
  d.add('flow', 'o2', arrow([[226, 514], [rub[0] - 56, rub[1] + 44]], 'gas', { thin: true }));

  // out: starch in the stroma; triose phosphate through TPT (inner envelope) to the cytosol → sucrose, Pᵢ back
  d.add('body', 'starch', `<ellipse class="cel-starch" cx="560" cy="18" rx="84" ry="40"/>${[0.75, 0.5, 0.26].map(q => `<ellipse class="cel-starchr" cx="560" cy="18" rx="${f(84 * q)}" ry="${f(40 * q)}"/>`).join('')}`);
  d.add('text', 'starch', T(560, 25, 'starch', 'cel-mn cel-halo'));
  d.add('flow', 'starch', arrow([[tp[0] + 46, tp[1] - 8], [476, 36]], 'c', { thin: true }));
  prot(d, 'export', 'tpt', [IN, 112], 1, ['TPT', [IN - 40, 176], 'end']);
  d.add('flow', 'export', `${arrow([[tp[0] + 48, tp[1] + 2], [560, 96], [IN, 100], [OUT + 40, 98], [OUT + 80, 76]], 'c', { halo: true })}${arrow([[OUT + 70, 148], [OUT, 128], [IN - 60, 126]], 'gas', { thin: true, halo: true })}`);
  d.add('node', 'export', `${tag(OUT + 84, 152, '', 'pi')}${gl(row(OUT + 120, 34, 'CCCCCC', { r: 9 }))}${gl(row(OUT + 120, 56, 'CCCCCC', { r: 9 }))}`);
  d.add('text', 'export', `${T(OUT + 120, 92, 'sucrose', 'cel-mn cel-halo')}${d.n('cycle', 'export', T(650, 88, '1 × 3 C', 'cel-cnt cel-halo'))}`);

  // oxygenation → 2-phosphoglycolate → glycolate out through PLGG1 (inner envelope); glycerate back in
  const pg2: Pt = [520, 476];
  d.add('flow', 'oxy', arrow([[rub[0] + 64, rub[1] + 30], [pg2[0] - 40, pg2[1] + 2]], 'pr'));
  d.add('text', 'oxy', `${T(436, 512, 'oxygenation', 'cbb-proc cbb-proc-pr cbb-halo')}${d.n('reaction', 'oxy', T(436, 532, '5 C = 3 C + 2 C', 'cel-cnt cel-halo'))}`);
  mol(d, 'pg2', pg2, 'CCP', { name: '2-phosphoglycolate', c: { reaction: '2 C', loop: '2 × 2 C = 4 C' }, at: 'above', dx: -8 });
  drawnProt(d, ['glycolate', 'glycerate'], [IN, 352], 50, 66);
  d.add('text', ['glycolate', 'glycerate'], `<path class="cel-ld" d="M${IN + 22},352H${OUT + 26}"/>${T(OUT + 30, 358, 'PLGG1', 'cel-prot cel-halo', 'start')}`);
  d.add('flow', 'glycolate', arrow([[pg2[0] + 36, pg2[1] - 2], [650, 416], [IN, 372], [OUT + 40, 376], [SX.perox[0] - 120, 340]], 'pr', { halo: true }));
  // back in the stroma: glycerate kinase (glycerate → 3-PGA, ATP), glutamine synthetase (NH₃; ATP, ferredoxin)
  prot(d, 'glycerate', 'glyk', [680, 300], 1, ['glycerate kinase', [676, 262]]);
  d.add('flow', 'glycerate', `${arrow([[SX.perox[0] - 118, 312], [OUT + 30, 336], [IN, 334], [722, 314]], 'pr', { halo: true })}${arrow([[644, 312], [612, 326], [600, 342]], 'pr', { thin: true })}`);
  mol(d, 'glycerate', [600, 360], 'CCCP', { name: '3-PGA', dx: 0 });
  d.add('node', 'glycerate', tag(676, 344, 'ATP', 'atp'));
  prot(d, 'nh3', 'gs', [660, 548]);
  d.add('node', 'nh3', `${tag(588, 528, 'ATP', 'atp')}${ferredoxin(d, 'nh3', [720, 494], 0.9)}`);
  d.add('text', 'nh3', T(650, 476, 'GS + Fd-GOGAT', 'cel-prot cel-halo'));

  /* ---- the cytosol side: peroxisome and mitochondrion (the right window) ---- */
  const [px, py] = SX.perox, [mx, my] = SX.mito;
  d.add('bg', null, `<ellipse class="cel-perox" cx="${px}" cy="${py}" rx="106" ry="156"/>`);
  d.add('mem', 'perox', bilayer(ell(px, py, 106, 156)));
  d.add('text', 'perox', T(px, py - 182, 'peroxisome', 'cel-zone cel-halo'));
  prot(d, 'perox', 'gox', [px, py - 70], 1, ['glycolate oxidase', [px, py - 134]]);
  prot(d, 'perox', 'cat', [px + 4, py + 76], 1, ['catalase', [px, py + 146]]);
  d.add('node', 'perox', `${h2o2G(px - 44, py + 2)}${h2oG(px + 52, py + 2)}`);
  d.add('flow', 'perox', arrow([[px - 8, py + 2], [px + 30, py + 2]], 'gas', { thin: true }));
  d.add('text', 'perox', T(px - 44, py - 14, 'H₂O₂', 'cel-mn cel-halo'));
  d.add('bg', null, `<ellipse class="cel-matrix" cx="${mx}" cy="${my}" rx="152" ry="236"/>`);
  d.add('mem', 'mito', `${bilayer(ell(mx, my, 152, 236))}${bilayer(ell(mx, my, 96, 180))}`);
  d.add('text', 'mito', T(mx + 100, 586, 'mitochondrion', 'cel-zone cel-halo'));
  prot(d, 'mito', 'gdcp', [mx + 6, my - 66], 1, ['glycine decarboxylase', [mx, my - 124]]);
  prot(d, 'mito', 'gdch', [mx - 60, my + 8]);
  prot(d, 'mito', 'shmt', [mx + 4, my + 78], 1, ['SHMT', [mx, my + 142]]);
  mol(d, 'glycolate', [OUT + 68, 400], 'CC', { name: d.n('loop', 'glycolate', '2 ') + 'glycolate', c: { loop: '4 C in' }, dx: 2 });
  mol(d, 'glycine', [1176, 96], 'CCN', { name: d.n('loop', 'glycine', '2 ') + 'glycine', at: 'above' });
  d.add('flow', 'glycine', arrow([[px + 66, 186], [1136, 118], [1210, 110], [mx - 100, 168]], 'pr', { halo: true }));
  mol(d, 'serine', [1170, 504], 'CCCN', { name: 'serine', c: { loop: '3 C' } });
  d.add('flow', 'serine', arrow([[mx - 104, 440], [1226, 484], [1112, 488], [px + 60, 432]], 'pr', { halo: true }));
  mol(d, 'glycerate', [OUT + 68, 286], 'CCC', { name: 'glycerate', c: { loop: '3 C back' }, at: 'above' });
  d.add('node', 'co2-out', balls(mx + 4, 6, 'OCO'));
  d.add('text', 'co2-out', `${T(mx + 48, 12, 'CO₂', 'cel-mn cel-halo', 'start')}${d.n('loop', 'co2-out', T(mx + 48, 32, '1 C lost', 'cel-cnt cel-halo', 'start'))}`);
  d.add('flow', 'co2-out', arrow([[mx + 4, my - 196], [mx + 4, 22]], 'gas', { thin: true }));
  d.add('node', 'nh3', nh3G(1296, 566));
  d.add('text', 'nh3', T(1316, 572, 'NH₃', 'cel-mn cel-halo', 'start'));
  d.add('flow', 'nh3', `${arrow([[mx - 30, my + 232], [1306, 552]], 'pr', { thin: true })}${arrow([[1278, 568], [px + 60, 566], [OUT + 30, 556], [IN, 552], [724, 548]], 'pr', { thin: true })}`);

  // FvCB limits (C8)
  limit(d, 'c', [236, 290, 150, 200], [258, 290]);
  limit(d, 'j', [-2, 14, 280, 270], [258, 284]);
  limit(d, 'p', [300, -4, 470, 120], [660, 116]);
}

/* ================================================================ the cell section (half scale) */

// A section through a C₃ mesophyll cell, as in leaf micrographs (cell wall and plasma membrane against the intercellular
// air space; the chloroplast pressed against them; peroxisome and mitochondrion on the chloroplast's vacuole side, so
// that CO₂ released by photorespiration must cross the chloroplast, where Rubisco can refix part of it: Busch et al.
// 2013; Sage & Sage 2009). Proteins and bilayers at half the chain's scale; compartment sizes not to scale.
const K2 = 0.5, H2 = 9.5;
const bil2 = (segs: Seg[]): string => bilayer(segs, H2, 1.7, 4.2);

function cellPano(d: Draw): void {
  // air space, cell wall, plasma membrane
  d.add('bg', null, `<rect class="cel-ims" x="-10" y="-10" width="820" height="34"/><rect class="cel-wall" x="-10" y="24" width="820" height="26"/>
    ${Array.from({ length: 26 }, (_, i) => `<path class="cel-wallf" d="M${i * 32 - 10},${30 + (i % 3) * 5}q16,-4 32,0"/>`).join('')}
    <rect class="cel-vac" x="-10" y="520" width="820" height="60"/>`);
  d.add('mem', null, `${bil2([{ L: [-10, 60, 810, 60] }])}${bil2([{ L: [-10, 520, 810, 520] }])}`);
  d.add('text', null, `${T(14, 18, 'air space', 'cel-zone', 'start')}${T(14, 44, 'cell wall', 'cbb-org', 'start')}${T(790, 92, 'plasma membrane', 'cbb-org', 'end')}
    ${T(790, 550, 'vacuole', 'cel-zone', 'end')}${T(14, 404, 'cytosol', 'cel-zone', 'start')}`);
  // the chloroplast: envelope (two bilayers), stroma, a granum
  const [cx, cy, rx, ry] = [300, 214, 272, 140];
  d.add('bg', null, `<ellipse class="cel-stroma" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`);
  d.add('mem', null, `${bil2(ell(cx, cy, rx, ry))}${bil2(ell(cx, cy, rx - 22, ry - 22))}`);
  d.add('text', null, `${T(cx - 120, cy - 96, 'chloroplast', 'cel-zone cel-halo')}`);
  const stack = Array.from({ length: 4 }, (_, k) => {
    const y = 176 + k * 26, x0 = 70, x1 = 170, r = 9.5;
    const segs: Seg[] = [{ L: [x0, y - 3, x1, y - 3] }, { A: [x1, y + 0.5, r - 6, 3.5, -90, 90] }, { L: [x1, y + 4, x0, y + 4] }, { A: [x0, y + 0.5, r - 6, 3.5, 90, 270] }];
    return `<path class="cel-lumen" d="${segPath(segs)}Z"/>${bilayer(segs, 7, 1.4, 3.6)}`;
  }).join('');
  d.add('mem', ['thyl', 'light'], stack, 'cbb-thyl');
  d.add('text', 'thyl', T(120, 296, 'granum', 'cbb-org cel-halo'));
  d.add('flow', 'light', `${wave([96, -6], [112, 160], 3, 6)}${T(84, 116, 'light', 'chn-light', 'end')}`);
  // ATP and NADPH from the granum to GAPDH
  const gap: Pt = [262, 196], rub: Pt = [280, 256], prk: Pt = [418, 172];
  d.add('flow', 'supply', `${arrow([[172, 184], [212, 180], [238, 188]], 'nadph', { thin: true })}${arrow([[172, 226], [214, 222], [240, 208]], 'atp', { thin: true })}`);
  d.add('node', 'supply', `${tag(204, 158, 'NADPH', 'nadph')}${tag(206, 244, 'ATP', 'atp')}`);
  // the cycle: GAPDH, PRK, Rubisco (half scale) and its molecules
  prot(d, 'rubisco', 'rubisco', rub, K2, ['Rubisco', [rub[0], rub[1] + 50]]);
  prot(d, 'reduce', 'gapdh', gap, K2, ['GAPDH', [gap[0] + 28, gap[1] + 6], 'start']);
  prot(d, 'regen', 'prk', prk, K2, ['PRK', [prk[0] + 34, prk[1] + 6], 'start']);
  mol(d, 'tp', [318, 118], 'CCCP', { name: 'triose phosphate', at: 'right' });
  mol(d, 'pga', [196, 290], 'CCCP', { name: '3-PGA', at: 'above', dy: 2 });
  mol(d, ['rubisco', 'regen'], [440, 220], 'PCCCCCP', { name: 'RuBP' });
  d.add('flow', 'carbox', arrow([[rub[0] - 34, rub[1] + 12], [196 + 50, 288]], 'c', { thin: true }));
  d.add('flow', 'reduce', `${arrow([[214, 278], [246, 222]], 'c', { thin: true })}${arrow([[278, 174], [298, 130]], 'c', { thin: true })}`);
  d.add('flow', 'regen', `${arrow([[366, 124], [400, 158]], 'c', { thin: true })}${arrow([[420, 188], [428, 206]], 'c', { thin: true })}`);
  d.add('flow', ['rubisco', 'regen'], arrow([[364, 232], [rub[0] + 34, rub[1] - 10]], 'c', { thin: true }));
  // CO₂ from the air through wall and membranes to Rubisco; O₂ at Rubisco
  d.add('node', 'co2', balls(612, 10, 'OCO'));
  d.add('text', 'co2', T(648, 16, 'CO₂', 'cel-mn cel-halo', 'start'));
  d.add('flow', 'co2', arrow([[600, 24], [540, 110], [372, 196], [rub[0] + 22, rub[1] - 30]], 'gas', { thin: true }));
  d.add('node', 'o2', balls(244, 324, 'OO'));
  d.add('text', 'o2', T(220, 330, 'O₂', 'cel-mn cel-halo', 'end'));
  d.add('flow', 'o2', arrow([[262, 316], [rub[0] - 24, rub[1] + 20]], 'gas', { thin: true }));
  // triose phosphate out through TPT (inner envelope, right) → sucrose in the cytosol
  prot(d, 'export', 'tpt', [cx + rx - 22, 196], K2);
  d.add('flow', 'export', arrow([[368, 112], [500, 150], [cx + rx - 22, 186], [cx + rx + 30, 186], [640, 168]], 'c', { thin: true, halo: true }));
  d.add('node', 'export', `${gl(row(700, 140, 'CCCCCC', { r: 8 }))}${gl(row(700, 160, 'CCCCCC', { r: 8 }))}${tag(640, 214, '', 'pi')}`);
  d.add('text', 'export', `${T(700, 192, 'sucrose', 'cel-mn cel-halo')}${T(cx + rx + 24, 240, 'TPT', 'cel-prot cel-halo', 'start')}`);
  d.add('flow', 'export', arrow([[624, 216], [cx + rx + 6, 208], [cx + rx - 40, 208]], 'gas', { thin: true }));
  d.add('body', 'starch', `<ellipse class="cel-starch" cx="340" cy="186" rx="26" ry="12"/><ellipse class="cel-starchr" cx="340" cy="186" rx="14" ry="6"/>`);
  d.add('text', 'starch', T(340, 214, 'starch', 'cbb-org cel-halo'));
  // oxygenation → 2-phosphoglycolate → PLGG1 (inner envelope, vacuole side) → peroxisome
  mol(d, 'pg2', [384, 316], 'CCP', { name: '2-phosphoglycolate', at: 'above' });
  d.add('flow', 'oxy', arrow([[rub[0] + 30, rub[1] + 22], [350, 314]], 'pr', { thin: true }));
  // the peroxisome and the mitochondrion, pressed on the chloroplast's vacuole side
  const px: Pt = [318, 438], pr = 60, mx: Pt = [516, 406];
  d.add('bg', null, `<circle class="cel-perox" cx="${px[0]}" cy="${px[1]}" r="${pr}"/><ellipse class="cel-matrix" cx="${mx[0]}" cy="${mx[1]}" rx="96" ry="66"/>`);
  d.add('mem', 'perox', bil2(ell(px[0], px[1], pr, pr)));
  d.add('mem', 'mito', `${bil2(ell(mx[0], mx[1], 96, 66))}${bil2(ell(mx[0], mx[1], 74, 44))}`);
  d.add('text', 'perox', T(px[0] - 70, px[1] + 70, 'peroxisome', 'cel-zone cel-halo', 'end'));
  d.add('text', 'mito', T(mx[0] + 100, mx[1] + 84, 'mitochondrion', 'cel-zone cel-halo'));
  prot(d, 'perox', 'gox', [px[0] - 18, px[1] - 12], K2);
  prot(d, 'perox', 'cat', [px[0] + 22, px[1] + 22], K2);
  prot(d, 'mito', 'gdcp', [mx[0] - 24, mx[1] - 4], K2);
  prot(d, 'mito', 'shmt', [mx[0] + 38, mx[1] + 6], K2);
  d.add('text', 'perox', `${T(px[0] - 70, px[1] - 30, 'glycolate', 'cel-prot cel-halo', 'end')}${T(px[0] - 70, px[1] - 12, 'oxidase', 'cel-prot cel-halo', 'end')}${T(px[0] - 70, px[1] + 26, 'catalase', 'cel-prot cel-halo', 'end')}`);
  d.add('text', 'mito', `${T(mx[0] + 104, mx[1] - 34, 'glycine', 'cel-prot cel-halo', 'start')}${T(mx[0] + 104, mx[1] - 16, 'decarboxylase', 'cel-prot cel-halo', 'start')}${T(mx[0] + 104, mx[1] + 22, 'SHMT', 'cel-prot cel-halo', 'start')}`);
  drawnProt(d, ['glycolate', 'glycerate'], [cx, cy + ry - 22], 33, 25);
  d.add('text', ['glycolate', 'glycerate'], T(cx - 24, cy + ry + 6, 'PLGG1', 'cel-prot cel-halo', 'end'));
  d.add('flow', 'glycolate', arrow([[352, 322], [cx + 8, cy + ry - 30], [cx + 8, cy + ry + 6], [px[0] + 4, px[1] - 38]], 'pr', { thin: true }));
  d.add('flow', 'glycine', arrow([[px[0] + 34, px[1] - 18], [mx[0] - 50, mx[1] - 8]], 'pr', { thin: true }));
  d.add('flow', 'serine', arrow([[mx[0] - 44, mx[1] + 30], [px[0] + 44, px[1] + 26]], 'pr', { thin: true }));
  d.add('flow', 'glycerate', arrow([[px[0] - 14, px[1] - 44], [cx - 8, cy + ry + 6], [cx - 8, cy + ry - 30], [cx - 4, cy + ry - 52]], 'pr', { thin: true }));
  // CO₂ from the mitochondrion must cross the chloroplast, where Rubisco can refix part of it; NH₃ back to the chloroplast
  d.add('flow', 'co2-out', `${arrow([[mx[0] - 10, mx[1] - 56], [494, 300], [488, 286]], 'gas', { thin: true, halo: true })}${arrow([[458, 268], [380, 262], [rub[0] + 36, rub[1] + 6]], 'gas', { thin: true, halo: true })}`);
  d.add('node', 'co2-out', balls(486, 272, 'OCO', 9));
  d.add('text', 'co2-out', T(486, 252, 'CO₂', 'cel-mn cel-halo'));
  d.add('node', 'nh3', nh3G(700, 330));
  d.add('text', 'nh3', T(720, 336, 'NH₃', 'cel-mn cel-halo', 'start'));
  d.add('flow', 'nh3', `${arrow([[mx[0] + 64, mx[1] - 50], [680, 340]], 'pr', { thin: true })}${arrow([[690, 318], [620, 290], [cx + rx - 40, 262]], 'pr', { thin: true })}`);
  // FvCB limits (C8)
  limit(d, 'c', [236, 222, 96, 100], [236, 222]);
  limit(d, 'j', [56, 130, 172, 132], [78, 130]);
  limit(d, 'p', [300, 96, 448, 132], [740, 228]);
}
