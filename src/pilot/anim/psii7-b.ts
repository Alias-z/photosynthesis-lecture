// Photosystem II, staging D: on slide 7's c2c look (lipid bilayer, photosystem II in colour, the others grey).
// Ruben and Kamen's card holds two flasks, heavy oxygen in the water or in the CO₂; only the water flask gives heavy O₂.
// The story, the timing and the camera: psii7-common.ts.
import { makeStaging } from './psii7-common';

export const STAGING = makeStaging({
  id: 'd',
  name: 'D · On the slide (bilayer), two flasks',
  note: 'The slide 7 figure (c2c look): zoom into photosystem II, the story there, zoom back out. Ruben and Kamen: heavy oxygen in the water or in the CO₂.',
  style: 'pdb-bilayer',
  card: 'two',
});
