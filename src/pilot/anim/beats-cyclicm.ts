// Slide 10b animation, cyclic electron flow (lecturer's script, 28 Oct 2026, research/redo-2026-10-28/ETC_ANIM_BRIEF.md):
// the gap, the cycle, one full turn, when and why. Stagings m1–m3 (cyclic-m1.ts …); the picked old staging `a` keeps
// its own beats (CYCLIC in beats.ts).
import type { Beat, Cite } from './types';

const KRAMER11: Cite = { label: 'Kramer & Evans 2011, Plant Physiol.', url: 'https://doi.org/10.1104/pp.110.166652' };
const HAHN18: Cite = { label: 'Hahn et al. 2018, Science', url: 'https://doi.org/10.1126/science.aat4318' };
const YAMORI16: Cite = { label: 'Yamori & Shikanai 2016, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-043015-112002' };
const MALONE21: Cite = { label: 'Malone et al. 2021, BBA Bioenerg.', url: 'https://doi.org/10.1016/j.bbabio.2021.148380' };
const MUNEKAGE04: Cite = { label: 'Munekage et al. 2004, Nature', url: 'https://doi.org/10.1038/nature02598' };
const SUORSA12: Cite = { label: 'Suorsa et al. 2012, Plant Cell', url: 'https://doi.org/10.1105/tpc.112.097162' };

export const CYCLICM: Beat[] = [
  {
    tag: 'The gap',
    say: 'Linear flow: 4 e⁻ move 12 H⁺ into the lumen, enough for ≈ 2.6 ATP per 2 NADPH. Fixing CO₂ needs 3 ATP per 2 NADPH.',
    cite: [KRAMER11, HAHN18],
  },
  {
    tag: 'The cycle',
    say: 'Cyclic flow: ferredoxin hands the electron back to plastoquinone; through <i>b</i>₆<i>f</i> it moves 2 more H⁺ into the lumen and returns to photosystem I. No NADPH is made.',
    cite: [YAMORI16, MALONE21],
  },
  {
    tag: '1 full turn',
    say: 'About 1 cycled e⁻ per 4 linear e⁻ adds the missing 2 H⁺: 12 + 2 = 14 H⁺ = 1 full turn = 3 ATP per 2 NADPH.',
    cite: [KRAMER11, HAHN18],
  },
  {
    tag: 'When and why',
    say: 'Plants use more cyclic flow in high or fluctuating light, drought and cold; the acidic lumen also protects photosystem I. <b>What happens when light brings more energy than the chain can use?</b>',
    cite: [YAMORI16, MUNEKAGE04, SUORSA12],
  },
];
