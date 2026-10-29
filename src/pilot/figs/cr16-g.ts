// Slide C16 · Improving photosynthesis, figure g: "from the lab bench to the field". Six research images, 2025–2026 only
// (scratchpad C16_RESEARCH_R1.md and _R2.md, verified 29 Oct 2026): the top row shows the change inside the leaf, the
// bottom row the crop in the field. Each image: a plain label, one number with its measure, a credit under it.
//   - c16n-hua-bs-section.jpg: Hua et al. 2025, Nat Commun 16:7040, doi 10.1038/s41467-025-62087-0, Fig. 1f (GUS stain in
//     the rice bundle sheath); promoter activity 220-fold (GUS/MUG, transgenic rice, growth room). CC BY 4.0.
//   - c16n-rubisco-condensate.jpg: Chen T et al. 2025, Plant Biotechnol J 23:2140, doi 10.1111/pbi.70047, Fig. 3d merge
//     (green RuBisCO droplets, red chlorophyll); k_cat^C 3.5 s⁻¹ as wild type 3.5 s⁻¹ (purified enzyme). CC BY 4.0.
//   - c16n-mcdonald-t391i.jpg: McDonald et al. 2026, Sci Adv 12:eaeh3246, doi 10.1126/sciadv.aeh3246, Fig. 4E (site T391
//     in the large subunit beside RbcS); T391I +29 % carboxylation rate (purified enzyme kinetics). CC BY 4.0.
//   - c16n-sorghum-rubisco.jpg: Salesse-Smith et al. 2025, PNAS 122:e2419943122, doi 10.1073/pnas.2419943122, Fig. 4E
//     (field plots, line hn1a beside wild type); +15.5 % biomass in the field, seed biomass not increased. CC BY 4.0.
//   - c16n-taco-field.jpg: Chen G et al. 2025, Plant Biotechnol J 23:4712, doi 10.1111/pbi.70258, Fig. 1h (field plots,
//     TaCo bypass lines and wild type); grain yield per plant +14.2–20.2 % (field). CC BY.
//   - c16n-potato-goc.jpg: Lin et al. 2025, Plant Biotechnol J 23:2526, doi 10.1111/pbi.70076, Fig. 2c (tubers of ten
//     plants, wild type and GOC-1); tuber yield per plant +21.3 to +69.2 % (field trials). CC BY 4.0.
// Every crop window keeps the authors' scale bar; images are scaled uniformly (cr-common `shot`), never stretched.
import { pleader, shot, type Box, type Img, type Pt } from './cr-common';
import huaJpg from '../../assets/photos/c16n-hua-bs-section.jpg';
import condJpg from '../../assets/photos/c16n-rubisco-condensate.jpg';
import mcdJpg from '../../assets/photos/c16n-mcdonald-t391i.jpg';
import sorJpg from '../../assets/photos/c16n-sorghum-rubisco.jpg';
import tacoJpg from '../../assets/photos/c16n-taco-field.jpg';
import potJpg from '../../assets/photos/c16n-potato-goc.jpg';

type A = 'start' | 'middle' | 'end';
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

const STYLE = `<style>
.theme-editorial .fig text.ipg-h{font-size:17.5px;font-weight:700;fill:#141413}
.theme-editorial .fig text.ipg-n{font-size:16.5px;font-weight:700;fill:#2f7a37}
.theme-editorial .fig text.ipg-m{font-size:14.5px;font-weight:500;fill:#4a4944}
.theme-editorial .fig text.ipg-no{font-size:14.5px;font-weight:700;fill:#a9532f}
.theme-editorial .fig text.ipg-cr{font-size:12px;font-weight:500;fill:#8a877d}
.theme-editorial .fig text.ipg-row{font-size:15px;font-weight:600;fill:#4a4944;letter-spacing:.02em}
.theme-editorial .fig text.ipg-pill{font-size:14px;font-weight:600;fill:#141413}
.ipg-ar{fill:none;stroke:#8a877d;stroke-width:1.6;stroke-linecap:round}
.ipg-hd{fill:#8a877d}
.ipg-br{fill:none;stroke:#b9b6ac;stroke-width:1.3}
</style>`;

/** A small label pill centred at (x, y) on a photo, with haloed leaders to points of the image. */
function pill(x: number, y: number, s: string, to: Pt[]): string {
  const w = s.length * 7.9 + 20;
  const ld = to.map(p => {
    const dx = p[0] - x, dy = p[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 13 / Math.max(Math.abs(dy), 1e-6));
    return pleader([x + dx * t, y + dy * t], p);
  }).join('');
  return `${ld}<rect class="cr-pillbg" x="${f(x - w / 2)}" y="${f(y - 13)}" width="${f(w)}" height="26" rx="13"/>${T(x, y + 5, s, 'ipg-pill', 'middle')}`;
}

interface Cell {
  id: string;
  im: Img;
  win: Box;
  /** label under the image; '' when a label spans two columns */
  h: string;
  n: string;
  m: string;
  /** the second line is a caveat (rust) */
  no?: boolean;
  crd: string;
  /** pills on the image, placed in image pixels */
  pills?: Array<{ at: Pt; s: string; to: Pt[] }>;
}

// Columns: 3 × 242 wide from x 42 (the left gutter holds the arrow). Windows: top 1.255 : 1, bottom 1.6 : 1.
const X0 = [42, 298, 554], W = 242;
const TOP: Cell[] = [
  {
    id: 'ipg-hua', im: { href: huaJpg, w: 486, h: 212 }, win: [46, 16, 231, 184],
    h: 'C₄ rice: a gene switch', n: '220 × promoter activity', m: '(rice, growth room)',
    crd: 'Hua et al. 2025, Nat Commun',
    pills: [{ at: [214, 34], s: 'bundle sheath', to: [[229, 103], [136, 98]] }],
  },
  {
    id: 'ipg-cond', im: { href: condJpg, w: 1400, h: 379 }, win: [1055, 88, 329, 263],
    h: 'RuBisCO in droplets', n: '3.5 s⁻¹ carboxylation rate', m: 'same as wild type (tobacco)',
    crd: 'T. Chen et al. 2025, Plant Biotechnol J',
    pills: [{ at: [1135, 112], s: 'chloroplast', to: [[1212, 140]] }],
  },
  {
    id: 'ipg-mcd', im: { href: mcdJpg, w: 1040, h: 612 }, win: [258, 40, 716, 570],
    h: 'Machine-learned RuBisCO', n: '+29 % carboxylation rate', m: '(purified enzyme, not plants)',
    crd: 'McDonald et al. 2026, Sci Adv',
  },
];
const BOT: Cell[] = [
  {
    id: 'ipg-sor', im: { href: sorJpg, w: 1400, h: 406 }, win: [418, 43, 580, 362.5],
    h: 'More RuBisCO in sorghum', n: '+15.5 % biomass (field)', m: 'seed yield not up', no: true,
    crd: 'Salesse-Smith et al. 2025, PNAS',
  },
  {
    id: 'ipg-taco', im: { href: tacoJpg, w: 496, h: 278 }, win: [70, 27, 395, 247],
    h: '', n: '+14.2–20.2 % grain yield', m: '(rice, per plant, field)',
    crd: 'G. Chen et al. 2025, Plant Biotechnol J',
  },
  {
    id: 'ipg-pot', im: { href: potJpg, w: 707, h: 182 }, win: [26, 30, 240, 150],
    h: '', n: '+21.3–69.2 % tuber yield', m: '(potato, per plant, field)',
    crd: 'Lin et al. 2025, Plant Biotechnol J',
  },
];

/** One row of three cells with its image top at y. */
function row(cells: Cell[], y: number): { svg: string; yh: number; ih: number } {
  let out = '', ih = 0, yh = 0;
  cells.forEach((c, i) => {
    const x = X0[i], s = shot(c.id, c.im, x, y, W, { win: c.win, r: 8 });
    ih = s.h;
    const yb = y + s.h;
    yh = yb + 39;
    const pills = (c.pills ?? []).map(p => pill(...s.at(...p.at), p.s, p.to.map(q => s.at(...q)))).join('');
    out += `${s.svg}${pills}
      ${T(x + W, yb + 15, c.crd, 'ipg-cr', 'end')}
      ${c.h ? T(x, yh, c.h, 'ipg-h') : ''}
      ${T(x, yb + 62, c.n, 'ipg-n')}
      ${T(x, yb + 81, c.m, c.no ? 'ipg-no' : 'ipg-m')}`;
  });
  return { svg: out, yh, ih };
}

export function draw(): string {
  const yTop = 16, yBot = 330;
  const top = row(TOP, yTop), bot = row(BOT, yBot);
  // the two bypass crops share one label; a thin bracket on both sides of it spans the two columns
  const bx0 = X0[1], bx1 = X0[2] + W, by = bot.yh;
  const tw = 384, xm = (bx0 + bx1) / 2, yl = by - 6;
  const shared = `${T(xm, by, 'Photorespiratory bypass in rice and potato', 'ipg-h', 'middle')}
    <path class="ipg-br" d="M${bx0},${yl - 7}V${yl}H${f(xm - tw / 2 - 10)}M${f(xm + tw / 2 + 10)},${yl}H${bx1}V${yl - 7}"/>`;
  // left gutter: "inside the leaf" → "in the field", read top to bottom
  const xa = 20, cTop = yTop + top.ih / 2, cBot = yBot + bot.ih / 2, hTop = 58, hBot = 44;
  const gutter = `<text class="ipg-row" x="${xa}" y="${f(cTop)}" text-anchor="middle" dominant-baseline="central" transform="rotate(90 ${xa} ${f(cTop)})">inside the leaf</text>
    <text class="ipg-row" x="${xa}" y="${f(cBot)}" text-anchor="middle" dominant-baseline="central" transform="rotate(90 ${xa} ${f(cBot)})">in the field</text>
    <path class="ipg-ar" d="M${xa},${f(cTop + hTop + 8)}V${f(cBot - hBot - 16)}"/>
    <path class="ipg-hd" d="M${xa},${f(cBot - hBot - 6)}l-5,-11h10Z"/>`;
  return `<svg class="fig-svg ip" viewBox="0 0 800 600" role="img" aria-label="From the lab bench to the field: six research images from 2025 and 2026. Inside the leaf: a rice leaf section with a gene switch that is on only in the bundle sheath, 220 times the promoter activity (Hua and colleagues 2025); RuBisCO packed into droplets inside tobacco chloroplasts, carboxylation rate 3.5 per second, the same as wild type (T. Chen and colleagues 2025); a machine-learned RuBisCO mutation, 29 percent faster carboxylation in the purified enzyme, not yet in plants (McDonald and colleagues 2026). In the field: sorghum with more RuBisCO, 15.5 percent more biomass but seed yield not up (Salesse-Smith and colleagues 2025); a photorespiratory bypass in rice, grain yield per plant 14.2 to 20.2 percent higher (G. Chen and colleagues 2025), and in potato, tuber yield per plant 21.3 to 69.2 percent higher (Lin and colleagues 2025).">${STYLE}${gutter}${top.svg}${bot.svg}${shared}</svg>`;
}
