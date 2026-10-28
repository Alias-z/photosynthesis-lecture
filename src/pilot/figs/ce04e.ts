// Slide C4e · Efficiency of photosynthesis (research/redo-2026-10-29/EFFICIENCY_BRIEF.md, lecturer, 29 Oct 2026): after C4
// (sucrose and starch), before C6 (photorespiration). How much of the sunlight ends up in biomass, and where the rest goes.
// Values: the minimum energy losses from sunlight on a leaf to biomass, in % of the incident solar energy (full spectrum),
// C₃ and C₄ (NADP-malic enzyme), 30 °C (Zhu, Long & Ort 2008, Curr Opin Biotechnol 19:153, Fig. 1, 380 ppm CO₂; the same
// steps in Zhu, Long & Ort 2010, Annu Rev Plant Biol 61:235, Fig. 2 and text, 387 ppm, read in full): outside 400–700 nm
// 51.3; reflected and transmitted 4.9; photochemical inefficiency 6.6; carbohydrate synthesis 24.6 (C₃) or 28.7 (C₄)
// (2010 splits it into a thermodynamic limit of 13.8 and 10.78 for C₃); photorespiration 6.1 or 0; respiration 1.9 or 2.5;
// left in biomass 4.6 or 6.0. Remaining after each step (C₃): 48.7, 43.8, 37.2, 12.6, 6.5, 4.6; (C₄) 48.7, 43.8, 37.2, 8.5,
// 8.5, 6.0. Note: the 2010 Fig. 2 prints 26.0 after the thermodynamic limit and 13.4 / 17.5 for carbohydrate biosynthesis,
// which do not add up (37.2 − 13.8 = 23.4); its text gives 13.8 + 10.78 = 24.6, as 2008. The figures here use the 2008 steps.
// - e1 · waterfall (C₃) · e2 · Sankey band (C₃) · e3 · C₃ and C₄ step by step · e4 · each loss with the part of the
//   process it comes from (spectrum, leaf, excitation, the cycle, RuBisCO, mitochondrion; the mitochondrion is the TEM of
//   Frederick & Newcomb 1969, Fig. 6, as on C6).
import './ce04e.css';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import mitoJpg from '../../assets/rf/fn6-mito.jpg';
import { metab } from './carbon-form';
import { balls } from './cell-schema';
import { rowG } from './chain';
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: 'C4e',
  title: 'Efficiency of photosynthesis',
  status: 'draft',
  lead: 'At most ≈ 4.6 % of the solar energy<br>is stored in biomass by C₃ plants,<br>≈ 6 % by C₄ plants.',
  points: [
    { claim: 'Carbon.', text: 'Net, 15 C return to RuBP and 3 C leave: every fixed carbon is kept<br>Carbon is lost only by photorespiration', eq: 'per 3 CO₂: 3 C in as CO₂ = 3 C out as 1 triose phosphate' },
    { claim: 'Energy per CO₂.', text: 'ATP and NADPH are used; ADP, Pᵢ and NADP⁺ are recharged in the thylakoid', eq: '1 CO₂: 3 ATP + 2 NADPH<br>from ≥ 8 absorbed photons; ≈ 9.4 measured' },
    { claim: 'Energy losses.', text: 'Largest losses: light outside 400–700 nm and the conversion into sugar; photorespiration 6.1 % in C₃', eq: 'C₃, % of solar energy:<br>100 − 51.3 − 4.9 − 6.6 − 24.6 − 6.1 − 1.9 = 4.6' },
  ],
  refs: [
    { label: 'Zhu, Long & Ort 2008', url: 'https://doi.org/10.1016/j.copbio.2008.02.004' },
    { label: 'Zhu, Long & Ort 2010', url: 'https://doi.org/10.1146/annurev-arplant-042809-112206' },
    { label: 'Björkman & Demmig 1987', url: 'https://doi.org/10.1007/BF00402983' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'e1', name: 'Energy-loss waterfall, C₃: 100 % sunlight to 4.6 % biomass (after Zhu et al. 2008, Fig. 1)' },
  { id: 'e2', name: 'Sankey band, C₃: each loss peels off in order' },
  { id: 'e3', name: 'C₃ and C₄ step by step' },
  { id: 'e4', name: 'Each loss where it happens: spectrum, leaf, excitation, cycle, RuBisCO, mitochondrion' },
];

/* ---------------------------------------------------------------- the values (% of incident solar energy) */

export interface Step { k: 'par' | 'refl' | 'photo' | 'carb' | 'pr' | 'resp'; name: string; two: [string, string]; c3: number; c4: number }
export const STEPS: Step[] = [
  { k: 'par', name: 'outside 400–700 nm', two: ['outside', '400–700 nm'], c3: 51.3, c4: 51.3 },
  { k: 'refl', name: 'reflected and transmitted', two: ['reflected,', 'transmitted'], c3: 4.9, c4: 4.9 },
  { k: 'photo', name: 'photochemical inefficiency', two: ['photochemical', 'inefficiency'], c3: 6.6, c4: 6.6 },
  { k: 'carb', name: 'carbohydrate synthesis', two: ['carbohydrate', 'synthesis'], c3: 24.6, c4: 28.7 },
  { k: 'pr', name: 'photorespiration', two: ['photo-', 'respiration'], c3: 6.1, c4: 0 },
  { k: 'resp', name: 'respiration', two: ['respiration', ''], c3: 1.9, c4: 2.5 },
];
/** What is left after each step: [100, after step 1, …]; rounded to 0.1 as published. */
export const left = (p: 'c3' | 'c4'): number[] => STEPS.reduce((a, s) => [...a, Math.round((a[a.length - 1] - s[p]) * 10) / 10], [100]);
export const CREDIT = 'Values: Zhu, Long & Ort 2008, Curr Opin Biotechnol 19:153, Fig. 1; Zhu, Long & Ort 2010, Annu Rev Plant Biol 61:235, Fig. 2';
export const fmt = (v: number): string => (v === 0 ? '0' : v.toFixed(1));

type Pt = [number, number];
type A = 'start' | 'middle' | 'end';
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'middle', extra = ''): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}"${extra}>${s}</text>`;
const svg = (label: string, body: string, defs = ''): string =>
  `<svg class="fig-svg ef" viewBox="0 0 800 600" role="img" aria-label="${label}"><defs>${defs}</defs>${body}</svg>`;
const lossCls = (k: Step['k']): string => (k === 'pr' ? 'ef-loss-pr' : 'ef-loss');

/* ---------------------------------------------------------------- e1 · waterfall */

function e1(): string {
  const y0 = 470, k = 4, x0 = 76, cw = 89.5, bw = 54, L = left('c3');
  const Y = (v: number): number => y0 - v * k, X = (i: number): number => x0 + cw * (i + 0.5);
  const grid = [0, 20, 40, 60, 80, 100].map(v => `<path class="ef-grid" d="M${x0},${Y(v)}H${x0 + cw * 8}"/>${T(x0 - 8, Y(v) + 4, String(v), 'ef-tk', 'end')}`).join('');
  const bar = (i: number, top: number, bot: number, cls: string): string => `<rect class="${cls}" x="${f(X(i) - bw / 2)}" y="${f(Y(top))}" width="${bw}" height="${f(Math.max(1.5, (top - bot) * k))}" rx="3"/>`;
  const label = (i: number, a: string, b: string): string => `${T(X(i), y0 + 22, a, 'ef-t')}${b ? T(X(i), y0 + 38, b, 'ef-t') : ''}`;
  let s = `${bar(0, 100, 0, 'ef-sun')}${T(X(0), Y(100) - 8, '100', 'ef-n')}${label(0, 'sunlight', 'on the leaf')}`;
  STEPS.forEach((st, i) => {
    const top = L[i], bot = L[i + 1];
    s += `<path class="ef-con" d="M${f(X(i) + bw / 2)},${f(Y(top))}H${f(X(i + 1) - bw / 2)}"/>`;
    s += bar(i + 1, top, bot, lossCls(st.k)) + T(X(i + 1), Y(top) - 8, `−${fmt(st.c3)}`, st.k === 'pr' ? 'ef-np' : 'ef-n') + label(i + 1, ...st.two);
  });
  s += `<path class="ef-con" d="M${f(X(6) + bw / 2)},${f(Y(L[6]))}H${f(X(7) - bw / 2)}"/>${bar(7, L[6], 0, 'ef-bio')}${T(X(7), Y(L[6]) - 8, fmt(L[6]), 'ef-nl')}${label(7, 'biomass', '')}`;
  return svg('Waterfall of the minimum energy losses from sunlight on a C3 leaf to biomass, in percent of the incident solar energy: of 100, 51.3 is outside 400 to 700 nanometres, 4.9 is reflected and transmitted, 6.6 is lost as photochemical inefficiency, 24.6 in carbohydrate synthesis, 6.1 to photorespiration and 1.9 to respiration, leaving 4.6 in biomass.', `
    ${grid}<path class="ef-axis" d="M${x0},${Y(100) - 6}V${y0}H${x0 + cw * 8}"/>
    ${T(24, Y(50), '% of the solar energy', 'ef-ax', 'middle', ` transform="rotate(-90 24 ${Y(50)})"`)}
    ${s}
    ${T(784, 548, 'C₃ leaf, 30 °C', 'ef-cr', 'end')}${T(784, 566, CREDIT.split('; ')[0], 'ef-cr', 'end')}${T(784, 582, CREDIT.split('; ')[1], 'ef-cr', 'end')}`);
}

/* ---------------------------------------------------------------- e2 · Sankey band */

/** A loss peeling off the bottom of the band at x: the slice [yA, yB] turns down (inner radius ri) and runs to yEnd. */
export function peel(x: number, yA: number, yB: number, yEnd: number, ri = 16): string {
  const w = yB - yA, ro = ri + w, cy = yB + ri;
  // outer edge (top of the slice) and inner edge (bottom of the slice), both quarter circles about (x, cy)
  return `M${f(x)},${f(yA)}A${f(ro)},${f(ro)} 0 0 1 ${f(x + ro)},${f(cy)}V${f(yEnd)}H${f(x + ri)}V${f(cy)}A${f(ri)},${f(ri)} 0 0 0 ${f(x)},${f(yB)}Z`;
}
/** Peel geometry for the band: per step its x, its slice and the centre of its foot. */
export function sankey(xs: number[], top: number, k: number, p: 'c3' | 'c4' = 'c3', ri = 16): Array<{ x: number; yA: number; yB: number; foot: number }> {
  const L = left(p);
  return STEPS.map((st, i) => {
    const yA = top + L[i + 1] * k, yB = top + L[i] * k;
    return { x: xs[i], yA, yB, foot: xs[i] + ri + (yB - yA) / 2 };
  });
}
function e2(): string {
  const top = 70, k = 3.6, yEnd = 472, xs = [44, 290, 380, 482, 610, 694], xE = 752, L = left('c3');
  const P = sankey(xs, top, k, 'c3', 24);
  const band = `M20,${top}H${xE}V${f(top + L[6] * k)}${P.map((q, i) => `H${f(q.x)}V${f(top + L[i] * k)}`).reverse().join('')}H20Z`;
  const peels = P.map((q, i) => `<path class="${lossCls(STEPS[i].k)}" d="${peel(q.x, q.yA, q.yB, yEnd, 24)}"/>`).join('');
  const feet = P.map((q, i) => `${T(q.foot, yEnd + 22, STEPS[i].two[0], 'ef-t')}${STEPS[i].two[1] ? T(q.foot, yEnd + 38, STEPS[i].two[1], 'ef-t') : ''}${T(q.foot, yEnd + 60, fmt(STEPS[i].c3), STEPS[i].k === 'pr' ? 'ef-np' : 'ef-n')}`).join('');
  const tops = [T(20, top - 12, '100', 'ef-n', 'start'), ...P.map((q, i) => T(i < 5 ? (q.x + 30 + xs[i + 1]) / 2 : (q.x + 24 + xE) / 2, top - 12, fmt(L[i + 1]), 'ef-tk'))].join('');
  const bio = `<path class="ef-bio" d="M${xE},${top - 6}l22,${f((L[6] * k) / 2 + 6)}l-22,${f((L[6] * k) / 2 + 6)}Z"/><rect class="ef-bio" x="${xE - 24}" y="${top}" width="24" height="${f(L[6] * k)}"/>`;
  return svg('A band of sunlight, 100 percent of the solar energy on a C3 leaf, from which each loss peels off in turn: 51.3 outside 400 to 700 nanometres, 4.9 reflected and transmitted, 6.6 photochemical inefficiency, 24.6 carbohydrate synthesis, 6.1 photorespiration, 1.9 respiration. What is left after each step is written above the band: 48.7, 43.8, 37.2, 12.6, 6.5 and 4.6, which ends in biomass.', `
    <path class="ef-sun" d="${band}" style="opacity:.85"/>${peels}${bio}
    ${tops}${T(xE + 2, top + 38, 'biomass', 'ef-name', 'end')}${T(xE + 2, top + 64, '4.6', 'ef-nb', 'end')}
    ${T(20, top + 30, 'sunlight', 'ef-name', 'start')}${T(20, top + 50, '% of the solar energy', 'ef-det', 'start')}
    ${feet}
    ${T(784, 584, `C₃ leaf, 30 °C · ${CREDIT.split('; ')[0].replace('Values: ', 'values: ')}; 2010, Fig. 2`, 'ef-cr', 'end')}`);
}

/* ---------------------------------------------------------------- e3 · C₃ and C₄ */

function e3(): string {
  const xB = 268, k = 7.6, y0 = 112, pitch = 60, h = 18;
  const rows = [...STEPS.map(s => ({ name: s.name, c3: s.c3, c4: s.c4, cls: lossCls(s.k) })), { name: 'left in biomass', c3: 4.6, c4: 6.0, cls: 'ef-bio' }];
  const note: Record<number, string> = { 3: 'C₄: 5 ATP + 2 NADPH per CO₂', 4: 'C₄: CO₂ concentrated at RuBisCO' };
  const body = rows.map((r, i) => {
    const y = y0 + i * pitch, bar = (v: number, yy: number, cls: string): string => `<rect class="${cls}" x="${xB}" y="${f(yy)}" width="${f(Math.max(2, v * k))}" height="${h}" rx="3"/>`;
    return `${T(xB - 14, y + h + 4, r.name, i === 6 ? 'ef-name' : 'cel-mn', 'end')}
      ${bar(r.c3, y, 'ef-c3')}${T(xB + r.c3 * k + 8, y + 14, fmt(r.c3), 'ef-n', 'start')}
      ${bar(r.c4, y + h + 4, 'ef-c4')}${T(xB + Math.max(2, r.c4 * k) + 8, y + h + 18, fmt(r.c4), 'ef-n', 'start')}
      ${note[i] ? T(xB + Math.max(r.c3, r.c4) * k + 56, y + h + 4, note[i], 'ef-det', 'start') : ''}`;
  }).join('');
  const sw = (x: number, cls: string, s: string): string => `<rect class="${cls}" x="${x}" y="40" width="26" height="16" rx="3"/>${T(x + 34, 54, s, 'cel-mn', 'start')}`;
  return svg('The minimum energy losses of C3 and C4 photosynthesis side by side, in percent of the incident solar energy. The first three steps are the same: 51.3 outside 400 to 700 nanometres, 4.9 reflected and transmitted, 6.6 photochemical inefficiency. Carbohydrate synthesis costs C3 24.6 and C4 28.7, as C4 needs 5 ATP and 2 NADPH per CO2; photorespiration costs C3 6.1 and C4 0, as C4 concentrates CO2 at RuBisCO; respiration 1.9 and 2.5. Left in biomass: 4.6 for C3, 6.0 for C4.', `
    ${sw(xB, 'ef-c3', 'C₃')}${sw(xB + 96, 'ef-c4', 'C₄')}${T(784, 54, '% of the solar energy', 'ef-det', 'end')}
    <path class="ef-axis" d="M${xB},${y0 - 14}V${y0 + 7 * pitch - 12}"/>
    ${body}
    ${T(784, 566, 'leaf, 30 °C · C₄: NADP-malic enzyme type', 'ef-cr', 'end')}${T(784, 584, CREDIT, 'ef-cr', 'end')}`);
}

/* ---------------------------------------------------------------- e4 · each loss where it happens */

/** A light ray with its head. */
const ray = (q: Pt[], cls = 'ef-ray'): string => {
  const a = q[q.length - 2], b = q[q.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: Pt = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
  const n: Pt = [-u[1], u[0]], hb: Pt = [b[0] - u[0] * 12, b[1] - u[1] * 12];
  return `<path class="${cls}" d="M${q.map(p => `${f(p[0])},${f(p[1])}`).join('L')}" />`
    + `<path class="${cls}-h" d="M${f(b[0] + u[0] * 2)},${f(b[1] + u[1] * 2)}L${f(hb[0] + n[0] * 7)},${f(hb[1] + n[1] * 7)}L${f(hb[0] - n[0] * 7)},${f(hb[1] - n[1] * 7)}Z"/>`;
};
/** A wavy heat arrow down from (x, y0) to (x, y1). */
const heat = (x: number, y0: number, y1: number): string => {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40, y = y0 + (y1 - y0 - 10) * t; pts.push(`${i ? 'L' : 'M'}${f(x + Math.sin(t * 4 * Math.PI) * 5)},${f(y)}`); }
  return `<path class="ef-heat" d="${pts.join('')}"/><path style="fill:#b5532f" d="M${x},${y1}l-6,-11h12Z"/>`;
};
function e4(): string {
  const W = 246, H = 236, X = [14, 277, 540], Y = [16, 272], L = left('c3');
  const tile = (i: number, pic: string, det: string): string => {
    const x = X[i % 3], y = Y[Math.floor(i / 3)], st = STEPS[i];
    return `<rect class="ef-tile" x="${x}" y="${y}" width="${W}" height="${H}" rx="12"/>${pic}
      ${T(x + W / 2, y + 166, st.name, 'ef-name')}${T(x + W / 2, y + 186, det, 'ef-det')}
      ${T(x + W / 2, y + 218, `−${fmt(st.c3)}`, st.k === 'pr' ? 'ef-np' : 'ef-nl', 'middle', st.k === 'pr' ? ' style="font-size:20px"' : '')}
      ${i < 5 ? T(x + W - 12, y + 218, `${fmt(L[i + 1])} left`, 'ef-tk', 'end') : ''}`;
  };
  const grad = `<linearGradient id="ef4-spec" x1="0" x2="1"><stop offset="0" stop-color="#6a2fb5"/><stop offset=".2" stop-color="#2350e6"/><stop offset=".45" stop-color="#2a963a"/><stop offset=".62" stop-color="#e3c21a"/><stop offset=".8" stop-color="#f08a1a"/><stop offset="1" stop-color="#de361e"/></linearGradient>`;
  // 1 · the spectrum: 300–1100 nm, PAR 400–700 nm in colour
  const sx = (nm: number): number => X[0] + 18 + ((nm - 300) / 800) * (W - 36), sy = Y[0] + 58;
  const p1 = `<rect x="${f(sx(300))}" y="${sy}" width="${f(sx(1100) - sx(300))}" height="34" rx="4" style="fill:#d9d5ca"/>
    <rect x="${f(sx(400))}" y="${sy}" width="${f(sx(700) - sx(400))}" height="34" style="fill:url(#ef4-spec)"/>
    <path class="ef-brk" d="M${f(sx(400))},${sy - 6}V${sy - 14}H${f(sx(700))}V${sy - 6}"/>${T((sx(400) + sx(700)) / 2, sy - 20, 'PAR', 'ef-n')}
    ${T(sx(400), sy + 52, '400', 'ef-tk')}${T(sx(700), sy + 52, '700 nm', 'ef-tk')}${T(sx(330), sy + 22, 'UV', 'ef-tk')}${T(sx(900), sy + 22, 'infrared', 'ef-tk')}`;
  // 2 · the leaf: light in, part reflected, part transmitted
  const lx = X[1], ly = Y[0];
  const p2 = `<path class="ef-leaf" d="M${lx + 30},${ly + 92}Q${lx + 123},${ly + 70} ${lx + 216},${ly + 92}V${ly + 112}Q${lx + 123},${ly + 92} ${lx + 30},${ly + 112}Z"/>
    ${ray([[lx + 62, ly + 18], [lx + 108, ly + 80]])}${ray([[lx + 128, ly + 80], [lx + 176, ly + 22]])}${ray([[lx + 116, ly + 108], [lx + 150, ly + 146]])}
    ${T(lx + 184, ly + 40, 'reflected', 'ef-tk', 'start')}${T(lx + 160, ly + 140, 'transmitted', 'ef-tk', 'start')}${T(lx + 40, ly + 30, 'light', 'ef-tk', 'end')}`;
  // 3 · excitation: a blue photon excites to a higher level, which relaxes as heat to the red level
  const ex = X[2], ey = Y[0], g = ey + 132, red = ey + 74, blue = ey + 30;
  const p3 = `<path class="ef-lv" d="M${ex + 70},${g}H${ex + 200}M${ex + 70},${red}H${ex + 200}M${ex + 70},${blue}H${ex + 200}"/>
    ${T(ex + 206, blue + 5, 'blue', 'ef-tk', 'start')}${T(ex + 206, red + 5, 'red', 'ef-tk', 'start')}${T(ex + 206, g + 5, 'ground', 'ef-tk', 'start')}
    ${ray([[ex + 92, g], [ex + 92, blue + 4]], 'ef-blue')}${ray([[ex + 124, g], [ex + 124, red + 4]], 'ef-red')}${heat(ex + 156, blue + 4, red - 2)}
    ${T(ex + 168, (blue + red) / 2 + 5, 'heat', 'ef-tk', 'start')}`;
  // 4 · carbohydrate synthesis: ≥ 8 photons → 3 ATP + 2 NADPH → 1 CO₂ into sugar
  const cx4 = X[0] + W / 2, cy4 = Y[1];
  const p4 = `${rowG(cx4, cy4 + 34, [['3 ATP', 'atp'], ['+', 'op'], ['2 NADPH', 'nadph']])}${balls(cx4 - 62, cy4 + 92, 'OCO', 11)}${T(cx4 - 20, cy4 + 98, '→', 'ef-nl')}
    <g class="chn-g">${metab(cx4 + 48, cy4 + 92, 'TP', { r: 10 })}</g>${T(cx4, cy4 + 128, '≥ 8 photons per CO₂', 'ef-det')}`;
  // 5 · photorespiration: O₂ at RuBisCO
  const rx = X[1], ry = Y[1], rw = 120, rh = rw * 471 / 548;
  const p5 = `<image href="${rubPng}" x="${rx + 40}" y="${ry + 18}" width="${rw}" height="${f(rh)}"/>${balls(rx + 200, ry + 74, 'OO', 11)}${T(rx + 200, ry + 54, 'O₂', 'ef-n')}
    <path d="M${rx + 184},${ry + 80}L${rx + 156},${ry + 80}" style="stroke:#6b6a64;stroke-width:2.4"/><path style="fill:#6b6a64" d="M${rx + 150},${ry + 80}l10,-6v12Z"/>${T(rx + 100, ry + 140, 'RuBisCO', 'ef-tk')}`;
  // 6 · respiration: a mitochondrion (TEM, Frederick & Newcomb 1969)
  const mx = X[2], my = Y[1];
  const p6 = `<clipPath id="ef4-mc"><circle cx="${mx + W / 2}" cy="${my + 68}" r="52"/></clipPath><image href="${mitoJpg}" x="${mx + W / 2 - 58}" y="${my + 10}" width="116" height="116" clip-path="url(#ef4-mc)"/>
    <circle cx="${mx + W / 2}" cy="${my + 68}" r="52" style="fill:none;stroke:#c9c6bb;stroke-width:1.2"/>${T(mx + W / 2, my + 140, 'mitochondrion (TEM)', 'ef-tk')}`;
  return svg('The six minimum energy losses of C3 photosynthesis, each with the part of the process it comes from, in percent of the solar energy on the leaf. Light outside 400 to 700 nanometres, ultraviolet and infrared: 51.3. Light reflected and transmitted by the leaf: 4.9. Photochemical inefficiency, a blue excitation relaxing to the red level as heat: 6.6. Carbohydrate synthesis, 3 ATP and 2 NADPH from at least 8 photons per CO2: 24.6. Photorespiration, RuBisCO reacting with O2: 6.1. Respiration in the mitochondria: 1.9. Left in biomass: 4.6, or 6.0 for C4. A soybean crop over a season converts about 1.5 percent of the solar energy it intercepts.', `
    ${tile(0, p1, 'UV and infrared')}${tile(1, p2, '≈ 10 % of PAR not absorbed')}${tile(2, p3, 'all photochemistry at the red level')}
    ${tile(3, p4, 'photons → ATP, NADPH → sugar')}${tile(4, p5, 'RuBisCO’s oxygenation')}${tile(5, p6, 'crops respire 30–60 % of fixed CO₂')}
    ${T(14, 536, 'left in biomass: 4.6 % (C₃) · 6.0 % (C₄)', 'ef-nl', 'start')}
    ${T(14, 558, 'a soybean crop over a season: ≈ 1.5 % of the solar energy it intercepts', 'ef-det', 'start')}
    ${T(786, 578, 'C₃ leaf, 30 °C · mitochondrion: Frederick & Newcomb 1969, J Cell Biol 43:343, Fig. 6', 'ef-cr', 'end')}${T(786, 594, CREDIT, 'ef-cr', 'end')}`, grad);
}

const DRAW: Record<string, () => string> = { e1, e2, e3, e4 };
export const draw = (id: string): string => (DRAW[id] ?? e1)();
