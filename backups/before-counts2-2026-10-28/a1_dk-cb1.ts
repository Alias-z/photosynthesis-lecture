// cb1, staging s · "The cycle in the strip" (slide C1, beats CB1; DARK_ANIM_BRIEF.md): the 1950s ¹⁴C history told on the
// dark-reaction strip, then the cycle counted per 3 CO₂.
// - Beat 1, Carbon-14: the camera comes from the whole strip into the stroma; ¹⁴CO₂ (its carbon ringed amber, the
//   tracer) comes in to RuBisCO's side. Card: the "lollipop" (Berkeley Lab photo).
// - Beat 2, Shorter feeds: RuBP and ¹⁴CO₂ meet at RuBisCO's active site; 2 3-PGA leave, the ¹⁴C in one of them. Card:
//   Calvin's 5 s film (Nobel lecture, Fig. 6), its PGA spot ringed.
// - Beat 3, Spots into a cycle: the ¹⁴C is followed: 3-PGA into GAPDH, triose phosphate out, into PRK, RuBP out and
//   back to its place; GAPDH, triose phosphate and PRK light as the label reaches them. Card: Bassham et al. 1954, the
//   cycle as they drew it.
// - Beat 4, Per 3 CO₂ (three steps, a click between): 3 RuBP and 3 CO₂ → 6 3-PGA; 6 × (3-PGA + ATP + NADPH) at GAPDH →
//   6 triose phosphate, ADP + Pᵢ and NADP⁺ back to the thylakoid edge; 5 triose phosphate into PRK → 3 RuBP with 3 ATP,
//   1 triose phosphate out through TPT. The panel (per 3 CO₂) ticks every event.
import lolJpg from '../../assets/photos/cb-lollipop-lbl.jpg';
import f5Png from '../../assets/photos/c2-5s.png';
import b54Png from '../../assets/photos/cb-bassham1954.png';
import { CB1 } from './beats-cb';
import {
  add, card, CYCLE_VIEW, ease, G, GLYPH, glide, lerpV, intoPrk, life, makeStaging, newRubp, panelShow, panelSvg, path, PGA_AT, PILE, reduction,
  RUBP_AT, rubEvent, SITE, siteRing, T, TP_AT, tpExport, view, WAY, type Actor, type Api, type Part, type Row, type RubEv, type V,
} from './dk1-common';

/* ---------------------------------------------------------------- places (strip units, from the adapter G) */

const PGA = PGA_AT, TPS = TP_AT, RUBS = RUBP_AT;
const PGA_UP = WAY.pgaUp, TO_PRK = WAY.toPrk, PRK_OUT = WAY.prkOut, TP_OUT = WAY.tpOut;

/* ---------------------------------------------------------------- beat 4's schedule */

const FIX: RubEv[] = [0, 1, 2].map(k => ({
  gas: 'co2', t0: [0.6, 2.1, 3.5][k], d: [2.2, 2.0, 1.9][k], slotA: PGA(2 * k), slotB: PGA(2 * k + 1), settle: PILE,
  rubpFrom: [RUBS(k)],
}));
const RED_T = (j: number): number => 5.8 + 0.72 * j;
const BACK_T = (k: number): number => 12.5 + 0.3 * k;
const NEW_T = (m: number): number => 14.0 + 0.8 * m;
const HOLDS = [5.6, 12.3];

/* ---------------------------------------------------------------- actors */

const C14_CO2 = `<circle class="dk-c14g" r="16"/>${GLYPH.co2()}`;
const ACTORS: Actor[] = [
  { k: 'csrc', g: C14_CO2, lab: '¹⁴CO₂', dy: -22, cls: 'cel-mn cel-halo' }, { k: 'csrc2', g: GLYPH.co2(), lab: 'CO₂', dy: -22, cls: 'cel-mn cel-halo' },
  { k: 'h-rb', g: GLYPH.carbon('PCCCCCP') }, { k: 'h-g', g: C14_CO2 },
  { k: 'h-a', g: GLYPH.carbon('CCCP', 'n...') }, { k: 'h-b', g: GLYPH.carbon('CCCP') },
  { k: 'h-tp', g: GLYPH.carbon('CCCP', 'n...') }, { k: 'h-rb2', g: GLYPH.carbon('PCCCCCP', '..n....') },
  ...[0, 1, 2].map(m => ({ k: `p-r${m}`, g: GLYPH.carbon('PCCCCCP') })),
  ...[0, 1, 2].map(k => ({ k: `p-g${k}`, g: GLYPH.co2() })),
  ...[0, 1, 2, 3, 4, 5].map(i => ({ k: `pg${i}`, g: GLYPH.carbon('CCCP', i % 2 ? undefined : 'n...') })),
  ...[0, 1, 2, 3, 4, 5].flatMap(j => [
    { k: `at${j}`, g: GLYPH.atp() }, { k: `nd${j}`, g: GLYPH.nadph() }, { k: `tp${j}`, g: GLYPH.carbon('CCCP') },
    { k: `ad${j}`, g: GLYPH.adp() }, { k: `pi${j}`, g: GLYPH.pi() }, { k: `np${j}`, g: GLYPH.nadp() },
  ]),
  ...[0, 1, 2].flatMap(m => [{ k: `ra${m}`, g: GLYPH.atp() }, { k: `nr${m}`, g: GLYPH.carbon('PCCCCCP') }, { k: `rd${m}`, g: GLYPH.adp() }]),
];

/* ---------------------------------------------------------------- cards and panel (stage units) */

const CX = 1146, CW = 430;
function cards(p: string): string {
  const lw = CW - 40, lh = lw * 884 / 1274;
  const fw = CW - 50, fh = fw * 1025 / 1349, fs = fw / 1349;
  const bw = CW - 30, bh = bw * 840 / 1410;
  return `${card(p, 'c-lol', CX, 34, CW, lh + 96, `${T(CX + 20, 70, 'the “lollipop”', 'dk-ctitle', 'start')}
      <image href="${lolJpg}" x="${CX + 20}" y="86" width="${lw}" height="${lh.toFixed(1)}"/>
      ${T(CX + 20, 86 + lh + 26, 'Berkeley Lab photo (R. M. Couto) · © The Regents of the University of California', 'dk-ccr', 'start')}`, -1, 23)}
    ${card(p, 'c-film', CX, 34, CW, fh + 96, `${T(CX + 20, 70, 'Calvin: 5 s of ¹⁴CO₂', 'dk-ctitle', 'start')}
      <image class="dk-mult" href="${f5Png}" x="${CX + 25}" y="86" width="${fw}" height="${fh.toFixed(1)}"/>
      <g data-k="c-ring" display="none"><ellipse class="dk-mark" cx="${(CX + 25 + 975 * fs).toFixed(1)}" cy="${(86 + 708 * fs).toFixed(1)}" rx="30" ry="38"/></g>
      ${T(CX + 20, 86 + fh + 26, 'Calvin 1961, Nobel lecture, Fig. 6 · © The Nobel Foundation 1961', 'dk-ccr', 'start')}`, 1, 29)}
    ${card(p, 'c-b54', CX, 34, CW, bh + 96, `${T(CX + 20, 70, 'Bassham et al. 1954', 'dk-ctitle', 'start')}
      <image class="dk-mult" href="${b54Png}" x="${CX + 15}" y="86" width="${bw}" height="${bh.toFixed(1)}"/>
      ${T(CX + 20, 86 + bh + 26, 'J Am Chem Soc 76:1760, Fig. 7 (via Sharkey 2019, Fig. 2)', 'dk-ccr', 'start')}`, -1, 31)}`;
}
const n = (k: string): string => `<tspan data-k="${k}">0</tspan>`;
const ROWS: Row[] = [
  { k: 'r-h', h: 34, html: 'per 3 CO₂', cls: 'dk-ph' },
  { k: 'r-co2', h: 32, html: `CO₂ ${n('n-co2')}` },
  { k: 'r-pga', h: 32, html: `3-PGA ${n('n-pga')}` },
  { k: 'r-red', h: 32, html: `ATP <tspan data-k="n-atp">0</tspan> · NADPH ${n('n-nadph')}` },
  { k: 'r-tp', h: 32, html: `triose phosphate ${n('n-tp')}` },
  { k: 'r-reg', h: 32, html: `triose phosphate ${n('n-back')} → RuBP ${n('n-rubp')}` },
  { k: 'r-out', h: 34, html: `triose phosphate ${n('n-out')} out` },
];

/* ---------------------------------------------------------------- the frame */

const V1 = CYCLE_VIEW;
const CO2_FROM: V = add(G.co2, [-20, 130]);

function history(a: Api, beat: number, t: number): void {
  // the ¹⁴CO₂ source, at the strip's CO₂ place
  const src = beat === 0 ? glide(path([CO2_FROM, lerpV(CO2_FROM, G.co2, 0.5), G.co2]), t, 1.0, 3.0) : G.co2;
  a.put('csrc', src, beat === 0 ? ease(t, 0.9, 1.4) : beat === 3 ? 1 - ease(t, 0, 0.4) : 1);
  if (beat === 1) {
    a.put('h-rb', RUBS(0), ease(t, 0, 0.4));
    rubEvent(a, t, { gas: 'co2', t0: 0.6, d: 3.0, slotA: PGA(0), slotB: PGA(1), settle: PILE, rubpFrom: [RUBS(0)] }, { rb: 'h-rb', g: 'h-g', a: 'h-a', b: 'h-b', fl: 'fl' });
    a.op('c-ring', ease(t, 2.3, 2.7));
  }
  if (beat === 2) {
    a.put('h-b', PGA(1), 1 - ease(t, 0, 0.5), PILE);
    // the ¹⁴C followed: 3-PGA → GAPDH → triose phosphate → PRK → RuBP → back to its place
    if (t < 2.1) a.put('h-a', glide(path(PGA_UP(PGA(0))), t, 0.4, 1.8), 1 - ease(t, 1.85, 2.05), lerpS(PILE, 1, ease(t, 0.4, 1.0)));
    if (t > 1.8 && t < 4.9) a.put('h-tp', glide(path([...TP_OUT, G.tp, ...TO_PRK(G.tp).slice(1)]), t, 1.95, 4.6), ease(t, 1.85, 2.05) * (1 - ease(t, 4.55, 4.8)));
    if (t > 4.5) a.put('h-rb2', glide(path(PRK_OUT(RUBS(0))), t, 4.75, 6.0), ease(t, 4.6, 4.85), lerpS(1, PILE, ease(t, 5.0, 6.0)));
    for (const [tf, at] of [[1.95, G.gap], [4.7, G.prk]] as Array<[number, V]>) if (t > tf - 0.15 && t < tf + 0.5) a.put('fl', at, life(t, tf - 0.15, tf, tf + 0.1, tf + 0.5));
    a.lit('reduce', ease(t, 1.4, 1.9)); a.lit('tp', ease(t, 2.6, 3.1)); a.lit('regen', ease(t, 4.2, 4.7));
  }
  if (beat === 3) a.put('h-rb2', RUBS(0), 1 - ease(t, 0, 0.4), PILE);
  a.op('c-lol', beat === 0 ? ease(t, 1.6, 2.2) : beat === 1 ? 1 - ease(t, 0, 0.4) : 0);
  a.op('c-film', beat === 1 ? ease(t, 0.3, 0.9) : beat === 2 ? 1 - ease(t, 0, 0.4) : 0);
  a.op('c-b54', beat === 2 ? ease(t, 5.6, 6.2) : beat === 3 ? 1 - ease(t, 0, 0.4) : 0);
}
const lerpS = (a0: number, a1: number, u: number): number => a0 + (a1 - a0) * u;

function cycle(a: Api, t: number): void {
  // step A: 3 RuBP and 3 CO₂ → 6 3-PGA
  [0, 1, 2].forEach(m => { if (t < FIX[m].t0) a.put(`p-r${m}`, RUBS(m), m === 0 ? 1 : ease(t, 0, 0.5), PILE); });
  a.put('csrc2', G.co2, ease(t, 0, 0.4));
  let nco2 = 0;
  FIX.forEach((ev, k) => {
    const m = k;
    if (t >= ev.t0) a.put(`p-r${m}`, [0, 0], 0);
    const { tm } = rubEvent(a, t, ev, { rb: `p-r${m}`, g: `p-g${k}`, a: `pg${2 * k}`, b: `pg${2 * k + 1}`, fl: 'fl' });
    if (t >= tm) nco2++;
  });
  // step B: 6 × (3-PGA + ATP + NADPH) at GAPDH → 6 triose phosphate; ADP + Pᵢ and NADP⁺ back
  let nRed = 0;
  for (let j = 0; j < 6; j++) if (reduction(a, t, RED_T(j), PGA(j), TPS(j), { pga: `pg${j}`, atp: `at${j}`, nadph: `nd${j}`, tp: `tp${j}`, adp: `ad${j}`, pi: `pi${j}`, nadp: `np${j}` })) nRed++;
  // step C: 5 triose phosphate into PRK → 3 RuBP (3 ATP); 1 triose phosphate out through TPT
  let nBack = 0, nRubp = 0, nOut = 0;
  for (let k = 0; k < 5; k++) if (intoPrk(a, t, BACK_T(k), TPS(k), `tp${k}`)) nBack++;
  if (tpExport(a, t, 12.6, 14.4, TPS(5), 'tp5')) nOut = 1;
  for (let m = 0; m < 3; m++) if (newRubp(a, t, NEW_T(m), RUBS(2 - m), { atp: `ra${m}`, rubp: `nr${m}`, adp: `rd${m}` })) nRubp++;
  // the panel, per 3 CO₂
  const nAtpR = nRubp;
  a.txt('n-co2', String(nco2)); a.txt('n-pga', String(2 * nco2));
  a.txt('n-atp', nAtpR ? `${nRed} + ${nAtpR}` : String(nRed)); a.txt('n-nadph', String(nRed)); a.txt('n-tp', String(nRed));
  a.txt('n-back', String(nBack)); a.txt('n-rubp', String(nRubp)); a.txt('n-out', String(nOut));
  const on = (t0: number): number => ease(t, t0, t0 + 0.3);
  panelShow(a, 'panel', ROWS, { 'r-h': on(0.3), 'r-co2': on(0.3), 'r-pga': on(0.3), 'r-red': on(5.7), 'r-tp': on(5.7), 'r-reg': on(12.4), 'r-out': on(12.4) });
}

function frame(a: Api, beat: number, t: number): void {
  a.pos('site', SITE); a.op('site', beat === 0 ? 0 : 1);
  // the piles' names (the strip's own are left out with its molecules)
  a.pos('l-tp', add(G.tp, [-76, -30])); a.op('l-tp', beat === 2 ? ease(t, 2.6, 3.1) : beat === 3 ? 1 : 0);
  a.pos('l-rubp', add(G.rubp, [-80, 6])); a.op('l-rubp', beat === 0 ? 0 : beat === 1 ? ease(t, 0, 0.4) : 1);
  if (beat < 3) { history(a, beat, t); panelShow(a, 'panel', ROWS, {}); return; }
  history(a, beat, t);
  cycle(a, t);
}

const LIT: Part[][] = [
  ['co2'],
  ['co2', 'rubisco', 'carbox', 'pga'],
  ['co2', 'rubisco', 'carbox', 'pga', 'reduce', 'tp', 'regen'],
  ['co2', 'rubisco', 'carbox', 'pga', 'supply', 'reduce', 'tp', 'regen', 'export'],
];

export const STAGING = makeStaging({
  id: 's',
  name: 's · In the strip',
  note: 'The ¹⁴C history on the dark-reaction strip (the lollipop, the 5 s film, the label followed round GAPDH and PRK, Bassham 1954), then the cycle counted per 3 CO₂: 3 CO₂ → 6 3-PGA → 6 ATP + 6 NADPH → 6 triose phosphate → 5 back to 3 RuBP (3 ATP), 1 out',
  beats: CB1,
  holds: [[], [], [], HOLDS],
  dropGlyph: ['co2', 'rubisco', 'pga', 'tp'], dropName: ['co2', 'rubisco', 'tp'],
  actors: ACTORS,
  world: () => `${siteRing('site', '')}<g data-k="l-tp" display="none">${T(0, 0, 'triose phosphate', 'cel-mn cel-halo', 'end')}</g><g data-k="l-rubp" display="none">${T(0, 0, 'RuBP', 'cel-mn cel-halo', 'end')}</g>`,
  hud: p => `${panelSvg('panel', CX, 380, CW, ROWS)}${cards(p)}`,
  cam0: V1, cams: [V1, V1, V1, V1], camT: [[0, 1], [0, 1], [0, 1], [0, 1]],
  lit: LIT,
  frame,
});
