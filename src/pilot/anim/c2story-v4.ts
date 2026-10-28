// 'c2story', version 4 · "Three dials" (slide C2; brief research/redo-2026-10-29/C2STORY_V3_BRIEF.md, v4; the
// coordinator's notes of 29 Oct 2026: few numbers, one value per dial; enzymes only in beats 3–4 at 25 °C). No time chart.
// One fixed framing, no camera moves.
// - Top: RuBisCO drawn as on slide C2 (mr3, figs/rubside.ts): our render of PDB 8RUC, RuBP below, carboxylation on the
//   left (CO₂ in, 2 × 3-PGA out), oxygenation on the right (O₂ in, 3-PGA + 2-PG out). CO₂ and O₂ atom balls stream in:
//   CO₂ at a pace ∝ RuBisCO's speed (kcat), O₂ at that pace × the counter / 100, so the two streams keep the model's
//   ratio; each arrival sends a pulse up its product arm.
// - Middle: 3 round gauges (air: CO₂ and O₂, split like the reactions, CO₂ left and O₂ right; leaf temperature;
//   RuBisCO's CO₂ preference S, with a speed bar) and the counter, O₂ taken up per 100 CO₂ fixed, all from one state
//   (c2story-v4-state.ts).
// - Bottom: an era ribbon of 8 small vignettes and a sliding marker; while it travels, the state is read from the
//   records under it.
// - Beat 4: a carboxysome shell grows around RuBisCO, crowded with CO₂ (C꜀ × 10, illustrative, unlabelled). Beat 7: a hot
//   day turns the temperature dial, a dry day half closes a stoma on the CO₂ path. Beat 8: 3 clippings.
// Ambient motion (molecules, bubbles, smoke) runs on the wall clock; with ?t= (frozen screenshots) it runs on t, and the
// molecule streams are replayed from the beat's start, so every frame is reproducible.
import './c2story-v4.css';
import '../figs/cbb-schema.css';
import '../figs/cell-schema.css';
import '../figs/rubside.css';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { arrow, balls } from '../figs/cell-schema';
import { row } from '../figs/carbon-form';
import { cutPath } from './antenna-common';
import { C2STORY3 } from './beats-c2story';
import { CYANO, ERAS, PLANT, frame, ox, xEra, type Frame, type St } from './c2story-v4-state';
import type { Staging } from './types';

type Pt = [number, number];
type A = 'start' | 'middle' | 'end';
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const sm = (u: number): number => { const x = clamp(u); return x * x * (3 - 2 * x); };
const ease = (t: number, t0: number, t1: number): number => sm((t - t0) / (t1 - t0));
const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
const T = (x: number, y: number, s: string, cls: string, a: A = 'middle', k = ''): string =>
  `<text${k ? ` data-k="${k}"` : ''} class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const TAU = Math.PI * 2;
const frac = (x: number): number => x - Math.floor(x);
/** A deterministic hash in [0, 1). */
const hash = (n: number, k: number): number => frac(Math.sin(n * 127.1 + k * 311.7) * 43758.5453);

/* ---------------------------------------------------------------- RuBisCO, as on slide C2 */

const RC: Pt = [800, 212], RW = 230, RK = RW / 548, RH = 471 * RK;
const R0: Pt = [RC[0] - RW / 2, RC[1] - RH / 2], R1: Pt = [RC[0] + RW / 2, RC[1] + RH / 2];
const R = 12, Y_ROW = 96, Y_RUBP = 358;
const ARM_L: Pt[] = [[R0[0] + 16, R0[1] + 26], [610, 152], [466, Y_ROW + R + 10]];
const ARM_R: Pt[] = [[R1[0] - 16, R0[1] + 26], [990, 152], [1134, Y_ROW + R + 10]];
/** Where the gases enter RuBisCO, and where their streams pass (the stoma sits on the CO₂ one). */
const IN_C: Pt = [R0[0] + 28, RC[1]], IN_O: Pt = [R1[0] - 28, RC[1]];
const W_C: Pt = [522, RC[1]], W_O: Pt = [1078, RC[1]];
const NB_C = 14, NB_O = 12, NP_C = 8, NP_O = 8;
/** The CO₂ crowd inside the carboxysome: angles round RuBisCO, clear of its name (top) and RuBP's arrow (bottom). */
const CROWD = Array.from({ length: 18 }, (_, i) => { const half = i % 2, k = (i - half) / 2, a = -62 + (124 * k) / 8 + (hash(i, 5) - 0.5) * 6; return ((half ? 180 - a : a) * Math.PI) / 180; });
/** Flight (s) of a molecule to the site; pulse (s) up the product arm. */
const FLY = 1.9, PULSE = 0.85;
/** CO₂ arrivals per second for the land-plant RuBisCO; others scale with kcat. */
const PACE = 1.0;

const quad = (a: Pt, c: Pt, b: Pt, u: number): Pt => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
/** A molecule's start, the point it passes at mid-flight, and its end. Lanes spread over RuBisCO's face; on the dry
 *  day (stoma shown, `squeeze` → 1) the CO₂ lanes pass through the stoma's pore. */
function flightPts(n: number, side: 'c' | 'o', squeeze = 0): [Pt, Pt, Pt] {
  const s = side === 'c' ? -1 : 1, x = 800 + s * (480 + 150 * hash(n, 1)), y = RC[1] + (hash(n, 2) - 0.5) * 150;
  const sq = side === 'c' ? squeeze : 0, lane = (hash(n, 3) - 0.5) * lerp(70, 6, sq), end = (hash(n, 9) - 0.5) * lerp(110, 30, sq);
  const w: Pt = side === 'c' ? [W_C[0], W_C[1] + lane] : [W_O[0], W_O[1] + lane];
  const e: Pt = side === 'c' ? [IN_C[0], IN_C[1] + end] : [IN_O[0], IN_O[1] + end];
  return [[x, y], [2 * w[0] - (x + e[0]) / 2, 2 * w[1] - (y + e[1]) / 2], e];
}

function siteSvg(): string {
  const prod = (x: number, fm: string, name: string): string => `<g class="chn-g">${row(x, Y_ROW, fm, { r: R })}</g>${T(x, Y_ROW - R - 12, name, 'rbs-mn')}`;
  // the carboxysome: a hexagonal shell with its facets, behind RuBisCO
  const hx = (r: number, rot = 0): Pt[] => Array.from({ length: 6 }, (_, i): Pt => [RC[0] + r * Math.cos((i * Math.PI) / 3 + rot), RC[1] + r * 0.73 * Math.sin((i * Math.PI) / 3 + rot)]);
  const H = hx(205), Hi = hx(170, Math.PI / 6);
  const poly = (p: Pt[]): string => `M${p.map(q => `${f(q[0])},${f(q[1])}`).join('L')}Z`;
  const facets = H.map((p, i) => `M${f(p[0])},${f(p[1])}L${f(Hi[i][0])},${f(Hi[i][1])}L${f(H[(i + 1) % 6][0])},${f(H[(i + 1) % 6][1])}`).join('');
  const crowd = Array.from({ length: 18 }, (_, i) => `<g data-k="cr${i}" opacity="0">${balls(0, 0, 'OCO', 8)}</g>`).join('');
  // a stoma seen from above, turned so that its pore lies along the CO₂ path: 2 crescent guard cells
  const gx = W_C[0], cres = (sg: number): string => `<path class="c4-guard" d="M${gx - 40},0 Q${gx},${sg * 38} ${gx + 40},0 Q${gx},${sg * 6} ${gx - 40},0Z"/><path class="c4-guardw" d="M${gx - 24},${sg * 7} Q${gx},${sg * 15} ${gx + 24},${sg * 7}"/>`;
  const stoma = `<g data-k="stoma" opacity="0"><g data-k="gc0">${cres(-1)}</g><g data-k="gc1">${cres(1)}</g></g>`;
  return `<g class="fig c4-site" data-k="site">
    ${T(466, 36, 'carboxylation', 'rbs-h')}${T(1134, 36, 'oxygenation', 'rbs-h rbs-h-o')}
    <g data-k="shell" opacity="0"><path class="c4-shell" d="${poly(H)}"/><path class="c4-facet" d="${facets}"/></g>
    ${prod(374, 'CCCP', '3-PGA')}${prod(558, 'CCCP', '3-PGA')}${prod(1042, 'CCCP', '3-PGA')}${prod(1226, 'CCP', '2-PG')}
    <g class="c4-arm">${arrow(ARM_L, 'c')}${arrow(ARM_R, 'pr')}</g>
    <path data-k="armL" d="M${ARM_L.map(p => `${f(p[0])},${f(p[1])}`).join('L')}" fill="none" stroke="none"/>
    <path data-k="armR" d="M${ARM_R.map(p => `${f(p[0])},${f(p[1])}`).join('L')}" fill="none" stroke="none"/>
    <g class="c4-gas">${arrow([[W_C[0] - 150, RC[1]], [R0[0] - 4, RC[1]]], 'gas')}${arrow([[W_O[0] + 150, RC[1]], [R1[0] + 4, RC[1]]], 'gas')}</g>
    ${T(232, RC[1] + 6, 'CO₂', 'rbs-mn c4-gasl', 'end')}${T(1368, RC[1] + 6, 'O₂', 'rbs-mn c4-gasl', 'start')}
    ${Array.from({ length: NB_C }, (_, i) => `<g data-k="bc${i}" opacity="0">${balls(0, 0, 'OCO', 12)}</g>`).join('')}
    ${Array.from({ length: NB_O }, (_, i) => `<g data-k="bo${i}" opacity="0">${balls(0, 0, 'OO', 12)}</g>`).join('')}
    <g transform="translate(0 ${RC[1]})">${stoma}</g>
    <g data-k="crowd">${crowd}</g>
    <image href="${rubPng}" x="${f(R0[0])}" y="${f(R0[1])}" width="${f(RW)}" height="${f(RH)}"/>
    ${T(RC[0], R0[1] - 8, 'RuBisCO', 'rbs-mn rbs-halo')}
    ${Array.from({ length: NP_C }, (_, i) => `<circle data-k="pc${i}" class="c4-pulse-c" r="6" cx="0" cy="0" opacity="0"/>`).join('')}
    ${Array.from({ length: NP_O }, (_, i) => `<circle data-k="po${i}" class="c4-pulse-o" r="6" cx="0" cy="0" opacity="0"/>`).join('')}
    <g class="chn-g">${row(RC[0], Y_RUBP, 'PCCCCCP', { r: R })}</g>${arrow([[RC[0], Y_RUBP - R - 5], [RC[0], R1[1] + 3]], 'c')}
    ${T(RC[0], Y_RUBP + R + 23, 'RuBP', 'rbs-mn')}
    <g data-k="ccmlab" opacity="0">${T(R0[0] - 98, RC[1] + 104, 'carboxysome', 'c4-tag c4-tag-g', 'end')}</g>
    <g data-k="drylab" opacity="0">${T(W_C[0], RC[1] + 56, 'dry: stomata narrower', 'c4-tag', 'middle')}</g>
  </g>`;
}

/* ---------------------------------------------------------------- the gauges and the counter */

const GY = 504, GR = 58, GX = { air: 250, temp: 530, s: 815 };
const Y_TITLE = 430, Y_VAL = 604, Y_SUB = 627;
/** A point at angle a (degrees, clockwise from 12 o'clock). */
const pol = (cx: number, cy: number, r: number, a: number): Pt => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)];
function arcD(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const [x0, y0] = pol(cx, cy, r, a0), [x1, y1] = pol(cx, cy, r, a1), big = Math.abs(a1 - a0) > 180 ? 1 : 0, sw = a1 > a0 ? 1 : 0;
  return `M${f(x0)},${f(y0)} A${r},${r} 0 ${big} ${sw} ${f(x1)},${f(y1)}`;
}
const ticks = (cx: number, cy: number, as: number[]): string => as.map(a => { const [x0, y0] = pol(cx, cy, GR + 9, a), [x1, y1] = pol(cx, cy, GR + 15, a); return `M${f(x0)},${f(y0)}L${f(x1)},${f(y1)}`; }).join('');
/** Scales (degrees): CO₂ 150–3000 ppm (log) on the left half, O₂ 0–35 % on the right half, both rising from the bottom;
 *  leaf temperature 10–45 °C and S 0–200 over 240°. */
const CA_LO = 150, CA_HI = 3000;
const aCa = (ca: number): number => 240 + 112 * clamp(Math.log(ca / CA_LO) / Math.log(CA_HI / CA_LO));
const aO2 = (o: number): number => 120 - 112 * clamp(o / 35);
const aT = (t: number): number => -120 + 240 * clamp((t - 10) / 35);
const aS = (s: number): number => -120 + 240 * clamp(s / 200);
const needle = (k: string, cls: string, len: number): string => `<g data-k="${k}"><path class="${cls}" d="M0,10 L-3.2,0 L0,${-len} L3.2,0Z"/></g>`;

function gaugesSvg(): string {
  const face = (cx: number): string => `<circle class="c4-face" cx="${cx}" cy="${GY}" r="${GR + 20}"/>`;
  // the air: CO₂ (left half), O₂ (right half)
  const a = GX.air;
  const air = `<g data-k="g-air" opacity="0">${face(a)}
      <path class="c4-track" d="${arcD(a, GY, GR, 240, 352)}"/><path class="c4-track" d="${arcD(a, GY, GR, 8, 120)}"/>
      <path data-k="fill-ca" class="c4-fill-ca" d=""/><path data-k="fill-o2" class="c4-fill-o2" d=""/>
      <path class="c4-tick" d="${ticks(a, GY, [200, 500, 1000, 2000].map(aCa))} ${ticks(a, GY, [0, 10, 20, 30].map(aO2))}"/>
      <path class="c4-split" d="M${a},${GY - GR - 6} V${GY - GR + 14} M${a},${GY + GR - 14} V${GY + GR + 6}"/>
      ${T(a - 30, GY + 26, 'CO₂', 'c4-half', 'middle')}${T(a + 30, GY + 26, 'O₂', 'c4-half c4-half-o', 'middle')}
      <g data-k="off-ca" opacity="0"><path class="c4-off" d="${(() => { const [x, y] = pol(a, GY, GR, 357); return `M${f(x - 7)},${f(y + 2)} L${f(x + 3)},${f(y - 4)} L${f(x - 5)},${f(y - 9)}`; })()}"/></g>
      ${needle('n-ca', 'c4-needle', GR - 6)}${needle('n-o2', 'c4-needle c4-needle-o', GR - 14)}<circle class="c4-pivot" cx="${a}" cy="${GY}" r="6"/>
      ${T(a, Y_TITLE, 'air: CO₂ and O₂', 'c4-gt')}
      <text data-k="v-ca" class="c4-val" x="${a - 10}" y="${Y_VAL}" text-anchor="end"> </text><text data-k="v-o2" class="c4-val c4-val-o" x="${a + 10}" y="${Y_VAL}" text-anchor="start"> </text>
    </g>`;
  // the leaf temperature: a cool-to-warm band
  const c = GX.temp, n = 28;
  const band = Array.from({ length: n }, (_, i) => {
    const a0 = -120 + (240 * i) / n, a1 = -120 + (240 * (i + 1)) / n + 0.6, u = i / (n - 1);
    const col = u < 0.5 ? mixC([74, 125, 176], [222, 213, 190], u / 0.5) : mixC([222, 213, 190], [196, 64, 31], (u - 0.5) / 0.5);
    return `<path d="${arcD(c, GY, GR, a0, a1)}" style="fill:none;stroke:${col};stroke-width:11"/>`;
  }).join('');
  const temp = `<g data-k="g-temp" opacity="0">${face(c)}<g data-k="band">${band}</g>
      <path class="c4-tick" d="${ticks(c, GY, [10, 20, 30, 40].map(aT))}"/>
      <g data-k="n-tg">${needle('n-t', 'c4-needle', GR - 6)}</g><circle class="c4-pivot" cx="${c}" cy="${GY}" r="6"/>
      ${T(c, Y_TITLE, 'leaf temperature', 'c4-gt')}
      <text data-k="v-t" class="c4-val" x="${c}" y="${Y_VAL}" text-anchor="middle"> </text>
      <g data-k="hotlab" opacity="0">${T(c, Y_SUB, 'hot day', 'c4-tag c4-tag-r')}</g>
    </g>`;
  // RuBisCO's CO₂ preference S, with its speed
  const s = GX.s;
  const sg = `<g data-k="g-s" opacity="0">${face(s)}
      <path class="c4-track" d="${arcD(s, GY, GR, -120, 120)}"/><path data-k="fill-s" class="c4-fill-s" d=""/>
      <path class="c4-tick" d="${ticks(s, GY, [0, 50, 100, 150, 200].map(aS))}"/>
      <g data-k="n-sg">${needle('n-s', 'c4-needle', GR - 6)}</g><circle class="c4-pivot" cx="${s}" cy="${GY}" r="6"/>
      <g data-k="spd">${T(s, GY + 32, 'speed', 'c4-spd')}<rect class="c4-spdbg" x="${s - 34}" y="${GY + 39}" width="68" height="7" rx="3.5"/><rect data-k="spdbar" class="c4-spdfill" x="${s - 34}" y="${GY + 39}" width="0" height="7" rx="3.5"/></g>
      ${T(s, Y_TITLE, 'RuBisCO’s CO₂ preference (S)', 'c4-gt')}
      <text data-k="v-s" class="c4-val c4-val-s" x="${s}" y="${Y_VAL}" text-anchor="middle"> </text>
      <g data-k="nm-plant" opacity="0">${T(s, Y_SUB, PLANT.name, 'c4-name')}</g><g data-k="nm-cyano" opacity="0">${T(s, Y_SUB, CYANO.name, 'c4-name')}</g>
    </g>`;
  // the counter
  const kx = 1235, bw = 300, bx = kx - bw / 2, by = 584;
  const counter = `<g data-k="g-ctr" opacity="0">
      <path class="c4-chev" d="M${GX.s + 128},${GY - 16} l16,16 l-16,16"/>
      ${T(kx, 438, 'O₂ taken up', 'c4-ct')}${T(kx, 462, 'per 100 CO₂ fixed', 'c4-ct')}
      <text data-k="v-ox" class="c4-big" x="${kx}" y="556" text-anchor="middle"> </text>
      <rect class="c4-barbg" x="${bx}" y="${by}" width="${bw}" height="12" rx="6"/><rect data-k="oxbar" class="c4-barfill" x="${bx}" y="${by}" width="0" height="12" rx="6"/>
      <g data-k="tick1750" opacity="0"><path data-k="t1750p" class="c4-t1750" d="M0,${by - 5} v22"/><text data-k="t1750t" class="c4-t1750t" x="0" y="${by + 34}" text-anchor="middle">1750</text></g>
    </g>`;
  return air + temp + sg + counter;
}
function mixC(a: number[], b: number[], u: number): string {
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], u))).join(',')})`;
}

/* ---------------------------------------------------------------- the era ribbon */

const RY = 697, ICON_K = 0.84;
/** Small vignettes, ground at y = 0, ≈ 76 × 44. */
function icon(i: number): string {
  const strom = (x: number, w: number, h: number): string => {
    let s = `<path class="c4-strom" d="M${x - w / 2},0 Q${x - w / 2},${-h} ${x},${-h} Q${x + w / 2},${-h} ${x + w / 2},0Z"/>`;
    for (let k = 1; k <= 3; k++) { const ww = w * (1 - 0.17 * k), hh = h * (1 - 0.24 * k); s += `<path class="c4-strom-l" d="M${f(x - ww / 2)},0 Q${f(x - ww / 2)},${f(-hh)} ${x},${f(-hh)} Q${f(x + ww / 2)},${f(-hh)} ${f(x + ww / 2)},0"/>`; }
    return s;
  };
  const sea = (cls: string): string => `<path class="${cls}" d="M-38,-30 ${Array.from({ length: 4 }, (_, k) => `Q${-38 + k * 19 + 4.75},-34 ${-38 + k * 19 + 9.5},-30 T${-38 + (k + 1) * 19},-30`).join(' ')} V0 H-38Z"/>`;
  switch (i) {
    case 0: return `${sea('c4-sea0')}${strom(-14, 26, 17)}${strom(14, 30, 22)}<circle class="c4-cell" cx="-24" cy="-18" r="2.6"/><circle class="c4-cell" cx="2" cy="-24" r="2.6"/><circle class="c4-cell" cx="27" cy="-27" r="2.4"/>`;
    case 1: return `${sea('c4-sea1')}${strom(-14, 26, 17)}${strom(14, 30, 22)}${[0, 1, 2, 3, 4].map(k => `<circle data-k="bub${k}" class="c4-bub" cx="0" cy="0" r="3"/>`).join('')}`;
    case 2: {
      const ck = (x: number, h: number): string => `<path class="c4-stem" d="M${x},0 V${-h} M${x},${-h} Q${x - 1},${-h - 6} ${x - 6},${-h - 9} M${x},${-h} Q${x + 1},${-h - 6} ${x + 6},${-h - 9}"/><circle class="c4-spor" cx="${x - 6}" cy="${-h - 10}" r="2.6"/><circle class="c4-spor" cx="${x + 6}" cy="${-h - 10}" r="2.6"/>`;
      return `<path class="c4-moss" d="M-36,0 Q-30,-9 -22,-7 Q-16,-12 -8,-6 Q-2,-10 4,-4 L4,0Z"/><path class="c4-moss" d="M10,0 Q16,-8 24,-6 Q30,-10 36,-3 L36,0Z"/>${ck(-14, 18)}${ck(8, 24)}${ck(22, 14)}<path class="c4-ground" d="M-38,0 H38"/>`;
    }
    case 3: {
      const tuft = (x: number, y: number): string => `<path class="c4-tuft" d="M${x - 6},${y} Q${x},${y - 6} ${x + 6},${y} M${x - 5},${y + 3} Q${x},${y - 2} ${x + 5},${y + 3}"/>`;
      return `<rect class="c4-trunk" x="-15" y="-38" width="6" height="38"/><path class="c4-branch" d="M-12,-36 Q-20,-42 -24,-46 M-12,-36 Q-4,-42 0,-46 M-22,-44 Q-26,-47 -28,-49 M-2,-44 Q1,-47 3,-49"/>${tuft(-26, -47)}${tuft(2, -47)}${tuft(-14, -44)}
        <rect class="c4-trunk" x="17" y="-26" width="4.5" height="26"/><path class="c4-frond" d="M19,-26 Q8,-30 2,-22 M19,-26 Q30,-31 36,-22 M19,-26 Q14,-36 6,-36 M19,-26 Q25,-36 33,-35"/>
        <g data-k="fly"><path class="c4-wing" d="M-4,0 Q-12,-5 -20,-2 Q-12,1 -4,0Z M4,0 Q12,-5 20,-2 Q12,1 4,0Z"/><path class="c4-flyb" d="M0,-3 V7"/></g><path class="c4-ground" d="M-38,0 H38"/>`;
    }
    case 4: return `<path class="c4-conifer" d="M-30,0 V-8 M-30,-8 L-38,-8 L-30,-30 L-22,-8Z"/>
        <path class="c4-dino" d="M-14,-24 Q-17,-36 -11,-42 Q-7,-45 -4,-42 Q-8,-41 -9,-36 Q-9,-28 -4,-22 Q6,-26 18,-22 Q30,-19 38,-8 Q28,-14 22,-13 L22,0 L17,0 L17,-10 L6,-10 L6,0 L1,0 L1,-11 Q-6,-14 -10,-18 Z"/>
        <path class="c4-dino" d="M-12,-17 L-12,0 L-7,0 L-6,-16Z"/><circle class="c4-eye" cx="-7.5" cy="-41.5" r="1"/><path class="c4-ground" d="M-38,0 H38"/>`;
    case 5: {
      // a human walking right (towards the mammoth), front knee forward; a mammoth facing left
      const hum = `<circle class="c4-hum" cx="-24" cy="-29" r="3.4"/><path class="c4-huml" d="M-24,-25 L-24,-14"/><path class="c4-huml" d="M-24,-14 L-21,-7 L-19,0 M-24,-14 L-25,-7 L-29,0"/><path class="c4-huml c4-huma" d="M-24,-22 L-20,-17 M-24,-22 L-27,-17"/><path class="c4-spear" d="M-31,-14 L-12,-26"/>`;
      const mam = `<path class="c4-mam" d="M4,-18 Q3,-31 14,-34 Q24,-36 32,-30 Q38,-24 37,-14 L37,0 L33,0 L33,-9 L27,-9 L27,0 L23,0 L23,-9 L14,-9 L14,0 L10,0 L10,-10 Q6,-12 5,-16 Z"/>
        <path class="c4-mamt" d="M6,-20 Q0,-15 1,-6 Q1,-2 4,-3"/><path class="c4-tusk" d="M7,-15 Q1,-12 -1,-18"/><circle class="c4-eye" cx="9" cy="-25" r="1"/>`;
      return `<path class="c4-ice" d="M-38,0 Q-36,-9 -28,-10 Q-20,-14 -12,-9 Q-6,-6 -2,0Z"/>${hum}${mam}<path class="c4-ground" d="M-38,0 H38"/>`;
    }
    case 6: return `<path class="c4-fac" d="M-30,0 V-18 L-20,-26 V-18 L-10,-26 V-18 L0,-26 V-18 L8,-18 V0Z"/><rect class="c4-chim" x="12" y="-38" width="7" height="38"/>
        ${[0, 1, 2].map(k => `<circle data-k="smk${k}" class="c4-smoke" cx="0" cy="0" r="4"/>`).join('')}<rect class="c4-win" x="-24" y="-12" width="5" height="5"/><rect class="c4-win" x="-14" y="-12" width="5" height="5"/><rect class="c4-win" x="-4" y="-12" width="5" height="5"/><path class="c4-ground" d="M-38,0 H38"/>`;
    default: return `<rect class="c4-tower" x="-34" y="-30" width="12" height="30"/><rect class="c4-tower" x="-20" y="-42" width="13" height="42"/><rect class="c4-tower" x="-5" y="-24" width="11" height="24"/><rect class="c4-tower" x="8" y="-36" width="12" height="36"/>
        ${[[-31, -25], [-31, -17], [-17, -36], [-17, -27], [-17, -18], [11, -30], [11, -21]].map(([x, y]) => `<rect class="c4-twin" x="${x}" y="${y}" width="6" height="4"/>`).join('')}
        <g data-k="car"><path class="c4-car" d="M-9,-2 V-7 Q-8,-10 -4,-10 L1,-14 H9 L13,-10 Q17,-10 17,-7 V-2Z"/><circle class="c4-tyre" cx="-3" cy="-2" r="2.8"/><circle class="c4-tyre" cx="11" cy="-2" r="2.8"/></g><path class="c4-ground" d="M-38,0 H38"/>`;
  }
}
function ribbonSvg(): string {
  return `<g data-k="rib" opacity="0">
    <rect class="c4-rib" x="34" y="646" width="1532" height="90" rx="14"/>
    <g data-k="mark" opacity="0"><rect class="c4-mark" x="-84" y="650" width="168" height="82" rx="11"/></g>
    ${ERAS.map((e, i) => `<g transform="translate(${xEra(i)} ${RY}) scale(${ICON_K})">${icon(i)}</g>${T(xEra(i), 725, e.name, 'c4-era', 'middle', `era${i}`)}`).join('')}
  </g>`;
}

/* ---------------------------------------------------------------- the clippings (beat 8) */

interface Clip { year: string; head: string[]; src: string }
const CLIPS: Clip[] = [
  { year: '2001', head: ['Red-algal RuBisCO', 'made in tobacco, but', 'not assembled'], src: 'Whitney et al. 2001, Plant J.' },
  { year: '2014', head: ['Faster cyanobacterial', 'RuBisCO works in', 'tobacco'], src: 'Lin et al. 2014, Nature · Occhialini et al. 2016' },
  { year: '2026', head: ['Machine learning', 'helps evolve a faster', 'RuBisCO'], src: 'McDonald et al. 2026, Sci. Adv.' },
];
const CW = 340, CH = 226, CX0 = 220, CY = 92, CG = 40;
function clipsSvg(): string {
  return CLIPS.map((c, i) => {
    const x = CX0 + i * (CW + CG), rot = [-1.1, 0.8, -0.6][i];
    return `<g data-k="clip${i}" opacity="0"><g transform="rotate(${rot} ${x + CW / 2} ${CY + CH / 2})">
      <path class="c4-cpaper" d="${cutPath(x, CY, CW, CH, 61 + i * 7, 2.6)}" filter="url(#c4-csh)"/>
      <path class="c4-cpaper c4-ctex" d="${cutPath(x, CY, CW, CH, 61 + i * 7, 2.6)}" filter="url(#c4-grain)"/>
      <path class="c4-crule" d="M${x + 22},${CY + 40} H${x + CW - 22} M${x + 22},${CY + 44} H${x + CW - 22}"/>
      ${T(x + 22, CY + 30, c.year, 'c4-cyear', 'start')}${c.head.map((l, k) => T(x + 22, CY + 82 + k * 34, l, 'c4-chead', 'start')).join('')}
      ${T(x + 22, CY + CH - 18, c.src, 'c4-csrc', 'start')}</g></g>`;
  }).join('');
}

/* ---------------------------------------------------------------- the molecule streams */

interface Flight { t0: number; n: number }
/** Arrivals at a pace (per second) that follows the state; each flight is launched at an exact time. */
class Stream {
  phase = 0.5; n = 0; fl: Flight[] = [];
  constructor(readonly keep: number) {}
  step(now: number, dt: number, pace: number): void {
    if (pace > 1e-6) {
      this.phase += pace * dt;
      while (this.phase >= 1) { this.phase -= 1; this.fl.push({ t0: now - this.phase / pace, n: this.n++ }); }
    }
    while (this.fl.length && now - this.fl[0].t0 > this.keep) this.fl.shift();
  }
}
const paceC = (s: St): number => PACE * (s.kcat / PLANT.kcat);
const paceO = (s: St): number => paceC(s) * ox(s) / 100;

/* ---------------------------------------------------------------- the staging */

const FROZEN = typeof location !== 'undefined' && new URLSearchParams(location.search).has('t');
/** Counter text: "≈" rounded to 10 where the leaf is above the Γ* fit range (≈ 40 °C). */
function oxText(s: St): string {
  const v = ox(s);
  if (v < 0.001) return '0';
  if (v < 0.5) return '&lt; 1';
  if (s.tOn > 0.5 && s.t > 40) return `≈ ${Math.round(v / 10) * 10}`;
  return String(Math.round(v));
}

export const STAGING: Staging = {
  id: 'v4',
  // the key lines on the stage (lecturer, 29 Oct 2026: "people don't read the text under the animation")
  keys: [
    { beat: 0, text: '3 factors:', x: 300, y: 330, size: 40 },
    { beat: 0, text: 'air, temperature, RuBisCO', x: 300, y: 376, size: 40 },
    { beat: 1, text: 'RuBisCO began to take up O₂', x: 300, y: 350, size: 40 },
    { beat: 2, text: 'More selective RuBisCO', x: 300, y: 330, size: 40 },
    { beat: 2, text: 'works more slowly', x: 300, y: 376, size: 40 },
    { beat: 3, text: 'Concentrating CO₂ keeps', x: 230, y: 330, size: 36 },
    { beat: 3, text: 'a fast RuBisCO', x: 230, y: 372, size: 36 },
    { beat: 4, text: 'Oxygenation became frequent', x: 300, y: 350, size: 40 },
    { beat: 5, text: 'Temperature offset', x: 300, y: 330, size: 40 },
    { beat: 5, text: 'the CO₂ effect', x: 300, y: 376, size: 40 },
    { beat: 6, text: 'CO₂ rose: oxygenation fell', x: 300, y: 350, size: 40 },
    { beat: 7, text: 'How does the leaf turn 3-PGA into sugar?', x: 800, y: 395, size: 44 },
  ],
  name: 'v4 · Three dials',
  note: 'RuBisCO through Earth’s history (v4): RuBisCO as on slide C2 with CO₂ and O₂ streaming in at the model’s ratio; 3 round gauges (air, leaf temperature, CO₂ preference S with a speed bar) and the counter of O₂ taken up per 100 CO₂ fixed, one state; an era ribbon whose marker reads the records as it travels; a carboxysome in beat 4; a hot, dry day; 3 clippings',
  beats: C2STORY3,
  // stops where a beat holds two states the caption names: the dinosaurs before the ice age; 1750 and today before the
  // hot, dry day
  holds: [[], [], [], [], [], [2.9], [2.3, 4.9], []],
  svg: () => `<defs>
      <filter id="c4-csh" x="-10%" y="-8%" width="120%" height="125%"><feDropShadow dx="1" dy="5" stdDeviation="6" flood-color="#3d3020" flood-opacity=".24"/></filter>
      <filter id="c4-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 0.55 -0.12" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in"/></filter>
    </defs>
    <g class="c2v4">
      <rect class="c4-paper" x="0" y="0" width="1600" height="740"/>
      ${siteSvg()}
      <g data-k="gauges">${gaugesSvg()}</g>
      ${ribbonSvg()}
      ${clipsSvg()}
    </g>`,
  bind(stage) {
    const els = new Map<string, SVGElement>();
    stage.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el as SVGElement));
    const cache = new Map<Element, Map<string, string>>();
    const set = (k: string, a: string, v: string): void => {
      const el = els.get(k);
      if (!el) return;
      let m = cache.get(el);
      if (!m) { m = new Map(); cache.set(el, m); }
      if (m.get(a) === v) return;
      m.set(a, v);
      if (a === 'text') el.innerHTML = v; else el.setAttribute(a, v);
    };
    const op = (k: string, v: number): void => { set(k, 'display', v < 0.004 ? 'none' : 'inline'); set(k, 'opacity', v >= 0.996 ? '1' : v.toFixed(3)); };
    const armL = els.get('armL') as SVGPathElement, armR = els.get('armR') as SVGPathElement;
    const LL = armL.getTotalLength(), LR = armR.getTotalLength();

    // the streams: live, stepped by the wall clock; frozen, replayed from the beat's start (with a pre-roll)
    let sc = new Stream(FLY + PULSE + 0.1), so = new Stream(FLY + PULSE + 0.1), lastKey = '';
    // live clock: the beat's own time while it plays, the wall clock while it rests (holds, Back to a beat's end)
    let amb0 = 0, lastT = -1, lastBeat = -1, lastWall = performance.now();
    const replay = (beat: number, t: number): void => {
      sc = new Stream(FLY + PULSE + 0.1); so = new Stream(FLY + PULSE + 0.1);
      const s0 = frame(beat, 0).st, dt = 1 / 60;
      for (let u = -4; u < 0; u += dt) { sc.step(u, dt, paceC(s0)); so.step(u, dt, paceO(s0)); }
      for (let u = 0; u < t; u += dt) { const s = frame(beat, u).st; sc.step(u + dt, dt, paceC(s)); so.step(u + dt, dt, paceO(s)); }
    };

    return (beat, t) => {
      const F: Frame = frame(beat, t), S = F.st;
      const wall = performance.now();
      if (!FROZEN) {
        const dw = (wall - lastWall) / 1000, dtb = beat === lastBeat && t > lastT ? t - lastT : 0;
        const dt = lastT < 0 ? 0 : Math.min(0.1, Math.max(0, dtb > 0 ? dtb : dw));
        amb0 += dt;
        sc.step(amb0, dt, paceC(S)); so.step(amb0, dt, paceO(S));
      }
      lastT = t; lastBeat = beat; lastWall = wall;
      const amb = FROZEN ? t : amb0;
      if (FROZEN) {
        const key = `${beat}:${t}`;
        if (key !== lastKey) { replay(beat, Math.min(t, 60)); lastKey = key; }
      }
      const now = FROZEN ? Math.min(t, 60) : amb0;
      const last8 = beat === 7 ? ease(t, 0, 0.7) : 0;

      /* ---- RuBisCO and the streams */
      op('site', 1 - 0.92 * last8);
      const draw = (st: Stream, side: 'c' | 'o', nb: number, np: number): void => {
        const used = new Set<number>(), usedP = new Set<number>();
        for (const fl of st.fl) {
          const age = now - fl.t0;
          if (age < 0) continue;
          if (age <= FLY) {
            const u = age / FLY, [a, c, b] = flightPts(fl.n, side, F.stomaOn), p = quad(a, c, b, u);
            const wob = 3.5 * Math.sin(TAU * (u * 1.4 + hash(fl.n, 4)));
            const sc2 = 1 - 0.45 * ease(u, 0.86, 1), o = ease(u, 0, 0.12) * (1 - ease(u, 0.93, 1));
            const k = `b${side}${fl.n % nb}`;
            used.add(fl.n % nb);
            set(k, 'transform', `translate(${f(p[0])} ${f(p[1] + wob)}) scale(${sc2.toFixed(3)})`); op(k, o);
          } else if (age <= FLY + PULSE) {
            const q = (age - FLY) / PULSE, path = side === 'c' ? armL : armR, L = side === 'c' ? LL : LR;
            const pt = path.getPointAtLength(L * sm(q)), k = `p${side}${fl.n % np}`;
            usedP.add(fl.n % np);
            set(k, 'cx', f(pt.x)); set(k, 'cy', f(pt.y)); op(k, ease(q, 0, 0.15) * (1 - ease(q, 0.75, 1)));
          }
        }
        for (let i = 0; i < nb; i++) if (!used.has(i)) op(`b${side}${i}`, 0);
        for (let i = 0; i < np; i++) if (!usedP.has(i)) op(`p${side}${i}`, 0);
      };
      draw(sc, 'c', NB_C, NP_C); draw(so, 'o', NB_O, NP_O);

      // the carboxysome and its CO₂ crowd (illustrative: more CO₂ around RuBisCO)
      op('shell', F.ccm); set('shell', 'transform', `translate(${RC[0]} ${RC[1]}) scale(${(0.9 + 0.1 * F.ccm).toFixed(3)}) translate(${-RC[0]} ${-RC[1]})`);
      op('ccmlab', F.ccm);
      for (let i = 0; i < 18; i++) {
        const on = clamp(F.crowd * 18 - i), th = CROWD[i] + 0.07 * Math.sin(TAU * (amb / 6.5 + hash(i, 6))), rr = 1 + 0.04 * Math.sin(TAU * (amb / 3.7 + hash(i, 7)));
        const x = RC[0] + 160 * rr * Math.cos(th), y = RC[1] + 116 * rr * Math.sin(th);
        set(`cr${i}`, 'transform', `translate(${f(x)} ${f(y)}) rotate(${f(40 * Math.sin(TAU * (amb / 5 + hash(i, 8))))})`); op(`cr${i}`, sm(on));
      }
      // the stoma: open, then half closed (C꜀/Cₐ 0.468 → 0.35)
      op('stoma', F.stomaOn);
      const gap = lerp(9, 4.5, F.stoma);
      set('gc0', 'transform', `translate(0 ${f(-gap)})`); set('gc1', 'transform', `translate(0 ${f(gap)})`);
      op('drylab', F.dry);

      /* ---- the gauges */
      const gOn = (t0: number): number => (beat === 0 ? ease(t, t0, t0 + 0.6) : 1);
      op('gauges', 1 - 0.6 * last8);
      op('g-air', gOn(0.6)); op('g-temp', gOn(1.4)); op('g-s', gOn(2.2)); op('g-ctr', gOn(3.0));
      // the air
      const ax = GX.air;
      const aC = aCa(S.ca), aO = aO2(S.o2);
      set('n-ca', 'transform', `translate(${ax} ${GY}) rotate(${f(aC)})`);
      set('n-o2', 'transform', `translate(${ax} ${GY}) rotate(${f(aO)})`);
      set('fill-ca', 'd', aC > 240.3 ? arcD(ax, GY, GR, 240, aC) : '');
      set('fill-o2', 'd', aO < 119.7 ? arcD(ax, GY, GR, aO, 120) : '');
      op('off-ca', clamp((Math.log(S.ca) - Math.log(CA_HI)) / 0.3));
      set('v-ca', 'text', S.ca > CA_HI * 1.02 ? 'very high' : `${Math.round(S.ca)} ppm`);
      set('v-o2', 'text', S.pre ? (S.o2 < 0.005 ? '≈ 0 %' : '≤ 0.02 %') : S.o2 < 0.5 ? '&lt; 1 %' : `${Math.round(S.o2)} %`);
      // the leaf temperature (dims where there is no record)
      const tx = GX.temp;
      set('n-t', 'transform', `translate(${tx} ${GY}) rotate(${f(aT(S.t))})`);
      op('n-tg', S.tOn); op('band', 0.3 + 0.7 * S.tOn);
      set('v-t', 'text', S.tOn < 0.5 ? 'no record' : S.t > 40 ? `≈ ${Math.round(S.t)} °C` : `${S.t.toFixed(1)} °C`);
      set('v-t', 'class', `c4-val${S.tOn < 0.5 ? ' c4-val-dim' : ''}`);
      op('hotlab', F.hot);
      // S and speed (dims where the RuBisCO of the time is not known)
      const sx = GX.s, aSv = aS(S.s);
      set('n-s', 'transform', `translate(${sx} ${GY}) rotate(${f(aSv)})`); op('n-sg', S.sOn);
      set('fill-s', 'd', arcD(sx, GY, GR, -120, aSv)); op('fill-s', S.sOn);
      set('spdbar', 'width', f((68 * Math.min(S.kcat, 12)) / 12)); op('spd', S.sOn);
      set('v-s', 'text', S.sOn < 0.5 ? 'not known' : String(Math.round(S.s)));
      set('v-s', 'class', `c4-val c4-val-s${S.sOn < 0.5 ? ' c4-val-dim' : ''}`);
      const sKnown = sm((S.sOn - 0.5) / 0.5);
      op('nm-plant', sKnown * (1 - clamp(Math.abs(S.s - PLANT.s) / 12)));
      op('nm-cyano', sKnown * (1 - clamp(Math.abs(S.s - CYANO.s) / 12)));
      // during a jump between eras the numbers belong to no time: dimmed while the dials turn
      const dim = 1 - 0.65 * F.jump;
      for (const k of ['v-ca', 'v-o2', 'v-t', 'v-s', 'v-ox']) op(k, dim);
      // the counter
      const v = ox(S), bx = 1235 - 150;
      set('v-ox', 'text', oxText(S));
      set('oxbar', 'width', f((300 * Math.min(v, 100)) / 100));
      const x1750 = bx + 300 * 0.658;
      set('t1750p', 'transform', `translate(${f(x1750)} 0)`); set('t1750t', 'x', f(x1750)); op('tick1750', F.tick1750);

      /* ---- the ribbon */
      op('rib', F.rib * (1 - 0.6 * last8));
      op('mark', F.mOn); set('mark', 'transform', `translate(${f(F.mx)} 0)`);
      for (let i = 0; i < ERAS.length; i++) set(`era${i}`, 'class', `c4-era${Math.abs(F.mx - xEra(i)) < 70 && F.mOn > 0.5 ? ' c4-era-on' : ''}`);
      // ambient vignettes: bubbles rise, smoke drifts, the griffinfly hovers, the car crosses
      for (let k = 0; k < 5; k++) {
        const u = frac(amb / 2.6 + k / 5), x = [-16, -8, 10, 16, 2][k] + 2 * Math.sin(TAU * (u + k * 0.3)), y = -18 - u * 22;
        set(`bub${k}`, 'cx', f(x)); set(`bub${k}`, 'cy', f(y)); set(`bub${k}`, 'r', f(1.8 + 1.6 * u)); op(`bub${k}`, sm(u / 0.15) * (1 - sm((u - 0.75) / 0.25)));
      }
      for (let k = 0; k < 3; k++) {
        const u = frac(amb / 3.2 + k / 3), x = 15 + u * 14, y = -40 - u * 12;
        set(`smk${k}`, 'cx', f(x)); set(`smk${k}`, 'cy', f(y)); set(`smk${k}`, 'r', f(3 + 3.5 * u)); op(`smk${k}`, 0.85 * sm(u / 0.2) * (1 - sm((u - 0.6) / 0.4)));
      }
      set('fly', 'transform', `translate(${f(27 + 3 * Math.sin((TAU * amb) / 4.1))} ${f(-47 + 2 * Math.sin((TAU * amb) / 2.3))}) scale(.7)`);
      const cu = frac(amb / 7);
      set('car', 'transform', `translate(${f(-30 + 50 * cu)} 0)`); op('car', sm(cu / 0.12) * (1 - sm((cu - 0.85) / 0.15)));

      /* ---- the clippings */
      for (let i = 0; i < CLIPS.length; i++) {
        const a = beat === 7 ? ease(t, 0.4 + i * 0.7, 1.1 + i * 0.7) : 0;
        op(`clip${i}`, a); set(`clip${i}`, 'transform', `translate(0 ${f(14 * (1 - a))})`);
      }
    };
  },
};
