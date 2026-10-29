// Slide L03 · Light is a wave (since 26 Oct 2026; was "The solar spectrum"). Light-block order v5
// (research/figure-briefs/ORDER_PROPOSAL.md): wavelength explains the blue sky and gives the spectrum we see and use.
// The lecturer's picks are X and Y (research/figure-briefs/SLIDE34_BRIEF.md, round 2): a scattering drawing above the
// 1/λ⁴ curve on the wavelength axis, the ranges marked, Rayleigh's clipping. A, E and H, picked before the slide was
// restructured, still draw by id; the other variants were deleted on 26 Oct 2026.
// Photon energy (E = hc/λ) belongs to L04 and is left out here.
import type { PlateText, Variant } from '../types';
import { spec } from '../../lib/colour';
import { clipping, RAYLEIGH_SLIDE } from './clipping';
import { airMol, beam as waves, defs as waveDefs, wv as wave } from './s2';
import type { Col } from './s2';
import './l03.css';

export const PLATE: PlateText = {
  n: '3',
  status: 'confirmed',
  title: 'Light is a wave',
  lead: 'Light is an electromagnetic wave; its wavelength (<i>λ</i>) sets its colour.',
  points: [
    { claim: 'Electromagnetic spectrum.', text: 'Sunlight mixes ultraviolet, visible and infrared light.' },
    { claim: 'Visible light and PAR.', text: 'Human vision: ≈ 380–780 nm<br>PAR (photosynthetically active radiation): 400–700 nm, by convention' },
    { claim: 'Rayleigh scattering.', text: 'Scattered intensity <span class="math">∝</span> 1/<i>λ</i>⁴<br>Blue is scattered ~4× more than red: blue sky by day, red Sun at sunset.' },
  ],
  play: 'life',
  refs: [
    { label: 'Rayleigh 1871', url: 'https://doi.org/10.1080/14786447108640452' },
    { label: 'CIE: visible radiation', url: 'https://cie.co.at/eilvterm/17-21-003' },
    { label: 'CIE: PAR', url: 'https://cie.co.at/eilvterm/17-26-079' },
    { label: 'Kasten & Young 1989', url: 'https://doi.org/10.1364/AO.28.004735' },
    { label: 'Gan et al. 2014', url: 'https://doi.org/10.1126/science.1256963' },
    { label: 'Zhen et al. 2022', url: 'https://doi.org/10.1111/nph.18375' },
  ],
};

// Round 4 (26 Oct 2026): the lecturer picked X and Y.
export const VARIANTS: Variant[] = [
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

/* ========== The picks X and Y (26 Oct 2026, built from the earlier pick 3S) ==========
   A scattering drawing above the 1/λ⁴ curve on the wavelength axis; the ranges marked: human vision 380–780 nm, PAR
   400–700 nm and far-red 700–750 nm, which plants use together with PAR (Zhen et al. 2022) and some cyanobacteria
   use alone (Gan et al. 2014); Rayleigh's clipping. */

const BLUE = '#2350e6', RED = '#c8361e';

/** The colour's name, in its colour. */
const nameOf = (nm: 450 | 650): string => `<tspan class="${nm === 450 ? 'fl03-blue' : 'fl03-red'}">${nm === 450 ? 'blue' : 'red'}</tspan>`;

/** A section's name, centred over it when it fits (`w`: its width in px), else set against the inner divider. */
function secName(a: Ax, n0: number, n1: number, y: number, s: string, w: number, side: 'start' | 'end'): string {
  const x0 = X(a, Math.max(n0, a.nm0)), x1 = X(a, Math.min(n1, a.nm1));
  if (x1 - x0 >= w + 16) return T((x0 + x1) / 2, y, s, 'fl03-sec', 'middle');
  return side === 'end' ? T(x1 - 8, y, s, 'fl03-sec', 'end') : T(x0 + 8, y, s, 'fl03-sec', 'start');
}

/** A few air molecules (two touching atom balls, each with its letter) around (x, y); never drawn below r = 8.5 so the
 *  letters (≥ 11 px) fit inside their balls. */
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
    ${airCluster(cx, cy, Math.max(8.5, 8.5 * s))}`;
}

const VIS_L = 'human vision';
const PAR_L = '<tspan class="fl03-parb">PAR</tspan>'; // spelled out in the page text, so the figure keeps the short name
const FR_L = '<tspan class="fl03-frb">far-red:</tspan> plants use it with PAR';
const FR_L2 = 'some cyanobacteria use it alone';

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

/* ---------- 3X · Big drawing: the scattering drawing large, the curve short beneath it ---------- */

function drawX(): string {
  const p = 'fl03x';
  const a: Ax = { x0: 90, x1: 770, nm0: 280, nm1: 1000 };
  const top = 262, base = 356, ax = 364, br = ax + 144;
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Large, at the top: sunlight meets air molecules; blue is scattered in all directions, red mostly passes. Beneath, across the figure, how strongly air scatters light against wavelength, relative to red at 650 nm, falling steeply as one over wavelength to the fourth: blue at 450 nm about four times red. Brackets under the wavelength axis, from 300 to 1000 nm, mark PAR, 400 to 700 nm, far-red, 700 to 750 nm, which plants use together with PAR and some cyanobacteria use alone, and human vision, 380 to 780 nm. Top right: a newspaper clipping of Lord Rayleigh, 1871.">
    ${waveDefs(p)}
    ${airDrawing(p, { cx: 236, cy: 124, inLen: 206, r: 98, pass: 128, s: 1.35, sun: [30, 94, 'start'], mol: [172, 192, 'end'], blue: [310, 36, 'start'], blueTwo: true, red: [376, 131, 'start'] })}
    ${scCurve(a, top, base, ax + 30, 38, top - 22)}
    ${axisRows(p, a, ax, { ticks: [300, 400, 500, 600, 700, 800, 900, 1000] })}
    ${rb(a, 400, 700, br, 'par')}${rb(a, 700, 750, br, 'fr')}
    ${T(X(a, 550), br + 26, PAR_L, 'fl03-exp', 'middle')}${T(X(a, 700) + 8, br + 26, FR_L, 'fl03-exp', 'start')}${T(X(a, 700) + 8, br + 50, FR_L2, 'fl03-exp', 'start')}
    ${rb(a, 380, 780, br + 76, 'vis')}${T(X(a, 380) - 12, br + 80, VIS_L, 'fl03-s', 'end')}
    ${clipping(p, 580, 14, 200, RAYLEIGH_SLIDE, 2, 11)}
  </svg>`;
}

/* ---------- 3Y · Tall curve: a small drawing, a tall curve, the clipping on the left ---------- */

function drawY(): string {
  const p = 'fl03y';
  const a: Ax = { x0: 342, x1: 774, nm0: 280, nm1: 880 };
  const top = 168, base = 318, ax = 328, br = ax + 156;
  const side = (n0: number, y: number, s: string): string => T(X(a, n0) - 12, y + 4, s, 'fl03-exp', 'end');
  return `<svg class="fig-svg fl03" viewBox="0 0 800 600" role="img" aria-label="Top right, small: sunlight meets air molecules; blue is scattered in all directions, red mostly passes. Below it, tall: how strongly air scatters light against wavelength, relative to red at 650 nm, falling steeply as one over wavelength to the fourth: blue at 450 nm about four times red. Brackets under the wavelength axis, from 300 to 800 nm, mark human vision, 380 to 780 nm, PAR, 400 to 700 nm, and far-red, 700 to 750 nm, which plants use together with PAR and some cyanobacteria use alone. Left: a newspaper clipping of Lord Rayleigh, 1871.">
    ${waveDefs(p)}
    ${airDrawing(p, { cx: 486, cy: 66, inLen: 166, r: 50, pass: 96, s: 0.8, sun: [320, 44, 'start'], mol: [446, 106, 'end'], blue: [600, 26, 'start'], blueTwo: true, red: [594, 80, 'start'] })}
    ${scCurve(a, top, base, ax + 30, a.x0 - 52, top - 20, { ticks: [0, 2, 4, 6, 8] })}
    ${axisRows(p, a, ax)}
    ${rb(a, 380, 780, br, 'vis')}${side(380, br, VIS_L)}
    ${rb(a, 400, 700, br + 36, 'par')}${side(400, br + 36, PAR_L)}
    ${rb(a, 700, 750, br + 72, 'fr')}${side(700, br + 72, FR_L)}${side(700, br + 96, FR_L2)}
    ${clipping(p, 16, 111, 248, RAYLEIGH_SLIDE, -2)}
  </svg>`;
}

const DRAW: Record<string, () => string> = { a: drawA, e: drawE, h: drawH, x: drawX, y: drawY };

export function draw(id: string): string {
  return (DRAW[id] ?? drawX)();
}
