// Slide C6 · Photorespiration (chunk rf, overnight build 28 Oct 2026). Text only; figures in ./rff06.ts.
// Facts (checked, rf REPORT.md): 2-phosphoglycolate cannot enter the cycle and is recycled through chloroplast,
// peroxisome and mitochondrion; in the mitochondrion two glycine give serine, CO₂ and NH₃ (glycine decarboxylase + SHMT);
// 3/4 of the carbon of 2-phosphoglycolate returns as PGA, 1/4 is lost as CO₂; NH₃ is refixed in the chloroplast (GS2 /
// Fd-GOGAT: ATP and reduced ferredoxin) and glycerate kinase spends ATP (Peterhänsel et al. 2010, §2.1–2.2);
// Arabidopsis mutants lacking phosphoglycolate phosphatase, selected as plants that grow in 1 % CO₂ but turn chlorotic in
// air, recover in 1 % CO₂ (Somerville & Ogren 1979, via Peterhänsel 2010 Fig. 2; Ogren 2003).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: 'C6',
  title: 'Photorespiration',
  status: 'draft',
  lead: 'Respiration takes up O₂ and releases CO₂.<br>Photorespiration does the same, in the light: it recycles 2-PG from the oxygenation of RuBP.',
  points: [
    { claim: 'Why “photorespiration”.', text: 'O₂ is taken up and CO₂ released, only in the light: in the dark RuBisCO is inactive and RuBP is not regenerated', eq: 'per 2 O₂: 1 CO₂ released' },
    { claim: 'A loss of carbon and energy.', text: 'Often seen as a wasteful process', eq: '30 °C: ≈ 29 % less CO₂ fixed per absorbed photon in air than in 2 % O₂' },
    { claim: 'Function: recycling 2-PG.', text: '2-PG is toxic: it inhibits enzymes of the cycle<br>Photorespiration returns 3 of its 4 carbons as 3-PGA', eq: '2 × 2-PG (4 C) → 3-PGA (3 C) + CO₂ (1 C)' },
  ],
  refs: [
    { label: 'Flügel et al. 2017', url: 'https://doi.org/10.1105/tpc.17.00256' },
    { label: 'Peterhänsel et al. 2010', url: 'https://doi.org/10.1199/tab.0130' },
    { label: 'Somerville & Ogren 1979', url: 'https://doi.org/10.1038/280833a0' },
    { label: 'Frederick & Newcomb 1969', url: 'https://doi.org/10.1083/jcb.43.2.343' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
