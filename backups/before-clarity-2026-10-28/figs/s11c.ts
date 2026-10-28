// Slide 10b · Cyclic electron flow: text approved by the lecturer on 27 Oct 2026 (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '10b',
  title: 'Cyclic electron flow',
  status: 'confirmed',
  lead: 'Electrons from photosystem I can loop back to plastoquinone: ATP without NADPH.',
  points: [
    { claim: 'Linear flow.', text: 'Too little ATP for CO₂ fixation', eq: 'per O₂: 12 H⁺ → ≈ 2.6 ATP + 2 NADPH<br>needed: 3 ATP + 2 NADPH' },
    { claim: 'Cyclic flow.', text: 'PSI → ferredoxin → plastoquinone → b₆f → PSI: ATP only', eq: '1 cycled e⁻ → 2 H⁺<br>12 + 2 = 14 H⁺ → 3 ATP + 2 NADPH' },
    { claim: 'When NADPH piles up.', text: 'Strong or flickering light, the first minute of light, cold<br>Acidic lumen protects photosystem I', eq: 'PSI electrons cycled: weak light ≈ 0 % → strong light ≈ 50 %' },
  ],
  refs: [
    { label: 'Yamori et al. 2016', url: 'https://doi.org/10.1038/srep20147' },
    { label: 'Joliot & Joliot 2006', url: 'https://doi.org/10.1016/j.bbabio.2006.02.018' },
    { label: 'Kramer & Evans 2011', url: 'https://doi.org/10.1104/pp.110.166652' },
    { label: 'Munekage et al. 2004', url: 'https://doi.org/10.1038/nature02598' },
    { label: 'Malone et al. 2021', url: 'https://doi.org/10.1016/j.bbabio.2021.148380' },
    { label: 'Yamori & Shikanai 2016', url: 'https://doi.org/10.1146/annurev-arplant-043015-112002' },
    { label: 'Suorsa et al. 2012', url: 'https://doi.org/10.1105/tpc.112.097162' },
    { label: 'Strand et al. 2017', url: 'https://doi.org/10.1074/jbc.M116.770792' },
    { label: 'Hahn et al. 2018', url: 'https://doi.org/10.1126/science.aat4318' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
