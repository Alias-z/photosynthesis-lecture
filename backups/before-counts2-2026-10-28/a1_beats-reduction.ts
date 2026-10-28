// Beats of the 'reduction' animation (slide C3 · Reduction; C₃ photosynthesis step by step, one step per slide, as for the
// electron transport chain; lecturer, 28 Oct 2026). Counts per 3 CO₂. Leads into C3b · Regeneration.
import type { Beat, Cite } from './types';

const SHARKEY19: Cite = { label: 'Sharkey 2019, Photosynth. Res.', url: 'https://doi.org/10.1007/s11120-018-0600-2' };
const NOBEL15: Cite = { label: 'Calvin 1961, Nobel lecture, Fig. 15 (Bassham’s data)', url: 'https://www.nobelprize.org/prizes/chemistry/1961/calvin/lecture/' };

export const REDUCTION: Beat[] = [
  { tag: 'Phosphoglycerate kinase', say: 'ATP phosphorylates 3-phosphoglycerate (3-PGA): 6 ATP per 3 CO₂.', cite: [SHARKEY19] },
  { tag: 'GAPDH', say: 'Glyceraldehyde-3-phosphate dehydrogenase (GAPDH) reduces it with NADPH to triose phosphate: 6 NADPH per 3 CO₂.', cite: [SHARKEY19] },
  { tag: 'Light off: 3-PGA accumulates', say: 'Bassham switched off the light on <i>Chlorella</i>: without ATP and NADPH, 3-PGA piled up within a minute. <b>What happens to the 6 triose phosphates?</b>', cite: [NOBEL15] },
];
