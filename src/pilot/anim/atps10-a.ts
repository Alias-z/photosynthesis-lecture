// ATP synthase, staging A: on slide 10's c2c3 look (view 10b: the lit parts glow, the other complexes are pale
// silhouettes). The story, the timing and the camera: atps10-common.ts.
import { makeStaging } from './atps10-common';

export const STAGING = makeStaging({
  id: 'a',
  name: 'A · On the slide (glow)',
  note: 'The slide 10 figure (c2c3 look): H⁺ gather in the lumen, Jagendorf and Uribe, zoom into ATP synthase and its rotor, zoom back out.',
  look: 'glow',
});
