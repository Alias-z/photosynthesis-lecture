// FvCB model (slide C8), animation rf8, staging B: on slide C8's schema in the glow look (figure C8 v2), with the
// lecturer's own MSc-thesis Fig. 5 (wheat A/Cᵢ) as the instrument. The story, the timing and the camera: rf8-common.ts.
import { makeStaging } from './rf8-common';

export const STAGING = makeStaging({
  id: 'b',
  name: 'B · Zoom on each limit, thesis curve (glow look)',
  note: 'The slide C8 schema (glow look) zooms to each limit in turn, while the dot runs along the lecturer’s own thesis Fig. 5 (wheat A/Cᵢ); the TPU cap is drawn over it.',
  look: 'glow',
  panel: 'thesis',
});
