// Captions and sources of chunk pp's animations (slides 11–13: excess light, photoprotection and repair, chlorophyll
// fluorescence; overnight build 28 Oct 2026, for the lecturer's pick). Scripts: research/redo-2026-10-28/reports/REPORT_pp.md,
// tightened against the animation rules (≈ 30–40 s, captions in exact words, every element named, ending on the question
// the next slide answers). Stagings that tell the story another way carry their own beats (PP11_GRAPH, …); the main beats
// are those of the zoom stagings (A, B).
import type { Beat, Cite } from './types';

export const MURCHIE11: Cite = { label: 'Murchie & Niyogi 2011, Plant Physiol.', url: 'https://doi.org/10.1104/pp.110.168831' };
export const RODRIGUEZ08: Cite = { label: 'Rodríguez-Calcerrada et al. 2008, Tree Physiol.', url: 'https://doi.org/10.1093/treephys/28.5.761' };
export const POSPISIL16: Cite = { label: 'Pospíšil 2016, Front. Plant Sci.', url: 'https://doi.org/10.3389/fpls.2016.01950' };
export const PORCAR21: Cite = { label: 'Porcar-Castell et al. 2021, Nat. Plants', url: 'https://doi.org/10.1038/s41477-021-00980-4' };
export const LI00: Cite = { label: 'Li et al. 2000, Nature', url: 'https://doi.org/10.1038/35000131' };
export const TYYSTJARVI96: Cite = { label: 'Tyystjärvi & Aro 1996, PNAS', url: 'https://doi.org/10.1073/pnas.93.5.2213' };
export const JARVI15: Cite = { label: 'Järvi, Suorsa & Aro 2015, BBA Bioenerg.', url: 'https://doi.org/10.1016/j.bbabio.2015.01.006' };
export const KROMDIJK16: Cite = { label: 'Kromdijk et al. 2016, Science', url: 'https://doi.org/10.1126/science.aai8878' };
export const BJORKMAN87: Cite = { label: 'Björkman & Demmig 1987, Planta', url: 'https://doi.org/10.1007/BF00402983' };
export const RUBAN16: Cite = { label: 'Ruban 2016, Plant Physiol.', url: 'https://doi.org/10.1104/pp.15.01935' };
export const GUANTER14: Cite = { label: 'Guanter et al. 2014, PNAS', url: 'https://doi.org/10.1073/pnas.1320008111' };
export const KAUTSKY31: Cite = { label: 'Kautsky & Hirsch 1931, Naturwissenschaften', url: 'https://doi.org/10.1007/BF01516164' };
export const SCHREIBER25: Cite = { label: 'Schreiber & Lichtenthaler 2025, Photosynthetica', url: 'https://doi.org/10.32615/ps.2025.007' };

/* ---------------------------------------------------------------- slide 11 · Excess light */

const Q11 = '<b>How does the leaf protect photosystem II, and repair it?</b>';

/** Slide 11, stagings A and B (zoom into photosystem II on the chain): the three exits first, then the light rises. */
export const PP11: Beat[] = [
  { tag: 'Three exits', say: 'Energy absorbed by photosystem II leaves by three exits: photochemistry, heat or fluorescence. In weak light, most of it goes to photochemistry.', cite: [RODRIGUEZ08, PORCAR21] },
  { tag: 'Noon', say: 'Towards noon the light rises, but CO₂ fixation levels off: the leaf absorbs more energy than it can use. The share of photochemistry falls; heat (NPQ) takes most.', cite: [MURCHIE11, RODRIGUEZ08] },
  { tag: 'Singlet oxygen', say: 'Energy that finds no exit passes to O₂ and forms singlet oxygen, which damages the D1 protein of photosystem II.', cite: [MURCHIE11, POSPISIL16] },
  { tag: 'Back to the chain', say: Q11, cite: [MURCHIE11] },
];

/** Slide 11, staging C (graph-led): the energy balance first, then where the excess goes, then the real structure. */
export const PP11_GRAPH: Beat[] = [
  { tag: 'Light saturation', say: 'As the light rises, a leaf absorbs more and more energy, but CO₂ fixation levels off. The gap is excess energy.', cite: [MURCHIE11] },
  { tag: 'Three exits', say: 'In photosystem II the energy leaves by photochemistry, heat (NPQ) or fluorescence. In strong light, more than half leaves as heat.', cite: [RODRIGUEZ08, PORCAR21] },
  { tag: 'Singlet oxygen', say: 'Energy that finds no exit forms singlet oxygen, in the antenna and in the reaction centre. It damages the D1 protein of photosystem II.', cite: [POSPISIL16, MURCHIE11] },
  { tag: 'Back to the chain', say: Q11, cite: [MURCHIE11] },
];

/** Slide 11, staging D (side by side): weak and strong light at once. */
export const PP11_PAIR: Beat[] = [
  { tag: 'Weak and strong light', say: 'Oak leaves in weak and in strong light. In weak light most absorbed energy goes to photochemistry; in strong light more than half leaves as heat (NPQ).', cite: [RODRIGUEZ08] },
  { tag: 'Singlet oxygen', say: 'In strong light, energy that finds no exit passes to O₂ and forms singlet oxygen, which damages the D1 protein of photosystem II.', cite: [MURCHIE11, POSPISIL16] },
  { tag: 'Back to the chain', say: Q11, cite: [MURCHIE11] },
];

/* ---------------------------------------------------------------- slide 12 · Photoprotection and repair */

const Q12 = '<b>How can we see NPQ and damage in a living leaf?</b>';

/** Slide 12, stagings A and B (zoom into photosystem II on the chain). */
export const PP12: Beat[] = [
  { tag: 'Acidic lumen', say: 'In excess light, H⁺ pile up in the lumen faster than ATP synthase lets them out: the lumen becomes acidic.', cite: [MURCHIE11] },
  { tag: 'PsbS and zeaxanthin', say: 'Low lumen pH activates PsbS and turns violaxanthin into zeaxanthin. The antenna of photosystem II now dissipates the excess as heat: non-photochemical quenching (NPQ).', cite: [LI00, MURCHIE11] },
  { tag: 'No PsbS, no NPQ', say: '2000: an <i>Arabidopsis</i> mutant that built little NPQ lacked one protein, PsbS. Giving the gene back restored NPQ.', cite: [LI00] },
  { tag: 'Damage and repair', say: 'Light still damages D1, in proportion to light. The leaf replaces damaged D1 continuously.', cite: [TYYSTJARVI96, JARVI15] },
  { tag: 'A passing cloud', say: `In shade, NPQ switches off slowly and wastes light. Tobacco engineered to switch it off faster made ≈ 15 % more dry weight in the field. ${Q12}`, cite: [KROMDIJK16] },
];

/** Slide 12, staging C (history-led): the PsbS mutant first, then the mechanism, the repair cycle and the field. */
export const PP12_HISTORY: Beat[] = [
  { tag: 'No PsbS, no NPQ', say: '2000: an <i>Arabidopsis</i> mutant that built little heat dissipation (NPQ) lacked one protein, PsbS. Giving the gene back restored NPQ.', cite: [LI00] },
  { tag: 'PsbS and zeaxanthin', say: 'In excess light, H⁺ fill the lumen. H⁺ bind PsbS, and violaxanthin turns into zeaxanthin: the antenna of photosystem II dissipates the excess as heat.', cite: [LI00, MURCHIE11] },
  { tag: 'D1 repair', say: 'Light still damages D1, in proportion to light. Damaged photosystem II moves to the unstacked membrane, its D1 is replaced, and it returns to the grana.', cite: [TYYSTJARVI96, JARVI15] },
  { tag: 'A passing cloud', say: `In shade, NPQ switches off slowly and wastes light. Tobacco engineered to switch it off faster made ≈ 15 % more dry weight in the field. ${Q12}`, cite: [KROMDIJK16] },
];

/** Slide 12, staging D (side by side): wild type vs no PsbS, then wild type vs faster NPQ relaxation. */
export const PP12_PAIR: Beat[] = [
  { tag: 'With and without PsbS', say: 'Wild type and a mutant without PsbS (<i>npq4</i>) in the same strong light: H⁺ fill both lumens, but only the wild type turns on heat dissipation (NPQ).', cite: [LI00] },
  { tag: 'A passing cloud', say: 'After the light drops, NPQ of wild-type tobacco relaxes slowly. Tobacco with more violaxanthin de-epoxidase, PsbS and zeaxanthin epoxidase (VPZ) relaxes it faster.', cite: [KROMDIJK16] },
  { tag: 'In the field', say: `In a field trial, the VPZ tobacco made ≈ 15 % more dry weight than the wild type. ${Q12}`, cite: [KROMDIJK16] },
];

/* ---------------------------------------------------------------- slide 13 · Chlorophyll fluorescence */

const Q13 = '<b>Light has made ATP and NADPH: how does the leaf turn CO₂ into sugar?</b>';

// Kautsky & Hirsch 1931, as told by Schreiber & Lichtenthaler 2025 (full text read 28 Oct 2026): in a darkened room at the
// University of Heidelberg they lit a dark-adapted leaf with strong UV light and watched it with bare eyes; the red
// fluorescence rose within a second to a severalfold higher peak, then declined within minutes to a low steady level, which
// they read as the induction of CO₂ assimilation. Pumpkin values: Tyystjärvi & Aro 1996, Fig. 1A (Fv/Fm 0.83 before light;
// 0.52 after 4.6 h at 548 µmol m⁻² s⁻¹ in lincomycin, which blocks D1 repair).
const KAUTSKY_SAY = '1931, Heidelberg: Kautsky and Hirsch lit a dark-kept leaf with strong UV light. They saw its red glow rise within a second, then fade over minutes as photosynthesis started.';
const EXITS_SAY = 'Open reaction centres of photosystem II use the energy for photochemistry and fluoresce little; once they are closed, more energy leaves as fluorescence.';
const FV = 'F<sub>v</sub>/F<sub>m</sub>', FO = 'F<sub>o</sub>', FM = 'F<sub>m</sub>', FM1 = 'F<sub>m</sub>′', FS = 'F<sub>s</sub>';
const ORBIT_SAY = `From orbit, satellites measure the same chlorophyll fluorescence of plants in sunlight; the US Corn Belt glows brightest. ${Q13}`;

/** Slide 13, staging A (one zoom-out: photosystem II → leaf clip → field → Earth). */
export const PP13: Beat[] = [
  { tag: 'Heidelberg, 1931', say: KAUTSKY_SAY, cite: [KAUTSKY31, SCHREIBER25] },
  { tag: 'Competing exits', say: EXITS_SAY, cite: [SCHREIBER25, RUBAN16] },
  { tag: 'Saturating pulse', say: `A saturating pulse closes every reaction centre: fluorescence jumps from ${FO} to ${FM}. In a healthy pumpkin leaf, ${FV} = 0.83.`, cite: [TYYSTJARVI96, BJORKMAN87] },
  { tag: 'Stress', say: `A pumpkin leaf after 4.6 h in strong light with D1 repair blocked: the pulse peak is lower, and ${FV} falls from 0.83 to 0.52.`, cite: [TYYSTJARVI96] },
  { tag: 'From space', say: `From the air and from orbit, sensors measure the same chlorophyll fluorescence of plants in sunlight; the US Corn Belt glows brightest. ${Q13}`, cite: [PORCAR21, GUANTER14] },
];

/** Slide 13, staging B (history-led: Kautsky's glow, then a real PAM trace recorded pulse by pulse). */
export const PP13_HIST: Beat[] = [
  { tag: 'Heidelberg, 1931', say: KAUTSKY_SAY, cite: [KAUTSKY31, SCHREIBER25] },
  { tag: 'Competing exits', say: EXITS_SAY, cite: [SCHREIBER25, RUBAN16] },
  { tag: 'Saturating pulse', say: `Today a fluorometer measures it: weak measuring light gives ${FO}; a saturating pulse closes every reaction centre and gives ${FM}. Healthy leaves reach ${FV} ≈ 0.83.`, cite: [RUBAN16, BJORKMAN87] },
  { tag: 'In the light', say: `In actinic light the pulses reach only ${FM1}: ${FS} and ${FM1} give photochemistry (Φ<sub>PSII</sub>) and heat dissipation (NPQ). In the dark, NPQ relaxes.`, cite: [RUBAN16] },
  { tag: 'From space', say: ORBIT_SAY, cite: [GUANTER14] },
];

/** Slide 13, staging C (a real PAM trace, with the photosystem II population beside it). */
export const PP13_TRACE: Beat[] = [
  { tag: 'Dark-adapted', say: `A dark-adapted <i>Arabidopsis</i> leaf in weak measuring light: every reaction centre of photosystem II is open, and fluorescence is low: ${FO}.`, cite: [RUBAN16] },
  { tag: 'Saturating pulse', say: `A saturating pulse closes every reaction centre for a moment: fluorescence peaks at ${FM}. Healthy leaves reach ${FV} ≈ 0.83.`, cite: [RUBAN16, BJORKMAN87] },
  { tag: 'Actinic light', say: `Actinic light closes part of the centres and switches on heat dissipation in the antenna (NPQ): fluorescence settles at ${FS}, and pulses reach only ${FM1}.`, cite: [RUBAN16] },
  { tag: 'Dark again', say: `In the dark, heat dissipation relaxes and the pulse peaks recover towards ${FM}. ${Q13}`, cite: [RUBAN16] },
];

/** Slide 13, staging D (side by side: a healthy and a damaged pumpkin leaf under the same pulse). */
export const PP13_PAIR: Beat[] = [
  { tag: 'Two leaves', say: `Two dark-adapted pumpkin leaves: one healthy, one after 4.6 h in strong light with D1 repair blocked. Weak measuring light gives ${FO}.`, cite: [TYYSTJARVI96] },
  { tag: 'Same pulse', say: `The same saturating pulse: the healthy leaf reaches ${FV} = 0.83; the damaged leaf a lower peak, ${FV} = 0.52.`, cite: [TYYSTJARVI96, BJORKMAN87] },
  { tag: 'From space', say: ORBIT_SAY, cite: [GUANTER14] },
];
