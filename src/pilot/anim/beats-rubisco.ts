// Beats of the 'rubisco' animation (slide R1 · RuBisCO, the first of the 2 RuBisCO slides; script approved by the
// lecturer, 28 Oct 2026; it replaces cb2): RuBP binds, carboxylation, oxygenation, only 3-PGA makes sugar. Leads into R2.
import type { Beat, Cite } from './types';

const ANDERSSON96: Cite = { label: 'Andersson 1996, J. Mol. Biol. (RuBisCO, PDB 8RUC)', url: 'https://doi.org/10.1006/jmbi.1996.0310' };
const SHARKEY19: Cite = { label: 'Sharkey 2019, Photosynth. Res.', url: 'https://doi.org/10.1007/s11120-018-0600-2' };
const BOWES71: Cite = { label: 'Bowes, Ogren & Hageman 1971, Biochem. Biophys. Res. Commun.', url: 'https://doi.org/10.1016/0006-291X(71)90475-X' };

export const RUBISCO: Beat[] = [
  { tag: 'RuBP', say: 'RuBisCO binds ribulose-1,5-bisphosphate (RuBP), a 5-carbon sugar, at its active site.', cite: [ANDERSSON96] },
  { tag: 'Carboxylation', say: 'With CO₂: carboxylation gives 2 molecules of 3-phosphoglycerate (3-PGA).', cite: [SHARKEY19] },
  { tag: 'Oxygenation', say: 'With O₂: oxygenation gives only 1 3-PGA, plus 2-phosphoglycolate (2-PG).', cite: [BOWES71] },
  { tag: '3-PGA makes sugar', say: 'Only 3-PGA makes sugar and bread: carboxylation is the reaction we want. <b>Why does RuBisCO take O₂ at all?</b>', cite: [SHARKEY19] },
];
