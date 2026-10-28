// Sunlight and the sky, staging B "Zoom journey". One illustrated world on the slide paper, seen through a camera
// that travels between scales: the Sun and Earth, the air at molecule scale, an observer under the blue sky, the
// whole Earth turning, and the observer at sunset.
// - Every beat has an end camera (centre, scale, rotation). At time t of beat k the camera interpolates from beat
//   k−1's end camera as a zoom-and-turn about the one world point both cameras show at the same screen spot, so
//   draw(beat, t) depends on beat and t only.
// - Each close-up is a "frame": a scene drawn in stage pixels and placed in the world where its camera looks. Frames
//   fade in and out with the camera scale (level of detail): molecules only when zoomed in, continents only when out.
// - Light keeps the slide-2 vocabulary: blue, green and red waves side by side, wavelengths in proportion to 450, 550
//   and 650 nm. The beam from the Sun is drawn in screen space, so its waves stay a readable size at every scale.
import { SKY_R1 } from './beats';
import './sky-b.css';
import { spec } from '../../lib/colour';
import { airMol, defs, LAM, type Col } from '../figs/s2';
import type { Staging } from './types';

type V = [number, number];
interface Cam { c: V; s: number; r: number }

const ID = 'skyb';
const COLS: Col[] = ['b', 'g', 'r'];
const f1 = (v: number): string => v.toFixed(1);
const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
const smooth = (x: number): number => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const smoother = (x: number): number => { const u = clamp01(x); return u * u * u * (u * (u * 6 - 15) + 10); };
const easeOut = (x: number): number => { const u = clamp01(x); return 1 - (1 - u) * (1 - u); };
const lerp = (a: number, b: number, e: number): number => a + (b - a) * e;
const lerpV = (a: V, b: V, e: number): V => [lerp(a[0], b[0], e), lerp(a[1], b[1], e)];
/** 0 → 1 over the time window [t0, t1]. */
const tw = (t: number, t0: number, t1: number): number => smooth((t - t0) / (t1 - t0));
/** 0 → 1 as the camera scale goes from a to b on a log scale; b < a gives an edge that rises as the camera pulls out. */
const sw = (s: number, a: number, b: number): number => smooth(Math.log(s / a) / Math.log(b / a));

// Complex arithmetic on [x, y]: a camera maps world p to screen O + m·(p − c), with m = scale·e^(i·rotation).
const cmul = (a: V, b: V): V => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a: V, b: V): V => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const csub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]];
const cadd = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
const polar = (s: number, deg: number): V => [s * Math.cos((deg * Math.PI) / 180), s * Math.sin((deg * Math.PI) / 180)];

/* ---------------------------------------------------------------- world geometry (units: beat-1 stage px) */

const O: V = [800, 370];
const C: V = [1290, 400], R = 200, RA = 246; // Earth and the top of its air, drawn far thicker than real
const at = (deg: number, r = R): V => [C[0] + r * Math.cos((deg * Math.PI) / 180), C[1] + r * Math.sin((deg * Math.PI) / 180)];
const ZEN = 30; // the Sun's angle from overhead for the observer at midday (summer midday in Zurich: about 25°)
const A_DAY = 180 + ZEN, TURN = 90 - ZEN; // observer's angle on the globe at midday; how far Earth turns to sunset
const P_DAY = at(A_DAY), P_SET = at(270);
const SUN: V = [190, P_DAY[1]], SUN_R = 64, SUN_EDGE: V = [SUN[0] + SUN_R + 20, SUN[1]];
const M_C: V = [P_DAY[0] - 12, P_DAY[1]]; // the bit of air the camera zooms into, on the beam just above the observer

// Anchor points inside the close-up frames, in the stage px of the beat that shows them.
const FEET3: V = [920, 600], HEAD3: V = [920, 526], SUN3: V = [697, 139], SUN3_R = 44;
const FEET5: V = [1320, 560], HEAD5: V = [1320, 486], SUN5: V = [240, 528], SUN5_R = 46;
const unit = (a: V, b: V): V => { const d = csub(b, a), L = Math.hypot(d[0], d[1]); return [d[0] / L, d[1] / L]; };
const U3 = unit(SUN3, HEAD3); // direct sunlight in frame 3

/** A camera that shows world point p at stage point q, at scale s and rotation r (degrees, clockwise). */
const anchored = (p: V, q: V, s: number, r: number): Cam => ({ c: csub(p, cdiv(csub(q, O), polar(s, r))), s, r });
const CAMS: Cam[] = [
  { c: [800, 385], s: 1, r: 0 }, // Sun and Earth
  { c: M_C, s: 120, r: 0 }, // air molecules
  anchored(P_DAY, FEET3, 24, TURN), // ground level at midday: the local horizon is level
  anchored(C, [960, 390], 1.2, 0), // the whole Earth
  anchored(P_SET, FEET5, 24, 0), // ground level at sunset
];
const MOVE = [0, 3.0, 2.6, 3.0, 2.8]; // camera move at the start of each beat, s
const TEND = [5.6, 8.0, 7.0, 8.4, 7.5]; // when each beat's motion has finished, s

const toScreen = (k: Cam, p: V): V => cadd(O, cmul(polar(k.s, k.r), csub(p, k.c)));
const toWorld = (k: Cam, q: V): V => cadd(k.c, cdiv(csub(q, O), polar(k.s, k.r)));

/** Zoom and turn about the world point that cameras a and b show at the same screen spot (a log spiral). */
function between(a: Cam, b: Cam, e: number): Cam {
  const ma = polar(a.s, a.r), mb = polar(b.s, b.r), den = csub(ma, mb);
  const s = a.s ** (1 - e) * b.s ** e, r = lerp(a.r, b.r, e);
  if (Math.hypot(den[0], den[1]) < 1e-9 * a.s) return { c: lerpV(a.c, b.c, e), s, r };
  const p = cdiv(csub(cmul(ma, a.c), cmul(mb, b.c)), den), q = cmul(ma, csub(p, a.c));
  return { c: csub(p, cdiv(q, polar(s, r))), s, r };
}
const camAt = (beat: number, t: number): Cam => beat === 0 ? CAMS[0] : between(CAMS[beat - 1], CAMS[beat], smoother(t / MOVE[beat]));

const worldTf = (k: Cam): string =>
  `translate(800 370) rotate(${k.r.toFixed(4)}) scale(${k.s.toFixed(6)}) translate(${(-k.c[0]).toFixed(4)} ${(-k.c[1]).toFixed(4)})`;
const frameTf = (k: Cam): string =>
  `translate(${k.c[0].toFixed(4)} ${k.c[1].toFixed(4)}) rotate(${-k.r}) scale(${(1 / k.s).toFixed(8)}) translate(-800 -370)`;

/** Drawn wavelength factor: the waves grow from slide-2 size in the wide view to 2.5× at molecule scale. */
const kOf = (s: number): number => 1 + 1.5 * clamp01(Math.log(s) / Math.log(120));
const ampOf = (k: number): number => 6 * k ** 0.6;
const gapOf = (k: number): number => 11 + (8 * (k - 1)) / 1.5;

/* ---------------------------------------------------------------- waves */

interface WOpt { amp: number; ph?: number; head?: boolean; from?: number; to?: number; env?: (d: number) => number }

/** A wave from (x0, y0) to (x1, y1), as slide 2's wv: it starts and ends on its axis; `from`/`to` clip it. */
function waveD(x0: number, y0: number, x1: number, y1: number, lam: number, o: WOpt): string {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
  if (L < 2) return '';
  const ux = dx / L, uy = dy / L, head = o.head ?? false, run = head ? Math.max(1, L - 9) : L, ramp = lam * 0.7;
  const a = Math.max(0, o.from ?? 0), b = Math.min(run, o.to ?? run);
  if (b <= a) return '';
  const n = Math.max(2, Math.ceil((b - a) / 2)), pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const d = a + ((b - a) * i) / n, e = Math.min(1, d / ramp, (run - d) / ramp) * (o.env ? o.env(d) : 1);
    const w = Math.sin((2 * Math.PI * d) / lam + (o.ph ?? 0)) * o.amp * e;
    pts.push(`${i ? 'L' : 'M'}${f1(x0 + ux * d - uy * w)},${f1(y0 + uy * d + ux * w)}`);
  }
  if (head && (o.to === undefined || o.to >= run)) pts.push(`L${f1(x1)},${f1(y1)}`);
  return pts.join('');
}

/** The part of segment a→b inside the stage plus a margin, as parameters [t0, t1]. */
function clipSeg(a: V, b: V): [number, number] {
  let t0 = 0, t1 = 1;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const edges: Array<[number, number]> = [[-dx, a[0] + 90], [dx, 1690 - a[0]], [-dy, a[1] + 90], [dy, 830 - a[1]]];
  for (const [p, q] of edges) {
    if (Math.abs(p) < 1e-12) { if (q < 0) return [1, 0]; continue; }
    const r = q / p;
    if (p < 0) t0 = Math.max(t0, r); else t1 = Math.min(t1, r);
  }
  return [t0, t1];
}

/* ---------------------------------------------------------------- the drawings */

const T = (x: number, y: number, s: string, cls: string, anchor: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}"${k ? ` data-k="${k}"` : ''}>${s}</text>`;
const wpath = (c: Col, k: string, head = true, extra = ''): string =>
  `<path class="f2-w f2-w${c}" data-k="${k}"${head ? ` marker-end="url(#${ID}-h${c})"` : ''}${extra}/>`;

/** Smooth closed curve through points (Catmull–Rom). */
function closed(pts: V[]): string {
  const n = pts.length;
  let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return `${d}Z`;
}
/** Land reaching the coast between angles a0 and a1; rin gives the inland edge, as a fraction of R. */
const rimLand = (a0: number, a1: number, rin: number[]): string => closed([
  ...rin.map((f, i) => at(a1 - ((a1 - a0) * i) / (rin.length - 1), f * R)),
  at(a0 - 3, 1.1 * R), at((a0 + a1) / 2, 1.14 * R), at(a1 + 3, 1.1 * R),
]);
const island = (dx: number, dy: number, rs: number[]): string =>
  closed(rs.map((r, i) => [C[0] + dx + r * Math.cos((i / rs.length) * 2 * Math.PI), C[1] + dy + r * Math.sin((i / rs.length) * 2 * Math.PI)] as V));

function globe(): string {
  const lands = [
    rimLand(186, 240, [1, 0.86, 0.79, 0.74, 0.8, 0.85, 1]), // the observer's land
    rimLand(288, 332, [1, 0.85, 0.8, 0.86, 1]),
    rimLand(16, 74, [1, 0.82, 0.73, 0.77, 0.7, 0.84, 1]),
    rimLand(116, 158, [1, 0.87, 0.82, 0.88, 1]),
    island(-36, 44, [40, 46, 36, 30, 38, 34]),
    island(58, -46, [24, 28, 22, 26, 20]),
  ];
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6, c = Math.cos(a), s = Math.sin(a);
    return `M${f1(SUN[0] + c * (SUN_R + 8))},${f1(SUN[1] + s * (SUN_R + 8))}L${f1(SUN[0] + c * (SUN_R + 17))},${f1(SUN[1] + s * (SUN_R + 17))}`;
  }).join('');
  return `<g data-k="globe">
    <circle cx="${C[0]}" cy="${C[1]}" r="${RA}" fill="url(#${ID}-atm)" mask="url(#${ID}-day)"/>
    <circle class="sb-ocean" cx="${C[0]}" cy="${C[1]}" r="${R}"/>
    <g clip-path="url(#${ID}-earth)"><g data-k="land">${lands.map(d => `<path class="sb-land" d="${d}"/>`).join('')}</g></g>
    <rect x="${C[0] - 14}" y="${C[1] - RA}" width="${RA + 14}" height="${2 * RA}" fill="url(#${ID}-night)" mask="url(#${ID}-air)"/>
    <path class="f2-ray" d="${rays}"/><circle class="f2-sun" cx="${SUN[0]}" cy="${SUN[1]}" r="${SUN_R}"/>
  </g>`;
}

/* Frame 1: the prism inset under the beam (stage px of beat 1). */
const BY1 = toScreen(CAMS[0], SUN)[1]; // the beam's height on the beat-1 stage
const DY1 = BY1 - 300;
const RING: V = [640, BY1];
const PR = { l: [455, 590 + DY1] as V, r: [625, 590 + DY1] as V, a: [540, 590 + DY1 - 147.2] as V };
const onFace = (p: V, q: V, f: number): V => lerpV(p, q, f);
const ENTRY = onFace(PR.l, PR.a, 0.55), IN_START: V = [330, ENTRY[1] + (ENTRY[0] - 330) * Math.tan((14.2 * Math.PI) / 180)];
const EX0 = onFace(PR.r, PR.a, 0.6), EX1 = onFace(PR.r, PR.a, 0.5); // where the fan leaves the prism
const XE = 800; // the fan's far edge
const FAN_A0 = 6, FAN_A1 = 30; // deviation of the least and the most bent light, degrees
const fanRay = (f: number): [V, V] => {
  const s = lerpV(EX0, EX1, f), a = ((FAN_A0 + (FAN_A1 - FAN_A0) * f) * Math.PI) / 180;
  return [s, [XE, s[1] + (XE - s[0]) * Math.tan(a)]];
};
const IR_TO = 0.32, VIS_TO = 0.7; // shares of the fan: infrared, visible, ultraviolet (glass spreads them about evenly)

function fan(): string {
  const quad = (f0: number, f1v: number): string => {
    const [a0, b0] = fanRay(f0), [a1, b1] = fanRay(f1v);
    return `M${f1(a0[0])},${f1(a0[1])}L${f1(b0[0])},${f1(b0[1])}L${f1(b1[0])},${f1(b1[1])}L${f1(a1[0])},${f1(a1[1])}Z`;
  };
  const N = 60, vis: string[] = [];
  for (let i = 0; i < N; i++) {
    const nm = 780 - ((i + 0.5) / N) * 400, c = spec(nm).map(v => Math.round(v * 0.88 + 250 * 0.12));
    const fa = IR_TO + ((VIS_TO - IR_TO) * i) / N, fb = IR_TO + ((VIS_TO - IR_TO) * (i + 1.04)) / N;
    vis.push(`<path d="${quad(fa, fb)}" fill="rgb(${c.join(',')})"/>`);
  }
  const top = fanRay(0), bot = fanRay(1);
  return `<g clip-path="url(#${ID}-fanclip)">
    <path class="sb-ir" d="${quad(0, IR_TO)}"/>${vis.join('')}<path class="sb-uv" d="${quad(VIS_TO, 1)}"/>
    <path class="sb-fan-edge" d="M${f1(top[0][0])},${f1(top[0][1])}L${f1(top[1][0])},${f1(top[1][1])}L${f1(bot[1][0])},${f1(bot[1][1])}L${f1(bot[0][0])},${f1(bot[0][1])}"/>
  </g>`;
}

function frame1(): string {
  const mid = (f0: number, f1v: number): number => (fanRay(f0)[1][1] + fanRay(f1v)[1][1]) / 2;
  const in0 = onFace(PR.l, PR.a, 0.52), in1 = onFace(PR.l, PR.a, 0.58);
  return `<g data-k="f1" transform="${frameTf(CAMS[0])}">
    <defs><clipPath id="${ID}-fanclip"><rect data-k="fanclip" x="${f1(EX0[0] - 6)}" y="${f1(BY1 + 100)}" width="0" height="260"/></clipPath></defs>
    <g data-k="ring"><circle class="sb-ring" cx="${RING[0]}" cy="${f1(RING[1])}" r="26"/><path class="sb-lead" d="M${RING[0]},${f1(RING[1] + 26)}V${f1(BY1 + 104)}"/></g>
    <g data-k="card">
      <rect class="f2-card" x="290" y="${f1(BY1 + 104)}" width="700" height="272" rx="16" filter="url(#${ID}-sh)"/>
      <path class="sb-glass" d="M${PR.l.join(',')}L${PR.a.join(',')}L${PR.r.join(',')}Z"/>
      <path class="sb-inner" data-k="inner" d="M${f1(in1[0])},${f1(in1[1])}L${f1(EX0[0])},${f1(EX0[1])}L${f1(EX1[0])},${f1(EX1[1])}L${f1(in0[0])},${f1(in0[1])}Z"/>
      ${COLS.map(c => wpath(c, `in-${c}`, false)).join('')}
      ${fan()}
      <g data-k="f1lab">${T(XE + 16, mid(0, IR_TO) + 8, 'infrared', 'sb-lab')}${T(XE + 16, mid(VIS_TO, 1) + 8, 'ultraviolet', 'sb-lab')}</g>
    </g>
    ${T(60, 690, 'not to scale', 'sb-note', 'start', 'f1note')}
  </g>`;
}

/* Frame 2: air molecules on the beam (stage px of beat 2; the beam runs along y = 370). */
const ON_BEAM: Array<[number, number, 'N' | 'O', number]> = [
  [250, 372, 'N', 20], [470, 366, 'N', -35], [690, 374, 'O', 60], [910, 368, 'N', 10], [1130, 371, 'N', -60], [1350, 367, 'N', 35],
];
const OFF_BEAM: Array<[number, number, 'N' | 'O', number]> = [
  [120, 120, 'N', 30], [345, 230, 'N', -20], [575, 115, 'O', 50], [805, 205, 'N', 80], [1020, 110, 'N', -40], [1245, 215, 'N', 15], [1480, 135, 'N', 60],
  [185, 585, 'N', -50], [345, 615, 'O', 20], [610, 640, 'N', 70], [830, 560, 'N', -15], [1040, 630, 'N', 40], [1270, 560, 'O', -70], [1490, 610, 'N', 25],
];
// Scattered waves: [molecule on the beam, colour, direction (deg, 0 = onward, −90 = up), length]. Rayleigh: 9 blue,
// 4 green and 2 red, as (650/450)⁴ : (650/550)⁴ : 1 = 4.4 : 2.0 : 1.
const SCAT: Array<[number, Col, number, number]> = [
  [0, 'b', -115, 165], [1, 'b', -70, 170], [0, 'g', 65, 160], [2, 'b', 120, 160], [1, 'r', 115, 165], [3, 'b', 45, 165],
  [2, 'g', -80, 165], [0, 'b', 150, 150], [4, 'b', 75, 165], [3, 'b', -105, 170], [5, 'g', 30, 160], [2, 'b', -150, 155],
  [4, 'r', -50, 170], [5, 'b', -30, 165], [4, 'g', -145, 160],
];
const K2 = kOf(120), K3 = kOf(24);

/** More air around the frame, so the molecule field has no edge while the camera arrives and leaves. */
function moreAir(): string {
  let seed = 11;
  const rnd = (): number => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const out: string[] = [];
  while (out.length < 150) {
    const x = -1600 + rnd() * 4800, y = -760 + rnd() * 2260, a = rnd() * 180, o = rnd() < 0.2;
    if (x > -40 && x < 1640 && y > -40 && y < 780) continue;
    out.push(airMol(Math.round(x), Math.round(y), o ? 'O' : 'N', Math.round(a), 8));
  }
  return out.join('');
}
function frame2(): string {
  return `<g data-k="f2" transform="${frameTf(CAMS[1])}">
    ${moreAir()}${OFF_BEAM.map(([x, y, a, r]) => airMol(x, y, a, r, 8)).join('')}
    ${SCAT.map((_, i) => wpath(SCAT[i][1], `sc${i}`)).join('')}
    ${ON_BEAM.map(([x, y, a, r]) => airMol(x, y, a, r, 8)).join('')}
    <g data-k="f2lab">${T(146, 129, 'N₂', 'sb-mol')}${T(1298, 568, 'O₂', 'sb-mol')}${T(60, 690, 'not to scale', 'sb-note')}</g>
  </g>`;
}

/* Frames 3 and 5: ground level, at midday and at sunset. */
function person(x: number, y: number): string {
  return `<g class="sb-person"><circle cx="${x}" cy="${y - 74}" r="12"/><rect x="${x - 10}" y="${y - 58}" width="20" height="36" rx="9"/>
    <path class="sb-limb" d="M${x - 4},${y - 26}L${x - 7},${y - 3}M${x + 4},${y - 26}L${x + 7},${y - 3}"/>
    <path class="sb-arm" d="M${x - 9},${y - 52}L${x - 15},${y - 31}M${x + 9},${y - 52}L${x + 15},${y - 31}"/></g>`;
}
function tree(x: number, y: number, h: number, dusk: boolean): string {
  const w = h * 0.36, cy = y - h * 0.62;
  return `<g class="${dusk ? 'sb-tree sb-dusk' : 'sb-tree'}"><rect class="sb-trunk" x="${f1(x - h * 0.045)}" y="${f1(y - h * 0.5)}" width="${f1(h * 0.09)}" height="${f1(h * 0.5)}"/>
    <path class="sb-crown" d="${closed([[x - w, cy + h * 0.08], [x - w * 0.8, cy - h * 0.2], [x - w * 0.2, cy - h * 0.38], [x + w * 0.5, cy - h * 0.3], [x + w, cy - h * 0.02], [x + w * 0.6, cy + h * 0.16], [x - w * 0.3, cy + h * 0.18]])}"/></g>`;
}
/** Ground below the horizon at height hy, wide enough to stay under the camera as it pulls out, with low hills behind. */
function landscape(hy: number, hills: Array<[number, number, number]>, dusk: boolean): string {
  const hill = hills.map(([x0, x1, h]) => `M${x0},${hy}C${f1(x0 + (x1 - x0) * 0.3)},${hy - h} ${f1(x0 + (x1 - x0) * 0.6)},${hy - h} ${x1},${hy}Z`).join('');
  return `<path class="${dusk ? 'sb-hill sb-dusk' : 'sb-hill'}" d="${hill}"/>
    <path class="${dusk ? 'sb-ground sb-dusk' : 'sb-ground'}" d="M-1600,${hy}H3200V1700H-1600Z"/><path class="sb-horizon" d="M-1600,${hy}H3200"/>`;
}

// Scattered light reaching the observer: [colour, direction from the head (deg), end radius]; 9 : 4 : 2 again.
const ARRIVE: Array<[Col, number, number]> = [
  ['b', -166, 150], ['g', -157, 96], ['b', -148, 150], ['b', -140, 96],
  ['b', -100, 150], ['r', -91.4, 96], ['b', -82.8, 150], ['g', -74.2, 96], ['b', -65.6, 150], ['b', -57, 96],
  ['g', -48.4, 150], ['b', -39.8, 96], ['r', -31.2, 150], ['b', -22.6, 96], ['g', -14, 150],
];
const ARRIVE_ORDER = [4, 10, 1, 7, 13, 2, 5, 11, 0, 8, 14, 3, 6, 12, 9];
const SUN_PALE = '#fdf1c4', SUN_PALE_STROKE = '#e8c35a';

function frame3(): string {
  return `<g data-k="f3" transform="${frameTf(CAMS[2])}">
    <defs>
      <linearGradient id="${ID}-sky3" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="600"><stop offset="0" stop-color="#aec7ec"/><stop offset="1" stop-color="#dbe7f5"/></linearGradient>
      <radialGradient id="${ID}-glow3"><stop offset="0" stop-color="#fbe9a8" stop-opacity=".9"/><stop offset="1" stop-color="#fbe9a8" stop-opacity="0"/></radialGradient>
    </defs>
    <g mask="url(#${ID}-vig)"><rect data-k="sky3" x="-1600" y="-900" width="4800" height="1500" fill="url(#${ID}-sky3)" opacity="0"/>
    ${landscape(FEET3[1], [[40, 560, 46], [1120, 1680, 54]], false)}
    ${tree(1290, FEET3[1], 104, false)}${tree(318, FEET3[1], 74, false)}</g>
    <circle cx="${SUN3[0]}" cy="${SUN3[1]}" r="110" fill="url(#${ID}-glow3)"/>
    <circle cx="${SUN3[0]}" cy="${SUN3[1]}" r="${SUN3_R}" fill="${SUN_PALE}" stroke="${SUN_PALE_STROKE}" stroke-width="2"/>
    ${ARRIVE.map(([c], i) => wpath(c, `ar${i}`)).join('')}
    ${person(FEET3[0], FEET3[1])}
    ${T(FEET3[0], FEET3[1] + 52, 'you', 'sb-you', 'middle', 'you3')}
  </g>`;
}

/* Frame 5: the beam along the long sunset path. Rayleigh optical depths of the whole air column at 450, 550 and 650 nm
   (Hansen & Travis 1974); the drawn path is the air crossed, x = p^1.8 of it at drawn fraction p (denser air near you). */
const TAU: Record<Col, number> = { b: 0.221, g: 0.097, r: 0.049 };
const AIRMASS5 = 24; // the Sun about 2° above the horizon
const trans = (c: Col, p: number): number => Math.exp(-TAU[c] * AIRMASS5 * clamp01(p) ** 1.8);
const U5 = unit(SUN5, HEAD5);
const S5: V = cadd(SUN5, [U5[0] * (SUN5_R + 14), U5[1] * (SUN5_R + 14)]), E5: V = csub(HEAD5, [U5[0] * 24, U5[1] * 24]);
const L5 = Math.hypot(E5[0] - S5[0], E5[1] - S5[1]), N5: V = [-U5[1], U5[0]];
const BLUE_END5 = 0.8; // past this the blue left in the beam is too faint to draw
// Each peel is one fifth of a colour's starting light, placed where that much of it has been scattered out:
// 5 blue, 4 green, 3 red; light arriving: blue 0.5 %, green 10 %, red 31 %. [drawn fraction p, colour, direction, length]
const PEEL: Array<[number, Col, number, number]> = (() => {
  const out: Array<[number, Col]> = [];
  for (const c of COLS) {
    for (let j = 0; j < 5; j++) {
      const x = -Math.log(1 - (j + 0.5) / 5) / (TAU[c] * AIRMASS5);
      if (x < 0.97) out.push([x ** (1 / 1.8), c]);
    }
  }
  out.sort((a, b) => a[0] - b[0]);
  // Directions open out along the path (backward-up near the Sun, forward-up near you), so no two peels cross.
  const len = [205, 165, 235, 175, 215, 160, 230, 170, 200, 225, 165, 190];
  return out.map(([p, c], i) => [p, c, -128 + (78 * i) / (out.length - 1), len[i % len.length]] as [number, Col, number, number]);
})();
/** How strongly each colour is drawn along the sunset beam: √(fraction left), as for its amplitude. */
const beamAlpha = (c: Col, p: number): number => Math.sqrt(trans(c, p)) * (c === 'b' ? 1 - smooth((p - 0.6) / (BLUE_END5 - 0.6)) : 1);
const SUNSET_RGB = ((): number[] => { // colour of the sunlight left after air mass 24, as in skyAnimation.ts sunColour
  const tr = [0.046, 0.108, 0.265].map(t => Math.exp(-t * AIRMASS5)), m = Math.max(...tr);
  return tr.map(v => 255 * (v / m) ** (1 / 2.2));
})();

function frame5(): string {
  const grad = (c: Col, stops: Array<[number, number]>): string =>
    `<linearGradient id="${ID}-o5${c}" gradientUnits="userSpaceOnUse" x1="${f1(S5[0])}" y1="${f1(S5[1])}" x2="${f1(E5[0])}" y2="${f1(E5[1])}">${stops.map(([o, a]) => `<stop offset="${o}" stop-color="${{ b: '#2350e6', g: '#2a963a', r: '#c8361e' }[c]}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
  return `<g data-k="f5" transform="${frameTf(CAMS[4])}">
    <defs>
      <linearGradient id="${ID}-sky5" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${FEET5[1]}"><stop offset="0" stop-color="#c3cfe4"/><stop offset="1" stop-color="#ebe2dc"/></linearGradient>
      <radialGradient id="${ID}-glow5" gradientUnits="userSpaceOnUse" cx="${SUN5[0]}" cy="${SUN5[1]}" r="520"><stop offset="0" stop-color="#f4a468" stop-opacity=".75"/><stop offset=".35" stop-color="#f6c08e" stop-opacity=".35"/><stop offset="1" stop-color="#f6c08e" stop-opacity="0"/></radialGradient>
      ${COLS.map(c => grad(c, Array.from({ length: 11 }, (_, i) => [i / 10, beamAlpha(c, i / 10)] as [number, number]))).join('')}
      <marker id="${ID}-hg5" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path fill="#2a963a" fill-opacity="${beamAlpha('g', 1).toFixed(2)}" d="M0,0L10,5L0,10z"/></marker>
    </defs>
    <g mask="url(#${ID}-vig)"><rect x="-1600" y="-900" width="4800" height="${900 + FEET5[1]}" fill="url(#${ID}-sky5)" opacity=".75"/>
    <rect data-k="glow5" x="-1600" y="-900" width="4800" height="${900 + FEET5[1]}" fill="url(#${ID}-glow5)" opacity="0"/>
    <circle data-k="sun5" cx="${SUN5[0]}" cy="${SUN5[1]}" r="${SUN5_R}" fill="${SUN_PALE}" stroke="${SUN_PALE_STROKE}" stroke-width="2"/>
    ${landscape(FEET5[1], [[-200, 160, 22], [1380, 1800, 48]], true)}
    ${tree(1495, FEET5[1], 98, true)}${tree(96, FEET5[1], 58, true)}</g>
    ${PEEL.map(([, c], i) => wpath(c, `pe${i}`)).join('')}
    <path class="f2-w f2-wb" data-k="b5" style="stroke:url(#${ID}-o5b)"/>
    <path class="f2-w f2-wg" data-k="g5" style="stroke:url(#${ID}-o5g)" marker-end="url(#${ID}-hg5)"/>
    <path class="f2-w f2-wr" data-k="r5" style="stroke:url(#${ID}-o5r)" marker-end="url(#${ID}-hr)"/>
    ${person(FEET5[0], FEET5[1])}
    ${T(FEET5[0], FEET5[1] + 52, 'you', 'sb-you', 'middle', 'you5')}
  </g>`;
}

/* Frame 4: path brackets on the whole Earth (stage px of beat 4). */
const C4 = CAMS[3];
const sc4 = (p: V): V => toScreen(C4, p);
const entry = (y: number): V => [C[0] - Math.sqrt(RA * RA - (y - C[1]) ** 2), y];
function bracket(p0: V, p1: V, label: string, k: string): string {
  const y = p0[1] - 36, leg = p0[1] - 20;
  return `<g data-k="${k}"><path class="sb-bracket" d="M${f1(p0[0])},${f1(leg)}V${f1(y)}H${f1(p1[0])}V${f1(leg)}"/>${T(p0[0] - 12, y + 8, label, 'sb-lab', 'end')}</g>`;
}
function frame4(): string {
  return `<g data-k="f4" transform="${frameTf(C4)}">
    ${bracket(sc4(entry(P_DAY[1])), sc4(P_DAY), 'midday path', 'mid4')}
    ${bracket(sc4(entry(P_SET[1])), sc4(P_SET), 'sunset path', 'set4')}
    ${T(0, 0, 'you', 'sb-you', 'start', 'you4')}
    ${T(60, 690, 'not to scale', 'sb-note', 'start', 'note4')}
  </g>`;
}

/* ---------------------------------------------------------------- staging */

export const STAGING: Staging = {
  beats: SKY_R1,
  id: 'b',
  name: 'B · Zoom journey',
  note: 'The camera travels: Sun to Earth, into the air, down to you, out to the turning Earth, in to the sunset.',
  svg: () => `${defs(ID)}
    <defs>
      <radialGradient id="${ID}-atm" gradientUnits="userSpaceOnUse" cx="${C[0]}" cy="${C[1]}" r="${RA}">
        <stop offset="${(R / RA).toFixed(3)}" stop-color="#9fc1ea" stop-opacity=".62"/><stop offset=".9" stop-color="#b9d2ef" stop-opacity=".38"/><stop offset="1" stop-color="#cfe0f4" stop-opacity="0"/></radialGradient>
      <linearGradient id="${ID}-night" gradientUnits="userSpaceOnUse" x1="${C[0] - 14}" y1="0" x2="${C[0] + 14}" y2="0">
        <stop offset="0" stop-color="#5f6b86" stop-opacity="0"/><stop offset="1" stop-color="#5f6b86" stop-opacity=".26"/></linearGradient>
      <clipPath id="${ID}-earth"><circle cx="${C[0]}" cy="${C[1]}" r="${R}"/></clipPath>
      <radialGradient id="${ID}-airfade" gradientUnits="userSpaceOnUse" cx="${C[0]}" cy="${C[1]}" r="${RA}">
        <stop offset="${(R / RA).toFixed(3)}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="${ID}-dayfade" gradientUnits="userSpaceOnUse" x1="${C[0] - 14}" y1="0" x2="${C[0] + 14}" y2="0">
        <stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".22"/></linearGradient>
      <mask id="${ID}-day" maskUnits="userSpaceOnUse" x="${C[0] - RA}" y="${C[1] - RA}" width="${2 * RA}" height="${2 * RA}"><rect x="${C[0] - RA}" y="${C[1] - RA}" width="${2 * RA}" height="${2 * RA}" fill="url(#${ID}-dayfade)"/></mask>
      <mask id="${ID}-air" maskUnits="userSpaceOnUse" x="${C[0] - RA}" y="${C[1] - RA}" width="${2 * RA}" height="${2 * RA}"><circle cx="${C[0]}" cy="${C[1]}" r="${RA}" fill="url(#${ID}-airfade)"/></mask>
      <radialGradient id="${ID}-vigfade" gradientUnits="userSpaceOnUse" cx="800" cy="440" r="880" gradientTransform="translate(800 440) scale(1 .62) translate(-800 -440)">
        <stop offset="0" stop-color="#fff"/><stop offset=".68" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <mask id="${ID}-vig" maskUnits="userSpaceOnUse" x="-1600" y="-900" width="4800" height="2700"><rect x="-1600" y="-900" width="4800" height="2700" fill="url(#${ID}-vigfade)"/></mask>
    </defs>
    <g class="sb-world" data-k="back">${globe()}${frame1()}${frame3()}${frame5()}</g>
    <g data-k="beams"><g data-k="main">${COLS.map(c => wpath(c, `m-${c}`)).join('')}</g><g data-k="ray">${COLS.map(c => wpath(c, `y-${c}`)).join('')}</g></g>
    <g class="sb-world" data-k="front"><circle class="sb-you-dot" data-k="youdot" r="7"/>${frame2()}${frame4()}</g>`,

  bind(stage) {
    const q = <E extends Element>(k: string): E => stage.querySelector(`[data-k="${k}"]`) as E;
    // Writes an attribute only when its value changes (the frozen end state then costs nothing per frame).
    const cache = new Map<Element, Map<string, string>>();
    const set = (el: Element, a: string, v: string): void => {
      let m = cache.get(el);
      if (!m) { m = new Map(); cache.set(el, m); }
      if (m.get(a) === v) return;
      m.set(a, v);
      el.setAttribute(a, v);
    };
    const op = (el: Element, v: number): void => {
      (el as SVGElement).style.display = v < 0.004 ? 'none' : '';
      set(el, 'opacity', v >= 0.996 ? '1' : v.toFixed(3));
    };
    const back = q('back'), front = q('front');
    const globeG = q('globe'), land = q('land'), youDot = q('youdot');
    const f1g = q('f1'), ring = q('ring'), card = q('card'), f1lab = q('f1lab'), f1note = q('f1note'), fanclip = q('fanclip');
    const inW = COLS.map(c => q(`in-${c}`));
    const f2g = q('f2'), f2lab = q('f2lab'), scat = SCAT.map((_, i) => q(`sc${i}`));
    const f3g = q('f3'), sky3 = q('sky3'), you3 = q('you3'), arr = ARRIVE.map((_, i) => q(`ar${i}`));
    const f4g = q('f4'), mid4 = q('mid4'), set4 = q('set4'), you4 = q('you4'), note4 = q('note4');
    const f5g = q('f5'), sun5 = q('sun5'), glow5 = q('glow5'), you5 = q('you5'), peel = PEEL.map((_, i) => q(`pe${i}`));
    const beam5 = COLS.map(c => q(`${c}5`));
    const mainG = q('main'), rayG = q('ray'), mainW = COLS.map(c => q(`m-${c}`)), rayW = COLS.map(c => q(`y-${c}`));

    /** The white beam in screen space: three waves between world points a and b, phase-anchored at world point ref. */
    function beamScreen(els: Element[], cam: Cam, a: V, b: V, ref: V, shift: number, inset: number): void {
      const A = toScreen(cam, a), B0 = toScreen(cam, b), L0 = Math.hypot(B0[0] - A[0], B0[1] - A[1]);
      if (L0 - inset < 4) { els.forEach(e => set(e, 'd', '')); return; }
      const u: V = [(B0[0] - A[0]) / L0, (B0[1] - A[1]) / L0], n: V = [-u[1], u[0]], L = L0 - inset;
      const B: V = [A[0] + u[0] * L, A[1] + u[1] * L], k = kOf(cam.s), gap = gapOf(k), amp = ampOf(k);
      const rs = toScreen(cam, ref), dref = (rs[0] - A[0]) * u[0] + (rs[1] - A[1]) * u[1];
      COLS.forEach((c, i) => {
        const o = (i - 1) * gap, a2: V = [A[0] + n[0] * o, A[1] + n[1] * o], b2: V = [B[0] + n[0] * o, B[1] + n[1] * o];
        const lam = LAM[c] * k, [t0, t1] = clipSeg(a2, b2);
        set(els[i], 'd', t1 > t0 ? waveD(a2[0], a2[1], b2[0], b2[1], lam, { amp, ph: (-2 * Math.PI * (dref + shift)) / lam + i * 1.3, head: true, from: t0 * L, to: t1 * L }) : '');
      });
    }
    /** A wave that grows from p along direction deg to length len·g, crests travelling with its front. */
    function grow(el: Element, c: Col, p: V, deg: number, len: number, g: number, k: number, amp: number, ph0 = 0): void {
      if (g <= 0.001) { set(el, 'd', ''); return; }
      const l = len * g, d = polar(1, deg), lam = LAM[c] * k;
      set(el, 'd', waveD(p[0], p[1], p[0] + d[0] * l, p[1] + d[1] * l, lam, { amp, head: true, ph: ph0 - (2 * Math.PI * l) / lam }));
    }

    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(4, Math.round(beatIn)));
      const key = `${b}:${Math.max(0, Math.min(t, TEND[b])).toFixed(3)}`;
      if (key === last) return;
      last = key;
      const cam = camAt(b, Math.max(0, t)), s = cam.s, tf = worldTf(cam);
      set(back, 'transform', tf); set(front, 'transform', tf);
      const tb = (k: number): number => b === k ? t : b > k ? 99 : 0; // time within beat k, its end state once past it

      // The globe: fades out as the camera goes in (later on the way into the air, so the air and the ground under it
      // carry the eye until the molecules appear); Earth turns during beat 4.
      op(globeG, b === 1 ? sw(s, 60, 25) : b === 3 ? sw(s, 16, 5) : b === 4 ? sw(s, 14, 5) : sw(s, 10, 3.5));
      const turn = TURN * smoother((tb(3) - 3.8) / 3.8);
      set(land, 'transform', `rotate(${turn.toFixed(3)} ${C[0]} ${C[1]})`);
      const you = at(A_DAY + turn);
      op(youDot, b >= 3 ? sw(s, 8, 4) : 0);
      set(youDot, 'cx', you[0].toFixed(3)); set(youDot, 'cy', you[1].toFixed(3)); set(youDot, 'r', (8 / s).toFixed(4));

      // Beat 1: the beam reaches Earth, then the prism inset.
      const t1 = tb(0);
      op(f1g, b === 0 ? 1 : b === 1 ? sw(s, 1.6, 1.12) : 0);
      op(ring, tw(t1, 2.0, 2.6)); op(card, tw(t1, 2.2, 2.9)); op(f1note, tw(t1, 2.2, 2.9)); op(f1lab, tw(t1, 4.8, 5.5));
      const gin = smooth((t1 - 2.8) / 1.0);
      COLS.forEach((c, i) => {
        const len = Math.hypot(ENTRY[0] - IN_START[0], ENTRY[1] - IN_START[1]), u: V = [(ENTRY[0] - IN_START[0]) / len, (ENTRY[1] - IN_START[1]) / len];
        const o = (i - 1) * 8, a: V = [IN_START[0] - u[1] * o, IN_START[1] + u[0] * o], l = len * gin + 4;
        set(inW[i], 'd', gin > 0 ? waveD(a[0], a[1], a[0] + u[0] * l, a[1] + u[1] * l, LAM[c], { amp: 5, ph: i * 1.3 - (2 * Math.PI * l) / LAM[c] }) : '');
      });
      set(fanclip, 'width', f1((XE - EX0[0] + 12) * smooth((t1 - 3.7) / 1.3)));

      // The main beam, Sun to the observer; in beat 3 it ends at the observer's head and starts at the Sun seen from there.
      const w3 = b === 2 || b === 3 ? Math.min(sw(s, 96, 55), sw(s, 7.2, 13)) : 0;
      op(f3g, w3);
      const head0 = b === 0 ? lerpV(SUN_EDGE, P_DAY, easeOut(t / 2.2)) : P_DAY;
      const sun3w = toWorld(CAMS[2], cadd(SUN3, [U3[0] * (SUN3_R + 14), U3[1] * (SUN3_R + 14)]));
      const head3w = toWorld(CAMS[2], csub(HEAD3, [U3[0] * 22, U3[1] * 22]));
      const shift = b === 0 ? (head0[0] - M_C[0]) : 12 + 30 * (b - 1) + 30 * easeOut(t / TEND[b]);
      op(mainG, b < 4 ? 1 : sw(s, 5, 2.5));
      beamScreen(mainW, cam, lerpV(SUN_EDGE, sun3w, w3), lerpV(head0, head3w, w3), M_C, shift, b >= 3 ? 10 * sw(s, 8, 4) : 0);
      // In beat 4 a second ray follows the observer round to the terminator.
      const rayOn = b === 3 ? (t >= 3.8 ? 1 : 0) : b === 4 ? sw(s, 9, 4) : 0;
      op(rayG, rayOn);
      if (rayOn > 0) beamScreen(rayW, cam, [SUN_EDGE[0], you[1]], you, [M_C[0], you[1]], shift, 10 * sw(s, 8, 4));

      // Beat 2: molecules; scattered waves sprout one by one.
      const t2 = tb(1);
      op(f2g, sw(s, 40, 72));
      op(f2lab, tw(t2, 2.8, 3.5));
      SCAT.forEach(([m, c, deg, len], i) => {
        const g = smooth((t2 - (3.2 + i * 0.28)) / 0.8), [mx, my] = ON_BEAM[m], d = polar(1, deg);
        grow(scat[i], c, [mx + d[0] * 15, my + d[1] * 15], deg, len, g, K2, 8, i * 0.9);
      });

      // Beat 3: scattered light arrives from the whole sky, and the sky fills with blue.
      const t3 = tb(2);
      op(sky3, 0.85 * tw(t3, 3.0, 6.5)); op(you3, tw(t3, 2.6, 3.2));
      ARRIVE.forEach(([c, deg, rEnd], i) => {
        const tau = 2.9 + ARRIVE_ORDER.indexOf(i) * 0.2, g = (t3 - tau) / 1.3;
        if (g <= 0) { set(arr[i], 'd', ''); return; }
        const r = lerp(560, rEnd, smoother(g)), d = polar(1, deg), lam = LAM[c] * K3;
        const h: V = [HEAD3[0] + d[0] * r, HEAD3[1] + d[1] * r], o: V = [h[0] + d[0] * 150, h[1] + d[1] * 150];
        set(arr[i], 'd', waveD(o[0], o[1], h[0], h[1], lam, { amp: 6, head: true, ph: i * 0.7 }));
        set(arr[i], 'opacity', tw(t3, tau, tau + 0.3).toFixed(3));
      });

      // Beat 4: brackets, the observer's label, then the sunset bracket once Earth has turned.
      const t4 = tb(3);
      op(f4g, b === 3 ? 1 : b === 4 ? sw(s, 2.2, 1.5) : 0);
      op(mid4, tw(t4, 3.0, 3.6)); op(note4, tw(t4, 3.0, 3.6)); op(you4, tw(t4, 3.0, 3.6)); op(set4, tw(t4, 7.7, 8.3));
      const ys = sc4(you);
      set(you4, 'x', f1(ys[0] + 18)); set(you4, 'y', f1(ys[1] + 8));

      // Beat 5: the beam crosses the long path; blue peels off first, then green; the low Sun turns orange-red.
      const t5 = tb(4);
      op(f5g, b === 4 ? sw(s, 5, 11) : 0);
      op(you5, tw(t5, 2.6, 3.2));
      const fr = clamp01((t5 - 3.0) / 3.4), k5 = K3, amp5 = ampOf(k5), gap5 = gapOf(k5);
      COLS.forEach((c, i) => {
        const o = (i - 1) * gap5, a: V = [S5[0] + N5[0] * o, S5[1] + N5[1] * o], end = c === 'b' ? Math.min(fr, BLUE_END5) : fr, l = L5 * end;
        const lam = LAM[c] * k5;
        const env = (d: number): number => beamAlpha(c, d / L5);
        set(beam5[i], 'd', l > 4 ? waveD(a[0], a[1], a[0] + U5[0] * l, a[1] + U5[1] * l, lam, { amp: amp5, head: c !== 'b', env, ph: i * 1.3 - (2 * Math.PI * l) / lam }) : '');
      });
      PEEL.forEach(([p, c, deg, len], i) => {
        const o = (COLS.indexOf(c) - 1) * gap5, start: V = [S5[0] + U5[0] * L5 * p + N5[0] * o, S5[1] + U5[1] * L5 * p + N5[1] * o];
        grow(peel[i], c, start, deg, len, smooth((t5 - (3.0 + 3.4 * p)) / 0.7), k5, 6, i * 0.8);
      });
      const red = tw(t5, 6.2, 7.4);
      const mix = (a: number[], b2: number[]): string => `rgb(${a.map((v, j) => Math.round(lerp(v, b2[j], red))).join(',')})`;
      set(sun5, 'fill', mix([253, 241, 196], SUNSET_RGB));
      set(sun5, 'stroke', mix([232, 195, 90], [200, 80, 30]));
      op(glow5, red);
    };
  },
};
