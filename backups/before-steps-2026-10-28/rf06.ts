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
  lead: 'The cycle cannot use 2-phosphoglycolate, so photorespiration recycles it into 3-PGA via peroxisome and mitochondrion.',
  points: [
    { claim: 'Pathway.', text: 'Chloroplast → peroxisome → mitochondrion → peroxisome → chloroplast<br>In the mitochondrion: 2 glycine → serine + CO₂ + NH₃' },
    { claim: 'Cost.', text: 'Of 4 C in two 2-phosphoglycolate: 3 return as PGA, 1 is lost as CO₂<br>Refixing NH₃ and returning glycerate cost ATP and reductant' },
    { claim: 'Essential pathway.', text: 'Arabidopsis mutants that lack it grow in 1 % CO₂ but not in air' },
  ],
  refs: [
    { label: 'Peterhänsel et al. 2010', url: 'https://doi.org/10.1199/tab.0130' },
    { label: 'Somerville & Ogren 1979', url: 'https://doi.org/10.1038/280833a0' },
    { label: 'Frederick & Newcomb 1969', url: 'https://doi.org/10.1083/jcb.43.2.343' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
