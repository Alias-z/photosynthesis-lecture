// Cytochrome b₆f told as the Q cycle, staging qb: a small plastoquinone pool (four lettered PQ / PQH₂) drifts slowly in the
// membrane between photosystem II and b₆f the whole time; the plastoquinol that bind at b₆f come from it, and the
// plastoquinone and plastoquinol that leave b₆f rejoin it. Plastocyanin glides to b₆f, docks under cytochrome f, takes
// its electron there and glides on to photosystem I. The story, the timing and the camera: b6fq-common.ts.
import { GEO } from '../figs/chain';
import { B6FQ } from './beats-b6fq';
import { atStage, makeStaging, QI, QO, type View } from './b6fq-common';

const Z: View = { s: 2.6, c: [322, 312] };
const at = (X: number, Y: number): [number, number] => atStage(Z, X, Y);

export const STAGING = makeStaging({
  id: 'qb',
  name: 'qb · Q cycle, plastoquinone pool',
  note: 'The slide 8 figure: zoom into cytochrome b₆f; a slowly drifting plastoquinone pool feeds it two plastoquinol, one after the other; one electron of each goes to plastocyanin, the other back to the stroma-side plastoquinone, which becomes plastoquinol and rejoins the pool.',
  beats: B6FQ,
  z: Z,
  pool: { A: [236, 291], C: [262, 309], D: [205, 296], E: [226, 312], B: [262, 309], lab: { at: at(330, 222), to: [214, 285] }, dTypes: [false, true] },
  aRest: [0, 0], cFrom: [0, 0], bRest: [0, 0],
  lab: {
    b6f: { at: at(860, 115), to: [GEO.hem[0] + 18, 262] },
    psi: { at: at(1100, 196), to: [470, 262] },
    qo: { at: at(470, 478), to: [QO[0] - 12, QO[1] + 8], dy: -22 },
    qi: { at: at(1050, 196), to: [QI[0] + 8, QI[1] - 9.5] },
    r1: at(968, 462), r2: at(808, 370),
    molOff: [-26, -60],
  },
  ledger: [1148, 10],
});
