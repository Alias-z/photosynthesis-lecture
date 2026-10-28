// Captions and sources of the light → dark bridge (slide C0, lecturer 28 Oct 2026): after 10b the camera swipes from the
// 7m1 chain into the dark-reaction strip (figs/cell-schema.ts); concept level, no stoichiometric counts. Leads into C2.
// Beat 4 (lecturer, 28 Oct 2026: "make the CO₂ turn into bread"): leaf starch is a night store; bread starch is made in the
// wheat grain from sucrose exported by the leaf.
import type { Beat, Cite } from './types';

const SHEVELA23: Cite = { label: 'Shevela et al. 2023, Photosynth. Res.', url: 'https://doi.org/10.1007/s11120-022-00991-y' };
const BASSHAM54: Cite = { label: 'Bassham et al. 1954, J. Am. Chem. Soc.', url: 'https://doi.org/10.1021/ja01636a012' };
const ANDERSSON96: Cite = { label: 'Andersson 1996, J. Mol. Biol. (Rubisco, PDB 8RUC)', url: 'https://doi.org/10.1006/jmbi.1996.0310' };

const STITT: Cite = { label: 'Stitt & Zeeman 2012, Curr. Opin. Plant Biol. (leaf starch)', url: 'https://doi.org/10.1016/j.pbi.2012.03.016' };
const EMES: Cite = { label: 'Emes et al. 2003, J. Exp. Bot. (starch in developing endosperm)', url: 'https://doi.org/10.1093/jxb/erg089' };

export const BRIDGE: Beat[] = [
  { tag: 'Light reactions', say: 'The light reactions leave ATP and NADPH on the stroma side of the thylakoid membrane.', cite: [SHEVELA23] },
  { tag: 'Into the stroma', say: 'Beside the thylakoid lies the stroma, the chloroplast’s soluble interior. ATP and NADPH move into it.', cite: [SHEVELA23] },
  { tag: 'CO₂ fixation', say: 'Rubisco joins CO₂ to RuBP, which gives 3-PGA. ATP and NADPH turn 3-PGA into triose phosphate; ADP + Pᵢ and NADP⁺ go back to the thylakoid to be recharged.', cite: [BASSHAM54] },
  { tag: 'To bread', say: 'Triose phosphate becomes starch in the leaf and sucrose for the plant. Sucrose fills the wheat grain with starch: the carbon in bread came in as CO₂.', cite: [STITT, EMES] },
  { tag: 'Rubisco', say: 'One enzyme brings that carbon in from the air. <b>What is Rubisco?</b>', cite: [ANDERSSON96] },
];
