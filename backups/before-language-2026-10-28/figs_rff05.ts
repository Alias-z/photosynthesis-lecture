// Slide C5 · Rubisco: carboxylation and oxygenation. Figures of the rf chunk (overnight build 28 Oct 2026); text in ./rf05.ts.
// New variants v1–v12 first (no picks on C5), then the earlier figures of ./c05.ts by their own ids.
// Approaches: whole schema with C5 lit (v1–v4, v11, v12; ./rf-schema.ts) · real structure with drawn reactions (v5, our
// render of PDB 8RUC, scripts/rf_rubisco_render.mjs) · real figures (v7 Forrester et al. 1966 Fig. 2; v8 Sage, Sage &
// Kocacinar 2012 Fig. 4) · data redrawn (v6 the published fits of Forrester 1966 Fig. 2; v9 Jordan & Ogren 1984) · drawing
// (v10). Numbers used, and no others: Forrester 1966 fits Y = 56.45 e^(−0.02 X) at 275 ppm CO₂ and Y = 24.29 e^(−0.02 X) − 10
// at 73 ppm (µg CO₂ min⁻¹ per soybean leaf, X = % O₂), printed in their Fig. 2; spinach Rubisco CO₂/O₂ specificity ≈ 160
// at 5 °C and ≈ 50 at 40 °C, kinetics 2/3 and solubility 1/3 of the temperature effect (Jordan & Ogren 1984, abstract).
// Credits: assets/SOURCES-rf.md.
import type { PlateText, Variant } from '../types';
import { draw as c05draw, VARIANTS as C05 } from './c05';
import { schemaSvg, LIT_C5 } from './rf-schema';
import { arrow, axes, balls, beads, beadsW, credit, crop, curve, fig, minimap, pentagon, pill, shot, T, TV, type Img, type Pt } from './rf-kit';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import forrPng from '../../assets/rf/forrester1966-fig2.png';
import sageJpg from '../../assets/rf/sage2012-fig4.jpg';

export const PLATE: PlateText = {
  n: 'C5',
  title: 'Rubisco: carboxylation and oxygenation',
  status: 'draft',
  lead: '',
  points: [],
  refs: [
    { label: 'Bowes, Ogren & Hageman 1971', url: 'https://doi.org/10.1016/0006-291X(71)90475-X' },
    { label: 'Flamholz et al. 2019', url: 'https://doi.org/10.1021/acs.biochem.9b00237' },
    { label: 'Busch et al. 2024', url: 'https://doi.org/10.1111/pce.14815' },
    { label: 'Forrester et al. 1966', url: 'https://doi.org/10.1104/pp.41.3.422' },
  ],
};

const NEW: Variant[] = [
  { id: 'v1', name: 'Schema (thesis look): the two reactions lit', anim: true },
  { id: 'v2', name: 'Schema (glow look): the two reactions lit', anim: true },
  { id: 'v3', name: 'Schema with the Rubisco structure (PDB 8RUC)', anim: true },
  { id: 'v4', name: 'Zoom on Rubisco, with a map of the whole schema', anim: true },
  { id: 'v5', name: 'Rubisco structure: one active site, CO₂ or O₂, two products' },
  { id: 'v6', name: 'O₂ lowers net CO₂ uptake: soybean, published fits redrawn (Forrester 1966)' },
  { id: 'v7', name: 'Forrester 1966 Fig. 2: the original scan, labelled' },
  { id: 'v8', name: 'Photorespiration/photosynthesis against temperature and CO₂ (Sage 2012 Fig. 4)' },
  // v9 (specificity at 5 vs 40 °C) unlisted 28 Oct 2026: warming moved to C5b; still drawable by id
  { id: 'v10', name: 'Carboxylation and oxygenation side by side, with carbon counts (drawn)' },
  { id: 'v11', name: 'Schema (line look): the two reactions lit' },
  { id: 'v12', name: 'Schema (flat look): the two reactions lit' },
];
export const VARIANTS: Variant[] = [...NEW, ...C05];

export function draw(id: string): string {
  switch (id) {
    case 'v1': return schemaSvg('thesis', LIT_C5, { id: 'rf5v1' });
    case 'v2': return schemaSvg('glow', LIT_C5, { id: 'rf5v2' });
    case 'v3': return schemaSvg('pdb', LIT_C5, { id: 'rf5v3' });
    case 'v4': return zoomSvg();
    case 'v5': return structureSvg();
    case 'v6': return forresterSvg();
    case 'v7': return forresterScanSvg();
    case 'v8': return sageSvg();
    case 'v9': return specificitySvg();
    case 'v10': return sideSvg();
    case 'v11': return schemaSvg('line', LIT_C5, { id: 'rf5v11' });
    case 'v12': return schemaSvg('flat', LIT_C5, { id: 'rf5v12' });
    default: return c05draw(id);
  }
}

/* v4 · zoom on the Rubisco region, the whole schema as a map in the corner */
function zoomSvg(): string {
  const view: [number, number, number, number] = [140, 280, 420, 315];
  return fig('rff05', 'Enlarged part of the schema: Rubisco with RuBP; CO2 and O2 arriving; carboxylation to PGA and oxygenation to PGA and 2-phosphoglycolate. A small map of the whole schema, top right, marks the enlarged part.', `
    ${crop('rf5v4c', 'thesis', LIT_C5, view, [0, 0, 800, 600], false)}
    ${minimap('rf5v4m', 'thesis', LIT_C5, 606, 14, 180, view)}
    ${credit(10, 18, 'after Zhang 2021 (MSc thesis), Fig. 2b', 'start')}`);
}

/* v5 · the 8RUC render: one active site, the two gases, the two products */
const RUB: Img = { href: rubPng, w: 548, h: 471 };
function structureSvg(): string {
  const r = shot('rf5v5r', RUB, 34, 128, 380);
  const site = r.at(317.6, 309.5);
  const co2: Pt = [96, 72], o2: Pt = [92, 552];
  const box = (y: number, h: number, k: string): string => `<rect class="rfk-panel ${k}" x="470" y="${y}" width="318" height="${h}" rx="14"/>`;
  return fig('rff05', 'Our space-filling render of spinach Rubisco (PDB 8RUC), eight large and eight small subunits, with one active site marked. CO2 from above and O2 from below both reach the same active site. Arrows lead to two boxes: carboxylation, RuBP plus CO2 gives 2 PGA; oxygenation, RuBP plus O2 gives PGA plus 2-phosphoglycolate.', `
    ${r.svg}
    <circle class="rfk-glow" cx="${site[0]}" cy="${site[1]}" r="30"/><circle class="rfk-site" cx="${site[0]}" cy="${site[1]}" r="17"/>
    ${balls(co2, 'OCO', 24)}${T(co2[0] - 44, co2[1] + 8, 'CO₂', 'rfk-m', 'end')}
    ${arrow([[co2[0] + 34, co2[1] + 24], [site[0] - 40, site[1] - 120], [site[0] - 12, site[1] - 22]], 'rfk-arg', 12)}
    ${balls(o2, 'OO', -18)}${T(o2[0] - 36, o2[1] + 8, 'O₂', 'rfk-m', 'end')}
    ${arrow([[o2[0] + 30, o2[1] - 16], [site[0] - 30, site[1] + 110], [site[0] - 8, site[1] + 22]], 'rfk-arg', 12)}
    ${pill(site[0] + 4, 82, 'active site', [site[0] + 4, site[1] - 20])}
    ${T(224, 478, 'Rubisco', 'rfk-h', 'middle')}
    ${box(150, 140, '')}${T(490, 190, 'carboxylation', 'rfk-h')}${T(490, 232, 'RuBP + CO₂', 'rfk-m')}${T(490, 266, '→ 2 PGA', 'rfk-m')}
    ${box(340, 160, '')}${T(490, 380, 'oxygenation', 'rfk-ho')}${T(490, 422, 'RuBP + O₂', 'rfk-m')}${T(490, 456, '→ PGA +', 'rfk-m')}${T(490, 486, '2-phosphoglycolate', 'rfk-m')}
    ${arrow([[site[0] + 22, site[1] - 12], [400, 230], [462, 218]], 'rfk-ar', 13)}
    ${arrow([[site[0] + 22, site[1] + 12], [400, 400], [462, 414]], 'rfk-aro', 13)}
    ${credit(794, 594, 'structure: PDB 8RUC (Andersson 1996), our render')}`);
}

/* v6 · Forrester et al. 1966 Fig. 2: the two published fits, redrawn */
function forresterSvg(): string {
  const b: [number, number, number, number] = [150, 40, 760, 470];
  const X = (o: number): number => b[0] + (o / 100) * (b[2] - b[0]);
  const Y = (a: number): number => b[3] - ((a + 10) / 70) * (b[3] - b[1]);
  const hi = (o: number): number => 56.45 * Math.exp(-0.02 * o), lo = (o: number): number => 24.29 * Math.exp(-0.02 * o) - 10;
  const pts = (g: (o: number) => number): Pt[] => Array.from({ length: 21 }, (_, i) => [X(i * 5), Y(g(i * 5))] as Pt);
  return fig('rff05', 'Redrawn from Forrester, Krotkov and Nelson 1966, figure 2: net CO2 uptake of soybean leaves against the O2 concentration from 0 to 100 percent, as the two exponential fits printed in the figure. At 275 ppm CO2 uptake falls from 56 to 8 micrograms per minute per leaf; at 73 ppm it falls from 14 to below zero, a net release, above about 44 percent O2. A dashed line marks air, 21 percent O2.', `
    ${axes(b, X, Y, [[0, '0'], [20, '20'], [40, '40'], [60, '60'], [80, '80'], [100, '100']], [[-10, '−10'], [0, '0'], [10, '10'], [20, '20'], [30, '30'], [40, '40'], [50, '50'], [60, '60']],
      'O₂ (%)', 'net CO₂ uptake (µg CO₂ min⁻¹ per leaf)', { zero: true })}
    <path class="rfk-mk" d="M${X(21)},${b[1] + 30}V${b[3]}"/>
    ${pill(X(21) + 6, b[1] + 14, 'air: 21 % O₂')}
    ${curve(pts(hi), 'rfk-cv rfk-cv-k')}${curve(pts(lo), 'rfk-cv rfk-cv-o')}
    ${T(X(46), Y(hi(46)) - 22, '275 ppm CO₂', 'rfk-h', 'start')}
    ${T(X(52), Y(lo(52)) + 40, '73 ppm CO₂', 'rfk-ho', 'start')}
    ${T(b[2] - 8, Y(0) - 10, 'uptake', 'rfk-s', 'end')}${T(b[2] - 8, Y(0) + 26, 'release', 'rfk-s', 'end')}
    ${credit(794, 594, 'redrawn: the fits printed in Forrester, Krotkov & Nelson 1966, Plant Physiol 41:422, Fig. 2 (soybean)')}`);
}

/* v7 · the original scan, labelled */
const FORR: Img = { href: forrPng, w: 355, h: 457 };
function forresterScanSvg(): string {
  const r = shot('rf5v7', FORR, 206, 12, 388, { fig: true });
  const p = (o: number, a: number): Pt => r.at(70 + 2.55 * o, 311 - 4.77 * a);
  return fig('rff05', 'Forrester, Krotkov and Nelson 1966, figure 2, the original scan: soybean leaves, rate of CO2 absorption or production against O2 concentration, at 275 and 73 ppm CO2. Uptake falls as O2 rises; at 73 ppm the leaf releases CO2 above about 44 percent O2.', `
    ${r.svg}
    <path class="rfk-mk" d="M${f1(p(21, 60)[0])},${f1(p(21, 58)[1])}V${f1(p(21, -24)[1])}"/>
    ${pill(686, 230, '275 ppm CO₂', p(62, 56.45 * Math.exp(-0.02 * 62)))}
    ${pill(686, 470, '73 ppm CO₂', p(80, 24.29 * Math.exp(-0.02 * 80) - 10))}
    ${pill(p(21, 60)[0] + 8, 26, 'air: 21 % O₂')}
    ${T(p(50, 0)[0], r.h + 44, 'O₂ (%)', 'rfk-at', 'middle')}
    ${credit(794, 594, 'Forrester, Krotkov & Nelson 1966, Plant Physiol 41:422, Fig. 2 · © ASPB, free in PMC')}`);
}
const f1 = (v: number): string => v.toFixed(1);

/* v8 · Sage, Sage & Kocacinar 2012 Fig. 4 */
const SAGE: Img = { href: sageJpg, w: 1113, h: 1040 };
function sageSvg(): string {
  const r = shot('rf5v8', SAGE, 120, 8, 560, { fig: true });
  return fig('rff05', 'Sage, Sage and Kocacinar 2012, figure 4: modelled ratio of photorespiration to photosynthesis in a C3 leaf, as a surface over chloroplast CO2 from 0 to 600 micromol per mol and leaf temperature from 0 to 40 degrees. The ratio rises with temperature and falls with CO2; white dots mark typical C3 leaves at current CO2, the ring hot soils with low humidity.', `
    ${r.svg}
    ${pill(200, 40, 'photorespiration / photosynthesis')}
    ${pill(196, 556, 'chloroplast CO₂')}${pill(700, 440, 'leaf temperature')}
    ${credit(794, 594, 'Sage, Sage & Kocacinar 2012, Annu Rev Plant Biol 63:19, Fig. 4 (model)')}`);
}

/* v9 · specificity at two temperatures (Jordan & Ogren 1984) */
function specificitySvg(): string {
  const b: [number, number, number, number] = [180, 60, 540, 430];
  const Y = (v: number): number => b[3] - (v / 180) * (b[3] - b[1]);
  const X = (i: number): number => b[0] + 90 + i * 180;
  const bar = (i: number, v: number, k: string): string => `<rect class="rfk-bar-${k}" x="${X(i) - 55}" y="${f1(Y(v))}" width="110" height="${f1(b[3] - Y(v))}" rx="4"/>${T(X(i), Y(v) - 14, `≈ ${v}`, 'rfk-big', 'middle')}`;
  const share = (x: number, y: number): string => `<rect class="rfk-bar-k" x="${x}" y="${y}" width="${160}" height="30" rx="4"/><rect class="rfk-bar-a" x="${x + 160}" y="${y}" width="80" height="30" rx="4"/>`;
  return fig('rff05', 'Bar chart after Jordan and Ogren 1984: the CO2/O2 specificity of spinach Rubisco is about 160 at 5 degrees and about 50 at 40 degrees. A second bar to the right splits the rise of photorespiration with temperature: two thirds from Rubisco kinetics, one third from CO2 dissolving less well than O2.', `
    <path class="rfk-axis" d="M${b[0]},${b[1]}V${b[3]}H${b[2]}"/>
    ${[0, 50, 100, 150].map(v => `<path class="rfk-tk" d="M${b[0]},${f1(Y(v))}h-7"/>${T(b[0] - 12, Y(v) + 6, `${v}`, 'rfk-ax', 'end')}`).join('')}
    ${TV(b[0] - 62, (b[1] + b[3]) / 2, 'CO₂/O₂ specificity of Rubisco')}
    ${bar(0, 160, 'k')}${bar(1, 50, 'o')}
    ${T(X(0), b[3] + 32, '5 °C', 'rfk-h', 'middle')}${T(X(1), b[3] + 32, '40 °C', 'rfk-h', 'middle')}
    ${T((b[0] + b[2]) / 2, b[3] + 64, 'spinach Rubisco', 'rfk-s', 'middle')}
    ${T(576, 220, 'warming raises', 'rfk-m')}${T(576, 246, 'oxygenation by:', 'rfk-m')}
    ${share(576, 274)}
    ${T(576, 334, 'Rubisco', 'rfk-l')}${T(576, 358, 'kinetics ⅔', 'rfk-l')}${T(816 - 24, 334, 'CO₂ : O₂', 'rfk-l', 'end')}${T(816 - 24, 358, 'solubility ⅓', 'rfk-l', 'end')}
    ${credit(794, 594, 'data: Jordan & Ogren 1984, Planta 161:308 (abstract)')}`);
}

/* v10 · the two reactions side by side, with carbon beads */
function sideSvg(): string {
  const col = (cx: number, ox: boolean): string => {
    const head = ox ? T(cx, 60, 'oxygenation', 'rfk-ho', 'middle') : T(cx, 60, 'carboxylation', 'rfk-h', 'middle');
    const rub = `${pentagon([cx - 70, 136], 36)}${T(cx - 4, 146, '+', 'rfk-big', 'middle')}${ox ? balls([cx + 66, 136], 'OO') : balls([cx + 66, 136], 'OCO')}`;
    const b5 = `${beads(cx - 70 - beadsW(5) / 2 + 11, 200, 5)}${ox ? '' : beads(cx + 66 - 11, 200, 1)}`;
    const lab = `${T(cx - 70, 236, '5 C', 'rfk-s', 'middle')}${T(cx + 66, 236, ox ? '0 C' : '1 C', 'rfk-s', 'middle')}`;
    const ar = arrow([[cx, 262], [cx, 330]], ox ? 'rfk-aro' : 'rfk-ar', 14) + T(cx + 14, 304, 'Rubisco', 'rfk-s');
    const prod = ox
      ? `${T(cx - 76, 376, 'PGA', 'rfk-h', 'middle')}${T(cx, 376, '+', 'rfk-h', 'middle')}${T(cx + 82, 376, '2-phospho-', 'rfk-ho', 'middle')}${T(cx + 82, 402, 'glycolate', 'rfk-ho', 'middle')}
         ${beads(cx - 76 - beadsW(3) / 2 + 11, 436, 3)}${beads(cx + 82 - beadsW(2) / 2 + 11, 436, 2, 'o')}${T(cx - 76, 472, '3 C', 'rfk-s', 'middle')}${T(cx + 82, 472, '2 C', 'rfk-s', 'middle')}`
      : `${T(cx - 70, 376, 'PGA', 'rfk-h', 'middle')}${T(cx, 376, '+', 'rfk-h', 'middle')}${T(cx + 70, 376, 'PGA', 'rfk-h', 'middle')}
         ${beads(cx - 70 - beadsW(3) / 2 + 11, 436, 3)}${beads(cx + 70 - beadsW(3) / 2 + 11, 436, 3)}${T(cx - 70, 472, '3 C', 'rfk-s', 'middle')}${T(cx + 70, 472, '3 C', 'rfk-s', 'middle')}`;
    const to = ox
      ? arrow([[cx + 82, 492], [cx + 82, 536]], 'rfk-aro', 12) + T(cx + 82, 566, 'photorespiration', 'rfk-ho', 'middle')
      : arrow([[cx, 492], [cx, 536]], 'rfk-ar', 12) + T(cx, 566, 'Calvin–Benson–Bassham cycle', 'rfk-h', 'middle');
    return head + rub + b5 + lab + ar + prod + to;
  };
  return fig('rff05', 'Drawing: the two reactions of Rubisco side by side. Left, carboxylation: RuBP, 5 carbons, plus CO2, 1 carbon, gives two PGA of 3 carbons each, which stay in the Calvin–Benson–Bassham cycle. Right, oxygenation: RuBP plus O2, no carbon, gives one PGA, 3 carbons, and one 2-phosphoglycolate, 2 carbons, which goes to photorespiration. Carbon atoms are drawn as beads.', `
    <path class="rfk-grid" d="M400,40V580"/>
    ${col(200, false)}${col(600, true)}`);
}
