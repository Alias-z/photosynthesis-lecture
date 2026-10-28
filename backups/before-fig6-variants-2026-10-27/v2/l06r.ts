// Slide 6 · round 3 (r1–r5, 27 Oct 2026): real images mixed with drawings, in the direction the lecturer picked on
// board L3 (a: Emerson; i: Kouřil et al. 2012's energy-transfer routes) and with the slide-6 animation's own assets.
//
// Images (credits; full lines in the report for assets/SOURCES.md):
// - psii-*.webp: our render of the pea PSII–LHCII supercomplex C₂S₂M₂, PDB 5XNL (Su et al. 2017, Science 357:815), seen
//   from the stroma; layers and frame as in anim/antenna-common.ts (1600 × 1000 render px, 4 px per Å). base = all chains
//   pale grey; lhcii, minor, core, rc = the lit monomer's LHCII trimers, CP24/26/29, CP43/47, D1/D2, tinted.
// - Pigment positions and the 19-hop path: anim/antenna-data.ts (Mg of each chlorophyll; carotenoid end atoms; 5XNL).
// - emerson-nas.png, arnold-nas.png: halftones of the portraits in the NAS Biographical Memoirs (Rabinowitch 1961;
//   Govindjee & Srivastava 2014), © National Academy of Sciences.
// - ea1932-fig1.png: Emerson & Arnold 1932, J Gen Physiol 16:191, Fig. 1 (yield per flash against flash intensity); its
//   own axis lettering is clipped off here and relabelled in the deck's font.
//
// Physics kept honest:
// - Only energy moves in the antenna (amber); the reaction centre traps it by charge separation (+ –).
// - Downhill only Chl b → Chl a (650 → ≈ 678 nm, 0.08 eV). Among the Chl a (676–680 nm) the levels are nearly flat, so the
//   energy spreads back and forth (double-headed hops) until P680 (680 nm, about level) traps it. E = 1239.84 eV·nm / λ.
// - The carotenoid level is its absorbing state, ≈ 490 nm (lutein in LHCII ≈ 490–495 nm); it hands energy to Chl.
// - r2: exactly 300 chlorophyll dots round one reaction centre (the photosynthetic unit of the page text).
// - r5: sun = the C₂S₂M₂ supercomplex as solved (5XNL); shade = the same plus two loosely bound LHCII trimers per
//   monomer (positions schematic). The Chl a/b values are leaf values (they include PSI); see the report for the estimate.
import './l06r.css';
import { CAR, CHL, PATH } from '../anim/antenna-data';
import { ARNOLD, cutPath, EMERSON, FIG1, FIG1_AR, P680 } from '../anim/antenna-common';
import aBase from '../../assets/anim/antenna/psii-base.webp';
import aCore from '../../assets/anim/antenna/psii-core.webp';
import aLhcii from '../../assets/anim/antenna/psii-lhcii.webp';
import aMinor from '../../assets/anim/antenna/psii-minor.webp';
import aRc from '../../assets/anim/antenna/psii-rc.webp';
import { mulberry } from '../../lib/canvas';
import { arrow } from '../mechanisms';
import { defs, glow, hop, pig, qAt, rc, type Arc } from './s6';

type V = [number, number];
type A = 'start' | 'middle' | 'end';
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls: string, a: A = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const CHL_A = 'Chl <tspan font-style="italic">a</tspan>';
const CHL_B = 'Chl <tspan font-style="italic">b</tspan>';
const svgR = (label: string, body: string): string =>
  `<svg class="fig-svg fl06r" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;
const circ = (x: number, y: number, r: number): string => `M${f(x - r)},${f(y)}a${f(r)},${f(r)} 0 1 0 ${f(2 * r)},0a${f(r)},${f(r)} 0 1 0 ${f(-2 * r)},0`;

/* ================================================================ the structure (PDB 5XNL), shared by r1, r4, r5 */

type Layer = 'base' | 'lhcii' | 'minor' | 'core' | 'rc';
const BOX: Record<Layer, [number, number, number, number]> = {
  base: [173, 89, 1254, 821], lhcii: [274, 194, 1153, 318], minor: [454, 89, 710, 428], core: [570, 193, 428, 337], rc: [602, 233, 342, 231],
};
const HREF: Record<Layer, string> = { base: aBase, lhcii: aLhcii, minor: aMinor, core: aCore, rc: aRc };
/** A view of the render frame: figure = s · scene + t. */
interface View { s: number; t: V }
const on = (v: View, p: V): V => [v.s * p[0] + v.t[0], v.s * p[1] + v.t[1]];

interface Pig { p: V; t: number; g: number; up: boolean }
const PIGS: Pig[] = Array.from({ length: CHL.length / 5 }, (_, i) => ({ p: [CHL[5 * i], CHL[5 * i + 1]], t: CHL[5 * i + 2], g: CHL[5 * i + 3], up: CHL[5 * i + 4] === 1 }));
const CARS = Array.from({ length: CAR.length / 6 }, (_, i) => ({ a: [CAR[6 * i], CAR[6 * i + 1]] as V, b: [CAR[6 * i + 2], CAR[6 * i + 3]] as V, up: CAR[6 * i + 5] === 1 }));
const mean = (ps: V[]): V => [ps.reduce((s, p) => s + p[0], 0) / ps.length, ps.reduce((s, p) => s + p[1], 0) / ps.length];
/** Centroids (scene px) of the lit monomer's complexes, from its pigments. */
const litOf = (g: number, keep: (p: V) => boolean = () => true): V[] => PIGS.filter(q => q.up && q.g === g && keep(q.p)).map(q => q.p);
const C = {
  lhcM: mean(litOf(0)), lhcS: mean(litOf(1)),
  cp26: mean(litOf(2, p => p[0] < 700)), cp24: mean(litOf(2, p => p[0] > 900 && p[1] < 300)), cp29: mean(litOf(2, p => p[0] > 900 && p[1] >= 300)),
  cp43: mean(litOf(3, p => p[0] < 750)), cp47: mean(litOf(3, p => p[0] > 800)), p680: P680 as V,
};

/** The render seen through view v: base and tinted layers, the carotenoids and chlorophylls of the lit monomer (the other
 *  monomer's at `lower` opacity). `soft` = [x, y, w, h] in the figure: the render fades out at the edges of that window. */
function structure(id: string, v: View, o: { lower?: number; lit?: number; soft?: [number, number, number, number]; dim?: [number, number, number] } = {}): string {
  const img = (n: Layer): string => {
    const [x, y, w, h] = BOX[n], [X, Y] = on(v, [x, y]);
    return `<image href="${HREF[n]}" x="${f(X)}" y="${f(Y)}" width="${f(w * v.s)}" height="${f(h * v.s)}"/>`;
  };
  const r = 13 * v.s;
  const discs = (up: boolean, t: number): string => PIGS.filter(q => q.up === up && q.t === t).map(q => { const [x, y] = on(v, q.p); return circ(x, y, r); }).join('');
  const cars = (up: boolean): string => CARS.filter(c => c.up === up).map(c => { const a = on(v, c.a), b = on(v, c.b); return `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`; }).join('');
  const half = (up: boolean): string => `<path class="fl06r-car" d="${cars(up)}"/><path class="fl06r-pa" d="${discs(up, 0)}"/><path class="fl06r-pb" d="${discs(up, 1)}"/><path class="fl06r-ph" d="${discs(up, 2)}"/>`;
  const body = `<g class="fl06r-render">${(['base', 'lhcii', 'minor', 'core', 'rc'] as Layer[]).map(img).join('')}</g>
    ${o.lower ? `<g opacity="${o.lower}">${half(false)}</g>` : ''}${o.lit !== undefined ? `<g opacity="${o.lit}">${half(true)}</g>` : half(true)}`;
  // dim = [y0, y1, o]: below figure y0 the render steps back, to opacity o at y1 (the monomer that is not lit)
  const dimmed = o.dim ? `<defs><linearGradient id="${id}-dg" gradientUnits="userSpaceOnUse" x1="0" y1="${o.dim[0]}" x2="0" y2="${o.dim[1]}"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="${o.dim[2]}"/></linearGradient>
      <mask id="${id}-dm" maskUnits="userSpaceOnUse" x="-50" y="-50" width="900" height="700"><rect x="-50" y="-50" width="900" height="700" fill="url(#${id}-dg)"/></mask></defs>
    <g mask="url(#${id}-dm)">${body}</g>` : body;
  if (!o.soft) return dimmed;
  const [x, y, w, h] = o.soft, m = 26;
  return `<defs><filter id="${id}-fb" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${m / 2.4}"/></filter>
      <mask id="${id}-fm" maskUnits="userSpaceOnUse" x="${x - 40}" y="${y - 40}" width="${w + 80}" height="${h + 80}"><rect x="${x + m * 0.8}" y="${y + m * 0.8}" width="${w - 1.6 * m}" height="${h - 1.6 * m}" fill="#fff" filter="url(#${id}-fb)"/></mask></defs>
    <g mask="url(#${id}-fm)">${dimmed}</g>`;
}

/** A label on an image: text with a paper halo, optional leaders (halo, line, end dot) from `from` to each target. */
function label(x: number, y: number, s: string, cls: string, a: A, from?: V, to: V[] = []): string {
  const ld = from ? to.map(t => {
    const d = `M${f(from[0])},${f(from[1])}L${f(t[0])},${f(t[1])}`;
    return `<path class="fl06r-ldh" d="${d}"/><path class="fl06r-ld" d="${d}"/><circle class="fl06r-ldt" cx="${f(t[0])}" cy="${f(t[1])}" r="3.4"/>`;
  }).join('') : '';
  return `${ld}${T(x, y, s, `fl06r-lab ${cls}`, a)}`;
}
/** The pigment key: Chl a, Chl b, carotenoid (the render's colours). */
function pigKey(x: number, y: number, car = true): string {
  return `<circle class="fl06r-pa" cx="${f(x + 8)}" cy="${f(y - 6)}" r="8"/>${T(x + 24, y, CHL_A, 'fl06r-k', 'start')}
    <circle class="fl06r-pb" cx="${f(x + 112)}" cy="${f(y - 6)}" r="8"/>${T(x + 128, y, CHL_B, 'fl06r-k', 'start')}
    ${car ? `<path class="fl06r-car fl06r-car-k" d="M${f(x + 212)},${f(y - 1)}L${f(x + 236)},${f(y - 12)}"/>${T(x + 246, y, 'carotenoid', 'fl06r-k', 'start')}` : ''}`;
}
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fl06r-cr', a);

/** A broad route arrow (after Kouřil et al. 2012, Fig. 2): from a towards b, bowed by k, trimmed at both ends. */
function route(a: V, b: V, k = 0, cut0 = 0.2, cut1 = 0.2): string {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const c: V = [(a[0] + b[0]) / 2 + dy * k, (a[1] + b[1]) / 2 - dx * k];
  const q = (t: number): V => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
  const p0 = q(cut0), p1 = q(1 - cut1), pc = q(0.5);
  const tg: V = [p1[0] - q(1 - cut1 - 0.04)[0], p1[1] - q(1 - cut1 - 0.04)[1]], L = Math.hypot(tg[0], tg[1]);
  const u: V = [tg[0] / L, tg[1] / L], n: V = [-u[1], u[0]], hl = 17, hw = 11.5;
  const e: V = [p1[0] - u[0] * hl, p1[1] - u[1] * hl];
  // the shaft as a quadratic through pc, ending where the head starts
  const cc: V = [2 * pc[0] - (p0[0] + e[0]) / 2, 2 * pc[1] - (p0[1] + e[1]) / 2];
  const shaft = `M${f(p0[0])},${f(p0[1])}Q${f(cc[0])},${f(cc[1])} ${f(e[0])},${f(e[1])}`;
  const head = `M${f(p1[0])},${f(p1[1])}L${f(e[0] + n[0] * hw)},${f(e[1] + n[1] * hw)}L${f(e[0] - n[0] * hw)},${f(e[1] - n[1] * hw)}Z`;
  return `<path class="fl06r-rth" d="${shaft}"/><path class="fl06r-rhh" d="${head}"/><path class="fl06r-rt" d="${shaft}"/><path class="fl06r-rh" d="${head}"/>`;
}

const CR_RENDER = 'Render of PDB 5XNL (Su et al. 2017)';
/** An open smooth path through points (Catmull-Rom). */
function smoothPath(q: V[]): string {
  let d = `M${f(q[0][0])},${f(q[0][1])}`;
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

/* ================================================================ r1 · routes on the real structure */

function routesSvg(): string {
  const p = 'fl06r1';
  const v: View = { s: 0.585, t: [400 - 0.585 * 800, 56 - 0.585 * 89] };
  const g = (q: V): V => on(v, q);
  const R = [
    route(g(C.lhcM), g(C.cp29), 0.12, 0.22, 0.12), route(g(C.cp29), g(C.cp47), 0.1, 0.12, 0.14), route(g(C.cp47), g(C.p680), 0.1, 0.16, 0.24),
    route(g(C.lhcS), g(C.cp43), -0.1, 0.24, 0.14), route(g(C.cp26), g(C.cp43), 0.1, 0.16, 0.16), route(g(C.cp43), g(C.p680), -0.1, 0.16, 0.26),
  ].join('');
  const [px, py] = g(C.p680);
  const lhcS = g(C.lhcS), lhcM = g(C.lhcM), cp26 = g(C.cp26), cp29 = g(C.cp29), cp43 = g(C.cp43), cp47 = g(C.cp47);
  return svgR('Our render of the pea photosystem II supercomplex (PDB 5XNL) seen from the stroma, one of its two monomers highlighted with its chlorophyll a, chlorophyll b and carotenoids. Broad arrows mark the main energy-transfer routes: from the outer antenna LHCII through the minor antennas CP29 and CP26 into the core antenna CP43 and CP47, and on to the reaction centre.', `
    ${structure(p, v, { lower: 0.3 })}
    ${R}
    <circle class="fl06r-rcring" cx="${f(px)}" cy="${f(py)}" r="${f(52 * v.s)}"/>
    ${label(150, 34, 'LHCII', 'fl06r-c-lhc', 'middle', [150, 42], [[lhcS[0] - 16, lhcS[1] - 40]])}
    ${label(650, 34, 'LHCII', 'fl06r-c-lhc', 'middle', [650, 42], [[lhcM[0], lhcM[1] - 44]])}
    ${label(286, 34, 'CP26', 'fl06r-c-min', 'middle', [286, 42], [[cp26[0] + 4, cp26[1] - 6]])}
    ${label(560, 34, 'CP29', 'fl06r-c-min', 'middle', [560, 42], [[cp29[0] + 6, cp29[1] - 10]])}
    ${label(420, 34, 'core antenna', 'fl06r-c-core', 'middle', [420, 42], [[cp43[0] + 10, cp43[1] - 14], [cp47[0] - 8, cp47[1] - 22]])}
    ${label(px, 562, 'reaction centre', 'fl06r-c-rc', 'middle', [px, 541], [[px, py + 52 * v.s + 3]])}
    ${pigKey(24, 594)}
    ${credit(786, 594, 'PDB 5XNL, Su et al. 2017 · routes: Kouřil et al. 2012')}
  `);
}

/* ================================================================ r2 · 300 to 1 */

const N_UNIT = 300;
/** The unit's chlorophylls on a sunflower spiral (even, organic spacing), the centre left free for the reaction centre. */
function unitDots(cx: number, cy: number, R: number): V[] {
  const rand = mulberry(29), k0 = 7, ga = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: N_UNIT }, (_, i): V => {
    const k = i + k0, r = R * Math.sqrt(k / (N_UNIT + k0)), a = k * ga;
    const w = 1 + 0.045 * Math.sin(3 * a + 0.7) + 0.03 * Math.sin(5 * a + 2.1);
    return [cx + r * w * Math.cos(a) + (rand() - 0.5) * 4, cy + r * w * Math.sin(a) + (rand() - 0.5) * 4];
  });
}
/** A route of hops from an outer dot towards the centre: each hop to a neighbour nearer the centre. */
function inward(pts: V[], start: number, c: V, step: number, stop: number): V[] {
  const out: V[] = [pts[start]];
  let cur = pts[start];
  for (let n = 0; n < 40 && Math.hypot(cur[0] - c[0], cur[1] - c[1]) > stop; n++) {
    const d0 = Math.hypot(cur[0] - c[0], cur[1] - c[1]);
    const cand = pts.filter(q => { const d = Math.hypot(q[0] - cur[0], q[1] - cur[1]); return d > 4 && d < step && Math.hypot(q[0] - c[0], q[1] - c[1]) < d0 - 6; });
    if (!cand.length) break;
    cand.sort((a, b) => Math.hypot(a[0] - c[0], a[1] - c[1]) - Math.hypot(b[0] - c[0], b[1] - c[1]));
    cur = cand[0];
    out.push(cur);
  }
  return out;
}

/** The two portraits on one newsprint clipping, surnames under them (after anim/antenna-common.ts pairClip, no year). */
function portraits(p: string, x: number, y: number, w: number): { svg: string; h: number } {
  const m = w * 0.055, pw = (w - 3 * m) / 2, ph = pw * 1.25, h = m + ph + 42;
  const por = (href: string, px: number): string => `<image href="${href}" x="${f(px)}" y="${f(y + m)}" width="${f(pw)}" height="${f(ph)}" preserveAspectRatio="xMidYMid slice"/>`;
  const ny = y + m + ph + 28;
  return {
    h,
    svg: `<defs><filter id="${p}-sh" x="-15%" y="-10%" width="130%" height="125%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".2"/></filter></defs>
    <path class="clip-paper" d="${cutPath(x, y, w, h, 23)}" filter="url(#${p}-sh)"/>
    ${por(EMERSON, x + m)}${por(ARNOLD, x + 2 * m + pw)}
    ${T(x + m + pw / 2, ny, 'Emerson', 'fl06r-name')}${T(x + 2 * m + 1.5 * pw, ny, 'Arnold', 'fl06r-name')}`,
  };
}
/** Their Fig. 1 on a newsprint clipping, the original lettering clipped off and the axes relabelled. */
function fig1(p: string, x: number, y: number, w: number): { svg: string; h: number } {
  // plot area of ea1932-fig1.png (1015 × 763): y axis at u ≈ 78, x axis at v ≈ 688; keep the ticks, drop the numbers
  const U0 = 70, U1 = 1012, V0 = 6, V1 = 700, iw = w - 52, s = iw / (U1 - U0), ih = (V1 - V0) * s;
  const ix = x + 40, iy = y + 14, h = ih + 54;
  return {
    h,
    svg: `<defs><filter id="${p}-sh2" x="-15%" y="-10%" width="130%" height="125%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".2"/></filter>
      <clipPath id="${p}-fc"><rect x="${f(ix)}" y="${f(iy)}" width="${f(iw)}" height="${f(ih)}"/></clipPath></defs>
    <path class="clip-paper" d="${cutPath(x, y, w, h, 31)}" filter="url(#${p}-sh2)"/>
    <g clip-path="url(#${p}-fc)" class="fl06r-mult"><image href="${FIG1}" x="${f(ix - U0 * s)}" y="${f(iy - V0 * s)}" width="${f(1015 * s)}" height="${f(1015 * FIG1_AR * s)}"/></g>
    <text class="fl06r-ax" transform="translate(${f(x + 26)} ${f(iy + ih / 2)}) rotate(-90)" text-anchor="middle">yield per flash</text>
    ${T(ix + iw / 2, iy + ih + 30, 'flash intensity', 'fl06r-ax')}`,
  };
}

function unitSvg(): string {
  const p = 'fl06r2';
  const c: V = [254, 288], R = 232;
  const pts = unitDots(c[0], c[1], R);
  const dots = pts.map(q => circ(q[0], q[1], 6.2)).join('');
  // six routes in from the rim, at even angles; each runs dot to dot and ends at the reaction centre
  const far = (deg: number): number => {
    const a = (deg * Math.PI) / 180;
    let best = 0, bd = -1e9;
    pts.forEach((q, i) => { const s = (q[0] - c[0]) * Math.cos(a) + (q[1] - c[1]) * Math.sin(a); if (s > bd) { bd = s; best = i; } });
    return best;
  };
  const chains = [-80, -35, 10, 55, 100, 145, 190, 235].map(d => inward(pts, far(d), c, 32, 46));
  const routes = chains.map(ch => {
    const last = ch[ch.length - 1], dx = c[0] - last[0], dy = c[1] - last[1], L = Math.hypot(dx, dy);
    const end: V = [c[0] - (dx / L) * 29, c[1] - (dy / L) * 29];
    return `<path class="f6-hop fl06r-route" d="${smoothPath([...ch, end])}" marker-end="url(#${p}-amb)"/>`;
  }).join('');
  const lit = chains.flatMap(ch => ch).map(q => circ(q[0], q[1], 6.2)).join('');
  const X = 520, W = 264, P = portraits(p, X, 30, W), y2 = 30 + P.h + 52, F = fig1(p, X, y2, W);
  return svgR('A photosynthetic unit drawn to count: 300 chlorophyll dots around one reaction centre, a pair of chlorophylls in a ring; amber dotted routes carry energy from the rim inward, pigment to pigment, to the reaction centre. Beside it, halftone portraits of Robert Emerson and William Arnold and their 1932 Figure 1: the yield per flash levels off at the brightest flashes.', `
    ${defs(p)}
    <path class="fl06r-dot" d="${dots}"/><path class="fl06r-dot-on" d="${lit}"/>
    ${routes}
    <circle cx="${c[0]}" cy="${c[1]}" r="40" fill="url(#${p}-glow)"/>
    <circle class="fl06r-rcbg" cx="${c[0]}" cy="${c[1]}" r="22"/>
    <circle class="fl06r-pa" cx="${c[0] - 6.5}" cy="${c[1]}" r="6.2"/><circle class="fl06r-pa" cx="${c[0] + 6.5}" cy="${c[1]}" r="6.2"/>
    <circle class="fl06r-rcring2" cx="${c[0]}" cy="${c[1]}" r="22"/>
    <path class="fl06r-dot" d="${circ(34, 584, 7)}"/>${T(50, 590, 'chlorophyll', 'fl06r-k', 'start')}
    <circle class="fl06r-rcbg" cx="${206}" cy="${584}" r="13"/><circle class="fl06r-pa" cx="202" cy="584" r="3.8"/><circle class="fl06r-pa" cx="210" cy="584" r="3.8"/><circle class="fl06r-rcring2" cx="206" cy="584" r="13"/>
    ${T(228, 590, 'reaction centre', 'fl06r-k', 'start')}
    ${P.svg}${F.svg}
    ${credit(X + W, 30 + P.h + 22, 'Portraits © NAS Biographical Memoirs')}
    ${credit(X + W, y2 + F.h + 22, 'Emerson & Arnold 1932, Fig. 1')}
  `);
}

/* ================================================================ r3 · energy staircase */

const EV = (nm: number): number => 1239.84 / nm;

function stairSvg(): string {
  const p = 'fl06r3';
  // two axis segments on one scale (2000 px per eV): 1.80–1.95 eV below the break, 2.50–2.55 eV above it
  const K = 2000, Ylo = (e: number): number => 500 - (e - 1.8) * K, Yhi = (e: number): number => 132 - (e - 2.5) * K;
  const Y = (nm: number): number => (EV(nm) > 2.2 ? Yhi(EV(nm)) : Ylo(EV(nm)));
  const AX = 112;
  const lvl = (x0: number, x1: number, nm: number, cls: string): string => `<path class="fl06r-lv ${cls}" d="M${f(x0)},${f(Y(nm))} H${f(x1)}"/>`;
  const ticks = [1.8, 1.85, 1.9, 1.95].map(e => [Ylo(e), e] as [number, number]).concat([2.5, 2.55].map(e => [Yhi(e), e] as [number, number]))
    .map(([y, e]) => `<path class="fl06r-tick" d="M${AX - 8},${f(y)} H${AX}"/>${T(AX - 14, y + 6, e.toFixed(2), 'fl06r-ax', 'end')}`).join('');
  const brk = (y: number): string => `<path class="fl06r-brk" d="M${AX - 10},${y + 4} l20,-8 M${AX - 10},${y + 12} l20,-8"/>`;
  // columns: carotenoid, Chl b, four Chl a about level, the reaction centre
  const xc = 200, xb = 306, xr = 696, aX = [404, 474, 544, 614], aNm = [678, 676, 679, 677];
  const ya = (i: number): number => Y(aNm[i]);
  const hopA = (i: number): string => {
    const a: V = [aX[i] + 16, ya(i) - 7], b: V = [aX[i + 1] - 16, ya(i + 1) - 7], c: V = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 22];
    return `<path class="f6-hop" d="M${f(a[0])},${f(a[1])}Q${f(c[0])},${f(c[1])} ${f(b[0])},${f(b[1])}" marker-start="url(#${p}-amb2)" marker-end="url(#${p}-amb2)"/>`;
  };
  const cToA: Arc = [[xc + 32, Y(490) + 4], [aX[1] + 10, Y(490) + 30], [aX[1], ya(1) - 14]];
  const bToA: Arc = [[xb + 32, Y(650) - 6], [aX[0] - 30, Y(650) - 20], [aX[0] - 4, ya(0) - 14]];
  const aToR: Arc = [[aX[3] + 16, ya(3) - 7], [(aX[3] + xr) / 2 - 6, ya(3) - 30], [xr - 34, Y(680) - 8]];
  const band = `<rect class="fl06r-band" x="${aX[0] - 30}" y="${f(Y(676) - 5)}" width="${aX[3] - aX[0] + 60}" height="${f(Y(680) - Y(676) + 10)}" rx="4"/>`;
  const base = 560, aMid = (aX[0] + aX[3]) / 2;
  return svgR('Energy of the excited state of each antenna pigment, in electronvolts, with each level labelled by its absorption wavelength. A carotenoid absorbs at about 490 nanometres and chlorophyll b at 650 nanometres; both pass the energy downhill to chlorophyll a at 676 to 680 nanometres. Among the chlorophyll a the levels are nearly flat, so the energy hops back and forth until it reaches the reaction centre P680, at 680 nanometres, about level with them, which traps it by charge separation.', `
    ${defs(p)}<defs><marker id="${p}-amb2" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse"><path class="f6-hd" d="M0,0L10,5L0,10z"/></marker></defs>
    <path class="ar ar-ink" d="M${AX},${Ylo(1.8) + 20} V${Ylo(1.95) - 12}"/>${arrow(p, 'ink', `M${AX},${Yhi(2.5) + 12} V${Yhi(2.55) - 26}`)}
    ${brk((Ylo(1.95) + Yhi(2.5)) / 2 - 4)}${ticks}
    <text class="fl06r-ax" transform="translate(34 ${f((Ylo(1.8) + Yhi(2.55)) / 2)}) rotate(-90)" text-anchor="middle">excited-state energy (eV)</text>
    ${lvl(xc - 38, xc + 38, 490, 'fl06r-lv-car')}${T(xc, Y(490) - 16, '≈ 490 nm', 'fl06r-nm')}
    ${lvl(xb - 38, xb + 38, 650, 'fl06r-lv-b')}${T(xb, Y(650) - 16, '650 nm', 'fl06r-nm')}
    ${band}${aX.map((x, i) => lvl(x - 18, x + 18, aNm[i], 'fl06r-lv-a')).join('')}${T(aMid, Y(676) + 48, '676–680 nm', 'fl06r-nm')}
    ${lvl(xr - 34, xr + 34, 680, 'fl06r-lv-p')}${T(xr, Y(680) + 36, 'P680 · 680 nm', 'fl06r-nm fl06r-nm-p')}
    ${hop(p, cToA)}${hop(p, bToA)}${[0, 1, 2].map(hopA).join('')}${hop(p, aToR)}
    ${glow(p, [xr + 4, Y(680) - 1], 1.1)}
    ${rc(xr + 70, Y(680), 16)}${T(xr + 70, Y(680) - 28, 'trap', 'fl06r-k fl06r-c-rc')}
    <path class="fl06r-base" d="M${AX + 24},${base - 34} H786"/>
    <path class="fl06r-car fl06r-car-k" d="M${xc - 14},${base + 2} L${xc + 14},${base - 12}"/>${T(xc, base + 32, 'carotenoid', 'fl06r-k')}
    ${pig(xb, base - 5, true, 13, true)}${T(xb, base + 32, CHL_B, 'fl06r-k fl06r-c-b')}
    ${pig(aMid, base - 5, false, 13, true)}${T(aMid, base + 32, CHL_A, 'fl06r-k fl06r-c-a')}
    ${rc(xr, base - 5, 14)}${T(xr, base + 32, 'reaction centre', 'fl06r-k')}
  `);
}

/* ================================================================ r4 · structure and staircase */

function pathStairSvg(): string {
  const p = 'fl06r4';
  const v: View = { s: 0.66, t: [16 - 0.66 * 610, 60 - 0.66 * 80] };
  const pts = PATH.map(i => on(v, PIGS[i].p));
  const trail = `M${pts.map(q => `${f(q[0])},${f(q[1])}`).join('L')}`;
  const r = 13 * v.s;
  const onPath = PATH.map((i, k) => `<path class="${['fl06r-pa', 'fl06r-pb', 'fl06r-ph'][PIGS[i].t]}" d="${circ(pts[k][0], pts[k][1], r + 1.4)}"/>`).join('');
  const [px, py] = on(v, C.p680);
  const lhcM = on(v, C.lhcM), cp29 = on(v, C.cp29), cp47 = on(v, C.cp47);
  // the inset: one step per pigment along the path, to scale in energy (650 → 678 → 680 nm)
  const bx = 574, by = 118, bw = 212, bh = 324;
  const lvB = EV(650), lvA = EV(678), lvR = EV(680);
  const yE = (e: number): number => by + 92 + (lvB - e) * (112 / (lvB - lvA));
  const N = PATH.length - 1, sx = (i: number): number => bx + 58 + (i / N) * (bw - 92);
  const lv = (i: number): number => (i >= 17 ? lvR : PIGS[PATH[i]].t === 1 ? lvB : lvA);
  let d = '', prev = lv(0);
  const half = (sx(1) - sx(0)) / 2;
  for (let i = 0; i <= N; i++) {
    const L = lv(i), x1 = sx(i) + (i < N ? half : 6);
    d += i === 0 ? `M${f(sx(0) - 8)},${f(yE(L))}H${f(x1)}` : `${L !== prev ? `V${f(yE(L))}` : ''}H${f(x1)}`;
    prev = L;
  }
  const ax = bx + 32;
  return svgR('Our render of photosystem II (PDB 5XNL) seen from the stroma, the right part of one monomer: an amber trail marks one possible path of 19 hops, pigment to pigment, from a chlorophyll b at the outer edge of LHCII through chlorophyll a in LHCII, CP29 and the core antenna to the reaction centre, which glows where it traps the energy. Inset: the same path as a staircase in energy, one step per pigment: one drop from chlorophyll b to chlorophyll a, then nearly flat to the reaction centre.', `
    ${defs(p)}
    ${structure(p, v, { lower: 0.22, lit: 0.42, soft: [6, 36, 552, 492], dim: [340, 420, 0.4] })}
    <path class="fl06r-trailh" d="${trail}"/><path class="fl06r-trail" d="${trail}"/>${onPath}
    <circle cx="${f(px)}" cy="${f(py)}" r="${f(46 * v.s)}" fill="url(#${p}-glow)"/><circle class="fl06r-rcring" cx="${f(px)}" cy="${f(py)}" r="${f(52 * v.s)}"/>
    ${label(130, 36, 'reaction centre', 'fl06r-c-rc', 'middle', [130, 44], [[px, py - 52 * v.s - 3]])}
    ${label(450, 36, 'LHCII', 'fl06r-c-lhc', 'middle', [450, 44], [[lhcM[0], lhcM[1] - 92]])}
    ${label(196, 420, 'core antenna', 'fl06r-c-core', 'middle', [200, 400], [[cp47[0] + 2, cp47[1] + 24]])}
    ${label(356, 420, 'CP29', 'fl06r-c-min', 'middle', [352, 400], [[cp29[0] + 8, cp29[1] + 24]])}
    ${pigKey(24, 590)}
    ${credit(786, 590, CR_RENDER)}
    <path class="clip-paper" d="${cutPath(bx, by, bw, bh, 71, 2.4)}"/>
    <path class="fl06r-axl" d="M${ax},${by + bh - 58} V${by + 30}"/><path class="fl06r-axl" d="M${ax - 6},${by + 40} L${ax},${by + 28} L${ax + 6},${by + 40}"/>
    <text class="fl06r-ax" transform="translate(${ax - 12} ${by + (bh - 30) / 2}) rotate(-90)" text-anchor="middle">energy</text>
    <path class="fl06r-rung" d="${d}"/>
    ${glow(p, [sx(N) + 2, yE(lvR)], 0.85)}
    ${T(sx(0) - 8, yE(lvB) - 14, CHL_B, 'fl06r-k fl06r-c-b', 'start')}${T(sx(5), yE(lvA) - 14, CHL_A, 'fl06r-k fl06r-c-a', 'start')}
    ${T(bx + bw - 12, yE(lvR) + 34, 'reaction centre', 'fl06r-k fl06r-c-rc', 'end')}
    ${T(bx + 58 + (bw - 92) / 2, by + bh - 26, 'pigments along the path', 'fl06r-ax fl06r-ax-s')}
  `);
}

/* ================================================================ r5 · sun and shade antenna */

/** Convex hull (monotone chain). */
function hull(ps: V[]): V[] {
  const s = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: V, a: V, b: V): number => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: V[] = [], up: V[] = [];
  for (const p of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of [...s].reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
/** A smooth outline round a set of points: hull pushed out by pad along each vertex's bisector, closed Catmull-Rom. */
function blob(ps: V[], pad: number): string {
  const h = hull(ps), n = h.length;
  const q = h.map((p, i): V => {
    const a = h[(i - 1 + n) % n], b = h[(i + 1) % n];
    const n1: V = [p[1] - a[1], -(p[0] - a[0])], n2: V = [b[1] - p[1], -(b[0] - p[0])];
    const l1 = Math.hypot(...n1) || 1, l2 = Math.hypot(...n2) || 1;
    const m: V = [n1[0] / l1 + n2[0] / l2, n1[1] / l1 + n2[1] / l2], lm = Math.hypot(...m) || 1;
    return [p[0] + (m[0] / lm) * pad, p[1] + (m[1] / lm) * pad];
  });
  let d = `M${f(q[0][0])},${f(q[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = q[(i - 1 + n) % n], p1 = q[i], p2 = q[(i + 1) % n], p3 = q[(i + 2) % n];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return `${d}Z`;
}
/** k-means into k groups (deterministic start: farthest points). */
function kmeans(ps: V[], k: number): V[][] {
  const c: V[] = [ps[0]];
  const dmin = (p: V): number => Math.min(...c.map(q => Math.hypot(p[0] - q[0], p[1] - q[1])));
  while (c.length < k) c.push(ps.reduce((b, p) => (dmin(p) > dmin(b) ? p : b)));
  let groups: V[][] = [];
  for (let it = 0; it < 12; it++) {
    groups = c.map(() => []);
    ps.forEach(p => { let bi = 0, bd = 1e9; c.forEach((q, i) => { const d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d < bd) { bd = d; bi = i; } }); groups[bi].push(p); });
    groups.forEach((g, i) => { if (g.length) c[i] = mean(g); });
  }
  return groups;
}

interface Part { kind: 'lhc' | 'min' | 'core'; lobes: V[][]; pigs: Pig[] }
/** The complexes of 5XNL, both monomers: each LHCII trimer as its three monomers; CP24, CP26 and CP29; the core as
 *  CP43, CP47 and D1/D2. The lower monomer is sorted by the dimer's two-fold axis (x, y → 1600 − x, 1000 − y). */
const PARTS: Part[] = (() => {
  const out: Part[] = [];
  for (const up of [true, false]) {
    const canon = (p: V): V => (up ? p : [1600 - p[0], 1000 - p[1]]);
    const sel = (g: number, keep: (q: V) => boolean = () => true): Pig[] => PIGS.filter(q => q.up === up && q.g === g && keep(canon(q.p)));
    for (const g of [0, 1]) { const ps = sel(g); out.push({ kind: 'lhc', lobes: kmeans(ps.map(q => q.p), 3), pigs: ps }); }
    for (const keep of [(q: V) => q[0] < 700, (q: V) => q[0] > 900 && q[1] < 300, (q: V) => q[0] > 900 && q[1] >= 300]) {
      const ps = sel(2, keep);
      out.push({ kind: 'min', lobes: [ps.map(q => q.p)], pigs: ps });
    }
    const cp43 = sel(3, q => q[0] < 750), cp47 = sel(3, q => q[0] > 800), d12 = sel(4);
    out.push({ kind: 'core', lobes: [cp43, cp47, d12].map(g => g.map(q => q.p)), pigs: [...cp43, ...cp47, ...d12] });
  }
  return out;
})();
/** An extra LHCII trimer: the lit S-trimer's pigments turned by rot° and moved to centre on `at`. */
function extraTrimer(at: V, rot: number): Part {
  const src = PARTS[1], c = mean(src.pigs.map(q => q.p)), a = (rot * Math.PI) / 180;
  const tf = (p: V): V => { const dx = p[0] - c[0], dy = p[1] - c[1]; return [at[0] + dx * Math.cos(a) - dy * Math.sin(a), at[1] + dx * Math.sin(a) + dy * Math.cos(a)]; };
  return { kind: 'lhc', lobes: src.lobes.map(l => l.map(tf)), pigs: src.pigs.map(q => ({ ...q, p: tf(q.p) })) };
}
const P680_2: V = [1600 - P680[0], 1000 - P680[1]];

/** One PSII schematic: outlines (union of lobes) and pigments through view v; `extra` parts get a dashed rim. */
function schematic(v: View, parts: Part[], extra: Part[] = []): string {
  const r = 13 * v.s * 1.25;
  const draw = (ps: Part[], cls: string): string => {
    const shapes = ps.map(pt => ({ kind: pt.kind, d: pt.lobes.filter(l => l.length > 2).map(l => blob(l.map(p => on(v, p)), (pt.kind === 'core' ? 46 : 30) * v.s)) }));
    return `<g class="${cls}">${shapes.map(s => s.d.map(d => `<path class="fl06r-o fl06r-o-${s.kind}" d="${d}"/>`).join('')).join('')}
      ${shapes.map(s => s.d.map(d => `<path class="fl06r-i fl06r-i-${s.kind}" d="${d}"/>`).join('')).join('')}</g>`;
  };
  const all = [...parts, ...extra];
  const disc = (t: number): string => all.flatMap(pt => pt.pigs.filter(q => q.t === t)).map(q => { const [x, y] = on(v, q.p); return circ(x, y, r); }).join('');
  const ring = (q: V): string => { const [x, y] = on(v, q); return `<circle class="fl06r-rcring fl06r-rcring-s" cx="${f(x)}" cy="${f(y)}" r="${f(56 * v.s)}"/>`; };
  return `${draw(parts, 'fl06r-sc')}${extra.length ? draw(extra, 'fl06r-sc fl06r-sc-x') : ''}
    <path class="fl06r-sa" d="${disc(0)}"/><path class="fl06r-sb" d="${disc(1)}"/><path class="fl06r-sh" d="${disc(2)}"/>${ring(P680)}${ring(P680_2)}`;
}

function sunShadeSvg(): string {
  // shade: one loosely bound trimer more per LHCII side, placed two-fold-symmetrically round the supercomplex
  const L: Array<[V, number]> = [[[1300, 96], 30], [[146, 330], -20]];
  const extra = L.flatMap(([q, rot]) => [extraTrimer(q, rot), extraTrimer([1600 - q[0], 1000 - q[1]], rot + 180)]);
  const s = 0.25;
  const sun: View = { s, t: [492 - s * 800, 138 - s * 500] }, shade: View = { s, t: [492 - s * 800, 418 - s * 500] };
  const coreS = on(sun, C.cp47), lhcS = on(sun, C.lhcM), lx = on(shade, [1300, 96]);
  const aB = `${CHL_A}/<tspan font-style="italic">b</tspan>`;
  return svgR('Two schematics of photosystem II seen from above, drawn from the real structure (PDB 5XNL) with each chlorophyll at its position and the two reaction centres ringed. Sun leaf: the supercomplex with its core and four LHCII trimers; leaf chlorophyll a to b ratio about 3.3. Shade leaf: the same supercomplex with extra, loosely bound LHCII trimers, rich in chlorophyll b; ratio about 2.8.', `
    ${T(24, 128, 'sun leaf', 'fl06r-h', 'start')}${T(24, 160, `${aB} ≈ 3.3`, 'fl06r-k', 'start')}
    ${schematic(sun, PARTS)}
    <path class="fl06r-rule" d="M24,262 H776"/>
    ${T(24, 408, 'shade leaf', 'fl06r-h', 'start')}${T(24, 440, `${aB} ≈ 2.8`, 'fl06r-k', 'start')}
    ${schematic(shade, PARTS, extra)}
    ${label(728, 58, 'LHCII', 'fl06r-c-lhc', 'middle', [710, 64], [[lhcS[0] + 22, lhcS[1] - 10]])}
    ${label(728, 226, 'core', 'fl06r-c-core', 'middle', [708, 220], [[coreS[0] + 6, coreS[1] + 8]])}
    ${label(724, 310, 'extra LHCII', 'fl06r-c-lhc', 'middle', [686, 316], [[lx[0] + 24, lx[1] + 2]])}
    <circle class="fl06r-sa" cx="${408}" cy="${584}" r="6"/>${T(420, 590, CHL_A, 'fl06r-k', 'start')}
    <circle class="fl06r-sb" cx="${500}" cy="${584}" r="6"/>${T(512, 590, CHL_B, 'fl06r-k', 'start')}
    <circle class="fl06r-rcring fl06r-rcring-s" cx="${594}" cy="${584}" r="11"/>${T(612, 590, 'reaction centre', 'fl06r-k', 'start')}
    ${credit(24, 590, 'After PDB 5XNL (Su et al. 2017)', 'start')}
  `);
}

const DRAW: Record<string, () => string> = { r1: routesSvg, r2: unitSvg, r3: stairSvg, r4: pathStairSvg, r5: sunShadeSvg };
/** The round-3 drawings by id (r1–r5); undefined for any other id. */
export const drawRound3 = (id: string): string | undefined => DRAW[id]?.();
