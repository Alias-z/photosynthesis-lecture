// Photorespiration (slide C6), staging D: on the slide's line look (figure C6 v10), the cost first. Ehleringer &
// Björkman's CO₂ fixed per photon in air vs 2 % O₂ beside the whole schema; then the camera follows the carbon round
// the loop; back out. The story, the timing and the glyphs: rf6-common.ts.
import { RF6_COST } from './beats-rf56';
import { B, BL, makeStaging, P1, P2, P3, P4 } from './rf6-common';

export const STAGING = makeStaging({
  id: 'd',
  name: 'D · On the slide (line): the cost first',
  note: 'The slide C6 figure (line look): opens on the 1977 data (≈ 29 % less CO₂ per photon in air than in 2 % O₂), then follows the carbon round the loop, then back out.',
  look: 'line',
  beats: RF6_COST,
  order: ['eb77', 'glycolate', 'perox', 'mito', 'back', 'out'],
  screenAt: [1110, 140],
  cardAt: 0.85,
  start: B,
  cam: [[[0.05, 0.9, BL]], [[0.05, 1.1, P1]], [[0.05, 1.0, P2]], [[0.05, 1.0, P3]], [[0.05, 1.1, P4]], [[0.1, 1.2, B]]],
});
