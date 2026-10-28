// Slide 10 · ATP synthase: text approved by the lecturer on 27 Oct 2026 (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '10',
  title: 'ATP synthase',
  status: 'confirmed',
  lead: 'H⁺ flowing back from the lumen to the stroma drive ATP synthase to make ATP.',
  points: [
    { claim: 'Proton gradient.', text: 'H⁺ from water splitting and from cytochrome b₆f collect in the lumen' },
    { claim: 'ATP synthase.', text: 'H⁺ flow through it back to the stroma; it makes ATP from ADP + Pᵢ' },
    { claim: 'Chemiosmosis.', text: 'The H⁺ gradient links electron transport to ATP synthesis' },
  ],
  refs: [
    { label: 'Hahn et al. 2018', url: 'https://doi.org/10.1126/science.aat4318' },
    { label: 'Jagendorf & Uribe 1966', url: 'https://doi.org/10.1073/pnas.55.1.170' },
    { label: 'Mitchell 1961', url: 'https://doi.org/10.1038/191144a0' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
