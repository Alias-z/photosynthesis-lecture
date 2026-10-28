// Beats of the lecture 2 chunk 1 animations (Calvin–Benson–Bassham cycle, slides C1–C4, prefix cb; overnight build
// 28 Oct 2026, scripts research/redo-2026-10-28/CB_ANIM_SCRIPTS.md, tightened). Every caption rests on a paper read in
// full for this chunk (Calvin 1961 Nobel lecture, eScholarship scan of UCRL-9966; Sharkey 2019, OSTI accepted
// manuscript; Bar-On & Milo 2019; Evans & Clarke 2019; Graf et al. 2010) and ends, in the last beat, on the question
// the next slide answers.
import type { Beat, Cite } from './types';

const NOBEL: Cite = { label: 'Calvin 1961, Nobel lecture', url: 'https://www.nobelprize.org/prizes/chemistry/1961/calvin/lecture/' };
const SHARKEY19: Cite = { label: 'Sharkey 2019, Photosynth. Res.', url: 'https://doi.org/10.1007/s11120-018-0600-2' };
const BASSHAM54: Cite = { label: 'Bassham et al. 1954, J. Am. Chem. Soc.', url: 'https://doi.org/10.1021/ja01636a012' };
const BARON19: Cite = { label: 'Bar-On & Milo 2019, PNAS', url: 'https://doi.org/10.1073/pnas.1816654116' };
const GOODSELL: Cite = { label: 'Goodsell, PDB-101 Molecule of the Month 11', url: 'https://pdb101.rcsb.org/motm/11' };
const EVANS19: Cite = { label: 'Evans & Clarke 2019, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/ery366' };
const GRAF10: Cite = { label: 'Graf et al. 2010, PNAS', url: 'https://doi.org/10.1073/pnas.0914299107' };
const STREB12: Cite = { label: 'Streb & Zeeman 2012, Arabidopsis Book', url: 'https://doi.org/10.1199/tab.0160' };
const SHARKEY24: Cite = { label: 'Sharkey 2024, Plant Physiol.', url: 'https://doi.org/10.1093/plphys/kiad601' };
const SMITH07: Cite = { label: 'Smith & Stitt 2007, Plant Cell Environ.', url: 'https://doi.org/10.1111/j.1365-3040.2007.01708.x' };
const BOWES71: Cite = { label: 'Bowes, Ogren & Hageman 1971, Biochem. Biophys. Res. Commun.', url: 'https://doi.org/10.1016/0006-291X(71)90475-X' };

/** C1 · how the cycle was found: the ¹⁴C tracer, shorter and shorter feeds, the spots ordered into a cycle, the count
 *  per 3 CO₂ on the slide's wheel. The lollipop is named only as the first apparatus (Calvin 1961: "initially
 *  performed in … the 'Lollipop'"); the shortest feeds are shown in Bassham's flow tube (Sharkey 2019, Fig. 6). */
export const CB1: Beat[] = [
  { tag: 'Carbon-14', say: 'From 1945, carbon-14 was cheap. Calvin, Benson and Bassham fed ¹⁴CO₂ to algae in light, first in a flat flask, the “lollipop”, then dropped them into alcohol to stop all reactions.', cite: [NOBEL, SHARKEY19] },
  { tag: 'Shorter ¹⁴CO₂ feeds', say: 'The shorter the feed, the fewer the labelled compounds. After fractions of a second, over 80 % of the ¹⁴C was in one compound: 3-PGA.', cite: [{ ...NOBEL, label: 'Calvin 1961, Nobel lecture, Figs 5, 6' }, { ...SHARKEY19, label: 'flow tube: Sharkey 2019, Fig. 6' }] },
  { tag: 'Labelling order', say: 'The order in which compounds took up ¹⁴C traced the path: CO₂ → 3-PGA → triose phosphate → sugar phosphates that rebuild RuBP. In 1954 they drew it as a cycle.', cite: [BASSHAM54, NOBEL] },
  { tag: 'Per 3 CO₂', say: 'Per 3 CO₂ fixed, the cycle makes 6 triose phosphates: 5 regenerate 3 RuBP, 1 leaves the cycle. <b>What do reduction and regeneration cost?</b>', cite: [SHARKEY19] },
];

/** C2 · RuBisCO: one site's slow pace, the bulk a leaf holds, the planet's total, back to its product. */
const BOUVIER24: Cite = { label: 'Bouvier, Emms & Kelly 2024, PNAS', url: 'https://doi.org/10.1073/pnas.2321050121' };
const JORDAN84: Cite = { label: 'Jordan & Ogren 1984, Planta', url: 'https://doi.org/10.1007/BF00398720' };

/** C2 in the new order (lecturer, 28 Oct 2026): RuBisCO binds CO₂ and O₂; it evolved in air with almost no O₂; warming raises
 *  oxygenation. Concept level, no counts; the reactions themselves are C5. Staged in the dark-reaction strip (anim/dk-cb2.ts). */
export const CB2N: Beat[] = [
  { tag: 'Carboxylation and oxygenation', say: 'RuBisCO binds CO₂ but also O₂, at the same active site.', cite: [BOWES71] },
  { tag: 'Evolution', say: 'RuBisCO evolved ≈ 3 billion years ago, in air with almost no O₂; O₂ rose later.', cite: [BOUVIER24] },
  { tag: 'Climate warming', say: 'In warmer leaves RuBisCO’s affinity for CO₂ falls, and in water CO₂ solubility falls more than O₂ solubility: oxygenation rises. <b>How do the two reactions differ?</b>', cite: [JORDAN84] },
];

export const CB2: Beat[] = [
  { tag: 'Active sites', say: 'RuBisCO has 8 active sites. Each fixes about 3 CO₂ per second, at 25 °C.', cite: [BARON19, GOODSELL] },
  { tag: 'In bulk', say: 'So a C₃ leaf holds RuBisCO in bulk: about 20 % of its nitrogen.', cite: [EVANS19] },
  { tag: 'On land', say: '2019: Bar-On and Milo estimated the RuBisCO in all land plants at about 0.7 billion tonnes.', cite: [BARON19] },
  { tag: 'CO₂ and O₂', say: 'RuBisCO adds CO₂ to RuBP. <b>But air holds 500 times more O₂ than CO₂: does RuBisCO tell them apart?</b>', cite: [SHARKEY19] },
];

/** C3 · the energy: ATP and NADPH into reduction and regeneration, Bassham's light-off transient, why, and the one
 *  triose phosphate in six that leaves. */
export const CB3: Beat[] = [
  { tag: 'The fuel', say: 'Per 3 CO₂, reduction takes 6 ATP and 6 NADPH, regeneration 3 ATP: 3 ATP and 2 NADPH per CO₂.', cite: [{ ...SHARKEY19, label: 'Sharkey 2019, Photosynth. Res., Fig. 3' }, BASSHAM54] },
  { tag: 'Light off', say: 'Bassham switched off the light on <i>Chlorella</i>: within a minute, 3-PGA piled up and RuBP fell to near zero.', cite: [{ ...NOBEL, label: 'Calvin 1961, Nobel lecture, Fig. 15 (Bassham’s data)' }] },
  { tag: 'Why', say: 'Without ATP and NADPH, 3-PGA is not reduced and RuBP is not rebuilt. RuBisCO uses up the RuBP left, then stops.', cite: [NOBEL] },
  { tag: 'One in six', say: 'In light the cycle runs again, and 1 of every 6 triose phosphates leaves it. <b>Where does it go, by day and at night?</b>', cite: [SHARKEY19] },
];

/** C4 · the exit: sucrose out, starch in; starch by day and night; the early dusk (Graf et al. 2010); the bridge to
 *  RuBisCO's oxygenation (C5). */
export const CB4: Beat[] = [
  { tag: 'Export or storage', say: 'Triose phosphate leaves the chloroplast in exchange for phosphate and becomes sucrose, for the whole plant. Part stays in the chloroplast and becomes starch.', cite: [SHARKEY24, SMITH07] },
  { tag: 'Day and night', say: 'In <i>Arabidopsis</i> leaves, starch builds up all day and is broken down at night at a near-constant rate: almost all of it is used by dawn.', cite: [GRAF10, STREB12] },
  { tag: 'Starch use at night', say: '2010: Graf and colleagues let night fall after 8 hours instead of 12. The plants slowed starch breakdown at once, and the starch still lasted until dawn.', cite: [GRAF10] },
  { tag: 'RuBisCO and O₂', say: 'All this sugar starts with RuBisCO adding CO₂ to RuBP. <b>But RuBisCO can also take O₂ instead of CO₂: what happens then?</b>', cite: [BOWES71] },
];
