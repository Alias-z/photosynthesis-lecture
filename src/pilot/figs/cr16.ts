// Slide C16 · Improving photosynthesis (slide 26), fourth round, 30 Oct 2026 (lecturer: "Keep only the photorespiration
// shortcut in potato. Find more research; don't use the ones before, they look ugly"). Four variants, each pairing two
// 2025–2026 studies from two different approaches; no study appears twice. One big image per study (never stretched: one
// scale per image; low-resolution photos are not blown up past maxW), a title of ≤ 5 words, at most one number with its
// measure, a small credit. Every study read on its own full text (PMC / Europe PMC JATS, PMC open-data copy of the
// figures) on 29 Oct 2026; the figures are the PMC copies (≈ 700–1060 px wide), crops listed per asset.
//   - Photorespiration shortcut in potato: Lin X … Peng X. Plant Biotechnol J 23:2526–2536 (2 Apr 2025),
//     doi 10.1111/pbi.70076. GOC bypass; tuber yield per plant +21.3–69.2 % in field trials at several sites.
//     photos/c16n-potato-goc.jpg (Fig. 2c), window x 12–280, y 28–182. CC BY 4.0.
//   - Faster stomata: Alvim JC, Alvim MN, Hibberd JM, Harvey M, Blatt MR … Plant Physiol 197:kiaf039 (Feb 2025),
//     doi 10.1093/plphys/kiaf039. The guard-cell K⁺ channel GROK of the C₄ plant Gynandropsis put into Arabidopsis
//     speeds stomata; biomass 1.6–1.9-fold under varying light (Results, Fig. 6). c16x-alvim-rosettes.jpg: Fig. 6A, the
//     varying-light row, GROK and wild type only (x 72–330, y 24–140 of the 750 × 1221 PMC figure). CC BY 4.0.
//   - Upright leaves: Jaikumar NS … McCoy … Plant Biotechnol J 23:3401 (1 Jun 2025), doi 10.1111/pbi.70150. Down-regulating
//     the liguleless genes makes sorghum leaves more erect; above-ground biomass ca. +24 % in 2018 and 2020 field plots
//     (grain ca. +5.5 %). c16x-jaikumar-sorghum.jpg: Fig. 2c (x 0–709, y 640–986). CC BY 4.0.
//   - More CO₂ channels: Lu … Chen. Plant Biotechnol J 24:4487 (24 Mar 2026), doi 10.1111/pbi.70648. The wheat aquaporins
//     TaPIP1;6 and TaPIP2;10 carry CO₂ into the cells; overexpression raises photosynthesis and grain yield (abstract,
//     Fig. 2; no percentage in the text). c16x-lu-wheat.jpg: Fig. 2a, field plots (x 0–709, y 52–305, line labels left
//     out; groups relabelled: controls, silenced, overexpressed). CC BY-NC-ND 4.0, cropped only.
//   - Heat-proof RuBisCO activase: Cao … Wang. Plant Biotechnol J (20 Oct 2026, early view), doi 10.1111/pbi.70774. A
//     heat-inducible activase, RCA1, from a tropical azalea keeps Arabidopsis photosynthesising through heat.
//     c16x-cao-heat.jpg: Fig. 2B, first two photos (x 48–470, y 502–680 of the 1064 × 1218 figure). CC BY 4.0.
//   - Light-adapted rice: Li … Deng. Plant Biotechnol J 24:769 (23 Sep 2025), doi 10.1111/pbi.70380. Overexpressing the
//     thylakoid-lipid enzyme OsMGD1; grain yield +18 % under natural light (+49 % in shade). c16x-li-rice.jpg: Fig. 6A,
//     natural-light row, WT and three OE lines (x 38–420, y 147–262). CC BY-NC-ND 4.0, cropped only.
//   - More carboxysomes: Hu … Liu LN. Plant Physiol 201:kiag261 (Jul 2026), doi 10.1093/plphys/kiag261. Overexpressing
//     β-carboxysome genes in Synechocystis raises carboxysome numbers, photosynthesis and growth. c16x-hu-carboxysomes.jpg:
//     Fig. 3a, air row, WT and CB OE (green: RuBisCO-GFP in carboxysomes; x 25–535, y 24–275). CC BY 4.0.
//   - Towards C₄ rice: Cackett L … Hibberd JM. Plant Physiol 197:kiaf108 (2 Apr 2025), doi 10.1093/plphys/kiaf108. Bundle-
//     sheath-specific OsBZR1 enlarges bundle-sheath chloroplasts by up to 34 % with no growth penalty. c16x-cackett-bs.jpg:
//     Fig. 4A, bundle-sheath micrographs, null segregant and OE line (x 14–216, y 31–205; the image is small). CC BY 4.0.
import { shot, type Img, type Shot } from './cr-common';
import type { PlateText, Variant } from '../types';
import potJpg from '../../assets/photos/c16n-potato-goc.jpg';
import alvJpg from '../../assets/photos/c16x-alvim-rosettes.jpg';
import sorJpg from '../../assets/photos/c16x-jaikumar-sorghum.jpg';
import wheJpg from '../../assets/photos/c16x-lu-wheat.jpg';
import caoJpg from '../../assets/photos/c16x-cao-heat.jpg';
import riceJpg from '../../assets/photos/c16x-li-rice.jpg';
import cbxJpg from '../../assets/photos/c16x-hu-carboxysomes.jpg';
import bsJpg from '../../assets/photos/c16x-cackett-bs.jpg';

export const PLATE: PlateText = {
  n: 'C16',
  title: 'Improving photosynthesis',
  status: 'draft',
  // 30 Oct 2026 (lecturer: "recent research, after 2024"; "give the impression that it can be done in multiple ways"):
  // 1 lead, 3 points naming approaches, no method detail, no numbers
  lead: 'There are many ways to improve photosynthesis.',
  points: [
    { claim: 'More light and CO₂ into the leaf.', text: 'Upright leaves, faster stomata and extra CO₂ channels' },
    { claim: 'More CO₂ at RuBisCO.', text: 'More carboxysomes, and bigger bundle-sheath chloroplasts as a step towards C₄ rice' },
    { claim: 'A sturdier chloroplast, less waste.', text: 'A heat-proof RuBisCO activase, membranes tuned to light, and a photorespiration shortcut' },
  ],
  refs: [
    { label: 'Lin 2025', url: 'https://doi.org/10.1111/pbi.70076' },
    { label: 'Alvim 2025', url: 'https://doi.org/10.1093/plphys/kiaf039' },
    { label: 'Jaikumar 2025', url: 'https://doi.org/10.1111/pbi.70150' },
    { label: 'Lu 2026', url: 'https://doi.org/10.1111/pbi.70648' },
    { label: 'Cao 2026', url: 'https://doi.org/10.1111/pbi.70774' },
    { label: 'Li 2025', url: 'https://doi.org/10.1111/pbi.70380' },
    { label: 'Hu 2026', url: 'https://doi.org/10.1093/plphys/kiag261' },
    { label: 'Cackett 2025', url: 'https://doi.org/10.1093/plphys/kiaf108' },
  ],
};

// lecture day, last (lecturer: "make slide 26 like slide 20: it is meant to show more cases; no text on the right, each
// one a display window, a case study"): one wide page, 8 windows; the pairs j–m stay below, unlisted
export const VARIANTS: Variant[] = [
  { id: 'w', name: 'w · 8 case studies, one window each, across the page', wide: true },
];
export const VARIANTS_PAIRS: Variant[] = [
  { id: 'j', name: 'j · photorespiration shortcut in potato + faster stomata' },
  { id: 'k', name: 'k · upright sorghum leaves + more CO₂ channels in wheat' },
  { id: 'l', name: 'l · heat-proof RuBisCO activase + light-adapted rice' },
  { id: 'm', name: 'm · more carboxysomes + bigger bundle-sheath chloroplasts' },
];

/* ---------------------------------------------------------------- helpers */

type A = 'start' | 'middle' | 'end';
type Box = [number, number, number, number];
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

const STYLE = `<style>
.theme-editorial .fig text.ipx-t{font-size:24px;font-weight:700;fill:#141413}
.theme-editorial .fig text.ipx-n{font-size:40px;font-weight:800;fill:#141413}
.theme-editorial .fig text.ipx-m{font-size:16px;font-weight:500;fill:#3d3d3a}
.theme-editorial .fig text.ipx-c{font-size:12px;font-weight:500;fill:#6b6a64}
.theme-editorial .fig text.ipx-k{font-size:15px;font-weight:700;fill:#141413}
.ipx-rule{fill:none;stroke:#d8d5cb;stroke-width:1.2}
</style>`;

/* ---------------------------------------------------------------- the studies */

interface Paper {
  im: Img;
  win?: Box;
  fig?: boolean;
  /** Widest the image may be shown (figure units), so low-resolution photos are not blown up. */
  maxW?: number;
  title: string[];
  num?: string;
  measure: string[];
  credit: string[];
  /** Labels set just above the image, at image-pixel x positions. */
  above?: Array<[number, string]>;
  say: string;
}

const LIN: Paper = {
  im: { href: potJpg, w: 707, h: 182 }, win: [12, 28, 268, 154], maxW: 400,
  title: ['Photorespiration', 'shortcut in potato'],
  num: '+21.3–69.2 %', measure: ['tuber yield per plant,', 'field trials'],
  credit: ['Lin et al. 2025, Plant Biotechnol J · Fig. 2c', 'CC BY 4.0'],
  say: 'Photorespiration shortcut in potato: the tubers of wild-type plants beside the larger harvest of plants with a GOC bypass in the chloroplast; tuber yield per plant up 21.3 to 69.2 percent in field trials. Lin and colleagues 2025, Plant Biotechnology Journal',
};
const ALV: Paper = {
  im: { href: alvJpg, w: 258, h: 116 }, fig: true, maxW: 400,
  title: ['Faster stomata'],
  num: '1.6–1.9 ×', measure: ['biomass in varying light,', 'Arabidopsis'],
  credit: ['Alvim et al. 2025, Plant Physiol · Fig. 6A', 'CC BY 4.0'],
  above: [[53, 'C₄-plant K⁺ channel'], [190, 'wild type']],
  say: 'Faster stomata: an Arabidopsis rosette whose guard cells carry a potassium channel from a C4 plant, beside a smaller wild-type rosette; 1.6 to 1.9 times the biomass in varying light. Alvim and colleagues 2025, Plant Physiology',
};
const SOR: Paper = {
  im: { href: sorJpg, w: 709, h: 346 },
  title: ['Upright leaves', 'share the light'],
  num: '≈ +24 %', measure: ['above-ground biomass,', 'sorghum field plots'],
  credit: ['Jaikumar et al. 2025, Plant Biotechnol J · Fig. 2c', 'CC BY 4.0'],
  above: [[84, 'wild type'], [441, 'upright-leaf lines']],
  say: 'Upright leaves share the light: wild-type sorghum with drooping leaves beside three lines with more upright leaves; above-ground biomass about 24 percent higher in field plots. Jaikumar and colleagues 2025, Plant Biotechnology Journal',
};
const WHE: Paper = {
  im: { href: wheJpg, w: 709, h: 253 },
  title: ['More CO₂ channels', 'in wheat'],
  measure: ['Aquaporins carry CO₂ into the cells;', 'more of them, more grain in the field'],
  credit: ['Lu et al. 2026, Plant Biotechnol J · Fig. 2a', 'CC BY-NC-ND 4.0'],
  above: [[118, 'control'], [355, 'silenced'], [591, 'boosted']],
  say: 'More CO2 channels in wheat: field plots of control wheat, wheat with two aquaporins silenced and wheat with them overexpressed; the aquaporins carry CO2 into the cells and more of them raised grain yield. Lu and colleagues 2026, Plant Biotechnology Journal',
};
const CAO: Paper = {
  im: { href: caoJpg, w: 422, h: 178 },
  title: ['A heat-proof', 'RuBisCO activase'],
  measure: ['Arabidopsis after 80 h at 45 °C;', 'WT/RCA1 carries the extra activase'],
  credit: ['Cao et al. 2026, Plant Biotechnol J · Fig. 2B', 'CC BY 4.0'],
  say: 'A heat-proof RuBisCO activase: after 80 hours at 45 degrees, an Arabidopsis plant carrying the heat-inducible activase RCA1 from a tropical azalea is still flowering, beside a wilted wild type. Cao and colleagues 2026, Plant Biotechnology Journal',
};
const RICE: Paper = {
  im: { href: riceJpg, w: 382, h: 115 },
  title: ['Rice tuned to', 'changing light'],
  num: '+18 %', measure: ['grain yield in natural light;', 'OE: extra thylakoid-lipid enzyme'],
  credit: ['Li et al. 2025, Plant Biotechnol J · Fig. 6A', 'CC BY-NC-ND 4.0'],
  say: 'Rice tuned to changing light: wild-type rice beside three lines overexpressing the thylakoid-lipid enzyme OsMGD1; grain yield up 18 percent under natural light. Li and colleagues 2025, Plant Biotechnology Journal',
};
const CBX: Paper = {
  im: { href: cbxJpg, w: 510, h: 251 },
  title: ['More carboxysomes,', 'the CO₂ traps'],
  measure: ['green: RuBisCO in carboxysomes,', 'cyanobacterium Synechocystis'],
  credit: ['Hu et al. 2026, Plant Physiol · Fig. 3a', 'CC BY 4.0'],
  above: [[124, 'wild type'], [382, 'more carboxysomes']],
  say: 'More carboxysomes, the CO2 traps: fluorescence images of wild-type cyanobacteria beside cells that build more carboxysomes, the green dots of RuBisCO; photosynthesis and growth improved. Hu and colleagues 2026, Plant Physiology',
};
const BS: Paper = {
  im: { href: bsJpg, w: 202, h: 174 }, maxW: 300,
  title: ['Bigger bundle-sheath', 'chloroplasts'],
  num: '+34 %', measure: ['chloroplast area, rice:', 'a step towards C₄ rice'],
  credit: ['Cackett et al. 2025, Plant Physiol · Fig. 4A', 'CC BY 4.0'],
  above: [[50, 'control'], [152, 'engineered']],
  say: 'Bigger bundle-sheath chloroplasts: micrographs of rice bundle-sheath cells, the outlined chloroplasts larger in the engineered line; chloroplast area up to 34 percent larger, a step towards C4 rice. Cackett and colleagues 2025, Plant Physiology',
};

/* ---------------------------------------------------------------- one study per row, two rows */

/** Image box (figure units) and the text column. */
const IW = 470, IH = 250, TX = 498, ROW = 306;

function row(p: Paper, y0: number, id: string): string {
  const [, , uw, vh] = p.win ?? [0, 0, p.im.w, p.im.h];
  const w = Math.min(IW, p.maxW ?? IW, (IH * uw) / vh), h = (w * vh) / uw;
  const x = (IW - w) / 2, y = y0 + 32 + (IH - h) / 2;
  const s = shot(id, p.im, x, y, w, { win: p.win, fig: p.fig });
  const above = (p.above ?? []).map(([u, l]) => T(s.at(u, 0)[0], y - 8, l, 'ipx-k', 'middle')).join('');
  const title = p.title.map((l, i) => T(TX, y0 + 62 + i * 30, l, 'ipx-t')).join('');
  const yN = y0 + 62 + p.title.length * 30 + 34;
  const yM = p.num ? yN + 28 : yN - 16;
  return `${s.svg}${above}${title}${p.num ? T(TX, yN, p.num, 'ipx-n') : ''}
    ${p.measure.map((l, i) => T(TX, yM + i * 20, l, 'ipx-m')).join('')}
    ${p.credit.map((l, i) => T(TX, y0 + 262 + i * 16, l, 'ipx-c')).join('')}`;
}

function pair(v: string, a: Paper, b: Paper): string {
  return `<svg class="fig-svg ip" viewBox="0 0 800 600" role="img" aria-label="Two of the many ways to improve photosynthesis. ${a.say}. ${b.say}.">${STYLE}${row(a, 0, `ipx-${v}-a`)}<path class="ipx-rule" d="M0,${ROW - 10}H800"/>${row(b, ROW, `ipx-${v}-b`)}</svg>`;
}

/* ---------------------------------------------------------------- w · 8 windows on one wide page (1340 × 590) */

const GW = 1340, GH = 590, COLS = 4, GAP = 12, CW = (GW - (COLS - 1) * GAP) / COLS, CH = (GH - GAP) / 2;
const WSTYLE = `<style>
.theme-editorial .fig text.ipw-t{font-size:18px;font-weight:700;fill:#141413}
.theme-editorial .fig text.ipw-n{font-size:28px;font-weight:800;fill:#a9532f}
.theme-editorial .fig text.ipw-m{font-size:13.5px;font-weight:500;fill:#3d3d3a}
.theme-editorial .fig text.ipw-c{font-size:11px;font-weight:500;fill:#6b6a64}
.theme-editorial .fig text.ipw-k{font-size:12.5px;font-weight:700;fill:#141413;paint-order:stroke;stroke:#fffdf8;stroke-width:4px;stroke-linejoin:round}
.ipw-card{fill:#fffdf8;stroke:#d9d4c6;stroke-width:1.3}
</style>`;
/** One case window: the image on top (fitted, never stretched), the approach, its number, what it was measured on. */
function windowCard(p: Paper, x0: number, y0: number, id: string): string {
  const PAD = 10, BW = CW - 2 * PAD, BH = 118, TOP = 24;
  const [, , uw, vh] = p.win ?? [0, 0, p.im.w, p.im.h];
  const w = Math.min(BW, (p.maxW ?? BW) * 0.8, (BH * uw) / vh), h = (w * vh) / uw;
  const x = x0 + PAD + (BW - w) / 2, y = y0 + TOP + (BH - h) / 2;
  const sh = shot(id, p.im, x, y, w, { win: p.win, fig: p.fig });
  const above = (p.above ?? []).map(([u, l]) => T(sh.at(u, 0)[0], y0 + 18, l, 'ipw-k', 'middle')).join('');
  const one = p.title.join(' '), title = one.length <= 28 ? [one] : p.title;
  const yT = y0 + TOP + BH + 24;
  const tt = title.map((l, i) => T(x0 + PAD + 4, yT + i * 21, l, 'ipw-t')).join('');
  let yy = yT + (title.length - 1) * 21;
  const num = p.num ? T(x0 + PAD + 4, (yy += 32), p.num, 'ipw-n') : '';
  const meas = p.measure.map((l, i) => T(x0 + PAD + 4, yy + 22 + i * 17, l, 'ipw-m')).join('');
  return `<rect class="ipw-card" x="${f(x0)}" y="${f(y0)}" width="${f(CW)}" height="${f(CH)}" rx="14"/>${sh.svg}${above}${tt}${num}${meas}
    ${T(x0 + PAD + 4, y0 + CH - 10, p.credit.map(c => c.replace(/\s·\sFig\.\s\S+$/, '')).join(' · '), 'ipw-c')}`;
}
function grid(): string {
  const cases = [LIN, SOR, ALV, WHE, CAO, RICE, CBX, BS];
  const cards = cases.map((p, i) => windowCard(p, (i % COLS) * (CW + GAP), Math.floor(i / COLS) * (CH + GAP), `ipw-${i}`)).join('');
  return `<svg class="fig-svg ip" viewBox="0 0 ${GW} ${GH}" role="img" aria-label="Eight recent ways to improve photosynthesis, one window each. ${cases.map(c => c.say).join('. ')}.">${WSTYLE}${cards}</svg>`;
}

const DRAW: Record<string, () => string> = {
  w: grid,
  j: () => pair('j', LIN, ALV),
  k: () => pair('k', SOR, WHE),
  l: () => pair('l', CAO, RICE),
  m: () => pair('m', CBX, BS),
};
export const draw = (id: string): string => (DRAW[id] ?? DRAW.w)();
