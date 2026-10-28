// Slide 8 · Cytochrome b₆f: text approved by the lecturer on 27 Oct 2026 (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import { ledger } from './ledger';
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '8',
  title: 'Cytochrome b₆f',
  status: 'confirmed',
  lead: 'Cytochrome b₆f passes electrons to plastocyanin and pumps H⁺ into the lumen.',
  points: [
    { claim: 'Electron transfer.', text: 'PQH₂ → cytochrome b₆f → plastocyanin' },
    { claim: 'Q cycle.', text: 'Half the electrons loop back to plastoquinone, so more H⁺ enter the lumen', eq: 'per O₂: 8 H⁺ into the lumen' },
    { claim: 'Plastocyanin.', text: 'Small copper protein: carries e⁻ to photosystem I', eq: '1 trip = 1 e⁻' },
    { claim: 'Per O₂.', text: '', eq: ledger([['cytochrome b₆f', '4 in → 4 out', '+8 lumen, −4 stroma'], ['plastocyanin (4 trips)', '4', '0']]) },
  ],
  refs: [
    { label: 'Malone et al. 2019', url: 'https://doi.org/10.1038/s41586-019-1746-6' },
    { label: 'Sacksteder et al. 2000', url: 'https://doi.org/10.1073/pnas.97.26.14283' },
    { label: 'Malone et al. 2021', url: 'https://doi.org/10.1016/j.bbabio.2021.148380' },
    { label: 'Nelson & Ben-Shem 2004', url: 'https://doi.org/10.1038/nrm1525' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
