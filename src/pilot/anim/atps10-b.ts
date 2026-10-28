// ATP synthase, staging B: on slide 10's c2c look (view 10a: lipid bilayer, the lit parts in colour, the others grey).
// The story, the timing and the camera: atps10-common.ts.
import { makeStaging } from './atps10-common';

export const STAGING = makeStaging({
  id: 'b',
  name: 'B · On the slide (bilayer)',
  note: 'The slide 10 figure (c2c look): H⁺ gather in the lumen, Jagendorf and Uribe, zoom into ATP synthase and its rotor, zoom back out.',
  look: 'bil',
});
