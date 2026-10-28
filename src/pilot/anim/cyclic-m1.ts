// Cyclic electron flow, staging m1: the slide 10b figure zoomed onto the cycle, every step on a click; the readout of the
// H⁺ count and ATP : NADPH on the left throughout; the conditions as a strip of icons, the consequence on the figure and
// the Munekage et al. 2004 clipping. The story, the timing, the camera and the readout: cyclicm-common.ts.
import { makeSlideStaging } from './cyclicm-common';

export const STAGING = makeSlideStaging({
  id: 'm1',
  name: 'M1 · Slide zoom, click stops',
  note: 'The slide figure with an H⁺ count and ATP : NADPH readout always on; zoom onto the cycle, one click per step; the conditions as icons, then the Munekage 2004 plants.',
  when: 'strip',
});
