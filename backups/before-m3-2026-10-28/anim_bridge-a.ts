// The light → dark bridge, staging a: one scale, a horizontal swipe from the chain to the stroma (bridge-common.ts).
import { makeStaging, W } from './bridge-common';

export const STAGING = makeStaging({
  id: 'a',
  name: 'a · Swipe right at one scale',
  note: 'The 7m1 chain, then one horizontal swipe into the dark-reaction strip at the same scale: ATP and NADPH glide over, CO₂ is fixed at Rubisco, triose phosphate is made, ADP + Pᵢ and NADP⁺ go back; the swipe goes on: sucrose leaves into a wheat grain, which fills with starch and becomes bread; Rubisco glows to end',
  cams: [{ s: 1.2, c: [400, 300] }, { s: 1.2, c: [1180, 300] }, { s: 1.2, c: [1150, 300] }, { s: 1.1, c: [1640, 90] }, { s: 1.2, c: [W.rub[0] - 40, 300] }],
  bread: 'world',
});
