// Beats of the 'cb1' staging k · carbon bookkeeping per 3 CO₂ (slide C1 · C₃ photosynthesis; EFFICIENCY_BRIEF.md,
// lecturer, 29 Oct 2026: "Why is 3 CO₂ the minimum?", "Why do 5 triose phosphates come back and only 1 is used?").
// The staging carries these beats itself (Staging.beats); staging s keeps CB1.
import type { Beat, Cite } from './types';

const SHARKEY19: Cite = { label: 'Sharkey 2019, Photosynth. Res.', url: 'https://doi.org/10.1007/s11120-018-0600-2' };
const BASSHAM54: Cite = { label: 'Bassham et al. 1954, J. Am. Chem. Soc.', url: 'https://doi.org/10.1021/ja01636a012' };

export const CB1K: Beat[] = [
  { tag: '18 C = 15 C + 3 C', say: '3 RuBP, the CO₂ acceptor, bring 15 C; 3 CO₂ bring 3 C. RuBisCO makes 6 3-PGA, and ATP and NADPH reduce them to 6 triose phosphates: 18 C, of which 3 C came from the air.', cite: [SHARKEY19] },
  { tag: 'Why 3 CO₂', say: 'Each RuBP to rebuild takes 5 C, from whole triose phosphates of 3 C. 1 CO₂: 5/3 = 1⅔ ✗. 2 CO₂: 10/3 = 3⅓ ✗. 3 CO₂: 15/3 = 5 ✓. 15 is the smallest common multiple of 3 and 5.', cite: [SHARKEY19] },
  { tag: '5 back, 1 out', say: '5 triose phosphates (15 C) rebuild 3 RuBP with 3 ATP; 1 triose phosphate (3 C) leaves the cycle: as much carbon as was fixed. The rearrangement mixes the atoms, so carbon from CO₂ also ends up in RuBP.', cite: [SHARKEY19, BASSHAM54] },
  { tag: 'Per 3 CO₂', say: 'The cycle uses 9 ATP and 6 NADPH per 3 CO₂ and makes none: ADP, Pᵢ and NADP⁺ go back to the thylakoid to be recharged. Per CO₂: 3 ATP + 2 NADPH. <b>Where does the 1 triose phosphate go?</b>', cite: [SHARKEY19] },
];
