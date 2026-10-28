// Photosystem II, staging C: on slide 7's c2c3 look (photosystem II glows, the other complexes are pale silhouettes).
// Ruben and Kamen's card holds one flask of heavy-oxygen water, from which a bubble of heavy O₂ rises.
// The story, the timing and the camera: psii7-common.ts.
import { makeStaging } from './psii7-common';

export const STAGING = makeStaging({
  id: 'c',
  name: 'C · On the slide (glow), one flask',
  note: 'The slide 7 figure (c2c3 look): zoom into photosystem II, the story there, zoom back out. Ruben and Kamen: one flask of heavy-oxygen water.',
  style: 'bil-glow',
  card: 'one',
});
