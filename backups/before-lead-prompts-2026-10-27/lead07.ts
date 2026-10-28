// Lead page for slide 7 in the live lecture: the question alone, one full-page drawing (viewBox 1600 x 900); the study
// page (s07.ts, "Photosystem II") is the recap. Two approved hooks, in this order: "What does the reaction centre do
// with the energy?" (it continues slide 6's last question) and "Where does the oxygen we breathe come from: water or
// CO₂?". a, b ask the first; c, d the second; e asks the first and carries the second as its prompt line.
// Never reveals: water splitting, electron, P680, ¹⁸O. A photosystem, if named, is written out (lecturer's rule).
// Same picture as the answer: a draws the end of slide 6's animation (the 5XNL layers and its hop trail, from
// anim/antenna-common.ts) with the energy arrived at the reaction centre; e uses the study page's own render (7-psii.png);
// c uses the equation icons of l01.ts (water drop, CO₂, O₂).
// Images (credits on the page):
// - anim/antenna/psii-base.webp, psii-core.webp, psii-rc.webp and photos/7-psii.png: our own renders of PDB 5XNL (pea
//   PSII–LHCII, Su et al. 2017), as credited on slides 6 and 7.
// - photos/lead-bubbles.jpg: "Photosynthesis in action", Rcaravit 2021, CC BY 4.0 (as slide 6's lead page).
import type { Variant } from '../types';
import './lead07.css';
import { co2, drop, o2 } from './l01';
import { P680, PATH_PTS } from '../anim/antenna-common';
import baseWebp from '../../assets/anim/antenna/psii-base.webp';
import coreWebp from '../../assets/anim/antenna/psii-core.webp';
import rcWebp from '../../assets/anim/antenna/psii-rc.webp';
import sidePng from '../../assets/photos/7-psii.png';
import bubblesJpg from '../../assets/photos/lead-bubbles.jpg';

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Energy arrived' },
  { id: 'b', name: 'Then what' },
  { id: 'c', name: 'Water or CO₂' },
  { id: 'd', name: 'Oxygen bubbles' },
  { id: 'e', name: 'Both questions' },
];

type Pt = [number, number];
interface Img { href: string; w: number; h: number }
const BUB: Img = { href: bubblesJpg, w: 1300, h: 1200 };
const SIDE: Img = { href: sidePng, w: 1100, h: 921 };
/** Where each 5XNL layer sits in the animation's 1600 × 1000 render frame (anim/antenna-common.ts, BOX). */
const LAYER: Record<'base' | 'core' | 'rc', { href: string; box: [number, number, number, number] }> = {
  base: { href: baseWebp, box: [173, 89, 1254, 821] },
  core: { href: coreWebp, box: [570, 193, 428, 337] },
  rc: { href: rcWebp, box: [602, 233, 342, 231] },
};
/** The reaction-centre chlorophylls in 7-psii.png (s07.ts, W.P680), in image px. */
const SIDE_RC: Pt = [503.3, 399.0];
const CR = {
  own: 'Own render · PDB 5XNL, pea (Su et al. 2017)',
  bub: 'Photo: Rcaravit, CC BY 4.0',
};
/** The second question ("Where does the oxygen we breathe come from: water or CO₂?") as variant e's prompt, broken after the colon so it fits beside the render. */
const Q2L = ['Where does the oxygen we breathe', 'come from: water or CO₂?'];

const f = (v: number): string => v.toFixed(1);
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fld07" viewBox="0 0 1600 900" role="img" aria-label="${label}">${body}</svg>`;
/** Subscript digits as smaller, lowered digits (the serif has no subscript glyphs). */
const chem = (s: string): string =>
  s.replace(/[₀-₉]+/g, m => `<tspan class="fld07-sb">${[...m].map(d => d.charCodeAt(0) - 0x2080).join('')}</tspan>`);
const T = (x: number, y: number, s: string, cls: string, anchor: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${s}</text>`;
/** The question in Newsreader; each line is a tspan so the block measures as one label. */
function ask(x: number, y: number, size: number, lines: string[], gap = 1.12, anchor: 'start' | 'middle' = 'start'): string {
  return `<text class="lead-q" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${lines
    .map((s, i) => `<tspan x="${x}" dy="${i ? f(size * gap) : 0}">${chem(s)}</tspan>`).join('')}</text>`;
}
const PRINT = '<feColorMatrix type="saturate" values=".88"/><feComponentTransfer><feFuncR type="linear" slope=".93" intercept=".05"/><feFuncG type="linear" slope=".93" intercept=".045"/><feFuncB type="linear" slope=".92" intercept=".035"/></feComponentTransfer>';
/** A real photo printed onto the paper: the window win (image px) covers the box, rounded, on a paper mat with a
 *  soft shadow. Returns the svg and a map from image px to the page. */
function shot(id: string, im: Img, x: number, y: number, w: number, h: number, win: [number, number, number, number], r = 20): { svg: string; at: (u: number, v: number) => Pt } {
  const [u0, v0, uw, vh] = win, s = Math.max(w / uw, h / vh);
  const ix = x - u0 * s + (w - uw * s) / 2, iy = y - v0 * s + (h - vh * s) / 2;
  return {
    svg: `<defs><clipPath id="${id}-c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath>
      <filter id="${id}-p" color-interpolation-filters="sRGB">${PRINT}</filter>
      <filter id="${id}-sh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#46321a" flood-opacity=".22"/></filter></defs>
    <rect class="fld07-mat" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" filter="url(#${id}-sh)"/>
    <g clip-path="url(#${id}-c)"><image href="${im.href}" x="${f(ix)}" y="${f(iy)}" width="${f(im.w * s)}" height="${f(im.h * s)}" preserveAspectRatio="none" filter="url(#${id}-p)"/></g>
    <rect class="fld07-edge" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`,
    at: (u, v) => [ix + u * s, iy + v * s],
  };
}
/** A label on the paper with a leader (dark line in a light halo) to a point. */
function leader(a: Pt, b: Pt): string {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fld07-ldh" d="${d}"/><path class="fld07-ld" d="${d}"/><circle class="fld07-dot" cx="${f(b[0])}" cy="${f(b[1])}" r="4"/>`;
}
/** A white label pill on a photo with a leader to `to`. */
function pill(x: number, y: number, s: string, to: Pt, w: number): string {
  return `${leader([x, y + 20], to)}<rect class="fld07-pill" x="${f(x - w / 2)}" y="${f(y - 20)}" width="${w}" height="40" rx="20"/>${T(x, y + 9, s, 'fld07-pill-t', 'middle')}`;
}
/** The energy arrived: an amber glow, and the animation's dashed ring around the reaction centre. */
const arrived = (p: string, c: Pt, r: number): string =>
  `<defs><radialGradient id="${p}-glow"><stop offset="0" stop-color="#fff4d6"/><stop offset=".3" stop-color="#f6c453" stop-opacity=".9"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient></defs>
    <circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="url(#${p}-glow)"/>
    <circle class="fld07-rcring" cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r * 1.12)}"/>`;
const qm = (x: number, y: number, size: number): string =>
  `<text class="fld07-qm" x="${f(x)}" y="${f(y)}" font-size="${size}" text-anchor="middle">?</text>`;

/* ---------- a · Energy arrived: the end of slide 6's animation, the energy glowing at the reaction centre ---------- */

function drawA(): string {
  const p = 'fld07a';
  // The 1600 × 1000 render frame at scale k, its point (800, 500) on the page at C.
  const k = 0.64, C: Pt = [1010, 548];
  const at = ([u, v]: Pt): Pt => [C[0] + (u - 800) * k, C[1] + (v - 500) * k];
  const layer = (n: 'base' | 'core' | 'rc', cls = ''): string => {
    const [x, y, w, h] = LAYER[n].box, [px, py] = at([x, y]);
    return `<image${cls ? ` class="${cls}"` : ''} href="${LAYER[n].href}" x="${f(px)}" y="${f(py)}" width="${f(w * k)}" height="${f(h * k)}"/>`;
  };
  const trail = PATH_PTS.map((q, i) => { const [x, y] = at(q); return `${i ? 'L' : 'M'}${f(x)},${f(y)}`; }).join('');
  const rc = at(P680);
  return svg(p, 'The structure of photosystem II with its light-harvesting complexes, seen from above. An amber trail of energy hops from pigment to pigment and ends in a glow at the reaction centre. Question: what does the reaction centre do with the energy?', `
    ${ask(96, 150, 70, ['What does the reaction centre', 'do with the energy?'])}
    ${layer('base')}${layer('core', 'fld07-tier')}${layer('rc', 'fld07-tier')}
    <path class="fld07-trail" d="${trail}"/>
    ${arrived(p, rc, 34)}
    ${leader([1218, 318], [rc[0] + 30, rc[1] - 26])}
    ${T(1226, 312, 'reaction centre', 'fld07-lab fld07-rc')}
    ${T(96, 866, CR.own, 'fld07-credit')}
  `);
}

/* ---------- b · Then what: energy hops through the pigments into the reaction centre; what comes out is a "?" ---------- */

function drawB(): string {
  const p = 'fld07b';
  const RC: Pt = [620, 560], R = 230;
  // Pigments on a jittered grid around the reaction centre; a hop trail from the rim into the centre.
  const pts: Pt[] = [];
  for (let j = -6; j <= 6; j++) for (let i = -7; i <= 7; i++) {
    const x = RC[0] + i * 32 + (j % 2 ? 16 : 0) + Math.sin(i * 7.1 + j * 3.3) * 5, y = RC[1] + j * 30 + Math.cos(i * 2.9 + j * 5.7) * 5;
    const d = Math.hypot((x - RC[0]) / 1.25, y - RC[1]);
    if (d < R * 0.82 && d > 46) pts.push([x, y]);
  }
  const dots = pts.map(([x, y]) => `M${f(x - 7)},${f(y)}a7,7 0 1 0 14,0a7,7 0 1 0 -14,0`).join('');
  const hop: Pt[] = [[RC[0] - 236, RC[1] - 120], [RC[0] - 190, RC[1] - 92], [RC[0] - 162, RC[1] - 32], [RC[0] - 110, RC[1] - 52], [RC[0] - 76, RC[1] + 4], [RC[0] - 30, RC[1] - 6]];
  const trail = hop.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)},${f(y)}`).join('');
  const box = { x: 1110, y: 430, w: 300, h: 260 };
  return svg(p, 'Drawing: many green pigments around a reaction centre. An amber trail of energy hops from pigment to pigment into the reaction centre, which glows. From the reaction centre a dashed arrow leads to a box holding a question mark. Question: what does the reaction centre do with the energy?', `
    <defs><marker id="${p}-hd" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path class="fld07-head" d="M0,0L10,5L0,10z"/></marker></defs>
    ${ask(96, 150, 70, ['What does the reaction centre', 'do with the energy?'])}
    <path class="fld07-pig" d="${dots}"/>
    <path class="fld07-trail" d="${trail}"/>
    ${hop.map(([x, y]) => `<circle class="fld07-hopdot" cx="${f(x)}" cy="${f(y)}" r="7"/>`).join('')}
    ${arrived(p, RC, 40)}
    ${T(RC[0], RC[1] + R * 0.82 + 60, 'antenna', 'fld07-lab', 'middle')}
    ${leader([RC[0] + 150, 312], [RC[0] + 26, RC[1] - 40])}
    ${T(RC[0] + 158, 306, 'reaction centre', 'fld07-lab fld07-rc')}
    <path class="fld07-ask" d="M${RC[0] + 70},${RC[1]} H${box.x - 16}" marker-end="url(#${p}-hd)"/>
    <rect class="fld07-box" x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="22"/>
    ${qm(box.x + box.w / 2, box.y + box.h / 2 + 44, 140)}
  `);
}

/* ---------- c · Water or CO₂: the two candidate sources, a "?" on each way to the O₂ we breathe ---------- */

/** A person as a head-and-shoulders bust standing on y (as lead01). */
const person = (x: number, y: number, s = 1): string =>
  `<path class="fld07-person" d="M${f(x - 34 * s)},${y} C${f(x - 34 * s)},${f(y - 34 * s)} ${f(x - 22 * s)},${f(y - 50 * s)} ${x},${f(y - 50 * s)} C${f(x + 22 * s)},${f(y - 50 * s)} ${f(x + 34 * s)},${f(y - 34 * s)} ${f(x + 34 * s)},${y} Z"/>
   <circle class="fld07-person" cx="${x}" cy="${f(y - 74 * s)}" r="${f(18 * s)}"/>`;
/** A drawing of l01 scaled k about (x, y). */
const big = (x: number, y: number, k: number, body: string): string =>
  `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${body}</g>`;

function drawC(): string {
  const p = 'fld07c';
  const W: Pt = [330, 440], Cc: Pt = [330, 700], O: Pt = [900, 570], H: Pt = [1290, 690];
  const way = (a: Pt): string => {
    const d = `M${a[0] + 90},${a[1]} C${a[0] + 300},${a[1]} ${O[0] - 260},${O[1]} ${O[0] - 80},${O[1]}`;
    const mid: Pt = [(a[0] + 90 + O[0] - 80) / 2, (a[1] + O[1]) / 2];
    return `<path class="fld07-ask" d="${d}" marker-end="url(#${p}-hd)"/><circle class="fld07-qbg" cx="${f(mid[0])}" cy="${f(mid[1])}" r="40"/>${qm(mid[0], mid[1] + 24, 72)}`;
  };
  return svg(p, 'Drawing: a water drop and a CO₂ molecule at left; from each, a dashed arrow with a question mark leads to one O₂ molecule, which a person breathes in. Question: where does the oxygen we breathe come from: water or CO₂?', `
    <defs><marker id="${p}-hd" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path class="fld07-head" d="M0,0L10,5L0,10z"/></marker></defs>
    ${ask(96, 150, 70, ['Where does the oxygen we breathe', 'come from: water or CO₂?'])}
    ${way(W)}${way(Cc)}
    ${big(W[0], W[1], 2.6, drop(W[0], W[1]))}${T(W[0], W[1] + 82, 'water', 'fld07-lab fld07-w', 'middle')}
    ${big(Cc[0], Cc[1], 2.4, co2(Cc[0], Cc[1]))}${T(Cc[0], Cc[1] + 70, chem('CO₂'), 'fld07-lab fld07-c', 'middle')}
    ${big(O[0], O[1], 2.6, o2(O[0], O[1]))}${T(O[0], O[1] + 72, chem('O₂'), 'fld07-lab fld07-o', 'middle')}
    <path class="fld07-in" d="M${O[0] + 70},${O[1]} C${O[0] + 200},${O[1]} ${H[0] - 160},${H[1] - 80} ${H[0] - 60},${H[1] - 80}" marker-end="url(#${p}-hk)"/>
    <defs><marker id="${p}-hk" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path class="fld07-head-k" d="M0,0L10,5L0,10z"/></marker></defs>
    ${person(H[0], H[1], 1.6)}
  `);
}

/* ---------- d · Oxygen bubbles: underwater plants in water with CO₂ dissolved in it; which one gives the O₂? ---------- */

function drawD(): string {
  const p = 'fld07d';
  const ph = shot(`${p}-ph`, BUB, 860, 150, 644, 640, [300, 0, 1000, 994]);
  return svg(p, 'The question: where does the oxygen we breathe come from: water or CO₂? Beside it, a photograph taken under water of green aquatic plants with thin trails of oxygen bubbles rising from them. Water all around, and CO₂ dissolved in it.', `
    ${ask(96, 330, 68, ['Where does the oxygen', 'we breathe come from:', 'water or CO₂?'])}
    ${T(98, 600, `Water all around, and ${chem('CO₂')} dissolved in it.`, 'fld07-prompt')}
    ${ph.svg}
    ${pill(1330, 230, chem('O₂ bubbles'), ph.at(728, 300), 176)}
    ${T(1504, 826, CR.bub, 'fld07-credit', 'end')}
  `);
}

/* ---------- e · Both questions: the study page's own render, with the energy at the reaction centre ---------- */

function drawE(): string {
  const p = 'fld07e';
  const k = 0.6, x = 96, y = 190;
  const rc: Pt = [x + SIDE_RC[0] * k, y + SIDE_RC[1] * k];
  return svg(p, 'The structure of photosystem II seen from the side, with an amber glow at its reaction centre. Question: what does the reaction centre do with the energy? And: where does the oxygen we breathe come from: water or CO₂?', `
    <image href="${SIDE.href}" x="${x}" y="${y}" width="${f(SIDE.w * k)}" height="${f(SIDE.h * k)}"/>
    ${arrived(p, rc, 30)}
    ${leader([x + 470, 162], [rc[0] + 22, rc[1] - 22])}
    ${T(x + 478, 156, 'reaction centre', 'fld07-lab fld07-rc')}
    ${ask(860, 360, 68, ['What does the', 'reaction centre do', 'with the energy?'])}
    <text class="fld07-prompt" x="862" y="616">${Q2L.map((l, i) => `<tspan x="862" dy="${i ? 40 : 0}">${chem(l)}</tspan>`).join('')}</text>
    ${T(96, 866, CR.own, 'fld07-credit')}
  `);
}

export function draw(id: string): string {
  const d: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE };
  return (d[id] ?? drawA)();
}
