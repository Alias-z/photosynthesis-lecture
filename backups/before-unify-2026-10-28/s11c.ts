// Slide 10b · Cyclic electron flow: text approved by the lecturer on 27 Oct 2026 (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '10b',
  title: 'Cyclic electron flow',
  status: 'confirmed',
  lead: 'Electrons can cycle around photosystem I, adding H⁺ to the lumen and making ATP without NADPH.',
  points: [
    { claim: 'Linear flow.', text: '≈ 2.6 ATP per 2 NADPH; CO₂ fixation needs 3 ATP per 2 NADPH' },
    { claim: 'Cyclic flow.', text: 'Ferredoxin returns electrons to plastoquinone: more H⁺ in the lumen, ATP only' },
  ],
  refs: [
    { label: 'Kramer & Evans 2011', url: 'https://doi.org/10.1104/pp.110.166652' },
    { label: 'Munekage et al. 2004', url: 'https://doi.org/10.1038/nature02598' },
    { label: 'Malone et al. 2021', url: 'https://doi.org/10.1016/j.bbabio.2021.148380' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
