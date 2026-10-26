// Slide 2 only. Preserve the original question as its title.
import type { ContextTopic } from '../lib/context';

export const skyLeafBrief = {
  title: 'Why is the sky blue, and why are leaves green?',
  content: 'Use the blue sky and green leaves to open the light-reaction lecture. The sky question leads to wavelength, photon energy and PAR; return to leaves when introducing pigments.',
  display: 'One large photograph showing both blue sky and green leaves. Use the existing question as the only title. Let students consider both observations, then take the sky question first. Keep visible text minimal.',
};

// Detailed scientific context confirmed by the lecturer on 22 October 2026.
// This is the explanation behind the slide, not a display prompt or a script
// to fit verbatim into its one-minute opening slot.
export const skyLeafContext: ContextTopic = {
  title: 'Why is the sky blue, and why are leaves green?',
  sections: [
    {
      heading: 'Different interactions with the same sunlight',
      paragraphs: [
        'The blue sky and a green leaf illustrate two different ways that matter changes the light reaching our eyes. Sunlight contains a broad range of wavelengths. The colour we perceive depends on which wavelengths reach us, their relative intensities, and our visual sensitivity.',
      ],
    },
    {
      heading: 'Why air makes the sky appear blue',
      paragraphs: [
        'Sunlight’s oscillating electric field induces oscillations in the charges within air molecules. These produce radiation in other directions: light is scattered. For molecules much smaller than the wavelength, Rayleigh scattering applies, with scattering strength approximately proportional to 1/λ⁴.',
        'Consequently, 450 nm blue light is scattered about 4.4 times more strongly than 650 nm red light under the same conditions. When we look away from the Sun, some of this scattered sunlight reaches our eyes, enriched in shorter wavelengths. Rayleigh scattering changes the light’s direction while essentially preserving its wavelength. It does not convert red photons into blue photons.',
      ],
      referenceUrls: ['https://acd-ext.gsfc.nasa.gov/anonftp/acd/daac_ozone/Lecture4/Text/Lecture_4/rayleigh.html'],
    },
    {
      heading: 'Blue rather than violet, and the different colours of sunset',
      paragraphs: [
        'Violet scatters even more strongly, but perceived colour depends on the entire scattered spectrum and the eye’s response. Our lower sensitivity to violet helps explain the blue appearance.',
        'At sunset, sunlight travels through a longer atmospheric path. More short-wavelength light is scattered out of the direct beam, leaving the transmitted sunlight relatively enriched in red and orange. The observer’s viewing direction therefore matters: scattered skylight and the direct solar beam have different spectra.',
      ],
      referenceUrls: ['https://science.nasa.gov/ems/03_behaviors/', 'https://spaceplace.nasa.gov/blue-sky/en/'],
    },
    {
      heading: 'Why a leaf appears green',
      paragraphs: [
        'Chlorophyll’s molecular structure gives it wavelength-dependent absorption bands, with strong absorption in the blue and red regions and weaker absorption in much of the green region. Absorption transfers photon energy into an electronic excitation of the pigment. The surrounding protein also influences these absorption properties.',
      ],
      referenceUrls: ['https://doi.org/10.1126/science.aay2058'],
    },
    {
      heading: 'Pigment chemistry and tissue structure',
      paragraphs: [
        'A whole leaf combines this selective absorption with reflection, transmission and internal scattering. Light changes direction at interfaces within the tissue, including those between hydrated cell walls and air spaces. Some light escapes back towards the observer. Because pigments remove blue and red light more strongly, the escaping visible light is relatively enriched in green. Leaf colour therefore reflects both pigment chemistry and tissue structure.',
      ],
      referenceUrls: ['https://doi.org/10.2307/2657019'],
    },
    {
      heading: 'A green appearance does not mean most green light is rejected',
      paragraphs: [
        'A leaf can absorb substantial green light while reflecting more green than blue or red. Weaker absorption also allows green light to penetrate deeper before absorption. Under strong white light, this can deliver additional excitation to deeper chloroplasts whose photosynthetic capacity is less saturated than that of chloroplasts near the illuminated surface.',
        'Terashima and colleagues demonstrated this advantage for additional green light in sunflower leaves; it depends on the background illumination.',
      ],
      referenceUrls: ['https://doi.org/10.1093/pcp/pcp034'],
    },
  ],
  references: [
    {
      label: 'Molecular scattering',
      citation: 'NASA Goddard · Atmospheric-science teaching resource',
      title: 'Rayleigh Scattering',
      url: 'https://acd-ext.gsfc.nasa.gov/anonftp/acd/daac_ozone/Lecture4/Text/Lecture_4/rayleigh.html',
      note: 'Explains the induced-charge response, wavelength preservation and approximately inverse-fourth-power wavelength dependence. The 4.4 ratio is calculated as (650/450)⁴.',
    },
    {
      label: 'Scattering and colour perception',
      citation: 'NASA Science · Electromagnetic-spectrum resource',
      title: 'Wave Behaviors',
      url: 'https://science.nasa.gov/ems/03_behaviors/',
      note: 'Background on light–matter interactions and the eye’s response to blue and violet skylight.',
    },
    {
      label: 'Atmospheric path length at sunset',
      citation: 'NASA Space Place · Explanatory resource',
      title: 'Why Is the Sky Blue?',
      url: 'https://spaceplace.nasa.gov/blue-sky/en/',
      note: 'Supports the longer atmospheric path and the relative enrichment of red and orange in transmitted sunset light. Used as a scientific explanation, not as a visual-style reference.',
    },
    {
      label: 'Pigment absorption and excitation',
      citation: 'Croce & van Amerongen (2020) · Science',
      title: 'Light harvesting in oxygenic photosynthesis: Structural biology meets spectroscopy',
      url: 'https://doi.org/10.1126/science.aay2058',
      note: 'Pigment spectra, protein environments and electronic excitation. Also used in the LHC discussion.',
    },
    {
      label: 'Internal leaf scattering',
      citation: 'Slaton, Hunt & Smith (2001) · American Journal of Botany',
      title: 'Estimating near-infrared leaf reflectance from leaf structural characteristics',
      url: 'https://doi.org/10.2307/2657019',
      note: 'The introduction explains scattering at cell-wall and air-space interfaces. Its quantitative measurements concern near-infrared reflectance; do not treat those results as visible pigment-absorption spectra.',
    },
    {
      label: 'Green-light absorption and use within leaves',
      citation: 'Terashima et al. (2009) · Plant and Cell Physiology',
      title: 'Green light drives leaf photosynthesis more efficiently than red light in strong white light: revisiting the enigmatic question of why leaves are green',
      url: 'https://doi.org/10.1093/pcp/pcp034',
      note: 'Explains deeper green-light penetration and the conditional advantage of additional green light under moderate to strong white background light.',
    },
  ],
};
