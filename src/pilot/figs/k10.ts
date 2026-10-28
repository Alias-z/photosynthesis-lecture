// Slide C9 · CO₂-response curve and the FvCB model (C10 in the 18-slide plan), the deck's only FvCB slide (redo of 27 Oct 2026, block L2b). Real figures:
// Gregory et al. 2021 Fig. 2A, B (rice, replicate 1 of Xiao et al. 2021: A against chloroplast CO₂ Cc with fitted
// RuBisCO-limited, red, RuBP regeneration-limited, blue, and TPU-limited, gold, rates; rendered from the vector PDF at 600 dpi,
// axes redrawn; their Table 1, rep 1 with TPU: Vcmax 194, J 178, TPU 10.9 µmol m⁻² s⁻¹) and Stinziano et al. 2017 Fig. 2
// (RACiR ramps over the standard steady-state A/Cᵢ curve of Populus deltoides; CC BY-NC-ND, shown whole and unaltered; RACiR
// ≈ 5 min per curve, standard 30–60 min) and Coursolle et al. 2019 Fig. 4B (CC BY; a RACiR curve of balsam fir with its FvCB fit).
// d is the one drawn variant (FvCB: A = min(Ac, Aj, Ap)).
// Sources and crops: assets/SOURCES-L2b.md.
import type { PlateText, Variant } from '../types';
import gaPng from '../../assets/photos/c9-gregory-a.png';
import gbPng from '../../assets/photos/c9-gregory-b.png';
import stJpg from '../../assets/photos/c9-stinziano.jpg';
import coPng from '../../assets/photos/c9-coursolle-b.png';
import './k10.css';

export const PLATE: PlateText = {
  n: 'C9',
  title: 'CO₂-response curve and the FvCB model',
  status: 'draft',
  lead: 'The FvCB model explains the CO₂ response of photosynthesis: the slowest of three processes sets the rate.',
  points: [
    { claim: 'RuBisCO-limited.', text: 'At low <i>C</i>ᵢ, uptake rises steeply with CO₂<br>Set by RuBisCO amount and activity (<i>V</i>cmax)' },
    { claim: 'RuBP regeneration-limited.', text: 'At higher <i>C</i>ᵢ, uptake rises slowly<br>Set by electron transport supplying ATP and NADPH (<i>J</i>max)' },
    { claim: 'TPU-limited.', text: 'At very high <i>C</i>ᵢ, uptake stops rising<br>Set by how fast triose phosphate is used for sucrose and starch' },
  ],
  refs: [
    { label: 'Farquhar, von Caemmerer & Berry 1980', url: 'https://doi.org/10.1007/BF00386231' },
    { label: 'Gregory et al. 2021', url: 'https://doi.org/10.1111/pce.14153' },
    { label: 'Stinziano et al. 2017', url: 'https://doi.org/10.1111/pce.12911' },
    { label: 'Coursolle et al. 2019', url: 'https://doi.org/10.3389/fpls.2019.01276' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'RuBisCO-, RuBP regeneration- and TPU-limited fits (rice)' },
  { id: 'b', name: 'Fit without vs with TPU (rice)' },
  { id: 'c', name: 'Fitted Vcmax 194, J 178, TPU 10.9 µmol m⁻² s⁻¹' },
  { id: 'd', name: 'FvCB: A = min(Ac, Aj, Ap) (drawn)' },
  { id: 'e', name: 'FvCB fit: steady-state curve vs RACiR ramp' },
  { id: 'f', name: 'RACiR (≈ 5 min) vs steady-state A/Ci (30–60 min)' },
];

/* ---------- shared parts (after l04b u–z) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number }
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fk10-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** Rotated axis title, centred on (x, y). */
const TV = (x: number, y: number, s: string, cls = 'fk10-at'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="middle" transform="rotate(-90 ${f(x)} ${f(y)})">${s}</text>`;
const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;
const sb = (s: string): string => `<tspan baseline-shift="sub" font-size="72%">${s}</tspan>`;


/** A real image: the window win = [u0, v0, width, height] of it (image pixels) shown w wide at x, y, its height following.
 *  A photo sits in a rounded frame with a dark credit band; a published figure ('fig') keeps its white ground multiplied into
 *  the page and is credited separately in grey. at() maps image pixels to the figure. */
function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; credit?: string; top?: boolean; hole?: [number, number, number, number] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  let band = '';
  if (o.credit) {
    const by = o.top ? y : y + h - 22;
    band = `<rect class="fk10-credbg" x="${f(x)}" y="${f(by)}" width="${f(w)}" height="22"/>${T(x + w - 8, by + 15.5, o.credit, 'fk10-cr', 'end')}`;
  }
  const hl = o.hole ? (([a, b, c, d]) => ` M${f(ox + a * s)},${f(oy + b * s)} H${f(ox + c * s)} V${f(oy + d * s)} H${f(ox + a * s)}Z`)(o.hole) : '';
  const clip = o.fig
    ? `<clipPath id="${id}"><path clip-rule="evenodd" d="M${f(x)},${f(y)} h${f(w)} v${f(h)} h${f(-w)}Z${hl}"/></clipPath>`
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fk10-mult"' : ''}>${img}${band}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h };
}
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fk10-ldh" d="${d}"/><path class="fk10-ldk" d="${d}"/><circle class="fk10-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
/** A label pill centred at (x, y): white on photos, tinted on white-ground figures; with `to`, a leader from its edge. */
function pill(x: number, y: number, s: string, to?: Pt, tint = false): string {
  const w = s.replace(/<[^>]+>/g, '').length * 9.2 + 22;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    ld = pleader([x + dx * t, y + dy * t], to);
  }
  return `${ld}<rect class="${tint ? 'fk10-pillbg-t' : 'fk10-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>${T(x, y + 6, s, 'fk10-pill', 'middle')}`;
}
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fk10-crd', a);
const realSvg = (label: string, body: string): string =>
  `<svg class="fig-svg fk10" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;


const GA: Img = { href: gaPng, w: 900, h: 561 };
const GB: Img = { href: gbPng, w: 900, h: 561 };
const ST: Img = { href: stJpg, w: 1000, h: 1379 };
const CO: Img = { href: coPng, w: 721, h: 503 };
const CR = {
  gr: 'Gregory et al. 2021, Plant Cell Environ, Fig. 2A, B, CC BY 4.0 (data: Xiao et al. 2021)',
  grb: 'Gregory et al. 2021, Plant Cell Environ, Fig. 2B, CC BY 4.0 (data: Xiao et al. 2021)',
  st: 'Stinziano et al. 2017, Plant Cell Environ, Fig. 2, CC BY-NC-ND 4.0 (unaltered)',
  co: 'Coursolle et al. 2019, Front Plant Sci, Fig. 4B, CC BY 4.0',
};
const red = (s: string): string => `<tspan class="fk10-red">${s}</tspan>`;
const blue = (s: string): string => `<tspan class="fk10-blue">${s}</tspan>`;
const gold = (s: string): string => `<tspan class="fk10-gold">${s}</tspan>`;
const cc = `${it('C')}${sb('c')}`;

/* ---------- Gregory et al. 2021 Fig. 2A, B: plot areas with redrawn axes ---------- */
// Asset (0.727 × the 600-dpi render): Cc (Pa) → u = 43.8 + 8.128 Cc; A → v = 532.5 − 10.011 A; axes lines at u 2.9, v 557.6.
const gU = (pa: number): number => 43.8 + 8.128 * pa;
const gV = (a: number): number => 532.5 - 10.011 * a;

function grPlot(p: string, im: Img, x: number, y: number, w: number, o: { yLabels?: boolean } = {}): { svg: string; h: number; at: (u: number, v: number) => Pt; yb: number } {
  const a = shot(`${p}-${im === GA ? 'ga' : 'gb'}`, im, x, y, w, { fig: true });
  const xl = a.at(2.9, 0)[0], yb = a.at(0, 557.6)[1];
  const tk: string[] = [];
  for (const q of [0, 25, 50, 75, 100]) { const xx = a.at(gU(q), 0)[0]; tk.push(`<path class="fk10-tk" d="M${f(xx)},${f(yb)} v7"/>${T(xx, yb + 26, `${q}`, 'fk10-ax', 'middle')}`); }
  if (o.yLabels !== false) {
    for (const v of [0, 10, 20, 30, 40, 50]) { const yy = a.at(0, gV(v))[1]; tk.push(`<path class="fk10-tk" d="M${f(xl)},${f(yy)} h-7"/>${T(xl - 12, yy + 6, `${v}`, 'fk10-ax', 'end')}`); }
    tk.push(TV(xl - 50, y + a.h / 2, `${it('A')} (µmol m⁻² s⁻¹)`));
  }
  tk.push(T(x + w / 2, yb + 54, `Chloroplast CO₂, ${cc} (Pa)`, 'fk10-at', 'middle'));
  return { svg: `${a.svg}${tk.join('')}`, h: a.h, at: a.at, yb };
}

/* a · Gregory et al. 2021 Fig. 2B large with the three limitations */

function drawA(): string {
  const g = grPlot('fk10a', GB, 130, 20, 620);
  return realSvg('Gregory and colleagues 2021, figure 2B: net carbon dioxide assimilation A of a rice leaf, black points, against chloroplast carbon dioxide Cc from 0 to 100 pascal, with the fitted Farquhar–von Caemmerer–Berry model. Red: the RuBisCO-limited rate, which fits the steep rise at low carbon dioxide; blue: the RuBP regeneration-limited rate, which fits the bend; gold: the triose-phosphate-use-limited rate, a plateau at the highest carbon dioxide. At every Cc the lowest of the three is the predicted rate.', `
    ${g.svg}
    ${pill(450, 48, red('RuBisCO-limited'), g.at(gU(30), gV(42)), true)}
    ${pill(600, 100, blue('RuBP regeneration-limited'), g.at(gU(80), gV(35.6)), true)}
    ${pill(650, 220, gold('TPU-limited'), g.at(gU(85), gV(31.9)), true)}
    ${T(440, 540, `${it('A')} = min(${it('A')}${sb('c')}, ${it('A')}${sb('j')}, ${it('A')}${sb('p')})`, 'fk10-eq', 'middle')}
    ${credit(780, 592, CR.grb)}
  `);
}

/* b · Gregory et al. 2021 Fig. 2A and B: the same rice curve fitted without and with TPU */

function drawB(): string {
  const a = grPlot('fk10b', GA, 92, 120, 340);
  const b = grPlot('fk10b', GB, 450, 120, 340, { yLabels: false });
  return realSvg('Gregory and colleagues 2021, figure 2A and B: the same rice A/Cc curve fitted twice. Left, without a triose-phosphate-use limitation: red RuBisCO-limited and blue RuBP regeneration-limited rates; the blue curve keeps rising above the last points. Right, with it: the gold TPU-limited plateau fits the flat top of the data.', `
    ${a.svg}${b.svg}
    ${pill(262, 84, 'fit without TPU', undefined, true)}${pill(620, 84, `fit with ${gold('TPU')}`, undefined, true)}
    ${T(400, 500, `${red('RuBisCO-limited')}  ·  ${blue('RuBP regeneration-limited')}  ·  ${gold('TPU-limited')}`, 'fk10-l', 'middle')}
    ${credit(780, 592, CR.gr)}
  `);
}

/* c · Gregory et al. 2021 Fig. 2B with the fitted parameters (their Table 1, rep 1 with TPU) */

function drawC(): string {
  const g = grPlot('fk10c', GB, 130, 20, 620);
  const um = 'µmol m⁻² s⁻¹';
  return realSvg('Gregory and colleagues 2021, figure 2B, the rice A/Cc curve with its fitted model, labelled with the fitted parameters from their table 1: maximum carboxylation rate Vcmax 194, electron transport rate J 178 and triose-phosphate use TPU 10.9 micromoles per square metre per second.', `
    ${g.svg}
    ${pill(500, 48, `${red(`${it('V')}${sb('cmax')}`)} = 194 ${um}`, g.at(gU(30), gV(42)), true)}
    ${pill(600, 100, `${blue(it('J'))} = 178 ${um}`, g.at(gU(80), gV(35.6)), true)}
    ${pill(620, 220, `${gold('TPU')} = 10.9 ${um}`, g.at(gU(85), gV(31.9)), true)}
    ${credit(780, 592, `${CR.grb}; values: their Table 1`)}
  `);
}

/* ---------- d · drawn: the FvCB model, the lowest of three rates ---------- */
// Shapes from the FvCB equations (Cc in Pa): A꜀ = 120 (Cc − 4)/(Cc + 60) − 1.5; Aⱼ = 180 (Cc − 4)/(4 Cc + 32) − 1.5;
// Aₚ = 36 − 1.5. Shape only; no values on the axes.

function drawD(): string {
  const X = (c: number): number => 120 + c * 6, Y = (a: number): number => 500 - a * 9.5;
  const ac = (c: number): number => 120 * (c - 4) / (c + 60) - 1.5;
  const aj = (c: number): number => 180 * (c - 4) / (4 * c + 32) - 1.5;
  const ap = (): number => 34.5;
  const line = (fn: (c: number) => number, c0: number, c1: number): string =>
    Array.from({ length: 61 }, (_, i) => { const c = c0 + (c1 - c0) * i / 60; return `${i ? 'L' : 'M'}${f(X(c))},${f(Y(fn(c)))}`; }).join(' ');
  const env = (c: number): number => Math.min(ac(c), aj(c), ap());
  return `<svg class="fig-svg fk10" viewBox="0 0 800 600" role="img" aria-label="Drawn Farquhar–von Caemmerer–Berry model: net assimilation A against chloroplast carbon dioxide Cc. Three potential rates: the RuBisCO-limited rate rises steeply and keeps rising; the RuBP regeneration-limited rate rises more slowly and bends over; the triose-phosphate-use-limited rate is flat. The actual rate, drawn thick, is the lowest of the three: RuBisCO-limited at low Cc, RuBP regeneration-limited in the middle, TPU-limited at high Cc.">
    <path class="fk10-ax-l" d="M${X(0)},${Y(52)} V${Y(-3)} H${X(100)}"/>
    <path class="fk10-c-red" d="${line(ac, 4, 44)}"/>
    <path class="fk10-c-blue" d="${line(aj, 6, 100)}"/>
    <path class="fk10-c-gold" d="M${X(20)},${Y(ap())} H${X(100)}"/>
    <path class="fk10-env" d="${line(env, 4.2, 100)}"/>
    ${T(X(0) - 14, Y(52) + 8, it('A'), 'fk10-h', 'end')}${T(X(100), Y(-3) + 34, cc, 'fk10-h', 'end')}
    ${pill(250, Y(46), `${red('RuBisCO-limited')} (${it('V')}${sb('cmax')})`, [X(30), Y(ac(30))], true)}
    ${pill(470, Y(16), `${blue('RuBP regeneration-limited')} (${it('J')}${sb('max')})`, [X(36), Y(aj(36))], true)}
    ${pill(640, Y(44), gold('TPU-limited'), [X(80), Y(ap())], true)}
    ${T(420, 570, `${it('A')} = min(${it('A')}${sb('c')}, ${it('A')}${sb('j')}, ${it('A')}${sb('p')})`, 'fk10-eq', 'middle')}
    ${credit(780, 596, 'Drawn after Farquhar, von Caemmerer & Berry 1980')}
  </svg>`;
}

/* e · a steady-state FvCB fit (Gregory et al. 2021, Fig. 2B) beside a rapid RACiR curve with its FvCB fit (Coursolle et al.
 *  2019, Fig. 4B, balsam fir) */
// CO asset (plot box, 1713-px PDF image): Cᵢ (µmol mol⁻¹) → u = 27.5 + 0.55375 Cᵢ; Aₙ → v = 482.5 − 15.367 Aₙ; frame at u 1, v 500.
const cU = (ci: number): number => 27.5 + 0.55375 * ci;
const cV = (a: number): number => 482.5 - 15.367 * a;

function drawE(): string {
  const g = grPlot('fk10e', GB, 92, 110, 330);
  const c = shot('fk10e-c', CO, 470, 110, 310, { fig: true, hole: [8, 6, 58, 60] });
  const xl = c.at(1, 0)[0], yb = c.at(0, 500)[1];
  const tk: string[] = [];
  for (const q of [0, 400, 800, 1200]) { const xx = c.at(cU(q), 0)[0]; tk.push(`<path class="fk10-tk" d="M${f(xx)},${f(yb)} v7"/>${T(xx, yb + 26, `${q}`, 'fk10-ax', 'middle')}`); }
  for (const v of [0, 10, 20, 30]) { const yy = c.at(0, cV(v))[1]; tk.push(`<path class="fk10-tk" d="M${f(xl)},${f(yy)} h-7"/>${T(xl - 12, yy + 6, `${v}`, 'fk10-ax', 'end')}`); }
  return realSvg('Left: Gregory and colleagues 2021, figure 2B: a steady-state rice A/Cc curve with the fitted RuBisCO-limited, RuBP regeneration-limited and TPU-limited rates. Right: Coursolle and colleagues 2019, figure 4B: a rapid A/Ci curve of balsam fir, measured during a continuous carbon dioxide ramp, hundreds of points, with the same model fitted: RuBisCO-limited rate red, RuBP regeneration-limited rate blue, the limiting rate black.', `
    ${g.svg}${c.svg}${tk.join('')}
    ${T(c.at(cU(600), 0)[0], yb + 54, `${it('C')}${sb('i')} (µmol mol⁻¹)`, 'fk10-at', 'middle')}
    ${pill(257, 70, 'steady state (rice)', undefined, true)}
    ${pill(625, 70, 'RACiR ramp (fir)', undefined, true)}
    ${T(400, 520, `${red('RuBisCO-limited')}  ·  ${blue('RuBP regeneration-limited')}  ·  ${gold('TPU-limited')}`, 'fk10-l', 'middle')}
    ${credit(780, 574, CR.grb)}${credit(780, 592, CR.co)}
  `);
}

/* f · Stinziano et al. 2017 Fig. 2 large (whole, unaltered) */

function drawF(): string {
  const s = shot('fk10f-s', ST, 236, 12, 410, { fig: true });
  return realSvg('Stinziano and colleagues 2017, figure 2: rapid A/Ci response curves of a poplar leaf, measured while the carbon dioxide in the chamber was ramped continuously from 500 to 0, blue, or from 300 to 800 micromoles per mole, red, lie on the standard steady-state A/Ci curve of the same leaf, grey points with error bars. A ramp takes about 5 minutes, a standard curve 30 to 60 minutes.', `
    ${s.svg}
    ${pill(124, 470, 'RACiR ramps', s.at(222, 930), true)}${T(124, 504, '≈ 5 min per curve', 'fk10-s', 'middle')}
    ${pill(124, 90, 'steady state', s.at(806, 99), true)}${T(124, 124, '30–60 min per curve', 'fk10-s', 'middle')}
    ${credit(780, 592, CR.st)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
