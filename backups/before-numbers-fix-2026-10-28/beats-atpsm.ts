// Captions and sources of the ATP synthase animation on slide 10 (ETC_ANIM_BRIEF, 28 Oct 2026), stagings m1 and m2.
// Beat 3 has a click stop (Staging.holds): first the rotor and the head are named, then the H⁺ flow and ATP is made.
import type { Beat, Cite } from './types';

const KRAMER99: Cite = { label: 'Kramer, Sacksteder & Cruz 1999, Photosynth. Res.', url: 'https://doi.org/10.1023/A:1006212014787' };
const JAGENDORF66: Cite = { label: 'Jagendorf & Uribe 1966, PNAS', url: 'https://doi.org/10.1073/pnas.55.1.170' };
const HAHN18: Cite = { label: 'Hahn et al. 2018, Science', url: 'https://doi.org/10.1126/science.aat4318' };
const NOJI97: Cite = { label: 'Noji et al. 1997, Nature', url: 'https://doi.org/10.1038/386299a0' };

export const ATPSM: Beat[] = [
  { tag: 'Proton gradient', say: 'H⁺ from water splitting and from cytochrome b₆f collect in the lumen: it becomes more acidic than the stroma (about pH 6 against 8).', cite: [KRAMER99] },
  { tag: 'ATP in the dark', say: '1966, Jagendorf and Uribe soaked chloroplasts in acid, then moved them to a basic buffer with ADP: they made ATP in the dark. The H⁺ gradient alone drives ATP synthesis.', cite: [JAGENDORF66] },
  { tag: 'The rotor', say: 'H⁺ flow back, down their gradient, through ATP synthase: the flow turns its rotor, and its head joins ADP + Pᵢ into ATP. 14 H⁺ make one turn and 3 ATP.', cite: [HAHN18, NOJI97] },
  { tag: 'NADPH and ATP', say: 'Light has made NADPH and ATP in the stroma. <b>Does the chain make them in the right ratio?</b>', cite: [HAHN18] },
];
