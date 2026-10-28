// Slide C03 · Reduction and regeneration keep the cycle running. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// Checked facts only (research/review-2026-10-23-claude/D_C01-C06.md, claims 15, 16, 22–29; REVIEW_SUMMARY.md):
// 3 CO₂ + 3 RuBP → 6 3-PGA (15 C + 3 C = 18 C; carboxylation itself uses no ATP or NADPH);
// 6 PGA + 6 ATP + 6 NADPH → 6 triose phosphate (ATP phosphorylates, NADPH reduces: the step where carbon is reduced);
// 5 triose-P (15 C) + 3 ATP → 3 RuBP; 1 triose-P leaves; exporting all six would empty the RuBP pool.
// Light-off transient (PGA rises, RuBP falls): D story S1, via the Bassham 2003 retrospective; drawn as a schematic.
// Words: "triose phosphate" or GAP, never "G3P"; no free 6-C intermediate; no individual carbon positions.
// Vocabulary: carbon = dark bead, carbon arriving as CO₂ = hollow bead, RuBP = pentagon (the thesis symbol),
// ATP / NADPH = orange / blue tags, Pᵢ = orange ball, the exported triose = clay. The helpers below are shared with C04.
import type { PlateText, Variant } from '../types';
import { arrow, type Ink } from '../mechanisms';
import { illusHeads, molecule, tag } from '../illus';
import './c03.css';

export const PLATE: PlateText = {
  n: 'C3',
  title: 'Reduction and regeneration keep the cycle running',
  status: 'draft',
  lead: '3-PGA is reduced to triose phosphate, using ATP and NADPH. Five of every six trioses rebuild RuBP; one leaves the cycle.',
  points: [
    { claim: 'Reduction makes triose phosphate.', text: '6 × 3-PGA + 6 ATP + 6 NADPH → 6 triose-P: ATP adds phosphate, NADPH electrons.' },
    { claim: 'Regeneration rebuilds RuBP.', text: 'Five triose-P (15 C) are rearranged into 3 RuBP (3 × 5 C), using 3 more ATP.' },
    { claim: 'Only one triose in six leaves.', text: 'Exporting more would drain RuBP and stall the cycle.' },
  ],
  refs: [
    { label: 'Bassham et al. 1954', url: 'https://doi.org/10.1021/ja01636a012' },
    { label: 'Sharkey 2024', url: 'https://doi.org/10.1093/plphys/kiad601' },
    { label: 'von Caemmerer et al. 2025', url: 'https://doi.org/10.1007/s00425-025-04834-7' },
    { label: 'Raines 2022', url: 'https://doi.org/10.1111/nph.18394' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Thesis scheme' },
  { id: 'b', name: 'Carbon wheel', anim: true },
  { id: 'c', name: 'Carbon count' },
  { id: 'd', name: 'Seed grain' },
  { id: 'e', name: 'Molecule zoom' },
  { id: 'f', name: 'Keep vs export' },
  { id: 'g', name: 'Four steps', anim: true },
  { id: 'h', name: 'Light-off test', anim: true },
  { id: 'i', name: 'Sum of steps' },
  { id: 'j', name: 'Five plus one' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return wheel();
    case 'c': return countChart();
    case 'd': return seedGrain();
    case 'e': return moleculeZoom();
    case 'f': return keepVsExport();
    case 'g': return fourSteps();
    case 'h': return lightOff();
    case 'i': return sumOfSteps();
    case 'j': return sixFiveOne();
    default: return scheme('fc03a', 'count');
  }
}

/* ---------- shared parts (also used by C04) ---------- */

export const f1 = (v: number): string => v.toFixed(1);
type Anchor = 'start' | 'middle' | 'end';

/** Subscript digits as smaller, lowered digits: the figure font has no subscript glyphs. */
export const chem = (s: string): string =>
  s.replace(/[₀-₉]+/g, m => `<tspan class="fc03-sb">${[...m].map(d => d.charCodeAt(0) - 0x2080).join('')}</tspan>`);

export const T = (x: number, y: number, s: string, cls = 'sm', a: Anchor = 'middle'): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${a}">${chem(s)}</text>`;

export const wrap = (p: string, label: string, body: string, cls = 'fc03'): string =>
  `<svg class="fig-svg ${cls}" viewBox="0 0 800 600" role="img" aria-label="${label}">${illusHeads(p)}${body}</svg>`;

export const ar = (p: string, d: string, ink: Ink = 'ink', extra = ''): string => arrow(p, ink, d, extra);

/** A carbon skeleton: n beads on a bond. */
export function chain(x: number, y: number, n: number, cls = 'bead', r = 7, gap = 18): string {
  const x0 = x - ((n - 1) * gap) / 2;
  const bond = n > 1 ? `<path class="fc03-bond" d="M${f1(x0)},${f1(y)} H${f1(x0 + (n - 1) * gap)}"/>` : '';
  return bond + Array.from({ length: n }, (_, i) => `<circle class="${cls}" cx="${f1(x0 + i * gap)}" cy="${f1(y)}" r="${r}"/>`).join('');
}

/** A three-carbon molecule (PGA or triose-P) as a rounded chip carrying its three beads. */
export const chip = (x: number, y: number, cls = 'fc03-chip', w = 60, h = 26): string =>
  `<rect class="${cls}" x="${f1(x - w / 2)}" y="${f1(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}"/>${chain(x, y, 3, 'bead', h * 0.21, w * 0.27)}`;

/** RuBP as the thesis draws it: a pentagon, optionally labelled. */
export function pent(x: number, y: number, r: number, label = '', cls = 'node node-rubp', lcls = 'sm lab-b'): string {
  const pts = Array.from({ length: 5 }, (_, k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    return `${f1(x + r * Math.cos(a))},${f1(y + r * Math.sin(a))}`;
  }).join(' ');
  return `<polygon class="${cls}" points="${pts}"/>${label ? T(x, y + 8, label, lcls) : ''}`;
}

/** RuBP pentagon carrying its five carbons as a short chain (RuBP is not a ring; the pentagon is only its symbol). */
export const pentC = (x: number, y: number, r: number, cls = 'node node-rubp'): string =>
  pent(x, y, r, '', cls) + chain(x, y + r * 0.12, 5, 'bead', r * 0.13, r * 0.31);

export const co2 = (x: number, y: number, r = 10): string => molecule(x, y, 'OCO', r);

/** A numbered badge for step panels. */
export const badge = (x: number, y: number, n: number | string): string =>
  `<circle class="num" cx="${x}" cy="${y}" r="17"/><text class="num-t" x="${x}" y="${y + 6}" text-anchor="middle">${n}</text>`;

/** A curly brace from y0 to y1 at x; its tip points right (dir 1) or left (dir -1). */
export function brace(x: number, y0: number, y1: number, dir: 1 | -1, cls = 'fc03-br'): string {
  const w = 12 * dir, m = (y0 + y1) / 2;
  return `<path class="${cls}" d="M${x},${y0} q${w},0 ${w},12 V${m - 12} q0,12 ${w},12 q${-w},0 ${-w},12 V${y1 - 12} q0,12 ${-w},12"/>`;
}

/** A small ATP or NADPH tag for counting. */
export function mini(x: number, y: number, k: 'atp' | 'nadph'): string {
  const w = k === 'atp' ? 50 : 72;
  return `<rect class="tag-${k}" x="${f1(x - w / 2)}" y="${f1(y - 13)}" width="${w}" height="26" rx="8"/>${T(x, y + 6, k === 'atp' ? 'ATP' : 'NADPH', 'fc03-mt')}`;
}

/** A rounded pill with a label. */
export const pill = (x: number, y: number, w: number, s: string, cls = 'node', h = 44, lcls = 'sm lab-b'): string =>
  `<rect class="${cls}" x="${f1(x - w / 2)}" y="${f1(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}"/>${T(x, y + 8, s, lcls)}`;

/** A small sun: marks an enzyme that light switches on (thioredoxin; slide C1). */
export const lit = (x: number, y: number, r = 5): string =>
  `<path class="f2-ray" d="${Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `M${f1(x + Math.cos(a) * (r + 2.5))},${f1(y + Math.sin(a) * (r + 2.5))}L${f1(x + Math.cos(a) * (r + 6))},${f1(y + Math.sin(a) * (r + 6))}`; }).join('')}"/><circle class="f2-sun" cx="${x}" cy="${y}" r="${r}"/>`;

/* ---------- a · the thesis scheme (MSc thesis Fig. 2b), photorespiration removed; shared with C04 a ---------- */

export function scheme(p: string, mode: 'count' | 'cost'): string {
  const X = 360, cnt = mode === 'count';
  const core = `
    <rect class="node node-rub" x="${X - 64}" y="506" width="128" height="44" rx="14"/>${T(X, 535, 'RuBisCO', 'sm lab-b')}
    ${pent(X, 452, 40)}${T(X, 454, 'RuBP', 'sm lab-b')}${T(X, 474, '5 C', 'tiny')}
    ${co2(120, 568)}${co2(175, 568)}${co2(230, 568)}${ar(p, 'M262,562 L292,546')}
    ${T(175, 538, '3 CO₂', 'sm lab-b')}
    ${ar(p, `M${X},410 L${X},366`)}${T(X - 14, 396, 'carboxylation', 'sm lab-b fc03-acc', 'end')}
    ${pill(X, 340, 150, '6 × 3-PGA')}
    ${ar(p, `M${X},316 L${X},208`, 'ink', 'boost')}${T(X - 14, 268, 'reduction', 'sm lab-b fc03-acc', 'end')}
    ${tag(X + 66, 246, '6 ATP', 'atp')}${tag(X + 82, 290, '6 NADPH', 'nadph')}
    ${pill(X, 182, 150, '6 triose-P')}
    <path class="ar ar-ink" d="M285,182 C160,182 112,330 140,402 S286,468 318,454" marker-end="url(#${p}-ink)"/>
    ${cnt ? `${T(160, 72, 'regeneration', 'sm lab-b fc03-acc')}${T(160, 98, '5 of 6', 'sm')}` : `${T(186, 122, 'regeneration', 'sm lab-b fc03-acc')}${T(186, 148, '5 of 6', 'sm')}`}
    ${tag(126, 318, '3 ATP', 'atp')}
    ${ar(p, `M${X + 76},166 L${X + 150},120`)}`;
  if (cnt) {
    return wrap(p, 'Calvin–Benson cycle in the thesis style: 3 CO₂ and 3 RuBP give 6 PGA, reduced by ATP and NADPH to 6 triose phosphates; 5 regenerate RuBP and 1 leaves. Braces count the carbon: 15 + 3 = 18 = 6 × 3.',
      `<g transform="translate(0 -36)">${core}
      ${T(X + 48, 460, '× 3', 'sm lab-b', 'start')}
      ${pill(604, 100, 176, '1 of 6 leaves', 'node node-out')}
      ${brace(520, 160, 364, 1)}${T(546, 254, '6 × 3 C', 'lab lab-b', 'start')}${T(546, 290, '= 18 C', 'lab lab-b', 'start')}
      ${brace(470, 410, 584, 1)}${T(496, 488, '15 C + 3 C', 'lab lab-b', 'start')}${T(496, 524, '= 18 C', 'lab lab-b', 'start')}
      ${lit(X - 106, 291)}${T(X - 14, 298, 'GAPDH', 'sm', 'end')}
      ${lit(50, 124)}${T(70, 131, 'FBPase · SBPase · PRK', 'sm', 'start')}${T(70, 155, 'TPI acts here too', 'tiny', 'start')}</g>
      ${lit(26, 588)}${T(44, 594, 'switched on by light', 'tiny', 'start')}`);
  }
  // The total per 3 CO₂ (9 ATP + 6 NADPH) is the C4 lead's, so the figure shows only what each step costs.
  return wrap(p, 'Calvin–Benson cycle in the thesis style with its costs: carboxylation needs no ATP or NADPH, reduction 6 ATP + 6 NADPH, regeneration 3 ATP; one net triose phosphate leaves for sucrose and starch.',
    `<g transform="translate(-22 0)">${core}
    ${T(X + 14, 394, 'no ATP, no NADPH', 'tiny', 'start')}
    ${pill(614, 108, 200, '1 net triose-P', 'node node-out')}
    ${ar(p, 'M578,84 L556,58')}${ar(p, 'M650,84 L672,58')}
    ${pill(538, 34, 116, 'sucrose', 'node', 40)}${pill(702, 34, 104, 'starch', 'node', 40)}</g>`, 'fc03');
}

/* ---------- b · carbon wheel (an animation storyboard: beads move round; this is its last frame) ---------- */

function wheel(): string {
  const p = 'fc03b', cx = 380, cy = 318, rx = 230, ry = 196;
  const at = (deg: number): [number, number] => [cx + rx * Math.cos((deg * Math.PI) / 180), cy + ry * Math.sin((deg * Math.PI) / 180)];
  const arc = (a: number, b: number): string => {
    const [xa, ya] = at(a), [xb, yb] = at(b);
    return ar(p, `M${f1(xa)},${f1(ya)} A${rx},${ry} 0 0 1 ${f1(xb)},${f1(yb)}`);
  };
  /** n molecules of k carbons in a box; three-carbon ones in two columns. */
  const box = (x: number, y: number, w: number, k: number, n: number, label: string): string => {
    const rows = k === 5 ? n : Math.ceil(n / 2);
    const beads = Array.from({ length: n }, (_, i) => {
      const bx = k === 5 ? x : x + (i % 2 ? 38 : -38), by = y - 34 + (k === 5 ? i : Math.floor(i / 2)) * 26;
      return chain(bx, by, k, 'bead', 7, 18);
    }).join('');
    return `<rect class="node" x="${x - w / 2}" y="${y - 58}" width="${w}" height="${36 + rows * 26 + 28}" rx="18"/>${beads}${T(x, y - 34 + rows * 26 + 14, label, 'sm lab-b')}`;
  };
  const [rx1, ry1] = at(225), [rx2, ry2] = at(315), [rx3, ry3] = at(135);
  return wrap(p, 'Carbon wheel: 3 RuBP (15 C) plus 3 CO₂ give 6 PGA (18 C); reduction with 6 ATP and 6 NADPH gives 6 triose phosphates; 1 leaves and 5 regenerate 3 RuBP with 3 ATP',
    `<ellipse class="fc03-track" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>
    ${arc(206, 244)}${arc(296, 334)}${arc(26, 64)}${arc(116, 154)}
    ${box(150, cy, 140, 5, 3, '3 RuBP')}
    ${box(cx, 122, 170, 3, 6, '6 PGA')}
    ${box(610, cy, 170, 3, 6, '6 triose-P')}
    ${box(cx, 514, 170, 3, 5, '5 triose-P')}
    <rect class="node node-rub" x="${f1(rx1 - 58)}" y="${f1(ry1 - 20)}" width="116" height="40" rx="12"/>${T(rx1, ry1 + 8, 'RuBisCO', 'sm lab-b')}
    ${pill(rx2, ry2, 140, 'reduction', 'node fc03-phase', 40)}
    ${pill(rx3, ry3, 160, 'regeneration', 'node fc03-phase', 40)}
    ${T(62, 118, '3 CO₂', 'sm lab-b')}${co2(62, 150, 10)}${co2(62, 186, 10)}${co2(62, 222, 10)}
    ${ar(p, `M92,186 L${f1(rx1 - 64)},${f1(ry1 + 4)}`)}
    ${tag(684, 146, '6 ATP', 'atp')}${tag(694, 194, '6 NADPH', 'nadph')}
    ${tag(130, 524, '3 ATP', 'atp')}
    ${T(582, 474, '5 stay', 'sm lab-b', 'start')}
    ${ar(p, 'M697,318 L724,318')}${chip(760, 318, 'fc03-chip fc03-chip-out', 62, 28)}
    ${T(760, 286, '1 out', 'sm lab-b fc03-out')}
    ${T(cx, 314, '15 + 3 = 18', 'pl')}
    ${T(cx, 352, '= 6 × 3', 'lab lab-b')}
    ${lit(424, 236)}${T(444, 243, 'GAPDH', 'sm', 'start')}
    ${lit(246, 404)}${T(266, 411, 'FBPase · SBPase · PRK', 'sm', 'start')}${T(266, 435, 'TPI acts here too', 'tiny', 'start')}
    ${lit(26, 588)}${T(44, 594, 'switched on by light', 'tiny', 'start')}`);
}

/* ---------- c · carbon count: each row is the cycle's 18 carbons, regrouped ---------- */

function countChart(): string {
  const p = 'fc03c', x0 = 200, u = 30, X = (i: number): number => x0 + i * u;
  const rows = [130, 240, 350, 470];
  /** A molecule of n carbons starting at carbon slot a. */
  const grp = (a: number, n: number, y: number, cls: string, bead = 'bead'): string =>
    `<rect class="${cls}" x="${X(a) + 3}" y="${y - 17}" width="${n * u - 6}" height="34" rx="17"/>` +
    Array.from({ length: n }, (_, i) => `<circle class="${bead}" cx="${X(a + i) + u / 2}" cy="${y}" r="8"/>`).join('') +
    (n > 1 ? `<path class="fc03-bond" d="M${X(a) + u / 2},${y} H${X(a + n - 1) + u / 2}"/>` : '');
  const bondFirst = (s: string): string => s.replace(/(<rect[^>]*\/>)((?:<circle[^>]*\/>)+)(<path[^>]*\/>)?/g, '$1$3$2');
  const g = (a: number, n: number, y: number, cls = 'fc03-grp', bead = 'bead'): string => bondFirst(grp(a, n, y, cls, bead));
  const ticks = Array.from({ length: 7 }, (_, k) => k * 3).map(k =>
    `<line class="tick" x1="${X(k)}" y1="62" x2="${X(k)}" y2="70"/>${T(X(k), 50, `${k}`, 'tl')}<path class="guide" d="M${X(k)},76 V${rows[3] + 26}"/>`).join('');
  return wrap(p, 'Carbon count: every row holds the same 18 carbons. 3 RuBP (15 C) + 3 CO₂ (3 C) regroup into 6 PGA, are reduced to 6 triose phosphates, then 15 C rebuild 3 RuBP and 3 C leave',
    `<path class="axis" d="M${X(0)},66 H${X(18)}"/>${ticks}${T(X(0) - 16, 24, 'carbon atoms', 'tl', 'start')}
    <path class="fc03-split" d="M${X(15)},76 V${rows[3] + 34}"/>
    ${g(0, 5, rows[0])}${g(5, 5, rows[0])}${g(10, 5, rows[0])}
    ${[15, 16, 17].map(i => g(i, 1, rows[0], 'fc03-grp fc03-grp-co2', 'bead bead-co2')).join('')}
    ${[0, 3, 6, 9, 12, 15].map(a => g(a, 3, rows[1])).join('')}
    ${[0, 3, 6, 9, 12, 15].map(a => g(a, 3, rows[2], 'fc03-grp fc03-grp-tp')).join('')}
    ${g(0, 5, rows[3])}${g(5, 5, rows[3])}${g(10, 5, rows[3])}${g(15, 3, rows[3], 'fc03-grp fc03-grp-out')}
    ${T(164, rows[0] - 4, '3 RuBP', 'sm lab-b', 'end')}${T(164, rows[0] + 22, '+ 3 CO₂', 'sm lab-b', 'end')}
    ${T(164, rows[1] + 8, '6 × 3-PGA', 'sm lab-b', 'end')}
    ${T(164, rows[2] + 8, '6 triose-P', 'sm lab-b', 'end')}
    ${T(164, rows[3] - 4, '3 RuBP', 'sm lab-b', 'end')}${T(164, rows[3] + 22, '+ 1 out', 'sm lab-b fc03-out', 'end')}
    ${ar(p, `M${X(9)},${rows[0] + 22} V${rows[1] - 24}`)}${T(X(9) + 14, 192, 'RuBisCO', 'sm', 'start')}
    ${ar(p, `M${X(9)},${rows[1] + 22} V${rows[2] - 24}`)}${T(X(9) - 14, 302, 'reduction', 'sm', 'end')}${tag(X(9) + 62, 296, '6 ATP', 'atp')}${tag(X(9) + 176, 296, '6 NADPH', 'nadph')}
    ${ar(p, `M${X(7.5)},${rows[2] + 22} V${rows[3] - 24}`)}${T(X(7.5) - 14, 418, 'regeneration', 'sm', 'end')}${tag(X(7.5) + 58, 412, '3 ATP', 'atp')}
    ${ar(p, `M${X(16.5)},${rows[2] + 22} V${rows[3] - 24}`)}${T(X(16.5) + 14, 418, 'leaves', 'sm fc03-out', 'start')}
    <path class="ar ar-ink" d="M${X(0) - 2},${rows[3]} C182,${rows[3]} 180,${rows[3] - 14} 180,${rows[3] - 34} V${rows[0] + 20} C180,${rows[0] + 4} 184,${rows[0]} ${X(0) - 4},${rows[0]}" marker-end="url(#${p}-ink)"/>
    ${T(X(9), 562, '15 + 3 = 18 = 6 × 3', 'lab lab-b')}`);
}

/* ---------- d · analogy: keep back the seed grain ---------- */

function seedGrain(): string {
  const p = 'fc03d';
  const sack = (x: number, y: number, cls = 'fc03-sack'): string =>
    `<path class="${cls}" d="M${x - 7},${y - 12} C${x - 19},${y - 6} ${x - 21},${y + 6} ${x - 19},${y + 15} Q${x - 18},${y + 22} ${x - 10},${y + 22} H${x + 10} Q${x + 18},${y + 22} ${x + 19},${y + 15} C${x + 21},${y + 6} ${x + 19},${y - 6} ${x + 7},${y - 12} Z"/>` +
    `<path class="${cls}" d="M${x - 6},${y - 13} L${x - 12},${y - 25} Q${x - 6},${y - 21} ${x},${y - 25} Q${x + 6},${y - 21} ${x + 12},${y - 25} L${x + 6},${y - 13} Z"/>` +
    `<path class="fc03-tie" d="M${x - 8},${y - 13} H${x + 8}"/>`;
  const sprout = (x: number, y: number): string =>
    `<path class="fc03-sprout" d="M${x},${y} V${y - 22} M${x},${y - 10} q-9,-3 -12,-13 M${x},${y - 14} q9,-3 12,-13"/>`;
  const real = (x: number, y: number, s: string, a: Anchor = 'middle'): string => T(x, y, s, 'sm fc03-map', a);
  return wrap(p, 'Analogy: a farmer sows 5 sacks of seed grain, harvests 6, keeps 5 as seed and sells 1. Seed grain stands for RuBP, growth for CO₂ fixation, fuel and work for ATP and NADPH, the sold sack for the exported triose phosphate',
    `<g transform="translate(0 40)">
    ${[[96, 122], [146, 122], [196, 122], [121, 164], [171, 164]].map(([x, y]) => sack(x, y)).join('')}
    ${T(146, 222, 'Seed: 5 sacks', 'sm lab-b')}${real(146, 248, '= 3 RuBP (15 C)')}
    ${ar(p, 'M246,146 L404,146')}${T(325, 132, 'sow', 'sm')}
    <rect class="fc03-soil" x="414" y="128" width="236" height="56" rx="12"/>
    ${[440, 476, 512, 548, 584, 620].map(x => sprout(x, 172)).join('')}
    ${co2(470, 70, 9)}${co2(560, 54, 9)}${co2(640, 76, 9)}
    ${ar(p, 'M470,84 L478,112', 'ink', 'fc03-thin')}${ar(p, 'M560,68 L556,112', 'ink', 'fc03-thin')}${ar(p, 'M636,90 L626,112', 'ink', 'fc03-thin')}
    ${T(532, 222, 'Growth: + 1 sack', 'sm lab-b')}${real(532, 248, '= RuBisCO fixes 3 CO₂')}
    ${ar(p, 'M532,264 L532,336')}
    ${T(552, 290, 'fuel and work', 'sm', 'start')}${real(552, 316, '= ATP + NADPH', 'start')}
    ${[[482, 372], [532, 372], [582, 372], [482, 416], [532, 416]].map(([x, y]) => sack(x, y)).join('')}${sack(582, 416, 'fc03-sack fc03-sack-out')}
    ${T(532, 472, 'Harvest: 6 sacks', 'sm lab-b')}${real(532, 498, '= 6 triose-P (18 C)')}
    ${ar(p, 'M612,416 L676,416')}
    <rect class="fc03-cart" x="684" y="384" width="80" height="42" rx="6"/><circle class="fc03-wheel" cx="702" cy="436" r="11"/><circle class="fc03-wheel" cx="746" cy="436" r="11"/>
    ${sack(724, 378, 'fc03-sack fc03-sack-out')}
    ${T(724, 480, 'Sell 1', 'sm lab-b fc03-out')}${real(724, 506, '= 1 leaves')}
    <path class="ar ar-ink" d="M452,394 H170 Q136,394 136,360 V266" marker-end="url(#${p}-ink)"/>
    ${T(300, 380, 'Keep 5 as seed', 'sm lab-b')}${real(300, 424, '= 5 triose-P rebuild RuBP')}${tag(300, 458, '3 ATP', 'atp')}
    </g>`);
}

/* ---------- e · zoom: from the cycle to the carbon that is reduced ---------- */

function moleculeZoom(): string {
  const p = 'fc03e';
  /** PGA or triose phosphate (GAP) as atom balls; C1 on the left carries the group that changes. */
  const mol = (cx: number, y: number, kind: 'pga' | 'gap'): string => {
    const c1 = cx - 70, c3 = cx + 70;
    const bonds = `<path class="fc03-mb" d="M${c1},${y} H${c3 + 104} M${cx},${y} V${y + 46} M${cx},${y} V${y - 44} M${c3},${y} L${c3 - 14},${y - 42} M${c3},${y} L${c3 + 14},${y - 42}
      M${c1 - 6},${y - 4} L${c1 - 40},${y - 40} M${c1 + 4},${y - 10} L${c1 - 30},${y - 46} M${c1},${y} L${c1 - 34},${y + 40} M${cx},${y + 50} L${cx + 20},${y + 64}"/>`;
    const at = (x: number, yy: number, e: 'C' | 'O' | 'H', r: number): string =>
      `<circle class="atom atom-${e}" cx="${f1(x)}" cy="${f1(yy)}" r="${r}"/><text class="atom-t atom-t-${e}" x="${f1(x)}" y="${f1(yy + r * 0.42)}" text-anchor="middle">${e}</text>`;
    return `${bonds}
      ${at(c1 - 38, y - 46, 'O', 13)}${kind === 'pga' ? `${at(c1 - 36, y + 44, 'O', 13)}${T(c1 - 14, y + 62, '–', 'sm lab-b')}` : at(c1 - 32, y + 40, 'H', 8)}
      ${at(cx, y - 46, 'H', 8)}${at(cx, y + 48, 'O', 13)}${at(cx + 22, y + 66, 'H', 8)}
      ${at(c3 - 16, y - 46, 'H', 8)}${at(c3 + 16, y - 46, 'H', 8)}${at(c3 + 50, y, 'O', 13)}
      <circle class="tag-pi" cx="${c3 + 104}" cy="${y}" r="18"/>${T(c3 + 104, y + 7, 'P', 'tag-t')}
      ${at(c1, y, 'C', 15)}${at(cx, y, 'C', 15)}${at(c3, y, 'C', 15)}
      <ellipse class="fc03-hl" cx="${c1 - 20}" cy="${y}" rx="42" ry="70"/>`;
  };
  const cx0 = 140, cy0 = 300, r0 = 76;
  const pt = (deg: number, r = r0): [number, number] => [cx0 + r * Math.cos((deg * Math.PI) / 180), cy0 + r * Math.sin((deg * Math.PI) / 180)];
  const arcP = (a: number, b: number): string => { const [xa, ya] = pt(a), [xb, yb] = pt(b); return `M${f1(xa)},${f1(ya)} A${r0},${r0} 0 0 1 ${f1(xb)},${f1(yb)}`; };
  const [lx, ly] = pt(-30);
  return wrap(p, 'Zoom from the cycle into one reduction step: ATP adds a phosphate and NADPH adds electrons, turning the carboxyl end of 3-PGA into the aldehyde end of triose phosphate (GAP)',
    `<path class="fc03-ring" d="${arcP(150, 250)}" marker-end="url(#${p}-ink)"/><path class="fc03-ring fc03-ring-hl" d="${arcP(270, 10)}" marker-end="url(#${p}-clay)"/><path class="fc03-ring" d="${arcP(30, 130)}" marker-end="url(#${p}-ink)"/>
    ${T(cx0 - r0 - 6, cy0 - 64, 'fix', 'sm', 'end')}${T(cx0 + 30, cy0 - r0 - 16, 'reduce', 'sm lab-b fc03-acc', 'start')}${T(cx0, cy0 + r0 + 34, 'regenerate', 'sm')}
    ${T(cx0, cy0 + 8, 'cycle', 'sm')}
    <circle class="fc03-lens" cx="${f1(lx)}" cy="${f1(ly)}" r="24"/>
    <path class="fc03-zoom" d="M${f1(lx + 18)},${f1(ly - 16)} L300,24 M${f1(lx + 16)},${f1(ly + 18)} L300,586"/>
    <rect class="fc03-panel" x="300" y="24" width="488" height="562" rx="22"/>
    ${T(552, 64, '3-PGA', 'lab lab-b')}
    ${mol(552, 150, 'pga')}${T(404, 136, 'carboxyl', 'sm lab-b', 'end')}${T(404, 162, '–COO⁻', 'sm', 'end')}
    ${ar(p, 'M552,236 L552,350', 'ink', 'boost')}
    ${tag(612, 268, 'ATP', 'atp')}${T(652, 275, 'adds a P', 'sm', 'start')}
    ${tag(624, 318, 'NADPH', 'nadph')}${T(676, 325, 'adds e⁻', 'sm', 'start')}
    ${T(536, 284, 'this carbon', 'sm', 'end')}${T(536, 310, 'is reduced', 'sm lab-b fc03-acc', 'end')}
    ${mol(552, 440, 'gap')}${T(404, 426, 'aldehyde', 'sm lab-b', 'end')}${T(404, 452, '–CHO', 'sm', 'end')}
    ${T(552, 556, 'triose phosphate (GAP)', 'lab lab-b')}
    ${T(612, 368, 'Pᵢ released', 'sm', 'start')}`);
}

/* ---------- f · with and without: keep five, or export all six ---------- */

function keepVsExport(): string {
  const p = 'fc03f';
  const tick = (x: number, y: number): string => `<path class="fc03-ok" d="M${x - 12},${y} l8,9 l16,-18"/>`;
  const cross = (x: number, y: number): string => `<path class="fc03-no" d="M${x - 11},${y - 11} l22,22 M${x + 11},${y - 11} l-22,22"/>`;
  const panel = (ox: number, keep: boolean): string => {
    const cx = ox + 190;
    const chips = [0, 1, 2, 3, 4, 5].map(i => chip(cx - 70 + (i % 3) * 70, 126 + Math.floor(i / 3) * 34, !keep || i === 5 ? 'fc03-chip fc03-chip-out' : 'fc03-chip', 60, 26)).join('');
    return `<rect class="fc03-panel" x="${ox}" y="10" width="380" height="580" rx="22"/>
      ${T(cx, 56, keep ? 'Keep 5, export 1' : 'Export all 6', 'lab lab-b')}
      ${T(cx, 98, '6 triose-P', 'sm')}${chips}
      ${keep ? `${ar(p, `M${cx + 104},160 L${ox + 362},160`)}${T(ox + 330, 198, '1 out', 'sm lab-b fc03-out')}`
        : `${ar(p, `M${cx + 104},143 L${ox + 362},143`, 'clay', 'boost')}${T(ox + 330, 198, '6 out', 'sm lab-b fc03-out')}`}
      ${keep ? `${ar(p, `M${cx - 30},178 L${cx - 30},256`)}${T(cx - 42, 224, 'regenerate', 'sm', 'end')}${tag(cx + 30, 218, '3 ATP', 'atp')}`
        : `<path class="fc03-gone-ar" d="M${cx - 30},178 L${cx - 30},256"/>${T(cx - 42, 224, 'nothing left', 'sm', 'end')}`}
      ${[-80, 0, 80].map(dx => keep ? pentC(cx + dx, 300, 34) : pent(cx + dx, 300, 34, '', 'fc03-ghost')).join('')}
      ${T(cx, 362, keep ? '3 RuBP rebuilt' : 'no RuBP', 'sm lab-b')}
      ${keep ? ar(p, `M${cx},372 L${cx},406`) : ''}
      <rect class="node node-rub" x="${cx - 70}" y="410" width="140" height="44" rx="14"/>${T(cx, 439, 'RuBisCO', 'sm lab-b')}
      ${co2(ox + 54, 402, 9)}${co2(ox + 54, 432, 9)}${co2(ox + 54, 462, 9)}
      ${keep ? ar(p, `M${ox + 82},432 L${cx - 76},432`) : `<path class="fc03-gone-ar" d="M${ox + 82},432 L${cx - 80},432"/>`}
      ${keep ? `${tick(cx - 112, 530)}${T(cx - 84, 538, '3 CO₂ fixed again', 'sm lab-b', 'start')}`
        : `${cross(cx - 82, 530)}${T(cx - 58, 538, 'no CO₂ fixed', 'sm lab-b', 'start')}`}`;
  };
  return wrap(p, 'With and without regeneration: keeping 5 of 6 triose phosphates rebuilds 3 RuBP so RuBisCO can fix the next 3 CO₂; exporting all 6 leaves no RuBP and fixation stops',
    `${panel(10, true)}${panel(410, false)}`);
}

/* ---------- g · four steps, arranged as a loop of panels ---------- */

function fourSteps(): string {
  const p = 'fc03g', W = 370, H = 270;
  const P: Array<[number, number]> = [[10, 10], [420, 10], [420, 320], [10, 320]];
  const frame = (k: number, title: string): string => {
    const [ox, oy] = P[k];
    return `<rect class="fc03-panel" x="${ox}" y="${oy}" width="${W}" height="${H}" rx="20"/>${badge(ox + 32, oy + 34, k + 1)}${T(ox + 60, oy + 42, title, 'lab lab-b', 'start')}`;
  };
  const six = (x: number, y: number, cls = 'fc03-chip', w = 50): string =>
    [0, 1, 2, 3, 4, 5].map(i => chip(x + (i % 2) * (w + 8), y + Math.floor(i / 2) * 30, cls, w, 22)).join('');
  const [a, b, c, d] = P;
  return wrap(p, 'Four steps in a loop: 1 RuBisCO adds 3 CO₂ to 3 RuBP, giving 6 PGA; 2 reduce them with 6 ATP and 6 NADPH to 6 triose phosphates; 3 one leaves and five stay; 4 the five rebuild 3 RuBP with 3 ATP',
    `${frame(0, 'Fix')}${frame(1, 'Reduce')}${frame(2, 'Split')}${frame(3, 'Regenerate')}
    ${[0, 1, 2].map(i => pentC(a[0] + 40 + i * 42, a[1] + 120, 19)).join('')}${T(a[0] + 82, a[1] + 186, '3 RuBP', 'sm')}
    ${T(a[0] + 154, a[1] + 129, '+', 'lab')}${co2(a[0] + 190, a[1] + 92, 8)}${co2(a[0] + 190, a[1] + 120, 8)}${co2(a[0] + 190, a[1] + 148, 8)}${T(a[0] + 190, a[1] + 186, '3 CO₂', 'sm')}
    ${ar(p, `M${a[0] + 218},${a[1] + 120} L${a[0] + 256},${a[1] + 120}`)}${six(a[0] + 284, a[1] + 90, 'fc03-chip', 34)}
    ${T(a[0] + 305, a[1] + 186, '6 PGA', 'sm')}
    ${T(a[0] + W / 2, a[1] + 236, '15 C + 3 C = 18 C', 'sm lab-b')}
    ${six(b[0] + 30, b[1] + 92, 'fc03-chip', 34)}${T(b[0] + 51, b[1] + 186, '6 PGA', 'sm')}
    ${tag(b[0] + 182, b[1] + 92, '6 ATP', 'atp')}${tag(b[0] + 182, b[1] + 154, '6 NADPH', 'nadph')}
    ${ar(p, `M${b[0] + 108},${b[1] + 122} L${b[0] + 250},${b[1] + 122}`, 'ink', 'boost')}
    ${six(b[0] + 274, b[1] + 92, 'fc03-chip fc03-chip-tp', 34)}${T(b[0] + 295, b[1] + 186, '6 triose-P', 'sm')}
    ${T(b[0] + W / 2, b[1] + 236, 'PGA → triose-P', 'sm lab-b')}
    ${six(c[0] + 30, c[1] + 92, 'fc03-chip fc03-chip-tp', 34)}
    ${ar(p, `M${c[0] + 112},${c[1] + 98} L${c[0] + 268},${c[1] + 98}`, 'clay')}${chip(c[0] + 300, c[1] + 98, 'fc03-chip fc03-chip-out', 52, 24)}${T(c[0] + 300, c[1] + 76, '1 out', 'sm lab-b fc03-out')}
    ${ar(p, `M${c[0] + 112},${c[1] + 150} L${c[0] + 258},${c[1] + 150}`)}${T(c[0] + 270, c[1] + 158, '5 stay', 'sm lab-b', 'start')}
    ${T(c[0] + W / 2, c[1] + 236, '6 = 5 + 1', 'sm lab-b')}
    ${[0, 1, 2, 3, 4].map(i => chip(d[0] + 300 + (i % 2) * 42 - 21, d[1] + 92 + Math.floor(i / 2) * 30, 'fc03-chip fc03-chip-tp', 34, 22)).join('')}${T(d[0] + 300, d[1] + 186, '5 triose-P', 'sm')}
    ${ar(p, `M${d[0] + 254},${d[1] + 122} L${d[0] + 184},${d[1] + 122}`)}${tag(d[0] + 214, d[1] + 86, '3 ATP', 'atp')}
    ${[0, 1, 2].map(i => pentC(d[0] + 44 + i * 50, d[1] + 120, 22)).join('')}${T(d[0] + 94, d[1] + 186, '3 RuBP', 'sm')}
    ${T(d[0] + W / 2, d[1] + 236, '15 C → 3 × 5 C', 'sm lab-b')}
    ${ar(p, `M${a[0] + W + 4},145 L${b[0] - 6},145`)}${ar(p, `M${b[0] + W / 2},${b[1] + H + 4} L${b[0] + W / 2},${c[1] - 6}`)}
    ${ar(p, `M${c[0] - 4},${c[1] + 135} L${d[0] + W + 6},${d[1] + 135}`)}${ar(p, `M${d[0] + W / 2},${d[1] - 4} L${a[0] + W / 2},${a[1] + H + 6}`)}`);
}

/* ---------- h · evidence: switch the light off (schematic) ---------- */

function lightOff(): string {
  const p = 'fc03h', x0 = 96, x1 = 530, y0 = 490, y1 = 118, xt = 280;
  /** Vertical position from the original 130…460 layout grid. */
  const M = (v: number): string => f1(y1 + ((v - 130) * (y0 - y1)) / 330);
  return wrap(p, 'Schematic light-off experiment: when the light is switched off, PGA piles up and RuBP runs out, because reduction and regeneration need ATP and NADPH from light while RuBisCO does not',
    `<rect class="fc03-dark" x="${xt}" y="${y1 - 12}" width="${x1 - xt}" height="${y0 - y1 + 12}"/>
    ${T((x0 + xt) / 2, y1 - 24, 'light on', 'sm lab-b')}${T((xt + x1) / 2, y1 - 24, 'light off', 'sm lab-b')}
    <path class="axis" d="M${x0},${y1 - 14} V${y0} H${x1 + 10}"/>
    ${T((x0 + x1) / 2, y0 + 34, 'time →', 'tl')}<text class="tl" transform="translate(${x0 - 22} ${(y0 + y1) / 2}) rotate(-90)" text-anchor="middle">amount in the cells →</text>
    <path class="curve fc03-cv-pga" d="M${x0},${M(336)} H${xt} C${xt + 34},${M(336)} ${xt + 46},${M(196)} ${xt + 104},${M(184)} S${x1 - 20},${M(190)} ${x1},${M(194)}"/>
    <path class="curve fc03-cv-rubp" d="M${x0},${M(276)} H${xt} C${xt + 26},${M(276)} ${xt + 36},${M(420)} ${xt + 96},${M(432)} S${x1 - 20},${M(438)} ${x1},${M(440)}"/>
    ${T(x0 + 12, +M(326), 'PGA', 'sm lab-b fc03-pga', 'start')}${T(x0 + 12, +M(266), 'RuBP', 'sm lab-b fc03-rubp', 'start')}
    ${T(x1 + 24, +M(202), 'PGA piles up', 'sm lab-b fc03-pga', 'start')}
    ${T(x1 + 24, +M(236), 'reducing it needs', 'sm', 'start')}${tag(x1 + 60, +M(272), 'ATP', 'atp')}${tag(x1 + 166, +M(272), 'NADPH', 'nadph')}
    ${T(x1 + 24, +M(392), 'RuBP runs out', 'sm lab-b fc03-rubp', 'start')}
    ${T(x1 + 24, +M(426), 'rebuilding it needs', 'sm', 'start')}${tag(x1 + 60, +M(462), 'ATP', 'atp')}
    ${T(x0, 580, 'after Calvin’s group, 1950s', 'tiny', 'start')}${T(776, 580, 'schematic', 'tiny', 'end')}`);
}

/* ---------- i · equation-anchored: the three steps add up, RuBP cancels ---------- */

function sumOfSteps(): string {
  const p = 'fc03i';
  const cols = [78, 236, 394, 570, 728], ops = [157, 315, 482, 649], W = 128;
  type Kind = 'c' | 'atp' | 'nadph' | 'out';
  const term = (col: number, y: number, s: string, k: Kind, struck = false, sub = ''): string => {
    const x = cols[col];
    const cls = k === 'atp' ? 'tag-atp' : k === 'nadph' ? 'tag-nadph' : k === 'out' ? 'node node-out' : 'node';
    return `<g${struck ? ' class="fc03-struck"' : ''}><rect class="${cls}" x="${x - W / 2}" y="${y - 22}" width="${W}" height="44" rx="14"/>${T(x, y + 8, s, 'sm lab-b')}</g>` +
      (struck ? `<path class="fc03-strike" d="M${x - W / 2 + 10},${y + 16} L${x + W / 2 - 10},${y - 16}"/>` : '') +
      (sub ? T(x, y + 44, sub, 'tiny') : '');
  };
  const op = (i: number, y: number, s = '+'): string => T(ops[i], y + 9, s, 'lab lab-b fc03-op');
  const row = (n: number, y: number, name: string): string => `${badge(22, y - 46, n)}${T(46, y - 40, name, 'sm fc03-acc', 'start')}`;
  return wrap(p, 'The three steps as equations: carboxylation, reduction and regeneration. RuBP, PGA and five triose phosphates appear on both sides and cancel, leaving 3 CO₂ + 9 ATP + 6 NADPH → 1 triose phosphate',
    `${row(1, 86, 'carboxylation (RuBisCO)')}
    ${term(0, 86, '3 CO₂', 'c', false, '3 C')}${op(0, 86)}${term(1, 86, '3 RuBP', 'c', true, '15 C')}${op(2, 86, '→')}${term(3, 86, '6 PGA', 'c', true, '18 C')}
    ${row(2, 210, 'reduction')}
    ${term(0, 210, '6 PGA', 'c', true, '18 C')}${op(0, 210)}${term(1, 210, '6 ATP', 'atp')}${op(1, 210)}${term(2, 210, '6 NADPH', 'nadph')}${op(2, 210, '→')}
    ${term(3, 210, '5 triose-P', 'c', true, '15 C')}${op(3, 210)}${term(4, 210, '1 triose-P', 'out', false, '3 C')}
    ${row(3, 334, 'regeneration')}
    ${term(0, 334, '5 triose-P', 'c', true, '15 C')}${op(0, 334)}${term(1, 334, '3 ATP', 'atp')}${op(2, 334, '→')}${term(3, 334, '3 RuBP', 'c', true, '15 C')}
    <path class="fc03-sumrule" d="M14,404 H786"/>${T(786, 396, 'sum of 1 + 2 + 3', 'sm lab-b', 'end')}
    ${term(0, 454, '3 CO₂', 'c')}${op(0, 454)}${term(1, 454, '9 ATP', 'atp')}${op(1, 454)}${term(2, 454, '6 NADPH', 'nadph')}${op(2, 454, '→')}${term(3, 454, '1 triose-P', 'out')}
    ${T(400, 548, 'Struck terms cancel: RuBP is rebuilt', 'sm lab-b', 'middle')}`);
}

/* ---------- j · minimal icons: six trioses, five back, one out ---------- */

function sixFiveOne(): string {
  const p = 'fc03j', cx = 520, cy = 250, R = 66;
  const ring = Array.from({ length: 6 }, (_, i) => {
    const a = (-90 + i * 60) * Math.PI / 180;
    const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    return i === 1 ? `<rect class="fc03-ghost" x="${f1(x - 31)}" y="${f1(y - 14)}" width="62" height="28" rx="14"/>` : chip(x, y, 'fc03-chip fc03-chip-tp', 62, 28);
  }).join('');
  return wrap(p, 'Minimal summary: RuBP takes up 3 CO₂; ATP and NADPH turn the product into 6 triose phosphates; 5 rebuild RuBP and 1 leaves',
    `${pent(130, cy, 62, '')}${T(130, cy + 4, 'RuBP', 'lab lab-b')}${T(130, cy + 30, '× 3', 'sm')}
    ${T(286, 112, '3 CO₂', 'sm lab-b')}${co2(230, 146, 10)}${co2(286, 146, 10)}${co2(342, 146, 10)}${ar(p, 'M286,164 L286,236')}
    ${ar(p, `M198,${cy} L${cx - R - 50},${cy}`, 'ink', 'boost')}
    ${tag(320, cy + 44, 'ATP', 'atp')}${tag(320, cy + 88, 'NADPH', 'nadph')}
    ${ring}${T(cx, cy + 14, '6', 'fc03-big')}
    ${ar(p, `M${cx + 100},${cy - 44} L${cx + 168},${cy - 100}`, 'clay', 'boost')}${chip(cx + 214, cy - 122, 'fc03-chip fc03-chip-out', 76, 34)}
    ${T(cx + 214, cy - 162, '1 leaves', 'lab lab-b fc03-out')}
    <path class="ar ar-ink boost" d="M${cx},${cy + R + 26} C${cx},${cy + 200} ${cx - 80},${cy + 212} ${cx - 200},${cy + 212} H210 C150,${cy + 212} 130,${cy + 170} 130,${cy + 74}" marker-end="url(#${p}-ink)"/>
    ${T(330, cy + 252, '5 rebuild RuBP', 'lab lab-b')}${tag(330, cy + 212, '3 ATP', 'atp')}
    ${T(700, 520, '6 = 5 + 1', 'fc03-big')}`);
}
