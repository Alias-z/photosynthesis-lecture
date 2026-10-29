// 'eff', staging s · "Sunlight to biomass" (slide C4e · Efficiency of photosynthesis; beats-eff.ts; EFFICIENCY_BRIEF.md,
// lecturer, 29 Oct 2026). One fixed framing, ≈ 21 s in all. 100 % of the solar energy on a C₃ leaf is a band that runs left
// to right; at each step its share of the energy peels off the bottom, turns down and is labelled (name, % of the solar
// energy), and what is left is written over the band. Values: figs/ce04e.ts STEPS (Zhu, Long & Ort 2008, Fig. 1; 2010).
// - Beat 1 (≈ 4 s): the band of 100 runs in; 51.3 outside 400–700 nm peels off; 48.7 left.
// - Beat 2 (≈ 5 s): 4.9 reflected and transmitted, 6.6 photochemical inefficiency; 43.8, 37.2 left.
// - Beat 3 (≈ 4 s): 24.6 carbohydrate synthesis; 12.6 left.
// - Beat 4 (≈ 7 s): 6.1 photorespiration (rust), 1.9 respiration; the last 4.6 flows into biomass, shown as sugar.
import '../figs/ce04e.css';
import { metab, row } from '../figs/carbon-form';
import { fmt, left, peel, sankey, STEPS } from '../figs/ce04e';
import {
  AMBER, AT, bandPath, by, curlSvg, labelAt, LABELS, labelSvg, PAR, IR, RED, scene, sceneBody, X0 as SX0, X_AMB, X_RED, XEND as SXEND,
  type Curl, type LossKey, type Pt,
} from '../figs/ce04e-scene';
import { breadG } from '../figs/grain';
import { EFF, EFF_V1 } from './beats-eff';
import type { Staging } from './types';

const f = (v: number): string => (Math.round(v * 100) / 100).toString();
const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * (3 - 2 * u); };
const T = (x: number, y: number, s: string, cls: string, a = 'middle'): string => `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

/* ---------------------------------------------------------------- the band (stage units) */

const TOP = 110, K = 4.3, X0 = 70, XE = 1400, Y_END = 588, RI = 36;
const XS = [170, 568, 764, 958, 1188, 1320];
const L = left('c3'), P = sankey(XS, TOP, K, 'c3', RI);
/** The band's outline: full height until the first step, then as thick as what is left. */
const BAND = `M${X0},${TOP}H${XE}V${f(TOP + L[6] * K)}${P.map((q, i) => `H${f(q.x)}V${f(TOP + L[i] * K)}`).reverse().join('')}H${X0}Z`;
/** Where the band's front is at each beat's start and end, and when each peel runs (beat, start, end). */
const FRONT: Array<[number, number]> = [[X0, 560], [560, 950], [950, 1180], [1180, XE + 30]];
const FRONT_T: Array<[number, number]> = [[0.2, 2.0], [0.2, 2.8], [0.2, 1.6], [0.2, 3.4]];
const frontAt = (beat: number, t: number): number => { const [a, b] = FRONT[beat], [t0, t1] = FRONT_T[beat]; return a + (b - a) * ease(t, t0, t1); };
/** The beat in which the front sweeps past x, and the time it gets there. */
function passes(x: number): [number, number] {
  const beat = FRONT.findIndex(([a, b]) => x >= a && x < b);
  let t = 0;
  while (t < 10 && frontAt(beat, t) < x) t += 0.01;
  return [beat, t];
}
/** Each peel: the curve is uncovered by the front as it sweeps past; then the slice runs down (1 s) and is labelled. */
const PEEL_AT: Array<[number, number, number]> = P.map(q => { const [b, t] = passes(q.x + RI + (q.yB - q.yA)); return [b, t - 0.05, t + 0.95]; });
const BIO_T: [number, number] = [3.4, 4.2];

/** Segment centres over the band, for what is left: 100 before the first step, then after each. */
const LEFT_X = [X0 + (XS[0] - X0) / 2, ...XS.map((x, i) => (i < 5 ? (x + 40 + XS[i + 1]) / 2 : (x + 30 + XE) / 2))];

function svg(): string {
  const peels = P.map((q, i) => `<clipPath id="efp${i}"><rect data-k="pc${i}" x="${f(q.x - 2)}" y="${f(TOP)}" width="${f(RI + q.yB - q.yA + 6)}" height="0"/></clipPath>
    <path clip-path="url(#efp${i})" class="${STEPS[i].k === 'pr' ? 'ef-loss-pr' : 'ef-loss'}" d="${peel(q.x, q.yA, q.yB, Y_END, RI)}"/>`).join('');
  const feet = P.map((q, i) => `<g data-k="pl${i}" display="none">${T(q.foot, Y_END + 30, STEPS[i].two[0], 'ef-a-name')}${STEPS[i].two[1] ? T(q.foot, Y_END + 54, STEPS[i].two[1], 'ef-a-name') : ''}
    ${T(q.foot, Y_END + 90, fmt(STEPS[i].c3), STEPS[i].k === 'pr' ? 'ef-a-valp' : 'ef-a-val')}</g>`).join('');
  const lefts = LEFT_X.map((x, i) => `<g data-k="lf${i}" display="none">${T(x, TOP - 16, i === 0 ? '100' : fmt(L[i]), i === 0 ? 'ef-a-h' : 'ef-a-left')}</g>`).join('');
  const hB = L[6] * K, yB = TOP + hB / 2;
  const bio = `<g data-k="bio" display="none"><path class="ef-bio" d="M${XE},${f(TOP - 8)}L${XE + 30},${f(yB)}L${XE},${f(TOP + hB + 8)}Z"/>
    ${T(XE + 46, TOP + 8, 'biomass', 'ef-a-h', 'start')}${T(XE + 46, TOP + 62, '4.6', 'ef-a-big', 'start')}
    <g class="chn-g">${metab(XE + 46, TOP + 104, 'hexose', { r: 10, anchor: 'start' })}</g>${T(XE + 46, TOP + 138, 'sugar', 'ef-a-unit', 'start')}</g>`;
  return `<g class="fig ef-anim">
    <clipPath id="efband"><rect data-k="bc" x="0" y="0" width="0" height="740"/></clipPath>
    <path clip-path="url(#efband)" class="ef-sun" d="${BAND}" style="opacity:.88"/>
    <g clip-path="url(#efband)">${peels}</g>${bio}${lefts}${feet}
    <g data-k="hd" display="none">${T(X0, TOP + 34, 'sunlight on the leaf', 'ef-a-h', 'start')}${T(X0, TOP + 60, '% of the solar energy', 'ef-a-unit', 'start')}</g>
  </g>`;
}

function bind(stage: SVGSVGElement): (beat: number, t: number) => void {
  const els = new Map<string, Element>();
  stage.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
  const cache = new Map<string, string>();
  const set = (k: string, a: string, v: string): void => { const key = `${k}|${a}`; if (cache.get(key) === v) return; cache.set(key, v); els.get(k)?.setAttribute(a, v); };
  const op = (k: string, v: number): void => { set(k, 'display', v < 0.004 ? 'none' : 'inline'); set(k, 'opacity', v >= 0.996 ? '1' : v.toFixed(3)); };
  return (beat, t) => {
    // the band's front: earlier beats done, this beat's run eased
    set('bc', 'width', f(frontAt(beat, t)));
    op('hd', beat === 0 ? ease(t, 0.3, 0.8) : 1);
    op('lf0', beat === 0 ? ease(t, 0.2, 0.6) : 1);
    P.forEach((q, i) => {
      const [pb, p0, p1] = PEEL_AT[i], u = beat > pb ? 1 : beat < pb ? 0 : ease(t, p0, p1);
      const y0 = q.yB + RI - TOP;
      set(`pc${i}`, 'height', f(y0 + (Y_END - TOP + 4 - y0) * u));
      op(`pl${i}`, beat > pb ? 1 : beat < pb ? 0 : ease(t, p1 - 0.3, p1 + 0.2));
      op(`lf${i + 1}`, beat > pb ? 1 : beat < pb ? 0 : ease(t, p1 - 0.1, p1 + 0.4));
    });
    op('bio', beat === 3 ? ease(t, BIO_T[0], BIO_T[1]) : 0);
  };
}

/** Version 1 (unlisted): the band of v1's figure e2. */
export const STAGING_V1: Staging = {
  id: 's',
  name: 's · Sunlight to biomass, one band',
  note: '100 % of the solar energy on a C₃ leaf as one band; each minimum loss peels off in order with its share (Zhu et al. 2008, 2010): 51.3 outside 400–700 nm, 4.9 reflected and transmitted, 6.6 photochemical inefficiency, 24.6 carbohydrate synthesis, 6.1 photorespiration, 1.9 respiration; 4.6 left in biomass',
  beats: EFF_V1,
  svg,
  bind,
};


/* ================================================================ version 2: the journey of sunlight through a leaf */
// 'eff', staging j · "The journey of sunlight" (EFFICIENCY_V2_BRIEF.md, lecturer, 29 Oct 2026). The f1 scene of the slide
// (figs/ce04e-scene.ts) at 1.2 × on the stage, one fixed framing, no zoom, ≈ 24 s. The beam is a flow of photon particles
// coloured by wavelength, in lanes across the band; at each place the lanes that are lost peel away along their curl with
// an eased drift and fade, and the label fades in; under the bread a running readout of the energy left counts down
// 100 → 48.7 → 43.8 → 37.2 → 12.6 → 6.5 → 4.6. Particles are a pure function of the beat and its time: the flow runs on one
// clock across beats (each beat's nominal start), so it never jumps.
// - Beat 1: the band runs in from the sun; UV and infrared lanes peel off (51.3).
// - Beat 2: at the leaf surface 2 thin green curls, reflected and transmitted (4.9).
// - Beat 3: in the thylakoid the lanes turn red (blue ones shrink to the red size) and a heat curl leaves (6.6), with a shimmer.
// - Beat 4: in the stroma the cycle lights, most of the band leaves as heat (24.6), sugar rides on.
// - Beat 5: RuBisCO with O₂ (6.1, rust), the mitochondrion (1.9); the bread appears over 4.6.
// OY: the scene sits 20 below its first place, so the closing question has a free band across the top
const S2 = 1.2, OX = 318, OY = 4;
const SC = scene(), B2 = SC.B, CURLS = SC.curls;
const BEAT_T = [0, 4.6, 8.8, 13.4, 18.6];
/** The last beat's flow slows to a halt once its motion is done (bread at 4.2 s), so the stage comes to rest and the
 *  closing question can follow (player.ts waits for the stage to stop changing): its speed eases from 1 to 0. */
const STOP: [number, number] = [4.2, 6.0];
const flowT = (beat: number, t: number): number => {
  if (beat !== 4 || t <= STOP[0]) return t;
  const u = Math.min(1, (t - STOP[0]) / (STOP[1] - STOP[0]));
  return STOP[0] + (STOP[1] - STOP[0]) * (u - u * u * u + (u * u * u * u) / 2);
};
/** The band's front (scene x) and when each part shows, per beat (seconds into the beat). */
const FRONT2: Array<[number, number, number, number]> = [[SX0, 200, 0.2, 2.2], [200, 300, 0.2, 1.6], [300, 412, 0.2, 1.8], [412, 592, 0.2, 2.4], [592, SXEND + 24, 0.2, 2.8]];
const CURL_T: Record<LossKey, [number, number, number]> = {
  uv: [0, 1.0, 2.6], ir: [0, 1.0, 2.8], refl: [1, 0.4, 1.8], trans: [1, 0.8, 2.2], photo: [2, 0.7, 2.3], carb: [3, 1.0, 2.8], pr: [4, 0.4, 1.9], resp: [4, 1.8, 3.1],
};
const LAB_T: Record<keyof typeof LABELS, [number, number]> = { ir: [0, 2.2], surface: [1, 1.9], photo: [2, 2.1], carb: [3, 2.6], pr: [4, 1.6], resp: [4, 2.9] };
const LEFT2: Array<[number, number, number, number]> = [[100, 48.7, 2.6, 3.4], [48.7, 43.8, 2.2, 3.0], [43.8, 37.2, 2.4, 3.2], [37.2, 12.6, 2.8, 3.6], [12.6, 6.5, 1.8, 2.6]];
const LEFT_LAST: [number, number, number, number] = [6.5, 4.6, 3.1, 3.9];
const BREAD_T: [number, number] = [3.4, 4.2];
const clamp2 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease2 = (t: number, t0: number, t1: number): number => { const u = clamp2((t - t0) / (t1 - t0)); return u * u * (3 - 2 * u); };
/** 0 before beat b, eased between t0 and t1 of beat b, 1 after. */
const during = (beat: number, t: number, b: number, t0: number, t1: number): number => (beat < b ? 0 : beat > b ? 1 : ease2(t, t0, t1));
const frontAt2 = (beat: number, t: number): number => { const [a, b, t0, t1] = FRONT2[beat]; return a + (b - a) * ease2(t, t0, t1); };

/* ---- lanes: each lane's fate through the losses in order, from its place across the full band */
interface Lane { g0: number; col: string; lam: number; lost?: { c: Curl; q: number }; gs: Array<[number, number]> }
const NL = 54, PER_LANE = 12, LOOP = 1040, V = 112;
const hex2 = (c: string): number[] => (c.startsWith('rgb') ? c.slice(4, -1).split(',').map(Number) : [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)));
const mix2 = (a: string, b: string, u: number): string => `rgb(${hex2(a).map((v, i) => Math.round(v + (hex2(b)[i] - v) * u)).join(',')})`;
const LANES: Lane[] = (() => {
  const uvF = 0.03, parF = 0.487, out: Lane[] = [];
  for (let i = 0; i < NL; i++) {
    const g0 = (i + 0.5 + 0.3 * Math.sin(i * 12.9898)) / NL;
    // colour and wavelength by place across the band: UV, 400–700 nm, infrared
    let col: string, lam: number;
    if (g0 < uvF) { col = '#a796cf'; lam = 380; } else if (g0 < uvF + parF) { const u = (g0 - uvF) / parF; col = PAR[Math.min(PAR.length - 1, Math.floor(u * PAR.length))]; lam = 400 + 300 * u; } else { const u = (g0 - uvF - parF) / (1 - uvF - parF); col = IR[Math.min(IR.length - 1, Math.floor(u * IR.length))]; lam = 720 + 300 * u; }
    // through the losses: g is the place across the current band (0 top, 1 bottom)
    let g = g0, lost: Lane['lost'];
    const gs: Array<[number, number]> = [[SX0, g0]];
    for (const sl of B2.slices) {
      if (lost) break;
      const x = sl.l.x, top = B2.top(x - 0.01), w = B2.w(x - 0.01);
      void top;
      // slices at the same x (UV and infrared) are taken from the band as it was before them
      const same = B2.slices.filter(q => q.l.x === x), firstTop = Math.min(...same.map(q => q.yA)), lastBot = Math.max(...same.map(q => q.yB));
      void firstTop; void lastBot;
      const y = B2.top(x - 0.01) + g * w;
      if (y >= sl.yA - 0.01 && y <= sl.yB + 0.01) { lost = { c: CURLS[B2.slices.indexOf(sl)], q: (y - sl.yA) / (sl.yB - sl.yA) }; break; }
      if (sl === same[same.length - 1]) {
        const nt = B2.top(x + 0.01), nw = B2.w(x + 0.01);
        g = (y - nt) / nw;
        gs.push([x, g]);
      }
    }
    out.push({ g0, col, lam, lost, gs });
  }
  return out;
})();
/** A lane's place across the band at x (its fraction changes only at the losses it survives). */
const gAt = (L: Lane, x: number): number => { let g = L.gs[0][1]; for (const [gx, gg] of L.gs) if (x >= gx) g = gg; return g; };

function svg2(): string {
  const id = 'efj';
  const places = sceneBody(id, { noBand: true, noBread: true });
  const curls = CURLS.map(c => `<g data-k="cv-${c.l.k}" display="none">${curlSvg(id, c)}</g>`).join('');
  const at = labelAt(SC), labs = (Object.keys(LABELS) as Array<keyof typeof LABELS>).map(k => labelSvg(LABELS[k], at[k][0], at[k][1], at[k][2], false, `lb-${k}`)).join('');
  const [bx, byy] = AT.bread;
  const dots = LANES.map((_, i) => Array.from({ length: PER_LANE }, (_, j) => `<circle data-k="d${i}-${j}" r="3" display="none"/>`).join('')).join('');
  const heat = [0, 1, 2].map(i => `<path data-k="hs${i}" display="none" class="ef-heat" d="M0,0c3,-6 -3,-12 0,-18c3,-6 -3,-12 0,-18"/>`).join('');
  return `<g class="fig ef-anim ef2"><g transform="translate(${OX} ${OY}) scale(${S2})">
    ${places}
    <clipPath id="${id}-front"><rect data-k="fr" x="-60" y="0" width="0" height="640"/></clipPath>
    <g clip-path="url(#${id}-front)"><path d="${bandPath(B2, SX0, SXEND)}" fill="#f6e7c6" style="opacity:.55"/>
      <linearGradient id="${id}-tint" gradientUnits="userSpaceOnUse" x1="${X_RED[0]}" x2="${X_AMB[1]}" y1="0" y2="0"><stop offset="0" stop-color="${RED}" stop-opacity="0"/><stop offset=".3" stop-color="${RED}" stop-opacity=".22"/><stop offset=".55" stop-color="${RED}" stop-opacity=".22"/><stop offset="1" stop-color="${AMBER}" stop-opacity=".32"/></linearGradient>
      <path d="${bandPath(B2, X_RED[0], SXEND)}" fill="url(#${id}-tint)"/>
      <path d="M${SXEND},${B2.top(SXEND) - 6}L${SXEND + 18},${(B2.top(SXEND) + B2.bot(SXEND)) / 2}L${SXEND},${B2.bot(SXEND) + 6}Z" fill="${AMBER}"/></g>
    ${curls}${heat}
    <g data-k="sugar" display="none"><g class="chn-g">${row(AT.ring[0] + 54, B2.top(AT.ring[0] + 54) + B2.w(AT.ring[0] + 54) / 2, 'CCCP', { r: 6 })}</g></g>
    <g data-k="glow" display="none"><circle cx="${AT.ring[0]}" cy="${AT.ring[1]}" r="40" fill="#f8d98a" style="opacity:.45"/></g>
    <g>${dots}</g>
    <g data-k="bread" display="none">${breadG(bx, byy, 0.62)}</g>
    ${labs}
    <text class="ef-num" x="${10}" y="${130}" text-anchor="start" style="font-size:14px;font-weight:700">sunlight</text>
    <g data-k="ro"><text class="ef-why" x="${bx}" y="${byy + 90}" text-anchor="middle">energy left</text><text data-k="ro-n" class="ef-big" x="${bx}" y="${byy + 70}" text-anchor="middle">100</text></g>
    <text class="ef-crd" x="786" y="592" text-anchor="end">values: Zhu, Long &amp; Ort 2008, 2010 · C₃ leaf, 30 °C</text>
  </g></g>`;
}

function bind2(stage: SVGSVGElement): (beat: number, t: number) => void {
  const els = new Map<string, Element>();
  stage.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
  const cache = new Map<Element, Map<string, string>>();
  const set = (k: string, a: string, v: string): void => {
    const el = els.get(k); if (!el) return;
    let m = cache.get(el); if (!m) { m = new Map(); cache.set(el, m); }
    if (m.get(a) === v) return; m.set(a, v);
    if (a === 'text') el.textContent = v; else el.setAttribute(a, v);
  };
  const op = (k: string, v: number): void => { set(k, 'display', v < 0.004 ? 'none' : 'inline'); set(k, 'opacity', v >= 0.996 ? '1' : v.toFixed(3)); };
  const f2 = (v: number): string => v.toFixed(1);
  return (beat, t) => {
    const front = frontAt2(beat, t), T = BEAT_T[beat] + flowT(beat, t);
    set('fr', 'width', f2(front + 60));
    // curls and labels
    const rev: Partial<Record<LossKey, number>> = {};
    for (const c of CURLS) { const [b, t0, t1] = CURL_T[c.l.k]; rev[c.l.k] = during(beat, t, b, t0, t1); op(`cv-${c.l.k}`, rev[c.l.k] as number); }
    for (const k of Object.keys(LAB_T) as Array<keyof typeof LABELS>) { const [b, t0] = LAB_T[k]; op(`lb-${k}`, during(beat, t, b, t0, t0 + 0.5)); }
    // the readout counts down as each loss completes
    let v = 100;
    for (let b = 0; b < LEFT2.length; b++) { const [a, z, t0, t1] = LEFT2[b]; if (beat > b) v = z; else if (beat === b) v = a + (z - a) * ease2(t, t0, t1); }
    if (beat === 4) { const [a, z, t0, t1] = LEFT_LAST; if (t >= t0) v = a + (z - a) * ease2(t, t0, t1); }
    set('ro-n', 'text', v >= 99.95 ? '100' : v.toFixed(1));
    op('bread', beat === 4 ? ease2(t, BREAD_T[0], BREAD_T[1]) : 0);
    op('sugar', during(beat, t, 3, 2.4, 3.0));
    op('glow', beat === 3 ? ease2(t, 0.6, 1.1) * (1 - ease2(t, 2.6, 3.4)) : 0);
    // the heat shimmer over the photochemical curl (beat 3 on), a slow rise, no jitter
    const ph = by(CURLS, 'photo'), shim = during(beat, t, 2, 1.0, 1.8);
    for (let i = 0; i < 3; i++) {
      const u = ((T * 0.35 + i / 3) % 1), p = ph.at(0.5 + 0.4 * u).p;
      set(`hs${i}`, 'transform', `translate(${f2(p[0] - 4 + 4 * i)} ${f2(p[1])})`);
      op(`hs${i}`, shim * 0.8 * Math.sin(Math.PI * u));
    }
    // the photons
    for (let i = 0; i < LANES.length; i++) {
      const L = LANES[i], xStop = L.lost ? L.lost.c.l.x : SXEND + 10;
      for (let j = 0; j < PER_LANE; j++) {
        const k = `d${i}-${j}`;
        const d = (T * V + ((j / PER_LANE + (i * 0.6180339) % 1 / PER_LANE) * LOOP)) % LOOP;
        let x: number, y: number, o = 1, col = L.col, r = 3;
        const run = xStop - SX0;
        if (d <= run) {
          x = SX0 + d;
          if (x > front) { op(k, 0); continue; }
          const g = gAt(L, x);
          y = B2.top(x) + g * B2.w(x);
          // light → the red level in the thylakoid (blue lanes shrink to the red size) → amber in the stroma
          const ur = ease2(x, X_RED[0], X_RED[1]), ua = ease2(x, X_AMB[0], X_AMB[1]);
          r = L.lam < 700 ? 3 + 1.1 * (1 - (L.lam - 400) / 300) * (1 - ur) : 3;
          col = ua > 0 ? mix2(RED, AMBER, ua) : ur > 0 ? mix2(L.col, RED, ur) : L.col;
          o = Math.min(1, (x - SX0) / 30) * (L.lost ? 1 : 1 - ease2(x, SXEND - 6, SXEND + 10));
        } else if (L.lost) {
          const c = L.lost.c, s = (d - run) / c.len;
          if (s > 1 || s > (rev[c.l.k] ?? 0) * 1.02) { op(k, 0); continue; }
          // along the curl, eased, at the lane's place across the slice
          const u = s, at = c.at(u), n: Pt = [-at.h[1], at.h[0]], taper = 1 - 0.35 * Math.max(0, (u - 0.75) / 0.25);
          x = at.p[0] + n[0] * (L.lost.q - 0.5) * c.w * taper; y = at.p[1] + n[1] * (L.lost.q - 0.5) * c.w * taper;
          o = 1 - ease2(u, 0.45, 0.95);
          col = mix2(c.l.k === 'photo' || c.l.k === 'carb' || c.l.k === 'resp' ? (c.l.k === 'photo' ? mix2(L.col, RED, 0.6) : AMBER) : L.col, c.l.k === 'pr' ? '#c8673f' : '#cfc7b7', ease2(u, 0.1, 0.6));
        } else { op(k, 0); continue; }
        set(k, 'cx', f2(x)); set(k, 'cy', f2(y)); set(k, 'r', f2(r)); set(k, 'fill', col); op(k, o);
      }
    }
  };
}

export const STAGING: Staging = {
  id: 'j',
  // the key lines on the stage (lecturer, 29 Oct 2026: "people don't read the text under the animation")
  keys: [
    { beat: 0, text: 'Chlorophyll uses', x: 1395, y: 80, size: 40 },
    { beat: 0, text: '400–700 nm', x: 1395, y: 126, size: 40 },
    { beat: 1, text: '≈ 10 % reflected', x: 1395, y: 80, size: 40 },
    { beat: 1, text: 'or transmitted', x: 1395, y: 126, size: 40 },
    { beat: 2, text: 'Excess energy', x: 1395, y: 80, size: 40 },
    { beat: 2, text: 'lost as heat', x: 1395, y: 126, size: 40 },
    { beat: 3, text: 'Sugar stores', x: 1395, y: 80, size: 40 },
    { beat: 3, text: 'about a third', x: 1395, y: 126, size: 40 },
    { beat: 4, text: 'At most 4.6 %', x: 1395, y: 80, size: 40, t0: 3.9 },
    { beat: 4, text: 'in biomass', x: 1395, y: 126, size: 40, t0: 3.9 },
    // the closing question, centred in the free band over the leaf, once the flow has stopped
    { beat: 4, text: 'Where could we make photosynthesis more efficient?', x: 800, y: 52, size: 44, t0: 4.4 },
  ],
  name: 'j · The journey of sunlight through a leaf',
  note: 'The f1 scene: photon particles coloured by wavelength flow from the sun through the leaf surface, a thylakoid, the stroma, RuBisCO and a mitochondrion to bread; each loss peels away where it happens (51.3, 4.9, 6.6, 24.6, 6.1, 1.9; Zhu et al. 2008, 2010) and the energy left counts down to 4.6',
  beats: EFF,
  svg: svg2,
  bind: bind2,
};
