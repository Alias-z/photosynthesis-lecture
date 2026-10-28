// 'lf10', staging m · CO₂ from the air to RuBisCO (slide C10; beats-lf.ts LF10). One fixed framing of the air, the
// stoma and the mesophyll cell; the concentrations on a scale on the right.
// - Beat 1: CO₂ 1 from the air through the boundary layer to the pore; H₂O 1 leaves through the same pore.
// - Beat 2: CO₂ 1 through the air space, the wet cell wall and the cell into the chloroplast, to RuBisCO.
// - Beat 3: a hot, dry day: the stoma half-closes, less water leaves, Cᵢ and C꜀ fall.
import { CO2_PATH, guardCells, H2O_PATH, PORE, SPOT, type LPart } from '../figs/leaf-schema';
import { GLYPH } from './dk1-common';
import { h2oG } from '../figs/leaf-schema';
import { LF10 } from './beats-lf';
import { add, ease, glide, lerp, flash, makeLeafStaging, T, type Actor, type Api, type V } from './lf-common';

const r = SPOT.mRub;
const cap = (w: number, rr = 13): string => `<rect class="dk-cap" x="${-w / 2 - 5}" y="${-rr - 5}" width="${w + 10}" height="${2 * rr + 10}" rx="${rr + 5}"/>`;
const ACTORS: Actor[] = [
  { k: 'c1', g: GLYPH.co2(), lab: 'CO₂ 1', dy: -22 },
  { k: 'w1', g: `${cap(36)}${h2oG(0, -2)}`, lab: 'H₂O 1', dy: 34 },
  { k: 'w2', g: `${cap(36)}${h2oG(0, -2)}`, lab: 'H₂O 2', dy: 34 },
];
const IN1: V[] = [[24, 334], [52, 334], [PORE[0], 334]];
const IN2: V[] = [[PORE[0], 334], ...CO2_PATH.slice(3, 6).map(([x]) => [x, 334] as V), add(r, [-30, -6])];
const OUT: V[] = [[200, 352], [PORE[0], 350], [60, 352], [30, 360]];

/* the concentration scale (stage units): Cₐ, Cᵢ, C꜀ as bars on 0–450 ppm */
const SX = 760, SY = 60, SW = 800, SH = 300;
const bars: Array<[string, string, number]> = [['a', 'C<tspan class="cbb-sub" dy="4">a</tspan><tspan dy="-4"> air</tspan>', 430], ['i', 'C<tspan class="cbb-sub" dy="4">i</tspan><tspan dy="-4"> air spaces</tspan>', 300], ['c', 'C<tspan class="cbb-sub" dy="4">c</tspan><tspan dy="-4"> chloroplast</tspan>', 200]];
const by = (v: number): number => SY + SH - (SH * v) / 450;
const scale = (): string => `<g data-k="sc" display="none"><rect class="lfa-card" x="${SX - 30}" y="${SY - 40}" width="${SW}" height="${SH + 120}" rx="16"/>
  ${T(SX - 6, SY - 12, 'CO₂ (ppm)', 'lfa-sub', 'start')}
  <path class="lfa-axis" d="M${SX + 40},${SY + SH}H${SX + SW - 80}"/>
  ${bars.map(([k, lab], i) => { const x = SX + 90 + i * 220; return `<g data-k="b-${k}" display="none"><rect data-k="bar-${k}" class="lfa-bar lfa-bar-${k}" x="${x}" y="${SY}" width="120" height="0" rx="6"/>
    <text data-k="v-${k}" class="lfa-sum" x="${x + 60}" y="${SY}" text-anchor="middle"></text><text class="lfa-h" x="${x + 60}" y="${SY + SH + 36}" text-anchor="middle">${lab}</text>
    ${k === 'a' ? '' : `<g data-k="dn-${k}" display="none"><path class="lfa-dn" d="M${x + 140},${by(k === 'i' ? 300 : 200) + 10}v60"/><path class="lfa-dnh" d="M${x + 140},${by(k === 'i' ? 300 : 200) + 84}l-11,-20h22z"/></g>`}</g>`; }).join('')}
  <g data-k="fall" display="none">${T(SX + SW / 2 - 30, SY + SH + 70, 'hot, dry day: stomata partly closed, Cᵢ and C꜀ fall', 'lfa-q')}</g></g>`;

function setBar(a: Api, k: string, v: number, txt: string): void {
  a.attr(`bar-${k}`, 'y', by(v).toFixed(1)); a.attr(`bar-${k}`, 'height', (SY + SH - by(v)).toFixed(1));
  a.attr(`v-${k}`, 'y', (by(v) - 10).toFixed(1)); a.txt(`v-${k}`, txt);
}
function frame(a: Api, beat: number, t: number): void {
  // the stoma: open, then half-closed on the hot, dry day
  const gap = beat < 2 ? 12 : lerp(12, 5, ease(t, 0.3, 1.6));
  a.html('guard', guardCells(PORE, Math.round(gap * 2) / 2, true));
  if (beat === 0) {
    a.put('c1', t < 0.5 ? IN1[0] : glide(IN1, t, 0.5, 2.6), ease(t, 0.1, 0.4));
    a.put('w1', glide(OUT, t, 0.9, 3.0), ease(t, 0.8, 1.1));
  }
  if (beat === 1) {
    a.put('w1', OUT[OUT.length - 1], 1 - ease(t, 0, 0.5));
    a.put('c1', glide(IN2, t, 0.3, 3.0), 1 - ease(t, 3.2, 3.4));
    flash(a, t, 3.3, r);
  }
  if (beat === 2) {
    // half as wide a pore: less water leaves (H₂O 2 slower)
    a.put('w2', glide(OUT, t, 1.2, 4.2), ease(t, 1.1, 1.4) * (1 - ease(t, 4.2, 4.6)));
  }
  a.op('sc', 1);
  a.op('b-a', beat === 0 ? ease(t, 0.3, 0.7) : 1);
  a.op('b-i', beat === 0 ? 0 : beat === 1 ? ease(t, 0.8, 1.2) : 1);
  a.op('b-c', beat === 1 ? ease(t, 2.4, 2.8) : beat > 1 ? 1 : 0);
  const fall = beat === 2 ? ease(t, 1.6, 2.4) : 0;
  setBar(a, 'a', 430, '≈ 430');
  setBar(a, 'i', 300, '≈ 300');
  setBar(a, 'c', 200, '≈ 200');
  a.op('dn-i', fall); a.op('dn-c', fall);
  a.op('fall', beat === 2 ? ease(t, 2.4, 2.9) : 0);
}

const LIT: LPart[][] = [
  ['air', 'bl', 'stoma', 'gb', 'gs', 'h2o'],
  ['stoma', 'as', 'mwall', 'gm', 'm-cp', 'm-rub', 'gb', 'gs', 'h2o'],
  ['stoma', 'gs', 'm-cp', 'm-rub', 'h2o'],
];

export const STAGING = makeLeafStaging({
  id: 'lf10m',
  name: 'm · In the leaf section',
  note: 'CO₂ 1 from the air to RuBisCO in one fixed framing while H₂O 1 leaves through the same stoma; Cₐ, Cᵢ and C꜀ as bars; on a hot, dry day the stoma half-closes and Cᵢ and C꜀ fall',
  beats: LF10,
  leaf: { noGuard: true, hide: ['ppdk', 'ca', 'pepc', 'me', 'bs-rub', 'bs-mito', 'm-perox', 'm-mito'] },
  actors: ACTORS,
  world: () => '<g data-k="guard"></g>',
  hud: () => scale(),
  cam: { s: 1.16, c: [0, 20], at: [10, 6] },
  clip: [0, 0, 712, 740],
  lit: LIT,
  frame,
});
