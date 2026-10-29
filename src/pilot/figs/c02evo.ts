// Slide C2 (RuBisCO through Earth's history), page figures: the illustrative RuBisCO evolution graph (overnight, 29 Oct
// 2026; lecturer: "make a very good illustrative RuBisCO evolution history graph"; focus: "how RuBisCO's performance
// changed over the years"). Shown as eg1, eg2 on slide 15's page, after the picked mr3. The PLATE text stays empty.
// - g1: the graph of the animation evoG (anim/c2story-graph.ts, read its header for the data and sources), still and
//   complete: RuBisCO's CO₂ preference S over time on a broken linear axis, each group a point with its real structure
//   on a paper card; O₂ and CO₂ in the air faint behind.
// - g2: a family tree on the timeline. Each RuBisCO lineage is a branch whose height is its CO₂ preference S: the
//   branches fork where a lineage begins and rise to its S, then run to today, where each tip ends in its structure and
//   S on a card. Known values: the tips (living enzymes, as g1), the rebuilt ancestors 22 and 39 (Schulz et al. 2022), the
//   flowering-plant ancestor 81 (Bouvier et al. 2024); the shapes in between are schematic and the fork dates
//   approximate (as g1's: archaea ≈ 3.5, purple bacteria and form I before the Great Oxidation Event, cyanobacteria
//   2.7, green algae ≈ 1.25 → 1.0, red algae 1.05, land plants ≈ 490–440 million years ago). Topology (Iñiguez et al.
//   2020; Delwiche & Palmer 1996): form III, form II and form I; within form I the green-type line (cyanobacteria, then
//   their plastid in green algae and land plants) and the red-type line, which red algae took from bacteria (dashed:
//   in bacteria). The land-plant branch is the one with a measured history: long and flat (dashed before the
//   flowering-plant ancestor: no measurements).
import type { PlateText, Variant } from '../types';
import {
  axesSvg, crdSvg, dot, f, GOE, GROUPS, IMG, img, line, PAGE, graphSvg, S_ANC, S_ANCL, S_SSU, sLand, tx, xAt, yS,
  YA_ANC, type Geo, type GK,
} from '../anim/c2story-graph';

type V = [number, number];

export const PLATE: PlateText = { n: 'C2', title: '', status: 'draft', lead: '', points: [], refs: [] };
export const VARIANTS: Variant[] = [
  { id: 'g1', name: 'RuBisCO’s CO₂ preference through Earth’s history: the graph' },
  { id: 'g2', name: 'RuBisCO’s family tree on the timeline: branch height = CO₂ preference' },
];

const svg = (label: string, body: string): string => `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/* ================================================================ g2 · the family tree */

const TREE: Geo = {
  ...PAGE,
  p: 'eg2',
  segs: [{ x: [66, 360], ya: [4e9, 5e8] }, { x: [372, 610], ya: [5e8, 0] }],
  ticks: [[0, 4e9, '4', 'middle'], [0, 3e9, '3', 'middle'], [0, 2e9, '2', 'middle'], [0, 1e9, '1', 'middle'],
    [1, 5e8, '500', 'middle'], [1, 4e8, '400', 'middle'], [1, 3e8, '300', 'middle'], [1, 2e8, '200', 'middle'], [1, 1e8, '', 'middle'], [1, 0, 'today', 'end']],
  titles: [['billion years ago', 213], ['million years ago', 491]],
  crd: [
    'CO₂ preference S at 25 °C: living enzymes (tips) and rebuilt or inferred ancestors (open): Tcherkez et al. 2006;',
    'Flamholz et al. 2019; Schulz et al. 2022; Bouvier et al. 2024 · structures: PDB 1GEH, 9RUB, 1RBL, 1BWV, 8RUC',
    'Great Oxidation Event: Poulton et al. 2021 · branch shapes between the measured values schematic · dates approximate',
  ],
};
const X = (ya: number): number => xAt(TREE, ya), Y = (s: number): number => yS(TREE, s);
const XEND = X(0), RK = 0.075, CX = 644, CW = 152;
/** A fork: from the parent at (ya0, s0), rising smoothly to (ya1, s1) (horizontal at both ends). */
const rise = (ya0: number, s0: number, ya1: number, s1: number): string => {
  const x0 = X(ya0), y0 = Y(s0), x1 = X(ya1), y1 = Y(s1), m = (x0 + x1) / 2;
  return `M${f(x0)},${f(y0)} C${f(m)},${f(y0)} ${f(m)},${f(y1)} ${f(x1)},${f(y1)}`;
};
const flat = (ya0: number, s: number): string => `M${f(X(ya0))},${f(Y(s))} H${f(XEND)}`;
const br = (d: string, col: string, w = 3, dash = ''): string =>
  `<path d="${d}" style="fill:none;stroke:${col};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round${dash ? `;stroke-dasharray:${dash}` : ''}"/>`;

/** The tips, top to bottom, with the row each card sits in. */
const TIPS: Array<[GK, number]> = [['red', 108], ['lnd', 222], ['grn', 292], ['cya', 362], ['pur', 432], ['arc', 502]];
function tipSvg(k: GK, row: number): string {
  const c = GROUPS[k], names = k === 'pur' ? ['purple', 'bacteria'] : [c.name], m = IMG[c.img];
  const h = Math.max(m.h * RK + 12, names.length * 15 + 30), ys = names.map((_, i) => row - 4 - (names.length - 1) * 8 + i * 15);
  const yT = Y(c.s), xr = CX + 26;
  const link = `M${f(XEND)},${f(yT)} C${f(XEND + 20)},${f(yT)} ${f(CX - 16)},${f(row)} ${f(CX)},${f(row)}`;
  return `${br(link, c.col, 2)}${dot(XEND, yT, TREE.r, c.col)}
    <rect x="${CX}" y="${f(row - h / 2)}" width="${CW}" height="${f(h)}" rx="8" style="fill:#fffdf8;stroke:${c.col};stroke-width:1.5"/>
    ${img(c.img, xr, row, RK)}${names.map((nm, i) => tx(CX + 50, ys[i], nm, 13, c.txt, 700, 'start')).join('')}
    ${tx(CX + 50, ys[ys.length - 1] + 16, c.sTxt, 13, '#141413', 700, 'start')}`;
}

function g2(): string {
  const G = GROUPS, g = TREE, top = Y(200) - 4;
  const goe0 = X(GOE[0]), goe1 = X(GOE[1]);
  // the forks (years ago)
  const A0 = 3.5e9, P0 = 3.3e9, P1 = 3.05e9, I0 = 3.2e9, I1 = 3.0e9, I2 = 2.82e9, C1 = 2.7e9, R1 = 1.05e9, G0 = 1.25e9, G1 = 1.0e9, L0 = 4.9e8, L1 = 4.4e8;
  const land = Array.from({ length: 21 }, (_, i) => { const a = YA_ANC * (1 - i / 20); return [X(a), Y(sLand(a))] as V; });
  const lc = G.lnd.col;
  const branches = [
    br(`M${f(X(A0))},${f(Y(G.arc.s))} H${f(XEND)}`, G.arc.col),
    br(`${rise(P0, G.arc.s, P1, G.pur.s)} H${f(XEND)}`, G.pur.col),
    br(`${rise(I0, G.arc.s, I1, S_ANCL)} ${rise(I1, S_ANCL, I2, S_SSU).replace(/^M[^C]+/, '')}`, G.cya.col),
    br(`${rise(I2, S_SSU, C1, G.cya.s)} H${f(XEND)}`, G.cya.col),
    br(rise(I2, S_SSU, R1, G.red.s), G.red.col, 2.2, '6 5'), br(flat(R1, G.red.s), G.red.col),
    br(`${rise(G0, G.cya.s, G1, G.grn.s)} H${f(XEND)}`, G.grn.col),
    br(rise(L0, G.grn.s, L1, S_ANC), lc, 2.4, '6 5'), br(`M${f(X(L1))},${f(Y(S_ANC))} H${f(X(YA_ANC))}`, lc, 2.6, '7 6'),
    line(land, lc, 4.5),
  ].join('');
  const nodes = `${dot(X(A0), Y(G.arc.s), g.r, G.arc.col)}${dot(X(I1), Y(S_ANCL), g.r, G.cya.col, true)}${dot(X(I2), Y(S_SSU), g.r, G.cya.col, true)}${dot(X(YA_ANC), Y(S_ANC), g.r, lc, true)}`;
  const labs = [
    tx(X(I1) + 8, Y(S_ANCL) + 6, `<tspan style="font-weight:700;fill:#141413">${S_ANCL}</tspan> rebuilt ancestor`, 12, '#4a4945', 400, 'start', true),
    tx(X(I2) + 14, Y(S_SSU) + 14, `<tspan style="font-weight:700;fill:#141413">${S_SSU}</tspan> + small subunit`, 12, '#4a4945', 400, 'start', true),
    tx(X(1.95e9) - 14, Y(112), 'via bacteria', 12, G.red.txt, 600, 'end', true),
    tx(X(L0) + 10, Y(S_ANC) - 9, 'land plants', 12, lc, 700, 'start'),
    tx(X(YA_ANC), Y(S_ANC) - 32, 'flowering-plant', 12, lc, 600), tx(X(YA_ANC), Y(S_ANC) - 17, `ancestor <tspan style="font-weight:700;fill:#141413">${Math.round(S_ANC)}</tspan>`, 12, lc, 600),
    tx(goe1 + 6, 74, 'Great Oxidation Event', 12, '#2f6f66', 600, 'start'),
  ].join('');
  return svg('RuBisCO’s family tree on the timeline, branch height its CO₂ preference',
    `<rect x="${f(goe0)}" y="${f(top)}" width="${f(goe1 - goe0)}" height="${f(g.y0 - top)}" style="fill:#4f9a8f;opacity:.16"/>
    ${axesSvg(g)}${branches}${nodes}${labs}${TIPS.map(([k, row]) => tipSvg(k, row)).join('')}${crdSvg(g)}`);
}

export function draw(id: string): string {
  if (id === 'g2') return g2();
  return svg('RuBisCO’s CO₂ preference through Earth’s history, with O₂ and CO₂ in the air', graphSvg(PAGE, false));
}
