// Captions and sources of the slide 8 animation, cytochrome b₆f, told as the Q cycle (lecturer, 28 Oct 2026: "plastocyanin
// carries only one electron forward, what about the other? and why do more protons appear at the end?"). Staged by
// b6f-qa and b6f-qb (b6fq-common.ts); each staging carries these beats itself (Staging.beats).
import type { Beat, Cite } from './types';

const MALONE19: Cite = { label: 'Malone et al. 2019, Nature', url: 'https://doi.org/10.1038/s41586-019-1746-6' };
const SACKSTEDER00: Cite = { label: 'Sacksteder et al. 2000, PNAS', url: 'https://doi.org/10.1073/pnas.97.26.14283' };

export const B6FQ: Beat[] = [
  { tag: 'First plastoquinol', say: 'Plastoquinol binds at cytochrome b₆f and releases its 2 H⁺ into the lumen. 1 of its 2 electrons goes on to plastocyanin; the other goes back across b₆f to a plastoquinone on the stroma side.', cite: [MALONE19] },
  { tag: 'Plastocyanin', say: 'Plastocyanin carries its electron through the lumen to photosystem I.', cite: [MALONE19] },
  { tag: 'Second plastoquinol', say: 'A second plastoquinol does the same. The stroma-side plastoquinone, now with 2 e⁻, takes 2 H⁺ from the stroma and leaves as plastoquinol: the Q cycle. The plastoquinol made at the stroma side is used again.', cite: [MALONE19, SACKSTEDER00] },
  { tag: 'Q cycle', say: 'Per O₂: 4 H⁺ from water and 8 released at b₆f make 12 H⁺ in the lumen. <b>What does photosystem I do with the electrons?</b>', cite: [SACKSTEDER00, MALONE19] },
];
