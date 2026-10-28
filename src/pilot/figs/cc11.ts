// Slide C11 · Refixation of photorespired CO₂: C₃ leaves (rice, wheat) → C₂ photosynthesis (chunk cc, 28 Oct 2026).
// Facts (full texts read unless marked): Busch, Sage, Cousins & Sage 2013 PCE 36:200 — chloroplasts + stromules cover
// Sc/Sm 0.925 (wheat) and 0.989 (rice) of the cell periphery facing the air spaces; mitochondria inside; intracellular
// refixation 29 % (rice) and 26 % (wheat) of photorespired CO₂ at 350 µmol mol⁻¹, 30 °C; via the air spaces 20–23 %;
// net CO₂ uptake +11 % / +9 %; Fig. 5a C* vs Sc/Sm in six C₃ species. Busch 2020 Plant J Fig. 2 (chloroplasts in front
// of mitochondria vs gaps). Sage & Sage 2009 PCP (abstract: > 95 % cover in rice). Sage, Khoshravesh & Sage 2014 JXB
// Figs 2–3 (board images; abstract). Khoshravesh et al. 2016 JXB (CC BY 3.0): C* 10.8–20 (C₂) vs ≈ 48–53 (C₃) at 31 °C.
// New variants v1–v11 first, then the earlier ones a–t (drawn by c08.ts, which also draws c07's figures as k–t).
import type { PlateText, Variant } from '../types';
import { draw as drawC08, VARIANTS as C08_VARIANTS } from './c08';
import { T, TV, co2, credit, f, heads, it, mito, pill, route, routeOnPhoto, shot, svg, type A, type Img } from './cc-kit';
import { c2Tissue, c3Section, schemaSvg } from './cc-schema';
import temC from '../../assets/photos/cc-busch-tem-c.jpg';
import temD from '../../assets/photos/cc-busch-tem-d.jpg';
import temB from '../../assets/photos/cc-busch-tem-b.jpg';
import s14c3 from '../../assets/photos/cc-sage14-tem-c3.jpg';
import s14pk from '../../assets/photos/cc-sage14-tem-pk.jpg';
import s14c2 from '../../assets/photos/cc-sage14-tem-c2.jpg';
import s14c4 from '../../assets/photos/cc-sage14-tem-c4.jpg';
import gdcD from '../../assets/photos/cc-sage14-gdc-d.jpg';
import gdcF from '../../assets/photos/cc-sage14-gdc-f.jpg';
import khosh from '../../assets/photos/cc-khosh-aci.jpg';
import tree from '../../assets/photos/cc-sage12-tree.jpg';

export const PLATE: PlateText = {
  n: 'C11',
  title: 'C₃ leaves: refixation of photorespired CO₂',
  status: 'draft',
  lead: 'In C₃ leaves, RuBisCO takes CO₂ directly from the leaf air spaces.<br>Chloroplasts in front of the mitochondria refix part of the photorespired CO₂.',
  points: [
    { claim: 'Chloroplast cover.', text: 'Rice, wheat: chloroplasts cover 92–99 % of the wall facing the air spaces; the mitochondria lie behind them' },
    { claim: 'Refixation.', text: 'Part of the CO₂ released in the mitochondria is fixed again before it leaves the cell', eq: 'refixed inside the cell: 26–29 % · net CO₂ uptake: +9–11 %' },
    { claim: 'Heat raises photorespiration.', text: 'RuBisCO’s preference for CO₂ over O₂ falls as temperature rises; C₃ plants dominate cool, temperate regions', eq: '30 °C: ≈ 29 % less CO₂ fixed per photon in air than in 2 % O₂' },
  ],
  refs: [
    { label: 'Busch et al. 2013', url: 'https://doi.org/10.1111/j.1365-3040.2012.02567.x' },
    { label: 'Sage & Sage 2009', url: 'https://doi.org/10.1093/pcp/pcp033' },
    { label: 'Busch 2020', url: 'https://doi.org/10.1111/tpj.14674' },
    { label: 'Jordan & Ogren 1984', url: 'https://doi.org/10.1007/BF00398720' },
    { label: 'Ehleringer & Björkman 1977', url: 'https://doi.org/10.1104/pp.59.1.86' },
    { label: 'Sage 2004', url: 'https://doi.org/10.1111/j.1469-8137.2004.00974.x' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'v1', name: 'Rice mesophyll cell and close-up (TEM, Busch 2013)' },
  { id: 'v2', name: 'Wheat close-up with the CO₂ path drawn on it' },
  { id: 'v3', name: 'Chloroplasts in front vs gaps: rice vs tobacco (drawn)' },
  { id: 'v4', name: 'Chloroplast cover vs C* in six C₃ species (Busch 2013 Fig. 5a)' },
  { id: 'v5', name: 'Where the photorespired CO₂ goes: rice and wheat' },
  { id: 'v6', name: 'C₃ cell → C₂ leaf (drawn)' },
  { id: 'v7', name: 'Flaveria bundle sheath, C₃ → proto-Kranz → C₂ → C₄ (TEM)', anim: true },
  { id: 'v8', name: 'Glycine decarboxylase moves to the bundle sheath (Flaveria) + drawing' },
  { id: 'v9', name: 'C₂ grasses start CO₂ uptake at lower CO₂ (A/Ci, Khoshravesh 2016)' },
  { id: 'v10', name: 'Four ways around RuBisCO: C₃ and C₂ lit', anim: true },
  { id: 'v11', name: 'C₄ evolved more than 60 times (phylogeny)' },
  ...C08_VARIANTS,
];

export function draw(id: string): string {
  const f2: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11 };
  return f2[id] ? f2[id]() : drawC08(id);
}

/* ---------- images ---------- */

const TEM_C: Img = { href: temC, w: 504, h: 496 };
const TEM_D: Img = { href: temD, w: 504, h: 504 };
const TEM_B: Img = { href: temB, w: 498, h: 504 };
const S14: Record<string, Img> = {
  c3: { href: s14c3, w: 212, h: 215 }, pk: { href: s14pk, w: 213, h: 215 },
  c2: { href: s14c2, w: 209, h: 215 }, c4: { href: s14c4, w: 215, h: 215 },
};
const GDC_D: Img = { href: gdcD, w: 533, h: 389 };
const GDC_F: Img = { href: gdcF, w: 533, h: 390 };
const KHOSH: Img = { href: khosh, w: 700, h: 682 };
const TREE: Img = { href: tree, w: 1100, h: 890 };
const CR = {
  busch: 'Busch, Sage, Cousins & Sage 2013, Plant Cell Environ 36:200, Fig. 4',
  sage14: 'Sage, Khoshravesh & Sage 2014, J Exp Bot 65:3341',
  khosh: 'Khoshravesh et al. 2016, J Exp Bot 67:3065, Fig. 4, CC BY 3.0',
};

/* v1 · rice: whole cell and close-up */
function v1(): string {
  const p = 'fcc11a';
  const a = shot(`${p}-a`, TEM_C, 14, 116, 380, { win: [34, 26, 470, 470] });
  const b = shot(`${p}-b`, TEM_D, 406, 116, 380, { win: [30, 30, 474, 474] });
  return svg('Rice mesophyll, electron micrographs from Busch et al. 2013: chloroplasts and stromules line the whole wall of a lobed cell facing the air space; in the close-up, mitochondria and a peroxisome lie on the inner side of the chloroplasts', `
    ${T(204, 94, 'rice mesophyll cell', 'fcc-b')}${T(596, 94, 'close-up', 'fcc-b')}
    ${a.svg}${b.svg}
    ${pill(118, 470, 'air space', a.at(100, 335))}
    ${pill(316, 162, 'chloroplast', a.at(425, 220))}
    ${pill(110, 220, 'stromule', a.at(183, 192))}
    ${pill(690, 160, 'mitochondrion', b.at(300, 118))}
    ${pill(560, 300, 'peroxisome', b.at(150, 214))}
    ${pill(690, 400, 'mitochondrion', b.at(178, 312))}
    ${pill(500, 470, 'chloroplast', b.at(92, 350))}
    ${credit(786, 524, `${CR.busch} c, d`)}
  `);
}

/* v2 · wheat close-up with the CO₂ path drawn */
function v2(): string {
  const p = 'fcc11b';
  const a = shot(`${p}-a`, TEM_B, 150, 30, 500, { win: [0, 30, 498, 474] });
  const m = a.at(352, 206), c = a.at(328, 150);
  const d = `M${f(m[0])},${f(m[1])} C${f(m[0] - 6)},${f(m[1] - 18)} ${f(c[0] + 6)},${f(c[1] + 22)} ${f(c[0] + 2)},${f(c[1] + 10)}`;
  return svg('Wheat mesophyll close-up from Busch et al. 2013 with the CO2 path drawn: CO2 released by a mitochondrion on the inner side of a chloroplast diffuses into the chloroplast stroma, where RuBisCO can refix it before it reaches the air space', `
    ${heads(p)}${a.svg}
    ${routeOnPhoto(p, 'c', d)}
    ${co2(c[0] - 2, c[1] - 12, 10)}
    ${pill(726, 252, 'mitochondrion', a.at(420, 222))}
    ${pill(726, 330, 'peroxisome', a.at(312, 262))}
    ${pill(726, 120, 'CO₂ into stroma', [c[0] + 30, c[1] - 12])}
    ${pill(74, 70, 'chloroplast', a.at(250, 60))}
    ${pill(74, 330, 'chloroplast', a.at(200, 360))}
    ${pill(76, 470, 'air space', a.at(46, 420))}
    ${pill(74, 200, 'stromule', a.at(181, 177))}
    ${credit(650, 592, `wheat · ${CR.busch} b`)}
  `);
}

/* v3 · chloroplasts in front vs gaps: rice vs tobacco */
function v3(): string {
  const p = 'fcc11c';
  return svg('Two stretches of mesophyll wall drawn side by side. Left, rice: chloroplasts, bridged by stromules, cover 99 percent of the wall facing the air space and the mitochondria lie behind them, so their CO2 must cross chloroplast stroma, where part is refixed. Right, tobacco: chloroplasts cover about 60 percent, so CO2 from a mitochondrion under a gap leaves the cell directly', `
    ${heads(p)}
    ${T(200, 76, 'rice', 'fcc-h')}${T(600, 76, 'tobacco', 'fcc-h')}
    ${T(200, 108, '99 % of the wall covered', 'fcc-l')}${T(600, 108, '≈ 60 % of the wall covered', 'fcc-l')}
    ${c3Section(p, 22, 150, 356, 260, { air: 90, big: true, labels: true })}
    ${c3Section(p, 422, 150, 356, 260, { air: 90, big: true, gaps: true, labels: true })}
    ${T(200, 466, 'CO₂ must cross the stroma:', 'fcc-l')}${T(200, 496, 'part is refixed', 'fcc-b fcc-co2')}
    ${T(600, 466, 'CO₂ leaves through gaps:', 'fcc-l')}${T(600, 496, 'lost to the air space', 'fcc-b fcc-grey')}
    ${credit(790, 592, 'drawn after Busch 2020, Plant J 101:919, Fig. 2; cover: Busch et al. 2013')}
  `);
}

/* v4 · C* vs chloroplast cover (Busch 2013 Fig. 5a, redrawn) */
function v4(): string {
  const X = (s: number): number => 130 + s * 6.1;        // cover % → x
  const Y = (c: number): number => 470 - (c - 44) * 25;   // C* → y (44 … 58)
  const pts: Array<[string, number, number, number, number, A]> = [
    ['rice', 98.9, 45.9, 0, 32, 'middle'], ['wheat', 92.5, 46.7, 4, -16, 'middle'], [it('F. cronquistii'), 78, 47.0, -14, 30, 'end'],
    ['sunflower', 77, 48.5, 16, -16, 'start'], ['rye', 70, 48.4, -14, 7, 'end'], ['tobacco', 61, 51.4, 0, -18, 'middle'],
  ];
  const ax: string[] = [];
  for (let c = 44; c <= 58; c += 2) ax.push(`<path class="fcc-tk" d="M${X(0) - 8},${f(Y(c))} h8"/>${T(X(0) - 14, Y(c) + 6, `${c}`, 'fcc-ax', 'end')}`);
  for (let s = 0; s <= 100; s += 20) ax.push(`<path class="fcc-tk" d="M${f(X(s))},470 v8"/>${T(X(s), 500, `${s}`, 'fcc-ax')}`);
  return svg('Redrawn from Busch et al. 2013, figure 5a: in six C3 species, the more of the cell wall facing the air spaces is covered by chloroplasts, the lower the apparent CO2 compensation point C*. Rice, 99 percent cover, 45.9; wheat, 92.5 percent, 46.7; tobacco, 61 percent, 51.4; RuBisCO alone in vitro, 57.2 micromoles per mole', `
    <path class="fcc-axl" d="M${X(0)},${Y(58.8)} V470 H${X(100) + 10}"/>${ax.join('')}
    <path class="fcc-reg" d="M${X(0)},${f(Y(58.19))} L${X(55)},${f(Y(58.19 - 12.79 * 0.55))}"/>
    <path class="fcc-c3" d="M${X(55)},${f(Y(58.19 - 12.79 * 0.55))} L${X(100)},${f(Y(58.19 - 12.79))}"/>
    <rect class="fcc-dot-o" x="${X(0) - 8}" y="${f(Y(57.2) - 8)}" width="16" height="16"/>
    ${T(X(0) + 20, Y(58.8) - 4, 'RuBisCO alone (no cover)', 'fcc-l', 'start')}
    ${pts.map(([n, s, c, dx, dy, a]) => `<circle class="fcc-dot" cx="${f(X(s))}" cy="${f(Y(c))}" r="8"/>${T(X(s) + dx, Y(c) + dy, n, 'fcc-l', a)}`).join('')}
    ${TV(46, 300, 'CO₂ compensation point, C* (µmol mol⁻¹)')}
    ${T(X(50), 538, 'cell wall facing air spaces covered by chloroplasts (%)', 'fcc-at')}
    ${pill(320, 330, 'more cover → more CO₂ refixed', undefined, { tint: true })}
    ${T(X(50), 572, 'C*: CO₂ level at which uptake equals photorespired release', 'fcc-s')}
    ${credit(790, 596, 'redrawn from Busch et al. 2013, Plant Cell Environ 36:200, Fig. 5a (30 °C)')}
  `);
}

/* v5 · where the CO₂ from the mitochondria goes (Busch 2013, 350 µmol mol⁻¹, 30 °C) */
function v5(): string {
  const x0 = 140, W = 600;
  const bar = (y: number, name: string, inC: number, ias: number, gain: string): string => {
    const out = 100 - inC - ias, w1 = W * inC / 100, w2 = W * ias / 100, w3 = W * out / 100;
    return `${T(x0 - 18, y + 42, name, 'fcc-h', 'end')}
      <rect class="fcc-bar-in" x="${x0}" y="${y}" width="${f(w1)}" height="64" rx="6"/>
      <rect class="fcc-bar-ias" x="${f(x0 + w1)}" y="${y}" width="${f(w2)}" height="64"/>
      <rect class="fcc-bar-out" x="${f(x0 + w1 + w2)}" y="${y}" width="${f(w3)}" height="64" rx="6"/>
      ${T(x0 + w1 / 2, y + 42, `${inC} %`, 'fcc-big fcc-white')}${T(x0 + w1 + w2 / 2, y + 42, `${ias} %`, 'fcc-h')}${T(x0 + w1 + w2 + w3 / 2, y + 42, `${out} %`, 'fcc-h fcc-grey')}
      ${T(x0, y + 100, `net CO₂ uptake ${gain} by refixation inside the cell`, 'fcc-l', 'start')}`;
  };
  const key = (x: number, cls: string, s1: string, s2: string): string =>
    `<rect class="${cls}" x="${x}" y="84" width="26" height="26" rx="5"/>${T(x + 36, 104, s1, 'fcc-l', 'start')}${T(x + 36, 132, s2, 'fcc-s', 'start')}`;
  return svg('Of all CO2 released by the mitochondria at 350 micromoles per mole CO2 and 30 degrees: rice refixes 29 percent inside the cell and 22 percent from the air spaces, 49 percent leaves the leaf; wheat 26, 20 and 54 percent. Refixation inside the cell raises net CO2 uptake by 11 percent in rice and 9 percent in wheat', `
    ${T(400, 46, 'CO₂ released by mitochondria = 100 %', 'fcc-b')}
    ${key(70, 'fcc-bar-in', 'refixed inside', 'the same cell')}${key(310, 'fcc-bar-ias', 'refixed from', 'the air spaces')}${key(560, 'fcc-bar-out', 'leaves', 'the leaf')}
    ${bar(200, 'rice', 29, 22, '+11 %')}
    ${bar(370, 'wheat', 26, 20, '+9 %')}
    ${credit(790, 592, 'Busch et al. 2013, Plant Cell Environ 36:200, Table 1 (350 µmol mol⁻¹ CO₂, 30 °C)')}
  `);
}

/* v6 · C₃ cell → C₂ leaf, drawn with labels */
function v6(): string {
  const p = 'fcc11f';
  const bsMito = 360 + 420 - 34 - 4 - 13 * 1.25 - 6;
  return svg('Drawn side by side. Left, C3 rice: chloroplasts line the wall facing the air space and mitochondria lie behind them, so their CO2 enters the stroma. Right, C2 Flaveria: glycine moves from the mesophyll to the bundle sheath, where glycine decarboxylase in mitochondria at the vein side releases CO2 into the chloroplasts in front of them', `
    ${heads(p)}
    ${T(170, 44, 'C₃', 'fcc-big')}${T(170, 78, 'one cell (rice)', 'fcc-it')}
    ${T(570, 44, 'C₂', 'fcc-big')}${T(570, 78, `two cells (${it('Flaveria')})`, 'fcc-it')}
    ${c3Section(p, 22, 150, 316, 300, { air: 80, big: true, labels: true })}
    ${c2Tissue(p, 360, 150, 420, 300, { big: true })}
    ${T(444, 484, 'mesophyll', 'fcc-l')}${T(640, 484, 'bundle sheath', 'fcc-l')}${T(758, 484, 'vein', 'fcc-l')}
    ${pill(560, 124, 'glycine decarboxylase', [bsMito - 8, 172], { k: 9.6 })}
    ${credit(790, 592, 'drawn after Sage, Sage & Kocacinar 2012, Fig. 5, and Busch 2020, Fig. 2')}
  `);
}

/* v7 · Flaveria bundle-sheath TEMs, C₃ → proto-Kranz → C₂ → C₄ (Sage 2014 Fig. 2) */
function v7(): string {
  const p = 'fcc11g', w = 236;
  const cells: Array<[string, string, number, number]> = [['c3', 'C₃', 40, 48], ['pk', 'proto-Kranz', 300, 48], ['c2', 'C₂', 40, 336], ['c4', 'C₄', 300, 336]];
  const body = cells.map(([k, s, x, y], i) => {
    const a = shot(`${p}-${i}`, S14[k], x, y, w, { r: 10 });
    return `${T(x, y - 12, s, 'fcc-b', 'start')}${a.svg}`;
  }).join('');
  return svg('Bundle-sheath cells of Flaveria species in electron micrographs, coloured by Sage, Khoshravesh and Sage 2014: chloroplasts green, mitochondria red. From C3 through proto-Kranz and C2 to C4, mitochondria and chloroplasts become more numerous and gather along one cell wall', `
    ${body}
    <rect x="590" y="190" width="28" height="28" rx="6" fill="#16a05a"/>${T(630, 212, 'chloroplasts', 'fcc-l', 'start')}
    <rect x="590" y="240" width="28" height="28" rx="14" fill="#e0306a"/>${T(630, 262, 'mitochondria', 'fcc-l', 'start')}
    ${T(590, 330, `${it('Flaveria')},`, 'fcc-l', 'start')}${T(590, 358, 'bundle-sheath', 'fcc-l', 'start')}${T(590, 386, 'cells', 'fcc-l', 'start')}
    ${credit(790, 592, `${CR.sage14}, Fig. 2 (colours theirs)`)}
  `);
}

/* v8 · glycine decarboxylase moves to the bundle sheath: immunolocalization + drawing */
function v8(): string {
  const p = 'fcc11h', w = 372;
  const a = shot(`${p}-a`, GDC_D, 18, 96, w), b = shot(`${p}-b`, GDC_F, 410, 96, w);
  const mini = (x: number, c2: boolean): string => {
    const y = 430, cells: string[] = [];
    cells.push(`<rect class="fcc-wall" x="${x}" y="${y}" width="150" height="104" rx="18"/><rect class="fcc-bs" x="${x + 160}" y="${y}" width="112" height="104" rx="18"/><rect class="fcc-vein" x="${x + 282}" y="${y}" width="40" height="104" rx="20"/>`);
    for (const k of [0.3, 0.7]) cells.push(mito(x + 40, y + 104 * k, 12, 7.5, 0, !c2), mito(x + 110, y + 104 * k, 12, 7.5, 0, !c2));
    for (const k of [0.25, 0.5, 0.75]) cells.push(mito(x + 254, y + 104 * k, 11, 7, 90, true));
    return cells.join('');
  };
  return svg('Glycine decarboxylase stained brown in leaf sections of two Flaveria species (Sage, Khoshravesh and Sage 2014): in the C3 species F. cronquistii it is spread through the mesophyll; in the C2 species F. ramosissima it is concentrated in the bundle-sheath cells around the vein. Below each, a drawing of the same distribution', `
    ${T(204, 40, `C₃: ${it('F. cronquistii')}`, 'fcc-b')}${T(596, 40, `C₂: ${it('F. ramosissima')}`, 'fcc-b')}
    ${T(400, 76, 'glycine decarboxylase stained brown', 'fcc-s')}
    ${a.svg}${b.svg}
    ${pill(110, 300, 'vein', a.at(218, 160))}
    ${pill(560, 116, 'bundle sheath', b.at(262, 170))}
    ${pill(700, 330, 'vein', b.at(231, 262))}
    ${mini(46, false)}${mini(438, true)}
    ${T(121, 560, 'mesophyll', 'fcc-s')}${T(262, 560, 'bundle sheath', 'fcc-s')}
    ${T(513, 560, 'mesophyll', 'fcc-s')}${T(654, 560, 'bundle sheath', 'fcc-s')}
    ${credit(790, 592, `${CR.sage14}, Fig. 3 D, F; drawings below`)}
  `);
}

/* v9 · Khoshravesh 2016 Fig. 4: A/Ci of C₃, C₂ and C₄ grasses (CC BY 3.0), with C* from their Table 1 */
function v9(): string {
  const p = 'fcc11i';
  const a = shot(`${p}-a`, KHOSH, 20, 22, 540, { fig: true });
  return svg('Khoshravesh et al. 2016, figure 4: net CO2 assimilation against intercellular CO2 at 31 degrees for C3, C2 and C4 grasses. The C2 species start taking up CO2 at a lower intercellular CO2 than the C3 species; their C* is 10.8 to 20 micromoles per mole against about 50 in C3 grasses. The C4 species rises steeply and saturates at low CO2', `
    ${a.svg}
    ${T(680, 128, 'grasses, 31 °C', 'fcc-it')}
    ${T(680, 200, 'CO₂ compensation', 'fcc-s')}${T(680, 226, 'point C*:', 'fcc-s')}
    ${T(680, 290, 'C₃: ≈ 50', 'fcc-h')}
    ${T(680, 340, 'C₂: 11–20', 'fcc-h fcc-gly')}
    ${T(680, 372, 'µmol mol⁻¹', 'fcc-s')}
    ${T(680, 440, 'C₄: steep rise', 'fcc-h fcc-c4')}${T(680, 470, 'at low CO₂', 'fcc-l')}
    ${credit(790, 592, `${CR.khosh}; C*: their Table 1`)}
  `);
}

/* v10 · the chunk schema with C₃ and C₂ lit */
const v10 = (): string => schemaSvg('fcc11j', ['c3', 'c2'],
  'Four panels: where CO2 meets RuBisCO in C3, C2, C4 and CAM plants. Lit: C3, CO2 released behind chloroplasts (rice, wheat), and C2, CO2 released in the bundle sheath (Flaveria, Moricandia). Dimmed: C4 and CAM');

/* v11 · Sage 2012 Fig. 2: angiosperm phylogeny with the C₄ lineages in red */
function v11(): string {
  const p = 'fcc11k';
  const a = shot(`${p}-a`, TREE, 24, 40, 600, { fig: true });
  return svg('Sage, Sage and Kocacinar 2012, figure 2: a phylogeny of flowering plants in which the branches that contain C4 lineages are red: in the grasses, sedges, Caryophyllales and scattered eudicot families including Flaveria', `
    ${a.svg}
    ${pill(712, 250, 'C₄ lineages', undefined, { tint: true })}${pill(712, 288, 'in red', undefined, { tint: true })}
    ${T(712, 350, '> 60 origins', 'fcc-h')}
    ${credit(790, 592, 'Sage, Sage & Kocacinar 2012, Annu Rev Plant Biol 63:19, Fig. 2; > 60: Sage 2016')}
  `);
}

