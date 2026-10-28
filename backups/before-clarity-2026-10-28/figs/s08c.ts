// Slide 8 · Cytochrome b₆f: text approved by the lecturer on 27 Oct 2026 (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '8',
  title: 'Cytochrome b₆f',
  status: 'confirmed',
  lead: 'Cytochrome b₆f passes electrons to plastocyanin and pumps H⁺ into the lumen.',
  points: [
    { claim: 'Electron transfer.', text: 'PQH₂ → cytochrome b₆f → plastocyanin' },
    { claim: 'Q cycle.', text: 'Half the electrons loop back: twice the H⁺', eq: 'Qₒ: 2 PQH₂ → 2 PQ + 4 H⁺ (lumen) + 4 e⁻<br>2 e⁻ → 2 plastocyanin<br>Qᵢ: PQ + 2 e⁻ + 2 H⁺ (stroma) → PQH₂<br>× 2 per O₂ → 8 H⁺ into the lumen' },
    { claim: 'Plastocyanin.', text: 'Small copper protein: carries e⁻ to photosystem I', eq: '1 trip = 1 e⁻<br>per O₂: 4 e⁻ → 4 trips' },
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
