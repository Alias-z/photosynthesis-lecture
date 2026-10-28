// Beats of the leaf-section animations (slides C10–C13; brief research/redo-2026-10-28/CO2_COPING_BRIEF.md). Every
// number is in a source read for the chunk's fact table (read depth there). Each animation ends on the question that
// leads to the next slide.
import type { Beat, Cite } from './types';

const VC21: Cite = { label: 'von Caemmerer 2021, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erab266' };
const FURB11: Cite = { label: 'Furbank 2011, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/err080' };
const LEEG02: Cite = { label: 'Leegood 2002, J. Exp. Bot.', url: 'https://doi.org/10.1093/jexbot/53.369.581' };
const WS22: Cite = { label: 'Winter & Smith 2022, New Phytol.', url: 'https://doi.org/10.1111/nph.17790' };
const EB77: Cite = { label: 'Ehleringer & Björkman 1977, Plant Physiol.', url: 'https://doi.org/10.1104/pp.59.1.86' };
const BG14: Cite = { label: 'Bellasio & Griffiths 2014, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/eru052' };

/** lf12 · C₄, per 1 CO₂: CA → PEPC → the C₄ acid to the bundle sheath → NADP-ME → CO₂ at RuBisCO; pyruvate back → PPDK. */
export const LF12: Beat[] = [
  { tag: 'CO₂ to carbonic anhydrase', say: 'CO₂ 1 enters through the stoma and diffuses into a mesophyll cell. Carbonic anhydrase (CA) turns it, with water, into bicarbonate (HCO₃⁻).', cite: [LEEG02] },
  { tag: 'PEP carboxylase', say: 'Phosphoenolpyruvate carboxylase (PEPC) adds HCO₃⁻ to phosphoenolpyruvate (PEP) 1: a C₄ acid, 1 C + 3 C = 4 C. PEPC does not react with O₂.', cite: [VC21, WS22] },
  { tag: 'Into the bundle sheath', say: 'The C₄ acid moves into the bundle-sheath cell. In maize, NADP-malic enzyme (NADP-ME) releases its CO₂ next to RuBisCO, where CO₂ reaches up to about 10 times the concentration in air.', cite: [FURB11] },
  { tag: 'Back to PEP', say: 'Pyruvate returns to the mesophyll chloroplast. Pyruvate,phosphate dikinase (PPDK) makes PEP again from 1 ATP, split to AMP: 2 ATP equivalents per CO₂. C₄: 5 ATP + 2 NADPH per CO₂; C₃: 3 ATP + 2 NADPH.', cite: [VC21, BG14] },
  { tag: 'Where C₄ plants grow', say: 'Above ≈ 30 °C a C₄ leaf fixes more CO₂ per absorbed photon than a C₃ leaf, despite the 2 extra ATP. <b>A cactus keeps its stomata shut on a hot day: how does it get its CO₂?</b>', cite: [EB77] },
];

const BOR09: Cite = { label: 'Borland et al. 2009, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erp118' };
const MG17: Cite = { label: 'Males & Griffiths 2017, Plant Physiol.', url: 'https://doi.org/10.1104/pp.17.00114' };
const TOP20: Cite = { label: 'Töpfer et al. 2020, Plant Cell', url: 'https://doi.org/10.1105/tpc.20.00132' };
const SIL10: Cite = { label: 'Silvera et al. 2010, Funct. Plant Biol.', url: 'https://doi.org/10.1071/FP10084' };
const GIL23: Cite = { label: 'Gilman et al. 2023, Ann. Bot.', url: 'https://doi.org/10.1093/aob/mcad135' };

/** lf13 · CAM in one mesophyll cell, night then day, per CO₂. */
export const LF13: Beat[] = [
  { tag: 'Night: stomata open', say: 'At night, CAM plants open their stomata. CO₂ 1 enters; carbonic anhydrase makes HCO₃⁻, and PEPC fixes it to PEP from starch. The C₄ acid is stored as malic acid in the vacuole.', cite: [WS22, MG17] },
  { tag: 'The vacuole fills', say: 'Through the night, malic acid builds up in the vacuole: 1 malic acid per CO₂ taken up. Less water evaporates through the open stomata into the cooler, more humid night air.', cite: [BOR09, TOP20] },
  { tag: 'Day: stomata closed', say: 'By day the stomata stay closed. Malic acid leaves the vacuole; malic enzyme releases its CO₂, and RuBisCO fixes it behind the closed stomata, with ATP and NADPH from the light reactions. Pyruvate goes to starch.', cite: [BOR09, WS22] },
  { tag: 'The vacuole empties', say: 'Over the day the vacuole empties: the CO₂ that RuBisCO fixes was taken up the night before.', cite: [BOR09] },
  { tag: 'Water-use efficiency', say: 'Per mol of water lost, CAM plants fix 4–10 mmol CO₂; C₃ crops 0.5–1.5, C₄ crops 1–2. About 6–7 % of vascular plants use CAM. <b>How much of the sunlight do C₃ and C₄ plants store in biomass?</b>', cite: [BOR09, SIL10, GIL23] },
];

const RAWS88: Cite = { label: 'Rawsthorne et al. 1988, Planta', url: 'https://doi.org/10.1007/BF00401016' };
const SKS14: Cite = { label: 'Sage, Khoshravesh & Sage 2014, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/eru180' };
const KEER14: Cite = { label: 'Keerberg et al. 2014, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/eru239' };

/** lf11a · C₂, per 2 O₂: glycine 1–2 to the bundle sheath; glycine decarboxylase; CO₂ 1 to bundle-sheath RuBisCO; serine back. */
export const LF11A: Beat[] = [
  { tag: 'Oxygenation in the mesophyll', say: 'In a C₂ leaf, mesophyll RuBisCO takes up O₂ 1 and 2. Their 2-phosphoglycolate leaves the chloroplast as glycolate, and the peroxisome turns it into glycine 1 and 2.', cite: [SKS14] },
  { tag: 'Glycine to the bundle sheath', say: 'Mesophyll mitochondria of C₂ plants lack glycine decarboxylase. Glycine 1 and 2 move through the plasmodesmata into the bundle-sheath cell.', cite: [RAWS88, SKS14] },
  { tag: 'Glycine decarboxylase', say: 'In the bundle-sheath mitochondria, glycine decarboxylase turns 2 glycine into serine, CO₂ 1 and NH₃: 2 × 2 C = 3 C + 1 C. CO₂ 1 is released next to bundle-sheath RuBisCO, which refixes it.', cite: [SKS14, KEER14] },
  { tag: 'Serine back', say: 'Serine returns to the mesophyll. At RuBisCO, CO₂ is about 3 times higher than in a C₃ leaf (<i>Flaveria</i>). <b>What if the mesophyll fixed CO₂ first and delivered it to bundle-sheath RuBisCO?</b>', cite: [KEER14] },
];

const BUSCH13: Cite = { label: 'Busch, Sage, Cousins & Sage 2013, Plant Cell Environ.', url: 'https://doi.org/10.1111/j.1365-3040.2012.02567.x' };
const SK07: Cite = { label: 'Sage & Kubien 2007, Plant Cell Environ.', url: 'https://doi.org/10.1111/j.1365-3040.2007.01682.x' };
const JO84: Cite = { label: 'Jordan & Ogren 1984, Planta', url: 'https://doi.org/10.1007/BF00398720' };

/** lf11 · C₃ at midday: carboxylation; oxygenation and photorespiration in the mesophyll cell; part of the CO₂ refixed; heat. */
export const LF11: Beat[] = [
  { tag: 'C₃: CO₂ to RuBisCO', say: 'A temperate C₃ leaf at midday: CO₂ 1 reaches RuBisCO in a mesophyll chloroplast and is fixed into 2 3-phosphoglycerate (3-PGA).', cite: [BUSCH13] },
  { tag: 'Oxygenation', say: 'RuBisCO also takes up O₂ 1 and 2. Photorespiration turns their 2 glycolate into 2 glycine in the peroxisome; in the mitochondrion glycine decarboxylase releases CO₂ 1.', cite: [SK07] },
  { tag: 'Refixation', say: 'In rice and wheat, chloroplasts cover 92–99 % of the wall facing the air spaces, and the mitochondria lie behind them. Of 4 photorespired CO₂, about 1 is refixed inside the cell (24–38 %); the rest leaves into the air spaces.', cite: [BUSCH13] },
  { tag: 'Heat', say: 'As the leaf warms, RuBisCO’s preference for CO₂ over O₂ falls and oxygenation rises. <b>Could a leaf release photorespired CO₂ where more RuBisCO can refix it?</b>', cite: [JO84] },
];

const BUSCH24: Cite = { label: 'Busch et al. 2024, Plant Cell Environ.', url: 'https://doi.org/10.1111/pce.14815' };
const LB14: Cite = { label: 'Lawson & Blatt 2014, Plant Physiol.', url: 'https://doi.org/10.1104/pp.114.237107' };
const FM02: Cite = { label: 'Flexas & Medrano 2002, Ann. Bot.', url: 'https://doi.org/10.1093/aob/mcf027' };

/** lf10 · CO₂ from the air to RuBisCO: the concentrations step down; water leaves through the same stoma; a hot, dry day. */
export const LF10: Beat[] = [
  { tag: 'Air to stoma', say: 'CO₂ 1 crosses the boundary layer of still air (conductance g<sub>b</sub>) and passes the stoma (g<sub>s</sub>). Through the same pore, H₂O 1 leaves the leaf. In the air, Cₐ ≈ 430 ppm.', cite: [BUSCH24, LB14] },
  { tag: 'Into the mesophyll', say: 'In the leaf air spaces Cᵢ ≈ 300 ppm. CO₂ 1 dissolves in the wet cell wall and diffuses through the cell into the chloroplast (g<sub>m</sub>): at RuBisCO C꜀ ≈ 200 ppm.', cite: [BUSCH24] },
  { tag: 'A hot, dry day', say: 'When the air is hot and dry, the stomata close partly to save water. Less CO₂ enters, so Cᵢ and C꜀ fall, and RuBisCO takes up relatively more O₂. <b>Getting CO₂ to RuBisCO is hard: how have plants coped?</b>', cite: [FM02, SK07] },
];
