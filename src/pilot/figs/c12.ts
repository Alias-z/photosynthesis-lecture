// Slide C12 · FvCB links carbon fixation to energy supply. Draft context, checked in
// research/review-2026-10-23-claude/E_C07-C12.md (C12 rows 1–11, FvCB bookkeeping rows 1–3, gap 3) and
// REVIEW_SUMMARY.md (C12 row; essential 13). Equations confirmed there and kept off the page:
//   Wc = Vcmax Cc/[Cc + Kc(1 + O/Ko)],  Wj = J Cc/[4(Cc + 2Γ*)],  A = min(Wc, Wj)(1 − Γ*/Cc) − Rʟ,  Ap = 3 TPU − Rʟ.
// Numbers on the page, and no others: FACE C₃ crop yield ≈ +18 % at ≈ +200 ppm without stress, ≈ +10 % with low N or
// ≈ +2 °C, C₄ only under drought (Ainsworth & Long 2021); grassland biomass reversal after year 12 of 20, its cause
// debated (Reich et al. 2018 and two Science comments). Every curve is illustrative and says so; no axis values,
// because Γ* at 25 °C is still unverified (REVIEW_SUMMARY §8).
// Colours follow the MSc thesis Fig. 5: Ac (RuBisCO) red, Aj (RuBP regeneration) cyan, grey dashed extensions;
// Ap (triose-phosphate use) purple. The liked thesis scheme (Fig. 2b, figs/c5.ts variant a) is variant a here.
import type { PlateText, Variant } from '../types';
import './c12.css';
import { bolt, illusHeads, molecule, tag } from '../illus';
import { arrow } from '../mechanisms';
import { gasAr } from './l2-glyphs';
import { chem, equation } from './c13';

export const PLATE: PlateText = {
  n: 'C8',
  title: 'FvCB links carbon fixation to energy supply',
  status: 'draft',
  lead: 'The FvCB model (Farquhar, von Caemmerer, Berry): a leaf fixes CO₂ only as fast as its slowest step allows.',
  points: [
    { claim: 'Low CO₂: RuBisCO sets the pace.', text: 'Uptake climbs steeply with CO₂; RuBisCO capacity (V<sub class="fc12-sub">cmax</sub>) sets how steeply.' },
    { claim: 'Higher CO₂: RuBP regeneration sets the pace.', text: 'RuBisCO waits for RuBP, rebuilt with ATP and NADPH from electron transport (J), which light drives.' },
    { claim: 'The model has corners; leaves do not.', text: 'It switches sharply between limits, as Blackman drew in 1905; measured curves round the corner (lecture 1, slide 15).' },
  ],
  refs: [
    { label: 'Farquhar et al. 1980', url: 'https://doi.org/10.1007/BF00386231' },
    { label: 'von Caemmerer et al. 2025', url: 'https://doi.org/10.1007/s00425-025-04834-7' },
    { label: 'Busch et al. 2024', url: 'https://doi.org/10.1111/pce.14815' },
    { label: 'Blackman 1905', url: 'https://doi.org/10.1093/oxfordjournals.aob.a089000' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Thesis scheme' },
  { id: 'b', name: 'Thesis curve', anim: true },
  { id: 'c', name: 'Scheme over curve' },
  { id: 'e', name: 'Raise CO₂', anim: true },
  { id: 'f', name: 'Two knobs' },
  { id: 'i', name: 'Equation link' },
  { id: 'j', name: 'Chloroplast map' },
];

export function draw(id: string): string {
  const d: Record<string, () => string> = {
    a: schemeSvg, b: curveSvg, c: alignedSvg, d: kitchenSvg, e: raiseSvg,
    f: knobsSvg, g: c4Svg, h: faceSvg, i: equationSvg, j: chloroplastSvg,
  };
  return (d[id] ?? schemeSvg)();
}

/* ---------- shared parts ---------- */

type Lim = 'c' | 'j' | 'p';
type Anchor = 'start' | 'middle' | 'end';
const f = (v: number): string => v.toFixed(1);

/** Model symbols with real subscripts: Ac, Aj, Ap, Vcmax, Jmax, Cc, Ci. */
const sym = (s: string): string => chem(s).replace(/\b([AVJC])(cmax|max|c|j|p|i)\b/g, '$1<tspan class="fc12-s">$2</tspan>');
const T = (x: number, y: number, s: string, cls = 'sm', anchor: Anchor = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${sym(s)}</text>`;
const lines = (x: number, y: number, ss: string[], cls = 'sm', anchor: Anchor = 'start', dy = 27): string =>
  ss.map((s, i) => T(x, y + i * dy, s, cls, anchor)).join('');

/** Arrowheads in the limit colours, grey, and the equation colours. */
const KS = ['c', 'j', 'p', 'g', 'k', 'b', 'a', 'w', 'f'] as const;
type K = typeof KS[number];
const marks = (p: string): string => `${illusHeads(p)}<defs>${KS.map(k =>
  `<marker id="${p}-k${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="fc12-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
const ar = (p: string, k: K, d: string, extra = ''): string =>
  `<path class="fc12-ar fc12-ar-${k}${extra ? ` ${extra}` : ''}" d="${d}" marker-end="url(#${p}-k${k})"/>`;
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fc12" viewBox="0 0 800 600" role="img" aria-label="${label}">${marks(p)}${body}</svg>`;

/** RuBP as the thesis draws it: a pentagon. */
function pent(x: number, y: number, r: number, label = 'RuBP', cls = 'sm lab-b'): string {
  const pts = Array.from({ length: 5 }, (_, k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    return `${f(x + r * Math.cos(a))},${f(y + r * Math.sin(a))}`;
  }).join(' ');
  return `<polygon class="node node-rubp" points="${pts}"/>${label ? T(x, y + 8, label, cls) : ''}`;
}
const pill = (x: number, y: number, w: number, body: string, cls = 'node', h = 44): string =>
  `<rect class="${cls}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}"/>${body}`;
const rubisco = (x: number, y: number, w = 120, h = 44, label = 'RuBisCO'): string =>
  `<rect class="node node-rub" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="14"/>${T(x, y + 8, label, 'sm lab-b')}`;
/** A vertical curly brace from y0 to y1 at x; its tip points left (dir −1) or right (dir 1). */
function brace(x: number, y0: number, y1: number, dir: 1 | -1, l: Lim): string {
  const w = 12 * dir, m = (y0 + y1) / 2;
  return `<path class="fc12-br fc12-br-${l}" d="M${x},${y0} q${w},0 ${w},12 V${m - 12} q0,12 ${w},12 q${-w},0 ${-w},12 V${y1 - 12} q0,12 ${-w},12"/>`;
}
const num = (x: number, y: number, n: string, r = 15): string =>
  `<circle class="fc12-num" cx="${x}" cy="${y}" r="${r}"/>${T(x, y + 6.5, n, 'fc12-num-t')}`;
const ILLUS = (x = 784, y = 590): string => T(x, y, 'illustrative', 'note', 'end');

/* ---------- the FvCB response (illustrative) ---------- */

/** Leaf capacities: Vcmax, J and TPU in µmol m⁻² s⁻¹. Shapes only; no value reaches the page. */
interface Leaf { vc: number; j: number; tpu: number }
const BASE: Leaf = { vc: 60, j: 110, tpu: 8 };
// RuBisCO constants at 25 °C as used by the existing pilot figures (carbonFigs.ts, mechanisms.ts).
const KC = 404.9, KO = 278.4, O2 = 210, GS = 42.75, RL = 1;
const ac = (q: Leaf, c: number): number => (q.vc * c) / (c + KC * (1 + O2 / KO)) * (1 - GS / c) - RL;
const aj = (q: Leaf, c: number): number => (q.j * c) / (4 * (c + 2 * GS)) * (1 - GS / c) - RL;
const ap = (q: Leaf): number => 3 * q.tpu - RL;
const amin = (q: Leaf, c: number, tpu = true): number => Math.min(ac(q, c), aj(q, c), tpu ? ap(q) : Infinity);
/** CO₂ where the limit hands over from RuBisCO to RuBP regeneration. */
const handover = (q: Leaf): number => { let c = 50; while (ac(q, c) < aj(q, c) && c < 4000) c += 1; return c; };
const tpuFrom = (q: Leaf, from: number): number => { let c = from; while (aj(q, c) < ap(q) && c < 4000) c += 1; return c; };
const zeroAt = (q: Leaf): number => { let c = GS; while (amin(q, c) < 0) c += 1; return c; };
/** C₄: CO₂ is concentrated before RuBisCO, so uptake saturates at low leaf CO₂ (shape only). */
const a4 = (c: number): number => 26 * (1 - Math.exp(-(c - 10) / 60));

interface Frame { x0: number; x1: number; y0: number; y1: number; cmax: number; amax: number }
const X = (F: Frame, c: number): number => F.x0 + (c / F.cmax) * (F.x1 - F.x0);
const Y = (F: Frame, a: number): number => F.y0 - (a / F.amax) * (F.y0 - F.y1);
/** A curve from CO₂ `from` to `to`, kept inside 0 … amax. */
function seg(F: Frame, fn: (c: number) => number, from: number, to: number, step = 5): string {
  const pts: string[] = [];
  for (let c = from; c <= to + 0.01; c = c >= to ? to + 1 : Math.min(to, c + step)) {
    const a = fn(c);
    if (a > F.amax) break;
    if (a < 0) continue;
    pts.push(`${pts.length ? 'L' : 'M'}${f(X(F, c))},${f(Y(F, a))}`);
  }
  return pts.join('');
}
/** Closed area between two curves, for shading a gain. */
function band(F: Frame, hi: (c: number) => number, lo: (c: number) => number, from: number, to: number): string {
  const up: string[] = [], dn: string[] = [];
  for (let c = from; c <= to; c += 5) {
    up.push(`${f(X(F, c))},${f(Y(F, Math.min(F.amax, hi(c))))}`);
    dn.unshift(`${f(X(F, c))},${f(Y(F, Math.max(0, lo(c))))}`);
  }
  return `M${up.join('L')}L${dn.join('L')}Z`;
}
function axes(p: string, F: Frame, xl: string, yl: string, cls = 'tl', xly = F.y0 + 40, ylx = F.x0 - 22): string {
  return ar(p, 'g', `M${F.x0},${F.y0} V${F.y1 - 18}`, 'fc12-axis') + ar(p, 'g', `M${F.x0},${F.y0} H${F.x1 + 18}`, 'fc12-axis')
    + (xl ? T((F.x0 + F.x1) / 2, xly, xl, cls) : '')
    + (yl ? `<text class="${cls}" transform="translate(${ylx} ${(F.y0 + F.y1) / 2}) rotate(-90)" text-anchor="middle">${sym(yl)}</text>` : '');
}
/** The FvCB curve: solid where each limit acts, grey dashed where it is only a possibility. */
function fvcb(F: Frame, q: Leaf, opt: { tpu?: boolean; ext?: boolean; until?: number } = {}): string {
  const tpu = opt.tpu ?? true, ext = opt.ext ?? true;
  const hc = handover(q), cp = tpu ? tpuFrom(q, hc) : F.cmax, c0 = zeroAt(q), end = Math.min(opt.until ?? F.cmax, F.cmax);
  const A = (c: number): number => ac(q, c), J = (c: number): number => aj(q, c), P = (): number => ap(q);
  const ghost = ext ? `<path class="fc12-ext" d="${seg(F, A, hc, F.cmax)}"/><path class="fc12-ext" d="${seg(F, J, c0 + 4, hc)}"/>`
    + (tpu ? `<path class="fc12-ext" d="${seg(F, J, cp, F.cmax)}"/><path class="fc12-ext fc12-ext-p" d="M${f(X(F, hc))},${f(Y(F, P()))} H${f(X(F, cp))}"/>` : '') : '';
  return ghost
    + `<path class="fc12-cv fc12-cv-c" d="${seg(F, A, c0, Math.min(hc, end))}"/>`
    + (end > hc ? `<path class="fc12-cv fc12-cv-j" d="${seg(F, J, hc, Math.min(cp, end))}"/>` : '')
    + (tpu && end > cp ? `<path class="fc12-cv fc12-cv-p" d="${seg(F, P, cp, end)}"/>` : '');
}

/* ---------- a · the thesis scheme (MSc thesis Fig. 2b), with the three limits ---------- */

function schemeSvg(): string {
  const p = 'fc12a';
  const lim = (x: number, y: number, head: string, ls: string[], l: Lim, anchor: Anchor): string =>
    T(x, y, head, `lab lab-b fc12-t${l}`, anchor) + ls.map((s, i) => T(x, y + 28 * (i + 1), s, 'sm', anchor)).join('');
  return svg(p, 'FvCB scheme after the MSc thesis: RuBisCO carboxylation and oxygenation, PGA reduction, RuBP regeneration and export, with braces for the three limits: Ac by RuBisCO capacity, Aj by electron transport, Ap by triose-phosphate use',
    `${brace(186, 170, 440, -1, 'j')}${lim(158, 278, 'Aj ~ J', ['RuBP', 'regeneration'], 'j', 'end')}
    ${brace(186, 462, 592, -1, 'c')}${lim(158, 506, 'Ac ~ Vcmax', ['RuBisCO', 'capacity'], 'c', 'end')}
    ${brace(628, 24, 116, 1, 'p')}${lim(652, 62, 'Ap ~ TPU', ['triose-P use'], 'p', 'start')}

    ${rubisco(400, 516, 128)}
    ${pent(400, 452, 44)}
    ${molecule(294, 574, 'OCO', 12)}${gasAr(p, 'M322,560 L344,542')}
    ${molecule(506, 574, 'OO', 12)}${gasAr(p, 'M482,560 L458,542')}

    ${arrow(p, 'ink', 'M400,406 L400,362')}${T(388, 396, 'carboxylation', 'sm', 'end')}
    ${pill(400, 338, 104, T(400, 346, 'PGA', 'sm lab-b'))}
    ${arrow(p, 'ink', 'M400,316 L400,182', 'boost')}
    ${T(416, 216, 'reduction', 'sm', 'start')}${tag(448, 254, 'ATP', 'atp')}${tag(540, 254, 'NADPH', 'nadph')}
    ${pill(400, 158, 150, T(400, 166, 'triose-P', 'sm lab-b'))}

    <path class="ar ar-ink" d="M325,158 C224,158 204,318 226,384 S320,470 366,462" marker-end="url(#${p}-ink)"/>
    ${T(272, 112, 'regeneration', 'sm')}${T(272, 140, '5 of 6', 'sm lab-b')}${tag(262, 300, 'ATP', 'atp')}

    ${arrow(p, 'ink', 'M446,136 L500,96')}${T(494, 138, '1 of 6', 'sm lab-b', 'start')}
    ${pill(558, 74, 116, T(558, 82, 'sugar', 'sm lab-b'))}
    ${tag(452, 48, '', 'pi')}${arrow(p, 'ink', 'M446,66 L420,130', 'dashed')}

    ${arrow(p, 'clay', 'M436,440 L508,416', 'dashed')}${T(480, 472, 'oxygenation', 'sm fc12-pr', 'start')}
    ${pill(594, 410, 168, `<text class="sm lab-b" x="594" y="418" text-anchor="middle">PGA + <tspan class="fc12-pr-t">2-PG</tspan></text>`)}
    ${arrow(p, 'clay', 'M548,388 C540,366 488,366 458,354', 'dashed')}
    ${arrow(p, 'clay', 'M640,388 L640,334', 'dashed')}
    ${pill(664, 310, 210, T(664, 318, 'photorespiration', 'sm fc12-pr'), 'node node-pr')}
    ${arrow(p, 'clay', 'M558,304 L460,328', 'dashed')}${T(504, 296, '3 of 4 C back', 'tiny')}
    ${gasAr(p, 'M706,288 L720,236', 'dashed')}${molecule(726, 218, 'OCO', 10)}${T(726, 192, '1 of 4 C lost', 'tiny')}
    ${T(784, 566, 'PGA: 3-phosphoglycerate', 'tiny', 'end')}${T(784, 588, '2-PG: 2-phosphoglycolate', 'tiny', 'end')}`);
}

/* ---------- b · one A–Cc curve in the thesis Fig. 5 style ---------- */

function curveSvg(): string {
  const p = 'fc12b', q = BASE;
  const F: Frame = { x0: 120, x1: 770, y0: 470, y1: 76, cmax: 1400, amax: 38 };
  const hc = handover(q), xh = X(F, hc), yh = Y(F, ac(q, hc));
  const key = (y: number, l: Lim, s: string, label: string): string =>
    `<path class="fc12-cv fc12-cv-${l}" d="M392,${y - 8} H428"/>${T(440, y, s, `sm lab-b fc12-t${l}`, 'start')}${T(476, y, label, 'sm', 'start')}`;
  return svg(p, 'Illustrative CO₂ response of net uptake in the style of the MSc thesis Fig. 5: RuBisCO-limited (red) at low CO₂, RuBP-regeneration-limited (cyan) at higher CO₂, sometimes capped by triose-phosphate use (purple); grey dashed lines extend each limit where it does not act',
    `${axes(p, F, 'CO₂ at RuBisCO, Cc →', 'net CO₂ uptake, A →')}
    ${fvcb(F, q)}
    <circle class="fc12-dot" cx="${f(xh)}" cy="${f(yh)}" r="8"/>
    ${T(xh - 18, yh - 40, 'limiting step', 'sm', 'end')}${T(xh - 18, yh - 16, 'switches', 'sm', 'end')}
    ${T(X(F, 250) + 18, Y(F, ac(q, 250)) + 30, 'Ac', 'lab lab-b fc12-tc', 'start')}
    ${T(X(F, 660), Y(F, aj(q, 660)) + 34, 'Aj', 'lab lab-b fc12-tj')}
    ${T(X(F, 1180), Y(F, ap(q)) + 42, 'Ap', 'lab lab-b fc12-tp')}
    ${key(352, 'c', 'Ac', 'RuBisCO-limited')}
    ${key(392, 'j', 'Aj', 'RuBP-regeneration-limited')}
    ${key(432, 'p', 'Ap', 'TPU-limited (triose-P use)')}
    ${ILLUS(784, 590)}`);
}

/* ---------- c · the scheme laid out along the CO₂ axis, above the curve it explains ---------- */

function alignedSvg(): string {
  const p = 'fc12c', q = BASE;
  const F: Frame = { x0: 70, x1: 770, y0: 552, y1: 344, cmax: 1400, amax: 38 };
  const hc = handover(q), cp = tpuFrom(q, hc), xa = X(F, hc), xb = X(F, cp);
  const zone = (x0: number, x1: number, l: Lim): string =>
    `<rect class="fc12-zone fc12-zone-${l}" x="${f(x0 + 3)}" y="16" width="${f(x1 - x0 - 6)}" height="${f(F.y0 - 16)}" rx="16"/>`;
  const head = (x0: number, x1: number, l: Lim, a: string, b: string, c: string): string =>
    T((x0 + x1) / 2, 48, a, `lab lab-b fc12-t${l}`) + T((x0 + x1) / 2, 74, b, 'sm lab-b') + T((x0 + x1) / 2, 98, c, 'sm');
  return svg(p, 'The carbon cycle laid out from left to right in three zones, RuBisCO, RuBP regeneration and sugar export, above an illustrative CO₂ response whose three stretches sit under the zone that limits them',
    `${zone(F.x0, xa, 'c')}${zone(xa, xb, 'j')}${zone(xb, F.x1, 'p')}
    ${head(F.x0, xa, 'c', 'Ac', 'RuBisCO', 'capacity, Vcmax')}${head(xa, xb, 'j', 'Aj', 'RuBP regeneration', 'light-driven, J')}${head(xb, F.x1, 'p', 'Ap', 'sugar export', 'triose-P use, TPU')}

    ${molecule(181, 136, 'OCO', 10)}${arrow(p, 'ink', 'M181,150 L181,174')}
    ${rubisco(181, 200, 116)}
    ${pent(181, 276, 26, 'RuBP', 'tiny')}${arrow(p, 'ink', 'M181,250 L181,226')}
    ${arrow(p, 'ink', 'M241,200 L298,200')}
    ${pill(340, 200, 76, T(340, 208, 'PGA', 'sm lab-b'))}
    ${arrow(p, 'ink', 'M380,200 L418,200', 'boost')}
    ${tag(366, 142, 'ATP', 'atp')}${tag(450, 142, 'NADPH', 'nadph')}${arrow(p, 'ink', 'M376,160 L400,188')}${arrow(p, 'ink', 'M436,160 L414,188')}
    ${pill(478, 200, 108, T(478, 208, 'triose-P', 'sm lab-b'))}
    <path class="ar ar-ink" d="M462,222 C446,284 300,288 212,280" marker-end="url(#${p}-ink)"/>${T(344, 306, '5 of 6 rebuild RuBP', 'tiny')}
    ${arrow(p, 'ink', 'M534,200 L594,200')}${T(564, 186, '1 of 6', 'tiny')}
    ${pill(662, 200, 124, T(662, 208, 'sugar', 'sm lab-b'))}
    ${tag(612, 262, '', 'pi')}${arrow(p, 'ink', 'M596,254 L534,220', 'dashed')}${T(634, 268, 'Pᵢ back', 'tiny', 'start')}

    ${axes(p, F, 'CO₂ at RuBisCO, Cc →', 'net uptake, A →', 'sm', F.y0 + 32, F.x0 - 18)}
    ${fvcb(F, q)}
    ${T(F.x1 - 4, 594, 'illustrative', 'fc12-ill', 'end')}`);
}

/* ---------- d · analogy: a kitchen that re-uses its plates ---------- */

function kitchenSvg(): string {
  const p = 'fc12d';
  const basket = (x: number, y: number): string =>
    `<path class="fc12-basket" d="M${x - 46},${y - 14} H${x + 46} L${x + 36},${y + 30} H${x - 36} Z"/><path class="fc12-weave" d="M${x - 40},${y + 2} H${x + 40} M${x - 37},${y + 16} H${x + 37}"/>`
    + molecule(x - 24, y - 26, 'OCO', 8) + molecule(x + 22, y - 26, 'OCO', 8) + molecule(x, y - 44, 'OCO', 8);
  const stove = (x: number, y: number): string =>
    `<rect class="fc12-app" x="${x - 68}" y="${y - 40}" width="136" height="96" rx="10"/><path class="fc12-weave" d="M${x - 68},${y - 20} H${x + 68}"/>`
    + `<circle class="fc12-knob" cx="${x - 48}" cy="${y - 30}" r="5"/><circle class="fc12-knob" cx="${x - 32}" cy="${y - 30}" r="5"/>`
    + `<rect class="fc12-app-in" x="${x - 48}" y="${y - 8}" width="96" height="50" rx="6"/>`
    + `<path class="fc12-pan" d="M${x - 40},${y - 58} H${x + 30} L${x + 24},${y - 42} H${x - 34} Z"/><path class="fc12-handle" d="M${x + 30},${y - 54} H${x + 62}"/>`;
  const plates = (x: number, y: number, n: number): string =>
    Array.from({ length: n }, (_, i) => `<ellipse class="fc12-plate" cx="${x}" cy="${y - i * 9}" rx="40" ry="10"/>`).join('')
    + pent(x, y - (n - 1) * 9 - 2, 9, '');
  const washer = (x: number, y: number): string =>
    `<rect class="fc12-app" x="${x - 66}" y="${y - 52}" width="132" height="104" rx="10"/><path class="fc12-weave" d="M${x - 66},${y - 32} H${x + 66}"/>`
    + `<circle class="fc12-knob" cx="${x + 46}" cy="${y - 42}" r="5"/><rect class="fc12-app-in" x="${x - 50}" y="${y - 22}" width="100" height="62" rx="8"/>`
    + [-30, -12, 6, 24].map(dx => `<ellipse class="fc12-plate" cx="${x + dx}" cy="${y + 10}" rx="6" ry="22"/>`).join('');
  const hatch = (x: number, y: number): string =>
    `<rect class="fc12-app" x="${x - 60}" y="${y - 44}" width="120" height="84" rx="6"/><rect class="fc12-app-in" x="${x - 46}" y="${y - 32}" width="92" height="56" rx="4"/>`
    + `<path class="fc12-box" d="M${x - 20},${y - 2} H${x + 20} V${y + 22} H${x - 20} Z"/><path class="fc12-weave" d="M${x - 8},${y - 2} q8,-12 16,0"/>`;
  const name = (x: number, y: number, a: string, b: string, cls = 'sm'): string => T(x, y, a, 'sm lab-b') + T(x, y + 26, b, cls);
  return svg(p, 'Analogy: a kitchen that re-uses its plates. Ingredients are CO₂, the cook is RuBisCO, clean plates are RuBP, the dishwasher powered by light is RuBP regeneration, and the take-away hatch is sugar export. Meals per hour are set by the slowest station.',
    `${basket(84, 156)}${name(84, 218, 'ingredients', '= CO₂')}
    ${arrow(p, 'ink', 'M138,160 L212,160')}
    ${stove(290, 164)}${name(290, 50, 'cook', '= RuBisCO, top speed Vcmax', 'sm fc12-tc')}
    ${arrow(p, 'ink', 'M366,150 L582,150')}${T(474, 136, 'meal served', 'tiny')}
    ${hatch(650, 160)}${name(650, 56, 'take-away hatch', '= sugar export, TPU', 'sm fc12-tp')}
    ${arrow(p, 'ink', 'M650,208 L650,272')}${T(638, 246, 'used plate', 'tiny', 'end')}
    ${washer(650, 334)}${name(650, 412, 'dishwasher', '= RuBP regeneration', 'sm fc12-tj')}
    ${bolt(p, 784, 262, 724, 306)}${T(790, 226, 'light: ATP +', 'tiny', 'end')}${T(790, 246, 'NADPH (J)', 'tiny', 'end')}
    ${arrow(p, 'ink', 'M576,342 L346,342')}
    ${plates(290, 362, 4)}${name(290, 396, 'clean plates', '= RuBP')}
    ${arrow(p, 'ink', 'M240,340 C204,326 200,262 220,226')}

    <path class="rule" d="M24,462 H776"/>
    ${T(400, 496, 'Meals per hour = the slowest station', 'lab lab-b')}
    <circle class="fc12-dot-c" cx="186" cy="520" r="7"/>${T(204, 527, 'low CO₂: the cook waits for food → Ac', 'sm', 'start')}
    <circle class="fc12-dot-j" cx="186" cy="550" r="7"/>${T(204, 557, 'high CO₂: the cook waits for plates → Aj', 'sm', 'start')}
    <circle class="fc12-dot-p" cx="186" cy="580" r="7"/>${T(204, 587, 'hatch backed up → Ap', 'sm', 'start')}`);
}

/* ---------- e · raise CO₂: the limit hands over (storyboard) ---------- */

function raiseSvg(): string {
  const p = 'fc12e', q: Leaf = { ...BASE, tpu: 99 };
  const hc = handover(q);
  const cols: Array<{ cx: number; c: number; title: string; co2: number; rubp: number; head: string; l: Lim | 'both'; sub: string }> = [
    { cx: 136, c: 190, title: 'Low CO₂', co2: 1, rubp: 5, head: 'RuBisCO limits', l: 'c', sub: 'RuBP waits for CO₂' },
    { cx: 400, c: hc, title: 'Hand-over', co2: 3, rubp: 3, head: 'co-limited', l: 'both', sub: 'the limit switches' },
    { cx: 664, c: 1100, title: 'High CO₂', co2: 6, rubp: 1, head: 'regeneration limits', l: 'j', sub: 'CO₂ waits for RuBP' },
  ];
  const col = (k: number): string => {
    const o = cols[k], F: Frame = { x0: o.cx - 104, x1: o.cx + 106, y0: 244, y1: 112, cmax: 1400, amax: 30 };
    const co2 = Array.from({ length: o.co2 }, (_, i) => molecule(o.cx - 78 + (i % 2) * 48, 330 + Math.floor(i / 2) * 26, 'OCO', 7)).join('');
    const rubp = Array.from({ length: o.rubp }, (_, i) => pent(o.cx + 30 + (i % 3) * 30, 334 + Math.floor(i / 3) * 34, 13, '')).join('');
    const headCls = o.l === 'both' ? 'sm lab-b' : `sm lab-b fc12-t${o.l}`;
    return `${num(o.cx - 98, 50, `${k + 1}`)}${T(o.cx - 74, 58, o.title, 'lab lab-b', 'start')}
      ${ar(p, 'g', `M${F.x0},${F.y0} V${F.y1 - 10}`, 'fc12-axis')}${ar(p, 'g', `M${F.x0},${F.y0} H${F.x1 + 10}`, 'fc12-axis')}
      ${T(F.x0 - 8, F.y1 + 4, 'A', 'tiny', 'end')}${T(F.x1 + 12, F.y0 + 24, 'CO₂ →', 'tiny', 'end')}
      <path class="fc12-ext" d="${seg(F, c => amin(q, c, false), zeroAt(q), F.cmax)}"/>
      ${fvcb(F, q, { tpu: false, ext: false, until: o.c })}
      <circle class="fc12-dot" cx="${f(X(F, o.c))}" cy="${f(Y(F, amin(q, o.c, false)))}" r="7"/>
      <rect class="fc12-tray" x="${o.cx - 112}" y="280" width="224" height="170" rx="16"/>
      ${T(o.cx - 54, 304, 'CO₂ waiting', 'tiny')}${T(o.cx + 60, 304, 'RuBP waiting', 'tiny')}
      ${co2}${rubp}
      ${rubisco(o.cx, 422, 108, 36)}
      ${T(o.cx, 484, o.head, headCls)}${T(o.cx, 510, o.sub, 'sm')}`;
  };
  return svg(p, 'Storyboard in three steps. Low CO₂: RuBP waits for CO₂ and RuBisCO limits. Hand-over: both just keep up. High CO₂: CO₂ waits for RuBP and its regeneration limits. A dot moves along an illustrative CO₂ response.',
    `${col(0)}${col(1)}${col(2)}
    ${ar(p, 'k', 'M40,552 H752', 'fc12-raise')}${T(400, 584, 'raise CO₂', 'sm lab-b')}
    ${T(784, 590, 'illustrative', 'fc12-ill', 'end')}`);
}

/* ---------- f · two knobs: more RuBisCO or more electron transport ---------- */

function knobsSvg(): string {
  const p = 'fc12f';
  const KB: Leaf = { vc: 60, j: 125, tpu: 99 }; // a leaf whose hand-over sits mid-axis, so both knobs show
  const panel = (x: number, title: string, sub: string, q: Leaf, l: Lim, gain: string): string => {
    const F: Frame = { x0: x + 44, x1: x + 330, y0: 430, y1: 140, cmax: 1200, amax: 36 };
    const old = (c: number): number => amin(KB, c, false), nw = (c: number): number => amin(q, c, false);
    const from = l === 'c' ? zeroAt(q) : handover(KB), to = l === 'c' ? handover(KB) : F.cmax;
    return `${T(x + 187, 54, title, `lab lab-b fc12-t${l}`)}${T(x + 187, 84, sub, 'sm')}
      ${axes(p, F, 'CO₂ at RuBisCO →', 'net uptake, A →', 'sm', F.y0 + 30, F.x0 - 16)}
      <path class="fc12-gain fc12-gain-${l}" d="${band(F, nw, old, from, to)}"/>
      <path class="fc12-ext" d="${seg(F, old, zeroAt(KB), F.cmax)}"/>
      ${fvcb(F, q, { tpu: false, ext: false })}
      ${T(x + 187, 510, gain, `sm lab-b fc12-t${l}`)}`;
  };
  return svg(p, 'Two knobs on the illustrative CO₂ response. More RuBisCO (Vcmax up) raises uptake only at low CO₂. More electron transport (J up, with more light or capacity) raises it only at high CO₂. Grey dashed: the curve before; shading: the gain.',
    `${panel(16, 'More RuBisCO', 'turn up Vcmax', { vc: 90, j: 125, tpu: 99 }, 'c', 'gain at low CO₂ only')}
    ${panel(410, 'More electron transport', 'turn up J (light, Jmax)', { vc: 60, j: 150, tpu: 99 }, 'j', 'gain at high CO₂ only')}
    <path class="rule" d="M400,40 V520"/>
    ${T(400, 566, 'dashed: before the change · shaded: the gain', 'tiny')}
    ${T(784, 592, 'illustrative', 'fc12-ill', 'end')}`);
}

/* ---------- g · C₃ against C₄ as CO₂ rises ---------- */

function c4Svg(): string {
  const p = 'fc12g', q: Leaf = { ...BASE, tpu: 99 };
  const F: Frame = { x0: 120, x1: 690, y0: 470, y1: 110, cmax: 1000, amax: 30 };
  const c1 = 250, c2 = 400, x1 = X(F, c1), x2 = X(F, c2);
  const a3 = (c: number): number => amin(q, c, false);
  const vb = (x: number, ya: number, yb: number, cls: string): string =>
    `<path class="${cls}" d="M${f(x - 7)},${f(ya)} H${f(x)} V${f(yb)} H${f(x - 7)}"/>`;
  return svg(p, 'Illustrative CO₂ responses of a C₃ and a C₄ leaf. The C₄ curve saturates at low leaf CO₂ because CO₂ is concentrated at RuBisCO; the C₃ curve keeps climbing, so the same rise in CO₂ gives C₃ a large gain and C₄ almost none.',
    `<rect class="fc12-rise" x="${f(x1)}" y="${F.y1 - 22}" width="${f(x2 - x1)}" height="${f(F.y0 - F.y1 + 22)}"/>
    ${ar(p, 'k', `M${f(x1 + 10)},${F.y1 - 6} H${f(x2 - 8)}`)}${T((x1 + x2) / 2, F.y1 - 34, 'rising CO₂', 'sm lab-b')}
    ${axes(p, F, 'CO₂ inside the leaf, Ci →', 'net CO₂ uptake, A →')}
    <path class="fc12-cv fc12-cv-4" d="${seg(F, a4, 12, F.cmax)}"/>
    ${fvcb(F, q, { tpu: false, ext: false })}
    <path class="fc12-guide" d="M${f(x1)},${f(Y(F, a3(c1)))} H${f(x2 + 16)}"/>
    ${vb(x2 + 18, Y(F, a3(c1)), Y(F, a3(c2)), 'fc12-dlt fc12-dlt-3')}
    ${T(x2 + 30, (Y(F, a3(c1)) + Y(F, a3(c2))) / 2 + 8, 'big gain', 'sm lab-b', 'start')}
    ${T(x2 + 30, Y(F, a4(c2)) - 16, 'little gain', 'sm lab-b', 'start')}
    ${T(F.x1 + 12, Y(F, a4(F.cmax)) + 8, 'C₄', 'lab lab-b fc12-t4', 'start')}
    ${T(F.x1 + 12, Y(F, a3(F.cmax)) + 8, 'C₃', 'lab lab-b', 'start')}
    ${T(F.x1, 400, 'C₄ concentrates CO₂ at RuBisCO,', 'sm', 'end')}
    ${T(F.x1, 426, 'so it saturates early', 'sm', 'end')}
    ${T(120, 554, 'C₃:', 'sm lab-b', 'start')}<path class="fc12-cv fc12-cv-c" d="M164,547 H194"/>${T(204, 554, 'RuBisCO-limited', 'sm', 'start')}
    <path class="fc12-cv fc12-cv-j" d="M384,547 H414"/>${T(424, 554, 'RuBP-regeneration-limited', 'sm', 'start')}`);
}

/* ---------- h · the field test: FACE, then a 20-year surprise ---------- */

function faceSvg(): string {
  const p = 'fc12h';
  const cx = 196, cy = 240, rx = 150, ry = 58;
  const posts = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
    return { x, y, back: Math.sin(a) < 0 };
  });
  const post = (o: { x: number; y: number }): string => `<path class="fc12-post" d="M${f(o.x)},${f(o.y)} V${f(o.y - 64)}"/><circle class="fc12-vent" cx="${f(o.x)}" cy="${f(o.y - 64)}" r="4"/>`;
  const rows = Array.from({ length: 7 }, (_, i) => {
    const y = cy - ry + 16 + i * 15, w = rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2)) - 10;
    return `<path class="fc12-row" d="M${f(cx - w)},${f(y)} H${f(cx + w)}"/>`;
  }).join('');
  const s = 13; // px per % yield change
  return svg(p, 'The field test. In open-air CO₂ enrichment (FACE), a ring of pipes raises CO₂ over a crop: C₃ crop yield rose by about 18 % at about +200 ppm without stress, about 10 % with low nitrogen or 2 °C of warming; C₄ crops gained only under drought. In one 20-year grassland trial the biomass response reversed after year 12; the cause is debated.',
    `${T(196, 50, 'Open-air CO₂ enrichment', 'lab lab-b')}${T(196, 80, 'FACE: pipes add CO₂ over a crop', 'sm')}
    ${posts.filter(o => o.back).map(post).join('')}
    <ellipse class="fc12-field" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>${rows}
    ${posts.filter(o => !o.back).map(post).join('')}
    ${[[-96, 174], [-30, 154], [44, 160], [104, 180]].map(([dx, y]) => molecule(cx + dx, y, 'OCO', 7)).join('')}

    ${T(430, 50, 'crop yield with extra CO₂', 'sm lab-b', 'start')}
    <path class="fc12-zero" d="M436,74 V316"/>
    ${T(436, 116, 'C₃ crops', 'lab lab-b', 'start')}
    <rect class="fc12-bar" x="436" y="130" width="${18 * s}" height="34" rx="4"/>${T(436 + 18 * s + 12, 156, '≈ +18 %', 'lab lab-b', 'start')}
    ${T(452, 190, 'at +200 ppm, no stress;', 'sm', 'start')}${T(452, 214, '≈ +10 % with low N or +2 °C', 'sm', 'start')}
    ${T(436, 262, 'C₄ crops', 'lab lab-b', 'start')}
    <path class="fc12-nil" d="M436,276 V306"/>${T(452, 298, 'no gain, except in drought', 'sm', 'start')}

    <path class="rule" d="M24,350 H776"/>
    ${T(24, 392, '20 years in one grassland trial: biomass', 'lab lab-b', 'start')}
    <path class="fc12-time" d="M40,472 H760"/>
    ${[0, 12, 20].map(yr => `<path class="fc12-time" d="M${40 + yr * 36},464 V480"/>${T(40 + yr * 36, 506, `${yr === 0 ? 'start' : `year ${yr}`}`, 'tiny')}`).join('')}
    <rect class="fc12-span fc12-span-3" x="44" y="442" width="${12 * 36 - 8}" height="20" rx="10"/>
    <rect class="fc12-span fc12-span-4" x="${44 + 12 * 36}" y="442" width="${8 * 36 - 8}" height="20" rx="10"/>
    ${T(40 + 6 * 36, 432, 'C₃ grasses gained more', 'sm', 'middle')}
    ${T(40 + 16 * 36, 432, 'then C₄ gained more', 'sm', 'middle')}
    ${T(400, 560, 'one trial; the cause (soil nitrogen) is debated', 'note')}`);
}

/* ---------- i · the equation: each FvCB limit sits under one of its terms ---------- */

function equationSvg(): string {
  const p = 'fc12i';
  const E = equation(400, 76, 34), x = E.x;
  const box = (cx: number, l: Lim, a: string, b: string, c: string): string =>
    `<rect class="fc12-lbox fc12-lbox-${l}" x="${cx - 116}" y="330" width="232" height="104" rx="18"/>`
    + T(cx, 368, a, `lab lab-b fc12-t${l}`) + T(cx, 396, b, 'sm') + T(cx, 422, c, 'sm');
  const L = 140, M = 400, R = 660;
  return svg(p, 'The photosynthesis equation with each FvCB limit under the term it belongs to: CO₂ meets RuBisCO (Ac, Vcmax); light drives electron transport that rebuilds RuBP (Aj, J); sugar must be exported (Ap, TPU). Net uptake is the lowest of the three.',
    `${E.svg}
    <path class="fc12-lead" d="M${f(x.co2)},100 L${L},150"/><path class="fc12-lead" d="M${f(x.light)},100 L${M},146"/><path class="fc12-lead" d="M${f(x.sugar)},100 L${R},150"/>
    ${molecule(L, 172, 'OCO', 11)}${arrow(p, 'ink', `M${L},188 L${L},218`)}${rubisco(L - 14, 246, 112)}${pent(L + 88, 250, 29, 'RuBP', 'tiny')}${arrow(p, 'ink', `M${L + 58},246 L${L + 46},246`)}
    ${bolt(p, M - 20, 150, M, 196)}${tag(M - 44, 228, 'ATP', 'atp')}${tag(M + 50, 228, 'NADPH', 'nadph')}${T(M, 278, 'rebuild RuBP', 'sm')}
    ${pill(R, 196, 132, T(R, 204, 'triose-P', 'sm lab-b'))}${arrow(p, 'ink', `M${R},220 L${R},248`)}${T(R, 278, 'leaves as sucrose', 'sm')}
    ${ar(p, 'c', `M${L},280 L${L},322`)}${ar(p, 'j', `M${M},290 L${M},322`)}${ar(p, 'p', `M${R},290 L${R},322`)}
    ${box(L, 'c', 'Ac', 'RuBisCO capacity', 'Vcmax, and CO₂')}
    ${box(M, 'j', 'Aj', 'electron transport', 'J, set by light')}
    ${box(R, 'p', 'Ap', 'triose-P use', 'TPU, sugar export')}
    ${ar(p, 'k', `M${L},440 C${L},486 ${M - 120},494 ${M - 76},504`)}${ar(p, 'k', `M${M},440 L${M},486`)}${ar(p, 'k', `M${R},440 C${R},486 ${M + 120},494 ${M + 76},504`)}
    <rect class="fc12-out" x="${M - 170}" y="500" width="340" height="80" rx="20"/>
    ${T(M, 534, 'net CO₂ uptake, A', 'lab lab-b')}${T(M, 562, '= the lowest of the three', 'sm')}`);
}

/* ---------- j · where each limit sits in the chloroplast ---------- */

function chloroplastSvg(): string {
  const p = 'fc12j';
  const cx = 360, cy = 320, rx = 260, ry = 170;
  const granum = (x: number, y: number, n: number): string =>
    Array.from({ length: n }, (_, i) => `<rect class="fc12-thy" x="${x - 30}" y="${y - n * 8 + i * 16}" width="60" height="12" rx="6"/>`).join('');
  const callout = (x: number, y: number, w: number, l: Lim, a: string, b: string): string =>
    `<rect class="fc12-lbox fc12-lbox-${l}" x="${x}" y="${y}" width="${w}" height="68" rx="14"/>`
    + T(x + 16, y + 29, a, `sm lab-b fc12-t${l}`, 'start') + T(x + 16, y + 56, b, 'sm', 'start');
  return svg(p, 'Where each FvCB limit sits. In a chloroplast, thylakoids turn light into ATP and NADPH (electron transport, Aj); in the stroma, RuBisCO fixes CO₂ arriving from the air (Ac); at the envelope, triose phosphate leaves for sucrose synthesis in the cytosol in exchange for phosphate (Ap).',
    `<path class="fc12-leaf" d="M18,96 C58,30 156,26 202,64 C158,108 72,124 18,96 Z"/><path class="fc12-vein" d="M24,94 C78,78 138,64 198,64"/>
    ${T(110, 136, 'leaf', 'sm', 'middle')}
    <circle class="fc12-zoom" cx="150" cy="74" r="11"/><path class="fc12-zoomline" d="M160,80 L${cx - 60},${cy - ry + 2} M144,84 L${cx - rx + 30},${cy - 70}"/>
    <ellipse class="fc12-env" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/><ellipse class="fc12-env-in" cx="${cx}" cy="${cy}" rx="${rx - 9}" ry="${ry - 9}"/>
    ${T(cx + 10, cy + ry - 30, 'stroma', 'note')}
    ${granum(190, 320, 6)}${granum(256, 356, 5)}<path class="fc12-thy-l" d="M220,316 H226 M216,348 H226"/>
    ${bolt(p, 112, 196, 176, 262)}${T(110, 186, 'light', 'sm', 'middle')}
    ${tag(346, 318, 'ATP', 'atp')}${tag(346, 360, 'NADPH', 'nadph')}${arrow(p, 'ink', 'M360,298 L374,270')}
    ${molecule(470, 92, 'OCO', 11)}${arrow(p, 'ink', 'M470,110 L470,224')}${T(434, 100, 'CO₂ from the air', 'sm', 'end')}
    ${rubisco(478, 248, 112)}${pent(382, 252, 28, 'RuBP', 'tiny')}${arrow(p, 'ink', 'M410,250 L418,250')}
    ${arrow(p, 'ink', 'M478,272 L478,322')}${pill(478, 346, 112, T(478, 354, 'triose-P', 'sm lab-b'))}
    <rect class="fc12-tpt" x="${cx + rx - 16}" y="332" width="30" height="30" rx="6"/>
    ${arrow(p, 'ink', `M536,346 L${cx + rx + 50},346`)}
    ${tag(cx + rx + 54, 420, '', 'pi')}${arrow(p, 'ink', `M${cx + rx + 40},410 L${cx + rx + 12},372`, 'dashed')}
    ${pill(728, 300, 112, T(728, 308, 'sucrose', 'sm lab-b'), 'node node-out')}${arrow(p, 'ink', `M${cx + rx + 56},340 L708,322`)}${T(728, 262, 'cytosol', 'tiny')}
    ${callout(530, 22, 258, 'c', 'Ac · RuBisCO', 'Vcmax and CO₂ supply')}
    ${callout(16, 510, 262, 'j', 'Aj · thylakoids', 'electron transport, J')}
    ${callout(530, 510, 258, 'p', 'Ap · envelope', 'triose-P use, TPU')}`);
}
