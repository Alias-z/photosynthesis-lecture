// 'eff', staging s · "Sunlight to biomass" (slide C4e · Efficiency of photosynthesis; beats-eff.ts; EFFICIENCY_BRIEF.md,
// lecturer, 29 Oct 2026). One fixed framing, ≈ 21 s in all. 100 % of the solar energy on a C₃ leaf is a band that runs left
// to right; at each step its share of the energy peels off the bottom, turns down and is labelled (name, % of the solar
// energy), and what is left is written over the band. Values: figs/ce04e.ts STEPS (Zhu, Long & Ort 2008, Fig. 1; 2010).
// - Beat 1 (≈ 4 s): the band of 100 runs in; 51.3 outside 400–700 nm peels off; 48.7 left.
// - Beat 2 (≈ 5 s): 4.9 reflected and transmitted, 6.6 photochemical inefficiency; 43.8, 37.2 left.
// - Beat 3 (≈ 4 s): 24.6 carbohydrate synthesis; 12.6 left.
// - Beat 4 (≈ 7 s): 6.1 photorespiration (rust), 1.9 respiration; the last 4.6 flows into biomass, shown as sugar.
import '../figs/ce04e.css';
import { metab } from '../figs/carbon-form';
import { fmt, left, peel, sankey, STEPS } from '../figs/ce04e';
import { EFF } from './beats-eff';
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

export const STAGING: Staging = {
  id: 's',
  name: 's · Sunlight to biomass, one band',
  note: '100 % of the solar energy on a C₃ leaf as one band; each minimum loss peels off in order with its share (Zhu et al. 2008, 2010): 51.3 outside 400–700 nm, 4.9 reflected and transmitted, 6.6 photochemical inefficiency, 24.6 carbohydrate synthesis, 6.1 photorespiration, 1.9 respiration; 4.6 left in biomass',
  beats: EFF,
  svg,
  bind,
};
