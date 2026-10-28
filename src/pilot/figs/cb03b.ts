// Slide C3b · Regeneration (lecturer, 28 Oct 2026): C₃ photosynthesis step by step, one step per slide as for the electron
// transport chain. Text approved 28 Oct 2026. Figures: the dark-reaction strip with PRK lit (figs/cellv.ts).
import { ledgerC } from './ledger';
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: 'C3b',
  title: 'Regeneration of RuBP',
  status: 'draft',
  lead: 'RuBP is the CO₂ acceptor: 5 of every 6 triose phosphates are rearranged back into RuBP,<br>so the cycle can continue; only the fixed carbon leaves.',
  points: [
    { claim: 'Why 3 CO₂.', text: 'The smallest number that gives whole molecules: 5 triose phosphates (3 C each) make 3 RuBP (5 C each)', eq: '5 × 3 C = 15 C = 3 × 5 C · 1 triose phosphate (3 C) out' },
    { claim: 'Phosphoribulokinase (PRK).', text: 'ATP phosphorylates ribulose-5-phosphate to RuBP', eq: 'ribulose-5-phosphate + ATP → RuBP + ADP' },
    { claim: 'Per 3 CO₂.', text: '', eq: ledgerC([['reduction: 6 3-PGA → 6 triose phosphate', '6', '6'], ['regeneration: 5 triose phosphate → 3 RuBP', '3', '0']], ['cycle (3 : 2)', '9', '6']) },
  ],
  refs: [
    { label: 'Sharkey 2019', url: 'https://doi.org/10.1007/s11120-018-0600-2' },
    { label: 'Michelet et al. 2013', url: 'https://doi.org/10.3389/fpls.2013.00470' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
