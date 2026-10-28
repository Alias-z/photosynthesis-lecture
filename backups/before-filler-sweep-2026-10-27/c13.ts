// Slide C13 · From leaf to loaf (new closing slot). Draft context, checked in
// research/review-2026-10-23-claude/REVIEW_SUMMARY.md §5(b) and §6, D_C01-C06.md gap 1, F_coverage-scope.md §3.2.
// Facts used, and no others:
//   - the cycle exports triose phosphate (in exchange for Pᵢ); sucrose is made in the cytosol and moves in the phloem;
//   - wheat stores day carbon mainly as sucrose, and stem fructans as longer-term reserves (Schnyder 1993);
//   - the ear feeds grain filling more than the flag-leaf blade, which gives 3–18 % (Sanchez-Bragado et al. 2014);
//   - the endosperm turns sucrose into ADP-glucose, by a cytosolic AGPase in grasses (unlike other starch-storing
//     organs), then into starch in amyloplasts (Beckles et al. 2001; Emes et al. 2003).
// Never drawn: leaf starch becoming grain starch. Left out as unverified: wheat's share of dietary calories.
// The equation keeps the L01 colour code: light amber, water and O₂ blue, carbon brown; the 12 H₂O form is from L08.
import type { PlateText, Variant } from '../types';
import './c13.css';
import { illusHeads, tag } from '../illus';

export const PLATE: PlateText = {
  n: 'C13',
  title: 'From leaf to loaf',
  status: 'draft',
  lead: 'Back to the opening equation, now with every term explained: light, water, O₂, CO₂ and the sugar that becomes grain starch.',
  points: [
    { claim: 'The glucose in the equation is bookkeeping.', text: 'The leaf exports triose phosphate as sucrose, which the phloem carries to the grain.' },
    { claim: 'The grain rebuilds starch.', text: 'Endosperm cells turn sucrose into ADP-glucose, then into starch.' },
    { claim: 'The ear fills the grain too.', text: 'In elite bread wheat, ear photosynthesis matched or exceeded the shoot’s; the flag-leaf blade gave only 3–18 %.' },
  ],
  refs: [
    { label: 'Sharkey 2024', url: 'https://doi.org/10.1093/plphys/kiad601' },
    { label: 'Sanchez-Bragado et al. 2014', url: 'https://doi.org/10.1093/jxb/eru298' },
    { label: 'Beckles et al. 2001', url: 'https://doi.org/10.1104/pp.125.2.818' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Annotated equation', anim: true },
  { id: 'b', name: 'Atom ledger' },
  { id: 'c', name: 'Six steps', anim: true },
  { id: 'd', name: 'Wheat plant' },
  { id: 'e', name: 'Two starches' },
  { id: 'f', name: 'Course map', anim: true },
  { id: 'g', name: 'Endosperm cell' },
  { id: 'h', name: 'Shipping' },
  { id: 'i', name: 'Zoom into bread' },
  { id: 'j', name: 'Six answers' },
];

export function draw(id: string): string {
  const d: Record<string, () => string> = {
    a: annotatedSvg, b: ledgerSvg, c: stepsSvg, d: plantSvg, e: starchesSvg,
    f: mapSvg, g: endospermSvg, h: shippingSvg, i: zoomSvg, j: answersSvg,
  };
  return (d[id] ?? annotatedSvg)();
}

/* ---------- shared parts (the equation is also used by C12) ---------- */

type Anchor = 'start' | 'middle' | 'end';
/** Equation colours: light, water and O₂, carbon, operators. */
export type Hue = 'l' | 'w' | 'c' | 'o';
const f = (v: number): string => v.toFixed(1);

/** Subscript digits as smaller, lowered digits (the web fonts have no subscript glyphs). */
export const chem = (s: string): string =>
  s.replace(/[₀-₉]+/g, m => `<tspan class="fc13-sb">${[...m].map(d => d.charCodeAt(0) - 0x2080).join('')}</tspan>`);
const T = (x: number, y: number, s: string, cls = 'sm', anchor: Anchor = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${chem(s)}</text>`;
const lines = (x: number, y: number, ss: string[], cls = 'sm', anchor: Anchor = 'start', dy = 26): string =>
  ss.map((s, i) => T(x, y + i * dy, s, cls, anchor)).join('');

interface Term { id: string; s: string; k: Hue }
// Light is written over the reaction arrow, as in the textbook form and on slide 1; it is not a reactant.
const CLASSIC: Term[] = [
  { id: 'co2', s: '6 CO₂', k: 'c' }, { id: 'p1', s: '+', k: 'o' }, { id: 'h2o', s: '6 H₂O', k: 'w' },
  { id: 'arrow', s: '', k: 'o' }, { id: 'sugar', s: 'C₆H₁₂O₆', k: 'c' }, { id: 'p3', s: '+', k: 'o' },
  { id: 'o2', s: '6 O₂', k: 'w' },
];
/** The L08 form: 12 H₂O in, 6 H₂O back out, so every O atom can be traced. */
const TRACED: Term[] = [
  { id: 'co2', s: '6 CO₂', k: 'c' }, { id: 'p1', s: '+', k: 'o' }, { id: 'h2o', s: '12 H₂O', k: 'w' },
  { id: 'arrow', s: '', k: 'o' }, { id: 'sugar', s: 'C₆H₁₂O₆', k: 'c' }, { id: 'p3', s: '+', k: 'o' },
  { id: 'o2', s: '6 O₂', k: 'w' }, { id: 'p4', s: '+', k: 'o' }, { id: 'h2o2', s: '6 H₂O', k: 'w' },
];
const EMW: Record<string, number> = { ' ': 0.27, '+': 0.6, '→': 0.9, C: 0.72, O: 0.79, H: 0.75, l: 0.27, i: 0.27, g: 0.61, h: 0.61, t: 0.38 };
const em = (s: string): number => [...s].reduce((a, ch) => a + (/[₀-₉]/.test(ch) ? 0.42 : /\d/.test(ch) ? 0.62 : (EMW[ch] ?? 0.58)), 0);

/** The photosynthesis equation centred on cx, in the L01 colours, with light over a long arrow as on slide 1.
 *  Returns the drawing, each term's centre (light shares the arrow's centre) and `ly`, the top of the light label. */
export function equation(cx: number, y: number, size: number, traced = false, gap = 0.36): { svg: string; x: Record<string, number>; w: Record<string, number>; ly: number } {
  const terms = traced ? TRACED : CLASSIC, w: Record<string, number> = {}, x: Record<string, number> = {};
  terms.forEach(t => { w[t.id] = t.id === 'arrow' ? 1.9 * size : em(t.s) * size; });
  const total = terms.reduce((a, t) => a + w[t.id], 0) + gap * size * (terms.length - 1);
  let at = cx - total / 2;
  terms.forEach(t => { x[t.id] = at + w[t.id] / 2; at += w[t.id] + gap * size; });
  x.light = x.arrow;
  const ay = y - 0.32 * size, a0 = x.arrow - w.arrow / 2, a1 = x.arrow + w.arrow / 2, hd = 0.3 * size, lb = ay - 0.22 * size;
  const arrow = `<path class="fc13-eq-ar" d="M${f(a0)},${f(ay)} H${f(a1 - hd * 0.6)}" style="stroke-width:${f(size * 0.07)}px"/>`
    + `<path class="fc13-eq-hd" d="M${f(a1)},${f(ay)} L${f(a1 - hd)},${f(ay - hd * 0.5)} L${f(a1 - hd)},${f(ay + hd * 0.5)} Z"/>`
    + `<text class="fc13-eq fc13-l" x="${f(x.arrow)}" y="${f(lb)}" text-anchor="middle" style="font-size:${f(size * 0.62)}px">light</text>`;
  const body = terms.map(t => t.id === 'arrow' ? arrow : `<text class="fc13-eq fc13-${t.k}" x="${f(x[t.id])}" y="${y}" text-anchor="middle" style="font-size:${size}px">${chem(t.s)}</text>`).join('');
  return { svg: body, x, w, ly: lb - 0.5 * size };
}

/** Arrowheads in the equation colours and in ink. */
const KS = ['l', 'w', 'c', 'k', 'g'] as const;
type K = typeof KS[number];
const marks = (p: string): string => `${illusHeads(p)}<defs>${KS.map(k =>
  `<marker id="${p}-a${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="fc13-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
const ar = (p: string, k: K, d: string, extra = ''): string =>
  `<path class="fc13-ar fc13-ar-${k}${extra ? ` ${extra}` : ''}" d="${d}" marker-end="url(#${p}-a${k})"/>`;
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fc13" viewBox="0 0 800 600" role="img" aria-label="${label}">${marks(p)}${body}</svg>`;

/** A page badge: the slide where a term was explained. */
function badge(x: number, y: number, s: string, anchor: Anchor = 'middle'): string {
  const w = 14 + s.length * 8.6, x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  return `<rect class="fc13-badge" x="${f(x0)}" y="${y - 15}" width="${f(w)}" height="22" rx="11"/>${T(x0 + w / 2, y + 1, s, 'fc13-badge-t')}`;
}
const num = (x: number, y: number, n: string, r = 15): string =>
  `<circle class="fc13-num" cx="${x}" cy="${y}" r="${r}"/>${T(x, y + 6.5, n, 'fc13-num-t')}`;
/** A small serif heading for a lecture: PHOTO · lecture 1. */
const lecture = (x: number, y: number, word: string, n: 1 | 2, anchor: Anchor = 'start'): string =>
  `<text class="fc13-band" x="${x}" y="${y}" text-anchor="${anchor}">${word}<tspan class="fc13-band-s"> · lecture ${n}</tspan></text>`;

/* ---------- icons ---------- */

const o2 = (x: number, y: number, r = 9): string =>
  `<circle class="fc13-ow" cx="${f(x - r * 0.78)}" cy="${y}" r="${r}"/><circle class="fc13-ow" cx="${f(x + r * 0.78)}" cy="${y}" r="${r}"/>`;
const co2 = (x: number, y: number, r = 9): string =>
  `<circle class="fc13-oc" cx="${f(x - r * 1.5)}" cy="${y}" r="${f(r * 0.85)}"/><circle class="fc13-oc" cx="${f(x + r * 1.5)}" cy="${y}" r="${f(r * 0.85)}"/><circle class="fc13-cb" cx="${x}" cy="${y}" r="${r}"/>`;
const h2o = (x: number, y: number, r = 9): string =>
  `<circle class="fc13-hw" cx="${f(x - r * 0.95)}" cy="${f(y + r * 0.7)}" r="${f(r * 0.58)}"/><circle class="fc13-hw" cx="${f(x + r * 0.95)}" cy="${f(y + r * 0.7)}" r="${f(r * 0.58)}"/><circle class="fc13-ow" cx="${x}" cy="${y}" r="${r}"/>`;
function hexagon(x: number, y: number, r: number, cls = 'fc13-ring'): string {
  const pts = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i + Math.PI / 6; return `${f(x + r * Math.cos(a))},${f(y + r * Math.sin(a))}`; });
  return `<path class="${cls}" d="M${pts.join('L')}Z"/>`;
}
function pentagon(x: number, y: number, r: number, cls = 'fc13-ring'): string {
  const pts = Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; return `${f(x + r * Math.cos(a))},${f(y + r * Math.sin(a))}`; });
  return `<path class="${cls}" d="M${pts.join('L')}Z"/>`;
}
/** Sucrose: a glucose ring joined to a fructose ring. */
const sucrose = (x: number, y: number, r = 13): string =>
  `${hexagon(x - r * 0.95, y, r)}<path class="fc13-bond" d="M${f(x - r * 0.12)},${y} H${f(x + r * 0.32)}"/>${pentagon(x + r * 1.15, y + 1, r * 0.92)}`;
function loaf(x: number, y: number, w: number): string {
  const h = w * 0.52, l = x - w / 2, r = x + w / 2;
  const cuts = [-0.24, 0, 0.24].map(t => `M${f(x + t * w - w * 0.07)},${f(y - h * 0.62)} Q${f(x + t * w)},${f(y - h * 0.86)} ${f(x + t * w + w * 0.08)},${f(y - h * 0.8)}`).join('');
  return `<path class="fc13-loaf" d="M${f(l)},${y} L${f(l + 4)},${f(y - h * 0.4)} C${f(l)},${f(y - h * 1.12)} ${f(r)},${f(y - h * 1.12)} ${f(r - 4)},${f(y - h * 0.4)} L${f(r)},${y} Z"/><path class="fc13-cut" d="${cuts}"/>`;
}
/** A wheat ear from top to top + h: paired grains with awns. */
function ear(x: number, top: number, h: number, n = 6, s = 1): string {
  return Array.from({ length: n }, (_, i) => {
    const gy = top + 12 * s + (i * (h - 12 * s)) / (n - 1);
    return [-1, 1].map(d => `<ellipse class="fc13-grain" cx="${f(x + d * 7 * s)}" cy="${f(gy)}" rx="${f(6.5 * s)}" ry="${f(11 * s)}" transform="rotate(${d * 24} ${f(x + d * 7 * s)} ${f(gy)})"/>
      <path class="fc13-awn" d="M${f(x + d * 9 * s)},${f(gy - 9 * s)} L${f(x + d * 22 * s)},${f(gy - 34 * s)}"/>`).join('');
  }).join('');
}
/** A wheat grain in cross-section: endosperm with starch granules, a crease and the embryo. */
function grain(x: number, y: number, rx: number, ry: number, granules = true): string {
  const g = granules ? Array.from({ length: 22 }, (_, i) => {
    const a = i * 2.39996, rr = Math.sqrt((i + 0.5) / 22) * 0.78;
    return `<ellipse class="fc13-granule" cx="${f(x + rx * rr * Math.cos(a))}" cy="${f(y + ry * rr * Math.sin(a))}" rx="${f(rx * 0.085)}" ry="${f(rx * 0.07)}"/>`;
  }).join('') : '';
  return `<ellipse class="fc13-bran" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/><ellipse class="fc13-endo" cx="${x}" cy="${y}" rx="${rx - 7}" ry="${ry - 7}"/>${g}`
    + `<path class="fc13-crease" d="M${x},${y - ry + 4} Q${x - 6},${y} ${x},${y + ry - 4}"/><ellipse class="fc13-embryo" cx="${f(x + rx * 0.62)}" cy="${f(y + ry * 0.62)}" rx="${f(rx * 0.2)}" ry="${f(ry * 0.16)}" transform="rotate(-38 ${f(x + rx * 0.62)} ${f(y + ry * 0.62)})"/>`;
}
/** An amyloplast with layered starch granules. */
function amyloplast(x: number, y: number, rx: number, ry: number, n = 5): string {
  const spots: Array<[number, number, number]> = [[-0.42, -0.2, 0.3], [0.08, -0.32, 0.26], [0.44, 0.02, 0.28], [-0.1, 0.32, 0.3], [-0.5, 0.36, 0.18], [0.3, 0.46, 0.17]];
  return `<ellipse class="fc13-amy" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>` + spots.slice(0, n).map(([dx, dy, s]) => {
    const gx = x + dx * rx, gy = y + dy * ry, r = s * rx;
    return `<ellipse class="fc13-starch" cx="${f(gx)}" cy="${f(gy)}" rx="${f(r)}" ry="${f(r * 0.86)}"/><ellipse class="fc13-starch-in" cx="${f(gx)}" cy="${f(gy)}" rx="${f(r * 0.55)}" ry="${f(r * 0.46)}"/>`;
  }).join('');
}
function sun(x: number, y: number, r = 16): string {
  const rays = Array.from({ length: 10 }, (_, k) => {
    const a = (k / 10) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    return `M${f(x + c * (r + 5))},${f(y + s * (r + 5))} L${f(x + c * (r + 13))},${f(y + s * (r + 13))}`;
  }).join('');
  return `<path class="fc13-ray" d="${rays}"/><circle class="fc13-sun" cx="${x}" cy="${y}" r="${r}"/>`;
}
const rubisco = (x: number, y: number, w = 100, h = 36): string =>
  `<rect class="node node-rub" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="12"/>${T(x, y + 7, 'Rubisco', 'sm lab-b')}`;
const pill = (x: number, y: number, w: number, s: string, cls = 'node', tcls = 'sm lab-b', h = 40): string =>
  `<rect class="${cls}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}"/>${T(x, y + 7.5, s, tcls)}`;
/** Sieve tube: a phloem conduit with sieve plates. */
function sieve(x0: number, x1: number, y: number, h = 34): string {
  const plates = Array.from({ length: Math.floor((x1 - x0) / 70) }, (_, i) => `<path class="fc13-plate" d="M${x0 + 60 + i * 70},${y - h / 2} V${y + h / 2}"/>`).join('');
  return `<rect class="fc13-sieve" x="${x0}" y="${y - h / 2}" width="${x1 - x0}" height="${h}" rx="${h / 2}"/>${plates}`;
}

/* ---------- a · the opening equation, every term annotated with the slide that explained it ---------- */

function annotatedSvg(): string {
  const p = 'fc13a';
  const y = 264, E = equation(400, y, 38), x = E.x;
  const H = 76, top = 74, bot = 306;
  const card = (x0: number, y0: number, w: number, head: string, k: Hue, pg: string, l: string): string =>
    `<rect class="fc13-card" x="${x0}" y="${y0}" width="${w}" height="${H}" rx="16"/>`
    + T(x0 + 18, y0 + 31, head, `sm lab-b fc13-${k}`, 'start') + (pg ? badge(x0 + w - 16, y0 + 26, pg, 'end') : '')
    + T(x0 + 18, y0 + 61, l, 'sm', 'start');
  const lead = (x0: number, y0: number, x1: number, y1: number): string => `<path class="fc13-lead" d="M${f(x0)},${f(y0)} L${f(x1)},${f(y1)}"/>`;
  const chainY = 506;
  const step = (cx: number, s: string, pg: string, w: number): string => pill(cx, chainY, w, s, 'node') + badge(cx, chainY + 44, pg);
  return svg(p, 'The opening equation 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂, with light over the arrow, and every term annotated by the slide that explained it: light caught by pigments and antennas (5–6); water split by the Mn₄CaO₅ cluster of PSII (8); all O₂ from water (8); ATP and NADPH in the arrow (9–10, C1); CO₂ fixed by Rubisco (C2); and the sugar really triose phosphate, then sucrose, grain starch and bread (C4, C4b, C13).',
    `${lecture(20, 50, 'PHOTO', 1)}
    ${card(20, top, 240, 'water', 'w', '8', 'split at PSII')}
    ${card(280, top, 240, 'light', 'l', '5–6', 'pigments absorb it')}
    ${card(540, top, 240, 'oxygen', 'w', '8', 'all from water')}
    ${lead(140, top + H, x.h2o, y - 36)}${lead(400, top + H, x.light, E.ly - 6)}${lead(660, top + H, x.o2, y - 36)}
    ${E.svg}
    ${card(20, bot, 240, 'CO₂', 'c', 'slide C2', 'fixed by Rubisco')}
    <rect class="fc13-card" x="280" y="${bot}" width="240" height="${H}" rx="16"/>
    ${tag(328, bot + 24, 'ATP', 'atp')}${tag(414, bot + 24, 'NADPH', 'nadph')}
    ${T(298, bot + 61, 'made by light', 'sm', 'start')}${badge(504, bot + 56, '9–10', 'end')}
    ${card(540, bot, 240, 'sugar', 'c', 'slide C4', 'triose-P is exported')}
    ${lead(x.co2, y + 12, 140, bot)}${lead(x.arrow, y + 12, 400, bot)}${lead(x.sugar, y + 12, 660, bot)}
    ${lecture(20, 438, 'SYNTHESIS', 2)}
    <path class="rule" d="M20,452 H780"/>
    ${step(84, 'triose-P', 'slide C4', 116)}${ar(p, 'c', 'M146,506 L180,506')}
    ${step(250, 'sucrose', 'slide C4b', 128)}${ar(p, 'c', 'M318,506 L352,506')}
    ${step(442, 'grain starch', 'this slide', 168)}${ar(p, 'c', 'M530,506 L566,506')}
    ${loaf(636, 526, 96)}${T(712, 514, 'bread', 'sm lab-b', 'start')}`);
}

/* ---------- b · every atom accounted for (the L08 form of the equation) ---------- */

function ledgerSvg(): string {
  const p = 'fc13b';
  const E = equation(400, 56, 29, true);
  const cols = { sugar: 330, o2: 520, water: 690 };
  const rowY = [196, 270, 344, 418];
  const balls = (cx: number, cy: number, n: number, cls: string, r = 8, per = 6): string =>
    Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / per), inRow = Math.min(per, n - row * per), k = i - row * per;
      const nRows = Math.ceil(n / per);
      return `<circle class="${cls}" cx="${f(cx + (k - (inRow - 1) / 2) * (2 * r + 3))}" cy="${f(cy - ((nRows - 1) * (2 * r + 3)) / 2 + row * (2 * r + 3))}" r="${r}"/>`;
    }).join('');
  const rowHead = (i: number, a: string, b: string, k: Hue): string => T(24, rowY[i] - 2, a, `sm lab-b fc13-${k}`, 'start') + T(24, rowY[i] + 24, b, 'tiny', 'start');
  const none = (cx: number, i: number): string => T(cx, rowY[i] + 7, '—', 'tl');
  return svg(p, 'Atom ledger for 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O, with light over the arrow: the 6 carbons of CO₂ all go into the sugar; the 12 oxygens of CO₂ split between the sugar and the new water; the 12 oxygens of the water all become O₂; the 24 hydrogens of the water, whose electrons NADPH carries, split between the sugar and the new water.',
    `${E.svg}${T(400, 92, 'the traced form from slide 9', 'tiny')}
    ${T(cols.sugar, 136, 'into sugar', 'sm lab-b fc13-c')}${T(cols.o2, 136, 'into O₂', 'sm lab-b fc13-w')}${T(cols.water, 136, 'into new water', 'sm lab-b fc13-w')}
    <path class="rule" d="M20,152 H780"/>
    ${rowHead(0, '6 C', 'from CO₂', 'c')}${balls(cols.sugar, rowY[0], 6, 'fc13-cb')}${none(cols.o2, 0)}${none(cols.water, 0)}
    ${rowHead(1, '12 O', 'from CO₂', 'c')}${balls(cols.sugar, rowY[1], 6, 'fc13-oc')}${none(cols.o2, 1)}${balls(cols.water, rowY[1], 6, 'fc13-oc')}
    ${rowHead(2, '12 O', 'from water', 'w')}${none(cols.sugar, 2)}${balls(cols.o2, rowY[2], 12, 'fc13-ow')}${none(cols.water, 2)}
    ${rowHead(3, '24 H', 'from water, their', 'w')}${T(24, rowY[3] + 42, 'electrons via NADPH', 'tiny', 'start')}${balls(cols.sugar, rowY[3], 12, 'fc13-hw', 6.5)}${none(cols.o2, 3)}${balls(cols.water, rowY[3], 12, 'fc13-hw', 6.5)}
    <path class="rule" d="M20,468 H780"/>
    ${co2(44, 512)}${T(74, 520, 'sugar carbon: all from CO₂', 'sm lab-b', 'start')}
    ${o2(44, 560)}${T(74, 568, 'O₂: all from water', 'sm lab-b', 'start')}
    ${ar(p, 'c', 'M392,512 L632,512')}${loaf(704, 540, 96)}`);
}

/* ---------- c · six steps from leaf to loaf (storyboard) ---------- */

function stepsSvg(): string {
  const p = 'fc13c';
  const W = 252, H = 262, X0 = [14, 274, 534], Y0 = [14, 318];
  const panel = (i: number, title: string, pg: string, icon: string, ls: string[]): string => {
    const x0 = X0[i % 3], y0 = Y0[Math.floor(i / 3)];
    return `<rect class="fc13-card" x="${x0}" y="${y0}" width="${W}" height="${H}" rx="18"/>
      ${num(x0 + 26, y0 + 30, `${i + 1}`)}${T(x0 + 50, y0 + 38, title, 'sm lab-b', 'start')}${badge(x0 + W - 8, y0 + 32, pg, 'end')}
      ${icon}${T(x0 + W / 2, y0 + 224, ls[0])}`;
  };
  const cx = (i: number): number => X0[i % 3] + W / 2, cy = (i: number): number => Y0[Math.floor(i / 3)] + 120;
  return svg(p, 'Six steps from leaf to loaf: 1 Rubisco fixes CO₂ in leaves and ear; 2 triose phosphate leaves the chloroplast in exchange for phosphate; 3 wheat stores carbon as sucrose and as stem fructans; 4 sucrose travels in the phloem to the filling grain; 5 the endosperm makes ADP-glucose and starch; 6 bread, whose carbon came from the air.',
    `${panel(0, 'Fix', 'slide C2', `${co2(cx(0) - 74, cy(0) - 32, 10)}${T(cx(0) - 74, cy(0) - 52, 'CO₂', 'tiny')}${pentagon(cx(0) - 74, cy(0) + 28, 28, 'node node-rubp')}${T(cx(0) - 74, cy(0) + 34, 'RuBP', 'tiny')}
      ${ar(p, 'k', `M${cx(0) - 46},${cy(0) - 26} L${cx(0) - 12},${cy(0) - 8}`)}${ar(p, 'k', `M${cx(0) - 46},${cy(0) + 22} L${cx(0) - 12},${cy(0) + 8}`)}${rubisco(cx(0) + 44, cy(0), 104)}`,
      ['in leaves and ear'])}
    ${panel(1, 'Export', 'slide C4b', `<ellipse class="fc13-chl" cx="${cx(1) - 24}" cy="${cy(1)}" rx="72" ry="48"/>${T(cx(1) - 24, cy(1) + 6, 'chloroplast', 'tiny')}
      ${ar(p, 'c', `M${cx(1) + 30},${cy(1) - 18} L${cx(1) + 86},${cy(1) - 30}`)}${T(cx(1) + 80, cy(1) - 44, 'triose-P', 'tiny')}
      ${tag(cx(1) + 76, cy(1) + 34, '', 'pi')}${ar(p, 'k', `M${cx(1) + 58},${cy(1) + 28} L${cx(1) + 34},${cy(1) + 18}`)}`,
      ['exchanged for Pᵢ'])}
    ${panel(2, 'Sucrose', 'slide C4b', `${sucrose(cx(2) - 6, cy(2), 24)}`,
      ['made in the cytosol'])}
    ${panel(3, 'Phloem', 'slide C4b', `${sieve(cx(3) - 104, cx(3) + 104, cy(3) - 6)}${[-70, -20, 30, 80].map(d => `<circle class="fc13-suc-dot" cx="${cx(3) + d}" cy="${cy(3) - 6}" r="7"/>`).join('')}${ar(p, 'c', `M${cx(3) - 80},${cy(3) + 34} H${cx(3) + 80}`)}`,
      ['to the filling grain'])}
    ${panel(4, 'Starch', 'this slide', `${amyloplast(cx(4), cy(4) - 6, 74, 52)}`,
      ['in the endosperm'])}
    ${panel(5, 'Bread', 'this slide', `${loaf(cx(5) - 30, cy(5) + 22, 104)}${grain(cx(5) + 72, cy(5) - 14, 26, 36, false)}`,
      ['carbon from the air'])}
    ${[0, 1, 3, 4].map(i => ar(p, 'k', `M${X0[i % 3] + W + 1},${Y0[Math.floor(i / 3)] + 130} L${X0[i % 3] + W + 7},${Y0[Math.floor(i / 3)] + 130}`)).join('')}
    ${ar(p, 'k', `M${X0[2] + W / 2},${Y0[0] + H + 2} C${X0[2] + W / 2},${Y0[0] + H + 22} ${X0[0] + W / 2},${Y0[0] + H + 6} ${X0[0] + W / 2},${Y0[1] - 4}`, 'fc13-thin')}`);
}

/* ---------- d · the wheat plant: which organs fill the grain ---------- */

function plantSvg(): string {
  const p = 'fc13d';
  const sx = 290;
  const leaf = (x0: number, y0: number, x1: number, y1: number, bend: number): string => {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - bend;
    return `<path class="fc13-blade" d="M${x0},${y0} Q${mx},${my - 16} ${x1},${y1} Q${mx},${my + 12} ${x0},${y0 + 10} Z"/>`;
  };
  return svg(p, 'A wheat plant. The ear photosynthesises and feeds grain filling more than the flag-leaf blade, which gives 3–18 %. The stem stores fructans that later feed the grain, and the leaves keep the day’s carbon mainly as sucrose. Inside the grain, the endosperm rebuilds starch from sucrose; flour and bread follow.',
    `<path class="fc13-stem" d="M${sx},590 V170"/>${[480, 360, 250].map(yy => `<ellipse class="fc13-node" cx="${sx}" cy="${yy}" rx="6" ry="4"/>`).join('')}
    ${leaf(sx, 252, 520, 196, 40)}${leaf(sx, 362, 96, 352, 22)}${leaf(sx, 482, 470, 520, 10)}
    ${ear(sx, 40, 136, 7, 1.15)}
    <path class="fc13-flow-big" d="M${sx + 30},160 C${sx + 62},146 ${sx + 64},104 ${sx + 40},84"/><path class="fc13-hd-c" d="M${sx + 30},74 l18,2 l-8,14 z"/>
    ${ar(p, 'c', `M470,206 C420,196 340,190 ${sx + 14},176`, 'fc13-flow-thin')}
    ${ar(p, 'c', `M${sx - 14},440 C${sx - 30},360 ${sx - 30},250 ${sx - 12},184`, 'fc13-flow-mid')}
    ${T(236, 70, 'ear', 'lab lab-b', 'end')}${T(236, 98, 'photosynthesises', 'sm', 'end')}
    ${T(530, 176, 'flag-leaf blade', 'sm lab-b', 'start')}
    ${T(16, 282, 'leaves', 'sm lab-b', 'start')}${T(16, 308, 'store mainly sucrose', 'sm', 'start')}
    ${T(244, 430, 'stem', 'sm lab-b', 'end')}${lines(244, 456, ['stores fructans,', 'remobilised later'], 'sm', 'end')}
    <circle class="fc13-zoom" cx="${sx + 9}" cy="128" r="16"/><path class="fc13-zoomline" d="M${sx + 24},124 L560,276 M${sx + 20},140 L556,462"/>
    <circle class="fc13-lens" cx="650" cy="370" r="112"/>${grain(650, 362, 64, 86)}
    ${T(650, 244, 'one grain', 'sm lab-b')}${T(650, 514, 'endosperm: starch', 'sm lab-b')}
    ${loaf(722, 590, 70)}${T(682, 586, 'bread', 'sm', 'end')}
    ${T(16, 590, 'Schnyder 1993', 'tiny', 'start')}`);
}

/* ---------- e · two starches, one traveller ---------- */

function starchesSvg(): string {
  const p = 'fc13e';
  return svg(p, 'Leaf to grain, one traveller. A wheat leaf stores its day carbon mainly as sucrose, with little starch. Only sucrose travels in the phloem. Grain starch is rebuilt in the endosperm, in amyloplasts, from sucrose via ADP-glucose.',
    `${T(400, 80, 'Leaf to grain, one traveller', 'lab lab-b')}
    <rect class="fc13-cell" x="20" y="128" width="236" height="392" rx="26"/>${T(138, 170, 'leaf cell', 'sm lab-b')}
    <ellipse class="fc13-chl" cx="138" cy="316" rx="94" ry="64"/>${[[-44, -20], [-10, 16], [28, -14]].map(([dx, dy]) => `<rect class="fc13-thy" x="${138 + dx - 20}" y="${316 + dy - 7}" width="40" height="14" rx="7"/>`).join('')}
    <ellipse class="fc13-starch" cx="172" cy="342" rx="22" ry="16"/>
    ${T(138, 446, 'day store: mainly', 'sm')}${T(138, 472, 'sucrose, little starch', 'sm')}
    ${sieve(284, 516, 316, 46)}${[310, 380, 450].map(x => sucrose(x + 10, 316, 11)).join('')}
    ${ar(p, 'c', 'M256,316 L282,316')}${ar(p, 'c', 'M518,316 L542,316')}
    ${T(400, 266, 'only sucrose travels', 'sm lab-b fc13-c')}${T(400, 376, 'phloem', 'sm')}
    <rect class="fc13-cell" x="544" y="128" width="236" height="392" rx="26"/>${T(662, 170, 'endosperm cell', 'sm lab-b')}
    ${amyloplast(662, 316, 92, 74, 6)}
    ${T(662, 446, 'starch stored', 'sm')}${T(662, 472, 'for the seed', 'sm')}`);
}

/* ---------- f · the course as one line, from Sun to loaf (storyboard) ---------- */

function mapSvg(): string {
  const p = 'fc13f';
  const y1 = 196, y2 = 430, xs = 84, xe = 742;
  const L1 = Array.from({ length: 15 }, (_, i) => `${i + 1}`);
  const L2 = ['C1', 'C2', 'C3', 'C4', 'C4b', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13'];
  const px1 = (i: number): number => xs + (i * (xe - xs)) / 14, px2 = (i: number): number => xe - (i * (xe - xs)) / 13;
  const stop = (x: number, y: number, s: string, up: boolean): string =>
    `<circle class="fc13-stop" cx="${f(x)}" cy="${y}" r="8"/>${T(x, up ? y - 18 : y + 30, s, 'tiny')}`;
  /** A bracket over (or under) a run of stations, at one of two heights so neighbours never collide. */
  const zone = (xa: number, xb: number, y: number, up: boolean, s: string, k: Hue | 'k', hi = false): string => {
    const d = (up ? -1 : 1) * (hi ? 72 : 40), yy = y + d, tip = up ? 8 : -8;
    return `<path class="fc13-zone" d="M${f(xa)},${yy + tip} V${yy} H${f(xb)} V${yy + tip}"/>` + T((xa + xb) / 2, up ? yy - 10 : yy + 26, s, `sm lab-b${k === 'k' ? '' : ` fc13-${k}`}`);
  };
  return svg(p, 'The two lectures as one line from the Sun to a loaf. Lecture 1 runs left to right: light (2–6), the electron route and water (7–9), ATP and NADPH (10–11), protection and measurement (12–14), the whole leaf (15). Lecture 2 runs back: ATP and NADPH spent (C1), CO₂ fixed (C2–C3), sugar (C4–C4b), O₂ competes (C5–C6), the whole leaf (C7–C8), C₂, C₄ and CAM (C9–C11), rising CO₂ (C12), and bread (C13).',
    `${lecture(20, 36, 'PHOTO', 1)}
    ${sun(40, y1, 12)}
    <path class="fc13-line fc13-line-1" d="M${xs},${y1} H${xe} C${xe + 40},${y1} ${xe + 40},${y2} ${xe},${y2}"/>
    <path class="fc13-line fc13-line-2" d="M${xe},${y2} H${xs}"/>
    ${L1.map((s, i) => stop(px1(i), y1, s, false)).join('')}
    ${L2.map((s, i) => stop(px2(i), y2, s, true)).join('')}
    ${zone(px1(1) - 10, px1(5) + 10, y1, true, 'light', 'l')}
    ${zone(px1(6) - 10, px1(8) + 10, y1, true, 'e⁻ route, H₂O → O₂', 'w', true)}
    ${zone(px1(9) - 10, px1(10) + 10, y1, true, 'ATP + NADPH', 'k')}
    ${zone(px1(11) - 10, px1(13) + 10, y1, true, 'protect, measure', 'k', true)}
    ${zone(px1(14) - 10, px1(14) + 10, y1, true, 'leaf', 'k')}
    ${zone(px2(0) - 10, px2(0) + 10, y2, false, 'bridge', 'k')}
    ${zone(px2(2) - 10, px2(1) + 10, y2, false, 'CO₂', 'c', true)}
    ${zone(px2(4) - 10, px2(3) + 10, y2, false, 'sugar', 'c')}
    ${zone(px2(6) - 10, px2(5) + 10, y2, false, 'O₂ competes', 'k', true)}
    ${zone(px2(8) - 10, px2(7) + 10, y2, false, 'whole leaf', 'k')}
    ${zone(px2(11) - 10, px2(9) + 10, y2, false, 'C₂, C₄, CAM', 'k', true)}
    ${zone(px2(12) - 10, px2(12) + 10, y2, false, 'CO₂ rises', 'c')}
    ${zone(px2(13) - 10, px2(13) + 10, y2, false, 'bread', 'c', true)}
    ${loaf(40, y2 + 10, 48)}
    ${lecture(20, 576, 'SYNTHESIS', 2)}
    ${T(400, 318, 'ATP + NADPH carry lecture 1 into lecture 2', 'note')}${T(400, 350, 'numbers on the line are slide numbers', 'tiny')}`);
}

/* ---------- g · inside an endosperm cell ---------- */

function endospermSvg(): string {
  const p = 'fc13g';
  return svg(p, 'Inside an endosperm cell of a wheat grain: sucrose arrives from the phloem; in the cytosol, AGPase makes ADP-glucose (in grass endosperm this enzyme is mostly cytosolic; in other organs it sits inside the plastid); ADP-glucose enters the amyloplast, where starch granules grow.',
    `${grain(96, 104, 50, 68, true)}<circle class="fc13-zoom" cx="112" cy="130" r="14"/><path class="fc13-zoomline" d="M124,140 L190,192 M104,144 L120,192"/>
    ${T(160, 62, 'wheat grain', 'sm lab-b', 'start')}${T(160, 88, 'endosperm', 'sm', 'start')}
    <rect class="fc13-cell" x="110" y="192" width="670" height="282" rx="34"/>${T(132, 228, 'endosperm cell', 'sm lab-b', 'start')}${T(132, 254, 'cytosol', 'tiny', 'start')}
    ${sieve(-10, 100, 340, 40)}${T(20, 302, 'phloem', 'tiny', 'start')}
    ${ar(p, 'c', 'M84,340 L150,340')}
    ${sucrose(204, 340, 15)}${T(204, 382, 'sucrose', 'sm lab-b')}
    ${ar(p, 'c', 'M250,340 L316,340')}${T(283, 292, 'several steps,', 'tiny')}${T(283, 318, 'last: AGPase', 'sm lab-b fc13-c')}
    ${pill(398, 340, 150, 'ADP-glucose', 'node', 'sm lab-b', 40)}
    ${ar(p, 'c', 'M474,340 L540,340')}
    ${amyloplast(650, 326, 100, 86, 6)}${T(650, 450, 'amyloplast: starch', 'sm lab-b')}
    ${ar(p, 'k', 'M650,480 L650,510')}${T(620, 552, 'flour →', 'sm', 'end')}${loaf(690, 564, 76)}`);
}

/* ---------- h · analogy: the leaf ships sugar, the grain repacks it ---------- */

function shippingSvg(): string {
  const p = 'fc13h';
  const box = (x: number, y: number, s = 1): string =>
    `<rect class="fc13-pkg" x="${f(x - 14 * s)}" y="${f(y - 12 * s)}" width="${f(28 * s)}" height="${f(24 * s)}" rx="3"/><path class="fc13-tape" d="M${f(x - 14 * s)},${f(y - 3 * s)} H${f(x + 14 * s)}"/>`;
  const factory = (x: number, y: number): string =>
    `<path class="fc13-bld" d="M${x - 70},${y + 50} V${y - 10} L${x - 40},${y - 34} V${y - 10} L${x - 10},${y - 34} V${y - 10} L${x + 20},${y - 34} V${y - 10} L${x + 50},${y - 34} V${y + 50} Z"/>`
    + [-55, -25, 5, 35].map(dx => `<path class="fc13-panel" d="M${x + dx},${y - 12} L${x + dx + 26},${y - 32}"/>`).join('')
    + `<rect class="fc13-door" x="${x - 12}" y="${y + 16}" width="24" height="34"/>`;
  const warehouse = (x: number, y: number): string =>
    `<path class="fc13-bld" d="M${x - 74},${y + 50} V${y - 14} L${x},${y - 50} L${x + 74},${y - 14} V${y + 50} Z"/>`
    + Array.from({ length: 6 }, (_, i) => `<rect class="fc13-pallet" x="${x - 54 + (i % 3) * 38}" y="${y + 2 + Math.floor(i / 3) * 22}" width="32" height="18" rx="2"/>`).join('');
  const name = (x: number, y: number, a: string, b: string, k = ''): string => T(x, y, a, 'sm lab-b') + T(x, y + 26, b, `sm ${k}`);
  return svg(p, 'Analogy: the leaf ships sugar and the grain repacks it. A light-powered factory (leaf and ear) packs its product into shipping boxes (sucrose) that travel by pipeline (phloem) to a warehouse (the endosperm), which unpacks them and stacks pallets (starch) that the bakery turns into bread. The factory’s own night stock never ships.',
    `${sun(56, 60, 14)}
    ${factory(96, 180)}${name(96, 262, 'solar factory', '= leaf and ear', 'fc13-c')}
    ${box(204, 220)}${box(234, 220)}${box(219, 196)}${name(219, 128, 'boxes', '= sucrose', 'fc13-c')}
    ${sieve(266, 520, 214, 30)}${[306, 376, 446].map(xx => box(xx, 214, 0.7)).join('')}${ar(p, 'c', 'M306,248 H480')}
    ${name(393, 280, 'pipeline', '= phloem', 'fc13-c')}
    ${warehouse(630, 180)}${name(630, 262, 'warehouse', '= endosperm', 'fc13-c')}
    ${T(630, 112, 'unpacks, stacks pallets', 'tiny')}
    <path class="rule" d="M20,330 H780"/>
    ${T(630, 376, 'pallets = starch granules', 'sm', 'middle')}${ar(p, 'k', 'M630,390 L630,420')}
    ${loaf(630, 484, 92)}${T(630, 514, 'bakery: flour → bread', 'sm lab-b')}
    <rect class="fc13-card" x="20" y="390" width="400" height="96" rx="16"/>
    ${T(40, 428, 'night stock = stored sucrose', 'sm lab-b', 'start')}${T(40, 460, 'stems also keep fructans', 'sm', 'start')}
    ${T(400, 568, 'only the boxes travel', 'note')}`);
}

/* ---------- i · zoom into bread: from loaf to the CO₂ in its carbon ---------- */

function zoomSvg(): string {
  const p = 'fc13i';
  const C: Array<[number, number]> = [[96, 112], [262, 216], [428, 320], [594, 424], [722, 518]];
  const r = 74;
  const cone = (a: [number, number], b: [number, number], rb: number): string =>
    `<path class="fc13-zoomline" d="M${f(a[0] + r * 0.55)},${f(a[1] - r * 0.3)} L${f(b[0] + rb * 0.2)},${f(b[1] - rb)} M${f(a[0] - r * 0.1)},${f(a[1] + r * 0.6)} L${f(b[0] - rb)},${f(b[1] + rb * 0.1)}"/>`;
  const chainG = (x: number, y: number): string => [-42, -14, 14, 42].map((dx, i) => hexagon(x + dx, y + (i % 2 ? 8 : -8), 13, 'fc13-ring')).join('')
    + `<path class="fc13-bond" d="M${x - 30},${y - 4} L${x - 26},${y + 4} M${x - 2},${y + 4} L${x + 2},${y - 4} M${x + 26},${y - 4} L${x + 30},${y + 4}"/>`;
  return svg(p, 'Zoom into bread: a loaf, then one grain, an endosperm cell full of starch granules, a starch chain of glucose units, and finally the CO₂ that Rubisco fixed from the air, the source of every carbon.',
    `${cone(C[0], C[1], r)}${cone(C[1], C[2], r)}${cone(C[2], C[3], r)}${cone(C[3], C[4], 60)}
    ${C.slice(0, 4).map(([x, y]) => `<circle class="fc13-lens" cx="${x}" cy="${y}" r="${r}"/>`).join('')}<circle class="fc13-lens" cx="${C[4][0]}" cy="${C[4][1]}" r="60"/>
    ${loaf(C[0][0], C[0][1] + 24, 104)}
    ${grain(C[1][0], C[1][1], 40, 54)}
    ${amyloplast(C[2][0], C[2][1], 58, 46, 6)}
    ${chainG(C[3][0], C[3][1])}
    ${co2(C[4][0], C[4][1], 13)}
    ${T(190, 92, 'bread', 'sm lab-b', 'start')}${T(190, 118, 'flour from the grain', 'sm', 'start')}
    ${T(356, 196, 'a wheat grain', 'sm lab-b', 'start')}${T(356, 222, 'endosperm stores starch', 'sm', 'start')}
    ${T(334, 340, 'starch granules', 'sm lab-b', 'end')}${T(334, 366, 'built from sucrose', 'sm', 'end')}
    ${T(500, 444, 'glucose units', 'sm lab-b', 'end')}${T(500, 470, 'from triose-P', 'sm', 'end')}${badge(500, 500, 'slides C4, C4b', 'end')}
    ${T(640, 540, 'CO₂ from the air', 'sm lab-b fc13-c', 'end')}${T(640, 566, 'fixed by Rubisco', 'sm', 'end')}${badge(640, 594, 'slide C2', 'end')}`);
}

/* ---------- j · the six opening questions, answered ---------- */

function answersSvg(): string {
  const p = 'fc13j';
  const E = equation(400, 84, 32), x = E.x;
  const order: Array<[string, number]> = [['light', 1], ['h2o', 2], ['o2', 3], ['arrow', 4], ['co2', 5], ['sugar', 6]];
  const rows: Array<[number, string, Hue, string[], string]> = [
    [1, 'light', 'l', ['pigments absorb blue and red most'], '5–6'],
    [2, 'H₂O', 'w', ['Mn₄CaO₅ cluster takes 4 e⁻ from 2 H₂O'], '7–8'],
    [3, 'O₂', 'w', ['all from water: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻'], '8'],
    [4, '', 'o', ['NADP⁺ reduced; H⁺ gradient drives ATP synthase'], '9–10'],
    [5, 'CO₂', 'c', ['Rubisco adds it to RuBP; 3 CO₂ → 1 triose-P'], 'slides C2–C4'],
    [6, 'C₆H₁₂O₆', 'c', ['travels as sucrose, stored as starch'], 'slides C4b, C13'],
  ];
  const ry = (n: number): number => (n <= 4 ? 200 + (n - 1) * 54 : 496 + (n - 5) * 56) - 30;
  const term = (n: number, s: string, k: Hue): string => num(36, ry(n) + 10, `${n}`, 13) + (n === 4
    ? `${tag(104, ry(n) + 6, 'ATP', 'atp')}${tag(104, ry(n) + 42, 'NADPH', 'nadph')}`
    : T(58, ry(n) + 18, s, `fc13-term fc13-${k}`, 'start'));
  return svg(p, 'The six questions of the opening, answered: 1 light, 2 water, 3 O₂ and 4 ATP and NADPH in lecture 1; 5 CO₂ and 6 sugar in lecture 2, each with the slides that answered it.',
    `${E.svg}
    ${order.map(([id, n]) => num(x[id], id === 'arrow' ? 106 : 32, `${n}`, 13)).join('')}
    ${lecture(20, 146, 'PHOTO', 1)}<path class="rule" d="M20,158 H780"/>
    ${lecture(20, 428, 'SYNTHESIS', 2)}<path class="rule" d="M20,440 H780"/>
    ${rows.map(([n, s, k, a, pg]) => `${term(n, s, k)}${lines(176, ry(n) + 18, a, 'sm', 'start', 26)}${badge(780, ry(n) + 12, pg, 'end')}`).join('')}`);
}
