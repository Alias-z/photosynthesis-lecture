// Slide C15 · From leaf to loaf. Chunk cr, overnight build of 28 Oct 2026; text and figures are a proposal for the
// lecturer, not yet approved. Research notes: scratch cr/NOTES_SOURCES.md; credits: assets/SOURCES-cr.md.
// Theory: Monteith's yield equation as given by Zhu, Long & Ort 2010 (full text): Y = St × εi × εc × εp. Facts used:
//   - soybean (SoyFACE 2002, 380 ppm): εi = 0.89, εp = 0.60; "breeding has succeeded in maximizing both εi and εp";
//     maize, wheat and rice similar; past gains came from εp (dwarf stems, more seeds) and εi (larger leaves, faster
//     ground cover); season sunlight 620 MJ m⁻², biomass 17.7 and seed 10.6 MJ m⁻² (Table 1);
//   - maximum εc 4.6 % (C₃) and 6.0 % (C₄) of sunlight at 30 °C and 387 ppm; cascade 100 → 48.7 → 43.8 → 37.2 → 23.4 →
//     C₃ 12.6 → 6.5 → 4.6, C₄ 8.5 → 8.5 → 6.0 (Fig. 2); the best observed εc ≈ one third of the theoretical;
//   - photorespiratory bypass in tobacco: field biomass +20 % (2016) and +24 % (2017) (South et al. 2019, full text);
//     +11 % at ambient and +26 % at +5 °C (Cavanagh et al. 2022, full text); potato tubers per plant +9.5 % (2020) and
//     +30 % (2022) (Meacham-Hensold et al. 2024, full text);
//   - grain carbon from the ear and the leaves; the flag-leaf blade gave 3–18 % in elite irrigated bread wheat
//     (Sanchez-Bragado et al. 2014, full text); durum-wheat endosperm filling with starch granules 10–20 days after
//     flowering (Chen et al. 2024, CC BY 4.0, figure legends on the board).
// Old figures a–j (c13) stay listed after the new ones; no picks exist for this slide (picks.json).
import type { PlateText, Variant } from '../types';
import { draw as drawOld } from './c13';
import {
  ar, box, co2, credit, f, leaf, loaf, o2, pill, shot, svg, T, wheatEar, yieldChain,
  type Img,
} from './cr-common';
import zhuJpg from '../../assets/photos/cr-zhu-f2.jpg';
import southJpg from '../../assets/photos/cr-south-f3.jpg';
import earJpg from '../../assets/photos/cr-ear.jpg';
import chen9Jpg from '../../assets/photos/cr-chen-f9a.jpg';
import chen6Jpg from '../../assets/photos/cr-chen-f6.jpg';

export const PLATE: PlateText = {
  n: 'C15',
  title: 'From leaf to loaf',
  status: 'draft',
  lead: 'Grain yield is the sunlight a crop intercepts, times the efficiency of converting it into biomass, times the share of biomass in the grain.',
  points: [
    { claim: 'Interception and harvest index.', text: 'Soybean: ≈ 90 % of the light intercepted, ≈ 60 % of the biomass in the seed<br>Breeding has brought both close to their limits' },
    { claim: 'Conversion efficiency.', text: 'Theoretical maximum: 4.6 % of sunlight in C₃, 6 % in C₄ crops<br>A photorespiratory bypass raised tobacco biomass by 11–24 % in field trials' },
    { claim: 'Grain filling.', text: 'Sucrose from the leaves and the ear moves in the phloem to the grain<br>The endosperm stores it as starch' },
  ],
  refs: [
    { label: 'Zhu, Long & Ort 2010', url: 'https://doi.org/10.1146/annurev-arplant-042809-112206' },
    { label: 'South et al. 2019', url: 'https://doi.org/10.1126/science.aat9077' },
    { label: 'Cavanagh et al. 2022', url: 'https://doi.org/10.1111/pbi.13750' },
    { label: 'Sanchez-Bragado et al. 2014', url: 'https://doi.org/10.1093/jxb/eru298' },
    { label: 'Chen et al. 2024', url: 'https://doi.org/10.1093/plphys/kiae429' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'v1', name: 'Energy losses, sunlight to biomass (real figure)' },
  { id: 'v2', name: 'Energy cascade (redrawn)' },
  { id: 'v3', name: 'Yield chain: conversion lit' },
  { id: 'v4', name: 'Yield chain: interception and harvest index lit' },
  { id: 'v5', name: 'Wheat plant: leaf, ear, stem to grain (drawn)' },
  { id: 'v6', name: 'Ear photo + endosperm micrographs' },
  { id: 'v7', name: 'Bypass tobacco: photo + drawing' },
  { id: 'v8', name: 'Bypass field trials (redrawn)' },
  { id: 'v9', name: 'A soybean field’s sunlight, to scale' },
  { id: 'a', name: 'Annotated equation (old)' },
  { id: 'b', name: 'Atom ledger (old)' },
  { id: 'c', name: 'Six steps (old)' },
  { id: 'd', name: 'Wheat plant (old)' },
  { id: 'e', name: 'Two starches (old)' },
  { id: 'f', name: 'Course map (old)' },
  { id: 'g', name: 'Endosperm cell (old)' },
  { id: 'h', name: 'Shipping (old)' },
  { id: 'i', name: 'Zoom into bread (old)' },
  { id: 'j', name: 'Six answers (old)' },
];

/* ---------- images ---------- */
const ZHU: Img = { href: zhuJpg, w: 1112, h: 1150 };
const SOUTH: Img = { href: southJpg, w: 775, h: 743 };
const EAR: Img = { href: earJpg, w: 1200, h: 800 };
const CHEN9: Img = { href: chen9Jpg, w: 739, h: 178 };
const CHEN6: Img = { href: chen6Jpg, w: 205, h: 626 };
const CR = {
  zhu: 'Zhu, Long & Ort 2010, Annu Rev Plant Biol, Fig. 2 · © Annual Reviews',
  zhuR: 'redrawn from Zhu, Long & Ort 2010, Annu Rev Plant Biol, Fig. 2 (30 °C, 387 ppm CO₂)',
  zhuT: 'data: Zhu, Long & Ort 2010, Annu Rev Plant Biol, Table 1 and Fig. 2',
  south: 'photo: South et al. 2019, Science, Fig. 3A · CC BY 4.0',
  ear: 'photo: P. Alexander, Wikimedia Commons · CC0',
  chen: 'SEM: Chen et al. 2024, Plant Physiol, Figs. 9A and 6B (wild type) · CC BY 4.0',
};

/* ---------- v1 · the published energy cascade, with the maxima beside it ---------- */

function drawV1(): string {
  const p = 'fcr15v1', a = shot(`${p}-z`, ZHU, 6, 18, 536, { fig: true });
  const [rx0, ry0] = a.at(4, 688), [rx1, ry1] = a.at(1108, 742);
  return svg(p, 'Zhu, Long and Ort 2010, figure 2: of the sunlight falling on a leaf, 51.3 percent lies outside 400 to 700 nanometres, and further energy is lost to reflection, photochemical inefficiency, the thermodynamic limit, carbohydrate synthesis, photorespiration in C3 plants and respiration. At most 4.6 percent of sunlight ends in C3 biomass and 6.0 percent in C4 biomass, at 30 degrees. The best field crops reach about one third of this.', `
    ${a.svg}
    <rect class="cr-ci cr-ci-c3" x="${f(rx0)}" y="${f(ry0)}" width="${f(rx1 - rx0)}" height="${f(ry1 - ry0)}" rx="10" fill="none"/>
    ${T(572, 92, 'theoretical maximum', 'cr-lb')}
    ${T(572, 146, 'C₃ crops', 'cr-h cr-c-c3')}${T(572, 200, '4.6 %', 'cr-huge cr-c-c3')}
    ${T(572, 262, 'C₄ crops', 'cr-h cr-c-c4')}${T(572, 316, '6.0 %', 'cr-huge cr-c-c4')}
    ${T(572, 356, 'of sunlight, at 30 °C', 'cr-s')}
    ${T(572, 430, 'best crops', 'cr-lb')}${T(572, 462, 'in the field:', 'cr-lb')}${T(572, 500, '≈ ⅓ of this', 'cr-h')}
    ${credit(784, 592, CR.zhu)}
  `);
}

/* ---------- v2 · the cascade redrawn as shrinking bars, photorespiration lit ---------- */

function drawV2(): string {
  const p = 'fcr15v2', x0 = 300, W = 440, X = (v: number): number => x0 + (v / 100) * W;
  const rows: Array<{ n: string[]; c3: number; c4?: number; lit?: boolean }> = [
    { n: ['sunlight'], c3: 100 },
    { n: ['400–700 nm'], c3: 48.7 },
    { n: ['after the', 'light reactions'], c3: 23.4 },
    { n: ['in carbohydrate'], c3: 12.6, c4: 8.5 },
    { n: ['after', 'photorespiration'], c3: 6.5, c4: 8.5, lit: true },
    { n: ['biomass', '(after respiration)'], c3: 4.6, c4: 6.0 },
  ];
  const y0 = 54, dy = 82;
  const body = rows.map((r, i) => {
    const y = y0 + i * dy, two = r.c4 !== undefined, h = two ? 26 : 40;
    const name = r.n.map((s, j) => T(x0 - 18, y + (r.n.length === 1 ? 27 : 14 + j * 26), s, r.lit ? 'cr-lb cr-c-c3' : 'cr-lb', 'end')).join('');
    const bar = (v: number, yy: number, cls: string, lab: string): string =>
      `<rect class="${cls}" x="${x0}" y="${yy}" width="${f(Math.max(3, X(v) - x0))}" height="${h}" rx="4"/>${T(X(v) + 10, yy + h / 2 + 8, lab, 'cr-val')}`;
    const bars = two
      ? `${bar(r.c3, y, 'cr-bar-c3', `${r.c3.toFixed(1)} % <tspan class="cr-c-c3">C₃</tspan>`)}${bar(r.c4 ?? 0, y + 30, 'cr-bar-c4', `${(r.c4 ?? 0).toFixed(1)} % <tspan class="cr-c-c4">C₄</tspan>`)}`
      : bar(r.c3, y + 8, 'cr-bar-g', `${r.c3} %`);
    return `${r.lit ? `<rect class="cr-band-c3" x="14" y="${y - 12}" width="772" height="${dy - 4}" rx="12"/>` : ''}${name}${bars}`;
  }).join('');
  return svg(p, 'Redrawn from Zhu, Long and Ort 2010: the share of sunlight left at each step. Sunlight 100 percent; 48.7 percent between 400 and 700 nanometres; 23.4 after the light reactions; in carbohydrate 12.6 for C3 and 8.5 for C4; after photorespiration 6.5 for C3 and still 8.5 for C4; in biomass after respiration 4.6 for C3 and 6.0 for C4.', `
    ${body}
    ${T(x0 + 210, y0 + 4 * dy + 26, 'C₃ loses 6.1 points', 'cr-s cr-c-c3')}
    ${credit(784, 592, CR.zhuR)}
  `);
}

/* ---------- v3 · the yield chain, conversion efficiency lit ---------- */

function drawV3(): string {
  const p = 'fcr15v3';
  return svg(p, 'The yield chain: grain yield equals sunlight times light interception times conversion efficiency times harvest index. Light interception, about 0.9 in soybean, and harvest index, about 0.6, are near their limits. Conversion efficiency, photosynthesis, is at most 4.6 percent of sunlight in C3 crops and 6 percent in C4 crops, and the best crops reach about one third of that.', `
    ${yieldChain(p, 226, ['conv'], {
      int: ['≈ 0.9', 'near its limit'], conv: ['C₃ ≤ 4.6 %', 'C₄ ≤ 6 %', 'crops: ≈ ⅓'], hi: ['≈ 0.6', 'near its limit'],
    })}
    ${credit(784, 588, CR.zhuT)}
  `);
}

/* ---------- v4 · the yield chain, the two links that breeding raised ---------- */

function drawV4(): string {
  const p = 'fcr15v4';
  return svg(p, 'The yield chain with light interception and harvest index lit: over the past 50 years, larger leaves that cover the ground sooner raised light interception to about 0.9, and shorter stems with more seeds raised harvest index to about 0.6, both near their limits in soybean. Conversion efficiency changed little.', `
    ${T(400, 70, 'what breeding raised in the past 50 years', 'cr-h', 'middle')}
    ${yieldChain(p, 216, ['int', 'hi'], {
      int: ['≈ 0.9', 'larger leaves,', 'faster cover'], conv: ['little change'], hi: ['≈ 0.6', 'shorter stems,', 'more seeds'],
    })}
    ${credit(784, 588, 'after Zhu, Long & Ort 2010, Annu Rev Plant Biol (values: soybean, Table 1)')}
  `);
}

/* ---------- v5 · drawn: a wheat shoot at grain filling; sucrose from leaves, ear and stem to the grain ---------- */

function drawV5(): string {
  const p = 'fcr15v5', sx = 210;
  const grain = (cx: number, cy: number): string => {
    const cells: string[] = [];
    for (let i = -3; i <= 3; i++) for (let j = -2; j <= 2; j++) {
      const x = cx + i * 34 + (j % 2 ? 17 : 0), y = cy + j * 30;
      if (((x - cx) / 118) ** 2 + ((y - cy) / 80) ** 2 > 0.78) continue;
      cells.push(`<rect class="cr-cell" x="${x - 16}" y="${y - 14}" width="32" height="28" rx="6"/>`);
      for (const [dx, dy, r] of [[-6, -4, 6], [6, 3, 7], [-5, 7, 3.5], [8, -7, 3]]) cells.push(`<circle class="cr-starch" cx="${x + dx}" cy="${y + dy}" r="${r}"/>`);
    }
    return `<ellipse class="cr-grain" cx="${cx}" cy="${cy}" rx="132" ry="92"/>${cells.join('')}`;
  };
  return svg(p, 'Drawn wheat shoot at grain filling. The green ear and the flag leaf photosynthesise; the stem holds sugar stored before flowering. Sucrose moves in the phloem from leaves, ear and stem to the grain. Enlarged grain: endosperm cells packed with starch granules.', `
    <path class="cr-soil" d="M90,560 H330"/>
    <path class="cr-plant" d="M${sx},560 L${sx},170"/>
    ${leaf(sx, 330, 150, -38)}${leaf(sx, 450, 130, 205)}
    ${wheatEar(sx, 60, 120, 'cr-ear-g')}
    <path class="cr-phloem" d="M${sx + 70},${292} Q${sx + 18},${290} ${sx + 6},${230}"/>
    <path class="cr-phloem" d="M${sx - 2},${520} L${sx - 2},${236}"/>
    ${ar(p, 'amber', `M${sx + 8},${250} L${sx + 8},${206}`, 'cr-thin')}
    ${T(sx + 92, 356, 'flag leaf', 'cr-lb')}
    ${T(sx - 40, 100, 'ear', 'cr-lb', 'end')}${T(sx - 40, 128, 'photosynthesis', 'cr-s', 'end')}
    ${T(sx + 20, 476, 'stem: sugar stored', 'cr-s')}${T(sx + 20, 502, 'before flowering', 'cr-s')}
    ${T(sx + 20, 412, 'phloem: sucrose', 'cr-lb cr-c-amber')}
    <path class="cr-zero" d="M${sx + 24},${96} L${486},${214} M${sx + 24},${160} L${486},${306}"/>
    ${grain(612, 260)}
    ${T(612, 136, 'grain', 'cr-h', 'middle')}
    ${pill(612, 400, 'endosperm: starch granules', [612 + 34, 268], true)}
    ${loaf(612, 540, 112)}
    ${T(690, 536, 'bread', 'cr-l')}
    ${credit(784, 594, 'drawn after Sanchez-Bragado et al. 2014; Chen et al. 2024')}
  `);
}

/* ---------- v6 · a real ear beside real endosperm: sucrose in, starch granules out ---------- */

function drawV6(): string {
  const p = 'fcr15v6', ph = shot(`${p}-ear`, EAR, 14, 30, 246, { win: [580, 40, 360, 720] });
  const s9 = shot(`${p}-c9`, CHEN9, 300, 92, 486, { win: [26, 0, 713, 178] });
  const s6 = shot(`${p}-c6`, CHEN6, 300, 92 + s9.h + 70, 168, { win: [16, 340, 189, 286] });
  const yb = 92 + s9.h + 70;
  return svg(p, 'Left: photo of a green wheat ear. Right, top: scanning electron micrographs of developing durum-wheat endosperm 10, 15 and 20 days after flowering, filling with starch granules (coloured by the authors). Right, bottom: starch granules purified from mature grain.', `
    ${ph.svg}${s9.svg}${s6.svg}
    ${pill(136, 520, 'green ear', ph.at(760, 300))}
    ${T(300, 64, 'endosperm, 10 → 20 days after flowering', 'cr-lb')}
    ${pill(600, 92 + s9.h + 34, 'starch granules', [s9.at(450, 100), s9.at(690, 120)])}
    ${T(490, yb + 60, 'mature grain:', 'cr-lb')}${T(490, yb + 92, 'starch granules', 'cr-l')}
    ${credit(784, 576, `${CR.ear} | ${CR.chen} (durum wheat)`)}
  `);
}

/* ---------- v7 · engineered photorespiration: real tobacco plants beside a drawn bypass and the field result ---------- */

function drawV7(): string {
  const p = 'fcr15v7', ph = shot(`${p}-s`, SOUTH, 8, 8, 784, { win: [22, 8, 746, 300] });
  const y = ph.h + 30;
  return svg(p, 'Top: photo of tobacco plants after six weeks in a greenhouse; unmodified plants on the left are smaller than the plants with a photorespiratory bypass. Bottom: the bypass drawn: in the chloroplast, RuBisCO’s oxygenation makes glycolate; a synthetic pathway breaks glycolate down to CO2 inside the chloroplast, next to RuBisCO, while glycolate export to the peroxisome is lowered. In field trials biomass rose by 20 percent in 2016 and 24 percent in 2017.', `
    ${ph.svg}
    ${pill(96, 40, 'unmodified', ph.at(100, 175))}
    ${pill(612, 40, 'with bypass', [ph.at(490, 140), ph.at(700, 130)])}
    ${box(14, y, 510, 600 - y - 40, 'cr-box-t', 26)}
    ${T(34, y + 34, 'chloroplast', 'cr-lb cr-c-green')}
    ${T(34, y + 84, 'RuBisCO +', 'cr-l')}${o2(164, y + 78, 9)}${ar(p, 'ink', `M186,${y + 78} L226,${y + 78}`, 'cr-thin')}${T(290, y + 84, 'glycolate', 'cr-lb', 'middle')}
    ${ar(p, 'gas', `M290,${y + 98} L290,${y + 136}`)}${co2(290, y + 160, 11)}${T(326, y + 167, 'CO₂ released here', 'cr-s')}
    ${ar(p, 'grey', `M352,${y + 78} L470,${y + 78}`, 'cr-thin cr-dash')}<path class="cr-x" d="M401,${y + 66} l20,24 M421,${y + 66} l-20,24"/>
    ${T(470, y + 120, 'export lowered', 'cr-s', 'end')}
    ${T(650, y + 36, 'field biomass', 'cr-lb', 'middle')}
    ${T(588, y + 98, '+20 %', 'cr-big cr-c-green', 'middle')}${T(588, y + 128, '2016', 'cr-s', 'middle')}
    ${T(714, y + 98, '+24 %', 'cr-big cr-c-green', 'middle')}${T(714, y + 128, '2017', 'cr-s', 'middle')}
    ${credit(784, 594, `${CR.south} · field: South et al. 2019, Fig. 6`)}
  `);
}

/* ---------- v8 · the bypass in field trials, redrawn as bars ---------- */

function drawV8(): string {
  const p = 'fcr15v8', y0 = 440, k = 9.6, bw = 62;
  const bars = [
    { x: 150, v: 20, l: '2016' }, { x: 230, v: 24, l: '2017' },
    { x: 360, v: 11, l: 'ambient' }, { x: 440, v: 26, l: '+5 °C' },
    { x: 570, v: 9.5, l: '2020' }, { x: 650, v: 30, l: '2022' },
  ];
  const body = bars.map(b => `<rect class="cr-bar-up" x="${b.x - bw / 2}" y="${f(y0 - b.v * k)}" width="${bw}" height="${f(b.v * k)}" rx="4"/>
    ${T(b.x, y0 - b.v * k - 12, `+${b.v} %`, 'cr-val', 'middle')}${T(b.x, y0 + 30, b.l, 'cr-tk', 'middle')}`).join('');
  const grp = (x: number, s1: string, s2: string): string => `${T(x, y0 + 72, s1, 'cr-lb', 'middle')}${T(x, y0 + 100, s2, 'cr-s', 'middle')}`;
  return svg(p, 'Redrawn field results of the AP3 photorespiratory bypass with lowered glycolate export, as percent more than unmodified plants. Tobacco biomass: plus 20 percent in 2016 and plus 24 percent in 2017. Tobacco in a heating trial: plus 11 percent at ambient temperature and plus 26 percent at 5 degrees warmer. Potato tubers per plant: plus 9.5 percent in 2020 and plus 30 percent in 2022.', `
    ${T(400, 54, 'photorespiratory bypass in the field', 'cr-h', 'middle')}
    ${T(400, 84, 'more than unmodified plants', 'cr-s', 'middle')}
    <path class="cr-axis" d="M90,${y0} H710"/>
    ${body}
    ${grp(190, 'tobacco', 'biomass')}${grp(400, 'tobacco', 'heating trial')}${grp(610, 'potato', 'tubers per plant')}
    ${credit(784, 588, 'data: South et al. 2019, Science; Cavanagh et al. 2022, Plant Biotechnol J; | Meacham-Hensold et al. 2024, Glob Change Biol')}
  `);
}

/* ---------- v9 · one soybean field over one season: sunlight, intercepted light, biomass, seed, areas to scale ---------- */

function drawV9(): string {
  const p = 'fcr15v9', x = 28, y = 96, S = 400, sI = S * Math.sqrt(0.89), sB = S * Math.sqrt(17.7 / 620), sY = S * Math.sqrt(10.6 / 620);
  const by = y + S;
  return svg(p, 'One soybean field over one season, per square metre, with areas to scale. Sunlight 620 megajoules; 89 percent intercepted by the canopy; 17.7 megajoules, 2.9 percent of the sunlight, stored in biomass; 10.6 megajoules, 1.7 percent, in the seed.', `
    ${T(x, 58, 'one soybean field, one season, per m²', 'cr-h')}
    <rect class="cr-sunsq" x="${x}" y="${y}" width="${S}" height="${S}" fill="#fbe7a8" stroke="#d9a52a" stroke-width="1.6"/>
    <rect x="${x}" y="${f(by - sI)}" width="${f(sI)}" height="${f(sI)}" fill="#d9eccb" stroke="#6f9a5a" stroke-width="1.6"/>
    <rect x="${x}" y="${f(by - sB)}" width="${f(sB)}" height="${f(sB)}" fill="#6f9a5a"/>
    <rect x="${x}" y="${f(by - sY)}" width="${f(sY)}" height="${f(sY)}" fill="#9c7a2c"/>
    ${pill(610, 120, 'sunlight: 620 MJ', [x + S - 6, y + 14], true)}
    ${pill(610, 200, 'intercepted: 89 %', [x + sI - 20, by - sI + 30], true)}
    ${pill(610, 380, 'biomass: 17.7 MJ (2.9 %)', [x + sB - 4, by - sB + 4], true)}
    ${pill(610, 460, 'seed: 10.6 MJ (1.7 %)', [x + sY - 8, by - sY + 14], true)}
    ${credit(784, 592, 'data: Zhu, Long & Ort 2010, Annu Rev Plant Biol, Table 1 (soybean, SoyFACE, 2002, 380 ppm)')}
  `);
}

const DRAW: Record<string, () => string> = { v1: drawV1, v2: drawV2, v3: drawV3, v4: drawV4, v5: drawV5, v6: drawV6, v7: drawV7, v8: drawV8, v9: drawV9 };

export function draw(id: string): string {
  return DRAW[id] ? DRAW[id]() : drawOld(id);
}
