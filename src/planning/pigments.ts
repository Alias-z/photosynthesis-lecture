// Slide 5. Leaf colour is the central conclusion; PAR provides spectrum context.
import type { ContextTopic } from '../lib/context';

export const pigmentsBrief = {
  title: 'Why are leaves green?',
  takeaway: 'Pigments absorb wavelengths differently. Leaves reflect more green light, so they look green.',
  content: 'Show chlorophyll a/b and carotenoid absorption peaks. Mark PAR (400–700 nm). Green light is also transmitted and absorbed within leaves.',
  display: 'Main figure: pigment spectra. Two small examples: green light penetrating leaf tissue and scattering along longer paths, and red algae using phycoerythrin to absorb green light. Keep the leaf-colour explanation dominant. Static only.',
  handoff: [
    'The main teaching point is selective pigment absorption and its connection to leaf colour. Keep PAR as a range annotation.',
    'Use sourced absorption spectra with labelled peaks. Identify the measurement medium or pigment–protein context, because peak positions vary. Distinguish pigment absorption from whole-leaf absorptance and from an action spectrum.',
    'The leaf inset should show internal scattering lengthening the optical path and green light reaching deeper chloroplasts. Leaf thickness acts alongside anatomy and pigment content. Avoid implying that thickness alone guarantees greater photosynthesis.',
    'The algal example shows a different pigment complement capturing wavelengths chlorophyll absorbs weakly. Phycoerythrin is an example within conventional PAR.',
    'The far-red paper is background for the PAR boundary only. Keep it in Context without making it the slide conclusion or adding another teaching block.',
    'Keep the four-minute estimate and static study content. Context replaces the separate References control and keeps explanation with its sources. It also holds the LHC discussion while that next slide is being planned. LHC context and papers are in src/planning/lightHarvesting.ts.',
  ],
};

export const pigmentReferences = [
  {
    label: 'Pigment absorption and spectral tuning',
    citation: 'Croce & van Amerongen (2014) · Nature Chemical Biology',
    title: 'Natural strategies for photosynthetic light harvesting',
    url: 'https://doi.org/10.1038/nchembio.1555',
    note: 'Different pigment absorption spectra and the influence of the molecular environment on their absorption properties.',
  },
  {
    label: 'Green light inside leaves',
    citation: 'Terashima et al. (2009) · Plant and Cell Physiology',
    title: 'Green light drives leaf photosynthesis more efficiently than red light in strong white light: revisiting the enigmatic question of why leaves are green',
    url: 'https://doi.org/10.1093/pcp/pcp034',
    note: 'Leaf colour, green-light penetration and use by deeper chloroplasts. The reported advantage over red light depends on the background light.',
  },
  {
    label: 'Accessory pigments in red algae',
    citation: 'Zhang et al. (2017) · Nature',
    title: 'Structure of phycobilisome from the red alga Griffithsia pacifica',
    url: 'https://doi.org/10.1038/nature24278',
    note: 'The reported absorption spectrum includes phycoerythrin peaks near 540 and 565 nm.',
  },
  {
    label: 'PAR boundary (background)',
    citation: 'Zhen & Bugbee (2020) · Plant, Cell & Environment',
    title: 'Far-red photons have equivalent efficiency to traditional photosynthetic photons: Implications for redefining photosynthetically active radiation',
    url: 'https://doi.org/10.1111/pce.13730',
    note: 'Far-red contribution in combination with shorter wavelengths. Supporting context only; pigment absorption and leaf colour remain the main point.',
  },
];

export const pigmentsContext: ContextTopic = {
  title: 'Why are leaves green?',
  sections: [
    {
      heading: 'Selective absorption and leaf colour',
      paragraphs: [
        'Light reaching a leaf can be absorbed, reflected or transmitted. Chlorophyll absorbs blue and red light strongly, but green light more weakly. Consequently, the reflected light is relatively enriched in green, giving leaves their familiar colour. Green appearance does not mean that most green light is reflected.',
      ],
      referenceUrls: ['https://doi.org/10.1093/pcp/pcp034'],
    },
    {
      heading: 'Different pigments, different absorption spectra',
      paragraphs: [
        'The pigments have different absorption spectra. Chlorophyll a and b have shifted blue and red absorption peaks, so their contributions overlap without being identical. Carotenoids absorb mainly in the blue to blue-green region, extending light capture. Peak positions also depend on the pigment’s molecular environment.',
      ],
      referenceUrls: ['https://doi.org/10.1038/nchembio.1555'],
    },
    {
      heading: 'Green light inside a leaf',
      paragraphs: [
        'Green light still supports photosynthesis. Its weaker absorption lets it penetrate deeper into the leaf, while internal scattering lengthens its path and increases opportunities for absorption. Under strong white light, additional green light can reach deeper chloroplasts whose photosynthesis is less saturated, making it more effective than additional red light. Leaf anatomy and pigment distribution matter; thickness alone does not guarantee this advantage.',
      ],
      referenceUrls: ['https://doi.org/10.1093/pcp/pcp034'],
    },
    {
      heading: 'Accessory pigments in algae',
      paragraphs: [
        'Other photosynthetic organisms use different pigment combinations. In the red alga Griffithsia pacifica, phycoerythrin absorbs strongly around 540 and 565 nm, capturing green wavelengths that chlorophyll absorbs relatively weakly. These wavelengths are within conventional PAR: the contrast is between pigment absorption spectra.',
      ],
      referenceUrls: ['https://doi.org/10.1038/nature24278'],
    },
  ],
  references: pigmentReferences,
};
