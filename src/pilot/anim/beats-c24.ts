// Captions for the C₂ and C₄ slides in the micrograph-and-magnifier style (anim/c4-style.ts; lecturer, 29 Oct 2026:
// "build both"). One moving thing per beat. The bundle sheath is introduced on the C₂ slide and recognised on the C₄ slide.
import type { Beat, Cite } from './types';

const SAGE12: Cite = { label: 'Sage, Sage & Kocacinar 2012, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' };
const KHOSH16: Cite = { label: 'Khoshravesh et al. 2016, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erw150' };
const ALV25: Cite = { label: 'Alvarenga et al. 2025, Ann. Bot.', url: 'https://doi.org/10.1093/aob/mcae214' };
const KEER14: Cite = { label: 'Keerberg et al. 2014, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/eru239' };
const RAWS88: Cite = { label: 'Rawsthorne et al. 1988, Planta', url: 'https://doi.org/10.1007/BF00401016' };
const HS66: Cite = { label: 'Hatch & Slack 1966, Biochem. J.', url: 'https://doi.org/10.1042/bj1010103' };
const VC21: Cite = { label: 'von Caemmerer 2021, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erab266' };
const FURB11: Cite = { label: 'Furbank 2011, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/err080' };

/** C₂ photosynthesis (slide C11a). */
export const C2K: Beat[] = [
  { tag: 'Bundle sheath', say: 'Around each vein sits a ring of bundle-sheath cells; the mesophyll cells lie outside it, and plasmodesmata link the two.', cite: [KHOSH16] },
  { tag: 'C₃ leaf', say: 'In a C₃ leaf, photorespiration releases its CO₂ in the mesophyll mitochondria, and much of it escapes to the air spaces.', cite: [SAGE12] },
  { tag: 'Glycine moves', say: 'C₂ plants have glycine decarboxylase only in the bundle sheath: glycine from the mesophyll moves there through the plasmodesmata.', cite: [RAWS88, ALV25] },
  { tag: 'CO₂ next to RuBisCO', say: 'In the bundle-sheath mitochondria, beside the chloroplasts, glycine releases its CO₂, and RuBisCO there fixes it: CO₂ in the bundle sheath rises. <b>What if the leaf pumped CO₂ into the bundle sheath directly?</b>', cite: [KEER14, SAGE12] },
];

/** C₄ photosynthesis (slide C12). */
export const C4K: Beat[] = [
  { tag: 'Kranz anatomy', say: 'A wreath of large bundle-sheath cells around each vein, the mesophyll outside it (Kranz); only the bundle sheath has RuBisCO. C₄ arose from C₃ more than 60 times, through C₂ steps.', cite: [SAGE12] },
  { tag: 'PEPC', say: 'In the mesophyll, PEP carboxylase (PEPC) fixes HCO₃⁻, and never O₂, into a C₄ acid.', cite: [HS66] },
  { tag: 'Into the bundle sheath', say: 'The C₄ acid moves through the plasmodesmata into the bundle sheath and releases its CO₂ at RuBisCO, so CO₂ there is far higher than in the air.', cite: [VC21] },
  { tag: 'The cost', say: 'The C₃ acid left over (pyruvate) returns to the mesophyll, where PPDK turns it back into PEP for the next HCO₃⁻, at the cost of the equivalent of 2 ATP. <b>A cactus keeps its stomata shut on a hot day: how does it get its CO₂?</b>', cite: [FURB11] },
];
