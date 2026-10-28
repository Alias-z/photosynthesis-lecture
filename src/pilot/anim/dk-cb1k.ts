// cb1, staging k · "Carbon bookkeeping per 3 CO₂" (slide C1 · C₃ photosynthesis; beats-cb1k.ts, its own beats;
// EFFICIENCY_BRIEF.md, lecturer, 29 Oct 2026). The dark-reaction strip, one fixed framing (CYCLE_VIEW); every molecule
// numbered and from a visible source; the carbon carries its origin: the acceptor's (RuBP, teal) and the carbon fixed from
// CO₂ (amber, from the moment RuBisCO fixes it).
// - Beat 1 (two steps, a click between): CO₂ 1–3 glide in, RuBP 1–3 appear under RuBisCO; 3 carboxylations give 3-PGA
//   1–6, the new carbon at C1 of one 3-PGA of each pair (3-PGA 1, 3, 6); the panel: 18 C = 15 C (RuBP) + 3 C (CO₂). Then
//   each 3-PGA with 1 ATP and 1 NADPH into GAPDH: triose phosphate 1–6, the same carbons.
// - Beat 2: the "why 3" card: 1 CO₂ (6 C) cannot rebuild 1 RuBP (5 C) from whole triose phosphates (1⅔ ✗), 2 CO₂ neither
//   (3⅓ ✗), 3 CO₂ can (5 ✓); only the triose phosphate pile is lit.
// - Beat 3: triose phosphate 1–5 along the regeneration arrow into PRK; 3 ATP; RuBP 1–3 back to where RuBP 1–3 started;
//   triose phosphate 6 leaves through TPT. The atoms are traced, not recoloured: the 5 triose phosphates carry 2 new carbons
//   into RuBP (TP 1 as dihydroxyacetone phosphate → C2 of the RuBP made via ribose-5-phosphate; TP 3 as
//   glyceraldehyde-3-phosphate → C3 of a RuBP made via xylulose-5-phosphate; the labelling of the standard
//   aldolase/transketolase map), TP 6 carries the third out; the panel counts the net: 15 C back, 3 C out = 3 C fixed.
// - Beat 4: the ledger, ATP and NADPH used per 3 CO₂ (6 + 3 ATP, 6 NADPH, every one drawn in beats 1 and 3).
import '../figs/carbonbook.css';
import { krow } from '../figs/carbonbook';
import { rowWidth, step } from '../figs/carbon-form';
import { balls } from '../figs/cell-schema';
import { CB1K } from './beats-cb1k';
import {
  add, AT, card, carbN, CO2_FROM, CYCLE_VIEW, ease, fromLine, G, GLYPH, glide, intoPrkN, makeStaging, panelShow, panelSvg, path,
  pileName, PILE, prkN, R, reduceN, siteRing, SITE, T, WAY, type Actor, type Api, type Part, type Row,
} from './dk1-common';

const f = (v: number): string => (Math.round(v * 100) / 100).toString();

/* ---------------------------------------------------------------- glyphs with the carbon's origin */

const cap = (w: number, r: number): string => `<rect class="dk-cap" x="${f(-w / 2 - 5)}" y="${f(-r - 5)}" width="${f(w + 10)}" height="${f(2 * r + 10)}" rx="${f(r + 5)}"/>`;
const kGlyph = (formula: string, halos: string): string => cap(rowWidth(formula.length, R), R) + krow(0, 0, formula, halos, R);
const halfW = (n: number): number => rowWidth(n, R) / 2 + 5;
/** A molecule in carbon form, origin halos ('a' acceptor, 'n' fixed from CO₂), its number on its left. */
const nk = (k: string, formula: string, n: number, halos: string): Actor =>
  ({ k, g: kGlyph(formula, halos), lab: String(n), dx: -(halfW(formula.length) + 3), dy: 5.5, anchor: 'end', cls: 'dk-num cel-halo' });
/** CO₂ with its carbon ringed amber, its number on its left. */
const co2k = (k: string, n: number): Actor => ({
  k, g: `${cap(5.4 * R, R)}<circle r="${R + 3.5}" style="fill:#f2b705;opacity:.75"/>${balls(0, 0, 'OCO')}`, lab: String(n), dx: -(2.7 * R + 8), dy: 5.5, anchor: 'end', cls: 'dk-num cel-halo',
});
/** 3-PGA and triose phosphate 1–6: the new carbon at C1 of one of each pair (traced from CO₂). */
const H3 = ['naa.', 'aaa.', 'naa.', 'aaa.', 'aaa.', 'naa.'];
/** RuBP 1–3 rebuilt from triose phosphate 1–5 (see the header): C3 new, C2 new, none. */
const H5 = ['.aanaa.', '.anaaa.', '.aaaaa.'];

/* ---------------------------------------------------------------- schedule (seconds into each beat) */

const CO2_T = (k: number): [number, number] => [0.6 + 0.25 * k, 1.6 + 0.25 * k];
const CARB = (k: number) => ({ t0: 2.2 + 1.5 * k, d: 2.0 });
const tmOf = (k: number): number => CARB(k).t0 + 0.56 * CARB(k).d;
const RED = (j: number) => ({ t0: 7.8 + 0.7 * j, d: 1.2 });
const HOLD0 = 7.4;
const W_T = [0.4, 2.2, 4.0];
const TO_PRK = (k: number): [number, number] => [0.4 + 0.35 * k, 2.0 + 0.35 * k];
const OUT_T: [number, number] = [0.6, 2.6];
const PRK_T = (m: number): number => 3.8 + 0.8 * m;
const NET_T = 6.9;

/* ---------------------------------------------------------------- actors */

const ACTORS: Actor[] = [
  ...[1, 2, 3].flatMap(k => [co2k(`c${k}`, k), nk(`r${k}`, 'PCCCCCP', k, '.aaaaa.')]),
  ...[1, 2, 3, 4, 5, 6].flatMap(j => [nk(`p${j}`, 'CCCP', j, H3[j - 1]), { k: `at${j}`, g: GLYPH.atp() }, { k: `nd${j}`, g: GLYPH.nadph() },
    nk(`t${j}`, 'CCCP', j, H3[j - 1]), { k: `ad${j}`, g: GLYPH.adp() }, { k: `pi${j}`, g: GLYPH.pi() }, { k: `np${j}`, g: GLYPH.nadp() }]),
  ...[1, 2, 3].flatMap(m => [{ k: `ra${m}`, g: GLYPH.atp() }, nk(`nr${m}`, 'PCCCCCP', m, H5[m - 1]), { k: `rd${m}`, g: GLYPH.adp() }]),
];
const RED_K = (j: number) => ({ pga: `p${j}`, atp: `at${j}`, nadph: `nd${j}`, tp: `t${j}`, adp: `ad${j}`, pi: `pi${j}`, nadp: `np${j}` });

/* ---------------------------------------------------------------- panel, "why 3" card and ledger (stage units) */

const CX = 1146, CW = 430, PY = 368;
const n = (k: string): string => `<tspan data-k="${k}">0</tspan>`;
const sw = (x: number, y: number, h: 'a' | 'n'): string =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="13.5" style="fill:${h === 'a' ? '#2f8f86' : '#f2b705'};opacity:${h === 'a' ? 0.45 : 0.75}"/>${krow(x, y, 'C', '', 10)}`;
const ROWS: Row[] = [
  { k: 'r-h', h: 32, html: 'per 3 CO₂', cls: 'dk-ph' },
  { k: 'r-key', h: 32, html: '', extra: (x, y) => `${sw(x + 10, y + 16, 'a')}${T(x + 30, y + 23, 'carbon of RuBP', 'dk-pc', 'start')}${sw(x + 206, y + 16, 'n')}${T(x + 226, y + 23, 'from CO₂', 'dk-pc', 'start')}` },
  { k: 'r-in', h: 30, html: `CO₂ ${n('n-co2')} · RuBP ${n('n-rubp')}` },
  { k: 'r-pga', h: 30, html: `3-PGA ${n('n-pga')}` },
  { k: 'r-c', h: 32, html: `${n('n-c')} C = ${n('n-acc')} C (RuBP) + ${n('n-new')} C (CO₂)` },
  { k: 'r-red', h: 30, html: `used: ATP ${n('n-atp')} · NADPH ${n('n-nadph')}` },
  { k: 'r-tp', h: 30, html: `triose phosphate ${n('n-tp')}` },
  { k: 'r-reg', h: 30, html: `triose phosphate ${n('n-back')} → RuBP ${n('n-rubp2')} · ATP ${n('n-atp2')}` },
  { k: 'r-out', h: 30, html: `out of the cycle: triose phosphate ${n('n-out')}` },
  { k: 'r-net', h: 34, html: '15 C back · 3 C out = 3 C fixed', cls: 'dk-pt' },
];
/** The "why 3" card: per n CO₂, 2n triose phosphates; the cut after the 5n carbons of n RuBP. */
function whyCard(p: string): string {
  const r = 6, w = rowWidth(4, r), pitch = w + 7, x0 = CX + 22, s = step(r);
  const rows = [{ c: 1, back: '1⅔', ok: false }, { c: 2, back: '3⅓', ok: false }, { c: 3, back: '5', ok: true }].map(({ c, back, ok }, i) => {
    const yb = 112 + 84 * i, need = 5 * c, y = yb + 30;
    const cx = (k: number): number => x0 + Math.floor(k / 3) * pitch + r + (k % 3) * s, last = need - 1, inside = last % 3 !== 2;
    const xc = inside ? cx(last) + s / 2 : x0 + Math.floor(last / 3) * pitch + w + 3.5;
    const tps = Array.from({ length: 2 * c }, (_, j) => krow(x0 + j * pitch, y, 'CCCP', [0, 1, 2].map(q => (3 * j + q < need ? 'a' : 'n')).join('') + '.', r, 'start')).join('');
    return `<g data-k="w-r${i}" display="none">${T(x0, yb, `${c} CO₂: ${6 * c} C · ${c} RuBP: ${need} C`, 'dk-ct', 'start')}${tps}
      <path class="${inside ? 'kb-cut' : 'kb-cutok'}" d="M${f(xc)},${f(y - 16)}V${f(y + 16)}"/>
      ${T(CX + CW - 22, yb, `${back} ${ok ? '✓' : '✗'}`, ok ? 'dk-pt' : 'dk-pt dk-x', 'end')}</g>`;
  }).join('');
  return card(p, 'w-card', CX, 34, CW, 318, `${T(CX + 22, 76, 'Why 3 CO<tspan baseline-shift="sub" font-size="70%">2</tspan>', 'dk-ctitle', 'start')}${T(CX + CW - 22, 76, 'back to RuBP', 'dk-cs', 'end')}${rows}`, -1, 41);
}
const LY = PY, LC1 = CX + 320, LC2 = CX + 420;
const LEDGER: Array<{ k: string; y: number; cells: [string, string, string]; cls: string }> = [
  { k: 'l-h', y: 40, cells: ['per 3 CO₂, used', 'ATP', 'NADPH'], cls: 'dk-ph' },
  { k: 'l-red', y: 76, cells: ['reduction', '6', '6'], cls: 'dk-pr' },
  { k: 'l-reg', y: 110, cells: ['regeneration', '3', '0'], cls: 'dk-pr' },
  { k: 'l-cyc', y: 152, cells: ['cycle', '9', '6'], cls: 'dk-pt' },
  { k: 'l-per', y: 188, cells: ['per CO₂: 3 ATP + 2 NADPH', '', ''], cls: 'dk-pt' },
];
const ledgerSvg = (): string => `<g data-k="ledger" display="none"><rect class="dk-panel" x="${CX}" y="${LY}" width="${CW}" height="212" rx="14"/>
  <path class="dk-rule" d="M${CX + 16},${LY + 128}H${CX + CW - 16}"/>
  ${LEDGER.map(r => `<g data-k="${r.k}" display="none">${T(CX + 18, LY + r.y, r.cells[0], r.cls, 'start')}${r.cells[1] ? T(LC1, LY + r.y, r.cells[1], r.cls, 'end') : ''}${r.cells[2] ? T(LC2, LY + r.y, r.cells[2], r.cls, 'end') : ''}</g>`).join('')}</g>`;

/* ---------------------------------------------------------------- the frame */

interface Tally { co2: number; rubp: number; pga: number; car: number; red: number; back: number; rubp2: number; out: number }
/** Beat 1: the inputs, 3 carboxylations, 6 reductions (as staging s's count, with the carbon's origin). */
function beat1(a: Api, t: number): Tally {
  let co2 = 0, pga = 0, car = 0, red = 0;
  for (let k = 0; k < 3; k++) {
    const [c0, c1] = CO2_T(k), cb = CARB(k), key = { rb: `r${k + 1}`, g: `c${k + 1}`, a: `p${2 * k + 1}`, b: `p${2 * k + 2}` };
    if (t < cb.t0) {
      a.put(key.g, glide(path([CO2_FROM, add(AT.co2(k), [-12, 60]), AT.co2(k)]), t, c0, c1), ease(t, c0, c0 + 0.25), PILE);
      a.put(key.rb, AT.rubp(k), ease(t, 0.6, 1.0), PILE);
    }
    if (t >= c1) co2++;
    if (carbN(a, t, { ...cb, co2: AT.co2(k), rubp: AT.rubp(k), to: [AT.pga(2 * k), AT.pga(2 * k + 1)], k: key }).tm <= t) { pga += 2; car++; }
  }
  for (let j = 0; j < 6; j++) if (reduceN(a, t, RED(j).t0, RED(j).d, AT.pga(j), AT.tp(j), RED_K(j + 1))) red++;
  return { co2, rubp: t >= 1.0 ? 3 : 0, pga, car, red, back: 0, rubp2: 0, out: 0 };
}
/** Beat 3: triose phosphate 1–5 into PRK, 6 out through TPT; 3 ATP; RuBP 1–3 back under RuBisCO. */
function beat3(a: Api, t: number): Tally {
  let back = 0, rubp2 = 0, out = 0;
  for (let k = 0; k < 5; k++) {
    const [t0, t1] = TO_PRK(k);
    if (t < t0) a.put(`t${k + 1}`, AT.tp(k), 1, PILE);
    else if (intoPrkN(a, t, t0, t1, AT.tp(k), `t${k + 1}`)) back++;
  }
  if (t < OUT_T[0]) a.put('t6', AT.tp(5), 1, PILE);
  else { a.put('t6', glide(path([AT.tp(5), ...WAY.export.slice(0, 2), AT.tpt]), t, OUT_T[0], OUT_T[1]), 1, PILE + (0.85 - PILE) * ease(t, OUT_T[0], OUT_T[0] + 0.6)); if (t >= OUT_T[1]) out = 1; }
  for (let m = 0; m < 3; m++) if (prkN(a, t, PRK_T(m), null, AT.rubp(m), { atp: `ra${m + 1}`, rubp: `nr${m + 1}`, adp: `rd${m + 1}` })) rubp2++;
  return { co2: 3, rubp: 3, pga: 6, car: 3, red: 6, back, rubp2, out };
}

function frame(a: Api, beat: number, t: number): void {
  a.pos('site', SITE); a.op('site', 1);
  a.pos('l-co2', add(G.co2, [0, -24])); a.pos('l-rubp', add(AT.rubp(0), [-69, 6])); a.pos('l-tp', add(G.tp, [-96, -8]));
  a.pos('f-carb', add(G.pga, [0, 50])); a.pos('f-red', add(G.tp, [-96, 12])); a.pos('l-out', add(AT.tpt, [-14, -30]));
  const done: Tally = { co2: 3, rubp: 3, pga: 6, car: 3, red: 6, back: 5, rubp2: 3, out: 1 };
  let N: Tally;
  if (beat === 0) N = beat1(a, t);
  else if (beat === 2) N = beat3(a, t);
  else {
    N = beat === 1 ? { ...done, back: 0, rubp2: 0, out: 0 } : done;
    if (beat === 1) for (let j = 0; j < 6; j++) a.put(`t${j + 1}`, AT.tp(j), 1, PILE);
    if (beat === 3) { for (let m = 0; m < 3; m++) a.put(`nr${m + 1}`, AT.rubp(m), 1, PILE); a.put('t6', AT.tpt, 1, 0.85); }
  }
  // names and lines
  a.op('l-co2', beat === 0 ? ease(t, 0.6, 1.0) * (1 - ease(t, tmOf(2), tmOf(2) + 0.4)) : 0);
  a.op('l-rubp', beat === 0 ? ease(t, 0.6, 1.0) * (1 - ease(t, CARB(2).t0, CARB(2).t0 + 0.4)) : beat === 2 ? ease(t, PRK_T(0) + 0.6, PRK_T(0) + 1.0) : beat === 3 ? 1 : 0);
  a.op('l-tp', beat === 0 ? ease(t, RED(0).t0 + 1.2, RED(0).t0 + 1.6) : beat === 1 ? 1 : beat === 2 ? 1 - ease(t, TO_PRK(4)[0], TO_PRK(4)[0] + 0.4) : 0);
  a.op('f-carb', beat === 0 ? ease(t, 7.5, 7.8) * (1 - ease(t, 9.6, 10.0)) : 0);
  a.op('f-red', beat === 2 ? ease(t, 0.1, 0.4) * (1 - ease(t, 2.2, 2.6)) : 0);
  a.op('l-out', beat === 2 ? ease(t, OUT_T[1] - 0.2, OUT_T[1] + 0.2) : beat === 3 ? 1 : 0);
  // the panel: every count is a drawn molecule; the carbon by origin ticks with the carboxylations
  a.txt('n-co2', String(N.co2)); a.txt('n-rubp', String(N.rubp)); a.txt('n-pga', String(N.pga));
  a.txt('n-c', String(6 * N.car)); a.txt('n-acc', String(5 * N.car)); a.txt('n-new', String(N.car));
  a.txt('n-atp', String(N.red)); a.txt('n-nadph', String(N.red)); a.txt('n-tp', String(N.red));
  a.txt('n-back', String(N.back)); a.txt('n-rubp2', String(N.rubp2)); a.txt('n-atp2', String(N.rubp2)); a.txt('n-out', String(N.out));
  const on = (b: number, t0: number): number => (beat < b ? 0 : beat > b ? 1 : ease(t, t0, t0 + 0.3));
  const out = beat === 3 ? 1 - ease(t, 0, 0.3) : 1;
  panelShow(a, 'panel', ROWS, {
    'r-h': on(0, 0.4) * out, 'r-key': on(0, 0.4) * out, 'r-in': on(0, 0.6) * out, 'r-pga': on(0, tmOf(0) - 0.2) * out, 'r-c': on(0, tmOf(0) - 0.2) * out,
    'r-red': on(0, RED(0).t0) * out, 'r-tp': on(0, RED(0).t0) * out,
    'r-reg': on(2, TO_PRK(0)[0]) * out, 'r-out': on(2, OUT_T[0]) * out, 'r-net': on(2, NET_T) * out,
  });
  // the "why 3" card (beat 2) and the ledger (beat 4)
  a.op('w-card', beat === 1 ? ease(t, 0, 0.4) : beat === 2 ? 1 - ease(t, 0, 0.4) : 0);
  W_T.forEach((w, i) => a.op(`w-r${i}`, beat === 1 ? ease(t, w, w + 0.4) : 0));
  a.op('ledger', beat === 3 ? ease(t, 0.2, 0.5) : 0);
  LEDGER.forEach((r, i) => a.op(r.k, beat === 3 ? ease(t, 0.4 + 0.6 * i, 0.7 + 0.6 * i) : 0));
}

const LIT: Part[][] = [
  ['co2', 'rubisco', 'carbox', 'pga', 'thyl', 'light', 'supply', 'reduce', 'tp'],
  ['tp'],
  ['tp', 'regen', 'export', 'rubisco', 'thyl', 'light', 'supply'],
  ['co2', 'rubisco', 'carbox', 'pga', 'thyl', 'light', 'supply', 'reduce', 'tp', 'regen', 'export'],
];

export const STAGING = makeStaging({
  id: 'k',
  name: 'k · Carbon bookkeeping per 3 CO₂',
  note: 'The cycle counted by carbon, per 3 CO₂, in the strip: the acceptor’s carbon teal, the carbon fixed from CO₂ amber (traced). 3 RuBP (15 C) + 3 CO₂ (3 C) → 3-PGA 1–6 → triose phosphate 1–6 (18 C); why 3 (1⅔ ✗, 3⅓ ✗, 5 ✓); 5 triose phosphates → 3 RuBP with 3 ATP, 1 out (15 C back, 3 C out = 3 C fixed); the ledger 9 ATP, 6 NADPH',
  beats: CB1K,
  holds: [[HOLD0], [], [], []],
  dropGlyph: ['co2', 'rubisco', 'pga', 'tp'], dropName: ['co2', 'rubisco', 'tp'],
  actors: ACTORS,
  world: () => `${siteRing('site', '')}${pileName('l-co2', 'CO₂')}${pileName('l-rubp', 'RuBP', 'end')}${pileName('l-tp', 'triose phosphate', 'end')}
    ${fromLine('f-carb', 'from carboxylation')}${fromLine('f-red', 'from reduction', 'end')}${fromLine('l-out', 'out of the cycle')}`,
  hud: p => `${panelSvg('panel', CX, PY, CW, ROWS)}${whyCard(p)}${ledgerSvg()}`,
  cam0: CYCLE_VIEW, cams: [CYCLE_VIEW, CYCLE_VIEW, CYCLE_VIEW, CYCLE_VIEW], camT: [[0, 1], [0, 1], [0, 1], [0, 1]],
  lit: LIT,
  frame,
});
