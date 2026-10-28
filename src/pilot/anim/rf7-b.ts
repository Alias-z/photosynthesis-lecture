// Light-response curve (slide C7), animation rf7, staging B: on slide C7's schema in the glow look (figure C7 v2); the
// camera dives deeper into the thylakoid, then pans down to RuBisCO as uptake levels off; beat 5 is history-led,
// Gaastra's 1959 light curves at four CO₂ levels, which leads into FvCB. The story and timing: rf7-common.ts.
import { RF7_GAASTRA } from './beats-rf78';
import { makeStaging } from './rf7-common';

export const STAGING = makeStaging({
  id: 'b',
  name: 'B · Thylakoid, then RuBisCO; Gaastra 1959 (glow look)',
  note: 'The slide C7 schema (glow look): the camera dives into the thylakoid as light rises, then pans to RuBisCO when uptake levels off; Gaastra’s 1959 spinach curves show that more CO₂ raises the plateau; back out to the slide.',
  look: 'glow',
  clip: 'gaastra',
  camera: 'deep',
  beats: RF7_GAASTRA,
});
