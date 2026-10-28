// The state behind 'c2story' v4, "Three dials" (c2story-v4.ts; brief research/redo-2026-10-29/C2STORY_V3_BRIEF.md and the
// coordinator's notes of 29 Oct 2026). One state per frame drives every readout: CO₂ and O₂ in the air, the leaf
// temperature, RuBisCO's CO₂ preference (S) and speed (kcat, shown only as a bar), and C꜀/Cₐ; the counter is oxPer100S of
// that state (c2story-enzyme.ts, c2story-model.ts).
// - Enzymes other than the land plants' appear only in beats 3–4, at 25 °C (S scales the readout exactly only there);
//   everywhere else the counter uses the land-plant enzyme (S_PLANT).
// - Beats 1, 3 and 4 show the reference: today's air (September 2026) at a leaf temperature of 25 °C; the era marker is
//   then hidden, since 25 °C is a setting, not today's record (26.5 °C).
// - While the era marker travels along the ribbon, the state is read from the records (c2story-data.ts) at the time
//   under the marker. To keep the needles calm, each value is the mean of the record over a ribbon window around the
//   marker (a triangle, so it slides without ripple; beyond the trip's ends the record is held at its end values) whose
//   half-width is B × the distance to the nearer end, at most HMAX px: where the marker starts and stops, the dials show
//   the record itself; on the way, dense records (the glacial cycles, the stage-to-stage scatter of the deep-time
//   records) are passed as their mean.
// - Where the story jumps (the reference → 3 billion years ago, the Great Oxidation Event → the reference, the reference →
//   420 million years ago), the marker fades out and in while the dials turn: the state is then the dial setting, CO₂ and
//   C꜀/Cₐ eased in log, the rest linearly; `jump` dims the numbers meanwhile, since they belong to no time.
// - Before 1 billion years ago there is no record in the deck: CO₂ is far above today (≈ 10–2500 × today; Catling &
//   Zahnle 2020), shown as "very high" (the counter uses 10,000 ppm; with O₂ ≈ 0 any value gives 0). O₂ is 10⁻⁶ of today
//   before the Great Oxidation Event and rises to 0.1 % of today (0.021 % of air) over 2.43–2.22 billion years ago
//   (Poulton et al. 2021), smoothly in log. The leaf temperature has no record and the RuBisCO of the time is not known:
//   both dials dim; the counter keeps the reference's 25 °C and land-plant S, which do not matter at O₂ ≈ 0 (Γ* ∝ O₂).
// - O₂ after 10 million years ago (end of GEOCARBSULF, 22.5 %): linear to 20.95 % today (an assumption; it changes the
//   counter at 20,000 years ago by < 0.01 %).
import { CO2_B, CO2_C, CO2_D, FOSTER, O2_GCS, T_A, T_B, T_C, T_D } from './c2story-data';
import { CC_CA, O2_TODAY, leafT } from './c2story-model';
import { enzyme, oxPer100S, type Enzyme } from './c2story-enzyme';

export type V = [number, number];
/** "Years ago" counts from 28 Oct 2026 (c2story-data.ts). */
export const NOW = 2026.8;
export const YA_TODAY = NOW - 2026.71;
export const YA_1750 = NOW - 1750;

/* ---------------------------------------------------------------- the records, merged, [years ago, value], oldest first */

const CO2: V[] = [
  ...FOSTER.slice().reverse().map(([ma, p]): V => [ma * 1e6, p]),
  ...CO2_B.map(([a, p]): V => [a, p]),
  ...CO2_C.map(([a, p]): V => [a, p]),
  ...CO2_D.map(([y, p]): V => [NOW - y, p]),
];
const DT: V[] = [
  ...T_A.map(([ma, d]): V => [ma * 1e6, d]),
  ...T_B.map(([a, d]): V => [a, d]),
  ...T_C.map(([a, d]): V => [a, d]),
  ...T_D.map(([y, d]): V => [NOW - y, d]),
];
const O2: V[] = [...O2_GCS.map(([ma, o]): V => [ma * 1e6, o]), [0, O2_TODAY]];

/** A record at ya, linear between its points, held at its ends. */
function at(pts: V[], ya: number): number {
  const n = pts.length;
  if (ya >= pts[0][0]) return pts[0][1];
  if (ya <= pts[n - 1][0]) return pts[n - 1][1];
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pts[m][0] >= ya) lo = m; else hi = m; }
  const [a0, v0] = pts[lo], [a1, v1] = pts[hi];
  return a0 === a1 ? v0 : v0 + ((v1 - v0) * (a0 - ya)) / (a0 - a1);
}

/* ---------------------------------------------------------------- the state */

export interface St {
  /** CO₂ in the air (ppm). */ ca: number;
  /** O₂ (% of air). */ o2: number;
  /** Leaf temperature (°C) used by the counter; its dial shows it when tOn > 0. */ t: number;
  tOn: number;
  /** RuBisCO's S and speed kcat (s⁻¹) used by the counter; the dial shows them when sOn > 0. */ s: number;
  kcat: number;
  sOn: number;
  /** C꜀/Cₐ. */ k: number;
  /** Before 1 billion years ago: no record (CO₂ "very high"). */ pre: boolean;
}
const SAT = 1e4;
const T_REF = 25;
const smooth = (u: number): number => { const x = Math.max(0, Math.min(1, u)); return x * x * (3 - 2 * x); };
/** O₂ before 1 billion years ago (% of air). */
function o2Pre(ya: number): number {
  const u = smooth((2.43e9 - ya) / 0.21e9), lo = Math.log10(O2_TODAY * 1e-6), hi = Math.log10(O2_TODAY * 1e-3);
  return 10 ** (lo + (hi - lo) * u);
}
export const PLANT = enzyme('plant');
export const CYANO = enzyme('cyano');
/** The state of the records at ya, for a land-plant leaf (C꜀/Cₐ of the deck's rule). */
export function rec(ya: number): St {
  if (ya > 1e9) return { ca: SAT, o2: o2Pre(ya), t: T_REF, tOn: 0, s: PLANT.s, kcat: PLANT.kcat, sOn: 0, k: CC_CA, pre: true };
  return { ca: at(CO2, ya), o2: at(O2, ya), t: leafT(at(DT, ya)), tOn: 1, s: PLANT.s, kcat: PLANT.kcat, sOn: 1, k: CC_CA, pre: false };
}
const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
const lgl = (a: number, b: number, u: number): number => Math.exp(lerp(Math.log(a), Math.log(b), u));
/** A dial turn from a to b (u: 0 → 1). */
export function mix(a: St, b: St, u: number): St {
  return {
    ca: lgl(a.ca, b.ca, u), o2: lerp(a.o2, b.o2, u), t: lerp(a.t, b.t, u), tOn: lerp(a.tOn, b.tOn, u),
    s: lerp(a.s, b.s, u), kcat: lerp(a.kcat, b.kcat, u), sOn: lerp(a.sOn, b.sOn, u), k: lgl(a.k, b.k, u), pre: u < 0.5 ? a.pre : b.pre,
  };
}
/** O₂ taken up per 100 CO₂ fixed. */
export const ox = (s: St): number => oxPer100S(s.s, s.t, s.ca, s.o2, s.k);

/* ---------------------------------------------------------------- the ribbon: era cells, and the time under each x */

export interface Era { name: string; ya: number }
export const ERAS: Era[] = [
  { name: '3 billion years ago', ya: 3e9 },
  { name: 'Great Oxidation', ya: 2.22e9 },
  { name: 'plants on land', ya: 5e8 },
  { name: 'Carboniferous', ya: 3e8 },
  { name: 'dinosaurs', ya: 1e8 },
  { name: 'ice age', ya: 2e4 },
  { name: '1750', ya: YA_1750 },
  { name: 'today', ya: YA_TODAY },
];
export const RIB_X0 = 135, RIB_DX = 190;
export const xEra = (i: number): number => RIB_X0 + i * RIB_DX;
/** Years ago under ribbon x: log between era cells, calendar years between 1750 and today. */
export function yaAt(x: number): number {
  const u = Math.max(0, Math.min(ERAS.length - 1, (x - RIB_X0) / RIB_DX)), i = Math.min(ERAS.length - 2, Math.floor(u)), v = u - i;
  const a = ERAS[i].ya, b = ERAS[i + 1].ya;
  if (i === ERAS.length - 2) return NOW - lerp(NOW - a, NOW - b, v);
  return 10 ** lerp(Math.log10(a), Math.log10(b), v);
}
/** Ribbon x of a time (years ago). */
export function xAt(ya: number): number {
  for (let i = 0; i < ERAS.length - 1; i++) {
    const a = ERAS[i].ya, b = ERAS[i + 1].ya;
    if (ya <= a && ya >= b) {
      const v = i === ERAS.length - 2 ? (a - ya) / (a - b) : (Math.log10(a) - Math.log10(ya)) / (Math.log10(a) - Math.log10(b));
      return xEra(i) + v * RIB_DX;
    }
  }
  return ya > ERAS[0].ya ? xEra(0) : xEra(ERAS.length - 1);
}
/** The records on a fine grid along the ribbon (GRID px; linear between nodes) with their first and second running
 *  integrals, evaluated exactly inside a cell, so that triangle means need 3 look-ups. Channels: ln CO₂, O₂, leaf T. */
const GRID = 0.1, GX0 = RIB_X0, GN = Math.round(((ERAS.length - 1) * RIB_DX) / GRID) + 1;
const VN = [new Float64Array(GN), new Float64Array(GN), new Float64Array(GN)];
const J1 = [new Float64Array(GN), new Float64Array(GN), new Float64Array(GN)];
const J2 = [new Float64Array(GN), new Float64Array(GN), new Float64Array(GN)];
{
  for (let i = 0; i < GN; i++) { const r = rec(yaAt(GX0 + i * GRID)); VN[0][i] = Math.log(r.ca); VN[1][i] = r.o2; VN[2][i] = r.t; }
  for (let c = 0; c < 3; c++) for (let i = 0; i < GN - 1; i++) {
    const v = VN[c][i], m = (VN[c][i + 1] - v) / GRID, g = GRID;
    J1[c][i + 1] = J1[c][i] + v * g + (m * g * g) / 2;
    J2[c][i + 1] = J2[c][i] + J1[c][i] * g + (v * g * g) / 2 + (m * g * g * g) / 6;
  }
}
/** v, ∫v and ∫∫v of channel c at x. */
function jAt(c: number, x: number): [number, number, number] {
  const u = Math.max(0, Math.min(GN - 1 - 1e-9, (x - GX0) / GRID)), i = Math.floor(u), tau = (u - i) * GRID;
  const v = VN[c][i], m = (VN[c][i + 1] - v) / GRID;
  return [v + m * tau, J1[c][i] + v * tau + (m * tau * tau) / 2, J2[c][i] + J1[c][i] * tau + (v * tau * tau) / 2 + (m * tau * tau * tau) / 6];
}
/** Half-width of the triangle window (px): at most HMAX, B × the distance to the nearer end of the trip. */
const HMAX = 100, B = 4;
/** The records around a travelling marker at x on a trip x0 → x1: a triangle-weighted mean (it slides without ripple)
 *  over a window that closes at both ends; beyond the ends the record is held at its end values, so the dials leave the
 *  start and reach the end smoothly. */
export function recTrip(x: number, x0: number, x1: number): St {
  const lo = Math.min(x0, x1), hi = Math.max(x0, x1), h = Math.min(HMAX, B * (x - lo), B * (hi - x)), r0 = rec(yaAt(x));
  if (h < 0.05) return r0;
  const m = (c: number): number => {
    const [vl, j1l, j2l] = jAt(c, lo), [vh, j1h, j2h] = jAt(c, hi);
    const j1hc = j1h - j1l, j2hc = j2h - j2l - j1l * (hi - lo);
    // the second integral, from lo, of the record held at its end values beyond [lo, hi]
    const J = (s: number): number => {
      if (s <= lo) return (vl * (s - lo) * (s - lo)) / 2;
      if (s >= hi) return j2hc + j1hc * (s - hi) + (vh * (s - hi) * (s - hi)) / 2;
      const [, j1, j2] = jAt(c, s);
      return j2 - j2l - j1l * (s - lo);
    };
    return (J(x + h) - 2 * J(x) + J(x - h)) / (h * h);
  };
  return { ...r0, ca: Math.exp(m(0)), o2: m(1), t: m(2) };
}

/* ---------------------------------------------------------------- the story: one state and marker per (beat, t) */

/** Beat durations (s); the ambient molecules keep moving after. */
export const D = [4.0, 5.0, 4.8, 3.4, 5.6, 6.0, 8.0, 3.0];
const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
export const ease = (t: number, t0: number, t1: number): number => smooth((t - t0) / (t1 - t0));
/** Quintic: slow in and out. */
export const ease5 = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * u * (u * (u * 6 - 15) + 10); };

/** Concentrating CO₂ (beat 4): C꜀ = 10 × the value without concentrating (illustrative, unlabelled). */
export const CCM_K = 10 * CC_CA;
/** A dry day: C꜀/Cₐ (c2story-model.ts). */
export const K_DRY = 0.35;
export const T_HOT = 35;
const withE = (s: St, e: Enzyme): St => ({ ...s, s: e.s, kcat: e.kcat });

export const S_TODAY = rec(YA_TODAY);
export const S_REF: St = { ...S_TODAY, t: T_REF };
export const S_3GA = rec(3e9);
export const S_GOE = rec(2.22e9);
export const S_420 = rec(4.2e8);
export const S_CYANO = withE(S_REF, CYANO);
export const S_CCM: St = { ...S_CYANO, k: CCM_K };
export const S_HOT: St = { ...S_TODAY, t: T_HOT };
export const S_DRY: St = { ...S_HOT, k: K_DRY };
/** Ribbon x of the times the marker visits. */
export const XT = { today: xAt(YA_TODAY), ga3: xAt(3e9), goe: xAt(2.22e9), m420: xAt(4.2e8), m300: xAt(3e8), m100: xAt(1e8), lgm: xAt(2e4), y1750: xAt(YA_1750) };

/** A frame: the state; the marker's x and opacity; the ribbon's opacity; the carboxysome (0 → 1) and its CO₂ crowd; the
 *  hot-day and dry-day tags; the stoma (0 open → 1 half closed) and its visibility; the 1750 mark on the counter bar. */
export interface Frame { st: St; mx: number; mOn: number; rib: number; ccm: number; crowd: number; hot: number; dry: number; stoma: number; stomaOn: number; tick1750: number; jump: number }
/** 0 → 1 → 0 over [t0, t1], eased in and out over `r` s. */
const bump = (t: number, t0: number, t1: number, r = 0.4): number => ease(t, t0, t0 + r) * (1 - ease(t, t1 - r, t1));

/** A trip of the marker from xa to xb over [t0, t1]: the state from the records under it. */
function trip(t: number, t0: number, t1: number, xa: number, xb: number): { st: St; x: number } {
  const x = lerp(xa, xb, ease5(t, t0, t1));
  return { st: recTrip(x, xa, xb), x };
}

export function frame(beat: number, t: number): Frame {
  const F: Frame = { st: S_REF, mx: XT.today, mOn: 0, rib: 1, ccm: 0, crowd: 0, hot: 0, dry: 0, stoma: 0, stomaOn: 0, tick1750: 0, jump: 0 };
  switch (beat) {
    case 0:
      F.rib = 0;
      break;
    case 1: {
      // the reference → 3 billion years ago (a dial turn), then the marker travels to the Great Oxidation Event
      F.rib = ease(t, 0, 0.8);
      if (t < 2.45) { F.st = mix(S_REF, S_3GA, ease(t, 0.2, 2.0)); F.st.tOn = 1 - ease(t, 0.6, 1.6); F.st.sOn = F.st.tOn; F.mx = XT.ga3; }
      else { const g = trip(t, 2.5, 4.7, XT.ga3, XT.goe); F.st = g.st; F.mx = g.x; }
      F.mOn = ease(t, 1.6, 2.1); F.jump = bump(t, 0.2, 2.0);
      break;
    }
    case 2: {
      // the Great Oxidation Event → the reference (a dial turn), then RuBisCO: land plants → cyanobacteria
      F.st = mix(mix(S_GOE, S_REF, ease(t, 0.1, 1.8)), S_CYANO, ease(t, 2.4, 4.2));
      F.st.tOn = ease(t, 0.6, 1.6); F.st.sOn = F.st.tOn;
      F.mx = XT.goe; F.mOn = 1 - ease(t, 0, 0.5); F.jump = bump(t, 0.1, 1.8);
      break;
    }
    case 3: {
      // CO₂ concentrated around the cyanobacterial RuBisCO
      const u = ease(t, 0.3, 2.6);
      F.st = mix(S_CYANO, S_CCM, u);
      F.ccm = ease(t, 0.1, 0.9); F.crowd = u;
      break;
    }
    case 4: {
      // back to the land plants' RuBisCO, without concentrating CO₂; to 420 million years ago; on to 300
      const u0 = ease(t, 0.1, 1.3);
      F.ccm = 1 - ease(t, 0.1, 1.0); F.crowd = 1 - u0;
      if (t < 2.75) { F.st = mix(mix(S_CCM, S_REF, u0), S_420, ease(t, 1.3, 2.5)); F.mx = XT.m420; }
      else { const g = trip(t, 2.8, 5.4, XT.m420, XT.m300); F.st = g.st; F.mx = g.x; }
      F.mOn = ease(t, 2.1, 2.6); F.jump = bump(t, 1.3, 2.5, 0.3);
      break;
    }
    case 5: {
      const g = t < 2.95 ? trip(t, 0.2, 2.7, XT.m300, XT.m100) : trip(t, 3.2, 5.8, XT.m100, XT.lgm);
      F.st = g.st; F.mx = g.x; F.mOn = 1;
      break;
    }
    case 6: {
      // 20,000 years ago → 1750 → today, then a hot day (leaf 35 °C), then a dry day (C꜀/Cₐ 0.35)
      const g = t < 2.3 ? trip(t, 0.2, 2.1, XT.lgm, XT.y1750) : trip(t, 2.5, 4.8, XT.y1750, XT.today);
      F.st = g.st; F.mx = g.x; F.mOn = 1;
      F.tick1750 = ease(t, 1.9, 2.4);
      if (t > 4.8) F.st = { ...S_TODAY, t: lerp(S_TODAY.t, T_HOT, ease(t, 5.1, 6.2)), k: lgl(CC_CA, K_DRY, ease(t, 6.7, 7.8)) };
      F.hot = ease(t, 5.0, 5.4);
      F.stomaOn = ease(t, 6.2, 6.6); F.stoma = ease(t, 6.7, 7.8); F.dry = ease(t, 6.5, 6.9);
      break;
    }
    default:
      F.st = S_DRY; F.mx = XT.today; F.mOn = 1; F.hot = 1; F.dry = 1; F.stomaOn = 1; F.stoma = 1; F.tick1750 = 1;
  }
  return F;
}
