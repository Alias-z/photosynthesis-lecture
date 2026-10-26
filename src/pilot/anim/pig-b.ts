// Why pigments differ, staging B "Ladder first". One big energy ladder stands in the centre for the whole animation;
// each molecule appears beside it in turn and the ladder's rungs move to that molecule's gaps.
// - Energies to scale: E = 1239.84 eV·nm / λ, 120 px per eV, S₀ at 0 eV. A photon arrives from the right at the height
//   of its energy; where it meets a rung, an arrow lifts the electron (amber) from S₀ to that rung.
// - Chl a 430 / 662 nm and Chl b 453 / 642 nm (in solvent). Polyenes: 3 double bonds 258 nm, 5 double bonds 334 nm,
//   11 double bonds (β-carotene's length) about 450 nm; β-carotene absorbs about 400–500 nm. For chains and carotenoids
//   the strongly absorbing state is not S₁ (their S₁ is dark), so their rung is called "excited state", not S₁.
// - The conjugated system is drawn as the electrons' "room" in amber: the free-electron model (Kuhn 1949), a stated
//   simplification; real orbitals are not drawn.
// - Beat 1 zooms leaf → chloroplast → one chlorophyll: three layers scaled about one point, faded by zoom.
// - draw(beat, t) depends on beat and t only; each beat starts from the previous beat's end state.
import './pig-b.css';
import { spec } from '../../lib/colour';
import { leaf } from '../figs/s2';
import type { Staging } from './types';

type V = [number, number];
const ID = 'pigb';
const f = (v: number): string => v.toFixed(1);
const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
const smooth = (x: number): number => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const smoother = (x: number): number => { const u = clamp01(x); return u * u * u * (u * (u * 6 - 15) + 10); };
const easeOut = (x: number): number => { const u = clamp01(x); return 1 - (1 - u) ** 3; };
const lerp = (a: number, b: number, e: number): number => a + (b - a) * e;
/** 0 → 1 over the time window [t0, t1]. */
const tw = (t: number, t0: number, t1: number): number => smooth((t - t0) / (t1 - t0));
const polar = (r: number, deg: number): V => [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
type A = 'start' | 'middle' | 'end';
const T = (x: number, y: number, s: string, cls: string, a: A = 'start', extra = ''): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}"${extra}>${s}</text>`;
const pts = (p: V[]): string => p.map((q, i) => `${i ? 'L' : 'M'}${f(q[0])},${f(q[1])}`).join('');

/* ---------------------------------------------------------------- the ladder (stage px) */

const AX = 560, Y0 = 680, KE = 120; // energy axis x, S₀ height, px per eV
const RL0 = 650, RL1 = 1060, JX = 1020; // rung ends; where the lifting arrows stand
const PCX = 1122, PLX = 1185; // a photon's resting centre and its label
const yOf = (nm: number): number => Y0 - (1239.84 / nm) * KE;

type Ink = 'uv' | 'b' | 'bg' | 'r' | 'grey';
const INK: Record<Ink, string> = { uv: '#7b4fb3', b: '#2350e6', bg: '#16889a', r: '#c8361e', grey: '#8a877d' };
const inkOf = (nm: number): Ink => (nm < 400 ? 'uv' : nm < 470 ? 'b' : nm < 520 ? 'bg' : 'r');
const NAME: Record<Ink, string> = { uv: 'ultraviolet', b: 'blue', bg: 'blue-green', r: 'red', grey: '' };

/** A photon as a wave packet in its colour, wavelength in proportion (0.05 px per nm), bell-shaped envelope. */
function packet(nm: number, cx: number, cy: number, len = 104, amp = 10): string {
  const lam = nm * 0.05, n = 120, p: V[] = [];
  for (let i = 0; i <= n; i++) {
    const u = (i / n - 0.5) * len, env = Math.exp(-((u / (len * 0.3)) ** 2));
    p.push([cx + u, cy + Math.sin((2 * Math.PI * u) / lam) * amp * env]);
  }
  return `<path class="pb-pk" stroke="${INK[inkOf(nm)]}" d="${pts(p)}"/>`;
}
const glowDot = (x: number, y: number, o = 1): string =>
  `<g opacity="${o.toFixed(3)}"><circle cx="${f(x)}" cy="${f(y)}" r="22" fill="url(#${ID}-glow)"/><circle class="pb-e" cx="${f(x)}" cy="${f(y)}" r="7"/></g>`;

interface Photon {
  nm: number; y: number; arrive: number; // the time its centre reaches the ladder (s); the lift follows
  o?: number; dim?: number; label?: string; labelO?: number; liftO?: number; jx?: number;
}
/** A photon flying in from the right at its energy's height, the arrow it lifts the electron with, and its label. */
function photonMarkup(p: Photon, t: number): string {
  const fly = easeOut((t - (p.arrive - 0.8)) / 0.8), o = (p.o ?? 1) * (p.dim ?? 1);
  if (fly <= 0 || o <= 0.004) return '';
  const cx = lerp(1720, PCX, fly), k = inkOf(p.nm), lift = clamp01((t - p.arrive + 0.05) / 0.4), lo0 = p.liftO ?? 1;
  let s = `<g opacity="${o.toFixed(3)}">${packet(p.nm, cx, p.y)}`;
  if (lift > 0 && lo0 > 0.004) {
    const g = easeOut(lift), y1 = lerp(Y0 - 4, p.y + 8, g), jx = p.jx ?? JX;
    s += `<g opacity="${lo0.toFixed(3)}"><path class="pb-lift" stroke="${INK[k]}" d="M${jx},${Y0 - 4}L${jx},${f(y1)}" marker-end="url(#${ID}-m-${k})"/>`;
    if (g > 0.98) s += glowDot(jx, p.y, smooth((lift - 0.9) / 0.1));
    s += '</g>';
  }
  const lo = (p.labelO ?? 1) * tw(t, p.arrive - 0.15, p.arrive + 0.15);
  if (lo > 0) s += `<g opacity="${lo.toFixed(3)}">${T(PLX, p.y + 8, p.label ?? `<tspan class="pb-ink" fill="${INK[k]}">${NAME[k]}</tspan> · ${p.nm} nm`, 'pb-lab')}</g>`;
  return `${s}</g>`;
}
const rung = (y: number, cls = 'pb-rung', o = 1): string =>
  o <= 0.004 ? '' : `<path class="${cls}" opacity="${o.toFixed(3)}" d="M${RL0},${f(y)}H${RL1}"/>`;

/* ---------------------------------------------------------------- molecules (stage px) */

const F: V = [300, 330]; // chlorophyll's centre: the point the beat-1 zoom closes in on
const RINGS = [-135, -45, 45, 135]; // pyrrole rings I–IV around the centre
const PC = 88, PR = 30; // pentagon centre distance and circumradius
const ringC = (th: number): V => add(F, polar(PC, th));
const ringV = (th: number, k: number): V => add(ringC(th), polar(PR, th + 180 + 72 * k)); // k = 0 is N
const meso = (th: number): V => add(F, polar(89.4, th + 45));
const BETA2 = ringV(-45, 2), GRP_END = add(BETA2, polar(26, -9)); // ring II's outer carbon and its side group

function chlorophyll(): string {
  const bonds: string[] = [], dbl: string[] = [];
  for (const th of RINGS) {
    const v = [0, 1, 2, 3, 4].map(k => ringV(th, k));
    bonds.push(pts([...v, v[0]]));
    // the outer Cβ=Cβ double bond, drawn inside the ring
    const c = ringC(th), a = v[2], b = v[3], s = 0.78;
    dbl.push(pts([[c[0] + (a[0] - c[0]) * s, c[1] + (a[1] - c[1]) * s], [c[0] + (b[0] - c[0]) * s, c[1] + (b[1] - c[1]) * s]]));
    // the bridge to the next ring, through its meso carbon
    const m = meso(th), next = th + 90;
    bonds.push(pts([ringV(th, 4), m, ringV(next, 1)]));
  }
  // the room: the conjugated loop through every α and meso carbon
  const loop: V[] = [];
  for (const th of RINGS) loop.push(ringV(th, 1), ringV(th, 4), meso(th));
  loop.sort((p, q) => Math.atan2(p[1] - F[1], p[0] - F[0]) - Math.atan2(q[1] - F[1], q[0] - F[0]));
  const room = `${pts(loop)}Z`;
  // Mg bound to the four N
  const mg = RINGS.map(th => { const n = ringV(th, 0), d = polar(1, th); return pts([add(F, [d[0] * 18, d[1] * 18]), add(n, [-d[0] * 11, -d[1] * 11])]); }).join('');
  // the phytol tail, from ring IV, down to the lower left
  const t0 = ringV(135, 3), tail: V[] = [t0];
  for (let i = 1; i <= 12; i++) { const prev = tail[i - 1]; tail.push(add(prev, polar(24, 112 + (i % 2 ? -30 : 30)))); }
  const nLab = RINGS.map(th => { const n = ringV(th, 0); return `<circle class="pb-atom-bg" cx="${f(n[0])}" cy="${f(n[1])}" r="11"/>${T(n[0], n[1] + 7.5, 'N', 'pb-atom', 'middle')}`; }).join('');
  return `<path class="pb-room" data-k="room" d="${room}"/>
    <path class="pb-bond" d="${bonds.join('')}${pts(tail)}${pts([BETA2, GRP_END])}"/><path class="pb-bond pb-dbl" d="${dbl.join('')}"/>
    <path class="pb-mgb" d="${mg}"/>${nLab}${T(F[0], F[1] + 8.5, 'Mg', 'pb-atom pb-mg', 'middle')}
    <g data-k="grpA">${T(GRP_END[0] + 4, GRP_END[1] + 9, 'CH₃', 'pb-grp')}</g>
    <g data-k="grpB">${T(GRP_END[0] + 4, GRP_END[1] + 9, 'CHO', 'pb-grp pb-grp-new')}</g>`;
}

/** A conjugated zig-zag chain with n double bonds starting at (x0, y); `step` px per bond across. */
function chainPts(n: number, x0: number, y: number, step: number): V[] {
  return Array.from({ length: 2 * n }, (_, i) => [x0 + i * step, y + (i % 2 ? -9 : 9)] as V);
}
const chainEnd = (c: { n: number; x0: number; step: number }): number => c.x0 + (2 * c.n - 1) * c.step;
function chain(n: number, x0: number, y: number, step: number, k: string, label: string): string {
  const p = chainPts(n, x0, y, step), dbl: string[] = [];
  for (let i = 0; i < p.length - 1; i += 2) { // every other bond is double: a second, shorter line beside it
    const a = p[i], b = p[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / L * 5.5, ny = (b[0] - a[0]) / L * 5.5;
    const sh = (q: V, w: V): V => [q[0] + (w[0] - q[0]) * 0.2 + nx, q[1] + (w[1] - q[1]) * 0.2 + ny];
    dbl.push(pts([sh(a, b), sh(b, a)]));
  }
  return `<g data-k="${k}"><path class="pb-room" d="${pts(p)}"/><path class="pb-bond" d="${pts(p)}"/><path class="pb-bond pb-dbl" d="${dbl.join('')}"/>
    ${T(p[0][0], y - 34, label, 'pb-lab pb-mlab', 'start', ` data-k="${k}-lab"`)}</g>`;
}
const CH3 = { n: 3, nm: 258, x0: 100, step: 21 }, CH5 = { n: 5, nm: 334, x0: 100, step: 21 }, CH11 = { n: 11, nm: 450, x0: 100, step: 19 };
/** β-carotene's end rings on the 11-double-bond chain: hexagons sharing the chain's end carbons. */
function caroteneRings(): string {
  const p = chainPts(CH11.n, CH11.x0, yOf(CH11.nm), CH11.step), r = 22;
  const hex = (c: V): string => `${pts([0, 1, 2, 3, 4, 5].map(i => add(c, polar(r, i * 60 + 30))))}Z`;
  const a = p[0], b = p[p.length - 1];
  return `<path class="pb-bond" d="${hex([a[0] - r * Math.cos(Math.PI / 6), a[1] + r / 2])}${hex([b[0] + r * Math.cos(Math.PI / 6), b[1] - r / 2])}"/>`;
}

/* ---------------------------------------------------------------- beat 1: leaf → chloroplast → chlorophyll */

const Z1 = 14, Z2 = 160; // the zoom at which the chloroplast, and the molecule, appear at their drawn size
function leafLayer(): string {
  let s = 5, cells = '';
  const rnd = (): number => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const lc: V = [F[0] + 30, F[1] + 20], rot = -18, ca = Math.cos((rot * Math.PI) / 180), sa = Math.sin((rot * Math.PI) / 180);
  for (let i = 0; i < 60; i++) { // chloroplasts in the leaf, as small green ovals inside the blade
    const u = (rnd() - 0.5) * 380, v = (rnd() - 0.5) * 150 * (1 - (u / 215) ** 2);
    const x = lc[0] + u * ca - v * sa, y = lc[1] + u * sa + v * ca;
    if (Math.hypot(x - F[0], y - F[1]) < 30) continue;
    cells += `<ellipse class="pb-cp-dot" cx="${f(x)}" cy="${f(y)}" rx="11" ry="6" transform="rotate(${Math.round(rnd() * 180)} ${f(x)} ${f(y)})"/>`;
  }
  const c0: V = [F[0] - 60 / Z1, F[1] + 20 / Z1];
  cells += `<ellipse class="pb-cp-dot" cx="${f(c0[0])}" cy="${f(c0[1])}" rx="${f(230 / Z1)}" ry="${f(120 / Z1)}" transform="rotate(-18 ${f(c0[0])} ${f(c0[1])})"/>`;
  return `${leaf(lc[0], lc[1], 470, 210, rot)}${cells}${T(lc[0] - 250, lc[1] - 130, 'leaf', 'pb-lab pb-mlab')}`;
}
function chloroplastLayer(): string {
  const c: V = [F[0] - 60, F[1] + 20];
  const stack = (x: number, y: number): string => [0, 1, 2, 3].map(i => `<rect class="pb-granum" x="${f(x - 23)}" y="${f(y - 16 + i * 9)}" width="46" height="7" rx="3.5"/>`).join('');
  const grana: V[] = [[F[0], F[1] + 4], [c[0] - 130, c[1] + 30], [c[0] - 70, c[1] - 55], [c[0] + 10, c[1] + 70], [c[0] - 160, c[1] - 30], [c[0] + 120, c[1] - 60]];
  return `<g transform="rotate(-18 ${f(c[0])} ${f(c[1])})"><ellipse class="pb-cp" cx="${f(c[0])}" cy="${f(c[1])}" rx="230" ry="120"/></g>
    <path class="pb-lam" d="${pts(grana.slice(0, 4))}"/>${grana.map(g => stack(g[0], g[1])).join('')}
    ${T(c[0] - 150, c[1] - 135, 'chloroplast', 'pb-lab pb-mlab')}`;
}

/* ---------------------------------------------------------------- beat 5: absorption spectra on one axis */

const G = (x: number, m: number, a: number, s: number): number => a * Math.exp(-(((x - m) / s) ** 2) / 2);
const SPECS: Array<{ k: string; name: string; fn: (nm: number) => number }> = [
  { k: 'a', name: 'chlorophyll a', fn: x => G(x, 430, 1, 13) + G(x, 410, 0.42, 16) + G(x, 385, 0.22, 20) + G(x, 662, 0.78, 10) + G(x, 615, 0.12, 15) + G(x, 578, 0.07, 15) },
  { k: 'b', name: 'chlorophyll b', fn: x => G(x, 453, 1, 12) + G(x, 430, 0.42, 15) + G(x, 405, 0.18, 18) + G(x, 642, 0.36, 10) + G(x, 595, 0.07, 15) },
  { k: 'c', name: 'carotenoids', fn: x => G(x, 425, 0.72, 11) + G(x, 450, 1, 12) + G(x, 478, 0.86, 11) + G(x, 402, 0.25, 14) },
];
const SX0 = 470, SX1 = 1370, SNM0 = 400, SNM1 = 700, ROW_H = 118, ROW_Y = [218, 388, 558], AXIS_Y = 590;
const sx = (nm: number): number => SX0 + ((nm - SNM0) / (SNM1 - SNM0)) * (SX1 - SX0);
function spectra(): string {
  const rows = SPECS.map((sp, i) => {
    let mx = 0;
    for (let nm = SNM0; nm <= SNM1; nm += 1) mx = Math.max(mx, sp.fn(nm));
    const p: V[] = [];
    for (let nm = SNM0; nm <= SNM1; nm += 2) p.push([sx(nm), ROW_Y[i] - (sp.fn(nm) / mx) * ROW_H]);
    const area = `M${SX0},${ROW_Y[i]}${p.map(q => `L${f(q[0])},${f(q[1])}`).join('')}L${SX1},${ROW_Y[i]}Z`;
    return `<g data-k="row${i}"><g clip-path="url(#${ID}-trace${i})"><path class="pb-sp pb-sp-${sp.k}" d="${area}"/></g>
      <path class="pb-base" d="M${SX0},${ROW_Y[i]}H${SX1}"/>${T(SX0 - 22, ROW_Y[i] - 10, sp.name, 'pb-lab pb-rowlab', 'end')}</g>`;
  }).join('');
  const strip = Array.from({ length: 60 }, (_, i) => {
    const nm = SNM0 + (i + 0.5) * 5, c = spec(nm).map(v => Math.round(v * 0.85 + 250 * 0.15));
    return `<rect x="${f(sx(SNM0 + i * 5))}" y="${AXIS_Y + 2}" width="${f(sx(SNM0 + 5) - sx(SNM0) + 0.6)}" height="12" fill="rgb(${c.join(',')})"/>`;
  }).join('');
  const ticks = [400, 500, 600, 700].map(nm => `<path class="pb-tick" d="M${f(sx(nm))},${AXIS_Y + 14}V${AXIS_Y + 22}"/>${T(sx(nm), AXIS_Y + 48, `${nm}`, 'pb-lab pb-tlab', 'middle')}`).join('');
  return `<defs>${SPECS.map((_, i) => `<clipPath id="${ID}-trace${i}"><rect data-k="trace${i}" x="${SX0 - 4}" y="${ROW_Y[i] - ROW_H - 10}" width="0" height="${ROW_H + 14}"/></clipPath>`).join('')}</defs>
    <g data-k="gband"><rect class="pb-gband" x="${f(sx(500))}" y="${ROW_Y[0] - ROW_H - 26}" width="${f(sx(600) - sx(500))}" height="${f(AXIS_Y - ROW_Y[0] + ROW_H + 26)}"/>
      ${T(sx(550), ROW_Y[0] - ROW_H - 38, 'green', 'pb-lab pb-green', 'middle')}</g>
    ${rows}${strip}${ticks}${T((SX0 + SX1) / 2, AXIS_Y + 92, 'wavelength (nm)', 'pb-lab pb-ax', 'middle')}
    <text class="pb-lab pb-ax" transform="translate(240 ${f((ROW_Y[0] - ROW_H + ROW_Y[2]) / 2)}) rotate(-90)" text-anchor="middle">absorption</text>`;
}

/* ---------------------------------------------------------------- timing */

const TEND = [4.8, 4.5, 2.7, 2.7, 3.0]; // when each beat's motion has finished, s
const LN1 = Math.log(Z1), LN2 = Math.log(Z2);
/** Beat 1's camera: leaf → chloroplast (0.3–1.3 s), a short look at the chloroplast, then → chlorophyll (1.6–2.6 s). */
function zoomAt(b: number, t: number): { z: number; fs: V; e: number } {
  const e1 = b === 0 ? smoother((t - 0.3) / 1.0) : 1, e2 = b === 0 ? smoother((t - 1.6) / 1.0) : 1;
  const mid: V = [860, 350], fs: V = [lerp(lerp(800, mid[0], e1), F[0], e2), lerp(lerp(370, mid[1], e1), F[1], e2)];
  return { z: Math.exp(e1 * LN1 + e2 * (LN2 - LN1)), fs, e: (e1 + e2) / 2 };
}
// Beat 2: the three chains in turn — [fade in, rung slides there, photon arrives]
const B2 = [{ c: CH3, on: 0, slide: 0, arrive: 1.5 }, { c: CH5, on: 1.9, slide: 2.0, arrive: 2.85 }, { c: CH11, on: 3.25, slide: 3.35, arrive: 4.2 }];

export const STAGING: Staging = {
  id: 'b',
  name: 'B · Ladder first',
  note: 'One big energy ladder in the centre; each molecule appears beside its rungs.',
  svg: () => `<defs>
      ${(Object.keys(INK) as Ink[]).map(k => `<marker id="${ID}-m-${k}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.6" markerHeight="4.6" orient="auto"><path fill="${INK[k]}" d="M0,0L10,5L0,10z"/></marker>`).join('')}
      <radialGradient id="${ID}-glow"><stop offset="0" stop-color="#f6c453" stop-opacity=".95"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".45"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient>
      <linearGradient id="${ID}-band" x1="0" y1="1" x2="0" y2="0">${[500, 475, 450, 425, 400].map((nm, i) => `<stop offset="${i / 4}" stop-color="rgb(${spec(nm).map(v => Math.round(v * 0.6 + 250 * 0.4)).join(',')})"/>`).join('')}</linearGradient>
    </defs>
    <g class="pb-zoom" data-k="L0">${leafLayer()}</g>
    <g class="pb-zoom" data-k="L1">${chloroplastLayer()}</g>
    <g class="pb-zoom" data-k="L2">${chlorophyll()}
      <g data-k="chlLabA">${T(110, 168, 'chlorophyll a', 'pb-lab pb-mlab')}</g><g data-k="chlLabB">${T(110, 168, 'chlorophyll b', 'pb-lab pb-mlab')}</g>
      <g data-k="roomLab">${T(332, 500, 'electrons’ room', 'pb-lab pb-amber')}</g>
      <circle class="pb-pulse" data-k="pulse" cx="${f(GRP_END[0] + 30)}" cy="${f(GRP_END[1])}" r="40"/></g>
    ${chain(CH3.n, CH3.x0, yOf(CH3.nm), CH3.step, 'ch3', '3 double bonds')}
    ${chain(CH5.n, CH5.x0, yOf(CH5.nm), CH5.step, 'ch5', '5 double bonds')}
    ${chain(CH11.n, CH11.x0, yOf(CH11.nm), CH11.step, 'ch11', '11 double bonds')}
    <g data-k="rings">${caroteneRings()}</g>
    <g data-k="caroLab">${T(CH11.x0, yOf(CH11.nm) - 34, 'β-carotene', 'pb-lab pb-mlab')}</g>
    <g data-k="ladder">
      <path class="pb-axis" d="M${AX},${Y0 + 22}V78" marker-end="url(#${ID}-m-grey)"/>${T(AX, 52, 'energy (eV)', 'pb-lab pb-ax', 'middle')}
      ${[0, 1, 2, 3, 4].map(e => `<path class="pb-tick" d="M${AX - 6},${f(Y0 - e * KE)}H${AX + 6}"/>${T(AX + 14, Y0 - e * KE + 8, `${e}`, 'pb-lab pb-tlab')}`).join('')}
      ${rung(Y0)}${T(RL0 - 12, Y0 + 9, 'S₀', 'pb-lv', 'end')}${T(RL0 + 8, Y0 - 12, 'ground state', 'pb-lab pb-mute')}
    </g>
    <g data-k="dyn"></g>
    <g data-k="spectra">${spectra()}</g>`,

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
    const L = [q('L0'), q('L1'), q('L2')], room = q('room'), roomLab = q('roomLab'), labA = q('chlLabA'), labB = q('chlLabB');
    const grpA = q('grpA'), grpB = q('grpB'), pulse = q('pulse');
    const ch = [q('ch3'), q('ch5'), q('ch11')], chRoom = ch.map(g => g.querySelector('.pb-room') as Element), rings = q('rings'), caroLab = q('caroLab');
    const ch11Lab = q('ch11-lab'), ladder = q('ladder'), dyn = q('dyn'), spectraG = q('spectra'), gband = q('gband');
    const rows = [0, 1, 2].map(i => q(`row${i}`)), trace = [0, 1, 2].map(i => q(`trace${i}`));

    let last = '';
    return (beatIn, tIn) => {
      const b = Math.max(0, Math.min(4, Math.round(beatIn))), t = Math.max(0, Math.min(tIn, TEND[b]));
      const key = `${b}:${t.toFixed(3)}`;
      if (key === last) return;
      last = key;

      // Beat 1's zoom: three layers scaled about F, which pans from the stage centre to its place beside the ladder.
      const { z, fs } = zoomAt(b, t);
      [1, Z1, Z2].forEach((zi, i) => set(L[i], 'transform', `translate(${f(fs[0])} ${f(fs[1])}) scale(${(z / zi).toFixed(5)}) translate(${-F[0]} ${-F[1]})`));
      op(L[0], b === 0 ? 1 - smooth(Math.log(z / 3) / Math.log(9 / 3)) : 0);
      op(L[1], b === 0 ? Math.min(smooth(Math.log(z / 4) / Math.log(8 / 4)), 1 - smooth(Math.log(z / 45) / Math.log(90 / 45))) : 0);
      // chlorophyll: in at the end of the zoom; out in beat 2; back in beat 4; out in beat 5
      const chlO = b === 0 ? smooth(Math.log(z / 35) / Math.log(75 / 35)) : b === 1 ? 1 - tw(t, 0.15, 0.45) : b === 3 ? tw(t, 0.25, 0.55) : b === 4 ? 1 - tw(t, 0, 0.3) : 0;
      op(L[2], chlO);
      op(room, b === 0 ? 0.25 + 0.75 * tw(t, 2.6, 3.1) : 1);
      op(roomLab, b === 0 ? tw(t, 2.9, 3.2) : 1);
      const swap = b === 3 ? tw(t, 0.9, 1.2) : b === 4 ? 1 : 0;
      op(labA, 1 - swap); op(labB, swap); op(grpA, 1 - swap); op(grpB, swap);
      op(pulse, b === 3 ? Math.sin(Math.PI * clamp01((t - 0.75) / 0.6)) * 0.9 : 0);

      // the chains of beat 2, and β-carotene in beat 3
      B2.forEach((s, i) => {
        const on = b === 1 ? tw(t, s.on, s.on + 0.3) : b === 2 ? (i === 2 ? 1 : 1 - tw(t, 0, 0.3)) : b === 3 ? (i === 2 ? 1 - tw(t, 0, 0.3) : 0) : 0;
        op(ch[i], on);
        op(chRoom[i], b === 1 ? (i === 2 ? 1 : 0.35 + 0.65 * (1 - tw(t, B2[i + 1].on, B2[i + 1].on + 0.3))) : i === 2 ? 1 : 0.35);
      });
      const caro = b === 2 ? tw(t, 0.3, 0.6) : b === 3 ? 1 - tw(t, 0, 0.3) : 0;
      op(rings, caro); op(caroLab, caro); op(ch11Lab, 1 - caro);

      // the ladder: axis and S₀ stay from the moment it appears until the spectra take over
      op(ladder, b === 0 ? tw(t, 2.8, 3.1) : b === 4 ? 1 - tw(t, 0.2, 0.5) : 1);

      let m = '';
      if (b === 0 || b === 3) {
        // chlorophyll's rungs: S₁ (red gap) and S₂ (blue gap); in beat 4 they nudge from Chl a's to Chl b's
        const appear = b === 0 ? tw(t, 2.8, 3.1) : tw(t, 0.25, 0.55), nudge = b === 3 ? smoother((t - 1.3) / 1.0) : 0;
        const s1 = lerp(662, 642, nudge), s2 = lerp(430, 453, nudge), y1 = yOf(s1), y2 = yOf(s2);
        if (b === 3) m += `<g opacity="${tw(t, 1.3, 1.6).toFixed(3)}">${rung(yOf(662), 'pb-rung pb-ghost')}${rung(yOf(430), 'pb-rung pb-ghost')}</g>`;
        m += `<g opacity="${appear.toFixed(3)}">${rung(y2)}${rung(y1)}${T(RL0 - 12, y2 + 9, 'S₂', 'pb-lv', 'end')}${T(RL0 - 12, y1 + 9, 'S₁', 'pb-lv', 'end')}
          ${T(RL0 + 8, (yOf(662) + yOf(430)) / 2 + 8, 'excited states', 'pb-lab pb-mute')}</g>`;
        const lab = (nmA: number, nmB: number): string => {
          const k = inkOf(nmA);
          return b === 3 && nudge > 0 ? `<tspan class="pb-ink" fill="${INK[k]}">${NAME[k]}</tspan> · ${nmA} → ${nmB} nm` : `<tspan class="pb-ink" fill="${INK[k]}">${NAME[k]}</tspan> · ${nmA} nm`;
        };
        if (b === 0) {
          m += photonMarkup({ nm: 662, y: y1, arrive: 3.75, jx: JX - 36 }, t) + photonMarkup({ nm: 430, y: y2, arrive: 4.35 }, t);
        } else {
          const out = 1 - tw(t, 0, 0.3), yc = yOf(450);
          if (out > 0) m += `<g opacity="${out.toFixed(3)}"><rect class="pb-band" fill="url(#${ID}-band)" x="${RL0}" y="${f(yOf(400))}" width="${RL1 - RL0}" height="${f(yOf(500) - yOf(400))}"/>${rung(yOf(400))}${rung(yOf(500))}
            ${T(RL0 + 8, yOf(400) - 12, 'excited state', 'pb-lab pb-mute')}${T(RL0 + 8, yOf(500) + 30, '400–500 nm', 'pb-lab pb-mute')}</g>`
            + photonMarkup({ nm: 450, y: yc, arrive: 0, o: out }, 9) + photonMarkup({ nm: 495, y: yOf(495), arrive: 0, o: out, jx: JX - 36 }, 9);
          const o = tw(t, 0.25, 0.55);
          m += photonMarkup({ nm: Math.round(s1), y: y1, arrive: 0, o, label: lab(662, 642), jx: JX - 36 }, 9) + photonMarkup({ nm: Math.round(s2), y: y2, arrive: 0, o, label: lab(430, 453) }, 9);
        }
      }
      if (b === 1) {
        // one rung per chain: it appears at the first chain's gap and slides down as the chain grows
        let yr = yOf(CH3.nm);
        if (t >= B2[1].slide) yr = lerp(yOf(CH3.nm), yOf(CH5.nm), smoother((t - B2[1].slide) / 0.7));
        if (t >= B2[2].slide) yr = lerp(yOf(CH5.nm), yOf(CH11.nm), smoother((t - B2[2].slide) / 0.7));
        const rO = tw(t, 0, 0.3); // the first chain and its rung come in while chlorophyll is still leaving
        // chlorophyll's rungs and photons leave with the molecule
        const out = 1 - tw(t, 0.15, 0.45);
        if (out > 0) m += `<g opacity="${out.toFixed(3)}">${rung(yOf(430))}${rung(yOf(662))}${T(RL0 - 12, yOf(430) + 9, 'S₂', 'pb-lv', 'end')}${T(RL0 - 12, yOf(662) + 9, 'S₁', 'pb-lv', 'end')}
            ${T(RL0 + 8, (yOf(662) + yOf(430)) / 2 + 8, 'excited states', 'pb-lab pb-mute')}</g>`
          + photonMarkup({ nm: 662, y: yOf(662), arrive: 0, o: out, jx: JX - 36 }, 9) + photonMarkup({ nm: 430, y: yOf(430), arrive: 0, o: out }, 9);
        B2.forEach((s, i) => { if (i < 2 && t > B2[i + 1].slide) m += rung(yOf(s.c.nm), 'pb-rung pb-ghost', tw(t, B2[i + 1].slide, B2[i + 1].slide + 0.3)); });
        m += `<g opacity="${rO.toFixed(3)}">${rung(yr)}${T(RL0 + 8, yr - 12, 'excited state', 'pb-lab pb-mute')}</g>`;
        B2.forEach((s, i) => {
          const next = B2[i + 1], dim = next ? 1 - 0.55 * tw(t, next.slide, next.slide + 0.3) : 1, lift = next ? 1 - tw(t, next.slide, next.slide + 0.3) : 1;
          m += photonMarkup({ nm: s.c.nm, y: yOf(s.c.nm), arrive: s.arrive, dim, liftO: lift }, t);
          // a dotted leader from the chain to its rung
          const lo = tw(t, s.arrive - 0.15, s.arrive + 0.15) * dim;
          if (lo > 0) m += `<path class="pb-lead" opacity="${lo.toFixed(3)}" d="M${chainEnd(s.c) + 14},${f(yOf(s.c.nm))}H${RL0 - 46}"/>`;
        });
      }
      if (b === 2) {
        // β-carotene: the rung widens into its band, about 400–500 nm; a blue-green photon fits it too
        const g = smoother((t - 0.6) / 0.8), yc = yOf(450), top = lerp(yc, yOf(400), g), bot = lerp(yc, yOf(500), g);
        const fade = 1 - tw(t, 0, 0.3);
        m += `<g opacity="${fade.toFixed(3)}">${rung(yOf(CH3.nm), 'pb-rung pb-ghost')}${rung(yOf(CH5.nm), 'pb-rung pb-ghost')}</g>`
          + photonMarkup({ nm: CH3.nm, y: yOf(CH3.nm), arrive: 0, dim: 0.45 * fade, liftO: 0 }, 9)
          + photonMarkup({ nm: CH5.nm, y: yOf(CH5.nm), arrive: 0, dim: 0.45 * fade, liftO: 0 }, 9);
        if (g > 0.01) m += `<rect class="pb-band" fill="url(#${ID}-band)" x="${RL0}" y="${f(top)}" width="${RL1 - RL0}" height="${f(bot - top)}"/>`;
        m += `${rung(top)}${g > 0.01 ? rung(bot) : ''}${T(RL0 + 8, top - 12, 'excited state', 'pb-lab pb-mute')}`;
        m += `<path class="pb-lead" opacity="${fade.toFixed(3)}" d="M${chainEnd(CH11) + 14},${f(yc)}H${RL0 - 46}"/><path class="pb-lead" opacity="${(1 - fade).toFixed(3)}" d="M${chainEnd(CH11) + 54},${f(yc)}H${RL0 - 46}"/>`;
        m += photonMarkup({ nm: 450, y: yc, arrive: 0 }, 9) + photonMarkup({ nm: 495, y: yOf(495), arrive: 2.2, jx: JX - 36 }, t);
        if (g > 0.5) m += `<g opacity="${tw(t, 1.2, 1.5).toFixed(3)}">${T(RL0 + 8, bot + 30, '400–500 nm', 'pb-lab pb-mute')}</g>`;
      }
      if (b === 4) {
        // the ladder hands over: Chl b's rungs and photons fade as the spectra come in
        const out = 1 - tw(t, 0.2, 0.5), y1 = yOf(642), y2 = yOf(453);
        const lab = (k: Ink, a: number, c: number): string => `<tspan class="pb-ink" fill="${INK[k]}">${NAME[k]}</tspan> · ${a} → ${c} nm`;
        if (out > 0) m += `<g opacity="${out.toFixed(3)}">${rung(y1)}${rung(y2)}${rung(yOf(662), 'pb-rung pb-ghost')}${rung(yOf(430), 'pb-rung pb-ghost')}
            ${T(RL0 - 12, y2 + 9, 'S₂', 'pb-lv', 'end')}${T(RL0 - 12, y1 + 9, 'S₁', 'pb-lv', 'end')}${T(RL0 + 8, (yOf(662) + yOf(430)) / 2 + 8, 'excited states', 'pb-lab pb-mute')}</g>`
          + photonMarkup({ nm: 642, y: y1, arrive: 0, o: out, label: lab('r', 662, 642), jx: JX - 36 }, 9) + photonMarkup({ nm: 453, y: y2, arrive: 0, o: out, label: lab('b', 430, 453) }, 9);
      }
      dyn.innerHTML = m;

      // the spectra: in as the ladder goes; each row traces from short to long wavelength; then the green band
      op(spectraG, b === 4 ? tw(t, 0.3, 0.6) : 0);
      rows.forEach((r, i) => {
        const t0 = 0.6 + 0.45 * i;
        op(r, b === 4 ? tw(t, t0, t0 + 0.3) : 0);
        set(trace[i], 'width', f((SX1 - SX0 + 8) * (b === 4 ? smooth((t - t0) / 1.1) : 0)));
      });
      op(gband, b === 4 ? tw(t, 2.7, 3.0) : 0);
    };
  },
};
