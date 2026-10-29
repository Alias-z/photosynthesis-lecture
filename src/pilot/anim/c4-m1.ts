// 'lf12', staging c4m1 · lf12m rebuilt (lecturer, 29 Oct 2026: "show the two compartments … a lot of CO₂ getting
// pumped and concentrated … then compare with C₃ from the microscopy perspective, real images"). Captions: C4M1 below.
// - Beats 1–4: lf12m's per-1-CO₂ story in the leaf section, with the ledger; the 2 compartments named in ink.
// - Beat 5: the pump keeps running: one C₄ acid after another (one moving at a time) leaves PEPC, crosses into the
//   bundle-sheath chloroplast, and NADP-ME releases its CO₂, which joins the crowd round RuBisCO; the count beside
//   RuBisCO rises 1 → 10 as each arrives; then the label "CO₂ concentrated (≈ 10 × the air)".
// - Beat 6: the leaf fades out; c4b's 2 magnifier panels on the real micrographs, stacked in the centre: C₃, 4 CO₂
//   from photorespiration, 3 escape, 1 caught; C₄ (maize), the bundle sheath crowded with CO₂ at RuBisCO, one leaks.
//   The closing question leads to CAM.
// The leaf actors, the crowd and the comparison are exported for c4-m2.ts.
import steJpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import gdcPng from '../../assets/cell/gdcp.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { bilayer } from '../figs/cell-schema';
import { C4, hco3G, h2oG, PORE, SPOT, type LPart } from '../figs/leaf-schema';
import { hring, tagG } from '../figs/chain';
import { GLYPH } from './dk1-common';
import { LF12 } from './beats-lf';
import { bilayerE, flashDefs, flashG, kidG, T, type Anchor } from './co2-kit';
import { cardSvg, f } from './dk2-common';
import {
  CITES, FD, c4Labels, catchT, fitPills, flashOf, hudMover, kidOf, labSvg, magC4, magnifier, o2B, pill, walk, zmap, ZC, O2_PX,
  STEP, type Kid, type Run, type Zm,
} from './c4-b';
import { add, ease, flash, glide, makeLeafStaging, panelShow, panelSvg, type Actor, type Api, type Row, type V } from './lf-common';
import type { Beat, Staging } from './types';

/* ---------------------------------------------------------------- captions */

const { BUSCH13, VCF03, FURB11 } = CITES;
export const CMP_STEPS: Array<{ tag: string; say: string }> = [
  { tag: 'C₃ and C₄ leaves', say: 'Light micrographs cut across a vein: a C₃ grass (<i>Steinchisma laxum</i>) and maize (C₄). In maize the bundle-sheath cells round the vein are full of chloroplasts with RuBisCO; PEPC sits in the mesophyll.' },
  { tag: 'C₃: the CO₂ escapes', say: 'In a C₃ leaf, photorespiration releases CO₂ in the mesophyll mitochondria, next to the air spaces: only about 1 in 4 is recaptured (24–38 %), the rest escapes. RuBisCO gets only the CO₂ that diffuses in.' },
  { tag: 'C₄: CO₂ concentrated at RuBisCO', say: 'In maize the CO₂ at bundle-sheath RuBisCO is about 10 times the air’s. RuBisCO there carboxylates far more and hardly oxygenates.' },
];
export const CMP_BEAT: Beat = { tag: 'C₃ and C₄ leaves', say: '', cite: [BUSCH13, VCF03], steps: CMP_STEPS };

export const C4M1: Beat[] = [
  { ...LF12[0], tag: 'CO₂ into the mesophyll cell' },
  LF12[1],
  { tag: 'Into the bundle-sheath cell', say: 'The C₄ acid moves through the plasmodesmata into the bundle-sheath cell. In maize, NADP-malic enzyme (NADP-ME) releases its CO₂ in the bundle-sheath chloroplast, next to RuBisCO, which fixes it.', cite: [FURB11] },
  LF12[3],
  {
    tag: 'The pump keeps running', say: '', cite: [VCF03, FURB11],
    steps: [
      { tag: 'The pump keeps running', say: 'PEPC keeps fixing CO₂ in the mesophyll. One C₄ acid after another moves into the bundle-sheath cell and releases its CO₂ next to RuBisCO.' },
      { tag: 'CO₂ concentrated', say: 'CO₂ is released faster than RuBisCO fixes it: in the bundle sheath it rises to about 10 times the concentration in air, so RuBisCO there hardly takes up O₂.' },
    ],
  },
  CMP_BEAT,
];

/* ---------------------------------------------------------------- the leaf actors and ways (panorama units, lf12.ts) */

const cap = (w: number, r = 13): string => `<rect class="dk-cap" x="${-w / 2 - 5}" y="${-r - 5}" width="${w + 10}" height="${2 * r + 10}" rx="${r + 5}"/>`;
/** The crowd: up to 10 CO₂ round bundle-sheath RuBisCO, at this scale (the band between NADP-ME and RuBisCO is narrow). */
export const CW_N = 10, CW_SC = 0.5;
export const LEAF_ACTORS: Actor[] = [
  { k: 'co2', g: GLYPH.co2(), lab: 'CO₂ 1', dy: -22 },
  { k: 'h2o', g: `${cap(36)}${h2oG(0, -2)}`, lab: 'H₂O', dy: 34 },
  { k: 'hp', g: `<g class="chn-g">${hring(0, 0, 12)}</g>` },
  { k: 'hco3', g: `<circle class="dk-cap" r="30"/>${hco3G(0, 0)}`, lab: 'HCO₃⁻ 1', dx: 32, dy: 7, an: 'start' },
  { k: 'pep', g: GLYPH.carbon('CCCP'), lab: 'PEP 1', dy: -22 },
  { k: 'acid', g: GLYPH.carbon('CCCC'), lab: 'C₄ acid 1', dy: -22 },
  { k: 'pi', g: GLYPH.pi() },
  { k: 'co2b', g: GLYPH.co2(), lab: 'CO₂ 1', dx: 36, dy: 6, an: 'start' },
  { k: 'pyr', g: GLYPH.carbon('CCC'), lab: 'pyruvate 1', dy: 34 },
  { k: 'atp', g: GLYPH.atp(), lab: 'ATP 1', dy: 34 },
  { k: 'amp', g: `<g class="chn-g">${tagG(0, 0, 'AMP', 'atp')}</g>` },
  { k: 'pepN', g: GLYPH.carbon('CCCP'), lab: 'PEP 1', dy: -22 },
  // the pump's cycles: 2 of each, alternating, so one can fade out while the next fades in
  { k: 'cyH0', g: `<circle class="dk-cap" r="30"/>${hco3G(0, 0)}`, lab: 'HCO₃⁻', dx: 32, dy: 7, an: 'start' },
  { k: 'cyH1', g: `<circle class="dk-cap" r="30"/>${hco3G(0, 0)}`, lab: 'HCO₃⁻', dx: 32, dy: 7, an: 'start' },
  { k: 'cyA0', g: GLYPH.carbon('CCCC'), lab: 'C₄ acid', dy: -22 },
  { k: 'cyA1', g: GLYPH.carbon('CCCC'), lab: 'C₄ acid', dy: -22 },
  ...Array.from({ length: CW_N }, (_, i): Actor => ({ k: `cw${i}`, g: GLYPH.co2() })),
];

const S = SPOT;
export const W = {
  CO2_IN: [[24, 340], [70, 340], [PORE[0], 340], ...C4.co2In.slice(0, -1), add(S.ca, [-30, -4])] as V[],
  H2O_IN: [[420, 196], [432, 150], add(S.ca, [-6, 22])] as V[],
  HP_OUT: [add(S.ca, [20, 20]), [500, 140], [520, 136]] as V[],
  HCO3_OUT: [add(S.ca, [26, -10]), S.hco3] as V[],
  HCO3_IN: [S.hco3, add(S.pepc, [8, -30])] as V[],
  PEP_IN: [S.pep, add(S.pepc, [-26, 0])] as V[],
  ACID_OUT: [add(S.pepc, [20, -10]), add(S.pepc, [52, -50])] as V[],
  PI_OUT: [add(S.pepc, [10, 24]), [566, 252], [576, 290]] as V[],
  ACID_BS: [add(S.pepc, [52, -50]), ...C4.acid.slice(1, -1), add(S.me, [0, -20])] as V[],
  CO2_ME: [add(S.me, [20, 30]), add(S.me, [26, 80]), add(S.bsRub, [12, -24])] as V[],
  PYR_OUT: [add(S.me, [-20, 14]), ...C4.pyr.slice(0, 3), C4.pyr[3]] as V[],
  PYR_BACK: [C4.pyr[3], ...C4.pyr.slice(4, -1), add(S.ppdk, [24, 10])] as V[],
  ATP_IN: [[S.granum[0] - 12, S.granum[1] - 14], [276, 420], [270, 300], S.atp, add(S.ppdk, [-24, 12])] as V[],
  AMP_OUT: [add(S.ppdk, [20, 16]), S.amp] as V[],
  PEP_BACK: [add(S.ppdk, [30, -6]), ...C4.pep.slice(1, -1), S.pep] as V[],
};

/** The stage camera of lf12m: stage = at + (p − c)·s. */
export const CAM = { s: 1.12, c: [0, 20] as V, at: [14, 8] as V };
const toPano = (q: V): V => [(q[0] - CAM.at[0]) / CAM.s + CAM.c[0], (q[1] - CAM.at[1]) / CAM.s + CAM.c[1]];
/** The crowd's places (stage px, read off a gridded crop): 4 rows between the NADP-ME label (ends y 337) and RuBisCO
 *  (starts y 417), inside the chloroplast (x 740–880), filled from RuBisCO upwards. */
const CW_STAGE: V[] = [[790, 405], [830, 405], [770, 386], [810, 386], [850, 386], [790, 367], [830, 367], [770, 348], [810, 348], [850, 348]];
const JIT: V[] = [[1, 0], [-1, 1], [0, -1], [2, 0], [-1, 1], [1, 0], [-2, -1], [1, 1], [-1, 0], [0, 1]];
export const CW_AT: V[] = CW_STAGE.map((q, i) => toPano([q[0] + JIT[i][0], q[1] + JIT[i][1]]));
/** Where NADP-ME lets each CO₂ go: right of the enzyme, clear of its name. */
const ME_OUT: V = add(S.me, [46, 32]);
export const cwWay = (i: number): V[] => { const e = CW_AT[i]; return [ME_OUT, [(ME_OUT[0] + e[0]) / 2 + 14, (ME_OUT[1] + e[1]) / 2], e]; };

/** The leaf frame of lf12m's beats 0–3 (per 1 CO₂), with keys as in lf12.ts; `fixCo2` false keeps CO₂ 1 at RuBisCO. */
export function leafBeats(a: Api, beat: number, t: number): void {
  if (beat === 0) {
    a.put('co2', t < 1.2 ? W.CO2_IN[0] : glide(W.CO2_IN, t, 1.2, 4.2), ease(t, 0.1, 0.6) * (1 - ease(t, 4.9, 5.1)));
    a.put('pep', S.pep, ease(t, 0.5, 1.0));
    a.put('h2o', glide(W.H2O_IN, t, 3.4, 4.6), ease(t, 3.3, 3.6) * (1 - ease(t, 4.9, 5.1)));
    flash(a, t, 5.0, S.ca);
    if (t > 5.0) a.put('hco3', glide(W.HCO3_OUT, t, 5.05, 6.1), ease(t, 5.0, 5.2));
    if (t > 5.0 && t < 7) a.put('hp', glide(W.HP_OUT, t, 5.05, 6.2), ease(t, 5.0, 5.2) * (1 - ease(t, 6.0, 6.6)));
    a.op('hco3-l', ease(t, 5.6, 6.0));
  }
  if (beat === 1) {
    a.put('hco3', glide(W.HCO3_IN, t, 0.4, 1.8), 1 - ease(t, 2.0, 2.2));
    a.put('pep', glide(W.PEP_IN, t, 0.4, 1.8), 1 - ease(t, 2.0, 2.2));
    flash(a, t, 2.1, S.pepc);
    if (t > 2.1) a.put('acid', glide(W.ACID_OUT, t, 2.15, 3.2), ease(t, 2.1, 2.3));
    if (t > 2.1 && t < 5) a.put('pi', glide(W.PI_OUT, t, 2.2, 3.4), ease(t, 2.1, 2.3) * (1 - ease(t, 3.6, 4.2)));
    a.op('acid-l', ease(t, 2.8, 3.2));
  }
  if (beat === 2) {
    a.put('acid', glide(W.ACID_BS, t, 0.3, 3.4), 1 - ease(t, 3.6, 3.8));
    flash(a, t, 3.7, S.me);
    if (t > 3.7) a.put('pyr', glide(W.PYR_OUT, t, 3.8, 5.6), ease(t, 3.7, 3.9));
    a.op('pyr-l', ease(t, 4.6, 5.0));
  }
  if (beat === 3) {
    a.put('pyr', glide(W.PYR_BACK, t, 0.3, 3.2), 1 - ease(t, 3.8, 4.0));
    a.put('atp', glide(W.ATP_IN, t, 1.6, 3.6), ease(t, 1.5, 1.8) * (1 - ease(t, 3.8, 4.0)));
    flash(a, t, 3.9, S.ppdk);
    if (t > 3.9) {
      a.put('amp', glide(W.AMP_OUT, t, 4.0, 5.0), ease(t, 3.9, 4.1));
      a.put('pepN', glide(W.PEP_BACK, t, 4.0, 5.8), ease(t, 3.9, 4.1));
    }
    a.op('pepN-l', ease(t, 4.8, 5.2)); a.op('pyr-l', 1 - ease(t, 2.4, 2.8));
  }
}

/* ---------------------------------------------------------------- the pump's cycles */

/** One cycle: [meso] HCO₃⁻ fades in (h0) and glides to PEPC (hm); HCO₃⁻ → C₄ acid at PEPC, or the acid fades in there
 *  (x1); the acid glides to NADP-ME (am); the acid fades as its CO₂ appears and glides to its place (x2, over FD). */
export interface Cy { h0: number; hm: [number, number]; x1: number; am: [number, number]; x2: number }
/** Cycles one after the other from t0; the next one's first fade starts while the last CO₂ glides (a fade, not a move). */
export function plan(t0: number, specs: Array<{ gh?: number; ga: number }>, meso: boolean): { cy: Cy[]; end: number } {
  const cy: Cy[] = [];
  let s = t0;
  for (const p of specs) {
    const gh = p.gh ?? 0.6, hm: [number, number] = [s + FD, gh], x1 = meso ? s + FD + gh : s, am: [number, number] = [x1 + FD, p.ga], x2 = am[0] + p.ga;
    cy.push({ h0: s, hm, x1, am, x2 });
    s = x2 + 0.1;
  }
  return { cy, end: cy[cy.length - 1].x2 + FD };
}
/** Draws the cycles at t; cycle i's CO₂ goes to crowd place first + i; returns how many have reached their place. */
export function drawCycles(a: Api, t: number, cy: Cy[], first: number, meso: boolean): number {
  let n = 0;
  cy.forEach((c, i) => {
    const h = `cyH${i % 2}`, ac = `cyA${i % 2}`;
    if (meso && t >= c.h0 && t < c.x1 + FD) {
      a.put(h, t < c.hm[0] ? S.hco3 : glide(W.HCO3_IN, t, c.hm[0], c.hm[0] + c.hm[1]), ease(t, c.h0, c.h0 + FD) * (1 - ease(t, c.x1, c.x1 + FD)));
    }
    if (t >= c.x1 && t < c.x2 + FD) {
      const at = meso && t < c.am[0] ? add(S.pepc, [20, -10]) : glide(meso ? [add(S.pepc, [20, -10]), ...W.ACID_BS] : W.ACID_BS, t, c.am[0], c.am[0] + c.am[1]);
      a.put(ac, at, ease(t, c.x1, c.x1 + FD) * (1 - ease(t, c.x2, c.x2 + FD)));
    }
    if (t >= c.x2) a.put(`cw${first + i}`, glide(cwWay(first + i), t, c.x2, c.x2 + FD), ease(t, c.x2, c.x2 + FD), CW_SC);
    if (t >= c.x2 + 0.75 * FD) n++;
  });
  return n;
}
/** Holds the crowd places 0 … n−1 still. */
export const holdCrowd = (a: Api, n: number, o = 1): void => { for (let i = 0; i < n; i++) a.put(`cw${i}`, CW_AT[i], o, CW_SC); };

/* ---------------------------------------------------------------- the comparison (c4-b.ts, its stage units) */

const P = 'c4x', KR = 7, RM = 142;
const CX = 1146, C3: V = [CX, 158], C4C: V = [CX, 466];
const PH = { x: 1330, w: 256, k: 0.256, y3: 46, y4: 356 };
const ph = (y0: number, q: V): V => [PH.x + q[0] * PH.k, y0 + q[1] * PH.k];
const MT3: V = [1084, 180], CP3: V = [1098, 72], W3 = 1176;
const band = (a0: number, b0: number, c: V, cls: string): string => `<rect class="${cls}" x="${f(a0)}" y="${f(c[1] - RM)}" width="${f(b0 - a0)}" height="${2 * RM}"/>`;
const fibres = (x: number, c: V): string => Array.from({ length: 12 }, (_, i) => {
  const y = c[1] - RM + 6 + i * 25;
  return `<path class="co2k-fib" d="M${f(x + (i % 3) * 4)},${f(y)}q4,7 0,14t0,14"/>`;
}).join('');
const pmV = (x: number, y0: number, y1: number): string => bilayer([{ L: [x, y0, x, y1] }], 5, 1.4, 3.8);
const granum = (x: number, y: number, w: number, n: number): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 7.5)}" width="${f(w)}" height="5" rx="2.5" style="stroke:#9fbf6e;stroke-width:1.1"/>`).join('');
function mitoM(c: V, rx: number, ry: number, gw: number): string {
  return `<ellipse class="cel-matrix" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}"/>${bilayerE(c[0], c[1], rx, ry, 5)}${bilayerE(c[0], c[1], rx - 16, ry - 14, 5)}
    <image href="${gdcPng}" x="${f(c[0] - gw / 2)}" y="${f(c[1] - (gw * 222) / 302 / 2)}" width="${gw}" height="${f((gw * 222) / 302)}"/>`;
}
function chloroM(c: V, rx: number, ry: number, rw: number): string {
  return `<ellipse class="co2k-strm" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}"/>${granum(c[0] - 30, c[1] - 6, 14, 2)}${granum(c[0] + 30, c[1] - 6, 14, 2)}
    ${bilayerE(c[0], c[1], rx, ry, 4)}${bilayerE(c[0], c[1], rx + 8, ry + 8, 4)}
    <image href="${rubPng}" x="${f(c[0] - rw / 2)}" y="${f(c[1] - (rw * 471) / 548 / 2)}" width="${rw}" height="${f((rw * 471) / 548)}"/>`;
}
const lab = (x: number, y: number, s: string, an: Anchor = 'middle'): string => T(x, y, s, 'co2k-il cel-halo', an);
function mag3(): string {
  return `${band(CX - RM, W3, C3, 'co2k-cyt')}${band(W3, W3 + 16, C3, 'co2k-wallb')}${band(W3 + 16, CX + RM, C3, 'co2k-ias')}
    ${fibres(W3 + 4, C3)}${pmV(W3 - 6, C3[1] - RM, C3[1] + RM)}${chloroM(CP3, 46, 20, 34)}${mitoM(MT3, 64, 44, 44)}
    ${lab(MT3[0] + 16, 250, 'mitochondrion')}${lab(CP3[0] + 6, 124, 'chloroplast')}${lab(1236, 126, 'air space')}`;
}
interface Photo { y: number; href: string; ring: [number, number, number, number]; bs: V; ms: V; lens: V; lr: number }
const PH3: Photo = { y: PH.y3, href: steJpg, ring: [478, 360, 305, 345], bs: [480, 655], ms: [170, 165], lens: [110, 330], lr: 55 };
const ZM4: Zm = { c: C4C, rm: RM, zs: 0.9, kr: KR };
const PH4: Photo = { y: PH.y4, href: zeaJpg, ring: [517, 382, 252, 210], bs: [200, 640], ms: [820, 80], lens: ZC, lr: RM / ZM4.zs };
function photo(k: string, p: Photo): string {
  const [cx, cy] = ph(p.y, [p.ring[0], p.ring[1]]), H = 740 * PH.k;
  return `<image href="${p.href}" x="${PH.x}" y="${p.y}" width="${PH.w}" height="${f(H)}" preserveAspectRatio="none"/>
    <rect x="${PH.x}" y="${p.y}" width="${PH.w}" height="${f(H)}" style="fill:none;stroke:#bdb9ad;stroke-width:1"/>
    <g data-k="${P}-bs${k}" opacity="0"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(p.ring[2] * PH.k)}" ry="${f(p.ring[3] * PH.k)}" style="fill:none;stroke:#2f6f5f;stroke-width:2;stroke-dasharray:6 4"/></g>`;
}
const photoNames = (k: string, p: Photo): string => {
  const bs = ph(p.y, p.bs), ms = ph(p.y, p.ms);
  return `<g data-k="${P}-bsn${k}" opacity="0">${T(bs[0], bs[1], 'bundle sheath', 'co2k-zl cel-halo', 'middle', ' style="font-size:16px"')}</g>
    <g data-k="${P}-ms${k}" opacity="0">${T(ms[0], ms[1], 'mesophyll', 'co2k-zl cel-halo', 'middle', ' style="font-size:16px"')}</g>`;
};
const leaderL = (from: V, to: V[]): string => {
  const d = to.map(p => `M${f(from[0])},${f(from[1])}L${f(p[0])},${f(p[1])}`).join(''), LD = 'fill:none;stroke-linecap:round';
  return `<path d="${d}" style="${LD};stroke:#fffdf8;stroke-width:4;opacity:.9"/><path d="${d}" style="${LD};stroke:#141413;stroke-width:1.5"/>`
    + to.map(q => `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="2.4" style="fill:#141413;stroke:#fffdf8;stroke-width:1.2"/>`).join('');
};
const VS_AT: V = [1458, 561];
const vsSvg = (): string => `<g data-k="${P}-vs" opacity="0">${leaderL([1446, 549], [ph(PH.y4, [405, 548])])}
  ${T(VS_AT[0], VS_AT[1], 'bundle-sheath cells,', 'co2k-il cel-halo', 'middle', ' style="font-size:15px"')}
  ${T(VS_AT[0], VS_AT[1] + 16, 'full of chloroplasts', 'co2k-il cel-halo', 'middle', ' style="font-size:15px"')}</g>`;
const PILL3: V = [1458, 268], PILL4: V = [1458, 597];
const TL4 = c4Labels(ZM4, { vein: [985, 452], bs: [1022, 338], cp: [985, 604], ms: [1270, 340], pepc: [1251, 503], rub: [1140, 482] });

/** C₃: 4 CO₂ from photorespiration leave the mitochondrion one at a time; 3 escape to the air space, 1 is caught. */
const out3 = (at: V): number => Math.min(1, Math.max(0, (at[0] - W3 - 20) / 30));
const runs3 = (t3: number): Run[] => [
  { p: walk([[1078, 176], [1122, 198], [1100, 160], [1148, 186], [1188, 176], [1226, 172], [1282, 176]], 31), t0: t3, end: 'out', glad: out3 },
  { p: walk([[1090, 184], [1128, 206], [1056, 200], [1044, 150], [1032, 118], [1062, 98]], 47), t0: t3 + STEP, end: 'caught', glad: () => 0, fl: CP3 },
  { p: walk([[1080, 188], [1056, 204], [1130, 212], [1150, 196], [1190, 210], [1232, 220], [1276, 218]], 59), t0: t3 + 2 * STEP, end: 'out', glad: out3 },
  { p: walk([[1088, 174], [1120, 160], [1064, 186], [1146, 176], [1192, 190], [1236, 196], [1282, 190]], 73), t0: t3 + 3 * STEP, end: 'out', glad: out3 },
];
/** C₄: the crowd round RuBisCO (maize-photo pixels): c4b's 4 places and 4 more on and beside the chloroplast band. */
const CROWD_PX: V[] = [[690, 318], [718, 346], [718, 436], [690, 462], [660, 300], [752, 380], [756, 414], [640, 476]];
const LEAK_I = 3, LABEL_I = 5;
const LEAK_PX: V[] = [[690, 462], [712, 452], [700, 470], [728, 472], [748, 478], [764, 474], [784, 486], [800, 498]];

/** The comparison's times (s into its beat): the leaf out, the panels in by parts (hold), C₃ (hold), C₄, the end. */
export function cmpTimes(t0: number): { out: number; card: number; ring: number; lens: number; mag: number; tl: number; h1: number; t3: number; p3: number; h2: number; crowd: number; leak: number; p4: number; glow: number; end: number } {
  const out = t0, card = out + 0.8, ring = card + 1.0, lens = ring + 0.9, mag = lens + 0.9, tl = mag + 0.9, h1 = tl + FD + 0.1;
  const t3 = h1 + 0.2, p3 = catchT(runs3(t3)[3]) + 0.2, h2 = p3 + FD + 0.1;
  const crowd = h2 + 0.2, leak = crowd + 1.0 + 0.2, p4 = leak + 1.8 + 0.2, glow = p4 + FD + 0.1;
  return { out, card, ring, lens, mag, tl, h1, t3, p3, h2, crowd, leak, p4, glow, end: glow + FD };
}

/** The 2 panels' markup in c4b's stage units; each panel is placed by its transform (tf3, tf4). */
export function cmpSvg(tf3: string, tf4: string): string {
  const L3 = ph(PH3.y, PH3.lens), L4 = ph(PH4.y, PH4.lens);
  const kid = (k: string): string => kidG(`${P}-${k}`, KR, 'CO₂', -KR - 7).replace('co2k-kl"', 'co2k-kl" style="font-size:14px"');
  const fl = (k: string): string => `<g data-k="${P}-${k}" opacity="0">${flashG(P, 22)}</g>`;
  const p3 = `<g data-k="${P}-pn3" opacity="0">${cardSvg(966, 4, 628, 302)}${photo('3', PH3)}
    ${T(PH.x + PH.w / 2, 36, 'C₃ leaf', 'co2k-zl', 'middle', ' style="font-size:24px"')}</g>
    ${magnifier(P, 'm3', C3, RM, L3, PH3.lr * PH.k, mag3())}${photoNames('3', PH3)}${fl('fl3')}
    ${[0, 1, 2, 3].map(i => kid(`a${i}`)).join('')}${pill(P, 'p3', PILL3, 'C₃: about 1 in 4 recaptured', '#b0431f')}`;
  const p4 = `<g data-k="${P}-pn4" opacity="0">${cardSvg(966, 314, 628, 302)}${photo('4', PH4)}
    ${T(PH.x + PH.w / 2, 346, 'C₄ leaf (maize)', 'co2k-zl', 'middle', ' style="font-size:24px"')}</g>
    ${magnifier(P, 'm4', C4C, RM, L4, PH4.lr * PH.k, magC4(P, ZM4))}${photoNames('4', PH4)}${vsSvg()}
    ${TL4.map(l => labSvg(P, l)).join('')}${hudMover('o2b', o2B, 'O₂', -24, 0.62, 14)}
    ${CROWD_PX.map((_, i) => kid(`c${i}`)).join('')}${pill(P, 'p4', PILL4, 'C₄: CO₂ concentrated at RuBisCO', '#2f6f5f')}`;
  return `<defs>${flashDefs(P)}</defs><g class="fig dk2 co2k"><g transform="${tf3}">${p3}</g><g transform="${tf4}">${p4}</g>
    <g data-k="${P}-cr" opacity="0">${T(8, 734, '<tspan font-style="italic">Steinchisma laxum</tspan> (C₃): Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0) · maize (C₄): Berkshire Community College Bioscience Image Library (CC0)', 'co2k-cr', 'start')}
    ${T(1592, 734, 'RuBisCO: PDB 8RUC · PEPC: PDB 3ZGE · mitochondrial protein: PDB 4LHC', 'co2k-cr', 'end')}</g></g>`;
}
/** Fits the pills to their text, once the stage is in the page. */
export function cmpBind(stage: SVGSVGElement): void {
  const A = (k: string, at: string, v: string | number): void => { stage.querySelector(`[data-k="${k}"]`)?.setAttribute(at, String(v)); };
  fitPills(stage, A, P, [['p3', PILL3], ['p4', PILL4]]);
}
/** One CO₂ character at q (hidden when q is undefined), its label on or off. */
function kidSet(a: Api, key: string, q: Kid | undefined, label: boolean): void {
  if (!q || q.o < 0.004) return;
  a.put(key, q.at, q.o);
  const s = q.s ?? 0, h = q.h ?? 0;
  a.attr(`${key}-fn`, 'opacity', f(Math.max(0, 1 - s - h))); a.attr(`${key}-fs`, 'opacity', f(s)); a.attr(`${key}-fh`, 'opacity', f(h));
  a.attr(`${key}-sw`, 'opacity', f(q.sweat ?? 0)); a.attr(`${key}-sh`, 'opacity', '0'); a.attr(`${key}-l`, 'opacity', label ? '1' : '0');
}
/** The comparison at t (s into its beat; times from cmpTimes); `on` false hides it (other beats). */
export function cmpFrame(a: Api, on: boolean, t: number, C: ReturnType<typeof cmpTimes>): void {
  const v = (t0: number): number => (on ? ease(t, t0, t0 + FD + 0.1) : 0);
  for (const k of ['pn3', 'pn4', 'cr']) a.op(`${P}-${k}`, v(C.card));
  for (const k of ['3', '4']) { a.op(`${P}-bs${k}`, v(C.ring)); a.op(`${P}-bsn${k}`, v(C.ring)); a.op(`${P}-ms${k}`, v(C.ring)); }
  a.op(`${P}-vs`, v(C.ring));
  for (const k of ['m3l', 'm4l']) a.op(`${P}-${k}`, v(C.lens));
  for (const k of ['m3', 'm4']) a.op(`${P}-${k}`, v(C.mag));
  TL4.forEach(l => a.op(`${P}-t-${l.k}`, v(C.tl)));
  a.op(`${P}-p3`, v(C.p3)); a.op(`${P}-p4`, v(C.p4)); a.op(`${P}-glow`, v(C.glow));
  if (!on) { a.op(`${P}-fl3`, 0); a.op(`${P}-fl4`, 0); a.op('m-o2b', 0); return; }
  // C₃
  const R3 = runs3(C.t3);
  // one meaning per face, deck-wide (lecturer, lecture day): C₃'s escaped CO₂ glad, the refixed one neutral (just fixed);
  // C₄'s crowd trapped in the bundle sheath, strained and sweating; none leaks out (lecturer, lecture day: "do not put any CO₂
  // outside the bundle sheath; we don't need to explain the leakiness")
  R3.forEach((r, i) => { const q = kidOf(r, t); kidSet(a, `${P}-a${i}`, q && { ...q, s: 0 }, true); });
  const f3 = flashOf(R3, t);
  a.op(`${P}-fl3`, f3.o); if (f3.o > 0) a.attr(`${P}-fl3`, 'transform', `translate(${f(f3.at[0])} ${f(f3.at[1])})`);
  a.op(`${P}-fl4`, 0);
  // C₄: the crowd fades in at once, with one O₂ beside it, and stays
  const z = zmap(ZM4), co = ease(t, C.crowd, C.crowd + 1.0);
  CROWD_PX.forEach((p, i) => kidSet(a, `${P}-c${i}`, { at: z(p[0], p[1]), o: co, s: 1, sweat: 1 }, i === LABEL_I));
  const o2 = z(O2_PX[0], O2_PX[1]);
  a.op('m-o2b', co); if (co > 0.004) a.attr('m-o2b', 'transform', `translate(${f(o2[0])} ${f(o2[1])})`);
}

/* ---------------------------------------------------------------- this staging */

const nk = (k: string, s: string): string => `<tspan data-k="${k}">${s}</tspan>`;
export const ROWS: Row[] = [
  { k: 'r0', h: 36, html: 'per 1 CO₂', cls: 'dk-ph' },
  { k: 'r1', h: 36, html: '<tspan class="lfa-e">CA:</tspan> CO₂ + H₂O → HCO₃⁻ + H⁺' },
  { k: 'r2', h: 36, html: '<tspan class="lfa-e">PEPC:</tspan> HCO₃⁻ + PEP → C₄ acid + Pᵢ' },
  { k: 'r2c', h: 32, html: '1 C + 3 C = 4 C', cls: 'dk-pc' },
  { k: 'r3', h: 36, html: '<tspan class="lfa-e">NADP-ME:</tspan> C₄ acid → CO₂ + pyruvate' },
  { k: 'r3c', h: 32, html: '4 C = 1 C + 3 C', cls: 'dk-pc' },
  { k: 'r4', h: 36, html: '<tspan class="lfa-e">PPDK:</tspan> pyruvate + ATP + Pᵢ → PEP + AMP + PPᵢ' },
  { k: 'r4c', h: 32, html: `ATP → AMP: ${nk('n-atp', '2')} ATP equivalents`, cls: 'dk-pc' },
  { k: 'r5', h: 40, html: 'C₄: 5 ATP + 2 NADPH per CO₂', cls: 'lfa-sum' },
  { k: 'r6', h: 36, html: 'C₃: 3 ATP + 2 NADPH per CO₂', cls: 'dk-pc' },
];
export const LEDGER = { x: 1060, y: 22, w: 528 };
/** The 2 compartments' names in ink, where the drawing's grey zone names were (hidden in bind), and the crowd's count
 *  and label in the bundle-sheath cell (stage units). */
export function namesSvg(size: number): string {
  return `<g data-k="nm" display="none">${T(474, 692, 'mesophyll cell', 'c4m-name', 'middle', ` style="font-size:${size}px"`)}${T(849, 692, 'bundle-sheath cell', 'c4m-name', 'middle', ` style="font-size:${size}px"`)}</g>`;
}
export const CNT_AT: V = [948, 482];
export const crowdSvg = (): string => `<g data-k="cnt" display="none"><text data-k="cnt-t" class="c4m-lab" x="${CNT_AT[0]}" y="${CNT_AT[1]}" text-anchor="middle">1 CO₂</text></g>
  <g data-k="conc" display="none">${T(850, 566, 'CO₂ concentrated', 'c4m-lab', 'middle')}${T(850, 590, '(≈ 10 × the air)', 'c4m-lab2', 'middle')}</g>`;
export const STYLE = `<style>.c4m-name{font:600 28px "IBM Plex Sans",sans-serif;fill:#1F2A3A;letter-spacing:.01em}
  .c4m-lab{font:700 20px "IBM Plex Sans",sans-serif;fill:#141413;paint-order:stroke;stroke:#fbf9f2;stroke-width:4px;stroke-linejoin:round}
  .c4m-lab2{font:600 18px "IBM Plex Sans",sans-serif;fill:#3F4A5A;paint-order:stroke;stroke:#fbf9f2;stroke-width:4px;stroke-linejoin:round}</style>`;
/** Hides the drawing's own grey names of the 2 cells (the ink ones replace them). */
export function hideZoneNames(stage: SVGSVGElement): void {
  stage.querySelectorAll('text.cel-zone').forEach(el => { if (/^(mesophyll cell|bundle-sheath cell)$/.test(el.textContent ?? '')) (el as SVGElement).style.display = 'none'; });
}

const CY = plan(1.0, [{ ga: 1.4 }, { ga: 1.4 }, ...Array.from({ length: 8 }, () => ({ ga: 0.9 }))], false);
const HOLD4 = CY.cy[1].x2 + FD + 0.1, CONC = CY.end + 0.2;
const CMP = cmpTimes(0.2);

function frame(a: Api, beat: number, t: number): void {
  leafBeats(a, beat, t);
  if (beat === 2) {
    if (t > 3.7) a.put('co2b', glide(W.CO2_ME, t, 3.8, 5.2), ease(t, 3.7, 3.9) * (1 - ease(t, 5.4, 6.2)));
    a.op('co2b-l', ease(t, 4.5, 4.9));
    flash(a, t, 5.5, S.bsRub, 'fl2');
  }
  // the end of beat 3: PEP 1 back, AMP; in beat 4 they fade, the pump runs
  if (beat >= 4) {
    const o = beat === 4 ? 1 - ease(t, 0.2, 1.0) : 0;
    if (o > 0.004) { a.put('pepN', S.pep, o); a.put('amp', S.amp, o); }
  }
  let n = 0;
  if (beat === 4) n = drawCycles(a, t, CY.cy, 0, false);
  if (beat === 5) { n = CW_N; holdCrowd(a, CW_N); }
  a.op('cnt', n > 0 ? 1 : 0);
  a.txt('cnt-t', `${n} CO₂`);
  a.op('conc', beat === 4 ? ease(t, CONC, CONC + FD + 0.1) : beat === 5 ? 1 : 0);
  // the ledger
  const v = (b: number, t0: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t0 + 0.4) : 0);
  panelShow(a, 'panel', ROWS, { r0: v(0, 0.2), r1: v(0, 5.0), r2: v(1, 2.1), r2c: v(1, 2.6), r3: v(2, 3.7), r3c: v(2, 4.2), r4: v(3, 3.9), r4c: v(3, 4.4), r5: v(3, 5.6), r6: v(3, 6.0) });
  // the names; in the last beat the leaf, its names and the ledger fade out and the comparison comes in
  const out = beat === 5 ? 1 - ease(t, CMP.out, CMP.out + 1.0) : 1;
  a.op('nm', out); a.op('cam', out); a.op('panel', out);
  if (beat === 5) { a.op('cnt', out); a.op('conc', out); }
  cmpFrame(a, beat === 5, t, CMP);
}

const LIT: LPart[][] = [
  ['stoma', 'c4-co2', 'ca'],
  ['ca', 'hco3', 'pepc'],
  ['pepc', 'c4acid', 'bs-cp', 'me', 'me-co2', 'bs-rub'],
  ['m-cp', 'pyr', 'ppdk', 'atp', 'pep', 'pepc', 'me', 'bs-cp', 'bs-rub'],
  ['m-cp', 'pepc', 'c4acid', 'me', 'bs-cp', 'bs-rub'],
  ['m-cp', 'pepc', 'c4acid', 'me', 'bs-cp', 'bs-rub'],
];

const BASE = makeLeafStaging({
  id: 'c4m1',
  name: 'c4m1 · lf12m, then CO₂ concentrated in the bundle sheath, then C₃ vs C₄ on real images',
  note: 'lf12m’s 4 steps per 1 CO₂ with the 2 cells named; the pump keeps running: 10 C₄ acids one after another release CO₂ round bundle-sheath RuBisCO (count 1 → 10), “CO₂ concentrated (≈ 10 × the air)”; then c4b’s 2 magnifier panels on the micrographs, stacked in the centre: C₃ 3 of 4 CO₂ escape, C₄ crowded at RuBisCO, one leaks; the CAM question',
  beats: C4M1,
  holds: [[], [], [], [], [HOLD4], [CMP.h1, CMP.h2]],
  leaf: { hide: ['m-rub', 'm-perox', 'm-mito'] },
  actors: LEAF_ACTORS,
  hud: () => `${STYLE}${namesSvg(28)}${crowdSvg()}${panelSvg('panel', LEDGER.x, LEDGER.y, LEDGER.w, ROWS)}${cmpSvg('translate(-480 0)', 'translate(-480 0)')}`,
  cam: CAM,
  lit: LIT,
  frame,
});

export const STAGING: Staging = {
  ...BASE,
  bind(stage) { const draw = BASE.bind(stage); hideZoneNames(stage); cmpBind(stage); return draw; },
  keys: [
    { beat: 5, text: 'What if one cell did both steps,', x: 800, y: 656, size: 44 },
    { beat: 5, text: 'at different times?', x: 800, y: 704, size: 44 },
  ],
};
