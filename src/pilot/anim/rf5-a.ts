// RuBisCO (slide C5), staging A: on the slide's thesis look (figure C5 v1). Zoom into RuBisCO; carboxylation; into the
// RuBisCO structure for oxygenation and back; Forrester's soybean leaves (1966) beside the zoom; temperature; back out.
// The story, the timing and the glyphs: rf5-common.ts.
import { B, makeStaging, Z1, Z2C } from './rf5-common';

export const STAGING = makeStaging({
  id: 'a',
  name: 'A · On the slide (thesis): into RuBisCO',
  note: 'The slide C5 figure (thesis look): zoom into RuBisCO, CO₂ then O₂ at its active site (the 8RUC structure), the 1966 soybean data and temperature beside the zoom, then back out.',
  look: 'thesis',
  order: ['carbox', 'oxy', 'forr', 'temp', 'out'],
  start: B,
  cam: [[[0.05, 1.1, Z1]], [[0.05, 1.0, Z2C], [2.5, 1.0, Z1]], [], [], [[0.1, 1.2, B]]],
});
