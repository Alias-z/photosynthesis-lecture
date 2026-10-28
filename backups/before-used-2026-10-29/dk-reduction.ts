// 'reduction', staging s · "Reduction in the strip, per 1 CO₂" (slide C3 · Reduction of 3-PGA to triose phosphate;
// beats-reduction.ts; DARK_COUNTS_BRIEF.md, lecturer, 28 Oct 2026, evening). One fixed framing; counted per 1 CO₂, the
// smallest whole unit; every molecule has a visible source; ATP and NADPH bind each 3-PGA together.
// - Beat 1, Per 1 CO₂: the panel states the unit. The inputs come first and are numbered: CO₂ 1 glides in from below,
//   RuBP 1 appears under RuBisCO. RuBP 1 rises into the active site, CO₂ 1 docks, and 3-PGA 1 and 2 (the new carbon
//   ringed in 1) leave along the carboxylation arrow to their pile.
// - Beat 2, ATP and NADPH: "from carboxylation" under the pile; 3-PGA 1, then 2, glide into GAPDH while 1 ATP and 1 NADPH
//   glide in from the thylakoid edge's tags, all three arriving together; triose phosphate 1, then 2, leaves for its
//   pile; ADP, Pᵢ and NADP⁺ glide back to the thylakoid edge. Ledger: ATP 2, NADPH 2.
// - Beat 3, Light off: the thylakoid edge darkens; Bassham's light-off transient (Calvin 1961, Fig. 15) draws on as a
//   card. Per 1 CO₂ again: CO₂ 2 and RuBP 2 give 3-PGA 3 and 4, which stay in the pile: no ATP and no NADPH arrive.
//   Triose phosphate 1 and 2 wait at their place.
import lightPng from '../../assets/photos/c3-light.png';
import { REDUCTION } from './beats-reduction';
import {
  add, AT, card, carbN, CO2_FROM, CYCLE_VIEW, ease, fromLine, G, GLYPH, glide, makeStaging, numbered, numberedCo2, panelShow,
  panelSvg, path, pileName, PILE, reduceN, SITE, siteRing, T, type Actor, type Api, type Part, type Row,
} from './dk1-common';

/* ---------------------------------------------------------------- schedule (seconds into each beat) */

const IN1 = { co2: [0.3, 1.6], rubp: [0.4, 0.9] }, CARB1 = { t0: 2.0, d: 3.0 };
const RED = [{ t0: 0.6, d: 1.4 }, { t0: 2.6, d: 1.4 }];
const IN2 = { co2: [0.5, 1.7], rubp: [0.5, 1.0] }, CARB2 = { t0: 2.0, d: 2.6 };

/* ---------------------------------------------------------------- actors */

const KR = (j: number) => ({ pga: `p${j}`, atp: `at${j}`, nadph: `nd${j}`, tp: `t${j}`, adp: `ad${j}`, pi: `pi${j}`, nadp: `np${j}` });
const ACTORS: Actor[] = [
  numberedCo2('c1', 1), numbered('r1', 'PCCCCCP', 1), numbered('p1', 'CCCP', 1, 'n...'), numbered('p2', 'CCCP', 2),
  ...[1, 2].flatMap(j => [{ k: `at${j}`, g: GLYPH.atp() }, { k: `nd${j}`, g: GLYPH.nadph() }, numbered(`t${j}`, 'CCCP', j, j === 1 ? 'n...' : undefined),
    { k: `ad${j}`, g: GLYPH.adp() }, { k: `pi${j}`, g: GLYPH.pi() }, { k: `np${j}`, g: GLYPH.nadp() }]),
  numberedCo2('c2', 2), numbered('r2', 'PCCCCCP', 2), numbered('p3', 'CCCP', 3, 'n...'), numbered('p4', 'CCCP', 4),
];

/* ---------------------------------------------------------------- panel and card (stage units) */

const CX = 1146, CW = 430;
const n = (k: string): string => `<tspan data-k="${k}">0</tspan>`;
const ROWS: Row[] = [
  { k: 'r-h', h: 34, html: 'per 1 CO₂', cls: 'dk-ph' },
  { k: 'r-in', h: 32, html: `CO₂ ${n('n-co2')} · RuBP ${n('n-rubp')}` },
  { k: 'r-pga', h: 32, html: `3-PGA ${n('n-pga')}` },
  { k: 'r-red', h: 32, html: `ATP ${n('n-atp')} · NADPH ${n('n-nadph')}` },
  { k: 'r-tp', h: 34, html: `triose phosphate ${n('n-tp')}` },
  { k: 'r-off', h: 32, html: `light off: CO₂ ${n('n-co2b')} · RuBP ${n('n-rubpb')}` },
  { k: 'r-wait', h: 34, html: `3-PGA ${n('n-wait')}, not reduced` },
];
const LW = 1423, LH = 823, L_OFF = 172 + 1.1625 * 400, L_END = 172 + 1.1625 * 705;
function lightCard(p: string): string {
  const iw = CW - 30, s = iw / LW, ih = LH * s, ix = CX + 15, iy = 86;
  return `<defs><clipPath id="${p}-c15"><rect data-k="c15-clip" x="${ix}" y="${iy}" width="${(L_OFF * s).toFixed(1)}" height="${ih.toFixed(1)}"/></clipPath></defs>
    ${card(p, 'c15', CX, 34, CW, ih + 96, `${T(CX + 20, 70, 'Bassham: light off', 'dk-ctitle', 'start')}
      <image class="dk-mult" href="${lightPng}" x="${ix}" y="${iy}" width="${iw}" height="${ih.toFixed(1)}" clip-path="url(#${p}-c15)"/>
      ${T(CX + 20, iy + ih + 26, 'Calvin 1961, Nobel lecture, Fig. 15 · © The Nobel Foundation 1961', 'dk-ccr', 'start')}`, -1, 37)}`;
}
const clipW = (u: number): string => (((L_OFF + (L_END - L_OFF) * u) * (CW - 30)) / LW).toFixed(1);

/* ---------------------------------------------------------------- the frame */

/** An input CO₂ gliding in from below the frame to its place (then waiting there until used). */
const co2In = (a: Api, t: number, key: string, [t0, t1]: number[]): void =>
  a.put(key, glide(path([CO2_FROM, add(AT.co2(0), [-12, 90]), AT.co2(0)]), t, t0, t1), ease(t, t0, t0 + 0.3), PILE);
const rubpIn = (a: Api, t: number, key: string, [t0, t1]: number[]): void => a.put(key, AT.rubp(0), ease(t, t0, t1), PILE);

function frame(a: Api, beat: number, t: number): void {
  a.pos('site', SITE); a.op('site', 1);
  a.pos('l-co2', add(G.co2, [0, -24])); a.pos('l-rubp', add(AT.rubp(0), [-69, 6])); a.pos('l-tp', add(G.tp, [-96, -8]));
  a.pos('f-carb', add(G.pga, [0, 50]));
  const T1 = beat === 0 ? t : 99, T3 = beat === 2 ? t : -1;
  // beat 1: the inputs, then carboxylation
  if (beat === 0) {
    if (t < CARB1.t0) { co2In(a, t, 'c1', IN1.co2); rubpIn(a, t, 'r1', IN1.rubp); }
    carbN(a, t, { ...CARB1, co2: AT.co2(0), rubp: AT.rubp(0), to: [AT.pga(0), AT.pga(1)], k: { rb: 'r1', g: 'c1', a: 'p1', b: 'p2' } });
  }
  const tm1 = CARB1.t0 + 0.56 * CARB1.d;
  // beat 2: each 3-PGA with 1 ATP and 1 NADPH into GAPDH; triose phosphate out
  let nRed = 0;
  RED.forEach((r, j) => {
    const from = AT.pga(j), key = KR(j + 1);
    if (beat === 1) {
      if (t < r.t0) a.put(key.pga, from, 1, PILE);
      if (reduceN(a, t, r.t0, r.d, from, AT.tp(j), key)) nRed++;
    } else if (beat === 2) a.put(key.tp, AT.tp(j), 1, PILE);
    if (beat === 2) nRed++;
  });
  a.op('f-carb', beat === 1 ? ease(t, 0.1, 0.4) * (1 - ease(t, 2.4, 2.8)) : 0);
  // beat 3: light off; CO₂ 2 and RuBP 2 give 3-PGA 3 and 4, which wait
  if (beat === 2) {
    if (t < CARB2.t0) { co2In(a, t, 'c2', IN2.co2); rubpIn(a, t, 'r2', IN2.rubp); }
    carbN(a, t, { ...CARB2, co2: AT.co2(0), rubp: AT.rubp(0), to: [AT.pga(0), AT.pga(1)], k: { rb: 'r2', g: 'c2', a: 'p3', b: 'p4' } });
  }
  const tm2 = CARB2.t0 + 0.56 * CARB2.d;
  a.op('c15', beat === 2 ? ease(t, 0.2, 0.7) : 0);
  a.attr('c15-clip', 'width', clipW(beat === 2 ? ease(t, 1.0, 4.6) : 0));
  // names of the places in use
  a.op('l-co2', beat === 0 ? ease(t, 0.3, 0.7) * (1 - ease(t, tm1, tm1 + 0.4)) : beat === 2 ? ease(t, 0.5, 0.9) * (1 - ease(t, tm2, tm2 + 0.4)) : 0);
  a.op('l-rubp', beat === 0 ? ease(t, 0.4, 0.9) * (1 - ease(t, CARB1.t0, CARB1.t0 + 0.4)) : beat === 2 ? ease(t, 0.5, 1.0) * (1 - ease(t, CARB2.t0, CARB2.t0 + 0.4)) : 0);
  a.op('l-tp', beat === 1 ? ease(t, RED[0].t0 + RED[0].d, RED[0].t0 + RED[0].d + 0.4) : beat === 2 ? 1 : 0);
  // the panel, per 1 CO₂: every count is a drawn molecule
  a.txt('n-co2', String(T1 >= IN1.co2[1] ? 1 : 0)); a.txt('n-rubp', String(T1 >= IN1.rubp[1] ? 1 : 0));
  a.txt('n-pga', String(T1 >= tm1 + 0.15 ? 2 : T1 >= tm1 ? 1 : 0));
  a.txt('n-atp', String(nRed)); a.txt('n-nadph', String(nRed)); a.txt('n-tp', String(nRed));
  a.txt('n-co2b', String(T3 >= IN2.co2[1] ? 1 : 0)); a.txt('n-rubpb', String(T3 >= IN2.rubp[1] ? 1 : 0));
  a.txt('n-wait', String(T3 >= tm2 + 0.15 ? 2 : T3 >= tm2 ? 1 : 0));
  const on = (b: number, t0: number): number => (beat < b ? 0 : beat > b ? 1 : ease(t, t0, t0 + 0.3));
  panelShow(a, 'panel', ROWS, {
    'r-h': on(0, 0), 'r-in': on(0, 0.3), 'r-pga': on(0, tm1 - 0.2), 'r-red': on(1, RED[0].t0), 'r-tp': on(1, RED[0].t0),
    'r-off': on(2, 0.4), 'r-wait': on(2, tm2 - 0.2),
  });
}

const LIT: Part[][] = [
  ['rubisco', 'co2', 'carbox', 'pga'],
  ['thyl', 'light', 'supply', 'reduce', 'pga', 'tp'],
  ['rubisco', 'co2', 'carbox', 'pga', 'tp'],
];

export const STAGING = makeStaging({
  id: 's',
  name: 's · In the strip, per 1 CO₂',
  note: 'Reduction in the dark-reaction strip, per 1 CO₂: CO₂ 1 and RuBP 1 give 3-PGA 1 and 2; each takes 1 ATP and 1 NADPH together at GAPDH and becomes triose phosphate 1, 2; ADP, Pᵢ and NADP⁺ back; light off: CO₂ 2 and RuBP 2 give 3-PGA 3, 4, which are not reduced (Bassham’s curve)',
  beats: REDUCTION,
  dropGlyph: ['co2', 'rubisco', 'pga', 'tp'], dropName: ['co2', 'rubisco', 'tp'],
  actors: ACTORS,
  world: () => `${siteRing('site', '')}${pileName('l-co2', 'CO₂')}${pileName('l-rubp', 'RuBP', 'end')}${pileName('l-tp', 'triose phosphate', 'end')}${fromLine('f-carb', 'from carboxylation')}`,
  hud: p => `${panelSvg('panel', CX, 380, CW, ROWS)}${lightCard(p)}`,
  cam0: CYCLE_VIEW, cams: [CYCLE_VIEW, CYCLE_VIEW, CYCLE_VIEW], camT: [[0, 1], [0, 1], [0, 1]],
  lit: LIT,
  frame,
});
