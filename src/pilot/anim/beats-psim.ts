// Captions and sources of the slide 9 animation, stagings m1–m4 (lecturer, 28 Oct 2026; research/redo-2026-10-28/
// ETC_ANIM_BRIEF.md, "psi", and the rework of the same day: a red-drop beat before Emerson's enhancement, and the series
// beat reworded; then a push-and-pull beat before the red drop, and the series beat folded into the enhancement). Order of
// 29 Oct 2026 (research/redo-2026-10-29/PSI_EMERSON_BRIEF.md): the red drop (1943), Emerson's enhancement (1957), then both
// photosystems working together (the Z-scheme) as the ending. The captions are the same in every staging; only the
// sources of the enhancement beat follow what each staging shows (m2 redraws Emerson's 1957 curves, m3 the two
// photosystems' spectra, m4 the O₂ readings).
import type { Beat, Cite } from './types';

const MAZOR17: Cite = { label: 'Mazor et al. 2017, Nature Plants', url: 'https://doi.org/10.1038/nplants.2017.14' };
const EMERSON57: Cite = { label: 'Emerson, Chalmers & Cederstrand 1957, PNAS', url: 'https://doi.org/10.1073/pnas.43.1.133' };
const EMERSON58: Cite = { label: 'Emerson 1958, Science', url: 'https://doi.org/10.1126/science.127.3306.1059' };
const LAISK14: Cite = { label: 'Laisk et al. 2014, BBA Bioenerg.', url: 'https://doi.org/10.1016/j.bbabio.2013.12.001' };
const LEWIS43: Cite = { label: 'Emerson & Lewis 1943, Am. J. Bot.', url: 'https://doi.org/10.1002/j.1537-2197.1943.tb14744.x' };
const HILL60: Cite = { label: 'Hill & Bendall 1960, Nature', url: 'https://doi.org/10.1038/186136a0' };

const S1 = 'Light at photosystem I sends an electron across the membrane to ferredoxin; plastocyanin refills the reaction centre.';
const S2 = 'Ferredoxin passes the electrons to FNR, which makes NADPH from NADP⁺ + H⁺ in the stroma.';
const SDROP = '1943, Emerson and Lewis: far-red light, absorbed mostly by photosystem I, gives little O₂ per absorbed photon: the red drop.';
const SENH = '1957, Emerson: red light (for photosystem II) together with far-red light gives more O₂ than the 2 lights apart.';
const STOG = 'Photosystem II and photosystem I work in series: each electron is lifted once by each. <b>What else does the chain make besides NADPH?</b>';

/** The beats with beat 4's sources as one staging shows them. */
function beats(emerson: Cite[]): Beat[] {
  return [
    { tag: 'Second light reaction', say: S1, cite: [MAZOR17] },
    { tag: 'NADPH', say: S2, cite: [MAZOR17] },
    { tag: 'Red drop', say: SDROP, cite: [LEWIS43] },
    { tag: 'Emerson’s enhancement', say: SENH, cite: emerson },
    { tag: '2 photosystems work together', say: STOG, cite: [HILL60] },
  ];
}

/** m1 (lamps and an O₂ count) and the animation's default beats. */
export const PSIM: Beat[] = beats([EMERSON57, EMERSON58]);
/** m2: the 1957 quantum-yield curves redrawn, then the enhancement. */
export const PSIM_M2: Beat[] = beats([EMERSON57, EMERSON58]);
/** m3: the two photosystems' absorption, shapes approximate. */
export const PSIM_M3: Beat[] = beats([EMERSON57, LAISK14]);
/** m4: Emerson's O₂ readings, then the Z-scheme. */
export const PSIM_M4: Beat[] = beats([EMERSON57]);
