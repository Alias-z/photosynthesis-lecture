// Beats of animation cb4, slide C4 · Sucrose and starch, rebuilt per triose phosphate (lecturer, 28 Oct 2026, evening;
// research/redo-2026-10-28/DARK_COUNTS_BRIEF.md): 1 triose phosphate out through TPT for 1 Pᵢ in; 4 of them (from 12 CO₂)
// make 1 sucrose; starch by day, sucrose from starch at night (Graf et al. 2010 panel); RuBisCO, leading to C4e.
// The early-dusk beat (CB4[2], Graf's night after 8 h) was cut (lecturer, 29 Oct 2026): a side topic.
// Beats 1–3 are new drafts (CB4's first beat split in two, its second extended by the night's sucrose); beats 4–5 are
// CB4's last two, verbatim. Staging: dk-cb4.ts.
import { CB4 } from './beats-cb';
import type { Beat, Cite } from './types';

const SHARKEY24: Cite = { label: 'Sharkey 2024, Plant Physiol.', url: 'https://doi.org/10.1093/plphys/kiad601' };
const SMITH07: Cite = { label: 'Smith & Stitt 2007, Plant Cell Environ.', url: 'https://doi.org/10.1111/j.1365-3040.2007.01708.x' };
const GRAF10: Cite = { label: 'Graf et al. 2010, PNAS', url: 'https://doi.org/10.1073/pnas.0914299107' };
const STREB12: Cite = { label: 'Streb & Zeeman 2012, Arabidopsis Book', url: 'https://doi.org/10.1199/tab.0160' };

export const CB4N: Beat[] = [
  { tag: 'Export', say: 'Triose phosphate leaves the chloroplast through the triose phosphate/phosphate translocator (TPT), which takes in 1 inorganic phosphate (Pᵢ) from the cytosol for each one out.', cite: [SHARKEY24] },
  { tag: 'Sucrose', say: 'In the cytosol, 4 triose phosphates (12 C, as much carbon as 12 CO₂ fixed) make 1 sucrose, exported to growing organs and the grain; their phosphates are freed for the next exchange.', cite: [SHARKEY24, SMITH07] },
  { tag: 'Day and night', say: 'By day, part of the triose phosphate stays in the chloroplast and becomes starch. At night the starch is broken down at a near-constant rate and becomes sucrose: in <i>Arabidopsis</i> almost all of it is used by dawn.', cite: [GRAF10, STREB12] },
  CB4[3],
];

/** Version 2 (lecturer, 29 Oct 2026, evening): only the key points, in logical order, with no numbers to count: the Pᵢ
 *  exchange at TPT; sucrose in the cytosol for growing organs and the grain, its Pᵢ freed; the triose-phosphate use (TPU)
 *  limit when too little Pᵢ returns; starch by day, sucrose from starch at night; the question that leads to C4e. */
const SHARKEY85: Cite = { label: 'Sharkey 1985, Plant Physiol.', url: 'https://doi.org/10.1104/pp.78.1.71' };
export const CB4V2: Beat[] = [
  { tag: 'Export', say: 'Triose phosphate leaves the chloroplast through the triose phosphate/phosphate translocator (TPT), in exchange for 1 Pᵢ from the cytosol.', cite: [SHARKEY24] },
  { tag: 'Sucrose', say: 'In the cytosol, triose phosphates make sucrose, which is exported to growing organs and the grain. Their phosphate is freed and returns to the chloroplast.', cite: [SHARKEY24, SMITH07] },
  { tag: 'Triose-phosphate use (TPU)', say: 'If sucrose is made too slowly, too little Pᵢ returns: the chloroplast lacks phosphate to make ATP, and photosynthesis slows. This is the triose-phosphate use (TPU) limit.', cite: [SHARKEY85] },
  { tag: 'Starch by day, sucrose at night', say: 'By day, part of the triose phosphate stays in the chloroplast and becomes starch. At night, starch is broken down to make sucrose, so the plant keeps growing.', cite: [STREB12, SMITH07] },
  { tag: 'RuBisCO and O₂', say: 'All this sugar starts with RuBisCO adding CO₂ to RuBP. <b>But RuBisCO also adds O₂: what happens to its product, 2-PG?</b>', cite: [] },
];

/** Version 3 (lecturer, 29 Oct 2026, late): 1 fork, 2 routes, no TPU: triose phosphate stays (starch, stored by day) or
 *  leaves (sucrose, exported to the grain); at night the starch fuels the plant. */
export const CB4V3: Beat[] = [
  { tag: '2 ways', say: 'Triose phosphate from the cycle has 2 ways to go: it stays in the chloroplast to make starch, or it leaves to make sucrose.', cite: [SHARKEY24] },
  { tag: 'Out: sucrose', say: 'Leaving through the triose phosphate/phosphate translocator (TPT) in exchange for 1 Pᵢ, it makes sucrose in the cytosol, which the phloem carries to growing organs and the grain.', cite: [SHARKEY24, SMITH07] },
  { tag: 'In: starch by day', say: 'The triose phosphate that stays becomes starch: through the day the starch granules grow.', cite: [STREB12] },
  { tag: 'Night', say: 'At night the starch is broken down to soluble sugars: they become sucrose for the rest of the plant and fuel this cell’s own respiration.', cite: [STREB12, SMITH07] },
  { tag: 'RuBisCO and O₂', say: 'All this sugar starts with RuBisCO adding CO₂ to RuBP. <b>But RuBisCO also adds O₂: what happens to its product, 2-PG?</b>', cite: [] },
];

