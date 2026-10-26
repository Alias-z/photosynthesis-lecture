// Animation 2 · "Who uses which light?", staging F · "Zoom to the scene". Life D's side-by-side windows (each viewer's
// eye with its light-sensitive cells as coloured dots) with life C's animals. The camera zooms into each scene in turn:
// the sea, the shore, the fruit tree, the flowers, a leaf; the windows appear beside the scene. One animal morphs along
// our lineage (fish, four-legged animal, small mammal, monkey); the monkey leaps into the fruit tree and hangs upside
// down from a branch while a bee comes to the flowers.
// The last beat sets each user's slice as a row on a labelled wavelength axis, with Einstein as the teaser.
import './life-f.css';
import type { Staging } from './types';
import { enc, lin, spec } from '../../lib/colour';
import { T, defs, glow, leaf } from '../figs/s2';
import { EINSTEIN_TEASER, clipFx, clipHeight, clipping } from '../figs/clipping';

const P = 'lff';
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
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

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
/** Bees: ultraviolet, blue and green, fading out in orange; no red. */
const W_BEE: W = nm => Math.min(edge(nm, 296, 306), edge(nm, 628, 588));
/** Chlorophyll: strong in blue and red, weak in green. */
const W_PLANT: W = nm => Math.max(
  Math.min(edge(nm, 395, 410), edge(nm, 500, 485)),
  Math.min(edge(nm, 625, 640), edge(nm, 706, 694)),
  0.2 * Math.min(edge(nm, 480, 500), edge(nm, 640, 620)),
);
const NONE: W = () => 0;
const BEAT_W: W[] = [W_SEA, W_US, W_US, W_BEE, W_PLANT, NONE];

/** The last beat: each user's slice as one row on its own labelled wavelength axis (same nm range as the ribbon,
 *  narrower, so the "?" and Einstein's clipping fit on the right). */
const AX0 = 214, AX1 = 1046;
const XA = (nm: number): number => AX0 + ((nm - NM0) / (NM1 - NM0)) * (AX1 - AX0);
const ROWS: Array<{ name: string; w: W; y: number }> = [
  { name: 'us', w: W_US, y: 302 },
  { name: 'bee', w: W_BEE, y: 392 },
  { name: 'plants', w: W_PLANT, y: 482 },
];
const ROW_H = 30, AXIS_Y = 548, SEC_Y = 238;
/** Einstein's clipping, the teaser for the photon slide: right of the "?", centred on the rows. */
const CLIP_W = 236, CLIP_H = clipHeight(CLIP_W, EINSTEIN_TEASER), CLIP_X = 1270, CLIP_Y = ROWS[1].y - CLIP_H / 2;

/* ---------- the shore (world coordinates: beat 1 shows them 1:1) ---------- */

const YS = 400, YB = 660;
/** Depth below the surface, compressed so the first metres get room: 1 m, 10 m and 100 m sit at even steps. */
const yAt = (d: number): number => YS + (YB - YS) * Math.pow(d / 100, 0.35);
const dAt = (y: number): number => 100 * Math.pow(clamp((y - YS) / (YB - YS), 0, 10), 1 / 0.35);
/** Pure water, per metre, averaged over the red (600–700 nm), green (500–600) and blue (400–500) thirds. */
const AW: RGB = [0.30, 0.06, 0.012];
const trans = (d: number): RGB => [Math.exp(-AW[0] * d), Math.exp(-AW[1] * d), Math.exp(-AW[2] * d)];
/** An object's colour lit by daylight that has come down through d metres of water (multiplied in linear RGB). */
const tint = (c: RGB, d: number): RGB => { const k = trans(d); return [enc(lin(c[0]) * k[0]), enc(lin(c[1]) * k[1]), enc(lin(c[2]) * k[2])]; };
/** The water itself, seen sideways at depth d: the same light, softened toward a grey-blue so it reads on paper. */
const waterAt = (d: number): RGB => mix(tint([206, 236, 240], d + 1.2), [86, 110, 132], 0.2);

const SHORE: Pt[] = [[-240, 800], [300, 792], [520, 764], [680, 716], [800, 654], [900, 584], [980, 520], [1040, 472], [1090, 436],
  [1130, 413], [1162, 399], [1196, 386], [1240, 378], [1300, 375], [1500, 374], [1800, 375], [2300, 375]];
const SHORE_I = 10;
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
const GROUND_D = `${smooth(SHORE)}L2300,900L-240,900Z`;
const WATER_D = `M-240,${YS}L${SHORE[SHORE_I][0]},${YS}${curve([...FLOOR].reverse())}Z`;
const SAND: RGB = [222, 204, 160];

/** Two identical red sea stars, one just under the surface and one deep down. */
const STARS = [
  { x: 1104, y: groundY(1104) - 4, rot: 12 },
  { x: 846, y: groundY(846) - 4, rot: -8 },
].map(s => ({ ...s, d: dAt(s.y) }));

/* ---------- the camera: a world point (cx, cy) shown at stage point (px, py), at scale s ---------- */

interface Cam { cx: number; cy: number; px: number; py: number; s: number }
const K_WIDE: Cam = { cx: 800, cy: 405, px: 800, py: 405, s: 1 };
/** Each beat's scene: the sea, the shore, the fruit tree, the flowers, a leaf (the last beat keeps the leaf's view). */
const KEYS: Cam[] = [
  { cx: 690, cy: 470, px: 700, py: 430, s: 1.4 },
  { cx: 1310, cy: 300, px: 390, py: 485, s: 1.4 },
  { cx: 1370, cy: 270, px: 400, py: 410, s: 1.9 },
  { cx: 1362, cy: 375, px: 280, py: 600, s: 2.4 },
  { cx: 1336, cy: 214, px: 392, py: 410, s: 4.4 },
  { cx: 1336, cy: 214, px: 392, py: 410, s: 4.4 },
];
/** Between two framings: focus and scale move together (scale geometrically), so the zoom feels even. */
function camAt(a: Cam, b: Cam, k: number): Cam {
  return { cx: lerp(a.cx, b.cx, k), cy: lerp(a.cy, b.cy, k), px: lerp(a.px, b.px, k), py: lerp(a.py, b.py, k), s: a.s * Math.pow(b.s / a.s, k) };
}
const camT = (c: Cam): string => `translate(${f(c.px - c.s * c.cx)} ${f(c.py - c.s * c.cy)}) scale(${c.s.toFixed(4)})`;

/* ---------- land: the fruit tree, the flowers ---------- */

/** Where the small mammal stops on the shore, and where it sits as the monkey, left of the fruit tree. */
const MAM_X = 1222, MONKEY_X = 1290;
/** A low branch on the trunk's left, under the crown; the monkey hangs from its end by its feet. */
const BRANCH_D = 'M1414,276C1398,266 1380,259 1352,255M1376,259l-7,-9';
const HANG: Pt = [1366, 257], HANG_S = 0.5;
const TREE_X = 1418, TREE_S = 0.56, CROWN_Y = 214;
/** B's crown, drawn around its centre (1330, 258) and placed at (TREE_X, CROWN_Y), scaled by TREE_S. */
const CROWN: Array<[number, number, number]> = [[1220, 286, 44], [1262, 244, 52], [1330, 228, 52], [1398, 244, 52], [1442, 286, 44], [1292, 290, 48], [1368, 292, 48]];
const FRUIT: Pt[] = [[1234, 308], [1268, 280], [1306, 318], [1342, 294], [1382, 320], [1418, 298], [1452, 306], [1300, 254], [1372, 262]];
/** A bigger leaf on the crown's left edge (B's coordinates): the leaf the plants beat zooms to. */
const LEAF_B: Pt = [1180, 280];

/** A pointed leaf shape of length l and width w along +x, centred on the origin. */
const leafD = (l: number, w: number): string => `M${f(-l / 2)},0Q${f(-l * 0.1)},${f(-w)} ${f(l / 2)},0Q${f(-l * 0.1)},${f(w)} ${f(-l / 2)},0Z`;

function tree(): string {
  const r = rng(7);
  const greens = ['#6f9f50', '#5a8a3e', '#7cab5a', '#638f46'];
  const leaves = Array.from({ length: 64 }, (_, i) => {
    const [cx, cy, cr] = CROWN[i % CROWN.length], a = r() * Math.PI * 2, rr = cr * Math.sqrt(r()) * 0.9;
    return `<path class="lff-tl" fill="${greens[Math.floor(r() * greens.length)]}" d="${leafD(20 + r() * 7, 6 + r() * 2)}" transform="translate(${f(cx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))}) rotate(${f(r() * 360)})"/>`;
  }).join('');
  const fruit = FRUIT.map(([x, y]) => `<path class="lff-stalk" d="M${x},${y - 9} l1,-6"/><circle class="lff-fruit" cx="${x}" cy="${y}" r="9.5"/><circle class="lff-fruit-hi" cx="${x - 3}" cy="${y - 3.5}" r="2.6"/>`).join('');
  const top = CROWN_Y + TREE_S * 50, x = TREE_X;
  return `<path class="lff-lbranch" d="${BRANCH_D}"/><path class="lff-trunk" d="M${x - 11},377C${x - 6},${f(top + 80)} ${x - 5},${f(top + 30)} ${x - 6},${f(top)}L${x + 6},${f(top)}C${x + 5},${f(top + 30)} ${x + 6},${f(top + 80)} ${x + 11},377Z"/>
    <g transform="translate(${TREE_X} ${CROWN_Y}) scale(${TREE_S}) translate(-1330 -258)">
    <path class="lff-branch" d="M1322,318C1304,300 1284,292 1262,282M1338,316C1358,300 1380,292 1402,284M1330,310L1330,262"/>
    ${CROWN.map(([x, y, c]) => `<circle class="lff-crown-o" cx="${x}" cy="${y}" r="${c}"/>`).join('')}
    ${CROWN.map(([x, y, c]) => `<circle class="lff-crown" cx="${x}" cy="${y}" r="${c}"/>`).join('')}
    ${leaves}${fruit}
    <path class="lff-tl lff-tl-big" d="${leafD(34, 9)}" transform="translate(${LEAF_B[0]} ${LEAF_B[1]}) rotate(196)"/>
  </g>`;
}

/** Petals of a daisy-like flower of radius r, in the flower's own frame. */
function petals(r: number, n: number, rot: number, cls: string, style = ''): string {
  const r0 = r * 0.26, w = r * 0.2;
  const d = `M${f(r0)},0C${f(r0 + (r - r0) * 0.3)},${f(-w)} ${f(r - (r - r0) * 0.12)},${f(-w)} ${f(r)},0C${f(r - (r - r0) * 0.12)},${f(w)} ${f(r0 + (r - r0) * 0.3)},${f(w)} ${f(r0)},0Z`;
  return Array.from({ length: n }, (_, k) => `<path class="${cls}"${style ? ` style="${style}"` : ''} d="${d}" transform="rotate(${f(rot + (k * 360) / n)})"/>`).join('');
}
/** A five-petalled red flower of radius r, in its own frame. */
const redFlower = (r: number, cls: string, dcls: string): string =>
  Array.from({ length: 5 }, (_, k) => {
    const a = ((k * 72 - 90) * Math.PI) / 180;
    return `<circle class="${cls}" cx="${f(Math.cos(a) * r * 0.52)}" cy="${f(Math.sin(a) * r * 0.52)}" r="${f(r * 0.5)}"/>`;
  }).join('') + `<circle class="${dcls}" r="${f(r * 0.3)}"/>`;

/** The flowers in front of the monkey (world). */
const FLOWER: Pt = [1470, 318], FLOWER_R = 19;
const FLOWER2: Pt = [1450, 338];
const RED: Pt = [1492, 343];
function sceneFlowers(): string {
  const stem = (x: number, y: number, bend: number): string => `<path class="lff-stem" d="M${x},${y + 4}Q${x + bend},${f((y + 375) / 2)} ${x},375"/>`;
  return `${stem(FLOWER2[0], FLOWER2[1], 4)}${stem(RED[0], RED[1], -3)}${stem(FLOWER[0], FLOWER[1], -4)}
    <path class="lff-sleaf" d="${leafD(22, 6)}" transform="translate(${FLOWER[0] + 10} 356) rotate(-30)"/>
    <path class="lff-sleaf" d="${leafD(20, 6)}" transform="translate(${FLOWER2[0] - 9} 360) rotate(210)"/>
    <g transform="translate(${FLOWER2[0]} ${FLOWER2[1]})">${petals(14, 11, 6, 'lff-petal')}<circle class="lff-disk" r="4.5"/></g>
    <g transform="translate(${RED[0]} ${RED[1]})">${redFlower(12, 'lff-rpetal', 'lff-rdisk')}</g>
    <g transform="translate(${FLOWER[0]} ${FLOWER[1]})">${petals(FLOWER_R, 12, 0, 'lff-petal')}<circle class="lff-disk" r="6"/></g>`;
}

/** Grass tufts along the land. */
const grass = (): string => Array.from({ length: 22 }, (_, i) => {
  const x = 1236 + i * 34 + (i % 3) * 5;
  if ([FLOWER[0], FLOWER2[0], RED[0], TREE_X, MONKEY_X].some(v => Math.abs(v - x) < 14)) return '';
  const y = groundY(x) + 1;
  return `M${x},${f(y)}l-5,-11M${x},${f(y)}l0,-13M${x},${f(y)}l5,-11`;
}).join('');

/** A sea star of arm length r, in its own frame. */
function star(r: number): string {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = ((i * 36 - 90) * Math.PI) / 180, rr = i % 2 ? r * 0.42 : r;
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
  }
  return `<path class="lff-star" d="M${pts.map(p => `${f(p[0])},${f(p[1])}`).join('L')}Z"/>`;
}

/* ---------- the subject: life C's animals, fish → four-legged animal → small mammal → monkey ---------- */

const lerpP = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
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
  const total = segs.reduce((acc, v) => acc + v, 0), out: Pt[] = [];
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

/** The outline at morph stage m (0 fish … 3 monkey); `wig` bends the fish's tail while it swims. */
function formAt(m: number, wig = 0, ph = 0): { d: string; eye: Pt; fill: string } {
  const i = Math.min(2, Math.floor(clamp(m, 0, 3))), k = sm(clamp(m, 0, 3) - i), a = FORMS[i], b = FORMS[i + 1];
  const pts = a.pts.map((p, j) => {
    const q = lerpP(p, b.pts[j], k);
    if (wig && q[0] < 0) { const u = -q[0] / 92; q[1] += wig * u * u * Math.sin(2 * Math.PI * u * 0.8 - ph); }
    return q;
  });
  return { d: `M${pts.map(p => `${f(p[0])},${f(p[1])}`).join('L')}Z`, eye: lerpP(a.eye, b.eye, k), fill: rgb(mix(a.fill, b.fill, k)) };
}

/* ---------- the bee ---------- */

/** The bee, side view, facing right, centred on the origin. */
const bee = (): string => `
  <g class="lff-wings"><ellipse class="lff-wing" cx="-6" cy="-17" rx="18" ry="8" transform="rotate(-26 -6 -17)"/>
  <ellipse class="lff-wing" cx="5" cy="-16" rx="14" ry="7" transform="rotate(-10 5 -16)"/></g>
  <path class="lff-leg" d="M-2,8 l-5,12 M4,9 l0,13 M9,7 l6,11"/>
  <path class="lff-sting" d="M-33,4 l-6,1"/>
  <ellipse class="lff-abd" cx="-15" cy="2" rx="18" ry="12"/>
  <g clip-path="url(#${P}-abdc)"><path class="lff-stripe" d="M-23,-12 q-4,14 0,28 M-12,-12 q-4,14 0,28 M-33,-12 q-4,14 0,28"/></g>
  <ellipse class="lff-abd-o" cx="-15" cy="2" rx="18" ry="12"/>
  <circle class="lff-thorax" cx="6" cy="0" r="10"/>
  <circle class="lff-head" cx="19" cy="2" r="7.5"/>
  <path class="lff-ant" d="M22,-4 q5,-9 13,-11 M19,-5 q3,-10 9,-14"/>`;
/** The bee: where it enters, where it hovers, where it lands on the big flower (world). */
const BEE0: Pt = [1540, 214], BEE1: Pt = [1486, 268], BEE2: Pt = [1469, 302];
const BEE_S = 0.62;

/* ---------- the two views: framed panels, each with the viewer's eye under it ---------- */

const PW = 370, PH = 250, PR = 16;
const SLOT_A: Pt = [752, 176], SLOT_B: Pt = [1162, 176];
const WY0 = PH + 14, WY1 = PH + 58, EYE_Y = PH + 124, LAB_Y = -20, ER = 50, NOTE_Y = EYE_Y + ER + 50;
/** The dot that the "light-sensitive cells" label points at: the third of six, just right of the eye's bottom. */
const CELL_DOT: Pt = [PW / 2 + Math.cos((76.4 * Math.PI) / 180) * (ER - 9), EYE_Y + Math.sin((76.4 * Math.PI) / 180) * (ER - 9)];

const COL = { b: '#2350e6', g: '#2a963a', r: '#c8361e', y: '#a5b41f', uv: '#8b55d6' } as const;
type Dot = keyof typeof COL;
const NMOF: Record<Dot, number> = { uv: 365, b: 450, g: 550, y: 560, r: 650 };

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

/** Light arriving at an eye: short parallel waves from the panel down to the eye. */
function eyeWaves(cls: string, cols: Dot[]): string {
  const gap = 13, x0 = PW / 2 - ((cols.length - 1) * gap) / 2;
  return cols.map((c, i) => `<path class="lff-ew${cls ? ` ${cls}` : ''}" pathLength="1" style="stroke:${COL[c]}" d="${waveD(x0 + i * gap, WY0, x0 + i * gap, WY1, NMOF[c], 4, 0.6 * i)}"/>`).join('');
}

/** Our kind of eye, cut through and looking up at the view above: cornea and lens on top, the retina below with its
 *  light-sensitive cells as coloured dots. */
function camEye(id: string, dots: Dot[], from: Dot[] = dots): string {
  const cx = PW / 2, cy = EYE_Y, r = ER, rr = r - 9;
  const at = (deg: number, d: number): Pt => [cx + Math.cos((deg * Math.PI) / 180) * d, cy + Math.sin((deg * Math.PI) / 180) * d];
  const c0 = at(-124, r), c1 = at(-56, r), i0 = at(-114, r), i1 = at(-66, r), a0 = at(12, r - 4), a1 = at(168, r - 4);
  const ds = dots.map((d, k) => {
    const [x, y] = at(22 + (136 * k) / (dots.length - 1), rr);
    return `<circle class="lff-halo lff-halo-${id}" cx="${f(x)}" cy="${f(y)}" r="15" fill="url(#${P}-glow)" opacity="0"/><circle class="lff-dot lff-dot-${id}" data-c="${d}" data-c0="${from[k]}" cx="${f(x)}" cy="${f(y)}" r="7.5"/>`;
  }).join('');
  return `<circle class="lff-ball" cx="${cx}" cy="${cy}" r="${r}"/>
    <path class="lff-cornea" d="M${f(c0[0])},${f(c0[1])}Q${cx},${cy - r - 16} ${f(c1[0])},${f(c1[1])}"/>
    <path class="lff-retina" d="M${f(a0[0])},${f(a0[1])}A${r - 4},${r - 4} 0 0 1 ${f(a1[0])},${f(a1[1])}"/>
    <ellipse class="lff-lens" cx="${cx}" cy="${cy - r + 17}" rx="17" ry="9"/>
    <path class="lff-iris" d="M${f(i0[0])},${f(i0[1])}L${cx - 14},${f(cy - r + 7)}M${f(i1[0])},${f(i1[1])}L${cx + 14},${f(cy - r + 7)}"/>
    ${ds}`;
}

/** A bee's compound eye: a cluster of facets, each with ultraviolet, blue and green light-sensitive cells. */
function beeEye(id: string): string {
  const cx = PW / 2, cy = EYE_Y + 2, R = 16.5;
  const hexes: Pt[] = [[0, 0], ...Array.from({ length: 6 }, (_, k) => [Math.cos((k * 60 + 30) * Math.PI / 180) * R * 1.75, Math.sin((k * 60 + 30) * Math.PI / 180) * R * 1.75] as Pt)];
  const hexD = ([x, y]: Pt): string => `M${Array.from({ length: 6 }, (_, k) => `${f(cx + x + Math.cos((k * 60) * Math.PI / 180) * R)},${f(cy + y + Math.sin((k * 60) * Math.PI / 180) * R)}`).join('L')}Z`;
  const order: Dot[] = ['uv', 'b', 'g'];
  const ds = hexes.map(([x, y]) => order.map((d, k) => {
    const a = ((k * 120 - 90) * Math.PI) / 180, px = cx + x + Math.cos(a) * 6.2, py = cy + y + Math.sin(a) * 6.2;
    return `<circle class="lff-halo lff-halo-${id}" cx="${f(px)}" cy="${f(py)}" r="9" fill="url(#${P}-glow)" opacity="0"/><circle class="lff-dot lff-dot-${id}" data-c="${d}" cx="${f(px)}" cy="${f(py)}" r="4.3"/>`;
  }).join('')).join('');
  return `<ellipse class="lff-ceye-o" cx="${cx}" cy="${cy}" rx="${f(R * 3.05)}" ry="${f(R * 2.85)}"/>
    ${hexes.map(h => `<path class="lff-facet" d="${hexD(h)}"/>`).join('')}${ds}`;
}

/** The fruit tree up close: leaves all over, ripe fruit among them. */
function crownView(): string {
  const r = rng(21);
  const greens = ['#6f9f50', '#5a8a3e', '#7cab5a', '#638f46', '#4f7d3a', '#86b064'];
  const lv = (n: number): string => Array.from({ length: n }, () =>
    `<path class="lff-vl" fill="${greens[Math.floor(r() * greens.length)]}" d="${leafD(40 + r() * 18, 12 + r() * 4)}" transform="translate(${f(-20 + r() * (PW + 40))} ${f(-20 + r() * (PH + 40))}) rotate(${f(r() * 360)})"/>`).join('');
  const FR: Pt[] = [[66, 72], [148, 168], [214, 66], [282, 146], [342, 78], [96, 214], [316, 222], [226, 236], [40, 150]];
  const fruit = FR.map(([x, y]) => `<path class="lff-vstalk" d="M${x},${y - 15} l2,-11"/><circle class="lff-vfruit" cx="${x}" cy="${y}" r="16"/><circle class="lff-fruit-hi" cx="${x - 5}" cy="${y - 6}" r="3.6"/>`).join('');
  return `<rect width="${PW}" height="${PH}" fill="#4f7d3a"/>${lv(110)}${fruit}${lv(16)}`;
}

/** The flowers up close: a yellow daisy and a small red flower, as we see them or as a bee does. */
function flowerView(beeView: boolean): string {
  const fx = 158, fy = 118, fr = 92, rx = 322, ry = 182;
  const yel = beeView ? `fill:url(#${P}-bull);stroke:#5b3f86` : '';
  return `<rect class="lff-vbg" width="${PW}" height="${PH}"/>
    <path class="lff-vstem" d="M${fx},${fy + 20}C${fx - 6},${fy + 80} ${fx + 10},${fy + 120} ${fx + 2},${PH + 10}"/>
    <path class="lff-vstem" d="M${rx},${ry}C${rx + 4},${ry + 40} ${rx - 6},${ry + 60} ${rx - 2},${PH + 10}"/>
    <path class="lff-vsleaf" d="${leafD(70, 18)}" transform="translate(${fx + 40} ${PH - 30}) rotate(-28)"/>
    <path class="lff-vsleaf" d="${leafD(60, 16)}" transform="translate(${fx - 36} ${PH - 18}) rotate(205)"/>
    <g transform="translate(${rx} ${ry})">${redFlower(36, beeView ? 'lff-rpetal-bee' : 'lff-rpetal', beeView ? 'lff-rdisk-bee' : 'lff-rdisk')}</g>
    <g transform="translate(${fx} ${fy})">${petals(fr, 14, 4, 'lff-petal lff-vpetal', yel)}<circle class="${beeView ? 'lff-disk-bee' : 'lff-disk'}" r="27"/></g>`;
}

/* ---------- the leaf up close (plants) ---------- */

const LW = 780, LH = 440;
const LEAFP: Pt = [752, 176];
const LEAF_C: Pt = [420, 262], LEAF_LEN = 500, LEAF_WID = 236, LEAF_ROT = -12;
/** Chloroplasts in the blade, in the leaf's own frame (x along the midrib). */
const CHLORO: Pt[] = (() => {
  const r = rng(5), out: Pt[] = [];
  while (out.length < 26) {
    const x = (r() - 0.5) * LEAF_LEN * 0.82, y = (r() - 0.5) * LEAF_WID * 0.95;
    const h = LEAF_LEN / 2, half = (LEAF_WID / 2) * 0.86 * Math.sin(Math.PI * clamp((x + h) / (2 * h))) ** 0.8;
    if (Math.abs(y) < 10 || Math.abs(y) > half - 12) continue;
    if (out.some(p => Math.hypot(p[0] - x, p[1] - y) < 40)) continue;
    out.push([x, y]);
  }
  return out;
})();
const leafPt = (p: Pt): Pt => {
  const a = (LEAF_ROT * Math.PI) / 180;
  return [LEAF_C[0] + p[0] * Math.cos(a) - p[1] * Math.sin(a), LEAF_C[1] + p[0] * Math.sin(a) + p[1] * Math.cos(a)];
};
/** The chloroplasts that blue, green and red light land on. */
const HIT = (() => {
  const pts = CHLORO.map(leafPt);
  const near = (x: number, y: number): Pt => pts.reduce((b, p) => (Math.hypot(p[0] - x, p[1] - y) < Math.hypot(b[0] - x, b[1] - y) ? p : b));
  return { b: near(285, 210), r: near(405, 186), g: near(525, 166) };
})();
const LIN: Pt = [-215, -150];
/** Where the crown's big leaf sits on the stage once the camera has zoomed to it (the plants framing). */
const LEAF_ST: Pt = (() => {
  const k = KEYS[4], w: Pt = [TREE_X + TREE_S * (LEAF_B[0] - 1330), CROWN_Y + TREE_S * (LEAF_B[1] - 258)];
  return [k.px + k.s * (w[0] - k.cx), k.py + k.s * (w[1] - k.cy)];
})();
/** The chloroplast that the "chlorophyll" label points at, low on the blade. */
const CHL_T: Pt = CHLORO.map(leafPt).reduce((b, p) => (Math.hypot(p[0] - 520, p[1] - 340) < Math.hypot(b[0] - 520, b[1] - 340) ? p : b));

/* ---------- the stage ---------- */

/** Viénot, Brettel & Mollon 1999: a deuteranope's view, as one matrix on linear RGB. */
const DEUT = [[0.29275, 0.70725, 0], [0.29275, 0.70725, 0], [-0.02234, 0.02234, 1]];
/** The two-cell view (k = 1: as most mammals see it). */
const deut = (k: number): string => DEUT.map((r, i) => `${r.map((v, j) => lerp(i === j ? 1 : 0, v, k).toFixed(4)).join(' ')} 0 0`).join(' ') + ' 0 0 0 1 0';
const diag = (k: readonly number[]): string => `${k[0].toFixed(4)} 0 0 0 0 0 ${k[1].toFixed(4)} 0 0 0 0 0 ${k[2].toFixed(4)} 0 0 0 0 0 1 0`;
const RIB_N = 140;

const SEA_WAVES = [
  { key: 'r', nm: 650, a: 0.34, x: 690, col: '#c8361e' },
  { key: 'bg', nm: 490, a: 0.015, x: 728, col: '#1b84ad' },
];
const WAVE_TOP = 258;
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

function panel(cls: string, content: string): string {
  return `<g class="lff-pan${cls ? ` ${cls}` : ''}"><rect class="lff-card" width="${PW}" height="${PH}" rx="${PR}" filter="url(#${P}-sh)"/>
    <g clip-path="url(#${P}-pclip)">${content}</g><rect class="lff-frame" width="${PW}" height="${PH}" rx="${PR}"/></g>`;
}

function svg(): string {
  const crown = crownView();
  const waterStops = [0, 0.1, 0.3, 1, 2, 4, 7, 10, 15, 20, 30, 45, 65, 100, 140].map(d =>
    `<stop offset="${(((yAt(d) - YS) / (700 - YS)) * 100).toFixed(2)}%" stop-color="${rgb(waterAt(d))}"/>`).join('');
  const floorStops = Array.from({ length: 22 }, (_, i) => `<stop offset="${((i / 21) * 100).toFixed(1)}%" stop-color="${rgb(SAND)}"/>`).join('');
  const ribStops = Array.from({ length: RIB_N / 2 + 1 }, (_, i) => `<stop offset="${((i / (RIB_N / 2)) * 100).toFixed(2)}%"/>`).join('');
  const rowGrads = ROWS.map((r, k) => {
    const stops = Array.from({ length: 113 }, (_, i) => {
      const nm = NM0 + ((NM1 - NM0) * i) / 112;
      return `<stop offset="${((i / 112) * 100).toFixed(2)}%" stop-color="${rgb(full(nm))}" stop-opacity="${r.w(nm).toFixed(3)}"/>`;
    }).join('');
    return `<linearGradient id="${P}-row${k}" gradientUnits="userSpaceOnUse" x1="${AX0}" y1="0" x2="${AX1}" y2="0">${stops}</linearGradient>`;
  }).join('');
  const waveGrads = SEA_WAVES.map(w => `<linearGradient id="${P}-wf-${w.key}" gradientUnits="userSpaceOnUse" x1="0" y1="${WAVE_TOP}" x2="0" y2="700">${fadeStops(w.a, w.col, 1)}</linearGradient>
      <linearGradient id="${P}-wh-${w.key}" gradientUnits="userSpaceOnUse" x1="0" y1="${WAVE_TOP}" x2="0" y2="700">${fadeStops(w.a, '#fffdf8', 0.7)}</linearGradient>`).join('');

  const world = `
      <path class="lff-ground" mask="url(#${P}-soilm)" d="${GROUND_D}"/>
      <path fill="url(#${P}-water)" d="${WATER_D}"/>
      <path class="lff-floor" stroke="url(#${P}-floorg)" d="${smooth(FLOOR)}"/>
      <path class="lff-beach" d="${smooth(SHORE.slice(SHORE_I, SHORE_I + 3))}"/>
      <path class="lff-turf" d="${smooth(LAND.slice(2))}"/>
      ${STARS.map((s, i) => `<g filter="url(#${P}-d${i})"><g transform="translate(${f(s.x)} ${f(s.y)}) rotate(${s.rot})">${star(15)}</g></g>`).join('')}
      <path class="lff-surf" d="M-240,${YS}H${SHORE[SHORE_I][0]}"/>
      <path class="lff-grass" d="${grass()}"/>
      ${tree()}
      ${sceneFlowers()}
      <g class="lff-subj"><g filter="url(#${P}-dc)"><g class="lff-crea">
        <path class="lff-body"/>
        <g class="lff-mface" opacity="0">
          <circle class="lff-ear" cx="3" cy="-94" r="7.5"/><circle class="lff-ear-in" cx="3" cy="-94" r="4"/>
          <ellipse class="lff-facedisk" cx="27" cy="-91" rx="13" ry="14"/>
          <ellipse class="lff-muzzle" cx="31" cy="-82" rx="9" ry="6.5"/>
          <path class="lff-mouth" d="M27,-79Q31,-77 35,-79M30,-85l1.5,0"/>
          <circle class="lff-ceye" cx="32" cy="-93" r="3.6"/><circle class="lff-cpupil" cx="32" cy="-93" r="2"/>
        </g>
        <circle class="lff-ceye lff-ceye-m" r="4.6"/><circle class="lff-cpupil lff-ceye-m" r="2.4"/>
      </g></g></g>
      <g class="lff-bee" opacity="0">${bee()}</g>
      <g class="lff-a1">
        <g clip-path="url(#${P}-wclip)">
          ${SEA_WAVES.map(w => {
            const d = waveD(w.x, WAVE_TOP, w.x, seaWaveEnd(w.a) + 6, w.nm);
            return `<path class="lff-whalo" stroke="url(#${P}-wh-${w.key})" d="${d}"/><path class="lff-wave" stroke="url(#${P}-wf-${w.key})" d="${d}"/>`;
          }).join('')}
        </g>
      </g>
      <g class="lff-a1l" opacity="0">${T(SEA_WAVES[0].x - 16, WAVE_TOP + 46, 'red light', 'lff-wlab', 'end')}${T(SEA_WAVES[1].x + 16, WAVE_TOP + 46, 'blue-green light', 'lff-wlab')}</g>`;

  // The leaf up close: blue, green and red arrive; the chlorophyll that catches blue and red glows.
  const leafView = (() => {
    const at = (p: Pt): Pt => [p[0] + LIN[0], p[1] + LIN[1]];
    const wv = (c: 'b' | 'g' | 'r', nm: number): string => {
      const s = at(HIT[c]);
      return `<path class="lff-lw f2-w f2-w${c}" pathLength="1" d="${waveD(s[0], s[1], HIT[c][0] - 4, HIT[c][1] - 3, nm, 5.5)}"/>`;
    };
    const g = HIT.g, gout: Pt = [g[0] + 180, g[1] - 140];
    return `<rect class="lff-vbg" width="${LW}" height="${LH}"/>
      ${leaf(LEAF_C[0], LEAF_C[1], LEAF_LEN, LEAF_WID, LEAF_ROT)}
      ${CHLORO.map(p => { const [x, y] = leafPt(p); return `<ellipse class="lff-chl" cx="${f(x)}" cy="${f(y)}" rx="8" ry="5.5" transform="rotate(${LEAF_ROT + 20} ${f(x)} ${f(y)})"/>`; }).join('')}
      ${wv('b', 450)}${wv('g', 550)}${wv('r', 650)}
      <path class="lff-lw lff-lw-out f2-w f2-wg" pathLength="1" d="${waveD(g[0] + 6, g[1] - 6, gout[0], gout[1], 550, 5.5, 1.2)}"/>
      <g class="lff-lg" opacity="0">${glow(P, HIT.b[0], HIT.b[1], 32)}</g>
      <g class="lff-lg" opacity="0">${glow(P, HIT.g[0], HIT.g[1], 14)}</g>
      <g class="lff-lg" opacity="0">${glow(P, HIT.r[0], HIT.r[1], 32)}</g>
      <g class="lff-chl-lab" opacity="0"><path class="lff-lead" d="M${f(CHL_T[0] + 7)},${f(CHL_T[1] + 7)}L${f(CHL_T[0] + 34)},${f(CHL_T[1] + 52)}"/>${T(CHL_T[0] + 22, CHL_T[1] + 80, 'chlorophyll', 'lff-lab')}</g>`;
  })();

  return `${defs(P)}<defs>
    <clipPath id="${P}-win"><rect x="60" y="120" width="1480" height="570" rx="18"/></clipPath>
    <clipPath id="${P}-abdc"><ellipse cx="-15" cy="2" rx="18" ry="12"/></clipPath>
    <clipPath id="${P}-pclip"><rect width="${PW}" height="${PH}" rx="${PR}"/></clipPath>
    <clipPath id="${P}-lclip"><rect width="${LW}" height="${LH}" rx="${PR}"/></clipPath>
    <linearGradient id="${P}-water" gradientUnits="userSpaceOnUse" x1="0" y1="${YS}" x2="0" y2="700">${waterStops}</linearGradient>
    <linearGradient id="${P}-floorg" gradientUnits="userSpaceOnUse" x1="0" y1="${YS}" x2="0" y2="700">${floorStops}</linearGradient>
    <linearGradient id="${P}-rib" gradientUnits="userSpaceOnUse" x1="${RX0}" y1="0" x2="${RX1}" y2="0">${ribStops}</linearGradient>
    ${rowGrads}${waveGrads}
    <radialGradient id="${P}-bull" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="92">
      <stop offset="0" stop-color="#5e5a26"/><stop offset=".5" stop-color="#6d6a2c"/><stop offset=".6" stop-color="#9a6fe0"/><stop offset="1" stop-color="#c3a6f4"/>
    </radialGradient>
    <linearGradient id="${P}-soilv" gradientUnits="userSpaceOnUse" x1="0" y1="390" x2="0" y2="560"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <linearGradient id="${P}-soilh" gradientUnits="userSpaceOnUse" x1="1020" y1="0" x2="1220" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <mask id="${P}-soilm" maskUnits="userSpaceOnUse" x="-400" y="300" width="2800" height="700" style="mask-type:alpha">
      <rect x="-400" y="300" width="2800" height="700" fill="url(#${P}-soilv)"/><rect x="-400" y="300" width="2800" height="700" fill="url(#${P}-soilh)"/>
    </mask>
    <linearGradient id="${P}-spotg" gradientUnits="userSpaceOnUse" x1="1250" y1="0" x2="1450" y2="0">
      <stop class="lff-spot-in" offset="0" stop-color="#000"/><stop class="lff-spot-out" offset="1" stop-color="#000"/>
    </linearGradient>
    <mask id="${P}-spot" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="740" style="mask-type:alpha">
      <rect x="0" y="0" width="1600" height="740" fill="url(#${P}-spotg)"/>
    </mask>
    <linearGradient id="${P}-vfg" gradientUnits="userSpaceOnUse" x1="0" y1="120" x2="0" y2="690">
      <stop class="lff-vf-top" offset="0" stop-color="#000"/><stop offset="${((210 - 120) / 570).toFixed(3)}" stop-color="#000"/>
      <stop offset="${((560 - 120) / 570).toFixed(3)}" stop-color="#000"/><stop class="lff-vf-bot" offset="1" stop-color="#000"/>
    </linearGradient>
    <mask id="${P}-vfade" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="740" style="mask-type:alpha">
      <rect x="0" y="0" width="1600" height="740" fill="url(#${P}-vfg)"/>
    </mask>
    <linearGradient id="${P}-lfg" gradientUnits="userSpaceOnUse" x1="60" y1="0" x2="200" y2="0">
      <stop class="lff-lf-edge" offset="0" stop-color="#000"/><stop offset="1" stop-color="#000"/>
    </linearGradient>
    <mask id="${P}-lfade" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="740" style="mask-type:alpha">
      <rect x="0" y="0" width="1600" height="740" fill="url(#${P}-lfg)"/>
    </mask>
    <filter id="${P}-dm" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" color-interpolation-filters="linearRGB">
      <feColorMatrix type="matrix" values="${deut(1)}"/></filter>
    ${['d0', 'd1', 'dc'].map(id => `<filter id="${P}-${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="linearRGB"><feColorMatrix class="lff-tm" type="matrix" values="${diag([1, 1, 1])}"/></filter>`).join('')}
    <clipPath id="${P}-wclip"><rect class="lff-wclip-r" x="0" y="${WAVE_TOP - 20}" width="1600" height="0"/></clipPath>
  </defs>

  <g class="lff-ribbon">
    ${T(X(340), 74, 'ultraviolet', 'lff-sec', 'middle')}${T(X(580), 74, 'visible', 'lff-sec', 'middle')}${T(X(820), 74, 'infrared', 'lff-sec', 'middle')}
    <path class="lff-sep" d="M${f(X(380))},56V82M${f(X(780))},56V82"/>
    <path class="lff-rib" fill="url(#${P}-rib)"/>
  </g>

  <g class="lff-rows">
    <g class="lff-axis" opacity="0">
      ${T(XA(340), SEC_Y, 'ultraviolet', 'lff-sec', 'middle')}${T(XA(580), SEC_Y, 'visible', 'lff-sec', 'middle')}${T(XA(820), SEC_Y, 'infrared', 'lff-sec', 'middle')}
      <path class="lff-guide" d="M${f(XA(380))},${SEC_Y - 22}V${AXIS_Y}M${f(XA(780))},${SEC_Y - 22}V${AXIS_Y}"/>
      <path class="lff-axline" d="M${AX0},${AXIS_Y}H${AX1 + 22}"/><path class="lff-axhead" d="M${AX1 + 34},${AXIS_Y}l-14,-7v14z"/>
      ${T((AX0 + AX1) / 2, AXIS_Y + 42, 'wavelength', 'lff-sec', 'middle')}
    </g>
    ${ROWS.map((r, k) => `<g class="lff-row" opacity="0">${T(AX0 - 26, r.y + 9, r.name, 'lff-rowlab', 'end')}
      <rect x="${AX0}" y="${r.y - ROW_H / 2}" width="${AX1 - AX0}" height="${ROW_H}" rx="${ROW_H / 2}" fill="url(#${P}-row${k})"/></g>`).join('')}
    <g class="lff-qm" opacity="0">${T(1150, ROWS[1].y + 44, '?', 'lff-q', 'middle')}</g>
    <g class="lff-ein" opacity="0" style="display:none"><g class="lff-ein-s">${clipping(P, CLIP_X, CLIP_Y, CLIP_W, EINSTEIN_TEASER, 3, 11)}</g></g>
  </g>

  <g clip-path="url(#${P}-win)"><g mask="url(#${P}-spot)"><g mask="url(#${P}-vfade)"><g mask="url(#${P}-lfade)"><g class="lff-cam">${world}</g></g></g></g></g>

  <g class="lff-col lff-col-mam" opacity="0" transform="translate(${SLOT_A[0]} ${SLOT_A[1]})">
    ${panel('', `<g filter="url(#${P}-dm)">${crown}</g>`)}
    ${T(PW / 2, LAB_Y, 'most mammals', 'lff-plab', 'middle')}
    <g class="lff-waves">${eyeWaves('', ['b', 'g', 'r'])}</g>
    ${camEye('mam', ['y', 'y', 'b', 'y', 'y', 'b'])}
    <g class="lff-cells" opacity="0"><path class="lff-lead" d="M${f(CELL_DOT[0])},${f(CELL_DOT[1] + 9)}L${f(CELL_DOT[0])},${f(NOTE_Y - 24)}"/>${T(PW / 2, NOTE_Y, 'light-sensitive cells', 'lff-note', 'middle')}</g>
  </g>
  <g class="lff-col lff-col-pri" opacity="0" transform="translate(${SLOT_B[0]} ${SLOT_B[1]})">
    ${panel('', crown)}
    ${T(PW / 2, LAB_Y, 'primates', 'lff-plab', 'middle')}
    <g class="lff-waves">${eyeWaves('', ['b', 'g', 'r'])}</g>
    ${camEye('pri', ['r', 'g', 'b', 'r', 'g', 'b'], ['y', 'y', 'b', 'y', 'y', 'b'])}
  </g>
  <g class="lff-col lff-col-us" opacity="0" transform="translate(${SLOT_A[0]} ${SLOT_A[1]})">
    ${panel('', flowerView(false))}
    ${T(PW / 2, LAB_Y, 'as we see it', 'lff-plab', 'middle')}
    <g class="lff-waves">${eyeWaves('', ['uv', 'b', 'g', 'r'])}</g>
    ${camEye('us', ['r', 'g', 'b', 'r', 'g', 'b'])}
  </g>
  <g class="lff-col lff-col-bee" opacity="0" transform="translate(${SLOT_B[0]} ${SLOT_B[1]})">
    ${panel('', `${flowerView(false)}<g class="lff-uvview" opacity="0">${flowerView(true)}</g>`)}
    ${T(PW / 2, LAB_Y, 'as a bee sees it', 'lff-plab', 'middle')}
    <g class="lff-waves">${eyeWaves('', ['uv', 'b', 'g', 'r'])}</g>
    ${beeEye('bee')}
    <g class="lff-uvl" opacity="0">${T(PW / 2, NOTE_Y, 'ultraviolet shown as purple', 'lff-note', 'middle')}</g>
  </g>
  <g class="lff-callout" opacity="0" style="display:none">
    <circle class="lff-co-halo" cx="${f(LEAF_ST[0])}" cy="${f(LEAF_ST[1])}" r="54"/><circle class="lff-co" cx="${f(LEAF_ST[0])}" cy="${f(LEAF_ST[1])}" r="54"/>
    <path class="lff-co-halo" d="M${f(LEAF_ST[0] + 54)},${f(LEAF_ST[1] - 4)}L${LEAFP[0]},${f(LEAFP[1] + LEAF_C[1])}"/>
    <path class="lff-co" d="M${f(LEAF_ST[0] + 54)},${f(LEAF_ST[1] - 4)}L${LEAFP[0]},${f(LEAFP[1] + LEAF_C[1])}"/>
  </g>
  <g class="lff-lcol" opacity="0" transform="translate(${LEAFP[0]} ${LEAFP[1]})">
    <rect class="lff-card" width="${LW}" height="${LH}" rx="${PR}" filter="url(#${P}-sh)"/>
    <g clip-path="url(#${P}-lclip)">${leafView}</g><rect class="lff-frame" width="${LW}" height="${LH}" rx="${PR}"/>
  </g>`;
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
  const draw = (el: Element, k: number): void => { op(el, k > 0.001 ? 1 : 0); set(el, 'stroke-dasharray', `${clamp(k).toFixed(4)} 2`); };
  const sub = (c: Element, s: string): SVGElement => c.querySelector(s) as SVGElement;
  const subs = (c: Element, s: string): SVGElement[] => Array.from(c.querySelectorAll<SVGElement>(s));

  const cam = q('.lff-cam');
  const spotG = q(`#${P}-spotg`), spotIn = q('.lff-spot-in'), spotOut = q('.lff-spot-out'), vfTop = q('.lff-vf-top'), vfBot = q('.lff-vf-bot'), lfEdge = q('.lff-lf-edge');
  const ribG = q('.lff-ribbon'), rib = q('.lff-rib'), ribStops = qa(`#${P}-rib stop`);
  const tm = qa('.lff-tm'), floorStops = qa(`#${P}-floorg stop`), wclip = q('.lff-wclip-r');
  const floorY = floorStops.map((_, i) => YS + ((700 - YS) * i) / (floorStops.length - 1));
  const a1 = q('.lff-a1'), a1l = q('.lff-a1l');
  const subjG = q('.lff-subj'), crea = q('.lff-crea'), cBody = q('.lff-body'), mface = q('.lff-mface');
  const ceye = q('.lff-ceye.lff-ceye-m'), cpupil = q('.lff-cpupil.lff-ceye-m');
  const beeG = q('.lff-bee'), wings = q('.lff-wings');
  const colMam = q('.lff-col-mam'), colPri = q('.lff-col-pri'), colUs = q('.lff-col-us'), colBee = q('.lff-col-bee'), lcol = q('.lff-lcol');
  const cells = q('.lff-cells'), uvView = q('.lff-uvview'), uvl = q('.lff-uvl');
  const lw = qa('.lff-lw'), lg = qa('.lff-lg'), chlLab = q('.lff-chl-lab'), callout = q('.lff-callout');
  const axis = q('.lff-axis'), rows = qa('.lff-row'), qm = q('.lff-qm'), ein = q('.lff-ein'), einS = sub(ein, '.lff-ein-s');

  /** An eye's dots: dim until light arrives (k), then full colour with an amber glow; s turns their first colours into
   *  their own (the primate eye's yellow-green cells becoming green and red ones). */
  function eyeLit(id: string, k: number, s = 1): void {
    qa(`.lff-dot-${id}`).forEach(d => {
      const c1 = hex(COL[(d.getAttribute('data-c') ?? 'b') as Dot]), c0 = hex(COL[(d.getAttribute('data-c0') ?? d.getAttribute('data-c') ?? 'b') as Dot]);
      const c = mix(c0, c1, s);
      set(d, 'fill', rgb(mix(mix(c, PAGE, 0.62), c, k)));
    });
    qa(`.lff-halo-${id}`).forEach(h => op(h, 0.9 * k));
  }

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

  /** The subject: its ground point, outline stage m (0 fish … 3 monkey), tilt, tail wiggle, and how visible it is. */
  const F0: Pt = [430, 604], F1: Pt = [1118, groundY(1118) + 2], F2: Pt = [1180, groundY(1180)];
  function subject(b: number, t: number): { x: number; y: number; rot: number; m: number; wig: number; ph: number; vis: number; sc?: number } {
    if (b === 0) {
      const k = outC((t - 1.8) / 2.4);
      return { x: lerp(-60, F0[0], k), y: F0[1], rot: 0, m: 0, wig: 2.8 * (1 - ramp(t, 4.0, 4.6)), ph: 7 * Math.min(t, 4.6), vis: 1 };
    }
    if (b === 1) {
      // swims to the water's edge, crawls out as a four-legged animal, walks on as a small mammal
      const ks = ramp(t, 0.1, 1.5), kc = ramp(t, 1.6, 2.6), kw = ramp(t, 2.6, 3.4);
      const swimY = lerp(F0[1], F1[1], ks) + 24 * Math.sin(Math.PI * ks);
      let x = lerp(F0[0], F1[0], ks), y = swimY;
      if (kc > 0) { x = kw > 0 ? lerp(F2[0], MAM_X, kw) : lerp(F1[0], F2[0], kc); y = groundY(x); }
      const rot = -8 * ramp(t, 0.1, 0.5) * (1 - ramp(t, 1.2, 1.6)) - 14 * ramp(t, 1.5, 1.7) * (1 - ramp(t, 2.4, 2.7));
      const walking = Math.min(ramp(t, 1.6, 1.7), 1 - ramp(t, 3.3, 3.4));
      return { x, y: y - 2 * walking * Math.abs(Math.sin(12 * t)), rot, m: ramp(t, 1.4, 2.1) + ramp(t, 2.4, 3.1), wig: 2.8 * Math.min(ramp(t, 0, 0.3), 1 - ramp(t, 1.2, 1.6)), ph: 7 * (4.6 + t), vis: 1 };
    }
    if (b === 2) {
      // walks to the fruit tree, then becomes the monkey
      const kw = ramp(t, 0.3, 1.6), x = lerp(MAM_X, MONKEY_X, kw), walking = Math.min(ramp(t, 0.3, 0.45), 1 - ramp(t, 1.45, 1.6));
      return { x, y: groundY(x) - 2 * walking * Math.abs(Math.sin(12 * t)), rot: 0, m: 2 + ramp(t, 1.8, 2.8), wig: 0, ph: 0, vis: 1 };
    }
    if (b === 3 || b === 4) {
      // A little naughty: one leap (0.8 s) up to the low branch, flipping over to hang upside down by its feet, then a
      // small swing that settles. The whole animal turns about its feet, so the face stays on. It hangs on in Plants
      // until the camera leaves the branch, then fades.
      const k = b === 3 ? ramp(t, 0.2, 1.0) : 1, g: Pt = [MONKEY_X, groundY(MONKEY_X)];
      const x = lerp(g[0], HANG[0], k), y = lerp(g[1], HANG[1], k) - 44 * Math.sin(Math.PI * k);
      const ts = b === 3 ? t - 1.0 : 9, swing = ts > 0 ? 16 * Math.exp(-3.2 * ts) * Math.sin((2 * Math.PI * ts) / 0.75) : 0;
      return { x, y, rot: 180 * k + swing, m: 3, wig: 0, ph: 0, vis: b === 3 ? 1 : 1 - ramp(t, 0.2, 0.5), sc: lerp(1, HANG_S, k) };
    }
    return { x: HANG[0], y: HANG[1], rot: 180, m: 3, wig: 0, ph: 0, vis: 0, sc: HANG_S };
  }

  return (beat: number, t: number): void => {
    const b = Math.max(0, Math.min(5, beat));
    /** 1 while beats on…off hold the thing; it fades in over [a, a+0.3] in beat `on` and out over the first 0.3 s of beat `off`. */
    const win = (on: number, a: number, off: number): number => (b < on || b > off ? 0 : b === on ? ramp(t, a, a + 0.3) : b === off ? 1 - ramp(t, 0, 0.3) : 1);
    /** A beat-local ramp that is 0 before beat `on` and 1 after it. */
    const at = (on: number, a: number, z: number): number => (b < on ? 0 : b === on ? ramp(t, a, z) : 1);

    // Camera: each beat zooms into its scene (the sea, the shore, the fruit tree, the flowers, a leaf).
    const camFrom = b === 0 ? K_WIDE : KEYS[b - 1], camK = b === 1 ? ramp(t, 0.3, 2.1) : b === 3 ? ramp(t, 1.2, 3.0) : b === 5 ? 1 : ramp(t, 0, 1.8);
    set(cam, 'transform', camT(camAt(camFrom, KEYS[b], camK)));

    // Beside the scene the windows need the right of the stage: there the scene fades softly to the paper (180 px).
    // In the last beat the scene fades away.
    const ALL = [1380, 1540, 1, 0], SIDE = [610, 790, 1, 0], GONE = [610, 790, 0, 0];
    const lerp4 = (a: number[], c: number[], k: number): number[] => a.map((v, i) => lerp(v, c[i], k));
    const sp = b === 0 ? ALL : b === 1 ? lerp4(ALL, SIDE, ramp(t, 0.9, 2.1))
      : b === 5 ? lerp4(SIDE, GONE, ramp(t, 0, 0.5)) : SIDE;
    set(spotG, 'x1', f(sp[0])); set(spotG, 'x2', f(sp[1]));
    set(spotIn, 'stop-opacity', sp[2].toFixed(3)); set(spotOut, 'stop-opacity', sp[3].toFixed(3));
    // Once the camera leaves the sea, close-ups of the tree and the flowers would be cut by the window's top, left and
    // bottom edges: there the scene fades softly to the paper instead.
    set(vfTop, 'stop-opacity', (1 - (b === 0 ? 0 : b === 1 ? ramp(t, 0, 0.3) : 1)).toFixed(3));
    set(lfEdge, 'stop-opacity', (1 - (b < 4 ? 0 : b === 4 ? ramp(t, 0, 1.8) : 1)).toFixed(3));
    set(vfBot, 'stop-opacity', (1 - (b < 4 ? 0 : b === 4 ? ramp(t, 0, 1.8) : 1)).toFixed(3));

    // Ribbon: the current subject's band; in the last beat the rows' own axis takes over.
    const RIB_T = [[1.6, 2.6], [0.4, 1.4], [0, 0.01], [3.0, 3.8], [1.6, 2.4], [0, 0.01]];
    const kr = ramp(t, RIB_T[b][0], RIB_T[b][1]), prev = b === 0 ? NONE : BEAT_W[b - 1], next = BEAT_W[b];
    ribbon(nm => lerp(prev(nm), next(nm), b === 5 ? 0 : kr));
    show(ribG, b === 5 ? 1 - ramp(t, 0, 0.3) : 1);

    // In the sea. The light goes down; things under water take the colour of the light that reaches their depth.
    const front = b === 0 ? lerp(WAVE_TOP - 24, 760, ramp(t, 1.6, 3.4)) : 760;
    set(wclip, 'height', f(Math.max(0, front - WAVE_TOP + 20)));
    const lit = (y: number): number => (b === 0 ? clamp((front - y) / 50) : 1);
    STARS.forEach((st, i) => set(tm[i], 'values', diag(trans(st.d).map(v => lerp(1, v, lit(st.y))))));
    floorStops.forEach((st, i) => set(st, 'stop-color', rgb(mix(SAND, tint(SAND, dAt(floorY[i])), lit(floorY[i])))));
    show(a1, b === 0 ? 1 : b === 1 ? 1 - ramp(t, 0, 0.3) : 0);
    show(a1l, win(0, 2.0, 1));

    // The subject: one animal, morphing along our lineage.
    const sj = subject(b, t), fm = formAt(sj.m, sj.wig, sj.ph);
    set(crea, 'transform', `translate(${f(sj.x)} ${f(sj.y)}) rotate(${f(sj.rot)}) scale(${(sj.sc ?? 1).toFixed(4)})`);
    set(cBody, 'd', fm.d); set(cBody, 'fill', fm.fill);
    for (const e of [ceye, cpupil]) { set(e, 'cx', f(fm.eye[0])); set(e, 'cy', f(fm.eye[1])); }
    // The monkey's face is drawn for the finished outline, so it appears only once the morph has nearly reached it;
    // earlier it would float beside the still-changing head.
    const kf = clamp((sj.m - 2.85) / 0.15);
    op(mface, kf);
    set(ceye, 'r', f(lerp(4.6, 3.6, kf))); set(cpupil, 'r', f(lerp(2.4, 2, kf)));
    show(subjG, sj.vis);
    const under = sj.y - 14 > YS && sj.x < SHORE[SHORE_I][0] + 4;
    set(tm[2], 'values', diag(under ? trans(dAt(sj.y - 14)) : [1, 1, 1]));

    // On land. The small mammal's view of the fruit tree (olive, as it sees it): light reaches its two kinds of cells.
    show(colMam, win(1, 3.4, 3));
    subs(colMam, '.lff-ew').forEach((el, i) => draw(el, at(1, 3.6 + 0.05 * i, 4.0 + 0.05 * i)));
    eyeLit('mam', at(1, 3.9, 4.1));
    op(cells, at(1, 4.2, 4.5));

    // Primates. Beside it, the primates' view (red fruit): light arrives, and the yellow-green cells become green and
    // red ones.
    show(colPri, win(2, 2.8, 3));
    subs(colPri, '.lff-ew').forEach((el, i) => draw(el, at(2, 3.0 + 0.05 * i, 3.4 + 0.05 * i)));
    const split = at(2, 3.5, 4.3);
    eyeLit('pri', at(2, 3.3, 3.5), split);

    // Bees. The bee flies in and lands. Ultraviolet reaches both eyes; only the bee's cells take it, and its view shows
    // the flower's ultraviolet pattern.
    const fly = at(3, 2.2, 3.4), land = at(3, 3.4, 3.7);
    const bx = land > 0 ? lerp(BEE1[0], BEE2[0], land) : lerp(BEE0[0], BEE1[0], fly);
    const by = land > 0 ? lerp(BEE1[1], BEE2[1], land) : lerp(BEE0[1], BEE1[1], fly) - 18 * Math.sin(Math.PI * fly);
    show(beeG, b < 3 ? 0 : b === 3 ? ramp(t, 2.2, 2.4) : 1);
    set(beeG, 'transform', `translate(${f(bx)} ${f(by)}) scale(${-BEE_S} ${BEE_S})`);
    set(wings, 'transform', `rotate(${f(b === 3 ? (1 - ramp(t, 3.5, 3.7)) * 14 * Math.sin(60 * t) : 0)} 0 -6)`);
    show(colUs, win(3, 3.5, 4));
    show(colBee, win(3, 3.5, 4));
    for (const c of [colUs, colBee]) subs(c, '.lff-ew').forEach((el, i) => draw(el, at(3, 3.7 + 0.05 * i, 4.1 + 0.05 * i)));
    eyeLit('us', at(3, 4.0, 4.2));
    eyeLit('bee', at(3, 4.0, 4.2));
    op(uvView, at(3, 4.2, 4.8));
    op(uvl, at(3, 4.6, 4.9));

    // Plants. The leaf: blue and red land on chlorophyll and it glows; green mostly comes back out.
    show(lcol, win(4, 1.9, 5));
    show(callout, win(4, 1.9, 5));
    const lin = [[2.3, 2.9], [2.4, 3.0], [2.5, 3.1], [3.2, 3.8]];
    lw.forEach((el, i) => draw(el, at(4, lin[i][0], lin[i][1])));
    const gl = [[2.9, 3.2], [3.0, 3.3], [3.1, 3.4]];
    lg.forEach((el, i) => op(el, at(4, gl[i][0], gl[i][1]) * (i === 1 ? 0.5 : 1)));
    op(chlLab, at(4, 3.6, 3.9));

    // So why? Each slice as a row on a labelled wavelength axis, the question, and Einstein as the teaser.
    op(axis, at(5, 0.1, 0.4));
    rows.forEach((el, k) => op(el, at(5, 0.4 + 0.6 * k, 0.7 + 0.6 * k)));
    op(qm, at(5, 2.3, 2.6));
    const ke = at(5, 2.9, 3.2);
    show(ein, ke);
    const es = 0.9 + 0.1 * outC(ke), ecx = CLIP_X + CLIP_W / 2, ecy = CLIP_Y + CLIP_H / 2;
    set(einS, 'transform', `translate(${f(ecx * (1 - es))} ${f(ecy * (1 - es))}) scale(${es.toFixed(4)})`);
    clipFx(stage, b === 5 ? ramp(t, 3.5, 3.7) : 0);
  };
}

export const STAGING: Staging = {
  id: 'f',
  name: 'F · Zoom to the scene',
  note: 'The camera zooms into each scene; two side-by-side windows with their eyes appear beside it.',
  svg,
  bind,
};
