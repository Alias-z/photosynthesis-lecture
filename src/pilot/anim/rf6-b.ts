// Photorespiration (slide C6), staging B: on the slide's tem look (figure C6 v2). The camera dives into the peroxisome's
// cut-out and the whole micrograph it comes from opens around it (Frederick & Newcomb 1969, Fig. 6: a peroxisome between
// two chloroplasts, a mitochondrion beside it); the carbon travels between the real organelles, along the arrows of the
// slide's figure C6 v5; back out. The story, the timing and the glyphs: rf6-common.ts.
import { RF6_TEM } from './beats-rf56';
import { B, makeStaging, MP, MV } from './rf6-common';

export const STAGING = makeStaging({
  id: 'b',
  name: 'B · On the real micrograph (tem)',
  note: 'The slide C6 figure (tem look): zoom into the peroxisome, the whole tobacco-leaf micrograph opens around it, and the carbon travels between the real chloroplast, peroxisome and mitochondrion; then back out.',
  look: 'tem',
  micro: true,
  beats: RF6_TEM,
  order: ['glycolate', 'perox', 'mito', 'back', 'screen', 'out'],
  start: B,
  cam: [[[0.05, 1.1, MV]], [[0.05, 1.0, MP]], [[0.05, 1.0, MV]], [], [], [[0.1, 1.3, B]]],
});
