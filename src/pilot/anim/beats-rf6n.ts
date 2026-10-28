// Beats of animation rf6, slide C6 · Photorespiration, the new story (lecturer, 28 Oct 2026, evening;
// research/redo-2026-10-28/DARK_COUNTS_BRIEF.md): what respiration is; the oxygenation of RuBP and its toxic product 2-PG;
// photorespiration as the recycling of 2-PG; why it is called photorespiration; waste or function. Captions 1–4 are the
// brief's; caption 5 opens on the two cards and ends on the question that leads to C10, CO₂ uptake. Staging: dk-rf6.ts.
import type { Beat, Cite } from './types';

const FLUGEL17: Cite = { label: 'Flügel et al. 2017, Plant Cell', url: 'https://doi.org/10.1105/tpc.17.00256' };
const BOWES71: Cite = { label: 'Bowes, Ogren & Hageman 1971, Biochem. Biophys. Res. Commun.', url: 'https://doi.org/10.1016/0006-291X(71)90475-X' };
const PETERH10: Cite = { label: 'Peterhänsel et al. 2010, Arabidopsis Book', url: 'https://doi.org/10.1199/tab.0130' };
const VCF81: Cite = { label: 'von Caemmerer & Farquhar 1981, Planta', url: 'https://doi.org/10.1007/BF00384257' };
const BERNACCHI01: Cite = { label: 'Bernacchi et al. 2001, Plant Cell Environ.', url: 'https://doi.org/10.1111/j.1365-3040.2001.00668.x' };
const SOMERVILLE79: Cite = { label: 'Somerville & Ogren 1979, Nature', url: 'https://doi.org/10.1038/280833a0' };

export const RF6N: Beat[] = [
  { tag: 'Respiration', say: 'Respiration takes up O₂ and releases CO₂.', cite: [] },
  { tag: 'Oxygenation of RuBP', say: 'Oxygenation of RuBP makes 2-phosphoglycolate (2-PG), which inhibits enzymes of the Calvin–Benson–Bassham cycle.', cite: [BOWES71, FLUGEL17] },
  { tag: 'Recycling', say: 'Photorespiration recycles 2-PG: of every 2 (4 C), 3 C return as 3-PGA and 1 is released as CO₂.', cite: [PETERH10] },
  { tag: 'Why “photorespiration”', say: 'Like respiration it takes up O₂ and releases CO₂, but only in the light: in the dark, RuBisCO is switched off and RuBP is not regenerated. Hence photorespiration.', cite: [PETERH10] },
  { tag: 'Waste or function?', say: 'Photorespiration releases fixed CO₂ and spends ATP, so it was long seen as a waste. In fact it has functions: one is removing toxic 2-PG. <b>Is getting CO₂ to RuBisCO so hard?</b>', cite: [VCF81, BERNACCHI01, SOMERVILLE79] },
];
