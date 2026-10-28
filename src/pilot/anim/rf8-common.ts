// FvCB model (slide C8), animation rf8: the story the zoom stagings share (rf8-a: thesis look, drawn curve; rf8-b: glow
// look, the lecturer's own thesis Fig. 5 as the instrument). The stage is the slide C8 figure, schemaSvg(look, LIT_C8)
// (C8 v1 thesis, v2 glow), in its card on the left, and an A/Cᵢ panel on the right with a Cᵢ readout and the curve's dot,
// both live from the first frame. Five clicks, one per beat:
// 1 · A_c: zoom to RuBisCO; only the RuBisCO limit stays lit (LIT_C8C); Cᵢ 60 → 200 ppm; few CO₂ reach RuBisCO, two
//     spare RuBP wait; the dot climbs the steep red part.
// 2 · today: pull back to RuBisCO + the cycle (LIT_C8C + LIT_C8J); Cᵢ → 300 ppm, the dot reaches the switch; the panel
//     marks today's Cᵢ.
// 3 · A_j: to the light supply and RuBP regeneration (LIT_C8J); Cᵢ → 560; the spare RuBP is gone, RuBP returns one by
//     one, fed by a steady stream of ATP and NADPH; the dot rises slowly (cyan).
// 4 · A_p: to triose phosphate and its export (LIT_C8P); Cᵢ → 1200; triose phosphate piles up, export and Pᵢ return
//     stay slow; the dot runs flat (purple).
// 5 · zoom out to the whole schema with the three limits lit (the slide figure, LIT_C8); two paper cards (FvCB 1980,
//     Sharkey 1985) take the readout's place.
//
// The curve: the FvCB rates A_c = V(C − Γ*)/(C + K) − R and A_j = (J/4)(C − Γ*)/(C + 2Γ*) − R with V = 104, J/4 = 40.3,
// Γ* = 40 ppm, K = 710 ppm, R = 1 µmol m⁻² s⁻¹: values fitted here to the lecturer's MSc thesis Fig. 5 (wheat, modelled,
// Cᵢ in ppm; checked against the figure's pixels at 24 points from 52 to 1341 ppm, all within 1.4 µmol m⁻² s⁻¹; the
// switch at ≈ 320 ppm as in the figure). Γ* = 40 is Busch et al. 2024's typical value at 25 °C. The thesis leaves A_p out; A_p = 33 here
// is a schematic cap (it meets A_j at ≈ 690 ppm), flagged in the panel's credit line.
import zhangFig5 from '../../assets/rf/zhang2021-fig5.png';
import { LIT_C8, LIT_C8C, LIT_C8J, LIT_C8P, type Look } from '../figs/rf-schema';
import { axes, pill, sb, T } from '../figs/rf-kit';
import { f1, setters, type V } from './antenna-common';
import {
  bindScene, clipImage, co2G, dUpTo, glyph, kOf, litCh, paperCard, panelCard, PANEL, rubpG, schemaCard, sceneSvg, stream,
  tagG, tpG, beadG, Timeline, view, walker, WHOLE, camStr, type BeatPlan,
} from './rf78-common';
import type { Staging } from './types';

/* ================================================================ the model */

const FV = { V: 104, J4: 40.3, G: 40, K: 710, R: 1, P: 33 };
export const Ac = (c: number): number => (FV.V * (c - FV.G)) / (c + FV.K) - FV.R;
export const Aj = (c: number): number => (FV.J4 * (c - FV.G)) / (c + 2 * FV.G) - FV.R;
export const Ap = (_c: number): number => FV.P;
export const An = (c: number): number => Math.min(Ac(c), Aj(c), Ap(c));
/** Where one limit hands over to the next. */
const solve = (f: (c: number) => number, lo: number, hi: number): number => {
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; }
  return (lo + hi) / 2;
};
export const CJ = solve(c => Ac(c) - Aj(c), 100, 600), JP = solve(c => Aj(c) - Ap(c), 300, 1400);
export type Lim = 'c' | 'j' | 'p';
export const limOf = (c: number): Lim => (c < CJ ? 'c' : c < JP ? 'j' : 'p');
const C0 = 45, CMAX = 1400, AMAX = 45;

/* ================================================================ where things are on the schema (figure units) */

// positions of rf-schema.ts (GEO and the arrows of drawAll)
const PATH = {
  co2: walker([[244, 556], [268, 536], [292, 520]]),
  regen: walker([[236, 156], [152, 198], [126, 300], [150, 402], [282, 454]]),
  reduce: walker([[316, 296], [316, 174]]),
  supply: walker([[398, 214], [330, 214]]),
  export: walker([[392, 132], [424, 96], [434, 58], [470, 32]]),
  pi: walker([[350, 36], [394, 50], [414, 68]]),
};
/** Two spare RuBP beside RuBisCO (low Cᵢ); the triose-phosphate pile (high Cᵢ). */
const SPARE: V[] = [[226, 498], [182, 516]];
const PILE: V[] = [[290, 121], [254, 121], [218, 121], [272, 103], [236, 103], [200, 103], [254, 85]];

/* ================================================================ the plot (stage units) */

interface Plot { X: (c: number) => number; Y: (a: number) => number; svg: string; credit: string }
const PB: [number, number, number, number] = [1062, 206, 1548, 558];
const Ci = '<tspan font-style="italic">C</tspan>ᵢ', Aa = (k: string): string => `<tspan font-style="italic">A</tspan>${sb(k)}`;
function drawnPlot(): Plot {
  const X = (c: number): number => PB[0] + (c / CMAX) * (PB[2] - PB[0]);
  const Y = (a: number): number => PB[3] - (a / AMAX) * (PB[3] - PB[1]);
  const svg = axes(PB, X, Y, [[0, '0'], [500, '500'], [1000, '1000']], [[0, '0'], [10, '10'], [20, '20'], [30, '30'], [40, '40']],
    `intercellular CO₂, ${Ci} (ppm)`, `net CO₂ uptake, <tspan font-style="italic">A</tspan> (µmol m⁻² s⁻¹)`);
  return { X, Y, svg, credit: `curves after Zhang 2021, MSc thesis, Fig. 5 (wheat, FvCB model) · ${Aa('p')} (TPU) added` };
}
/** The lecturer's thesis Fig. 5 (1600 × 1103 px): Cᵢ 0 at x 199.5, 0.962 px per ppm; A 0 at y 936, 13.42 px per unit. */
function thesisPlot(p: string): Plot {
  const r = clipImage(`${p}f5`, zhangFig5, 1600, 1103, 950, 182, 612, { win: [30, 0, 1570, 1078], rot: 0.6, seed: 61, m: 14 });
  const X = (c: number): number => r.at(199.5 + 0.962 * c, 0)[0];
  const Y = (a: number): number => r.at(0, 936 - 13.42 * a)[1];
  return { X, Y, svg: r.svg, credit: `Zhang 2021, MSc thesis, Univ. Copenhagen, Fig. 5 (wheat, FvCB model) · ${Aa('p')} (TPU) drawn over it` };
}
const curvePts = (f: (c: number) => number, lo: number, hi: number, P: Plot): V[] => {
  const out: V[] = [];
  for (let c = lo; c <= hi + 1e-6; c += 5) { const a = f(c); if (a > AMAX + 1) break; out.push([P.X(c), P.Y(Math.max(-1, a))]); }
  return out;
};
const dOf = (q: V[]): string => `M${q.map(p => `${f1(p[0])},${f1(p[1])}`).join('L')}`;


/** The A/Cᵢ panel (stage units): readout, curve, dot, labels and the two paper cards. Channels: ci; o:pc, o:pj, o:pp
 *  (potential curves); o:lc, o:lj, o:lp (their labels); o:today, o:low, o:ro (readout), o:cards. */
export function makePanel(P: string, kind: 'drawn' | 'thesis'): { svg: string; draw: (S: ReturnType<typeof setters>, V_: (ch: string) => number) => void } {
  const plot = kind === 'thesis' ? thesisPlot(P) : drawnPlot();
  const { X, Y } = plot;
  const pot = { c: curvePts(Ac, C0, CMAX, plot), j: curvePts(Aj, C0, CMAX, plot), p: curvePts(Ap, 400, CMAX, plot) };
  const env = { c: curvePts(An, C0, CJ, plot), j: curvePts(An, CJ, JP, plot), p: curvePts(An, JP, CMAX, plot) };
  const o = { panel: kind };
  const limText = (k: Lim): string => `<text class="rf78-lim rf78-k${k}" data-k="ro-${k}" x="1030" y="142" opacity="0">${NAME[k]}</text>`;
  const th = o.panel === 'thesis', potCls = th ? 'rf78-pot-over' : 'rf78-pot';
  const svg = `${panelCard(P)}<g class="fig"><g class="rfk">
    ${plot.svg}
    ${o.panel === 'drawn' ? (['c', 'j'] as Lim[]).map(k => `<path data-k="pot-${k}" class="${potCls} rf78-s${k}" d="${dOf(pot[k])}" opacity="0"/>`).join('') : ''}
    <path data-k="pot-p" class="${potCls} rf78-sp" d="${dOf(pot.p)}" opacity="0"/>
    <g data-k="today" opacity="0"><path class="rf78-today" d="M${f1(X(300))},${f1(Y(0))}V${f1(Y(th ? 59 : 41))}"/>
      ${pill(X(300) + 130, Y(th ? 62.5 : 4.5), `today: ${Ci} ≈ 300 ppm`)}</g>
    ${o.panel === 'drawn' ? `<path data-k="env-c" class="rf78-env rf78-sc"/><path data-k="env-j" class="rf78-env rf78-sj"/>` : ''}
    <path data-k="env-p" class="rf78-env rf78-sp"/>
    <path data-k="drop" class="rf78-drop"/>
    <circle data-k="dot" class="rf78-dot" r="9"/>
    ${o.panel === 'drawn' ? `<g data-k="lab-c" opacity="0">${T(X(455), Y(40.5), `${Aa('c')}: RuBisCO`, 'rfk-hc rfk-halo', 'end')}</g>
    <g data-k="lab-j" opacity="0">${T(X(1400), Y(39.5), `${Aa('j')}: RuBP regeneration`, 'rfk-hj rfk-halo', 'end')}</g>` : ''}
    <g data-k="lab-p" opacity="0">${T(X(1400), Y(th ? 39.5 : 27.6), `${Aa('p')}: triose-phosphate use`, 'rfk-hp rfk-halo', 'end')}</g>
    <g data-k="low" opacity="0">${pill(X(th ? 1000 : 990), Y(th ? 26 : 16), 'uptake = the lowest rate')}</g>
    <g data-k="ro">
      <text class="rf78-rl" x="958" y="98">${Ci}</text><text class="rf78-val" data-k="ro-ci" x="1090" y="99" text-anchor="end">60</text><text class="rf78-unit" x="1098" y="98">ppm</text>
      <text class="rf78-rl" x="1200" y="98"><tspan font-style="italic">A</tspan></text><text class="rf78-val" data-k="ro-a" x="1330" y="99" text-anchor="end">1.7</text><text class="rf78-unit" x="1338" y="98">µmol m⁻² s⁻¹</text>
      <text class="rf78-rl" x="958" y="142">limit</text>${(['c', 'j', 'p'] as Lim[]).map(limText).join('')}
    </g>
    <g data-k="cards" opacity="0" display="none">
      ${paperCard(`${P}k1`, 942, 46, 318, { who: 'Farquhar, von Caemmerer &amp; Berry', where: '1980 · Planta', title: ['A biochemical model of', 'photosynthetic CO₂ assimilation', 'in leaves of C₃ species'] }, -1.1, 53)}
      ${paperCard(`${P}k2`, 1268, 50, 300, { who: 'Sharkey', where: '1985 · Plant Physiology', title: ['O₂-insensitive photosynthesis', 'in C₃ plants: its occurrence', 'and a possible explanation'] }, 1.0, 59)}
    </g>
    ${T(PANEL.x + PANEL.w - 16, PANEL.y + PANEL.h - 14, plot.credit, 'rfk-cr', 'end')}
  </g></g>`;


  const draw = (S: ReturnType<typeof setters>, V_: (ch: string) => number): void => {
    const { q, set, op } = S;
    const ci = V_('ci'), a = An(ci), lim = limOf(ci);
    const ax = X(ci), ay = Y(a);
    set(q('dot'), 'cx', f1(ax)); set(q('dot'), 'cy', f1(ay));
    set(q('dot'), 'class', `rf78-dot rf78-d${lim}`);
    set(q('drop'), 'd', `M${f1(ax)},${f1(ay + 10)}V${f1(Y(0))}`);
    if (kind === 'drawn') {
      set(q('env-c'), 'd', dUpTo(env.c, env.c[0][0], Math.min(ax, X(CJ))) || 'M0,0');
      set(q('env-j'), 'd', ax > X(CJ) ? dUpTo(env.j, X(CJ), Math.min(ax, X(JP))) : 'M0,0');
      for (const kk of ['c', 'j'] as Lim[]) op(q(`pot-${kk}`), V_(`o:p${kk}`));
      op(q('lab-c'), V_('o:lc')); op(q('lab-j'), V_('o:lj'));
    }
    set(q('env-p'), 'd', ax > X(JP) ? dUpTo(env.p, X(JP), ax) : 'M0,0');
    op(q('pot-p'), V_('o:pp'));
    op(q('lab-p'), V_('o:lp'));
    op(q('today'), V_('o:today'));
    op(q('low'), V_('o:low'));
    op(q('ro'), V_('o:ro'));
    set(q('ro-ci'), 'text', `${Math.round(ci / 10) * 10}`);
    set(q('ro-a'), 'text', a.toFixed(1));
    (['c', 'j', 'p'] as Lim[]).forEach(kk => op(q(`ro-${kk}`), kk === lim ? 1 : 0));
    op(q('cards'), V_('o:cards'));
  };
  return { svg, draw };
}

/* ================================================================ the staging */

export interface Opt {
  id: string; name: string; note: string; look: Look;
  /** 'drawn': the curve redrawn on axes; 'thesis': the lecturer's own Fig. 5 as the instrument. */
  panel: 'drawn' | 'thesis';
}

const NAME: Record<Lim, string> = { c: `RuBisCO, ${Aa('c')}`, j: `RuBP regeneration, ${Aa('j')}`, p: `triose-phosphate use, ${Aa('p')}` };

export function makeStaging(o: Opt): Staging {
  const P = `r8${o.id}`;
  // views (figure regions): RuBisCO and its limit; RuBisCO and the cycle; the light supply and RuBP regeneration;
  // triose phosphate and its export
  const VC = view([-6, 360, 480, 250]), VT = view([-6, 110, 580, 490]), VJ = view([0, 120, 560, 470]), VPx = view([170, -10, 610, 330]);
  const off = (ks: string[]): Record<string, number> => Object.fromEntries(ks.map(k => [k, 0]));
  const STREAMS = ['o:sCO2', 'o:sReg', 'o:sRed', 'o:sSup', 'o:sExp'];
  const beats: BeatPlan[] = [
    { end: 3.8, cam: [{ at: 0.05, d: 1.1, to: VC }], moves: [
      { at: 0.1, d: 0.5, to: litCh(LIT_C8C) },
      { at: 0.6, d: 0.3, to: { 'o:pc': 1 } },
      { at: 0.9, d: 0.3, to: { 'o:spare': 1, 'o:sCO2': 1 } },
      { at: 1.0, d: 2.3, to: { ci: 200 } },
      { at: 1.5, d: 0.3, to: { 'o:lc': 1 } },
    ] },
    { end: 3.4, cam: [{ at: 0.05, d: 1.1, to: VT }], moves: [
      { at: 0.1, d: 0.5, to: litCh([...LIT_C8C, ...LIT_C8J]) },
      { at: 0.5, d: 0.3, to: { 'o:pj': 1 } },
      { at: 0.8, d: 0.4, to: { 'o:sReg': 1, 'o:sRed': 1, 'o:sSup': 1 } },
      { at: 0.7, d: 1.5, to: { ci: 300 } },
      { at: 2.1, d: 0.3, to: { 'o:today': 1 } },
    ] },
    { end: 3.8, cam: [{ at: 0.05, d: 1.1, to: VJ }], moves: [
      { at: 0.1, d: 0.5, to: litCh(LIT_C8J) },
      { at: 0.4, d: 0.4, to: { 'o:spare': 0 } },
      { at: 1.0, d: 2.3, to: { ci: 560 } },
      { at: 1.6, d: 0.3, to: { 'o:lj': 1 } },
    ] },
    { end: 4.0, cam: [{ at: 0.05, d: 1.1, to: VPx }], moves: [
      { at: 0.1, d: 0.5, to: litCh(LIT_C8P) },
      { at: 0.5, d: 0.3, to: { 'o:pp': 1 } },
      { at: 0.8, d: 0.4, to: { 'o:sExp': 1 } },
      { at: 1.0, d: 2.5, to: { ci: 1200 } },
      { at: 2.0, d: 0.3, to: { 'o:lp': 1 } },
    ] },
    { end: 2.9, cam: [{ at: 0.05, d: 1.2, to: WHOLE }], moves: [
      { at: 0.1, d: 0.6, to: litCh(LIT_C8) },
      { at: 0.05, d: 0.5, to: { ...off(STREAMS), 'o:pile': 0 } },
      { at: 1.1, d: 0.25, to: { 'o:ro': 0 } },
      { at: 1.35, d: 0.3, to: { 'o:cards': 1, 'o:low': 1 } },
    ] },
  ];
  const TL = new Timeline({ ci: 60, 'o:ro': 1, 'o:pile': 1, ...litCh(LIT_C8) }, WHOLE, beats);
  const ENDS = TL.ends, START = ENDS.map((_, i) => ENDS.slice(0, i).reduce((a, b) => a + b, 0));

  /* ---------------- markup */
  const N8 = [0, 1, 2, 3, 4, 5, 6, 7];
  const glyphs = [
    ...N8.map(i => glyph(`co2-${i}`, co2G(4.6, -38))),
    ...N8.map(i => glyph(`reg-${i}`, rubpG(10))),
    ...N8.map(i => glyph(`red-${i}`, beadG('rfk-bead rfk-bead-c', 5.5))),
    ...N8.map(i => glyph(`sup-${i}`, tagG(i % 2 ? 'nadph' : 'atp', 18, 10))),
    ...N8.map(i => glyph(`exp-${i}`, tpG(26, 12))),
    ...N8.map(i => glyph(`pi-${i}`, beadG('rfk-bead rfk-bead-p', 6))),
    ...SPARE.map((_, i) => glyph(`spare-${i}`, rubpG(20))),
    ...PILE.map((_, i) => glyph(`pile-${i}`, tpG())),
  ].join('');
  const panel = makePanel(P, o.panel);

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    svg: () => `
      ${schemaCard(P)}
      <g clip-path="url(#${P}-vp)"><g data-k="cam"><g class="fig">${sceneSvg(`${P}s`, o.look)}
        <g class="rfs rfs-${o.look}">${glyphs}</g></g></g></g>
      ${panel.svg}`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const cam = q('cam'), scene = bindScene(cam, S);
      const glyphEls = new Map<string, { el: SVGElement }>();
      const put = (k: string, at: V, sc: number, a: number): void => {
        let g = glyphEls.get(k);
        if (!g) { g = { el: q(k) }; glyphEls.set(k, g); }
        op(g.el, a);
        if (a > 0.004) set(g.el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
      };
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(ENDS.length - 1, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, ENDS[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const V_ = (ch: string): number => TL.v(ch, b, tt);
        const abs = START[b] + tt;

        /* camera, text, lit parts */
        const c = TL.cam(b, tt), k = kOf(c.s);
        set(cam, 'transform', camStr(c));
        scene.scaleText(k);
        scene.light(p => V_(`L:${p}`));

        /* the panel */
        const ci = V_('ci'), a = An(ci);
        panel.draw(S, V_);

        /* the schema's story */
        const flow = Math.max(0, a + 1) / 36;
        const draw = (pre: string, path: (u: number) => V, omega: number, count: number, on: number, sc = 1): void => {
          stream(abs * omega, count).forEach(([u, vis], i) => put(`${pre}-${i}`, path(u), sc, on * vis));
        };
        draw('co2', PATH.co2, 0.45, 1 + 2 * flow, V_('o:sCO2'));
        draw('reg', PATH.regen, 0.32, 1 + 5 * flow, V_('o:sReg'));
        draw('red', PATH.reduce, 0.6, 1 + 5 * flow, V_('o:sRed'));
        draw('sup', PATH.supply, 0.55, 3, V_('o:sSup'));
        draw('exp', PATH.export, 0.22, 2, V_('o:sExp'));
        draw('pi', PATH.pi, 0.22, 2, V_('o:sExp'));
        SPARE.forEach((at, i) => put(`spare-${i}`, at, 1, V_('o:spare')));
        const nPile = Math.max(0, ((ci - JP) / (1200 - JP)) * PILE.length);
        PILE.forEach((at, i) => put(`pile-${i}`, at, 1, V_('o:pile') * Math.max(0, Math.min(1, nPile - i))));
      };
    },
  };
}
