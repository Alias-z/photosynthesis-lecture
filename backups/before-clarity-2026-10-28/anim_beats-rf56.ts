// Captions and sources of the rf5 and rf6 animations (lecture 2, chunk rf; slides C5 RuBisCO: carboxylation and
// oxygenation, C6 Photorespiration). Scripts: research/redo-2026-10-28/reports/REPORT_rf.md, tightened by the animation
// builder (28 Oct 2026, night): every caption names its objects; "died in air" (the 1979 mutant turned pale and recovered
// in 1 % CO₂), "less CO₂ dissolves" (O₂ dissolves less too) and "more CO₂ took part of the loss back" (vague) are
// replaced by exact wording. A staging that tells the same facts in another order carries its own beats (types.ts).
import type { Beat, Cite } from './types';

const BUSCH24: Cite = { label: 'Busch et al. 2024, Plant Cell Environ.', url: 'https://doi.org/10.1111/pce.14815' };
const BOWES71: Cite = { label: 'Bowes, Ogren & Hageman 1971, Biochem. Biophys. Res. Commun.', url: 'https://doi.org/10.1016/0006-291X(71)90475-X' };
const FORR66: Cite = { label: 'Forrester, Krotkov & Nelson 1966, Plant Physiol.', url: 'https://doi.org/10.1104/pp.41.3.422' };
const JORDAN84: Cite = { label: 'Jordan & Ogren 1984, Planta', url: 'https://doi.org/10.1007/BF00398720' };
const FLAMHOLZ19: Cite = { label: 'Flamholz et al. 2019, Biochemistry', url: 'https://doi.org/10.1021/acs.biochem.9b00237' };
const ANDERSSON96: Cite = { label: 'Andersson 1996, J. Mol. Biol. (PDB 8RUC)', url: 'https://doi.org/10.1006/jmbi.1996.0310' };
const PETERH10: Cite = { label: 'Peterhänsel et al. 2010, Arabidopsis Book', url: 'https://doi.org/10.1199/tab.0130' };
const SOMERVILLE79: Cite = { label: 'Somerville & Ogren 1979, Nature', url: 'https://doi.org/10.1038/280833a0' };
const FN69: Cite = { label: 'Frederick & Newcomb 1969, J. Cell Biol.', url: 'https://doi.org/10.1083/jcb.43.2.343' };
const SAGE12: Cite = { label: 'Sage, Sage & Kocacinar 2012, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' };
const EB77: Cite = { label: 'Ehleringer & Björkman 1977, Plant Physiol.', url: 'https://doi.org/10.1104/pp.59.1.86' };

/* ---------------------------------------------------------------- C5 · RuBisCO: carboxylation and oxygenation */

const R5_CARBOX: Beat = { tag: 'Carboxylation', say: 'RuBisCO adds CO₂ to RuBP, giving 2 molecules of 3-PGA, which the chloroplast turns into sugar.', cite: [] };
const R5_OXY: Beat = { tag: 'Oxygenation', say: 'O₂ binds at the same active site of RuBisCO; oxygenation of RuBP gives 3-PGA and 2-phosphoglycolate, 1 molecule of each.', cite: [BOWES71] };
const R5_1966: Beat = { tag: '1966', say: '1966: soybean leaves took up less CO₂ the more O₂ they were given; at higher CO₂, O₂ cut uptake by a smaller fraction.', cite: [FORR66] };
const R5_TEMP: Beat = { tag: 'Temperature', say: 'In warmer leaves RuBisCO tells CO₂ from O₂ less well, and CO₂ dissolves less well relative to O₂: oxygenation rises relative to carboxylation.', cite: [JORDAN84] };
const R5_END: Beat = { tag: 'Why O₂?', say: 'Oxygenation makes 2-phosphoglycolate instead of a second 3-PGA. <b>Why has evolution not taught RuBisCO to ignore O₂?</b>', cite: [] };

/** Animation rf5, played from slide C5 (stagings rf5-a; the default order): zoom on RuBisCO, the structure, Forrester's
 *  soybean leaves, temperature, back out to 2-phosphoglycolate. */
export const RF5: Beat[] = [R5_CARBOX, R5_OXY, R5_1966, R5_TEMP, R5_END];

/** rf5-b, history first: the 1966 observation, its 1971 cause, then competition. */
export const RF5_HIST: Beat[] = [
  R5_1966,
  { tag: '1971', say: '1971: Bowes, Ogren and Hageman found the cause. RuBisCO also binds O₂ at its active site: oxygenation of RuBP gives 3-PGA and 2-phosphoglycolate.', cite: [BOWES71] },
  { tag: 'Competition', say: 'CO₂ binds at the same site, giving 2 molecules of 3-PGA. CO₂ and O₂ compete for it: the more CO₂, the fewer oxygenations per carboxylation.', cite: [FLAMHOLZ19] },
  R5_TEMP,
  R5_END,
];

/** rf5-c, structure first: inside the RuBisCO structure, then pulled back to the schema. */
export const RF5_STRUCT: Beat[] = [
  { ...R5_CARBOX, cite: [ANDERSSON96] },
  { ...R5_OXY, cite: [BOWES71, ANDERSSON96] },
  { tag: 'Competition', say: 'In a leaf at 25 °C, with ≈ 200 ppm CO₂ in the chloroplast, CO₂ and O₂ compete for this active site: about 2 oxygenations per 5 carboxylations.', cite: [FLAMHOLZ19, BUSCH24] },
  R5_TEMP,
  R5_END,
];

/** rf5-d, the hot leaf first: the modelled rise of photorespiration with temperature, then why, at RuBisCO. */
export const RF5_HOT: Beat[] = [
  { tag: 'Hot leaves', say: 'Modelled for a C₃ leaf: photorespiration rises relative to photosynthesis as the leaf warms, and falls as CO₂ rises. <b>What happens at RuBisCO?</b>', cite: [SAGE12] },
  R5_CARBOX,
  R5_OXY,
  R5_TEMP,
  R5_END,
];

/* ---------------------------------------------------------------- C6 · Photorespiration */

const R6_GLYCOLATE: Beat = { tag: 'Glycolate', say: 'The chloroplast turns 2-phosphoglycolate into glycolate and sends it to the peroxisome.', cite: [PETERH10] };
const R6_PEROX: Beat = { tag: 'Peroxisome', say: 'In the peroxisome, glycolate becomes glycine.', cite: [PETERH10] };
const R6_MITO: Beat = { tag: 'Mitochondrion', say: 'In the mitochondrion, two glycine make one serine; one carbon leaves as CO₂, and NH₃ is released.', cite: [PETERH10] };
const R6_BACK: Beat = { tag: 'Back to 3-PGA', say: 'Serine becomes glycerate in the peroxisome, and the chloroplast makes 3-PGA from it with ATP; NH₃ is refixed in the chloroplast with ATP and reduced ferredoxin.', cite: [PETERH10] };
const R6_1979: Beat = { tag: '1979', say: '1979: Somerville and Ogren found an <i>Arabidopsis</i> mutant that grew in 1 % CO₂ but turned pale in air: it could not make glycolate from 2-phosphoglycolate.', cite: [SOMERVILLE79, PETERH10] };
const R6_END: Beat = { tag: 'ATP and reductant', say: 'The Calvin–Benson–Bassham cycle and photorespiration both spend ATP and reductant from the light reactions. <b>How fast can light supply them?</b>', cite: [] };

/** Animation rf6, played from slide C6 (staging rf6-a; the default order): follow the carbon round the loop. */
export const RF6: Beat[] = [R6_GLYCOLATE, R6_PEROX, R6_MITO, R6_BACK, R6_1979, R6_END];

/** rf6-b, on the real micrograph: the same beats, with the micrograph's source. */
export const RF6_TEM: Beat[] = [
  { ...R6_GLYCOLATE, cite: [PETERH10, FN69] },
  { ...R6_PEROX, cite: [PETERH10, FN69] },
  { ...R6_MITO, cite: [PETERH10, FN69] },
  { ...R6_BACK, cite: [PETERH10, FN69] },
  R6_1979,
  R6_END,
];

/** rf6-d, the cost first: CO₂ fixed per photon in air vs 2 % O₂, then where the carbon goes. */
export const RF6_COST: Beat[] = [
  { tag: 'The cost', say: '1977: C₃ leaves at 30 °C fixed about 29 % less CO₂ per absorbed photon in air (21 % O₂) than in 2 % O₂. <b>Where does the carbon go?</b>', cite: [EB77] },
  R6_GLYCOLATE, R6_PEROX, R6_MITO, R6_BACK, R6_END,
];

/** rf6-c, history first: the 1979 mutant, then the loop it lacks. */
export const RF6_HIST: Beat[] = [R6_1979, R6_GLYCOLATE, R6_PEROX, R6_MITO, R6_BACK, R6_END];
