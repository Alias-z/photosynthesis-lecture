// Slide 10b · Balancing ATP and NADPH: concept level, no counts (lecturer, 28 Oct 2026); was 'Cyclic electron flow' (27 Oct) (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '10b',
  title: 'Balancing ATP and NADPH',
  status: 'confirmed',
  lead: 'Linear electron flow makes too little ATP for its NADPH: ATP runs short, NADPH does not.<br>Alternative pathways add ATP without NADPH, or remove excess NADPH.',
  points: [
    { claim: 'Cyclic electron flow (more ATP).', text: 'Electrons from photosystem I return to plastoquinone: ATP, no NADPH' },
    { claim: 'Water–water cycle (more ATP).', text: 'Electrons from photosystem I reduce O₂ to water: ATP, no NADPH' },
    { claim: 'Malate valve (less NADPH).', text: 'Excess NADPH leaves the chloroplast as malate' },
    { claim: 'When plants use these routes.', text: 'Sudden strong light: electrons arrive faster than the cycle can use NADPH<br>First minutes of light: the cycle’s enzymes are not yet activated<br>Cold: the cycle’s enzymes work slowly' },
  ],
  refs: [
    { label: 'Yamori et al. 2011', url: 'https://doi.org/10.1111/j.1365-313X.2011.04747.x' },
    { label: 'Kramer & Evans 2011', url: 'https://doi.org/10.1104/pp.110.166652' },
    { label: 'Yamori & Shikanai 2016', url: 'https://doi.org/10.1146/annurev-arplant-043015-112002' },
    { label: 'Joliot & Joliot 2006', url: 'https://doi.org/10.1016/j.bbabio.2006.02.018' },
    { label: 'Badger et al. 2000', url: 'https://doi.org/10.1098/rstb.2000.0704' },
    { label: 'Scheibe 2004', url: 'https://doi.org/10.1111/j.0031-9317.2004.0222.x' },
    { label: 'Munekage et al. 2004', url: 'https://doi.org/10.1038/nature02598' },
    { label: 'Suorsa et al. 2012', url: 'https://doi.org/10.1105/tpc.112.097162' },
    { label: 'Yamori et al. 2016', url: 'https://doi.org/10.1038/srep20147' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
