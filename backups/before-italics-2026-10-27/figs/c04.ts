// Slide C04 · What the cycle produces—and what it costs. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// Checked facts only (research/review-2026-10-23-claude/D_C01-C06.md, claims 4, 16, 30–34; REVIEW_SUMMARY.md §6):
// per 3 CO₂: 9 ATP + 6 NADPH → 1 net triose phosphate; per CO₂ 3 ATP + 2 NADPH, a ratio of 1.5 (Kramer & Evans 2011);
// carboxylation itself costs nothing; a hexose equivalent needs two net trioses (18 ATP + 12 NADPH) and there is no direct
// glucose output: triose-P becomes sucrose in the cytosol and starch in the chloroplast (Sharkey 2024).
// The count excludes photorespiration, CO₂ concentration, activase ATP and the cost of making sucrose and starch.
// Link to lecture 1 is qualitative only: linear flow alone gives a little less ATP than this mix (the lecturer rejected
// numeric budget figures, so costs are tags and counted icons, never tables). Words: triose phosphate / triose-P, never G3P.
// Shared vocabulary and helpers come from c03.ts; equation colours follow L01 (carbon brown, water and O₂ blue, light amber).
import type { PlateText, Variant } from '../types';
import { bolt, molecule, tag } from '../illus';
import { T, ar, badge, chain, chip, co2, f1, mini, pent, pentC, scheme, wrap } from './c03';
import './c04.css';

export const PLATE: PlateText = {
  n: 'C4',
  title: 'What the cycle produces—and what it costs',
  status: 'draft',
  lead: 'Fixing 3 CO₂ yields one triose phosphate and costs 9 ATP and 6 NADPH from the light reactions.',
  points: [
    { claim: 'The product is triose phosphate.', text: 'Not glucose: it becomes sucrose in the cytosol and starch in the chloroplast.' },
    { claim: 'Each CO₂ costs 3 ATP + 2 NADPH.', text: 'A ratio of 1.5; linear electron flow alone gives ≈ 1.3 (lecture 1, slide 11). Photorespiration raises both costs.' },
    { claim: 'C₆H₁₂O₆ is bookkeeping.', text: 'One hexose equals two trioses from 6 CO₂: 18 ATP + 12 NADPH.' },
  ],
  refs: [
    { label: 'Kramer & Evans 2011', url: 'https://doi.org/10.1104/pp.110.166652' },
    { label: 'Sharkey 2024', url: 'https://doi.org/10.1093/plphys/kiad601' },
    { label: 'von Caemmerer et al. 2025', url: 'https://doi.org/10.1007/s00425-025-04834-7' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Thesis scheme' },
  { id: 'b', name: 'Price tag' },
  { id: 'c', name: 'Bookkeeping' },
  { id: 'd', name: 'Not glucose' },
  { id: 'e', name: 'Leaf zoom' },
  { id: 'f', name: 'Running total', anim: true },
  { id: 'g', name: 'Scale up' },
  { id: 'h', name: 'Two fuels' },
  { id: 'i', name: 'Two halves trade', anim: true },
  { id: 'j', name: 'The minimum' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return priceTag();
    case 'c': return bookkeeping();
    case 'd': return notGlucose();
    case 'e': return leafZoom();
    case 'f': return runningTotal();
    case 'g': return scaleUp();
    case 'h': return twoFuels();
    case 'i': return twoHalves();
    case 'j': return theMinimum();
    default: return scheme('fc04a', 'cost');
  }
}

/* ---------- shared icons ---------- */

/** A six-membered sugar ring (hexose) as a flat hexagon. */
const hexa = (x: number, y: number, r: number, cls = 'fc04-ring'): string =>
  `<polygon class="${cls}" points="${Array.from({ length: 6 }, (_, k) => {
    const a = Math.PI / 6 + (k * Math.PI) / 3;
    return `${f1(x + r * Math.cos(a))},${f1(y + r * Math.sin(a))}`;
  }).join(' ')}"/>`;

/** Sucrose: a six-ring joined to a five-ring. */
const sucrose = (x: number, y: number, r = 20): string =>
  `<path class="fc04-link" d="M${f1(x - r * 0.2)},${y} H${f1(x + r * 0.6)}"/>${hexa(x - r, y, r)}${pent(x + r * 1.15, y, r * 0.95, '', 'fc04-ring')}`;

/** Starch: a chain of six-rings with one branch. */
const starch = (x: number, y: number, r = 15): string => {
  const xs = [-3, -1, 1, 3].map(k => x + k * r * 0.95);
  return `<path class="fc04-link" d="M${f1(xs[0])},${y} H${f1(xs[3])} M${f1(xs[2])},${y} L${f1(xs[2] + r * 0.9)},${f1(y - r * 1.7)}"/>` +
    xs.map(cx => hexa(cx, y, r * 0.9)).join('') + hexa(xs[2] + r * 0.9, y - r * 1.7, r * 0.9);
};

/** A small cycle icon: three arcs in a ring. */
const cycleIcon = (p: string, x: number, y: number, r: number): string => {
  const pt = (d: number): string => `${f1(x + r * Math.cos((d * Math.PI) / 180))},${f1(y + r * Math.sin((d * Math.PI) / 180))}`;
  return [[200, 300], [320, 60], [80, 180]].map(([a, b]) =>
    `<path class="fc04-cyc" d="M${pt(a)} A${r},${r} 0 0 1 ${pt(b)}" marker-end="url(#${p}-ink)"/>`).join('');
};

/** Counted cost icons: ATP as orange discs, NADPH as blue squares, `per` to a row. */
const dots = (x: number, y: number, n: number, k: 'atp' | 'nadph', per = 3, pitch = 24, up = false): string =>
  Array.from({ length: n }, (_, i) => {
    const cx = x + (i % per) * pitch, cy = y + (up ? -1 : 1) * Math.floor(i / per) * pitch;
    return k === 'atp' ? `<circle class="fc04-atp" cx="${f1(cx)}" cy="${f1(cy)}" r="9"/>` : `<rect class="fc04-nadph" x="${f1(cx - 9)}" y="${f1(cy - 9)}" width="18" height="18" rx="3"/>`;
  }).join('');

const legend = (x: number, y: number): string =>
  `<circle class="fc04-atp" cx="${x}" cy="${y}" r="9"/>${T(x + 16, y + 7, 'ATP', 'sm', 'start')}<rect class="fc04-nadph" x="${x + 76}" y="${y - 9}" width="18" height="18" rx="3"/>${T(x + 102, y + 7, 'NADPH', 'sm', 'start')}`;

/** A reaction arrow from x0 to x1 at height y with light written over it (textbook notation, as on slide 1). */
const rxLight = (x0: number, x1: number, y: number, size = 30): string => {
  const hd = 0.3 * size;
  return `<path class="fc04-rx" d="M${x0},${y} H${f1(x1 - hd * 0.6)}" style="stroke-width:${f1(size * 0.07)}px"/>` +
    `<path class="fc04-rxh" d="M${x1},${y} L${f1(x1 - hd)},${f1(y - hd / 2)} L${f1(x1 - hd)},${f1(y + hd / 2)} Z"/>` +
    T((x0 + x1) / 2, y - 10, 'light', 'fc04-rxl fc04-l');
};

/** A leaf in side view. */
const leaf = (x: number, y: number, s = 1): string =>
  `<path class="fc04-leaf" d="M${x - 60 * s},${y + 30 * s} C${x - 40 * s},${y - 40 * s} ${x + 30 * s},${y - 50 * s} ${x + 70 * s},${y - 30 * s} C${x + 50 * s},${y + 30 * s} ${x - 10 * s},${y + 50 * s} ${x - 60 * s},${y + 30 * s} Z"/>` +
  `<path class="fc04-vein" d="M${x - 60 * s},${y + 30 * s} Q${x},${y} ${x + 66 * s},${y - 28 * s}"/>`;

/* ---------- b · minimal: the price tag on one triose phosphate ---------- */

function priceTag(): string {
  const p = 'fc04b';
  const grid = (x: number, y: number, n: number, k: 'atp' | 'nadph', cols: number, dx: number): string =>
    Array.from({ length: n }, (_, i) => mini(x + (i % cols) * dx, y + Math.floor(i / cols) * 32, k)).join('');
  // The per-CO₂ price (claim 2) and the written total (the lead) are the page text's; the tag shows the price as tokens.
  return wrap(p, 'Price tag: 3 CO₂ become one net triose phosphate, and its price is 9 ATP + 6 NADPH',
    `<g transform="translate(-29 35)">
    ${T(84, 196, '3 CO₂', 'sm lab-b')}${co2(84, 236, 12)}${co2(84, 280, 12)}${co2(84, 324, 12)}
    ${ar(p, 'M134,280 L342,280', 'ink', 'boost')}${T(238, 264, 'the cycle', 'sm')}
    <rect class="node node-out" x="354" y="248" width="150" height="64" rx="32"/>${chain(429, 280, 3, 'bead', 11, 34)}
    ${T(429, 344, '1 net triose-P', 'sm lab-b')}
    <path class="fc04-string" d="M498,262 C520,218 540,186 574,160"/>
    <path class="fc04-card" d="M562,136 L592,110 H786 V420 H592 L562,394 Z"/><circle class="fc04-hole" cx="580" cy="158" r="7"/>
    ${T(690, 150, 'price', 'tiny')}
    ${grid(638, 190, 9, 'atp', 3, 54)}
    ${grid(648, 306, 6, 'nadph', 2, 82)}
    </g>`);
}

/* ---------- c · equation-anchored: C₆H₁₂O₆ is bookkeeping ---------- */

function bookkeeping(): string {
  const p = 'fc04c';
  // The equation in textbook notation: light written over the reaction arrow, as on slide 1. The cost of a hexose
  // equivalent (18 ATP + 12 NADPH) is point 3's, so the figure keeps only what C₆H₁₂O₆ stands for.
  const eq: Array<[number, string, string]> = [
    [140, '6 CO₂', 'c'], [208, '+', 'o'], [276, '6 H₂O', 'w'], [510, 'C₆H₁₂O₆', 'c'], [606, '+', 'o'], [672, '6 O₂', 'w'],
  ];
  return wrap(p, 'The classic equation, 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂ with light over the arrow: its C₆H₁₂O₆ is bookkeeping, because the cycle exports triose phosphate. Six CO₂ give two net triose phosphates, which become sucrose and starch',
    `${eq.map(([x, s, k]) => T(x, 112, s, `fc04-eq fc04-${k}`)).join('')}${rxLight(334, 420, 102)}
    <rect class="fc04-book" x="436" y="76" width="148" height="52" rx="10"/>${T(510, 60, 'bookkeeping', 'sm lab-b fc03-acc')}
    ${ar(p, 'M510,132 L510,186', 'ink', 'dashed')}${T(494, 170, 'what the cycle exports', 'sm', 'end')}
    <g transform="translate(0 30)">
    ${T(40, 206, 'per hexose equivalent', 'tiny', 'start')}
    ${[0, 1, 2, 3, 4, 5].map(i => co2(60 + (i % 3) * 56, 250 + Math.floor(i / 3) * 40, 9)).join('')}${T(116, 324, '6 CO₂', 'sm lab-b fc04-c')}
    ${ar(p, 'M206,270 L282,270')}${cycleIcon(p, 340, 270, 42)}${T(340, 278, 'cycle', 'sm')}${ar(p, 'M398,270 L452,270')}
    ${chip(500, 250, 'fc03-chip fc03-chip-out', 72, 32)}${chip(500, 292, 'fc03-chip fc03-chip-out', 72, 32)}${T(500, 336, '2 triose-P', 'sm lab-b fc04-c')}
    ${ar(p, 'M542,256 L618,222')}${ar(p, 'M542,286 L612,318')}
    ${sucrose(676, 206, 20)}${T(676, 250, 'sucrose', 'sm lab-b')}${T(676, 276, 'cytosol', 'sm')}
    ${starch(670, 344, 14)}${T(670, 388, 'starch', 'sm lab-b')}${T(670, 414, 'chloroplast', 'sm')}
    </g>
    <path class="rule" d="M40,488 H786"/>
    ${hexa(232, 542, 26, 'fc04-ring fc04-ghost')}<path class="fc03-no" d="M212,522 l40,40 M252,522 l-40,40"/>
    ${T(280, 550, 'No free glucose leaves the cycle', 'sm lab-b', 'start')}`);
}

/* ---------- d · misconception: before and after ---------- */

function notGlucose(): string {
  const p = 'fc04d';
  const sun = (x: number, y: number): string =>
    `<circle class="fc04-sun" cx="${x}" cy="${y}" r="22"/>` + Array.from({ length: 8 }, (_, k) => {
      const a = (k * Math.PI) / 4;
      return `<path class="fc04-ray" d="M${f1(x + 30 * Math.cos(a))},${f1(y + 30 * Math.sin(a))} L${f1(x + 40 * Math.cos(a))},${f1(y + 40 * Math.sin(a))}"/>`;
    }).join('');
  return wrap(p, 'Myth and fact: the myth says photosynthesis makes glucose; in fact the cycle exports triose phosphate, which becomes sucrose in the cytosol and starch in the chloroplast',
    `<rect class="fc04-myth" x="10" y="10" width="300" height="580" rx="22"/>
    ${T(160, 56, 'Myth', 'lab lab-b fc04-ghost-t')}${T(160, 88, '“the leaf makes glucose”', 'sm fc04-ghost-t')}
    ${sun(84, 170)}${leaf(176, 250, 0.9)}${ar(p, 'M160,300 L160,372', 'ink', 'fc04-faded')}
    ${hexa(160, 432, 46, 'fc04-ring fc04-ghost')}${T(160, 440, 'glucose', 'sm fc04-ghost-t')}
    <path class="fc03-no" d="M110,382 l100,100 M210,382 l-100,100"/>
    ${T(160, 548, 'no glucose leaves', 'sm lab-b', 'middle')}
    <rect class="fc03-panel" x="330" y="10" width="460" height="580" rx="22"/>
    ${T(560, 56, 'Fact', 'lab lab-b')}
    ${cycleIcon(p, 430, 170, 54)}${T(430, 178, 'cycle', 'sm')}${co2(430, 88, 9)}${ar(p, 'M430,100 L430,112')}
    ${ar(p, 'M494,170 L560,170')}${chip(612, 170, 'fc03-chip fc03-chip-out', 84, 36)}${T(612, 222, 'triose phosphate', 'sm lab-b')}
    ${ar(p, 'M582,252 L496,370')}${ar(p, 'M642,252 L710,370')}
    ${sucrose(462, 430, 24)}${T(462, 494, 'sucrose', 'sm lab-b')}${T(462, 522, 'cytosol', 'sm')}
    ${starch(700, 436, 15)}${T(700, 494, 'starch', 'sm lab-b')}${T(700, 522, 'chloroplast', 'sm')}`);
}

/* ---------- e · zoom: leaf → cell → chloroplast, where the cost is paid and the product goes ---------- */

function leafZoom(): string {
  const p = 'fc04e';
  const granum = (x: number, y: number): string =>
    Array.from({ length: 5 }, (_, i) => `<rect class="fc04-thy" x="${x - 30}" y="${y - 30 + i * 12}" width="60" height="10" rx="5"/>`).join('');
  const chloro = (x: number, y: number): string => `<ellipse class="fc04-env" cx="${x}" cy="${y}" rx="18" ry="10"/>`;
  return wrap(p, 'Zoom from a leaf to a mesophyll cell to a chloroplast: thylakoids make ATP and NADPH from light; the cycle in the stroma spends 9 ATP and 6 NADPH per 3 CO₂; starch stays in the chloroplast and triose phosphate leaves for sucrose',
    `<g transform="translate(0 16)">
    ${leaf(78, 250, 0.9)}<circle class="fc03-lens" cx="96" cy="246" r="18"/>
    <path class="fc03-zoom" d="M108,232 L170,190 M108,262 L170,330"/>
    <rect class="fc04-cell" x="170" y="190" width="120" height="140" rx="26"/>
    ${chloro(200, 222)}${chloro(258, 220)}${chloro(196, 300)}${chloro(262, 302)}${chloro(230, 262)}
    <circle class="fc03-lens" cx="262" cy="302" r="16"/>
    ${T(230, 362, 'cell', 'sm')}${T(78, 330, 'leaf', 'sm')}
    <path class="fc03-zoom" d="M276,290 L352,150 M276,316 L352,492"/>
    <rect class="fc04-env" x="330" y="100" width="456" height="440" rx="150"/><rect class="fc04-env-in" x="342" y="112" width="432" height="416" rx="140"/>
    ${T(560, 514, 'chloroplast', 'sm lab-b')}
    ${granum(412, 246)}${granum(412, 372)}${T(412, 450, 'thylakoids', 'sm')}
    ${bolt(p, 352, 128, 392, 200)}${T(346, 124, 'light', 'sm', 'end')}
    ${ar(p, 'M446,262 L512,284')}${ar(p, 'M446,356 L512,326')}${mini(476, 244, 'atp')}${mini(482, 382, 'nadph')}
    ${cycleIcon(p, 575, 305, 58)}${T(575, 302, 'Calvin–', 'sm lab-b')}${T(575, 326, 'Benson', 'sm lab-b')}${T(575, 404, 'stroma', 'sm')}
    ${co2(575, 158, 9)}${ar(p, 'M575,172 L575,236')}${T(548, 164, '3 CO₂', 'sm', 'end')}
    <ellipse class="fc04-grain" cx="640" cy="456" rx="44" ry="28"/><ellipse class="fc04-grain-in" cx="640" cy="456" rx="30" ry="18"/><ellipse class="fc04-grain-in" cx="640" cy="456" rx="16" ry="9"/>
    ${ar(p, 'M604,358 L626,420')}${T(694, 462, 'starch', 'sm lab-b', 'start')}
    ${ar(p, 'M624,262 L712,92', 'clay')}${chip(744, 66, 'fc03-chip fc03-chip-out', 60, 26)}
    ${T(704, 74, 'triose-P to cytosol', 'sm lab-b fc03-out', 'end')}
    </g>`);
}

/* ---------- f · step strip: the bill adds up step by step ---------- */

function runningTotal(): string {
  const p = 'fc04f';
  const rows = [22, 194, 366], H = 156;
  // The trays show the running total as counted tokens; the written totals were the lead's and the step lines'.
  const tray = (y: number, atp: number, nadph: number, fresh = 0): string =>
    `<rect class="fc04-tray" x="520" y="${y + 14}" width="266" height="${H - 28}" rx="16"/>${y === rows[0] ? T(536, y + 40, 'running total', 'tiny', 'start') : ''}
    ${fresh ? `<rect class="fc04-fresh" x="${548 + (atp - fresh) * 26 - 13}" y="${y + 49}" width="${fresh * 26}" height="26" rx="13"/>` : ''}
    ${atp ? dots(548, y + 62, atp, 'atp', 9, 26) : ''}${nadph ? dots(548, y + 96, nadph, 'nadph', 9, 26) : ''}`;
  const step = (k: number, title: string, cost: string, more = ''): string =>
    `<rect class="fc03-panel" x="14" y="${rows[k]}" width="772" height="${H}" rx="18"/>${badge(46, rows[k] + 36, k + 1)}${T(74, rows[k] + 44, title, 'lab lab-b', 'start')}
    ${T(74, rows[k] + 88, cost, 'sm', 'start')}${more ? T(74, rows[k] + 116, more, 'sm', 'start') : ''}`;
  const times = (x: number, y: number, s: string): string => T(x, y, s, 'tiny');
  const [a, b, c] = rows;
  return wrap(p, 'Running total of the cost: fixing 3 CO₂ costs nothing; reducing 6 PGA costs 6 ATP and 6 NADPH; regenerating 3 RuBP costs 3 ATP more, for 9 ATP + 6 NADPH and one net triose phosphate',
    `${step(0, 'Fix 3 CO₂', 'no ATP, no NADPH')}${step(1, 'Reduce 6 PGA', '+ 6 ATP + 6 NADPH')}${step(2, 'Regenerate', '+ 3 ATP')}
    ${pentC(350, a + 86, 20)}${times(350, a + 128, '× 3')}${T(384, a + 94, '+', 'sm lab-b')}${co2(414, a + 86, 8)}${times(414, a + 128, '× 3')}
    ${ar(p, `M440,${a + 86} L462,${a + 86}`)}${chip(488, a + 86, 'fc03-chip', 40, 22)}${times(488, a + 128, '× 6')}
    ${tray(a, 0, 0)}${T(653, a + 88, '0', 'lab lab-b')}
    ${chip(360, b + 86, 'fc03-chip', 40, 22)}${times(360, b + 128, '× 6')}${ar(p, `M386,${b + 86} L460,${b + 86}`, 'ink', 'boost')}
    ${chip(488, b + 86, 'fc03-chip fc03-chip-tp', 40, 22)}${times(488, b + 128, '× 6')}
    ${tray(b, 6, 6, 6)}
    ${chip(360, c + 86, 'fc03-chip fc03-chip-tp', 40, 22)}${times(360, c + 128, '× 5')}${ar(p, `M386,${c + 86} L460,${c + 86}`)}
    ${pentC(488, c + 86, 20)}${times(488, c + 128, '× 3')}
    ${tray(c, 9, 6, 3)}
    ${legend(312, 562)}`);
}

/* ---------- g · pictogram: the bill scales, the mix stays 3 : 2 ---------- */

function scaleUp(): string {
  const p = 'fc04g', base = 470;
  const col = (x: number, atp: number, nadph: number, sum: string, head: string, sub: string): string =>
    `${dots(x - 82, base, atp, 'atp', 3, 24, true)}${dots(x + 26, base, nadph, 'nadph', 3, 24, true)}
    ${T(x, base + 44, sum, 'lab lab-b')}${T(x, base + 76, head, 'sm lab-b')}${T(x, base + 100, sub, 'tiny')}`;
  return wrap(p, 'Pictogram: per CO₂ 3 ATP and 2 NADPH; per triose phosphate 9 and 6; per hexose equivalent 18 and 12. The bill grows but the mix stays 3 : 2',
    `${T(400, 48, 'The mix stays 3 ATP : 2 NADPH', 'lab lab-b')}${legend(300, 88)}
    <g transform="translate(0 34)">
    <path class="fc04-base" d="M40,${base + 14} H760"/>
    ${co2(150, 170, 12)}${T(150, 214, '1 CO₂', 'sm')}
    ${co2(346, 144, 9)}${co2(400, 144, 9)}${co2(454, 144, 9)}${ar(p, 'M400,160 L400,186')}${chip(400, 210, 'fc03-chip fc03-chip-out', 64, 28)}
    ${[0, 1, 2, 3, 4, 5].map(i => co2(600 + (i % 3) * 50, 132 + Math.floor(i / 3) * 30, 8)).join('')}${ar(p, 'M650,176 L650,192')}
    ${chip(616, 214, 'fc03-chip fc03-chip-out', 64, 28)}${chip(684, 214, 'fc03-chip fc03-chip-out', 64, 28)}
    </g>
    ${col(150, 3, 2, '3 + 2', 'per CO₂', '')}
    ${col(400, 9, 6, '9 + 6', 'per triose-P', '3 CO₂')}
    ${col(650, 18, 12, '18 + 12', 'per C₆H₁₂O₆', '6 CO₂ = 2 triose-P')}`);
}

/* ---------- h · analogy: an engine that needs two fuels in a fixed mix ---------- */

function twoFuels(): string {
  const p = 'fc04h';
  const gear = (x: number, y: number, r: number): string => {
    const teeth = Array.from({ length: 10 }, (_, k) =>
      `<rect class="fc04-gear" x="${f1(x - 6)}" y="${f1(y - r - 9)}" width="12" height="14" rx="2" transform="rotate(${k * 36} ${x} ${y})"/>`).join('');
    return `${teeth}<circle class="fc04-gear" cx="${x}" cy="${y}" r="${r}"/><circle class="fc04-hub" cx="${x}" cy="${y}" r="${f1(r * 0.35)}"/>`;
  };
  const real = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle'): string => T(x, y, s, 'sm fc03-map', a);
  return wrap(p, 'Analogy: an engine (the Calvin–Benson cycle) runs on two fuels in a fixed mix, 3 parts fuel A (ATP) to 2 parts fuel B (NADPH), delivered by a filling station (the light reactions); it turns air (CO₂) into bricks (triose phosphate)',
    `<g transform="translate(0 28)">
    <rect class="fc04-station" x="20" y="150" width="150" height="234" rx="16"/>${bolt(p, 64, 70, 92, 150)}
    ${T(95, 210, 'Filling', 'sm lab-b')}${T(95, 234, 'station', 'sm lab-b')}${real(95, 300, '= light')}${real(95, 324, 'reactions')}
    <path class="fc04-pipe fc04-pipe-a" d="M170,228 H420"/><path class="fc04-pipe fc04-pipe-b" d="M170,334 H420"/>
    ${T(296, 210, 'fuel A: 3 parts', 'sm lab-b')}${tag(296, 256, 'ATP', 'atp')}
    ${T(296, 316, 'fuel B: 2 parts', 'sm lab-b')}${tag(296, 362, 'NADPH', 'nadph')}
    <rect class="fc04-engine" x="420" y="170" width="190" height="220" rx="22"/>${gear(515, 270, 42)}
    ${T(515, 364, 'Engine', 'sm lab-b')}${real(515, 420, '= Calvin–Benson cycle')}
    ${co2(470, 104, 9)}${co2(515, 92, 9)}${co2(560, 104, 9)}${ar(p, 'M515,112 L515,164')}${T(500, 64, 'Air in', 'sm lab-b', 'end')}${real(512, 64, '= 3 CO₂', 'start')}
    ${ar(p, 'M612,276 L676,276')}<rect class="fc04-brick" x="684" y="256" width="90" height="40" rx="6"/>${chain(729, 276, 3, 'bead', 7, 20)}
    ${T(729, 228, 'Brick out', 'sm lab-b')}${real(729, 324, '= 1 triose-P')}
    <path class="ar ar-ink dashed" d="M515,436 V470 H95 V392" marker-end="url(#${p}-ink)"/>${T(300, 460, 'empty cans go back', 'sm')}${real(300, 496, '= ADP + Pᵢ, NADP⁺')}
    </g>
    ${T(400, 576, 'If either fuel runs short, the engine stalls', 'sm lab-b')}`);
}

/* ---------- i · mechanism: the light reactions and the cycle trade carriers ---------- */

function twoHalves(): string {
  const p = 'fc04i';
  const lane = (y: number, s: string, k: 'atp' | 'nadph' | 'plain', dir: 1 | -1): string =>
    (dir === 1 ? ar(p, `M244,${y} L450,${y}`) : ar(p, `M450,${y} L244,${y}`, 'ink', 'dashed')) + tag(347, y - 22, s, k);
  return wrap(p, 'The two halves trade: thylakoids use light and water to make ATP and NADPH; the Calvin–Benson cycle in the stroma spends them on CO₂ and returns ADP, Pᵢ and NADP⁺; per 3 CO₂ that is 9 ATP + 6 NADPH for one net triose phosphate',
    `<g transform="translate(0 30)">
    ${T(145, 44, 'Light reactions', 'lab lab-b')}${T(145, 76, 'thylakoids', 'sm')}
    ${T(610, 44, 'Calvin–Benson cycle', 'lab lab-b')}${T(610, 76, 'stroma', 'sm')}
    <rect class="fc04-thylakoid" x="60" y="120" width="170" height="340" rx="40"/>
    ${bolt(p, 30, 96, 76, 170)}${bolt(p, 26, 220, 68, 272)}${T(145, 300, 'PSII, PSI,', 'sm', 'middle')}${T(145, 326, 'ATP synthase', 'sm', 'middle')}
    ${T(145, 514, 'H₂O → O₂', 'sm lab-b')}${ar(p, 'M145,494 L145,466')}
    ${lane(200, 'ATP', 'atp', 1)}${lane(264, 'NADPH', 'nadph', 1)}
    ${lane(350, 'ADP + Pᵢ', 'plain', -1)}${lane(414, 'NADP⁺', 'plain', -1)}
    ${cycleIcon(p, 600, 300, 112)}${T(600, 290, 'fix, reduce,', 'sm')}${T(600, 316, 'regenerate', 'sm')}
    ${co2(600, 136, 10)}${T(642, 142, '3 CO₂', 'sm lab-b', 'start')}${ar(p, 'M600,150 L600,180')}
    ${ar(p, 'M712,330 L760,380', 'clay')}${chip(748, 410, 'fc03-chip fc03-chip-out', 64, 28)}${T(748, 452, '1 triose-P', 'sm lab-b fc03-out')}
    </g>`);
}

/* ---------- j · scope: what the 9 + 6 leaves out ---------- */

function theMinimum(): string {
  const p = 'fc04j';
  const extra = (x: number, y: number, title: string, line: string, icon: string, nadph = false): string =>
    `<rect class="fc04-extra" x="${x - 130}" y="${y - 58}" width="260" height="116" rx="18"/>${icon}${T(x - 74, y - 14, title, 'sm lab-b', 'start')}${T(x - 74, y + 12, line, 'sm', 'start')}` +
    `${T(x - 74, y + 46, '+', 'sm lab-b', 'start')}${mini(x - 30, y + 40, 'atp')}${nadph ? mini(x + 46, y + 40, 'nadph') : ''}`;
  const funnel = (x: number, y: number): string => `<path class="fc04-pump" d="M${x - 16},${y - 14} H${x + 16} L${x + 4},${y + 2} V${y + 16} H${x - 4} V${y + 2} Z"/>`;
  return wrap(p, 'Scope of the count: 9 ATP + 6 NADPH per 3 CO₂ is the minimum for the canonical cycle. Photorespiration, CO₂-concentrating mechanisms, making sucrose and starch, and keeping Rubisco active cost extra',
    `<g transform="translate(0 -4)">
    <rect class="fc04-bound" x="230" y="210" width="340" height="190" rx="26"/>${T(250, 240, 'counted here', 'sm fc03-acc', 'start')}
    ${cycleIcon(p, 326, 318, 58)}${T(326, 314, 'Calvin–', 'sm lab-b')}${T(326, 338, 'Benson', 'sm lab-b')}
    ${tag(480, 290, '9 ATP', 'atp')}${tag(480, 336, '6 NADPH', 'nadph')}${T(480, 382, 'per 3 CO₂', 'tiny')}
    ${extra(150, 112, 'photorespiration', 'Rubisco adds O₂', molecule(42, 98, 'OO', 9), true)}
    ${extra(650, 112, 'C₄ and CAM', 'concentrate CO₂', funnel(548, 98))}
    ${extra(150, 496, 'sucrose, starch', 'making them', hexa(46, 482, 14))}
    ${extra(650, 496, 'Rubisco activase', 'keeps it active', `<rect class="node node-rub" x="526" y="470" width="44" height="24" rx="6"/>`)}
    </g>`);
}
