// Cytochrome b₆f told as the Q cycle, staging qa: no pool: the plastoquinone molecules glide smoothly: the first plastoquinol
// from its slide place, the second from photosystem II's side; the molecules that leave b₆f settle in the membrane and stay
// there. Plastocyanin glides to b₆f, docks
// under cytochrome f, takes its electron there and diffuses on to photosystem I. Camera as b6f-m1.
// The story, the timing and the camera: b6fq-common.ts.
import { GEO } from '../figs/chain';
import { B6FQ } from './beats-b6fq';
import { atStage, makeStaging, QI, QO, type View } from './b6fq-common';

const Z: View = { s: 2.9, c: [350, 313.5] };
const at = (X: number, Y: number): [number, number] => atStage(Z, X, Y);

export const STAGING = makeStaging({
  id: 'qa',
  name: 'qa · Q cycle, no pool',
  note: 'The slide 8 figure: zoom into cytochrome b₆f; two plastoquinol glide in, one after the other; one electron of each goes to plastocyanin, the other back to the stroma-side plastoquinone, which becomes plastoquinol and moves off.',
  beats: B6FQ,
  z: Z,
  aRest: [232, 311], cFrom: [200, 291], bRest: [262, 290],
  lab: {
    b6f: { at: at(786, 102), to: [GEO.hem[0] + 18, 262] },
    psi: { at: at(1075, 205), to: [470, 262] },
    qo: { at: at(420, 478), to: [QO[0] - 12, QO[1] + 8], dy: -22 },
    qi: { at: at(1000, 208), to: [QI[0] + 8, QI[1] - 9.5] },
    r1: at(925, 462), r2: at(728, 366),
    molOff: [-26, -52],
  },
  ledger: [1148, 10],
});
