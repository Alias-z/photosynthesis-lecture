// Beats of the slide 7 animation in the 7m1 glyph style (stagings psii-m1, psii-m2; script ETC_ANIM_BRIEF.md "psii",
// lecturer, 28 Oct 2026). Point, then do: each part is named by a leader and glows before it acts.
import type { Beat, Cite } from './types';

const SHEVELA23: Cite = { label: 'Shevela et al. 2023, Photosynth. Res.', url: 'https://doi.org/10.1007/s11120-022-00991-y' };
const RUBEN41: Cite = { label: 'Ruben, Randall, Kamen & Hyde 1941, J. Am. Chem. Soc. 63: 877', url: 'https://doi.org/10.1021/ja01848a512' };

/** Animation 7, played from slide 7: charge separation, the water-or-CO₂ test, water splitting, plastoquinol. */
export const PSIIM: Beat[] = [
  { tag: 'Charge separation', say: 'The reaction centre uses the energy to send an electron across the membrane, to plastoquinone. <b>Where does it get a new electron?</b>', cite: [SHEVELA23] },
  { tag: 'Water or CO₂?', say: '1941, Ruben and Kamen labelled the algae’s water or their CO₂ with the oxygen isotope ¹⁸O. Only ¹⁸O from water came out as O₂: the O₂, and the electrons, come from water.', cite: [RUBEN41] },
  { tag: 'Water splitting', say: 'Photosystem II splits water: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. The electrons refill the reaction centre; the H⁺ stay in the lumen.', cite: [SHEVELA23] },
  { tag: 'Plastoquinol', say: 'Plastoquinone takes two electrons and two H⁺ from the stroma and, as plastoquinol (PQH₂), carries them on in the membrane. <b>Where do they go next?</b>', cite: [SHEVELA23] },
];
