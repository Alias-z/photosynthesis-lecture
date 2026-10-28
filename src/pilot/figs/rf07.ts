// Slide C7 · Light-response curve (chunk rf, overnight build 28 Oct 2026; pick key C8). Text only; figures in ./rff07.ts.
// Facts (checked, rf REPORT.md): in dim light CO₂ uptake rises linearly with absorbed light, slope = quantum yield
// (Ehleringer & Björkman 1977: 0.052 mol CO₂ per mol absorbed photons in C₃ leaves in air at 30 °C); light compensation
// point: uptake = release (typical ≈ 15 µmol m⁻² s⁻¹ at 25 °C, Busch et al. 2024 Table 1, "indicative"); tobacco sun vs
// shade leaves (95 % vs 28 % of sunlight): light-saturated net uptake 21.8 vs 13.1 µmol m⁻² s⁻¹ at 2000, compensation
// point 32 vs 20 µmol m⁻² s⁻¹ (Huang, Zhang & Hu 2014, Fig. 1C, Table 1).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: 'C7',
  pick: 'C8',
  title: 'Light-response curve',
  status: 'draft',
  lead: 'Light supplies the ATP and NADPH that regenerate RuBP, so CO₂ uptake rises with light until the Calvin–Benson–Bassham cycle limits it.',
  points: [
    { claim: 'Quantum yield.', text: 'In dim light, CO₂ uptake rises linearly with light<br>Slope = CO₂ fixed per photon absorbed' },
    { claim: 'Light compensation point.', text: 'Uptake = release by respiration and photorespiration<br>Below it, the leaf releases CO₂' },
    { claim: 'Light saturation.', text: 'In bright light, uptake levels off at the leaf’s capacity<br>Shade leaves saturate at lower light and lower uptake than sun leaves' },
  ],
  refs: [
    { label: 'Huang, Zhang & Hu 2014', url: 'https://doi.org/10.3389/fpls.2014.00688' },
    { label: 'Ehleringer & Björkman 1977', url: 'https://doi.org/10.1104/pp.59.1.86' },
    { label: 'Busch et al. 2024', url: 'https://doi.org/10.1111/pce.14815' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
