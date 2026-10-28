// cb3, staging s · "Reduction and regeneration in the strip" (slide C3, beats CB3; DARK_ANIM_BRIEF.md).
// - Beat 1, The fuel (per 3 CO₂; a click between its two steps): the camera comes from the whole strip into the stroma;
//   the thylakoid edge, GAPDH and PRK light. 6 × (3-PGA + ATP + NADPH) meet at GAPDH, 6 triose phosphate leave, and ADP,
//   Pᵢ and NADP⁺ glide back to the thylakoid edge; [click] 5 triose phosphate go into PRK, and with 3 ATP 3 RuBP leave;
//   ADP glides back. 1 triose phosphate stays. The panel ticks ATP 1–6 and NADPH 1–6 (reduction), ATP 1–3 (regeneration).
// - Beat 2, Light off: the thylakoid edge darkens (no more ATP and NADPH). RuBisCO goes on: 2 RuBP + 2 CO₂ → 4 3-PGA,
//   which pile up. Card: Calvin 1961, Fig. 15 (Bassham's data), drawn on past "light off" as the pile grows.
// - Beat 3, Why: GAPDH and PRK go idle (dimmed); RuBisCO uses the last RuBP; the next CO₂ reaches an empty site and waits.
// - Beat 4, One in six: the light comes back; the 3-PGA go back into GAPDH (the cycle runs again), and the one triose
//   phosphate that stayed leaves for TPT, with export and starch lit.
import lightPng from '../../assets/photos/c3-light.png';
import { CB3 } from './beats-cb';
import {
  add, card, CYCLE_VIEW, ease, G, GLYPH, glide, intoPrk, makeStaging, newRubp, panelShow, panelSvg, path, PGA_AT, PILE, reduction,
  RUBP_AT, rubEvent, SITE, siteRing, T, TP_AT, view, WAY, type Actor, type Api, type Part, type Row, type RubEv, type V,
} from './dk1-common';

/* ---------------------------------------------------------------- schedule */

const RED_T = (j: number): number => 2.4 + 0.6 * j;
const BACK_T = (k: number): number => 8.4 + 0.28 * k;
const NEW_T = (m: number): number => 9.6 + 0.75 * m;
/** The dark: RuBisCO uses the 3 RuBP left (beat 2: 2, beat 3: 1), each with a CO₂, into the 3-PGA pile. */
const DARK: RubEv[] = [0, 1, 2].map(e => ({
  gas: 'co2', t0: [1.2, 3.0, 0.8][e], d: [2.2, 2.0, 2.0][e], slotA: PGA_AT(2 * e), slotB: PGA_AT(2 * e + 1), settle: PILE,
  rubpFrom: [RUBP_AT(2 - e)],
}));
const DOCK: V = add(SITE, [-17, -15]);

/* ---------------------------------------------------------------- actors */

const ACTORS: Actor[] = [
  ...[0, 1, 2, 3, 4, 5].map(i => ({ k: `pg${i}`, g: GLYPH.carbon('CCCP') })),
  ...[0, 1, 2, 3, 4, 5].flatMap(j => [
    { k: `at${j}`, g: GLYPH.atp() }, { k: `nd${j}`, g: GLYPH.nadph() }, { k: `tp${j}`, g: GLYPH.carbon('CCCP') },
    { k: `ad${j}`, g: GLYPH.adp() }, { k: `pi${j}`, g: GLYPH.pi() }, { k: `np${j}`, g: GLYPH.nadp() },
  ]),
  ...[0, 1, 2].flatMap(m => [{ k: `ra${m}`, g: GLYPH.atp() }, { k: `nr${m}`, g: GLYPH.carbon('PCCCCCP') }, { k: `rd${m}`, g: GLYPH.adp() }]),
  ...[0, 1, 2].flatMap(e => [{ k: `dg${e}`, g: GLYPH.co2() }, { k: `da${e}`, g: GLYPH.carbon('CCCP', 'n...') }, { k: `db${e}`, g: GLYPH.carbon('CCCP') }]),
  { k: 'cw', g: GLYPH.co2() },
];

/* ---------------------------------------------------------------- panel and card (stage units) */

const CX = 1146, CW = 430;
const n = (k: string): string => `<tspan data-k="${k}">0</tspan>`;
const ROWS: Row[] = [
  { k: 'r-h', h: 34, html: 'per 3 CO₂', cls: 'dk-ph' },
  { k: 'r-red', h: 32, html: `reduction: ATP ${n('n-ra')} · NADPH ${n('n-rn')}` },
  { k: 'r-reg', h: 34, html: `regeneration: ATP ${n('n-ga')}` },
];
/** Calvin 1961, Fig. 15: x = 172 + 1.1625 × t px (file pixels); light off at 400 s; shown to 700 s. */
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

const V3 = CYCLE_VIEW;
const RED_K = (j: number) => ({ pga: `pg${j}`, atp: `at${j}`, nadph: `nd${j}`, tp: `tp${j}`, adp: `ad${j}`, pi: `pi${j}`, nadp: `np${j}` });
const DARK_K = (e: number) => ({ rb: `nr${e}`, g: `dg${e}`, a: `da${e}`, b: `db${e}`, fl: 'fl' });

function frame(a: Api, beat: number, t: number): void {
  a.pos('site', SITE); a.op('site', beat === 0 ? 0 : 1);
  a.pos('l-tp', add(G.tp, [-76, -30])); a.op('l-tp', 1);
  a.pos('l-rubp', add(G.rubp, [56, 6])); a.op('l-rubp', 1);
  // beat 1: the fuel
  let nRed = 0, nReg = 0;
  for (let j = 0; j < 6; j++) {
    if (beat === 0 && t < RED_T(j)) a.put(`pg${j}`, PGA_AT(j), ease(t, 0.6 + 0.1 * j, 1.0 + 0.1 * j), PILE);
    if (beat === 0 && reduction(a, t, RED_T(j), PGA_AT(j), TP_AT(j), RED_K(j))) nRed++;
  }
  for (let k = 0; k < 5; k++) if (beat === 0) intoPrk(a, t, BACK_T(k), TP_AT(k), `tp${k}`);
  for (let m = 0; m < 3; m++) {
    if (beat === 0 && newRubp(a, t, NEW_T(m), RUBP_AT(2 - m), { atp: `ra${m}`, rubp: `nr${m}`, adp: `rd${m}` })) nReg++;
    // the RuBP pile, waiting for RuBisCO in the dark (beats 2 and 3); RuBP m sits in place 2 − m and goes with event m
    if ((beat === 1 && (m === 2 || t < DARK[m].t0)) || (beat === 2 && m === 2 && t < DARK[2].t0)) a.put(`nr${m}`, RUBP_AT(2 - m), 1, PILE);
  }
  // the one triose phosphate that stays
  if (beat >= 1 && beat <= 2) a.put('tp5', TP_AT(5), 1, PILE);
  if (beat === 0) {
    a.txt('n-ra', String(nRed)); a.txt('n-rn', String(nRed)); a.txt('n-ga', String(nReg));
    panelShow(a, 'panel', ROWS, { 'r-h': ease(t, 2.0, 2.3), 'r-red': ease(t, 2.0, 2.3), 'r-reg': ease(t, 8.3, 8.6) });
  } else panelShow(a, 'panel', ROWS, beat === 1 ? { 'r-h': 1 - ease(t, 0, 0.4), 'r-red': 1 - ease(t, 0, 0.4), 'r-reg': 1 - ease(t, 0, 0.4) } : {});
  // beats 2 and 3: RuBisCO uses up the RuBP left; 3-PGA piles up
  if (beat === 1) { rubEvent(a, t, DARK[0], DARK_K(0)); rubEvent(a, t, DARK[1], DARK_K(1)); }
  if (beat === 2) {
    rubEvent(a, 99, DARK[0], DARK_K(0)); rubEvent(a, 99, DARK[1], DARK_K(1)); rubEvent(a, t, DARK[2], DARK_K(2));
    // the next CO₂ reaches the empty site and waits
    if (t > 3.0) a.put('cw', glide(path([G.co2, G.co2From, G.co2To, DOCK]), t, 3.0, 4.2), ease(t, 3.0, 3.2));
  }
  // the card: Bassham's light-off transient, drawn on past "light off" as 3-PGA piles up
  a.op('c15', beat === 1 ? ease(t, 0.2, 0.7) : beat === 2 ? 1 : beat === 3 ? 1 - ease(t, 0, 0.4) : 0);
  a.attr('c15-clip', 'width', clipW(beat === 1 ? ease(t, 1.0, 5.0) : beat >= 2 ? 1 : 0));
  // beat 4: light again; the 3-PGA go back into GAPDH; the one triose phosphate leaves for TPT
  if (beat === 3) {
    a.put('cw', DOCK, 1 - ease(t, 0.2, 0.6));
    for (let e = 0; e < 3; e++) for (const [k, i] of [[`da${e}`, 2 * e], [`db${e}`, 2 * e + 1]] as Array<[string, number]>) {
      const t0 = 0.8 + 0.16 * i;
      a.put(k, glide(path(WAY.pgaUp(PGA_AT(i))), t, t0, t0 + 1.1), 1 - ease(t, t0 + 0.9, t0 + 1.15), PILE);
    }
    a.put('tp5', glide(path([TP_AT(5), ...WAY.export.slice(0, 2), add(G.tpt, [-30, -12])]), t, 1.6, 3.6), 1, PILE + (0.85 - PILE) * ease(t, 1.6, 2.2));
  }
}

const LIGHT: Part[] = ['thyl', 'light', 'supply'];
const LIT: Part[][] = [
  [...LIGHT, 'reduce', 'regen', 'pga', 'tp'],
  ['rubisco', 'co2', 'carbox', 'pga', 'reduce', 'regen', 'tp'],
  ['rubisco', 'co2', 'carbox', 'pga', 'tp'],
  [...LIGHT, 'rubisco', 'co2', 'carbox', 'pga', 'reduce', 'regen', 'tp', 'export', 'starch'],
];

export const STAGING = makeStaging({
  id: 's',
  name: 's · In the strip',
  note: 'Reduction and regeneration in the dark-reaction strip, per 3 CO₂: 6 ATP + 6 NADPH at GAPDH and 3 ATP at PRK, numbered, with ADP, Pᵢ and NADP⁺ back to the thylakoid edge; light off: 3-PGA piles up and RuBP runs out (Bassham’s curve); light on: 1 triose phosphate in 6 leaves',
  beats: CB3,
  holds: [[8.2], [], [], []],
  dropGlyph: ['rubisco', 'pga', 'tp'], dropName: ['rubisco', 'tp'],
  actors: ACTORS,
  world: () => `${siteRing('site', '')}<g data-k="l-tp" display="none">${T(0, 0, 'triose phosphate', 'cel-mn cel-halo', 'end')}</g><g data-k="l-rubp" display="none">${T(0, 0, 'RuBP', 'cel-mn cel-halo', 'start')}</g>`,
  hud: p => `${panelSvg('panel', CX, 380, CW, ROWS)}${lightCard(p)}`,
  cam0: view(1.03, [770, 300]), cams: [V3, V3, V3, V3], camT: [[0.3, 2.2], [0, 1], [0, 1], [0, 1]],
  lit: LIT,
  frame,
});
