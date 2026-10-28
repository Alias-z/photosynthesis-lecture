// Cyclic electron flow, staging B: on slide 10b's c2c look (lipid bilayer, the cycle's complexes in colour, the others grey).
// The story, the timing, the camera, the readout and the clipping: cyc10b-common.ts.
import { makeStaging } from './cyc10b-common';

export const STAGING = makeStaging({
  id: 'b',
  name: 'B · On the slide (bilayer)',
  note: 'The slide 10b figure (c2c look) with an ATP : NADPH readout: zoom onto the cycle around photosystem I, one electron round it, zoom back out.',
  look: 'bil',
});
