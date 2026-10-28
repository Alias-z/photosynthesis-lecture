// 'regeneration', staging s · "Regeneration in the strip, per 3 CO₂" (slide C3b · Regeneration of RuBP;
// beats-regeneration.ts; DARK_COUNTS_BRIEF.md, lecturer, 28 Oct 2026, evening). One fixed framing; counted per 3 CO₂, the
// smallest number that gives whole RuBP; every molecule has a visible source.
// - Beat 1, Recap (≈ 5 s): the panel states the unit. CO₂ 1–3 glide in from below and RuBP 1–3 appear under RuBisCO; 3
//   carboxylations give 3-PGA 1–6; each 3-PGA takes 1 ATP and 1 NADPH together at GAPDH: triose phosphate 1–6.
// - Beat 2, Rearrangement: "from reduction" at the triose phosphate pile; triose phosphate 1–5 (5 × 3 C) glide along the
//   regeneration arrow and meet; 3 ribulose-5-phosphate (3 × 5 C) come out, 2 Pᵢ glide back to the thylakoid edge.
//   Triose phosphate 6 moves to TPT and waits there ("→ C4").
// - Beat 3, PRK: each ribulose-5-phosphate goes into PRK with 1 ATP from the strip's ATP at PRK; RuBP 1–3 come out to
//   their place under RuBisCO, where RuBP 1–3 started; ADP glides back to the thylakoid edge.
// - Beat 4, Per 3 CO₂: GAPDH and PRK light together; the ledger: reduction 6 ATP + 6 NADPH, regeneration 3 ATP,
//   cycle 9 : 6 = 3 : 2.
import { REGENERATION } from './beats-regeneration';
import {
  add, AT, carbN, CO2_FROM, CYCLE_VIEW, ease, fromLine, G, GLYPH, glide, life, makeStaging, numbered, numberedCo2, panelShow, panelSvg,
  path, pileName, PILE, prkN, reduceN, SITE, siteRing, T, WAY, type Actor, type Api, type Part, type Row, type V,
} from './dk1-common';

/* ---------------------------------------------------------------- places and schedule */

/** Where the 5 triose phosphates meet: on the regeneration arrow, on its way down to PRK. */
const MEET: V = [606, 300];
const TO_MEET = (from: V): V[] => WAY.toPrk(from).slice(0, 5).concat([MEET]);
/** The 3 ribulose-5-phosphate wait in a column left of the arrow, above PRK. */
const RU5P_AT = (m: number): V => add(G.prk, [4, -124 + 24 * m]);
const PI_BACK: V[] = [MEET, [628, 220], [560, 70], [380, 12], [200, 4], add(G.back, [30, -6]), G.back];
// beat 1, the recap
const CO2_T = (k: number): [number, number] => [0.1 + 0.15 * k, 0.9 + 0.15 * k];
const CARB = (k: number) => ({ t0: 1.0 + 0.55 * k, d: 1.1 });
const RED = (j: number) => ({ t0: 2.2 + 0.3 * j, d: 0.7 });
// beat 2, the rearrangement
const TP_T = (k: number): [number, number] => [0.6 + 0.3 * k, 2.2 + 0.3 * k];
const T_MERGE = 3.6, RU_T = (m: number): number => T_MERGE + 0.1 + 0.35 * m;
// beat 3, PRK
const PRK_T = (m: number): number => 1.0 + 1.1 * m;

/* ---------------------------------------------------------------- actors */

const ACTORS: Actor[] = [
  ...[1, 2, 3].flatMap(k => [numberedCo2(`c${k}`, k), numbered(`r${k}`, 'PCCCCCP', k)]),
  ...[1, 2, 3, 4, 5, 6].flatMap(j => [numbered(`p${j}`, 'CCCP', j, j % 2 ? 'n...' : undefined), { k: `at${j}`, g: GLYPH.atp() }, { k: `nd${j}`, g: GLYPH.nadph() },
    numbered(`t${j}`, 'CCCP', j), { k: `ad${j}`, g: GLYPH.adp() }, { k: `pi${j}`, g: GLYPH.pi() }, { k: `np${j}`, g: GLYPH.nadp() }]),
  ...[1, 2, 3].flatMap(m => [numbered(`u${m}`, 'CCCCCP', m), { k: `ra${m}`, g: GLYPH.atp() }, numbered(`nr${m}`, 'PCCCCCP', m), { k: `rd${m}`, g: GLYPH.adp() }]),
  { k: 'xp1', g: GLYPH.pi() }, { k: 'xp2', g: GLYPH.pi() },
];
const RED_K = (j: number) => ({ pga: `p${j}`, atp: `at${j}`, nadph: `nd${j}`, tp: `t${j}`, adp: `ad${j}`, pi: `pi${j}`, nadp: `np${j}` });

/* ---------------------------------------------------------------- panel and ledger (stage units) */

const CX = 1108, CW = 470;
const n = (k: string): string => `<tspan data-k="${k}">0</tspan>`;
const ROWS: Row[] = [
  { k: 'r-h', h: 34, html: '3 CO₂: the smallest number that gives whole RuBP', cls: 'dk-ph' },
  { k: 'r-in', h: 30, html: `CO₂ ${n('n-co2')} · RuBP ${n('n-rubp')}` },
  { k: 'r-pga', h: 30, html: `3-PGA ${n('n-pga')}` },
  { k: 'r-red', h: 30, html: `ATP ${n('n-atp')} · NADPH ${n('n-nadph')}` },
  { k: 'r-tp', h: 34, html: `triose phosphate ${n('n-tp')}` },
  { k: 'r-tpc', h: 30, html: `triose phosphate: ${n('n-tpk')} × 3 C = ${n('n-tpc')} C` },
  { k: 'r-ru', h: 34, html: `ribulose-5-phosphate: ${n('n-ruk')} × 5 C = ${n('n-ruc')} C` },
  { k: 'r-atp2', h: 30, html: `ATP ${n('n-atp2')} · RuBP ${n('n-rubp2')}` },
];
const LX = CX, LY = 330, LC1 = LX + 330, LC2 = LX + 440;
const LEDGER: Array<{ k: string; y: number; cells: [string, string, string]; cls: string }> = [
  { k: 'l-h', y: 40, cells: ['per 3 CO₂', 'ATP', 'NADPH'], cls: 'dk-ph' },
  { k: 'l-red', y: 76, cells: ['reduction', '6', '6'], cls: 'dk-pr' },
  { k: 'l-reg', y: 110, cells: ['regeneration', '3', '0'], cls: 'dk-pr' },
  { k: 'l-cyc', y: 152, cells: ['cycle', '9', '6'], cls: 'dk-pt' },
  { k: 'l-rat', y: 188, cells: ['ATP : NADPH = 9 : 6 = 3 : 2', '', ''], cls: 'dk-pt' },
];
const ledgerSvg = (): string => `<g data-k="ledger" display="none" class="fig"><rect class="dk-panel" x="${LX}" y="${LY}" width="${CW}" height="212" rx="14"/>
  <path class="dk-rule" d="M${LX + 16},${LY + 128}H${LX + CW - 16}"/>
  ${LEDGER.map(r => `<g data-k="${r.k}" display="none">${T(LX + 18, LY + r.y, r.cells[0], r.cls, 'start')}${r.cells[1] ? T(LC1, LY + r.y, r.cells[1], r.cls, 'end') : ''}${r.cells[2] ? T(LC2, LY + r.y, r.cells[2], r.cls, 'end') : ''}</g>`).join('')}</g>`;

/* ---------------------------------------------------------------- the frame */

function recap(a: Api, t: number): { nCo2: number; nRubp: number; nPga: number; nRed: number } {
  let nCo2 = 0, nPga = 0, nRed = 0;
  for (let k = 0; k < 3; k++) {
    const [c0, c1] = CO2_T(k), cb = CARB(k), key = { rb: `r${k + 1}`, g: `c${k + 1}`, a: `p${2 * k + 1}`, b: `p${2 * k + 2}` };
    if (t < cb.t0) {
      a.put(key.g, glide(path([CO2_FROM, add(AT.co2(k), [-12, 60]), AT.co2(k)]), t, c0, c1), ease(t, c0, c0 + 0.25), PILE);
      a.put(key.rb, AT.rubp(k), ease(t, 0.1, 0.45), PILE);
    }
    if (t >= c1) nCo2++;
    const { tm } = carbN(a, t, { ...cb, co2: AT.co2(k), rubp: AT.rubp(k), to: [AT.pga(2 * k), AT.pga(2 * k + 1)], k: key });
    if (t >= tm) nPga += 2;
  }
  for (let j = 0; j < 6; j++) {
    const r = RED(j);
    if (reduceN(a, t, r.t0, r.d, AT.pga(j), AT.tp(j), RED_K(j + 1))) nRed++;
  }
  return { nCo2, nRubp: t >= 0.45 ? 3 : 0, nPga, nRed };
}

function frame(a: Api, beat: number, t: number): void {
  a.pos('site', SITE); a.op('site', 1);
  a.pos('l-co2', add(G.co2, [0, -24])); a.pos('l-rubp', add(AT.rubp(0), [-69, 6])); a.pos('l-tp', add(G.tp, [-96, -8]));
  a.pos('l-ru', add(RU5P_AT(0), [0, -22])); a.pos('f-red', add(G.tp, [-96, 12])); a.pos('l-c4', add(AT.tpt, [0, -22]));
  // beat 1: the recap
  const R = beat === 0 ? recap(a, t) : { nCo2: 3, nRubp: 3, nPga: 6, nRed: 6 };
  // beat 2: 5 triose phosphates meet on the regeneration arrow and become 3 ribulose-5-phosphate; the 6th to TPT
  let nTp = 0, nRu = 0;
  for (let k = 0; k < 5; k++) {
    const [t0, t1] = TP_T(k);
    if (beat === 1) {
      if (t < t0) a.put(`t${k + 1}`, AT.tp(k), 1, PILE);
      else if (t < T_MERGE + 0.25) a.put(`t${k + 1}`, glide(path(TO_MEET(AT.tp(k))), t, t0, t1), 1 - ease(t, T_MERGE - 0.05, T_MERGE + 0.2), PILE + (0.85 - PILE) * ease(t, t0, t0 + 0.6));
    }
    if (beat > 1 || (beat === 1 && t >= t1)) nTp++;
  }
  if (beat === 1) {
    if (t < 0.8) a.put('t6', AT.tp(5), 1, PILE);
    else a.put('t6', glide(path([AT.tp(5), ...WAY.export.slice(0, 2), AT.tpt]), t, 0.8, 2.6), 1, PILE + (0.85 - PILE) * ease(t, 0.8, 1.4));
    if (t > T_MERGE - 0.12 && t < T_MERGE + 0.5) a.put('fl', MEET, life(t, T_MERGE - 0.12, T_MERGE, T_MERGE + 0.1, T_MERGE + 0.5));
    for (let m = 0; m < 3; m++) {
      const tr = RU_T(m);
      if (t >= tr) a.put(`u${m + 1}`, glide(path([MEET, add(MEET, [-20, 30]), RU5P_AT(m)]), t, tr, tr + 0.9), ease(t, tr - 0.05, tr + 0.15), 0.85 + (PILE - 0.85) * ease(t, tr + 0.3, tr + 0.9));
    }
    [1, 2].forEach(i => { const tp = T_MERGE + 0.1 + 0.2 * i; if (t >= tp && t < tp + 2.3) a.put(`xp${i}`, glide(path(PI_BACK), t, tp, tp + 2.0), ease(t, tp - 0.05, tp + 0.15) * (1 - ease(t, tp + 1.8, tp + 2.1)), 0.8); });
  } else if (beat > 1) a.put('t6', AT.tpt, 1, 0.85);
  for (let m = 0; m < 3; m++) if (beat > 1 || (beat === 1 && t >= RU_T(m))) nRu++;
  // beat 3: each ribulose-5-phosphate into PRK with 1 ATP; RuBP 1–3 back under RuBisCO; ADP back
  let nAtp = 0;
  for (let m = 0; m < 3; m++) {
    const tE = PRK_T(m), key = { ru: `u${m + 1}`, atp: `ra${m + 1}`, rubp: `nr${m + 1}`, adp: `rd${m + 1}` };
    if (beat === 2) {
      if (t < tE - 0.8) a.put(key.ru, RU5P_AT(m), 1, PILE);
      if (prkN(a, t, tE, RU5P_AT(m), AT.rubp(m), key)) nAtp++;
    } else if (beat === 3) { a.put(key.rubp, AT.rubp(m), 1, PILE); nAtp++; }
  }
  // names and lines
  a.op('l-co2', beat === 0 ? ease(t, 0.1, 0.5) * (1 - ease(t, 2.2, 2.6)) : 0);
  a.op('l-rubp', beat === 0 ? ease(t, 0.1, 0.5) * (1 - ease(t, CARB(2).t0, CARB(2).t0 + 0.4)) : beat === 2 ? ease(t, PRK_T(0) + 0.3, PRK_T(0) + 0.7) : beat === 3 ? 1 : 0);
  a.op('l-tp', beat === 0 ? ease(t, RED(0).t0 + 0.7, RED(0).t0 + 1.1) : beat === 1 ? 1 - ease(t, TP_T(4)[0], TP_T(4)[0] + 0.4) : 0);
  a.op('f-red', beat === 1 ? ease(t, 0.1, 0.4) * (1 - ease(t, 2.2, 2.6)) : 0);
  a.op('l-ru', beat === 1 ? ease(t, RU_T(0), RU_T(0) + 0.4) : beat === 2 ? 1 - ease(t, PRK_T(2) - 0.4, PRK_T(2)) : 0);
  a.op('l-c4', beat === 1 ? ease(t, 2.4, 2.8) : beat > 1 ? 1 : 0);
  // panel (beats 1–3), ledger (beat 4); every count is a drawn molecule
  a.txt('n-co2', String(R.nCo2)); a.txt('n-rubp', String(R.nRubp)); a.txt('n-pga', String(R.nPga));
  a.txt('n-atp', String(R.nRed)); a.txt('n-nadph', String(R.nRed)); a.txt('n-tp', String(R.nRed));
  a.txt('n-tpk', String(nTp)); a.txt('n-tpc', String(3 * nTp)); a.txt('n-ruk', String(nRu)); a.txt('n-ruc', String(5 * nRu));
  a.txt('n-atp2', String(nAtp)); a.txt('n-rubp2', String(nAtp));
  const on = (b: number, t0: number): number => (beat < b ? 0 : beat > b ? 1 : ease(t, t0, t0 + 0.3));
  const out = beat === 3 ? 1 - ease(t, 0, 0.3) : 1;
  panelShow(a, 'panel', ROWS, {
    'r-h': on(0, 0) * out, 'r-in': on(0, 0.1) * out, 'r-pga': on(0, 1.4) * out, 'r-red': on(0, 2.6) * out, 'r-tp': on(0, 2.6) * out,
    'r-tpc': on(1, 2.0) * out, 'r-ru': on(1, T_MERGE) * out, 'r-atp2': on(2, PRK_T(0) - 0.4) * out,
  });
  a.op('ledger', beat === 3 ? ease(t, 0.2, 0.5) : 0);
  LEDGER.forEach((r, i) => a.op(r.k, beat === 3 ? ease(t, 0.4 + 0.7 * i, 0.7 + 0.7 * i) : 0));
}

const LIT: Part[][] = [
  ['thyl', 'light', 'supply', 'rubisco', 'co2', 'carbox', 'pga', 'reduce', 'tp'],
  ['regen', 'tp'],
  ['regen', 'rubisco'],
  ['thyl', 'light', 'supply', 'reduce', 'regen', 'tp', 'rubisco'],
];

export const STAGING = makeStaging({
  id: 's',
  name: 's · In the strip, per 3 CO₂',
  note: 'Regeneration in the dark-reaction strip, per 3 CO₂: a 5 s recap (CO₂ 1–3 + RuBP 1–3 → 3-PGA 1–6 → with ATP and NADPH → triose phosphate 1–6); 5 triose phosphates (15 C) → 3 ribulose-5-phosphate (15 C); PRK with ATP 1–3 → RuBP 1–3 back under RuBisCO; triose phosphate 6 waits at TPT; the ledger 9 ATP : 6 NADPH',
  beats: REGENERATION,
  dropGlyph: ['co2', 'rubisco', 'pga', 'tp', 'pg2'], dropName: ['co2', 'rubisco', 'tp'],
  actors: ACTORS,
  world: () => `${siteRing('site', '')}${pileName('l-co2', 'CO₂')}${pileName('l-rubp', 'RuBP', 'end')}${pileName('l-tp', 'triose phosphate', 'end')}
    ${pileName('l-ru', 'ribulose-5-phosphate')}${fromLine('f-red', 'from reduction', 'end')}${fromLine('l-c4', '→ sucrose or starch')}`,
  hud: () => `${panelSvg('panel', CX, 380, CW, ROWS)}${ledgerSvg()}`,
  cam0: CYCLE_VIEW, cams: [CYCLE_VIEW, CYCLE_VIEW, CYCLE_VIEW, CYCLE_VIEW], camT: [[0, 1], [0, 1], [0, 1], [0, 1]],
  lit: LIT,
  frame,
});
