// Captions and sources of the "RuBisCO through Earth's history" animation (slide C5a, lecturer 28 Oct 2026; staging in
// dk-history.ts). Concept level: carboxylations and oxygenations at RuBisCO's active site as the air changes. On-screen
// numbers: Bouvier et al. 2024 (≈ 3 billion years; CO₂ ≥ 100 × today, O₂ ≤ 0.1 % of today), Poulton et al. 2021 (≈ 2.4
// billion years ago), IPCC AR6 WG1 Ch. 2 (≈ 190 ppm at the last glacial maximum; 278 ppm in 1750), NOAA GML (427 ppm in
// 2025); oxygenations per 100 carboxylations are calculated (FvCB, 100 × 2Γ*/C꜀, Γ* after Bernacchi et al. 2001,
// C꜀ = 200/427 × air CO₂ at 25 °C, as slide C5a v7; 70 at 35 °C with C꜀ = 200 ppm).
import type { Beat, Cite } from './types';

const BOUVIER24: Cite = { label: 'Bouvier, Emms & Kelly 2024, PNAS', url: 'https://doi.org/10.1073/pnas.2321050121' };
const POULTON21: Cite = { label: 'Poulton et al. 2021, Nature', url: 'https://doi.org/10.1038/s41586-021-03393-7' };
const BEREITER15: Cite = { label: 'Bereiter et al. 2015, Geophys. Res. Lett. (ice cores)', url: 'https://doi.org/10.1002/2014GL061957' };
const IPCC21: Cite = { label: 'IPCC AR6 WG1, Ch. 2', url: 'https://doi.org/10.1017/9781009157896.004' };
const NOAA: Cite = { label: 'NOAA GML, Mauna Loa', url: 'https://gml.noaa.gov/ccgg/trends/' };
const BERNACCHI01: Cite = { label: 'Bernacchi et al. 2001, Plant Cell Environ. (Γ*)', url: 'https://doi.org/10.1111/j.1365-3040.2001.00668.x' };
const JORDAN84: Cite = { label: 'Jordan & Ogren 1984, Planta', url: 'https://doi.org/10.1007/BF00398720' };
const WHITNEY01: Cite = { label: 'Whitney et al. 2001, Plant J.', url: 'https://doi.org/10.1046/j.1365-313x.2001.01056.x' };
const OCCHIALINI16: Cite = { label: 'Occhialini et al. 2016, Plant J.', url: 'https://doi.org/10.1111/tpj.13098' };
const MCDONALD26: Cite = { label: 'McDonald et al. 2026, Sci. Adv.', url: 'https://doi.org/10.1126/sciadv.aeh3246' };

export const HISTORY: Beat[] = [
  { tag: '3 billion years ago', say: 'RuBisCO evolved ≈ 3 billion years ago, in air with much CO₂ and almost no O₂: every RuBP it bound was carboxylated.', cite: [BOUVIER24] },
  { tag: 'Great Oxidation Event', say: '≈ 2.4 billion years ago, O₂ began to build up in the air. O₂ binds at the same active site, and some RuBP is oxygenated.', cite: [POULTON21] },
  { tag: 'Ice ages', say: 'In the ice ages, CO₂ fell to ≈ 190 ppm, and oxygenations were frequent.', cite: [BEREITER15, IPCC21, BERNACCHI01] },
  { tag: 'Industry and warming', say: 'Since 1750, CO₂ has risen from 278 to 427 ppm, and oxygenations have fallen. Warming raises them again: RuBisCO’s affinity for CO₂ falls, and in water CO₂ solubility falls more than O₂ solubility.', cite: [IPCC21, NOAA, JORDAN84, BERNACCHI01] },
  { tag: 'A better RuBisCO?', say: 'A more specific or faster RuBisCO has not yet worked in a crop. <b>How does the leaf turn 3-PGA into sugar?</b>', cite: [WHITNEY01, OCCHIALINI16, MCDONALD26] },
];
