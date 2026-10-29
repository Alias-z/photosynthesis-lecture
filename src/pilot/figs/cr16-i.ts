// Slide C16 · Improving photosynthesis, figure i (29 Oct 2026, lecture day): the two 2026 projects of figure h
// (figs/cr16-h.ts, where the sources, crops, licences and numbers are listed), each as one big image from its paper with a
// one-line title and its number; fewer words than h. Images never stretched (one scale per image).
//   - c16x-yamori-plants.jpg: Yamori et al. 2026, Nat Commun 17:5066, doi 10.1038/s41467-026-73783-w, Fig. 2b,
//     CC BY-NC-ND 4.0 (cropped only). Number: shoot dry weight ≈ +35 % (read from Fig. 2g), Arabidopsis, growth chamber.
//   - c16x-mcdonald-t391i.jpg: McDonald et al. 2026, Sci Adv 12:eaeh3246, doi 10.1126/sciadv.aeh3246, Fig. 4E, CC BY 4.0.
//     Number: T391I +29 % carboxylation rate, purified tobacco RuBisCO (Table 1).
import { shot, type Img } from './cr-common';
import yamJpg from '../../assets/photos/c16x-yamori-plants.jpg';
import mcdJpg from '../../assets/photos/c16x-mcdonald-t391i.jpg';

type A = 'start' | 'middle' | 'end';
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

const STYLE = `<style>
.theme-editorial .fig text.ipi-t{font-size:21px;font-weight:700;fill:#141413}
.theme-editorial .fig text.ipi-n{font-size:46px;font-weight:800;fill:#141413}
.theme-editorial .fig text.ipi-m{font-size:15px;font-weight:500;fill:#3d3d3a}
.theme-editorial .fig text.ipi-k{font-size:14px;font-weight:700;fill:#141413}
.theme-editorial .fig text.ipi-w{font-size:13px;font-weight:700;fill:#fffdf8}
.theme-editorial .fig text.ipi-c{font-size:12px;font-weight:500;fill:#6b6a64}
.ipi-rule{fill:none;stroke:#d8d5cb;stroke-width:1.2}
</style>`;

const YAM: Img = { href: yamJpg, w: 668, h: 314 };
const MCD: Img = { href: mcdJpg, w: 982, h: 628 };
/** Every image is IH tall; its text column starts tx (28 right of the image). */
const IH = 244;

interface Row { y: number; tx: number; title: string; num: string; measure: string[]; credit: string; pic: (y: number) => string }
const ROWS: Row[] = [
  {
    y: 26, tx: 548,
    title: 'RuBisCO gene edited',
    num: '≈ +35 %',
    measure: ['shoot dry weight vs wild type', 'Arabidopsis, growth chamber'],
    credit: 'Yamori et al. 2026, Nat Commun · Fig. 2b · CC BY-NC-ND 4.0',
    pic: y => {
      const s = shot('ipi-yam', YAM, 0, y, (IH * YAM.w) / YAM.h, { fig: true });
      const [bx, by] = s.at(627, 279);
      return `${s.svg}${T(s.at(78, 0)[0], y - 3, 'wild type', 'ipi-k', 'middle')}${T(s.at(298, 0)[0], y - 3, 'edited', 'ipi-k', 'middle')}`
        + `${T(s.at(449, 0)[0], y - 3, 'edited', 'ipi-k', 'middle')}${T(bx, by, '5 cm', 'ipi-w', 'middle')}`;
    },
  },
  {
    y: 318, tx: 410,
    title: 'AI-chosen RuBisCO',
    num: '+29 %',
    measure: ['carboxylation rate (T391I)', 'purified tobacco enzyme'],
    credit: 'McDonald et al. 2026, Sci Adv · Fig. 4E · CC BY 4.0',
    pic: y => {
      const s = shot('ipi-mcd', MCD, 0, y, (IH * MCD.w) / MCD.h, { fig: true });
      const [lx, ly] = s.at(85, 190);
      return `${s.svg}${T(lx, ly, 'RuBisCO', 'ipi-k', 'middle')}`;
    },
  },
];

const row = (q: Row): string => `${q.pic(q.y)}${T(0, q.y + IH + 16, q.credit, 'ipi-c')}
  ${T(q.tx, q.y + 64, q.title, 'ipi-t')}${T(q.tx, q.y + 124, q.num, 'ipi-n')}
  ${q.measure.map((l, i) => T(q.tx, q.y + 152 + i * 20, l, 'ipi-m')).join('')}`;

export function draw(): string {
  return `<svg class="fig-svg ip" viewBox="0 0 800 600" role="img" aria-label="Two projects from 2026 that make RuBisCO faster, one big image each. RuBisCO gene edited: Arabidopsis rosettes, the edited lines larger than wild type; about 35 percent more shoot dry weight in a growth chamber, Yamori and colleagues 2026, Nature Communications. AI-chosen RuBisCO: the RuBisCO structure with the mutated site T391; carboxylation rate up 29 percent in the purified tobacco enzyme, McDonald and colleagues 2026, Science Advances.">${STYLE}${ROWS.map(row).join('')}<path class="ipi-rule" d="M0,300H800"/></svg>`;
}
