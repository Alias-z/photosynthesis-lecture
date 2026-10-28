// Captions for the C₂ slide's C₃-vs-C₂ comparison versions (c2p, c2m, c2s; lecturer, 29 Oct 2026: "do a pair comparison:
// on the left the C₃ plant, its CO₂ escapes after release; in the C₂ plant the glycine is carried into the bundle-sheath
// cell, so the CO₂ cannot escape: it is trapped there, concentrated around RuBisCO").
import type { Beat, Cite } from './types';

const KHOSH16: Cite = { label: 'Khoshravesh et al. 2016, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erw150' };
const RAWS88: Cite = { label: 'Rawsthorne et al. 1988, Planta', url: 'https://doi.org/10.1007/BF00401016' };
const KEER14: Cite = { label: 'Keerberg et al. 2014, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/eru239' };
const BUSCH13: Cite = { label: 'Busch, Sage, Cousins & Sage 2013, Plant Cell Environ.', url: 'https://doi.org/10.1111/j.1365-3040.2012.02567.x' };
const SAGE12: Cite = { label: 'Sage, Sage & Kocacinar 2012, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' };

export const C2P: Beat[] = [
  { tag: 'C₃ and C₂ leaves', say: 'Left a C₃ grass, right a C₂ grass, both cut across a vein: around it the ring of bundle-sheath cells, outside it the mesophyll.', cite: [KHOSH16] },
  { tag: 'Both do the same', say: 'In both, RuBisCO in the mesophyll fixes CO₂ (carboxylation) and also adds O₂ (oxygenation); oxygenation’s 2-PG is recycled to glycine.', cite: [SAGE12] },
  { tag: 'C₃: the CO₂ escapes', say: 'In the C₃ leaf, glycine releases its CO₂ in the mesophyll mitochondria, beside the air spaces: much of it escapes.', cite: [BUSCH13] },
  { tag: 'C₂: the CO₂ is held', say: 'In the C₂ leaf only the bundle-sheath mitochondria can release it: glycine moves there, and its CO₂ is released right next to bundle-sheath RuBisCO, which fixes it; CO₂ there rises. <b>What if the leaf pumped CO₂ into the bundle sheath directly?</b>', cite: [RAWS88, KEER14] },
];
