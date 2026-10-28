// Slide 10b animation, "Balancing ATP and NADPH" (lecturer's approved script, 28 Oct 2026; research/redo-2026-10-28/
// BALANCE_BRIEF.md): concept level, no counts. Stagings s1–s3 (balance-s1.ts …).
import type { Beat, Cite } from './types';

const KRAMER11: Cite = { label: 'Kramer & Evans 2011, Plant Physiol.', url: 'https://doi.org/10.1104/pp.110.166652' };
const YAMORI16R: Cite = { label: 'Yamori & Shikanai 2016, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-043015-112002' };
const JOLIOT06: Cite = { label: 'Joliot & Joliot 2006, BBA Bioenerg.', url: 'https://doi.org/10.1016/j.bbabio.2006.02.018' };
const ILIK17: Cite = { label: 'Ilík et al. 2017, New Phytol.', url: 'https://doi.org/10.1111/nph.14536' };
const BADGER00: Cite = { label: 'Badger et al. 2000, Phil. Trans. R. Soc. B', url: 'https://doi.org/10.1098/rstb.2000.0704' };
const SCHEIBE04: Cite = { label: 'Scheibe 2004, Physiol. Plant.', url: 'https://doi.org/10.1111/j.0031-9317.2004.0222.x' };
const YAMORI11: Cite = { label: 'Yamori et al. 2011, Plant J. (NDH, cold)', url: 'https://doi.org/10.1111/j.1365-313X.2011.04747.x' };
const YAMORI16: Cite = { label: 'Yamori et al. 2016, Sci. Rep.', url: 'https://doi.org/10.1038/srep20147' };
const MUNEKAGE04: Cite = { label: 'Munekage et al. 2004, Nature', url: 'https://doi.org/10.1038/nature02598' };
const SUORSA12: Cite = { label: 'Suorsa et al. 2012, Plant Cell', url: 'https://doi.org/10.1105/tpc.112.097162' };

export const BALANCE: Beat[] = [
  { tag: 'ATP : NADPH', say: 'Linear electron flow makes less ATP per NADPH than CO₂ fixation uses: ATP runs short, NADPH does not.', cite: [KRAMER11] },
  { tag: 'Cyclic electron flow (more ATP)', say: 'Electrons from photosystem I go from ferredoxin back to plastoquinone, through 2 routes: the PGR5 protein and the NADH dehydrogenase-like (NDH) complex. ATP, no NADPH.', cite: [YAMORI16R, JOLIOT06] },
  { tag: 'Water–water cycle (more ATP)', say: 'Electrons from photosystem I reduce O₂ to water: ATP, no NADPH. Flowering plants send few electrons this way (< 10 %); algae, mosses and conifers send more, through flavodiiron proteins.', cite: [BADGER00, ILIK17] },
  { tag: 'Malate valve (less NADPH)', say: 'Excess NADPH leaves the chloroplast as malate.', cite: [SCHEIBE04] },
  { tag: 'When plants use these routes', say: 'Plants use these routes most in sudden strong light, in the first minutes of light and in cold, when the cycle cannot use all the NADPH; without cyclic flow, plants barely grow. <b>With ATP and NADPH balanced, how do plants use them?</b>', cite: [YAMORI16, YAMORI11, MUNEKAGE04] },
];
