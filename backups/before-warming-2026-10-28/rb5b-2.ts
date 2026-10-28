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
    { claim: 'CO₂/O₂ specificity.', text: 'RuBisCO’s preference for CO₂ falls with temperature: ≈ ⅔ of the rise in oxygenation', eq: 'spinach: 82 at 25 °C → ≈ 50 at 40 °C' },
    { claim: 'Photorespiration.', text: 'More oxygenation: more CO₂ lost and more ATP and NADPH spent per CO₂ fixed', eq: 'same oxygenation rate at 35 °C needs ≈ 330 ppm chloroplast CO₂ (25 °C: 200 ppm)' },
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
  { id: 'v1', name: 'Two flasks of water at 15 and 35 °C: CO₂ : O₂ solubility ratio 29 and 24' },
  { id: 'v2', name: 'Solubility of CO₂ and O₂ against temperature (CO₂ falls faster)' },
  { id: 'v3', name: 'RuBisCO CO₂/O₂ specificity against temperature (spinach)' },
  { id: 'v4', name: 'Oxygenations per 100 carboxylations, 10–40 °C (calculated, FvCB)' },
  { id: 'v5', name: 'Sage 2012 Fig. 4: photorespiration over temperature and CO₂ (real figure)' },
  { id: 'v6', name: 'Warming against rising CO₂: 3 bars (calculated)' },
  { id: 'v7', name: 'At the active site: 7 carboxylations : 3 oxygenations at 25 °C, 10 : 7 at 35 °C' },
];

const SAGE: Img = { href: sageJpg, w: 1113, h: 1040 };
const CR_SOL = 'data: Sander 2023';
const CR_FVCB = 'FvCB model · Γ*: Bernacchi et al. 2001';

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
    const v = Math.round(solCO2(t) / solO2(t));
    return `<path class="frb-water" d="M${cx - 120},230 L${cx - 120},470 Q${cx - 120},500 ${cx - 90},500 L${cx + 90},500 Q${cx + 120},500 ${cx + 120},470 L${cx + 120},230 Z"/>
      ${path(`M${cx - 128},150 L${cx - 120},160 L${cx - 120},470 Q${cx - 120},500 ${cx - 90},500 L${cx + 90},500 Q${cx + 120},500 ${cx + 120},470 L${cx + 120},160 L${cx + 128},150`, 'frb-glass')}
      ${co2g(cx - 50, 320, 11)}${T(cx, 328, ':', 'fcb-big', 'middle')}${o2g(cx + 44, 320, 11)}
      ${T(cx, 418, `${v} : 1`, 'fcb-huge', 'middle')}
      ${thermo(cx + 170, 400, lvl, `${t} °C`)}`;
  };
  return svg(p, 'Two flasks of water in equilibrium with today’s air. At 15 degrees, for every 1000 dissolved O2 molecules there are 60 dissolved CO2 molecules; at 35 degrees only 49. Both gases dissolve less in warm water, but CO2 loses more.', `
    ${T(400, 80, 'CO₂ : O₂ solubility ratio in water', 'fcb-h', 'middle')}
    ${flask(150, 15, 0.35)}${flask(520, 35, 0.85)}
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
  return svg(p, 'Solubility in water against temperature, relative to 25 degrees. CO2 falls from 133 percent at 15 degrees to 78 percent at 35 degrees; O2 from 120 to 87 percent. So the CO2 : O2 solubility ratio falls from 29 to 24.', `
    ${axes(a, [10, 15, 20, 25, 30, 35, 40], [60, 80, 100, 120, 140, 160], 'water temperature (°C)', 'solubility (% of 25 °C)')}
    ${path(`M${f(X(a, 25))},${a.y0} V${a.y0 + a.h}`, 'fcb-mark')}
    <path class="frb-co2" d="${line(solCO2, c25)}"/><path class="frb-o2" d="${line(solO2, o25)}"/>
    ${dot(15, solCO2, c25, 'frb-dot')}${dot(35, solCO2, c25, 'frb-dot')}${dot(15, solO2, o25, 'frb-dot-o2')}${dot(35, solO2, o25, 'frb-dot-o2')}
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
  const pts = SCO.pts.map(([t, v]) => `<circle class="frb-dot" cx="${f(X(a, t))}" cy="${f(Y(a, v))}" r="8"/>${t === 25 ? T(X(a, t) - 14, Y(a, v) + 34, `${v} at ${t} °C`, 'fcb-node', 'end') : t === 40 ? T(X(a, t) + 14, Y(a, v) - 12, `≈ ${v} at ${t} °C`, 'fcb-node') : ''}`).join('');
  return svg(p, 'CO2/O2 specificity of spinach RuBisCO against temperature: about 160 at 5 degrees, 82 at 25 degrees and about 50 at 40 degrees. RuBisCO kinetics give two thirds of the rise of photorespiration with temperature, the lower CO2 solubility one third.', `
    ${axes(a, [0, 10, 20, 30, 40], [0, 40, 80, 120, 160], 'temperature (°C)', `CO₂/O₂ specificity, ${sym('S', 'c/o')}`)}
    <path class="frb-fit" d="${fit}"/>${pts}
    ${rubisco(600, 110, 110)}${T(600, 186, 'spinach RuBisCO', 'fcb-s', 'middle')}
    ${credit(790, 594, 'data: Jordan & Ogren 1984; Tcherkez et al. 2006')}
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
  const dot = (t: number): string => {
    const v = oxyPer100(t, 200);
    return `<circle class="frb-dot-ox" cx="${f(X(a, t))}" cy="${f(Y(a, v))}" r="8"/>`;
  };
  return svg(p, 'Calculated with the FvCB model at a chloroplast CO2 of 200 ppm: oxygenations per 100 carboxylations rise with leaf temperature, 25 at 15 degrees, 43 at 25 degrees, 70 at 35 degrees.', `
    ${axes(a, [10, 15, 20, 25, 30, 35, 40], [0, 20, 40, 60, 80, 100], 'leaf temperature (°C)', 'oxygenations per 100 carboxylations')}
    <path class="frb-ox" d="${line}"/>${dot(15)}${mark(25)}${mark(35)}
    ${T(X(a, 10.5), 100, 'constant chloroplast CO₂', 'fcb-s')}
    ${credit(790, 594, CR_FVCB)}
  `);
}

/* ---------- v5 · Sage 2012 Fig. 4 ---------- */

function v5(): string {
  const p = 'frb5bv5', r = shot(`${p}-a`, SAGE, 190, 40, 480, { fig: true });
  return svg(p, 'Sage, Sage and Kocacinar 2012, figure 4: modelled ratio of photorespiration to photosynthesis in a C3 leaf over chloroplast CO2 and leaf temperature. Labels: warmer leaf, more photorespiration; more CO2, less photorespiration.', `
    ${r.svg}
    ${pill(170, 120, 'higher leaf temperature', r.at(390, 200), true)}
    ${pill(670, 500, 'higher chloroplast CO₂', r.at(930, 600), true)}
    ${pill(240, 560, 'photorespiration / photosynthesis', undefined, true)}
    ${credit(790, 594, 'Sage, Sage & Kocacinar 2012, Fig. 4')}
  `);
}

/* ---------- v6 · warming against rising CO₂ ---------- */

function v6(): string {
  const p = 'frb5bv6', bx = 330, bw = 380, max = 100;
  const cc35 = (2 * gammaStar(35)) / ((2 * gammaStar(25)) / 200);
  const rows: Array<[string, string, number, number]> = [
    ['25 °C', '', 25, 200],
    ['35 °C', '', 35, 200],
    ['35 °C', 'higher chloroplast CO₂', 35, cc35],
  ];
  const bars = rows.map(([t, c, tt, cc], i) => {
    const v = oxyPer100(tt, cc), y = 140 + i * 110, w = (v / max) * bw;
    return `${T(bx - 20, y + 12, t, 'fcb-big', 'end')}${T(bx - 20, y + 40, c, 'fcb-s', 'end')}
      <rect class="frb-bar-ox" x="${bx}" y="${y - 8}" width="${f(w)}" height="42" rx="6"/>${T(bx + w + 12, y + 22, String(Math.round(v)), 'fcb-big')}`;
  }).join('');
  return svg(p, 'Calculated oxygenations per 100 carboxylations. At 25 degrees and 200 ppm chloroplast CO2: 43. At 35 degrees and the same CO2: 70. At 35 degrees, 328 ppm chloroplast CO2 brings it back to 43.', `
    ${T(400, 66, 'oxygenations per 100 carboxylations', 'fcb-h', 'middle')}
    ${path(`M${bx},110 V${140 + 2 * 110 + 50}`, 'fcb-axis')}${bars}
    ${credit(790, 594, CR_FVCB)}
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
  return svg(p, 'Two RuBisCO molecules. At 25 degrees, for every 7 carboxylations there are 3 oxygenations, 43 per 100. At 35 degrees, for every 10 carboxylations there are 7 oxygenations, 70 per 100.', `
    ${side(200, 25, 7, 3, 0.55)}${side(600, 35, 10, 7, 0.85)}
    <path class="frb-rule" d="M400,60 V560"/>
    ${credit(790, 594, CR_FVCB)}
  `);
}

const DRAW: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7 };
export function draw(id: string): string {
  return (DRAW[id] ?? v1)();
}
