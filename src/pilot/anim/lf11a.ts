// 'lf11a', staging m · C₂ in the leaf section (slide C11a; beats-lf.ts LF11A). One fixed framing of the mesophyll cell,
// the bundle-sheath cell and the vein; the ledger on the right. Per 2 O₂, numbered:
// - Beat 1: O₂ 1 and 2 from the air space into mesophyll RuBisCO; glycolate 1 and 2 to the peroxisome; glycine 1 and 2.
// - Beat 2: glycine 1 and 2 through the plasmodesmata, over the bundle-sheath chloroplast, into the mitochondrion.
// - Beat 3: glycine decarboxylase → serine, CO₂ 1 (to bundle-sheath RuBisCO, fixed) and NH₃.
// - Beat 4: serine back to the mesophyll peroxisome.
import { C2, C3, MPER, SPOT, type LPart } from '../figs/leaf-schema';
import { GLYPH } from './dk1-common';
import { LF11A } from './beats-lf';
import { nh3G } from '../figs/leaf-schema';
import { add, ease, flash, glide, makeLeafStaging, panelShow, panelSvg, type Actor, type Api, type Row, type V } from './lf-common';

const S = SPOT, P: V = [MPER[0], MPER[1]];
const ACTORS: Actor[] = [
  { k: 'o1', g: GLYPH.o2(), lab: 'O₂ 1', dy: -22 }, { k: 'o2', g: GLYPH.o2(), lab: 'O₂ 2', dy: 32 },
  { k: 'gc1', g: GLYPH.carbon('CC'), lab: 'glycolate 1', dy: -22 }, { k: 'gc2', g: GLYPH.carbon('CC'), lab: 'glycolate 2', dy: 32 },
  { k: 'g1', g: GLYPH.carbon('CCN'), lab: 'glycine 1', dy: -20 }, { k: 'g2', g: GLYPH.carbon('CCN'), lab: 'glycine 2', dx: -44, dy: 6, an: 'end' },
  { k: 'ser', g: GLYPH.carbon('CCCN'), lab: 'serine', dy: 32 },
  { k: 'co2', g: GLYPH.co2(), lab: 'CO₂ 1', dy: -22 },
  { k: 'nh3', g: `<circle class="dk-cap" r="20"/>${nh3G(0, 0)}`, lab: 'NH₃', dy: 34 },
];
const r = S.mRub;
const O_IN = (dy: number): V[] => [[186, 300 + dy], [222, 300 + dy], [262, 310 + dy * 0.5], add(r, [-24, dy * 0.3])];
const GC = (k: number): V[] => [add(r, [30, -20 + 8 * k]), ...C3.glycolate.slice(1, -1), add(P, [-18, 6 * k])];
const GLY = (k: number): V[] => [add(P, [8, -8 + 10 * k]), ...C2.gly.slice(1, -1), add(S.gdcP, [0, -10 + 16 * k])];
const SER: V[] = [add(S.gdcP, [-10, 30]), ...C2.ser.slice(1, -1), add(P, [12, 14])];
const CO2: V[] = [add(S.gdcP, [-20, 20]), ...C2.co2.slice(1), add(S.bsRub, [16, -6])];
const NH3: V[] = [add(S.gdcP, [10, 40]), [S.bsMito[0] + 6, S.bsMito[1] + 108]];
const SER_REST: V = [748, 500];
/** Where glycine 1 and 2 wait after the peroxisome (PEPC, not drawn here, would sit there). */
const GW = (k: number): V => [524, k === 1 ? 176 : 200];

const ROWS: Row[] = [
  { k: 'r0', h: 36, html: 'per 2 O₂', cls: 'dk-ph' },
  { k: 'r1', h: 38, html: '<tspan class="lfa-e">mesophyll:</tspan> 2 O₂ → 2 glycolate → 2 glycine' },
  { k: 'r2', h: 38, html: '<tspan class="lfa-e">bundle sheath:</tspan> 2 glycine → serine + CO₂ + NH₃' },
  { k: 'r2c', h: 32, html: '2 × 2 C = 3 C + 1 C', cls: 'dk-pc' },
  { k: 'r3', h: 40, html: 'CO₂ at RuBisCO, leaf mean: C₂ ≈ 3 × C₃ (<tspan font-style="italic">Flaveria</tspan>)', cls: 'lfa-sum' },
];
const PX = 904, PY = 22, PW = 676;

function frame(a: Api, beat: number, t: number): void {
  if (beat === 0) {
    a.put('o1', t < 0.6 ? O_IN(0)[0] : glide(O_IN(0), t, 0.6, 2.2), ease(t, 0.1, 0.5) * (1 - ease(t, 2.3, 2.5)));
    a.put('o2', t < 0.9 ? O_IN(80)[0] : glide(O_IN(80), t, 0.9, 2.4), ease(t, 0.3, 0.7) * (1 - ease(t, 2.4, 2.6)));
    flash(a, t, 2.5, r);
    for (const k of [1, 2]) {
      const t0 = 2.6 + 0.25 * (k - 1), t1 = t0 + 1.8;
      if (t > t0 && t < t1 + 0.3) a.put(`gc${k}`, glide(GC(k - 1), t, t0, t1), ease(t, t0, t0 + 0.2) * (1 - ease(t, t1, t1 + 0.2)));
      if (t > t1) a.put(`g${k}`, glide([add(P, [-10, -20]), GW(k)], t, t1, t1 + 0.6), ease(t, t1, t1 + 0.3));
    }
    flash(a, t, 4.5, P, 'fl2');
  }
  if (beat === 1) for (const k of [1, 2]) {
    const t0 = 0.3 + 0.35 * (k - 1), t1 = t0 + 3.4;
    a.put(`g${k}`, t < t0 ? GW(k) : glide([GW(k), ...GLY(k - 1).slice(2)], t, t0, t1), 1 - ease(t, t1 + 0.1, t1 + 0.3));
  }
  if (beat === 2) {
    flash(a, t, 0.5, S.gdcP);
    if (t > 0.5) {
      a.put('ser', glide([add(S.gdcP, [-10, 30]), C2.ser[0], SER_REST], t, 0.6, 1.9), ease(t, 0.5, 0.7));
      a.put('nh3', glide(NH3, t, 0.6, 1.8), ease(t, 0.5, 0.7));
      a.put('co2', glide(CO2, t, 0.9, 2.8), ease(t, 0.8, 1.0) * (1 - ease(t, 2.9, 3.1)));
    }
    flash(a, t, 3.0, S.bsRub, 'fl2');
    a.op('co2-l', ease(t, 1.4, 1.8));
  }
  if (beat === 3) {
    a.put('nh3', NH3[NH3.length - 1], 1);
    a.put('ser', glide([SER_REST, ...SER.slice(3)], t, 0.3, 3.6), 1 - ease(t, 3.6, 3.9));
  }
  const v = (b: number, t0: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t0 + 0.4) : 0);
  panelShow(a, 'panel', ROWS, { r0: v(0, 0.2), r1: v(0, 4.4), r2: v(2, 0.6), r2c: v(2, 1.2), r3: v(3, 2.0) });
}

const LIT: LPart[][] = [
  ['m-cp', 'm-rub', 'o2', 'pr-m', 'm-perox'],
  ['m-perox', 'gly', 'bs-mito'],
  ['bs-mito', 'bs-co2', 'bs-cp', 'bs-rub'],
  ['bs-mito', 'ser', 'm-perox', 'bs-cp', 'bs-rub'],
];

export const STAGING = makeLeafStaging({
  id: 'lf11am',
  name: 'm · In the leaf section',
  note: 'C₂ per 2 O₂ in the leaf section, one fixed framing: O₂ 1–2 at mesophyll RuBisCO → glycolate → glycine 1–2 → bundle-sheath glycine decarboxylase → serine, CO₂ 1 (to bundle-sheath RuBisCO) and NH₃; serine back',
  beats: LF11A,
  leaf: { hide: ['ppdk', 'ca', 'pepc', 'me'] },
  actors: ACTORS,
  hud: () => panelSvg('panel', PX, PY, PW, ROWS),
  cam: { s: 1.1, c: [160, 20], at: [10, 6] },
  clip: [0, 0, 892, 740],
  lit: LIT,
  frame,
});
