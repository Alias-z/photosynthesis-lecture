// Captions for the variants of the picked C₂ animation c2s (c2s-a, c2s-b, c2s-c; lecturer, 30 Oct 2026: "label the
// mitochondria and the chloroplasts; why are there so many dark things around the veins of C₂ cells? In C₃ only about a
// quarter is recaptured; in C₂ the CO₂ bounces around and cannot escape, a little leaks out: that is the major difference").
import type { Beat, Cite } from './types';

const KHOSH16: Cite = { label: 'Khoshravesh et al. 2016, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erw150' };
const RAWS88: Cite = { label: 'Rawsthorne et al. 1988, Planta', url: 'https://doi.org/10.1007/BF00401016' };
const KEER14: Cite = { label: 'Keerberg et al. 2014, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/eru239' };
const BUSCH13: Cite = { label: 'Busch, Sage, Cousins & Sage 2013, Plant Cell Environ.', url: 'https://doi.org/10.1111/j.1365-3040.2012.02567.x' };
const SAGE12: Cite = { label: 'Sage, Sage & Kocacinar 2012, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' };

export const C2S: Beat[] = [
  { tag: 'C₃ and C₂ leaves', say: 'A C₃ grass and a C₂ grass, cut across a vein. Around the vein lies a ring of bundle-sheath cells; in the C₂ grass their chloroplasts and mitochondria are packed against the vein side.', cite: [KHOSH16] },
  { tag: 'Photorespiration, as before', say: 'In both leaves, RuBisCO in the mesophyll also takes up O₂, and the 2-PG is recycled to glycine, as on the photorespiration slide.', cite: [SAGE12] },
  { tag: 'C₃: the CO₂ leaks', say: 'In the C₃ leaf the mesophyll mitochondria release CO₂ from glycine, next to the air spaces: only about a quarter of it is recaptured, the rest escapes.', cite: [BUSCH13] },
  { tag: 'C₂: the CO₂ is trapped', say: 'In the C₂ leaf only bundle-sheath mitochondria release CO₂ from glycine, so glycine moves there through plasmodesmata. Released behind the chloroplasts, the CO₂ bounces until RuBisCO catches most of it; a little leaks. <b>What if the leaf pumped CO₂ into the bundle sheath directly?</b>', cite: [RAWS88, KHOSH16, KEER14] },
];
