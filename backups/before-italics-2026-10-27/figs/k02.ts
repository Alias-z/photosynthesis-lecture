// Slide C2 · Discovery: Rubisco fixes CO₂ (lecture 2 redo, 27 Oct 2026; research/redo-2026-10-27/C_CYCLE_RUBISCO.md).
// Real figures: Calvin's Nobel lecture 1961, Fig. 3 (the "lollipop"), Fig. 6 (5 s chromatogram) and Fig. 5 (30 s),
// © The Nobel Foundation 1961 (nobelprize.org terms: non-profit teaching use, figure unaltered, © and
// www.nobelprize.org given; the scans are shown whole, only labelled beside them). Rubisco: D. S. Goodsell, PDB-101
// Molecule of the Month 11 (spinach L₈S₈, PDB 1RCX; Rhodospirillum rubrum L₂, PDB 9RUB), CC BY 4.0; RCSB PDB image of
// 8RUC (activated spinach Rubisco, Andersson 1996), free use citing RCSB PDB and the PDB ID. Drawn: RuBP + CO₂ → 2 × 3-PGA
// as carbon boxes; the only place the carboxylation is written out. Crops and credits: assets/SOURCES-L2a.md.
import type { PlateText, Variant } from '../types';
import lolPng from '../../assets/photos/c2-lollipop.png';
import s5Png from '../../assets/photos/c2-5s.png';
import s30Png from '../../assets/photos/c2-30s.png';
import goodJpg from '../../assets/photos/c2-goodsell.jpg';
import rucJpg from '../../assets/photos/c2-8ruc.jpg';
import './k02.css';

export const PLATE: PlateText = {
  n: 'C2',
  title: 'Carboxylation by Rubisco',
  status: 'draft',
  lead: 'Rubisco attaches CO₂ to the five-carbon sugar RuBP; the product splits into two molecules of 3-phosphoglycerate (3-PGA).',
  points: [
    { claim: 'Discovery.', text: 'Algae given ¹⁴CO₂ for a few seconds carry the label first in 3-PGA (Calvin, Benson, Bassham)<br>Hence the name C₃ photosynthesis' },
    { claim: 'Rubisco.', text: 'A slow enzyme: a few CO₂ per second per active site<br>Leaves invest a large share of their protein and nitrogen in it' },
    { claim: 'Carboxylation.', text: 'RuBP + CO₂ → 2 × 3-PGA<br>This step uses no ATP or NADPH' },
  ],
  refs: [
    { label: 'Calvin 1961 (Nobel lecture)', url: 'https://www.nobelprize.org/prizes/chemistry/1961/calvin/lecture/' },
    { label: 'Bar-On & Milo 2019', url: 'https://doi.org/10.1073/pnas.1816654116' },
    { label: 'Andersson 1996', url: 'https://doi.org/10.1006/jmbi.1996.0310' },
    { label: 'Goodsell, PDB-101', url: 'https://pdb101.rcsb.org/motm/11' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: '¹⁴C after 5 s and after 30 s' },
  { id: 'b', name: 'Lollipop vessel and the 5 s chromatogram' },
  { id: 'c', name: '3-PGA labelled first, and Rubisco L₈S₈' },
  { id: 'd', name: 'Rubisco: spinach L₈S₈ and bacterial L₂' },
  { id: 'e', name: '30 s chromatogram and spinach Rubisco (8RUC)' },
  { id: 'f', name: 'RuBP + CO₂ → 2 × 3-PGA over the 5 s chromatogram' },
  { id: 'g', name: 'Lollipop, 5 s and 30 s' },
];

/* ---------- shared parts (the 4b u–z helpers, copied into this module with the prefix fk02) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
type Box = [number, number, number, number];
type Ink = 'ink' | 'grey' | 'green' | 'blue' | 'amber' | 'red';
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fk02-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** An italic variable such as A or k. */
const it = (s: string): string => `<tspan class="fk02-it">${s}</tspan>`;
const cw = (c: Ink | 'paper', s: string): string => `<tspan class="fk02-c-${c}">${s}</tspan>`;

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
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fk02-mult"' : ''}>${img}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h, s };
}

/** A leader onto a real image: dark line in a light halo, ending in a dot, so it reads on dark and light ground alike. */
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fk02-ldh" d="${d}"/><path class="fk02-ldk" d="${d}"/><circle class="fk02-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
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
  return `${ld}<rect class="${tint ? 'fk02-pillbg-t' : 'fk02-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>${T(x, y + 6, s, 'fk02-pill', 'middle')}`;
}
/** Grey credit line under a published figure; '|' breaks it onto a second line. */
const credit = (x: number, y: number, s: string, a: A = 'end'): string => s.split('|').map((l, i) => T(x, y + i * 17, l.trim(), 'fk02-crd', a)).join('');

/** Arrowheads in each ink, prefixed per figure (ids must be unique when the gallery shows every variant at once). */
const defs = (p: string): string => `<defs>${(['ink', 'grey', 'green', 'blue', 'amber', 'red'] as Ink[]).map(k =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse"><path class="fk02-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
const ar = (p: string, k: Ink, d: string, cls = ''): string =>
  `<path class="fk02-ar fk02-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;
/** A plain box with a label (and an optional second line), centred at (x, y). */
function node(x: number, y: number, s: string, o: { w?: number; sub?: string; cls?: string; tint?: boolean } = {}): string {
  const w = o.w ?? Math.max(s.replace(/<[^>]+>/g, '').length * 11.6 + 26, o.sub ? o.sub.replace(/<[^>]+>/g, '').length * 9.4 + 26 : 0);
  const h = o.sub ? 60 : 40;
  return `<rect class="${o.tint ? 'fk02-box-t' : 'fk02-box'}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="9"/>`
    + (o.sub ? `${T(x, y - 4, s, o.cls ?? 'fk02-node', 'middle')}${T(x, y + 19, o.sub, 'fk02-s', 'middle')}` : T(x, y + 7.5, s, o.cls ?? 'fk02-node', 'middle'));
}
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fk02" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

/* ---------- C2 parts ---------- */

/* The Nobel scans, whole (1-bit, white ground, multiplied into the page). Spot centres in file pixels, read off the
 * scans: 5 s (Fig. 6) and 30 s (Fig. 5). Origin bottom right; phenol–water runs left, butanol–propionic acid–water up. */
const LOL: Img = { href: lolPng, w: 1082, h: 858 };
const S5: Img = { href: s5Png, w: 1349, h: 1025 };
const S30: Img = { href: s30Png, w: 1348, h: 1053 };
const SP5 = { pga: [975, 708] as Pt, sp: [900, 786] as Pt, sbp: [1105, 846] as Pt, tp: [695, 735] as Pt };
const SP30 = { pga: [930, 695] as Pt, sp: [850, 782] as Pt, suc: [304, 636] as Pt, ala: [64, 496] as Pt, gly: [300, 548] as Pt, asp: [716, 560] as Pt };
const VESSEL: Pt = [452, 360];
/* Goodsell's picture, downscaled to 1400 px: spinach L₈S₈ on the left (x 31–842), R. rubrum L₂ on the right (x 869–1364). */
const GOOD: Img = { href: goodJpg, w: 1400, h: 776 };
const G_LARGE: Pt = [437, 330], G_LARGE_R: Pt = [745, 380], G_LARGE_LL: Pt = [160, 560], G_SMALL: Pt = [312, 622];
const RUC: Img = { href: rucJpg, w: 500, h: 500 };
const NOBEL = '© The Nobel Foundation 1961, www.nobelprize.org';
const CR = {
  n36: `Calvin 1961, Nobel lecture, Figs 3, 6 · ${NOBEL}`,
  n56: `Calvin 1961, Nobel lecture, Figs 6, 5 · ${NOBEL}`,
  n6: `Calvin 1961, Nobel lecture, Fig. 6 · ${NOBEL}`,
  n5: `Calvin 1961, Nobel lecture, Fig. 5 · ${NOBEL}`,
  n356: `Calvin 1961, Nobel lecture, Figs 3, 6, 5 · ${NOBEL}`,
  good: 'D. S. Goodsell, PDB-101 Molecule of the Month 11 (PDB 1RCX, 9RUB) · CC BY 4.0',
  ruc: 'RCSB PDB, PDB ID 8RUC (Andersson 1996)',
};

/** Carbon boxes: n squares of side d from x (top y); `hot` marks the indices that carry ¹⁴C. */
function carbons(x: number, y: number, n: number, d: number, hot: number[] = []): string {
  return Array.from({ length: n }, (_, i) => {
    const bx = x + i * (d + 5), h = hot.includes(i);
    return `<rect class="${h ? 'fk02-c14' : 'fk02-c12'}" x="${f(bx)}" y="${f(y)}" width="${d}" height="${d}" rx="4"/>${h ? T(bx + d / 2, y + d / 2 + 6, '¹⁴C', 'fk02-cl', 'middle') : T(bx + d / 2, y + d / 2 + 6, 'C', 'fk02-cl fk02-c-grey', 'middle')}`;
  }).join('');
}
/** RuBP + CO₂ → 2 × 3-PGA as carbon boxes, centred on cx with the boxes' top at y. */
function equation(p: string, cx: number, y: number, d = 36): string {
  const w = (n: number): number => n * d + (n - 1) * 5, plus = 40, arrow = 128;
  const total = w(5) + plus + d + arrow + w(3) + plus + w(3);
  let x = cx - total / 2;
  const xs = { rubp: x, co2: (x += w(5) + plus), ar0: (x += d + 12), ar1: (x += arrow - 24), pga1: (x += 12), pga2: (x += w(3) + plus) };
  const lab = (x0: number, n: number, s: string): string => T(x0 + w(n) / 2, y + d + 30, s, 'fk02-node', 'middle');
  const sub = (x0: number, n: number, s: string): string => T(x0 + w(n) / 2, y + d + 54, s, 'fk02-s', 'middle');
  return `${carbons(xs.rubp, y, 5, d)}${T(xs.co2 - plus / 2, y + d / 2 + 9, '+', 'fk02-big', 'middle')}${carbons(xs.co2, y, 1, d, [0])}
    ${ar(p, 'ink', `M${f(xs.ar0)},${f(y + d / 2)} L${f(xs.ar1)},${f(y + d / 2)}`)}${T((xs.ar0 + xs.ar1) / 2, y + d / 2 - 14, 'Rubisco', 'fk02-h', 'middle')}
    ${carbons(xs.pga1, y, 3, d, [0])}${T(xs.pga2 - plus / 2, y + d / 2 + 9, '+', 'fk02-big', 'middle')}${carbons(xs.pga2, y, 3, d)}
    ${lab(xs.rubp, 5, 'RuBP')}${sub(xs.rubp, 5, '5 C')}${lab(xs.co2, 1, 'CO₂')}
    ${lab(xs.pga1, 3, '3-PGA')}${sub(xs.pga1, 3, '3 C')}${lab(xs.pga2, 3, '3-PGA')}${sub(xs.pga2, 3, '3 C')}`;
}

/* ---------- a · the two classic chromatograms side by side: 5 s and 30 s ---------- */

function drawA(): string {
  const p = 'fk02a', a = shot(`${p}-a`, S5, 10, 112, 386, { fig: true }), b = shot(`${p}-b`, S30, 404, 112, 386, { fig: true });
  return svg(p, 'Two paper chromatograms of extracts from the alga Chlorella, the radioactive spots made visible on X-ray film. Left: after 5 seconds of photosynthesis with carbon-14 dioxide, the label is mainly in 3-phosphoglycerate (3-PGA) and sugar phosphates. Right: after 30 seconds, it has spread to many compounds, including sucrose and amino acids.', `
    ${a.svg}${b.svg}
    ${pill(203, 76, '5 s in ¹⁴CO₂', undefined, true)}${pill(597, 76, '30 s in ¹⁴CO₂', undefined, true)}
    ${pill(342, 248, '3-PGA', a.at(...SP5.pga), true)}${pill(150, 420, 'sugar phosphates', a.at(...SP5.sp), true)}
    ${pill(735, 248, '3-PGA', b.at(...SP30.pga), true)}${pill(540, 446, 'sucrose', b.at(...SP30.suc), true)}
    ${pill(480, 200, 'amino acids', [b.at(...SP30.ala), b.at(...SP30.gly)], true)}
    ${credit(790, 588, CR.n56)}
  `);
}

/* ---------- b · the apparatus and its result: lollipop vessel, 5 s chromatogram ---------- */

function drawB(): string {
  const p = 'fk02b', a = shot(`${p}-a`, LOL, 10, 120, 372, { fig: true }), b = shot(`${p}-b`, S5, 394, 116, 396, { fig: true });
  return svg(p, 'Left: the lollipop, Calvin’s flat glass vessel holding a suspension of Chlorella in light, into which carbon-14 dioxide was injected; after a set time the algae were dropped into alcohol. Right: the chromatogram after 5 seconds; the label is mainly in 3-phosphoglycerate (3-PGA).', `
    ${a.svg}${b.svg}
    ${pill(196, 82, 'lollipop vessel', a.at(...VESSEL), true)}
    ${T(196, 120 + a.h + 34, `${it('Chlorella')} + ¹⁴CO₂ in light`, 'fk02-l', 'middle')}${T(196, 120 + a.h + 60, 'then ≈ 4 volumes of alcohol', 'fk02-l', 'middle')}
    ${pill(592, 82, '5 s in ¹⁴CO₂', undefined, true)}
    ${pill(740, 250, '3-PGA', b.at(...SP5.pga), true)}${pill(540, 440, 'sugar phosphates', b.at(...SP5.sp), true)}
    ${credit(790, 588, CR.n36)}
  `);
}

/* ---------- c · what was made first (5 s) and the enzyme that makes it (Goodsell, L₈S₈) ---------- */

function drawC(): string {
  const p = 'fk02c', a = shot(`${p}-a`, S5, 8, 112, 432, { fig: true }), g = shot(`${p}-g`, GOOD, 458, 112, 326, { fig: true, win: [25, 25, 830, 735] });
  const cx = 621;
  return svg(p, 'Left: the chromatogram after 5 seconds of carbon-14 dioxide: the label is mainly in 3-phosphoglycerate (3-PGA). Right: the enzyme that makes it, Rubisco from spinach, eight large subunits (orange and red) and eight small subunits (blue and purple), with eight active sites, each fixing about three CO2 per second.', `
    ${a.svg}${g.svg}
    ${pill(224, 76, '5 s in ¹⁴CO₂', undefined, true)}${pill(380, 256, '3-PGA', a.at(...SP5.pga), true)}
    ${pill(cx, 76, 'Rubisco, spinach (L₈S₈)', undefined, true)}
    ${pill(cx - 84, 112 + g.h + 30, 'small subunit', g.at(...G_SMALL), true)}${pill(cx + 84, 112 + g.h + 30, 'large subunit', g.at(...G_LARGE_R), true)}
    ${T(cx, 112 + g.h + 76, '8 active sites, ≈ 3 CO₂ s⁻¹ each', 'fk02-l', 'middle')}
    ${credit(8, 112 + a.h + 24, CR.n6.replace(' · ', ' | '), 'start')}${credit(790, 588, CR.good)}
  `);
}

/* ---------- d · Rubisco large: spinach L₈S₈ beside bacterial L₂ (Goodsell) ---------- */

function drawD(): string {
  const p = 'fk02d', g = shot(`${p}-g`, GOOD, 20, 70, 760, { fig: true });
  const xl = g.at(436, 0)[0], xr = g.at(1116, 0)[0], yb = 70 + g.h;
  return svg(p, 'Two Rubisco structures drawn by David Goodsell. Left: plant Rubisco from spinach, eight large subunits (orange and red) and eight small subunits (blue and purple), about 550 kilodaltons. Right: the smaller Rubisco of the bacterium Rhodospirillum rubrum, two large subunits only.', `
    ${g.svg}
    ${pill(xl, 46, 'spinach: L₈S₈', undefined, true)}${pill(xr, 46, `${it('Rhodospirillum rubrum')}: L₂`, undefined, true)}
    ${pill(130, yb + 26, 'large subunit (475 aa)', g.at(...G_LARGE_LL), true)}${pill(370, yb + 26, 'small subunit (123 aa)', g.at(...G_SMALL), true)}
    ${T(400, yb + 72, '8 active sites per L₈S₈ · ≈ 3 CO₂ s⁻¹ per site · ≈ 0.7 Gt on Earth', 'fk02-l', 'middle')}
    ${credit(780, 588, CR.good)}
  `);
}

/* ---------- e · 30 s chromatogram beside the spinach Rubisco structure (RCSB 8RUC) ---------- */

function drawE(): string {
  const p = 'fk02e', a = shot(`${p}-a`, S30, 8, 100, 462, { fig: true }), r = shot(`${p}-r`, RUC, 486, 130, 298, { fig: true });
  const cx = 632;
  return svg(p, 'Left: the chromatogram after 30 seconds of carbon-14 dioxide: besides 3-phosphoglycerate (3-PGA), the label has reached sucrose and amino acids. Right: spinach Rubisco, eight large and eight small subunits, each chain in its own colour.', `
    ${a.svg}${r.svg}
    ${pill(239, 70, '30 s in ¹⁴CO₂', undefined, true)}
    ${pill(410, 250, '3-PGA', a.at(...SP30.pga), true)}${pill(170, 494, 'sucrose', a.at(...SP30.suc), true)}
    ${pill(130, 206, 'amino acids', [a.at(...SP30.ala), a.at(...SP30.gly)], true)}
    ${pill(cx, 92, 'Rubisco, spinach (PDB 8RUC)', undefined, true)}
    ${T(cx, 130 + r.h + 34, '8 large + 8 small subunits', 'fk02-l', 'middle')}
    ${credit(8, 588, CR.n5, 'start')}${credit(784, 130 + r.h + 64, CR.ruc)}
  `);
}

/* ---------- f · the reaction as carbon boxes above the 5 s chromatogram ---------- */

function drawF(): string {
  const p = 'fk02f', b = shot(`${p}-b`, S5, 170, 210, 460, { fig: true });
  return svg(p, 'Top, drawn as carbon boxes: Rubisco adds one carbon-14 dioxide to ribulose-1,5-bisphosphate (RuBP, five carbons), giving two molecules of 3-phosphoglycerate (3-PGA, three carbons each); the new carbon sits in one of them. Below: the chromatogram after 5 seconds, where the label is mainly in 3-PGA.', `
    ${equation(p, 400, 34)}
    ${b.svg}
    ${pill(110, 300, '5 s in ¹⁴CO₂', undefined, true)}${pill(700, 300, '3-PGA', b.at(...SP5.pga), true)}
    ${credit(790, 588, CR.n6)}
  `);
}

/* ---------- g · all three Nobel figures: lollipop above, 5 s and 30 s below ---------- */

function drawG(): string {
  const p = 'fk02g', l = shot(`${p}-l`, LOL, 266, 6, 268, { fig: true });
  const y = 6 + l.h + 34, a = shot(`${p}-a`, S5, 10, y, 382, { fig: true }), b = shot(`${p}-b`, S30, 408, y, 382, { fig: true });
  return svg(p, 'Top: the lollipop vessel in which Chlorella was given carbon-14 dioxide. Below: chromatograms after 5 seconds, with the label mainly in 3-phosphoglycerate (3-PGA), and after 30 seconds, when it has spread to sucrose and other compounds.', `
    ${l.svg}${a.svg}${b.svg}
    ${pill(150, 60, 'lollipop vessel', l.at(...VESSEL), true)}
    ${pill(110, y - 4, '5 s', undefined, true)}${pill(508, y - 4, '30 s', undefined, true)}
    ${pill(342, y + 104, '3-PGA', a.at(...SP5.pga), true)}
    ${pill(740, y + 104, '3-PGA', b.at(...SP30.pga), true)}${pill(500, y + 64, 'sucrose', b.at(...SP30.suc), true)}
    ${credit(790, 592, CR.n356)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
