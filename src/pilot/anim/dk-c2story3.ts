// 'c2story', version 3 · "RuBisCO through Earth's history": v2 (dk-c2story.ts) fixed (lecturer, 29 Oct 2026; brief
// research/redo-2026-10-29/C2STORY_V3_BRIEF.md; beats C2STORY3). How often RuBisCO takes up O₂ depends on 3 things: the
// air, the temperature and RuBisCO itself.
// - The chart is v2's: one broken time axis (4 billion years ago → September 2026), CO₂ in the air and the change in
//   global mean temperature, revealed left to right by a marker; living era scenes below it (c2story-scenes.ts).
// - The panel draws RuBisCO as on slide C2 (figs/rubside.ts, mr3): the 8RUC render, RuBP coming up from below, CO₂ in from
//   the left (carboxylation), O₂ from the right (oxygenation), atom-ball molecules. A beam balance rests on RuBisCO: 100
//   carboxylations on the left, the calculated oxygenations on the right. Beside it, the 3 factors: the air (CO₂, O₂), the
//   leaf temperature and RuBisCO itself (whose enzyme; its CO₂ preference S; in beats 3–4 its speed, as a bar only).
// - One state drives every readout. Each frame the state is computed from the time under the marker (the records of
//   c2story-data.ts, read between their points) or from the dial (beats 3–4: today's air at 25 °C, the enzyme, C꜀; beat 7:
//   a hot day, then a hot, dry day). The beam, both numbers, the air, the leaf temperature, the CO₂ preference and the
//   speed bar all follow it, so they move together and stop together. While the marker travels, the record values are
//   averaged over the last 0.3 s of its path (a motion blur, exact at rest), so fast passes through the ice-age cycles
//   do not flicker.
// - Where a value is not known (the Precambrian: no CO₂ number, no temperature, the ancestral enzyme's S; 2.3 billion to
//   420 million years ago in our records), its readout stays empty; the balance fills only when the air is known.
// - Model (c2story-model.ts, c2story-enzyme.ts; never hard-coded here): oxygenations per 100 carboxylations
//   = 100 × 2Γ*/C꜀ × S_PLANT/S, Γ*(T) Bernacchi 2001 × O₂/20.95 %, C꜀ = (200/427) × Cₐ (0.35 × Cₐ on the dry day), leaf
//   temperature = 25 °C + change in global mean temperature. Enzyme S is applied only in beats 3–4, at 25 °C (exact there
//   only); elsewhere the land-plant enzyme. Beat 4's cyanobacterium: C꜀ = 10 × the air-equilibrium value (illustrative,
//   unlabelled). Above 40 °C leaf temperature (the edge of the Γ* fit), numbers are shown as ≈ (oxygenations to 10, the leaf
//   to 1 °C).
// - The Precambrian stand-ins (not shown as numbers): CO₂ = the 1750 value (a low bound: CO₂ was ≈ 10–2500 × today;
//   Catling & Zahnle 2020), O₂ = 0 before the Great Oxidation Event and 0.1 % of today's after it; any higher CO₂ only
//   lowers the readout, so "0" and "< 1" hold.
// Ambient loops run on the wall clock; with ?t= (frozen screenshots) on t, so every frame is reproducible.
import './dk-c2story.css';
import './dk-c2story3.css';
import '../figs/cbb-schema.css';
import { C2STORY3 } from './beats-c2story';
import { CO2_B, CO2_C, CO2_D, FOSTER, O2_GCS, T_A, T_B, T_C, T_D } from './c2story-data';
import { CC_CA, leafT, O2_TODAY } from './c2story-model';
import { ENZYMES, enzyme, oxPer100S, S_PLANT, type Enzyme } from './c2story-enzyme';
import { animScene, GROUND, N_SCENES, SC_CARRIERS, SC_FIRST_LAND, SKY, type Spot } from './c2story-scenes';
import { cutPath } from './antenna-common';
import { arrow, balls } from '../figs/cell-schema';
import { row, rowWidth } from '../figs/carbon-form';
import rubiscoPng from '../../assets/rf/rubisco-8ruc.png';
import type { Staging } from './types';

type V = [number, number];
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * (3 - 2 * u); };
const ease2 = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * u * (u * (u * 6 - 15) + 10); };
const life = (t: number, a0: number, a1: number, b0: number, b1: number): number => ease(t, a0, a1) * (1 - ease(t, b0, b1));
const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
/** Constant speed between t0 and t1 with smooth starts and stops (ramps of 12 % of the move). */
function cruise(t: number, t0: number, t1: number): number {
  const u = clamp((t - t0) / (t1 - t0)), r = 0.12, v = 1 / (1 - r);
  if (u < r) return (v * u * u) / (2 * r);
  if (u > 1 - r) return 1 - (v * (1 - u) * (1 - u)) / (2 * r);
  return v * (u - r / 2);
}
const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text${k ? ` data-k="${k}"` : ''} class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const MINUS = '−';
/** 0 → 1 as x runs from a to b, eased. */
const ramp = (x: number, a: number, b: number): number => ease(x, a, b);

/* ---------------------------------------------------------------- the broken time axis (as v2) */

const X0 = 130, X1 = 1430, Y0 = 84, Y1 = 410, GAP = 18;
const NOW = 2026.8, D_END = 2026.75, YA1750 = NOW - 1750;
const SEGW = [0.35, 0.2, 0.15, 0.3].map(r => r * (X1 - X0 - 3 * GAP));
const SX: V[] = [];
{ let x = X0; for (const w of SEGW) { SX.push([x, x + w]); x += w + GAP; } }
const LA = Math.log10(4e9), LB = Math.log10(1e6);
/** x of a time (years ago) drawn in segment s. */
function xIn(s: number, ya: number): number {
  const [a, b] = SX[s];
  if (s === 0) return a + ((LA - Math.log10(ya)) / (LA - LB)) * (b - a);
  if (s === 1) return a + ((8e5 - ya) / (8e5 - 1.2e4)) * (b - a);
  if (s === 2) return a + ((1.2e4 - ya) / (1.2e4 - YA1750)) * (b - a);
  return a + ((NOW - ya - 1750) / (D_END - 1750)) * (b - a);
}
const xYr = (yr: number): number => xIn(3, NOW - yr);
/** Segment ends (years ago): a marker in an axis break reads the time between the two segments' ends. */
const SEG_YA: V[] = [[4e9, 1e6], [8e5, 1.2e4], [1.2e4, YA1750], [YA1750, NOW - D_END]];
/** Years ago under x, everywhere on the axis (in a break: between the ends of the segments on either side). */
function yaAt(x: number): number {
  for (let s = 0; s < 4; s++) {
    const [a, b] = SX[s];
    if (x <= b + 1e-9 || s === 3) {
      if (x < a && s > 0) { // in the break before segment s
        const u = clamp((x - SX[s - 1][1]) / (a - SX[s - 1][1]));
        return lerp(SEG_YA[s - 1][1], SEG_YA[s][0], u);
      }
      const u = clamp((x - a) / (b - a));
      if (s === 0) return 10 ** (LA - u * (LA - LB));
      if (s === 1) return 8e5 - u * (8e5 - 1.2e4);
      if (s === 2) return 1.2e4 - u * (1.2e4 - YA1750);
      return NOW - (1750 + u * (D_END - 1750));
    }
  }
  return 0;
}
const C_LO = Math.log10(150), C_HI = Math.log10(4000);
const yC = (ppm: number): number => Y1 - ((Math.log10(ppm) - C_LO) / (C_HI - C_LO)) * (Y1 - Y0);
const T_LO = -12, T_HI = 24;
const yT = (d: number): number => Y1 - ((d - T_LO) / (T_HI - T_LO)) * (Y1 - Y0);

/* ---------------------------------------------------------------- the drawn series, per segment (as v2) */

const FOSTER_SHOWN = FOSTER.filter(([ma]) => ma < 10 || Math.round(ma) % 10 === 0 || ma > 419);
function at(pts: V[], ya: number): number | null {
  const n = pts.length, eps = 1e-6 * Math.max(1, Math.abs(ya));
  if (!n || ya > pts[0][0] + eps || ya < pts[n - 1][0] - eps) return null;
  const y = Math.min(pts[0][0], Math.max(pts[n - 1][0], ya));
  for (let i = 0; i < n - 1; i++) {
    const [a0, v0] = pts[i], [a1, v1] = pts[i + 1];
    if (y <= a0 && y >= a1) return a0 === a1 ? v0 : v0 + ((v1 - v0) * (a0 - y)) / (a0 - a1);
  }
  return pts[n - 1][1];
}
function cut(pts: V[], ya0: number, ya1: number): V[] {
  const inner = pts.filter(([a]) => a < ya0 && a > ya1);
  const s = at(pts, ya0), e = at(pts, ya1);
  return [...(s !== null ? [[ya0, s] as V] : []), ...inner, ...(e !== null ? [[ya1, e] as V] : [])];
}
const CO2S: V[][] = [
  FOSTER_SHOWN.slice().reverse().map(([ma, ppm]): V => [ma * 1e6, ppm]),
  CO2_B.map(([a, v]): V => [a, v]),
  CO2_C.map(([a, v]): V => [a, v]),
  CO2_D.map(([yr, v]): V => [NOW - yr, v]),
];
const TS: V[][] = [
  T_A.map(([ma, d]): V => [ma * 1e6, d]),
  T_B.map(([a, d]): V => [a, d]),
  cut(T_C.map(([a, d]): V => [a, d]), 1.2e4, YA1750),
  T_D.map(([yr, d]): V => [NOW - yr, d]),
];
const segOf = (ya: number): number => (ya >= 1e6 ? 0 : ya <= 8e5 && ya >= 1.2e4 ? 1 : ya < 1.2e4 && ya >= YA1750 - 1e-6 ? 2 : ya < YA1750 ? 3 : -1);
const co2Drawn = (ya: number): number | null => { const s = segOf(ya); return s < 0 ? null : at(CO2S[s], ya); };
const tDrawn = (ya: number): number | null => { const s = segOf(ya); if (s === 3 && ya < TS[3][TS[3].length - 1][0]) return TS[3][TS[3].length - 1][1]; return s < 0 ? null : at(TS[s], ya); };
const d = (pts: V[], s: number, y: (v: number) => number): string => `M${pts.map(([a, v]) => `${f(xIn(s, a))},${f(y(v))}`).join(' L')}`;

/* ---------------------------------------------------------------- the records behind the state (all points, merged) */

/** One record over the whole time axis, years ago descending, read linearly between neighbouring points (also across
 *  the axis breaks); null outside its range (the ends are held for the last fraction of a year). */
function merged(parts: V[][]): (ya: number) => number | null {
  const p = parts.flat().sort((a, b) => b[0] - a[0]);
  return (ya: number): number | null => {
    const n = p.length;
    if (ya > p[0][0] * (1 + 1e-9)) return null;
    if (ya <= p[n - 1][0]) return ya > p[n - 1][0] - 1 ? p[n - 1][1] : null;
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (p[m][0] >= ya) lo = m; else hi = m; }
    const [a0, v0] = p[lo], [a1, v1] = p[hi];
    return a0 === a1 ? v0 : v0 + ((v1 - v0) * (a0 - ya)) / (a0 - a1);
  };
}
const co2Rec = merged([FOSTER.map(([ma, ppm]): V => [ma * 1e6, ppm]), CO2_B.map(([a, v]): V => [a, v]), CO2_C.map(([a, v]): V => [a, v]), CO2_D.map(([yr, v]): V => [NOW - yr, v])]);
const tRec = merged([T_A.map(([ma, v]): V => [ma * 1e6, v]), T_B.map(([a, v]): V => [a, v]), T_C.map(([a, v]): V => [a, v]), T_D.map(([yr, v]): V => [NOW - yr, v])]);
/** O₂ (% of air): GEOCARBSULF 10-million-year bins (420 → 10 million years ago), then linear to today's 20.95 %. */
const o2Rec = merged([O2_GCS.map(([ma, v]): V => [ma * 1e6, v]), [[0, O2_TODAY]]]);
const YA_REC = FOSTER[FOSTER.length - 1][0] * 1e6;       // the CO₂ record begins (419.5 million years ago)
const CA_NOW = CO2_D[CO2_D.length - 1][1], YR_NOW = CO2_D[CO2_D.length - 1][0];
const CA_1750 = CO2_D[0][1];

/* ---------------------------------------------------------------- marker stations (x) */

const xA = (ya: number): number => xIn(0, ya);
const X_START = SX[0][0], X3G = xA(3e9), XGOE = xA(2.3e9), X500 = xA(5e8), X300 = xA(3e8), X100 = xA(1e8), X20K = xIn(1, 2e4);
const X1750 = SX[3][0], XNOW = xYr(YR_NOW);
const X_REC = xA(YA_REC);

/* ---------------------------------------------------------------- the panel geometry */

const PX = 948, PY = 468, PW = 1584 - PX, PH = 268;
const BX = PX + 176, YP = PY + 106, ARM = 100, BAR = 0.46, TILT = 0.14, BW = 40;
const RW = 104, RH = (RW * 471) / 548, RY = YP + 3, BYC = RY + RH / 2;
const GX_C = BX - 120, GX_O = BX + 116, GR = 11;
const RUBP_Y = RY + RH + 34, RUBP_R = 10;
const QX = BX + 182, QR = PX + PW - 16, QW = QR - QX;
const RY_AIR = PY + 46, RY_LEAF = PY + 84, RY_RUB = PY + 122, RY_NAME = PY + 146, RY_S = PY + 180, RY_SB = PY + 190, RY_SP = PY + 230;
const S_MAX = Math.max(...ENZYMES.map(e => e.s)) * 1.04, K_MAX = Math.max(...ENZYMES.map(e => e.kcat)) * 1.04;
const SPB_X = QX + 62;

function panelSvg(): string {
  const tray = (k: string, cls: string): string => `<g data-k="c3-tray${k}">
      <path class="c3-tray" d="M${-BW / 2 - 6},0 H${BW / 2 + 6}"/>
      <rect data-k="c3-bar${k}" class="${cls}" x="${-BW / 2}" y="-3" width="${BW}" height="0" rx="3"/>
      <text data-k="c3-bv${k}" class="cs-bv" x="0" y="-10" text-anchor="middle"> </text></g>`;
  const hex = (r: number): string => `M${Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i; return `${f(BX + r * Math.cos(a))},${f(BYC + r * Math.sin(a))}`; }).join(' L')}Z`;
  // extra CO₂ inside the carboxysome (beat 4): small atom-ball CO₂ around RuBisCO's surface
  const extra: V[] = [[BX - 30, BYC - 24], [BX - 34, BYC + 24], [BX + 32, BYC + 22]];
  const band = (k: string, y: number, h: number): string => `<rect data-k="c3-bd${k}" class="c3-band" x="${QX - 10}" y="${y}" width="${QW + 20}" height="${h}" rx="8" opacity="0"/>`;
  return `<g data-k="c3-panel" opacity="0">
    <rect class="cs-panelbg" x="${PX}" y="${PY}" width="${PW}" height="${PH}" rx="16"/>
    <path class="cs-rule" d="M${QX - 16},${PY + 18} V${PY + PH - 18}"/>
    ${band('a', RY_AIR - 21, 30)}${band('t', RY_LEAF - 21, 30)}${band('r', RY_RUB - 21, RY_SB - RY_RUB + 34)}
    <g data-k="c3-heads">${T(BX - ARM, PY + 26, 'carboxylation', 'c3-hc', 'middle')}${T(BX + ARM, PY + 26, 'oxygenation', 'c3-ho', 'middle')}</g>
    <g data-k="c3-shell" opacity="0"><path class="c3-shell" d="${hex(58)}"/>${T(GX_C, BYC + 58, 'carboxysome', 'c3-shl', 'middle')}</g>
    <g data-k="c3-rub"><image href="${rubiscoPng}" x="${f(BX - RW / 2)}" y="${f(RY)}" width="${RW}" height="${f(RH)}"/></g>
    ${extra.map(([x, y], i) => `<g data-k="c3-x${i}" class="c3-xs" opacity="0">${balls(x, y, 'OCO', 8)}</g>`).join('')}
    <circle data-k="c3-hlr" class="c3-ring" cx="${BX}" cy="${f(BYC)}" r="${f(RW / 2 + 8)}" opacity="0"/>
    <g data-k="c3-gasc">${balls(GX_C, BYC, 'OCO', GR)}${arrow([[GX_C + 34, BYC], [BX - RW / 2 - 2, BYC]], 'gas')}${T(GX_C, BYC + 33, 'CO₂', 'c3-mn', 'middle')}</g>
    <g data-k="c3-gaso">${balls(GX_O, BYC, 'OO', GR)}${arrow([[GX_O - 25, BYC], [BX + RW / 2 + 2, BYC]], 'gas')}${T(GX_O, BYC + 33, 'O₂', 'c3-mn', 'middle')}</g>
    <g data-k="c3-hla" opacity="0"><rect class="c3-ring" x="${GX_C - 40}" y="${f(BYC - 22)}" width="80" height="66" rx="14"/><rect class="c3-ring" x="${GX_O - 31}" y="${f(BYC - 22)}" width="62" height="66" rx="14"/></g>
    <g data-k="c3-rubp">${row(BX, RUBP_Y, 'PCCCCCP', { r: RUBP_R })}${arrow([[BX, RUBP_Y - RUBP_R - 4], [BX, RY + RH + 1]], 'c')}${T(BX + rowWidth(7, RUBP_R) / 2 + 10, RUBP_Y + 6, 'RuBP', 'c3-mn')}</g>
    <g data-k="c3-beam"><path class="cs-beam" d="M${-ARM - 4},0 H${ARM + 4}"/><circle class="cs-hook" cx="${-ARM}" cy="0" r="3.5"/><circle class="cs-hook" cx="${ARM}" cy="0" r="3.5"/></g>
    <circle class="cs-pin" cx="${BX}" cy="${YP}" r="6"/>
    ${tray('L', 'cs-barc')}${tray('R', 'cs-baro')}
    <g data-k="c3-r1" opacity="0">${T(QX, RY_AIR, 'air', 'c3-lab')}<text data-k="c3-air" class="c3-val" x="${QR}" y="${RY_AIR}" text-anchor="end"> </text></g>
    <g data-k="c3-r2" opacity="0">${T(QX, RY_LEAF, 'leaf temperature', 'c3-lab')}<text data-k="c3-leaf" class="c3-val" x="${QR}" y="${RY_LEAF}" text-anchor="end"> </text></g>
    <g data-k="c3-r3" opacity="0">${T(QX, RY_RUB, 'RuBisCO', 'c3-lab')}<text data-k="c3-name" class="c3-val" x="${QX}" y="${RY_NAME}"> </text>
      ${T(QX, RY_S, 'CO₂ preference (S)', 'c3-lab2')}<text data-k="c3-s" class="c3-val" x="${QR}" y="${RY_S}" text-anchor="end"> </text>
      <rect class="c3-barbg" x="${QX}" y="${RY_SB}" width="${QW}" height="10" rx="5"/><rect data-k="c3-sbar" class="c3-sbar" x="${QX}" y="${RY_SB}" width="0" height="10" rx="5"/></g>
    <g data-k="c3-r5" opacity="0">${T(QX, RY_SP, 'speed', 'c3-lab2')}
      <rect class="c3-barbg" x="${SPB_X}" y="${RY_SP - 11}" width="${QR - SPB_X}" height="10" rx="5"/><rect data-k="c3-kbar" class="c3-kbar" x="${SPB_X}" y="${RY_SP - 11}" width="0" height="10" rx="5"/></g>
  </g>`;
}

/* ---------------------------------------------------------------- the chart (v2's, without the end values) */

function chartSvg(): string {
  const tk = (x: number, s: string, a: 'start' | 'middle' | 'end', minor = false): string =>
    `<path class="cs-tick" d="M${f(x)},${Y1} v${minor ? 5 : 8}"/>${s ? T(x, Y1 + 28, s, 'cs-tk cs-halo', a) : ''}`;
  const xt = [
    tk(xIn(0, 4e9), '4 billion', 'middle'), tk(xIn(0, 1e9), '1 billion', 'middle'), tk(xIn(0, 1e8), '100 million', 'middle'),
    tk(xIn(0, 1e7), '10 million', 'middle'), tk(xIn(0, 1e6), '1 million', 'end'),
    tk(xIn(1, 8e5), '800,000', 'start'), tk(xIn(1, 6e5), '', 'middle', true), tk(xIn(1, 4e5), '400,000', 'middle'), tk(xIn(1, 2e5), '', 'middle', true),
    tk(xIn(2, 1.2e4), '12,000', 'start'), tk(xIn(2, 9e3), '', 'middle', true), tk(xIn(2, 6e3), '6,000', 'middle'), tk(xIn(2, 3e3), '', 'middle', true),
    tk(xYr(1750), '1750', 'start'), tk(xYr(1800), '', 'middle', true), tk(xYr(1850), '1850', 'middle'), tk(xYr(1900), '', 'middle', true),
    tk(xYr(1950), '1950', 'middle'), tk(xYr(2000), '', 'middle', true), tk(xYr(2026), '2026', 'end'),
  ].join('');
  const segLine = (y: number): string => SX.map(([a, b]) => `M${f(a)},${y} H${f(b)}`).join(' ');
  const brk = SX.slice(0, 3).map(([, b]) => { const g = b + GAP / 2; return [Y1, Y0].map(y => `M${f(g - 7)},${y + 7} l6,-14 M${f(g + 1)},${y + 7} l6,-14`).join(' '); }).join(' ');
  const grid = [200, 500, 1000, 2000].map(v => `<path class="cs-grid" d="${SX.map(([a, b]) => `M${f(a)},${f(yC(v))} H${f(b)}`).join(' ')}"/>`).join('');
  const cl = [200, 500, 1000, 2000].map(v => `<path class="cs-tick" d="M${X0},${f(yC(v))} h-7"/>${T(X0 - 12, yC(v) + 6, String(v), 'cs-tk cs-halo', 'end')}`).join('');
  const tl = [-10, 0, 10, 20].map(v => `<path class="cs-tickt" d="M${X1},${f(yT(v))} h7"/>${T(X1 + 12, yT(v) + 6, v > 0 ? `+${v}` : v < 0 ? `${MINUS}${-v}` : '0', 'cs-tkt cs-halo')}`).join('');
  const zero = `<path class="cs-zero" d="${SX.map(([a, b]) => `M${f(a)},${f(yT(0))} H${f(b)}`).join(' ')}"/>`;
  const bandC = `M${FOSTER_SHOWN.map(([ma, , lo]) => `${f(xIn(0, ma * 1e6))},${f(yC(Math.max(lo, 150)))}`).join(' L')} L${FOSTER_SHOWN.slice().reverse().map(([ma, , , hi]) => `${f(xIn(0, ma * 1e6))},${f(yC(Math.min(hi, 4000)))}`).join(' L')}Z`;
  const bandT = `M${T_A.map(([ma, , lo]) => `${f(xIn(0, ma * 1e6))},${f(yT(Math.max(lo, T_LO)))}`).join(' L')} L${T_A.slice().reverse().map(([ma, , , hi]) => `${f(xIn(0, ma * 1e6))},${f(yT(Math.min(hi, T_HI)))}`).join(' L')}Z`;
  const co2 = CO2S.map((p, s) => d(p, s, yC)).join(' '), tmp = TS.map((p, s) => d(p, s, yT)).join(' ');
  const goe0 = xIn(0, 2.43e9), goe1 = xIn(0, 2.22e9), xa = xIn(0, 3.4e9);
  const midA = (SX[0][0] + SX[0][1]) / 2, midBC = (SX[1][0] + SX[2][1]) / 2, midD = (SX[3][0] + SX[3][1]) / 2;
  return `<g data-k="cs-axes" opacity="0">${grid}${zero}
      <path class="cs-axis" d="${segLine(Y1)} ${segLine(Y0)} M${X0},${Y0} V${Y1} M${X1},${Y0} V${Y1}"/><path class="cs-brk" d="${brk}"/>
      ${xt}${cl}${tl}
      ${T(midA, Y1 + 52, 'years ago (log scale)', 'cs-ax cs-halo', 'middle')}${T(midBC, Y1 + 52, 'years ago', 'cs-ax cs-halo', 'middle')}${T(midD, Y1 + 52, 'year', 'cs-ax cs-halo', 'middle')}
      <text class="cs-axc cs-halo" transform="translate(50 ${(Y0 + Y1) / 2}) rotate(-90)" text-anchor="middle">CO₂ in the air (parts per million, ppm)</text>
      <text class="cs-axt cs-halo" transform="translate(1522 ${(Y0 + Y1) / 2}) rotate(90)" text-anchor="middle">global mean temperature (°C)</text>
      <text class="cs-axt2 cs-halo" transform="translate(1544 ${(Y0 + Y1) / 2}) rotate(90)" text-anchor="middle">change from 1850–1900</text>
    </g>
    <clipPath id="c3-clip"><rect data-k="cs-clip" x="${X0 - 6}" y="0" width="0" height="470"/></clipPath>
    <g data-k="cs-curves" clip-path="url(#c3-clip)" opacity="0">
      <path class="cs-band" d="${bandC}"/><path class="cs-bandt" d="${bandT}"/>
      <path class="cs-co2h" d="${co2}"/><path class="cs-co2" d="${co2}"/>
      <path class="cs-th" d="${tmp}"/><path class="cs-t" d="${tmp}"/>
      <path class="cs-arch" d="M${f(xIn(0, 4e9))},${Y0 + 26} H${f(xIn(0, 2.5e9))}"/><path class="cs-archa" d="M${f(xa)},${Y0 + 22} v-18 m-6,7 l6,-7 l6,7"/>
    </g>
    <g data-k="cs-off" opacity="0">${T(xa + 12, Y0 + 20, 'CO₂ off the scale', 'cs-note cs-halo')}</g>
    <g data-k="cs-goe" opacity="0"><rect class="cs-goe" x="${f(goe0)}" y="${Y0}" width="${f(goe1 - goe0)}" height="${Y1 - Y0}"/>${T(goe1 + 8, Y0 + 66, 'Great Oxidation Event', 'cs-note cs-halo')}</g>
    <g data-k="cs-clab" opacity="0">${T(xIn(0, 4.3e8) - 8, yC(1444) + 6, 'CO₂', 'cs-lc cs-halo', 'end')}${T(xIn(0, 4.9e8) - 8, yT(18.1) + 6, 'temperature', 'cs-lt cs-halo', 'end')}</g>
    <g data-k="cs-ph" display="none"><path class="cs-phl" d="M0,${Y0 - 4} V${Y1}"/><circle data-k="cs-pdc" class="cs-pdc" cx="0" cy="0" r="7"/><circle data-k="cs-pdt" class="cs-pdt" cx="0" cy="0" r="7"/></g>
    <text data-k="cs-status" class="cs-status cs-halo" x="${X0}" y="${Y0 - 28}"> </text>
    ${T(1590, 24, 'CO₂: Foster et al. 2017; Bereiter et al. 2015; NOAA GML · temperature: Judd et al. 2024; Snyder 2016; Osman et al. 2021; HadCRUT5 (Met Office, CRU)', 'cs-crd', 'end', 'cs-crd')}`;
}

/* ---------------------------------------------------------------- the clippings (beat 8, as v2) */

interface Clip { year: string; head: string[]; body: string[]; src: string }
const CLIPS: Clip[] = [
  { year: '2001', head: ['Red-algal RuBisCO made', 'in tobacco, but not', 'assembled'], body: ['More CO₂-specific than plant', 'RuBisCO. Made in tobacco', 'chloroplasts, it did not assemble.'], src: 'Whitney et al. 2001, Plant J. 26:535' },
  { year: '2014', head: ['Faster cyanobacterial', 'RuBisCO works in', 'tobacco'], body: ['It replaced tobacco’s RuBisCO and', 'fixed CO₂ faster per enzyme; the', 'plants grew only with extra CO₂.'], src: 'Lin et al. 2014, Nature 513:547 · Occhialini et al. 2016' },
  { year: '2026', head: ['Machine learning', 'helps evolve a faster', 'RuBisCO'], body: ['Tobacco RuBisCO variant T391I:', 'carboxylation rate +29 %, efficiency', 'in air +43 %; selected in <tspan font-style="italic">E. coli</tspan>.'], src: 'McDonald et al. 2026, Sci. Adv.' },
];
const CW = 332, CH = 270, CX0 = 280, CY = 118, CG = 22;
function clipsSvg(): string {
  return CLIPS.map((c, i) => {
    const x = CX0 + i * (CW + CG), rot = [-1.1, 0.8, -0.6, 1.0][i];
    const head = c.head.map((l, k) => T(x + 22, CY + 76 + k * 30, l, 'cs-chead')).join('');
    const body = c.body.map((l, k) => T(x + 22, CY + 186 + k * 22, l.replace(/CO₂/g, 'CO<tspan class="cs-csub">₂</tspan>'), 'cs-cbody')).join('');
    return `<g data-k="cs-clip${i}" opacity="0"><g transform="rotate(${rot} ${x + CW / 2} ${CY + CH / 2})">
      <path class="cs-cpaper" d="${cutPath(x, CY, CW, CH, 61 + i * 7, 2.6)}" filter="url(#c3-csh)"/>
      <path class="cs-cpaper cs-ctex" d="${cutPath(x, CY, CW, CH, 61 + i * 7, 2.6)}" filter="url(#c3-grain)"/>
      <path class="cs-crule" d="M${x + 22},${CY + 40} H${x + CW - 22} M${x + 22},${CY + 44} H${x + CW - 22}"/>
      ${T(x + 22, CY + 30, c.year, 'cs-cyear')}${head}
      <path class="cs-crule1" d="M${x + 22},${CY + 160} H${x + 90}"/>${body}
      ${T(x + 22, CY + CH - 16, c.src, 'cs-csrc')}</g></g>`;
  }).join('');
}

/* ---------------------------------------------------------------- the timeline of each beat */

// Beat k (0-based) of C2STORY3: 0 three factors · 1 origin and O₂ · 2 RuBisCO changed · 3 concentrating CO₂ · 4 plants on
// land · 5 heat and cold · 6 today · 7 a better RuBisCO? Motion ends (s): 2.6 + 3.4 + 5.9 + 2.3 + 4.1 + 5.0 + 7.6 + 2.8 = 33.7.
const B1M: V[] = [[0.3, 1.5], [2.0, 3.4]];
const B2_IN: V = [0.6, 1.2], B2_SW: V[] = [[2.0, 2.5], [3.7, 4.2], [5.4, 5.9]];
const B3_SW: V = [0, 0.5], B3_SHELL: V = [0.7, 1.2], B3_CC: V = [0.9, 2.3];
const B4M: V[] = [[0.4, 1.6], [2.0, 3.8]];
const B5M: V[] = [[0.2, 1.8], [2.6, 4.4]];
const B5_WALK = { t0: 3.2, dur: 1.8, dist: 70 };
// beat 7 stops twice (clicks): at 2026, once the readouts have settled (the motion blur lags the marker by 0.3 s), and
// after the hot day
const B6M: V = [0.2, 1.4], B6_CR: V = [1.6, 4.8], B6_HOT: V = [5.3, 6.3], B6_DRY: V = [6.6, 7.6];
const HOLDS6 = [5.15, 6.45];
const END = 99;
const SEQ: Enzyme['k'][] = ['cyano', 'green', 'plant', 'red'];
const CC_MAX = 10;

/** The marker's x in beat b at time t. */
function xOf(b: number, t: number): number {
  if (b === 0) return X_START;
  if (b === 1) return t < B1M[1][0] ? lerp(X_START, X3G, ease2(t, ...B1M[0])) : lerp(X3G, XGOE, ease2(t, ...B1M[1]));
  if (b === 2 || b === 3) return XGOE;
  if (b === 4) return t < B4M[1][0] ? lerp(XGOE, X500, ease2(t, ...B4M[0])) : lerp(X500, X300, ease2(t, ...B4M[1]));
  if (b === 5) return t < B5M[1][0] ? lerp(X300, X100, ease2(t, ...B5M[0])) : lerp(X100, X20K, ease2(t, ...B5M[1]));
  if (b === 6) return t < B6_CR[0] ? lerp(X20K, X1750, ease2(t, ...B6M)) : xYr(lerp(1750, YR_NOW, cruise(t, ...B6_CR)));
  return XNOW;
}

/** The state: every readout is drawn from it. */
interface St {
  x: number; mark: number;
  ca: number; o2: number; tl: number; s: number; kcat: number; k: number; m: number;
  /** How far each readout is known/shown (0–1): air, leaf temperature, the balance (RuBisCO at work), the enzyme's S,
   *  the speed bar, the enzyme's name. */
  wAir: number; wT: number; wBal: number; wS: number; wK: number; wName: number;
  airTxt: string | null; airTxtOp: number; name: string; nameOp: number;
  /** O₂ glyph (how much O₂ the air holds), the render (RuBisCO not yet evolved: dim), the carboxysome. */
  o2g: number; rubOp: number; ccm: number; xco2: number; spot: Spot;
}
const none: Spot = { cyano: 0, green: 0, plant: 0, red: 0, ccm: 0 };
function blank(x: number): St {
  return { x, mark: 1, ca: CA_1750, o2: O2_TODAY, tl: 25, s: S_PLANT, kcat: enzyme('plant').kcat, k: CC_CA, m: 1, wAir: 0, wT: 0, wBal: 0, wS: 0, wK: 0, wName: 0, airTxt: null, airTxtOp: 1, name: ' ', nameOp: 1, o2g: 1, rubOp: 1, ccm: 0, xco2: 0, spot: { ...none } };
}
const BLUR_N = 9, BLUR_T = 0.3;
/** The marker's x averaged over its last 0.3 s of travel: the status line reads it, so its words keep pace with the
 *  readouts (exact at rest). */
function xBlur(b: number, t: number): number {
  let x = 0;
  for (let i = 0; i < BLUR_N; i++) x += xOf(b, Math.max(0, t - (BLUR_T * i) / (BLUR_N - 1)));
  return x / BLUR_N;
}
/** The record values under the marker, averaged over its last 0.3 s of travel (exact at rest). */
function recAt(b: number, t: number): { ca: number; o2: number; dT: number } | null {
  const N = BLUR_N, TAU = BLUR_T;
  let ca = 0, o2 = 0, dT = 0, n = 0;
  for (let i = 0; i < N; i++) {
    const ya = yaAt(xOf(b, Math.max(0, t - (TAU * i) / (N - 1))));
    const c = co2Rec(ya), o = o2Rec(ya), tv = tRec(ya);
    if (c === null || o === null || tv === null) continue;
    ca += c; o2 += o; dT += tv; n++;
  }
  return n ? { ca: ca / n, o2: o2 / n, dT: dT / n } : null;
}
/** State from the marker. `pre`: the Precambrian readouts (beat 2 only); the enzyme is the land plants' from beat 5 on. */
function markState(b: number, t: number, pre: boolean): St {
  const x = xOf(b, t), st = blank(x);
  // the Precambrian (beat 2): RuBisCO evolves at ≈ 3 billion years ago; O₂ appears with the Great Oxidation Event
  if (pre) {
    const wEv = ramp(x, xA(3.3e9), X3G), rGoe = ramp(x, 154.5, 157.5);
    st.wAir = 1; st.airTxt = rGoe < 0.5 ? 'CO₂ high · almost no O₂' : 'CO₂ high · O₂ building up'; st.airTxtOp = Math.abs(1 - 2 * rGoe);
    st.o2 = lerp(0, 0.001 * O2_TODAY, rGoe); st.o2g = lerp(0.16, 0.5, rGoe);
    st.wBal = wEv; st.name = 'ancestral'; st.wName = wEv; st.rubOp = lerp(0.3, 1, wEv);
    return st;
  }
  // from 420 million years ago: the records
  const r = ramp(x, X_REC, X_REC + 8), rec = recAt(b, t);
  st.name = enzyme('plant').name; st.wName = 1; st.wS = 1; st.s = enzyme('plant').s;
  if (rec && r > 0) {
    st.ca = rec.ca; st.o2 = rec.o2; st.tl = leafT(rec.dT);
    st.wAir = r; st.wT = r; st.wBal = r;
  }
  return st;
}
/** The dial of beats 3–4: today's air, leaf at 25 °C; the enzyme swapped (from enzyme i to j by u); C꜀ × m. */
function dialState(i: Enzyme['k'], j: Enzyme['k'], u: number, m: number, ccm: number): St {
  const st = blank(XGOE), a = enzyme(i), b = enzyme(j);
  st.mark = 0; st.ca = CA_NOW; st.o2 = O2_TODAY; st.tl = 25;
  st.s = Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)); st.kcat = Math.exp(lerp(Math.log(a.kcat), Math.log(b.kcat), u));
  st.m = m; st.ccm = ccm; st.xco2 = Math.log10(m);
  st.wAir = 1; st.wT = 1; st.wBal = 1; st.wS = 1; st.wK = 1; st.wName = 1;
  st.name = u < 0.5 ? a.name : b.name; st.nameOp = Math.abs(1 - 2 * u);
  st.spot = { ...none, ccm }; st.spot[i] += 1 - u; st.spot[j] += u;
  return st;
}
/** Fades a state's readouts by w (the balance empties, the values fade). */
function fade(st: St, w: number): St {
  return { ...st, wAir: st.wAir * w, wT: st.wT * w, wBal: st.wBal * w, wS: st.wS * w, wK: st.wK * w, wName: st.wName * w, ccm: st.ccm * w, xco2: st.xco2 * w, o2g: lerp(1, st.o2g, w), rubOp: lerp(1, st.rubOp, w) };
}
function dialB3(t: number): St {
  return dialState('red', 'cyano', ease(t, ...B3_SW), 10 ** (Math.log10(CC_MAX) * ease(t, ...B3_CC)), ease(t, ...B3_SHELL));
}
function state(b: number, t: number): St {
  if (b === 0) return blank(X_START);
  if (b === 1) return fade(markState(1, t, true), ease(t, 0, 0.5));
  if (b === 2) {
    if (t < B2_IN[0]) return { ...fade(markState(1, END, true), 1 - ease(t, 0, B2_IN[0])), mark: 1 - ease(t, 0, 1.0) };
    let i = 0, u = 0;
    for (let k = 0; k < B2_SW.length; k++) if (t >= B2_SW[k][0]) { i = k; u = ease(t, ...B2_SW[k]); }
    const st = u >= 1 ? dialState(SEQ[i + 1], SEQ[i + 1], 0, 1, 0) : t < B2_SW[0][0] ? dialState(SEQ[0], SEQ[0], 0, 1, 0) : dialState(SEQ[i], SEQ[i + 1], u, 1, 0);
    return { ...fade(st, ease(t, ...B2_IN)), mark: 1 - ease(t, 0, 1.0) };
  }
  if (b === 3) return dialB3(t);
  if (b === 4) {
    const mk = ease(t, 0, 1.0);
    if (t < 0.6) return { ...fade(dialB3(END), 1 - ease(t, 0, 0.6)), mark: mk };
    const st = markState(4, t, false), g = ease(t, 0.6, 1.2);
    return { ...st, wName: st.wName * g, wS: st.wS * g, mark: mk };
  }
  if (b === 5) return markState(5, t, false);
  if (b === 6) {
    const st = markState(6, t, false), eh = ease(t, ...B6_HOT), ed = ease(t, ...B6_DRY);
    st.tl = lerp(st.tl, 35, eh); st.k = lerp(CC_CA, 0.35, ed);
    return st;
  }
  return state(6, END);
}

/* ---------------------------------------------------------------- the status line (time and era, from the marker) */

interface Station { a: number; b: number; s: string }
// each label shows while the marker is at (or within 2 px before) its station, so the words never run ahead of the readouts
const STATIONS: Station[] = [
  { a: X3G - 2, b: X3G + 4, s: '≈ 3 billion years ago' },
  { a: 157, b: XGOE + 6, s: 'Great Oxidation Event, ≈ 2.4 billion years ago' },
  { a: X500 - 2, b: X500 + 4, s: '≈ 500 million years ago · plants reach land' },
  { a: X300 - 2, b: X300 + 4, s: '300 million years ago · Carboniferous' },
  { a: X100 - 2, b: X100 + 4, s: '100 million years ago · dinosaurs' },
  { a: X20K - 2, b: X20K + 4, s: '≈ 20,000 years ago · ice age' },
];
function statusOf(b: number, t: number, x: number): [string, number] {
  if (b === 0) return [' ', 0];
  if (b === 2 && t < 0.6) { const [s, o] = statusOf(1, END, XGOE); return [s, o * (1 - ease(t, 0, 0.3))]; }
  if (b === 2 || b === 3) return ['today', b === 2 ? ease(t, 0.3, 0.6) : 1];
  if (b === 4 && t < 0.6) return ['today', 1 - ease(t, 0, 0.3)];
  if (b === 7) return ['2026 · a hot, dry day', 0.55];
  if (b === 6) {
    // the year under the marker; after the first stop "a hot day", after the second "a hot, dry day"
    const [h0, h1] = HOLDS6;
    const yr = String(Math.floor(NOW - yaAt(x) + 1e-6));
    if (t >= h1 + 0.12) return ['2026 · a hot, dry day', ease(t, h1 + 0.12, h1 + 0.35)];
    if (t >= h1) return ['2026 · a hot day', 1 - ease(t, h1, h1 + 0.12)];
    if (t >= h0 + 0.12) return ['2026 · a hot day', ease(t, h0 + 0.12, h0 + 0.35)];
    if (t >= h0) return [yr, 1 - ease(t, h0, h0 + 0.12)];
    if (x >= X1750 - 0.5) return [yr, 1];
  }
  // from beat 5 on the marker leaves the Great Oxidation Event without naming it again
  for (const st of b >= 4 ? STATIONS.slice(2) : STATIONS) if (x > st.a - 3 && x < st.b + 3) return [st.s, ramp(x, st.a - 3, st.a) * (1 - ramp(x, st.b, st.b + 3))];
  return [' ', 0];
}

/* ---------------------------------------------------------------- the scenes (from the marker; the carriers on the dial) */

// the scenes in time order and the x ranges over which each gives way to the next; −1 is no scene (the ice age fades
// out before industry fades in, as the marker crosses 12,000 years ago → 1750 without a farming scene)
const SC_SEQ = [0, 1, SC_FIRST_LAND, 2, 3, 4, -1, 6, 7];
const SC_RAMPS: V[] = [[152, 157], [200, 236], [X_REC, X_REC + 9], [282, 312], [520, 600], [SX[2][0] + 4, SX[2][0] + 90], [SX[2][0] + 110, SX[3][0] - 6], [xYr(1950), xYr(1985)]];
function sceneW(x: number): number[] {
  const w = new Array<number>(N_SCENES).fill(0);
  const add = (i: number, v: number): void => { if (i >= 0) w[i] += v; };
  let j = -1;
  for (let k = 0; k < SC_RAMPS.length; k++) if (x > SC_RAMPS[k][0]) j = k;
  if (j < 0) { add(SC_SEQ[0], 1); return w; }
  const r = ramp(x, ...SC_RAMPS[j]);
  add(SC_SEQ[j], 1 - r); add(SC_SEQ[j + 1], r);
  return w;
}

/* ---------------------------------------------------------------- formats */

const FIT_T = 40;
const fmtOx = (ox: number, tl: number): string => (tl > FIT_T ? `≈ ${Math.round(ox / 10) * 10}` : ox <= 0.005 ? '0' : ox < 0.5 ? '&lt; 1' : String(Math.round(ox)));
const fmtLeaf = (tl: number): string => (tl > FIT_T ? `≈ ${Math.round(tl)} °C` : `${tl.toFixed(1)} °C`);
const fmtAir = (ca: number, o2: number): string => `CO₂ ${Math.round(ca)} ppm · O₂ ${Math.round(o2)} %`;

const FROZEN = typeof location !== 'undefined' && new URLSearchParams(location.search).has('t');

export const STAGING: Staging = {
  id: 'v3',
  // the key lines on the stage (lecturer, 29 Oct 2026: "people don't read the text under the animation")
  keys: [
    { beat: 0, text: '3 factors: air, temperature, RuBisCO', x: 1000, y: 66, size: 40 },
    { beat: 1, text: 'RuBisCO began to take up O₂', x: 1000, y: 66, size: 40 },
    { beat: 2, text: 'More selective RuBisCO works more slowly', x: 1000, y: 66, size: 40 },
    { beat: 3, text: 'Concentrating CO₂ keeps a fast RuBisCO', x: 1000, y: 66, size: 40 },
    { beat: 4, text: 'Oxygenation became frequent', x: 1000, y: 66, size: 40 },
    { beat: 5, text: 'Temperature offset the CO₂ effect', x: 1000, y: 66, size: 40 },
    { beat: 6, text: 'CO₂ rose: oxygenation fell', x: 1000, y: 66, size: 40 },
    { beat: 7, text: 'How does the leaf turn 3-PGA into sugar?', x: 800, y: 103, size: 42 },
  ],
  name: 'v3 · v2 fixed: RuBisCO as on C2, 3 factors, one state',
  note: 'RuBisCO through Earth’s history (v3): v2’s broken time axis and living scenes; RuBisCO drawn as on slide C2 under a beam balance; the 3 factors (air, leaf temperature, RuBisCO’s CO₂ preference) and the balance all follow one state; today’s RuBisCOs swapped in today’s air at 25 °C, then CO₂ concentrated in a cyanobacterium; dinosaurs, then the ice age; 1750 → today → a hot day → a hot, dry day; clippings',
  beats: C2STORY3,
  holds: [[], [], [], [], [], [], HOLDS6, []],
  svg: () => `<defs>
      <filter id="c3-csh" x="-10%" y="-8%" width="120%" height="125%"><feDropShadow dx="1" dy="5" stdDeviation="6" flood-color="#3d3020" flood-opacity=".24"/></filter>
      <filter id="c3-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 0.55 -0.12" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in"/></filter>
    </defs>
    <g class="c2s c3s">
      <rect class="cs-paperbg" x="0" y="0" width="1600" height="740"/>
      <clipPath id="c3-ground"><rect x="0" y="472" width="1600" height="268"/></clipPath>
      <g data-k="cs-scenes">${SKY.map((sk, i) => `<g data-k="cs-sc${i}" opacity="0" display="none"><g class="cs-sky">${sk}</g><g class="cs-gr" clip-path="url(#c3-ground)">${GROUND[i]}</g></g>`).join('')}</g>
      <g data-k="cs-chart">${chartSvg()}</g>
      ${panelSvg()}${clipsSvg()}
    </g>`,
  bind(stage) {
    const els = new Map<string, Element>();
    stage.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
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
    const io = { tr: (k: string, v: string): void => set(k, 'transform', v), op, at: (k: string, a: string, v: string): void => set(k, a, v) };
    const t0wall = performance.now();

    return (beat, t) => {
      const amb = FROZEN ? t : (performance.now() - t0wall) / 1000;
      const last = beat === 7, st = state(beat, t), x = st.x;
      const dimLast = last ? 1 - 0.65 * ease(t, 0, 0.6) : 1;

      /* ---- the chart: dimmed while the dial runs (beats 3–4) */
      const chartOn = beat === 0 ? 0.35 * ease(t, 0, 0.5) : beat === 1 ? 0.35 + 0.65 * ease(t, 0, 0.6) : 0.3 + 0.7 * st.mark;
      op('cs-axes', chartOn * dimLast);
      op('cs-curves', (beat === 0 ? 0 : 0.3 + 0.7 * st.mark) * dimLast);
      set('cs-clip', 'width', f(Math.max(0, x - X0 + 6)));
      op('cs-goe', beat === 1 ? ramp(x, 154, 157) : beat === 2 ? 1 - ease(t, 0, 0.6) : 0);
      op('cs-off', (beat === 0 ? 0 : beat === 1 ? ease(t, 0.2, 0.8) : 0.3 + 0.7 * st.mark) * dimLast);
      op('cs-clab', (beat < 4 ? 0 : beat === 4 ? ramp(x, X_REC, X_REC + 10) : 1) * dimLast);
      op('cs-ph', (beat === 0 ? 0 : beat === 1 ? ease(t, 0, 0.4) : st.mark) * (last ? 1 - ease(t, 0, 0.6) : 1));
      set('cs-ph', 'transform', `translate(${f(x)} 0)`);
      const ya = yaAt(x), c = co2Drawn(ya), tv = tDrawn(ya), arche = ya > 4.2e8;
      set('cs-pdc', 'cy', f(c !== null ? yC(c) : Y0 + 26)); op('cs-pdc', c !== null || arche ? 1 : 0);
      if (tv !== null) set('cs-pdt', 'cy', f(yT(tv)));
      op('cs-pdt', tv !== null ? 1 : 0);
      const [stt, sto] = statusOf(beat, t, beat === 4 || beat === 5 || beat === 6 ? xBlur(beat, t) : x);
      set('cs-status', 'text', stt); op('cs-status', sto);
      op('cs-crd', beat === 0 ? 0 : 1);

      /* ---- scenes */
      const scOn = beat === 0 ? 0 : beat === 1 ? ease(t, 0, 1.0) : 1;
      const wm = sceneW(x);
      for (let i = 0; i < N_SCENES; i++) {
        let v = st.mark * wm[i] + (i === SC_CARRIERS ? 1 - st.mark : 0);
        v *= scOn * (last ? 1 - 0.5 * ease(t, 0, 0.6) : 1);
        op(`cs-sc${i}`, v);
        if (v > 0.004) animScene(i, amb, beat === 5 ? t : END, io, { walk: B5_WALK, spot: st.spot });
      }

      /* ---- the panel: RuBisCO as on C2 and the balance */
      op('c3-panel', beat === 0 ? ease(t, 0, 0.5) : 1);
      op('c3-heads', beat === 0 ? ease(t, 0.2, 0.6) : 1);
      op('c3-gasc', beat === 0 ? ease(t, 0.5, 0.9) : 1);
      op('c3-gaso', (beat === 0 ? ease(t, 0.5, 0.9) : 1) * st.o2g);
      op('c3-rub', st.rubOp);
      op('c3-shell', st.ccm);
      for (let i = 0; i < 3; i++) op(`c3-x${i}`, clamp(st.xco2 * 1.3 - i * 0.1));
      const ox = oxPer100S(st.s, st.tl, st.ca, st.o2, st.k * st.m);
      const L = 100 * st.wBal, Rv = ox * st.wBal;
      const th = (TILT * (L - Rv) * Math.PI) / 180;
      set('c3-beam', 'transform', `translate(${BX} ${YP}) rotate(${f(-TILT * (L - Rv))})`);
      const eL: V = [BX - ARM * Math.cos(th), YP + ARM * Math.sin(th)], eR: V = [BX + ARM * Math.cos(th), YP - ARM * Math.sin(th)];
      set('c3-trayL', 'transform', `translate(${f(eL[0])} ${f(eL[1] - 3.5)})`);
      set('c3-trayR', 'transform', `translate(${f(eR[0])} ${f(eR[1] - 3.5)})`);
      set('c3-barL', 'y', f(-3 - BAR * L)); set('c3-barL', 'height', f(BAR * L));
      set('c3-barR', 'y', f(-3 - BAR * Rv)); set('c3-barR', 'height', f(BAR * Rv));
      set('c3-bvL', 'y', f(-10 - BAR * L)); set('c3-bvR', 'y', f(-10 - BAR * Rv));
      set('c3-bvL', 'text', '100'); set('c3-bvR', 'text', fmtOx(ox, st.tl));
      op('c3-bvL', st.wBal); op('c3-bvR', st.wBal);

      /* ---- the 3 factors (beat 1 names them one by one) */
      op('c3-r1', beat === 0 ? ease(t, 0.9, 1.3) : 1);
      op('c3-r2', beat === 0 ? ease(t, 1.5, 1.9) : 1);
      op('c3-r3', beat === 0 ? ease(t, 2.0, 2.4) : 1);
      // the highlights link each factor to the drawing: the air to the gases, RuBisCO to the render
      const hA = beat === 0 ? life(t, 0.9, 1.2, 1.9, 2.3) : 0, hT = beat === 0 ? life(t, 1.5, 1.8, 2.3, 2.6) : 0, hR = beat === 0 ? life(t, 2.0, 2.3, 2.5, 2.6) : 0;
      op('c3-hla', hA); op('c3-bda', hA); op('c3-bdt', hT); op('c3-hlr', hR); op('c3-bdr', hR);
      // air
      set('c3-air', 'text', st.airTxt ?? fmtAir(st.ca, st.o2));
      op('c3-air', st.wAir * (st.airTxt ? st.airTxtOp : 1));
      // leaf temperature
      set('c3-leaf', 'text', fmtLeaf(st.tl)); op('c3-leaf', st.wT);
      // RuBisCO: its name, its CO₂ preference S, its speed (a bar, beats 3–4)
      set('c3-name', 'text', st.name); op('c3-name', st.wName * st.nameOp);
      set('c3-s', 'text', String(Math.round(st.s))); op('c3-s', st.wS);
      set('c3-sbar', 'width', f((QW * st.s * st.wS) / S_MAX));
      op('c3-r5', st.wK); set('c3-kbar', 'width', f(((QR - SPB_X) * st.kcat * st.wK) / K_MAX));

      /* ---- the clippings (beat 8) */
      for (let i = 0; i < CLIPS.length; i++) {
        const a = last ? ease2(t, 0.5 + i * 0.8, 1.2 + i * 0.8) : 0;
        op(`cs-clip${i}`, a);
        set(`cs-clip${i}`, 'transform', `translate(0 ${f(14 * (1 - a))})`);
      }
    };
  },
};
