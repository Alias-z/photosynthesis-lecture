// 'c2story', staging v6 · "Molecules at the active site" (lecturer, 29 Oct 2026; brief
// research/redo-2026-10-29/C2STORY_V3_BRIEF.md, row v6; the same evening: "Too many numbers; only the key information":
// the tally line, the era card's CO₂ and temperature, nothing else numeric). Plays C2STORY3. One fixed framing.
// - The scene: a close-up of the chloroplast stroma in the strip style (stroma tint, a thylakoid bilayer along the bottom,
//   protein renders): 3 RuBisCO renders (our 8RUC render), RuBP below each in carbon form, a grey gas arrow into each
//   one's left face (carboxylation, CO₂) and right face (oxygenation, O₂), as on slide C2 (mr3). Only the middle one is named.
// - The molecules: CO₂ and O₂ as atom balls drift on smooth paths (slow shared currents and a small wobble of their own,
//   sums of sines, no noise); each leaves the slice after 14–26 s (fades out) and another comes in elsewhere. Their numbers are
//   proportional to their dissolved concentrations: CO₂ at C꜀ (= C꜀/Cₐ × Cₐ), O₂ at the era's O₂, both at the leaf
//   temperature, by Henry's law (Sander 2023 compilation: CO₂ 0.034 M atm⁻¹, 2400 K; O₂ 0.0013 M atm⁻¹, 1700 K); 210 O₂
//   stand for today's air at 25 °C. A molecule fades in or out as the count passes its index, so counts follow the state
//   continuously.
// - Captures: carboxylations run at a fixed visual tempo (slower only while no CO₂ is free); each adds (oxygenations
//   per 100 carboxylations)/100 of the frame's state to a running sum, and an oxygenation fires whenever the sum passes a
//   whole number, so the captures shown always match the model to within one. The nearest free molecule of the right gas
//   glides to its face (from the far side, under the RuBisCO row); drifting molecules fade where they pass behind a protein,
//   RuBP, an arrow or a name, so only captured ones touch RuBisCO.
// - The tally (top centre): "per 100 carboxylations: … oxygenations", from the frame's state (c2story-model.ts through
//   c2story-enzyme.ts oxPer100S). Era card (top left): the time under the marker, CO₂ in the air, the leaf temperature and a
//   CO₂ sparkline (log time) with the marker. RuBisCO card (top right): whose RuBisCO, and in beats 3–4 bars for its CO₂
//   preference (S) and its speed (kcat), no numbers.
// - One state per frame: inside a beat the state either travels along the records (beat 5: 360 → 300 million years ago;
//   beat 7: 20,000 years ago → 1750 → 2026) or cuts between two moments (the readouts dip together and come back together,
//   with no values in between); counts, bars and the capture tempo ease across a cut.
// Ambient motion (drift, captures) runs on the wall clock, so molecules keep moving while a beat holds; with ?t= (frozen
// screenshots) everything is simulated from the beat's start on t, so every frame is reproducible.
import './c2story-v6.css';
import { C2STORY3 } from './beats-c2story';
import { CO2_B, CO2_C, CO2_D, FOSTER, O2_GCS, T_A, T_B, T_C, T_D } from './c2story-data';
import { CC_CA, leafT, O2_TODAY } from './c2story-model';
import { enzyme, oxPer100S, S_PLANT } from './c2story-enzyme';
import { arrow, bilayer } from '../figs/cell-schema';
import { row } from '../figs/carbon-form';
import { curve, type Path } from './dk2-common';
import { cutPath } from './antenna-common';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import type { Staging } from './types';

type V = [number, number];
const f = (v: number): string => (Math.round(v * 100) / 100).toString();
const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const sm = (u: number): number => { const c = clamp(u); return c * c * (3 - 2 * c); };
const ease = (t: number, t0: number, t1: number): number => sm((t - t0) / (t1 - t0));
const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
/** Constant speed between t0 and t1 with smooth starts and stops (ramps of 15 % of the move). */
function cruise(t: number, t0: number, t1: number): number {
  const u = clamp((t - t0) / (t1 - t0)), r = 0.15, v = 1 / (1 - r);
  if (u < r) return (v * u * u) / (2 * r);
  if (u > 1 - r) return 1 - (v * (1 - u) * (1 - u)) / (2 * r);
  return v * (u - r / 2);
}
const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text${k ? ` data-k="${k}"` : ''} class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const halton = (i: number, b: number): number => { let r = 0, fr = 1 / b; for (let n = i; n > 0; n = Math.floor(n / b), fr /= b) r += fr * (n % b); return r; };

/* ---------------------------------------------------------------- the records, merged: [years ago, value], oldest first */

/** "Years ago" = years before 28 Oct 2026 (as c2story-data.ts). */
const NOW = 2026.8;
const YA_TODAY = NOW - 2026.71, YA_1750 = NOW - 1750;
function merge(...parts: V[][]): V[] {
  const out: V[] = [];
  for (const p of parts) for (const q of p) if (!out.length || q[0] < out[out.length - 1][0] - 1e-9) out.push(q);
  return out;
}
/** CO₂ (ppm): Foster 2017 (≥ 1 million years ago), Bereiter 2015 (B, C), Law Dome and NOAA (D); linear between points,
 *  and across the 1 million → 800,000-year gap between the first two. */
const CO2R = merge(FOSTER.slice().reverse().map(([ma, v]): V => [ma * 1e6, v]), CO2_B, CO2_C, CO2_D.map(([y, v]): V => [NOW - y, v]));
/** Change in global mean temperature from 1850–1900 (°C): PhanDA, Snyder 2016, LGMR, HadCRUT5. */
const TR = merge(T_A.map(([ma, v]): V => [ma * 1e6, v]), T_B, T_C, T_D.map(([y, v]): V => [NOW - y, v]));
/** O₂ (% of air): GEOCARBSULF to 10 million years ago, then linear to today's 20.95 %. */
const O2R = merge(O2_GCS.map(([ma, v]): V => [ma * 1e6, v]), [[0, O2_TODAY]]);
function at(p: V[], ya: number): number {
  if (ya >= p[0][0]) return p[0][1];
  if (ya <= p[p.length - 1][0]) return p[p.length - 1][1];
  let lo = 0, hi = p.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (p[m][0] >= ya) lo = m; else hi = m; }
  const [a0, v0] = p[lo], [a1, v1] = p[hi];
  return v0 + ((v1 - v0) * (a0 - ya)) / (a0 - a1);
}

/* ---------------------------------------------------------------- dissolved gases → how many molecules are drawn */

/** Henry's-law solubility (M atm⁻¹) at t °C: Sander 2023 (Atmos. Chem. Phys. 23:10901), van 't Hoff form. */
const KC = (t: number): number => 0.034 * Math.exp(2400 * (1 / (t + 273.15) - 1 / 298.15));
const KO = (t: number): number => 0.0013 * Math.exp(1700 * (1 / (t + 273.15) - 1 / 298.15));
/** Molecules drawn per µM dissolved: 210 O₂ for air-saturated water at 25 °C and 20.95 % O₂ (272 µM). */
const RHO = 210 / (KO(25) * O2_TODAY * 1e4);
const nCO2 = (ppm: number, t: number): number => RHO * KC(t) * ppm;
const nO2 = (pct: number, t: number): number => RHO * KO(t) * pct * 1e4;

/* ---------------------------------------------------------------- the state */

type Zone = 'stroma' | 'early' | 'cyano';
interface St {
  /** Time under the marker (years ago). */
  ya: number;
  /** CO₂ in the air (ppm), O₂ (% of air), leaf (or cell) temperature (°C). */
  ca: number; o2: number; tl: number;
  /** C꜀/Cₐ of the stroma (or cytoplasm), and at RuBisCO (higher than k only inside the carboxysome). */
  k: number; kIn: number;
  /** RuBisCO: specificity S, kcat (bars only), whose (name), bars shown (0–1). */
  s: number; kcat: number; name: string; bars: number;
  zone: Zone; shell: number;
  /** Temperature row: a leaf's, a cell's, or none (no record). */
  tRow: 'leaf' | 'cell' | '';
  /** Fixed texts for moments without a record. */
  era?: string; co2?: string;
  /** The hot, dry day (0–1): names the moment on the era card. */
  hot?: number; dry?: number;
}
const PLANT = enzyme('plant'), CYANO = enzyme('cyano');
const BASE = { k: CC_CA, kIn: CC_CA, s: S_PLANT, kcat: PLANT.kcat, name: 'RuBisCO of land plants', bars: 0, zone: 'stroma' as Zone, shell: 0, tRow: 'leaf' as const };
/** The state read from the records at ya, with the land-plant enzyme in a leaf. */
const rec = (ya: number, x: Partial<St> = {}): St => ({ ...BASE, ya, ca: at(CO2R, ya), o2: at(O2R, ya), tl: leafT(at(TR, ya)), ...x });
const ox = (s: St): number => oxPer100S(s.s, s.tl, s.ca, s.o2, s.kIn);

/** Today's air at 25 °C (beats 1, 3, 4: RuBisCOs compared at the temperature their S is measured at). */
const TODAY25 = rec(YA_TODAY, { tl: 25, era: 'today’s air' });
/** ≈ 3 billion years ago: O₂ < 10⁻⁶ of today (here 10⁻⁷); CO₂ ≈ 10–2500 × today (Catling & Zahnle 2020), drawn at the
 *  lower bound, 10 × 278 ppm, in water at equilibrium with the air (k = 1); no temperature record (the readout does not
 *  depend on it: Γ* ≈ 0), the molecules are counted at 25 °C. */
const ARCH: St = { ...BASE, ya: 3e9, ca: 10 * 278.3, o2: O2_TODAY * 1e-7, tl: 25, k: 1, kIn: 1, name: 'early RuBisCO', zone: 'early', tRow: '', era: '≈ 3 billion years ago', co2: '≈ 10–2500 × today' };
/** ≈ 2.4 billion years ago, the Great Oxidation Event: O₂ above 10⁻⁵ of today, here at its upper bound 10⁻³ (0.1 %,
 *  as version 2) → under 1 per 100. */
const GOE: St = { ...ARCH, ya: 2.4e9, o2: O2_TODAY * 1e-3, era: '≈ 2.4 billion years ago', co2: 'much more than today' };
const M360 = rec(360e6), M300 = rec(300e6), M100 = rec(1e8), M20K = rec(2e4);
const TODAY = rec(YA_TODAY);
/** Beat 3's swap (u 0 → 1: land plants → cyanobacteria, today's air at 25 °C); S and kcat from c2story-enzyme.ts. */
const swap = (u: number): St => ({ ...TODAY25, s: lerp(PLANT.s, CYANO.s, u), kcat: lerp(PLANT.kcat, CYANO.kcat, u), name: u < 0.5 ? 'RuBisCO of land plants' : 'RuBisCO of cyanobacteria', bars: 1 });
/** Beat 4: the cyanobacterium; its carboxysome raises CO₂ at RuBisCO to 10 × C꜀ (illustrative, unlabelled). */
const cyanoCell = (shell: number, crowd: number): St => ({ ...swap(1), zone: 'cyano', tRow: 'cell', shell, kIn: CC_CA * lerp(1, 10, crowd) });
const CYANO_END = cyanoCell(1, 1);

/** One frame: the moment a, the moment b and the cut between them (u: 0 = a, 1 = b). */
interface Fr { a: St; b: St; u: number }
const one = (s: St): Fr => ({ a: s, b: s, u: 0 });
const cutFr = (a: St, b: St, u: number): Fr => ({ a, b, u });
const L30 = (ya: number): number => Math.log10(ya + 30);

/** The 8 beats (C2STORY3). Holds: beat 2 after 3 billion years ago, beat 3 before the swap, beat 6 at the dinosaurs,
 *  beat 7 at 2026 (before the hot, dry day). */
const HOLDS: number[][] = [[], [1.2], [1.2], [], [], [1.2], [5.0], []];
function frameAt(beat: number, t: number): Fr {
  switch (beat) {
    case 0: return one(TODAY25);
    case 1: return t < 1.3 ? cutFr(TODAY25, ARCH, ease(t, 0, 0.9)) : cutFr(ARCH, GOE, ease(t, 1.3, 2.2));
    case 2: return t < 1.3 ? cutFr(GOE, swap(0), ease(t, 0, 0.9)) : one(swap(ease(t, 1.3, 2.6)));
    case 3: return cutFr(swap(1), cyanoCell(ease(t, 0.3, 1.3), ease(t, 1.1, 3.5)), ease(t, 0, 0.8));
    case 4: return t < 1.1 ? cutFr(CYANO_END, M360, ease(t, 0, 0.9)) : one(rec(lerp(360e6, 300e6, cruise(t, 1.1, 4.1))));
    case 5: return t < 1.3 ? cutFr(M300, M100, ease(t, 0, 0.9)) : cutFr(M100, M20K, ease(t, 1.3, 2.2));
    case 6: {
      if (t < 1.7) return one(rec(10 ** lerp(L30(2e4), L30(YA_1750), cruise(t, 0.2, 1.6)) - 30));
      if (t < 5.1) return one(rec(NOW - lerp(1750, 2026.71, cruise(t, 1.8, 4.8))));
      const k = lerp(CC_CA, 0.35, ease(t, 6.8, 8.0));
      return one({ ...TODAY, tl: lerp(TODAY.tl, 35, ease(t, 5.2, 6.4)), k, kIn: k, hot: ease(t, 5.2, 5.6), dry: ease(t, 6.7, 7.1) });
    }
    default: return frameAt(6, 99);
  }
}

/* ---------------------------------------------------------------- texts of a moment */

const NB = ' ';
function eraOf(s: St): string {
  if (s.era) return s.era;
  const ya = s.ya;
  if (ya <= YA_1750 + 0.01) return String(Math.min(2026, Math.floor(NOW - ya + 1e-6)));
  if (ya >= 1e6) return `${Math.round(ya / 1e6)} million years ago`;
  const r = ya >= 1e4 ? Math.round(ya / 1000) * 1000 : Math.round(ya / 100) * 100;
  return `${r.toLocaleString('en-US')} years ago`;
}
const co2Of = (s: St): string => s.co2 ?? `${Math.round(s.ca)} ppm`;
/** Above 40 °C the Γ* fit (Bernacchi 2001, to ≈ 40 °C) is extrapolated: "≈" and no decimals. */
const HOT_FIT = 40;
const tempOf = (s: St): string => (s.tRow ? (s.tl > HOT_FIT ? `≈ ${Math.round(s.tl)} °C` : `${s.tl.toFixed(1)} °C`) : '');
const tLabelOf = (s: St): string => (s.tRow === 'leaf' ? 'leaf temperature' : s.tRow === 'cell' ? 'temperature' : '');
function tallyOf(s: St): string {
  const v = ox(s);
  if (s.o2 < 1e-4) return '0';
  if (v < 1) return '&lt; 1';
  if (s.tl > HOT_FIT) return `≈ ${Math.round(v / 10) * 10}`;
  return String(Math.round(v));
}
const ZONE: Record<Zone, string> = { stroma: 'chloroplast stroma', early: 'inside an early cell', cyano: 'inside a cyanobacterium' };

/* ---------------------------------------------------------------- layout */

const UX = [400, 800, 1200], UY = 440, RW = 150, RH = (RW * 471) / 548, RUBP_Y = 552;
const DOCK = { c: -60, o: 58 }, APP = 152;
/** The swarm's region (molecule centres before drift), and the carboxysome's outline (beat 4). */
const REG = { x0: -20, x1: 1620, y0: -10, y1: 615 };
const SHELL: V[] = [[150, 445], [330, 252], [1270, 252], [1450, 445], [1270, 640], [330, 640]];
function inPoly(p: V, q: V[]): boolean {
  let c = false;
  for (let i = 0, j = q.length - 1; i < q.length; j = i++) {
    const [xi, yi] = q[i], [xj, yj] = q[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
const polyArea = (q: V[]): number => Math.abs(q.reduce((s, [x, y], i) => { const [x2, y2] = q[(i + 1) % q.length]; return s + x * y2 - x2 * y; }, 0)) / 2;
const SHELL_IN: V[] = SHELL.map(([x, y]): V => [800 + (x - 800) * 0.9, 446 + (y - 446) * 0.8]);
const SHELL_FRAC = polyArea(SHELL) / ((REG.x1 - REG.x0) * (REG.y1 - REG.y0));
/** The cards: era (left), tally (centre), RuBisCO (right); captures prefer molecules not hidden behind them. */
const CARD = { era: [24, 20, 420, 198] as const, tally: [470, 20, 660, 72] as const, enz: [1156, 20, 420, 0] as const };
const ENZ_H0 = 52, ENZ_H1 = 128;
const behindCard = ([x, y]: V): boolean => (y < 226 && (x < 452 || x > 1148)) || (y < 100 && x > 462 && x < 1138);

/* sparkline: CO₂ (log) on a log time axis, years ago + 30 (so that 2026 has a place) */
const SP = { x0: 46, x1: 422, y0: 134, y1: 176 };
const U0 = L30(3.5e9), U1 = L30(YA_TODAY);
const spX = (ya: number): number => SP.x0 + ((U0 - L30(ya)) / (U0 - U1)) * (SP.x1 - SP.x0);
const spY = (ppm: number): number => { const lo = Math.log10(150), hi = Math.log10(4000), v = Math.min(hi, Math.max(lo, Math.log10(ppm))); return SP.y1 - ((v - lo) / (hi - lo)) * (SP.y1 - SP.y0); };
const CO2_FIRST = 419.5e6;

/* ---------------------------------------------------------------- molecules */

const R_ATOM = 8.5;
const glyph = (id: string, el: string): string => {
  const sty: Record<string, [string, string, string]> = { O: ['#f4cc4f', '#b8902a', '#5a4a1a'], C: ['#d9633a', '#9b3e1e', '#ffffff'] };
  return `<g id="${id}">${[...el].map((a, i) => {
    const cx = (i - (el.length - 1) / 2) * R_ATOM * 1.7, [fi, st, ink] = sty[a];
    return `<circle cx="${f(cx)}" cy="0" r="${R_ATOM}" style="fill:${fi};stroke:${st};stroke-width:1.3"/><text x="${f(cx)}" y="${f(R_ATOM * 0.5)}" text-anchor="middle" style="font-family:Inter,&quot;Helvetica Neue&quot;,Arial,sans-serif;font-size:13px;font-weight:700;fill:${ink}">${a}</text>`;
  }).join('')}</g>`;
};
type Pool = 'o' | 'c' | 'x';
const NMAX: Record<Pool, number> = { o: 330, c: 90, x: 40 };
const POOLS: Pool[] = ['o', 'c', 'x'];
const FLIGHTS = 16;
/** Carboxylations per second (all 3 RuBisCOs), the visual tempo. */
const RC = 1.3;
/** A molecule's time in view (s) before it diffuses out of the slice shown, and its fade in or out (s). */
const LIFE: [number, number] = [14, 26], FADE = 0.7;

interface Slot { bx: number; by: number; wa: number[]; ww: number[]; wp: number[]; gen: number; freeAt: number; dieAt: number; busy: boolean }
/** Places where no molecule's centre starts: each RuBisCO with its gas arrows and RuBP, the middle one's names, the zone
 *  name (molecules drift a little into them; the scene draws them on top). */
const KEEP: Array<[number, number, number, number]> = [
  ...UX.map((x): [number, number, number, number] => [x - 100, UY - 92, 200, RUBP_Y + 40 - (UY - 92)]),
  ...UX.map((x): [number, number, number, number] => [x - 165, UY - 12, 330, 36]),
  [570, 398, 145, 42], [885, 398, 130, 42], [16, 636, 220, 44],
];
const kept = (x: number, y: number): boolean => KEEP.some(([kx, ky, kw, kh]) => x > kx && x < kx + kw && y > ky && y < ky + kh);
/** Where a drifting molecule passes behind the scene's drawing (proteins, RuBP, gas arrows, names): it fades out there
 *  (over 14 units), so that only captured molecules touch RuBisCO and no name is crossed. [x, y, w, h, 1 = carboxysome] */
const VEIL: Array<[number, number, number, number, number]> = [
  ...UX.flatMap((x): Array<[number, number, number, number, number]> => [[x - 75, UY - RH / 2, 150, RH, 0], [x - 76, RUBP_Y - 11, 152, 22, 0], [x - 5, UY + RH / 2, 10, RUBP_Y - 11 - UY - RH / 2, 0], [x - APP, UY, APP - 78, 12, 0], [x + 78, UY, APP - 78, 12, 0]]),
  [758, 346, 84, 22, 0], [774, 568, 52, 22, 0], [584, 409, 124, 22, 0], [892, 409, 112, 22, 0], [30, 646, 200, 24, 0], [745, 210, 110, 22, 1],
];
function veil(q: V, shellOn: number): number {
  let m = 1;
  for (const [x, y, w, h, sh] of VEIL) {
    const dx = Math.max(x - 26 - q[0], 0, q[0] - (x + w + 26)), dy = Math.max(y - 11 - q[1], 0, q[1] - (y + h + 11));
    if (dx > 14 || dy > 14) continue;
    const v = sm(Math.hypot(dx, dy) / 14);
    m = Math.min(m, sh ? 1 - shellOn * (1 - v) : v);
  }
  return m;
}
/** Slow currents shared by all molecules (wavelengths 600–1500 units), so neighbours drift together and keep apart. */
const MODES: Array<[number, number, number, number, number]> = [
  // [wavelength, direction (deg), angular frequency (rad s⁻¹), amplitude x, amplitude y]
  [900, 20, 0.13, 26, 0], [1300, 110, 0.09, 22, 0], [600, 250, 0.21, 12, 0],
  [1000, 70, 0.11, 0, 20], [700, 160, 0.17, 0, 14], [1500, 300, 0.07, 0, 16],
].map(([l, d, w, ax, ay]): [number, number, number, number, number] => [l, (d * Math.PI) / 180, w, ax, ay]);
function current(x: number, y: number, tau: number, k: number): V {
  let dx = 0, dy = 0;
  MODES.forEach(([l, d, w, ax, ay], m) => {
    const ph = ((2 * Math.PI) / l) * (Math.cos(d) * x + Math.sin(d) * y) + w * tau + m * 1.7;
    dx += ax * Math.sin(ph); dy += ay * Math.sin(ph);
  });
  return [dx * k, dy * k];
}
const drift = (s: Slot, tau: number, pool: Pool): V => {
  const [cx, cy] = current(s.bx, s.by, tau, pool === 'x' ? 0.55 : 1);
  return [s.bx + cx + s.wa[0] * Math.sin(s.ww[0] * tau + s.wp[0]), s.by + cy + s.wa[1] * Math.sin(s.ww[1] * tau + s.wp[1])];
};
/** Typical visible slots, against which a new molecule keeps its distance. */
const NEAR: Record<Pool, number> = { o: 330, c: 90, x: 40 };
/** A slot's start (base) and its own small wobble, for generation `gen`: the first of 24 low-discrepancy candidates
 *  ≥ 44 units from every other molecule's base (else the farthest), outside the kept places. */
function placeSlot(pool: Pool, j: number, gen: number, sl: Slot, all: Record<Pool, Slot[]>): void {
  const r = rng(((pool === 'o' ? 1 : pool === 'c' ? 2 : 3) * 1000003 + j * 7919 + gen * 104729) >>> 0);
  let idx = 1 + j + gen * NMAX[pool] + (pool === 'o' ? 0 : pool === 'c' ? 50000 : 90000), best: V = [0, 0], bd = -1;
  for (let n = 0, tries = 0; n < 24 && tries < 600; tries++, idx += NMAX[pool] * 13 + 7) {
    // the first generation on a low-discrepancy (Halton) grid; later ones at random, so that they do not cluster
    const hx = gen === 0 ? halton(idx, 2) : r(), hy = gen === 0 ? halton(idx, 3) : r();
    const x = REG.x0 + hx * (REG.x1 - REG.x0), y = REG.y0 + hy * (REG.y1 - REG.y0);
    if (kept(x, y) || (pool === 'x' && !inPoly([x, y], SHELL_IN))) continue;
    n++;
    let md = Infinity;
    for (const p of POOLS) {
      const ss = all[p];
      for (let i = 0; i < Math.min(ss.length, NEAR[p]); i++) if (ss[i] !== sl) md = Math.min(md, Math.hypot(ss[i].bx - x, ss[i].by - y));
    }
    if (md > bd) { bd = md; best = [x, y]; }
    if (md >= 44) break;
  }
  [sl.bx, sl.by] = best;
  sl.wa = [6 + 5 * r(), 5 + 4 * r()];
  sl.ww = [0.45 + 0.45 * r(), 0.45 + 0.45 * r()];
  sl.wp = [r() * Math.PI * 2, r() * Math.PI * 2];
  sl.gen = gen;
  // each molecule leaves the thin slice of stroma shown after a while (fades out) and another comes in elsewhere, as in
  // diffusion; the first generation starts at random ages
  sl.dieAt = (gen === 0 ? -r() * LIFE[1] : sl.freeAt) + LIFE[0] + r() * (LIFE[1] - LIFE[0]);
}
/** The first generation, placed once. */
let FIRST: Record<Pool, Slot[]> | null = null;
function firstSlots(): Record<Pool, Slot[]> {
  if (!FIRST) {
    const all: Record<Pool, Slot[]> = { o: [], c: [], x: [] };
    for (const p of POOLS) for (let j = 0; j < NMAX[p]; j++) { const s: Slot = { bx: 0, by: 0, wa: [], ww: [], wp: [], gen: 0, freeAt: -9, dieAt: 0, busy: false }; placeSlot(p, j, 0, s, all); all[p].push(s); }
    FIRST = all;
  }
  const out = {} as Record<Pool, Slot[]>;
  for (const p of POOLS) out[p] = FIRST[p].map(s => ({ ...s, wa: [...s.wa], ww: [...s.ww], wp: [...s.wp] }));
  return out;
}
/** Does the segment a → b pass through RuBisCO u's box? */
function crosses(a: V, b: V, u: number): boolean {
  const [x0, y0, x1, y1] = [UX[u] - 85, UY - 75, UX[u] + 85, RUBP_Y + 16];
  for (let i = 0; i <= 20; i++) { const x = lerp(a[0], b[0], i / 20), y = lerp(a[1], b[1], i / 20); if (x > x0 && x < x1 && y > y0 && y < y1) return true; }
  return false;
}

interface Flight { pool: Pool; j: number; unit: number; t0: number; dur: number; path: Path; w0: number }
/** The height (y) of the way under the RuBisCO row, below RuBP and its name. */
const UNDER = 618;
interface Counts { o: number; c: number; x: number; ox: number; rate: number }
/** The capture simulation: slots of each gas, flights to RuBisCO, landings (for the glow). */
class Sim {
  tau = 0; accC = 0.4; accO = 0.5; nC = 0; nO = 0;
  dueO: number[] = [];
  slots: Record<Pool, Slot[]> = firstSlots();
  flights: Flight[] = [];
  land: number[][] = UX.map(() => [-9, -9]);
  /** Visible weight of slot j of pool p (count and fade-in), 0 while in flight. */
  weight(p: Pool, j: number, n: Counts): number {
    const s = this.slots[p][j];
    if (s.busy) return 0;
    return clamp(n[p] - j) * sm((this.tau - s.freeAt) / FADE) * (1 - sm((this.tau - s.dieAt) / FADE));
  }
  /** A capture: the RuBisCO next in turn (or another, if a molecule is much nearer to it) takes the nearest free molecule
   *  of the gas. A molecule on the gas's side glides in along the gas arrow; one on the far side first passes under the
   *  RuBisCO row (never across a protein). */
  launch(gas: 'c' | 'o', n: Counts): boolean {
    const rr = gas === 'c' ? [1, 0, 2][this.nC % 3] : [2, 1, 0][this.nO % 3], side = gas === 'c' ? -1 : 1;
    let best: { p: Pool; j: number; u: number; pts: V[]; L: number; w: number } | null = null, bd = Infinity;
    for (const p of (gas === 'c' ? ['c', 'x'] : ['o']) as Pool[]) {
      for (let j = 0; j < Math.min(NMAX[p], Math.ceil(n[p])); j++) {
        const w = this.weight(p, j, n);
        if (w < 0.5 || this.slots[p][j].dieAt - this.tau < 2.5) continue;
        const q = drift(this.slots[p][j], this.tau, p);
        if (veil(q, 1) < 0.9) continue;
        for (let u = 0; u < UX.length; u++) {
          const app: V = [UX[u] + side * APP, UY + 6], near = (q[0] - UX[u]) * side >= 80;
          if (!near && Math.abs(q[0] - UX[u]) < 105) continue;
          const pts: V[] = near ? [q, app] : [q, ...(q[1] < UNDER ? [[q[0], UNDER] as V] : []), [UX[u] + side * 150, Math.max(UNDER, q[1])], app];
          let L = 0, cross = false;
          for (let i = 1; i < pts.length; i++) {
            L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
            if (UX.some((_, v) => (near ? v !== u : true) && crosses(pts[i - 1], pts[i], v))) cross = true;
          }
          if (cross) continue;
          const d = L + (u === rr ? 0 : 90) + (near ? 0 : 150) + (behindCard(q) ? 250 : 0) + (1 - w) * 200;
          if (d < bd) { bd = d; best = { p, j, u, pts, L, w }; }
        }
      }
    }
    if (!best) return false;
    if (gas === 'c') this.nC++; else this.nO++;
    const { p, j, u, pts, L, w } = best, s = this.slots[p][j], dock: V = [UX[u] + DOCK[gas], UY + 6];
    let way: V[];
    if (pts.length === 2) {
      // a gentle bow on the way to the arrow
      const [q0, app] = pts, dx = app[0] - q0[0], dy = app[1] - q0[1], l = Math.hypot(dx, dy) || 1, bend = (j % 2 ? 1 : -1) * 0.1 * l;
      way = [q0, [(q0[0] + app[0]) / 2 - (dy / l) * bend, (q0[1] + app[1]) / 2 + (dx / l) * bend], app, dock];
    } else way = [...pts, dock];
    s.busy = true;
    this.flights.push({ pool: p, j, unit: u, t0: this.tau, dur: Math.min(2.8, Math.max(1.1, 0.8 + L / 600)), path: curve(way), w0: w });
    return true;
  }
  step(dt: number, n: Counts): void {
    this.tau += dt;
    // carboxylations at the tempo (a launch waits while no CO₂ is free); each one adds (oxygenations per 100)/100 of this
    // frame's state to the oxygenation sum, and an oxygenation is due whenever the sum passes a whole number, 0.3–0.8 s
    // later (so the two do not start in step); a due oxygenation waits while no O₂ is free
    this.accC = Math.min(2, this.accC + RC * n.rate * dt);
    while (this.accC >= 1 && this.launch('c', n)) {
      this.accC -= 1;
      this.accO += n.ox / 100;
      while (this.accO >= 1) { this.accO -= 1; this.dueO.push(this.tau + 0.3 + 0.5 * ((this.nO + this.dueO.length) * 0.618034 % 1)); }
    }
    while (this.dueO.length && this.dueO[0] <= this.tau && this.launch('o', n)) this.dueO.shift();
    if (this.dueO.length > 3) this.dueO.splice(0, this.dueO.length - 3);
    this.flights = this.flights.filter(fl => {
      const end = fl.t0 + fl.dur, g = fl.pool === 'o' ? 1 : 0;
      if (this.tau >= end && this.land[fl.unit][g] < end - 1e-9) this.land[fl.unit][g] = end;
      if (this.tau < end + 0.4) return true;
      const s = this.slots[fl.pool][fl.j];
      s.busy = false; s.freeAt = end + 0.45;
      placeSlot(fl.pool, fl.j, s.gen + 1, s, this.slots);
      return false;
    });
    for (const p of POOLS) for (const s of this.slots[p]) if (!s.busy && this.tau >= s.dieAt + FADE) { const j = this.slots[p].indexOf(s); s.freeAt = this.tau; placeSlot(p, j, s.gen + 1, s, this.slots); }
  }
}

/* ---------------------------------------------------------------- the clippings (beat 8; texts as version 2) */

interface Clip { year: string; head: string[]; body: string[]; src: string }
const CLIPS: Clip[] = [
  { year: '2001', head: ['Red-algal RuBisCO made', 'in tobacco, but not', 'assembled'], body: ['More CO₂-specific than plant', 'RuBisCO. Made in tobacco', 'chloroplasts, it did not assemble.'], src: 'Whitney et al. 2001, Plant J. 26:535' },
  { year: '2014', head: ['Faster cyanobacterial', 'RuBisCO works in', 'tobacco'], body: ['It replaced tobacco’s RuBisCO and', 'fixed CO₂ faster per enzyme; the', 'plants grew only with extra CO₂.'], src: 'Lin et al. 2014, Nature 513:547 · Occhialini et al. 2016' },
  { year: '2026', head: ['Machine learning', 'helps evolve a faster', 'RuBisCO'], body: ['Tobacco RuBisCO variant T391I:', 'carboxylation rate +29 %, efficiency', 'in air +43 %; selected in <tspan font-style="italic">E. coli</tspan>.'], src: 'McDonald et al. 2026, Sci. Adv.' },
];
const CW = 332, CH = 270, CX0 = 280, CY = 214, CG = 22;
function clipsSvg(): string {
  return CLIPS.map((c, i) => {
    const x = CX0 + i * (CW + CG), rot = [-1.1, 0.8, -0.6][i];
    const head = c.head.map((l, k) => T(x + 22, CY + 76 + k * 30, l, 'c6-chead')).join('');
    const body = c.body.map((l, k) => T(x + 22, CY + 186 + k * 22, l.replace(/CO₂/g, 'CO<tspan class="c6-csub">₂</tspan>'), 'c6-cbody')).join('');
    const d = cutPath(x, CY, CW, CH, 61 + i * 7, 2.6);
    return `<g data-k="clip${i}" opacity="0"><g transform="rotate(${rot} ${x + CW / 2} ${CY + CH / 2})">
      <path class="c6-cpaper" d="${d}" filter="url(#c6-csh)"/><path class="c6-cpaper c6-ctex" d="${d}" filter="url(#c6-grain)"/>
      <path class="c6-crule" d="M${x + 22},${CY + 40} H${x + CW - 22} M${x + 22},${CY + 44} H${x + CW - 22}"/>
      ${T(x + 22, CY + 30, c.year, 'c6-cyear')}${head}
      <path class="c6-crule1" d="M${x + 22},${CY + 160} H${x + 90}"/>${body}
      ${T(x + 22, CY + CH - 16, c.src, 'c6-csrc')}</g></g>`;
  }).join('');
}

/* ---------------------------------------------------------------- markup */

function unitSvg(i: number): string {
  const x = UX[i], mid = i === 1;
  const rub = `<image href="${rubPng}" x="${f(x - RW / 2)}" y="${f(UY - RH / 2)}" width="${RW}" height="${f(RH)}"/>`;
  const stubs = `${arrow([[x - APP + 8, UY + 6], [x - 80, UY + 6]], 'gas', { thin: true })}${arrow([[x + APP - 8, UY + 6], [x + 80, UY + 6]], 'gas', { thin: true })}`;
  const rubp = `${arrow([[x, RUBP_Y - 17], [x, UY + RH / 2 + 3]], 'c', { thin: true })}<g class="chn-g">${row(x, RUBP_Y, 'PCCCCCP', { r: 10 })}</g>`;
  const glow = (side: number, k: string, g: string): string => `<ellipse data-k="${k}" cx="${f(x + side * 52)}" cy="${f(UY + 6)}" rx="46" ry="40" fill="url(#${g})" opacity="0"/>`;
  return `<g>${glow(-1, `gc${i}`, 'c6-gc')}${glow(1, `go${i}`, 'c6-go')}${stubs}${rubp}${rub}</g>`;
}
/** The middle RuBisCO's names, above the gliding molecules (a molecule passes behind a name). */
const unitLabels = (x: number): string => `<g data-k="ulab">${T(x, UY - RH / 2 - 12, 'RuBisCO', 'c6-mn c6-halo', 'middle')}${T(x, RUBP_Y + 33, 'RuBP', 'c6-mn c6-halo', 'middle')}
      ${T(x - 94, UY - 14, 'carboxylation', 'c6-mn c6-halo', 'end')}${T(x + 94, UY - 14, 'oxygenation', 'c6-mn c6-mo c6-halo', 'start')}</g>`;
function eraCardSvg(): string {
  const [x, y, w, h] = CARD.era;
  const pts = CO2R.filter(([ya]) => ya <= CO2_FIRST);
  const line = `M${pts.map(([ya, v]) => `${f(spX(ya))},${f(spY(v))}`).join('L')}`;
  return `<g data-k="era" opacity="0"><rect class="c6-card" x="${x}" y="${y}" width="${w}" height="${h}" rx="16"/>
    <text data-k="eraT" class="c6-eh" x="${x + 22}" y="${y + 36}"> </text>
    <text data-k="hotT" class="c6-es" x="${x + w - 22}" y="${y + 36}" text-anchor="end" opacity="0">a hot day</text>
    <text data-k="dryT" class="c6-es" x="${x + w - 22}" y="${y + 36}" text-anchor="end" opacity="0">a hot, dry day</text>
    ${T(x + 22, y + 72, 'CO₂ in the air', 'c6-rl')}<text data-k="co2V" class="c6-rv" x="${x + w - 22}" y="${y + 72}" text-anchor="end"> </text>
    <text data-k="tL" class="c6-rl" x="${x + 22}" y="${y + 100}"> </text><text data-k="tV" class="c6-rv" x="${x + w - 22}" y="${y + 100}" text-anchor="end"> </text>
    <path class="c6-spb" d="M${SP.x0},${SP.y1 + 4}H${SP.x1}"/>
    <path class="c6-spk" d="${line}"/>
    <g data-k="mk"><path class="c6-mk" d="M0,${SP.y0 - 6}V${SP.y1 + 4}"/><circle data-k="mkd" class="c6-mkd" cx="0" cy="0" r="4.5"/></g>
    ${T(SP.x0, y + h - 12, '3 billion years ago', 'c6-sl')}${T(SP.x1, y + h - 12, 'today', 'c6-sl', 'end')}
  </g>`;
}
function enzCardSvg(): string {
  const [x, y, w] = CARD.enz, bx = x + 200, bw = w - 222;
  return `<g data-k="enz" opacity="0"><rect data-k="enzR" class="c6-card" x="${x}" y="${y}" width="${w}" height="${ENZ_H0}" rx="16"/>
    <text data-k="enzT" class="c6-ch" x="${x + 22}" y="${y + 33}"> </text>
    <g data-k="bars" opacity="0">
      ${T(x + 22, y + 74, 'CO₂ preference (S)', 'c6-cl')}<rect class="c6-bart" x="${bx}" y="${y + 62}" width="${bw}" height="14" rx="7"/><rect data-k="barS" class="c6-bars" x="${bx}" y="${y + 62}" width="0" height="14" rx="7"/>
      ${T(x + 22, y + 106, 'speed', 'c6-cl')}<rect class="c6-bart" x="${bx}" y="${y + 94}" width="${bw}" height="14" rx="7"/><rect data-k="barK" class="c6-bark" x="${bx}" y="${y + 94}" width="0" height="14" rx="7"/>
    </g></g>`;
}
function shellSvg(): string {
  const d = `M${SHELL.map(([x, y]) => `${x},${y}`).join('L')}Z`;
  // shell proteins: small hexagons along the outline, one every ≈ 21 units
  const hx: string[] = [];
  for (let i = 0; i < SHELL.length; i++) {
    const [x0, y0] = SHELL[i], [x1, y1] = SHELL[(i + 1) % SHELL.length], n = Math.round(Math.hypot(x1 - x0, y1 - y0) / 21);
    for (let k = 0; k < n; k++) {
      const cx = x0 + ((x1 - x0) * (k + 0.5)) / n, cy = y0 + ((y1 - y0) * (k + 0.5)) / n;
      hx.push(`M${[0, 1, 2, 3, 4, 5].map(m => `${f(cx + 7.5 * Math.cos((m * Math.PI) / 3))},${f(cy + 7.5 * Math.sin((m * Math.PI) / 3))}`).join('L')}Z`);
    }
  }
  return `<g data-k="shell" opacity="0" display="none"><path class="c6-shell" d="${d}"/><path class="c6-shellh" d="${hx.join('')}"/>
    ${T(800, SHELL[1][1] - 24, 'carboxysome', 'c6-mn c6-sh c6-halo', 'middle')}</g>`;
}

/* ---------------------------------------------------------------- the staging */

const FROZEN = typeof location !== 'undefined' && new URLSearchParams(location.search).has('t');

export const STAGING: Staging = {
  id: 'v6',
  // the key lines on the stage (lecturer, 29 Oct 2026: "people don't read the text under the animation")
  keys: [
    { beat: 0, text: '3 factors: air, temperature, RuBisCO', x: 800, y: 262, size: 42 },
    { beat: 1, text: 'RuBisCO began to take up O₂', x: 800, y: 262, size: 42 },
    { beat: 2, text: 'More selective RuBisCO works more slowly', x: 800, y: 262, size: 42 },
    { beat: 3, text: 'Concentrating CO₂ keeps a fast RuBisCO', x: 820, y: 176, size: 36 },
    { beat: 4, text: 'Oxygenation became frequent', x: 800, y: 262, size: 42 },
    { beat: 5, text: 'Temperature offset the CO₂ effect', x: 800, y: 262, size: 42 },
    { beat: 6, text: 'CO₂ rose: oxygenation fell', x: 800, y: 262, size: 42 },
    { beat: 7, text: 'How does the leaf turn 3-PGA into sugar?', x: 800, y: 545, size: 44 },
  ],
  name: 'v6 · Molecules at the active site',
  note: 'C2 story v6: a close-up of the stroma; CO₂ and O₂ atom balls in numbers proportional to their dissolved concentrations; 3 RuBisCO renders catch them, O₂ captures paced so the tally matches the model; era card with CO₂, temperature and a sparkline; beat 3 swaps the RuBisCO, beat 4 a carboxysome crowds CO₂',
  beats: C2STORY3,
  holds: HOLDS,
  svg: () => {
    const mem = bilayer([{ L: [-40, 698, 1640, 698] }], 19);
    const pools = POOLS.map(p => Array.from({ length: NMAX[p] }, (_, j) => `<use data-k="m${p}${j}" href="#c6-${p === 'o' ? 'o2' : 'co2'}" display="none"/>`).join('')).join('');
    const flights = Array.from({ length: FLIGHTS }, (_, k) => `<use data-k="fl${k}" href="#c6-co2" display="none"/>`).join('');
    return `<defs>
      ${glyph('c6-co2', 'OCO')}${glyph('c6-o2', 'OO')}
      <radialGradient id="c6-gc"><stop offset="0" stop-color="#f2b705" stop-opacity=".75"/><stop offset=".6" stop-color="#f6cf5a" stop-opacity=".3"/><stop offset="1" stop-color="#f8dc8a" stop-opacity="0"/></radialGradient>
      <radialGradient id="c6-go"><stop offset="0" stop-color="#c0502c" stop-opacity=".6"/><stop offset=".6" stop-color="#d9775a" stop-opacity=".25"/><stop offset="1" stop-color="#e8a58f" stop-opacity="0"/></radialGradient>
      <filter id="c6-csh" x="-10%" y="-8%" width="120%" height="125%"><feDropShadow dx="1" dy="5" stdDeviation="6" flood-color="#3d3020" flood-opacity=".24"/></filter>
      <filter id="c6-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 0.55 -0.12" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in"/></filter>
    </defs>
    <g class="fig c6">
      <rect class="c6-paper" x="0" y="0" width="1600" height="740"/>
      <g data-k="all" opacity="0">
        <rect class="c6-stroma" x="0" y="0" width="1600" height="700"/><rect class="c6-lumen" x="0" y="698" width="1600" height="42"/>
        <g class="c6-mem">${mem}</g>
        <text data-k="zone" class="c6-zone c6-halo" x="32" y="664"> </text>
        <g data-k="swarm">${pools}</g>
        ${shellSvg()}
        <g data-k="units">${UX.map((_, i) => unitSvg(i)).join('')}</g>
        <g data-k="flights">${flights}</g>
        ${unitLabels(UX[1])}
        ${T(18, 734, 'structure: PDB 8RUC · dissolved CO₂ and O₂: Sander 2023', 'c6-cr')}
        ${T(1582, 734, 'CO₂: Foster et al. 2017, Bereiter et al. 2015, NOAA GML · temperature: Judd et al. 2024, Snyder 2016, Osman et al. 2021, HadCRUT5 · O₂: Schachat et al. 2018', 'c6-cr', 'end')}
        ${eraCardSvg()}
        <g data-k="tally" opacity="0"><rect class="c6-card" x="${CARD.tally[0]}" y="${CARD.tally[1]}" width="${CARD.tally[2]}" height="${CARD.tally[3]}" rx="16"/>
          <text class="c6-tw" x="800" y="${CARD.tally[1] + 50}" text-anchor="middle">per 100 carboxylations: <tspan data-k="tallyN" class="c6-tn"> </tspan> oxygenations</text></g>
        ${enzCardSvg()}
      </g>
      ${clipsSvg()}
    </g>`;
  },
  bind(stage) {
    const els = new Map<string, Element>();
    stage.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
    const cache = new Map<string, string>();
    const set = (k: string, a: string, v: string): void => {
      const key = `${k}|${a}`;
      if (cache.get(key) === v) return;
      cache.set(key, v);
      const el = els.get(k);
      if (!el) return;
      if (a === 'text') el.innerHTML = v; else el.setAttribute(a, v);
    };
    const op = (k: string, v: number): void => { set(k, 'display', v < 0.004 ? 'none' : 'inline'); set(k, 'opacity', v >= 0.996 ? '1' : v.toFixed(3)); };
    /** A text that may differ between the cut's two moments: the same text stays; a new one dips out and back. */
    const txt = (k: string, ta: string, tb: string, u: number, o = 1): void => {
      if (ta === tb) { set(k, 'text', ta || NB); op(k, o); return; }
      set(k, 'text', (u < 0.5 ? ta : tb) || NB);
      op(k, o * (1 - 2 * u) ** 2);
    };
    const counts = (fr: Fr, b: number, t: number): Counts => {
      const one = (s: St): Counts => {
        const nc = nCO2(s.k * s.ca, s.tl);
        return { o: nO2(s.o2, s.tl), c: nc, x: nc * SHELL_FRAC * Math.max(0, s.kIn / s.k - 1), ox: ox(s), rate: 1 };
      };
      const A = one(fr.a), B = one(fr.b), u = fr.u;
      return { o: lerp(A.o, B.o, u), c: lerp(A.c, B.c, u), x: lerp(A.x, B.x, u), ox: lerp(A.ox, B.ox, u), rate: b === 0 ? ease(t, 1.0, 1.8) : 1 };
    };
    let sim = new Sim(), frozenKey = '';
    const t0wall = performance.now();

    return (beat, t) => {
      const fr = frameAt(beat, t), { a, b, u } = fr, last = beat === 7;
      const n = counts(fr, beat, t);
      // the simulation: frozen, from the beat's start on t; live, on the wall clock
      if (FROZEN) {
        const key = `${beat}|${t}`;
        if (key !== frozenKey) {
          frozenKey = key; sim = new Sim();
          const dt = 1 / 60;
          for (let tt = 0; tt < t - 1e-9; tt += dt) { const h = Math.min(dt, t - tt); sim.step(h, counts(frameAt(beat, tt + h), beat, tt + h)); }
        }
      } else {
        const amb = (performance.now() - t0wall) / 1000;
        if (amb - sim.tau > 1) sim.tau = amb - 1;
        while (sim.tau < amb - 1e-6) sim.step(Math.min(1 / 60, amb - sim.tau), n);
      }
      const tau = sim.tau;

      /* ---- intro (beat 1) and dimming (beat 8) */
      const intro = (k0: number, k1: number): number => (beat === 0 ? ease(t, k0, k1) : 1);
      const dim = last ? 1 - 0.72 * ease(t, 0, 0.6) : 1;
      op('all', intro(0, 0.6) * dim);
      const swarmOn = intro(0.3, 1.3);
      op('ulab', intro(0.6, 1.2));
      op('era', intro(1.2, 1.8));
      op('enz', intro(2.0, 2.6));
      op('tally', intro(2.8, 3.4));
      for (let i = 0; i < CLIPS.length; i++) {
        const c = last ? ease(t, 0.5 + i * 0.7, 1.2 + i * 0.7) : 0;
        op(`clip${i}`, c);
        set(`clip${i}`, 'transform', `translate(0 ${f(14 * (1 - c))})`);
      }

      /* ---- the era card */
      txt('eraT', eraOf(a), eraOf(b), u);
      const hot = lerp(a.hot ?? 0, b.hot ?? 0, u), dry = lerp(a.dry ?? 0, b.dry ?? 0, u);
      op('hotT', hot * (1 - dry)); op('dryT', hot * dry);
      txt('co2V', co2Of(a), co2Of(b), u);
      txt('tL', tLabelOf(a), tLabelOf(b), u);
      txt('tV', tempOf(a), tempOf(b), u);
      const mk = (s: St): void => { set('mk', 'transform', `translate(${f(spX(s.ya))} 0)`); set('mkd', 'cy', f(spY(s.ca))); op('mkd', s.ya <= CO2_FIRST ? 1 : 0); };
      if (a.ya === b.ya) { mk(a); op('mk', 1); } else { mk(u < 0.5 ? a : b); op('mk', (1 - 2 * u) ** 2); }

      /* ---- the tally (a tspan: fill-opacity only, so the line keeps its width) */
      {
        const ta = tallyOf(a), tb = tallyOf(b);
        set('tallyN', 'text', ta === tb || u < 0.5 ? ta : tb);
        set('tallyN', 'fill-opacity', ta === tb ? '1' : ((1 - 2 * u) ** 2).toFixed(3));
      }

      /* ---- RuBisCO */
      txt('enzT', a.name, b.name, u);
      const bars = lerp(a.bars, b.bars, u), [, , ew] = CARD.enz, bw = ew - 222;
      set('enzR', 'height', f(lerp(ENZ_H0, ENZ_H1, sm(bars * 2))));
      op('bars', clamp(bars * 2 - 1));
      const sMax = Math.max(PLANT.s, CYANO.s) * 1.05, kMax = Math.max(PLANT.kcat, CYANO.kcat) * 1.05;
      set('barS', 'width', f((bw * lerp(a.s, b.s, u)) / sMax));
      set('barK', 'width', f((bw * lerp(a.kcat, b.kcat, u)) / kMax));

      /* ---- the scene: zone, carboxysome, glows */
      txt('zone', ZONE[a.zone], ZONE[b.zone], u);
      const shellOn = lerp(a.shell, b.shell, u);
      op('shell', shellOn);
      for (let i = 0; i < UX.length; i++) {
        const g = (tl: number): number => (tau < tl ? 0 : ease(tau, tl, tl + 0.15) * (1 - ease(tau, tl + 0.2, tl + 1.0)));
        op(`gc${i}`, g(sim.land[i][0]));
        op(`go${i}`, g(sim.land[i][1]));
      }

      /* ---- the molecules */
      for (const p of POOLS) {
        const sl = sim.slots[p];
        for (let j = 0; j < NMAX[p]; j++) {
          const k = `m${p}${j}`;
          let w = sim.weight(p, j, n) * swarmOn;
          const q = w >= 0.004 ? drift(sl[j], tau, p) : null;
          if (q) w *= veil(q, shellOn);
          op(k, w);
          if (q && w >= 0.004) set(k, 'transform', `translate(${f(q[0])} ${f(q[1])})`);
        }
      }
      for (let k = 0; k < FLIGHTS; k++) {
        const fl = sim.flights[k], key = `fl${k}`;
        if (!fl) { op(key, 0); continue; }
        const s = sim.slots[fl.pool][fl.j], v = (tau - fl.t0) / fl.dur;
        set(key, 'href', fl.pool === 'o' ? '#c6-o2' : '#c6-co2');
        let q: V, o = lerp(fl.w0, 1, sm((tau - fl.t0) / 0.4)), sc = 1;
        if (v < 1) {
          const pq = fl.path(sm(v)), d = drift(s, tau, fl.pool), wb = sm((tau - fl.t0) / 0.3);
          q = [lerp(d[0], pq[0], wb), lerp(d[1], pq[1], wb)];
        } else {
          const e = sm((tau - fl.t0 - fl.dur) / 0.4), end = fl.path(1), into = fl.pool === 'o' ? -1 : 1;
          q = [end[0] + into * 12 * e, end[1]]; o = 1 - e; sc = 1 - 0.45 * e;
        }
        op(key, o * swarmOn);
        set(key, 'transform', `translate(${f(q[0])} ${f(q[1])})${sc < 0.999 ? ` scale(${f(sc)})` : ''}`);
      }
    };
  },
};

