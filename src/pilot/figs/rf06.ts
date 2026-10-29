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
  // lecture day, last (lecturer: "the photorespiration slide is not clear; keep only the most essential information")
  lead: 'When RuBisCO takes up O₂ instead of CO₂, photorespiration recycles its toxic product, 2-PG.',
  points: [
    { claim: 'Why “photorespiration”.', text: 'In the light, the leaf takes up O₂ and gives off CO₂, like respiration' },
    { claim: 'It costs.', text: 'Part of the carbon already fixed is lost again as CO₂, and the recycling costs energy' },
    { claim: 'It is needed.', text: '2-PG is toxic to the Calvin–Benson–Bassham cycle; photorespiration returns 3 of every 4 of its carbons as 3-PGA' },
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
