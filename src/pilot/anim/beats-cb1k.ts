// Beats of the 'cb1' staging k · carbon bookkeeping per 3 CO₂ (slide C1 · C₃ photosynthesis; EFFICIENCY_BRIEF.md,
// lecturer, 29 Oct 2026: "Why is 3 CO₂ the minimum?", "Why do 5 triose phosphates come back and only 1 is used?").
// The staging carries these beats itself (Staging.beats); staging s keeps CB1.
import type { Beat, Cite } from './types';

const SHARKEY19: Cite = { label: 'Sharkey 2019, Photosynth. Res.', url: 'https://doi.org/10.1007/s11120-018-0600-2' };
const BASSHAM54: Cite = { label: 'Bassham et al. 1954, J. Am. Chem. Soc.', url: 'https://doi.org/10.1021/ja01636a012' };

export const CB1K: Beat[] = [
  { tag: '18 C = 15 C + 3 C', say: '3 RuBP, the CO₂ acceptor, bring 15 C; 3 CO₂ bring 3 C. RuBisCO makes 6 3-PGA; ATP phosphorylates them and NADPH reduces them to 6 triose phosphates: 18 C, of which 3 C came from the air.', cite: [SHARKEY19] },
  { tag: 'Why 3 CO₂', say: 'Each RuBP to rebuild takes 5 C, from whole triose phosphates of 3 C. 1 CO₂: 5/3 = 1⅔ ✗. 2 CO₂: 10/3 = 3⅓ ✗. 3 CO₂: 15/3 = 5 ✓. 15 is the smallest common multiple of 3 and 5.', cite: [SHARKEY19] },
  { tag: '5 back, 1 out', say: '5 triose phosphates (15 C) rebuild 3 RuBP with 3 ATP; 1 triose phosphate (3 C) leaves the cycle: as much carbon as was fixed. The rearrangement mixes the atoms, so carbon from CO₂ also ends up in RuBP.', cite: [SHARKEY19, BASSHAM54] },
  { tag: 'Per 3 CO₂', say: 'The cycle uses 9 ATP and 6 NADPH per 3 CO₂ and makes none: ADP, Pᵢ and NADP⁺ go back to the thylakoid to be recharged. Per CO₂: 3 ATP + 2 NADPH. <b>Where does the 1 triose phosphate go?</b>', cite: [SHARKEY19] },
];

/** Version 2 of the C1 animation, for staging k2 and variants p, q (lecturer, 29 Oct 2026, evening: "the carbon
 *  bookkeeping has no storyline", "reduce the animation of why 3; make the calculation clear and simple", "keep only the
 *  essential"). The discovery, then the 3 steps per 3 CO₂; why 3 in one line (3 RuBP = 15 C = 5 triose phosphates). */
const CALVIN61: Cite = { label: 'Calvin 1961, Nobel lecture', url: 'https://www.nobelprize.org/prizes/chemistry/1961/calvin/lecture/' };
export const CB1V2: Beat[] = [
  { tag: 'Carbon-14', say: 'Calvin, Benson and Bassham fed radioactive ¹⁴CO₂ to algae in light, then dropped them into alcohol to stop all reactions.', cite: [CALVIN61] },
  { tag: 'Carboxylation of RuBP', say: 'Within seconds, most of the ¹⁴C was in 3-PGA: RuBisCO adds CO₂ to RuBP, which splits into 2 3-PGA.', cite: [CALVIN61, BASSHAM54] },
  { tag: 'Reduction of 3-PGA', say: 'ATP phosphorylates 3-PGA and NADPH reduces it to triose phosphate.', cite: [SHARKEY19] },
  { tag: 'Regeneration of RuBP', say: '3 RuBP hold 15 C, exactly 5 triose phosphates. So per 3 CO₂, 5 of the 6 triose phosphates rebuild RuBP and 1 leaves the cycle.', cite: [SHARKEY19, BASSHAM54] },
  { tag: 'Per 3 CO₂', say: 'Per 3 CO₂ the cycle uses 9 ATP and 6 NADPH. <b>Where does the triose phosphate that leaves the cycle go?</b>', cite: [SHARKEY19] },
];

/** The story version (lecturer, 29 Oct 2026, evening): Calvin's spots to the simple cycle; then 3 CO₂ step by step in the
 *  strip, with the energy; then back to the simple cycle with the counts, why 3 CO₂ and the energy added up. */
export const CB1V3: Beat[] = [
  CB1V2[0],
  { tag: 'First product', say: 'Within seconds, most of the ¹⁴C was in 3-PGA: RuBisCO adds CO₂ to RuBP, which splits into 2 3-PGA.', cite: [CALVIN61, BASSHAM54] },
  { tag: 'The cycle', say: 'The order in which compounds took up ¹⁴C traced the path, and it closes into a cycle: carboxylation of RuBP, reduction of 3-PGA, regeneration of RuBP.', cite: [BASSHAM54] },
  { tag: 'Carboxylation of RuBP', say: 'Now per 3 CO₂: RuBisCO adds 3 CO₂ to 3 RuBP, giving 6 3-PGA.', cite: [SHARKEY19] },
  { tag: 'Reduction of 3-PGA', say: 'ATP and NADPH turn the 6 3-PGA into 6 triose phosphates; the spent ADP, Pᵢ and NADP⁺ go back to the thylakoid.', cite: [SHARKEY19] },
  { tag: 'Regeneration of RuBP', say: '5 triose phosphates and 3 ATP rebuild 3 RuBP; 1 triose phosphate leaves the cycle.', cite: [SHARKEY19] },
  { tag: 'Why 3 CO₂', say: '3 RuBP hold 15 C, exactly 5 triose phosphates, so 3 CO₂ is the smallest number that lets 1 whole triose phosphate leave. <b>Where does the triose phosphate that leaves the cycle go?</b>', cite: [SHARKEY19] },
];

