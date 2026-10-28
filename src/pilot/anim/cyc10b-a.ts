// Cyclic electron flow, staging A: on slide 10b's c2c3 look (the cycle's complexes glow, the others are pale silhouettes).
// The story, the timing, the camera, the readout and the clipping: cyc10b-common.ts.
import { makeStaging } from './cyc10b-common';

export const STAGING = makeStaging({
  id: 'a',
  name: 'A · On the slide (glow)',
  note: 'The slide 10b figure (c2c3 look) with an ATP : NADPH readout: zoom onto the cycle around photosystem I, one electron round it, zoom back out.',
  look: 'glow',
});
