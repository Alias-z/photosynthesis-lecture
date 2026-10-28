// Into the leaf (slide 5), staging A "Side by side", and the scenes shared with staging B "Newspaper desk" (leaf-b.ts).
// Three beats, each one scene with dim and bright light side by side (27 Oct 2026, lecturer): no dive between scales,
// the camera moves only inside a scene, and scenes change by cross-fading at their own size.
// 1. Chloroplasts move: a mesophyll cell in dim light and one in bright light, light arrows from above. The chloroplasts
//    start spread along all four walls; in dim light they slide to the walls that face the light (top and bottom), in
//    bright light to the side walls (as in Wada 2016, Fig. 1A). Gustav Senn's halftone portrait and his own 1895 drawing
//    of moving chloroplasts lead the beat.
// 2. Grana: a shade and a sun chloroplast drawn at the same scale, then real micrographs of a shade orchid grown at 5 %
//    and 50 % light (Shao et al. 2014), shown at the drawings' magnification.
// 3. Stacked and unstacked: a side view of grana membranes with PSII and its antenna, and the stroma lamella between two
//    stacks with PSI and ATP synthase, whose stromal parts stick out far more than the 3–4 nm gap between stacked
//    membranes. Shapes drawn after the in-situ structures of Wietrzynski et al. 2020 (eLife 9: e53740, Fig. 2A).
// Physical sizes:
// - Cell 32 µm × 36 µm, chloroplasts 5 µm × 2 µm (12 px per µm).
// - Chloroplasts 5 µm × 2.2 µm at 128 px per µm; grana 0.35–0.6 µm across; thylakoid repeat in a granum 17.5 nm. Shade
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
import { clipHeight, clipping, type Clip } from '../figs/clipping';
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
const easeOut = (x: number): number => { const u = clamp01(x); return 1 - (1 - u) ** 3; };
const lerp = (a: number, b: number, e: number): number => a + (b - a) * e;
/** 0 → 1 over the time window [t0, t1]. */
const tw = (t: number, t0: number, t1: number): number => smooth((t - t0) / (t1 - t0));
const T = (x: number, y: number, s: string, cls: string, anchor: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}"${k ? ` data-k="${k}"` : ''}>${s}</text>`;
/** A view: scene point a shown at stage point b, at scale s. */
interface View { s: number; a: V; b: V }
const viewT = (v: View): string => `translate(${f1(v.b[0] - v.s * v.a[0])} ${f1(v.b[1] - v.s * v.a[1])}) scale(${v.s.toFixed(4)})`;
const at = (v: View, p: V): V => [v.b[0] + v.s * (p[0] - v.a[0]), v.b[1] + v.s * (p[1] - v.a[1])];
const lerpView = (p: View, q: View, e: number): View => ({
  s: p.s * (q.s / p.s) ** e, a: [lerp(p.a[0], q.a[0], e), lerp(p.a[1], q.a[1], e)], b: [lerp(p.b[0], q.b[0], e), lerp(p.b[1], q.b[1], e)],
});
type Box = [number, number, number, number];
/** Moves something drawn in box `home` (x, y, w, h) to box `away`, scaled by width: e = 0 leaves it at home, e = 1 puts it
 *  in `away`, turned by `rot` degrees. For things that travel between two layouts. */
const boxT = (home: Box, away: Box, e: number, rot = 0): string => {
  const s = (away[2] / home[2]) ** e, cx = lerp(home[0] + home[2] / 2, away[0] + away[2] / 2, e), cy = lerp(home[1] + home[3] / 2, away[1] + away[3] / 2, e);
  return `translate(${f1(cx)} ${f1(cy)}) rotate(${(rot * e).toFixed(2)}) scale(${s.toFixed(4)}) translate(${f1(-(home[0] + home[2] / 2))} ${f1(-(home[1] + home[3] / 2))})`;
};

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

/** Senn's clipping: halftone portrait, name, year and what he showed (on the key line, which has room for it). */
export const SENN: Clip = { name: 'Gustav Senn', year: '1908', finding: '', key: 'chloroplasts move', photo: senn, alt: senn };

/* ================================================================ beat 1: two cells */

const CY0 = 432; // cells' centre y
export const CX_DIM = 350, CX_BRI = 1250;
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
/** Half thickness of the chloroplast at x (µm), inside the inner envelope. */
const halfAt = (x: number): number => (CPL.b - 0.05) * Math.sqrt(Math.max(0, 1 - (x / (CPL.a - 0.05)) ** 2));

/** A chloroplast at (cx, cy), k px per µm: envelope (two membranes), stroma, grana and the lamellae between them. */
function chloroSvg(kind: 'shade' | 'sun', cx: number, cy: number, k: number): string {
  const X = (u: number): number => cx + u * k, Y = (v: number): number => cy + v * k;
  const grana = kind === 'shade' ? SHADE : SUN;
  let lam = '';
  if (kind === 'sun') {
    // Long lamellae along four planes, running through the grana.
    SUN_PLANES.forEach(p => { const L = (CPL.a - 0.05) * Math.sqrt(1 - (p / (CPL.b - 0.05)) ** 2) - 0.06; lam += `M${f1(X(-L))},${f1(Y(p))}L${f1(X(L))},${f1(Y(p))}`; });
    // and a few links between the planes
    [[-1.35, -0.62, -0.9, -0.21], [0.45, -0.62, 1.05, -0.21], [-0.9, -0.21, -0.5, 0.21], [1.05, -0.21, 1.5, 0.21], [-0.5, 0.21, 0, 0.62], [0.55, 0.21, 1.0, 0.62]]
      .forEach(([x0, y0, x1, y1]) => { lam += `M${f1(X(x0 + 0.15))},${f1(Y(y0))}C${f1(X(x0 + 0.35))},${f1(Y(y0))} ${f1(X(x1 - 0.35))},${f1(Y(y1))} ${f1(X(x1 - 0.15))},${f1(Y(y1))}`; });
  } else {
    // Each granum of the upper row is linked to its neighbours below, from its lower thylakoids to their upper ones.
    const up = SHADE.slice(0, 4), lo = SHADE.slice(4, 7), ends = SHADE.slice(7);
    const link = (g: Granum, h: Granum, fromLow: boolean, dy: number): void => {
      const sx = g.x < h.x ? 1 : -1, ya = g.y + (fromLow ? 1 : -1) * ((g.n * REP) / 2 - dy), yb = h.y + (fromLow ? -1 : 1) * ((h.n * REP) / 2 - dy);
      const xa = g.x + sx * g.w / 2, xb = h.x - sx * h.w / 2;
      lam += `M${f1(X(xa))},${f1(Y(ya))}C${f1(X(lerp(xa, xb, 0.5)))},${f1(Y(ya))} ${f1(X(lerp(xa, xb, 0.5)))},${f1(Y(yb))} ${f1(X(xb))},${f1(Y(yb))}`;
    };
    up.forEach(g => lo.forEach(h => { if (Math.abs(g.x - h.x) < 0.6) { link(g, h, true, 0.06); link(g, h, true, 0.16); } }));
    link(ends[0], up[0], false, 0.03); link(ends[0], lo[0], false, 0.03); link(up[3], ends[1], true, 0.05); link(lo[2], ends[1], true, 0.05);
    lo.forEach((g, i) => { if (i < 2) link(g, lo[i + 1], true, 0.12); });
    up.forEach((g, i) => { if (i < 3) link(g, up[i + 1], true, 0.2); });
  }
  const stacks = grana.map(g => {
    const h = g.n * REP, x0 = X(g.x - g.w / 2), y0 = Y(g.y - h / 2), w = g.w * k, hp = h * k;
    let lines = '';
    for (let i = 1; i < g.n; i++) lines += `M${f1(x0 + 1.5)},${f1(y0 + (i * hp) / g.n)}h${f1(w - 3)}`;
    return `<rect class="lf-gr" x="${f1(x0)}" y="${f1(y0)}" width="${f1(w)}" height="${f1(hp)}" rx="${f1(Math.min(3, hp / 2))}"/><path class="lf-grl" d="${lines}"/>`;
  }).join('');
  return `<ellipse class="lf-env" cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(CPL.a * k)}" ry="${f1(CPL.b * k)}"/>
    <ellipse class="lf-env2" cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(CPL.a * k - 4)}" ry="${f1(CPL.b * k - 4)}"/>
    <path class="lf-lam" d="${lam}" style="stroke-width:${f1(0.016 * k)}"/>${stacks}`;
}
const K2 = 128; // px per µm
export const CH_SHADE: V = [420, 400], CH_SUN: V = [1180, 400];
/** Step 2: each chloroplast shrinks to 0.75 and moves up; the micrographs, at the same magnification, go below. */
const S2B = 0.75, CH_Y2 = 286;
/** The micrographs: 2.9 µm × 2.6 µm fields, so 0.75 × 128 = 96 px per µm gives 278 × 250 px. */
export const TEM_W = 278, TEM_H = 249, TEM_Y = 418;
const TEM_X = (cx: number): number => cx - TEM_W / 2;

/* ================================================================ beat 3: membranes */

const NM = 7; // px per nm
const MEM = 4.5 * NM, LUM = 7 * NM, THY = 2 * MEM + LUM, GAP = 3.5 * NM, REPM = THY + GAP;
const YL = 325; // top of the unstacked thylakoid (the stroma lamella), which runs through both stacks
const XL = 520, XR = 1080; // the stacks' margins
const tyTop = (j: number): number => YL + j * REPM;

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

/** A thylakoid's sac from x0 to x1 with a rounded margin on the given ends; its two membranes and its lumen. */
function sac(x0: number, x1: number, y: number, roundL: boolean, roundR: boolean): string {
  const shape = (a: number, b: number, top: number, h: number): string => {
    const r = h / 2;
    const L = roundL ? `M${f1(a + r)},${f1(top)}` : `M${f1(a)},${f1(top)}`;
    const right = roundR ? `H${f1(b - r)}A${f1(r)},${f1(r)} 0 0 1 ${f1(b - r)},${f1(top + h)}` : `H${f1(b)}V${f1(top + h)}`;
    const left = roundL ? `H${f1(a + r)}A${f1(r)},${f1(r)} 0 0 1 ${f1(a + r)},${f1(top)}Z` : `H${f1(a)}Z`;
    return `${L}${right}${left}`;
  };
  return `<path class="lf-mem" d="${shape(x0, x1, y, THY)}"/><path class="lf-lum" d="${shape(x0 + (roundL ? MEM : 0), x1 - (roundR ? MEM : 0), y + MEM, LUM)}"/>`;
}
/** PSII and LHCII along one stacked membrane between x0 and x1; `ph` shifts the pattern, so facing membranes differ. */
function stackRow(x0: number, x1: number, yS: number, dir: number, ph: number): string {
  // LHCII, PSII, LHCII, then a stretch of bare lipid, so the bilayer shows between the complexes.
  const items: Array<['L' | 'P' | '-', number]> = [['L', 48], ['P', 140], ['L', 48], ['-', 44]];
  let x = x0 - ph, out = '';
  for (let n = 0; x < x1 && n < 60; n++) {
    const [kind, w] = items[n % items.length], c = x + w / 2;
    if (kind !== '-' && x >= x0 && x + w <= x1) out += kind === 'P' ? psii(c, yS, dir) : lhc(c, yS, dir);
    x += w + 6;
  }
  return out;
}
/** PSI and ATP synthase on the stroma lamella: [kind, x, upper membrane?]. */
const LAMELLA: Array<['psi' | 'atp', number, boolean]> = [['atp', 680, true], ['psi', 860, true], ['atp', 1010, true], ['psi', 615, false], ['atp', 790, false], ['psi', 965, false]];

function membraneSvg(): string {
  let sacs = '', cx = '';
  for (let j = -2; j <= 3; j++) {
    const y = tyTop(j);
    if (j === 0) sacs += sac(-400, 2000, y, false, false);
    else sacs += sac(-400, XL, y, false, true) + sac(XR, 2000, y, true, false);
    // PSII and its antenna in the stacked parts (the lamella's too, where it runs through a stack).
    // The margins (the last 120 px of each stack) are left bare, so the gap mark sits on clean membranes.
    const ph = (((j + 2) * 97) % 290) + 20;
    cx += stackRow(-380, XL - 120, y, 1, ph) + stackRow(-380, XL - 120, y + THY, -1, ph + 145);
    cx += stackRow(XR + 120, 1980, y, 1, ph + 60) + stackRow(XR + 120, 1980, y + THY, -1, ph + 205);
  }
  const lam = LAMELLA.map(([k, x, up], i) => `<g data-k="lam${i}">${(k === 'psi' ? psi : atp)(x, up ? YL : YL + THY, up ? 1 : -1)}</g>`).join('');
  return `${sacs}${cx}${lam}`;
}
/** The 3–4 nm gap between stacked membranes and the 10 nm ATP synthase head, as dimension marks. */
const GAP_X = 430, HEAD_X = 727;
const dimSvg = (): string => `
  <g data-k="dgap"><path class="lf-dim" d="M${GAP_X - 9},${YL - GAP}H${GAP_X + 9}M${GAP_X - 9},${YL}H${GAP_X + 9}M${GAP_X},${YL - GAP}V${YL}"/>
    <path class="lf-lead" d="M${GAP_X + 12},${YL - GAP / 2}H${XL + 22}"/>${T(XL + 30, YL - GAP / 2 + 8, '3–4 nm', 'lf-dimt')}</g>
  <g data-k="dhead"><path class="lf-dim" d="M${HEAD_X - 6},${YL - 105}H${HEAD_X + 6}M${HEAD_X - 6},${YL - 35}H${HEAD_X + 6}M${HEAD_X},${YL - 105}V${YL - 35}"/>
    ${T(HEAD_X + 12, YL - 62, '10 nm', 'lf-dimt')}</g>`;

/* ================================================================ labels */

const lab = (k: string, s: string, anchor: 'start' | 'middle' | 'end' = 'middle', cls = 'lf-lab'): string =>
  `<g data-k="${k}"><path class="lf-lead" d=""/><text class="${cls}" text-anchor="${anchor}">${s}</text></g>`;
const pill = (x: number, y: number, s: string): string => {
  const w = s.length * 12 + 26;
  return `<rect class="lf-pillbg" x="${x}" y="${y}" width="${w}" height="34" rx="17"/>${T(x + w / 2, y + 24, s, 'lf-pill', 'middle')}`;
};
const photo = (P: string, k: string, href: string, x: number, y: number, w: number, h: number, tag: string): string =>
  `<g data-k="${k}"><clipPath id="${P}-${k}c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/></clipPath>
    <image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${P}-${k}c)"/>
    <rect class="lf-photo" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>${pill(x + 12, y + 12, tag)}</g>`;

/* ================================================================ timing */

// Look A: each scene comes in whole at 0.8–0.86 and the camera zooms in to it (0.2–2.8 s); then labels, one hold, and
// the teaching motion. Look B: each beat opens on its clipping or plate lying on the desk (one hold), then the scene opens
// out of it, then the same content.
const ZOOM_A = [0.2, 3.0];
const R_A = 3.0; // look A: when each scene stands
const HOLD_A = [3.3, 3.4, 3.5];
const TEND_A = [7.2, 5.9, 6.0];
const HOLD_B = [0.6, 0.9, 0.9];
const OPEN_B: Array<[number, number]> = [[0.6, 2.1], [0.9, 2.4], [0.9, 2.4]];
const TEND_B = [6.6, 3.0, 5.0];
/** Beat 3: PSI and ATP synthase slide in along the lamella, from this many seconds after the step starts. */
const SLIDE = { dur: 1.3, stag: 0.2 };

/* ================================================================ the staging */

export function makeStaging(look: Look): Staging {
  const P = `lf${look}`;
  const B = look === 'b';

  // Senn's two clippings: final place (both looks) in the column between the two cells; look B opens with them large.
  const PW = 242, PH_ = clipHeight(PW, SENN), PX = 800 - PW / 2, PY = 92;
  const DW = 258, DH = DW * 0.9 * (475 / 739) + DW * 0.1, DX = 800 - DW / 2, DY = PY + PH_ + 22;
  const PORT_F: Box = [PX, PY, PW, PH_], PORT_I: Box = [330, 140, 300, (300 / PW) * PH_];
  const DRAW_F: Box = [DX, DY, DW, DH], DRAW_I: Box = [700, 200, 590, (590 / DW) * DH];
  const FULL0: Box = [60, 56, 1480, 634];
  const sennDrawing = (): string => {
    const m = DW * 0.05, iw = DW - 2 * m, ih = iw * (475 / 739);
    return `<g class="clip" transform="rotate(1.5 ${f1(DX + DW / 2)} ${f1(DY + DH / 2)})">
      <path class="clip-paper" d="${cutPath(DX, DY, DW, DH, 23)}" filter="url(#${P}-sh)"/>
      <image href="${senn1895}" x="${f1(DX + m)}" y="${f1(DY + m)}" width="${f1(iw)}" height="${f1(ih)}" preserveAspectRatio="xMidYMid slice"/></g>`;
  };

  // Beat 2 in look B opens on the micrographs side by side, large, on a plate; beat 3 on a plate of the three complexes.
  const TEM_F_SH: Box = [TEM_X(CH_SHADE[0]), TEM_Y, TEM_W, TEM_H], TEM_F_SU: Box = [TEM_X(CH_SUN[0]), TEM_Y, TEM_W, TEM_H];
  const TEM_I_SH: Box = [330, 170, 450, (450 / TEM_W) * TEM_H], TEM_I_SU: Box = [820, 170, 450, (450 / TEM_W) * TEM_H];
  const plateSvg = (k: string, x: number, y: number, w: number, h: number, seed: number, inner = ''): string =>
    `<g data-k="${k}"><path class="lfb-paper" d="${cutPath(x, y, w, h, seed)}" filter="url(#${P}-sh)"/>${inner}</g>`;
  // The complexes plate: PSII with its antenna, PSI and ATP synthase on one membrane, at the scene's scale, with a 10 nm bar.
  const cplxPlate = (): string => {
    const yS = 380, items = `${lhc(392, yS, 1)}${psii(486, yS, 1)}${lhc(580, yS, 1)}${psi(800, yS, 1)}${atp(1080, yS, 1)}`;
    return `<rect class="lf-mem" x="300" y="${yS}" width="1000" height="${MEM}"/>${items}
      ${T(486, 500, 'PSII + antenna', 'lf-lab', 'middle')}${T(800, 500, 'PSI', 'lf-lab', 'middle')}${T(1080, 500, 'ATP synthase', 'lf-lab', 'middle')}
      <path class="lf-dim" d="M330,240H400M330,232V248M400,232V248"/>${T(365, 222, '10 nm', 'lf-dimt', 'middle')}`;
  };

  const svg = (): string => {
    const defs = `<defs>
      <marker id="${P}-hd" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path fill="#e3a51c" d="M0,0L10,5L0,10z"/></marker>
      <marker id="${P}-hb" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto"><path fill="#e3a51c" d="M0,0L10,5L0,10z"/></marker>
      <filter id="${P}-sh" x="-15%" y="-10%" width="130%" height="125%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter>
      <filter id="${P}-print" x="0" y="0" width="100%" height="100%"><feColorMatrix data-k="printm" type="saturate" values="0"/></filter>
      <filter id="${P}-grey" x="0" y="0" width="100%" height="100%"><feColorMatrix type="saturate" values="0"/></filter>
      <linearGradient id="${P}-mh" x1="60" x2="1540" y1="0" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".055" stop-color="#fff"/><stop offset=".945" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${P}-mv" x1="0" x2="0" y1="112" y2="692" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".1" stop-color="#fff"/><stop offset=".9" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <mask id="${P}-mmh" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="740"><rect x="0" y="0" width="1600" height="740" fill="url(#${P}-mh)"/></mask>
      <mask id="${P}-mmv" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="740"><rect x="0" y="0" width="1600" height="740" fill="url(#${P}-mv)"/></mask>
      <clipPath id="${P}-pl"><rect x="62" y="58" width="716" height="630" rx="14"/></clipPath>
      <clipPath id="${P}-pr"><rect x="822" y="58" width="716" height="630" rx="14"/></clipPath>
    </defs>`;

    // Beat 1: the two cells, the light, Senn.
    const sheet = (seed: number): string => (B ? `<path class="lfb-paper" d="${cutPath(36, 26, 1528, 688, seed)}" filter="url(#${P}-sh)"/>` : '');
    const b0 = `<g data-k="b0">
      <g data-k="b0c">${sheet(31)}
        <rect class="lf-frame" x="60" y="56" width="580" height="634" rx="14"/><rect class="lf-frame" x="960" y="56" width="580" height="634" rx="14"/>
        ${T(CX_DIM, 98, 'dim light', 'lf-head', 'middle')}${T(CX_BRI, 98, 'bright light', 'lf-head', 'middle')}
        <g data-k="v0d">${cellSvg('cd', CX_DIM)}</g><g data-k="v0b">${cellSvg('cb', CX_BRI)}</g>
        ${arrowsSvg(P, 'ad', CX_DIM, false)}${arrowsSvg(P, 'ab', CX_BRI, true)}
        ${lab('l0chl', 'chloroplast')}${lab('l0wall', 'cell wall')}
      </g>
      <g data-k="sennP">${clipping(`${P}s`, PX, PY, PW, SENN, -2, 13)}</g>
      <g data-k="sennD">${sennDrawing()}</g>
    </g>`;

    // Beat 2: shade and sun chloroplasts, then the micrographs.
    const b1 = `<g data-k="b1">
      ${B ? plateSvg('pl1', 290, 130, 1020, 470, 9) : ''}
      <g data-k="b1c">${sheet(37)}
        <rect class="lf-frame" x="60" y="56" width="720" height="634" rx="14"/><rect class="lf-frame" x="820" y="56" width="720" height="634" rx="14"/>
        ${T(CH_SHADE[0], 98, 'shade leaf', 'lf-head', 'middle')}${T(CH_SUN[0], 98, 'sun leaf', 'lf-head', 'middle')}
        <g clip-path="url(#${P}-pl)"><g data-k="v1s">${chloroSvg('shade', CH_SHADE[0], CH_SHADE[1], K2)}</g></g>
        <g clip-path="url(#${P}-pr)"><g data-k="v1u">${chloroSvg('sun', CH_SUN[0], CH_SUN[1], K2)}</g></g>
        ${lab('l1env', 'envelope')}${lab('l1gr', 'granum')}${lab('l1str', 'stroma')}
      </g>
      <g data-k="tem1">${photo(P, 'temS', temShade, ...TEM_F_SH, '5 % light')}</g>
      <g data-k="tem2">${photo(P, 'temU', temSun, ...TEM_F_SU, '50 % light')}</g>
    </g>`;

    // Beat 3: stacked and unstacked membranes.
    const b2 = `<g data-k="b2">
      ${B ? plateSvg('pl2', 260, 150, 1080, 420, 17, `<g filter="url(#${P}-grey)">${cplxPlate()}</g>`) : ''}
      <g data-k="b2c">${sheet(41)}
        <g mask="url(#${P}-mmh)"><g mask="url(#${P}-mmv)"><g data-k="v2">${membraneSvg()}${dimSvg()}</g></g></g>
        <text class="lf-head" x="80" y="92">stacked: <tspan class="lf-c-psii">PSII</tspan> + <tspan class="lf-c-lhc">antenna</tspan></text>
        <g data-k="l2un"><text class="lf-head" x="800" y="92" text-anchor="middle">unstacked: <tspan class="lf-c-psi">PSI</tspan>, <tspan class="lf-c-atp">ATP synthase</tspan></text></g>
        ${T(880, 640, 'stroma', 'lf-lab', 'middle', 'l2str')}${T(736, YL + MEM + LUM / 2 + 8, 'lumen', 'lf-lab', 'middle', 'l2lum')}
      </g>
    </g>`;
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
    /** A label: text at (x, y) and a leader from (lx, ly) to the thing at (ax, ay). */
    const place = (k: string, x: number, y: number, o: number, lead?: [number, number, number, number]): void => {
      const g = q(k), tx = g?.querySelector('text'), ld = g?.querySelector('path');
      op(g, o);
      if (o < 0.004) return;
      set(tx, 'x', f1(x)); set(tx, 'y', f1(y));
      set(ld, 'd', lead ? `M${f1(lead[0])},${f1(lead[1])}L${f1(lead[2])},${f1(lead[3])}` : '');
    };
    const printM = q('printm');

    /* ---- beat 1 */
    const CELLS: Array<{ id: string; cx: number; end: number[]; stag: number[] }> = [
      { id: 'cd', cx: CX_DIM, end: FACE, stag: STAG_D }, { id: 'cb', cx: CX_BRI, end: SIDE, stag: STAG_B },
    ];
    function beat0(t: number): void {
      const R = B ? OPEN_B[0][1] : R_A, zk = B ? 1 : smoother((t - ZOOM_A[0]) / (ZOOM_A[1] - ZOOM_A[0]));
      // Look A: the cells zoom in to their size. Look B: the panels open out of Senn's drawing.
      const s = lerp(0.86, 1, zk);
      set(q('v0d'), 'transform', viewT({ s, a: [CX_DIM, CY0], b: [CX_DIM, CY0] }));
      set(q('v0b'), 'transform', viewT({ s, a: [CX_BRI, CY0], b: [CX_BRI, CY0] }));
      const ko = B ? smoother((t - OPEN_B[0][0]) / (OPEN_B[0][1] - OPEN_B[0][0])) : 1;
      if (B) {
        // The two panels grow out of Senn's drawing while his clippings move to the middle column.
        set(q('b0c'), 'transform', boxT(FULL0, DRAW_I, 1 - ko, 1.5));
        op(q('b0c'), tw(t, OPEN_B[0][0], OPEN_B[0][0] + 0.6));
        set(q('sennP'), 'transform', boxT(PORT_F, PORT_I, 1 - ko, 1));
        set(q('sennD'), 'transform', boxT(DRAW_F, DRAW_I, 1 - ko));
        op(q('sennP'), 1); op(q('sennD'), 1);
      } else {
        // Senn's portrait, then his drawing, slide down into the middle column.
        const kp = tw(t, 0.9, 1.4), kd = tw(t, 1.3, 1.8);
        set(q('sennP'), 'transform', `translate(0 ${f1(-30 * (1 - kp))})`); op(q('sennP'), kp);
        set(q('sennD'), 'transform', `translate(0 ${f1(-30 * (1 - kd))})`); op(q('sennD'), kd);
      }
      // Light arrives from above, then the chloroplasts move.
      const tl = B ? 2.4 : HOLD_A[0], tm = tl + 0.5;
      ['ad', 'ab'].forEach(k => { const e = tw(t, tl, tl + 0.8); set(q(k), 'transform', `translate(0 ${f1(-60 * (1 - e))})`); op(q(k), e); });
      CELLS.forEach(c => {
        for (let i = 0; i < 8; i++) {
          const e = smooth((t - tm - c.stag[i]) / 3.0), p = perim(lerp(START[i], c.end[i], e));
          set(q(`${c.id}${i}`), 'transform', `translate(${f1(c.cx + p.x)} ${f1(CY0 + p.y)}) rotate(${f1(p.a)})`);
        }
      });
      // Labels: one chloroplast (followed as it moves) and the cell wall, in the dim cell.
      const lo = tw(t, R, R + 0.3), e2 = smooth((t - tm - STAG_D[2]) / 3.0), c2 = perim(lerp(START[2], FACE[2], e2));
      const st: V = [CX_DIM - 44, 372], cp: V = [CX_DIM + c2.x, CY0 + c2.y], d = Math.hypot(cp[0] - st[0], cp[1] - st[1]);
      place('l0chl', CX_DIM + 6, 392, lo, [st[0], st[1], cp[0] - (14 * (cp[0] - st[0])) / d, cp[1] - (14 * (cp[1] - st[1])) / d]);
      place('l0wall', CX_DIM + 6, 500, lo, [CX_DIM - 50, 492, CX_DIM - CELL_HW + 5, 456]);
    }

    /* ---- beat 2 */
    const L1 = {
      env: { a: [CH_SHADE[0] - 262, CH_SHADE[1] - 141 * Math.sqrt(1 - (262 / 320) ** 2)] as V, dx: -20 },
      gr: { a: [CH_SHADE[0] - 0.54 * K2, CH_SHADE[1] - (0.4 + 0.35) * K2 + 2] as V, dx: 30 },
      str: { a: [CH_SHADE[0] + 1.12 * K2, CH_SHADE[1] - 0.62 * K2] as V, dx: 70 },
    };
    function beat1(t: number): void {
      const R = B ? OPEN_B[1][1] : R_A, h = HOLD_A[1];
      const zk = B ? 1 : smoother((t - ZOOM_A[0]) / (ZOOM_A[1] - ZOOM_A[0]));
      // Step 2 (look A): the chloroplasts shrink and move up, and the micrographs come in below. Look B starts there.
      const m2 = B ? 1 : smoother((t - h) / 2.0);
      const v1: View = { s: 0.78, a: CH_SHADE, b: CH_SHADE }, v2: View = { s: 1, a: CH_SHADE, b: CH_SHADE }, v3: View = { s: S2B, a: CH_SHADE, b: [CH_SHADE[0], CH_Y2] };
      const vs = m2 > 0 ? lerpView(v2, v3, m2) : lerpView(v1, v2, zk);
      const vu: View = { s: vs.s, a: CH_SUN, b: [CH_SUN[0], vs.b[1]] };
      set(q('v1s'), 'transform', viewT(vs)); set(q('v1u'), 'transform', viewT(vu));
      // Labels on the shade chloroplast: above it, before and after the move (hidden while it moves).
      const loA = B ? tw(t, R, R + 0.3) : tw(t, R, R + 0.3) * (1 - tw(t, h, h + 0.25)) + tw(t, h + 2.0, h + 2.3);
      const ly = m2 > 0.5 ? 150 : 240;
      (Object.keys(L1) as Array<keyof typeof L1>).forEach(k => {
        const a = at(vs, L1[k].a), x = a[0] + L1[k].dx;
        place(k === 'env' ? 'l1env' : k === 'gr' ? 'l1gr' : 'l1str', x, ly, loA, [x, ly + 8, a[0], a[1]]);
      });
      // The micrographs: look A fades them in under the drawings; look B opens on them, large, on a plate.
      if (B) {
        const ko = smoother((t - OPEN_B[1][0]) / (OPEN_B[1][1] - OPEN_B[1][0]));
        set(q('tem1'), 'transform', boxT(TEM_F_SH, TEM_I_SH, 1 - ko)); set(q('tem2'), 'transform', boxT(TEM_F_SU, TEM_I_SU, 1 - ko));
        op(q('tem1'), 1); op(q('tem2'), 1);
        op(q('pl1'), 1 - tw(t, OPEN_B[1][0], OPEN_B[1][0] + 0.5));
        op(q('b1c'), tw(t, OPEN_B[1][0] + 0.5, OPEN_B[1][1]));
        set(q('b1c'), 'transform', `translate(800 ${f1(lerp(250, 0, ko))}) scale(${lerp(0.6, 1, ko).toFixed(4)}) translate(-800 0)`);
      } else {
        op(q('tem1'), tw(t, h + 1.7, h + 2.1)); op(q('tem2'), tw(t, h + 1.8, h + 2.2));
      }
    }

    /* ---- beat 3 */
    function beat2(t: number): void {
      const R = B ? OPEN_B[2][1] : R_A, h = HOLD_A[2];
      const zk = B ? 1 : smoother((t - ZOOM_A[0]) / (ZOOM_A[1] - ZOOM_A[0]));
      set(q('v2'), 'transform', viewT({ s: lerp(0.82, 1, zk), a: [800, 380], b: [800, 380] }));
      if (B) {
        const ko = smoother((t - OPEN_B[2][0]) / (OPEN_B[2][1] - OPEN_B[2][0]));
        op(q('pl2'), 1 - tw(t, OPEN_B[2][0], OPEN_B[2][0] + 0.6));
        set(q('pl2'), 'transform', `translate(800 370) scale(${lerp(1, 1.12, ko).toFixed(4)}) translate(-800 -370)`);
        op(q('b2c'), tw(t, OPEN_B[2][0] + 0.3, OPEN_B[2][1]));
        set(q('b2c'), 'transform', `translate(800 370) scale(${lerp(0.7, 1, ko).toFixed(4)}) translate(-800 -370)`);
      }
      // Labels and the gap mark when the scene stands; then PSI and ATP synthase slide in along the lamella.
      ['l2str', 'l2lum', 'dgap'].forEach((k, i) => op(q(k), tw(t, R + 0.1 * i, R + 0.3 + 0.1 * i)));
      // Look A after its hold; look B right after the scene has opened.
      const s2 = B ? R + 0.3 : h;
      LAMELLA.forEach((_, i) => {
        const t0 = s2 + SLIDE.stag * i, e = easeOut((t - t0) / SLIDE.dur), dx = (i % 2 ? 1 : -1) * 90 * (1 - e);
        set(q(`lam${i}`), 'transform', `translate(${f1(dx)} 0)`); op(q(`lam${i}`), tw(t, t0, t0 + 0.3));
      });
      const sEnd = s2 + SLIDE.stag * 5 + SLIDE.dur;
      op(q('l2un'), tw(t, sEnd - 0.7, sEnd - 0.4));
      op(q('dhead'), tw(t, sEnd - 0.4, sEnd - 0.1));
    }

    return (beatIn: number, t0: number) => {
      const b = Math.max(0, Math.min(2, Math.round(beatIn)));
      const t = Math.max(0, t0);
      const ends = B ? TEND_B : TEND_A;
      // Each scene is drawn at its own state; the previous one, at its end, cross-fades out over the first 0.45 s.
      const draws = [beat0, beat1, beat2];
      draws[b](Math.min(t, ends[b] + 0.01));
      const prev = b > 0 && t < 0.45 ? b - 1 : -1;
      if (prev >= 0) draws[prev](ends[prev] + 0.01);
      for (let k = 0; k < 3; k++) {
        const o = k === b ? (b === 0 ? 1 : tw(t, 0.15, 0.5)) : k === prev ? 1 - tw(t, 0, 0.4) : 0;
        op(q(`b${k}`), o);
      }
      // Look B: a scene still on its clipping is printed in grey ink; it takes its colours as it opens.
      if (B && printM) {
        const ko = tw(t, OPEN_B[b][0] + 0.2, OPEN_B[b][1]);
        set(printM, 'values', ko.toFixed(3));
        const cont = q(`b${b}c`);
        set(cont, 'filter', ko >= 0.999 ? '' : `url(#${P}-print)`);
      }
    };
  }

  return {
    id: look,
    name: B ? 'B · Newspaper desk' : 'A · Side by side',
    note: B ? 'Each beat opens on its clipping on the desk; the scene opens out of it, dim and bright side by side.'
      : 'Two clean panels per beat, dim and bright side by side; the camera zooms into each scene.',
    holds: (B ? HOLD_B : HOLD_A).map(h => [h]),
    svg,
    bind,
  };
}

export const STAGING: Staging = makeStaging('a');
