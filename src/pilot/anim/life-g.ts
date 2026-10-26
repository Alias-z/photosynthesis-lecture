// Animation 2 · "Who uses which light?", staging G · "Zoom through the eye". Life C's journey on one shore (the early
// fish crawls ashore and morphs into a four-legged animal, a small mammal, a monkey; later a bee), told with life D's
// framed windows: the camera zooms moderately onto the current creature's eye, a lens opens there onto what that eye
// sees and glides into its window, with the eye's light-sensitive cells (coloured dots) under it, which light up as the
// light arrives. Then the lens closes back to the eye and the camera pulls out to the next scene.
import './life-g.css';
import type { Staging } from './types';
import { enc, lin, spec } from '../../lib/colour';
import { T, defs, glow } from '../figs/s2';
import { EINSTEIN_TEASER, clipFx, clipHeight, clipping } from '../figs/clipping';

const P = 'lfg';
type RGB = [number, number, number];
type Pt = [number, number];

const f = (v: number): string => v.toFixed(1);
const clamp = (v: number, a = 0, b = 1): number => Math.max(a, Math.min(b, v));
const sm = (x: number): number => { const u = clamp(x); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number): number => sm((t - a) / (b - a));
const outC = (x: number): number => 1 - Math.pow(1 - clamp(x), 3);
const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;
const lerpP = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const mix = (a: readonly number[], b: readonly number[], k: number): RGB => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const rgb = (c: readonly number[]): string => `rgb(${c.map(v => Math.round(clamp(v, 0, 255))).join(',')})`;
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/** A small seeded generator, so drawn leaves and dots stay where they are on every load. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Catmull–Rom curve through the points, as cubic segments (no leading move). */
function curve(pts: Pt[]): string {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}
const smooth = (pts: Pt[]): string => `M${f(pts[0][0])},${f(pts[0][1])}${curve(pts)}`;

/* ---------- colours of light ---------- */

const PAGE: RGB = [250, 249, 245];
/** The colours of the light-sensitive cells: one per kind. Ultraviolet is shown as purple. */
const K = { uv: hex('#8a3fd1'), b: hex('#2350e6'), g: hex('#2a963a'), r: hex('#c8361e'), yg: hex('#a9b52a') };
/** Display colour of a wavelength, as on slide 3: spectral inside 380–780 nm, dimming at the edges. */
function full(nm: number): RGB {
  if (nm < 380) return [125, 111, 168];
  if (nm > 780) return [154, 150, 140];
  const b = clamp(Math.min((nm - 372) / 46, (800 - nm) / 100), 0.3, 1);
  return mix([40, 26, 44], spec(nm), b);
}
/** 0 at a, 1 at b (b < a gives a falling edge). */
const edge = (nm: number, a: number, b: number): number => sm((nm - a) / (b - a));

/* ---------- the shore: sea on the left, land on the right ---------- */

const YS = 395, YB = 660;
/** Depth below the surface, compressed so a few metres and a hundred metres both fit. */
const yAt = (d: number): number => YS + (YB - YS) * Math.pow(d / 100, 0.35);
const dAt = (y: number): number => 100 * Math.pow(clamp((y - YS) / (YB - YS), 0, 10), 1 / 0.35);
/** Pure water, per metre, averaged over the red, green and blue thirds of the spectrum. */
const AW: RGB = [0.30, 0.06, 0.012];
const trans = (d: number): RGB => [Math.exp(-AW[0] * d), Math.exp(-AW[1] * d), Math.exp(-AW[2] * d)];
/** An object's colour lit by daylight that has come down through d metres of water (multiplied in linear RGB). */
const tint = (c: RGB, d: number): RGB => { const k = trans(d); return [enc(lin(c[0]) * k[0]), enc(lin(c[1]) * k[1]), enc(lin(c[2]) * k[2])]; };
const waterAt = (d: number): RGB => mix(tint([206, 236, 240], d + 1.2), [86, 110, 132], 0.2);
const diag = (k: readonly number[]): string => `${k[0].toFixed(4)} 0 0 0 0 0 ${k[1].toFixed(4)} 0 0 0 0 0 ${k[2].toFixed(4)} 0 0 0 0 0 1 0`;

const SHORE: Pt[] = [[0, 772], [300, 752], [450, 712], [560, 650], [640, 592], [700, 545], [750, 500], [790, 468], [832, 447], [872, 442],
  [904, 435], [928, 416], [948, 395], [985, 383], [1030, 375], [1090, 370], [1200, 368], [1350, 368], [1500, 369], [1600, 367], [1800, 368]];
const SHORE_I = 12;
function groundY(x: number): number {
  for (let i = 1; i < SHORE.length; i++) {
    if (x <= SHORE[i][0]) {
      const [x0, y0] = SHORE[i - 1], [x1, y1] = SHORE[i];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return SHORE[SHORE.length - 1][1];
}
const FLOOR = SHORE.slice(0, SHORE_I + 1), LAND = SHORE.slice(SHORE_I);
const GROUND_D = `${smooth(SHORE)}L1800,790L0,790Z`;
const WATER_D = `M0,${YS}L${SHORE[SHORE_I][0]},${YS}${curve([...FLOOR].reverse())}Z`;
const SAND: RGB = [222, 204, 160];
const DEEP_ALGA = { x: 702, y: groundY(702), d: 15 };
const SHALLOW_ALGA = { x: 820, y: groundY(820), d: 1.5 };
const TINTED = [SHALLOW_ALGA, DEEP_ALGA];

/* ---------- drawings ---------- */

/** A wave of light with its true relative wavelength (nm / 22 px, as slide 2's waves), along a straight line. */
function waveD(x0: number, y0: number, x1: number, y1: number, nm: number, amp = 6, ph = 0): string {
  const lam = nm / 22, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const ramp0 = lam * 0.7, n = Math.max(2, Math.ceil(L / 1.5));
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const d = (L * i) / n, e = Math.min(1, d / ramp0, (L - d) / ramp0);
    const w = Math.sin((2 * Math.PI * d) / lam + ph) * amp * e;
    pts.push(`${i ? 'L' : 'M'}${f(x0 + ux * d - uy * w)},${f(y0 + uy * d + ux * w)}`);
  }
  return pts.join('');
}
const leafD = (l: number, w: number): string => `M${f(-l / 2)},0Q${f(-l * 0.1)},${f(-w)} ${f(l / 2)},0Q${f(-l * 0.1)},${f(w)} ${f(-l / 2)},0Z`;

/** Red seaweed: a tuft of flat blades that widen to rounded tips. */
function redAlga(x: number, y: number, s: number, seed: number): string {
  const r = rng(seed);
  const blades = [-40, -20, 0, 18, 36].map((a, i) => {
    const ang = ((a + (r() - 0.5) * 8) * Math.PI) / 180, len = (40 + r() * 16 - Math.abs(a) * 0.25) * s, wmax = (6.5 + r() * 2) * s;
    const bend = (i % 2 ? 1 : -1) * (5 + r() * 5) * s;
    const ux = Math.sin(ang), uy = -Math.cos(ang), nx = -uy, ny = ux;
    const left: string[] = [], right: string[] = [];
    for (let k = 0; k <= 14; k++) {
      const u = k / 14, c = bend * Math.sin(Math.PI * u);
      const w = u < 0.8 ? wmax * (0.22 + 0.78 * Math.sin((u / 0.8) * (Math.PI / 2))) : wmax * Math.sqrt(Math.max(0, 1 - ((u - 0.8) / 0.2) ** 2));
      const cx = x + ux * len * u + nx * c, cy = y + uy * len * u + ny * c;
      left.push(`${f(cx - nx * w)},${f(cy - ny * w)}`);
      right.push(`${f(cx + nx * w)},${f(cy + ny * w)}`);
    }
    return `M${left.join('L')}L${right.reverse().join('L')}Z`;
  }).join('');
  return `<path class="lfg-ralga" d="${blades}"/><ellipse class="lfg-hold" cx="${f(x)}" cy="${f(y + 1)}" rx="${f(7 * s)}" ry="${f(3.5 * s)}"/>`;
}

/* the fruit tree */
const TREE_X = 1410;
const CROWN: Array<[number, number, number]> = [[-110, 286, 44], [-68, 244, 52], [0, 228, 52], [68, 244, 52], [108, 286, 42], [-38, 290, 48], [38, 292, 48]];
const FRUIT: Pt[] = [[-96, 308], [-62, 280], [-24, 318], [12, 294], [52, 320], [86, 298], [112, 304], [-30, 254], [42, 262]];
const YOUNG: Pt[] = [[0, -2.6], [1, -2.2], [2, -1.85], [2, -1.2], [3, -0.85], [4, -0.35], [1, -2.9]];
/** Where the monkey hangs (its feet), just under the branch on the crown's left side, and how small it is there. */
const HANG: Pt = [1272, 232], HANG_S = 0.74;
/** The leaf the plants beat looks at, on the crown's left edge. */
const LEAF: Pt = [TREE_X - 157, 282];

function tree(): string {
  const r = rng(7);
  const greens = ['#6f9f50', '#5a8a3e', '#7cab5a', '#638f46'];
  const leaves = Array.from({ length: 64 }, (_, i) => {
    const [dx, cy, cr] = CROWN[i % CROWN.length], a = r() * Math.PI * 2, rr = cr * Math.sqrt(r()) * 0.9;
    return `<path class="lfg-tl" fill="${greens[Math.floor(r() * greens.length)]}" d="${leafD(20 + r() * 7, 6 + r() * 2)}" transform="translate(${f(TREE_X + dx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))}) rotate(${f(r() * 360)})"/>`;
  }).join('');
  const young = YOUNG.map(([i, a]) => {
    const [dx, cy, cr] = CROWN[i], x = TREE_X + dx + (cr - 2) * Math.cos(a), y = cy + (cr - 2) * Math.sin(a), deg = (a * 180) / Math.PI;
    return [-28, 0, 28].map(k => `<path class="lfg-young" d="${leafD(22, 6.5)}" transform="translate(${f(x)} ${f(y)}) rotate(${f(deg + k)}) translate(10 0)"/>`).join('');
  }).join('');
  const fruit = FRUIT.map(([dx, y]) => {
    const x = TREE_X + dx;
    return `<path class="lfg-stalk" d="M${x},${y - 9} l1,-6"/><circle class="lfg-fruit" cx="${x}" cy="${y}" r="9.5"/><circle class="lfg-fruit-hi" cx="${x - 3}" cy="${y - 3.5}" r="2.6"/>`;
  }).join('');
  const X0 = TREE_X;
  return `<path class="lfg-trunk" d="M${X0 - 19},370C${X0 - 12},352 ${X0 - 10},336 ${X0 - 13},306C${X0 - 5},310 ${X0 + 6},310 ${X0 + 14},306C${X0 + 11},336 ${X0 + 13},352 ${X0 + 21},370Z"/>
    <path class="lfg-branch" d="M${X0 - 8},318C${X0 - 26},300 ${X0 - 46},292 ${X0 - 68},282M${X0 + 8},316C${X0 + 28},300 ${X0 + 50},292 ${X0 + 72},284M${X0},310L${X0},262"/>
    ${CROWN.map(([dx, y, c]) => `<circle class="lfg-crown-o" cx="${TREE_X + dx}" cy="${y}" r="${c}"/>`).join('')}
    ${CROWN.map(([dx, y, c]) => `<circle class="lfg-crown" cx="${TREE_X + dx}" cy="${y}" r="${c}"/>`).join('')}
    ${leaves}${young}${fruit}
    <path class="lfg-tl lfg-tl-big" d="${leafD(34, 9)}" transform="translate(${LEAF[0]} ${LEAF[1]}) rotate(196)"/>
    <path class="lfg-limb" d="M${X0 - 96},${HANG[1] + 4}C${X0 - 130},${HANG[1] - 1} ${X0 - 160},${HANG[1] - 5} ${X0 - 186},${HANG[1] - 10}M${X0 - 168},${HANG[1] - 7}l-12,-14"/>`;
}

/* two flowers: one stays as we see it, the bee's lens goes over the other */
interface Fl { x: number; y: number; r: number; n: number; rot: number }
const FL_BEE: Fl = { x: 1102, y: 314, r: 29, n: 11, rot: 8 };
const FL_US: Fl = { x: 1186, y: 302, r: 32, n: 12, rot: 0 };
/** False colours in the bee's view: each of its receptor kinds is shown in its own dot colour. */
const BEEVIEW = { tip: rgb(mix(K.uv, PAGE, 0.18)), base: '#3f5f34', disk: '#2c2a26', stem: '#3e5640', ground: '#4a463c', sky: rgb(mix(K.uv, [196, 214, 245], 0.72)) };

function flower(fl: Fl, view: 'us' | 'bee'): string {
  const bee = view === 'bee';
  const gy = groundY(fl.x) + 3;
  const stem = `<path class="lfg-stem" ${bee ? `style="stroke:${BEEVIEW.stem}"` : ''} d="M${fl.x},${fl.y + 4}Q${fl.x - 4},${f((fl.y + gy) / 2)} ${fl.x},${f(gy)}"/>`
    + `<path class="lfg-sleaf" ${bee ? `style="fill:${BEEVIEW.stem};stroke:${BEEVIEW.stem}"` : ''} d="${leafD(22, 6)}" transform="translate(${f(fl.x + 10)} ${f(gy - 16)}) rotate(-30)"/>`;
  const r0 = fl.r * 0.26, w = fl.r * 0.2;
  const petal = `M${f(r0)},0C${f(r0 + (fl.r - r0) * 0.3)},${f(-w)} ${f(fl.r - (fl.r - r0) * 0.12)},${f(-w)} ${f(fl.r)},0C${f(fl.r - (fl.r - r0) * 0.12)},${f(w)} ${f(r0 + (fl.r - r0) * 0.3)},${f(w)} ${f(r0)},0Z`;
  const style = bee ? `style="fill:url(#${P}-uvbull);stroke:${BEEVIEW.base}"` : '';
  const petals = Array.from({ length: fl.n }, (_, k) => `<path class="lfg-petal" ${style} d="${petal}" transform="translate(${fl.x} ${fl.y}) rotate(${f(fl.rot + (k * 360) / fl.n)})"/>`).join('');
  return `${stem}${petals}<circle class="lfg-disk" ${bee ? `style="fill:${BEEVIEW.disk};stroke:${BEEVIEW.disk}"` : ''} cx="${fl.x}" cy="${fl.y}" r="${f(fl.r * 0.32)}"/>`;
}

const grass = (): string => Array.from({ length: 15 }, (_, i) => {
  const x = 1010 + i * 36 + (i % 3) * 5;
  if ([FL_US, FL_BEE].some(fl => Math.abs(fl.x - x) < 10) || Math.abs(x - TREE_X) < 26) return '';
  const y = groundY(x) + 1;
  return `M${x},${f(y)}l-5,-11M${x},${f(y)}l0,-13M${x},${f(y)}l5,-11`;
}).join('');

/** The bee, side view, facing right, centred on the origin. */
const bee = (): string => `
  <ellipse class="lfg-wing" cx="-6" cy="-17" rx="18" ry="8" transform="rotate(-26 -6 -17)"/>
  <ellipse class="lfg-wing" cx="5" cy="-16" rx="14" ry="7" transform="rotate(-10 5 -16)"/>
  <path class="lfg-leg" d="M-2,8 l-5,12 M4,9 l0,13 M9,7 l6,11"/>
  <path class="lfg-sting" d="M-33,4 l-6,1"/>
  <ellipse class="lfg-abd" cx="-15" cy="2" rx="18" ry="12"/>
  <g clip-path="url(#${P}-abdc)"><path class="lfg-stripe" d="M-23,-12 q-4,14 0,28 M-12,-12 q-4,14 0,28 M-33,-12 q-4,14 0,28"/></g>
  <ellipse class="lfg-abd-o" cx="-15" cy="2" rx="18" ry="12"/>
  <circle class="lfg-thorax" cx="6" cy="0" r="10"/>
  <circle class="lfg-head" cx="19" cy="2" r="7.5"/>
  <path class="lfg-ant" d="M22,-4 q5,-9 13,-11 M19,-5 q3,-10 9,-14"/>`;
const BEE_EYE: Pt = [21, 1];
const BEE_S = 1.25;
/** The bee: where it enters, and where it hovers, looking at the flower. */
const BEE0: Pt = [520, 80], BEE1: Pt = [1046, 262];

/* ---------- the subject: fish → four-legged animal → small mammal → monkey ---------- */

/** Closed Catmull–Rom outline, densely sampled. */
function closedCR(pts: Pt[], n = 10): Pt[] {
  const out: Pt[] = [], N = pts.length;
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const c = (j: 0 | 1): number => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3);
      out.push([c(0), c(1)]);
    }
  }
  return out;
}
/** n points evenly spaced along a closed polygon, starting at its first point (the nose), so outlines morph point by point. */
function resample(poly: Pt[], n: number): Pt[] {
  const segs = poly.map((a, i) => { const b = poly[(i + 1) % poly.length]; return Math.hypot(b[0] - a[0], b[1] - a[1]); });
  const total = segs.reduce((s, v) => s + v, 0), out: Pt[] = [];
  let i = 0, acc = 0;
  for (let k = 0; k < n; k++) {
    const target = (total * k) / n;
    while (acc + segs[i] < target) { acc += segs[i]; i++; }
    const a = poly[i], b = poly[(i + 1) % poly.length], u = segs[i] ? (target - acc) / segs[i] : 0;
    out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
  }
  return out;
}
const N_OUT = 120;
interface Form { pts: Pt[]; eye: Pt; fill: RGB }
// Outlines face right, nose first, then over the back; y = 0 is the ground (the fish's belly).
const FORMS: Form[] = [
  { // early jawless fish (after Haikouichthys): a dorsal fin fold, no jaws, no paired limbs
    pts: [[66, -12], [58, -19], [40, -23], [16, -24], [0, -31], [-22, -33], [-44, -26], [-62, -20], [-78, -22], [-92, -13], [-78, -5], [-62, -6], [-40, -1], [-14, 0], [16, 0], [42, -2], [58, -6]],
    eye: [50, -15], fill: hex('#cdc4aa'),
  },
  { // early four-legged animal: flat head, sprawling legs, finned tail
    pts: [[76, -10], [66, -19], [46, -23], [20, -25], [-10, -26], [-38, -22], [-62, -17], [-84, -13], [-106, -8], [-84, -5], [-62, -6], [-50, -6], [-56, 0], [-36, 0], [-34, -8], [-8, -9], [12, -9], [8, 0], [28, 0], [30, -8], [52, -6], [68, -6]],
    eye: [56, -18], fill: hex('#8f8a5e'),
  },
  { // small mammal: rounded ears, snout, legs under the body, long tail
    pts: [[66, -20], [58, -29], [46, -35], [42, -47], [33, -44], [14, -45], [-14, -45], [-36, -38], [-46, -31], [-70, -38], [-92, -32], [-72, -31], [-50, -24], [-44, -18], [-48, 0], [-32, 0], [-28, -14], [0, -15], [18, -15], [14, 0], [30, 0], [33, -14], [50, -17], [60, -16]],
    eye: [47, -31], fill: hex('#8a6a4a'),
  },
  { // monkey, sitting: round head, one arm reaching toward the tree, long tail curling at the tip
    pts: [[39, -84], [37, -96], [28, -107], [12, -112], [-4, -106], [-10, -92], [-10, -80], [-16, -62], [-22, -40], [-24, -24],
      [-38, -17], [-58, -17], [-75, -27], [-85, -45], [-82, -63], [-71, -74], [-57, -72], [-50, -63], [-52, -56],
      [-58, -59], [-64, -64], [-73, -60], [-77, -49], [-73, -37], [-63, -29], [-48, -25], [-34, -25],
      [-24, -9], [-14, 0], [10, 0], [34, 0], [37, -7], [29, -23], [17, -30], [14, -44],
      [26, -51], [43, -58], [55, -66], [63, -65], [68, -71], [64, -77], [55, -77], [44, -70], [28, -64], [17, -66],
      [23, -74], [34, -76]],
    eye: [22, -93], fill: hex('#7d6550'),
  },
].map(fm => ({ ...fm, pts: resample(closedCR(fm.pts as Pt[]), N_OUT) as Pt[] })) as Form[];

/** A smooth closed curve through the points (Catmull–Rom as cubic Béziers), so the outline stays round when the camera dives in. */
function closedCurve(pts: Pt[]): string {
  const n = pts.length, g = (v: number): string => v.toFixed(2);
  let d = `M${g(pts[0][0])},${g(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${g(p1[0] + (p2[0] - p0[0]) / 6)},${g(p1[1] + (p2[1] - p0[1]) / 6)} ${g(p2[0] - (p3[0] - p1[0]) / 6)},${g(p2[1] - (p3[1] - p1[1]) / 6)} ${g(p2[0])},${g(p2[1])}`;
  }
  return `${d}Z`;
}

function formAt(m: number): { d: string; eye: Pt; fill: string } {
  const i = Math.min(2, Math.floor(m)), k = sm(m - i), a = FORMS[i], b = FORMS[i + 1];
  const pts = a.pts.map((p, j) => lerpP(p, b.pts[j], k));
  return { d: closedCurve(pts), eye: lerpP(a.eye, b.eye, k), fill: rgb(mix(a.fill, b.fill, k)) };
}

/* ---------- inside the eye: its light-sensitive cells, and a window on what it sees ---------- */

const PW = 380, PH = 220, PR = 16;
const WIN_Y = 132;
/** Left edges of the windows: one centred (on land), or a pair side by side. */
const SLOT_C = 610, SLOT_A = 310, SLOT_B = 910;
/** Light comes down from the window into the eye under it. */
const WV0 = WIN_Y + PH + 12, WV1 = WIN_Y + PH + 50;
const ER = 86, EYE_Y = WV1 + ER + 8;
const COL = { b: '#2350e6', g: '#2a963a', r: '#c8361e', y: '#a5b41f', uv: '#8b55d6' } as const;
type Dot = keyof typeof COL;
const NMOF: Record<Dot, number> = { uv: 365, b: 450, g: 540, y: 560, r: 650 };
/** Which kind of cell each kind of light lights up. */
const CATCH: Record<Dot, Dot[]> = { uv: ['uv'], b: ['b'], g: ['g', 'y'], y: ['y'], r: ['r', 'y'] };
/** Most mammals: two kinds (blue, yellow-green). Primates and us: three (blue, green, red). */
const MAM: Dot[] = ['y', 'b', 'y', 'y', 'y', 'b', 'y'];
const PRI: Dot[] = ['r', 'b', 'g', 'r', 'g', 'b', 'r'];
const eyeC = (x0: number): Pt => [x0 + PW / 2, EYE_Y];

/** Light arriving at an eye: short parallel waves from the window down to the eye. */
function eyeWaves(x0: number, cols: Dot[], cls: string): string {
  const gap = 15, xs = x0 + PW / 2 - ((cols.length - 1) * gap) / 2;
  return cols.map((c, i) => `<path class="lfg-ew ${cls}" pathLength="1" style="stroke:${COL[c]}" d="${waveD(xs + i * gap, WV0, xs + i * gap, WV1, NMOF[c], 4.5, 0.6 * i)}"/>`).join('');
}
/** Halo and dot for one cell; the halo lights up when light this cell catches arrives. */
const cell = (x: number, y: number, d: Dot, r: number, cls: string, lit: Dot[]): string =>
  `<circle class="lfg-halo ${cls}" cx="${f(x)}" cy="${f(y)}" r="${f(r * 2.1)}" fill="${COL[d]}" opacity="0" data-lit="${lit.some(w => CATCH[w].includes(d)) ? 1 : 0}"/>`
  + `<circle class="lfg-dot" cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${COL[d]}"/>`;

/** Our kind of eye, cut through and looking up at the window: cornea and lens on top, the retina below with its
 *  light-sensitive cells as coloured dots. */
function camEye(x0: number, dots: Dot[], cls: string, lit: Dot[]): string {
  const [cx, cy] = eyeC(x0), r = ER, rr = r - 14;
  const at = (deg: number, d: number): Pt => [cx + Math.cos((deg * Math.PI) / 180) * d, cy + Math.sin((deg * Math.PI) / 180) * d];
  const c0 = at(-124, r), c1 = at(-56, r), i0 = at(-114, r), i1 = at(-66, r), a0 = at(12, r - 5), a1 = at(168, r - 5);
  const ds = dots.map((d, k) => { const [x, y] = at(24 + (132 * k) / (dots.length - 1), rr); return cell(x, y, d, 11, cls, lit); }).join('');
  return `<circle class="lfg-ball" cx="${cx}" cy="${cy}" r="${r}"/>
    <path class="lfg-cornea" d="M${f(c0[0])},${f(c0[1])}Q${cx},${cy - r - 24} ${f(c1[0])},${f(c1[1])}"/>
    <path class="lfg-retina" d="M${f(a0[0])},${f(a0[1])}A${r - 5},${r - 5} 0 0 1 ${f(a1[0])},${f(a1[1])}"/>
    <ellipse class="lfg-elens" cx="${cx}" cy="${cy - r + 24}" rx="25" ry="13"/>
    <path class="lfg-iris" d="M${f(i0[0])},${f(i0[1])}L${cx - 21},${f(cy - r + 10)}M${f(i1[0])},${f(i1[1])}L${cx + 21},${f(cy - r + 10)}"/>
    ${ds}`;
}
/** A bee's compound eye: a cluster of facets, each with ultraviolet, blue and green light-sensitive cells. */
function beeEye(x0: number, cls: string, lit: Dot[]): string {
  const [cx, cy] = eyeC(x0), R = 25;
  const hexes: Pt[] = [[0, 0], ...Array.from({ length: 6 }, (_, k) => [Math.cos(((k * 60 + 30) * Math.PI) / 180) * R * 1.75, Math.sin(((k * 60 + 30) * Math.PI) / 180) * R * 1.75] as Pt)];
  const hexD = ([x, y]: Pt): string => `M${Array.from({ length: 6 }, (_, k) => `${f(cx + x + Math.cos((k * 60 * Math.PI) / 180) * R)},${f(cy + y + Math.sin((k * 60 * Math.PI) / 180) * R)}`).join('L')}Z`;
  const ds = hexes.map(([x, y]) => (['uv', 'b', 'g'] as Dot[]).map((d, k) => {
    const a = ((k * 120 - 90) * Math.PI) / 180;
    return cell(cx + x + Math.cos(a) * 9.5, cy + y + Math.sin(a) * 9.5, d, 6.5, cls, lit);
  }).join('')).join('');
  return `<ellipse class="lfg-ceye-o" cx="${cx}" cy="${cy}" rx="${f(R * 3.1)}" ry="${f(R * 2.9)}"/>${hexes.map(h => `<path class="lfg-facet" d="${hexD(h)}"/>`).join('')}${ds}`;
}

/** The fruit tree up close: leaves all over, ripe fruit among them (plain attributes, so a filter can recolour it). */
function crownView(): string {
  const r = rng(21);
  const greens = ['#6f9f50', '#5a8a3e', '#7cab5a', '#638f46', '#4f7d3a', '#86b064'];
  const lv = (n: number): string => Array.from({ length: n }, () =>
    `<path fill="${greens[Math.floor(r() * greens.length)]}" stroke="#46703a" stroke-width="1" d="${leafD(44 + r() * 18, 13 + r() * 4)}" transform="translate(${f(-20 + r() * (PW + 40))} ${f(-20 + r() * (PH + 40))}) rotate(${f(r() * 360)})"/>`).join('');
  const FR: Pt[] = [[70, 74], [156, 170], [226, 66], [300, 150], [356, 74], [100, 220], [338, 226], [236, 238], [42, 156]];
  const fruit = FR.map(([x, y]) => `<path d="M${x},${y - 16} l2,-11" stroke="#5f4630" stroke-width="3" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="17" fill="#d23c24" stroke="#8e2316" stroke-width="2"/><circle cx="${x - 5}" cy="${y - 6}" r="4" fill="#f3a08a"/>`).join('');
  return `<rect width="${PW}" height="${PH}" fill="#4f7d3a"/>${lv(110)}${fruit}${lv(14)}`;
}
/** The flower up close, as we see it or as a bee does (ultraviolet shown as purple). */
const FR_BULL = PH * 0.37;
function flowerView(beeView: boolean): string {
  const fx = PW * 0.42, fy = PH * 0.46, fr = FR_BULL, n = 14, rx = PW * 0.84, ry = PH * 0.72;
  const r0 = fr * 0.24, w = fr * 0.15;
  const petal = `M${f(r0)},0C${f(r0 + (fr - r0) * 0.3)},${f(-w)} ${f(fr - (fr - r0) * 0.12)},${f(-w)} ${f(fr)},0C${f(fr - (fr - r0) * 0.12)},${f(w)} ${f(r0 + (fr - r0) * 0.3)},${f(w)} ${f(r0)},0Z`;
  const pf = beeView ? `fill="url(#${P}-bull)" stroke="#4c3570"` : 'fill="#f2c42a" stroke="#c99a17"';
  const petals = Array.from({ length: n }, (_, k) => `<path ${pf} stroke-width="1.6" d="${petal}" transform="translate(${fx} ${fy}) rotate(${f(4 + (k * 360) / n)})"/>`).join('');
  const red = Array.from({ length: 5 }, (_, k) => `<ellipse cx="0" cy="-20" rx="15" ry="20" transform="rotate(${k * 72})" fill="${beeView ? '#2c2629' : '#c8361e'}" stroke="${beeView ? '#1a1618' : '#8e2316'}" stroke-width="1.6"/>`).join('');
  const stem = beeView ? '#3e5640' : '#6f9a5a', bg = beeView ? rgb(mix(K.uv, [214, 226, 246], 0.78)) : '#eef3e6';
  return `<rect width="${PW}" height="${PH}" fill="${bg}"/>
    <path d="M${fx},${fy + 20}C${fx - 6},${fy + 80} ${fx + 10},${fy + 120} ${fx + 2},${PH + 10}" fill="none" stroke="${stem}" stroke-width="7" stroke-linecap="round"/>
    <path d="M${rx},${ry}C${rx + 4},${ry + 40} ${rx - 6},${ry + 60} ${rx - 2},${PH + 10}" fill="none" stroke="${stem}" stroke-width="6" stroke-linecap="round"/>
    <path d="${leafD(70, 18)}" fill="${stem}" transform="translate(${fx + 42} ${PH - 30}) rotate(-28)"/>
    <g transform="translate(${rx} ${ry})">${red}<circle r="10" fill="${beeView ? '#141213' : '#6e1a10'}"/></g>
    ${petals}<circle cx="${fx}" cy="${fy}" r="${f(fr * 0.28)}" fill="${beeView ? '#2c2a26' : '#e0952a'}" stroke="${beeView ? '#1a1816' : '#b36f17'}" stroke-width="1.6"/>`;
}
/** A framed window at left edge x0 with its label above. */
function win(x0: number, cls: string, content: string, label: string): string {
  return `<g class="lfg-win ${cls}">${T(x0 + PW / 2, WIN_Y - 18, label, 'lfg-lab lfg-lab-b', 'middle')}
    <g transform="translate(${x0} ${WIN_Y})"><rect class="lfg-card" width="${PW}" height="${PH}" rx="${PR}" filter="url(#${P}-sh)"/>
    <g clip-path="url(#${P}-pclip)">${content}</g><rect class="lfg-frame" width="${PW}" height="${PH}" rx="${PR}"/></g></g>`;
}
/** A label under an eye, with a short leader up to one of its cells. */
function cellLabel(x0: number, s: string, to: Pt, cls: string): string {
  const [cx] = eyeC(x0), y = EYE_Y + ER + 50;
  return `<g class="${cls}"><path class="lfg-leader" d="M${f(cx + 10)},${f(y - 22)}L${f(to[0])},${f(to[1] + 12)}"/>${T(cx, y, s, 'lfg-lab', 'middle')}</g>`;
}
const camDot = (x0: number, k: number, n = 7): Pt => { const [cx, cy] = eyeC(x0), a = ((24 + (132 * k) / (n - 1)) * Math.PI) / 180; return [cx + Math.cos(a) * (ER - 14), cy + Math.sin(a) * (ER - 14)]; };

/* the leaf cell (plants): the cell from life C, three times larger */
const CELL_C: Pt = [800, 392], CELL_S = 3;
const CHLORO: Array<[number, number, number]> = [[-50, -30, -20], [-8, -36, 0], [34, -33, 12], [60, -2, 80], [40, 34, -20], [-4, 38, 0], [-50, 26, 30]];
const LEAF_LIGHT = [
  { nm: 450, c: 'b' as Dot, from: [-58, -88] as Pt, to: CHLORO[0], strong: true },
  { nm: 550, c: 'g' as Dot, from: [-4, -88] as Pt, to: CHLORO[1], strong: false },
  { nm: 660, c: 'r' as Dot, from: [46, -88] as Pt, to: CHLORO[2], strong: true },
];
const cellPt = (p: readonly number[]): Pt => [CELL_C[0] + p[0] * CELL_S, CELL_C[1] + p[1] * CELL_S];

/* ---------- "So why?": each one's slice on a labelled wavelength axis ---------- */

const NM0 = 300, NM1 = 860, RX0 = 270, RX1 = 1150;
const X = (nm: number): number => RX0 + ((nm - NM0) / (NM1 - NM0)) * (RX1 - RX0);
const AXIS_Y = 452;
/** Each row is drawn only over its own slice [a, b]; w gives the strength inside it. */
const ROWS = [
  { name: 'us', y: 292, a: 380, b: 780, w: (nm: number) => Math.min(edge(nm, 380, 392), edge(nm, 780, 760)), col: full },
  { name: 'bee', y: 344, a: 300, b: 625, w: (nm: number) => Math.min(edge(nm, 300, 310), edge(nm, 625, 600)),
    col: (nm: number): RGB => (nm < 400 ? mix(K.uv, full(400), sm((nm - 370) / 30)) : full(nm)) },
  { name: 'plants', y: 396, a: 400, b: 705, w: (nm: number) => Math.min(edge(nm, 400, 410), edge(nm, 705, 695), Math.max(0.22, edge(nm, 510, 495), edge(nm, 615, 635))), col: full },
];
/** The Einstein clipping: a teaser for the next slide, right of the rows. */
const EIN_W = 220, EIN_H = clipHeight(EIN_W, EINSTEIN_TEASER), EIN_X = 1296, EIN_Y = 372 - EIN_H / 2;

/* ---------- the camera: stage = (world − c) · s + SC ---------- */

interface Cam { s: number; c: Pt }
const SC: Pt = [800, 375];
const WIDE: Cam = { s: 1, c: [800, 375] };
const SEA_CAM: Cam = { s: 1.4, c: [470, 470] };
const SHORE_CAM: Cam = { s: 1.45, c: [1110, 300] };
/** The camera zooms in moderately, onto the creature's eye; the creature never fills the frame. */
const S_DIVE = 2.4;
const lerpCam = (a: Cam, b: Cam, k: number): Cam => ({ s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), k)), c: lerpP(a.c, b.c, k) });
/** From `base`, zoom onto world point p: p slides straight to the stage centre while the scale grows. */
function diveCam(base: Cam, p: Pt, k: number): Cam {
  const s = Math.exp(lerp(Math.log(base.s), Math.log(S_DIVE), k));
  const T0: Pt = [(p[0] - base.c[0]) * base.s + SC[0], (p[1] - base.c[1]) * base.s + SC[1]], Tk = lerpP(T0, SC, k);
  return { s, c: [p[0] - (Tk[0] - SC[0]) / s, p[1] - (Tk[1] - SC[1]) / s] };
}
const MX = 958;
/** Viénot, Brettel & Mollon 1999: how a two-kind (red–green blind) eye sees, as one matrix on linear RGB. */
const DICHRO = [[0.29275, 0.70725, 0], [0.29275, 0.70725, 0], [-0.02234, 0.02234, 1]];
const MAM_EYE: Pt = [MX + FORMS[2].eye[0], groundY(MX) + FORMS[2].eye[1]];
const MON_EYE: Pt = [MX + FORMS[3].eye[0], groundY(MX) + FORMS[3].eye[1]];
const BEE_HEAD: Pt = [BEE1[0] + 19 * BEE_S, BEE1[1] + 2 * BEE_S];
const LEAF_PT: Pt = [LEAF[0], LEAF[1]];
/** The lens: a circle that opens at the eye (now at the stage centre) onto what that eye sees, then glides to that
 *  view's window, widens to cover it and hands over to it. Per view: the window's centre, and the lens's last radius. */
const LENS_R1 = 104;
const WIN_CTR = (x0: number): Pt => [x0 + PW / 2, WIN_Y + PH / 2];
const LENS_TO: Pt[] = [WIN_CTR(SLOT_C), WIN_CTR(SLOT_B), WIN_CTR(SLOT_B), CELL_C];
const LENS_R2 = [Math.hypot(PW, PH) / 2, Math.hypot(PW, PH) / 2, Math.hypot(PW, PH) / 2, Math.hypot(160, 112) * CELL_S / 2];

const SEA_WAVES = [
  { key: 'r', nm: 650, a: 0.34, x: 300, col: '#c8361e', lab: 'red light' },
  { key: 'bg', nm: 490, a: 0.015, x: 334, col: '#1b84ad', lab: 'blue-green light' },
];
const WAVE_TOP = 230;
function fadeStops(a: number, col: string, k: number): string {
  const y1 = 700, stops = [`<stop offset="0" stop-color="${col}" stop-opacity="${k}"/>`, `<stop offset="${(((YS - WAVE_TOP) / (y1 - WAVE_TOP)) * 100).toFixed(2)}%" stop-color="${col}" stop-opacity="${k}"/>`];
  for (let y = YS + 2; y <= y1; y += 4) {
    const o = Math.pow(Math.exp(-a * dAt(y)), 0.7) * k;
    stops.push(`<stop offset="${(((y - WAVE_TOP) / (y1 - WAVE_TOP)) * 100).toFixed(2)}%" stop-color="${col}" stop-opacity="${o.toFixed(3)}"/>`);
  }
  return stops.join('');
}

function svg(): string {
  const waterStops = [0, 0.1, 0.3, 1, 2, 4, 7, 10, 15, 20, 30, 45, 65, 100, 140].map(d =>
    `<stop offset="${(((yAt(d) - YS) / (700 - YS)) * 100).toFixed(2)}%" stop-color="${rgb(waterAt(d))}"/>`).join('');
  const floorStops = Array.from({ length: 22 }, (_, i) => `<stop offset="${((i / 21) * 100).toFixed(1)}%" stop-color="${rgb(SAND)}"/>`).join('');
  const rowGrad = (id: string, a: number, b: number, fn: (nm: number) => [RGB, number]): string => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(X(a))}" y1="0" x2="${f(X(b))}" y2="0">${Array.from({ length: 41 }, (_, i) => {
    const nm = a + ((b - a) * i) / 40, [c, o] = fn(nm);
    return `<stop offset="${((i / 40) * 100).toFixed(2)}%" stop-color="${rgb(c)}" stop-opacity="${o.toFixed(3)}"/>`;
  }).join('')}</linearGradient>`;
  const waveGrads = SEA_WAVES.map(w => `<linearGradient id="${P}-wf-${w.key}" gradientUnits="userSpaceOnUse" x1="0" y1="${WAVE_TOP}" x2="0" y2="700">${fadeStops(w.a, w.col, 1)}</linearGradient>
      <linearGradient id="${P}-wh-${w.key}" gradientUnits="userSpaceOnUse" x1="0" y1="${WAVE_TOP}" x2="0" y2="700">${fadeStops(w.a, '#fffdf8', 0.7)}</linearGradient>`).join('');
  const BULL = rgb(mix(K.uv, PAGE, 0.15));

  const world = `
      <path class="lfg-ground" mask="url(#${P}-soilm)" d="${GROUND_D}"/>
      <path fill="url(#${P}-water)" d="${WATER_D}"/>
      <path class="lfg-floor" stroke="url(#${P}-floorg)" d="${smooth(FLOOR)}"/>
      <path class="lfg-beach" d="${smooth(SHORE.slice(SHORE_I, SHORE_I + 3))}"/>
      <path class="lfg-turf" d="${smooth(LAND.slice(2))}"/>
      <g filter="url(#${P}-d0)">${redAlga(SHALLOW_ALGA.x, SHALLOW_ALGA.y, 0.8, 5)}</g>
      <g filter="url(#${P}-d1)">${redAlga(DEEP_ALGA.x, DEEP_ALGA.y, 1.2, 11)}</g>
      <path class="lfg-surf" d="M0,${YS}H${SHORE[SHORE_I][0]}"/>
      <path class="lfg-grass" d="${grass()}"/>
      ${tree()}
      ${flower(FL_US, 'us')}${flower(FL_BEE, 'us')}
      <g class="lfg-sea" opacity="0">
        <g clip-path="url(#${P}-wclip)">
          ${SEA_WAVES.map(w => {
            const d = waveD(w.x, WAVE_TOP, w.x, YB, w.nm);
            return `<path class="lfg-whalo" stroke="url(#${P}-wh-${w.key})" d="${d}"/><path class="lfg-wave" stroke="url(#${P}-wf-${w.key})" d="${d}"/>`;
          }).join('')}
        </g>
        <g class="lfg-seal" opacity="0">${T(SEA_WAVES[0].x - 14, 296, SEA_WAVES[0].lab, 'lfg-lab lfg-lab-b', 'end')}${T(SEA_WAVES[1].x + 14, 296, SEA_WAVES[1].lab, 'lfg-lab lfg-lab-b')}</g>
      </g>
      <g class="lfg-subj"><g filter="url(#${P}-dc)"><g class="lfg-crea">
        <path class="lfg-body"/>
        <g class="lfg-mface" opacity="0">
          <circle class="lfg-ear" cx="3" cy="-94" r="7.5"/><circle class="lfg-ear-in" cx="3" cy="-94" r="4"/>
          <ellipse class="lfg-facedisk" cx="27" cy="-91" rx="13" ry="14"/>
          <ellipse class="lfg-muzzle" cx="31" cy="-82" rx="9" ry="6.5"/>
          <path class="lfg-mouth" d="M27,-79Q31,-77 35,-79M30,-85l1.5,0"/>
          <circle class="lfg-ceye" cx="32" cy="-93" r="3.6"/><circle class="lfg-cpupil" cx="32" cy="-93" r="2"/>
        </g>
        <circle class="lfg-ceye lfg-ceye-m" r="4.6"/><circle class="lfg-cpupil lfg-ceye-m" r="2.4"/>
      </g></g></g>
      <g class="lfg-bee" opacity="0">${bee()}</g>`;

  const lit2: Dot[] = ['g', 'r'], lit4: Dot[] = ['uv', 'b', 'g', 'r'];
  // On land: the small mammal's eye, and what it sees.
  const in1 = `${win(SLOT_C, 'lfg-w1', `<g filter="url(#${P}-dichro)">${crownView()}</g>`, 'most mammals')}
      ${eyeWaves(SLOT_C, lit2, 'lfg-ew1')}${camEye(SLOT_C, MAM, 'lfg-h1', lit2)}
      ${cellLabel(SLOT_C, 'light-sensitive cells', camDot(SLOT_C, 3), 'lfg-cl')}`;
  // Primates: the same window stays; the monkey's eye and its window open beside it.
  const in2 = `${win(SLOT_A, 'lfg-w2a', `<g filter="url(#${P}-dichro)">${crownView()}</g>`, 'most mammals')}
      ${eyeWaves(SLOT_A, lit2, 'lfg-ew2a')}${camEye(SLOT_A, MAM, 'lfg-h2a', lit2)}
      ${cellLabel(SLOT_A, 'light-sensitive cells', camDot(SLOT_A, 3), 'lfg-cl')}
      ${win(SLOT_B, 'lfg-w2b', crownView(), 'primates')}
      ${eyeWaves(SLOT_B, lit2, 'lfg-ew2b')}${camEye(SLOT_B, PRI, 'lfg-h2b', lit2)}`;
  // Bees: our eye and the bee's compound eye, each under what it sees.
  const in3 = `${win(SLOT_A, 'lfg-w3', flowerView(false), 'as we see it')}
      ${eyeWaves(SLOT_A, lit4, 'lfg-ew3')}${camEye(SLOT_A, PRI, 'lfg-h3', lit4)}
      ${win(SLOT_B, 'lfg-w3', flowerView(true), 'as a bee sees it')}
      ${eyeWaves(SLOT_B, lit4, 'lfg-ew3')}${beeEye(SLOT_B, 'lfg-h3', lit4)}
      ${T(eyeC(SLOT_B)[0], EYE_Y + ER + 50, 'ultraviolet shown as purple', 'lfg-lab', 'middle')}`;
  // Plants: a leaf cell; its chlorophyll glows where blue and red arrive, faintly for green.
  const chlT = cellPt(CHLORO[6]);
  const cellPic = `<rect class="lfg-cell" x="-80" y="-56" width="160" height="112" rx="24"/>
      ${CHLORO.map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><ellipse class="lfg-chl" rx="17" ry="9"/><path class="lfg-gran" d="M-8,-4V4M-1,-5V5M6,-4V4"/></g>`).join('')}`;
  const in4 = `<g transform="translate(${CELL_C[0]} ${CELL_C[1]}) scale(${CELL_S})">${cellPic}</g>
    ${LEAF_LIGHT.map(l => { const a = cellPt(l.from), b = cellPt([l.to[0], l.to[1] - 8]); return `<path class="lfg-ew lfg-ew4" pathLength="1" style="stroke:${COL[l.c]}" d="${waveD(a[0], a[1], b[0], b[1], l.nm, 6)}"/>`; }).join('')}
    ${LEAF_LIGHT.map(l => { const p = cellPt(l.to); return `<g class="lfg-lglow" opacity="0">${glow(P, p[0], p[1], l.strong ? 34 : 18)}</g>`; }).join('')}
    <g><path class="lfg-leader" d="M${f(CELL_C[0] - 80 * CELL_S - 14)},${f(chlT[1] + 30)}L${f(chlT[0] - 44)},${f(chlT[1] + 6)}"/>${T(CELL_C[0] - 80 * CELL_S - 22, chlT[1] + 38, 'chlorophyll', 'lfg-lab lfg-lab-b', 'end')}</g>`;

  return `${defs(P)}<defs>
    <clipPath id="${P}-win"><rect x="60" y="60" width="1480" height="630" rx="18"/></clipPath>
    <clipPath id="${P}-abdc"><ellipse cx="-15" cy="2" rx="18" ry="12"/></clipPath>
    <clipPath id="${P}-pclip"><rect width="${PW}" height="${PH}" rx="${PR}"/></clipPath>
    <linearGradient id="${P}-water" gradientUnits="userSpaceOnUse" x1="0" y1="${YS}" x2="0" y2="700">${waterStops}</linearGradient>
    <linearGradient id="${P}-floorg" gradientUnits="userSpaceOnUse" x1="0" y1="${YS}" x2="0" y2="700">${floorStops}</linearGradient>
    ${waveGrads}
    ${ROWS.map((r, k) => rowGrad(`${P}-row${k}`, r.a, r.b, nm => [r.col(nm), r.w(nm)])).join('')}
    <radialGradient id="${P}-bull" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${f(FR_BULL)}">
      <stop offset="0" stop-color="#3f5f34"/><stop offset=".58" stop-color="#3f5f34"/><stop offset=".64" stop-color="${BULL}"/><stop offset="1" stop-color="${BULL}"/></radialGradient>
    <linearGradient id="${P}-soilv" gradientUnits="userSpaceOnUse" x1="0" y1="430" x2="0" y2="650"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <linearGradient id="${P}-soilh" gradientUnits="userSpaceOnUse" x1="760" y1="0" x2="1010" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <mask id="${P}-soilm" maskUnits="userSpaceOnUse" x="-100" y="300" width="1800" height="500" style="mask-type:alpha">
      <rect x="-100" y="300" width="1800" height="500" fill="url(#${P}-soilv)"/><rect x="-100" y="300" width="1800" height="500" fill="url(#${P}-soilh)"/>
    </mask>
    <filter id="${P}-dichro" x="0" y="0" width="1" height="1" color-interpolation-filters="linearRGB">
      <feColorMatrix type="matrix" values="${DICHRO.map(r => `${r.join(' ')} 0 0`).join(' ')} 0 0 0 1 0"/>
    </filter>
    ${TINTED.map((_, i) => `<filter id="${P}-d${i}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="linearRGB"><feColorMatrix class="lfg-tm" type="matrix" values="${diag([1, 1, 1])}"/></filter>`).join('')}
    <filter id="${P}-dc" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="linearRGB"><feColorMatrix class="lfg-tmc" type="matrix" values="${diag([1, 1, 1])}"/></filter>
    <clipPath id="${P}-wclip"><rect class="lfg-wclip-r" x="0" y="${WAVE_TOP - 20}" width="1600" height="0"/></clipPath>
    <clipPath id="${P}-lensc"><circle class="lfg-lensc" cx="${SC[0]}" cy="${SC[1]}" r="0"/></clipPath>
  </defs>

  <g clip-path="url(#${P}-win)"><g class="lfg-worldv"><g class="lfg-cam">${world}</g></g></g>

  ${[in1, in2, in3, in4].map(c => `<g class="lfg-in" opacity="0" style="display:none">${c}</g>`).join('')}
  <g class="lfg-lens" opacity="0" style="display:none">
    <circle class="lfg-lensrim-h lfg-lensr" cx="${SC[0]}" cy="${SC[1]}" r="0"/>
    <g clip-path="url(#${P}-lensc)">
      <circle class="lfg-lensbg lfg-lensr" cx="${SC[0]}" cy="${SC[1]}" r="0"/>
      ${[`<g filter="url(#${P}-dichro)">${crownView()}</g>`, crownView(), flowerView(true)].map(c => `<g class="lfg-lpic" style="display:none"><g transform="translate(${-PW / 2} ${-PH / 2})">${c}</g></g>`).join('')}
      <g class="lfg-lpic" style="display:none"><g transform="scale(${CELL_S})">${cellPic}</g></g>
    </g>
    <circle class="lfg-lensrim lfg-lensr" cx="${SC[0]}" cy="${SC[1]}" r="0"/>
  </g>

  <g class="lfg-rows">
    <g class="lfg-axis" opacity="0">
      <path class="lfg-guide" d="M${f(X(380))},${ROWS[0].y - 26}V${AXIS_Y}M${f(X(780))},${ROWS[0].y - 26}V${AXIS_Y}"/>
      <path class="lfg-ax" d="M${RX0},${AXIS_Y}H${RX1 + 18}"/><path class="lfg-axhead" d="M${RX1 + 30},${AXIS_Y}l-16,-7v14z"/>
      <path class="lfg-ax" d="M${f(X(380))},${AXIS_Y - 9}v18M${f(X(780))},${AXIS_Y - 9}v18"/>
      ${T(RX0 - 22, AXIS_Y + 8, 'wavelength', 'lfg-rowlab', 'end')}
      ${T(X(340), AXIS_Y + 38, 'ultraviolet', 'lfg-lab', 'middle')}${T(X(580), AXIS_Y + 38, 'visible', 'lfg-lab', 'middle')}${T(X(820), AXIS_Y + 38, 'infrared', 'lfg-lab', 'middle')}
    </g>
    ${ROWS.map((r, k) => `<g class="lfg-row" opacity="0">${T(RX0 - 22, r.y + 8, r.name, 'lfg-rowlab', 'end')}
      <rect x="${f(X(r.a))}" y="${r.y - 12}" width="${f(X(r.b) - X(r.a))}" height="24" rx="6" fill="url(#${P}-row${k})"/></g>`).join('')}
    <g class="lfg-qm" opacity="0">${T(1228, 380, '?', 'lfg-q', 'middle')}</g>
  </g>
  <g class="lfg-ein" opacity="0" style="display:none"><g class="lfg-ein-s">${clipping(`${P}-ein`, EIN_X, EIN_Y, EIN_W, EINSTEIN_TEASER, 3, 11)}</g></g>`;
}

function bind(stage: SVGSVGElement): (beat: number, t: number) => void {
  const q = (s: string): SVGElement => stage.querySelector(s) as SVGElement;
  const qa = (s: string): SVGElement[] => Array.from(stage.querySelectorAll<SVGElement>(s));
  const memo = new Map<Element, Map<string, string>>();
  const set = (el: Element, k: string, v: string): void => {
    let m = memo.get(el);
    if (!m) memo.set(el, (m = new Map()));
    if (m.get(k) !== v) { m.set(k, v); el.setAttribute(k, v); }
  };
  const op = (el: Element, v: number): void => set(el, 'opacity', clamp(v).toFixed(3));
  const show = (el: Element, v: number): void => { op(el, v); set(el, 'style', v > 0.001 ? '' : 'display:none'); };
  /** Static things appear and leave whole, in a short fade. */
  const fadeIn = (t: number, a: number): number => ramp(t, a, a + 0.3);
  const reveal = (el: Element, k: number): void => { op(el, k > 0.001 ? 1 : 0); set(el, 'stroke-dasharray', `${k.toFixed(4)} 2`); };
  const halo = (els: SVGElement[], k: number): void => els.forEach(h => op(h, 0.5 * k * Number(h.dataset.lit)));

  const cam = q('.lfg-cam'), worldv = q('.lfg-worldv');
  const tm = qa('.lfg-tm'), tmc = q('.lfg-tmc'), floorStops = qa(`#${P}-floorg stop`), wclip = q('.lfg-wclip-r'), sea = q('.lfg-sea'), seal = q('.lfg-seal');
  const subj = q('.lfg-subj'), crea = q('.lfg-crea'), body = q('.lfg-body'), face = q('.lfg-mface'), ceye = q('.lfg-ceye.lfg-ceye-m'), cpupil = q('.lfg-cpupil.lfg-ceye-m');
  const beeG = q('.lfg-bee');
  const ins = qa('.lfg-in'), lensG = q('.lfg-lens'), lensCs = [q('.lfg-lensc'), ...qa('.lfg-lensr')], lpics = qa('.lfg-lpic'), rim = q('.lfg-lensrim'), rimH = q('.lfg-lensrim-h');
  const ew1 = qa('.lfg-ew1'), h1 = qa('.lfg-halo.lfg-h1');
  const ew2b = qa('.lfg-ew2b'), h2a = qa('.lfg-halo.lfg-h2a'), h2b = qa('.lfg-halo.lfg-h2b'), ew2a = qa('.lfg-ew2a');
  const ew3 = qa('.lfg-ew3'), h3 = qa('.lfg-halo.lfg-h3');
  const ew4 = qa('.lfg-ew4'), glows = qa('.lfg-lglow');
  const axis = q('.lfg-axis'), rows = qa('.lfg-row'), qm = q('.lfg-qm'), ein = q('.lfg-ein'), einS = q('.lfg-ein-s');
  const floorY = floorStops.map((_, i) => YS + ((700 - YS) * i) / (floorStops.length - 1));
  const einC: Pt = [EIN_X + EIN_W / 2, EIN_Y + EIN_H / 2];

  interface Shot { cam: Cam; l1: number; l2: number; view: number }
  /** The camera at (beat, t), and the lens: l1 opens it at the eye, l2 glides it into its window (both 0–1), for
   *  inside view `view` (0–3, or −1 for none). A dive: zoom onto the eye (1 s), open the lens (0.5 s), glide (0.6 s).
   *  A pull-out runs it backwards. */
  function camAt(b: number, t: number): Shot {
    const onto = (p: Pt, k: number): Cam => diveCam(SHORE_CAM, p, k);
    const out = (p: Pt, view: number): Shot => ({ cam: onto(p, 1 - ramp(t, 0.7, 1.5)), l1: 1 - ramp(t, 0.45, 0.9), l2: 1 - ramp(t, 0, 0.5), view });
    const into = (p: Pt, t0: number, view: number): Shot =>
      ({ cam: onto(p, ramp(t, t0, t0 + 1.0)), l1: ramp(t, t0 + 0.8, t0 + 1.3), l2: ramp(t, t0 + 1.3, t0 + 1.9), view });
    if (b === 0) return { cam: lerpCam(WIDE, SEA_CAM, ramp(t, 0, 1.6)), l1: 0, l2: 0, view: -1 };
    if (b === 1) return t < 2.1 ? { cam: lerpCam(SEA_CAM, SHORE_CAM, ramp(t, 0, 1.6)), l1: 0, l2: 0, view: -1 } : into(MAM_EYE, 2.1, 0);
    if (b === 2) return t < 1.5 ? out(MAM_EYE, 0) : into(MON_EYE, 2.5, 1);
    if (b === 3) return t < 1.5 ? out(MON_EYE, 1) : into(BEE_HEAD, 2.9, 2);
    if (b === 4) return t < 1.5 ? out(BEE_HEAD, 2) : into(LEAF_PT, 1.6, 3);
    return { cam: onto(LEAF_PT, 1), l1: 1, l2: 1, view: 3 };
  }

  /** The subject's place, shape and tilt at (beat, t). */
  function subject(b: number, t: number): { x: number; y: number; m: number; rot: number; sc: number } {
    if (b === 0) {
      const k = outC(clamp((t - 1.3) / 1.9));
      return { x: lerp(-150, 600, k), y: lerp(560, 494, k), m: 0, rot: -4 * k, sc: 1 };
    }
    if (b === 1) {
      // crawls ashore: fish → four-legged animal → small mammal
      const sw = ramp(t, 0.4, 1.0), walk = ramp(t, 1.0, 1.9), m = ramp(t, 0.6, 1.3) + ramp(t, 1.3, 2.0);
      if (walk <= 0) return { x: lerp(600, 946, sw), y: lerp(494, groundY(946), sw), m, rot: lerp(-4, -14, sw), sc: 1 };
      const x = lerp(946, MX, walk);
      return { x, y: groundY(x), m, rot: -14 * (1 - ramp(t, 1.0, 1.3)), sc: 1 };
    }
    if (b === 2) return { x: MX, y: groundY(MX), m: 2 + ramp(t, 1.5, 2.4), rot: 0, sc: 1 };
    // Bees: the monkey is naughty. One leap up into the fruit tree, flipping over, and it hangs upside down by its feet
    // from a branch; a small swing settles before the bee arrives. Body and face turn together, as one group.
    const u = b === 3 ? clamp((t - 1.0) / 0.8) : 1, e = sm(u);
    const v = b === 3 ? clamp((t - 1.8) / 0.7) : 1, swing = 18 * (1 - v) * (1 - v) * Math.sin(3 * Math.PI * v);
    return {
      x: lerp(MX, HANG[0], e), y: lerp(groundY(MX), HANG[1], e) - 130 * Math.sin(Math.PI * e),
      m: 3, rot: 180 * e + swing, sc: lerp(1, HANG_S, e),
    };
  }

  return (beat: number, t: number): void => {
    const b = Math.max(0, Math.min(5, beat));

    // Camera: pans and moderate zooms, never rolls.
    const ca = camAt(b, t), { s, c } = ca.cam;
    set(cam, 'transform', `translate(${f(SC[0] - c[0] * s)} ${f(SC[1] - c[1] * s)}) scale(${s.toFixed(4)})`);

    // The lens: opens at the eye onto what that eye sees, glides to its window and hands over to it, while the scene
    // fades back. The window shows the same picture, so the hand-over is seamless.
    const { l1, l2, view } = ca, g2 = sm(l2);
    op(worldv, b === 5 ? 0 : 1 - (0.55 * l1 + 0.45 * l2));
    const lc = view < 0 ? SC : lerpP(SC, LENS_TO[view], g2), lr = view < 0 ? 0 : lerp(LENS_R1 * l1, LENS_R2[view], g2);
    show(lensG, l1 > 0.001 && l2 < 0.999 ? 1 - ramp(l2, 0.9, 1) : 0);
    lensCs.forEach(e => { set(e, 'cx', f(lc[0])); set(e, 'cy', f(lc[1])); set(e, 'r', f(lr)); });
    op(rim, 1 - ramp(l2, 0.4, 0.8)); op(rimH, 1 - ramp(l2, 0.4, 0.8));
    lpics.forEach((g, i) => { set(g, 'style', i === view ? '' : 'display:none'); set(g, 'transform', `translate(${f(lc[0])} ${f(lc[1])})`); });
    ins.forEach((g, i) => show(g, ca.view === i ? (b === 5 ? 1 - ramp(t, 0, 0.45) : ramp(l2, 0.72, 0.97)) : 0));

    // Inside: each window, its label and its eye are one unit, shown whole; only the light and the cells move.
    const after = (bb: number, k: number): number => (b === bb ? k : b > bb ? 1 : 0);
    // On land: green and red light both light the small mammal's one yellow-green kind of cell.
    ew1.forEach(e => reveal(e, after(1, ramp(t, 4.0, 4.4))));
    halo(h1, after(1, ramp(t, 4.3, 4.6)));
    // Primates: the "most mammals" unit as it was; in the monkey's eye, green and red light light different cells.
    ew2a.forEach(e => reveal(e, 1)); halo(h2a, 1);
    ew2b.forEach(e => reveal(e, after(2, ramp(t, 4.4, 4.8))));
    halo(h2b, after(2, ramp(t, 4.7, 5.0)));
    // Bees: ultraviolet lights nothing in our eye; red lights nothing in the bee's.
    ew3.forEach(e => reveal(e, after(3, ramp(t, 4.7, 5.1))));
    halo(h3, after(3, ramp(t, 5.0, 5.3)));
    // Plants: blue and red light make the chlorophyll glow strongly, green faintly.
    ew4.forEach(e => reveal(e, after(4, ramp(t, 3.5, 4.0))));
    glows.forEach((g, i) => op(g, after(4, ramp(t, 3.9, 4.3)) * (LEAF_LIGHT[i].strong ? 1 : 0.45)));

    // In the sea: light goes down; red fades within a few metres, blue-green goes on, and things take its colour.
    const front = b === 0 ? lerp(WAVE_TOP - 24, 760, ramp(t, 1.0, 2.6)) : 760;
    set(wclip, 'height', f(Math.max(0, front - WAVE_TOP + 20)));
    op(sea, b === 0 ? 1 : b === 1 ? 1 - fadeIn(t, 0) : 0);
    op(seal, b === 0 ? fadeIn(t, 1.45) : 1);
    const lit = (y: number): number => (b === 0 ? clamp((front - y) / 50) : 1);
    TINTED.forEach((o, i) => { const k = lit(o.y), tr = trans(o.d); set(tm[i], 'values', diag(tr.map(v => lerp(1, v, k)))); });
    floorStops.forEach((st, i) => set(st, 'stop-color', rgb(mix(SAND, tint(SAND, dAt(floorY[i])), lit(floorY[i])))));

    // The subject: one animal, morphing along our lineage.
    const sj = subject(b, t), fm = formAt(sj.m);
    set(crea, 'transform', `translate(${f(sj.x)} ${f(sj.y)}) rotate(${f(sj.rot)}) scale(${sj.sc.toFixed(4)})`);
    set(body, 'd', fm.d);
    set(body, 'fill', fm.fill);
    for (const e of [ceye, cpupil]) { set(e, 'cx', f(fm.eye[0])); set(e, 'cy', f(fm.eye[1])); }
    // The monkey's face is drawn for the finished outline, so it appears only once the morph has nearly reached it;
    // earlier it would float beside the still-changing head.
    const kf = clamp((sj.m - 2.85) / 0.15);
    op(face, kf);
    set(ceye, 'r', f(lerp(4.6, 3.6, kf))); set(cpupil, 'r', f(lerp(2.4, 2, kf)));
    const under = sj.y - 14 > YS && sj.x < SHORE[SHORE_I][0] + 4, dc = under ? trans(dAt(sj.y - 14)) : [1, 1, 1];
    set(tmc, 'values', diag(dc.map(v => lerp(1, v, b === 0 ? lit(sj.y - 14) : 1))));
    op(subj, b <= 3 ? 1 : 0);

    // Bees: the bee flies in to the flower once the monkey has gone.
    const fly = b === 3 ? outC(clamp((t - 2.3) / 0.6)) : 1, bp = lerpP(BEE0, BEE1, fly);
    op(beeG, b < 3 ? 0 : b === 3 ? fadeIn(t, 2.3) : 1);
    set(beeG, 'transform', `translate(${f(bp[0])} ${f(bp[1])}) scale(${BEE_S})`);

    // So why? Each one's slice on a labelled wavelength axis, a question, and Einstein as a teaser for the next slide.
    // The rows cross-fade in while the leaf view fades out, so the stage is never empty.
    op(axis, b === 5 ? fadeIn(t, 0.1) : 0);
    rows.forEach((el, k) => op(el, b === 5 ? fadeIn(t, 0.3 + 0.3 * k) : 0));
    op(qm, b === 5 ? fadeIn(t, 1.8) : 0);
    const ke = b === 5 ? fadeIn(t, 2.2) : 0;
    show(ein, ke);
    set(einS, 'transform', `translate(${f(einC[0])} ${f(einC[1])}) scale(${lerp(0.85, 1, ke).toFixed(3)}) translate(${f(-einC[0])} ${f(-einC[1])})`);
    clipFx(stage, b === 5 ? ramp(t, 2.8, 3.0) : 0);
  };
}

export const STAGING: Staging = {
  id: 'g',
  name: 'G · Zoom through the eye',
  note: 'The camera dives into the creature’s eye; the window opens as what that eye sees, then pulls back out.',
  svg,
  bind,
};
