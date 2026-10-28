// Slide 11 · Excess light, staging A: on the slide 11 chain figure in the c2c3 look (glow); the camera zooms into
// photosystem II and back out. The story, the timing and the readout: pp11-common.ts.
import { makeStaging } from './pp11-common';

export const STAGING = makeStaging({
  id: 'a',
  name: 'A · Zoom (glow)',
  note: 'The slide 11 chain (c2c3 look): zoom into photosystem II, the three exits widen and narrow with the light, singlet O₂ hits D1, zoom back out.',
  look: 'glow',
  camera: 'dive',
});
