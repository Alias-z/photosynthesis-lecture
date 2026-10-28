// Slide 12 · Photoprotection and repair: text of chunk pp (28 Oct 2026, overnight build, for the lecturer's approval).
// Draft AFTER the 27 Oct text of s13.ts. Facts and sources: as light saturation is reached, ΔpH rises and the lumen
// acidifies, activating violaxanthin de-epoxidase; PsbS senses lumen pH and is needed for qE (Murchie & Niyogi 2011; Li et
// al. 2000); damage to D1 is proportional to light from 6.5 to 1500 µmol m⁻² s⁻¹ (Tyystjärvi & Aro 1996); repair =
// partial disassembly, degradation of damaged D1, new D1, reassembly (Murchie & Niyogi 2011; Järvi et al. 2015, Fig. 1);
// NPQ continues for many minutes after shading; faster relaxation raised tobacco dry matter by about 15 % (Kromdijk et
// al. 2016, abstract; field: Fig. 5A, 14–20 %).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '12',
  title: 'Photoprotection and repair',
  status: 'draft',
  lead: 'Excess light acidifies the lumen, which switches on heat dissipation; damaged photosystem II is repaired continuously.',
  points: [
    { claim: 'Non-photochemical quenching (NPQ).', text: 'Low lumen pH activates PsbS and turns violaxanthin into zeaxanthin<br>The antenna then dissipates excess energy as heat' },
    { claim: 'Photoinhibition and D1 repair.', text: 'Light damages D1 of photosystem II, in proportion to light<br>Damaged D1 is replaced; photoinhibition: damage faster than repair' },
    { claim: 'NPQ relaxation.', text: 'NPQ switches off slowly in shade, wasting light<br>Faster relaxation: tobacco gained ≈ 15 % dry weight in the field' },
  ],
  refs: [
    { label: 'Li et al. 2000', url: 'https://doi.org/10.1038/35000131' },
    { label: 'Murchie & Niyogi 2011', url: 'https://doi.org/10.1104/pp.110.168831' },
    { label: 'Tyystjärvi & Aro 1996', url: 'https://doi.org/10.1073/pnas.93.5.2213' },
    { label: 'Järvi et al. 2015', url: 'https://doi.org/10.1016/j.bbabio.2015.01.006' },
    { label: 'Kromdijk et al. 2016', url: 'https://doi.org/10.1126/science.aai8878' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
