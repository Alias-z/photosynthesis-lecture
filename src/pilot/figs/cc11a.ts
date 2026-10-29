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
import { T, TV, chloro, co2, credit, enzyme, f, heads, it, mito, pill, route, shot, svg, type A, type Img, type Pt, type Shot } from './cc-kit';
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
import steJpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import homJpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import temJpg from '../../assets/photos/c11a-homolepis-tem.jpg';
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import gdcPng from '../../assets/cell/gdcp.png';
import goxPng from '../../assets/cell/gox.png';
import { bilayer } from './cell-schema';
import { bilayerE, carbG, kidG, tangents } from '../anim/co2-kit';
import './cc11a.css';

// Text at bachelor level (overnight, 29 Oct 2026): one essence, "in C₃ leaves the photorespired CO₂ leaks away; C₂ plants
// move glycine into the bundle sheath, so its CO₂ is trapped next to RuBisCO", and the bundle sheath introduced.
// - "much of it leaks away": Busch et al. 2013 (C₃ rice and wheat refix ≈ 26–29 % inside the cell and ≈ 20–23 % via the
//   air spaces, so about half leaves the leaf).
// - Khoshravesh et al. 2016 (FT, CC BY 3.0), C₂ Homolepis aturensis: the P-protein of glycine decarboxylase "is almost
//   exclusively located in BS cells"; bundle-sheath mitochondria "localize almost exclusively to the centripetal BS
//   pole", where more chloroplasts cluster, "for refixing photorespired CO₂ from adjacent mitochondria". Rawsthorne et
//   al. 1988: glycine decarboxylase only in bundle-sheath mitochondria of C₃–C₄ Moricandia arvensis.
export const PLATE: PlateText = {
  n: 'C11a',
  // lecturer, 30 Oct 2026, late: "C₂ photosynthesis is also called C₃–C₄ intermediacy: so we know it is an evolutionary step"
  title: 'C₂ photosynthesis: C₃–C₄ intermediates',
  status: 'draft',
  // lecturer, 30 Oct 2026: no enzyme name; C₃ recaptures about a quarter (Busch et al. 2013: ≈ 24–38 %), C₂ most of it
  // lecturer, later 30 Oct: "concise but accurate: in C₃ photorespiration's CO₂ escapes; in C₂ it is released in the bundle
  // sheath, where mitochondria and chloroplasts sit close together, and most of it is recaptured"
  // lecturer, later 30 Oct: "concise but accurate: in C₃ photorespiration's CO₂ escapes; in C₂ it is released in the bundle
  // sheath, where mitochondria and chloroplasts sit close together, and most of it is recaptured"
  lead: 'In C₃ leaves, much of the CO₂ released by photorespiration escapes.<br>In C₂ leaves, mitochondria release it in the bundle sheath, right beside the chloroplasts, so most of it is recaptured.',
  points: [
    { claim: 'Only bundle-sheath mitochondria release it.', text: 'So glycine moves there from the mesophyll through plasmodesmata' },
    { claim: 'Packed on the vein side.', text: 'The mitochondria sit against the vein-side wall, behind a layer of chloroplasts, so the CO₂ meets RuBisCO before it can leave' },
    // a number, not "most" (lecturer, later 30 Oct); Keerberg et al. 2014: ≈ 3-fold CO₂ in the chloroplasts of C₂ Flaveria pubescens vs its C₃ relative
    { claim: 'Recaptured, not lost.', text: 'C₃ leaves recapture about a quarter of it; in C₂ leaves CO₂ in the chloroplasts rises about 3-fold' },
  ],
  refs: [
    { label: 'Khoshravesh et al. 2016', url: 'https://doi.org/10.1093/jxb/erw150' },
    { label: 'Rawsthorne et al. 1988', url: 'https://doi.org/10.1007/BF00401016' },
    { label: 'Busch et al. 2013', url: 'https://doi.org/10.1111/j.1365-3040.2012.02567.x' },
    { label: 'Keerberg et al. 2014', url: 'https://doi.org/10.1093/jxb/eru239' },
    { label: 'Sage, Sage & Kocacinar 2012', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' },
    { label: 'Sage, Khoshravesh & Sage 2014', url: 'https://doi.org/10.1093/jxb/eru180' },
  ],
};

export const VARIANTS: Variant[] = [
  // lecturer, 30 Oct 2026, late: "I picked my favourite (q2); delete the rest of the variants and develop from it"
  { id: 'q2', name: 'The real cell: a C₂ bundle-sheath electron micrograph, labelled, beside both leaves' },
  { id: 'r1', name: 'q2 polished: both leaves stacked beside the electron micrograph, every CO₂ labelled, the share recaptured' },
  { id: 's1', name: 'r1 polished: the CO₂ crowded at the vein-side mitochondria, C₃’s CO₂ leaving the cell, the numbers on the pills' },
  { id: 's2', name: 's1 plus the CO₂ level in the bundle sheath: a glow over the crowd and a small gauge rising to ≈ 3 × the C₃ level' },
  { id: 'r2', name: 'The evolutionary step: C₃ → C₃–C₄ intermediate (C₂) → C₄ leaf sections on top, the C₂ cell below' },
];

export function draw(id: string): string {
  const fns: Record<string, () => string> = { p1, p2, q1, q2, q3, r1, s1, s2, r2, v1, v2, v3, v4, v5, v6, v7, v8, v9 };
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

/* ================================================================ page versions p1, p2 (overnight, 29 Oct 2026) */
// The approved micrograph-and-magnifier style (anim/c4-style.ts, anim/c2-kranz.ts) as stills: a real micrograph with the
// bundle sheath outlined, a lens, and a round magnifier drawn with bilayers, real protein renders (RuBisCO PDB 8RUC,
// glycine decarboxylase PDB 4LHC) and slide 19's CO₂ character (anim/co2-kit.ts kidG) in one mood: glad where it has
// escaped, strained and sweating where RuBisCO holds it (lecturer: "in one it leaks, in the other it gets trapped").
// Micrographs: Khoshravesh et al. 2016, J Exp Bot 67:3065, Fig. 1 (CC BY 3.0), letters painted out: Steinchisma laxum (C₃
// by gas exchange, C* 53 µmol mol⁻¹; proto-Kranz anatomy) and Homolepis aturensis (C₂). The windows leave out the
// smeared strip at the bottom right of each (S. laxum v > 672, H. aturensis v > 680). The kit is shared with cc12.ts.

export const STE: Img = { href: steJpg, w: 1000, h: 740 };
export const HOM: Img = { href: homJpg, w: 1000, h: 740 };
export const WIN_STE: [number, number, number, number] = [0, 0, 1000, 672];
const WIN_HOM: [number, number, number, number] = [20, 40, 960, 640];
/** Height / width of the protein renders. */
export const AR = { rub: 471 / 548, gdc: 222 / 302, pepc: 517 / 608 };
/** A render w wide centred on c. */
export const imgC = (href: string, c: Pt, w: number, ar: number): string =>
  `<image href="${href}" x="${f(c[0] - w / 2)}" y="${f(c[1] - (w * ar) / 2)}" width="${f(w)}" height="${f(w * ar)}"/>`;
/** A label (the animations' magnifier labels by default). */
export const lab = (x: number, y: number, s: string, cls = 'co2k-il cel-halo', a: A = 'middle'): string => T(x, y, s, cls, a);
/** A name on a photo, centred on q. */
export const onPhoto = (q: Pt, s: string, cls = 'co2k-zl cel-halo'): string => T(q[0], q[1], s, cls);

/** Slide 19's CO₂ character, still at `at`: one face (n neutral, s strained, h glad), sweat, squeeze, an optional name. */
export interface Look { face?: 'n' | 's' | 'h'; sweat?: boolean; sx?: number; sy?: number; lab?: string; labDy?: number }
export function kidAt(k: string, at: Pt, r: number, m: Look = {}): string {
  let s = kidG(k, r, m.lab ?? '', m.labDy).replace(' data-actor="1" display="none"', ` transform="translate(${f(at[0])} ${f(at[1])})"`);
  const hide = (part: string): void => { s = s.replace(`<g data-k="${k}-${part}">`, `<g data-k="${k}-${part}" display="none">`); };
  const face = m.face ?? 'n';
  for (const x of ['n', 's', 'h'] as const) if (x !== face) hide(`f${x}`);
  if (!m.sweat) hide('sw');
  hide('sh');
  if (m.sx || m.sy) s = s.replace(`<g data-k="${k}-b">`, `<g data-k="${k}-b" transform="scale(${m.sx ?? 1} ${m.sy ?? 1})">`);
  return s;
}

/** The lens on a photo (its ring and the 2 tangent lines) and the round magnifier at c, radius r; its drawing (local
 *  units, origin at c) is clipped to the circle. */
export function magnifier(id: string, lens: Pt, lr: number, c: Pt, r: number, inner: string): { lens: string; mag: string } {
  const circ = `cx="${f(c[0])}" cy="${f(c[1])}" r="${r}"`;
  return {
    lens: `<path class="co2k-tan" d="${tangents(lens, lr, c, r)}"/><circle class="co2k-lens" cx="${f(lens[0])}" cy="${f(lens[1])}" r="${lr}"/>`,
    mag: `<clipPath id="${id}"><circle ${circ}/></clipPath><circle class="co2k-inbg" ${circ}/>
      <g clip-path="url(#${id})"><g transform="translate(${f(c[0])} ${f(c[1])})">${inner}</g></g><circle class="co2k-inring" ${circ}/>`,
  };
}
/** The dashed ring of bundle-sheath cells on a photo, clipped to the photo (clip: the shot's id). */
export const ringOn = (clip: string, c: Pt, rx: number, ry: number): string =>
  `<g clip-path="url(#${clip})"><ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(rx)}" ry="${f(ry)}" style="fill:none;stroke:#2f6f5f;stroke-width:2.2;stroke-dasharray:7 5" opacity=".9"/></g>`;

/** A thylakoid stack: n discs w wide from (x, y) down. */
export const granum = (x: number, y: number, w: number, n = 3): string => Array.from({ length: n }, (_, k) =>
  `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 8.5)}" width="${f(w)}" height="6" rx="3" style="stroke:#9fbf6e;stroke-width:1.2"/>`).join('');
/** A chloroplast (as in anim/c2-kranz.ts): stroma, the double envelope, grana, RuBisCO (render rw wide at rub). */
export function chloroplast(c: Pt, rx: number, ry: number, grana: string, rub?: Pt, rw = 0): string {
  return `<ellipse class="co2k-strm" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}"/>${bilayerE(c[0], c[1], rx, ry, 4)}${bilayerE(c[0], c[1], rx + 11, ry + 11, 4)}
    ${grana}${rub ? imgC(rubiscoPng, rub, rw, AR.rub) : ''}`;
}
/** A mitochondrion (as in anim/c2-kranz.ts): matrix, outer and inner bilayer, cristae (folds of the inner membrane from
 *  its top and bottom at the fractions u of its width), glycine decarboxylase (render gw wide at g). */
export function mitochondrion(c: Pt, rx: number, ry: number, folds: number[], fl: number, g: Pt, gw: number): string {
  const ri = rx - 9, qi = ry - 9;
  const cr = folds.map((u, i) => {
    const x = c[0] + u * ri, h = qi * Math.sqrt(1 - u * u), s = i % 2 ? 1 : -1, y0 = c[1] + s * (h - 1);
    return bilayer([{ L: [x, y0, x, y0 - s * fl] }], 3.4, 1.2, 3.2);
  }).join('');
  return `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${ri}" ry="${qi}" style="fill:#f8e4d8"/>${bilayerE(c[0], c[1], rx, ry, 3.6)}${bilayerE(c[0], c[1], ri, qi, 3.6)}${cr}
    ${imgC(gdcPng, g, gw, AR.gdc)}`;
}
/** A peroxisome: matrix and its one bilayer. */
export const peroxisome = (c: Pt, r: number): string => `<circle class="cel-perox" cx="${f(c[0])}" cy="${f(c[1])}" r="${r}"/>${bilayerE(c[0], c[1], r, r, 4)}`;
/** A vertical cell wall from x0 to x1 (with fibres), y0 to y1; plasma-membrane bilayers down it at the x in pm, open
 *  where a plasmodesma crosses at height pd.y (channel half-height pd.h): the channel is lined by the plasma membrane,
 *  a desmotubule down its middle (as in anim/c4-style.ts). */
export function wallV(x0: number, x1: number, y0: number, y1: number, pm: number[], pd?: { y: number; h: number }): string {
  const n = Math.ceil((y1 - y0) / 25), dx = (x1 - x0 - 10) / 3;
  const fib = Array.from({ length: n }, (_, i) => {
    const y = y0 + 6 + i * 25;
    return pd && Math.abs(y + 7 - pd.y) < pd.h + 12 ? '' : `<path class="co2k-fib" d="M${f(x0 + 5 + (i % 3) * dx)},${f(y)}q5,7 0,14t0,14"/>`;
  }).join('');
  const pmV = (x: number): string => (pd
    ? bilayer([{ L: [x, y0, x, pd.y - pd.h] }], 6, 1.6, 4.2) + bilayer([{ L: [x, pd.y + pd.h, x, y1] }], 6, 1.6, 4.2)
    : bilayer([{ L: [x, y0, x, y1] }], 6, 1.6, 4.2));
  const a = Math.min(...pm), b = Math.max(...pm);
  const chan = pd ? `<rect class="co2k-cyt" x="${f(a)}" y="${f(pd.y - pd.h)}" width="${f(b - a)}" height="${f(2 * pd.h)}"/>
    ${bilayer([{ L: [a, pd.y - pd.h, b, pd.y - pd.h] }], 5, 1.5, 4)}${bilayer([{ L: [a, pd.y + pd.h, b, pd.y + pd.h] }], 5, 1.5, 4)}
    <path d="M${f(a - 4)},${f(pd.y)}H${f(b + 4)}" style="stroke:#b9a27a;stroke-width:3;stroke-dasharray:2 3;fill:none"/>` : '';
  return `<rect class="co2k-wallb" x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}"/>${fib}${pm.map(pmV).join('')}${chan}`;
}

/* ---------- p1 · C₃ and C₂ micrographs side by side, each with a magnifier: the CO₂ leaks away, or is trapped ---------- */

function p1(): string {
  const p = 'fc11ap1', R = 140, CY = 428;
  const a = shot(`${p}-a`, STE, 30, 50, 340, { win: WIN_STE });
  const b = shot(`${p}-b`, HOM, 430, 50, 340, { win: WIN_HOM });
  const sa = 340 / WIN_STE[2], sb = 340 / WIN_HOM[2];
  // C₃: the lens on a mesophyll cell where it meets an air space; in the magnifier its chloroplast (RuBisCO) and
  // mitochondrion (glycine decarboxylase) inside, the plasma membrane and wall on the right, the air space beyond, where
  // the released CO₂ has gone
  const ma = magnifier(`${p}-ma`, a.at(880, 305), 12, [200, CY], R, `
    <rect class="co2k-cyt" x="-150" y="-150" width="176" height="300"/><rect class="co2k-ias" x="50" y="-150" width="100" height="300"/>
    ${wallV(32, 50, -150, 150, [26])}
    ${chloroplast([-50, -50], 60, 34, granum(-96, -58, 14) + granum(-6, -58, 14), [-54, -50], 52)}
    ${mitochondrion([-46, 46], 52, 28, [-0.9, -0.8, 0.82, 0.92], 10, [-50, 46], 46)}
    ${route(p, 'x', 'M8,42 C24,40 40,32 58,22', 'fcc-thin')}
    ${kidAt(`${p}k1`, [96, 12], 12, { face: 'h', lab: 'CO₂' })}
    ${lab(-40, -100, 'RuBisCO')}${lab(-30, 90, 'glycine')}${lab(-30, 106, 'decarboxylase')}${lab(82, -72, 'air space')}`);
  // C₂: the lens on the vein side of a bundle-sheath cell; in the magnifier the wall to the vein on the left, the
  // mitochondrion (glycine decarboxylase) against it, chloroplasts round it; the released CO₂ is held next to RuBisCO
  const mb = magnifier(`${p}-mb`, b.at(612, 418), 12, [600, CY], R, `
    <rect x="-150" y="-150" width="50" height="300" style="fill:#f1eee6"/><rect class="co2k-cyt" x="-80" y="-150" width="230" height="300"/>
    ${wallV(-104, -86, -150, 150, [-80])}
    ${chloroplast([10, -50], 70, 42, granum(16, -86, 16, 2), [-18, -52], 48)}
    ${chloroplast([86, 46], 24, 46, '', [86, 46], 34)}
    ${mitochondrion([-24, 42], 48, 27, [-0.9, -0.8, 0.82, 0.92], 10, [-30, 42], 42)}
    ${route(p, 'c', 'M-4,17 C2,0 12,-18 24,-30', 'fcc-thin')}
    ${kidAt(`${p}k2`, [44, -46], 12, { face: 's', sweat: true })}
    ${lab(-18, -106, 'RuBisCO')}${lab(-22, 96, 'glycine')}${lab(-22, 113, 'decarboxylase')}${lab(-120, 5, 'vein')}`);
  return svg('Two leaf cross-sections side by side, light micrographs from Khoshravesh et al. 2016, the ring of bundle-sheath cells around the vein outlined on each. Left, a C3 leaf (Steinchisma laxum), titled: the CO2 leaks away. A lens on a mesophyll cell where it meets an air space opens a magnifier: inside the cell a chloroplast with RuBisCO and a mitochondrion with glycine decarboxylase; the CO2 released in the mitochondrion has passed the cell wall into the air space, and the CO2 character there smiles. Right, a C2 leaf (Homolepis aturensis), titled: the CO2 is trapped. A lens on the vein side of a bundle-sheath cell opens a magnifier: a mitochondrion with glycine decarboxylase lies against the wall to the vein, with chloroplasts around it; the CO2 it releases sits in the chloroplast next to RuBisCO, and the CO2 character there is strained and sweating', `
    ${heads(p)}<g class="dk1 co2k">
    <path d="M400,16V566" style="stroke:#d8d5cb;stroke-width:1.4"/>
    ${T(200, 32, 'C₃ leaf: the CO₂ leaks away', 'fcc-b')}${T(600, 32, 'C₂ leaf: the CO₂ is trapped', 'fcc-b')}
    ${a.svg}${ringOn(`${p}-a`, a.at(481, 352), 301 * sa, 348 * sa)}
    ${onPhoto(a.at(478, 425), 'vein')}${onPhoto(a.at(295, 525), 'bundle sheath')}${onPhoto(a.at(745, 70), 'mesophyll')}
    ${b.svg}${ringOn(`${p}-b`, b.at(488, 414), 294 * sb, 240 * sb)}
    ${onPhoto(b.at(500, 398), 'vein')}${onPhoto(b.at(285, 470), 'bundle sheath')}${onPhoto(b.at(850, 205), 'mesophyll')}
    ${ma.lens}${ma.mag}${mb.lens}${mb.mag}
    ${credit(790, 583, `${it('Steinchisma laxum')} (C₃), ${it('Homolepis aturensis')} (C₂): Khoshravesh et al. 2016, J Exp Bot 67:3065, Fig. 1 (CC BY 3.0)`)}
    ${credit(790, 598, 'RuBisCO: PDB 8RUC · glycine decarboxylase: PDB 4LHC')}</g>
  `);
}

/* ---------- p2 · one big magnifier on a C₂ bundle-sheath / mesophyll wall, the micrograph small in the corner ---------- */

function p2(): string {
  const p = 'fc11ap2', C: Pt = [502, 316], R = 264, PD = 40;
  const ph = shot(`${p}-a`, HOM, 16, 16, 226, { win: WIN_HOM, r: 8 });
  const s = 226 / WIN_HOM[2];
  const L = (x: number, y: number, t: string): string => lab(x, y, t, 'fcca-ml cel-halo');
  // left the bundle-sheath cell (a chloroplast with RuBisCO, below it, towards the vein side, the mitochondrion with
  // glycine decarboxylase), the wall with a plasmodesma down the middle, right the mesophyll cell (a chloroplast with
  // RuBisCO, a peroxisome with glycolate oxidase, PDB 1GOX, and the glycine they made)
  const m = magnifier(`${p}-m`, ph.at(768, 432), 9, C, R, `
    <rect class="co2k-cyt" x="-270" y="-270" width="540" height="540"/>
    ${wallV(-20, 20, -270, 270, [-26, 26], { y: PD, h: 17 })}
    ${chloroplast([150, -100], 72, 96, granum(150, -184, 40) + granum(150, -50, 40), [150, -104], 78)}
    ${peroxisome([150, 140], 36)}${imgC(goxPng, [150, 140], 50, 1)}
    ${chloroplast([-146, -60], 100, 76, granum(-110, -120, 30, 2), [-180, -50], 90)}
    ${mitochondrion([-128, 116], 70, 38, [-0.92, -0.84, 0.84, 0.92], 14, [-136, 116], 62)}
    ${route(p, 'g', 'M136,102 C134,86 130,72 126,62', 'fcc-thin')}
    ${route(p, 'g', `M58,${PD} H-34 C-58,${PD} -68,70 -74,98`, 'fcc-thin')}
    <g transform="translate(100 ${PD})">${carbG('CCN', 11)}</g>
    ${route(p, 'c', 'M-112,79 C-110,40 -104,0 -100,-28', 'fcc-thin')}
    ${kidAt(`${p}k`, [-92, -50], 15, { face: 's', sweat: true, lab: 'CO₂' })}
    ${L(100, PD - 26, 'glycine')}${lab(0, PD + 52, 'plasmodesma')}${lab(0, 240, 'cell wall')}
    ${L(-180, -96, 'RuBisCO')}${L(-110, 172, 'glycine')}${L(-110, 190, 'decarboxylase')}`);
  return svg('A small light micrograph of a C2 leaf (Homolepis aturensis, Khoshravesh et al. 2016) in the top left corner, its ring of bundle-sheath cells around the vein outlined, with a lens on the wall where a bundle-sheath cell meets a mesophyll cell. The lens opens a large magnifier over the rest of the figure: on the left the bundle-sheath cell, on the right the mesophyll cell, the cell wall between them crossed by a plasmodesma, both plasma membranes drawn as lipid bilayers. In the mesophyll a chloroplast with RuBisCO and a peroxisome with glycolate oxidase; glycine, two carbons and a nitrogen drawn as balls, leaves the peroxisome and moves along a dashed arrow through the plasmodesma into the bundle-sheath mitochondrion, which carries glycine decarboxylase. The CO2 released there goes up into the bundle-sheath chloroplast and is held next to RuBisCO: the CO2 character is strained and sweating, trapped', `
    ${heads(p)}<g class="dk1 co2k">
    ${ph.svg}${ringOn(`${p}-a`, ph.at(488, 414), 294 * s, 240 * s)}
    ${onPhoto(ph.at(488, 252), 'bundle sheath', 'co2k-il cel-halo')}${onPhoto(ph.at(500, 432), 'vein', 'co2k-il cel-halo')}
    ${T(129, 194, 'C₂ leaf', 'co2k-zl')}
    ${m.lens}${m.mag}
    ${T(388, 42, 'bundle-sheath cell', 'co2k-zl')}${T(624, 42, 'mesophyll cell', 'co2k-zl')}
    ${credit(16, 533, `${it('Homolepis aturensis')} (C₂):`, 'start')}
    ${credit(16, 548, 'Khoshravesh et al. 2016, J Exp Bot (CC BY 3.0)', 'start')}
    ${credit(16, 563, 'RuBisCO: PDB 8RUC', 'start')}
    ${credit(16, 578, 'glycine decarboxylase: PDB 4LHC', 'start')}
    ${credit(16, 593, 'glycolate oxidase: PDB 1GOX', 'start')}</g>
  `);
}

/* ================================================================ variants of the picked p1: q1, q2, q3 (30 Oct 2026) */
// Lecturer: "label the mitochondria and the chloroplasts on the real images; why are there so many dark things around the
// veins of C₂ cells? Label every part"; "label the CO₂"; "in C₃ only about a quarter is recaptured, in C₂ it cannot escape
// and a little leaks". No enzyme name in the labels.
// The C₂ bundle-sheath electron micrograph: Khoshravesh et al. 2016, Fig. 2A (Homolepis aturensis, CC BY 3.0), letters
// removed. In it the vein is at the left edge (lower left), the mitochondria form a column along the vein-side wall
// (x 15–75, y 340–700; the paper's arrowheads), the long chloroplasts lie just inward of them, the vacuole fills the centre
// and a mesophyll cell sits at the top right. Busch et al. 2013: C₃ leaves recapture ≈ 24–38 % of the photorespired CO₂,
// drawn as 1 of 4.

const TEM: Img = { href: temJpg, w: 741, h: 744 };
const CR_K16 = 'Khoshravesh et al. 2016, J Exp Bot 67:3065';
const PDB_CR = 'RuBisCO: PDB 8RUC · glycine decarboxylase: PDB 4LHC';

/** A small label pill, 1 or 2 lines centred at (x, y); with `to`, a leader from its edge to that point. */
function tag(x: number, y: number, lines: string | string[], to?: Pt, k = 7.3): string {
  const L = Array.isArray(lines) ? lines : [lines];
  const w = Math.max(...L.map(s => s.replace(/<[^>]+>/g, '').length * k)) + 16, h = L.length * 17 + 8;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y;
    const t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), h / 2 / Math.max(Math.abs(dy), 1e-6));
    const d = `M${f(x + dx * t)},${f(y + dy * t)}L${f(to[0])},${f(to[1])}`;
    ld = `<path class="fcc-ldh" d="${d}"/><path class="fcc-ldk" d="${d}"/><circle class="fcc-tip" cx="${f(to[0])}" cy="${f(to[1])}" r="2.8"/>`;
  }
  const y0 = y + 5.2 - ((L.length - 1) * 17) / 2;
  return `${ld}<rect class="fcca-tgb" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(Math.min(h / 2, 12))}"/>${L.map((s, i) => T(x, y0 + i * 17, s, 'fcca-tg')).join('')}`;
}
/** A magnifier label (a little smaller than p1's). */
const ml = (x: number, y: number, s: string, a: A = 'middle'): string => T(x, y, s, 'fcca-il cel-halo', a);
/** A leader inside a magnifier (local units). */
const lead = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fcc-ldh" d="${d}"/><path class="fcc-ldk" d="${d}"/>`;
};
/** The result pill under a magnifier. */
const result = (x: number, y: number, s: string): string => {
  const w = s.length * 9.1 + 28;
  return `<rect class="fcca-resb" x="${f(x - w / 2)}" y="${f(y - 17)}" width="${f(w)}" height="34" rx="17"/>${T(x, y + 6, s, 'fcca-res')}`;
};

/** The electron micrograph in a round window: TEM pixel w at the centre c, wr pixels to the rim (r units), turned rot°. */
function temDisc(id: string, c: Pt, r: number, w: Pt, wr: number, rot: number): { svg: string; at: (u: number, v: number) => Pt } {
  const k = r / wr, circ = `cx="${f(c[0])}" cy="${f(c[1])}" r="${r}"`;
  const a = (rot * Math.PI) / 180, cs = Math.cos(a), sn = Math.sin(a);
  return {
    svg: `<clipPath id="${id}"><circle ${circ}/></clipPath><circle class="co2k-inbg" ${circ}/>
      <g clip-path="url(#${id})"><image href="${TEM.href}" x="${f(c[0] - k * w[0])}" y="${f(c[1] - k * w[1])}" width="${f(TEM.w * k)}" height="${f(TEM.h * k)}" transform="rotate(${rot} ${f(c[0])} ${f(c[1])})"/></g>
      <circle class="co2k-inring" ${circ}/>`,
    at: (u, v) => { const dx = k * (u - w[0]), dy = k * (v - w[1]); return [c[0] + dx * cs - dy * sn, c[1] + dx * sn + dy * cs]; },
  };
}

/* ---------- the two magnifier drawings (local units, rim at 140), shared by q1 and q3 ---------- */

/** C₃: a mesophyll cell where it meets an air space; its chloroplast (RuBisCO) above, its mitochondrion below. */
function c3Cell(): string {
  return `<rect class="co2k-cyt" x="-150" y="-150" width="176" height="300"/><rect class="co2k-ias" x="50" y="-150" width="100" height="300"/>
    ${wallV(32, 50, -150, 150, [26])}
    ${chloroplast([-50, -38], 60, 30, granum(-102, -46, 12), [-74, -38], 42)}
    ${mitochondrion([-50, 48], 48, 26, [-0.9, -0.8, 0.82, 0.92], 10, [-54, 48], 40)}
    ${ml(-18, -114, 'chloroplast')}${ml(-18, -97, '(RuBisCO)')}${ml(-34, 96, 'mitochondrion')}`;
}
/** C₂: a radial cut through a bundle-sheath cell from the vein (left): the mitochondrion against the vein-side wall,
 *  chloroplasts (RuBisCO) in front of it; in q1 also the outer wall to the mesophyll with a plasmodesma. */
function c2Cell(p: string, outcome: boolean): string {
  const vein = `<rect x="-150" y="-150" width="42" height="300" style="fill:#f1eee6"/>${wallV(-110, -92, -150, 150, [-86])}`;
  if (!outcome) {
    return `<rect class="co2k-cyt" x="-92" y="-150" width="190" height="300"/><rect class="co2k-cyt" x="110" y="-150" width="40" height="300"/>
      ${vein}${wallV(92, 110, -150, 150, [86, 116], { y: 66, h: 11 })}
      ${chloroplast([26, -18], 28, 50, granum(26, 20, 20, 1), [26, 2], 34)}
      ${mitochondrion([-46, 20], 40, 25, [-0.9, -0.8, 0.82, 0.92], 9, [-50, 20], 34)}
      ${route(p, 'g', 'M146,66 H62 C32,66 12,44 -2,30', 'fcc-thin')}
      ${route(p, 'c', 'M-30,-3 C-27,-13 -22,-20 -15,-24', 'fcc-thin')}
      ${kidAt(`${p}k2`, [26, -30], 11, { face: 's', sweat: true, lab: 'CO₂' })}
      ${ml(6, -111, 'chloroplast')}${ml(6, -94, '(RuBisCO)')}${ml(-40, 70, 'mitochondrion')}${ml(78, 57, 'glycine')}
      ${ml(36, 106, 'plasmodesma')}${lead([76, 95], [97, 72])}
      ${TV(131, 4, 'mesophyll', 'fcca-il cel-halo')}`;
  }
  // the outcome: 3 CO₂ held, each touching a RuBisCO (2 in the upper chloroplast, 1 in the lower); 1 slips out between them
  const rk = (c: Pt, w = 22): string => imgC(rubiscoPng, c, w, AR.rub);
  return `<rect class="co2k-cyt" x="-92" y="-150" width="242" height="300"/>${vein}
    ${chloroplast([28, -52], 64, 22, '')}${rk([-26, -52])}${rk([38, -52])}
    ${chloroplast([34, 40], 36, 40, '', [34, 56], 26)}
    ${mitochondrion([-54, 8], 30, 42, [-0.8, -0.6, 0.6, 0.8], 8, [-54, 8], 26)}
    ${route(p, 'x', 'M-22,-12 C12,-14 46,-14 74,-14', 'fcc-thin')}
    ${kidAt(`${p}k1`, [4, -52], 8, { face: 's', sweat: true, lab: 'CO₂', labDy: -14 })}
    ${kidAt(`${p}k2`, [68, -52], 8, { face: 's', sweat: true, lab: 'CO₂', labDy: -14 })}
    ${kidAt(`${p}k3`, [34, 24], 9, { face: 's', sweat: true, lab: 'CO₂', labDy: -14 })}
    ${kidAt(`${p}k4`, [104, -14], 10, { face: 'h', lab: 'CO₂', labDy: 30 })}
    ${ml(8, -114, 'chloroplasts')}${ml(8, -97, '(RuBisCO)')}${ml(-58, 88, 'mitochondrion')}`;
}

/* ---------- q1 · p1 labelled: every part named, the C₂ electron micrograph as an inset ---------- */

function q1(): string {
  const p = 'fc11aq1', R = 140, CY = 428, W = 300;
  const a = shot(`${p}-a`, STE, 20, 50, W, { win: WIN_STE });
  const b = shot(`${p}-b`, HOM, 480, 50, W, { win: WIN_HOM });
  const sa = W / WIN_STE[2], sb = W / WIN_HOM[2];
  const A3: Pt = [170, CY], A2: Pt = [630, CY];
  const ma = magnifier(`${p}-ma`, a.at(880, 305), 12, A3, R, `${c3Cell()}
    ${route(p, 'x', 'M0,40 C22,34 44,24 66,14', 'fcc-thin')}
    ${kidAt(`${p}k1`, [98, 4], 12, { face: 'h', lab: 'CO₂' })}${ml(92, -48, 'air space')}`);
  const mb = magnifier(`${p}-mb`, b.at(612, 418), 12, A2, R, c2Cell(p, false));
  // the electron micrograph turned 90° anticlockwise, so its vein lies below it, as for the upper-left bundle-sheath
  // cell under the lens
  const TC: Pt = [400, 168], tr = 68;
  const te = temDisc(`${p}-te`, TC, tr, [180, 450], 180, -90);
  const tl = magnifier(`${p}-tl`, b.at(452, 292), 18, TC, tr, '');
  return svg('Two leaf cross-sections side by side, light micrographs from Khoshravesh et al. 2016, every part labelled with leader lines. Left, a C3 leaf (Steinchisma laxum): vein, bundle-sheath cells with few organelles, mesophyll cells, air space. A magnifier on a mesophyll cell at an air space: chloroplast with RuBisCO, mitochondrion, and a CO2 character, labelled, that has escaped into the air space and smiles. Right, a C2 leaf (Homolepis aturensis): vein; around it a dark band, labelled chloroplasts and mitochondria packed on the vein side; bundle-sheath cells, mesophyll cells, air space. A magnifier on the vein side of a bundle-sheath cell: the vein side on the left, a mitochondrion against the wall, a chloroplast with RuBisCO in front of it holding the CO2 character, strained and sweating; glycine arrives from the mesophyll through a plasmodesma. Between the two leaves a small round electron micrograph of a C2 bundle-sheath cell, linked by a lens to the light micrograph, labelled chloroplasts, mitochondria and vein', `
    ${heads(p)}<g class="dk1 co2k">
    ${T(170, 32, 'C₃ leaf: the CO₂ leaks away', 'fcc-b')}${T(630, 32, 'C₂ leaf: the CO₂ is trapped', 'fcc-b')}
    ${a.svg}${ringOn(`${p}-a`, a.at(481, 352), 301 * sa, 348 * sa)}
    ${b.svg}${ringOn(`${p}-b`, b.at(488, 414), 294 * sb, 240 * sb)}
    ${tl.lens}${te.svg}${ma.lens}${mb.lens}
    ${tag(236, 62, 'mesophyll cells', a.at(660, 120))}
    ${tag(130, 96, 'bundle-sheath cells', a.at(300, 290))}
    ${tag(270, 200, 'air space', a.at(960, 420))}
    ${tag(120, 232, 'vein', a.at(440, 470))}
    ${tag(240, 228, 'few organelles', a.at(590, 470))}
    ${tag(528, 62, 'air space', b.at(435, 115))}
    ${tag(712, 62, 'mesophyll cells', b.at(860, 170))}
    ${tag(558, 222, 'bundle-sheath cells', b.at(250, 500))}
    ${tag(716, 200, 'vein', b.at(500, 480))}
    ${tag(640, 262, ['chloroplasts + mitochondria,', 'packed on the vein side'], b.at(520, 520))}
    ${T(400, 34, 'electron micrograph', 'fcca-cap')}
    ${tag(400, 66, 'chloroplasts', te.at(150, 330))}
    ${tag(436, 254, 'vein', te.at(6, 470))}
    ${tag(384, 280, 'mitochondria', te.at(35, 385))}
    ${ma.mag}${mb.mag}
    ${tag(400, 404, 'vein side', [A2[0] - 122, CY - 30])}
    ${credit(790, 583, `${it('Steinchisma laxum')} (C₃), ${it('Homolepis aturensis')} (C₂): ${CR_K16}, Figs 1 and 2A (CC BY 3.0)`)}
    ${credit(790, 598, `${PDB_CR} · electron micrograph turned 90°`)}</g>
  `);
}

/* ---------- q2 · the real cell: the C₂ bundle-sheath electron micrograph large, both leaves small beside it ---------- */

function q2(): string {
  const p = 'fc11aq2', TW = 440, x0 = 180, y0 = 62;
  const te = shot(`${p}-t`, TEM, x0, y0, TW);
  const yc = y0 + te.h / 2, PW = 164;
  const hb = (WIN_HOM[3] * PW) / WIN_HOM[2], ha = (WIN_STE[3] * PW) / WIN_STE[2];
  const b = shot(`${p}-b`, HOM, 8, yc - hb / 2, PW, { win: WIN_HOM, r: 8 });
  const a = shot(`${p}-a`, STE, 800 - 8 - PW, yc - ha / 2, PW, { win: WIN_STE, r: 8 });
  // the lens on the upper-right bundle-sheath cell (its vein lies to the lower left, as in the electron micrograph);
  // lines from its rim to the micrograph's 2 left corners
  const L = b.at(576, 252), lr = (88 * PW) / WIN_HOM[2];
  const toC = (q: Pt): string => {
    const dx = q[0] - L[0], dy = q[1] - L[1], n = Math.hypot(dx, dy);
    return `M${f(L[0] + (lr * dx) / n)},${f(L[1] + (lr * dy) / n)}L${f(q[0])},${f(q[1])}`;
  };
  return svg('A large electron micrograph of one bundle-sheath cell of a C2 grass (Homolepis aturensis, Khoshravesh et al. 2016) in the centre, labelled: the vein at the lower left; mitochondria, small round bodies in a column on the vein-side wall; long chloroplasts packed around them; the big pale vacuole in the middle; a mesophyll cell at the top right. On the left a small light micrograph of the C2 leaf with a lens on the bundle-sheath cell to the upper right of the vein, lines leading to the electron micrograph. On the right a small light micrograph of a C3 leaf (Steinchisma laxum), labelled: few organelles in the bundle sheath', `
    <g class="dk1 co2k">
    ${T(x0 + TW / 2, 42, 'C₂ bundle-sheath cell', 'fcc-b')}
    <path class="co2k-tan" d="${toC([x0, y0])}"/><path class="co2k-tan" d="${toC([x0, y0 + te.h])}"/>
    ${te.svg}
    ${b.svg}<circle class="co2k-lens" cx="${f(L[0])}" cy="${f(L[1])}" r="${f(lr)}"/>
    ${T(8, b.y - 12, 'C₂ leaf', 'fcc-b', 'start')}
    ${a.svg}
    ${tag(a.x + PW / 2, a.y - 30, ['C₃: few organelles', 'in the bundle sheath'], a.at(610, 470))}
    ${tag(...te.at(300, 440), ['mitochondria', 'on the vein-side wall'], te.at(40, 440))}
    ${tag(...te.at(330, 560), ['chloroplasts', 'packed around them'], te.at(130, 540))}
    ${tag(...te.at(400, 330), 'vacuole')}
    ${tag(...te.at(560, 250), 'mesophyll cell', te.at(650, 140))}
    ${tag(...te.at(110, 700), 'vein', te.at(14, 612))}
    ${credit(790, 583, `${it('Homolepis aturensis')} (C₂), ${it('Steinchisma laxum')} (C₃): ${CR_K16} (CC BY 3.0)`)}
    ${credit(790, 598, 'light micrographs: Fig. 1 · electron micrograph: Fig. 2A')}</g>
  `);
}

/* ---------- q3 · the outcome: in each magnifier where the 4 released CO₂ end up ---------- */

function q3(): string {
  const p = 'fc11aq3', R = 140, CY = 428;
  const a = shot(`${p}-a`, STE, 30, 50, 340, { win: WIN_STE });
  const b = shot(`${p}-b`, HOM, 430, 50, 340, { win: WIN_HOM });
  const sa = 340 / WIN_STE[2], sb = 340 / WIN_HOM[2];
  // C₃: 1 of 4 held at RuBisCO, 3 out in the air space (Busch et al. 2013: ≈ 24–38 % recaptured)
  const ma = magnifier(`${p}-ma`, a.at(880, 305), 12, [200, CY], R, `${c3Cell()}
    ${route(p, 'c', 'M-30,22 C-30,10 -28,-2 -26,-24', 'fcc-thin')}
    ${route(p, 'x', 'M0,40 C20,36 40,30 60,24', 'fcc-thin')}
    ${kidAt(`${p}k0`, [-22, -38], 10, { face: 's', sweat: true, lab: 'CO₂', labDy: -14 })}
    ${kidAt(`${p}k1`, [92, -48], 10, { face: 'h', lab: 'CO₂' })}
    ${kidAt(`${p}k2`, [92, 4], 10, { face: 'h', lab: 'CO₂' })}
    ${kidAt(`${p}k3`, [92, 56], 10, { face: 'h', lab: 'CO₂' })}
    ${ml(72, 94, 'air space')}`);
  const mb = magnifier(`${p}-mb`, b.at(612, 418), 12, [600, CY], R, c2Cell(p, true));
  return svg('Two leaf cross-sections side by side, light micrographs from Khoshravesh et al. 2016, each with a magnifier showing where 4 CO2 released by photorespiration end up, all labelled. Left, a C3 leaf (Steinchisma laxum): in a mesophyll cell at an air space, one CO2 character is held at RuBisCO in the chloroplast, strained and sweating; three have escaped through the wall into the air space and smile. Pill: about 1 in 4 recaptured. Right, a C2 leaf (Homolepis aturensis): on the vein side of a bundle-sheath cell, the mitochondrion against the vein-side wall, chloroplasts in front of it; three CO2 characters are held at RuBisCO, strained and sweating, and one slips out between the chloroplasts. Pill: most recaptured, a little leaks', `
    ${heads(p)}<g class="dk1 co2k">
    <path d="M400,16V566" style="stroke:#d8d5cb;stroke-width:1.4"/>
    ${T(200, 32, 'C₃ leaf: the CO₂ leaks away', 'fcc-b')}${T(600, 32, 'C₂ leaf: the CO₂ is trapped', 'fcc-b')}
    ${a.svg}${ringOn(`${p}-a`, a.at(481, 352), 301 * sa, 348 * sa)}
    ${onPhoto(a.at(478, 425), 'vein')}${onPhoto(a.at(295, 525), 'bundle sheath')}${onPhoto(a.at(745, 70), 'mesophyll')}
    ${b.svg}${ringOn(`${p}-b`, b.at(488, 414), 294 * sb, 240 * sb)}
    ${onPhoto(b.at(500, 398), 'vein')}${onPhoto(b.at(285, 470), 'bundle sheath')}${onPhoto(b.at(850, 205), 'mesophyll')}
    ${ma.lens}${ma.mag}${mb.lens}${mb.mag}
    ${tag(400, 448, 'vein side', [600 - 124, CY + 20])}
    ${result(200, CY + R - 20, 'about 1 in 4 recaptured')}${result(600, CY + R - 20, 'most recaptured, a little leaks')}
    ${credit(790, 583, `${it('Steinchisma laxum')} (C₃), ${it('Homolepis aturensis')} (C₂): ${CR_K16}, Fig. 1 (CC BY 3.0)`)}
    ${credit(790, 598, PDB_CR)}</g>
  `);
}

/* ================================================================ variants of the picked q2: r1, r2 (30 Oct 2026) */
// Lecturer: "develop from q2: polish it and make more variants"; "C₂ photosynthesis is also called C₃–C₄ intermediacy: call it
// that, so we know it is an evolutionary step". Every CO₂ character carries its name. C₃: about 1 in 4 recaptured (Busch et
// al. 2013, ≈ 24–38 %); C₂: most (Khoshravesh et al. 2016: chloroplasts cluster at the vein-side pole "for refixing
// photorespired CO₂ from adjacent mitochondria"). Maize: Berkshire Community College Bioscience Image Library (CC0).

const ZEA: Img = { href: zeaJpg, w: 1000, h: 740 };
/** A result pill of 2 lines centred at (x, y). */
const result2 = (x: number, y: number, L: [string, string]): string => {
  const w = Math.max(...L.map(t => t.length)) * 9.1 + 28;
  return `<rect class="fcca-resb" x="${f(x - w / 2)}" y="${f(y - 25)}" width="${f(w)}" height="50" rx="18"/>${T(x, y - 4, L[0], 'fcca-res')}${T(x, y + 16, L[1], 'fcca-res')}`;
};
/** A result pill whose left edge is at x. */
const resultL = (x: number, y: number, s: string): string => result(x + (s.length * 9.1 + 28) / 2, y, s);
/** Lines from the rim of the lens (centre L, radius lr) to the points q (drawn under the photo). */
const wedge = (L: Pt, lr: number, qs: Pt[]): string => qs.map(q => {
  const dx = q[0] - L[0], dy = q[1] - L[1], n = Math.hypot(dx, dy);
  return `<path class="co2k-tan" d="M${f(L[0] + (lr * dx) / n)},${f(L[1] + (lr * dy) / n)}L${f(q[0])},${f(q[1])}"/>`;
}).join('');

/** The C₂ electron micrograph's labels and its CO₂: released by a vein-side mitochondrion, held at a chloroplast. */
function temParts(p: string, te: Shot, r: number, o: { vac?: boolean; mes?: boolean; short?: boolean } = {}): string {
  const a = te.at(62, 548), k = te.at(150, 512);
  return `${route(p, 'c', `M${f(a[0])},${f(a[1])}L${f(k[0] - 2.7 * r - 3)},${f(k[1] + 4)}`, 'fcc-thin')}
    ${kidAt(`${p}k`, k, r, { face: 's', sweat: true, lab: 'CO₂' })}
    ${o.short ? tag(...te.at(250, 400), 'mitochondria', te.at(44, 420)) : tag(...te.at(300, 410), ['mitochondria', 'on the vein-side wall'], te.at(44, 420))}
    ${o.short ? tag(...te.at(330, 630), 'chloroplasts', te.at(150, 610)) : tag(...te.at(330, 640), ['chloroplasts', 'packed around them'], te.at(150, 610))}
    ${o.vac === false ? '' : tag(...te.at(420, 250), 'vacuole')}
    ${o.mes === false ? '' : tag(...te.at(560, 120), 'mesophyll cell', te.at(660, 170))}
    ${tag(...te.at(150, 712), 'vein', te.at(20, 660))}`;
}

/* ---------- r1 · q2 polished: both leaves stacked on the left, the electron micrograph large on the right ---------- */

function r1(): string {
  const p = 'fc11ar1', X = 14, TX = 340, TY = 60, TW = 446;
  const te = shot(`${p}-t`, TEM, TX, TY, TW);
  const b = shot(`${p}-b`, HOM, X, TY, 226, { win: WIN_HOM, r: 8 });
  const a = shot(`${p}-a`, STE, X, 330, 200, { win: WIN_STE, r: 8 });
  const L = b.at(576, 252), lr = (88 * b.w) / WIN_HOM[2];
  const air = a.at(900, 440);
  return svg('Left, two light micrographs of leaf cross-sections from Khoshravesh et al. 2016, stacked. Above, a C2 (C3–C4 intermediate) leaf, Homolepis aturensis, with a lens on the bundle-sheath cell to the upper right of the vein; lines lead from it to the electron micrograph. Pill: most recaptured. Below, a C3 leaf, Steinchisma, labelled few organelles in the bundle sheath; a CO2 character, labelled, has escaped into an air space and smiles. Pill: about 1 in 4 recaptured. Right, large, the electron micrograph of that C2 bundle-sheath cell, labelled: mitochondria on the vein-side wall, chloroplasts packed around them, the vacuole, a mesophyll cell, the vein at the lower left. An arrow leads from a mitochondrion to a CO2 character, labelled, held at a chloroplast, strained and sweating', `
    ${heads(p)}<g class="dk1 co2k">
    ${T(X, 44, 'C₂ (C₃–C₄ intermediate)', 'fcc-b', 'start')}${T(TX + TW / 2, 44, 'bundle-sheath cell', 'fcc-b')}
    ${wedge(L, lr, [[TX, TY], [TX, TY + te.h]])}
    ${te.svg}${b.svg}<circle class="co2k-lens" cx="${f(L[0])}" cy="${f(L[1])}" r="${f(lr)}"/>
    ${resultL(X, b.y + b.h + 26, 'most recaptured')}
    ${T(X, 304, 'C₃', 'fcc-b', 'start')}
    ${a.svg}
    ${tag(132, 298, ['few organelles', 'in the bundle sheath'], a.at(380, 190))}
    ${kidAt(`${p}k3`, air, 6, { face: 'h', lab: 'CO₂', labDy: -17 })}
    ${resultL(X, a.y + a.h + 26, 'about 1 in 4 recaptured')}
    ${temParts(p, te, 8)}
    ${credit(790, 583, `${it('Homolepis aturensis')} (C₂), ${it('Steinchisma laxum')} (C₃): ${CR_K16} (CC BY 3.0)`)}
    ${credit(790, 598, 'light micrographs: Fig. 1 · electron micrograph: Fig. 2A')}</g>
  `);
}

/* ---------- s1, s2 · r1 polished (lecturer, 30 Oct 2026: "put the CO₂ closer inside, at the mitochondria, to show it is
 * really trapped"; "not 'most': give a number"; "show clearly that in C₃ the CO₂ leaks away"). C₃: about 1 in 4 recaptured
 * (Busch et al. 2013, 24–38 %). C₂: CO₂ in the chloroplasts about 3-fold that of the C₃ relative (Keerberg et al. 2014,
 * Flaveria pubescens against F. cronquistii). ---------- */

/** A 2-line result pill whose left edge is at x. */
const resultL2 = (x: number, y: number, L: [string, string]): string => result2(x + (Math.max(...L.map(t => t.length)) * 9.1 + 28) / 2, y, L);
/** The C₂ micrograph's labels and its CO₂ crowd: 5 CO₂, strained and sweating, held between the vein-side mitochondria
 *  and the chloroplasts packed around them (2 staggered columns, 48 units apart, rows 40 apart, so no name covers a CO₂). */
function temCrowd(p: string, te: Shot): string {
  const spots: Pt[] = [[86, 480], [166, 512], [86, 545], [166, 578], [86, 611]];
  return `${spots.map((q, i) => kidAt(`${p}k${i}`, te.at(...q), 7, { face: 's', sweat: i % 2 === 0, lab: 'CO₂' })).join('')}
    ${tag(...te.at(300, 410), ['mitochondria', 'on the vein-side wall'], te.at(44, 420))}
    ${tag(...te.at(330, 640), ['chloroplasts', 'packed around them'], te.at(150, 610))}
    ${tag(...te.at(420, 250), 'vacuole')}
    ${tag(...te.at(560, 120), 'mesophyll cell', te.at(660, 170))}
    ${tag(...te.at(150, 712), 'vein', te.at(20, 660))}`;
}
/** s1 and s2: r1's layout; s2 adds the CO₂ level in the bundle sheath. */
function sFig(id: 's1' | 's2'): string {
  const p = `fc11a${id}`, X = 14, TX = 340, TY = 60, TW = 446, lvl = id === 's2';
  const te = shot(`${p}-t`, TEM, TX, TY, TW);
  const b = shot(`${p}-b`, HOM, X, TY, 226, { win: WIN_HOM, r: 8 });
  const a = shot(`${p}-a`, STE, X, 330, 200, { win: WIN_STE, r: 8 });
  const L = b.at(576, 252), lr = (88 * b.w) / WIN_HOM[2];
  const air = a.at(905, 430), from = a.at(770, 500);
  const crowd = te.at(128, 529);
  // the gauge (s2): in the vacuole, its tick at the C₃ level (1 ×), filled to 3 ×
  const G = { x: 640, w: 11, y0: 404, u: 30 };
  const gauge = lvl ? `<defs><radialGradient id="${p}-gl"><stop offset="0" stop-color="#f6c453" stop-opacity=".62"/><stop offset=".7" stop-color="#f6c453" stop-opacity=".3"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="${f(crowd[0])}" cy="${f(crowd[1])}" rx="52" ry="72" fill="url(#${p}-gl)"/>` : '';
  const bar = lvl ? `<rect x="${G.x}" y="${G.y0 - 3 * G.u}" width="${G.w}" height="${3 * G.u}" rx="3" style="fill:#fffdf8;stroke:#3f4a5a;stroke-width:1.3"/>
    <rect x="${G.x + 1.5}" y="${G.y0 - 3 * G.u + 1.5}" width="${G.w - 3}" height="${3 * G.u - 3}" rx="2" style="fill:#e0a43a"/>
    <path d="M${G.x - 5},${G.y0 - G.u}h${G.w + 10}" style="stroke:#1f2a3a;stroke-width:1.5"/>
    ${tag(G.x - 22, G.y0 - G.u, 'C₃')}${tag(G.x + G.w / 2, G.y0 - 3 * G.u - 16, '≈ 3 ×')}${tag(G.x + G.w / 2, G.y0 + 16, 'CO₂')}` : '';
  return svg(`Left, two light micrographs of leaf cross-sections from Khoshravesh et al. 2016, stacked. Above, a C2 (C3–C4 intermediate) leaf, Homolepis aturensis, with a lens on the bundle-sheath cell to the upper right of the vein; lines lead from it to the electron micrograph. Pill: ${lvl ? 'the trapped CO2 builds up at RuBisCO' : 'CO2 in the chloroplasts about 3 times that of C3'}. Below, a C3 leaf, Steinchisma: an arrow leads from a mesophyll cell into an air space, where a CO2 character, labelled, smiles: it has left the cell. Pill: about 1 in 4 recaptured, the rest leaks away. Right, large, the electron micrograph of that C2 bundle-sheath cell, labelled: mitochondria on the vein-side wall, chloroplasts packed around them, the vacuole, a mesophyll cell, the vein at the lower left. Five CO2 characters, labelled, crowd between the mitochondria and the chloroplasts, strained and sweating: trapped${lvl ? '. A soft glow lies over them, and a small gauge beside them is filled to 3 times its C3 tick' : ''}`, `
    ${heads(p)}<g class="dk1 co2k">
    ${T(X, 44, 'C₂ (C₃–C₄ intermediate)', 'fcc-b', 'start')}${T(TX + TW / 2, 44, 'bundle-sheath cell', 'fcc-b')}
    ${wedge(L, lr, [[TX, TY], [TX, TY + te.h]])}
    ${te.svg}${b.svg}<circle class="co2k-lens" cx="${f(L[0])}" cy="${f(L[1])}" r="${f(lr)}"/>
    ${resultL2(X, b.y + b.h + 34, lvl ? ['the trapped CO₂', 'builds up at RuBisCO'] : ['CO₂ in the chloroplasts', '≈ 3 × that of C₃'])}
    ${T(X, 304, 'C₃', 'fcc-b', 'start')}
    ${a.svg}
    ${tag(132, 298, ['few organelles', 'in the bundle sheath'], a.at(380, 190))}
    ${route(p, 'c', `M${f(from[0])},${f(from[1])}L${f(air[0] - 20)},${f(air[1] + 8)}`, 'fcc-thin')}
    ${kidAt(`${p}k3`, air, 6, { face: 'h', lab: 'CO₂', labDy: -17 })}
    ${resultL2(X, a.y + a.h + 34, ['about 1 in 4 recaptured,', 'the rest leaks away'])}
    ${gauge}${temCrowd(p, te)}${bar}
    ${credit(790, 583, `${it('Homolepis aturensis')} (C₂), ${it('Steinchisma laxum')} (C₃): ${CR_K16} (CC BY 3.0)`)}
    ${credit(790, 598, 'light micrographs: Fig. 1 · electron micrograph: Fig. 2A')}</g>
  `);
}
const s1 = (): string => sFig('s1');
const s2 = (): string => sFig('s2');

/* ---------- r2 · the evolutionary step: C₃ → C₃–C₄ intermediate (C₂, lit) → C₄ on top, the C₂ cell below ---------- */

function r2(): string {
  const p = 'fc11ar2', SW = 150, SY = 36, TW = 336, TY = 186;
  const win = (c: Pt): [number, number, number, number] => [c[0] - 360, c[1] - 240, 720, 480];
  const xs = [56, 325, 594];
  const a = shot(`${p}-a`, STE, xs[0], SY, SW, { win: win([490, 332]), r: 8 });
  const b = shot(`${p}-b`, HOM, xs[1], SY, SW, { win: win([488, 414]), r: 8 });
  const z = shot(`${p}-z`, ZEA, xs[2], SY, SW, { win: win([480, 370]), r: 8 });
  const TX = 400 - TW / 2;
  const te = shot(`${p}-t`, TEM, TX, TY, TW);
  const L = b.at(576, 252), lr = (88 * SW) / 720;
  const ym = SY + b.h / 2;
  return svg('Top, a row of three light micrographs of leaf cross-sections, arrows between them: C3 (Steinchisma), C3–C4 intermediate (C2, Homolepis aturensis), lit, and C4 (maize), each with its vein and bundle sheath. Under the C3 section a pill: about 1 in 4 recaptured. From a lens on a bundle-sheath cell of the C2 section, lines lead down to the electron micrograph of that cell, labelled: mitochondria on the vein-side wall, chloroplasts packed around them, a mesophyll cell, the vein at the lower left. An arrow leads from a mitochondrion to a CO2 character, labelled, held at a chloroplast, strained and sweating. Pill under it: most recaptured', `
    ${heads(p)}<g class="dk1 co2k">
    ${T(xs[0] + SW / 2, SY - 12, 'C₃', 'co2k-il')}${T(xs[1] + SW / 2, SY - 12, 'C₃–C₄ intermediate (C₂)', 'co2k-ilb')}${T(xs[2] + SW / 2, SY - 12, 'C₄', 'co2k-il')}
    ${route(p, 'k', `M${xs[0] + SW + 12},${f(ym)}H${xs[1] - 14}`, 'fcc-thin')}${route(p, 'k', `M${xs[1] + SW + 12},${f(ym)}H${xs[2] - 14}`, 'fcc-thin')}
    ${wedge(L, lr, [[TX, TY], [TX + TW, TY]])}
    <g opacity=".6">${a.svg}${z.svg}</g>
    ${te.svg}${b.svg}<rect class="fcca-hl" x="${f(b.x - 3)}" y="${f(b.y - 3)}" width="${SW + 6}" height="${f(b.h + 6)}" rx="10"/>
    <circle class="co2k-lens" cx="${f(L[0])}" cy="${f(L[1])}" r="${f(lr)}"/>
    ${result2(xs[0] + SW / 2, SY + a.h + 34, ['about 1 in 4', 'recaptured'])}
    ${temParts(p, te, 7, { vac: false, short: true })}
    ${result(400, TY + te.h + 26, 'most recaptured')}
    ${credit(790, 583, `${it('Steinchisma laxum')} (C₃), ${it('Homolepis aturensis')} (C₂): ${CR_K16}, Figs 1 and 2A (CC BY 3.0)`)}
    ${credit(790, 598, 'maize (C₄): Berkshire Community College Bioscience Image Library (CC0)')}</g>
  `);
}
