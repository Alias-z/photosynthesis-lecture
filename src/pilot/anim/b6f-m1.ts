// Cytochrome b₆f, staging m1: one close view on b₆f (wide enough to show plastocyanin's way to photosystem I) for both
// steps of the story, then out to the whole chain. Photosystem I is named before plastocyanin moves to it.
// The story, the timing and the camera: b6fm-common.ts.
import { makeStaging } from './b6fm-common';

const Z = { s: 2.9, c: [350, 313.5] as [number, number] };

export const STAGING = makeStaging({
  id: 'm1',
  name: 'm1 · Zoom on b₆f',
  note: 'The slide 8 figure: zoom into cytochrome b₆f, name each part before it acts, plastocyanin goes to photosystem I and stays docked there at the zoom-out.',
  z1: Z, z2: Z, z2e: Z, follow: false,
  b2: { pc: 0.1, psi: 0.7, hold: 1.6, e: 1.7, eD: 0.9, go: 2.8, goD: 1.3, end: 4.4 },
});
