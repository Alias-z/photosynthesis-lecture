// Slide 10b · "Balancing ATP and NADPH" (lecturer, 28 Oct 2026; research/redo-2026-10-28/BALANCE_BRIEF.md): the three routes
// that balance ATP against NADPH, drawn over the 7m1 chain (chainSvg 'pdb-bilayer' in glyph mode, counts off), in figure
// units. Used by the slide figure 11m2 (figs/l11c.ts) and by the animation (anim/balance-common.ts), so both match.
// Colours and dash patterns are those of the picked slide-10c figures (figs/l11.css): cyclic violet, to O₂ teal (thin: a
// small share of electrons in flowering plants, Badger et al. 2000); linear flow keeps the chain's black e⁻ arrows.
// - Cyclic flow: a violet band over the loop PSI → ferredoxin → plastoquinone → b₆f → plastocyanin → PSI, its new leg
//   (ferredoxin back to plastoquinone) a violet dashed arrow, named "cyclic flow".
// - To O₂ (water–water cycle): a thin teal dashed line from photosystem I's acceptor side to O₂ (2 O balls), and on to
//   water (the water glyph); names in ink.
// - Malate valve: spare NADPH (from the NADPH tag) becomes malate, which leaves the chloroplast, "to the cytosol".
// No counts anywhere (lecturer: concept level).
import './l11c-routes.css';
import { chainSvg, GEO, o2G, tagG, waterG, type Part } from './chain';

type Pt = [number, number];
const f = (v: number): string => v.toFixed(1);

/** A smooth path through points (Catmull-Rom as cubic Béziers); `closed` joins the end to the start. */
export function smoothPath(q: Pt[], closed = false): string {
  const n = q.length, at = (i: number): Pt => (closed ? q[(i + n) % n] : q[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f(q[0][0])},${f(q[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}
/** An arrowhead with its tip at `tip`, pointing along `dir`. */
function head(tip: Pt, dir: Pt, cls: string, hl = 12, hw = 7): string {
  const L = Math.hypot(dir[0], dir[1]), u: Pt = [dir[0] / L, dir[1] / L], n: Pt = [-u[1], u[0]], b: Pt = [tip[0] - u[0] * hl, tip[1] - u[1] * hl];
  return `<path class="${cls}" d="M${f(tip[0])},${f(tip[1])}L${f(b[0] + n[0] * hw)},${f(b[1] + n[1] * hw)}L${f(b[0] - n[0] * hw)},${f(b[1] - n[1] * hw)}Z"/>`;
}
/** A route arrow along points: the line stops short so the head covers its end. */
function routeArrow(q: Pt[], line: string, hd: string, hl = 12, hw = 7): string {
  const tip = q[q.length - 1], prev = q[q.length - 2], dir: Pt = [tip[0] - prev[0], tip[1] - prev[1]], L = Math.hypot(dir[0], dir[1]);
  const back: Pt = [tip[0] - (dir[0] / L) * hl * 0.8, tip[1] - (dir[1] / L) * hl * 0.8];
  return `<path class="${line}" d="${smoothPath([...q.slice(0, -1), back])}"/>${head(tip, dir, hd, hl, hw)}`;
}
const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

const { p700: P700, fab: FAB, fd: FD, pq: PQ, hem: HEM, cytf: CYTF, pc: PC } = GEO;
/** The cyclic loop, closed: P700 up to ferredoxin, back over the stromal faces to plastoquinone, through b₆f and
 *  plastocyanin to P700 (the chain's own arrows; the return leg as the slide 10b views draw it). */
export const LOOP: Pt[] = [
  [P700[0], P700[1] - 6], [FAB[0] - 4, FAB[1] + 14], [FAB[0] + 12, FAB[1] - 12], [FD[0] - 4, FD[1] + 4],
  [530, 241], [492, 254], [448, 263], [404, 259], [356, 250], [318, 256], [292, 273], [PQ[0] + 14, PQ[1]],
  [HEM[0] - 30, HEM[1] - 2], [HEM[0], HEM[1] + 2], [CYTF[0] - 6, CYTF[1] - 10], [CYTF[0] + 12, CYTF[1] + 14], [PC[0], PC[1] - 6],
  [PC[0] + 14, PC[1] - 14], [P700[0] - 30, P700[1] + 26],
];
/** The new leg of the loop, ferredoxin → plastoquinone. */
const RETURN: Pt[] = [[537, 238], [492, 254], [448, 263], [404, 259], [356, 250], [318, 256], [292, 273], [PQ[0] + 16, PQ[1] - 2]];
/** To O₂ and on to water. */
export const O2_AT: Pt = [434, 164], WATER_AT: Pt = [474, 118];
export const OXY: Pt[] = [[FAB[0] - 4, FAB[1] - 8], [466, 222], [446, 184]];
const OXY2: Pt[] = [[442, 148], [452, 136], [458, 130]];
/** Malate: from the NADPH tag over the reaction row to the malate tag, then out of the chloroplast. */
export const NADPH_TAG: Pt = [612, 64], MALATE_AT: Pt = [340, 40], EXIT_TO: Pt = [196, 40];
const TO_MAL: Pt[] = [[600, 48], [520, 24], [386, 38]];

/** The three routes, each a group the animation can show and thicken: data-k r-cyc (band data-k r-cyc-band), r-oxy,
 *  r-mal (and r-mal-tag, the malate tag). */
export function routesSvg(): string {
  return `<g class="bal-routes">
    <g data-k="r-cyc"><path class="bal-cyc-band" data-k="r-cyc-band" d="${smoothPath(LOOP, true)}"/>
      ${routeArrow(RETURN, 'bal-cyc-line', 'bal-cyc-hd')}${T(374, 229, 'cyclic flow', 'bal-c-cyc chn-halo')}</g>
    <g data-k="r-oxy">${routeArrow(OXY, 'bal-oxy-line', 'bal-oxy-hd', 10, 6)}${routeArrow(OXY2, 'bal-oxy-line', 'bal-oxy-hd', 10, 6)}
      ${o2G(O2_AT[0], O2_AT[1])}${T(O2_AT[0] + 26, 173, 'O₂', 'chn-mol chn-halo', 'start')}
      <g data-k="r-water">${waterG(WATER_AT[0], WATER_AT[1])}${T(WATER_AT[0] - 24, 121, 'H₂O', 'chn-mol chn-halo', 'end')}</g></g>
    <g data-k="r-mal">${routeArrow(TO_MAL, 'bal-mal-line', 'bal-mal-hd', 10, 6)}
      ${routeArrow([[MALATE_AT[0] - 42, MALATE_AT[1]], [EXIT_TO[0] + 40, EXIT_TO[1] - 1], EXIT_TO], 'bal-mal-line', 'bal-mal-hd', 12, 7)}
      ${T(250, 21, 'to the cytosol', 'chn-in chn-halo')}
      <g data-k="r-mal-tag" transform="translate(${MALATE_AT[0]} ${MALATE_AT[1]})">${tagG(0, 0, 'malate', 'plain')}</g></g>
  </g>`;
}

const ALL_PARTS: Part[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];
const ROUTES_SAY = ' Three further routes are drawn and lit: a violet band marks the cyclic loop, photosystem I, ferredoxin, back to plastoquinone (violet dashed arrow, labelled cyclic flow), cytochrome b6f, plastocyanin and photosystem I again; a thin teal dashed line runs from photosystem I to O2 and on to water; a grey arrow takes spare NADPH, as malate, out of the chloroplast, labelled to the cytosol. No counts are shown.';
/** Slide 10b, variant 11m2 "the 3 routes": the 7m1 chain, all lit, counts off, with the three routes. */
export function routesFigure(id: string): string {
  return chainSvg(id, 'pdb-bilayer', ALL_PARTS, { mol: true, counts: false })
    .replace(/aria-label="([^"]*)"/, (_m, l: string) => `aria-label="${l}${ROUTES_SAY}"`)
    .replace(/<\/svg>\s*$/, `${routesSvg()}</svg>`);
}
