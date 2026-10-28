// The leaf section for "why CO₂ is hard to get, and how plants cope" (slides C10–C13; lecturer, 28 Oct 2026, brief
// research/redo-2026-10-28/CO2_COPING_BRIEF.md): one spatial schema in the look of the dark-reaction strip
// (figs/cell-schema.ts) and the 7m1 chain (figs/chain.ts). Each slide lights its part; the rest is dimmed and unnamed.
//
// Left to right: outside air and the boundary layer; the epidermis with a stoma (2 guard cells, the pore between them);
// the substomatal air space; a mesophyll cell (cell wall, plasma membrane, a chloroplast pressed against the wall that
// faces the air space, the cytosol with a peroxisome and a mitochondrion on the chloroplast's inner side, the vacuole);
// the bundle-sheath cell (shared wall with plasmodesmata; a chloroplast, and a mitochondrion on the vein side); the vein.
// Membranes are bilayers at this scale (heads on both faces); walls are bands. Proteins are our renders
// (scripts/cell_render.mjs, scripts/leaf_render.mjs; 2.4 px per Å) at one scale, K × the chain's.
// Facts (fact table in the chunk report): NADP-ME type C₄ as in maize: carbonic anhydrase and PEP carboxylase in the
// mesophyll cytosol, PPDK in the mesophyll chloroplast, NADP-malic enzyme and RuBisCO in the bundle-sheath chloroplast
// (Furbank 2011, 2016; Leegood 2002; von Caemmerer 2021); maize mesophyll chloroplasts carry no RuBisCO, so the C₄ views
// leave the mesophyll RuBisCO out. C₂: glycine decarboxylase in bundle-sheath mitochondria only (Rawsthorne et al. 1988;
// Sage et al. 2014). C₃: chloroplasts cover 92–99 % of the wall facing the air spaces, mitochondria lie behind them
// (Busch et al. 2013). CAM: one cell; by night PEP carboxylase, malic acid into the vacuole; by day decarboxylation
// behind closed stomata (Borland et al. 2009; Winter & Smith 2022).
// Parts drawn only when lit (ONLY_LIT): the molecules and arrows of one mechanism, so that C₂, C₄ and CAM routes never
// show together. Markup: every piece of a part sits in <g data-p="<part>" class="chn-on|chn-off"> (chain.css dims .chn-off).
import './cbb-schema.css';
import './cell-schema.css';
import './leaf-schema.css';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import rubG from '../../assets/cell/rubisco-g.png';
import gdcpPng from '../../assets/cell/gdcp.png';
import gdcpG from '../../assets/cell/gdcp-g.png';
import gdchPng from '../../assets/cell/gdch.png';
import gdchG from '../../assets/cell/gdch-g.png';
import goxPng from '../../assets/cell/gox.png';
import goxG from '../../assets/cell/gox-g.png';
import pepcPng from '../../assets/leaf/pepc.png';
import pepcG from '../../assets/leaf/pepc-g.png';
import caPng from '../../assets/leaf/ca.png';
import caG from '../../assets/leaf/ca-g.png';
import mePng from '../../assets/leaf/me.png';
import meG from '../../assets/leaf/me-g.png';
import ppdkPng from '../../assets/leaf/ppdk.png';
import ppdkG from '../../assets/leaf/ppdk-g.png';
import { arrow, balls, bbox, bilayer } from './cell-schema';
import { tagG } from './chain';
import { row, rowWidth } from './carbon-form';

export type Pt = [number, number];
type A = 'start' | 'middle' | 'end';
type Box = [number, number, number, number];

/** The parts a figure can light. */
export type LPart =
  // C10: the CO₂ path from the air to RuBisCO, the water leaving, the three conductances and concentrations
  | 'air' | 'bl' | 'stoma' | 'as' | 'mwall' | 'co2-path' | 'h2o' | 'gb' | 'gs' | 'gm'
  // the mesophyll cell
  | 'm-cp' | 'm-rub' | 'starch' | 'ppdk' | 'ca' | 'pepc' | 'm-perox' | 'm-mito' | 'vac'
  // C₃ photorespiration in the mesophyll cell and refixation (C11)
  | 'co2-in' | 'o2' | 'pr-m' | 'pr-gly' | 'refix' | 'escape'
  // C₂ (C11a)
  | 'gly' | 'ser' | 'bs-mito' | 'bs-co2' | 'bs-rub' | 'bs-cp'
  // C₄ (C12)
  | 'c4-co2' | 'hco3' | 'pep' | 'c4acid' | 'me' | 'me-co2' | 'pyr' | 'atp'
  // CAM (C13): night uptake, the acid in the vacuole, day release
  | 'cam-n' | 'cam-acid' | 'cam-d' | 'cam-me' | 'pep-starch';

/** Parts drawn only when lit: one mechanism's molecules and arrows. */
const ONLY_LIT = new Set<LPart>(['co2-path', 'h2o', 'gb', 'gs', 'gm', 'co2-in', 'o2', 'pr-m', 'pr-gly', 'refix', 'escape', 'gly', 'ser', 'bs-co2',
  'c4-co2', 'hco3', 'pep', 'c4acid', 'me-co2', 'pyr', 'atp', 'cam-n', 'cam-acid', 'cam-d', 'cam-me', 'pep-starch']);

/** C10: the CO₂ path and the conductances, the stoma and its water. */
export const LIT_C10: LPart[] = ['air', 'bl', 'stoma', 'as', 'mwall', 'co2-path', 'h2o', 'gb', 'gs', 'gm', 'm-cp', 'm-rub'];
/** C11 · C₃: CO₂ to mesophyll RuBisCO; oxygenation; photorespiration in the mesophyll cell; part of the CO₂ refixed. */
export const LIT_C11: LPart[] = ['co2-in', 'm-cp', 'm-rub', 'o2', 'pr-m', 'pr-gly', 'm-perox', 'm-mito', 'refix', 'escape'];
/** C11a · C₂: glycine to the bundle sheath; glycine decarboxylase; CO₂ to bundle-sheath RuBisCO; serine back. */
export const LIT_C11A: LPart[] = ['m-cp', 'm-rub', 'o2', 'pr-m', 'm-perox', 'gly', 'ser', 'bs-mito', 'bs-co2', 'bs-cp', 'bs-rub'];
/** C12 · C₄: the pump and bundle-sheath RuBisCO. */
export const LIT_C12: LPart[] = ['c4-co2', 'ca', 'hco3', 'pepc', 'pep', 'c4acid', 'bs-cp', 'me', 'me-co2', 'bs-rub', 'pyr', 'm-cp', 'ppdk', 'atp'];
/** C13 · CAM by night: stomata open; CO₂ → HCO₃⁻ → PEP carboxylase → malic acid into the vacuole; PEP from starch. */
export const LIT_C13N: LPart[] = ['stoma', 'cam-n', 'ca', 'pepc', 'vac', 'cam-acid', 'm-cp', 'starch', 'pep-starch'];
/** C13 · CAM by day: stomata closed; malic acid out of the vacuole → CO₂ → RuBisCO; pyruvate to starch. */
export const LIT_C13D: LPart[] = ['stoma', 'vac', 'cam-acid', 'cam-d', 'cam-me', 'm-cp', 'm-rub', 'starch'];

export type Unit = 'ppm' | 'perCO2' | 'loop' | 'none';
const UNIT_SAY: Record<Unit, string> = { ppm: 'CO₂ in ppm (µmol mol⁻¹)', perCO2: 'numbers per CO₂', loop: 'numbers per 2 oxygenations', none: '' };

export interface LeafOpts {
  /** The window [x, y, w] of the panorama in the 800 × 600 figure (height w × 0.75). Default: the whole leaf. */
  win?: [number, number, number];
  /** Inner markup only, untransformed (animations, the CAM panels). */
  bare?: boolean;
  unit?: Unit;
  /** Lit parts at secondary weight. */
  sec?: LPart[];
  /** Dimmed parts left out (e.g. mesophyll RuBisCO in the C₄ views: maize mesophyll chloroplasts carry none). */
  hide?: LPart[];
  /** The pore between the guard cells, in figure units (open 12, half-closed 5, closed 0). */
  gap?: number;
  /** Leave out the guard cells (an animation moves its own). */
  noGuard?: boolean;
  /** Malic acid molecules drawn in the vacuole (CAM). */
  acid?: number;
  /** Starch granule size, 0–1 (CAM: full at dawn, small at dusk). */
  starch?: number;
  /** Leave out the lit molecules (an animation moves its own); arrows and enzymes stay. */
  noMol?: boolean;
}

/* ================================================================ geometry (panorama units) */

/** The panorama: 960 × 660; the whole-leaf figure shows it at 800/960. */
export const LW = 960, LH = 640;
/** Protein scale: K × the chain's (0.95 figure units per Å). */
export const K = 0.62;
/** Tissue and cell boundaries. */
export const X = { bl0: 56, epi0: 100, epi1: 140, m0: 222, m1: 600, b1: 892, v0: 900 } as const;
const MY: [number, number] = [30, 606], BY: [number, number] = [58, 580];
/** The mesophyll chloroplast (a rounded box along the wall facing the air space) [x, y, w, h, r]; the bundle-sheath
 *  chloroplast and the organelles as ellipses [cx, cy, rx, ry]; the vacuole [x, y, w, h, r]. */
export const MCP: [number, number, number, number, number] = [240, 98, 158, 474, 64];
export const BCP: [number, number, number, number] = [712, 334, 74, 156];
export const MPER: [number, number, number] = [542, 272, 31];
export const MMIT: [number, number, number, number] = [452, 354, 42, 54];
export const BMIT: [number, number, number, number] = [834, 340, 40, 68];
export const VAC: [number, number, number, number, number] = [420, 420, 160, 164, 34];
/** The stoma: the pore's centre; the guard cells sit above and below it. */
export const PORE: Pt = [120, 340];
/** Plasmodesmata through the shared wall (y). */
const PD_Y = [116, 162, 208, 254, 300, 346, 392, 438, 484, 530];

/** Spots of the panorama: proteins, molecules and arrow ends. Animations read their places from here. */
export const SPOT = (() => {
  const p = (x: number, y: number): Pt => [x, y];
  const cx = MCP[0] + MCP[2] / 2;
  return {
    co2Air: p(28, 340), pore: PORE, asCo2: p(180, 340),
    mRub: p(cx, 340), starch: p(cx, 452), granum: p(cx, 518), ppdk: p(cx, 190), atp: p(cx - 37, 248), amp: p(cx + 37, 248),
    ca: p(452, 96), hco3: p(540, 80), pepc: p(530, 182), pep: p(446, 182),
    c4acid: p(712, 106), pyr: p(520, 300), co2c4: p(204, 200),
    perox: p(MPER[0], MPER[1]), mito: p(MMIT[0], MMIT[1]),
    bsRub: p(BCP[0], 418), me: p(BCP[0], 248), bsMito: p(BMIT[0], BMIT[1]), gdcP: p(BMIT[0], 322), gdcH: p(BMIT[0], 384),
    vac: p(VAC[0] + VAC[2] / 2, VAC[1] + VAC[3] / 2), camMe: p(486, 352),
  };
})();

/* ================================================================ kit */

const f = (v: number): string => (Math.round(v * 100) / 100).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const gl = (svg: string): string => `<g class="chn-g">${svg}</g>`;
type Layer = 'bg' | 'cell' | 'mem' | 'body' | 'flow' | 'node' | 'text' | 'top';
const LAYERS: Layer[] = ['bg', 'cell', 'mem', 'body', 'flow', 'node', 'text', 'top'];
interface Entry { svg: string; part: LPart | null; on: boolean }
/** Molecule ball radius (letters ≥ 11 px at the whole-leaf scale 0.87). */
export const R = 10.5;

/** The abbreviations the leaf figures use, spelled out; a figure lists those it names lit. */
export const ABBR: Array<[string, string]> = [
  ['PEPC', 'phosphoenolpyruvate carboxylase'], ['PEP', 'phosphoenolpyruvate'], ['CA', 'carbonic anhydrase'],
  ['PPDK', 'pyruvate,phosphate dikinase'], ['NADP-ME', 'NADP-malic enzyme'], ['2-PG', '2-phosphoglycolate'],
];

class Draw {
  private L: Record<Layer, Entry[]> = { bg: [], cell: [], mem: [], body: [], flow: [], node: [], text: [], top: [] };
  shown = new Set<string>();
  abbr = new Set<string>();
  counted = false;
  constructor(readonly id: string, readonly lit: Set<LPart>, readonly o: LeafOpts) {}
  on(...ps: LPart[]): boolean { return ps.some(p => this.lit.has(p)); }
  /** The count s when the figure's unit is u and a part is lit, else ''. */
  n(u: Unit, part: LPart | LPart[], s: string): string {
    const ps = Array.isArray(part) ? part : [part], ok = (this.o.unit ?? 'none') === u && this.on(...ps) && s !== '';
    if (ok) this.counted = true;
    return ok ? s : '';
  }
  add(layer: Layer, part: LPart | LPart[] | null, svg: string): void {
    if (!part) { this.L[layer].push({ svg, part: null, on: true }); return; }
    const ps = Array.isArray(part) ? part : [part], on = this.on(...ps);
    if (!on && ps.every(p => ONLY_LIT.has(p))) return;
    // an animation moves its own molecules: their glyphs, tags and names are left out
    if (this.o.noMol && ps.every(p => ONLY_LIT.has(p))) {
      if (layer === 'node' || ps[0] === 'atp') return;
      if (layer === 'text') svg = svg.replace(/<text class="cel-(mn|cnt)[^"]*"[^>]*>[^<]*(<tspan[^<]*<\/tspan>[^<]*)*<\/text>/g, '');
    }
    if (layer === 'text' && !on) return;
    if (!on && this.o.hide && ps.some(p => this.o.hide!.includes(p))) return;
    const sec = on && !!this.o.sec && ps.filter(p => this.lit.has(p)).every(p => this.o.sec!.includes(p));
    this.L[layer].push({ svg: `<g data-p="${ps[0]}" class="chn-${on ? 'on' : 'off'}${sec ? ' cel-sec' : ''}">${svg}</g>`, part: ps[0], on });
  }
  out(win?: Box): string {
    this.shown.clear(); this.abbr.clear();
    return LAYERS.map(k => this.L[k].map(e => {
      if (win) {
        const b = bbox(e.svg);
        if (b && !(b[0] < win[0] + win[2] && b[0] + b[2] > win[0] && b[1] < win[1] + win[3] && b[1] + b[3] > win[1])) return e.svg;
        const tol = k === 'node' ? 7 : 2, inside = !b || (b[0] >= win[0] - tol && b[1] >= win[1] - tol && b[0] + b[2] <= win[0] + win[2] + tol && b[1] + b[3] <= win[1] + win[3] + tol);
        if (!inside && k === 'text' && (!e.part || this.o.win)) return '';
        if (!inside && k === 'node' && this.o.win) return '';
        for (const m of e.svg.matchAll(/data-s="(\w+)"/g)) this.shown.add(PDB[m[1]]);
        if (e.on && e.part) for (const m of e.svg.matchAll(/<text\b[^>]*\sx="(-?[\d.]+)" y="(-?[\d.]+)"[^>]*>([^<]*)<\/text>/g)) {
          const tx = Number(m[1]), ty = Number(m[2]);
          if (tx < win[0] || tx > win[0] + win[2] || ty < win[1] || ty > win[1] + win[3]) continue;
          for (const [a] of ABBR) if (new RegExp(`(^|[^\\w-])${a.replace('-', '\\-')}([^\\w-]|$)`).test(m[3])) this.abbr.add(a);
        }
      }
      return e.svg;
    }).join('')).join('');
  }
}

/* ---------- glyphs ---------- */

/** CO₂ (O–C–O), O₂ (O–O) atom balls, the deck's colours. */
const ball = (x: number, y: number, el: string, r = R): string => balls(x, y, el, r);
/** Water: an O ball with two small H balls. */
export function h2oG(x: number, y: number, r = R): string {
  return gl(`<circle class="atom atom-H" cx="${f(x - r * 1.05)}" cy="${f(y + r * 0.8)}" r="${f(r * 0.56)}"/><circle class="atom atom-H" cx="${f(x + r * 1.05)}" cy="${f(y + r * 0.8)}" r="${f(r * 0.56)}"/>`) + ball(x, y, 'O', r);
}
/** HCO₃⁻: a C ball with three O balls round it, one carrying a small H ball (a ball group; its label is drawn apart). */
export function hco3G(x: number, y: number, r = R * 0.9): string {
  const d = r * 1.72, o = (a: number): Pt => [x + d * Math.cos((a * Math.PI) / 180), y + d * Math.sin((a * Math.PI) / 180)];
  const [o1, o2, o3] = [o(-90), o(30), o(150)], hP: Pt = [o1[0] + r * 0.95, o1[1] - r * 0.7];
  const at = (p: Pt, a: string): string => `<circle class="atom atom-${a}" cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}"/><text class="cel-att cel-att-${a}" x="${f(p[0])}" y="${f(p[1] + r * 0.42)}" text-anchor="middle">${a}</text>`;
  return gl(`<circle class="atom atom-H" cx="${f(hP[0])}" cy="${f(hP[1])}" r="${f(r * 0.55)}"/>${at(o1, 'O')}${at(o2, 'O')}${at(o3, 'O')}${at([x, y], 'C')}`);
}
/** NH₃: an N ball (carbon-form blue) with three small H balls. */
export function nh3G(x: number, y: number, r = R * 0.9): string {
  const h = (dx: number, dy: number): string => `<circle class="atom atom-H" cx="${f(x + dx * r)}" cy="${f(y + dy * r)}" r="${f(r * 0.55)}"/>`;
  return gl(`${h(-1.2, 0.75)}${h(1.2, 0.75)}${h(0, -1.3)}<circle class="cbb-n" cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>${T(x, y + 4.6, 'N', 'cbb-nt')}`);
}
const tag = (x: number, y: number, s: string, k: 'nadph' | 'atp' | 'plain' | 'pi'): string => gl(tagG(x, y, s, k));
/** A metabolite in carbon form (one ball per carbon, P disc, N ball). */
const carb = (x: number, y: number, formula: string, r = R): string => gl(row(x, y, formula, { r }));
export const carbW = (formula: string, r = R): number => rowWidth(formula.length, r);

/* ---------- proteins ---------- */

const PXU = 0.95 / 2.4;
export type Prot = 'rubisco' | 'pepc' | 'ca' | 'me' | 'ppdk' | 'gdcp' | 'gdch' | 'gox';
const PROT: Record<Prot, { href: string; g: string; w: number; h: number; s?: number }> = {
  rubisco: { href: rubPng, g: rubG, w: 548, h: 471, s: 0.95 / 4 },
  pepc: { href: pepcPng, g: pepcG, w: 356, h: 314 }, ca: { href: caPng, g: caG, w: 318, h: 261 },
  me: { href: mePng, g: meG, w: 361, h: 332 }, ppdk: { href: ppdkPng, g: ppdkG, w: 392, h: 242 },
  gdcp: { href: gdcpPng, g: gdcpG, w: 302, h: 222 }, gdch: { href: gdchPng, g: gdchG, w: 128, h: 111 },
  gox: { href: goxPng, g: goxG, w: 252, h: 252 },
};
/** PDB ids of the renders, for the credit line. */
const PDB: Record<string, string> = { rubisco: '8RUC', pepc: '5VYJ', ca: '1EKJ', me: '5OU5', ppdk: '1VBG', gdcp: '4LHC', gdch: '1HPC', gox: '1GOX' };
/** Size of a protein in figure units. */
export const protSize = (p: Prot, k = K): [number, number] => { const P = PROT[p], s = (P.s ?? PXU) * k; return [P.w * s, P.h * s]; };
/** A protein's image centred on c (lit: colour; dim: the grey copy). */
export function protImg(p: Prot, c: Pt, lit = true, k = K, extra = '', rot = 0): string {
  const P = PROT[p], [w, h] = protSize(p, k);
  const tr = rot ? ` transform="rotate(${rot} ${f(c[0])} ${f(c[1])})"` : '';
  return `<image data-s="${p}" class="cel-p" href="${lit ? P.href : P.g}" x="${f(c[0] - w / 2)}" y="${f(c[1] - h / 2)}" width="${f(w)}" height="${f(h)}"${tr}${extra}/>`;
}
function prot(d: Draw, part: LPart | LPart[], p: Prot, c: Pt, name?: [string, Pt, A?]): void {
  const ps = Array.isArray(part) ? part : [part];
  d.add('body', part, protImg(p, c, d.on(...ps)));
  if (name) d.add('text', part, T(name[1][0], name[1][1], name[0], 'cel-prot cel-halo', name[2] ?? 'middle'));
}

/* ---------- membranes and walls ---------- */

type Seg = { L: [number, number, number, number] } | { A: [number, number, number, number, number, number] };
/** A rounded box as bilayer segments (clockwise from the top left). */
function rr(x: number, y: number, w: number, h: number, r: number): Seg[] {
  return [
    { L: [x + r, y, x + w - r, y] }, { A: [x + w - r, y + r, r, r, -90, 0] }, { L: [x + w, y + r, x + w, y + h - r] },
    { A: [x + w - r, y + h - r, r, r, 0, 90] }, { L: [x + w - r, y + h, x + r, y + h] }, { A: [x + r, y + h - r, r, r, 90, 180] },
    { L: [x, y + h - r, x, y + r] }, { A: [x + r, y + r, r, r, 180, 270] },
  ];
}
const ell = (cx: number, cy: number, rx: number, ry: number): Seg[] => [{ A: [cx, cy, rx, ry, -90, 270] }];
/** Bilayers at leaf scale: half-thickness 5, heads 1.5, spacing 3.9. */
const bil = (segs: Seg[]): string => bilayer(segs, 5, 1.5, 3.9);
const rrPath = (x: number, y: number, w: number, h: number, r: number): string =>
  `M${f(x + r)},${f(y)}H${f(x + w - r)}A${r},${r} 0 0 1 ${f(x + w)},${f(y + r)}V${f(y + h - r)}A${r},${r} 0 0 1 ${f(x + w - r)},${f(y + h)}H${f(x + r)}A${r},${r} 0 0 1 ${f(x)},${f(y + h - r)}V${f(y + r)}A${r},${r} 0 0 1 ${f(x + r)},${f(y)}Z`;

/** The two guard cells round a pore of width `gap` (centre c): each a kidney section with its thick wall on the pore side. */
export function guardCells(c: Pt, gap: number, lit = true): string {
  const [x, y] = c, w = 40, h = 44;
  const cell = (sg: 1 | -1): string => {
    const y0 = y + sg * (gap / 2), y1 = y0 + sg * h, top = Math.min(y0, y1);
    const d = rrPath(x - w / 2, top, w, h, 16);
    // the thickened wall against the pore
    const yp = y0 + sg * 4;
    return `<path class="lf-guard${lit ? '' : ' lf-guard-d'}" d="${d}"/><path class="lf-guardw" d="M${f(x - w / 2 + 6)},${f(yp)}H${f(x + w / 2 - 6)}"/>`
      + `<ellipse class="lf-gcp" cx="${f(x - 8)}" cy="${f(y0 + sg * 24)}" rx="6" ry="4"/><ellipse class="lf-gcp" cx="${f(x + 8)}" cy="${f(y0 + sg * 30)}" rx="6" ry="4"/>`;
  };
  return cell(-1) + cell(1);
}

/* ================================================================ the panorama */

function pano(d: Draw): void {
  const o = d.o, gap = o.gap ?? 12;
  const [m0, m1] = [X.m0, X.m1], [my0, my1] = MY, [by0, by1] = BY;
  // air, boundary layer, air space (behind the cells), the tissue beyond the bundle sheath
  d.add('bg', null, `<defs><linearGradient id="${d.id}-bl" x1="0" x2="1"><stop offset="0" class="lf-bl0"/><stop offset="1" class="lf-bl1"/></linearGradient></defs>
    <rect class="lf-air" x="-20" y="-20" width="${X.bl0 + 20}" height="${LH + 40}"/>
    <rect x="${X.bl0}" y="-20" width="${X.epi0 - X.bl0}" height="${LH + 40}" fill="url(#${d.id}-bl)"/>
    <path class="lf-bledge" d="M${X.bl0},-20V${LH + 20}"/>
    <rect class="lf-as" x="${X.epi1}" y="-20" width="${m1 - X.epi1 + 10}" height="${LH + 40}"/>
    <rect class="lf-tissue" x="${m1}" y="-20" width="${LW - m1 + 20}" height="${LH + 40}"/>`);
  // epidermis: cuticle, epidermal cells above and below the stoma
  const [px, py] = PORE, ex0 = X.epi0 + 2, ew = X.epi1 - X.epi0 - 4, gA = py - gap / 2 - 46, gB = py + gap / 2 + 46;
  const epi: Array<[number, number]> = [[-30, 134], [112, gA - 116], [gB + 4, 140], [gB + 152, LH - gB - 120]];
  d.add('cell', null, `${epi.map(([y, h]) => `<path class="lf-epi" d="${rrPath(ex0, y, ew, h, 12)}"/>`).join('')}
    <path class="lf-cut" d="M${X.epi0},-20V${gA + 4}M${X.epi0},${gB - 4}V${LH + 20}"/>`);
  if (!o.noGuard) d.add('cell', 'stoma', guardCells(PORE, gap, d.on('stoma')));
  // the mesophyll cell and the bundle-sheath cell: cytosol, walls, plasma membranes; plasmodesmata through the shared wall
  d.add('cell', null, `<path class="lf-cyt" d="${rrPath(m0, my0, m1 - m0, my1 - my0, 46)}"/><path class="lf-cyt lf-cyt-bs" d="${rrPath(m1, by0, X.b1 - m1, by1 - by0, 40)}"/>
    <path class="lf-wall" d="${rrPath(m0 + 4.5, my0 + 4.5, m1 - m0 - 9, my1 - my0 - 9, 42)}"/><path class="lf-wall" d="${rrPath(m1 + 4.5, by0 + 4.5, X.b1 - m1 - 9, by1 - by0 - 9, 36)}"/>
    ${PD_Y.filter(y => y > by0 + 40 && y < by1 - 40).map(y => `<path class="lf-pd" d="M${m1 - 12},${y}H${m1 + 12}"/>`).join('')}`);
  d.add('mem', null, `${bil(rr(m0 + 13, my0 + 13, m1 - m0 - 26, my1 - my0 - 26, 34))}${bil(rr(m1 + 13, by0 + 13, X.b1 - m1 - 26, by1 - by0 - 26, 28))}`);
  // the vein: xylem vessels and phloem cells
  const vx = (X.v0 + LW) / 2 + 4;
  d.add('cell', null, `<path class="lf-veinbg" d="${rrPath(X.v0, 70, LW - X.v0 + 30, 520, 30)}"/>
    ${[[vx - 6, 196, 24], [vx + 10, 258, 19], [vx - 4, 318, 22]].map(([x, y, r]) => `<circle class="lf-xyl" cx="${x}" cy="${y}" r="${r}"/>`).join('')}
    ${[[vx - 12, 418], [vx + 12, 424], [vx, 452], [vx - 13, 478], [vx + 13, 484]].map(([x, y]) => `<circle class="lf-phl" cx="${x}" cy="${y}" r="12"/>`).join('')}`);
  // zone names (always; a zoom leaves out those its edge cuts)
  for (const z of [T(12, 26, 'air', 'cel-zone', 'start'), T(X.epi1 + 8, 26, 'air space', 'cel-zone', 'start'), T((m0 + m1) / 2, LH - 14, 'mesophyll cell', 'cel-zone'),
    T((m1 + X.b1) / 2, LH - 14, 'bundle-sheath cell', 'cel-zone'), T(vx, LH - 14, 'vein', 'cel-zone'),
    `<g transform="translate(${(X.bl0 + X.epi0) / 2 + 6} 560) rotate(-90)">${T(0, 0, 'boundary layer', 'cbb-org')}</g>`]) d.add('text', null, z);
  d.add('text', 'stoma', T(px, gA - 10, 'stoma', 'cel-mn cel-halo', 'middle'));

  /* ---- the mesophyll chloroplast: envelope, RuBisCO, PPDK, starch, a granum ---- */
  const [cx0, cy0, cw, ch, cr] = MCP, ccx = cx0 + cw / 2;
  d.add('bg', null, `<path class="lf-stroma" d="${rrPath(cx0, cy0, cw, ch, cr)}"/>`);
  d.add('mem', null, `${bil(rr(cx0, cy0, cw, ch, cr))}${bil(rr(cx0 + 10, cy0 + 10, cw - 20, ch - 20, cr - 10))}`);
  d.add('mem', null, granum(ccx, SPOT.granum[1], 56));
  d.add('text', 'm-cp', T(ccx, cy0 + ch - 18, 'chloroplast', 'cbb-org cel-halo'));
  d.add('body', 'starch', starchG(SPOT.starch[0], SPOT.starch[1], o.starch ?? 1));
  d.add('text', 'starch', T(SPOT.starch[0], SPOT.starch[1] + 6, 'starch', 'cel-mn cel-halo'));
  prot(d, 'm-rub', 'rubisco', SPOT.mRub, ['RuBisCO', [ccx, SPOT.mRub[1] + 56]]);
  prot(d, 'ppdk', 'ppdk', SPOT.ppdk, ['PPDK', [ccx, SPOT.ppdk[1] - 38]]);
  const [ax, ay] = SPOT.atp, [qx, qy] = SPOT.amp;
  d.add('node', 'atp', `${tag(ax, ay, `${d.n('perCO2', 'atp', '1 ')}ATP`, 'atp')}${tag(qx, qy, 'AMP', 'atp')}`);
  d.add('flow', 'atp', `${arrow([[ax + 4, ay - 15], [SPOT.ppdk[0] - 16, SPOT.ppdk[1] + 28]], 'atp', { thin: true })}${arrow([[SPOT.ppdk[0] + 16, SPOT.ppdk[1] + 28], [qx - 4, qy - 15]], 'atp', { thin: true })}`);
  d.add('text', 'atp', d.n('perCO2', 'atp', T(ccx, ay + 34, '2 ATP equivalents', 'cel-cnt cel-halo')));

  /* ---- the cytosol: carbonic anhydrase, PEP carboxylase, peroxisome, mitochondrion; the vacuole ---- */
  prot(d, 'ca', 'ca', SPOT.ca, d.on('cam-n') ? ['CA', [SPOT.ca[0], SPOT.ca[1] + 52]] : ['CA', [SPOT.ca[0] + 42, SPOT.ca[1] + 34], 'start']);
  prot(d, 'pepc', 'pepc', SPOT.pepc, ['PEPC', [SPOT.pepc[0] + 4, SPOT.pepc[1] + 58]]);
  const [prx, pry, prr] = MPER;
  d.add('bg', null, `<circle class="cel-perox" cx="${prx}" cy="${pry}" r="${prr}"/>`);
  d.add('mem', 'm-perox', bil(ell(prx, pry, prr, prr)));
  d.add('body', 'm-perox', protImg('gox', [prx, pry], d.on('m-perox'), K * 0.72));
  d.add('text', 'm-perox', T(prx, pry - prr - 12, 'peroxisome', 'cbb-org cel-halo'));
  const [mx, my, mrx, mry] = MMIT;
  d.add('bg', null, `<ellipse class="cel-matrix" cx="${mx}" cy="${my}" rx="${mrx}" ry="${mry}"/>`);
  d.add('mem', 'm-mito', `${bil(ell(mx, my, mrx, mry))}${bil(ell(mx, my, mrx - 11, mry - 11))}`);
  d.add('body', 'm-mito', protImg('gdcp', [mx, my], d.on('m-mito'), K * 0.95, '', 90));
  d.add('text', 'm-mito', T(mx, my + mry + 30, 'mitochondrion', 'cbb-org cel-halo'));
  const [vx0, vy0, vw, vh, vr] = VAC;
  d.add('bg', null, `<path class="lf-vac" d="${rrPath(vx0, vy0, vw, vh, vr)}"/>`);
  d.add('mem', 'vac', bil(rr(vx0, vy0, vw, vh, vr)));
  d.add('text', 'vac', T(vx0 + vw / 2, (o.acid ?? 0) > 1 ? vy0 + 23 : vy0 + vh / 2, 'vacuole', 'cbb-org cel-halo'));

  /* ---- the bundle-sheath cell: chloroplast (NADP-ME, RuBisCO), mitochondrion (glycine decarboxylase) on the vein side ---- */
  const [bx, byc, brx, bry] = BCP;
  d.add('bg', null, `<ellipse class="lf-stroma" cx="${bx}" cy="${byc}" rx="${brx}" ry="${bry}"/>`);
  d.add('mem', null, `${bil(ell(bx, byc, brx, bry))}${bil(ell(bx, byc, brx - 10, bry - 10))}`);
  d.add('text', 'bs-cp', T(bx, byc - bry + 26, 'chloroplast', 'cbb-org cel-halo'));
  prot(d, 'bs-rub', 'rubisco', SPOT.bsRub, ['RuBisCO', [bx, SPOT.bsRub[1] + 56]]);
  prot(d, 'me', 'me', SPOT.me, ['NADP-ME', [bx, SPOT.me[1] + 62]]);
  const [bmx, bmy, bmrx, bmry] = BMIT;
  d.add('bg', null, `<ellipse class="cel-matrix" cx="${bmx}" cy="${bmy}" rx="${bmrx}" ry="${bmry}"/>`);
  d.add('mem', 'bs-mito', `${bil(ell(bmx, bmy, bmrx, bmry))}${bil(ell(bmx, bmy, bmrx - 11, bmry - 11))}`);
  d.add('body', 'bs-mito', `${protImg('gdcp', SPOT.gdcP, d.on('bs-mito'), K, '', 90)}${protImg('gdch', SPOT.gdcH, d.on('bs-mito'))}`);
  d.add('text', 'bs-mito', `${T(bmx, bmy + bmry + 18, 'mitochondrion', 'cbb-org cel-halo')}${T(bmx, bmy - bmry - 30, 'glycine', 'cel-prot cel-halo')}${T(bmx, bmy - bmry - 12, 'decarboxylase', 'cel-prot cel-halo')}`);

  c10(d); c3(d); c2(d); c4(d); cam(d);
}

/** A granum: three stacked thylakoid discs (bilayers at a finer scale). */
function granum(x: number, y: number, w: number): string {
  return [0, 1, 2].map(k => {
    const yy = y - 11 + k * 11, x0 = x - w / 2, x1 = x + w / 2;
    const segs: Seg[] = [{ L: [x0, yy - 2.8, x1, yy - 2.8] }, { A: [x1, yy, 2.8, 2.8, -90, 90] }, { L: [x1, yy + 2.8, x0, yy + 2.8] }, { A: [x0, yy, 2.8, 2.8, 90, 270] }];
    return `<path class="cel-lumen" d="M${x0},${yy - 2.8}H${x1}V${yy + 2.8}H${x0}Z"/>${bilayer(segs, 3.2, 0.9, 2.6)}`;
  }).join('');
}
/** A starch granule (growth rings), scaled by k. */
export function starchG(x: number, y: number, k = 1): string {
  const rx = 40 * (0.45 + 0.55 * k), ry = 22 * (0.45 + 0.55 * k);
  return `<ellipse class="cel-starch" cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"/>${[0.7, 0.42].map(q => `<ellipse class="cel-starchr" cx="${f(x)}" cy="${f(y)}" rx="${f(rx * q)}" ry="${f(ry * q)}"/>`).join('')}`;
}

/* ---------- C10: CO₂ from the air to RuBisCO, water out, the conductances ---------- */
/** Waypoints of the CO₂ path (C10, C11): air → boundary layer → pore → air space → wall → chloroplast → RuBisCO. */
export const CO2_PATH: Pt[] = [[28, 340], [78, 340], [PORE[0], 340], [180, 340], [X.m0, 340], [MCP[0] + 6, 340], [SPOT.mRub[0] - 46, 340]];
/** The water path: from the wet cell walls out through the pore (below the CO₂ path). */
export const H2O_PATH: Pt[] = [[X.m0 - 6, 348], [PORE[0], 348], [56, 348], [44, 360]];
const sym = (s: string): string => `<tspan font-style="italic">${s[0]}</tspan><tspan class="cbb-sub" dy="4">${s.slice(1)}</tspan>`;
function c10(d: Draw): void {
  const r = SPOT.mRub, y = 334, yw = 348;
  if (!d.o.noMol) d.add('node', 'co2-path', ball(28, 306, 'OCO'));
  d.add('text', 'co2-path', T(28, 284, 'CO₂', 'cel-mn cel-halo'));
  d.add('flow', 'co2-path', arrow([[26, y - 8], [52, y], ...CO2_PATH.slice(1, 6).map(([x]) => [x, y] as Pt), [r[0] - 44, y]], 'gas', { halo: true }));
  d.add('flow', 'h2o', arrow(H2O_PATH, 'gas', { thin: true }));
  if (!d.o.noMol) d.add('node', 'h2o', h2oG(28, 376));
  d.add('text', 'h2o', T(28, 408, 'H₂O', 'cel-mn cel-halo'));
  // concentrations above the path (ppm), conductances below it
  const v = (x: number, s: string, val: string): string => T(x, 236, `${sym(s)}${d.n('ppm', 'co2-path', `<tspan class="lf-val"> ${val}</tspan>`)}`, 'lf-sym cel-halo');
  d.add('text', 'co2-path', `${v(40, 'Ca', '≈ 430')}${v(184, 'Ci', '≈ 300')}${v(r[0], 'Cc', '≈ 200')}`);
  const g = (x: number, yy: number, s: string): string => T(x, yy, sym(s), 'lf-g cel-halo');
  d.add('text', 'gb', g((X.bl0 + X.epi0) / 2, 432, 'gb'));
  d.add('text', 'gs', g(PORE[0], 432, 'gs'));
  d.add('text', 'gm', g((X.m0 + r[0] - 40) / 2, 448, 'gm'));
  d.add('flow', 'gm', `<path class="lf-span" d="M${X.m0},424H${r[0] - 40}M${X.m0},418V430M${r[0] - 40},418V430"/>`);
}

/* ---------- C11 · C₃: CO₂ in, oxygenation, photorespiration in the mesophyll cell, refixation ---------- */
/** Waypoints of the C₃ photorespiratory route and of the photorespired CO₂ (C11 and lf11). */
export const C3 = (() => {
  const r = SPOT.mRub, [prx, pry, prr] = MPER, [mx, my, mrx] = MMIT, ce = MCP[0] + MCP[2], p = (x: number, y: number): Pt => [x, y];
  return {
    co2In: [p(206, 340), p(X.m0, 340), p(MCP[0] + 6, 340), p(r[0] - 44, 340)] as Pt[],
    o2: [p(r[0] - 30, 258), p(r[0] - 8, r[1] - 34)] as Pt[],
    glycolate: [p(r[0] + 38, r[1] - 22), p(ce + 8, 276), p(prx - 60, 262), p(prx - prr - 2, pry - 2)] as Pt[],
    glycine: [p(prx - 14, pry + prr - 4), p(mx + mrx - 4, my - 26)] as Pt[],
    refix: [p(mx - mrx + 4, my - 4), p(ce - 6, my - 6), p(r[0] + 40, r[1] + 10)] as Pt[],
    lost: [p(mx - mrx + 8, my + 28), p(ce - 6, 408), p(r[0], 414), p(MCP[0] + 10, 412), p(X.m0 - 4, 412), p(178, 414)] as Pt[],
  };
})();
function c3(d: Draw): void {
  const r = SPOT.mRub, [prx, pry, prr] = MPER, [mx, my, , mry] = MMIT;
  if (!d.o.noMol) d.add('node', 'co2-in', ball(180, 340, 'OCO'));
  d.add('text', 'co2-in', T(180, 318, 'CO₂', 'cel-mn cel-halo'));
  d.add('flow', 'co2-in', arrow(C3.co2In, 'gas', { thin: true }));
  if (!d.o.noMol) d.add('node', 'o2', ball(C3.o2[0][0] - 14, C3.o2[0][1] - 12, 'OO'));
  d.add('text', 'o2', T(C3.o2[0][0] - 46, C3.o2[0][1] - 6, 'O₂', 'cel-mn cel-halo', 'end'));
  d.add('flow', 'o2', arrow(C3.o2, 'gas', { thin: true }));
  // photorespiration: glycolate out of the chloroplast → peroxisome → glycine → mitochondrion
  d.add('flow', 'pr-m', arrow(C3.glycolate, 'pr', { halo: true }));
  d.add('text', 'pr-m', T(C3.glycolate[2][0] - 34, 294, 'glycolate', 'cel-mn cel-halo'));
  d.add('flow', 'pr-gly', arrow(C3.glycine, 'pr', { thin: true }));
  d.add('text', 'pr-gly', T(prx - 28, pry + prr + 30, 'glycine', 'cel-mn cel-halo'));
  // the photorespired CO₂: part refixed by the chloroplast in front of the mitochondrion, the rest out to the air space
  d.add('flow', 'refix', arrow(C3.refix, 'gas', { halo: true }));
  if (!d.o.noMol) d.add('node', 'refix', ball(mx + 72, my + 26, 'OCO', R * 0.9));
  d.add('text', 'refix', T(mx + 72, my + 52, 'CO₂', 'cel-mn cel-halo'));
  d.add('text', 'refix', T(MCP[0] + MCP[2] - 6, my - 22, 'refixed', 'cbb-proc cbb-halo'));
  d.add('flow', 'escape', arrow(C3.lost, 'gas', { thin: true, halo: true }));
  d.add('text', 'escape', T(186, 450, 'out', 'cbb-proc cbb-halo'));
}

/* ---------- C11a · C₂: the glycine shuttle ---------- */
export const C2 = (() => {
  const [prx, pry, prr] = MPER, [bmx, bmy, bmrx, bmry] = BMIT, br = SPOT.bsRub, p = (x: number, y: number): Pt => [x, y];
  return {
    gly: [p(prx + 18, pry - prr + 6), p(574, 222), p(X.m1, 196), p(640, 140), p(712, 112), p(790, 148), p(bmx - 6, bmy - bmry + 2)] as Pt[],
    ser: [p(bmx - 18, bmy + bmry - 6), p(796, 486), p(712, 512), p(640, 492), p(X.m1 + 4, 400), p(572, 372), p(prx + 16, pry + prr - 2)] as Pt[],
    co2: [p(bmx - bmrx + 4, 380), p(br[0] + 46, br[1] - 4)] as Pt[],
    glyAt: p(712, 112), serAt: p(712, 512),
  };
})();
function c2(d: Draw): void {
  const [bmx, bmy, , bmry] = BMIT, br = SPOT.bsRub, u = 'loop' as Unit;
  d.add('flow', 'gly', arrow(C2.gly, 'pr', { halo: true }));
  if (!d.o.noMol) d.add('node', 'gly', carb(C2.glyAt[0], C2.glyAt[1], 'CCN'));
  d.add('text', 'gly', T(C2.glyAt[0] - 44, C2.glyAt[1] + 6, `${d.n(u, 'gly', '2 ')}glycine`, 'cel-mn cel-halo', 'end'));
  d.add('flow', 'ser', arrow(C2.ser, 'pr', { halo: true }));
  if (!d.o.noMol) d.add('node', 'ser', carb(C2.serAt[0], C2.serAt[1], 'CCCN'));
  d.add('text', 'ser', T(C2.serAt[0] - 56, C2.serAt[1] + 6, `${d.n(u, 'ser', '1 ')}serine`, 'cel-mn cel-halo', 'end'));
  d.add('flow', 'bs-co2', arrow(C2.co2, 'gas', { thin: true }));
  if (!d.o.noMol) d.add('node', 'bs-co2', ball(br[0] + 54, br[1] - 50, 'OCO', R * 0.9));
  d.add('text', 'bs-co2', T(br[0] + 54, br[1] - 70, `${d.n(u, 'bs-co2', '1 ')}CO₂`, 'cel-mn cel-halo'));
  if (d.on('gly')) {
    if (!d.o.noMol) d.add('node', 'gly', nh3G(bmx + 6, bmy + bmry + 40));
    d.add('text', 'gly', T(bmx + 26, bmy + bmry + 46, `${d.n(u, 'gly', '1 ')}NH₃`, 'cel-mn cel-halo', 'start'));
  }
}

/* ---------- C12 · C₄: the CO₂ pump ---------- */
/** Waypoints of the C₄ cycle (C12, C13 and the animations). */
export const C4 = (() => {
  const s = SPOT, p = (x: number, y: number): Pt => [x, y], ce = MCP[0] + MCP[2];
  return {
    co2In: [p(PORE[0] + 26, 334), p(190, 292), p(204, 200), p(214, 120), p(X.m0 + 22, 62), p(330, 66), p(s.ca[0] - 44, s.ca[1] - 4)] as Pt[],
    hco3: [p(s.ca[0] + 40, s.ca[1] - 14), p(s.hco3[0] - 28, s.hco3[1] + 2)] as Pt[],
    hco3b: [p(s.hco3[0] + 2, s.hco3[1] + 28), p(s.pepc[0] + 8, s.pepc[1] - 40)] as Pt[],
    pep: [p(s.ppdk[0] + 46, s.ppdk[1] - 8), p(ce + 6, 182), p(s.pepc[0] - 46, s.pepc[1] + 2)] as Pt[],
    acid: [p(s.pepc[0] + 40, s.pepc[1] - 30), p(X.m1 - 10, 120), p(X.m1 + 30, 108), p(s.c4acid[0] - 40, s.c4acid[1]), p(s.c4acid[0] + 50, s.c4acid[1] + 6), p(s.me[0] + 16, s.me[1] - 44)] as Pt[],
    meCo2: [p(s.me[0], s.me[1] + 40), p(s.bsRub[0], s.bsRub[1] - 38)] as Pt[],
    pyr: [p(s.me[0] - 46, s.me[1] + 14), p(BCP[0] - BCP[2] + 4, 300), p(X.m1 + 4, 300), p(560, 302), p(s.pyr[0] - 50, s.pyr[1] - 4), p(ce + 8, 236), p(s.ppdk[0] + 40, s.ppdk[1] + 16)] as Pt[],
  };
})();
function c4(d: Draw): void {
  const s = SPOT, u = 'perCO2' as Unit;
  d.add('flow', 'c4-co2', arrow(C4.co2In, 'gas', { halo: true }));
  if (!d.o.noMol) d.add('node', 'c4-co2', ball(s.co2c4[0], s.co2c4[1], 'OCO'));
  d.add('text', 'c4-co2', T(s.co2c4[0], s.co2c4[1] - 22, `${d.n(u, 'c4-co2', '1 ')}CO₂`, 'cel-mn cel-halo'));
  d.add('flow', 'hco3', `${arrow(C4.hco3, 'c', { thin: true })}${arrow(C4.hco3b, 'c', { thin: true })}`);
  if (!d.o.noMol) d.add('node', 'hco3', hco3G(s.hco3[0], s.hco3[1]));
  d.add('text', 'hco3', T(s.hco3[0] + 30, s.hco3[1] + 6, `${d.n(u, 'hco3', '1 ')}HCO₃⁻`, 'cel-mn cel-halo', 'start'));
  d.add('flow', 'pep', arrow(C4.pep, 'c', { halo: true }));
  if (!d.o.noMol) d.add('node', 'pep', carb(s.pep[0], s.pep[1], 'CCCP'));
  d.add('text', 'pep', T(s.pep[0], s.pep[1] - 21, `${d.n(u, 'pep', '1 ')}PEP`, 'cel-mn cel-halo'));
  d.add('flow', 'c4acid', arrow(C4.acid, 'c', { halo: true }));
  if (!d.o.noMol) d.add('node', 'c4acid', carb(s.c4acid[0], s.c4acid[1], 'CCCC'));
  d.add('text', 'c4acid', T(s.c4acid[0], s.c4acid[1] - 20, `${d.n(u, 'c4acid', '1 ')}C₄ acid`, 'cel-mn cel-halo'));
  d.add('flow', 'me-co2', arrow(C4.meCo2, 'gas', { thin: true }));
  if (!d.o.noMol) d.add('node', 'me-co2', ball(s.me[0] + 42, (s.me[1] + s.bsRub[1]) / 2 + 22, 'OCO', R * 0.9));
  d.add('text', 'me-co2', T(s.me[0] + 42, (s.me[1] + s.bsRub[1]) / 2 + 48, `${d.n(u, 'me-co2', '1 ')}CO₂`, 'cel-mn cel-halo'));
  d.add('flow', 'pyr', arrow(C4.pyr, 'c', { halo: true }));
  if (!d.o.noMol) d.add('node', 'pyr', carb(s.pyr[0], s.pyr[1], 'CCC'));
  d.add('text', 'pyr', T(s.pyr[0], s.pyr[1] + 30, `${d.n(u, 'pyr', '1 ')}pyruvate`, 'cel-mn cel-halo'));
}

/* ---------- C13 · CAM: night uptake into the vacuole, day release behind closed stomata ---------- */
export const CAM = (() => {
  const s = SPOT, p = (x: number, y: number): Pt => [x, y], ce = MCP[0] + MCP[2];
  return {
    acidIn: [p(s.pepc[0] + 24, s.pepc[1] + 40), p(560, 300), p(548, 400), p(s.vac[0] + 22, VAC[1] + 44)] as Pt[],
    pepFromStarch: [p(s.starch[0] + 44, s.starch[1] - 10), p(ce + 6, 420), p(448, 300), p(s.pepc[0] - 34, s.pepc[1] + 34)] as Pt[],
    acidOut: [p(s.vac[0] + 24, VAC[1] + 30), p(s.camMe[0] + 18, s.camMe[1] + 40)] as Pt[],
    meCo2: [p(s.camMe[0] - 44, s.camMe[1] - 14), p(ce + 4, 334), p(s.mRub[0] + 46, s.mRub[1])] as Pt[],
    pyrToStarch: [p(s.camMe[0] - 30, s.camMe[1] + 34), p(452, 392), p(ce + 4, 432), p(s.starch[0] + 46, s.starch[1] - 2)] as Pt[],
  };
})();
/** Malic acid molecules in the vacuole: the place of molecule i (0–3), stacked from the bottom. */
export const ACID_AT = (i: number): Pt => [SPOT.vac[0], VAC[1] + VAC[3] - 24 - 22 * i];
function cam(d: Draw): void {
  const s = SPOT, u = 'perCO2' as Unit, ce = MCP[0] + MCP[2];
  // night: CO₂ in through the open stoma to carbonic anhydrase; HCO₃⁻ → PEPC; the C₄ acid into the vacuole; PEP from starch
  d.add('flow', 'cam-n', `${arrow(C4.co2In, 'gas', { halo: true })}${arrow(C4.hco3, 'c', { thin: true })}${arrow(C4.hco3b, 'c', { thin: true })}${arrow(CAM.acidIn, 'c', { halo: true })}`);
  if (!d.o.noMol) { d.add('node', 'cam-n', ball(s.co2c4[0], s.co2c4[1], 'OCO')); d.add('node', 'cam-n', hco3G(s.hco3[0], s.hco3[1])); }
  d.add('text', 'cam-n', T(s.co2c4[0], s.co2c4[1] - 22, `${d.n(u, 'cam-n', '1 ')}CO₂`, 'cel-mn cel-halo'));
  d.add('text', 'cam-n', T(s.hco3[0] + 4, s.hco3[1] + 48, `${d.n(u, 'cam-n', '1 ')}HCO₃⁻`, 'cel-mn cel-halo'));
  d.add('flow', 'pep-starch', arrow(CAM.pepFromStarch, 'c', { halo: true }));
  if (!d.o.noMol) d.add('node', 'pep-starch', carb(458, 252, 'CCCP'));
  d.add('text', 'pep-starch', T(458, 282, `${d.n(u, 'pep-starch', '1 ')}PEP`, 'cel-mn cel-halo'));
  // the malic acid in the vacuole
  const nA = d.o.acid ?? 0;
  if (nA) d.add('node', 'cam-acid', Array.from({ length: nA }, (_, i) => carb(ACID_AT(i)[0], ACID_AT(i)[1], 'CCCC')).join(''));
  if (nA) d.add('text', 'cam-acid', T(s.vac[0], ACID_AT(nA - 1)[1] - 21, 'malic acid', 'cel-mn cel-halo'));
  // day: malic acid out → malic enzyme → CO₂ → RuBisCO; pyruvate → starch
  prot(d, 'cam-me', 'me', s.camMe, ['malic enzyme', [s.camMe[0] + 10, s.camMe[1] - 46]]);
  d.add('flow', 'cam-d', `${arrow(CAM.acidOut, 'c', { thin: true })}${arrow(CAM.meCo2, 'gas', { halo: true })}${arrow(CAM.pyrToStarch, 'c', { thin: true, halo: true })}`);
  if (!d.o.noMol) { d.add('node', 'cam-d', ball(ce + 24, 334, 'OCO', R * 0.9)); d.add('node', 'cam-d', carb(440, 400, 'CCC')); }
  d.add('text', 'cam-d', `${T(ce + 24, 364, `${d.n(u, 'cam-d', '1 ')}CO₂`, 'cel-mn cel-halo')}${T(436, 430, `${d.n(u, 'cam-d', '1 ')}pyruvate`, 'cel-mn cel-halo')}`);
}

/* ================================================================ the figures */

/** The abbreviation key as lines of at most maxW units. */
function abbrLines(found: Iterable<string>, maxW = 772): string[][] {
  const have = new Set(found), items = ABBR.filter(([a]) => have.has(a)), lines: string[][] = [];
  let cur: string[] = [], len = 0;
  for (const [a, full] of items) {
    const w = (a.length + full.length + 2) * 7.3 + (cur.length ? 20 : 0);
    if (cur.length && len + w > maxW) { lines.push(cur); cur = []; len = 0; }
    cur.push(`<tspan class="cel-abk">${a}</tspan>: ${full}`); len += w;
  }
  if (cur.length) lines.push(cur);
  return lines;
}
const abbrSvg = (lines: string[][], x: number, y: number): string =>
  lines.map((ln, i) => `<text class="lf-abbr" x="${x}" y="${y - 20 * (lines.length - 1 - i)}" text-anchor="start">${ln.join(' · ')}</text>`).join('');
/** The rows under a figure: credit (left) and unit (right), the abbreviation key. */
function keyRows(d: Draw, band: number, ids: string[]): string {
  const ab = abbrLines(d.abbr), cr = ids.length ? `structure${ids.length > 1 ? 's' : ''}: PDB ${ids.join(', ')}` : '';
  return `<rect class="cel-band" x="0" y="${band}" width="800" height="${600 - band}"/>${cr ? T(14, 594, cr, 'lf-cr', 'start') : ''}
    ${d.counted ? T(790, 594, UNIT_SAY[d.o.unit ?? 'none'], 'lf-unit', 'end') : ''}${abbrSvg(ab, 14, 574)}`;
}
const bandTop = (d: Draw): number => Math.min(560, 594 - 20 * abbrLines(d.abbr).length - 24);

const SAY = 'A section through a leaf, left to right: the outside air and the boundary layer, the epidermis with a stoma between two guard cells, the air space, a mesophyll cell (cell wall, plasma membrane, a chloroplast against the wall facing the air space, cytosol with a peroxisome and a mitochondrion, the vacuole), a bundle-sheath cell (chloroplast, mitochondrion) and the vein';

/** The leaf section, a window of it in the 800 × 600 figure; below it the abbreviation key, the unit and the credit. */
export function leafSvg(id: string, lit: Iterable<LPart>, o: LeafOpts = {}): string {
  const on = new Set<LPart>([...lit, ...(o.sec ?? [])]);
  const d = new Draw(id, on, o);
  pano(d);
  if (o.bare) return d.out();
  const [x, y, w] = o.win ?? [0, 0, LW], s = 800 / w;
  d.out([x, y, w, 556 / s]);
  const band = bandTop(d), ab = new Set(d.abbr);
  const body = d.out([x, y, w, band / s]);
  d.abbr = ab;
  const ids = [...d.shown].filter(Boolean).sort();
  return `<svg class="fig-svg cel lf" viewBox="0 0 800 600" role="img" aria-label="${SAY}. Highlighted and named: ${[...on].join(', ')}; the rest dimmed."><defs><clipPath id="${id}-win"><rect x="0" y="0" width="800" height="${band}"/></clipPath></defs>
    <g clip-path="url(#${id}-win)"><g transform="scale(${f(s)}) translate(${f(-x)} ${f(-y)})">${body}</g></g>${keyRows(d, band, ids)}</svg>`;
}

/** C13: the mesophyll cell by night and by day, two panels of the same window: stomata open and closed, the vacuole
 *  filling with malic acid and emptying. zoom: the cell's inside only. */
export function camSvg(id: string, zoom = false): string {
  const win: [number, number, number, number] = zoom ? [214, 52, 388, 520] : [90, 14, 510, 600];
  const pw = 388, s = pw / win[2], ph = win[3] * s, top = zoom ? 38 : 54, hy = top - 18;
  const panel = (k: 'n' | 'd', x0: number): string => {
    const night = k === 'n';
    const d = new Draw(`${id}${k}`, new Set(night ? LIT_C13N : LIT_C13D), { unit: 'perCO2', win: [win[0], win[1], win[2]], gap: night ? 12 : 0, acid: 1, starch: night ? 0.35 : 1, hide: ['m-perox', 'm-mito', 'ppdk', 'me', 'bs-rub', 'bs-mito'] });
    pano(d);
    const body = d.out([win[0], win[1], win[2], win[3]]);
    for (const m of body.matchAll(/data-s="(\w+)"/g)) ids.add(PDB[m[1]]);
    counted ||= d.counted;
    return `<clipPath id="${id}${k}-c"><rect x="${x0}" y="${top}" width="${pw}" height="${f(ph)}" rx="14"/></clipPath>
      <g clip-path="url(#${id}${k}-c)"><g transform="translate(${x0} ${top}) scale(${f(s)}) translate(${-win[0]} ${-win[1]})">${body}</g>${night ? `<rect class="lf-night" x="${x0}" y="${top}" width="${pw}" height="${f(ph)}"/>` : ''}</g>
      <rect class="lf-panel" x="${x0}" y="${top}" width="${pw}" height="${f(ph)}" rx="14"/>
      ${night ? moonG(x0 + 28, hy - 8) : sunG(x0 + 28, hy - 8)}${T(x0 + 52, hy, night ? 'night · stomata open' : 'day · stomata closed', 'lf-ph', 'start')}`;
  };
  const ids = new Set<string>(); let counted = false;
  const body = panel('n', 8) + panel('d', 404);
  const cr = [...ids].filter(Boolean).sort();
  return `<svg class="fig-svg cel lf lf-cam" viewBox="0 0 800 600" role="img" aria-label="The same mesophyll cell of a CAM plant by night and by day. Night: the stoma is open; CO2 enters, carbonic anhydrase makes HCO3-, PEP carboxylase fixes it with PEP from starch, and the C4 acid is stored as malic acid in the vacuole. Day: the stoma is closed; malic acid leaves the vacuole, malic enzyme releases CO2 to RuBisCO in the chloroplast, and pyruvate goes to starch.">
    ${body}<rect class="cel-band" x="0" y="560" width="800" height="40"/>${cr.length ? T(14, 594, `structures: PDB ${cr.join(', ')}`, 'lf-cr', 'start') : ''}${counted ? T(790, 594, UNIT_SAY.perCO2, 'lf-unit', 'end') : ''}
    ${abbrSvg(abbrLines(['PEPC', 'PEP', 'CA']), 14, 576)}</svg>`;
}
const sunG = (x: number, y: number): string => `<g class="lf-sun"><circle cx="${x}" cy="${y}" r="9"/>${Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `<path d="M${f(x + 13 * Math.cos(a))},${f(y + 13 * Math.sin(a))}L${f(x + 18 * Math.cos(a))},${f(y + 18 * Math.sin(a))}"/>`; }).join('')}</g>`;
const moonG = (x: number, y: number): string => `<path class="lf-moon" d="M${x + 4},${y - 13}A13,13 0 1 0 ${x + 9},${y + 9}A10,10 0 1 1 ${x + 4},${y - 13}Z"/>`;

/* ---------- the conditions strip: temperate · warm · tropical · arid ---------- */
export type Clim = 'c3' | 'c2' | 'c4' | 'cam';
const CLIM: Record<Clim, { head: string; say: string[]; mech: string; crops: string[]; stoma: 'open' | 'open-n' | 'closed-d' }> = {
  c3: { head: 'temperate', say: ['cool, moist'], mech: 'C₃', crops: ['wheat', 'potato'], stoma: 'open' },
  c2: { head: 'warm', say: [''], mech: 'C₂', crops: ['wild rocket'], stoma: 'open' },
  c4: { head: 'tropical', say: ['hot, bright'], mech: 'C₄', crops: ['maize', 'sugarcane'], stoma: 'open' },
  cam: { head: 'arid', say: ['hot, dry'], mech: 'CAM', crops: ['pineapple', 'agave'], stoma: 'closed-d' },
};
/** The four climates as columns, the slide's lit (lit 'all' on C10: the trend row lit, every column at full weight). */
export function climateSvg(id: string, lit: Clim | 'trend'): string {
  const ks: Clim[] = ['c3', 'c2', 'c4', 'cam'], cw = 190, x0 = 20;
  const col = (k: Clim, i: number): string => {
    const c = CLIM[k], on = lit === 'trend' || lit === k, x = x0 + i * cw, cx = x + cw / 2 - 5;
    const stoma = c.stoma === 'closed-d'
      ? `${miniStoma(cx - 34, 300, 0)}${T(cx - 34, 344, 'day', 'lf-cs')}${miniStoma(cx + 34, 300, 10)}${T(cx + 34, 344, 'night', 'lf-cs')}`
      : `${miniStoma(cx, 300, k === 'c4' ? 6 : 10)}${T(cx, 344, 'day', 'lf-cs')}`;
    const temp = [0.25, 0.5, 0.85, 0.9][i], dry = [0.1, 0.3, 0.45, 0.95][i];
    return `<g class="chn-${on ? 'on' : 'off'}" data-p="${k}">
      <rect class="lf-ccol${on && lit !== 'trend' ? ' lf-ccol-on' : ''}" x="${x}" y="40" width="${cw - 10}" height="452" rx="16"/>
      ${T(cx, 78, c.head, 'lf-ch')}${T(cx, 102, c.say[0], 'lf-cs')}
      ${thermo(cx - 40, 140, temp)}${sunIcon(cx + 8, 164, 0.6 + 0.5 * temp)}${drops(cx + 52, 150, 1 - dry)}
      ${stoma}
      ${T(cx, 412, c.mech, 'lf-cm')}
      ${c.crops.map((s, j) => T(cx, 446 + 22 * j, s, 'lf-ccrop')).join('')}</g>`;
  };
  const trendOn = lit === 'trend';
  return `<svg class="fig-svg cel lf lf-clim" viewBox="0 0 800 600" role="img" aria-label="Four climates and the photosynthesis type that dominates there: temperate, cool and moist: C3, for example wheat and potato; warm: C2, for example wild rocket; tropical, hot and bright: C4, for example maize and sugarcane; arid, hot and dry: CAM, for example pineapple and agave, with its stomata closed by day and open at night.">
    ${ks.map(col).join('')}
    <g class="chn-${trendOn ? 'on' : 'off'}">${arrow([[40, 530], [760, 530]], 'pr')}
    ${T(400, 566, 'hotter, drier: stomata close by day; in C₃ leaves, photorespiration rises', trendOn ? 'lf-trend' : 'lf-trend lf-trend-d')}</g>
</svg>`;
}
function miniStoma(x: number, y: number, gap: number): string {
  // seen from above: two guard cells round the pore
  const w = 20, h = 34;
  return `<ellipse class="lf-guard" cx="${f(x - gap / 2 - w / 2)}" cy="${y}" rx="${w / 2}" ry="${h / 2}"/><ellipse class="lf-guard" cx="${f(x + gap / 2 + w / 2)}" cy="${y}" rx="${w / 2}" ry="${h / 2}"/>${gap > 0 ? `<ellipse class="lf-porex" cx="${x}" cy="${y}" rx="${f(gap / 2)}" ry="${f(h / 2 - 5)}"/>` : ''}`;
}
function thermo(x: number, y: number, k: number): string {
  const h = 52, fh = h * k;
  return `<rect class="lf-th" x="${x - 6}" y="${y - 6}" width="12" height="${h + 6}" rx="6"/><circle class="lf-th" cx="${x}" cy="${y + h + 6}" r="10"/>
    <rect class="lf-thf" x="${x - 3}" y="${f(y + h - fh)}" width="6" height="${f(fh + 4)}"/><circle class="lf-thf" cx="${x}" cy="${y + h + 6}" r="7"/>`;
}
const sunIcon = (x: number, y: number, k: number): string => `<g class="lf-sun"><circle cx="${x}" cy="${y}" r="${f(10 * k + 4)}"/>${Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4, r0 = 10 * k + 8, r1 = r0 + 6 * k + 2; return `<path d="M${f(x + r0 * Math.cos(a))},${f(y + r0 * Math.sin(a))}L${f(x + r1 * Math.cos(a))},${f(y + r1 * Math.sin(a))}"/>`; }).join('')}</g>`;
function drops(x: number, y: number, k: number): string {
  const n = Math.max(0, Math.round(k * 3));
  return Array.from({ length: 3 }, (_, i) => `<path class="lf-drop${i < n ? '' : ' lf-drop-d'}" d="M${x},${y + i * 22 - 9}C${x + 7},${y + i * 22 - 1} ${x + 6},${y + i * 22 + 7} ${x},${y + i * 22 + 7}C${x - 6},${y + i * 22 + 7} ${x - 7},${y + i * 22 - 1} ${x},${y + i * 22 - 9}Z"/>`).join('');
}
