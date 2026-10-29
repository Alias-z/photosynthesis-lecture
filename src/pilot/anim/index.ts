// The light-block animations and the staging variants listed on the pilot page; the first listed plays by default.
// Round 4 (26 Oct 2026): only the two current variants of each are listed, sky E (B, tuned) and D, life F and G (D's
// windows with C's animals, zoom-in); E and F play 1.15× faster, at the lecturer's request. The earlier variants
// (sky A–C, life A–D) stay in the code, unlisted.
import { picked } from '../day-picks';
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
// psi: the lecturer keeps the Z-scheme staging m4 only (28 Oct 2026); m1–m3 stay in the code, unlisted.
import { PSIM } from './beats-psim';
import { STAGING as psiM4 } from './psi-m4';
import { ATPSM, ATPSM_C } from './beats-atpsm';
import { CYCLICM } from './beats-cyclicm';
import { BALANCE } from './beats-balance';
import { STAGING as rf5S } from './dk-rf5';
import { C2STORY, C2STORY3, C2STORY4, C2STORY5 } from './beats-c2story';
import { STAGING as c2storyEvo } from './c2story-evo';
import { STAGING as c2storyT } from './c2story-tradeoff';
import { STAGING as c2storyRh } from './c2story-hot';
import { STAGING as c2storyG } from './c2story-graph';
import { STAGING as c2story3S } from './dk-c2story3';
import { REDUCTION } from './beats-reduction';
import { REGENERATION } from './beats-regeneration';
import { STAGING as reductionS } from './dk-reduction';
import { STAGING as regenerationS } from './dk-regeneration';
import { STAGING as historyS } from './dk-history';
import { HISTORY } from './beats-history';
import { RUBISCO } from './beats-rubisco';
import { STAGING as rubiscoS } from './dk-rubisco';
import { STAGING as cb1S } from './dk-cb1';
// C1's carbon bookkeeping per 3 CO₂ (EFFICIENCY_BRIEF.md, 29 Oct 2026): staging k, with its own beats.
import { STAGING as cb1K } from './dk-cb1k';
import { STAGING as cb1Story } from './cb1-story';
import { CB1V2, CB1V3 } from './beats-cb1k';
import { STAGING as cb3S } from './dk-cb3';
import { STAGING as cb4S } from './dk-cb4';
import { CB4N, CB4V2, CB4V3 } from './beats-cb4n';
import { STAGING as cb4Routes } from './cb4-routes';
import { STAGING as cb4N } from './cb4-n';
import { STAGING as cb4S2 } from './dk-cb4b';
import { STAGING as cb4P } from './cb4-p';
import { STAGING as rf6S, STAGING_W1 as rf6W1, STAGING_W2 as rf6W2 } from './dk-rf6';
import { STAGING as c4Style } from './c4-style';
import { STAGING as c2Stack } from './c2-stack';
import { STAGING as c2sA } from './c2s-a';
import { STAGING as ovA } from './ov-a';
import { STAGING as ovB } from './ov-b';
import { STAGING as ovC } from './ov-c';
import { STAGING as ovD } from './ov-d';
import { STAGING as ovE } from './ov-e';
import { OV } from './beats-ov';
import { STAGING as c2sB } from './c2s-b';
import { STAGING as c2sB1 } from './c2s-b1';
import { STAGING as c2sB2 } from './c2s-b2';
import { STAGING as c2sB3 } from './c2s-b3';
import { STAGING as c2sB4 } from './c2s-b4';
import { STAGING as c4B } from './c4-b';
import { STAGING as c4BT } from './c4-bt';
import { STAGING as c4B2 } from './c4-b2';
import { STAGING as c4M1 } from './c4-m1';
import { STAGING as c4M2 } from './c4-m2';
import { STAGING as c4M2B } from './c4-m2b';
import { STAGING as c4BT2 } from './c4-bt2';
import { STAGING as c2sC } from './c2s-c';
import { C2P } from './beats-c2p';
import { STAGING as c4Kranz } from './c4-kranz';
import { STAGING as c4Pair } from './c4-pair';
import { STAGING as c4FromC2 } from './c4-from-c2';
import { STAGING as camKranz } from './cam-kranz';
import { STAGING as camPair } from './cam-pair';
import { STAGING as camClock } from './cam-clock';
import { STAGING as camB } from './cam-b';
import { C2K, C4K } from './beats-c24';
import { RF6N } from './beats-rf6n';
import { STAGING as rf7S } from './dk-rf7';
import { STAGING as rf8S } from './dk-rf8';
import { BRIDGE } from './beats-bridge';
import { STAGING as bridgeA } from './bridge-a';
import { STAGING as bridgeB } from './bridge-b';
import { STAGING as balS1 } from './balance-s1';
import { STAGING as balS2 } from './balance-s2';
import { STAGING as balS3 } from './balance-s3';
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
import { STAGING as cp9R1 } from './cp9-r1';
import { STAGING as cp9R2 } from './cp9-r2';
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
import { CR14, CR15, CR15A } from './beats-cr';
import { STAGING as cr14A } from './cr14-a';
import { STAGING as cr14B } from './cr14-b';
import { STAGING as cr14C } from './cr14-c';
import { STAGING as cr14D } from './cr14-d';
import { STAGING as cr15A } from './cr15-a';
import { STAGING as cr15B } from './cr15-b';
import { STAGING as cr15C } from './cr15-c';
import { STAGING as cr15D } from './cr15-d';
// The leaf-section animations of C10–C13 (research/redo-2026-10-28/CO2_COPING_BRIEF.md).
import { LF10, LF11, LF11A, LF12, LF13 } from './beats-lf';
import { STAGING as lf10M } from './lf10';
import { STAGING as lf11M } from './lf11';
import { STAGING as lf12M } from './lf12';
import { STAGING as lf13M } from './lf13';
import { STAGING as lf13M2 } from './lf13-m2';
// The CO₂ story of C10–C11a (29 Oct 2026, research/redo-2026-10-29/CO2_DIFFUSION_STORY_BRIEF.md): new stagings listed
// first, with their own beats; the picked leaf-section stagings lf10m and lf11m stay listed after them.
import { LF10K, LF11K, LF11AK } from './beats-co2';
import { STAGING as lf10A } from './lf10-a';
import { STAGING as lf10B } from './lf10-b';
import { STAGING as lf11K } from './lf11-k';
// C4e · Efficiency of photosynthesis (research/redo-2026-10-29/EFFICIENCY_BRIEF.md).
import { EFF } from './beats-eff';
import { STAGING as effS } from './eff';
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
  { key: 'antenna', title: 'To the reaction centre', beats: ANTENNA, stagings: [antennaA] },  // lecture day, last: only the pick
  { key: 'psii', title: 'Photosystem II', beats: PSIIM, stagings: [psiiPB, psiiPC] },
  { key: 'b6f', title: 'Cytochrome b₆f', beats: B6FM, stagings: [b6fQB] },
  { key: 'psi', title: 'Photosystem I', beats: PSIM, stagings: [psiM4] },
  { key: 'atps', title: 'ATP synthase', beats: ATPSM, stagings: [{ ...atpsM1, beats: ATPSM_C }, atpsM2] },
  // the picked earlier staging a keeps its own four beats
  { key: 'cyclic', title: 'Balancing ATP and NADPH', beats: BALANCE, stagings: [balS1] },  // lecture day, last: only the pick
  { key: 'bridge', title: 'From light to CO₂ fixation', beats: BRIDGE, stagings: [bridgeA] },
  { key: 'pp11', title: 'Excess light', beats: PP11, stagings: [pp11D] },  // last round: only the pick
  { key: 'pp12', title: 'Photoprotection and repair', beats: PP12, stagings: [pp12B] },  // last round: only the pick
  { key: 'pp13', title: 'Chlorophyll fluorescence', beats: PP13, stagings: [pp13A, pp13B, pp13C, pp13D] },
  { key: 'cb1', title: 'How the cycle was found', beats: CB1, stagings: [{ ...cb1Story, beats: CB1V3 }] },  // lecturer, 29 Oct 2026: only the picked version
  { key: 'cb2', title: 'RuBisCO', beats: CB2, stagings: [cb2A, cb2B, cb2C] },
  { key: 'cb3', title: 'Reduction and regeneration', beats: CB3, stagings: [cb3S] },
  { key: 'reduction', title: 'Reduction', beats: REDUCTION, stagings: [reductionS] },
  { key: 'regeneration', title: 'Regeneration', beats: REGENERATION, stagings: [regenerationS] },
  { key: 'cb4', title: 'Sucrose and starch', beats: CB4N, stagings: [{ ...cb4Routes, beats: CB4V3 }, { ...cb4N, beats: CB4V2 }, { ...cb4S2, beats: CB4V2 }, { ...cb4P, beats: CB4V2 }, cb4S] },
  { key: 'eff', title: 'Efficiency of photosynthesis', beats: EFF, stagings: [effS] },
  { key: 'rubisco', title: 'RuBisCO', beats: RUBISCO, stagings: [rubiscoS] },
  { key: 'lf10', title: 'CO₂ uptake: from the air to RuBisCO', beats: LF10, stagings: [{ ...lf10B, beats: LF10K }] },  // lecture day, last: only the pick
  { key: 'lf11', title: 'C₃ photosynthesis and refixation', beats: LF11, stagings: [{ ...lf11K, beats: LF11K }, lf11M] },
  { key: 'ov', title: 'How plants cope with scarce CO₂', beats: OV, stagings: [ovE, ovA, ovB, ovC, ovD] },  // ove first: the text-only table (lecturer, 30 Oct 2026)
  { key: 'lf11a', title: 'C₂ photosynthesis: C₃–C₄ intermediates', beats: LF11A, stagings: [c2sB3] },  /* last round: only the pick */  /* lecturer, 30 Oct 2026, later: picked c2sb again; c2sb1, c2sb2 removed; c2sb3, c2sb4 polish it */  // lecturer, 30 Oct 2026, late: picked c2sb; the rest removed; c2sb1, c2sb2 polish it
  { key: 'lf12', title: 'C₄ photosynthesis', beats: LF12, stagings: [c4M2B] },  /* lecture day, last: "remove all the C₄ variants; polish the pick (c4m2): one cycle, then the final state at once" = c4m2b */
  { key: 'lf13', title: 'Crassulacean acid metabolism (CAM)', beats: LF13, stagings: [lf13M2] },  /* lecture day, last: picked lf13m; the other CAM variants removed; lf13m2 polishes it (light energy by day; the acid sleeps at night, as in cam-kranz) */
  { key: 'c2story', title: 'RuBisCO through Earth’s history', beats: C2STORY, stagings: [c2storyRh] },  // lecturer, 30 Oct 2026, late: "for the hot day example, now I only want that one; remove all the other variants"  // lecturer, 30 Oct 2026: only version 3 (the record) and its variants  // lecturer, 29 Oct 2026: versions 3–6 removed
  { key: 'history', title: 'RuBisCO through Earth’s history', beats: HISTORY, stagings: [historyS] },
  { key: 'rf5', title: 'Carboxylation and oxygenation', beats: RF5, stagings: [rf5S] },
  { key: 'rf6', title: 'Photorespiration', beats: RF6N, stagings: [rf6W1, rf6W2, rf6S] },
  // style frame for the C₂ and C₄ slides (not on a slide yet; pilot.html?anim=c4style)
  { key: 'c4style', title: 'C₂ and C₄: style frame', beats: c4Style.beats ?? [], stagings: [c4Style] },
  { key: 'rf7', title: 'Light-response curve', beats: RF7, stagings: [rf7S] },
  { key: 'rf8', title: 'FvCB model', beats: RF8, stagings: [rf8S] },
  { key: 'cp9', title: 'Measuring leaf gas exchange', beats: CP9, stagings: [cp9R1, cp9R2] },  // later 30 Oct: "make the animation really simple: a real instrument, then zoom inside"; the old A–D removed
  { key: 'cp10', title: 'CO₂ diffusion pathway', beats: CP10, stagings: [cp10A, cp10B, cp10C, cp10D] },
  { key: 'cc11', title: 'Refixation of photorespired CO₂', beats: CC11, stagings: [cc11A, cc11B, cc11C, cc11D] },
  { key: 'cc12', title: 'C₄ photosynthesis', beats: CC12, stagings: [cc12A, cc12B, cc12C, cc12D] },
  { key: 'cc13', title: 'Crassulacean acid metabolism (CAM)', beats: CC13, stagings: [cc13A, cc13B, cc13C, cc13D] },
  { key: 'cr14', title: 'Rising CO₂', beats: CR14, stagings: [cr14A, cr14B, cr14C, cr14D] },
  { key: 'cr15', title: 'From leaf to yield', beats: CR15, stagings: [{ ...cr15A, beats: CR15A }, cr15B, cr15C, cr15D] },
];
// lecture day: only the picked stagings, deck-wide (day-picks.ts)
for (const a of ANIMATIONS) a.stagings = picked(`anim-${a.key}`, a.stagings, true);

