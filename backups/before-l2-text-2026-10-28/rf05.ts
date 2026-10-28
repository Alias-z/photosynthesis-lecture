// Slide C5 · Rubisco: carboxylation and oxygenation (chunk rf, overnight build 28 Oct 2026). Text only; the figures are in
// ./rff05.ts (withFigures in plates.ts). Facts and sources (checked, rf REPORT.md):
// RuBP + CO₂ → 2 PGA; RuBP + O₂ → PGA + 2-phosphoglycolate (Bowes, Ogren & Hageman 1971; Ogren 2003); CO₂ and O₂ compete
// at one active site (Flamholz et al. 2019); spinach Rubisco in air at 25 °C: R_C ≈ 1.2 s⁻¹, R_O ≈ 0.4 s⁻¹, i.e. ≈ 1
// oxygenation per 3 carboxylations (Flamholz 2019, Results 3.1; ratio is our arithmetic); warming lowers Rubisco's
// CO₂/O₂ specificity (spinach ≈ 160 at 5 °C, ≈ 50 at 40 °C) and the CO₂/O₂ solubility ratio; kinetics give 2/3 of the
// temperature effect, solubility 1/3 (Jordan & Ogren 1984).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: 'C5',
  title: 'Rubisco: carboxylation and oxygenation',
  status: 'draft',
  lead: 'Rubisco’s active site also binds O₂, so RuBP is either carboxylated or oxygenated.',
  points: [
    { claim: 'Carboxylation and oxygenation.', text: 'RuBP + CO₂ → 2 PGA<br>RuBP + O₂ → PGA + 2-phosphoglycolate' },
    { claim: 'Substrate competition.', text: 'CO₂ and O₂ compete for the same active site<br>In air at 25 °C: ≈ 1 oxygenation per 3 carboxylations' },
    { claim: 'Temperature.', text: 'Warmer leaves oxygenate more, relative to carboxylation<br>Rubisco’s CO₂/O₂ specificity falls; CO₂ solubility falls more than O₂ solubility' },
  ],
  refs: [
    { label: 'Bowes, Ogren & Hageman 1971', url: 'https://doi.org/10.1016/0006-291X(71)90475-X' },
    { label: 'Flamholz et al. 2019', url: 'https://doi.org/10.1021/acs.biochem.9b00237' },
    { label: 'Jordan & Ogren 1984', url: 'https://doi.org/10.1007/BF00398720' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
