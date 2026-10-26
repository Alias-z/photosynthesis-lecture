// Animation 2 · "Who uses which light?", staging C · "Eye close-up". One journey on one shore: the early fish in the
// sea crawls ashore and morphs along our lineage (four-legged animal, small mammal, monkey); a bee flies in as its own
// animal; then a leaf. Beside the current viewer a large close-up shows its light-sensitive cells as coloured dots,
// which light up when matching light arrives. The last beat compares the slices as rows on one wavelength axis.
import './life-c.css';
import type { Staging } from './types';
import { enc, lin, spec } from '../../lib/colour';
import { T, defs, glow } from '../figs/s2';
import { EINSTEIN_TEASER, clipFx, clipHeight, clipping } from '../figs/clipping';

const P = 'lfc';
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
  [904, 435], [928, 416], [948, 395], [985, 383], [1030, 375], [1090, 370], [1200, 368], [1350, 368], [1500, 369], [1600, 367]];
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
const GROUND_D = `${smooth(SHORE)}L1600,790L0,790Z`;
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
  return `<path class="lfc-ralga" d="${blades}"/><ellipse class="lfc-hold" cx="${f(x)}" cy="${f(y + 1)}" rx="${f(7 * s)}" ry="${f(3.5 * s)}"/>`;
}

/* the fruit tree */
const TREE_X = 1410;
const CROWN: Array<[number, number, number]> = [[-110, 286, 44], [-68, 244, 52], [0, 228, 52], [68, 244, 52], [108, 286, 42], [-38, 290, 48], [38, 292, 48]];
const FRUIT: Pt[] = [[-96, 308], [-62, 280], [-24, 318], [12, 294], [52, 320], [86, 298], [112, 304], [-30, 254], [42, 262]];
const YOUNG: Pt[] = [[0, -2.6], [1, -2.2], [2, -1.85], [2, -1.2], [3, -0.85], [4, -0.35], [1, -2.9]];
/** The leaf the plants beat looks at, on the crown's left edge. */
const LEAF: Pt = [TREE_X - 157, 282];

function tree(): string {
  const r = rng(7);
  const greens = ['#6f9f50', '#5a8a3e', '#7cab5a', '#638f46'];
  const leaves = Array.from({ length: 64 }, (_, i) => {
    const [dx, cy, cr] = CROWN[i % CROWN.length], a = r() * Math.PI * 2, rr = cr * Math.sqrt(r()) * 0.9;
    return `<path class="lfc-tl" fill="${greens[Math.floor(r() * greens.length)]}" d="${leafD(20 + r() * 7, 6 + r() * 2)}" transform="translate(${f(TREE_X + dx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))}) rotate(${f(r() * 360)})"/>`;
  }).join('');
  const young = YOUNG.map(([i, a]) => {
    const [dx, cy, cr] = CROWN[i], x = TREE_X + dx + (cr - 2) * Math.cos(a), y = cy + (cr - 2) * Math.sin(a), deg = (a * 180) / Math.PI;
    return [-28, 0, 28].map(k => `<path class="lfc-young" d="${leafD(22, 6.5)}" transform="translate(${f(x)} ${f(y)}) rotate(${f(deg + k)}) translate(10 0)"/>`).join('');
  }).join('');
  const fruit = FRUIT.map(([dx, y]) => {
    const x = TREE_X + dx;
    return `<path class="lfc-stalk" d="M${x},${y - 9} l1,-6"/><circle class="lfc-fruit" cx="${x}" cy="${y}" r="9.5"/><circle class="lfc-fruit-hi" cx="${x - 3}" cy="${y - 3.5}" r="2.6"/>`;
  }).join('');
  const X0 = TREE_X;
  return `<path class="lfc-trunk" d="M${X0 - 19},370C${X0 - 12},352 ${X0 - 10},336 ${X0 - 13},306C${X0 - 5},310 ${X0 + 6},310 ${X0 + 14},306C${X0 + 11},336 ${X0 + 13},352 ${X0 + 21},370Z"/>
    <path class="lfc-branch" d="M${X0 - 8},318C${X0 - 26},300 ${X0 - 46},292 ${X0 - 68},282M${X0 + 8},316C${X0 + 28},300 ${X0 + 50},292 ${X0 + 72},284M${X0},310L${X0},262"/>
    ${CROWN.map(([dx, y, c]) => `<circle class="lfc-crown-o" cx="${TREE_X + dx}" cy="${y}" r="${c}"/>`).join('')}
    ${CROWN.map(([dx, y, c]) => `<circle class="lfc-crown" cx="${TREE_X + dx}" cy="${y}" r="${c}"/>`).join('')}
    ${leaves}${young}${fruit}
    <path class="lfc-tl lfc-tl-big" d="${leafD(34, 9)}" transform="translate(${LEAF[0]} ${LEAF[1]}) rotate(196)"/>`;
}

/* two flowers: one stays as we see it, the bee's lens goes over the other */
interface Fl { x: number; y: number; r: number; n: number; rot: number }
const FL_BEE: Fl = { x: 1102, y: 314, r: 29, n: 11, rot: 8 };
const FL_US: Fl = { x: 1186, y: 302, r: 32, n: 12, rot: 0 };
const LENS: Pt = [FL_BEE.x, FL_BEE.y + 2], LENS_R = 56;
/** False colours in the bee's view: each of its receptor kinds is shown in its own dot colour. */
const BEEVIEW = { tip: rgb(mix(K.uv, PAGE, 0.18)), base: '#3f5f34', disk: '#2c2a26', stem: '#3e5640', ground: '#4a463c', sky: rgb(mix(K.uv, [196, 214, 245], 0.72)) };

function flower(fl: Fl, view: 'us' | 'bee'): string {
  const bee = view === 'bee';
  const gy = groundY(fl.x) + 3;
  const stem = `<path class="lfc-stem" ${bee ? `style="stroke:${BEEVIEW.stem}"` : ''} d="M${fl.x},${fl.y + 4}Q${fl.x - 4},${f((fl.y + gy) / 2)} ${fl.x},${f(gy)}"/>`
    + `<path class="lfc-sleaf" ${bee ? `style="fill:${BEEVIEW.stem};stroke:${BEEVIEW.stem}"` : ''} d="${leafD(22, 6)}" transform="translate(${f(fl.x + 10)} ${f(gy - 16)}) rotate(-30)"/>`;
  const r0 = fl.r * 0.26, w = fl.r * 0.2;
  const petal = `M${f(r0)},0C${f(r0 + (fl.r - r0) * 0.3)},${f(-w)} ${f(fl.r - (fl.r - r0) * 0.12)},${f(-w)} ${f(fl.r)},0C${f(fl.r - (fl.r - r0) * 0.12)},${f(w)} ${f(r0 + (fl.r - r0) * 0.3)},${f(w)} ${f(r0)},0Z`;
  const style = bee ? `style="fill:url(#${P}-uvbull);stroke:${BEEVIEW.base}"` : '';
  const petals = Array.from({ length: fl.n }, (_, k) => `<path class="lfc-petal" ${style} d="${petal}" transform="translate(${fl.x} ${fl.y}) rotate(${f(fl.rot + (k * 360) / fl.n)})"/>`).join('');
  return `${stem}${petals}<circle class="lfc-disk" ${bee ? `style="fill:${BEEVIEW.disk};stroke:${BEEVIEW.disk}"` : ''} cx="${fl.x}" cy="${fl.y}" r="${f(fl.r * 0.32)}"/>`;
}

const grass = (): string => Array.from({ length: 15 }, (_, i) => {
  const x = 1010 + i * 36 + (i % 3) * 5;
  if ([FL_US, FL_BEE].some(fl => Math.abs(fl.x - x) < 10) || Math.abs(x - TREE_X) < 26) return '';
  const y = groundY(x) + 1;
  return `M${x},${f(y)}l-5,-11M${x},${f(y)}l0,-13M${x},${f(y)}l5,-11`;
}).join('');

/** The bee, side view, facing right, centred on the origin. */
const bee = (): string => `
  <ellipse class="lfc-wing" cx="-6" cy="-17" rx="18" ry="8" transform="rotate(-26 -6 -17)"/>
  <ellipse class="lfc-wing" cx="5" cy="-16" rx="14" ry="7" transform="rotate(-10 5 -16)"/>
  <path class="lfc-leg" d="M-2,8 l-5,12 M4,9 l0,13 M9,7 l6,11"/>
  <path class="lfc-sting" d="M-33,4 l-6,1"/>
  <ellipse class="lfc-abd" cx="-15" cy="2" rx="18" ry="12"/>
  <g clip-path="url(#${P}-abdc)"><path class="lfc-stripe" d="M-23,-12 q-4,14 0,28 M-12,-12 q-4,14 0,28 M-33,-12 q-4,14 0,28"/></g>
  <ellipse class="lfc-abd-o" cx="-15" cy="2" rx="18" ry="12"/>
  <circle class="lfc-thorax" cx="6" cy="0" r="10"/>
  <circle class="lfc-head" cx="19" cy="2" r="7.5"/>
  <path class="lfc-ant" d="M22,-4 q5,-9 13,-11 M19,-5 q3,-10 9,-14"/>`;
const BEE_EYE: Pt = [21, 1];
const BEE_S = 1.25;
const BEE0: Pt = [1600, 70], BEE1: Pt = [1130, 150];

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

function formAt(m: number): { d: string; eye: Pt; fill: string } {
  const i = Math.min(2, Math.floor(m)), k = sm(m - i), a = FORMS[i], b = FORMS[i + 1];
  const pts = a.pts.map((p, j) => lerpP(p, b.pts[j], k));
  return { d: `M${pts.map(p => `${f(p[0])},${f(p[1])}`).join('L')}Z`, eye: lerpP(a.eye, b.eye, k), fill: rgb(mix(a.fill, b.fill, k)) };
}

/* ---------- the eye close-up ---------- */

/** The camera eye in section, light entering from the right; its retina is a band of dots on the back wall. */
interface Dot { x: number; y: number; mam: 'b' | 'yg'; pri: 'b' | 'g' | 'r'; zone: '' | 'r' | 'g' }
const RED_IN: Pt[] = [[100, -36], [50, -2]], GREEN_IN: Pt[] = [[100, 36], [50, 2]];
const RED_AT: Pt = [-6 + 57 * Math.cos((155 * Math.PI) / 180), 57 * Math.sin((155 * Math.PI) / 180)];
const GREEN_AT: Pt = [RED_AT[0], -RED_AT[1]];
const DOTS: Dot[] = (() => {
  const r = rng(23), out: Dot[] = [];
  [[63, 11, 130], [51, 10, 135]].forEach(([rad, n, a0], row) => {
    for (let k = 0; k < n; k++) {
      const a = ((a0 + k * 10) * Math.PI) / 180, x = -6 + rad * Math.cos(a), y = rad * Math.sin(a);
      const blue = (k + row * 2) % 4 === 1;
      const pri = blue ? 'b' : r() < 0.5 ? 'g' : 'r';
      const zone = Math.hypot(x - RED_AT[0], y - RED_AT[1]) < 24 ? 'r' : Math.hypot(x - GREEN_AT[0], y - GREEN_AT[1]) < 24 ? 'g' : '';
      out.push({ x, y, mam: blue ? 'b' : 'yg', pri, zone });
    }
  });
  // each landing zone needs both kinds after the split, so the contrast is visible
  for (const z of ['r', 'g'] as const) {
    const zd = out.filter(d => d.zone === z && d.mam === 'yg');
    if (!zd.some(d => d.pri === 'r')) zd[0].pri = 'r';
    if (!zd.some(d => d.pri === 'g')) zd[zd.length - 1].pri = 'g';
  }
  return out;
})();

/** The bee's compound eye: a honeycomb of facets, each with a cell of one kind. */
interface Facet { x: number; y: number; kind: 'uv' | 'b' | 'g' }
const FACETS: Facet[] = (() => {
  const r = rng(41), s = 15, out: Facet[] = [];
  for (let row = -6; row <= 6; row++) {
    for (let col = -6; col <= 6; col++) {
      const x = col * Math.sqrt(3) * s + (row % 2 ? (Math.sqrt(3) * s) / 2 : 0), y = row * 1.5 * s;
      if (Math.hypot(x, y) > 84) continue;
      const v = r();
      out.push({ x, y, kind: v < 0.28 ? 'uv' : v < 0.52 ? 'b' : 'g' });
    }
  }
  return out;
})();
const hexD = (x: number, y: number, s: number): string =>
  `M${Array.from({ length: 6 }, (_, i) => { const a = ((60 * i - 90) * Math.PI) / 180; return `${f(x + s * Math.cos(a))},${f(y + s * Math.sin(a))}`; }).join('L')}Z`;

/** A leaf cell: wall, chloroplasts round the edge. */
const CHLORO: Array<[number, number, number]> = [[-50, -30, -20], [-8, -36, 0], [34, -33, 12], [60, -2, 80], [40, 34, -20], [-4, 38, 0], [-50, 26, 30]];
const LEAF_LIGHT = [
  { nm: 450, c: 'b', from: [-58, -98] as Pt, to: CHLORO[0], strong: true },
  { nm: 550, c: 'g', from: [-4, -98] as Pt, to: CHLORO[1], strong: false },
  { nm: 660, c: 'r', from: [46, -98] as Pt, to: CHLORO[2], strong: true },
];

/* ---------- "So why?": each one's slice on a labelled wavelength axis ---------- */

const NM0 = 300, NM1 = 860, RX0 = 270, RX1 = 1150;
const X = (nm: number): number => RX0 + ((nm - NM0) / (NM1 - NM0)) * (RX1 - RX0);
const AXIS_Y = 290;
/** Each row is drawn only over its own slice [a, b]; w gives the strength inside it. */
const ROWS = [
  { name: 'us', y: 136, a: 380, b: 780, w: (nm: number) => Math.min(edge(nm, 380, 392), edge(nm, 780, 760)), col: full },
  { name: 'bee', y: 188, a: 300, b: 625, w: (nm: number) => Math.min(edge(nm, 300, 310), edge(nm, 625, 600)),
    col: (nm: number): RGB => (nm < 400 ? mix(K.uv, full(400), sm((nm - 370) / 30)) : full(nm)) },
  { name: 'plants', y: 240, a: 400, b: 705, w: (nm: number) => Math.min(edge(nm, 400, 410), edge(nm, 705, 695), Math.max(0.22, edge(nm, 510, 495), edge(nm, 615, 635))), col: full },
];
/** The Einstein clipping that pops in at the end: a teaser for the next slide. */
const EIN_W = 236, EIN_X = 1288, EIN_Y = 270;

/* ---------- the stage ---------- */

interface Spot { x: number; y: number; rx: number; ry: number; inn: number; out: number }
const SPOT0: Spot = { x: 800, y: 420, rx: 1300, ry: 900, inn: 1, out: 1 };
const SPOT: Spot[] = [
  { x: 450, y: 540, rx: 660, ry: 380, inn: 1, out: 0.45 },
  { x: 1180, y: 300, rx: 470, ry: 280, inn: 1, out: 0.45 },
  { x: 1180, y: 300, rx: 470, ry: 280, inn: 1, out: 0.45 },
  { x: 1090, y: 290, rx: 300, ry: 230, inn: 1, out: 0.45 },
  { x: 1250, y: 280, rx: 300, ry: 220, inn: 1, out: 0.45 },
  { x: 800, y: 420, rx: 1300, ry: 900, inn: 0, out: 0.2 },
];
/** The close-up: beside the animal (on land, primates, bees), then beside the leaf. */
const INS_A = { c: [775, 205] as Pt, r: 140 }, INS_B = { c: [1060, 166] as Pt, r: 105 };
/** Viénot, Brettel & Mollon 1999: how a two-kind (red–green blind) eye sees, as one matrix on linear RGB. */
const DICHRO = [[0.29275, 0.70725, 0], [0.29275, 0.70725, 0], [-0.02234, 0.02234, 1]];
const MX = 958;
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

  const world = `
      <path class="lfc-ground" mask="url(#${P}-soilm)" d="${GROUND_D}"/>
      <path fill="url(#${P}-water)" d="${WATER_D}"/>
      <path class="lfc-floor" stroke="url(#${P}-floorg)" d="${smooth(FLOOR)}"/>
      <path class="lfc-beach" d="${smooth(SHORE.slice(SHORE_I, SHORE_I + 3))}"/>
      <path class="lfc-turf" d="${smooth(LAND.slice(2))}"/>
      <g filter="url(#${P}-d0)">${redAlga(SHALLOW_ALGA.x, SHALLOW_ALGA.y, 0.8, 5)}</g>
      <g filter="url(#${P}-d1)">${redAlga(DEEP_ALGA.x, DEEP_ALGA.y, 1.2, 11)}</g>
      <path class="lfc-surf" d="M0,${YS}H${SHORE[SHORE_I][0]}"/>
      <path class="lfc-grass" d="${grass()}"/>
      ${tree()}
      ${flower(FL_US, 'us')}${flower(FL_BEE, 'us')}`;

  const eyeA = `<g class="lfc-c-eye">
      <circle class="lfc-ball" cx="-6" cy="0" r="72"/>
      <path class="lfc-cornea" d="M50,-48Q90,0 50,48"/>
      <path class="lfc-iris" d="M55,-45L55,-17M55,17L55,45"/>
      ${DOTS.map(d => `<circle class="lfc-halo" cx="${f(d.x)}" cy="${f(d.y)}" r="11" opacity="0"/>`).join('')}
      ${DOTS.map(d => `<circle class="lfc-dot" cx="${f(d.x)}" cy="${f(d.y)}" r="5.4"/>`).join('')}
      <g class="lfc-in-r"><path class="lfc-iw" stroke="${rgb(K.r)}" pathLength="1" d="${waveD(RED_IN[0][0], RED_IN[0][1], RED_IN[1][0], RED_IN[1][1], 650, 3.5)}${waveD(RED_IN[1][0], RED_IN[1][1], RED_AT[0] + 6, RED_AT[1] - 2, 650, 3.5).replace('M', 'L')}"/></g>
      <g class="lfc-in-g"><path class="lfc-iw" stroke="${rgb(K.g)}" pathLength="1" d="${waveD(GREEN_IN[0][0], GREEN_IN[0][1], GREEN_IN[1][0], GREEN_IN[1][1], 530, 3.5)}${waveD(GREEN_IN[1][0], GREEN_IN[1][1], GREEN_AT[0] + 6, GREEN_AT[1] + 2, 530, 3.5).replace('M', 'L')}"/></g>
      <ellipse class="lfc-lens" cx="50" cy="0" rx="9" ry="19"/>
    </g>`;
  const eyeB = `<g class="lfc-c-bee">
      ${FACETS.map(fc => `<path class="lfc-facet" d="${hexD(fc.x, fc.y, 14.2)}"/>`).join('')}
      ${FACETS.map(fc => `<circle class="lfc-halo" cx="${f(fc.x)}" cy="${f(fc.y)}" r="10.5" fill="${rgb(K[fc.kind])}" opacity="0"/>`).join('')}
      ${FACETS.map(fc => `<circle class="lfc-fdot" cx="${f(fc.x)}" cy="${f(fc.y)}" r="5.2" fill="${rgb(K[fc.kind])}"/>`).join('')}
      <path class="lfc-iw lfc-iw-uv" stroke="${rgb(K.uv)}" pathLength="1" d="${waveD(98, -30, 12, -6, 360, 3.5)}"/>
    </g>`;
  const eyeC = `<g class="lfc-c-leaf">
      <rect class="lfc-cell" x="-80" y="-56" width="160" height="112" rx="24"/>
      ${CHLORO.map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><ellipse class="lfc-chl" rx="17" ry="9"/><path class="lfc-gran" d="M-8,-4V4M-1,-5V5M6,-4V4"/></g>`).join('')}
      ${LEAF_LIGHT.map(l => `<path class="lfc-iw" stroke="${rgb(K[l.c as 'b' | 'g' | 'r'])}" pathLength="1" d="${waveD(l.from[0], l.from[1], l.to[0], l.to[1] - 9, l.nm, 3.5)}"/>`).join('')}
      ${LEAF_LIGHT.map(l => `<g class="lfc-lglow" opacity="0">${glow(P, l.to[0], l.to[1], l.strong ? 20 : 11)}</g>`).join('')}
    </g>`;

  return `${defs(P)}<defs>
    <clipPath id="${P}-win"><rect x="60" y="60" width="1480" height="630" rx="18"/></clipPath>
    <clipPath id="${P}-abdc"><ellipse cx="-15" cy="2" rx="18" ry="12"/></clipPath>
    <clipPath id="${P}-insc"><circle r="98"/></clipPath>
    <clipPath id="${P}-lensc"><circle cx="${LENS[0]}" cy="${LENS[1]}" r="${LENS_R}"/></clipPath>
    <linearGradient id="${P}-water" gradientUnits="userSpaceOnUse" x1="0" y1="${YS}" x2="0" y2="700">${waterStops}</linearGradient>
    <linearGradient id="${P}-floorg" gradientUnits="userSpaceOnUse" x1="0" y1="${YS}" x2="0" y2="700">${floorStops}</linearGradient>
    ${waveGrads}
    ${ROWS.map((r, k) => rowGrad(`${P}-row${k}`, r.a, r.b, nm => [r.col(nm), r.w(nm)])).join('')}
    <radialGradient id="${P}-uvbull" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${FL_BEE.r}">
      <stop offset="0" stop-color="${BEEVIEW.base}"/><stop offset=".6" stop-color="${BEEVIEW.base}"/><stop offset=".67" stop-color="${BEEVIEW.tip}"/><stop offset="1" stop-color="${BEEVIEW.tip}"/></radialGradient>
    <linearGradient id="${P}-soilv" gradientUnits="userSpaceOnUse" x1="0" y1="430" x2="0" y2="650"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <linearGradient id="${P}-soilh" gradientUnits="userSpaceOnUse" x1="760" y1="0" x2="1010" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <mask id="${P}-soilm" maskUnits="userSpaceOnUse" x="-100" y="300" width="1800" height="500" style="mask-type:alpha">
      <rect x="-100" y="300" width="1800" height="500" fill="url(#${P}-soilv)"/><rect x="-100" y="300" width="1800" height="500" fill="url(#${P}-soilh)"/>
    </mask>
    <radialGradient id="${P}-soft"><stop offset="0" stop-color="#000"/><stop offset=".58" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <radialGradient id="${P}-soft2"><stop offset="0" stop-color="#000"/><stop offset=".78" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <mask id="${P}-spot" maskUnits="userSpaceOnUse" x="-600" y="-600" width="2800" height="2000" style="mask-type:alpha">
      <rect class="lfc-spot-bg" x="-600" y="-600" width="2800" height="2000" fill="#000"/>
      <ellipse class="lfc-spot-e" fill="url(#${P}-soft)"/>
    </mask>
    <mask id="${P}-bubble" maskUnits="userSpaceOnUse" x="-600" y="-600" width="2800" height="2000" style="mask-type:alpha">
      <ellipse cx="${TREE_X}" cy="278" rx="230" ry="190" fill="url(#${P}-soft2)"/>
    </mask>
    <filter id="${P}-dichro" x="0" y="0" width="1" height="1" color-interpolation-filters="linearRGB">
      <feColorMatrix type="matrix" values="${DICHRO.map(r => `${r.join(' ')} 0 0`).join(' ')} 0 0 0 1 0"/>
    </filter>
    ${TINTED.map((_, i) => `<filter id="${P}-d${i}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="linearRGB"><feColorMatrix class="lfc-tm" type="matrix" values="${diag([1, 1, 1])}"/></filter>`).join('')}
    <filter id="${P}-dc" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="linearRGB"><feColorMatrix class="lfc-tmc" type="matrix" values="${diag([1, 1, 1])}"/></filter>
    <clipPath id="${P}-wclip"><rect class="lfc-wclip-r" x="0" y="${WAVE_TOP - 20}" width="1600" height="0"/></clipPath>
  </defs>

  <g clip-path="url(#${P}-win)"><g>
    <g mask="url(#${P}-spot)">
      ${world}
      <g mask="url(#${P}-bubble)"><g class="lfc-dich" opacity="0" style="display:none"><g filter="url(#${P}-dichro)">${world}</g></g></g>
    </g>
    <g class="lfc-sea" opacity="0">
      <g clip-path="url(#${P}-wclip)">
        ${SEA_WAVES.map(w => {
          const d = waveD(w.x, WAVE_TOP, w.x, YB, w.nm);
          return `<path class="lfc-whalo" stroke="url(#${P}-wh-${w.key})" d="${d}"/><path class="lfc-wave" stroke="url(#${P}-wf-${w.key})" d="${d}"/>`;
        }).join('')}
      </g>
      <g class="lfc-seal" opacity="0">${T(SEA_WAVES[0].x - 16, 300, SEA_WAVES[0].lab, 'lfc-lab lfc-lab-b', 'end')}${T(SEA_WAVES[1].x + 16, 300, SEA_WAVES[1].lab, 'lfc-lab lfc-lab-b')}</g>
    </g>
    <g class="lfc-bview" opacity="0" style="display:none">
      <circle class="lfc-lens-halo" cx="${LENS[0]}" cy="${LENS[1]}" r="${LENS_R + 3}"/>
      <g clip-path="url(#${P}-lensc)">
        <rect x="${LENS[0] - 80}" y="${LENS[1] - 80}" width="160" height="160" fill="${BEEVIEW.sky}"/>
        <path d="${GROUND_D}" fill="${BEEVIEW.ground}"/>
        ${flower(FL_BEE, 'bee')}
      </g>
      <circle class="lfc-lens-ring" cx="${LENS[0]}" cy="${LENS[1]}" r="${LENS_R}"/>
      ${T(LENS[0], LENS[1] + LENS_R + 44, 'as a bee sees it', 'lfc-lab lfc-lab-b', 'middle')}
    </g>
    <g class="lfc-subj"><g filter="url(#${P}-dc)"><g class="lfc-crea">
      <path class="lfc-body"/>
      <g class="lfc-mface" opacity="0">
        <circle class="lfc-ear" cx="3" cy="-94" r="7.5"/><circle class="lfc-ear-in" cx="3" cy="-94" r="4"/>
        <ellipse class="lfc-facedisk" cx="27" cy="-91" rx="13" ry="14"/>
        <ellipse class="lfc-muzzle" cx="31" cy="-82" rx="9" ry="6.5"/>
        <path class="lfc-mouth" d="M27,-79Q31,-77 35,-79M30,-85l1.5,0"/>
        <circle class="lfc-ceye" cx="32" cy="-93" r="3.6"/><circle class="lfc-cpupil" cx="32" cy="-93" r="2"/>
      </g>
      <circle class="lfc-ceye lfc-ceye-m" r="4.6"/><circle class="lfc-cpupil lfc-ceye-m" r="2.4"/>
    </g></g></g>
    <g class="lfc-bee" opacity="0">${bee()}</g>
  </g></g>

  <g class="lfc-ins" opacity="0" style="display:none">
    <path class="lfc-callout"/>
    <circle class="lfc-callring" r="9"/>
    <g class="lfc-ins-g">
      <circle class="lfc-ins-bg" r="100" filter="url(#${P}-sh)"/>
      <g clip-path="url(#${P}-insc)">${eyeA}${eyeB}${eyeC}</g>
      <circle class="lfc-ins-ring" r="100"/>
    </g>
    <g class="lfc-l-mam" opacity="0">${T(0, 0, 'most mammals', 'lfc-lab lfc-lab-b', 'end')}</g>
    <g class="lfc-l-pri" opacity="0">${T(0, 0, 'primates', 'lfc-lab lfc-lab-b', 'end')}</g>
    <g class="lfc-l-uv" opacity="0">${T(0, 0, 'ultraviolet shown as purple', 'lfc-lab lfc-lab-b', 'end')}</g>
    <g class="lfc-l-cells" opacity="0"><path class="lfc-leader"/>${T(0, 0, 'light-sensitive cells', 'lfc-lab', 'end')}</g>
    <g class="lfc-l-chl" opacity="0"><path class="lfc-leader"/>${T(0, 0, 'chlorophyll', 'lfc-lab', 'end')}</g>
  </g>

  <g class="lfc-rows">
    <g class="lfc-axis" opacity="0">
      <rect class="lfc-panel" x="96" y="88" width="1186" height="266" rx="18"/>
      <path class="lfc-guide" d="M${f(X(380))},${ROWS[0].y - 26}V${AXIS_Y}M${f(X(780))},${ROWS[0].y - 26}V${AXIS_Y}"/>
      <path class="lfc-ax" d="M${RX0},${AXIS_Y}H${RX1 + 18}"/><path class="lfc-axhead" d="M${RX1 + 30},${AXIS_Y}l-16,-7v14z"/>
      <path class="lfc-ax" d="M${f(X(380))},${AXIS_Y - 9}v18M${f(X(780))},${AXIS_Y - 9}v18"/>
      ${T(RX0 - 22, AXIS_Y + 8, 'wavelength', 'lfc-rowlab', 'end')}
      ${T(X(340), AXIS_Y + 38, 'ultraviolet', 'lfc-lab', 'middle')}${T(X(580), AXIS_Y + 38, 'visible', 'lfc-lab', 'middle')}${T(X(820), AXIS_Y + 38, 'infrared', 'lfc-lab', 'middle')}
    </g>
    ${ROWS.map((r, k) => `<g class="lfc-row" opacity="0">${T(RX0 - 22, r.y + 8, r.name, 'lfc-rowlab', 'end')}
      <rect x="${f(X(r.a))}" y="${r.y - 12}" width="${f(X(r.b) - X(r.a))}" height="24" rx="6" fill="url(#${P}-row${k})"/></g>`).join('')}
    <g class="lfc-qm" opacity="0">${T(1226, 226, '?', 'lfc-q', 'middle')}</g>
  </g>
  <g class="lfc-ein" opacity="0" style="display:none"><g class="lfc-ein-s">${clipping(`${P}-ein`, EIN_X, EIN_Y, EIN_W, EINSTEIN_TEASER, 3, 11)}</g></g>`;
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

  const spotBg = q('.lfc-spot-bg'), spotE = q('.lfc-spot-e');
  const tm = qa('.lfc-tm'), tmc = q('.lfc-tmc'), floorStops = qa(`#${P}-floorg stop`), wclip = q('.lfc-wclip-r'), sea = q('.lfc-sea'), seal = q('.lfc-seal');
  const subj = q('.lfc-subj'), crea = q('.lfc-crea'), body = q('.lfc-body'), face = q('.lfc-mface'), ceye = q('.lfc-ceye.lfc-ceye-m'), cpupil = q('.lfc-cpupil.lfc-ceye-m');
  const beeG = q('.lfc-bee'), dich = q('.lfc-dich'), lens = q('.lfc-bview');
  const ins = q('.lfc-ins'), insG = q('.lfc-ins-g'), callout = q('.lfc-callout'), callring = q('.lfc-callring');
  const cEye = q('.lfc-c-eye'), cBee = q('.lfc-c-bee'), cLeaf = q('.lfc-c-leaf');
  const dots = qa('.lfc-c-eye .lfc-dot'), halos = qa('.lfc-c-eye .lfc-halo');
  const inR = q('.lfc-c-eye .lfc-in-r path'), inG = q('.lfc-c-eye .lfc-in-g path');
  const fHalos = qa('.lfc-c-bee .lfc-halo'), uvWave = q('.lfc-iw-uv');
  const leafWaves = qa('.lfc-c-leaf .lfc-iw'), leafGlows = qa('.lfc-lglow');
  const lMam = q('.lfc-l-mam'), lPri = q('.lfc-l-pri'), lUv = q('.lfc-l-uv'), lCells = q('.lfc-l-cells'), lChl = q('.lfc-l-chl');
  const axis = q('.lfc-axis'), rows = qa('.lfc-row'), qm = q('.lfc-qm'), ein = q('.lfc-ein'), einG = q('.lfc-ein-s');
  const floorY = floorStops.map((_, i) => YS + ((700 - YS) * i) / (floorStops.length - 1));
  const reveal = (el: Element, k: number): void => { op(el, k > 0.001 ? 1 : 0); set(el, 'stroke-dasharray', `${k.toFixed(4)} 2`); };
  const einC: Pt = [EIN_X + EIN_W / 2, EIN_Y + clipHeight(EIN_W, EINSTEIN_TEASER) / 2];

  /** The subject's place, shape and facing at (beat, t): position of its ground point. */
  function subject(b: number, t: number): { x: number; y: number; m: number; rot: number } {
    if (b === 0) {
      const k = outC(clamp((t - 0.3) / 1.5));
      return { x: lerp(-150, 600, k), y: lerp(560, 494, k), m: 0, rot: -4 * k };
    }
    if (b === 1) {
      // crawls ashore: fish → four-legged animal → small mammal
      const sw = ramp(t, 0, 0.5), walk = ramp(t, 0.45, 1.15), m = ramp(t, 0.3, 0.7) + ramp(t, 0.7, 1.15);
      if (walk <= 0) return { x: lerp(600, 946, sw), y: lerp(494, groundY(946), sw), m, rot: lerp(-4, -14, sw) };
      const x = lerp(946, MX, walk);
      return { x, y: groundY(x), m, rot: -14 * (1 - ramp(t, 0.45, 0.7)) };
    }
    // small mammal → monkey in "Primates"; the monkey stays after
    return { x: MX, y: groundY(MX), m: b === 2 ? 2 + ramp(t, 0.1, 1.0) : 3, rot: 0 };
  }

  return (beat: number, t: number): void => {
    const b = Math.max(0, Math.min(5, beat));

    // Spotlight: a short cross-fade to the part of the scene this beat is about.
    const ks = ramp(t, 0, 0.3), s0 = b === 0 ? SPOT0 : SPOT[b - 1], s1 = SPOT[b];
    set(spotBg, 'fill-opacity', lerp(s0.out, s1.out, ks).toFixed(3));
    set(spotE, 'cx', f(lerp(s0.x, s1.x, ks)));
    set(spotE, 'cy', f(lerp(s0.y, s1.y, ks)));
    set(spotE, 'rx', f(lerp(s0.rx, s1.rx, ks)));
    set(spotE, 'ry', f(lerp(s0.ry, s1.ry, ks)));
    set(spotE, 'opacity', lerp(s0.inn, s1.inn, ks).toFixed(3));
    const dimAll = b === 5 ? lerp(1, 0.2, ks) : 1;

    // In the sea. Light goes down; red fades within a few metres, blue-green goes on, and things take its colour.
    const front = b === 0 ? lerp(WAVE_TOP - 24, 760, ramp(t, 0.1, 1.5)) : 760;
    set(wclip, 'height', f(Math.max(0, front - WAVE_TOP + 20)));
    op(sea, b === 0 ? 1 : b === 1 ? 1 - fadeIn(t, 0) : 0);
    op(seal, b === 0 ? fadeIn(t, 0.35) : 1);
    const lit = (y: number): number => (b === 0 ? clamp((front - y) / 50) : 1);
    TINTED.forEach((o, i) => { const k = lit(o.y), tr = trans(o.d); set(tm[i], 'values', diag(tr.map(v => lerp(1, v, k)))); });
    floorStops.forEach((st, i) => set(st, 'stop-color', rgb(mix(SAND, tint(SAND, dAt(floorY[i])), lit(floorY[i])))));

    // The subject: one animal, morphing along our lineage.
    const sj = subject(b, t), fm = formAt(sj.m);
    set(crea, 'transform', `translate(${f(sj.x)} ${f(sj.y)}) rotate(${f(sj.rot)})`);
    set(body, 'd', fm.d);
    set(body, 'fill', fm.fill);
    for (const e of [ceye, cpupil]) { set(e, 'cx', f(fm.eye[0])); set(e, 'cy', f(fm.eye[1])); }
    // the monkey's face (light flat muzzle, ear, two forward-facing eyes) comes in at the end of the morph
    // The monkey's face is drawn for the finished outline, so it appears only once the morph has nearly reached it;
    // earlier it would float beside the still-changing head.
    const kf = clamp((sj.m - 2.85) / 0.15);
    op(face, kf);
    set(ceye, 'r', f(lerp(4.6, 3.6, kf))); set(cpupil, 'r', f(lerp(2.4, 2, kf)));
    const under = sj.y - 14 > YS && sj.x < SHORE[SHORE_I][0] + 4, dc = under ? trans(dAt(sj.y - 14)) : [1, 1, 1];
    const kl = b === 0 ? lit(sj.y - 14) : 1;
    set(tmc, 'values', diag(dc.map(v => lerp(1, v, kl))));
    op(subj, dimAll);
    const rad = (sj.rot * Math.PI) / 180, ex = fm.eye[0], ey = fm.eye[1];
    const eyeW: Pt = [sj.x + ex * Math.cos(rad) - ey * Math.sin(rad), sj.y + ex * Math.sin(rad) + ey * Math.cos(rad)];

    // On land: two kinds of cell, and the tree in two-kind colours. Primates: the dots split, and the fruit turns red with them.
    const split = b === 2 ? ramp(t, 0.5, 1.0) : b > 2 ? 1 : 0;
    show(dich, b === 1 ? ramp(t, 1.15, 1.45) : b === 2 ? 1 - split : 0);
    const waveA = b === 1 ? ramp(t, 1.65, 2.05) : b > 1 ? 1 : 0, lightUp = b === 1 ? ramp(t, 1.95, 2.25) : b > 1 ? 1 : 0;
    reveal(inR, waveA); reveal(inG, waveA);
    DOTS.forEach((d, i) => {
      const col = d.mam === 'b' ? K.b : mix(K.yg, K[d.pri as 'g' | 'r'], split);
      set(dots[i], 'fill', rgb(col));
      const mamLit = d.mam === 'yg' && d.zone !== '' ? 1 : 0, priLit = d.zone !== '' && d.pri === d.zone ? 1 : 0;
      set(halos[i], 'fill', rgb(col));
      op(halos[i], 0.55 * lightUp * lerp(mamLit, priLit, split));
    });

    // Bees: a bee flies in; its compound eye has ultraviolet (shown as purple), blue and green cells, and no red.
    const fly = b === 3 ? outC(clamp(t / 1.0)) : 1;
    const bp: Pt = lerpP(BEE0, BEE1, fly);
    op(beeG, b === 3 ? fadeIn(t, 0) : b === 4 ? 1 - fadeIn(t, 0) : 0);
    set(beeG, 'transform', `translate(${f(bp[0])} ${f(bp[1])}) scale(${-BEE_S} ${BEE_S})`);
    const beeEye: Pt = [bp[0] - BEE_EYE[0] * BEE_S, bp[1] + BEE_EYE[1] * BEE_S];
    const toBee = b === 3 ? fadeIn(t, 1.0) : b > 3 ? 1 : 0;
    show(lens, b === 3 ? toBee : b === 4 ? 1 - fadeIn(t, 0) : 0);
    reveal(uvWave, b === 3 ? ramp(t, 1.3, 1.7) : b > 3 ? 1 : 0);
    fHalos.forEach((h, i) => op(h, FACETS[i].kind === 'uv' ? 0.55 * (b === 3 ? ramp(t, 1.6, 1.9) : b > 3 ? 1 : 0) : 0));

    // Plants: a leaf cell; its chlorophyll takes blue and red strongly, green only weakly.
    LEAF_LIGHT.forEach((l, i) => {
      reveal(leafWaves[i], b === 4 ? ramp(t, 0.4, 0.9) : b > 4 ? 1 : 0);
      op(leafGlows[i], (b === 4 ? ramp(t, 0.8, 1.2) : b > 4 ? 1 : 0) * (l.strong ? 1 : 0.45));
    });

    // The close-up appears whole, beside the animal; at "Plants" it reappears beside the leaf.
    const atB = b === 5 || (b === 4 && t >= 0.15);
    const kv = b === 1 ? fadeIn(t, 1.35) : b === 2 || b === 3 ? 1 : b === 4 ? (t < 0.15 ? 1 - t / 0.15 : ramp(t, 0.15, 0.3)) : b === 5 ? 1 - fadeIn(t, 0) : 0;
    show(ins, kv);
    const ic = atB ? INS_B.c : INS_A.c, ir = atB ? INS_B.r : INS_A.r;
    set(insG, 'transform', `translate(${f(ic[0])} ${f(ic[1])}) scale(${(ir / 100).toFixed(4)})`);
    op(cEye, atB ? 0 : 1 - toBee);
    op(cBee, atB ? 0 : toBee);
    op(cLeaf, atB ? 1 : 0);
    const target: Pt = atB ? LEAF : lerpP(eyeW, beeEye, toBee);
    const dx = target[0] - ic[0], dy = target[1] - ic[1], L = Math.hypot(dx, dy);
    if (L > ir + 4) {
      const th = Math.atan2(dy, dx), al = Math.acos(ir / L);
      const p1: Pt = [ic[0] + ir * Math.cos(th + al), ic[1] + ir * Math.sin(th + al)], p2: Pt = [ic[0] + ir * Math.cos(th - al), ic[1] + ir * Math.sin(th - al)];
      set(callout, 'd', `M${f(p1[0])},${f(p1[1])}L${f(target[0])},${f(target[1])}L${f(p2[0])},${f(p2[1])}`);
    } else set(callout, 'd', '');
    set(callring, 'cx', f(target[0])); set(callring, 'cy', f(target[1]));

    // Labels beside the close-up, each the first time its thing appears.
    const lab = (el: SVGElement, p: Pt, lead?: Pt): void => {
      const tEl = el.querySelector('text') as SVGTextElement;
      set(tEl, 'x', f(p[0])); set(tEl, 'y', f(p[1]));
      const ld = el.querySelector('.lfc-leader');
      if (ld && lead) set(ld, 'd', `M${f(p[0] + 8)},${f(p[1] - 8)}L${f(lead[0])},${f(lead[1])}`);
    };
    const sc = ir / 100, lx = ic[0] - ir - 18;
    lab(lMam, [lx, ic[1] - 40]); lab(lPri, [lx, ic[1] - 40]); lab(lUv, [lx, ic[1] + 8]);
    lab(lCells, [lx, ic[1] + 62], [ic[0] + DOTS[3].x * sc, ic[1] + 40 * sc]);
    lab(lChl, [lx, ic[1] + 50], [ic[0] + (CHLORO[6][0] - 14) * sc, ic[1] + CHLORO[6][1] * sc]);
    op(lMam, b === 1 ? fadeIn(t, 1.35) : b === 2 ? 1 - ramp(t, 0.6, 0.85) : 0);
    op(lPri, b === 2 ? ramp(t, 0.85, 1.1) : b === 3 ? 1 - toBee : 0);
    op(lCells, b === 1 ? fadeIn(t, 1.35) : b === 2 ? 1 : b === 3 ? 1 - toBee : 0);
    op(lUv, b === 3 ? toBee : b === 4 ? 1 - ramp(t, 0, 0.15) : 0);
    op(lChl, b === 4 ? ramp(t, 0.15, 0.3) : b === 5 ? 1 - fadeIn(t, 0) : 0);

    // So why? Each one's slice on a labelled wavelength axis, a question, and Einstein as a teaser for the next slide.
    op(axis, b === 5 ? fadeIn(t, 0.1) : 0);
    rows.forEach((el, k) => op(el, b === 5 ? fadeIn(t, 0.35 + 0.25 * k) : 0));
    op(qm, b === 5 ? fadeIn(t, 1.15) : 0);
    const ke = b === 5 ? fadeIn(t, 1.45) : 0;
    show(ein, ke);
    set(einG, 'transform', `translate(${f(einC[0])} ${f(einC[1])}) scale(${lerp(0.85, 1, ke).toFixed(3)}) translate(${f(-einC[0])} ${f(-einC[1])})`);
    clipFx(stage, b === 5 ? ramp(t, 2.05, 2.25) : 0);
  };
}

export const STAGING: Staging = {
  id: 'c',
  name: 'C · Eye close-up',
  note: 'One journey from fish to monkey, then a bee and a leaf; a large close-up shows each viewer’s light-sensitive cells as coloured dots.',
  svg,
  bind,
};
