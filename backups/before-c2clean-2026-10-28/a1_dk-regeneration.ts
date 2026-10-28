// 'regeneration', staging s · "Regeneration in the strip" (slide C3b · Regeneration; beats-regeneration.ts; C₃
// photosynthesis step by step, lecturer, 28 Oct 2026). PRK lit, the rest dimmed; counts per 3 CO₂.
// - Beat 1, Carbon rearrangement: the camera comes from the whole strip into the stroma; 6 triose phosphates wait on top.
//   5 of them glide along the regeneration arrow and meet on its way down; the panel ticks their carbon, 3 … 15 C; they
//   are rearranged into 3 ribulose-5-phosphate (5 C, 1 phosphate each), ticking 5, 10, 15 C; the 2 phosphates left over
//   glide back to the thylakoid edge as Pᵢ. The 6th triose phosphate leaves for TPT and waits there.
// - Beat 2, Phosphoribulokinase (PRK): each ribulose-5-phosphate goes into PRK and takes ATP 1–3 (from the strip's ATP);
//   RuBP 1–3 leaves PRK, goes to RuBP's place under RuBisCO and rises into RuBisCO; ADP glides back.
// - Beat 3, Per 3 CO₂: GAPDH and PRK light together; the ledger: reduction 6 ATP + 6 NADPH, regeneration 3 ATP,
//   cycle 9 : 6 = 3 : 2. The triose phosphate waits at TPT.
import { REGENERATION } from './beats-regeneration';
import {
  add, CYCLE_VIEW, ease, G, GLYPH, glide, life, makeStaging, panelShow, panelSvg, path, PILE, SITE, siteRing, T, TP_AT, view, WAY,
  type Actor, type Api, type Part, type Row, type V,
} from './dk1-common';

/* ---------------------------------------------------------------- places and schedule (strip units) */

/** Where the 5 triose phosphates meet: on the regeneration arrow, on its way down to PRK. */
const MEET: V = [606, 300];
const TO_MEET = (from: V): V[] => WAY.toPrk(from).slice(0, 5).concat([MEET]);
/** The 3 ribulose-5-phosphate wait in a column left of the arrow, above PRK. */
const RU5P_AT = (m: number): V => add(G.prk, [4, -124 + 24 * m]);
const TP_T = (k: number): number => 1.8 + 0.3 * k;        // triose phosphate k reaches MEET at TP_T + 1.6
const T_MERGE = 5.0, RU_T = (m: number): number => T_MERGE + 0.1 + 0.35 * m;
const AT_TPT: V = add(G.tpt, [-30, -12]);
const PI_BACK: V[] = [MEET, [628, 220], [560, 70], [380, 12], [200, 4], add(G.back, [30, -6]), G.back];
// beat 2
const PRK_T = (m: number): number => 0.4 + 1.1 * m;       // ribulose-5-phosphate m reaches PRK (and ATP m) at PRK_T + 0.9
const RU_TO_PRK = (from: V): V[] => [from, add(from, [10, 40]), G.prk];
const RUBP_UP: V[] = [G.prk, G.prkFrom, G.prkTo, G.rubp, G.rubpFrom, G.rubpTo, SITE];

/* ---------------------------------------------------------------- actors */

const ACTORS: Actor[] = [
  ...[0, 1, 2, 3, 4, 5].map(j => ({ k: `tp${j}`, g: GLYPH.carbon('CCCP') })),
  ...[0, 1, 2].flatMap(m => [{ k: `ru${m}`, g: GLYPH.carbon('CCCCCP') }, { k: `ra${m}`, g: GLYPH.atp() }, { k: `nr${m}`, g: GLYPH.carbon('PCCCCCP') }, { k: `rd${m}`, g: GLYPH.adp() }]),
  { k: 'pi0', g: GLYPH.pi() }, { k: 'pi1', g: GLYPH.pi() },
];

/* ---------------------------------------------------------------- panel and ledger (stage units) */

const CX = 1146, CW = 430;
const n = (k: string): string => `<tspan data-k="${k}">0</tspan>`;
const ROWS: Row[] = [
  { k: 'r-h', h: 34, html: 'per 3 CO₂', cls: 'dk-ph' },
  { k: 'r-tp', h: 32, html: `triose phosphate: ${n('n-tpk')} × 3 C = ${n('n-tpc')} C` },
  { k: 'r-ru', h: 32, html: `ribulose-5-phosphate: ${n('n-ruk')} × 5 C = ${n('n-ruc')} C` },
  { k: 'r-atp', h: 32, html: `ATP ${n('n-atp')}` },
  { k: 'r-rubp', h: 34, html: `RuBP ${n('n-rubp')}` },
];
/** The ledger of beat 3: a table, ATP and NADPH per 3 CO₂ for each part of the cycle. */
const LX = CX, LY = 330, LC1 = LX + 300, LC2 = LX + 400;
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

function frame(a: Api, beat: number, t: number): void {
  a.pos('site', SITE); a.op('site', 1);
  a.pos('l-tp', add(G.tp, [-76, -30])); a.op('l-tp', 1);
  a.pos('l-ru', add(RU5P_AT(0), [0, -22])); a.op('l-ru', beat === 0 ? ease(t, RU_T(0), RU_T(0) + 0.4) : beat === 1 ? 1 - ease(t, PRK_T(2) + 0.7, PRK_T(2) + 1.0) : 0);
  const T1 = beat === 0 ? t : 99, T2 = beat === 1 ? t : beat > 1 ? 99 : -1;
  // beat 1: 5 triose phosphates to the meeting point; the 6th to TPT
  let nTp = 0, nRu = 0;
  for (let k = 0; k < 5; k++) {
    const t0 = TP_T(k), tm = t0 + 1.6;
    if (beat === 0) {
      if (t < t0) a.put(`tp${k}`, TP_AT(k), ease(t, 0.5 + 0.08 * k, 0.9 + 0.08 * k), PILE);
      else if (t < T_MERGE + 0.25) a.put(`tp${k}`, glide(path(TO_MEET(TP_AT(k))), t, t0, tm), 1 - ease(t, T_MERGE, T_MERGE + 0.2), PILE + (0.85 - PILE) * ease(t, t0, t0 + 0.6));
    }
    if (T1 >= tm) nTp++;
  }
  if (beat === 0) {
    if (t < 2.0) a.put('tp5', TP_AT(5), ease(t, 0.9, 1.3), PILE);
    else a.put('tp5', glide(path([TP_AT(5), ...WAY.export.slice(0, 2), AT_TPT]), t, 2.0, 3.8), 1, PILE + (0.85 - PILE) * ease(t, 2.0, 2.6));
  } else a.put('tp5', AT_TPT, 1, 0.85);
  if (beat === 0 && t > T_MERGE - 0.12 && t < T_MERGE + 0.5) a.put('fl', MEET, life(t, T_MERGE - 0.12, T_MERGE, T_MERGE + 0.1, T_MERGE + 0.5));
  // the rearrangement: 3 ribulose-5-phosphate (and 2 Pᵢ) out of the meeting point
  for (let m = 0; m < 3; m++) {
    const tr = RU_T(m);
    if (T1 >= tr) nRu++;
    if (beat === 0 && t >= tr) a.put(`ru${m}`, glide(path([MEET, add(MEET, [-20, 30]), RU5P_AT(m)]), t, tr, tr + 0.9), ease(t, tr - 0.05, tr + 0.15), 0.85 + (PILE - 0.85) * ease(t, tr + 0.3, tr + 0.9));
  }
  if (beat === 0) [0, 1].forEach(i => { const tp = T_MERGE + 0.2 + 0.2 * i; if (t >= tp && t < tp + 2.3) a.put(`pi${i}`, glide(path(PI_BACK), t, tp, tp + 2.0), ease(t, tp - 0.05, tp + 0.15) * (1 - ease(t, tp + 1.8, tp + 2.1)), 0.8); });
  // beat 2: each ribulose-5-phosphate into PRK with ATP; RuBP to its place under RuBisCO and up into RuBisCO; ADP back
  let nAtp = 0;
  for (let m = 0; m < 3; m++) {
    const t0 = PRK_T(m), tE = t0 + 0.9;
    if (beat === 1) {
      if (t < t0) a.put(`ru${m}`, RU5P_AT(m), 1, PILE);
      else if (t < tE + 0.2) a.put(`ru${m}`, glide(path(RU_TO_PRK(RU5P_AT(m))), t, t0, tE), 1 - ease(t, tE - 0.05, tE + 0.15), PILE + (0.85 - PILE) * ease(t, t0, t0 + 0.5));
      if (t >= tE - 0.8 && t < tE + 0.25) a.put(`ra${m}`, glide(path(WAY.regenAtp), t, tE - 0.8, tE), 1 - ease(t, tE, tE + 0.2));
      if (t > tE - 0.12 && t < tE + 0.45) a.put('fl', G.prk, life(t, tE - 0.12, tE, tE + 0.1, tE + 0.45));
      if (t >= tE && t < tE + 2.2) a.put(`nr${m}`, glide(path(RUBP_UP), t, tE + 0.05, tE + 1.8), ease(t, tE, tE + 0.2) * (1 - ease(t, tE + 1.75, tE + 2.05)), 0.9);
      if (t >= tE && t < tE + 2.5) a.put(`rd${m}`, glide(path(WAY.prkBack), t, tE + 0.1, tE + 2.3), ease(t, tE, tE + 0.2) * (1 - ease(t, tE + 2.1, tE + 2.35)), 0.8);
    }
    if (T2 >= tE) nAtp++;
  }
  // panel (beats 1 and 2), ledger (beat 3)
  a.txt('n-tpk', String(nTp)); a.txt('n-tpc', String(3 * nTp)); a.txt('n-ruk', String(nRu)); a.txt('n-ruc', String(5 * nRu));
  a.txt('n-atp', String(nAtp)); a.txt('n-rubp', String(nAtp));
  const on = (b: number, t0: number): number => (beat < b ? 0 : beat > b ? 1 : ease(t, t0, t0 + 0.3));
  const out = beat === 2 ? 1 - ease(t, 0, 0.3) : 1;
  panelShow(a, 'panel', ROWS, { 'r-h': on(0, 1.8) * out, 'r-tp': on(0, 3.2) * out, 'r-ru': on(0, T_MERGE) * out, 'r-atp': on(1, 0.6) * out, 'r-rubp': on(1, 1.2) * out });
  a.op('ledger', beat === 2 ? ease(t, 0.2, 0.5) : 0);
  LEDGER.forEach((r, i) => a.op(r.k, beat === 2 ? ease(t, 0.4 + 0.7 * i, 0.7 + 0.7 * i) : 0));
}

const LIT: Part[][] = [
  ['regen', 'tp', 'export'],
  ['regen', 'rubisco'],
  ['thyl', 'light', 'supply', 'reduce', 'regen', 'tp', 'export'],
];

export const STAGING = makeStaging({
  id: 's',
  name: 's · In the strip',
  note: 'Regeneration in the dark-reaction strip, per 3 CO₂: 5 triose phosphates (5 × 3 C = 15 C) rearranged into 3 ribulose-5-phosphate (3 × 5 C), the 6th to TPT; PRK with ATP 1–3 makes RuBP 1–3, which rises into RuBisCO; the ledger 9 ATP : 6 NADPH = 3 : 2',
  beats: REGENERATION,
  dropGlyph: ['tp', 'pg2'], dropName: ['tp'],
  actors: ACTORS,
  world: () => `${siteRing('site', '')}<g data-k="l-tp" display="none">${T(0, 0, 'triose phosphate', 'cel-mn cel-halo', 'end')}</g>
    <g data-k="l-ru" display="none">${T(0, 0, 'ribulose-5-phosphate', 'cel-mn cel-halo')}</g>`,
  hud: () => `${panelSvg('panel', CX, 380, CW, ROWS)}${ledgerSvg()}`,
  cam0: view(1.03, [770, 300]), cams: [CYCLE_VIEW, CYCLE_VIEW, CYCLE_VIEW], camT: [[0.3, 2.2], [0, 1], [0, 1]],
  lit: LIT,
  frame,
});
