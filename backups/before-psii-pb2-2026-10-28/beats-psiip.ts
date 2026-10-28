// Beats of the slide 7 stagings pa and pb (lecturer, 28 Oct 2026: nothing pushes plastoquinone; it diffuses in the
// lipids, sits loosely in Q_B before light, and as plastoquinol binds weakly, drops out and is replaced from the pool).
// Beats 1–3 as PSIIM; beat 4's caption is a draft for the lecturer.
import { PSIIM } from './beats-psiim';
import type { Beat } from './types';

export const PSIIP: Beat[] = [
  ...PSIIM.slice(0, 3),
  { ...PSIIM[3], say: 'Plastoquinone takes two electrons and two H⁺ from the stroma. As plastoquinol (PQH₂) it binds only loosely, drops out and diffuses away in the membrane; a new plastoquinone takes its place. <b>Where do they go next?</b>' },
];
