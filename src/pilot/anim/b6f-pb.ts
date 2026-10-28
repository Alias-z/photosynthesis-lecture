// Cytochrome b₆f, staging pb: as m1 (one close view on b₆f), but plastoquinol is one of a pool of plastoquinone molecules
// that jiggle in the membrane between PSII and b₆f the whole time (named once, "plastoquinone pool"); it slips from the
// pool into the Q_o site, hands over, and the emptied plastoquinone slips back into the pool.
// In the simplified story both electrons go on, one at a time, each with a plastocyanin that diffuses to b₆f, docks under
// cytochrome f, takes the electron by a short hop and diffuses off toward PSI (the first docks under PSI and stays; the
// second stops short of it); the end reads "2 e⁻ → 2 H⁺ into the lumen".
// The story, the pool, the timing and the camera: b6fm-common.ts. Captions: beats-b6fp.ts (drafts).
import { B6FP } from './beats-b6fp';
import { makeStaging } from './b6fm-common';

const Z = { s: 2.9, c: [350, 313.5] as [number, number] };

export const STAGING = makeStaging({
  id: 'pb',
  name: 'pb · Plastoquinone pool',
  note: 'The slide 8 figure: a pool of plastoquinone jiggles in the membrane; one plastoquinol slips into b₆f’s Q_o site, hands over, and slips back. Plastocyanin diffuses to b₆f, docks, takes an electron and diffuses to photosystem I; a second one takes the second electron.',
  z1: Z, z2: Z, z2e: Z, follow: false, pq: 'pool', beats: B6FP,
  b1: { pool: 2.3, pq: 3.4, hold: 4.85, dock: 4.95, dockD: 1.2, hand: 6.3, relabel: 6.9, leave: 7.25, leaveD: 1.2, end: 8.65 },
  story: 'two',
  // plastocyanin diffuses (lecturer, 28 Oct 2026: it comes to b₆f for the electron; it is not shot at): it waits in the
  // lumen, walks to b₆f and docks under cytochrome f, takes the electron by a short hop, then walks to PSI and docks
  pcDiffuse: true,
  b2: { pc: 0.1, psi: 0.7, hold: 1.6, come: 1.7, comeD: 1.8, e: 3.6, eD: 0.6, go: 4.4, goD: 2.2, hold2: 6.8, in2: 6.9, in2D: 1.6, e2: 8.6, go2: 9.4, go2D: 1.2, end: 10.8 },
});
