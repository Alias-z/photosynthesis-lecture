// Beats of the rf chunk's animations rf7 (slide C7, light-response curve) and rf8 (slide C8, FvCB model), overnight
// build of 28 Oct 2026. The scripts of research/redo-2026-10-28/reports/REPORT_rf.md, tightened (rf-anim-b REPORT.md):
// - rf7: the light ramps up once, 0 → 2000 µmol m⁻² s⁻¹ (darkness, compensation point, quantum yield, saturation), in
//   the order of the slide's points, instead of jumping back from 500 to 0; "sun leaves of the same plant" corrected to
//   plants grown in 95 % and 28 % of sunlight (Huang et al. 2014, Methods).
// - rf8: one limit per beat, each named as on the slide (A_c, A_j, A_p).
// Numbers in the captions, and where they come from:
// - tobacco grown in 95 % vs 28 % of sunlight: light-saturated net CO₂ uptake ≈ 22 vs ≈ 13 µmol m⁻² s⁻¹ (21.8, 13.1),
//   light compensation point 32 vs 20 µmol m⁻² s⁻¹ (Huang, Zhang & Hu 2014, Fig. 1C, Table 1);
// - spinach at 0.017, 0.030, 0.061 and 0.101–0.148 % CO₂ (Gaastra 1959, Fig. 12A);
// - typical Cᵢ of a C₃ leaf at 25 °C ≈ 300 µmol mol⁻¹ (Busch et al. 2024, Table 1);
// - the switch from A_c to A_j at Cᵢ ≈ 320 ppm in the lecturer's wheat curve (Zhang 2021, MSc thesis, Fig. 5; no link,
//   credited on the curve panel instead).
import type { Beat, Cite } from './types';

const HUANG14: Cite = { label: 'Huang, Zhang & Hu 2014, Front. Plant Sci.', url: 'https://doi.org/10.3389/fpls.2014.00688' };
const EB77: Cite = { label: 'Ehleringer & Björkman 1977, Plant Physiol.', url: 'https://doi.org/10.1104/pp.59.1.86' };
const BUSCH24: Cite = { label: 'Busch et al. 2024, Plant Cell Environ.', url: 'https://doi.org/10.1111/pce.14815' };
const GAASTRA59: Cite = { label: 'Gaastra 1959, Meded. Landbouwhogeschool Wageningen', url: 'https://edepot.wur.nl/291215' };
const FVCB80: Cite = { label: 'Farquhar, von Caemmerer & Berry 1980, Planta', url: 'https://doi.org/10.1007/BF00386231' };
const SHARKEY85: Cite = { label: 'Sharkey 1985, Plant Physiol.', url: 'https://doi.org/10.1104/pp.78.1.71' };

const sub = (s: string): string => `<sub>${s}</sub>`;
const Ci = '<i>C</i>ᵢ';

/** Animation rf7, played from slide C7: the light rises from darkness to full sun on the schema with the light reactions'
 *  supply lit; a light readout and the light-response curve of tobacco sun leaves react from the first frame. */
export const RF7: Beat[] = [
  { tag: 'Darkness', say: 'In darkness, the thylakoids make no ATP or NADPH, and the leaf only releases CO₂, by respiration in its mitochondria.', cite: [HUANG14] },
  { tag: 'Light compensation point', say: 'In dim light, the CO₂ that RuBisCO fixes balances the CO₂ released by respiration and photorespiration: the light compensation point.', cite: [HUANG14] },
  { tag: 'Quantum yield', say: 'More light, more ATP and NADPH to regenerate RuBP: CO₂ uptake rises linearly with light. The slope, CO₂ taken up per photon, is the quantum yield.', cite: [EB77] },
  { tag: 'Light saturation', say: 'In bright light, the cycle cannot use all the ATP and NADPH the thylakoids could make: CO₂ uptake levels off at the leaf’s capacity.', cite: [HUANG14] },
  { tag: 'Sun and shade', say: 'Tobacco grown in 28 % of sunlight levels off at lower light and lower uptake than tobacco grown in 95 %: ≈ 13 vs ≈ 22 µmol CO₂ m⁻² s⁻¹.', cite: [HUANG14] },
  { tag: 'Which limit?', say: '<b>In bright light, which step of the cycle sets the limit, and does that change with CO₂?</b>', cite: [] },
];
/** The same, with Gaastra's 1959 light curves at four CO₂ levels in beat 5 (staging rf7 B). */
export const RF7_GAASTRA: Beat[] = [
  ...RF7.slice(0, 4),
  { tag: 'More CO₂', say: '1959, Gaastra: spinach leaves measured at four CO₂ levels, from 0.017 to 0.15 %. Each rise in CO₂ raised the level at which uptake levels off.', cite: [GAASTRA59] },
  RF7[5],
];

/** Animation rf8, played from slide C8: Cᵢ rises on the schema; each FvCB limit is lit in turn as the curve's dot reaches
 *  it; a Cᵢ readout and the A/Cᵢ curve react from the first frame. */
export const RF8: Beat[] = [
  { tag: `RuBisCO limit, <i>A</i>${sub('c')}`, say: `At low ${Ci}, RuBisCO has RuBP to spare but too little CO₂: uptake rises steeply with CO₂. The maximum carboxylation rate of active RuBisCO, <i>V</i>${sub('cmax')}, sets this rate.`, cite: [FVCB80] },
  { tag: 'Today’s air', say: `In today’s air, ${Ci} ≈ 300 ppm: the leaf works near the switch from the RuBisCO limit to the next one.`, cite: [BUSCH24] },
  { tag: `RuBP-regeneration limit, <i>A</i>${sub('j')}`, say: `At higher ${Ci}, RuBP regeneration, not RuBisCO, limits carboxylation. Regenerating RuBP needs ATP and NADPH, so the electron transport rate, <i>J</i>, sets uptake.`, cite: [FVCB80] },
  { tag: `TPU limit, <i>A</i>${sub('p')}`, say: `At very high ${Ci}, sucrose and starch synthesis cannot use triose phosphate any faster, so too little Pᵢ returns to make ATP: uptake stops rising.`, cite: [SHARKEY85] },
  { tag: 'FvCB model', say: 'CO₂ uptake follows the lowest of the 3 rates. 1980: Farquhar, von Caemmerer and Berry; 1985: Sharkey added triose-phosphate use. <b>How do we measure a leaf’s CO₂ uptake, and the CO₂ inside it?</b>', cite: [FVCB80, SHARKEY85] },
];
