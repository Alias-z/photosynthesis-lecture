// Slide 10b · Balancing ATP and NADPH: concept level, no counts (lecturer, 28 Oct 2026); was 'Cyclic electron flow' (27 Oct) (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '10b',
  title: 'Balancing ATP and NADPH',
  status: 'confirmed',
  lead: 'Alternative electron pathways make ATP without NADPH, raising the ATP : NADPH ratio.',
  points: [
    { claim: 'Cyclic electron flow.', text: 'Electrons from photosystem I return to plastoquinone: ATP, no NADPH<br>Increases in strong or fluctuating light, during induction and in cold' },
    { claim: 'Water–water cycle.', text: 'Electrons from photosystem I reduce O₂ to water: ATP, no NADPH' },
    { claim: 'Malate valve.', text: 'Excess NADPH leaves the chloroplast as malate' },
  ],
  refs: [
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
