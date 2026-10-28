// Slide C6 · Photorespiration (chunk rf, overnight build 28 Oct 2026). Text only; figures in ./rff06.ts.
// Facts (checked, rf REPORT.md): 2-phosphoglycolate cannot enter the cycle and is recycled through chloroplast,
// peroxisome and mitochondrion; in the mitochondrion two glycine give serine, CO₂ and NH₃ (glycine decarboxylase + SHMT);
// 3/4 of the carbon of 2-phosphoglycolate returns as PGA, 1/4 is lost as CO₂; NH₃ is refixed in the chloroplast (GS2 /
// Fd-GOGAT: ATP and reduced ferredoxin) and glycerate kinase spends ATP (Peterhänsel et al. 2010, §2.1–2.2);
// Arabidopsis mutants lacking phosphoglycolate phosphatase, selected as plants that grow in 1 % CO₂ but turn chlorotic in
// air, recover in 1 % CO₂ (Somerville & Ogren 1979, via Peterhänsel 2010 Fig. 2; Ogren 2003).
import { ledgerP } from './ledger';
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: 'C6',
  title: 'Photorespiration',
  status: 'draft',
  lead: 'Photorespiration recycles 2-PG from oxygenation into 3-PGA, through chloroplast, peroxisome and mitochondrion.',
  points: [
    { claim: 'Photorespiratory pathway.', text: 'Chloroplast → peroxisome → mitochondrion → peroxisome → chloroplast', eq: 'in the mitochondrion: 2 glycine → serine + CO₂ + NH₃' },
    { claim: 'CO₂ loss in the mitochondrion.', text: 'Glycine decarboxylase releases 1 of every 4 carbons as CO₂', eq: 'per 2 O₂: 2 × 2-PG (4 C) → 3-PGA (3 C) + CO₂ (1 C)' },
    { claim: 'Per 2 O₂.', text: '', eq: ledgerP([['glycerate kinase: glycerate → 3-PGA', '1', '0'], ['NH₃ refixation in the chloroplast', '1', '2']], ['total', '2', '2']) },
  ],
  refs: [
    { label: 'Peterhänsel et al. 2010', url: 'https://doi.org/10.1199/tab.0130' },
    { label: 'Somerville & Ogren 1979', url: 'https://doi.org/10.1038/280833a0' },
    { label: 'Frederick & Newcomb 1969', url: 'https://doi.org/10.1083/jcb.43.2.343' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
