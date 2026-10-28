// Light-response curve (slide C7), animation rf7, staging C: on slide C7's schema in the structure look (figure C7 v3),
// whose thylakoid is drawn with the four complexes of slides 7–10b. The camera dives into them: light falls on the two
// photosystems, ATP leaves ATP synthase and NADPH leaves photosystem I, toward the cycle; then it widens to the cycle as
// uptake levels off. Huang et al. 2014's sun and shade tobacco in beat 5. The story and timing: rf7-common.ts.
import { makeStaging } from './rf7-common';

export const STAGING = makeStaging({
  id: 'c',
  name: 'C · Into the thylakoid’s complexes (structure look)',
  note: 'The slide C7 schema (structure look): the camera dives into the thylakoid’s four complexes (lecture 1’s chain) where light makes ATP and NADPH, then widens to the cycle as uptake levels off; sun vs shade tobacco; back out.',
  look: 'pdb',
  clip: 'huang',
  camera: 'chain',
});
