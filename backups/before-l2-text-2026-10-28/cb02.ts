// Slide C2 · Rubisco (lecture 2 chunk 1, prefix cb, overnight build 28 Oct 2026; draft for the lecturer). What Rubisco
// makes first (¹⁴C: 3-PGA), how fast one site works (k_cat ≈ 3 s⁻¹, Bar-On & Milo 2019), and how much of it a leaf
// holds (≈ 20 % of leaf N, ≈ 40 % of soluble protein, Evans & Clarke 2019). The reaction itself is written once, on C1.
// Real figures: Calvin 1961 Nobel lecture Fig. 6 (5 s chromatogram, © The Nobel Foundation, whole scan); the lollipop
// apparatus, Berkeley Lab photo (R. M. Couto, colorised by LBL; © The Regents of the University of California);
// D. S. Goodsell, PDB-101 Molecule of the Month 11, spinach Rubisco L₈S₈ (CC BY 4.0). Credits: assets/SOURCES-cb.md.
// Variants v1–v8 are new; the earlier c02 figures (a–j, unpicked) follow, drawn by ./c02.
import type { PlateText, Variant } from '../types';
import { draw as oldDraw, VARIANTS as OLD } from './c02';
import s5Png from '../../assets/photos/c2-5s.png';
import lolJpg from '../../assets/photos/cb-lollipop-lbl.jpg';
import goodJpg from '../../assets/photos/c2-goodsell.jpg';
import { ar, carbons, co2g, credit, cycleWheel, f, pill, rowW, shot, svg, T, it, type Img, type Pt } from './cb-common';

export const PLATE: PlateText = {
  n: 'C2',
  title: 'Rubisco',
  status: 'draft',
  lead: 'Rubisco, the enzyme that fixes CO₂, works slowly, so leaves hold large amounts of it.',
  points: [
    { claim: 'First product: 3-PGA.', text: '¹⁴CO₂ fed to algae for fractions of a second labels 3-PGA first<br>A three-carbon product: hence “C₃ photosynthesis”' },
    { claim: 'Turnover number.', text: '<i>k</i><sub>cat</sub> ≈ 3 CO₂ per second per active site, at 25 °C' },
    { claim: 'Abundance.', text: '≈ 20 % of the nitrogen of a C₃ leaf<br>≈ 40 % of its soluble protein' },
  ],
  refs: [
    { label: 'Calvin 1961 (Nobel lecture)', url: 'https://www.nobelprize.org/prizes/chemistry/1961/calvin/lecture/' },
    { label: 'Bar-On & Milo 2019', url: 'https://doi.org/10.1073/pnas.1816654116' },
    { label: 'Evans & Clarke 2019', url: 'https://doi.org/10.1093/jxb/ery366' },
    { label: 'Goodsell, PDB-101', url: 'https://pdb101.rcsb.org/motm/11' },
  ],
};

const NEW: Variant[] = [
  { id: 'v1', name: '5 s chromatogram: 3-PGA first' },
  { id: 'v2', name: 'The lollipop (photo) and its 5 s result' },
  { id: 'v3', name: 'RuBP + CO₂ → 2 3-PGA in carbon squares' },
  { id: 'v4', name: 'Spinach Rubisco, 8 large + 8 small subunits' },
  { id: 'v5', name: 'Leaf nitrogen: the Rubisco share (bars)' },
  { id: 'v6', name: 'Structure beside the nitrogen share' },
  { id: 'v7', name: 'Wheel with carboxylation lit, Rubisco shown' },
  { id: 'v8', name: 'Where the new carbon goes: reaction over the 5 s spots' },
];
// No picks on C2 yet (picks.json, 28 Oct 2026): new variants first, then the earlier unpicked ones.
export const VARIANTS: Variant[] = [...NEW, ...OLD];

const NOBEL = '© The Nobel Foundation 1961, www.nobelprize.org';
const S5: Img = { href: s5Png, w: 1349, h: 1025 };
/** Spot centres on the 5 s scan (file pixels). */
const SP5 = { pga: [975, 708] as Pt, sp: [900, 786] as Pt, tp: [695, 735] as Pt, origin: [1330, 1000] as Pt };
const LOL: Img = { href: lolJpg, w: 1274, h: 884 };
const GOOD: Img = { href: goodJpg, w: 1400, h: 776 };
/** Goodsell's spinach L₈S₈ only (the left molecule), file pixels. */
const L8S8: [number, number, number, number] = [25, 25, 830, 735];
const G = { large: [745, 380] as Pt, largeLL: [160, 560] as Pt, small: [312, 622] as Pt };
const CR_GOOD = 'D. S. Goodsell, PDB-101 Molecule of the Month 11 (PDB 1RCX) · CC BY 4.0';
const CR_LOL = 'The “lollipop”: Berkeley Lab photo (R. M. Couto), colorised by LBL · © The Regents of the University of California';

/** RuBP + CO₂ → 3-PGA + 3-PGA as carbon atoms, centred on cx, atoms' top at y. CO₂ is its O–C–O glyph; its carbon
 *  carries the amber halo of the newly fixed carbon. */
function reaction(p: string, cx: number, y: number, d = 34): string {
  const g = 5, w = (n: number): number => rowW(n, d, g), plus = 44, arrow = 150, rc = d * 0.4, wc = rc * 5.1;
  const total = w(5) + plus + wc + arrow + w(3) + plus + w(3);
  let x = cx - total / 2;
  const xs = { rubp: x, co2: (x += w(5) + plus), a0: (x += wc + 14), a1: (x += arrow - 28), p1: (x += 14), p2: (x += w(3) + plus) };
  const lab = (x0: number, wd: number, s: string, sub: string): string =>
    `${T(x0 + wd / 2, y + d + 32, s, 'fcb-node', 'middle')}${sub ? T(x0 + wd / 2, y + d + 58, sub, 'fcb-s', 'middle') : ''}`;
  return `${carbons(xs.rubp, y, 'ccccc', d, g)}${T(xs.co2 - plus / 2, y + d / 2 + 10, '+', 'fcb-big', 'middle')}
    <circle class="fcb-halo-n" cx="${f(xs.co2 + wc / 2)}" cy="${f(y + d / 2)}" r="${f(rc + 3.2)}"/>${co2g(xs.co2 + wc / 2, y + d / 2, rc)}
    ${ar(p, 'green', `M${f(xs.a0)},${f(y + d / 2)} L${f(xs.a1)},${f(y + d / 2)}`, 'fcb-fat')}${T((xs.a0 + xs.a1) / 2, y - 14, 'Rubisco', 'fcb-h fcb-c-green', 'middle')}
    ${carbons(xs.p1, y, 'ncc', d, g)}${T(xs.p2 - plus / 2, y + d / 2 + 10, '+', 'fcb-big', 'middle')}${carbons(xs.p2, y, 'ccc', d, g)}
    ${lab(xs.rubp, w(5), 'RuBP', '5 C')}${lab(xs.co2, wc, 'CO₂', '')}${lab(xs.p1, w(3), '3-PGA', '3 C')}${lab(xs.p2, w(3), '3-PGA', '3 C')}`;
}

/* ---------- v1 · the 5 s chromatogram, whole, with what it shows ---------- */

function v1(): string {
  const p = 'fcb2v1', a = shot(`${p}-a`, S5, 90, 64, 620, { fig: true });
  return svg(p, 'The paper chromatogram of an extract of the alga Chlorella after 5 seconds of photosynthesis in carbon-14 dioxide, made visible on X-ray film. Each dark spot is a compound that carries carbon-14. The largest share is in 3-phosphoglycerate (3-PGA); some is in sugar phosphates.', `
    ${a.svg}
    ${pill(400, 36, `5 s in ¹⁴CO₂ · ${it('Chlorella')}`, undefined, true)}
    ${pill(590, 330, '3-PGA', a.at(...SP5.pga), true)}${pill(330, 520, 'sugar phosphates', a.at(...SP5.sp), true)}
    ${pill(690, 548, 'origin', a.at(1325, 1010), true)}
    ${T(90, 562, 'dark spot = a compound carrying ¹⁴C', 'fcb-l', 'start')}
    ${credit(790, 592, `Calvin 1961, Nobel lecture, Fig. 6 · ${NOBEL}`)}
  `);
}

/* ---------- v2 · the lollipop photo beside its result ---------- */

function v2(): string {
  const p = 'fcb2v2', l = shot(`${p}-l`, LOL, 8, 96, 452, { frame: true }), b = shot(`${p}-b`, S5, 478, 120, 316, { fig: true });
  return svg(p, 'Left: Calvin’s lollipop, a flat glass flask of green algae lit by two lamps; carbon-14 dioxide was injected, and after a set time the algae were dropped into alcohol in the flask below, which stops the reactions. Right: the result after 5 seconds, a chromatogram with most of the label in 3-PGA.', `
    ${l.svg}${b.svg}
    ${pill(150, 60, 'algae in light, + ¹⁴CO₂', l.at(470, 330))}
    ${pill(110, 96 + l.h + 34, 'lamp', l.at(150, 330), true)}${pill(330, 96 + l.h + 34, 'alcohol: stops the reactions', l.at(512, 740), true)}
    ${pill(636, 74, '5 s later', undefined, true)}
    ${pill(700, 396, '3-PGA', b.at(...SP5.pga), true)}
    ${ar(p, 'grey', `M${f(8 + 452 + 4)},${f(96 + l.h / 2)} L${f(476)},${f(96 + l.h / 2)}`, 'fcb-thin')}
    ${credit(8, 96 + l.h + 76, CR_LOL, 'start')}${credit(792, 592, `Calvin 1961, Nobel lecture, Fig. 6 · ${NOBEL}`)}
  `);
}

/* ---------- v3 · the reaction in carbon squares ---------- */

function v3(): string {
  const p = 'fcb2v3';
  return svg(p, 'Rubisco adds one CO2 (one carbon, orange) to RuBP (five carbons); the six-carbon product splits at once into two molecules of 3-PGA, three carbons each. The new carbon sits in one of them.', `
    ${reaction(p, 400, 210, 40)}
    ${T(400, 120, 'carboxylation', 'fcb-phase fcb-c-green', 'middle', ' style="font-size:30px"')}
    ${carbons(232, 440, 'n', 26, 0, false)}${T(268, 460, 'carbon from CO₂', 'fcb-l', 'start')}
    ${carbons(480, 440, 'c', 26, 0, false)}${T(516, 460, 'carbon of RuBP', 'fcb-l', 'start')}
    ${T(400, 540, 'RuBP: ribulose 1,5-bisphosphate · 3-PGA: 3-phosphoglycerate', 'fcb-s', 'middle')}
  `);
}

/* ---------- v4 · Goodsell's spinach Rubisco ---------- */

function v4(): string {
  const p = 'fcb2v4', g = shot(`${p}-g`, GOOD, 24, 40, 470, { fig: true, win: L8S8 });
  return svg(p, 'Spinach Rubisco drawn atom by atom by David Goodsell: eight large subunits (orange and red) and eight small subunits (blue and purple). It has eight active sites.', `
    ${g.svg}
    ${pill(150, 40 + g.h + 34, 'small subunit (× 8)', g.at(...G.small), true)}${pill(390, 40 + g.h + 34, 'large subunit (× 8)', g.at(...G.large), true)}
    ${T(640, 230, 'spinach Rubisco', 'fcb-h', 'middle')}
    ${T(640, 330, '8', 'fcb-huge', 'middle', ' style="font-size:72px"')}${T(640, 368, 'active sites', 'fcb-l', 'middle')}
    ${credit(792, 592, CR_GOOD)}
  `);
}

/* ---------- leaf nitrogen bars (Evans & Clarke 2019: Rubisco ≈ 20 % of leaf N; chloroplast ≈ 75 %; ≈ 40 % of soluble protein) ---------- */

function bar(x: number, y: number, w: number, h: number, parts: Array<[number, string, string]>): string {
  let at = x;
  return parts.map(([share, fill, label]) => {
    const wi = w * share, r = `<rect x="${f(at)}" y="${y}" width="${f(wi)}" height="${h}" fill="${fill}" stroke="#fffdf8" stroke-width="2"/>`
      + (label ? T(at + wi / 2, y + h / 2 + 8, label, 'fcb-node', 'middle', fill === '#2a963a' ? ' style="fill:#fffdf8"' : '') : '');
    at += wi;
    return r;
  }).join('');
}
function v5(): string {
  const p = 'fcb2v5', x = 70, w = 660;
  return svg(p, 'Two bars. Nitrogen in a C3 leaf: Rubisco holds about 20 percent; the rest of the chloroplast about 55 percent; the rest of the leaf about 25 percent. Soluble protein of the leaf: Rubisco is about 40 percent.', `
    ${T(x, 120, 'Nitrogen in a C₃ leaf', 'fcb-h', 'start')}
    ${bar(x, 140, w, 70, [[0.20, '#2a963a', 'Rubisco'], [0.55, '#bcd7a6', 'rest of the chloroplast'], [0.25, '#e3e0d6', 'rest of leaf']])}
    ${T(x + w * 0.10, 244, '≈ 20 %', 'fcb-h fcb-c-green', 'middle')}${T(x + w * 0.475, 244, '≈ 55 %', 'fcb-l', 'middle')}${T(x + w * 0.875, 244, '≈ 25 %', 'fcb-l', 'middle')}
    ${T(x, 340, 'Soluble protein of the leaf', 'fcb-h', 'start')}
    ${bar(x, 360, w, 70, [[0.40, '#2a963a', 'Rubisco'], [0.60, '#e3e0d6', 'other soluble proteins']])}
    ${T(x + w * 0.20, 464, '≈ 40 %', 'fcb-h fcb-c-green', 'middle')}
    ${T(400, 560, 'average values for C₃ leaves', 'fcb-s fcb-c-grey', 'middle')}
    ${credit(792, 592, 'Data: Evans & Clarke 2019, J Exp Bot 70:7 (from Evans & Seemann 1984; Eckardt et al. 1997)')}
  `);
}

/* ---------- v6 · structure beside the nitrogen share ---------- */

function v6(): string {
  const p = 'fcb2v6', g = shot(`${p}-g`, GOOD, 20, 100, 360, { fig: true, win: L8S8 });
  const x0 = 410, y0 = 70, w = 100, h = 440;
  const seg = (y: number, hh: number, fill: string, s: string, s2: string, lab: string): string =>
    `<rect x="${x0}" y="${f(y)}" width="${w}" height="${f(hh)}" fill="${fill}" stroke="#fffdf8" stroke-width="2"/>${T(x0 + w + 16, y + hh / 2 - 2, s, `fcb-h${lab}`, 'start')}${T(x0 + w + 16, y + hh / 2 + 24, s2, 'fcb-s', 'start')}`;
  return svg(p, 'Left: spinach Rubisco (Goodsell). Right: a column for all the nitrogen in a C3 leaf; the green bottom fifth is Rubisco, about 20 percent; the chloroplast holds about 75 percent in all.', `
    ${g.svg}
    ${T(200, 72, 'Rubisco', 'fcb-h fcb-c-green', 'middle')}
    ${seg(y0, h * 0.25, '#e3e0d6', 'rest of the leaf', '≈ 25 %', '')}${seg(y0 + h * 0.25, h * 0.55, '#bcd7a6', 'other chloroplast N', '≈ 55 %', '')}${seg(y0 + h * 0.80, h * 0.20, '#2a963a', 'Rubisco', '≈ 20 %', ' fcb-c-green')}
    ${ar(p, 'green', `M${f(20 + 360 + 6)},${f(100 + g.h * 0.62)} C396,${f(100 + g.h * 0.62)} 380,${f(y0 + h * 0.9)} ${x0 - 8},${f(y0 + h * 0.9)}`, 'fcb-thin')}
    ${T(x0 + w / 2, y0 + h + 34, 'leaf nitrogen', 'fcb-l', 'middle')}
    ${credit(20, 592, CR_GOOD, 'start')}${credit(792, 574, 'Evans & Clarke 2019, J Exp Bot 70:7')}
  `);
}

/* ---------- v7 · the wheel with carboxylation lit, and the enzyme beside it ---------- */

function v7(): string {
  const p = 'fcb2v7', g = shot(`${p}-g`, GOOD, 600, 24, 180, { fig: true, win: L8S8 });
  return svg(p, 'The cycle wheel with only carboxylation lit: Rubisco adds 3 CO2 to 3 RuBP, giving 6 3-PGA. A picture of spinach Rubisco sits at the top right.', `
    ${cycleWheel(p, { cx: 400, cy: 322, r: 160, lit: ['carb'], names: 'out', rubisco: true, counts: true, sectors: true })}
    ${g.svg}
    ${T(690, 24 + g.h + 26, 'Rubisco, spinach', 'fcb-s', 'middle')}
    ${credit(792, 592, 'Rubisco: D. S. Goodsell, PDB-101 Molecule of the Month 11 · CC BY 4.0')}
  `);
}

/* ---------- v8 · the reaction over the 5 s spots: the new carbon ends in 3-PGA ---------- */

function v8(): string {
  const p = 'fcb2v8', b = shot(`${p}-b`, S5, 180, 220, 440, { fig: true });
  const pga = b.at(...SP5.pga);
  return svg(p, 'Top: Rubisco adds a carbon-14 dioxide to RuBP, giving two 3-PGA, one carrying the new carbon. Below: the chromatogram after 5 seconds in carbon-14 dioxide; a dashed line leads from the new carbon to the 3-PGA spot, the darkest on the film.', `
    ${reaction(p, 400, 66, 32)}
    ${b.svg}
    <path d="M476,102 C450,210 ${f(pga[0] - 4)},${f(pga[1] - 140)} ${f(pga[0])},${f(pga[1] - 16)}" fill="none" stroke="#c07a12" stroke-width="3" stroke-dasharray="7 6"/>
    ${pill(110, 300, '5 s in ¹⁴CO₂', undefined, true)}${pill(700, 380, '3-PGA', pga, true)}
    ${credit(792, 592, `Calvin 1961, Nobel lecture, Fig. 6 · ${NOBEL}`)}
  `);
}

const DRAW: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7, v8 };
export function draw(id: string): string {
  return DRAW[id] ? DRAW[id]() : oldDraw(id);
}
