// Captions and sources of the ATP synthase animation on slide 10 (ETC_ANIM_BRIEF, 28 Oct 2026), stagings m1 and m2.
// Beat 3 has a click stop (Staging.holds): first the rotor and the head are named, then the H⁺ flow and ATP is made.
import type { Beat, Cite } from './types';

const KRAMER99: Cite = { label: 'Kramer, Sacksteder & Cruz 1999, Photosynth. Res.', url: 'https://doi.org/10.1023/A:1006212014787' };
const JAGENDORF66: Cite = { label: 'Jagendorf & Uribe 1966, PNAS', url: 'https://doi.org/10.1073/pnas.55.1.170' };
const HAHN18: Cite = { label: 'Hahn et al. 2018, Science', url: 'https://doi.org/10.1126/science.aat4318' };
const KRAMER11: Cite = { label: 'Kramer & Evans 2011, Plant Physiol.', url: 'https://doi.org/10.1104/pp.110.166652' };
const NOJI97: Cite = { label: 'Noji et al. 1997, Nature', url: 'https://doi.org/10.1038/386299a0' };

export const ATPSM: Beat[] = [
  { tag: 'Proton gradient', say: 'H⁺ from water splitting and from cytochrome b₆f collect in the lumen: it becomes more acidic than the stroma (about pH 6 against 8).', cite: [KRAMER99] },
  { tag: 'ATP in the dark', say: '1966, Jagendorf and Uribe soaked chloroplasts in acid, then moved them to a basic buffer with ADP and phosphate: they made ATP in the dark. The H⁺ gradient alone drives ATP synthesis.', cite: [JAGENDORF66] },
  { tag: 'The rotor', say: 'H⁺ flow back, down their gradient, through ATP synthase: the flow turns its rotor, and its head joins ADP + Pᵢ into ATP. 14 H⁺ make one turn and 3 ATP; the 12 H⁺ of one O₂ make ≈ 2.6.', cite: [HAHN18, NOJI97] },
  { tag: 'ATP : NADPH ratio', say: 'Per O₂ the chain makes 2 NADPH and ≈ 2.6 ATP. The 2 NADPH can fix 1 CO₂ into sugar, and the bread we eat, but that needs 3 ATP: 2 H⁺ short of 1 full turn. <b>Who supplies the missing ATP?</b>', cite: [HAHN18, KRAMER11] },
];
