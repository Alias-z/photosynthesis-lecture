// cb1, staging s · "The cycle in the strip" (slide C1 · C₃ photosynthesis; beats CB1; DARK_COUNTS_BRIEF.md, lecturer,
// 28 Oct 2026, evening): the 1950s ¹⁴C history told on the dark-reaction strip, then the cycle counted per 3 CO₂, the
// smallest number for which it closes with whole molecules. One fixed framing; every molecule has a visible source.
// - Beat 1, Carbon-14: ¹⁴CO₂ (its carbon ringed amber, the tracer) glides in from below to RuBisCO's side. Card: the
//   "lollipop" (Berkeley Lab photo).
// - Beat 2, Shorter ¹⁴CO₂ feeds: a RuBP rises from the RuBP under RuBisCO, ¹⁴CO₂ docks, and 2 3-PGA leave, the ¹⁴C in one.
//   Card: Calvin's 5 s film (Nobel lecture, Fig. 6), its PGA spot ringed.
// - Beat 3, Labelling order: the ¹⁴C shows up in 3-PGA, then in triose phosphate, then in RuBP: each place glows in turn
//   and takes the amber ring, while reduction and regeneration light. Nothing moves between them. Card: Bassham et al.
//   1954, the cycle as they drew it.
// - Beat 4, Per 3 CO₂ (three steps, a click between): the history clears; the unit is stated; CO₂ 1–3 glide in from below
//   and RuBP 1–3 appear under RuBisCO, numbered. (A) 3 carboxylations: 3-PGA 1–6. (B) "from carboxylation": each 3-PGA
//   with 1 ATP and 1 NADPH together into GAPDH: triose phosphate 1–6; ADP, Pᵢ and NADP⁺ back. (C) "from reduction":
//   triose phosphate 1–5 along the regeneration arrow into PRK; 3 ATP; RuBP 1–3 back to where RuBP 1–3 started;
//   triose phosphate 6 leaves the cycle and waits at TPT. The panel ticks every drawn molecule.
import lolJpg from '../../assets/photos/cb-lollipop-lbl.jpg';
import f5Png from '../../assets/photos/c2-5s.png';
import b54Png from '../../assets/photos/cb-bassham1954.png';
import { CB1 } from './beats-cb';
import {
  add, AT, card, carbN, CO2_FROM, CYCLE_VIEW, ease, fromLine, G, GLYPH, glide, intoPrkN, life, makeStaging, numbered, numberedCo2,
  panelShow, panelSvg, path, pileName, PILE, pool, prkN, reduceN, SITE, siteRing, T, WAY, type Actor, type Api, type Part, type Row,
} from './dk1-common';

/** CB1 with the approved sentence of DARK_COUNTS_BRIEF.md added to its last caption (the beats file is unchanged). */
const BEATS = CB1.map((b, i) => (i === CB1.length - 1
  ? { ...b, say: b.say.replace(' <b>', ' 3 CO₂ is the smallest number for which the cycle closes with whole molecules. <b>') } : b));

/* ---------------------------------------------------------------- beat 4's schedule (seconds into the beat) */

const CO2_T = (k: number): [number, number] => [0.6 + 0.25 * k, 1.6 + 0.25 * k];
const CARB = (k: number) => ({ t0: 2.2 + 1.5 * k, d: 2.0 });
const RED = (j: number) => ({ t0: 7.8 + 0.7 * j, d: 1.2 });
const TO_PRK = (k: number): [number, number] => [14.6 + 0.35 * k, 16.2 + 0.35 * k];
const OUT_T: [number, number] = [14.8, 16.8];
const PRK_T = (m: number): number => 18.0 + 0.8 * m;
const HOLDS = [7.4, 14.2];
const tmOf = (k: number): number => CARB(k).t0 + 0.56 * CARB(k).d;

/* ---------------------------------------------------------------- actors */

const C14_CO2 = `<circle class="dk-c14g" r="16"/>${GLYPH.co2()}`;
const ACTORS: Actor[] = [
  // the history: ¹⁴CO₂, the RuBP that rises, its 2 3-PGA; the cell's RuBP and triose phosphate, plain and labelled
  { k: 'csrc', g: C14_CO2, lab: '¹⁴CO₂', dy: -22, cls: 'cel-mn cel-halo' }, { k: 'h-rb', g: GLYPH.carbon('PCCCCCP') },
  { k: 'h-a', g: GLYPH.carbon('CCCP', 'n...') }, { k: 'h-b', g: GLYPH.carbon('CCCP') },
  { k: 'pool-r', g: GLYPH.carbon('PCCCCCP') }, { k: 'pool-r14', g: GLYPH.carbon('PCCCCCP', '..n....') },
  { k: 'pool-t', g: GLYPH.carbon('CCCP') }, { k: 'pool-t14', g: GLYPH.carbon('CCCP', 'n...') },
  // the count, per 3 CO₂
  ...[1, 2, 3].flatMap(k => [numberedCo2(`c${k}`, k), numbered(`r${k}`, 'PCCCCCP', k)]),
  ...[1, 2, 3, 4, 5, 6].flatMap(j => [numbered(`p${j}`, 'CCCP', j, j % 2 ? 'n...' : undefined), { k: `at${j}`, g: GLYPH.atp() }, { k: `nd${j}`, g: GLYPH.nadph() },
    numbered(`t${j}`, 'CCCP', j), { k: `ad${j}`, g: GLYPH.adp() }, { k: `pi${j}`, g: GLYPH.pi() }, { k: `np${j}`, g: GLYPH.nadp() }]),
  ...[1, 2, 3].flatMap(m => [{ k: `ra${m}`, g: GLYPH.atp() }, numbered(`nr${m}`, 'PCCCCCP', m), { k: `rd${m}`, g: GLYPH.adp() }]),
];
const RED_K = (j: number) => ({ pga: `p${j}`, atp: `at${j}`, nadph: `nd${j}`, tp: `t${j}`, adp: `ad${j}`, pi: `pi${j}`, nadp: `np${j}` });

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
  { k: 'r-in', h: 32, html: `CO₂ ${n('n-co2')} · RuBP ${n('n-rubp')}` },
  { k: 'r-pga', h: 32, html: `3-PGA ${n('n-pga')}` },
  { k: 'r-red', h: 32, html: `used: ATP ${n('n-atp')} · NADPH ${n('n-nadph')}` },
  { k: 'r-tp', h: 32, html: `triose phosphate ${n('n-tp')}` },
  { k: 'r-reg', h: 32, html: `triose phosphate ${n('n-back')} → RuBP ${n('n-rubp2')} · ATP ${n('n-atp2')}` },
  { k: 'r-out', h: 34, html: `triose phosphate out of the cycle: ${n('n-out')}` },
];

/* ---------------------------------------------------------------- the frame */

function history(a: Api, beat: number, t: number): void {
  // beat 1: ¹⁴CO₂ glides in from below; beat 2: it docks on a RuBP that rises from the RuBP under RuBisCO
  if (beat === 0) a.put('csrc', glide(path([CO2_FROM, add(AT.co2(0), [-12, 90]), AT.co2(0)]), t, 1.0, 2.6), ease(t, 1.0, 1.3));
  if (beat === 1) {
    if (t < 0.8) a.put('csrc', AT.co2(0), 1);
    carbN(a, t, { t0: 0.8, d: 3.0, co2: AT.co2(0), rubp: AT.rubp(0), to: [AT.pga(0), AT.pga(1)], k: { rb: 'h-rb', g: 'csrc', a: 'h-a', b: 'h-b' } });
    a.op('c-ring', ease(t, 2.5, 2.9));
  }
  // the cell's RuBP and triose phosphate (beats 2 and 3); the 2 3-PGA stay (beat 3)
  const pools = beat === 1 ? ease(t, 0, 0.4) : beat === 2 ? 1 : beat === 3 ? 1 - ease(t, 0, 0.5) : 0;
  if (beat === 2 || beat === 3) { a.put('h-a', AT.pga(0), pools, PILE); a.put('h-b', AT.pga(1), pools, PILE); }
  // beat 3: the label shows up in 3-PGA, then triose phosphate, then RuBP (each glows in turn and takes the ring)
  const lt = beat === 2 ? ease(t, 1.8, 2.3) : beat === 3 ? 1 : 0, lr = beat === 2 ? ease(t, 3.4, 3.9) : beat === 3 ? 1 : 0;
  a.put('pool-t', AT.tp(0), pools * (1 - lt), PILE); a.put('pool-t14', AT.tp(0), pools * lt, PILE);
  a.put('pool-r', AT.rubp(0), pools * (1 - lr), PILE); a.put('pool-r14', AT.rubp(0), pools * lr, PILE);
  const glow = (k: string, at: [number, number], t0: number): void => { a.pos(k, at); a.op(k, beat === 2 ? 0.9 * life(t, t0, t0 + 0.4, t0 + 1.2, t0 + 1.8) : 0); };
  glow('g-pga', AT.pga(0), 0.3); glow('g-tp', AT.tp(0), 1.8); glow('g-rubp', AT.rubp(0), 3.4);
  if (beat === 2) { a.lit('reduce', ease(t, 1.2, 1.7)); a.lit('tp', ease(t, 1.6, 2.1)); a.lit('regen', ease(t, 2.8, 3.3)); }
  a.op('c-lol', beat === 0 ? ease(t, 1.6, 2.2) : beat === 1 ? 1 - ease(t, 0, 0.4) : 0);
  a.op('c-film', beat === 1 ? ease(t, 0.3, 0.9) : beat === 2 ? 1 - ease(t, 0, 0.4) : 0);
  a.op('c-b54', beat === 2 ? ease(t, 4.6, 5.2) : beat === 3 ? 1 - ease(t, 0, 0.4) : 0);
}

function count(a: Api, t: number): void {
  // the inputs, numbered: CO₂ 1–3 glide in from below, RuBP 1–3 appear under RuBisCO
  let nCo2 = 0, nPga = 0;
  for (let k = 0; k < 3; k++) {
    const [c0, c1] = CO2_T(k), cb = CARB(k), key = { rb: `r${k + 1}`, g: `c${k + 1}`, a: `p${2 * k + 1}`, b: `p${2 * k + 2}` };
    if (t < cb.t0) {
      a.put(key.g, glide(path([CO2_FROM, add(AT.co2(k), [-12, 60]), AT.co2(k)]), t, c0, c1), ease(t, c0, c0 + 0.25), PILE);
      a.put(key.rb, AT.rubp(k), ease(t, 0.6, 1.0), PILE);
    }
    if (t >= c1) nCo2++;
    // (A) carboxylation k: 3-PGA 2k + 1 and 2k + 2
    if (carbN(a, t, { ...cb, co2: AT.co2(k), rubp: AT.rubp(k), to: [AT.pga(2 * k), AT.pga(2 * k + 1)], k: key }).tm <= t) nPga += 2;
  }
  // (B) each 3-PGA with 1 ATP and 1 NADPH into GAPDH: triose phosphate 1–6
  let nRed = 0;
  for (let j = 0; j < 6; j++) if (reduceN(a, t, RED(j).t0, RED(j).d, AT.pga(j), AT.tp(j), RED_K(j + 1))) nRed++;
  // (C) triose phosphate 1–5 into PRK; 3 ATP; RuBP 1–3 back; triose phosphate 6 out of the cycle, to TPT
  let nBack = 0, nRubp = 0, nOut = 0;
  for (let k = 0; k < 5; k++) {
    const [t0, t1] = TO_PRK(k);
    if (t >= t0) { if (intoPrkN(a, t, t0, t1, AT.tp(k), `t${k + 1}`)) nBack++; }
  }
  if (t >= OUT_T[0]) { a.put('t6', glide(path([AT.tp(5), ...WAY.export.slice(0, 2), AT.tpt]), t, OUT_T[0], OUT_T[1]), 1, PILE + (0.85 - PILE) * ease(t, OUT_T[0], OUT_T[0] + 0.6)); if (t >= OUT_T[1]) nOut = 1; }
  for (let m = 0; m < 3; m++) if (prkN(a, t, PRK_T(m), null, AT.rubp(m), { atp: `ra${m + 1}`, rubp: `nr${m + 1}`, adp: `rd${m + 1}` })) nRubp++;
  // names, lines and the panel
  a.op('l-co2', ease(t, 0.6, 1.0) * (1 - ease(t, tmOf(2), tmOf(2) + 0.4)));
  a.op('l-rubp', ease(t, 0.6, 1.0) * (1 - ease(t, CARB(2).t0, CARB(2).t0 + 0.4)) + ease(t, PRK_T(0) + 0.6, PRK_T(0) + 1.0));
  a.op('l-tp', ease(t, RED(0).t0 + 1.2, RED(0).t0 + 1.6) * (1 - ease(t, TO_PRK(4)[0], TO_PRK(4)[0] + 0.4)));
  a.op('f-carb', ease(t, 7.5, 7.8) * (1 - ease(t, 9.6, 10.0)));
  a.op('f-red', ease(t, 14.3, 14.6) * (1 - ease(t, 16.4, 16.8)));
  a.txt('n-co2', String(nCo2)); a.txt('n-rubp', String(t >= 1.0 ? 3 : 0)); a.txt('n-pga', String(nPga));
  a.txt('n-atp', String(nRed)); a.txt('n-nadph', String(nRed)); a.txt('n-tp', String(nRed));
  a.txt('n-back', String(nBack)); a.txt('n-rubp2', String(nRubp)); a.txt('n-atp2', String(nRubp)); a.txt('n-out', String(nOut));
  const on = (t0: number): number => ease(t, t0, t0 + 0.3);
  panelShow(a, 'panel', ROWS, { 'r-h': on(0.4), 'r-in': on(0.6), 'r-pga': on(tmOf(0) - 0.2), 'r-red': on(RED(0).t0), 'r-tp': on(RED(0).t0), 'r-reg': on(TO_PRK(0)[0]), 'r-out': on(OUT_T[0]) });
}

function frame(a: Api, beat: number, t: number): void {
  a.pos('site', SITE); a.op('site', beat === 0 ? 0 : 1);
  a.pos('l-co2', add(G.co2, [0, -24])); a.pos('l-rubp', add(AT.rubp(0), [-69, 6])); a.pos('l-tp', add(G.tp, [-96, -8]));
  a.pos('f-carb', add(G.pga, [0, 50])); a.pos('f-red', add(G.tp, [-96, 12]));
  history(a, beat, t);
  if (beat === 3) count(a, t);
  else {
    panelShow(a, 'panel', ROWS, {});
    a.op('l-co2', 0); a.op('f-carb', 0); a.op('f-red', 0);
    a.op('l-rubp', beat === 0 ? 0 : beat === 1 ? ease(t, 0, 0.4) : 1);
    a.op('l-tp', beat === 0 ? 0 : beat === 1 ? ease(t, 0, 0.4) : 1);
  }
}

const LIT: Part[][] = [
  ['co2'],
  ['co2', 'rubisco', 'carbox', 'pga'],
  ['co2', 'rubisco', 'carbox', 'pga', 'reduce', 'tp', 'regen'],
  ['co2', 'rubisco', 'carbox', 'pga', 'thyl', 'light', 'supply', 'reduce', 'tp', 'regen'],
];

export const STAGING = makeStaging({
  id: 's',
  name: 's · In the strip',
  note: 'The ¹⁴C history on the dark-reaction strip (the lollipop, the 5 s film, the label showing up in 3-PGA, triose phosphate, RuBP; Bassham 1954), then the cycle counted per 3 CO₂ with numbered inputs: CO₂ 1–3 + RuBP 1–3 → 3-PGA 1–6 → each with 1 ATP and 1 NADPH → triose phosphate 1–6 → 5 to PRK with 3 ATP → RuBP 1–3; triose phosphate 6 leaves the cycle',
  beats: BEATS,
  holds: [[], [], [], HOLDS],
  dropGlyph: ['co2', 'rubisco', 'pga', 'tp'], dropName: ['co2', 'rubisco', 'tp'],
  actors: ACTORS,
  world: p => `${siteRing('site', '')}${pool(p, 'g-pga', 70, 34)}${pool(p, 'g-tp', 70, 34)}${pool(p, 'g-rubp', 90, 34)}
    ${pileName('l-co2', 'CO₂')}${pileName('l-rubp', 'RuBP', 'end')}${pileName('l-tp', 'triose phosphate', 'end')}
    ${fromLine('f-carb', 'from carboxylation')}${fromLine('f-red', 'from reduction', 'end')}`,
  hud: p => `${panelSvg('panel', CX, 380, CW, ROWS)}${cards(p)}`,
  cam0: CYCLE_VIEW, cams: [CYCLE_VIEW, CYCLE_VIEW, CYCLE_VIEW, CYCLE_VIEW], camT: [[0, 1], [0, 1], [0, 1], [0, 1]],
  lit: LIT,
  frame,
});
