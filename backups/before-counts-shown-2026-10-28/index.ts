// The light-block animations and the staging variants listed on the pilot page; the first listed plays by default.
// Round 4 (26 Oct 2026): only the two current variants of each are listed, sky E (B, tuned) and D, life F and G (D's
// windows with C's animals, zoom-in); E and F play 1.15× faster, at the lecturer's request. The earlier variants
// (sky A–C, life A–D) stay in the code, unlisted.
import { ANTENNA, CYCLIC, FATES, LEAF, LIFE, PIGMENTS, SKY } from './beats';
import { STAGING as antennaA } from './antenna-a';
import { STAGING as antennaB } from './antenna-b';
import { STAGING as cyc10bA } from './cyc10b-a';
import { STAGING as leafA } from './leaf-a';
import { STAGING as leafB } from './leaf-b';
import { STAGING as fatesA } from './fates-a';
import { STAGING as fatesB } from './fates-b';
import { STAGING as pigA } from './pig-a';
import { STAGING as pigB } from './pig-b';
import { STAGING as lifeF } from './life-f';
import { STAGING as lifeG } from './life-g';
import { STAGING as skyD } from './sky-d';
import { STAGING as skyE, STAGING_E2 as skyE2 } from './sky-e';
// The lecturer chose the plastoquinone-pool stagings (pb) for psii and b6f (28 Oct 2026); pa, m1 and m2 stay in the code, unlisted.
// The electron-transport animations in the 7m1 glyph style (28 Oct 2026, research/redo-2026-10-28/ETC_ANIM_BRIEF.md).
import { PSIIM } from './beats-psiim';
import { STAGING as psiiPB } from './psii-pb';
import { STAGING as psiiPC } from './psii-pc';
import { B6FM } from './beats-b6fm';
import { STAGING as b6fQB } from './b6f-qb';
import { PSIM } from './beats-psim';
import { STAGING as psiM1 } from './psi-m1';
import { STAGING as psiM2 } from './psi-m2';
import { STAGING as psiM3 } from './psi-m3';
import { STAGING as psiM4 } from './psi-m4';
import { ATPSM } from './beats-atpsm';
import { CYCLICM } from './beats-cyclicm';
import { STAGING as cyclicM1 } from './cyclic-m1';
import { STAGING as cyclicM2 } from './cyclic-m2';
import { STAGING as cyclicM3 } from './cyclic-m3';
import { STAGING as atpsM1 } from './atps-m1';
import { STAGING as atpsM2 } from './atps-m2';
// Overnight build of 28 Oct 2026: one animation per slide, 3–4 stagings each (research/redo-2026-10-28/ANIM_BRIEF.md).
import { PP11, PP12, PP13 } from './beats-pp';
import { STAGING as pp11A } from './pp11-a';
import { STAGING as pp11B } from './pp11-b';
import { STAGING as pp11C } from './pp11-c';
import { STAGING as pp11D } from './pp11-d';
import { STAGING as pp12A } from './pp12-a';
import { STAGING as pp12B } from './pp12-b';
import { STAGING as pp12C } from './pp12-c';
import { STAGING as pp12D } from './pp12-d';
import { STAGING as pp13A } from './pp13-a';
import { STAGING as pp13B } from './pp13-b';
import { STAGING as pp13C } from './pp13-c';
import { STAGING as pp13D } from './pp13-d';
import { CB1, CB2, CB3, CB4 } from './beats-cb';
import { STAGING as cb1A } from './cb1-a';
import { STAGING as cb1B } from './cb1-b';
import { STAGING as cb1C } from './cb1-c';
import { STAGING as cb1D } from './cb1-d';
import { STAGING as cb2A } from './cb2-a';
import { STAGING as cb2B } from './cb2-b';
import { STAGING as cb2C } from './cb2-c';
import { STAGING as cb3A } from './cb3-a';
import { STAGING as cb3B } from './cb3-b';
import { STAGING as cb3C } from './cb3-c';
import { STAGING as cb4A } from './cb4-a';
import { STAGING as cb4B } from './cb4-b';
import { STAGING as cb4C } from './cb4-c';
import { STAGING as cb4D } from './cb4-d';
import { RF5, RF6 } from './beats-rf56';
import { STAGING as rf5A } from './rf5-a';
import { STAGING as rf5B } from './rf5-b';
import { STAGING as rf5C } from './rf5-c';
import { STAGING as rf5D } from './rf5-d';
import { STAGING as rf6A } from './rf6-a';
import { STAGING as rf6B } from './rf6-b';
import { STAGING as rf6C } from './rf6-c';
import { STAGING as rf6D } from './rf6-d';
import { RF7, RF8 } from './beats-rf78';
import { STAGING as rf7A } from './rf7-a';
import { STAGING as rf7B } from './rf7-b';
import { STAGING as rf7C } from './rf7-c';
import { STAGING as rf7D } from './rf7-d';
import { STAGING as rf8A } from './rf8-a';
import { STAGING as rf8B } from './rf8-b';
import { STAGING as rf8C } from './rf8-c';
import { CP10, CP9 } from './beats-cp';
import { STAGING as cp9A } from './cp9-a';
import { STAGING as cp9B } from './cp9-b';
import { STAGING as cp9C } from './cp9-c';
import { STAGING as cp9D } from './cp9-d';
import { STAGING as cp10A } from './cp10-a';
import { STAGING as cp10B } from './cp10-b';
import { STAGING as cp10C } from './cp10-c';
import { STAGING as cp10D } from './cp10-d';
import { CC11, CC12, CC13 } from './beats-cc';
import { STAGING as cc11A } from './cc11-a';
import { STAGING as cc11B } from './cc11-b';
import { STAGING as cc11C } from './cc11-c';
import { STAGING as cc11D } from './cc11-d';
import { STAGING as cc12A } from './cc12-a';
import { STAGING as cc12B } from './cc12-b';
import { STAGING as cc12C } from './cc12-c';
import { STAGING as cc12D } from './cc12-d';
import { STAGING as cc13A } from './cc13-a';
import { STAGING as cc13B } from './cc13-b';
import { STAGING as cc13C } from './cc13-c';
import { STAGING as cc13D } from './cc13-d';
import { CR14, CR15 } from './beats-cr';
import { STAGING as cr14A } from './cr14-a';
import { STAGING as cr14B } from './cr14-b';
import { STAGING as cr14C } from './cr14-c';
import { STAGING as cr14D } from './cr14-d';
import { STAGING as cr15A } from './cr15-a';
import { STAGING as cr15B } from './cr15-b';
import { STAGING as cr15C } from './cr15-c';
import { STAGING as cr15D } from './cr15-d';
import type { Animation, Staging } from './types';

/** The same staging played `k` times faster: every staging draws as a pure function of (beat, t), so scaling t
 *  speeds all its motion evenly. */
const faster = (s: Staging, k: number): Staging => ({ ...s, bind: stage => { const draw = s.bind(stage); return (beat, t) => draw(beat, t * k); } });

export const ANIMATIONS: Animation[] = [
  { key: 'sky', title: 'Sunlight and the sky', beats: SKY, stagings: [faster(skyE, 1.15)] },
  { key: 'life', title: 'Who uses which light?', beats: LIFE, stagings: [faster(lifeF, 1.15)] },
  { key: 'pig', title: 'Why pigments differ', beats: PIGMENTS, stagings: [pigA] },
  { key: 'fates', title: 'Fates of an excitation', beats: FATES, stagings: [fatesA, fatesB] },
  { key: 'leaf', title: 'Into the leaf', beats: LEAF, stagings: [leafA] },
  { key: 'antenna', title: 'To the reaction centre', beats: ANTENNA, stagings: [antennaA, antennaB] },
  { key: 'psii', title: 'Photosystem II', beats: PSIIM, stagings: [psiiPB, psiiPC] },
  { key: 'b6f', title: 'Cytochrome b₆f', beats: B6FM, stagings: [b6fQB] },
  { key: 'psi', title: 'Photosystem I', beats: PSIM, stagings: [psiM1, psiM2, psiM3, psiM4] },
  { key: 'atps', title: 'ATP synthase', beats: ATPSM, stagings: [atpsM1, atpsM2] },
  // the picked earlier staging a keeps its own four beats
  { key: 'cyclic', title: 'Cyclic electron flow', beats: CYCLICM, stagings: [cyclicM1, cyclicM2, cyclicM3, { ...cyc10bA, beats: CYCLIC }] },
  { key: 'pp11', title: 'Excess light', beats: PP11, stagings: [pp11A, pp11B, pp11C, pp11D] },
  { key: 'pp12', title: 'Photoprotection and repair', beats: PP12, stagings: [pp12A, pp12B, pp12C, pp12D] },
  { key: 'pp13', title: 'Chlorophyll fluorescence', beats: PP13, stagings: [pp13A, pp13B, pp13C, pp13D] },
  { key: 'cb1', title: 'How the cycle was found', beats: CB1, stagings: [cb1A, cb1B, cb1C, cb1D] },
  { key: 'cb2', title: 'Rubisco', beats: CB2, stagings: [cb2A, cb2B, cb2C] },
  { key: 'cb3', title: 'Reduction and regeneration', beats: CB3, stagings: [cb3A, cb3B, cb3C] },
  { key: 'cb4', title: 'Sucrose and starch', beats: CB4, stagings: [cb4A, cb4B, cb4C, cb4D] },
  { key: 'rf5', title: 'Rubisco: carboxylation and oxygenation', beats: RF5, stagings: [rf5A, rf5B, rf5C, rf5D] },
  { key: 'rf6', title: 'Photorespiration', beats: RF6, stagings: [rf6A, rf6B, rf6C, rf6D] },
  { key: 'rf7', title: 'Light-response curve', beats: RF7, stagings: [rf7A, rf7B, rf7C, rf7D] },
  { key: 'rf8', title: 'FvCB model', beats: RF8, stagings: [rf8A, rf8B, rf8C] },
  { key: 'cp9', title: 'Measuring leaf gas exchange', beats: CP9, stagings: [cp9A, cp9B, cp9C, cp9D] },
  { key: 'cp10', title: 'CO₂ diffusion pathway', beats: CP10, stagings: [cp10A, cp10B, cp10C, cp10D] },
  { key: 'cc11', title: 'Refixation of photorespired CO₂', beats: CC11, stagings: [cc11A, cc11B, cc11C, cc11D] },
  { key: 'cc12', title: 'C₄ photosynthesis', beats: CC12, stagings: [cc12A, cc12B, cc12C, cc12D] },
  { key: 'cc13', title: 'Crassulacean acid metabolism (CAM)', beats: CC13, stagings: [cc13A, cc13B, cc13C, cc13D] },
  { key: 'cr14', title: 'Rising CO₂', beats: CR14, stagings: [cr14A, cr14B, cr14C, cr14D] },
  { key: 'cr15', title: 'From leaf to loaf', beats: CR15, stagings: [cr15A, cr15B, cr15C, cr15D] },
];
