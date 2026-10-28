// FvCB model (slide C8), animation rf8, staging A: on slide C8's schema in the thesis look (figure C8 v1), with the A/Cᵢ
// curve redrawn beside it. The story, the timing and the camera: rf8-common.ts.
import { makeStaging } from './rf8-common';

export const STAGING = makeStaging({
  id: 'a',
  name: 'A · Zoom on each limit (thesis look)',
  note: 'The slide C8 schema (thesis look): Cᵢ rises, the camera zooms to RuBisCO, then RuBP regeneration, then triose-phosphate export, each limit lit in turn while the A/Cᵢ dot moves; back out to the slide.',
  look: 'thesis',
  panel: 'drawn',
});
