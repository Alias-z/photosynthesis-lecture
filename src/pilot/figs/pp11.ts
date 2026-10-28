// Slide 11 · Excess light: text of chunk pp (28 Oct 2026, overnight build, for the lecturer's approval). Draft AFTER the
// 27 Oct text of s12r.ts, made to the slide-4b model: one lead with the cause, three points. Facts and sources:
// absorbed light rises in proportion to light while CO₂ fixation saturates (Murchie & Niyogi 2011, Fig. 1A and text);
// the yields of photochemistry, regulated heat and the rest add up to 1, photochemistry falls and heat rises with light
// (Rodríguez-Calcerrada et al. 2008, as shown by Rosenqvist 2018, slide 56); unused excitation forms singlet oxygen in the
// antenna and at the reaction centre (Pospíšil 2016, Fig. 1); D1 is the protein damaged (Murchie & Niyogi 2011).
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = {
  n: '11',
  title: 'Excess light',
  status: 'draft',
  lead: 'In strong light, leaves absorb more energy than CO₂ fixation can use.',
  points: [
    { claim: 'Light saturation.', text: 'CO₂ fixation saturates below full sunlight; absorbed light keeps rising' },
    { claim: 'Fates of absorbed energy.', text: 'Photochemistry, heat or fluorescence; their shares add up to 1<br>In strong light, heat rises and photochemistry falls' },
    { claim: 'Reactive oxygen species.', text: 'Unused excitation forms singlet oxygen, which damages the D1 protein of photosystem II' },
  ],
  refs: [
    { label: 'Murchie & Niyogi 2011', url: 'https://doi.org/10.1104/pp.110.168831' },
    { label: 'Rodríguez-Calcerrada et al. 2008', url: 'https://doi.org/10.1093/treephys/28.5.761' },
    { label: 'Porcar-Castell et al. 2021', url: 'https://doi.org/10.1038/s41477-021-00980-4' },
    { label: 'Pospíšil 2016', url: 'https://doi.org/10.3389/fpls.2016.01950' },
  ],
};

export const VARIANTS: Variant[] = [];
export const draw = (_id: string): string => '';
