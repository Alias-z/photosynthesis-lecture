// Slide 10b · Cyclic electron flow: text approved by the lecturer on 27 Oct 2026 (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '10b',
  title: 'Cyclic electron flow',
  status: 'confirmed',
  lead: 'Electrons from photosystem I can return to plastoquinone: they move H⁺ for ATP but make no NADPH.',
  points: [
    { claim: 'Linear flow.', text: '4 e⁻ move 12 H⁺ (4 from water + 8 at b₆f): ≈ 2.6 ATP per 2 NADPH<br>The Calvin–Benson–Bassham cycle needs 3 ATP per 2 NADPH, more with photorespiration' },
    { claim: 'Cyclic flow.', text: 'Each cycled e⁻ adds 2 H⁺ (PGR5 route, via the Q cycle; the NDH route adds 4)<br>About 1 cycled e⁻ per 4 linear e⁻ raises 2.6 to 3 ATP per 2 NADPH' },
    { claim: 'When.', text: 'Stronger under high or fluctuating light, drought and cold, and in C₄ bundle-sheath cells<br>The acidic lumen also switches on heat dissipation and protects photosystem I' },
  ],
  refs: [
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
