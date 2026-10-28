// Slide L07 · From excitation to charge separation. Draft context; facts checked in
// research/review-2026-10-23-claude/B_L07-L11.md (L07) and REVIEW_SUMMARY.md (essential 2: where it happens).
// Marks follow FIGURE_BRIEF.md: amber bolt = light, amber glow = excitation (never an electron), red dashed
// arrow = e⁻, dark-green disc = Chl a, white disc = electron acceptor, + / − badges = oxidised donor /
// reduced acceptor, clay ring with + and − = a reaction centre that has just separated charge.
import type { PlateText, Variant } from '../types';
import { arrow, text } from '../mechanisms';
import { bilayer, bolt, epath, illusHeads, water } from '../illus';
import './l07.css';

export const PLATE: PlateText = {
  n: '8',
  title: 'From excitation to charge separation',
  status: 'draft',
  lead: 'In a reaction centre, an excited chlorophyll pair hands an electron to an acceptor: light energy becomes separated charge.',
  points: [
    { claim: 'Charge separation in picoseconds.', text: 'The excited pair hands an electron to the first acceptor within a few ps' },
    { claim: 'Stabilised step by step.', text: 'The electron moves along a chain of acceptors, away from the + side (PSII: to quinones; PSI: to iron–sulphur clusters), so it rarely falls back' },
    { claim: 'P680 and P700 are Chl <i>a</i> pairs.', text: 'Each is named after the wavelength (nm) where its absorption bleaches.' },
  ],
  refs: [
    { label: 'Johnson 2025', url: 'https://doi.org/10.1038/s41580-025-00847-y' },
    { label: 'Croce & van Amerongen 2020', url: 'https://doi.org/10.1126/science.aay2058' },
    { label: 'Wietrzynski et al. 2025', url: 'https://doi.org/10.7554/eLife.105496' },
    { label: 'Kok 1956', url: 'https://doi.org/10.1016/0006-3002(56)90172-x' },
    { label: 'Wientjes et al. 2013', url: 'https://doi.org/10.1021/jp401663w' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Zoom in', anim: true },
  { id: 'b', name: 'Donor to acceptor' },
  { id: 'd', name: 'Same pigment' },
  { id: 'e', name: 'Four steps', anim: true },
  { id: 'f', name: 'Both at once' },
  { id: 'g', name: 'Membrane map' },
  { id: 'h', name: 'Bleaching dips' },
  { id: 'i', name: 'Charge equation' },
  { id: 'j', name: 'Three icons' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return donorSvg();
    case 'c': return solarSvg();
    case 'd': return samePigmentSvg();
    case 'e': return stepsSvg();
    case 'f': return bothSvg();
    case 'g': return mapSvg();
    case 'h': return dipsSvg();
    case 'i': return equationSvg();
    case 'j': return iconsSvg();
    default: return zoomSvg();
  }
}

/* ---------- shared marks ---------- */

type Pt = [number, number];
const f = (v: number): string => v.toFixed(1);

const svg = (label: string, body: string): string =>
  `<svg class="fig-svg fl07" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/** Arrowheads (shared inks, amber bolt), the amber hop head and the excitation glow. */
const defs = (p: string): string => `${illusHeads(p)}<defs>
  <marker id="${p}-amb" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path class="fl07-hd" d="M0,0L10,5L0,10z"/></marker>
  <marker id="${p}-sb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path class="hd-bolt" d="M0,0L10,5L0,10z"/></marker>
  <radialGradient id="${p}-glow"><stop offset="0" class="fl07-g0"/><stop offset=".45" class="fl07-g1"/><stop offset="1" class="fl07-g2"/></radialGradient></defs>`;

/** The excitation: an amber glow with a bright core. */
const glow = (p: string, x: number, y: number, s = 1): string =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${f(22 * s)}" fill="url(#${p}-glow)"/><circle class="fl07-gc" cx="${f(x)}" cy="${f(y)}" r="${f(6 * s)}"/>`;

/** One energy hop: a dotted amber arc bowed by k × its length to the left of travel. */
function hop(p: string, a: Pt, b: Pt, k = 0.25): string {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const c: Pt = [(a[0] + b[0]) / 2 + dy * k, (a[1] + b[1]) / 2 - dx * k];
  return `<path class="fl07-hop" d="M${f(a[0])},${f(a[1])}Q${f(c[0])},${f(c[1])} ${f(b[0])},${f(b[1])}" marker-end="url(#${p}-amb)"/>`;
}

const chl = (x: number, y: number, r = 12): string => `<circle class="fl07-chl" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;
/** The reaction-centre donor: a pair of Chl a. */
const pair = (x: number, y: number, r = 12): string => chl(x - r * 0.85, y, r) + chl(x + r * 0.85, y, r);
const acc = (x: number, y: number, r = 11): string => `<circle class="fl07-acc" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;

/** A charge badge: + (oxidised) in a red ring, − (reduced) in a blue ring; the sign, not the colour, carries it. */
function q(x: number, y: number, s: '+' | '−', r = 12): string {
  const k = s === '+' ? 'p' : 'm';
  return `<circle class="fl07-q${k}" cx="${f(x)}" cy="${f(y)}" r="${r}"/><text class="fl07-qt fl07-qt-${k}" x="${f(x)}" y="${f(y + r * 0.52)}" text-anchor="middle" style="font-size:${Math.round(r * 1.6)}px">${s}</text>`;
}

/** The deck's reaction-centre mark: a clay ring holding + and −. */
function rcRing(x: number, y: number, r = 15): string {
  const fs = Math.max(15, Math.round(r * 1.25));
  return `<circle class="fl07-rc" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`
    + `<text class="fl07-rct" x="${f(x - r * 0.4)}" y="${f(y + r * 0.4)}" text-anchor="middle" style="font-size:${fs}px">+</text>`
    + `<text class="fl07-rct" x="${f(x + r * 0.42)}" y="${f(y + r * 0.36)}" text-anchor="middle" style="font-size:${fs}px">−</text>`;
}

const eLab = (x: number, y: number, anchor: 'start' | 'middle' | 'end' = 'middle'): string => text(x, y, 'e⁻', 'sm fl07-e', anchor);

/** A short lightning icon whose tip lands on (x, y), arriving from the direction `from` (degrees, −90 = from above). */
function spark(p: string, x: number, y: number, len = 48, from = -90): string {
  const a = (from * Math.PI) / 180, sx = x + Math.cos(a) * len, sy = y + Math.sin(a) * len;
  const dx = x - sx, dy = y - sy, nx = -dy / len, ny = dx / len;
  const pt = (s: number, o: number): string => `${f(sx + dx * s + nx * o)},${f(sy + dy * s + ny * o)}`;
  return `<path class="bolt" d="M${pt(0, 0)} L${pt(0.38, 7)} L${pt(0.5, -6)} L${pt(0.82, 4)} L${pt(0.92, 0)}" marker-end="url(#${p}-sb)"/>`;
}

/** A thylakoid sack seen side-on: a membrane band around a lumen. */
const sack = (x0: number, x1: number, y: number, h = 46, m = 10, cls = ''): string =>
  `<g${cls ? ` class="${cls}"` : ''}><rect class="fl07-memb" x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" rx="${h / 2}"/><rect class="fl07-lumen" x="${x0 + m}" y="${y + m}" width="${x1 - x0 - 2 * m}" height="${h - 2 * m}" rx="${(h - 2 * m) / 2}"/></g>`;

const blob = (cx: number, cy: number, w: number, h: number, cls = 'blob-ps', rx = 0): string =>
  `<rect class="${cls}" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx || Math.min(w, h) * 0.32}"/>`;

/** ATP synthase: blue stalk through the membrane, purple head on the stroma side (up = −1, down = +1). */
function atpSynthase(x: number, memTop: number, memBot: number, dir: -1 | 1, r = 10): string {
  const stalk = `<rect class="blob-stalk" x="${x - 7}" y="${dir < 0 ? memTop - 8 : memTop}" width="14" height="${memBot - memTop + 8}" rx="5"/>`;
  const edge = dir < 0 ? memTop - 8 : memBot + 8;
  const h1 = edge + dir * r, h2 = edge + dir * r * 2.4;
  return `${stalk}<circle class="blob-atp" cx="${x - r * 0.8}" cy="${h1}" r="${r}"/><circle class="blob-atp" cx="${x + r * 0.8}" cy="${h1}" r="${r}"/><circle class="blob-atp" cx="${x}" cy="${h2}" r="${r}"/>`;
}

/* ---------- a · zoom in: leaf → mesophyll cell → chloroplast → grana and stroma lamellae ---------- */

function zoomSvg(): string {
  const p = 'fl07a';
  const A = { x: 104, y: 140, r: 72 }, B = { x: 318, y: 160, r: 92 }, C = { x: 628, y: 188, r: 120 };
  type Lens = typeof A;
  const on = (L: Lens, deg: number): Pt => [L.x + L.r * Math.cos((deg * Math.PI) / 180), L.y + L.r * Math.sin((deg * Math.PI) / 180)];
  const clip = (L: Lens, id: string): string => `<clipPath id="${p}-${id}"><circle cx="${L.x}" cy="${L.y}" r="${L.r - 1}"/></clipPath>`;
  const ring = (L: Lens): string => `<circle class="fl07-lens" cx="${L.x}" cy="${L.y}" r="${L.r}"/>`;
  const line = (a: Pt, b: Pt): string => `<path class="fl07-zl" d="M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}"/>`;
  const box = (x0: number, y0: number, x1: number, y1: number): string => `<rect class="fl07-zb" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="3"/>`;

  // A · leaf
  const leaf = `<g transform="translate(${A.x} ${A.y}) rotate(-32)">
      <path class="fl07-vein" d="M-70,5 L-50,0" style="stroke-width:3"/>
      <path class="fl07-leaf" d="M-50,0 C-30,-34 24,-36 54,0 C24,36 -30,34 -50,0Z"/>
      <path class="fl07-vein" d="M-50,0 L50,0 M-28,0 L-14,-17 M-4,0 L10,-19 M20,0 L32,-12 M-28,0 L-14,17 M-4,0 L10,19 M20,0 L32,12"/></g>`;
  // B · mesophyll cells with chloroplasts along the walls
  const cell = (x0: number, y0: number, x1: number, y1: number): string => {
    const ys = [0.19, 0.4, 0.61, 0.82].map(t => y0 + (y1 - y0) * t), xs = [0.36, 0.64].map(t => x0 + (x1 - x0) * t);
    const side = ys.flatMap(y => [x0 + 12, x1 - 12].map(x => `<ellipse class="fl07-cp" cx="${f(x)}" cy="${f(y)}" rx="7" ry="12"/>`));
    const ends = xs.flatMap(x => [y0 + 12, y1 - 12].map(y => `<ellipse class="fl07-cp" cx="${f(x)}" cy="${f(y)}" rx="12" ry="7"/>`));
    return `<rect class="fl07-cell" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="28"/>${side.join('')}${ends.join('')}`;
  };
  const cells = `<g transform="translate(0 -12)">${cell(160, 98, 258, 246) + cell(266, 98, 370, 246) + cell(378, 98, 476, 246)}</g>`;
  // C · chloroplast: double envelope, grana stacks joined by stroma lamellae
  const G: Pt[] = [[566, 166], [622, 198], [684, 158], [618, 128], [690, 208]];
  const granum = ([x, y]: Pt): string => Array.from({ length: 5 }, (_, i) => `<rect class="fl07-gr" x="${x - 15}" y="${y - 17 + i * 7}" width="30" height="5" rx="2.5"/>`).join('');
  const lam = `<path class="fl07-lam" d="M536,176 L566,166 L622,198 L684,158 L716,150 M566,166 L618,128 L684,158 M622,198 L690,208 L714,214"/>`;
  const chloroplast = `<g transform="translate(0 22)"><ellipse class="fl07-env" cx="${C.x}" cy="${C.y}" rx="104" ry="66"/><ellipse class="fl07-env2" cx="${C.x}" cy="${C.y}" rx="97" ry="59"/>${lam}${G.map(granum).join('')}</g>`;

  // D · the membrane: a granum (stacked sacks) and a stroma lamella running out of it
  const dTop = 332, s1 = 392, s2 = 442, s3 = 492, h = 46;
  const psii: Array<[number, number]> = [[230, s1 + h - 5], [170, s2 + 5], [290, s2 + 5], [120, s2 + h - 5], [250, s2 + h - 5], [190, s3 + 5]];
  const D = `
    <rect class="fl07-panel" x="20" y="${dTop}" width="760" height="${592 - dTop}" rx="18"/>
    ${sack(50, 330, s1, h)}${sack(50, 770, s2, h)}${sack(50, 330, s3, h)}
    ${psii.map(([x, y]) => blob(x, y, 34, 24)).join('')}
    ${blob(110, s1 + h - 5, 44, 32)}${rcRing(110, s1 + h - 5, 12)}
    ${blob(450, s2 + 5, 52, 34)}${rcRing(450, s2 + 5, 12)}
    ${blob(540, s2 + h - 5, 46, 30)}
    ${atpSynthase(590, s2, s2 + 10, -1)}${atpSynthase(700, s2 + h - 10, s2 + h, 1)}
    ${bolt(p, 62, 342, 102, 424)}${bolt(p, 402, 344, 442, 428)}
    ${text(122, 378, 'PSII', 'sm fl07-b', 'start')}${text(462, 378, 'PSI', 'sm fl07-b', 'start')}${text(612, 378, 'ATP synthase', 'sm', 'start')}
    ${text(380, s2 + 30, 'lumen', 'fl07-note', 'middle')}
    ${text(300, 378, 'stroma', 'fl07-note', 'middle')}
    ${text(190, 576, 'granum', 'sm fl07-b')}
    ${text(560, 576, 'stroma lamella', 'sm fl07-b')}`;

  return svg('Zoom from a leaf to a mesophyll cell, a chloroplast and its thylakoid membranes: PSII in the stacked grana, PSI and ATP synthase in the unstacked stroma lamellae, both photosystems separating charge', `
    ${defs(p)}${clip(A, 'cA')}${clip(B, 'cB')}${clip(C, 'cC')}
    ${line([120, 121], on(B, 205))}${line([120, 139], on(B, 155))}
    ${line([370, 130], on(C, 205))}${line([370, 162], on(C, 155))}
    ${line([600, 240], [20, dTop])}${line([660, 240], [780, dTop])}
    ${ring(A)}<g clip-path="url(#${p}-cA)">${leaf}</g>${box(101, 121, 120, 139)}
    ${ring(B)}<g clip-path="url(#${p}-cB)">${cells}</g>${box(346, 130, 370, 162)}
    ${ring(C)}<g clip-path="url(#${p}-cC)">${chloroplast}</g>${box(600, 198, 660, 240)}
    ${[A, B, C].map((L, i) => text(L.x, 44, ['leaf', 'mesophyll cell', 'chloroplast'][i], 'sm fl07-b')).join('')}
    ${D}
  `);
}

/* ---------- b · donor to acceptor: one reaction centre, the electron crossing the membrane ---------- */

function donorSvg(): string {
  const p = 'fl07b';
  const mT = 236, mB = 330;
  const Dp: Pt = [352, 312], A1: Pt = [430, 262], A2: Pt = [494, 194];
  return svg('A reaction centre: excitation reaches the Chl a pair, which gives an electron to an acceptor; the donor is left oxidised on the lumen side and the acceptor reduced on the stroma side', `
    ${defs(p)}
    ${text(24, 44, 'stroma', 'fl07-note', 'start')}${text(24, 586, 'lumen', 'fl07-note', 'start')}
    ${bilayer(p, 10, 790, mT, mB)}
    <rect class="fl07-ant" x="40" y="200" width="200" height="166" rx="56"/>
    ${chl(82, 252, 9)}${chl(126, 300, 9)}${chl(166, 248, 9)}${chl(206, 300, 9)}${chl(96, 332, 9)}${chl(176, 340, 9)}
    ${blob(406, 282, 300, 268, 'blob-ps', 64)}
    ${bolt(p, 50, 92, 78, 234)}
    ${hop(p, [88, 244], [158, 242], 0.3)}${hop(p, [172, 254], [200, 290], 0.35)}${hop(p, [214, 296], [326, 306], 0.18)}
    ${glow(p, 207, 300, 0.85)}
    ${text(140, 192, 'antenna', 'sm fl07-mut')}
    ${pair(Dp[0], Dp[1], 13)}${q(Dp[0], Dp[1] + 34, '+', 13)}
    ${acc(A1[0], A1[1], 12)}${q(A2[0], A2[1], '−', 13)}
    ${epath(p, `M${Dp[0] + 16},${Dp[1] - 12} L${A1[0] - 12},${A1[1] + 8}`)}
    ${epath(p, `M${A1[0] + 10},${A1[1] - 10} L${A2[0] - 10},${A2[1] + 12}`)}
    ${epath(p, `M${A2[0] + 14},${A2[1] - 8} L590,124`)}${eLab(404, 276, 'end')}
    ${text(600, 118, 'to PQ (PSII)', 'sm', 'start')}${text(600, 144, 'or Fd (PSI)', 'sm', 'start')}
    ${text(574, 206, 'reduced acceptor', 'sm fl07-blue', 'start')}
    ${text(334, 446, 'oxidised donor', 'sm fl07-red', 'end')}${text(334, 472, '(Chl <tspan font-style="italic">a</tspan> pair)', 'sm', 'end')}
    ${epath(p, `M${Dp[0]},536 L${Dp[0]},${Dp[1] + 52}`)}${eLab(366, 470, 'start')}
    ${text(334, 534, 'from water (PSII)', 'sm', 'end')}${text(334, 560, 'or PC (PSI)', 'sm', 'end')}
    ${text(780, 446, 'quantum yield, weak light:', 'sm fl07-mut', 'end')}
    ${text(780, 472, 'PSII ≈ 85–90 % · PSI ≈ 97 %', 'sm fl07-mut', 'end')}
    ${text(780, 560, 'PQ plastoquinone · PC plastocyanin', 'fl07-key', 'end')}
    ${text(780, 584, 'Fd ferredoxin', 'fl07-key', 'end')}
  `);
}

/* ---------- c · solar cell: the same trick, mapped part by part, and where it differs ---------- */

function solarSvg(): string {
  const p = 'fl07c';
  const lamp = (x: number, y: number): string =>
    `<circle class="fl07-lamp" cx="${x}" cy="${y}" r="16"/><path class="fl07-fil" d="M${x - 8},${y + 4} q4,-12 8,0 q4,-12 8,0"/>`;
  const rows: Array<[string, string, boolean]> = [
    ['light makes − and +', 'light makes acceptor⁻ and donor⁺', false],
    ['junction field separates them', 'cofactor chain separates them', false],
    ['e⁻ flows through the lamp', 'e⁻ flows on to NADPH', false],
    ['the circuit refills +', 'water refills + (PSII)', false],
    ['closed loop', 'open line: water in, NADPH out', true],
  ];
  const rowY = [354, 404, 454, 504, 566];
  return svg('Analogy: a solar cell and a reaction centre both use light to make a + and − pair and pull them apart; unlike a solar cell, the reaction centre is refilled from water and its electrons end in NADPH', `
    ${defs(p)}
    ${text(190, 40, 'solar cell', 'lab lab-b')}
    <rect class="fl07-n" x="50" y="120" width="250" height="56"/><rect class="fl07-p" x="50" y="176" width="250" height="76"/>
    <path class="fl07-junc" d="M50,176 H300"/>
    ${[96, 172, 248].map(x => `<rect class="fl07-contact" x="${x}" y="110" width="12" height="10"/>`).join('')}
    <rect class="fl07-contact" x="50" y="252" width="250" height="10"/>
    ${text(66, 156, 'n', 'sm fl07-mut')}${text(66, 222, 'p', 'sm fl07-mut')}
    ${bolt(p, 112, 44, 150, 164)}
    ${q(176, 150, '−', 13)}${arrow(p, 'ink', 'M176,134 L176,124')}
    ${q(214, 212, '+', 13)}${arrow(p, 'ink', 'M214,228 L214,246')}
    <path class="fl07-wire" d="M300,115 H344 V176 M344,208 V257 H300"/>${lamp(344, 192)}
    ${arrow(p, 'red', 'M344,124 L344,160')}${arrow(p, 'red', 'M344,222 L344,248')}

    ${text(600, 40, 'reaction centre', 'lab lab-b')}
    ${bilayer(p, 420, 780, 150, 222)}
    ${blob(600, 186, 140, 156, 'blob-ps', 40)}
    ${bolt(p, 472, 50, 540, 152)}
    ${pair(586, 204, 11)}${q(586, 238, '+', 12)}${text(562, 284, 'donor⁺', 'sm fl07-red', 'end')}
    ${q(632, 136, '−', 12)}${text(682, 137, 'acceptor⁻', 'sm fl07-blue', 'start')}
    ${epath(p, 'M598,194 L622,150')}
    ${epath(p, 'M644,128 L716,92')}${text(712, 74, 'to NADPH', 'sm', 'middle')}
    ${water(586, 300)}${epath(p, 'M586,286 L586,254')}${text(606, 306, 'from water', 'sm', 'start')}
    ${text(430, 138, 'stroma', 'fl07-note', 'start')}${text(430, 250, 'lumen', 'fl07-note', 'start')}

    <path class="fl07-rule" d="M24,322 H776"/>
    ${rows.map(([l, r, b], i) => `${text(30, rowY[i], l, b ? 'sm fl07-b' : 'sm', 'start')}${text(400, rowY[i], '↔', 'sm fl07-mut')}${text(430, rowY[i], r, b ? 'sm fl07-b' : 'sm', 'start')}`).join('')}
    <path class="fl07-rule" d="M24,530 H776"/>
    ${text(30, 594, 'where the analogy breaks', 'fl07-note', 'start')}
  `);
}

/* ---------- d · same pigment, two jobs: antenna Chl a passes energy, reaction-centre Chl a passes an electron ---------- */

function samePigmentSvg(): string {
  const p = 'fl07d';
  const antenna = (y: number, lit: number): string => `
    <rect class="fl07-ant" x="60" y="${y - 52}" width="290" height="104" rx="52"/>
    ${[120, 205, 290].map(x => chl(x, y, 18)).join('')}${glow(p, [120, 205, 290][lit], y, 1.15)}`;
  const centre = (y: number): string => `${blob(595, y, 300, 104, 'blob-ps', 52)}`;
  return svg('The same chlorophyll a does two jobs: in the antenna an excitation hops on and no charge appears; in the reaction centre the excited Chl a pair gives an electron to an acceptor beside it', `
    ${defs(p)}
    ${text(205, 40, 'in the antenna', 'lab lab-b')}${text(595, 40, 'in the reaction centre', 'lab lab-b')}
    <path class="fl07-rule" d="M400,64 V540 M24,300 H776"/>
    ${text(28, 84, 'just excited', 'fl07-note', 'start')}${text(28, 330, 'a moment later', 'fl07-note', 'start')}
    ${antenna(186, 0)}${bolt(p, 178, 70, 132, 164)}
    ${text(205, 276, 'an excited Chl <tspan font-style="italic">a</tspan>', 'sm')}
    ${antenna(432, 1)}${hop(p, [132, 414], [192, 414], 0.4)}
    ${text(205, 512, 'energy hops on', 'sm')}${text(205, 538, 'no charge', 'sm fl07-b')}
    ${centre(186)}${pair(560, 186, 18)}${acc(668, 186, 16)}${glow(p, 560, 186, 1.3)}
    ${hop(p, [446, 132], [536, 166], 0.2)}
    ${text(668, 226, 'acceptor', 'sm fl07-mut')}
    ${text(595, 276, 'an excited Chl <tspan font-style="italic">a</tspan> pair', 'sm')}
    ${centre(432)}${pair(560, 432, 18)}${q(560, 432, '+', 15)}${q(668, 432, '−', 16)}
    ${epath(p, 'M574,408 Q614,380 652,414')}${eLab(614, 384)}
    ${text(595, 512, 'an electron moves', 'sm')}${text(595, 538, 'pair⁺ and acceptor⁻', 'sm fl07-b')}
    ${text(400, 590, 'Only the reaction centre has an acceptor', 'sm fl07-mut')}
  `);
}

/* ---------- e · four steps: absorb, hop, separate, refill and pass on ---------- */

function stepsSvg(): string {
  const p = 'fl07e';
  const W = 370, H = 270;
  const panel = (n: number, ox: number, oy: number, title: string, body: string, foot: string): string => {
    const mT = oy + 128, mB = oy + 176;
    const D: Pt = [ox + 238, oy + 166], A: Pt = [ox + 292, oy + 126];
    return `<rect class="fl07-panel" x="${ox}" y="${oy}" width="${W}" height="${H}" rx="18"/>
      <circle class="fl07-numc" cx="${ox + 30}" cy="${oy + 34}" r="16"/>${text(ox + 30, oy + 40.5, `${n}`, 'fl07-num')}
      ${text(ox + 56, oy + 42, title, 'sm fl07-b', 'start')}
      ${bilayer(`${p}${n}`, ox + 14, ox + W - 14, mT, mB)}
      <ellipse class="fl07-ant" cx="${ox + 100}" cy="${oy + 152}" rx="72" ry="46"/>
      ${chl(ox + 62, oy + 146, 8)}${chl(ox + 100, oy + 166, 8)}${chl(ox + 140, oy + 144, 8)}
      ${blob(ox + 262, oy + 152, 136, 112, 'blob-ps', 34)}
      ${body}
      ${foot ? text(ox + W / 2, oy + H - 18, foot, 'sm fl07-mut') : ''}`
      .replace('§D', pair(D[0], D[1], 10)).replace('§A', acc(A[0], A[1], 10));
  };
  const at = (ox: number, oy: number) => ({ D: [ox + 238, oy + 166] as Pt, A: [ox + 292, oy + 126] as Pt });
  const P = [[20, 14], [410, 14], [20, 298], [410, 298]];
  const s1 = (() => { const [ox, oy] = P[0]; return `§D§A${bolt(p, ox + 42, oy + 66, ox + 58, oy + 132)}${glow(p, ox + 62, oy + 146, 0.9)}`; })();
  const s2 = (() => {
    const [ox, oy] = P[1], { D } = at(ox, oy);
    return `§D§A${hop(p, [ox + 70, oy + 140], [ox + 132, oy + 140], 0.35)}${hop(p, [ox + 148, oy + 150], [D[0] - 22, D[1] - 4], 0.25)}${glow(p, D[0], D[1], 1)}`;
  })();
  const s3 = (() => {
    const [ox, oy] = P[2], { D, A } = at(ox, oy);
    return `${pair(D[0], D[1], 10)}${q(D[0], D[1] + 26, '+', 11)}${q(A[0], A[1], '−', 11)}${epath(p, `M${D[0] + 12},${D[1] - 10} L${A[0] - 10},${A[1] + 10}`)}`;
  })();
  const s4 = (() => {
    const [ox, oy] = P[3], { D, A } = at(ox, oy);
    return `§D§A${epath(p, `M${A[0] + 10},${A[1] - 8} L${ox + 350},${oy + 76}`)}${text(ox + 290, oy + 88, 'to PQ or Fd', 'sm', 'end')}
      ${epath(p, `M${D[0]},${oy + 236} L${D[0]},${D[1] + 14}`)}${text(D[0] - 12, oy + 252, 'from water or PC', 'sm', 'end')}`;
  })();
  return svg('Four steps of a reaction centre: light absorbed in the antenna, energy hops to the Chl a pair, an electron jumps to the acceptor leaving + and −, then the donor is refilled and the electron passed on', `
    ${defs(p)}
    ${panel(1, P[0][0], P[0][1], 'Light is absorbed', s1, '')}${text(P[0][0] + 100, P[0][1] + H - 18, 'antenna', 'sm fl07-mut')}${text(P[0][0] + 262, P[0][1] + H - 18, 'reaction centre', 'sm fl07-mut')}
    ${panel(2, P[1][0], P[1][1], 'Energy hops to the centre', s2, 'only energy moves')}
    ${panel(3, P[2][0], P[2][1], 'An electron jumps', s3, 'charge separation')}
    ${panel(4, P[3][0], P[3][1], 'Refilled and passed on', s4, '')}
    ${text(400, 592, 'PQ plastoquinone · PC plastocyanin · Fd ferredoxin', 'fl07-key')}
  `);
}

/* ---------- f · both at once: each photosystem fires when it absorbs; a shared carrier pool links them ---------- */

function bothSvg(): string {
  const p = 'fl07f';
  const x0 = 180, x1 = 770, y2 = 140, yP = 294, y1 = 448;
  const ps2 = [214, 330, 400, 560, 698], ps1 = [262, 352, 480, 626, 736];
  const dots: Pt[] = [[232, 270], [286, 316], [362, 274], [430, 318], [512, 272], [596, 316], [660, 274], [726, 314]];
  return svg('Schematic timeline: PSII and PSI each separate charge whenever they absorb light, at independent times; a shared carrier pool passes electrons from PSII to PSI, so neither waits for the other', `
    ${defs(p)}
    ${rcRing(x0 + 12, 34, 12)}${text(x0 + 34, 41, '= one photon absorbed, one charge separation', 'sm', 'start')}
    <path class="fl07-lane" d="M${x0},${y2} H${x1}M${x0},${y1} H${x1}"/>
    <rect class="fl07-pool" x="${x0}" y="${yP - 38}" width="${x1 - x0}" height="76" rx="38"/>
    ${dots.map(([x, y]) => `<circle class="fl07-edot" cx="${x}" cy="${y}" r="5"/>`).join('')}
    ${text(475, yP + 8, 'shared pool of e⁻', 'sm fl07-mut')}
    ${text(20, y2 - 4, 'PSII', 'lab lab-b', 'start')}${text(20, y2 + 24, 'e⁻ from water', 'sm', 'start')}
    ${text(20, yP - 4, 'carriers', 'lab lab-b', 'start')}${text(20, yP + 24, 'PQ · b₆f · PC', 'sm', 'start')}
    ${text(20, y1 - 4, 'PSI', 'lab lab-b', 'start')}${text(20, y1 + 24, 'e⁻ to Fd', 'sm', 'start')}
    ${ps2.map(x => `${spark(p, x, y2 - 16, 52, -90)}${rcRing(x, y2)}${epath(p, `M${x},${y2 + 18} L${x},${yP - 44}`)}`).join('')}
    ${ps1.map(x => `${spark(p, x - 15, y1 - 6, 50, -150)}${rcRing(x, y1)}${epath(p, `M${x},${yP + 42} L${x},${y1 - 20}`)}`).join('')}
    ${arrow(p, 'ink', `M${x0},516 L${x1 + 6},516`)}${text(x1, 548, 'time', 'tl', 'end')}
    ${text(x0, 548, 'schematic', 'tl', 'start')}
    ${text(475, 590, 'PQ plastoquinone · b₆f cytochrome b₆f · PC plastocyanin · Fd ferredoxin', 'fl07-key')}
  `);
}

/* ---------- g · membrane map: PSII in the stacked granum, PSI and ATP synthase in the lamella, both firing ---------- */

function mapSvg(): string {
  const p = 'fl07g';
  const tT = 196, tB = 252, bT = 344, bB = 400, edge = 392;
  return svg('Thylakoid membrane in thesis style: PSII with LHCII sits in the stacked granum, PSI and ATP synthase in the unstacked stroma lamella; light drives charge separation in both at once, PQ and PC carry electrons between the two regions', `
    ${defs(p)}
    <g class="fl07-fade">${bilayer(`${p}u`, 10, edge, 128, 184)}<rect class="fl07-lumen" x="10" y="96" width="${edge - 10}" height="32"/>
      ${bilayer(`${p}d`, 10, edge, 412, 468)}<rect class="fl07-lumen" x="10" y="468" width="${edge - 10}" height="32"/></g>
    <rect class="fl07-lumen" x="10" y="${tB}" width="780" height="${bT - tB}"/>
    ${bilayer(p, 10, 790, tT, tB)}${bilayer(`${p}b`, 10, 790, bT, bB)}
    <path class="bracket" d="M18,72 v-10 H${edge - 8} v10"/>${text((edge + 10) / 2, 44, 'granum (stacked)', 'sm fl07-b')}
    <path class="bracket" d="M${edge + 8},72 v-10 H782 v10"/>${text((edge + 790) / 2, 44, 'stroma lamella (unstacked)', 'sm fl07-b')}
    <ellipse class="fl07-ant" cx="92" cy="224" rx="30" ry="36"/><ellipse class="fl07-ant" cx="268" cy="224" rx="30" ry="36"/>
    ${blob(180, 226, 120, 80, 'blob-ps', 26)}${rcRing(180, 218)}${text(180, 258, 'PSII', 'sm fl07-b')}
    <ellipse class="blob-pq" cx="326" cy="224" rx="22" ry="14"/>${text(326, 231, 'PQ', 'sm')}
    <ellipse class="blob-b6f" cx="412" cy="250" rx="30" ry="66"/>${text(412, 257, 'b₆f', 'sm fl07-b')}
    <circle class="blob-small" cx="488" cy="318" r="18"/>${text(488, 325, 'PC', 'sm')}
    ${blob(578, 226, 116, 80, 'blob-ps', 26)}${rcRing(578, 218)}${text(578, 258, 'PSI', 'sm fl07-b')}
    <ellipse class="fl07-ant" cx="656" cy="224" rx="22" ry="34"/>
    ${atpSynthase(738, tT, tB, -1, 13)}${text(788, 112, 'ATP synthase', 'sm', 'end')}${text(460, 118, 'stroma', 'fl07-note', 'middle')}
    <circle class="blob-small" cx="634" cy="148" r="18"/>${text(634, 155, 'Fd', 'sm')}
    ${bolt(p, 120, 84, 166, 182)}${bolt(p, 524, 84, 562, 182)}
    ${water(118, 304)}${epath(p, 'M126,290 L140,262')}
    ${epath(p, 'M198,214 L300,220')}${epath(p, 'M348,228 L380,236')}${epath(p, 'M420,316 L468,318')}
    ${epath(p, 'M506,312 L560,250')}${epath(p, 'M592,198 L620,164')}
    ${text(144, 334, 'e⁻ from water', 'sm', 'start')}
    ${text(782, 304, 'lumen', 'fl07-note', 'end')}${text(782, 452, 'stroma', 'fl07-note', 'end')}
    ${text(400, 548, 'PQ and PC carry e⁻ between the regions', 'sm')}
    ${text(400, 584, 'PQ plastoquinone · b₆f cytochrome b₆f · PC plastocyanin · Fd ferredoxin', 'fl07-key')}
  `);
}

/* ---------- h · bleaching dips: why the reaction centres are called P680 and P700 ---------- */

function dipsSvg(): string {
  const xL = 200, xR = 770, nm0 = 640, nm1 = 740, depth = 84;
  const X = (nm: number): number => xL + ((nm - nm0) / (nm1 - nm0)) * (xR - xL);
  const g = (x: number, mu: number, sd: number): number => Math.exp(-((x - mu) ** 2) / (2 * sd * sd));
  const trace = (y0: number, mu: number): string => {
    const pts: string[] = [];
    for (let nm = nm0; nm <= nm1; nm += 1) pts.push(`${pts.length ? 'L' : 'M'}${f(X(nm))},${f(y0 + depth * g(nm, mu, 7.5))}`);
    return `<path class="fl07-zero" d="M${xL},${y0} H${xR}"/><path class="fl07-trace" d="${pts.join('')}"/><circle class="dot dot-a" cx="${f(X(mu))}" cy="${y0 + depth}" r="6"/>`;
  };
  const yA = 156, yB = 334, axisY = 506;
  const ticks = [640, 660, 680, 700, 720, 740].map(nm => `<line class="tick" x1="${f(X(nm))}" y1="${axisY}" x2="${f(X(nm))}" y2="${axisY + 8}"/>${text(X(nm), axisY + 34, `${nm}`, 'tl')}`).join('');
  const lab = (y0: number, mu: number, name: string): string =>
    `${text(X(mu), y0 + depth + 36, `dip near ${mu} nm`, 'sm')}${text(X(mu), y0 + depth + 66, `→ ${name}`, 'lab lab-b fl07-grn')}`;
  return svg('Schematic light-induced absorbance changes: a PSII sample dips near 680 nm and a PSI sample near 700 nm when the Chl a pair gives away an electron; the dip gives each reaction centre its name', `
    ${text(24, 52, 'In light, the oxidised Chl <tspan font-style="italic">a</tspan> pair absorbs less', 'sm', 'start')}
    ${trace(yA, 680)}${trace(yB, 700)}
    ${lab(yA, 680, 'P680')}${lab(yB, 700, 'P700')}
    ${text(xL - 10, yA + 8, '0', 'tl', 'end')}${text(xL - 10, yB + 8, '0', 'tl', 'end')}
    ${text(24, yA - 2, 'PSII', 'lab lab-b', 'start')}${text(24, yA + 26, 'sample', 'sm fl07-mut', 'start')}
    ${text(24, yB - 2, 'PSI', 'lab lab-b', 'start')}${text(24, yB + 26, 'sample', 'sm fl07-mut', 'start')}
    <text class="tl" transform="translate(${xL - 50} ${(yA + yB) / 2 + 44}) rotate(-90)" text-anchor="middle">change in absorbance</text>
    <path class="axis" d="M${xL},${axisY} H${xR}"/>${ticks}
    ${text((xL + xR) / 2, axisY + 70, 'wavelength (nm)', 'tl')}
    ${text(xR, 52, 'schematic', 'tl', 'end')}
  `);
}

/* ---------- i · charge equation: what "light" in the photosynthesis equation becomes first ---------- */

function equationSvg(): string {
  const p = 'fl07i';
  const y = 236;
  const card = (x: number, ps: string, pig: string, to: string, from: string): string => `
    <rect class="fl07-panel" x="${x}" y="372" width="350" height="186" rx="18"/>
    ${text(x + 24, 412, ps, 'lab lab-b', 'start')}
    ${text(x + 24, 458, `${pig}* → ${pig}⁺ + e⁻`, 'lab', 'start')}
    ${text(x + 24, 500, `e⁻ on to ${to}`, 'sm', 'start')}
    ${text(x + 24, 532, `${pig}⁺ refilled from ${from}`, 'sm', 'start')}`;
  return svg('Equation view: the light term of the photosynthesis equation first becomes separated charges; donor plus acceptor plus excitation gives oxidised donor plus reduced acceptor, P680 in PSII and P700 in PSI', `
    ${defs(p)}
    ${text(318, 60, '6 CO₂ + 6 H₂O +', 'fl07-eq', 'end')}${text(360, 60, 'light', 'fl07-light')}${text(402, 60, '→ C₆H₁₂O₆ + 6 O₂', 'fl07-eq', 'start')}
    ${arrow(p, 'ink', 'M360,74 L360,132')}${text(376, 112, 'first, it separates charge:', 'sm fl07-mut', 'start')}
    <rect class="blob-ps" x="54" y="${y - 50}" width="196" height="100" rx="40"/>${pair(112, y, 15)}${acc(196, y, 14)}
    ${text(318, y + 10, '+', 'fl07-big')}
    ${glow(p, 400, y, 1.6)}
    ${text(482, y + 10, '→', 'fl07-big')}
    <rect class="blob-ps" x="550" y="${y - 50}" width="196" height="100" rx="40"/>${pair(608, y, 15)}${q(608, y, '+', 14)}${q(692, y, '−', 15)}
    ${text(152, y + 84, 'donor · acceptor', 'sm')}${text(400, y + 84, 'excitation', 'sm')}${text(648, y + 84, 'donor⁺ · acceptor⁻', 'sm')}
    ${card(40, 'PSII', 'P680', 'PQ', 'water')}${card(410, 'PSI', 'P700', 'Fd', 'PC')}
    ${text(400, 590, '* excited · PQ plastoquinone · PC plastocyanin · Fd ferredoxin', 'fl07-key')}
  `);
}

/* ---------- j · three icons: light, energy, charges ---------- */

function iconsSvg(): string {
  const p = 'fl07j';
  const y = 250;
  const flash = (x: number, yy: number): string =>
    `<path class="fl07-flash" d="M${x + 8},${yy - 80} L${x - 34},${yy + 8} L${x - 4},${yy + 8} L${x - 20},${yy + 80} L${x + 34},${yy - 14} L${x + 4},${yy - 14} L${x + 26},${yy - 80} Z"/>`;
  return svg('Three icons: light is absorbed, energy hops to the reaction centre, charges separate; PSII and PSI do this at the same time', `
    ${defs(p)}
    ${flash(140, y)}
    ${arrow(p, 'ink', `M218,${y} L290,${y}`)}
    <ellipse class="fl07-ant" cx="400" cy="${y}" rx="92" ry="66"/>
    ${chl(350, y - 22, 14)}${chl(394, y + 30, 14)}${chl(448, y - 16, 14)}
    ${hop(p, [362, y - 26], [384, y + 14], 0.4)}${hop(p, [408, y + 24], [432, y - 6], 0.4)}${glow(p, 448, y - 16, 1.3)}
    ${arrow(p, 'ink', `M510,${y} L582,${y}`)}
    ${rcRing(668, y, 60)}
    ${text(140, 392, 'light is', 'lab')}${text(140, 424, 'absorbed', 'lab')}
    ${text(400, 392, 'energy hops to the', 'lab')}${text(400, 424, 'reaction centre', 'lab')}
    ${text(668, 392, 'charges separate:', 'lab')}${text(668, 424, 'donor⁺, acceptor⁻', 'lab')}
  `);
}
