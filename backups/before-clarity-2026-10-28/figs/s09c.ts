// Slide 9 · Photosystem I: text approved by the lecturer on 27 Oct 2026 (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '9',
  title: 'Photosystem I',
  status: 'confirmed',
  lead: 'Light at photosystem I lifts the electrons a second time, high enough to make NADPH.',
  points: [
    { claim: 'Second light reaction.', text: 'Light lifts the electron again, to ferredoxin; plastocyanin refills PSI' },
    { claim: 'NADPH.', text: 'FNR makes NADPH in the stroma', eq: 'NADP⁺ + 2 e⁻ + H⁺ → NADPH<br>per O₂: 4 e⁻ → 4 ferredoxin → 2 NADPH' },
    { claim: 'Photosystem I vs photosystem II.', text: 'Work in series; PSI also absorbs far-red (> 700 nm), so shade favours PSI', eq: 'Chl <i>a</i>/<i>b</i>: PSI–LHCI ≈ 11 · PSII–LHCII ≈ 2<br>1 photon per e⁻ at each → 8 photons per O₂' },
  ],
  refs: [
    { label: 'Mazor et al. 2017', url: 'https://doi.org/10.1038/nplants.2017.14' },
    { label: 'Su et al. 2017', url: 'https://doi.org/10.1126/science.aan0327' },
    { label: 'Emerson et al. 1957', url: 'https://doi.org/10.1073/pnas.43.1.133' },
    { label: 'Nelson & Ben-Shem 2004', url: 'https://doi.org/10.1038/nrm1525' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
