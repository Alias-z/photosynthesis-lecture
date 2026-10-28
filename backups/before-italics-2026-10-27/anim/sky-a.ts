// Sunlight and the sky, staging A · Wide scene. One fixed Sun–Earth view on the slide paper, after the lecturer's
// original animation (src/slides/skyAnimation.ts, whose geometry, optical depths and Sun and sky colours are ported
// here): the Sun small at the upper left, Earth large at the lower right, the camera still. Insets open on the scene
// for the spectrum (beat 1), the air (beat 2) and what you see at sunset (beat 5).
import { SKY_R1 } from './beats';
import './sky-a.css';
import { spec } from '../../lib/colour';
import { LAM, T, airMol, defs, sun, wv, type Col } from '../figs/s2';
import type { Staging } from './types';

type V = [number, number];
const P = 'skya';
const f = (v: number): string => v.toFixed(1);
const clamp = (v: number, a = 0, b = 1): number => Math.max(a, Math.min(b, v));
const smooth = (x: number): number => { const k = clamp(x); return k * k * (3 - 2 * k); };
/** Eased progress of a step that runs from t0 to t1 seconds into the beat. */
const step = (t: number, t0: number, t1: number): number => smooth((t - t0) / (t1 - t0));
const ramp = (t: number, t0: number, t1: number): number => clamp((t - t0) / (t1 - t0));
const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;
const add = (a: V, b: V, k = 1): V => [a[0] + b[0] * k, a[1] + b[1] * k];
const mix = (a: V, b: V, k: number): V => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const turn = (u: V, deg: number): V => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return [u[0] * c - u[1] * s, u[0] * s + u[1] * c];
};
const unit = (a: V, b: V): V => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); return [dx / L, dy / L]; };
const pt = (v: V): string => `${f(v[0])},${f(v[1])}`;
const COLS: Col[] = ['b', 'g', 'r'];

/* ---------- the scene: fixed Sun, Earth turning about C ---------- */

const SUN: V = [150, 170], SUN_R = 30, B0 = 58; // the beam starts just outside the Sun's rays
const C: V = [1290, 1110], R = 700, RA = 796; // Earth and the top of its air, drawn far too thick
const polar = (a: number, r = R): V => [C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r];

// Sunlight grazes the ground at the two tangent points from the Sun; the upper one is where "you" are at sunset.
const PHI_S = Math.atan2(SUN[1] - C[1], SUN[0] - C[0]);
const AL = Math.acos(R / Math.hypot(SUN[0] - C[0], SUN[1] - C[1]));
const ANG_SET = PHI_S + AL, ANG_OFF = PHI_S - AL;
/** The Sun's angle from overhead for someone standing at angle a on the ground. */
function zenith(a: number): number {
  const d = unit(polar(a), SUN);
  return (Math.acos(Math.cos(a) * d[0] + Math.sin(a) * d[1]) * 180) / Math.PI;
}
// Midday as in the original: the Sun 40° from overhead.
let lo = PHI_S, hi = ANG_SET;
for (let i = 0; i < 48; i++) { const m = (lo + hi) / 2; if (zenith(m) < 40) lo = m; else hi = m; }
const ANG_DAY = (lo + hi) / 2, ROT = ANG_SET - ANG_DAY;

interface Geo { you: V; up: V; u: V; n: V; L: number; tIn: number }
/** Where you stand after Earth has turned by rot, and the sunbeam that reaches you (n points to Earth's side). */
function geo(rot: number): Geo {
  const a = ANG_DAY + rot, you = polar(a), u = unit(SUN, you), L = Math.hypot(you[0] - SUN[0], you[1] - SUN[1]);
  const o: V = [SUN[0] - C[0], SUN[1] - C[1]], b = o[0] * u[0] + o[1] * u[1], cc = o[0] ** 2 + o[1] ** 2 - RA * RA;
  return { you, up: [Math.cos(a), Math.sin(a)], u, n: [-u[1], u[0]], L, tIn: -b - Math.sqrt(Math.max(b * b - cc, 0)) };
}
const at = (g: Geo, d: number, off = 0): V => [SUN[0] + g.u[0] * d + g.n[0] * off, SUN[1] + g.u[1] * d + g.n[1] * off];
const DAY = geo(0), SET = geo(ROT);

/* ---------- light ---------- */

// Rayleigh optical depth of one air mass, as in the original (0.0088 λ^-4.15, λ in µm), and the air mass at sunset.
const TAU = (nm: number): number => 0.0088 * Math.pow(nm / 1000, -4.15);
const AIRMASS_SET = 38;
const NM: Record<Col, number> = { b: 450, g: 550, r: 650 };
/** Along the sunset path, what is left of each colour relative to red (s = 0 at the top of the air, 1 at you). */
const left = (c: Col, s: number): number => Math.exp(-(TAU(NM[c]) - TAU(NM.r)) * AIRMASS_SET * clamp(s));

const GAP = 12, AMP = 6, DRIFT = 24; // beam spacing and amplitude (px), phase drift (px/s)
const HEX: Record<Col, string> = { b: '#2350e6', g: '#2a963a', r: '#c8361e' };
/** A wave of drawn wavelength lam from a to b; it starts and ends on its axis, as s2's wv does. */
function wpath(a: V, b: V, lam: number, amp: number, ph: number, head: boolean): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (L < 3) return '';
  const ux = dx / L, uy = dy / L, run = head ? Math.max(0, L - 9) : L, rp = lam * 0.7, n = Math.max(2, Math.ceil(run / 1.5));
  const out: string[] = [];
  for (let i = 0; i <= n; i++) {
    const d = (run * i) / n, e = Math.min(1, d / rp, (run - d) / rp), w = Math.sin((2 * Math.PI * d) / lam + ph) * amp * e;
    out.push(`${i ? 'L' : 'M'}${f(a[0] + ux * d - uy * w)},${f(a[1] + uy * d + ux * w)}`);
  }
  if (head) out.push(`L${pt(b)}`);
  return out.join('');
}
const drift = (c: Col, t: number, i: number): number => i * 1.3 - (2 * Math.PI * DRIFT * t) / LAM[c];

/** White sunlight to you: blue, green and red waves side by side. front is the drawn fraction; sF ≥ 0 shows the
 *  colours leaving along the air path up to that fraction of it (beat 5). */
function sunbeam(g: Geo, front: number, t: number, sF = -1): string {
  if (front <= 0) return '';
  const len = (g.L - B0) * front, aIn = at(g, g.tIn), aEnd = g.you;
  return COLS.map((c, i) => {
    const off = (i - 2) * GAP, a = at(g, B0, off), b = at(g, B0 + len, off), d = wpath(a, b, LAM[c], AMP, drift(c, t, i), true);
    if (sF < 0 || c === 'r') return `<path class="f2-w f2-w${c}" d="${d}" marker-end="url(#${P}-h${c})"/>`;
    // The colour fades along the air path where it has been scattered out; ahead of the front it is still whole.
    const op = (s: number): number => lerp(left(c, s), 1, clamp((s - sF) / 0.05 + 1));
    const stops = Array.from({ length: 41 }, (_, k) => `<stop offset="${(k / 40).toFixed(3)}" stop-color="${HEX[c]}" stop-opacity="${op(k / 40).toFixed(3)}"/>`).join('');
    const end = op(1);
    return `<defs><linearGradient id="${P}-a${c}" gradientUnits="userSpaceOnUse" x1="${f(aIn[0])}" y1="${f(aIn[1])}" x2="${f(aEnd[0])}" y2="${f(aEnd[1])}">${stops}</linearGradient></defs>
      <path class="f2-w" style="stroke:url(#${P}-a${c})" d="${d}"/>${end > 0.02 ? `<g opacity="${end.toFixed(3)}"><path class="f2-w f2-w${c}" d="M${pt(at(g, g.L - 10, off))}L${pt(b)}" marker-end="url(#${P}-h${c})"/></g>` : ''}`;
  }).join('');
}

/** A short wave scattered from point o in direction dir; k grows it from o outwards. */
function scattered(c: Col, o: V, dir: V, k: number, len: number, gap = 14, amp = 5): string {
  if (k <= 0.02) return '';
  const a = add(o, dir, gap), b = add(o, dir, gap + len * k);
  return len * k < 14 ? '' : wv(P, c, a[0], a[1], b[0], b[1], { amp });
}

/** A bracket along a to b, set off by off towards side, with end ticks; k draws it from the middle out. */
function bracket(a: V, b: V, side: V, off: number, k: number): string {
  if (k <= 0) return '';
  const m = mix(a, b, 0.5), a1 = add(mix(m, a, k), side, off), b1 = add(mix(m, b, k), side, off);
  const tick = (p: V): string => `M${pt(add(p, side, -9))}L${pt(add(p, side, 9))}`;
  return `<path class="sa-br" d="M${pt(a1)}L${pt(b1)}${k > 0.98 ? tick(a1) + tick(b1) : ''}"/>`;
}

/* ---------- Earth ---------- */

/** A closed smooth outline through the points (Catmull–Rom). */
function smoothClosed(p: V[]): string {
  const n = p.length;
  let d = `M${pt(p[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
    d += `C${pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${pt(p2)}`;
  }
  return `${d}Z`;
}
// Land in Earth-fixed polar coordinates: [angle in degrees, fraction of the radius]. Points past 1 meet the limb.
const LAND: Array<Array<[number, number]>> = [
  [[-137, 1.04], [-134, 0.92], [-128, 0.86], [-121, 0.88], [-115, 0.83], [-108, 0.85], [-103, 0.91], [-100, 1.04]],
  [[-184, 1.04], [-180, 0.9], [-173, 0.82], [-165, 0.85], [-158, 0.8], [-152, 0.87], [-149, 1.04]],
  [[-91, 1.04], [-87, 0.91], [-80, 0.87], [-73, 0.9], [-66, 0.84], [-60, 1.04]],
  [[-124, 0.7], [-117, 0.64], [-108, 0.66], [-101, 0.72], [-108, 0.77], [-118, 0.76]],
  [[-160, 0.66], [-151, 0.6], [-142, 0.63], [-140, 0.7], [-149, 0.73], [-157, 0.72]],
  [[-86, 0.68], [-78, 0.62], [-69, 0.66], [-72, 0.73], [-81, 0.74]],
];
const landSvg = LAND.map(s => `<path class="sa-land" d="${smoothClosed(s.map(([a, r]) => polar((a * Math.PI) / 180, R * r)))}"/>`).join('');

// Night: behind the line through the two grazing points, and in the air behind the grazing rays. Fixed, as the Sun is.
const T1 = polar(ANG_SET), T2 = polar(ANG_OFF);
const NIGHT = `M${pt(T1)}L${pt(add(T1, unit(SUN, T1), 2600))}L${pt(add(T2, unit(SUN, T2), 2600))}L${pt(T2)}Z`;
const ring = (r: number): string => `M${f(C[0] - r)},${f(C[1])}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;

/* ---------- beat 1: the spectrum inset ---------- */

const CARD = { x: 64, y: 404, w: 566, h: 276 };
const PICK = at(DAY, 296, -GAP); // where the inset looks at the beam
const PR = { a: [250, 450] as V, l: [184, 584] as V, r: [316, 584] as V }; // the prism, apex up
const RIB = { x: 424, w: 28, y0: 444, ir: 518, uv: 626, y1: 662 }; // the ribbon: infrared, visible, ultraviolet
const EXIT: V = [282, 512];
const VIS0 = 380, VIS1 = 780;
const soft = (nm: number): string => `rgb(${spec(nm).map(v => Math.round(v * 0.86 + 252 * 0.14)).join(',')})`;
const visStops = Array.from({ length: 21 }, (_, i) => `<stop offset="${(i / 20).toFixed(3)}" stop-color="${soft(VIS1 - (i * (VIS1 - VIS0)) / 20)}"/>`).join('');
/** x of the prism's left face at height y. */
const faceL = (y: number): number => PR.l[0] + ((PR.l[1] - y) / (PR.l[1] - PR.a[1])) * (PR.a[0] - PR.l[0]);

function specInset(op: number, kCard: number, kIn: number, kFan: number, kLab: number, t: number): string {
  if (op <= 0 || kCard <= 0) return '';
  const { x, y, w, h } = CARD;
  const lead = `<path class="sa-lead" d="M${pt(PICK)}L${x + 30},${y}M${pt(PICK)}L${x + w - 30},${y}"/><circle class="sa-pick" cx="${f(PICK[0])}" cy="${f(PICK[1])}" r="12"/>`;
  // White light in: the three waves stop at the prism's left face.
  const inc = kIn <= 0 ? '' : COLS.map((c, i) => {
    const yy = 512 + (i - 1) * GAP, x1 = faceL(yy) - 4, xe = lerp(96, x1, kIn);
    return `<path class="f2-w f2-w${c}" d="${wpath([96, yy], [xe, yy], LAM[c], 5, drift(c, t, i), false)}"/>`;
  }).join('');
  // The fan: thin slices from the exit point to the ribbon, each in its own colour; ultraviolet and infrared pale.
  const N = 56, span = RIB.y1 - RIB.y0;
  const fan = kFan <= 0 ? '' : Array.from({ length: N }, (_, i) => {
    const ya = RIB.y0 + (span * i) / N, yb = RIB.y0 + (span * (i + 1)) / N + 0.7, ym = (ya + yb) / 2;
    const cls = ym < RIB.ir || ym > RIB.uv ? ' class="sa-fan-x"' : ` fill="${soft(VIS1 - ((ym - RIB.ir) / (RIB.uv - RIB.ir)) * (VIS1 - VIS0))}" fill-opacity=".5"`;
    const pa = mix(EXIT, [RIB.x, ya], kFan), pb = mix(EXIT, [RIB.x, yb], kFan);
    return `<path${cls} d="M${pt(EXIT)}L${pt(pa)}L${pt(pb)}Z"/>`;
  }).join('');
  const kRib = ramp(kFan, 0.8, 1);
  const rib = kRib <= 0 ? '' : `<g opacity="${kRib.toFixed(3)}">
      <rect class="sa-band-x" x="${RIB.x}" y="${RIB.y0}" width="${RIB.w}" height="${RIB.ir - RIB.y0}"/>
      <rect x="${RIB.x}" y="${RIB.ir}" width="${RIB.w}" height="${RIB.uv - RIB.ir}" fill="url(#${P}-vis)"/>
      <rect class="sa-band-x" x="${RIB.x}" y="${RIB.uv}" width="${RIB.w}" height="${RIB.y1 - RIB.uv}"/>
      <rect class="sa-rib" x="${RIB.x}" y="${RIB.y0}" width="${RIB.w}" height="${RIB.y1 - RIB.y0}"/></g>`;
  const lab = kLab <= 0 ? '' : `<g opacity="${kLab.toFixed(3)}">${T(RIB.x + RIB.w + 18, (RIB.y0 + RIB.ir) / 2 + 8, 'infrared', 'sa-t')}${T(RIB.x + RIB.w + 18, (RIB.uv + RIB.y1) / 2 + 8, 'ultraviolet', 'sa-t')}</g>`;
  const s = lerp(0.92, 1, kCard);
  return `<g opacity="${(op * kCard).toFixed(3)}">${lead}
    <g transform="translate(${f(x + w / 2)} ${f(y)}) scale(${s.toFixed(4)}) translate(${f(-x - w / 2)} ${f(-y)})">
      <rect class="f2-card sa-card" x="${x}" y="${y}" width="${w}" height="${h}" rx="16" filter="url(#${P}-sh)"/>
      ${inc}${fan}<path class="sa-prism" d="M${pt(PR.a)}L${pt(PR.r)}L${pt(PR.l)}Z"/>${rib}${lab}
    </g></g>`;
}

/* ---------- beat 2: the magnifier on the air ---------- */

const M: V = [940, 234], RM = 172;
const SPOT = at(DAY, DAY.tIn + 26, -GAP); // the spot in the air that the magnifier shows
const lensAt = (a: number, b: number): V => add(add(M, DAY.u, a), DAY.n, b);
// Molecules in the beam's frame (a along it, b across, + towards Earth): 7 N₂ and 2 O₂, as in air (78 % and 21 %).
// The first four sit in the beam.
const MOLS: Array<{ a: number; b: number; m: 'N' | 'O'; ang: number }> = [
  { a: -80, b: -6, m: 'N', ang: 30 }, { a: -27, b: 7, m: 'O', ang: -40 }, { a: 27, b: -6, m: 'N', ang: 70 }, { a: 80, b: 6, m: 'N', ang: -15 },
  { a: -95, b: -100, m: 'N', ang: 60 }, { a: 0, b: -125, m: 'N', ang: -20 }, { a: 120, b: 60, m: 'N', ang: 15 },
  { a: -70, b: 115, m: 'N', ang: -30 }, { a: 15, b: 128, m: 'O', ang: 20 },
];
// What the four molecules in the beam send off, in all directions (degrees from the beam, + towards Earth):
// 4 blue, 2 green, 1 red, as (650/450)⁴ ≈ 4.4 and (650/550)⁴ ≈ 2.
const SCAT: Array<{ m: number; c: Col; ang: number }> = [
  { m: 0, c: 'b', ang: -150 }, { m: 0, c: 'g', ang: 120 }, { m: 1, c: 'b', ang: -100 }, { m: 1, c: 'r', ang: 95 },
  { m: 2, c: 'g', ang: -75 }, { m: 2, c: 'b', ang: 70 }, { m: 3, c: 'b', ang: -45 },
];
const LENS_A0 = -RM - 12, LENS_A1 = RM + 12, LENS_T0 = 1.5, LENS_T1 = 3.6;
/** When the incoming front reaches a point a along the lens beam. */
const lensPass = (a: number): number => LENS_T0 + ((a - LENS_A0) / (LENS_A1 - LENS_A0)) * (LENS_T1 - LENS_T0);

function lens(k: number, tl: number, t: number): string {
  if (k <= 0) return '';
  const d = Math.hypot(M[0] - SPOT[0], M[1] - SPOT[1]), toM = unit(SPOT, M), be = (Math.asin(RM / d) * 180) / Math.PI;
  const tl1 = add(SPOT, turn(toM, be), Math.sqrt(d * d - RM * RM)), tl2 = add(SPOT, turn(toM, -be), Math.sqrt(d * d - RM * RM));
  const front = lerp(LENS_A0, LENS_A1, ramp(tl, LENS_T0, LENS_T1));
  const beamIn = front <= LENS_A0 + 3 ? '' : COLS.map((c, i) => {
    const off = (i - 1) * 14, a = add(lensAt(LENS_A0, 0), DAY.n, off), b = add(lensAt(front, 0), DAY.n, off);
    return `<path class="f2-w f2-w${c}" d="${wpath(a, b, LAM[c], 6, drift(c, t, i), true)}" marker-end="url(#${P}-h${c})"/>`;
  }).join('');
  const out = SCAT.map(s => {
    const m = MOLS[s.m], t0 = lensPass(m.a) + 0.05;
    return scattered(s.c, lensAt(m.a, m.b), turn(DAY.u, s.ang), step(tl, t0, t0 + 0.9), 58, 14);
  }).join('');
  const mols = MOLS.map(m => { const p = lensAt(m.a, m.b); return airMol(p[0], p[1], m.m, m.ang, 11); }).join('');
  const nLab = lensAt(MOLS[5].a, MOLS[5].b), oLab = lensAt(MOLS[8].a, MOLS[8].b);
  const s = lerp(0.25, 1, k);
  return `<g opacity="${clamp(k * 1.4).toFixed(3)}" transform="translate(${pt(SPOT)}) scale(${s.toFixed(4)}) translate(${f(-SPOT[0])} ${f(-SPOT[1])})">
    <path class="sa-lead" d="M${pt(SPOT)}L${pt(tl1)}M${pt(SPOT)}L${pt(tl2)}"/>
    <circle class="sa-pick" cx="${f(SPOT[0])}" cy="${f(SPOT[1])}" r="12"/>
    <circle class="sa-lens" cx="${M[0]}" cy="${M[1]}" r="${RM}" filter="url(#${P}-sh)"/>
    <g clip-path="url(#${P}-lens)">${beamIn}${out}${mols}
      ${T(nLab[0] + 24, nLab[1] + 9, 'N₂', 'sa-t sa-t-lens')}${T(oLab[0] + 24, oLab[1] + 9, 'O₂', 'sa-t sa-t-lens')}</g>
    <circle class="sa-rim" cx="${M[0]}" cy="${M[1]}" r="${RM}"/>
    ${T(M[0] + RM + 22, M[1] - 92, 'not to scale', 'sa-note')}
  </g>`;
}

/* ---------- beat 3: scattered blue reaches you ---------- */

// Directions the scattered blue comes from, in degrees from straight up (+ towards the night side); none comes
// down the sunbeam, which arrives from 40° on the other side, so that it stays clear.
const ARRIVE = [-88, -68, 4, 24, 44, 63, 82];
const arrK = (t: number, i: number): number => step(t, 1.3 + 0.34 * i, 2.3 + 0.34 * i);
/** Distance from p along dir to the top of the air. */
function toTop(p: V, dir: V): number {
  const o: V = [p[0] - C[0], p[1] - C[1]], b = o[0] * dir[0] + o[1] * dir[1], c = o[0] ** 2 + o[1] ** 2 - RA * RA;
  return -b + Math.sqrt(Math.max(b * b - c, 0));
}
function arrivals(g: Geo, t: number, op: number): string {
  if (op <= 0) return '';
  return `<g opacity="${op.toFixed(3)}">${ARRIVE.map((ang, i) => {
    const k = arrK(t, i);
    if (k <= 0.02) return '';
    // Each wave starts in the air (at most 190 px out) and runs in to stop short of you.
    const dir = turn(g.up, ang), r0 = Math.min(toTop(g.you, dir) - 10, 190), from = add(g.you, dir, r0), to = add(g.you, dir, lerp(r0, 38, k));
    return r0 - lerp(r0, 38, k) < 14 ? '' : wv(P, 'b', from[0], from[1], to[0], to[1], { amp: 5 });
  }).join('')}</g>`;
}

/* ---------- beat 5: blue leaves the sunset beam; what you see ---------- */

// Where along the sunset air path a wave is drawn leaving the beam (fraction of the path) and its direction from the beam.
const PEEL: Array<{ s: number; c: Col; ang: number }> = [
  { s: 0.03, c: 'b', ang: -112 }, { s: 0.12, c: 'b', ang: 70 }, { s: 0.22, c: 'b', ang: -132 }, { s: 0.34, c: 'b', ang: -60 },
  { s: 0.48, c: 'g', ang: -78 }, { s: 0.66, c: 'g', ang: -104 }, { s: 0.86, c: 'r', ang: -120 },
];
// The front sweeps the path from ATT_T0 to ATT_T1 s; it ends just past you so that its soft edge has left the path.
const ATT_T0 = 0.4, ATT_T1 = 4.4, SF_END = 1.05;
const attFront = (t: number): number => SF_END * ramp(t, ATT_T0, ATT_T1);
function peels(t: number): string {
  return PEEL.map(p => {
    const t0 = lerp(ATT_T0, ATT_T1, p.s / SF_END), o = at(SET, lerp(SET.tIn, SET.L, p.s), (COLS.indexOf(p.c) - 2) * GAP);
    return scattered(p.c, o, turn(SET.u, p.ang), step(t, t0, t0 + 0.8), 58, 12);
  }).join('');
}

// The sky and the Sun as you see them at sunset, looking towards the Sun: the original's single-scattering sky.
const TRGB = [0.046, 0.108, 0.265], TO3 = [0.036, 0.026, 0.005], RE = 6371, HS = 8;
const airmass = (mu: number): number => { const m = Math.max(mu, 0); return 1 / (m + 0.025 * Math.exp(-11 * m)); };
function skyRadiance(el: number, zeta: number): number[] {
  const s = [Math.sin(zeta), 0, Math.cos(zeta)], d = [Math.cos(el), 0, Math.sin(el)];
  const b = RE * d[2], c = RE * RE - (RE + 80) ** 2, tmax = -b + Math.sqrt(b * b - c);
  const cosT = d[0] * s[0] + d[2] * s[2], ph = 0.75 * (1 + cosT * cosT), L = [0, 0, 0];
  let colV = 0, tp = 0;
  for (let i = 1; i <= 14; i++) {
    const t = tmax * (i / 14) ** 2, dt = t - tp, tm = (t + tp) / 2;
    tp = t;
    const X = [d[0] * tm, 0, RE + d[2] * tm], r = Math.hypot(X[0], X[2]), rho = Math.exp(-(r - RE) / HS), seg = (rho * dt) / HS;
    colV += seg / 2;
    const mu = (X[0] * s[0] + X[2] * s[2]) / r, muh = -Math.sqrt(Math.max(1 - (RE / r) ** 2, 0));
    if (mu > muh) {
      const cs = rho * airmass((mu - muh) / (1 - muh)), am3 = 1 / Math.sqrt(Math.max(1 - (1 - mu * mu) / 1.007, 0.006));
      for (let k = 0; k < 3; k++) L[k] += TRGB[k] * seg * Math.exp(-TRGB[k] * (colV + cs) - TO3[k] * am3) * ph;
    }
    colV += seg / 2;
  }
  return L;
}
const ZETA_SET = 89.5;
const rgbOf = (v: number[]): string => `rgb(${v.map(x => Math.round(x)).join(',')})`;
function sunColour(zDeg: number): string {
  const tr = TRGB.map(t => Math.exp(-t * airmass(Math.cos((zDeg * Math.PI) / 180)))), m = Math.max(...tr);
  return rgbOf(tr.map(v => 255 * Math.pow(v / m, 1 / 2.2)));
}
const SKY_TOP = 32; // degrees above the horizon at the top of the inset
const duskStops = [0, 0.1, 0.22, 0.36, 0.52, 0.7, 0.86, 0.95, 1].map(o => {
  const el = Math.max(0.4, SKY_TOP * (1 - o)), L = skyRadiance((el * Math.PI) / 180, (ZETA_SET * Math.PI) / 180);
  return `<stop offset="${o}" stop-color="${rgbOf(L.map(v => 255 * Math.pow(1 - Math.exp(-v * 4.6 * 2.6), 1 / 2.2)))}"/>`;
}).join('');
const VIEW = { x: 1196, y: 70, w: 344, h: 184 };
function view(k: number): string {
  if (k <= 0) return '';
  const { x, y, w, h } = VIEW, gy = y + h * 0.8, sx = x + w * 0.42, sr = 19, sc = sunColour(ZETA_SET);
  const s = lerp(0.9, 1, k), ox = SET.you[0];
  return `<g opacity="${k.toFixed(3)}">
    <path class="sa-lead" d="M${f(ox)},${y + h}L${f(ox)},${f(SET.you[1] - 16)}"/>
    <g transform="translate(${f(ox)} ${y + h}) scale(${s.toFixed(4)}) translate(${f(-ox)} ${-(y + h)})">
      <rect class="f2-card" x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" rx="18" filter="url(#${P}-sh)"/>
      <g clip-path="url(#${P}-view)">
        <rect x="${x}" y="${y}" width="${w}" height="${f(gy - y)}" fill="url(#${P}-dusk)"/>
        <circle cx="${f(sx)}" cy="${f(gy - 5)}" r="${sr * 3}" fill="url(#${P}-sunglow)"/>
        <circle cx="${f(sx)}" cy="${f(gy - 5)}" r="${sr}" fill="${sc}"/>
        <rect class="sa-ground" x="${x}" y="${f(gy)}" width="${w}" height="${f(y + h - gy)}"/>
      </g>
      <rect class="sa-view-rim" x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/>
      ${T(x - 22, y + h / 2 + 8, 'your view', 'sa-t', 'end')}
    </g></g>`;
}

/* ---------- the beat timeline ---------- */

interface Scene {
  rot: number; front: number; t: number;
  spec: number; card: number; specIn: number; fan: number; specLab: number;
  lens: number; lensT: number;
  you: number; glow: number; arrT: number; arrOp: number;
  ghost: number; brMid: number; brSet: number; brOp: number; note: number;
  attT: number; view: number;
}

/** Everything on stage as a function of the beat and the seconds since it began; each beat starts where the last ended. */
function scene(beat: number, t: number): Scene {
  const s: Scene = {
    rot: 0, front: 1, t, spec: 0, card: 1, specIn: 1, fan: 1, specLab: 1, lens: 0, lensT: 99,
    you: 0, glow: 0, arrT: 99, arrOp: 0, ghost: 0, brMid: 0, brSet: 0, brOp: 1, note: 0, attT: -1, view: 0,
  };
  if (beat <= 0) {
    // Sunlight travels to Earth; then the inset spreads it into the spectrum.
    s.front = step(t, 0.3, 2.8);
    s.spec = 1; s.card = step(t, 2.7, 3.4); s.specIn = step(t, 3.2, 3.9); s.fan = step(t, 3.8, 4.9); s.specLab = ramp(t, 4.7, 5.3);
  } else if (beat === 1) {
    // The inset closes; the magnifier opens on the air where the beam enters.
    s.spec = 1 - ramp(t, 0, 0.6); s.lens = step(t, 0.5, 1.5); s.lensT = t;
  } else if (beat === 2) {
    // The magnifier closes; you appear; scattered blue arrives from all over the sky.
    s.lens = 1 - step(t, 0, 0.8); s.you = ramp(t, 0.6, 1.2); s.glow = step(t, 1.0, 4.2); s.arrT = t; s.arrOp = 1;
  } else if (beat === 3) {
    // Earth turns you to the edge of night; brackets compare the two paths through the air.
    s.you = 1; s.glow = 1 - ramp(t, 0, 0.7); s.arrOp = 1 - ramp(t, 0, 0.7);
    s.rot = ROT * step(t, 0.6, 5.0); s.ghost = ramp(t, 1.4, 2.0);
    s.brMid = step(t, 5.0, 5.7); s.brSet = step(t, 5.5, 6.3); s.note = ramp(t, 6.1, 6.7);
  } else {
    // Blue, then some green, leaves the sunset beam on the way; the Sun you see is orange-red.
    s.you = 1; s.rot = ROT; s.ghost = 1; s.brMid = 1; s.brSet = 1; s.brOp = 1 - ramp(t, 0, 0.6); s.note = 1;
    s.attT = t; s.view = step(t, 4.6, 5.6);
  }
  return s;
}

function dynamic(s: Scene): string {
  const g = geo(s.rot), out: string[] = [];
  // The midday spot and its sunlight, left behind as Earth turns.
  const gh = s.ghost * (s.brOp < 1 ? s.brOp : 1);
  if (gh > 0) {
    out.push(`<g opacity="${gh.toFixed(3)}"><path class="sa-ghost" d="M${pt(at(DAY, B0))}L${pt(add(DAY.you, DAY.u, -12))}"/>
      <circle class="sa-ghost-dot" cx="${f(DAY.you[0])}" cy="${f(DAY.you[1])}" r="8"/></g>`);
  }
  const sF = s.attT < 0 ? -1 : attFront(s.attT);
  out.push(sunbeam(g, s.front, s.t, sF));
  out.push(arrivals(g, s.arrT, s.arrOp));
  if (s.attT >= 0) out.push(peels(s.attT));
  if (s.brOp > 0 && (s.brMid > 0 || s.brSet > 0)) {
    const mIn = at(DAY, DAY.tIn), sIn = at(SET, SET.tIn), neg = (v: V): V => [-v[0], -v[1]];
    const mMid = add(mix(mIn, DAY.you, 0.5), neg(DAY.n), 26), sMid = add(mix(sIn, SET.you, 0.5), neg(SET.n), 50);
    out.push(`<g opacity="${s.brOp.toFixed(3)}">
      ${bracket(mIn, DAY.you, neg(DAY.n), 26, s.brMid)}${bracket(sIn, SET.you, neg(SET.n), 50, s.brSet)}
      <g opacity="${ramp(s.brMid, 0.7, 1).toFixed(3)}">${T(mMid[0] + 16, mMid[1] - 14, 'midday path', 'sa-t')}</g>
      <g opacity="${ramp(s.brSet, 0.7, 1).toFixed(3)}">${T(sMid[0] + 8, sMid[1] - 20, 'sunset path', 'sa-t', 'middle')}</g></g>`);
  }
  if (s.note > 0) out.push(`<g opacity="${s.note.toFixed(3)}">${T(64, 690, 'not to scale', 'sa-note')}</g>`);
  if (s.you > 0) {
    const lab = add(g.you, turn(g.up, 138), 36);
    out.push(`<g opacity="${s.you.toFixed(3)}"><circle class="sa-you" cx="${f(g.you[0])}" cy="${f(g.you[1])}" r="8.5"/>
      ${T(lab[0], lab[1] + 9, 'you', 'sa-t sa-t-you')}</g>`);
  }
  return out.join('');
}

export const STAGING: Staging = {
  beats: SKY_R1,
  id: 'a',
  name: 'A · Wide scene',
  note: 'One fixed Sun–Earth view, as in the original animation, with a magnifier for the air.',
  svg: () => `${defs(P)}<defs>
      <radialGradient id="${P}-atm" gradientUnits="userSpaceOnUse" cx="${C[0]}" cy="${C[1]}" r="${RA}">
        <stop offset="${(R / RA).toFixed(4)}" stop-color="#c3d6ec"/><stop offset="${((R + 0.55 * (RA - R)) / RA).toFixed(4)}" stop-color="#d6e3f1"/>
        <stop offset="1" stop-color="#e9f0f7"/></radialGradient>
      <radialGradient id="${P}-skyglow"><stop offset="0" stop-color="#6d93ea" stop-opacity=".75"/><stop offset=".55" stop-color="#7f9fea" stop-opacity=".38"/><stop offset="1" stop-color="#8eaaea" stop-opacity="0"/></radialGradient>
      <radialGradient id="${P}-sunglow"><stop offset="0" stop-color="${sunColour(ZETA_SET)}" stop-opacity=".55"/><stop offset="1" stop-color="${sunColour(ZETA_SET)}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${P}-vis" x1="0" y1="0" x2="0" y2="1">${visStops}</linearGradient>
      <linearGradient id="${P}-dusk" x1="0" y1="0" x2="0" y2="1">${duskStops}</linearGradient>
      <clipPath id="${P}-disc"><circle cx="${C[0]}" cy="${C[1]}" r="${R}"/></clipPath>
      <clipPath id="${P}-air"><circle cx="${C[0]}" cy="${C[1]}" r="${RA}"/></clipPath>
      <clipPath id="${P}-ring"><path clip-rule="evenodd" d="${ring(RA)}${ring(R)}"/></clipPath>
      <clipPath id="${P}-lens"><circle cx="${M[0]}" cy="${M[1]}" r="${RM - 1.5}"/></clipPath>
      <clipPath id="${P}-view"><rect x="${VIEW.x}" y="${VIEW.y}" width="${VIEW.w}" height="${VIEW.h}" rx="12"/></clipPath>
      <filter id="${P}-soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="12"/></filter>
    </defs>
    <circle cx="${C[0]}" cy="${C[1]}" r="${RA}" fill="url(#${P}-atm)"/>
    <circle class="sa-sea" cx="${C[0]}" cy="${C[1]}" r="${R}"/>
    <g clip-path="url(#${P}-disc)"><g class="sa-landg">${landSvg}</g></g>
    <circle class="sa-limb" cx="${C[0]}" cy="${C[1]}" r="${R}"/>
    <g clip-path="url(#${P}-air)"><path class="sa-night" d="${NIGHT}" filter="url(#${P}-soft)"/></g>
    <g clip-path="url(#${P}-ring)"><circle class="sa-glow" cx="${f(DAY.you[0])}" cy="${f(DAY.you[1])}" r="250" fill="url(#${P}-skyglow)" opacity="0"/></g>
    <g class="sa-dyn"></g>
    ${sun(SUN[0], SUN[1], SUN_R)}
    <g class="sa-ins"></g>`,
  bind(stage) {
    const land = stage.querySelector('.sa-landg') as SVGGElement, glow = stage.querySelector('.sa-glow') as SVGCircleElement;
    const dyn = stage.querySelector('.sa-dyn') as SVGGElement, ins = stage.querySelector('.sa-ins') as SVGGElement;
    let last = '';
    return (beat, t) => {
      const key = `${beat}:${t.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const s = scene(beat, t), g = geo(s.rot);
      land.setAttribute('transform', `rotate(${((s.rot * 180) / Math.PI).toFixed(3)} ${C[0]} ${C[1]})`);
      glow.setAttribute('opacity', s.glow.toFixed(3));
      glow.setAttribute('cx', f(g.you[0]));
      glow.setAttribute('cy', f(g.you[1]));
      dyn.innerHTML = dynamic(s);
      ins.innerHTML = specInset(s.spec, s.card, s.specIn, s.fan, s.specLab, t) + lens(s.lens, s.lensT, t) + view(s.view);
    };
  },
};
