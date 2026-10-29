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
import { T, TV, atpTag, co2, credit, enzyme, f, heads, it, pill, route, routeOnPhoto, rubisco, shot, svg, type A, type Img, type Pt } from './cc-kit';
import { c4Tissue, schemaSvg } from './cc-schema';
import maize from '../../assets/photos/cc-maize-kranz.jpg';
import haber from '../../assets/photos/cc-haberlandt-105.jpg';
import hatch from '../../assets/photos/cc-hatch-slack.png';
import nadpme from '../../assets/photos/cc-sage12-nadpme.jpg';
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import pepcPng from '../../assets/rf/pepc-3zge.png';
import { AR, STE, WIN_STE, chloroplast, granum, imgC, kidAt, lab, magnifier, mitochondrion, onPhoto, ringOn, wallV, type Look } from './cc11a';
import { bilayer } from './cell-schema';
import { carbG, o2G } from '../anim/co2-kit';

// Text at bachelor level (overnight, 29 Oct 2026): one essence, "C₄ plants pump CO₂ into the bundle sheath with PEPC and a
// C₄ acid; there RuBisCO sits in high CO₂ and hardly takes O₂; it costs extra ATP". Sources: Hatch & Slack 1966 (¹⁴C
// first in C₄ acids); Sage, Sage & Kocacinar 2012 Fig. 1 (CO₂ ≈ 1500 µmol mol⁻¹ in the bundle sheath vs ≈ 100 in the
// mesophyll); von Caemmerer 2021 (2 ATP per PEP regenerated); Ehleringer & Björkman 1977 (C₄ quantum yield higher above
// ≈ 30 °C) and Still et al. 2003 (C₄ vegetation in warm climates): "pays off mainly in warm climates".
export const PLATE: PlateText = {
  n: 'C12',
  pick: 'C10',
  title: 'C₄ photosynthesis',
  status: 'draft',
  lead: 'C₄ plants pump CO₂ into the bundle sheath.<br>There RuBisCO sits in high CO₂ and hardly reacts with O₂.',
  points: [
    { claim: 'PEP carboxylase (PEPC) fixes CO₂.', text: 'In the mesophyll it makes a C₄ acid; it does not react with O₂' },
    { claim: 'The C₄ acid moves to the bundle sheath.', text: 'There it releases its CO₂ next to RuBisCO' },
    { claim: 'The pump costs extra ATP.', text: 'Regenerating PEP uses ATP, so C₄ pays off mainly in warm climates' },
  ],
  refs: [
    { label: 'Hatch & Slack 1966', url: 'https://doi.org/10.1042/bj1010103' },
    { label: 'Sage, Sage & Kocacinar 2012', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' },
    { label: 'von Caemmerer 2021', url: 'https://doi.org/10.1093/jxb/erab266' },
    { label: 'Ehleringer & Björkman 1977', url: 'https://doi.org/10.1104/pp.59.1.86' },
    { label: 'Still et al. 2003', url: 'https://doi.org/10.1029/2001GB001807' },
    { label: 'Khoshravesh et al. 2016', url: 'https://doi.org/10.1093/jxb/erw150' },
  ],
};

export const VARIANTS: Variant[] = [
  // overnight, 29 Oct 2026: page versions in the approved micrograph-and-magnifier style (plates.ts lists p… first)
  { id: 'p1', name: 'Maize Kranz micrograph with a magnifier on the pump: PEPC, C₄ acid, CO₂ crowded at RuBisCO' },
  { id: 'p2', name: 'C₃ vs C₄ micrographs: mesophyll RuBisCO in low CO₂, bundle-sheath RuBisCO in high CO₂' },
  { id: 'r1', name: 'Maize micrograph, magnifier on a mesophyll and a bundle-sheath cell: HCO₃⁻ → PEPC → C₄ acid, CO₂ concentrated at RuBisCO' },
  { id: 'r2', name: 'C₃ vs C₄ micrographs, same magnifier: C₃ CO₂ leaks away (1 in 4 recaptured), C₄ bundle sheath crowded, one leaks' },
  { id: 'r3', name: 'Two cells drawn: the C₄ cycle from HCO₃⁻ to CO₂ concentrated at RuBisCO, pyruvate back for 2 ATP' },
  { id: 'v1', name: 'Maize leaf section: Kranz wreaths (micrograph)' },
  { id: 'v2', name: 'One maize bundle with the CO₂ pump drawn on it', anim: true },
  { id: 'v3', name: 'Two-cell C₄ cycle with CO₂ ≈ 100 vs ≈ 1500 µmol mol⁻¹ (drawn)' },
  { id: 'v4', name: 'Haberlandt 1904: the “Kranztypus” drawing' },
  { id: 'v5', name: 'Hatch & Slack 1966: ¹⁴C first in C₄ acids (sugarcane)', anim: true },
  { id: 'v6', name: 'Quantum yield vs leaf temperature: C₄ wins above 30 °C' },
  { id: 'v7', name: 'Zoom: maize section → mesophyll and bundle-sheath cell' },
  { id: 'v8', name: 'Four ways around RuBisCO: C₄ lit', anim: true },
  { id: 'v9', name: 'Sage 2012 Fig. 1: the NADP-ME C₄ cycle (published schematic)' },
  ...C09_VARIANTS,
];

export function draw(id: string): string {
  const fns: Record<string, () => string> = { p1, p2, r1, r2, r3, v1, v2, v3, v4, v5, v6, v7, v8, v9 };
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
  return svg('One vascular bundle of a maize leaf (micrograph) with the C4 pump drawn on it: CO2 enters a mesophyll cell, PEP carboxylase fixes it into a C4 acid, the acid moves into a bundle-sheath cell and releases CO2 next to RuBisCO in the chloroplasts there', `
    ${heads(p)}${a.svg}
    ${co2(m[0] - 2, m[1] - 36, 10)}
    ${routeOnPhoto(p, 'k', `M${f(m[0] - 2)},${f(m[1] - 22)} V${f(m[1] - 4)}`)}
    ${enzyme(m[0], m[1] + 14, 'PEPC', 'm', 19)}
    ${routeOnPhoto(p, 'm', `M${f(m[0] + 30)},${f(m[1] + 18)} C${f(m[0] + 60)},${f(m[1] + 26)} ${f(bs[0] - 30)},${f(bs[1] - 22)} ${f(bs[0] - 2)},${f(bs[1] - 4)}`)}
    ${co2(bs[0] + 12, bs[1] + 26, 9)}${co2(bs2[0] - 4, bs2[1] - 44, 9)}
    ${pill(70, 120, 'mesophyll', [m[0] - 30, m[1] + 4])}
    ${pill(76, 310, 'C₄ acid', [m[0] + 56, m[1] + 30])}
    ${pill(732, 96, 'bundle sheath', bs2)}
    ${pill(740, 200, 'RuBisCO', [bs2[0] + 6, bs2[1] - 30])}
    ${pill(740, 470, 'vein', vein)}
    ${credit(670, 592, CR_MAIZE)}
  `);
}

/* v3 · two-cell C₄ cycle, redrawn plainly after Sage 2012 Fig. 1, with the CO₂ levels of that figure */
function v3(): string {
  const p = 'fcc12c';
  const mX = 30, mW = 330, bX = 400, bW = 370, y0 = 120, h = 380;
  return svg('The C4 cycle drawn across two cells. Mesophyll cell, CO2 about 100 micromoles per mole: CO2 becomes bicarbonate, PEP carboxylase fixes it into a four-carbon acid. The acid moves into the bundle-sheath cell, CO2 about 1500 micromoles per mole, and releases CO2 to RuBisCO and the Calvin–Benson–Bassham cycle. Pyruvate returns and is turned back into PEP for 2 ATP', `
    ${heads(p)}
    ${T(mX + mW / 2, 50, 'mesophyll cell', 'fcc-b')}${T(bX + bW / 2, 50, 'bundle-sheath cell', 'fcc-b')}
    ${T(mX + mW / 2, 84, 'CO₂ ≈ 100 µmol mol⁻¹', 'fcc-l')}${T(bX + bW / 2, 84, 'CO₂ ≈ 1500 µmol mol⁻¹', 'fcc-b fcc-co2')}
    <rect class="fcc-wall" x="${mX}" y="${y0}" width="${mW}" height="${h}" rx="30"/>
    <rect class="fcc-bs" x="${bX}" y="${y0}" width="${bW}" height="${h}" rx="30"/>
    ${co2(70, 186, 11)}${route(p, 'c', 'M104,186 H150')}${T(190, 193, 'HCO₃⁻', 'fcc-b')}
    ${route(p, 'k', 'M190,210 V250')}${enzyme(190, 276, 'PEP carboxylase', 'm', 19)}
    ${route(p, 'm', 'M294,276 H508')}${T(456, 262, 'C₄ acid', 'fcc-b fcc-c4')}
    ${co2(560, 276, 10)}${T(594, 283, 'CO₂', 'fcc-b', 'start')}${route(p, 'c', 'M560,296 V340')}
    <ellipse class="fcc-cp" cx="585" cy="408" rx="140" ry="62"/>
    ${rubisco(585, 384)}${T(585, 432, 'Calvin–Benson–', 'fcc-l')}${T(585, 456, 'Bassham cycle', 'fcc-l')}
    ${co2(470, 330, 8)}${co2(690, 330, 8)}${co2(700, 474, 8)}
    ${route(p, 'm', 'M500,300 C430,330 400,420 270,440', 'fcc-thin')}${T(335, 474, 'pyruvate', 'fcc-l fcc-c4')}
    ${route(p, 'm', 'M200,440 C150,430 140,350 168,300', 'fcc-thin')}${T(118, 380, 'PEP', 'fcc-b')}
    ${T(84, 416, '+', 'fcc-s')}${atpTag(128, 410, '2 ATP')}
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
  'Four panels: where CO2 meets RuBisCO in C3, C2, C4 and CAM plants. Lit: C4, CO2 pumped into the bundle sheath (maize, sugarcane). Dimmed: C3, C2 and CAM');

/* v9 · Sage, Sage & Kocacinar 2012, Fig. 1 */
function v9(): string {
  const p = 'fcc12i';
  const a = shot(`${p}-im`, NADPME, 20, 40, 760, { fig: true });
  return svg('Sage, Sage and Kocacinar 2012, figure 1: the NADP-malic enzyme C4 cycle. In the mesophyll cell, at about 100 micromoles CO2 per mole, carbonic anhydrase makes bicarbonate and PEP carboxylase fixes it into oxaloacetate and malate; malate moves through plasmodesmata into the bundle-sheath cell, at about 1500 micromoles per mole, where NADP-malic enzyme releases CO2 to RuBisCO and the C3 cycle; pyruvate returns and is turned back into PEP', `
    ${a.svg}
    ${credit(780, 592, 'Sage, Sage & Kocacinar 2012, Annu Rev Plant Biol 63:19, Fig. 1')}
  `);
}

/* ================================================================ page versions p1, p2 (overnight, 29 Oct 2026) */
// The approved micrograph-and-magnifier style (anim/c4-style.ts) as stills, with the kit of cc11a.ts: the maize Kranz
// micrograph (Berkshire Community College Bioscience Image Library, Wikimedia Commons, CC0; the crop of c4-style.ts), its
// wreath of bundle-sheath cells outlined, a lens on the wall between a bundle-sheath and a mesophyll cell (as in the
// frame), and a magnifier with bilayers, real protein renders (PEPC PDB 3ZGE, Paulus et al. 2013; RuBisCO PDB 8RUC) and
// slide 19's CO₂ character, crowded at RuBisCO. In maize (NADP-malic enzyme type) the C₄ acid releases its CO₂ inside
// the bundle-sheath chloroplast (Sage, Sage & Kocacinar 2012, Fig. 1).

const ZEA: Img = { href: zeaJpg, w: 1000, h: 740 };
const CR_ZEA = 'maize leaf: Berkshire Community College Bioscience Image Library, Wikimedia Commons (CC0)';
/** HCO₃⁻ (as in anim/c4-style.ts): a C with 3 O, one of them carrying the H. */
const hco3G = (r = 11): string => `<circle class="atom atom-H" cx="${f(-1.7 * r)}" cy="${f(-1.55 * r)}" r="${f(r * 0.56)}"/>
  <circle class="atom atom-O" cx="${f(-1.2 * r)}" cy="${f(-0.75 * r)}" r="${r}"/><circle class="atom atom-O" cx="${f(1.2 * r)}" cy="${f(-0.75 * r)}" r="${r}"/>
  <circle class="atom atom-O" cx="0" cy="${f(1.3 * r)}" r="${r}"/><circle class="atom atom-C" r="${r}"/>`;
/** Several CO₂ characters, each [x, y, look]. */
const crowd = (p: string, r: number, q: Array<[number, number, Look]>): string => q.map(([x, y, m], i) => kidAt(`${p}k${i}`, [x, y], r, m)).join('');

/* ---------- p1 · the maize Kranz section and a magnifier on the pump ---------- */

function p1(): string {
  const p = 'fcc12p1', C: Pt = [530, 330], R = 250, PD = 110;
  const a = shot(`${p}-a`, ZEA, 14, 40, 260, { win: [150, 100, 650, 600], r: 8 });
  const k = 260 / 650;
  const L = (x: number, y: number, t: string): string => lab(x, y, t, 'fcca-ml cel-halo');
  // left the bundle-sheath cell: a chloroplast pressed to the wall, RuBisCO in it, CO₂ crowding round it; the wall with
  // a plasmodesma, the C₄ acid in it; right the mesophyll cell: PEPC with HCO₃⁻
  const m = magnifier(`${p}-m`, a.at(752, 386), 12, C, R, `
    <rect class="co2k-cyt" x="-255" y="-255" width="510" height="510"/>
    ${wallV(-18, 18, -255, 255, [-24, 24], { y: PD, h: 15 })}
    ${chloroplast([-146, -20], 100, 150, granum(-140, 100, 40, 2) + granum(-146, -160, 30, 2), [-176, -36], 96)}
    ${crowd(p, 13, [[-104, -112, { face: 's' }], [-88, -40, { face: 's', sweat: true, sx: 0.94 }], [-92, 34, { lab: 'CO₂', labDy: 34 }],
      [-170, 54, { face: 's', sweat: true }], [-180, -118, {}]])}
    ${imgC(pepcPng, [138, -60], 120, AR.pepc)}
    <g transform="translate(156 70)">${hco3G(12)}</g>
    <g transform="translate(0 ${PD})">${carbG('CCCC', 10)}</g>
    ${route(p, 'k', 'M152,42 C150,28 146,14 142,0', 'fcc-thin')}
    ${route(p, 'm', 'M96,-2 C76,30 64,78 54,100', 'fcc-thin')}
    ${route(p, 'm', 'M-52,110 C-64,110 -74,102 -84,92', 'fcc-thin')}
    ${L(-176, 26, 'RuBisCO')}${L(138, -124, 'PEPC')}${L(156, 120, 'HCO₃⁻')}${L(0, 80, 'C₄ acid')}${L(0, 158, 'plasmodesma')}`);
  return svg('Top left, a small light micrograph of a maize leaf in cross-section: a vein wreathed by large bundle-sheath cells packed with chloroplasts, outlined and named, mesophyll cells around them. A lens on the wall between a bundle-sheath cell and a mesophyll cell opens a large magnifier. In it, the mesophyll cell on the right holds PEP carboxylase (PEPC, its real structure) with bicarbonate below it; teal arrows lead from PEPC to a C4 acid of four carbon balls in the plasmodesma through the cell wall, and on into the bundle-sheath chloroplast on the left. There five CO2 characters crowd around RuBisCO, some strained and sweating: CO2 is concentrated where RuBisCO is', `
    ${heads(p)}<g class="dk1 co2k">
    ${a.svg}${ringOn(`${p}-a`, a.at(476, 385), 285 * k, 215 * k)}
    ${onPhoto(a.at(478, 425), 'vein', 'co2k-il cel-halo')}${onPhoto(a.at(476, 645), 'bundle sheath', 'co2k-il cel-halo')}${onPhoto(a.at(680, 140), 'mesophyll', 'co2k-il cel-halo')}
    ${T(144, 304, 'maize leaf (C₄)', 'co2k-zl')}
    ${m.lens}${m.mag}
    ${T(420, 64, 'bundle-sheath cell', 'co2k-zl')}${T(648, 64, 'mesophyll cell', 'co2k-zl')}
    ${credit(14, 548, 'maize leaf: Berkshire Community College', 'start')}${credit(14, 563, 'Bioscience Image Library, Wikimedia Commons (CC0)', 'start')}
    ${credit(14, 578, 'RuBisCO: PDB 8RUC', 'start')}${credit(14, 593, 'PEPC: PDB 3ZGE (Paulus et al. 2013)', 'start')}</g>
  `);
}

/* ---------- p2 · C₃ and C₄ micrographs side by side, each with its essence ---------- */

function p2(): string {
  const p = 'fcc12p2';
  const winA: [number, number, number, number] = [100, 0, 700, WIN_STE[3]], winB: [number, number, number, number] = [140, 80, 690, 660];
  const a = shot(`${p}-a`, STE, 13, 110, 374, { win: winA });
  const b = shot(`${p}-b`, ZEA, 413, 110, 374, { win: winB });
  const ka = 374 / winA[2], kb = 374 / winB[2];
  const o2 = (q: Pt): string => `<g transform="translate(${f(q[0])} ${f(q[1])})"><rect class="dk-cap" x="-24" y="-12" width="48" height="24" rx="12"/>${o2G(8)}</g>${T(q[0], q[1] - 18, 'O₂', 'cel-mn cel-halo')}`;
  // C₃: one CO₂ and an O₂ in the mesophyll, where RuBisCO is; C₄: CO₂ crowded in a bundle-sheath cell
  const c4: Array<[number, number]> = [[640, 300], [700, 340], [715, 400], [690, 455], [630, 480]];
  const looks: Look[] = [{}, { face: 's', sweat: true }, {}, { face: 's' }, { face: 's', sweat: true }];
  return svg('Two leaf cross-sections side by side, light micrographs, the ring of bundle-sheath cells around the vein outlined and named on each. Left, a C3 leaf (Steinchisma laxum, Khoshravesh et al. 2016): large bundle-sheath cells with few chloroplasts; in the mesophyll a CO2 character and an O2 molecule side by side. Its pill reads: mesophyll RuBisCO, low CO2. Right, a C4 leaf (maize): the bundle-sheath cells packed with chloroplasts, and five CO2 characters crowded in one of them, some strained and sweating. Its pill reads: bundle-sheath RuBisCO, high CO2', `
    <g class="dk1 co2k">
    <path d="M400,44V530" style="stroke:#d8d5cb;stroke-width:1.4"/>
    ${T(200, 66, 'C₃ leaf', 'fcc-b')}${T(200, 94, it('Steinchisma laxum'), 'fcc-s')}
    ${T(600, 66, 'C₄ leaf', 'fcc-b')}${T(600, 94, `maize (${it('Zea mays')})`, 'fcc-s')}
    ${a.svg}${ringOn(`${p}-a`, a.at(481, 352), 301 * ka, 348 * ka)}
    ${onPhoto(a.at(478, 425), 'vein')}${onPhoto(a.at(295, 525), 'bundle sheath')}${onPhoto(a.at(700, 30), 'mesophyll')}
    ${kidAt(`${p}ka`, a.at(165, 140), 11, { lab: 'CO₂' })}${o2(a.at(250, 70))}
    ${b.svg}${ringOn(`${p}-b`, b.at(476, 385), 285 * kb, 215 * kb)}
    ${onPhoto(b.at(478, 425), 'vein')}${onPhoto(b.at(476, 640), 'bundle sheath')}${onPhoto(b.at(740, 160), 'mesophyll')}
    ${c4.map(([u, v], i) => kidAt(`${p}kb${i}`, b.at(u, v), 9, looks[i])).join('')}
    ${pill(200, 504, 'mesophyll RuBisCO: low CO₂', undefined, { tint: true })}
    ${pill(600, 504, 'bundle-sheath RuBisCO: high CO₂', undefined, { tint: true })}
    ${credit(13, 582, `${it('Steinchisma laxum')}: Khoshravesh et al. 2016,`, 'start')}${credit(13, 597, 'J Exp Bot 67:3065, Fig. 1 (CC BY 3.0)', 'start')}
    ${credit(787, 582, 'maize: Berkshire Community College Bioscience')}${credit(787, 597, 'Image Library, Wikimedia Commons (CC0)')}</g>
  `);
}

/* ================================================================ variants of the picked p2: r1, r2, r3 (29 Oct 2026) */
// Lecturer: "make more variants that really show the two-compartment thing: bicarbonate to C₄ acid [in the mesophyll],
// and CO₂ really concentrated [in the bundle sheath, around RuBisCO]"; compare with C₃, "where much of it leaks out".
// The 2 compartments carry one tint each on all three (mesophyll pale green, bundle sheath pale teal). Bundle-sheath CO₂
// ≈ 10 × air: von Caemmerer & Furbank 2003, Photosynth Res 77:191. Maize (NADP-malic enzyme type) bundle-sheath
// chloroplasts have hardly any grana, so they are drawn without. C₃: about 1 in 4 of the photorespired CO₂ recaptured
// (Busch et al. 2013, drawn as on slide 21). PEP is made again in the mesophyll chloroplast for 2 ATP (von Caemmerer 2021).

const TINT_M = '#eef4e2', TINT_B = '#dfece8';
const CR_PDB = 'RuBisCO: PDB 8RUC · PEPC: PDB 3ZGE (Paulus et al. 2013)';
const CR_VCF = 'CO₂ ≈ 10 × air: von Caemmerer & Furbank 2003';
/** Magnifier and drawing labels. */
const ML = (x: number, y: number, s: string, a: A = 'middle'): string => lab(x, y, s, 'fcca-ml cel-halo', a);
const ms = (x: number, y: number, s: string, a: A = 'middle'): string => T(x, y, s, 'fcca-il cel-halo', a);
/** A result pill (as on slide 21). */
const resultR = (x: number, y: number, s: string): string => {
  const w = s.length * 9.1 + 28;
  return `<rect class="fcca-resb" x="${f(x - w / 2)}" y="${f(y - 17)}" width="${f(w)}" height="34" rx="17"/>${T(x, y + 6, s, 'fcca-res')}`;
};

/* ---------- r1 · maize micrograph, a magnifier on one mesophyll cell beside one bundle-sheath cell ---------- */

function r1(): string {
  const p = 'fcc12r1', C: Pt = [300, 326], R = 250, PD = 132;
  const win: [number, number, number, number] = [150, 100, 650, 600];
  const a = shot(`${p}-a`, ZEA, 556, 40, 230, { win, r: 8 });
  const k = 230 / win[2];
  // bundle-sheath chloroplast at (140, 16): RuBisCO in it, 8 CO₂ crowded round it
  const B: Pt = [140, 16];
  const q: Array<[number, number, Look]> = [
    [0, -70, {}], [-56, -12, { face: 's' }], [56, -12, { face: 's', sweat: true }],
    [-56, 22, { face: 's', sweat: true }], [56, 22, { face: 's' }], [-34, 58, { face: 's', sweat: true }], [34, 58, {}]];
  const m = magnifier(`${p}-m`, a.at(272, 425), 10, C, R, `
    <rect x="-260" y="-260" width="260" height="520" style="fill:${TINT_M}"/><rect x="0" y="-260" width="260" height="520" style="fill:${TINT_B}"/>
    ${wallV(-16, 16, -260, 260, [-22, 22], { y: PD, h: 15 })}
    ${kidAt(`${p}k0`, [-120, -170], 12, { lab: 'CO₂' })}
    ${route(p, 'c', 'M-120,-152 V-124', 'fcc-thin')}
    <g transform="translate(-120 -88)">${hco3G(12)}</g>
    ${route(p, 'k', 'M-120,-56 V-42', 'fcc-thin')}
    ${imgC(pepcPng, [-120, 6], 100, AR.pepc)}
    ${route(p, 'm', `M-104,54 C-96,96 -82,${PD} -50,${PD}`, 'fcc-thin')}
    <g transform="translate(0 ${PD})">${carbG('CCCC', 10)}</g>
    ${chloroplast(B, 92, 96, '', B, 52)}
    ${route(p, 'm', `M46,${PD} C66,${PD} 80,${PD - 8} 88,${PD - 28}`, 'fcc-thin')}
    ${crowd(p, 10, q.map(([u, v, l]): [number, number, Look] => [B[0] + u, B[1] + v, l]))}
    ${ML(-168, -82, 'HCO₃⁻', 'end')}${ML(-182, 12, 'PEPC', 'end')}${ML(0, PD - 26, 'C₄ acid')}${lab(0, PD + 46, 'plasmodesma')}
    ${ML(B[0], B[1] - 30, 'RuBisCO')}`);
  return svg('Top right, a small light micrograph of a maize leaf in cross-section: a vein wreathed by large bundle-sheath cells packed with chloroplasts, outlined and named, mesophyll cells around them. A lens on the outer wall of a bundle-sheath cell opens a large magnifier on the left: the mesophyll cell on its left half, tinted pale green, the bundle-sheath cell on its right half, tinted pale teal, the cell wall between them crossed by a plasmodesma. In the mesophyll a CO2 character becomes bicarbonate, HCO3-, which PEP carboxylase (PEPC, its real structure) fixes; a teal arrow carries the C4 acid, four carbon balls, through the plasmodesma into the bundle-sheath chloroplast. There seven CO2 characters crowd round RuBisCO, many strained and sweating. A pill beside it reads: CO2 concentrated, about 10 times the air', `
    ${heads(p)}<g class="dk1 co2k">
    ${a.svg}${ringOn(`${p}-a`, a.at(476, 385), 285 * k, 215 * k)}
    ${onPhoto(a.at(478, 425), 'vein', 'co2k-il cel-halo')}${onPhoto(a.at(476, 645), 'bundle sheath', 'co2k-il cel-halo')}${onPhoto(a.at(300, 150), 'mesophyll', 'co2k-il cel-halo')}
    ${T(671, 278, 'maize leaf (C₄)', 'co2k-zl')}
    ${m.lens}${m.mag}
    ${T(C[0] - 125, 56, 'mesophyll cell', 'co2k-zl')}${T(C[0] + 125, 56, 'bundle-sheath cell', 'co2k-zl')}
    ${pill(676, 380, 'CO₂ concentrated', [C[0] + B[0] + 88, C[1] + B[1] - 26], { tint: true })}
    ${T(676, 418, '≈ 10 × the air', 'fcc-s')}
    ${credit(786, 540, 'maize leaf: Berkshire Community College')}${credit(786, 555, 'Bioscience Image Library, Wikimedia Commons (CC0)')}
    ${credit(786, 570, CR_PDB)}${credit(786, 585, CR_VCF)}</g>
  `);
}

/* ---------- r2 · C₃ beside C₄, the same magnifier on both micrographs ---------- */

/** C₃ mesophyll cell at an air space (as on slide 21), tinted as the mesophyll. */
const c3Mes = (): string => `<rect x="-150" y="-150" width="176" height="300" style="fill:${TINT_M}"/><rect class="co2k-ias" x="50" y="-150" width="100" height="300"/>
  ${wallV(32, 50, -150, 150, [26])}
  ${chloroplast([-50, -38], 60, 30, granum(-102, -46, 12), [-74, -38], 42)}
  ${mitochondrion([-50, 48], 48, 26, [-0.9, -0.8, 0.82, 0.92], 10, [-54, 48], 40)}
  ${ms(-18, -114, 'chloroplast')}${ms(-18, -97, '(RuBisCO)')}${ms(-34, 96, 'mitochondrion')}`;

function r2(): string {
  const p = 'fcc12r2', R = 140, CY = 428, PD = 60;
  const winB: [number, number, number, number] = [0, 40, 1000, 672];
  const a = shot(`${p}-a`, STE, 30, 50, 340, { win: WIN_STE });
  const b = shot(`${p}-b`, ZEA, 430, 50, 340, { win: winB });
  const sa = 340 / WIN_STE[2], sb = 340 / winB[2];
  // C₃: of 4 photorespired CO₂, 1 held at RuBisCO, 3 gone into the air space
  const ma = magnifier(`${p}-ma`, a.at(880, 305), 12, [200, CY], R, `${c3Mes()}
    ${route(p, 'c', 'M-30,22 C-30,10 -28,-2 -26,-24', 'fcc-thin')}
    ${route(p, 'x', 'M0,40 C20,36 40,30 60,24', 'fcc-thin')}
    ${kidAt(`${p}k0`, [-22, -38], 10, { face: 's', sweat: true, lab: 'CO₂', labDy: -14 })}
    ${kidAt(`${p}k1`, [92, -48], 10, { face: 'h', lab: 'CO₂' })}
    ${kidAt(`${p}k2`, [92, 4], 10, { face: 'h', lab: 'CO₂' })}
    ${kidAt(`${p}k3`, [92, 56], 10, { face: 'h', lab: 'CO₂' })}
    ${ms(72, 94, 'air space')}`);
  // C₄: the wall between a mesophyll cell (left) and a bundle-sheath cell (right); the C₄ acid in the plasmodesma, the
  // bundle-sheath chloroplast crowded with CO₂, one CO₂ leaking back into the mesophyll
  const B: Pt = [66, -14];
  const q: Array<[number, number, Look]> = [
    [0, -48, { lab: 'CO₂' }], [-40, -22, { face: 's', sweat: true }], [40, -22, { face: 's' }],
    [-40, 24, { face: 's' }], [40, 24, { face: 's', sweat: true }], [0, 52, {}]];
  const mb = magnifier(`${p}-mb`, b.at(272, 425), 12, [600, CY], R, `
    <rect x="-150" y="-150" width="118" height="300" style="fill:${TINT_M}"/><rect x="-32" y="-150" width="190" height="300" style="fill:${TINT_B}"/>
    ${wallV(-40, -24, -150, 150, [-46, -18], { y: PD, h: 10 })}
    ${chloroplast(B, 70, 80, '', B, 36)}
    ${crowd(p, 8, q.map(([u, v, l]): [number, number, Look] => [B[0] + u, B[1] + v, l]))}
    <g transform="translate(-32 ${PD})">${carbG('CCCC', 6)}</g>
    ${route(p, 'm', `M-4,${PD} C4,${PD} 10,${PD - 6} 14,${PD - 16}`, 'fcc-thin')}
    ${route(p, 'x', 'M2,16 C-20,20 -42,26 -58,30', 'fcc-thin')}
    ${kidAt(`${p}kx`, [-90, 34], 9, { face: 'h', lab: 'CO₂' })}
    ${ms(-86, -30, 'mesophyll')}${ms(50, 96, 'bundle sheath')}${ms(-32, PD + 24, 'C₄ acid')}`);
  return svg('Two leaf cross-sections side by side, light micrographs, the ring of bundle-sheath cells around the vein outlined on each, and under each the same kind of magnifier. Left, a C3 leaf (Steinchisma laxum), titled: the CO2 leaks away. The magnifier shows a mesophyll cell at an air space: a chloroplast with RuBisCO holds one CO2 character, strained; three CO2 released by the mitochondrion have passed the wall into the air space and smile. Pill: about 1 in 4 recaptured. Right, a C4 leaf (maize), titled: the CO2 is concentrated. The magnifier shows the wall between a mesophyll cell, tinted pale green, and a bundle-sheath cell, tinted pale teal: a C4 acid in the plasmodesma, six CO2 characters crowded in the bundle-sheath chloroplast round RuBisCO, strained and sweating, and one CO2 leaking back into the mesophyll, smiling. Pill: CO2 concentrated, a little leaks', `
    ${heads(p)}<g class="dk1 co2k">
    <path d="M400,16V566" style="stroke:#d8d5cb;stroke-width:1.4"/>
    ${T(200, 32, 'C₃ leaf: the CO₂ leaks away', 'fcc-b')}${T(600, 32, 'C₄ leaf: the CO₂ is concentrated', 'fcc-b')}
    ${a.svg}${ringOn(`${p}-a`, a.at(481, 352), 301 * sa, 348 * sa)}
    ${onPhoto(a.at(478, 425), 'vein')}${onPhoto(a.at(295, 525), 'bundle sheath')}${onPhoto(a.at(745, 70), 'mesophyll')}
    ${b.svg}${ringOn(`${p}-b`, b.at(476, 385), 285 * sb, 215 * sb)}
    ${onPhoto(b.at(478, 425), 'vein')}${onPhoto(b.at(476, 645), 'bundle sheath')}${onPhoto(b.at(820, 110), 'mesophyll')}
    ${ma.lens}${ma.mag}${mb.lens}${mb.mag}
    ${resultR(200, CY + R - 20, 'about 1 in 4 recaptured')}${resultR(600, CY + R - 20, 'CO₂ concentrated, a little leaks')}
    ${credit(790, 583, `${it('Steinchisma laxum')} (C₃): Khoshravesh et al. 2016, J Exp Bot 67:3065, Fig. 1 (CC BY 3.0) · RuBisCO: PDB 8RUC`)}
    ${credit(790, 598, 'maize (C₄): Berkshire Community College Bioscience Image Library, Wikimedia Commons (CC0)')}</g>
  `);
}

/* ---------- r3 · the two cells drawn, the C₄ cycle across them ---------- */

type Segs = Parameters<typeof bilayer>[0];
/** A cell's plasma membrane on 3 sides, open on the wall side (the wall's own bilayer closes it), corners rounded r. */
function pmU(x0: number, x1: number, y0: number, y1: number, r: number, open: 'l' | 'r'): string {
  const s: Segs = open === 'r'
    ? [{ L: [x1, y0, x0 + r, y0] }, { A: [x0 + r, y0 + r, r, r, 270, 180] }, { L: [x0, y0 + r, x0, y1 - r] }, { A: [x0 + r, y1 - r, r, r, 180, 90] }, { L: [x0 + r, y1, x1, y1] }]
    : [{ L: [x0, y0, x1 - r, y0] }, { A: [x1 - r, y0 + r, r, r, -90, 0] }, { L: [x1, y0 + r, x1, y1 - r] }, { A: [x1 - r, y1 - r, r, r, 0, 90] }, { L: [x1 - r, y1, x0, y1] }];
  return bilayer(s, 6, 1.6, 4.2);
}

function r3(): string {
  const p = 'fcc12r3', y0 = 66, y1 = 546, P1 = 236, P2 = 444;
  const B: Pt = [604, 310], ring = (i: number): Pt => [B[0] + 104 * Math.cos((i * Math.PI) / 4), B[1] + 72 * Math.sin((i * Math.PI) / 4)];
  // one mood for the crowd waiting round RuBisCO: all calm, neutral, no sweat (lecturer, 30 Oct 2026: moods must mean one thing)
  const looks: Look[] = Array.from({ length: 8 }, (): Look => ({}));
  return svg('Two cells drawn side by side, their plasma membranes as lipid bilayers, a cell wall between them crossed by two plasmodesmata. Left, the mesophyll cell, tinted pale green: a CO2 character becomes bicarbonate, HCO3-; PEP carboxylase (PEPC, its real structure) fixes it onto PEP, three carbon balls, making a C4 acid, malate, four carbon balls, which a teal arrow carries through the upper plasmodesma. Right, the bundle-sheath cell, tinted pale teal: the acid enters a large chloroplast and releases its CO2; eight calm CO2 characters, all with the same neutral face, crowd round RuBisCO, under the words CO2 concentrated, about 10 times the air. Pyruvate, three carbon balls, returns through the lower plasmodesma into the mesophyll chloroplast, where PEP is made again for 2 ATP', `
    ${heads(p)}<g class="dk1 co2k">
    ${T(200, 44, 'mesophyll cell', 'co2k-zl')}${T(600, 44, 'bundle-sheath cell', 'co2k-zl')}
    <path d="M378,${y0}H54a30,30 0 0 0 -30,30V${y1 - 30}a30,30 0 0 0 30,30H378z" style="fill:${TINT_M}"/>
    <path d="M422,${y0}H746a30,30 0 0 1 30,30V${y1 - 30}a30,30 0 0 1 -30,30H422z" style="fill:${TINT_B}"/>
    ${pmU(24, 378, y0, y1, 30, 'r')}${pmU(422, 776, y0, y1, 30, 'l')}
    <clipPath id="${p}-w"><rect x="360" y="${y0}" width="80" height="${y1 - y0}"/></clipPath>
    <g clip-path="url(#${p}-w)">${wallV(384, 416, y0, 340, [378, 422], { y: P1, h: 15 })}${wallV(384, 416, 340, y1, [378, 422], { y: P2, h: 15 })}</g>
    ${kidAt(`${p}k0`, [96, 120], 12, { lab: 'CO₂' })}
    ${route(p, 'c', 'M140,120 H166', 'fcc-thin')}
    <g transform="translate(200 122)">${hco3G(12)}</g>
    ${route(p, 'k', 'M200,154 V190', 'fcc-thin')}
    ${imgC(pepcPng, [200, P1], 96, AR.pepc)}
    <g transform="translate(90 ${P1})">${carbG('CCC', 9)}</g>${route(p, 'k', `M124,${P1} H146`, 'fcc-thin')}
    ${route(p, 'm', `M252,${P1} H352`)}
    <g transform="translate(400 ${P1})">${carbG('CCCC', 9)}</g>
    ${chloroplast(B, 140, 150, '', B, 72)}
    ${route(p, 'm', `M446,${P1} C462,${P1} 476,244 486,258`)}
    ${Array.from({ length: 8 }, (_, i) => kidAt(`${p}kb${i}`, ring(i), 11, looks[i])).join('')}
    ${route(p, 'm', `M516,430 C490,${P2} 470,${P2} 448,${P2}`)}
    <g transform="translate(400 ${P2})">${carbG('CCC', 9)}</g>
    ${route(p, 'm', `M354,${P2} H306`)}
    ${chloroplast([196, 446], 100, 48, granum(132, 428, 26, 3) + granum(260, 428, 26, 3))}
    ${atpTag(196, 446, '2 ATP')}
    ${route(p, 'm', 'M124,408 C102,376 90,320 90,262')}
    ${ML(200, 88, 'HCO₃⁻')}${ML(90, 210, 'PEP')}${ML(200, 302, 'PEPC')}
    ${ML(400, P1 - 28, 'C₄ acid (malate)')}${ML(400, P2 + 40, 'pyruvate')}
    ${ML(B[0], B[1] + 52, 'RuBisCO')}
    ${T(B[0], 112, 'CO₂ concentrated', 'fcc-b')}${T(B[0], 138, '≈ 10 × the air', 'fcc-s')}
    ${credit(790, 572, 'drawn after Sage, Sage & Kocacinar 2012, Annu Rev Plant Biol 63:19, Fig. 1 · ' + CR_VCF)}
    ${credit(790, 588, CR_PDB)}</g>
  `);
}
