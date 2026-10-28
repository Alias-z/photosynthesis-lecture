// Beats of the C2 story, version 2 (key 'c2story', played from slide C2; lecturer, 28–29 Oct 2026; brief
// research/redo-2026-10-29/C2STORY_V2_BRIEF.md). Beat 1 names both reactions at the balance; beats 2–9 are RuBisCO
// through Earth's history (dk-c2story.ts). Every value marked ≈ is a rounded published value.
//
// The readout ("calculated", c2story-model.ts): oxygenations per 100 carboxylations = 100 × 2Γ*/C꜀ (von Caemmerer &
// Farquhar 1981); Γ* = exp(19.02 − 37.83/(R·T)) ppm (Bernacchi et al. 2001), × O₂/20.95 %; C꜀ = (200/427) × Cₐ; net CO₂
// fixed = 100 − ½ × oxygenations; leaf temperature = 25 °C + ΔGMST (change in global mean surface temperature from
// 1850–1900). Values at each beat's time point (data: c2story-data.ts):
//   ≈ 3 billion years ago: O₂ < 10⁻⁶ of today → 0 · net 100 (no temperature record; it does not matter: Γ* ≈ 0)
//   Great Oxidation Event: O₂ ≤ 0.1 % of today → < 1 (0.07 even at 278 ppm CO₂) · net 100
//   300 million years ago: CO₂ 409 ppm, O₂ 29.9 %, ΔGMST +3.5 °C (PhanDA) → leaf 28.5 °C → 76 · net 62
//   100 million years ago: CO₂ 862 ppm, O₂ 24.1 %, ΔGMST +17.8 °C → leaf 42.8 °C → 58 · net 71 (24 at 25 °C)
//   20,000 years ago: CO₂ 190 ppm (Bereiter 2015), ΔGMST −6.1 °C (Snyder 2016; Tierney 2020: −6.1) → leaf 18.9 °C → 70 · net 65
//   1750: CO₂ 278.3 ppm, ΔGMST 0.0 °C → 66 · net 67
//   2026: CO₂ 429.55 ppm (September, seasonally adjusted) at 25 °C → 43 · net 79 (CO₂ effect ↓ 23); ΔGMST +1.49 °C
//   (HadCRUT5, January–September 2026) → leaf 26.5 °C → 46 · net 77 (temperature effect ↑ 3; net ↓ 20 since 1750);
//   hot day, leaf 35 °C → 70 · net 65 (↑ 24); dry, C꜀/Cₐ 0.35 → 94 · net 53 (↑ 24; 28 more than in 1750)
import type { Beat, Cite } from './types';

const BOWES71: Cite = { label: 'Bowes et al. 1971', url: 'https://doi.org/10.1016/0006-291X(71)90475-X' };
const VCF81: Cite = { label: 'von Caemmerer & Farquhar 1981, Planta', url: 'https://doi.org/10.1007/BF00384257' };
const BERNACCHI01: Cite = { label: 'Bernacchi et al. 2001, Plant Cell Environ.', url: 'https://doi.org/10.1111/j.1365-3040.2001.00668.x' };
const BERNACCHI01S: Cite = { label: 'Bernacchi et al. 2001', url: 'https://doi.org/10.1111/j.1365-3040.2001.00668.x' };
const CATLING20: Cite = { label: 'Catling & Zahnle 2020, Sci. Adv.', url: 'https://doi.org/10.1126/sciadv.aax1420' };
const ALLWOOD06: Cite = { label: 'Allwood et al. 2006, Nature', url: 'https://doi.org/10.1038/nature04764' };
const POULTON21: Cite = { label: 'Poulton et al. 2021, Nature', url: 'https://doi.org/10.1038/s41586-021-03393-7' };
const MORRIS18: Cite = { label: 'Morris et al. 2018, PNAS', url: 'https://doi.org/10.1073/pnas.1719588115' };
const FOSTER17: Cite = { label: 'Foster et al. 2017, Nat. Commun.', url: 'https://doi.org/10.1038/ncomms14845' };
const SCHACHAT18: Cite = { label: 'Schachat et al. 2018, Proc. R. Soc. B', url: 'https://doi.org/10.1098/rspb.2017.2631' };
const JUDD24: Cite = { label: 'Judd et al. 2024, Science', url: 'https://doi.org/10.1126/science.adk3705' };
const MARTINEZ11: Cite = { label: 'Martínez et al. 2011, Science', url: 'https://doi.org/10.1126/science.1198467' };
const BEREITER15: Cite = { label: 'Bereiter et al. 2015, Geophys. Res. Lett.', url: 'https://doi.org/10.1002/2014GL061957' };
const SNYDER16: Cite = { label: 'Snyder 2016, Nature', url: 'https://doi.org/10.1038/nature19798' };
const TIERNEY20: Cite = { label: 'Tierney et al. 2020, Nature', url: 'https://doi.org/10.1038/s41586-020-2617-x' };
const LARSON14: Cite = { label: 'Larson et al. 2014, PNAS', url: 'https://doi.org/10.1073/pnas.1323964111' };
const OSMAN21: Cite = { label: 'Osman et al. 2021, Nature', url: 'https://doi.org/10.1038/s41586-021-03984-4' };
const IPCC21: Cite = { label: 'IPCC AR6 WG1, Ch. 2', url: 'https://doi.org/10.1017/9781009157896.004' };
const NOAA: Cite = { label: 'NOAA GML', url: 'https://gml.noaa.gov/ccgg/trends/' };
const HADCRUT5: Cite = { label: 'Morice et al. 2021 (HadCRUT5)', url: 'https://doi.org/10.1029/2019JD032361' };
const WHITNEY01: Cite = { label: 'Whitney et al. 2001', url: 'https://doi.org/10.1046/j.1365-313x.2001.01056.x' };
const LIN14: Cite = { label: 'Lin et al. 2014', url: 'https://doi.org/10.1038/nature13776' };
const OCCHIALINI16: Cite = { label: 'Occhialini et al. 2016', url: 'https://doi.org/10.1111/tpj.13098' };
const SOUTH19: Cite = { label: 'South et al. 2019', url: 'https://doi.org/10.1126/science.aat9077' };
const MCDONALD26: Cite = { label: 'McDonald et al. 2026', url: 'https://doi.org/10.1126/sciadv.aeh3246' };

/** Beat 1: the balance, both reactions named. */
const INTRO: Beat = { tag: 'RuBisCO', say: 'RuBisCO (ribulose-1,5-bisphosphate carboxylase/oxygenase) adds CO₂ (carboxylation) or O₂ (oxygenation) to ribulose-1,5-bisphosphate (RuBP). How often it takes O₂ depends on CO₂, O₂ and temperature.', cite: [BOWES71, VCF81, BERNACCHI01] };

/** RuBisCO through Earth's history. */
const HISTORY: Beat[] = [
  { tag: '≈ 3 billion years ago', say: 'RuBisCO evolved in an ocean world of single cells, under air with much CO₂ and almost no O₂: every reaction was a carboxylation of RuBP.', cite: [CATLING20, ALLWOOD06] },
  { tag: 'Great Oxidation Event', say: '≈ 2.4 billion years ago, O₂ from cyanobacteria began to build up in the air. RuBisCO now met O₂, but oxygenation of RuBP stayed rare.', cite: [POULTON21, CATLING20] },
  { tag: 'Plants on land', say: 'Plants reached land ≈ 470 million years ago. In the forests of the Carboniferous, O₂ rose to ≈ 30 % and CO₂ fell: oxygenation of RuBP became frequent.', cite: [MORRIS18, FOSTER17, SCHACHAT18, JUDD24] },
  { tag: 'Dinosaurs', say: 'Dinosaurs lived from ≈ 230 to 66 million years ago. 100 million years ago CO₂ was high, but Earth was ≈ 18 °C warmer: in the calculation, the heat cancels most of the CO₂ benefit.', cite: [MARTINEZ11, FOSTER17, JUDD24] },
  { tag: 'Ice ages and early humans', say: 'At the last glacial maximum, ≈ 20,000 years ago, CO₂ was ≈ 190 parts per million (ppm), but Earth was ≈ 6 °C colder: the cold offsets most of the low-CO₂ effect.', cite: [BEREITER15, SNYDER16, TIERNEY20] },
  { tag: 'Farming', say: 'Farming began ≈ 12,000 years ago, in air with ≈ 260–280 ppm CO₂.', cite: [LARSON14, BEREITER15, OSMAN21] },
  { tag: 'Industry to today', say: 'Since 1750, fossil fuels and land clearing have raised CO₂ from 278 to 429.6 ppm (September 2026): oxygenation fell. Warming (+1.5 °C) raises it a little; a hot, dry day lifts it above the 1750 level.', cite: [IPCC21, NOAA, HADCRUT5, BERNACCHI01S] },
  { tag: 'A better RuBisCO?', say: 'Plant scientists try to replace or evolve RuBisCO, or to bypass photorespiration. <b>How does the leaf turn 3-phosphoglycerate (3-PGA) into sugar?</b>', cite: [WHITNEY01, LIN14, OCCHIALINI16, SOUTH19, MCDONALD26] },
];

export const C2STORY: Beat[] = [INTRO, ...HISTORY];
