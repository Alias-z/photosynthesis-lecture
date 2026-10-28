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

const sub = (s: string): string => `<sub>${s}</sub>`;
const v = (s: string): string => `<i>${s.slice(0, 1)}</i>${sub(s.slice(1))}`;

export const PLATE: PlateText = {
  n: 'C10',
  pick: 'C10n',
  title: 'CO₂ uptake: from the air to RuBisCO',
  status: 'draft',
  lead: 'CO₂ diffuses from the air through the stomata into the leaf.<br>In the mesophyll cells it dissolves and reaches RuBisCO in the chloroplast.',
  points: [
    { claim: `Stomata, stomatal conductance (${v('gs')}).`, text: 'Pores between 2 guard cells: CO₂ in, water vapour out through the same pores', eq: `air, ${v('Ca')} ≈ 430 ppm → leaf air spaces, ${v('Ci')} ≈ 300 ppm` },
    { claim: `Mesophyll, mesophyll conductance (${v('gm')}).`, text: 'CO₂ dissolves in the cell wall and diffuses through the cell into the chloroplast', eq: `${v('Ci')} ≈ 300 ppm → chloroplast, ${v('Cc')} ≈ 200 ppm` },
    { claim: 'Conductance.', text: 'How easily CO₂ diffuses: CO₂ uptake = conductance × CO₂ drop', eq: `<i>A</i> = <i>g</i> × Δ<i>C</i>` },
  ],
  refs: [
    { label: 'Busch et al. 2024', url: 'https://doi.org/10.1111/pce.14815' },
    { label: 'Gaastra 1959', url: 'https://edepot.wur.nl/183268' },
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

const DRAW: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13 };

export function draw(id: string): string {
  return (DRAW[id] ?? v1)();
}
