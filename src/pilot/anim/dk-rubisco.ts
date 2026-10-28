// 'rubisco', staging s · "RuBisCO in the strip" (slide R1 · RuBisCO; beats-rubisco.ts; approved script of 28 Oct 2026,
// replacing cb2). The arrangement is the two-sided one of figs/rubside.ts: RuBP rises into RuBisCO from below, CO₂ comes
// in on the carboxylation side (left) and O₂ on the oxygenation side (right), and each reaction's products leave on its
// own side. Every place is read from the strip (cell-schema.ts SPOT, through dk1-common's adapter G).
// One fixed camera for the whole animation (lecturer, 28 Oct 2026: no zoom, no pan): RuBisCO, RuBP below, CO₂ left, O₂
// right, both product sides and, upper left, the sugar → bread target. Every molecule moves on one smooth eased curve.
// - Beat 1, RuBP: RuBisCO lights; its active site is named; a RuBP (P–C–C–C–C–C–P) rises from below into it.
// - Beat 2, Carboxylation: CO₂ comes in from the left and docks; 2 3-PGA leave up-left along the carboxylation arrow.
//   The tally "3-PGA from CO₂" ticks 1, 2.
// - Beat 3, Oxygenation: a second RuBP rises in; O₂ comes in from the right; 1 3-PGA and 2-phosphoglycolate (rust) leave
//   up-right. The tally "3-PGA from O₂" ticks 1.
// - Beat 4, 3-PGA makes sugar: the sugar → bread target fades in, upper left; the 3 3-PGA glide into the sugar, each on
//   one curve; then the bread (figs/grain.ts) lights. The 2-phosphoglycolate stays behind, dimmed.
import { breadG } from '../figs/grain';
import { RUBISCO } from './beats-rubisco';
import {
  add, ease, G, GLYPH, glide, lerp, lerpV, life, makeStaging, panelShow, panelSvg, path, PGA_AT, PILE, SITE, siteRing, T, view,
  type Actor, type Api, type Part, type Row, type V,
} from './dk1-common';

/* ---------------------------------------------------------------- the camera: one framing, fixed */

const CAM = view(1.75, add(G.rub, [-30, -30]), [800, 370]);
/** A stage point (the fixed camera's frame) in strip units. */
const toWorld = (p: V): V => [CAM.c[0] + (p[0] - 800) / CAM.s, CAM.c[1] + (p[1] - 370) / CAM.s];

/* ---------------------------------------------------------------- places (strip units) */

const RUBP_IN: V[] = [G.rubp, G.rubpFrom, G.rubpTo, SITE];
const CO2_IN: V[] = [G.co2, G.co2From, G.co2To];
const O2_IN: V[] = [G.o2, G.o2From, G.o2To];
const [C0, C1] = [G.carboxFrom, G.carboxTo], [O0, O1] = [G.oxyFrom, G.oxyTo];
/** Where the products rest: 2 3-PGA in the strip's 3-PGA pile (left); the oxygenation's 3-PGA at the strip's own place for it (right). */
const PGA_C: V[] = [PGA_AT(0), PGA_AT(1)];
const PGA_O: V = G.oxyPga;
/** The sugar → bread target (stage units, upper left, under the tally): a card with a sugar cube, an arrow, the bread. It
 *  is drawn in the world under the moving molecules (mapped through the fixed camera), so the 3-PGA glide over it. */
const TG = { x: 24, y: 126, w: 330, h: 142, cube: [104, 192] as V, bread: [270, 190] as V };
const SUGAR: V = toWorld(TG.cube);
/** One smooth curve from a point to the sugar: a gentle bow upward through the midpoint. */
const toSugar = (from: V, bow: number): V[] => {
  const m = lerpV(from, SUGAR, 0.5), d = [SUGAR[0] - from[0], SUGAR[1] - from[1]], L = Math.hypot(d[0], d[1]) || 1;
  return [from, [m[0] + (d[1] / L) * bow, m[1] - Math.abs(d[0] / L) * bow], SUGAR];
};

/* ---------------------------------------------------------------- actors */

const ACTORS: Actor[] = [
  { k: 'rb1', g: GLYPH.carbon('PCCCCCP') }, { k: 'rb2', g: GLYPH.carbon('PCCCCCP') },
  { k: 'co2', g: GLYPH.co2() }, { k: 'o2', g: GLYPH.o2() },
  { k: 'ca', g: GLYPH.carbon('CCCP', 'n...') }, { k: 'cb', g: GLYPH.carbon('CCCP') },
  { k: 'oa', g: GLYPH.carbon('CCCP') }, { k: 'ob', g: GLYPH.carbon('CCP', 'oo.') },
];

/* ---------------------------------------------------------------- the tally and the target (stage units) */

const n = (k: string): string => `<tspan data-k="${k}">0</tspan>`;
const ROWS: Row[] = [
  { k: 'r-c', h: 34, html: `3-PGA from CO₂: ${n('n-c')}` },
  { k: 'r-o', h: 36, html: `3-PGA from O₂: ${n('n-o')}` },
];
/** A sugar cube: three faces, white, outlined. */
const cubeG = (x: number, y: number, s: number): string => {
  const p = (q: Array<[number, number]>): string => q.map(([a, b], i) => `${i ? 'L' : 'M'}${(x + a * s).toFixed(1)},${(y + b * s).toFixed(1)}`).join('') + 'Z';
  return `<path class="dk-cube" d="${p([[-20, -10], [0, -20], [20, -10], [0, 0]])}"/><path class="dk-cube dk-cube-l" d="${p([[-20, -10], [0, 0], [0, 24], [-20, 14]])}"/><path class="dk-cube dk-cube-r" d="${p([[0, 0], [20, -10], [20, 14], [0, 24]])}"/>`;
};
const targetSvg = (p: string): string => `<g data-k="tg" display="none" transform="translate(${(CAM.c[0] - 800 / CAM.s).toFixed(2)} ${(CAM.c[1] - 370 / CAM.s).toFixed(2)}) scale(${(1 / CAM.s).toFixed(5)})">
    <rect class="dk-panel" x="${TG.x}" y="${TG.y}" width="${TG.w}" height="${TG.h}" rx="14"/>
    <g data-k="tg-glow" display="none"><circle cx="${TG.cube[0]}" cy="${TG.cube[1]}" r="44" fill="url(#${p}-pool)"/></g>
    <g data-k="tg-cube">${cubeG(TG.cube[0], TG.cube[1] - 2, 1.25)}${T(TG.cube[0], TG.y + TG.h - 18, 'sugar', 'cel-mn')}</g>
    <g data-k="tg-bread">${arrowR(TG.cube[0] + 44, TG.bread[0] - 50, TG.cube[1])}${breadG(TG.bread[0], TG.bread[1] - 2, 0.78)}${T(TG.bread[0], TG.y + TG.h - 18, 'bread', 'cel-mn')}</g></g>`;
const arrowR = (x0: number, x1: number, y: number): string =>
  `<path class="dk-tga" d="M${x0},${y}H${x1 - 10}"/><path class="dk-tgh" d="M${x1},${y}l-13,-7.5v15z"/>`;

/* ---------------------------------------------------------------- the frame */

const sc = (a0: number, a1: number, u: number): number => lerp(a0, a1, u);

interface Prod { k: string; from: number; via: V[]; to: V; dt: number }
/** One gas docking on the RuBP in the site and the two products leaving to their places (times in the beat). */
function reaction(a: Api, t: number, o: { gas: 'co2' | 'o2'; tg: number; tm: number; rb: string; prods: Prod[] }): void {
  const K = a.k, dock: V = add(SITE, [0, -24 * K]);
  if (t < o.tm + 0.3) {
    a.put(o.rb, SITE, 1 - ease(t, o.tm, o.tm + 0.22));
    if (t >= o.tg) a.put(o.gas, glide(path([...(o.gas === 'co2' ? CO2_IN : O2_IN), dock]), t, o.tg, o.tm - 0.15), 1 - ease(t, o.tm, o.tm + 0.2));
  }
  if (t > o.tm - 0.12 && t < o.tm + 0.55) a.put('fl', SITE, life(t, o.tm - 0.12, o.tm + 0.04, o.tm + 0.12, o.tm + 0.55));
  if (t >= o.tm) o.prods.forEach(q => {
    const split = add(SITE, [q.from * K, 0]), t0 = o.tm + 0.15 + q.dt;
    a.put(q.k, glide(path([split, ...q.via, q.to]), t, t0, t0 + 1.4), ease(t, o.tm, o.tm + 0.2), sc(1, PILE, ease(t, t0 + 0.4, t0 + 1.4)));
  });
}
/** Carboxylation: both 3-PGA leave up-left along the carboxylation arrow. */
const CARBOX = { gas: 'co2' as const, tg: 0.3, tm: 1.8, rb: 'rb1', prods: [
  { k: 'ca', from: -40, via: [lerpV(C0, C1, 0.1), lerpV(C0, C1, 0.85)], to: PGA_C[0], dt: 0 },
  { k: 'cb', from: -10, via: [lerpV(C0, C1, 0.3), lerpV(C0, C1, 0.95)], to: PGA_C[1], dt: 0.2 },
] };
/** Oxygenation: both products leave up-right, 3-PGA along its arrow, 2-phosphoglycolate along the oxygenation arrow. */
const OXY = { gas: 'o2' as const, tg: 0.7, tm: 2.2, rb: 'rb2', prods: [
  { k: 'oa', from: 10, via: [G.oxyPgaFrom, G.oxyPgaTo], to: PGA_O, dt: 0 },
  { k: 'ob', from: 40, via: [lerpV(O0, O1, 0.15), lerpV(O0, O1, 0.85)], to: G.pg2, dt: 0.1 },
] };
/** Beat 4: each 3-PGA into the sugar (start, end); the bread lights after the last. */
const SUG = [{ k: 'ca', from: PGA_C[0], t: [0.8, 2.6], bow: 14 }, { k: 'cb', from: PGA_C[1], t: [1.1, 3.0], bow: 18 }, { k: 'oa', from: PGA_O, t: [0.9, 3.5], bow: 30 }];

function frame(a: Api, beat: number, t: number): void {
  // the active site: ring; its name until the first RuBP is in
  a.pos('site', SITE); a.op('site', beat === 0 ? ease(t, 0.3, 0.8) : beat === 3 ? 1 - ease(t, 0, 0.6) : 1);
  a.op('l-site', beat === 0 ? life(t, 0.3, 0.8, 2.6, 3.0) : 0);
  // beat 1: RuBP rises into the site
  if (beat === 0) a.put('rb1', glide(path(RUBP_IN), t, 1.0, 2.5), ease(t, 0.95, 1.1));
  // beat 2: carboxylation
  if (beat === 1) reaction(a, t, CARBOX);
  if (beat === 2) reaction(a, 99, CARBOX);
  // beat 3: a second RuBP, oxygenation
  if (beat === 2) {
    if (t < OXY.tm) a.put('rb2', glide(path(RUBP_IN), t, 0.2, 1.4), ease(t, 0.15, 0.3));
    reaction(a, t, OXY);
  }
  // the tally
  const nC = beat === 1 ? Number(t >= CARBOX.tm + 0.15) + Number(t >= CARBOX.tm + 0.35) : beat >= 2 ? 2 : 0;
  const nO = beat === 2 ? Number(t >= OXY.tm + 0.15) : beat >= 3 ? 1 : 0;
  a.txt('n-c', String(nC)); a.txt('n-o', String(nO));
  panelShow(a, 'panel', ROWS, { 'r-c': beat === 1 ? ease(t, 1.6, 1.9) : beat >= 2 ? 1 : 0, 'r-o': beat === 2 ? ease(t, 2.0, 2.3) : beat >= 3 ? 1 : 0 });
  // beat 4: the 3 3-PGA into the sugar, then the bread; 2-phosphoglycolate stays behind, dimmed
  a.op('tg', beat === 3 ? ease(t, 0.1, 0.6) : 0);
  if (beat === 3) {
    for (const q of SUG) {
      const [t0, t1] = q.t;
      if (t < t1 + 0.3) a.put(q.k, t < t0 ? q.from : glide(path(toSugar(q.from, q.bow)), t, t0, t1), 1 - ease(t, t1 - 0.15, t1 + 0.2), sc(PILE, 0.75, ease(t, t0, t1)));
    }
    const last = SUG[SUG.length - 1].t[1];
    a.op('tg-glow', 0.9 * life(t, SUG[0].t[1] - 0.2, SUG[0].t[1] + 0.2, last + 0.4, last + 1.0));
    a.op('tg-cube', 0.45 + 0.55 * ease(t, SUG[0].t[1] - 0.2, SUG[0].t[1] + 0.2));
    a.op('tg-bread', 0.3 + 0.7 * ease(t, last + 0.3, last + 1.1));
    a.put('ob', G.pg2, 1 - 0.55 * ease(t, 0.2, 1.2), PILE);
  }
}

const LIT: Part[][] = [
  ['rubisco'],
  ['rubisco', 'co2', 'carbox', 'pga'],
  ['rubisco', 'co2', 'carbox', 'pga', 'o2', 'oxy', 'pg2'],
  ['rubisco', 'co2', 'carbox', 'pga'],
];

export const STAGING = makeStaging({
  id: 's',
  name: 's · In the strip',
  note: 'RuBisCO in the dark-reaction strip, two-sided, one fixed view: RuBP rises in from below; CO₂ from the left gives 2 3-PGA up-left, O₂ from the right gives 1 3-PGA and 2-phosphoglycolate up-right; the 3-PGA glide into sugar, which becomes bread; 2-phosphoglycolate stays behind',
  beats: RUBISCO,
  dropGlyph: ['pga', 'pg2', 'oxy'],
  actors: ACTORS,
  leads: [{ k: 'l-site', at: SITE, o: [9, -8], d: [120, -52], text: 'active site' }],
  world: p => `${siteRing('site', '')}${targetSvg(p)}`,
  hud: () => panelSvg('panel', 24, 24, 330, ROWS),
  cam0: CAM, cams: [CAM, CAM, CAM, CAM], camT: [[0, 1], [0, 1], [0, 1], [0, 1]],
  lit: LIT,
  frame,
});
