// Captions of the overview slide "How plants cope with scarce CO₂" (lecturer, 30 Oct 2026: "after the CO₂ uptake slide,
// let's see how plants deal with it: the original C₃, then the strategies, with representatives and where they live").
import type { Beat, Cite } from './types';

const SAGE12: Cite = { label: 'Sage, Sage & Kocacinar 2012, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' };
const SAGE11: Cite = { label: 'Sage, Christin & Edwards 2011, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/err048' };
const SAGE16: Cite = { label: 'Sage 2016, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erw156' };
const STILL03: Cite = { label: 'Still et al. 2003, Global Biogeochem. Cycles', url: 'https://doi.org/10.1029/2001GB001807' };
const SILVERA10: Cite = { label: 'Silvera et al. 2010, Funct. Plant Biol.', url: 'https://doi.org/10.1071/FP10084' };
const WS22: Cite = { label: 'Winter & Smith 2022, New Phytol.', url: 'https://doi.org/10.1111/nph.17790' };

export const OV: Beat[] = [
  { tag: 'The CO₂ problem', say: 'Every plant fixes CO₂ with the same RuBisCO. On a hot, dry day the stomata close, CO₂ in the leaf falls and RuBisCO takes up more O₂.', cite: [SAGE12] },
  { tag: 'C₃: the original', say: 'About 90 % of plant species are C₃: wheat, rice, soybean, tomato and all trees. They have no extra mechanism, so they do best in cool to warm, moist places.', cite: [SAGE16, SILVERA10] },
  { tag: 'C₂: trap the CO₂', say: 'In warm, sunny, dry places some plants, such as wild rocket and some Flaveria (sunflower family), trap the CO₂ that photorespiration releases in the bundle sheath. C₂ plants are rare.', cite: [SAGE11, SAGE12] },
  { tag: 'C₄: pump the CO₂', say: 'C₄ plants such as maize, sugarcane and sorghum pump CO₂ into the bundle sheath. They are about 3 % of species but do about a quarter of the photosynthesis on land, mainly in hot, sunny grasslands.', cite: [SAGE16, STILL03] },
  { tag: 'CAM: take CO₂ at night', say: 'CAM plants such as agave, pineapple, cacti and many orchids take up CO₂ at night and store it: about 6 % of species, in deserts and as epiphytes on trees.', cite: [SILVERA10, WS22] },
  { tag: 'Many origins', say: 'C₂, C₄ and CAM all evolved from C₃, many times over, as CO₂ in the air fell and climates became hotter and drier. <b>How does a C₂ plant trap its CO₂?</b>', cite: [SAGE12, SAGE11] },
];
