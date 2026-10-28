// history, staging s · "RuBisCO through Earth's history" (slide C5a; lecturer, 28 Oct 2026), in the dark-reaction strip
// (dk1-common.ts): RuBisCO and RuBP in the centre, a timeline along the bottom, the air's CO₂ and O₂ and the
// oxygenations per 100 carboxylations in a panel on the right. Each binding at active site 1 is drawn in full (RuBP and
// the gas glide in, the products leave along the strip's arrows): carboxylations flash amber, oxygenations red.
// - Beat 1 · 3 billion years ago: only CO₂ arrives; 3 carboxylations.
// - Beat 2 · Great Oxidation Event: O₂ and the oxygenation arrow light; 3 carboxylations and 1 oxygenation.
// - Beat 3 · Ice ages: the ice-core curve; ≈ 190 ppm; 3 carboxylations and 3 oxygenations (96 per 100, calculated).
// - Beat 4 · Industry and warming: the CO₂ curve from 1750 to 2025 draws, 278 → 427 ppm, 66 → 43 per 100 (5
//   carboxylations, 2 oxygenations); a thermometer rises 25 → 35 °C, 43 → 70 per 100 (3 carboxylations, 2 oxygenations).
// - Beat 5 · A better RuBisCO?: 3 cards, 1 short line each.
// Numbers and sources: beats-history.ts. The calculated values use figs/rb-kit.ts (gammaStar, oxyPer100) with
// C꜀ = 200/427 × air CO₂ at 25 °C (as slide C5a v7) and C꜀ = 200 ppm at 35 °C (as C5b).
import './dk-history.css';
import { HISTORY } from './beats-history';
import { CO2_ANNUAL, CO2_FROM } from './cr14-data';
import { ICE, oxyPer100 } from '../figs/rb-kit';
import {
  add, card, ease, G, GLYPH, life, makeStaging, panelShow, panelSvg, rubEvent, SITE, siteRing, T, view,
  type Actor, type Api, type Row, type RubEv, type V,
} from './dk1-common';

const f = (v: number): string => v.toFixed(1);

/* ---------------------------------------------------------------- the reactions, per beat */

type Gas = 'co2' | 'o2';
interface Run { gas: Gas; t0: number; d: number }
const seq = (pattern: string, t0: number, step: number, d: number): Run[] =>
  [...pattern].map((c, i) => ({ gas: c === 'O' ? 'o2' : 'co2', t0: t0 + i * step, d }));
/** Beat by beat: C = carboxylation, O = oxygenation. */
const RUNS: Run[][] = [
  seq('CCC', 2.0, 1.3, 2.2),
  seq('CCOC', 1.0, 1.3, 2.2),
  seq('COCOCO', 1.4, 1.0, 2.0),
  [...seq('CCOCCCO', 1.0, 0.8, 1.8), ...seq('COCOC', 9.8, 0.8, 1.8)],
  [],
];
const ev = (r: Run): RubEv => ({ gas: r.gas, t0: r.t0, d: r.d, slotA: G.pga, slotB: r.gas === 'co2' ? add(G.pga, [30, -20]) : G.pg2, fade: true });
const keys = (b: number, i: number, gas: Gas): { rb: string; g: string; a: string; b: string; fl: string } =>
  ({ rb: `r${b}_${i}`, g: `g${b}_${i}`, a: `a${b}_${i}`, b: `b${b}_${i}`, fl: gas === 'o2' ? 'flo' : 'fl' });

const P3 = (k: string, halos?: string): Actor => ({ k, g: GLYPH.carbon('CCCP', halos) });
const ACTORS: Actor[] = [
  { k: 'flo', g: '<circle r="34" fill="url(#dk1h-flo)"/>' },
  ...RUNS.flatMap((runs, b) => runs.flatMap((r, i) => {
    const k = keys(b, i, r.gas);
    return [
      { k: k.rb, g: GLYPH.carbon('PCCCCCP') }, { k: k.g, g: r.gas === 'co2' ? GLYPH.co2() : GLYPH.o2() },
      P3(k.a, r.gas === 'co2' ? 'n...' : undefined),
      r.gas === 'co2' ? P3(k.b) : { k: k.b, g: GLYPH.carbon('CCP', 'oo.') },
    ];
  })),
];

/* ---------------------------------------------------------------- the panel (stage units) */

const PX = 1120, PY = 28, PW = 456;
const ROWS: Row[] = [
  { k: 'r-co2', h: 34, html: 'CO₂ in the air: <tspan data-k="co2v">≥ 100 × today</tspan>' },
  { k: 'r-o2', h: 34, html: 'O₂ in the air: <tspan data-k="o2v">≤ 0.1 % of today</tspan>' },
  { k: 'r-ox', h: 40, html: 'oxygenations per 100 carboxylations: <tspan data-k="oxv" class="dk-pr-r">96</tspan>', cls: 'dk-pr' },
  { k: 'r-calc', h: 30, html: 'calculated · leaf at <tspan data-k="tv">25</tspan> °C', cls: 'dk-ph' },
];

/* ---------------------------------------------------------------- the CO₂ charts (stage units) */

const CX = PX, CY = 210, CW = PW, CH = 300;
const BX = CX + 64, BY = CY + 56, BW = CW - 96, BH = CH - 120;
const yOf = (ppm: number, lo: number, hi: number): number => BY + BH - ((ppm - lo) / (hi - lo)) * BH;
function iceChart(): string {
  const X = (age: number): number => BX + ((800000 - age) / 800000) * BW, Y = (v: number): number => yOf(v, 150, 450);
  const d = `M${ICE.slice().reverse().map(([a, v]) => `${f(X(a))},${f(Y(v))}`).join(' L')}`;
  const ticks = [800, 400, 0].map(k => `${T(X(k * 1000), BY + BH + 24, String(k), 'hs-tk')}`).join('');
  const yt = [200, 300, 400].map(v => `<path class="hs-grid" d="M${BX},${f(Y(v))}H${BX + BW}"/>${T(BX - 10, Y(v) + 6, String(v), 'hs-tk', 'end')}`).join('');
  return `<g data-k="ice" display="none"><rect class="dk-panel" x="${CX}" y="${CY}" width="${CW}" height="${CH}" rx="14"/>
    ${T(CX + 18, CY + 34, 'CO₂ in the air (ppm), ice cores', 'hs-h', 'start')}${yt}
    <path class="hs-ice" d="${d}"/>${ticks}${T(BX + BW / 2, BY + BH + 52, 'thousand years ago', 'hs-ax')}
    <circle class="hs-dot" cx="${f(X(20000))}" cy="${f(Y(190))}" r="6"/>${T(X(20000) - 8, Y(190) + 28, '≈ 190', 'hs-lab', 'end')}</g>`;
}
/** 1750 → 2025: ice-core points (1750: 278.3, 1850: 285.5 ppm; IPCC AR6), then the Mauna Loa yearly means (NOAA GML). */
const ML: Array<[number, number]> = [[1750, 278.3], [1850, 285.5], ...CO2_ANNUAL.map((v, i): [number, number] => [CO2_FROM + i + 0.5, v])];
function mlChart(p: string): string {
  const X = (yr: number): number => BX + ((yr - 1750) / 280) * BW, Y = (v: number): number => yOf(v, 250, 450);
  const d = `M${ML.map(([yr, v]) => `${f(X(yr))},${f(Y(v))}`).join(' L')}`;
  const ticks = [1750, 1850, 1950].map(y => T(X(y), BY + BH + 24, String(y), 'hs-tk')).join('') + T(X(2025), BY + BH + 24, '2025', 'hs-tk');
  const yt = [300, 350, 400, 450].map(v => `<path class="hs-grid" d="M${BX},${f(Y(v))}H${BX + BW}"/>${T(BX - 10, Y(v) + 6, String(v), 'hs-tk', 'end')}`).join('');
  return `<g data-k="ml" display="none"><rect class="dk-panel" x="${CX}" y="${CY}" width="${CW}" height="${CH}" rx="14"/>
    ${T(CX + 18, CY + 34, 'CO₂ in the air (ppm)', 'hs-h', 'start')}${yt}
    <clipPath id="${p}-mlc"><rect data-k="mlclip" x="${BX - 8}" y="${BY - 20}" width="0" height="${BH + 40}"/></clipPath>
    <path class="hs-ml" d="${d}" clip-path="url(#${p}-mlc)"/>${ticks}${T(BX + BW / 2, BY + BH + 52, 'year', 'hs-ax')}</g>`;
}

/* ---------------------------------------------------------------- the thermometer, the timeline, the cards */

const TH = { x: 1040, top: 300, bot: 470 };
const thermo = (): string => `<g data-k="thermo" display="none">
  <rect class="dk-thermo" x="${TH.x - 13}" y="${TH.top - 10}" width="26" height="${TH.bot - TH.top + 20}" rx="13"/>
  <circle class="dk-thermo" cx="${TH.x}" cy="${TH.bot + 22}" r="24"/><circle class="dk-thermo-f" cx="${TH.x}" cy="${TH.bot + 22}" r="17"/>
  <rect data-k="merc" class="dk-thermo-f" x="${TH.x - 6}" y="${TH.bot}" width="12" height="20" rx="6"/>
  <text data-k="thv" class="dk-yr" x="${TH.x}" y="${TH.top - 26}" text-anchor="middle">25 °C</text></g>`;

const STOPS: Array<[number, string, string]> = [
  [200, '≈ 3 billion years ago', ''], [520, 'Great Oxidation Event', '≈ 2.4 billion years ago'],
  [850, 'ice ages', 'last 800,000 years'], [1170, '1750 → 2025', ''], [1450, 'today', ''],
];
const TL_Y = 678;
const timeline = (): string => `<g data-k="tl"><rect class="hs-band" x="96" y="${TL_Y - 46}" width="1420" height="96" rx="16"/><path class="hs-tl" d="M140,${TL_Y} H1480"/>
  ${STOPS.map(([x, a, b], i) => `<circle class="hs-stop" cx="${x}" cy="${TL_Y}" r="7"/><g data-k="tl${i}" display="none">${T(x, TL_Y - 18, a, 'hs-tl1')}${b ? T(x, TL_Y + 32, b, 'hs-tl2') : ''}</g>`).join('')}
  <g data-k="tlm"><circle class="hs-mark" r="12"/></g></g>`;

const CARDS: Array<[string, string, string, string]> = [
  ['Red-algal RuBisCO', 'more CO₂-specific, but slower;', 'made in tobacco, but not assembled', 'Whitney et al. 2001 · Flamholz et al. 2019'],
  ['Cyanobacterial RuBisCO', 'fast in tobacco,', 'but the plants need high CO₂', 'Lin et al. 2014 · Occhialini et al. 2016'],
  ['Directed evolution', 'small improvements so far', '', 'McDonald et al. 2026 · Lin et al. 2022'],
];
const cards = (p: string): string => CARDS.map(([h, l1, l2, cr], i) => {
  const x = PX - 10, y = 40 + i * 196, w = PW + 10, hh = 170;
  return card(p, `card${i}`, x, y, w, hh, `${T(x + 26, y + 46, h, 'dk-ctitle', 'start')}${T(x + 26, y + 84, l1, 'dk-ct', 'start')}${l2 ? T(x + 26, y + 112, l2, 'dk-ct', 'start') : ''}${T(x + 26, y + hh - 16, cr, 'dk-ccr', 'start')}`, i === 1 ? 1 : -1, 31 + i * 7);
}).join('');

/* ---------------------------------------------------------------- the frame */

const ZH = view(1.85, [350, 400], [610, 320]);
const STOP_AT = (b: number): V => [STOPS[b][0], TL_Y];

function frame(a: Api, beat: number, t: number): void {
  // the active site, named in beat 1
  a.pos('site', SITE); a.op('site', beat === 0 ? ease(t, 1.6, 2.0) : 1);
  a.op('l-site', beat === 0 ? life(t, 1.6, 2.0, 2.9, 3.3) : 0);
  // the reactions of this beat; earlier beats' products have faded into the strip's 3-PGA and 2-phosphoglycolate
  RUNS[beat].forEach((r, i) => rubEvent(a, t, ev(r), keys(beat, i, r.gas)));
  // timeline: stops reached so far, the marker glides to this beat's stop
  for (let i = 0; i < STOPS.length; i++) a.op(`tl${i}`, i < beat ? 0.45 : i === beat ? ease(t, 0.3, 0.9) : 0);
  const m0 = STOP_AT(Math.max(0, beat - 1)), m1 = STOP_AT(beat), u = beat === 0 ? 1 : ease(t, 0, 1.2);
  a.attr('tlm', 'transform', `translate(${f(m0[0] + (m1[0] - m0[0]) * u)} ${TL_Y})`);
  // panel
  const vis: Record<string, number> = {};
  const fadeOut = beat === 4 ? 1 - ease(t, 0, 0.5) : 1;
  vis['r-co2'] = vis['r-o2'] = (beat === 0 ? ease(t, 0.4, 0.9) : 1) * fadeOut;
  vis['r-ox'] = vis['r-calc'] = (beat === 2 ? ease(t, 1.0, 1.5) : beat >= 3 ? 1 : 0) * fadeOut;
  panelShow(a, 'panel', ROWS, vis);
  const ox25 = (ppm: number): string => String(Math.round(oxyPer100(25, (200 / 427) * ppm)));
  if (beat === 0) { a.txt('co2v', '≥ 100 × today'); a.txt('o2v', '≤ 0.1 % of today'); }
  if (beat === 1) { a.txt('co2v', 'falling'); a.txt('o2v', 'rising'); }
  if (beat === 2) { a.txt('co2v', '≈ 190 ppm'); a.txt('o2v', '21 %'); a.txt('oxv', ox25(190)); a.txt('tv', '25'); }
  // beat 4: the CO₂ curve draws (0.8–6.6 s); then the thermometer rises (8.2–9.6 s)
  const draw = beat === 3 ? ease(t, 0.8, 6.6) : beat > 3 ? 1 : 0;
  const warm = beat === 3 ? ease(t, 8.2, 9.6) : beat > 3 ? 1 : 0;
  if (beat === 3) {
    a.txt('co2v', draw < 1 ? '278 ppm (1750)' : '427 ppm (2025)'); a.txt('o2v', '21 %');
    a.txt('oxv', warm > 0.5 ? String(Math.round(oxyPer100(35, 200))) : draw < 1 ? ox25(278) : ox25(427));
    a.txt('tv', warm > 0.5 ? '35' : '25');
  }
  a.op('ice', beat === 2 ? ease(t, 0.4, 1.0) : beat === 3 ? 1 - ease(t, 0, 0.6) : 0);
  a.op('ml', beat === 3 ? ease(t, 0.3, 0.8) : beat === 4 ? 1 - ease(t, 0, 0.5) : 0);
  a.attr('mlclip', 'width', f((BW + 16) * draw));
  // the thermometer
  a.op('thermo', beat === 3 ? ease(t, 7.6, 8.1) : beat === 4 ? 1 - ease(t, 0, 0.5) : 0);
  const c = 25 + 10 * warm, h = (TH.bot - TH.top) * ((c - 15) / 25);
  a.attr('merc', 'y', f(TH.bot - h)); a.attr('merc', 'height', f(h + 20));
  a.txt('thv', `${Math.round(c)} °C`);
  // beat 5: the cards
  for (let i = 0; i < CARDS.length; i++) a.op(`card${i}`, beat === 4 ? ease(t, 0.6 + i * 1.0, 1.1 + i * 1.0) : 0);
}

export const STAGING = makeStaging({
  id: 'h',
  name: 's · In the strip',
  note: 'RuBisCO and RuBP in the dark-reaction strip; a timeline along the bottom from 3 billion years ago to today; carboxylations (amber) and oxygenations (red) as the air’s CO₂ and O₂ change, with ice-core and Mauna Loa CO₂ and a thermometer; 3 cards on engineering RuBisCO',
  beats: HISTORY,
  actors: ACTORS,
  leads: [{ k: 'l-site', at: SITE, o: [9, -8], d: [120, -52], text: 'active site' }],
  world: p => `<defs><radialGradient id="${p}-flo"><stop offset="0" stop-color="#fde0d6"/><stop offset=".45" stop-color="#d9583a" stop-opacity=".85"/><stop offset="1" stop-color="#b8301b" stop-opacity="0"/></radialGradient></defs>${siteRing('site', '')}`,
  hud: p => `${panelSvg('panel', PX, PY, PW, ROWS)}${iceChart()}${mlChart(p)}${thermo()}${timeline()}${cards(p)}`,
  // one fixed framing for the whole animation (lecturer's camera rule, 28 Oct 2026): no zoom, no move
  cam0: ZH, cams: [ZH, ZH, ZH, ZH, ZH], camT: [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1]],
  lit: [['rubisco', 'co2', 'carbox', 'pga'], ...Array.from({ length: 4 }, () => ['rubisco', 'co2', 'carbox', 'pga', 'o2', 'oxy', 'pg2'] as const).map(x => [...x])],
  frame,
});
