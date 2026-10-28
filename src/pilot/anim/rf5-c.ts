// RuBisCO (slide C5), staging C: inside the structure first, on the slide's pdb look (figure C5 v3, whose RuBisCO is our
// render of PDB 8RUC). The camera opens deep inside that render: carboxylation, oxygenation and their ratio in air at
// the active site; temperature; then it pulls back to the whole schema. The story, the timing and the glyphs:
// rf5-common.ts.
import { RF5_STRUCT } from './beats-rf56';
import { B, makeStaging, Z3, Z3C } from './rf5-common';

export const STAGING = makeStaging({
  id: 'c',
  name: 'C · Inside the RuBisCO structure, then pull back',
  note: 'Opens inside the slide C5 v3 figure’s RuBisCO structure (PDB 8RUC): CO₂, then O₂, then 3 CO₂ to 1 O₂ at one active site; temperature; the camera pulls back to the whole schema.',
  look: 'pdb',
  beats: RF5_STRUCT,
  order: ['scarbox', 'soxy', 'tally', 'temp', 'out'],
  start: Z3C,
  cam: [[], [], [[0.05, 0.8, Z3]], [], [[0.1, 1.5, B]]],
});
