// Chunk cr animations (28 Oct 2026, night): captions and sources of cr14 (slide C14, Rising CO₂) and cr15 (slide C15,
// From leaf to loaf). Every staging of an animation plays these beats. Scripts: phase-1 report REPORT_cr.md, tightened
// (see the cr-anim report). Every number here is from the cited paper or data set, read in full or (marked in the
// report) in its abstract.
import type { Beat, Cite } from './types';

const NOAA: Cite = { label: 'NOAA GML & Scripps, Mauna Loa CO₂ record', url: 'https://gml.noaa.gov/ccgg/trends/' };
const KIMBALL83: Cite = { label: 'Kimball 1983, Agron J', url: 'https://doi.org/10.2134/agronj1983.00021962007500050014x' };
const LONG06: Cite = { label: 'Long et al. 2006, Science', url: 'https://doi.org/10.1126/science.1114722' };
const AL21: Cite = { label: 'Ainsworth & Long 2021, Glob Change Biol', url: 'https://doi.org/10.1111/gcb.15375' };
const LEAKEY09: Cite = { label: 'Leakey et al. 2009, J Exp Bot', url: 'https://doi.org/10.1093/jxb/erp096' };
const MYERS14: Cite = { label: 'Myers et al. 2014, Nature', url: 'https://doi.org/10.1038/nature13179' };
const ZHU10: Cite = { label: 'Zhu, Long & Ort 2010, Annu Rev Plant Biol', url: 'https://doi.org/10.1146/annurev-arplant-042809-112206' };
const PEARCE21: Cite = { label: 'Pearce 2021, J Exp Bot', url: 'https://doi.org/10.1093/jxb/eraa494' };
const SOUTH19: Cite = { label: 'South et al. 2019, Science', url: 'https://doi.org/10.1126/science.aat9077' };
const SANCHEZ14: Cite = { label: 'Sanchez-Bragado et al. 2014, J Exp Bot', url: 'https://doi.org/10.1093/jxb/eru298' };
const CHEN24: Cite = { label: 'Chen et al. 2024, Plant Physiol', url: 'https://doi.org/10.1093/plphys/kiae429' };

export const CR14: Beat[] = [
  { tag: 'Rising CO₂', say: 'At Mauna Loa, the yearly mean CO₂ in the air rose from 316 ppm in 1959 to 427 ppm in 2025; in September 2026 it stood at 429.6 ppm (seasonally adjusted). Is that good for crops?', cite: [NOAA] },
  { tag: 'Greenhouse trials', say: 'In 1983 Bruce Kimball pooled 430 yield observations, mostly from greenhouses and growth chambers: doubling CO₂ would raise yields by ≈ 33 %.', cite: [KIMBALL83] },
  { tag: 'Open field', say: 'Free-air CO₂ enrichment (FACE) tests crops in open fields. There the gain was about half that in enclosures: C₃ crops +18 % at +200 ppm, C₄ crops nothing, except in drought.', cite: [LONG06, AL21] },
  { tag: 'Inside the leaf', say: 'In a C₃ leaf, more CO₂ at RuBisCO speeds carboxylation and suppresses oxygenation: soybean photosynthesis +29 %. A C₄ leaf already concentrates CO₂ at RuBisCO: maize gains nothing.', cite: [LEAKEY09] },
  { tag: 'Inside the grain', say: 'Wheat grown at ≈ 550 ppm has 9 % less zinc, 5 % less iron and 6 % less protein in its grain. <b>More CO₂ raised photosynthesis: what else sets how much grain a field yields?</b>', cite: [MYERS14] },
];

export const CR15: Beat[] = [
  { tag: 'A field’s sunlight', say: 'In one season, a square metre of soybean field receives 620 MJ of sunlight; its seed stores 10.6 MJ, 1.7 %. Where is the rest lost?', cite: [ZHU10] },
  { tag: 'The ceiling', say: 'In theory, at most 4.6 % of sunlight can end in the biomass of a C₃ crop, 6 % in a C₄ crop. In C₃ crops photorespiration nearly halves the energy stored in carbohydrate.', cite: [ZHU10] },
  { tag: 'What breeding raised', say: 'Breeding raised light interception (larger leaves) and harvest index (shorter stems, as in Norman Borlaug’s Green Revolution wheats). Both are near their limits; conversion efficiency is the link left.', cite: [ZHU10, PEARCE21] },
  { tag: 'Engineering the link', say: 'A synthetic pathway breaks down glycolate from photorespiration inside the chloroplast. Tobacco with it made 20 % (2016) and 24 % (2017) more biomass in the field.', cite: [SOUTH19] },
  { tag: 'Leaf to loaf', say: 'Sucrose from the leaves and the ear moves in the phloem to the grain, where the endosperm stores it as starch. <b>Which link of the chain would you improve?</b>', cite: [SANCHEZ14, CHEN24] },
];
