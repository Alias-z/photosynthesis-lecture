// Captions and sources of the slide 9 animation, stagings m1–m4 (lecturer, 28 Oct 2026; research/redo-2026-10-28/
// ETC_ANIM_BRIEF.md, "psi", and the rework of the same day: a red-drop beat before Emerson's enhancement, and the series
// beat reworded; then a push-and-pull beat before the red drop, and the series beat folded into the enhancement). The captions are the same in every staging; only the sources of the enhancement beat follow what each
// staging shows (m2 redraws Emerson's 1957 curves, m3 the two photosystems' spectra, m4 the Z-scheme).
import type { Beat, Cite } from './types';

const MAZOR17: Cite = { label: 'Mazor et al. 2017, Nature Plants', url: 'https://doi.org/10.1038/nplants.2017.14' };
const EMERSON57: Cite = { label: 'Emerson, Chalmers & Cederstrand 1957, PNAS', url: 'https://doi.org/10.1073/pnas.43.1.133' };
const EMERSON58: Cite = { label: 'Emerson 1958, Science', url: 'https://doi.org/10.1126/science.127.3306.1059' };
const LAISK14: Cite = { label: 'Laisk et al. 2014, BBA Bioenerg.', url: 'https://doi.org/10.1016/j.bbabio.2013.12.001' };
const LEWIS43: Cite = { label: 'Emerson & Lewis 1943, Am. J. Bot.', url: 'https://doi.org/10.1002/j.1537-2197.1943.tb14744.x' };
const HILL60: Cite = { label: 'Hill & Bendall 1960, Nature', url: 'https://doi.org/10.1038/186136a0' };

const S1 = 'Light at photosystem I sends an electron across the membrane to ferredoxin; plastocyanin refills the reaction centre.';
const S2 = 'Ferredoxin passes the electrons to FNR, which makes NADPH from NADP⁺ + H⁺ in the stroma.';
const SPP = 'Photosystem II pulls electrons from water but pushes them only halfway; photosystem I pushes them up to NADPH but cannot pull from water. Neither works alone: they work as a relay.';
const SDROP = 'Beyond 680 nm, light pushes mostly photosystem I. Its hole pulls, but photosystem II is not pushing electrons in, so the relay stalls: the light is absorbed but gives little O₂ — the ‘red drop’.';
const S3 = '1957, Emerson: far-red light (beyond 700 nm) alone gave little O₂ per photon; added to shorter red light, it gave more than the 2 lights separately. Red and far-red together keep both ends of the relay busy. <b>What else does the chain make besides NADPH?</b>';

/** The beats with beat 3's sources as one staging shows them. */
function beats(emerson: Cite[]): Beat[] {
  return [
    { tag: 'Second light reaction', say: S1, cite: [MAZOR17] },
    { tag: 'NADPH', say: S2, cite: [MAZOR17] },
    { tag: 'Push and pull', say: SPP, cite: [HILL60] },
    { tag: 'Red drop', say: SDROP, cite: [LEWIS43, EMERSON57] },
    { tag: 'Emerson’s enhancement', say: S3, cite: emerson },
  ];
}

/** m1 (lamps and an O₂ count) and the animation's default beats. */
export const PSIM: Beat[] = beats([EMERSON57, EMERSON58]);
/** m2: the 1957 quantum-yield curves redrawn, then the enhancement. */
export const PSIM_M2: Beat[] = beats([EMERSON57, EMERSON58]);
/** m3: the two photosystems' absorption, shapes approximate. */
export const PSIM_M3: Beat[] = beats([EMERSON57, LAISK14]);
/** m4: the Z-scheme. */
export const PSIM_M4: Beat[] = beats([EMERSON57, HILL60]);
