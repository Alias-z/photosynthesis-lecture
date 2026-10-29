// Beats of the CO₂-story animations (slides C10, C11, C11a; brief research/redo-2026-10-29/CO2_DIFFUSION_STORY_BRIEF.md).
// Every number is in a source of the fact table (report of 29 Oct 2026). Labels and captions name each quantity in
// words first, its symbol in brackets (lecturer, 29 Oct 2026). Each animation ends on the question that leads on.
import type { Beat, Cite } from './types';

const BUSCH24: Cite = { label: 'Busch et al. 2024, Plant Cell Environ.', url: 'https://doi.org/10.1111/pce.14815' };
const NOAA: Cite = { label: 'NOAA GML, Mauna Loa CO₂ record', url: 'https://gml.noaa.gov/ccgg/trends/' };
const LB14: Cite = { label: 'Lawson & Blatt 2014, Plant Physiol.', url: 'https://doi.org/10.1104/pp.114.237107' };
const VERS23: Cite = { label: 'Verslues et al. 2023, Plant Cell', url: 'https://doi.org/10.1093/plcell/koac263' };
const TERA11: Cite = { label: 'Terashima et al. 2011, Plant Physiol.', url: 'https://doi.org/10.1104/pp.110.165472' };
const FM02: Cite = { label: 'Flexas & Medrano 2002, Ann. Bot.', url: 'https://doi.org/10.1093/aob/mcf027' };
const JO84: Cite = { label: 'Jordan & Ogren 1984, Planta', url: 'https://doi.org/10.1007/BF00398720' };
const SANDER23: Cite = { label: 'Sander 2023, Atmos. Chem. Phys.', url: 'https://doi.org/10.5194/acp-23-10901-2023' };

/** lf10 · CO₂ from the air to RuBisCO: the gradient, then each resistance in series; a hot, dry day. */
export const LF10K: Beat[] = [
  { tag: 'The gradient', say: 'RuBisCO uses up CO₂ in the chloroplast, so CO₂ diffuses in from the air, down its gradient.', cite: [BUSCH24, NOAA] },
  { tag: 'Boundary layer', say: 'First the boundary layer: still air at the leaf surface.', cite: [BUSCH24] },
  { tag: 'Stoma', say: 'Then the stoma; water vapour leaves through the same pore.', cite: [BUSCH24, LB14, VERS23] },
  { tag: 'Air spaces and the wet wall', say: 'At the cell wall CO₂ must dissolve in water; in water it diffuses ≈ 10,000 times more slowly than in air.', cite: [TERA11] },
  { tag: 'To RuBisCO', say: 'Dissolved, CO₂ crosses the plasma membrane, the cytosol and the chloroplast envelope to RuBisCO. Each resistance lowers the CO₂ at RuBisCO: CO₂ uptake (<i>A</i>) = conductance (<i>g</i>) × CO₂ drop (Δ<i>C</i>).', cite: [BUSCH24] },
  { tag: 'Hot, dry day', say: 'On a hot, dry day the stomata close; less CO₂ reaches RuBisCO, and oxygenation rises. <b>How have plants coped?</b>', cite: [FM02, JO84, SANDER23] },
];

const BUSCH13: Cite = { label: 'Busch, Sage, Cousins & Sage 2013, Plant Cell Environ.', url: 'https://doi.org/10.1111/j.1365-3040.2012.02567.x' };
const SS09: Cite = { label: 'Sage & Sage 2009, Plant Cell Physiol.', url: 'https://doi.org/10.1093/pcp/pcp033' };

/** lf11 · C₃: photorespiration releases CO₂ 1–4 in the mitochondrion; where the chloroplasts sit decides how much is
 *  refixed; heat. */
export const LF11K: Beat[] = [
  { tag: 'Photorespiration releases CO₂', say: 'When RuBisCO takes up O₂, glycolate goes to the peroxisome and glycine to the mitochondrion, where 2 glycine release 1 CO₂. Four rounds release CO₂ 1–4.', cite: [BUSCH13] },
  { tag: 'Position matters', say: 'C₃ leaves place chloroplasts between the mitochondria and the air spaces. With mitochondria at the wall (left, hypothetical), all 4 CO₂ would escape.', cite: [SS09, BUSCH13] },
  { tag: 'Refixation', say: 'On its way out, CO₂ 1 passes a chloroplast and RuBisCO fixes it again. CO₂ 2–4 reach the air space, where neighbouring cells take up part of them.', cite: [BUSCH13] },
  { tag: 'Heat', say: 'As the leaf warms, RuBisCO’s preference for CO₂ over O₂ falls and oxygenation rises: photorespiration releases more CO₂ than the chloroplasts catch. <b>Could a plant release this CO₂ where RuBisCO is concentrated?</b>', cite: [JO84] },
];

const RAWS88: Cite = { label: 'Rawsthorne et al. 1988, Planta', url: 'https://doi.org/10.1007/BF00401016' };
const HYL88: Cite = { label: 'Hylton et al. 1988, Planta', url: 'https://doi.org/10.1007/BF00393064' };
const SKS14: Cite = { label: 'Sage, Khoshravesh & Sage 2014, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/eru180' };
const KEER14: Cite = { label: 'Keerberg et al. 2014, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/eru239' };

/** lf11a · C₂, per 2 glycine: glycine 1–2 into the bundle sheath; glycine decarboxylase next to RuBisCO; the build-up. */
export const LF11AK: Beat[] = [
  { tag: 'Glycine moves', say: 'In a C₂ leaf, photorespiration in a mesophyll cell makes glycine 1 and 2. The glycine moves into a bundle-sheath cell.', cite: [RAWS88, SKS14] },
  { tag: 'Decarboxylation next to RuBisCO', say: 'C₂ plants release photorespired CO₂ almost only in the bundle sheath, where chloroplasts cover the mitochondria: 2 glycine → serine + CO₂ 1 + NH₃. Bundle-sheath RuBisCO refixes CO₂ 1; serine returns.', cite: [RAWS88, HYL88] },
  { tag: 'Build-up', say: 'CO₂ builds up next to bundle-sheath RuBisCO: in <i>Flaveria</i>, the mean CO₂ at RuBisCO in a C₂ leaf is ≈ 3 times that in a C₃ leaf. <b>What if the leaf pumped CO₂ to RuBisCO directly?</b>', cite: [KEER14] },
];
