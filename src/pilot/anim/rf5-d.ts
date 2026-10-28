// RuBisCO (slide C5), staging D: on the slide's flat look (figure C5 v12), the hot leaf first. Sage, Sage & Kocacinar's
// modelled surface (photorespiration/photosynthesis rising with leaf temperature, falling with CO₂) beside the whole
// schema; then into RuBisCO for why: carboxylation, oxygenation in the structure, temperature; back out. The story, the
// timing and the glyphs: rf5-common.ts.
import { RF5_HOT } from './beats-rf56';
import { B, BL, makeStaging, Z1, Z2C } from './rf5-common';

export const STAGING = makeStaging({
  id: 'd',
  name: 'D · On the slide (flat): the hot leaf first',
  note: 'The slide C5 figure (flat look): opens on the modelled rise of photorespiration with leaf temperature (Sage 2012), then zooms into RuBisCO to show why, then back out.',
  look: 'flat',
  beats: RF5_HOT,
  order: ['sage', 'carbox', 'oxy', 'temp', 'out'],
  start: B,
  cam: [[[0.05, 0.9, BL]], [[0.05, 1.1, Z1]], [[0.05, 1.0, Z2C], [2.5, 1.0, Z1]], [], [[0.1, 1.2, B]]],
});
