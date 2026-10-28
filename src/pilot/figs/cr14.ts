// Slide C14 · Rising CO₂ (pick key C13). Chunk cr, overnight build of 28 Oct 2026; text and figures are a proposal for
// the lecturer, not yet approved. Research notes: scratch cr/NOTES_SOURCES.md; credits: assets/SOURCES-cr.md.
// Facts used, and no others:
//   - FACE, 186 studies of 18 C₃ crops, ≈ +200 ppm: yield ≈ +18 % without stress, ≈ +10 % with low N or ≈ 2 °C warming;
//     C₄ crops gain only in drought; Zn and Fe fall in most crops, N and protein in non-legume seeds (Ainsworth & Long
//     2021, abstract; Fig. 2 values measured on the published figure: 0.0 at x 583, 0.2 at x 946 px).
//   - Leakey et al. 2009 (full text): soybean Cᵢ ≈ 270 → 384 µmol mol⁻¹ at 384 → 550 ppm, photosynthesis +29 %, because
//     more CO₂ at RuBisCO speeds carboxylation and suppresses oxygenation; maize gains no carbon (C₄ concentrates CO₂ up
//     to six times ambient in the bundle sheath); FACE lowers stomatal conductance (sorghum −32 %, −37 % in drought).
//     Fig. 4 curves digitised from the published figure (x 48 px per 100 µmol mol⁻¹, y 4.46 px per µmol m⁻² s⁻¹).
//   - Myers et al. 2014 (full text): FACE at 546–586 ppm; wheat Zn −9.3 %, Fe −5.1 %, protein −6.3 %; rice protein −7.8 %;
//     C₃ grains and legumes lose Zn and Fe; legumes keep protein; C₄ crops less affected.
//   - Zhu, Long & Ort 2010 Table 1 (full text): SoyFACE soybean 2002, 380 vs 550 ppm: εi 0.89 vs 0.89, εc 0.032 vs 0.038
//     (+18.8 %), εp 0.60 vs 0.58, seed yield 4.60 vs 5.29 t ha⁻¹ (+15 %).
//   - Leakey et al. 2006 (abstract, via review D): maize at SoyFACE not affected by 550 ppm without drought.
// Old figures g and h (c12b, drawn by c12) stay listed after the new ones; no picks exist for this slide (picks.json).
import type { PlateText, Variant } from '../types';
import { draw as drawOld } from './c12b';
import {
  ar, box, credit, f, line, maizeCob, pill, shot, smooth, svg, T, wheatEar, yieldChain,
  type Img, type Pt,
} from './cr-common';
import faceJpg from '../../assets/photos/cr-face-wheat.jpg';
import soyBJpg from '../../assets/photos/cr-soyface-b.jpg';
import soyCJpg from '../../assets/photos/cr-soyface-c.jpg';
import myersJpg from '../../assets/photos/cr-myers-f1.jpg';
import al1Jpg from '../../assets/photos/cr-al21-f1.jpg';
import earJpg from '../../assets/photos/cr-ear.jpg';

export const PLATE: PlateText = {
  n: 'C14',
  pick: 'C13',
  title: 'Rising CO₂',
  status: 'draft',
  lead: 'Higher CO₂ suppresses RuBisCO’s oxygenation, so it raises the yield of C₃ crops; C₄ crops are already CO₂-saturated.',
  points: [
    { claim: 'C₃ crops.', text: 'Free-air CO₂ enrichment (FACE), +200 ppm: yield ≈ +18 %<br>With low nitrogen or 2 °C warming: ≈ +10 %' },
    { claim: 'C₄ crops.', text: 'No yield gain, except in drought<br>Narrower stomata save soil water' },
    { claim: 'Grain quality.', text: 'C₃ grains and legume seeds: less zinc and iron<br>Wheat and rice grain: less protein' },
  ],
  refs: [
    { label: 'Ainsworth & Long 2021', url: 'https://doi.org/10.1111/gcb.15375' },
    { label: 'Leakey et al. 2009', url: 'https://doi.org/10.1093/jxb/erp096' },
    { label: 'Myers et al. 2014', url: 'https://doi.org/10.1038/nature13179' },
    { label: 'Zhu, Long & Ort 2010', url: 'https://doi.org/10.1146/annurev-arplant-042809-112206' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'v1', name: 'FACE wheat ring + result' },
  { id: 'v2', name: 'Yield response by crop (redrawn)' },
  { id: 'v3', name: 'C₃ vs C₄ leaf at 2009 and 2050 CO₂ (redrawn)' },
  { id: 'v4', name: 'Grain nutrients (real figure)' },
  { id: 'v5', name: 'Wheat ear + yield and nutrients' },
  { id: 'v6', name: 'SoyFACE: soybean vs maize (photos)' },
  { id: 'v7', name: 'Yield chain: CO₂ acts on conversion' },
  { id: 'v8', name: 'CO₂ rise and FACE sites (real figure)' },
  { id: 'v9', name: 'C₃ vs C₄ crops (drawn table)' },
  { id: 'g', name: 'C₃ vs C₄ (old)' },
  { id: 'h', name: 'Field test (old)' },
];

/* ---------- images ---------- */
const FACE: Img = { href: faceJpg, w: 1464, h: 728 };
const SOYB: Img = { href: soyBJpg, w: 671, h: 284 };
const SOYC: Img = { href: soyCJpg, w: 671, h: 304 };
const MYERS: Img = { href: myersJpg, w: 800, h: 516 };
const AL1: Img = { href: al1Jpg, w: 1600, h: 908 };
const EAR: Img = { href: earJpg, w: 1200, h: 800 };
const CR = {
  face: 'photo: B. Kimball, USDA-ARS, wheat FACE ring (1993) · public domain',
  al: 'data: Ainsworth & Long 2021, Glob Change Biol, Fig. 2',
  alF2: 'redrawn from Ainsworth & Long 2021, Glob Change Biol, Fig. 2 (values read off the figure)',
  leakey: 'redrawn from Leakey et al. 2009, J Exp Bot, Fig. 4',
  myers: 'Myers et al. 2014, Nature, Fig. 1 · © Springer Nature (author manuscript)',
  soy: 'photos: Aspray et al. 2023, Sci Data, Fig. 1b–c · CC BY 4.0',
  zhuT1: 'data: Zhu, Long & Ort 2010, Annu Rev Plant Biol, Table 1 (soybean, SoyFACE 2002)',
  alF1: 'Ainsworth & Long 2021, Glob Change Biol, Fig. 1 · © Wiley',
  ear: 'photo: P. Alexander, Wikimedia Commons · CC0',
};

/* ---------- data ---------- */

/** Ainsworth & Long 2021, Fig. 2: proportionate yield change at ≈ +200 ppm (mean and error bar), measured on the figure. */
const AL21: Array<{ k: string; m: number; lo: number; hi: number; c4?: boolean }> = [
  { k: 'wheat', m: 14.1, lo: 9.0, hi: 21.9 },
  { k: 'rice', m: 14.1, lo: 12.7, hi: 15.7 },
  { k: 'legumes', m: 20.4, lo: 18.7, hi: 24.0 },
  { k: 'root crops', m: 21.9, lo: 14.7, hi: 32.5 },
  { k: 'low nitrogen', m: 10.0, lo: 7.9, hi: 12.7 },
  { k: '≈ 2 °C warmer', m: 9.8, lo: 7.9, hi: 13.6 },
  { k: 'all studies', m: -2.9, lo: -6.2, hi: 1.7, c4: true },
  { k: 'in drought', m: 20.3, lo: 17.6, hi: 23.6, c4: true },
];
const C3_ALL = 17.7;

/** Leakey et al. 2009, Fig. 4, digitised: A (µmol m⁻² s⁻¹) against Cᵢ (µmol mol⁻¹). */
const C3K: Array<[number, number]> = [[60, 0], [91, 3.8], [116, 6.5], [141, 9.2], [166, 11.7], [191, 14.1], [216, 16.4], [241, 18.4],
  [266, 20.5], [291, 22.3], [316, 24.0], [341, 25.2], [366, 26.1], [403, 27.1], [441, 28.0], [478, 28.7], [516, 29.3], [564, 29.9],
  [630, 30.7], [697, 31.4], [747, 31.75]];
const C4K: Array<[number, number]> = [[0, 0], [16, 17.5], [28, 26.8], [41, 33.5], [53, 38.5], [66, 42.0], [78, 44.7], [91, 46.6],
  [103, 47.9], [116, 48.9], [128, 49.6], [141, 50.0], [153, 50.5], [178, 50.9], [203, 51.1], [253, 51.3], [750, 51.3]];
const c3A = smooth(C3K), c4A = smooth(C4K);

/* ---------- v1 · the FACE ring in wheat, with the 30-year result for C₃ and C₄ crops ---------- */

function result(p: string, x: number, y: number, c4: boolean, big: string, sub: string, icon = true): string {
  const k = c4 ? 'c4' : 'c3';
  return `${icon ? (c4 ? maizeCob(x + 40, y - 6, 96) : wheatEar(x + 40, y - 14, 92, 'cr-ear')) : ''}
    ${T(x + 96, y + 14, c4 ? 'C₄ crops' : 'C₃ crops', `cr-h cr-c-${k}`)}
    ${T(x + 96, y + 64, big, `cr-huge cr-c-${k}`)}
    ${T(x + 96, y + 100, sub, 'cr-s')}`;
}

function drawV1(): string {
  const p = 'fcr14v1', a = shot(`${p}-ph`, FACE, 0, 0, 800, { win: [0, 90, 1464, 600] });
  return svg(p, 'Photo of a free-air CO2 enrichment ring in a wheat field: a circle of vertical pipes releases CO2 over an open-air plot. Below, the result of 30 years of such experiments: C3 crops gained about 18 percent yield at about 200 ppm more CO2; C4 crops gained nothing, except in drought.', `
    ${a.svg}
    ${pill(212, 34, 'free-air CO₂ enrichment (FACE)')}
    ${pill(560, 150, 'CO₂ released from vertical pipes', [a.at(726, 548), a.at(1036, 520)])}
    ${pill(96, 292, 'wheat', a.at(330, 420))}
    ${result(p, 30, 410, false, '+18 %', 'yield at ≈ +200 ppm CO₂')}
    ${result(p, 420, 410, true, '≈ 0 %', 'gain only in drought')}
    ${credit(784, 572, `${CR.face} | ${CR.al}`)}
  `);
}

/* ---------- v2 · yield response per crop, redrawn from Ainsworth & Long 2021 Fig. 2 ---------- */

function drawV2(): string {
  const p = 'fcr14v2', x0 = 262, x1 = 690, lo = -10, hi = 35;
  const X = (v: number): number => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const y0 = 78, dy = 54, Y = (i: number): number => y0 + i * dy + (i >= 6 ? 26 : 0);
  const bandC3 = `<rect class="cr-band-c3" x="14" y="${Y(0) - 26}" width="772" height="${Y(5) - Y(0) + 52}" rx="12"/>`;
  const bandC4 = `<rect class="cr-band-c4" x="14" y="${Y(6) - 26}" width="772" height="${Y(7) - Y(6) + 52}" rx="12"/>`;
  const rows = AL21.map((r, i) => {
    const y = Y(i), k = r.c4 ? 'c4' : 'c3';
    const v = `${r.m > 0 ? '+' : '−'}${Math.round(Math.abs(r.m))} %`;
    return `${T(x0 - 18, y + 7.5, r.k, 'cr-l', 'end')}
      <path class="cr-ci cr-ci-${k}" d="M${f(X(r.lo))},${y} H${f(X(r.hi))} M${f(X(r.lo))},${y - 9} v18 M${f(X(r.hi))},${y - 9} v18"/>
      <rect class="cr-bar-${k}" x="${f(X(r.m) - 9)}" y="${y - 9}" width="18" height="18" rx="3"/>
      ${T(778, y + 8, v, `cr-val cr-c-${k}`, 'end')}`;
  }).join('');
  const ticks = [-10, 0, 10, 20, 30].map(v => `<path class="cr-axis" d="M${f(X(v))},${Y(7) + 30} v8"/>${T(X(v), Y(7) + 62, `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)}`, 'cr-tk', 'middle')}`).join('');
  return svg(p, 'Redrawn from Ainsworth and Long 2021: yield change at about 200 ppm more CO2 in free-air experiments. C3 crops: wheat plus 14 percent, rice plus 14, legumes plus 20, root crops plus 22; with low nitrogen plus 10; with about 2 degrees of warming plus 10; the C3 average is plus 18. C4 crops: all studies minus 3, not different from zero; in drought plus 20.', `
    ${bandC3}${bandC4}
    ${T(28, Y(0) + 8, 'C₃', 'cr-big cr-c-c3')}${T(28, Y(6) + 8, 'C₄', 'cr-big cr-c-c4')}
    <path class="cr-zero" d="M${f(X(0))},${Y(0) - 30} V${Y(7) + 30}"/>
    <path class="cr-ci cr-ci-c3 cr-dash" d="M${f(X(C3_ALL))},${Y(0) - 26} V${Y(5) + 26}"/>
    ${T(X(C3_ALL) + 8, Y(5) + 50, 'C₃ mean +18 %', 'cr-s cr-c-c3')}
    ${rows}
    <path class="cr-axis" d="M${x0},${Y(7) + 34} H${x1}"/>${ticks}
    ${T((x0 + x1) / 2, Y(7) + 92, 'yield change at ≈ +200 ppm CO₂ (%)', 'cr-ax', 'middle')}
    ${credit(784, 592, CR.alF2)}
  `);
}

/* ---------- v3 · why C₃ gains and C₄ does not: A against Cᵢ, redrawn from Leakey et al. 2009 Fig. 4 ---------- */

function drawV3(): string {
  const p = 'fcr14v3', gx0 = 108, gx1 = 760, gy0 = 440, gy1 = 40;
  const X = (ci: number): number => gx0 + (ci / 800) * (gx1 - gx0), Y = (a: number): number => gy0 - (a / 60) * (gy0 - gy1);
  const P = (ci: number, a: number): Pt => [X(ci), Y(a)];
  const curve = (fn: (c: number) => number, c0: number, c1: number): string => {
    const pts: Pt[] = [];
    for (let c = c0; c <= c1; c += 4) pts.push(P(c, fn(c)));
    return line(pts);
  };
  const ci3 = [270, 384], ci4 = [155, 215], ca = [384, 550];
  const sup = ca.map((c, i) => `<path class="cr-sup" d="${line([P(c, 0), P(ci3[i], c3A(ci3[i]))])}"/><path class="cr-sup" d="${line([P(c, 0), P(ci4[i], c4A(ci4[i]))])}"/>`).join('');
  const dot = (ci: number, a: number, k: 'c3' | 'c4', open: boolean): string =>
    open ? `<circle class="cr-dot-o" stroke="${k === 'c3' ? '#a9532f' : '#237a72'}" cx="${f(X(ci))}" cy="${f(Y(a))}" r="9"/>` : `<circle class="cr-dot-${k}" cx="${f(X(ci))}" cy="${f(Y(a))}" r="10"/>`;
  const xt = [0, 200, 400, 600, 800].map(v => `<path class="cr-axis" d="M${f(X(v))},${gy0} v8"/>${T(X(v), gy0 + 32, `${v}`, 'cr-tk', 'middle')}`).join('');
  const yt = [0, 20, 40, 60].map(v => `<path class="cr-axis" d="M${gx0},${f(Y(v))} h-8"/>${T(gx0 - 14, Y(v) + 7, `${v}`, 'cr-tk', 'end')}`).join('');
  const chip = (x: number, y: number, s: string, k: 'c3' | 'c4'): string =>
    `<rect class="cr-chip-${k}" x="${f(x - 46)}" y="${f(y - 20)}" width="92" height="40" rx="20"/>${T(x, y + 8, s, 'cr-val cr-c-paper', 'middle')}`;
  const [a3, b3] = [P(ci3[0], c3A(ci3[0])), P(ci3[1], c3A(ci3[1]))];
  return svg(p, 'Redrawn from Leakey and colleagues 2009: net CO2 uptake A against the CO2 inside the leaf, Ci, for C4 maize and C3 soybean. Maize saturates at low Ci, so raising the air CO2 from 384 ppm in 2009 to 550 ppm in 2050 adds no uptake. Soybean sits on the rising part: its Ci rises from about 270 to 384 and photosynthesis rises by 29 percent.', `
    <path class="cr-axis" d="M${gx0},${gy1 - 10} V${gy0} H${gx1 + 10}"/>${xt}${yt}
    ${sup}
    <path class="cr-c4" d="${curve(c4A, 0, 760)}"/>
    <path class="cr-c3" d="${curve(c3A, 60, 760)}"/>
    ${T(gx1, Y(51.3) - 16, 'C₄ maize', 'cr-h cr-c-c4', 'end')}
    ${T(gx1, Y(31.75) + 40, 'C₃ soybean', 'cr-h cr-c-c3', 'end')}
    ${dot(ci4[0], c4A(ci4[0]), 'c4', true)}${dot(ci4[1], c4A(ci4[1]), 'c4', false)}
    ${dot(ci3[0], c3A(ci3[0]), 'c3', true)}${dot(ci3[1], c3A(ci3[1]), 'c3', false)}
    ${ar(p, 'c3', `M${f(a3[0] + 12)},${f(a3[1] - 6)} Q${f((a3[0] + b3[0]) / 2 - 6)},${f(b3[1] - 4)} ${f(b3[0] - 14)},${f(b3[1] + 1)}`, 'cr-thin')}
    ${chip(X(505), Y(19), '+29 %', 'c3')}${chip(X(190), Y(57), '0 %', 'c4')}
    <circle class="cr-dot-o" stroke="#4a4945" cx="${f(X(384) - 160)}" cy="${gy0 + 66}" r="8"/>${T(X(384) - 144, gy0 + 73, '384 ppm (2009)', 'cr-s')}
    <circle class="cr-dot-c3" style="fill:#4a4945" cx="${f(X(550) - 2)}" cy="${gy0 + 66}" r="9"/>${T(X(550) + 14, gy0 + 73, '550 ppm (2050)', 'cr-s')}
    ${T(gx0 + 6, gy0 + 73, 'air:', 'cr-s')}
    <text class="cr-ax" transform="translate(36 ${f((gy0 + gy1) / 2)}) rotate(-90)" text-anchor="middle">CO₂ uptake, <tspan class="cr-it">A</tspan> (µmol m⁻² s⁻¹)</text>
    ${T((gx0 + gx1) / 2, gy0 + 114, 'CO₂ inside the leaf, <tspan class="cr-it">C</tspan>ᵢ (µmol mol⁻¹)', 'cr-ax', 'middle')}
    ${credit(784, 594, CR.leakey)}
  `);
}

/* ---------- v4 · the published nutrient figure (Myers et al. 2014 Fig. 1), with its message ---------- */

function drawV4(): string {
  const p = 'fcr14v4', a = shot(`${p}-m`, MYERS, 70, 70, 720, { fig: true });
  const cy = 70 + a.h / 2;
  return svg(p, 'Myers and colleagues 2014, figure 1: percent change in grain zinc, iron, protein and phytate when crops grew at about 550 ppm CO2 in free-air experiments. Wheat, rice, field peas and soybeans, all C3, lost zinc and iron; wheat and rice also lost protein. Maize and sorghum, C4, changed less.', `
    ${a.svg}
    <text class="cr-ax" transform="translate(40 ${f(cy)}) rotate(-90)" text-anchor="middle">change at ≈ 550 ppm CO₂ (%)</text>
    ${pill(330, 40, 'C₃: less zinc and iron', [a.at(69, 265), a.at(324, 240), a.at(440, 224)])}
    ${pill(660, 40, 'C₄: less affected', [a.at(579, 224), a.at(695, 186)])}
    ${pill(...a.at(190, 306), 'wheat zinc −9 %', a.at(69, 265), true)}
    ${credit(784, 590, CR.myers)}
  `);
}

/* ---------- v5 · one crop, both effects: a wheat ear beside its yield and nutrient changes ---------- */

function drawV5(): string {
  const p = 'fcr14v5', ph = shot(`${p}-ear`, EAR, 16, 28, 250, { win: [580, 40, 360, 720] });
  const x0 = 540, k = 12.5, rows = [
    { n: 'grain yield', v: 14.1, s: '+14 %' }, { n: 'zinc', v: -9.3, s: '−9 %' }, { n: 'iron', v: -5.1, s: '−5 %' }, { n: 'protein', v: -6.3, s: '−6 %' },
  ];
  const body = rows.map((r, i) => {
    const y = 140 + i * 96, x1 = x0 + r.v * k, up = r.v > 0;
    return `${T(300, y, r.n, 'cr-h')}
      <rect class="${up ? 'cr-bar-up' : 'cr-bar-dn'}" x="${f(Math.min(x0, x1))}" y="${y + 14}" width="${f(Math.abs(x1 - x0))}" height="34" rx="4"/>
      ${T(up ? x1 + 12 : x1 - 12, y + 40, r.s, 'cr-val', up ? 'start' : 'end')}`;
  }).join('');
  return svg(p, 'Photo of a green wheat ear. Beside it, wheat grown at about 550 ppm CO2 in free-air experiments compared with today’s air: grain yield plus 14 percent, zinc minus 9 percent, iron minus 5 percent, protein minus 6 percent.', `
    ${ph.svg}
    ${T(300, 64, 'wheat, ≈ 550 ppm vs today’s air', 'cr-lb')}
    <path class="cr-zero" d="M${x0},${110} V${520}"/>
    ${body}
    ${credit(784, 572, `${CR.ear} | yield: Ainsworth & Long 2021, Fig. 2 · zinc, iron, protein: Myers et al. 2014`)}
  `);
}

/* ---------- v6 · two real FACE plots: C₃ soybean and C₄ maize at SoyFACE ---------- */

function drawV6(): string {
  const p = 'fcr14v6', w = 382;
  const b = shot(`${p}-b`, SOYB, 8, 22, w, { win: [8, 40, 282, 222] });
  const c = shot(`${p}-c`, SOYC, 410, 22, w, { win: [150, 40, 285, 224] });
  const y = 22 + b.h;
  const res = (x: number, k: 'c3' | 'c4', name: string, big: string, l1: string): string =>
    `${T(x, y + 50, name, `cr-h cr-c-${k}`)}${T(x, y + 112, big, `cr-huge cr-c-${k}`)}${T(x, y + 150, l1, 'cr-s')}`;
  return svg(p, 'Two photos from the SoyFACE site in Illinois. Left: a soybean plot, a C3 crop, inside an octagon of gas pipes that release CO2. Right: the gas supply beside a maize plot, a C4 crop. At 550 ppm CO2, soybean seed yield rose 15 percent; maize yield did not rise without drought.', `
    ${b.svg}${c.svg}
    ${pill(200, 282, 'CO₂ pipe ring', b.at(150, 168))}
    ${pill(600, 64, 'gas supply', c.at(400, 150))}
    ${res(16, 'c3', 'soybean (C₃)', '+15 %', 'seed yield at 550 ppm (2002)')}
    ${res(420, 'c4', 'maize (C₄)', '≈ 0 %', 'no gain without drought')}
    ${credit(784, 556, `${CR.soy} | soybean: Zhu, Long & Ort 2010, Table 1 · maize: Leakey et al. 2006`)}
  `);
}

/* ---------- v7 · the yield chain with its conversion link lit: what 550 ppm changed in SoyFACE soybean ---------- */

function drawV7(): string {
  const p = 'fcr14v7';
  return svg(p, 'The yield chain: sunlight times light interception times conversion efficiency times harvest index gives grain yield. In soybean at SoyFACE in 2002, raising CO2 from 380 to 550 ppm left light interception at 0.89, raised conversion efficiency from 0.032 to 0.038, or 19 percent, left harvest index nearly unchanged at 0.60 to 0.58, and raised seed yield from 4.6 to 5.3 tonnes per hectare, or 15 percent.', `
    ${T(400, 70, 'soybean: 380 → 550 ppm CO₂', 'cr-h', 'middle')}
    ${yieldChain(p, 236, ['conv', 'yield'], {
      sun: ['same'], int: ['±0 %', '0.89 → 0.89'], conv: ['+19 %', '0.032 → 0.038'], hi: ['−3 %', '0.60 → 0.58'], yield: ['+15 %', '4.6 → 5.3', 't ha⁻¹'],
    })}
    ${credit(784, 588, CR.zhuT1)}
  `);
}

/* ---------- v8 · the published CO₂ record with the start of each crop FACE experiment (Ainsworth & Long 2021 Fig. 1) ---------- */

function drawV8(): string {
  const p = 'fcr14v8', a = shot(`${p}-m`, AL1, 8, 8, 784, { fig: true });
  const y = 8 + a.h + 26;
  const chip = (x: number, k: 'c3' | 'c4', s1: string, s2: string): string =>
    `${box(x, y, 372, 98, `cr-box-${k}`, 16)}${T(x + 186, y + 40, s1, `cr-h cr-c-${k}`, 'middle')}${T(x + 186, y + 76, s2, 'cr-s', 'middle')}`;
  return svg(p, 'Ainsworth and Long 2021, figure 1: monthly CO2 at Mauna Loa from 1980 to 2019, rising from about 340 to 415 ppm, with the place and start year of each crop free-air CO2 enrichment experiment. Below, the 30-year result: C3 crops gained about 18 percent yield at about 200 ppm more CO2; C4 crops gained nothing, except in drought.', `
    ${a.svg}
    ${pill(648, 392, 'start of each FACE trial', [a.at(670, 640), a.at(1230, 312)], true)}
    ${chip(14, 'c3', 'C₃ crops: yield +18 %', 'at ≈ +200 ppm CO₂')}${chip(414, 'c4', 'C₄ crops: ≈ 0 %', 'gain only in drought')}
    ${credit(784, 594, `${CR.alF1}`)}
  `);
}

/* ---------- v9 · drawn: what +200 ppm CO₂ changes in a C₃ and a C₄ crop ---------- */

function drawV9(): string {
  const p = 'fcr14v9', cx3 = 386, cx4 = 626, rows = [
    { n: 'CO₂ at RuBisCO', a: 'up', b: 'same', sa: 'higher', sb: 'already high' },
    { n: 'oxygenation', a: 'down', b: 'same', sa: 'less', sb: 'already low' },
    { n: 'stomatal opening', a: 'down', b: 'down', sa: 'narrower', sb: 'narrower' },
    { n: 'yield', a: 'up', b: 'same', sa: '+18 %', sb: '≈ 0, more in drought' },
    { n: 'grain zinc, iron', a: 'down', b: 'same', sa: 'less', sb: 'less affected' },
  ];
  const tri = (x: number, y: number, d: string): string => d === 'up'
    ? `<path class="cr-bar-up" d="M${x - 11},${y + 9} L${x + 11},${y + 9} L${x},${y - 11}Z"/>`
    : d === 'down' ? `<path class="cr-bar-dn" d="M${x - 11},${y - 9} L${x + 11},${y - 9} L${x},${y + 11}Z"/>`
      : `<path class="cr-bar-ns" d="M${x - 11},${y - 6} h22 v4 h-22Z M${x - 11},${y + 2} h22 v4 h-22Z"/>`;
  const body = rows.map((r, i) => {
    const y = 236 + i * 68;
    return `${i % 2 === 0 ? `<rect class="cr-band" x="14" y="${y - 32}" width="772" height="64" rx="10"/>` : ''}
      ${T(30, y + 8, r.n, 'cr-lb')}
      ${tri(cx3 - 86, y, r.a)}${T(cx3 - 66, y + 8, r.sa, 'cr-l')}
      ${tri(cx4 - 96, y, r.b)}${T(cx4 - 76, y + 8, r.sb, 'cr-l')}`;
  }).join('');
  return svg(p, 'Drawn comparison of a C3 crop such as wheat and a C4 crop such as maize at about 200 ppm more CO2. C3: CO2 at RuBisCO higher, oxygenation less, stomata narrower, yield plus 18 percent, grain zinc and iron less. C4: CO2 at RuBisCO already high, oxygenation already low, stomata narrower, yield about zero and more only in drought, grain zinc and iron less affected.', `
    ${wheatEar(cx3 - 76, 52, 80, 'cr-ear')}${T(cx3 - 40, 96, 'C₃ crops', 'cr-h cr-c-c3')}${T(cx3 - 40, 128, 'wheat, rice', 'cr-s')}
    ${maizeCob(cx4 - 82, 52, 80)}${T(cx4 - 40, 96, 'C₄ crops', 'cr-h cr-c-c4')}${T(cx4 - 40, 128, 'maize, sorghum', 'cr-s')}
    ${T(30, 96, '+200 ppm CO₂', 'cr-h')}${T(30, 128, 'in the field', 'cr-s')}
    ${body}
    ${credit(784, 592, 'after Leakey et al. 2009; Ainsworth & Long 2021; Myers et al. 2014')}
  `);
}

const DRAW: Record<string, () => string> = { v1: drawV1, v2: drawV2, v3: drawV3, v4: drawV4, v5: drawV5, v6: drawV6, v7: drawV7, v8: drawV8, v9: drawV9 };

export function draw(id: string): string {
  if (id === 'g' || id === 'h') return drawOld(id);
  return (DRAW[id] ?? drawV1)();
}

