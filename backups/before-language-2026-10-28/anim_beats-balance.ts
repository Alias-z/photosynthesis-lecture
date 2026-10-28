// Slide 10b animation, "Balancing ATP and NADPH" (lecturer's approved script, 28 Oct 2026; research/redo-2026-10-28/
// BALANCE_BRIEF.md): concept level, no counts. Stagings s1–s3 (balance-s1.ts …).
import type { Beat, Cite } from './types';

const KRAMER11: Cite = { label: 'Kramer & Evans 2011, Plant Physiol.', url: 'https://doi.org/10.1104/pp.110.166652' };
const YAMORI16R: Cite = { label: 'Yamori & Shikanai 2016, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-043015-112002' };
const JOLIOT06: Cite = { label: 'Joliot & Joliot 2006, BBA Bioenerg.', url: 'https://doi.org/10.1016/j.bbabio.2006.02.018' };
const BADGER00: Cite = { label: 'Badger et al. 2000, Phil. Trans. R. Soc. B', url: 'https://doi.org/10.1098/rstb.2000.0704' };
const SCHEIBE04: Cite = { label: 'Scheibe 2004, Physiol. Plant.', url: 'https://doi.org/10.1111/j.0031-9317.2004.0222.x' };
const YAMORI16: Cite = { label: 'Yamori et al. 2016, Sci. Rep.', url: 'https://doi.org/10.1038/srep20147' };
const MUNEKAGE04: Cite = { label: 'Munekage et al. 2004, Nature', url: 'https://doi.org/10.1038/nature02598' };
const SUORSA12: Cite = { label: 'Suorsa et al. 2012, Plant Cell', url: 'https://doi.org/10.1105/tpc.112.097162' };

export const BALANCE: Beat[] = [
  { tag: 'The gap', say: 'Linear flow makes too little ATP for its NADPH. Plants have several ways to close the gap.', cite: [KRAMER11] },
  { tag: 'Cyclic flow', say: 'Electrons from photosystem I return to plastoquinone: more ATP, no NADPH. The main route in flowering plants.', cite: [YAMORI16R, JOLIOT06] },
  { tag: 'Electrons to O₂', say: 'Water–water cycle: electrons go to O₂ and form water again: more ATP, no NADPH. Small in flowering plants, larger in algae and mosses.', cite: [BADGER00] },
  { tag: 'Malate valve', say: 'Spare NADPH leaves the chloroplast as malate.', cite: [SCHEIBE04] },
  { tag: 'Flexible', say: 'Plants turn these routes up when they need to; without cyclic flow they barely grow. <b>Now there is enough ATP and NADPH: how do plants use them?</b>', cite: [YAMORI16, MUNEKAGE04, SUORSA12] },
];
