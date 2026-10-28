// Slide C5 · RuBisCO: carboxylation and oxygenation (chunk rf, overnight build 28 Oct 2026). Text only; the figures are in
// ./rff05.ts (withFigures in plates.ts). Facts and sources (checked, rf REPORT.md):
// RuBP + CO₂ → 2 PGA; RuBP + O₂ → PGA + 2-phosphoglycolate (Bowes, Ogren & Hageman 1971; Ogren 2003); CO₂ and O₂ compete
// at one active site (Flamholz et al. 2019); spinach RuBisCO in air at 25 °C: R_C ≈ 1.2 s⁻¹, R_O ≈ 0.4 s⁻¹, i.e. ≈ 1
// oxygenation per 3 carboxylations (Flamholz 2019, Results 3.1; ratio is our arithmetic); warming lowers RuBisCO's
// CO₂/O₂ specificity (spinach ≈ 160 at 5 °C, ≈ 50 at 40 °C) and the CO₂/O₂ solubility ratio; kinetics give 2/3 of the
// temperature effect, solubility 1/3 (Jordan & Ogren 1984).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: 'C5',
  title: 'Carboxylation and oxygenation',
  status: 'draft',
  lead: 'RuBisCO adds CO₂ or O₂ to ribulose-1,5-bisphosphate (RuBP).',
  points: [
    { claim: 'Carboxylation.', text: 'Gives 2 molecules of 3-phosphoglycerate (3-PGA, 3 C), hence “C₃ photosynthesis”', eq: 'RuBP (5 C) + CO₂ (1 C) → 2 3-PGA (2 × 3 C)' },
    { claim: 'Oxygenation.', text: 'Gives 3-PGA and 2-phosphoglycolate, which the cycle cannot use', eq: 'RuBP (5 C) + O₂ → 3-PGA (3 C) + 2-phosphoglycolate (2 C)' },
    { claim: 'Substrate competition.', text: 'The less CO₂ in the chloroplast, the more oxygenation', eq: 'leaf at 25 °C: ≈ 2 oxygenations per 5 carboxylations' },
  ],
  refs: [
    { label: 'Bowes, Ogren & Hageman 1971', url: 'https://doi.org/10.1016/0006-291X(71)90475-X' },
    { label: 'Flamholz et al. 2019', url: 'https://doi.org/10.1021/acs.biochem.9b00237' },
    { label: 'Busch et al. 2024', url: 'https://doi.org/10.1111/pce.14815' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
