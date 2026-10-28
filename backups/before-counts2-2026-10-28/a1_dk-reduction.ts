// 'reduction', staging s · "Reduction in the strip" (slide C3 · Reduction; beats-reduction.ts; C₃ photosynthesis step by
// step, lecturer, 28 Oct 2026). GAPDH lit with the thylakoid edge's ATP and NADPH, the rest dimmed; counts per 3 CO₂.
// - Beat 1, Phosphoglycerate kinase: the camera comes from the whole strip into the stroma; 6 3-PGA wait in their pile.
//   ATP 1–6 glide in from the thylakoid edge, one to each 3-PGA, which becomes 1,3-bisphosphoglycerate (a second
//   phosphate); ADP glides back to the thylakoid edge. The panel ticks ATP and 1,3-bisphosphoglycerate 1–6.
// - Beat 2, GAPDH: each 1,3-bisphosphoglycerate goes into GAPDH and meets NADPH 1–6; triose phosphate 1–6 leaves for its
//   pile; NADP⁺ and Pᵢ glide back to the thylakoid edge. The panel ticks NADPH and triose phosphate.
// - Beat 3, Light off: the thylakoid edge darkens; RuBisCO goes on with 2 RuBP and 2 CO₂ and 4 3-PGA pile up, as
//   Bassham's light-off transient shows (Calvin 1961, Fig. 15, drawn on past "light off"). The 6 triose phosphates wait.
import lightPng from '../../assets/photos/c3-light.png';
import { REDUCTION } from './beats-reduction';
import {
  add, card, CYCLE_VIEW, ease, G, GLYPH, glide, life, makeStaging, panelShow, panelSvg, path, PGA_AT, PILE, rubEvent, SITE, siteRing, T,
  TP_AT, view, WAY, type Actor, type Api, type Part, type Row, type RubEv, type V,
} from './dk1-common';

/* ---------------------------------------------------------------- schedule and ways */

const PGK_T = (j: number): number => 2.0 + 0.55 * j;      // ATP j arrives at 3-PGA j at PGK_T + 0.9
const GAP_T = (j: number): number => 0.3 + 0.6 * j;       // 1,3-bisphosphoglycerate j and NADPH j reach GAPDH at GAP_T + 1.0
const ATP_TO = (to: V): V[] => [G.atpTag, add(G.atpTag, [54, 46]), add(to, [14, -26]), to];
const ADP_BACK = (from: V): V[] => [from, add(from, [-30, -60]), [70, 110], G.back];
/** 1,3-bisphosphoglycerate (5 balls) rests a little smaller than 3-PGA, so the pile's 2 columns stay apart. */
const BPS = 0.72;
const DARK: RubEv[] = [0, 1].map(e => ({ gas: 'co2', t0: [0.8, 2.4][e], d: [2.0, 1.9][e], slotA: PGA_AT(2 * e), slotB: PGA_AT(2 * e + 1), settle: PILE }));

/* ---------------------------------------------------------------- actors */

const ACTORS: Actor[] = [
  ...[0, 1, 2, 3, 4, 5].flatMap(j => [
    { k: `pg${j}`, g: GLYPH.carbon('CCCP') }, { k: `bp${j}`, g: GLYPH.carbon('PCCCP') }, { k: `at${j}`, g: GLYPH.atp() }, { k: `ad${j}`, g: GLYPH.adp() },
    { k: `nd${j}`, g: GLYPH.nadph() }, { k: `tp${j}`, g: GLYPH.carbon('CCCP') }, { k: `np${j}`, g: GLYPH.nadp() }, { k: `pi${j}`, g: GLYPH.pi() },
  ]),
  ...[0, 1].flatMap(e => [{ k: `dr${e}`, g: GLYPH.carbon('PCCCCCP') }, { k: `dg${e}`, g: GLYPH.co2() }, { k: `da${e}`, g: GLYPH.carbon('CCCP', 'n...') }, { k: `db${e}`, g: GLYPH.carbon('CCCP') }]),
];

/* ---------------------------------------------------------------- panel and card (stage units) */

const CX = 1146, CW = 430;
const n = (k: string): string => `<tspan data-k="${k}">0</tspan>`;
const ROWS: Row[] = [
  { k: 'r-h', h: 34, html: 'per 3 CO₂', cls: 'dk-ph' },
  { k: 'r-atp', h: 32, html: `ATP ${n('n-atp')}` },
  { k: 'r-bpg', h: 32, html: `1,3-bisphosphoglycerate ${n('n-bpg')}` },
  { k: 'r-nadph', h: 32, html: `NADPH ${n('n-nadph')}` },
  { k: 'r-tp', h: 34, html: `triose phosphate ${n('n-tp')}` },
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

function frame(a: Api, beat: number, t: number): void {
  a.pos('site', SITE); a.op('site', beat === 2 ? 1 : 0);
  a.pos('l-tp', add(G.tp, [-76, -30])); a.op('l-tp', beat === 0 ? 0 : beat === 1 ? ease(t, 1.0, 1.4) : 1);
  // the pile's name: 3-PGA until the first one is phosphorylated, then 1,3-bisphosphoglycerate
  if (beat === 0) a.lit('pga', 1 - ease(t, PGK_T(0) + 0.9, PGK_T(0) + 1.2));
  if (beat === 1) a.lit('pga', 0);
  a.pos('l-bpg', add(G.pga, [-40, 32])); a.op('l-bpg', beat === 0 ? ease(t, PGK_T(0) + 0.9, PGK_T(0) + 1.3) : beat === 1 ? 1 - ease(t, GAP_T(5) + 0.6, GAP_T(5) + 1.0) : 0);
  const T1 = beat === 0 ? t : 99, T2 = beat === 1 ? t : beat > 1 ? 99 : -1;
  let nAtp = 0, nNadph = 0;
  for (let j = 0; j < 6; j++) {
    const slot = PGA_AT(j), tA = PGK_T(j) + 0.9;
    // beat 1: ATP to each 3-PGA; 3-PGA becomes 1,3-bisphosphoglycerate; ADP back
    if (beat === 0) {
      a.put(`pg${j}`, slot, ease(t, 0.6 + 0.1 * j, 1.0 + 0.1 * j) * (1 - ease(t, tA, tA + 0.25)), PILE);
      if (t >= PGK_T(j) && t < tA + 0.25) a.put(`at${j}`, glide(path(ATP_TO(slot)), t, PGK_T(j), tA), 1 - ease(t, tA, tA + 0.2), 0.85);
      if (t > tA - 0.1 && t < tA + 0.3) a.put('fl', slot, life(t, tA - 0.1, tA, tA + 0.05, tA + 0.3), 0.6);
      if (t >= tA && t < tA + 1.5) a.put(`ad${j}`, glide(path(ADP_BACK(slot)), t, tA + 0.05, tA + 1.3), ease(t, tA, tA + 0.15) * (1 - ease(t, tA + 1.15, tA + 1.4)), 0.8);
    }
    if (T1 >= tA) nAtp++;
    // the 1,3-bisphosphoglycerate: in the pile, then (beat 2) into GAPDH with NADPH
    const tR = GAP_T(j) + 1.0;
    if (beat === 0 && t >= tA) a.put(`bp${j}`, slot, ease(t, tA, tA + 0.25), BPS);
    if (beat === 1) {
      if (t < tR + 0.25) {
        const o = 1 - ease(t, tR, tR + 0.2);
        a.put(`bp${j}`, t < GAP_T(j) ? slot : glide(path(WAY.pgaUp(slot)), t, GAP_T(j), tR), o, BPS + (0.85 - BPS) * ease(t, GAP_T(j), GAP_T(j) + 0.5));
        if (t >= GAP_T(j) - 0.1) a.put(`nd${j}`, glide(path(WAY.nadphIn), t, GAP_T(j) - 0.1, tR), o);
      }
      if (t > tR - 0.12 && t < tR + 0.4) a.put('fl', G.gap, life(t, tR - 0.12, tR, tR + 0.08, tR + 0.4));
      if (t >= tR) {
        const back = (k: string, dt: number): void => { if (t < tR + 1.6 + dt) a.put(k, glide(path(WAY.back), t, tR + 0.1 + dt, tR + 1.4 + dt), ease(t, tR, tR + 0.2) * (1 - ease(t, tR + 1.25 + dt, tR + 1.5 + dt)), 0.8); };
        back(`np${j}`, 0); back(`pi${j}`, 0.15);
      }
    }
    if (T2 >= tR) nNadph++;
    // triose phosphate to its pile, and waiting there
    if (T2 >= tR) a.put(`tp${j}`, beat === 1 ? glide(path([...WAY.tpOut, TP_AT(j)]), t, tR + 0.05, tR + 1.0) : TP_AT(j), beat === 1 ? ease(t, tR, tR + 0.2) : 1, beat === 1 ? 1 + (PILE - 1) * ease(t, tR + 0.3, tR + 1.0) : PILE);
  }
  // beat 3: light off; RuBisCO goes on, 3-PGA piles up
  if (beat === 2) DARK.forEach((ev, e) => rubEvent(a, t, ev, { rb: `dr${e}`, g: `dg${e}`, a: `da${e}`, b: `db${e}`, fl: 'fl' }));
  a.op('c15', beat === 2 ? ease(t, 0.2, 0.7) : 0);
  a.attr('c15-clip', 'width', clipW(beat === 2 ? ease(t, 0.8, 4.0) : 0));
  // the panel, per 3 CO₂ (it stays with the light-off beat)
  a.txt('n-atp', String(nAtp)); a.txt('n-bpg', String(nAtp)); a.txt('n-nadph', String(nNadph)); a.txt('n-tp', String(nNadph));
  const on = (b: number, t0: number): number => (beat < b ? 0 : beat > b ? 1 : ease(t, t0, t0 + 0.3));
  panelShow(a, 'panel', ROWS, { 'r-h': on(0, 1.8), 'r-atp': on(0, 1.8), 'r-bpg': on(0, 2.6), 'r-nadph': on(1, 0.2), 'r-tp': on(1, 1.1) });
}

const LIGHT: Part[] = ['thyl', 'light', 'supply'];
const LIT: Part[][] = [
  [...LIGHT, 'reduce', 'pga'],
  [...LIGHT, 'reduce', 'tp'],
  ['rubisco', 'co2', 'carbox', 'pga', 'tp'],
];

export const STAGING = makeStaging({
  id: 's',
  name: 's · In the strip',
  note: 'Reduction in the dark-reaction strip, per 3 CO₂: ATP 1–6 turn 6 3-PGA into 1,3-bisphosphoglycerate, NADPH 1–6 at GAPDH turn them into 6 triose phosphate, ADP, Pᵢ and NADP⁺ back to the thylakoid edge; light off: 3-PGA piles up (Bassham’s curve)',
  beats: REDUCTION,
  dropGlyph: ['pga', 'tp'], dropName: ['tp'],
  actors: ACTORS,
  world: () => `${siteRing('site', '')}<g data-k="l-tp" display="none">${T(0, 0, 'triose phosphate', 'cel-mn cel-halo', 'end')}</g>
    <g data-k="l-bpg" display="none">${T(0, 0, '1,3-bisphosphoglycerate', 'cel-mn cel-halo')}</g>`,
  hud: p => `${panelSvg('panel', CX, 380, CW, ROWS)}${lightCard(p)}`,
  cam0: CYCLE_VIEW, cams: [CYCLE_VIEW, CYCLE_VIEW, CYCLE_VIEW], camT: [[0, 1], [0, 1], [0, 1]],
  lit: LIT,
  frame,
});
