// Shared data and drawing helpers of the RuBisCO story (slides C5a–C5c, prefix rb, 28 Oct 2026; draft). Drawing
// primitives come from ./cb-common (the deck's lecture 2 kit, fcb- classes); this file adds the checked numbers and the
// calculations behind them. Facts and read depth: research/redo-2026-10-28/DARK_RUBISCO_EVOLUTION.md and the rb report.
import './rb.css';
import rubiscoPng from '../../assets/rf/rubisco-8ruc.png';
import type { Img } from './cb-common';

export const RUBISCO: Img = { href: rubiscoPng, w: 548, h: 471 };
export const CR_RUBISCO = 'RuBisCO: own render of PDB 8RUC, spinach (Andersson 1996)';

/* ---------- CO₂ through time (ppm) ---------- */

/** Antarctic ice-core CO₂ composite (Bereiter et al. 2015 GRL, doi:10.1002/2014GL061957; NOAA NCEI dataset
 *  doi:10.25921/n8y4-bp27, accessed 28 Oct 2026), linearly interpolated onto an even grid of 6,667 years; ages in years
 *  before 1950. The industrial part (the youngest point) is left out; 1750 and Mauna Loa are drawn separately. */
export const ICE: Array<[number, number]> = ([
  [6667, 259.6], [13333, 237.1], [20000, 194.0], [26667, 185.5], [33333, 197.1], [40000, 194.1], [46667, 215.8], [53333, 223.4],
  [60000, 218.6], [66667, 205.6], [73333, 231.3], [80000, 233.6], [86667, 222.6], [93333, 234.8], [100000, 245.3], [106667, 242.6],
  [113333, 263.2], [120000, 270.7], [126667, 273.1], [133333, 223.7], [140000, 192.8], [146667, 194.2], [153333, 199.5], [160000, 186.8],
  [166667, 190.4], [173333, 197.7], [180000, 208.2], [186667, 204.3], [193333, 219.1], [200000, 245.7], [206667, 227.3], [213333, 243.4],
  [220000, 227.3], [226667, 211.9], [233333, 242.1], [240000, 250.5], [246667, 222.7], [253333, 196.0], [260000, 206.2], [266667, 207.1],
  [273333, 191.0], [280000, 207.1], [286667, 226.7], [293333, 206.6], [300000, 230.0], [306667, 248.2], [313333, 241.9], [320000, 236.9],
  [326667, 266.0], [333333, 273.0], [340000, 239.5], [346667, 206.8], [353333, 215.3], [360000, 188.9], [366667, 203.8], [373333, 200.0],
  [380000, 228.8], [386667, 241.0], [393333, 264.4], [400000, 277.7], [406667, 280.6], [413333, 274.1], [420000, 271.8], [426667, 264.5],
  [433333, 216.4], [440000, 201.1], [446667, 200.5], [453333, 203.2], [460000, 203.8], [466667, 208.0], [473333, 243.7], [480000, 227.0],
  [486667, 233.0], [493333, 241.1], [500000, 230.7], [506667, 235.6], [513333, 241.4], [520000, 247.5], [526667, 231.3], [533333, 207.1],
  [540000, 209.4], [546667, 209.7], [553333, 225.3], [560000, 230.2], [566667, 253.8], [573333, 248.7], [580000, 248.2], [586667, 223.7],
  [593333, 232.1], [600000, 229.8], [606667, 248.7], [613333, 257.2], [620000, 246.4], [626667, 219.9], [633333, 194.6], [640000, 189.7],
  [646667, 190.5], [653333, 190.5], [660000, 187.2], [666667, 175.3], [673333, 199.6], [680000, 233.1], [686667, 222.6], [693333, 241.2],
  [700000, 238.3], [706667, 236.1], [713333, 224.0], [720000, 210.8], [726667, 211.3], [733333, 207.7], [740000, 185.4], [746667, 190.0],
  [753333, 195.8], [760000, 224.3], [766667, 231.0], [773333, 244.4], [780000, 254.5], [786667, 265.0], [793333, 213.6], [800000, 199.6],
] as Array<[number, number]>);
/** The checked anchors: the ice-core range (Bereiter 2015 composite: 173.7 at 667,410 and 298.6 at 335,102 years before
 *  1950), the last glacial maximum (IPCC AR6 WG1 Table 2.1: 188–194), 1750 (AR6: 278.3 ± 2.9), 2025 (NOAA Mauna Loa
 *  annual mean 427.35 ± 0.12), and the CO₂ at which crop RuBisCO's specificity is optimal (Zhu, Portis & Long 2004,
 *  abstract: 210 µmol mol⁻¹, "close to the average of the last 400,000 y"). */
// y2026: NOAA Mauna Loa, September 2026, seasonally adjusted (downloaded 28 Oct 2026)
export const PPM = { iceMin: 174, iceMax: 299, lgm: 190, y1750: 278, y2025: 427, y2026: 429.6, optimum: 210 };

/* ---------- temperature: solubility, Γ*, specificity ---------- */

/** Henry's-law solubility (mol m⁻³ Pa⁻¹) of CO₂ (Morrison & Billett 1952) and O₂ (Rettich et al. 2000), the
 *  3-parameter fits in Sander 2023, Atmos Chem Phys 23:10901 (notes 384 and 8). T in °C. */
export const solCO2 = (t: number): number => { const T = t + 273.15; return Math.exp(-126.83006 + 7302.88057 / T + 16.55553 * Math.log(T)); };
export const solO2 = (t: number): number => { const T = t + 273.15; return Math.exp(-179.13838 + 8707.18054 / T + 24.33474 * Math.log(T)); };
/** Γ*, the CO₂ compensation point without day respiration (ppm), Bernacchi et al. 2001: exp(19.02 − 37.83/(R·T)). */
export const gammaStar = (t: number): number => Math.exp(19.02 - 37.83 / (0.008314 * (t + 273.15)));
/** Oxygenations per 100 carboxylations at chloroplast CO₂ cc (ppm): 100 · vₒ/v꜀ = 100 · 2 Γ* ÷ C꜀ (FvCB). */
export const oxyPer100 = (t: number, cc: number): number => (100 * 2 * gammaStar(t)) / cc;
/** Spinach RuBisCO CO₂/O₂ specificity: ≈ 160 at 5 °C and ≈ 50 at 40 °C (Jordan & Ogren 1984, abstract), 82 at 25 °C
 *  (Tcherkez et al. 2006, Table 1). The three values lie on one exponential, 82 · e^(−0.0333 (t − 25)). */
export const SCO = { pts: [[5, 160], [25, 82], [40, 50]] as Array<[number, number]>, fit: (t: number): number => 82 * Math.exp(-0.0333 * (t - 25)) };

/* ---------- drawing ---------- */

const f = (v: number): string => v.toFixed(1);
/** A subscript inside SVG text (e.g. S + sub('c/o'), k + sub('cat')); the next run returns to the baseline. */
export const sub = (s: string): string => `<tspan class="fcb-sub" dy="5">${s}</tspan><tspan dy="-5">&#8203;</tspan>`;
/** Italic symbol with a subscript: S_c/o, k_cat, C_c. */
export const sym = (b: string, s: string): string => `<tspan class="fcb-it">${b}</tspan>${sub(s)}`;
/** The RuBisCO render, w wide, centred at (cx, cy). */
export function rubisco(cx: number, cy: number, w: number, cls = ''): string {
  const h = (w * RUBISCO.h) / RUBISCO.w;
  return `<image${cls ? ` class="${cls}"` : ''} href="${RUBISCO.href}" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}"/>`;
}
/** A soft rounded panel. */
export const panel = (x: number, y: number, w: number, h: number, cls = 'frb-panel'): string =>
  `<rect class="${cls}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="16"/>`;
/** A plain path. */
export const path = (d: string, cls: string): string => `<path class="${cls}" d="${d}"/>`;
