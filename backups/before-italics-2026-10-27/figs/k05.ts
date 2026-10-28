// Slide C5 · Rubisco also reacts with O₂ (lecture 2 redo, 27 Oct 2026; research/redo-2026-10-27/C_CYCLE_RUBISCO.md).
// Real figures: Lyons et al. 2014 Nature Fig. 1 (atmospheric O₂ over 4 billion years; © Springer Nature, lecture use with
// credit; axes redrawn over the plot for legibility) and Schulz et al. 2022 Science Fig. 2A–B (ancestral form I Rubisco
// without (L₈, AncL) and with small subunits (L₈S₈, AncLS/AncSSU); © 2022 the authors, AAAS; classroom use with credit).
// Data redrawn: Flamholz et al. 2019 Fig. 5A from the paper's Data Set S2 (github.com/flamholz/rubisco), one point per
// species (median of its measurements), ACS AuthorChoice (non-commercial adaptation allowed). The published panel is only
// 694 px wide, too coarse to project. Drawn: carboxylation and oxygenation at one active site, after Flamholz 2019 Fig. 1A.
// Numbers: S_C/O 21.9 (AncL) and 47.3 (AncLS + AncSSU), Schulz 2022 Table 1; median S_C/O of C₃ plants 98, Flamholz 2019;
// spinach in air R_C ≈ 1.2, R_O ≈ 0.4 s⁻¹ (≈ 3 : 1), research file C5. Crops and credits: assets/SOURCES-L2a.md.
import type { PlateText, Variant } from '../types';
import lyJpg from '../../assets/photos/c5-lyons.jpg';
import schulzJpg from '../../assets/photos/c5-schulz.jpg';
import './k05.css';

export const PLATE: PlateText = {
  n: 'C5',
  title: 'Rubisco oxygenation',
  status: 'draft',
  lead: 'Rubisco also reacts with O₂; oxygenation produces 2-phosphoglycolate, which the cycle cannot use.',
  points: [
    { claim: 'Two substrates.', text: 'CO₂ and O₂ compete for the same active site<br>In air at 25 °C, about one oxygenation per three carboxylations' },
    { claim: 'Temperature.', text: 'In warm leaves, oxygenation rises relative to carboxylation' },
    { claim: 'Evolutionary origin.', text: 'Rubisco evolved when the air contained almost no O₂<br>O₂ released by photosynthesis later made oxygenation unavoidable' },
  ],
  refs: [
    { label: 'Lyons et al. 2014', url: 'https://doi.org/10.1038/nature13068' },
    { label: 'Schulz et al. 2022', url: 'https://doi.org/10.1126/science.abq1416' },
    { label: 'Flamholz et al. 2019', url: 'https://doi.org/10.1021/acs.biochem.9b00237' },
    { label: 'Jordan & Ogren 1984', url: 'https://doi.org/10.1007/BF00398720' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'O₂ through Earth history and the ancestral Rubiscos' },
  { id: 'b', name: 'Carboxylation rate vs CO₂/O₂ specificity, ≈ 200 Rubiscos' },
  { id: 'c', name: 'Small subunits raised specificity: 21.9 → 47.3' },
  { id: 'd', name: 'Carboxylation and oxygenation at one active site (drawn)' },
  { id: 'e', name: 'O₂ through Earth history and the two reactions' },
  { id: 'f', name: 'O₂ through Earth history and carboxylation rate vs specificity' },
];

/* ---------- shared parts (the 4b u–z helpers, copied into this module with the prefix fk05) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
type Box = [number, number, number, number];
type Ink = 'ink' | 'grey' | 'green' | 'blue' | 'amber' | 'red';
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fk05-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** An italic variable such as A or k. */
const it = (s: string): string => `<tspan class="fk05-it">${s}</tspan>`;
const cw = (c: Ink | 'paper', s: string): string => `<tspan class="fk05-c-${c}">${s}</tspan>`;

interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number; s: number }
/** A real image: the window win = [u0, v0, width, height] of it (image pixels) shown w wide at x, y, its height following
 *  (never stretched). A published figure ('fig') multiplies its white ground into the page; a micrograph keeps its own
 *  ground in a frame with rounded corners. `holes` = [u0, v0, u1, v1] boxes left out of the crop (panel letters).
 *  at() maps image pixels to the figure. */
function shot(id: string, im: Img, x: number, y: number, w: number, o: { win?: Box; fig?: boolean; holes?: Box[] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s, r = o.fig ? 0 : 8;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  const hl = (o.holes ?? []).map(([a, b, c, d]) => ` M${f(ox + a * s)},${f(oy + b * s)} H${f(ox + c * s)} V${f(oy + d * s)} H${f(ox + a * s)}Z`).join('');
  const outer = `M${f(x + r)},${f(y)} H${f(x + w - r)} Q${f(x + w)},${f(y)} ${f(x + w)},${f(y + r)} V${f(y + h - r)} Q${f(x + w)},${f(y + h)} ${f(x + w - r)},${f(y + h)} H${f(x + r)} Q${f(x)},${f(y + h)} ${f(x)},${f(y + h - r)} V${f(y + r)} Q${f(x)},${f(y)} ${f(x + r)},${f(y)}Z`;
  const clip = `<clipPath id="${id}"><path clip-rule="evenodd" d="${outer}${hl}"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fk05-mult"' : ''}>${img}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h, s };
}

/** A leader onto a real image: dark line in a light halo, ending in a dot, so it reads on dark and light ground alike. */
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fk05-ldh" d="${d}"/><path class="fk05-ldk" d="${d}"/><circle class="fk05-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
/** Width of a label pill: the visible characters only (markup such as <tspan> is not counted). */
const pw = (s: string): number => s.replace(/<[^>]+>/g, '').length * 8.7 + 22;
/** A label pill centred at (x, y): white on images, tinted (tint) on the white ground of a figure; with `to`, one leader
 *  (or several) from its edge to the point(s). */
function pill(x: number, y: number, s: string, to?: Pt | Pt[], tint = false): string {
  const w = pw(s), tos: Pt[] = to === undefined ? [] : typeof to[0] === 'number' ? [to as Pt] : (to as Pt[]);
  const ld = tos.map(p => {
    const dx = p[0] - x, dy = p[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    return pleader([x + dx * t, y + dy * t], p);
  }).join('');
  return `${ld}<rect class="${tint ? 'fk05-pillbg-t' : 'fk05-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>${T(x, y + 6, s, 'fk05-pill', 'middle')}`;
}
/** Grey credit line under a published figure; '|' breaks it onto a second line. */
const credit = (x: number, y: number, s: string, a: A = 'end'): string => s.split('|').map((l, i) => T(x, y + i * 17, l.trim(), 'fk05-crd', a)).join('');

/** Arrowheads in each ink, prefixed per figure (ids must be unique when the gallery shows every variant at once). */
const defs = (p: string): string => `<defs>${(['ink', 'grey', 'green', 'blue', 'amber', 'red'] as Ink[]).map(k =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse"><path class="fk05-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
const ar = (p: string, k: Ink, d: string, cls = ''): string =>
  `<path class="fk05-ar fk05-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;
/** A plain box with a label (and an optional second line), centred at (x, y). */
function node(x: number, y: number, s: string, o: { w?: number; sub?: string; cls?: string; tint?: boolean } = {}): string {
  const w = o.w ?? Math.max(s.replace(/<[^>]+>/g, '').length * 11.6 + 26, o.sub ? o.sub.replace(/<[^>]+>/g, '').length * 9.4 + 26 : 0);
  const h = o.sub ? 60 : 40;
  return `<rect class="${o.tint ? 'fk05-box-t' : 'fk05-box'}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="9"/>`
    + (o.sub ? `${T(x, y - 4, s, o.cls ?? 'fk05-node', 'middle')}${T(x, y + 19, o.sub, 'fk05-s', 'middle')}` : T(x, y + 7.5, s, o.cls ?? 'fk05-node', 'middle'));
}
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fk05" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

/* ---------- C5 parts ---------- */

/** Flamholz et al. 2019, Data Set S2: one point per species, "<group><S_C/O>,<k_cat,C in s⁻¹>". Groups as in their Fig. 5A:
 *  p C₃ plants, q C₄ plants, c cyanobacteria, r red algae, f form II, o other form I. */
const FL = 'c42.8,11.4 c44.1,14.4 c46.3,7.2 c47,6.6 c49,12.5 c55,9.6 c59.9,6.58 c82.1,2.65 f11.8,7.3 f13.3,3.5 o41,6.7 o42.7,1.9 o57,2.6 o61,5.8 o62,5.2 o75,3.4 o77,3.5 o77.9,3.8 o78.1,3.43 o78.7,3.78 o79,3.2 o79,3.7 o79.8,2.77 o80,2.4 o81.6,3.35 o83.8,2.58 o83.8,3.54 o84.3,2.69 o84.4,3.02 o86.8,2.81 o89,2.2 o96,2.4 o100,0.83 o102,3.3 o106.5,0.88 o108,3.2 o111,1.95 o113,3.4 o116,3.3 o125,2.5 p78.7,2.91 p81,3.11 p82,3.6 p82.6,3.35 p84.5,3.2 p84.6,3.04 p86.3,1.7 p87.7,2.6 p89.5,2 p90.4,3.25 p90.9,3.57 p91.1,5.3 p91.4,2.3 p91.5,3.23 p91.6,2.2 p92.3,2.2 p92.4,2.3 p92.8,3.4 p92.9,3.64 p93.1,2.1 p93.1,2.7 p93.6,2.8 p93.8,3.26 p93.8,3.55 p93.9,2.8 p94,2.2 p94.1,3.55 p94.3,4.4 p95.2,3.36 p95.2,3.36 p95.4,2 p95.7,3.4 p95.9,3.6 p96,1.9 p96,3.8 p96.2,2.1 p96.2,3.33 p96.3,3.2 p96.4,3.6 p96.4,4.4 p96.8,1.9 p96.8,3.46 p97.1,2.6 p97.5,3 p97.5,4 p97.8,2.2 p97.8,3.8 p97.8,4.1 p98.4,2.2 p98.5,2.5 p98.5,2.5 p98.5,4.4 p98.7,2.1 p98.7,3.3 p99.2,2.4 p99.7,3.62 p99.7,4.5 p99.8,3.58 p99.9,2.3 p99.9,3.1 p99.9,4.5 p100,2.5 p100,3.57 p100,4.2 p100,4.7 p101,2 p101,2.2 p101,2.7 p101,2.9 p101,2.9 p101,3.2 p101,3.4 p101,3.48 p101,4.4 p102,2.7 p102,3.24 p102,3.43 p102,3.99 p102,5.2 p102.3,2.6 p103,1.9 p103,2.2 p103,2.62 p103,3.6 p103,3.6 p104,3.18 p104,3.9 p104,4.1 p104,5.4 p105,2.7 p105,3.3 p105,3.5 p105,3.9 p105,4 p105,5.2 p105,5.8 p106,2.8 p106,2.86 p106,3.3 p106,3.4 p106,3.9 p106,5.1 p106,5.4 p107,2.5 p107,2.5 p107,2.5 p107,2.6 p107,2.7 p107,2.86 p108,2.2 p108,4.5 p108,5.1 p108.5,2.6 p109,2.4 p109,2.7 p109,3.1 p109,3.32 p109,3.68 p109,4.4 p110,2.8 p110,3.1 p111,2.05 p111,2.5 p111,3.2 p111,3.3 p112,2.4 p112,2.4 p112,3.3 p112,4.2 p113,2.9 p113,3 p116,2 p121,2.1 p121,2.4 q69.9,6 q70,5.4 q72.7,5.67 q74.5,3.9 q77,3.68 q77.2,3.84 q77.5,4.14 q77.7,3.85 q78,4.22 q78,5.9 q78.3,5.6 q79.4,5.3 q79.9,2.1 q80,4.16 q80.3,5.3 q82,3.8 q82.2,3.9 q82.4,4.7 q82.5,5.7 q82.6,3.3 q84.8,3.4 q84.8,5 q87.3,4.1 q89,7.1 q89.5,3.2 q92.6,3.1 q107,2.8 r129,1.59 r144,1.4 r166,1.2 r167,2.6 r225,1.3 r238,1.6';
type G = 'p' | 'q' | 'c' | 'r' | 'f' | 'o';
const PTS = FL.split(' ').map(t => { const [s, k] = t.slice(1).split(',').map(Number); return { g: t[0] as G, s, k }; });
const SCO = `${it('S')}<tspan baseline-shift="sub" font-size="72%">C/O</tspan>`;
const KCAT = `${it('k')}<tspan baseline-shift="sub" font-size="72%">cat,C</tspan>`;
const dot = (g: G): string => `<tspan class="fk05-g-${g}">●</tspan>`;

/* Lyons et al. 2014, Fig. 1: ticks found in the file. Age 4.0 → u 125, 0 → u 1490.5 (341.4 px per Gyr); right axis
 * (present atmospheric level, PAL) 10⁰ → v 47.5, 43.9 px per decade. The window keeps the plot inside its frame. */
const LY: Img = { href: lyJpg, w: 1606, h: 408 };
const LYW: Box = [127, 6, 1361, 301];
const lu = (age: number): number => 1490.5 - 341.4 * age;
const lv = (lg: number): number => 47.5 - 43.9 * lg;
/* Schulz et al. 2022, Fig. 2A–B, downscaled to 1000 px: left the ancestor with large subunits only (AncL, L₈), right the
 * later ancestor with small subunits (AncLS + AncSSU, L₈S₈; small subunits beige); side views above, top views below. */
const SCH: Img = { href: schulzJpg, w: 1000, h: 897 };
const SCH_SSU: Pt = [866, 690], SCH_L: Pt = [249, 232], SCH_LS: Pt = [772, 232];
/** The top views alone, below the printed 90° rotation sign. */
const SCH_TOP: Box = [0, 495, 1000, 402];
const CR = {
  lyons: 'Lyons et al. 2014, Nature, Fig. 1 · © Springer Nature',
  schulz: 'Schulz et al. 2022, Science, Fig. 2A, B · © 2022 the authors (AAAS)',
  flam: 'data: Flamholz et al. 2019, Biochemistry, Data Set S2 (Fig. 5A redrawn) · ACS AuthorChoice',
  flam1: 'after Flamholz et al. 2019, Biochemistry, Fig. 1A',
};

interface Part { svg: string; h: number }
/** Lyons Fig. 1 as a strip w wide at (x, y), with redrawn axes, the Great Oxidation Event and today's level named. */
function lyons(p: string, x: number, y: number, w: number): Part & { X: (a: number) => number } {
  const a = shot(`${p}-ly`, LY, x, y + 22, w, { fig: true, win: LYW });
  const X = (age: number): number => a.at(lu(age), 0)[0], Y = (lg: number): number => a.at(0, lv(lg))[1];
  const x0 = X(4), x1 = X(0), y0 = Y(-5.98), y1 = Y(1);
  return {
    X, h: a.h + 22 + 52,
    svg: `${a.svg}
    <path class="fk05-axis" d="M${f(x0)},${f(y1)} V${f(y0)} H${f(x1)}"/>
    ${[4, 3, 2, 1, 0].map(t => `<path class="fk05-axis" d="M${f(X(t))},${f(y0)} v6"/>${T(X(t), y0 + 24, `${t}`, 'fk05-tk', 'middle')}`).join('')}
    ${T(x1, y0 + 46, 'billion years ago', 'fk05-ax', 'end')}
    ${([[0, '1'], [-2, '10⁻²'], [-4, '10⁻⁴']] as [number, string][]).map(([lg, s]) => `<path class="fk05-axis" d="M${f(x0)},${f(Y(lg))} h-6"/>${T(x0 - 10, Y(lg) + 6, s, 'fk05-tk', 'end')}`).join('')}
    ${T(x0 - 50, y + 12, 'O₂ relative to today', 'fk05-ax')}
    ${pill(X(1.3), Y(-5.1), 'Great Oxidation Event ≈ 2.4 Ga', [X(2.33), Y(-3.4)], true)}
    ${pill(X(0.62), y + 8, 'today: 21 % O₂', [X(0.06), Y(-0.05)], true)}`,
  };
}

/** Flamholz 2019 Fig. 5A redrawn from the data: k_cat,C against S_C/O on log axes, groups named at their clusters. */
function scatter(p: string, x0: number, y0: number, x1: number, y1: number, small = false): string {
  const L = Math.log10, sx = (s: number): number => x0 + ((L(s) - L(8)) / (L(300) - L(8))) * (x1 - x0);
  const ky = (k: number): number => y1 - ((L(k) - L(0.6)) / (L(20) - L(0.6))) * (y1 - y0);
  const order: G[] = ['o', 'q', 'p', 'c', 'r', 'f'], r = small ? 4.2 : 5.2;
  const dots = order.map(g => PTS.filter(q => q.g === g).map(q => `<circle class="fk05-pt fk05-g-${g}" cx="${f(sx(q.s))}" cy="${f(ky(q.k))}" r="${r}"/>`).join('')).join('');
  const tk = small ? 'fk05-tks' : 'fk05-tk';
  return `${dots}
    <path class="fk05-axis" d="M${x0},${y0} V${y1} H${x1}"/>
    ${[10, 30, 100, 300].map(s => `<path class="fk05-axis" d="M${f(sx(s))},${y1} v6"/>${T(sx(s), y1 + 24, `${s}`, tk, 'middle')}`).join('')}
    ${[1, 3, 10].map(k => `<path class="fk05-axis" d="M${x0},${f(ky(k))} h-6"/>${T(x0 - 10, ky(k) + 6, `${k}`, tk, 'end')}`).join('')}
    ${T(x1, y1 + (small ? 46 : 50), `CO₂/O₂ specificity ${SCO}`, small ? 'fk05-l' : 'fk05-ax', 'end')}
    ${T(x0 - 8, y0 - 16, `carboxylation rate ${KCAT} (s⁻¹)`, small ? 'fk05-l' : 'fk05-ax')}
    ${pill(sx(150), ky(9.5), `${dot('p')} C₃ plants: ${SCO} ≈ 98`, [sx(99.8), ky(3.58)], true)}
    ${pill(sx(36), ky(1.35), `${dot('q')} C₄ plants`, [sx(77.7), ky(3.84)], true)}
    ${pill(sx(22), ky(16), `${dot('c')} cyanobacteria`, [sx(44.1), ky(14.4)], true)}
    ${pill(sx(205), ky(0.8), `${dot('r')} red algae`, [sx(166), ky(1.2)], true)}
    ${pill(sx(13.5), ky(2.2), `${dot('f')} form II`, [sx(13.3), ky(3.5)], true)}`;
}

/** The two ancestral Rubiscos (Schulz 2022, Fig. 2A, B) w wide at (x, y), named, with their specificities. */
function ancestors(p: string, x: number, y: number, w: number, topOnly = false): Part {
  const a = shot(`${p}-sc`, SCH, x, y + 30, w, { fig: true, win: topOnly ? SCH_TOP : undefined });
  const xl = a.at(...SCH_L)[0], xr = a.at(...SCH_LS)[0], yb = y + 30 + a.h;
  return {
    h: a.h + 30 + 64,
    svg: `${a.svg}
    ${pill(xl, y + 6, 'ancestor: L₈', undefined, true)}${pill(xr, y + 6, 'later ancestor: L₈S₈', undefined, true)}
    ${pill(x + w + 4, yb - 40, 'small subunit', a.at(...SCH_SSU), true)}
    ${T(xl, yb + 30, `${SCO} 21.9`, 'fk05-h', 'middle')}${T(xr, yb + 30, `${SCO} 47.3`, 'fk05-h', 'middle')}`,
  };
}

/** Carbon boxes: n squares of side d from x (top y), in a style class. */
const boxes = (x: number, y: number, n: number, d: number, cls: string): string =>
  Array.from({ length: n }, (_, i) => `<rect class="${cls}" x="${f(x + i * (d + 4))}" y="${f(y)}" width="${d}" height="${d}" rx="3.5"/>`).join('');
/** One row: RuBP + gas → products, as carbon boxes. gas 'co2' gives 3-PGA + 3-PGA; 'o2' gives 3-PGA + 2-PG. */
function row(p: string, x: number, y: number, gas: 'co2' | 'o2', d: number): { svg: string; end: number; pg2: Pt } {
  const w = (n: number): number => n * d + (n - 1) * 4, pl = 32;
  let cx = x;
  const rubp = cx; cx += w(5) + pl;
  const gx = cx; cx += d + 12;
  const a0 = cx; cx += 94;
  const p1 = cx; cx += w(3) + pl;
  const p2 = cx; cx += w(gas === 'co2' ? 3 : 2);
  const lab = (x0: number, n: number, s: string, cls = 'fk05-node'): string => T(x0 + w(n) / 2, y + d + 26, s, cls, 'middle');
  const plus = (x0: number): string => T(x0 - pl / 2, y + d / 2 + 8, '+', 'fk05-big', 'middle');
  const g = gas === 'co2'
    ? `${boxes(gx, y, 1, d, 'fk05-cco2')}${lab(gx, 1, 'CO₂')}`
    : `<circle class="fk05-o2" cx="${f(gx + d / 2)}" cy="${f(y + d / 2)}" r="${f(d / 2 + 2)}"/>${T(gx + d / 2, y + d / 2 + 6, 'O₂', 'fk05-o2t', 'middle')}`;
  return {
    end: cx, pg2: [p2 + w(2) / 2, y + d + 34],
    svg: `${boxes(rubp, y, 5, d, 'fk05-c')}${lab(rubp, 5, 'RuBP')}${plus(gx)}${g}
    ${ar(p, gas === 'co2' ? 'green' : 'red', `M${f(a0)},${f(y + d / 2)} L${f(a0 + 78)},${f(y + d / 2)}`)}${T(a0 + 39, y + d / 2 - 12, 'Rubisco', 'fk05-s', 'middle')}
    ${gas === 'co2' ? `${boxes(p1, y, 1, d, 'fk05-cn')}${boxes(p1 + d + 4, y, 2, d, 'fk05-c')}` : boxes(p1, y, 3, d, 'fk05-c')}${lab(p1, 3, '3-PGA')}${plus(p2)}
    ${gas === 'co2' ? `${boxes(p2, y, 3, d, 'fk05-c')}${lab(p2, 3, '3-PGA')}` : `${boxes(p2, y, 2, d, 'fk05-c2pg')}${lab(p2, 2, '2-PG', 'fk05-node fk05-c-red')}`}`,
  };
}
/** Both reactions of the one active site, with the rate ratio in air and the way on to photorespiration. */
function reactions(p: string, y1: number, y2: number, d: number, notes = true): string {
  const x = 178, r1 = row(p, x, y1, 'co2', d), r2 = row(p, x, y2, 'o2', d);
  const [px, py] = r2.pg2;
  return `${T(x - 22, y1 + d / 2 + 7, 'carboxylation', 'fk05-h fk05-c-green', 'end')}${T(x - 22, y2 + d / 2 + 7, 'oxygenation', 'fk05-h fk05-c-red', 'end')}
    ${r1.svg}${r2.svg}
    ${ar(p, 'red', `M${f(px)},${f(py)} L${f(px)},${f(py + 34)}`, 'fk05-thin')}${pill(px, py + 52, 'photorespiration (next)', undefined, true)}
    ${notes ? `${T(24, py + 50, 'air: 0.04 % CO₂, 21 % O₂', 'fk05-l')}${T(24, py + 78, '25 °C: ≈ 3 carboxylations', 'fk05-l')}${T(24, py + 104, 'per oxygenation', 'fk05-l')}` : ''}`;
}

/* ---------- a · O₂ through Earth history above the two ancestral Rubiscos ---------- */

function drawA(): string {
  const p = 'fk05a', ly = lyons(p, 96, 4, 684), ys = 4 + ly.h + 14, s = ancestors(p, 120, ys, 470, true);
  return svg(p, 'Top: atmospheric oxygen over the last 4 billion years, relative to today, on a log scale. It stayed below a millionth of today until the Great Oxidation Event about 2.4 billion years ago, then rose; it reached today’s 21 percent only in the last half billion years. Below: two resurrected ancestral Rubiscos. The older one has eight large subunits only and a CO2/O2 specificity of 21.9; the later one also binds eight small subunits and reaches 47.3, and this happened before oxygen was in the air.', `
    ${ly.svg}${s.svg}
    ${T(612, ys + 120, 'small subunits gained', 'fk05-l')}${T(612, ys + 146, 'before O₂ rose', 'fk05-l')}
    ${credit(784, 572, CR.lyons)}${credit(784, 589, CR.schulz)}
  `);
}

/* ---------- b · carboxylation rate vs specificity across ≈ 200 Rubiscos (Flamholz 2019, redrawn from the data) ---------- */

function drawB(): string {
  const p = 'fk05b';
  return svg(p, 'Carboxylation rate against CO2/O2 specificity for about 200 Rubiscos, one point per species, on log axes. C3 plants form a tight cluster at a specificity of about 98 and about 3 carboxylations per second; C4 plants sit slightly lower in specificity and faster; cyanobacteria are faster still and less specific; red algae are the most specific and slow; the bacterial form II Rubiscos have a specificity near 12.', `
    ${scatter(p, 120, 50, 770, 506)}
    ${credit(784, 592, CR.flam)}
  `);
}

/* ---------- c · the ancestral Rubiscos with specificity bars up to today's C₃ plants ---------- */

function drawC(): string {
  const p = 'fk05c', s = ancestors(p, 20, 40, 430);
  const xb = 560, yb = 470, k = 3.2, bw = 54;
  const bar = (i: number, v: number, cls: string, lab: string, sub: string): string => {
    const x = xb + i * 76;
    return `<rect class="${cls}" x="${x}" y="${f(yb - v * k)}" width="${bw}" height="${f(v * k)}"/>${T(x + bw / 2, yb - v * k - 10, `${v}`, 'fk05-h', 'middle')}${T(x + bw / 2, yb + 26, lab, 'fk05-s', 'middle')}${T(x + bw / 2, yb + 46, sub, 'fk05-s', 'middle')}`;
  };
  return svg(p, 'Left: two resurrected ancestral form I Rubiscos: the older one with eight large subunits only (L8), the later one with eight small subunits added (L8S8). Right: their CO2/O2 specificity, 21.9 and 47.3, beside the median of today’s C3 plants, 98.', `
    ${s.svg}
    ${T(xb - 6, 92, `CO₂/O₂ specificity ${SCO}`, 'fk05-h')}
    <path class="fk05-axis" d="M${xb - 14},${yb} H${xb + 2 * 76 + bw + 10}"/>
    ${bar(0, 21.9, 'fk05-bar-l', 'L₈', 'ancestor')}${bar(1, 47.3, 'fk05-bar-ls', 'L₈S₈', 'ancestor')}${bar(2, 98, 'fk05-bar-p', 'C₃ plants', 'today')}
    ${credit(784, 572, CR.schulz)}${credit(784, 589, 'C₃ plants: median of Flamholz et al. 2019')}
  `);
}

/* ---------- d · drawn: one active site, two gases ---------- */

function drawD(): string {
  const p = 'fk05d';
  return svg(p, 'Drawn as carbon boxes. Spinach Rubisco specificity falls from about 160 at 5 degrees to about 50 at 40 degrees. Carboxylation: Rubisco adds CO2 to ribulose-1,5-bisphosphate (RuBP, five carbons), giving two 3-phosphoglycerate (3-PGA), which the Calvin-Benson cycle uses. Oxygenation: at the same active site Rubisco adds O2 instead, giving one 3-PGA and one 2-phosphoglycolate (2-PG, two carbons), which the cycle cannot use; it is recycled by photorespiration. In air, 0.04 percent CO2 and 21 percent O2, a C3 Rubisco at 25 degrees carboxylates about three times for each oxygenation.', `
    ${reactions(p, 110, 290, 34)}
    ${T(784, 494, `spinach ${SCO}: ≈ 160 at 5 °C`, 'fk05-l', 'end')}${T(784, 520, '≈ 50 at 40 °C', 'fk05-l', 'end')}
    ${credit(784, 592, `${CR.flam1}; ${SCO} after Jordan & Ogren 1984`)}
  `);
}

/* ---------- e · O₂ history above the two reactions ---------- */

function drawE(): string {
  const p = 'fk05e', ly = lyons(p, 96, 4, 684);
  return svg(p, 'Top: atmospheric oxygen over 4 billion years: very low until the Great Oxidation Event about 2.4 billion years ago, today 21 percent. Below: at the same active site Rubisco adds either CO2 to RuBP, giving two 3-PGA, or O2, giving 3-PGA and 2-phosphoglycolate (2-PG), which goes to photorespiration. In today’s air a C3 Rubisco carboxylates about three times per oxygenation.', `
    ${ly.svg}
    ${reactions(p, 4 + ly.h + 34, 4 + ly.h + 140, 26)}
    ${credit(784, 594, `${CR.lyons}; ${CR.flam1}`)}
  `);
}

/* ---------- f · O₂ history above carboxylation rate vs specificity ---------- */

function drawF(): string {
  const p = 'fk05f', ly = lyons(p, 96, 4, 684), y0 = 4 + ly.h + 46;
  return svg(p, 'Top: atmospheric oxygen over 4 billion years: very low until the Great Oxidation Event about 2.4 billion years ago, today 21 percent. Below: carboxylation rate against CO2/O2 specificity for about 200 Rubiscos; C3 plants cluster at a specificity of about 98, cyanobacteria are faster and less specific, red algae more specific and slower.', `
    ${ly.svg}
    ${scatter(p, 150, y0, 690, 506, true)}
    ${credit(784, 594, `${CR.lyons}; ${CR.flam.replace(' (Fig. 5A redrawn) · ACS AuthorChoice', '')}`)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
