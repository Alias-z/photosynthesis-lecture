// Beats of the C2 story (key 'c2story', played from slide C2; lecturer, 28 Oct 2026; brief
// research/redo-2026-10-28/C2_STORY_BRIEF.md, scope change of the same day: no Part 1, C0 already shows 3-PGA → sugar →
// bread). Beat 1 is a short intro at the corner RuBisCO; beats 2–9 are RuBisCO through Earth's history (dk-c2story.ts).
// Values marked ≈ in the captions are rounded published values; none is left unchecked (fact table in the rb report).
//
// The readout ("calculated", leaf at 25 °C unless stated): oxygenations per 100 carboxylations = 100 × 2Γ*/C꜀ (FvCB),
// with Γ* = Bernacchi et al. 2001 at 25 °C (42.9 ppm; 70.4 ppm at 35 °C) scaled with O₂ (Γ* ∝ O₂: × O₂ / 20.95 %), and
// C꜀ = (200/427) × Cₐ (the deck's rule: 200 ppm in the chloroplast at 427 ppm in the air). Net CO₂ fixed per 100
// carboxylations = 100 − ½ × oxygenations (each oxygenation releases ½ CO₂ in photorespiration). Values at each beat's
// time point:
//   ≈ 3 billion years ago: O₂ < 10⁻⁶ of today → 0 · net 100
//   after the Great Oxidation Event (2.2 billion years ago): O₂ ≤ 0.02 % (≤ 0.1 % of today), CO₂ ≥ 10 × today → < 1 · net ≈ 100
//   300 million years ago: CO₂ 409 ppm (Foster 2017), O₂ 29.9 % (GEOCARBSULF) → 64 · net 68
//   100 million years ago: CO₂ 862 ppm, O₂ 24.1 % → 24 · net 88
//   last glacial maximum: CO₂ 190 ppm (IPCC AR6), O₂ 20.95 % → 96 · net 52
//   1750: CO₂ 278 ppm → 66 · net 67
//   Sep 2026: CO₂ 429.6 ppm (NOAA Mauna Loa, seasonally adjusted) → 43 · net 79; at 35 °C → 70 · net 65
import type { Beat, Cite } from './types';

const CATLING20: Cite = { label: 'Catling & Zahnle 2020, Sci. Adv. (Archean atmosphere)', url: 'https://doi.org/10.1126/sciadv.aax1420' };
const ALLWOOD06: Cite = { label: 'Allwood et al. 2006, Nature (stromatolites, 3.43 billion years)', url: 'https://doi.org/10.1038/nature04764' };
const POULTON21: Cite = { label: 'Poulton et al. 2021, Nature', url: 'https://doi.org/10.1038/s41586-021-03393-7' };
const MORRIS18: Cite = { label: 'Morris et al. 2018, PNAS (land plants)', url: 'https://doi.org/10.1073/pnas.1719588115' };
const FOSTER17: Cite = { label: 'Foster, Royer & Lunt 2017, Nat. Commun. (CO₂)', url: 'https://doi.org/10.1038/ncomms14845' };
const SCHACHAT18: Cite = { label: 'Schachat et al. 2018, Proc. R. Soc. B (GEOCARBSULF O₂)', url: 'https://doi.org/10.1098/rspb.2017.2631' };
const NEL18: Cite = { label: 'Nel et al. 2018, Sci. Rep. (Meganeura)', url: 'https://doi.org/10.1038/s41598-018-30629-w' };
const MARTINEZ11: Cite = { label: 'Martínez et al. 2011, Science (early dinosaurs)', url: 'https://doi.org/10.1126/science.1198467' };
const COIRO19: Cite = { label: 'Coiro, Doyle & Hilton 2019, New Phytol. (first flowering plants)', url: 'https://doi.org/10.1111/nph.15708' };
const HARMAND15: Cite = { label: 'Harmand et al. 2015, Nature (stone tools)', url: 'https://doi.org/10.1038/nature14464' };
const BEREITER15: Cite = { label: 'Bereiter et al. 2015, Geophys. Res. Lett. (ice cores)', url: 'https://doi.org/10.1002/2014GL061957' };
const IPCC21: Cite = { label: 'IPCC AR6 WG1, Ch. 2', url: 'https://doi.org/10.1017/9781009157896.004' };
const LARSON14: Cite = { label: 'Larson et al. 2014, PNAS (domestication)', url: 'https://doi.org/10.1073/pnas.1323964111' };
const NOAA: Cite = { label: 'NOAA GML, Mauna Loa (to September 2026)', url: 'https://gml.noaa.gov/ccgg/trends/' };
const BOWES71: Cite = { label: 'Bowes, Ogren & Hageman 1971, Biochem. Biophys. Res. Commun.', url: 'https://doi.org/10.1016/0006-291X(71)90475-X' };
const BERNACCHI01: Cite = { label: 'Bernacchi et al. 2001, Plant Cell Environ. (Γ*)', url: 'https://doi.org/10.1111/j.1365-3040.2001.00668.x' };
const WHITNEY01: Cite = { label: 'Whitney et al. 2001, Plant J.', url: 'https://doi.org/10.1046/j.1365-313x.2001.01056.x' };
const OCCHIALINI16: Cite = { label: 'Occhialini et al. 2016, Plant J.', url: 'https://doi.org/10.1111/tpj.13098' };
const MCDONALD26: Cite = { label: 'McDonald et al. 2026, Sci. Adv.', url: 'https://doi.org/10.1126/sciadv.aeh3246' };

/** Beat 1: the corner RuBisCO, 1 carboxylation and 1 oxygenation. */
const INTRO: Beat = { tag: 'RuBisCO', say: 'RuBisCO (ribulose-1,5-bisphosphate carboxylase/oxygenase) binds ribulose-1,5-bisphosphate (RuBP), then CO₂ (carboxylation of RuBP) or O₂ (oxygenation of RuBP). How often it takes O₂ depends on the air.', cite: [BOWES71] };

/** Part 2: RuBisCO through Earth's history. */
const PART2: Beat[] = [
  { tag: '≈ 3 billion years ago', say: 'RuBisCO evolved in an ocean world of single cells, under air with much CO₂ and almost no O₂: every binding was a carboxylation of RuBP.', cite: [CATLING20, ALLWOOD06] },
  { tag: 'Great Oxidation Event', say: '≈ 2.4 billion years ago, O₂ from cyanobacteria began to build up in the air. RuBisCO now met O₂, but oxygenation of RuBP stayed rare.', cite: [POULTON21, CATLING20] },
  { tag: 'Plants on land', say: 'Plants reached land ≈ 470 million years ago. In the forests of the Carboniferous, O₂ rose to ≈ 30 % and CO₂ fell: oxygenation of RuBP became frequent.', cite: [MORRIS18, FOSTER17, SCHACHAT18, NEL18] },
  { tag: 'Dinosaurs', say: 'In the age of the dinosaurs, from ≈ 230 million years ago, CO₂ was high again: oxygenation of RuBP was rare. The first flowering plants appeared ≈ 135 million years ago.', cite: [MARTINEZ11, COIRO19, FOSTER17] },
  { tag: 'Ice ages and early humans', say: 'Humans made stone tools from 3.3 million years ago. In the ice ages, CO₂ fell to ≈ 190 parts per million (ppm): almost 1 oxygenation of RuBP per carboxylation.', cite: [HARMAND15, BEREITER15, IPCC21, BERNACCHI01] },
  { tag: 'Farming', say: 'Farming began ≈ 12,000 years ago, in air with ≈ 260–280 ppm CO₂.', cite: [LARSON14, BEREITER15] },
  { tag: 'Industry to today', say: 'Since 1750, burning fossil fuels has raised CO₂ from 278 to 429.6 ppm (September 2026), and oxygenation of RuBP fell. Warming raises it again.', cite: [IPCC21, NOAA, BERNACCHI01] },
  { tag: 'A better RuBisCO?', say: 'A more specific or faster RuBisCO has not yet worked in a crop. <b>How does the leaf turn 3-phosphoglycerate (3-PGA) into sugar?</b>', cite: [WHITNEY01, OCCHIALINI16, MCDONALD26] },
];

export const C2STORY: Beat[] = [INTRO, ...PART2];
