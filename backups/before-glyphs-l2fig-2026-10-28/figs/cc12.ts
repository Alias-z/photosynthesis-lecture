// Slide C12 · C₄ photosynthesis (chunk cc, 28 Oct 2026). Pick key C10 (the slide was C10 when its figures were picked).
// Facts: Hatch & Slack 1966 Biochem J 101:103 (abstract; Fig. 2 read from the scan: > 93 % of ¹⁴C in C₄ acids after
// ≈ 1 s, then 3-PGA, hexose phosphates, sucrose). Ehleringer & Björkman 1977 Plant Physiol 59:86 (full scan, via the
// fact-check): quantum yield in air, C₄ Atriplex rosea 0.053 at 12–39 °C, C₃ Encelia californica 0.069 at 14 °C →
// 0.042 at 38 °C, C₃ better below 30 °C. von Caemmerer 2021 JXB (FT): 2 ATP per PEP regenerated. Sage, Sage &
// Kocacinar 2012 Fig. 1 (board image): CO₂ ≈ 100 µmol mol⁻¹ in mesophyll air vs ≈ 1500 in the bundle sheath.
// Furbank 2016 JXB (FT): bundle-sheath CO₂ "10-fold higher" than air, an imprecise generic figure. Haberlandt 1904.
// New variants v1–v9 first, then the earlier ones a–j (drawn by c09.ts).
import type { PlateText, Variant } from '../types';
import { draw as drawC09, VARIANTS as C09_VARIANTS } from './c09';
import { T, TV, co2, credit, enzyme, f, heads, it, pill, route, routeOnPhoto, rubisco, shot, svg, type Img } from './cc-kit';
import { c4Tissue, schemaSvg } from './cc-schema';
import maize from '../../assets/photos/cc-maize-kranz.jpg';
import haber from '../../assets/photos/cc-haberlandt-105.jpg';
import hatch from '../../assets/photos/cc-hatch-slack.png';
import nadpme from '../../assets/photos/cc-sage12-nadpme.jpg';

export const PLATE: PlateText = {
  n: 'C12',
  pick: 'C10',
  title: 'C₄ photosynthesis',
  status: 'draft',
  lead: 'C₄ plants concentrate CO₂ in bundle-sheath cells, where Rubisco works at high CO₂ and photorespiration is nearly absent.',
  points: [
    { claim: 'PEP carboxylase.', text: 'In mesophyll cells it fixes HCO₃⁻ into a four-carbon acid<br>It does not react with O₂' },
    { claim: 'Kranz anatomy.', text: 'Bundle-sheath cells form a wreath around each vein<br>The C₄ acid moves there and releases CO₂ next to Rubisco' },
    { claim: 'Costs and benefits.', text: 'Regenerating PEP costs 2 ATP per CO₂<br>It pays in hot, dry, bright conditions: maize, sugarcane, sorghum' },
  ],
  refs: [
    { label: 'Hatch & Slack 1966', url: 'https://doi.org/10.1042/bj1010103' },
    { label: 'Ehleringer & Björkman 1977', url: 'https://doi.org/10.1104/pp.59.1.86' },
    { label: 'Sage, Sage & Kocacinar 2012', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' },
    { label: 'von Caemmerer 2021', url: 'https://doi.org/10.1093/jxb/erab266' },
    { label: 'Haberlandt 1904', url: 'https://archive.org/details/physiologischepf00habeuoft/page/252' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'v1', name: 'Maize leaf section: Kranz wreaths (micrograph)' },
  { id: 'v2', name: 'One maize bundle with the CO₂ pump drawn on it', anim: true },
  { id: 'v3', name: 'Two-cell C₄ cycle with CO₂ ≈ 100 vs ≈ 1500 µmol mol⁻¹ (drawn)' },
  { id: 'v4', name: 'Haberlandt 1904: the “Kranztypus” drawing' },
  { id: 'v5', name: 'Hatch & Slack 1966: ¹⁴C first in C₄ acids (sugarcane)', anim: true },
  { id: 'v6', name: 'Quantum yield vs leaf temperature: C₄ wins above 30 °C' },
  { id: 'v7', name: 'Zoom: maize section → mesophyll and bundle-sheath cell' },
  { id: 'v8', name: 'Four ways around Rubisco: C₄ lit', anim: true },
  { id: 'v9', name: 'Sage 2012 Fig. 1: the NADP-ME C₄ cycle (published schematic)' },
  ...C09_VARIANTS,
];

export function draw(id: string): string {
  const fns: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7, v8, v9 };
  return fns[id] ? fns[id]() : drawC09(id);
}

const MAIZE: Img = { href: maize, w: 1400, h: 789 };
const HABER: Img = { href: haber, w: 732, h: 740 };
const HATCH: Img = { href: hatch, w: 694, h: 670 };
const NADPME: Img = { href: nadpme, w: 1523, h: 1030 };
const CR_MAIZE = 'maize leaf · Berkshire Community College Bioscience Image Library, Wikimedia Commons, CC0';

/* v1 · maize leaf section */
function v1(): string {
  const p = 'fcc12a';
  const a = shot(`${p}-im`, MAIZE, 14, 96, 772, { win: [0, 20, 1400, 730] });
  return svg('Maize leaf cross-section, light micrograph: each vein is wreathed by large bundle-sheath cells packed with chloroplasts; mesophyll cells lie between the wreaths', `
    ${T(400, 64, 'maize leaf, cross-section', 'fcc-b')}
    ${a.svg}
    ${pill(150, 152, 'bundle sheath', a.at(150, 330))}
    ${pill(330, 520, 'vein', a.at(272, 400))}
    ${pill(540, 152, 'mesophyll', a.at(520, 300))}
    ${pill(640, 520, 'Kranz (wreath)', a.at(860, 420))}
    ${credit(786, 552, CR_MAIZE)}
  `);
}

/* v2 · one maize bundle with the pump drawn on it */
function v2(): string {
  const p = 'fcc12b';
  const a = shot(`${p}-im`, MAIZE, 130, 30, 540, { win: [500, 150, 500, 450] });
  const m = a.at(560, 236), bs = a.at(640, 318), bs2 = a.at(858, 345), vein = a.at(742, 392);
  return svg('One vascular bundle of a maize leaf (micrograph) with the C4 pump drawn on it: CO2 enters a mesophyll cell, PEP carboxylase fixes it into a C4 acid, the acid moves into a bundle-sheath cell and releases CO2 next to Rubisco in the chloroplasts there', `
    ${heads(p)}${a.svg}
    ${co2(m[0] - 2, m[1] - 36, 10)}
    ${routeOnPhoto(p, 'k', `M${f(m[0] - 2)},${f(m[1] - 22)} V${f(m[1] - 4)}`)}
    ${enzyme(m[0], m[1] + 14, 'PEPC', 'm', 19)}
    ${routeOnPhoto(p, 'm', `M${f(m[0] + 30)},${f(m[1] + 18)} C${f(m[0] + 60)},${f(m[1] + 26)} ${f(bs[0] - 30)},${f(bs[1] - 22)} ${f(bs[0] - 2)},${f(bs[1] - 4)}`)}
    ${co2(bs[0] + 12, bs[1] + 26, 9)}${co2(bs2[0] - 4, bs2[1] - 44, 9)}
    ${pill(70, 120, 'mesophyll', [m[0] - 30, m[1] + 4])}
    ${pill(76, 310, 'C₄ acid', [m[0] + 56, m[1] + 30])}
    ${pill(732, 96, 'bundle sheath', bs2)}
    ${pill(740, 200, 'Rubisco', [bs2[0] + 6, bs2[1] - 30])}
    ${pill(740, 470, 'vein', vein)}
    ${credit(670, 592, CR_MAIZE)}
  `);
}

/* v3 · two-cell C₄ cycle, redrawn plainly after Sage 2012 Fig. 1, with the CO₂ levels of that figure */
function v3(): string {
  const p = 'fcc12c';
  const mX = 30, mW = 330, bX = 400, bW = 370, y0 = 120, h = 380;
  return svg('The C4 cycle drawn across two cells. Mesophyll cell, CO2 about 100 micromoles per mole: CO2 becomes bicarbonate, PEP carboxylase fixes it into a four-carbon acid. The acid moves into the bundle-sheath cell, CO2 about 1500 micromoles per mole, and releases CO2 to Rubisco and the Calvin–Benson–Bassham cycle. Pyruvate returns and is turned back into PEP for 2 ATP', `
    ${heads(p)}
    ${T(mX + mW / 2, 50, 'mesophyll cell', 'fcc-b')}${T(bX + bW / 2, 50, 'bundle-sheath cell', 'fcc-b')}
    ${T(mX + mW / 2, 84, 'CO₂ ≈ 100 µmol mol⁻¹', 'fcc-l')}${T(bX + bW / 2, 84, 'CO₂ ≈ 1500 µmol mol⁻¹', 'fcc-b fcc-co2')}
    <rect class="fcc-wall" x="${mX}" y="${y0}" width="${mW}" height="${h}" rx="30"/>
    <rect class="fcc-bs" x="${bX}" y="${y0}" width="${bW}" height="${h}" rx="30"/>
    ${co2(70, 186, 11)}${route(p, 'k', 'M104,186 H150')}${T(190, 193, 'HCO₃⁻', 'fcc-b')}
    ${route(p, 'k', 'M190,210 V250')}${enzyme(190, 276, 'PEP carboxylase', 'm', 19)}
    ${route(p, 'm', 'M294,276 H508')}${T(456, 262, 'C₄ acid', 'fcc-b fcc-c4')}
    ${T(560, 282, 'CO₂', 'fcc-b fcc-co2')}${route(p, 'c', 'M560,296 V340')}
    <ellipse class="fcc-cp" cx="585" cy="408" rx="140" ry="62"/>
    ${rubisco(585, 384)}${T(585, 432, 'Calvin–Benson–', 'fcc-l')}${T(585, 456, 'Bassham cycle', 'fcc-l')}
    ${co2(470, 330, 8)}${co2(690, 330, 8)}${co2(700, 474, 8)}
    ${route(p, 'm', 'M500,300 C430,330 400,420 270,440', 'fcc-thin')}${T(335, 474, 'pyruvate', 'fcc-l fcc-c4')}
    ${route(p, 'm', 'M200,440 C150,430 140,350 168,300', 'fcc-thin')}${T(118, 380, 'PEP', 'fcc-b')}
    ${T(118, 410, '+ 2 ATP', 'fcc-s')}
    ${credit(790, 592, 'drawn after Sage, Sage & Kocacinar 2012, Annu Rev Plant Biol 63:19, Fig. 1 (CO₂ values from that figure)')}
  `);
}

/* v4 · Haberlandt 1904, Fig. 105 (Panicum turgidum, after Volkens) */
function v4(): string {
  const p = 'fcc12d';
  const a = shot(`${p}-im`, HABER, 172, 40, 456, { fig: true, win: [0, 0, 732, 712] });
  return svg('Haberlandt 1904, figure 105: part of a leaf section of the grass Panicum turgidum, drawn after Volkens. Radial mesophyll cells wreathe a ring of large bundle-sheath cells around the vein, the arrangement Haberlandt named Kranztypus, wreath type', `
    ${a.svg}
    ${pill(96, 140, 'mesophyll', a.at(170, 300))}
    ${pill(700, 160, 'bundle sheath', a.at(470, 250))}
    ${pill(710, 380, 'vein', a.at(380, 380))}
    ${T(400, 540, '“Kranztypus”: wreath type', 'fcc-h')}
    ${credit(790, 592, `Haberlandt 1904, Physiologische Pflanzenanatomie, Fig. 105 (${it('Panicum turgidum')}, after Volkens); public domain`)}
  `);
}

/* v5 · Hatch & Slack 1966, Fig. 2 (scan) */
function v5(): string {
  const p = 'fcc12e';
  const a = shot(`${p}-im`, HATCH, 40, 30, 560, { fig: true });
  return svg('Hatch and Slack 1966, figure 2: share of the 14C taken up by sugarcane leaves found in each compound after 5 to 150 seconds in 14CO2. Malate plus aspartate, the C4 acids, carry most of the label first (about 88 percent at the first sample) and lose it; 3-phosphoglycerate, then hexose phosphates and sucrose gain it later', `
    ${a.svg}
    ${T(700, 72, 'sugarcane leaves', 'fcc-b')}${T(700, 102, 'in ¹⁴CO₂', 'fcc-b')}
    ${pill(690, 190, 'C₄ acids first', a.at(140, 36), { tint: true })}
    ${T(690, 224, 'malate + aspartate', 'fcc-s')}
    ${pill(690, 330, '3-PGA later', a.at(272, 362), { tint: true })}
    ${pill(690, 440, 'sugars last', a.at(424, 498), { tint: true })}
    ${credit(790, 592, 'Hatch & Slack 1966, Biochem J 101:103, Fig. 2 (scan, free in PMC1270070)')}
  `);
}

/* v6 · quantum yield vs leaf temperature (Ehleringer & Björkman 1977, Fig. 3; lines through the reported values) */
function v6(): string {
  const X = (t: number): number => 120 + (t - 10) * 21;
  const Y = (q: number): number => 470 - (q - 0.03) * 7600;
  const ax: string[] = [];
  for (let t = 10; t <= 40; t += 5) ax.push(`<path class="fcc-tk" d="M${X(t)},470 v8"/>${T(X(t), 500, `${t}`, 'fcc-ax')}`);
  for (let q = 0.03; q <= 0.0801; q += 0.01) ax.push(`<path class="fcc-tk" d="M${X(10) - 8},${f(Y(q))} h8"/>${T(X(10) - 14, Y(q) + 6, q.toFixed(2), 'fcc-ax', 'end')}`);
  const xc = X(30);
  return svg('Quantum yield of CO2 uptake in normal air against leaf temperature, after Ehleringer and Björkman 1977: the C4 plant Atriplex rosea stays at 0.053 from 12 to 39 degrees; the C3 plant Encelia californica falls from 0.069 at 14 degrees through 0.052 at 30 degrees to 0.042 at 38 degrees; the lines cross near 30 degrees', `
    <rect class="fcc-day" x="${f(xc)}" y="${f(Y(0.08))}" width="${f(X(40) - xc)}" height="${f(470 - Y(0.08))}"/>
    <path class="fcc-axl" d="M${X(10)},${f(Y(0.082))} V470 H${X(40) + 10}"/>${ax.join('')}
    <path class="fcc-c4l" d="M${X(12)},${f(Y(0.053))} H${X(39)}"/>
    <path class="fcc-c3" d="M${X(14)},${f(Y(0.069))} Q${X(24)},${f(Y(0.0615))} ${X(30)},${f(Y(0.0524))} T${X(38)},${f(Y(0.042))}"/>
    ${[[14, 0.069], [30, 0.0524], [38, 0.042]].map(([t, q]) => `<circle class="fcc-dot" cx="${X(t)}" cy="${f(Y(q))}" r="7"/>`).join('')}
    ${T(X(14) + 16, Y(0.069) - 12, `C₃: ${it('Encelia californica')}`, 'fcc-b', 'start')}
    ${T(X(12), Y(0.053) + 32, `C₄: ${it('Atriplex rosea')}`, 'fcc-b fcc-c4', 'start')}
    ${T((xc + X(40)) / 2, Y(0.08) + 30, 'C₄ better', 'fcc-b')}${T((xc + X(40)) / 2, Y(0.08) + 58, 'above ≈ 30 °C', 'fcc-l')}
    ${TV(46, 300, 'quantum yield (CO₂ per absorbed photon)')}
    ${T(X(25), 538, 'leaf temperature (°C)', 'fcc-at')}
    ${credit(790, 592, 'after Ehleringer & Björkman 1977, Plant Physiol 59:86, Fig. 3 and Table 1 (normal air); curves through the reported values')}
  `);
}

/* v7 · zoom from the maize section to the drawn pair of cells */
function v7(): string {
  const p = 'fcc12g';
  const a = shot(`${p}-im`, MAIZE, 14, 150, 300, { win: [560, 190, 400, 360] });
  const b0 = a.at(560, 190), b1 = a.at(960, 550);
  return svg('Left, one bundle of a maize leaf section (micrograph); right, the same mesophyll and bundle-sheath cells drawn: CO2 is fixed by PEP carboxylase in the mesophyll, the C4 acid moves into the bundle sheath and releases CO2 there, so CO2 builds up around the chloroplasts', `
    ${heads(p)}
    ${T(164, 120, 'maize leaf', 'fcc-b')}
    ${a.svg}
    <path class="fcc-rule" d="M${f(b1[0])},${f(b0[1])} L380,140 M${f(b1[0])},${f(b1[1])} L380,470"/>
    ${c4Tissue(p, 430, 140, 350, 330, { big: true })}
    ${T(500, 506, 'mesophyll', 'fcc-l')}${T(660, 506, 'bundle sheath', 'fcc-l')}
    ${credit(790, 592, CR_MAIZE)}
  `);
}

/* v8 · the chunk schema with C₄ lit */
const v8 = (): string => schemaSvg('fcc12h', ['c4'],
  'Four panels: where CO2 meets Rubisco in C3, C2, C4 and CAM plants. Lit: C4, CO2 pumped into the bundle sheath (maize, sugarcane). Dimmed: C3, C2 and CAM');

/* v9 · Sage, Sage & Kocacinar 2012, Fig. 1 */
function v9(): string {
  const p = 'fcc12i';
  const a = shot(`${p}-im`, NADPME, 20, 40, 760, { fig: true });
  return svg('Sage, Sage and Kocacinar 2012, figure 1: the NADP-malic enzyme C4 cycle. In the mesophyll cell, at about 100 micromoles CO2 per mole, carbonic anhydrase makes bicarbonate and PEP carboxylase fixes it into oxaloacetate and malate; malate moves through plasmodesmata into the bundle-sheath cell, at about 1500 micromoles per mole, where NADP-malic enzyme releases CO2 to Rubisco and the C3 cycle; pyruvate returns and is turned back into PEP', `
    ${a.svg}
    ${credit(780, 592, 'Sage, Sage & Kocacinar 2012, Annu Rev Plant Biol 63:19, Fig. 1')}
  `);
}
