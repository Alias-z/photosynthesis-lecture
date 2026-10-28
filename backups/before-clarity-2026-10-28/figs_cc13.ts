// Slide C13 · Crassulacean acid metabolism (chunk cc, 28 Oct 2026). Pick key C12 (its number when its figures were picked).
// Facts: Borland, Griffiths, Hartwell & Smith 2009 JXB 60:2879 (FT, via the fact-check): Fig. 3, diel CO₂ exchange of
// Kalanchoë fedtschenkoi with Osmond's phases (I night uptake by PEPC; II PEPC + RuBisCO; III RuBisCO refixes CO₂ from
// malate behind closed stomata; IV stomata reopen); Table 2 water-use efficiency, mmol CO₂ per mol H₂O: CAM 4–10,
// C₃ 0.5–1.5, C₄ 1–2. Abraham et al. 2016 Nat Plants 2:16178 (FT, via the fact-check): Fig. 1a net CO₂ uptake of Agave
// americana leaves L1 (youngest, C₃) to L4 (CAM), 12 h light; Fig. 1c malic acid, Agave vs Arabidopsis (µg g⁻¹ FW).
// Gilman et al. 2023 Ann Bot (FT): ≈ 7 % of vascular plant species. Töpfer et al. 2020 Plant Cell (FT): night uptake in the
// cooler, more humid hours. Curves redrawn by colour-digitizing the board images (tools/digitize.py) or read by eye.
// New variants v1–v8 first, then the earlier ones (drawn by c10.ts).
import type { PlateText, Variant } from '../types';
import { draw as drawC10, VARIANTS as C10_VARIANTS } from './c10';
import { T, TV, chloro, co2, credit, enzyme, f, heads, it, pill, route, rubisco, shot, svg, type Img } from './cc-kit';
import { schemaSvg } from './cc-schema';
import agave from '../../assets/photos/cc-agave-field.jpg';
import kal from '../../assets/photos/cc-kalanchoe.jpg';

export const PLATE: PlateText = {
  n: 'C13',
  pick: 'C12',
  title: 'Crassulacean acid metabolism (CAM)',
  status: 'draft',
  lead: 'CAM plants take up CO₂ at night and fix it by day behind closed stomata, saving water.',
  points: [
    { claim: 'Night.', text: 'Stomata open; PEP carboxylase fixes CO₂ as HCO₃⁻<br>The product is stored as malic acid in the vacuole' },
    { claim: 'Day.', text: 'Stomata close; malic acid releases CO₂<br>RuBisCO fixes it, using ATP and NADPH from the light reactions' },
    { claim: 'Water saving.', text: 'Night air is cooler and more humid, so less water is lost per CO₂<br>≈ 7 % of vascular plant species, e.g. pineapple, agave, cacti' },
  ],
  refs: [
    { label: 'Borland et al. 2009', url: 'https://doi.org/10.1093/jxb/erp118' },
    { label: 'Abraham et al. 2016', url: 'https://doi.org/10.1038/nplants.2016.178' },
    { label: 'Males & Griffiths 2017', url: 'https://doi.org/10.1104/pp.17.00114' },
    { label: 'Gilman et al. 2023', url: 'https://doi.org/10.1093/aob/mcad135' },
    { label: 'Töpfer et al. 2020', url: 'https://doi.org/10.1105/tpc.20.00132' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'v1', name: 'Day–night CO₂ uptake of Kalanchoë with the four CAM phases (Borland 2009)', anim: true },
  { id: 'v2', name: 'Agave: young leaf (C₃) vs mature leaf (CAM) over 24 h (Abraham 2016)' },
  { id: 'v3', name: 'One cell at night and by day (drawn)', anim: true },
  { id: 'v4', name: 'Agave field + its night uptake' },
  { id: 'v5', name: 'CO₂ gained per water lost: C₃, C₄, CAM (Borland 2009)' },
  { id: 'v6', name: 'Four ways around RuBisCO: CAM lit', anim: true },
  { id: 'v7', name: 'Kalanchoë photo + its CO₂ trace' },
  { id: 'v8', name: 'Malic acid over 24 h: Agave vs Arabidopsis (Abraham 2016)' },
  ...C10_VARIANTS,
];

export function draw(id: string): string {
  const fns: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7, v8 };
  return fns[id] ? fns[id]() : drawC10(id);
}

const AGAVE: Img = { href: agave, w: 1200, h: 860 };
const KAL: Img = { href: kal, w: 1000, h: 750 };
const CR_BORLAND = 'redrawn from Borland, Griffiths, Hartwell & Smith 2009, J Exp Bot 60:2879, Fig. 3';
const CR_ABRAHAM = 'redrawn from Abraham et al. 2016, Nature Plants 2:16178, Fig. 1';

/** Kalanchoë fedtschenkoi net CO₂ exchange (µmol m⁻² s⁻¹) over 24 h, dark 0–12 h then light 12–24 h (Borland 2009 Fig. 3,
 *  colour-digitized; one stray legend pixel column removed). */
const BORLAND: Array<[number, number]> = [
  [0, -0.14], [0.49, 0.06], [0.98, 0.13], [1.46, 0.21], [1.95, 0.3], [2.44, 0.45], [2.93, 0.6], [3.42, 0.86], [3.91, 1.17],
  [4.39, 1.54], [4.88, 1.88], [5.37, 2.11], [5.86, 2.22], [6.35, 2.28], [6.83, 2.19], [7.32, 2.11], [7.81, 1.97], [8.3, 1.78],
  [8.79, 1.61], [9.27, 1.37], [9.76, 1.19], [10.25, 0.87], [10.74, 0.67], [11.23, 0.34], [11.72, 0.17], [12.04, 0.18],
  [12.28, 1.61], [12.53, 1.86], [12.77, 1.13], [13.02, 0.68], [13.51, 0.35], [13.99, 0.17], [14.48, 0.09], [14.97, 0.04],
  [15.46, 0.02], [15.95, 0.02], [16.43, 0.02], [16.92, 0.05], [17.41, 0.17], [17.65, 0.28], [18.14, 0.54], [18.63, 0.78],
  [19.12, 1.02], [19.61, 1.02], [20.09, 1.08], [20.58, 0.99], [21.07, 0.94], [21.56, 1.02], [22.05, 0.83], [22.54, 0.81],
  [23.02, 0.8], [23.51, 0.66], [23.76, 0.61],
];

/** Agave americana net CO₂ uptake (µmol m⁻² s⁻¹), light 0–12 h, dark 12–24 h (Abraham 2016 Fig. 1a, read by eye). */
const AG_CAM: Array<[number, number]> = [[0, -0.1], [3, -0.06], [6, 0], [9, 0.03], [10.2, 0.05], [11, 0.43], [11.9, 1.24], [12.8, 2.17],
  [13.7, 2.98], [14.8, 3.38], [16.4, 3.58], [18.1, 3.65], [19.9, 3.6], [21.7, 3.44], [24, 2.83]];
const AG_C3: Array<[number, number]> = [[0, 1.18], [0.7, 1.47], [2.1, 1.38], [3.2, 1.45], [5.5, 1.5], [7.6, 1.6], [8.2, 1.65], [9.2, 1.82],
  [10.2, 2.1], [11, 1.82], [11.6, 1.65], [12.3, 1.0], [13, 0.43], [13.9, -0.15], [14.8, 0.2], [15.8, 0.55], [16.4, 0.29], [18.1, 0.2],
  [19.9, 0.06], [21.7, -0.03], [24, -0.2]];
/** Malic acid (mg g⁻¹ fresh weight; the figure gives µg g⁻¹) at 3–24 h (Abraham 2016 Fig. 1c, read by eye). */
const MAL_AG: Array<[number, number]> = [[3, 13.5], [6, 4.8], [9, 4.8], [12, 7.0], [15, 9.7], [18, 16.2], [21, 21.2], [24, 24.2]];
const MAL_AT: Array<[number, number]> = [[3, 0.32], [6, 0.36], [9, 0.44], [12, 0.36], [15, 0.245], [18, 0.265], [21, 0.28], [24, 0.265]];

const line = (pts: Array<[number, number]>, X: (t: number) => number, Y: (v: number) => number): string =>
  pts.map(([t, v], i) => `${i ? 'L' : 'M'}${f(X(t))},${f(Y(v))}`).join('');

/** A 24-h plot frame: bands for dark and light, ticks every 6 h, y ticks. darkFirst: dark 0–12 (Borland) or light first (Abraham). */
function frame(x0: number, x1: number, y0: number, y1: number, lo: number, hi: number, step: number, darkFirst: boolean, ylab: string, o: { yfmt?: (v: number) => string; bands?: boolean } = {}) {
  const X = (t: number): number => x0 + (t / 24) * (x1 - x0);
  const Y = (v: number): number => y1 - ((v - lo) / (hi - lo)) * (y1 - y0);
  const s: string[] = [];
  const night = darkFirst ? [0, 12] : [12, 24], day = darkFirst ? [12, 24] : [0, 12];
  if (o.bands !== false) {
    s.push(`<rect class="fcc-night" x="${f(X(night[0]))}" y="${y0}" width="${f(X(night[1]) - X(night[0]))}" height="${y1 - y0}"/>`);
    s.push(`<rect class="fcc-day" x="${f(X(day[0]))}" y="${y0}" width="${f(X(day[1]) - X(day[0]))}" height="${y1 - y0}"/>`);
  }
  for (let v = lo; v <= hi + 1e-9; v += step) s.push(`<path class="fcc-tk" d="M${x0 - 7},${f(Y(v))} h7"/>${T(x0 - 12, Y(v) + 6, o.yfmt ? o.yfmt(v) : `${+v.toFixed(2)}`, 'fcc-ax', 'end')}`);
  for (let t = 0; t <= 24; t += 6) s.push(`<path class="fcc-tk" d="M${f(X(t))},${y1} v7"/>${T(X(t), y1 + 26, `${t}`, 'fcc-ax')}`);
  if (lo < 0) s.push(`<path class="fcc-grid" d="M${x0},${f(Y(0))} H${x1}"/>`);
  s.push(`<path class="fcc-axl" d="M${x0},${y0} V${y1} H${x1}"/>`);
  s.push(TV(x0 - 62, (y0 + y1) / 2, ylab));
  return { svg: s.join(''), X, Y, night, day };
}

/* v1 · Borland 2009 Fig. 3: Kalanchoë fedtschenkoi, four phases */
function v1(): string {
  const F = frame(120, 770, 120, 450, -0.5, 2.5, 0.5, true, 'net CO₂ uptake (µmol m⁻² s⁻¹)');
  const ph = (t0: number, t1: number, s: string): string => T((F.X(t0) + F.X(t1)) / 2, 108, s, 'fcc-h');
  return svg('Net CO2 uptake of Kalanchoe fedtschenkoi leaves over 24 hours, redrawn from Borland et al. 2009: in the dark the leaf takes up CO2 (phase I), peaking at about 2.3; at lights-on a short burst (phase II); then near zero for about four hours while the stomata are shut (phase III); then uptake again in the late light period (phase IV)', `
    ${F.svg}
    <path class="fcc-cam" d="${line(BORLAND, F.X, F.Y)}"/>
    ${ph(0, 12, 'I')}${ph(12, 13.6, 'II')}${ph(13.6, 17.4, 'III')}${ph(17.4, 24, 'IV')}
    <path class="fcc-rule" d="M${f(F.X(13.6))},120 V450 M${f(F.X(17.4))},120 V450"/>
    ${T(F.X(6), 72, 'dark', 'fcc-b')}${T(F.X(18), 72, 'light', 'fcc-b')}
    ${T(760, 152, it('Kalanchoë fedtschenkoi'), 'fcc-it', 'end')}
    ${T(445, 504, 'time (h)', 'fcc-at')}
    ${T(120, 540, 'I   stomata open, PEPC fixes CO₂', 'fcc-l', 'start')}
    ${T(120, 568, 'III  stomata shut, RuBisCO fixes CO₂ from malic acid', 'fcc-l', 'start')}
    ${credit(790, 596, CR_BORLAND)}
  `);
}

/* v2 · Abraham 2016 Fig. 1a: Agave americana, young (C₃) vs mature (CAM) leaf */
function v2(): string {
  const F = frame(120, 770, 110, 450, -1, 4, 1, false, 'net CO₂ uptake (µmol m⁻² s⁻¹)');
  return svg('Net CO2 uptake over 24 hours of two Agave americana leaves, redrawn from Abraham et al. 2016: the youngest leaf, still C3, takes up CO2 in the light and not in the dark; the mature leaf, CAM, takes up CO2 in the dark, up to about 3.6, and almost none in the light', `
    ${F.svg}
    <path class="fcc-c3" d="${line(AG_C3, F.X, F.Y)}"/>
    <path class="fcc-cam" d="${line(AG_CAM, F.X, F.Y)}"/>
    ${T(F.X(6), 92, 'light', 'fcc-b')}${T(F.X(18), 92, 'dark', 'fcc-b')}
    ${T(F.X(18), F.Y(2.9), 'mature leaf: CAM', 'fcc-b fcc-acid-t')}
    ${T(F.X(5.5), F.Y(1.5) - 22, 'young leaf: C₃', 'fcc-b fcc-cp-t')}
    ${T(445, 506, 'time (h)', 'fcc-at')}
    ${T(445, 546, `${it('Agave americana')} leaves, 12 h light`, 'fcc-it')}
    ${credit(790, 592, `${CR_ABRAHAM}a`)}
  `);
}

/* v3 · one cell, night and day (drawn) */
function v3(): string {
  const p = 'fcc13c';
  const cell = (x: number, night: boolean): string => {
    const y = 160, w = 330, h = 300, vx = x + 150, vy = y + 26, vw = 156, vh = h - 52, ah = night ? 190 : 34;
    const sy = y + 150, g = night ? 9 : 0.5;
    const s: string[] = [];
    s.push(`<rect class="fcc-wall" x="${x}" y="${y}" width="${w}" height="${h}" rx="30"/>`);
    s.push(`<rect class="fcc-vac" x="${vx}" y="${vy}" width="${vw}" height="${vh}" rx="20"/>`);
    s.push(`<rect class="fcc-acid" x="${vx + 6}" y="${vy + vh - 6 - ah}" width="${vw - 12}" height="${ah}" rx="14"/>`);
    s.push(`<ellipse class="fcc-stoma" cx="${x}" cy="${sy - 15 - g}" rx="11" ry="16"/><ellipse class="fcc-stoma" cx="${x}" cy="${sy + 15 + g}" rx="11" ry="16"/>`);
    s.push(night ? chloro(x + 70, y + 44, 32, 13) : chloro(x + 74, y + 56, 48, 20), chloro(x + 70, y + h - 40, 32, 13));
    return s.join('');
  };
  return svg('One CAM leaf cell drawn twice. Night: the stoma is open, CO2 enters, PEP carboxylase fixes it and the vacuole fills with malic acid. Day: the stoma is shut, malic acid leaves the vacuole and releases CO2, which RuBisCO fixes in a chloroplast', `
    ${heads(p)}
    <circle class="fcc-moon" cx="168" cy="112" r="18"/>${T(198, 122, 'night', 'fcc-h', 'start')}
    <circle class="fcc-sun" cx="560" cy="112" r="18"/>${T(590, 122, 'day', 'fcc-h', 'start')}
    ${cell(40, true)}${cell(430, false)}
    ${co2(-2 + 30, 310, 9)}${route(p, 'k', 'M54,310 H84')}${enzyme(112, 310, 'PEPC', 'm', 19)}${route(p, 'm', 'M144,310 H182')}
    ${T(268, 330, 'malic', 'fcc-b fcc-acid-t')}${T(268, 356, 'acid', 'fcc-b fcc-acid-t')}
    ${route(p, 'c', 'M588,410 C540,410 520,380 520,340')}${co2(520, 322, 9)}${route(p, 'c', 'M520,304 C520,270 516,256 510,242', 'fcc-thin')}
    ${rubisco(504, 216)}
    ${T(658, 380, 'malic acid', 'fcc-l fcc-acid-t')}
    ${T(98, 506, 'stoma open', 'fcc-l')}${T(488, 506, 'stoma shut', 'fcc-l')}
    ${credit(790, 592, 'drawn after Borland et al. 2009 and Males & Griffiths 2017')}
  `);
}

/* v4 · Agave field (photo) with its night uptake */
function v4(): string {
  const p = 'fcc13d';
  const a = shot(`${p}-im`, AGAVE, 14, 14, 772, { win: [0, 120, 1200, 740] });
  const F = frame(520, 760, 356, 440, 0, 4, 2, false, '', { bands: true });
  return svg('Aerial photograph of an agave plantation in Jalisco, Mexico, with an inset of the net CO2 uptake of a mature Agave americana leaf over 24 hours: uptake in the dark, almost none in the light', `
    ${a.svg}
    <rect class="fcc-panel" x="452" y="300" width="322" height="182" rx="14" opacity=".96"/>
    ${F.svg}
    <path class="fcc-cam" d="${line(AG_CAM, F.X, F.Y)}"/>
    ${T(F.X(6), 410, 'light', 'fcc-s')}${T(F.X(18), 432, 'dark', 'fcc-s')}
    ${T(468, 330, 'CO₂ uptake, mature leaf', 'fcc-b', 'start')}
    ${pill(150, 70, 'agave, a CAM crop')}
    ${credit(786, 512, 'photo: Tomascastelazo, Wikimedia Commons, CC BY-SA 4.0 · inset: Abraham et al. 2016, Fig. 1a')}
  `);
}

/* v5 · water-use efficiency ranges (Borland 2009 Table 2) */
function v5(): string {
  const X = (v: number): number => 206 + v * 52;
  const rows: Array<[string, string, number, number, string]> = [
    ['C₃', 'wheat, rice', 0.5, 1.5, 'fcc-bar-c3'], ['C₄', 'maize, sugarcane', 1, 2, 'fcc-bar-c4'], ['CAM', 'agave, pineapple', 4, 10, 'fcc-bar-cam'],
  ];
  const ax: string[] = [];
  for (let v = 0; v <= 10; v += 2) ax.push(`<path class="fcc-tk" d="M${X(v)},440 v8"/>${T(X(v), 472, `${v}`, 'fcc-ax')}`);
  return svg('CO2 gained per water lost, after Borland et al. 2009, table 2: C3 plants 0.5 to 1.5, C4 plants 1 to 2, CAM plants 4 to 10 millimoles CO2 per mole water', `
    ${rows.map(([n, ex, lo, hi, cls], i) => {
      const y = 120 + i * 104;
      return `${T(186, y + 30, n, 'fcc-big', 'end')}${T(186, y + 58, ex, 'fcc-s', 'end')}
        <rect class="${cls}" x="${f(X(lo))}" y="${y}" width="${f(X(hi) - X(lo))}" height="46" rx="10"/>
        ${T(X(hi) + 14, y + 31, `${lo}–${hi}`, 'fcc-h', 'start')}`;
    }).join('')}
    <path class="fcc-axl" d="M${X(0)},96 V440 H${X(10) + 10}"/>${ax.join('')}
    ${T(X(5), 510, 'CO₂ gained per water lost (mmol CO₂ per mol H₂O)', 'fcc-at')}
    ${credit(790, 592, 'Borland, Griffiths, Hartwell & Smith 2009, J Exp Bot 60:2879, Table 2')}
  `);
}

/* v6 · the chunk schema with CAM lit */
const v6 = (): string => schemaSvg('fcc13f', ['cam'],
  'Four panels: where CO2 meets RuBisCO in C3, C2, C4 and CAM plants. Lit: CAM, CO2 stored at night as malic acid and used by day (agave, pineapple). Dimmed: C3, C2 and C4');

/* v7 · Kalanchoë photo + its own CO₂ trace */
function v7(): string {
  const p = 'fcc13g';
  const a = shot(`${p}-im`, KAL, 14, 70, 300, { win: [120, 0, 640, 750] });
  const F = frame(410, 780, 110, 420, -0.5, 2.5, 0.5, true, 'net CO₂ uptake (µmol m⁻² s⁻¹)');
  return svg('Left, a photograph of Kalanchoe fedtschenkoi, a succulent CAM plant. Right, the net CO2 uptake of its leaves over 24 hours, redrawn from Borland et al. 2009: uptake in the dark, near zero for hours after lights-on, then some uptake late in the light period', `
    ${a.svg}
    ${T(164, 52, it('Kalanchoë fedtschenkoi'), 'fcc-b')}
    ${F.svg}
    <path class="fcc-cam" d="${line(BORLAND, F.X, F.Y)}"/>
    ${T(F.X(6), 98, 'dark', 'fcc-b')}${T(F.X(18), 98, 'light', 'fcc-b')}
    ${T(F.X(12), 476, 'time (h)', 'fcc-at')}
    ${credit(790, 572, 'photo: Ixitixel, Wikimedia Commons, CC BY-SA 3.0')}
    ${credit(790, 592, CR_BORLAND)}
  `);
}

/* v8 · malic acid over 24 h, Agave vs Arabidopsis, each on its own scale */
function v8(): string {
  const A = frame(110, 380, 130, 430, 0, 30, 10, false, 'malic acid (mg g⁻¹ fresh weight)');
  const B = frame(520, 780, 130, 430, 0, 0.6, 0.2, false, '');
  const dots = (pts: Array<[number, number]>, X: (t: number) => number, Y: (v: number) => number): string =>
    pts.map(([t, v]) => `<circle class="fcc-dot" cx="${f(X(t))}" cy="${f(Y(v))}" r="5.5"/>`).join('');
  return svg('Malic acid in leaves over 24 hours, redrawn from Abraham et al. 2016, figure 1c. Agave americana, CAM: it falls to about 4.8 milligrams per gram fresh weight in the light and rises through the dark to about 24. Arabidopsis thaliana, C3: it stays between about 0.25 and 0.44, on a fifty-times smaller scale', `
    ${A.svg}${B.svg}
    <path class="fcc-cam" d="${line(MAL_AG, A.X, A.Y)}"/>${dots(MAL_AG, A.X, A.Y)}
    <path class="fcc-c3" d="${line(MAL_AT, B.X, B.Y)}"/>${dots(MAL_AT, B.X, B.Y)}
    ${T(245, 76, `CAM: ${it('Agave')}`, 'fcc-b fcc-acid-t')}${T(650, 76, `C₃: ${it('Arabidopsis')}`, 'fcc-b fcc-cp-t')}
    ${T(A.X(6), 156, 'light', 'fcc-s')}${T(A.X(18), 156, 'dark', 'fcc-s')}${T(B.X(6), 156, 'light', 'fcc-s')}${T(B.X(18), 156, 'dark', 'fcc-s')}
    ${T(245, 486, 'time (h)', 'fcc-at')}${T(650, 486, 'time (h)', 'fcc-at')}
    ${T(650, 530, 'scale 50 × smaller', 'fcc-it')}
    ${credit(790, 592, `${CR_ABRAHAM}c`)}
  `);
}

