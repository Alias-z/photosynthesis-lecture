// Slide 10 · ATP synthase: text approved by the lecturer on 27 Oct 2026 (one focus component per chain slide; the figure is
// the whole-chain schema with this component lit, see figs/chain.ts and the matching figure module).
import { ledger } from './ledger';
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '10',
  title: 'ATP synthase',
  status: 'confirmed',
  lead: 'H⁺ flowing back from the lumen to the stroma drive ATP synthase to make ATP.',
  points: [
    { claim: 'Proton gradient.', text: 'H⁺ collect in the lumen', eq: 'lumen pH ≈ 6 · stroma pH ≈ 8' },
    { claim: 'ATP synthase.', text: 'H⁺ flow back and turn its rotor', eq: '14 H⁺ = 1 turn = 3 ATP<br>per O₂: only 12 H⁺ → 12/14 turn → ≈ 2.6 ATP' },
    { claim: 'Chemiosmosis.', text: 'The H⁺ gradient links electron transport to ATP' },
    { claim: 'Per O₂.', text: '', eq: ledger([['water splitting', '—', '+4 lumen'], ['cytochrome b₆f', '—', '+8 lumen'], ['ATP synthase → ≈ 2.6 ATP', '—', '12 lumen → stroma']]) },
  ],
  refs: [
    { label: 'Kramer et al. 1999', url: 'https://doi.org/10.1023/A:1006212014787' },
    { label: 'Hahn et al. 2018', url: 'https://doi.org/10.1126/science.aat4318' },
    { label: 'Jagendorf & Uribe 1966', url: 'https://doi.org/10.1073/pnas.55.1.170' },
    { label: 'Mitchell 1961', url: 'https://doi.org/10.1038/191144a0' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
