// Into the leaf (slide 5), staging A "Side by side", and the scenes shared with staging B "Newspaper desk" (leaf-b.ts).
// Three beats, each one scene with dim and bright light side by side (27 Oct 2026, lecturer): no dive between scales,
// scenes change by cross-fading at their own size, and one click plays a whole beat. In each beat only the one motion
// that teaches moves; everything else (clippings, labels, arrows, micrographs) is there whole from the start.
// 1. Chloroplasts move: a mesophyll cell in dim light and one in bright light, light arrows from above. The chloroplasts
//    start spread along all four walls; in dim light they slide to the walls that face the light (top and bottom), in
//    bright light to the side walls (as in Wada 2016, Fig. 1A). Between the cells: Senn's card (his halftone portrait,
//    taken 1915–1935, with "described chloroplast movement, 1908", so the year is not read as the photo's) and his own
//    1895 drawing of moving chloroplasts, with its label. The one motion: the chloroplasts slide; when they have reached
//    the bright cell's side walls, "side walls" fades in there.
// 2. Grana: a shade and a sun chloroplast drawn at the same scale, real micrographs of a shade orchid grown at 5 % and
//    50 % light below them, at the drawings' magnification (Shao et al. 2014). The one motion: the stacks build up, from
//    3 thylakoids each to their final counts, far taller in the shade chloroplast.
// 3. Stacked and unstacked, two halves under the row "stacked" | "unstacked": left, part of a granum (three appressed
//    thylakoids); right, a stroma lamella. Both sides are treated alike, in two clicks (lecturer, 27 Oct 2026): first
//    PSII and LHCII fade into the stacked membranes, with the 3–4 nm gap; then PSI and ATP synthase fade into the
//    lamella, their stromal parts sticking out far beyond 3–4 nm. Shapes drawn after the in-situ structures of
//    Wietrzynski et al. 2020 (eLife 9: e53740, Fig. 2A).
// Physical sizes:
// - Cell 32 µm × 36 µm, chloroplasts 5 µm × 2 µm (12 px per µm).
// - Chloroplasts 5 µm × 2.2 µm at 96 px per µm; grana 0.35–0.6 µm across; thylakoid repeat in a granum 17.5 nm. Shade
//   grana hold 26–42 thylakoids (0.45–0.74 µm tall), sun grana 5–8 (0.09–0.14 µm), after Anderson 1986.
// - Membranes at 7 px per nm: bilayer 4.5 nm, lumen 7 nm, gap between stacked thylakoids 3.5 nm; PSII–LHCII stromal
//   face about 1 nm, PSII lumenal domains 3.5 nm; PSI stromal ridge 3.7 nm; ATP synthase head 10 nm wide, its top 15 nm
//   from the membrane.
// Real images (src/assets/anim/leaf/, made by scripts/leaf_anim_assets.py):
// - senn.png: Gustav Senn, Photopress AG, 1915–1935, Universitätsbibliothek Basel, UBH Portr BS Senn G 1875, 2
//   (no licence stated in the record); newspaper halftone by scripts/halftone.py.
// - senn-1895.jpg: G. Senn 1895, chloroplasts moving in Vallisneria leaf cells, in Honegger 2022, Bauhinia 28: 63,
//   Abb. 3a (CC BY 4.0); cropped above the handwritten caption, toned to ink on newsprint.
// - tem-shade.jpg, tem-sun.jpg: Shao et al. 2014, PLoS One 9: e85996, Fig. 6 k (5 % light) and b (50 % light), CC BY 4.0;
//   same 2.9 µm × 2.6 µm field from each, the authors' arrow in b covered with nearby texture, toned to ink on paper.
import './leaf-a.css';
import '../figs/clipping.css';
import senn from '../../assets/anim/leaf/senn.png';
import senn1895 from '../../assets/anim/leaf/senn-1895.jpg';
import temShade from '../../assets/anim/leaf/tem-shade.jpg';
import temSun from '../../assets/anim/leaf/tem-sun.jpg';
import type { Staging } from './types';

export type Look = 'a' | 'b';
type V = [number, number];

const f1 = (v: number): string => v.toFixed(1);
const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
const smooth = (x: number): number => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const smoother = (x: number): number => { const u = clamp01(x); return u * u * u * (u * (u * 6 - 15) + 10); };
const lerp = (a: number, b: number, e: number): number => a + (b - a) * e;
/** 0 → 1 over the time window [t0, t1]. */
const tw = (t: number, t0: number, t1: number): number => smooth((t - t0) / (t1 - t0));
const T = (x: number, y: number, s: string, cls: string, anchor: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}"${k ? ` data-k="${k}"` : ''}>${s}</text>`;
/** A label in two lines (the second 27 px below the first), each line a tspan of class cls, centred on x. */
const two = (x: number, cls: string, a: string, b: string): string =>
  `<tspan class="${cls}" x="${f1(x)}">${a}</tspan><tspan class="${cls}" x="${f1(x)}" dy="27">${b}</tspan>`;
/** A label with a straight leader from (lx, ly) to the thing at (ax, ay). */
const pointer = (x: number, y: number, s: string, lead: [number, number, number, number], k = '', cls = 'lf-lab'): string =>
  `<g${k ? ` data-k="${k}"` : ''}><path class="lf-lead" d="M${f1(lead[0])},${f1(lead[1])}L${f1(lead[2])},${f1(lead[3])}"/>${T(x, y, s, cls, 'middle')}</g>`;

/** Small deterministic random numbers, for scissor-cut paper edges. */
function rng(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}
/** A rectangle with slightly irregular, scissor-cut edges (as the shared clipping's). */
export function cutPath(x: number, y: number, w: number, h: number, seed: number): string {
  const r = rng(seed), pts: V[] = [];
  const edge = (x0: number, y0: number, x1: number, y1: number): void => {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 16)), nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny);
    for (let i = 0; i < n; i++) { const t = i / n, o = (r() - 0.5) * 3.6; pts.push([x0 + (x1 - x0) * t + (nx / L) * o, y0 + (y1 - y0) * t + (ny / L) * o]); }
  };
  edge(x, y, x + w, y); edge(x + w, y, x + w, y + h); edge(x + w, y + h, x, y + h); edge(x, y + h, x, y);
  return `M${pts.map(q => `${f1(q[0])},${f1(q[1])}`).join('L')}Z`;
}


/* ================================================================ beat 1: two cells */

const CY0 = 432; // cells' centre y
/** The two panels are 530 px wide, so the column between them (590–1010) has room for Senn's card, drawing and label. */
export const CX_DIM = 325, CX_BRI = 1275;
const CELL_HW = 190, CELL_HH = 215, CELL_R = 32;
/** The path the chloroplasts' centres follow: 18 px inside the wall's centre line (half wall, a gap, half a chloroplast). */
const PH = { hw: 172, hh: 197, r: 14 };
const PA = PH.hw - PH.r, PB = PH.hh - PH.r, PQ = (Math.PI * PH.r) / 2;
const PER = 4 * PA + 4 * PB + 4 * PQ;
/** Point and direction (degrees) on that path, arc length s from the top wall's centre, clockwise. */
function perim(s0: number): { x: number; y: number; a: number } {
  let s = ((s0 % PER) + PER) % PER;
  const seg = (len: number): boolean => { if (s <= len) return true; s -= len; return false; };
  const arc = (cx: number, cy: number, a0: number): { x: number; y: number; a: number } => {
    const th = a0 + (s / PH.r) * (180 / Math.PI), r = (th * Math.PI) / 180;
    return { x: cx + PH.r * Math.cos(r), y: cy + PH.r * Math.sin(r), a: th + 90 };
  };
  if (seg(PA)) return { x: s, y: -PH.hh, a: 0 };
  if (seg(PQ)) return arc(PA, -PB, -90);
  if (seg(2 * PB)) return { x: PH.hw, y: -PB + s, a: 90 };
  if (seg(PQ)) return arc(PA, PB, 0);
  if (seg(2 * PA)) return { x: PA - s, y: PH.hh, a: 180 };
  if (seg(PQ)) return arc(-PA, PB, 90);
  if (seg(2 * PB)) return { x: -PH.hw, y: PB - s, a: 270 };
  if (seg(PQ)) return arc(-PA, -PB, 180);
  return { x: -PA + s, y: -PH.hh, a: 360 };
}
const RW = PA + PQ + PB; // the right wall's centre, as arc length
const HALF = PER / 2;
/** Positions along the path, sorted, so chloroplast i moves from START[i] to its target without passing another. */
const START = [-HALF + 60, -RW - 80, -RW + 80, -60, 60, RW - 80, RW + 80, HALF - 60];
const FACE = [-HALF + 38, -HALF + 114, -114, -38, 38, 114, HALF - 114, HALF - 38];
const SIDE = [-RW - 135, -RW - 45, -RW + 45, -RW + 135, RW - 135, RW - 45, RW + 45, RW + 135];
const STAG_D = [0.25, 0.1, 0.0, 0.35, 0.2, 0.05, 0.3, 0.15];
const STAG_B = [0.05, 0.3, 0.15, 0.0, 0.35, 0.1, 0.25, 0.2];
/** A chloroplast in the cell, 5 µm × 2 µm: a lens with its grana as dashes. */
const CP_LENS = 'M-30,0Q-27,-12.5 0,-12.5Q27,-12.5 30,0Q27,12.5 0,12.5Q-27,12.5 -30,0Z';
const CP_GRANA = 'M-19,-3.5h6M-8,3h6M3,-3h6M14,2.5h5';

function cellSvg(id: string, cx: number): string {
  const cps = START.map((_, i) => `<g data-k="${id}${i}"><path class="lf-cp" d="${CP_LENS}"/><path class="lf-cpg" d="${CP_GRANA}"/></g>`).join('');
  return `<rect class="lf-wall" x="${cx - CELL_HW}" y="${CY0 - CELL_HH}" width="${2 * CELL_HW}" height="${2 * CELL_HH}" rx="${CELL_R}"/>
    <rect class="lf-pm" x="${cx - CELL_HW + 9}" y="${CY0 - CELL_HH + 9}" width="${2 * CELL_HW - 18}" height="${2 * CELL_HH - 18}" rx="${CELL_R - 9}"/>${cps}`;
}
/** Light arrows from above: few and thin for dim light, many and bold for bright light. */
function arrowsSvg(P: string, id: string, cx: number, bright: boolean): string {
  const xs = bright ? [-150, -100, -50, 0, 50, 100, 150] : [-110, 0, 110];
  return `<g data-k="${id}">${xs.map(dx => `<path class="lf-arr ${bright ? 'lf-arr-b' : 'lf-arr-d'}" d="M${cx + dx},126V${bright ? 192 : 196}" marker-end="url(#${P}-${bright ? 'hb' : 'hd'})"/>`).join('')}</g>`;
}


/* ================================================================ beat 2: chloroplasts */

interface Granum { x: number; y: number; w: number; n: number }
const REP = 0.0175; // thylakoid repeat in a granum, µm
const N0 = 3; // thylakoids per granum before the stacks build up
const CPL = { a: 2.5, b: 1.1 }; // chloroplast half length and half thickness, µm
const SHADE: Granum[] = [
  { x: -1.62, y: -0.4, w: 0.52, n: 26 }, { x: -0.54, y: -0.4, w: 0.6, n: 40 }, { x: 0.54, y: -0.4, w: 0.58, n: 36 }, { x: 1.62, y: -0.4, w: 0.5, n: 26 },
  { x: -1.08, y: 0.4, w: 0.58, n: 38 }, { x: 0, y: 0.4, w: 0.6, n: 42 }, { x: 1.08, y: 0.4, w: 0.56, n: 34 },
  { x: -2.12, y: 0, w: 0.38, n: 14 }, { x: 2.12, y: 0.02, w: 0.36, n: 12 },
];
const SUN_PLANES = [-0.62, -0.21, 0.21, 0.62];
const SUN: Granum[] = [
  ...[-1.35, -0.45, 0.45, 1.35].map((x, i) => ({ x, y: -0.62, w: 0.4 + 0.02 * (i % 2), n: 6 + (i % 3) })),
  ...[-1.9, -0.9, 0.1, 1.05, 1.95].map((x, i) => ({ x, y: -0.21, w: 0.38 + 0.03 * (i % 2), n: 7 - (i % 2) })),
  ...[-1.5, -0.5, 0.55, 1.5].map((x, i) => ({ x, y: 0.21, w: 0.42 - 0.03 * (i % 2), n: 5 + (i % 3) })),
  ...[-1.0, 0.0, 1.0].map((x, i) => ({ x, y: 0.62, w: 0.38 + 0.02 * i, n: 8 - i })),
];
const K2 = 96; // px per µm
export const CH_SHADE: V = [420, 286], CH_SUN: V = [1180, 286];
/** The micrographs below: 2.9 µm × 2.6 µm fields at the drawings' 96 px per µm, 278 × 250 px. */
export const TEM_W = 278, TEM_H = 249, TEM_Y = 418;

/** A chloroplast's envelope (two membranes) around its stroma. */
const envSvg = (c: V): string => `<ellipse class="lf-env" cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(CPL.a * K2)}" ry="${f1(CPL.b * K2)}"/>
  <ellipse class="lf-env2" cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(CPL.a * K2 - 4)}" ry="${f1(CPL.b * K2 - 4)}"/>`;
/** The thylakoids of a chloroplast at c with granum i holding n(i) thylakoids: lamellae, grana, and the lines between the
 *  thylakoids of each granum. Redrawn each frame while the stacks build up. */
function thylakoids(kind: 'shade' | 'sun', c: V, n: (i: number) => number): { lam: string; gr: string; grl: string } {
  const X = (u: number): number => c[0] + u * K2, Y = (v: number): number => c[1] + v * K2;
  const grana = kind === 'shade' ? SHADE : SUN, h = (i: number): number => n(i) * REP;
  let lam = '', gr = '', grl = '';
  if (kind === 'sun') {
    // Long lamellae along four planes, running through the grana, and a few links between the planes.
    SUN_PLANES.forEach(p => { const L = (CPL.a - 0.05) * Math.sqrt(1 - (p / (CPL.b - 0.05)) ** 2) - 0.06; lam += `M${f1(X(-L))},${f1(Y(p))}L${f1(X(L))},${f1(Y(p))}`; });
    [[-1.35, -0.62, -0.9, -0.21], [0.45, -0.62, 1.05, -0.21], [-0.9, -0.21, -0.5, 0.21], [1.05, -0.21, 1.5, 0.21], [-0.5, 0.21, 0, 0.62], [0.55, 0.21, 1.0, 0.62]]
      .forEach(([x0, y0, x1, y1]) => { lam += `M${f1(X(x0 + 0.15))},${f1(Y(y0))}C${f1(X(x0 + 0.35))},${f1(Y(y0))} ${f1(X(x1 - 0.35))},${f1(Y(y1))} ${f1(X(x1 - 0.15))},${f1(Y(y1))}`; });
  } else {
    // Each granum of the upper row is linked to its neighbours below, from its lower thylakoids to their upper ones; a link
    // leaves a granum a fraction fa of the way from its edge thylakoid toward its middle, so it stays on the stack as it grows.
    const link = (a: number, b: number, fromLow: boolean, fa: number): void => {
      const g = SHADE[a], k = SHADE[b], sx = g.x < k.x ? 1 : -1;
      const ya = g.y + (fromLow ? 1 : -1) * (h(a) / 2) * (1 - fa), yb = k.y + (fromLow ? -1 : 1) * (h(b) / 2) * (1 - fa);
      const xa = g.x + (sx * g.w) / 2, xb = k.x - (sx * k.w) / 2;
      lam += `M${f1(X(xa))},${f1(Y(ya))}C${f1(X(lerp(xa, xb, 0.5)))},${f1(Y(ya))} ${f1(X(lerp(xa, xb, 0.5)))},${f1(Y(yb))} ${f1(X(xb))},${f1(Y(yb))}`;
    };
    [0, 1, 2, 3].forEach(a => [4, 5, 6].forEach(b => { if (Math.abs(SHADE[a].x - SHADE[b].x) < 0.6) { link(a, b, true, 0.2); link(a, b, true, 0.55); } }));
    link(7, 0, false, 0.25); link(7, 4, false, 0.25); link(3, 8, true, 0.4); link(6, 8, true, 0.4);
    link(4, 5, true, 0.4); link(5, 6, true, 0.4); link(0, 1, true, 0.6); link(1, 2, true, 0.6); link(2, 3, true, 0.6);
  }
  grana.forEach((g, i) => {
    const hp = h(i) * K2, x0 = X(g.x - g.w / 2), y0 = Y(g.y) - hp / 2, w = g.w * K2, step = REP * K2;
    gr += `M${f1(x0)},${f1(y0)}h${f1(w)}v${f1(hp)}h${f1(-w)}Z`;
    for (let y = y0 + step; y < y0 + hp - 0.4; y += step) grl += `M${f1(x0 + 1.2)},${f1(y)}h${f1(w - 2.4)}`;
  });
  return { lam, gr, grl };
}

/* ================================================================ beat 3: membranes */

const NM = 7; // px per nm
const MEM = 4.5 * NM, LUM = 7 * NM, THY = 2 * MEM + LUM, GAP = 3.5 * NM, REPM = THY + GAP;
/** Left half: three appressed thylakoids of a granum, ending in its margin at ST_END. */
const ST_TOP = 230, ST_END = 640;
const stTop = (j: number): number => ST_TOP + j * REPM;
/** Right half: a stroma lamella, level with the granum's middle thylakoid, from LAM_X0 on. */
const LAM_Y = stTop(1), LAM_X0 = 805;
/** A box in membrane coordinates: u along the membrane, v from the stromal surface yS toward the lumen (dir = +1: lumen
 *  below). */
const box = (x: number, yS: number, dir: number, u0: number, u1: number, v0: number, v1: number, rx: number, cls: string): string => {
  const a = yS + dir * v0, b = yS + dir * v1;
  return `<rect class="${cls}" x="${f1(x + u0)}" y="${f1(Math.min(a, b))}" width="${f1(u1 - u0)}" height="${f1(Math.abs(b - a))}" rx="${rx}"/>`;
};
/** One outline through points given in membrane coordinates (u, v), as for box(). */
const outline = (x: number, yS: number, dir: number, pts: Array<[number, number]>, cls: string): string =>
  `<path class="${cls}" d="M${pts.map(([u, v]) => `${f1(x + u)},${f1(yS + dir * v)}`).join('L')}Z" stroke-linejoin="round"/>`;
/** PSII core dimer, 20 nm, with its two lumenal (water-splitting) domains, 3.5 nm deep. */
const psii = (x: number, yS: number, dir: number): string => outline(x, yS, dir, [
  [-70, -6], [70, -6], [70, MEM + 2], [60, MEM + 2], [58, MEM + 22], [54, MEM + 24.5], [16, MEM + 24.5], [12, MEM + 22], [10, MEM + 2],
  [-10, MEM + 2], [-12, MEM + 22], [-16, MEM + 24.5], [-54, MEM + 24.5], [-58, MEM + 22], [-60, MEM + 2], [-70, MEM + 2]], 'lf-psii');
/** LHCII trimer, 7 nm. */
const lhc = (x: number, yS: number, dir: number): string => box(x, yS, dir, -24, 24, -4, MEM + 4, 7, 'lf-lhc');
/** PSI with LHCI, 18 nm, and its stromal ridge (where ferredoxin docks), 3.7 nm high. */
const psi = (x: number, yS: number, dir: number): string => outline(x, yS, dir, [
  [-63, MEM + 7], [-63, -5], [-28, -5], [-26, -20], [-18, -26], [18, -26], [26, -20], [28, -5], [63, -5], [63, MEM + 7]], 'lf-psi');
/** ATP synthase: c-ring in the membrane, central and peripheral stalks, and the 10 nm head, 15 nm out. */
const atp = (x: number, yS: number, dir: number): string =>
  box(x, yS, dir, -21, 21, -3, MEM + 3, 6, 'lf-atp') + box(x, yS, dir, -6, 6, -40, -1, 3, 'lf-atp') + box(x, yS, dir, -37, -29, -92, 1, 4, 'lf-atp')
  + `<ellipse class="lf-atp" cx="${f1(x)}" cy="${f1(yS - dir * 70)}" rx="35" ry="35"/>`;

/** A thylakoid's sac from x0 to x1 with a rounded margin on the right end if asked; its two membranes and its lumen. */
function sac(x0: number, x1: number, y: number, roundR: boolean): string {
  const shape = (a: number, b: number, top: number, h: number): string => {
    const r = h / 2;
    return roundR ? `M${f1(a)},${f1(top)}H${f1(b - r)}A${f1(r)},${f1(r)} 0 0 1 ${f1(b - r)},${f1(top + h)}H${f1(a)}Z`
      : `M${f1(a)},${f1(top)}H${f1(b)}V${f1(top + h)}H${f1(a)}Z`;
  };
  return `<path class="lf-mem" d="${shape(x0, x1, y, THY)}"/><path class="lf-lum" d="${shape(x0, x1 - (roundR ? MEM : 0), y + MEM, LUM)}"/>`;
}
/** The granum's six membranes: [stromal surface, direction, PSII–LHCII group centre, lone LHCII]. The groups of the two
 *  membranes of one thylakoid are offset, so their lumenal domains never face each other; the margin (x > 510) is bare. */
const STACK_ROWS: Array<[number, number, number, number]> = [
  [stTop(0), 1, 200, 440], [stTop(0) + THY, -1, 380, 150],
  [stTop(1), 1, 230, 450], [stTop(1) + THY, -1, 400, 160],
  [stTop(2), 1, 190, 430], [stTop(2) + THY, -1, 370, 120],
];
const granumSvg = (): string => [0, 1, 2].map(j => sac(-400, ST_END, stTop(j), true)).join('');
const stackedSvg = (): string => STACK_ROWS.map(([yS, d, c, l]) => lhc(c - 98, yS, d) + psii(c, yS, d) + lhc(c + 98, yS, d) + lhc(l, yS, d)).join('');
/** The lamella's PSI and ATP synthase: upper membrane (stroma above) and lower membrane (stroma below). */
const RIGHT = { atpU: 950, psiU: 1300, psiL: 1090, atpL: 1400 };
const lamellaSvg = (): string => sac(LAM_X0, 2000, LAM_Y, false);
const psiSvg = (): string => psi(RIGHT.psiU, LAM_Y, 1) + psi(RIGHT.psiL, LAM_Y + THY, -1);
const atpSvg = (): string => atp(RIGHT.atpU, LAM_Y, 1) + atp(RIGHT.atpL, LAM_Y + THY, -1);
/** The 3–4 nm gap between stacked membranes, near the granum's margin, and the 10 nm ATP synthase head. */
const GAP_X = 545, HEAD_X = RIGHT.atpU + 47;
const gapSvg = (): string => {
  const y0 = stTop(0) + THY, y1 = stTop(1);
  return `<path class="lf-dim" d="M${GAP_X - 9},${f1(y0)}H${GAP_X + 9}M${GAP_X - 9},${f1(y1)}H${GAP_X + 9}M${GAP_X},${f1(y0)}V${f1(y1)}"/>
    <path class="lf-lead" d="M${GAP_X + 12},${f1((y0 + y1) / 2)}H${ST_END + 12}"/>${T(ST_END + 18, (y0 + y1) / 2 + 8, '3–4 nm', 'lf-dimt')}`;
};
const headSvg = (): string => `<path class="lf-dim" d="M${HEAD_X - 6},${f1(LAM_Y - 105)}H${HEAD_X + 6}M${HEAD_X - 6},${f1(LAM_Y - 35)}H${HEAD_X + 6}M${HEAD_X},${f1(LAM_Y - 105)}V${f1(LAM_Y - 35)}"/>
  ${T(HEAD_X + 12, LAM_Y - 62, '10 nm', 'lf-dimt')}`;

/* ================================================================ labels and photos */

const pill = (x: number, y: number, s: string): string => {
  const w = s.length * 12 + 26;
  return `<rect class="lf-pillbg" x="${x}" y="${y}" width="${w}" height="34" rx="17"/>${T(x + w / 2, y + 24, s, 'lf-pill', 'middle')}`;
};
const photo = (P: string, k: string, href: string, x: number, y: number, w: number, h: number, tag: string): string =>
  `<g data-k="${k}"><clipPath id="${P}-${k}c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/></clipPath>
    <image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${P}-${k}c)"/>
    <rect class="lf-photo" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>${pill(x + 12, y + 12, tag)}</g>`;

/* ================================================================ timing */

// One click per beat, except beat 3, which stops once. Look A: the scene is there whole (beats 2 and 3 cross-fade in over
// 0.5 s), then its one motion. Look B: the beat's newsprint sheet lies small and tilted on the desk, printed in grey; it
// opens to full size and takes its colours (0.2–1.4 s), then the same motion.
const MOVE_A = [0.4, 0.6, 0.6]; // when each beat's motion starts, look A
const MOVE_B = 1.6;
const OPEN_B: [number, number] = [0.2, 1.4];
/** Beat 3, from its motion's start: PSII and LHCII fade in, the click stop, then PSI and ATP synthase fade in. */
const B3 = { stacked: [0.1, 0.7], stop: 0.9, unstacked: [1.0, 1.6] };
/** How long each beat's motion lasts, s: chloroplasts slide; stacks build up; the two halves of beat 3 fill. */
const DUR = [4.1, 3.4, B3.unstacked[1] + 0.1];
const CP_SLIDE = 3.4, GR_BUILD = 3.0;

/* ================================================================ the staging */

export function makeStaging(look: Look): Staging {
  const P = `lf${look}`;
  const B = look === 'b';
  const M = (b: number): number => (B ? MOVE_B : MOVE_A[b]);
  const TEND = [0, 1, 2].map(b => M(b) + DUR[b]);

  // Senn in the column between the two cells: his card (portrait left, name and what he described right), then his 1895
  // drawing as a clipping, then its label. The card's text keeps to the shared clipping's styles (Newsreader name,
  // Inter key line), at 22 px and up.
  const CW = 380, CX0 = 800 - CW / 2, CY_ = 76, CH = 232;
  const sennCard = (): string => {
    const tx = CX0 + 192, line = (i: number, s: string): string => T(tx, CY_ + 100 + 27 * i, s, 'clip-key lf-key');
    return `<g class="clip" transform="rotate(-1.5 ${f1(CX0 + CW / 2)} ${f1(CY_ + CH / 2)})">
      <path class="clip-paper" d="${cutPath(CX0, CY_, CW, CH, 13)}" filter="url(#${P}-sh)"/>
      <image href="${senn}" x="${f1(CX0 + 16)}" y="${f1(CY_ + 16)}" width="160" height="200" preserveAspectRatio="xMidYMid slice"/>
      ${T(tx, CY_ + 58, 'Gustav Senn', 'clip-name lf-cname')}${line(0, 'described')}${line(1, 'chloroplast')}${line(2, 'movement, 1908')}</g>`;
  };
  const DX = CX0, DY = CY_ + CH + 16, DW = CW, DM = 14, DIW = DW - 2 * DM, DIH = DIW * (475 / 739), DH = DIH + 2 * DM;
  const sennDrawing = (): string => `<g class="clip" transform="rotate(1.2 ${f1(DX + DW / 2)} ${f1(DY + DH / 2)})">
      <path class="clip-paper" d="${cutPath(DX, DY, DW, DH, 23)}" filter="url(#${P}-sh)"/>
      <image href="${senn1895}" x="${f1(DX + DM)}" y="${f1(DY + DM)}" width="${f1(DIW)}" height="${f1(DIH)}" preserveAspectRatio="xMidYMid slice"/></g>
    ${T(800, DY + DH + 36, 'Senn’s drawing: chloroplasts', 'lf-lab', 'middle')}
    <text class="lf-lab" x="800" y="${f1(DY + DH + 64)}" text-anchor="middle">moving in <tspan font-style="italic">Vallisneria</tspan> cells</text>`;
  /** Look B: each beat's scene on a newsprint sheet, which lies on the desk before it opens. */
  const sheet = (seed: number): string => (B ? `<path class="lfb-paper" d="${cutPath(36, 26, 1528, 688, seed)}" filter="url(#${P}-sh)"/>` : '');

  const svg = (): string => {
    // Horizontal fades for beat 3: the granum's cut edge (left), and both cut ends of the lamella (right).
    const fx = (x: number): string => ((x - 60) / 1480).toFixed(4);
    const defs = `<defs>
      <marker id="${P}-hd" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path fill="#e3a51c" d="M0,0L10,5L0,10z"/></marker>
      <marker id="${P}-hb" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto"><path fill="#e3a51c" d="M0,0L10,5L0,10z"/></marker>
      <filter id="${P}-sh" x="-15%" y="-10%" width="130%" height="125%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter>
      <filter id="${P}-print" x="0" y="0" width="100%" height="100%"><feColorMatrix data-k="printm" type="saturate" values="0"/></filter>
      <linearGradient id="${P}-mh" x1="60" x2="1540" y1="0" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="${fx(125)}" stop-color="#fff"/><stop offset="${fx(790)}" stop-color="#fff"/>
        <stop offset="${fx(806)}" stop-color="#fff" stop-opacity="0"/><stop offset="${fx(880)}" stop-color="#fff"/><stop offset="${fx(1470)}" stop-color="#fff"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <mask id="${P}-mmh" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="740"><rect x="0" y="0" width="1600" height="740" fill="url(#${P}-mh)"/></mask>
    </defs>`;

    // Beat 1: the two cells under their light, Senn between them.
    const b0 = `<g data-k="b0"><g data-k="b0c">${sheet(31)}
      <rect class="lf-frame" x="60" y="56" width="530" height="634" rx="14"/><rect class="lf-frame" x="1010" y="56" width="530" height="634" rx="14"/>
      ${T(CX_DIM, 98, 'dim light', 'lf-head', 'middle')}${T(CX_BRI, 98, 'bright light', 'lf-head', 'middle')}
      ${cellSvg('cd', CX_DIM)}${cellSvg('cb', CX_BRI)}
      ${arrowsSvg(P, 'ad', CX_DIM, false)}${arrowsSvg(P, 'ab', CX_BRI, true)}
      <g data-k="l0chl"><path class="lf-lead" d=""/>${T(CX_DIM + 6, 392, 'chloroplast', 'lf-lab', 'middle')}</g>
      ${pointer(CX_DIM + 6, 500, 'cell wall', [CX_DIM - 50, 492, CX_DIM - CELL_HW + 5, 456])}
      <g data-k="l0side">${T(CX_BRI, CY0 + 8, 'side walls', 'lf-lab', 'middle')}<path class="lf-lead" d="M${CX_BRI - 64},${CY0}L${CX_BRI - 156},${CY0 + 40}M${CX_BRI + 64},${CY0}L${CX_BRI + 156},${CY0 + 40}"/></g>
      ${sennCard()}${sennDrawing()}
    </g></g>`;

    // Beat 2: shade and sun chloroplasts above, their micrographs below.
    const env = { a: [CH_SHADE[0] - 0.82 * CPL.a * K2, CH_SHADE[1] - CPL.b * K2 * Math.sqrt(1 - 0.82 ** 2)] as V };
    const grA: V = [CH_SHADE[0] + (SHADE[1].x - SHADE[1].w / 2) * K2, CH_SHADE[1] + SHADE[1].y * K2];
    const stA: V = [CH_SHADE[0] + 1.12 * K2, CH_SHADE[1] - 0.62 * K2];
    const chl = (id: string): string => `<path class="lf-lam" data-k="${id}lam" style="stroke-width:${f1(0.016 * K2)}"/><path class="lf-gr" data-k="${id}gr"/><path class="lf-grl" data-k="${id}grl"/>`;
    const b1 = `<g data-k="b1"><g data-k="b1c">${sheet(37)}
      <rect class="lf-frame" x="60" y="56" width="720" height="634" rx="14"/><rect class="lf-frame" x="820" y="56" width="720" height="634" rx="14"/>
      ${T(CH_SHADE[0], 98, 'shade leaf', 'lf-head', 'middle')}${T(CH_SUN[0], 98, 'sun leaf', 'lf-head', 'middle')}
      ${envSvg(CH_SHADE)}${chl('s')}${envSvg(CH_SUN)}${chl('u')}
      ${pointer(env.a[0] - 20, 150, 'envelope', [env.a[0] - 20, 158, env.a[0], env.a[1]])}
      ${pointer(grA[0] + 30, 150, 'granum', [grA[0] + 30, 158, grA[0], grA[1]])}
      ${pointer(stA[0] + 70, 150, 'stroma', [stA[0] + 70, 158, stA[0], stA[1]])}
      ${photo(P, 'temS', temShade, CH_SHADE[0] - TEM_W / 2, TEM_Y, TEM_W, TEM_H, '5 % light')}
      ${photo(P, 'temU', temSun, CH_SUN[0] - TEM_W / 2, TEM_Y, TEM_W, TEM_H, '50 % light')}
    </g></g>`;

    // Beat 3: stacked (left) | unstacked (right).
    const y0 = stTop(0);
    const b2 = `<g data-k="b2"><g data-k="b2c">${sheet(41)}
      <path class="lf-div" d="M800,64V690"/>
      ${T(350, 100, 'stacked', 'lf-head', 'middle')}${T(1180, 100, 'unstacked', 'lf-head', 'middle')}
      <g mask="url(#${P}-mmh)">${granumSvg()}${lamellaSvg()}<g data-k="stk">${stackedSvg()}</g><g data-k="unstk">${psiSvg()}${atpSvg()}</g></g>
      <g data-k="lstk">${gapSvg()}
        ${pointer(200, 161, two(200, 'lf-c-psii', 'photosystem II', '(PSII)'), [200, 196, 200, y0 - 8])}
        ${pointer(440, 188, '<tspan class="lf-c-lhc">LHCII</tspan> (antenna)', [440, 196, 440, y0 - 6])}</g>
      <g data-k="lunstk">${pointer(RIGHT.psiU, 161, two(RIGHT.psiU, 'lf-c-psi', 'photosystem I', '(PSI)'), [RIGHT.psiU, 196, RIGHT.psiU, LAM_Y - 28])}
        ${pointer(RIGHT.atpU, 188, '<tspan class="lf-c-atp">ATP synthase</tspan>', [RIGHT.atpU, 196, RIGHT.atpU, LAM_Y - 108])}${headSvg()}</g>
      ${T(1195, LAM_Y + MEM + LUM / 2 + 8, 'lumen', 'lf-lab', 'middle')}${T(1195, 612, 'stroma', 'lf-lab', 'middle')}
    </g></g>`;
    return `${defs}${b2}${b1}${b0}`;
  };

  function bind(stage: SVGSVGElement): (beat: number, t: number) => void {
    const q = <E extends Element = SVGElement>(k: string): E => stage.querySelector(`[data-k="${k}"]`) as E;
    const memo = new Map<Element, Map<string, string>>();
    const set = (el: Element | null, a: string, v: string): void => {
      if (!el) return;
      let m = memo.get(el);
      if (!m) memo.set(el, (m = new Map()));
      if (m.get(a) === v) return;
      m.set(a, v);
      el.setAttribute(a, v);
    };
    const op = (el: Element | null, v: number): void => {
      if (!el) return;
      set(el, 'opacity', v >= 0.996 ? '1' : clamp01(v).toFixed(3));
      set(el, 'display', v < 0.004 ? 'none' : 'inline');
    };
    const printM = q('printm');

    /* ---- beat 1: only the chloroplasts move. */
    const CELLS: Array<{ id: string; cx: number; end: number[]; stag: number[] }> = [
      { id: 'cd', cx: CX_DIM, end: FACE, stag: STAG_D }, { id: 'cb', cx: CX_BRI, end: SIDE, stag: STAG_B },
    ];
    const chlLead = q('l0chl')?.querySelector('path') ?? null;
    function beat0(t: number): void {
      const m = M(0);
      CELLS.forEach(c => {
        for (let i = 0; i < 8; i++) {
          const e = smooth((t - m - c.stag[i]) / CP_SLIDE), p = perim(lerp(START[i], c.end[i], e));
          set(q(`${c.id}${i}`), 'transform', `translate(${f1(c.cx + p.x)} ${f1(CY0 + p.y)}) rotate(${f1(p.a)})`);
        }
      });
      // The "chloroplast" label stays put; its leader keeps to its chloroplast, on the top wall, which moves only a little.
      const e3 = smooth((t - m - STAG_D[3]) / CP_SLIDE), c3 = perim(lerp(START[3], FACE[3], e3));
      const st: V = [CX_DIM - 30, 370], cp: V = [CX_DIM + c3.x, CY0 + c3.y], d = Math.hypot(cp[0] - st[0], cp[1] - st[1]);
      set(chlLead, 'd', `M${f1(st[0])},${f1(st[1])}L${f1(cp[0] - (15 * (cp[0] - st[0])) / d)},${f1(cp[1] - (15 * (cp[1] - st[1])) / d)}`);
      // "side walls" in the bright cell, once its chloroplasts are there.
      const done = m + Math.max(...STAG_B) + CP_SLIDE;
      op(q('l0side'), tw(t, done - 0.1, done + 0.25));
    }

    /* ---- beat 2: only the stacks build up. */
    function beat1(t: number): void {
      const m = M(1);
      const grow = (i: number, g: Granum): number => lerp(N0, g.n, smoother((t - m - (i % 4) * 0.12) / GR_BUILD));
      ([['s', 'shade', CH_SHADE, SHADE], ['u', 'sun', CH_SUN, SUN]] as Array<[string, 'shade' | 'sun', V, Granum[]]>).forEach(([id, kind, c, gs]) => {
        const g = thylakoids(kind, c, i => grow(i, gs[i]));
        set(q(`${id}lam`), 'd', g.lam); set(q(`${id}gr`), 'd', g.gr); set(q(`${id}grl`), 'd', g.grl);
      });
    }

    /* ---- beat 3: click 1, PSII and LHCII fade into the stacked membranes; click 2, PSI and ATP synthase into the lamella. */
    function beat2(t: number): void {
      const m = M(2), ks = tw(t, m + B3.stacked[0], m + B3.stacked[1]), ku = tw(t, m + B3.unstacked[0], m + B3.unstacked[1]);
      op(q('stk'), ks); op(q('lstk'), ks);
      op(q('unstk'), ku); op(q('lunstk'), ku);
    }

    return (beatIn: number, t0: number) => {
      const b = Math.max(0, Math.min(2, Math.round(beatIn)));
      const t = Math.max(0, t0);
      // Each scene is drawn at its own state; the previous one, at its end, cross-fades out over the first 0.45 s.
      const draws = [beat0, beat1, beat2];
      draws[b](Math.min(t, TEND[b] + 0.01));
      const prev = b > 0 && t < 0.45 ? b - 1 : -1;
      if (prev >= 0) draws[prev](TEND[prev] + 0.01);
      for (let k = 0; k < 3; k++) {
        const o = k === b ? (b === 0 && !B ? 1 : tw(t, 0.15, 0.5)) : k === prev ? 1 - tw(t, 0, 0.4) : 0;
        op(q(`b${k}`), o);
      }
      // Look B: the sheet lies small and tilted on the desk, printed in grey ink; it opens out and takes its colours.
      if (B) {
        const e = smoother((t - OPEN_B[0]) / (OPEN_B[1] - OPEN_B[0]));
        for (let k = 0; k < 3; k++) {
          const ek = k === b ? e : 1;
          set(q(`b${k}c`), 'transform', ek >= 0.999 ? '' : `translate(800 380) rotate(${(-3 * (1 - ek)).toFixed(2)}) scale(${lerp(0.62, 1, ek).toFixed(4)}) translate(-800 -380)`);
        }
        const kc = tw(t, OPEN_B[0] + 0.4, OPEN_B[1]);
        if (printM) set(printM, 'values', kc.toFixed(3));
        for (let k = 0; k < 3; k++) set(q(`b${k}c`), 'filter', k === b && kc < 0.999 ? `url(#${P}-print)` : '');
      }
    };
  }

  return {
    id: look,
    name: B ? 'B · Newspaper desk' : 'A · Side by side',
    note: B ? 'Each beat opens from its newsprint sheet on the desk, then plays its one motion; dim and bright side by side.'
      : 'Two clean panels per beat, dim and bright side by side; one click per beat, one motion per beat.',
    // Beats 1 and 2 play in one click; beat 3 stops once, after the stacked side has filled.
    holds: [[], [], [(B ? MOVE_B : MOVE_A[2]) + B3.stop]],
    svg,
    bind,
  };
}

export const STAGING: Staging = makeStaging('a');
