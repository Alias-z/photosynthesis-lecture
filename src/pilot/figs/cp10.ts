// Slide C10 (NEW, pick key C10n) · CO₂ diffusion pathway: boundary-layer, stomatal and mesophyll conductance in series
// (chunk cp, 28 Oct 2026). Facts used, and no others:
// - Fick: A = g_sc (Cₐ − Cᵢ) and A = g_m (Cᵢ − Cc); typical values at 25 °C Cₐ 420, Cᵢ 300, Cc 200 µmol mol⁻¹, g_sc 0.25,
//   g_m 0.3, g_bc 1–2.5 mol m⁻² s⁻¹ (Busch et al. 2024, Plant Cell Environ 47:3344, Table 1, Box 2, Eqs 10–11).
// - g_b rises with wind speed and falls with leaf size, g_b ∝ √(u/L) (Dupont et al. 2025, J Exp Bot 76:5791).
// - "plants lose ∼150 to >500 water molecules via stomatal transpiration for every CO2 molecule" (Verslues et al. 2023,
//   Plant Cell 35:67, section by Schroeder & Hsu); stomatal pores < 3 % of the leaf surface carry ≈ 98 % of the CO₂ and
//   water flux (Lawson & Blatt 2014, Plant Physiol 164:1556).
// - CO₂ diffuses 4 orders of magnitude slower in water than in air (Terashima et al. 2011, Plant Physiol 155:108).
// - Gaastra 1959: stomatal resistance falls with light; at high light r_me is 1–4 × r_s (turnip, Fig. 21 and text p. 54).
// Real images: Busch et al. 2024 Fig. 2 (CC BY); BCC Bioscience Image Library succulent leaf section (CC0); Dartmouth SEM
// stoma (public domain); Lundgren et al. 2019 Fig. 2a micro-CT (CC BY); Clarke et al. 2021 Fig. 1b, c TEM (CC BY);
// Dupont et al. 2025 Fig. 3 (CC BY); Du et al. 2020 Fig. 7 (CC BY); Gaastra 1959 Fig. 21. Credits: assets/SOURCES-cp.md.
import type { PlateText, Variant } from '../types';
import { arr, brace, co2, credit, f, h2o, it, pathSchema, pill, sb, shot, svg, SYM, T, TV, type Img, type Pt } from './cp-kit';
import succJpg from '../../assets/photos/cp-succulent-xs.jpg';
import buschJpg from '../../assets/photos/cp-busch-path.jpg';
import semJpg from '../../assets/photos/c7-stoma-sem.jpg';
import ctPng from '../../assets/photos/cp-lundgren-block.png';
import clbJpg from '../../assets/photos/cp-clarke-b.jpg';
import clcJpg from '../../assets/photos/cp-clarke-c.jpg';
import windJpg from '../../assets/photos/cp-dupont-wind.jpg';
import agsPng from '../../assets/photos/cp-du-ags.png';
import meso3dPng from '../../assets/photos/cp-own-meso3d.png';
import agmPng from '../../assets/photos/cp-du-agm.png';
import g21Png from '../../assets/photos/cp-gaastra-fig21.png';
import { along, chloroG, kidG } from '../anim/co2-kit';

const sub = (s: string): string => `<sub>${s}</sub>`;
const v = (s: string): string => `<i>${s.slice(0, 1)}</i>${sub(s.slice(1))}`;

export const PLATE: PlateText = {
  n: 'C10',
  pick: 'C10n',
  title: 'CO₂ uptake: from the air to RuBisCO',
  status: 'draft',
  // lecturer, 29 Oct 2026, late: "only the essential information, leave things clear" (the conductances, the ppm values
  // and A = g × ΔC stay on the animation's card)
  lead: 'RuBisCO uses up CO₂ in the chloroplast, so CO₂ diffuses in from the air, down its gradient.',
  points: [
    { claim: 'In through the stomata.', text: 'Water vapour leaves the same way' },
    { claim: 'Then through water to the chloroplast.', text: 'CO₂ dissolves in the wet cell wall and moves ≈ 10,000 × more slowly' },
    { claim: 'Each step lowers CO₂ at RuBisCO.', text: 'In heat and drought the stomata close' },
  ],
  refs: [
    { label: 'Busch et al. 2024', url: 'https://doi.org/10.1111/pce.14815' },
    { label: 'Gaastra 1959', url: 'https://edepot.wur.nl/291215' },
    { label: 'Terashima et al. 2011', url: 'https://doi.org/10.1104/pp.110.165472' },
    { label: 'Lawson & Blatt 2014', url: 'https://doi.org/10.1104/pp.114.237107' },
    { label: 'Verslues et al. 2023', url: 'https://doi.org/10.1093/plcell/koac263' },
    { label: 'Dupont et al. 2025', url: 'https://doi.org/10.1093/jxb/eraf325' },
  ],
};

// No picks exist for C10n (new slide). Ids v1–v12 are new.
export const VARIANTS: Variant[] = [
  { id: 'v1', name: 'Leaf section (micrograph) with the CO₂ path drawn on it' },
  { id: 'v2', name: 'Drawn path: boundary layer, stomata, mesophyll in series' },
  { id: 'v3', name: 'CO₂ concentration falls step by step (typical values)' },
  { id: 'v4', name: 'Busch et al. 2024 Fig. 2 + Cₐ, Cᵢ, Cc bars' },
  { id: 'v5', name: 'Three real images: stoma (SEM), air spaces (micro-CT), chloroplast at the wall (TEM)' },
  { id: 'v6', name: 'Gaastra 1959: the first three resistances measured (turnip)' },
  { id: 'v7', name: 'Mesophyll path in electron micrographs (tobacco)' },
  { id: 'v8', name: 'Wind thins the boundary layer (Dupont et al. 2025)' },
  { id: 'v9', name: 'CO₂ uptake rises with gₛ and gₘ (568 rice lines)' },
  { id: 'v10', name: 'One pore, two fluxes: CO₂ in, water vapour out' },
  { id: 'v11', name: 'Drawn path, stomata and water lit' },
  { id: 'v13', name: 'Own leaf in 3D: 22 serial sections (mesophyll cells and air spaces)' },
  { id: 'v12', name: 'Drawn path, mesophyll lit' },
  // lecturer, 29 Oct 2026, late: the 3D leaf with stomata and bundle sheath, no tissue names, the conductances marked on
  // the side along the CO₂'s journey (as in the MSc thesis, Fig. 3c); slide 19 lists only these three
  { id: 'n1', name: 'Own 3D leaf: the CO₂ journey, conductances on the side' },
  { id: 'n2', name: 'Own 3D leaf with the path’s slice enlarged, conductances on the side' },
  { id: 'n3', name: 'Own 3D leaf above, the journey in series below' },
];

const SUCC: Img = { href: succJpg, w: 1800, h: 1015 };
const BUSCH: Img = { href: buschJpg, w: 910, h: 1045 };
const SEM: Img = { href: semJpg, w: 760, h: 660 };
const CT: Img = { href: ctPng, w: 460, h: 385 };
const CLB: Img = { href: clbJpg, w: 446, h: 319 };
const CLC: Img = { href: clcJpg, w: 267, h: 319 };
const WIND: Img = { href: windJpg, w: 750, h: 509 };
const AGS: Img = { href: agsPng, w: 797, h: 728 };
const AGM: Img = { href: agmPng, w: 794, h: 728 };
const G21: Img = { href: g21Png, w: 1145, h: 1435 };
const CR = {
  succ: 'Succulent leaf, cross-section: Berkshire Community College Bioscience Image Library, CC0',
  busch: 'Busch et al. 2024, Plant Cell Environ 47:3344, Fig. 2 (part), CC BY 4.0',
  vals: 'typical values at 25 °C: Busch et al. 2024, Table 1',
  sem: 'tomato, SEM: Dartmouth EM Facility, public domain',
  ct: 'wheat, micro-CT: Lundgren et al. 2019, Nat Commun, Fig. 2a, CC BY 4.0',
  tem: 'tobacco, TEM: Clarke et al. 2021, Interface Focus, Fig. 1c, CC BY 4.0',
  clarke: 'tobacco leaf, TEM: Clarke et al. 2021, Interface Focus 11:20200040, Fig. 1b, c, CC BY 4.0',
  wind: 'Dupont et al. 2025, J Exp Bot 76:5791, Fig. 3, CC BY 4.0',
  du: 'Du et al. 2020, Plant Methods 16:6, Fig. 7, CC BY 4.0',
  g21: 'Gaastra 1959, Meded Landbouwhogeschool Wageningen 59(13), Fig. 21',
};
const { ca, cs, ci, cc, gb, gs, gm } = SYM;
const gcu = `${it('g')}${sb('c')}`; // cuticular conductance

/* v1 · light micrograph of a succulent leaf: two stomata over their substomatal chambers; the CO₂ path drawn from the
   outside air through the left stoma into the chamber and on to a chloroplast-lined cell wall. */
// Asset (1800 × 1015): left stoma, outer opening u 515 v 105–200; pore between the guard cells (522, 262); substomatal
// chamber u 470–600, v 320–700; chloroplasts lining a wall at (612, 650).
function v1(): string {
  const p = 'cp10v1';
  const a = shot(`${p}-a`, SUCC, 20, 18, 760, { band: CR.succ });
  const P = (u: number, w: number): Pt => a.at(u, w);
  const pts: Pt[] = [P(515, 20), P(516, 150), P(522, 262), P(528, 420), P(565, 560), P(606, 640)];
  const d = `M${f(pts[0][0])},${f(pts[0][1])} C${f(pts[1][0])},${f(pts[1][1])} ${f(pts[2][0])},${f(pts[2][1])} ${f(pts[3][0])},${f(pts[3][1])} S${f(pts[4][0])},${f(pts[4][1])} ${f(pts[5][0])},${f(pts[5][1])}`;
  const vy = 18 + a.h + 52;
  return svg(p, 'Light micrograph of a succulent leaf in cross-section: the upper epidermis with two stomata, each opening into a substomatal air chamber, and mesophyll cells whose walls are lined with chloroplasts. A drawn arrow follows carbon dioxide from the outside air through the left stoma into the air chamber and to a chloroplast at a cell wall. Below: typical concentrations at 25 degrees: outside air 420, air spaces 300, chloroplast 200 micromoles per mole.', `
    ${a.svg}
    <path class="fcp-ldh" d="${d}" style="stroke-width:9"/>${arr(p, 'co2', d, 'fcp-ar-big')}
    ${pill(P(250, 42)[0], P(250, 42)[1], `outside air · ${ca}`, { k: 'photo' })}
    ${pill(P(200, 300)[0], P(200, 300)[1], `stoma · ${gs}`, { k: 'photo', to: P(470, 250) })}
    ${pill(P(900, 380)[0], P(900, 380)[1], `air space · ${ci}`, { k: 'photo', to: P(585, 360) })}
    ${pill(P(900, 700)[0], P(900, 700)[1], `chloroplast · ${cc}`, { k: 'photo', to: P(612, 652) })}
    ${pill(P(200, 620)[0], P(200, 620)[1], `mesophyll · ${gm}`, { k: 'photo', to: P(598, 628) })}
    ${T(84, vy, ca, 'fcp-sym', 'middle')}${T(84, vy + 32, '430', 'fcp-s', 'middle')}
    ${arr(p, 'co2', `M120,${vy - 8} H330`)}
    ${T(376, vy, ci, 'fcp-sym', 'middle')}${T(376, vy + 32, '300', 'fcp-s', 'middle')}
    ${arr(p, 'co2', `M420,${vy - 8} H600`)}
    ${T(640, vy, cc, 'fcp-sym', 'middle')}${T(640, vy + 32, '200', 'fcp-s', 'middle')}
    ${T(780, vy + 32, 'ppm', 'fcp-s', 'end')}
    ${credit(780, 594, CR.vals)}
  `);
}

/* v2 · the drawn path (after Busch et al. 2024, Fig. 2) with every part lit and typical values */
function v2(): string {
  const p = 'cp10v2';
  return svg(p, 'Drawing of the carbon dioxide path from the outside air to the chloroplast, left to right: outside air, the boundary layer of still air, the stomatal pore between two guard cells, the intercellular air space, the cell wall and membranes, and the chloroplast stroma. Brackets mark the three conductances: boundary layer, stomata, mesophyll. Concentrations fall from Ca 420 to Ci 300 to Cc 200 micromoles per mole. Water vapour leaves along the same path in the opposite direction.', `
    ${pathSchema(p, { values: true })}
    ${credit(780, 594, `after Busch et al. 2024, Fig. 2; ${CR.vals}`)}
  `);
}

/* v11 · the same drawing with the stomata and the water leaving through them lit */
function v11(): string {
  const p = 'cp10v11';
  return svg(p, 'The drawn carbon dioxide path with the stomata lit: carbon dioxide enters through the pore between the guard cells while water vapour leaves through the same pore. The boundary layer and the mesophyll are dimmed.', `
    ${pathSchema(p, { values: true, lit: ['air', 'st', 'ias', 'h2o', 'co2'] })}
    ${credit(780, 594, `after Busch et al. 2024, Fig. 2; ${CR.vals}`)}
  `);
}

/* v12 · the same drawing with the mesophyll lit */
function v12(): string {
  const p = 'cp10v12';
  return svg(p, 'The drawn carbon dioxide path with the mesophyll lit: from the intercellular air space, at Ci, carbon dioxide crosses the cell wall, the membranes and the stroma to RuBisCO, at Cc. The boundary layer and the stomata are dimmed.', `
    ${pathSchema(p, { values: true, lit: ['ias', 'me', 'co2'] })}
    ${credit(780, 594, `after Busch et al. 2024, Fig. 2; ${CR.vals}`)}
  `);
}

/* v3 · CO₂ concentration along the path: flat in well-mixed air, falling across each conductance (typical values) */
function v3(): string {
  const p = 'cp10v3';
  const X0 = 110, X1 = 770, Y0 = 420, Y1 = 100, cmax = 450;
  const Y = (c: number): number => Y0 - (c / cmax) * (Y0 - Y1);
  // Zones (x): air | boundary layer | stomata | air space | cell wall, membranes, stroma | at RuBisCO.
  const z = [110, 185, 285, 375, 480, 690, 770];
  const cS = 405; // the boundary-layer drop is drawn small and given no value
  const line = `M${z[0]},${f(Y(430))} H${z[1]} L${z[2]},${f(Y(cS))} L${z[3]},${f(Y(300))} H${z[4]} L${z[5]},${f(Y(200))} H${z[6]}`;
  const zoneLab = (x0: number, x1: number, s: string, s2 = ''): string =>
    `${T((x0 + x1) / 2, Y0 + 32, s, 'fcp-s', 'middle')}${s2 ? T((x0 + x1) / 2, Y0 + 56, s2, 'fcp-s', 'middle') : ''}`;
  const shade = (x0: number, x1: number): string => `<rect class="fcp-stepfill" x="${x0}" y="${Y1 - 34}" width="${x1 - x0}" height="${Y0 - Y1 + 34}"/>`;
  const ticks = [0, 100, 200, 300, 400].map(c => `<path class="fcp-grid" d="M${X0},${f(Y(c))} H${X1}"/>${T(X0 - 10, Y(c) + 6, `${c}`, 'fcp-ax', 'end')}`).join('');
  const drop = (x: number, s: string): string => T(x, Y1 - 44, s, 'fcp-sym', 'middle');
  return svg(p, 'Graph: carbon dioxide concentration along the diffusion path: 420 micromoles per mole in the outside air, a small drop across the boundary layer, a drop to 300 across the stomata, flat in the air spaces, then a drop to 200 across the cell wall, membranes and stroma to RuBisCO. Each drop sits on one conductance: boundary layer, stomata, mesophyll.', `
    ${shade(z[1], z[2])}${shade(z[2], z[3])}${shade(z[4], z[5])}
    <path class="fcp-rule" d="M${z[2]},${Y1 - 34} V${Y0}"/>
    ${ticks}
    <path class="fcp-axis" d="M${X0},${Y1 - 34} V${Y0} H${X1}"/>
    ${TV(50, (Y0 + Y1) / 2, 'CO₂ (ppm)', 'fcp-ax')}
    <path class="fcp-step" d="${line}"/>
    ${drop((z[1] + z[2]) / 2, SYM.gb)}${drop((z[2] + z[3]) / 2, SYM.gs)}${drop((z[4] + z[5]) / 2, SYM.gm)}
    ${T((z[0] + z[1]) / 2, Y(430) - 14, ca, 'fcp-sym', 'middle')}
    ${T((z[3] + z[4]) / 2, Y(300) - 14, ci, 'fcp-sym', 'middle')}
    ${T((z[5] + z[6]) / 2, Y(200) - 14, cc, 'fcp-sym', 'middle')}
    ${zoneLab(z[0], z[1], 'air')}${zoneLab(z[1], z[2], 'boundary', 'layer')}${zoneLab(z[2], z[3], 'stomata')}
    ${zoneLab(z[3], z[4], 'air space')}${zoneLab(z[4], z[5], 'cell wall, membranes,', 'stroma')}${zoneLab(z[5], z[6], 'RuBisCO')}
    ${credit(780, 594, `${CR.vals}; boundary-layer drop drawn schematically`)}
  `);
}

/* v4 · Busch et al. 2024 Fig. 2 (left part, air to stroma) beside bars of the three concentrations */
// Asset (910 × 1045): Cₐ label (30, 640), Cᵢ (480, 635), Cc (845, 635); conductance brackets along the top.
function v4(): string {
  const p = 'cp10v4';
  const a = shot(`${p}-a`, BUSCH, 18, 12, 460, { fig: true });
  const bx = 560, by = 452, bh = (c: number): number => c * 0.95;
  const bar = (i: number, c: number, s: string): string => {
    const x = bx + i * 74;
    return `<rect class="fcp-bar-co2" x="${x}" y="${f(by - bh(c))}" width="48" height="${f(bh(c))}" rx="3" opacity="${1 - i * 0.22}"/>
      ${T(x + 24, by - bh(c) - 12, `${c}`, 'fcp-s', 'middle')}${T(x + 24, by + 34, s, 'fcp-sym', 'middle')}`;
  };
  return svg(p, 'Left: Busch and colleagues 2024, figure 2, the carbon dioxide path from the outside air (Ca) across the boundary layer and the epidermis with its stoma into the intercellular air space (Ci), then across the cell wall, plasma membrane and chloroplast membrane into the stroma (Cc); water vapour leaves the opposite way. Right: bars of typical concentrations at 25 degrees: 420, 300 and 200 micromoles per mole.', `
    ${a.svg}
    <path class="fcp-axis" d="M${bx - 16},${by} H${bx + 3 * 74 - 8}"/>
    ${bar(0, 430, ca)}${bar(1, 300, ci)}${bar(2, 200, cc)}
    ${T(bx + 103, by + 70, 'ppm, 25 °C', 'fcp-s', 'middle')}
    ${credit(780, 578, CR.busch)}${credit(780, 596, CR.vals)}
  `);
}

/* v5 · three real images along the path: the stoma (SEM, tomato), the air spaces (micro-CT, wheat), the chloroplast pressed
   against the cell wall (TEM, tobacco) */
function v5(): string {
  const p = 'cp10v5';
  const y = 110;
  const a = shot(`${p}-a`, SEM, 16, y, 246, { win: [175, 70, 460, 460] });
  const b = shot(`${p}-b`, CT, 288, y + 18, 246, { win: [6, 0, 448, 375] });
  const c = shot(`${p}-c`, CLC, 560, y - 30, 224, {});
  const lab = (x: number, yy: number, s: string, sym: string): string =>
    `${T(x, yy, s, 'fcp-h', 'middle')}${T(x, yy + 36, sym, 'fcp-sym', 'middle')}`;
  const ly = 440;
  return svg(p, 'Three real images along the carbon dioxide path. Left: scanning electron micrograph of a stoma on a tomato leaf. Middle: micro-computed tomography of a wheat leaf, the air space shown in yellow between the cells in green. Right: transmission electron micrograph of a tobacco mesophyll cell: cell wall, plasma membrane, a thin layer of cytosol and a chloroplast pressed against the wall. Labels: stoma, stomatal conductance; air spaces, Ci; cell wall to stroma, mesophyll conductance, Cc.', `
    ${T(16, 64, `outside air · ${ca}`, 'fcp-l')}${arr(p, 'co2', 'M60,76 V104')}
    ${a.svg}${b.svg}${c.svg}
    ${arr(p, 'co2', `M264,${y + 123} H284`)}${arr(p, 'co2', `M536,${y + 123} H556`)}
    ${lab(139, ly, 'stoma', gs)}${lab(411, ly, 'air spaces (yellow)', ci)}${lab(672, ly, 'wall → stroma', `${gm} · ${cc}`)}
    ${credit(16, 548, CR.sem, 'start')}${credit(16, 568, CR.ct, 'start')}${credit(16, 588, CR.tem, 'start')}
  `);
}

/* v6 · Gaastra 1959, Fig. 21: stomatal resistance against light, with columns for the mesophyll and outside-air resistances */
// Asset (1145 × 1435): y axis 0 at v 1345, 50 at v 40; x axis 0–25 (× 10⁴ erg s⁻¹ cm⁻²) u 150–815; r_me column dots u 905,
// v 1040–1350; r_a column bar at (1092, 1330).
function v6(): string {
  const p = 'cp10v6';
  const a = shot(`${p}-a`, G21, 26, 20, 432, { fig: true });
  const P = (u: number, w: number): Pt => a.at(u, w);
  return svg(p, 'Gaastra 1959, figure 21, turnip leaves in air with 0.03 percent carbon dioxide: the stomatal resistance to carbon dioxide falls steeply as light increases and levels off in bright light; beside it, separate columns give the mesophyll resistance, 1 to 4 times the stomatal resistance in bright light, and the small resistance of the outside air. Resistance is one over conductance.', `
    ${a.svg}
    ${T(640, 92, 'falls as light', 'fcp-s', 'middle')}${T(640, 116, 'opens the stomata', 'fcp-s', 'middle')}
    ${pill(640, 152, `stomata ${it('r')}${sb('s')}`, { to: P(185, 640) })}
    ${T(640, 262, 'bright light:', 'fcp-s', 'middle')}${T(640, 286, `1–4 × ${it('r')}${sb('s')}`, 'fcp-s', 'middle')}
    ${pill(640, 322, `mesophyll ${it('r')}${sb('me')}`, { to: P(905, 1060) })}
    ${pill(640, 420, `outside air ${it('r')}${sb('a')}`, { to: P(1100, 1320) })}
    ${pill(230, 566, 'light intensity →', {})}
    ${T(780, 512, `resistance ${it('r')} = 1 / ${it('g')}`, 'fcp-eq', 'end')}
    ${T(780, 546, 'turnip, 0.03 % CO₂', 'fcp-s', 'end')}
    ${credit(780, 594, CR.g21)}
  `);
}

/* v7 · Clarke et al. 2021: TEM of a tobacco leaf from the stoma into a mesophyll cell, the boxed wall enlarged, and the
   layers it shows redrawn in a row at reading size */
// b asset (446 × 319): stoma (40–110, 150–220), box at (207–233, 150–176); c asset (267 × 319): cell wall x ≈ 80,
// chloroplast x 105–250, stroma at (170, 200); the authors' labels on its left.
function v7(): string {
  const p = 'cp10v7';
  const b = shot(`${p}-b`, CLB, 20, 30, 490, {});
  const c = shot(`${p}-c`, CLC, 540, 30, 240, {});
  const B = (u: number, w: number): Pt => b.at(u, w), Cn = (u: number, w: number): Pt => c.at(u, w);
  const bx0 = B(207, 150), bx1 = B(234, 177);
  // the row of layers, air space to stroma (the plasma membrane and the chloroplast envelope as 'membranes')
  const ry = 470, xs = [40, 250, 450, 652], ws = [121, 106, 118, 81];
  const names = ['air space', 'cell wall', 'membranes', 'stroma'];
  const row = names.map((s, i) => T(xs[i], ry, s, i === 0 || i === 3 ? 'fcp-h' : 'fcp-l', 'start')).join('')
    + [0, 1, 2].map(i => arr(p, 'co2', `M${xs[i] + ws[i] + 18},${ry - 7} H${xs[i + 1] - 16}`)).join('');
  return svg(p, 'Transmission electron micrographs of a tobacco leaf, Clarke and colleagues 2021. Left: a stoma opens into the intercellular air space, bordered by mesophyll cells; a box marks one stretch of cell wall. Right: that stretch enlarged: cell wall, plasma membrane, a thin layer of cytosol, the chloroplast envelope and the stroma. Below, the same layers in a row from the air space at Ci to the stroma at Cc, spanned by the mesophyll conductance.', `
    ${b.svg}${c.svg}
    <path class="fcp-zoom" d="M${f(bx1[0])},${f(bx0[1])} L540,30 M${f(bx1[0])},${f(bx1[1])} L540,${f(30 + c.h)}"/>
    ${pill(B(150, 280)[0], B(150, 280)[1], `stoma · ${gs}`, { k: 'photo', to: B(98, 196) })}
    ${row}
    ${T(100, ry + 38, ci, 'fcp-sym', 'middle')}${T(692, ry + 38, cc, 'fcp-sym', 'middle')}
    ${brace(242, 738, ry - 46, '', 'fcp-h')}${T(475, ry - 64, `mesophyll conductance ${gm}`, 'fcp-h', 'middle')}
    ${credit(780, 594, CR.clarke)}
  `);
}

/* v8 · Dupont et al. 2025 Fig. 3: CO₂ concentration in a leaf section at low and high wind speed */
function v8(): string {
  const p = 'cp10v8';
  const a = shot(`${p}-a`, WIND, 30, 70, 740, { fig: true });
  return svg(p, 'Dupont and colleagues 2025, figure 3: two drawn leaf sections coloured by carbon dioxide concentration, from 420 (red) to 270 micromoles per mole (white). At low wind speed, about 0.15 metres per second, the boundary layer above the leaf is thick and the concentration has already fallen at the leaf surface (Cs) and inside (Ci); at high wind speed, about 1 metre per second, the boundary layer is thin and more carbon dioxide reaches the leaf.', `
    ${a.svg}
    ${pill(190, 40, 'thick boundary layer', { k: 'paper' })}
    ${pill(505, 40, 'thin boundary layer', { k: 'paper' })}
    ${credit(780, 594, CR.wind)}
  `);
}

/* v9 · Du et al. 2020 Fig. 7: net CO₂ uptake against stomatal and against mesophyll conductance in 568 rice lines */
function v9(): string {
  const p = 'cp10v9';
  const a = shot(`${p}-a`, AGS, 18, 120, 374, { fig: true });
  const b = shot(`${p}-b`, AGM, 408, 120, 374, { fig: true });
  return svg(p, 'Du and colleagues 2020, figure 7: net carbon dioxide uptake A of 568 rice lines plotted against their stomatal conductance (left) and against their mesophyll conductance (right); in both, lines with a higher conductance take up more carbon dioxide.', `
    ${T(205, 78, `stomatal conductance ${gs}`, 'fcp-h', 'middle')}
    ${T(595, 78, `mesophyll conductance ${gm}`, 'fcp-h', 'middle')}
    ${a.svg}${b.svg}
    ${pill(400, 500, 'each circle: one rice line', { k: 'paper' })}
    ${credit(780, 594, CR.du)}
  `);
}

/* v10 · one stoma in section: CO₂ diffuses in while water vapour diffuses out of the saturated air space */
function v10(): string {
  const p = 'cp10v10';
  const cx = 300, yE = 300; // pore centre
  const epi = `
    <rect class="fcp-epi" x="40" y="${yE - 26}" width="${cx - 56 - 40}" height="52" rx="16"/>
    <rect class="fcp-epi" x="${cx + 56}" y="${yE - 26}" width="${560 - cx - 56}" height="52" rx="16"/>
    <ellipse class="fcp-guard" cx="${cx - 36}" cy="${yE}" rx="30" ry="34"/>
    <ellipse class="fcp-guard" cx="${cx + 36}" cy="${yE}" rx="30" ry="34"/>`;
  const inside = `<rect class="fcp-ias" x="40" y="${yE + 26}" width="520" height="230" rx="6"/>
    <ellipse class="fcp-cell" cx="110" cy="${yE + 200}" rx="62" ry="44"/><ellipse class="fcp-cell" cx="480" cy="${yE + 190}" rx="70" ry="48"/>`;
  const outsideW = [[90, 140], [470, 100], [520, 220]].map(([x, y]) => h2o(x, y)).join('');
  const insideW = [[180, 370], [240, 430], [350, 380], [410, 440], [450, 360], [170, 460], [300, 500], [390, 510], [220, 370], [470, 430], [500, 380], [120, 380]]
    .map(([x, y]) => h2o(x, y)).join('');
  const outsideC = [[150, 90], [470, 236], [110, 210], [520, 150]].map(([x, y]) => co2(x, y, 10)).join('');
  const insideC = [[230, 520], [440, 520]].map(([x, y]) => co2(x, y, 10)).join('');
  return svg(p, 'Drawing of one stoma in cross-section between outside air above and the leaf air space below. Carbon dioxide diffuses in through the pore, from the outside air where it is more concentrated; water vapour diffuses out through the same pore, from the air space, which is saturated with water vapour, to the drier outside air.', `
    ${inside}${epi}${outsideW}${insideW}${outsideC}${insideC}
    ${arr(p, 'co2', `M${cx - 9},120 V${yE + 120}`, 'fcp-ar-big')}
    ${arr(p, 'h2o', `M${cx + 11},${yE + 120} V120`, 'fcp-ar-big')}
    ${T(620, 132, 'outside air', 'fcp-h')}${T(620, 162, 'drier', 'fcp-s')}
    ${T(620, 300, 'stoma', 'fcp-h')}${T(620, 330, 'one pore', 'fcp-s')}
    ${T(620, 450, 'air space', 'fcp-h')}${T(620, 480, 'saturated with', 'fcp-s')}${T(620, 504, 'water vapour', 'fcp-s')}
    ${T(cx - 24, 160, 'CO₂ in', 'fcp-c', 'end')}${T(cx + 26, 160, 'H₂O out', 'fcp-w')}
  `);
}

/* v13 · the lecturer's own leaf in 3D: a surface model from 22 serial sections (mesophyll cells, air spaces between them) */
const MESO3D: Img = { href: meso3dPng, w: 1048, h: 1204 };
function v13(): string {
  const r = shot('cp10v13', MESO3D, 60, 12, 492, { fig: true });
  return svg('cp10v13', 'Three-dimensional surface model of a leaf piece, built from 22 serial sections: upper and lower epidermis in grey, mesophyll cells in green, the vein in grey in the middle, and the air spaces between the cells through which CO2 diffuses.', `
    ${r.svg}
    ${pill(690, 64, 'upper epidermis', { to: r.at(640, 140) })}
    ${pill(690, 176, 'palisade mesophyll', { to: r.at(820, 420) })}
    ${pill(690, 288, 'air spaces', { to: r.at(888, 470) })}
    ${pill(690, 368, 'vein', { to: r.at(800, 760) })}
    ${pill(690, 448, 'spongy mesophyll', { to: r.at(880, 920) })}
    ${pill(690, 528, 'lower epidermis', { to: r.at(760, 1050) })}
    ${credit(794, 594, '3D model from own serial sections (22 sections, Hp rep2 I)')}`);
}

/* ================ n1–n3 · the CO₂ journey on the lecturer's own 3D leaf (lecturer, 29 Oct 2026, late) ================
   "the leaf in 3D … it has to have stomata there, bundle sheath there … not to label palisade or spongy cells … label
   boundary layer conductance, stomatal conductance, cuticle conductance, mesophyll conductance … the exact same CO₂
   molecule we showed in the animation, passing through the whole journey". After the lecturer's MSc thesis (UCPH 2021),
   Fig. 3c, p. 10: the CO₂ from the air to the chloroplast, the resistances marked on the side in order along the path.
   The render (MESO3D) shows the epidermes, the mesophyll and 2 vein faces, but no stomata (the surface model does not
   resolve the pores) and no separate bundle sheath (the masks have no bundle-sheath label). Drawn over it, in render
   pixels: 2 stomata in the lower epidermis (slice 22 of the same series has 2 stomata there, circled by the lecturer;
   their places on the render are schematic); a ring of bundle-sheath cells round each vein face (outlines traced from the
   render's grey faces, scratchpad tools/veins.py); the cuticle along the lower surface; the boundary layer below it.
   Path: the outside air below the leaf, the boundary layer, a stoma, the substomatal air space, the air spaces up to a
   cell wall (darker green on the render: air space, cells seen behind it), the wet wall, a chloroplast against it.
   The CO₂ character is the animation's (anim/co2-kit.ts kidG), with the face the animation gives it at each place
   (lf10-common.ts mood(): strained where it is slow, sweating in the stoma and the wall, glad in the air spaces; the
   water shell from the wet wall on). */

/** The two vein faces on the render (pixels), traced from its grey faces. */
const VEIN: Pt[][] = [
  [[552, 704], [558, 720], [564, 738], [567, 759], [564, 782], [565, 815], [541, 825], [515, 823], [491, 813], [472, 803], [454, 804], [436, 802], [422, 791], [419, 767], [422, 746], [411, 739], [397, 732], [382, 720], [376, 704], [367, 686], [363, 665], [358, 639], [361, 611], [388, 605], [422, 619], [442, 622], [453, 598], [472, 595], [491, 595], [506, 611], [517, 626], [531, 633], [556, 634], [563, 651], [554, 674], [551, 690]],
  [[936, 761], [949, 781], [947, 802], [938, 820], [929, 840], [896, 833], [872, 824], [868, 850], [852, 852], [836, 881], [816, 871], [798, 865], [783, 853], [771, 838], [775, 812], [782, 792], [775, 784], [760, 775], [751, 761], [757, 748], [725, 697], [721, 665], [760, 672], [791, 683], [800, 665], [817, 655], [836, 650], [854, 656], [872, 662], [883, 679], [888, 699], [886, 719], [884, 733], [884, 744], [925, 746]],
];
/** The leaf's lower surface on the render's front face (the lowest opaque pixel of each column). */
const LOW: Pt[] = [[50, 1015], [84, 1015], [124, 1015], [164, 1017], [204, 1006], [244, 1014], [284, 1027], [324, 1056], [364, 1066], [404, 1075], [444, 1081], [484, 1085], [524, 1092], [564, 1092], [604, 1098], [644, 1101], [684, 1112], [724, 1127], [764, 1141], [804, 1152], [844, 1153], [884, 1155], [924, 1165], [964, 1175], [990, 1168]];
/** Stoma centres in the lower epidermis (render pixels): the one on the path, and one more. */
const STOMA: Pt[] = [[165, 992], [640, 1078]];
/** The path (render pixels): air, boundary layer, stoma, air space, a bend through the air spaces, wet wall, chloroplast
 *  (n1, n3: a palisade cell; its wall faces the air channel at u 213). */
const PATH: Pt[] = [[165, 1250], [165, 1105], [165, 992], [172, 900], [175, 760], [240, 600], [196, 470]];
const EPI = { in: 968, out: 1017 }; // the lower epidermis at the path's stoma (render v)

type At = (u: number, w: number) => Pt;
const sty = (s: string): string => ` style="${s}"`;
/** A smooth open curve through q (Catmull–Rom as cubic Béziers). */
function smooth(q: Pt[]): string {
  let d = `M${f(q[0][0])},${f(q[0][1])}`;
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}
/** The point at distance d before b on the way from a. */
const short = (a: Pt, b: Pt, d: number): Pt => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [b[0] - ((b[0] - a[0]) * d) / L, b[1] - ((b[1] - a[1]) * d) / L]; };

/** The animation's CO₂ character, standing still at `at`: one face (n neutral, s strained, h glad), sweat, water shell,
 *  squeeze, and an optional name above it. */
interface Look { face?: 'n' | 's' | 'h'; sweat?: number; shell?: boolean; sx?: number; sy?: number; lab?: string }
function kidAt(k: string, at: Pt, r: number, m: Look = {}): string {
  let s = kidG(k, r, m.lab ?? '', -r - 12).replace(' data-actor="1" display="none"', ` transform="translate(${f(at[0])} ${f(at[1])})"`);
  const set = (part: string, o: number): void => {
    if (o < 1) s = s.replace(`<g data-k="${k}-${part}">`, `<g data-k="${k}-${part}"${o <= 0 ? ' display="none"' : ` opacity="${o}"`}>`);
  };
  const face = m.face ?? 'n';
  set('fn', face === 'n' ? 1 : 0); set('fs', face === 's' ? 1 : 0); set('fh', face === 'h' ? 1 : 0);
  set('sw', m.sweat ?? 0); set('sh', m.shell ? 1 : 0);
  if ((m.sx ?? 1) !== 1 || (m.sy ?? 1) !== 1) s = s.replace(`<g data-k="${k}-b">`, `<g data-k="${k}-b" transform="scale(${m.sx ?? 1} ${m.sy ?? 1})">`);
  return s;
}
/** The six looks along the journey (lf10-common.ts: speed 1 in air, 0.22 in the boundary layer, 0.13 in the pore, 1 in
 *  the air spaces (glad), 0.12 in the wet wall, 0.4 in the stroma; the shell from the wall on). */
const LOOKS: Look[] = [{}, { face: 's', sweat: 0.5 }, { face: 's', sweat: 1, sx: 0.55, sy: 1.08 }, { face: 'h' }, { face: 's', sweat: 1, shell: true }, { shell: true }];
const kids = (p: string, pts: Pt[], r: number, looks: Look[] = LOOKS, labs: string[] = ['CO₂']): string =>
  `<g class="dk1 co2k">${pts.map((q, i) => kidAt(`${p}k${i}`, q, r, { ...looks[i], lab: labs[i] ?? looks[i].lab })).join('')}</g>`;

/** A stoma in cross-section on the front face: two guard cells and the pore between them (sc: scale). */
function stomaG(c: Pt, sc: number, pore = true): string {
  const rx = 8 * sc, ry = 11 * sc, pg = 3.5 * sc;
  const gc = (sg: number): string => {
    const x = c[0] + sg * (pg + rx);
    return `<ellipse cx="${f(x)}" cy="${f(c[1])}" rx="${f(rx)}" ry="${f(ry)}"${sty(`fill:#dbe8c6;stroke:#8f9f6a;stroke-width:${f(Math.max(1, 0.18 * sc))}`)}/>
      <path d="M${f(x - sg * rx * 0.72)},${f(c[1] - ry * 0.62)} Q${f(x - sg * rx * 1.02)},${f(c[1])} ${f(x - sg * rx * 0.72)},${f(c[1] + ry * 0.62)}"${sty(`fill:none;stroke:#7d8c58;stroke-width:${f(Math.max(1.2, 0.34 * sc))};stroke-linecap:round`)}/>
      <circle cx="${f(x + sg * rx * 0.2)}" cy="${f(c[1] - ry * 0.3)}" r="${f(1.5 * sc)}" fill="#9fbf6e"/><circle cx="${f(x + sg * rx * 0.25)}" cy="${f(c[1] + ry * 0.32)}" r="${f(1.5 * sc)}" fill="#9fbf6e"/>`;
  };
  return `${pore ? `<rect x="${f(c[0] - pg)}" y="${f(c[1] - ry)}" width="${f(2 * pg)}" height="${f(2 * ry)}" fill="#eef3f5"/>` : ''}${gc(-1)}${gc(1)}`;
}
/** Bundle-sheath cells round each vein face, and the cuticle along the lower surface (k: figure units per pixel). */
function sheathG(at: At, k: number): string {
  return VEIN.map(q => along(q, 36, -15).map(({ p, a }) => {
    const c = at(p[0], p[1]);
    return `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(17 * k)}" ry="${f(11.5 * k)}" transform="rotate(${f((a * 180) / Math.PI)} ${f(c[0])} ${f(c[1])})"${sty(`fill:#c9dcae;stroke:#557a30;stroke-width:${f(Math.max(0.8, 2.4 * k))}`)}/>`;
  }).join('')).join('');
}
const cuticleG = (at: At, k: number, pts: Pt[] = LOW): string =>
  `<path d="${pts.map((q, i) => `${i ? 'L' : 'M'}${f(at(q[0], q[1])[0])},${f(at(q[0], q[1])[1])}`).join(' ')}"${sty(`fill:none;stroke:#b9a26b;stroke-width:${f(Math.max(2, 6 * k))};stroke-linecap:round;stroke-linejoin:round`)}/>`;
/** The boundary layer below the lower surface: pale air, its outer edge dashed (as in the animation). */
function blG(p: string, at: At, d: number, pts: Pt[] = LOW): string {
  const top = pts.map(q => at(q[0], q[1])), bot = [...top].reverse().map(q => [q[0], q[1] + d] as Pt);
  const poly = [...top, ...bot].map((q, i) => `${i ? 'L' : 'M'}${f(q[0])},${f(q[1])}`).join(' ');
  return `<defs><linearGradient id="${p}-bl" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d5e4ec"/><stop offset="1" stop-color="#d5e4ec" stop-opacity=".15"/></linearGradient></defs>
    <path d="${poly}Z" fill="url(#${p}-bl)"/>
    <path d="${bot.map((q, i) => `${i ? 'L' : 'M'}${f(q[0])},${f(q[1])}`).join(' ')}"${sty('fill:none;stroke:#c2401f;stroke-width:2;stroke-dasharray:7 6')}/>`;
}
/** The wet wall (a water film on its air-facing side) and a chloroplast against it. */
const filmG = (q: Pt[], w: number): string => `<path d="${smooth(q)}"${sty(`fill:none;stroke:#a9cde4;stroke-width:${f(w)};stroke-linecap:round`)}/>`;
const cpG = (c: Pt, a: number, w: number, h: number): string => `<g class="co2k">${chloroG(c, a, w, h)}</g>`;

/** Conductance labels: words, then the symbol (the animation's blue). */
const gL = (x: number, y: number, s: string, a: A2 = 'start', size = 18): string =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="${a}"${sty(`font-size:${size}px;font-weight:600;fill:#2457a8`)}>${s}</text>`;
type A2 = 'start' | 'middle' | 'end';
/** A vertical bracket at x over [y0, y1], its ticks towards dir (−1 left, +1 right). */
const vBr = (x: number, y0: number, y1: number, dir: 1 | -1): string =>
  `<path class="fcp-brace" d="M${f(x + dir * 10)},${f(y0 + 1.5)} H${f(x)} V${f(y1 - 1.5)} H${f(x + dir * 10)}"/>`;
/** A horizontal bracket over [x0, x1] at y, its ticks towards dir (+1 down, −1 up). */
const hBr = (x0: number, x1: number, y: number, dir: 1 | -1): string =>
  `<path class="fcp-brace" d="M${f(x0 + 1.5)},${f(y + dir * 10)} V${f(y)} H${f(x1 - 1.5)} V${f(y + dir * 10)}"/>`;
const level = (x0: number, x1: number, y: number): string => `<path d="M${f(x0)},${f(y)} H${f(x1)}"${sty('fill:none;stroke:#8a877d;stroke-width:1.2;stroke-dasharray:3 5')}/>`;
const CR3D = ['3D model from own serial sections (22 sections, Hp rep2 I);', 'stomata and bundle sheath drawn in'];
const cuticleArrow = (p: string, x: number, y0: number, y1: number): string => arr(p, 'co2', `M${f(x)},${f(y0)} V${f(y1)}`, 'fcp-ar-dash');

/* n1 · the whole block, the path drawn through it, the conductances in brackets on the right at the path's levels */
function n1(): string {
  const p = 'cp10n1', K = 0.44;
  const r = shot(`${p}-a`, MESO3D, 14, 8, 1048 * K, { fig: true });
  const at = r.at;
  const P = PATH.map(q => at(q[0], q[1]));
  const yIn = at(0, EPI.in)[1], yOut = at(0, EPI.out)[1], blD = 60, yBl = yOut + blD;
  const st = at(STOMA[0][0], STOMA[0][1]);
  const route = smooth([P[0], P[1], P[2], P[3], P[4], P[5], short(P[5], P[6], 26)]);
  const X = 500;
  return svg(p, 'The lecturer’s own three-dimensional leaf piece, from 22 serial sections, with two stomata drawn in the lower epidermis, a ring of bundle-sheath cells round each vein and the cuticle along the lower surface. The same carbon dioxide character as in the animation travels up from below the leaf: in the outside air; strained in the boundary layer; squeezed in a stomatal pore; glad in the air space above it; dissolved with a water shell at a wet cell wall; at a chloroplast against that wall. A thin dashed arrow crosses the cuticle beside the stoma. Brackets on the right mark each stretch of the path: mesophyll conductance, from the air spaces to the chloroplast; stomatal and, beside it, cuticular conductance, across the epidermis; boundary-layer conductance, below the leaf.', `
    ${blG(p, at, blD)}
    ${r.svg}
    ${sheathG(at, K)}${cuticleG(at, K)}${stomaG(at(STOMA[1][0], STOMA[1][1]), 2.27 * K)}${stomaG(st, 1.3)}
    ${filmG([at(213, 420), at(212, 520), at(214, 640)], 4)}${cpG(P[6], 0, 88, 30)}
    ${cuticleArrow(p, at(272, 0)[0], yOut + 22, yIn - 16)}
    ${level(P[6][0] + 36, X - 14, P[6][1])}${level(st[0] + 40, X - 14, yIn)}${level(st[0] + 40, X - 14, yOut)}${level(P[1][0] + 40, X - 14, yBl)}
    ${arr(p, 'co2', route, 'fcp-ar-dash')}
    ${kids(p, [P[0], P[1], P[2], P[3], P[5], P[6]], 11)}
    ${vBr(X, P[6][1], yIn, -1)}${gL(X + 16, (P[6][1] + yIn) / 2 + 6, `mesophyll conductance (${gm})`, 'start', 17)}
    ${vBr(X, yIn, yOut, -1)}${gL(X + 16, yIn + 7, `stomatal conductance (${gs})`, 'start', 17)}${gL(X + 16, yIn + 30, `cuticular conductance (${gcu})`, 'start', 17)}
    ${vBr(X, yOut, yBl, -1)}${gL(X + 16, yOut + 38, 'boundary-layer', 'start', 17)}${gL(X + 16, yOut + 60, `conductance (${gb})`, 'start', 17)}
    ${credit(794, 556, CR3D[0])}${credit(794, 575, CR3D[1])}`);
}

/* n2 · the path's slice of the block cut out and enlarged in front of it; the conductances in brackets on the left */
function n2(): string {
  const p = 'cp10n2', K = 1.1, W0: [number, number, number, number] = [110, 700, 220, 365];
  const s = shot(`${p}-s`, MESO3D, 266, 14, W0[2] * K, { fig: true, win: W0 });
  const b = shot(`${p}-b`, MESO3D, 526, 30, 268, { fig: true });
  const at = s.at, kb = 268 / 1048;
  // this slice's path: stoma, the substomatal air space, the wet wall of a spongy cell, a chloroplast against it
  const P: Pt[] = [[0, 0], [0, 0], at(165, 992), at(170, 930), at(186, 860), at(214, 795)];
  const yIn = at(0, EPI.in)[1], yOut = at(0, EPI.out)[1], blD = 80, yBl = yOut + blD;
  P[1] = [P[2][0], yOut + 42]; P[0] = [P[2][0], yBl + 58];
  const low: Pt[] = [[110, 1015], ...LOW.filter(q => q[0] > 110 && q[0] < 330), [330, 1058]];
  const route = smooth([P[0], P[1], P[2], P[3], short(P[3], P[4], 30)]);
  const route2 = smooth([P[4], short(P[4], P[5], 34)]);
  const X = 254;
  const r0 = b.at(W0[0], W0[1]), r1 = b.at(W0[0] + W0[2], W0[1] + W0[3]);
  const sR = [266, 14, 266 + W0[2] * K, 14 + W0[3] * K];
  return svg(p, 'Right: the lecturer’s own three-dimensional leaf piece, from 22 serial sections, with two stomata drawn in the lower epidermis and a ring of bundle-sheath cells round each vein; a box marks a slice of it from the lower surface up into the mesophyll. Middle: that slice enlarged. The same carbon dioxide character as in the animation travels up through it: in the outside air below the leaf; strained in the boundary layer; squeezed in the stomatal pore between two guard cells; glad in the air space above; dissolved with a water shell at the wet wall of a mesophyll cell; at a chloroplast against that wall. A thin dashed arrow crosses the cuticle beside the stoma. Left: brackets at the same heights mark mesophyll conductance, stomatal and cuticular conductance, and boundary-layer conductance.', `
    <defs><clipPath id="${p}-sc"><rect x="${f(sR[0])}" y="${f(sR[1])}" width="${f(sR[2] - sR[0])}" height="${f(sR[3] - sR[1])}"/></clipPath></defs>
    ${blG(p, at, blD, low)}
    ${b.svg}${sheathG(b.at, kb)}${cuticleG(b.at, kb)}${STOMA.map(q => stomaG(b.at(q[0], q[1]), 2.27 * kb)).join('')}
    <rect x="${f(r0[0])}" y="${f(r0[1])}" width="${f(r1[0] - r0[0])}" height="${f(r1[1] - r0[1])}"${sty('fill:none;stroke:#9a4426;stroke-width:1.8')}/>
    <path d="M${f(r0[0])},${f(r0[1])} L${f(sR[2])},${f(sR[1])} M${f(r0[0])},${f(r1[1])} L${f(sR[2])},${f(sR[3])}"${sty('fill:none;stroke:#9a4426;stroke-width:1.2;stroke-dasharray:5 5')}/>
    ${s.svg}
    <g clip-path="url(#${p}-sc)">${cuticleG(at, K, low)}</g>
    ${stomaG(P[2], 2.27 * K)}
    ${filmG([at(201, 762), at(201, 800), at(203, 840), at(209, 866)], 6)}${cpG(P[5], Math.PI / 2 - 0.08, 84, 34)}
    ${cuticleArrow(p, at(282, 0)[0], at(0, 1046)[1], at(0, 962)[1])}
    ${arr(p, 'co2', route, 'fcp-ar-dash')}${arr(p, 'co2', route2, 'fcp-ar-dash')}
    ${kids(p, P, 12)}
    ${vBr(X, P[5][1], yIn, 1)}${gL(X - 14, (P[5][1] + yIn) / 2 + 6, `mesophyll conductance (${gm})`, 'end', 17)}
    ${vBr(X, yIn, yOut, 1)}${gL(X - 14, yIn + 22, `stomatal conductance (${gs})`, 'end', 17)}${gL(X - 14, yIn + 46, `cuticular conductance (${gcu})`, 'end', 17)}
    ${vBr(X, yOut, yBl, 1)}${gL(X - 14, yOut + 36, 'boundary-layer', 'end', 17)}${gL(X - 14, yOut + 58, `conductance (${gb})`, 'end', 17)}
    ${credit(794, 572, CR3D[0])}${credit(794, 591, CR3D[1])}`);
}

/* n3 · the block small above, its path numbered; below, the same journey in a straight strip, the conductances in series */
function n3(): string {
  const p = 'cp10n3', K = 0.28;
  const r = shot(`${p}-a`, MESO3D, 253, 2, 1048 * K, { fig: true });
  const at = r.at;
  const B = [at(165, 1140), at(165, 1062), ...PATH.slice(2).map(q => at(q[0], q[1]))];
  const Bp: Pt[] = [B[0], B[1], B[2], B[3], B[5], B[6]];
  const dots = Bp.map((q, i) => `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="9"${sty('fill:#fffdf8;stroke:#3d3d3a;stroke-width:1.6')}/><text x="${f(q[0])}" y="${f(q[1] + 4.6)}" text-anchor="middle"${sty('font-size:13px;font-weight:700;fill:#141413')}>${i + 1}</text>`).join('');
  // the strip: outside air | boundary layer | epidermis (pore; cuticle below it) | air space | wet wall | cell with a chloroplast
  const yT = 410, yB = 520, yM = 455, yC = 507;
  const Z = [12, 130, 250, 310, 480, 562, 788];
  const gcY = 15, gap = 11;
  const epi = `<rect x="${Z[2]}" y="${yT}" width="${Z[3] - Z[2]}" height="${yB - yT}"${sty('fill:#f8f6ee;stroke:#c9b98f;stroke-width:1.6')}/>
    <rect x="${Z[2] - 1}" y="${yM - gap}" width="${Z[3] - Z[2] + 2}" height="${2 * gap}" fill="#eef3f5"/>
    <path d="M${Z[2] + 1},${yT} V${yM - gap} M${Z[2] + 1},${yM + gap} V${yB}"${sty('fill:none;stroke:#b9a26b;stroke-width:4;stroke-linecap:round')}/>
    ${[-1, 1].map(sg => { const cy = yM + sg * (gap + gcY); return `<ellipse cx="${(Z[2] + Z[3]) / 2}" cy="${cy}" rx="26" ry="${gcY}"${sty('fill:#dbe8c6;stroke:#8f9f6a;stroke-width:1.6')}/><path d="M${(Z[2] + Z[3]) / 2 - 17},${f(cy - sg * gcY * 0.72)} Q${(Z[2] + Z[3]) / 2},${f(cy - sg * gcY * 1.05)} ${(Z[2] + Z[3]) / 2 + 17},${f(cy - sg * gcY * 0.72)}"${sty('fill:none;stroke:#7d8c58;stroke-width:3;stroke-linecap:round')}/>`; }).join('')}
    <path d="M${Z[2] + 8},${yB - 0.5} H${Z[3] - 8}"${sty('fill:none;stroke:#c9b98f;stroke-width:1.2')}/>`;
  const wallX = [Z[4], Z[4] + 14, Z[5] - 10];
  const wave = Array.from({ length: 11 }, (_, i) => `Q${f(wallX[1] + 5 * (i % 2 ? 1 : -1))},${f(yT + (i + 0.5) * 10)} ${f(wallX[1])},${f(yT + (i + 1) * 10)}`).join(' ');
  const wall = `<rect x="${wallX[1]}" y="${yT}" width="${wallX[2] - wallX[1]}" height="${yB - yT}" fill="#ece2c8"/>
    ${Array.from({ length: 5 }, (_, i) => `<path d="M${wallX[1] + 8},${yT + 14 + i * 22} q8,-5 16,0 t16,0 t16,0"${sty('fill:none;stroke:#d2c39c;stroke-width:1.6;stroke-linecap:round')}/>`).join('')}
    <path d="M${wallX[0]},${yT} H${wallX[1]} ${wave} H${wallX[0]} Z" fill="#a9cde4"/>
    <rect x="${wallX[2]}" y="${yT}" width="${Z[6] - wallX[2]}" height="${yB - yT}" fill="#fbf9f2"/>
    <path d="M${wallX[2] + 3},${yT} V${yB}"${sty('fill:none;stroke:#a88f52;stroke-width:2')}/>`;
  const strip = `<rect x="${Z[0]}" y="${yT}" width="${Z[1] - Z[0]}" height="${yB - yT}" fill="#fbfaf6"/>
    <defs><linearGradient id="${p}-bl" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#d5e4ec" stop-opacity=".15"/><stop offset="1" stop-color="#d5e4ec"/></linearGradient></defs>
    <rect x="${Z[1]}" y="${yT}" width="${Z[2] - Z[1]}" height="${yB - yT}" fill="url(#${p}-bl)"/>
    <path d="M${Z[1]},${yT} V${yB}"${sty('fill:none;stroke:#c2401f;stroke-width:2;stroke-dasharray:7 6')}/>
    <rect x="${Z[3]}" y="${yT}" width="${Z[4] - Z[3]}" height="${yB - yT}" fill="#eef3f5"/>
    ${wall}${epi}
    ${cpG([686, yM], 0, 176, 72)}
    <rect x="${Z[0]}" y="${yT}" width="${Z[6] - Z[0]}" height="${yB - yT}" rx="6"${sty('fill:none;stroke:#d3cfc3;stroke-width:1.2')}/>`;
  const S: Pt[] = [[70, yM], [190, yM], [(Z[2] + Z[3]) / 2, yM], [395, yM], [521, yM], [686, yM]];
  const looks: Look[] = LOOKS.map((l, i) => (i === 2 ? { face: 's', sweat: 1, sx: 1, sy: 0.8 } : l));
  const route = `M${Z[0] + 16},${yM} H${Z[6] - 160}`;
  return svg(p, 'Above: the lecturer’s own three-dimensional leaf piece, from 22 serial sections, with two stomata drawn in the lower epidermis and a ring of bundle-sheath cells round each vein; a dashed path with numbered points 1 to 6 runs from the air below the leaf through a stoma and the air spaces to a chloroplast. Below: the same journey laid out in a straight strip, with the same carbon dioxide character as in the animation at each point: 1 outside air; 2 boundary layer, strained; 3 squeezed in the stomatal pore between two guard cells; 4 air space, glad; 5 dissolved with a water shell in the water film of the cell wall; 6 at the chloroplast. Brackets mark the conductances in series: boundary-layer conductance, stomatal conductance, with cuticular conductance in parallel below it through the cuticle, and mesophyll conductance from the air space to the chloroplast.', `
    ${blG(p + 'b', at, 22)}
    ${r.svg}
    ${sheathG(at, K)}${cuticleG(at, K)}${STOMA.map(q => stomaG(at(q[0], q[1]), 2.27 * K)).join('')}
    <path d="${smooth(B)}"${sty('fill:none;stroke:#3d3d3a;stroke-width:2;stroke-dasharray:5 4')}/>
    ${dots}
    ${strip}
    ${arr(p, 'co2', route, 'fcp-ar-dash')}
    ${arr(p, 'co2', `M${Z[2] - 26},${yC} H${Z[3] + 30}`, 'fcp-ar-dash')}
    ${kids(p, S, 13, looks, ['1', '2', '3', '4', '5', '6'])}
    ${hBr(Z[2], Z[3], yT - 12, 1)}<path d="M${(Z[2] + Z[3]) / 2},${yT - 12} V${yT - 36}"${sty('fill:none;stroke:#3d3d3a;stroke-width:1.4')}/>${gL((Z[2] + Z[3]) / 2, yT - 44, `stomatal conductance (${gs})`, 'middle', 17)}
    ${hBr(Z[3], 778, yT - 12, 1)}${gL(600, yT - 22, `mesophyll conductance (${gm})`, 'middle', 17)}
    ${hBr(Z[1], Z[2], yB + 12, -1)}${gL((Z[1] + Z[2]) / 2, yB + 36, 'boundary-layer', 'middle', 17)}${gL((Z[1] + Z[2]) / 2, yB + 58, `conductance (${gb})`, 'middle', 17)}
    ${hBr(Z[2], Z[3], yB + 12, -1)}${gL(Z[3] + 14, yB + 36, `cuticular conductance (${gcu})`, 'start', 17)}
    ${credit(794, 24, CR3D[0].replace(' (22 sections, Hp rep2 I);', ''))}${credit(794, 43, '(22 sections, Hp rep2 I);')}${credit(794, 62, CR3D[1])}`);
}

const DRAW: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, n1, n2, n3 };

export function draw(id: string): string {
  return (DRAW[id] ?? v1)();
}
