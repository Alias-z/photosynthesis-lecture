// Beats of the 'regeneration' animation (slide C3b · Regeneration of RuBP; C₃ photosynthesis step by step, one step per
// slide; lecturer, 28 Oct 2026). Counted per 3 CO₂, the smallest number that gives whole RuBP (DARK_COUNTS_BRIEF.md): a
// short recap draws the inputs and makes the 6 triose phosphates first. Leads into C4 · Sucrose and starch.
import type { Beat, Cite } from './types';

const SHARKEY19: Cite = { label: 'Sharkey 2019, Photosynth. Res.', url: 'https://doi.org/10.1007/s11120-018-0600-2' };
const MICHELET13: Cite = { label: 'Michelet et al. 2013, Front. Plant Sci.', url: 'https://doi.org/10.3389/fpls.2013.00470' };

export const REGENERATION: Beat[] = [
  { tag: 'Recap: 3 CO₂', say: '3 CO₂ and 3 RuBP give 6 3-PGA, reduced with 6 ATP and 6 NADPH to 6 triose phosphates. 3 CO₂ is the smallest number that gives whole RuBP.', cite: [SHARKEY19] },
  { tag: 'Rearrangement of triose phosphate', say: '5 of the 6 triose phosphates are rearranged into 3 ribulose-5-phosphate: 5 × 3 C = 15 C = 3 × 5 C. The 6th triose phosphate leaves the cycle.', cite: [SHARKEY19] },
  { tag: 'Phosphoribulokinase (PRK)', say: 'Phosphoribulokinase (PRK) phosphorylates each ribulose-5-phosphate with ATP to ribulose-1,5-bisphosphate (RuBP), which RuBisCO binds: 3 ATP per 3 CO₂.', cite: [MICHELET13, SHARKEY19] },
  { tag: 'Per 3 CO₂', say: 'Per 3 CO₂, reduction takes 6 ATP and 6 NADPH, regeneration 3 ATP: the cycle needs ATP and NADPH in the ratio 9 : 6 = 3 : 2. <b>Where does the 1 triose phosphate go?</b>', cite: [SHARKEY19] },
];
