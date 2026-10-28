// Slide C9 (pick key C7) · Measuring leaf gas exchange (chunk cp, 28 Oct 2026): text redone on the 4b model, nine new
// figure variants v1–v9, then the earlier figures of c11.ts (a–j, unpicked), drawn by that module. Facts used, and no others:
// - open system: air passes a reference IRGA, the leaf chamber and a sample IRGA; A from the CO₂ difference and E from the
//   H₂O difference, each × air flow ÷ leaf area (Busch et al. 2024, Plant Cell Environ 47:3344, Box 1, Eqs 3 and 5,
//   simplified: the dilution by transpired water is left out); gsw = E / (wᵢ − wₐ) and Cᵢ = Cₐ − 1.6 A / gsw (Box 2,
//   Eqs 9–10, boundary layer and ternary correction left out); gsc = gsw / 1.6.
// - analyser filters: CO₂ 4.26 µm, H₂O 2.595 µm (LI-COR LI-840A manual, Theory of operation); CO₂ absorbs strongly at
//   4.3 µm (Gaastra 1959, p. 12); the CC0 absorption panels after R. A. Rohde.
// - Gaastra 1959: a single attached leaf in a Plexiglass chamber; CO₂ by a recording infrared gas analyser with a sample
//   tube and a reference tube; transpiration by a lithium-chloride hygrometer; leaf temperature by thermocouples.
// Real images: Busch et al. 2024 Box 1 (CC BY); LI-COR LI-6800 manual flow schematic (© LI-COR); Commons absorption panels
// (CC0); Gaastra 1959 Fig. 1; Walz GFS-3000 photo (Commons, CC BY-SA 3.0); Du et al. 2020 Fig. 1f (CC BY).
// Credits: assets/SOURCES-cp.md.
import type { PlateText, Variant } from '../types';
import * as c11 from './c11';
import { arr, co2, credit, f, h2o, it, pathSchema, pill, sb, shot, svg, SYM, T, TV, type Img, type Pt } from './cp-kit';
import boxPng from '../../assets/photos/c7-busch-box1.png';
import irPng from '../../assets/photos/c7-ir-bands.png';
import gfsJpg from '../../assets/photos/c7-gas-exchange.jpg';
import licorPng from '../../assets/photos/cp-licor-head.png';
import gaIrgaPng from '../../assets/photos/cp-gaastra-irga.png';
import fieldJpg from '../../assets/photos/cp-du-field.jpg';

const v = (s: string): string => `<i>${s.slice(0, 1)}</i><sub>${s.slice(1)}</sub>`;

export const PLATE: PlateText = {
  n: 'C9',
  pick: 'C7',
  title: 'Measuring leaf gas exchange',
  status: 'draft',
  lead: 'CO₂ and water vapour absorb infrared light, so an infrared gas analyser measures the CO₂ a leaf takes up and the water vapour it loses.',
  points: [
    { claim: 'Infrared gas analyser (IRGA).', text: 'CO₂ and H₂O each absorb their own infrared wavelengths; N₂ and O₂ do not<br>The light absorbed gives each gas’s concentration' },
    { claim: 'Leaf chamber.', text: 'Air is analysed before and after it flows over the leaf<br>CO₂ drop: net CO₂ uptake (<i>A</i>)<br>H₂O rise: transpiration (<i>E</i>)' },
    { claim: `Stomatal conductance and ${v('Ci')}.`, text: `${v('gs')}: from <i>E</i> and the water-vapour difference between leaf and air<br>${v('Ci')}, the CO₂ in the leaf air spaces: from <i>A</i> and ${v('gs')}` },
  ],
  refs: [
    { label: 'Busch et al. 2024', url: 'https://doi.org/10.1111/pce.14815' },
    { label: 'Gaastra 1959', url: 'https://edepot.wur.nl/183268' },
    { label: 'von Caemmerer & Farquhar 1981', url: 'https://doi.org/10.1007/BF00384257' },
    { label: 'LI-COR LI-840A manual', url: 'https://www.licor.com/support/LI-840A/topics/theory.html' },
  ],
};

// No picks for C7 (this slide's pick key). New v1–v9 first, then the earlier unpicked figures of c11.ts.
export const VARIANTS: Variant[] = [
  { id: 'v1', name: 'Open system, drawn: reference IRGA → leaf chamber → sample IRGA' },
  { id: 'v2', name: 'How an IRGA works: more CO₂, less infrared at the detector' },
  { id: 'v3', name: 'Infrared absorption bands of H₂O and CO₂ (real panels, CC0)' },
  { id: 'v4', name: 'LI-6800 sensor head: both IRGAs beside the leaf (LI-COR schematic)' },
  { id: 'v5', name: 'In a rice field (photo) + what the chamber sees in the leaf' },
  { id: 'v6', name: '1959 and today: Gaastra’s analyser and a portable system' },
  { id: 'v7', name: 'Measured and calculated, on the drawn CO₂ path' },
  { id: 'v8', name: 'Calculating gₛ and Cᵢ' },
  { id: 'v9', name: 'Busch et al. 2024 Box 1 with A and E in words' },
  ...c11.VARIANTS,
];

const BOX: Img = { href: boxPng, w: 1290, h: 425 };
const IR: Img = { href: irPng, w: 743, h: 295 };
const GFS: Img = { href: gfsJpg, w: 1400, h: 1033 };
const LICOR: Img = { href: licorPng, w: 1335, h: 439 };
const GA: Img = { href: gaIrgaPng, w: 955, h: 328 };
const FIELD: Img = { href: fieldJpg, w: 442, h: 545 };
const CR = {
  box: 'Busch et al. 2024, Plant Cell Environ 47:3344, Box 1 figure, CC BY 4.0',
  ir1: 'absorption panels: Wikkiwonkk after R. A. Rohde, Wikimedia Commons, CC0',
  ir2: 'analyser filter wavelengths: LI-COR LI-840A manual',
  licor: 'LI-COR Biosciences, LI-6800 manual, flow schematic (leaf chamber configuration)',
  ga: 'Gaastra 1959, Meded Landbouwhogeschool Wageningen 59(13), Fig. 1',
  gfs: 'Walz GFS-3000 in an orchard: Heinz Walz GmbH, Wikimedia Commons, CC BY-SA 3.0',
  field: 'LI-6800 in a rice field: Du et al. 2020, Plant Methods 16:6, Fig. 1f, CC BY 4.0',
};
const { ca, ci, gs, A, E } = SYM;

/* ---------- shared drawn parts ---------- */

/** An instrument box with a title above it. */
const box = (x: number, y: number, w: number, h: number, title: string, cls = 'fcp-box'): string =>
  `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>${T(x + w / 2, y - 14, title, 'fcp-h', 'middle')}`;
/** A leaf seen edge-on in a chamber, lit by a lamp above. */
function chamber(x: number, y: number, w: number, h: number): string {
  const cx = x + w / 2, ly = y + h * 0.62;
  return `<rect class="fcp-box-t" x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/>
    <path class="fcp-leaf" d="M${x + 22},${ly} Q${cx},${ly - 34} ${x + w - 22},${ly} Q${cx},${ly + 20} ${x + 22},${ly} Z"/>
    <rect class="fcp-lamp" x="${cx - 46}" y="${y - 34}" width="92" height="20" rx="6"/>
    ${[-30, 0, 30].map(d => `<path class="fcp-ar fcp-ar-grey" d="M${cx + d},${y - 8} l0,${f(h * 0.3)}" stroke-dasharray="4 6"/>`).join('')}`;
}
/** Pipe from x0 to x1 at y. */
const pipe = (x0: number, x1: number, y: number): string =>
  `<path class="fcp-pipe" d="M${x0},${y} H${x1}"/><path class="fcp-pipe-in" d="M${x0},${y} H${x1}"/>`;

/* v1 · open system, drawn: the leaf removes CO₂ from the air stream and adds water vapour */
function v1(): string {
  const p = 'cp09v1';
  const y = 150, h = 110, yp = y + h / 2;
  const mols = (x: number, nC: number, nW: number): string =>
    [...Array(nC).keys()].map(i => co2(x + 32 + (i % 2) * 54, y + 30 + Math.floor(i / 2) * 34, 9)).join('')
    + [...Array(nW).keys()].map(i => h2o(x + 130, y + 26 + i * 30, 8)).join('');
  const bars = (x0: number, label: string, hin: number, hout: number, k: 'co2' | 'h2o', res: string): string => {
    const by = 520;
    return `${T(x0 + 70, 352, label, k === 'co2' ? 'fcp-c' : 'fcp-w', 'middle')}
      <rect class="fcp-bar-in" x="${x0 + 10}" y="${by - hin}" width="50" height="${hin}" rx="3"/>
      <rect class="fcp-bar-${k}" x="${x0 + 80}" y="${by - hout}" width="50" height="${hout}" rx="3"/>
      <path class="fcp-axis" d="M${x0},${by} H${x0 + 140}"/>
      ${T(x0 + 35, by + 26, 'in', 'fcp-s', 'middle')}${T(x0 + 105, by + 26, 'out', 'fcp-s', 'middle')}
      ${T(x0 + 160, 452, res, 'fcp-h')}`;
  };
  return svg(p, 'Drawing of an open gas-exchange system: air flows from left to right through a reference infrared gas analyser, a leaf chamber with a lit leaf, and a sample analyser. The reference analyser sees more carbon dioxide and less water vapour than the sample analyser. Below, bars compare the air going in and coming out: the carbon dioxide drop gives the net carbon dioxide uptake A; the water vapour rise gives the transpiration E.', `
    ${pipe(40, 104, yp)}${pipe(258, 300, yp)}${pipe(500, 542, yp)}${pipe(696, 760, yp)}
    ${arr(p, 'ink', `M24,${yp - 34} H92`)}${T(24, yp - 46, 'air in', 'fcp-l')}
    ${arr(p, 'ink', `M706,${yp - 34} H776`)}${T(776, yp - 46, 'air out', 'fcp-l', 'end')}
    ${box(104, y, 154, h, 'reference IRGA')}${mols(104, 4, 1)}
    ${chamber(300, y - 10, 200, h + 20)}${T(400, y + h + 44, 'leaf chamber', 'fcp-h', 'middle')}
    ${box(542, y, 154, h, 'sample IRGA')}${mols(542, 2, 3)}
    ${bars(70, 'CO₂', 150, 105, 'co2', `drop: ${A}`)}${T(230, 482, 'net CO₂ uptake', 'fcp-s')}
    ${bars(440, 'H₂O', 70, 140, 'h2o', `rise: ${E}`)}${T(600, 482, 'transpiration', 'fcp-s')}
  `);
}

/* v2 · how an infrared gas analyser works: infrared source, gas cell, filter, detector; more CO₂ absorbs more light */
function v2(): string {
  const p = 'cp09v2';
  const row = (y: number, n: number, sig: number, lab: string): string => {
    const mols = [...Array(n).keys()].map(i => co2(252 + (i % 4) * 70 + (Math.floor(i / 4) % 2) * 30, y - 18 + Math.floor(i / 4) * 36, 9)).join('');
    return `<rect class="fcp-box-t" x="200" y="${y - 44}" width="330" height="88" rx="10"/>${mols}
      <circle class="fcp-lamp" cx="120" cy="${y}" r="26"/>
      <path class="fcp-ir" d="M150,${y} H200"/><path class="fcp-ir" d="M530,${y} H566" style="opacity:${0.25 + sig * 0.75}"/>
      <rect class="fcp-box" x="566" y="${y - 30}" width="20" height="60" rx="3"/>
      <rect class="fcp-box" x="610" y="${y - 36}" width="56" height="72" rx="8"/>
      <rect class="fcp-bar-co2" x="690" y="${f(y + 36 - sig * 72)}" width="34" height="${f(sig * 72)}" rx="3"/>
      <path class="fcp-axis" d="M684,${y + 36} H732"/>
      ${T(365, y + 76, lab, 'fcp-l', 'middle')}`;
  };
  return svg(p, 'Drawing of an infrared gas analyser in two rows. An infrared source shines through a gas cell, a filter that passes only the 4.26 micrometre band absorbed by carbon dioxide, and onto a detector. Top: air with little carbon dioxide; much light reaches the detector. Bottom: air with more carbon dioxide; less light reaches the detector. A second filter at 2.59 micrometres reads water vapour the same way.', `
    ${T(120, 82, 'infrared', 'fcp-h', 'middle')}${T(120, 108, 'source', 'fcp-h', 'middle')}
    ${T(365, 82, 'gas cell', 'fcp-h', 'middle')}
    ${T(576, 82, 'filter', 'fcp-h', 'middle')}${T(576, 108, '4.26 µm', 'fcp-s', 'middle')}
    ${T(660, 82, 'detector', 'fcp-h', 'start')}
    ${row(196, 3, 0.85, 'less CO₂: more light reaches the detector')}
    ${row(380, 8, 0.35, 'more CO₂: less light reaches the detector')}
    ${T(400, 540, `H₂O is read the same way, with a filter at 2.59 µm`, 'fcp-s', 'middle')}
    ${credit(780, 594, 'filter wavelengths: LI-COR LI-840A manual')}
  `);
}

/* v3 · real absorption panels (CC0) for water vapour, CO₂ and O₂ + O₃, zoomed on 1.5–7 µm, with the two analyser bands */
// Asset: λ (µm) → u = 63 + 653 log₁₀ λ (0.8–11 µm); rows: H₂O v 1–93, CO₂ v 101–191, O₂ + O₃ v 200–291.
const irU = (lam: number): number => 63 + 653 * Math.log10(lam);
function v3(): string {
  const p = 'cp09v3';
  const u0 = irU(1.5), u1 = irU(7);
  const a = shot(`${p}-a`, IR, 160, 90, 600, { fig: true, win: [u0, 0, u1 - u0, 295] });
  const X = (lam: number): number => a.at(irU(lam), 0)[0];
  const yb = 96 + a.h + 8;
  const ticks = [2, 3, 4, 5, 6, 7].map(l => `<path class="fcp-axis" d="M${f(X(l))},${f(yb)} v8"/>${T(X(l), yb + 32, `${l}`, 'fcp-ax', 'middle')}`).join('');
  const rows = ([['H₂O', 47, 'fcp-w'], ['CO₂', 146, 'fcp-c'], ['O₂ + O₃', 245, 'fcp-h']] as [string, number, string][])
    .map(([s, vv, c]) => T(134, a.at(0, vv)[1] + 8, s, c, 'end')).join('');
  const guide = (lam: number): string => `<path class="fcp-dash" d="M${f(X(lam))},90 V${f(yb)}"/>`;
  return svg(p, 'Real absorption panels of the atmosphere’s gases from 1.5 to 7 micrometres: water vapour (top), carbon dioxide (middle), oxygen and ozone (bottom). Dashed lines mark the bands an infrared gas analyser reads: water vapour at 2.59 micrometres and carbon dioxide at 4.26 micrometres. Oxygen and ozone absorb little at these wavelengths.', `
    ${a.svg}
    <path class="fcp-axis" d="M160,${f(yb)} H760"/>${ticks}${T(460, yb + 52, 'wavelength (µm)', 'fcp-ax', 'middle')}
    ${rows}
    ${guide(2.59)}${guide(4.26)}
    ${pill(X(2.59) - 20, 56, 'H₂O 2.59 µm', { k: 'h2o' })}${pill(X(4.26) + 20, 56, 'CO₂ 4.26 µm', { k: 'co2' })}
    ${TV(40, 90 + a.h / 2, 'absorption', 'fcp-ax')}
    ${credit(780, 578, CR.ir1)}${credit(780, 596, CR.ir2)}
  `);
}

/* v4 · LI-6800 sensor head (LI-COR manual): the sample and reference IRGAs sit in the head, beside the leaf cuvette */
// Asset (1335 × 439): Sample IRGA (615, 82–135), Reference IRGA (615, 253–306), leaf cuvette (1110, 205), air in (60, 260),
// mixing fan (880, 200).
function v4(): string {
  const p = 'cp09v4';
  const a = shot(`${p}-a`, LICOR, 20, 120, 760, { fig: true });
  const P = (u: number, w: number): Pt => a.at(u, w);
  return svg(p, 'LI-COR LI-6800 manual, flow schematic of the sensor head in the leaf-chamber configuration: air from the console is split by a valve; one stream passes the reference infrared gas analyser, the other the leaf cuvette, mixed by a fan, and then the sample analyser. Both analysers sit in the head, next to the leaf.', `
    ${a.svg}
    ${pill(P(560, 0)[0], 70, 'sample IRGA: air after the leaf', { to: P(640, 120) })}
    ${pill(420, 440, 'reference IRGA: air before the leaf', { to: P(640, 290) })}
    ${pill(P(1110, 0)[0] - 10, 70, 'leaf chamber', { to: P(1110, 150) })}
    ${pill(70, 440, 'air in', { to: P(100, 262) })}
    ${credit(780, 594, CR.licor)}
  `);
}

/* v5 · a LI-6800 in a rice field, and what its chamber sees in the clamped leaf */
// Photo asset (442 × 545): the sensor head in the hands at (170, 190).
function v5(): string {
  const p = 'cp09v5';
  const a = shot(`${p}-a`, FIELD, 20, 30, 330, { band: 'rice field, LI-6800' });
  const hd = a.at(170, 192);
  const cx = 580, cy = 270, r = 190;
  const leaf = `
    <clipPath id="${p}-z"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
    <g clip-path="url(#${p}-z)">
      <rect class="fcp-ias" x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}"/>
      <rect class="fcp-epi" x="${cx - r}" y="${cy - 10}" width="${r - 34}" height="44" rx="12"/>
      <rect class="fcp-epi" x="${cx + 34}" y="${cy - 10}" width="${r - 34}" height="44" rx="12"/>
      <ellipse class="fcp-guard" cx="${cx - 18}" cy="${cy + 12}" rx="22" ry="26"/><ellipse class="fcp-guard" cx="${cx + 18}" cy="${cy + 12}" rx="22" ry="26"/>
      <rect class="fcp-cell" x="${cx - r}" y="${cy + 70}" width="${2 * r}" height="${r}" rx="0" style="opacity:.7"/>
    </g>
    <circle class="fcp-frame" cx="${cx}" cy="${cy}" r="${r}" style="stroke:#141413;stroke-width:1.6"/>`;
  return svg(p, 'Left: photograph of a researcher in a flooded rice field holding the sensor head of a LI-6800 portable photosynthesis system on a rice leaf. Right: a magnified circle of the clamped leaf in section: carbon dioxide from the chamber air diffuses in through a stoma, giving the net carbon dioxide uptake A; water vapour diffuses out through the same stoma, giving the transpiration E.', `
    ${a.svg}
    <circle class="fcp-zoom" cx="${f(hd[0])}" cy="${f(hd[1])}" r="20"/>
    <path class="fcp-zoom" d="M${f(hd[0] + 14)},${f(hd[1] - 14)} L${f(cx - r * 0.6)},${f(cy - r * 0.8)} M${f(hd[0] + 14)},${f(hd[1] + 14)} L${f(cx - r * 0.7)},${f(cy + r * 0.72)}"/>
    ${leaf}
    ${co2(cx - 90, cy - 120)}${co2(cx + 100, cy - 128)}${h2o(cx + 120, cy - 100)}${h2o(cx - 130, cy - 70)}
    ${arr(p, 'co2', `M${cx - 9},${cy - 120} V${cy + 70}`, 'fcp-ar-big')}${arr(p, 'h2o', `M${cx + 11},${cy + 70} V${cy - 120}`, 'fcp-ar-big')}
    ${pill(cx - 110, cy + r + 40, `CO₂ in: ${A}`, { k: 'co2' })}${pill(cx + 110, cy + r + 40, `H₂O out: ${E}`, { k: 'h2o' })}
    ${T(cx, cy - 158, 'chamber air', 'fcp-z', 'middle')}${T(cx, cy + 120, 'leaf', 'fcp-z', 'middle')}
    ${credit(780, 594, CR.field)}
  `);
}

/* v6 · 1959 and today: Gaastra's infrared CO₂ analyser (sample and reference tubes) and a portable system in an orchard */
// Gaastra asset (955 × 328): radiators R1 (150, 75) and R2 (150, 240); sample tube T1 (420, 100); reference tube T2 (420, 225);
// detector (condenser microphone) (690, 190). GFS asset (1400 × 1033): leaf chamber on the tripod (450, 160); console (820, 640).
function v6(): string {
  const p = 'cp09v6';
  const a = shot(`${p}-a`, GA, 220, 40, 560, { fig: true });
  const A_ = (u: number, w: number): Pt => a.at(u, w);
  const b = shot(`${p}-b`, GFS, 220, 296, 560, { win: [100, 60, 1200, 560] });
  const B = (u: number, w: number): Pt => b.at(u, w);
  return svg(p, 'Top: Gaastra 1959, figure 1, his infrared carbon dioxide analyser: two infrared radiators shine through a sample tube and a reference tube onto a detector, which measures the difference. Bottom: a modern portable gas-exchange system, a Walz GFS-3000, in an orchard: a leaf chamber on a tripod connected by a hose to the console.', `
    ${T(20, 110, '1959', 'fcp-big')}${T(20, 142, 'Gaastra: one leaf,', 'fcp-s')}${T(20, 166, 'infrared CO₂', 'fcp-s')}${T(20, 190, 'analyser', 'fcp-s')}
    ${a.svg}
    ${pill(A_(420, 0)[0], 28, 'sample gas', { to: A_(430, 100) })}
    ${pill(A_(420, 0)[0] + 10, 262, 'reference gas', { to: A_(430, 228) })}
    ${pill(A_(800, 0)[0], 28, 'detector', { to: A_(700, 175) })}
    ${pill(A_(110, 0)[0] - 10, 262, 'infrared source', { to: A_(150, 240) })}
    ${T(20, 372, 'today', 'fcp-big')}${T(20, 404, 'portable system', 'fcp-s')}${T(20, 428, 'in the field', 'fcp-s')}
    ${b.svg}
    ${pill(B(560, 110)[0] + 60, B(560, 110)[1], 'leaf chamber', { k: 'photo', to: B(470, 160) })}
    ${pill(B(1000, 420)[0], B(1000, 420)[1], 'console', { k: 'photo', to: B(880, 560) })}
    ${credit(780, 576, CR.ga)}${credit(780, 594, CR.gfs)}
  `);
}

/* v7 · measured and calculated, on the drawn CO₂ path: the chamber measures A and E in the outside air; gₛ and Cᵢ are
   calculated; the mesophyll stays dark */
function v7(): string {
  const p = 'cp09v7';
  return svg(p, 'The drawn carbon dioxide path from the outside air to the chloroplast, with the outside air, the stomata and the air space lit and the mesophyll dimmed. Pills: measured in the chamber, A and E; calculated, the stomatal conductance and Ci.', `
    ${pathSchema(p, { lit: ['air', 'bl', 'st', 'ias', 'co2', 'h2o'], brackets: false, top: 150, bottom: 476 })}
    ${pill(120, 50, `measured: ${A}, ${E}`, { k: 'dark', big: true })}
    ${pill(330, 98, `calculated: ${gs}, ${ci}`, { k: 'paper', big: true })}
    ${credit(780, 594, 'after Busch et al. 2024, Fig. 2')}
  `);
}

/* v8 · calculating gₛ and Cᵢ: a stoma between saturated leaf air (wᵢ) and the outside air (wₐ), with the two relations */
function v8(): string {
  const p = 'cp09v8';
  const cx = 170, yE = 300;
  const st = `
    <rect class="fcp-ias" x="30" y="${yE + 24}" width="290" height="160" rx="6"/>
    <rect class="fcp-epi" x="30" y="${yE - 24}" width="${cx - 52 - 30}" height="48" rx="14"/>
    <rect class="fcp-epi" x="${cx + 52}" y="${yE - 24}" width="${320 - cx - 52}" height="48" rx="14"/>
    <ellipse class="fcp-guard" cx="${cx - 30}" cy="${yE}" rx="26" ry="30"/><ellipse class="fcp-guard" cx="${cx + 30}" cy="${yE}" rx="26" ry="30"/>
    ${[[70, 360], [120, 420], [210, 380], [260, 440], [90, 460], [280, 370], [170, 470]].map(([x, y]) => h2o(x, y)).join('')}
    ${[[70, 150], [270, 200]].map(([x, y]) => h2o(x, y)).join('')}
    ${[[110, 110], [230, 140], [120, 230]].map(([x, y]) => co2(x, y, 9)).join('')}
    ${arr(p, 'h2o', `M${cx + 9},${yE + 110} V150`, 'fcp-ar-big')}${arr(p, 'co2', `M${cx - 9},130 V${yE + 110}`, 'fcp-ar-big')}`;
  const w = (s: string): string => `${it('w')}${sb(s)}`;
  return svg(p, 'Left: a stoma in section between the outside air, with water vapour mole fraction wa, and the leaf air space, saturated with water vapour at leaf temperature, wi; water vapour diffuses out and carbon dioxide in. Right: the stomatal conductance to water vapour is the transpiration E divided by wi minus wa. The carbon dioxide in the air spaces, Ci, is Ca minus 1.6 times A divided by that conductance, because water vapour diffuses 1.6 times faster than carbon dioxide.', `
    ${st}
    ${T(330, 128, `outside air: ${w('a')}, ${ca}`, 'fcp-l')}
    ${T(330, 470, `leaf air space: ${w('i')}, ${ci}`, 'fcp-l')}${T(330, 496, 'saturated with water vapour', 'fcp-s')}
    ${T(560, 250, `${it('g')}${sb('sw')} = ${E} / (${w('i')} − ${w('a')})`, 'fcp-eq', 'middle')}
    ${T(560, 340, `${ci} = ${ca} − 1.6 ${A} / ${it('g')}${sb('sw')}`, 'fcp-eq', 'middle')}
    ${T(560, 378, 'H₂O diffuses 1.6 × faster than CO₂', 'fcp-s', 'middle')}
    ${credit(780, 594, 'simplified from Busch et al. 2024, Box 2, Eqs 9–10 (boundary layer left out)')}
  `);
}

/* v9 · Busch et al. 2024, Box 1: the open system, with A and E stated in words below */
function v9(): string {
  const p = 'cp09v9';
  const a = shot(`${p}-a`, BOX, 20, 70, 760, { fig: true });
  const P = (u: number, w: number): Pt => a.at(u, w);
  return svg(p, 'Busch and colleagues 2024, box 1 figure: air flows in through a reference infrared gas analyser, past a leaf in a chamber, which takes up carbon dioxide and gives off water vapour, and out through a sample analyser. Below: A, the net carbon dioxide uptake, is the air flow times the carbon dioxide going in minus going out, divided by the leaf area. E, the transpiration, is the air flow times the water vapour going out minus going in, divided by the leaf area.', `
    ${a.svg}
    ${pill(P(343, 0)[0], 48, 'CO₂, H₂O in', {})}${pill(P(1022, 0)[0], 48, 'CO₂, H₂O out', {})}
    ${T(400, 430, `${A} = air flow × (CO₂ in − CO₂ out) / leaf area`, 'fcp-eq', 'middle')}
    ${T(400, 490, `${E} = air flow × (H₂O out − H₂O in) / leaf area`, 'fcp-eq', 'middle')}
    ${credit(780, 576, CR.box)}${credit(780, 594, 'equations simplified from Busch et al. 2024, Eqs 3 and 5 (dilution by transpired water left out)')}
  `);
}

const DRAW: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7, v8, v9 };

export function draw(id: string): string {
  return DRAW[id] ? DRAW[id]() : c11.draw(id);
}
