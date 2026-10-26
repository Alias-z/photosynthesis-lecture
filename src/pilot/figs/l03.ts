// Slide L03 · The solar spectrum. Confirmed context (CLAUDE_HANDOFF.txt, SLIDE 3); ten figure variants.
// Static only. Core: a prism spreads the wavelengths already in sunlight; the visible band is a sliver of the
// electromagnetic spectrum; vision ≈ 380–780 nm and PAR 400–700 nm overlap; PAR is a photon-counting
// convention, not a limit (far-red counts in mixed light); UV triggers protection and damages, infrared warms.
// Photon energy (E = hc/λ) belongs to L04 and is left out here.
import type { PlateText, Variant } from '../types';
import { spec } from '../../lib/colour';
import { heads } from '../mechanisms';
import './l03.css';

export const PLATE: PlateText = {
  n: '3',
  status: 'confirmed',
  title: 'The solar spectrum',
  lead: 'Sunlight is a continuous mix of wavelengths, from ultraviolet through visible light to infrared.',
  points: [
    { claim: 'We see about 380–780 nm.', text: 'Human eyes detect wavelengths from about 380 nm (violet) to 780 nm (deep red).' },
    { claim: 'PAR: photosynthetically active radiation.', text: 'By convention 400–700 nm, counted in photons: full sun gives ≈ 2000 µmol photons m⁻² s⁻¹.' },
    { claim: 'Far-red counts too.', text: 'Far-red photons (700–750 nm), outside PAR, add to photosynthesis as much as PAR photons when mixed with them.' },
  ],
  refs: [
    { label: 'CIE: visible radiation', url: 'https://cie.co.at/eilvterm/17-21-003' },
    { label: 'CIE: PAR', url: 'https://cie.co.at/eilvterm/17-26-079' },
    { label: 'Zhen & Bugbee 2020', url: 'https://doi.org/10.1111/pce.13730' },
    { label: 'Croce & van Amerongen 2013', url: 'https://doi.org/10.1007/s11120-013-9838-x' },
  ],
};

// Round 2: the lecturer's picks (A, E, H), then five combinations of them. Unlisted variants still draw by id.
export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Prism to scale' },
  { id: 'e', name: 'Sunlight curve' },
  { id: 'h', name: 'Engelmann 1882' },
  { id: 'k', name: 'Prism to curve' },
  { id: 'l', name: 'Offered vs used' },
  { id: 'm', name: 'Engelmann setup' },
  { id: 'n', name: 'Three tiers' },
  { id: 'o', name: 'Edges explained' },
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

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH, i: drawI, j: drawJ, k: drawK, l: drawL, m: drawM, n: drawN, o: drawO };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
