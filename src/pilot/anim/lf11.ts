// 'lf11', staging m · C₃ and the refixation of photorespired CO₂ (slide C11; beats-lf.ts LF11). One fixed framing of the
// stoma and the mesophyll cell; the ledger and a thermometer on the right.
// - Beat 1: CO₂ 1 through the stoma to mesophyll RuBisCO → 2 3-PGA (into the chloroplast).
// - Beat 2: O₂ 1 and 2 → glycolate 1–2 → peroxisome → glycine 1–2 → mitochondrion → CO₂ 1 (photorespired) and serine.
// - Beat 3: 4 photorespired CO₂ leave the mitochondrion: 1 is refixed by the chloroplast in front of it, 3 cross into
//   the air space.
// - Beat 4: the leaf warms from 25 to 35 °C; O₂ 3 and 4 follow at once.
import { C3, MPER, PORE, SPOT, type LPart } from '../figs/leaf-schema';
import { GLYPH } from './dk1-common';
import { LF11 } from './beats-lf';
import { add, ease, flash, glide, lerp, makeLeafStaging, panelShow, panelSvg, T, type Actor, type Api, type Row, type V } from './lf-common';
import { keyLines } from './stage-keys';
import type { Staging } from './types';

const S = SPOT, r = S.mRub, P: V = [MPER[0], MPER[1]], M = S.mito;
const ACTORS: Actor[] = [
  { k: 'c1', g: GLYPH.co2(), lab: 'CO₂ 1', dy: -22 },
  { k: 'pa', g: GLYPH.carbon('CCCP') }, { k: 'pb', g: GLYPH.carbon('CCCP'), lab: '2 3-PGA', dy: -20 },
  { k: 'o1', g: GLYPH.o2(), lab: 'O₂ 1', dy: -22 }, { k: 'o2', g: GLYPH.o2(), lab: 'O₂ 2', dy: -22 },
  { k: 'o3', g: GLYPH.o2(), lab: 'O₂ 3', dy: -22 }, { k: 'o4', g: GLYPH.o2(), lab: 'O₂ 4', dy: -22 },
  { k: 'gc1', g: GLYPH.carbon('CC'), lab: 'glycolate', dy: -22 }, { k: 'gc2', g: GLYPH.carbon('CC') },
  { k: 'g1', g: GLYPH.carbon('CCN'), lab: 'glycine', dy: 32 }, { k: 'g2', g: GLYPH.carbon('CCN') },
  { k: 'ser', g: GLYPH.carbon('CCCN'), lab: 'serine', dy: 32 },
  { k: 'pr1', g: GLYPH.co2(), lab: 'CO₂ 1', dy: -22 },
  ...[2, 3, 4].map(i => ({ k: `pr${i}`, g: GLYPH.co2(), lab: `${i}`, dx: -26, dy: 6, an: 'end' as const })),
];
const CO2_IN: V[] = [[24, 340], [70, 340], [PORE[0], 340], [180, 340], ...C3.co2In.slice(1, -1), add(r, [-30, 0])];
const O_IN: V[] = [[186, 262], [226, 258], ...C3.o2.slice(0, -1), add(r, [-10, -24])];
const GC = (k: number): V[] => [add(r, [30, -20 + 8 * k]), ...C3.glycolate.slice(1, -1), add(P, [-18, 6 * k])];
const GLY = (k: number): V[] => [add(P, [-10, 16 + 6 * k]), ...C3.glycine.slice(1), add(M, [10, -12 + 10 * k])];
const SER: V[] = [add(M, [16, 10]), [512, 320], add(P, [8, 26])];
/** Photorespired CO₂ 1 waits just inside the chloroplast, in front of the mitochondrion. */
const PR1: V = add(r, [58, 34]);
const REFIX: V[] = [PR1, add(r, [36, 20]), add(r, [24, 10])];
const LOST = (i: number): V[] => [add(M, [-10, 20]), ...C3.lost.slice(1, -1), [186, 350 + 32 * i]];

const ROWS: Row[] = [
  { k: 'r1', h: 38, html: '<tspan class="lfa-e">carboxylation:</tspan> CO₂ + RuBP → 2 3-PGA' },
  { k: 'r2', h: 38, html: '<tspan class="lfa-e">photorespiration:</tspan> 2 O₂ → … → 1 CO₂ released' },
  { k: 'r3', h: 40, html: 'refixed inside the cell: 24–38 % (rice, wheat)', cls: 'lfa-sum' },
];
const PX = 742, PY = 22, PW = 836;
/** A thermometer on the stage (its fill set by frame). */
const thermo = (): string => `<g data-k="th" display="none"><rect class="lfa-card" x="${PX}" y="230" width="300" height="140" rx="14"/>
  <rect class="lf-th" x="${PX + 30}" y="248" width="16" height="86" rx="8"/><circle class="lf-th" cx="${PX + 38}" cy="344" r="14"/>
  <rect data-k="th-f" class="lf-thf" x="${PX + 34}" y="300" width="8" height="44"/><circle class="lf-thf" cx="${PX + 38}" cy="344" r="10"/>
  <text data-k="th-t" class="lfa-h" x="${PX + 72}" y="300">25 °C</text>${T(PX + 72, 330, 'leaf temperature', 'lfa-sub', 'start')}</g>`;

function frame(a: Api, beat: number, t: number): void {
  if (beat === 0) {
    a.put('c1', t < 0.5 ? CO2_IN[0] : glide(CO2_IN, t, 0.5, 3.0), ease(t, 0.1, 0.4) * (1 - ease(t, 3.1, 3.3)));
    flash(a, t, 3.2, r);
    if (t > 3.2) { a.put('pa', glide([add(r, [-6, -24]), add(r, [-14, -60]), add(r, [-8, -86])], t, 3.3, 4.6), ease(t, 3.2, 3.4) * (1 - ease(t, 4.8, 5.2))); a.put('pb', glide([add(r, [6, -24]), add(r, [-2, -84]), add(r, [-8, -112])], t, 3.75, 5.0), ease(t, 3.2, 3.4) * (1 - ease(t, 5.1, 5.5))); }
  }
  if (beat === 1) {
    a.put('o1', t < 0.3 ? O_IN[0] : glide(O_IN, t, 0.3, 1.8), ease(t, 0, 0.3) * (1 - ease(t, 1.9, 2.1)));
    a.put('o2', t < 0.7 ? add(O_IN[0], [0, 30]) : glide([add(O_IN[0], [0, 30]), ...O_IN.slice(1)], t, 0.7, 2.1), ease(t, 0.4, 0.7) * (1 - ease(t, 2.2, 2.4)));
    flash(a, t, 2.3, r);
    for (const k of [1, 2]) {
      const t0 = 2.4 + 0.2 * (k - 1), t1 = t0 + 1.3, t2 = t1 + 0.2, t3 = t2 + 1.0;
      if (t > t0 && t < t1 + 0.3) a.put(`gc${k}`, glide(GC(k - 1), t, t0, t1), ease(t, t0, t0 + 0.2) * (1 - ease(t, t1, t1 + 0.2)));
      if (t > t1) a.put(`g${k}`, glide(GLY(k - 1), t, t2, t3), ease(t, t1, t1 + 0.2) * (1 - ease(t, t3, t3 + 0.2)));
    }
    flash(a, t, 3.8, P, 'fl2');
    flash(a, t, 5.1, M);
    if (t > 5.1) { a.put('pr1', glide([add(M, [-6, 6]), PR1], t, 5.2, 6.0), ease(t, 5.1, 5.3)); a.put('ser', glide(SER, t, 5.2, 6.4), ease(t, 5.1, 5.3) * (1 - ease(t, 6.3, 6.6))); }
  }
  if (beat === 2) {
    // CO₂ 1 is refixed by RuBisCO in front of the mitochondrion; CO₂ 2–4 leave the mitochondrion and cross into the air space
    a.put('pr1', t < 0.6 ? PR1 : glide(REFIX, t, 0.6, 1.6), 1 - ease(t, 1.7, 1.9));
    flash(a, t, 1.8, r);
    for (const i of [2, 3, 4]) {
      const t0 = 1.4 + 0.6 * (i - 2);
      if (t > t0 - 0.2) a.put(`pr${i}`, glide(LOST(i - 2), t, t0, t0 + 2.2), ease(t, t0 - 0.2, t0 + 0.1));
    }
    flash(a, t, 1.4, M, 'fl2');
  }
  if (beat === 3) {
    for (const i of [2, 3, 4]) a.put(`pr${i}`, LOST(i - 2)[LOST(i - 2).length - 1], 1 - ease(t, 0.2, 0.8));
    a.put('o3', glide(O_IN, t, 1.4, 2.8), ease(t, 1.2, 1.5) * (1 - ease(t, 2.9, 3.1)));
    a.put('o4', glide([add(O_IN[0], [0, 30]), ...O_IN.slice(1)], t, 1.8, 3.2), ease(t, 1.6, 1.9) * (1 - ease(t, 3.3, 3.5)));
    flash(a, t, 3.0, r); flash(a, t, 3.4, r, 'fl2');
  }
  const temp = beat < 3 ? 25 : lerp(25, 35, ease(t, 0.3, 2.0));
  a.op('th', 1); a.txt('th-t', `${Math.round(temp)} °C`);
  const fh = 30 + 3.2 * (temp - 25);
  a.attr('th-f', 'y', (344 - fh).toFixed(1)); a.attr('th-f', 'height', fh.toFixed(1));
  const v = (b: number, t0: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t0 + 0.4) : 0);
  panelShow(a, 'panel', ROWS, { r1: v(0, 3.3), r2: v(1, 5.2), r3: v(2, 4.0) });
}

const LIT: LPart[][] = [
  ['stoma', 'co2-in', 'm-cp', 'm-rub'],
  ['m-cp', 'm-rub', 'o2', 'pr-m', 'pr-gly', 'm-perox', 'm-mito'],
  ['m-cp', 'm-rub', 'm-mito', 'refix', 'escape'],
  ['m-cp', 'm-rub', 'o2', 'm-mito'],
];

const BASE = makeLeafStaging({
  id: 'lf11m',
  name: 'm · In the leaf section',
  note: 'C₃ in the mesophyll cell, one fixed framing: CO₂ 1 to RuBisCO; O₂ 1–2 → glycolate → glycine → CO₂ released in the mitochondrion; of 4 photorespired CO₂, 1 refixed, 3 out; the leaf warms and oxygenation rises',
  beats: LF11,
  leaf: { hide: ['ppdk', 'ca', 'pepc', 'me', 'bs-rub', 'bs-mito'] },
  actors: ACTORS,
  hud: () => `${panelSvg('panel', PX, PY, PW, ROWS)}${thermo()}`,
  cam: { s: 1.16, c: [0, 20], at: [10, 6] },
  clip: [0, 0, 712, 740],
  lit: LIT,
  frame,
});

/** The key lines on the stage (lecturer, 29 Oct 2026): each beat's take-home and the closing question. */
export const STAGING: Staging = { ...BASE, keys: [
  ...keyLines(0, ['RuBisCO fixes CO₂ into 3-PGA'], 1160, 540),
  ...keyLines(1, ['Photorespiration releases CO₂'], 1160, 540),
  ...keyLines(2, ['Chloroplasts in front refix CO₂'], 1160, 540),
  ...keyLines(3, ['As the leaf warms, oxygenation rises'], 1160, 540),
  // centred, over the empty vacuole of the cell it asks about, clear of the chloroplast and its label
  ...keyLines(3, ['Could a leaf release', 'photorespired CO₂ where', 'more RuBisCO can refix it?'], 800, 538, { size: 44, t0: 3.0 }),
] };
