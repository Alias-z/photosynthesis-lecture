// Captions and sources of the slide 8 animation, cytochrome b₆f, in the 7m1 glyph style (lecturer, 28 Oct 2026;
// research/redo-2026-10-28/ETC_ANIM_BRIEF.md, section b6f). Staged by b6f-m1 and b6f-m2 (b6fm-common.ts).
import type { Beat, Cite } from './types';

const MALONE19: Cite = { label: 'Malone et al. 2019, Nature', url: 'https://doi.org/10.1038/s41586-019-1746-6' };
const MALONE21: Cite = { label: 'Malone et al. 2021, BBA Bioenerg.', url: 'https://doi.org/10.1016/j.bbabio.2021.148380' };

export const B6FM: Beat[] = [
  { tag: 'Hand-over', say: 'Plastoquinol docks at cytochrome b₆f and hands over its two electrons; its two H⁺ are released into the lumen.', cite: [MALONE19] },
  { tag: 'Plastocyanin', say: 'Cytochrome b₆f passes the electrons one at a time to plastocyanin, which carries each through the lumen to photosystem I.', cite: [MALONE19] },
  { tag: 'H⁺ in the lumen', say: 'With every plastoquinol, more H⁺ collect in the lumen. <b>What does photosystem I do with the electron?</b>', cite: [MALONE21] },
];
