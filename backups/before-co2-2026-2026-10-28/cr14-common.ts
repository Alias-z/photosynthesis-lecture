// Rising CO₂ (slide C14, key cr14): the parts the four stagings (cr14-a … cr14-d) share. Beats: beats-cr.ts CR14.
//   1 Rising CO₂: the Keeling curve, 1959–2025, with a year and ppm readout (NOAA monthly and annual means, cr14-data.ts).
//   2 Greenhouse trials: Kimball 1983 (Agron J 75:779; abstract): > 430 observations, 37 species, mostly greenhouses and
//     growth chambers; yields +33 % at doubled CO₂.
//   3 Open field: FACE; Long et al. 2006 (Science 312:1918; abstract): yield gain ≈ 50 % less than in enclosures;
//     Ainsworth & Long 2021 (abstract): C₃ +18 % at ≈ +200 ppm, C₄ none except in drought.
//   4 Inside the leaf: slide figure C14 v3 (A/Cᵢ redrawn from Leakey et al. 2009 Fig. 4): the 2050 points move along the
//     curves from the 2009 points; soybean +29 %, maize 0 %.
//   5 Inside the grain: slide figure C14 v5 or v4 (Myers et al. 2014): wheat Zn −9.3 %, Fe −5.1 %, protein −6.3 %.
// The slide figures are the slide's own drawings (figs/cr14.ts draw(id)), shown in the slide's card; their story parts are
// found in their markup by class (dots, chips, supply lines, bars), so nothing is redrawn.
import { draw as drawC14 } from '../figs/cr14';
import faceJpg from '../../assets/photos/cr-face-wheat.jpg';
import soyBJpg from '../../assets/photos/cr-soyface-b.jpg';
import soyCJpg from '../../assets/photos/cr-soyface-c.jpg';
import myersJpg from '../../assets/photos/cr-myers-f1.jpg';
import keelingPng from '../../assets/anim/cr14/keeling-nsf.png';
import noaaPng from '../../assets/anim/cr14/noaa-scripps-keeling.png';
import mloJpg from '../../assets/anim/cr14/mlo-keeling-chin-1997.jpg';
import { CO2_ANNUAL, CO2_FROM, CO2_MONTHLY } from './cr14-data';
import {
  CO2, f1, fd, glyph, hbar, drawHbar, journalClip, lerp, put, smooth, T, type Setters, type V,
} from './cr-kit';

export const FIG = (id: string): string => drawC14(id);
export const IMG = {
  face: { href: faceJpg, w: 1464, h: 728 },
  soyB: { href: soyBJpg, w: 671, h: 284 },
  soyC: { href: soyCJpg, w: 671, h: 304 },
  myers: { href: myersJpg, w: 800, h: 516 },
  noaa: { href: noaaPng, w: 800, h: 600 },
  mlo: { href: mloJpg, w: 1400, h: 811 },
};
export const KEELING = keelingPng;

/* ---------------------------------------------------------------- beat 1: the Keeling curve */

const N = CO2_MONTHLY.length;
/** Year (decimal, mid-month) and monthly CO₂ at progress u ∈ [0, 1]. */
export function keelAt(u: number): { dec: number; ppm: number; year: number; mean: number } {
  const m = Math.max(0, Math.min(N - 1, Math.floor(u * (N - 1) + 1e-6)));
  const year = CO2_FROM + Math.floor(m / 12);
  return { dec: CO2_FROM + (m + 0.5) / 12, ppm: CO2_MONTHLY[m], year, mean: CO2_ANNUAL[year - CO2_FROM] };
}
export interface Keel { svg: string; X: (dec: number) => number; Y: (ppm: number) => number }
/** The Keeling curve drawn in the deck's style in a panel (x, y, w, h): axes 1959–2025 and 300–440 ppm, the monthly curve
 *  (revealed by a growing clip), a dot at its tip and the readout (year, yearly mean). Keys `${p}-…`. */
export function keelingPanel(p: string, x: number, y: number, w: number, h: number, title = true): Keel {
  const x0 = x + 118, x1 = x + w - 44, y0 = y + (title ? 96 : 40), y1 = y + h - 74;
  const X = (dec: number): number => x0 + ((dec - 1958) / (2027 - 1958)) * (x1 - x0);
  const Y = (ppm: number): number => y1 - ((ppm - 300) / (440 - 300)) * (y1 - y0);
  const d = CO2_MONTHLY.map((v, i) => `${i ? 'L' : 'M'}${f1(X(CO2_FROM + (i + 0.5) / 12))},${f1(Y(v))}`).join('');
  const xt = [1960, 1980, 2000, 2020].map(v => `<path class="cra-axis" d="M${f1(X(v))},${f1(y1)} v9"/>${T(X(v), y1 + 38, `${v}`, 'cra-tk', 'middle')}`).join('');
  const yt = [320, 360, 400, 440].map(v => `<path class="cra-grid" d="M${f1(x0)},${f1(Y(v))} H${f1(x1)}"/>${T(x0 - 14, Y(v) + 8, `${v}`, 'cra-tk', 'end')}`).join('');
  const rx = x0 + 26, ry = y0 + 16;
  const svg = `<rect class="cra-panel" x="${x}" y="${y}" width="${w}" height="${h}" rx="22"/>
    ${title ? T(x + 34, y + 56, 'CO₂ in the air at Mauna Loa, Hawaiʻi', 'cra-h') : ''}
    ${yt}<path class="cra-axis" d="M${f1(x0)},${f1(y0 - 8)} V${f1(y1)} H${f1(x1)}"/>${xt}
    <text class="cra-ax" transform="translate(${f1(x + 40)} ${f1((y0 + y1) / 2)}) rotate(-90)" text-anchor="middle">CO₂ (ppm)</text>
    <defs><clipPath id="${p}-cl"><rect data-k="${p}-rev" x="${f1(x0)}" y="${f1(y0 - 20)}" width="0" height="${f1(y1 - y0 + 40)}"/></clipPath></defs>
    <path class="cra-co2" d="${d}" clip-path="url(#${p}-cl)"/>
    <circle data-k="${p}-dot" class="cra-dot" cx="${f1(X(CO2_FROM))}" cy="${f1(Y(CO2_MONTHLY[0]))}" r="10"/>
    <rect class="cra-box" x="${f1(rx)}" y="${f1(ry)}" width="250" height="122" rx="14"/>
    <text data-k="${p}-yr" class="cra-big" x="${f1(rx + 22)}" y="${f1(ry + 52)}">${CO2_FROM}</text>
    <text data-k="${p}-ppm" class="cra-big cra-red" x="${f1(rx + 22)}" y="${f1(ry + 104)}">${CO2_ANNUAL[0].toFixed(0)} ppm</text>
    ${T(x + w - 20, y + h - 16, 'data: NOAA Global Monitoring Laboratory &amp; Scripps Institution of Oceanography', 'cra-crd', 'end')}`;
  return { svg, X, Y };
}
/** The curve drawn up to progress u, the dot at its tip, the readout at the tip's year. */
export function drawKeeling(S: Setters, p: string, k: Keel, u: number): void {
  const a = keelAt(u), x0 = k.X(1958);
  S.set(S.q(`${p}-rev`), 'width', f1(Math.max(0, k.X(a.dec) - x0 + 4)));
  const dot = S.q(`${p}-dot`);
  S.set(dot, 'cx', f1(k.X(a.dec)));
  S.set(dot, 'cy', f1(k.Y(a.ppm)));
  S.set(S.q(`${p}-yr`), 'text', `${a.year}`);
  S.set(S.q(`${p}-ppm`), 'text', `${a.mean.toFixed(0)} ppm`);
}
/** The published NOAA/Scripps graph (800 × 600 px): frame 1955–2030 at x 100–760, 320 → 420 ppm at y 486 → 136 (measured on
 *  the image: the red curve runs from x 129, March 1958, to x 730, September 2026). */
export const noaaPx = (dec: number, ppm: number): V => [100 + (dec - 1955) * 8.8, 486 - (ppm - 320) * 3.5];

/** How long the curve takes to draw (s). */
export const KEEL_D = 2.6;

/* ---------------------------------------------------------------- beat 2: Kimball 1983 */

export function kimballClip(id: string, x: number, y: number, w: number, rot = -1.5): { svg: string; h: number } {
  return journalClip(id, x, y, w, {
    journal: 'Agronomy Journal', year: '1983',
    title: ['Carbon Dioxide and Agricultural Yield:', 'An Assemblage and Analysis of', '430 Prior Observations'],
    authors: 'B. A. Kimball',
  }, rot, 31);
}
/** The yield readout of beat 2 (and, in some stagings, beats 3 on): one bar per finding. */
export const BAR_K = 9.5;
export interface Finding { k: string; label: string; v: number; txt: string; cls: string }
export const GREENHOUSE: Finding = { k: 'gh', label: 'greenhouses and chambers, 2 × CO₂', v: 33, txt: '+33 %', cls: 'cra-bar-g' };
export const FACE_C3: Finding = { k: 'f3', label: 'FACE, C₃ crops, +200 ppm', v: 18, txt: '+18 %', cls: 'cra-bar-c3' };
export const FACE_C4: Finding = { k: 'f4', label: 'FACE, C₄ crops, +200 ppm', v: 0.4, txt: '≈ 0 %', cls: 'cra-bar-c4' };
/** A column of finding bars under a heading; keys `${p}-${finding.k}`. */
export function findingsSvg(p: string, x: number, y: number, fs: Finding[], head = 'yield gain'): string {
  return `<g data-k="${p}">${T(x, y, head, 'cra-lb')}${fs.map((g, i) => hbar(`${p}-${g.k}`, x, y + 66 + i * 100, g.label, g.cls)).join('')}</g>`;
}
/** Grows a finding's bar to u of its value (the readout is on screen from the start; its value text shows the result). */
export function drawFinding(S: Setters, p: string, x: number, g: Finding, u: number): void {
  drawHbar(S, `${p}-${g.k}`, x, g.v * smooth(u), BAR_K, g.txt, fd(u, 0, 0.25));
}

/* ---------------------------------------------------------------- the clippings of the history staging */

export const longClip = (id: string, x: number, y: number, w: number, rot = 1.2): { svg: string; h: number } => journalClip(id, x, y, w, {
  journal: 'Science', year: '2006',
  title: ['Food for Thought: Lower-Than-Expected', 'Crop Yield Stimulation with Rising', 'CO₂ Concentrations'],
  authors: 'S. P. Long, E. A. Ainsworth, … D. R. Ort',
}, rot, 43);
export const leakeyClip = (id: string, x: number, y: number, w: number, rot = -1): { svg: string; h: number } => journalClip(id, x, y, w, {
  journal: 'Journal of Experimental Botany', year: '2009',
  title: ['Elevated CO₂ effects on plant carbon,', 'nitrogen, and water relations:', 'six important lessons from FACE'],
  authors: 'A. D. B. Leakey, E. A. Ainsworth, … D. R. Ort',
}, rot, 53);
export const myersClip = (id: string, x: number, y: number, w: number, rot = 1.4): { svg: string; h: number } => journalClip(id, x, y, w, {
  journal: 'Nature', year: '2014',
  title: ['Increasing CO₂ threatens', 'human nutrition'],
  authors: 'S. S. Myers, A. Zanobetti, … ',
}, rot, 61);

/* ---------------------------------------------------------------- beat 3: CO₂ from the FACE pipes */

/** Tops of the vent pipes in the FACE photo (image pixels of cr-face-wheat.jpg): the front of the ring. */
export const PIPES: V[] = [[155, 498], [437, 530], [726, 535], [1038, 507], [1250, 470], [1405, 425], [450, 235], [611, 222], [773, 215], [935, 224]];
const PUFF_N = 14, PUFF_DT = 0.13, PUFF_D = 1.7;
/** CO₂ glyphs for the pipes, keyed `${p}-pf${i}`; r = 11 keeps their letters ≥ 11 px on screen (glyph standard). */
export const puffsSvg = (p: string, r = 11): string => Array.from({ length: PUFF_N }, (_, i) => glyph(`${p}-pf${i}`, CO2(r))).join('');
/** CO₂ leaves the pipe tops and drifts in over the plot (toward cx), from t0 on; at(u, v) maps photo pixels to the layer. */
export function drawPuffs(S: Setters, p: string, at: (u: number, v: number) => V, t: number, t0: number, cx: number, sc = 1): void {
  for (let i = 0; i < PUFF_N; i++) {
    const pipe = PIPES[i % PIPES.length], a = at(pipe[0], pipe[1] - 8), ti = t - t0 - i * PUFF_DT, u = Math.max(0, Math.min(1, ti / PUFF_D));
    const o = ti < 0 ? 0 : fd(ti, 0, 0.15) * (1 - fd(ti, PUFF_D - 0.45, 0.45));
    // pipes at the back of the ring rise less and are drawn a little smaller, for depth; not so small that the atom
    // letters go under 11 px (glyph standard)
    const back = pipe[1] < 300 ? 0.55 : 1, size = pipe[1] < 300 ? 0.88 : 1;
    put(S, `${p}-pf${i}`, [a[0] + (cx - a[0]) * 0.22 * u, a[1] - 64 * back * u], o, sc * size);
  }
}
export const PUFFS_END = PUFF_N * PUFF_DT + PUFF_D;
/** The puffs inside a figure card, masked so that they pass behind the figure's own label pills (rect.cr-pillbg) rather
 *  than over their words; call maskPills(S, p, card) once in bind to cut the pills out of the mask. */
export const maskedPuffsSvg = (p: string, r = 11): string =>
  `<mask id="${p}-pm" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1200" height="1000"><rect x="-200" y="-200" width="1200" height="1000" fill="#fff"/><g data-k="${p}-pmh"></g></mask><g data-k="${p}-pmg" mask="url(#${p}-pm)">${puffsSvg(p, r)}</g>`;
export function maskPills(S: Setters, p: string, card: Element): void {
  const host = S.q(`${p}-pmh`), g = S.q<SVGGraphicsElement>(`${p}-pmg`), gm = g?.getCTM();
  if (!host || !gm) return;
  const inv = gm.inverse();
  host.innerHTML = Array.from(card.querySelectorAll<SVGGraphicsElement>('rect.cr-pillbg')).map(r => {
    const m = r.getCTM(), b = r.getBBox();
    if (!m) return '';
    const k = inv.multiply(m), pt = (x: number, y: number): DOMPoint => new DOMPoint(x, y).matrixTransform(k);
    const p0 = pt(b.x - 3, b.y - 3), p1 = pt(b.x + b.width + 3, b.y + b.height + 3);
    return `<rect x="${f1(p0.x)}" y="${f1(p0.y)}" width="${f1(p1.x - p0.x)}" height="${f1(p1.y - p0.y)}" rx="${f1((p1.y - p0.y) / 2)}" fill="#000"/>`;
  }).join('');
}

/* ---------------------------------------------------------------- beat 4: the leaf (slide figure C14 v3) */

/** The story parts of a v3 drawing inside root: the 2050 points move along the curves from the 2009 points; the 2050 supply
 *  lines, the +29 % / 0 % chips and soybean's arrow appear. Returns draw(u, chip). */
export function leafAnim(S: Setters, root: Element): (u: number, chip: number) => void {
  const all = (sel: string): SVGGraphicsElement[] => Array.from(root.querySelectorAll<SVGGraphicsElement>(sel));
  const num = (el: Element, a: string): number => Number(el.getAttribute(a));
  const inPlot = (c: Element): boolean => num(c, 'cy') < 470;
  const curve = { c3: root.querySelector<SVGPathElement>('path.cr-c3'), c4: root.querySelector<SVGPathElement>('path.cr-c4') };
  const opens = all('circle.cr-dot-o').filter(inPlot);
  const kinds: Array<'c3' | 'c4'> = ['c3', 'c4'];
  const movers = kinds.map(k => {
    const dot = all(`circle.cr-dot-${k}`).filter(inPlot)[0], path = curve[k];
    const o = opens.find(c => (c.getAttribute('stroke') ?? '').toLowerCase() === (k === 'c3' ? '#a9532f' : '#237a72'));
    if (!dot || !path || !o) return null;
    const L = path.getTotalLength(), near = (x: number, y: number): number => {
      let best = 0, bd = Infinity;
      for (let l = 0; l <= L; l += 1.5) { const p = path.getPointAtLength(l), d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; best = l; } }
      return best;
    };
    const fx = num(dot, 'cx'), fy = num(dot, 'cy');
    return { dot, path, fx, fy, l0: near(num(o, 'cx'), num(o, 'cy')), l1: near(fx, fy) };
  }).filter((m): m is NonNullable<typeof m> => m !== null);
  const sup = all('path.cr-sup').filter(el => Math.abs(parseFloat((el.getAttribute('d') ?? '').slice(1)) - 556.25) < 2);
  const chips = all('rect.cr-chip-c3, rect.cr-chip-c4');
  const chipT = chips.map(r => r.nextElementSibling).filter((e): e is SVGGraphicsElement => !!e);
  const arrow = all('path.cr-ar');
  return (u, chip) => {
    const e = smooth(u);
    movers.forEach(m => {
      S.op(m.dot, u > 0 ? 1 : 0);
      const p = m.path.getPointAtLength(lerp(m.l0, m.l1, e));
      S.set(m.dot, 'transform', e >= 1 ? '' : `translate(${f1(p.x - m.fx)} ${f1(p.y - m.fy)})`);
    });
    sup.forEach(el => S.op(el, fd(u, 0, 0.25)));
    [...chips, ...chipT, ...arrow].forEach(el => S.op(el, chip));
  };
}

/* ---------------------------------------------------------------- beat 5: the grain (slide figure C14 v5) */

/** The bars of a v5 drawing grow out of the zero line (x 540); their values appear with them. Returns draw(u). */
export function grainAnim(S: Setters, root: Element): (u: number) => void {
  const bars = Array.from(root.querySelectorAll<SVGRectElement>('rect.cr-bar-up, rect.cr-bar-dn')).map(el => ({
    el, x: Number(el.getAttribute('x')), w: Number(el.getAttribute('width')),
  }));
  const vals = Array.from(root.querySelectorAll<SVGTextElement>('text.cr-val'));
  return u => {
    bars.forEach((b, i) => {
      const e = smooth((u - i * 0.12) / 0.64), left = b.x < 539;
      S.set(b.el, 'width', f1(b.w * e));
      if (left) S.set(b.el, 'x', f1(540 - b.w * e));
      if (vals[i]) S.op(vals[i], fd(u - i * 0.12, 0.45, 0.2));
    });
  };
}
