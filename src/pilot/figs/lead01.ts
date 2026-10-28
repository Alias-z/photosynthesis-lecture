// Lead page for slide 1 in the live lecture: the question alone, one full-page drawing (viewBox 1600 x 900);
// the study page follows after the animation as the recap. A lead page asks and never answers: no equation,
// no ATP/NADPH, no "light reactions"/"carbon reactions", no mechanism. The drawings are the study page's own
// (sun and leaf from s2.ts; wheat, loaf, step cards and stations from l01.ts variants B, F and H), so the recap
// visibly answers the picture the students puzzled over.
// Round 2 (f–j): D's framed cards (sun card first, wheat and bread last, blank "?" cards between), with no step
// count and no numbers, and a prompt that opens the big question.
// Round 3 (k–o): built on study variant O "Full picture". The page now says plainly what each half is about
// (Photo: how a leaf catches sunlight; synthesis: how it builds sugar from the air) and may name water and O₂,
// CO₂ and sugar. Still hidden: how the halves are linked (O's batteries become a "?"), the equation, inner steps.
// The lecturer's current shortlist is k–o plus d; a–c and e–j stay drawable by id through draw().
import type { Variant } from '../types';
import './lead01.css';
import { bolt } from '../illus';
import { leaf, sun } from './s2';
import { arr, co2, h2oG, loaf, marks, o2, ring, station, stepIcon, wheat } from './l01';

// The lecturer's pick (26 Oct 2026). Unlisted variants (k, m, n, o, d) still draw by id.
export const VARIANTS: Variant[] = [
  { id: 'l', name: 'Ins and outs' },
];

const f = (v: number): string => v.toFixed(1);
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fld01" viewBox="0 0 1600 900" role="img" aria-label="${label}">${marks(p)}${body}</svg>`;
const T = (x: number, y: number, s: string, cls: string, anchor: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${s}</text>`;
/** The question or title in the lead serif. */
const Q = (x: number, y: number, s: string, size: number, anchor: 'start' | 'middle' | 'end' = 'middle'): string =>
  `<text class="lead-q" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-size="${size}">${s}</text>`;
/** A large question mark standing where the answer will appear. */
const qm = (x: number, y: number, size: number): string =>
  `<text class="fld01-qm" x="${f(x)}" y="${f(y)}" text-anchor="middle" font-size="${size}">?</text>`;
/** A study-page drawing in its own coordinates, moved so `from` lands on `to` and scaled by k. */
const place = (from: [number, number], to: [number, number], k: number, body: string): string =>
  `<g transform="translate(${f(to[0])} ${f(to[1])}) scale(${k}) translate(${f(-from[0])} ${f(-from[1])})">${body}</g>`;
/** A spaced capital heading as in study variant F: PHOTO · lecture 1 · 45 min. */
const band = (x: number, y: number, word: string, rest: string, anchor: 'start' | 'middle' = 'start'): string =>
  `<text class="fld01-band" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${word}<tspan class="fld01-band-s">${rest}</tspan></text>`;

/** s2's leaf, masked to its blade and stalk: drawn large, the tips of its side veins would show past the outline. */
function bigLeaf(id: string, cx: number, cy: number, len: number, wid: number, rot: number): string {
  const h = len / 2, w = wid / 2;
  const blade = `M${-h},0 C${f(-h * 0.5)},${f(-w * 1.3)} ${f(h * 0.4)},${f(-w * 1.2)} ${h},0 C${f(h * 0.4)},${f(w * 1.2)} ${f(-h * 0.5)},${f(w * 1.3)} ${-h},0Z`;
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="${-h - 40}" y="${-w * 1.4}" width="${len + 60}" height="${w * 2.8}">
      <path d="${blade}" fill="#fff" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/><rect x="${-h - 30}" y="-6" width="34" height="18" fill="#fff"/></mask>
    <g transform="translate(${cx} ${cy}) rotate(${rot})" mask="url(#${id})">${leaf(0, 0, len, wid, 0)}</g>`;
}

/* Pieces of study variant B, in B's coordinates: the Photo half (sun, bolt, leaf) and the synthesis half (wheat, loaf). */
const photoB = (p: string): string => `${sun(84, 232, 30)}${bolt(p, 116, 254, 168, 300)}${bigLeaf(`${p}-leaf`, 232, 316, 170, 74, -18)}`;
const synthB = (): string => `${wheat(558, 196, 186)}${loaf(698, 372, 150)}`;

/* ---------- a · Word split: B's split word, with a question where B shows the link ---------- */

function drawA(): string {
  const p = 'fld01a', L = 430, R = 1170, mid = 800, cy = 450;
  const pill = (x: number, s: string): string =>
    `<rect class="fl01-pill" x="${x - 136}" y="652" width="272" height="54" rx="27"/>${T(x, 688, s, 'fld01-pill-t', 'middle')}`;
  return svg(p, 'The word photosynthesis cut in two. Photo, over a sun shining on a leaf; synthesis, over wheat and a loaf of bread. A question mark sits on the cut between them. Lecture 1 and lecture 2, 45 minutes each. What joins the two halves?', `
    ${Q(L, 214, 'Photo', 110)}${Q(R, 214, 'synthesis', 110)}
    <path class="fld01-cut" d="M${mid},96 V${cy - 70} M${mid},${cy + 70} V722"/>
    ${place([178, 283], [L, cy], 1.5, photoB(p))}
    ${place([650, 273], [R, cy], 1.5, synthB())}
    <circle class="fld01-ring" cx="${mid}" cy="${cy}" r="48"/>${qm(mid, cy + 24, 72)}
    ${pill(L, 'lecture 1 · 45 min')}${pill(R, 'lecture 2 · 45 min')}
    ${T(mid, 792, 'What joins the two halves?', 'fld01-prompt', 'middle')}
  `);
}

/* ---------- b · Sunlit leaf: one leaf as the hero, the title and a teaser question ---------- */

function drawB(): string {
  const p = 'fld01b';
  const shine = (x0: number, y0: number, x1: number, y1: number): string =>
    place([0, 0], [x0, y0], 1.6, bolt(p, 0, 0, (x1 - x0) / 1.6, (y1 - y0) / 1.6));
  return svg(p, 'Photosynthesis. The sun shines on one large leaf. What does a leaf make from sunlight?', `
    ${Q(120, 250, 'Photosynthesis', 110, 'start')}
    ${T(124, 326, 'What does a leaf make from sunlight?', 'fld01-prompt')}
    ${place([0, 0], [1340, 190], 1.9, sun(0, 0, 30))}
    ${shine(1262, 262, 1140, 418)}${shine(1336, 298, 1268, 412)}
    ${place([0, 0], [980, 572], 2.5, bigLeaf(`${p}-leaf`, 0, 0, 280, 116, -20))}
  `);
}

/* ---------- c · Sun to bread: the question, with H's two stations shut and a question mark in each ---------- */

function drawC(): string {
  const p = 'fld01c', cy = 520, top = 400, h = 240, w = 260, s1 = 410, s2 = 810;
  return svg(p, 'How does sunlight become bread? The sun shines into a closed green box marked with a question mark, labelled Photo, lecture 1, 45 minutes. An arrow leads to a closed brown box marked with a question mark, labelled Synthesis, lecture 2, 45 minutes. An arrow leads on to wheat and a loaf of bread.', `
    ${Q(800, 210, 'How does sunlight become bread?', 88)}
    ${place([0, 0], [180, cy], 1.8, sun(0, 0, 30))}
    ${place([0, 0], [278, cy], 1.5, bolt(p, 0, 0, 82, 0))}
    ${station(s1, top, w, h, 1)}${qm(s1 + w / 2, cy + 38, 110)}
    ${arr(p, 'k', `M${s1 + w + 16},${cy} H${s2 - 16}`, 'fld01-thick')}
    ${station(s2, top, w, h, 2)}${qm(s2 + w / 2, cy + 38, 110)}
    ${arr(p, 'k', `M${s2 + w + 16},${cy} H1188`, 'fld01-thick')}
    ${place([650, 273], [1352, cy], 1.2, synthB())}
    ${band(s1 + w / 2, top + h + 52, 'PHOTO', '', 'middle')}${T(s1 + w / 2, top + h + 88, 'lecture 1 · 45 min', 'fld01-pill-t', 'middle')}
    ${band(s2 + w / 2, top + h + 52, 'SYNTHESIS', '', 'middle')}${T(s2 + w / 2, top + h + 88, 'lecture 2 · 45 min', 'fld01-pill-t', 'middle')}
  `);
}

/* ---------- d · Six steps: F's six numbered cards; only the first (sunlight) and last (bread) are shown ---------- */

function drawD(): string {
  const p = 'fld01d';
  // F's grid in F's coordinates: snake order 1-2-3 left to right, down, then 4-5-6 right to left.
  const X = [8, 280, 552], Y = [70, 360], W = 240, H = 186, mid = H / 2;
  const at: Record<number, [number, number]> = { 1: [X[0], Y[0]], 2: [X[1], Y[0]], 3: [X[2], Y[0]], 4: [X[2], Y[1]], 5: [X[1], Y[1]], 6: [X[0], Y[1]] };
  const badge = (cx: number, cy: number, n: number): string =>
    `<circle class="fl01-num" cx="${cx}" cy="${cy}" r="14"/>${T(cx, cy + 6, `${n}`, 'fld01-num-t', 'middle')}`;
  const card = (n: number): string => {
    const [x, y] = at[n], cx = x + W / 2;
    // F's icons, a little larger here because the cards carry no captions.
    const icon = (cy: number): string => place([cx, cy], [cx, cy], 1.15, stepIcon(p, n, cx, cy));
    const inner = n === 1 ? icon(y + mid) : n === 6 ? icon(y + mid + 12) : qm(cx, y + mid + 30, 84);
    return `<rect class="fl01-panel" x="${x}" y="${y}" width="${W}" height="${H}" rx="14"/>${badge(x + 22, y + 22, n)}${inner}`;
  };
  const grid = `
    ${band(8, 48, 'PHOTO', ' · lecture 1 · 45 min')}${band(8, 338, 'SYNTHESIS', ' · lecture 2 · 45 min')}
    ${[1, 2, 3, 4, 5, 6].map(card).join('')}
    ${arr(p, 'k', `M${X[0] + W + 4},${Y[0] + mid} H${X[1] - 6}`)}${arr(p, 'k', `M${X[1] + W + 4},${Y[0] + mid} H${X[2] - 6}`)}
    ${arr(p, 'k', `M${X[2] - 4},${Y[1] + mid} H${X[1] + W + 6}`)}${arr(p, 'k', `M${X[1] - 4},${Y[1] + mid} H${X[0] + W + 6}`)}
    ${arr(p, 'k', `M${X[2] + W / 2},${Y[0] + H + 4} V${Y[1] - 6}`, 'fl01-handover')}`;
  return svg(p, 'Photosynthesis in six numbered steps. Photo, lecture 1, 45 minutes: step 1 shows the sun shining on a leaf; steps 2 and 3 are question marks. Synthesis, lecture 2, 45 minutes: steps 4 and 5 are question marks; step 6 shows wheat and bread. What happens in steps 2 to 5?', `
    ${Q(800, 142, 'Photosynthesis', 96)}
    ${place([400, 286], [800, 488], 1, grid)}
    ${T(800, 816, 'What happens in steps 2 to 5?', 'fld01-prompt', 'middle')}
  `);
}

/* ---------- e · Fill the blanks: ? + ? + light → bread + ? ---------- */

function drawE(): string {
  const p = 'fld01e', cy = 520, b = 150;
  const blank = (cx: number): string =>
    `<rect class="fld01-blank" x="${cx - b / 2}" y="${cy - b / 2}" width="${b}" height="${b}" rx="22"/>${qm(cx, cy + 34, 96)}`;
  const op = (cx: number, s: string): string => T(cx, cy + 20, s, 'fld01-op', 'middle');
  return svg(p, 'Photosynthesis as a puzzle: blank plus blank plus light gives bread plus blank. What fills the blanks?', `
    ${Q(800, 250, 'Photosynthesis', 110)}
    ${blank(275)}${op(400, '+')}${blank(525)}${op(650, '+')}
    ${place([0, 0], [770, cy - 14], 1.5, sun(0, 0, 30))}${T(770, cy + 112, 'light', 'fld01-lab fld01-l', 'middle')}
    ${op(905, '→')}
    ${place([0, 0], [1060, cy + 46], 1.2, loaf(0, 0, 150))}${T(1060, cy + 112, 'bread', 'fld01-lab fld01-c', 'middle')}
    ${op(1200, '+')}${blank(1325)}
    ${T(800, 776, 'What fills the blanks?', 'fld01-prompt', 'middle')}
  `);
}

/* ---------- round 2 pieces: D's cards without numbers, and new icons in the deck's flat line style ---------- */

/** D's card frame (fl01-panel), with no step badge. */
const card = (x: number, y: number, w: number, h: number): string =>
  `<rect class="fl01-panel" x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/>`;
/** D's card icons from study F: 1 = sun shining on a leaf, 6 = wheat and bread; centred on (cx, cy), scaled by k. */
const dIcon = (p: string, n: 1 | 6, cx: number, cy: number, k = 1.15): string => place([cx, cy], [cx, cy], k, stepIcon(p, n, cx, cy));

/** A smooth closed outline through the given points (Catmull-Rom as cubic Béziers). */
function blob(pts: Array<[number, number]>): string {
  const n = pts.length, P = (i: number): [number, number] => pts[(i + n) % n];
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [a, b, c, e] = [P(i - 1), P(i), P(i + 1), P(i + 2)];
    d += ` C${f(b[0] + (c[0] - a[0]) / 6)},${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)},${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])},${f(c[1])}`;
  }
  return `${d}Z`;
}
/** The Earth: pale blue sea, two pale green land masses, blue outline. */
const LAND: Array<Array<[number, number]>> = [
  [[-0.55, -0.85], [-0.15, -0.72], [-0.12, -0.38], [-0.36, -0.12], [-0.22, 0.24], [-0.32, 0.72], [-0.52, 0.5], [-0.7, 0.06], [-0.86, -0.34]],
  [[0.12, -0.82], [0.6, -0.68], [0.88, -0.3], [0.58, -0.04], [0.48, 0.42], [0.22, 0.64], [0.1, 0.22], [0.26, -0.14], [0.04, -0.46]],
];
function earth(id: string, x: number, y: number, r: number): string {
  const land = LAND.map(b => `<path class="fld01-land" d="${blob(b.map(([u, v]) => [x + u * r, y + v * r]))}"/>`).join('');
  return `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath>
    <circle class="fld01-sea" cx="${x}" cy="${y}" r="${r}"/><g clip-path="url(#${id})">${land}</g><circle class="fld01-globe" cx="${x}" cy="${y}" r="${r}"/>`;
}
/** A person as a head-and-shoulders bust, standing on y (about 92 units tall at s = 1). */
const person = (x: number, y: number, s = 1): string =>
  `<path class="fld01-person" d="M${f(x - 34 * s)},${y} C${f(x - 34 * s)},${f(y - 34 * s)} ${f(x - 22 * s)},${f(y - 50 * s)} ${x},${f(y - 50 * s)} C${f(x + 22 * s)},${f(y - 50 * s)} ${f(x + 34 * s)},${f(y - 34 * s)} ${f(x + 34 * s)},${y} Z"/>
   <circle class="fld01-person" cx="${x}" cy="${f(y - 74 * s)}" r="${f(18 * s)}"/>`;
/** A broadleaf tree h tall on base; back = the darker green of trees behind. */
const tree = (x: number, base: number, h: number, back = false): string =>
  `<path class="fld01-trunk" d="M${x},${base} V${f(base - h * 0.5)}"/><ellipse class="fld01-crown${back ? ' fld01-back' : ''}" cx="${x}" cy="${f(base - h * 0.64)}" rx="${f(h * 0.3)}" ry="${f(h * 0.34)}"/>`;
const forest = (cx: number, base: number, s = 1): string =>
  `${tree(cx - 40 * s, base - 4, 80 * s, true)}${tree(cx + 42 * s, base - 4, 86 * s, true)}${tree(cx, base, 104 * s)}`;
/** A seedling: a short stem with two small leaves. */
const sprout = (x: number, y: number): string =>
  `<path class="fld01-stem" d="M${x},${y} V${y - 24}"/><ellipse class="fld01-sprout" cx="${x - 8}" cy="${y - 13}" rx="9" ry="4.5" transform="rotate(30 ${x - 8} ${y - 13})"/><ellipse class="fld01-sprout" cx="${x + 8}" cy="${y - 19}" rx="9" ry="4.5" transform="rotate(-30 ${x + 8} ${y - 19})"/>`;
/** A zoom callout: dashed lines from a square on the detail to the left corners of the card that enlarges it,
 *  and the square itself (drawn separately, so the lines can sit under the card contents and the square above). */
const zoomLines = (sx: number, sy: number, s: number, tx: number, ty0: number, ty1: number): string =>
  `<path class="fld01-zoom" d="M${sx + s / 2},${sy - s / 2} L${tx},${ty0} M${sx + s / 2},${sy + s / 2} L${tx},${ty1}"/>`;
const zoomBox = (sx: number, sy: number, s: number): string =>
  `<rect class="fld01-zoombox" x="${sx - s / 2}" y="${sy - s / 2}" width="${s}" height="${s}" rx="3"/>`;

/* ---------- f · Card chain: sun → leaf → one wide "?" card → wheat and bread ---------- */

function drawF(): string {
  const p = 'fld01f', y = 360, H = 186, cy = y + H / 2;
  return svg(p, 'Photosynthesis. A chain of cards: the sun shines on a leaf; a wide card holds only a question mark; the chain ends at wheat and bread. How does sunlight make life on Earth possible?', `
    ${Q(800, 250, 'Photosynthesis', 104)}
    ${card(134, y, 220, H)}${place([0, 0], [244, cy], 1.6, sun(0, 0, 30))}
    ${bolt(p, 362, cy, 410, cy)}
    ${card(418, y, 240, H)}${bigLeaf(`${p}-leaf`, 546, cy + 4, 190, 82, -18)}
    ${arr(p, 'k', `M664,${cy} H714`)}
    ${card(722, y, 420, H)}${qm(932, cy + 44, 130)}
    ${arr(p, 'k', `M1148,${cy} H1198`)}
    ${card(1206, y, 260, H)}${dIcon(p, 6, 1331, cy + 10, 1.2)}
    ${T(800, 680, 'How does sunlight make life on Earth possible?', 'fld01-prompt', 'middle')}
  `);
}

/* ---------- g · Life branches: the sun card feeds one large "?" card, which branches into food, people and forests ---------- */

function drawG(): string {
  const p = 'fld01g', cy = 500, rx = 1074, rw = 240, rh = 130, ys = [281, 435, 589];
  const fan = ys.map(y => arr(p, 'k', `M904,${cy} C974,${cy} ${rx - 76},${y + rh / 2} ${rx - 8},${y + rh / 2}`)).join('');
  return svg(p, 'Photosynthesis. A card with the sun shining on a leaf feeds one large card holding a question mark. From it, arrows branch out to three cards: wheat and bread, a person, and a forest. What turns sunlight into all of this?', `
    ${Q(800, 150, 'Photosynthesis', 96)}
    ${card(286, cy - 93, 240, 186)}${dIcon(p, 1, 406, cy)}
    ${arr(p, 'k', `M532,${cy} H606`)}
    ${card(614, 360, 280, 280)}${qm(754, cy + 50, 150)}
    ${fan}
    ${ys.map(y => card(rx, y, rw, rh)).join('')}
    ${dIcon(p, 6, rx + rw / 2 - 5, ys[0] + rh / 2 + 10, 0.95)}
    ${person(rx + rw / 2, ys[1] + rh / 2 + 48)}
    ${forest(rx + rw / 2, ys[2] + rh / 2 + 52)}
    ${T(800, 800, 'What turns sunlight into all of this?', 'fld01-prompt', 'middle')}
  `);
}

/* ---------- h · Two rows: D's grid without numbers; one "?" card in each row between the known ends ---------- */

function drawH(): string {
  const p = 'fld01h';
  // D's grid in study F's coordinates: the Photo row runs left to right, hands over, and the Synthesis row runs back.
  const grid = `
    ${band(8, 48, 'PHOTO', ' · lecture 1 · 45 min')}${band(8, 338, 'SYNTHESIS', ' · lecture 2 · 45 min')}
    ${card(8, 70, 240, 186)}${dIcon(p, 1, 128, 163)}
    ${arr(p, 'k', 'M252,163 H272')}
    ${card(280, 70, 512, 186)}${qm(536, 193, 96)}
    ${arr(p, 'k', 'M672,260 V354', 'fl01-handover')}
    ${card(280, 360, 512, 186)}${qm(536, 483, 96)}
    ${arr(p, 'k', 'M276,453 H254')}
    ${card(8, 360, 240, 186)}${dIcon(p, 6, 128, 465)}`;
  return svg(p, 'Photosynthesis in two rows of cards. Photo, lecture 1, 45 minutes: the sun shining on a leaf, then a wide card with a question mark. Synthesis, lecture 2, 45 minutes: a wide card with a question mark, then wheat and bread. How does sunlight end up in our bread?', `
    ${Q(800, 128, 'Photosynthesis', 96)}
    ${place([400, 286], [800, 474], 1, grid)}
    ${T(800, 802, 'How does sunlight end up in our bread?', 'fld01-prompt', 'middle')}
  `);
}

/* ---------- i · Zoom in: sunlit Earth → field → leaf → a large "?" card for what happens inside the leaf ---------- */

function drawI(): string {
  const p = 'fld01i', y = 370, H = 200;
  const hill = (t: number): [number, number] => [462 + 216 * t, 524 - 120 * t * (1 - t)];
  const row1 = [0.12, 0.31, 0.5, 0.69, 0.88].map(t => { const [x, yy] = hill(t); return sprout(x, yy + 12); }).join('');
  const row2 = [0.21, 0.4, 0.6, 0.79].map(t => { const [x, yy] = hill(t); return sprout(x, yy + 40); }).join('');
  // Zoom squares: on the land, around one seedling, on the leaf blade.
  const Z: Array<[number, number, number, number, number, number]> = [[306, 480, 24, 450, y, y + H], [570, 492, 44, 770, y, y + H], [915, 466, 30, 1090, 320, 620]];
  return svg(p, 'Photosynthesis. Zooming in, card by card: the sun shining on the Earth; a field of seedlings; one leaf; and a large card holding a question mark for what happens inside the leaf. What happens inside a sunlit leaf?', `
    ${Q(800, 200, 'Photosynthesis', 96)}
    ${card(110, y, 260, H)}${card(450, y, 240, H)}${card(770, y, 240, H)}${card(1090, 320, 380, 300)}
    ${Z.map(z => zoomLines(...z)).join('')}
    ${sun(160, 425, 20)}${bolt(p, 186, 446, 224, 470)}${earth(`${p}-earth`, 282, 482, 64)}
    <path class="fld01-ground" d="M462,524 Q570,464 678,524 L678,556 L462,556 Z"/>${row1}${row2}
    ${bigLeaf(`${p}-leaf`, 898, 472, 180, 78, -18)}
    ${qm(1280, 522, 150)}
    ${Z.map(([sx, sy, s]) => zoomBox(sx, sy, s)).join('')}
    ${T(800, 730, 'What happens inside a sunlit leaf?', 'fld01-prompt', 'middle')}
  `);
}

/* ---------- j · Life loop: the sun card feeds a ring of cards, leaf → "?" → food → life → back to the leaf ---------- */

function drawJ(): string {
  const p = 'fld01j', w = 220, h = 150;
  return svg(p, 'Photosynthesis. A sun card shines into a ring of cards that runs clockwise: a leaf, a card holding a question mark, wheat and bread, then a person and a tree, and back to the leaf. What keeps the circle of life turning?', `
    ${Q(120, 180, 'Photosynthesis', 96, 'start')}
    ${T(124, 252, 'What keeps the circle of life turning?', 'fld01-prompt')}
    ${card(430, 445, w, h)}${sun(540, 520, 30)}
    ${bolt(p, 656, 520, 708, 520)}
    ${card(720, 445, w, h)}${bigLeaf(`${p}-leaf`, 838, 524, 160, 70, -18)}
    ${card(950, 255, w, h)}${qm(1060, 376, 120)}
    ${card(1180, 445, w, h)}${dIcon(p, 6, 1285, 530, 1)}
    ${card(950, 635, w, h)}${person(1020, 772, 0.95)}${tree(1108, 772, 112)}
    ${arr(p, 'k', 'M830,437 Q830,330 942,330')}
    ${arr(p, 'k', 'M1178,330 Q1290,330 1290,437')}
    ${arr(p, 'k', 'M1290,603 Q1290,710 1178,710')}
    ${arr(p, 'k', 'M942,710 Q830,710 830,603')}
  `);
}

/* ---------- round 3 pieces: study O's frame and drawings ---------- */

/** Subscript digits as smaller, lowered digits (the web font has no subscript glyphs). */
const chem = (s: string): string =>
  s.replace(/[₀-₉]+/g, m => `<tspan class="fld01-sb">${[...m].map(d => d.charCodeAt(0) - 0x2080).join('')}</tspan>`);
/** Text with an explicit size (in the units of the group it sits in). */
const Ts = (x: number, y: number, s: string, cls: string, size: number, anchor: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" font-size="${size}" text-anchor="${anchor}">${chem(s)}</text>`;
/** Study O's 800 × 600 frame on the lead page: O's centre line x = 400 lands on the page centre, scaled so O's
 *  80-unit words come out at 110 px. */
const OK = 1.375;
const onO = (body: string): string => place([400, 0], [800, 20], OK, body);
/** O's heading: the two words with their Greek roots. */
const oWords = `${Q(178, 84, 'Photo', 80)}${Q(616, 84, 'synthesis', 80)}
    ${Ts(178, 126, 'Greek phōs, light', 'fld01-gloss', 23, 'middle')}${Ts(616, 126, 'Greek synthesis, putting together', 'fld01-gloss', 23, 'middle')}`;
/** O's photo half (sun, bolt, leaf; with water in and O₂ out when io is set), moved down by dy. */
const oPhoto = (p: string, dy: number, io: boolean): string => `
    ${sun(54, 206 + dy, 20)}${bolt(p, 78, 226 + dy, 116, 262 + dy)}${bigLeaf(`${p}-leaf`, 190, 300 + dy, 150, 66, -18)}
    ${io ? `${h2oG(64, 388 + dy)}${arr(p, 'w', `M80,${368 + dy} Q102,${344 + dy} 128,${328 + dy}`)}
    ${arr(p, 'w', `M226,${338 + dy} Q242,${362 + dy} 250,${388 + dy}`)}${o2(256, 408 + dy, 9)}` : ''}`;
/** O's synthesis half without its cycle: CO₂ from the air comes down into the sugar hexagon (where O's cycle
 *  turned), and sugar goes on to wheat and bread. The "?" link arrives from the left. */
const oSynth = (p: string, dy: number): string => `
    ${co2(530, 190 + dy, 9)}${arr(p, 'w', `M530,${208 + dy} V${266 + dy}`)}
    ${ring(530, 293 + dy, 20)}
    ${arr(p, 'c', `M554,${302 + dy} Q592,${310 + dy} 600,${348 + dy}`)}
    ${wheat(640, 366 + dy, 104)}${loaf(732, 470 + dy, 104)}`;
/** The hidden link: a "?" on the cut where O's batteries were, with the arrows from the leaf and on to the sugar. */
const oLink = (p: string, dy: number): string => `
    ${arr(p, 'k', `M290,${293 + dy} H360`)}
    <circle class="fld01-ring" cx="400" cy="${293 + dy}" r="32"/>${qm(400, 293 + dy + 17, 50)}
    ${arr(p, 'k', `M440,${293 + dy} H502`)}`;

/* ---------- k · Topic lines: O's halves, each word with what it is about; a "?" where the batteries were ---------- */

function drawK(): string {
  const p = 'fld01k', dy = 56;
  return svg(p, 'Photo, Greek phōs, light: catching sunlight. The sun shines on a leaf. Synthesis, Greek for putting together: building sugar from air. CO₂ from the air goes into sugar, and sugar becomes wheat and bread. Between the halves, where the link would be, a question mark. How does a leaf turn sunlight into food?', onO(`
    ${oWords}
    ${Ts(178, 162, 'catching sunlight', 'fld01-topic', 24, 'middle')}${Ts(616, 162, 'building sugar from air', 'fld01-topic', 24, 'middle')}
    <path class="fld01-cut" d="M400,36 V${293 + dy - 44} M400,${293 + dy + 44} V${490 + dy}"/>
    ${oPhoto(p, dy, false)}${oSynth(p, dy)}${oLink(p, dy)}
    ${Ts(560, 198 + dy, 'CO₂', 'fld01-term fld01-m', 22)}${Ts(530, 348 + dy, 'sugar', 'fld01-term fld01-m', 22, 'middle')}
  `) + T(800, 842, 'How does a leaf turn sunlight into food?', 'fld01-prompt', 'middle'));
}

/* ---------- l · Ins and outs: O's halves with what goes in and comes out of each; the link is a "?" ---------- */

function drawL(): string {
  // Balance: three bands with even air between them. The words (96 px) and their Greek roots on top; O's
  // drawing in the middle, scaled to 1.2 so the page breathes; the lecture tags under their halves, and the
  // question at the foot.
  const p = 'fld01l', K = 1.2, top = 262;
  const at = (x: number): number => 800 + (x - 400) * K; // O's x on the page
  const pill = (x: number, s: string): string =>
    `<rect class="fl01-pill" x="${f(x - 118)}" y="704" width="236" height="42" rx="21"/>${T(x, 734, s, 'fld01-pill-t', 'middle')}`;
  return svg(p, 'Photo, Greek phōs, light: light shines on a leaf; water goes in and O₂ comes out. Lecture 1, 45 minutes. Synthesis, Greek for putting together: CO₂ goes in, sugar comes out, and sugar becomes bread. Lecture 2, 45 minutes. Between the halves, a question mark. How do light, water and air become bread?', `
    ${Q(at(178), 132, 'Photo', 96)}${Q(at(616), 132, 'synthesis', 96)}
    ${Ts(at(178), 182, 'Greek phōs, light', 'fld01-gloss', 26, 'middle')}${Ts(at(616), 182, 'Greek synthesis, putting together', 'fld01-gloss', 26, 'middle')}
    ${place([400, 172], [800, top], K, `
      <path class="fld01-cut" d="M400,12 V249 M400,337 V528"/>
      ${oPhoto(p, 0, true)}${oSynth(p, 0)}${oLink(p, 0)}
      ${Ts(106, 214, 'light', 'fld01-term fld01-l', 22)}
      ${Ts(64, 432, 'H₂O', 'fld01-term fld01-w', 22, 'middle')}${Ts(280, 417, 'O₂', 'fld01-term fld01-w', 22)}
      ${Ts(560, 198, 'CO₂', 'fld01-term fld01-m', 22)}${Ts(530, 348, 'sugar', 'fld01-term fld01-m', 22, 'middle')}
      ${Ts(732, 500, 'bread', 'fld01-term fld01-c', 22, 'middle')}`)}
    ${pill(at(178), 'lecture 1 · 45 min')}${pill(at(616), 'lecture 2 · 45 min')}
    ${T(800, 830, 'How do light, water and air become bread?', 'fld01-prompt', 'middle')}
  `);
}

/* ---------- m · Two questions: under each word, the question that half answers; no link drawn ---------- */

function drawM(): string {
  const p = 'fld01m', dy = 62;
  return svg(p, 'Photo, Greek phōs, light: how does a leaf catch light? The sun shines on a leaf. Synthesis, Greek for putting together: how does it build food from air? CO₂ from the air goes into sugar, and sugar becomes wheat and bread. How does sunlight end up on our plate?', onO(`
    ${oWords}
    ${Ts(178, 172, 'How does a leaf catch light?', 'fld01-halfq', 27, 'middle')}${Ts(616, 172, 'How does it build food from air?', 'fld01-halfq', 27, 'middle')}
    <path class="fld01-cut" d="M400,36 V${490 + dy}"/>
    ${oPhoto(p, dy + 22, false)}${oSynth(p, dy)}
    ${Ts(560, 198 + dy, 'CO₂', 'fld01-term fld01-m', 22)}${Ts(530, 348 + dy, 'sugar', 'fld01-term fld01-m', 22, 'middle')}
  `) + T(800, 842, 'How does sunlight end up on our plate?', 'fld01-prompt', 'middle'));
}

/* ---------- n · Topic cards: O's drawings in D's cards, each titled with its topic; one "?" card for the link ---------- */

function drawN(): string {
  const p = 'fld01n', Y = 40, top = 290 + Y, h = 330, cy = top + 190, A = 410, B = 1190;
  return svg(p, 'Photo, Greek phōs, light, over a card titled catching sunlight: the sun shines on a leaf. Synthesis, Greek for putting together, over a card titled building sugar from air: CO₂ becomes sugar, and sugar becomes wheat and bread. Between the two cards, a card holding a question mark. How does sunlight make life on Earth possible?', `
    ${Q(A, 180 + Y, 'Photo', 110)}${Q(B, 180 + Y, 'synthesis', 110)}
    ${Ts(A, 240 + Y, 'Greek phōs, light', 'fld01-gloss', 30, 'middle')}${Ts(B, 240 + Y, 'Greek synthesis, putting together', 'fld01-gloss', 30, 'middle')}
    <path class="fld01-cut" d="M800,${92 + Y} V${250 + Y}"/>
    ${card(140, top, 540, h)}${Ts(168, top + 46, 'Catching sunlight', 'fld01-ctitle', 28)}
    ${place([177, 283], [A, cy + 12], 1.2, photoB(p))}
    ${arr(p, 'k', `M686,${cy} H712`)}
    ${card(720, top, 160, h)}${qm(800, cy + 40, 110)}
    ${arr(p, 'k', `M886,${cy} H912`)}
    ${card(920, top, 540, h)}${Ts(948, top + 46, 'Building sugar from air', 'fld01-ctitle', 28)}
    ${place([0, 0], [1010, cy], 1.5, co2(0, 0, 9))}${Ts(1010, cy - 38, 'CO₂', 'fld01-term fld01-m', 28, 'middle')}
    ${arr(p, 'w', `M1052,${cy} H1092`)}
    ${place([0, 0], [1124, cy], 1.4, ring(0, 0, 20))}${Ts(1124, cy - 46, 'sugar', 'fld01-term fld01-m', 28, 'middle')}
    ${arr(p, 'c', `M1158,${cy} H1196`)}
    ${place([650, 273], [1330, cy + 6], 1.0, synthB())}
    ${T(800, 720 + Y, 'How does sunlight make life on Earth possible?', 'fld01-prompt', 'middle')}
  `);
}

/* ---------- o · Agenda: each word over its lecture tag and three guiding questions, each with O's own icon ---------- */

function drawO(): string {
  const p = 'fld01o', Y = 24, L = 430, R = 1170, rows = [410 + Y, 500 + Y, 590 + Y];
  const pill = (x: number, s: string): string =>
    `<rect class="fl01-pill" x="${x - 136}" y="${258 + Y}" width="272" height="52" rx="26"/>${T(x, 293 + Y, s, 'fld01-pill-t', 'middle')}`;
  const item = (x: number, y: number, icon: string, s: string): string => `${icon}${Ts(x + 84, y + 10, s, 'fld01-agenda', 28)}`;
  return svg(p, 'An agenda in two halves. Photo, Greek phōs, light, lecture 1, 45 minutes: what is light? How do leaves catch it? Where does the oxygen come from? Synthesis, Greek for putting together, lecture 2, 45 minutes: how is CO₂ captured? Where does the sugar go? How does sugar become bread? On the line between the halves, a question mark. What ties the two lectures together?', `
    ${Q(L, 168 + Y, 'Photo', 110)}${Q(R, 168 + Y, 'synthesis', 110)}
    ${Ts(L, 228 + Y, 'Greek phōs, light', 'fld01-gloss', 30, 'middle')}${Ts(R, 228 + Y, 'Greek synthesis, putting together', 'fld01-gloss', 30, 'middle')}
    ${pill(L, 'lecture 1 · 45 min')}${pill(R, 'lecture 2 · 45 min')}
    <path class="fld01-cut" d="M800,${80 + Y} V${rows[1] - 52} M800,${rows[1] + 52} V${660 + Y}"/>
    <circle class="fld01-ring" cx="800" cy="${rows[1]}" r="40"/>${qm(800, rows[1] + 21, 62)}
    ${item(170, rows[0], sun(206, rows[0], 18), 'What is light?')}
    ${item(170, rows[1], bigLeaf(`${p}-leaf`, 206, rows[1], 78, 34, -18), 'How do leaves catch it?')}
    ${item(170, rows[2], o2(206, rows[2], 12), 'Where does the oxygen come from?')}
    ${item(910, rows[0], co2(946, rows[0], 11), 'How is CO₂ captured?')}
    ${item(910, rows[1], ring(946, rows[1], 22), 'Where does the sugar go?')}
    ${item(910, rows[2], loaf(946, rows[2] + 18, 72), 'How does sugar become bread?')}
    ${T(800, 760 + Y, 'What ties the two lectures together?', 'fld01-prompt', 'middle')}
  `);
}

export function draw(id: string): string {
  const d: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH, i: drawI, j: drawJ, k: drawK, l: drawL, m: drawM, n: drawN, o: drawO };
  return (d[id] ?? drawA)();
}
