// Beats of the slide 7 stagings pa and pb (lecturer, 28 Oct 2026: nothing pushes plastoquinone; it diffuses in the
// lipids, sits loosely in Q_B before light, and as plastoquinol binds weakly, drops out and is replaced from the pool).
// Beats 1–3 as PSIIM; beat 4's caption is a draft for the lecturer.
import { PSIIM } from './beats-psiim';
import type { Beat } from './types';

export const PSIIP: Beat[] = [
  ...PSIIM.slice(0, 3),
  { ...PSIIM[3], say: 'Plastoquinone takes 2 e⁻ + 2 H⁺ from the stroma. As plastoquinol (PQH₂) it binds only loosely, drops out and diffuses away in the membrane; a new plastoquinone takes its place. <b>Where do they go next?</b>' },
];

/** pb (28 Oct 2026, draft): per O₂ two plastoquinols, so the H⁺ count reads 4 + 4, not 4 + 2. */
export const PSIIPB: Beat[] = [
  ...PSIIM.slice(0, 3),
  { ...PSIIM[3], say: 'Each plastoquinone takes 2 e⁻ + 2 H⁺ from the stroma and becomes plastoquinol (PQH₂), which is released into the membrane. Per O₂: 2 plastoquinols, so 4 H⁺ leave the stroma, while water’s 4 H⁺ stay in the lumen. <b>Where do they go next?</b>' },
];
