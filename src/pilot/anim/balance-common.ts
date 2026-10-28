// Slide 10b animation, "Balancing ATP and NADPH" (lecturer's approved script, 28 Oct 2026; research/redo-2026-10-28/
// BALANCE_BRIEF.md). Concept level: no H⁺, e⁻, photon or ATP counts, no ratio numerals. The scene is the whole 7m1 chain
// (chainSvg 'pdb-bilayer' in glyph mode, counts off), its parts lit per beat; the three routes are figs/l11c-routes.ts, the
// same drawing as the slide figure 11m2. The three stagings differ only in the balance indicator: s1 a beam balance, s2
// bars with a "needed for CO₂ fixation" mark, s3 three valve dials and a needle gauge.
// - Beat 1, the gap: the chain lit; an electron runs the linear path once, water → NADPH; the indicator shows too little
//   ATP for the NADPH made.
// - Beat 2, cyclic flow: the parts outside the loop dim; the violet loop appears and an electron circles it twice; H⁺
//   rings drop into the lumen at b₆f, the rotor turns, ATP tags leave the head; the ATP side rises. NADPH stays dim.
// - Beat 3, electrons to O₂: the thin teal route appears; an electron runs water → photosystem I → O₂, and water forms
//   again; H⁺ drop into the lumen, the rotor turns, the ATP side rises a little. NADPH stays dim.
// - Beat 4, malate valve: a spare NADPH tag leaves the reaction row, turns into a malate tag and leaves the chloroplast
//   ("to the cytosol"); the NADPH side gets lighter: level.
// - Beat 5, flexible (3 stops): three condition icons one by one (strong or flickering light, first minute of light,
//   cold); each disturbs the balance, the cyclic loop thickens, the indicator levels again; then the Munekage et al. 2004
//   clipping.
// How the chain is lit per beat (figs/chain.ts is not modified for this): every part's wrapper is drawn twice, dimmed and
// lit (from chainSvg with no part and with every part lit; the parts are found by drawing one lit part at a time), and
// the lit copy fades in or out over the dimmed one.
import './balance-common.css';
import { chainSvg, GEO, hring, tagG, type Part } from '../figs/chain';
import { LOOP, MALATE_AT, NADPH_TAG, O2_AT, OXY, routesSvg, smoothPath, WATER_AT, EXIT_TO } from '../figs/l11c-routes';
import { f1, lerpV, setters, smooth, tw, type V } from './antenna-common';
import { along, CARD, cardRect, clipH, clippingSvg, condIcon, E_DOT, glyph, mv, sample, turnPath, txt } from './cyclicm-common';
import type { Staging } from './types';

/* ---------------------------------------------------------------- the chain, each part dimmed and lit */

const ALL: Part[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];
/** Lit per beat: linear flow (all), the cyclic loop, linear flow up to photosystem I and on to O₂, all, all. */
const CYC_LIT: Part[] = ['psi', 'light-psi', 'e-psi-fd', 'fd', 'pq', 'e-pq-b6f', 'b6f', 'pq-h-out', 'e-b6f-pc', 'pc', 'e-pc-psi', 'h-lumen', 'atps', 'atp'];
const NO_NADPH: Part[] = ['e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph'];
const LIT: Part[][] = [ALL, CYC_LIT, ALL.filter(p => !NO_NADPH.includes(p)), ALL, ALL];

interface Wrap { a: number; b: number; inner: string; on: boolean }
function wraps(s: string): Wrap[] {
  const out: Wrap[] = [], re = /<g class="chn-(on|off)">/g, tag = /<g[\s>]|<\/g>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const i0 = m.index + m[0].length;
    let depth = 1, i = i0, t: RegExpExecArray | null;
    tag.lastIndex = i0;
    while (depth && (t = tag.exec(s))) { depth += t[0] === '</g>' ? -1 : 1; i = tag.lastIndex; }
    out.push({ a: m.index, b: i, inner: s.slice(i0, i - 4), on: m[1] === 'on' });
    re.lastIndex = i;
  }
  return out;
}
const strip = (s: string): string => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const chainOf = (id: string, lit: Part[]): string => strip(chainSvg(id, 'pdb-bilayer', lit, { mol: true, counts: false }));
/** The chain with every part wrapper twice: data-v="off" (dimmed) under data-v="on" (lit). */
function balanceScene(id: string): string {
  const lit = chainOf(id, ALL), wl = wraps(lit), wd = wraps(chainOf(id, []));
  const part: string[] = wl.map(() => 'x');
  for (const p of ALL) wraps(chainOf('balprobe', [p])).forEach((w, i) => { if (w.on) part[i] = p; });
  let svg = '', at = 0;
  wl.forEach((w, i) => {
    svg += `${lit.slice(at, w.a)}<g class="chn-off" data-p="${part[i]}" data-v="off">${wd[i]?.inner ?? ''}</g><g class="chn-on" data-p="${part[i]}" data-v="on">${w.inner}</g>`;
    at = w.b;
  });
  return svg + lit.slice(at);
}

/* ---------------------------------------------------------------- timing */

const B1 = { lin: 0.6, linD: 4.2, glow: 4.7, end: 6.4 };
const B2 = { e0: 1.0, lapD: 2.4, laps: 2, spin: [2.0, 7.0] as V, atp: [2.4, 3.4, 4.4, 5.3], rise: [2.2, 4.2] as V, end: 7.2 };
const B3 = { e0: 1.0, eD: 3.4, spin: [2.4, 5.6] as V, atp: [3.6], rise: [3.0, 2.4] as V, end: 6.2 };
const B4 = { glow: 0.3, lift: 0.8, slide: 1.6, slideD: 1.2, exit: 3.2, exitD: 1.2, route: 2.6, trim: [3.2, 1.4] as V, end: 5.4 };
/** Beat 5: icon i at C5[i]; a stop once it has settled; the clipping last. */
const C5 = [0.5, 3.3, 6.1], H5 = [2.9, 5.7, 8.5], B5 = { clip: 8.6, end: 9.4 };
const TEND = [B1.end, B2.end, B3.end, B4.end, B5.end];

/** The balance: ATP made and NADPH made, relative to what CO₂ fixation needs (0 = level, < 0 too little ATP). */
function balance(b: number, tt: number): { atp: number; nadph: number; wob: number } {
  const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
  const atp = 0.86 + 0.08 * mv(T(1), B2.rise[0], B2.rise[1]) + 0.025 * mv(T(2), B3.rise[0], B3.rise[1]);
  const nadph = 1 - 0.035 * mv(T(3), B4.trim[0], B4.trim[1]);
  let wob = 0;
  if (b === 4) C5.forEach(c => { const s = tt - c; if (s > 0) wob -= 0.06 * Math.exp(-s / 0.75) * Math.sin((2 * Math.PI * s) / 1.4) * smooth(s / 0.2); });
  return { atp, nadph, wob };
}

/* ---------------------------------------------------------------- the indicators (stage units) */

type Kind = 's1' | 's2' | 's3';
interface Lay { fig: { s: number; t: V }; box: { x: number; y: number; w: number; h: number }; cond: V; clip: { x: number; w: number } }
const LAY: Record<Kind, Lay> = {
  s1: { fig: { s: 1, t: [10 - CARD.x, 40 - CARD.y] }, box: { x: 912, y: 26, w: 676, h: 380 }, cond: [930, 470], clip: { x: 1262, w: 322 } },
  s2: { fig: { s: 1, t: [10 - CARD.x, 40 - CARD.y] }, box: { x: 912, y: 26, w: 676, h: 380 }, cond: [930, 470], clip: { x: 1262, w: 322 } },
  s3: { fig: { s: 0.86, t: [10 - CARD.x * 0.86, 8 - CARD.y * 0.86] }, box: { x: 790, y: 20, w: 798, h: 370 }, cond: [808, 470], clip: { x: 1226, w: 352 } },
};

/** s1: a beam balance, ATP pan left, NADPH pan right. */
const BAL = { p: [1250, 120] as V, half: 220, hang: 118 };
function beamSvg(): string {
  const [px, py] = BAL.p;
  const pan = (k: string, tagS: string, kind: 'atp' | 'nadph'): string => `<g data-k="${k}">
    <path class="bal-str" d="M-62,0L0,${-BAL.hang}L62,0"/>
    <path class="bal-heap bal-heap-${kind}" data-k="${k}-heap" d="M-46,0A46,26 0 0 1 46,0Z"/>
    <path class="bal-pan" d="M-74,0Q0,30 74,0Z"/>
    <g transform="translate(0 34)">${tagG(0, 0, tagS, kind)}</g></g>`;
  return `<g class="fig">
    <path class="bal-stand" d="M${px},${py}V${py + 226}M${px - 70},${py + 240}H${px + 70}"/><path class="bal-base" d="M${px - 74},${py + 246}L${px - 54},${py + 226}H${px + 54}L${px + 74},${py + 246}Z"/>
    <path class="bal-level" d="M${px - BAL.half - 30},${py}H${px + BAL.half + 30}"/>
    <g data-k="beam"><rect class="bal-beam" x="${px - BAL.half}" y="${py - 5}" width="${2 * BAL.half}" height="10" rx="5"/></g>
    <circle class="bal-pivot" cx="${px}" cy="${py}" r="9"/>
    ${pan('pan-a', 'ATP', 'atp')}${pan('pan-n', 'NADPH', 'nadph')}</g>`;
}
function drawBeam(S: ReturnType<typeof setters>, bl: { atp: number; nadph: number; wob: number }): void {
  const { q, set } = S, [px, py] = BAL.p;
  const B = bl.atp - bl.nadph + bl.wob, th = Math.max(-14, Math.min(14, -B * 80)), r = (th * Math.PI) / 180;
  set(q('beam'), 'transform', `rotate(${th.toFixed(2)} ${px} ${py})`);
  const end = (sg: number): V => [px + sg * BAL.half * Math.cos(r), py + sg * BAL.half * Math.sin(r)];
  [['pan-a', -1, bl.atp], ['pan-n', 1, bl.nadph]].forEach(([k, sg, amt]) => {
    const e = end(sg as number);
    set(q(k as string), 'transform', `translate(${f1(e[0])} ${f1(e[1] + BAL.hang)})`);
    const s = 0.75 + 0.5 * ((amt as number) - 0.8);
    set(q(`${k}-heap`), 'transform', `scale(${s.toFixed(3)})`);
  });
}

/** s2: bars, the ATP bar short of a dashed "needed for CO₂ fixation" mark; malate trims NADPH (the mark follows it). */
const BARS = { x: 1030, ya: 170, yn: 290, ua: 470, un: 330 };
function barsSvg(): string {
  return `<g class="fig">
    <g transform="translate(${BARS.x - 46} ${BARS.ya - 8})">${tagG(0, 0, 'ATP', 'atp')}</g>
    <rect class="bal-bar-atp" data-k="bar-a" x="${BARS.x}" y="${BARS.ya - 22}" width="10" height="28" rx="5"/>
    <rect class="bal-gap" data-k="bar-gap" x="${BARS.x}" y="${BARS.ya - 21}" width="10" height="26" rx="4"/>
    <g data-k="bar-mark"><path class="bal-mark" d="M0,${BARS.ya - 44}V${BARS.ya + 18}"/>${txt('needed for CO₂ fixation', 'bal-mark-t', 14, BARS.ya - 54, 'end')}</g>
    <g transform="translate(${BARS.x - 46} ${BARS.yn - 8})">${tagG(0, 0, 'NADPH', 'nadph')}</g>
    <rect class="bal-bar-nadph" data-k="bar-n" x="${BARS.x}" y="${BARS.yn - 22}" width="10" height="28" rx="5"/></g>`;
}
function drawBars(S: ReturnType<typeof setters>, bl: { atp: number; nadph: number; wob: number }): void {
  const { q, set } = S;
  const need = BARS.ua * bl.nadph, a = BARS.ua * (bl.nadph + (bl.atp - bl.nadph + bl.wob));
  set(q('bar-a'), 'width', f1(a));
  set(q('bar-gap'), 'x', f1(BARS.x + Math.min(a, need)));
  set(q('bar-gap'), 'width', f1(Math.max(0.1, Math.abs(need - a))));
  set(q('bar-gap'), 'opacity', Math.abs(need - a) > 3 ? '1' : '0');
  set(q('bar-mark'), 'transform', `translate(${f1(BARS.x + need)} 0)`);
  set(q('bar-n'), 'width', f1(BARS.un * bl.nadph));
}

/** s3: a needle gauge "ATP : NADPH" with a "needed" band, and three valve dials under the chain. */
const GA = { c: [1189, 330] as V, r: 196 };
const VALVES: Array<{ k: string; name: string; goal: string; cls: string; x: number }> = [
  { k: 'v-cyc', name: 'cyclic electron flow', goal: 'more ATP', cls: 'cyc', x: 150 }, { k: 'v-oxy', name: 'water–water cycle', goal: 'more ATP', cls: 'oxy', x: 390 }, { k: 'v-mal', name: 'malate valve', goal: 'less NADPH', cls: 'mal', x: 630 },
];
const VY = 646, VR = 40;
const arcPath = (c: V, r: number, a0: number, a1: number): string => {
  const p = (a: number): V => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${f1(x0)},${f1(y0)}A${r},${r} 0 ${Math.abs(a1 - a0) > Math.PI ? 1 : 0} 1 ${f1(x1)},${f1(y1)}`;
};
const GA_SPAN = (70 * Math.PI) / 180;
function gaugeSvg(): string {
  const [cx, cy] = GA.c, up = -Math.PI / 2, band = (7 * Math.PI) / 180;
  return `<g class="fig">
    ${txt('ATP : NADPH', 'bal-g-title', cx, 62, 'middle')}
    <path class="bal-g-arc" d="${arcPath(GA.c, GA.r, up - GA_SPAN, up + GA_SPAN)}"/>
    <path class="bal-g-band" d="${arcPath(GA.c, GA.r, up - band, up + band)}"/>
    ${txt('needed', 'bal-g-need', cx, cy - GA.r - 22, 'middle')}
    ${txt('too little ATP', 'bal-g-end', cx + GA.r * Math.cos(up - GA_SPAN) - 8, cy + GA.r * Math.sin(up - GA_SPAN) + 34, 'middle')}
    ${txt('too much ATP', 'bal-g-end', cx + GA.r * Math.cos(up + GA_SPAN) + 8, cy + GA.r * Math.sin(up + GA_SPAN) + 34, 'middle')}
    <g data-k="needle"><path class="bal-needle" d="M${cx - 6},${cy}L${cx},${cy - GA.r + 16}L${cx + 6},${cy}Z"/></g><circle class="bal-hub" cx="${cx}" cy="${cy}" r="11"/></g>`;
}
function valvesSvg(): string {
  return VALVES.map(v => `<g class="fig"><circle class="bal-v-bg" cx="${v.x}" cy="${VY}" r="${VR}"/>
    <path class="bal-v-open bal-v-${v.cls}" data-k="${v.k}-arc" d=""/>
    <g data-k="${v.k}-h"><rect class="bal-v-handle" x="${v.x - 30}" y="${VY - 5}" width="60" height="10" rx="5"/></g><circle class="bal-v-hub" cx="${v.x}" cy="${VY}" r="7"/>
    ${txt(v.name, `bal-v-name bal-v-t-${v.cls}`, v.x, VY + VR + 30, 'middle')}${txt(`(${v.goal})`, 'bal-condr', v.x, VY + VR + 52, 'middle')}</g>`).join('');
}
function drawGauge(S: ReturnType<typeof setters>, bl: { atp: number; nadph: number; wob: number }, open: number[]): void {
  const { q, set } = S, [cx, cy] = GA.c;
  const B = bl.atp - bl.nadph + bl.wob, a = Math.max(-70, Math.min(70, B * 430));
  set(q('needle'), 'transform', `rotate(${a.toFixed(2)} ${cx} ${cy})`);
  VALVES.forEach((v, i) => {
    const o = Math.max(0, Math.min(1, open[i])), a0 = -Math.PI / 2, a1 = a0 + o * 1.5 * Math.PI;
    set(q(`${v.k}-arc`), 'd', o > 0.01 ? arcPath([v.x, VY], VR - 6, a0, a1) : '');
    set(q(`${v.k}-h`), 'transform', `rotate(${(o * 90).toFixed(1)} ${v.x} ${VY})`);
  });
}

/* ---------------------------------------------------------------- the conditions of beat 5 */

/** Each condition and why NADPH accumulates in it (lecturer, 29 Oct 2026: the reason must be on screen). */
const COND5: Array<{ c: 'light' | 'sunrise' | 'cold'; a: string; r: [string, string] }> = [
  { c: 'light', a: 'sudden strong light', r: ['electrons arrive faster', 'than NADPH is used'] },
  { c: 'sunrise', a: 'first minutes of light', r: ['CO₂-fixing enzymes are', 'not yet activated'] },
  { c: 'cold', a: 'cold', r: ['CO₂-fixing enzymes', 'work slowly'] },
];
/** The first minute of light: the sun rising over the horizon. */
function sunriseIcon(r = 30): string {
  const k = r / 34, rays = [-150, -120, -90, -60, -30].map(d => { const a = (d * Math.PI) / 180; return `M${f1(17 * k * Math.cos(a))},${f1(4 * k + 17 * k * Math.sin(a))}L${f1(25 * k * Math.cos(a))},${f1(4 * k + 25 * k * Math.sin(a))}`; }).join('');
  return `<circle class="cym-ic-bg" r="${r}"/><path class="cym-ic-ray" d="${rays}"/><path class="cym-ic-sun" d="M${f1(-12 * k)},${f1(4 * k)}A${f1(12 * k)},${f1(12 * k)} 0 0 1 ${f1(12 * k)},${f1(4 * k)}Z"/>
    <path class="bal-horizon" d="M${f1(-24 * k)},${f1(4 * k)}H${f1(24 * k)}"/>`;
}
function condsSvg(at: V): string {
  return COND5.map((c, i) => {
    const y = at[1] + i * 86;
    return `<g data-k="cond${i}" opacity="0" display="none"><g transform="translate(${at[0] + 32} ${y})">${c.c === 'sunrise' ? sunriseIcon(30) : condIcon(c.c, 30)}</g>
      ${txt(c.a, 'bal-cond', at[0] + 76, y - 14)}${txt(c.r[0], 'bal-condr', at[0] + 76, y + 8)}${txt(c.r[1], 'bal-condr', at[0] + 76, y + 28)}</g>`;
  }).join('');
}

/* ---------------------------------------------------------------- the staging */

export function makeBalance(o: { id: Kind; name: string; note: string }): Staging {
  const P = `bal${o.id}`, L = LAY[o.id], F = L.fig;
  const { p700: P700, ring: RING } = GEO;
  const HEAD: V = [712, 150];
  // uncounted H⁺: drops into the lumen (figure units): where, and when (beat, seconds into it)
  const B6F_DROP: V[] = [[292, 384], [318, 392]], WATER_DROP: V[] = [[214, 396], [238, 404]];
  const ind = o.id === 's1' ? beamSvg() : o.id === 's2' ? barsSvg() : `${gaugeSvg()}${valvesSvg()}`;

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    holds: [[], [], [], [], H5],
    svg: () => `
      <g data-k="cam" transform="matrix(${F.s},0,0,${F.s},${f1(F.t[0])},${f1(F.t[1])})"><g class="fig">
        ${cardRect(P)}
        <g data-k="chain" class="chn chn-pdb-bilayer">${balanceScene(`${P}c`)}</g>
        ${routesSvg()}
        <path data-k="loop-path" d="${smoothPath(LOOP, true)}" fill="none" stroke="none"/>
        <g data-k="turn" opacity="0" display="none"><path class="cym-turn-bg" d="${turnPath(RING)}"/><path class="bal-turn" data-k="turn-arc" d="${turnPath(RING)}" pathLength="100" stroke-dasharray="34 66"/></g>
        ${[0, 1, 2, 3].map(i => glyph(`hd${i}`, hring(0, 0, 11))).join('')}
        ${[0, 1, 2, 3].map(i => glyph(`atp${i}`, tagG(0, 0, 'ATP', 'atp'))).join('')}
        ${glyph('spare', tagG(0, 0, 'NADPH', 'nadph'))}${glyph('mal', tagG(0, 0, 'malate', 'plain'))}
        <circle class="bal-glow" data-k="g-nadph" cx="${NADPH_TAG[0]}" cy="${NADPH_TAG[1]}" r="44" opacity="0" display="none"/>
        <circle class="bal-glow" data-k="g-water" cx="${WATER_AT[0]}" cy="${WATER_AT[1] + 4}" r="30" opacity="0" display="none"/>
        ${glyph('el', E_DOT)}
      </g></g>
      <g class="fig"><rect class="cym-robox" x="${L.box.x}" y="${L.box.y}" width="${L.box.w}" height="${L.box.h}" rx="18"/></g>
      ${ind}
      ${condsSvg(L.cond)}
      ${clippingSvg(P, 'clip', L.clip.x, 714 - clipH(L.clip.w) - 10, L.clip.w, -1)}`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const chainG = q<SVGGElement>('chain');
      const on = new Map<string, SVGGElement[]>(), off = new Map<string, SVGGElement[]>();
      chainG.querySelectorAll<SVGGElement>('[data-v]').forEach(g => {
        const m = g.dataset.v === 'on' ? on : off, p = g.dataset.p ?? 'x';
        m.set(p, [...(m.get(p) ?? []), g]);
      });
      const path = (p: string): SVGPathElement | null => chainG.querySelector<SVGPathElement>(`[data-p="${p}"][data-v="on"] path.chn-e`);
      const seq = (ps: string[]): V[] => ps.flatMap(p => sample(path(p), 24));
      const LIN: V[] = [[96, 432], ...seq(['e-water-psii', 'e-psii-pq']), GEO.pq, ...seq(['e-pq-b6f', 'e-b6f-pc']), GEO.pc, ...seq(['e-pc-psi']), P700,
        ...seq(['e-psi-fd']), GEO.fd, ...seq(['e-fd-fnr']), GEO.fnr, ...seq(['e-fnr-nadph'])];
      const TO_O2: V[] = [[96, 432], ...seq(['e-water-psii', 'e-psii-pq']), GEO.pq, ...seq(['e-pq-b6f', 'e-b6f-pc']), GEO.pc, ...seq(['e-pc-psi']), P700, ...OXY, O2_AT];
      const loopEl = q<SVGPathElement>('loop-path');
      const LOOPS = sample(loopEl, 120);
      // the loop's point nearest b₆f: where its H⁺ drop
      let iB = 0;
      LOOPS.forEach((p, i) => { if (Math.hypot(p[0] - GEO.hem[0], p[1] - GEO.hem[1]) < Math.hypot(LOOPS[iB][0] - GEO.hem[0], LOOPS[iB][1] - GEO.hem[1])) iB = i; });
      const fB = iB / (LOOPS.length - 1);
      const turnArc = q('turn-arc');
      const put = (k: string, at: V, sc: number, o2: number): void => {
        const el = q(k);
        op(el, o2);
        if (o2 > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
      };
      const drops: Array<{ b: number; t: number; at: V }> = [
        ...Array.from({ length: B2.laps }, (_, k) => [0, 1].map(j => ({ b: 1, t: B2.e0 + (k + fB) * B2.lapD + j * 0.15, at: B6F_DROP[j] }))).flat(),
        { b: 2, t: 1.4, at: WATER_DROP[0] }, { b: 2, t: 1.55, at: WATER_DROP[1] }, { b: 2, t: 2.3, at: B6F_DROP[0] }, { b: 2, t: 2.45, at: B6F_DROP[1] },
      ];

      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(4, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);

        /* ---- the chain: the parts of this beat lit, faded from the last beat's */
        const e = b === 0 ? 1 : tw(tt, 0.1, 0.8);
        ALL.forEach(p => {
          const now = LIT[b].includes(p), was = b === 0 ? now : LIT[b - 1].includes(p);
          const l = was === now ? (now ? 1 : 0) : now ? e : 1 - e;
          (on.get(p) ?? []).forEach(g => op(g, l));
          (off.get(p) ?? []).forEach(g => op(g, l >= 0.996 ? 0 : 1));
        });

        /* ---- the routes: shown in their beat, faint after it, all full in beat 5 */
        op(q('r-cyc'), b === 1 ? tw(tt, 0.3, 1.0) : b === 2 ? 1 - 0.65 * tw(tt, 0.1, 0.8) : b === 3 ? 0.35 : b === 4 ? 0.35 + 0.65 * tw(tt, 0, 0.6) : 0);
        const wide = C5.reduce((a, c) => a + mv(T(4), c + 0.5, 0.9), 0);
        set(q('r-cyc-band'), 'style', `stroke-width:${(16 + 7 * wide).toFixed(1)}px`);
        op(q('r-oxy'), b === 2 ? tw(tt, 0.3, 1.0) : b === 3 ? 1 - 0.55 * tw(tt, 0.1, 0.8) : b === 4 ? 0.45 : 0);
        op(q('r-water'), b === 2 ? tw(tt, B3.e0 + B3.eD - 0.1, B3.e0 + B3.eD + 0.4) : b > 2 ? 1 : 0);
        op(q('g-water'), b === 2 ? tw(tt, B3.e0 + B3.eD, B3.e0 + B3.eD + 0.25) * (1 - tw(tt, B3.e0 + B3.eD + 0.6, B3.e0 + B3.eD + 1.0)) : 0);
        op(q('r-mal'), b === 3 ? tw(tt, B4.route, B4.route + 0.6) : b === 4 ? 0.45 : 0);
        op(q('r-mal-tag'), b === 3 ? tw(tt, B4.exit + 0.3, B4.exit + 0.8) : b === 4 ? 1 : 0);

        /* ---- the electron */
        let el: V = P700, eo = 0;
        if (b === 0 && tt >= B1.lin) { el = along(LIN, smooth((tt - B1.lin) / B1.linD)); eo = tw(tt, B1.lin, B1.lin + 0.2) * (1 - tw(tt, B1.lin + B1.linD - 0.1, B1.lin + B1.linD + 0.3)); }
        if (b === 1 && tt >= B2.e0 - 0.3) {
          const u = Math.max(0, Math.min(1, (tt - B2.e0) / (B2.laps * B2.lapD)));
          el = along(LOOPS, (smoothRun(u) * B2.laps) % 1);
          eo = tw(tt, B2.e0 - 0.3, B2.e0) * (1 - tw(tt, B2.e0 + B2.laps * B2.lapD, B2.e0 + B2.laps * B2.lapD + 0.4));
        }
        if (b === 2 && tt >= B3.e0) { el = along(TO_O2, smooth((tt - B3.e0) / B3.eD)); eo = tw(tt, B3.e0, B3.e0 + 0.2) * (1 - tw(tt, B3.e0 + B3.eD - 0.1, B3.e0 + B3.eD + 0.3)); }
        if (b === 4) {
          // the loop keeps turning, faster as it widens
          const s = (tt * (0.4 + 0.12 * wide)) % 1;
          el = along(LOOPS, s);
          eo = 1;
        }
        put('el', el, 1, eo);

        /* ---- H⁺ drop into the lumen; the rotor turns; ATP leaves the head */
        [0, 1, 2, 3].forEach(i => op(q(`hd${i}`), 0));
        let slot = 0;
        drops.forEach(d => {
          if (d.b !== b) return;
          const s = tt - d.t;
          if (s < 0 || s > 2.2 || slot > 3) return;
          put(`hd${slot}`, [d.at[0] + 24 * smooth(s / 1.6), d.at[1] + 30 * smooth(s / 1.6)], 1, tw(s, 0, 0.25) * (1 - tw(s, 1.6, 2.2)));
          slot++;
        });
        const spin = b === 1 ? B2.spin : b === 2 ? B3.spin : null;
        const sOn = spin ? tw(tt, spin[0], spin[0] + 0.4) * (1 - tw(tt, spin[1] - 0.4, spin[1])) : 0;
        op(q('turn'), sOn);
        if (spin) set(turnArc, 'stroke-dashoffset', f1(-((tt - spin[0]) / 1.3) * 100));
        const rises = b === 1 ? B2.atp : b === 2 ? B3.atp : [];
        [0, 1, 2, 3].forEach(i => {
          const a = rises[i];
          if (a === undefined) { op(q(`atp${i}`), 0); return; }
          const s = tt - a;
          put(`atp${i}`, [HEAD[0] - 22 - 40 * smooth(s / 1.6), HEAD[1] + 22 - 44 * smooth(s / 1.6)], 1, s < 0 ? 0 : tw(s, 0, 0.25) * (1 - tw(s, 1.2, 1.7)));
        });

        /* ---- beat 1: NADPH made; beat 4: a spare NADPH becomes malate and leaves */
        op(q('g-nadph'), b === 0 ? tw(tt, B1.glow, B1.glow + 0.3) * (1 - tw(tt, B1.glow + 0.8, B1.glow + 1.2)) : b === 3 ? tw(tt, B4.glow, B4.glow + 0.3) * (1 - tw(tt, B4.lift + 0.4, B4.lift + 0.8)) : 0);
        if (b === 3) {
          const up = smooth((tt - B4.lift) / 0.8), sl = smooth((tt - B4.slide) / B4.slideD), ex = smooth((tt - B4.exit) / B4.exitD);
          const pos = tt < B4.slide ? lerpV(NADPH_TAG, [NADPH_TAG[0] - 40, 28], up) : tt < B4.exit ? lerpV([NADPH_TAG[0] - 40, 28], MALATE_AT, sl) : lerpV(MALATE_AT, [EXIT_TO[0] - 20, EXIT_TO[1]], ex);
          const morph = tw(tt, B4.slide + 0.7, B4.slide + B4.slideD);
          const vis = tw(tt, B4.lift, B4.lift + 0.2) * (1 - tw(tt, B4.exit + B4.exitD - 0.4, B4.exit + B4.exitD));
          put('spare', pos, 1, vis * (1 - morph));
          put('mal', pos, 1, vis * morph);
        } else { op(q('spare'), 0); op(q('mal'), 0); }

        /* ---- beat 5: conditions; the clipping */
        COND5.forEach((_, i) => op(q(`cond${i}`), tw(T(4), C5[i], C5[i] + 0.4)));
        op(q('clip'), tw(T(4), B5.clip, B5.clip + 0.4));

        /* ---- the indicator */
        const bl = balance(b, tt);
        if (o.id === 's1') drawBeam(S, bl);
        else if (o.id === 's2') drawBars(S, bl);
        else {
          const T2 = T(1), T3 = T(2), T4 = T(3);
          drawGauge(S, bl, [0.55 * mv(T2, 0.3, 1.0) + 0.15 * wide, 0.25 * mv(T3, 0.3, 1.0), 0.45 * mv(T4, B4.route, 1.0)]);
        }
      };
    },
  };
}

/** Two laps eased at the start and the end, steady between. */
function smoothRun(u: number): number {
  const a = 0.12;
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  // velocity ramps up over [0, a], steady, ramps down over [1 − a, 1]; normalised to 1 at u = 1
  const v = 1 / (1 - a);
  if (u < a) return (v * u * u) / (2 * a);
  if (u > 1 - a) { const w = 1 - u; return 1 - (v * w * w) / (2 * a); }
  return v * (u - a / 2);
}
