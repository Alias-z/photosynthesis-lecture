// Lead page for slide 6 in the live lecture: the question alone, one full-page drawing (viewBox 1600 x 900);
// the "To the reaction centre" animation answers it (Emerson & Arnold's flashes, the field of chlorophylls, the
// PSII–LHCII structure), and the study page (s06.ts, "Light harvesting") is the recap.
// Never reveals: antenna, reaction centre, the counts (2,400 per O₂, 300 per centre). Variant c shows the
// animation's own bench and clipping (anim/antenna-common.ts), so the answer opens on the picture students guessed at;
// variant b draws the chlorophylls as the animation's field does, but with no centre marked among them.
// Images (assets/photos; credits on the page):
// - lead-bubbles.jpg: "Photosynthesis in action", underwater lake plants with trails of oxygen bubbles; Rcaravit 2021,
//   CC BY 4.0 (Wikimedia Commons). Crop x 1344–3840, y 576–2880 of the 3840 × 2880 rendition, 1300 × 1200.
// - lead6-priestley.jpg: Priestley 1774, Experiments and Observations on Different Kinds of Air, vol. 1, frontispiece;
//   public domain (refs board L2b, image n). The sprig in an inverted jar stands at right.
// - lead6-chlorella.jpg: Chlorella vulgaris NIES-2170, light micrograph; NEON_ja 2014, CC BY-SA 3.0 (Wikimedia
//   Commons). Emerson & Arnold flashed Chlorella.
// - Emerson and Arnold halftones (assets/anim/antenna, © NAS) inside the animation's clipping.
import type { Variant } from '../types';
import './lead06.css';
import { leaf } from './s2';
import { o2 } from './l01';
import { benchSvg, pairClip } from '../anim/antenna-common';
import bubblesJpg from '../../assets/photos/lead-bubbles.jpg';
import priestleyJpg from '../../assets/photos/lead6-priestley.jpg';
import chlorellaJpg from '../../assets/photos/lead6-chlorella.jpg';

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Oxygen bubbles' },
  { id: 'b', name: 'Leaf zoom' },
  { id: 'c', name: 'Flash test' },
  { id: 'd', name: 'Priestley' },
  { id: 'e', name: 'Chlorella' },
];

type Pt = [number, number];
interface Img { href: string; w: number; h: number }
const BUB: Img = { href: bubblesJpg, w: 1300, h: 1200 };
const PRI: Img = { href: priestleyJpg, w: 1600, h: 1341 };
const CHL: Img = { href: chlorellaJpg, w: 1200, h: 900 };
const CR = {
  bub: 'Photo: Rcaravit, CC BY 4.0',
  pri: 'J. Priestley, 1774, frontispiece · public domain',
  chl: 'Photo: NEON_ja, CC BY-SA 3.0',
  nas: 'Portraits: Biographical Memoirs, © NAS',
};
const Q = 'Does every chlorophyll in a leaf make oxygen?';

const f = (v: number): string => v.toFixed(1);
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fld06" viewBox="0 0 1600 900" role="img" aria-label="${label}">${body}</svg>`;
const T = (x: number, y: number, s: string, cls: string, anchor: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${s}</text>`;
/** The question in Newsreader; each line is a tspan so the block measures as one label. */
function ask(x: number, y: number, size: number, lines: string[], gap = 1.12, anchor: 'start' | 'middle' = 'start'): string {
  return `<text class="lead-q" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${lines
    .map((s, i) => `<tspan x="${x}" dy="${i ? f(size * gap) : 0}">${s}</tspan>`).join('')}</text>`;
}
/** Print treatments: a photo slightly muted with warm blacks and paper whites; an engraving turned to the deck's warm
 *  ink on paper white (then multiplied into the page). */
const PRINT = {
  photo: '<feColorMatrix type="saturate" values=".88"/><feComponentTransfer><feFuncR type="linear" slope=".93" intercept=".05"/><feFuncG type="linear" slope=".93" intercept=".045"/><feFuncB type="linear" slope=".92" intercept=".035"/></feComponentTransfer>',
  ink: '<feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="1.75" intercept="-.38"/><feFuncG type="linear" slope="1.75" intercept="-.41"/><feFuncB type="linear" slope="1.72" intercept="-.45"/></feComponentTransfer>',
};
/** A real image: the window win = [u0, v0, width, height] (image px) covers the box, clipped to a rounded rectangle
 *  (or a circle when round). Returns the svg and a map from image px to the page. */
function shot(id: string, im: Img, x: number, y: number, w: number, h: number, win: [number, number, number, number],
  o: { r?: number; lift?: boolean; look?: 'photo' | 'ink'; round?: boolean; feather?: number } = {}): { svg: string; at: (u: number, v: number) => Pt } {
  const [u0, v0, uw, vh] = win, s = Math.max(w / uw, h / vh), r = o.r ?? 18, look = o.look ?? 'photo';
  const ix = x - u0 * s + (w - uw * s) / 2, iy = y - v0 * s + (h - vh * s) / 2;
  const shape = o.round
    ? `<circle cx="${f(x + w / 2)}" cy="${f(y + h / 2)}" r="${f(w / 2)}"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  const mat = o.round
    ? `<circle class="fld06-mat" cx="${f(x + w / 2)}" cy="${f(y + h / 2)}" r="${f(w / 2)}" filter="url(#${id}-sh)"/>`
    : `<rect class="fld06-mat" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" filter="url(#${id}-sh)"/>`;
  const edge = o.round
    ? `<circle class="fld06-edge" cx="${f(x + w / 2)}" cy="${f(y + h / 2)}" r="${f(w / 2)}"/>`
    : (r ? `<rect class="fld06-edge" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>` : '');
  return {
    svg: `<defs><clipPath id="${id}-c">${shape}</clipPath>${o.feather ? `<filter id="${id}-fb" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${o.feather}"/></filter>
      <mask id="${id}-m" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect x="${x + o.feather * 1.6}" y="${y + o.feather * 1.6}" width="${w - o.feather * 3.2}" height="${h - o.feather * 3.2}" fill="#fff" filter="url(#${id}-fb)"/></mask>` : ''}<filter id="${id}-p" color-interpolation-filters="sRGB">${PRINT[look]}</filter>
      ${o.lift ? `<filter id="${id}-sh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#46321a" flood-opacity=".22"/></filter>` : ''}</defs>
    ${o.lift ? mat : ''}
    <g ${o.feather ? `mask="url(#${id}-m)"` : `clip-path="url(#${id}-c)"`}${look === 'ink' ? ' class="fld06-mult"' : ''}><image href="${im.href}" x="${f(ix)}" y="${f(iy)}" width="${f(im.w * s)}" height="${f(im.h * s)}" preserveAspectRatio="none" filter="url(#${id}-p)"/></g>
    ${look === 'photo' ? edge : ''}`,
    at: (u, v) => [ix + u * s, iy + v * s],
  };
}
/** A white label pill on a photo with a leader to `to`. */
function pill(x: number, y: number, s: string, to: Pt, w: number): string {
  const d = `M${f(x)},${f(y + 20)}L${f(to[0])},${f(to[1])}`;
  return `<path class="fld06-ldh" d="${d}"/><path class="fld06-ld" d="${d}"/><circle class="fld06-dot" cx="${f(to[0])}" cy="${f(to[1])}" r="4"/>
    <rect class="fld06-pill" x="${f(x - w / 2)}" y="${f(y - 20)}" width="${w}" height="40" rx="20"/>${T(x, y + 9, s, 'fld06-pill-t', 'middle')}`;
}
/** A leader from a label on the paper to a point on an image. */
function leader(a: Pt, b: Pt): string {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fld06-ldh" d="${d}"/><path class="fld06-ld" d="${d}"/><circle class="fld06-dot" cx="${f(b[0])}" cy="${f(b[1])}" r="4"/>`;
}

/* ---------- a · Oxygen bubbles: underwater plants with rising bubble trails, the question beside them ---------- */

function drawA(): string {
  const p = 'fld06a';
  const ph = shot(`${p}-ph`, BUB, 0, 0, 720, 900, [330, 0, 970, 1200], { r: 0 });
  return svg(p, 'Photograph taken under water: green aquatic plants with thin trails of oxygen bubbles rising from them towards the light. Beside it, the question: does every chlorophyll in a leaf make oxygen?', `
    ${ph.svg}
    ${pill(560, 150, 'O₂ bubbles', ph.at(745, 250), 176)}
    ${ask(808, 430, 70, ['Does every chlorophyll', 'in a leaf make oxygen?'])}
    ${T(810, 866, CR.bub, 'fld06-credit')}
  `);
}

/* ---------- b · Leaf zoom: a leaf, a lens full of chlorophylls, and one O₂ with a question on the way ---------- */

/** s2's leaf, masked to its blade and stalk: drawn large, the tips of its side veins would show past the outline
 *  (as lead01's bigLeaf). */
function bigLeaf(id: string, cx: number, cy: number, len: number, wid: number, rot: number): string {
  const h = len / 2, w = wid / 2;
  const blade = `M${-h},0 C${f(-h * 0.5)},${f(-w * 1.3)} ${f(h * 0.4)},${f(-w * 1.2)} ${h},0 C${f(h * 0.4)},${f(w * 1.2)} ${f(-h * 0.5)},${f(w * 1.3)} ${-h},0Z`;
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="${-h - 40}" y="${-w * 1.4}" width="${len + 60}" height="${w * 2.8}">
      <path d="${blade}" fill="#fff" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/><rect x="${-h - 30}" y="-6" width="34" height="18" fill="#fff"/></mask>
    <g transform="translate(${cx} ${cy}) rotate(${rot})" mask="url(#${id})">${leaf(0, 0, len, wid, 0)}</g>`;
}
/** Chlorophylls as dots on a square grid inside a circle (as the animation's field draws them, with none marked). */
function dots(cx: number, cy: number, r: number, d: number, rr: number): string {
  let path = '';
  for (let y = cy - r; y <= cy + r; y += d) for (let x = cx - r; x <= cx + r; x += d) {
    const jx = x + ((Math.round(y / d) % 2) * d) / 2;
    if (Math.hypot(jx - cx, y - cy) < r - d * 0.6) path += `M${f(jx - rr)},${f(y)}a${rr},${rr} 0 1 0 ${f(2 * rr)},0a${rr},${rr} 0 1 0 ${f(-2 * rr)},0`;
  }
  return `<path class="fld06-chl" d="${path}"/>`;
}

function drawB(): string {
  const p = 'fld06b';
  const L: Pt = [300, 500], C: Pt = [800, 500], R = 210, Z: Pt = [348, 486], zs = 30;
  // Zoom lines from the small square on the leaf to the lens: tangents drawn as straight lines to its top and bottom.
  return svg(p, 'Drawing: a green leaf; a small square on it is enlarged in a round lens full of chlorophylls, drawn as many small green dots. A dashed arrow leads from the lens to one O₂ molecule, with a question mark on the way. All of them, or only a few?', `
    <defs><marker id="${p}-hd" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path class="fld06-head" d="M0,0L10,5L0,10z"/></marker></defs>
    ${ask(96, 150, 64, [Q])}
    <path class="fld06-zoom" d="M${Z[0] + zs / 2},${Z[1] - zs / 2} L${C[0] - 36},${C[1] - R + 6} M${Z[0] + zs / 2},${Z[1] + zs / 2} L${C[0] - 36},${C[1] + R - 6}"/>
    ${bigLeaf(`${p}-leaf`, L[0], L[1], 304, 133, -18)}
    <rect class="fld06-zoombox" x="${Z[0] - zs / 2}" y="${Z[1] - zs / 2}" width="${zs}" height="${zs}" rx="3"/>
    <circle class="fld06-lens" cx="${C[0]}" cy="${C[1]}" r="${R}"/>
    ${dots(C[0], C[1], R, 19, 5)}
    <circle class="fld06-lens-rim" cx="${C[0]}" cy="${C[1]}" r="${R}"/>
    ${T(C[0], C[1] + R + 50, 'chlorophylls', 'fld06-lab', 'middle')}
    <path class="fld06-ask" d="M${C[0] + R + 24},${C[1]} H${1218}" marker-end="url(#${p}-hd)"/>
    ${T(1124, C[1] - 30, '?', 'fld06-qm', 'middle')}
    <g transform="translate(1290 ${C[1]}) scale(2.4) translate(-1290 ${-C[1]})">${o2(1290, C[1], 10)}</g>
    ${T(1290, C[1] + 70, 'O₂', 'fld06-lab fld06-o2', 'middle')}
    ${T(800, 830, 'All of them, or only a few?', 'fld06-prompt', 'middle')}
  `);
}

/* ---------- c · Flash test: the animation's bench (flash lamp, flask of algae) and its Emerson & Arnold clipping ---------- */

function drawC(): string {
  const p = 'fld06c';
  // The bench drawing spans x 310–990, y 336–662 in its own frame; centred at (650, 500), shown 1.25 times.
  const k = 1.25, at: Pt = [960, 566];
  return svg(p, 'The question: does every chlorophyll in a leaf make oxygen? Below, a flash lamp aimed at a round flask of green algae on a bench; at left, a newspaper clipping with portraits of Emerson and Arnold, 1932.', `
    ${ask(96, 150, 64, [Q])}
    ${pairClip(p, 150, 372, 300, -2)}
    <g class="ani-antenna-a fld06-bench" transform="translate(${at[0]} ${at[1]}) scale(${k}) translate(-650 -500)">${benchSvg(p, '')}</g>
    ${T(96, 866, CR.nas, 'fld06-credit')}
  `);
}

/* ---------- d · Priestley: the 1774 frontispiece, with the sprig under glass ---------- */

function drawD(): string {
  const p = 'fld06d';
  const ph = shot(`${p}-ph`, PRI, 700, 150, 804, 685, [180, 40, 1350, 1150], { r: 0, look: 'ink', feather: 14 });
  return svg(p, 'An 18th-century engraving of Priestley\'s apparatus: a trough of water with gas jars, a mouse under a jar and, at right, a sprig of a plant in an inverted jar. Beside it, the question: does every chlorophyll in a leaf make oxygen?', `
    ${ph.svg}
    ${ask(96, 420, 66, ['Does every', 'chlorophyll in a leaf', 'make oxygen?'])}
    ${pill(1236, 236, 'a plant under glass', ph.at(1418, 470), 250)}
    ${T(700, 856, CR.pri, 'fld06-credit')}
  `);
}

/* ---------- e · Chlorella: the alga of the flash experiments, seen down a microscope ---------- */

function drawE(): string {
  const p = 'fld06e';
  const D = 640, x = 840, y = 120;
  const ph = shot(`${p}-ph`, CHL, x, y, D, D, [230, 20, 800, 800], { round: true, lift: true });
  return svg(p, 'The question: does every chlorophyll in a leaf make oxygen? Beside it, a round microscope view of many small green Chlorella cells.', `
    ${ask(96, 380, 70, ['Does every', 'chlorophyll in a leaf', 'make oxygen?'])}
    ${ph.svg}
    ${T(x + D / 2, y + D + 52, '<tspan font-style="italic">Chlorella</tspan>, a green alga', 'fld06-lab', 'middle')}
    ${T(96, 866, CR.chl, 'fld06-credit')}
  `);
}

export function draw(id: string): string {
  const d: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE };
  return (d[id] ?? drawA)();
}
