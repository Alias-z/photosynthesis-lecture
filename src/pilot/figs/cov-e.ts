// The overview slide's page figure e (slide C10o): the summary table, text only, still (figs/ov-table.ts; the
// animation 'ove' builds it cell by cell). 800 × 600; letters ≥ 12 px.
import { evoSvg, tableSvg, type Lay } from './ov-table';

const PAGE: Lay = { x0: 4, lw: 96, cw: 174, y0: 84, name: 24, small: 12, cell: 13, lh: 18, pad: 9 };

export function draw(): string {
  const tb = tableSvg('fove', PAGE);
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="A table comparing C₃, C₂, C₄ and CAM photosynthesis, in the order of their climates from cool and moist to hot and dry. For each: its share of species and where it lives; how it copes with scarce CO₂ (C₃ uses the CO₂ that diffuses in; C₂ traps the CO₂ that photorespiration releases, in the bundle sheath; C₄ pumps CO₂ into the bundle sheath; CAM takes CO₂ in at night, stores it as malic acid and uses it by day); what it gains; what it costs; and examples. Under the table: C₂, C₄ and CAM all evolved from C₃, many times.">
    ${tb.svg}${evoSvg('fove', PAGE, tb.bottom + 26, 14)}</svg>`;
}
