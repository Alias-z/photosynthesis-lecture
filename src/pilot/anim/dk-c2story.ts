// 'c2story', staging s · "RuBisCO through Earth's history" (slide C2; lecturer, 28 Oct 2026; brief
// research/redo-2026-10-28/C2_STORY_BRIEF.md with the same day's scope change). One fixed framing, no camera moves.
// - The chart fills the stage: time in years ago on a log scale (4 billion → today), CO₂ in the air (ppm, log scale,
//   left axis) and O₂ (% of air, log scale, right axis). The real curves (c2story-data.ts) are revealed left to right
//   by a playhead; a status line names the time and its CO₂ and O₂.
// - Behind the chart, era scenes (c2story-scenes.ts) cross-fade as the playhead passes.
// - Lower right, the corner RuBisCO: RuBP below, CO₂ in from the left (carboxylation of RuBP, amber flash), O₂ in from
//   the right (oxygenation of RuBP, red flash), in eased glides; beside it the readout, labelled "calculated":
//   oxygenations and net CO₂ fixed per 100 carboxylations of RuBP, and a bar for the net carbon gain (beats-c2story.ts
//   gives the rule and the values).
// - Beats: 1 intro (1 carboxylation, 1 oxygenation, both named) · 2 ≈ 3 billion years ago · 3 Great Oxidation Event ·
//   4 300 million years ago · 5 100 million years ago · 6 last glacial maximum · 7 1750 · 8 1750 → Sep 2026, then
//   warming 25 → 35 °C · 9 3 cards on engineering RuBisCO.
import './dk-c2story.css';
import { C2STORY } from './beats-c2story';
import { FOSTER, ICE_LOG, O2_BAND, O2_EARLY, O2_GCS } from './c2story-data';
import { GROUND, SCENES, SKY } from './c2story-scenes';
import { CO2_ANNUAL, CO2_FROM } from './cr14-data';
import { cutPath } from './antenna-common';
import { molecule } from '../illus';
import { row } from '../figs/carbon-form';
import rubiscoPng from '../../assets/rf/rubisco-8ruc.png';
import { oxyPer100 } from '../figs/rb-kit';
import type { Staging } from './types';

type V = [number, number];
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * (3 - 2 * u); };
const ease2 = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * u * (u * (u * 6 - 15) + 10); };
const life = (t: number, a0: number, a1: number, b0: number, b1: number): number => ease(t, a0, a1) * (1 - ease(t, b0, b1));
const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text${k ? ` data-k="${k}"` : ''} class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

/* ---------------------------------------------------------------- the chart geometry (stage units) */

const X0 = 130, X1 = 1430, Y0 = 92, Y1 = 430;
/** The scenes' organisms and objects stay below this line, under the x-axis title; above it only the sky tint shows. */
const GROUND_Y = 496;
const LMAX = Math.log10(4e9), LMIN = -1;
/** x of a time, in years ago (log scale; today = 0.1 years ago, the right edge). */
const xOf = (ya: number): number => X0 + ((LMAX - Math.log10(Math.max(ya, 0.1))) / (LMAX - LMIN)) * (X1 - X0);
const C_LO = Math.log10(150), C_HI = Math.log10(4000);
const yC = (ppm: number): number => Y1 - ((Math.log10(ppm) - C_LO) / (C_HI - C_LO)) * (Y1 - Y0);
const O_LO = -5, O_HI = Math.log10(40);
const yO = (pct: number): number => Y1 - ((Math.log10(pct) - O_LO) / (O_HI - O_LO)) * (Y1 - Y0);
const TODAY = 2026.82;

/** CO₂ curve: Foster 2017 (≥ 1 million years ago), the ice cores, 1750, 1850, Mauna Loa, September 2026. */
/** Foster 2017 shown at 10-million-year steps above 10 million years ago (the log axis packs 420–10 million years into
 *  ≈ 200 px), at its 0.5-million-year steps below. */
const FOSTER_SHOWN = FOSTER.filter(([ma]) => ma < 10 || Math.round(ma) % 10 === 0 || ma > 419);
const CO2_PTS: V[] = [
  ...FOSTER_SHOWN.slice().reverse().map(([ma, ppm]): V => [ma * 1e6, ppm]),
  ...ICE_LOG.slice().reverse(),
  [TODAY - 1750, 278.3], [TODAY - 1850, 285.5],
  ...CO2_ANNUAL.map((v, i): V => [TODAY - (CO2_FROM + i + 0.5), v]),
  [TODAY - 2026.71, 429.55],
];
const dOf = (pts: V[], y: (v: number) => number): string => `M${pts.map(([ya, v]) => `${f(xOf(ya))},${f(y(v))}`).join(' L')}`;
const BAND = `M${FOSTER_SHOWN.map(([ma, , lo]) => `${f(xOf(ma * 1e6))},${f(yC(Math.max(lo, 150)))}`).join(' L')} L${FOSTER_SHOWN.slice().reverse().map(([ma, , , hi]) => `${f(xOf(ma * 1e6))},${f(yC(Math.min(hi, 4000)))}`).join(' L')}Z`;
const O2_LATE: V[] = [...O2_GCS.map(([ma, p]): V => [ma * 1e6, p]), [TODAY - 2026.5, 20.95]];
/** O₂ (% of air) at a time (years ago), interpolated on the drawn line (log time, log O₂). */
const O2_ALL: V[] = [...O2_EARLY, ...O2_LATE.slice(1)];
function o2At(ya: number): number {
  const L = Math.log10(Math.max(ya, 0.1));
  for (let i = 0; i < O2_ALL.length - 1; i++) {
    const [a0, v0] = O2_ALL[i], [a1, v1] = O2_ALL[i + 1], l0 = Math.log10(a0), l1 = Math.log10(Math.max(a1, 0.1));
    if (L <= l0 && L >= l1) { const u = (l0 - L) / (l0 - l1 || 1); return 10 ** (Math.log10(v0) + (Math.log10(v1) - Math.log10(v0)) * u); }
  }
  return 20.95;
}

function chartSvg(): string {
  const xt: Array<[number, string]> = [[4e9, '4 billion'], [1e9, '1 billion'], [1e8, '100 million'], [1e7, '10 million'], [1e6, '1 million'], [1e5, '100,000'], [1e4, '10,000'], [1e3, '1,000'], [100, '100'], [10, '10'], [0.1, 'today']];
  const ct = [200, 500, 1000, 2000], ot: Array<[number, string]> = [[1e-4, '0.0001'], [0.01, '0.01'], [1, '1'], [21, '21']];
  const grid = xt.map(([ya]) => `<path class="cs-grid" d="M${f(xOf(ya))},${Y0} V${Y1}"/>`).join('');
  const xl = xt.map(([ya, s], i) => `<path class="cs-tick" d="M${f(xOf(ya))},${Y1} v7"/>${i % 2 === 0 || ya === 0.1 ? T(xOf(ya), Y1 + 27, s, 'cs-tk cs-halo', 'middle') : ''}`).join('');
  const cl = ct.map(v => `<path class="cs-tick" d="M${X0},${f(yC(v))} h-7"/>${T(X0 - 12, yC(v) + 6, String(v), 'cs-tk cs-halo', 'end')}`).join('');
  const ol = ot.map(([v, s]) => `<path class="cs-tick" d="M${X1},${f(yO(v))} h7"/>${T(X1 + 12, yO(v) + 6, s, 'cs-tko cs-halo')}`).join('');
  const [b0, b1, lo, hi] = O2_BAND;
  return `<g data-k="cs-axes" opacity="0">
      <rect class="cs-plot" x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}"/>${grid}
      <path class="cs-axis" d="M${X0},${Y0} V${Y1} H${X1} V${Y0}"/>${xl}${cl}${ol}
      ${T(X0, Y1 + 56, 'years ago (log scale)', 'cs-ax cs-halo')}
      <text class="cs-axc cs-halo" transform="translate(48 ${(Y0 + Y1) / 2}) rotate(-90)" text-anchor="middle">CO₂ in the air (parts per million, ppm)</text>
      <text class="cs-axo cs-halo" transform="translate(1528 ${(Y0 + Y1) / 2}) rotate(90)" text-anchor="middle">O₂ (% of air)</text>
    </g>
    <clipPath id="cs-clip"><rect data-k="cs-clip" x="${X0 - 6}" y="0" width="0" height="740"/></clipPath>
    <g data-k="cs-curves" clip-path="url(#cs-clip)" opacity="0">
      <path class="cs-band" d="${BAND}"/>
      <rect class="cs-o2band" x="${f(xOf(b0))}" y="${f(yO(hi))}" width="${f(xOf(b1) - xOf(b0))}" height="${f(yO(lo) - yO(hi))}"/>
      <path class="cs-o2e" d="${dOf(O2_EARLY, yO)}"/><path class="cs-o2" d="${dOf(O2_LATE, yO)}"/>
      <path class="cs-co2h" d="${dOf(CO2_PTS, yC)}"/><path class="cs-co2" d="${dOf(CO2_PTS, yC)}"/>
      <path class="cs-arch" d="M${f(xOf(4e9))},${Y0 + 40} H${f(xOf(2.5e9))}"/><path class="cs-archa" d="M${f(xOf(3.2e9))},${Y0 + 36} v-26 m-6,8 l6,-8 l6,8"/>
    </g>
    <g data-k="cs-ph" display="none"><path class="cs-phl" d="M0,${Y0 - 6} V${Y1}"/><circle data-k="cs-pho" class="cs-pho" cx="0" cy="0" r="6"/><circle data-k="cs-phd" class="cs-phd" cx="0" cy="0" r="7"/></g>
    <text data-k="cs-status" class="cs-status cs-halo" x="${X0}" y="${Y0 - 24}"> </text>
    ${T(1590, Y0 - 52, 'CO₂: Foster et al. 2017; Bereiter et al. 2015; NOAA GML · O₂: Catling &amp; Zahnle 2020; Krause et al. 2018; GEOCARBSULF (Schachat et al. 2018)', 'cs-crd', 'end', 'cs-crd')}`;
}


/** Inset for beat 8: 1750 → September 2026 on a linear time axis, so the industrial rise reads at its true pace. */
const IX0 = 1000, IX1 = 1404, IY0 = 120, IY1 = 300;
const xI = (yr: number): number => IX0 + ((yr - 1750) / (2026.8 - 1750)) * (IX1 - IX0);
const yI = (ppm: number): number => IY1 - ((ppm - 260) / (440 - 260)) * (IY1 - IY0);
const INSET_PTS: V[] = [[1750, 278.3], [1850, 285.5], ...CO2_ANNUAL.map((v, i): V => [CO2_FROM + i + 0.5, v]), [2026.71, 429.55]];
/** CO₂ (ppm) in a calendar year, linearly interpolated between the inset's points. */
function caAt(yr: number): number {
  const y = Math.min(Math.max(yr, 1750), 2026.71);
  for (let i = 0; i < INSET_PTS.length - 1; i++) {
    const [a0, v0] = INSET_PTS[i], [a1, v1] = INSET_PTS[i + 1];
    if (y >= a0 && y <= a1) return v0 + ((v1 - v0) * (y - a0)) / (a1 - a0 || 1);
  }
  return INSET_PTS[INSET_PTS.length - 1][1];
}
function insetSvg(): string {
  const d = `M${INSET_PTS.map(([yr, v]) => `${f(xI(yr))},${f(yI(v))}`).join(' L')}`;
  const xt = [1750, 1850, 1950].map(yr => `<path class="cs-tick" d="M${f(xI(yr))},${IY1} v6"/>${T(xI(yr), IY1 + 24, String(yr), 'cs-tk', 'middle')}`).join('') + `<path class="cs-tick" d="M${f(xI(2026.71))},${IY1} v6"/>${T(xI(2026.71), IY1 + 24, '2026', 'cs-tk', 'middle')}`;
  const yt = [300, 350, 400].map(v => `<path class="cs-grid" d="M${IX0},${f(yI(v))} H${IX1}"/>${T(IX0 - 8, yI(v) + 6, String(v), 'cs-tk', 'end')}`).join('');
  return `<g data-k="cs-inset" opacity="0"><rect class="cs-ibg" x="${IX0 - 56}" y="${IY0 - 34}" width="${IX1 - IX0 + 76}" height="${IY1 - IY0 + 70}" rx="12"/>
    ${T(IX0 - 44, IY0 - 12, 'CO₂ in the air (ppm), 1750 → 2026', 'cs-ih')}${yt}<path class="cs-axis" d="M${IX0},${IY0} V${IY1} H${IX1}"/>${xt}
    <clipPath id="cs-iclip"><rect data-k="cs-iclip" x="${IX0 - 4}" y="${IY0 - 10}" width="0" height="${IY1 - IY0 + 20}"/></clipPath>
    <path class="cs-co2" d="${d}" clip-path="url(#cs-iclip)"/><circle data-k="cs-idot" class="cs-phd" cx="0" cy="0" r="6"/>
    <g data-k="cs-ilab" opacity="0">${T(xI(2026.71) - 8, yI(429.55) - 14, '429.6', 'cs-lab', 'end')}${T(xI(1750) + 8, yI(278.3) - 12, '278', 'cs-lab', 'start')}</g></g>`;
}

/* ---------------------------------------------------------------- the corner RuBisCO and the readout */

const PX = 968, PY = 486, PW = 616, PNH = 244;
/** The RuBisCO zone (left part of the panel) and the readout column (right part). */
const ZC = PX + 156, RW = 132, RH = (RW * 471) / 548, RX = ZC - RW / 2, RY = PY + 34;
const SITE: V = [RX + (317.6 / 548) * RW, RY + (309.5 / 471) * RH];
const CO2_FROM_P: V = [PX + 26, SITE[1] + 4], O2_FROM_P: V = [PX + 292, SITE[1] + 4];
const DOCK_C: V = [SITE[0] - 22, SITE[1] - 14], DOCK_O: V = [SITE[0] + 22, SITE[1] - 14];
const QX = PX + 330, QW = PW - 330 - 20;
const NPOOL = 12;
function cornerSvg(): string {
  const pool = (gas: 'c' | 'o'): string => Array.from({ length: NPOOL }, (_, i) =>
    `<g data-k="cs-${gas}${i}" display="none">${gas === 'c' ? molecule(0, 0, 'OCO', 10) : molecule(0, 0, 'OO', 10)}</g>`).join('');
  const ry = RY + RH + 22;
  return `<g data-k="cs-corner" opacity="0">
    <rect class="cs-panel" x="${PX}" y="${PY}" width="${PW}" height="${PNH}" rx="16"/>
    <path class="cs-rule" d="M${QX - 14},${PY + 18} V${PY + PNH - 18}"/>
    <g data-k="cs-ro" opacity="0">
      ${T(QX, PY + 34, 'per 100 carboxylations', 'cs-ph')}${T(QX, PY + 56, 'of RuBP:', 'cs-ph')}
      ${T(QX, PY + 96, 'oxygenations', 'cs-pr')}${T(QX, PY + 118, 'of RuBP', 'cs-pr')}<text data-k="cs-ox" class="cs-pv cs-pv-o" x="${QX + QW}" y="${PY + 108}" text-anchor="end">0</text>
      ${T(QX, PY + 156, 'net CO₂ fixed', 'cs-pr')}<text data-k="cs-net" class="cs-pv" x="${QX + QW}" y="${PY + 157}" text-anchor="end">100</text>
      <rect class="cs-barbg" x="${QX}" y="${PY + 170}" width="${QW}" height="14" rx="7"/><rect data-k="cs-bar" class="cs-bar" x="${QX}" y="${PY + 170}" width="${QW}" height="14" rx="7"/>
      <text data-k="cs-calc" class="cs-calc" x="${QX}" y="${PY + 214}">calculated · leaf at 25 °C</text>
    </g>
    <image href="${rubiscoPng}" x="${f(RX)}" y="${f(RY)}" width="${RW}" height="${f(RH)}"/>
    <circle class="cs-site" cx="${f(SITE[0])}" cy="${f(SITE[1])}" r="10"/>
    ${T(ZC, PY + 24, 'RuBisCO', 'cs-mn', 'middle')}
    <g class="fig">${row(ZC - 16, ry, 'PCCCCCP', { r: 7.5 })}</g>
    ${T(ZC + 50, ry + 6, 'RuBP', 'cs-mn', 'start')}
    <g data-k="cs-lc" opacity="0">${T(PX + 18, PY + PNH - 36, 'carboxylation', 'cs-pl', 'start')}${T(PX + 18, PY + PNH - 14, 'of RuBP', 'cs-pl', 'start')}</g>
    <g data-k="cs-lo" opacity="0">${T(PX + 300, PY + PNH - 36, 'oxygenation', 'cs-pl cs-pl-o', 'end')}${T(PX + 300, PY + PNH - 14, 'of RuBP', 'cs-pl cs-pl-o', 'end')}</g>
    <circle data-k="cs-flc" class="cs-flc" cx="${f(SITE[0])}" cy="${f(SITE[1])}" r="28" opacity="0"/>
    <circle data-k="cs-flo" class="cs-flo" cx="${f(SITE[0])}" cy="${f(SITE[1])}" r="28" opacity="0"/>
    <g class="fig">${pool('c')}${pool('o')}</g>
  </g>`;
}

/* ---------------------------------------------------------------- thermometer and cards */

const TH = { x: 930, top: 556, bot: 680 };
const thermoSvg = (): string => `<g data-k="cs-th" opacity="0">
  <rect class="cs-tube" x="${TH.x - 12}" y="${TH.top - 8}" width="24" height="${TH.bot - TH.top + 16}" rx="12"/>
  <circle class="cs-tube" cx="${TH.x}" cy="${TH.bot + 20}" r="22"/><circle class="cs-merc" cx="${TH.x}" cy="${TH.bot + 20}" r="15"/>
  <rect data-k="cs-merc" class="cs-merc" x="${TH.x - 5}" y="${TH.bot - 40}" width="10" height="60" rx="5"/>
  <text data-k="cs-thv" class="cs-thv cs-halo" x="${TH.x}" y="${TH.top - 20}" text-anchor="middle">25 °C</text></g>`;
const CARDS: Array<[string, string, string, string]> = [
  ['Red-algal RuBisCO', 'higher CO₂/O₂ specificity, slower;', 'made in tobacco, but not assembled', 'Whitney et al. 2001 · Flamholz et al. 2019'],
  ['Cyanobacterial RuBisCO', 'faster; in tobacco, the plants', 'grow only in high CO₂', 'Lin et al. 2014 · Occhialini et al. 2016'],
  ['Directed evolution', 'small improvements so far', '', 'Lin et al. 2022 · McDonald et al. 2026'],
];
const cardsSvg = (): string => CARDS.map(([h, l1, l2, cr], i) => {
  const w = 400, hh = 168, x = 150 + i * 430, y = 150;
  return `<g data-k="cs-card${i}" opacity="0"><g transform="rotate(${i === 1 ? 0.8 : -0.8} ${x + w / 2} ${y + hh / 2})"><path class="cs-paper" d="${cutPath(x, y, w, hh, 41 + i * 9, 3.2)}" filter="url(#cs-sh)"/>
    ${T(x + 24, y + 44, h, 'cs-ctitle')}${T(x + 24, y + 82, l1, 'cs-ct')}${l2 ? T(x + 24, y + 110, l2, 'cs-ct') : ''}${T(x + 24, y + hh - 16, cr, 'cs-ccr')}</g></g>`;
}).join('');

/* ---------------------------------------------------------------- the beats */

/** Playhead target per beat (years ago) and its window in the beat. */
const PH: number[] = [4e9, 3e9, 2.3e9, 3e8, 1e8, 2e4, TODAY - 1750, 0.11, 0.11];
const PH_T: Array<[number, number]> = [[0, 0], [0.4, 2.2], [0.2, 2.2], [0.2, 2.6], [0.2, 2.2], [0.2, 2.6], [0.2, 2.2], [0.2, 3.4], [0, 0]];
const STATUS: string[] = [
  '',
  '≈ 3 billion years ago · CO₂ ≈ 10–2500 × today · O₂ &lt; 10⁻⁶ of today',
  '≈ 2.4–2.2 billion years ago · O₂ up to 0.1 % of today',
  '300 million years ago · CO₂ 409 ppm · O₂ 29.9 %',
  '100 million years ago · CO₂ 862 ppm · O₂ 24.1 %',
  'last glacial maximum, ≈ 20,000 years ago · CO₂ ≈ 190 ppm · O₂ 21 %',
  '1750: CO₂ 278 ppm',
  '2026: 429.6 ppm (Sep, seasonally adjusted)',
  '2026: 429.6 ppm (Sep, seasonally adjusted)',
];
/** Readout per beat (calculated; beats-c2story.ts): oxygenations of RuBP per 100 carboxylations at the beat's time point;
 *  net CO₂ fixed = 100 − ½ × oxygenations. */
const OX: Array<number | null> = [null, 0, 0.5, 64, 24, 96, 66, 43, 70];
/** The scene shown at each beat (index into SCENES); beat 8 switches from industry (6) to today (7). */
const SCENE: number[] = [-1, 0, 1, 2, 3, 4, 5, 6, 7];
/** Bindings at the corner RuBisCO: [time in the beat, 'c' carboxylation of RuBP | 'o' oxygenation of RuBP]. */
const BIND: Array<Array<[number, 'c' | 'o']>> = [
  [[0.5, 'c'], [1.8, 'o']],
  [[2.4, 'c'], [3.1, 'c'], [3.8, 'c']],
  [[2.4, 'c'], [3.1, 'c'], [3.8, 'c']],
  [[2.8, 'c'], [3.5, 'o'], [4.2, 'c'], [4.9, 'o'], [5.6, 'c']],
  [[2.4, 'c'], [3.1, 'c'], [3.8, 'o'], [4.5, 'c'], [5.2, 'c']],
  [[2.8, 'c'], [3.5, 'o'], [4.2, 'c'], [4.9, 'o']],
  [[2.4, 'c'], [3.1, 'o'], [3.8, 'c'], [4.5, 'c'], [5.2, 'o']],
  [[3.8, 'c'], [4.4, 'c'], [5.0, 'o'], [5.6, 'c'], [6.2, 'c'], [6.8, 'o'], [7.4, 'c'], [9.6, 'c'], [10.2, 'o'], [10.8, 'c'], [11.4, 'o'], [12.0, 'c']],
  [],
];
/** Warming in beat 8: the thermometer rises 25 → 35 °C over WARM, the readout 43 → 70. */
const WARM: [number, number] = [8.0, 9.2];
const GLIDE = 0.55;

const fmt = (v: number): string => (v < 1 && v > 0 ? '&lt; 1' : String(Math.round(v)));

export const STAGING: Staging = {
  id: 's',
  name: 's · History chart',
  note: 'RuBisCO through Earth’s history over a real CO₂/O₂ chart (log time, 4 billion years ago → September 2026), era scenes cross-fading behind it, a corner RuBisCO doing carboxylations and oxygenations of RuBP with a calculated readout; warming at the end; 3 cards on engineering RuBisCO',
  beats: C2STORY,
  svg: () => `<defs><filter id="cs-sh" x="-10%" y="-8%" width="120%" height="120%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <g class="c2s">
      <rect class="cs-paperbg" x="0" y="0" width="1600" height="740"/>
      <clipPath id="cs-ground"><rect x="0" y="${GROUND_Y}" width="1600" height="${740 - GROUND_Y}"/></clipPath>
      <g data-k="cs-scenes">${SCENES.map((_, i) => `<g data-k="cs-sc${i}" opacity="0"><g class="cs-sky">${SKY[i]}</g><g class="cs-gr" clip-path="url(#cs-ground)">${GROUND[i]}</g></g>`).join('')}</g>
      <g data-k="cs-chart">${chartSvg()}${insetSvg()}</g>
      ${thermoSvg()}${cornerSvg()}${cardsSvg()}
    </g>`,
  bind(stage) {
    const els = new Map<string, Element>();
    stage.querySelectorAll('[data-k^="cs-"]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
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
    const put = (k: string, at: V, o: number): void => { op(k, o); if (o >= 0.004) set(k, 'transform', `translate(${f(at[0])} ${f(at[1])})`); };
    const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;

    return (beat, t) => {
      /* ---- the playhead: log-time from the previous beat's target to this beat's */
      const [p0, p1] = PH_T[beat], from = PH[Math.max(0, beat - 1)], to = PH[beat];
      const u = p1 > p0 ? ease2(t, p0, p1) : 1;
      // beat 8 runs linearly in calendar years (1750 → September 2026), as its inset shows; the others in log time
      const ya = beat === 7 ? Math.max(0.11, TODAY - lerp(1750, 2026.71, u)) : 10 ** lerp(Math.log10(from), Math.log10(to), u), x = xOf(ya);
      const chartOn = beat === 0 ? 0 : 1;
      const axesOn = beat === 0 ? 0.4 * ease(t, 0, 0.5) : beat === 1 ? 0.4 + 0.6 * ease(t, 0, 0.6) : 1;
      op('cs-axes', axesOn * (beat === 8 ? 1 - 0.6 * ease(t, 0, 0.6) : 1));
      op('cs-curves', chartOn * (beat === 8 ? 1 - 0.55 * ease(t, 0, 0.6) : 1));
      set('cs-clip', 'width', f(Math.max(0, x - X0 + 6)));
      op('cs-ph', beat === 0 ? 0 : beat === 1 ? ease(t, 0, 0.4) : beat === 8 ? 1 - ease(t, 0, 0.6) : 1);
      set('cs-ph', 'transform', `translate(${f(x)} 0)`);
      // the dot sits on the CO₂ curve where it is known, else on the O₂ curve
      const co2At = (y: number): number | null => {
        if (y > 4.2e8) return null;
        let best: V | null = null;
        for (const p of CO2_PTS) if (!best || Math.abs(Math.log10(p[0]) - Math.log10(y)) < Math.abs(Math.log10(best[0]) - Math.log10(y))) best = p;
        return best ? best[1] : null;
      };
      const c = co2At(ya);
      set('cs-phd', 'cy', f(c !== null ? yC(c) : Y0 + 40));
      set('cs-pho', 'cy', f(yO(o2At(ya))));
      // the status line: the beat's time and values, after the playhead arrives
      const stOn = beat === 0 ? 0 : p1 > p0 ? ease(t, p1 - 0.2, p1 + 0.3) : 1;
      set('cs-status', 'text', STATUS[beat] || ' ');
      op('cs-status', stOn * (beat === 8 ? 0.6 : 1));
      op('cs-crd', beat === 0 ? 0 : 1);

      /* ---- scenes: the beat's scene cross-fades in over 0–1.2 s; beat 8 switches to today at 2.4–3.4 s; beat 9 dims */
      const cur = beat === 7 ? (t < 2.4 ? 6 : 7) : SCENE[beat], prev = beat === 7 && t >= 2.4 ? 6 : SCENE[Math.max(0, beat - 1)];
      const fade = beat === 7 && t >= 2.4 ? ease(t, 2.4, 3.4) : beat === 0 ? 0 : ease(t, 0, 1.2);
      for (let i = 0; i < SCENES.length; i++) {
        let v = 0;
        if (i === cur) v = fade;
        if (i === prev && prev !== cur) v = Math.max(v, 1 - fade);
        if (i === prev && prev === cur) v = 1;
        op(`cs-sc${i}`, v * (beat === 8 ? 1 - 0.55 * ease(t, 0, 0.6) : 1));
      }

      /* ---- the inset (beat 8): 1750 → 2026 on a linear axis, drawn with the playhead */
      const inOn = beat === 7 ? ease(t, 0, 0.5) : beat === 8 ? 1 - 0.6 * ease(t, 0, 0.6) : 0;
      op('cs-inset', inOn);
      const yr = beat === 7 ? TODAY - ya : 2026.71;
      set('cs-iclip', 'width', f(Math.max(0, xI(Math.min(yr, 2026.71)) - IX0 + 6)));
      set('cs-idot', 'cx', f(xI(Math.min(yr, 2026.71)))); set('cs-idot', 'cy', f(yI(caAt(yr))));
      op('cs-ilab', beat === 7 ? ease(t, PH_T[7][1] - 0.1, PH_T[7][1] + 0.4) : beat === 8 ? 1 : 0);

      /* ---- the corner RuBisCO and its bindings */
      op('cs-corner', beat === 0 ? ease(t, 0, 0.4) : 1);
      op('cs-lc', beat === 0 ? life(t, 0.5, 0.9, 3.2, 3.8) : 0);
      op('cs-lo', beat === 0 ? life(t, 1.8, 2.2, 3.2, 3.8) : 0);
      const ev = BIND[beat];
      let ic = 0, io = 0, flc = 0, flo = 0;
      for (const [t0, g] of ev) {
        const k = g === 'c' ? `cs-c${ic++}` : `cs-o${io++}`;
        const a = g === 'c' ? CO2_FROM_P : O2_FROM_P, b = g === 'c' ? DOCK_C : DOCK_O;
        const w = ease2(t, t0, t0 + GLIDE), bow = g === 'c' ? -18 : -18;
        const pos: V = [lerp(a[0], b[0], w), lerp(a[1], b[1], w) + bow * Math.sin(Math.PI * w)];
        put(k, pos, t < t0 - 0.05 ? 0 : life(t, t0 - 0.05, t0 + 0.08, t0 + GLIDE + 0.05, t0 + GLIDE + 0.25));
        const fl = life(t, t0 + GLIDE - 0.05, t0 + GLIDE + 0.08, t0 + GLIDE + 0.15, t0 + GLIDE + 0.45);
        if (g === 'c') flc = Math.max(flc, fl); else flo = Math.max(flo, fl);
      }
      for (let i = ic; i < NPOOL; i++) op(`cs-c${i}`, 0);
      for (let i = io; i < NPOOL; i++) op(`cs-o${i}`, 0);
      op('cs-flc', 0.9 * flc); op('cs-flo', 0.9 * flo);

      /* ---- the readout: from the previous beat's value to this beat's while the playhead moves; warming in beat 8 */
      op('cs-ro', beat === 0 ? 0 : beat === 1 ? ease(t, 0.3, 0.8) : 1);
      if (beat >= 1) {
        // beats 2–7: the value of the beat's time point, switched in as the playhead arrives (no invented values in
        // between); beat 8: calculated live from the CO₂ curve at the playhead's year, then from the leaf temperature
        const K = 200 / 427, cc26 = K * 429.6;
        let ox: number, net: number, dip = 1;
        if (beat === 7) {
          const wv = ease(t, WARM[0], WARM[1]), deg = 25 + 10 * wv;
          const yr = Math.min(TODAY - ya, 2026.71);
          const ca = caAt(yr);
          ox = wv > 0 ? oxyPer100(deg, cc26) : oxyPer100(25, K * ca);
        } else if (beat === 8) ox = OX[8] as number;
        else {
          const [, a1] = PH_T[beat], sw = a1 > 0 ? a1 : 0;
          ox = t < sw ? (OX[beat - 1] ?? 0) : (OX[beat] as number);
          dip = beat === 1 ? 1 : 1 - 0.85 * life(t, sw - 0.25, sw - 0.05, sw + 0.05, sw + 0.3);
        }
        net = ox < 1 ? 100 : 100 - ox / 2;
        set('cs-ox', 'text', fmt(ox)); set('cs-net', 'text', String(Math.round(net)));
        op('cs-ox', dip); op('cs-net', dip);
        set('cs-bar', 'width', f((QW * net) / 100));
        const deg = beat === 8 ? 35 : beat === 7 ? 25 + 10 * ease(t, WARM[0], WARM[1]) : 25;
        set('cs-calc', 'text', `calculated · leaf at ${Math.round(deg)} °C`);
      }

      /* ---- the thermometer (beat 8) */
      const thOn = beat === 7 ? ease(t, WARM[0] - 0.6, WARM[0] - 0.1) : beat === 8 ? 1 : 0;
      op('cs-th', thOn);
      const wv = beat === 7 ? ease(t, WARM[0], WARM[1]) : beat === 8 ? 1 : 0, deg = 25 + 10 * wv, h = ((deg - 15) / 25) * (TH.bot - TH.top);
      set('cs-merc', 'y', f(TH.bot - h)); set('cs-merc', 'height', f(h + 20));
      set('cs-thv', 'text', `${Math.round(deg)} °C`);

      /* ---- the cards (beat 9) */
      for (let i = 0; i < CARDS.length; i++) op(`cs-card${i}`, beat === 8 ? ease(t, 0.6 + i * 0.8, 1.1 + i * 0.8) : 0);
    };
  },
};
