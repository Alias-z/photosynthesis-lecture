// Beats of the chunk cc animations (lecture 2, slides C11–C13), 28 Oct 2026. Captions name every element; every number
// is in a paper that was read (full text unless marked): see src/assets/SOURCES-cc.md and the animation report.
import type { Beat, Cite } from './types';

const BUSCH13: Cite = { label: 'Busch, Sage, Cousins & Sage 2013, Plant Cell Environ.', url: 'https://doi.org/10.1111/j.1365-3040.2012.02567.x' };
const SAGE09: Cite = { label: 'Sage & Sage 2009, Plant Cell Physiol.', url: 'https://doi.org/10.1093/pcp/pcp033' };
const RAWS88: Cite = { label: 'Rawsthorne, Hylton, Smith & Woolhouse 1988, Planta', url: 'https://doi.org/10.1007/BF00401016' };
const SAGE12: Cite = { label: 'Sage, Sage & Kocacinar 2012, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' };
const BUSCH20: Cite = { label: 'Busch 2020, Plant J.', url: 'https://doi.org/10.1111/tpj.14674' };
const SAGE14: Cite = { label: 'Sage, Khoshravesh & Sage 2014, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/eru180' };

/** C11 · Refixation of photorespired CO₂ → C₂ (stagings A, C, D tell it in this order). */
export const CC11: Beat[] = [
  { tag: 'Where CO₂ is released', say: 'In rice and wheat leaves, chloroplasts and stromules line the cell wall that faces the air spaces. The mitochondria, where photorespiration releases CO₂, lie behind them.', cite: [SAGE09, BUSCH13] },
  { tag: 'Refixation', say: 'To leave the cell, that CO₂ must cross chloroplast stroma, where RuBisCO refixes part of it: 29 % in rice, 26 % in wheat. Net CO₂ uptake rises by 11 % and 9 %.', cite: [BUSCH13] },
  { tag: 'How it was measured', say: '2013, Florian Busch and Rowan Sage switched rice leaves to ¹³CO₂: the ¹²CO₂ still coming out had escaped refixation. In a flood of ¹³CO₂, RuBisCO almost never meets ¹²CO₂, and about twice as much came out.', cite: [BUSCH13] },
  { tag: 'C₂ photosynthesis', say: 'C₂ plants go further: their mesophyll mitochondria lack glycine decarboxylase, so glycine moves into the bundle sheath. There its CO₂ is released behind a layer of chloroplasts, next to RuBisCO.', cite: [RAWS88, SAGE12] },
  { tag: 'Toward C₄', say: 'Living <i>Flaveria</i> species show each step from C₃ through C₂ to C₄. <b>What if a plant pumped CO₂ to RuBisCO instead of catching what photorespiration releases?</b>', cite: [SAGE14] },
];

/** C11, staging B: the experiment first, then where the missing CO₂ went. */
export const CC11_EXP: Beat[] = [
  { tag: 'The experiment', say: '2013, Florian Busch and Rowan Sage switched rice leaves to ¹³CO₂: the ¹²CO₂ still coming out had escaped refixation. In a flood of ¹³CO₂, RuBisCO almost never meets ¹²CO₂, and about twice as much came out.', cite: [BUSCH13] },
  { tag: 'Where it was caught', say: 'About half of the CO₂ from the mitochondria never left the leaf. In rice, chloroplasts and stromules line the wall that faces the air spaces, and the mitochondria lie behind them.', cite: [SAGE09, BUSCH13] },
  CC11[1],
  CC11[3],
  CC11[4],
];

/** C11, staging D: rice next to tobacco, then the six-species data, then C₃ next to C₂. */
export const CC11_SIDE: Beat[] = [
  { tag: 'Rice and tobacco', say: 'Rice chloroplasts, bridged by stromules, cover 99 % of the cell wall facing the air spaces; tobacco chloroplasts cover about 60 % and leave gaps.', cite: [BUSCH13] },
  { tag: 'Refixation', say: 'CO₂ released behind a chloroplast must cross its stroma, where RuBisCO can refix it; CO₂ released under a gap leaves the cell directly.', cite: [BUSCH20, BUSCH13] },
  { tag: 'Six C₃ species', say: 'The more of the wall chloroplasts cover, the lower the CO₂ level at which uptake just balances photorespired release: rice ≈ 46, tobacco ≈ 51, RuBisCO alone ≈ 57 µmol mol⁻¹.', cite: [BUSCH13] },
  CC11[3],
  CC11[4],
];

const HATCH66: Cite = { label: 'Hatch & Slack 1966, Biochem. J.', url: 'https://doi.org/10.1042/bj1010103' };
const HABER04: Cite = { label: 'Haberlandt 1904, Physiologische Pflanzenanatomie', url: 'https://archive.org/details/physiologischepf00habeuoft/page/252' };
const VONC21: Cite = { label: 'von Caemmerer 2021, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erab266' };
const EB77: Cite = { label: 'Ehleringer & Björkman 1977, Plant Physiol.', url: 'https://doi.org/10.1104/pp.59.1.86' };

/** C12 · C₄ photosynthesis. */
export const CC12: Beat[] = [
  { tag: 'Label in the acids', say: '1966: Marshall Hatch and Roger Slack fed sugarcane leaves ¹⁴CO₂. After about one second, more than 93 % of the fixed ¹⁴C was in four-carbon acids (malate, aspartate, oxaloacetate), not in 3-PGA.', cite: [HATCH66] },
  { tag: 'Kranz anatomy', say: 'C₄ leaves have two kinds of photosynthetic cells: mesophyll cells, and a wreath (German: Kranz) of bundle-sheath cells around each vein, named by Gottlieb Haberlandt in 1904.', cite: [HABER04, SAGE12] },
  { tag: 'The CO₂ pump', say: 'In the mesophyll, PEP carboxylase fixes HCO₃⁻ into a C₄ acid; it does not react with O₂. The acid moves into the bundle sheath and releases CO₂ next to RuBisCO: ≈ 1500 µmol mol⁻¹ there, ≈ 100 in the mesophyll.', cite: [SAGE12] },
  { tag: 'ATP cost of the CO₂ pump', say: 'Regenerating PEP costs 2 ATP per CO₂. Below about 30 °C a C₃ leaf fixes more CO₂ per photon; above it, a C₄ leaf does. <b>C₄ separates the two steps in space. Could a plant separate them in time?</b>', cite: [VONC21, EB77] },
];

const BORLAND09: Cite = { label: 'Borland, Griffiths, Hartwell & Smith 2009, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erp118' };
const ABRAHAM16: Cite = { label: 'Abraham et al. 2016, Nature Plants', url: 'https://doi.org/10.1038/nplants.2016.178' };
const HEYNE15: Cite = { label: 'Heyne 1815, Trans. Linn. Soc. Lond.', url: 'https://archive.org/details/transactionsofli11lond/page/213' };

/** C13 · Crassulacean acid metabolism (CAM). */
export const CC13: Beat[] = [
  { tag: 'Night', say: 'At night a CAM leaf opens its stomata. PEP carboxylase fixes the CO₂, and the leaf stores it as malic acid in the vacuole.', cite: [BORLAND09, ABRAHAM16] },
  { tag: 'Day', say: 'By day the stomata stay shut. Malic acid leaves the vacuole and releases its CO₂, which RuBisCO fixes with ATP and NADPH from the light reactions.', cite: [BORLAND09] },
  { tag: 'The record', say: 'Measured on <i>Kalanchoë fedtschenkoi</i>: CO₂ uptake runs through the night (phase I) and stops for hours after dawn (phase III), while malic acid feeds RuBisCO behind closed stomata.', cite: [BORLAND09] },
  { tag: 'Water', say: 'Night air is cooler and more humid, so each CO₂ costs less water: CAM plants gain 4–10 mmol CO₂ per mol water, C₃ plants 0.5–1.5. <b>All three tricks raise CO₂ around RuBisCO: what happens to crops when the air itself holds more CO₂?</b>', cite: [BORLAND09] },
];

/** C13, staging B: Heyne's sour leaves first. */
export const CC13_HIST: Beat[] = [
  { tag: 'Sour in the morning', say: '1815, Benjamin Heyne, from India: the leaves of <i>Bryophyllum calycinum</i> are “in the morning as acid as sorrel”, and tasteless about noon.', cite: [HEYNE15] },
  ...CC13,
];

/** C12, staging D: a C₃ and a C₄ leaf side by side, at a cool and a hot leaf temperature. */
export const CC12_SIDE: Beat[] = [
  { tag: 'Two leaves', say: 'A C₃ leaf fixes CO₂ with RuBisCO in its mesophyll cells. A C₄ leaf adds a wreath (German: Kranz) of bundle-sheath cells around each vein, and its RuBisCO works there.', cite: [SAGE12, HABER04] },
  CC12[2],
  { tag: 'A cool leaf', say: 'Measured in normal air at 14 °C: per 1000 absorbed photons, the C₃ plant <i>Encelia californica</i> fixed 69 CO₂, the C₄ plant <i>Atriplex rosea</i> 53. The pump costs 2 ATP per CO₂.', cite: [EB77, VONC21] },
  { tag: 'A hot leaf', say: 'At 38 °C, RuBisCO oxygenates more: <i>Encelia</i> fixed only 42 CO₂ per 1000 photons, <i>Atriplex</i> still 53. <b>C₄ separates the two steps in space. Could a plant separate them in time?</b>', cite: [EB77] },
];

/** C13, staging C: measured on Agave americana. */
export const CC13_AGAVE: Beat[] = [
  { tag: 'Night', say: 'At night a CAM leaf opens its stomata; PEP carboxylase fixes the CO₂, and the leaf stores it as malic acid. In <i>Agave americana</i> the acid rises to ≈ 24 mg per g leaf by dawn; in C₃ <i>Arabidopsis</i> it stays below 0.5.', cite: [ABRAHAM16, BORLAND09] },
  { tag: 'Day', say: 'By day the stomata stay shut. The malic acid falls to ≈ 5 mg per g as it releases its CO₂, which RuBisCO fixes with ATP and NADPH from the light reactions.', cite: [ABRAHAM16, BORLAND09] },
  { tag: 'Young and mature leaves', say: 'Measured on one <i>Agave</i> plant: its youngest leaf, still C₃, takes up CO₂ in the light; its mature leaf, a CAM leaf, takes it up in the dark.', cite: [ABRAHAM16] },
  CC13[3],
];

/** C13, staging D: C₄ next to CAM, the same two steps. */
export const CC13_SIDE: Beat[] = [
  { tag: 'Step 1: PEP carboxylase', say: 'C₄ and CAM plants both fix CO₂ first with PEP carboxylase, into a four-carbon acid: C₄ in the mesophyll, CAM at night, storing it as malic acid in the vacuole.', cite: [SAGE12, BORLAND09] },
  { tag: 'Step 2: RuBisCO', say: 'Both then release that CO₂ next to RuBisCO: C₄ in the bundle sheath at the same moment, CAM by day behind closed stomata. C₄ separates the two steps in space, CAM in time.', cite: [SAGE12, BORLAND09] },
  CC13[2],
  CC13[3],
];
