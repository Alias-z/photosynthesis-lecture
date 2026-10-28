// Photosystem I, staging m1: Emerson with two lamps on the chain and an electron count. Beats 1–3, the rule, the photon
// rows and the light on the chain: psim-common.ts.
// - Beat 4 (Emerson's enhancement): over both photosystems hang a red lamp (680 nm) aimed at photosystem II (its light
//   reaches photosystem I too, more weakly) and a far-red lamp (> 700 nm) aimed at photosystem I; they light one row at a
//   time: far-red alone, red alone, both. The panel holds only the photon rows, large, with a tally of the electrons that
//   get through (1 / 3 / 6); on the chain each counted electron runs from photosystem II to photosystem I.
import { lerpV, smooth, tw, type V } from './antenna-common';
import { B4, P700, RC2, ROWS, makeStaging, o2At } from './psim-common';
import { PSIM } from './beats-psim';

/** Each counted electron leaves PSII's reaction centre 0.7 s before it is tallied and arrives at P700. */
const TRIP = 0.7;
const MID: V = [330, 238];
const at = (u: number): V => { const a = lerpV(RC2, MID, u), b = lerpV(MID, P700, u); return lerpV(a, b, u); };
const ALL: Array<[number, number]> = ROWS.flatMap((w, r) => Array.from({ length: w.e }, (_, j): [number, number] => [r, j]));

export const STAGING = makeStaging({
  id: 'm1',
  name: 'M1 · Lamps and an electron count',
  note: 'Slide 9 figure: zoom on photosystem I, its parts named before they act; the red drop; Emerson with a red and a far-red lamp over both photosystems, the photons paired off per light and the electrons that get through counted (1 / 3 / 6).',
  beats: PSIM,
  lamps: true,
  table: { y0: 250, rowH: 125, o2: 'dots' },
  panel: () => '',
  world: () => ALL.map(([r, j]) => `<g data-k="run-${r}-${j}" opacity="0" display="none"><circle class="pm-e" r="6"/></g>`).join(''),
  bind(c) {
    return (t4, _t5, k) => {
      ALL.forEach(([r, j]) => {
        const t1 = o2At(r, j), u = (t4 - (t1 - TRIP)) / TRIP;
        c.put(`run-${r}-${j}`, at(smooth(u)), k, u < 0 || u > 1.25 ? 0 : tw(u, 0, 0.1) * (1 - tw(u, 1.0, 1.2)));
      });
      void B4;
    };
  },
});
