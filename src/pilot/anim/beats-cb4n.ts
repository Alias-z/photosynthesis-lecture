// Beats of animation cb4, slide C4 · Sucrose and starch, rebuilt per triose phosphate (lecturer, 28 Oct 2026, evening;
// research/redo-2026-10-28/DARK_COUNTS_BRIEF.md): 1 triose phosphate out through TPT for 1 Pᵢ in; 4 of them (from 12 CO₂)
// make 1 sucrose; starch by day, sucrose from starch at night (Graf et al. 2010 panel); the early dusk; RuBisCO and O₂.
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
  { tag: 'Sucrose', say: 'In the cytosol, 4 triose phosphates (12 C, from 12 CO₂) make 1 sucrose, exported to growing organs and the grain; their phosphates are freed for the next exchange.', cite: [SHARKEY24, SMITH07] },
  { tag: 'Day and night', say: 'By day, part of the triose phosphate stays in the chloroplast and becomes starch. At night the starch is broken down at a near-constant rate and becomes sucrose: in <i>Arabidopsis</i> almost all of it is used by dawn.', cite: [GRAF10, STREB12] },
  CB4[2],
  CB4[3],
];
