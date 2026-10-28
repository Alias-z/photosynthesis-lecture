// Slide C8 · FvCB model (chunk rf, overnight build 28 Oct 2026; pick key C9, the lecturer's pick 'a' stays first in
// ./rff08.ts). Text only. Facts (checked, rf REPORT.md): A = min{Wc, Wj, Wp}(1 − Γ*/Cc) − Rd (Busch et al. 2024, Box 3,
// Eq. 18); RuBisCO-limited at low CO₂ (Vcmax), RuBP-regeneration-limited at higher CO₂ (electron transport rate J), the
// 1980 model had these two (Farquhar, von Caemmerer & Berry 1980); triose-phosphate use (TPU) added by Sharkey 1985;
// TPU limitation is rarely seen at physiological CO₂ and temperature (Gregory et al. 2021).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: 'C8',
  pick: 'C9',
  title: 'FvCB model',
  status: 'draft',
  lead: 'The Farquhar–von Caemmerer–Berry (FvCB) model gives CO₂ uptake as the lowest of 3 rates, each set by a different process.',
  points: [
    { claim: 'RuBisCO limit, <i>A</i><sub>c</sub>.', text: 'At low <i>C</i>ᵢ, uptake rises steeply with CO₂<br>Set by the maximum carboxylation rate of active RuBisCO (<i>V</i><sub>cmax</sub>)' },
    { claim: 'RuBP-regeneration limit, <i>A</i><sub>j</sub>.', text: 'At higher <i>C</i>ᵢ, uptake rises slowly<br>Set by the electron transport rate (<i>J</i>) that supplies ATP and NADPH' },
    { claim: 'TPU limit, <i>A</i><sub>p</sub>.', text: 'At high <i>C</i>ᵢ, uptake stops rising<br>Set by triose-phosphate use (TPU) for sucrose and starch' },
  ],
  refs: [
    { label: 'Farquhar, von Caemmerer & Berry 1980', url: 'https://doi.org/10.1007/BF00386231' },
    { label: 'Sharkey 1985', url: 'https://doi.org/10.1104/pp.78.1.71' },
    { label: 'Busch et al. 2024', url: 'https://doi.org/10.1111/pce.14815' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
