// The light → dark bridge, staging b: the camera pulls back to show chain and strip side by side, then dives into the
// stroma and onto RuBisCO (bridge-common.ts).
import { makeStaging, W } from './bridge-common';

export const STAGING = makeStaging({
  id: 'b',
  name: 'b · Pull back, then dive in',
  note: 'The 7m1 chain; the camera pulls back so chain and strip sit side by side while ATP and NADPH cross the seam, then zooms into the stroma for CO₂ fixation; the leaf’s starch glows and an inset shows a wheat grain filling with starch and becoming bread; ends close on RuBisCO',
  cams: [{ s: 1.2, c: [400, 300] }, { s: 0.98, c: [800, 290] }, { s: 1.4, c: [1150, 250] }, { s: 1.4, c: [1150, 250] }, { s: 2.3, c: [W.rub[0], W.rub[1] - 10] }],
  bread: 'inset',
});
