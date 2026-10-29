// The overview slide's page figure, layout d (slide C10o): the end state of the animation 'ovd' (anim/ov-d.ts), still,
// without the problem and the question. The cards of the climate axis, gathered into a table under the band (cool,
// moist · hot, sunny · hot, dry): each card the plant photo, the name, the share of species and how the type copes;
// what it gains and what it costs in the cells below; rust arrows C₃ → C₂ → C₄ and C₃ → CAM. Drawn by figs/cov-c.ts.
import { drawTable } from './cov-c';

export function draw(): string {
  return drawTable('d');
}
