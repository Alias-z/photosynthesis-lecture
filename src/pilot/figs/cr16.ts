// Slide C16 · Improving photosynthesis (slide 26), lecture day, 29 Oct 2026. One wide figure: 8 famous attempts, 2014 →
// 2025, one window each (lecturer: "way too much example … one sentence each … the picture should be from the
// publication … not figures and plots … 8 cases throughout the years and most famous one"; then "find better images of
// those eight famous cases … you can delete all the other variations"). Each window: year, name, one real photo or
// micrograph from the paper or its press release (never a plot or drawing), one sentence. Every number is the abstract's
// (Europe PMC records, read 29 Oct 2026). The earlier variants (w2 shelf, w grid, pairs j–m) are in
// backups/before-c16-w8-only-2026-10-29/cr16.ts.
//   - 2014 Lin MT … Hanson MR, Nature 513:547, doi 10.1038/nature13776: Synechococcus RuBisCO in tobacco, "higher rates
//     of CO2 fixation per unit of enzyme"; growth needs elevated CO₂ (full text). c16y-lin-tobacco.jpg (Fig. 3a–c).
//   - 2016 Kromdijk J … Long SP, Science 354:857, doi 10.1126/science.aai8878: dry matter "about 15%" (abstract), 14–20 %
//     in the field (Fig. 5A). c16w-kromdijk-field.jpg: RIPE press photo of the same field trial as Fig. 5D, Kromdijk
//     measuring at lower left (ripe.illinois.edu/node/433, 1280 × 853; crop x 150–1060, y 120–640).
//   - 2019 South PF … Ort DR, Science 363:eaat9077, doi 10.1126/science.aat9077: biomass ">40% in replicated field
//     trials" (abstract). cr-south-f3.jpg, Fig. 3A photo only (x 22–770, y 8–316). CC BY 4.0.
//   - 2020 Gunn LH, Martin Avila E, Birch R, Whitney SM, PNAS 117:25890, doi 10.1073/pnas.2011641117: red-type RuBisCO of
//     Rhodobacter sphaeroides in tobacco plastids; with its activase RsRca, photosynthesis and growth ">twofold" those of
//     plants without it (abstract), grown in air + 1 % CO₂ (Fig. 2 legend). c16w-gunn-tobacco.jpg: Fig. 2B photos (x 4–673,
//     y 141–449 of the 677 × 1259 PMC figure, PMC7568259); shown: the two 34-day photos, without and with the activase,
//     their lettering cut off. © the authors, for teaching.
//   - 2022 De Souza AP … Long SP, Science 377:851, doi 10.1126/science.adc9831: the same VPZ genes in soybean, seed yield
//     "increased by up to 33%" in replicated field trials (abstract). Science figures are bot-checked; c16w-desouza-
//     canopy.jpg is the RIPE press photo of the soybean canopy (ripe.illinois.edu/node/668, "Allie Arp/RIPE project").
//   - 2023 Chen T … Liu LN, Nat Commun 14:2118, doi 10.1038/s41467-023-37490-0: α-carboxysomes in tobacco chloroplasts
//     "support autotrophic growth … at elevated CO2" (abstract). c16-chen-cbx.jpg (Fig. 2d, TEM, red arrows; the full-size
//     panel of the 1501 × 1524 figure). CC BY 4.0.
//   - 2024 Tian J … Tian F, Nature (2024), doi 10.1038/s41586-024-07669-6: lac1, upright upper leaves; field trials at
//     four locations over four years: more grain at high planting density (abstract, Results; no % in the text).
//     c16w-tian-maize.jpg: Fig. 1a, upper part (x 32–552, y 3–353 of the 2120 × 1153 figure). © Springer Nature.
//   - 2025 Lin X … Peng X, Plant Biotechnol J 23:2526, doi 10.1111/pbi.70076: GOC bypass in potato, "yield per plant
//     increased by 21.3%-69.2%" in field trials (abstract). c16n-potato-goc.jpg, Fig. 2c, WT and GOC-1 (the PMC figure,
//     709 px wide, is the largest copy; the paper has no plant photo). CC BY 4.0.
// Not used: Wei S … Zhou W 2022, Science 377:eabi8455 (OsDREB1C rice, yield +41.3–68.3 %) and Shao N … 2026, Cell,
// doi 10.1016/j.cell.2026.05.042 (MBS1 "sunscreen" rice): their figure pages are bot-checked.
import { shot, type Box, type Img } from './cr-common';
import type { PlateText, Variant } from '../types';
import potJpg from '../../assets/photos/c16n-potato-goc.jpg';
import lin14Jpg from '../../assets/photos/c16y-lin-tobacco.jpg';
import kroJpg from '../../assets/photos/c16w-kromdijk-field.jpg';
import souJpg from '../../assets/photos/cr-south-f3.jpg';
import cheJpg from '../../assets/photos/c16-chen-cbx.jpg';
import gunnJpg from '../../assets/photos/c16w-gunn-tobacco.jpg';
import soyJpg from '../../assets/photos/c16w-desouza-canopy.jpg';
import tianJpg from '../../assets/photos/c16w-tian-maize.jpg';

export const PLATE: PlateText = {
  n: 'C16',
  title: 'Improving photosynthesis',
  status: 'draft',
  lead: 'There are many ways to improve photosynthesis.',
  points: [
    { claim: 'More light and CO₂ into the leaf.', text: 'Upright leaves, faster stomata and extra CO₂ channels' },
    { claim: 'More CO₂ at RuBisCO.', text: 'More carboxysomes, and bigger bundle-sheath chloroplasts as a step towards C₄ rice' },
    { claim: 'A sturdier chloroplast, less waste.', text: 'A heat-proof RuBisCO activase, membranes tuned to light, and a photorespiration shortcut' },
  ],
  refs: [
    { label: 'Lin 2014', url: 'https://doi.org/10.1038/nature13776' },
    { label: 'Kromdijk 2016', url: 'https://doi.org/10.1126/science.aai8878' },
    { label: 'South 2019', url: 'https://doi.org/10.1126/science.aat9077' },
    { label: 'Gunn 2020', url: 'https://doi.org/10.1073/pnas.2011641117' },
    { label: 'De Souza 2022', url: 'https://doi.org/10.1126/science.adc9831' },
    { label: 'Chen 2023', url: 'https://doi.org/10.1038/s41467-023-37490-0' },
    { label: 'Tian 2024', url: 'https://doi.org/10.1038/s41586-024-07669-6' },
    { label: 'Lin 2025', url: 'https://doi.org/10.1111/pbi.70076' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'w8', name: 'w8 · 8 famous cases, 2014 → 2025, one line each', wide: true },
];

/* ---------------------------------------------------------------- helpers */

type A = 'start' | 'middle' | 'end';
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;

/* ---------------------------------------------------------------- the 8 cases */

interface Case8 {
  year: string;
  name: string;
  im: Img;
  win?: Box;
  /** Instead of one window: windows of the same image stacked in a column, each with its label (lines) on the right. */
  panes?: Array<{ win: Box; label: string[] }>;
  /** The one sentence, broken by hand into lines that fit the window (checked in the browser). */
  line: string[];
  /** Labels on the image: [u, v] in image pixels, then the text. */
  labels?: Array<[number, number, string]>;
}
const CASES8: Case8[] = [
  {
    year: '2014', name: 'Cyanobacterial RuBisCO', im: { href: lin14Jpg, w: 1051, h: 740 },
    line: ['Tobacco ran on a faster RuBisCO from', 'cyanobacteria, but the plants grew', 'only in CO₂-rich air.'],
    labels: [[250, 40, 'wild type'], [800, 245, 'new RuBisCO']],
  },
  {
    year: '2016', name: 'Faster NPQ relaxation', im: { href: kroJpg, w: 910, h: 520 },
    line: ['Tobacco that relaxes NPQ faster when', 'shade falls made about 15 % more dry', 'matter in field trials.'],
  },
  {
    year: '2019', name: 'Photorespiration bypass', im: { href: souJpg, w: 775, h: 743 }, win: [22, 8, 748, 308],
    line: ['Rerouting photorespiration inside the', 'chloroplast gave tobacco over 40 %', 'more biomass in field trials.'],
    labels: [[115, 40, 'wild type'], [450, 40, 'bypass lines']],
  },
  {
    year: '2020', name: 'Red-type RuBisCO', im: { href: gunnJpg, w: 669, h: 308 },
    panes: [{ win: [0, 42, 332, 124], label: ['RuBisCO', 'alone'] }, { win: [343, 42, 326, 124], label: ['+ its own', 'activase'] }],
    line: ['Tobacco made a purple bacterium’s', 'RuBisCO; adding its own activase more', 'than doubled growth (in 1 % CO₂).'],
  },
  {
    year: '2022', name: 'Faster NPQ in soybean', im: { href: soyJpg, w: 1000, h: 562 },
    line: ['The same three genes as in 2016', 'raised soybean seed yield by up to', '33 % in field trials.'],
  },
  {
    year: '2023', name: 'Carboxysomes in tobacco', im: { href: cheJpg, w: 743, h: 624 },
    line: ['Tobacco chloroplasts packed RuBisCO', 'into bacterial protein shells (red', 'arrows); the plants grew in high CO₂.'],
  },
  {
    year: '2024', name: 'Smart-canopy maize', im: { href: tianJpg, w: 520, h: 350 },
    line: ['Upright upper leaves let light reach', 'the lower ones, so maize gave more', 'grain when planted densely.'],
    labels: [[105, 28, 'wild type'], [435, 28, it('lac1')]],
  },
  {
    year: '2025', name: 'Bypass, now in potato', im: { href: potJpg, w: 707, h: 182 }, win: [12, 28, 268, 154],
    line: ['A photorespiration shortcut in potato', 'chloroplasts raised tuber yield per', 'plant by 21–69 % in field trials.'],
  },
];
const CREDITS8 = [
  `Images: 2014 Lin et al., ${it('Nature')}, Fig. 3 (© Springer Nature) · 2016 Kromdijk et al., ${it('Science')}: press photo of a RIPE tobacco field trial · 2019 South et al., ${it('Science')}, Fig. 3A (CC BY 4.0) · 2020 Gunn et al., ${it('PNAS')}, Fig. 2B (© the authors)`,
  `2022 De Souza et al., ${it('Science')}: press photo of a soybean canopy, Allie Arp/RIPE project · 2023 Chen et al., ${it('Nat. Commun.')}, Fig. 2d (CC BY 4.0) · 2024 Tian et al., ${it('Nature')}, Fig. 1a (© Springer Nature)`,
  `2025 Lin et al., ${it('Plant Biotechnol. J.')}, Fig. 2c (CC BY 4.0) · images under © shown for teaching only`,
];

/* ---------------------------------------------------------------- 8 windows on one wide page (1340 × 590) */

const GW = 1340, GH = 590, COLS = 4, GAP = 12, CW = (GW - (COLS - 1) * GAP) / COLS, CH8 = 262, RG8 = 10;
const ZSTYLE = `<style>
.theme-editorial .fig text.ipz-y{font-size:21px;font-weight:800;fill:#a9532f}
.theme-editorial .fig text.ipz-t{font-size:17px;font-weight:700;fill:#141413}
.theme-editorial .fig text.ipz-s{font-size:15px;font-weight:500;fill:#2f2e2b}
.theme-editorial .fig text.ipz-c{font-size:12px;font-weight:500;fill:#6b6a64}
.theme-editorial .fig text.ipz-k{font-size:15px;font-weight:700;fill:#141413;paint-order:stroke;stroke:#fffdf8;stroke-width:4px;stroke-linejoin:round}
.theme-editorial .fig text.ipz-p{font-size:15px;font-weight:700;fill:#141413}
.ipz-card{fill:#fffdf8;stroke:#d9d4c6;stroke-width:1.3}
</style>`;
const PAD = 12, BW = CW - 2 * PAD, BH = 150, TOP = 40;

/** Panes of one image stacked in a column at one scale (never stretched), each with its label to the right. */
function paneColumn(c: Case8, x0: number, y0: number, id: string): string {
  const ps = c.panes ?? [], PG = 6, LW = 96;
  const s = Math.min((BH - PG * (ps.length - 1)) / ps.reduce((a, p) => a + p.win[3], 0), (BW - LW) / Math.max(...ps.map(p => p.win[2])));
  const totalH = ps.reduce((a, p) => a + p.win[3] * s, 0) + PG * (ps.length - 1), wMax = Math.max(...ps.map(p => p.win[2] * s));
  const xl = x0 + PAD + (BW - wMax - LW) / 2;
  let y = y0 + TOP + (BH - totalH) / 2;
  return ps.map((p, i) => {
    const w = p.win[2] * s, h = p.win[3] * s;
    const sh = shot(`${id}-${i}`, c.im, xl, y, w, { win: p.win });
    const lab = p.label.map((l, k) => T(xl + wMax + 12, y + h / 2 + 5 + (k - (p.label.length - 1) / 2) * 19, l, 'ipz-p')).join('');
    y += h + PG;
    return sh.svg + lab;
  }).join('');
}

/** One case window: year and name, the image (fitted, never stretched), the sentence. */
function caseCard(c: Case8, x0: number, y0: number, id: string): string {
  let pic: string;
  if (c.panes) pic = paneColumn(c, x0, y0, id);
  else {
    const [, , uw, vh] = c.win ?? [0, 0, c.im.w, c.im.h];
    const w = Math.min(BW, (BH * uw) / vh), h = (w * vh) / uw;
    const sh = shot(id, c.im, x0 + PAD + (BW - w) / 2, y0 + TOP + (BH - h) / 2, w, { win: c.win });
    pic = sh.svg + (c.labels ?? []).map(([u, v, l]) => { const [lx, ly] = sh.at(u, v); return T(lx, ly + 5, l, 'ipz-k', 'middle'); }).join('');
  }
  const lines = c.line.map((l, i) => T(x0 + PAD + 2, y0 + TOP + BH + 24 + i * 19, l, 'ipz-s')).join('');
  return `<rect class="ipz-card" x="${f(x0)}" y="${f(y0)}" width="${f(CW)}" height="${CH8}" rx="14"/>${T(x0 + PAD + 2, y0 + 29, c.year, 'ipz-y')}${T(x0 + 78, y0 + 28, c.name, 'ipz-t')}${pic}${lines}`;
}

function famous8(): string {
  const cards = CASES8.map((c, i) => caseCard(c, (i % COLS) * (CW + GAP), Math.floor(i / COLS) * (CH8 + RG8), `ipz-${i}`)).join('');
  const yc = 2 * CH8 + RG8 + 18;
  const cr = CREDITS8.map((l, i) => T(0, yc + i * 15, l, 'ipz-c')).join('');
  const say = CASES8.map(c => `${c.year}, ${c.name}: ${c.line.join(' ')}`).join(' ');
  return `<svg class="fig-svg ip" viewBox="0 0 ${GW} ${GH}" role="img" aria-label="Eight famous attempts to improve photosynthesis, 2014 to 2025, one window each with a photo from the study. ${say}">${ZSTYLE}${cards}${cr}</svg>`;
}

export const draw = (_id: string): string => famous8();
