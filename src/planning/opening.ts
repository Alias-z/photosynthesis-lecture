// Opening slide only. The remaining slides and original animations stay in the deck.
import type { ContextTopic } from '../lib/context';

export const openingBrief = {
  title: 'Photosynthesis',
  content: 'Two 45-minute lectures. Photo: light reactions, solar energy and the colour of life on Earth. Synthesis: carbon reactions, CO₂ becoming sugars and the bread that feeds us.',
  display: 'Use the word “photosynthesis” as the organising idea. Split it into “photo” and “synthesis”. Connect “photo” to light reactions, sunlight and the colour of life. Connect “synthesis” to carbon reactions, sugars and bread as the food connection. Show 45 minutes for each part.',
};

// The lecturer confirmed this context on 22 October 2026: “yes, settle this”.
export const openingContext: ContextTopic = {
  title: 'Photosynthesis',
  sections: [
    {
      heading: 'Photo: capturing solar energy (45 minutes)',
      paragraphs: [
        'Pigments give photosynthetic organisms their colours and absorb light. The light reactions convert that absorbed energy into ATP and NADPH, which supply energy and reducing power for carbon assimilation.',
      ],
      referenceUrls: ['https://doi.org/10.1042/EBC20160016'],
    },
    {
      heading: 'Synthesis: building organic matter (45 minutes)',
      paragraphs: [
        'Plants use that energy and reducing power to convert CO₂ into carbohydrates. These support growth and food production: the starch in wheat grain, and ultimately our bread, contains carbon originally captured from the air.',
      ],
      referenceUrls: ['https://doi.org/10.1042/EBC20160016'],
    },
    {
      heading: 'The connection students should remember',
      paragraphs: [
        'Sunlight supplies the energy; CO₂ supplies the carbon. The two lectures explain how photosynthesis brings them together.',
        'The colour of life and the bread that feeds us connect the two parts of the opening. ATP and NADPH can be named as the link here; their mechanisms come later.',
      ],
    },
  ],
  references: [
    {
      label: 'Photosynthesis overview',
      citation: 'Johnson (2016) · Essays in Biochemistry',
      title: 'Photosynthesis',
      url: 'https://doi.org/10.1042/EBC20160016',
      note: 'Foundational overview connecting solar-energy capture, ATP and NADPH production, and carbon fixation. Background for the opening, rather than a latest-findings review.',
    },
  ],
};
