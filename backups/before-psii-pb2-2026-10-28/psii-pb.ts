// Photosystem II, staging pb: on slide 7's figure 7m1. A pool of plastoquinone jiggles in the membrane between PSII and
// b₆f the whole time, one of them in Q_B; once reduced, plastoquinol slips out and joins the pool, and a fresh
// plastoquinone from the pool slips into Q_B. Ruben and Kamen: one flask. The story, the timing and the camera:
// psiim-common.ts.
import { PSIIP } from './beats-psiip';
import { makeStaging } from './psiim-common';

export const STAGING = makeStaging({
  id: 'pb',
  name: 'PB · PQ pool',
  note: 'The slide 7 figure (7m1): a plastoquinone pool jiggles in the membrane, one in Q_B; plastoquinol slips out into the pool, a fresh plastoquinone slips in. One flask.',
  card: 'one',
  pq: 'pool',
  beats: PSIIP,
});
