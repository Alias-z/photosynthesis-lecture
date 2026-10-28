// Slide C12b · Rising CO₂ helps C₃ more than C₄. Split from C12 on 27 Oct 2026 (order variant 1 of
// research/figure-briefs/ORDER_LECTURE2.md): it follows C₄ and CAM, so the C₃ vs C₄ comparison comes after both are taught.
// Figures g and h are C12's, drawn by its module. Facts (Ainsworth & Long 2021, abstract): across 186 FACE studies of 18 C₃
// crops, ≈ +200 ppm CO₂ raised yield ≈ 18 % without stress, ≈ 10 % with nitrogen deficiency or ≈ 2 °C of warming; C₄ crops
// gained only under drought; Zn and Fe fell in most crops, nitrogen and protein in non-legume seeds. Figure h's grassland
// panel: Reich et al. 2018 (biomass, reversal after year 12; the cause is debated in two Science comments).
import type { PlateText, Variant } from '../types';
import { draw as drawC12 } from './c12';

export const PLATE: PlateText = {
  n: 'C12',
  title: 'Rising CO₂ helps C₃ more than C₄',
  status: 'draft',
  lead: 'Free-air CO₂ enrichment (FACE) raises CO₂ over field crops; extra CO₂ suppresses RuBisCO’s oxygenation (slide C5).',
  points: [
    { claim: 'C₃ crops gain ≈ 18 %.', text: 'At +200 ppm CO₂ without stress; ≈ 10 % with low nitrogen or +2 °C.' },
    { claim: 'C₄ crops gain only in drought.', text: 'Their bundle sheath is already rich in CO₂, so extra CO₂ adds little.' },
    { claim: 'Grain quality falls.', text: 'Most crops’ grain holds less zinc and iron; non-legume seeds hold less protein.' },
  ],
  refs: [
    { label: 'Ainsworth & Long 2021', url: 'https://doi.org/10.1111/gcb.15375' },
    { label: 'Reich et al. 2018', url: 'https://doi.org/10.1126/science.aas9313' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'g', name: 'C₃ vs C₄' },
  { id: 'h', name: 'Field test' },
];

export function draw(id: string): string {
  return drawC12(id === 'h' ? 'h' : 'g');
}
