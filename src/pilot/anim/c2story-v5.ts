// 'c2story', staging v5 · "Tree of life through time" (slide C2; lecturer, 29 Oct 2026; brief
// research/redo-2026-10-29/C2STORY_V3_BRIEF.md, fact table research/redo-2026-10-29/C2STORY_V3_FACTS.md). One fixed
// framing; no camera moves. Few numbers (lecturer, 29 Oct 2026): axis ticks, one CO₂ preference (S) per tip, the 2 pan
// values of the balance; nothing else.
// - Time runs left to right on a log axis of years ago, 3.5 billion years ago → 1750, then 1750 → 2026 in calendar years
//   after an axis break (a log axis cannot reach 0 years ago).
// - Behind the tree, the air as 2 soft bands, CO₂ and O₂, on one log scale of parts per million (no ticks; the gap between
//   the bands is what RuBisCO meets). Records from c2story-data.ts from 420 million years ago on; older air from the
//   published ranges in PRE_* below (sources there).
// - The tree is of organisms, not of RuBisCO genes: cyanobacteria from ≈ 3 billion years ago; a eukaryote host takes up a
//   cyanobacterium (the plastid), then red and green algae split, green algae and the land-plant line split, plants reach
//   land and C₄ plants branch off. Each tip carries its RuBisCO (c2story-enzyme.ts): its CO₂ preference (S), a speed bar
//   (kcat, no number) and a CO₂-concentrating mechanism drawn around it where it has one.
// - A marker moves along the axis and carries a small balance drawn as on slide C2 (mr3): RuBisCO the fulcrum, RuBP from
//   below, CO₂ from the left (carboxylation pan), O₂ from the right (oxygenation pan). Every frame one state, the time
//   under the marker (CO₂, O₂ and leaf temperature from the records), the spotlit lineage's S and C꜀/Cₐ, gives the 2 pan
//   values, the beam's tilt and the thermometer's level, so they move and stop together.
// Ambient motion: none; every frame is a function of (beat, t), so ?t= shots are exact.
import './c2story-v5.css';
import { C2STORY3 } from './beats-c2story';
import { CO2_B, CO2_C, CO2_D, FOSTER, O2_GCS, T_A, T_B, T_C, T_D } from './c2story-data';
import { CC_CA, leafT, O2_TODAY } from './c2story-model';
import { ENZYMES, enzyme, oxPer100S, type Enzyme } from './c2story-enzyme';
import { arrow, balls } from '../figs/cell-schema';
import { row } from '../figs/carbon-form';
import rubiscoPng from '../../assets/rf/rubisco-8ruc.png';
import type { Staging } from './types';

type V = [number, number];
type B3 = [number, number, number];
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const clamp = (x: number, a = 0, b = 1): number => (x < a ? a : x > b ? b : x);
const ease = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * (3 - 2 * u); };
const ease2 = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * u * (u * (u * 6 - 15) + 10); };
const life = (t: number, a0: number, a1: number, b0: number, b1: number): number => ease(t, a0, a1) * (1 - ease(t, b0, b1));
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
const lg = Math.log10;

/* ================================================================ the time axis and the view */

/** "Years ago" = years before 28 Oct 2026 (as in c2story-data.ts); the records end in September 2026. */
const NOW = 2026.8, END_YR = 2026.71, YA1750 = NOW - 1750, YA_END = NOW - END_YR;
const X_L = 90, X_B = 1030, GAP = 14, X_T0 = X_B + GAP, X_T1 = 1130;
const LA = lg(3.5e9), LB = lg(YA1750);
/** The view: log10(years ago) at the log part's right end X_B. Beat 2 shows 3.5 → 1 billion years ago; beat 3 widens it
 *  once (one slow, eased move) to the full axis, 3.5 billion years ago → 1750, and the 1750 → 2026 segment appears. */
const VB_DEEP = 9, VB_FULL = LB;
let vb = VB_FULL;
/** x of a time, years ago, in the current view: log down to 1750, then calendar years to September 2026. */
function xOf(ya: number): number {
  if (ya >= YA1750 - 1e-6) return X_L + ((LA - lg(Math.min(ya, 3.5e9))) / (LA - vb)) * (X_B - X_L);
  return X_T0 + ((NOW - ya - 1750) / (END_YR - 1750)) * (X_T1 - X_T0);
}
/** The time under x (in the break: 1750). */
function yaOf(x: number): number {
  if (x <= X_B) return 10 ** (LA - (clamp((x - X_L) / (X_B - X_L))) * (LA - vb));
  if (x < X_T0) return YA1750;
  return NOW - (1750 + clamp((x - X_T0) / (X_T1 - X_T0)) * (END_YR - 1750));
}
/* ================================================================ the air: CO₂ and O₂ (ppm), leaf temperature */

/** A series' value at ya, linear between its points (pts oldest first: [years ago, value]); null outside. */
function at(pts: V[], ya: number): number | null {
  const n = pts.length;
  if (!n || ya > pts[0][0] * (1 + 1e-9) || ya < pts[n - 1][0] * (1 - 1e-9)) return null;
  for (let i = 0; i < n - 1; i++) {
    const [a0, v0] = pts[i], [a1, v1] = pts[i + 1];
    if (ya <= a0 && ya >= a1) return a0 === a1 ? v0 : v0 + ((v1 - v0) * (a0 - ya)) / (a0 - a1);
  }
  return pts[n - 1][1];
}
/** Geometric (log) interpolation of [ya, lo, mid, hi] rows (oldest first). */
function atB(rows: Array<[number, number, number, number]>, ya: number): B3 | null {
  const n = rows.length;
  if (ya > rows[0][0] || ya < rows[n - 1][0]) return null;
  for (let i = 0; i < n - 1; i++) {
    const a = rows[i], b = rows[i + 1];
    if (ya <= a[0] && ya >= b[0]) {
      const u = a[0] === b[0] ? 0 : (a[0] - ya) / (a[0] - b[0]);
      return [1, 2, 3].map(k => 10 ** lerp(lg(a[k]), lg(b[k]), u)) as B3;
    }
  }
  return null;
}

/** Precambrian CO₂ (ppm; [years ago, 95 % low, median, 95 % high]): Catling & Zahnle 2020, Sci. Adv. 6:eaax1420, Fig. 3A
 *  (the carbonate–silicate model of Krissansen-Totton et al. 2018, PNAS 115:4105), read off the figure (PMC7043912) at
 *  0.25-billion-year steps, 1 bar = 10⁶ ppm. Where axis labels cover the band (2.75 and 2.5 billion years ago) the upper
 *  edge is interpolated. The model's median is dashed after 0.75 billion years ago: the band is bridged from there to
 *  PhanDA at 482 million years ago. Only drawn; the readout never uses it outside beat 2's ≈ 0 values. */
const PRE_CO2: Array<[number, number, number, number]> = [
  [3.5e9, 7500, 63000, 283000], [3.25e9, 6200, 49000, 220000], [3.0e9, 4500, 35000, 171000], [2.75e9, 2600, 23000, 140000],
  [2.5e9, 2100, 19000, 120000], [2.25e9, 1800, 14500, 97500], [2.0e9, 1300, 8200, 71000], [1.75e9, 1000, 5300, 49000],
  [1.5e9, 840, 3800, 38000], [1.25e9, 650, 2600, 26000], [1.0e9, 510, 1800, 18000], [0.75e9, 400, 1300, 6600],
];
/** CO₂ 482–421 million years ago (ppm; [years ago, 16th, 50th, 84th percentile]): PhanDA, Judd et al. 2024, Science
 *  385:eadk3705, PhanDA_GMSTandCO2_percentiles.csv (github.com/EJJudd/PhanDA), stage mid-ages. Only drawn. */
const PHANDA_CO2: Array<[number, number, number, number]> = [
  [482.0e6, 2656, 3261, 4047], [474.2e6, 2685, 3326, 4127], [470.3e6, 2634, 3243, 4066], [463.8e6, 1483, 2553, 3691],
  [455.5e6, 386, 482, 596], [449.0e6, 392, 483, 599], [444.1e6, 439, 624, 911], [440.8e6, 442, 620, 868],
  [435.8e6, 463, 631, 855], [431.8e6, 364, 505, 705], [428.7e6, 363, 524, 718], [425.9e6, 526, 1187, 2815],
  [423.9e6, 589, 1245, 2912], [420.9e6, 615, 1282, 2658],
];
/** O₂ before the GEOCARBSULF record (% of air; [years ago, low, high]):
 *  - before 2.43 billion years ago: < 10⁻⁶ of today (< 0.2 ppm; S-MIF), Catling & Zahnle 2020, Fig. 2A; lower edge = the
 *    chart floor;
 *  - Great Oxidation Event, 2.43 → 2.22 billion years ago (above 10⁻⁵ of today from 2.43, permanent from 2.22), Poulton et
 *    al. 2021, Nature 592:232;
 *  - 2.22 → 0.8 billion years ago: 0.1–1 % of today (Planavsky et al. 2014, Science 346:635: at most 0.1 % for 1.8–0.8
 *    billion years ago; Planavsky et al. 2018, Emerg. Top. Life Sci. 2:149: below 1 %);
 *  - 0.8 → 0.6 billion years ago: Neoproterozoic rise to > 0.02 bar (≈ 10 % of today) by 600 million years ago, Catling &
 *    Zahnle 2020, Fig. 2A; upper edge: today's level;
 *  - 0.6 → 0.42 billion years ago: > 0.15 bar from 400 million years ago (charcoal, same figure), into GEOCARBSULF at 420.
 *  The readout uses the geometric middle (beat 2: ≈ 0 either way). */
const PRE_O2: Array<[number, number, number]> = [
  [3.5e9, 1e-6, 2e-5], [2.43e9, 1e-6, 2e-5], [2.22e9, 0.021, 0.21], [0.8e9, 0.021, 0.21], [0.6e9, 2.0, 20.95], [0.42e9, 15, 30],
];
/** Years ago → CO₂ band [low, middle, high] (ppm). Single-valued records get a thin visual band (± 5 %). */
const D_YA: V[] = CO2_D.map(([yr, v]): V => [NOW - yr, v]);
const B_YA: V[] = CO2_B.map(([a, v]): V => [a, v]);
const C_YA: V[] = CO2_C.map(([a, v]): V => [a, v]);
const FOS = FOSTER.slice().reverse().map(([ma, m, lo, hi]): [number, number, number, number] => [ma * 1e6, lo, m, hi]);
const thin = (v: number): B3 => [v * 0.95, v, v * 1.05];
function co2Band(ya: number): B3 {
  if (ya <= YA1750) return thin(at(D_YA, Math.max(ya, YA_END)) as number);
  if (ya <= 11900) return thin(at(C_YA, ya) as number);
  if (ya < 13000) return thin(lerp(at(C_YA, 11900) as number, at(B_YA, 13000) as number, (ya - 11900) / 1100));
  if (ya <= 799000) return thin(at(B_YA, ya) as number);
  if (ya < 1e6) { const u = (ya - 799000) / (1e6 - 799000), b = thin(at(B_YA, 799000) as number), fo = FOS[FOS.length - 1]; return [0, 1, 2].map(k => lerp(b[k], fo[k + 1], u)) as B3; }
  if (ya <= 419.5e6) return atB(FOS, ya) as B3;
  if (ya < 420.9e6) { const a = FOS[0], b = PHANDA_CO2[PHANDA_CO2.length - 1], u = (ya - 419.5e6) / (1.4e6); return [1, 2, 3].map(k => 10 ** lerp(lg(a[k]), lg(b[k]), u)) as B3; }
  if (ya <= 482e6) return atB(PHANDA_CO2, ya) as B3;
  if (ya < 0.75e9) { const a = PHANDA_CO2[0], b = PRE_CO2[PRE_CO2.length - 1], u = (ya - 482e6) / (0.75e9 - 482e6); return [1, 2, 3].map(k => 10 ** lerp(lg(a[k]), lg(b[k]), u)) as B3; }
  return atB(PRE_CO2, Math.min(ya, 3.5e9)) as B3;
}
/** Years ago → O₂ band [low, middle, high] (% of air). GEOCARBSULF (single-valued) gets a thin visual band (± 6 %). */
const GCS: V[] = O2_GCS.map(([ma, v]): V => [ma * 1e6, v]);
function o2Band(ya: number): B3 {
  if (ya <= 1e6) return [O2_TODAY * 0.94, O2_TODAY, O2_TODAY * 1.06];
  if (ya < 10e6) { const v = lerp(O2_TODAY, 22.5, (ya - 1e6) / 9e6); return [v * 0.94, v, v * 1.06]; }
  if (ya <= 420e6) { const v = at(GCS, ya) as number; return [v * 0.94, v, v * 1.06]; }
  const yy = Math.min(ya, 3.5e9);
  for (let i = 0; i < PRE_O2.length - 1; i++) {
    const a = PRE_O2[PRE_O2.length - 1 - i], b = PRE_O2[PRE_O2.length - 2 - i];
    // a younger, b older
    if (yy >= a[0] && yy <= b[0]) {
      const u = (yy - a[0]) / (b[0] - a[0]);
      const lo = 10 ** lerp(lg(a[1]), lg(b[1]), u), hi = 10 ** lerp(lg(a[2]), lg(b[2]), u);
      return [lo, Math.sqrt(lo * hi), hi];
    }
  }
  // 420 → 420 million years ago joins GEOCARBSULF
  const g = 25.8; return [g * 0.94, g, g * 1.06];
}
/** Change in global mean surface temperature (°C from 1850–1900), or null where there is no record (before 482 million
 *  years ago). Between records: linear. */
const TA_YA: V[] = T_A.map(([ma, d]): V => [ma * 1e6, d]);
const TB_YA: V[] = T_B.map(([a, d]): V => [a, d]);
const TC_YA: V[] = T_C.map(([a, d]): V => [a, d]);
const TD_YA: V[] = T_D.map(([yr, d]): V => [NOW - yr, d]);
function dTRec(ya: number): number | null {
  const tdFirst = TD_YA[0][0], tcLast = TC_YA[TC_YA.length - 1][0];
  if (ya <= tdFirst) return at(TD_YA, Math.max(ya, TD_YA[TD_YA.length - 1][0]));
  if (ya < tcLast) return lerp(TD_YA[0][1], TC_YA[TC_YA.length - 1][1], (ya - tdFirst) / (tcLast - tdFirst));
  if (ya <= TC_YA[0][0]) return at(TC_YA, ya);
  if (ya < TB_YA[TB_YA.length - 1][0]) return lerp(TC_YA[0][1], TB_YA[TB_YA.length - 1][1], (ya - TC_YA[0][0]) / (TB_YA[TB_YA.length - 1][0] - TC_YA[0][0]));
  if (ya <= TB_YA[0][0]) return at(TB_YA, ya);
  if (ya < TA_YA[TA_YA.length - 1][0]) return lerp(TB_YA[0][1], TA_YA[TA_YA.length - 1][1], (ya - TB_YA[0][0]) / (TA_YA[TA_YA.length - 1][0] - TB_YA[0][0]));
  return at(TA_YA, ya);
}

/* ================================================================ the chart's y: one log scale of ppm */

const Y_T = 244, Y_B = 630, P_LO = -2, P_HI = 6;
const yP = (ppm: number): number => Y_B - ((clamp(lg(ppm), P_LO - 0.3, P_HI + 0.3) - P_LO) / (P_HI - P_LO)) * (Y_B - Y_T);

/* ================================================================ the tree (organisms) */

type K = 'cyano' | 'red' | 'green' | 'plant' | 'c4';
const ROW: Record<K, number> = { cyano: 300, red: 366, green: 432, plant: 498, c4: 564 };
const VIR_Y = (ROW.green + ROW.plant) / 2, ARCH_Y = (ROW.red + VIR_Y) / 2;
/** Branching times (years ago), fact table research/redo-2026-10-29/C2STORY_V3_FACTS.md §5: */
const TREE = {
  /** cyanobacteria ≈ 3 billion years ago (evidence 3.2–2.7; Catling & Zahnle 2020; crown group 2.98, Fournier et al. 2021) */
  cyano: 3.0e9,
  /** eukaryotes (the host) "by 1.9–1.4 Ga" (Gibson et al. 2018, Geology 46:135); drawn fading in, origin not dated */
  host: 1.9e9,
  /** primary endosymbiosis "sometime before 1,558 MYA" (Yoon et al. 2004, Mol. Biol. Evol. 21:809) */
  endo: 1.6e9,
  /** red–green split ≈ 1.5 billion years ago (Yoon et al. 2004; clocks 1.0–1.9, low confidence) */
  rg: 1.5e9,
  /** green algae vs the land-plant line: oldest green alga ≈ 1.0 billion years ago (Tang et al. 2020) */
  vir: 1.0e9,
  /** plants on land ≈ 500 million years ago (caption; clock 515–474, Morris et al. 2018; spores 473–471, Rubinstein 2010) */
  land: 5.0e8,
  /** first C₄ plants ≈ 30 million years ago (32–25, Christin et al. 2008) */
  c4: 3.0e7,
};
const GOE: V = [2.43e9, 2.22e9];

/** The tips: today's RuBisCO of each lineage (c2story-enzyme.ts). C₄ plants have no entry there: their tip shows a value
 *  only if one is added (k 'c4'). Mechanisms that concentrate CO₂ are drawn around the RuBisCO where the module says so;
 *  C₄ plants by definition. */
type Ccm = 'carboxysome' | 'pyrenoid' | 'c4' | 'other' | null;
interface Tip { k: K; name: string[]; e: Enzyme | null; ccm: Ccm; ccmName: string }
const enz = (k: string): Enzyme | null => ENZYMES.find(e => (e.k as string) === k) ?? null;
/** "a red alga (Griffithsia)" → two lines, the genus in italics. */
function nameLines(s: string): string[] {
  const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(s);
  return m ? [m[1], `(<tspan font-style="italic">${m[2]}</tspan>)`] : [s];
}
const TIPS: Tip[] = (['cyano', 'red', 'green', 'plant', 'c4'] as K[]).map(k => {
  const e = k === 'c4' ? enz('c4') : enzyme(k as Enzyme['k']);
  const ccm: Ccm = k === 'c4' ? 'c4' : !e?.ccm ? null : k === 'cyano' ? 'carboxysome' : k === 'green' ? 'pyrenoid' : 'other';
  const ccmName = ccm === 'carboxysome' ? 'carboxysome' : ccm === 'pyrenoid' ? 'pyrenoid' : ccm === 'c4' ? 'C₄ cycle' : ccm === 'other' ? 'concentrates CO₂' : '';
  return { k, name: k === 'c4' ? ['C₄ plants'] : nameLines(e?.name ?? k), e, ccm, ccmName };
});
const KCAT_MAX = Math.max(...ENZYMES.map(e => e.kcat));
const sOf = (k: K): number => (TIPS.find(t => t.k === k)?.e ?? enzyme('plant')).s;

const GX = 1176, NX = 1212, SX = 1392, BX0 = 1462, BLEN = 116;

/* ================================================================ colours */

const COL: Record<K, string> = { cyano: '#2f8f86', red: '#b0473a', green: '#6f9d3e', plant: '#2f6a35', c4: '#a5862b' };

/* ================================================================ geometry in the current view */

/** The air, sampled once: [years ago, CO₂ band, O₂ band] in log10(ppm). */
interface Smp { ya: number; c: B3; o: B3 }
const smp = (ya: number): Smp => ({ ya, c: co2Band(ya).map(lg) as B3, o: o2Band(ya).map(v => lg(v * 1e4)) as B3 });
const SAMP: Smp[] = [];
for (let i = 0, n = 2400; i <= n; i++) SAMP.push(smp(10 ** (LA - (i / n) * (LA - LB))));
const TAILS: Smp[] = [];
for (let yr = 1750; yr < END_YR; yr += 1) TAILS.push(smp(NOW - yr));
TAILS.push(smp(YA_END));
/** Band outlines: wide = the range (low–high; at least ± 0.04 decade), core = the middle ± 0.07 decade (O₂: records only). */
function bandD(tail: boolean): Record<string, string> {
  const pts = SAMP.map(s => ({ x: xOf(s.ya), s })).filter(p => p.x <= X_B + 0.6);
  if (tail) for (const s of TAILS) pts.push({ x: xOf(s.ya), s });
  const ribbon = (sel: (s: Smp) => B3, wide: boolean, keep: (s: Smp) => boolean): string => {
    const q = pts.filter(p => keep(p.s));
    if (q.length < 2) return 'M0,0';
    const up = q.map(p => { const b = sel(p.s), h = wide ? Math.max(b[2], b[1] + 0.04) : b[1] + 0.07; return `${f(p.x)},${f(yP(10 ** h))}`; });
    const dn = q.map(p => { const b = sel(p.s), l = wide ? Math.min(b[0], b[1] - 0.04) : b[1] - 0.07; return `${f(p.x)},${f(yP(10 ** l))}`; }).reverse();
    return `M${up.join(' L')} L${dn.join(' L')}Z`;
  };
  return {
    co2w: ribbon(s => s.c, true, () => true), co2c: ribbon(s => s.c, false, () => true),
    o2w: ribbon(s => s.o, true, () => true), o2c: ribbon(s => s.o, false, s => s.ya <= 420e6),
  };
}
/** The tree's paths in the current view (rows end at the view's edge, or at September 2026 with the last segment). */
function treeD(tail: boolean): Record<string, string> {
  const xe = tail ? X_T1 : X_B, x = xOf;
  const rowD = (k: K, from: number): string => (from >= xe ? 'M0,0' : `M${f(from)},${ROW[k]} H${f(xe)}`);
  const xs = x(TREE.endo), xrg = x(TREE.rg), xv = x(TREE.vir), xl = x(TREE.land), x4 = x(TREE.c4), xh = x(TREE.host), x0 = x(1.75e9);
  const stem = [
    `M${f(xs)},${f(ARCH_Y)} H${f(xrg)}`, `M${f(xrg)},${ROW.red} V${f(VIR_Y)}`, `M${f(xrg)},${f(VIR_Y)} H${f(xv)}`,
    `M${f(xv)},${ROW.green} V${ROW.plant}`, x4 < xe ? `M${f(x4)},${ROW.plant} V${ROW.c4}` : '',
  ].join(' ');
  const strep = `M${f(xv)},${ROW.plant} H${f(Math.min(xl, xe))}`;
  return {
    'row-cyano': rowD('cyano', x(TREE.cyano)), 'row-red': rowD('red', xrg), 'row-green': rowD('green', xv), 'row-strep': strep,
    'row-plant': rowD('plant', xl), 'row-c4': rowD('c4', x4),
    'glow-cyano': rowD('cyano', x(TREE.cyano)), 'glow-red': rowD('red', xrg), 'glow-green': rowD('green', xv),
    'glow-plant': rowD('plant', xl), 'glow-c4': rowD('c4', x4),
    stem, host: `M${f(xh)},${f(ARCH_Y)} H${f(xs)}`,
    endo: `M${f(x0)},${ROW.cyano + 5} C${f(x0)},${ROW.cyano + 62} ${f(xs)},${f(ARCH_Y - 66)} ${f(xs)},${f(ARCH_Y - 15)}`,
    endoh: `M${f(xs)},${f(ARCH_Y - 4)} l-5,-11 h10Z`,
  };
}
function treeSvg(): string {
  const p = (k: string, cls: string): string => `<path data-k="${k}" class="${cls}" d="M0,0"/>`;
  const g = (k: K): string => `<path data-k="glow-${k}" class="v5-glow" style="stroke:${COL[k]}" d="M0,0" opacity="0"/>`;
  return `<linearGradient data-k="hostg" id="v5-host" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="10" y2="0"><stop offset="0" stop-color="#8a877d" stop-opacity="0"/><stop offset="1" stop-color="#8a877d" stop-opacity=".95"/></linearGradient>
    ${g('cyano')}${g('red')}${g('green')}${g('plant')}${g('c4')}
    <path data-k="host" class="v5-host" d="M0,0" style="stroke:url(#v5-host)"/>${p('stem', 'v5-stem')}${p('endo', 'v5-endo')}${p('endoh', 'v5-endoh')}
    ${p('row-cyano', 'v5-row v5-row-cyano')}${p('row-red', 'v5-row v5-row-red')}${p('row-green', 'v5-row v5-row-green')}${p('row-strep', 'v5-row v5-row-strep')}
    ${p('row-plant', 'v5-row v5-row-plant')}${p('row-c4', 'v5-row v5-row-c4')}
    <g data-k="sprout" opacity="0"><path class="v5-ground" d="M-9,6 H9"/><path class="v5-sprout" d="M0,4 V-12 M0,-6 C-4,-10 -9,-10 -11,-6 C-7,-4 -3,-4 0,-6 M0,-10 C4,-15 9,-15 11,-11 C7,-8 3,-8 0,-10"/></g>`;
}
/** Axis ticks, in order of priority; a tick shows when it keeps ≥ 60 px from the ones before it. */
const TICKS: Array<[number, string]> = [
  [1e9, '1 billion'], [1e8, '100 million'], [1e7, '10 million'], [1e6, '1 million'], [1e5, '100,000'], [1e4, '10,000'], [1e3, '1,000'],
  [3e9, '3 billion'], [2e9, '2 billion'], [1.5e9, '1.5 billion'], [2.5e9, '2.5 billion'],
];
function axisSvg(): string {
  const ticks = TICKS.map(([, s], i) => `<g data-k="tk${i}" opacity="0"><path class="v5-tick" d="M0,${Y_B} v7"/>${T(0, Y_B + 24, s, 'v5-tk', 'middle')}</g>`).join('');
  const g = X_B + GAP / 2;
  const brk = `M${f(g - 7)},${Y_B + 7} l6,-14 M${f(g + 1)},${Y_B + 7} l6,-14`;
  return `<path class="v5-axis" d="M${X_L},${Y_B} H${X_B}"/>${ticks}
    <g data-k="axtail" opacity="0"><path class="v5-axis" d="M${X_T0},${Y_B} H${X_T1}"/><path class="v5-brk" d="${brk}"/>
      <path class="v5-tick" d="M${X_T0},${Y_B} v7 M${X_T1},${Y_B} v7"/>${T(X_T0, Y_B + 24, '1750', 'v5-tk', 'start')}${T(X_T1, Y_B + 24, '2026', 'v5-tk', 'end')}
      ${T((X_T0 + X_T1) / 2, Y_B + 50, 'year', 'v5-ax', 'middle')}</g>
    ${T((X_L + X_B) / 2, Y_B + 50, 'years ago (log scale)', 'v5-ax', 'middle')}
    <text class="v5-ay" transform="translate(52 ${f((Y_T + Y_B) / 2)}) rotate(-90)" text-anchor="middle">amount in the air (log scale)</text>
    <path class="v5-aya" d="M62,${f(Y_T + 70)} v-36 m-5,9 l5,-9 l5,9"/>`;
}

/** The CO₂-concentrating mechanism drawn around a RuBisCO at (cx, cy), radius R. */
function ccmSvg(kind: Ccm, cx: number, cy: number, R: number): string {
  if (kind === 'carboxysome') {
    const p = [0, 1, 2, 3, 4, 5].map(i => { const a = (Math.PI / 3) * i; return `${f(cx + R * Math.cos(a))},${f(cy + R * Math.sin(a))}`; });
    return `<path class="v5-cbx" d="M${p.join(' L')}Z"/>`;
  }
  if (kind === 'pyrenoid') {
    const plates = [0, 1, 2, 3, 4, 5, 6, 7].map(i => {
      const a0 = (Math.PI / 4) * i + 0.12, a1 = a0 + Math.PI / 4 - 0.24, r = R + 3.5;
      return `M${f(cx + r * Math.cos(a0))},${f(cy + r * Math.sin(a0))} A${f(r)},${f(r)} 0 0 1 ${f(cx + r * Math.cos(a1))},${f(cy + r * Math.sin(a1))}`;
    }).join(' ');
    return `<circle class="v5-pyr" cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}"/><path class="v5-starch" d="${plates}"/>`;
  }
  if (kind === 'c4') {
    // a wreath of bundle-sheath cells (Kranz anatomy)
    return [...Array(11).keys()].map(i => {
      const a = ((2 * Math.PI) / 11) * i, cx1 = cx + R * Math.cos(a), cy1 = cy + R * Math.sin(a);
      return `<ellipse class="v5-bs" cx="${f(cx1)}" cy="${f(cy1)}" rx="${f(R * 0.33)}" ry="${f(R * 0.22)}" transform="rotate(${f((a * 180) / Math.PI + 90)} ${f(cx1)} ${f(cy1)})"/>`;
    }).join('');
  }
  if (kind === 'other') return `<circle class="v5-pyr" cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}"/>`;
  return '';
}
const RUB_H = 471 / 548;
const rub = (cx: number, cy: number, w: number): string => `<image href="${rubiscoPng}" x="${f(cx - w / 2)}" y="${f(cy - (w * RUB_H) / 2)}" width="${f(w)}" height="${f(w * RUB_H)}"/>`;

function tipsSvg(): string {
  const head = `<g data-k="tiphead" opacity="0">${T(SX, 262, 'CO₂ preference (S)', 'v5-th', 'middle')}${T(BX0, 262, 'speed', 'v5-th', 'start')}</g>`;
  return head + TIPS.map(tp => {
    const y = ROW[tp.k], ccm = tp.ccm ? `<g data-k="tipc-${tp.k}" class="v5-ccmg">${ccmSvg(tp.ccm, GX, y, 24)}</g>` : '';
    const nm = tp.name.length > 1
      ? tp.name.map((s, j) => T(NX, y - 3 + j * 19, s, `v5-tn v5-c-${tp.k}`, 'start')).join('')
      : T(NX, y + (tp.ccmName ? -2 : 6), tp.name[0], `v5-tn v5-c-${tp.k}`, 'start');
    const cn = tp.ccmName ? T(NX, y + 16, tp.ccmName, `v5-tcn v5-c-${tp.k}`, 'start') : '';
    const sv = tp.e ? T(SX, y + 7, String(tp.e.s), 'v5-ts', 'middle') : '';
    const bar = tp.e ? `<rect class="v5-sbg" x="${BX0}" y="${y - 5}" width="${BLEN}" height="10" rx="5"/><rect class="v5-sb" x="${BX0}" y="${y - 5}" width="${f((BLEN * tp.e.kcat) / KCAT_MAX)}" height="10" rx="5"/>` : '';
    return `<g data-k="tip-${tp.k}" opacity="0">
      <rect data-k="tiph-${tp.k}" class="v5-tiph" x="${GX - 34}" y="${y - 29}" width="${1590 - GX + 30}" height="58" rx="12" opacity="0"/>
      <path class="v5-tipl" style="stroke:${COL[tp.k]}" d="M${X_T1},${y} H${GX - 27}"/>
      ${ccm}${rub(GX, y, 34)}${nm}${cn}${sv}${bar}</g>`;
  }).join('');
}

/* ---------------------------------------------------------------- the balance card (local 300 × 232) */

const CW = 300, CH = 232, PIV: V = [150, 72], ARM = 96, HANG = 22, BARK = 0.36, TILT = 0.125, TILT_MAX = 12.5;
const RUBW = 62, RUBC: V = [150, 162], GY = 172, HEXR = 44;
function cardSvg(): string {
  const pan = (k: string, cls: string): string => `<g data-k="pan${k}">
      <path class="v5-str" d="M0,${-HANG} L-31,-4 M0,${-HANG} L31,-4"/><path class="v5-pan" d="M-38,-4 H38 Q34,8 0,8 Q-34,8 -38,-4Z"/>
      <rect data-k="bar${k}" class="${cls}" x="-18" y="-4" width="36" height="0" rx="3"/></g>`;
  const hex = ccmSvg('carboxysome', RUBC[0], RUBC[1], HEXR);
  // CO₂ crowding RuBisCO inside the shell, upright either side of it (atom balls too small for letters)
  const mini = ([[RUBC[0] - 36, RUBC[1]], [RUBC[0] + 36, RUBC[1]]] as V[]).map(([x, y]) => [-1, 0, 1].map(i => `<circle class="atom atom-${i ? 'O' : 'C'}" cx="${f(x)}" cy="${f(y + i * 8.6)}" r="4.6"/>`).join('')).join('');
  const rh = (RUBW * RUB_H) / 2;
  return `<g data-k="card" opacity="0">
    <rect class="v5-card" x="0" y="0" width="${CW}" height="${CH}" rx="14"/>
    <g data-k="ccm" opacity="0">${hex}</g>
    <path class="v5-post" d="M${PIV[0]},${PIV[1]} V${f(RUBC[1] - rh + 2)}"/>
    ${rub(RUBC[0], RUBC[1], RUBW)}
    <g data-k="ccm2" opacity="0">${mini}</g>
    <g data-k="beam"><path class="v5-beam" d="M${-ARM - 4},0 H${ARM + 4}"/><circle class="v5-hook" cx="${-ARM}" cy="0" r="3.2"/><circle class="v5-hook" cx="${ARM}" cy="0" r="3.2"/></g>
    <circle class="v5-pin" cx="${PIV[0]}" cy="${PIV[1]}" r="5"/>
    ${pan('L', 'v5-barc')}${pan('R', 'v5-baro')}
    <text data-k="vL" class="v5-pv" x="${PIV[0] - ARM}" y="34" text-anchor="middle">100</text><text data-k="vR" class="v5-pv" x="${PIV[0] + ARM}" y="34" text-anchor="middle"> </text>
    ${T(PIV[0] - ARM, 147, 'carboxylation', 'v5-pl', 'middle')}${T(PIV[0] + ARM, 147, 'oxygenation', 'v5-pl v5-pl-o', 'middle')}
    ${balls(44, GY, 'OCO', 9)}${T(44, GY + 27, 'CO₂', 'v5-mn', 'middle')}${arrow([[72, GY], [RUBC[0] - HEXR - 3, GY]], 'gas', { thin: true })}
    ${balls(250, GY, 'OO', 9)}${T(250, GY + 27, 'O₂', 'v5-mn', 'middle')}${arrow([[228, GY], [RUBC[0] + HEXR + 3, GY]], 'gas', { thin: true })}
    <g class="chn-g">${row(RUBC[0], 214, 'PCCCCCP', { r: 9.6 })}</g>${arrow([[RUBC[0], 203], [RUBC[0], RUBC[1] + rh + 1]], 'c', { thin: true })}
    ${T(229, 219, 'RuBP', 'v5-mn', 'start')}
    <g data-k="therm"><rect class="v5-thtube" x="282.5" y="148" width="9" height="56" rx="4.5"/><rect data-k="thf" class="v5-thf" x="284.5" y="200" width="5" height="0"/>
      <circle data-k="thb" class="v5-thb" cx="287" cy="205" r="7.5"/><circle class="v5-thbo" cx="287" cy="205" r="7.5"/></g>
  </g>`;
}
/** Beat 1's legend of the 3 factors (stage coordinates). */
function legendSvg(): string {
  const x = 1010, tx = 1086;
  const th = `<rect class="v5-thtube" x="${x - 4.5}" y="${384 - 34}" width="9" height="40" rx="4.5"/><rect class="v5-thf" x="${x - 2.5}" y="${384 - 18}" width="5" height="18"/><circle class="v5-thb" cx="${x}" cy="${384 + 6}" r="7.5"/>`;
  return `<g data-k="leg0" opacity="0">${balls(x - 30, 286, 'OCO', 9)}${balls(x + 34, 286, 'OO', 9)}${T(tx, 293, 'the air', 'v5-leg', 'start')}</g>
    <g data-k="leg1" opacity="0">${th}${T(tx, 383, 'the temperature', 'v5-leg', 'start')}</g>
    <g data-k="leg2" opacity="0">${rub(x, 470, 58)}${T(tx, 477, 'RuBisCO itself', 'v5-leg', 'start')}</g>`;
}
/** Beat 8: what plant scientists try, drawn on the tips: put another lineage's RuBisCO into a plant (Whitney et al. 2001;
 *  Lin et al. 2014), or evolve the plant's own (McDonald et al. 2026). */
function b8Svg(): string {
  const yc = ROW.cyano, yr = ROW.red, yp = ROW.plant, xg = GX - 28, R = 31;
  const a1 = arrow([[xg, yc + 10], [xg - 72, yc + 62], [xg - 72, yp - 66], [xg - 6, yp - 22]], 'c', { halo: true });
  const a2 = arrow([[xg, yr + 10], [xg - 34, yr + 38], [xg - 34, yp - 48], [xg - 9, yp - 26]], 'c', { halo: true });
  // a ring arrow round the land-plant RuBisCO, open at the upper left where the 2 arrows arrive
  const a0 = (200 * Math.PI) / 180, aE = (500 * Math.PI) / 180, n = 28;
  const pts: V[] = [...Array(n + 1).keys()].map(i => { const a = a0 + ((aE - a0) * i) / n; return [GX + R * Math.cos(a), yp + R * Math.sin(a)]; });
  const ring = arrow(pts, 'c', { halo: true, thin: true });
  return `<g data-k="b8a0" opacity="0">${a1}${T(xg - 80, (yc + yp) / 2 + 4, 'replace', 'v5-b8 v5-halo', 'end')}</g>
    <g data-k="b8a1" opacity="0">${a2}</g>
    <g data-k="b8a2" opacity="0">${ring}${T(GX - R - 8, yp + 34, 'evolve', 'v5-b8 v5-halo', 'end')}</g>`;
}

/* ================================================================ the beats: one state per frame */

interface St {
  /** marker time, years ago */ ya: number;
  /** spotlight from → to, weight */ sp: [K, K, number];
  /** reference leaf temperature (°C) or null: from the records */ tRef: number | null;
  /** 0 → 1: leaf to 35 °C (a hot day) */ hot: number;
  /** 0 → 1: C꜀/Cₐ to 0.35 (a dry day, stomata half closed) */ dry: number;
  /** 0 → 1: C꜀ to 10 × (CO₂ concentrated around RuBisCO; illustrative) */ ccm: number;
  /** today's air instead of the air at ya */ today: boolean;
}
interface RO { ox: number; leaf: number; hasT: boolean }
const CA_NOW = CO2_D[CO2_D.length - 1][1];
function readout(s: St): RO {
  const [ka, kb, w] = s.sp, S = 1 / lerp(1 / sOf(ka), 1 / sOf(kb), w);
  const ca = s.today ? CA_NOW : co2Band(s.ya)[1], o2 = s.today ? O2_TODAY : o2Band(s.ya)[1];
  const dT = s.tRef !== null ? null : dTRec(s.ya);
  const base = s.tRef ?? (dT === null ? 25 : leafT(dT));
  const leaf = lerp(base, 35, s.hot), k = lerp(CC_CA, 0.35, s.dry) * (1 + 9 * s.ccm);
  return { ox: oxPer100S(S, leaf, ca, o2, k), leaf, hasT: s.tRef !== null || dT !== null };
}
/** Pan value: integer; "&lt; 1" below 1; "0" below 10⁻⁴; above a leaf of 40 °C (beyond the fit of Γ*) "≈" to the nearest 10. */
function fmtOx(ox: number, leaf: number): string {
  if (leaf > 40) return `≈ ${Math.round(ox / 10) * 10}`;
  if (ox < 1e-4) return '0';
  if (ox < 1) return '&lt; 1';
  return String(Math.round(ox));
}

const Y3G = 3.0e9, YGOE = 2.15e9, YREC = 419.5e6, Y300 = 3e8, Y100 = 1e8, Y20K = 2e4;
const S0: St = { ya: YA_END, sp: ['plant', 'plant', 1], tRef: 25, hot: 0, dry: 0, ccm: 0, today: true };
const HOLDS: number[][] = [[], [1.8], [4.9, 7.3], [], [2.3], [2.7], [4.9, 6.3], []];
/** Beat 1 card: big, left of the legend. */
const BS = 1.55, BIG = { x: 690 - (CW * BS) / 2, y: 366 - (CH * BS) / 2, s: BS };
const LANE_Y = 8;
const cardAt = (x: number): V => [clamp(x - CW / 2, 12, 1588 - CW), LANE_Y];
const xm2 = (a: number, b: number, u: number): number => yaOf(lerp(xOf(a), xOf(b), u));

interface Frame {
  vb: number; tail: number;
  st: St; st2?: St; mix?: number;
  card: { x: number; y: number; s: number; op: number };
  mk: { op: number; dot: number; x: number }; reveal: number; chart: number;
  tag: [string, number, number];
  tips: number[]; head: number; leg: number[]; ccmPulse: number; ccmCard: number; goe: number;
  blabD: number; blabF: number; cyl: number; sprout: number; b8: number[]; dim: number; crd: number;
}
function frame(beat: number, t: number): Frame {
  const fr: Frame = {
    vb: VB_FULL, tail: 1, st: { ...S0 }, card: { x: BIG.x, y: BIG.y, s: BIG.s, op: 1 }, mk: { op: 0, dot: 0, x: X_T1 },
    reveal: X_T1 + 20, chart: 1, tag: ['', 0, 0], tips: [1, 1, 1, 1, 1], head: 1, leg: [0, 0, 0], ccmPulse: 0, ccmCard: 0,
    goe: 0.55, blabD: 0, blabF: 1, cyl: 0, sprout: 1, b8: [0, 0, 0], dim: 0, crd: 1,
  };
  vb = fr.vb;
  const lane = (x: number): void => { const [cx, cy] = cardAt(x); fr.card = { x: cx, y: cy, s: 1, op: 1 }; };
  if (beat === 0) {
    fr.chart = 0; fr.crd = 0; fr.tips = [0, 0, 0, 0, 0]; fr.head = 0; fr.sprout = 0; fr.goe = 0; fr.blabF = 0;
    fr.card.op = ease(t, 0, 0.5);
    fr.leg = [ease(t, 0.5, 1.0), ease(t, 1.1, 1.6), ease(t, 1.7, 2.2)];
    return fr;
  }
  if (beat === 1) {
    // deep time: the card shrinks onto the marker at ≈ 3 billion years ago; then the marker crosses the Great Oxidation Event
    fr.vb = vb = VB_DEEP; fr.tail = 0;
    const u = ease2(t, 0.1, 1.5), ya = xm2(Y3G, YGOE, ease2(t, 2.0, 4.8)), x = xOf(ya);
    const [lx, ly] = cardAt(xOf(Y3G));
    fr.leg = [0, 1, 2].map(() => 1 - ease(t, 0, 0.5));
    fr.card = t < 2.0 ? { x: lerp(BIG.x, lx, u), y: lerp(BIG.y, ly, u), s: lerp(BIG.s, 1, u), op: 1 } : { x: cardAt(x)[0], y: ly, s: 1, op: 1 };
    fr.st2 = { ...S0, ya, sp: ['cyano', 'cyano', 1], tRef: null, today: false }; fr.mix = u;
    fr.chart = ease(t, 0.3, 1.3); fr.crd = fr.chart; fr.tips = [0, 0, 0, 0, 0]; fr.head = 0; fr.sprout = 0; fr.blabF = 0;
    fr.blabD = ease(t, 1.2, 1.8); fr.cyl = ease(t, 1.3, 1.9);
    fr.mk = { op: ease(t, 1.2, 1.6), dot: ease(t, 1.3, 1.7), x };
    fr.reveal = x + 3;
    fr.goe = clamp((x - xOf(GOE[0])) / (xOf(GOE[1]) - xOf(GOE[0])));
    fr.tag = ['Great Oxidation Event', ease(t, 4.5, 5.0), x];
    return fr;
  }
  if (beat === 2) {
    // the card leaves; the tree grows to 1 billion years ago, then the view widens (one eased move) while it grows to
    // today; the tips appear; today's RuBisCOs compared (today's air, 25 °C)
    const z = ease2(t, 1.0, 3.4);
    fr.vb = vb = lerp(VB_DEEP, VB_FULL, z); fr.tail = ease(t, 3.3, 3.7);
    const front = t < 1.0 ? lerp(xOf(YGOE), X_B, ease(t, 0.4, 1.0)) : t < 3.3 ? X_B : lerp(X_B, X_T1, ease(t, 3.3, 3.7));
    fr.reveal = front + 3;
    if (t < 0.45) {
      vb = VB_DEEP; const x = xOf(YGOE); vb = fr.vb;
      fr.st = { ...S0, ya: YGOE, sp: ['cyano', 'cyano', 1], tRef: null, today: false };
      fr.card = { x: cardAt(x)[0], y: LANE_Y, s: 1, op: 1 - ease(t, 0, 0.4) };
      fr.mk = { op: 1 - ease(t, 0, 0.4), dot: 1 - ease(t, 0, 0.4), x };
      fr.tag = ['Great Oxidation Event', 1 - ease(t, 0, 0.3), x];
    } else {
      fr.st = { ...S0, ya: YA_END, sp: ['cyano', 'cyano', 1] };
      const steps: Array<[K, K, number, number]> = [['cyano', 'green', 5.1, 5.9], ['green', 'plant', 6.3, 7.1], ['plant', 'red', 7.5, 8.3]];
      for (const [a, b, t0, t1] of steps) if (t >= t0) fr.st.sp = [a, b, ease(t, t0, t1)];
      lane(X_T1); fr.card.op = ease(t, 4.2, 4.7);
      fr.mk = { op: fr.card.op, dot: fr.card.op, x: X_T1 };
    }
    fr.tips = TIPS.map((_, i) => ease(t, 3.6 + i * 0.14, 4.1 + i * 0.14)); fr.head = ease(t, 3.6, 4.1);
    fr.goe = lerp(1, 0.55, ease(t, 0, 0.6)); fr.sprout = 0;
    fr.blabD = 1 - ease(t, 0.4, 0.9); fr.blabF = ease(t, 3.5, 4.0); fr.cyl = 1 - ease(t, 3.4, 3.9);
    return fr;
  }
  if (beat === 3) {
    // back to the cyanobacterium; its carboxysome raises C꜀ ten-fold
    fr.st = { ...S0, ya: YA_END, sp: ['red', 'cyano', ease(t, 0.1, 1.1)], ccm: ease(t, 1.6, 3.2) };
    lane(X_T1); fr.mk = { op: 1, dot: 1, x: X_T1 }; fr.sprout = 0;
    fr.ccmCard = ease(t, 1.1, 1.7); fr.ccmPulse = life(t, 1.1, 1.6, 2.6, 3.3);
    return fr;
  }
  if (beat === 4) {
    // the card leaves today; the marker returns to the first records (≈ 420 million years ago), just after plants reached
    // land; then to the Carboniferous
    const x = t < 2.5 ? lerp(X_T1, xOf(YREC), ease2(t, 0.35, 1.6)) : xOf(xm2(YREC, Y300, ease2(t, 2.5, 4.9)));
    const ya = yaOf(x);
    if (t < 0.4) { fr.st = { ...S0, ya: YA_END, sp: ['cyano', 'cyano', 1], ccm: 1 }; lane(X_T1); fr.card.op = 1 - ease(t, 0, 0.35); }
    else { fr.st = { ...S0, ya: Math.max(ya, YA_END), sp: ['plant', 'plant', 1], tRef: null, today: false }; lane(x); fr.card.op = ease(t, 1.6, 2.1); }
    fr.ccmCard = t < 0.4 ? 1 : 0;
    fr.mk = { op: 1, dot: t < 0.4 ? 1 - ease(t, 0, 0.35) : ease(t, 1.6, 2.1), x };
    fr.sprout = ease(t, 1.2, 1.8);
    fr.tag = ['Carboniferous', ease(t, 4.7, 5.2), x];
    return fr;
  }
  if (beat === 5) {
    const ya = t < 2.9 ? xm2(Y300, Y100, ease2(t, 0.2, 2.3)) : xm2(Y100, Y20K, ease2(t, 2.9, 5.4)), x = xOf(ya);
    fr.st = { ...S0, ya, sp: ['plant', 'plant', 1], tRef: null, today: false };
    lane(x); fr.mk = { op: 1, dot: 1, x };
    const tg: [string, number] = t < 0.3 ? ['Carboniferous', 1 - ease(t, 0, 0.25)] : t < 2.85 ? ['dinosaurs', ease(t, 2.1, 2.6)] : t < 2.95 ? ['dinosaurs', 1 - ease(t, 2.85, 2.95)] : ['ice age', ease(t, 5.2, 5.7)];
    fr.tag = [tg[0], tg[1], x];
    return fr;
  }
  if (beat === 6) {
    // 20,000 years ago → 1750 → September 2026 (records), then a hot day, then a hot, dry day
    const x = t < 1.55 ? lerp(xOf(Y20K), X_T0, ease2(t, 0.2, 1.5)) : lerp(X_T0, X_T1, cruise(t, 1.6, 4.4));
    fr.st = { ...S0, ya: yaOf(x), sp: ['plant', 'plant', 1], tRef: null, today: false, hot: ease(t, 5.1, 6.1), dry: ease(t, 6.5, 7.5) };
    lane(x); fr.mk = { op: 1, dot: 1, x };
    const tg: [string, number] = t < 0.3 ? ['ice age', 1 - ease(t, 0, 0.25)] : t < 4.95 ? ['today', ease(t, 4.3, 4.8)] : t < 6.35 ? ['hot day', t < 5.05 ? 1 - ease(t, 4.95, 5.0) : ease(t, 5.1, 5.5)] : ['hot, dry day', t < 6.45 ? 1 - ease(t, 6.35, 6.4) : ease(t, 6.5, 6.9)];
    fr.tag = [tg[0], tg[1], x];
    return fr;
  }
  // beat 8: what plant scientists try
  fr.st = { ...S0, ya: YA_END, sp: ['plant', 'plant', 1], tRef: null, today: false, hot: 1, dry: 1 };
  lane(X_T1); fr.card.op = 1 - ease(t, 0, 0.5);
  fr.mk = { op: 1 - ease(t, 0, 0.5), dot: 1 - ease(t, 0, 0.5), x: X_T1 };
  fr.tag = ['hot, dry day', 1 - ease(t, 0, 0.3), X_T1];
  fr.b8 = [ease(t, 0.6, 1.4), ease(t, 1.1, 1.9), ease(t, 1.8, 2.6)];
  fr.dim = ease(t, 0, 0.6);
  return fr;
}

/* ================================================================ the staging */

const CREDIT1 = 'Air: Catling &amp; Zahnle 2020; Poulton et al. 2021; Planavsky et al. 2014, 2018; Judd et al. 2024; Foster et al. 2017; Schachat et al. 2018; Bereiter et al. 2015; NOAA GML';
const CREDIT2 = 'Tree: Catling &amp; Zahnle 2020; Yoon et al. 2004; Tang et al. 2020; Morris et al. 2018; Christin et al. 2008 · RuBisCO: Tcherkez et al. 2006';
/** Band labels: in deep time (beat 2) and in the full view. */
function blabSvg(): string {
  vb = VB_DEEP;
  const xd = xOf(3.25e9), cD = co2Band(3.25e9)[2], oD = 0.2;
  const deep = `${T(xd, yP(cD) - 10, 'CO₂', 'v5-bl v5-bl-c v5-halo', 'middle')}${T(xd, yP(oD) - 10, 'O₂', 'v5-bl v5-bl-o v5-halo', 'middle')}`;
  vb = VB_FULL;
  const xf = xOf(3e5);
  const full = `${T(xf, yP(O2_TODAY * 1e4) - 13, 'O₂', 'v5-bl v5-bl-o v5-halo', 'middle')}${T(xf, yP(co2Band(3e5)[1]) - 14, 'CO₂', 'v5-bl v5-bl-c v5-halo', 'middle')}`;
  return `<g data-k="blabD" opacity="0">${deep}</g><g data-k="blabF" opacity="0">${full}</g>`;
}

export const STAGING: Staging = {
  id: 'v5',
  // the key lines on the stage (lecturer, 29 Oct 2026: "people don't read the text under the animation")
  keys: [
    { beat: 0, text: '3 factors: air, temperature, RuBisCO', x: 490, y: 110, size: 42 },
    { beat: 1, text: 'RuBisCO began', x: 1320, y: 260, size: 42 },
    { beat: 1, text: 'to take up O₂', x: 1320, y: 306, size: 42 },
    { beat: 2, text: 'More selective RuBisCO works more slowly', x: 490, y: 110, size: 42 },
    { beat: 3, text: 'Concentrating CO₂ keeps a fast RuBisCO', x: 490, y: 110, size: 42 },
    { beat: 4, text: 'Oxygenation became frequent', x: 900, y: 110, size: 42 },
    { beat: 5, text: 'Temperature offset', x: 1580, y: 90, size: 42, anchor: 'end' },
    { beat: 5, text: 'the CO₂ effect', x: 1580, y: 136, size: 42, anchor: 'end' },
    { beat: 6, text: 'CO₂ rose: oxygenation fell', x: 40, y: 110, size: 42, anchor: 'start' },
    { beat: 7, text: 'How does the leaf turn 3-PGA into sugar?', x: 800, y: 150, size: 44 },
  ],
  name: 'v5 · Tree of life through time',
  note: 'RuBisCO through Earth’s history (v5): a lineage tree of organisms (cyanobacteria, red and green algae, land plants, C₄ plants) on a log time axis, 3.5 billion years ago → 2026, over the air as 2 soft bands (CO₂, O₂); each tip carries its RuBisCO (CO₂ preference, speed bar, CO₂-concentrating mechanism); a moving marker carries a small balance for the spotlit lineage, calculated each frame from the air, the leaf temperature and its RuBisCO',
  beats: C2STORY3,
  holds: HOLDS,
  svg: () => `<defs>
      <filter id="v5-soft" x="-2%" y="-10%" width="104%" height="120%"><feGaussianBlur stdDeviation="1.5"/></filter>
      <filter id="v5-csh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#3d3020" flood-opacity=".16"/></filter>
      <clipPath id="v5-rev"><rect data-k="rev" x="${X_L - 12}" y="0" width="0" height="740"/></clipPath>
    </defs>
    <g class="c5">
      <rect class="v5-paper" x="0" y="0" width="1600" height="740"/>
      <g data-k="chart" opacity="0">
        <g data-k="dimA">
          <g clip-path="url(#v5-rev)"><g filter="url(#v5-soft)"><path data-k="co2w" class="v5-co2w" d="M0,0"/><path data-k="o2w" class="v5-o2w" d="M0,0"/>
            <path data-k="co2c" class="v5-co2c" d="M0,0"/><path data-k="o2c" class="v5-o2c" d="M0,0"/></g></g>
          <g data-k="goe" opacity="0"><rect data-k="goer" class="v5-goe" x="0" y="${Y_T}" width="0" height="${Y_B - Y_T}"/></g>
          ${blabSvg()}
          <g clip-path="url(#v5-rev)">${treeSvg()}</g>
          <g data-k="cyl" opacity="0"><text data-k="cylt" class="v5-tn v5-c-cyano v5-halo" x="0" y="${ROW.cyano - 12}" text-anchor="start">cyanobacteria</text></g>
        </g>
        ${axisSvg()}
      </g>
      <g data-k="tips">${tipsSvg()}</g>
      <g data-k="mk" opacity="0"><path class="v5-mkl" d="M0,${LANE_Y + CH} V${Y_B}"/><circle data-k="mkdot" class="v5-mkd" cx="0" cy="${ROW.cyano}" r="7"/></g>
      <text data-k="tag" class="v5-tag v5-halo" x="0" y="${Y_B - 14}" opacity="0"> </text>
      ${legendSvg()}
      <g filter="url(#v5-csh)">${cardSvg()}</g>
      ${b8Svg()}
      <g data-k="crd" opacity="0">${T(X_L, 712, CREDIT1, 'v5-crd', 'start')}${T(X_L, 728, CREDIT2, 'v5-crd', 'start')}</g>
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
    let geomKey = '';

    return (beat, t) => {
      const fr = frame(beat, t);
      vb = fr.vb;
      /* ---- the view: rebuild the geometry when it changes */
      const key = `${fr.vb.toFixed(5)}|${fr.tail > 0 ? 1 : 0}`;
      if (key !== geomKey) {
        geomKey = key;
        const tl = fr.tail > 0;
        for (const [k, d] of Object.entries(bandD(tl))) set(k, 'd', d);
        for (const [k, d] of Object.entries(treeD(tl))) set(k, 'd', d);
        set('hostg', 'x1', f(xOf(TREE.host))); set('hostg', 'x2', f(xOf(TREE.endo)));
        set('goer', 'x', f(xOf(GOE[0]))); set('goer', 'width', f(xOf(GOE[1]) - xOf(GOE[0])));
        set('sprout', 'transform', `translate(${f(xOf(TREE.land))} ${ROW.plant})`);
        const shown: number[] = [];
        TICKS.forEach(([ya], i) => {
          const x = xOf(ya);
          const inView = x >= X_L - 1 && x <= X_B + 1;
          const d = shown.length ? Math.min(...shown.map(s => Math.abs(s - x))) : 999;
          const o = inView ? clamp((d - 52) / 8) : 0;
          if (o > 0.5) shown.push(x);
          set(`tk${i}`, 'transform', `translate(${f(x)} 0)`); op(`tk${i}`, o);
        });
      }
      op('axtail', fr.tail);
      /* ---- one state → every readout (a mix of 2 states only while beat 2's card shrinks onto the marker) */
      const ra = readout(fr.st), rb = fr.st2 ? readout(fr.st2) : ra, u = fr.mix ?? 0;
      const ox = lerp(ra.ox, rb.ox, u), leaf = lerp(ra.leaf, rb.leaf, u), hasT = u < 0.5 ? ra.hasT : rb.hasT;
      const L = 100, R = Math.min(ox, 130);
      const deg = clamp(TILT * (L - R), -TILT_MAX, TILT_MAX), th = (deg * Math.PI) / 180;
      set('beam', 'transform', `translate(${PIV[0]} ${PIV[1]}) rotate(${f(-deg)})`);
      set('panL', 'transform', `translate(${f(PIV[0] - ARM * Math.cos(th))} ${f(PIV[1] + ARM * Math.sin(th) + HANG)})`);
      set('panR', 'transform', `translate(${f(PIV[0] + ARM * Math.cos(th))} ${f(PIV[1] - ARM * Math.sin(th) + HANG)})`);
      set('barL', 'y', f(-4 - BARK * L)); set('barL', 'height', f(BARK * L));
      set('barR', 'y', f(-4 - BARK * Math.min(R, 100))); set('barR', 'height', f(BARK * Math.min(R, 100)));
      set('vL', 'x', f(PIV[0] - ARM * Math.cos(th))); set('vR', 'x', f(PIV[0] + ARM * Math.cos(th)));
      set('vR', 'text', fmtOx(ox, leaf));
      // the thermometer: leaf temperature 10 → 45 °C; no record: empty
      const lvl = clamp((leaf - 10) / 35) * 50;
      set('thf', 'y', f(200 - lvl)); set('thf', 'height', f(hasT ? lvl : 0));
      op('thb', hasT ? 1 : 0);
      op('ccm', fr.ccmCard); op('ccm2', fr.ccmCard * clamp(fr.st.ccm * 1.6));
      set('card', 'transform', `translate(${f(fr.card.x)} ${f(fr.card.y)}) scale(${fr.card.s.toFixed(4)})`);
      op('card', fr.card.op);
      for (let i = 0; i < 3; i++) op(`leg${i}`, fr.leg[i]);
      /* ---- chart, reveal, marker */
      op('chart', fr.chart); op('crd', fr.crd);
      set('rev', 'width', f(Math.max(0, fr.reveal - X_L + 12)));
      op('dimA', 1 - 0.45 * fr.dim);
      op('goe', fr.goe);
      op('blabD', fr.blabD); op('blabF', fr.blabF * (beat === 1 ? 0 : 1));
      op('cyl', fr.cyl); set('cylt', 'x', f(xOf(TREE.cyano) + 4));
      op('mk', fr.mk.op);
      set('mk', 'transform', `translate(${f(fr.mk.x)} 0)`);
      const [ka, kb, w] = fr.st2 && u > 0.5 ? fr.st2.sp : fr.st.sp;
      set('mkdot', 'cy', f(lerp(ROW[ka], ROW[kb], w)));
      set('mkdot', 'style', `fill:${w < 0.5 ? COL[ka] : COL[kb]}`);
      op('mkdot', fr.mk.dot);
      // the spotlit lineage: its row glows, its tip is highlighted
      TIPS.forEach(({ k }, i) => {
        const on = fr.mk.dot * ((k === ka ? 1 - w : 0) + (k === kb ? w : 0));
        op(`glow-${k}`, on);
        op(`tiph-${k}`, on * fr.tips[i]);
      });
      // the tag at the marker's foot
      const [tg, to, tx] = fr.tag, right = tx > 760;
      set('tag', 'text', tg || ' '); set('tag', 'x', f(right ? tx - 10 : tx + 10)); set('tag', 'text-anchor', right ? 'end' : 'start');
      op('tag', to);
      /* ---- tips */
      op('tiphead', fr.head * (1 - 0.45 * fr.dim));
      TIPS.forEach((tp, i) => op(`tip-${tp.k}`, fr.tips[i]));
      for (const k of ['cyano', 'green'] as K[]) {
        const pz = fr.ccmPulse;
        set(`tipc-${k}`, 'transform', `translate(${GX} ${ROW[k]}) scale(${(1 + 0.16 * pz).toFixed(3)}) translate(${-GX} ${-ROW[k]})`);
        set(`tipc-${k}`, 'class', `v5-ccmg${pz > 0.05 ? ' v5-ccm-on' : ''}`);
      }
      op('sprout', fr.sprout);
      for (let i = 0; i < 3; i++) op(`b8a${i}`, fr.b8[i]);
    };
  },
};
