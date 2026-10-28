// Photosystem II, staging pa: on slide 7's figure 7m1. Plastoquinone sits in its Q_B site from the first frame; once
// reduced, plastoquinol drops out and wanders on a jittery path to the slide's PQ place, and a new plastoquinone drifts
// into the empty site. Ruben and Kamen: one flask. The story, the timing and the camera: psiim-common.ts.
import { PSIIP } from './beats-psiip';
import { makeStaging } from './psiim-common';

export const STAGING = makeStaging({
  id: 'pa',
  name: 'PA · PQ already bound, then wanders',
  note: 'The slide 7 figure (7m1): plastoquinone waits in Q_B before light; as plastoquinol it drops out and diffuses away; a new plastoquinone drifts in. One flask.',
  card: 'one',
  pq: 'bound',
  beats: PSIIP,
});
