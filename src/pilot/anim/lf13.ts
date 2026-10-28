// 'lf13', staging m · CAM in one mesophyll cell (slide C13; beats-lf.ts LF13). One fixed framing of the stoma and the
// mesophyll cell; the night tint, the guard cells and the starch granule change with the time of day; the ledger and
// the clock on the right. Per CO₂, numbered:
// - Beat 1 (night): the stoma opens; CO₂ 1 enters → CA (water joins) → HCO₃⁻ 1 → PEPC with PEP 1 from starch → C₄ acid
//   → malic acid 1 into the vacuole; 1 H₂O leaves through the stoma (drawn small).
// - Beat 2: CO₂ 2 and 3 follow, malic acid 2 and 3 stack up; the starch granule shrinks.
// - Beat 3 (day): the stoma closes; malic acid 3 leaves the vacuole → malic enzyme → CO₂ → RuBisCO; pyruvate → starch.
// - Beat 4: malic acid 2 and 1 follow; the vacuole is empty; the starch granule is full again.
// - Beat 5: water-use efficiency of C₃, C₄ and CAM (Borland et al. 2009, Table 2) on a card.
import { ACID_AT, C4, CAM, guardCells, h2oG, hco3G, H2O_PATH, LH, LW, PORE, SPOT, starchG, type LPart } from '../figs/leaf-schema';
import { hring } from '../figs/chain';
import { GLYPH } from './dk1-common';
import { LF13 } from './beats-lf';
import { add, ease, flash, glide, lerp, makeLeafStaging, panelShow, panelSvg, T, type Actor, type Api, type Row, type V } from './lf-common';
import { keyLines } from './stage-keys';
import type { Staging } from './types';

const S = SPOT;
const cap = (w: number, r = 13): string => `<rect class="dk-cap" x="${-w / 2 - 5}" y="${-r - 5}" width="${w + 10}" height="${2 * r + 10}" rx="${r + 5}"/>`;
const N3 = [1, 2, 3];
const ACTORS: Actor[] = [
  ...N3.map(i => ({ k: `co2${i}`, g: GLYPH.co2(), lab: `CO₂ ${i}`, dy: -22 })),
  ...N3.map(i => ({ k: `hco${i}`, g: `<circle class="dk-cap" r="30"/>${hco3G(0, 0)}`, lab: `HCO₃⁻ ${i}`, dy: 48 })),
  ...N3.map(i => ({ k: `pep${i}`, g: GLYPH.carbon('CCCP'), lab: `PEP ${i}`, dy: 34 })),
  ...N3.map(i => ({ k: `mal${i}`, g: GLYPH.carbon('CCCC'), lab: `${i}`, dx: 56, dy: 6, an: 'start' as const })),
  ...N3.map(i => ({ k: `dco${i}`, g: GLYPH.co2(), lab: 'CO₂', dy: 32 })),
  ...N3.map(i => ({ k: `pyr${i}`, g: GLYPH.carbon('CCC'), lab: 'pyruvate', dy: 34 })),
  { k: 'h2o', g: `${cap(36)}${h2oG(0, -2)}`, lab: 'H₂O 1', dy: 34 },
  { k: 'h2oL', g: `<g transform="scale(.7)">${h2oG(0, -2)}</g>`, lab: '', dy: 26 },
  { k: 'hp', g: `<g class="chn-g">${hring(0, 0, 12)}</g>` },
  { k: 'starchA', g: starchG(0, 0, 1), lab: 'starch', dy: 6 },
];

/* ---------------------------------------------------------------- ways (panorama units) */
const CO2_IN: V[] = [[24, 340], [70, 340], [PORE[0], 340], ...C4.co2In.slice(0, -1), add(S.ca, [-30, -4])];
const CO2_FAST: V[] = [[PORE[0], 340], ...C4.co2In.slice(0, -1), add(S.ca, [-30, -4])];
const H2O_IN: V[] = [[420, 196], [432, 150], add(S.ca, [-6, 22])];
const HCO3: V[] = [add(S.ca, [26, -10]), S.hco3, add(S.pepc, [8, -30])];
const PEP_IN: V[] = [...CAM.pepFromStarch.slice(0, -1), add(S.pepc, [-26, 8])];
const ACID_IN = (i: number): V[] => [add(S.pepc, [20, 30]), ...CAM.acidIn.slice(1, -1), ACID_AT(i)];
const ACID_OUT = (i: number): V[] => [ACID_AT(i), add(ACID_AT(i), [30, -40]), add(S.camMe, [18, 30])];
const ME_CO2: V[] = [add(S.camMe, [-34, -8]), ...CAM.meCo2.slice(1, -1), add(S.mRub, [24, 0])];
const PYR: V[] = [add(S.camMe, [-24, 26]), ...CAM.pyrToStarch.slice(1, -1), add(S.starch, [20, 0])];
const WATER_OUT: V[] = [...H2O_PATH.slice(0, 5), [20, 396]];

/* ---------------------------------------------------------------- the ledger, the clock, the card (stage units) */
const PX = 742, PY = 22, PW = 830;
const n = (k: string): string => `<tspan data-k="${k}">0</tspan>`;
const ROWS: Row[] = [
  { k: 'r0', h: 36, html: 'per CO₂', cls: 'dk-ph' },
  { k: 'r1', h: 38, html: '<tspan class="lfa-e">night · PEPC:</tspan> HCO₃⁻ + PEP → C₄ acid → malic acid in the vacuole' },
  { k: 'r3', h: 44, html: `malic acid in the vacuole: ${n('n-mal')}`, cls: 'lfa-sum' },
  { k: 'r2', h: 38, html: '<tspan class="lfa-e">day · malic enzyme:</tspan> malic acid → CO₂ + pyruvate; CO₂ → RuBisCO' },
];
const clock = (): string => `<g data-k="clk" display="none"><rect class="lfa-card" x="${PX}" y="250" width="380" height="96" rx="14"/>
  <g data-k="moon"><path class="lf-moon" d="M${PX + 44},${268}A20,20 0 1 0 ${PX + 52},${304}A15,15 0 1 1 ${PX + 44},${268}Z"/></g>
  <g data-k="sun" class="lf-sun"><circle cx="${PX + 46}" cy="298" r="14"/>${Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `<path d="M${(PX + 46 + 20 * Math.cos(a)).toFixed(1)},${(298 + 20 * Math.sin(a)).toFixed(1)}L${(PX + 46 + 27 * Math.cos(a)).toFixed(1)},${(298 + 27 * Math.sin(a)).toFixed(1)}"/>`; }).join('')}</g>
  <text data-k="clk-t" class="lfa-h" x="${PX + 92}" y="292">night</text><text data-k="clk-s" class="lfa-sub" x="${PX + 92}" y="322">stomata open</text></g>`;
/** Water-use efficiency, mmol CO₂ per mol H₂O over 24 h (Borland et al. 2009, Table 2): ranges as bars on 0–10. */
const WUE: Array<[string, number, number, string]> = [['C₃', 0.5, 1.5, '0.5–1.5'], ['C₄', 1, 2, '1–2'], ['CAM', 4, 10, '4–10']];
const card = (): string => {
  const x0 = PX + 110, x1 = PX + 760, sx = (v: number): number => x0 + ((x1 - x0) * v) / 10, y0 = 424;
  return `<g data-k="card" display="none"><rect class="lfa-card" x="${PX}" y="362" width="${PW}" height="334" rx="16"/>
    ${T(PX + 24, 400, 'CO₂ fixed per water lost', 'lfa-h', 'start')}${T(PX + 24, 426, 'mmol CO₂ per mol H₂O, over 24 h', 'lfa-sub', 'start')}
    ${WUE.map(([k, a, b, s], i) => { const y = y0 + 40 + i * 56; return `${T(PX + 24, y + 8, k, 'lfa-sum', 'start')}<rect class="lfa-bar${k === 'CAM' ? ' lfa-bar-on' : ''}" x="${sx(a).toFixed(1)}" y="${y - 14}" width="${(sx(b) - sx(a)).toFixed(1)}" height="28" rx="6"/>${T(sx(b) + 10, y + 8, s, 'dk-pc', 'start')}`; }).join('')}
    <path class="lfa-axis" d="M${x0},${y0 + 196}H${x1}"/>${[0, 2, 4, 6, 8, 10].map(v => `<path class="lfa-axis" d="M${sx(v)},${y0 + 196}v6"/>${T(sx(v), y0 + 222, String(v), 'lfa-tick')}`).join('')}
    ${T(x1, 684, 'Borland et al. 2009, Table 2', 'dk-ccr', 'end')}</g>`;
};

/* ---------------------------------------------------------------- the frame */
/** Night uptake of CO₂ i over [t0, t0 + d]: full steps for i = 1, a quicker run for 2 and 3. */
function night(a: Api, t: number, i: number, t0: number, slow: boolean): void {
  const k = (s: number): number => t0 + s * (slow ? 1 : 0.62);
  const ca = k(slow ? 4.0 : 2.0), pc = k(slow ? 5.6 : 3.2), va = k(slow ? 7.4 : 4.4);
  if (t < t0) return;
  if (t < ca + 0.3) a.put(`co2${i}`, glide(slow ? CO2_IN : CO2_FAST, t, t0 + (slow ? 0.6 : 0), ca), ease(t, t0, t0 + 0.4) * (1 - ease(t, ca, ca + 0.2)));
  if (slow && t > ca - 1.1 && t < ca + 0.3) a.put('h2o', glide(H2O_IN, t, ca - 1.1, ca), ease(t, ca - 1.1, ca - 0.8) * (1 - ease(t, ca, ca + 0.2)));
  flash(a, t, ca, S.ca);
  if (slow && t > ca && t < ca + 1.3) a.put('hp', glide([add(S.ca, [20, 20]), [500, 140], [520, 136]], t, ca + 0.05, ca + 1.1), ease(t, ca, ca + 0.2) * (1 - ease(t, ca + 0.9, ca + 1.3)));
  if (t > ca && t < pc + 0.3) a.put(`hco${i}`, glide(HCO3, t, ca + 0.05, pc - 0.1), ease(t, ca, ca + 0.2) * (1 - ease(t, pc, pc + 0.2)));
  a.op(`hco${i}-l`, slow ? 1 : 0);
  if (t > t0 && t < pc + 0.3) a.put(`pep${i}`, glide(PEP_IN, t, t0 + (slow ? 2.4 : 0.6), pc - 0.1), ease(t, t0 + (slow ? 2.3 : 0.5), t0 + (slow ? 2.6 : 0.8)) * (1 - ease(t, pc, pc + 0.2)));
  a.op(`pep${i}-l`, slow ? 1 : 0);
  flash(a, t, pc, S.pepc, 'fl2');
  if (t > pc) a.put(`mal${i}`, glide(ACID_IN(i - 1), t, pc + 0.05, va), ease(t, pc, pc + 0.2));
  a.op(`mal${i}-l`, ease(t, va - 0.2, va + 0.2));
}
/** Day release of malic acid i over [t0, …]. */
function day(a: Api, t: number, i: number, t0: number, slow: boolean): void {
  const k = (s: number): number => t0 + s * (slow ? 1 : 0.62);
  const me = k(1.8), ru = k(3.4), st = k(3.6);
  if (t < t0) { a.put(`mal${i}`, ACID_AT(i - 1), 1); return; }
  if (t < me + 0.3) a.put(`mal${i}`, glide(ACID_OUT(i - 1), t, t0, me), 1 - ease(t, me, me + 0.2));
  a.op(`mal${i}-l`, 1 - ease(t, t0, t0 + 0.3));
  flash(a, t, me, S.camMe);
  if (t > me && t < ru + 0.3) a.put(`dco${i}`, glide(ME_CO2, t, me + 0.05, ru), ease(t, me, me + 0.2) * (1 - ease(t, ru, ru + 0.2)));
  a.op(`dco${i}-l`, slow ? ease(t, me + 0.4, me + 0.7) : 0);
  flash(a, t, ru + 0.1, S.mRub, 'fl2');
  if (t > me && t < st + 0.3) a.put(`pyr${i}`, glide(PYR, t, me + 0.05, st), ease(t, me, me + 0.2) * (1 - ease(t, st, st + 0.2)));
  a.op(`pyr${i}-l`, slow ? ease(t, me + 0.5, me + 0.8) : 0);
}
function frame(a: Api, beat: number, t: number): void {
  // time of day: the night tint, the stoma's pore, the clock
  const nightU = beat === 0 ? ease(t, 0, 1.2) : beat === 1 ? 1 : beat === 2 ? 1 - ease(t, 0, 1.2) : 0;
  a.op('night', 0.13 * nightU);
  const gap = Math.round(2 * (beat === 0 ? lerp(0, 12, ease(t, 0.3, 1.4)) : beat === 1 ? 12 : beat === 2 ? lerp(12, 0, ease(t, 0.3, 1.4)) : 0)) / 2;
  a.html('guard', guardCells(PORE, gap, true));
  // the day card leaves before the closing question, which takes its place at the centre
  a.op('clk', beat === 4 ? 1 - ease(t, 2.4, 2.8) : 1); a.op('moon', nightU); a.op('sun', 1 - nightU);
  a.txt('clk-t', nightU > 0.5 ? 'night' : 'day'); a.txt('clk-s', nightU > 0.5 ? 'stomata open' : 'stomata closed');
  // the starch granule: full at dusk, smaller after the night, full again by the end of the day
  const st = beat === 0 ? lerp(1, 0.75, ease(t, 2.4, 5.0)) : beat === 1 ? lerp(0.75, 0.35, ease(t, 0.2, 4.0)) : beat === 2 ? lerp(0.35, 0.6, ease(t, 3.4, 4.2)) : beat === 3 ? lerp(0.6, 1, ease(t, 1.4, 4.0)) : 1;
  a.put('starchA', S.starch, 1, 0.45 + 0.55 * st);
  // night: CO₂ 1 in full steps, 2 and 3 quicker; 1 small water molecule leaves through the open stoma
  if (beat === 0) {
    night(a, t, 1, 0.8, true);
    if (t > 3.0 && t < 7.4) a.put('h2oL', glide(WATER_OUT, t, 3.0, 7.0), ease(t, 3.0, 3.3) * (1 - ease(t, 6.6, 7.2)));
  }
  if (beat === 1) { a.put('mal1', ACID_AT(0), 1); night(a, t, 2, 0.2, false); night(a, t, 3, 1.4, false); }
  if (beat === 2) { a.put('mal1', ACID_AT(0), 1); a.put('mal2', ACID_AT(1), 1); day(a, t, 3, 1.6, true); }
  if (beat === 3) { day(a, t, 2, 0.2, false); day(a, t, 1, 1.5, false); }
  // the ledger
  const vis = (b: number, t0: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t0 + 0.4) : 0);
  panelShow(a, 'panel', ROWS, { r0: vis(0, 0.2), r1: vis(0, 6.4), r2: vis(2, 3.6), r3: vis(0, 8.2) });
  const nm = beat === 0 ? Number(t > 8.2) : beat === 1 ? 1 + Number(t > 0.2 + 4.4 * 0.62 + 0.2) + Number(t > 1.4 + 4.4 * 0.62 + 0.2) : beat === 2 ? 3 - Number(t > 1.6 + 0.3) : beat === 3 ? 2 - Number(t > 0.5) - Number(t > 1.8) : 0;
  a.txt('n-mal', String(nm));
  a.op('malL', nm > 0 && beat < 4 ? 1 : 0);
  a.op('card', beat === 4 ? ease(t, 0.2, 0.9) : 0);
}

const NIGHT: LPart[] = ['stoma', 'cam-n', 'ca', 'pepc', 'pep-starch', 'vac', 'm-cp'];
const DAY: LPart[] = ['stoma', 'vac', 'cam-d', 'cam-me', 'm-cp', 'm-rub'];

const BASE = makeLeafStaging({
  id: 'lf13m',
  name: 'm · One cell, night and day',
  note: 'CAM in one mesophyll cell, one fixed framing: by night the stoma opens, CO₂ 1–3 → HCO₃⁻ → PEPC → malic acid 1–3 into the vacuole; by day the stoma closes and malic acid 3, 2, 1 → malic enzyme → CO₂ → RuBisCO; water-use efficiency card',
  beats: LF13,
  leaf: { noGuard: true, acid: 2, hide: ['m-perox', 'm-mito', 'ppdk', 'me', 'bs-rub', 'bs-mito', 'starch'] },
  actors: ACTORS,
  world: () => `<g data-k="malL" display="none">${T(ACID_AT(2)[0], ACID_AT(2)[1] - 24, 'malic acid', 'cel-mn cel-halo')}</g><g data-k="guard"></g><g data-k="night" display="none"><rect class="lfa-night" x="-20" y="-20" width="${LW + 40}" height="${LH + 40}"/></g>`,
  hud: () => `${panelSvg('panel', PX, PY, PW, ROWS)}${clock()}${card()}`,
  cam: { s: 1.16, c: [0, 20], at: [10, 6] },
  clip: [0, 0, 712, 740],
  lit: [NIGHT, NIGHT, DAY, DAY, DAY],
  frame,
});

/** The key lines on the stage (lecturer, 29 Oct 2026): each beat's take-home and the closing question. */
export const STAGING: Staging = { ...BASE, keys: [
  ...keyLines(0, ['Night: CO₂ stored as malic acid'], 1160, 540, { size: 40 }),
  ...keyLines(1, ['Less water lost at night'], 1160, 540, { size: 40 }),
  ...keyLines(2, ['Day: fixed behind closed stomata'], 1160, 540, { size: 40 }),
  ...keyLines(3, ['CO₂ taken up the night before'], 1160, 540, { size: 40 }),
  // beat 5: the take-home right of the clock, after the card; the question then takes the free band between the ledger
  // and the card, centred, once the clock has gone: its 2 lines (x 494–1106) start right of the chloroplast and fit
  // between the dimmed PEPC and the "malic enzyme" label, hence the line height of 43
  ...keyLines(4, ['CAM: most CO₂', 'per water lost'], 1347, 280, { size: 40, t0: 1.0 }),
  { beat: 4, text: 'How much of the sunlight do C₃', x: 800, y: 269, size: 40, t0: 4.0 },
  { beat: 4, text: 'and C₄ plants store in biomass?', x: 800, y: 312, size: 40, t0: 4.0 },
] };
