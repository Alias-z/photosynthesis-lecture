// 'rubisco', staging s · "RuBisCO in the strip" (slide R1 · RuBisCO; beats-rubisco.ts; approved script of 28 Oct 2026,
// replacing cb2). The arrangement is the two-sided one of figs/rubside.ts: RuBP rises into RuBisCO from below, CO₂ comes
// in on the carboxylation side (left) and O₂ on the oxygenation side (right), and each reaction's products leave on its
// own side. Every place is read from the strip (cell-schema.ts SPOT, through dk1-common's adapter G); while SPOT still has
// RuBP above RuBisCO, this staging leaves out the strip's RuBP and its arrow and keeps its own RuBP below RuBisCO.
// - Beat 1, RuBP: the camera comes from the whole strip onto RuBisCO (lit); its active site is named; a RuBP
//   (P–C–C–C–C–C–P) rises from below into it.
// - Beat 2, Carboxylation: CO₂ comes in from the left and docks; 2 3-PGA leave up-left along the carboxylation arrow.
//   The tally "3-PGA from CO₂" ticks 1, 2.
// - Beat 3, Oxygenation: a second RuBP rises in; O₂ comes in from the right; 1 3-PGA and 2-phosphoglycolate (rust) leave
//   up-right. The tally "3-PGA from O₂" ticks 1.
// - Beat 4, 3-PGA makes sugar: the camera pulls back; the 3 3-PGA glide on through the cycle's side and TPT into sucrose
//   in the cytosol; sucrose goes on to a slice of bread (figs/grain.ts). The 2-phosphoglycolate stays behind, dimmed.
import { breadG } from '../figs/grain';
import { RUBISCO } from './beats-rubisco';
import {
  add, ease, G, GLYPH, glide, lerp, lerpV, life, makeStaging, panelShow, panelSvg, path, PGA_AT, PILE, SITE, siteRing, T, view,
  type Actor, type Api, type Part, type Row, type V,
} from './dk1-common';

/* ---------------------------------------------------------------- places (strip units) */

/** RuBP below RuBisCO: the strip's own once SPOT has it there, else this staging's. */
const RUBP_BELOW = G.rubp[1] > G.rub[1] + 40;
const RSRC: V = RUBP_BELOW ? G.rubp : add(G.rub, [0, 150]);
const RUBP_IN: V[] = RUBP_BELOW ? [G.rubp, G.rubpFrom, G.rubpTo, SITE] : [RSRC, add(RSRC, [6, -64]), SITE];
const CO2_IN: V[] = [G.co2, G.co2From, G.co2To];
const O2_IN: V[] = [G.o2, G.o2From, G.o2To];
const [C0, C1] = [G.carboxFrom, G.carboxTo], [O0, O1] = [G.oxyFrom, G.oxyTo];
/** Where the products rest: 2 3-PGA in the strip's 3-PGA pile (left); the oxygenation's 3-PGA at the strip's own place for it (right). */
const PGA_C: V[] = [PGA_AT(0), PGA_AT(1)];
const PGA_O: V = G.oxyPga;
/** Beat 4: on through the cycle's side and TPT into sucrose; sucrose on to bread, beyond the cytosol. */
const TO_SUGAR_L = (from: V): V[] => [from, add(G.gap, [-30, 40]), add(G.tp, [-40, 20]), add(G.tp, [80, 0]), [600, 96], [760, 100], [858, 98], G.sucrose];
const TO_SUGAR_R = (from: V): V[] => [from, add(from, [70, -62]), [600, 108], [760, 100], [858, 98], G.sucrose];
const BREAD: V = add(G.sucrose, [232, -52]);

/* ---------------------------------------------------------------- actors */

const ACTORS: Actor[] = [
  ...(RUBP_BELOW ? [] : [{ k: 'rsrc', g: GLYPH.carbon('PCCCCCP'), lab: 'RuBP', dy: 34, cls: 'cel-mn cel-halo' }]),
  { k: 'rb1', g: GLYPH.carbon('PCCCCCP') }, { k: 'rb2', g: GLYPH.carbon('PCCCCCP') },
  { k: 'co2', g: GLYPH.co2() }, { k: 'o2', g: GLYPH.o2() },
  { k: 'ca', g: GLYPH.carbon('CCCP', 'n...') }, { k: 'cb', g: GLYPH.carbon('CCCP') },
  { k: 'oa', g: GLYPH.carbon('CCCP') }, { k: 'ob', g: GLYPH.carbon('CCP', 'oo.') },
  { k: 'suc', g: `<g transform="translate(0 -11)">${GLYPH.carbon('CCCCCC', undefined, 9)}</g><g transform="translate(0 11)">${GLYPH.carbon('CCCCCC', undefined, 9)}</g>` },
];

/* ---------------------------------------------------------------- the tally (stage units) */

const n = (k: string): string => `<tspan data-k="${k}">0</tspan>`;
const ROWS: Row[] = [
  { k: 'r-c', h: 34, html: `3-PGA from CO₂: ${n('n-c')}` },
  { k: 'r-o', h: 36, html: `3-PGA from O₂: ${n('n-o')}` },
];

/* ---------------------------------------------------------------- the frame */

const ZR = view(1.9, add(G.rub, [10, 20]), [800, 380]);
const ZW = view(1.02, [600, 230], [800, 370]);
const sc = (a0: number, a1: number, u: number): number => lerp(a0, a1, u);

/** One gas docking on the RuBP in the site and the two products leaving to their places (times in the beat). */
function reaction(a: Api, t: number, o: { gas: 'co2' | 'o2'; tg: number; tm: number; rb: string; prods: Array<{ k: string; via: V[]; to: V; dt: number }> }): void {
  const K = a.k, dock: V = add(SITE, [0, -24 * K]);
  if (t < o.tm + 0.3) {
    a.put(o.rb, SITE, 1 - ease(t, o.tm, o.tm + 0.22));
    if (t >= o.tg) a.put(o.gas, glide(path([...(o.gas === 'co2' ? CO2_IN : O2_IN), dock]), t, o.tg, o.tm - 0.15), 1 - ease(t, o.tm, o.tm + 0.2));
  }
  if (t > o.tm - 0.12 && t < o.tm + 0.55) a.put('fl', SITE, life(t, o.tm - 0.12, o.tm + 0.04, o.tm + 0.12, o.tm + 0.55));
  if (t >= o.tm) o.prods.forEach((q, i) => {
    const split = add(SITE, [(i ? 46 : -46) * K, 0]), t0 = o.tm + 0.15 + q.dt;
    a.put(q.k, glide(path([split, ...q.via, q.to]), t, t0, t0 + 1.4), ease(t, o.tm, o.tm + 0.2), sc(1, PILE, ease(t, t0 + 0.4, t0 + 1.4)));
  });
}
const CARBOX = { gas: 'co2' as const, tg: 0.3, tm: 1.8, rb: 'rb1', prods: [
  { k: 'ca', via: [lerpV(C0, C1, 0.1), lerpV(C0, C1, 0.85)], to: PGA_C[0], dt: 0 },
  { k: 'cb', via: [add(lerpV(C0, C1, 0.2), [40, -6]), lerpV(C0, C1, 0.95)], to: PGA_C[1], dt: 0.15 },
] };
const OXY = { gas: 'o2' as const, tg: 0.7, tm: 2.2, rb: 'rb2', prods: [
  { k: 'oa', via: [G.oxyPgaFrom, G.oxyPgaTo], to: PGA_O, dt: 0 },
  { k: 'ob', via: [lerpV(O0, O1, 0.15), lerpV(O0, O1, 0.85)], to: G.pg2, dt: 0.1 },
] };

function frame(a: Api, beat: number, t: number): void {
  if (!RUBP_BELOW) a.put('rsrc', RSRC, beat === 0 ? ease(t, 0.6, 1.2) : 1);
  // the active site: ring; its name until the first RuBP is in
  a.pos('site', SITE); a.op('site', beat === 0 ? ease(t, 1.8, 2.3) : beat === 3 ? 1 - ease(t, 0, 0.6) : 1);
  a.op('l-site', beat === 0 ? life(t, 1.8, 2.3, 3.4, 3.8) : 0);
  // beat 1: RuBP rises into the site
  if (beat === 0) a.put('rb1', glide(path(RUBP_IN), t, 2.4, 3.9), ease(t, 2.35, 2.5));
  // beat 2: carboxylation
  if (beat === 1) reaction(a, t, CARBOX);
  if (beat >= 2) reaction(a, 99, CARBOX);
  // beat 3: a second RuBP, oxygenation
  if (beat === 2) {
    if (t < OXY.tm) a.put('rb2', glide(path(RUBP_IN), t, 0.2, 1.4), ease(t, 0.15, 0.3));
    reaction(a, t, OXY);
  }
  if (beat === 3) reaction(a, 99, OXY);
  // the tally
  const nC = beat === 1 ? Number(t >= CARBOX.tm + 0.15) + Number(t >= CARBOX.tm + 0.3) : beat >= 2 ? 2 : 0;
  const nO = beat === 2 ? Number(t >= OXY.tm + 0.15) : beat >= 3 ? 1 : 0;
  a.txt('n-c', String(nC)); a.txt('n-o', String(nO));
  panelShow(a, 'panel', ROWS, { 'r-c': beat === 1 ? ease(t, 1.6, 1.9) : beat >= 2 ? 1 : 0, 'r-o': beat === 2 ? ease(t, 2.0, 2.3) : beat >= 3 ? 1 : 0 });
  // beat 4: the 3 3-PGA on to sucrose, sucrose on to bread; 2-phosphoglycolate stays behind, dimmed
  if (beat === 3) {
    const go = (k: string, q: V[], t0: number): void => {
      if (t >= t0) a.put(k, glide(path(q), t, t0, t0 + 2.8), 1 - ease(t, t0 + 2.6, t0 + 2.95), sc(PILE, 1, ease(t, t0, t0 + 0.8)));
    };
    go('ca', TO_SUGAR_L(PGA_C[0]), 0.5); go('cb', TO_SUGAR_L(PGA_C[1]), 0.75); go('oa', TO_SUGAR_R(PGA_O), 1.0);
    a.put('ob', G.pg2, 1 - 0.55 * ease(t, 0.2, 1.2), PILE);
    if (t > 3.9) a.put('suc', glide(path([G.sucrose, lerpV(G.sucrose, BREAD, 0.5), add(BREAD, [-6, 30])]), t, 4.0, 5.3), life(t, 3.9, 4.1, 5.1, 5.4));
    const b = ease(t, 5.0, 5.8);
    a.pos('bread', BREAD, 0.6 + 0.4 * b); a.op('bread', b);
  } else a.op('bread', 0);
}

const LIT: Part[][] = [
  ['rubisco'],
  ['rubisco', 'co2', 'carbox', 'pga'],
  ['rubisco', 'co2', 'carbox', 'pga', 'o2', 'oxy', 'pg2'],
  ['rubisco', 'co2', 'carbox', 'pga', 'reduce', 'tp', 'export'],
];

export const STAGING = makeStaging({
  id: 's',
  name: 's · In the strip',
  note: 'RuBisCO in the dark-reaction strip, two-sided: RuBP rises in from below; CO₂ from the left gives 2 3-PGA up-left, O₂ from the right gives 1 3-PGA and 2-phosphoglycolate up-right; the 3-PGA go on to sucrose and bread, 2-phosphoglycolate stays behind',
  beats: RUBISCO,
  dropGlyph: RUBP_BELOW ? ['pga', 'pg2', 'oxy'] : ['rubisco', 'pga', 'pg2', 'oxy'],
  dropName: RUBP_BELOW ? [] : ['rubisco'],
  dropFlow: RUBP_BELOW ? [] : ['rubisco'],
  actors: ACTORS,
  leads: [{ k: 'l-site', at: SITE, o: [9, -8], d: [120, -52], text: 'active site' }],
  world: () => `${siteRing('site', '')}<g data-k="bread" display="none">${breadG(0, 0, 1)}${T(0, 66, 'bread', 'cel-mn cel-halo')}</g>`,
  hud: () => panelSvg('panel', 24, 24, 330, ROWS),
  cam0: view(1.03, [770, 300]), cams: [ZR, ZR, ZR, ZW], camT: [[0.3, 2.4], [0, 1], [0, 1], [0, 2.2]],
  lit: LIT,
  frame,
});
