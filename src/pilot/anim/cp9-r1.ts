// Measuring leaf gas exchange (slide C9), staging r1 (lecturer, 30 Oct 2026: "really simple: a real instrument, then zoom
// inside to see how it operates; no cartoons, no history"). Four beats, one thing at a time:
// 0 a real LI-6800 on a maize leaf, then one eased zoom into its sensor head that cross-fades into the LI-6800 manual's
//   current head drawing; 1 the slide's NIST spectra with the 2 analyser windows, then an infrared beam through a gas cell
//   (more CO₂, less infrared at the detector); 2 counted molecules: 10 CO₂ + 5 H₂O into the reference analyser, then the same
//   air over the leaf into the sample analyser (2 CO₂ taken up, 2 H₂O given off: 8 + 7); 3 the 2 formula lines. No closing
//   question (lecturer, 30 Oct 2026, later: the player hides questions on this slide).
// Sources (lecturer: "the reference should be the LI-6800 manual, that's the latest one"): LI-6800 manual, Introduction (2
// IRGAs in the head, the air split there; flow-schematics.svg, cropped to the leaf-chamber configuration as
// assets/photos/cp9-li6800-head.svg) and Specifications (absolute non-dispersive infrared CO₂ and H₂O analysers; the manual
// states no wavelengths, so the windows stay at the bands' 4.26 µm and ≈ 2.6 µm). Photo: assets/photos/cp9-li6800-maize.jpg,
// "Photosynthesis System analysing a maize leaf" (an LI-6800, University of Illinois), Viséan, Wikimedia Commons, CC BY-SA 4.0,
// resized to 1400 × 2252.
// The parts shared with r2 (beats, molecules, paths, the gas-cell demo, the formulas) are exported from here.
import photoJpg from '../../assets/photos/cp9-li6800-maize.jpg';
import licorPng from '../../assets/photos/cp9-li6800-head.svg';
import { CO2 as CO2S, H2O as H2OS } from '../../assets/c09-ir-spectra';
import { co2, h2o } from '../figs/cp-kit';
import { draw as irFig } from '../figs/cp09-ir';
import { beatClock, f1, figInner, lerpV, mv, setters, smoother, stagePill, tw, type Setters, type V } from './cp-stage';
import type { Beat, Cite, Staging } from './types';

/* ---------------------------------------------------------------- beats (shared with r2) */

const PHOTO: Cite = { label: 'Photo: Viséan, Wikimedia Commons, CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Photosynthesis_System_analysing_a_maize_leaf.jpg' };
const LICOR: Cite = { label: 'LI-COR LI-6800 manual', url: 'https://www.licor.com/support/LI-6800/topics/introduction.html' };
const NIST: Cite = { label: 'NIST Chemistry WebBook, gas-phase IR spectra', url: 'https://webbook.nist.gov/chemistry/' };
const LISPEC: Cite = { label: 'LI-COR LI-840A manual, Theory of Operation', url: 'https://www.licor.com/support/LI-840A/topics/theory.html' };
const BUSCH24: Cite = { label: 'Busch et al. 2024, Plant Cell Environ.', url: 'https://doi.org/10.1111/pce.14815' };
const A = '<i>A</i>', E = '<i>E</i>';

export const BEATS: Beat[] = [
  {
    tag: 'The instrument', cite: [PHOTO, LICOR],
    say: 'An LI-6800 measuring a maize leaf: the leaf is clamped in the leaf chamber; the 2 analysers sit in the sensor head beside it.',
    steps: [
      { tag: 'The instrument', say: 'An LI-6800 measuring a maize leaf: the leaf is clamped in the leaf chamber; the 2 analysers sit in the sensor head beside it.' },
      { tag: 'Inside the head', say: 'Inside the sensor head, the air from the console is split. One part goes straight to the reference analyser; the other passes the leaf, then the sample analyser.' },
    ],
  },
  {
    tag: 'Infrared', cite: [NIST, LISPEC],
    say: 'CO₂ and water vapour absorb infrared at different wavelengths.',
    steps: [
      { tag: 'Infrared', say: 'CO₂ and water vapour absorb infrared at different wavelengths. The analyser reads each gas through its own narrow filter: 4.26 µm for CO₂, ≈ 2.6 µm for water vapour, where only that gas absorbs.' },
      { tag: 'Gas cell', say: 'An infrared beam crosses the gas cell to a detector behind the filter. The more CO₂ in the cell, the less infrared reaches the detector: the signal gives the CO₂ concentration.' },
    ],
  },
  {
    tag: 'Reference and sample', cite: [LICOR, BUSCH24],
    say: 'Air of known CO₂ and water vapour flows into the reference analyser.',
    steps: [
      { tag: 'Reference', say: 'The instrument sets the CO₂ and water vapour of the incoming air, so they are known: here 10 CO₂ and 5 H₂O reach the reference analyser.' },
      { tag: 'Sample', say: 'The same air flows over the leaf, then into the sample analyser. The leaf took up 2 CO₂ and gave off 2 H₂O: 8 CO₂ and 7 H₂O come out (not to scale: a leaf loses hundreds of H₂O per CO₂).' },
    ],
  },
  {
    tag: 'Net photosynthesis and transpiration', cite: [BUSCH24, LICOR],
    say: `The difference between the 2 analysers, times the air flow, divided by the leaf area: the net CO₂ uptake (net photosynthesis), ${A}, in µmol m⁻² s⁻¹, and the transpiration, ${E}, in mmol m⁻² s⁻¹.`,
  },
];

/* ---------------------------------------------------------------- shared drawing */

export const INK = '#3d3d3a', IR = '#c0392b';
const sub = (s: string): string => `<tspan baseline-shift="sub" font-size="70%">${s}</tspan>`;
/** The 2 formula lines, in the deck's serif. */
export const FORMULA_A = `<tspan font-style="italic">A</tspan> = (CO${sub('2')} in − CO${sub('2')} out) × flow ÷ leaf area`;
export const FORMULA_E = `<tspan font-style="italic">E</tspan> = (H${sub('2')}O out − H${sub('2')}O in) × flow ÷ leaf area`;
export const formulaSvg = (k: string, x: number, y: number, s: string): string =>
  `<text data-k="${k}" class="cps-sym" x="${x}" y="${y}" opacity="0">${s}</text>`;

/** A molecule (atom balls, the deck's glyphs) at the origin, moved by a transform. */
export const molSvg = (k: string, kind: 'c' | 'h', r = 10): string =>
  `<g data-k="${k}" opacity="0" display="none"><g class="fig">${kind === 'c' ? co2(0, 0, r) : h2o(0, 0, r)}</g></g>`;
export const place = (S: Setters, el: Element, p: V, o: number): void => {
  S.set(el, 'transform', `translate(${f1(p[0])} ${f1(p[1])})`);
  S.op(el, o);
};

/** A tube along the polyline: a grey wall around a paper bore. */
export const pipe = (pts: V[]): string => {
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p[0])},${f1(p[1])}`).join('');
  return `<path d="${d}" fill="none" stroke="#c9c4b6" stroke-width="18" stroke-linejoin="round" stroke-linecap="butt"/>
    <path d="${d}" fill="none" stroke="#fbfaf5" stroke-width="11" stroke-linejoin="round" stroke-linecap="butt"/>`;
};
/** A grey flow arrow (exhaust). */
export const flowArrow = (p: string, a: V, b: V): string =>
  `<path d="M${f1(a[0])},${f1(a[1])}L${f1(b[0])},${f1(b[1])}" fill="none" stroke="#6b6a64" stroke-width="3" stroke-linecap="round" marker-end="url(#${p}-ah)"/>`;
export const defs = (p: string): string =>
  `<defs><marker id="${p}-ah" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5.2" markerHeight="5.2" orient="auto-start-reverse"><path d="M0,0.6 L10,5 L0,9.4z" fill="#6b6a64"/></marker>
  <filter id="${p}-sh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#46321a" flood-opacity=".16"/></filter></defs>`;
/** An analyser or chamber box. */
export const box = (x: number, y: number, w: number, h: number, fill = '#eef3f8'): string =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${INK}" stroke-width="1.8"/>`;
/** A leaf blade seen edge-on, lying along y from x0 to x1. */
export const leafSvg = (x0: number, x1: number, y: number, h = 13): string => {
  const xm = (x0 + x1) / 2;
  return `<path d="M${x0},${y} Q${xm},${y - 2 * h} ${x1},${y} Q${xm},${y + 2 * h} ${x0},${y}Z" fill="#76AA58" fill-opacity=".8" stroke="#4e7d36" stroke-width="1.6"/>
    <path d="M${x0 + 8},${y} H${x1 - 8}" stroke="#4e7d36" stroke-width="1.2" opacity=".7"/>`;
};
/** A text label in stage px. */
export const lab = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle', cls = 'cps-lab', k = ''): string =>
  `<text${k ? ` data-k="${k}"` : ''} class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${a}">${s}</text>`;

/** The point at fraction u (0–1) of the polyline's length. */
export function along(pl: V[], u: number): V {
  const seg = pl.slice(1).map((p, i) => Math.hypot(p[0] - pl[i][0], p[1] - pl[i][1]));
  let d = Math.max(0, Math.min(1, u)) * seg.reduce((a, b) => a + b, 0);
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) return lerpV(pl[i], pl[i + 1], seg[i] ? Math.min(1, d / seg[i]) : 1);
    d -= seg[i];
  }
  return pl[pl.length - 1];
}

/* ---------------------------------------------------------------- counted molecules: reference and sample */

/** One counted molecule: it fades in at its start (or at `appear`), moves along pl over d s (eased), and may fade out on
 *  arrival (taken up by the leaf). */
export interface Mol { k: string; kind: 'c' | 'h'; pl: V[]; s: number; d: number; appear?: number; vanish?: boolean }
/** Slot j of a molecule grid: CO₂ in 5 columns at cx0, H₂O in 4 columns at hx0, 2 rows at y0, y0 + dy. */
export const slot = (kind: 'c' | 'h', j: number, cx0: number, hx0: number, y0: number, dy: number): V =>
  kind === 'c' ? [cx0 + 56 * (j % 5), y0 + dy * Math.floor(j / 5)] : [hx0 + 40 * (j % 4), y0 + dy * Math.floor(j / 4)];
/** The incoming air: 10 CO₂ and 5 H₂O, interleaved. */
export const STREAM: Array<'c' | 'h'> = ['c', 'c', 'h', 'c', 'c', 'h', 'c', 'c', 'h', 'c', 'c', 'h', 'c', 'c', 'h'];
/** The 2 CO₂ the leaf takes up (their place in the CO₂ order). */
export const TAKEN = [2, 6];
/** Molecule positions at time t (s into the beat). */
export function molCtl(S: Setters, mols: Mol[]): (t: number, scene: number) => void {
  const els = mols.map(m => S.q(m.k));
  return (t, scene) => mols.forEach((m, i) => {
    const go = m.appear ?? m.s;
    let o = tw(t, go, go + 0.9);
    if (m.vanish) o *= 1 - tw(t, m.s + m.d, m.s + m.d + 0.9);
    place(S, els[i], along(m.pl, smoother((t - m.s) / m.d)), o * scene);
  });
}
/** Counted molecules for one analyser: reference (straight in) or sample (through the leaf chamber). */
export function buildMols(p: string, o: {
  ref: V[]; refSlots: (kind: 'c' | 'h', j: number) => V; refT0: number;
  samp: V[]; sampSlots: (kind: 'c' | 'h', j: number) => V; sampT0: number;
  /** the stream's path inside the chamber up to the leaf (taken up), and from a leaf point onward (given off) */
  toLeaf: (j: number) => V[]; fromLeaf: (j: number) => V[]; gap: number; dRef: number; dSamp: number; dLeaf: number; dOut: number; leafT?: number;
}): Mol[] {
  const out: Mol[] = [];
  let c = 0, h = 0;
  STREAM.forEach((kind, i) => {
    const j = kind === 'c' ? c++ : h++;
    out.push({ k: `${p}-r${i}`, kind, pl: [...o.ref, o.refSlots(kind, j)], s: o.refT0 + o.gap * i, d: o.dRef });
  });
  c = 0; h = 0;
  let cs = 0;
  STREAM.forEach((kind, i) => {
    const j = kind === 'c' ? c++ : h++;
    const s = o.sampT0 + o.gap * i;
    if (kind === 'c' && TAKEN.includes(j)) out.push({ k: `${p}-s${i}`, kind, pl: o.toLeaf(TAKEN.indexOf(j)), s, d: o.dLeaf, vanish: true });
    else out.push({ k: `${p}-s${i}`, kind, pl: [...o.samp, o.sampSlots(kind, kind === 'c' ? cs++ : j)], s, d: o.dSamp });
  });
  // the 2 H₂O the leaf gives off: they appear at the leaf surface as the stream passes, then join it
  [0, 1].forEach(j => {
    const appear = o.sampT0 + (o.leafT ?? 2.2) + 1.3 * j;
    const pl = o.fromLeaf(j);
    out.push({ k: `${p}-g${j}`, kind: 'h', pl: [...pl, o.sampSlots('h', 5 + j)], s: appear + 0.9, d: o.dOut, appear });
  });
  return out;
}

/* ---------------------------------------------------------------- a small copy of the slide's spectra (r2) */

const RUST = '#a2461f', BLUE = '#2f62a3';
/** The NIST spectra of CO₂ and H₂O (assets/c09-ir-spectra.ts, as figs/cp09-ir.ts draws them) from 2.5 to 8 µm, w × h at
 *  x0, y0, with the analyser's 2 filter windows (4.26 µm and ≈ 2.6 µm; the LI-6800 manual states no wavelengths), ticks and a 2-line key at the right. */
export function miniSpec(x0: number, y0: number, w: number, h: number): string {
  const X = (l: number): number => x0 + (l - 2.5) / 5.5 * w, Y = (a: number): number => y0 + h - a * h;
  const line = (s: { x0: number; dx: number; y: number[] }, col: string): string => {
    const pts = s.y.map((a, i) => [X(1e4 / (s.x0 + i * s.dx)), Y(a)] as const).filter(([x]) => x >= x0 - 0.01 && x <= x0 + w + 0.01);
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)},${f1(y)}`).join('');
    return `<path d="${d}L${f1(pts[pts.length - 1][0])},${f1(y0 + h)}L${f1(pts[0][0])},${f1(y0 + h)}Z" fill="${col}" fill-opacity="0.1"/>`
      + `<path d="${d}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linejoin="round"/>`;
  };
  const win = (l: number): string => `<rect x="${f1(X(l - 0.05))}" y="${f1(y0 - 4)}" width="${f1(X(l + 0.05) - X(l - 0.05))}" height="${f1(h + 4)}" fill="${INK}" fill-opacity="0.13" stroke="${INK}" stroke-opacity="0.45" stroke-width="1" stroke-dasharray="3 3"/>`;
  const ticks = [3, 4, 5, 6, 7, 8].map(l => `<path d="M${f1(X(l))},${f1(y0 + h)}v6" stroke="${INK}" stroke-width="1.4"/>${lab(X(l), y0 + h + 24, `${l}`, 'middle', 'cps-sub')}`).join('');
  const key = (y: number, col: string, s: string): string => `<path d="M${f1(x0 + w + 26)},${f1(y)}h26" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/>${lab(x0 + w + 60, y + 7, s, 'start', 'cps-sub')}`;
  return `${win(2.595)}${win(4.26)}${line(H2OS, BLUE)}${line(CO2S, RUST)}
    <path d="M${f1(x0)},${f1(y0 + h)}H${f1(x0 + w)}" stroke="${INK}" stroke-width="1.6"/>${ticks}${lab(x0 + w + 8, y0 + h + 24, 'µm', 'start', 'cps-sub')}
    ${lab(X(2.6), y0 - 12, '≈ 2.6 µm', 'middle', 'cps-sub')}${lab(X(4.26), y0 - 12, '4.26 µm', 'middle', 'cps-sub')}
    ${key(y0 + 14, RUST, 'CO₂')}${key(y0 + 46, BLUE, 'H₂O')}`;
}

/* ---------------------------------------------------------------- the gas cell: more CO₂, less infrared */

/** A gas cell on an infrared beam: source, cell, filter, detector, signal meter. */
export interface CellG { lamp: number; ca: number; cb: number; y: number; hh: number; fx: number; dx: number; dw: number; r: number; inlet: number; outlet: number; meter: boolean; ports: boolean; labels: number | null }
export function cellSvg(p: string, g: CellG): string {
  const { y } = g, I = (k: string): string => `data-k="${p}-${k}"`;
  const mols = [...Array(9)].map((_, i) => molSvg(`${p}-m${i}`, 'c', g.r)).join('');
  const lbl = g.labels === null ? '' : [lab(g.lamp, g.labels, 'infrared source'), lab((g.ca + g.cb) / 2, g.labels, 'gas cell'),
    lab(g.fx + 7, g.labels, 'filter'), lab(g.dx + g.dw / 2, g.labels, 'detector'), g.meter ? lab(g.dx + g.dw + 62, g.labels, 'signal') : ''].join('')
    + lab(g.fx + 7, y - g.hh - 14, '4.26 µm', 'middle', 'cps-sub');
  return `${defs(p)}<linearGradient id="${p}-gr" gradientUnits="userSpaceOnUse" x1="${g.ca}" y1="0" x2="${g.cb}" y2="0">
      <stop offset="0" stop-color="${IR}" stop-opacity="1"/><stop ${I('st')} offset="1" stop-color="${IR}" stop-opacity="1"/></linearGradient>
    <circle cx="${g.lamp}" cy="${y}" r="${g.r * 1.9}" fill="#f4cc4f" stroke="#b8902a" stroke-width="1.6"/>
    <path d="M${g.lamp + g.r * 2.1},${y}H${g.ca}" fill="none" stroke="${IR}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>
    ${g.ports ? flowArrow(p, [g.inlet, y - g.hh - 40], [g.inlet, y - g.hh - 4]) + flowArrow(p, [g.outlet, y - g.hh - 4], [g.outlet, y - g.hh - 40]) : ''}
    <rect x="${g.ca}" y="${y - g.hh}" width="${g.cb - g.ca}" height="${2 * g.hh}" rx="12" fill="#eef3f8" stroke="${INK}" stroke-width="1.8"/>
    <path d="M${g.ca},${y}H${g.cb}" fill="none" stroke="url(#${p}-gr)" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>
    ${mols}
    <path ${I('b1')} d="M${g.cb},${y}H${g.fx}" fill="none" stroke="${IR}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>
    <rect x="${g.fx}" y="${y - g.hh + 6}" width="14" height="${2 * g.hh - 12}" rx="2" fill="${INK}" fill-opacity="0.13" stroke="${INK}" stroke-width="1.4"/>
    <path ${I('b2')} d="M${g.fx + 14},${y}H${g.dx}" fill="none" stroke="${IR}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>
    <rect x="${g.dx}" y="${y - g.hh + 10}" width="${g.dw}" height="${2 * g.hh - 20}" rx="8" fill="#f6f4ec" stroke="${INK}" stroke-width="1.8"/>
    ${g.meter ? `<rect x="${g.dx + g.dw + 50}" y="${y - g.hh}" width="24" height="${2 * g.hh}" rx="3" fill="#fffdf8" stroke="${INK}" stroke-width="1.4"/>
      <rect ${I('bar')} x="${g.dx + g.dw + 52}" y="${y - g.hh + 2}" width="20" height="${2 * g.hh - 4}" fill="${INK}" fill-opacity=".55"/>
      <path d="M${g.dx + g.dw},${y}H${g.dx + g.dw + 46}" stroke="${INK}" stroke-width="1.6"/>` : ''}
    ${lbl}`;
}
/** Drives the gas cell: 3 CO₂ drift with the air from t0; from tIn, 6 more enter at the inlet; the infrared that reaches
 *  the detector follows the CO₂ in the cell (Beer–Lambert, exp(−0.12 n)). */
export function cellCtl(S: Setters, p: string, g: CellG, t0: number, tIn: number, dur: number): (t: number, scene: number) => void {
  const ms = [...Array(9)].map((_, i) => S.q(`${p}-m${i}`));
  const st = S.q(`${p}-st`), b1 = S.q(`${p}-b1`), b2 = S.q(`${p}-b2`), bar = S.q(`${p}-bar`);
  const XA = g.ca + g.r * 3.2, XB = g.cb - g.r * 3.2, L = XB - XA, D = 0.72 * (g.cb - g.ca), fz = g.r * 4;
  const base = [0.15, 0.5, 0.82].map(u => XA + u * L), dy = g.hh * 0.42;
  const yb = [-dy, dy, -dy * 0.3], ye = [0, -dy, dy, -dy * 0.5, dy * 0.6, 0];
  const edge = (x: number): number => Math.max(0, Math.min(1, (x - XA) / fz, (XB - x) / fz));
  return (t, scene) => {
    const u = smoother((t - t0) / dur), off = D * u;
    let n = 3;
    base.forEach((x0, i) => {
      const x = XA + ((((x0 + off - XA) % L) + L) % L);
      place(S, ms[i], [x, g.y + yb[i]], edge(x) * scene);
    });
    ye.forEach((y, j) => {
      const e = tIn + 0.6 * j, fin = tw(t, e, e + 0.9), x = g.inlet + 12 + D * Math.max(0, u - smoother((e - t0) / dur));
      n += fin;
      place(S, ms[3 + j], [x, g.y + y], fin * Math.max(0, Math.min(1, (XB - x) / fz)) * scene);
    });
    const I = Math.exp(-0.12 * n);
    S.set(st, 'stop-opacity', I.toFixed(3)); S.op(b1, I); S.op(b2, I);
    if (bar) {
      const h = (2 * g.hh - 4) * I;
      S.set(bar, 'y', f1(g.y + g.hh - 2 - h)); S.set(bar, 'height', f1(h));
    }
  };
}

/* ---------------------------------------------------------------- r1 geometry */

const P = 'cp9r1';
// beat 0: the photo (1400 × 2252, rows 90–897) in a frame; the sensor head (image px 860, 450) is zoomed to the stage centre
const FR = { x: 210, y: 20, w: 1180, h: 680 }, IS = FR.w / 1400, IY = FR.y - 90 * IS;
const img = (u: number, v: number): V => [FR.x + u * IS, IY + v * IS];
const HEAD = img(860, 450), CEN: V = [800, 370], Z = 2.4;
const H0 = 2.0, Z0 = H0 + 0.2, ZD = 2.6;
// the LI-6800 manual's head drawing (662 × 213), 1440 wide, centred on CEN
const LW = 1440, LH = LW * 213 / 662;
// beat 1: the spectra (the slide's figure, its upper part) and the gas cell
const H1 = 2.0, FIG: V = [380, 6];
const CELL: CellG = { lamp: 250, ca: 340, cb: 1060, y: 600, hh: 40, fx: 1100, dx: 1170, dw: 70, r: 11, inlet: 390, outlet: 1010, meter: true, ports: true, labels: 690 };
// beat 2: supply, reference analyser (top), leaf chamber and sample analyser (bottom)
const H2 = 10.2;
const RY = 140, SY = 470, BX = 760, BW = 480, BH = 150;
const SUP: V = [232, 370];
const REF_PATH: V[] = [SUP, [320, 370], [320, RY + 75], [BX, RY + 75]];
const CH = { x: 420, y: SY - 5, w: 220, h: 150 }, LEAF_Y = 582;
const SAMP_IN: V[] = [SUP, [320, 370], [320, SY + 75], [CH.x, SY + 75], [CH.x + 30, SY + 48]];
const SAMP_PATH: V[] = [...SAMP_IN, [CH.x + CH.w - 30, SY + 48], [CH.x + CH.w, SY + 75], [BX, SY + 75]];
const gridAt = (y0: number) => (kind: 'c' | 'h', j: number): V => slot(kind, j, BX + 46, BX + 330, y0 + 44, 42);
const MOLS = buildMols(P, {
  ref: REF_PATH, refSlots: gridAt(RY), refT0: 1.8, samp: SAMP_PATH, sampSlots: gridAt(SY), sampT0: H2 + 0.3,
  toLeaf: j => [...SAMP_IN, [500 + 66 * j, SY + 48], [500 + 66 * j, LEAF_Y - 24]],
  fromLeaf: j => [[480 + 108 * j, LEAF_Y - 20], [480 + 108 * j, SY + 48], [CH.x + CH.w - 30, SY + 48], [CH.x + CH.w, SY + 75], [BX, SY + 75]],
  gap: 0.25, dRef: 3.6, dSamp: 4.4, dLeaf: 2.4, dOut: 3.0,
});
const TEND = [Z0 + ZD + 0.1, 11.8, 19.6, 2.6];


export const STAGING: Staging = {
  id: 'r1',
  name: 'r1 · the real LI-6800, zoom inside, then reference against sample',
  note: 'An LI-6800 on a maize leaf, one zoom into its head onto the manual’s head drawing; the NIST spectra and a gas cell; counted CO₂ and H₂O in reference and sample; the 2 formulas.',
  beats: BEATS,
  holds: [[H0], [H1], [H2], []],
  keys: [],
  svg: () => `${defs(P)}
    <g data-k="ph" opacity="0">
      <clipPath id="${P}-fr"><rect x="${FR.x}" y="${FR.y}" width="${FR.w}" height="${FR.h}" rx="14"/></clipPath>
      <rect x="${FR.x}" y="${FR.y}" width="${FR.w}" height="${FR.h}" rx="14" fill="#fffdf8" filter="url(#${P}-sh)"/>
      <g clip-path="url(#${P}-fr)"><g data-k="cam"><image href="${photoJpg}" x="${f1(FR.x)}" y="${f1(IY)}" width="${f1(1400 * IS)}" height="${f1(2252 * IS)}" preserveAspectRatio="none"/></g></g>
      <rect x="${FR.x}" y="${FR.y}" width="${FR.w}" height="${FR.h}" rx="14" fill="none" stroke="#d3cfc3" stroke-width="1.2"/>
      <g data-k="labs" opacity="0">
        <path d="M1090,250 L${f1(img(905, 400)[0])},${f1(img(905, 400)[1])}" stroke="${INK}" stroke-width="1.8"/><circle cx="${f1(img(905, 400)[0])}" cy="${f1(img(905, 400)[1])}" r="4.5" fill="${INK}" stroke="#fffdf8" stroke-width="1.5"/>
        ${stagePill(`${P}-pl`, 1182, 250, 'leaf chamber', 'paper', 1)}
        <path d="M692,470 L${f1(img(760, 560)[0])},${f1(img(760, 560)[1])}" stroke="${INK}" stroke-width="1.8"/><circle cx="${f1(img(760, 560)[0])}" cy="${f1(img(760, 560)[1])}" r="4.5" fill="${INK}" stroke="#fffdf8" stroke-width="1.5"/>
        ${stagePill(`${P}-pa`, 620, 470, 'analysers', 'paper', 1)}
      </g>
      ${lab(FR.x + FR.w, FR.y + FR.h + 18, 'Photo: Viséan (LI-6800, University of Illinois), Wikimedia Commons, CC BY-SA 4.0', 'end', 'cps-credit')}
    </g>
    <g data-k="lc" opacity="0" display="none">
      <rect x="${f1(CEN[0] - LW / 2 - 16)}" y="${f1(CEN[1] - LH / 2 - 16)}" width="${LW + 32}" height="${f1(LH + 32)}" rx="16" fill="#fffdf8" stroke="#d3cfc3" stroke-width="1.2" filter="url(#${P}-sh)"/>
      <image href="${licorPng}" x="${f1(CEN[0] - LW / 2)}" y="${f1(CEN[1] - LH / 2)}" width="${LW}" height="${f1(LH)}" preserveAspectRatio="none"/>
      ${lab(CEN[0] + LW / 2 + 16, CEN[1] + LH / 2 + 40, 'LI-6800 sensor head, leaf-chamber configuration: LI-COR LI-6800 manual · © LI-COR, in-class use only', 'end', 'cps-credit')}
    </g>
    <g data-k="ir" opacity="0" display="none">
      <g transform="translate(${FIG[0]} ${FIG[1]})"><clipPath id="${P}-irc"><rect x="0" y="0" width="800" height="445"/></clipPath>
        <g class="fig" clip-path="url(#${P}-irc)">${figInner(irFig(), 'cp09ir', `${P}ir`)}</g></g>
      ${lab(FIG[0] + 790, FIG[1] + 466, 'spectra: NIST Chemistry WebBook (Sadtler/EPA) · filter wavelengths: LI-COR LI-840A manual', 'end', 'cps-credit')}
    </g>
    <g data-k="cell" opacity="0" display="none">${cellSvg(`${P}c`, CELL)}</g>
    <g data-k="flow" opacity="0" display="none">
      ${pipe(REF_PATH)}${pipe(SAMP_PATH.filter((_, i) => i !== 4 && i !== 5))}
      ${box(60, 310, 172, 120, '#f6f4ec')}${lab(146, 462, 'air supply')}
      ${box(BX, RY, BW, BH)}${lab(BX + BW / 2, RY - 16, 'reference analyser')}
      ${box(CH.x, CH.y, CH.w, CH.h, '#f6f4ec')}${leafSvg(CH.x + 22, CH.x + CH.w - 22, LEAF_Y)}${lab(CH.x + CH.w / 2, CH.y + CH.h + 30, 'leaf chamber')}
      ${box(BX, SY, BW, BH)}${lab(BX + BW / 2, SY + BH + 30, 'sample analyser')}
      ${flowArrow(P, [BX + BW, RY + 75], [BX + BW + 80, RY + 75])}${flowArrow(P, [BX + BW, SY + 75], [BX + BW + 80, SY + 75])}
      ${lab(BX + 158, RY + 132, '10 CO₂', 'middle', 'cps-lab', `${P}-n1`)}${lab(BX + 390, RY + 132, '5 H₂O', 'middle', 'cps-lab', `${P}-n2`)}
      ${lab(BX + 158, SY + 132, '8 CO₂', 'middle', 'cps-lab', `${P}-n3`)}${lab(BX + 390, SY + 132, '7 H₂O', 'middle', 'cps-lab', `${P}-n4`)}
      ${MOLS.map(m => molSvg(m.k, m.kind)).join('')}
    </g>
    ${formulaSvg(`${P}-fa`, 440, 362, FORMULA_A)}${formulaSvg(`${P}-fe`, 440, 418, FORMULA_E)}`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const cell = cellCtl(S, `${P}c`, CELL, H1 + 1.2, H1 + 2.4, 8.4);
    const mols = molCtl(S, MOLS);
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(3, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const T = beatClock(b, tt), t0 = T(0), t1 = T(1), t2 = T(2), t3 = T(3);

      // beat 0: the photo, its labels, then one zoom into the head that cross-fades into the schematic
      const e = mv(t0, Z0, ZD), k = Z ** e, c = lerpV(HEAD, CEN, e);
      set(q('cam'), 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${f1(c[0] - k * HEAD[0])},${f1(c[1] - k * HEAD[1])})`);
      op(q('ph'), tw(t0, 0, 1.0) * (1 - tw(t0, Z0 + 1.4, Z0 + 2.6)));
      op(q('labs'), tw(t0, 1.0, 1.8) * (1 - tw(t0, Z0, Z0 + 0.8)));
      const s2 = Z ** (e - 1);
      set(q('lc'), 'transform', `matrix(${s2.toFixed(4)},0,0,${s2.toFixed(4)},${f1(c[0] - s2 * CEN[0])},${f1(c[1] - s2 * CEN[1])})`);
      op(q('lc'), tw(t0, Z0 + 1.1, Z0 + 2.3) * (1 - tw(t1, 0, 1.0)));

      // beat 1: the spectra, then the gas cell
      const irOut = 1 - tw(t2, 0, 1.0);
      op(q('ir'), tw(t1, 0.6, 1.6) * irOut);
      const cs = tw(t1, H1 + 0.2, H1 + 1.2) * irOut;
      op(q('cell'), cs);
      cell(t1, 1);

      // beat 2: the counted molecules; beat 3: the formulas
      const fl = tw(t2, 0.6, 1.6);
      op(q('flow'), fl);
      mols(t2, 1);
      op(q(`${P}-n1`), tw(t2, 8.9, 9.8)); op(q(`${P}-n2`), tw(t2, 8.9, 9.8));
      op(q(`${P}-n3`), tw(t2, 18.4, 19.4)); op(q(`${P}-n4`), tw(t2, 18.4, 19.4));
      op(q(`${P}-fa`), tw(t3, 0.4, 1.4)); op(q(`${P}-fe`), tw(t3, 1.4, 2.4));
    };
  },
};
