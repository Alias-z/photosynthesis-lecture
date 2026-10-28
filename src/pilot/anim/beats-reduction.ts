// Beats of the 'reduction' animation (slide C3 · Reduction of 3-PGA to triose phosphate; C₃ photosynthesis step by step,
// one step per slide; lecturer, 28 Oct 2026). Counted per 1 CO₂, the smallest whole unit (DARK_COUNTS_BRIEF.md): the
// inputs first, ATP and NADPH bound together. Leads into C3b · Regeneration of RuBP.
import type { Beat, Cite } from './types';

const SHARKEY19: Cite = { label: 'Sharkey 2019, Photosynth. Res.', url: 'https://doi.org/10.1007/s11120-018-0600-2' };
const NOBEL15: Cite = { label: 'Calvin 1961, Nobel lecture, Fig. 15 (Bassham’s data)', url: 'https://www.nobelprize.org/prizes/chemistry/1961/calvin/lecture/' };

export const REDUCTION: Beat[] = [
  { tag: 'Per 1 CO₂', say: 'RuBisCO adds 1 CO₂ to 1 RuBP, giving 2 molecules of 3-phosphoglycerate (3-PGA).', cite: [SHARKEY19] },
  { tag: 'ATP and NADPH', say: 'Each 3-PGA takes 1 ATP and 1 NADPH: phosphoglycerate kinase and glyceraldehyde-3-phosphate dehydrogenase (GAPDH) reduce it to triose phosphate. Per CO₂: 2 ATP and 2 NADPH.', cite: [SHARKEY19] },
  { tag: 'Light off: 3-PGA accumulates', say: 'Bassham switched off the light on <i>Chlorella</i>: without ATP and NADPH, 3-PGA piled up within a minute. <b>What happens to the triose phosphates?</b>', cite: [NOBEL15] },
];
