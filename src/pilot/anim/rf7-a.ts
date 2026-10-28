// Light-response curve (slide C7), animation rf7, staging A: on slide C7's schema in the thesis look (figure C7 v1),
// zooming on the light reactions' supply of ATP and NADPH, then widening to the cycle; Huang et al. 2014's sun and shade
// tobacco in beat 5. The story, the timing and the camera: rf7-common.ts.
import { makeStaging } from './rf7-common';

export const STAGING = makeStaging({
  id: 'a',
  name: 'A · Zoom on the light supply (thesis look)',
  note: 'The slide C7 schema (thesis look): light rises from darkness to full sun; the camera zooms on the thylakoid’s ATP and NADPH, widens to the cycle as uptake levels off; sun vs shade tobacco (Huang 2014); back out to the slide.',
  look: 'thesis',
  clip: 'huang',
  camera: 'wide',
});
