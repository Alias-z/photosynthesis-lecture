// Captions and sources of the two light-block animations. SKY and LIFE are the v5 captions the lecturer approved on
// 26 Oct 2026 (research/figure-briefs/ORDER_PROPOSAL.md v5), split for pauses at each scene change (round 3: Earth
// turns / Sunset, On land / Primates); the C and D variants stage them. SKY_R1 and LIFE_R1 are
// the round-1 captions that the A and B variants were built for, kept so those stay drawable as references.
import type { Beat, Cite } from './types';

const RAYLEIGH: Cite = { label: 'Rayleigh 1871, Phil. Mag.', url: 'https://doi.org/10.1080/14786447108640452' };
const KASTEN: Cite = { label: 'Kasten & Young 1989, Appl. Opt.', url: 'https://doi.org/10.1364/AO.28.004735' };
const GUEYMARD: Cite = { label: 'Gueymard 2004, Sol. Energy', url: 'https://doi.org/10.1016/j.solener.2003.08.039' };
const LAMB: Cite = { label: 'Lamb, Collin & Pugh 2007, Nat. Rev. Neurosci.', url: 'https://doi.org/10.1038/nrn2283' };
const SMITH_BAKER: Cite = { label: 'Smith & Baker 1981, Appl. Opt.', url: 'https://doi.org/10.1364/AO.20.000177' };
const DOMINY: Cite = { label: 'Dominy & Lucas 2001, Nature', url: 'https://doi.org/10.1038/35066567' };
const BRISCOE: Cite = { label: 'Briscoe & Chittka 2001, Annu. Rev. Entomol.', url: 'https://doi.org/10.1146/annurev.ento.46.1.471' };
const KOSKI: Cite = { label: 'Koski & Ashman 2015, Nature Plants', url: 'https://doi.org/10.1038/nplants.2014.7' };
const JACOBS: Cite = { label: 'Jacobs 2009, Phil. Trans. R. Soc. B', url: 'https://doi.org/10.1098/rstb.2009.0039' };
const MELIN: Cite = { label: 'Melin et al. 2017, PNAS', url: 'https://doi.org/10.1073/pnas.1705957114' };
const PEITSCH: Cite = { label: 'Peitsch et al. 1992, J. Comp. Physiol. A', url: 'https://doi.org/10.1007/BF00190398' };
const TELFER: Cite = { label: 'Telfer 2014, Plant Cell Physiol.', url: 'https://doi.org/10.1093/pcp/pcu040' };

/** Animation 1, after the slide 2 lead page: light is a wave, and air scatters the short wavelengths most. */
export const SKY: Beat[] = [
  { tag: 'Sunlight', say: 'Sunlight is a mix of wavelengths, from ultraviolet through visible light to infrared.', cite: [GUEYMARD] },
  { tag: 'In the air', say: 'Air scatters short wavelengths far more than long ones: blue about four times more than red.', cite: [RAYLEIGH] },
  { tag: 'Blue sky', say: 'Scattered blue reaches you from the whole sky, so the sky looks blue.', cite: [RAYLEIGH] },
  { tag: 'Earth turns', say: 'Hours later, at sunset, sunlight crosses far more air to reach you.', cite: [KASTEN] },
  { tag: 'Sunset', say: 'On that long path most of the blue is scattered away, leaving red and orange.', cite: [RAYLEIGH, KASTEN] },
];

/** Animation 2, after the slide 3 wave page: each living thing uses its own slice of light, and why is the question
 *  the photon slide answers. */
export const LIFE: Beat[] = [
  {
    tag: 'In the sea',
    say: 'Our ancestors lived in the sea. Water absorbs red light within a few metres; blue-green goes deepest.',
    cite: [LAMB, SMITH_BAKER],
  },
  {
    tag: 'On land',
    say: 'Our ancestors moved onto land. Most mammals see red and green as one colour.',
    cite: [{ label: 'Daeschler et al. 2006, Nature', url: 'https://doi.org/10.1038/nature04639' }, JACOBS],
  },
  { tag: 'Primates', say: 'Our primate ancestors gained a third colour receptor: red fruit and young leaves stand out against green.', cite: [JACOBS, DOMINY, MELIN] },
  { tag: 'Bees', say: 'Bees see ultraviolet, blue and green; red looks dark to them. Many flowers show them ultraviolet patterns that we cannot see.', cite: [BRISCOE, PEITSCH, KOSKI] },
  {
    tag: 'Plants',
    say: 'Plants use light to make sugar. Their chlorophyll absorbs mostly blue and red.',
    cite: [{ label: 'Croce & van Amerongen 2014, Nat. Chem. Biol.', url: 'https://doi.org/10.1038/nchembio.1555' }],
  },
  { tag: 'So why?', say: 'Each living thing uses its own slice of light. <b>What is physically different about each slice?</b>', cite: [] },
];

const KUHN: Cite = { label: 'Kuhn 1949, J. Chem. Phys.', url: 'https://doi.org/10.1063/1.1747143' };
const LICHTENTHALER: Cite = { label: 'Lichtenthaler 1987, Methods Enzymol.', url: 'https://doi.org/10.1016/0076-6879(87)48036-1' };
const CROCE14: Cite = { label: 'Croce & van Amerongen 2014, Nat. Chem. Biol.', url: 'https://doi.org/10.1038/nchembio.1555' };
const VAN_AM13: Cite = { label: 'van Amerongen & Croce 2013, Photosynth. Res.', url: 'https://doi.org/10.1007/s11120-013-9824-3' };

/** Animation 3, played from slide 4b: why pigments differ (ANIM_PIGMENTS_FATES.md, approved 26 Oct 2026). Pigments in the
 *  order chlorophyll a, chlorophyll b, carotenoids (lecturer, 27 Oct 2026). */
export const PIGMENTS: Beat[] = [
  { tag: 'Into the molecule', say: 'Chlorophyll’s absorbing electrons spread over its ring of alternating single and double bonds.', cite: [CROCE14] },
  { tag: 'Chl <i>a</i> → Chl <i>b</i>', say: 'Chlorophyll <i>b</i> differs by one group, which shifts both of its absorption bands.', cite: [LICHTENTHALER] },
  { tag: 'Longer chain, longer wavelength', say: 'Electrons that can move along a longer chain need less energy to jump, so they absorb longer wavelengths.', cite: [KUHN] },
  { tag: 'Carotenoids', say: 'Carotenoids’ long chain absorbs blue to blue-green light.', cite: [CROCE14, LICHTENTHALER] },
  { tag: 'Together', say: 'Chl <i>a</i>, Chl <i>b</i> and carotenoids absorb at different wavelengths; together they absorb most blue and red, and least green.', cite: [CROCE14] },
];

/** Animation 4, played from slide 12: the fates of an excitation (ANIM_PIGMENTS_FATES.md, approved 26 Oct 2026). */
export const FATES: Beat[] = [
  { tag: 'Absorb', say: 'A photon lifts an electron to an excited state in femtoseconds.', cite: [VAN_AM13] },
  { tag: 'Relax', say: 'Extra energy is lost as heat within a picosecond; every excitation ends in S₁.', cite: [VAN_AM13] },
  { tag: 'Photochemistry', say: 'With the reaction centre open, most excitations end in photochemistry.', cite: [VAN_AM13] },
  { tag: 'Fluorescence', say: 'With the reaction centre closed, more energy leaves as fluorescence.', cite: [{ label: 'Murchie & Lawson 2013, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/ert208' }] },
  { tag: 'Heat (NPQ)', say: 'In excess light, protective quenching (NPQ) turns more of it into heat.', cite: [{ label: 'Murchie & Lawson 2013, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/ert208' }] },
  { tag: 'Triplet', say: 'When excitation lingers, a triplet can form and make damaging singlet oxygen. Carotenoids catch triplets in the antenna, but not in the reaction centre.', cite: [{ label: 'Krieger-Liszkay 2005, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erh237' }, TELFER] },
];

/** Animation 5, played from slide 5: dim vs bright light, side by side at three scales, with no dive (the pigments
 *  animation from slide 4a already zooms from leaf to chloroplast; lecturer, 27 Oct 2026). */
export const LEAF: Beat[] = [
  { tag: 'Chloroplasts move', say: '1908, Gustav Senn: chloroplasts move within minutes. In dim light they gather on the walls that face the light; in bright light they move to the side walls.', cite: [{ label: 'Chazdon & Pearcy 1991, BioScience', url: 'https://doi.org/10.2307/1311725' }, { label: 'Kataoka 2015, J. Integr. Plant Biol.', url: 'https://doi.org/10.1111/jipb.12311' }] },
  { tag: 'Grana', say: 'Thylakoid membranes stack into grana: up to ≈ 100 thylakoids per granum in deep shade, < 10 in sun leaves.', cite: [{ label: 'Anderson 1986, Annu. Rev. Plant Physiol.', url: 'https://doi.org/10.1146/annurev.pp.37.060186.000521' }] },
  { tag: 'Stacked and unstacked', say: 'The stacks hold photosystem II (PSII) and its antenna. Photosystem I (PSI) and ATP synthase have stroma-side parts too large for the 3–4 nm gap between stacked membranes, so they sit in the unstacked membranes. <b>Do all these chlorophylls do the chemistry?</b>', cite: [{ label: 'Andersson & Anderson 1980, Biochim. Biophys. Acta', url: 'https://doi.org/10.1016/0005-2728(80)90078-X' }] },
];

/** Animation 6, played from slide 6: from the flash experiment to the reaction centre (PLAN_SLIDES_5-6, 27 Oct 2026). */
export const ANTENNA: Beat[] = [
  { tag: 'Emerson & Arnold', say: '1932, Emerson and Arnold: even the brightest flash gives one O₂ per ~2,400 chlorophylls. Most chlorophylls only collect light.', cite: [{ label: 'Emerson & Arnold 1932, J. Gen. Physiol.', url: 'https://doi.org/10.1085/jgp.16.2.191' }] },
  { tag: 'Antenna', say: 'They form an antenna: ≈ 300 chlorophylls serve one reaction centre.', cite: [{ label: 'Su et al. 2017, Science', url: 'https://doi.org/10.1126/science.aan0327' }] },
  { tag: 'To the reaction centre', say: 'The energy hops from pigment to pigment, downhill from Chl <i>b</i> to Chl <i>a</i>, until the reaction centre traps it. <b>What does the reaction centre do with it?</b>', cite: [CROCE14] },
];

const SHEVELA23: Cite = { label: 'Shevela et al. 2023, Photosynth. Res.', url: 'https://doi.org/10.1007/s11120-022-00991-y' };

/** Animation 7, played from slide 7: on the slide's chain, the reaction centre sends an electron to plastoquinone, takes a
 *  new one from water, and plastoquinone carries two on (script approved by the lecturer, 27 Oct 2026; stagings psii7-a,
 *  psii7-b). */
export const PSII: Beat[] = [
  { tag: 'Charge separation', say: 'The reaction centre uses the energy to send an electron across the membrane, to plastoquinone. <b>Where does it get a new electron?</b>', cite: [SHEVELA23] },
  { tag: 'Water or CO₂?', say: '1941, Ruben and Kamen gave algae heavy oxygen, either in the water or in the CO₂. Only heavy water gave heavy O₂: the O₂, and the electrons, come from water.', cite: [{ label: 'Ruben, Randall, Kamen & Hyde 1941, J. Am. Chem. Soc. 63: 877', url: 'https://doi.org/10.1021/ja01848a512' }] },
  { tag: 'Water splitting', say: 'Photosystem II splits water: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. The electrons refill the reaction centre; the H⁺ stay in the lumen.', cite: [SHEVELA23] },
  { tag: 'Plastoquinone', say: 'Plastoquinone takes two electrons, with two H⁺ from the stroma, and carries them on in the membrane. <b>Where do they go next?</b>', cite: [SHEVELA23] },
];

/** Round 1 (staged by sky A and B). */
export const SKY_R1: Beat[] = [
  { tag: 'Sunlight', say: 'Sunlight is a mix of wavelengths, from ultraviolet through visible light to infrared.', cite: [GUEYMARD] },
  {
    tag: 'In the air',
    say: 'Air molecules are over a thousand times smaller than these wavelengths. They scatter short wavelengths far more: blue about 4.4 times more than red.',
    cite: [RAYLEIGH],
  },
  {
    tag: 'Blue sky',
    say: 'Scattered blue reaches you from the whole sky, so the sky looks blue.',
    cite: [RAYLEIGH, { label: 'Smith 2005, Am. J. Phys.', url: 'https://doi.org/10.1119/1.1858479' }],
  },
  { tag: 'Earth turns', say: 'At sunset, sunlight crosses almost 40 times more air to reach you.', cite: [KASTEN] },
  { tag: 'Red Sun', say: 'Most of the blue is scattered out of the beam on the way, leaving red and orange.', cite: [RAYLEIGH, KASTEN] },
];

/** Round 1 (staged by life A and B). */
export const LIFE_R1: Beat[] = [
  {
    tag: 'In the sea',
    say: 'Our eyes trace back to sea animals over half a billion years ago. Water absorbs infrared and red within metres; blue-green goes deepest.',
    cite: [LAMB, { label: 'Hale & Querry 1973, Appl. Opt.', url: 'https://doi.org/10.1364/AO.12.000555' }, SMITH_BAKER],
  },
  {
    tag: 'In the trees',
    say: 'Much later, primates evolved a third cone for red–green vision: ripe fruit and young reddish leaves stand out against green.',
    cite: [
      { label: 'Nathans et al. 1986, Science', url: 'https://doi.org/10.1126/science.2937147' },
      DOMINY,
      { label: 'Dartnall et al. 1983, Proc. R. Soc. B', url: 'https://doi.org/10.1098/rspb.1983.0091' },
    ],
  },
  {
    tag: 'Bees',
    say: 'Bees see ultraviolet, blue and green. Many flowers carry ultraviolet patterns that we cannot see.',
    cite: [BRISCOE, { label: 'Peitsch et al. 1992, J. Comp. Physiol. A', url: 'https://doi.org/10.1007/BF00190398' }, KOSKI],
  },
  {
    tag: 'Plants',
    say: 'Plants absorb light to make sugar. Chlorophyll takes blue and red; red algae add phycoerythrin for green; some cyanobacteria use far-red beyond 700 nm.',
    cite: [
      { label: 'Zhang et al. 2017, Nature', url: 'https://doi.org/10.1038/nature24278' },
      { label: 'Chen et al. 2010, Science', url: 'https://doi.org/10.1126/science.1191127' },
      { label: 'Gan et al. 2014, Science', url: 'https://doi.org/10.1126/science.1256963' },
    ],
  },
  { tag: 'So which band?', say: 'Eyes and leaves work in almost the same band of light. <b>Which band, and why that one?</b>', cite: [] },
];

/** Animation after slide 8, cytochrome b₆f (script approved by the lecturer, 27 Oct 2026; staged by b6f8-a and b6f8-b). */
const MALONE19: Cite = { label: 'Malone et al. 2019, Nature', url: 'https://doi.org/10.1038/s41586-019-1746-6' };
const MALONE21: Cite = { label: 'Malone et al. 2021, BBA Bioenerg.', url: 'https://doi.org/10.1016/j.bbabio.2021.148380' };
export const B6F: Beat[] = [
  { tag: 'Hand-over', say: 'Plastoquinone docks at cytochrome b₆f and hands over its two electrons; its two H⁺ are released into the lumen.', cite: [MALONE19] },
  { tag: 'Plastocyanin', say: 'Cytochrome b₆f passes the electrons one at a time to plastocyanin, a small copper protein that carries each through the lumen.', cite: [MALONE19] },
  { tag: 'H⁺ in the lumen', say: 'With every plastoquinone, more H⁺ collect in the lumen. <b>Where does plastocyanin take the electron?</b>', cite: [MALONE21] },
];
