// 'c2story', version 2 · "RuBisCO through Earth's history" (slide C2; lecturer, 28–29 Oct 2026; brief
// research/redo-2026-10-29/C2STORY_V2_BRIEF.md and the same night's correction: one chart with a broken time axis, no
// inset). One fixed framing, no camera moves.
// - The chart fills the stage width: time in 4 segments with axis breaks (A 4 billion → 1 million years ago, log; B
//   800,000 → 12,000 years ago; C 12,000 years ago → 1750; D 1750 → September 2026, calendar years; B–D linear), CO₂ in
//   the air (ppm, log, left axis, ink) and the change in global mean surface temperature from 1850–1900 (°C, right axis,
//   red). The curves (c2story-data.ts) are drawn piecewise and revealed left to right by a playhead; the status line
//   gives the time, CO₂ and temperature (and O₂ while it matters).
// - Below the chart, living era scenes (c2story-scenes.ts) cross-fade as the playhead passes.
// - Lower right, a beam balance with RuBisCO (own render of PDB 8RUC) as its fulcrum: 100 carboxylations on the left pan,
//   the calculated oxygenations on the right; the beam tilts by the difference, eased. Beside it: the leaf
//   temperature, RuBisCO's CO₂ preference relative to 25 °C, and in beat 8 the CO₂ effect, the temperature effect and the
//   net, then a hot, dry day (c2story-model.ts gives every formula).
// - Beat 9: 3 newspaper-style clippings on engineering RuBisCO (generic design, no masthead).
// Ambient loops run on the wall clock, so the scenes keep moving while a beat holds; with ?t= (frozen screenshots) they
// run on t, so every frame is reproducible.
import './dk-c2story.css';
import { C2STORY } from './beats-c2story';
import { CO2_B, CO2_C, CO2_D, FOSTER, O2_GCS, T_A, T_B, T_C, T_D } from './c2story-data';
import { CC_CA, leafT, netPer100, oxPer100, prefRel25 } from './c2story-model';
import { animScene, GROUND, N_SCENES, SKY } from './c2story-scenes';
import { cutPath } from './antenna-common';
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
const sgn = (v: number, d = 1): string => (Math.abs(v) < 0.5 * 10 ** -d ? (0).toFixed(d) : `${v > 0 ? '+' : MINUS}${Math.abs(v).toFixed(d)}`);

/* ---------------------------------------------------------------- the broken time axis */

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
/** The segment and time (years ago) under x; null in a break. */
function timeAt(x: number): { s: number; ya: number } | null {
  for (let s = 0; s < 4; s++) {
    const [a, b] = SX[s];
    if (x < a - 0.01 || x > b + 0.01) continue;
    const u = clamp((x - a) / (b - a));
    if (s === 0) return { s, ya: 10 ** (LA - u * (LA - LB)) };
    if (s === 1) return { s, ya: 8e5 - u * (8e5 - 1.2e4) };
    if (s === 2) return { s, ya: 1.2e4 - u * (1.2e4 - YA1750) };
    return { s, ya: NOW - (1750 + u * (D_END - 1750)) };
  }
  return null;
}
const C_LO = Math.log10(150), C_HI = Math.log10(4000);
const yC = (ppm: number): number => Y1 - ((Math.log10(ppm) - C_LO) / (C_HI - C_LO)) * (Y1 - Y0);
const T_LO = -12, T_HI = 24;
const yT = (d: number): number => Y1 - ((d - T_LO) / (T_HI - T_LO)) * (Y1 - Y0);

/* ---------------------------------------------------------------- the series, per segment, oldest first: [years ago, value] */

/** Foster 2017 at 10-million-year steps above 10 million years ago (the log axis packs 420–10 million years into
 *  ≈ 230 px), at its 0.5-million-year steps below. */
const FOSTER_SHOWN = FOSTER.filter(([ma]) => ma < 10 || Math.round(ma) % 10 === 0 || ma > 419);
/** A series' value at ya, linear between its points (null outside; ends matched to 1 part in 10⁶). */
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
/** Points of pts between ya0 and ya1 (ya0 > ya1), with interpolated end points exactly at both. */
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
const co2At = (ya: number): number | null => { const s = segOf(ya); return s < 0 ? null : at(CO2S[s], ya); };
const tAt = (ya: number): number | null => { const s = segOf(ya); return s < 0 ? null : at(TS[s], ya); };
const o2Gcs = (ma: number): number => (O2_GCS.find(([m]) => m === ma) as [number, number])[1];
const d = (pts: V[], s: number, y: (v: number) => number): string => `M${pts.map(([a, v]) => `${f(xIn(s, a))},${f(y(v))}`).join(' L')}`;

/* ---------------------------------------------------------------- the readout of each beat (c2story-model.ts) */

interface RO { L: number; R: number; ox: string; net: number; leaf: number | null; pref: number | null }
function calc(ya: number, o2 = 20.95): RO {
  const ca = co2At(ya) as number, dT = tAt(ya) as number, t = leafT(dT), ox = oxPer100(t, ca, o2);
  return { L: 100, R: ox, ox: String(Math.round(ox)), net: netPer100(ox), leaf: t, pref: prefRel25(t) };
}
/** Beat time points (years ago). The Archean and the Great Oxidation Event have no temperature record: their readouts do
 *  not depend on it (O₂ ≈ 0: Γ* ≈ 0 at any temperature), so the leaf and preference rows show from beat 4 on. */
const YA_PH = [4e9, 3e9, 2.3e9, 3e8, 1e8, 2e4, YA1750];
const RO_B: Array<RO | null> = [
  null,
  { L: 100, R: 0, ox: '0', net: 100, leaf: null, pref: null },
  // O₂ ≤ 0.1 % of today (0.021 %): ≤ 0.07 at 278 ppm CO₂
  { L: 100, R: oxPer100(25, 278.3, 0.021), ox: '&lt; 1', net: 100, leaf: null, pref: null },
  calc(3e8, o2Gcs(300)),
  calc(1e8, o2Gcs(100)),
  calc(2e4),
  calc(YA1750),
];
const OX1750 = RO_B[6]?.R as number;
const CA26 = 429.55, D26 = at(TS[3], NOW - 2026.375) as number;
const OX26C = oxPer100(25, CA26), OX26T = oxPer100(leafT(D26), CA26), OXDRY = oxPer100(35, CA26, 20.95, 0.35);
/** Beat 8's 3 steps (seconds into the beat): the CO₂ effect (1750 → 2026 at 25 °C), the temperature effect, a hot, dry day. */
const HOLDS = [5.0, 6.8];
const PH_T: V[] = [[0, 0], [0.4, 2.2], [0.2, 2.0], [0.2, 2.6], [0.2, 2.2], [0.2, 2.6], [0.2, 2.2]];
const STEP1: V = [0.6, 4.6], WARM: V = [5.2, 6.4], HEAT: V = [7.1, 8.3], DRY: V = [9.0, 10.2];
const fmtPpm = (v: number): string => String(Math.round(v));
const STATUS: string[] = [
  '',
  '≈ 3 billion years ago · CO₂ ≈ 10–2500 × today · O₂ &lt; 10⁻⁶ of today',
  '≈ 2.43–2.22 billion years ago · O₂ rises above 10⁻⁵ of today',
  `300 million years ago · CO₂ ${fmtPpm(co2At(3e8) as number)} ppm · O₂ ${o2Gcs(300)} % · temperature ${sgn(tAt(3e8) as number)} °C`,
  `100 million years ago · CO₂ ${fmtPpm(co2At(1e8) as number)} ppm · O₂ ${o2Gcs(100)} % · temperature ${sgn(tAt(1e8) as number)} °C`,
  `≈ 20,000 years ago, last glacial maximum · CO₂ ${fmtPpm(co2At(2e4) as number)} ppm · temperature ${sgn(tAt(2e4) as number)} °C`,
  `1750 · CO₂ ${fmtPpm(co2At(YA1750) as number)} ppm · temperature ${sgn(tAt(YA1750) as number)} °C`,
];
const STATUS26 = `2026 · CO₂ 429.6 ppm (September) · temperature ${sgn(D26)} °C (January–September)`;

/* ---------------------------------------------------------------- the chart */

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
    <clipPath id="cs-clip"><rect data-k="cs-clip" x="${X0 - 6}" y="0" width="0" height="470"/></clipPath>
    <g data-k="cs-curves" clip-path="url(#cs-clip)" opacity="0">
      <path class="cs-band" d="${bandC}"/><path class="cs-bandt" d="${bandT}"/>
      <path class="cs-co2h" d="${co2}"/><path class="cs-co2" d="${co2}"/>
      <path class="cs-th" d="${tmp}"/><path class="cs-t" d="${tmp}"/>
      <path class="cs-arch" d="M${f(xIn(0, 4e9))},${Y0 + 26} H${f(xIn(0, 2.5e9))}"/><path class="cs-archa" d="M${f(xa)},${Y0 + 22} v-18 m-6,7 l6,-7 l6,7"/>
    </g>
    <g data-k="cs-off" opacity="0">${T(xa + 12, Y0 + 20, 'CO₂ off the scale', 'cs-note cs-halo')}</g>
    <g data-k="cs-end" opacity="0"><circle class="cs-pdt" cx="${f(xYr(2026.375))}" cy="${f(yT(D26))}" r="5"/>
      ${T(xYr(2026.375) - 10, yT(D26) - 12, `${sgn(D26)} °C`, 'cs-endt cs-halo', 'end')}${T(xYr(2026.71) - 8, yC(429.55) + 54, '429.6 ppm', 'cs-endc cs-halo', 'end')}</g>
    <g data-k="cs-goe" opacity="0"><rect class="cs-goe" x="${f(goe0)}" y="${Y0}" width="${f(goe1 - goe0)}" height="${Y1 - Y0}"/>${T(goe1 + 8, Y0 + 66, 'Great Oxidation Event', 'cs-note cs-halo')}</g>
    <g data-k="cs-clab" opacity="0">${T(xIn(0, 4.3e8) - 8, yC(1444) + 6, 'CO₂', 'cs-lc cs-halo', 'end')}${T(xIn(0, 4.9e8) - 8, yT(18.1) + 6, 'temperature', 'cs-lt cs-halo', 'end')}</g>
    <g data-k="cs-ph" display="none"><path class="cs-phl" d="M0,${Y0 - 4} V${Y1}"/><circle data-k="cs-pdc" class="cs-pdc" cx="0" cy="0" r="7"/><circle data-k="cs-pdt" class="cs-pdt" cx="0" cy="0" r="7"/></g>
    <text data-k="cs-status" class="cs-status cs-halo" x="${X0}" y="${Y0 - 28}"> </text>
    ${T(1590, 24, 'CO₂: Foster et al. 2017; Bereiter et al. 2015; NOAA GML · temperature: Judd et al. 2024; Snyder 2016; Osman et al. 2021; HadCRUT5 (Met Office, CRU)', 'cs-crd', 'end', 'cs-crd')}`;
}

/* ---------------------------------------------------------------- the balance panel */

const PX = 964, PY = 468, PW = 620, PH = 268;
const BX = 1132, BY = PY + 72, ARM = 118, HANG = 34, BAR = 0.62, TILT = 0.22;
const QX = 1318, QW = 1572 - QX;
const RW = 128, RH = (RW * 471) / 548;
function panelSvg(): string {
  const pan = (k: string, cls: string): string => `<g data-k="cs-pan${k}">
      <path class="cs-str" d="M0,${-HANG} L-34,-4 M0,${-HANG} L34,-4"/><path class="cs-pan" d="M-40,-4 H40 Q36,8 0,8 Q-36,8 -40,-4Z"/>
      <rect data-k="cs-bar${k}" class="${cls}" x="-22" y="-4" width="44" height="0" rx="3"/>
      <text data-k="cs-bv${k}" class="cs-bv" x="0" y="-12" text-anchor="middle"> </text></g>`;
  const ry = (k: number): number => PY + 174 + k * 24;
  return `<g data-k="cs-panel" opacity="0">
    <rect class="cs-panelbg" x="${PX}" y="${PY}" width="${PW}" height="${PH}" rx="16"/>
    <path class="cs-rule" d="M${QX - 14},${PY + 16} V${PY + PH - 42}"/>
    <image href="${rubiscoPng}" x="${f(BX - RW / 2)}" y="${f(BY + 2)}" width="${RW}" height="${f(RH)}"/>
    <g data-k="cs-beam"><path class="cs-beam" d="M${-ARM - 4},0 H${ARM + 4}"/><circle class="cs-hook" cx="${-ARM}" cy="0" r="3.5"/><circle class="cs-hook" cx="${ARM}" cy="0" r="3.5"/></g>
    <circle class="cs-pin" cx="${BX}" cy="${BY}" r="6"/>
    ${pan('L', 'cs-barc')}${pan('R', 'cs-baro')}
    <g data-k="cs-nlc" opacity="0">${T(BX - ARM, PY + PH - 38, 'carboxylation', 'cs-pl', 'middle')}</g>
    <g data-k="cs-nlo" opacity="0">${T(BX + ARM, PY + PH - 38, 'oxygenation', 'cs-pl cs-pl-o', 'middle')}</g>
    ${T(BX, PY + PH - 38, 'RuBisCO', 'cs-mn', 'middle')}
    <g data-k="cs-ro" opacity="0">
      <g transform="translate(0 -54)"><g data-k="cs-tr" opacity="0">
        ${T(QX, PY + 88, 'leaf temperature', 'cs-pr')}<text data-k="cs-leaf" class="cs-pv2" x="${QX + QW}" y="${PY + 88}" text-anchor="end">25.0 °C</text>
        ${T(QX, PY + 116, 'CO₂ preference, relative to 25 °C', 'cs-ph')}
        <rect class="cs-prefbg" x="${QX}" y="${PY + 126}" width="${QW - 56}" height="12" rx="6"/><rect data-k="cs-pref" class="cs-pref" x="${QX}" y="${PY + 126}" width="0" height="12" rx="6"/>
        <path class="cs-pref100" d="M${f(QX + ((QW - 56) * 1) / 1.5)},${PY + 121} v22"/>
        <text data-k="cs-prefv" class="cs-prefv" x="${QX + QW}" y="${PY + 137}" text-anchor="end">100 %</text>
      </g>
      <g data-k="cs-fx" opacity="0">
        <text data-k="cs-fxh" class="cs-ph" x="${QX}" y="${PY + 166}"> </text>
        ${[0, 1, 2].map(k => `<g data-k="cs-fr${k}" opacity="0"><text data-k="cs-frl${k}" class="cs-fl" x="${QX}" y="${ry(k) + 16}"> </text><text data-k="cs-frv${k}" class="cs-fv" x="${QX + QW}" y="${ry(k) + 16}" text-anchor="end"> </text></g>`).join('')}
      </g></g>
    </g>
    <text data-k="cs-calc" class="cs-calc" x="${PX + 22}" y="${PY + PH - 12}" opacity="0">calculated per 100 carboxylations · leaf: 25 °C + change in global mean temperature</text>
  </g>`;
}

/* ---------------------------------------------------------------- the clippings (beat 9) */

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
      <path class="cs-cpaper" d="${cutPath(x, CY, CW, CH, 61 + i * 7, 2.6)}" filter="url(#cs-csh)"/>
      <path class="cs-cpaper cs-ctex" d="${cutPath(x, CY, CW, CH, 61 + i * 7, 2.6)}" filter="url(#cs-grain)"/>
      <path class="cs-crule" d="M${x + 22},${CY + 40} H${x + CW - 22} M${x + 22},${CY + 44} H${x + CW - 22}"/>
      ${T(x + 22, CY + 30, c.year, 'cs-cyear')}${head}
      <path class="cs-crule1" d="M${x + 22},${CY + 160} H${x + 90}"/>${body}
      ${T(x + 22, CY + CH - 16, c.src, 'cs-csrc')}</g></g>`;
  }).join('');
}

/* ---------------------------------------------------------------- the beats */

/** Scene shown at each beat (index into the scenes); beat 8 switches from industry (6) to today (7). */
const SCENE = [-1, 0, 1, 2, 3, 4, 5, 6, 7];
const FROZEN = typeof location !== 'undefined' && new URLSearchParams(location.search).has('t');

export const STAGING: Staging = {
  id: 'v2',
  name: 'v2 · Balance and broken time axis',
  note: 'RuBisCO through Earth’s history (v2): one chart with a broken time axis (4 billion years ago → September 2026), CO₂ and global temperature; living era scenes; a beam balance of carboxylations and oxygenations with RuBisCO as fulcrum, calculated with leaf at 25 °C + ΔGMST; CO₂ and temperature effects since 1750, a hot dry day; 4 newspaper clippings',
  beats: C2STORY,
  holds: [[], [], [], [], [], [], [], HOLDS, []],
  svg: () => `<defs>
      <filter id="cs-csh" x="-10%" y="-8%" width="120%" height="125%"><feDropShadow dx="1" dy="5" stdDeviation="6" flood-color="#3d3020" flood-opacity=".24"/></filter>
      <filter id="cs-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 0.55 -0.12" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in"/></filter>
    </defs>
    <g class="c2s">
      <rect class="cs-paperbg" x="0" y="0" width="1600" height="740"/>
      <clipPath id="cs-ground"><rect x="0" y="472" width="1600" height="268"/></clipPath>
      <g data-k="cs-scenes">${SKY.map((sk, i) => `<g data-k="cs-sc${i}" opacity="0" display="none"><g class="cs-sky">${sk}</g><g class="cs-gr" clip-path="url(#cs-ground)">${GROUND[i]}</g></g>`).join('')}</g>
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
      const last = beat === 8;

      /* ---- the playhead, in x: through the segments in order; beat 8 crosses the break to 1750, then runs in calendar years */
      const xOfBeat = (b: number): number => (b === 6 ? SX[2][1] : xIn(segOf(YA_PH[b]), YA_PH[b]));
      let x: number;
      if (beat === 0) x = SX[0][0];
      else if (beat < 7) { const [p0, p1] = PH_T[beat]; x = lerp(xOfBeat(beat - 1), xOfBeat(beat), ease2(t, p0, p1)); }
      else if (beat === 7) x = t < STEP1[0] ? lerp(SX[2][1], SX[3][0], ease(t, 0.1, 0.5)) : xYr(lerp(1750, 2026.71, cruise(t, STEP1[0], STEP1[1])));
      else x = xYr(2026.71);
      const here = timeAt(x);
      const yrNow = beat === 7 && here && here.s === 3 ? NOW - here.ya : 1750;

      op('cs-axes', beat === 0 ? 0.35 * ease(t, 0, 0.5) : beat === 1 ? 0.35 + 0.65 * ease(t, 0, 0.6) : last ? 1 - 0.65 * ease(t, 0, 0.6) : 1);
      op('cs-curves', beat === 0 ? 0 : last ? 1 - 0.65 * ease(t, 0, 0.6) : 1);
      set('cs-clip', 'width', f(Math.max(0, x - X0 + 6)));
      op('cs-goe', beat === 2 ? ease(t, 1.4, 2.2) : beat === 3 ? 1 - ease(t, 0, 0.8) : 0);
      op('cs-off', beat === 0 ? 0 : beat === 1 ? ease(t, PH_T[1][1] - 0.2, PH_T[1][1] + 0.3) : last ? 1 - 0.65 * ease(t, 0, 0.6) : 1);
      op('cs-end', beat === 7 ? ease(t, STEP1[1] - 0.2, STEP1[1] + 0.3) : last ? 1 - 0.65 * ease(t, 0, 0.6) : 0);
      op('cs-clab', beat < 3 ? 0 : beat === 3 ? ease(t, 1.6, 2.2) : last ? 1 - 0.65 * ease(t, 0, 0.6) : 1);
      op('cs-ph', beat === 0 ? 0 : beat === 1 ? ease(t, 0, 0.4) : last ? 1 - ease(t, 0, 0.6) : 1);
      set('cs-ph', 'transform', `translate(${f(x)} 0)`);
      const c = here ? co2At(here.ya) : null, tv = here ? tAt(here.ya) : null;
      const arche = here !== null && here.s === 0 && here.ya > 4.2e8;
      set('cs-pdc', 'cy', f(c !== null ? yC(c) : Y0 + 26)); op('cs-pdc', here && (c !== null || arche) ? 1 : 0);
      if (tv !== null) set('cs-pdt', 'cy', f(yT(tv)));
      op('cs-pdt', tv !== null ? 1 : 0);
      // the status line: the beat's time and values once the playhead arrives; in beat 8 it follows the playhead
      let st = STATUS[beat] ?? STATUS26, stOn = 1;
      if (beat === 0) stOn = 0;
      else if (beat < 7) stOn = ease(t, PH_T[beat][1] - 0.2, PH_T[beat][1] + 0.3);
      else if (beat === 7 && t < STEP1[1] + 0.05) {
        const yr = Math.floor(yrNow), cc = here ? co2At(here.ya) : 278.3, tt = here ? tAt(here.ya) : null;
        st = t < STEP1[0] + 0.05 ? STATUS[6] : `${yr} · CO₂ ${fmtPpm(cc ?? 278.3)} ppm${tt !== null ? ` · temperature ${sgn(tt)} °C` : ''}`;
      } else st = STATUS26;
      set('cs-status', 'text', st || ' ');
      op('cs-status', stOn * (last ? 0.55 : 1));
      op('cs-crd', beat === 0 ? 0 : 1);

      /* ---- scenes: the beat's scene cross-fades in over 0–1.2 s; beat 8 switches to today as the playhead passes 1950–1985 */
      let cur = SCENE[beat], prev = beat === 8 ? 7 : SCENE[Math.max(0, beat - 1)], fade = beat === 0 ? 0 : ease(t, 0, 1.2);
      if (beat === 7 && t >= STEP1[0] && yrNow >= 1950) { cur = 7; prev = 6; fade = clamp((yrNow - 1950) / 35); fade = fade * fade * (3 - 2 * fade); }
      for (let i = 0; i < N_SCENES; i++) {
        let v = 0;
        if (i === cur) v = fade;
        if (i === prev && prev !== cur) v = Math.max(v, 1 - fade);
        if (i === prev && prev === cur) v = 1;
        v *= last ? 1 - 0.5 * ease(t, 0, 0.6) : 1;
        op(`cs-sc${i}`, v);
        if (v > 0.004) animScene(i, amb, t, io);
      }

      /* ---- the balance and the readout */
      op('cs-panel', beat === 0 ? ease(t, 0, 0.5) : 1);
      op('cs-nlc', beat === 0 ? ease(t, 0.7, 1.2) : 1);
      op('cs-nlo', beat === 0 ? ease(t, 1.7, 2.2) : 1);
      let ro: RO | null, prevRo: RO | null = null, w = 1, sw = 0;
      const fx: Array<[string, string, number]> = [];
      let fxh = '', fxOn = 1;
      if (beat < 7) {
        ro = RO_B[beat]; prevRo = beat > 0 ? RO_B[beat - 1] : null;
        sw = PH_T[beat][1]; w = beat === 0 ? 1 : ease2(t, sw, sw + 1.0);
      } else {
        // beat 8: the CO₂ effect (25 °C, CO₂ of the playhead's year), the temperature effect, a hot day, a dry day
        let tl = 25, k = CC_CA, ca = CA26;
        if (beat === 7 && t < HOLDS[0]) ca = (here && here.s === 3 ? co2At(here.ya) : 278.3) ?? 278.3;
        if (beat === 8 || t >= HOLDS[0]) tl = leafT(D26 * ease(t, WARM[0], WARM[1]));
        if (beat === 8 || t >= HOLDS[1]) { tl = lerp(leafT(D26), 35, beat === 8 ? 1 : ease(t, HEAT[0], HEAT[1])); k = lerp(CC_CA, 0.35, beat === 8 ? 1 : ease(t, DRY[0], DRY[1])); }
        const ox = oxPer100(tl, ca, 20.95, k);
        ro = { L: 100, R: ox, ox: String(Math.round(ox)), net: netPer100(ox), leaf: tl, pref: prefRel25(tl) };
        // the ledger: steps 1–2 show the effects since 1750; step 3 fades them out (0.25 s) and shows the hot, dry day
        const arrow = (v: number): string => { const r = Math.round(v); return r === 0 ? '0' : `${r < 0 ? '↓' : '↑'} ${Math.abs(r)}`; };
        const out = beat === 7 ? 1 - ease(t, HOLDS[1], HOLDS[1] + 0.25) : 0;
        if (beat === 7 && t < HOLDS[1] + 0.25) {
          fxh = 'oxygenations since 1750:'; fxOn = beat === 7 && t >= HOLDS[1] ? out : 1;
          const cNow = t < HOLDS[0] ? ox : OX26C, tNow = t < HOLDS[1] ? ox : OX26T;
          fx.push(['CO₂ effect', arrow(cNow - OX1750), ease(t, STEP1[0], STEP1[0] + 0.4)]);
          fx.push(['temperature effect', arrow(tNow - OX26C), ease(t, WARM[0] - 0.1, WARM[0] + 0.3)]);
          fx.push(['net change', arrow(tNow - OX1750), ease(t, WARM[1], WARM[1] + 0.4)]);
        } else {
          fxh = 'on a hot, dry day:';
          const tt = beat === 8 ? 99 : t, heatOx = oxPer100(lerp(leafT(D26), 35, ease(tt, HEAT[0], HEAT[1])), CA26);
          fxOn = ease(tt, HOLDS[1] + 0.25, HOLDS[1] + 0.5);
          fx.push(['leaf at 35 °C', arrow(heatOx - OX26T), ease(tt, HEAT[0] - 0.1, HEAT[0] + 0.3)]);
          fx.push(['stomata half closed', arrow(ox - heatOx), ease(tt, DRY[0] - 0.1, DRY[0] + 0.3)]);
          fx.push(['vs 1750', arrow(OXDRY - OX1750), ease(tt, DRY[1] + 0.1, DRY[1] + 0.5)]);
        }
      }
      // the pans and the beam: eased from the previous beat's values to this beat's after the playhead arrives
      const L = lerp(prevRo?.L ?? 0, ro?.L ?? 0, w), Rv = lerp(prevRo?.R ?? 0, ro?.R ?? 0, w);
      const th = (TILT * (L - Rv) * Math.PI) / 180;
      set('cs-beam', 'transform', `translate(${BX} ${BY}) rotate(${f((TILT * (L - Rv)) * -1)})`);
      const endL: V = [BX - ARM * Math.cos(th), BY + ARM * Math.sin(th)], endR: V = [BX + ARM * Math.cos(th), BY - ARM * Math.sin(th)];
      set('cs-panL', 'transform', `translate(${f(endL[0])} ${f(endL[1] + HANG)})`);
      set('cs-panR', 'transform', `translate(${f(endR[0])} ${f(endR[1] + HANG)})`);
      set('cs-barL', 'y', f(-4 - BAR * L)); set('cs-barL', 'height', f(BAR * L));
      set('cs-barR', 'y', f(-4 - BAR * Rv)); set('cs-barR', 'height', f(BAR * Rv));
      set('cs-bvL', 'y', f(-12 - BAR * L)); set('cs-bvR', 'y', f(-12 - BAR * Rv));
      // the numbers switch when the playhead arrives (no invented values in between), with a short dip
      const showNew = beat >= 7 || t >= sw;
      const shown = showNew ? ro : prevRo;
      const dip = beat >= 1 && beat < 7 && prevRo ? 1 - 0.85 * life(t, sw - 0.25, sw - 0.05, sw + 0.05, sw + 0.3) : 1;
      const numsOn = beat === 0 ? 0 : beat === 1 ? ease(t, sw - 0.1, sw + 0.4) : 1;
      set('cs-bvL', 'text', shown ? String(shown.L) : ' '); set('cs-bvR', 'text', shown ? shown.ox : ' ');
      op('cs-bvL', numsOn * dip); op('cs-bvR', numsOn * dip);
      op('cs-ro', beat === 0 ? 0 : beat === 1 ? ease(t, sw - 0.1, sw + 0.4) : 1);
      op('cs-calc', beat === 0 ? 0 : beat === 1 ? ease(t, sw - 0.1, sw + 0.4) : 1);
      // the leaf temperature and CO₂ preference rows, from the first beat with a temperature record
      const trOn = beat < 3 ? 0 : beat === 3 ? ease(t, sw - 0.1, sw + 0.4) : 1;
      op('cs-tr', trOn);
      if (shown && shown.leaf !== null && shown.pref !== null) {
        set('cs-leaf', 'text', `${shown.leaf.toFixed(1)} °C`); op('cs-leaf', dip);
        const pv = beat >= 7 ? shown.pref : lerp(prevRo?.pref ?? shown.pref, shown.pref, w);
        set('cs-pref', 'width', f(((QW - 56) * Math.min(pv, 1.5)) / 1.5));
        set('cs-prefv', 'text', `${Math.round(shown.pref * 100)} %`); op('cs-prefv', dip);
      }
      // the effects ledger (beat 8)
      op('cs-fx', beat >= 7 ? (beat === 7 ? ease(t, STEP1[0], STEP1[0] + 0.4) : 1) : 0);
      set('cs-fxh', 'text', fxh || ' ');
      op('cs-fxh', fxOn);
      for (let k = 0; k < 3; k++) {
        const r = fx[k];
        if (!r) { op(`cs-fr${k}`, 0); continue; }
        set(`cs-frl${k}`, 'text', r[0]); set(`cs-frv${k}`, 'text', r[1]);
        set(`cs-frv${k}`, 'class', `cs-fv ${r[1].startsWith('↓') ? 'cs-fv-d' : r[1].startsWith('↑') ? 'cs-fv-u' : ''}`);
        op(`cs-fr${k}`, r[2] * fxOn);
      }

      /* ---- the clippings (beat 9) */
      for (let i = 0; i < CLIPS.length; i++) {
        const a = last ? ease2(t, 0.5 + i * 0.8, 1.2 + i * 0.8) : 0;
        op(`cs-clip${i}`, a);
        set(`cs-clip${i}`, 'transform', `translate(0 ${f(14 * (1 - a))})`);
      }
    };
  },
};
