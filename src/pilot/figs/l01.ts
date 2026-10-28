// Slide L01 · Photosynthesis. Confirmed context: PHOTO (light reactions, solar energy, the colour of life) and
// SYNTHESIS (carbon reactions, CO₂ → sugars, the bread that feeds us), 45 min each, linked by ATP + NADPH.
// The classic equation 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂, with light written over the arrow, is the spine that returns in C13.
// Light is amber; molecules are the deck's glyphs (atom balls, lecturer 28 Oct 2026), their names in ink, gas and water
// paths neutral grey; the carbon path stays brown. Each term also carries its own name or icon.
import type { PlateText, Variant } from '../types';
import './l01.css';
import { rxn } from '../plates-text';
import { bolt, illusHeads, molecule, tag } from '../illus';
import { rowG } from './chain';
import { leaf, sun } from './s2';

export const PLATE: PlateText = {
  n: '1',
  status: 'confirmed',
  title: 'Photosynthesis',
  lead: 'Photosynthesis converts light energy into chemical energy.',
  points: [
    { claim: 'Light reactions.', text: 'Pigments absorb light<br>Water is oxidised, O₂ is released<br>ATP and NADPH are made' },
    { claim: 'Calvin–Benson–Bassham cycle.', text: 'RuBisCO fixes CO₂<br>ATP and NADPH make it into sugar<br>The carbon in bread comes from air' },
    { claim: 'Overall equation.', text: `6 CO₂ + 6 H₂O ${rxn('light')} C₆H₁₂O₆ + 6 O₂` },
  ],
  refs: [{ label: 'Johnson 2016', url: 'https://doi.org/10.1042/EBC20160016' }],
};

// Round 2: the lecturer's picks (b, f, h) first, then five combinations of them (k–o).
// The unpicked round-1 variants (a, c, d, e, g, i, j) stay drawable by id through draw().
// The lecturer's picks (26 Oct 2026); the others were removed from the list at their request. Unlisted variants (r, p, k, l, m, n) still draw by id.
export const VARIANTS: Variant[] = [
  { id: 'o', name: 'Full picture' },
  { id: 'b', name: 'Word split' },
  { id: 'f', name: 'Six steps', anim: true },
  { id: 'h', name: 'Battery analogy' },
];

const f = (v: number): string => v.toFixed(1);
type K = 'l' | 'w' | 'c' | 'o';

/** Subscript digits as smaller, lowered Inter digits (the web font has no subscript glyphs). */
const chem = (s: string): string =>
  s.replace(/[₀-₉]+/g, m => `<tspan class="fl01-sb">${[...m].map(d => d.charCodeAt(0) - 0x2080).join('')}</tspan>`);
const T = (x: number, y: number, s: string, cls: string, anchor: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${chem(s)}</text>`;

/** Arrowheads in the term colours and in ink. */
export const marks = (p: string): string => `${illusHeads(p)}<defs>${(['l', 'w', 'c', 'k'] as const).map(k =>
  `<marker id="${p}-a${k}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="fl01-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
export const arr = (p: string, k: 'l' | 'w' | 'c' | 'k', d: string, extra = ''): string =>
  `<path class="fl01-ar fl01-ar-${k}${extra ? ` ${extra}` : ''}" d="${d}" marker-end="url(#${p}-a${k})"/>`;
const svg = (p: string, label: string, body: string, h = 600): string =>
  `<svg class="fig-svg fl01" viewBox="0 0 800 ${h}" role="img" aria-label="${label}">${marks(p)}${body}</svg>`;

/* ---------- the equation ---------- */

interface Term { id: string; s: string; k: K }
// Light is written over the reaction arrow, as in the textbook form; it is not a reactant.
const EQ: Term[] = [
  { id: 'co2', s: '6 CO₂', k: 'c' }, { id: 'p1', s: '+', k: 'o' }, { id: 'h2o', s: '6 H₂O', k: 'w' },
  { id: 'arrow', s: '', k: 'o' }, { id: 'sugar', s: 'C₆H₁₂O₆', k: 'c' }, { id: 'p3', s: '+', k: 'o' },
  { id: 'o2', s: '6 O₂', k: 'w' },
];
const EMW: Record<string, number> = { ' ': 0.27, '+': 0.6, '→': 0.9, C: 0.72, O: 0.79, H: 0.75, l: 0.27, i: 0.27, g: 0.61, h: 0.61, t: 0.38 };
const em = (s: string): number => [...s].reduce((a, ch) => a + (/[₀-₉]/.test(ch) ? 0.42 : /\d/.test(ch) ? 0.62 : (EMW[ch] ?? 0.58)), 0);

/** The classic equation centred on cx, with light over a long arrow; returns the drawing and each term's centre
 *  (light shares the arrow's centre). */
function equation(cx: number, y: number, size: number, gap = 0.38): { svg: string; x: Record<string, number>; w: Record<string, number> } {
  const w: Record<string, number> = {}, x: Record<string, number> = {};
  EQ.forEach(t => { w[t.id] = t.id === 'arrow' ? 1.9 * size : em(t.s) * size; });
  const total = EQ.reduce((a, t) => a + w[t.id], 0) + gap * size * (EQ.length - 1);
  let at = cx - total / 2;
  EQ.forEach(t => { x[t.id] = at + w[t.id] / 2; at += w[t.id] + gap * size; });
  x.light = x.arrow;
  const ay = y - 0.32 * size, a0 = x.arrow - w.arrow / 2, a1 = x.arrow + w.arrow / 2, hd = 0.3 * size;
  const arrow = `<path class="fl01-eq-ar" d="M${f(a0)},${f(ay)} H${f(a1 - hd * 0.6)}" style="stroke-width:${f(size * 0.07)}px"/>
    <path class="fl01-eq-hd" d="M${f(a1)},${f(ay)} L${f(a1 - hd)},${f(ay - hd * 0.5)} L${f(a1 - hd)},${f(ay + hd * 0.5)} Z"/>
    <text class="fl01-eq-light fl01-l" x="${f(x.arrow)}" y="${f(ay - 0.22 * size)}" text-anchor="middle" style="font-size:${f(size * 0.62)}px">light</text>`;
  const body = EQ.map(t => t.id === 'arrow' ? arrow : `<text class="fl01-eq fl01-${t.k}" x="${f(x[t.id])}" y="${y}" text-anchor="middle" style="font-size:${size}px">${chem(t.s)}</text>`).join('');
  return { svg: body, x, w };
}

/* ---------- icons ---------- */

/** Water as the deck's glyph: one O ball with two small H balls below it, centred near (x, y) (it replaced a drop icon). */
export const h2oG = (x: number, y: number, s = 1): string => h2o(x, y - 2 * s, 11 * s);
/** The former drop icon's name, kept for lead07.ts (not listed): it draws the water glyph too. */
export const drop = h2oG;
/** O₂ as two touching O balls. */
export const o2 = (x: number, y: number, r = 10): string => molecule(x, y, 'OO', r);
/** CO₂ as O–C–O balls in a row. */
export const co2 = (x: number, y: number, r = 10): string => molecule(x, y, 'OCO', r);
/** Water: an O ball with two small H balls below it. */
const h2o = (x: number, y: number, r = 10): string =>
  `<circle class="atom atom-H" cx="${f(x - r * 0.95)}" cy="${f(y + r * 0.75)}" r="${f(r * 0.58)}"/><circle class="atom atom-H" cx="${f(x + r * 0.95)}" cy="${f(y + r * 0.75)}" r="${f(r * 0.58)}"/>${molecule(x, y, 'O', r)}`;
/** One carbon atom ball. */
const cAtom = (x: number, y: number, r = 10): string => molecule(x, y, 'C', r);
/** A six-membered sugar ring. */
export function ring(x: number, y: number, r = 22): string {
  const pts = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i + Math.PI / 6; return `${f(x + r * Math.cos(a))},${f(y + r * Math.sin(a))}`; });
  return `<path class="fl01-ring" d="M${pts.join('L')}Z"/>`;
}
/** Six carbons in a zigzag chain: the carbon skeleton of the sugar. */
function chain(x: number, y: number, step = 24, r = 10): string {
  const P = Array.from({ length: 6 }, (_, i) => [x + (i - 2.5) * step, y + (i % 2 ? 9 : -9)]);
  return `<path class="fl01-bond" d="M${P.map(q => `${f(q[0])},${f(q[1])}`).join('L')}"/>${P.map(q => cAtom(q[0], q[1], r)).join('')}`;
}
export function loaf(x: number, y: number, w: number): string {
  const h = w * 0.52, l = x - w / 2, r = x + w / 2;
  const cuts = [-0.24, 0, 0.24].map(t => `M${f(x + t * w - w * 0.07)},${f(y - h * 0.62)} Q${f(x + t * w)},${f(y - h * 0.86)} ${f(x + t * w + w * 0.08)},${f(y - h * 0.8)}`).join('');
  return `<path class="fl01-loaf" d="M${f(l)},${y} L${f(l + 4)},${f(y - h * 0.4)} C${f(l)},${f(y - h * 1.12)} ${f(r)},${f(y - h * 1.12)} ${f(r - 4)},${f(y - h * 0.4)} L${f(r)},${y} Z"/><path class="fl01-cut" d="${cuts}"/>`;
}
export function wheat(x: number, top: number, h: number): string {
  const ear = h * 0.5, n = 6;
  const grains = Array.from({ length: n }, (_, i) => {
    const gy = top + 12 + (i * (ear - 12)) / (n - 1);
    return [-1, 1].map(s => `<ellipse class="fl01-grain" cx="${f(x + s * 7)}" cy="${f(gy)}" rx="6.5" ry="11" transform="rotate(${s * 24} ${f(x + s * 7)} ${f(gy)})"/>
      <path class="fl01-awn" d="M${f(x + s * 9)},${f(gy - 9)} L${f(x + s * 22)},${f(gy - 34)}"/>`).join('');
  }).join('');
  return `<path class="fl01-stem" d="M${x},${top + h} L${x},${top + 6}"/><path class="fl01-stem" d="M${x},${top + h * 0.78} Q${x + 26},${top + h * 0.66} ${x + 40},${top + h * 0.5}"/>${grains}`;
}
/** A rechargeable battery: full shows three amber cells, empty shows none. */
function battery(x: number, y: number, full: boolean): string {
  const cells = full ? [0, 1, 2].map(i => `<rect class="fl01-cell" x="${x - 19 + i * 13}" y="${y - 8}" width="10" height="16" rx="2"/>`).join('') : '';
  return `<rect class="fl01-batt" x="${x - 24}" y="${y - 13}" width="46" height="26" rx="5"/><rect class="fl01-batt-nub" x="${x + 22}" y="${y - 5}" width="5" height="10" rx="1.5"/>${cells}`;
}
const bracket = (x0: number, x1: number, y: number, down: boolean): string => {
  const t = down ? 10 : -10;
  return `<path class="fl01-brk" d="M${f(x0)},${f(y + t)} V${y} H${f(x1)} V${f(y + t)}"/>`;
};
/** A small serif heading for a lecture: PHOTO · lecture 1 · 45 min. */
const lecture = (x: number, y: number, word: string, n: 1 | 2, anchor: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="fl01-band" x="${x}" y="${y}" text-anchor="${anchor}">${word}<tspan class="fl01-band-s"> · lecture ${n} · 45 min</tspan></text>`;

/* ---------- pieces of the picked variants (B, F, H), shared with the round-2 combinations k–o ---------- */

/** B: one half of the split word, in the big serif. */
const word = (x: number, y: number, s: string): string => `<text class="fl01-word" x="${x}" y="${y}" text-anchor="middle">${s}</text>`;

/** F: a dark numbered badge. */
const num = (cx: number, cy: number, n: number): string =>
  `<circle class="fl01-num" cx="${cx}" cy="${cy}" r="14"/>${T(cx, cy + 6, `${n}`, 'fl01-num-t', 'middle')}`;

/** F: the icon and caption of each of the six steps. */
export function stepIcon(p: string, n: number, cx: number, cy: number): string {
  switch (n) {
    case 1: return `${sun(cx - 54, cy - 2, 16)}${bolt(p, cx - 28, cy - 2, cx + 4, cy + 4)}${leaf(cx + 50, cy + 6, 80, 34, -14)}`;
    case 2: return `${h2oG(cx - 56, cy + 4, 1.3)}${arr(p, 'w', `M${cx - 30},${cy} H${cx + 22}`)}${o2(cx + 52, cy)}`;
    case 3: return `${tag(cx - 46, cy, 'ATP', 'atp')}${tag(cx + 46, cy, 'NADPH', 'nadph')}`;
    case 4: return `${co2(cx - 50, cy, 9)}${arr(p, 'w', `M${cx - 20},${cy} H${cx + 24}`)}${cAtom(cx + 48, cy)}`;
    case 5: return `${ring(cx, cy, 26)}`;
    default: return `${wheat(cx - 50, cy - 34, 80)}${loaf(cx + 44, cy + 32, 94)}`;
  }
}
const STEP: Record<number, [string, string, string]> = {
  1: ['Absorb light', 'in pigments', ''],
  2: ['Oxidise water', 'it gives electrons;', 'O₂ is released'],
  3: ['Store energy', 'in ATP and NADPH', ''],
  4: ['Fix CO₂', 'carbon from the air', ''],
  5: ['Make sugar', 'with ATP and NADPH', ''],
  6: ['Feed us', 'as grain and bread', ''],
};
/** F: one step as a card: badge, icon, title and two caption lines (offsets from the card top). */
function stepCard(p: string, n: number, x: number, y: number, W: number, H: number, dy: [number, number, number, number] = [62, 128, 154, 178]): string {
  const cx = x + W / 2, [a, b, c] = STEP[n];
  return `<rect class="fl01-panel" x="${x}" y="${y}" width="${W}" height="${H}" rx="14"/>
      ${num(x + 22, y + 22, n)}
      ${stepIcon(p, n, cx, y + dy[0])}
      ${T(cx, y + dy[1], a, 'fl01-txt fl01-b', 'middle')}${T(cx, y + dy[2], b, 'fl01-name fl01-dark', 'middle')}${c ? T(cx, y + dy[3], c, 'fl01-name fl01-dark', 'middle') : ''}`;
}

/** H: a station of the analogy (1 = solar charger, 2 = workshop). */
export const station = (x: number, y: number, w: number, h: number, k: 1 | 2): string =>
  `<rect class="fl01-station fl01-st-${k}" x="${x}" y="${y}" width="${w}" height="${h}" rx="20"/>`;
/** H: the workshop's turning cycle, three brown arcs. */
const cycle = (p: string, cx: number, cy: number, r = 52): string => [0, 1, 2].map(i => {
  const a = -Math.PI / 2 + i * 2.09 + 0.15, b = a + 1.7;
  return arr(p, 'c', `M${f(cx + r * Math.cos(a))},${f(cy + r * Math.sin(a))} A${r},${r} 0 0 1 ${f(cx + r * Math.cos(b))},${f(cy + r * Math.sin(b))}`, 'fl01-cyc');
}).join('');
/** H: a row of three batteries, charged or empty. */
const batteries = (cx: number, y: number, full: boolean, dx = 74): string => [-1, 0, 1].map(i => battery(cx + i * dx, y, full)).join('');

/** The batteries' carriers as tags: charged ATP + NADPH, empty ADP + Pᵢ, NADP⁺. */
type Row = Parameters<typeof rowG>[2];
const FULL: Row = [['ATP', 'atp'], ['+', 'op'], ['NADPH', 'nadph']];
const EMPTY: Row = [['ADP', 'atp'], ['+', 'op'], ['', 'pi'], [',', 'op'], ['NADP⁺', 'nadph']];
/** chain.ts's row of tags, 1.2 × larger so its letters (18 px) sit with this figure's 22 px labels. */
const TK = 1.2;
const tags = (cx: number, y: number, items: Row): string =>
  `<g transform="translate(${f(cx)} ${f(y)}) scale(${TK}) translate(${f(-cx)} ${f(-y)})">${rowG(cx, y, items)}</g>`;
/** A word (e.g. "charged:") and a row of tags after it, the pair centred on cx. Widths as in chain.ts rowG. */
function named(cx: number, y: number, word: string, items: Row): string {
  const wid = ([s, k]: Row[number]): number => (k === 'op' ? 20 : k === 'h' ? 26 : k === 'pi' ? 28 : s.length * 9.6 + 18);
  const rw = TK * (items.reduce((a, it) => a + wid(it), 0) + 5 * (items.length - 1)), ww = word.length * 10.6, gap = 10;
  const x0 = cx - (ww + gap + rw) / 2;
  return `${T(x0 + ww, y + 7, word, 'fl01-name fl01-dark', 'end')}${tags(x0 + ww + gap + rw / 2, y, items)}`;
}

/* ---------- a · Equation split: photo terms up, synthesis terms down ---------- */

function drawA(): string {
  const p = 'fl01a';
  const y = 300, E = equation(400, y, 36), x = E.x;
  const top = 168, bot = 452, link = x.arrow;
  const pm = (x.h2o + x.o2) / 2, sm = (x.co2 + x.sugar) / 2;
  return svg(p, 'The classic equation 6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂. Light, water and O₂ connect up to Photo, lecture 1; CO₂ and sugar connect down to Synthesis, lecture 2. ATP and NADPH pass from Photo to Synthesis through the arrow.', `
    ${lecture(pm, 50, 'PHOTO', 1, 'middle')}
    ${T(pm, 86, 'light reactions: capture solar energy', 'fl01-txt', 'middle')}
    ${T(pm, 122, 'the colour of life', 'fl01-hook', 'middle')}
    ${bracket(x.h2o, x.o2, top, true)}
    ${[x.h2o, x.light, x.o2].map(v => `<path class="fl01-brk" d="M${f(v)},${top} V${y - 40}"/>`).join('')}
    ${T(x.co2, y - 46, 'from the air', 'fl01-name', 'middle')}${T(x.sugar, y - 46, 'sugar', 'fl01-name', 'middle')}
    ${E.svg}
    ${T(x.h2o, y + 42, 'water', 'fl01-name', 'middle')}${T(x.o2, y + 42, 'oxygen', 'fl01-name', 'middle')}
    ${[x.co2, x.sugar].map(v => `<path class="fl01-brk" d="M${f(v)},${y + 24} V${bot}"/>`).join('')}
    ${bracket(x.co2, x.sugar, bot, false)}
    <path class="fl01-link" d="M${f(link)},${top} V${y - 36}"/>
    ${arr(p, 'k', `M${f(link)},${y + 16} V${bot - 4}`, 'fl01-link')}
    ${tag(link, y + 58, 'ATP', 'atp')}${tag(link, y + 100, 'NADPH', 'nadph')}
    ${lecture(sm, 496, 'SYNTHESIS', 2, 'middle')}
    ${T(sm, 532, 'carbon reactions: CO₂ → sugars', 'fl01-txt', 'middle')}
    ${T(sm, 568, 'the bread that feeds us', 'fl01-hook', 'middle')}
  `);
}

/* ---------- b · Word split: the word itself, cut in two ---------- */

function drawB(): string {
  const p = 'fl01b';
  const L = 178, R = 616;
  return svg(p, 'The word photosynthesis split in two. Photo, from Greek for light: light reactions, the colour of life, lecture 1, 45 minutes. Synthesis, putting together: carbon reactions, the bread that feeds us, lecture 2, 45 minutes. ATP and NADPH link them.', `
    ${word(L, 112, 'Photo')}
    ${word(R, 112, 'synthesis')}
    ${T(L, 150, 'Greek phōs, light', 'fl01-gloss', 'middle')}${T(R, 150, 'Greek synthesis, putting together', 'fl01-gloss', 'middle')}
    <path class="fl01-cutline" d="M400,40 V560"/>
    ${sun(84, 232, 30)}
    ${bolt(p, 116, 254, 168, 300)}
    ${leaf(232, 316, 170, 74, -18)}
    ${wheat(R - 58, 196, 186)}
    ${loaf(R + 82, 372, 150)}
    ${T(400, 238, 'linked by', 'fl01-name', 'middle')}
    ${tag(400, 274, 'ATP', 'atp')}${tag(400, 318, 'NADPH', 'nadph')}
    ${arr(p, 'k', 'M352,352 H452')}
    ${T(L, 446, 'light reactions', 'fl01-txt fl01-b', 'middle')}${T(L, 484, 'the colour of life', 'fl01-hook', 'middle')}
    ${T(R, 446, 'carbon reactions', 'fl01-txt fl01-b', 'middle')}${T(R, 484, 'the bread that feeds us', 'fl01-hook', 'middle')}
    <rect class="fl01-pill" x="${L - 102}" y="514" width="204" height="40" rx="20"/>${T(L, 541, 'lecture 1 · 45 min', 'fl01-name fl01-dark', 'middle')}
    <rect class="fl01-pill" x="${R - 102}" y="514" width="204" height="40" rx="20"/>${T(R, 541, 'lecture 2 · 45 min', 'fl01-name fl01-dark', 'middle')}
  `);
}

/* ---------- c · Hidden link: the equation pulled apart into its two halves ---------- */

function drawC(): string {
  const p = 'fl01c';
  const E = equation(400, 54, 30);
  const y1 = 214, y2 = 432, a0 = 300, a1 = 590, dn = 384, up = 500;
  return svg(p, 'The classic equation pulled apart into two halves. Photo: water and light give O₂ and make ATP and NADPH. Synthesis: CO₂ becomes sugar, spending ATP and NADPH, which return as ADP, Pi and NADP+. Made and spent, they cancel out of the net equation.', `
    ${E.svg}
    ${T(400, 98, 'pulled apart into its two halves', 'fl01-hook', 'middle')}
    ${T(16, y1 - 6, 'PHOTO', 'fl01-band')}${T(16, y1 + 22, 'lecture 1', 'fl01-name')}
    ${h2oG(212, y1 - 4)}${T(234, y1 + 9, 'H₂O', 'fl01-term fl01-w', 'start')}
    ${arr(p, 'k', `M${a0},${y1} H${a1}`, 'fl01-main')}
    ${bolt(p, 312, 128, 330, y1 - 8)}${T(350, 156, 'light', 'fl01-term fl01-l')}
    ${o2(624, y1)}${T(652, y1 + 9, 'O₂', 'fl01-term fl01-w')}
    ${T(16, y2 - 6, 'SYNTHESIS', 'fl01-band')}${T(16, y2 + 22, 'lecture 2', 'fl01-name')}
    ${co2(216, y2, 8)}${T(244, y2 + 9, 'CO₂', 'fl01-term fl01-c', 'start')}
    ${arr(p, 'k', `M${a0},${y2} H${a1}`, 'fl01-main')}
    ${ring(636, y2)}${T(668, y2 + 9, 'sugar', 'fl01-term fl01-c')}
    ${arr(p, 'k', `M${dn - 26},${y1} Q${dn},${y1} ${dn},${y1 + 32} V${y2 - 34} Q${dn},${y2} ${dn + 26},${y2}`, 'fl01-loop')}
    ${arr(p, 'k', `M${up - 26},${y2} Q${up},${y2} ${up},${y2 - 32} V${y1 + 34} Q${up},${y1} ${up + 26},${y1}`, 'fl01-loop')}
    ${tag(dn - 52, 300, 'ATP', 'atp')}${tag(dn - 66, 344, 'NADPH', 'nadph')}
    ${T(up + 14, 306, 'ADP + Pᵢ', 'fl01-name fl01-dark')}${T(up + 14, 340, 'NADP⁺', 'fl01-name fl01-dark')}
    ${T(400, 520, 'ATP and NADPH are made in one half and spent in the other,', 'fl01-txt', 'middle')}
    ${T(400, 552, 'so they cancel out of the net equation.', 'fl01-txt', 'middle')}
  `);
}

/* ---------- d · Leaf to loaf: one hero illustration from the Sun to bread ---------- */

function drawD(): string {
  const p = 'fl01d';
  return svg(p, 'From the Sun to bread. Sunlight reaches a leaf; water enters and O₂ leaves. Inside the leaf, light makes ATP and NADPH, which turn CO₂ from the air into sugar. Sugar goes to the wheat grain, and the grain becomes bread.', `
    ${sun(70, 96, 34)}
    ${bolt(p, 104, 126, 182, 204)}${bolt(p, 82, 140, 150, 236)}
    ${T(150, 96, 'light', 'fl01-term fl01-l')}
    ${leaf(334, 262, 380, 160, -4)}
    ${tag(268, 252, 'ATP', 'atp')}${tag(268, 294, 'NADPH', 'nadph')}
    ${arr(p, 'k', 'M318,272 H392')}
    ${ring(430, 270, 20)}
    ${h2oG(84, 368)}${h2oG(108, 392, 0.8)}${arr(p, 'w', 'M110,350 Q126,312 150,294')}
    ${T(30, 432, 'water', 'fl01-term fl01-w')}
    ${arr(p, 'w', 'M232,340 Q240,380 236,418')}${o2(238, 446)}${T(262, 455, 'O₂', 'fl01-term fl01-w')}
    ${co2(470, 76, 9)}${co2(536, 112, 9)}${co2(444, 132, 9)}
    ${arr(p, 'w', 'M470,152 Q456,178 446,206')}
    ${T(574, 82, 'CO₂ from the air', 'fl01-term fl01-c')}
    ${arr(p, 'c', 'M532,276 Q580,280 600,318')}${T(556, 248, 'sugar', 'fl01-term fl01-c')}
    ${wheat(612, 296, 196)}
    ${arr(p, 'c', 'M648,356 Q700,360 712,416')}
    ${loaf(716, 494, 132)}
    ${bracket(20, 330, 518, false)}${T(20, 548, 'PHOTO', 'fl01-band')}${T(20, 580, 'the colour of life', 'fl01-hook')}
    ${bracket(346, 790, 518, false)}${T(346, 548, 'SYNTHESIS', 'fl01-band')}${T(346, 580, 'the bread that feeds us', 'fl01-hook')}
  `);
}

/* ---------- e · Term map: the equation as molecules, and which lecture explains each term ---------- */

function drawE(): string {
  const p = 'fl01e';
  const X = { co2: 74, h2o: 206, light: 318, arrow: 438, sugar: 572, o2: 726 }, my = 112;
  const grid = (fn: (x: number, y: number) => string, cx: number, dx: number, dy: number): string =>
    [0, 1, 2].flatMap(r => [0, 1].map(c => fn(cx + (c - 0.5) * dx + (r === 1 ? dx * 0.18 : 0), my - dy + r * dy))).join('');
  const plus = (x: number): string => T(x, my + 10, '+', 'fl01-plus', 'middle');
  const cell = (x: number, y: number, a: string, b?: string): string =>
    `${T(x, y, a, 'fl01-cell-t', 'middle')}${b ? T(x, y + 26, b, 'fl01-cell-t', 'middle') : ''}`;
  const dot = (x: number, y: number): string => `<circle class="fl01-none" cx="${x}" cy="${y}" r="4"/>`;
  const R1 = 300, R2 = 470;
  return svg(p, 'The equation drawn as molecules: six CO₂, six water, light, one six-carbon sugar and six O₂. Below, a map of which lecture explains each term: lecture 1, Photo, explains light, water and O₂ and makes ATP and NADPH; lecture 2, Synthesis, explains CO₂ and sugar and spends ATP and NADPH.', `
    ${grid((x, y) => co2(x, y, 8), X.co2, 50, 30)}${plus(144)}
    ${grid((x, y) => h2o(x, y, 9), X.h2o, 44, 30)}${plus(264)}
    ${bolt(p, X.light - 14, my - 40, X.light + 10, my + 38)}
    ${arr(p, 'k', `M${X.arrow - 30},${my} H${X.arrow + 30}`, 'fl01-main')}
    ${T(X.sugar, 72, 'six carbons', 'fl01-name', 'middle')}${chain(X.sugar, my, 24, 10)}${plus(664)}
    ${grid((x, y) => o2(x, y, 8), X.o2, 44, 30)}
    ${T(X.co2, 192, '6 CO₂', 'fl01-term fl01-c', 'middle')}${T(X.h2o, 192, '6 H₂O', 'fl01-term fl01-w', 'middle')}
    ${T(X.light, 192, 'light', 'fl01-term fl01-l', 'middle')}${T(X.sugar, 192, 'C₆H₁₂O₆', 'fl01-term fl01-c', 'middle')}
    ${T(X.o2, 192, '6 O₂', 'fl01-term fl01-w', 'middle')}
    <rect class="fl01-row fl01-row-1" x="8" y="${R1 - 76}" width="784" height="156" rx="14"/>
    <rect class="fl01-row fl01-row-2" x="8" y="${R2 - 76}" width="784" height="132" rx="14"/>
    ${lecture(24, R1 - 42, 'PHOTO', 1)}${T(776, R1 - 42, 'the colour of life', 'fl01-hook', 'end')}
    ${lecture(24, R2 - 42, 'SYNTHESIS', 2)}${T(776, R2 - 42, 'the bread that feeds us', 'fl01-hook', 'end')}
    ${dot(X.co2, R1 + 14)}${dot(X.sugar, R1 + 14)}
    ${cell(X.h2o, R1 + 10, 'gives', 'electrons')}${cell(X.light, R1 + 10, 'caught by', 'pigments')}${cell(X.o2, R1 + 10, 'released', 'from water')}
    ${tag(X.arrow, R1 + 2, 'ATP', 'atp')}${tag(X.arrow, R1 + 42, 'NADPH', 'nadph')}
    ${arr(p, 'k', `M${X.arrow},${R1 + 60} V${R2 + 2}`)}
    ${T(X.arrow, R2 + 32, 'spent', 'fl01-cell-t', 'middle')}
    ${dot(X.h2o, R2 + 14)}${dot(X.light, R2 + 14)}${dot(X.o2, R2 + 14)}
    ${cell(X.co2, R2 + 22, 'fixed')}${cell(X.sugar, R2 + 10, 'built, then', 'exported')}
    ${T(400, 586, 'ATP and NADPH: made in lecture 1, spent in lecture 2', 'fl01-name', 'middle')}
  `);
}

/* ---------- f · Six steps: from the Sun to bread, Photo then Synthesis ---------- */

function drawF(): string {
  const p = 'fl01f';
  const X = [8, 280, 552], Y = [70, 360], W = 240, H = 186;
  // Snake order: 1-2-3 left to right, then down, then 4-5-6 right to left, so 3 hands over to 4.
  const at: Record<number, [number, number]> = { 1: [X[0], Y[0]], 2: [X[1], Y[0]], 3: [X[2], Y[0]], 4: [X[2], Y[1]], 5: [X[1], Y[1]], 6: [X[0], Y[1]] };
  const panel = (n: number): string => stepCard(p, n, at[n][0], at[n][1], W, H);
  return svg(p, 'Six numbered steps from the Sun to bread. Photo, lecture 1: absorb light in pigments, use water (it gives electrons, O₂ is released), store energy in ATP and NADPH. Synthesis, lecture 2: fix CO₂ from the air, make sugar with ATP and NADPH, feed us as grain and bread.', `<g transform="translate(0 12)">
    ${lecture(8, 48, 'PHOTO', 1)}${T(640, 48, 'the colour of life', 'fl01-hook', 'end')}
    ${lecture(8, 338, 'SYNTHESIS', 2)}${T(640, 338, 'the bread that feeds us', 'fl01-hook', 'end')}
    ${[1, 2, 3, 4, 5, 6].map(panel).join('')}
    ${arr(p, 'k', `M${X[0] + W + 4},${Y[0] + 62} H${X[1] - 6}`)}${arr(p, 'k', `M${X[1] + W + 4},${Y[0] + 62} H${X[2] - 6}`)}
    ${arr(p, 'k', `M${X[2] - 4},${Y[1] + 62} H${X[1] + W + 6}`)}${arr(p, 'k', `M${X[1] - 4},${Y[1] + 62} H${X[0] + W + 6}`)}
    ${arr(p, 'k', `M${X[2] + W / 2},${Y[0] + H + 4} V${Y[1] - 6}`, 'fl01-handover')}
  </g>`);
}

/* ---------- g · Chloroplast: where each half happens ---------- */

function drawG(): string {
  const p = 'fl01g';
  const E = equation(400, 586, 26);
  const stack = (cx: number, cy: number): string =>
    [0, 1, 2, 3, 4].map(i => `<rect class="fl01-thy" x="${cx - 50}" y="${cy - 44 + i * 18}" width="100" height="16" rx="8"/>`).join('');
  const cyc = (cx: number, cy: number, r: number): string => [0, 1, 2].map(i => {
    const a0 = -Math.PI / 2 + i * (2 * Math.PI / 3) + 0.12, a1 = a0 + 2 * Math.PI / 3 - 0.36;
    return arr(p, 'c', `M${f(cx + r * Math.cos(a0))},${f(cy + r * Math.sin(a0))} A${r},${r} 0 0 1 ${f(cx + r * Math.cos(a1))},${f(cy + r * Math.sin(a1))}`, 'fl01-cyc');
  }).join('');
  return svg(p, 'A chloroplast. In the thylakoids, the light reactions (Photo, lecture 1) use light and water, release O₂ and make ATP and NADPH. In the stroma, the carbon reactions (Synthesis, lecture 2) use ATP and NADPH to turn CO₂ into sugar; ADP, Pi and NADP+ return. The classic equation runs along the bottom.', `
    <ellipse class="fl01-env" cx="400" cy="290" rx="380" ry="196"/><ellipse class="fl01-env-in" cx="400" cy="290" rx="368" ry="184"/>
    ${stack(178, 300)}${stack(286, 326)}
    ${T(250, 204, 'thylakoids · lecture 1', 'fl01-name fl01-dark', 'middle')}
    ${T(250, 176, 'PHOTO', 'fl01-band', 'middle')}
    ${cyc(600, 300, 62)}
    ${T(600, 294, 'CO₂', 'fl01-name fl01-dark', 'middle')}${T(600, 320, '→ sugar', 'fl01-name fl01-dark', 'middle')}
    ${T(580, 204, 'stroma · lecture 2', 'fl01-name fl01-dark', 'middle')}
    ${T(580, 176, 'SYNTHESIS', 'fl01-band', 'middle')}
    ${arr(p, 'k', 'M344,252 C390,216 470,214 520,240')}
    ${tag(426, 192, 'ATP', 'atp')}${tag(432, 232, 'NADPH', 'nadph')}
    ${arr(p, 'k', 'M524,350 C470,380 400,380 350,360')}
    ${T(436, 404, 'ADP + Pᵢ, NADP⁺', 'fl01-name fl01-dark', 'middle')}
    ${bolt(p, 50, 62, 122, 270)}${T(72, 50, 'light', 'fl01-term fl01-l', 'start')}
    ${h2oG(84, 520)}${T(106, 530, 'H₂O', 'fl01-term fl01-w')}${arr(p, 'w', 'M100,494 Q126,430 150,380')}
    ${arr(p, 'w', 'M262,392 Q262,450 262,500')}${o2(262, 524)}${T(290, 533, 'O₂', 'fl01-term fl01-w')}
    ${co2(742, 100, 9)}${T(712, 109, 'CO₂', 'fl01-term fl01-c', 'end')}${arr(p, 'w', 'M738,122 Q716,214 668,266')}
    ${arr(p, 'c', 'M628,372 Q648,440 664,488')}${ring(664, 518, 20)}${T(694, 527, 'sugar', 'fl01-term fl01-c')}
    ${E.svg}
  `);
}

/* ---------- h · Battery analogy: a solar charger and a workshop, mapped to the real parts ---------- */

function drawH(): string {
  const p = 'fl01h';
  return svg(p, 'An analogy. A solar charger (the light reactions) charges batteries (ATP and NADPH) using light and water and releases O₂. A workshop (the carbon reactions) uses the charged batteries to turn CO₂ into sugar. Empty batteries (ADP, Pi, NADP+) go back to be recharged.', `<g transform="translate(0 26)">
    ${station(20, 170, 224, 210, 1)}${station(556, 170, 224, 210, 2)}
    ${sun(62, 104, 20)}${bolt(p, 74, 128, 92, 184)}${T(62, 50, 'light', 'fl01-term fl01-l', 'middle')}
    ${h2oG(150, 108)}${arr(p, 'w', 'M150,128 V178')}${T(150, 74, 'H₂O', 'fl01-term fl01-w', 'middle')}
    ${arr(p, 'w', 'M222,176 V124')}${o2(222, 104, 9)}${T(222, 74, 'O₂', 'fl01-term fl01-w', 'middle')}
    ${leaf(132, 286, 150, 66, -16)}
    ${co2(612, 104, 9)}${arr(p, 'w', 'M612,124 V178')}${T(612, 74, 'CO₂', 'fl01-term fl01-c', 'middle')}
    ${arr(p, 'c', 'M716,176 V130')}${ring(716, 106, 18)}${T(716, 74, 'sugar', 'fl01-term fl01-c', 'middle')}
    ${cycle(p, 668, 276)}
    ${arr(p, 'k', 'M252,232 H548')}${batteries(400, 210, true)}
    ${named(400, 170, 'charged:', FULL)}
    ${arr(p, 'k', 'M548,322 H252')}${batteries(400, 344, false)}
    ${named(400, 392, 'empty:', EMPTY)}
    ${T(132, 426, 'solar charger', 'fl01-txt fl01-b', 'middle')}${T(132, 458, '= light reactions', 'fl01-txt', 'middle')}
    <text class="fl01-band" x="132" y="500" text-anchor="middle">PHOTO<tspan class="fl01-band-s"> · lecture 1</tspan></text>
    ${T(668, 426, 'workshop', 'fl01-txt fl01-b', 'middle')}${T(668, 458, '= carbon reactions', 'fl01-txt', 'middle')}
    <text class="fl01-band" x="668" y="500" text-anchor="middle">SYNTHESIS<tspan class="fl01-band-s"> · lecture 2</tspan></text>
    ${T(400, 470, 'The same batteries', 'fl01-hook', 'middle')}${T(400, 500, 'go round and round', 'fl01-hook', 'middle')}
  </g>`);
}

/* ---------- i · Electrons uphill: light lifts electrons from water; they end up on CO₂ ---------- */

function drawI(): string {
  const p = 'fl01i';
  const low = 440, high = 140, sug = 214;
  return svg(p, 'Schematic electron energy. Water at the bottom gives up electrons and O₂ is released. Light lifts the electrons high, where they are held by NADPH, with ATP made alongside. In the carbon reactions they are passed onto CO₂, giving sugar.', `
    ${arr(p, 'k', 'M34,520 V60', 'fl01-axis')}
    <text class="fl01-name" transform="translate(22 300) rotate(-90)" text-anchor="middle">electron energy (schematic)</text>
    <path class="fl01-level" d="M60,${low} H330"/><path class="fl01-level" d="M150,${high} H560"/><path class="fl01-level" d="M480,${sug} H596"/>
    ${[0, 1].map(i => `<g transform="translate(${92 + i * 42} ${low - 22})">${h2o(0, 0, 11)}</g>`).join('')}
    ${T(84, low + 42, 'H₂O', 'fl01-term fl01-w')}
    ${arr(p, 'w', `M150,${low + 16} Q170,${low + 56} 210,${low + 64}`)}${o2(236, low + 64, 9)}${T(258, low + 73, 'O₂', 'fl01-term fl01-w')}
    <path class="fl01-e" d="M156,${low - 20} C200,${low - 28} 212,${low - 60} 212,${low - 100} V${high + 40}" marker-end="url(#${p}-red)"/>
    ${T(226, low - 64, 'e⁻', 'fl01-e-t')}
    ${bolt(p, 336, 254, 206, 302)}${T(346, 262, 'light', 'fl01-term fl01-l')}${T(346, 292, 'lifts the electrons', 'fl01-name fl01-dark')}
    ${tag(232, high - 30, 'NADPH', 'nadph')}${tag(320, high - 30, 'ATP', 'atp')}
    <path class="fl01-e" d="M290,${high + 10} C400,${high + 14} 470,${high + 30} 540,${sug - 20}" marker-end="url(#${p}-red)"/>
    ${co2(560, 86, 9)}${T(588, 94, 'CO₂', 'fl01-term fl01-c')}${arr(p, 'w', `M560,104 Q562,${sug - 50} 576,${sug - 22}`)}
    ${ring(620, sug, 22)}${T(652, sug + 9, 'sugar', 'fl01-term fl01-c')}
    ${T(560, sug + 56, 'electrons + CO₂', 'fl01-name fl01-dark', 'middle')}
    ${bracket(60, 400, 540, false)}<text class="fl01-band" x="60" y="574">PHOTO<tspan class="fl01-band-s"> · lifts them</tspan></text>
    ${bracket(420, 790, 540, false)}<text class="fl01-band" x="420" y="574">SYNTHESIS<tspan class="fl01-band-s"> · passes them on</tspan></text>
  `);
}

/* ---------- j · Five questions: the equation as the route through both lectures ---------- */

function drawJ(): string {
  const p = 'fl01j';
  const E = equation(400, 98, 34), x = E.x;
  const order: Array<[string, number]> = [['light', 1], ['h2o', 2], ['o2', 3], ['arrow', 4], ['co2', 5], ['sugar', 6]];
  const badge = (cx: number, cy: number, n: number): string =>
    `<circle class="fl01-num" cx="${f(cx)}" cy="${cy}" r="14"/>${T(cx, cy + 6, `${n}`, 'fl01-num-t', 'middle')}`;
  const rows: Array<[number, string, K, string]> = [
    [1, 'light', 'l', 'Which light do leaves catch, and how?'],
    [2, 'H₂O', 'w', 'Why take electrons from water?'],
    [3, 'O₂', 'w', 'Where does the O₂ come from?'],
    [4, '', 'o', 'How is light stored as chemical energy?'],
    [5, 'CO₂', 'c', 'How is CO₂ fixed into sugar?'],
    [6, 'C₆H₁₂O₆', 'c', 'How does sugar become our bread?'],
  ];
  const ry = (n: number): number => (n <= 4 ? 238 + (n - 1) * 50 : 500 + (n - 5) * 50);
  const term = (n: number, s: string, k: K): string => n === 4
    ? `${tag(96, ry(n) - 8, 'ATP', 'atp')}${tag(190, ry(n) - 8, 'NADPH', 'nadph')}`
    : T(64, ry(n), s, `fl01-term fl01-${k}`);
  return svg(p, 'The classic equation with each term numbered as a question: 1 light, 2 water, 3 O₂, 4 the ATP and NADPH hidden in the arrow, all in lecture 1, Photo; 5 CO₂ and 6 sugar in lecture 2, Synthesis.', `
    ${E.svg}
    ${order.map(([id, n]) => badge(x[id], 44, n)).join('')}
    ${lecture(16, 178, 'PHOTO', 1)}${T(784, 178, 'the colour of life', 'fl01-hook', 'end')}
    ${lecture(16, 440, 'SYNTHESIS', 2)}${T(784, 440, 'the bread that feeds us', 'fl01-hook', 'end')}
    <path class="rule" d="M16,194 H784"/><path class="rule" d="M16,456 H784"/>
    ${rows.map(([n, s, k, q]) => `${badge(32, ry(n) - 8, n)}${term(n, s, k)}${T(262, ry(n), q, 'fl01-q')}`).join('')}
  `);
}

/* ---------- k · Words over loop: B's split word as the heading, H's charger and workshop below, the equation as footer ---------- */

function drawK(): string {
  const p = 'fl01k';
  const L = 160, R = 628, top = 264, H = 162, mid = 394, io = 182;
  const E = equation(mid, 566, 32);
  return svg(p, 'The word photosynthesis split in two: Photo, from Greek phōs, light, over a solar charger (the light reactions) that uses light and water, releases O₂ and charges batteries, ATP and NADPH; synthesis, Greek for putting together, over a workshop (the carbon reactions) that spends them to turn CO₂ into sugar. Empty batteries, ADP, Pi and NADP+, go back. Below, the equation 6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂.', `
    ${word(L, 76, 'Photo')}${word(R, 76, 'synthesis')}
    ${T(L, 114, 'Greek phōs, light', 'fl01-gloss', 'middle')}${T(R, 114, 'Greek synthesis, putting together', 'fl01-gloss', 'middle')}
    <path class="fl01-cutline" d="M${mid},28 V122"/>
    ${station(L - 104, top, 208, H, 1)}${station(R - 104, top, 208, H, 2)}
    ${T(L - 70, io - 18, 'light', 'fl01-term fl01-l', 'middle')}${sun(L - 70, io + 24, 16)}${bolt(p, L - 58, io + 46, L - 44, top + 12)}
    ${T(L + 6, io, 'H₂O', 'fl01-term fl01-w', 'middle')}${h2oG(L + 6, io + 32)}${arr(p, 'w', `M${L + 6},${io + 52} V${top + 8}`)}
    ${T(L + 70, io, 'O₂', 'fl01-term fl01-w', 'middle')}${arr(p, 'w', `M${L + 70},${top + 6} V${io + 50}`)}${o2(L + 70, io + 30, 9)}
    ${leaf(L, top + 82, 150, 66, -16)}
    ${T(R - 48, io, 'CO₂', 'fl01-term fl01-c', 'middle')}${co2(R - 48, io + 30, 9)}${arr(p, 'w', `M${R - 48},${io + 50} V${top + 8}`)}
    ${T(R + 48, io, 'sugar', 'fl01-term fl01-c', 'middle')}${arr(p, 'c', `M${R + 48},${top + 6} V${io + 54}`)}${ring(R + 48, io + 32, 18)}
    ${cycle(p, R, top + 82)}
    ${T(mid, top + 20, 'charged: ATP + NADPH', 'fl01-name fl01-dark', 'middle')}
    ${batteries(mid, top + 52, true, 62)}${arr(p, 'k', `M${L + 112},${top + 74} H${R - 112}`)}
    ${arr(p, 'k', `M${R - 112},${top + 110} H${L + 112}`)}${batteries(mid, top + 132, false, 62)}
    ${T(mid, top + 180, 'empty: ADP + Pᵢ, NADP⁺', 'fl01-name fl01-dark', 'middle')}
    ${T(L, top + H + 34, 'solar charger', 'fl01-txt fl01-b', 'middle')}${T(L, top + H + 64, '= light reactions', 'fl01-txt', 'middle')}
    ${T(R, top + H + 34, 'workshop', 'fl01-txt fl01-b', 'middle')}${T(R, top + H + 64, '= carbon reactions', 'fl01-txt', 'middle')}
    <path class="rule" d="M40,${top + H + 92} H760"/>
    ${E.svg}
  `);
}

/* ---------- l · Equation hub: the equation between charger (up) and workshop (down); the batteries circle round it ---------- */

function drawL(): string {
  const p = 'fl01l';
  const ey = 312, E = equation(400, ey, 28), x = E.x;
  const b1 = 172, t2 = 432, x0 = 120, x1 = 680;
  return svg(p, 'The equation 6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂ between a solar charger above (the light reactions, Photo) and a workshop below (the carbon reactions, Synthesis). Light and water go up into the charger and O₂ comes out of it; CO₂ goes down into the workshop and sugar comes out. Charged batteries, ATP and NADPH, go down the right side to the workshop; empty ones, ADP + Pi and NADP+, come back up the left.', `
    ${station(x0, 16, x1 - x0, b1 - 16, 1)}${station(x0, t2, x1 - x0, 584 - t2, 2)}
    ${leaf(218, 94, 140, 62, -16)}
    ${T(316, 70, 'solar charger', 'fl01-txt fl01-b')}${T(316, 100, '= light reactions', 'fl01-txt')}
    <text class="fl01-band" x="316" y="146">PHOTO<tspan class="fl01-band-s"> · lecture 1</tspan></text>
    ${cycle(p, 300, 508, 44)}
    ${T(400, 486, 'workshop', 'fl01-txt fl01-b')}${T(400, 516, '= carbon reactions', 'fl01-txt')}
    <text class="fl01-band" x="400" y="562">SYNTHESIS<tspan class="fl01-band-s"> · lecture 2</tspan></text>
    ${E.svg}
    ${h2oG(x.h2o, 254)}${arr(p, 'w', `M${f(x.h2o)},232 V${b1 - 4}`)}
    ${T(x.h2o - 22, 262, 'gives e⁻', 'fl01-name fl01-dark', 'end')}
    ${sun(x.light, 236, 11)}${bolt(p, x.light, 204, x.light, b1 - 10)}
    ${arr(p, 'w', `M${f(x.o2)},${b1 - 2} V234`)}${o2(x.o2, 256, 9)}
    ${T(x.o2 - 24, 262, 'from water', 'fl01-name fl01-dark', 'end')}
    ${co2(x.co2, 354, 9)}${arr(p, 'w', `M${f(x.co2)},374 V${t2 + 6}`)}
    ${T(x.co2 + 28, 404, 'gives the carbon', 'fl01-name fl01-dark')}
    ${arr(p, 'c', `M${f(x.sugar)},${t2 + 4} V386`)}${ring(x.sugar, 362, 17)}
    ${arr(p, 'k', `M${x1},94 H${x1 + 14} V508 H${x1 + 5}`)}
    ${T(750, 214, 'charged', 'fl01-name fl01-dark', 'middle')}
    ${battery(750, 250, true)}${T(750, 290, 'ATP', 'fl01-name fl01-dark', 'middle')}
    ${battery(750, 332, true)}${T(750, 372, 'NADPH', 'fl01-name fl01-dark', 'middle')}
    ${arr(p, 'k', `M${x0},508 H${x0 - 14} V94 H${x0 - 5}`)}
    ${T(50, 214, 'empty', 'fl01-name fl01-dark', 'middle')}
    ${battery(50, 250, false)}${T(50, 290, 'ADP + Pᵢ', 'fl01-name fl01-dark', 'middle')}
    ${battery(50, 332, false)}${T(50, 372, 'NADP⁺', 'fl01-name fl01-dark', 'middle')}
  `);
}

/* ---------- m · Steps in stations: F's six steps in H's charger (1–3) and workshop (4–6); batteries cross between 3 and 4 ---------- */

function drawM(): string {
  const p = 'fl01m';
  const W = 236, H = 176, X = [14, 282, 550], Y = [46, 310], dy: [number, number, number, number] = [58, 120, 145, 168];
  const at: Record<number, [number, number]> = { 1: [X[0], Y[0]], 2: [X[1], Y[0]], 3: [X[2], Y[0]], 4: [X[2], Y[1]], 5: [X[1], Y[1]], 6: [X[0], Y[1]] };
  const E = equation(400, 572, 30);
  const g0 = Y[0] + H + 8, g1 = Y[1] - 8, gm = (g0 + g1) / 2, xc = 756, xe = 44;
  return svg(p, 'Six numbered steps inside the two stations of the battery analogy. The solar charger (Photo, light reactions): 1 absorb light, 2 use water (it gives electrons, O₂ is released), 3 store energy in ATP and NADPH. Charged batteries, ATP and NADPH, go down to the workshop (Synthesis, carbon reactions): 4 fix CO₂, 5 make sugar with ATP and NADPH, 6 feed us. Empty batteries, ADP + Pi and NADP+, go back up. Below, the equation 6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂.', `
    <text class="fl01-band" x="8" y="28">PHOTO<tspan class="fl01-band-s"> · solar charger = light reactions</tspan></text>
    ${station(4, Y[0] - 8, 792, H + 16, 1)}${station(4, Y[1] - 8, 792, H + 16, 2)}
    ${[1, 2, 3, 4, 5, 6].map(n => stepCard(p, n, at[n][0], at[n][1], W, H, dy)).join('')}
    ${arr(p, 'k', `M${X[0] + W + 4},${Y[0] + 58} H${X[1] - 6}`)}${arr(p, 'k', `M${X[1] + W + 4},${Y[0] + 58} H${X[2] - 6}`)}
    ${arr(p, 'k', `M${X[2] - 4},${Y[1] + 58} H${X[1] + W + 6}`)}${arr(p, 'k', `M${X[1] - 4},${Y[1] + 58} H${X[0] + W + 6}`)}
    ${arr(p, 'k', `M${xc},${g0 + 2} V${g1 - 4}`, 'fl01-handover')}${battery(xc, gm, true)}
    ${T(xc - 40, gm + 8, 'charged: ATP + NADPH', 'fl01-name fl01-dark', 'end')}
    ${arr(p, 'k', `M${xe},${g1 - 2} V${g0 + 4}`)}${battery(xe, gm, false)}
    ${T(xe + 40, gm + 8, 'empty: ADP + Pᵢ, NADP⁺', 'fl01-name fl01-dark')}
    <text class="fl01-band" x="8" y="${Y[1] + H + 38}">SYNTHESIS<tspan class="fl01-band-s"> · workshop = carbon reactions</tspan></text>
    ${E.svg}
  `);
}

/* ---------- n · Word columns: B's two words, each heading its three numbered steps; ATP and NADPH link them; the equation below ---------- */

function drawN(): string {
  const p = 'fl01n';
  const L = 174, R = 626, xl = 14, xr = 416, y0 = 334, dy = 74;
  const E = equation(400, 560, 32);
  const steps = (x: number, ns: number[]): string => ns.map((n, i) => {
    const y = y0 + i * dy, [a, b, c] = STEP[n];
    return `${num(x + 14, y - 8, n)}${T(x + 38, y, a, 'fl01-txt fl01-b')}${T(x + 38, y + 26, c ? `${b} ${c}` : b, 'fl01-name fl01-dark')}`;
  }).join('');
  return svg(p, 'The word photosynthesis split in two, each half with its three steps. Photo, Greek phōs, light: 1 absorb light in pigments, 2 use water (it gives electrons, O₂ is released), 3 store energy in ATP and NADPH. Synthesis, putting together: 4 fix CO₂ from the air, 5 make sugar with ATP and NADPH, 6 feed us as grain and bread. ATP and NADPH link the halves. Below, the equation 6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂.', `
    ${word(L, 84, 'Photo')}${word(R, 84, 'synthesis')}
    ${T(L, 122, 'Greek phōs, light', 'fl01-gloss', 'middle')}${T(R, 122, 'Greek synthesis, putting together', 'fl01-gloss', 'middle')}
    <path class="fl01-cutline" d="M400,36 V150"/><path class="fl01-cutline" d="M400,304 V506"/>
    ${sun(64, 200, 20)}${bolt(p, 90, 216, 132, 240)}${leaf(228, 226, 140, 60, -16)}
    ${wheat(R - 82, 162, 112)}${loaf(R + 46, 272, 116)}
    ${T(400, 180, 'linked by', 'fl01-name', 'middle')}
    ${tag(400, 214, 'ATP', 'atp')}${tag(400, 256, 'NADPH', 'nadph')}
    ${arr(p, 'k', 'M352,290 H448')}
    ${steps(xl, [1, 2, 3])}${steps(xr, [4, 5, 6])}
    ${E.svg}
  `);
}

/* ---------- o, p, r · Full picture: B's split word over its illustrated halves, H's batteries crossing the cut ----------
 * The equation is not drawn: the page text gives it (point 3). O names F's six steps, spaced so each label has
 * room; P names only the molecules; R is O on a page without a title, drawn larger in the freed height. */

const place = (from: [number, number], to: [number, number], k: number, body: string): string =>
  `<g transform="translate(${f(to[0])} ${f(to[1])}) scale(${k}) translate(${f(-from[0])} ${f(-from[1])})">${body}</g>`;

function fullBody(p: string, steps: boolean): string {
  const call = (x: number, y: number, n: number, s: string): string => `${num(x, y - 8, n)}${T(x + 22, y, s, 'fl01-name fl01-dark')}`;
  const L = 200, R = 600;
  return `
    ${word(L, 80, 'Photo')}${word(R, 80, 'synthesis')}
    ${T(L, 118, 'Greek phōs, light', 'fl01-gloss', 'middle')}${T(R, 118, 'Greek synthesis, putting together', 'fl01-gloss', 'middle')}
    <path class="fl01-cutline" d="M400,30 V146"/><path class="fl01-cutline" d="M400,470 V580"/>
    ${sun(90, 214, 20)}${bolt(p, 104, 240, 140, 292)}
    ${leaf(210, 350, 160, 70, -18)}
    ${h2oG(124, 488)}${T(124, 532, 'H₂O', 'fl01-term fl01-w', 'middle')}${arr(p, 'w', 'M126,466 Q128,432 140,404')}
    ${arr(p, 'w', 'M238,392 Q232,420 222,444')}${o2(218, 464, 9)}${T(242, 473, 'O₂', 'fl01-term fl01-w')}
    ${tags(400, 282, FULL)}
    ${batteries(400, 318, true, 58)}${arr(p, 'k', 'M302,340 H498')}
    ${arr(p, 'k', 'M498,378 H302')}${batteries(400, 400, false, 58)}
    ${tags(400, 442, EMPTY)}
    ${co2(540, 214, 9)}${arr(p, 'w', 'M540,232 V272')}
    ${cycle(p, 540, 322, 42)}
    ${arr(p, 'c', 'M588,322 H626')}${ring(652, 322, 19)}
    ${arr(p, 'c', 'M652,344 V384')}
    ${wheat(622, 396, 104)}${loaf(712, 500, 92)}
    ${steps ? `
    ${call(140, 214, 1, 'Absorb light')}${call(62, 568, 2, 'Oxidise water')}${call(330, 252, 3, 'Store energy')}
    ${call(582, 214, 4, 'Fix CO₂')}${call(624, 278, 5, 'Make sugar')}${call(612, 568, 6, 'Grain, bread')}` : `
    ${T(566, 222, 'CO₂', 'fl01-term fl01-c')}${T(652, 288, 'sugar', 'fl01-term fl01-c', 'middle')}`}`;
}

const O_LABEL = 'The word photosynthesis split in two. Photo, Greek phōs, light: 1 the leaf absorbs light; 2 water is oxidised and O₂ is released; 3 the energy is stored in charged batteries, ATP and NADPH, which cross the cut to synthesis, Greek for putting together: 4 CO₂ is fixed in the turning cycle; 5 sugar is made; the empty batteries, ADP + Pi and NADP+, go back; 6 sugar becomes grain and bread.';

function drawO(): string {
  return svg('fl01o', O_LABEL, fullBody('fl01o', true));
}

function drawR(): string {
  return svg('fl01r', O_LABEL, place([400, 300], [400, 362], 1.08, fullBody('fl01r', true)), 700);
}

function drawP(): string {
  return svg('fl01p', 'The word photosynthesis split in two. Photo, Greek phōs, light: sunlight falls on a leaf; water goes in and O₂ comes out. Charged batteries, ATP and NADPH, cross the cut to synthesis, Greek for putting together: CO₂ enters the turning cycle, which makes sugar, and sugar becomes grain and bread. Empty batteries, ADP + Pi and NADP+, go back.', fullBody('fl01p', false));
}

export function draw(id: string): string {
  const d: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH, i: drawI, j: drawJ, k: drawK, l: drawL, m: drawM, n: drawN, o: drawO, p: drawP, r: drawR };
  return (d[id] ?? drawA)();
}
