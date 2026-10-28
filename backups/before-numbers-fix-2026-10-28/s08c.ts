// Slide 8 · Cytochrome b₆f: text approved by the lecturer on 27 Oct 2026 (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '8',
  title: 'Cytochrome b₆f',
  status: 'confirmed',
  lead: 'Cytochrome b₆f passes electrons from plastoquinone to plastocyanin and moves H⁺ into the lumen.',
  points: [
    { claim: 'Electron transfer.', text: 'Plastoquinone → cytochrome b₆f → plastocyanin' },
    { claim: 'Proton transfer.', text: 'The H⁺ carried by plastoquinone are released into the lumen' },
    { claim: 'Plastocyanin.', text: 'A small copper protein that carries one electron through the lumen to photosystem I' },
  ],
  refs: [
    { label: 'Malone et al. 2019', url: 'https://doi.org/10.1038/s41586-019-1746-6' },
    { label: 'Malone et al. 2021', url: 'https://doi.org/10.1016/j.bbabio.2021.148380' },
    { label: 'Nelson & Ben-Shem 2004', url: 'https://doi.org/10.1038/nrm1525' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
