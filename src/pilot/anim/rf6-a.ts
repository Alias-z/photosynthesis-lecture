// Photorespiration (slide C6), staging A: on the slide's thesis look (figure C6 v1). Follow the carbon of two
// 2-phosphoglycolate round the loop, one organelle at a time, with a carbon readout; then Somerville & Ogren's 1979
// screen; back out. The story, the timing and the glyphs: rf6-common.ts.
import { B, makeStaging, P1, P2, P3, P4 } from './rf6-common';

export const STAGING = makeStaging({
  id: 'a',
  name: 'A · On the slide (thesis): follow the carbon',
  note: 'The slide C6 figure (thesis look): the camera follows 4 carbon atoms from the chloroplast through peroxisome and mitochondrion and back (4 in, 3 back, 1 lost), then the 1979 mutant screen, then back out.',
  look: 'thesis',
  order: ['glycolate', 'perox', 'mito', 'back', 'screen', 'out'],
  start: B,
  cam: [[[0.05, 1.1, P1]], [[0.05, 1.0, P2]], [[0.05, 1.0, P3]], [[0.05, 1.1, P4]], [], [[0.1, 1.2, B]]],
});
