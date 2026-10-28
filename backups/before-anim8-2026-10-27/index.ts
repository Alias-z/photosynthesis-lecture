// The light-block animations and the staging variants listed on the pilot page; the first listed plays by default.
// Round 4 (26 Oct 2026): only the two current variants of each are listed, sky E (B, tuned) and D, life F and G (D's
// windows with C's animals, zoom-in); E and F play 1.15× faster, at the lecturer's request. The earlier variants
// (sky A–C, life A–D) stay in the code, unlisted.
import { ANTENNA, FATES, LEAF, LIFE, PIGMENTS, PSII, SKY } from './beats';
import { STAGING as antennaA } from './antenna-a';
import { STAGING as antennaB } from './antenna-b';
import { STAGING as psii7A } from './psii7-a';
import { STAGING as psii7B } from './psii7-b';
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
  { key: 'psii', title: 'Photosystem II', beats: PSII, stagings: [psii7A, psii7B] },
];
