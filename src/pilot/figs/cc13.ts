// Slide C13 · Crassulacean acid metabolism (chunk cc, 28 Oct 2026). Pick key C12 (its number when its figures were picked).
// Facts: Borland, Griffiths, Hartwell & Smith 2009 JXB 60:2879 (FT, via the fact-check): Fig. 3, diel CO₂ exchange of
// Kalanchoë fedtschenkoi with Osmond's phases (I night uptake by PEPC; II PEPC + RuBisCO; III RuBisCO refixes CO₂ from
// malate behind closed stomata; IV stomata reopen); Table 2 water-use efficiency, mmol CO₂ per mol H₂O: CAM 4–10,
// C₃ 0.5–1.5, C₄ 1–2. Abraham et al. 2016 Nat Plants 2:16178 (FT, via the fact-check): Fig. 1a net CO₂ uptake of Agave
// americana leaves L1 (youngest, C₃) to L4 (CAM), 12 h light; Fig. 1c malic acid, Agave vs Arabidopsis (µg g⁻¹ FW).
// Gilman et al. 2023 Ann Bot (FT): ≈ 7 % of vascular plant species. Töpfer et al. 2020 Plant Cell (FT): night uptake in the
// cooler, more humid hours. Curves redrawn by colour-digitizing the board images (tools/digitize.py) or read by eye.
// New variants v1–v8 first, then the earlier ones (drawn by c10.ts).
// Overnight, 29 Oct 2026 (OVERNIGHT_STYLE.md): the text rewritten at bachelor level, and page versions p1, p2 in the deck's
// micrograph-and-magnifier style (anim/c4-style.ts). Facts of the new text: Borland et al. 2009 (FT): "CAM plants open their
// stomata and perform PEPC-mediated CO2 uptake in the dark to form malic acid … broken down to release CO2 that is fixed by
// Rubisco during the following day"; their WUE "may be 3-fold higher than that of C4 plants and at least 6-fold higher than
// for C3 species" (→ "≈ 6 × less water per CO₂ fixed"). Winter & Smith 2022 (FT, PMC9298356): "vacuolar accumulation of
// malic acid"; by day "the nocturnally accumulated malic acid is released from the vacuole … the liberated CO2 accumulates to
// high internal concentrations behind closed stomata … is refixed by Rubisco"; the two steps "temporally separated across the
// 24 h diel cycle" in the mesophyll cells. C₄ in 2 cells (mesophyll PEPC, bundle-sheath RuBisCO): slide C12.
// Real images: c13-cam-page-succulent.jpg, Berkshire Community College Bioscience Image Library, "Stoma and guard cells in
// succulent xerophyte leaf", https://commons.wikimedia.org/wiki/File:Stoma_and_guard_cells_in_succulent_xerophyte_leaf_(34883081660).jpg,
// CC0, 400×, species not given by the library (the figure says "succulent leaf"); the whole 3264 × 1840 file resized to
// 1800 × 1015. c12-zea-kranz.jpg as anim/c4-style.ts (same library, CC0). RuBisCO PDB 8RUC; PEPC PDB 3ZGE (Paulus et al. 2013).
import type { PlateText, Variant } from '../types';
import { draw as drawC10, VARIANTS as C10_VARIANTS } from './c10';
import { T, TV, chloro, co2, credit, enzyme, f, heads, it, pill, route, routeOnPhoto, rubisco, shot, svg, type Img, type Pt } from './cc-kit';
import { schemaSvg } from './cc-schema';
import { arrow, bilayer } from './cell-schema';
import { leafSvg, hco3G, PORE, SPOT, VAC, MCP, C4, type LPart } from './leaf-schema';
import { atomBall, rowWidth } from './carbon-form';
import { GLYPH } from '../anim/dk1-common';
import { bilayerE, bilayerH, carbG, kidG, sunG, tangents } from '../anim/co2-kit';
import agave from '../../assets/photos/cc-agave-field.jpg';
import kal from '../../assets/photos/cc-kalanchoe.jpg';
import succJpg from '../../assets/photos/c13-cam-page-succulent.jpg';
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import pepcPng from '../../assets/rf/pepc-3zge.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import rubGPng from '../../assets/cell/rubisco-g.png';

export const PLATE: PlateText = {
  n: 'C13',
  pick: 'C12',
  title: 'Crassulacean acid metabolism (CAM)',
  status: 'draft',
  // overnight, 29 Oct 2026: bachelor level, as slide 19 (lecturer: "keep the most essential things … do not overwhelm")
  lead: 'CAM plants take up CO₂ at night and give it to RuBisCO by day, behind closed stomata.<br>C₄ separates the two steps in space, CAM in time.',
  points: [
    { claim: 'Night: stomata open.', text: 'PEPC fixes CO₂ into a C₄ acid, stored as malic acid in the vacuole' },
    { claim: 'Day: stomata shut.', text: 'Malic acid leaves the vacuole and releases its CO₂ to RuBisCO in the same cell' },
    { claim: 'High water-use efficiency.', text: 'Per CO₂ fixed, CAM loses ≈ 6 × less water than C₃' },
  ],
  refs: [
    { label: 'Borland et al. 2009', url: 'https://doi.org/10.1093/jxb/erp118' },
    { label: 'Winter & Smith 2022', url: 'https://doi.org/10.1111/nph.17790' },
    { label: 'Males & Griffiths 2017', url: 'https://doi.org/10.1104/pp.17.00114' },
    { label: 'Töpfer et al. 2020', url: 'https://doi.org/10.1105/tpc.20.00132' },
    { label: 'Gilman et al. 2023', url: 'https://doi.org/10.1093/aob/mcad135' },
  ],
};

export const VARIANTS: Variant[] = [
  // overnight, 29 Oct 2026: page versions in the micrograph-and-magnifier style (plates.ts lists p… first)
  { id: 'p1', name: 'Succulent leaf section: one cell magnified at night and by day' },
  { id: 'p2', name: 'C₄ in space (maize, 2 cells) beside CAM in time (1 cell, night and day)' },
  // 29 Oct 2026, from the picked animation lf13m (lecturer: "make more variants of the slide as well")
  { id: 'r1', name: 'The animation\'s cell, night | day: CO₂ stored as malic acid in the vacuole; light energy, then RuBisCO' },
  { id: 'r2', name: 'The animation\'s cell under a 24-hour band: night steps 1–2, day steps 3–4' },
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
  const fns: Record<string, () => string> = { p1, p2, r1, r2, v1, v2, v3, v4, v5, v6, v7, v8 };
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

/* ================ p1, p2 · micrograph and magnifier (overnight, 29 Oct 2026) ================
   The style of anim/c4-style.ts and slide 19: a real micrograph, a lens on the place that matters, magnifiers drawn with
   bilayers, real protein structures (RuBisCO 8RUC, PEPC 3ZGE) and atom balls; the CO₂ character of slide 19
   (anim/co2-kit.ts kidG). The C₄ acid and malic acid are drawn as on slide 21 (4 carbon balls). An idle enzyme is grey. */

const SUCC: Img = { href: succJpg, w: 1800, h: 1015 };
const ZEA: Img = { href: zeaJpg, w: 1000, h: 740 };
const PEPC_AR = 517 / 608, RUB_AR = 471 / 548;
const sty = (s: string): string => ` style="${s}"`;
const NIGHT = '#dfe1ea', DAY = '#f7ecd0', TEAL = '#237a72', CLAY = '#8f7a3e';
const CR_SUCC = 'succulent leaf, 400×: Berkshire Community College Bioscience Image Library (CC0)';
const CR_PDB = 'RuBisCO: PDB 8RUC · PEPC: PDB 3ZGE (Paulus et al. 2013)';

/** PEPC (3ZGE) and RuBisCO (8RUC) renders centred at c, w wide; idle: grey (RuBisCO's grey render, PEPC desaturated). */
const pepcImg = (c: Pt, w: number, idle = false): string =>
  `<image href="${pepcPng}" x="${f(c[0] - w / 2)}" y="${f(c[1] - (w * PEPC_AR) / 2)}" width="${f(w)}" height="${f(w * PEPC_AR)}"${idle ? sty('filter:grayscale(1) brightness(1.15);opacity:.5') : ''}/>`;
const rubImg = (c: Pt, w: number, idle = false): string =>
  `<image href="${idle ? rubGPng : rubPng}" x="${f(c[0] - w / 2)}" y="${f(c[1] - (w * RUB_AR) / 2)}" width="${f(w)}" height="${f(w * RUB_AR)}"${idle ? ' opacity=".55"' : ''}/>`;

/** The CO₂ character of slide 19 standing still: one face (n neutral, h glad: moving freely, s strained and sweating:
 *  trapped), its name above unless lab is ''. */
function kidAt(k: string, at: Pt, r: number, face: 'n' | 'h' | 's', lab = 'CO₂'): string {
  let s = kidG(k, r, lab, -r - 12).replace(' data-actor="1" display="none"', ` transform="translate(${f(at[0])} ${f(at[1])})"`);
  const off = ['fn', 'fs', 'fh', 'sw', 'sh'].filter(q => q !== `f${face}` && !(face === 's' && q === 'sw'));
  for (const q of off) s = s.replace(`<g data-k="${k}-${q}">`, `<g data-k="${k}-${q}" display="none">`);
  return s;
}
/** Malic acid (a C₄ acid): 4 carbon balls on a pale capsule, as on slide 21. */
const acid = (c: Pt, r = 6.5): string => `<g transform="translate(${f(c[0])} ${f(c[1])})">${carbG('CCCC', r)}</g>`;
/** A stoma in cross-section, as on slide 19: 2 guard cells with thickened inner walls; open, a pore between them. */
function stomaG(c: Pt, sc: number, open: boolean): string {
  const rx = 8 * sc, ry = 11 * sc, pg = (open ? 3.5 : 0.3) * sc;
  const gc = (sg: number): string => {
    const x = c[0] + sg * (pg + rx);
    return `<ellipse cx="${f(x)}" cy="${f(c[1])}" rx="${f(rx)}" ry="${f(ry)}"${sty(`fill:#dbe8c6;stroke:#8f9f6a;stroke-width:${f(Math.max(1, 0.18 * sc))}`)}/>
      <path d="M${f(x - sg * rx * 0.72)},${f(c[1] - ry * 0.62)} Q${f(x - sg * rx * 1.02)},${f(c[1])} ${f(x - sg * rx * 0.72)},${f(c[1] + ry * 0.62)}"${sty(`fill:none;stroke:#7d8c58;stroke-width:${f(Math.max(1.2, 0.34 * sc))};stroke-linecap:round`)}/>
      <circle cx="${f(x + sg * rx * 0.2)}" cy="${f(c[1] - ry * 0.3)}" r="${f(1.5 * sc)}" fill="#9fbf6e"/><circle cx="${f(x + sg * rx * 0.25)}" cy="${f(c[1] + ry * 0.32)}" r="${f(1.5 * sc)}" fill="#9fbf6e"/>`;
  };
  return `${open ? `<rect x="${f(c[0] - pg)}" y="${f(c[1] - ry)}" width="${f(2 * pg)}" height="${f(2 * ry)}" fill="#eef3f5"/>` : ''}${gc(-1)}${gc(1)}`;
}
/** A thylakoid stack: n discs w wide from (x, y) down. */
const granum = (x: number, y: number, w: number, n = 3): string =>
  Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 7)}" width="${f(w)}" height="5" rx="2.5"${sty('stroke:#9fbf6e;stroke-width:1.1')}/>`).join('');
/** A crescent moon centred near c. */
const moonG = (c: Pt, r: number): string => {
  const x0 = c[0] + r * 0.35;
  return `<path d="M${f(x0)},${f(c[1] - r)} A${r},${r} 0 0 0 ${f(x0)},${f(c[1] + r)} A${f(r * 1.3)},${f(r * 1.3)} 0 0 1 ${f(x0)},${f(c[1] - r)}Z"${sty('fill:#c4cbe0;stroke:#5f6a8c;stroke-width:1.4')}/>`;
};
const sun = (c: Pt, r: number): string => `<g transform="translate(${f(c[0])} ${f(c[1])})">${sunG(r)}</g>`;
const lab = (x: number, y: number, s: string, cls = 'co2k-il cel-halo', a: 'start' | 'middle' | 'end' = 'middle'): string => T(x, y, s, cls, a);

/* p1 · the micrograph, a lens on the stoma and the mesophyll cell below it, and 2 magnifiers of that cell: night, day */
/** The magnified cell is drawn in local units (radius ML, origin at the magnifier's centre) and scaled to the magnifier. */
const ML = 158, MR = 170;
/** Local bands, top to bottom: sky above the leaf (y < -112); the epidermis with the stoma (-112 to -86, cuticle on top);
 *  the air space below it (-86 to -70); the cell wall (-70 to -60) and plasma membrane (-55); a thin cytosol with PEPC and
 *  a chloroplast; the tonoplast (tono) and the large vacuole. */
const tono = (x: number): number => 52 + 0.0012 * x * x;
const ST: Pt = [-88, -99], CPC: Pt = [74, -4], PEPC_C: Pt = [-92, -6];
function camCell(p: string, night: boolean): string {
  const sc = 1.6, edge = (night ? 3.5 : 0.3) * sc + 16 * sc;
  const xs = Array.from({ length: 23 }, (_, i) => -176 + i * 16);
  const s: string[] = [
    `<rect x="-172" y="-172" width="344" height="60"${sty(`fill:${night ? NIGHT : DAY}`)}/>`,
    `<rect x="-172" y="-86" width="344" height="16" fill="#eef3f5"/>`,
    `<rect x="-174" y="-112" width="348" height="26"${sty('fill:#f8f6ee;stroke:#c9b98f;stroke-width:1.6')}/>`,
    ...[-150, 0, 86].map(x => `<path d="M${x},-112 V-86"${sty('fill:none;stroke:#c9b98f;stroke-width:1.6')}/>`),
    `<path d="M-174,-112 H${f(ST[0] - edge)} M${f(ST[0] + edge)},-112 H174"${sty('fill:none;stroke:#b9a26b;stroke-width:3;stroke-linecap:round')}/>`,
    stomaG(ST, sc, night),
    // the mesophyll cell: cytosol, wall (with fibres), plasma membrane
    `<rect x="-174" y="-60" width="348" height="236" class="co2k-cyt"/>`,
    `<rect x="-174" y="-70" width="348" height="10" class="co2k-wallb"/>`,
    ...Array.from({ length: 14 }, (_, i) => `<path class="co2k-fib" d="M${-164 + i * 24},-65 q4,-3 8,0 t8,0"/>`),
    bilayerH(-176, 176, -55, 5),
    // the vacuole below the tonoplast
    `<path d="M${xs.map(x => `${x},${f(tono(x))}`).join('L')}L176,176L-176,176Z"${sty('fill:#e9eef2')}/>`,
    bilayer(xs.slice(0, -1).map((x, i) => ({ L: [x, tono(x), xs[i + 1], tono(xs[i + 1])] as [number, number, number, number] })), 5, 1.6, 4.2),
    // the chloroplast: stroma, double envelope, 2 grana, RuBisCO (idle at night)
    `<ellipse class="co2k-strm" cx="${CPC[0]}" cy="${CPC[1]}" rx="46" ry="24"/>${bilayerE(CPC[0], CPC[1], 46, 24, 3.2)}${bilayerE(CPC[0], CPC[1], 54, 32, 3.2)}`,
    granum(36, CPC[1] - 9, 14), granum(112, CPC[1] - 9, 14), rubImg(CPC, 44, night),
    // PEPC in the cytosol (idle by day)
    pepcImg(PEPC_C, 52, !night),
  ];
  if (night) {
    // CO₂ in through the open stoma to PEPC; malic acid into the vacuole, which fills
    s.push(route(p, 'c', 'M-58,-121 Q-88,-122 -88,-104 L-90,-34'),
      route(p, 'm', 'M-66,16 Q-56,36 -56,64'),
      acid([-56, 84]), acid([8, 80]), acid([-24, 110]),
      kidAt(`${p}-kn`, [-44, -134], 9, 'n', ''), lab(-12, -128, 'CO₂', 'cel-mn cel-halo', 'start'),
      lab(PEPC_C[0], 38, 'PEPC'), lab(0, 138, 'malic acid', 'cel-mn cel-halo'), lab(84, 92, 'vacuole'));
  } else {
    // malic acid leaves the vacuole and gives its CO₂ to RuBisCO (the stoma shut)
    s.push(route(p, 'm', 'M-20,58 L-20,20'),
      route(p, 'c', 'M10,-2 L48,-4'),
      acid([-56, 98]), acid([-20, 72]),
      kidAt(`${p}-kd`, [-20, 0], 9, 'h'),
      lab(CPC[0], 46, 'RuBisCO'), lab(16, 78, 'malic acid', 'cel-mn cel-halo', 'start'));
  }
  return s.join('');
}

function p1(): string {
  const p = 'fcc13p1';
  const a = shot(`${p}-a`, SUCC, 200, 8, 400, { win: [840, 170, 800, 412] });
  const L = a.at(1240, 360), LR = 40;
  const N: Pt = [185, 400], D: Pt = [615, 400];
  const k = MR / ML;
  const mag = (c: Pt, night: boolean): string => {
    const id = `${p}-${night ? 'n' : 'd'}`;
    return `<clipPath id="${id}"><circle cx="${c[0]}" cy="${c[1]}" r="${MR}"/></clipPath>
      <circle class="co2k-inbg" cx="${c[0]}" cy="${c[1]}" r="${MR}"/>
      <g clip-path="url(#${id})"><g transform="translate(${c[0]} ${c[1]}) scale(${k.toFixed(4)})">${camCell(p, night)}</g></g>
      <circle class="co2k-inring" cx="${c[0]}" cy="${c[1]}" r="${MR}"/>`;
  };
  return svg('Top: light micrograph of a succulent leaf in cross-section: the epidermis with a stoma between 2 guard cells, and below it mesophyll cells whose chloroplasts line the cell walls around a large vacuole. A lens on the stoma and the mesophyll cell beneath it leads to 2 magnifiers of that same cell. Left, night, stoma open: a CO2 molecule enters through the stoma; PEP carboxylase (PEPC) in the thin cytosol fixes it, and malic acid crosses the tonoplast into the vacuole, which fills with it; RuBisCO in the chloroplast is grey, idle. Right, day, stoma shut: PEPC is grey, idle; a malic acid leaves the vacuole and releases its CO2, which goes to RuBisCO in the chloroplast of the same cell.', `
    ${heads(p)}${a.svg}
    ${pill(276, 34, 'stoma', a.at(1155, 262))}${pill(506, 192, 'mesophyll cell', a.at(1400, 440))}
    <g class="dk1 co2k">
      <path class="co2k-tan" d="${tangents(L, LR, N, MR)}${tangents(L, LR, D, MR)}"/>
      <circle class="co2k-lens" cx="${f(L[0])}" cy="${f(L[1])}" r="${LR}"/>
      ${moonG([34, 54], 14)}${T(58, 64, 'night', 'fcc-h', 'start')}${T(22, 98, 'stoma open', 'fcc-l', 'start')}
      ${sun([766, 54], 12)}${T(732, 64, 'day', 'fcc-h', 'end')}${T(778, 98, 'stoma shut', 'fcc-l', 'end')}
      ${mag(N, true)}${mag(D, false)}
    </g>
    ${credit(400, 582, CR_SUCC, 'middle')}${credit(400, 597, CR_PDB, 'middle')}`);
}

/* p2 · C₄ in space beside CAM in time: maize (a bundle-sheath cell and a mesophyll cell) and one succulent-leaf cell under a
   night/day band; the same 2 enzymes in each, PEPC first, RuBisCO second */
function p2(): string {
  const p = 'fcc13p2';
  const y0 = 88, W = 372;
  const a = shot(`${p}-a`, ZEA, 14, y0, W, { win: [530, 190, 400, 400] });
  const b = shot(`${p}-b`, SUCC, 414, y0, W, { win: [1480, 306, 320, 320] });
  const ka = W / 400, kb = W / 320;
  const bs = a.at(655, 380), ms = a.at(818, 368), cell = b.at(1648, 466);
  const ring = (c: Pt, rx: number, ry: number, col: string): string =>
    `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(rx)}" ry="${f(ry)}"${sty(`fill:none;stroke:${col};stroke-width:2.6;stroke-dasharray:8 6`)}/>`;
  const badge = (c: Pt, inner: string): string =>
    `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="34"${sty('fill:#fffdf8;stroke:#3d3d3a;stroke-width:1.8;opacity:.96')}/>${inner}`;
  const band = (x: number, w: number, fill: string): string => `<rect x="${f(x)}" y="50" width="${f(w)}" height="34"${sty(`fill:${fill}`)}/>`;
  // CAM: the badges in the left (night) and right (day) half of the one cell
  const cp: Pt = [cell[0] - 64, 236], cr: Pt = [cell[0] + 64, 236], ca: Pt = [cell[0], 352];
  return svg('Left, C4: a maize leaf in cross-section, a band above it naming the bundle-sheath cell on the left and the mesophyll cell on the right, both outlined on the micrograph. A CO2 molecule enters the mesophyll cell, where PEP carboxylase (PEPC) fixes it into a C4 acid; the C4 acid moves through the wall into the bundle-sheath cell to RuBisCO: 2 cells, separated in space. Right, CAM: one mesophyll cell of a succulent leaf, outlined, under a band that is night on the left and day on the right. At night a CO2 molecule enters and PEPC fixes it into malic acid, stored in the vacuole; by day the malic acid gives its CO2 to RuBisCO in the same cell: 1 cell, separated in time.', `
    ${heads(p)}
    ${T(200, 34, 'C₄', 'fcc-h')}${T(600, 34, 'CAM', 'fcc-h')}
    <g class="dk1 co2k">
      ${band(14, ms[0] - 46 * ka - 14 - 6, '#f3eadb')}${band(ms[0] - 46 * ka - 6, 386 - (ms[0] - 46 * ka - 6), '#e3f1ee')}
      ${lab((14 + ms[0] - 46 * ka - 6) / 2, 73, 'bundle-sheath cell', 'co2k-ilb')}${lab((ms[0] - 46 * ka - 6 + 386) / 2, 73, 'mesophyll cell', 'co2k-ilb')}
      ${band(414, cell[0] - 414, NIGHT)}${band(cell[0], 786 - cell[0], DAY)}
      ${moonG([(414 + cell[0]) / 2 - 34, 66], 10)}${lab((414 + cell[0]) / 2 - 18, 73, 'night', 'co2k-ilb', 'start')}
      ${sun([(cell[0] + 786) / 2 - 26, 66], 9)}${lab((cell[0] + 786) / 2 - 10, 73, 'day', 'co2k-ilb', 'start')}
    </g>
    ${a.svg}${b.svg}
    <g class="dk1 co2k">
      ${ring(bs, 98 * ka, 110 * ka, CLAY)}${ring(ms, 50 * ka, 44 * ka, TEAL)}
      ${routeOnPhoto(p, 'c', `M${f(ms[0] + 58)},${f(ms[1] - 64)} L${f(ms[0] + 26)},${f(ms[1] - 26)}`)}
      ${routeOnPhoto(p, 'm', `M${f(ms[0] - 36)},${f(ms[1] + 6)} L${f(bs[0] + 38)},${f(ms[1] + 6)}`)}
      ${badge(bs, rubImg(bs, 50))}${badge(ms, pepcImg(ms, 54))}
      ${acid([(bs[0] + ms[0]) / 2 + 2, ms[1] + 30])}${lab((bs[0] + ms[0]) / 2 + 2, ms[1] + 58, 'C₄ acid', 'cel-mn cel-halo')}
      ${lab(bs[0], bs[1] - 44, 'RuBisCO')}${lab(ms[0], ms[1] - 44, 'PEPC')}
      ${kidAt(`${p}-ka`, [ms[0] + 70, ms[1] - 80], 9, 'h')}
      ${ring(cell, 128 * kb, 134 * kb, TEAL)}
      ${routeOnPhoto(p, 'c', `M${f(cp[0] - 82)},${f(cp[1] - 66)} L${f(cp[0] - 28)},${f(cp[1] - 24)}`)}
      ${routeOnPhoto(p, 'm', `M${f(cp[0] + 4)},${f(cp[1] + 36)} Q${f(cp[0] + 10)},${f(ca[1] - 10)} ${f(ca[0] - 34)},${f(ca[1])}`)}
      ${routeOnPhoto(p, 'm', `M${f(ca[0] + 30)},${f(ca[1])} Q${f(cr[0] - 10)},${f(ca[1] - 10)} ${f(cr[0] - 4)},${f(cr[1] + 40)}`)}
      ${badge(cp, pepcImg(cp, 54))}${badge(cr, rubImg(cr, 50))}
      ${acid(ca)}${lab(ca[0], ca[1] + 34, 'malic acid', 'cel-mn cel-halo')}${lab(ca[0], ca[1] + 58, 'vacuole')}
      ${lab(cp[0], cp[1] - 44, 'PEPC')}${lab(cr[0], cr[1] - 44, 'RuBisCO')}
      ${kidAt(`${p}-kb`, [cp[0] - 96, cp[1] - 80], 9, 'h')}
    </g>
    ${pill(200, 508, 'C₄: 2 cells, separated in <tspan font-weight="700">space</tspan>', undefined, { tint: true })}
    ${pill(600, 508, 'CAM: 1 cell, separated in <tspan font-weight="700">time</tspan>', undefined, { tint: true })}
    ${credit(14, 566, 'maize leaf (left) and succulent leaf (right), 400×: Berkshire Community College Bioscience Image Library (CC0)', 'start')}
    ${credit(14, 584, CR_PDB, 'start')}`);
}

/* r1, r2 · the cell of the picked animation (anim/lf13.ts 'lf13m'): the mesophyll cell of the leaf section
   (figs/leaf-schema.ts), its stoma, chloroplast and vacuole, in the same window; the lecturer's 2 additions of
   29 Oct 2026: at night the CO₂ carried by malic acid sleeps in the vacuole (the face of anim/cam-kranz.ts on the
   fourth carbon, the one that came from the CO₂, with 2 small z's); by day light gives the energy first (the thylakoids
   lit, ATP and NADPH), then the CO₂ wakes, leaves the vacuole and goes to RuBisCO. The schema's own names are left out
   (they would be < 12 px at this scale) and set again at full size. Enzymes as in the schema: PEPC 5VYJ, RuBisCO 8RUC. */
const LWIN: [number, number, number, number] = [70, 22, 534, 598];
const LIT_N: LPart[] = ['stoma', 'pepc', 'vac', 'm-cp'], LIT_D: LPart[] = ['stoma', 'vac', 'm-cp', 'm-rub'];
const LHIDE: LPart[] = ['m-perox', 'm-mito', 'ppdk', 'me', 'bs-rub', 'bs-mito', 'starch', 'ca', 'cam-me'];
const CR_LEAF = 'RuBisCO: PDB 8RUC · PEPC: PDB 5VYJ';
const CPX = MCP[0] + MCP[2] / 2, VCX = VAC[0] + VAC[2] / 2;
/** Extra grana in the mesophyll chloroplast (panorama units), drawn as the schema's: 3 thylakoid discs as bilayers. */
const GRANA: Pt[] = [[CPX, 200], [CPX, SPOT.granum[1]]];
function granumL(x: number, y: number, w: number): string {
  return [0, 1, 2].map(k => {
    const yy = y - 11 + k * 11, x0 = x - w / 2, x1 = x + w / 2;
    const segs = [{ L: [x0, yy - 2.8, x1, yy - 2.8] as [number, number, number, number] }, { A: [x1, yy, 2.8, 2.8, -90, 90] as [number, number, number, number, number, number] },
      { L: [x1, yy + 2.8, x0, yy + 2.8] as [number, number, number, number] }, { A: [x0, yy, 2.8, 2.8, 90, 270] as [number, number, number, number, number, number] }];
    return `<path class="cel-lumen" d="M${x0},${yy - 2.8}H${x1}V${yy + 2.8}H${x0}Z"/>${bilayer(segs, 3.2, 0.9, 2.6)}`;
  }).join('');
}
/** The face of the CO₂ character (anim/cam-kranz.ts): awake (eyes, smile) or asleep (closed eyes, 2 small z's). */
function faceL(r: number, sleep: boolean): string {
  const R = (v: number): string => f(v * r), w = f(Math.max(1.4, r * 0.12)), er = f(Math.max(1.5, r * 0.13));
  const p = (d: string): string => `<path class="co2k-face" d="${d}" style="stroke-width:${w}px"/>`;
  if (!sleep) return `<circle class="co2k-eye" cx="${R(-0.36)}" cy="${R(-0.16)}" r="${er}"/><circle class="co2k-eye" cx="${R(0.36)}" cy="${R(-0.16)}" r="${er}"/>`
    + `<path class="co2k-mouth" d="M${R(-0.34)},${R(0.2)}Q0,${R(0.64)} ${R(0.34)},${R(0.2)}Z"/>`;
  const z = (x: number, y: number, s: number): string => `<text x="${f(x)}" y="${f(y)}" style="font-size:${s}px;font-weight:600;font-style:italic;fill:#5d6a8f">z</text>`;
  return p(`M${R(-0.56)},${R(-0.16)}Q${R(-0.36)},${R(0.08)} ${R(-0.16)},${R(-0.16)}M${R(0.16)},${R(-0.16)}Q${R(0.36)},${R(0.08)} ${R(0.56)},${R(-0.16)}`)
    + p(`M${R(-0.14)},${R(0.36)}Q0,${R(0.46)} ${R(0.14)},${R(0.36)}`) + z(r * 1.0, -r * 0.9, 13) + z(r * 1.7, -r * 1.75, 16);
}
/** Malic acid (4 carbon balls on a pale capsule, as in the animation) with the CO₂'s face on its fourth carbon. */
function acidFace(c: Pt, r: number, sleep: boolean): string {
  const w = rowWidth(4, r), st = r * 2.15, x0 = -w / 2 + r, x3 = x0 + 3 * st;
  const cap = `<rect class="dk-cap" x="${f(-w / 2 - 5)}" y="${f(-r - 5)}" width="${f(w + 10)}" height="${f(2 * r + 10)}" rx="${f(r + 5)}"/>`;
  const bond = `<path d="M${f(x0)},0H${f(x3)}" style="stroke:#6b6a64;stroke-width:${f(Math.max(1.6, r * 0.22))};fill:none"/>`;
  const balls = [0, 1, 2].map(i => atomBall(x0 + i * st, 0, 'C', r)).join('') + atomBall(x3, 0, 'C', r).replace(/<text[\s\S]*?<\/text>/, '');
  return `<g transform="translate(${f(c[0])} ${f(c[1])})">${cap}${bond}${balls}<g transform="translate(${f(x3)} 0)">${faceL(r, sleep)}</g></g>`;
}
const at = (c: Pt, g: string, k = 1): string => `<g transform="translate(${f(c[0])} ${f(c[1])})${k !== 1 ? ` scale(${k})` : ''}">${g}</g>`;
/** The glow of lit thylakoids (the light colour of the sun glyph). */
const glowDefs = (p: string): string => `<radialGradient id="${p}-glow"><stop offset="0" stop-color="#fff4d6"/><stop offset=".5" stop-color="#f6c453" stop-opacity=".75"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient>`;

/** The animation's cell at (x0, y0), scale s: night (stoma open, PEPC lit, RuBisCO grey) or day (stoma shut, PEPC
 *  grey, RuBisCO lit); the schema's names stripped. Returns the markup (pano extras inside) and the point map. */
function lfCell(id: string, night: boolean, x0: number, y0: number, s: number, pano: string, o: { tint?: boolean; lit?: LPart[] } = {}) {
  const [wx, wy, ww, wh] = LWIN;
  const P = (q: Pt): Pt => [x0 + (q[0] - wx) * s, y0 + (q[1] - wy) * s];
  const body = leafSvg(id, o.lit ?? (night ? LIT_N : LIT_D), { bare: true, noMol: true, gap: night ? 12 : 0, acid: 0, hide: LHIDE })
    .replace(/<text\b[\s\S]*?<\/text>/g, '');
  const w = ww * s, h = wh * s;
  const svgS = `<clipPath id="${id}-c"><rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="14"/></clipPath>
    <g clip-path="url(#${id}-c)"><g transform="translate(${f(x0)} ${f(y0)}) scale(${s.toFixed(4)}) translate(${-wx} ${-wy})">${body}${pano}</g>
    ${(o.tint ?? night) ? `<rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}"${sty('fill:#33405e;opacity:.16')}/>` : ''}</g>
    <rect class="lf-panel" x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="14"/>`;
  return { svg: svgS, P, w, h };
}
/** Night overlays: CO₂ in through the stoma → HCO₃⁻ → PEPC → C₄ acid → malic acid asleep in the vacuole. */
const NIGHT_ARROWS = `${arrow([[78, 340], ...C4.co2In.slice(0, -1), [414, 90]], 'gas', { halo: true })}${arrow([[478, 118], [502, 130], [520, 142]], 'c', { thin: true })}
  ${arrow([[532, 226], [514, 268], [504, 350], [502, 416]], 'c', { halo: true })}`;
/** Day overlays: malic acid out of the vacuole → CO₂ → RuBisCO; ATP and NADPH from the lit thylakoids → RuBisCO. */
const DAY_ARROWS = `${arrow([[500, 384], [492, 360], [474, 346]], 'c', { thin: true })}${arrow([[404, 340], [384, 340], [364, 340]], 'gas', { halo: true })}
  ${arrow([[CPX - 22, 428], [CPX - 14, 380]], 'atp', { thin: true })}${arrow([[CPX + 26, 428], [CPX + 14, 380]], 'atp', { thin: true })}`;
const granaL = (lit: boolean, p: string): string =>
  GRANA.map(([x, y]) => `${lit ? `<ellipse cx="${x}" cy="${y}" rx="62" ry="36" fill="url(#${p}-glow)"/>` : ''}${granumL(x, y, 56)}`).join('');

function nightLabels(P: (q: Pt) => Pt, p: string): string {
  const v0 = P([VCX, VAC[1]])[1];
  const vx = P([VCX - 10, 0])[0];
  return `${lab(P([PORE[0], 272])[0], P([0, 272])[1], 'stoma')}
    ${kidAt(`${p}-kn`, P([200, 214]), 9, 'h')}
    ${at(P([452, 96]), `<circle class="dk-cap" r="28"/>${hco3G(0, 0)}`)}${lab(P([452, 96])[0], P([452, 96])[1] + 40, 'HCO₃⁻', 'cel-mn cel-halo')}
    ${lab(P([484, 0])[0], P([0, 190])[1], 'PEPC', 'co2k-il cel-halo', 'end')}
    ${at(P([508, 300]), GLYPH.carbon('CCCC'))}${lab(P([508, 0])[0], P([0, 300])[1] - 24, 'C₄ acid', 'cel-mn cel-halo')}
    ${lab(P([VCX, 0])[0], v0 + 17, 'vacuole', 'co2k-il cel-halo')}${lab(P([VCX, 0])[0], v0 + 36, 'malic acid', 'cel-mn cel-halo')}
    ${acidFace([vx, v0 + 66], 9.6, true)}${acidFace([vx, v0 + 100], 9.6, true)}
    ${lab(P([CPX, 0])[0], P([0, 556])[1], 'chloroplast', 'co2k-il cel-halo')}`;
}
function dayLabels(P: (q: Pt) => Pt, p: string): string {
  const v0 = P([VCX, VAC[1]])[1];
  const vx = P([VCX - 10, 0])[0];
  const tags = `<g transform="translate(-34 0)">${GLYPH.atp()}</g>${T(0, 6, '+', 'co2k-il')}<g transform="translate(48 0)">${GLYPH.nadph()}</g>`;
  return `${lab(P([PORE[0], 286])[0], P([0, 286])[1], 'stoma')}
    ${acidFace([P([VCX, 0])[0], v0 - 6], 9.6, false)}${lab(P([VCX, 0])[0], v0 + 26, 'malic acid', 'cel-mn cel-halo')}
    ${kidAt(`${p}-kd`, P([438, 334]), 9, 's')}
    ${acidFace([vx, v0 + 54], 9.6, false)}${lab(P([VCX, 0])[0], v0 + 96, 'vacuole', 'co2k-il cel-halo')}
    ${lab(P([CPX, 0])[0], P([0, 290])[1], 'RuBisCO', 'co2k-il cel-halo')}
    ${at(P([CPX + 6, 446]), tags, 0.86)}${lab(P([CPX, 0])[0], P([0, 446])[1] + 30, 'light energy', 'cel-mn cel-halo')}
    ${lab(P([CPX, 0])[0], P([0, 566])[1], 'chloroplast', 'co2k-il cel-halo')}`;
}

/* r1 · night | day side by side: the same cell twice */
function r1(): string {
  const p = 'fcc13r1', s = 388 / LWIN[2], y0 = 92;
  const n = lfCell(`${p}-n`, true, 8, y0, s, `${granaL(false, p)}${NIGHT_ARROWS}`);
  const d = lfCell(`${p}-d`, false, 404, y0, s, `${granaL(true, p)}${DAY_ARROWS}`);
  return svg('The same mesophyll cell of a CAM plant twice, as in the animation: the epidermis with a stoma on the left, the air space, the cell with its chloroplast, the cytosol and the vacuole. Left, night, darker, a moon: the stoma is open; CO2 enters, becomes HCO3- and is fixed by PEPC into a C4 acid, which goes into the vacuole as malic acid, drawn with a sleeping face and small z. RuBisCO is grey, idle. Right, day, a sun: the stoma is shut; the thylakoids in the chloroplast glow with light and give ATP and NADPH; its malic acid leaves the vacuole and releases the CO2, which goes to RuBisCO. PEPC is grey, idle.', `
    ${heads(p)}<defs>${glowDefs(p)}</defs>
    <g class="dk1 co2k">
      ${moonG([30, 58], 14)}${T(54, 68, 'night', 'fcc-h', 'start')}${T(126, 68, 'stoma open', 'fcc-l', 'start')}
      ${sun([426, 58], 12)}${T(456, 68, 'day', 'fcc-h', 'start')}${T(510, 68, 'stoma shut', 'fcc-l', 'start')}
      ${n.svg}${d.svg}${nightLabels(n.P, p)}${dayLabels(d.P, p)}
    </g>
    ${credit(792, 594, CR_LEAF, 'end')}`, 'cel lf');
}

/* r2 · a 24-hour band above one cell: night (1 stoma open, CO₂ in; 2 malic acid fills the vacuole, CO₂ asleep),
   day (3 stoma shut, light energy; 4 CO₂ wakes → RuBisCO); the steps numbered on the cell where they happen. */
function r2(): string {
  const p = 'fcc13r2', s = 0.72, y0 = 146, x0 = 400 - (LWIN[2] * s) / 2;
  const both = `${granaL(true, p)}${arrow([[78, 340], ...C4.co2In.slice(0, -1), [470, 100], [516, 140]], 'gas', { halo: true })}
    ${arrow([[548, 226], [562, 300], [558, 370], [550, 416]], 'c', { halo: true })}
    ${arrow([[456, 384], [446, 364], [436, 352]], 'c', { thin: true })}${arrow([[396, 340], [380, 340], [364, 340]], 'gas', { halo: true })}
    ${arrow([[CPX - 22, 428], [CPX - 14, 380]], 'atp', { thin: true })}${arrow([[CPX + 26, 428], [CPX + 14, 380]], 'atp', { thin: true })}`;
  const c = lfCell(`${p}-c`, true, x0, y0, s, both, { tint: false, lit: ['stoma', 'pepc', 'vac', 'm-cp', 'm-rub'] });
  const P = c.P, v0 = P([VCX, VAC[1]])[1];
  const num = (q: Pt, k: number, night: boolean): string =>
    `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="13"${sty(`fill:${night ? '#3f4a6a' : '#f6c453'};stroke:${night ? '#2a3350' : '#d39a14'};stroke-width:1.6`)}/>${T(q[0], q[1] + 5.5, String(k), 'co2k-ilb', 'middle').replace('class="', `style="fill:${night ? '#fff' : '#141413'};font-size:15px" class="`)}`;
  const bx0 = 24, bx1 = 776, bm = 400, by = 26, bh = 98;
  const step = (x: number, k: number, night: boolean, l1: string, l2: string): string =>
    `${num([x, by + 54], k, night)}${T(x + 20, by + 59, l1, 'co2k-il', 'start').replace('<text', '<text style="font-size:14px"')}${T(x + 20, by + 79, l2, 'co2k-il', 'start').replace('<text', '<text style="font-size:14px"')}`;
  const tags = `<g transform="translate(-34 0)">${GLYPH.atp()}</g>${T(0, 6, '+', 'co2k-il')}<g transform="translate(48 0)">${GLYPH.nadph()}</g>`;
  return svg('A band above one mesophyll cell of a CAM plant shows 24 hours: the night half on the left, darker, with a moon; the day half on the right with a sun; an arrow runs from dusk through the night to dawn and through the day to dusk, then back to the next night. Night: 1, the stoma is open and CO2 enters; 2, PEPC fixes it into a C4 acid, stored as malic acid in the vacuole (drawn with a sleeping face). Day: 3, the stoma is shut and light gives the thylakoids the energy, ATP and NADPH; 4, the malic acid leaves the vacuole and releases its CO2, which RuBisCO fixes. The numbers sit on the cell where each step happens.', `
    ${heads(p)}<defs>${glowDefs(p)}</defs>
    <g class="dk1 co2k">
      <rect x="${bx0}" y="${by}" width="${bm - bx0}" height="${bh}" rx="12"${sty(`fill:${NIGHT}`)}/><rect x="${bm}" y="${by}" width="${bx1 - bm}" height="${bh}" rx="12"${sty(`fill:${DAY}`)}/>
      <rect x="${bm - 14}" y="${by}" width="28" height="${bh}"${sty(`fill:${NIGHT}`)}/><rect x="${bm}" y="${by}" width="14" height="${bh}"${sty(`fill:${DAY}`)}/>
      ${moonG([bx0 + 28, by + 22], 11)}${T(bx0 + 48, by + 29, 'night', 'co2k-ilb', 'start')}
      ${sun([bm + 26, by + 22], 10)}${T(bm + 52, by + 29, 'day', 'co2k-ilb', 'start')}
      ${T(bx0 + 10, by + bh + 22, 'dusk', 'co2k-il', 'start')}${T(bm, by + bh + 22, 'dawn', 'co2k-il')}${T(bx1 - 10, by + bh + 22, 'dusk', 'co2k-il', 'end')}
      ${arrow([[bx0 + 56, by + bh + 16], [bm - 30, by + bh + 16]], 'c', { thin: true })}${arrow([[bm + 30, by + bh + 16], [bx1 - 50, by + bh + 16]], 'c', { thin: true })}
      ${step(bx0 + 18, 1, true, 'stoma open:', 'CO₂ in → PEPC')}${step(bx0 + 196, 2, true, 'malic acid stored', 'in the vacuole')}
      ${step(bm + 18, 3, false, 'stoma shut; light:', 'ATP + NADPH')}${step(bm + 196, 4, false, 'malic acid → CO₂', '→ RuBisCO')}
      ${c.svg}
      ${lab(P([PORE[0], 272])[0], P([0, 272])[1], 'stoma')}
      ${kidAt(`${p}-kn`, P([200, 214]), 9, 'h')}
      ${lab(P([484, 0])[0], P([0, 190])[1], 'PEPC', 'co2k-il cel-halo', 'end')}
      ${acidFace([P([464, 0])[0], v0 - 6], 9.6, false)}
      ${lab(P([VCX, 0])[0], v0 + 26, 'malic acid', 'cel-mn cel-halo')}${acidFace([P([VCX - 10, 0])[0], v0 + 58], 9.6, true)}
      ${lab(P([VCX, 0])[0], v0 + 98, 'vacuole', 'co2k-il cel-halo')}
      ${kidAt(`${p}-kd`, P([430, 330]), 9, 's')}
      ${lab(P([CPX, 0])[0], P([0, 290])[1], 'RuBisCO', 'co2k-il cel-halo')}
      ${at(P([CPX + 6, 446]), tags, 0.86)}${lab(P([CPX, 0])[0], P([0, 566])[1], 'chloroplast', 'co2k-il cel-halo')}
      ${num([P([PORE[0], 0])[0] + 30, P([0, 380])[1]], 1, true)}${num([P([VAC[0], 0])[0] - 4, v0 + 58], 2, true)}
      ${num([P([MCP[0], 0])[0] - 8, P([0, 446])[1]], 3, false)}${num([P([430, 0])[0] + 40, P([0, 330])[1] - 4], 4, false)}
    </g>
    ${credit(792, 594, CR_LEAF, 'end')}`, 'cel lf');
}
