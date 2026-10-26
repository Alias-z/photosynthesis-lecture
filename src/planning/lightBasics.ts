// Slide 3 only. A static spectrum overview before wavelength, energy and scattering.
import type { ContextTopic } from '../lib/context';

export const lightBasicsBrief = {
  title: 'The solar spectrum',
  content: 'Sunlight contains many wavelengths. Locate radio waves, microwaves, infrared, visible light, ultraviolet, X-rays and gamma rays on the electromagnetic spectrum. Mark human vision (≈380–780 nm) and conventional PAR (400–700 nm).',
  display: 'Static only. Left: key facts and ranges. Right: sunlight through a prism, linked to the visible part of an expanded electromagnetic-spectrum scale. Label the regions and bracket vision and PAR. Keep all text and annotations visible in the PDF. Wavelength, energy and scattering follow on the next slide.',
};

// Lecture context confirmed on 22 October 2026. Retain this focused explanation;
// the lecturer dropped the extended discussion of the evolution of human vision.
export const lightBasicsContext: ContextTopic = {
  title: 'The solar spectrum',
  sections: [
    {
      heading: 'Sunlight and human vision',
      paragraphs: [
        'Sunlight supplies both energy and information to life. It contains a broad range of wavelengths; a prism separates its visible components into a continuous spectrum from violet to red. Human eyes detect roughly 380–780 nm, using this light to recognise objects, colours and movement. This is the human visible range.',
      ],
      referenceUrls: ['https://science.nasa.gov/ems/03_behaviors/', 'https://cie.co.at/eilvterm/17-21-003'],
    },
    {
      heading: 'Photosynthetically active radiation',
      paragraphs: [
        'Plants capture energy from an overlapping part of the spectrum. Photosynthetically active radiation—PAR—is conventionally defined as 400–700 nm, encompassing blue, green and red light. Photosynthetic pigments absorb photons within this range to drive the light reactions. PAR gives us a common basis for measuring light available for photosynthesis; the amount actually absorbed depends on the pigments and the leaf.',
      ],
      referenceUrls: ['https://cie.co.at/eilvterm/17-26-079', 'https://doi.org/10.1126/science.aay2058'],
    },
    {
      heading: 'Far-red light beyond conventional PAR',
      paragraphs: [
        'Biological activity continues beyond these boundaries. Far-red photons around 700–750 nm can support photosynthesis alongside shorter-wavelength light, illustrating why conventional PAR is a measurement range rather than a strict limit on photosynthesis.',
      ],
      referenceUrls: ['https://doi.org/10.1111/pce.13730'],
    },
    {
      heading: 'Ultraviolet, infrared and microwaves',
      paragraphs: [
        'Toward shorter wavelengths, ultraviolet can trigger protective responses and damage cells at excessive exposure. Toward longer wavelengths, absorbed infrared contributes to warming tissues. Microwaves lie farther beyond infrared; their absorption by water and other molecules provides the familiar example of heating food. Different parts of the spectrum therefore interact with living material in different ways.',
      ],
      referenceUrls: ['https://doi.org/10.1146/annurev-arplant-050718-095946', 'https://science.nasa.gov/ems/07_infraredwaves/', 'https://gml.noaa.gov/outreach/info_activities/pdfs/TBI_electromagnetic_radiation.pdf'],
    },
  ],
  references: [
    {
      label: 'Prism and wavelength-dependent refraction',
      citation: 'NASA Science · Electromagnetic-spectrum resource',
      title: 'Wave Behaviors',
      url: 'https://science.nasa.gov/ems/03_behaviors/',
      note: 'Dispersion separates components already present in sunlight. The visible prism spectrum and the wider electromagnetic-spectrum scale are distinct representations.',
    },
    {
      label: 'Human visible range',
      citation: 'CIE S 017:2020 · International Lighting Vocabulary',
      title: 'Visible radiation',
      url: 'https://cie.co.at/eilvterm/17-21-003',
      note: 'Visible limits are approximate and depend on the observer and radiant flux. The lecture uses roughly 380–780 nm.',
    },
    {
      label: 'Conventional PAR',
      citation: 'CIE S 017:2020 · International Lighting Vocabulary',
      title: 'Photosynthetically active radiation',
      url: 'https://cie.co.at/eilvterm/17-26-079',
      note: 'Defines the conventional 400–700 nm waveband.',
    },
    {
      label: 'Pigment absorption and light harvesting',
      citation: 'Croce & van Amerongen (2020) · Science',
      title: 'Light harvesting in oxygenic photosynthesis: Structural biology meets spectroscopy',
      url: 'https://doi.org/10.1126/science.aay2058',
      note: 'Reviews how photosynthetic pigments and their protein environments determine absorption and light harvesting.',
    },
    {
      label: 'Far-red contribution to photosynthesis',
      citation: 'Zhen & Bugbee (2020) · Plant, Cell & Environment',
      title: 'Far-red photons have equivalent efficiency to traditional photosynthetic photons: Implications for redefining photosynthetically active radiation',
      url: 'https://doi.org/10.1111/pce.13730',
      note: 'Experiments with 14 crop species show a photosynthetic contribution from far-red photons together with shorter-wavelength light; far-red alone had little effect.',
    },
    {
      label: 'UV-B signalling and protection',
      citation: 'Podolec, Demarsy & Ulm (2021) · Annual Review of Plant Biology',
      title: 'Perception and Signaling of Ultraviolet-B Radiation in Plants',
      url: 'https://doi.org/10.1146/annurev-arplant-050718-095946',
      note: 'Reviews the links between UV-B perception, protective responses and tolerance to UV-B damage.',
    },
    {
      label: 'Infrared and heating',
      citation: 'NASA Science · Electromagnetic-spectrum resource',
      title: 'Infrared Waves',
      url: 'https://science.nasa.gov/ems/07_infraredwaves/',
      note: 'Infrared absorption, warming and thermal emission. Heating also occurs when other wavelengths are absorbed.',
    },
    {
      label: 'Microwave absorption and heating',
      citation: 'NOAA Global Monitoring Laboratory · Educational resource',
      title: 'Electromagnetic waves',
      url: 'https://gml.noaa.gov/outreach/info_activities/pdfs/TBI_electromagnetic_radiation.pdf',
      note: 'Locates the spectrum regions and explains the familiar heating of food through microwave absorption by water and other molecules.',
    },
  ],
};
