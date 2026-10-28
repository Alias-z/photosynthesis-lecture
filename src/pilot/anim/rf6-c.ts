// Photorespiration (slide C6), staging C: on the slide's glow look (figure C6 v3), history first. Somerville & Ogren's
// 1979 mutant beside the whole schema, then the loop it lacks, one organelle at a time; back out. The story, the timing
// and the glyphs: rf6-common.ts.
import { RF6_HIST } from './beats-rf56';
import { B, BL, makeStaging, P1, P2, P3, P4 } from './rf6-common';

export const STAGING = makeStaging({
  id: 'c',
  name: 'C · On the slide (glow): the mutant first',
  note: 'The slide C6 figure (glow look): the 1979 mutant that needs high CO₂ opens the story, then the camera follows the carbon round the loop it lacks, then back out.',
  look: 'glow',
  beats: RF6_HIST,
  order: ['screen', 'glycolate', 'perox', 'mito', 'back', 'out'],
  screenAt: [1100, 200],
  cardAt: 0.85,
  start: B,
  cam: [[[0.05, 0.9, BL]], [[0.05, 1.1, P1]], [[0.05, 1.0, P2]], [[0.05, 1.0, P3]], [[0.05, 1.1, P4]], [[0.1, 1.2, B]]],
});
