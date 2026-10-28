// rf5, staging s · "Rubisco in the strip" (slide C5; DARK_ANIM_BRIEF.md): carboxylation and oxygenation at Rubisco's
// active site in the dark-reaction strip, counted per reaction; Forrester 1966 as a card; a numbered run of 5
// carboxylations and 2 oxygenations (leaf at 25 °C, ≈ 200 ppm CO₂ in the chloroplast: vo/vc = 2Γ*/C ≈ 2 × 42.75 / 200 ≈ 0.43,
// Bernacchi et al. 2001). Beats: RF5 without its Temperature beat (warming now lives on slide C5b).
// - Beat 1: the camera comes from the whole strip onto Rubisco; Rubisco, CO₂, the carboxylation arrow and 3-PGA light.
//   Active site 1 is named. RuBP (5 C) glides in from the strip's RuBP, CO₂ (1 C) docks on it, 2 3-PGA (3 C each, the
//   new carbon ringed) leave up the carboxylation arrow. The panel ticks in step: RuBP + CO₂ → 2 3-PGA, 5 C + 1 C = 2 × 3 C.
// - Beat 2: O₂ and the oxygenation arrow light; RuBP again, O₂ docks at the same site; 3-PGA and 2-phosphoglycolate (its 2 C
//   ringed rust) leave. Panel: RuBP + O₂ → 3-PGA + 2-phosphoglycolate, 5 C = 3 C + 2 C.
// - Beat 3: Forrester, Krotkov & Nelson 1966, Fig. 2 (soybean leaves, CO₂ uptake against O₂) as a paper card.
// - Beat 4: the first products move on (3-PGA into GAPDH, 2-phosphoglycolate along the glycolate arrow); the run: 7
//   reactions in turn, CO₂ 1, CO₂ 2, O₂ 1, CO₂ 3, CO₂ 4, O₂ 2, CO₂ 5, faster as they go; each product stays in its pile;
//   chips number the reactions and the tally ticks (carboxylations 5, oxygenations 2; 3-PGA 12, 2-phosphoglycolate 2).
import forrPng from '../../assets/rf/forrester1966-fig2.png';
import { RF5 } from './beats-rf56';
import {
  add, card, G, GLYPH, makeStaging, panelShow, panelSvg, path, glide, rubEvent, SITE, siteRing, T, view, ease, life,
  type Actor, type Api, type Row, type RubEv, type V,
} from './dk1-common';

const BEATS = RF5.filter(b => b.tag !== 'Temperature');

/* ---------------------------------------------------------------- piles and events */

/** The 3-PGA pile (3 columns × 4 rows) at the top of the carboxylation arrow, the 2-phosphoglycolate pile at its spot. */
const SLOT: V[] = Array.from({ length: 12 }, (_, i) => add(G.pga, [-122 + (i % 4) * 46, -6 - Math.floor(i / 4) * 24]));
const PG: V[] = [add(G.pg2, [2, -2]), add(G.pg2, [2, 22])];
const INTRO: RubEv[] = [
  { gas: 'co2', t0: 3.2, d: 3.6, slotA: SLOT[0], slotB: SLOT[1] },
  { gas: 'o2', t0: 0.9, d: 3.4, slotA: SLOT[2], slotB: PG[0] },
];
const RUN_GAS: Array<'co2' | 'o2'> = ['co2', 'co2', 'o2', 'co2', 'co2', 'o2', 'co2'];
const RUN_T = [1.8, 3.5, 5.0, 6.4, 7.6, 8.8, 9.9], RUN_D = [2.6, 2.3, 2.1, 1.9, 1.8, 1.7, 1.7];
const RUN: RubEv[] = (() => {
  let s = 0, g = 0;
  return RUN_GAS.map((gas, i) => {
    const ev: RubEv = gas === 'co2' ? { gas, t0: RUN_T[i], d: RUN_D[i], slotA: SLOT[s], slotB: SLOT[s + 1] } : { gas, t0: RUN_T[i], d: RUN_D[i], slotA: SLOT[s], slotB: PG[g] };
    s += gas === 'co2' ? 2 : 1; g += gas === 'o2' ? 1 : 0;
    return ev;
  });
})();
/** The run's numbering: CO₂ 1–5, O₂ 1–2. */
const RUN_N = RUN_GAS.map((gas, i) => RUN_GAS.slice(0, i + 1).filter(x => x === gas).length);

/* ---------------------------------------------------------------- actors */

const P3 = (k: string, halos?: string, lab?: string): Actor => ({ k, g: GLYPH.carbon('CCCP', halos), lab, dy: 32 });
const ACTORS: Actor[] = [
  { k: 'rb0', g: GLYPH.carbon('PCCCCCP'), lab: '5 C', dy: 32 }, { k: 'g0', g: GLYPH.co2(), lab: '1 C', dy: -20 },
  P3('a0', 'n...', '3 C'), P3('b0', undefined, '3 C'),
  { k: 'rb1', g: GLYPH.carbon('PCCCCCP'), lab: '5 C', dy: 32 }, { k: 'g1', g: GLYPH.o2() },
  P3('a1', undefined, '3 C'), { k: 'b1', g: GLYPH.carbon('CCP', 'oo.'), lab: '2 C', dy: 32 },
  ...RUN.flatMap((ev, i) => [
    { k: `xr${i}`, g: GLYPH.carbon('PCCCCCP') }, { k: `xg${i}`, g: ev.gas === 'co2' ? GLYPH.co2() : GLYPH.o2() },
    P3(`xa${i}`, ev.gas === 'co2' ? 'n...' : undefined),
    ev.gas === 'co2' ? P3(`xb${i}`) : { k: `xb${i}`, g: GLYPH.carbon('CCP', 'oo.') },
  ]),
];

/* ---------------------------------------------------------------- the panel and the card (stage units) */

const sp = (k: string, s: string): string => `<tspan data-k="${k}" fill-opacity="0">${s}</tspan>`;
const PX = 1126, PY = 28, PW = 456;
const CHIP_W = 54, CHIP_GAP = 4;
const chips = (x: number, y: number): string => RUN_GAS.map((gas, i) => {
  const cx = x + i * (CHIP_W + CHIP_GAP);
  return `<g data-k="chip${i}" display="none"><rect class="dk-chip${gas === 'o2' ? ' dk-chip-o' : ''}" x="${cx}" y="${y + 6}" width="${CHIP_W}" height="30" rx="9"/>${T(cx + CHIP_W / 2, y + 26, `${gas === 'co2' ? 'CO₂' : 'O₂'} ${RUN_N[i]}`, 'dk-chipt')}</g>`;
}).join('');
const ROWS: Row[] = [
  { k: 'r-h', h: 34, html: 'per reaction', cls: 'dk-ph' },
  { k: 'r-c1', h: 32, html: `${sp('c1a', 'RuBP')}${sp('c1b', ' + CO₂')}${sp('c1c', ' → 2 3-PGA')}` },
  { k: 'r-c2', h: 42, html: `${sp('c2a', '5 C')}${sp('c2b', ' + 1 C')}${sp('c2c', ' = 2 × 3 C')}`, cls: 'dk-pc' },
  { k: 'r-o1', h: 32, html: `${sp('o1a', 'RuBP')}${sp('o1b', ' + O₂')}${sp('o1c', ' → 3-PGA + 2-phosphoglycolate')}` },
  { k: 'r-o2', h: 42, html: `${sp('o2a', '5 C')}${sp('o2c', ' = 3 C + 2 C')}`, cls: 'dk-pc' },
  { k: 'r-run', h: 36, html: '25 °C, ≈ 200 ppm CO₂ in the chloroplast', cls: 'dk-ph' },
  { k: 'r-chips', h: 44, html: '', extra: chips },
  { k: 'r-n', h: 32, html: 'carboxylations <tspan data-k="n-c">0</tspan> · oxygenations <tspan data-k="n-o">0</tspan>' },
  { k: 'r-p', h: 34, html: '3-PGA <tspan data-k="n-p">0</tspan> · 2-phosphoglycolate <tspan data-k="n-g">0</tspan>' },
];
function forrCard(p: string): string {
  const x = PX + 6, y = 228, w = PW - 12, h = 500, iw = 270, s = iw / 355, ix = x + (w - iw) / 2 + 6, iy = y + 80;
  const px = (o: number, a: number): V => [ix + (70 + 2.55 * o) * s, iy + (311 - 4.77 * a) * s];
  const air = px(21, 0)[0];
  return card(p, 'forr', x, y, w, h, `
    ${T(x + 26, y + 42, 'Forrester, Krotkov &amp; Nelson 1966', 'dk-ctitle', 'start')}
    ${T(x + 26, y + 68, 'soybean leaves', 'dk-cs', 'start')}
    <image class="dk-mult" href="${forrPng}" x="${ix.toFixed(1)}" y="${iy}" width="${iw}" height="${(457 * s).toFixed(1)}"/>
    <path class="dk-mark" d="M${air.toFixed(1)},${px(21, 58)[1].toFixed(1)}V${px(21, -20)[1].toFixed(1)}"/>
    ${T(air, iy + 457 * s + 26, 'air', 'dk-ct')}${T(x + w - 30, iy + 457 * s + 26, 'O₂ (%)', 'dk-cs', 'end')}
    ${T(x + 26, y + h - 14, 'Plant Physiol 41:422, Fig. 2 · © ASPB, free in PMC', 'dk-ccr', 'start')}`, -1, 41);
}

/* ---------------------------------------------------------------- the frame */

const ZR = view(1.9, add(G.rub, [-30, -22]), [580, 380]);
const K_INTRO = [{ rb: 'rb0', g: 'g0', a: 'a0', b: 'b0', fl: 'fl' }, { rb: 'rb1', g: 'g1', a: 'a1', b: 'b1', fl: 'fl' }];
/** 3-PGA into GAPDH, 2-phosphoglycolate along the glycolate arrow (beat 4's start). */
const ON_A = (from: V): (u: number) => V => path([from, add(G.gap, [-42, 36]), add(G.gap, [-6, 6])]);
const ON_B = path([PG[0], add(G.pg2, [70, -24]), add(G.pg2, [126, -58])]);

function frame(a: Api, beat: number, t: number): void {
  const T0 = beat === 0 ? t : 99;
  // the active site: ring and name, from beat 1 on
  // the active site: its ring from beat 1 on; its name before RuBP comes in (beats 1 and 2)
  a.pos('site', SITE); a.op('site', beat === 0 ? ease(t, 2.2, 2.7) : 1);
  a.op('l-site', beat === 0 ? life(t, 2.2, 2.7, 3.3, 3.7) : beat === 1 ? 1 - ease(t, 0.95, 1.35) : 0);
  // the first two reactions; their products stay in the piles until beat 4
  if (beat <= 2) {
    rubEvent(a, T0, INTRO[0], K_INTRO[0]);
    if (beat >= 1) rubEvent(a, beat === 1 ? t : 99, INTRO[1], K_INTRO[1]);
  } else {
    const go = (k: string, c: (u: number) => V, d: number): void => a.put(k, glide(c, t, 0.2 + d, 1.5 + d), 1 - ease(t, 1.2 + d, 1.7 + d), 0.7);
    go('a0', ON_A(SLOT[0]), 0); go('b0', ON_A(SLOT[1]), 0.12); go('a1', ON_A(SLOT[2]), 0.24); go('b1', ON_B, 0.1);
  }
  // panel
  const vis: Record<string, number> = {};
  const tick = (k: string, v: number): void => a.attr(k, 'fill-opacity', v.toFixed(3));
  if (beat === 0) {
    vis['r-h'] = ease(t, 2.6, 3.0); vis['r-c1'] = vis['r-h']; vis['r-c2'] = ease(t, 4.6, 4.9);
    const ev = INTRO[0], tm = ev.t0 + 0.56 * ev.d;
    tick('c1a', ease(t, ev.t0, ev.t0 + 0.3)); tick('c1b', ease(t, ev.t0 + 0.12 * ev.d, ev.t0 + 0.12 * ev.d + 0.3)); tick('c1c', ease(t, tm, tm + 0.3));
    tick('c2a', ease(t, ev.t0 + 0.42 * ev.d, ev.t0 + 0.42 * ev.d + 0.3)); tick('c2b', ease(t, ev.t0 + 0.5 * ev.d, ev.t0 + 0.5 * ev.d + 0.3)); tick('c2c', ease(t, tm + 0.3, tm + 0.6));
  } else {
    vis['r-h'] = vis['r-c1'] = vis['r-c2'] = 1;
    for (const k of ['c1a', 'c1b', 'c1c', 'c2a', 'c2b', 'c2c']) tick(k, 1);
    const ev = INTRO[1], tt = beat === 1 ? t : 99, tm = ev.t0 + 0.56 * ev.d;
    vis['r-o1'] = ease(tt, 0.7, 1.0); vis['r-o2'] = ease(tt, ev.t0 + 0.42 * ev.d, ev.t0 + 0.42 * ev.d + 0.3);
    tick('o1a', ease(tt, ev.t0, ev.t0 + 0.3)); tick('o1b', ease(tt, ev.t0 + 0.12 * ev.d, ev.t0 + 0.12 * ev.d + 0.3)); tick('o1c', ease(tt, tm, tm + 0.3));
    tick('o2a', ease(tt, ev.t0 + 0.42 * ev.d, ev.t0 + 0.42 * ev.d + 0.3)); tick('o2c', ease(tt, tm + 0.3, tm + 0.6));
  }
  // the card (beat 3)
  a.op('forr', beat === 2 ? ease(t, 0.2, 0.8) : beat === 3 ? 1 - ease(t, 0, 0.5) : 0);
  // the run (beat 4)
  if (beat === 3) {
    for (const k of ['r-run', 'r-chips', 'r-n', 'r-p']) vis[k] = ease(t, 0.7, 1.1);
    let nc = 0, no = 0;
    RUN.forEach((ev, i) => {
      const { tm } = rubEvent(a, t, ev, { rb: `xr${i}`, g: `xg${i}`, a: `xa${i}`, b: `xb${i}`, fl: 'fl' });
      a.op(`chip${i}`, ease(t, tm, tm + 0.25));
      if (t >= tm) { if (ev.gas === 'co2') nc++; else no++; }
    });
    a.txt('n-c', String(nc)); a.txt('n-o', String(no)); a.txt('n-p', String(2 * nc + no)); a.txt('n-g', String(no));
  }
  panelShow(a, 'panel', ROWS, vis);
}

export const STAGING = makeStaging({
  id: 's',
  name: 's · In the strip',
  note: 'RuBisCO in the dark-reaction strip: RuBP and CO₂, then RuBP and O₂, meet at the same active site, counted per reaction in carbon form; Forrester 1966 as a card; a numbered run of 5 carboxylations and 2 oxygenations',
  beats: BEATS,
  dropGlyph: ['pga', 'pg2', 'oxy'],
  actors: ACTORS,
  leads: [{ k: 'l-site', at: SITE, o: [9, -8], d: [120, -52], text: 'active site' }],
  world: () => siteRing('site', ''),
  hud: p => `${panelSvg('panel', PX, PY, PW, ROWS)}${forrCard(p)}`,
  cam0: ZR, cams: [ZR, ZR, ZR, ZR], camT: [[0, 1], [0, 1], [0, 1], [0, 1]],
  lit: [['rubisco', 'co2', 'carbox', 'pga'], ...Array.from({ length: 3 }, () => ['rubisco', 'co2', 'carbox', 'pga', 'o2', 'oxy', 'pg2'] as const).map(x => [...x])],
  frame,
});
