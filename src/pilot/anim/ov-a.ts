// 'ova' · the overview slide C10o "How plants cope with scarce CO₂", layout a: 4 columns (brief OV_BRIEF.md; captions
// anim/beats-ov.ts OV). One essence: RuBisCO is the same in every plant; what differs is how much CO₂ reaches it, shown
// as the same small RuBisCO render (PDB 8RUC) with a CO₂ gauge beside it (a tube of slide 19's CO₂ characters, co2-kit
// kidG; qualitative, no numbers).
// - Beat 1 (the problem) fills the stage: a stoma in surface view, drawn in the deck's guard-cell colours (lf10-a, cc13)
//   inside a round lens, beside RuBisCO with a big gauge. The stoma closes, the CO₂ arrow to RuBisCO goes, the gauge
//   falls, O₂ crowds round RuBisCO and the last CO₂ strains. In beat 2 the panel fades out.
// - The columns, left to right C₃, C₂, C₄, CAM, each in its beat; top to bottom: the type name, the plant photo (rounded,
//   cropped, aspect kept), the leaf-section micrograph in a round lens, RuBisCO with its gauge, the 2 short lines.
//   Gauge levels (of 5): C₃ 1 (stomata closed: low), C₂ 3 (raised), C₄ 5 (high), CAM 5 (high, "by day").
// - Beat 6: thin arrows under the columns, C₃ → C₂ → C₄ and C₃ → CAM, "evolved from C₃, many times"; then the question.
// One fixed framing; eased fades and glides only; a hold after each step.
// Images (credited on the stage): wheat, Hans Hillewaert (CC BY-SA 3.0); wild rocket (Diplotaxis tenuifolia), Krzysztof
// Ziarnek, Kenraiz (CC BY-SA 4.0); maize, High Contrast (CC BY 3.0 DE); Agave americana, Fawaz.tairou (CC BY 4.0), all
// Wikimedia Commons; sections: Steinchisma laxum (C₃) and Homolepis aturensis (C₂), Khoshravesh et al. 2016 (CC BY 3.0);
// maize (C₄) and a succulent leaf (CAM), Berkshire Community College Bioscience Image Library (CC0); RuBisCO PDB 8RUC.
import wheatJpg from '../../assets/photos/ov-c3-wheat.jpg';
import rocketJpg from '../../assets/photos/ov-c2-rocket.jpg';
import maizeJpg from '../../assets/photos/ov-c4-maize.jpg';
import agaveJpg from '../../assets/photos/ov-cam-agave.jpg';
import steJpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import homJpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import succJpg from '../../assets/photos/c13-cam-succulent.jpg';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { OV } from './beats-ov';
import { actor, clamp, ease, f, from, kid, kidG, lerp, makeScene, o2G, sunG, T, type Api, type V } from './co2-kit';
import { keyLines } from './stage-keys';
import type { Staging } from './types';

const P = 'ova';

/* ================================================================ the 4 types (shared with the page figure) */

export interface Img { href: string; w: number; h: number }
export interface TypeSpec {
  name: string;
  /** The plant photo and the centre of its window (image px). */
  photo: Img & { c: V };
  /** The leaf section, the lens's centre and radius on it (image px). */
  sec: Img & { c: V; ur: number };
  /** CO₂ characters in the gauge, of SLOTS. */
  level: number;
  /** The 2 short lines (each may wrap): on the stage, and on the page figure. */
  stage: string[][]; page: string[][];
  /** Credits on the stage: the photo, the section. */
  credit: [string, string];
  day?: boolean;
}
export const SLOTS = 5;
const RUB_AR = 471 / 548;
export const TYPES: TypeSpec[] = [
  { name: 'C₃', photo: { href: wheatJpg, w: 1000, h: 707, c: [500, 360] }, sec: { href: steJpg, w: 1000, h: 740, c: [470, 390], ur: 290 },
    level: 1, stage: [['≈ 90 % of species'], ['cool to warm, moist places']], page: [['≈ 90 % of species'], ['cool to warm,', 'moist places']],
    credit: ['wheat: Hans Hillewaert (CC BY-SA 3.0)', 'section: Khoshravesh et al. 2016 (CC BY 3.0) · RuBisCO: PDB 8RUC'] },
  { name: 'C₂', photo: { href: rocketJpg, w: 1000, h: 666, c: [500, 340] }, sec: { href: homJpg, w: 1000, h: 740, c: [500, 400], ur: 260 },
    level: 3, stage: [['rare'], ['warm, sunny, dry places']], page: [['rare'], ['warm, sunny, dry places']],
    credit: ['wild rocket: Krzysztof Ziarnek, Kenraiz (CC BY-SA 4.0)', 'section: Khoshravesh et al. 2016 (CC BY 3.0)'] },
  { name: 'C₄', photo: { href: maizeJpg, w: 1000, h: 558, c: [500, 279] }, sec: { href: zeaJpg, w: 1000, h: 740, c: [450, 350], ur: 240 },
    level: 5, stage: [['≈ 3 % of species,', '≈ a quarter of land photosynthesis'], ['hot, sunny grasslands']],
    page: [['≈ 3 % of species,', '≈ a quarter of land', 'photosynthesis'], ['hot, sunny grasslands']],
    credit: ['maize: High Contrast (CC BY 3.0 DE)', 'section: Berkshire Community College Bioscience Image Library (CC0)'] },
  { name: 'CAM', photo: { href: agaveJpg, w: 1000, h: 666, c: [500, 340] }, sec: { href: succJpg, w: 1000, h: 740, c: [480, 380], ur: 300 },
    level: 5, day: true, stage: [['≈ 6 % of species'], ['deserts, epiphytes']], page: [['≈ 6 % of species'], ['deserts, epiphytes']],
    credit: ['Agave americana: Fawaz.tairou (CC BY 4.0)', 'succulent leaf section: the same library (CC0)'] },
];

/** Where a column's parts go (stage or page units). */
export interface Geo {
  X: number[]; nameY: number; nameSize: number;
  ph: { y: number; w: number; h: number; r: number };
  lens: { y: number; r: number };
  /** RuBisCO: centre offset from the column's x, centre y, width. */
  rub: { dx: number; y: number; w: number };
  /** The gauge tube: left edge offset from the column's x, top, width, height; the CO₂ characters' radius. */
  tube: { dx: number; y: number; w: number; h: number; kr: number };
  /** The short lines: first baseline, line pitch, size; the page set or the stage set. */
  line: { y: number; h: number; size: number; page: boolean };
}
export const GEO: Geo = {
  X: [205, 600, 995, 1390], nameY: 50, nameSize: 40,
  ph: { y: 66, w: 312, h: 156, r: 14 },
  lens: { y: 270, r: 44 },
  rub: { dx: -28, y: 368, w: 88 },
  tube: { dx: 24, y: 322, w: 46, h: 92, kr: 7 },
  line: { y: 440, h: 21, size: 17, page: false },
};

/** A photo in a rounded window w × h at (x, y), the image scaled to the window's width or height (never stretched) and
 *  centred on c, kept inside the image. */
export function photoG(id: string, im: Img & { c: V }, x: number, y: number, w: number, h: number, r: number): string {
  const s = Math.max(w / im.w, h / im.h), dw = im.w * s, dh = im.h * s;
  const ox = Math.min(x, Math.max(x + w - dw, x + w / 2 - im.c[0] * s)), oy = Math.min(y, Math.max(y + h - dh, y + h / 2 - im.c[1] * s));
  return `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}"/></clipPath>
    <g clip-path="url(#${id})"><image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(dw)}" height="${f(dh)}" preserveAspectRatio="none"/></g>
    <rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}" style="fill:none;stroke:#cfcabb;stroke-width:1.2"/>`;
}
/** A micrograph in a round lens of radius r at c: the circle of radius ur round sec.c, scaled to fit. */
export function lensG(id: string, im: Img & { c: V; ur: number }, c: V, r: number): string {
  const s = r / im.ur;
  return `<clipPath id="${id}"><circle cx="${f(c[0])}" cy="${f(c[1])}" r="${r}"/></clipPath>
    <g clip-path="url(#${id})"><image href="${im.href}" x="${f(c[0] - im.c[0] * s)}" y="${f(c[1] - im.c[1] * s)}" width="${f(im.w * s)}" height="${f(im.h * s)}" preserveAspectRatio="none"/></g>
    <circle class="co2k-inring" cx="${f(c[0])}" cy="${f(c[1])}" r="${r}" style="stroke-width:2.2"/>`;
}
export const rubG = (c: V, w: number): string =>
  `<image href="${rubPng}" x="${f(c[0] - w / 2)}" y="${f(c[1] - (w * RUB_AR) / 2)}" width="${f(w)}" height="${f(w * RUB_AR)}"/>`;
/** The gauge tube (a glass pill) and its pale CO₂ level (keyed lq, its top at the given fill, in slots). */
export function tubeG(x: number, y: number, w: number, h: number, lq: string, fill: number): string {
  const lv = liquid(y, h, fill);
  return `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${f(w / 2)}" style="fill:#fbfaf6;stroke:#3d3d3a;stroke-width:2"/>
    <rect data-k="${lq}" x="${f(x + 3)}" y="${f(lv.y)}" width="${f(w - 6)}" height="${f(lv.h)}" rx="${f((w - 6) / 2)}" style="fill:#cfe0ea"${lv.h < 0.5 ? ' display="none"' : ''}/>`;
}
/** The level's rect for a fill (slots). */
export function liquid(y: number, h: number, fill: number): { y: number; h: number } {
  const pitch = (h - 6) / SLOTS, lh = Math.min(h - 6, pitch * fill);
  return { y: y + h - 3 - lh, h: lh };
}
/** The centres of the gauge's slots, bottom up. */
export const slots = (x: number, y: number, w: number, h: number): V[] =>
  Array.from({ length: SLOTS }, (_, j) => [x + w / 2, y + h - 3 - ((h - 6) / SLOTS) * (j + 0.5)] as V);
/** "by day" beside the CAM gauge, with a small sun. */
export const dayG = (x: number, y: number, size: number): string =>
  `<g transform="translate(${f(x + size * 1.4)} ${f(y - size * 0.36)})">${sunG(size * 0.42)}</g>${T(x + size * 1.82 + 18, y, 'by day', 'co2k-note', 'start', ` style="font-size:${size}px"`)}`;
/** The short lines of a column, centred at x: the share in ink, the habitat in grey. */
export function linesG(x: number, s: TypeSpec, g: Geo): string {
  const [share, where] = g.line.page ? s.page : s.stage;
  return [...share.map(l => [l, '#3d3d3a']), ...where.map(l => [l, '#6b6a64'])]
    .map(([l, c], k) => T(x, g.line.y + k * g.line.h, l, 'co2k-note', 'middle', ` style="font-size:${g.line.size}px;fill:${c}"`)).join('');
}
export const nameG = (x: number, s: TypeSpec, g: Geo): string =>
  T(x, g.nameY, s.name, 'ova-name', 'middle', ` style="font-size:${g.nameSize}px;font-weight:700;fill:#141413"`);

/** The CO₂ character standing still (the page figure): one face, no name. */
export function kidStill(k: string, at: V, r: number, face: 'n' | 's' = 'n'): string {
  let s = kidG(k, r, '').replace(' data-actor="1" display="none"', ` transform="translate(${f(at[0])} ${f(at[1])})"`);
  const off = ['fn', 'fs', 'fh', 'sw', 'sh'].filter(q => !(q === (face === 'n' ? 'fn' : 'fs') || (face === 's' && q === 'sw')));
  for (const q of off) s = s.replace(`<g data-k="${k}-${q}">`, `<g data-k="${k}-${q}" display="none">`);
  return s;
}

/** The evolution arrows under the columns: C₃ → C₂, C₂ → C₄ on one line, and C₃ → CAM along a U below them; each a
 *  polyline (for drawing it on) and its arrowhead. */
export function evoPaths(X: number[], y: number, yU: number, rr: number): Array<{ q: V[]; head: string }> {
  const head = (tip: V, dir: V, s = 9): string => {
    const [dx, dy] = dir, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    return `M${f(tip[0])},${f(tip[1])}L${f(tip[0] - ux * s * 1.6 - uy * s * 0.75)},${f(tip[1] - uy * s * 1.6 + ux * s * 0.75)}L${f(tip[0] - ux * s * 1.6 + uy * s * 0.75)},${f(tip[1] - uy * s * 1.6 - ux * s * 0.75)}Z`;
  };
  const line = (x0: number, x1: number): V[] => [[x0, y], [x1, y]];
  // the U: down from under C₃, a quarter turn, along, a quarter turn, up into CAM
  const u: V[] = [[X[0], y + 10]];
  for (let i = 1; i <= 10; i++) { const a = (i / 10) * (Math.PI / 2); u.push([X[0] + rr - rr * Math.cos(a), y + 10 + (yU - y - 10 - rr) + rr * Math.sin(a)]); }
  for (let i = 0; i <= 10; i++) { const a = (i / 10) * (Math.PI / 2); u.push([X[3] - rr + rr * Math.sin(a), yU - rr + rr * Math.cos(a)]); }
  u.push([X[3], y + 12]);
  const g = 34;
  return [
    { q: line(X[0] + 14, X[1] - g), head: head([X[1] - g + 12, y], [1, 0]) },
    { q: line(X[1] + g, X[2] - g), head: head([X[2] - g + 12, y], [1, 0]) },
    { q: u, head: head([X[3], y + 2], [0, -1]) },
  ];
}
export const polyD = (q: V[]): string => `M${q.map(p => `${f(p[0])},${f(p[1])}`).join('L')}`;
export const polyLen = (q: V[]): number => q.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - q[i][0], p[1] - q[i][1]), 0);
export const EVO_LABEL = 'evolved from C₃, many times';

/* ================================================================ the problem panel (beat 1) */

/** The stoma lens: centre and radius; the guard-cell pair (half-length H; width and pore half-width set by the opening). */
const PC: V = [470, 372], PR = 250, H = 150, HP = 92;
const gW = (o: number): number => lerp(90, 100, o), gP = (o: number): number => 30 * o;
/** The left guard cell (sg −1) or the right one (+1) at opening o: the outer kidney edge, then the polar wall, the pore edge
 *  and the other polar wall. */
function guardD(sg: number, o: number): string {
  const [cx, cy] = PC, W = gW(o), p = gP(o), k = 1.33;
  return `M${f(cx)},${f(cy - H)}C${f(cx + sg * k * W)},${f(cy - H)} ${f(cx + sg * k * W)},${f(cy + H)} ${f(cx)},${f(cy + H)}`
    + `L${f(cx)},${f(cy + HP)}C${f(cx + sg * k * p)},${f(cy + HP * 0.5)} ${f(cx + sg * k * p)},${f(cy - HP * 0.5)} ${f(cx)},${f(cy - HP)}Z`;
}
/** The pore edge of one guard cell (its thickened inner wall). */
const innerD = (sg: number, o: number): string => {
  const [cx, cy] = PC, p = gP(o);
  return `M${f(cx)},${f(cy + HP)}C${f(cx + sg * 1.33 * p)},${f(cy + HP * 0.5)} ${f(cx + sg * 1.33 * p)},${f(cy - HP * 0.5)} ${f(cx)},${f(cy - HP)}`;
};
const poreD = (o: number): string => {
  const [cx, cy] = PC, p = gP(o);
  return `M${f(cx)},${f(cy + HP)}C${f(cx - 1.33 * p)},${f(cy + HP * 0.5)} ${f(cx - 1.33 * p)},${f(cy - HP * 0.5)} ${f(cx)},${f(cy - HP)}C${f(cx + 1.33 * p)},${f(cy - HP * 0.5)} ${f(cx + 1.33 * p)},${f(cy + HP * 0.5)} ${f(cx)},${f(cy + HP)}Z`;
};
/** The middle of a guard cell across its width (it moves in as the stoma closes). */
const gMid = (o: number): number => (gP(o) + gW(o)) / 2;

/** A wavy wall from a to b. */
function wavy(a: V, b: V, amp: number, waves: number, n = 36): V[] {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  return Array.from({ length: n + 1 }, (_, i) => { const s = i / n, o = amp * Math.sin(Math.PI * waves * s); return [a[0] + dx * s + nx * o, a[1] + dy * s + ny * o] as V; });
}
/** The epidermis round the stoma: pavement cells with wavy walls (a ring round the stoma and walls out to the lens rim). */
function epidermis(): string {
  const [cx, cy] = PC, ring = (a: number): V => [cx + (178 + 7 * Math.sin(7 * a + 0.6)) * Math.cos(a), cy + (222 + 7 * Math.sin(7 * a + 0.6)) * Math.sin(a)];
  const ringQ = Array.from({ length: 121 }, (_, i) => ring((i / 120) * Math.PI * 2));
  const inner = [-0.35, 0.42, 1.2, 2.0, 2.75, 3.55, 4.4, 5.3].map(a => wavy([cx + 86 * Math.cos(a), cy + 140 * Math.sin(a)], ring(a), 6, 3));
  const outer = [-0.1, 0.7, 1.45, 2.3, 3.1, 3.9, 4.75, 5.5].map(a => wavy(ring(a), [cx + 330 * Math.cos(a), cy + 330 * Math.sin(a)], 7, 3));
  const wall = (q: V[]): string => `<path d="${polyD(q)}" style="fill:none;stroke:#c9b98f;stroke-width:3;stroke-linejoin:round"/>`;
  return `<circle cx="${cx}" cy="${cy}" r="${PR}" style="fill:#f8f6ee"/>${wall(ringQ)}${inner.map(wall).join('')}${outer.map(wall).join('')}`;
}
/** The guard cells: keyed outlines, pore, thickened inner walls and chloroplast groups (moved by the frame). */
function stoma(): string {
  const cps = (sg: number): string => [[-76, 0.7], [-38, 0.95], [0, 1], [38, 0.95], [76, 0.7]].map(([dy, k]) =>
    `<ellipse class="co2k-cp" cx="${f(PC[0] + sg * gMid(1) * k)}" cy="${f(PC[1] + dy)}" rx="9" ry="6.5" transform="rotate(${sg * 90 - dy * 0.4} ${f(PC[0] + sg * gMid(1) * k)} ${f(PC[1] + dy)})"/>`).join('');
  return `<path data-k="${P}pore" d="${poreD(1)}" style="fill:#4f6470"/>
    <path data-k="${P}gl" d="${guardD(-1, 1)}" style="fill:#dbe8c6;stroke:#8f9f6a;stroke-width:2.4;stroke-linejoin:round"/>
    <path data-k="${P}gr" d="${guardD(1, 1)}" style="fill:#dbe8c6;stroke:#8f9f6a;stroke-width:2.4;stroke-linejoin:round"/>
    <path data-k="${P}wl" d="${innerD(-1, 1)}" style="fill:none;stroke:#7d8c58;stroke-width:7;stroke-linecap:round"/>
    <path data-k="${P}wr" d="${innerD(1, 1)}" style="fill:none;stroke:#7d8c58;stroke-width:7;stroke-linecap:round"/>
    <g data-k="${P}cl">${cps(-1)}</g><g data-k="${P}cr">${cps(1)}</g>`;
}
function setStoma(a: Api, o: number): void {
  a.attr(`${P}pore`, 'd', poreD(o)); a.attr(`${P}gl`, 'd', guardD(-1, o)); a.attr(`${P}gr`, 'd', guardD(1, o));
  a.attr(`${P}wl`, 'd', innerD(-1, o)); a.attr(`${P}wr`, 'd', innerD(1, o));
  const dx = gMid(o) - gMid(1);
  a.attr(`${P}cl`, 'transform', `translate(${f(-dx)} 0)`); a.attr(`${P}cr`, 'transform', `translate(${f(dx)} 0)`);
}

/** RuBisCO and its big gauge. */
const RB: V = [1012, 372], RBW = 300;
const PT = { x: 1252, y: 140, w: 108, h: 470, kr: 16 };
const PSLOT = slots(PT.x, PT.y, PT.w, PT.h);
/** O₂ crowding round RuBisCO: where each ends, and the way it comes in from. */
const O2S: Array<[V, V]> = [
  [[874, 214], [-0.2, -1]], [[1010, 196], [0, -1]], [[1148, 216], [0.2, -1]], [[826, 330], [-0.15, -1]],
  [[828, 440], [-0.15, 1]], [[880, 540], [-0.2, 1]], [[1016, 556], [0, 1]], [[1150, 530], [0.2, 1]],
];
/** The CO₂ supply: an arrow from the stoma lens to RuBisCO (a gas path, the deck's neutral grey). */
const SUP = { x0: PC[0] + PR + 16, x1: RB[0] - RBW / 2 - 18, y: PC[1] };

function panel(): string {
  const cl = `<clipPath id="${P}-pl"><circle cx="${PC[0]}" cy="${PC[1]}" r="${PR}"/></clipPath>`;
  return actor(`${P}pb`, `${cl}<g clip-path="url(#${P}-pl)">${epidermis()}${stoma()}</g>
    <circle class="co2k-inring" cx="${PC[0]}" cy="${PC[1]}" r="${PR}"/>
    <g data-k="${P}sup"><path d="M${SUP.x0},${SUP.y}H${SUP.x1 - 14}" style="fill:none;stroke:#6b6a64;stroke-width:3.4;stroke-linecap:round"/><path d="M${SUP.x1},${SUP.y}l-18,-9v18z" style="fill:#6b6a64"/></g>
    ${rubG(RB, RBW)}${tubeG(PT.x, PT.y, PT.w, PT.h, `${P}plq`, SLOTS)}
    ${PSLOT.map((_, j) => kidG(`${P}pk${j}`, PT.kr, '')).join('')}
    ${O2S.map((_, j) => actor(`${P}o${j}`, o2G(15))).join('')}
    ${T(1588, 730, 'RuBisCO: PDB 8RUC', 'co2k-cr', 'end')}`);
}

/* ================================================================ the columns and the arrows */

const G = GEO;
const tubeAt = (i: number): { x: number; y: number; w: number; h: number } => ({ x: G.X[i] + G.tube.dx, y: G.tube.y, w: G.tube.w, h: G.tube.h });
/** Credits under each column: C₃ from the left edge, CAM to the right edge, C₂ and C₄ centred. */
function creditG(i: number): string {
  const [a, b] = TYPES[i].credit, x = i === 0 ? 14 : i === 3 ? 1586 : G.X[i], an = i === 0 ? 'start' : i === 3 ? 'end' : 'middle';
  return `${T(x, 714, a, 'co2k-cr', an)}${T(x, 730, b, 'co2k-cr', an)}`;
}
function column(i: number): string {
  const s = TYPES[i], X = G.X[i], tb = tubeAt(i);
  return actor(`${P}c${i}a`, `${nameG(X, s, G)}${photoG(`${P}-ph${i}`, s.photo, X - G.ph.w / 2, G.ph.y, G.ph.w, G.ph.h, G.ph.r)}${creditG(i)}`)
    + actor(`${P}c${i}b`, lensG(`${P}-ln${i}`, s.sec, [X, G.lens.y], G.lens.r))
    + actor(`${P}c${i}c`, `${rubG([X + G.rub.dx, G.rub.y], G.rub.w)}${tubeG(tb.x, tb.y, tb.w, tb.h, `${P}c${i}lq`, 0)}${s.day ? dayG(tb.x + tb.w + 4, tb.y + 24, 15) : ''}`)
    + slots(tb.x, tb.y, tb.w, tb.h).map((_, j) => kidG(`${P}c${i}k${j}`, G.tube.kr, '')).join('')
    + actor(`${P}c${i}d`, linesG(X, s, G));
}
const EVO_Y = 502, EVO_U = 538;
const EVO = evoPaths(G.X, EVO_Y, EVO_U, 22);
const EVO_LEN = EVO.map(e => polyLen(e.q));
function evolution(): string {
  return actor(`${P}ev`, EVO.map((e, j) => `<path data-k="${P}e${j}" d="${polyD(e.q)}" style="fill:none;stroke:#3d3d3a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round" stroke-dasharray="${f(EVO_LEN[j])} ${f(EVO_LEN[j])}"/>
      <path data-k="${P}h${j}" d="${e.head}" style="fill:#3d3d3a"/>`).join('')
    + `<g data-k="${P}evl">${T(800, 566, EVO_LABEL, 'co2k-note', 'middle', ' style="font-size:19px;fill:#141413"')}</g>`);
}

/* ================================================================ timing */

/** Beat 1: the panel fades in; the stoma closes; the arrow goes; the gauge falls; O₂ crowds in; the last CO₂ strains. */
const B0 = { on: [0, 0.6], close: [0.9, 2.5], sup: [2.5, 2.9], fall: [3.2, 4.6], o2: [4.8, 6.2], strain: [6.2, 6.6] } as const;
/** A column's beat: name and photo, lens, RuBisCO and the empty gauge (from t0, 0.7 s apart), a hold, the gauge fills
 *  (0.3 s per CO₂), the lines. */
const colT0 = (i: number): number => (i === 0 ? 0.8 : 0.2);
const colHold = (i: number): number => colT0(i) + 2.2;
const colFillEnd = (i: number): number => colHold(i) + 0.3 * TYPES[i].level;
/** Beat 6: the 3 arrows drawn one after another, then the words. */
const EV_T: Array<[number, number]> = [[0.3, 1.2], [1.4, 2.3], [2.5, 3.9]];
const EVL_T = [4.0, 4.6] as const, EV_HOLD = 4.8;

function frame(a: Api, beat: number, t: number): void {
  /* the problem panel: beat 1, and fading out at the start of beat 2 */
  if (beat <= 1) {
    const tt = beat === 0 ? t : 99;
    a.op(`${P}pb`, beat === 0 ? ease(t, B0.on[0], B0.on[1]) : 1 - ease(t, 0, 0.7));
    setStoma(a, 1 - ease(tt, B0.close[0], B0.close[1]));
    a.op(`${P}sup`, 1 - ease(tt, B0.sup[0], B0.sup[1]));
    const fill = lerp(SLOTS, 1, ease(tt, B0.fall[0], B0.fall[1]));
    const lv = liquid(PT.y, PT.h, fill);
    a.attr(`${P}plq`, 'y', f(lv.y)); a.attr(`${P}plq`, 'height', f(lv.h));
    const st = ease(tt, B0.strain[0], B0.strain[1]);
    PSLOT.forEach((q, j) => kid(a, `${P}pk${j}`, q, clamp((fill - j - 0.3) / 0.5), j === 0 ? { s: st, sweat: ease(tt, B0.strain[0] + 0.15, B0.strain[1] + 0.15) } : {}));
    const u = ease(tt, B0.o2[0], B0.o2[1]);
    O2S.forEach(([end, d], j) => a.put(`${P}o${j}`, [end[0] + d[0] * 260 * (1 - u), end[1] + d[1] * 260 * (1 - u)], clamp(u * 2.5)));
  }
  /* the columns */
  for (let i = 0; i < 4; i++) {
    const b = i + 1, t0 = colT0(i), tb = tubeAt(i), lev = TYPES[i].level;
    a.op(`${P}c${i}a`, from(beat, t, b, t0, t0 + 0.6));
    a.op(`${P}c${i}b`, from(beat, t, b, t0 + 0.7, t0 + 1.3));
    a.op(`${P}c${i}c`, from(beat, t, b, t0 + 1.4, t0 + 2.0));
    const fill = beat > b ? lev : beat === b ? lev * ease(t, colHold(i), colFillEnd(i)) : 0;
    const lv = liquid(tb.y, tb.h, fill);
    a.attr(`${P}c${i}lq`, 'y', f(lv.y)); a.attr(`${P}c${i}lq`, 'height', f(lv.h)); a.attr(`${P}c${i}lq`, 'display', lv.h < 0.5 ? 'none' : 'inline');
    // C₃'s lone CO₂ looks as at the end of the problem: strained, a drop of sweat
    slots(tb.x, tb.y, tb.w, tb.h).forEach((q, j) => kid(a, `${P}c${i}k${j}`, q, clamp((fill - j - 0.35) / 0.4), i === 0 ? { s: 1, sweat: 1 } : {}));
    a.op(`${P}c${i}d`, from(beat, t, b, colFillEnd(i) + 0.2, colFillEnd(i) + 0.8));
  }
  /* the arrows of descent */
  if (beat === 5) {
    a.op(`${P}ev`, 1);
    EV_T.forEach(([t0, t1], j) => {
      const u = ease(t, t0, t1);
      a.attr(`${P}e${j}`, 'stroke-dashoffset', f(EVO_LEN[j] * (1 - u)));
      a.op(`${P}e${j}`, u > 0.001 ? 1 : 0);
      a.op(`${P}h${j}`, clamp((u - 0.92) / 0.08));
    });
    a.op(`${P}evl`, ease(t, EVL_T[0], EVL_T[1]));
  }
}

const BASE = makeScene({
  id: 'ova',
  name: 'a · 4 columns: plant, leaf section, RuBisCO and its CO₂',
  note: 'The problem (a stoma closes, the CO₂ gauge at RuBisCO falls, O₂ crowds in), then C₃, C₂, C₄ and CAM as columns, each with its plant, leaf section and RuBisCO with a CO₂ gauge (low, raised, high, high by day); arrows of descent from C₃',
  beats: OV,
  holds: [[0.8, 3.1], [colHold(0)], [colHold(1)], [colHold(2)], [colHold(3)], [EV_HOLD]],
  svg: () => `${panel()}${[0, 1, 2, 3].map(column).join('')}${evolution()}`,
  frame,
});

export const STAGING: Staging = { ...BASE, keys: keyLines(5, ['How does a C₂ plant', 'trap its CO₂?'], 800, 632, { size: 44, t0: EV_HOLD + 0.2 }) };
