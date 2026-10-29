// Slide C16 · Improving photosynthesis, figure h (29 Oct 2026, lecture day; lecturer: "only one or two examples, at most
// three, but clearly telling what they did", "the picture should correspond to that one", "something of this year
// (2026)", "very good journals"). Two 2026 projects that make RuBisCO faster, one row each: the paper's own figure panel
// on the left (never stretched: one scale per image), a plain title and three lines on the right (what they did, how
// they tested it, the result with its number and measure). Facts read on the papers' full texts (Europe PMC JATS,
// PMC13282406 and PMC13644767) on 29 Oct 2026.
//   - c16x-yamori-plants.jpg (668 × 314): Yamori et al. 2026, Nat Commun 17:5066, doi 10.1038/s41467-026-73783-w,
//     Fig. 2b (Arabidopsis at 381 µmol mol⁻¹ CO₂, 48 days after sowing; the authors' line labels and 5 cm bar), crop
//     x 668–1336, y 32–346 of the 2000 × 1540 figure (panel letter and CO₂ heading left out). CC BY-NC-ND 4.0: shown
//     cropped only, not altered. Number: shoot dry weight ≈ +35 % for M309I and D397N vs Col-0 (read from the bars of
//     Fig. 2g: ≈ 132 mg vs 176–184 mg; the text gives no percentage).
//   - c16x-mcdonald-t391i.jpg (982 × 628): McDonald et al. 2026, Sci Adv 12:eaeh3246, doi 10.1126/sciadv.aeh3246,
//     Fig. 4E (RuBisCO hexadecamer and the zoom on site T391 beside the small subunit, the authors' 10 Å bar), crop
//     x 0–982, y 1352–1980 of the 1600 × 1980 figure, the panel letter painted out. CC BY 4.0. Number: T391I +29 %
//     carboxylation rate (k_cat^c 4.5 vs 3.5 s⁻¹, purified enzyme, 25 °C; Table 1).
import { shot, type Img } from './cr-common';
import yamJpg from '../../assets/photos/c16x-yamori-plants.jpg';
import mcdJpg from '../../assets/photos/c16x-mcdonald-t391i.jpg';

type A = 'start' | 'middle' | 'end';
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const B = (s: string): string => `<tspan class="iph-b">${s}</tspan>`;

const STYLE = `<style>
.theme-editorial .fig text.iph-t{font-size:21px;font-weight:700;fill:#141413}
.theme-editorial .fig text.iph-l{font-size:16px;font-weight:500;fill:#3d3d3a}
.theme-editorial .fig tspan.iph-b{font-weight:800;fill:#141413}
.theme-editorial .fig text.iph-k{font-size:13px;font-weight:700;fill:#141413}
.theme-editorial .fig text.iph-w{font-size:12px;font-weight:700;fill:#fffdf8}
.theme-editorial .fig text.iph-c{font-size:12px;font-weight:500;fill:#6b6a64}
.iph-dot{fill:#8a877d}
.iph-rule{fill:none;stroke:#d8d5cb;stroke-width:1.2}
</style>`;

const YAM: Img = { href: yamJpg, w: 668, h: 314 };
const MCD: Img = { href: mcdJpg, w: 982, h: 628 };

interface Row {
  title: string[];
  items: string[][];
  credit: string;
  pic: (x: number, y: number) => { svg: string; h: number };
}

/** Text column: x and the line heights. */
const TX = 458, LH = 20;

const ROWS: Array<Row & { y: number }> = [
  {
    y: 30,
    title: ['Editing RuBisCO’s own gene', 'inside the chloroplast'],
    items: [
      ['Base editing changed one amino acid', 'of RuBisCO in the chloroplast DNA'],
      ['Tested in Arabidopsis: 48 days in a', 'growth chamber at today’s CO₂'],
      [`${B('≈ +35 %')} shoot dry weight`, 'vs wild type (M309I or D397N)'],
    ],
    credit: 'Yamori et al. 2026, Nat Commun · Fig. 2b · CC BY-NC-ND 4.0',
    pic: (x, y) => {
      const s = shot('iph-yam', YAM, x, y, 430, { fig: true });
      const lab = T(s.at(78, 0)[0], y - 3, 'wild type', 'iph-k', 'middle')
        + T(s.at(298, 0)[0], y - 3, 'edited', 'iph-k', 'middle')
        + T(s.at(449, 0)[0], y - 3, 'edited', 'iph-k', 'middle');
      const [bx, by] = s.at(627, 279);
      return { svg: `${s.svg}${lab}${T(bx, by, '5 cm', 'iph-w', 'middle')}`, h: s.h };
    },
  },
  {
    y: 318,
    title: ['Machine learning picks', 'a faster RuBisCO'],
    items: [
      ['An AI model chose 49 sites in tobacco', 'RuBisCO; ≈ 400 variants were built'],
      ['Bacteria that grow only if RuBisCO', 'works well picked the winners'],
      [`${B('+29 %')} carboxylation rate (T391I),`, 'measured on the purified enzyme'],
    ],
    credit: 'McDonald et al. 2026, Sci Adv · Fig. 4E · CC BY 4.0',
    pic: (x, y) => {
      const s = shot('iph-mcd', MCD, x, y, 380, { fig: true });
      const [lx, ly] = s.at(85, 190);
      return { svg: `${s.svg}${T(lx, ly, 'RuBisCO', 'iph-k', 'middle')}`, h: s.h };
    },
  },
];

function row(q: Row & { y: number }): string {
  const p = q.pic(0, q.y);
  const title = q.title.map((l, i) => T(TX, q.y + 18 + i * 26, l, 'iph-t')).join('');
  const y0 = q.y + 18 + q.title.length * 26 + 22;
  const items = q.items.map((ls, i) => {
    const y = y0 + i * (ls.length * LH + 14);
    return `<circle class="iph-dot" cx="${TX + 4}" cy="${y - 5}" r="3.2"/>${ls.map((l, j) => T(TX + 16, y + j * LH, l, 'iph-l')).join('')}`;
  }).join('');
  return `${p.svg}${T(0, q.y + p.h + 16, q.credit, 'iph-c')}${title}${items}`;
}

export function draw(): string {
  return `<svg class="fig-svg ip" viewBox="0 0 800 600" role="img" aria-label="Two projects from 2026 that make RuBisCO faster, each with a figure from its paper. First, editing RuBisCO's own gene inside the chloroplast: base editing changed one amino acid of RuBisCO in the chloroplast DNA of Arabidopsis; after 48 days in a growth chamber at today's CO2 the edited lines M309I and D397N had about 35 percent more shoot dry weight than wild type; the photo shows the larger edited rosettes beside wild type. Yamori and colleagues 2026, Nature Communications. Second, machine learning picks a faster RuBisCO: an AI model chose 49 sites in tobacco RuBisCO, about 400 variants were built, and bacteria that grow only if RuBisCO works well picked the winners; the variant T391I carboxylates 29 percent faster, measured on the purified enzyme; the image shows the RuBisCO structure with site T391 next to the small subunit. McDonald and colleagues 2026, Science Advances.">${STYLE}${ROWS.map(row).join('')}<path class="iph-rule" d="M0,${f(300)}H800"/></svg>`;
}
