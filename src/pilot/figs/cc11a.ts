// Slide C11a · C₂ photosynthesis (chunk cc, 28 Oct 2026): between C11 (refixation in C₃ leaves) and C12 (C₄).
// Facts and read depth: Rawsthorne et al. 1988 Planta 173:298 (abstract: glycine decarboxylase only in bundle-sheath
// mitochondria of C₃–C₄ Moricandia arvensis, in all photosynthetic cells of C₃ M. moricandioides). Keerberg et al. 2014
// JXB 65:3649 (FT, CC BY 3.0): CO₂ at RuBisCO 3.2 × in C₂ Flaveria pubescens vs 1.0 in C₃ F. cronquistii. Ku et al. 1991
// Plant Physiol 96:518 (abstract: Γ of 10 C₃–C₄ Flaveria 9–29 µbar, C₄-like 3–6, 30 °C) and their values per species as
// shown in Mallmann et al. 2014 eLife 3:e02478 Fig. 1D (FT, CC BY): pringlei and robusta 62, chloraefolia 29, pubescens
// 21, anomala 15, ramosissima 9, brownii 6, trinervia 3.5, bidentis 3. Sage, Khoshravesh & Sage 2014 JXB 65:3341 (FT
// read in parts): proto-Kranz, C₂ type I and II, C₄-like; "over 50 C₂ species from 20 or so evolutionary lineages"; Γ of
// C₂ Flaveria and Heliotropium about half the C₃ value. Sage 2016 JXB 67:4039 (abstract): 61 C₄ lineages, ≈ 8100 species.
// Heckmann et al. 2013 Cell 153:1579 (abstract only: full text blocked, HTTP 403): C₄ is reachable through individually
// adaptive steps on a smooth "Mount Fuji" landscape; Edwards 2014 eLife insight (FT, CC BY). Sage, Sage & Kocacinar 2012
// Annu Rev Plant Biol 63:19 (abstract; board images of Figs 5, 6). Khoshravesh et al. 2016 (FT, CC BY 3.0): Steinchisma
// hians (= Panicum milioides) is C₂, C* 11.8 µmol mol⁻¹.
import type { PlateText, Variant } from '../types';
import { T, chloro, co2, credit, enzyme, f, heads, it, mito, pill, route, shot, svg, type Img } from './cc-kit';
import { schemaSvg } from './cc-schema';
import { atomBall, row } from './carbon-form';
import { o2 } from '../illus';
import rubiscoPng from '../../assets/rf/rubisco-8ruc.png';
import shuttlePng from '../../assets/photos/cc-sage12-c2shuttle.jpg';
import phasesPng from '../../assets/photos/cc-sage12-phases.jpg';
import schemesJpg from '../../assets/photos/cc-sage14-schemes.jpg';
import gdcA from '../../assets/photos/cc-sage14-gdc-a.jpg';
import gdcB from '../../assets/photos/cc-sage14-gdc-b.jpg';
import gdcC from '../../assets/photos/cc-sage14-gdc-c.jpg';
import './cc11a.css';

export const PLATE: PlateText = {
  n: 'C11a',
  title: 'C₂ photosynthesis',
  status: 'draft',
  lead: 'C₂ plants release photorespired CO₂ in the bundle sheath, next to RuBisCO,<br>so more of it is refixed.',
  points: [
    { claim: 'Glycine shuttle.', text: 'Glycine moves to the bundle sheath, where almost all glycine decarboxylase sits', eq: '2 glycine → serine + CO₂ + NH₃: 2 × 2 C = 3 C + 1 C' },
    { claim: 'Refixation in the bundle sheath.', text: 'Bundle-sheath RuBisCO refixes the released CO₂', eq: 'CO₂ at RuBisCO, leaf mean: C₂ ≈ 3 × C₃ (<i>Flaveria</i>)' },
    { claim: 'A step towards C₄.', text: '<i>Flaveria</i> and <i>Heliotropium</i> have C₃, C₂ and C₄ species; C₂ species grow in warm climates', eq: '> 50 C₂ species in ≈ 20 lineages · C₄: 61 lineages' },
  ],
  refs: [
    { label: 'Rawsthorne et al. 1988', url: 'https://doi.org/10.1007/BF00401016' },
    { label: 'Keerberg et al. 2014', url: 'https://doi.org/10.1093/jxb/eru239' },
    { label: 'Sage, Khoshravesh & Sage 2014', url: 'https://doi.org/10.1093/jxb/eru180' },
    { label: 'Lundgren & Christin 2017', url: 'https://doi.org/10.1093/jxb/erw451' },
    { label: 'Sage 2016', url: 'https://doi.org/10.1093/jxb/erw156' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'v1', name: 'C₃ · C₂ · C₄: where glycine decarboxylase and RuBisCO sit (drawn)', anim: true },
  { id: 'v2', name: 'The glycine shuttle in carbon form: 2 glycine → serine + CO₂ (drawn)', anim: true },
  { id: 'v3', name: 'Sage 2012 Fig. 5: the C₂ glycine shuttle (published scheme)' },
  { id: 'v4', name: 'CO₂ compensation point of 9 Flaveria species, C₃ → C₂ → C₄ (Ku 1991 data)' },
  { id: 'v5', name: 'Sage 2014 Fig. 2: five leaf schemes from C₃ to C₄ (published)' },
  { id: 'v6', name: 'Heliotropium: glycine decarboxylase moves to the bundle sheath (immunostaining)' },
  { id: 'v7', name: 'Sage 2012 Fig. 6: the five-phase model of C₄ evolution' },
  { id: 'v8', name: 'Mount Fuji: every step uphill (drawn after Heckmann 2013)', anim: true },
  { id: 'v9', name: 'Four ways around RuBisCO: C₂ lit', anim: true },
];

export function draw(id: string): string {
  const fns: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7, v8, v9 };
  return (fns[id] ?? v1)();
}

/* ---------- images and glyphs ---------- */

const SHUTTLE: Img = { href: shuttlePng, w: 1113, h: 820 };
const PHASES: Img = { href: phasesPng, w: 1499, h: 1000 };
const SCHEMES: Img = { href: schemesJpg, w: 1177, h: 760 };
const GDC: Record<'a' | 'b' | 'c', Img> = {
  a: { href: gdcA, w: 551, h: 389 }, b: { href: gdcB, w: 551, h: 390 }, c: { href: gdcC, w: 551, h: 390 },
};
const CR = {
  sage12: 'Sage, Sage & Kocacinar 2012, Annu Rev Plant Biol 63:19',
  sage14: 'Sage, Khoshravesh & Sage 2014, J Exp Bot 65:3341',
};

/** RuBisCO: the deck's render of spinach L₈S₈ (PDB 8RUC, 548 × 471 px), w wide, centred at (x, y). */
const rub = (x: number, y: number, w: number): string => {
  const h = (w * 471) / 548;
  return `<image href="${rubiscoPng}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}"/>`;
};

/** NH₃: a nitrogen ball (carbon-form blue) with three small H balls. */
const nh3 = (x: number, y: number, r = 9): string => {
  const h = r * 0.56, d = r + h * 0.55;
  const hs = ([[-0.85, 0.7], [0.85, 0.7], [0, -1.05]] as const)
    .map(([a, b]) => `<circle class="atom atom-H" cx="${f(x + a * d)}" cy="${f(y + b * d)}" r="${f(h)}"/>`).join('');
  return hs + atomBall(x, y, 'N', r);
};

/** A chloroplast holding a RuBisCO render (where RuBisCO works in this drawing). */
const cpRub = (x: number, y: number, rx: number, ry: number, w: number): string =>
  `<ellipse class="fcca-cpbig" cx="${f(x)}" cy="${f(y)}" rx="${rx}" ry="${ry}"/>${rub(x, y, w)}`;

/* ---------- v1 · three columns: C₃ · C₂ · C₄ ---------- */

type K3 = 'c3' | 'c2' | 'c4';
const COL: Record<K3, { head: string; plant: string; cap: [string, string] }> = {
  c3: { head: 'C₃', plant: 'rice, wheat', cap: ['CO₂ released', 'in every cell'] },
  c2: { head: 'C₂', plant: it('Flaveria ramosissima'), cap: ['CO₂ released', 'in the bundle sheath'] },
  c4: { head: 'C₄', plant: 'maize', cap: ['CO₂ pumped', 'into the bundle sheath'] },
};

/** One column, mesophyll above bundle sheath above vein (as in Sage 2014 Fig. 2), 240 wide from x0. */
function column(p: string, k: K3, x0: number): string {
  const a = x0 + 8, b = x0 + 232, cx = x0 + 120;
  const mY0 = 104, mY1 = 290, bY0 = 300, bY1 = 420, vY0 = 430, vY1 = 468;
  const C = COL[k], s: string[] = [];
  s.push(T(cx, 50, C.head, 'fcc-big'), T(cx, 82, C.plant, 'fcc-it'));
  s.push(`<rect class="fcc-wall" x="${a}" y="${mY0}" width="${b - a}" height="${mY1 - mY0}" rx="22"/>`);
  s.push(`<rect class="fcc-bs" x="${a}" y="${bY0}" width="${b - a}" height="${bY1 - bY0}" rx="20"/>`);
  s.push(`<rect class="fcc-vein" x="${a}" y="${vY0}" width="${b - a}" height="${vY1 - vY0}" rx="19"/>`);
  for (const dx of [-80, 80]) s.push(`<circle class="fcc-xy" cx="${cx + dx}" cy="${(vY0 + vY1) / 2}" r="10"/>`);
  // mesophyll: chloroplasts on the walls, four mitochondria (with glycine decarboxylase only in C₃)
  for (const x of [a + 50, cx, b - 50]) s.push(chloro(x, mY0 + 15, 24, 9));
  for (const y of [158, 206, 254]) s.push(chloro(a + 14, y, 20, 8.5, 90), chloro(b - 14, y, 20, 8.5, 90));
  const mOn = k === 'c3';
  s.push(mito(a + 48, 142, 13, 8, 0, mOn), mito(b - 48, 142, 13, 8, 0, mOn), mito(a + 44, 232, 13, 8, 0, mOn), mito(b - 44, 232, 13, 8, 0, mOn));
  if (k === 'c4') s.push(enzyme(cx, 192, 'PEPC', 'm', 18));
  else s.push(cpRub(cx, 192, 46, 31, 54));
  // bundle sheath
  if (k === 'c3') {
    s.push(chloro(a + 36, bY0 + 18, 22, 8.5), chloro(b - 36, bY0 + 18, 22, 8.5));
    s.push(mito(a + 36, bY0 + 46, 13, 8, 0, true), mito(b - 36, bY0 + 46, 13, 8, 0, true));
    s.push(cpRub(cx, bY0 + 40, 32, 22, 38));
  }
  if (k === 'c2') {
    const n = 7;
    for (let i = 0; i < n; i++) s.push(mito(a + 24 + (i * (b - a - 48)) / (n - 1), bY1 - 12, 12, 7, 0, true));
    for (const x of [a + 30, a + 64, b - 64, b - 30]) s.push(chloro(x, bY1 - 36, 15, 8));
    s.push(cpRub(cx, bY1 - 46, 30, 22, 38));
    s.push(co2(cx + 58, bY0 + 26, 7));
  }
  if (k === 'c4') {
    for (const x of [a + 30, a + 74, b - 74, b - 30]) s.push(chloro(x, bY1 - 18, 20, 10));
    s.push(chloro(a + 22, bY0 + 52, 18, 9, 90), chloro(b - 22, bY0 + 52, 18, 9, 90));
    s.push(mito(a + 30, bY0 + 17, 11, 7, 0, true), mito(b - 30, bY0 + 17, 11, 7, 0, true));
    s.push(cpRub(cx, bY1 - 54, 34, 24, 42));
    s.push(co2(cx - 56, bY0 + 70, 7), co2(cx + 56, bY0 + 70, 7), co2(cx, bY0 + 27, 7));
  }
  // routes: glycine (C₂) or C₄ acid (C₄) from mesophyll into the bundle sheath
  if (k === 'c2') {
    s.push(route(p, 'g', `M${cx},${226} V${bY0 + 6}`));
    s.push(T(cx - 10, 272, 'glycine', 'fcc-s fcc-gly', 'end'));
  }
  if (k === 'c4') {
    s.push(route(p, 'm', `M${cx},${210} V${bY0 - 2}`));
    s.push(T(cx - 10, 272, 'C₄ acid', 'fcc-s fcc-c4', 'end'));
  }
  if (k === 'c3') {
    s.push(T(cx, 278, 'mesophyll', 'fcc-s'), T(cx, bY1 - 10, 'bundle sheath', 'fcc-s'), T(cx, vY1 - 12, 'vein', 'fcc-s'));
  }
  s.push(T(cx, 504, C.cap[0], 'fcc-l'), T(cx, 530, C.cap[1], 'fcc-l'));
  return s.join('');
}

function v1(): string {
  const p = 'fc11aa';
  return svg('Three leaf sections side by side, mesophyll above bundle sheath above the vein. C3, rice and wheat: mitochondria with glycine decarboxylase and RuBisCO in every cell, so photorespired CO2 is released in every cell. C2, Flaveria ramosissima: glycine moves from the mesophyll into the bundle sheath, whose mitochondria along the vein side alone carry glycine decarboxylase, so CO2 is released in the bundle sheath next to RuBisCO. C4, maize: PEP carboxylase in the mesophyll makes a C4 acid that carries CO2 into the bundle sheath, the only place with RuBisCO', `
    ${heads(p)}
    ${column(p, 'c3', 20)}${column(p, 'c2', 280)}${column(p, 'c4', 540)}
    ${mito(44, 566, 13, 8, 0, true)}${T(66, 573, 'glycine decarboxylase', 'fcc-l', 'start')}
    ${rub(344, 566, 36)}${T(368, 573, 'RuBisCO', 'fcc-l', 'start')}
    ${credit(790, 596, `drawn after ${CR.sage14}, Fig. 2; RuBisCO: PDB 8RUC`)}
  `);
}

/* ---------- v2 · the glycine shuttle in carbon form ---------- */

function v2(): string {
  const p = 'fc11ab';
  const mx = 676, my = 300;
  return svg('Two cells drawn. In the mesophyll cell, RuBisCO in a chloroplast reacts with O2; photorespiration turns the product into glycine, two carbons and a nitrogen, drawn as balls. Two glycines move into the bundle-sheath cell, to a mitochondrion at the vein side that carries glycine decarboxylase. It turns them into serine, three carbons and a nitrogen, plus one CO2 and one NH3. The CO2 enters the chloroplast next to it, where RuBisCO refixes it; serine returns to the mesophyll', `
    ${heads(p)}
    ${T(190, 54, 'mesophyll', 'fcc-b')}${T(546, 54, 'bundle sheath', 'fcc-b')}${T(752, 54, 'vein', 'fcc-l')}
    <rect class="fcc-wall" x="24" y="76" width="332" height="460" rx="30"/>
    <rect class="fcc-bs" x="386" y="76" width="320" height="460" rx="30"/>
    <rect class="fcc-vein" x="722" y="76" width="60" height="460" rx="30"/>
    ${[200, 306, 412].map(y => `<circle class="fcc-xy" cx="752" cy="${y}" r="14"/>`).join('')}
    ${cpRub(200, 330, 110, 78, 104)}${T(200, 446, 'RuBisCO', 'fcc-l')}
    ${o2(70, 200, 11)}${T(70, 176, 'O₂', 'fcc-b')}
    ${route(p, 'c', 'M78,216 Q92,252 120,272', 'fcc-thin')}
    ${route(p, 'k', 'M262,262 V222', 'fcc-thin')}
    ${row(262, 204, 'CCN', { r: 10 })}${row(262, 176, 'CCN', { r: 10 })}
    ${T(262, 146, '2 glycine', 'fcc-b fcc-gly')}
    ${route(p, 'g', `M302,190 H${mx - 16} Q${mx},190 ${mx},206 V${my - 52}`)}
    ${cpRub(540, 320, 58, 122, 84)}
    ${mito(mx, my, 46, 26, 90, true)}
    ${pill(560, 112, 'glycine decarboxylase', [mx - 4, my - 44], { k: 9.6 })}
    ${co2(622, 268, 8)}${T(622, 246, 'CO₂', 'fcc-b')}
    ${route(p, 'c', `M${mx - 28},${my} H604`, 'fcc-thin')}
    ${nh3(622, 352, 9)}${T(622, 392, 'NH₃', 'fcc-l')}
    ${route(p, 'g', `M${mx},${my + 48} V470 Q${mx},486 ${mx - 16},486 H304`, 'fcc-thin')}
    ${row(480, 462, 'CCCN', { r: 10 })}${T(480, 518, 'serine', 'fcc-b fcc-gly')}
    ${credit(790, 592, `drawn after ${CR.sage12}, Fig. 5; RuBisCO: PDB 8RUC`)}
  `);
}

/* ---------- v3 · Sage 2012 Fig. 5 ---------- */

function v3(): string {
  const a = shot('fc11ac-im', SHUTTLE, 40, 20, 720, { fig: true });
  return svg('Sage, Sage and Kocacinar 2012, figure 5: C2 photosynthesis. In the mesophyll cell, RuBisCO takes up O2 and the product becomes glycine. Glycine moves into the bundle-sheath cell, where glycine decarboxylase in mitochondria behind the chloroplasts releases CO2 into the chloroplasts next to them, where RuBisCO refixes it; serine returns to the mesophyll', `
    ${a.svg}
    ${T(400, 574, 'GDC glycine decarboxylase · PG 2-phosphoglycolate · GLA glycerate', 'fcc-s')}
    ${credit(790, 596, `${CR.sage12}, Fig. 5; © Annual Reviews`)}
  `);
}

/* ---------- v4 · Γ of nine Flaveria species (Ku et al. 1991, as in Mallmann et al. 2014 Fig. 1D) ---------- */

function v4(): string {
  type G = 'c3' | 'c2' | 'c4l' | 'c4';
  const rows: Array<[string, G, number]> = [
    ['pringlei', 'c3', 62], ['robusta', 'c3', 62], ['chloraefolia', 'c2', 29], ['pubescens', 'c2', 21], ['anomala', 'c2', 15],
    ['ramosissima', 'c2', 9], ['brownii', 'c4l', 6], ['trinervia', 'c4', 3.5], ['bidentis', 'c4', 3],
  ];
  const X = (v: number): number => 326 + v * 6.6, Y = (i: number): number => 96 + i * 46;
  const groups: Array<[G, string, string, number, number]> = [
    ['c3', 'C₃', 'fcca-c3t', 0, 1], ['c2', 'C₂', 'fcc-gly', 2, 5], ['c4l', 'C₄-like', 'fcc-c4', 6, 6], ['c4', 'C₄', 'fcc-c4', 7, 8],
  ];
  const ax: string[] = [];
  for (let v = 0; v <= 60; v += 20) ax.push(`<path class="fcc-tk" d="M${f(X(v))},488 v8"/>${T(X(v), 520, `${v}`, 'fcc-ax')}`);
  return svg('Bar chart redrawn from Mallmann et al. 2014, figure 1D, with the values of Ku et al. 1991: CO2 compensation point at 30 degrees in nine Flaveria species. C3 F. pringlei and F. robusta 62 microbar; C2 F. chloraefolia 29, F. pubescens 21, F. anomala 15, F. ramosissima 9; C4-like F. brownii 6; C4 F. trinervia 3.5 and F. bidentis 3', `
    ${groups.map(([, s, cls, i0, i1]) => {
      const y0 = Y(i0) - 16, y1 = Y(i1) + 16, ym = (Y(i0) + Y(i1)) / 2;
      return `<path class="fcca-brk" d="M132,${f(y0)} h-8 V${f(y1)} h8"/>${T(108, ym + 8, s, `fcc-b ${cls}`, 'end')}`;
    }).join('')}
    ${rows.map(([n, g, v], i) => `${T(310, Y(i) + 7, it(`F. ${n}`), 'fcc-l', 'end')}
      <rect class="fcca-bar-${g}" x="${X(0)}" y="${f(Y(i) - 14)}" width="${f(X(v) - X(0))}" height="28" rx="4"/>
      ${T(X(v) + 10, Y(i) + 7, `${v}`, 'fcc-l', 'start')}`).join('')}
    <path class="fcc-axl" d="M${X(0)},${Y(0) - 30} V488 H${f(X(66))}"/>${ax.join('')}
    ${T(X(33), 556, 'CO₂ compensation point (µbar), 30 °C', 'fcc-at')}
    ${credit(790, 594, 'redrawn from Mallmann et al. 2014, eLife 3:e02478, Fig. 1D (CC BY); values: Ku et al. 1991, Plant Physiol 96:518')}
  `);
}

/* ---------- v5 · Sage 2014 Fig. 2, the five cell schemes ---------- */

function v5(): string {
  const a = shot('fc11ae-im', SCHEMES, 12, 70, 776, { fig: true });
  const k = 776 / 1177, cx = (u: number): number => 12 + u * k;
  const heads5: Array<[string, number]> = [['C₃', 119], ['proto-Kranz', 357], ['C₂', 592], ['C₄-like', 828], ['C₄', 1062]];
  const hl0 = cx(474), hl1 = cx(710);
  return svg('Sage, Khoshravesh and Sage 2014, figure 2, the cell schemes: five stages from C3 through proto-Kranz, C2 and C4-like to C4. In C3, glycine decarboxylase sits in the mitochondria of both cell types; in proto-Kranz the bundle-sheath mitochondria gather at the vein side; in C2 glycine (2C) moves from the mesophyll into the bundle sheath and is decarboxylated there; in C4-like and C4 a C4 acid (4C) made by PEP carboxylase carries CO2 into the bundle sheath', `
    ${a.svg}
    <rect class="fcca-hl" x="${f(hl0)}" y="62" width="${f(hl1 - hl0)}" height="${f(a.h - 2 + 10)}" rx="14"/>
    ${heads5.map(([s, u]) => T(cx(u), 50, s, 'fcc-b')).join('')}
    ${credit(790, 594, `${CR.sage14}, Fig. 2 (cell schemes); © Oxford University Press`)}
  `);
}

/* ---------- v6 · Heliotropium, glycine decarboxylase immunostaining (Sage 2014 Fig. 3 A–C) ---------- */

function v6(): string {
  const p = 'fc11af', w = 236, y = 136;
  const cols: Array<['a' | 'b' | 'c', string, string, [number, number, number, number], [string, string]]> = [
    ['a', 'C₃', 'H. tenellum', [80, 55, 300, 300], ['in all cells', '']],
    ['b', 'proto-Kranz', 'H. procumbens', [250, 45, 300, 300], ['more in the', 'bundle sheath']],
    ['c', 'C₂', 'H. convolvulaceum', [85, 65, 300, 300], ['mostly in the', 'bundle sheath']],
  ];
  const body = cols.map(([k, s, sp, win, cap], i) => {
    const x = 22 + i * (w + 24), cx = x + w / 2;
    const a = shot(`${p}-${k}`, GDC[k], x, y, w, { win, r: 10 });
    return `${T(cx, 78, s, 'fcc-b')}${T(cx, 108, it(sp), 'fcc-it')}${a.svg}
      ${T(cx, y + w + 40, cap[0], 'fcc-l')}${cap[1] ? T(cx, y + w + 66, cap[1], 'fcc-l') : ''}`;
  }).join('');
  const arrows = [0, 1].map(i => {
    const x = 22 + (i + 1) * (w + 24) - 21;
    return route(p, 'k', `M${x},${y + w / 2} h14`, 'fcc-thin');
  }).join('');
  return svg('Leaf sections of three Heliotropium species stained for glycine decarboxylase (brown), from Sage, Khoshravesh and Sage 2014: in C3 H. tenellum it is spread through the leaf; in proto-Kranz H. procumbens it gathers in the bundle sheath around the vein; in C2 H. convolvulaceum it lies mostly in the bundle-sheath cells around the vein (V)', `
    ${heads(p)}${body}${arrows}
    <rect class="fcca-sw" x="196" y="520" width="24" height="24" rx="5"/>${T(232, 539, 'glycine decarboxylase (stained) · V vein', 'fcc-l', 'start')}
    ${credit(790, 594, `${CR.sage14}, Fig. 3 A–C (${it('Heliotropium')}); © Oxford University Press`)}
  `);
}

/* ---------- v7 · Sage 2012 Fig. 6, the five-phase model ---------- */

function v7(): string {
  const a = shot('fc11ag-im', PHASES, 24, 26, 752, { fig: true });
  return svg('Sage, Sage and Kocacinar 2012, figure 6: a stepped pyramid of C4 evolution. From the base: preconditioning (close veins, gene duplication); enlargement of the bundle sheath; mitochondria at the inner bundle-sheath wall, the proto-Kranz condition; the photorespiratory CO2 pump, glycine decarboxylase moved to the bundle sheath; more PEP carboxylase; a C4 cycle; optimisation; at the top, efficient C4 photosynthesis. Flaveria and Heliotropium species are named at each step', `
    ${a.svg}
    ${T(400, 566, `${it('F.')} ${it('Flaveria')} · ${it('H.')} ${it('Heliotropium')} · M mesophyll · BS bundle sheath`, 'fcc-s')}
    ${credit(790, 594, `${CR.sage12}, Fig. 6; © Annual Reviews`)}
  `);
}

/* ---------- v8 · Mount Fuji: every step uphill (drawn after Heckmann et al. 2013) ---------- */

function v8(): string {
  const X0 = 100, X1 = 640, base = 548, top = 150;
  const ridge = (x: number): number => base - (base - top) * Math.pow(Math.max(0, (x - X0) / (X1 - X0)), 2.1);
  const pts: string[] = [];
  for (let x = 40; x <= X1; x += 10) pts.push(`${f(x)},${f(ridge(x))}`);
  const mtn = `M40,${base} L${pts.join(' L')} C${X1 + 50},${top + 8} ${X1 + 110},${base - 150} 790,${base - 8} L790,${base} Z`;
  // stage, name, what changes; labels above-left of the dot (the summit's above it)
  const stage: Array<[number, string, string]> = [
    [150, 'C₃', ''], [300, 'proto-Kranz', 'mitochondria to the vein side'], [430, 'C₂', 'glycine shuttle'],
    [545, 'C₄-like', 'C₄ cycle added'], [X1, 'C₄', 'RuBisCO only in the bundle sheath'],
  ];
  const at = (x: number): number => ridge(x) - 12;
  const path = stage.map(([x]) => `${f(x)},${f(at(x))}`).join(' L');
  return svg('A drawn landscape after Heckmann et al. 2013: one smooth mountain whose height is modelled CO2 uptake, with C3 at its foot and C4 at its summit. A dashed path climbs through proto-Kranz (mitochondria to the vein side), C2 (glycine shuttle) and C4-like (C4 cycle added) to C4 (RuBisCO only in the bundle sheath); every step goes uphill and no valley has to be crossed', `
    <path class="fcca-mtn" d="${mtn}"/>
    <path class="fcca-path" d="M${path}"/>
    ${stage.map(([x, s, sub]) => {
      const y = at(x);
      if (x === X1) return `<circle class="fcca-peak" cx="${f(x)}" cy="${f(y)}" r="13"/>${T(x, y - 50, s, 'fcc-b')}${T(x, y - 24, sub, 'fcc-s')}`;
      const dot = `<circle class="fcca-stage" cx="${f(x)}" cy="${f(y)}" r="10"/>`;
      if (!sub) return `${dot}${T(x, y - 22, s, 'fcc-b')}`;
      return `${dot}${T(x - 18, y - 30, s, 'fcc-b', 'end')}${T(x - 18, y - 6, sub, 'fcc-s', 'end')}`;
    }).join('')}
    ${T(48, 150, '“Mount Fuji” landscape', 'fcc-b', 'start')}
    ${T(48, 178, 'height: modelled CO₂ uptake', 'fcc-s', 'start')}
    ${T(48, 202, 'one peak, no valley', 'fcc-s', 'start')}
    ${pill(560, 496, 'every step goes uphill', undefined, { tint: true })}
    ${credit(790, 594, `drawn after Heckmann et al. 2013, Cell 153:1579 (abstract); steps after ${CR.sage14}, Fig. 2`)}
  `);
}

/* ---------- v9 · the chunk schema with C₂ lit ---------- */

const v9 = (): string => schemaSvg('fc11ai', ['c2'],
  'Four panels: where CO2 meets RuBisCO in C3, C2, C4 and CAM plants. Lit: C2, CO2 released in the bundle sheath (Flaveria, Moricandia). Dimmed: C3, C4 and CAM');
