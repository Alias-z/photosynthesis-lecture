// Cytochrome b₆f, staging m2: a closer view on b₆f; in beat 2 the camera moves down to plastocyanin and then follows it
// through the lumen to photosystem I, which is named as plastocyanin arrives; then out to the whole chain.
// The story, the timing and the camera: b6fm-common.ts.
import { makeStaging } from './b6fm-common';

export const STAGING = makeStaging({
  id: 'm2',
  name: 'm2 · Follow plastocyanin',
  note: 'The slide 8 figure: a close view on cytochrome b₆f, then the camera follows plastocyanin through the lumen to photosystem I, where it stays docked at the zoom-out.',
  z1: { s: 3.3, c: [327, 301] }, z2: { s: 3.3, c: [366, 326] }, z2e: { s: 3.3, c: [474, 302] }, follow: true,
  b2: { cam: [0.05, 0.95], pc: 0.6, psi: 4.2, hold: 2.0, e: 2.1, eD: 0.9, go: 3.2, goD: 1.4, end: 5.0 },
});
