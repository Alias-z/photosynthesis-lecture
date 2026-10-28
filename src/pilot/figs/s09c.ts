// Slide 9 · Photosystem I: text approved by the lecturer on 27 Oct 2026 (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import { ledger } from './ledger';
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '9',
  title: 'Photosystem I',
  status: 'confirmed',
  lead: 'Light at photosystem I lifts the electrons a second time, high enough to make NADPH.',
  points: [
    { claim: 'Second light reaction.', text: 'Light lifts the electron again, to ferredoxin; plastocyanin refills PSI' },
    { claim: 'NADPH.', text: 'Ferredoxin–NADP⁺ reductase (FNR) makes NADPH in the stroma', eq: 'NADP⁺ + 2 e⁻ + H⁺ → NADPH' },
    { claim: 'Photosystem I vs photosystem II.', text: 'Work in series; PSI also absorbs far-red (> 700 nm)', eq: 'per O₂: 4 e⁻ × 2 photons (1 at PSII + 1 at PSI) = 8 photons' },
    { claim: 'Per O₂.', text: '', eq: ledger([['photosystem I (4 photons)', '4', '0'], ['ferredoxin (4 Fd)', '4', '0'], ['FNR → 2 NADPH', '4', '−2 stroma']]) },
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
