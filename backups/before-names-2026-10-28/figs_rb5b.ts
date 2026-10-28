// Slide C5b · Temperature and photorespiration (the RuBisCO story, 28 Oct 2026; draft for the lecturer). Both gases
// dissolve less in warmer water; CO₂ loses more, so the CO₂ : O₂ ratio at RuBisCO falls. RuBisCO's own CO₂/O₂
// specificity also falls with temperature (RuBisCO kinetics: 2/3 of the effect, solubility: 1/3). Rising CO₂ pushes the
// other way. Numbers:
// - solubility: Henry's-law 3-parameter fits in Sander 2023 (Atmos Chem Phys 23:10901, notes 384 and 8: Morrison &
//   Billett 1952 for CO₂, Rettich et al. 2000 for O₂); the CO₂ : O₂ solubility ratio is 29.3 at 15 °C and 23.9 at 35 °C;
// - specificity of spinach RuBisCO ≈ 160 at 5 °C, ≈ 50 at 40 °C, kinetics 2/3 and solubility 1/3 of the temperature
//   effect (Jordan & Ogren 1984, abstract); 82 at 25 °C (Tcherkez et al. 2006, Table 1);
// - Γ* = exp(19.02 − 37.83/(R·T)) ppm (Bernacchi et al. 2001, constants via open citing papers); oxygenations per 100
//   carboxylations = 100 · 2Γ* / C꜀ (FvCB), at C꜀ = 200 ppm (slide C10): 25 at 15 °C, 43 at 25 °C, 70 at 35 °C.
// Real figure: Sage, Sage & Kocacinar 2012 Annu Rev Plant Biol 63:19, Fig. 4 (assets/SOURCES-rf.md; also on C5 v8).
import type { PlateText, Variant } from '../types';
import sageJpg from '../../assets/rf/sage2012-fig4.jpg';
import { axes, catmull, co2g, credit, f, o2g, pill, shot, svg, T, X, Y, type Axes, type Img, type Pt } from './cb-common';
import { CR_RUBISCO, gammaStar, oxyPer100, panel, path, rubisco, SCO, solCO2, solO2, sym } from './rb-kit';

export const PLATE: PlateText = {
  n: 'C5b',
  title: 'Temperature and oxygenation',
  status: 'draft',
  lead: 'Warmer leaves oxygenate more: CO₂ solubility and RuBisCO’s CO₂/O₂ specificity both fall.',
  points: [
    { claim: 'Gas solubility.', text: 'Warm water holds less of both gases; CO₂ solubility falls more', eq: 'CO₂ : O₂ solubility ratio: 29 at 15 °C → 24 at 35 °C' },
    { claim: 'CO₂/O₂ specificity.', text: 'RuBisCO’s preference for CO₂ falls with temperature', eq: 'spinach: 82 at 25 °C → ≈ 50 at 40 °C' },
    { claim: 'Climate change.', text: 'Warming raises oxygenation; rising CO₂ lowers it', eq: 'per 100 carboxylations: 43 at 25 °C → 70 at 35 °C' },
  ],
  refs: [
    { label: 'Jordan & Ogren 1984', url: 'https://doi.org/10.1007/BF00398720' },
    { label: 'Sander 2023', url: 'https://doi.org/10.5194/acp-23-10901-2023' },
    { label: 'Bernacchi et al. 2001', url: 'https://doi.org/10.1111/j.1365-3040.2001.00668.x' },
    { label: 'Brooks & Farquhar 1985', url: 'https://doi.org/10.1007/BF00392238' },
    { label: 'Sage, Sage & Kocacinar 2012', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'v1', name: 'Two flasks of water at 15 and 35 °C: CO₂ per 1000 O₂ dissolved' },
  { id: 'v2', name: 'Solubility of CO₂ and O₂ against temperature (CO₂ falls faster)' },
  { id: 'v3', name: 'RuBisCO CO₂/O₂ specificity against temperature (spinach)' },
  { id: 'v4', name: 'Oxygenations per 100 carboxylations, 10–40 °C (calculated, FvCB)' },
  { id: 'v5', name: 'Sage 2012 Fig. 4: photorespiration over temperature and CO₂ (real figure)' },
  { id: 'v6', name: 'Warming against rising CO₂: 3 bars (calculated)' },
  { id: 'v7', name: 'At the active site: 4 CO₂ : 1 O₂ at 15 °C, 10 : 7 at 35 °C' },
];

const SAGE: Img = { href: sageJpg, w: 1113, h: 1040 };
const CR_SOL = 'solubility: Sander 2023, Atmos Chem Phys 23:10901 (CO₂: Morrison & Billett 1952; O₂: Rettich et al. 2000)';
const CR_FVCB = 'calculated: 100 × 2Γ* / Cc (FvCB) · Γ*: Bernacchi et al. 2001 · Cc = 200 ppm (slide C10)';
/** Dissolved CO₂ per 1000 dissolved O₂, in water in equilibrium with today's air (427 ppm CO₂, 20.95 % O₂). */
const perK = (t: number): number => (1000 * solCO2(t) * 427) / (solO2(t) * 209500);

/** A thermometer, its bulb at (x, y), filled to `level` (0–1). */
function thermo(x: number, y: number, level: number, label: string): string {
  const h = 120, top = y - h;
  return `<rect x="${x - 9}" y="${top}" width="18" height="${h}" rx="9" class="frb-panel-w"/>
    <rect x="${x - 5}" y="${f(top + (1 - level) * (h - 10))}" width="10" height="${f(level * (h - 10) + 8)}" rx="5" class="frb-bar-red"/>
    <circle cx="${x}" cy="${y + 6}" r="15" class="frb-bar-red"/>${T(x, y + 50, label, 'fcb-node', 'middle')}`;
}

/* ---------- v1 · two flasks ---------- */

function v1(): string {
  const p = 'frb5bv1';
  const flask = (cx: number, t: number, lvl: number): string => {
    const v = perK(t);
    return `<path class="frb-water" d="M${cx - 120},230 L${cx - 120},470 Q${cx - 120},500 ${cx - 90},500 L${cx + 90},500 Q${cx + 120},500 ${cx + 120},470 L${cx + 120},230 Z"/>
      ${path(`M${cx - 128},150 L${cx - 120},160 L${cx - 120},470 Q${cx - 120},500 ${cx - 90},500 L${cx + 90},500 Q${cx + 120},500 ${cx + 120},470 L${cx + 120},160 L${cx + 128},150`, 'frb-glass')}
      ${o2g(cx - 70, 300, 11)}${T(cx - 44, 307, '1000 O₂', 'fcb-node')}
      ${co2g(cx - 64, 372, 11)}${T(cx - 32, 379, `${Math.round(v)} CO₂`, 'fcb-big')}
      ${T(cx, 450, 'dissolved', 'fcb-s', 'middle')}
      ${thermo(cx + 170, 400, lvl, `${t} °C`)}`;
  };
  return svg(p, 'Two flasks of water in equilibrium with today’s air. At 15 degrees, for every 1000 dissolved O2 molecules there are 60 dissolved CO2 molecules; at 35 degrees only 49. Both gases dissolve less in warm water, but CO2 loses more.', `
    ${T(400, 64, 'water in today’s air (427 ppm CO₂, 21 % O₂)', 'fcb-h', 'middle')}
    ${T(400, 100, 'per 1000 dissolved O₂:', 'fcb-l', 'middle')}
    ${flask(150, 15, 0.35)}${flask(520, 35, 0.85)}
    ${T(400, 552, 'warmer: both dissolve less, CO₂ more so', 'fcb-node', 'middle')}
    ${credit(790, 594, CR_SOL)}
  `);
}

/* ---------- v2 · solubility against temperature ---------- */

function v2(): string {
  const p = 'frb5bv2';
  const a: Axes = { x0: 120, y0: 50, w: 560, h: 350, xr: [10, 40], yr: [60, 160] };
  const ts = Array.from({ length: 31 }, (_, i) => 10 + i);
  const line = (fn: (t: number) => number, ref: number): string => catmull(ts.map(t => [X(a, t), Y(a, (100 * fn(t)) / ref)] as Pt));
  const c25 = solCO2(25), o25 = solO2(25);
  const dot = (t: number, fn: (t: number) => number, ref: number, cls: string): string => `<circle class="${cls}" cx="${f(X(a, t))}" cy="${f(Y(a, (100 * fn(t)) / ref))}" r="6"/>`;
  const lab = (t: number, fn: (t: number) => number, ref: number, dy: number): string => T(X(a, t) + 10, Y(a, (100 * fn(t)) / ref) + dy, `${Math.round((100 * fn(t)) / ref)} %`, 'fcb-node');
  return svg(p, 'Solubility in water against temperature, relative to 25 degrees. CO2 falls from 133 percent at 15 degrees to 78 percent at 35 degrees; O2 from 120 to 87 percent. So the CO2 : O2 solubility ratio falls from 29 to 24.', `
    ${axes(a, [10, 15, 20, 25, 30, 35, 40], [60, 80, 100, 120, 140, 160], 'water temperature (°C)', 'solubility (% of 25 °C)')}
    ${path(`M${f(X(a, 25))},${a.y0} V${a.y0 + a.h}`, 'fcb-mark')}
    <path class="frb-co2" d="${line(solCO2, c25)}"/><path class="frb-o2" d="${line(solO2, o25)}"/>
    ${dot(15, solCO2, c25, 'frb-dot')}${dot(35, solCO2, c25, 'frb-dot')}${dot(15, solO2, o25, 'frb-dot-o2')}${dot(35, solO2, o25, 'frb-dot-o2')}
    ${lab(15, solCO2, c25, -14)}${T(X(a, 15) - 12, Y(a, (100 * solO2(15)) / o25) + 32, `${Math.round((100 * solO2(15)) / o25)} %`, 'fcb-node', 'end')}${T(X(a, 35) - 12, Y(a, (100 * solCO2(35)) / c25) + 32, `${Math.round((100 * solCO2(35)) / c25)} %`, 'fcb-node', 'end')}${lab(35, solO2, o25, -14)}
    ${co2g(X(a, 30), Y(a, 150), 10)}${T(X(a, 30) + 30, Y(a, 150) + 7, 'CO₂', 'fcb-node')}
    ${o2g(X(a, 30), Y(a, 138), 10)}${T(X(a, 30) + 30, Y(a, 138) + 7, 'O₂', 'fcb-node')}
    ${panel(150, 480, 500, 66, 'frb-panel-w')}
    ${T(400, 520, `CO₂ : O₂ solubility ratio: ${Math.round(solCO2(15) / solO2(15))} at 15 °C → ${Math.round(solCO2(35) / solO2(35))} at 35 °C`, 'fcb-node', 'middle')}
    ${credit(790, 594, CR_SOL)}
  `);
}

/* ---------- v3 · specificity against temperature ---------- */

function v3(): string {
  const p = 'frb5bv3';
  const a: Axes = { x0: 120, y0: 50, w: 540, h: 350, xr: [0, 45], yr: [0, 180] };
  const fit = catmull(Array.from({ length: 41 }, (_, i) => [X(a, 2 + i), Y(a, SCO.fit(2 + i))] as Pt));
  const pts = SCO.pts.map(([t, v]) => `<circle class="frb-dot" cx="${f(X(a, t))}" cy="${f(Y(a, v))}" r="8"/>${t === 25 ? T(X(a, t) - 14, Y(a, v) + 34, `${v} at ${t} °C`, 'fcb-node', 'end') : T(X(a, t) + 14, Y(a, v) - 12, `≈ ${v} at ${t} °C`, 'fcb-node')}`).join('');
  return svg(p, 'CO2/O2 specificity of spinach RuBisCO against temperature: about 160 at 5 degrees, 82 at 25 degrees and about 50 at 40 degrees. RuBisCO kinetics give two thirds of the rise of photorespiration with temperature, the lower CO2 solubility one third.', `
    ${axes(a, [0, 10, 20, 30, 40], [0, 40, 80, 120, 160], 'temperature (°C)', `CO₂/O₂ specificity, ${sym('S', 'c/o')}`)}
    <path class="frb-fit" d="${fit}"/>${pts}
    ${rubisco(600, 110, 110)}${T(600, 186, 'spinach RuBisCO', 'fcb-s', 'middle')}
    ${panel(130, 488, 560, 70, 'frb-panel-w')}
    ${T(146, 516, 'rise of photorespiration with temperature:', 'fcb-s')}
    ${T(146, 544, 'RuBisCO kinetics 2/3 · CO₂ solubility 1/3', 'fcb-node')}
    ${credit(790, 594, 'Jordan & Ogren 1984 (5, 40 °C) · Tcherkez et al. 2006, Table 1 (25 °C) · line: 1 exponential through them')}
  `);
}

/* ---------- v4 · oxygenations per 100 carboxylations against temperature ---------- */

function v4(): string {
  const p = 'frb5bv4';
  const a: Axes = { x0: 120, y0: 60, w: 560, h: 340, xr: [10, 40], yr: [0, 100] };
  const line = catmull(Array.from({ length: 31 }, (_, i) => [X(a, 10 + i), Y(a, oxyPer100(10 + i, 200))] as Pt));
  const mark = (t: number): string => {
    const v = oxyPer100(t, 200);
    return `<circle class="frb-dot-ox" cx="${f(X(a, t))}" cy="${f(Y(a, v))}" r="8"/>${T(X(a, t) + 14, Y(a, v) + 34, `${Math.round(v)} at ${t} °C`, 'fcb-node')}`;
  };
  return svg(p, 'Calculated with the FvCB model at a chloroplast CO2 of 200 ppm: oxygenations per 100 carboxylations rise with leaf temperature, 25 at 15 degrees, 43 at 25 degrees, 70 at 35 degrees.', `
    ${axes(a, [10, 15, 20, 25, 30, 35, 40], [0, 20, 40, 60, 80, 100], 'leaf temperature (°C)', 'oxygenations per 100 carboxylations')}
    <path class="frb-ox" d="${line}"/>${mark(15)}${mark(25)}${mark(35)}
    ${T(X(a, 10.5), 100, `chloroplast CO₂ ${sym('C', 'c')} = 200 ppm`, 'fcb-s')}
    ${panel(130, 488, 560, 70, 'frb-panel-w')}
    ${T(146, 518, `100 × 2Γ* / ${sym('C', 'c')}: Γ* rises from 25 ppm (15 °C)`, 'fcb-s')}${T(146, 544, 'to 43 ppm (25 °C) and 70 ppm (35 °C)', 'fcb-s')}
    ${credit(790, 594, CR_FVCB)}
  `);
}

/* ---------- v5 · Sage 2012 Fig. 4 ---------- */

function v5(): string {
  const p = 'frb5bv5', r = shot(`${p}-a`, SAGE, 190, 40, 480, { fig: true });
  return svg(p, 'Sage, Sage and Kocacinar 2012, figure 4: modelled ratio of photorespiration to photosynthesis in a C3 leaf over chloroplast CO2 and leaf temperature. Labels: warmer leaf, more photorespiration; more CO2, less photorespiration.', `
    ${r.svg}
    ${pill(150, 120, 'warmer leaf: more', r.at(390, 200), true)}
    ${pill(690, 500, 'more CO₂: less', r.at(930, 600), true)}
    ${pill(260, 560, 'colour: photorespiration / photosynthesis', undefined, true)}
    ${credit(790, 594, 'Sage, Sage & Kocacinar 2012, Annu Rev Plant Biol 63:19, Fig. 4 (model)')}
  `);
}

/* ---------- v6 · warming against rising CO₂ ---------- */

function v6(): string {
  const p = 'frb5bv6', bx = 330, bw = 380, max = 100;
  const cc35 = (2 * gammaStar(35)) / ((2 * gammaStar(25)) / 200);
  const rows: Array<[string, string, number, number]> = [
    ['25 °C', 'chloroplast CO₂ 200 ppm', 25, 200],
    ['35 °C', 'chloroplast CO₂ 200 ppm', 35, 200],
    ['35 °C', `chloroplast CO₂ ${Math.round(cc35)} ppm`, 35, cc35],
  ];
  const bars = rows.map(([t, c, tt, cc], i) => {
    const v = oxyPer100(tt, cc), y = 140 + i * 110, w = (v / max) * bw;
    return `${T(bx - 20, y + 12, t, 'fcb-big', 'end')}${T(bx - 20, y + 40, c, 'fcb-s', 'end')}
      <rect class="frb-bar-ox" x="${bx}" y="${y - 8}" width="${f(w)}" height="42" rx="6"/>${T(bx + w + 12, y + 22, String(Math.round(v)), 'fcb-big')}`;
  }).join('');
  return svg(p, 'Calculated oxygenations per 100 carboxylations. At 25 degrees and 200 ppm chloroplast CO2: 43. At 35 degrees and the same CO2: 70. At 35 degrees, 328 ppm chloroplast CO2 brings it back to 43.', `
    ${T(400, 66, 'oxygenations per 100 carboxylations', 'fcb-h', 'middle')}
    ${path(`M${bx},110 V${140 + 2 * 110 + 50}`, 'fcb-axis')}${bars}
    ${panel(70, 488, 660, 70, 'frb-panel-w')}
    ${T(86, 518, '+10 °C raises it from 43 to 70', 'fcb-node')}${T(86, 544, `+${Math.round((cc35 / 200 - 1) * 100)} % chloroplast CO₂ brings it back to 43`, 'fcb-node')}
    ${credit(790, 594, CR_FVCB.replace(' · Cc = 200 ppm (slide C10)', ''))}
  `);
}

/* ---------- v7 · at the active site ---------- */

function v7(): string {
  const p = 'frb5bv7';
  const side = (cx: number, t: number, nC: number, nO: number, lvl: number): string => {
    const co2s = Array.from({ length: nC }, (_, i) => co2g(cx - 150 + (i % 5) * 62 + 28, 390 + Math.floor(i / 5) * 32, 9)).join('');
    const o2s = Array.from({ length: nO }, (_, i) => o2g(cx - 150 + (i % 5) * 62 + 28, 500 + Math.floor(i / 5) * 32, 9)).join('');
    return `${rubisco(cx, 190, 190)}${thermo(cx + 150, 250, lvl, `${t} °C`)}
      ${T(cx - 150, 362, `${nC} carboxylations`, 'fcb-node')}${co2s}
      ${T(cx - 150, 476, `${nO} oxygenation${nO > 1 ? 's' : ''}`, 'fcb-node fcb-c-rust')}${o2s}`;
  };
  return svg(p, 'Two RuBisCO molecules. At 15 degrees, for every 4 carboxylations there is 1 oxygenation. At 35 degrees, for every 10 carboxylations there are 7 oxygenations. Calculated with the FvCB model at 200 ppm chloroplast CO2.', `
    ${side(200, 15, 4, 1, 0.35)}${side(600, 35, 10, 7, 0.85)}
    <path class="frb-rule" d="M400,60 V560"/>
    ${credit(790, 594, CR_FVCB)}
  `);
}

const DRAW: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7 };
export function draw(id: string): string {
  return (DRAW[id] ?? v1)();
}
