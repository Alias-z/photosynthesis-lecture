// Slide C7 · Light-response curve (pick key C8). Figures of the rf chunk (overnight build 28 Oct 2026); text in ./rf07.ts.
// New variants v1–v10 first (no picks under C8), then the earlier figures of ./l15.ts by their own ids.
// Approaches: whole schema with the light reactions' supply of ATP and NADPH to RuBP regeneration lit (v1–v4, v10;
// ./rf-schema.ts) · real figures (v5 Huang, Zhang & Hu 2014 Fig. 1C; v7 Boardman 1977 Fig. 1; v8 Gaastra 1959 Fig. 12A) ·
// data redrawn (v6 Huang 2014) · combination (v9 schema crop + redrawn curve).
// Numbers used, and no others: tobacco sun and shade leaves (≈ 95 % and ≈ 28 % of sunlight), net CO₂ uptake read off
// Huang et al. 2014 Fig. 1C at 0–2000 µmol m⁻² s⁻¹ (21.8 and 13.1 at 2000, their text), light compensation points 32 and
// 20 µmol m⁻² s⁻¹ (their Table 1); Boardman's units: 1 nE cm⁻² s⁻¹ = 10 µmol m⁻² s⁻¹. Credits: assets/SOURCES-rf.md.
import type { PlateText, Variant } from '../types';
import { draw as l15draw, VARIANTS as L15 } from './l15';
import { schemaSvg, LIT_C7 } from './rf-schema';
import { axes, credit, crop, curve, fig, minimap, pill, shot, T, type Img, type Pt } from './rf-kit';
import huangJpg from '../../assets/rf/huang2014-fig1c.jpg';
import boardPng from '../../assets/rf/boardman1977-fig1.png';
import gaastraPng from '../../assets/rf/gaastra1959-fig12.png';

export const PLATE: PlateText = {
  n: 'C7',
  title: 'Light-response curve',
  status: 'draft',
  lead: '',
  points: [],
  refs: [
    { label: 'Huang, Zhang & Hu 2014', url: 'https://doi.org/10.3389/fpls.2014.00688' },
    { label: 'Ehleringer & Björkman 1977', url: 'https://doi.org/10.1104/pp.59.1.86' },
    { label: 'Busch et al. 2024', url: 'https://doi.org/10.1111/pce.14815' },
    { label: 'Boardman 1977', url: 'https://doi.org/10.1146/annurev.pp.28.060177.002035' },
    { label: 'Gaastra 1959', url: 'https://edepot.wur.nl/291215' },
  ],
};

const NEW: Variant[] = [
  { id: 'v1', name: 'Schema (thesis look): light → ATP + NADPH → RuBP regeneration lit', anim: true },
  { id: 'v2', name: 'Schema (glow look): the light supply lit', anim: true },
  { id: 'v3', name: 'Schema with the thylakoid complexes (structures of slides 7–10b)', anim: true },
  { id: 'v4', name: 'Zoom on the light supply, with a map of the whole schema', anim: true },
  { id: 'v5', name: 'Tobacco sun and shade leaves (Huang 2014 Fig. 1C), terms labelled' },
  { id: 'v6', name: 'Sun and shade light-response curves redrawn, with the three terms' },
  { id: 'v7', name: 'Atriplex grown in high, intermediate and low light (Boardman 1977)' },
  { id: 'v8', name: 'History: Gaastra 1959, the first leaf light curves at several CO₂ levels' },
  { id: 'v9', name: 'Schema crop beside the curve: light-limited part = ATP + NADPH supply' },
  { id: 'v10', name: 'Schema (line look): the light supply lit' },
];
export const VARIANTS: Variant[] = [...NEW, ...L15];

export function draw(id: string): string {
  switch (id) {
    case 'v1': return schemaSvg('thesis', LIT_C7, { id: 'rf7v1' });
    case 'v2': return schemaSvg('glow', LIT_C7, { id: 'rf7v2' });
    case 'v3': return schemaSvg('pdb', LIT_C7, { id: 'rf7v3' });
    case 'v4': return zoomSvg();
    case 'v5': return huangSvg();
    case 'v6': return redrawSvg();
    case 'v7': return boardmanSvg();
    case 'v8': return gaastraSvg();
    case 'v9': return comboSvg();
    case 'v10': return schemaSvg('line', LIT_C7, { id: 'rf7v10' });
    default: return l15draw(id);
  }
}

/* Huang, Zhang & Hu 2014 Fig. 1C, read off the figure (µmol m⁻² s⁻¹): PPFD → net CO₂ uptake */
const PPFD = [0, 20, 50, 100, 200, 300, 500, 800, 1200, 1600, 2000];
const SUN = [-2.2, -0.8, 1.4, 4.3, 8.8, 12.4, 16.7, 19.7, 21.1, 21.8, 21.8];
const SHADE = [-1.0, 0.0, 1.8, 3.9, 6.7, 8.6, 10.4, 11.6, 12.3, 12.9, 13.1];

/* v4 · zoom on the light supply */
function zoomSvg(): string {
  const view: [number, number, number, number] = [40, 44, 640, 480];
  return fig('rff07', 'Enlarged part of the schema: light reaches the thylakoid, which supplies ATP and NADPH to the reduction of PGA to triose phosphate; 5 of 6 triose phosphates regenerate RuBP, with ATP. A small map of the whole schema, bottom right, marks the enlarged part.', `
    ${crop('rf7v4c', 'thesis', LIT_C7, view, [0, 0, 800, 600], false)}
    ${minimap('rf7v4m', 'thesis', LIT_C7, 14, 14, 170, view)}
    ${credit(794, 594, 'after Zhang 2021 (MSc thesis), Fig. 2b')}`);
}

/* v5 · the real figure */
const HUANG: Img = { href: huangJpg, w: 1156, h: 895 };
function huangSvg(): string {
  const r = shot('rf7v5', HUANG, 40, 30, 600, { fig: true });
  const P = (q: number, a: number): Pt => r.at(263 + q * 0.4170, 589 - a * 22.35);
  return fig('rff07', 'Huang, Zhang and Hu 2014, figure 1C: net CO2 uptake of tobacco leaves against light, 0 to 2000 micromol photons per square metre and second. Sun leaves, open circles, rise to about 22; shade leaves, filled circles, level off at about 13. Labels mark the quantum yield as the initial slope, the light compensation point where uptake crosses zero, and light saturation.', `
    ${r.svg}
    ${pill(728, 70, 'sun leaves', P(1600, 21.8))}
    ${pill(724, 360, 'shade leaves', P(2000, 13.1))}
    ${pill(P(1150, 6)[0], P(1150, 6)[1], 'quantum yield: initial slope', P(160, 6.6))}
    ${pill(P(1000, -2.6)[0], P(1000, -2.6)[1], 'light compensation point', P(28, 0))}
    ${pill(P(700, 24.6)[0], P(700, 24.6)[1], 'light saturation', P(1200, 21.6))}
    ${credit(794, 594, 'Huang, Zhang & Hu 2014, Front Plant Sci 5:688, Fig. 1C (tobacco; CC BY 4.0)')}`);
}

/* v6 · the same data redrawn */
function redrawSvg(): string {
  const b: [number, number, number, number] = [140, 40, 740, 470];
  const X = (q: number): number => b[0] + (q / 2000) * (b[2] - b[0]);
  const Y = (a: number): number => b[3] - ((a + 5) / 30) * (b[3] - b[1]);
  const line = (v: number[]): Pt[] => PPFD.map((q, i) => [X(q), Y(v[i])] as Pt);
  const dots = (v: number[], k: string): string => PPFD.map((q, i) => `<circle class="rfk-dot rfk-dot-${k}" cx="${X(q).toFixed(1)}" cy="${Y(v[i]).toFixed(1)}" r="6.5"/>`).join('');
  // initial slope of the sun curve through its first points (0 → 100 µmol m⁻² s⁻¹)
  const s0 = (SUN[3] - SUN[0]) / 100;
  return fig('rff07', 'Redrawn from Huang, Zhang and Hu 2014, figure 1C: net CO2 uptake of tobacco sun and shade leaves against light. The dashed line follows the initial slope, the quantum yield; uptake crosses zero at the light compensation point, 32 for sun and 20 for shade leaves; it levels off at about 22 in sun and 13 in shade leaves.', `
    ${axes(b, X, Y, [[0, '0'], [500, '500'], [1000, '1000'], [1500, '1500'], [2000, '2000']], [[-5, '−5'], [0, '0'], [5, '5'], [10, '10'], [15, '15'], [20, '20'], [25, '25']],
      'light, PPFD (µmol photons m⁻² s⁻¹)', 'net CO₂ uptake (µmol m⁻² s⁻¹)', { zero: true })}
    <path class="rfk-mk" d="M${X(0).toFixed(1)},${Y(SUN[0]).toFixed(1)}L${X(400).toFixed(1)},${Y(SUN[0] + s0 * 400).toFixed(1)}"/>
    ${curve(line(SUN), 'rfk-cv rfk-cv-k')}${curve(line(SHADE), 'rfk-cv rfk-cv-g')}
    ${dots(SUN, 'w')}${dots(SHADE, 'k')}
    ${T(X(2000), Y(21.8) - 18, 'sun leaves', 'rfk-h', 'end')}${T(X(2000), Y(13.1) - 18, 'shade leaves', 'rfk-h', 'end')}
    ${pill(X(400) + 88, Y(SUN[0] + s0 * 400) + 4, 'quantum yield')}
    ${pill(X(260) + 96, Y(-3.4), 'light compensation point', [X(30), Y(0)])}
    ${pill(X(1100), Y(25.6), 'light saturation')}
    ${credit(794, 594, 'redrawn from Huang, Zhang & Hu 2014, Front Plant Sci 5:688, Fig. 1C (tobacco; CC BY 4.0)')}`);
}

/* v7 · Boardman 1977 Fig. 1 */
const BOARD: Img = { href: boardPng, w: 1600, h: 1422 };
function boardmanSvg(): string {
  const r = shot('rf7v7', BOARD, 20, 24, 560, { fig: true, win: [0, 0, 1600, 1215] });
  return fig('rff07', 'Boardman 1977, figure 1, data of Björkman et al.: light-saturation curves of Atriplex patula grown in high, intermediate and low light. All three rise with the same initial slope; plants grown in high light level off at about 20, in low light at about 4 micromol CO2 per square decimetre and minute.', `
    ${r.svg}
    ${pill(690, 74, 'grown in high light', r.at(1460, 132))}
    ${pill(690, 186, 'intermediate light', r.at(1460, 378))}
    ${pill(690, 326, 'low light', r.at(1460, 812))}
    ${T(300, 506, '1 nE cm⁻² s⁻¹ = 10 µmol m⁻² s⁻¹', 'rfk-s', 'middle')}
    ${credit(794, 594, 'Boardman 1977, Annu Rev Plant Physiol 28:355, Fig. 1 (Atriplex patula; data of Björkman et al. 1972)')}`);
}

/* v8 · Gaastra 1959 Fig. 12A, spinach */
const GAAS: Img = { href: gaastraPng, w: 970, h: 880 };
function gaastraSvg(): string {
  const r = shot('rf7v8', GAAS, 50, 40, 540, { fig: true, win: [0, 0, 478, 340] });
  return fig('rff07', 'Gaastra 1959, figure 12A: photosynthesis of spinach leaves against light at four CO2 concentrations, 0.017, 0.030, 0.061 and 0.10 to 0.15 percent. At each CO2 level photosynthesis levels off; more CO2 raises the level at which it saturates.', `
    ${r.svg}
    ${pill(690, 96, '0.10–0.15 % CO₂', r.at(352, 86))}
    ${pill(690, 166, '0.061 %', r.at(352, 125))}
    ${pill(690, 246, '0.030 % ≈ air', r.at(356, 201))}
    ${pill(690, 318, '0.017 %', r.at(352, 238))}
    ${T(320, 462, 'light (10⁴ erg s⁻¹ cm⁻²)', 'rfk-at', 'middle')}
    ${T(320, 498, 'photosynthesis P (mm³ CO₂ cm⁻² h⁻¹)', 'rfk-s', 'middle')}
    ${credit(794, 594, 'Gaastra 1959, Meded Landbouwhogeschool Wageningen 59(13), Fig. 12A (spinach, 21–24 °C)')}`);
}

/* v9 · schema crop beside the curve */
function comboSvg(): string {
  const view: [number, number, number, number] = [104, 52, 446, 520];
  const b: [number, number, number, number] = [526, 70, 756, 420];
  const X = (q: number): number => b[0] + (q / 2000) * (b[2] - b[0]);
  const Y = (a: number): number => b[3] - ((a + 5) / 30) * (b[3] - b[1]);
  const pts = PPFD.map((q, i) => [X(q), Y(SUN[i])] as Pt);
  return fig('rff07', 'Left, part of the schema: light reaches the thylakoid, which supplies ATP and NADPH to the reduction of PGA and the regeneration of RuBP. Right, the light-response curve of tobacco sun leaves (Huang et al. 2014): in dim light, marked amber, the supply of ATP and NADPH limits CO2 uptake; in bright light uptake levels off, limited by the Calvin–Benson–Bassham cycle.', `
    ${crop('rf7v9c', 'thesis', LIT_C7, view, [6, 44, 404, 471], true)}
    <rect class="rfk-band-a" x="${b[0]}" y="${b[1]}" width="${(X(300) - b[0]).toFixed(1)}" height="${b[3] - b[1]}"/>
    ${axes(b, X, Y, [[0, '0'], [1000, '1000'], [2000, '2000']], [[0, '0'], [10, '10'], [20, '20']], 'light (µmol m⁻² s⁻¹)', 'CO₂ uptake (µmol m⁻² s⁻¹)', { zero: true })}
    ${curve(pts.slice(0, 6), 'rfk-cv rfk-cv-a')}${curve(pts.slice(5), 'rfk-cv rfk-cv-k')}
    ${pill(612, 476 + 40, 'dim light: ATP + NADPH limit', [X(150), Y(6)], 'rfk-ka')}
    ${pill(664, 46, 'bright light: the cycle limits', [X(1500), Y(21.6)])}
    ${credit(794, 594, 'schema after Zhang 2021, Fig. 2b · curve: Huang, Zhang & Hu 2014, Fig. 1C (tobacco sun leaves)')}`);
}
