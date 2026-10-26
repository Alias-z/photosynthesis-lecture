// Why pigments differ, staging A "Zoom into the molecule". Each molecule is zoomed into, with its own energy ladder
// beside it: a chlorophyll in a leaf, three chains of growing length, β-carotene, chlorophyll a turning into b, and
// the three absorption spectra together.
// - The absorbing electrons are drawn as spread over a "room", the conjugated system of alternating single and double
//   bonds, highlighted in amber (the free-electron model, Kuhn 1949); real orbitals are not drawn.
// - Ladders are to scale in energy, E = 1239.84 eV·nm / λ, at one scale per scene: the chains of 3 and 5 double
//   bonds (hexatriene, decapentaene) absorb at about 258 and 334 nm; 11 double bonds (β-carotene's system) from its
//   lowest band at 478 nm, with sublevels at 450 and 425 nm; chlorophyll a at 662 and 430 nm, b at 642 and 453 nm
//   (in solvent).
// - Scene changes: the first beat dives from leaf to chloroplast to molecule; later scenes cross-fade at their own
//   size (never one scene blown up over another), and Chl a → Chl b is a pan. The stage is never blank. Labels and
//   scenery appear whole.
import './pig-a.css';
import { leaf } from '../figs/s2';
import { absorb, col, type Pig } from '../figs/s5';
import type { Staging } from './types';

type V = [number, number];
/** A view: stage = s · scene + t. */
interface Tf { s: number; t: V }

const ID = 'piga';
const f1 = (v: number): string => v.toFixed(1);
const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
const smooth = (x: number): number => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const smoother = (x: number): number => { const u = clamp01(x); return u * u * u * (u * (u * 6 - 15) + 10); };
const easeOut = (x: number): number => { const u = clamp01(x); return 1 - (1 - u) * (1 - u); };
const lerp = (a: number, b: number, e: number): number => a + (b - a) * e;
const lerpV = (a: V, b: V, e: number): V => [lerp(a[0], b[0], e), lerp(a[1], b[1], e)];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]];
const mul = (a: V, k: number): V => [a[0] * k, a[1] * k];
const len = (a: V): number => Math.hypot(a[0], a[1]);
const unit = (a: V): V => { const L = len(a); return [a[0] / L, a[1] / L]; };
const polar = (deg: number): V => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
/** 0 → 1 over the time window [t0, t1]. */
const tw = (t: number, t0: number, t1: number): number => smooth((t - t0) / (t1 - t0));
const eV = (nm: number): number => 1239.84 / nm;
const pt = (p: V): string => `${f1(p[0])},${f1(p[1])}`;
const T = (x: number, y: number, s: string, cls: string, anchor: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}"${k ? ` data-k="${k}"` : ''}>${s}</text>`;
const tfStr = (v: Tf): string => `matrix(${v.s.toFixed(5)},0,0,${v.s.toFixed(5)},${v.t[0].toFixed(2)},${v.t[1].toFixed(2)})`;
const ID_TF: Tf = { s: 1, t: [0, 0] };
const apply = (v: Tf, p: V): V => add(mul(p, v.s), v.t);

/** A dive: scene B sits inside scene A at A's point fa, Z times smaller; the camera zooms from A (e = 0) to B (e = 1),
 *  carrying fa to B's focus fb on the stage. Returns the views of A and of B. */
function dive(fa: V, fb: V, Z: number, e: number): [Tf, Tf] {
  const c = lerpV(fa, fb, e), sa = Z ** e, sb = Z ** (e - 1);
  return [{ s: sa, t: sub(c, mul(fa, sa)) }, { s: sb, t: sub(c, mul(fb, sb)) }];
}
const fadeOut = (e: number): number => 1 - tw(e, 0.35, 0.7);
const fadeIn = (e: number): number => tw(e, 0.3, 0.65);

/* ---------------------------------------------------------------- light, levels and electrons */

const HEX = { uv: '#6a4cb4', b: '#2350e6', r: '#c8361e' } as const;
type Ink = keyof typeof HEX | 'bg';
const inkOf = (k: Ink): string => (k === 'bg' ? col(480) : HEX[k]);
const KP = 0.032; // drawn wavelength of a photon packet, px per nm (slide 4's look)

/** A photon as a wave packet in its colour: wavelength in proportion, bell-shaped envelope, travelling right. */
function packet(cx: number, cy: number, nm: number, len0 = 64, amp = 11): string {
  const lam = nm * KP, n = 90, pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = (i / n - 0.5) * len0 * 0.8, env = Math.exp(-((u / (len0 * 0.28)) ** 2));
    pts.push(`${i ? 'L' : 'M'}${f1(cx + u)},${f1(cy + Math.sin((2 * Math.PI * u) / lam) * amp * env)}`);
  }
  return pts.join('');
}

/** An energy axis: an upward grey arrow named "energy". */
const eAxis = (x: number, y0: number, y1: number): string =>
  `<path class="pa-axis" d="M${x},${y0}V${y1}" marker-end="url(#${ID}-hgrey)"/><text class="pa-ax" transform="translate(${x - 14} ${f1((y0 + y1) / 2)}) rotate(-90)" text-anchor="middle">energy</text>`;

/** One absorption on a ladder: a photon packet flies in under the lower rung, an arrow in its colour lifts one
 *  electron to the upper rung, and it glows amber (the excitation). Keys: `${k}-pk`, `-ar`, `-e`, `-gl`, `-lab`. */
interface Jump { k: string; ink: Ink; nm: number; x: number; y0: number; y1: number; from: number; label: string; lx?: number }
const jumpSvg = (j: Jump): string => `
  <path class="pa-pk" data-k="${j.k}-pk" style="stroke:${inkOf(j.ink)}"/>
  <path class="pa-ar" data-k="${j.k}-ar" style="stroke:${inkOf(j.ink)}" marker-end="url(#${ID}-h${j.ink})"/>
  <circle data-k="${j.k}-gl" r="24" fill="url(#${ID}-glow)"/>
  <circle class="pa-e" data-k="${j.k}-e" r="7"/>
  ${T(j.lx ?? j.x - 70, j.y0 + 84, j.label, 'pa-lab pa-photon', 'middle', `${j.k}-lab`)}`;

/* ---------------------------------------------------------------- molecules */

/** Bonds as skeletal lines; doubles get an inner parallel line toward `inside`. */
function bond(a: V, b: V, dbl = false, inside?: V): string {
  let s = `M${pt(a)}L${pt(b)}`;
  if (dbl) {
    const d = sub(b, a), n = unit([-d[1], d[0]]), m = mul(add(a, b), 0.5), side = inside && (inside[0] - m[0]) * n[0] + (inside[1] - m[1]) * n[1] < 0 ? -1 : 1;
    const o = mul(n, 7 * side), a2 = add(add(a, mul(d, 0.16)), o), b2 = add(add(b, mul(d, -0.16)), o);
    s += `M${pt(a2)}L${pt(b2)}`;
  }
  return s;
}

/** Smooth curve through points (Catmull–Rom), closed or open. */
function curve(p: V[], closedLoop: boolean): string {
  const n = p.length, at = (i: number): V => closedLoop ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))];
  let d = `M${pt(p[0])}`;
  for (let i = 0; i < (closedLoop ? n : n - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${pt(p2)}`;
  }
  return closedLoop ? `${d}Z` : d;
}

/** The amber room over a conjugated path: a soft glow and a crisp line drawn along it. */
const room = (k: string, d: string): string =>
  `<g data-k="${k}"><path class="pa-room-glow" d="${d}" filter="url(#${ID}-soft)"/><path class="pa-room" data-k="${k}-line" d="${d}" pathLength="1"/></g>`;

/** Chlorophyll, simplified: four small rings around Mg, ring V with its C=O, and the phytol tail. The group on ring II
 *  that differs between Chl a (–CH₃) and Chl b (–CHO) carries keys `${k}-ch3` and `${k}-cho`. */
function chlorophyll(C: V, k: string, sc: number, withB: boolean): { svg: string; group: V } {
  const D = 92 * sc, rp = 40 * sc, D2 = 112 * sc, TH = [-135, -45, 45, 135];
  const centre = TH.map(th => add(C, mul(polar(th), D)));
  const ring = TH.map((th, i) => [0, 1, 2, 3, 4].map(j => add(centre[i], mul(polar(th + 180 + 72 * j), rp))));
  const meso = TH.map(th => add(C, mul(polar(th + 45), D2)));
  const near = (i: number, p: V): number => (len(sub(ring[i][1], p)) < len(sub(ring[i][4], p)) ? 1 : 4);
  let bonds = '';
  ring.forEach((r, i) => r.forEach((p, j) => { bonds += bond(p, r[(j + 1) % 5], j === 2 && i < 3, centre[i]); }));
  const loop: V[] = [];
  TH.forEach((_, i) => {
    const prev = meso[(i + 3) % 4], next = meso[i], jp = near(i, prev), jn = near(i, next);
    loop.push(ring[i][jp], ring[i][jn], next);
    bonds += bond(ring[i][jn], next, false) + bond(next, ring[(i + 1) % 4][near((i + 1) % 4, next)], true, C);
  });
  // Ring V on ring III, with its C=O.
  const a14 = ring[2][near(2, meso[2])], b13 = ring[2][near(2, meso[2]) === 1 ? 2 : 3], c15 = meso[2];
  const u = unit(sub(mul(add(b13, c15), 0.5), a14)), c131 = add(b13, mul(u, 40 * sc)), c132 = add(c15, mul(u, 40 * sc));
  const o = add(c131, mul(unit(sub(c131, a14)), 30 * sc));
  bonds += bond(b13, c131) + bond(c131, c132) + bond(c132, c15) + bond(c131, o, true, c132);
  // Stubs: methyl and vinyl on ring I, ethyl on ring II, methyl on ring III.
  const stub = (i: number, j: number, l = 30 * sc): V => add(ring[i][j], mul(unit(sub(ring[i][j], centre[i])), l));
  const outerBeta = (i: number): number[] => [2, 3];
  const [i1a, i1b] = outerBeta(0), [i2a, i2b] = outerBeta(1);
  const g2 = ring[1][i2a][0] > ring[1][i2b][0] ? i2a : i2b, e2 = g2 === i2a ? i2b : i2a; // the right-hand β of ring II
  const v1 = stub(0, i1b), v1b = add(v1, mul(polar(-150), 28 * sc));
  bonds += bond(ring[0][i1a], stub(0, i1a)) + bond(ring[0][i1b], v1) + bond(v1, v1b, true, C);
  const e2a = stub(1, e2), e2b = add(e2a, mul(polar(-60), 28 * sc));
  bonds += bond(ring[1][e2], e2a) + bond(e2a, e2b);
  const b3 = ring[2][near(2, meso[2]) === 1 ? 3 : 2];
  bonds += bond(b3, stub(2, b3 === ring[2][3] ? 3 : 2));
  const gEnd = stub(1, g2, 30 * sc);
  bonds += bond(ring[1][g2], gEnd);
  // The tail: from the lower β of ring IV down past ring V, then a long zig-zag to the right with four methyl branches.
  const lowIdx = ring[3][2][1] > ring[3][3][1] ? 2 : 3, t0 = ring[3][lowIdx];
  const tail: V[] = [t0, add(t0, [0, 100 * sc])];
  for (let i = 1; i <= 19; i++) tail.push(add(tail[1], [i * 25 * sc, (i % 2 ? -14 : 0) * sc]));
  for (let i = 0; i < tail.length - 1; i++) bonds += bond(tail[i], tail[i + 1]);
  [4, 8, 12, 16].forEach(i => { bonds += bond(tail[i + 1], add(tail[i + 1], [0, (i % 2 ? -26 : 26) * sc])); });
  // Mg and its four bonds to the nitrogens.
  const coord = TH.map((_, i) => { const n = ring[i][0], d = unit(sub(n, C)); return `M${pt(add(C, mul(d, 23)))}L${pt(sub(n, mul(d, 4)))}`; }).join('');
  const lab = (s: string, kk: string, p: V, anchor: 'start' | 'end'): string => T(p[0] + (anchor === 'start' ? 6 : -6), p[1] - 6, s, 'pa-atom', anchor, kk);
  return {
    group: gEnd,
    svg: `${room(`${k}-room`, curve(loop, true))}
      <path class="pa-bond" d="${bonds}"/><path class="pa-coord" d="${coord}"/>
      <circle class="pa-mg" cx="${f1(C[0])}" cy="${f1(C[1])}" r="21"/>${T(C[0], C[1] + 8, 'Mg', 'pa-atom', 'middle')}
      ${T(o[0] + 8, o[1] + 22, 'O', 'pa-atom', 'middle')}
      ${lab('CH₃', `${k}-ch3`, gEnd, 'start')}${withB ? lab('CHO', `${k}-cho`, gEnd, 'start') : ''}`,
  };
}

/** A straight polyene chain of n double bonds, as a zig-zag; returns its drawing and its conjugated path. */
function chain(cx: number, cy: number, n: number, dx = 21, amp = 9): { svg: string; path: string; w: number } {
  const m = 2 * n, x0 = cx - ((m - 1) * dx) / 2, p: V[] = Array.from({ length: m }, (_, i) => [x0 + i * dx, cy + (i % 2 ? -amp : amp)] as V);
  let d = '';
  for (let i = 0; i < m - 1; i++) d += bond(p[i], p[i + 1], i % 2 === 0, [cx, cy + (i % 2 ? 40 : -40)]);
  return { svg: `<path class="pa-bond" d="${d}"/>`, path: `M${p.map(pt).join('L')}`, w: (m - 1) * dx };
}

/** β-carotene: a ring at each end of a chain of nine double bonds; with the rings' two, eleven are conjugated. */
function carotene(cx: number, cy: number): { svg: string; path: string } {
  const dx = 32, amp = 10, nb = 19, x0 = cx - (nb * dx) / 2;
  const p: V[] = Array.from({ length: nb + 1 }, (_, i) => [x0 + i * dx, cy + (i % 2 ? -amp : amp)] as V);
  let d = '';
  for (let i = 0; i < nb; i++) d += bond(p[i], p[i + 1], i % 2 === 1, [x0 + (i + 0.5) * dx, cy + (i % 2 ? 40 : -40)]);
  // Methyl branches at C9, C13, C13′ and C9′.
  [3, 7, 12, 16].forEach(i => { d += bond(p[i], add(p[i], [0, i % 2 ? -26 : 26])); });
  // The rings: hexagons with C6 at p0 and p19; C5=C6 in each is conjugated with the chain.
  const r = 32, ringAt = (v: V, side: number): { d: string; c5: V } => {
    const c: V = [v[0] - side * r, v[1] + 4], pts = [0, 1, 2, 3, 4, 5].map(j => add(c, mul(polar((side > 0 ? 0 : 180) + 60 * j * side), r)));
    pts[0] = v;
    let s = '';
    pts.forEach((q, j) => { s += bond(q, pts[(j + 1) % 6], j === 0, c); });
    s += bond(pts[1], add(pts[1], mul(unit(sub(pts[1], c)), 24))); // methyl on C5
    s += bond(pts[4], add(pts[4], mul(polar(side > 0 ? -150 : -30), 24))) + bond(pts[4], add(pts[4], mul(polar(side > 0 ? 150 : 30), 24))); // C1 gem-dimethyl
    return { d: s, c5: pts[1] };
  };
  const L = ringAt(p[0], 1), R = ringAt(p[nb], -1);
  return { svg: `<path class="pa-bond" d="${d}${L.d}${R.d}"/>`, path: `M${pt(L.c5)}L${p.map(pt).join('L')}L${pt(R.c5)}` };
}

/* ---------------------------------------------------------------- scene 1: leaf, chloroplast, chlorophyll */

const LEAF_F: V = [905, 352]; // where the chloroplast is, on the leaf
const CHL_F: V = [800, 370]; // the chloroplast's centre
const THY_F: V = [895, 401]; // where the chlorophyll is, on a thylakoid
const MC: V = [600, 300], SC1 = 1.4; // the chlorophyll ring's centre and its drawing scale
const Z_LEAF = 6, Z_CHL = 6;

function chloroplast(): string {
  const stacks = [-285, -190, -95, 0, 95, 190, 285].map((dx, i) => {
    const x = 800 + dx, y0 = 370 + (i % 2 ? -38 : 38) - 39;
    return Array.from({ length: 6 }, (_, j) => `<rect class="pa-thy" x="${x - 33}" y="${f1(y0 + j * 13)}" width="66" height="11" rx="5.5"/>`).join('');
  }).join('');
  const lam = [-285, -190, -95, 0, 95, 190].map((dx, i) => `M${800 + dx + 33},${370 + (i % 2 ? -12 : 12)}L${800 + dx + 62},${370 + (i % 2 ? 12 : -12)}`).join('');
  return `<ellipse class="pa-env" cx="800" cy="370" rx="405" ry="190"/><ellipse class="pa-env2" cx="800" cy="370" rx="392" ry="177"/>
    <path class="pa-lam" d="${lam}"/>${stacks}`;
}

/* ---------------------------------------------------------------- scene 2: three chains and their ladders */

// Columns: double bonds, centre x, the photon that fits (nm), its ink and its name.
const COLS2: Array<{ n: number; x: number; nm: number; up: number; ink: Ink; name: string }> = [
  { n: 3, x: 270, nm: 258, up: eV(258), ink: 'uv', name: 'ultraviolet' },
  { n: 5, x: 640, nm: 334, up: eV(334), ink: 'uv', name: 'ultraviolet' },
  { n: 11, x: 1170, nm: 450, up: eV(478), ink: 'b', name: 'blue' },
];
const Y0_2 = 610, K2 = 55, CHAIN_Y = 205; // lower rung, px per eV, chain row
const SUB_EV = [eV(450), eV(425)]; // β-carotene's sublevels above its lowest band
const lad2 = (i: number): { y1: number; ytop: number } => ({ y1: Y0_2 - COLS2[i].up * K2, ytop: Y0_2 - eV(COLS2[i].nm) * K2 });
// The pan: from close on the first chain to all three.
const PAN0 = { p: [270, 420] as V, c: [520, 370] as V, s: 1.2 }; // the whole first column in view
const panView = (u: number): Tf => {
  const s = PAN0.s ** (1 - u), p = lerpV(PAN0.p, [800, 370], u), c = lerpV(PAN0.c, [800, 370], u);
  return { s, t: sub(c, mul(p, s)) };
};

function scene2(): string {
  return COLS2.map((c, i) => {
    const ch = chain(c.x, CHAIN_Y, c.n), { y1, ytop } = lad2(i);
    const subs = i === 2 ? SUB_EV.map(e => `<path class="pa-sub" d="M${c.x - 62},${f1(Y0_2 - e * K2)}H${c.x + 62}"/>`).join('') : '';
    const j: Jump = { k: `j2${i}`, ink: c.ink, nm: c.nm, x: c.x - 16, y0: Y0_2, y1: ytop, from: 0, label: c.name };
    return `<g data-k="c2${i}">
      ${room(`r2${i}`, ch.path)}${ch.svg}${T(c.x, CHAIN_Y - 58, `${c.n} double bonds`, 'pa-lab', 'middle', `n2${i}`)}
      <g data-k="l2${i}"><path class="pa-rung" d="M${c.x - 62},${Y0_2}H${c.x + 62}"/><path class="pa-rung" data-k="u2${i}" d="M${c.x - 62},${f1(y1)}H${c.x + 62}"/>${subs}
        <circle class="pa-e0" cx="${c.x + 16}" cy="${Y0_2}" r="7"/>
        ${i === 0 ? `<path class="pa-brace" data-k="brace" d="M${c.x + 78},${Y0_2}h10V${f1(y1)}h-10"/>${T(c.x + 100, (Y0_2 + y1) / 2 + 8, 'gap', 'pa-lab', 'start', 'gaplab')}` : ''}
        ${jumpSvg(j)}</g>
    </g>`;
  }).join('') + eAxis(40, 650, 300);
}

/* ---------------------------------------------------------------- scene 3: β-carotene */

const CAR = carotene(600, 360);
const LAD3 = { x: 1250, y0: 600, k: 100 };
const Y3 = (e: number): number => LAD3.y0 - e * LAD3.k;
const J3: Jump = { k: 'j3', ink: 'bg', nm: 480, x: LAD3.x - 16, y0: LAD3.y0, y1: Y3(eV(480)), from: 0, label: 'blue-green light', lx: LAD3.x - 60 };
const scene3 = (): string => `${room('r3', CAR.path)}${CAR.svg}${T(600, 256, 'β-carotene', 'pa-title', 'middle')}
  ${eAxis(LAD3.x - 120, 630, 290)}
  <path class="pa-rung" d="M${LAD3.x - 70},${LAD3.y0}H${LAD3.x + 70}"/><path class="pa-rung" d="M${LAD3.x - 70},${f1(Y3(eV(478)))}H${LAD3.x + 70}"/>
  ${SUB_EV.map(e => `<path class="pa-sub" d="M${LAD3.x - 70},${f1(Y3(e))}H${LAD3.x + 70}"/>`).join('')}
  <circle class="pa-e0" cx="${LAD3.x + 16}" cy="${LAD3.y0}" r="7"/>${jumpSvg(J3)}`;

/* ---------------------------------------------------------------- scene 4: chlorophyll a turns into b */

const MC4: V = [440, 300];
const CHL4 = chlorophyll(MC4, 'm4', 1.15, true);
const LAD4 = { x: 1130, y0: 640, k: 160 };
const Y4 = (nm: number): number => LAD4.y0 - eV(nm) * LAD4.k;
const BANDS4 = [
  { key: 'red', a: 662, b: 642, ink: 'r' as Ink, name: 'red band', ax: LAD4.x - 10 },
  { key: 'blue', a: 430, b: 453, ink: 'b' as Ink, name: 'blue band', ax: LAD4.x - 50 },
];
const scene4 = (): string => `${CHL4.svg}
  <circle class="pa-swap" cx="${f1(CHL4.group[0] + 28)}" cy="${f1(CHL4.group[1] - 14)}" r="40" data-k="swapring"/>
  ${T(150, 112, 'Chl a', 'pa-title', 'start', 'ta')}${T(150, 112, 'Chl b', 'pa-title', 'start', 'tb')}
  ${eAxis(LAD4.x - 160, 670, 150)}
  <path class="pa-rung" d="M${LAD4.x - 90},${LAD4.y0}H${LAD4.x + 90}"/>
  <circle class="pa-e0" cx="${LAD4.x + 20}" cy="${LAD4.y0}" r="7"/><circle class="pa-e0" cx="${LAD4.x + 44}" cy="${LAD4.y0}" r="7"/>
  ${BANDS4.map(b => `<path class="pa-ghost" data-k="g4${b.key}" d="M${LAD4.x - 90},${f1(Y4(b.a))}H${LAD4.x + 90}"/>
    <path class="pa-rung" data-k="u4${b.key}" d="M${LAD4.x - 90},${f1(Y4(b.a))}H${LAD4.x + 90}"/>
    <path class="pa-ar" data-k="a4${b.key}" style="stroke:${inkOf(b.ink)}" marker-end="url(#${ID}-h${b.ink})"/>
    ${T(LAD4.x + 110, 0, b.name, `pa-lab pa-band pa-band-${b.key}`, 'start', `n4${b.key}`)}
    ${T(LAD4.x + 110, 0, `${b.a} nm`, 'pa-lab', 'start', `v4${b.key}a`)}${T(LAD4.x + 110, 0, `${b.a} → ${b.b} nm`, 'pa-lab', 'start', `v4${b.key}b`)}`).join('')}`;

/* ---------------------------------------------------------------- scene 5: the spectra together */

const SX = (nm: number): number => 380 + ((nm - 400) / 300) * 960;
const ROWS: Array<{ k: Pig | 'all'; name: string; top: number }> = [
  { k: 'a', name: 'Chl a', top: 64 }, { k: 'b', name: 'Chl b', top: 182 }, { k: 'car', name: 'β-carotene', top: 300 }, { k: 'all', name: 'together', top: 432 },
];
const ROW_H = 96, AXIS_Y = 562;
const absAll = (nm: number): number => Math.max(absorb('a', nm), absorb('b', nm), absorb('car', nm));
const absRow = (k: Pig | 'all', nm: number): number => (k === 'all' ? absAll(nm) : absorb(k, nm));
function scene5(): string {
  const grads = ROWS.map((r, i) => {
    const nms = Array.from({ length: 61 }, (_, j) => 400 + j * 5);
    return `<linearGradient id="${ID}-sg${i}" gradientUnits="userSpaceOnUse" x1="${SX(400)}" y1="0" x2="${SX(700)}" y2="0">${nms.map((nm, j) => `<stop offset="${(j / 60).toFixed(4)}" stop-color="${col(nm)}"/>`).join('')}</linearGradient>
      <clipPath id="${ID}-sc${i}"><rect data-k="sc${i}" x="${SX(400) - 4}" y="${r.top - 10}" width="0" height="${ROW_H + 20}"/></clipPath>`;
  }).join('');
  const rows = ROWS.map((r, i) => {
    const yb = r.top + ROW_H, pts = Array.from({ length: 151 }, (_, j) => 400 + j * 2).map(nm => `${f1(SX(nm))},${f1(yb - absRow(r.k, nm) * (ROW_H - 6))}`);
    return `<path class="pa-base" d="M${SX(400)},${yb}H${SX(700)}"/>
      <g clip-path="url(#${ID}-sc${i})"><path class="pa-area" fill="url(#${ID}-sg${i})" d="M${SX(400)},${yb}L${pts.join('L')}L${SX(700)},${yb}Z"/>
      <path class="pa-curve pa-curve-${r.k}" d="M${pts.join('L')}"/></g>
      ${T(SX(400) - 22, r.top + ROW_H / 2 + 9, r.name, `pa-lab pa-row pa-row-${r.k}`, 'end', `rl${i}`)}`;
  }).join('');
  const ticks = [400, 500, 600, 700].map(nm => `<path class="pa-tick" d="M${f1(SX(nm))},${AXIS_Y}v9"/>${T(SX(nm), AXIS_Y + 36, `${nm}`, 'pa-lab', 'middle')}`).join('');
  return `<defs>${grads}</defs>${rows}<path class="pa-xaxis" d="M${SX(400)},${AXIS_Y}H${SX(700)}"/>${ticks}
    ${T(SX(550), AXIS_Y + 76, 'wavelength (nm)', 'pa-lab', 'middle')}
    <text class="pa-ax" transform="translate(150 ${(ROWS[0].top + ROWS[3].top + ROW_H) / 2}) rotate(-90)" text-anchor="middle">absorption</text>
    ${T(SX(550), ROWS[3].top + 34, 'green: weakest', 'pa-lab pa-weak', 'middle', 'weak')}`;
}

/* ---------------------------------------------------------------- staging */

const TEND = [4.9, 3.9, 2.3, 3.7, 3.4]; // when each beat's motion is over, s
const PAN_W = 1700; // "Chl a → Chl b" pans this far from β-carotene to chlorophyll
const O: V = [800, 370];

export const STAGING: Staging = {
  id: 'a',
  name: 'A · Zoom into the molecule',
  note: 'Each molecule zoomed into, with its energy ladder beside it.',
  svg: () => {
    const m1 = chlorophyll(MC, 'm1', SC1, false);
    const heads = (['uv', 'b', 'bg', 'r'] as Ink[]).map(k => `<marker id="${ID}-h${k}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path fill="${inkOf(k)}" d="M0,0L10,5L0,10z"/></marker>`).join('');
    return `<defs>${heads}
      <marker id="${ID}-hgrey" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path fill="#8a877d" d="M0,0L10,5L0,10z"/></marker>
      <radialGradient id="${ID}-glow"><stop offset="0" stop-color="#f6c453" stop-opacity=".95"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".45"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient>
      <filter id="${ID}-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <g class="pa-scene" data-k="s-leaf">${leaf(800, 380, 900, 400, -8)}</g>
    <g class="pa-scene" data-k="s-chl">${chloroplast()}</g>
    <g class="pa-scene" data-k="s-mol">${m1.svg}</g>
    <g class="pa-scene" data-k="s-chains">${scene2()}</g>
    <g class="pa-scene" data-k="s-car">${scene3()}</g>
    <g class="pa-scene" data-k="s-chlb">${scene4()}</g>
    <g class="pa-scene" data-k="s-spec">${scene5()}</g>
    ${T(1190, 600, 'leaf', 'pa-lab', 'start', 'l-leaf')}${T(800, 612, 'chloroplast', 'pa-lab', 'middle', 'l-chl')}
    ${T(150, 112, 'chlorophyll', 'pa-title', 'start', 'l-mol')}
    <g data-k="l-room"><path class="pa-lead" d="M${f1(MC[0] + 186 * SC1)},${MC[1] - 8}L${f1(MC[0] + 122 * SC1)},${MC[1]}"/>${T(MC[0] + 194 * SC1, MC[1] - 2, 'electrons’ room', 'pa-lab pa-amber', 'start')}</g>`;
  },

  bind(stage) {
    const q = <E extends Element>(k: string): E => stage.querySelector(`[data-k="${k}"]`) as E;
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
    const scene = (k: string, v: Tf, o: number): void => { const el = q(k); op(el, o); if (o > 0.004) set(el, 'transform', tfStr(v)); };

    /** Draws one absorption at progress: packet flight p (0→1), then the jump j (0→1). */
    function jump(J: Jump, pFly: number, pJump: number, labOn: number): void {
      const pk = q(`${J.k}-pk`), ar = q(`${J.k}-ar`), e = q(`${J.k}-e`), gl = q(`${J.k}-gl`), lab = q(`${J.k}-lab`);
      const xs = J.x - 190, xe = J.x - 34, yP = J.y0 + 40;
      set(pk, 'd', packet(lerp(xs, xe, easeOut(pFly)), yP, J.nm));
      op(pk, pFly <= 0 ? 0 : 1 - tw(pJump, 0, 0.35));
      const yTop = lerp(J.y0 - 6, J.y1 + 8, smooth(pJump));
      set(ar, 'd', pJump > 0 ? `M${J.x},${J.y0 - 6}L${J.x},${f1(yTop)}` : '');
      op(ar, pJump > 0 ? 1 : 0);
      const ye = lerp(J.y0, J.y1, smooth((pJump - 0.15) / 0.85));
      set(e, 'cx', f1(J.x)); set(e, 'cy', f1(ye));
      set(e, 'class', pJump >= 0.6 ? 'pa-e pa-e-on' : 'pa-e');
      set(gl, 'cx', f1(J.x)); set(gl, 'cy', f1(ye)); op(gl, tw(pJump, 0.55, 1));
      op(lab, labOn);
    }

    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(4, Math.round(beatIn)));
      const key = `${b}:${Math.max(0, Math.min(t, TEND[b])).toFixed(3)}`;
      if (key === last) return;
      last = key;
      const tb = (k: number): number => (b === k ? Math.max(0, t) : b > k ? 99 : 0);
      const t0 = tb(0), t1 = tb(1), t2 = tb(2), t3 = tb(3), t4 = tb(4);
      const hide = ['s-leaf', 's-chl', 's-mol', 's-chains', 's-car', 's-chlb', 's-spec'];
      const shown = new Map<string, [Tf, number]>();

      // Beat 1: leaf → chloroplast → chlorophyll; the ring's room glows.
      const e1 = smoother((t0 - 0.5) / 1.5), e2 = smoother((t0 - 2.6) / 1.5);
      const MOL_F = MC;
      if (b === 0) {
        if (e2 <= 0) {
          const [va, vb] = dive(LEAF_F, CHL_F, Z_LEAF, e1);
          shown.set('s-leaf', [va, fadeOut(e1)]); shown.set('s-chl', [vb, fadeIn(e1)]);
        } else {
          const [va, vb] = dive(THY_F, MOL_F, Z_CHL, e2);
          shown.set('s-chl', [va, 1 - tw(e2, 0.3, 0.6)]); shown.set('s-mol', [vb, tw(e2, 0.45, 0.75)]); // the stacks clear before the molecule shows
        }
      }
      const glow1 = tw(t0, 4.1, 4.7);
      op(q('l-leaf'), b === 0 ? 1 - tw(t0, 0.5, 0.75) : 0);
      op(q('l-chl'), b === 0 ? tw(t0, 1.9, 2.15) * (1 - tw(t0, 2.6, 2.85)) : 0);

      // Beat 2: the chlorophyll fades out in place as the chains fade in, close on the first; the camera pans across all
      // three as each ladder grows. A column shows only once it is wholly on the stage, so no label is ever cut.
      const u = smoother((t1 - 1.0) / 1.9);
      if (b === 1) {
        shown.set('s-mol', [ID_TF, 1 - tw(t1, 0, 0.45)]);
        shown.set('s-chains', [panView(u), tw(t1, 0.3, 0.7)]);
      }
      const view2 = b === 1 ? panView(u) : ID_TF;
      COLS2.forEach((c, i) => op(q(`c2${i}`), smooth((1570 - apply(view2, [c.x + [80, 94, 222][i], 0])[0]) / 50)));
      op(q('l-mol'), b === 0 ? tw(t0, 4.1, 4.35) : b === 1 ? 1 - tw(t1, 0, 0.3) : 0);
      op(q('l-room'), b === 0 ? tw(t0, 4.6, 4.85) : b === 1 ? 1 - tw(t1, 0, 0.3) : 0);
      set(q('m1-room-line'), 'stroke-dashoffset', (1 - glow1).toFixed(3));
      op(q('m1-room'), b === 0 ? glow1 : b === 1 ? 1 : 0);
      [0.9, 1.8, 2.6].forEach((s0, i) => {
        const tt = t1 - s0, J: Jump = { k: `j2${i}`, ink: COLS2[i].ink, nm: COLS2[i].nm, x: COLS2[i].x - 16, y0: Y0_2, y1: lad2(i).ytop, from: 0, label: COLS2[i].name };
        op(q(`l2${i}`), tw(tt, 0, 0.25));
        const grow = smooth((tt - 0.1) / 0.4), y1 = lerp(Y0_2, lad2(i).y1, grow);
        set(q(`u2${i}`), 'd', `M${COLS2[i].x - 62},${f1(y1)}H${COLS2[i].x + 62}`);
        if (i === 0) { // the gap brace grows with the rung
          set(q('brace'), 'd', `M${COLS2[0].x + 78},${Y0_2}h10V${f1(y1)}h-10`);
          set(q('gaplab'), 'y', f1((Y0_2 + y1) / 2 + 8)); op(q('gaplab'), tw(tt, 0.4, 0.65));
        }
        jump(J, clamp01((tt - 0.4) / 0.5), clamp01((tt - 0.9) / 0.4), tw(tt, 0.4, 0.65));
        op(q(`r2${i}`), 0.45 + 0.55 * tw(tt, 1.0, 1.3));
        set(q(`r2${i}-line`), 'stroke-dashoffset', '0');
      });

      // Beat 3: the chains fade out as β-carotene fades in; a blue-green photon fits its lowest band and is absorbed.
      if (b === 2) { shown.set('s-chains', [ID_TF, 1 - tw(t2, 0, 0.45)]); shown.set('s-car', [ID_TF, tw(t2, 0.3, 0.7)]); }
      jump(J3, clamp01((t2 - 1.2) / 0.6), clamp01((t2 - 1.8) / 0.45), b === 2 ? tw(t2, 1.2, 1.45) : b > 2 ? 1 : 0);
      op(q('r3'), 0.45 + 0.55 * tw(t2, 1.9, 2.25)); set(q('r3-line'), 'stroke-dashoffset', '0');

      // Beat 4: pan to chlorophyll; –CH₃ becomes –CHO; the rungs nudge, red band 662 → 642 nm, blue band 430 → 453 nm.
      const e5 = smoother(t3 / 1.6);
      if (b === 3) {
        const s = 1 - 0.18 * Math.sin(Math.PI * e5);
        const view = (dx: number): Tf => ({ s, t: add(mul([dx, 0], s), mul(O, 1 - s)) });
        shown.set('s-car', [view(-PAN_W * e5), 1]); shown.set('s-chlb', [view(PAN_W * (1 - e5)), 1]);
      }
      const swap = tw(t3, 1.8, 2.1), nudge = smooth((t3 - 2.3) / 1.0), nums = tw(t3, 3.3, 3.6);
      op(q('m4-ch3'), 1 - swap); op(q('m4-cho'), swap); op(q('swapring'), swap); op(q('ta'), 1 - swap); op(q('tb'), swap);
      op(q('m4-room'), 0.45); set(q('m4-room-line'), 'stroke-dashoffset', '0');
      BANDS4.forEach(bd => {
        const y = lerp(Y4(bd.a), Y4(bd.b), nudge);
        set(q(`u4${bd.key}`), 'd', `M${LAD4.x - 90},${f1(y)}H${LAD4.x + 90}`);
        op(q(`g4${bd.key}`), tw(t3, 2.3, 2.55));
        set(q(`a4${bd.key}`), 'd', `M${bd.ax},${LAD4.y0 - 6}L${bd.ax},${f1(y + 8)}`);
        const ln = q(`n4${bd.key}`), va = q(`v4${bd.key}a`), vb = q(`v4${bd.key}b`);
        set(ln, 'y', f1(y - 6)); set(va, 'y', f1(y + 22)); set(vb, 'y', f1(y + 22));
        op(va, 1 - nums); op(vb, nums);
      });

      // Beat 5: Chl b fades out as the spectra fade in; the three rows draw in, then all three together; green stays
      // weakest.
      if (b === 4) { shown.set('s-chlb', [ID_TF, 1 - tw(t4, 0, 0.45)]); shown.set('s-spec', [ID_TF, tw(t4, 0.3, 0.7)]); }
      [0.8, 1.3, 1.8, 2.4].forEach((s0, i) => {
        set(q(`sc${i}`), 'width', f1((SX(700) - SX(400) + 8) * smooth((t4 - s0) / 0.6)));
        op(q(`rl${i}`), tw(t4, s0, s0 + 0.25));
      });
      op(q('weak'), tw(t4, 3.1, 3.35));

      // Static ends of each beat: the scene that holds.
      if (b === 0 && e2 >= 1) shown.set('s-mol', [ID_TF, 1]);
      hide.forEach(k => { const v = shown.get(k); scene(k, v ? v[0] : ID_TF, v ? v[1] : 0); });
    };
  },
};
