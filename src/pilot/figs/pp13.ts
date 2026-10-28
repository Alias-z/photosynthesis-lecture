// Slide 13 · Chlorophyll fluorescence: text of chunk pp (28 Oct 2026, overnight build, for the lecturer's approval).
// Draft AFTER the 27 Oct text of s14.ts. Facts and sources: Fv/Fm 0.832 ± 0.004 across 37 C₃ species, lowered by
// high-light treatment (Björkman & Demmig 1987, abstract); a saturating pulse closes all PSII reaction centres; ΦPSII and
// NPQ in the light (Ruban 2016, Fig. 1A; Maxwell & Johnson 2000); satellite SIF tracks crop photosynthesis (Guanter et
// al. 2014). Kautsky & Hirsch 1931 is told in the animation only.
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '13',
  title: 'Chlorophyll fluorescence',
  status: 'draft',
  lead: 'Fluorescence competes with photochemistry and heat, so measuring it shows how photosystem II uses light, without harming the leaf.',
  points: [
    { claim: 'F<sub>v</sub>/F<sub>m</sub>.', text: 'Maximum quantum yield of photosystem II, measured with a saturating light pulse after dark adaptation<br>≈ 0.83 in healthy leaves; lower after photoinhibition or other stress' },
    { claim: 'Φ<sub>PSII</sub> and NPQ.', text: 'Pulses in the light measure photochemistry (Φ<sub>PSII</sub>) and heat dissipation (NPQ)' },
    { claim: 'Solar-induced fluorescence (SIF).', text: 'Satellites measure the faint fluorescence of vegetation in sunlight<br>It maps crop photosynthesis across regions' },
  ],
  refs: [
    { label: 'Björkman & Demmig 1987', url: 'https://doi.org/10.1007/BF00402983' },
    { label: 'Maxwell & Johnson 2000', url: 'https://doi.org/10.1093/jexbot/51.345.659' },
    { label: 'Ruban 2016', url: 'https://doi.org/10.1104/pp.15.01935' },
    { label: 'Tyystjärvi & Aro 1996', url: 'https://doi.org/10.1073/pnas.93.5.2213' },
    { label: 'Guanter et al. 2014', url: 'https://doi.org/10.1073/pnas.1320008111' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
