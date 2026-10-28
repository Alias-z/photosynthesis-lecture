// Slide 9 · Photosystem I: text approved by the lecturer on 27 Oct 2026 (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '9',
  title: 'Photosystem I',
  status: 'confirmed',
  lead: 'Light at photosystem I lifts the electrons a second time, high enough to make NADPH.',
  points: [
    { claim: 'Second light reaction.', text: 'The reaction centre sends an electron across the membrane to ferredoxin; plastocyanin refills it' },
    { claim: 'NADPH.', text: 'Ferredoxin passes electrons to FNR, which makes NADPH from NADP⁺ + H⁺ in the stroma' },
    { claim: 'Photosystem I vs photosystem II.', text: 'Chl <i>a</i>/<i>b</i>: photosystem I ≈ 11, photosystem II ≈ 2; photosystem I also absorbs far-red beyond 700 nm<br>Both work in series, one photon each per electron, so light colour can unbalance them: far-red-rich shade favours photosystem I' },
  ],
  refs: [
    { label: 'Mazor et al. 2017', url: 'https://doi.org/10.1038/nplants.2017.14' },
    { label: 'Emerson et al. 1957', url: 'https://doi.org/10.1073/pnas.43.1.133' },
    { label: 'Nelson & Ben-Shem 2004', url: 'https://doi.org/10.1038/nrm1525' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
