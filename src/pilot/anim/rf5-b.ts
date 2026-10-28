// RuBisCO (slide C5), staging B: on the slide's glow look (figure C5 v2), history first. Forrester's 1966 soybean data
// beside the whole schema; Bowes, Ogren & Hageman's 1971 paper as the camera dives into RuBisCO for oxygenation;
// carboxylation as the competitor; temperature; back out. The story, the timing and the glyphs: rf5-common.ts.
import { RF5_HIST } from './beats-rf56';
import { B, BL, makeStaging, Z1, Z2 } from './rf5-common';

export const STAGING = makeStaging({
  id: 'b',
  name: 'B · On the slide (glow): history first',
  note: 'The slide C5 figure (glow look): the 1966 observation (O₂ lowers CO₂ uptake) first, its 1971 cause in RuBisCO, then competition with CO₂ and temperature, then back out.',
  look: 'glow',
  beats: RF5_HIST,
  order: ['forr', 'oxy', 'carbox', 'temp', 'out'],
  cards: [[0, 'forr'], [1, 'bowes'], [3, 'temp']],
  start: B,
  cam: [[[0.05, 0.9, BL]], [[0.05, 1.15, Z2], [2.5, 1.0, Z1]], [], [], [[0.1, 1.2, B]]],
});
