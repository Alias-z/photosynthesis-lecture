// The light → dark bridge, staging a: one scale, a horizontal swipe from the chain to the stroma (bridge-common.ts).
import { makeStaging, PAN } from './bridge-common';

const BASE = makeStaging({
  id: 'a',
  name: 'a · One pan right at one scale',
  note: 'The 7m1 chain, one horizontal pan (3 s, ease-in-out, one scale) into the dark-reaction strip, then a still camera: ATP and NADPH glide over, CO₂ is fixed at RuBisCO, triose phosphate is made, ADP + Pᵢ and NADP⁺ go back; sucrose glides into a wheat grain, which fills with starch and becomes bread; everything else dims and RuBisCO glows',
  // one camera move (lecturer, 28 Oct 2026): a single horizontal pan at one scale in beat 1, ease-in-out, PAN s; still after
  cams: [{ s: 1.15, c: [400, 300] }, { s: 1.15, c: [1240, 300] }, { s: 1.15, c: [1240, 300] }, { s: 1.15, c: [1240, 300] }, { s: 1.15, c: [1240, 300] }],
  pan: PAN,
  bread: 'world',
});

// the key lines on the stage (lecturer, 29 Oct 2026: "people don't read the text under the animation")
export const STAGING = { ...BASE, keys: [
  { beat: 1, text: 'ATP and NADPH drive CO₂ fixation', x: 420, y: 668, size: 40 },
  { beat: 2, text: 'RuBisCO fixes CO₂', x: 420, y: 668, size: 40 },
  { beat: 3, text: 'Bread’s carbon: fixed from CO₂', x: 420, y: 668, size: 40 },
  { beat: 4, text: 'What is RuBisCO?', x: 800, y: 682, size: 44 },
] };
