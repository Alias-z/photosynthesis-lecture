// Slide C16 · Improving photosynthesis, figure f (29 Oct 2026, lecture day; lecturer: "use recent years: it must be at
// least 2025", "use research images, not drawings"). Six 2025–2026 projects under three heads, one real research image
// each, never stretched (each image is shown through a window of its own pixels at one scale, the authors' scale bars
// inside the window). Facts, numbers and crops from scratchpad C16_RESEARCH_R1.md and C16_RESEARCH_R2.md, every one read on
// the paper's own page on 29 Oct 2026. All six images are CC BY or CC BY 4.0, so the credits carry no licence note.
//   - c16n-hua-bs-section.jpg (486 × 212): Hua et al. 2025, Nat Commun 16:7040, doi 10.1038/s41467-025-62087-0, Fig. 1f
//     (GUS stain in the rice bundle sheath); f shows the whole-section panel, x 0–290, y 8–204, with the authors' bar and "8h".
//     Number: promoter activity 220-fold when the module is oligomerised (GUS/MUG activity, transgenic rice).
//   - c16n-rubisco-condensate.jpg (1400 × 379): T. Chen et al. 2025, Plant Biotechnol J 23:2140, doi 10.1111/pbi.70047,
//     Fig. 3d (confocal, green RuBisCO droplets in red chloroplasts); f shows the Merge panel, x 1054–1388, with the
//     authors' 5 µm bar. Number: k_cat^C 3.5 ± 0.1 s⁻¹ vs 3.5 ± 0.3 s⁻¹ wild type (purified enzyme, 25 °C).
//   - c16n-mcdonald-t391i.jpg (1040 × 612): McDonald et al. 2026, Sci Adv 12:eaeh3246, doi 10.1126/sciadv.aeh3246, Fig. 4E
//     (structure, site T391 beside the small subunit; the authors' 10 Å bar); the panel letter is left out.
//     Number: T391I +29 % carboxylation rate (k_cat^C), purified enzyme, not plants.
//   - c16n-sorghum-rubisco.jpg (1400 × 406): Salesse-Smith et al. 2025, PNAS 122:e2419943122, doi 10.1073/pnas.2419943122,
//     Fig. 4E (field plots); f shows x 690–1367, y 36–406 (the authors' labels WT and zg12a), the panel letter left out.
//     Number: +15.5 % biomass, field-grown sorghum; seed biomass not increased.
//   - c16n-taco-field.jpg (496 × 278): G. Chen et al. 2025, Plant Biotechnol J 23:4712, doi 10.1111/pbi.70258, Fig. 1h
//     (field plots, the authors' plot labels and bar); f shows x 0–464, y 22–278 (the white margins left out).
//     Number: grain yield per plant +14.2–20.2 %, field, randomised complete block.
//   - c16n-potato-goc.jpg (707 × 182): Lin et al. 2025, Plant Biotechnol J 23:2526, doi 10.1111/pbi.70076, Fig. 2c
//     (tubers of ten plants); f shows x 12–280, y 28–182 (WT, GOC-1 and the authors' 10 cm bar), the panel letter left out.
//     Number: tuber yield per plant +21.3 % to +69.2 %, field trials at several Chinese sites.
import { shot, type Img } from './cr-common';
import huaJpg from '../../assets/photos/c16n-hua-bs-section.jpg';
import condJpg from '../../assets/photos/c16n-rubisco-condensate.jpg';
import mcdJpg from '../../assets/photos/c16n-mcdonald-t391i.jpg';
import sorJpg from '../../assets/photos/c16n-sorghum-rubisco.jpg';
import tacoJpg from '../../assets/photos/c16n-taco-field.jpg';
import potJpg from '../../assets/photos/c16n-potato-goc.jpg';

type A = 'start' | 'middle' | 'end';
type Box = [number, number, number, number];
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

const STYLE = `<style>
.theme-editorial .fig text.ipf-g{font-size:14px;font-weight:700;fill:#141413}
.theme-editorial .fig text.ipf-n{font-size:15px;font-weight:700;fill:#141413}
.theme-editorial .fig text.ipf-v{font-size:20px;font-weight:800;fill:#141413}
.theme-editorial .fig text.ipf-m{font-size:13px;font-weight:500;fill:#3d3d3a}
.theme-editorial .fig text.ipf-c{font-size:12px;font-weight:500;fill:#6b6a64}
.ipf-rule{fill:none;stroke:#d8d5cb;stroke-width:1.2}
</style>`;

interface Tile {
  id: string;
  im: Img;
  win: Box;
  fig?: boolean;
  holes?: Box[];
  name: string[];
  num: string;
  measure: string[];
  credit: string;
}

/** One column per head, two tiles each, in the order of the slide's points. */
const COLS: Array<{ head: string; tiles: [Tile, Tile] }> = [
  {
    head: 'More CO₂ at RuBisCO',
    tiles: [
      {
        id: 'ipf-hua', im: { href: huaJpg, w: 486, h: 212 }, win: [0, 8, 290, 196],
        name: ['C₄ rice:', 'a bundle-sheath switch'],
        num: '220 ×', measure: ['promoter activity with the module', 'repeated · GUS assay, rice'],
        credit: 'Hua et al. 2025, Nat Commun',
      },
      {
        id: 'ipf-cond', im: { href: condJpg, w: 1400, h: 379 }, win: [1054, 22, 334, 330],
        name: ['RuBisCO droplets in tobacco'],
        num: '3.5 s⁻¹', measure: ['RuBisCO turnover, as in wild type', 'purified enzyme, 25 °C'],
        credit: 'T. Chen et al. 2025, Plant Biotechnol J',
      },
    ],
  },
  {
    head: 'A better RuBisCO, or more of it',
    tiles: [
      {
        id: 'ipf-mcd', im: { href: mcdJpg, w: 1040, h: 612 }, win: [0, 0, 1040, 612], fig: true, holes: [[0, 0, 48, 44]],
        name: ['RuBisCO improved by', 'machine learning'],
        num: '+29 %', measure: ['carboxylation rate (T391I)', 'purified enzyme, not plants'],
        credit: 'McDonald et al. 2026, Sci Adv',
      },
      {
        id: 'ipf-sor', im: { href: sorJpg, w: 1400, h: 406 }, win: [690, 36, 677, 370],
        name: ['More RuBisCO in sorghum'],
        num: '+15.5 %', measure: ['biomass, field sorghum;', 'seed yield not up'],
        credit: 'Salesse-Smith et al. 2025, PNAS',
      },
    ],
  },
  {
    head: 'Less lost to photorespiration',
    tiles: [
      {
        id: 'ipf-taco', im: { href: tacoJpg, w: 496, h: 278 }, win: [0, 22, 464, 256],
        name: ['A photorespiration', 'shortcut in rice'],
        num: '+14.2–20.2 %', measure: ['grain yield per plant, field rice'],
        credit: 'G. Chen et al. 2025, Plant Biotechnol J',
      },
      {
        id: 'ipf-pot', im: { href: potJpg, w: 707, h: 182 }, win: [12, 28, 268, 154],
        name: ['A photorespiration', 'shortcut in potato'],
        num: '+21.3–69.2 %', measure: ['tuber yield per plant, field', 'trials at several sites'],
        credit: 'Lin et al. 2025, Plant Biotechnol J',
      },
    ],
  },
];

/** Column x and width; image height (every window is shown at this height, its width following its own aspect). */
const X = [0, 272, 544], W = 256, IH = 140, TOP = [38, 318];

function tile(q: Tile, x: number, y: number): string {
  const w = Math.min(W, (IH * q.win[2]) / q.win[3]);
  const pic = shot(q.id, q.im, x, y, w, { win: q.win, fig: q.fig, holes: q.holes }).svg;
  const yi = y + IH;
  return `${pic}
    ${q.name.map((l, i) => T(x, yi + 22 + i * 18, l, 'ipf-n')).join('')}
    ${T(x, yi + 66, q.num, 'ipf-v')}
    ${q.measure.map((l, i) => T(x, yi + 83 + i * 16, l, 'ipf-m')).join('')}
    ${T(x, yi + 117, q.credit, 'ipf-c')}`;
}

export function draw(): string {
  const body = COLS.map((c, i) => `${T(X[i], 16, c.head, 'ipf-g')}<path class="ipf-rule" d="M${X[i]},26H${X[i] + W}"/>
    ${c.tiles.map((q, j) => tile(q, X[i], TOP[j])).join('')}`).join('');
  return `<svg class="fig-svg ip" viewBox="0 0 800 600" role="img" aria-label="Six projects from 2025 and 2026 to improve photosynthesis, each with an image from its paper. More CO2 at RuBisCO: C4 rice, a switch that turns genes on in the rice bundle sheath only, with a blue-stained bundle sheath in a rice leaf section; promoter activity 220-fold with the module repeated, Hua and colleagues 2025. RuBisCO droplets in tobacco, green droplets in red chloroplasts; RuBisCO turnover 3.5 per second, as in wild type, T. Chen and colleagues 2025. A better RuBisCO, or more of it: RuBisCO improved by machine learning, its structure with the mutated site T391; carboxylation rate up 29 percent in the purified enzyme, McDonald and colleagues 2026. More RuBisCO in sorghum, field plots; biomass up 15.5 percent in the field, seed yield not up, Salesse-Smith and colleagues 2025. Less lost to photorespiration: a photorespiration shortcut in rice, field plots; grain yield per plant up 14.2 to 20.2 percent, G. Chen and colleagues 2025. A photorespiration shortcut in potato, the tubers of wild type and bypass plants; tuber yield per plant up 21.3 to 69.2 percent in field trials, Lin and colleagues 2025.">${STYLE}${body}</svg>`;
}
