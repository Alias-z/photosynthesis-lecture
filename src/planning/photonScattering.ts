import type { ContextTopic } from '../lib/context';

// Slide 4's display brief is retained while visual variants remain for review.
export const photonScatteringBrief = {
  title: 'Photon energy and scattering',
  content: 'Einstein: light quanta, E = hν = hc/λ. Shorter λ means more energy per photon. Rayleigh: scattering ∝ 1/λ⁴, so blue scatters more than red. Optional Planck: energy exchange in quanta, ΔE = hν. Keep the findings distinct.',
  display: 'Black-and-white newspaper-cutout portraits of Einstein and Rayleigh, each beside his finding, equation and takeaway. Planck optional. “Animation” opens our existing seven-step blue-sky/sunset animation over most of the screen. “Close” returns. PDF keeps portraits and study content.',
};

export const photonScatteringContext: ContextTopic = {
  title: 'Photon energy and scattering',
  sections: [
    {
      heading: 'Photon energy',
      paragraphs: [
        'Light carries energy in discrete packets called photons. Einstein’s 1905 light-quantum proposal connects each photon’s energy to its frequency: E = hν = hc/λ, where h is Planck’s constant, c is the speed of light and λ is wavelength. Shorter wavelengths therefore carry more energy per photon: a blue photon carries more than a red photon. Increasing light intensity at a fixed wavelength supplies more photons without changing each photon’s energy. This distinction matters when comparing the energy supplied by different colours.',
      ],
      referenceUrls: ['https://www.nobelprize.org/prizes/physics/the-dual-nature-of-light-as-reflected-in-the-nobel-archives/'],
    },
    {
      heading: 'Rayleigh scattering',
      paragraphs: [
        'Wavelength also affects how light is scattered. Light’s electric field makes charges within air molecules oscillate, producing radiation in other directions. Rayleigh scattering increases approximately as 1/λ⁴, so blue light is scattered much more strongly than red. This wavelength dependence comes from the molecules’ electromagnetic response; greater photon energy alone does not explain it. Scattering changes the photon’s direction while essentially preserving its wavelength.',
      ],
      referenceUrls: ['https://psg.gsfc.nasa.gov/helpatm.php'],
    },
    {
      heading: 'The blue sky and sunset',
      paragraphs: [
        'When we look away from the Sun, this scattered light reaches our eyes and gives the sky its blue appearance. At sunset, sunlight travels through more atmosphere. More blue light is scattered out of the direct beam, leaving the sunlight reaching us relatively enriched in red and orange.',
      ],
      referenceUrls: ['https://spaceplace.nasa.gov/blue-sky/en/'],
    },
  ],
  references: [
    {
      label: 'Einstein and light quanta',
      citation: 'Nobel Prize archive · Historical account',
      title: 'The dual nature of light as reflected in the Nobel archives',
      url: 'https://www.nobelprize.org/prizes/physics/the-dual-nature-of-light-as-reflected-in-the-nobel-archives/',
      note: 'Einstein’s 1905 light-quantum proposal and the frequency dependence of photon energy.',
    },
    {
      label: 'Molecular Rayleigh scattering',
      citation: 'NASA Goddard · Planetary Spectrum Generator',
      title: 'Atmospheric modelling: molecular scattering',
      url: 'https://psg.gsfc.nasa.gov/helpatm.php',
      note: 'Explains induced molecular dipoles, elastic scattering and the approximate inverse-fourth-power wavelength dependence.',
    },
    {
      label: 'Sky colour and atmospheric path length',
      citation: 'NASA Space Place · Explanatory resource',
      title: 'Why Is the Sky Blue?',
      url: 'https://spaceplace.nasa.gov/blue-sky/en/',
      note: 'Explains blue scattered skylight and the relative enrichment of red and orange in transmitted sunset light.',
    },
  ],
};
