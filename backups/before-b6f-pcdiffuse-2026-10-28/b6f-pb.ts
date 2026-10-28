// Cytochrome b₆f, staging pb: as m1 (one close view on b₆f), but plastoquinol is one of a pool of plastoquinone molecules
// that jiggle in the membrane between PSII and b₆f the whole time (named once, "plastoquinone pool"); it slips from the
// pool into the Q_o site, hands over, and the emptied plastoquinone slips back into the pool.
// In the simplified story both electrons go on, one at a time, each with a plastocyanin (the first docks under PSI and
// stays there; a second comes in from the lumen and stops short of it); the end reads "2 e⁻ → 2 H⁺ into the lumen".
// The story, the pool, the timing and the camera: b6fm-common.ts. Captions: beats-b6fp.ts (drafts).
import { B6FP } from './beats-b6fp';
import { makeStaging } from './b6fm-common';

const Z = { s: 2.9, c: [350, 313.5] as [number, number] };

export const STAGING = makeStaging({
  id: 'pb',
  name: 'pb · Plastoquinone pool',
  note: 'The slide 8 figure: a pool of plastoquinone jiggles in the membrane; one plastoquinol slips into b₆f’s Q_o site, hands over, and slips back. Both electrons go on, each with a plastocyanin; the first docks under photosystem I and stays.',
  z1: Z, z2: Z, z2e: Z, follow: false, pq: 'pool', beats: B6FP,
  b1: { pool: 2.3, pq: 3.4, hold: 4.85, dock: 4.95, dockD: 1.2, hand: 6.3, relabel: 6.9, leave: 7.25, leaveD: 1.2, end: 8.65 },
  story: 'two',
  b2: { pc: 0.1, psi: 0.7, hold: 1.6, e: 1.7, eD: 0.9, go: 2.8, goD: 1.3, hold2: 4.3, in2: 4.4, e2: 5.5, go2: 6.6, end: 7.8 },
});
