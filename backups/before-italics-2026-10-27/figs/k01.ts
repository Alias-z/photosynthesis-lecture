// Slide C1 · From light to carbon (lecture 2 redo, 27 Oct 2026; figures from research/redo-2026-10-27/C_CYCLE_RUBISCO.md).
// Real figures: Taylor & Long 2017 Fig. 1b (photosynthetic induction of a wheat flag leaf after 50 → 1200 µmol m⁻² s⁻¹,
// CC BY 4.0) and Stotz et al. 2011 Fig. 2a (tobacco Rubisco activase hexamer model, © Springer Nature, lecture use with
// credit). Drawn: the ferredoxin–thioredoxin system after Michelet et al. 2013 Fig. 3 (CC BY). The four Trx enzymes are
// named on C3, not here. Crops and credits: assets/SOURCES-L2a.md.
import type { PlateText, Variant } from '../types';
import tayJpg from '../../assets/photos/c1-taylor.jpg';
import rcaJpg from '../../assets/photos/c1-rca.jpg';
import './k01.css';

export const PLATE: PlateText = {
  n: 'C1',
  title: 'From light to carbon',
  status: 'draft',
  lead: 'In the stroma, the Calvin–Benson cycle uses ATP and NADPH from the light reactions to fix CO₂ into sugar.',
  points: [
    { claim: 'ATP and NADPH.', text: 'Made on the thylakoids, used in the stroma<br>Returned as ADP, Pᵢ and NADP⁺ to the light reactions' },
    { claim: 'Light activation.', text: 'Light switches on cycle enzymes via ferredoxin and thioredoxin<br>Rubisco activase prepares Rubisco, using ATP' },
    { claim: 'Photosynthetic induction.', text: 'After shade, CO₂ fixation takes minutes to reach full rate<br>Slow Rubisco activation costs crops carbon in fluctuating light' },
  ],
  refs: [
    { label: 'Taylor & Long 2017', url: 'https://doi.org/10.1098/rstb.2016.0543' },
    { label: 'Stotz et al. 2011', url: 'https://doi.org/10.1038/nsmb.2171' },
    { label: 'Michelet et al. 2013', url: 'https://doi.org/10.3389/fpls.2013.00470' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Photosynthetic induction in wheat' },
  { id: 'b', name: 'Induction and Rubisco activase' },
  { id: 'c', name: 'Ferredoxin–thioredoxin system (drawn)' },
  { id: 'd', name: 'Induction and the thioredoxin pathway' },
  { id: 'e', name: 'Rubisco activase hexamer' },
  { id: 'f', name: 'Light activation: thioredoxin and Rca' },
];

/* ---------- shared parts (the 4b u–z helpers, copied into this module with the prefix fk01) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
type Box = [number, number, number, number];
type Ink = 'ink' | 'grey' | 'green' | 'blue' | 'amber' | 'red';
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fk01-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** An italic variable such as A or k. */
const it = (s: string): string => `<tspan class="fk01-it">${s}</tspan>`;
const cw = (c: Ink | 'paper', s: string): string => `<tspan class="fk01-c-${c}">${s}</tspan>`;

interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number; s: number }
/** A real image: the window win = [u0, v0, width, height] of it (image pixels) shown w wide at x, y, its height following
 *  (never stretched). A published figure ('fig') multiplies its white ground into the page; a micrograph keeps its own
 *  ground in a frame with rounded corners. `holes` = [u0, v0, u1, v1] boxes left out of the crop (panel letters).
 *  at() maps image pixels to the figure. */
function shot(id: string, im: Img, x: number, y: number, w: number, o: { win?: Box; fig?: boolean; holes?: Box[] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s, r = o.fig ? 0 : 8;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  const hl = (o.holes ?? []).map(([a, b, c, d]) => ` M${f(ox + a * s)},${f(oy + b * s)} H${f(ox + c * s)} V${f(oy + d * s)} H${f(ox + a * s)}Z`).join('');
  const outer = `M${f(x + r)},${f(y)} H${f(x + w - r)} Q${f(x + w)},${f(y)} ${f(x + w)},${f(y + r)} V${f(y + h - r)} Q${f(x + w)},${f(y + h)} ${f(x + w - r)},${f(y + h)} H${f(x + r)} Q${f(x)},${f(y + h)} ${f(x)},${f(y + h - r)} V${f(y + r)} Q${f(x)},${f(y)} ${f(x + r)},${f(y)}Z`;
  const clip = `<clipPath id="${id}"><path clip-rule="evenodd" d="${outer}${hl}"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fk01-mult"' : ''}>${img}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h, s };
}

/** A leader onto a real image: dark line in a light halo, ending in a dot, so it reads on dark and light ground alike. */
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fk01-ldh" d="${d}"/><path class="fk01-ldk" d="${d}"/><circle class="fk01-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
/** Width of a label pill: the visible characters only (markup such as <tspan> is not counted). */
const pw = (s: string): number => s.replace(/<[^>]+>/g, '').length * 8.7 + 22;
/** A label pill centred at (x, y): white on images, tinted (tint) on the white ground of a figure; with `to`, one leader
 *  (or several) from its edge to the point(s). */
function pill(x: number, y: number, s: string, to?: Pt | Pt[], tint = false): string {
  const w = pw(s), tos: Pt[] = to === undefined ? [] : typeof to[0] === 'number' ? [to as Pt] : (to as Pt[]);
  const ld = tos.map(p => {
    const dx = p[0] - x, dy = p[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    return pleader([x + dx * t, y + dy * t], p);
  }).join('');
  return `${ld}<rect class="${tint ? 'fk01-pillbg-t' : 'fk01-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>${T(x, y + 6, s, 'fk01-pill', 'middle')}`;
}
/** Grey credit line under a published figure; '|' breaks it onto a second line. */
const credit = (x: number, y: number, s: string, a: A = 'end'): string => s.split('|').map((l, i) => T(x, y + i * 17, l.trim(), 'fk01-crd', a)).join('');

/** Arrowheads in each ink, prefixed per figure (ids must be unique when the gallery shows every variant at once). */
const defs = (p: string): string => `<defs>${(['ink', 'grey', 'green', 'blue', 'amber', 'red'] as Ink[]).map(k =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse"><path class="fk01-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
const ar = (p: string, k: Ink, d: string, cls = ''): string =>
  `<path class="fk01-ar fk01-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;
/** A plain box with a label (and an optional second line), centred at (x, y). */
function node(x: number, y: number, s: string, o: { w?: number; sub?: string; cls?: string; tint?: boolean } = {}): string {
  const w = o.w ?? Math.max(s.replace(/<[^>]+>/g, '').length * 11.6 + 26, o.sub ? o.sub.replace(/<[^>]+>/g, '').length * 9.4 + 26 : 0);
  const h = o.sub ? 60 : 40;
  return `<rect class="${o.tint ? 'fk01-box-t' : 'fk01-box'}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="9"/>`
    + (o.sub ? `${T(x, y - 4, s, o.cls ?? 'fk01-node', 'middle')}${T(x, y + 19, o.sub, 'fk01-s', 'middle')}` : T(x, y + 7.5, s, o.cls ?? 'fk01-node', 'middle'));
}
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fk01" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

/* ---------- C1 parts ---------- */

const NB = ' ';
const FLUX = `µmol${NB}m⁻²${NB}s⁻¹`;
const PPM = `µmol${NB}mol⁻¹`;
/** A wavy arrow for light, from (x0, y0) to (x1, y1). */
function wavy(p: string, x0: number, y0: number, x1: number, y1: number, n = 4, amp = 6): string {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60, a = Math.sin(t * n * 2 * Math.PI) * amp * Math.min(1, (1 - t) * 6);
    pts.push(`${i ? 'L' : 'M'}${f(x0 + (x1 - x0) * t - uy * a)},${f(y0 + (y1 - y0) * t + ux * a)}`);
  }
  return `<path class="fk01-ar fk01-k-amber" d="${pts.join('')}" marker-end="url(#${p}-amber)"/>`;
}
const vArrow = (p: string, x: number, y0: number, y1: number, k: Ink = 'ink', cls = ''): string => ar(p, k, `M${x},${y0} L${x},${y1}`, cls);

/* Taylor & Long 2017, Fig. 1b: ticks found in the file. Time 0 → u 135.5, 33.875 px per min; A = 0 → v 529.5, 11.26 px
 * per µmol m⁻² s⁻¹. Grey symbols: shade at 400 µmol mol⁻¹ CO₂; open symbols: shade at 100 µmol mol⁻¹ CO₂, which keeps the
 * stomata open. The panel letter "(b)" is left out. */
const TAY: Img = { href: tayJpg, w: 665, h: 710 };
const TAY_HOLE: Box = [0, 0, 100, 48];
const tu = (t: number): number => 135.5 + 33.875 * t;
const tv = (A: number): number => 529.5 - 11.26 * A;
/* Stotz et al. 2011, Fig. 2a (crop of the left column): top view above, side view below; the letter "a" is left out. */
const RCA: Img = { href: rcaJpg, w: 403, h: 703 };
const RCA_HOLE: Box = [0, 0, 38, 48];
const RCA_TOP: Box = [0, 0, 403, 380];
const CR = {
  tay: 'Taylor & Long 2017, Phil Trans R Soc B, Fig. 1b · CC BY 4.0',
  rca: 'Stotz et al. 2011, Nat Struct Mol Biol, Fig. 2a · © Springer Nature',
  rca2: 'Stotz et al. 2011, Nat Struct Mol Biol, | Fig. 2a · © Springer Nature',
  mich: 'after Michelet et al. 2013, Front Plant Sci, Fig. 3 · CC BY',
};
/** The induction curve with its labels: the light step, ≈ 15 min to maximum A, the two pre-treatments. */
function taylor(p: string, x: number, y: number, w: number, legend = true): { svg: string; h: number } {
  const a = shot(`${p}-tay`, TAY, x, y, w, { fig: true, holes: [TAY_HOLE] });
  const at = (t: number, A: number): Pt => a.at(tu(t), tv(A));
  const [bx0, by] = at(0, 37.5), [bx1] = at(15, 37.5);
  return {
    h: a.h,
    svg: `${a.svg}
    <path class="fk01-axis" d="M${f(bx0)},${f(by + 7)} V${f(by)} H${f(bx1)} V${f(by + 7)}"/>
    ${pill((bx0 + bx1) / 2, by - 22, `≈ 15 min to maximum ${it('A')}`, undefined, true)}
    ${legend ? `${pill(...at(9.3, 12.5), 'ambient CO₂ in shade', at(6, 21.3), true)}${pill(...at(4.6, 33), 'stomata held open', at(3.4, 24.9), true)}` : ''}`,
  };
}

/* ---------- a · the induction curve large, with what the two curves are ---------- */

function drawA(): string {
  const p = 'fk01a', t = taylor(p, 16, 22, 492, false), x = 532;
  const dot = (cy: number, open: boolean): string => `<circle cx="${x + 9}" cy="${cy}" r="7.5" fill="${open ? '#fffdf8' : '#9a9890'}" stroke="#141413" stroke-width="1.6"/>`;
  return svg(p, 'Net CO2 uptake A of a wheat flag leaf against time after the light was raised from 50 to 1200 micromoles per square metre per second. A rises quickly to about 13 to 20 within the first minute, then slowly over about 15 minutes to about 32. Grey symbols: leaf kept in shade at ambient CO2. Open symbols: leaf kept in shade at low CO2, which holds the stomata open; it starts higher but reaches the same rate after 10 minutes. The main limitation is Rubisco activation.', `
    ${t.svg}
    ${T(x, 62, 'wheat flag leaf', 'fk01-h')}
    ${T(x, 104, 'light at 0 min:', 'fk01-l')}${T(x, 130, `50 → 1200 ${FLUX}`, 'fk01-l')}
    ${dot(184, false)}${T(x + 26, 190, 'shade at 400 ' + PPM, 'fk01-s')}${T(x + 26, 212, 'CO₂ (ambient)', 'fk01-s')}
    ${dot(258, true)}${T(x + 26, 264, 'shade at 100 ' + PPM, 'fk01-s')}${T(x + 26, 286, 'CO₂: stomata held open', 'fk01-s')}
    ${T(x, 350, 'main limitation:', 'fk01-l')}${T(x, 378, 'Rubisco activation', 'fk01-h')}
    ${T(x, 420, 'stomata: ≈ 20 % of the limitation', 'fk01-s')}
    ${credit(784, 588, CR.tay)}
  `);
}

/* ---------- b · induction (Taylor & Long) beside the enzyme that activates Rubisco (Stotz) ---------- */

function drawB(): string {
  const p = 'fk01b', t = taylor(p, 8, 24, 470);
  const r = shot(`${p}-rca`, RCA, 496, 44, 290, { fig: true, holes: [RCA_HOLE], win: RCA_TOP });
  const cx = 641, y0 = 44 + r.h + 40;
  return svg(p, 'Left: net CO2 uptake of a wheat flag leaf after a step from shade to full light rises over about 15 minutes. Right: the structure of Rubisco activase from tobacco, a ring of six subunits seen from the top; it uses ATP to remove inhibitory sugar phosphates from Rubisco.', `
    ${t.svg}${r.svg}
    ${T(cx, y0, 'Rubisco activase (Rca)', 'fk01-h', 'middle')}
    ${T(cx, y0 + 28, 'AAA+ ATPase, 6 subunits', 'fk01-l', 'middle')}
    ${T(cx, y0 + 64, 'ATP-driven removal of', 'fk01-s', 'middle')}${T(cx, y0 + 86, 'sugar phosphates from Rubisco', 'fk01-s', 'middle')}
    ${credit(8, 24 + t.h + 26, CR.tay, 'start')}${credit(784, 588, CR.rca)}
  `);
}

/* ---------- c · drawn: light feeds the stroma (ATP, NADPH) and switches enzymes on (Fd → FTR → Trx), after Michelet 2013 ---------- */

function bridge(p: string): string {
  const xs = 196;
  return `
    <rect class="fk01-thy" x="28" y="446" width="744" height="118" rx="58"/>
    ${T(400, 540, 'thylakoid lumen', 'fk01-l', 'middle')}
    ${T(36, 40, 'stroma', 'fk01-h')}${T(36, 66, 'pH ≈ 8 in light', 'fk01-s')}
    ${wavy(p, 58, 330, 158, 424, 4)}${T(52, 316, 'light', 'fk01-h fk01-c-amber')}
    ${node(xs, 446, 'PSI', { tint: true, w: 84 })}
    ${node(xs, 352, 'Fd', { w: 74 })}${node(xs, 262, 'FTR', { w: 84 })}${node(xs, 172, 'Trx', { w: 74 })}
    ${vArrow(p, xs, 424, 376)}${vArrow(p, xs, 330, 286)}${vArrow(p, xs, 240, 196)}
    <rect class="fk01-box-t" x="318" y="70" width="456" height="228" rx="18"/>
    ${T(546, 104, 'Calvin–Benson cycle', 'fk01-h', 'middle')}
    ${node(440, 182, '4 cycle enzymes', { sub: 'S–S → 2 SH: active', w: 196 })}
    ${node(664, 182, 'Rubisco', { sub: 'Rca + ATP: active', w: 176 })}
    ${ar(p, 'ink', `M${xs + 40},172 L336,172`)}
    ${node(448, 362, 'NADPH', { w: 104 })}${ar(p, 'ink', `M${xs + 40},356 L392,358`)}${T(312, 346, 'FNR', 'fk01-s', 'middle')}
    ${vArrow(p, 448, 340, 304)}
    ${node(664, 446, 'ATP synthase', { tint: true, w: 150 })}${node(664, 362, 'ATP', { w: 74 })}
    ${vArrow(p, 664, 424, 386)}${vArrow(p, 664, 340, 304)}
    ${ar(p, 'grey', 'M516,300 L516,338', 'fk01-thin')}${T(526, 334, 'NADP⁺', 'fk01-s fk01-c-grey')}
    ${ar(p, 'grey', 'M722,300 L722,338', 'fk01-thin')}${T(706, 362, 'ADP + Pᵢ', 'fk01-s fk01-c-grey')}
    ${ar(p, 'blue', 'M360,404 L360,500')}${T(372, 494, 'H⁺', 'fk01-h fk01-c-blue')}
    ${ar(p, 'blue', 'M664,540 L664,472')}${T(652, 530, 'H⁺', 'fk01-h fk01-c-blue', 'end')}`;
}

function drawC(): string {
  const p = 'fk01c';
  return svg(p, 'Drawn scheme. In the thylakoid membrane, light drives photosystem I, which reduces ferredoxin (Fd). Fd reduces NADP+ to NADPH through FNR and, through ferredoxin-thioredoxin reductase (FTR), reduces thioredoxin (Trx). Trx reduces disulfide bonds in four Calvin-Benson cycle enzymes, which switches them on. ATP synthase makes ATP, which drives the cycle and Rubisco activase (Rca), which activates Rubisco. NADP+, ADP and phosphate return. Protons pumped into the lumen raise the stroma pH to about 8 in light.', `
    ${bridge(p)}
    ${credit(784, 592, CR.mich)}
  `);
}

/* ---------- d · induction beside the Fd → FTR → Trx chain that switches the enzymes on ---------- */

/** The light-activation chain as a column: light → PSI → Fd → FTR → Trx → the 4 enzymes (S–S → 2 SH). */
function chain(p: string, x: number, y0: number, dy: number): string {
  const ys = [0, 1, 2, 3].map(i => y0 + 46 + i * dy), ye = y0 + 46 + 4 * dy + 10;
  return `${wavy(p, x - 92, y0 - 28, x - 40, ys[0] - 14, 3)}${T(x - 100, y0 - 36, 'light', 'fk01-h fk01-c-amber', 'middle')}
    ${node(x, ys[0], 'PSI', { tint: true, w: 84 })}${node(x, ys[1], 'Fd', { w: 74 })}${node(x, ys[2], 'FTR', { w: 84 })}${node(x, ys[3], 'Trx', { w: 74 })}
    ${ys.slice(0, 3).map(y => vArrow(p, x, y + 22, y + dy - 22)).join('')}${vArrow(p, x, ys[3] + 22, ye - 32)}
    ${node(x, ye, '4 cycle enzymes', { sub: 'S–S → 2 SH: active', w: 200 })}`;
}

function drawD(): string {
  const p = 'fk01d', t = taylor(p, 10, 40, 452);
  return svg(p, 'Left: net CO2 uptake of a wheat flag leaf rises over about 15 minutes after a step from shade to full light. Right: the light-activation chain: light drives photosystem I, which reduces ferredoxin (Fd); ferredoxin-thioredoxin reductase (FTR) passes the electrons to thioredoxin (Trx), which reduces disulfide bonds in four cycle enzymes and switches them on.', `
    ${t.svg}${chain(p, 652, 74, 88)}
    ${credit(10, 40 + t.h + 26, CR.tay, 'start')}${credit(784, 592, CR.mich)}
  `);
}

/* ---------- e · the Rca hexamer large: top and side view ---------- */

function drawE(): string {
  const p = 'fk01e', r = shot(`${p}-rca`, RCA, 36, 16, 318, { fig: true, holes: [RCA_HOLE] }), x = 410;
  return svg(p, 'The structure of Rubisco activase (Rca) from tobacco: a ring of six subunits, each in its own colour, seen from the top and, turned by 90 degrees, from the side. Rca is an AAA+ ATPase that uses ATP to remove inhibitory sugar phosphates from the active sites of Rubisco.', `
    ${r.svg}
    ${pill(...r.at(330, 440), 'side view', undefined, true)}
    ${T(x, 120, 'Rubisco activase (Rca)', 'fk01-big')}
    ${T(x, 154, 'tobacco, hexamer model', 'fk01-l')}
    ${T(x, 226, 'AAA+ ATPase, 6 subunits', 'fk01-h')}
    ${T(x, 268, 'ATP-driven removal of inhibitory', 'fk01-l')}${T(x, 294, 'sugar phosphates from Rubisco', 'fk01-l')}
    ${T(x, 366, 'active Rubisco site:', 'fk01-l')}${T(x, 394, 'lysine carbamate (CO₂) + Mg²⁺', 'fk01-h')}
    ${credit(784, 588, CR.rca)}
  `);
}

/* ---------- f · Rca beside the two light-dependent activations: thioredoxin and Rca ---------- */

function drawF(): string {
  const p = 'fk01f', r = shot(`${p}-rca`, RCA, 16, 100, 330, { fig: true, holes: [RCA_HOLE], win: RCA_TOP }), xr = 676;
  const yr = [150, 270, 404];
  return svg(p, 'Left: the structure of Rubisco activase from tobacco, a ring of six subunits seen from the top. Right: two ways light switches the cycle on. Thioredoxin path: light drives photosystem I, ferredoxin (Fd), ferredoxin-thioredoxin reductase (FTR) and thioredoxin (Trx), which reduces disulfide bonds in four cycle enzymes. Rca path: ATP from the light reactions drives Rca, which activates Rubisco.', `
    ${r.svg}
    ${T(181, 100 + r.h + 34, 'Rubisco activase (Rca)', 'fk01-h', 'middle')}${credit(16, 100 + r.h + 64, CR.rca2, 'start')}
    ${chain(p, 470, 66, 84)}
    ${node(xr, yr[0], 'ATP', { w: 74 })}${node(xr, yr[1], 'Rca', { w: 74 })}${node(xr, yr[2], 'Rubisco', { sub: 'active sites free', w: 170 })}
    ${vArrow(p, xr, yr[0] + 22, yr[1] - 22)}${vArrow(p, xr, yr[1] + 22, yr[2] - 32)}
    ${credit(784, 588, CR.mich)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
