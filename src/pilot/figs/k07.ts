// Slide C7 · Measuring leaf gas exchange (redo of 27 Oct 2026, block L2b; C7 + C8 of the 18-slide plan merged). Real figures:
// Busch et al. 2024 Box 1 figure (open system: reference IRGA, leaf chamber, sample IRGA; with their Eqs 3 and 5 for E and A)
// and Fig. 2 (CO₂ and H₂O path Cₐ → Cᵢ → Cc with the boundary-layer, stomatal and mesophyll conductances), the H₂O, CO₂ and
// O₂ + O₃ absorption panels of the Commons figure "Atmospheric Transmission" (CC0; wavelength axis redrawn), a Walz GFS-3000
// portable gas-exchange system (Commons, CC BY-SA 3.0) and a coloured SEM of a tomato stoma (public domain). Analyser bands:
// CO₂ 4.26 µm, H₂O 2.59 µm (LI-COR LI-840A manual; LI-6800 theory slides). Typical values at 25 °C (Busch et al. 2024, Table 1):
// Cₐ 420, Cᵢ 300, Cc 200 µmol mol⁻¹. g is the one optional mesophyll variant. No LI-6800 photo with an open licence exists on
// Commons. Sources and crops: assets/SOURCES-L2b.md.
import type { PlateText, Variant } from '../types';
import boxPng from '../../assets/photos/c7-busch-box1.png';
import irPng from '../../assets/photos/c7-ir-bands.png';
import gfsJpg from '../../assets/photos/c7-gas-exchange.jpg';
import pathJpg from '../../assets/photos/c7-busch-path.jpg';
import semJpg from '../../assets/photos/c7-stoma-sem.jpg';
import './k07.css';

export const PLATE: PlateText = {
  n: 'C7',
  title: 'Measuring leaf gas exchange',
  status: 'draft',
  lead: 'An infrared gas analyser measures how much CO₂ a leaf takes up and how much water it loses.',
  points: [
    { claim: 'Infrared gas analysis.', text: 'CO₂ and H₂O absorb infrared light at different wavelengths; N₂ and O₂ do not<br>The absorption gives their concentrations' },
    { claim: 'Leaf chamber.', text: 'Air is measured before and after passing over the leaf<br>The CO₂ drop gives net CO₂ uptake (<i>A</i>); the H₂O rise gives transpiration (<i>E</i>)' },
    { claim: 'Stomatal conductance and <i>C</i>ᵢ.', text: 'Water loss and air humidity give stomatal conductance (<i>g</i>ₛ)<br><i>A</i> and <i>g</i>ₛ give the CO₂ concentration inside the leaf (<i>C</i>ᵢ)' },
  ],
  refs: [
    { label: 'Busch et al. 2024', url: 'https://doi.org/10.1111/pce.14815' },
    { label: 'von Caemmerer & Farquhar 1981', url: 'https://doi.org/10.1007/BF00384257' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Reference and sample IRGA + IR absorption bands' },
  { id: 'b', name: 'IR absorption bands: H₂O 2.59 µm, CO₂ 4.26 µm' },
  { id: 'c', name: 'Leaf chamber: A from the CO₂ drop, E from the H₂O rise' },
  { id: 'd', name: 'Portable gas-exchange system + open system' },
  { id: 'e', name: 'Stoma (SEM) + CO₂ path from Ca to Ci' },
  { id: 'f', name: 'Stomatal conductance gsw and Ci ≈ Ca − 1.6 A/gsw' },
  { id: 'g', name: 'CO₂ path Ca → Ci → Cc, typical values (mesophyll, optional)' },
];

/* ---------- shared parts (after l04b u–z) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number }
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fk07-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** Rotated axis title, centred on (x, y). */
const TV = (x: number, y: number, s: string, cls = 'fk07-at'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="middle" transform="rotate(-90 ${f(x)} ${f(y)})">${s}</text>`;
const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;
const sb = (s: string): string => `<tspan baseline-shift="sub" font-size="72%">${s}</tspan>`;


/** A real image: the window win = [u0, v0, width, height] of it (image pixels) shown w wide at x, y, its height following.
 *  A photo sits in a rounded frame with a dark credit band; a published figure ('fig') keeps its white ground multiplied into
 *  the page and is credited separately in grey. at() maps image pixels to the figure. */
function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; credit?: string; top?: boolean } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  let band = '';
  if (o.credit) {
    const by = o.top ? y : y + h - 22;
    band = `<rect class="fk07-credbg" x="${f(x)}" y="${f(by)}" width="${f(w)}" height="22"/>${T(x + w - 8, by + 15.5, o.credit, 'fk07-cr', 'end')}`;
  }
  const clip = o.fig
    ? `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/></clipPath>`
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fk07-mult"' : ''}>${img}${band}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h };
}
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fk07-ldh" d="${d}"/><path class="fk07-ldk" d="${d}"/><circle class="fk07-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
/** A label pill centred at (x, y): white on photos, tinted on white-ground figures; with `to`, a leader from its edge. */
function pill(x: number, y: number, s: string, to?: Pt, tint = false): string {
  const w = s.replace(/<[^>]+>/g, '').length * 9.2 + 22;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    ld = pleader([x + dx * t, y + dy * t], to);
  }
  return `${ld}<rect class="${tint ? 'fk07-pillbg-t' : 'fk07-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>${T(x, y + 6, s, 'fk07-pill', 'middle')}`;
}
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fk07-crd', a);
const realSvg = (label: string, body: string): string =>
  `<svg class="fig-svg fk07" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

const BOX: Img = { href: boxPng, w: 1290, h: 425 };
const IR: Img = { href: irPng, w: 743, h: 295 };
const GFS: Img = { href: gfsJpg, w: 1400, h: 1033 };
const PATH: Img = { href: pathJpg, w: 1160, h: 1045 };
const SEM: Img = { href: semJpg, w: 760, h: 660 };
const CR = {
  box: 'Busch et al. 2024, Plant Cell Environ, Box 1, CC BY 4.0',
  ir: 'Absorption by gases of the atmosphere: Wikkiwonkk after R. A. Rohde, Wikimedia Commons, CC0',
  gfs: 'Photo: Heinz Walz GmbH, CC BY-SA 3.0',
  path: 'Busch et al. 2024, Plant Cell Environ, Fig. 2, CC BY 4.0',
  sem: 'SEM: Dartmouth EM Facility, public domain',
};
const ca = `${it('C')}${sb('a')}`, ci = `${it('C')}${sb('i')}`, gs = `${it('g')}${sb('s')}`, gsw = `${it('g')}${sb('sw')}`;

/** Scale bar of the SEM: 10 µm = 180 px of the original, the same in the asset. */
function semBar(a: Shot, u: number, v: number): string {
  const p0 = a.at(u, v), p1 = a.at(u + 180, v);
  return `<rect class="fk07-sbar" x="${f(p0[0])}" y="${f(p0[1] - 4)}" width="${f(p1[0] - p0[0])}" height="6"/>${pill((p0[0] + p1[0]) / 2, p0[1] - 22, '10 µm')}`;
}
/* ---------- the open system (Busch et al. 2024, Box 1), arrows for air in and out kept ---------- */
// Asset: air-in arrow v 255 from u 19 to 147; reference IRGA u 190–357; leaf chamber u 480–839; sample IRGA u 959–1125;
// air-out arrow u 1165–1275.

function box(p: string, x: number, y: number, w: number): { svg: string; h: number; at: (u: number, v: number) => Pt } {
  const a = shot(`${p}-box`, BOX, x, y, w, { fig: true });
  const yi = a.at(0, 214)[1];
  return { svg: `${a.svg}${pill(a.at(80, 0)[0], yi, 'air in', undefined, true)}${pill(a.at(1222, 0)[0], yi, 'air out', undefined, true)}`, h: a.h, at: a.at };
}

/* ---------- IR absorption panels with a redrawn wavelength axis ---------- */
// Asset: λ (µm) → u = 63 + 653 log₁₀ λ (0.80–11 µm); rows: H₂O v 1–93, CO₂ v 101–191, O₂ + O₃ v 200–291.
const irU = (lam: number): number => 63 + 653 * Math.log10(lam);

function bands(p: string, x: number, y: number, w: number, o: { title?: boolean; pills?: number } = {}): { svg: string; h: number } {
  const a = shot(`${p}-ir`, IR, x, y, w, { fig: true });
  const yb = y + a.h + 6;
  const ax = [1, 2, 3, 4, 5, 6, 8, 10].map(l => {
    const xx = a.at(irU(l), 0)[0];
    return `<path class="fk07-tk" d="M${f(xx)},${f(yb)} v7"/>${T(xx, yb + 26, l === 10 && !o.title ? '10 µm' : `${l}`, 'fk07-ax', 'middle')}`;
  }).join('');
  const rows = ([['H₂O', 47], ['CO₂', 146], ['O₂ + O₃', 245]] as [string, number][])
    .map(([s, v]) => T(x - 12, a.at(0, v)[1] + 7, s, 'fk07-h', 'end')).join('');
  const xh = a.at(irU(2.59), 0)[0], xc = a.at(irU(4.26), 0)[0], py = o.pills ?? y - 30;
  const guides = `<path class="fk07-gd" d="M${f(xh)},${f(py + 14)} V${f(yb)} M${f(xc)},${f(py + 14)} V${f(yb)}"/>`;
  const pl = `${pill(xh - 66, py, 'H₂O 2.59 µm', undefined, true)}${pill(xc + 66, py, 'CO₂ 4.26 µm', undefined, true)}`;
  const line = `<path class="fk07-tk" d="M${f(x)},${f(yb)} H${f(x + w)}"/>`;
  const title = o.title ? T(x + w / 2, yb + 56, 'Wavelength (µm)', 'fk07-at', 'middle') : '';
  return { svg: `${a.svg}${guides}${line}${ax}${rows}${pl}${title}`, h: a.h };
}


/* a · the open system above the absorption bands */

function drawA(): string {
  const p = 'fk07a';
  const b = box(p, 50, 4, 700);
  const r = bands(p, 150, 300, 540, { pills: 282 });
  return realSvg('Top: Busch and colleagues 2024, box 1 figure, an open gas-exchange system: air flows through a reference infrared gas analyser, a leaf chamber and a sample analyser. Bottom: infrared absorption of water vapour, carbon dioxide, and oxygen with ozone from 0.8 to 11 micrometres, with the analyser bands marked: water vapour 2.59, carbon dioxide 4.26 micrometres.', `
    ${b.svg}${credit(750, 4 + b.h + 16, CR.box)}
    ${r.svg}
    ${credit(780, 592, CR.ir)}
  `);
}

/* b · the absorption bands */

function drawB(): string {
  const p = 'fk07b';
  const r = bands(p, 140, 130, 620, { title: true });
  return realSvg('Absorption of infrared light by three gases of the atmosphere from 0.8 to 11 micrometres: water vapour absorbs in several bands, including one near 2.6 and a broad one near 6 micrometres; carbon dioxide absorbs in narrow bands at 2.7 and 4.3 micrometres and a broad one near 15; oxygen and ozone absorb almost nothing in this range except ozone near 9.6 micrometres. Dashed lines mark the bands used by the analysers: water vapour 2.59 micrometres, carbon dioxide 4.26 micrometres.', `
    ${r.svg}
    ${credit(780, 590, CR.ir)}
  `);
}

/* c · the open system with the two equations of Busch et al. 2024 (Eqs 3 and 5) */

function drawC(): string {
  const p = 'fk07c';
  const b = box(p, 20, 30, 760);
  const w = (s: string): string => `${it('w')}${sb(s)}`, c = (s: string): string => `${it('C')}${sb(s)}`;
  const mu = `${it('µ')}${sb('0')}`;
  return realSvg('Busch and colleagues 2024, box 1 figure: air flows in, through a reference infrared gas analyser that reads its carbon dioxide and water vapour, through a chamber holding a leaf, which takes up carbon dioxide and gives off water vapour, and through a sample analyser that reads them again before the air flows out. Below, their equations: transpiration E equals the incoming flow times the rise in water vapour, divided by leaf area times one minus the outgoing water vapour; net assimilation A equals the incoming flow times the fall in carbon dioxide, corrected for the added water vapour, divided by leaf area.', `
    ${b.svg}
    ${T(400, 360, `${it('E')} = ${mu} (${w('a')} − ${w('0')}) / [${it('s')} (1 − ${w('a')})]`, 'fk07-eq', 'middle')}
    ${T(400, 416, `${it('A')} = ${mu} [${c('0')} − ${c('a')} (1 − ${w('0')}) / (1 − ${w('a')})] / ${it('s')}`, 'fk07-eq', 'middle')}
    ${T(400, 470, `${mu} air flow in · ${it('C')}, ${it('w')} CO₂ and H₂O mole fractions · ${it('s')} leaf area`, 'fk07-s', 'middle')}
    ${T(400, 496, `${w('0')}, ${c('0')}: reference IRGA · ${w('a')}, ${c('a')}: sample IRGA`, 'fk07-s', 'middle')}
    ${credit(780, 590, `${CR.box}; Eqs 3, 5`)}
  `);
}

/* d · a portable gas-exchange system in the field above the open system */
// GFS asset: leaf chamber on the tripod ≈ (455, 160); console with the gas supply columns ≈ (820, 640).

function drawD(): string {
  const p = 'fk07d';
  const a = shot(`${p}-a`, GFS, 200, 4, 400, { credit: CR.gfs });
  const b = box(p, 20, 316, 760);
  return realSvg('Top: a portable gas-exchange system in an orchard (Walz GFS-3000): a leaf is clamped in a small chamber on a tripod, connected by a hose to the console. Bottom: Busch and colleagues 2024, box 1 figure, the principle: air flows through a reference infrared gas analyser, the leaf chamber and a sample analyser.', `
    ${a.svg}
    ${pill(110, 60, 'leaf chamber', a.at(450, 150))}
    ${b.svg}
    ${credit(780, 596, CR.box)}
  `);
}

/* e · the stoma (SEM) beside the first part of the diffusion path (boundary layer, stoma, air space) */
// SEM asset: pore centre ≈ (405, 280); guard cells around it, u 265–550, v 190–360. PATH window [0, 0, 500, 760]:
// boundary layer and epidermis with the stomatal pore between the two epidermal cells (u 270–380, v 440–700), Cₐ → Cᵢ.

function drawE(): string {
  const a = shot('fk07e-a', SEM, 16, 130, 400, { credit: CR.sem });
  const b = shot('fk07e-b', PATH, 440, 40, 340, { fig: true, win: [0, 0, 500, 720] });
  return realSvg('Left: scanning electron micrograph of a stoma on a tomato leaf: two guard cells around a slit-shaped pore about 10 micrometres long. Right: the first part of Busch and colleagues 2024, figure 2: carbon dioxide at Ca outside the leaf crosses the boundary layer and the stomatal pore between two epidermal cells into the intercellular air space, where its concentration is Ci; water vapour leaves the other way. Brackets mark the boundary-layer and stomatal conductances.', `
    ${a.svg}${b.svg}
    ${semBar(a, 40, 610)}
    ${pill(130, 100, 'stomatal pore', a.at(400, 285))}
    ${pill(300, 130 + a.h + 30, 'guard cell', a.at(470, 345))}
    ${pill(610, 40 + b.h + 26, `stomatal conductance ${gs}`, b.at(325, 600), true)}
    ${credit(780, 590, CR.path)}
  `);
}

/* f · stomatal conductance and Cᵢ from the fluxes: the first part of Busch et al. 2024 Fig. 2 with the two simplified relations */
// PATH window [0, 0, 500, 720]: boundary layer, epidermis with the stomatal pore, air space; w (H₂O) and C (CO₂) outside and inside.

function drawF(): string {
  const a = shot('fk07f-a', PATH, 40, 40, 350, { fig: true, win: [0, 0, 500, 720] });
  const w = (s: string): string => `${it('w')}${sb(s)}`;
  return realSvg('Left: the first part of Busch and colleagues 2024, figure 2: water vapour leaves the leaf from the intercellular air space, at wi, through the stomatal pore and the boundary layer to the air outside, at wa; carbon dioxide moves the other way, from Ca outside to Ci inside. Right: the stomatal conductance to water vapour, gsw, is approximately the transpiration E divided by the difference in water vapour between leaf and air; the carbon dioxide inside the leaf, Ci, is approximately Ca minus 1.6 times A divided by gsw, because water vapour diffuses 1.6 times faster than carbon dioxide.', `
    ${a.svg}
    ${T(600, 210, `${gsw} ≈ ${it('E')} / (${w('i')} − ${w('a')})`, 'fk07-eq', 'middle')}
    ${T(600, 330, `${ci} ≈ ${ca} − 1.6 ${it('A')} / ${gsw}`, 'fk07-eq', 'middle')}
    ${T(600, 372, '1.6: H₂O diffuses 1.6 × faster than CO₂', 'fk07-s', 'middle')}
    ${T(600, 470, 'boundary layer neglected', 'fk07-s', 'middle')}
    ${credit(780, 590, `${CR.path}; relations simplified from Busch et al. 2024`)}
  `);
}

/* g · Busch et al. 2024 Fig. 2 with the typical values of Cₐ, Cᵢ and Cc at 25 °C (their Table 1) */
// PATH asset: Cₐ label (30, 640), Cᵢ (480, 635), Cc (845, 635); stomatal pore between the epidermal cells at u 270–380.

function drawG(): string {
  const a = shot('fk07g-a', PATH, 89, 10, 622, { fig: true });
  const y = a.at(0, 735)[1];
  return realSvg('Busch and colleagues 2024, figure 2: the path of carbon dioxide from the air into a chloroplast. From the air outside, carbon dioxide at concentration Ca crosses the boundary layer and the stomatal pore between epidermal cells into the intercellular air space, where its concentration is Ci; it then crosses the cell wall, plasma membrane and chloroplast envelope into the stroma, where RuBisCO meets it at concentration Cc. Water vapour leaves along the same path. Conductances: boundary layer, stomatal and mesophyll. Pills give typical values at 25 degrees: Ca 420, Ci 300, Cc 200 micromoles per mole.', `
    ${a.svg}
    ${pill(a.at(30, 0)[0] + 40, y, '420 µmol mol⁻¹')}
    ${pill(a.at(480, 0)[0], y, '300 µmol mol⁻¹')}
    ${pill(a.at(845, 0)[0], y, '200 µmol mol⁻¹')}
    ${credit(780, 584, `${CR.path}; values at 25 °C: Busch et al. 2024, Table 1`)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
