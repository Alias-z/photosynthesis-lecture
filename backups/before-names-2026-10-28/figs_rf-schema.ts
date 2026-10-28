// RuBisCO's two reactions → photorespiration → FvCB (lecture 2, chunk rf, slides C5–C8): ONE schema, used like the
// light-reaction chain of slides 7–10b. Each slide lights the part it teaches and dims the rest; the animations zoom into
// that part and back out.
//
// Base: the lecturer's MSc thesis Fig. 2b (Zhang 2021, University of Copenhagen), a redraw of von Caemmerer 2000 Fig. 2.1:
// CO₂ and O₂ as atom balls; RuBisCO with RuBP; carboxylation and oxygenation; PGA reduction with ATP and NADPH from the
// light reactions; 5 of 6 triose phosphates regenerate RuBP, 1 of 6 is exported with Pᵢ exchange; the FvCB limits
// Ac ~ Vcmax, Aj ~ J, Ap ~ TPU (drawn only when lit). Added here: the light reactions (a thylakoid granum with light)
// supplying ATP and NADPH, and the photorespiratory loop across peroxisome and mitochondrion: 2-phosphoglycolate →
// glycolate → peroxisome → glycine → mitochondrion (2 glycine → serine + CO₂ + NH₃) → serine → peroxisome → glycerate →
// chloroplast → PGA (glycerate kinase: ATP); NH₃ is refixed in the chloroplast with ATP and reduced ferredoxin
// (Peterhänsel et al. 2010, §2.1–2.2). Only the names a bachelor student needs; no enzymes except RuBisCO.
//
// Markup contract (the rf animations zoom on it; keep it stable): every drawn piece of a part sits in
//   <g data-p="<part>" class="on|off"> … </g>
// A part may have several such wrappers, one per drawing layer (fills, arrows, nodes, labels): select them all with
// [data-p="<part>"]. Optional parts (the three FvCB limits) also carry data-opt and are hidden while off.
// The root <svg> carries class "rfs rfs-<look>" and data-look.
import './rf-schema.css';
import rubiscoPng from '../../assets/rf/rubisco-8ruc.png';
import peroxJpg from '../../assets/rf/fn6-perox.jpg';
import mitoJpg from '../../assets/rf/fn6-mito.jpg';
import granumJpg from '../../assets/rf/fn6-granum.jpg';
import psiiPng from '../../assets/chain/psii.webp';
import b6fPng from '../../assets/chain/b6f.webp';
import psiPng from '../../assets/chain/psi.webp';
import atpsPng from '../../assets/chain/atps.webp';

/* ================================================================ API */

export type Look = 'thesis' | 'flat' | 'tem' | 'pdb' | 'line' | 'glow';
export const LOOKS: Look[] = ['thesis', 'flat', 'tem', 'pdb', 'line', 'glow'];

export type Part =
  // RuBisCO's two reactions
  | 'co2' | 'o2' | 'rubisco' | 'carbox' | 'oxy' | 'pga' | 'pg2'
  // light reactions and the cycle
  | 'light' | 'thyl' | 'supply' | 'reduce' | 'tp' | 'regen' | 'export'
  // photorespiration
  | 'glycolate' | 'perox' | 'glycine' | 'mito' | 'serine' | 'co2-out' | 'nh3' | 'glycerate'
  // compartments (context)
  | 'chl'
  // FvCB limits (drawn only when lit)
  | 'lim-c' | 'lim-j' | 'lim-p';

/** Plain names, for aria labels. */
export const PART_NAME: Record<Part, string> = {
  co2: 'CO2 reaching RuBisCO', o2: 'O2 reaching RuBisCO', rubisco: 'RuBisCO with its substrate RuBP',
  carbox: 'carboxylation: RuBP + CO2 gives PGA', oxy: 'oxygenation: RuBP + O2 gives PGA and 2-phosphoglycolate',
  pga: 'PGA', pg2: '2-phosphoglycolate',
  light: 'light', thyl: 'the thylakoids, where the light reactions make ATP and NADPH', supply: 'ATP and NADPH from the light reactions',
  reduce: 'PGA reduction to triose phosphate with ATP and NADPH', tp: 'triose phosphate',
  regen: 'RuBP regeneration from 5 of 6 triose phosphates, with ATP', export: 'export of 1 of 6 triose phosphates to make sucrose, in exchange for phosphate',
  glycolate: 'glycolate leaving the chloroplast for the peroxisome', perox: 'the peroxisome', glycine: 'glycine moving to the mitochondrion',
  mito: 'the mitochondrion', serine: 'serine moving back to the peroxisome', 'co2-out': 'CO2 released in the mitochondrion',
  nh3: 'NH3 released in the mitochondrion and refixed in the chloroplast with ATP and reduced ferredoxin',
  glycerate: 'glycerate returning to the chloroplast and becoming PGA with ATP', chl: 'the chloroplast',
  'lim-c': 'the RuBisCO limit Ac, set by Vcmax', 'lim-j': 'the RuBP-regeneration limit Aj, set by the electron transport rate J',
  'lim-p': 'the triose-phosphate-use limit Ap, set by TPU',
};
export const PARTS = Object.keys(PART_NAME) as Part[];
const OPTIONAL = new Set<Part>(['lim-c', 'lim-j', 'lim-p']);

/** C5 · RuBisCO's two reactions: the two gases at RuBisCO and the two products. */
export const LIT_C5: Part[] = ['co2', 'o2', 'rubisco', 'carbox', 'oxy', 'pga', 'pg2'];
/** C6 · the photorespiratory loop, from 2-phosphoglycolate back to PGA. */
export const LIT_C6: Part[] = ['pg2', 'glycolate', 'perox', 'glycine', 'mito', 'serine', 'co2-out', 'nh3', 'glycerate', 'pga'];
/** C7 · the light reactions supplying ATP and NADPH to RuBP regeneration. */
export const LIT_C7: Part[] = ['light', 'thyl', 'supply', 'reduce', 'tp', 'regen', 'rubisco'];
/** C8 · FvCB, the three limits together. */
export const LIT_C8: Part[] = ['lim-c', 'lim-j', 'lim-p', 'co2', 'rubisco', 'carbox', 'pga', 'light', 'thyl', 'supply', 'reduce', 'tp', 'regen', 'export'];
/** C8 sub-lit · RuBisCO-limited (Ac ~ Vcmax). */
export const LIT_C8C: Part[] = ['lim-c', 'co2', 'o2', 'rubisco', 'carbox', 'oxy'];
/** C8 sub-lit · RuBP-regeneration-limited (Aj ~ J). */
export const LIT_C8J: Part[] = ['lim-j', 'light', 'thyl', 'supply', 'reduce', 'tp', 'regen'];
/** C8 sub-lit · triose-phosphate-use-limited (Ap ~ TPU). */
export const LIT_C8P: Part[] = ['lim-p', 'tp', 'export'];
/** Everything on (overview). */
export const LIT_ALL: Part[] = PARTS.filter(p => !OPTIONAL.has(p));

export interface SchemaOpts {
  /** Unique on the page (ids of gradients and clip paths). */
  id?: string;
  /** viewBox crop [x, y, w, h] of the 800 × 600 schema: a zoom on part of it. */
  view?: [number, number, number, number];
  /** Leave out the root <svg> (for embedding in another figure): returns the inner markup only. */
  bare?: boolean;
  /** Draw no credit line. */
  noCredit?: boolean;
  /** Extra class on the root. */
  cls?: string;
}

/** The whole schema in one look, the `lit` parts highlighted and the rest dimmed. */
export function schemaSvg(look: Look, lit: Iterable<Part>, o: SchemaOpts = {}): string {
  const on = new Set(lit);
  const id = o.id ?? `rfs-${look}`;
  const d = new Draw(id, look, on);
  drawAll(d);
  const body = d.out() + (o.noCredit ? '' : credit(look));
  if (o.bare) return body;
  const vb = o.view ?? [0, 0, 800, 600];
  const names = PARTS.filter(p => on.has(p)).map(p => PART_NAME[p]);
  const label = `${SHOWN[look]} Highlighted: ${names.join('; ')}. Everything else is drawn dimmed.`;
  return `<svg class="fig-svg rfs rfs-${look}${o.cls ? ` ${o.cls}` : ''}" data-look="${look}" viewBox="${vb.join(' ')}" role="img" aria-label="${label}">${body}</svg>`;
}

const ORDER = 'In the chloroplast, RuBisCO adds CO2 to RuBP (carboxylation, giving PGA) or O2 (oxygenation, giving PGA and 2-phosphoglycolate); PGA is reduced to triose phosphate with ATP and NADPH from the light reactions in the thylakoids; 5 of 6 triose phosphates regenerate RuBP, 1 of 6 leaves for sucrose in exchange for phosphate. 2-phosphoglycolate leaves as glycolate for the peroxisome, becomes glycine, and in the mitochondrion two glycine give serine, CO2 and NH3; serine returns through the peroxisome as glycerate to the chloroplast, where it becomes PGA; NH3 is refixed in the chloroplast.';
const SHOWN: Record<Look, string> = {
  thesis: `Scheme after the lecturer's MSc thesis Figure 2b (after von Caemmerer 2000): CO2 and O2 as atom balls, RuBP as a pentagon, ATP and NADPH as tags, dashed arrows; peroxisome and mitochondrion to the right of the chloroplast. ${ORDER}`,
  flat: `Flat drawn scheme: the chloroplast, peroxisome and mitochondrion as tinted shapes, molecules as coloured chips, solid arrows. ${ORDER}`,
  tem: `Scheme over real electron micrographs of tobacco leaf organelles (Frederick and Newcomb 1969): the thylakoid granum, the peroxisome with its crystal and the mitochondrion are shown as cut-outs of one micrograph. ${ORDER}`,
  pdb: `Scheme with protein structures: RuBisCO as a space-filling render of spinach RuBisCO (PDB 8RUC), the light reactions as the four thylakoid complexes on a membrane. ${ORDER}`,
  line: `Minimal line scheme: thin ink outlines, no fills; the highlighted part in colour. ${ORDER}`,
  glow: `Scheme in which the highlighted parts glow in colour and all others are pale outlined silhouettes. ${ORDER}`,
};

function credit(look: Look): string {
  const t = look === 'tem' ? 'micrographs: Frederick &amp; Newcomb 1969, J Cell Biol, Fig. 6 · scheme after Zhang 2021, Fig. 2b'
    : look === 'pdb' ? 'structures: PDB 8RUC, 5XNL, 6RQF, 5L8R, 6FKF · scheme after Zhang 2021, Fig. 2b'
      : 'after Zhang 2021 (MSc thesis), Fig. 2b, and von Caemmerer 2000, Fig. 2.1';
  return `<text class="rfs-cr" x="794" y="14" text-anchor="end">${t}</text>`;
}

/* ================================================================ geometry (one set for every look) */

type Pt = [number, number];
type A = 'start' | 'middle' | 'end';
const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** All positions, in the 800 × 600 frame. Spine of the cycle at x = 316. */
export const GEO = {
  chl: { x: 8, y: 70, w: 538, h: 524, r: 44 },
  tp: [316, 150] as Pt,
  pga: [316, 318] as Pt,
  rubp: [316, 448] as Pt,
  rub: [316, 498] as Pt,
  co2: [236, 566] as Pt,
  o2: [394, 570] as Pt,
  ox: [458, 386] as Pt,
  thyl: [454, 206] as Pt,
  perox: [702, 290] as Pt, peroxR: 64,
  mito: [700, 500] as Pt, mitoRx: 86, mitoRy: 54,
  trans: [428, 70] as Pt,
};

/* ================================================================ drawing kit */

type Layer = 'fill' | 'cell' | 'flow' | 'node' | 'text' | 'top';
const LAYERS: Layer[] = ['fill', 'cell', 'flow', 'node', 'text', 'top'];

class Draw {
  private L: Record<Layer, string[]> = { fill: [], cell: [], flow: [], node: [], text: [], top: [] };
  constructor(readonly id: string, readonly look: Look, readonly lit: Set<Part>) {}
  on(p: Part): boolean { return this.lit.has(p); }
  add(layer: Layer, part: Part, svg: string): void {
    const opt = OPTIONAL.has(part) ? ' data-opt="1"' : '';
    this.L[layer].push(`<g data-p="${part}" class="${this.on(part) ? 'on' : 'off'}"${opt}>${svg}</g>`);
  }
  /** A glyph (atom balls, tags, the Pᵢ disc): dimmed like chain.ts glyph mode, in colour at reduced opacity. */
  gl(layer: Layer, part: Part, svg: string): void {
    const opt = OPTIONAL.has(part) ? ' data-opt="1"' : '';
    // the wrapper keeps the markup contract (class "on" or "off" alone; the rf animations parse it); the glyph sits in
    // an inner group that the dimming leaves in colour
    this.L[layer].push(`<g data-p="${part}" class="${this.on(part) ? 'on' : 'off'}"${opt}><g class="rfs-gl">${svg}</g></g>`);
  }
  raw(layer: Layer, svg: string): void { this.L[layer].push(svg); }
  out(): string { return LAYERS.map(k => this.L[k].join('')).join(''); }
}

const T = (x: number, y: number, s: string, cls: string, a: A = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

/** Symbols with real subscripts (CO₂ keeps its Unicode subscript; model symbols get a smaller tspan). */
const sym = (s: string): string => s.replace(/\b([AVJ])_(\w+)/g, '$1<tspan class="rfs-sub" dy="5">$2</tspan><tspan dy="-5"> </tspan>');

function smooth(q: Pt[]): string {
  let d = `M${f(q[0][0])},${f(q[0][1])}`;
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}
/** Arrow along points; open V head (thesis), closed head otherwise. */
function arrow(d: Draw, q: Pt[], kind = '', hl = 13): string {
  const tip = q[q.length - 1], prev = q[q.length - 2];
  const dir: Pt = [tip[0] - prev[0], tip[1] - prev[1]], L = Math.hypot(dir[0], dir[1]);
  const u: Pt = [dir[0] / L, dir[1] / L], n: Pt = [-u[1], u[0]];
  const open = d.look === 'thesis';
  const back: Pt = open ? [tip[0] - u[0] * 1.5, tip[1] - u[1] * 1.5] : [tip[0] - u[0] * hl * 0.7, tip[1] - u[1] * hl * 0.7];
  const line = smooth([...q.slice(0, -1), back]);
  const hw = open ? hl * 0.62 : hl * 0.55;
  const b: Pt = [tip[0] - u[0] * hl, tip[1] - u[1] * hl];
  const head = open
    ? `<path class="rfs-hdo ${kind}" d="M${f(b[0] + n[0] * hw)},${f(b[1] + n[1] * hw)}L${f(tip[0])},${f(tip[1])}L${f(b[0] - n[0] * hw)},${f(b[1] - n[1] * hw)}"/>`
    : `<path class="rfs-hd ${kind}" d="M${f(tip[0])},${f(tip[1])}L${f(b[0] + n[0] * hw)},${f(b[1] + n[1] * hw)}L${f(b[0] - n[0] * hw)},${f(b[1] - n[1] * hw)}Z"/>`;
  return `<path class="rfs-ar ${kind}" d="${line}"/>${head}`;
}

/** A tag pill (ATP, NADPH, ferredoxin, Pᵢ…). */
function tag(d: Draw, x: number, y: number, s: string, k: 'atp' | 'nadph' | 'fd'): string {
  const w = s.length * 10.2 + 16;
  if (d.look === 'line') return `<rect class="rfs-tag rfs-tag-${k}" x="${f(x - w / 2)}" y="${f(y - 13)}" width="${f(w)}" height="26" rx="13"/>${T(x, y + 6.5, s, `rfs-tagt rfs-tagt-${k}`)}`;
  return `<rect class="rfs-tag rfs-tag-${k}" x="${f(x - w / 2)}" y="${f(y - 13)}" width="${f(w)}" height="26" rx="${d.look === 'thesis' ? 6 : 13}"/>${T(x, y + 6.5, s, `rfs-tagt rfs-tagt-${k}`)}`;
}

/** A molecule as atom balls (thesis, pdb, glow, tem) or a chip (flat, line). */
/** A molecule as atom balls in every look (the deck's one glyph set, 28 Oct 2026; `label` is drawn beside it by the caller). */
function gas(d: Draw, c: Pt, atoms: string, label: string, angle = 0): string {
  void d; void label;
  const r = 12.5, n = atoms.length, step = 2 * r * 0.92;
  const a = (angle * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a);
  let s = '';
  for (let i = 0; i < n; i++) {
    const o = (i - (n - 1) / 2) * step, x = c[0] + ux * o, y = c[1] + uy * o, el = atoms[i];
    s += `<circle class="rfs-atom rfs-atom-${el}" cx="${f(x)}" cy="${f(y)}" r="${r}"/>${T(x, y + 5.5, el, `rfs-atomt rfs-atomt-${el}`)}`;
  }
  return s;
}

/** RuBP as a pentagon (thesis), chip elsewhere. */
function rubpShape(d: Draw, c: Pt): string {
  const R = 30;
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (-90 + i * 72) * Math.PI / 180;
    return `${f(c[0] + R * Math.cos(a))},${f(c[1] + R * Math.sin(a) + 3)}`;
  }).join(' ');
  return `<polygon class="rfs-rubp" points="${pts}"/>${T(c[0], c[1] + 9, 'RuBP', 'rfs-rubpt')}`;
}

/** A metabolite node: plain bold text (thesis), a pill (flat, pdb, tem, glow) or a box (line). */
function node(d: Draw, c: Pt, s: string, cls = '', w?: number): string {
  const ww = w ?? s.replace(/<[^>]+>/g, '').length * 10.6 + 26;
  const box = d.look === 'thesis' ? '' : `<rect class="rfs-node ${cls}" x="${f(c[0] - ww / 2)}" y="${f(c[1] - 18)}" width="${f(ww)}" height="36" rx="${d.look === 'line' ? 4 : 18}"/>`;
  return `${box}${T(c[0], c[1] + 7, s, `rfs-nodet ${cls}`)}`;
}

/** A node with a second, smaller line (2-phosphoglycolate + PGA). */
function node2(d: Draw, c: Pt, s1: string, s2: string, cls: string, w: number): string {
  const box = d.look === 'thesis' ? '' : `<rect class="rfs-node ${cls}" x="${f(c[0] - w / 2)}" y="${f(c[1] - 20)}" width="${f(w)}" height="54" rx="${d.look === 'line' ? 4 : 20}"/>`;
  return `${box}${T(c[0], c[1] + 5, s1, `rfs-nodet rfs-n-sm ${cls}`)}${T(c[0], c[1] + 28, s2, 'rfs-small')}`;
}

/** A curly brace, vertical, opening to the right (+1) or left (−1). */
function brace(x: number, y0: number, y1: number, dir: 1 | -1, cls: string): string {
  const m = (y0 + y1) / 2, k = 12 * dir;
  return `<path class="rfs-brace ${cls}" d="M${f(x + k)},${f(y0)}Q${f(x)},${f(y0)} ${f(x)},${f(y0 + 16)}L${f(x)},${f(m - 14)}Q${f(x)},${f(m)} ${f(x - k)},${f(m)}Q${f(x)},${f(m)} ${f(x)},${f(m + 14)}L${f(x)},${f(y1 - 16)}Q${f(x)},${f(y1)} ${f(x + k)},${f(y1)}"/>`;
}

/* ================================================================ the parts */

function drawAll(d: Draw): void {
  const P = d.id;
  const L = d.look;
  const G = GEO;

  /* ---------- defs ---------- */
  d.raw('fill', `<defs>
    <radialGradient id="${P}-glow"><stop offset="0" stop-color="#f6c453" stop-opacity=".75"/><stop offset=".6" stop-color="#f6c453" stop-opacity=".25"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient>
    <clipPath id="${P}-cperox"><circle cx="${G.perox[0]}" cy="${G.perox[1]}" r="${G.peroxR}"/></clipPath>
    <clipPath id="${P}-cmito"><ellipse cx="${G.mito[0]}" cy="${G.mito[1]}" rx="${G.mitoRx}" ry="${G.mitoRy}"/></clipPath>
    <clipPath id="${P}-cthyl"><rect x="${G.thyl[0] - 50}" y="${G.thyl[1] - 32}" width="100" height="64" rx="14"/></clipPath>
  </defs>`);

  /* ---------- compartments ---------- */
  const c = G.chl;
  const chlPath = `M${c.x + c.r},${c.y}H${c.x + c.w - c.r}Q${c.x + c.w},${c.y} ${c.x + c.w},${c.y + c.r}V${c.y + c.h - c.r}Q${c.x + c.w},${c.y + c.h} ${c.x + c.w - c.r},${c.y + c.h}H${c.x + c.r}Q${c.x},${c.y + c.h} ${c.x},${c.y + c.h - c.r}V${c.y + c.r}Q${c.x},${c.y} ${c.x + c.r},${c.y}Z`;
  d.add('fill', 'chl', `<path class="rfs-stroma" d="${chlPath}"/>`);
  d.add('cell', 'chl', `<path class="rfs-env" d="${chlPath}"/><path class="rfs-env2" d="${inset(c, 7)}"/>`);
  d.add('text', 'chl', T(c.x + 2, c.y - 14, 'chloroplast', 'rfs-zone', 'start'));

  // peroxisome
  { const [px, py] = G.perox, pr = G.peroxR;
  if (L === 'tem') {
    d.add('fill', 'perox', `<g clip-path="url(#${P}-cperox)"><image href="${peroxJpg}" x="${px - 98}" y="${py - 88}" width="200" height="165" preserveAspectRatio="xMidYMid slice"/></g><circle class="rfs-temrim" cx="${px}" cy="${py}" r="${pr}"/>`);
  } else {
    d.add('fill', 'perox', `<circle class="rfs-perox" cx="${px}" cy="${py}" r="${pr}"/>` + (L === 'flat' ? `<rect class="rfs-crystal" x="${px - 22}" y="${py - 46}" width="40" height="34" rx="3" transform="rotate(-8 ${px} ${py})"/>` : ''));
  }
  d.add('cell', 'perox', `<circle class="rfs-mem" cx="${px}" cy="${py}" r="${pr}"/>`);
  d.add('text', 'perox', T(px, py + 7, 'peroxisome', 'rfs-org')); }

  // mitochondrion
  { const [mx, my] = G.mito;
  if (L === 'tem') {
    d.add('fill', 'mito', `<g clip-path="url(#${P}-cmito)"><image href="${mitoJpg}" x="${mx - G.mitoRx}" y="${my - G.mitoRx}" width="${2 * G.mitoRx}" height="${2 * G.mitoRx}" preserveAspectRatio="xMidYMid slice"/></g><ellipse class="rfs-temrim" cx="${mx}" cy="${my}" rx="${G.mitoRx}" ry="${G.mitoRy}"/>`);
  } else {
    d.add('fill', 'mito', `<ellipse class="rfs-mito" cx="${mx}" cy="${my}" rx="${G.mitoRx}" ry="${G.mitoRy}"/>` + (L === 'line' ? '' : cristae(mx, my)));
  }
  d.add('cell', 'mito', `<ellipse class="rfs-mem" cx="${mx}" cy="${my}" rx="${G.mitoRx}" ry="${G.mitoRy}"/>`);
  d.add('text', 'mito', T(mx, my + 7, 'mitochondrion', 'rfs-org')); }

  /* ---------- light reactions ---------- */
  const [tx, ty] = G.thyl;
  d.add('node', 'thyl', thylakoid(d, tx, ty));
  d.add('text', 'thyl', T(tx, ty + 56, 'thylakoid', 'rfs-lab'));
  d.add('node', 'light', lightSym(d, [tx + 68, ty - 54]));
  d.add('text', 'light', T(tx + 46, ty - 74, 'light', 'rfs-light', 'end'));
  // ATP and NADPH from the thylakoid to the reduction step
  d.add('flow', 'supply', arrow(d, [[tx - 52, ty + 8], [G.tp[0] + 6, ty + 8]], 'rfs-k-e', 11));
  d.gl('node', 'supply', tag(d, 362, ty - 18, 'NADPH', 'nadph') + tag(d, 362, ty + 34, 'ATP', 'atp'));

  /* ---------- the cycle ---------- */
  const [x0] = G.tp;
  // reduction: PGA → triose phosphate
  d.add('flow', 'reduce', arrow(d, [[x0, G.pga[1] - 20], [x0, G.tp[1] + 22]], 'rfs-k-cyc'));
  d.add('text', 'reduce', T(x0 - 12, 246, 'reduction', 'rfs-proc', 'end'));
  // carboxylation: RuBP → PGA
  d.add('flow', 'carbox', arrow(d, [[x0, G.rubp[1] - 32], [x0, G.pga[1] + 22]], 'rfs-k-cyc'));
  d.add('text', 'carbox', T(x0 - 12, 404, 'carboxylation', 'rfs-proc', 'end'));
  // oxygenation: RuBP → PGA + 2-phosphoglycolate
  d.add('flow', 'oxy', arrow(d, [[x0 + 30, G.rubp[1] - 8], [G.ox[0] - 76, G.ox[1] + 20]], 'rfs-k-ox'));
  d.add('text', 'oxy', T(x0 + 40, 472, 'oxygenation', 'rfs-proc rfs-proc-ox', 'start'));
  // the PGA made by oxygenation joins the pool
  d.add('flow', 'oxy', arrow(d, [[G.ox[0] - 78, G.ox[1] - 14], [x0 + 52, 350], [x0 + 32, G.pga[1] + 14]], 'rfs-k-ox rfs-thin', 10));
  // regeneration: triose phosphate → RuBP, round the left
  d.add('flow', 'regen', arrow(d, [[x0 - 80, G.tp[1] + 6], [152, 198], [126, 300], [150, 402], [x0 - 34, G.rubp[1] + 6]], 'rfs-k-cyc'));
  d.add('text', 'regen', T(236, 202, 'regeneration', 'rfs-proc', 'middle'));
  d.gl('node', 'regen', tag(d, 158, 416, 'ATP', 'atp'));
  d.add('text', 'regen', T(196, 456, '5 of 6', 'rfs-frac', 'middle'));
  // export: 1 of 6 triose phosphates leave through the envelope; Pᵢ comes in
  const [ex, ey] = G.trans;
  d.add('flow', 'export', arrow(d, [[x0 + 74, G.tp[1] - 16], [ex - 4, ey + 26], [ex + 6, ey - 12], [ex + 44, ey - 38]], 'rfs-k-cyc'));
  d.add('flow', 'export', arrow(d, [[ex - 74, ey - 38], [ex - 34, ey - 22], [ex - 12, ey - 2]], 'rfs-k-pi rfs-thin', 10));
  d.add('node', 'export', `<ellipse class="rfs-trans" cx="${ex}" cy="${ey}" rx="28" ry="11"/>`);
  d.add('text', 'export', T(ex + 52, ey - 32, 'sucrose', 'rfs-lab', 'start') + T(x0 + 62, 108, '1 of 6', 'rfs-frac', 'end'));
  d.gl('node', 'export', `<circle class="rfs-pidisc" cx="${ex - 90}" cy="${ey - 36}" r="13"/>${T(ex - 90, ey - 30.5, 'Pᵢ', 'rfs-pit')}`);

  // nodes
  d.add('node', 'tp', node(d, G.tp, 'triose phosphate', 'rfs-n-tp', 172));
  d.add('node', 'pga', node(d, G.pga, 'PGA', 'rfs-n-pga', 74));
  d.add('node', 'pg2', node2(d, G.ox, '2-phosphoglycolate', '+ PGA', 'rfs-n-pg2', 172));

  /* ---------- RuBisCO, RuBP, gases ---------- */
  d.add('node', 'rubisco', rubiscoShape(d, G.rub) + rubpShape(d, G.rubp));
  const balls = true;
  d.gl('node', 'co2', gas(d, G.co2, 'OCO', 'CO₂', -18) + (balls ? T(G.co2[0] - 40, G.co2[1] + 16, 'CO₂', 'rfs-gas', 'end') : ''));
  d.add('flow', 'co2', arrow(d, [[G.co2[0] + 30, G.co2[1] - 26], [G.rub[0] - 48, G.rub[1] + 24]], 'rfs-k-gas', 10));
  d.gl('node', 'o2', gas(d, G.o2, 'OO', 'O₂', 18) + (balls ? T(G.o2[0] + 30, G.o2[1] + 20, 'O₂', 'rfs-gas', 'start') : ''));
  d.add('flow', 'o2', arrow(d, [[G.o2[0] - 22, G.o2[1] - 24], [G.rub[0] + 50, G.rub[1] + 24]], 'rfs-k-gas', 10));

  /* ---------- photorespiration ---------- */
  const [px, py] = G.perox, pr = G.peroxR, [mx, my] = G.mito;
  // glycolate: chloroplast → peroxisome
  d.add('flow', 'glycolate', arrow(d, [[G.ox[0] + 72, G.ox[1] - 18], [566, 356], [px - 46, py + 46]], 'rfs-k-pr'));
  d.add('text', 'glycolate', T(592, 334, 'glycolate', 'rfs-met', 'middle'));
  // glycerate: peroxisome → chloroplast → PGA (ATP)
  d.add('flow', 'glycerate', arrow(d, [[px - pr - 2, py - 22], [560, 264], [452, 286], [x0 + 38, G.pga[1] - 8]], 'rfs-k-pr'));
  d.add('text', 'glycerate', T(600, 246, 'glycerate', 'rfs-met', 'middle'));
  d.gl('node', 'glycerate', tag(d, 404, 320, 'ATP', 'atp'));
  // glycine: peroxisome → mitochondrion; serine back
  d.add('flow', 'glycine', arrow(d, [[px - 24, py + pr - 4], [px - 24, my - G.mitoRy - 2]], 'rfs-k-pr'));
  d.add('text', 'glycine', T(px - 34, 408, 'glycine', 'rfs-met', 'end'));
  d.add('flow', 'serine', arrow(d, [[px + 26, my - G.mitoRy - 2], [px + 26, py + pr - 4]], 'rfs-k-pr'));
  d.add('text', 'serine', T(px + 34, 408, 'serine', 'rfs-met', 'start'));
  // CO₂ out of the mitochondrion
  d.add('flow', 'co2-out', arrow(d, [[mx + 40, my + G.mitoRy - 6], [mx + 54, 568]], 'rfs-k-gas', 10));
  d.gl('node', 'co2-out', gas(d, [mx + 8, 580], 'OCO', 'CO₂', 0) + (balls ? T(mx - 32, 586, 'CO₂', 'rfs-gas', 'end') : ''));
  // NH₃ back to the chloroplast
  d.add('flow', 'nh3', arrow(d, [[mx - G.mitoRx + 2, my + 12], [584, 520], [534, 522]], 'rfs-k-pr'));
  d.add('text', 'nh3', T(590, 504, 'NH₃', 'rfs-met', 'middle'));
  d.gl('node', 'nh3', tag(d, 498, 522, 'ATP', 'atp') + tag(d, 478, 556, 'ferredoxin', 'fd'));

  /* ---------- FvCB limits ---------- */
  d.add('top', 'lim-c', brace(124, 470, 586, 1, 'rfs-br-c') + T(114, 512, sym('A_c ~ V_cmax'), 'rfs-lim rfs-lim-c rfs-lim-sm', 'end') + T(110, 538, 'RuBisCO', 'rfs-limsub', 'end') + T(110, 561, 'capacity', 'rfs-limsub', 'end'));
  d.add('top', 'lim-j', brace(102, 150, 446, 1, 'rfs-br-j') + T(88, 286, sym('A_j ~ J'), 'rfs-lim rfs-lim-j', 'end') + T(88, 312, 'electron', 'rfs-limsub', 'end') + T(88, 335, 'transport', 'rfs-limsub', 'end'));
  d.add('top', 'lim-p', brace(574, 22, 140, -1, 'rfs-br-p') + T(596, 66, sym('A_p ~ TPU'), 'rfs-lim rfs-lim-p', 'start') + T(596, 92, 'triose-phosphate', 'rfs-limsub', 'start') + T(596, 115, 'use', 'rfs-limsub', 'start'));
}

function inset(c: { x: number; y: number; w: number; h: number; r: number }, k: number): string {
  const x = c.x + k, y = c.y + k, w = c.w - 2 * k, h = c.h - 2 * k, r = c.r - k;
  return `M${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x + r}Q${x},${y + h} ${x},${y + h - r}V${y + r}Q${x},${y} ${x + r},${y}Z`;
}

function cristae(cx: number, cy: number): string {
  let s = '';
  for (const [dx, h] of [[-58, 26], [-30, 40], [0, 44], [30, 40], [58, 26]] as const) {
    const top = cy - h / 2 - 8, bot = cy + h / 2 + 8;
    s += `<path class="rfs-crista" d="M${f(cx + dx)},${f(top)}v${f(h * 0.62)}M${f(cx + dx)},${f(bot)}v${f(-h * 0.62)}"/>`;
  }
  return s;
}

function thylakoid(d: Draw, x: number, y: number): string {
  const L = d.look;
  if (L === 'tem') return `<g clip-path="url(#${d.id}-cthyl)"><image href="${granumJpg}" x="${x - 52}" y="${y - 34}" width="104" height="66" preserveAspectRatio="xMidYMid slice"/></g><rect class="rfs-temrim" x="${x - 50}" y="${y - 32}" width="100" height="64" rx="14"/>`;
  if (L === 'pdb') {
    // the four thylakoid complexes in side view on a membrane band (the renders of slides 7–10b, one scale)
    const band = `<rect class="rfs-membr" x="${x - 56}" y="${y - 6}" width="112" height="12" rx="3"/>`;
    const im = (href: string, cx: number, w: number, h: number, dy: number): string =>
      `<image href="${href}" x="${f(cx - w / 2)}" y="${f(y - h / 2 + dy)}" width="${w}" height="${h}"/>`;
    return `<rect class="rfs-granum rfs-pdbbox" x="${x - 60}" y="${y - 34}" width="120" height="68" rx="12"/>` + band + im(psiiPng, x - 30, 50, 36, 0) + im(b6fPng, x + 6, 22, 27, 0) + im(psiPng, x + 30, 26, 24, -1) + im(atpsPng, x + 52, 18, 34, -8);
  }
  // a granum: stacked discs
  let s = '';
  for (let i = 0; i < 5; i++) s += `<rect class="rfs-disc" x="${f(x - 44)}" y="${f(y - 30 + i * 12.5)}" width="88" height="10" rx="5"/>`;
  return `<rect class="rfs-granum" x="${x - 50}" y="${y - 36}" width="100" height="72" rx="12"/>${s}`;
}

function lightSym(d: Draw, at: Pt): string {
  const [x, y] = at;
  if (d.look === 'line' || d.look === 'flat') {
    // a wavy ray
    let p = `M${x - 18},${y - 20}`;
    for (let i = 1; i <= 8; i++) p += `L${f(x - 18 + i * 4.2 + (i % 2 ? 4 : -4))},${f(y - 20 + i * 5)}`;
    return `<path class="rfs-ray" d="${p}"/><path class="rfs-hd rfs-k-light" d="M${x + 22},${y + 28}l-12,-3l7,-9Z"/>`;
  }
  // a lightning bolt (the thesis's photon symbol)
  return `<path class="rfs-bolt" d="M${x - 6},${y - 26}l20,0l-9,15l12,0l-24,32l6,-22l-11,0Z"/>`;
}

function rubiscoShape(d: Draw, c: Pt): string {
  const [x, y] = c;
  if (d.look === 'pdb') {
    const w = 104, h = w * 471 / 548;
    return `<image href="${rubiscoPng}" x="${f(x - w / 2)}" y="${f(y - 22)}" width="${w}" height="${f(h)}"/>${T(x - 60, y + 14, 'RuBisCO', 'rfs-name', 'end')}`;
  }
  const w = 132, h = 44;
  const notch = d.look === 'thesis' ? `<path class="rfs-notch" d="M${x - 10},${y + h / 2 + 4}a10,10 0 0 1 20,0"/>` : '';
  return `<rect class="rfs-rub" x="${x - w / 2}" y="${y - h / 2 + 4}" width="${w}" height="${h}" rx="${d.look === 'line' ? 6 : 16}"/>${notch}${T(x, y + 9, 'RuBisCO', 'rfs-name')}`;
}
