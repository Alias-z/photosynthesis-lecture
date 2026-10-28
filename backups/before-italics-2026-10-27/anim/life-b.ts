// Animation 2 · "Who uses which light?", staging B · "Through each eye". One shore scene on the slide paper, seen in
// turn through each viewer's slice of light. A thin spectrum ribbon on one linear wavelength axis runs across the
// top and always shows the active viewer's band. Beats: the sea (water takes infrared and red first), the trees (two
// cones, then three), bees (ultraviolet, in false colour), plants (what their pigments absorb), the shared band.
import { LIFE_R1 } from './beats';
import './life-b.css';
import type { Staging } from './types';
import { enc, lin, spec } from '../../lib/colour';
import { T, defs, glow } from '../figs/s2';

const P = 'lfb';
type RGB = [number, number, number];
type Pt = [number, number];
type Anchor = 'start' | 'middle' | 'end';

const f = (v: number): string => v.toFixed(1);
const clamp = (v: number, a = 0, b = 1): number => Math.max(a, Math.min(b, v));
const sm = (x: number): number => { const u = clamp(x); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number): number => sm((t - a) / (b - a));
const outC = (x: number): number => 1 - Math.pow(1 - clamp(x), 3);
const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;
const mix = (a: readonly number[], b: readonly number[], k: number): RGB => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const rgb = (c: readonly number[]): string => `rgb(${c.map(v => Math.round(clamp(v, 0, 255))).join(',')})`;

/** A small seeded generator, so the drawn leaves stay where they are on every load. */
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

/* ---------- the wavelength axis: one linear scale, ultraviolet · visible · infrared ---------- */

const NM0 = 300, NM1 = 860, RX0 = 200, RX1 = 1400, RY = 100;
const X = (nm: number): number => RX0 + ((nm - NM0) / (NM1 - NM0)) * (RX1 - RX0);
const PAGE: RGB = [250, 249, 245];
const UVF: RGB = [125, 111, 168], IRF: RGB = [154, 150, 140];
/** Display colour of a wavelength, as on slide 3: spectral inside 380–780 nm, dimming at the edges; neutral outside. */
function full(nm: number): RGB {
  if (nm < 380) return UVF;
  if (nm > 780) return IRF;
  const b = clamp(Math.min((nm - 372) / 46, (800 - nm) / 100), 0.3, 1);
  return mix([40, 26, 44], spec(nm), b);
}
const pale = (nm: number): RGB => mix(full(nm), PAGE, 0.64);
/** 0 at a, 1 at b (b < a gives a falling edge). */
const edge = (nm: number, a: number, b: number): number => sm((nm - a) / (b - a));

type W = (nm: number) => number;
/** Blue-green, the light that goes deepest in water. */
const W_SEA: W = nm => Math.min(edge(nm, 425, 450), edge(nm, 565, 535));
/** Our vision: about 380–780 nm, weak at both ends. */
const W_US: W = nm => Math.min(edge(nm, 380, 410), edge(nm, 780, 690));
/** Bees: ultraviolet, blue and green; no red. */
const W_BEE: W = nm => Math.min(edge(nm, 296, 306), edge(nm, 650, 595));
/** Chlorophyll: blue and red. Phycoerythrin: green. Chlorophyll f: far-red just beyond 700 nm. */
const CHL: W = nm => Math.max(Math.min(edge(nm, 395, 410), edge(nm, 500, 485)), Math.min(edge(nm, 625, 640), edge(nm, 706, 696)));
const PE: W = nm => Math.min(edge(nm, 485, 498), edge(nm, 585, 570));
const CHLF: W = nm => Math.min(edge(nm, 698, 708), edge(nm, 756, 742));
const W_PLANT: W = nm => Math.max(CHL(nm), PE(nm), CHLF(nm));
const BEAT_W: W[] = [W_SEA, W_US, W_BEE, W_PLANT, () => 0];

/** Beat 5: the viewers' bands, one thin row each. */
const ROWS: Array<{ name: string; w: W; y: number }> = [
  { name: 'us', w: W_US, y: 142 },
  { name: 'bee', w: W_BEE, y: 172 },
  { name: 'plants', w: nm => Math.min(edge(nm, 395, 410), edge(nm, 756, 740)), y: 202 },
];
/** Where eyes and leaves overlap: both the "us" and "plants" rows are at full strength, about 400–700 nm. */
const EYE_LEAF: W = nm => Math.min(edge(nm, 388, 408), edge(nm, 712, 692));

/* ---------- the shore: sea on the left, land on the right ---------- */

const YS = 395, YB = 660;
/** Depth below the surface, compressed (not to scale): 1 m, 10 m and 100 m sit at even steps. */
const yAt = (d: number): number => YS + (YB - YS) * Math.pow(d / 100, 0.35);
const dAt = (y: number): number => 100 * Math.pow(clamp((y - YS) / (YB - YS), 0, 10), 1 / 0.35);
/** Pure water, per metre, averaged over the red (600–700 nm), green (500–600) and blue (400–500) thirds. */
const AW: RGB = [0.30, 0.06, 0.012];
const trans = (d: number): RGB => [Math.exp(-AW[0] * d), Math.exp(-AW[1] * d), Math.exp(-AW[2] * d)];
/** An object's colour lit by daylight that has come down through d metres of water (multiplied in linear RGB). */
const tint = (c: RGB, d: number): RGB => { const k = trans(d); return [enc(lin(c[0]) * k[0]), enc(lin(c[1]) * k[1]), enc(lin(c[2]) * k[2])]; };
/** The water itself, seen sideways at depth d: the same light, softened toward a grey-blue so it reads on paper. */
const waterAt = (d: number): RGB => mix(tint([206, 236, 240], d + 1.2), [86, 110, 132], 0.2);

const SHORE: Pt[] = [[0, 772], [300, 752], [450, 712], [560, 650], [640, 592], [700, 545], [750, 500], [790, 468], [832, 447], [872, 442], [904, 435], [928, 416],
  [948, 395], [985, 383], [1030, 375], [1090, 370], [1200, 368], [1350, 368], [1500, 369], [1600, 367]];
const SHORE_I = 11;
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

/** Underwater things and the depth (m) that sets their light. */
const DEEP_ALGA = { x: 702, y: groundY(702), d: 15 };
const SHALLOW_ALGA = { x: 798, y: groundY(798), d: 2 };
const ROCK = { x: 870, top: 413, d: 0.15 };
const FISH = { x: 330, y: yAt(30), d: 30 };
const TINTED = [ROCK, SHALLOW_ALGA, DEEP_ALGA, FISH];

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

/** A pointed leaf shape of length l and width w along +x, centred on the origin. */
const leafD = (l: number, w: number): string => `M${f(-l / 2)},0Q${f(-l * 0.1)},${f(-w)} ${f(l / 2)},0Q${f(-l * 0.1)},${f(w)} ${f(-l / 2)},0Z`;

/** Red alga: a dulse-like tuft of flat blades that widen to rounded tips. */
function redAlga(x: number, y: number, s: number, seed: number): string {
  const r = rng(seed);
  const blades = [-40, -20, 0, 18, 36].map((a, i) => {
    const ang = ((a + (r() - 0.5) * 8) * Math.PI) / 180, len = (40 + r() * 16 - Math.abs(a) * 0.25) * s, wmax = (6.5 + r() * 2) * s;
    const bend = (i % 2 ? 1 : -1) * (5 + r() * 5) * s;
    const ux = Math.sin(ang), uy = -Math.cos(ang), nx = -uy, ny = ux;
    const n = 14, left: string[] = [], right: string[] = [];
    for (let k = 0; k <= n; k++) {
      const u = k / n, c = bend * Math.sin(Math.PI * u);
      const w = u < 0.8 ? wmax * (0.22 + 0.78 * Math.sin((u / 0.8) * (Math.PI / 2))) : wmax * Math.sqrt(Math.max(0, 1 - ((u - 0.8) / 0.2) ** 2));
      const cx = x + ux * len * u + nx * c, cy = y + uy * len * u + ny * c;
      left.push(`${f(cx - nx * w)},${f(cy - ny * w)}`);
      right.push(`${f(cx + nx * w)},${f(cy + ny * w)}`);
    }
    return `M${left.join('L')}L${right.reverse().join('L')}Z`;
  }).join('');
  return `<path class="lfb-ralga" d="${blades}"/><ellipse class="lfb-hold" cx="${f(x)}" cy="${f(y + 1)}" rx="${f(7 * s)}" ry="${f(3.5 * s)}"/>`;
}

/** A shallow rock with a cyanobacterial mat on its top, shaded by sea-lettuce blades that arch over it. */
function rock(): string {
  const x0 = ROCK.x - 36, x1 = ROCK.x + 40, xm = ROCK.x, top = ROCK.top;
  const body = `M${x0},${f(groundY(x0) + 4)}C${x0 - 2},${top + 14} ${xm - 22},${top} ${xm},${top}C${xm + 24},${top} ${x1 + 2},${top + 10} ${x1},${f(groundY(x1) + 4)}Z`;
  const mat = `M${x0 + 5},${top + 17}C${x0 + 10},${top + 4} ${xm - 22},${top - 1.5} ${xm},${top - 1.5}C${xm + 20},${top - 1.5} ${x1 - 14},${top + 3} ${x1 - 7},${top + 8}`
    + `L${x1 - 10},${top + 14}C${x1 - 18},${top + 9} ${xm + 18},${top + 6} ${xm},${top + 6}C${xm - 20},${top + 6} ${x0 + 14},${top + 10} ${x0 + 11},${top + 21}Z`;
  const ulva = [
    `M${x1 - 10},${top + 4}C${x1 - 26},${top - 14} ${xm - 22},${top - 15} ${x0 + 4},${top - 5}C${xm - 18},${top - 6} ${x1 - 30},${top - 3} ${x1 - 8},${top + 7}Z`,
    `M${x1 - 8},${top + 5}C${x1 - 14},${top - 12} ${xm + 4},${top - 18} ${xm - 12},${top - 13}C${xm + 6},${top - 9} ${x1 - 18},${top - 4} ${x1 - 6},${top + 7}Z`,
    `M${x1 - 6},${top + 6}C${x1 + 2},${top - 9} ${x1 + 12},${top - 12} ${x1 + 19},${top - 9}C${x1 + 10},${top - 4} ${x1 + 2},${top + 2} ${x1 - 4},${top + 8}Z`,
  ].join('');
  return `<path class="lfb-rock" d="${body}"/><path class="lfb-mat" d="${mat}"/><path class="lfb-ulva" d="${ulva}"/>`;
}

/** An early chordate in side view (after Haikouichthys): fish-like, jawless, a dorsal fin fold, gill pouches and a
 *  simple eye; nose to the right, centred on the origin. `ph` and `amp` bend the tail a little while it swims. */
function fishParts(ph: number, amp: number): { fins: string; body: string; marks: string; eye: Pt } {
  const L = 116, n = 40;
  const x = (u: number): number => L / 2 - u * L;
  const c = (u: number): number => amp * u * u * Math.sin(2 * Math.PI * u * 0.9 - ph);
  const h = (u: number): number => 11.5 * (u < 0.13 ? 0.08 + 0.92 * Math.sqrt(u / 0.13) : Math.pow(1 - (u - 0.13) / 0.87, 0.95));
  const dorsal = (u: number): number => (u < 0.3 ? 0 : 8.5 * Math.pow(Math.sin((Math.PI * (u - 0.3)) / 0.72), 0.8));
  const ventral = (u: number): number => (u < 0.58 ? 0 : 5.5 * Math.sin((Math.PI * (u - 0.58)) / 0.44));
  const us = Array.from({ length: n + 1 }, (_, i) => i / n);
  const P2 = (u: number, dy: number): string => `${f(x(u))},${f(c(u) + dy)}`;
  const up = us.map(u => P2(u, -h(u))), lo = us.map(u => P2(u, h(u))).reverse();
  const body = `M${up.join('L')}L${lo.join('L')}Z`;
  const fu = us.filter(u => u >= 0.3), fv = us.filter(u => u >= 0.58);
  const fins = `M${fu.map(u => P2(u, -h(u) - dorsal(u))).join('L')}L${[...fu].reverse().map(u => P2(u, -h(u) + 1)).join('L')}Z`
    + `M${fv.map(u => P2(u, h(u) + ventral(u))).join('L')}L${[...fv].reverse().map(u => P2(u, h(u) - 1)).join('L')}Z`;
  const gills = [0.17, 0.2, 0.23, 0.26, 0.29].map(u => `M${f(x(u))},${f(c(u) + 1)}q-2.2,${f(h(u) * 0.35)} 0,${f(h(u) * 0.72)}`).join('');
  const myo = [0.36, 0.43, 0.5, 0.57, 0.64, 0.71, 0.78].map(u => {
    const hh = h(u) * 0.72;
    return `M${f(x(u) - 3)},${f(c(u) - hh)}L${f(x(u) + 3)},${f(c(u))}L${f(x(u) - 3)},${f(c(u) + hh)}`;
  }).join('');
  return { fins, body, marks: gills + myo, eye: [x(0.065), c(0.065) - 2.5] };
}

/** The bee, side view, facing right, centred on the origin. */
const bee = (): string => `
  <ellipse class="lfb-wing" cx="-6" cy="-17" rx="18" ry="8" transform="rotate(-26 -6 -17)"/>
  <ellipse class="lfb-wing" cx="5" cy="-16" rx="14" ry="7" transform="rotate(-10 5 -16)"/>
  <path class="lfb-leg" d="M-2,8 l-5,12 M4,9 l0,13 M9,7 l6,11"/>
  <path class="lfb-sting" d="M-33,4 l-6,1"/>
  <ellipse class="lfb-abd" cx="-15" cy="2" rx="18" ry="12"/>
  <g clip-path="url(#${P}-abdc)"><path class="lfb-stripe" d="M-23,-12 q-4,14 0,28 M-12,-12 q-4,14 0,28 M-33,-12 q-4,14 0,28"/></g>
  <ellipse class="lfb-abd-o" cx="-15" cy="2" rx="18" ry="12"/>
  <circle class="lfb-thorax" cx="6" cy="0" r="10"/>
  <circle class="lfb-head" cx="19" cy="2" r="7.5"/>
  <path class="lfb-ant" d="M22,-4 q5,-9 13,-11 M19,-5 q3,-10 9,-14"/>`;

/* the fruit tree */
/** The tree's vertical centre line. */
const TREE_X = 1330;
const CROWN: Array<[number, number, number]> = [[1220, 286, 44], [1262, 244, 52], [1330, 228, 52], [1398, 244, 52], [1442, 286, 44], [1292, 290, 48], [1368, 292, 48]];
const FRUIT: Pt[] = [[1234, 308], [1268, 280], [1306, 318], [1342, 294], [1382, 320], [1418, 298], [1452, 306], [1300, 254], [1372, 262]];
const YOUNG: Array<[number, number]> = [[0, -2.6], [1, -2.2], [2, -1.85], [2, -1.2], [3, -0.85], [4, -0.35], [1, -2.9]];
/** The leaf that takes blue and red in beat 4, on the crown's left edge. */
const LEAF: Pt = [1170, 282];

function tree(): string {
  const r = rng(7);
  const greens = ['#6f9f50', '#5a8a3e', '#7cab5a', '#638f46'];
  const leaves = Array.from({ length: 64 }, (_, i) => {
    const [cx, cy, cr] = CROWN[i % CROWN.length], a = r() * Math.PI * 2, rr = cr * Math.sqrt(r()) * 0.9;
    return `<path class="lfb-tl" fill="${greens[Math.floor(r() * greens.length)]}" d="${leafD(20 + r() * 7, 6 + r() * 2)}" transform="translate(${f(cx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))}) rotate(${f(r() * 360)})"/>`;
  }).join('');
  const young = YOUNG.map(([i, a]) => {
    const [cx, cy, cr] = CROWN[i], x = cx + (cr - 2) * Math.cos(a), y = cy + (cr - 2) * Math.sin(a), deg = (a * 180) / Math.PI;
    return [-28, 0, 28].map(k => `<path class="lfb-young" d="${leafD(22, 6.5)}" transform="translate(${f(x)} ${f(y)}) rotate(${f(deg + k)}) translate(10 0)"/>`).join('');
  }).join('');
  const fruit = FRUIT.map(([x, y]) => `<path class="lfb-stalk" d="M${x},${y - 9} l1,-6"/><circle class="lfb-fruit" cx="${x}" cy="${y}" r="9.5"/><circle class="lfb-fruit-hi" cx="${x - 3}" cy="${y - 3.5}" r="2.6"/>`).join('');
  return `<path class="lfb-trunk" d="M1311,370C1318,352 1320,336 1317,306C1325,310 1336,310 1344,306C1341,336 1343,352 1351,370Z"/>
    <path class="lfb-branch" d="M1322,318C1304,300 1284,292 1262,282M1338,316C1358,300 1380,292 1402,284M1330,310L1330,262"/>
    ${CROWN.map(([x, y, c]) => `<circle class="lfb-crown-o" cx="${x}" cy="${y}" r="${c}"/>`).join('')}
    ${CROWN.map(([x, y, c]) => `<circle class="lfb-crown" cx="${x}" cy="${y}" r="${c}"/>`).join('')}
    ${leaves}${young}${fruit}
    <path class="lfb-tl lfb-tl-big" d="${leafD(34, 9)}" transform="translate(${LEAF[0]} ${LEAF[1]}) rotate(196)"/>`;
}

/* the flower patch: yellow to us, with an ultraviolet bullseye for a bee */
interface Fl { x: number; y: number; r: number; n: number; rot: number; red?: boolean }
const FLOWERS: Fl[] = [
  { x: 980, y: 326, r: 25, n: 11, rot: 8 },
  { x: 1036, y: 300, r: 34, n: 12, rot: 0 },
  { x: 1098, y: 320, r: 27, n: 12, rot: 10 },
  { x: 1144, y: 342, r: 19, n: 6, rot: 0, red: true },
];
const LENS0: Pt = [962, 318], LENS1: Pt = [1064, 320], LENS_R = 100;
/** The bee: where it enters, where it hovers in beat 3, where it lands in beat 4. */
const BEE0: Pt = [770, 170], BEE1: Pt = [916, 250], BEE2: Pt = [974, 300];

const UVK: RGB[] = [[34, 24, 44], [118, 92, 170], [244, 239, 255]];
/** False colour for the bee's view: how much ultraviolet comes back, from dark plum to pale lilac. */
const uvc = (v: number): string => rgb(v < 0.5 ? mix(UVK[0], UVK[1], v / 0.5) : mix(UVK[1], UVK[2], (v - 0.5) / 0.5));

function flowers(view: 'us' | 'bee'): string {
  const bee = view === 'bee';
  return FLOWERS.map((fl, i) => {
    const gy = groundY(fl.x) + 3, sx = fl.x + (i % 2 ? 4 : -4);
    const stem = `<path class="lfb-stem" ${bee ? `style="stroke:${uvc(0.2)}"` : ''} d="M${fl.x},${fl.y + 4}Q${sx},${f((fl.y + gy) / 2)} ${fl.x},${f(gy)}"/>`
      + `<path class="lfb-sleaf" ${bee ? `style="fill:${uvc(0.2)};stroke:${uvc(0.3)}"` : ''} d="${leafD(22, 6)}" transform="translate(${f(fl.x + (i % 2 ? -10 : 10))} ${f(gy - 16)}) rotate(${i % 2 ? 210 : -30})"/>`;
    const r0 = fl.r * 0.26, w = fl.red ? fl.r * 0.42 : fl.r * 0.2;
    const petal = `M${f(r0)},0C${f(r0 + (fl.r - r0) * 0.3)},${f(-w)} ${f(fl.r - (fl.r - r0) * 0.12)},${f(-w)} ${f(fl.r)},0C${f(fl.r - (fl.r - r0) * 0.12)},${f(w)} ${f(r0 + (fl.r - r0) * 0.3)},${f(w)} ${f(r0)},0Z`;
    const fill = bee ? (fl.red ? `fill:${uvc(0.05)};stroke:${uvc(0.16)}` : `fill:url(#${P}-uv${i});stroke:${uvc(0.3)}`) : '';
    const petals = Array.from({ length: fl.n }, (_, k) => `<path class="${fl.red ? 'lfb-rpetal' : 'lfb-petal'}" ${fill ? `style="${fill}"` : ''} d="${petal}" transform="translate(${fl.x} ${fl.y}) rotate(${f(fl.rot + (k * 360) / fl.n)})"/>`).join('');
    const disk = bee ? `style="fill:${uvc(fl.red ? 0.04 : 0.1)};stroke:${uvc(0.2)}"` : '';
    return `${stem}${petals}<circle class="${fl.red ? 'lfb-rdisk' : 'lfb-disk'}" ${disk} cx="${fl.x}" cy="${fl.y}" r="${f(fl.r * 0.32)}"/>`;
  }).join('');
}

/** Grass tufts along the land. */
const grass = (): string => Array.from({ length: 15 }, (_, i) => {
  const x = 1000 + i * 37 + (i % 3) * 5;
  if (FLOWERS.some(fl => Math.abs(fl.x - x) < 10) || Math.abs(x - 1330) < 26) return '';
  const y = groundY(x) + 1;
  return `M${x},${f(y)}l-5,-11M${x},${f(y)}l0,-13M${x},${f(y)}l5,-11`;
}).join('');

/* ---------- labels ---------- */

const pillW = (s: string): number => s.length * 12.2 + 26;
/** A label on a paper-coloured pill, for labels that sit on the water. */
function pill(x: number, y: number, s: string, a: Anchor = 'start'): string {
  const w = pillW(s), x0 = a === 'start' ? x - 13 : a === 'middle' ? x - w / 2 : x - w + 13;
  return `<rect class="lfb-pill" x="${f(x0)}" y="${f(y - 24)}" width="${f(w)}" height="34" rx="17"/>${T(x, y, s, 'lfb-lab', a)}`;
}

/* ---------- beat 1: the three waves going down into the water ---------- */

const SEA_WAVES = [
  { key: 'ir', nm: 950, a: 40, x: 452, col: '#9a968c', dash: true },
  { key: 'r', nm: 650, a: 0.34, x: 486, col: '#c8361e', dash: false },
  { key: 'bg', nm: 490, a: 0.015, x: 520, col: '#1b84ad', dash: false },
];
const WAVE_TOP = 248;
const seaWaveEnd = (a: number): number => Math.min(YB, yAt(Math.log(1 / 0.03) / a));

/** Opacity of a wave at height y: 1 in air, then the fraction of light left, eased so the deep blue-green stays legible. */
function fadeStops(a: number, col: string, k: number): string {
  const y1 = 700, stops = [`<stop offset="0" stop-color="${col}" stop-opacity="${k}"/>`, `<stop offset="${(((YS - WAVE_TOP) / (y1 - WAVE_TOP)) * 100).toFixed(2)}%" stop-color="${col}" stop-opacity="${k}"/>`];
  for (let y = YS + 2; y <= y1; y += 4) {
    const o = Math.pow(Math.exp(-a * dAt(y)), 0.7) * k;
    stops.push(`<stop offset="${(((y - WAVE_TOP) / (y1 - WAVE_TOP)) * 100).toFixed(2)}%" stop-color="${col}" stop-opacity="${o.toFixed(3)}"/>`);
  }
  return stops.join('');
}

/* ---------- beat 4: who absorbs what ---------- */

const ABS = {
  leaf: { from: [1090, 196] as Pt, to: [1160, 272] as Pt, lab: [1076, 200] as Pt },
  alga: { from: [598, 296] as Pt, to: [700, 512] as Pt, lab: [628, 560] as Pt },
  mat: { from: [862, 290] as Pt, to: [860, ROCK.top] as Pt, lab: [844, 372] as Pt },
};
/** Two parallel waves (blue, red) into the leaf, 13 px apart. */
function pair(a: Pt, b: Pt, gap: number): [Pt, Pt][] {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
  return [-0.5, 0.5].map(k => [[a[0] + nx * gap * k, a[1] + ny * gap * k], [b[0] + nx * gap * k, b[1] + ny * gap * k]] as [Pt, Pt]);
}
const LEAF_WAVES = pair(ABS.leaf.from, ABS.leaf.to, 13);
const FARRED = rgb(full(730));

/* ---------- the stage ---------- */

interface Cam { s: number; px: number; py: number }
const CAM0: Cam = { s: 1, px: 800, py: 400 };
const CAM: Cam[] = [
  { s: 1.06, px: 60, py: 690 },   // the sea
  { s: 1.08, px: 1500, py: 170 }, // the tree
  { s: 1.12, px: 1040, py: 380 }, // the flowers
  { s: 1, px: 800, py: 400 },
  { s: 1, px: 800, py: 400 },
];
interface Spot { x: number; y: number; rx: number; ry: number; inn: number; out: number }
const SPOT0: Spot = { x: 800, y: 420, rx: 1300, ry: 900, inn: 1, out: 1 };
const SPOT: Spot[] = [
  { x: 450, y: 540, rx: 660, ry: 380, inn: 1, out: 0.4 },
  { x: 1322, y: 268, rx: 230, ry: 190, inn: 1, out: 0.4 },
  { x: 1030, y: 300, rx: 250, ry: 185, inn: 1, out: 0.4 },
  { x: 800, y: 420, rx: 1300, ry: 900, inn: 1, out: 1 },
  { x: 800, y: 420, rx: 1300, ry: 900, inn: 0, out: 0.24 },
];
/** Viénot, Brettel & Mollon 1999: a deuteranope's view, as one matrix on linear RGB. */
const DEUT = [[0.29275, 0.70725, 0], [0.29275, 0.70725, 0], [-0.02234, 0.02234, 1]];
const diag = (k: readonly number[]): string => `${k[0].toFixed(4)} 0 0 0 0 0 ${k[1].toFixed(4)} 0 0 0 0 0 ${k[2].toFixed(4)} 0 0 0 0 0 1 0`;
const RIB_N = 140;

function svg(): string {
  const fishP = fishParts(0, 0);
  // petals are drawn in the flower's own frame, so the bullseye is centred on 0,0
  const uvGrads = FLOWERS.map((fl, i) => `<radialGradient id="${P}-uv${i}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${fl.r}">
      <stop offset="0" stop-color="${uvc(0.12)}"/><stop offset=".62" stop-color="${uvc(0.16)}"/><stop offset=".68" stop-color="${uvc(0.9)}"/><stop offset="1" stop-color="${uvc(0.97)}"/></radialGradient>`).join('');
  const waterStops = [0, 0.1, 0.3, 1, 2, 4, 7, 10, 15, 20, 30, 45, 65, 100, 140].map(d =>
    `<stop offset="${(((yAt(d) - YS) / (700 - YS)) * 100).toFixed(2)}%" stop-color="${rgb(waterAt(d))}"/>`).join('');
  const floorStops = Array.from({ length: 22 }, (_, i) => `<stop offset="${((i / 21) * 100).toFixed(1)}%" stop-color="${rgb(SAND)}"/>`).join('');
  const ribStops = Array.from({ length: RIB_N / 2 + 1 }, (_, i) => `<stop offset="${((i / (RIB_N / 2)) * 100).toFixed(2)}%"/>`).join('');
  const rowGrads = ROWS.map((r, k) => {
    const stops = Array.from({ length: 71 }, (_, i) => {
      const nm = NM0 + ((NM1 - NM0) * i) / 70;
      return `<stop offset="${((i / 70) * 100).toFixed(2)}%" stop-color="${rgb(full(nm))}" stop-opacity="${r.w(nm).toFixed(3)}"/>`;
    }).join('');
    return `<linearGradient id="${P}-row${k}" gradientUnits="userSpaceOnUse" x1="${RX0}" y1="0" x2="${RX1}" y2="0">${stops}</linearGradient>`;
  }).join('');
  const ovStops = Array.from({ length: 71 }, (_, i) => {
    const nm = NM0 + ((NM1 - NM0) * i) / 70;
    return `<stop offset="${((i / 70) * 100).toFixed(2)}%" stop-color="#f7c948" stop-opacity="${(EYE_LEAF(nm) * 0.34).toFixed(3)}"/>`;
  }).join('');
  const waveGrads = SEA_WAVES.map(w => `<linearGradient id="${P}-wf-${w.key}" gradientUnits="userSpaceOnUse" x1="0" y1="${WAVE_TOP}" x2="0" y2="700">${fadeStops(w.a, w.col, 1)}</linearGradient>
      <linearGradient id="${P}-wh-${w.key}" gradientUnits="userSpaceOnUse" x1="0" y1="${WAVE_TOP}" x2="0" y2="700">${fadeStops(w.a, '#fffdf8', 0.7)}</linearGradient>`).join('');

  // The scene, drawn twice: as it is, and (beat 2) through a two-cone filter. A <use> copy would lose the scoped CSS.
  const world = `
      <path class="lfb-ground" mask="url(#${P}-soilm)" d="${GROUND_D}"/>
      <path fill="url(#${P}-water)" d="${WATER_D}"/>
      <path class="lfb-floor" stroke="url(#${P}-floorg)" d="${smooth(FLOOR)}"/>
      <path class="lfb-beach" d="${smooth(SHORE.slice(SHORE_I, SHORE_I + 3))}"/>
      <path class="lfb-turf" d="${smooth(LAND.slice(2))}"/>
      <g filter="url(#${P}-d2)">${redAlga(DEEP_ALGA.x, DEEP_ALGA.y, 1.2, 11)}</g>
      <g filter="url(#${P}-d1)">${redAlga(SHALLOW_ALGA.x, SHALLOW_ALGA.y, 0.8, 5)}</g>
      <g filter="url(#${P}-d0)">${rock()}</g>
      <g filter="url(#${P}-d3)"><g class="lfb-fish" transform="translate(-200 ${f(FISH.y)})">
        <path class="lfb-fin" d="${fishP.fins}"/><path class="lfb-body" d="${fishP.body}"/><path class="lfb-marks" d="${fishP.marks}"/>
        <circle class="lfb-eye-r" cx="${f(fishP.eye[0])}" cy="${f(fishP.eye[1])}" r="4.4"/><circle class="lfb-eye" cx="${f(fishP.eye[0])}" cy="${f(fishP.eye[1])}" r="2.9"/>
      </g></g>
      <path class="lfb-surf" d="M0,${YS}H${SHORE[SHORE_I][0]}"/>
      <path class="lfb-grass" d="${grass()}"/>
      ${tree()}
      ${flowers('us')}
      <g class="lfb-bee" opacity="0">${bee()}</g>`;

  return `${defs(P)}<defs>
    <clipPath id="${P}-win"><rect x="60" y="120" width="1480" height="570" rx="18"/></clipPath>
    <clipPath id="${P}-abdc"><ellipse cx="-15" cy="2" rx="18" ry="12"/></clipPath>
    <linearGradient id="${P}-water" gradientUnits="userSpaceOnUse" x1="0" y1="${YS}" x2="0" y2="700">${waterStops}</linearGradient>
    <linearGradient id="${P}-floorg" gradientUnits="userSpaceOnUse" x1="0" y1="${YS}" x2="0" y2="700">${floorStops}</linearGradient>
    <linearGradient id="${P}-rib" gradientUnits="userSpaceOnUse" x1="${RX0}" y1="0" x2="${RX1}" y2="0">${ribStops}</linearGradient>
    <linearGradient id="${P}-ov" gradientUnits="userSpaceOnUse" x1="${RX0}" y1="0" x2="${RX1}" y2="0">${ovStops}</linearGradient>
    ${rowGrads}${waveGrads}${uvGrads}
    <radialGradient id="${P}-soft"><stop offset="0" stop-color="#000"/><stop offset=".58" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <radialGradient id="${P}-soft2"><stop offset="0" stop-color="#000"/><stop offset=".8" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="${P}-wipeg" gradientUnits="userSpaceOnUse" x1="-3" y1="0" x2="3" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <linearGradient id="${P}-hlv" gradientUnits="userSpaceOnUse" x1="0" y1="114" x2="0" y2="306"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".05" stop-color="#000"/><stop offset=".72" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <mask id="${P}-hlm" maskUnits="userSpaceOnUse" x="0" y="100" width="1600" height="240" style="mask-type:alpha"><rect x="0" y="100" width="1600" height="240" fill="url(#${P}-hlv)"/></mask>
    <linearGradient id="${P}-soilv" gradientUnits="userSpaceOnUse" x1="0" y1="430" x2="0" y2="650"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <linearGradient id="${P}-soilh" gradientUnits="userSpaceOnUse" x1="760" y1="0" x2="1010" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <mask id="${P}-soilm" maskUnits="userSpaceOnUse" x="-100" y="300" width="1800" height="500" style="mask-type:alpha">
      <rect x="-100" y="300" width="1800" height="500" fill="url(#${P}-soilv)"/><rect x="-100" y="300" width="1800" height="500" fill="url(#${P}-soilh)"/>
    </mask>
    <mask id="${P}-spot" maskUnits="userSpaceOnUse" x="-600" y="-600" width="2800" height="2000" style="mask-type:alpha">
      <rect class="lfb-spot-bg" x="-600" y="-600" width="2800" height="2000" fill="#000"/>
      <ellipse class="lfb-spot-e" fill="url(#${P}-soft)"/>
    </mask>
    <mask id="${P}-bubble" maskUnits="userSpaceOnUse" x="-600" y="-600" width="2800" height="2000" style="mask-type:alpha">
      <ellipse cx="${SPOT[1].x}" cy="${SPOT[1].y + 10}" rx="${SPOT[1].rx * 1.12}" ry="${SPOT[1].ry * 1.12}" fill="url(#${P}-soft2)"/>
    </mask>
    <mask id="${P}-wipe" maskUnits="userSpaceOnUse" x="-600" y="-600" width="2800" height="2000" style="mask-type:alpha">
      <rect class="lfb-wipe-r" x="-4000" y="-600" width="4004" height="2000" fill="url(#${P}-wipeg)"/>
    </mask>
    <filter id="${P}-deut" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" color-interpolation-filters="linearRGB">
      <feColorMatrix type="matrix" values="${DEUT.map(r => `${r.join(' ')} 0 0`).join(' ')} 0 0 0 1 0"/>
    </filter>
    ${TINTED.map((_, i) => `<filter id="${P}-d${i}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="linearRGB"><feColorMatrix class="lfb-tm" type="matrix" values="${diag([1, 1, 1])}"/></filter>`).join('')}
    <clipPath id="${P}-lensc"><circle class="lfb-lens-c" cx="${LENS0[0]}" cy="${LENS0[1]}" r="${LENS_R}"/></clipPath>
    <clipPath id="${P}-wclip"><rect class="lfb-wclip-r" x="0" y="${WAVE_TOP - 20}" width="1600" height="0"/></clipPath>
    ${ROWS.map((r, k) => `<clipPath id="${P}-rowc${k}"><rect class="lfb-rowc" x="${RX0 - 2}" y="${r.y - 10}" width="0" height="20"/></clipPath>`).join('')}
  </defs>

  <g class="lfb-hl" opacity="0">
    <rect x="${RX0}" y="114" width="${RX1 - RX0}" height="200" fill="url(#${P}-ov)" mask="url(#${P}-hlm)"/>
  </g>

  <g class="lfb-ribbon">
    ${T(X(340), 74, 'ultraviolet', 'lfb-sec', 'middle')}${T(X(580), 74, 'visible', 'lfb-sec', 'middle')}${T(X(820), 74, 'infrared', 'lfb-sec', 'middle')}
    <path class="lfb-sep" d="M${f(X(380))},56V82M${f(X(780))},56V82"/>
    <path class="lfb-rib" fill="url(#${P}-rib)"/>
  </g>

  <g class="lfb-rows">
    ${ROWS.map((r, k) => `<g class="lfb-row" opacity="0">${T(RX0 - 20, r.y + 8, r.name, 'lfb-rowlab', 'end')}
      <rect clip-path="url(#${P}-rowc${k})" x="${RX0}" y="${r.y - 7}" width="${RX1 - RX0}" height="14" rx="7" fill="url(#${P}-row${k})"/></g>`).join('')}
    <g class="lfb-qm" opacity="0">${T(X(550), 292, '?', 'lfb-q', 'middle')}</g>
  </g>

  <g clip-path="url(#${P}-win)"><g class="lfb-cam">
    <g mask="url(#${P}-spot)">
      ${world}
      <g mask="url(#${P}-bubble)"><g class="lfb-deut" opacity="0" style="display:none">
        <g filter="url(#${P}-deut)" mask="url(#${P}-wipe)">${world}</g>
      </g></g>
    </g>

    <g class="lfb-ann">
      <g class="lfb-a1" opacity="0">
        <g clip-path="url(#${P}-wclip)">
          ${SEA_WAVES.map(w => {
            const d = waveD(w.x, WAVE_TOP, w.x, seaWaveEnd(w.a) + 6, w.nm);
            return `<path class="lfb-whalo" stroke="url(#${P}-wh-${w.key})" d="${d}"/><path class="lfb-wave${w.dash ? ' lfb-dash' : ''}" stroke="url(#${P}-wf-${w.key})" d="${d}"/>`;
          }).join('')}
        </g>
        <g class="lfb-ruler" opacity="0">
          <path class="lfb-rule" d="M92,${YS}V${YB}${[1, 10, 100].map(d => `M84,${f(yAt(d))}H100`).join('')}"/>
          ${pill(112, yAt(1) + 8, '1 m')}${pill(112, yAt(10) + 8, '10 m')}${pill(112, yAt(100) + 8, '100 m')}
          ${T(76, YS - 18, 'not to scale', 'lfb-note')}
        </g>
      </g>

      <g class="lfb-a2">
        <path class="lfb-divide" opacity="0" d="M0,176V438"/>
        <g class="lfb-two" opacity="0">${T(0, 418, 'two cones', 'lfb-lab lfb-lab-b', 'middle')}</g>
        <g class="lfb-three" opacity="0">${T(TREE_X + 78, 418, 'three cones', 'lfb-lab lfb-lab-b', 'middle')}</g>
      </g>

      <g class="lfb-a3" opacity="0" style="display:none">
        <circle class="lfb-lens-halo" cx="${LENS0[0]}" cy="${LENS0[1]}" r="${LENS_R + 3}"/>
        <g clip-path="url(#${P}-lensc)">
          <rect x="700" y="100" width="700" height="${YS - 100}" fill="${uvc(0.58)}"/>
          <path d="${GROUND_D}" fill="${uvc(0.15)}"/>
          <path class="lfb-beach" style="stroke:${uvc(0.34)}" d="${smooth(SHORE.slice(SHORE_I, SHORE_I + 3))}"/>
          <path class="lfb-turf" style="stroke:${uvc(0.24)}" d="${smooth(LAND.slice(2))}"/>
          <path class="lfb-grass" style="stroke:${uvc(0.24)}" d="${grass()}"/>
          ${flowers('bee')}
        </g>
        <circle class="lfb-lens-ring" cx="${LENS0[0]}" cy="${LENS0[1]}" r="${LENS_R}"/>
        <g class="lfb-fc" opacity="0">${T(LENS0[0], LENS0[1] + LENS_R + 38, 'false colour', 'lfb-lab lfb-lab-b', 'middle')}</g>
      </g>

      <g class="lfb-a4" opacity="0">
        ${LEAF_WAVES.map(([a, b], i) => `<path class="lfb-w4 f2-w f2-w${i ? 'r' : 'b'}" pathLength="1" d="${waveD(a[0], a[1], b[0], b[1], i ? 650 : 450, 5.5, i * 1.3)}"/>`).join('')}
        <path class="lfb-w4 f2-w f2-wg" pathLength="1" d="${waveD(ABS.alga.from[0], ABS.alga.from[1], ABS.alga.to[0], ABS.alga.to[1], 550, 5.5)}"/>
        <path class="lfb-w4 f2-w" style="stroke:${FARRED}" pathLength="1" d="${waveD(ABS.mat.from[0], ABS.mat.from[1], ABS.mat.to[0], ABS.mat.to[1], 730, 5.5)}"/>
        <g class="lfb-g4" opacity="0">${LEAF_WAVES.map(([, b]) => glow(P, b[0], b[1], 17)).join('')}${T(ABS.leaf.lab[0], ABS.leaf.lab[1], 'leaf', 'lfb-lab lfb-lab-b', 'end')}</g>
        <g class="lfb-g4" opacity="0">${glow(P, ABS.alga.to[0], ABS.alga.to[1], 18)}${pill(ABS.alga.lab[0], ABS.alga.lab[1], 'red alga', 'end')}</g>
        <g class="lfb-g4" opacity="0">${glow(P, ABS.mat.to[0], ABS.mat.to[1], 17)}${T(ABS.mat.lab[0], ABS.mat.lab[1], 'cyanobacteria', 'lfb-lab lfb-lab-b', 'end')}</g>
      </g>
    </g>
  </g></g>`;
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

  const cam = q('.lfb-cam'), spotBg = q('.lfb-spot-bg'), spotE = q('.lfb-spot-e');
  const rib = q('.lfb-rib'), ribStops = qa(`#${P}-rib stop`);
  const tm = qa('.lfb-tm'), floorStops = qa(`#${P}-floorg stop`), wclip = q('.lfb-wclip-r');
  const a1 = q('.lfb-a1'), ruler = q('.lfb-ruler');
  const fish = qa('.lfb-fish'), fishFin = qa('.lfb-fin'), fishBody = qa('.lfb-body'), fishMarks = qa('.lfb-marks');
  const fishEye = qa('.lfb-eye, .lfb-eye-r');
  const deut = q('.lfb-deut'), wipe = q('.lfb-wipe-r'), divide = q('.lfb-divide'), two = q('.lfb-two'), three = q('.lfb-three');
  const beeG = qa('.lfb-bee');
  const a3 = q('.lfb-a3'), lensC = q('.lfb-lens-c'), lensRing = q('.lfb-lens-ring'), lensHalo = q('.lfb-lens-halo'), lensLab = q('.lfb-fc');
  const lensLabT = lensLab.querySelector('text') as SVGTextElement;
  const a4 = q('.lfb-a4'), w4 = qa('.lfb-w4'), g4 = qa('.lfb-g4');
  const rows = qa('.lfb-row'), rowc = qa('.lfb-rowc'), hl = q('.lfb-hl'), qm = q('.lfb-qm');
  const floorY = floorStops.map((_, i) => YS + ((700 - YS) * i) / (floorStops.length - 1));

  /** Ribbon: thin and pale everywhere; the active band swells and takes its full colour. */
  function ribbon(w: W): void {
    const top: string[] = [], bot: string[] = [];
    for (let i = 0; i <= RIB_N; i++) {
      const nm = NM0 + ((NM1 - NM0) * i) / RIB_N, h = 8 + 14 * w(nm), x = f(X(nm));
      top.push(`${x},${f(RY - h / 2)}`);
      bot.push(`${x},${f(RY + h / 2)}`);
    }
    set(rib, 'd', `M${top.join('L')}L${bot.reverse().join('L')}Z`);
    ribStops.forEach((s, i) => {
      const nm = NM0 + ((NM1 - NM0) * i) / (ribStops.length - 1);
      set(s, 'stop-color', rgb(mix(pale(nm), full(nm), w(nm))));
    });
  }

  function ribbonW(b: number, t: number): W {
    if (b === 3) {
      const k = 1 - ramp(t, 0, 0.6), a = ramp(t, 1.1, 1.6), g = ramp(t, 2.5, 3.0), r = ramp(t, 3.9, 4.4);
      return nm => Math.max(k * W_BEE(nm), a * CHL(nm), g * PE(nm), r * CHLF(nm));
    }
    const k = ramp(t, 0.3, 1.3), prev: W = b === 0 ? () => 0 : BEAT_W[b - 1], next = BEAT_W[b];
    return nm => lerp(prev(nm), next(nm), k);
  }

  function setFish(x: number, ph: number, amp: number): void {
    const p = fishParts(ph, amp);
    fish.forEach(e => set(e, 'transform', `translate(${f(x)} ${f(FISH.y)}) scale(1.3)`));
    fishFin.forEach(e => set(e, 'd', p.fins));
    fishBody.forEach(e => set(e, 'd', p.body));
    fishMarks.forEach(e => set(e, 'd', p.marks));
    fishEye.forEach(e => { set(e, 'cx', f(p.eye[0])); set(e, 'cy', f(p.eye[1])); });
  }

  return (beat: number, t: number): void => {
    const b = Math.max(0, Math.min(4, beat));

    // Camera: each beat leans in from where the last one ended.
    const kc = ramp(t, 0, 1.6), c0 = b === 0 ? CAM0 : CAM[b - 1], c1 = CAM[b];
    const s = lerp(c0.s, c1.s, kc), tx = lerp(c0.px * (1 - c0.s), c1.px * (1 - c1.s), kc), ty = lerp(c0.py * (1 - c0.s), c1.py * (1 - c1.s), kc);
    set(cam, 'transform', `translate(${f(tx)} ${f(ty)}) scale(${s.toFixed(4)})`);

    // Spotlight: the scene fades toward the paper outside it.
    const ks = ramp(t, 0.1, 1.5), s0 = b === 0 ? SPOT0 : SPOT[b - 1], s1 = SPOT[b];
    set(spotBg, 'fill-opacity', lerp(s0.out, s1.out, ks).toFixed(3));
    set(spotE, 'cx', f(lerp(s0.x, s1.x, ks)));
    set(spotE, 'cy', f(lerp(s0.y, s1.y, ks)));
    set(spotE, 'rx', f(lerp(s0.rx, s1.rx, ks)));
    set(spotE, 'ry', f(lerp(s0.ry, s1.ry, ks)));
    set(spotE, 'opacity', lerp(s0.inn, s1.inn, ks).toFixed(3));

    ribbon(ribbonW(b, t));

    // Beat 1. The light goes down; each thing under water takes the colour of the light that reaches its depth.
    const front = b === 0 ? lerp(WAVE_TOP - 24, 760, ramp(t, 0.3, 3.6)) : 760;
    set(wclip, 'height', f(Math.max(0, front - WAVE_TOP + 20)));
    const lit = (y: number): number => (b === 0 ? clamp((front - y) / 50) : 1);
    TINTED.forEach((o, i) => {
      const y = 'y' in o ? o.y : o.top, k = lit(y), tr = trans(o.d);
      set(tm[i], 'values', diag(tr.map(v => lerp(1, v, k))));
    });
    floorStops.forEach((st, i) => {
      const y = floorY[i];
      set(st, 'stop-color', rgb(mix(SAND, tint(SAND, dAt(y)), lit(y))));
    });
    op(a1, b === 0 ? 1 : b === 1 ? 1 - ramp(t, 0, 0.6) : 0);
    op(ruler, b === 0 ? ramp(t, 0.8, 1.6) : 1);
    const swim = b === 0 ? clamp((t - 1.4) / 3.4) : 1;
    setFish(lerp(-140, FISH.x, outC(swim)), 6.5 * (b === 0 ? Math.min(t, 4.8) : 4.8), b === 0 ? lerp(2.8, 0.9, ramp(t, 3.6, 4.8)) : 0.9);

    // Beat 2. The tree as a two-cone mammal sees it, then the third cone sweeps in.
    // The wipe comes in from the right and stops on the tree's centre line, so the still shows both views.
    const kw = b === 1 ? ramp(t, 2.2, 3.6) : b === 2 ? 1 : 0, wx = lerp(1640, TREE_X, kw);
    const out2 = b === 2 ? 1 - ramp(t, 0, 0.6) : 0;
    show(deut, b === 1 ? ramp(t, 0.3, 1.1) : out2);
    set(wipe, 'transform', `translate(${f(wx)} 0)`);
    set(divide, 'transform', `translate(${f(wx)} 0)`);
    op(divide, b === 1 ? ramp(t, 2.0, 2.3) : out2);
    set(two, 'transform', `translate(${f(lerp(TREE_X, TREE_X - 77, kw))} 0)`);
    op(two, b === 1 ? ramp(t, 0.7, 1.2) : out2);
    op(three, b === 1 ? ramp(t, 3.4, 3.9) : out2);

    // Beat 3. A bee flies in; a bee's-eye lens slides over the flowers.
    // ... and in beat 4 it lands on the big flower, out of the way.
    const fly = b < 2 ? 0 : b === 2 ? ramp(t, 0.3, 2.4) : 1, land = b < 3 ? 0 : b === 3 ? ramp(t, 0.1, 1.3) : 1;
    const bx = land > 0 ? lerp(BEE1[0], BEE2[0], land) : lerp(BEE0[0], BEE1[0], fly);
    const by = land > 0 ? lerp(BEE1[1], BEE2[1], land) - 22 * Math.sin(Math.PI * land) : lerp(BEE0[1], BEE1[1], fly) - 30 * Math.sin(Math.PI * fly);
    beeG.forEach(e => { op(e, b < 2 ? 0 : b === 2 ? ramp(t, 0.2, 0.7) : 1); set(e, 'transform', `translate(${f(bx)} ${f(by)}) scale(1.25)`); });
    show(a3, b === 2 ? ramp(t, 0.7, 1.2) : b === 3 ? 1 - ramp(t, 0, 0.5) : 0);
    const kl = b === 2 ? ramp(t, 0.9, 3.4) : 1, lx = lerp(LENS0[0], LENS1[0], kl), ly = lerp(LENS0[1], LENS1[1], kl);
    for (const el of [lensC, lensRing, lensHalo]) { set(el, 'cx', f(lx)); set(el, 'cy', f(ly)); }
    set(lensLabT, 'x', f(lx));
    set(lensLabT, 'y', f(ly + LENS_R + 38));
    op(lensLab, b === 2 ? ramp(t, 1.4, 2.0) : 1);

    // Beat 4. Who absorbs what: the leaf (blue, red), the red alga (green), the cyanobacteria (far-red).
    op(a4, b === 3 ? 1 : b === 4 ? 1 - ramp(t, 0, 0.6) : 0);
    const grow = [[0.4, 1.3], [0.4, 1.3], [1.8, 2.7], [3.2, 4.1]];
    w4.forEach((el, i) => {
      const k = b === 3 ? ramp(t, grow[i][0], grow[i][1]) : b > 3 ? 1 : 0;
      op(el, k > 0 ? 1 : 0);
      set(el, 'stroke-dasharray', `${k.toFixed(4)} 2`);
    });
    const gl = [[1.1, 1.6], [2.5, 3.0], [3.9, 4.4]];
    g4.forEach((el, i) => op(el, b === 3 ? ramp(t, gl[i][0], gl[i][1]) : b > 3 ? 1 : 0));

    // Beat 5. The bands as rows; where they overlap, a question.
    rows.forEach((el, k) => {
      const r = b === 4 ? ramp(t, 0.8 + 0.5 * k, 1.8 + 0.5 * k) : 0;
      op(el, b === 4 ? ramp(t, 0.8 + 0.5 * k, 1.1 + 0.5 * k) : 0);
      set(rowc[k], 'width', f((RX1 - RX0 + 4) * r));
    });
    op(hl, b === 4 ? ramp(t, 2.9, 3.7) : 0);
    op(qm, b === 4 ? ramp(t, 3.3, 4.0) : 0);
  };
}

export const STAGING: Staging = {
  beats: LIFE_R1,
  id: 'b',
  name: 'B · Through each eye',
  note: 'One shore scene, seen in turn through each creature’s slice of light.',
  svg,
  bind,
};
