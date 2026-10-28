// Beats of the 'eff' animation (slide C4e · Efficiency of photosynthesis; EFFICIENCY_BRIEF.md, lecturer, 29 Oct 2026):
// 100 % of the solar energy on a C₃ leaf as a band from which each minimum loss peels off in order (Zhu, Long & Ort 2008,
// Fig. 1; 2010, Fig. 2 and text, read in full), ending at 4.6 % in biomass and the question C6 answers.
import type { Beat, Cite } from './types';

const ZHU08: Cite = { label: 'Zhu, Long & Ort 2008, Curr. Opin. Biotechnol.', url: 'https://doi.org/10.1016/j.copbio.2008.02.004' };
const ZHU10: Cite = { label: 'Zhu, Long & Ort 2010, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-042809-112206' };

export const EFF: Beat[] = [
  { tag: 'Sunlight', say: 'Of the solar energy reaching a leaf, 48.7 % lies in 400–700 nm, the photosynthetically active radiation (PAR); 51.3 % is outside it.', cite: [ZHU08, ZHU10] },
  { tag: 'Leaf and photochemistry', say: 'The leaf reflects and transmits ≈ 10 % of PAR: 4.9 %. Photochemistry runs at the energy of a red photon; the extra energy of blue photons is lost as heat: 6.6 %.', cite: [ZHU10] },
  { tag: 'Carbohydrate synthesis', say: 'At least 8 photons make the 3 ATP and 2 NADPH that fix 1 CO₂; the sugar keeps about a third of their energy: 24.6 % is lost.', cite: [ZHU10] },
  { tag: 'Photorespiration and respiration', say: 'Photorespiration takes 6.1 %, respiration 1.9 %: at most 4.6 % of the solar energy is stored in biomass (C₃, 30 °C). <b>Photorespiration takes a large share: why does RuBisCO’s oxygenation cost so much?</b>', cite: [ZHU08, ZHU10] },
];
