// Animation 2 · "Who uses which light?", staging D · "Side by side". One journey on one shore: the early fish in the
// sea swims ashore and morphs along our lineage (four-legged animal, small mammal, monkey); a bee flies in as its own
// animal; then a leaf. Each contrast opens as two framed views side by side, each with the viewer's eye under it: the
// eye's light-sensitive cells are coloured dots that light up when light arrives. A thin spectrum ribbon on one linear
// wavelength axis runs across the top, showing the current subject's band; the last beat sets the bands as rows on it.
import './life-d.css';
import type { Staging } from './types';
import { enc, lin, spec } from '../../lib/colour';
import { T, defs, glow, leaf } from '../figs/s2';
import { EINSTEIN_TEASER, clipFx, clipHeight, clipping } from '../figs/clipping';

const P = 'lfd';
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

/* ---------- the camera: stage = s · world + (tx, ty) ---------- */

interface Cam { s: number; tx: number; ty: number }
const CAM1: Cam = { s: 1, tx: 0, ty: 0 };
const CAM2: Cam = { s: 1.5, tx: -1540, ty: 27.5 };

/* ---------- land: the fruit tree, the flowers ---------- */

const MONKEY: Pt = [1262, groundY(1262)];
const TREE_X = 1418, TREE_S = 0.56, CROWN_Y = 214;
/** B's crown, drawn around its centre (1330, 258) and placed at (TREE_X, CROWN_Y), scaled by TREE_S. */
const CROWN: Array<[number, number, number]> = [[1220, 286, 44], [1262, 244, 52], [1330, 228, 52], [1398, 244, 52], [1442, 286, 44], [1292, 290, 48], [1368, 292, 48]];
const FRUIT: Pt[] = [[1234, 308], [1268, 280], [1306, 318], [1342, 294], [1382, 320], [1418, 298], [1452, 306], [1300, 254], [1372, 262]];
/** A bigger leaf on the crown's left edge (B's coordinates). */
const LEAF_B: Pt = [1180, 280];

/** A pointed leaf shape of length l and width w along +x, centred on the origin. */
const leafD = (l: number, w: number): string => `M${f(-l / 2)},0Q${f(-l * 0.1)},${f(-w)} ${f(l / 2)},0Q${f(-l * 0.1)},${f(w)} ${f(-l / 2)},0Z`;

function tree(): string {
  const r = rng(7);
  const greens = ['#6f9f50', '#5a8a3e', '#7cab5a', '#638f46'];
  const leaves = Array.from({ length: 64 }, (_, i) => {
    const [cx, cy, cr] = CROWN[i % CROWN.length], a = r() * Math.PI * 2, rr = cr * Math.sqrt(r()) * 0.9;
    return `<path class="lfd-tl" fill="${greens[Math.floor(r() * greens.length)]}" d="${leafD(20 + r() * 7, 6 + r() * 2)}" transform="translate(${f(cx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))}) rotate(${f(r() * 360)})"/>`;
  }).join('');
  const fruit = FRUIT.map(([x, y]) => `<path class="lfd-stalk" d="M${x},${y - 9} l1,-6"/><circle class="lfd-fruit" cx="${x}" cy="${y}" r="9.5"/><circle class="lfd-fruit-hi" cx="${x - 3}" cy="${y - 3.5}" r="2.6"/>`).join('');
  const top = CROWN_Y + TREE_S * 50, x = TREE_X;
  return `<path class="lfd-trunk" d="M${x - 11},377C${x - 6},${f(top + 80)} ${x - 5},${f(top + 30)} ${x - 6},${f(top)}L${x + 6},${f(top)}C${x + 5},${f(top + 30)} ${x + 6},${f(top + 80)} ${x + 11},377Z"/>
    <g transform="translate(${TREE_X} ${CROWN_Y}) scale(${TREE_S}) translate(-1330 -258)">
    <path class="lfd-branch" d="M1322,318C1304,300 1284,292 1262,282M1338,316C1358,300 1380,292 1402,284M1330,310L1330,262"/>
    ${CROWN.map(([x, y, c]) => `<circle class="lfd-crown-o" cx="${x}" cy="${y}" r="${c}"/>`).join('')}
    ${CROWN.map(([x, y, c]) => `<circle class="lfd-crown" cx="${x}" cy="${y}" r="${c}"/>`).join('')}
    ${leaves}${fruit}
    <path class="lfd-tl lfd-tl-big" d="${leafD(34, 9)}" transform="translate(${LEAF_B[0]} ${LEAF_B[1]}) rotate(196)"/>
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
const FLOWER: Pt = [1346, 318], FLOWER_R = 19;
const FLOWER2: Pt = [1325, 338];
const RED: Pt = [1369, 343];
function sceneFlowers(): string {
  const stem = (x: number, y: number, bend: number): string => `<path class="lfd-stem" d="M${x},${y + 4}Q${x + bend},${f((y + 375) / 2)} ${x},375"/>`;
  return `${stem(FLOWER2[0], FLOWER2[1], 4)}${stem(RED[0], RED[1], -3)}${stem(FLOWER[0], FLOWER[1], -4)}
    <path class="lfd-sleaf" d="${leafD(22, 6)}" transform="translate(${FLOWER[0] + 10} 356) rotate(-30)"/>
    <path class="lfd-sleaf" d="${leafD(20, 6)}" transform="translate(${FLOWER2[0] - 9} 360) rotate(210)"/>
    <g transform="translate(${FLOWER2[0]} ${FLOWER2[1]})">${petals(14, 11, 6, 'lfd-petal')}<circle class="lfd-disk" r="4.5"/></g>
    <g transform="translate(${RED[0]} ${RED[1]})">${redFlower(12, 'lfd-rpetal', 'lfd-rdisk')}</g>
    <g transform="translate(${FLOWER[0]} ${FLOWER[1]})">${petals(FLOWER_R, 12, 0, 'lfd-petal')}<circle class="lfd-disk" r="6"/></g>`;
}

/** Grass tufts along the land. */
const grass = (): string => Array.from({ length: 22 }, (_, i) => {
  const x = 1236 + i * 34 + (i % 3) * 5;
  if ([FLOWER[0], FLOWER2[0], RED[0], TREE_X, MONKEY[0]].some(v => Math.abs(v - x) < 14)) return '';
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
  return `<path class="lfd-star" d="M${pts.map(p => `${f(p[0])},${f(p[1])}`).join('L')}Z"/>`;
}

/* ---------- the subject: one animal that morphs along our lineage ---------- */

interface Limb { a: Pt; b: Pt; c: Pt; w: number }
interface Form {
  sp: Pt[]; top: number[]; bot: number[]; fin: number[]; vfin: number[];
  limbs: Limb[]; eye: Pt; eyeR: number; ear: Pt; earR: number; muz: Pt; muzR: number; muzO: number; marks: number;
  fill: RGB; line: RGB;
}
/** Spine landmarks sit at fixed fractions: snout, face, back of head, neck, shoulders, back, hips, tail base, tail, tail tip. */
const U = [0, 0.06, 0.13, 0.2, 0.3, 0.42, 0.52, 0.6, 0.72, 0.86, 1];
const SEG = 5;
const NS = (U.length - 1) * SEG + 1;
const US = Array.from({ length: NS }, (_, i) => { const j = Math.min(U.length - 2, Math.floor(i / SEG)), k = (i - j * SEG) / SEG; return lerp(U[j], U[j + 1], k); });
/** The sample nearest to fraction u of the body. */
const idx = (u: number): number => US.reduce((bi, v, i) => (Math.abs(v - u) < Math.abs(US[bi] - u) ? i : bi), 0);
const limb = (a: Pt, b: Pt, c: Pt, w: number): Limb => ({ a, b, c, w });
const flat = (p: Pt): Limb => limb(p, p, p, 0);

/** An early jawless fish (after Haikouichthys): no paired fins, a fin fold along the back and belly, a simple eye. */
const FISH: Form = {
  sp: U.map(u => [75 - 150 * u, -16] as Pt),
  top: [1.2, 10.6, 15, 13.8, 12.2, 10.2, 8.5, 7.2, 5.2, 2.7, 0.3],
  bot: [1.2, 10.6, 15, 13.8, 12.2, 10.2, 8.5, 7.2, 5.2, 2.7, 0.3],
  fin: [0, 0, 0, 0, 0, 6.3, 9.4, 10.7, 10.7, 7.8, 1.6],
  vfin: [0, 0, 0, 0, 0, 0, 0, 1, 5.9, 6.4, 1],
  limbs: [flat([42, -10]), flat([-4, -10]), flat([38, -10]), flat([-8, -10])],
  eye: [65.3, -18.5], eyeR: 4.4, ear: [48, -24], earR: 0, muz: [66, -16], muzR: 0, muzO: 0, marks: 1,
  fill: [216, 207, 184], line: [95, 90, 80],
};
/** An early four-legged animal (after Acanthostega): flat head, short sprawling legs, a finned tail. */
const TETRA: Form = {
  sp: [[94, -13], [82, -16], [66, -18], [52, -19], [34, -20], [6, -21], [-20, -20], [-38, -19], [-60, -17], [-82, -15], [-102, -13]],
  top: [2, 7, 9, 9, 10, 11, 10, 7.5, 5.5, 3.5, 1],
  bot: [2, 5, 7, 7.5, 8.5, 9.5, 8.5, 6.5, 4.5, 3, 1],
  fin: [0, 0, 0, 0, 0, 0, 0, 3, 6, 6.5, 2],
  vfin: [0, 0, 0, 0, 0, 0, 0, 1, 4, 5, 1.5],
  limbs: [limb([38, -15], [48, -8], [56, 0], 6), limb([-14, -15], [-6, -8], [0, 0], 7), limb([32, -14], [40, -7], [48, 0], 6.5), limb([-20, -14], [-12, -7], [-6, 0], 7.5)],
  eye: [76, -26], eyeR: 4.2, ear: [52, -28], earR: 0, muz: [84, -16], muzR: 0, muzO: 0, marks: 0,
  fill: [179, 167, 124], line: [95, 90, 64],
};
/** A small early mammal: rounded body, pointed snout, round ear, legs under the body. */
const MAMMAL: Form = {
  sp: [[70, -31], [59, -37], [45, -42], [33, -42], [20, -41], [-2, -45], [-24, -41], [-34, -36], [-52, -28], [-72, -22], [-92, -20]],
  top: [1.5, 8, 12, 10, 13, 15, 14, 5, 3, 2.2, 1.2],
  bot: [1.5, 5, 9, 9, 12, 14, 12, 4, 2.6, 2, 1.2],
  fin: Array(11).fill(0), vfin: Array(11).fill(0),
  limbs: [limb([24, -32], [24, -16], [30, 0], 7), limb([-18, -32], [-8, -16], [-16, 0], 8), limb([18, -30], [17, -15], [22, 0], 7.5), limb([-24, -30], [-12, -16], [-22, 0], 9)],
  eye: [55, -41], eyeR: 3.8, ear: [40, -53], earR: 6.5, muz: [62, -34], muzR: 0, muzO: 0, marks: 0,
  fill: [160, 133, 102], line: [87, 68, 46],
};
/** A monkey sitting up, facing right, with its long tail on the ground. */
const MONK: Form = {
  sp: [[53, -110], [43, -120], [24, -122], [16, -105], [12, -90], [4, -64], [-4, -34], [-20, -15], [-52, -7], [-84, -12], [-96, -38]],
  top: [3, 17, 19, 13, 16, 20, 22, 5, 3.8, 3.2, 2.6],
  bot: [5, 13, 15, 12, 18, 21, 20, 5, 3.8, 3.2, 2.6],
  fin: Array(11).fill(0), vfin: Array(11).fill(0),
  limbs: [limb([20, -90], [34, -64], [48, -46], 9), limb([6, -30], [42, -38], [46, 0], 13), limb([16, -88], [26, -60], [40, -38], 10), limb([2, -28], [36, -40], [40, -1], 15)],
  eye: [45, -125], eyeR: 4, ear: [21, -120], earR: 8, muz: [49, -111], muzR: 11, muzO: 1, marks: 0,
  fill: [143, 107, 71], line: [79, 58, 36],
};
const FORMS = [FISH, TETRA, MAMMAL, MONK];

const lp = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const la = (a: number[], b: number[], k: number): number[] => a.map((v, i) => lerp(v, b[i], k));
function between(a: Form, b: Form, k: number): Form {
  return {
    sp: a.sp.map((p, i) => lp(p, b.sp[i], k)), top: la(a.top, b.top, k), bot: la(a.bot, b.bot, k), fin: la(a.fin, b.fin, k), vfin: la(a.vfin, b.vfin, k),
    limbs: a.limbs.map((l, i) => ({ a: lp(l.a, b.limbs[i].a, k), b: lp(l.b, b.limbs[i].b, k), c: lp(l.c, b.limbs[i].c, k), w: lerp(l.w, b.limbs[i].w, k) })),
    eye: lp(a.eye, b.eye, k), eyeR: lerp(a.eyeR, b.eyeR, k), ear: lp(a.ear, b.ear, k), earR: lerp(a.earR, b.earR, k),
    muz: lp(a.muz, b.muz, k), muzR: lerp(a.muzR, b.muzR, k), muzO: lerp(a.muzO, b.muzO, k), marks: lerp(a.marks, b.marks, k),
    fill: mix(a.fill, b.fill, k), line: mix(a.line, b.line, k),
  };
}
/** The form at morph stage m: 0 fish, 1 four-legged animal, 2 small mammal, 3 monkey. */
function formAt(m: number): Form {
  const i = Math.min(2, Math.floor(clamp(m, 0, 3)));
  return between(FORMS[i], FORMS[i + 1], clamp(m - i));
}
/** Catmull–Rom through landmark values, five samples per segment, so each sample keeps its place in the body. */
function sampleN(v: number[]): number[] {
  const out: number[] = [];
  for (let j = 0; j < v.length - 1; j++) {
    const p0 = v[j - 1] ?? v[j], p1 = v[j], p2 = v[j + 1], p3 = v[j + 2] ?? p2;
    for (let k = 0; k < SEG; k++) {
      const s = k / SEG, s2 = s * s, s3 = s2 * s;
      out.push(0.5 * (2 * p1 + (-p0 + p2) * s + (2 * p0 - 5 * p1 + 4 * p2 - p3) * s2 + (-p0 + 3 * p1 - 3 * p2 + p3) * s3));
    }
  }
  out.push(v[v.length - 1]);
  return out;
}

interface Pose { ph: number; amp: number; walk: number; wph: number; pitch: number }
interface Critter { far: string; fins: string; body: string; nearH: string; nearF: string; marks: string; ear: Pt; earR: number; muz: Pt; muzR: number; eye: Pt; eyeR: number }

function critter(F: Form, o: Pose): Critter {
  const xs = sampleN(F.sp.map(p => p[0])), ys = sampleN(F.sp.map(p => p[1]));
  const top = sampleN(F.top).map(v => Math.max(0, v)), bot = sampleN(F.bot).map(v => Math.max(0, v));
  const fin = sampleN(F.fin).map(v => Math.max(0, v)), vfin = sampleN(F.vfin).map(v => Math.max(0, v));
  // The head turns about the neck (the monkey looks down at the flowers).
  const piv: Pt = [xs[3 * SEG], ys[3 * SEG]], pa = (o.pitch * Math.PI) / 180;
  const rot = (p: Pt, w: number): Pt => {
    const c = Math.cos(pa * w), s = Math.sin(pa * w), dx = p[0] - piv[0], dy = p[1] - piv[1];
    return [piv[0] + dx * c - dy * s, piv[1] + dx * s + dy * c];
  };
  const hw = (u: number): number => clamp((0.2 - u) / 0.07);
  const pts: Pt[] = xs.map((x, i) => rot([x, ys[i]], hw(US[i])));
  const nrm: Pt[] = pts.map((_, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(NS - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    return [-dy / L, dx / L];
  });
  // The swimming fish bends its tail.
  pts.forEach((p, i) => {
    const u = US[i], w = o.amp * u * u * Math.sin(2 * Math.PI * u * 0.9 - o.ph);
    p[0] += nrm[i][0] * w; p[1] += nrm[i][1] * w;
  });
  const off = (i: number, d: number): Pt => [pts[i][0] + nrm[i][0] * d, pts[i][1] + nrm[i][1] * d];
  const up = pts.map((_, i) => off(i, top[i])), lo = pts.map((_, i) => off(i, -bot[i]));
  const body = `${smooth(up)}L${f(lo[NS - 1][0])},${f(lo[NS - 1][1])}${curve([...lo].reverse())}Z`;
  const finUp = pts.map((_, i) => off(i, top[i] + fin[i])), finLo = pts.map((_, i) => off(i, -bot[i] - vfin[i]));
  const fins = `${smooth(finUp)}L${f(up[NS - 1][0])},${f(up[NS - 1][1])}${curve([...up].reverse())}Z${smooth(finLo)}L${f(lo[NS - 1][0])},${f(lo[NS - 1][1])}${curve([...lo].reverse())}Z`;
  // Legs: a diagonal gait while walking.
  const legs = F.limbs.map((l, i) => {
    const s = Math.sin(o.wph + (i === 0 || i === 3 ? 0 : Math.PI)) * o.walk, lift = Math.max(0, Math.cos(o.wph + (i === 0 || i === 3 ? 0 : Math.PI))) * o.walk * 0.45;
    return { a: l.a, b: [l.b[0] + s * 0.5, l.b[1] - lift * 0.5] as Pt, c: [l.c[0] + s, l.c[1] - lift] as Pt, w: l.w };
  });
  const lpath = (l: { a: Pt; b: Pt; c: Pt }): string => `M${f(l.a[0])},${f(l.a[1])}L${f(l.b[0])},${f(l.b[1])}L${f(l.c[0])},${f(l.c[1])}`;
  const marks = [0.17, 0.2, 0.23, 0.26, 0.29].map(u => {
    const i = idx(u), h = top[i] * 0.7;
    const a = off(i, h * 0.5), b = off(i, -h * 0.5);
    return `M${f(a[0])},${f(a[1])}Q${f(a[0] - 2.2)},${f((a[1] + b[1]) / 2)} ${f(b[0])},${f(b[1])}`;
  }).join('') + [0.36, 0.43, 0.5, 0.57, 0.64, 0.71, 0.78].map(u => {
    const i = idx(u), h = top[i] * 0.72, a = off(i, h), c = off(i, -h);
    return `M${f(a[0] - 3)},${f(a[1])}L${f(pts[i][0] + 3)},${f(pts[i][1])}L${f(c[0] - 3)},${f(c[1])}`;
  }).join('');
  return {
    far: `${lpath(legs[0])}${lpath(legs[1])}`, fins, body, nearH: lpath(legs[3]), nearF: lpath(legs[2]), marks,
    ear: rot(F.ear, 1), earR: F.earR, muz: rot(F.muz, 1), muzR: F.muzR, eye: rot(F.eye, 1), eyeR: F.eyeR,
  };
}
/** Widths of the four legs, for the stroke widths. */
const legW = (F: Form): number[] => F.limbs.map(l => l.w);

/* ---------- the bee ---------- */

/** The bee, side view, facing right, centred on the origin. */
const bee = (): string => `
  <g class="lfd-wings"><ellipse class="lfd-wing" cx="-6" cy="-17" rx="18" ry="8" transform="rotate(-26 -6 -17)"/>
  <ellipse class="lfd-wing" cx="5" cy="-16" rx="14" ry="7" transform="rotate(-10 5 -16)"/></g>
  <path class="lfd-leg" d="M-2,8 l-5,12 M4,9 l0,13 M9,7 l6,11"/>
  <path class="lfd-sting" d="M-33,4 l-6,1"/>
  <ellipse class="lfd-abd" cx="-15" cy="2" rx="18" ry="12"/>
  <g clip-path="url(#${P}-abdc)"><path class="lfd-stripe" d="M-23,-12 q-4,14 0,28 M-12,-12 q-4,14 0,28 M-33,-12 q-4,14 0,28"/></g>
  <ellipse class="lfd-abd-o" cx="-15" cy="2" rx="18" ry="12"/>
  <circle class="lfd-thorax" cx="6" cy="0" r="10"/>
  <circle class="lfd-head" cx="19" cy="2" r="7.5"/>
  <path class="lfd-ant" d="M22,-4 q5,-9 13,-11 M19,-5 q3,-10 9,-14"/>`;
/** The bee: where it enters, where it hovers, where it lands on the big flower (world). */
const BEE0: Pt = [1070, 120], BEE1: Pt = [1330, 262], BEE2: Pt = [1350, 299];
const BEE_S = 0.8;

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
  return cols.map((c, i) => `<path class="lfd-ew${cls ? ` ${cls}` : ''}" pathLength="1" style="stroke:${COL[c]}" d="${waveD(x0 + i * gap, WY0, x0 + i * gap, WY1, NMOF[c], 4, 0.6 * i)}"/>`).join('');
}

/** Our kind of eye, cut through and looking up at the view above: cornea and lens on top, the retina below with its
 *  light-sensitive cells as coloured dots. */
function camEye(id: string, dots: Dot[], from: Dot[] = dots): string {
  const cx = PW / 2, cy = EYE_Y, r = ER, rr = r - 9;
  const at = (deg: number, d: number): Pt => [cx + Math.cos((deg * Math.PI) / 180) * d, cy + Math.sin((deg * Math.PI) / 180) * d];
  const c0 = at(-124, r), c1 = at(-56, r), i0 = at(-114, r), i1 = at(-66, r), a0 = at(12, r - 4), a1 = at(168, r - 4);
  const ds = dots.map((d, k) => {
    const [x, y] = at(22 + (136 * k) / (dots.length - 1), rr);
    return `<circle class="lfd-halo lfd-halo-${id}" cx="${f(x)}" cy="${f(y)}" r="15" fill="url(#${P}-glow)" opacity="0"/><circle class="lfd-dot lfd-dot-${id}" data-c="${d}" data-c0="${from[k]}" cx="${f(x)}" cy="${f(y)}" r="7.5"/>`;
  }).join('');
  return `<circle class="lfd-ball" cx="${cx}" cy="${cy}" r="${r}"/>
    <path class="lfd-cornea" d="M${f(c0[0])},${f(c0[1])}Q${cx},${cy - r - 16} ${f(c1[0])},${f(c1[1])}"/>
    <path class="lfd-retina" d="M${f(a0[0])},${f(a0[1])}A${r - 4},${r - 4} 0 0 1 ${f(a1[0])},${f(a1[1])}"/>
    <ellipse class="lfd-lens" cx="${cx}" cy="${cy - r + 17}" rx="17" ry="9"/>
    <path class="lfd-iris" d="M${f(i0[0])},${f(i0[1])}L${cx - 14},${f(cy - r + 7)}M${f(i1[0])},${f(i1[1])}L${cx + 14},${f(cy - r + 7)}"/>
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
    return `<circle class="lfd-halo lfd-halo-${id}" cx="${f(px)}" cy="${f(py)}" r="9" fill="url(#${P}-glow)" opacity="0"/><circle class="lfd-dot lfd-dot-${id}" data-c="${d}" cx="${f(px)}" cy="${f(py)}" r="4.3"/>`;
  }).join('')).join('');
  return `<ellipse class="lfd-ceye-o" cx="${cx}" cy="${cy}" rx="${f(R * 3.05)}" ry="${f(R * 2.85)}"/>
    ${hexes.map(h => `<path class="lfd-facet" d="${hexD(h)}"/>`).join('')}${ds}`;
}

/** The fruit tree up close: leaves all over, ripe fruit among them. */
function crownView(): string {
  const r = rng(21);
  const greens = ['#6f9f50', '#5a8a3e', '#7cab5a', '#638f46', '#4f7d3a', '#86b064'];
  const lv = (n: number): string => Array.from({ length: n }, () =>
    `<path class="lfd-vl" fill="${greens[Math.floor(r() * greens.length)]}" d="${leafD(40 + r() * 18, 12 + r() * 4)}" transform="translate(${f(-20 + r() * (PW + 40))} ${f(-20 + r() * (PH + 40))}) rotate(${f(r() * 360)})"/>`).join('');
  const FR: Pt[] = [[66, 72], [148, 168], [214, 66], [282, 146], [342, 78], [96, 214], [316, 222], [226, 236], [40, 150]];
  const fruit = FR.map(([x, y]) => `<path class="lfd-vstalk" d="M${x},${y - 15} l2,-11"/><circle class="lfd-vfruit" cx="${x}" cy="${y}" r="16"/><circle class="lfd-fruit-hi" cx="${x - 5}" cy="${y - 6}" r="3.6"/>`).join('');
  return `<rect width="${PW}" height="${PH}" fill="#4f7d3a"/>${lv(110)}${fruit}${lv(16)}`;
}

/** The flowers up close: a yellow daisy and a small red flower, as we see them or as a bee does. */
function flowerView(beeView: boolean): string {
  const fx = 158, fy = 118, fr = 92, rx = 322, ry = 182;
  const yel = beeView ? `fill:url(#${P}-bull);stroke:#5b3f86` : '';
  return `<rect class="lfd-vbg" width="${PW}" height="${PH}"/>
    <path class="lfd-vstem" d="M${fx},${fy + 20}C${fx - 6},${fy + 80} ${fx + 10},${fy + 120} ${fx + 2},${PH + 10}"/>
    <path class="lfd-vstem" d="M${rx},${ry}C${rx + 4},${ry + 40} ${rx - 6},${ry + 60} ${rx - 2},${PH + 10}"/>
    <path class="lfd-vsleaf" d="${leafD(70, 18)}" transform="translate(${fx + 40} ${PH - 30}) rotate(-28)"/>
    <path class="lfd-vsleaf" d="${leafD(60, 16)}" transform="translate(${fx - 36} ${PH - 18}) rotate(205)"/>
    <g transform="translate(${rx} ${ry})">${redFlower(36, beeView ? 'lfd-rpetal-bee' : 'lfd-rpetal', beeView ? 'lfd-rdisk-bee' : 'lfd-rdisk')}</g>
    <g transform="translate(${fx} ${fy})">${petals(fr, 14, 4, 'lfd-petal lfd-vpetal', yel)}<circle class="${beeView ? 'lfd-disk-bee' : 'lfd-disk'}" r="27"/></g>`;
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
/** The chloroplast that the "chlorophyll" label points at, low on the blade. */
const CHL_T: Pt = CHLORO.map(leafPt).reduce((b, p) => (Math.hypot(p[0] - 520, p[1] - 340) < Math.hypot(b[0] - 520, b[1] - 340) ? p : b));

/* ---------- the stage ---------- */

/** Viénot, Brettel & Mollon 1999: a deuteranope's view, as one matrix on linear RGB. */
const DEUT = [[0.29275, 0.70725, 0], [0.29275, 0.70725, 0], [-0.02234, 0.02234, 1]];
/** The two-cell view blended in by k (0: as it is, 1: as most mammals see it). */
const deut = (k: number): string => DEUT.map((r, i) => `${r.map((v, j) => lerp(i === j ? 1 : 0, v, k).toFixed(4)).join(' ')} 0 0`).join(' ') + ' 0 0 0 1 0';
const diag = (k: readonly number[]): string => `${k[0].toFixed(4)} 0 0 0 0 0 ${k[1].toFixed(4)} 0 0 0 0 0 ${k[2].toFixed(4)} 0 0 0 0 0 1 0`;
const RIB_N = 140;

const SEA_WAVES = [
  { key: 'r', nm: 650, a: 0.34, x: 690, col: '#c8361e' },
  { key: 'bg', nm: 490, a: 0.015, x: 728, col: '#1b84ad' },
];
const WAVE_TOP = 196;
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
  return `<g class="lfd-pan${cls ? ` ${cls}` : ''}"><rect class="lfd-card" width="${PW}" height="${PH}" rx="${PR}" filter="url(#${P}-sh)"/>
    <g clip-path="url(#${P}-pclip)">${content}</g><rect class="lfd-frame" width="${PW}" height="${PH}" rx="${PR}"/></g>`;
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
      <path class="lfd-ground" mask="url(#${P}-soilm)" d="${GROUND_D}"/>
      <path fill="url(#${P}-water)" d="${WATER_D}"/>
      <path class="lfd-floor" stroke="url(#${P}-floorg)" d="${smooth(FLOOR)}"/>
      <path class="lfd-beach" d="${smooth(SHORE.slice(SHORE_I, SHORE_I + 3))}"/>
      <path class="lfd-turf" d="${smooth(LAND.slice(2))}"/>
      ${STARS.map((s, i) => `<g filter="url(#${P}-d${i})"><g transform="translate(${f(s.x)} ${f(s.y)}) rotate(${s.rot})">${star(15)}</g></g>`).join('')}
      <path class="lfd-surf" d="M-240,${YS}H${SHORE[SHORE_I][0]}"/>
      <path class="lfd-grass" d="${grass()}"/>
      ${tree()}
      ${sceneFlowers()}
      <g filter="url(#${P}-dc)"><g class="lfd-crit">
        <path class="lfd-c-far-o"/><path class="lfd-c-far"/>
        <path class="lfd-c-fins"/><path class="lfd-c-body"/>
        <path class="lfd-c-marks"/>
        <path class="lfd-c-near-o lfd-c-nh-o"/><path class="lfd-c-near lfd-c-nh"/><path class="lfd-c-near-o lfd-c-nf-o"/><path class="lfd-c-near lfd-c-nf"/>
        <circle class="lfd-c-ear"/><ellipse class="lfd-c-muz"/>
        <circle class="lfd-c-eyew"/><circle class="lfd-c-eye"/>
      </g></g>
      <g class="lfd-bee" opacity="0">${bee()}</g>
      <g class="lfd-a1">
        <g clip-path="url(#${P}-wclip)">
          ${SEA_WAVES.map(w => {
            const d = waveD(w.x, WAVE_TOP, w.x, seaWaveEnd(w.a) + 6, w.nm);
            return `<path class="lfd-whalo" stroke="url(#${P}-wh-${w.key})" d="${d}"/><path class="lfd-wave" stroke="url(#${P}-wf-${w.key})" d="${d}"/>`;
          }).join('')}
        </g>
      </g>
      <g class="lfd-a1l" opacity="0">${T(SEA_WAVES[0].x - 20, WAVE_TOP + 58, 'red light', 'lfd-lab', 'end')}${T(SEA_WAVES[1].x + 20, WAVE_TOP + 58, 'blue-green light', 'lfd-lab')}</g>`;

  // The leaf up close: blue, green and red arrive; the chlorophyll that catches blue and red glows.
  const leafView = (() => {
    const at = (p: Pt): Pt => [p[0] + LIN[0], p[1] + LIN[1]];
    const wv = (c: 'b' | 'g' | 'r', nm: number): string => {
      const s = at(HIT[c]);
      return `<path class="lfd-lw f2-w f2-w${c}" pathLength="1" d="${waveD(s[0], s[1], HIT[c][0] - 4, HIT[c][1] - 3, nm, 5.5)}"/>`;
    };
    const g = HIT.g, gout: Pt = [g[0] + 180, g[1] - 140];
    return `<rect class="lfd-vbg" width="${LW}" height="${LH}"/>
      ${leaf(LEAF_C[0], LEAF_C[1], LEAF_LEN, LEAF_WID, LEAF_ROT)}
      ${CHLORO.map(p => { const [x, y] = leafPt(p); return `<ellipse class="lfd-chl" cx="${f(x)}" cy="${f(y)}" rx="8" ry="5.5" transform="rotate(${LEAF_ROT + 20} ${f(x)} ${f(y)})"/>`; }).join('')}
      ${wv('b', 450)}${wv('g', 550)}${wv('r', 650)}
      <path class="lfd-lw lfd-lw-out f2-w f2-wg" pathLength="1" d="${waveD(g[0] + 6, g[1] - 6, gout[0], gout[1], 550, 5.5, 1.2)}"/>
      <g class="lfd-lg" opacity="0">${glow(P, HIT.b[0], HIT.b[1], 32)}</g>
      <g class="lfd-lg" opacity="0">${glow(P, HIT.g[0], HIT.g[1], 14)}</g>
      <g class="lfd-lg" opacity="0">${glow(P, HIT.r[0], HIT.r[1], 32)}</g>
      <g class="lfd-chl-lab" opacity="0"><path class="lfd-lead" d="M${f(CHL_T[0] + 7)},${f(CHL_T[1] + 7)}L${f(CHL_T[0] + 34)},${f(CHL_T[1] + 52)}"/>${T(CHL_T[0] + 22, CHL_T[1] + 80, 'chlorophyll', 'lfd-lab')}</g>`;
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
      <stop class="lfd-spot-in" offset="0" stop-color="#000"/><stop class="lfd-spot-out" offset="1" stop-color="#000"/>
    </linearGradient>
    <mask id="${P}-spot" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="740" style="mask-type:alpha">
      <rect x="0" y="0" width="1600" height="740" fill="url(#${P}-spotg)"/>
    </mask>
    ${['dm', 'dp'].map(id => `<filter id="${P}-${id}" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" color-interpolation-filters="linearRGB">
      <feColorMatrix class="lfd-${id}" type="matrix" values="${deut(1)}"/></filter>`).join('')}
    ${['d0', 'd1', 'dc'].map(id => `<filter id="${P}-${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="linearRGB"><feColorMatrix class="lfd-tm" type="matrix" values="${diag([1, 1, 1])}"/></filter>`).join('')}
    <clipPath id="${P}-wclip"><rect class="lfd-wclip-r" x="0" y="${WAVE_TOP - 20}" width="1600" height="0"/></clipPath>
  </defs>

  <g class="lfd-ribbon">
    ${T(X(340), 74, 'ultraviolet', 'lfd-sec', 'middle')}${T(X(580), 74, 'visible', 'lfd-sec', 'middle')}${T(X(820), 74, 'infrared', 'lfd-sec', 'middle')}
    <path class="lfd-sep" d="M${f(X(380))},56V82M${f(X(780))},56V82"/>
    <path class="lfd-rib" fill="url(#${P}-rib)"/>
  </g>

  <g class="lfd-rows">
    <g class="lfd-axis" opacity="0">
      ${T(XA(340), SEC_Y, 'ultraviolet', 'lfd-sec', 'middle')}${T(XA(580), SEC_Y, 'visible', 'lfd-sec', 'middle')}${T(XA(820), SEC_Y, 'infrared', 'lfd-sec', 'middle')}
      <path class="lfd-guide" d="M${f(XA(380))},${SEC_Y - 22}V${AXIS_Y}M${f(XA(780))},${SEC_Y - 22}V${AXIS_Y}"/>
      <path class="lfd-axline" d="M${AX0},${AXIS_Y}H${AX1 + 22}"/><path class="lfd-axhead" d="M${AX1 + 34},${AXIS_Y}l-14,-7v14z"/>
      ${T((AX0 + AX1) / 2, AXIS_Y + 42, 'wavelength', 'lfd-sec', 'middle')}
    </g>
    ${ROWS.map((r, k) => `<g class="lfd-row" opacity="0">${T(AX0 - 26, r.y + 9, r.name, 'lfd-rowlab', 'end')}
      <rect x="${AX0}" y="${r.y - ROW_H / 2}" width="${AX1 - AX0}" height="${ROW_H}" rx="${ROW_H / 2}" fill="url(#${P}-row${k})"/></g>`).join('')}
    <g class="lfd-qm" opacity="0">${T(1150, ROWS[1].y + 44, '?', 'lfd-q', 'middle')}</g>
    <g class="lfd-ein" opacity="0" style="display:none"><g class="lfd-ein-s">${clipping(P, CLIP_X, CLIP_Y, CLIP_W, EINSTEIN_TEASER, 3, 11)}</g></g>
  </g>

  <g clip-path="url(#${P}-win)"><g mask="url(#${P}-spot)"><g class="lfd-cam">${world}</g></g></g>

  <g class="lfd-col lfd-col-mam" opacity="0" transform="translate(${SLOT_A[0]} ${SLOT_A[1]})">
    ${panel('', `<g filter="url(#${P}-dm)">${crown}</g>`)}
    ${T(PW / 2, LAB_Y, 'most mammals', 'lfd-plab', 'middle')}
    <g class="lfd-waves">${eyeWaves('', ['b', 'g', 'r'])}</g>
    ${camEye('mam', ['y', 'y', 'b', 'y', 'y', 'b'])}
    <g class="lfd-cells" opacity="0"><path class="lfd-lead" d="M${f(CELL_DOT[0])},${f(CELL_DOT[1] + 9)}L${f(CELL_DOT[0])},${f(NOTE_Y - 24)}"/>${T(PW / 2, NOTE_Y, 'light-sensitive cells', 'lfd-note', 'middle')}</g>
  </g>
  <g class="lfd-col lfd-col-pri" opacity="0" transform="translate(${SLOT_B[0]} ${SLOT_B[1]})">
    ${panel('', `<g filter="url(#${P}-dp)">${crown}</g>`)}
    ${T(PW / 2, LAB_Y, 'primates', 'lfd-plab', 'middle')}
    <g class="lfd-waves">${eyeWaves('', ['b', 'g', 'r'])}</g>
    ${camEye('pri', ['r', 'g', 'b', 'r', 'g', 'b'], ['y', 'y', 'b', 'y', 'y', 'b'])}
  </g>
  <g class="lfd-col lfd-col-us" opacity="0" transform="translate(${SLOT_A[0]} ${SLOT_A[1]})">
    ${panel('', flowerView(false))}
    ${T(PW / 2, LAB_Y, 'as we see it', 'lfd-plab', 'middle')}
    <g class="lfd-waves">${eyeWaves('', ['uv', 'b', 'g', 'r'])}</g>
    ${camEye('us', ['r', 'g', 'b', 'r', 'g', 'b'])}
  </g>
  <g class="lfd-col lfd-col-bee" opacity="0" transform="translate(${SLOT_B[0]} ${SLOT_B[1]})">
    ${panel('', `${flowerView(false)}<g class="lfd-uvview" opacity="0">${flowerView(true)}</g>`)}
    ${T(PW / 2, LAB_Y, 'as a bee sees it', 'lfd-plab', 'middle')}
    <g class="lfd-waves">${eyeWaves('', ['uv', 'b', 'g', 'r'])}</g>
    ${beeEye('bee')}
    <g class="lfd-uvl" opacity="0">${T(PW / 2, NOTE_Y, 'ultraviolet shown as purple', 'lfd-note', 'middle')}</g>
  </g>
  <g class="lfd-lcol" opacity="0" transform="translate(${LEAFP[0]} ${LEAFP[1]})">
    <rect class="lfd-card" width="${LW}" height="${LH}" rx="${PR}" filter="url(#${P}-sh)"/>
    <g clip-path="url(#${P}-lclip)">${leafView}</g><rect class="lfd-frame" width="${LW}" height="${LH}" rx="${PR}"/>
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

  const cam = q('.lfd-cam');
  const spotG = q(`#${P}-spotg`), spotIn = q('.lfd-spot-in'), spotOut = q('.lfd-spot-out');
  const ribG = q('.lfd-ribbon'), rib = q('.lfd-rib'), ribStops = qa(`#${P}-rib stop`);
  const tm = qa('.lfd-tm'), floorStops = qa(`#${P}-floorg stop`), wclip = q('.lfd-wclip-r');
  const floorY = floorStops.map((_, i) => YS + ((700 - YS) * i) / (floorStops.length - 1));
  const a1 = q('.lfd-a1'), a1l = q('.lfd-a1l');
  const crit = q('.lfd-crit');
  const cFarO = q('.lfd-c-far-o'), cFar = q('.lfd-c-far'), cFins = q('.lfd-c-fins'), cBody = q('.lfd-c-body'), cMarks = q('.lfd-c-marks');
  const cNhO = q('.lfd-c-nh-o'), cNh = q('.lfd-c-nh'), cNfO = q('.lfd-c-nf-o'), cNf = q('.lfd-c-nf'), cEar = q('.lfd-c-ear'), cMuz = q('.lfd-c-muz'), cEyeW = q('.lfd-c-eyew'), cEye = q('.lfd-c-eye');
  const beeG = q('.lfd-bee'), wings = q('.lfd-wings');
  const colMam = q('.lfd-col-mam'), colPri = q('.lfd-col-pri'), colUs = q('.lfd-col-us'), colBee = q('.lfd-col-bee'), lcol = q('.lfd-lcol');
  const fMam = q('.lfd-dm'), fPri = q('.lfd-dp'), cells = q('.lfd-cells'), uvView = q('.lfd-uvview'), uvl = q('.lfd-uvl');
  const lw = qa('.lfd-lw'), lg = qa('.lfd-lg'), chlLab = q('.lfd-chl-lab');
  const axis = q('.lfd-axis'), rows = qa('.lfd-row'), qm = q('.lfd-qm'), ein = q('.lfd-ein'), einS = sub(ein, '.lfd-ein-s');

  /** An eye's dots: dim until light arrives (k), then full colour with an amber glow; s turns their first colours into
   *  their own (the primate eye's yellow-green cells becoming green and red ones). */
  function eyeLit(id: string, k: number, s = 1): void {
    qa(`.lfd-dot-${id}`).forEach(d => {
      const c1 = hex(COL[(d.getAttribute('data-c') ?? 'b') as Dot]), c0 = hex(COL[(d.getAttribute('data-c0') ?? d.getAttribute('data-c') ?? 'b') as Dot]);
      const c = mix(c0, c1, s);
      set(d, 'fill', rgb(mix(mix(c, PAGE, 0.62), c, k)));
    });
    qa(`.lfd-halo-${id}`).forEach(h => op(h, 0.9 * k));
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

  /** The subject: swims ashore and becomes the small mammal (beat 2), then the monkey (beat 3). */
  const F0: Pt = [430, 606], F1: Pt = [1118, groundY(1118) + 2], F2: Pt = [1200, groundY(1200)];
  function subject(b: number, t: number): { x: number; y: number; rot: number; m: number; pose: Pose } {
    const still = (m: number, pitch: number): { x: number; y: number; rot: number; m: number; pose: Pose } =>
      ({ x: MONKEY[0], y: MONKEY[1], rot: 0, m, pose: { ph: 0, amp: 0, walk: 0, wph: 0, pitch } });
    if (b === 0) {
      const k = outC((t - 0.3) / 1.4), amp = 2.8 * (1 - ramp(t, 1.3, 1.9));
      return { x: lerp(-140, F0[0], k), y: F0[1], rot: 0, m: 0, pose: { ph: 7 * Math.min(t, 1.9), amp, walk: 0, wph: 0, pitch: 0 } };
    }
    if (b === 2) return still(2 + ramp(t, 0, 0.6), -12 * ramp(t, 0.3, 0.7));
    if (b === 3) return still(3, lerp(-12, 16, ramp(t, 0, 0.5)));
    if (b > 3) return still(3, 16);
    const ks = sm(t / 0.85), kc = ramp(t, 0.75, 1.3), kw = ramp(t, 1.25, 1.7);
    const swimY = lerp(F0[1], F1[1], ks) + 20 * Math.sin(Math.PI * ks);
    let x: number, y: number;
    if (t < 0.8) { x = lerp(F0[0], F1[0], ks); y = swimY; }
    else if (kw <= 0) { x = lerp(F1[0], F2[0], kc); y = groundY(x); }
    else { x = lerp(F2[0], MONKEY[0], kw); y = groundY(x); }
    if (t >= 0.8 && t < 0.85) { const kk = (t - 0.8) / 0.05; x = lerp(lerp(F0[0], F1[0], ks), x, kk); y = lerp(swimY, y, kk); }
    const swimRot = -12 * ramp(t, 0, 0.25) * (1 - ramp(t, 0.6, 0.9));
    const slope = -18 * ramp(t, 0.7, 0.9) * (1 - ramp(t, 1.2, 1.4));
    const m = ramp(t, 0.6, 1.0) + ramp(t, 1.05, 1.45);
    const walk = 6 * Math.min(ramp(t, 0.75, 0.9), 1 - ramp(t, 1.55, 1.75));
    const amp = 2.8 * Math.min(ramp(t, 0, 0.15), 1 - ramp(t, 0.6, 0.85));
    return { x, y, rot: swimRot + slope, m, pose: { ph: 7 * (1.9 + t), amp, walk, wph: 15 * t, pitch: 0 } };
  }

  return (beat: number, t: number): void => {
    const b = Math.max(0, Math.min(5, beat));
    /** 1 while beat `on` holds the thing, fading in over [a, a+0.3] in that beat and out over the first 0.3 s of beat `off`. */
    const win = (on: number, a: number, off: number): number => (b < on || b > off ? 0 : b === on ? ramp(t, a, a + 0.3) : b === off ? 1 - ramp(t, 0, 0.3) : 1);
    /** A beat-local ramp that is 0 before beat `on` and 1 after it. */
    const at = (on: number, a: number, z: number): number => (b < on ? 0 : b === on ? ramp(t, a, z) : 1);

    // Camera: beat 2 follows the subject ashore; it then stays.
    const kc = b === 1 ? ramp(t, 0, 1.0) : b > 1 ? 1 : 0;
    set(cam, 'transform', `translate(${f(lerp(CAM1.tx, CAM2.tx, kc))} ${f(lerp(CAM1.ty, CAM2.ty, kc))}) scale(${lerp(CAM1.s, CAM2.s, kc).toFixed(4)})`);

    // The scene fades toward the paper beyond the subject's side of the stage, and away for the last beat.
    const SP = [[1250, 1450, 1, 0.45], [705, 755, 1, 0], [705, 755, 1, 0], [705, 755, 1, 0], [705, 755, 1, 0], [705, 755, 0, 0]];
    const ks = b === 0 ? 1 : ramp(t, 0, b === 5 ? 0.3 : 0.9), s0 = SP[b === 0 ? 0 : b - 1], s1 = SP[b];
    set(spotG, 'x1', f(lerp(s0[0], s1[0], ks)));
    set(spotG, 'x2', f(lerp(s0[1], s1[1], ks)));
    set(spotIn, 'stop-opacity', lerp(s0[2], s1[2], ks).toFixed(3));
    set(spotOut, 'stop-opacity', lerp(s0[3], s1[3], ks).toFixed(3));

    // Ribbon: the current subject's band; in the last beat the rows' own axis takes over.
    const kr = ramp(t, 0.2, 1.0), prev = b === 0 ? NONE : BEAT_W[b - 1], next = BEAT_W[b];
    ribbon(nm => lerp(prev(nm), next(nm), b === 5 ? 0 : kr));
    show(ribG, b === 5 ? 1 - ramp(t, 0, 0.3) : 1);

    // Beat 1. The light goes down; each thing under water takes the colour of the light that reaches its depth.
    const front = b === 0 ? lerp(WAVE_TOP - 24, 760, ramp(t, 0.1, 1.4)) : 760;
    set(wclip, 'height', f(Math.max(0, front - WAVE_TOP + 20)));
    const lit = (y: number): number => (b === 0 ? clamp((front - y) / 50) : 1);
    STARS.forEach((s, i) => set(tm[i], 'values', diag(trans(s.d).map(v => lerp(1, v, lit(s.y))))));
    floorStops.forEach((st, i) => set(st, 'stop-color', rgb(mix(SAND, tint(SAND, dAt(floorY[i])), lit(floorY[i])))));
    show(a1, b === 0 ? 1 : b === 1 ? 1 - ramp(t, 0, 0.3) : 0);
    show(a1l, win(0, 0.2, 1));

    // The subject: swims, crawls ashore, and morphs fish → four-legged animal → small mammal (→ monkey in beat 3).
    const sj = subject(b, t), F = formAt(sj.m), cr = critter(F, sj.pose), body = sj.y - (sj.m < 1 ? 16 : 0);
    set(crit, 'transform', `translate(${f(sj.x)} ${f(sj.y)}) rotate(${f(sj.rot)})`);
    const dep = body > YS ? dAt(body) : 0;
    set(tm[2], 'values', diag(trans(dep).map(v => lerp(1, v, lit(body)))));
    const fill = rgb(F.fill), line = rgb(F.line), dark = rgb(mix(F.fill, F.line, 0.3)), lws = legW(F);
    set(cFarO, 'd', cr.far); set(cFar, 'd', cr.far); set(cNhO, 'd', cr.nearH); set(cNh, 'd', cr.nearH); set(cNfO, 'd', cr.nearF); set(cNf, 'd', cr.nearF);
    set(cFarO, 'stroke', line); set(cFar, 'stroke', dark);
    [cNhO, cNfO].forEach(e => set(e, 'stroke', line)); [cNh, cNf].forEach(e => set(e, 'stroke', fill));
    const lwMax = Math.max(lws[0], lws[1]);
    set(cFarO, 'stroke-width', f(lwMax > 0.3 ? lwMax + 3 : 0)); set(cFar, 'stroke-width', f(lwMax));
    set(cNhO, 'stroke-width', f(lws[3] > 0.3 ? lws[3] + 3 : 0)); set(cNh, 'stroke-width', f(lws[3]));
    set(cNfO, 'stroke-width', f(lws[2] > 0.3 ? lws[2] + 3 : 0)); set(cNf, 'stroke-width', f(lws[2]));
    set(cFins, 'd', cr.fins); set(cBody, 'd', cr.body); set(cBody, 'fill', fill); set(cBody, 'stroke', line);
    set(cMarks, 'd', cr.marks); op(cMarks, F.marks);
    set(cEar, 'cx', f(cr.ear[0])); set(cEar, 'cy', f(cr.ear[1])); set(cEar, 'r', f(cr.earR)); set(cEar, 'fill', dark); set(cEar, 'stroke', line);
    set(cMuz, 'cx', f(cr.muz[0])); set(cMuz, 'cy', f(cr.muz[1])); set(cMuz, 'rx', f(cr.muzR)); set(cMuz, 'ry', f(cr.muzR * 0.85)); op(cMuz, F.muzO);
    set(cEyeW, 'cx', f(cr.eye[0])); set(cEyeW, 'cy', f(cr.eye[1])); set(cEyeW, 'r', f(cr.eyeR * F.marks + 0.01)); op(cEyeW, F.marks);
    set(cEye, 'cx', f(cr.eye[0])); set(cEye, 'cy', f(cr.eye[1])); set(cEye, 'r', f(cr.eyeR * 0.68));

    // Beat 2. The small mammal's view of the fruit tree: light reaches its two kinds of cells, and the tree turns olive.
    show(colMam, win(1, 1.4, 3));
    subs(colMam, '.lfd-ew').forEach((el, i) => draw(el, at(1, 1.55 + 0.04 * i, 1.85 + 0.04 * i)));
    eyeLit('mam', at(1, 1.85, 2.05));
    set(fMam, 'values', deut(at(1, 1.75, 2.3)));
    op(cells, at(1, 1.95, 2.25));

    // Beat 3. Beside it, the primates' view: light arrives, the yellow-green cells split into green and red ones, and
    // the fruit turns red.
    show(colPri, win(2, 0.4, 3));
    subs(colPri, '.lfd-ew').forEach((el, i) => draw(el, at(2, 0.6 + 0.04 * i, 0.9 + 0.04 * i)));
    const split = at(2, 0.95, 1.45);
    eyeLit('pri', at(2, 0.85, 1.0), split);
    set(fPri, 'values', deut(1 - split));

    // Beat 4. The flowers as we see them and as a bee does: ultraviolet arrives at both eyes; only the bee's cells take
    // it, and the bee's view shows the flower's ultraviolet pattern. The bee flies in and lands.
    show(colUs, win(3, 0.2, 4));
    subs(colUs, '.lfd-ew').forEach((el, i) => draw(el, at(3, 0.6 + 0.04 * i, 0.9 + 0.04 * i)));
    eyeLit('us', at(3, 0.9, 1.05));
    show(colBee, win(3, 0.2, 4));
    subs(colBee, '.lfd-ew').forEach((el, i) => draw(el, at(3, 0.6 + 0.04 * i, 0.9 + 0.04 * i)));
    eyeLit('bee', at(3, 0.9, 1.05));
    op(uvView, at(3, 1.0, 1.5));
    op(uvl, at(3, 1.25, 1.55));
    const fly = at(3, 0, 1.0), land = at(3, 1.0, 1.3);
    const bx = land > 0 ? lerp(BEE1[0], BEE2[0], land) : lerp(BEE0[0], BEE1[0], fly);
    const by = land > 0 ? lerp(BEE1[1], BEE2[1], land) : lerp(BEE0[1], BEE1[1], fly) - 40 * Math.sin(Math.PI * fly);
    show(beeG, b < 3 ? 0 : b === 3 ? ramp(t, 0, 0.2) : 1);
    set(beeG, 'transform', `translate(${f(bx)} ${f(by)}) scale(${BEE_S})`);
    set(wings, 'transform', `rotate(${f(b === 3 ? (1 - ramp(t, 1.1, 1.3)) * 14 * Math.sin(60 * t) : 0)} 0 -6)`);

    // Beat 5. The leaf: blue and red land on chlorophyll and it glows; green mostly comes back out.
    show(lcol, win(4, 0.2, 5));
    const lin = [[0.5, 0.85], [0.55, 0.9], [0.6, 0.95], [0.95, 1.3]];
    lw.forEach((el, i) => draw(el, at(4, lin[i][0], lin[i][1])));
    const gl = [[0.85, 1.05], [0.9, 1.1], [0.95, 1.15]];
    lg.forEach((el, i) => op(el, at(4, gl[i][0], gl[i][1]) * (i === 1 ? 0.5 : 1)));
    op(chlLab, at(4, 1.05, 1.35));

    // Beat 6. Each slice as a row on a labelled wavelength axis, the question, and Einstein as the teaser.
    op(axis, at(5, 0.25, 0.55));
    rows.forEach((el, k) => op(el, at(5, 0.45 + 0.2 * k, 0.75 + 0.2 * k)));
    op(qm, at(5, 1.15, 1.45));
    const ke = at(5, 1.5, 1.8);
    show(ein, ke);
    const es = 0.9 + 0.1 * outC(ke), ecx = CLIP_X + CLIP_W / 2, ecy = CLIP_Y + CLIP_H / 2;
    set(einS, 'transform', `translate(${f(ecx * (1 - es))} ${f(ecy * (1 - es))}) scale(${es.toFixed(4)})`);
    clipFx(stage, b === 5 ? ramp(t, 2.1, 2.3) : 0);
  };
}

export const STAGING: Staging = {
  id: 'd',
  name: 'D · Side by side',
  note: 'One journey from sea to land; each contrast is two views side by side, each with its viewer’s eye and its light-sensitive cells.',
  svg,
  bind,
};
