// Approved text of lecture 2 slides C10–C15 (27 Oct 2026), shown over the earlier figures of those slides.
import type { PlateText } from './types';

type Text = Pick<PlateText, 'n' | 'title' | 'lead' | 'points'>;

export const C10: Text = {
  n: 'C10',
  title: 'C₄ photosynthesis',
  lead: 'C₄ plants concentrate CO₂ in bundle-sheath cells, where RuBisCO works at high CO₂ and photorespiration is nearly absent.',
  points: [
    { claim: 'PEP carboxylase.', text: 'In mesophyll cells it fixes HCO₃⁻ into a four-carbon acid<br>It does not react with O₂' },
    { claim: 'Kranz anatomy.', text: 'The C₄ acid moves to bundle-sheath cells around the veins<br>There it releases CO₂ next to RuBisCO' },
    { claim: 'Costs and benefits.', text: 'Concentrating CO₂ costs extra ATP<br>It pays in hot, dry, bright conditions: maize, sugarcane, sorghum' },
  ],
};

export const C11: Text = {
  n: 'C11',
  title: 'Evolution of C₄',
  lead: 'C₄ evolved more than 60 times from C₃ ancestors, through steps that recapture photorespired CO₂.',
  points: [
    { claim: 'Refixation in C₃.', text: 'Chloroplasts cover the mitochondria<br>Part of the photorespired CO₂ is refixed before it escapes' },
    { claim: 'C₂ photosynthesis.', text: 'Glycine is decarboxylated mainly in the bundle sheath<br>CO₂ builds up there and is refixed by RuBisCO' },
    { claim: 'When and where.', text: 'Mostly in the last 30 million years, as atmospheric CO₂ fell<br>In hot, dry, open habitats where photorespiration is high' },
  ],
};

export const C12: Text = {
  n: 'C12',
  title: 'CAM',
  lead: 'CAM plants take up CO₂ at night and fix it by day behind closed stomata, saving water.',
  points: [
    { claim: 'Night.', text: 'Stomata open; PEP carboxylase fixes CO₂ into malate<br>Malic acid is stored in the vacuole' },
    { claim: 'Day.', text: 'Stomata close; malate releases CO₂<br>RuBisCO fixes it, using ATP and NADPH from the light reactions' },
    { claim: 'Water saving.', text: 'Night air is cooler and more humid, so less water is lost per CO₂<br>Pineapple, agave, cacti, many orchids' },
  ],
};

export const C13: Text = {
  n: 'C13',
  title: 'Rising CO₂',
  lead: 'Higher CO₂ raises photosynthesis and yield of C₃ crops, but lowers grain quality.',
  points: [
    { claim: 'C₃ crops.', text: 'More CO₂ speeds carboxylation and suppresses oxygenation<br>Field yield +18 % at ≈ 550 ppm (FACE)' },
    { claim: 'C₄ crops.', text: 'Already saturated with CO₂<br>They gain only in drought, by saving water through narrower stomata' },
    { claim: 'Grain quality.', text: 'Less protein, zinc and iron in wheat and rice grain' },
  ],
};

export const C15: Text = {
  n: 'C15',
  title: 'From leaf to loaf',
  lead: 'The sugar made in the leaves fills the grain as starch.',
  points: [
    { claim: 'Sources of grain carbon.', text: 'Flag leaf and ear photosynthesis during grain filling<br>Stem reserves stored before flowering' },
    { claim: 'Phloem transport.', text: 'Sucrose moves from leaves and stem to the grain' },
    { claim: 'Grain starch.', text: 'The grain turns sucrose into starch, the carbon in bread' },
  ],
};
