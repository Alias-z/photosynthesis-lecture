// Slide 6 · Antenna: energy path to the reaction centre (redo of 27 Oct 2026, built from real figures and our own render).
// Sources and numbers: research/redo-2026-10-27/A_LIGHT_6-11.md, slide 6. Chl b → Chl a ≈ 1 ps and ≈ 150 ps from absorption
// to charge separation in PSII (Croce & van Amerongen 2014, Fig. 4 caption); PSI–LHCI traps in ≈ 50 ps, its core holds ≈ 100 Chl,
// red forms absorb below P700 and emit ≈ 730 nm at 77 K, bulk Chl a absorbs ≈ 680 nm, P700 ≈ 700 nm, and energy in the red forms
// must go uphill with thermal energy (Croce & van Amerongen 2013, PSI review text and Figs. 1, 3, 4). The 5XNL path is one
// nearest-neighbour route through the structure (19 hops, Mg–Mg 0.9–2.4 nm), an illustration, not a measured path; it follows
// Kouřil et al. 2012's route (2), M-LHCII → CP29 → CP47 → RC. Kouřil Fig. 2 key from its verbatim caption (redo/fetched/kouril2012/NOTES.md):
// Chl a green, Chl b blue, carotenoids orange, RC chlorophylls and pheophytins yellow; arrows RC ⇄ CP43/CP47 yellow, within the
// supercomplex blue, to or from neighbouring (super)complexes green; grey bars = pigment-free low-molecular-mass subunits.
// Crops, sources and licences: assets/SOURCES-L1a.md.
import type { PlateText, Variant } from '../types';
import pathJpg from '../../assets/photos/6-path.jpg';
import wholeJpg from '../../assets/photos/6-path-whole.jpg';
import kourilJpg from '../../assets/photos/6-kouril.jpg';
import walkPng from '../../assets/photos/6-walk.png';
import psiJpg from '../../assets/photos/6-psi-lhci.jpg';
import psiRoutesJpg from '../../assets/photos/6-psi-routes.jpg';
import redPng from '../../assets/photos/6-redforms.png';
import levelsPng from '../../assets/photos/4b-levels.png';
import './s06.css';

export const PLATE: PlateText = {
  n: '6',
  title: 'Antenna of photosystem II',
  status: 'draft',
  lead: 'Antenna pigments collect light and pass the energy to a reaction centre, which traps it.',
  points: [
    { claim: 'Photosynthetic unit.', text: 'Most chlorophylls only collect light', eq: '1 flash: ≈ 2,500 Chl → 1 O₂<br>1 O₂ needs 8 turnovers (4 at PSII + 4 at PSI), 1 per centre per flash<br>≈ 2,500 ÷ 8 ≈ 300 Chl per reaction centre' },
    { claim: 'Excitation energy transfer.', text: 'Carotenoids and Chl <i>b</i> pass energy downhill to Chl <i>a</i>' },
    { claim: 'Antenna size.', text: 'Shade leaves build more light-harvesting complexes (LHCII, LHCI) per reaction centre' },
  ],
  refs: [
    { label: 'Su et al. 2017', url: 'https://doi.org/10.1126/science.aan0327' },
    { label: 'Kouřil et al. 2012', url: 'https://doi.org/10.1016/j.bbabio.2011.05.024' },
    { label: 'Croce & van Amerongen 2014', url: 'https://doi.org/10.1038/nchembio.1555' },
    { label: 'Croce & van Amerongen 2013', url: 'https://doi.org/10.1007/s11120-013-9838-x' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Transfer path in PSII–LHCII (PDB 5XNL)' },
  { id: 'b', name: 'Transfer routes: PSII–LHCII and PSI–LHCI' },
  { id: 'c', name: 'Random walk in PSII; red forms in PSI' },
  { id: 'd', name: 'Energy levels: Chl b → Chl a → P680, P700 (drawn)' },
  { id: 'e', name: 'Energy levels (Croce 2014) and 5XNL path' },
  { id: 'f', name: 'Energy-transfer routes in PSII–LHCII (Kouřil 2012)' },
  { id: 'g', name: 'PSII–LHCII and PSI–LHCI structures' },
];

/* ---------- shared parts (after figs/l04b.ts u–z: shot, pill, credit, realSvg) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number; s: number }
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fs06-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** A subscript inside SVG text (for letters that have no Unicode subscript). */
const sb = (s: string): string => `<tspan class="fs06-sub" dy="5">${s}</tspan><tspan dy="-5">​</tspan>`;

/** A real image: window win = [u0, v0, width, height] (image pixels) shown w wide at x, y. A photo or render sits in a rounded
 *  frame, optionally with a dark credit band; a published figure ('fig') keeps its white ground multiplied into the page.
 *  `hole` = [u0, v0, u1, v1] leaves one corner out of the crop (a panel letter). at() maps image pixels to the figure. */
function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; credit?: string; bw?: number; hole?: [number, number, number, number] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  let band = '';
  if (o.credit) {
    const bw = o.bw ?? w, by = y + h - 22;
    band = `<rect class="fs06-credbg" x="${f(x + w - bw)}" y="${f(by)}" width="${f(bw)}" height="22"/>${T(x + w - 8, by + 15.5, o.credit, 'fs06-cr', 'end')}`;
  }
  const hl = o.hole ? (([a, b, c, d]) => ` M${f(ox + a * s)},${f(oy + b * s)} H${f(ox + c * s)} V${f(oy + d * s)} H${f(ox + a * s)}Z`)(o.hole) : '';
  const clip = o.fig
    ? `<clipPath id="${id}"><path clip-rule="evenodd" d="M${f(x)},${f(y)} h${f(w)} v${f(h)} h${f(-w)}Z${hl}"/></clipPath>`
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fs06-mult"' : ''}>${img}${band}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h, s };
}
/** A leader onto an image: dark line in a light halo, ending in a dot. */
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fs06-ldh" d="${d}"/><path class="fs06-ldk" d="${d}"/><circle class="fs06-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
const vis = (s: string): number => s.replace(/<[^>]+>/g, '').replace(/​/g, '').length;
/** A label pill centred at (x, y): 'w' white (on images), 't' tinted (on white-ground figures), 'm' amber (a time);
 *  with `to`, a leader from its edge (several targets allowed). */
function pill(x: number, y: number, s: string, to?: Pt | Pt[], kind: 'w' | 't' | 'm' = 'w'): string {
  const w = vis(s) * 8.8 + 22;
  const tos = to === undefined ? [] : (Array.isArray(to[0]) ? to as Pt[] : [to as Pt]);
  const ld = tos.map(p => {
    const dx = p[0] - x, dy = p[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    return pleader([x + dx * t, y + dy * t], p);
  }).join('');
  return `${ld}<rect class="fs06-pill-${kind}" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>${T(x, y + 6, s, 'fs06-pill', 'middle')}`;
}
/** Grey credit line under a published figure. */
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fs06-crd', a);
/** A panel heading. */
const head = (x: number, y: number, s: string, a: A = 'start'): string => T(x, y, s, 'fs06-h', a);
const realSvg = (label: string, body: string): string =>
  `<svg class="fig-svg fs06" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/* ---------- images (sizes in pixels of the asset files; anchors from the render page or read off the figures) ---------- */

const PATH: Img = { href: pathJpg, w: 1400, h: 781 };
const WHOLE: Img = { href: wholeJpg, w: 1400, h: 929 };
const KOURIL: Img = { href: kourilJpg, w: 1100, h: 1128 };
const WALK: Img = { href: walkPng, w: 456, h: 618 };
const PSI: Img = { href: psiJpg, w: 708, h: 520 };
const PSIR: Img = { href: psiRoutesJpg, w: 774, h: 579 };
const RED: Img = { href: redPng, w: 661, h: 539 };
const LEVELS: Img = { href: levelsPng, w: 568, h: 618 };

/** 6-path.jpg (zoomed render, 1400 × 781): positions written out by the render page (work/render/energy-path.html). */
const ZA = {
  p680: [116.7, 477.1] as Pt, ring: 57.2, cp29: [678.9, 598.1] as Pt, cp47: [385.4, 626.0] as Pt, lhc: [1076.0, 506.9] as Pt,
  path: [[1300.6, 635.9], [1246.9, 583.6], [1216.8, 570.5], [1163.2, 514.2], [1184.1, 434.4], [1048.0, 426.5], [1002.2, 450.1],
    [880.6, 438.3], [783.7, 515.5], [714.4, 447.5], [667.3, 535.1], [605.8, 592.7], [612.3, 664.7], [556.1, 651.6], [446.2, 666.0],
    [414.8, 570.5], [348.0, 501.1], [358.5, 376.8], [174.0, 417.4], [143.9, 492.0]] as Pt[],
};
/** 6-path-whole.jpg (whole C₂S₂M₂, 1400 × 929). */
const WA = { p680: [665.6, 311.3] as Pt, ring: 42.4, lhcm: [1191.1, 320.9] as Pt, lhcs: [290.6, 302.4] as Pt, start: [1323.6, 380.5] as Pt, cp43: [542.5, 221.5] as Pt, cp47: [808.9, 395.1] as Pt };

const CR = {
  own: 'Own render · PDB 5XNL, pea (Su et al. 2017)',
  kouril: 'Kouřil, Dekker & Boekema 2012, BBA, Fig. 2 · © Elsevier',
  walk: 'Croce & van Amerongen 2014, Nat Chem Biol, Fig. 4a · © Springer Nature',
  levels: 'Croce & van Amerongen 2014, Nat Chem Biol, Fig. 4b · © Springer Nature',
  psi: 'Croce & van Amerongen 2013, Photosynth Res, Fig. 1 · CC BY',
  psir: 'Croce & van Amerongen 2013, Photosynth Res, Fig. 4 · CC BY',
  red: 'Croce & van Amerongen 2013, Photosynth Res, Fig. 3 · CC BY',
};

/** Disc key for the render: Chl a dark, Chl b light (the render's own colours), and the path. */
function key(x: number, y: number, path = true): string {
  return `<circle class="fs06-chla" cx="${f(x + 9)}" cy="${f(y - 6)}" r="9"/>${T(x + 26, y, 'Chl <tspan font-style="italic">a</tspan>', 'fs06-k')}
    <circle class="fs06-chlb" cx="${f(x + 111)}" cy="${f(y - 6)}" r="9"/>${T(x + 128, y, 'Chl <tspan font-style="italic">b</tspan>', 'fs06-k')}
    ${path ? `<path class="fs06-pathk" d="M${f(x + 214)},${f(y - 6)} h40"/>${T(x + 264, y, 'one possible path: 19 hops, Mg–Mg 0.9–2.4 nm', 'fs06-k')}` : ''}`;
}

/* a · the transfer path on the structure, large: PSII–LHCII seen from the stroma */

function drawA(): string {
  const p = 'fs06a';
  const a = shot(`${p}-a`, PATH, 10, 64, 780);
  const at = (q: Pt): Pt => a.at(q[0], q[1]);
  const [rx, ry] = at(ZA.p680), rr = ZA.ring * a.s;
  return realSvg('Our render of the pea photosystem II supercomplex with its light-harvesting complexes, seen from the stroma: dark discs are chlorophyll a, light discs chlorophyll b, each at its position in the structure. An orange path of 19 hops runs from a chlorophyll b in the outer antenna LHCII through chlorophyll a in LHCII, CP29 and CP47 to the reaction-centre chlorophylls P680. Chlorophyll b to chlorophyll a takes about 1 picosecond; absorption to P680 about 150 picoseconds on average.', `
    ${T(12, 46, 'seen from the stroma', 'fs06-note')}
    ${a.svg}
    ${pill(rx + 8, ry + rr + 40, 'P680', [rx + 4, ry + rr + 2])}
    ${pill(176, 112, 'absorption → P680: ≈ 150 ps', [rx + rr * 0.7, ry - rr * 0.75], 'm')}
    ${pill(at(ZA.cp47)[0] + 10, 474, 'CP47')}${pill(at(ZA.cp29)[0] + 10, 474, 'CP29')}${pill(at(ZA.lhc)[0] + 70, 212, 'LHCII')}
    ${pill(752, 474, 'Chl <tspan font-style="italic">b</tspan>', at(ZA.path[0]))}
    ${pill(590, 474, 'Chl <tspan font-style="italic">b</tspan> → Chl <tspan font-style="italic">a</tspan>: ≈ 1 ps', [at(ZA.path[2])[0] - 4, at(ZA.path[2])[1] + 8], 'm')}
    ${key(14, 534)}
    ${credit(788, 590, CR.own)}
  `);
}

/* b · transfer routes: PSII–LHCII (Kouřil 2012, Fig. 2) beside PSI–LHCI (Croce & van Amerongen 2013, Fig. 4) */

function arrowKey(x: number, y: number, cls: string, s: string): string {
  return `<path class="fs06-ak ${cls}" d="M${f(x)},${f(y - 6)} h34"/><path class="fs06-akh ${cls}" d="M${f(x - 2)},${f(y - 6)} l9,-7 v14z M${f(x + 36)},${f(y - 6)} l-9,-7 v14z"/>${T(x + 46, y, s, 'fs06-k')}`;
}
/** Kouřil's arrow key, from the caption: RC ⇄ core antenna (yellow), within the supercomplex (blue), to neighbours (green). */
const kouKey = (x: number, y: number, dy = 28): string =>
  arrowKey(x, y, 'fs06-ky', 'RC ⇄ CP43, CP47') + arrowKey(x, y + dy, 'fs06-kb', 'within the supercomplex') + arrowKey(x, y + 2 * dy, 'fs06-kg', 'to neighbouring complexes');

function drawB(): string {
  const p = 'fs06b';
  const a = shot(`${p}-a`, KOURIL, 14, 50, 420, { credit: 'Kouřil et al. 2012, BBA · © Elsevier' });
  const b = shot(`${p}-b`, PSIR, 456, 66, 330, { fig: true });
  const l3 = b.at(650, 400), l4 = b.at(270, 505);
  return realSvg('Left: energy-transfer routes in one half of the plant photosystem II supercomplex (Kouřil et al. 2012): yellow double arrows between the reaction centre and the core antennas CP43 and CP47, blue arrows within the supercomplex, green arrows to neighbouring complexes. About 150 picoseconds from absorption to P680. Right: energy transfer in photosystem I with its light-harvesting belt Lhca1 to Lhca4 (Croce and van Amerongen 2013); arrow width shows the rate; Lhca3 and Lhca4 carry the red forms. About 50 picoseconds to P700.', `
    ${head(14, 36, 'PSII–LHCII')}${head(456, 36, 'PSI–LHCI')}
    ${a.svg}${b.svg}${pill(a.at(250, 1050)[0] + 20, a.at(0, 1050)[1], 'absorption → P680: ≈ 150 ps', undefined, 'm')}
    ${kouKey(24, 506)}
    ${pill(612, 340, 'red forms: Lhca3, Lhca4', [[l3[0] - 8, l3[1] + 12], [l4[0] + 6, l4[1] - 4]], 't')}
    ${pill(612, 384, 'arrow width = rate', undefined, 't')}
    ${pill(612, 436, 'absorption → P700: ≈ 50 ps', undefined, 'm')}
    ${credit(786, 592, CR.psir)}
  `);
}

/* c · the random walk in PSII (Croce & van Amerongen 2014, Fig. 4a) beside the PSI red forms (2013, Fig. 3) */

function drawC(): string {
  const p = 'fs06c';
  const a = shot(`${p}-a`, WALK, 20, 52, 372, { fig: true, hole: [0, 0, 26, 40] });
  const r = shot(`${p}-r`, RED, 446, 92, 320, { fig: true });
  // the spectrum: 3.67 px per nm, 700 nm at x = 294 of the crop; value 1 at y = 51, 0 at y = 537
  const X = (nm: number): number => r.at(294 + (nm - 700) * 3.67, 0)[0];
  const Y = (v: number): number => r.at(0, 537 - v * 486)[1];
  const ticks = [650, 700, 750, 800].map(nm => `<path class="fs06-tick" d="M${f(X(nm))},${f(Y(0))} v7"/>${T(X(nm), Y(0) + 26, `${nm}`, 'fs06-ax', 'middle')}`).join('');
  return realSvg('Left: one simulated excitation path (yellow) through the photosystem II supercomplex to a reaction centre (red); chlorophyll a green, chlorophyll b blue; 5 nanometre scale bar (Croce and van Amerongen 2014). Right: absorption and 77 kelvin fluorescence of the photosystem I antenna dimers Lhca1/4 and Lhca2/3: absorption peaks at about 680 nanometres, emission at about 730 nanometres, the red forms. Photosystem I traps in about 50 picoseconds.', `
    ${head(20, 36, 'PSII–LHCII')}${head(446, 36, 'PSI antenna: Lhca1/4, Lhca2/3')}
    ${a.svg}
    ${pill(250, 92, 'simulated excitation path', a.at(146, 92), 't')}
    ${pill(84, 150, 'Chl <tspan font-style="italic">b</tspan>', a.at(38, 185), 't')}${pill(318, 452, 'Chl <tspan font-style="italic">a</tspan>', a.at(292, 352), 't')}${pill(330, 362, 'RC', a.at(287, 300), 't')}
    ${credit(20, 592, CR.walk, 'start')}
    ${r.svg}
    <path class="fs06-axl" d="M${f(r.at(0, 0)[0])},${f(Y(0))} H${f(r.at(661, 0)[0])}"/>${ticks}
    ${T((X(650) + X(800)) / 2, Y(0) + 50, 'wavelength (nm)', 'fs06-ax', 'middle')}
    <text class="fs06-ax" transform="translate(${f(r.at(0, 0)[0] - 12)} ${f((Y(0) + Y(1)) / 2)}) rotate(-90)" text-anchor="middle">absorption</text>
    <text class="fs06-ax" transform="translate(${f(r.at(661, 0)[0] + 18)} ${f((Y(0) + Y(1)) / 2)}) rotate(90)" text-anchor="middle">fluorescence, 77 K</text>
    ${pill(500, 70, 'absorption ≈ 680 nm', [X(679), Y(1) + 2], 't')}
    ${pill(694, 70, 'red forms ≈ 730 nm', [X(729), Y(1) + 2], 't')}
    <path class="fs06-lred" d="M${f(470)},476 h28"/>${T(506, 482, 'Lhca1/4', 'fs06-k')}<path class="fs06-lblk" d="M${f(600)},476 h28"/>${T(636, 482, 'Lhca2/3', 'fs06-k')}
    ${pill(606, 520, 'absorption → P700: ≈ 50 ps', undefined, 'm')}
    ${credit(780, 556, CR.red)}
  `);
}

/* d · drawn: S₁ energy levels of the PSII and PSI antennas (after Croce & van Amerongen 2014, Fig. 4b, and 2013, Figs. 3, 4) */

function drawD(): string {
  const e = (nm: number): number => 1239.84 / nm;
  const top = e(640), bot = e(712), Y = (nm: number): number => 92 + ((top - e(nm)) / (top - bot)) * 420;
  const lvl = (x: number, nm: number, cls: string, w = 120): string => `<path class="${cls}" d="M${f(x - w / 2)},${f(Y(nm))} h${w}"/>`;
  const band = (x: number, a: number, b: number, cls: string, w = 120): string =>
    `<rect class="${cls}" x="${f(x - w / 2)}" y="${f(Y(a))}" width="${w}" height="${f(Y(b) - Y(a))}" rx="3"/>`;
  const dn = (x: number, a: number, b: number, cls = 'fs06-dar'): string => `<path class="${cls}" d="M${f(x)},${f(Y(a) + 4)} V${f(Y(b) - 9)}" marker-end="url(#fs06d-ar)"/>`;
  const ticks = [650, 680, 700].map(nm => `<path class="fs06-tick" d="M70,${f(Y(nm))} h-7"/>${T(58, Y(nm) + 6, `${nm} nm`, 'fs06-ax', 'end')}`).join('');
  const x2 = 235, x1 = 560;
  return `<svg class="fig-svg fs06" viewBox="0 0 800 600" role="img" aria-label="Energy of the lowest excited state S1 of the antenna pigments, drawn after Croce and van Amerongen. Photosystem II: chlorophyll b at about 650 nanometres lies above chlorophyll a, which lies near P680; chlorophyll b to chlorophyll a takes about 1 picosecond; absorption to charge separation about 150 picoseconds. Photosystem I: chlorophyll b above bulk chlorophyll a near 680 nanometres, which lies above P700 at 700 nanometres; about 50 picoseconds to trapping.">
    <defs><marker id="fs06d-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path class="fs06-hd" d="M0,0L10,5L0,10z"/></marker>
      <marker id="fs06d-arg" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path class="fs06-hdu" d="M0,0L10,5L0,10z"/></marker>
      <marker id="fs06d-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path class="fs06-hdr" d="M0,0L10,5L0,10z"/></marker></defs>
    <path class="fs06-axl" d="M70,522 V78" marker-end="url(#fs06d-arg)"/>
    ${T(78, 70, 'S₁ energy', 'fs06-ax')}
    ${ticks}
    ${head(x2, 52, 'PSII', 'middle')}${head(x1, 52, 'PSI', 'middle')}
    ${lvl(x2, 650, 'fs06-lb')}${T(x2 + 70, Y(650) + 6, 'Chl <tspan font-style="italic">b</tspan>', 'fs06-lv')}
    ${band(x2, 668, 680, 'fs06-ba')}${T(x2 + 70, Y(674) + 6, 'Chl <tspan font-style="italic">a</tspan>', 'fs06-lv')}
    ${lvl(x2, 680, 'fs06-lp', 60)}${T(x2 - 40, Y(680) + 26, 'P680', 'fs06-lv', 'end')}
    ${dn(x2 - 30, 650, 668)}${pill(x2 - 92, (Y(650) + Y(668)) / 2, '≈ 1 ps', undefined, 'm')}
    ${pill(x2, 556, 'absorption → P680: ≈ 150 ps', undefined, 'm')}
    ${lvl(x1, 650, 'fs06-lb')}${T(x1 + 70, Y(650) + 6, 'Chl <tspan font-style="italic">b</tspan>', 'fs06-lv')}
    ${band(x1, 674, 686, 'fs06-ba')}${T(x1 + 70, Y(680) + 6, 'Chl <tspan font-style="italic">a</tspan>', 'fs06-lv')}
    ${lvl(x1, 700, 'fs06-lp', 60)}${T(x1 - 40, Y(700) + 6, 'P700', 'fs06-lv', 'end')}
    ${dn(x1 - 30, 650, 674)}${dn(x1, 686, 700)}
    ${pill(x1 + 40, 556, 'absorption → P700: ≈ 50 ps', undefined, 'm')}
    ${T(780, 594, 'drawn after Croce & van Amerongen 2014, Fig. 4b, and 2013', 'fs06-crd', 'end')}
  </svg>`;
}

/* e · the energy ladder from the paper (Croce & van Amerongen 2014, Fig. 4b) beside the start of the 5XNL path in LHCII.
 *  Note: 4b-levels.png is the same panel as slide 4a's variants v and y (not picked there). */

function drawE(): string {
  const p = 'fs06e';
  const a = shot(`${p}-a`, LEVELS, 18, 60, 352, { fig: true, hole: [0, 0, 24, 37] });
  const b = shot(`${p}-b`, PATH, 398, 72, 384, { win: [800, 250, 600, 531] });
  const s0 = b.at(...ZA.path[0]), s3 = b.at(...ZA.path[3]), s8 = b.at(...ZA.path[8]);
  return realSvg('Left: simplified energy levels of the pigments of photosystem II (Croce and van Amerongen 2014): chlorophyll b (blue), carotenoid (orange) and chlorophyll a (green), each with its ground state S0, first excited state S1 and higher excited states Sn; arrows give transfer rates in per picosecond; chlorophyll a passes energy to the reaction centre (red). Right: the start of one path in our render of LHCII: from a chlorophyll b to chlorophyll a within about 1 picosecond, then on towards CP29, CP47 and P680.', `
    ${head(18, 40, 'energy levels, PSII pigments')}${head(398, 40, 'LHCII, PDB 5XNL')}
    ${a.svg}
    ${pill(110, 486, 'Chl <tspan font-style="italic">b</tspan>', a.at(174, 422), 't')}${pill(196, 528, 'carotenoid', a.at(270, 440), 't')}${pill(290, 486, 'Chl <tspan font-style="italic">a</tspan>', a.at(397, 466), 't')}
    ${pill(342, 528, 'RC', a.at(490, 482), 't')}
    ${pill(150, 566, 'rates in ps⁻¹', undefined, 't')}
    ${credit(18, 592, CR.levels, 'start')}
    ${b.svg}
    ${pill(740, 430, 'Chl <tspan font-style="italic">b</tspan>', s0)}${pill(600, 140, 'Chl <tspan font-style="italic">a</tspan>', s3)}
    ${pill(560, 430, 'Chl <tspan font-style="italic">b</tspan> → Chl <tspan font-style="italic">a</tspan>: ≈ 1 ps', [s3[0] + 10, s3[1] + 30], 'm')}
    ${pill(474, 100, 'to CP29, CP47, P680', [s8[0] + 2, s8[1] - 2])}
    ${credit(782, 474, 'Own render · PDB 5XNL (Su et al. 2017)')}
  `);
}

/* f · Kouřil et al. 2012, Fig. 2, large, with the key of its caption */

function drawF(): string {
  const p = 'fs06f';
  const a = shot(`${p}-a`, KOURIL, 14, 22, 540, { credit: 'Kouřil, Dekker & Boekema 2012, BBA, Fig. 2 · © Elsevier' });
  const dot = (y: number, cls: string, s: string): string => `<circle class="${cls}" cx="584" cy="${y - 6}" r="8"/>${T(600, y, s, 'fs06-k')}`;
  return realSvg('Energy-transfer routes in one half of the plant photosystem II supercomplex C2S2M2 (Kouřil et al. 2012): chlorophyll a green, chlorophyll b blue, carotenoids orange, the reaction-centre chlorophylls and pheophytins yellow. Yellow double arrows link the reaction centre with the core antennas CP43 and CP47, blue arrows run within the supercomplex, green arrows to neighbouring complexes; grey bars mark pigment-free small subunits. About 150 picoseconds from absorption to P680.', `
    ${a.svg}
    ${head(574, 46, 'pigments')}
    ${dot(80, 'fs06-dg', 'Chl <tspan font-style="italic">a</tspan>')}${dot(108, 'fs06-db', 'Chl <tspan font-style="italic">b</tspan>')}${dot(136, 'fs06-do', 'carotenoids')}${dot(164, 'fs06-dy', 'RC: Chl, Pheo')}
    ${head(574, 222, 'routes')}
    ${arrowKey(578, 256, 'fs06-ky', 'RC ⇄ CP43,')}${T(624, 278, 'CP47', 'fs06-k')}
    ${arrowKey(578, 312, 'fs06-kb', 'within the')}${T(624, 334, 'supercomplex', 'fs06-k')}
    ${arrowKey(578, 368, 'fs06-kg', 'to neighbouring')}${T(624, 390, 'complexes', 'fs06-k')}
    ${pill(670, 452, '≈ 150 ps to P680', undefined, 'm')}
  `);
}

/* g · the two photosystems: our PSII–LHCII render (one half, with the path) above PSI–LHCI with its red forms (Croce 2013, Fig. 1) */

function drawG(): string {
  const p = 'fs06g';
  const a = shot(`${p}-a`, WHOLE, 10, 44, 780, { win: [0, 30, 1400, 470] });
  const b = shot(`${p}-b`, PSI, 10, 346, 316, { fig: true });
  const [rx, ry] = a.at(...WA.p680), rr = WA.ring * a.s;
  return realSvg('Top: our render of the pea photosystem II supercomplex seen from the stroma, one half, chlorophyll a dark and b light, with one path from the outer antenna LHCII through CP29 and CP47 to P680; about 150 picoseconds from absorption to P680. Bottom: the pea photosystem I supercomplex with its belt of four Lhca antenna proteins (Croce and van Amerongen 2013); the core alone holds about 100 chlorophylls; the chlorophylls of the red forms in Lhca3 and Lhca4 are drawn as spheres; about 50 picoseconds to P700.', `
    ${head(10, 30, 'PSII–LHCII')}
    ${a.svg}
    ${pill(rx - 4, ry + rr + 36, 'P680', [rx, ry + rr])}${pill(a.at(...WA.lhcm)[0] + 70, 72, 'LHCII')}${pill(a.at(...WA.lhcs)[0], 72, 'LHCII')}
    ${pill(a.at(...WA.cp43)[0], 72, 'CP43')}${pill(a.at(...WA.cp47)[0] + 20, 290, 'CP47')}
    ${head(10, 342, 'PSI–LHCI')}
    ${b.svg}
    ${pill(452, 402, 'core ≈ 100 Chl', b.at(330, 205), 't')}
    ${pill(470, 456, 'red forms: Lhca3, Lhca4', [b.at(214, 410), b.at(500, 352)], 't')}
    ${key(330, 336, false)}${pill(660, 330, 'absorption → P680: ≈ 150 ps', undefined, 'm')}
    ${pill(640, 510, 'absorption → P700: ≈ 50 ps', undefined, 'm')}
    ${credit(786, 566, CR.own)}${credit(786, 590, CR.psi)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
