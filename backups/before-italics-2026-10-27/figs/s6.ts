// Slide 6 figure concepts. What each must show is in research/figure-briefs/FIGURE_BRIEF.md.
// Shared marks: Chl a = solid dark-green disc, Chl b = pale disc with a green rim, excitation = amber glow
// that hops along dotted amber arcs, reaction centre = clay ring with + and –, electron = red dashed e⁻ arrow.
import './s6.css';
import { mulberry } from '../../lib/canvas';
import { spec } from '../../lib/colour';
import { arrow, text } from '../mechanisms';
import { bilayer, bolt, epath, illusHeads } from '../illus';

export type Pt = [number, number];
export type Box = [number, number, number, number];
export type Arc = [Pt, Pt, Pt];
export interface Pigment { x: number; y: number; b: boolean }

export const VARIANTS = [
  { id: 'a', name: 'Funnel' },
  { id: 'b', name: 'Relay' },
  { id: 'c', name: 'Top view' },
  { id: 'd', name: 'Two parts' },
  { id: 'e', name: 'Membrane' },
];

export const f = (v: number): string => v.toFixed(1);

/* ---------- shared marks ---------- */

/** Arrowheads (shared inks, amber bolt) plus the amber hop head and the glow gradient. */
export const defs = (p: string): string => `${illusHeads(p)}<defs>
  <marker id="${p}-amb" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path class="f6-hd" d="M0,0L10,5L0,10z"/></marker>
  <radialGradient id="${p}-glow"><stop offset="0" class="f6-g0"/><stop offset=".45" class="f6-g1"/><stop offset="1" class="f6-g2"/></radialGradient></defs>`;

/** The excitation: an amber glow with a bright core. */
export const glow = (p: string, [x, y]: Pt, s = 1, o = 1): string =>
  `<g opacity="${o}"><circle cx="${f(x)}" cy="${f(y)}" r="${f(21 * s)}" fill="url(#${p}-glow)"/><circle class="f6-gc" cx="${f(x)}" cy="${f(y)}" r="${f(6 * s)}"/></g>`;

/** A quadratic arc from a to b through control c. */
export const qd = ([a, c, b]: Arc): string => `M${f(a[0])},${f(a[1])}Q${f(c[0])},${f(c[1])} ${f(b[0])},${f(b[1])}`;
export const qAt = ([a, c, b]: Arc, t: number): Pt => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];
/** Control point that bows an arc to the left of its direction of travel by k × its length. */
export const bow = (a: Pt, b: Pt, k: number): Pt => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  return [(a[0] + b[0]) / 2 + dy * k, (a[1] + b[1]) / 2 - dx * k];
};
/** A point on a circle round q, at an angle in degrees (0 = right, 90 = down). */
export const onRing = (q: Pt, r: number, deg: number): Pt => [q[0] + r * Math.cos((deg * Math.PI) / 180), q[1] + r * Math.sin((deg * Math.PI) / 180)];

/** One energy hop: a dotted amber arc with a head, optionally on a pale underlay so it reads over pigments. */
export const hop = (p: string, arc: Arc, under = false): string =>
  `${under ? `<path class="f6-hop-u" d="${qd(arc)}"/>` : ''}<path class="f6-hop" d="${qd(arc)}" marker-end="url(#${p}-amb)"/>`;

/** A pigment disc; large ones carry their letter. */
export function pig(x: number, y: number, b: boolean, r = 5.5, letter = false): string {
  const disc = `<circle class="${b ? 'f6-pb' : 'f6-pa'}" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;
  return letter
    ? `${disc}<text class="f6-pt ${b ? 'f6-pt-b' : 'f6-pt-a'}" x="${f(x)}" y="${f(y + r * 0.36)}" text-anchor="middle" style="font-size:${Math.round(r * 1.15)}px">${b ? 'b' : 'a'}</text>`
    : disc;
}

/** Reaction centre: clay ring with + and – (the charge-separated pair). */
export function rc(x: number, y: number, r = 15): string {
  const fs = Math.round(r * 1.4);
  return `<circle class="rc-ring f6-rc" cx="${f(x)}" cy="${f(y)}" r="${r}"/><text class="rc-t" x="${f(x - r * 0.38)}" y="${f(y + r * 0.38)}" text-anchor="middle" style="font-size:${fs}px">+</text><text class="rc-t" x="${f(x + r * 0.42)}" y="${f(y + r * 0.32)}" text-anchor="middle" style="font-size:${fs}px">–</text>`;
}

/** Scatter pigments inside a shape, keeping a minimum spacing from each other and from seeded ones. */
export function scatter(rand: () => number, n: number, inside: (x: number, y: number) => boolean, box: Box, bShare: number, gap = 15, seed: Pigment[] = []): Pigment[] {
  const out: Pigment[] = [];
  for (let tries = 0; out.length < n && tries < n * 80; tries++) {
    const x = box[0] + rand() * (box[2] - box[0]);
    const y = box[1] + rand() * (box[3] - box[1]);
    if (!inside(x, y) || [...seed, ...out].some(q => Math.hypot(q.x - x, q.y - y) < gap)) continue;
    out.push({ x, y, b: rand() < bShare });
  }
  return out;
}
export const dots = (ps: Pigment[], r = 5.5): string => ps.map(q => pig(q.x, q.y, q.b, q.b ? r - 0.5 : r)).join('');
export const inRound = ([x0, y0, x1, y1]: Box, m = 9) => (x: number, y: number): boolean => x > x0 + m && x < x1 - m && y > y0 + m && y < y1 - m;
export const awayFrom = (q: Pt, d: number) => (x: number, y: number): boolean => Math.hypot(x - q[0], y - q[1]) > d;

export const svg = (label: string, body: string): string =>
  `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/* ---------- 6A · energy funnel: Chl b on the rim, Chl a on the floor, the reaction centre in a shallow dip ---------- */

export function funnelSvg(p = 'f6a'): string {
  const RIM = 214, FLOOR = 356, NOTCH = 370, BASE = 482, r = 17, rr = 20;
  const yb = RIM - r - 1.5, ya = FLOOR - r - 1.5;
  const R: Pt = [400, NOTCH - rr - 1.5];
  const ground = `M64,${RIM} H196 C234,${RIM} 230,${FLOOR} 262,${FLOOR} H374 C390,${FLOOR} 386,${NOTCH} 400,${NOTCH} C414,${NOTCH} 410,${FLOOR} 426,${FLOOR} H538 C570,${FLOOR} 566,${RIM} 604,${RIM} H736`;
  const bX = [98, 160, 640, 702], aX = [290, 345, 455, 510];
  const tb = (x: number): Pt => [x, yb - r - 3], ta = (x: number): Pt => [x, ya - r - 3];
  const step = (a: Pt, b: Pt, h = 28): Arc => [a, [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - h], b];
  // Each route: along the rim (Chl b), down the slope to Chl a, along the floor, into the reaction centre.
  const route = (b0: number, b1: number, a0: number, a1: number, side: -1 | 1): Arc[] => {
    const into: Pt = onRing(R, rr + 3, side < 0 ? 228 : 312);
    return [
      step(tb(b0), tb(b1)),
      [tb(b1), [a0 - side * -0.0 - (a0 - b1) * 0.15, yb - r - 26], ta(a0)],
      step(ta(a0), ta(a1)),
      step(ta(a1), into, 24),
    ];
  };
  const routes = [route(98, 160, 290, 345, -1), route(702, 640, 510, 455, 1)];
  const trail = (arcs: Arc[]): string => arcs.map(a => hop(p, a)).join('')
    + arcs.map((a, i) => (i === arcs.length - 1 ? glow(p, qAt(a, 0.55), 1.1) : glow(p, qAt(a, 0.5), 0.72, 0.45 + 0.15 * i))).join('');
  return svg('Energy funnel: excitation hops downhill from chlorophyll b to chlorophyll a and into the reaction centre, where an electron leaves', `
    ${defs(p)}
    ${arrow(p, 'ink', 'M34,480 L34,110')}
    <text class="tl" transform="translate(22 295) rotate(-90)" text-anchor="middle">excitation energy</text>
    <path class="f6-terrain" d="${ground} V${BASE} H64 Z"/>
    <path class="f6-ground" d="${ground}"/>
    ${bX.map(x => pig(x, yb, true, r, true)).join('')}
    ${aX.map(x => pig(x, ya, false, r, true)).join('')}
    ${rc(R[0], R[1], rr)}
    ${routes.map(trail).join('')}
    ${bolt(p, 58, 84, 95, 180)}${bolt(p, 742, 84, 705, 180)}
    ${text(150, 128, 'Chl b', 'lab lab-b f6-lb')}${text(650, 128, 'Chl b', 'lab lab-b f6-lb')}
    ${text(318, 414, 'Chl a', 'lab lab-b f6-la')}${text(482, 414, 'Chl a', 'lab lab-b f6-la')}
    ${text(400, 214, 'only energy moves', 'lab f6-amb')}
    ${epath(p, `M${R[0]},${NOTCH + 4} L${R[0]},548`)}
    ${text(386, 458, 'reaction centre', 'sm', 'end')}
    ${text(414, 458, 'e⁻', 'lab lbl-e', 'start')}
    ${text(414, 512, 'charge separation', 'sm f6-mut', 'start')}
  `);
}

/* ---------- 6B · relay: the baton is energy; only the finish line moves an electron ---------- */

export function relaySvg(p = 'f6b'): string {
  const y = 296, r = 28;
  const xs = [92, 182, 272, 362, 452], isB = [true, true, false, false, false];
  const R: Pt = [612, y];
  const arcs: Arc[] = xs.slice(0, -1).map((x, i): Arc => {
    const a: Pt = [x + 14, y - r - 4], b: Pt = [xs[i + 1] - 14, y - r - 4];
    return [a, [(a[0] + b[0]) / 2, y - r - 46], b];
  });
  const lastA: Pt = [xs[4] + 14, y - r - 4], lastB: Pt = onRing(R, 40, 228);
  arcs.push([lastA, [(lastA[0] + lastB[0]) / 2, y - r - 62], lastB]);
  const baton = qAt(arcs[2], 0.5);
  return svg('Relay: a row of antenna pigments hands an energy packet to the reaction centre, which sends out an electron', `
    ${defs(p)}
    <rect class="f6-ant" x="40" y="${y - 62}" width="464" height="124" rx="62"/>
    <rect class="blob-ps" x="536" y="${y - 84}" width="152" height="168" rx="52"/>
    ${xs.map((x, i) => pig(x, y, isB[i], r, true)).join('')}
    ${rc(R[0], R[1], 34)}
    ${arcs.map(a => hop(p, a)).join('')}
    ${glow(p, qAt(arcs[0], 0.5), 0.75, 0.4)}${glow(p, qAt(arcs[1], 0.5), 0.9, 0.65)}${glow(p, baton, 1.3)}
    ${text(baton[0], baton[1] - 40, 'energy', 'lab lab-b f6-amb')}
    ${bolt(p, 60, 120, 86, 252)}${text(52, 146, 'light', 'f6-note', 'end')}
    ${epath(p, `M${R[0] + 40},${y} L774,${y}`)}${text(722, y - 18, 'e⁻', 'lab lbl-e')}
    ${text(137, y + 104, 'Chl b', 'lab lab-b f6-lb')}${text(362, y + 104, 'Chl a', 'lab lab-b f6-la')}
    ${text(R[0], y + 122, 'reaction centre', 'lab')}
    <path class="bracket" d="M44,${y + 140} v12 H500 v-12"/>
    <path class="bracket" d="M540,${y + 158} v12 H684 v-12"/>
    <text class="lab" x="272" y="${y + 192}" text-anchor="middle">antenna: <tspan class="lab-b f6-amb">only energy</tspan> moves</text>
    <text class="lab" x="612" y="${y + 210}" text-anchor="middle"><tspan class="lab-b f6-red">an electron</tspan> moves</text>
    ${text(612, y + 240, 'charge separation', 'sm f6-mut')}
  `);
}

/* ---------- 6C · top view: PSII–LHCII and PSI–LHCI, every route converging on a reaction centre ---------- */

export function topViewSvg(p = 'f6c'): string {
  return svg('Top view of PSII with LHCII and PSI with LHCI: excitation from every antenna converges on the reaction centres', topViewBody(p));
}

/** The top-view drawing without its svg wrapper; `legend: false` leaves out the dot legend along the bottom. */
export function topViewBody(p: string, legend = true): string {
  const rand = mulberry(29);
  const cy = 236;
  // PSII–LHCII (C₂S₂-like): two LHCII trimers, two minor antennas, a dimeric core with two reaction centres.
  const tri = (cx: number, up: boolean): Pt[] => [0, 1, 2].map((k): Pt => {
    const a = (up ? -Math.PI / 2 : Math.PI / 2) + (k * 2 * Math.PI) / 3;
    return [cx + 30 * Math.cos(a), cy + 30 * Math.sin(a)];
  });
  const tL = tri(80, true), tR = tri(404, false);
  const minors: Pt[] = [[144, cy - 54], [340, cy + 54]];
  const cores: Box[] = [[172, cy - 88, 242, cy + 88], [242, cy - 88, 312, cy + 88]];
  const R2: Pt[] = [[207, cy], [277, cy]];
  // PSI–LHCI: a monomeric core with a belt of four LHCI proteins along one side.
  const core1: Box = [536, 112, 770, 272];
  const R1: Pt = [653, 192];
  const belt: Pt[] = [0, 1, 2, 3].map((k): Pt => [576 + k * 51, 328 + Math.abs(k - 1.5) * 6]);
  // Routes: start on a pigment where light was absorbed (glow), end on the ring at a set angle so heads never stack.
  const routes: Array<[Pt, Pt, number, number, boolean]> = [
    [[86, cy + 14], R2[0], 180, 0.14, true], [[144, cy - 54], R2[0], 228, -0.12, false], [[200, cy - 70], R2[0], 270, 0.08, false], [[216, cy + 70], R2[0], 90, 0.08, false],
    [[398, cy - 14], R2[1], 0, 0.14, true], [[340, cy + 54], R2[1], 48, -0.12, false], [[284, cy + 70], R2[1], 90, 0.08, false], [[268, cy - 70], R2[1], 270, 0.08, false],
    ...belt.map((q, i): [Pt, Pt, number, number, boolean] => [[q[0], q[1] + 12], R1, [148, 114, 66, 32][i], [0.12, 0.06, -0.06, -0.12][i], i === 0]),
    [[560, 134], R1, 205, -0.1, false], [[750, 160], R1, 340, 0.1, false],
  ];
  const seed = routes.map(([a], i): Pigment => ({ x: a[0], y: a[1], b: i === 0 || i === 4 }));
  const inTri = (t: Pt[]) => (x: number, y: number): boolean => t.some(([a, b]) => Math.hypot(x - a, y - b) < 24);
  const pigs = [
    ...seed,
    ...[tL, tR].flatMap(t => scatter(rand, 24, inTri(t), [t[0][0] - 64, cy - 64, t[0][0] + 64, cy + 64], 0.43, 14, seed)),
    ...minors.flatMap(([a, b]) => scatter(rand, 4, (x, y) => Math.hypot(x - a, y - b) < 12, [a - 16, b - 16, a + 16, b + 16], 0.3, 12, seed)),
    ...cores.flatMap((c, i) => scatter(rand, 16, (x, y) => inRound(c, 11)(x, y) && awayFrom(R2[i], 30)(x, y), c, 0, 15, seed)),
    ...scatter(rand, 46, (x, y) => inRound(core1, 12)(x, y) && awayFrom(R1, 30)(x, y), core1, 0, 15, seed),
    ...belt.flatMap(([a, b]) => scatter(rand, 9, (x, y) => Math.abs(x - a) < 14 && Math.abs(y - b) < 32, [a - 18, b - 36, a + 18, b + 36], 0.21, 13, seed)),
  ];
  const shapes = [
    ...[...tL, ...tR].map(([a, b]) => `<circle class="f6-ant" cx="${f(a)}" cy="${f(b)}" r="31"/>`),
    ...minors.map(([a, b]) => `<circle class="f6-ant" cx="${a}" cy="${b}" r="20"/>`),
    ...cores.map(([x0, y0, x1, y1]) => `<rect class="f6-core" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="20"/>`),
    `<rect class="f6-core" x="${core1[0]}" y="${core1[1]}" width="${core1[2] - core1[0]}" height="${core1[3] - core1[1]}" rx="26"/>`,
    ...belt.map(([a, b]) => `<rect class="f6-ant" x="${a - 23}" y="${b - 42}" width="46" height="84" rx="16"/>`),
  ].join('');
  const arcs = routes.map(([a, R, deg, k]): Arc => { const b = onRing(R, R === R1 ? 27 : 24, deg); return [a, bow(a, b, k), b]; });
  return `
    ${defs(p)}
    ${text(242, 56, 'PSII + LHCII', 'lab lab-b')}${text(653, 56, 'PSI + LHCI', 'lab lab-b')}
    ${shapes}${dots(pigs)}
    ${arcs.map(a => hop(p, a, true)).join('')}
    ${routes.map(([a]) => glow(p, a, 0.62)).join('')}
    ${R2.map(([a, b]) => rc(a, b, 16)).join('')}${rc(R1[0], R1[1], 16)}
    ${text(80, cy + 98, 'LHCII', 'sm')}${text(404, cy - 80, 'LHCII', 'sm')}${text(242, cy + 120, 'PSII core', 'sm')}
    ${text(653, 96, 'PSI core', 'sm')}${text(653, 406, 'LHCI', 'sm')}
    ${text(242, 450, 'Chl b‑rich · a:b ≈ 1.3', 'lab')}
    ${text(653, 450, 'Chl a‑rich · a:b ≈ 3.7', 'lab')}
    ${legend ? `<g transform="translate(22 556)">
      ${pig(8, -8, false, 7)}${text(24, 0, 'Chl a', 'sm', 'start')}
      ${pig(112, -8, true, 6.5)}${text(128, 0, 'Chl b', 'sm', 'start')}
      ${glow(p, [222, -8], 0.6)}${hop(p, [[222, -8], [250, -24], [280, -8]])}${text(292, 0, 'energy hops', 'sm', 'start')}
      ${rc(462, -8, 15)}${text(486, 0, 'reaction centre: e⁻ moves', 'sm', 'start')}
    </g>` : ''}
  `;
}

/* ---------- 6D · two parts: different colours, one destination ---------- */

function pentagon(cx: number, cy: number, r: number, toward: Pt): Pt[] {
  const a0 = Math.atan2(toward[1] - cy, toward[0] - cx);
  return Array.from({ length: 5 }, (_, k): Pt => [cx + r * Math.cos(a0 + (k * 2 * Math.PI) / 5), cy + r * Math.sin(a0 + (k * 2 * Math.PI) / 5)]);
}

/** A simplified chlorin head (four rings around Mg, the fifth ring, a stub of the phytol tail) with its ring-B group boxed. */
export function chlHead(ox: number, oy: number, s: number, group: string): string {
  const d = 50 * s, r = 25 * s;
  const centres: Pt[] = [[ox - d, oy - d], [ox + d, oy - d], [ox + d, oy + d], [ox - d, oy + d]];
  const rings = centres.map(([cx, cy]) => pentagon(cx, cy, r, [ox, oy]));
  const poly = (q: Pt[]): string => `M${q.map(v => v.map(f).join(',')).join('L')}Z`;
  const near = (q: Pt[], t: Pt): Pt => q.slice(1).reduce((best, v) => (Math.hypot(v[0] - t[0], v[1] - t[1]) < Math.hypot(best[0] - t[0], best[1] - t[1]) ? v : best));
  const bridges = rings.map((ring, i) => {
    const a = near(ring, centres[(i + 1) % 4]);
    const b = near(rings[(i + 1) % 4], centres[i]);
    const mid: Pt = [(a[0] + b[0]) / 2 + (a[0] + b[0] - 2 * ox) * 0.12, (a[1] + b[1]) / 2 + (a[1] + b[1] - 2 * oy) * 0.12];
    return `M${f(a[0])},${f(a[1])}L${f(mid[0])},${f(mid[1])}L${f(b[0])},${f(b[1])}`;
  }).join('');
  const bonds = rings.map(ring => `M${f(ring[0][0])},${f(ring[0][1])}L${ox},${oy}`).join('');
  const outer = rings[1].reduce((best, v) => (v[0] - v[1] > best[0] - best[1] ? v : best));
  const ringE = pentagon(ox + d * 0.2, oy + d + 34 * s, 20 * s, [ox + d, oy + d]);
  const tail: Pt[] = [[ox - d - 10 * s, oy + d + 22 * s]];
  for (let i = 1; i <= 3; i++) tail.push([tail[0][0] - i * 18, tail[0][1] + (i % 2 ? 11 : 0) + i * 3]);
  const w = group.length * 15 + 18, bx = outer[0] + 18, by = outer[1] - 30;
  return `<g class="mol">
    <path class="mol-ring" d="${rings.map(poly).join('')}${poly(ringE)}"/>
    <path class="mol-bond" d="${bridges}"/>
    <path class="mol-coord" d="${bonds}"/>
    <path class="mol-bond" d="M${tail.map(q => q.map(f).join(',')).join('L')}"/>
    <circle class="mol-mg" cx="${ox}" cy="${oy}" r="13"/><text class="f6-mg" x="${ox}" y="${oy + 5.5}" text-anchor="middle">Mg</text>
    <path class="mol-bond" d="M${f(outer[0])},${f(outer[1])}L${f(bx)},${f(by + 18)}"/>
    <rect class="mol-hi" x="${f(bx)}" y="${f(by)}" width="${w}" height="36" rx="7"/>
    <text class="f6-grp" x="${f(bx + w / 2)}" y="${f(by + 26)}" text-anchor="middle">${group}</text>
  </g>`;
}

// Provisional band shapes copied from figures.ts (slide 5); peaks are shown, not numbered, on this slide.
const gauss = (x: number, mu: number, sd: number): number => Math.exp(-((x - mu) ** 2) / (2 * sd * sd));
const BANDS: Record<'a' | 'b', Array<[number, number, number]>> = {
  a: [[430, 11, 1], [412, 14, 0.45], [385, 22, 0.28], [662, 8.5, 0.96], [617, 11, 0.14], [578, 10, 0.08], [533, 12, 0.05]],
  b: [[453, 12, 1], [430, 13, 0.4], [400, 22, 0.25], [642, 8.5, 0.42], [596, 12, 0.09], [550, 14, 0.05]],
};
export function absorb(k: 'a' | 'b'): Array<[number, number]> {
  const raw: Array<[number, number]> = [];
  for (let nm = 400; nm <= 700; nm += 2) raw.push([nm, BANDS[k].reduce((s, [mu, sd, h]) => s + h * gauss(nm, mu, sd), 0)]);
  const max = Math.max(...raw.map(q => q[1]));
  return raw.map(([nm, a]) => [nm, a / max]);
}
/** The visible spectrum as a soft strip, washed towards the paper so it does not shout. */
export function strip(id: string): string {
  const stops = Array.from({ length: 31 }, (_, i) => {
    const nm = 400 + i * 10, c = spec(nm);
    const fade = 0.72 * Math.max(0, Math.min(1, (nm - 385) / 30, (735 - nm) / 50));
    const mix = (v: number): number => Math.round(246 + (v - 246) * fade);
    return `<stop offset="${(i / 30).toFixed(3)}" stop-color="rgb(${mix(c[0])},${mix(c[1])},${mix(c[2])})"/>`;
  }).join('');
  return `<defs><linearGradient id="${id}" x1="0" x2="1">${stops}</linearGradient></defs>`;
}

export function twoPartsSvg(p = 'f6d'): string {
  const x0 = 486, x1 = 780, top = 80, base = 236;
  const X = (nm: number): number => x0 + ((nm - 400) / 300) * (x1 - x0);
  const Y = (a: number): number => base - a * (base - top);
  const curve = (k: 'a' | 'b'): string => `<path class="curve chl${k}" d="${absorb(k).map(([nm, a], i) => `${i ? 'L' : 'M'}${f(X(nm))},${f(Y(a))}`).join('')}"/>`;
  const peakDot = (k: 'a' | 'b', nm: number): string => `<circle class="dot dot-${k}" cx="${f(X(nm))}" cy="${f(Y(absorb(k)[Math.round((nm - 400) / 2)][1]))}" r="5"/>`;
  // One destination: antenna on both sides of a core, every route ending at its one reaction centre.
  const rand = mulberry(7);
  const antL: Box = [20, 392, 314, 548], antR: Box = [486, 392, 780, 548];
  const R: Pt = [400, 470];
  const routes: Array<[Pt, number, number]> = [
    [[70, 424], 222, -0.12], [[190, 470], 180, 0], [[90, 516], 138, 0.12],
    [[730, 424], 318, 0.12], [[610, 470], 0, 0], [[710, 516], 42, -0.12],
  ];
  const seed = routes.map(([a], i): Pigment => ({ x: a[0], y: a[1], b: i % 2 === 0 }));
  const ps = [...seed, ...[antL, antR].flatMap(b => scatter(rand, 26, inRound(b, 16), b, 0.4, 24, seed))];
  const arcs = routes.map(([a, deg, k]): Arc => { const b = onRing(R, 30, deg); return [a, bow(a, b, k), b]; });
  return svg('Chlorophyll a and b differ by one group and absorb different colours; both pass energy to one reaction centre', `
    ${defs(p)}${strip(`${p}-strip`)}
    ${text(20, 38, 'Different colours', 'lab lab-b', 'start')}
    ${chlHead(108, 142, 0.68, '–CH₃')}${chlHead(322, 142, 0.68, '–CHO')}
    ${pig(70, 252, false, 9)}${text(86, 261, 'Chl a', 'lab lab-b f6-la', 'start')}<path class="curve chla" d="M86,276 H150"/>
    ${pig(284, 252, true, 8.5)}${text(300, 261, 'Chl b', 'lab lab-b f6-lb', 'start')}<path class="curve chlb" d="M300,276 H364"/>
    <text class="tl" x="${x0}" y="62" text-anchor="start">absorption</text>
    <path class="axis" d="M${x0},${top - 8} V${base} H${x1}"/>
    ${curve('b')}${curve('a')}
    ${peakDot('a', 430)}${peakDot('a', 662)}${peakDot('b', 453)}${peakDot('b', 642)}
    <rect x="${x0}" y="${base + 8}" width="${x1 - x0}" height="16" rx="3" fill="url(#${p}-strip)"/>
    ${text(X(445), base + 52, 'blue', 'sm f6-blue')}${text(X(650), base + 52, 'red', 'sm f6-red')}
    <path class="rule" d="M20,314 H780"/>
    ${text(20, 360, 'One destination', 'lab lab-b', 'start')}
    <rect class="f6-ant" x="${antL[0]}" y="${antL[1]}" width="${antL[2] - antL[0]}" height="${antL[3] - antL[1]}" rx="40"/>
    <rect class="f6-ant" x="${antR[0]}" y="${antR[1]}" width="${antR[2] - antR[0]}" height="${antR[3] - antR[1]}" rx="40"/>
    <rect class="blob-ps" x="328" y="404" width="144" height="132" rx="44"/>
    ${dots(ps, 7)}
    ${arcs.map(a => hop(p, a, true)).join('')}${routes.map(([a]) => glow(p, a, 0.75)).join('')}
    ${rc(R[0], R[1], 22)}
    ${epath(p, `M${R[0]},${R[1] - 26} L${R[0]},350`)}${text(R[0] + 14, 372, 'e⁻', 'lab lbl-e', 'start')}
    ${text(167, 582, 'antenna', 'sm')}${text(400, 582, 'reaction centre', 'sm')}${text(633, 582, 'antenna', 'sm')}
  `);
}

/* ---------- 6E · membrane side view, thesis style ---------- */

export function membraneSvg(p = 'f6e'): string {
  const rand = mulberry(11);
  const mT = 264, mB = 340, mid = (mT + mB) / 2;
  const lhcii = [96, 368], beltC = 712;
  const R2: Pt = [232, mid], R1: Pt = [568, mid];
  // Side view of an LHCII trimer: three overlapping lobes; the LHCI belt: four narrower lobes.
  const lobeShapes = (cx: number, n: number, rx: number, step: number, ry: number): string =>
    Array.from({ length: n }, (_, k) => `<ellipse class="f6-ant" cx="${f(cx + (k - (n - 1) / 2) * step)}" cy="${mid}" rx="${rx}" ry="${ry}"/>`).join('');
  const inLobes = (cx: number, half: number) => (x: number, y: number): boolean => Math.abs(y - mid) < 30 && Math.abs(x - cx) < half;
  // Routes: Chl b where the bolt lands, a neighbouring pigment, then the reaction-centre ring.
  const routes: Pt[][] = [
    [[70, mid - 8], [142, mid + 8], onRing(R2, 22, 190)],
    [[394, mid - 8], [322, mid + 8], onRing(R2, 22, 350)],
    [[742, mid - 8], [676, mid + 8], onRing(R1, 22, 350)],
  ];
  const seed: Pigment[] = routes.flatMap(rt => rt.slice(0, 2).map((q, i): Pigment => ({ x: q[0], y: q[1], b: i === 0 })));
  const pigs = [
    ...seed,
    ...lhcii.flatMap(cx => scatter(rand, 10, inLobes(cx, 66), [cx - 70, mT, cx + 70, mB], 0.43, 16, seed)),
    ...scatter(rand, 11, inLobes(beltC, 46), [beltC - 50, mT, beltC + 50, mB], 0.21, 15, seed),
    ...[R2, R1].flatMap(R => scatter(rand, 13, (x, y) => inLobes(R[0], 66)(x, y) && awayFrom(R, 28)(x, y), [R[0] - 70, mT, R[0] + 70, mB], 0, 16, seed)),
  ];
  const chain = (pts: Pt[]): string => pts.slice(0, -1).map((a, i) => hop(p, [a, bow(a, pts[i + 1], pts[i + 1][0] > a[0] ? 0.3 : -0.3), pts[i + 1]], true)).join('');
  return svg('Thylakoid membrane: LHCII trimers beside PSII and the LHCI belt beside PSI pass energy to the reaction centres, where electrons leave', `
    ${defs(p)}
    ${bilayer(p, 10, 790, mT, mB)}
    ${text(20, 46, 'stroma', 'f6-note', 'start')}${text(20, 452, 'lumen', 'f6-note', 'start')}
    ${lhcii.map(cx => lobeShapes(cx, 3, 26, 26, 76)).join('')}
    <rect class="blob-ps" x="152" y="198" width="160" height="210" rx="44"/>
    <rect class="blob-ps" x="488" y="198" width="160" height="210" rx="44"/>
    ${lobeShapes(beltC, 4, 18, 22, 70)}
    ${dots(pigs, 6)}
    ${routes.map(chain).join('')}
    ${routes.map(rt => glow(p, rt[0], 0.85)).join('')}
    ${rc(R2[0], R2[1], 17)}${rc(R1[0], R1[1], 17)}
    ${bolt(p, 50, 116, 68, 216)}${bolt(p, 414, 116, 396, 216)}${bolt(p, 760, 120, 744, 224)}
    ${epath(p, `M${R2[0]},${R2[1] - 22} L${R2[0]},124`)}${text(R2[0] + 14, 140, 'e⁻', 'lab lbl-e', 'start')}
    ${epath(p, `M${R1[0]},${R1[1] - 22} L${R1[0]},124`)}${text(R1[0] + 14, 140, 'e⁻', 'lab lbl-e', 'start')}
    ${text(96, 408, 'LHCII', 'sm lab-b')}${text(368, 408, 'LHCII', 'sm lab-b')}${text(232, 394, 'PSII', 'sm lab-b')}
    ${text(568, 394, 'PSI', 'sm lab-b')}${text(712, 408, 'LHCI', 'sm lab-b')}
    ${text(232, 486, 'LHCII: Chl b‑rich · a:b ≈ 1.3', 'sm')}
    ${text(618, 486, 'LHCI: Chl a‑rich · a:b ≈ 3.7', 'sm')}
    ${text(618, 514, 'red forms absorb beyond 700 nm', 'sm f6-mut')}
    <g transform="translate(26 570)">
      ${bolt(p, 0, -46, 20, 8)}${text(40, 0, 'light', 'sm', 'start')}
      ${glow(p, [130, -8], 0.7)}${text(150, 0, 'energy hops (antenna)', 'sm', 'start')}
      ${epath(p, 'M400,-8 H444')}${text(456, 0, 'e⁻ moves (reaction centre)', 'sm', 'start')}
    </g>
  `);
}

export function draw(id: string): string {
  if (id === 'b') return relaySvg();
  if (id === 'c') return topViewSvg();
  if (id === 'd') return twoPartsSvg();
  if (id === 'e') return membraneSvg();
  return funnelSvg();
}
