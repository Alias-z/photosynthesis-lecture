// Slide C10o · How plants cope with scarce CO₂ (lecturer, 30 Oct 2026): the overview between CO₂ uptake (C10) and the
// deep dives C₂ (C11a), C₄ (C12) and CAM (C13). One RuBisCO in every plant; the types differ in how much CO₂ they bring
// to it. Figures: a · 4 columns (cov-a.ts) · b · a climate axis (cov-b.ts). Animation: 'ov' (anim/ov-a.ts, ov-b.ts).
import type { PlateText, Variant } from '../types';
import { draw as drawA } from './cov-a';
import { draw as drawB } from './cov-b';
import { draw as drawC } from './cov-c';
import { draw as drawD } from './cov-d';
import { draw as drawE } from './cov-e';
import { draw as drawW } from './cov-w';
import { draw as drawW1 } from './cov-w1';
import { draw as drawW2 } from './cov-w2';
import { draw as drawW3, drawW3 as drawW3x } from './cov-w3';

export const PLATE: PlateText = {
  n: 'C10o',
  title: 'How plants cope with scarce CO₂',
  status: 'draft',
  lead: 'RuBisCO is the same in all plants. What differs is how much CO₂ they bring to it.',
  points: [
    { claim: 'C₃, the original.', text: 'About 90 % of species; on hot, dry days they suffer' },
    { claim: 'C₂ and C₄ raise CO₂ in the bundle sheath.', text: 'C₂ traps photorespired CO₂; C₄ pumps CO₂ in' },
    { claim: 'CAM takes up CO₂ at night.', text: 'And uses it by day, with the stomata shut' },
  ],
  refs: [
    { label: 'Sage, Sage & Kocacinar 2012', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' },
    { label: 'Sage, Christin & Edwards 2011', url: 'https://doi.org/10.1093/jxb/err048' },
    { label: 'Sage 2016', url: 'https://doi.org/10.1093/jxb/erw156' },
    { label: 'Still et al. 2003', url: 'https://doi.org/10.1029/2001GB001807' },
    { label: 'Silvera et al. 2010', url: 'https://doi.org/10.1071/FP10084' },
  ],
};

export const VARIANTS: Variant[] = [
  // lecturer, 30 Oct 2026, late: picked w3; "remove all the other unpicked variants and build from it"
  { id: 'w3', name: 'w3 · drawn plants in their homes; how it copes (mechanism in blue), benefit and cost bands', wide: true },
  { id: 'w3a', name: 'w3a · w3 with the mechanism first, on its own blue band', wide: true },
  { id: 'w3b', name: 'w3b · w3a, lighter: where they live under the share, no separate row', wide: true },
];

export function draw(id: string): string {
  return id === 'b' ? drawB() : id === 'c' ? drawC() : id === 'd' ? drawD() : id === 'e' ? drawE() : id === 'w' ? drawW() : id === 'w1' ? drawW1() : id === 'w2' ? drawW2() : id === 'w3' ? drawW3() : id === 'w3a' ? drawW3x({ howFirst: true, howBand: true }) : id === 'w3b' ? drawW3x({ howFirst: true, howBand: true, whereInHead: true }) : drawA();
}
