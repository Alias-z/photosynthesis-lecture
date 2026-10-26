// Slide L03 · Light is a wave (since 26 Oct 2026; was "The solar spectrum"). Light-block order v5
// (research/figure-briefs/ORDER_PROPOSAL.md): wavelength explains the blue sky and gives the spectrum we see and use.
// Variants P–T each show λ on blue and red waves, the spectrum on a wavelength axis, scattering by air molecules and
// Rayleigh's clipping (research/figure-briefs/SLIDE34_BRIEF.md); the earlier spectrum-only variants still draw by id.
// Photon energy (E = hc/λ) belongs to L04 and is left out here.
import type { PlateText, Variant } from '../types';
import { spec } from '../../lib/colour';
import { heads } from '../mechanisms';
import { clipping, clipHeight, RAYLEIGH_SLIDE } from './clipping';
import { airMol, beam as waves, defs as waveDefs, eye as eyeS2, wv as wave } from './s2';
import type { Col } from './s2';
import './l03.css';

export const PLATE: PlateText = {
  n: '3',
  status: 'confirmed',
  title: 'Light is a wave',
  lead: 'Light is an electromagnetic wave; its wavelength (λ) sets its colour.',
  points: [
    { claim: 'Electromagnetic spectrum.', text: 'Sunlight mixes ultraviolet, visible and infrared light.' },
    { claim: 'Visible light and PAR.', text: 'Human vision: 380–780 nm<br>PAR (photosynthetically active radiation): 400–700 nm, by convention' },
    { claim: 'Rayleigh scattering.', text: 'Scattered intensity <span class="math">∝</span> 1/λ⁴<br>Blue is scattered ~4× more than red: blue sky by day, red Sun at sunset.' },
  ],
  play: 'life',
  refs: [
    { label: 'Rayleigh 1871', url: 'https://doi.org/10.1080/14786447108640452' },
    { label: 'CIE: visible radiation', url: 'https://cie.co.at/eilvterm/17-21-003' },
    { label: 'CIE: PAR', url: 'https://cie.co.at/eilvterm/17-26-079' },
    { label: 'Kasten & Young 1989', url: 'https://doi.org/10.1364/AO.28.004735' },
    { label: 'Gan et al. 2014', url: 'https://doi.org/10.1126/science.1256963' },
  ],
};

// Round 4 (26 Oct 2026): the lecturer picked S; U–Y are five variants built from it. P, R, T and the older
// spectrum-only variants (A–O) are unlisted but still draw by id.
export const VARIANTS: Variant[] = [
  { id: 's', name: 'Scattering curve' },
  { id: 'u', name: 'Brackets, clipping right' },
  { id: 'v', name: 'Bars on the axis' },
  { id: 'w', name: 'Bands, clipping on the graph' },
  { id: 'x', name: 'Big drawing' },
  { id: 'y', name: 'Tall curve' },
];

/* ---------- shared parts ---------- */

type A = 'start' | 'middle' | 'end';
type RGB = [number, number, number];
const f = (v: number): string => v.toFixed(1);
const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));
const T = (x: number, y: number, s: string, cls = 'fl03-s', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const rgb = (c: readonly number[]): string => `rgb(${c.map(v => Math.round(v)).join(',')})`;
const mix = (a: readonly number[], b: readonly number[], k: number): RGB => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

const PAGE: RGB = [250, 249, 245];
const UV_C: RGB = [221, 218, 232];
const IR_C: RGB = [233, 223, 214];
const L380 = Math.log10(380e-9), L780 = Math.log10(780e-9);

/** Display colour of a wavelength: spectral inside 380–780 nm, dimming toward the edges of vision; a pale neutral outside. */
function nmRGB(nm: number): RGB {
  if (nm < 380) return UV_C;
  if (nm > 780) return IR_C;
  const b = clamp(Math.min((nm - 372) / 46, (800 - nm) / 100), 0.3, 1);
  return mix([40, 26, 44], spec(nm), b);
}
/** The same, washed toward the page for large fills. */
const nmCol = (nm: number, wash = 0): string => rgb(mix(nmRGB(nm), PAGE, wash));

/** A horizontal gradient for wavelengths nm0…nm1 laid between x0 and x1 (user space). */
function grad(id: string, x0: number, x1: number, nm0: number, nm1: number, wash = 0): string {
  const n = Math.ceil((nm1 - nm0) / 4);
  const stops = Array.from({ length: n + 1 }, (_, i) => {
    const nm = nm0 + ((nm1 - nm0) * i) / n;
    return `<stop offset="${(i / n).toFixed(4)}" stop-color="${nmCol(nm, wash)}"/>`;
  }).join('');
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x0)}" y1="0" x2="${f(x1)}" y2="0">${stops}</linearGradient>`;
}

interface Ax { x0: number; x1: number; nm0: number; nm1: number }
const X = (a: Ax, nm: number): number => a.x0 + ((nm - a.nm0) / (a.nm1 - a.nm0)) * (a.x1 - a.x0);

/** A wavelength strip, with optional UV/IR labels in its margins. */
function strip(id: string, a: Ax, y: number, h: number, edges = true, wash = 0): string {
  const uv = a.nm0 < 380 && X(a, 380) - a.x0 > 30, ir = a.nm1 > 780 && a.x1 - X(a, 780) > 26;
  return `<defs>${grad(id, a.x0, a.x1, a.nm0, a.nm1, wash)}</defs>
    <rect x="${f(a.x0)}" y="${y}" width="${f(a.x1 - a.x0)}" height="${h}" rx="5" fill="url(#${id})"/>
    ${edges && uv ? T((a.x0 + X(a, 380)) / 2, y + h / 2 + 7, 'UV', 'fl03-in', 'middle') : ''}
    ${edges && ir ? T((X(a, 780) + a.x1) / 2, y + h / 2 + 7, 'IR', 'fl03-in', 'middle') : ''}`;
}

/** A bracket under (dir 1) or over (dir −1) a span, ticks pointing back at the strip. */
const bracket = (x0: number, x1: number, y: number, dir: 1 | -1, cls = 'fl03-br'): string =>
  `<path class="${cls}" d="M${f(x0)},${f(y - dir * 11)} V${y} H${f(x1)} V${f(y - dir * 11)}"/>`;

/* the electromagnetic spectrum on a log scale (log10 of wavelength in metres) */
const REG = [
  { name: 'gamma rays', short: 'gamma', a: -20, b: -11 },
  { name: 'X-rays', short: 'X-rays', a: -11, b: -8 },
  { name: 'ultraviolet', short: 'UV', a: -8, b: L380 },
  { name: 'visible', short: '', a: L380, b: L780 },
  { name: 'infrared', short: 'infrared', a: L780, b: -3 },
  { name: 'microwaves', short: 'microwaves', a: -3, b: 0 },
  { name: 'radio waves', short: 'radio waves', a: 0, b: 9 },
];
interface Em { x0: number; x1: number; lo: number; hi: number; y: number; h: number }
const EX = (e: Em, l: number): number => e.x0 + ((l - e.lo) / (e.hi - e.lo)) * (e.x1 - e.x0);
const TICKS: Array<[number, string]> = [[-12, '1 pm'], [-9, '1 nm'], [-6, '1 µm'], [-3, '1 mm'], [0, '1 m'], [3, '1 km']];

/** The whole spectrum as a bar; region names inside where they fit, kept clear of an `avoid` window (log range). */
function emBar(p: string, e: Em, o: { long?: boolean; ticks?: number[]; avoid?: [number, number] } = {}): string {
  const fits = (s: string, w: number): boolean => s.length * 10.6 + 8 < w;
  const regs = REG.map((r, i) => {
    const a = Math.max(r.a, e.lo), b = Math.min(r.b, e.hi);
    if (b <= a) return '';
    const xa = EX(e, a), xb = EX(e, b);
    const fill = r.name === 'visible' ? `fill="url(#${p}-emvis)"` : `class="${i % 2 ? 'fl03-em2' : 'fl03-em1'}"`;
    // the free stretch for the label: the region minus the avoided window, largest piece
    let la = xa, lb = xb;
    if (o.avoid) {
      const wa = EX(e, o.avoid[0]), wb = EX(e, o.avoid[1]);
      const left: [number, number] = [xa, Math.min(xb, wa)], right: [number, number] = [Math.max(xa, wb), xb];
      [la, lb] = left[1] - left[0] >= right[1] - right[0] ? left : right;
    }
    const names = [o.long ? r.name : r.short, r.name === 'infrared' ? 'IR' : ''].filter(Boolean);
    const name = names.find(s => fits(s, lb - la));
    const lab = name ? T((la + lb) / 2, e.y + e.h / 2 + 7, name, 'fl03-in', 'middle') : '';
    return `<rect x="${f(xa)}" y="${e.y}" width="${f(xb - xa)}" height="${e.h}" ${fill}/>${lab}`;
  }).join('');
  const seps = REG.slice(1).map(r => r.a).filter(l => l > e.lo && l < e.hi && Math.abs(l - L780) > 1e-6 && Math.abs(l - L380) > 1e-6)
    .map(l => `<path class="fl03-sep" d="M${f(EX(e, l))},${e.y} v${e.h}"/>`).join('');
  const ticks = (o.ticks ?? []).map(l => {
    const t = TICKS.find(k => k[0] === l);
    return t ? `<path class="fl03-tick" d="M${f(EX(e, l))},${e.y + e.h} v8"/>${T(EX(e, l), e.y + e.h + 30, t[1], 'fl03-tk', 'middle')}` : '';
  }).join('');
  return `<defs><clipPath id="${p}-emclip"><rect x="${e.x0}" y="${e.y}" width="${e.x1 - e.x0}" height="${e.h}" rx="8"/></clipPath>
      ${grad(`${p}-emvis`, EX(e, L380), EX(e, L780), 380, 780)}</defs>
    <g clip-path="url(#${p}-emclip)">${regs}${seps}</g>${ticks}`;
}

function sun(x: number, y: number, r: number): string {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6, c = Math.cos(a), s = Math.sin(a);
    return `M${f(x + c * (r + 7))},${f(y + s * (r + 7))}L${f(x + c * (r + 16))},${f(y + s * (r + 16))}`;
  }).join('');
  return `<path class="fl03-ray" d="${rays}"/><circle class="fl03-sun" cx="${x}" cy="${y}" r="${r}"/>`;
}

/** White light as a pale beam with a soft outline. */
const beam = (d: string, w = 9): string => `<path class="fl03-beam-o" d="${d}" style="stroke-width:${w + 4}"/><path class="fl03-beam" d="${d}" style="stroke-width:${w}"/>`;

/** An apex-up prism; returns the drawing and its entry and exit points on the two faces. */
function prism(cx: number, cy: number, s: number): { svg: string; inP: [number, number]; outP: [number, number] } {
  const h = (s * Math.sqrt(3)) / 2, A: [number, number] = [cx, cy - (2 * h) / 3], B: [number, number] = [cx - s / 2, cy + h / 3], C: [number, number] = [cx + s / 2, cy + h / 3];
  const at = (P: [number, number], t: number): [number, number] => [A[0] + (P[0] - A[0]) * t, A[1] + (P[1] - A[1]) * t];
  const inP = at(B, 0.56), outP = at(C, 0.56);
  return { svg: `<path class="fl03-prism" d="M${f(A[0])},${f(A[1])}L${f(B[0])},${f(B[1])}L${f(C[0])},${f(C[1])}Z"/>`, inP, outP };
}

/** A fan of coloured rays from a point to wavelengths on a strip. */
function fan(o: [number, number], a: Ax, y: number, nms: number[]): string {
  const xs = nms.map(nm => X(a, nm));
  const back = `<path class="fl03-fanbg" d="M${f(o[0])},${f(o[1])}L${f(xs[0])},${y}L${f(xs[xs.length - 1])},${y}Z"/>`;
  return back + nms.map((nm, i) => `<path class="fl03-fanray" style="stroke:${nmCol(nm)}" d="M${f(o[0])},${f(o[1])}L${f(xs[i])},${y}"/>`).join('');
}

/** A wave of one colour with a constant drawn wavelength (px) and an optional arrowhead. */
function wv(x0: number, y0: number, x1: number, y1: number, lam: number, col: string, o: { amp?: number; head?: string; w?: number; ph?: number; dash?: boolean } = {}): string {
  const amp = o.amp ?? 6, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const run = o.head ? L - 8 : L, ramp = lam * 0.7, n = Math.max(2, Math.ceil(run / 1.5));
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const d = (run * i) / n, e = Math.min(1, d / ramp, (run - d) / ramp), w = Math.sin((2 * Math.PI * d) / lam + (o.ph ?? 0)) * amp * e;
    pts.push(`${i ? 'L' : 'M'}${f(x0 + ux * d - uy * w)},${f(y0 + uy * d + ux * w)}`);
  }
  if (o.head) pts.push(`L${f(x1)},${f(y1)}`);
  return `<path class="fl03-w${o.dash ? ' fl03-w-dash' : ''}" style="stroke:${col}${o.w ? `;stroke-width:${o.w}` : ''}" d="${pts.join('')}"${o.head ? ` marker-end="url(#${o.head})"` : ''}/>`;
}
/** Arrowheads in any colour, for waves. */
const colHead = (id: string, col: string): string =>
  `<marker id="${id}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.4" markerHeight="4.4" orient="auto"><path d="M0,0L10,5L0,10z" fill="${col}"/></marker>`;

const eye = (x: number, y: number, s = 1): string =>
  `<path class="fl03-eyeball" d="M${f(x - 26 * s)},${y} Q${x},${f(y - 24 * s)} ${f(x + 26 * s)},${y} Q${x},${f(y + 24 * s)} ${f(x - 26 * s)},${y}Z"/>
   <circle class="fl03-iris" cx="${x}" cy="${y}" r="${f(9 * s)}"/><circle class="fl03-pupil" cx="${x}" cy="${y}" r="${f(4 * s)}"/>`;

/** A small leaf: blade, midrib and a stalk. */
function leaf(cx: number, cy: number, len: number, wid: number, rot: number): string {
  const h = len / 2, w = wid / 2;
  const blade = `M${-h},0 C${f(-h * 0.5)},${f(-w * 1.3)} ${f(h * 0.4)},${f(-w * 1.2)} ${h},0 C${f(h * 0.4)},${f(w * 1.2)} ${f(-h * 0.5)},${f(w * 1.3)} ${-h},0Z`;
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})"><path class="fl03-stalk" d="M${-h},0 L${f(-h - len * 0.14)},${f(len * 0.03)}"/>
    <path class="fl03-leaf" d="${blade}"/><path class="fl03-vein" d="M${f(-h + 4)},0 L${f(h * 0.88)},0"/></g>`;
}

/** A UV shield: a crest with a tick. */
const shield = (x: number, y: number, s = 1): string =>
  `<path class="fl03-shield" d="M${x},${f(y - 22 * s)} L${f(x + 18 * s)},${f(y - 15 * s)} V${f(y + 2 * s)} Q${f(x + 18 * s)},${f(y + 18 * s)} ${x},${f(y + 25 * s)} Q${f(x - 18 * s)},${f(y + 18 * s)} ${f(x - 18 * s)},${f(y + 2 * s)} V${f(y - 15 * s)}Z"/>
   <path class="fl03-shield-t" d="M${f(x - 8 * s)},${f(y + 1 * s)} L${f(x - 2 * s)},${f(y + 8 * s)} L${f(x + 9 * s)},${f(y - 6 * s)}"/>`;

/** Rising heat: three grey wavy lines. */
const heat = (x: number, y: number, s = 1): string => [-1, 0, 1].map(k => {
  const x0 = x + k * 14 * s;
  return `<path class="fl03-heat" d="M${f(x0)},${f(y + 20 * s)} q${f(-6 * s)},${f(-7 * s)} 0,${f(-14 * s)} t0,${f(-14 * s)} t0,${f(-14 * s)}"/>`;
}).join('');

/** A thermometer. */
const thermo = (x: number, y: number): string =>
  `<rect class="fl03-thermo" x="${x - 6}" y="${y - 30}" width="12" height="44" rx="6"/><circle class="fl03-thermo" cx="${x}" cy="${y + 20}" r="11"/>
   <rect class="fl03-thermo-in" x="${x - 2.5}" y="${y - 10}" width="5" height="28"/><circle class="fl03-thermo-in" cx="${x}" cy="${y + 20}" r="7"/>`;

/** A bowl with steam and a water drop. */
const bowl = (x: number, y: number): string =>
  `<path class="fl03-bowl" d="M${x - 34},${y} H${x + 34} Q${x + 30},${y + 30} ${x},${y + 32} Q${x - 30},${y + 30} ${x - 34},${y}Z"/>
   ${heat(x, y - 26, 0.8)}
   <path class="fl03-drop" d="M${x + 46},${y - 22} q8,12 0,18 q-8,-6 0,-18Z"/>`;

const num = (x: number, y: number, n: string): string =>
  `<circle class="fl03-numc" cx="${x}" cy="${y}" r="15"/>${T(x, y + 7, n, 'fl03-num', 'middle')}`;

/* ---------- the sunlight curve of 3E, shared ---------- */

// Schematic only: a smooth 5800 K photon distribution with the ozone cut-off near 300 nm; real sunlight has dips.
const sunRaw = (nm: number): number => { const l = nm * 1e-9; return l ** -4 / Math.expm1(2.49e-6 / l) / (1 + Math.exp(-(nm - 340) / 16)); };
/** Normalised over 280–1000 nm in 4 nm steps, as drawn in 3E, so every variant draws the same shape. */
const SUN_MX = (() => { let m = 0; for (let nm = 280; nm <= 1000; nm += 4) m = Math.max(m, sunRaw(nm)); return m; })();
interface Curve { d: string; Y: (nm: number) => number; xa: number; xb: number }
/** The curve's outline from nm0 to nm1 on axis `a`, peak at `top`, zero at `base`. */
function sunLine(a: Ax, base: number, top: number, nm0 = a.nm0, nm1 = a.nm1): Curve {
  const Y = (nm: number): number => base - (sunRaw(nm) / SUN_MX) * (base - top);
  const grid: number[] = [];
  for (let nm = nm0; nm <= nm1; nm += 4) grid.push(nm);
  return { d: grid.map((nm, i) => `${i ? 'L' : 'M'}${f(X(a, nm))},${f(Y(nm))}`).join(''), Y, xa: X(a, grid[0]), xb: X(a, grid[grid.length - 1]) };
}
/** 3E's look: spectral colour washed under the curve, then the outline. */
const sunFill = (id: string, a: Ax, c: Curve, base: number): string =>
  `<defs>${grad(id, a.x0, a.x1, a.nm0, a.nm1, 0.28)}</defs>
    <path fill="url(#${id})" d="${c.d} L${f(c.xb)},${base} L${f(c.xa)},${base}Z"/>
    <path class="fl03-curve" d="${c.d}"/>`;

/** 3A's fan, landing on the curve's outline instead of a strip. */
function fanCurve(o: [number, number], a: Ax, Y: (nm: number) => number, nms: number[]): string {
  const edge: string[] = [];
  for (let nm = nms[0]; nm <= nms[nms.length - 1]; nm += 4) edge.push(`L${f(X(a, nm))},${f(Y(nm))}`);
  edge.push(`L${f(X(a, nms[nms.length - 1]))},${f(Y(nms[nms.length - 1]))}`);
  const back = `<path class="fl03-fanbg" d="M${f(o[0])},${f(o[1])}${edge.join('')}Z"/>`;
  return back + nms.map(nm => `<path class="fl03-fanray" style="stroke:${nmCol(nm)}" d="M${f(o[0])},${f(o[1])}L${f(X(a, nm))},${f(Y(nm))}"/>`).join('');
}
const FAN_NM = [384, 420, 460, 500, 540, 580, 620, 660, 700, 740, 776];

/** 3A's sun, beam and prism at any size; `k` scales the sun's distance and size. */
function source(cx: number, cy: number, s: number, k = 1, sunR = 20): { svg: string; pr: ReturnType<typeof prism> } {
  const pr = prism(cx, cy, s);
  const at: [number, number] = [pr.inP[0] - 84 * k * 0.927, pr.inP[1] + 84 * k * 0.375];
  return {
    pr,
    svg: `${sun(at[0], at[1], sunR)}${beam(`M${f(at[0] + sunR + 2)},${f(at[1] - (sunR * 9) / 20)} L${f(pr.inP[0])},${f(pr.inP[1])}`, 9 * Math.min(1, k + 0.15))}`,
  };
}
const prismTop = (pr: ReturnType<typeof prism>, w = 5): string =>
  `${pr.svg}<path class="fl03-inray" style="stroke-width:${w}" d="M${f(pr.inP[0])},${f(pr.inP[1])} L${f(pr.outP[0])},${f(pr.outP[1])}"/>`;

/* ---------- Engelmann's filament, bacteria and counts (3H), shared ---------- */

const eg = (x: number, m: number, s: number): number => Math.exp(-((x - m) ** 2) / (2 * s * s));
// Schematic density: crowded in blue and red, sparse in green, as Engelmann saw it.
const engDens = (nm: number): number => 0.08 + 0.85 * eg(nm, 440, 26) + 1.0 * eg(nm, 672, 20) + 0.2 * eg(nm, 610, 30);
/** Bacteria scattered above and below a filament centred at `mid`; `gap` keeps them off the cells, `spread` sets the cloud depth. */
function engBugs(a: Ax, mid: number, o: { gap?: number; spread?: number; per?: number; step?: number; nm0?: number; nm1?: number } = {}): string {
  const gap = o.gap ?? 26, spread = o.spread ?? 52, per = o.per ?? 3.2, step = o.step ?? 3;
  let s = 7;
  const rnd = (): number => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const bugs: string[] = [];
  for (let nm = o.nm0 ?? 402; nm < (o.nm1 ?? 718); nm += step) {
    const n = Math.round(engDens(nm) * per + rnd() * 0.6);
    for (let k = 0; k < n; k++) {
      const x = X(a, nm) + (rnd() - 0.5) * 6;
      const side = rnd() < 0.5 ? -1 : 1, y = mid + side * (gap + rnd() * spread);
      bugs.push(`<rect class="fl03-bug" x="${f(x - 6)}" y="${f(y - 2.2)}" width="12" height="4.4" rx="2.2" transform="rotate(${f((rnd() - 0.5) * 140)} ${f(x)} ${f(y)})"/>`);
    }
  }
  return bugs.join('');
}
/** The filament: n cells of 3H's shape from x0 at the given pitch, centred on `mid`. */
const engCells = (x0: number, n: number, pitch: number, mid: number): string =>
  Array.from({ length: n }, (_, i) => `<rect class="fl03-alga" x="${x0 + i * pitch}" y="${mid - 16}" width="37" height="32" rx="9"/><path class="fl03-alga-c" d="M${x0 + 4 + i * pitch},${mid - 6} q9,-8 18,0 t15,4"/>`).join('');
/** The same filament fitted between two x positions. */
function engCellsFit(xa: number, xb: number, mid: number): string {
  const n = Math.max(1, Math.round((xb - xa + 2.4) / 39.4));
  const pitch = n > 1 ? (xb - xa - 37) / (n - 1) : 0;
  return engCells(+(xa).toFixed(1), n, +pitch.toFixed(2), mid);
}
/** Bacteria counted in 16 nm bins from 400 to 720 nm, as bars standing on `hb`. */
function engHist(a: Ax, hb: number, scale = 84, cls = 'fl03-hist'): string {
  const hist: string[] = [];
  for (let nm = 400; nm < 720; nm += 16) {
    const v = engDens(nm + 8), h = v * scale;
    hist.push(`<rect class="${cls}" x="${f(X(a, nm) + 2)}" y="${f(hb - h)}" width="${f(X(a, nm + 16) - X(a, nm) - 4)}" height="${f(h)}"/>`);
  }
  return hist.join('');
}

/* ---------- 3A · Prism to scale: the confirmed display ---------- */

function drawA(): string {
  const p = 'fl03a';
  const a: Ax = { x0: 200, x1: 780, nm0: 340, nm1: 820 };
  const e: Em = { x0: 30, x1: 770, lo: -13, hi: 3.5, y: 484, h: 42 };
  const pr = prism(150, 96, 100);
  const sunAt: [number, number] = [pr.inP[0] - 84 * 0.927, pr.inP[1] + 84 * 0.375];
  const sy = 252, v0 = EX(e, L380), v1 = EX(e, L780);
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Sunlight passes a prism and spreads into a spectrum; the visible band is a narrow sliver of the electromagnetic spectrum from gamma rays to radio waves. Brackets mark human vision, about 380 to 780 nm, PAR, 400 to 700 nm, and far-red, 700 to 750 nm.">
    ${sun(sunAt[0], sunAt[1], 20)}${T(24, 190, 'sunlight', 'fl03-note')}
    ${beam(`M${f(sunAt[0] + 22)},${f(sunAt[1] - 9)} L${f(pr.inP[0])},${f(pr.inP[1])}`)}
    ${fan(pr.outP, a, sy, [384, 420, 460, 500, 540, 580, 620, 660, 700, 740, 776])}
    ${pr.svg}<path class="fl03-inray" d="M${f(pr.inP[0])},${f(pr.inP[1])} L${f(pr.outP[0])},${f(pr.outP[1])}"/>
    ${T(150, 160, 'prism', 'fl03-note', 'middle')}
    <rect class="fl03-box" x="186" y="236" width="608" height="208" rx="14"/>
    ${strip(`${p}-s`, a, sy, 38)}
    ${bracket(X(a, 380), X(a, 780), 318, 1)}${T(X(a, 580), 346, 'our eyes', 'fl03-s', 'middle')}
    ${bracket(X(a, 400), X(a, 700), 384, 1, 'fl03-br fl03-br-par')}
    ${bracket(X(a, 700), X(a, 750), 384, 1, 'fl03-br fl03-br-fr')}
    ${T(X(a, 550), 414, 'PAR', 'fl03-b fl03-par', 'middle')}
    ${T(X(a, 725), 414, 'far-red', 'fl03-b fl03-fr', 'middle')}
    <path class="fl03-zoom" d="M${f(v0)},${e.y} L186,444 H794 L${f(v1)},${e.y}Z"/>
    <path class="fl03-zline" d="M${f(v0)},${e.y} L186,444 M${f(v1)},${e.y} L794,444"/>
    ${emBar(p, e, { ticks: [-12, -9, -3, 0, 3] })}
    <path class="fl03-tick" d="M${f((v0 + v1) / 2)},${e.y + e.h} v8"/>${T((v0 + v1) / 2, e.y + e.h + 30, 'visible', 'fl03-b', 'middle')}
    ${T(400, 590, '← shorter · wavelength, log scale · longer →', 'fl03-tk', 'middle')}
  </svg>`;
}

/* ---------- 3B · Zoom ladder: three nested rulers ---------- */

function drawB(): string {
  const p = 'fl03b';
  const e1: Em = { x0: 40, x1: 760, lo: -13, hi: 3.5, y: 56, h: 40 };
  const e2: Em = { x0: 40, x1: 760, lo: -7, hi: -4, y: 226, h: 40 };
  const a3: Ax = { x0: 40, x1: 760, nm0: 350, nm1: 800 };
  const w1 = [EX(e1, -7), EX(e1, -4)], w2 = [EX(e2, Math.log10(350e-9)), EX(e2, Math.log10(800e-9))];
  const y3 = 396;
  const t2 = [[-7, '100 nm', 'start'], [-6, '1 µm', 'middle'], [-5, '10 µm', 'middle'], [-4, '100 µm', 'end']] as Array<[number, string, A]>;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Three nested rulers: the whole electromagnetic spectrum, then the region around the visible, then the visible band itself with vision, PAR and far-red marked.">
    ${T(40, 38, 'The whole electromagnetic spectrum', 'fl03-h')}${T(760, 38, 'log scale', 'fl03-note', 'end')}
    <path class="fl03-zoom" d="M${f(w1[0])},${e1.y + e1.h} L${e2.x0},${e2.y} H${e2.x1} L${f(w1[1])},${e1.y + e1.h}Z"/>
    <path class="fl03-zline" d="M${f(w1[0])},${e1.y + e1.h} L${e2.x0},${e2.y} M${f(w1[1])},${e1.y + e1.h} L${e2.x1},${e2.y}"/>
    ${emBar(`${p}1`, e1, { ticks: [-12, -9, 0, 3], avoid: [-7.1, -3.9] })}
    <rect class="fl03-win" x="${f(w1[0])}" y="${e1.y - 5}" width="${f(w1[1] - w1[0])}" height="${e1.h + 10}" rx="4"/>
    ${T(400, 196, 'zoom in: around the visible (log scale)', 'fl03-b', 'middle')}
    <path class="fl03-zoom" d="M${f(w2[0])},${e2.y + e2.h} L${a3.x0},${y3} H${a3.x1} L${f(w2[1])},${e2.y + e2.h}Z"/>
    <path class="fl03-zline" d="M${f(w2[0])},${e2.y + e2.h} L${a3.x0},${y3} M${f(w2[1])},${e2.y + e2.h} L${a3.x1},${y3}"/>
    ${emBar(`${p}2`, e2, { long: true })}
    ${t2.map(([l, s, an]) => `<path class="fl03-tick" d="M${f(EX(e2, l))},${e2.y + e2.h} v8"/>${T(EX(e2, l), e2.y + e2.h + 28, s, 'fl03-tk', an)}`).join('')}
    <rect class="fl03-win" x="${f(w2[0])}" y="${e2.y - 5}" width="${f(w2[1] - w2[0])}" height="${e2.h + 10}" rx="4"/>
    ${T(400, 366, 'zoom in: the visible band (linear scale)', 'fl03-b', 'middle')}
    ${strip(`${p}-s`, a3, y3, 40)}
    ${[400, 500, 600, 700].map(nm => T(X(a3, nm), y3 + 30, `${nm}`, 'fl03-in fl03-in-w', 'middle')).join('')}
    ${bracket(X(a3, 380), X(a3, 780), 462, 1)}${T(X(a3, 580), 488, 'vision ≈ 380–780 nm', 'fl03-s', 'middle')}
    ${bracket(X(a3, 400), X(a3, 700), 518, 1, 'fl03-br fl03-br-par')}${bracket(X(a3, 700), X(a3, 750), 518, 1, 'fl03-br fl03-br-fr')}
    ${T(X(a3, 550), 546, 'PAR · 400–700 nm', 'fl03-b fl03-par', 'middle')}${T(X(a3, 550), 574, 'conventional band', 'fl03-s', 'middle')}
    ${T(X(a3, 725), 546, 'far-red', 'fl03-b fl03-fr', 'middle')}${T(X(a3, 725), 574, 'adds in mixed light', 'fl03-s', 'middle')}
  </svg>`;
}

/* ---------- 3C · What each band does ---------- */

function drawC(): string {
  const p = 'fl03c';
  const e: Em = { x0: 30, x1: 770, lo: -13, hi: 3.5, y: 276, h: 46 };
  const c = (l: number): number => EX(e, l);
  const uv = c(-7.1), vis = c((L380 + L780) / 2), ir = c(-4.6), mw = c(-1.5);
  const lead = (x0: number, y0: number, x1: number, y1: number): string => `<path class="fl03-lead" d="M${f(x0)},${y0} L${f(x1)},${y1}"/><circle class="fl03-dot" cx="${f(x1)}" cy="${y1}" r="4"/>`;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="The electromagnetic spectrum with what four bands do: ultraviolet can damage cells and triggers protection; visible light serves vision and photosynthesis; infrared warms; microwaves heat food through water.">
    ${emBar(p, e, { long: false })}
    ${T(30, 258, 'shorter wavelengths', 'fl03-tk')}${T(770, 258, 'longer wavelengths', 'fl03-tk', 'end')}

    ${shield(120, 104, 1.5)}
    ${T(180, 86, 'ultraviolet', 'fl03-b')}${T(180, 114, 'can damage cells;', 'fl03-s')}${T(180, 140, 'triggers protection', 'fl03-s')}
    ${lead(250, 156, uv, e.y - 4)}

    ${thermo(462, 100)}${heat(504, 104, 1)}
    ${T(540, 86, 'infrared', 'fl03-b')}${T(540, 114, 'absorbed infrared', 'fl03-s')}${T(540, 140, 'warms tissue', 'fl03-s')}
    ${lead(520, 156, ir, e.y - 4)}

    ${eye(110, 424, 1.2)}${leaf(110, 492, 92, 40, -12)}
    ${T(170, 410, 'visible light', 'fl03-b')}${T(170, 438, 'vision ≈ 380–780 nm', 'fl03-s')}${T(170, 474, 'PAR, 400–700 nm:', 'fl03-s')}${T(170, 500, 'the band measured', 'fl03-s')}${T(170, 526, 'for photosynthesis', 'fl03-s')}
    ${lead(250, 384, vis, e.y + e.h + 4)}

    ${bowl(540, 470)}
    ${T(608, 410, 'microwaves', 'fl03-b')}${T(608, 438, 'heat food', 'fl03-s')}${T(608, 464, 'through water', 'fl03-s')}
    ${lead(610, 384, mw, e.y + e.h + 4)}
  </svg>`;
}

/* ---------- 3D · Counted, not fenced: PAR is a photon count over a band ---------- */

function drawD(): string {
  const p = 'fl03d';
  const a: Ax = { x0: 60, x1: 740, nm0: 350, nm1: 800 };
  const sy = 380, xl = X(a, 400), xr = X(a, 700);
  const dot = (nm: number, y: number, open = false): string =>
    `<circle class="${open ? 'fl03-ph-o' : 'fl03-ph'}" cx="${f(X(a, nm))}" cy="${y}" r="8" style="${open ? 'stroke:#7d6fa8' : `fill:${nmCol(nm)}`}"/>`;
  const inside = [410, 440, 470, 500, 530, 560, 590, 620, 650, 680].flatMap((nm, i) => [dot(nm, 300 + (i % 2) * 14), dot(nm + 12, 344 - (i % 2) * 12)]).join('');
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="PAR as a counting window: a sensor counts every photon between 400 and 700 nm once. UV and far-red photons fall outside the window and are not counted, yet far-red adds to photosynthesis in mixed light.">
    <rect class="fl03-gate" x="${f(xl)}" y="92" width="${f(xr - xl)}" height="${sy - 92}"/>
    <path class="fl03-gate-l" d="M${f(xl)},${sy} V92 H${f(xr)} V${sy}"/>
    ${T((xl + xr) / 2, 128, 'PAR sensor: 400–700 nm', 'fl03-h', 'middle')}
    ${T((xl + xr) / 2, 156, 'counts every photon once', 'fl03-s', 'middle')}
    <rect class="fl03-display" x="${f((xl + xr) / 2 - 150)}" y="176" width="300" height="74" rx="12"/>
    ${T((xl + xr) / 2, 208, 'full sun ≈ 2000', 'fl03-b', 'middle')}${T((xl + xr) / 2, 236, 'µmol photons m⁻² s⁻¹', 'fl03-s', 'middle')}
    ${T((xl + xr) / 2, 270, 'Croce &amp; van Amerongen 2013', 'fl03-tiny', 'middle')}
    ${inside}
    ${dot(362, 318, true)}${dot(372, 350, true)}
    ${dot(712, 302)}${dot(728, 340)}${dot(744, 314)}
    ${strip(`${p}-s`, a, sy, 40)}
    ${[400, 500, 600, 700].map(nm => `<path class="fl03-tick" d="M${f(X(a, nm))},${sy + 40} v8"/>${T(X(a, nm), sy + 70, `${nm}`, 'fl03-tk', 'middle')}`).join('')}${T(760, sy + 70, 'nm', 'fl03-tk', 'end')}
    ${T(X(a, 372), 476, 'UV', 'fl03-b', 'middle')}${T(X(a, 372), 502, 'not counted;', 'fl03-s', 'middle')}${T(X(a, 372), 528, 'protection,', 'fl03-s', 'middle')}${T(X(a, 372), 554, 'damage', 'fl03-s', 'middle')}
    ${T((xl + xr) / 2, 476, 'inside the band', 'fl03-b fl03-par', 'middle')}${T((xl + xr) / 2, 502, 'counted as PAR', 'fl03-s', 'middle')}
    ${T(X(a, 730), 476, 'far-red', 'fl03-b fl03-fr', 'middle')}${T(X(a, 730), 502, 'not counted,', 'fl03-s', 'middle')}${T(X(a, 730), 528, 'yet adds in', 'fl03-s', 'middle')}${T(X(a, 730), 554, 'mixed light', 'fl03-s', 'middle')}
    ${T(400, 46, 'PAR is a ruler, not a fence', 'fl03-note', 'middle')}
  </svg>`;
}

/* ---------- 3E · Sunlight curve: schematic photon spectrum with the bands marked ---------- */

function drawE(): string {
  const p = 'fl03e';
  const a: Ax = { x0: 96, x1: 770, nm0: 280, nm1: 1000 };
  const base = 470, top = 182;
  const c = sunLine(a, base, top);
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Schematic spectrum of sunlight, counted in photons, from ultraviolet through the visible into the near-infrared, with brackets for vision, PAR and far-red.">
    ${sunFill(`${p}-fill`, a, c, base)}
    <path class="fl03-axis" d="M${a.x0},${top - 30} V${base} H${a.x1}"/>
    ${[300, 400, 500, 600, 700, 800, 900, 1000].map(nm => `<path class="fl03-tick" d="M${f(X(a, nm))},${base} v8"/>${T(X(a, nm), base + 32, `${nm}`, 'fl03-tk', 'middle')}`).join('')}
    ${T((a.x0 + a.x1) / 2, base + 66, 'wavelength (nm)', 'fl03-tk', 'middle')}
    <text class="fl03-tk" transform="translate(58 ${(base + top) / 2}) rotate(-90)" text-anchor="middle">photons per nm (relative)</text>
    ${bracket(X(a, 380), X(a, 780), 74, -1)}${T(X(a, 580), 58, 'our eyes', 'fl03-s', 'middle')}
    ${bracket(X(a, 400), X(a, 700), 134, -1, 'fl03-br fl03-br-par')}${T(X(a, 550), 118, 'PAR', 'fl03-b fl03-par', 'middle')}
    ${bracket(X(a, 700), X(a, 750), 134, -1, 'fl03-br fl03-br-fr')}${T(X(a, 760), 118, 'far-red', 'fl03-b fl03-fr', 'start')}
    ${T(X(a, 356), 458, 'UV', 'fl03-b', 'middle')}
    ${T(X(a, 890), 444, 'near-infrared', 'fl03-b', 'middle')}
    ${T(770, 568, 'schematic: a smooth curve; dips from the air are not drawn', 'fl03-tiny', 'end')}
    ${T(770, 590, 'where the peak sits depends on the units plotted', 'fl03-tiny', 'end')}
  </svg>`;
}

/* ---------- 3F · Far-red boost: the key result of Zhen & Bugbee 2020, schematic ---------- */

function drawF(): string {
  const p = 'fl03f';
  const cols = [
    { x: 160, t1: 'white light', t2: '400–700 nm', on: [400, 700], fr: false, extra: false, gain: 0, base: 1 },
    { x: 330, t1: '+ more', t2: '400–700 nm', on: [400, 700], fr: false, extra: true, gain: 1, base: 1 },
    { x: 500, t1: '+ far-red', t2: '700–750 nm', on: [400, 700], fr: true, extra: false, gain: 1, base: 1 },
    { x: 670, t1: 'far-red', t2: 'alone', on: [0, 0], fr: true, extra: false, gain: 0, base: 0 },
  ];
  const base = 470, H0 = 168, G = 56, bw = 96;
  /** What the lamp gives: a mini spectrum 380–780 nm with only the lit bands in colour. */
  const chip = (x: number, on: number[], fr: boolean, extra: boolean): string => {
    const a: Ax = { x0: x - 70, x1: x + 70, nm0: 380, nm1: 780 };
    const seg = (n0: number, n1: number, tall: boolean): string =>
      `<rect x="${f(X(a, n0))}" y="${tall ? 128 : 136}" width="${f(X(a, n1) - X(a, n0))}" height="${tall ? 38 : 22}" fill="url(#${p}-g${x})"/>`;
    return `<defs>${grad(`${p}-g${x}`, a.x0, a.x1, 380, 780)}</defs><rect class="fl03-chipbg" x="${a.x0}" y="136" width="140" height="22" rx="4"/>${on[1] ? seg(on[0], on[1], extra) : ''}${fr ? seg(700, 750, false) : ''}`;
  };
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Schematic result after Zhen and Bugbee 2020: adding far-red photons to white light raised canopy photosynthesis about as much as adding the same number of 400 to 700 nm photons, while far-red alone did little.">
    ${cols.map(c => {
      const h0 = c.base ? H0 : 14;
      return `${T(c.x, 70, c.t1, 'fl03-b', 'middle')}${T(c.x, 98, c.t2, 'fl03-s', 'middle')}${chip(c.x, c.on, c.fr, c.extra)}
        <rect class="fl03-bar" x="${c.x - bw / 2}" y="${base - h0}" width="${bw}" height="${h0}"/>
        ${c.gain ? `<rect class="fl03-gain" x="${c.x - bw / 2}" y="${base - H0 - G}" width="${bw}" height="${G}"/>${T(c.x, base - H0 - G / 2 + 8, 'gain', 'fl03-s', 'middle')}` : ''}`;
    }).join('')}
    <path class="fl03-axis" d="M70,${base} H740"/>
    <text class="fl03-tk" transform="translate(52 ${base - 120}) rotate(-90)" text-anchor="middle">canopy photosynthesis</text>
    <path class="fl03-br" d="M${330 - bw / 2},${base - H0 - G - 16} v-10 H${500 + bw / 2} v10"/>
    ${T(415, base - H0 - G - 38, '≈ the same gain', 'fl03-b', 'middle')}
    ${T(670, base - 30, 'little', 'fl03-s', 'middle')}
    ${T(400, 526, 'Far-red counts when it comes with shorter wavelengths', 'fl03-b', 'middle')}
    ${T(400, 562, 'schematic after Zhen & Bugbee 2020: 14 crop species; the gain was smaller near 750 nm', 'fl03-tiny', 'middle')}
  </svg>`;
}

/* ---------- 3G · Leaf in sunlight: what each band does when it meets a leaf ---------- */

function drawG(): string {
  const p = 'fl03g';
  const top = 300, bot = 410, L = 40, R = 760;
  const cells = Array.from({ length: 18 }, (_, i) => {
    const x = L + 10 + i * 40;
    return `<rect class="fl03-pal" x="${x}" y="${top + 18}" width="34" height="50" rx="10"/><circle class="fl03-chl" cx="${x + 10}" cy="${top + 34}" r="4"/><circle class="fl03-chl" cx="${x + 24}" cy="${top + 52}" r="4"/>`;
  }).join('') + Array.from({ length: 15 }, (_, i) => `<ellipse class="fl03-spg" cx="${L + 34 + i * 48}" cy="${top + 86}" rx="20" ry="11"/>`).join('');
  const hd = (c: string, col: string): string => colHead(`${p}-h${c}`, col);
  const fr = nmCol(730), nir = '#9a968c';
  const glow = (x: number, y: number): string => `<circle cx="${x}" cy="${y}" r="14" fill="url(#${p}-glow)"/><circle class="fl03-exc" cx="${x}" cy="${y}" r="4"/>`;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Sunlight's bands meeting a leaf: UV triggers protection and in excess damages; visible light in the PAR band drives photosynthesis; far-red adds in mixed light; near-infrared is mostly reflected or transmitted, and what is absorbed warms.">
    <defs>${hd('uv', '#7d6fa8')}${hd('b', '#2350e6')}${hd('g', '#2a963a')}${hd('r', '#c8361e')}${hd('fr', fr)}${hd('nir', nir)}
      <radialGradient id="${p}-glow"><stop offset="0" stop-color="#f0a316" stop-opacity=".9"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient></defs>
    ${sun(56, 56, 26)}${T(100, 50, 'sunlight', 'fl03-h')}${T(100, 76, 'reaches a leaf', 'fl03-s')}
    ${T(130, 150, 'UV', 'fl03-b', 'middle')}
    ${T(330, 150, 'visible · PAR', 'fl03-b', 'middle')}
    ${T(530, 150, 'far-red', 'fl03-b fl03-fr', 'middle')}
    ${T(690, 150, 'near-infrared', 'fl03-b', 'middle')}
    ${wv(130, 166, 130, top - 34, 12, '#7d6fa8', { head: `${p}-huv`, dash: true })}
    ${wv(300, 166, 300, top - 6, 20, '#2350e6', { head: `${p}-hb` })}${wv(330, 166, 330, top - 6, 25, '#2a963a', { head: `${p}-hg` })}${wv(360, 166, 360, top - 6, 30, '#c8361e', { head: `${p}-hr`, ph: 1 })}
    ${wv(530, 166, 530, top - 6, 34, fr, { head: `${p}-hfr` })}
    ${wv(680, 166, 680, top - 4, 40, nir, {})}${wv(680, top - 4, 726, 196, 40, nir, { head: `${p}-hnir`, amp: 5 })}
    <rect class="fl03-epi" x="${L}" y="${top}" width="${R - L}" height="${bot - top}" rx="14"/>
    ${cells}
    <path class="fl03-epiline" d="M${L},${top + 14} H${R} M${L},${bot - 12} H${R}"/>
    ${wv(680, top - 4, 680, 470, 40, nir, { head: `${p}-hnir`, amp: 5, dash: true })}
    ${shield(130, top - 8, 0.9)}
    ${glow(300, top + 34)}${glow(330, top + 58)}${glow(360, top + 34)}${glow(530, top + 86)}
    ${heat(748, 246, 0.9)}
    ${T(130, 446, 'triggers', 'fl03-s', 'middle')}${T(130, 472, 'protection;', 'fl03-s', 'middle')}${T(130, 498, 'excess damages', 'fl03-s', 'middle')}
    ${T(330, 446, 'absorbed:', 'fl03-s', 'middle')}${T(330, 472, 'drives', 'fl03-s', 'middle')}${T(330, 498, 'photosynthesis', 'fl03-s', 'middle')}
    ${T(530, 446, 'adds in', 'fl03-s', 'middle')}${T(530, 472, 'mixed light', 'fl03-s', 'middle')}
    ${T(700, 500, 'mostly reflected', 'fl03-s', 'middle')}${T(700, 526, 'or transmitted;', 'fl03-s', 'middle')}${T(700, 552, 'what is absorbed', 'fl03-s', 'middle')}${T(700, 578, 'warms', 'fl03-s', 'middle')}
    ${T(40, 586, 'leaf cross-section, schematic', 'fl03-tiny')}
  </svg>`;
}

/* ---------- 3H · Engelmann 1882: bacteria map where an alga releases O₂ (option; history) ---------- */

function drawH(): string {
  const p = 'fl03h';
  const a: Ax = { x0: 60, x1: 740, nm0: 400, nm1: 720 };
  const hb = 530;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Schematic after Engelmann 1882: an algal filament lit by a spectrum; bacteria that seek oxygen crowd around the filament in red and blue light and are sparse in green.">
    <defs>${grad(`${p}-sp`, a.x0, a.x1, a.nm0, a.nm1, 0.55)}</defs>
    ${T(60, 56, 'An alga lit by a spectrum', 'fl03-h')}${T(60, 86, 'bacteria that seek O₂ gather where it is released', 'fl03-s')}
    <rect x="${a.x0}" y="176" width="${a.x1 - a.x0}" height="184" rx="10" fill="url(#${p}-sp)"/>
    ${engBugs(a, 268)}
    ${engCells(70, 17, 39.4, 268)}
    ${[400, 500, 600, 700].map(nm => T(X(a, nm), 386, `${nm} nm`, 'fl03-tk', nm === 400 ? 'start' : 'middle')).join('')}
    ${T(X(a, 450), 156, 'crowded <tspan class="fl03-s">in blue</tspan>', 'fl03-b', 'middle')}
    ${T(X(a, 555), 156, 'sparse <tspan class="fl03-s">in green</tspan>', 'fl03-b', 'middle')}
    ${T(X(a, 672), 156, 'crowded <tspan class="fl03-s">in red</tspan>', 'fl03-b', 'middle')}
    ${engHist(a, hb)}
    <path class="fl03-axis" d="M${a.x0},${hb} H${a.x1}"/>
    ${T(60, 420, 'bacteria counted along the filament:', 'fl03-s')}${T(740, 420, 'the first action spectrum', 'fl03-b', 'end')}
    ${T(740, 568, 'after Engelmann 1882 · schematic; his prism spectrum was uneven', 'fl03-tiny', 'end')}
  </svg>`;
}

/* ---------- 3I · Equation light: which light the equation means ---------- */

function drawI(): string {
  const p = 'fl03i';
  const a: Ax = { x0: 40, x1: 760, nm0: 330, nm1: 830 };
  const sy = 292;
  // equation pieces with their x positions (Inter 30 px)
  const parts: Array<[number, string, string]> = [[82, '6 CO₂', 'fl03-eq fl03-eq-c'], [178, '+', 'fl03-eq'], [206, '6 H₂O', 'fl03-eq fl03-eq-w'], [304, '+', 'fl03-eq'],
    [436, '→', 'fl03-eq'], [478, 'C₆H₁₂O₆', 'fl03-eq fl03-eq-c'], [598, '+', 'fl03-eq'], [626, '6 O₂', 'fl03-eq fl03-eq-w']];
  const pill = { x: 332, y: 56, w: 92, h: 44 };
  const ph = [395, 430, 470, 510, 550, 590, 630, 670, 690, 715, 735];
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="The photosynthesis equation with its light term highlighted: the light is sunlight's photons; those between 400 and 700 nm are counted as PAR, and far-red adds in mixed light.">
    ${heads(p)}
    ${parts.map(([x, s, c]) => T(x, 88, s, c)).join('')}
    <rect class="fl03-pill" x="${pill.x}" y="${pill.y}" width="${pill.w}" height="${pill.h}" rx="22"/>${T(pill.x + pill.w / 2, 88, 'light', 'fl03-eq fl03-eq-l', 'middle')}
    <path class="fl03-zoom" d="M${pill.x + 8},${pill.y + pill.h} L${a.x0},${sy - 50} H${a.x1} L${pill.x + pill.w - 8},${pill.y + pill.h}Z"/>
    <path class="fl03-zline" d="M${pill.x + 8},${pill.y + pill.h} L${a.x0},${sy - 50} M${pill.x + pill.w - 8},${pill.y + pill.h} L${a.x1},${sy - 50}"/>
    ${T(400, 160, 'which light?', 'fl03-note', 'middle')}
    ${T(400, 214, 'photons from the whole solar spectrum', 'fl03-b', 'middle')}
    ${ph.map((nm, i) => `<circle class="fl03-ph" cx="${f(X(a, nm))}" cy="${sy - 18 - (i % 2) * 8}" r="7" style="fill:${nmCol(nm)}"/>`).join('')}
    <circle class="fl03-ph-o" cx="${f(X(a, 350))}" cy="${sy - 18}" r="7" style="stroke:#8f88ad"/><circle class="fl03-ph-o" cx="${f(X(a, 800))}" cy="${sy - 22}" r="7" style="stroke:#a89a8c"/>
    ${strip(`${p}-s`, a, sy, 38)}
    ${bracket(X(a, 400), X(a, 700), sy + 62, 1, 'fl03-br fl03-br-par')}${bracket(X(a, 700), X(a, 750), sy + 62, 1, 'fl03-br fl03-br-fr')}
    ${T(X(a, 550), sy + 92, 'PAR · 400–700 nm', 'fl03-b fl03-par', 'middle')}
    ${T(X(a, 550), sy + 120, 'the photons counted', 'fl03-s', 'middle')}${T(X(a, 550), sy + 146, 'for photosynthesis', 'fl03-s', 'middle')}
    ${T(X(a, 742), sy + 92, 'far-red', 'fl03-b fl03-fr', 'middle')}
    ${T(X(a, 742), sy + 120, 'adds in', 'fl03-s', 'middle')}${T(X(a, 742), sy + 146, 'mixed light', 'fl03-s', 'middle')}
    ${T(X(a, 355), sy + 92, 'UV', 'fl03-b', 'middle')}${T(X(a, 355), sy + 120, 'protection,', 'fl03-s', 'middle')}${T(X(a, 355), sy + 146, 'damage', 'fl03-s', 'middle')}
    <rect class="fl03-key" x="40" y="${sy + 186}" width="720" height="78" rx="14"/>
    ${T(400, sy + 218, 'The equation’s “light” is counted in photons, not joules:', 'fl03-s', 'middle')}
    ${T(400, sy + 246, 'PAR is a measuring convention, not the only light leaves use', 'fl03-s', 'middle')}
  </svg>`;
}

/* ---------- 3J · Three tiles: one icon per take-home ---------- */

function drawJ(): string {
  const p = 'fl03j';
  const tile = (y: number, n: string, claim: string, sub: string[], icon: string): string =>
    `<rect class="fl03-tile" x="16" y="${y}" width="768" height="180" rx="18"/>${icon}${num(338, y + 46, n)}
     ${T(364, y + 54, claim, 'fl03-h')}${sub.map((s, i) => T(364, y + 92 + i * 28, s, 'fl03-s')).join('')}`;
  // tile 1: prism
  const pr = prism(150, 102, 84);
  const a1: Ax = { x0: 196, x1: 300, nm0: 380, nm1: 780 };
  const i1 = `${beam(`M40,${f(pr.inP[1] + 26)} L${f(pr.inP[0])},${f(pr.inP[1])}`, 7)}${fan(pr.outP, a1, 170, [390, 450, 510, 570, 630, 690, 760])}${pr.svg}`;
  // tile 2: two overlapping windows
  const a2: Ax = { x0: 44, x1: 300, nm0: 360, nm1: 800 };
  const y2 = 300;
  const i2 = `${strip(`${p}-s2`, a2, y2, 26, false)}${eye(X(a2, 580), 238, 0.8)}${bracket(X(a2, 380), X(a2, 780), y2 - 12, -1)}
    ${bracket(X(a2, 400), X(a2, 700), y2 + 40, 1, 'fl03-br fl03-br-par')}${leaf(X(a2, 550), 366, 58, 24, -8)}`;
  // tile 3: the edges
  const a3: Ax = { x0: 40, x1: 316, nm0: 330, nm1: 860 };
  const y3 = 486;
  const i3 = `${strip(`${p}-s3`, a3, y3, 26, false)}${shield(X(a3, 350), y3 - 34, 0.8)}
    <circle class="fl03-plus" cx="${f(X(a3, 725))}" cy="${y3 - 30}" r="16"/>${T(X(a3, 725), y3 - 22, '+', 'fl03-plus-t', 'middle')}
    ${heat(X(a3, 825), y3 - 34, 0.7)}${T(X(a3, 350), y3 + 58, 'UV', 'fl03-in', 'middle')}${T(X(a3, 725), y3 + 58, 'far-red', 'fl03-in', 'middle')}${T(316, y3 + 58, 'IR', 'fl03-in', 'end')}`;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Three tiles: a prism separates sunlight; vision and PAR overlap; the edges of the band still matter.">
    ${tile(14, '1', 'A prism separates sunlight', ['into the wavelengths it already', 'contains, violet to red'], i1)}
    ${tile(208, '2', 'Vision and PAR overlap', ['eyes ≈ 380–780 nm', 'PAR 400–700 nm, a convention'], i2)}
    ${tile(402, '3', 'The edges still matter', ['far-red adds in mixed light', 'UV: protection, damage · IR warms'], i3)}
  </svg>`;
}

/* ========== Round 2: combinations of the picked 3A (prism to scale), 3E (sunlight curve) and 3H (Engelmann) ========== */

/** The edges by name. Point 3 says what they do, so only 3O (Edges explained), whose subject they are, adds that. */
const uvNote = (x: number, y: number, a: A = 'middle', say = false): string =>
  `${T(x, y, 'UV', 'fl03-b', a)}${say ? T(x, y + 26, 'can damage', 'fl03-s', a) : ''}`;
const irNote = (x: number, y: number, a: A = 'middle', say = false): string =>
  `${T(x, y, 'infrared', 'fl03-b', a)}${say ? T(x, y + 26, 'warms', 'fl03-s', a) : ''}`;
/** 3A's two bracket rows under a strip or axis, at y (eyes) and y + 58 (PAR, far-red). */
function bandBrackets(a: Ax, y: number): string {
  const y2 = y + 58;
  return `${bracket(X(a, 380), X(a, 780), y, 1)}${T(X(a, 580), y + 26, 'our eyes', 'fl03-s', 'middle')}
    ${bracket(X(a, 400), X(a, 700), y2, 1, 'fl03-br fl03-br-par')}${bracket(X(a, 700), X(a, 750), y2, 1, 'fl03-br fl03-br-fr')}
    ${T(X(a, 550), y2 + 28, 'PAR', 'fl03-b fl03-par', 'middle')}
    ${T(X(a, 725), y2 + 28, 'far-red', 'fl03-b fl03-fr', 'middle')}`;
}

/* ---------- 3K · Prism to curve: 3A's prism fans into 3E's curve; the EM scale below ---------- */

function drawK(): string {
  const p = 'fl03k';
  const a: Ax = { x0: 204, x1: 776, nm0: 320, nm1: 880 };
  const base = 340, top = 226, boxT = 176, boxB = 494;
  const c = sunLine(a, base, top);
  const src = source(150, 96, 100);
  const e: Em = { x0: 30, x1: 770, lo: -13, hi: 3.5, y: 540, h: 40 };
  const w0 = EX(e, Math.log10(a.nm0 * 1e-9)), w1 = EX(e, Math.log10(a.nm1 * 1e-9));
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Sunlight passes a prism and fans out onto a schematic curve of sunlight's photons per nanometre, coloured violet to red. Brackets mark human vision, about 380 to 780 nm, PAR, 400 to 700 nm, and far-red, 700 to 750 nm. UV can damage; infrared warms. Below, the window is a sliver of the electromagnetic spectrum.">
    ${src.svg}${T(24, 190, 'sunlight', 'fl03-note')}
    <rect class="fl03-box" x="186" y="${boxT}" width="608" height="${boxB - boxT}" rx="14"/>
    ${sunFill(`${p}-fill`, a, c, base)}
    <path class="fl03-axis" d="M${a.x0},${base} H${a.x1}"/>
    ${fanCurve(src.pr.outP, a, c.Y, FAN_NM)}
    ${prismTop(src.pr)}${T(150, 160, 'prism', 'fl03-note', 'middle')}
    ${irNote(X(a, 830), 305)}
    ${uvNote(150, 330, 'end')}<path class="fl03-lead" d="M158,${base - 18} L${f(X(a, 352))},${f(base - 14)}"/>
    ${bandBrackets(a, 362)}
    ${T(780, 480, 'curve: photons per nm · schematic', 'fl03-tiny', 'end')}
    <path class="fl03-zoom" d="M${f(w0)},${e.y} L${a.x0},${boxB} H${a.x1} L${f(w1)},${e.y}Z"/>
    <path class="fl03-zline" d="M${f(w0)},${e.y} L${a.x0},${boxB} M${f(w1)},${e.y} L${a.x1},${boxB}"/>
    ${emBar(p, e, { avoid: [Math.log10(a.nm0 * 1e-9), Math.log10(a.nm1 * 1e-9)] })}
  </svg>`;
}

/* ---------- 3L · Offered vs used: 3E's curve over 3H's filament, one nm axis ---------- */

function drawL(): string {
  const p = 'fl03l';
  const a: Ax = { x0: 60, x1: 780, nm0: 300, nm1: 900 };
  const base = 236, top = 128;
  const c = sunLine(a, base, top);
  const src = source(112, 54, 66, 0.62, 14);
  const ea: Ax = { x0: X(a, 400), x1: X(a, 720), nm0: 400, nm1: 720 };
  const sT = 410, sH = 92, mid = sT + sH / 2, hb = 574;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Top: a prism spreads sunlight into a schematic curve of photons per nanometre. Bottom, on the same wavelength axis: after Engelmann 1882, bacteria that seek oxygen crowd around an alga in blue and red light, the first action spectrum. Between them, brackets for vision, PAR and far-red; UV can damage, infrared warms.">
    <defs>${grad(`${p}-sp`, ea.x0, ea.x1, 400, 720, 0.55)}</defs>
    ${T(780, 40, 'what sunlight offers', 'fl03-h', 'end')}${T(780, 66, 'photons per nm · schematic', 'fl03-tiny', 'end')}
    ${sunFill(`${p}-fill`, a, c, base)}
    <path class="fl03-axis" d="M${a.x0},${base} H${a.x1}"/>
    ${src.svg}${fanCurve(src.pr.outP, a, c.Y, FAN_NM)}${prismTop(src.pr, 4)}
    ${T(112, 132, 'prism', 'fl03-note', 'middle')}
    ${irNote(X(a, 845), 203)}
    ${uvNote(98, 284)}
    ${bandBrackets(a, 258)}
    ${T(16, 440, 'what an', 'fl03-h')}${T(16, 468, 'alga uses', 'fl03-h')}
    ${T(586, 440, 'bacteria gather', 'fl03-s')}${T(586, 466, 'where O₂ is released', 'fl03-s')}
    <rect x="${f(ea.x0)}" y="${sT}" width="${f(ea.x1 - ea.x0)}" height="${sH}" rx="10" fill="url(#${p}-sp)"/>
    ${engBugs(ea, mid, { gap: 20, spread: 24, per: 1.3, step: 4 })}
    ${engCellsFit(ea.x0 + 8, ea.x1 - 8, mid)}
    ${engHist(ea, hb, 52)}<path class="fl03-axis" d="M${f(ea.x0)},${hb} H${f(ea.x1)}"/>
    ${T(586, 548, 'counted: the first', 'fl03-s')}${T(586, 574, 'action spectrum', 'fl03-s')}
    ${T(16, 500, 'after Engelmann', 'fl03-tiny')}${T(16, 520, '1882 · schematic', 'fl03-tiny')}
  </svg>`;
}

/* ---------- 3M · Engelmann's setup: 3A's prism throws the spectrum onto 3H's filament ---------- */

function drawM(): string {
  const p = 'fl03m';
  const a: Ax = { x0: 236, x1: 686, nm0: 380, nm1: 780 };
  const sT = 250, sH = 118, mid = sT + sH / 2;
  const src = source(150, 96, 100);
  const o = src.pr.outP;
  const uvX = 206, irX = 740;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Engelmann's setup, schematic: sunlight passes a prism and its spectrum falls on an alga; bacteria that seek oxygen crowd in blue and red. Beyond violet lies UV, which can damage; beyond red, infrared, which warms. Brackets mark vision, about 380 to 780 nm, PAR, 400 to 700 nm, and far-red, 700 to 750 nm.">
    <defs>${grad(`${p}-sp`, a.x0, a.x1, a.nm0, a.nm1, 0.55)}</defs>
    ${T(300, 44, 'A prism spectrum on an alga', 'fl03-h')}${T(300, 72, 'bacteria that seek O₂ gather where it is released', 'fl03-s')}
    ${src.svg}${T(24, 190, 'sunlight', 'fl03-note')}
    ${fan(o, a, sT, FAN_NM)}
    ${prismTop(src.pr)}${T(150, 28, 'prism', 'fl03-note', 'middle')}
    <rect x="${a.x0}" y="${sT}" width="${a.x1 - a.x0}" height="${sH}" rx="10" fill="url(#${p}-sp)"/>
    ${engBugs(a, mid, { gap: 22, spread: 34, per: 1.8, nm0: 386, nm1: 776 })}
    ${engCellsFit(a.x0 + 8, a.x1 - 8, mid)}
    ${uvNote(uvX, 317)}
    ${irNote(irX, 300)}${heat(irX, 340, 0.8)}
    ${bandBrackets(a, 392)}
    ${T(X(a, 580), 528, 'the first action spectrum', 'fl03-b', 'middle')}
    ${T(784, 594, 'after Engelmann 1882 · schematic', 'fl03-tiny', 'end')}
  </svg>`;
}

/* ---------- 3N · Three tiers: the EM scale, the sunlight curve and Engelmann's counts on one axis ---------- */

function drawN(): string {
  const p = 'fl03n';
  const e: Em = { x0: 30, x1: 770, lo: -13, hi: 3.5, y: 30, h: 38 };
  const a: Ax = { x0: 238, x1: 776, nm0: 320, nm1: 880 };
  const w0 = EX(e, Math.log10(a.nm0 * 1e-9)), w1 = EX(e, Math.log10(a.nm1 * 1e-9));
  const boxT = 108, boxB = 560, base = 262, top = 152, hb = 494;
  const c = sunLine(a, base, top);
  const src = source(116, 156, 64, 0.58, 13);
  const ka: Ax = { x0: 134, x1: 196, nm0: 380, nm1: 780 };
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Three aligned tiers. Top: the electromagnetic spectrum, with a window around the visible. Middle: a prism spreads sunlight into a schematic curve of photons per nanometre, with brackets for vision, PAR and far-red; UV can damage, infrared warms. Bottom: Engelmann's 1882 bacteria counts along an alga, high in blue and red, the first action spectrum.">
    ${emBar(p, e, { avoid: [Math.log10(a.nm0 * 1e-9), Math.log10(a.nm1 * 1e-9)] })}
    <rect class="fl03-win" x="${f(w0 - 3)}" y="${e.y - 5}" width="${f(w1 - w0 + 6)}" height="${e.h + 10}" rx="4"/>
    <rect class="fl03-box" x="218" y="${boxT}" width="576" height="${boxB - boxT}" rx="14"/>
    <path class="fl03-zoom" d="M${f(w0)},${e.y + e.h + 5} L218,${boxT} H794 L${f(w1)},${e.y + e.h + 5}Z"/>
    <path class="fl03-zline" d="M${f(w0)},${e.y + e.h + 5} L218,${boxT} M${f(w1)},${e.y + e.h + 5} L794,${boxT}"/>
    ${sunFill(`${p}-fill`, a, c, base)}
    <path class="fl03-axis" d="M${a.x0},${base} H${a.x1}"/>
    ${T(784, 136, 'sunlight: photons per nm', 'fl03-tiny', 'end')}
    ${src.svg}${fan(src.pr.outP, ka, 202, [390, 450, 510, 570, 630, 690, 760])}${strip(`${p}-k`, ka, 202, 14, false)}${prismTop(src.pr, 4)}
    ${T(200, 258, 'prism', 'fl03-note', 'end')}
    ${irNote(X(a, 832), 227)}
    ${uvNote(200, 334, 'end')}<path class="fl03-lead" d="M204,${base + 64} L${f(X(a, 352))},${base - 8}"/>
    ${bandBrackets(a, 284)}
    ${engHist(a, hb, 64)}<path class="fl03-axis" d="M${f(X(a, 400))},${hb} H${f(X(a, 720))}"/>
    ${engCellsFit(X(a, 400), X(a, 720), hb + 26)}
    ${T(200, 458, 'bacteria gather', 'fl03-s', 'end')}${T(200, 484, 'where the alga', 'fl03-s', 'end')}${T(200, 510, 'releases O₂', 'fl03-s', 'end')}
    ${T(784, 440, 'the first', 'fl03-b', 'end')}${T(784, 466, 'action spectrum', 'fl03-b', 'end')}
    ${T(784, 590, 'after Engelmann 1882 · all curves schematic', 'fl03-tiny', 'end')}
  </svg>`;
}

/* ---------- 3O · Edges explained: 3E's curve fed by a prism, the edges spelled out, Engelmann faint ---------- */

/** An apex-down prism (3A's shape mirrored), so its fan rises. */
function prismDown(cx: number, cy: number, s: number): { svg: string; inP: [number, number]; outP: [number, number] } {
  const h = (s * Math.sqrt(3)) / 2, A: [number, number] = [cx, cy + (2 * h) / 3], B: [number, number] = [cx - s / 2, cy - h / 3], C: [number, number] = [cx + s / 2, cy - h / 3];
  const at = (P: [number, number], t: number): [number, number] => [A[0] + (P[0] - A[0]) * t, A[1] + (P[1] - A[1]) * t];
  return { svg: `<path class="fl03-prism" d="M${f(A[0])},${f(A[1])}L${f(B[0])},${f(B[1])}L${f(C[0])},${f(C[1])}Z"/>`, inP: at(B, 0.56), outP: at(C, 0.56) };
}

function drawO(): string {
  const p = 'fl03o';
  const a: Ax = { x0: 200, x1: 770, nm0: 300, nm1: 1000 };
  const base = 432, top = 196, sy = base, sh = 16;
  const c = sunLine(a, base, top);
  const pr = prismDown(150, 532, 84);
  const sunAt: [number, number] = [pr.inP[0] - 76 * 0.927, pr.inP[1] - 76 * 0.375];
  // fan rising from the prism to the underside of the strip
  const fx = FAN_NM.map(nm => X(a, nm)), fy = sy + sh;
  const fanUp = `<path class="fl03-fanbg" d="M${f(pr.outP[0])},${f(pr.outP[1])}L${f(fx[0])},${fy}L${f(fx[fx.length - 1])},${fy}Z"/>`
    + FAN_NM.map((nm, i) => `<path class="fl03-fanray" style="stroke:${nmCol(nm)}" d="M${f(pr.outP[0])},${f(pr.outP[1])}L${f(fx[i])},${fy}"/>`).join('');
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="A prism spreads sunlight into a spectrum; above it, a schematic curve of sunlight's photons per nanometre with brackets for vision, about 380 to 780 nm, and PAR, 400 to 700 nm. The edges are spelled out: UV can damage; far-red adds in mixed light; infrared warms. Faint bars show Engelmann's 1882 bacteria counts along an alga, high in blue and red.">
    ${bracket(X(a, 380), X(a, 780), 74, -1)}${T(X(a, 580), 58, 'our eyes', 'fl03-s', 'middle')}
    ${bracket(X(a, 400), X(a, 700), 134, -1, 'fl03-br fl03-br-par')}${T(X(a, 550), 118, 'PAR', 'fl03-b fl03-par', 'middle')}
    ${bracket(X(a, 700), X(a, 750), 134, -1, 'fl03-br fl03-br-fr')}${T(X(a, 770), 118, 'far-red', 'fl03-b fl03-fr', 'start')}${T(X(a, 770), 146, 'adds in mixed light', 'fl03-s', 'start')}
    ${sunFill(`${p}-fill`, a, c, base)}
    ${engHist(a, base, 120, 'fl03-hist-faint')}
    ${strip(`${p}-s`, a, sy, sh, false)}
    ${uvNote(96, 262, 'middle', true)}<path class="fl03-lead" d="M150,300 L${f(X(a, 344))},${f(c.Y(344) + 18)}"/>
    ${T(784, 188, 'sunlight', 'fl03-b', 'end')}${T(784, 210, 'photons per nm', 'fl03-tiny', 'end')}
    ${irNote(X(a, 895), 352, 'middle', true)}${heat(X(a, 895), 314, 0.7)}
    ${sun(sunAt[0], sunAt[1], 18)}${beam(`M${f(sunAt[0] + 20)},${f(sunAt[1] + 8)} L${f(pr.inP[0])},${f(pr.inP[1])}`, 8)}
    ${fanUp}${pr.svg}<path class="fl03-inray" d="M${f(pr.inP[0])},${f(pr.inP[1])} L${f(pr.outP[0])},${f(pr.outP[1])}"/>
    ${T(16, 594, 'sunlight', 'fl03-note')}${T(214, 574, 'prism', 'fl03-note')}
    ${T(784, 494, 'bars: bacteria gathered', 'fl03-s', 'end')}${T(784, 520, 'where an alga releases O₂', 'fl03-s', 'end')}
    ${T(784, 572, 'after Engelmann 1882', 'fl03-tiny', 'end')}${T(784, 592, 'curve and bars schematic', 'fl03-tiny', 'end')}
  </svg>`;
}

/* ========== Light-block round 3 (26 Oct 2026): five self-explaining variants P–T ==========
   Every variant shows the same four parts, each readable on its own (research/figure-briefs/SLIDE34_BRIEF.md):
   - λ marked crest to crest on blue (450 nm) and red (650 nm) light, drawn to their true ratio;
   - the spectrum on a wavelength axis: ultraviolet · visible · infrared, ticks, brackets for human vision and PAR;
   - scattering by air molecules: blue leaves in all directions, red mostly passes (4 : 2 : 1 for blue, green, red,
     as 1/λ⁴ gives for 450, 550 and 650 nm);
   - Rayleigh's clipping. */

const BLUE = '#2350e6', RED = '#c8361e';

/** Arrowheads for dimension lines (both ends), plus the slide-2 wave heads. */
const partDefs = (p: string): string => `${waveDefs(p)}<defs>
  <marker id="${p}-dim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path class="fl03-dimh" d="M0,1L10,5L0,9z"/></marker>
  <marker id="${p}-hb4" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L10,5L0,10z" fill="${BLUE}"/></marker>
  <marker id="${p}-hr4" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L10,5L0,10z" fill="${RED}"/></marker></defs>`;

/** A constant-amplitude wave along the line from (x0, y0) to (x1, y1); a crest (displacement +amp, to the left of the
 *  direction of travel) sits `c0` px from the start. `ramp` (px) grows the amplitude from zero at the start. */
function sine(x0: number, y0: number, x1: number, y1: number, lam: number, col: string, amp: number, c0: number, head = '', ramp = 0): string {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, run = head ? L - 7 : L;
  const n = Math.ceil(run / 1.5), pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const d = (run * i) / n, w = amp * (ramp ? Math.min(1, d / ramp) : 1) * Math.cos((2 * Math.PI * (d - c0)) / lam);
    pts.push(`${i ? 'L' : 'M'}${f(x0 + ux * d + uy * w)},${f(y0 + uy * d - ux * w)}`);
  }
  if (head) pts.push(`L${f(x1)},${f(y1)}`);
  return `<path class="fl03-w fl03-wl" style="stroke:${col}" d="${pts.join('')}"${head ? ` marker-end="url(#${head})"` : ''}/>`;
}

/** A horizontal wave of blue (450 nm) or red (650 nm) light, k px per nm, centred on y from x0 to x1, with λ marked
 *  crest to crest above it: dotted drops from two crests and a double-headed arrow labelled "λ = … nm". */
function lamRow(p: string, nm: 450 | 650, x0: number, x1: number, y: number, k: number,
  o: { amp?: number; c0?: number; rise?: number; label?: string; at?: A; head?: boolean } = {}): string {
  const lam = nm * k, amp = o.amp ?? 11, c0 = o.c0 ?? lam * 0.5, xc = x0 + c0, yc = y - amp, yd = yc - (o.rise ?? 18);
  const col = nm === 450 ? BLUE : RED, at = o.at ?? 'middle';
  const lx = at === 'middle' ? xc + lam / 2 : at === 'start' ? xc : xc + lam;
  return `${sine(x0, y, x1, y, lam, col, amp, c0, o.head ? `${p}-${nm === 450 ? 'hb4' : 'hr4'}` : '')}
    <path class="fl03-crest" d="M${f(xc)},${f(yc - 5)} V${f(yd - 4)} M${f(xc + lam)},${f(yc - 5)} V${f(yd - 4)}"/>
    <path class="fl03-dim" d="M${f(xc + 1.5)},${f(yd)} H${f(xc + lam - 1.5)}" marker-start="url(#${p}-dim)" marker-end="url(#${p}-dim)"/>
    ${T(lx, yd - 11, o.label ?? `λ = ${nm} nm`, 'fl03-b', at)}`;
}

/** The colour's name, in its colour. */
const nameOf = (nm: 450 | 650): string => `<tspan class="${nm === 450 ? 'fl03-blue' : 'fl03-red'}">${nm === 450 ? 'blue' : 'red'}</tspan>`;

/** A section's name, centred over it when it fits (`w`: its width in px), else set against the inner divider. */
function secName(a: Ax, n0: number, n1: number, y: number, s: string, w: number, side: 'start' | 'end'): string {
  const x0 = X(a, Math.max(n0, a.nm0)), x1 = X(a, Math.min(n1, a.nm1));
  if (x1 - x0 >= w + 16) return T((x0 + x1) / 2, y, s, 'fl03-sec', 'middle');
  return side === 'end' ? T(x1 - 8, y, s, 'fl03-sec', 'end') : T(x0 + 8, y, s, 'fl03-sec', 'start');
}

/** The spectrum on a wavelength axis, top of the section names at y. Rows: section names (y + 20), strip (y + 30…62),
 *  tick values (y + 92), axis title (y + 120), human vision (bracket y + 144, label + 26), PAR (bracket + 52, label + 78;
 *  the page text spells PAR out). Returns the drawing and the y of its last baseline. */
function specAxis(p: string, a: Ax, y: number, o: { ticks?: number[]; noTitle?: boolean } = {}): { svg: string; bottom: number } {
  const sy = y + 30, sh = 32, ty = sy + sh;
  const ticks = o.ticks ?? [300, 400, 500, 600, 700, 800, 900].filter(nm => nm >= a.nm0 && nm <= a.nm1);
  const mid = (n0: number, n1: number): number => (X(a, Math.max(n0, a.nm0)) + X(a, Math.min(n1, a.nm1))) / 2;
  const by = ty + (o.noTitle ? 54 : 82), py = by + 52;
  const par = T(X(a, 550), py + 26, 'PAR', 'fl03-b fl03-par', 'middle');
  return {
    bottom: py + 26,
    svg: `${strip(`${p}-s`, a, sy, sh, false)}
    <path class="fl03-secl" d="M${f(X(a, 380))},${y + 2} V${sy - 2} M${f(X(a, 780))},${y + 2} V${sy - 2}"/>
    ${secName(a, a.nm0, 380, y + 20, 'ultraviolet', 104, 'end')}${T(mid(380, 780), y + 20, 'visible', 'fl03-sec', 'middle')}${secName(a, 780, a.nm1, y + 20, 'infrared', 82, 'start')}
    ${ticks.map(nm => `<path class="fl03-tick" d="M${f(X(a, nm))},${ty} v8"/>${T(X(a, nm), ty + 30, `${nm}`, 'fl03-tk', 'middle')}`).join('')}
    ${o.noTitle ? '' : T((a.x0 + a.x1) / 2, ty + 58, 'wavelength (nm)', 'fl03-tk', 'middle')}
    ${bracket(X(a, 380), X(a, 780), by, 1)}${T(X(a, 580), by + 26, 'human vision', 'fl03-s', 'middle')}
    ${bracket(X(a, 400), X(a, 700), py, 1, 'fl03-br fl03-br-par')}${par}`,
  };
}

/** A few air molecules (unlabelled, as two touching atoms) around (x, y). */
const airCluster = (x: number, y: number, r = 8.5): string => {
  const k = r / 8.5;
  return `${airMol(x - 9 * k, y - 3 * k, 'N', 32, r)}${airMol(x + 11 * k, y + 13 * k, 'O', -42, r)}${airMol(x + 9 * k, y - 19 * k, 'N', 74, r)}`;
};

/** White light (blue, green and red waves) from the left meets air molecules at (cx, cy). Blue leaves in four
 *  directions, green in two, red in one (≈ 4 : 2 : 1); most green and red carry straight on. */
function scatterAt(p: string, cx: number, cy: number,
  o: { inLen: number; r: number; pass: number; blue?: number[]; green?: number[]; red?: number[]; s?: number }): string {
  const s = o.s ?? 1, g = 26 * s, w = { amp: 5 * s, k: s };
  const ray = (c: Col, deg: number, l: number): string => {
    const t = (deg * Math.PI) / 180;
    return wave(p, c, cx + Math.cos(t) * g, cy + Math.sin(t) * g, cx + Math.cos(t) * l, cy + Math.sin(t) * l, w);
  };
  return `${waves(p, ['b', 'g', 'r'], cx - o.inLen, cy, cx - g, cy, 9 * s, { ...w, head: false })}
    ${(o.blue ?? [-125, -60, 58, 122]).map(d => ray('b', d, o.r)).join('')}
    ${(o.green ?? [-92, 90]).map(d => ray('g', d, o.r * 0.8)).join('')}
    ${(o.red ?? [156]).map(d => ray('r', d, o.r * 0.72)).join('')}
    ${waves(p, ['g', 'r'], cx + g, cy, cx + o.pass, cy, 9 * s, w)}
    ${airCluster(cx, cy, 8.5 * s)}`;
}

/** The key to the scattering: optionally an air molecule, then a short wave of each colour and what it does.
 *  `two` breaks the blue line in two. */
function scKey(p: string, x: number, y: number, o: { gap?: number; two?: boolean; mol?: boolean } = {}): string {
  const g = o.gap ?? 32, sw = (c: Col, yy: number): string => wave(p, c, x, yy - 7, x + 42, yy - 7, { amp: 5, head: false });
  const y0 = o.mol ? y + g + 2 : y;
  const mol = o.mol ? `${airMol(x + 21, y - 7, 'N', 0, 8.5)}${T(x + 54, y, 'air molecules', 'fl03-s')}` : '';
  const blue = o.two
    ? `${T(x + 54, y0, `${nameOf(450)} scattered`, 'fl03-s')}${T(x + 54, y0 + 26, 'in all directions', 'fl03-s')}`
    : T(x + 54, y0, `${nameOf(450)} scattered in all directions`, 'fl03-s');
  const yr = y0 + g + (o.two ? 26 : 0);
  return `${mol}${sw('b', y0)}${blue}${sw('r', yr)}${T(x + 54, yr, `${nameOf(650)} mostly passes`, 'fl03-s')}`;
}

/* ---------- 3P · Clipping first: Rayleigh and λ on the left; the axis and one scattering event on the right ---------- */

function drawP(): string {
  const p = 'fl03p';
  const a: Ax = { x0: 318, x1: 770, nm0: 260, nm1: 900 };
  const sp = specAxis(p, a, 22);
  const k = 0.16, cx = 590, cy = 404;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Left: a newspaper clipping of Lord Rayleigh, 1871: scattering is proportional to one over wavelength to the fourth. Below it, blue light of wavelength 450 nm and red light of 650 nm drawn to scale, each wavelength marked crest to crest. Right: the spectrum on a wavelength axis from 300 to 900 nm, with ultraviolet, visible and infrared, and brackets for human vision and PAR. Below, sunlight meets air molecules: blue is scattered in all directions, red mostly passes.">
    ${partDefs(p)}
    ${clipping(p, 40, 20, 206, RAYLEIGH_SLIDE, -2)}
    ${lamRow(p, 450, 28, 270, 452, k, { c0: 30, at: 'start' })}${T(270, 410, nameOf(450), 'fl03-b', 'end')}
    ${lamRow(p, 650, 28, 270, 552, k, { c0: 30, at: 'start' })}${T(270, 510, nameOf(650), 'fl03-b', 'end')}
    ${sp.svg}
    ${scatterAt(p, cx, cy, { inLen: 254, r: 92, pass: 180, blue: [-114, -58, 58, 122], green: [-86, 90], red: [-140] })}
    ${T(a.x0 + 18, cy - 22, 'sunlight', 'fl03-s')}
    ${T(cx - 50, cy + 46, 'air molecules', 'fl03-s', 'end')}
    ${scKey(p, 344, 540)}
  </svg>`;
}

/* ---------- 3Q · Blue sky: a tall sky beside the axis; the λ waves are the scene's key ---------- */

function drawQ(): string {
  const p = 'fl03q';
  const a: Ax = { x0: 350, x1: 770, nm0: 230, nm1: 900 };
  const sp = specAxis(p, a, 16);
  const L = 18, R = 300, top = 18, gy = 548, bot = 584;
  const b0: [number, number] = [88, 90], b1: [number, number] = [R + 10, 316];
  const at = (t: number): [number, number] => [b0[0] + (b1[0] - b0[0]) * t, b0[1] + (b1[1] - b0[1]) * t];
  const hits = [0.2, 0.48, 0.76].map(at);
  const eyeP: [number, number] = [150, 512];
  const ray = (h: [number, number], deg: number, l: number, c: Col = 'b'): string => {
    const t = (deg * Math.PI) / 180;
    return wave(p, c, h[0] + Math.cos(t) * 16, h[1] + Math.sin(t) * 16, h[0] + Math.cos(t) * l, h[1] + Math.sin(t) * l, { amp: 4.5 });
  };
  const toEye = hits.map(([x, y], i) => wave(p, 'b', x + (i - 1) * 2, y + 16, eyeP[0] + (i - 1) * 12, eyeP[1] - 30, { amp: 4.5 })).join('');
  const k = 0.15, kx = 348, kx1 = 552;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Left: a tall sky. Sunlight crosses the air; air molecules send blue light in all directions, some of it down to an eye, while red mostly passes on. Right, top: the spectrum on a wavelength axis from 300 to 900 nm with ultraviolet, visible and infrared, and brackets for human vision and PAR. Below: blue light of wavelength 450 nm and red of 650 nm drawn to scale with the wavelength marked crest to crest, as the key to the sky; and a newspaper clipping of Lord Rayleigh, 1871: scattering is proportional to one over wavelength to the fourth.">
    ${partDefs(p)}
    <defs><linearGradient id="${p}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd3ee"/><stop offset="1" stop-color="#eaf1f8"/></linearGradient>
      <clipPath id="${p}-skyc"><rect x="${L}" y="${top}" width="${R - L}" height="${bot - top}" rx="14"/></clipPath></defs>
    <g clip-path="url(#${p}-skyc)">
      <rect x="${L}" y="${top}" width="${R - L}" height="${gy - top}" fill="url(#${p}-sky)"/>
      <rect class="fl03-ground" x="${L}" y="${gy}" width="${R - L}" height="${bot - gy}"/>
      ${sun(62, 64, 20)}
      ${waves(p, ['b', 'g', 'r'], b0[0], b0[1], b1[0], b1[1], 8, { amp: 4, head: false })}
      ${ray(hits[0], -150, 70)}${ray(hits[1], -62, 70)}${ray(hits[2], 30, 66)}${ray(hits[0], 175, 56)}${ray(hits[2], -110, 64)}
      ${ray(hits[1], 135, 52, 'r')}
      ${toEye}
      ${hits.map(([x, y], i) => airMol(x, y, i === 1 ? 'O' : 'N', 30 + i * 40, 8)).join('')}
    </g>
    ${eyeS2(eyeP[0], eyeP[1], 0.82)}
    ${T(296, 100, 'air molecules', 'fl03-s', 'end')}<path class="fl03-lead" d="M196,108 L${f(hits[0][0] + 10)},${f(hits[0][1] - 9)}"/>
    ${sp.svg}
    ${lamRow(p, 450, kx, kx1, 334, k, { c0: 24, at: 'start' })}
    ${T(kx, 374, `${nameOf(450)} scattered`, 'fl03-s')}${T(kx, 400, 'in all directions', 'fl03-s')}
    ${lamRow(p, 650, kx, kx1, 496, k, { c0: 24, at: 'start' })}
    ${T(kx, 536, `${nameOf(650)} mostly passes`, 'fl03-s')}
    ${clipping(p, 574, 262, 200, RAYLEIGH_SLIDE, 2, 11)}
  </svg>`;
}

/* ---------- 3R · Waves on the axis: blue and red fall onto their place on the wavelength axis ---------- */

function drawR(): string {
  const p = 'fl03r';
  const a: Ax = { x0: 58, x1: 762, nm0: 280, nm1: 880 };
  const sp = specAxis(p, a, 360);
  const xb = X(a, 450), xr = X(a, 650), k = 0.2, amp = 11, y0 = 60, y1 = 382;
  // vertical waves travelling down; blue's marked crests bulge right, red's left
  const lb = 450 * k, lr = 650 * k, cb = 24, cr = 130;
  const vb = sine(xb, y0, xb, y1, lb, BLUE, -amp, cb, `${p}-hb4`), vr = sine(xr, y0, xr, y1, lr, RED, amp, cr, `${p}-hr4`);
  const dB = xb + amp + 18, dR = xr - amp - 18;
  const dim = (x: number, ya: number, yb2: number, xs: number, lab: string, an: A): string =>
    `<path class="fl03-crest" d="M${f(xs)},${f(ya)} H${f(x + (x > xs ? 6 : -6))} M${f(xs)},${f(yb2)} H${f(x + (x > xs ? 6 : -6))}"/>
     <path class="fl03-dim" d="M${f(x)},${f(ya + 1.5)} V${f(yb2 - 1.5)}" marker-start="url(#${p}-dim)" marker-end="url(#${p}-dim)"/>
     ${T(x + (an === 'start' ? 12 : -12), (ya + yb2) / 2 + 8, lab, 'fl03-b', an)}`;
  const cx = 670, cy = 124;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Blue light of wavelength 450 nm and red light of 650 nm, drawn to scale with the wavelength marked crest to crest, fall onto their places on a wavelength axis from 300 to 800 nm, which shows ultraviolet, visible and infrared and brackets for human vision and PAR. Left: a newspaper clipping of Lord Rayleigh, 1871. Right: sunlight meets air molecules; blue is scattered in all directions, red mostly passes.">
    ${partDefs(p)}
    ${clipping(p, 20, 20, 200, RAYLEIGH_SLIDE, -2)}
    ${T(xb, 42, nameOf(450), 'fl03-b', 'middle')}${T(xr, 42, nameOf(650), 'fl03-b', 'middle')}
    ${vb}${vr}
    ${dim(dB, y0 + cb, y0 + cb + lb, xb + amp + 4, 'λ = 450 nm', 'start')}
    ${dim(dR, y0 + cr, y0 + cr + lr, xr - amp - 4, 'λ = 650 nm', 'end')}
    ${sp.svg}
    ${scatterAt(p, cx, cy, { inLen: 118, r: 82, pass: 112, blue: [-108, -45, 48, 116], green: [-78, 88], red: [140] })}
    ${T(552, cy - 24, 'sunlight', 'fl03-s')}
    ${scKey(p, 552, 246, { two: true, mol: true, gap: 30 })}
  </svg>`;
}

/* ---------- 3S · Scattering curve: 1/λ⁴ plotted over the same axis as the spectrum ---------- */

function drawS(): string {
  const p = 'fl03s';
  const a: Ax = { x0: 92, x1: 540, nm0: 260, nm1: 900 };
  const top = 54, base = 188, vmax = 8, V = (v: number): number => base - (v / vmax) * (base - top);
  const nmTop = 650 / vmax ** 0.25;
  const pts: string[] = [];
  for (let nm = Math.ceil(nmTop); nm <= a.nm1; nm += 3) pts.push(`${pts.length ? 'L' : 'M'}${f(X(a, nm))},${f(V((650 / nm) ** 4))}`);
  const sp = specAxis(p, a, 198);
  const dot = (nm: number, col: string): string => {
    const v = (650 / nm) ** 4;
    return `<path class="fl03-guide" d="M${f(X(a, nm))},${f(V(v) + 8)} V${base + 40}"/><circle cx="${f(X(a, nm))}" cy="${f(V(v))}" r="7" fill="${col}" stroke="#fffdf8" stroke-width="2"/>`;
  };
  const k = 0.15, cx = 178, cy = 520, wx = 590;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Top left: a graph of how strongly air scatters light against wavelength, relative to red light at 650 nm. The curve falls steeply, as one over wavelength to the fourth: blue at 450 nm is scattered about four times more than red. It sits over the spectrum's wavelength axis, from 300 to 900 nm, with ultraviolet, visible and infrared and brackets for human vision and PAR. Below, sunlight meets air molecules: blue is scattered in all directions, red mostly passes. Right: a newspaper clipping of Lord Rayleigh, 1871, and blue and red waves drawn to scale with the wavelength marked crest to crest.">
    ${partDefs(p)}
    ${T(a.x0 - 52, 30, 'scattering by air (red = 1)', 'fl03-tk')}
    <path class="fl03-axis" d="M${a.x0},${top - 10} V${base} H${a.x1}"/>
    ${[0, 4, 8].map(v => `<path class="fl03-tick" d="M${a.x0 - 7},${f(V(v))} h7"/>${T(a.x0 - 12, V(v) + 7, `${v}`, 'fl03-tk', 'end')}`).join('')}
    <path class="fl03-scurve" d="${pts.join('')}"/>
    ${dot(450, BLUE)}${dot(650, RED)}
    ${T(X(a, 450) + 14, V((650 / 450) ** 4) - 2, nameOf(450), 'fl03-b')}${T(X(a, 650) + 4, V(1) - 16, nameOf(650), 'fl03-b')}
    ${sp.svg}
    ${scatterAt(p, cx, cy, { inLen: 138, r: 66, pass: 112, blue: [-118, -58, 58, 114], green: [-88, 88], red: [140] })}
    ${T(cx - 138, cy - 22, 'sunlight', 'fl03-s')}
    ${scKey(p, 314, 476, { two: true, mol: true, gap: 31 })}
    ${clipping(p, 580, 16, 200, RAYLEIGH_SLIDE, 2, 11)}
    ${lamRow(p, 450, wx, 780, 432, k, { c0: 4, at: 'start' })}${T(780, 392, nameOf(450), 'fl03-b', 'end')}
    ${lamRow(p, 650, wx, 780, 548, k, { c0: 4, at: 'start' })}${T(780, 508, nameOf(650), 'fl03-b', 'end')}
  </svg>`;
}

/* ---------- 3T · Waves meet air: big blue and red waves, λ marked, reach the air molecules ---------- */

function drawT(): string {
  const p = 'fl03t';
  const a: Ax = { x0: 40, x1: 760, nm0: 280, nm1: 880 };
  const sp = specAxis(p, a, 14);
  const k = 0.15, yb = 390, yr = 520, hx = 300, lb = 450 * k;
  // blue ends at the molecules and leaves in all directions, keeping its wavelength; red carries on past them
  const out = (deg: number, l: number): string => {
    const t = (deg * Math.PI) / 180;
    return sine(hx + Math.cos(t) * 22, yb + Math.sin(t) * 22, hx + Math.cos(t) * l, yb + Math.sin(t) * l, lb, BLUE, 9, 0, `${p}-hb4`, lb * 0.6);
  };
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Top: the spectrum on a wavelength axis from 300 to 800 nm, with ultraviolet, visible and infrared and brackets for human vision and PAR. Below: blue light of wavelength 450 nm and red light of 650 nm, drawn to scale with the wavelength marked crest to crest, reach air molecules. Blue is scattered in all directions; red mostly passes. Right: a newspaper clipping of Lord Rayleigh, 1871.">
    ${partDefs(p)}
    ${sp.svg}
    ${lamRow(p, 450, 28, hx - 22, yb, k, { c0: 30, at: 'start' })}
    ${lamRow(p, 650, 28, 552, yr, k, { c0: 30, at: 'start', head: true })}
    ${([[-150, 126], [-95, 132], [-40, 120], [16, 132], [70, 100], [140, 132]] as Array<[number, number]>).map(([d, l]) => out(d, l)).join('')}
    ${airCluster(hx, yb)}${airMol(hx + 2, yr - 1, 'N', 62, 8.5)}
    ${T(hx + 50, (yb + yr) / 2 + 16, 'air molecules', 'fl03-s')}
    ${T(552, 296, nameOf(450), 'fl03-b', 'end')}${T(552, 322, 'scattered in', 'fl03-s', 'end')}${T(552, 348, 'all directions', 'fl03-s', 'end')}
    ${T(552, yr + 48, `${nameOf(650)} mostly passes`, 'fl03-s', 'end')}
    ${clipping(p, 576, 262, 200, RAYLEIGH_SLIDE, 2, 11)}
  </svg>`;
}

/* ========== Round 4 (26 Oct 2026): five variants from the lecturer's pick, 3S ==========
   Each keeps 3S's scattering curve over the wavelength axis and Rayleigh's clipping, drops the separate λ waves, puts
   the scattering drawing above the curve it explains and marks the ranges clearly: human vision 380–780 nm, PAR
   400–700 nm and far-red 700–750 nm, which some cyanobacteria use (Gan et al. 2014). They differ in where the
   clipping sits, how the ranges are marked and how big the drawing is. */

const VIS_L = 'human vision';
const PAR_L = '<tspan class="fl03-parb">PAR</tspan>'; // spelled out in the page text, so the figure keeps the short name
const FR_L = '<tspan class="fl03-frb">far-red:</tspan> some cyanobacteria';

/** The wavelength axis alone: section names (y + 20), strip (y + 30…62), tick values (y + 92) and the title, centred
 *  below them (y + 120) or, with `titleEnd`, right-aligned on the tick row at that x. */
function axisRows(p: string, a: Ax, y: number, o: { ticks?: number[]; titleEnd?: number } = {}): string {
  const sy = y + 30, ty = sy + 32;
  const tk = o.ticks ?? [300, 400, 500, 600, 700, 800, 900].filter(nm => nm >= a.nm0 && nm <= a.nm1);
  return `${strip(`${p}-s`, a, sy, 32, false)}
    <path class="fl03-secl" d="M${f(X(a, 380))},${y + 2} V${sy - 2} M${f(X(a, 780))},${y + 2} V${sy - 2}"/>
    ${secName(a, a.nm0, 380, y + 20, 'ultraviolet', 104, 'end')}${T((X(a, 380) + X(a, 780)) / 2, y + 20, 'visible', 'fl03-sec', 'middle')}${secName(a, 780, a.nm1, y + 20, 'infrared', 82, 'start')}
    ${tk.map(nm => `<path class="fl03-tick" d="M${f(X(a, nm))},${ty} v8"/>${T(X(a, nm), ty + 30, `${nm}`, 'fl03-tk', 'middle')}`).join('')}
    ${o.titleEnd ? T(o.titleEnd, ty + 30, 'wavelength (nm)', 'fl03-tk', 'end') : T((a.x0 + a.x1) / 2, ty + 58, 'wavelength (nm)', 'fl03-tk', 'middle')}`;
}

/** 3S's curve: how strongly air scatters light relative to red (650 nm), (650/λ)⁴, from 0 at `base` to `vmax` at
 *  `top`; blue (450 nm) and red (650 nm) are marked, with dotted drops to y `drop`. The y title starts at (tx, ty). */
function scCurve(a: Ax, top: number, base: number, drop: number, tx: number, ty: number, o: { vmax?: number; ticks?: number[] } = {}): string {
  const vmax = o.vmax ?? 8, V = (v: number): number => base - (v / vmax) * (base - top);
  const pts: string[] = [];
  for (let nm = Math.ceil(650 / vmax ** 0.25); nm <= a.nm1; nm += 3) pts.push(`${pts.length ? 'L' : 'M'}${f(X(a, nm))},${f(V((650 / nm) ** 4))}`);
  const dot = (nm: number, col: string): string => {
    const v = (650 / nm) ** 4;
    return `<path class="fl03-guide" d="M${f(X(a, nm))},${f(V(v) + 8)} V${drop}"/><circle cx="${f(X(a, nm))}" cy="${f(V(v))}" r="7" fill="${col}" stroke="#fffdf8" stroke-width="2"/>`;
  };
  return `<path class="fl03-axis" d="M${a.x0},${top - 10} V${base} H${a.x1}"/>
    ${(o.ticks ?? [0, 4, 8]).map(v => `<path class="fl03-tick" d="M${a.x0 - 7},${f(V(v))} h7"/>${T(a.x0 - 12, V(v) + 7, `${v}`, 'fl03-tk', 'end')}`).join('')}
    ${T(tx, ty, 'scattering by air (red = 1)', 'fl03-tk')}
    <path class="fl03-scurve" d="${pts.join('')}"/>
    ${dot(450, BLUE)}${dot(650, RED)}
    ${T(X(a, 450) + 14, V((650 / 450) ** 4) - 2, nameOf(450), 'fl03-b')}${T(X(a, 650) + 4, V(1) - 16, nameOf(650), 'fl03-b')}`;
}

/** The scattering drawing with its labels set where each layout has room: [x, y, anchor]. */
interface AirO { cx: number; cy: number; inLen: number; r: number; pass: number; s?: number;
  sun: [number, number, A]; mol: [number, number, A]; blue: [number, number, A]; red: [number, number, A]; blueTwo?: boolean }
function airDrawing(p: string, o: AirO): string {
  const [bx, by, ba] = o.blue;
  const blue = o.blueTwo
    ? `${T(bx, by, `${nameOf(450)} scattered`, 'fl03-s', ba)}${T(bx, by + 26, 'in all directions', 'fl03-s', ba)}`
    : T(bx, by, `${nameOf(450)} scattered in all directions`, 'fl03-s', ba);
  return `${scatterAt(p, o.cx, o.cy, { inLen: o.inLen, r: o.r, pass: o.pass, s: o.s, blue: [-116, -58, 58, 116], green: [-88, 88], red: [140] })}
    ${T(o.sun[0], o.sun[1], 'sunlight', 'fl03-s', o.sun[2])}${T(o.mol[0], o.mol[1], 'air molecules', 'fl03-s', o.mol[2])}
    ${blue}${T(o.red[0], o.red[1], `${nameOf(650)} mostly passes`, 'fl03-s', o.red[2])}`;
}

/** A strong bracket under a range, ticks pointing up at the axis. */
const rb = (a: Ax, n0: number, n1: number, y: number, k: 'vis' | 'par' | 'fr'): string =>
  bracket(X(a, n0) + (k === 'fr' ? 3 : 0), X(a, n1) - (k === 'par' ? 3 : 0), y, 1, `fl03-rb fl03-rb-${k}`);

/** A filled bar over a range, for marking ranges on the axis. */
const rbar = (a: Ax, n0: number, n1: number, y: number, h: number, k: 'vis' | 'par' | 'fr'): string => {
  const x0 = X(a, n0) + (k === 'fr' ? 2 : 0), x1 = X(a, n1) - (k === 'par' ? 2 : 0);
  return `<rect class="fl03-bar-${k}" x="${f(x0)}" y="${y}" width="${f(x1 - x0)}" height="${h}" rx="${k === 'fr' ? 5 : h / 2}"/>`;
};

/** A shaded band over a range from y0 to y1, drawn behind the curve. */
const band = (a: Ax, n0: number, n1: number, y0: number, y1: number, k: 'vis' | 'par' | 'fr'): string =>
  `<rect class="fl03-band-${k}" x="${f(X(a, n0))}" y="${y0}" width="${f(X(a, n1) - X(a, n0))}" height="${y1 - y0}"/>`;

/* ---------- 3U · Brackets, clipping right: 3S tidied; the drawing above the curve, strong brackets below ---------- */

function drawU(): string {
  const p = 'fl03u';
  const a: Ax = { x0: 90, x1: 516, nm0: 280, nm1: 880 };
  const top = 214, base = 330, ax = 340, br = ax + 144;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Top: sunlight meets air molecules; blue is scattered in all directions, red mostly passes. Below it, how strongly air scatters light against wavelength, relative to red at 650 nm: the curve falls steeply, as one over wavelength to the fourth, so blue at 450 nm is scattered about four times more than red. The wavelength axis runs from 300 to 800 nm through ultraviolet, visible and infrared; brackets mark human vision, 380 to 780 nm, PAR, 400 to 700 nm, and far-red, 700 to 750 nm, used by some cyanobacteria. Right: a newspaper clipping of Lord Rayleigh, 1871.">
    ${partDefs(p)}
    ${airDrawing(p, { cx: 226, cy: 96, inLen: 166, r: 66, pass: 114, sun: [60, 74, 'start'], mol: [178, 142, 'end'], blue: [362, 44, 'start'], blueTwo: true, red: [352, 103, 'start'] })}
    ${scCurve(a, top, base, ax + 30, 38, top - 20)}
    ${axisRows(p, a, ax)}
    ${rb(a, 380, 780, br, 'vis')}${T(X(a, 580), br + 26, VIS_L, 'fl03-s', 'middle')}
    ${rb(a, 400, 700, br + 52, 'par')}${T(X(a, 550), br + 78, PAR_L, 'fl03-exp', 'middle')}
    ${rb(a, 700, 750, br + 52, 'fr')}${T(X(a, 750) + 12, br + 56, FR_L, 'fl03-exp')}
    ${clipping(p, 556, 16, 236, RAYLEIGH_SLIDE, 2, 11)}
  </svg>`;
}

/* ---------- 3V · Bars on the axis: the drawing across the top, the clipping below it on the left ---------- */

function drawV(): string {
  const p = 'fl03v';
  const a: Ax = { x0: 318, x1: 774, nm0: 280, nm1: 880 };
  const top = 210, base = 318, ax = 328, by = ax + 140;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Across the top: sunlight meets air molecules; blue is scattered in all directions, red mostly passes. Below right, how strongly air scatters light against wavelength, relative to red at 650 nm, falling steeply as one over wavelength to the fourth: blue at 450 nm about four times red. Under the wavelength axis, from 300 to 800 nm, bars mark human vision, 380 to 780 nm, PAR, 400 to 700 nm, and far-red, 700 to 750 nm, used by some cyanobacteria. Left: a newspaper clipping of Lord Rayleigh, 1871.">
    ${partDefs(p)}
    ${airDrawing(p, { cx: 330, cy: 88, inLen: 270, r: 64, pass: 196, sun: [60, 66, 'start'], mol: [282, 134, 'end'], blue: [376, 38, 'start'], red: [538, 95, 'start'] })}
    ${clipping(p, 20, 212, 216, RAYLEIGH_SLIDE, -2)}
    ${scCurve(a, top, base, ax + 30, a.x0 - 52, top - 20)}
    ${axisRows(p, a, ax)}
    ${rbar(a, 380, 780, by, 28, 'vis')}${T(X(a, 580), by + 21, VIS_L, 'fl03-s', 'middle')}
    ${rbar(a, 400, 700, by + 36, 28, 'par')}${rbar(a, 700, 750, by + 36, 28, 'fr')}${T(X(a, 550), by + 57, '<tspan class="fl03-parb">PAR</tspan>', 'fl03-s', 'middle')}
    <path class="fl03-lead" d="M${f(X(a, 725))},${by + 65} V${by + 80}"/>${T(X(a, 750), by + 100, FR_L, 'fl03-exp', 'end')}
  </svg>`;
}

/* ---------- 3W · Bands, clipping on the graph: shaded ranges behind the curve; the clipping over the infrared tail ---------- */

function drawW(): string {
  const p = 'fl03w';
  const a: Ax = { x0: 90, x1: 770, nm0: 280, nm1: 1000 };
  const top = 222, base = 388, ax = 398, r1 = ax + 150, r2 = r1 + 30;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Top left: sunlight meets air molecules; blue is scattered in all directions, red mostly passes. Below, across the figure, how strongly air scatters light against wavelength, relative to red at 650 nm, falling steeply as one over wavelength to the fourth: blue at 450 nm about four times red. Shaded bands mark PAR, 400 to 700 nm, far-red, 700 to 750 nm, used by some cyanobacteria, and human vision, 380 to 780 nm, on a wavelength axis from 300 to 1000 nm. Top right, over the flat infrared end of the curve: a newspaper clipping of Lord Rayleigh, 1871.">
    ${partDefs(p)}
    ${band(a, 380, 780, top - 8, r2 + 8, 'vis')}${band(a, 400, 700, top - 8, r1 + 8, 'par')}${band(a, 700, 750, top - 8, r1 + 8, 'fr')}
    ${airDrawing(p, { cx: 240, cy: 92, inLen: 176, r: 64, pass: 120, sun: [64, 70, 'start'], mol: [192, 138, 'end'], blue: [376, 40, 'start'], blueTwo: true, red: [372, 99, 'start'] })}
    ${scCurve(a, top, base, ax + 30, 38, top - 24, { ticks: [0, 2, 4, 6, 8] })}
    ${axisRows(p, a, ax, { ticks: [300, 400, 500, 600, 700, 800, 900, 1000] })}
    ${T(X(a, 550), r1, PAR_L, 'fl03-exp', 'middle')}${T(X(a, 700) + 8, r1, FR_L, 'fl03-exp', 'start')}
    ${T(X(a, 580), r2, VIS_L, 'fl03-s', 'middle')}
    ${clipping(p, 580, 14, 200, RAYLEIGH_SLIDE, 2, 11)}
  </svg>`;
}

/* ---------- 3X · Big drawing: the scattering drawing large, the curve short beneath it ---------- */

function drawX(): string {
  const p = 'fl03x';
  const a: Ax = { x0: 90, x1: 770, nm0: 280, nm1: 1000 };
  const top = 262, base = 356, ax = 364, br = ax + 144;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Large, at the top: sunlight meets air molecules; blue is scattered in all directions, red mostly passes. Beneath, across the figure, how strongly air scatters light against wavelength, relative to red at 650 nm, falling steeply as one over wavelength to the fourth: blue at 450 nm about four times red. Brackets under the wavelength axis, from 300 to 1000 nm, mark PAR, 400 to 700 nm, far-red, 700 to 750 nm, used by some cyanobacteria, and human vision, 380 to 780 nm. Top right: a newspaper clipping of Lord Rayleigh, 1871.">
    ${partDefs(p)}
    ${airDrawing(p, { cx: 236, cy: 124, inLen: 206, r: 98, pass: 128, s: 1.35, sun: [30, 94, 'start'], mol: [172, 192, 'end'], blue: [310, 36, 'start'], blueTwo: true, red: [376, 131, 'start'] })}
    ${scCurve(a, top, base, ax + 30, 38, top - 22)}
    ${axisRows(p, a, ax, { ticks: [300, 400, 500, 600, 700, 800, 900, 1000] })}
    ${rb(a, 400, 700, br, 'par')}${rb(a, 700, 750, br, 'fr')}
    ${T(X(a, 550), br + 26, PAR_L, 'fl03-exp', 'middle')}${T(X(a, 700) + 8, br + 26, FR_L, 'fl03-exp', 'start')}
    ${rb(a, 380, 780, br + 50, 'vis')}${T(X(a, 580), br + 76, VIS_L, 'fl03-s', 'middle')}
    ${clipping(p, 580, 14, 200, RAYLEIGH_SLIDE, 2, 11)}
  </svg>`;
}

/* ---------- 3Y · Tall curve: a small drawing, a tall curve, the clipping on the left ---------- */

function drawY(): string {
  const p = 'fl03y';
  const a: Ax = { x0: 342, x1: 774, nm0: 280, nm1: 880 };
  const top = 168, base = 318, ax = 328, br = ax + 160;
  const side = (n0: number, y: number, s: string): string => T(X(a, n0) - 12, y + 4, s, 'fl03-exp', 'end');
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Top right, small: sunlight meets air molecules; blue is scattered in all directions, red mostly passes. Below it, tall: how strongly air scatters light against wavelength, relative to red at 650 nm, falling steeply as one over wavelength to the fourth: blue at 450 nm about four times red. Brackets under the wavelength axis, from 300 to 800 nm, mark human vision, 380 to 780 nm, PAR, 400 to 700 nm, and far-red, 700 to 750 nm, used by some cyanobacteria. Left: a newspaper clipping of Lord Rayleigh, 1871.">
    ${partDefs(p)}
    ${airDrawing(p, { cx: 486, cy: 66, inLen: 166, r: 50, pass: 96, s: 0.8, sun: [320, 44, 'start'], mol: [446, 106, 'end'], blue: [600, 26, 'start'], blueTwo: true, red: [594, 80, 'start'] })}
    ${scCurve(a, top, base, ax + 30, a.x0 - 52, top - 20, { ticks: [0, 2, 4, 6, 8] })}
    ${axisRows(p, a, ax)}
    ${rb(a, 380, 780, br, 'vis')}${side(380, br, VIS_L)}
    ${rb(a, 400, 700, br + 38, 'par')}${side(400, br + 38, PAR_L)}
    ${rb(a, 700, 750, br + 76, 'fr')}${side(700, br + 76, FR_L)}
    ${clipping(p, 16, 111, 248, RAYLEIGH_SLIDE, -2)}
  </svg>`;
}


const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH, i: drawI, j: drawJ, k: drawK, l: drawL, m: drawM, n: drawN, o: drawO, p: drawP, q: drawQ, r: drawR, s: drawS, t: drawT, u: drawU, v: drawV, w: drawW, x: drawX, y: drawY };

export function draw(id: string): string {
  return (DRAW[id] ?? drawP)();
}
