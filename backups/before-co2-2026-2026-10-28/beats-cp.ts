// Captions and sources of the CO₂-path animations (chunk cp, 28 Oct 2026; scripts in research/redo-2026-10-28/
// cp-PLOT_TEXT_ANIM.md, tightened in the cp-anim report). cp9 plays from slide C9 (measuring leaf gas exchange) and ends
// on the question C10 answers; cp10 plays from slide C10 (the CO₂ diffusion pathway) and ends on the question C11
// answers (keeping CO₂ high at RuBisCO, starting with recapturing photorespired CO₂). CP9 and CP10 are the stagings A;
// the other stagings tell the same facts in their own order and carry their own beats (Staging.beats).
import type { Beat, Cite } from './types';

const BUSCH24: Cite = { label: 'Busch et al. 2024, Plant Cell Environ.', url: 'https://doi.org/10.1111/pce.14815' };
const GAASTRA59: Cite = { label: 'Gaastra 1959, Meded. Landbouwhogesch. Wageningen', url: 'https://edepot.wur.nl/291215' };
const VCF81: Cite = { label: 'von Caemmerer & Farquhar 1981, Planta', url: 'https://doi.org/10.1007/BF00384257' };
const LICOR: Cite = { label: 'LI-COR LI-6800 manual', url: 'https://www.licor.com/support/LI-6800/topics/introduction.html' };
const DU20: Cite = { label: 'Du et al. 2020, Plant Methods', url: 'https://doi.org/10.1186/s13007-020-0553-2' };
const LAWSON14: Cite = { label: 'Lawson & Blatt 2014, Plant Physiol.', url: 'https://doi.org/10.1104/pp.114.237107' };
const BROWN00: Cite = { label: 'Brown & Escombe 1900, Phil. Trans. R. Soc. B', url: 'https://doi.org/10.1098/rstb.1900.0014' };
const VERSLUES23: Cite = { label: 'Verslues et al. 2023, Plant Cell', url: 'https://doi.org/10.1093/plcell/koac263' };
const DUPONT25: Cite = { label: 'Dupont et al. 2025, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/eraf325' };
const TERASHIMA11: Cite = { label: 'Terashima et al. 2011, Plant Physiol.', url: 'https://doi.org/10.1104/pp.110.165472' };
const CLARKE21: Cite = { label: 'Clarke et al. 2021, Interface Focus', url: 'https://doi.org/10.1098/rsfs.2020.0040' };
const LUNDGREN19: Cite = { label: 'Lundgren et al. 2019, Nat. Commun.', url: 'https://doi.org/10.1038/s41467-019-10826-5' };

const Ci = '<i>C</i><sub>i</sub>', Cc = '<i>C</i><sub>c</sub>', Cs = '<i>C</i><sub>s</sub>', gs = '<i>g</i><sub>s</sub>';
const A = '<i>A</i>', E = '<i>E</i>';

/* ---------------------------------------------------------------- cp9 · from a leaf in a box to Cᵢ */

const LIGHT_ON = { tag: 'Light on', say: `In the light, the leaf takes CO₂ out of the air and adds water vapour. The CO₂ drop gives the net CO₂ uptake, ${A}; the water-vapour rise gives the transpiration, ${E}.`, cite: [BUSCH24] };
const GAASTRA = { tag: '1959', say: '1959, Wageningen: Gaastra clamped one attached leaf in a Plexiglass chamber and recorded its CO₂ uptake with an infrared gas analyser.', cite: [GAASTRA59] };
const CALC = { tag: 'Calculated', say: `From ${E} and the water-vapour difference between leaf and air: the stomatal conductance, ${gs}. From ${A} and ${gs}: the CO₂ in the leaf air spaces, ${Ci} ≈ 300 µmol mol⁻¹.`, cite: [BUSCH24, VCF81] };
const Q9 = { tag: 'Question', say: `${Ci} is the CO₂ in the leaf air spaces. <b>How much of it reaches RuBisCO?</b>`, cite: [BUSCH24] };

/** Staging A: the slide's drawn open system, Gaastra's clippings beside it, then into the leaf. */
export const CP9: Beat[] = [
  { tag: 'Leaf chamber', say: 'Air flows over a leaf in a chamber. Infrared gas analysers measure its CO₂ and water vapour before and after the leaf. In the dark, the leaf respires: the air leaving it has more CO₂.', cite: [BUSCH24] },
  LIGHT_ON,
  GAASTRA,
  CALC,
  Q9,
];
/** Staging B, history first: Gaastra's analyser, today's portable system, then the drawn system and the leaf. */
export const CP9_B: Beat[] = [
  GAASTRA,
  { tag: 'Today', say: 'Today, portable systems do the same in the field: a leaf is clamped in a chamber, and infrared gas analysers measure CO₂ and water vapour before and after it.', cite: [BUSCH24] },
  { tag: 'Dark and light', say: `In the dark, the leaf respires: CO₂ rises. In the light, it takes CO₂ out of the air and adds water vapour: the CO₂ drop gives ${A}, the water-vapour rise gives ${E}.`, cite: [BUSCH24] },
  CALC,
  Q9,
];
/** Staging C, real images: a rice field, the LI-6800 sensor head, a stoma, then into the leaf. */
export const CP9_C: Beat[] = [
  { tag: 'In the field', say: 'A rice leaf is clamped in the chamber of a portable gas-exchange system. Air flows over the leaf.', cite: [DU20] },
  { tag: 'Two analysers', say: `One infrared gas analyser reads the air before the leaf, the other the air after it. The CO₂ drop gives ${A}; the water-vapour rise gives ${E}.`, cite: [LICOR, BUSCH24] },
  { tag: 'Stomata', say: `CO₂ enters and water vapour leaves through the stomata. From ${E} and the water-vapour difference between leaf and air: the stomatal conductance, ${gs}.`, cite: [BUSCH24] },
  { tag: 'Calculated', say: `From ${A} and ${gs}: the CO₂ in the leaf air spaces, ${Ci} ≈ 300 µmol mol⁻¹, against 420 in the outside air.`, cite: [BUSCH24, VCF81] },
  Q9,
];
/** Staging D, side by side: two chambers, one leaf lit, then into the lit leaf. */
export const CP9_D: Beat[] = [
  { tag: 'Two chambers', say: 'Two leaves in chambers, both in the dark. Infrared gas analysers measure CO₂ and water vapour before and after each leaf: both leaves respire, so CO₂ rises.', cite: [BUSCH24] },
  { tag: 'Light on', say: `Light on the right leaf: it takes CO₂ out of the air and adds more water vapour. The CO₂ drop gives ${A}; the water-vapour rise gives ${E}.`, cite: [BUSCH24] },
  CALC,
  Q9,
];

/* ---------------------------------------------------------------- cp10 · three conductances to RuBisCO */

const PATH = { tag: 'Three conductances', say: 'To reach RuBisCO, CO₂ diffuses through three conductances in series: the boundary layer, the stomata and the mesophyll.', cite: [BUSCH24] };
const WIND = { tag: 'Boundary layer', say: `A layer of still air covers the leaf. Wind thins this boundary layer, so more CO₂ reaches the leaf surface: ${Cs} rises.`, cite: [DUPONT25] };
const CATALPA = { tag: '1900', say: '1900, Brown and Escombe: the open pores of a catalpa leaf cover 0.9 % of its surface, yet the leaf takes up CO₂ half as fast as an equal area of caustic soda.', cite: [BROWN00] };
const WATER = { tag: 'Water out', say: 'Water vapour leaves through the same pores: 150 to over 500 H₂O for each CO₂ taken up.', cite: [VERSLUES23, LAWSON14] };
const MESO = { tag: 'Mesophyll', say: `In water, CO₂ diffuses ≈ 10,000 times more slowly than in air. Across cell wall, membranes and stroma, it falls from ${Ci} ≈ 300 to ${Cc} ≈ 200 µmol mol⁻¹.`, cite: [TERASHIMA11, CLARKE21, BUSCH24] };
const CLOSE = { tag: 'Stomata close', say: `When the air is dry, the stomata close: less water is lost, but ${Ci} and ${Cc} fall. <b>How can a leaf keep CO₂ high at RuBisCO, first by recapturing the CO₂ that photorespiration releases?</b>`, cite: [LAWSON14] };

/** Staging A: one camera along the slide's drawn path, each conductance lit in turn. */
export const CP10: Beat[] = [PATH, WIND, CATALPA, WATER, MESO, CLOSE];
/** Staging B, history first: Brown & Escombe 1900, Gaastra 1959, micro-CT and TEM today, each on its part of the path. */
export const CP10_B: Beat[] = [
  PATH,
  CATALPA,
  { tag: '1959', say: '1959: Gaastra measured all three resistances (1 / conductance) in turnip leaves. The stomatal resistance falls as light rises; in bright light the mesophyll resistance is 1 to 4 times the stomatal one.', cite: [GAASTRA59] },
  { tag: 'Mesophyll today', say: `Micro-CT shows the air spaces, electron micrographs the wall. In water, CO₂ diffuses ≈ 10,000 times more slowly: it falls from ${Ci} ≈ 300 to ${Cc} ≈ 200 µmol mol⁻¹.`, cite: [LUNDGREN19, CLARKE21, TERASHIMA11] },
  CLOSE,
];
/** Staging C, real images along the path: wind map, stoma (SEM), air spaces (micro-CT), wall (TEM), open and closed stomata. */
export const CP10_C: Beat[] = [
  { tag: 'Boundary layer', say: `A layer of still air covers the leaf. At low wind it is thick and CO₂ has already fallen at the surface; wind thins it, so ${Cs} rises.`, cite: [DUPONT25] },
  { tag: 'Stoma', say: 'CO₂ enters through the stomatal pore, and water vapour leaves through it: 150 to over 500 H₂O for each CO₂ taken up.', cite: [VERSLUES23] },
  { tag: 'Air spaces', say: `Inside, CO₂ spreads through the air spaces between the mesophyll cells: ${Ci} ≈ 300 µmol mol⁻¹.`, cite: [LUNDGREN19, BUSCH24] },
  MESO,
  CLOSE,
];
/** Staging D, side by side: still air and wind, open and closed stomata. */
export const CP10_D: Beat[] = [
  { tag: 'Still air and wind', say: `Two leaves, one in still air, one in wind. Wind thins the boundary layer, so more CO₂ reaches the leaf surface: ${Cs} is higher.`, cite: [DUPONT25] },
  { tag: 'Open and closed', say: 'Open stomata let CO₂ in and water vapour out: 150 to over 500 H₂O for each CO₂ taken up. Closed stomata hold both back.', cite: [VERSLUES23, LAWSON14] },
  { tag: 'Mesophyll', say: `Behind the stomata, the mesophyll: across cell wall, membranes and stroma, CO₂ falls from ${Ci} ≈ 300 to ${Cc} ≈ 200 µmol mol⁻¹.`, cite: [TERASHIMA11, BUSCH24] },
  CLOSE,
];
