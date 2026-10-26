// Slide L04b · Excitation (26 Oct 2026, lecturer's option 1): the absorption half of slide 12's picked figure
// "Levels + times". A photon is absorbed only if its energy fits a gap between electron energy levels; blue reaches
// S₂, red S₁, and S₂ relaxes to S₁ as heat within a picosecond, so both end in S₁ and photons count, not their energy.
// Chl a in solvent: Soret (S₂) ≈ 430 nm, Qy (S₁) ≈ 662 nm. The four fates of S₁ stay on slide 12.
// Energies drawn to scale from E = 1239.84 eV·nm / λ: S₁ 1.87 eV (662 nm), S₂ 2.88 eV (430 nm); the green photon
// (550 nm, 2.25 eV) falls between them and fits no gap. Photon packets keep slide 4’s look (0.032 px per nm).
import type { PlateText, Variant } from '../types';
import { wave } from '../mechanisms';
import './l04b.css';

export const PLATE: PlateText = {
  n: '4b',
  title: 'Excitation',
  status: 'draft',
  lead: 'A pigment absorbs a photon only if the photon’s energy fits the gap between two electron energy levels.',
  points: [
    { claim: 'Absorption.', text: 'A photon lifts an electron from the ground state (S₀)<br>Blue photons reach S₂, red photons reach S₁' },
    { claim: 'Relaxation.', text: 'From S₂ the electron drops to S₁ within ~1 ps<br>The blue photon’s extra energy is lost as heat' },
    { claim: 'Photons count.', text: 'Blue and red photons both end in S₁<br>So photosynthesis counts photons, not their energy' },
  ],
  play: 'pig',
  refs: [
    { label: 'van Amerongen & Croce 2013', url: 'https://doi.org/10.1007/s11120-013-9824-3' },
    { label: 'Croce & van Amerongen 2014', url: 'https://doi.org/10.1038/nchembio.1555' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'p', name: 'Levels and times' },
  { id: 'q', name: 'Photons at their energy' },
  { id: 'r', name: 'Blue and red side by side' },
  { id: 's', name: 'Spectrum over the jumps' },
  { id: 't', name: 'Fit or weak fit' },
];

/* ---------- shared parts ---------- */

type A = 'start' | 'middle' | 'end';
type C = 'blue' | 'red' | 'green';
type Ink = C | 'grey' | 'ink';
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fl04b-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

const NM: Record<C, number> = { blue: 430, red: 662, green: 550 };
const eV = (nm: number): number => 1239.84 / nm;
const E1 = eV(NM.red), E2 = eV(NM.blue), EG = eV(NM.green); // 1.87, 2.88 and 2.25 eV
const K = 0.032; // drawn wavelength in px per nm, as on slide 4

/** Arrowheads in each ink and the amber glow of an excited electron, prefixed per figure. */
const defs = (p: string): string => `<defs>${(['blue', 'red', 'green', 'grey', 'ink'] as Ink[]).map(k =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path class="fl04b-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}
  <radialGradient id="${p}-glow"><stop offset="0" stop-color="#f6c453" stop-opacity=".95"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".45"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient></defs>`;

const ar = (p: string, k: Ink, d: string, cls = ''): string =>
  `<path class="fl04b-ar fl04b-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;
/** S₂ → S₁ as heat: a grey wavy arrow. */
const heat = (p: string, x0: number, y0: number, x1: number, y1: number, n = 4): string =>
  `<path class="fl04b-ar fl04b-k-grey" d="${wave(x0, y0, x1, y1, 6, n)}" marker-end="url(#${p}-grey)"/>`;
const lvl = (x0: number, x1: number, y: number): string => `<path class="fl04b-lvl" d="M${f(x0)},${f(y)} H${f(x1)}"/>`;
/** Thin vibrational sublevels just above a level, as on slide 12. */
const sub = (x0: number, x1: number, y: number): string => `<path class="fl04b-sub" d="M${f(x0)},${f(y - 10)} H${f(x1)} M${f(x0)},${f(y - 20)} H${f(x1)}"/>`;

/** A photon as a wave packet in its colour (slide 4's look): wavelength in proportion, bell-shaped envelope. */
function photon(c: C, cx: number, cy: number, len = 64, ang = 0, amp = 11): string {
  const lam = NM[c] * K, n = 90, co = Math.cos((ang * Math.PI) / 180), si = Math.sin((ang * Math.PI) / 180), pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = (i / n - 0.5) * len * 0.8, env = Math.exp(-((u / (len * 0.28)) ** 2)), v = Math.sin((2 * Math.PI * u) / lam) * amp * env;
    pts.push(`${i ? 'L' : 'M'}${f(cx + u * co - v * si)},${f(cy + u * si + v * co)}`);
  }
  return `<path class="fl04b-pk fl04b-k-${c}" d="${pts.join('')}"/>`;
}

/** The excited electron: an amber dot in a soft glow. */
const exc = (p: string, x: number, y: number, r = 22): string =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="url(#${p}-glow)"/><circle class="fl04b-e" cx="${f(x)}" cy="${f(y)}" r="6.5"/>`;
/** A cross: no level at this height. */
const cross = (x: number, y: number, r = 9): string => `<path class="fl04b-x" d="M${f(x - r)},${f(y - r)} L${f(x + r)},${f(y + r)} M${f(x + r)},${f(y - r)} L${f(x - r)},${f(y + r)}"/>`;
/** A tick: the photon's energy fits a gap. */
const tick = (x: number, y: number): string => `<path class="fl04b-ok" d="M${f(x - 10)},${f(y)} L${f(x - 3)},${f(y + 8)} L${f(x + 11)},${f(y - 9)}"/>`;
/** A time pill, as on slide 12. */
function badge(x: number, y: number, s: string, a: A = 'start'): string {
  const w = Math.round(s.length * 10.2 + 26), x0 = a === 'start' ? x : a === 'end' ? x - w : x - w / 2;
  return `<rect class="tb tb-ps" x="${f(x0)}" y="${f(y - 15)}" width="${w}" height="30" rx="15"/>${T(x0 + w / 2, y + 6.5, s, 'fl04b-bt', 'middle')}`;
}
/** The vertical energy axis with its name. */
const eAxis = (p: string, x: number, y0: number, y1: number): string =>
  `${ar(p, 'grey', `M${x},${y0} L${x},${y1}`, 'fl04b-axis')}<text class="fl04b-ax" transform="translate(${x - 12} ${f((y0 + y1) / 2)}) rotate(-90)" text-anchor="middle">energy</text>`;
/** A photon's colour name and wavelength, on two lines. */
const plab = (c: C, x: number, y: number, a: A = 'start'): string => `${T(x, y, c, `fl04b-h fl04b-c-${c}`, a)}${T(x, y + 24, `${NM[c]} nm`, 'fl04b-l', a)}`;
/** "no level, weakly absorbed", on two lines: chlorophyll has no strong transition at green, but weak bands and
 *  vibrational sub-levels still catch some of it (a leaf absorbs 50–90 % of green; slide 5). */
const noFit = (x: number, y: number, a: A = 'start'): string => `${T(x, y, 'no level here,', 'fl04b-h', a)}${T(x, y + 24, 'weakly absorbed', 'fl04b-l', a)}`;
/** The excited-state bracket and the ground-state name at the right end of the levels. */
const sides = (x: number, y2: number, y1: number, y0: number): string =>
  `<path class="fl04b-br" d="M${x},${f(y2)} H${x + 8} V${f(y1)} H${x}"/>${T(x + 20, (y2 + y1) / 2 - 4, 'excited', 'fl04b-l')}${T(x + 20, (y2 + y1) / 2 + 20, 'states', 'fl04b-l')}
   ${T(x + 2, y0 + 8, 'ground state', 'fl04b-l')}`;

const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fl04b" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

/* ---------- 4bP · Levels and times: slide 12's "Levels + times", trimmed to absorption ---------- */

function drawP(): string {
  const p = 'fl04bp', y0 = 462, k = 118, y1 = y0 - E1 * k, y2 = y0 - E2 * k, yg = y0 - EG * k;
  const xb = 150, xh = 210, xr = 270, xg = 520, xe = 618;
  return svg(p, 'Energy levels of chlorophyll: ground state S0, excited states S1 and S2. A blue photon, 430 nanometres, lifts an electron from S0 to S2; a red photon, 662 nanometres, from S0 to S1. From S2 the electron drops to S1 as heat in under a picosecond, so both end in S1. A green photon, 550 nanometres, would reach a height between S1 and S2 where there is no level: no level there, so it is only weakly absorbed; most bounces off.', `
    ${eAxis(p, 34, 540, 66)}
    ${lvl(90, 600, y2)}${sub(90, 170, y2)}${T(78, y2 + 9, 'S₂', 'fl04b-lv', 'end')}
    ${lvl(90, 600, y1)}${sub(90, 170, y1)}${T(78, y1 + 9, 'S₁', 'fl04b-lv', 'end')}
    ${lvl(90, 600, y0)}${sub(90, 170, y0)}${T(78, y0 + 9, 'S₀', 'fl04b-lv', 'end')}
    ${sides(xe, y2, y1, y0)}
    ${photon('blue', xb, y0 + 46, 64, 90)}${ar(p, 'blue', `M${xb},${y0 - 2} L${xb},${f(y2 + 5)}`)}${plab('blue', xb - 22, y0 + 42, 'end')}
    ${heat(p, xh, y2 + 6, xh, y1 - 6, 4)}${T(xh + 20, (y2 + y1) / 2 - 10, 'heat', 'fl04b-h')}${badge(xh + 20, (y2 + y1) / 2 + 22, '< 1 ps')}
    ${photon('red', xr, y0 + 46, 64, 90)}${ar(p, 'red', `M${xr},${y0 - 2} L${xr},${f(y1 + 5)}`)}${plab('red', xr + 22, y0 + 42)}
    ${exc(p, xh, y1)}${exc(p, xr, y1)}${T(xr + 30, y1 + 32, 'both end here', 'fl04b-h fl04b-c-amber')}
    ${ar(p, 'green', `M${xg},${y0 - 2} L${xg},${f(yg + 5)}`, 'fl04b-dash')}${cross(xg, yg - 14)}${noFit(xg - 22, yg - 6, 'end')}
    ${photon('green', xg - 34, y0 + 42, 60, -55)}${ar(p, 'green', `M${xg + 6},${y0 + 6} L${xg + 44},${y0 + 52}`, 'fl04b-thin')}${plab('green', xg + 58, y0 + 46)}
  `);
}

/* ---------- 4bQ · Photons at their energy: each photon arrives from the left at the height of its energy ---------- */

function drawQ(): string {
  const p = 'fl04bq', y0 = 470, k = 112, y1 = y0 - E1 * k, y2 = y0 - E2 * k, yg = y0 - EG * k;
  const l0 = 110, l1 = 400, l2 = 470, xe = 600, px = 150;
  // the levels form a staircase; each photon flies in at the height of its energy and stops where a level begins
  const lab = (c: C, y: number): string => T(px - 44, y, `<tspan class="fl04b-t-${c}">${c}</tspan> ${NM[c]} nm`, 'fl04b-l');
  return svg(p, 'Energy levels of chlorophyll drawn as a staircase: S0 ground state, S1 and S2 excited states. Three photons fly in from the left at the height of their energy. Blue, 430 nanometres, arrives at the height of S2 and lifts an electron there; red, 662 nanometres, at the height of S1; green, 550 nanometres, arrives between the two levels: no level there, so it is only weakly absorbed; most flies on. From S2 the electron drops to S1 as heat in under a picosecond, so both end in S1.', `
    ${eAxis(p, 40, 530, 76)}
    ${lvl(l2, xe, y2)}${lvl(l1, xe, y1)}${lvl(l0, xe, y0)}
    ${T(xe + 12, y2 + 9, 'S₂', 'fl04b-lv')}${T(xe + 50, y2 + 8, 'excited state', 'fl04b-l')}
    ${T(xe + 12, y1 + 9, 'S₁', 'fl04b-lv')}${T(xe + 50, y1 + 8, 'excited state', 'fl04b-l')}
    ${T(xe + 12, y0 + 9, 'S₀', 'fl04b-lv')}${T(xe + 50, y0 + 8, 'ground state', 'fl04b-l')}
    ${photon('blue', px, y2, 76)}${ar(p, 'blue', `M${px + 46},${f(y2)} L${l2 - 8},${f(y2)}`, 'fl04b-thin')}${lab('blue', y2 - 22)}
    ${photon('green', px, yg, 76)}${ar(p, 'green', `M${px + 46},${f(yg)} L788,${f(yg)}`, 'fl04b-thin fl04b-dot')}${lab('green', yg - 22)}
    ${photon('red', px, y1, 76)}${ar(p, 'red', `M${px + 46},${f(y1)} L${l1 - 8},${f(y1)}`, 'fl04b-thin')}${lab('red', y1 + 38)}
    ${noFit(300, yg - 36)}
    ${ar(p, 'blue', `M${l2},${y0 - 2} L${l2},${f(y2 + 6)}`)}${ar(p, 'red', `M${l1},${y0 - 2} L${l1},${f(y1 + 6)}`)}
    ${heat(p, 560, y2 + 6, 560, y1 - 6, 4)}${T(474, y2 - 20, 'heat', 'fl04b-h')}${badge(524, y2 - 26, '< 1 ps')}
    ${exc(p, l1, y1)}${exc(p, 560, y1)}${T(492, y1 + 36, 'both end here', 'fl04b-h fl04b-c-amber')}
  `);
}

/* ---------- 4bR · Blue and red side by side: two columns of the same levels, both ending in S₁ ---------- */

function drawR(): string {
  const p = 'fl04br', y0 = 466, k = 110, y1 = y0 - E1 * k, y2 = y0 - E2 * k, yg = y0 - EG * k;
  const cb: [number, number] = [100, 292], cr: [number, number] = [324, 486], cg: [number, number] = [518, 630], xe = 646;
  const col = (c: [number, number]): string => `${lvl(c[0], c[1], y2)}${lvl(c[0], c[1], y1)}${lvl(c[0], c[1], y0)}`;
  const xb = 150, xh = 214, xr = 405, xg = 574;
  return svg(p, 'The same chlorophyll energy levels drawn three times, side by side. Blue photon, 430 nanometres: lifts the electron from S0 to S2, which drops to S1 as heat in under a picosecond. Red photon, 662 nanometres: lifts it from S0 to S1. Both end in S1. Green photon, 550 nanometres: its energy falls between S1 and S2, no level there, so it is only weakly absorbed; most bounces off.', `
    ${eAxis(p, 34, 540, 70)}
    ${T(86, y2 + 9, 'S₂', 'fl04b-lv', 'end')}${T(86, y1 + 9, 'S₁', 'fl04b-lv', 'end')}${T(86, y0 + 9, 'S₀', 'fl04b-lv', 'end')}
    ${col(cb)}${col(cr)}${col(cg)}${sides(xe, y2, y1, y0)}
    ${T((cb[0] + cb[1]) / 2, 64, 'blue photon', 'fl04b-h fl04b-c-blue', 'middle')}${T((cr[0] + cr[1]) / 2, 64, 'red photon', 'fl04b-h fl04b-c-red', 'middle')}${T((cg[0] + cg[1]) / 2, 64, 'green photon', 'fl04b-h fl04b-c-green', 'middle')}
    ${photon('blue', xb, y0 + 46, 64, 90)}${ar(p, 'blue', `M${xb},${y0 - 2} L${xb},${f(y2 + 5)}`)}${T(xb + 20, y0 + 52, `${NM.blue} nm`, 'fl04b-l')}
    ${heat(p, xh, y2 + 6, xh, y1 - 6, 4)}${T(xh + 18, (y2 + y1) / 2 - 10, 'heat', 'fl04b-h')}${badge(xh + 18, (y2 + y1) / 2 + 22, '< 1 ps')}
    ${photon('red', xr, y0 + 46, 64, 90)}${ar(p, 'red', `M${xr},${y0 - 2} L${xr},${f(y1 + 5)}`)}${T(xr + 20, y0 + 52, `${NM.red} nm`, 'fl04b-l')}
    ${exc(p, xh, y1)}${exc(p, xr, y1)}<path class="fl04b-end" d="M${xh + 16},${f(y1 + 18)} H${xr - 16}"/>${T((xh + xr) / 2 + 4, y1 + 46, 'both end here', 'fl04b-h fl04b-c-amber', 'middle')}
    ${ar(p, 'green', `M${xg},${y0 - 2} L${xg},${f(yg + 5)}`, 'fl04b-dash')}${cross(xg, yg - 14)}${noFit((cg[0] + cg[1]) / 2, y2 - 46, 'middle')}
    ${photon('green', xg - 26, y0 + 42, 56, -60)}${ar(p, 'green', `M${xg + 6},${y0 + 6} L${xg + 38},${y0 + 50}`, 'fl04b-thin')}${T(xg + 44, y0 + 72, `${NM.green} nm`, 'fl04b-l')}
  `);
}

/* ---------- 4bS · Spectrum over the jumps: chlorophyll a's two absorption peaks line up with its two jumps ---------- */

/** Chlorophyll a in solvent, approximate shape: Soret band at 430 nm with a shoulder, Qy at 662 nm, weak Qx/vibronic
 *  bands between, low absorption in the green. Heights relative to the Soret peak. */
const chlA = (nm: number): number => [[430, 13, 1], [412, 14, 0.5], [662, 9.5, 0.78], [618, 12, 0.15], [578, 14, 0.07], [535, 22, 0.035], [470, 14, 0.06]]
  .reduce((s, [c, w, h]) => s + h * Math.exp(-(((nm - c) / w) ** 2) / 2), 0);

function drawS(): string {
  const p = 'fl04bs', xs = (nm: number): number => 130 + (nm - 380) * 1.72, yb = 186, hs = 128;
  const y0 = 532, k = 90, y1 = y0 - E1 * k, y2 = y0 - E2 * k, yg = y0 - EG * k;
  const xb = xs(NM.blue), xr = xs(NM.red), xg = xs(NM.green), xh = xb + 70;
  const peak = Math.max(...Array.from({ length: 341 }, (_, i) => chlA(380 + i)));
  const ys = (nm: number): number => yb - (chlA(nm) / peak) * hs;
  const spec = `M${f(xs(380))},${yb} ${Array.from({ length: 171 }, (_, i) => { const nm = 380 + i * 2; return `L${f(xs(nm))},${f(ys(nm))}`; }).join(' ')} L${f(xs(720))},${yb}Z`;
  return svg(p, 'Top: the absorption spectrum of chlorophyll a in solvent, with peaks at 430 and 662 nanometres and little absorption in the green. Below, the energy levels: the blue photon at the 430 nanometre peak lifts an electron from S0 to S2, the red photon at the 662 nanometre peak from S0 to S1; from S2 the electron drops to S1 as heat in under a picosecond, so both end in S1. A green photon, 550 nanometres, falls between S1 and S2: no level there, so it is only weakly absorbed.', `
    ${T(130, 36, 'absorption by chlorophyll a', 'fl04b-h')}
    <path class="fl04b-spec" d="${spec}"/><path class="fl04b-axis" d="M${f(xs(380))},${yb} H${f(xs(720))}"/>
    ${[400, 500, 600, 700].map(nm => `<path class="fl04b-axis" d="M${f(xs(nm))},${yb} V${yb + 6}"/>${T(xs(nm), yb + 28, `${nm}`, 'fl04b-ax', 'middle')}`).join('')}
    ${T(xs(720), yb + 54, 'wavelength (nm)', 'fl04b-ax', 'end')}
    ${T(xb + 18, ys(NM.blue) + 8, `${NM.blue} nm`, 'fl04b-h fl04b-c-blue')}${T(xr + 18, ys(NM.red) + 8, `${NM.red} nm`, 'fl04b-h fl04b-c-red')}
    <path class="fl04b-guide" d="M${f(xb)},${f(ys(NM.blue) + 4)} V${f(y2 - 8)} M${f(xr)},${f(ys(NM.red) + 4)} V${f(y1 - 8)} M${f(xg)},${f(ys(NM.green) - 4)} V${f(yg - 26)}"/>
    ${eAxis(p, 32, 566, y2 - 30)}
    ${lvl(96, 690, y2)}${T(84, y2 + 9, 'S₂', 'fl04b-lv', 'end')}${lvl(96, 690, y1)}${T(84, y1 + 9, 'S₁', 'fl04b-lv', 'end')}${lvl(96, 690, y0)}${T(84, y0 + 9, 'S₀', 'fl04b-lv', 'end')}
    ${T(700, y2 + 8, 'excited', 'fl04b-l')}${T(700, y1 + 8, 'excited', 'fl04b-l')}${T(700, y0 + 8, 'ground', 'fl04b-l')}
    ${photon('blue', xb, y0 + 38, 48, 90)}${ar(p, 'blue', `M${f(xb)},${y0 - 2} L${f(xb)},${f(y2 + 5)}`)}
    ${heat(p, xh, y2 + 6, xh, y1 - 6, 3)}${T(xh + 18, (y2 + y1) / 2 - 8, 'heat', 'fl04b-h')}${badge(xh + 18, (y2 + y1) / 2 + 24, '< 1 ps')}
    ${photon('red', xr, y0 + 38, 48, 90)}${ar(p, 'red', `M${f(xr)},${y0 - 2} L${f(xr)},${f(y1 + 5)}`)}
    ${exc(p, xh, y1)}${exc(p, xr, y1)}<path class="fl04b-end" d="M${f(xh + 16)},${f(y1 + 16)} H${f(xr - 16)}"/>${T(xr + 16, y1 + 34, 'both end here', 'fl04b-h fl04b-c-amber')}
    ${photon('green', xg, y0 + 38, 48, 90)}${ar(p, 'green', `M${f(xg)},${y0 - 2} L${f(xg)},${f(yg + 5)}`, 'fl04b-dash')}${cross(xg, yg - 14)}${noFit(xg + 22, yg - 8)}
  `);
}

/* ---------- 4bT · Fit or no fit: three photons tried against the same levels ---------- */

function drawT(): string {
  const p = 'fl04bt', y0 = 452, k = 112, y1 = y0 - E1 * k, y2 = y0 - E2 * k, yg = y0 - EG * k;
  const xb = 210, xh = 270, xr = 410, xg = 588, xe = 666;
  return svg(p, 'Three photons tried against the energy levels of chlorophyll: S0 ground state, S1 and S2 excited states. Blue, 430 nanometres: its energy fits the gap from S0 to S2, absorbed. Red, 662 nanometres: fits the gap from S0 to S1, absorbed. Green, 550 nanometres: its energy falls between S1 and S2, no level there, so it is only weakly absorbed; most passes through. From S2 the electron drops to S1 as heat in under a picosecond, so blue and red both end in S1.', `
    ${eAxis(p, 40, 540, 60)}
    ${lvl(120, 650, y2)}${T(108, y2 + 9, 'S₂', 'fl04b-lv', 'end')}${lvl(120, 650, y1)}${T(108, y1 + 9, 'S₁', 'fl04b-lv', 'end')}${lvl(120, 650, y0)}${T(108, y0 + 9, 'S₀', 'fl04b-lv', 'end')}
    ${sides(xe, y2, y1, y0)}
    ${photon('blue', xb, y0 + 48, 66, 90)}${ar(p, 'blue', `M${xb},${y0 - 2} L${xb},${f(y2 + 5)}`)}${plab('blue', xb - 24, y0 + 44, 'end')}
    ${tick(xb - 4, y2 - 30)}${T(xb + 16, y2 - 24, 'fits', 'fl04b-h')}
    ${heat(p, xh, y2 + 6, xh, y1 - 6, 4)}${T(xh + 18, (y2 + y1) / 2 - 10, 'heat', 'fl04b-h')}${badge(xh + 18, (y2 + y1) / 2 + 22, '< 1 ps')}
    ${photon('red', xr, y0 + 48, 66, 90)}${ar(p, 'red', `M${xr},${y0 - 2} L${xr},${f(y1 + 5)}`)}${plab('red', xr + 24, y0 + 44)}
    ${tick(xr - 4, y1 - 30)}${T(xr + 16, y1 - 24, 'fits', 'fl04b-h')}
    ${exc(p, xh, y1)}${exc(p, xr, y1)}<path class="fl04b-end" d="M${xh + 16},${f(y1 + 18)} H${xr - 16}"/>${T((xh + xr) / 2 - 18, y1 + 46, 'both end here', 'fl04b-h fl04b-c-amber', 'middle')}
    ${photon('green', xg, y0 + 48, 66, 90)}${plab('green', xg + 24, y0 + 44)}
    ${ar(p, 'green', `M${xg},${y0 - 2} L${xg},${f(yg + 5)}`, 'fl04b-dash')}${cross(xg, yg - 14)}
    ${ar(p, 'green', `M${xg + 26},${y0 + 10} L${xg + 26},46`, 'fl04b-thin fl04b-dot')}${noFit(xg + 40, 58)}
  `);
}

const DRAW: Record<string, () => string> = { p: drawP, q: drawQ, r: drawR, s: drawS, t: drawT };

export function draw(id: string): string {
  return (DRAW[id] ?? drawP)();
}
