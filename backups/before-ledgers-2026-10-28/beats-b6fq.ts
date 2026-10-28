// Captions and sources of the slide 8 animation, cytochrome b₆f, told as the Q cycle (lecturer, 28 Oct 2026: "plastocyanin
// carries only one electron forward, what about the other? and why do more protons appear at the end?"). Staged by
// b6f-qa and b6f-qb (b6fq-common.ts); each staging carries these beats itself (Staging.beats).
import type { Beat, Cite } from './types';

const MALONE19: Cite = { label: 'Malone et al. 2019, Nature', url: 'https://doi.org/10.1038/s41586-019-1746-6' };
const SACKSTEDER00: Cite = { label: 'Sacksteder et al. 2000, PNAS', url: 'https://doi.org/10.1073/pnas.97.26.14283' };

/** The four beats of qa (unlisted), as they stood before qb's round 2. */
export const B6FQA: Beat[] = [
  { tag: 'First plastoquinol', say: 'Plastoquinol binds at cytochrome b₆f and releases its 2 H⁺ into the lumen. 1 of its 2 electrons goes on to plastocyanin; the other goes back across b₆f to a plastoquinone on the stroma side.', cite: [MALONE19] },
  { tag: 'Plastocyanin', say: 'Plastocyanin carries its electron through the lumen to photosystem I.', cite: [MALONE19] },
  { tag: 'Second plastoquinol', say: 'A second plastoquinol does the same. The stroma-side plastoquinone, now with 2 e⁻, takes 2 H⁺ from the stroma and leaves as plastoquinol: the Q cycle. The plastoquinol made at the stroma side is used again.', cite: [MALONE19, SACKSTEDER00] },
  { tag: 'Q cycle', say: 'Per O₂: 4 H⁺ from water and 8 released at b₆f make 12 H⁺ in the lumen. <b>What does photosystem I do with the electrons?</b>', cite: [SACKSTEDER00, MALONE19] },
];

/** qb: the whole per-O₂ Q cycle — round 1 (beats 1–3: two plastoquinol at Qₒ, one restored at Qᵢ), round 2 (beat 4: two more,
 *  a second restored), then the count (beat 5). Captions: lecturer's drafts of 28 Oct 2026. */
export const B6FQ: Beat[] = [
  { tag: 'First plastoquinol', say: 'Qₒ: each PQH₂ gives 2 H⁺ to the lumen; 1 e⁻ to plastocyanin, 1 e⁻ to Qᵢ.', cite: [MALONE19] },
  { tag: 'Plastocyanin', say: 'Plastocyanin carries its electron through the lumen to photosystem I.', cite: [MALONE19] },
  { tag: 'Second plastoquinol', say: 'Qᵢ: 2 e⁻ + 2 H⁺ (stroma) + PQ → PQH₂.', cite: [MALONE19, SACKSTEDER00] },
  { tag: 'Two more plastoquinol', say: 'Round 2: 2 more PQH₂ → 4 more H⁺; a 2nd PQH₂ restored.', cite: [MALONE19, SACKSTEDER00] },
  { tag: 'The count', say: 'Per O₂: 4 (water) + 8 (b₆f) = 12 H⁺ in the lumen. <b>What does photosystem I do with the electrons?</b>', cite: [SACKSTEDER00, MALONE19] },
];
