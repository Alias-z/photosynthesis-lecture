// Captions and sources of the light → dark bridge (slide C0, lecturer 28 Oct 2026): after 10b the camera swipes from the
// 7m1 chain into the dark-reaction strip (figs/cell-schema.ts); concept level, no stoichiometric counts. Leads into C2.
import type { Beat, Cite } from './types';

const SHEVELA23: Cite = { label: 'Shevela et al. 2023, Photosynth. Res.', url: 'https://doi.org/10.1007/s11120-022-00991-y' };
const BASSHAM54: Cite = { label: 'Bassham et al. 1954, J. Am. Chem. Soc.', url: 'https://doi.org/10.1021/ja01636a012' };
const ANDERSSON96: Cite = { label: 'Andersson 1996, J. Mol. Biol. (Rubisco, PDB 8RUC)', url: 'https://doi.org/10.1006/jmbi.1996.0310' };

export const BRIDGE: Beat[] = [
  { tag: 'Light reactions', say: 'The light reactions leave ATP and NADPH on the stroma side of the thylakoid membrane.', cite: [SHEVELA23] },
  { tag: 'Into the stroma', say: 'Beside the thylakoid lies the stroma, the chloroplast’s soluble interior. ATP and NADPH move into it.', cite: [SHEVELA23] },
  { tag: 'CO₂ fixation', say: 'Rubisco joins CO₂ to RuBP, which gives 3-PGA. ATP and NADPH turn 3-PGA into triose phosphate; ADP + Pᵢ and NADP⁺ go back to the thylakoid to be recharged.', cite: [BASSHAM54] },
  { tag: 'Rubisco', say: 'One enzyme brings the carbon in from the air. <b>What is Rubisco?</b>', cite: [ANDERSSON96] },
];
