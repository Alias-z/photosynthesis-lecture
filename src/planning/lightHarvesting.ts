// Lecture context confirmed on 22 October 2026.
// Display and animation briefs confirmed on 22 October 2026.
// Slide 6 shows the prompt; finished graphics and animation are for visual variants.
import type { ContextTopic } from '../lib/context';

export const lightHarvestingBrief = {
  title: 'Light-harvesting complexes',
  takeaway: 'Different pigments → organised antenna → reaction centre.',
  content: 'Antenna: excitation transfer. Reaction centre: charge separation.',
  display: 'Compare chlorophyll a/b structures (–CH₃ / –CHO), then show LHCII → PSII and LHCI → PSI using published structures. Label LHCII: 8 a + 6 b per protein, a:b ≈ 1.3; LHCI: 45 a + 12 b per four-protein pea belt, a:b ≈ 3.8. Explain: b broadens capture; specific coupled a pairs absorb beyond 700 nm. Keep transfer routes visible in the PDF. “Follow an excitation” opens a 20–30 s overlay: absorption → excitation through stationary pigments → charge separation. Close returns. Keep history and detailed mechanisms in Context.',
  handoff: [
    'Context and the display/animation brief were approved on 22 October 2026. This is the next slide after pigments, with a three-minute teaching estimate. The present slide remains a text-box prompt for Claude; finished graphics and animation require visual review.',
    'One visual sequence: different pigments → organised antenna → reaction centre. Begin with matched chlorophyll a and b molecular structures, highlighting only –CH₃ and –CHO. Caption: “Different structure, different absorption.”',
    'Make pigment organisation the main figure. Show LHCII supplying PSII and LHCI supplying PSI, using the papers in Context as structural references. Make pigments within the protein scaffold visible.',
    'Use explicit assembly bases: LHCII, 8 chlorophyll a and 6 b per protein (a:b ≈ 1.3); LHCI, 45 a and 12 b across the four-protein belt in the pea example (a:b ≈ 3.8). The LHCI count is structure-specific.',
    'LHCII: more b broadens complementary absorption. LHCI: specific coupled a pairs extend absorption beyond 700 nm. The higher a:b ratio alone does not cause red forms.',
    'Mark excitation-transfer routes towards each reaction centre. Keep the distinction explicit: “Antenna: excitation transfer → Reaction centre: charge separation.” Static arrows and labels must explain this in the PDF.',
    'A small “Follow an excitation” button should open an approximately 20–30-second overlay. A pigment absorbs light; an excitation marker passes through stationary pigments; charge separation occurs at the reaction centre. Close returns. Use different symbols for excitation and separated charges.',
    'Preserve the paper-and-ink style, one title and classroom-readable labels. Retain the teaching-time estimate beside the page number. Keep the Emerson stories, thermal uphill-transfer explanation and detailed references in Context.',
  ],
};

export const lightHarvestingReferences = [
  {
    label: 'PSII antenna structure and excitation transfer',
    citation: 'van Amerongen & Croce (2013) · Photosynthesis Research',
    title: 'Light harvesting in photosystem II',
    url: 'https://doi.org/10.1007/s11120-013-9824-3',
    note: 'Foundational review. Links LHCII pigment organization, excitation transfer, core antennae and reaction-centre trapping. Use the 2026 overview for the updated assembly context.',
  },
  {
    label: 'Principles of light harvesting',
    citation: 'Croce & van Amerongen (2014) · Nature Chemical Biology',
    title: 'Natural strategies for photosynthetic light harvesting',
    url: 'https://doi.org/10.1038/nchembio.1555',
    note: 'Foundational perspective. Useful figures: antenna function (Figure 4), pigment spectral tuning (Figure 6) and excitation-energy transfer (Figure 7). Also supports the pigment discussion.',
  },
  {
    label: 'Mechanisms and transfer times',
    citation: 'Croce & van Amerongen (2020) · Science',
    title: 'Light harvesting in oxygenic photosynthesis: Structural biology meets spectroscopy',
    url: 'https://doi.org/10.1126/science.aay2058',
    note: 'Links pigment coupling and parallel excitation-transfer pathways to reaction-centre trapping. Supports the detailed explanation below. Full text checked in the authors’ university repository.',
  },
  {
    label: 'Chlorophyll structure and spectral tuning',
    citation: 'Sirohiwal & Pantazis (2021) · Physical Chemistry Chemical Physics',
    title: 'Electrostatic profiling of photosynthetic pigments: implications for directed spectral tuning',
    url: 'https://doi.org/10.1039/D1CP02580E',
    note: 'Explains how pigment structure and protein electrostatics change the relative energies of ground and excited states, shifting absorption.',
  },
  {
    label: 'LHCI composition and red forms',
    citation: 'Croce & van Amerongen (2013) · Photosynthesis Research',
    title: 'Light-harvesting in photosystem I',
    url: 'https://doi.org/10.1007/s11120-013-9838-x',
    note: 'Supports the higher LHCI chlorophyll a:b ratio, coupled red forms and thermally assisted transfer from low-energy antenna states.',
  },
  {
    label: 'Antenna organisation and pigment counts',
    citation: 'Arshad et al. (2022) · Plant Physiology',
    title: 'A kaleidoscope of photosynthetic antenna proteins and their emerging roles',
    url: 'https://doi.org/10.1093/plphys/kiac175',
    note: 'Compare counts on explicit assembly bases: one LHCII protein versus a whole four-protein LHCI belt. The 45 a, 12 b and 13 carotenoid LHCI example comes from a pea structure and is not universal.',
  },
  {
    label: 'Photosynthetic units and Emerson enhancement',
    citation: 'Stirbet, Lazár, Guo & Govindjee (2020) · Annals of Botany',
    title: 'Photosynthesis: basics, history and modelling',
    url: 'https://doi.org/10.1093/aob/mcz171',
    note: 'Distinguishes the 1932 flash experiments underpinning the photosynthetic-unit concept from the 1957 enhancement effect supporting two cooperating light reactions.',
  },
  {
    label: 'Current structural context',
    citation: 'Liu et al. (2026) · Annual Review of Biophysics',
    title: 'Structures of Photosynthetic Supramolecular Complexes',
    url: 'https://doi.org/10.1146/annurev-biophys-021424-011156',
    note: 'Already in the research reading list. Current overview of antenna–photosystem assemblies, complementing the two foundational reviews.',
  },
];

export const lightHarvestingContext: ContextTopic = {
  title: 'Light-harvesting complexes',
  sections: [
    {
      heading: 'Why chlorophyll a and b absorb differently',
      paragraphs: [
        'Chlorophyll a and b absorb different wavelengths because their molecular structures differ. Chlorophyll b has a formyl group (–CHO) where a has a methyl group (–CH₃). This changes the electron distribution and the energy gaps that photons must match. Surrounding protein charges also affect these gaps, so the same pigment can absorb differently in different protein environments.',
      ],
      referenceUrls: ['https://doi.org/10.1039/D1CP02580E'],
    },
    {
      heading: 'Complementary absorption and different roles',
      paragraphs: [
        'Their absorption spectra complement each other. Chlorophyll b broadens light collection and generally transfers excitation to lower-energy chlorophyll a states. In land plants, chlorophyll a also supplies the principal donor pigments for reaction-centre photochemistry.',
      ],
      referenceUrls: ['https://doi.org/10.1126/science.aay2058'],
    },
    {
      heading: 'Organisation enables excitation transfer',
      paragraphs: [
        'To make these pigments work together, proteins organise them into light-harvesting complexes. The proteins control pigment spacing, orientation and excitation energies, allowing rapid transfer towards a reaction centre. During antenna transfer, excitation moves between pigments; there is no net electron transfer between them. Electron transfer and charge separation occur when the reaction centre performs photochemistry.',
      ],
      referenceUrls: ['https://doi.org/10.1126/science.aay2058'],
    },
    {
      heading: 'LHCII and LHCI in land plants',
      paragraphs: [
        'LHCII mainly supplies photosystem II and usually forms a trimer of three proteins. Each protein binds 8 chlorophyll a, 6 chlorophyll b and 4 carotenoids. Its chlorophyll a:b ratio is approximately 1.3.',
        'LHCI supplies photosystem I and usually consists of four proteins beside the PSI core. The whole belt in one pea structure contains 45 chlorophyll a, 12 chlorophyll b and 13 carotenoids. Its chlorophyll a:b ratio is approximately 3.7–3.8.',
        'LHCII is called the major antenna because its numerous copies bind a large fraction of plant chlorophyll. PSI also contains a substantial chlorophyll-a-rich core antenna.',
      ],
      referenceUrls: ['https://doi.org/10.1093/plphys/kiac175'],
    },
    {
      heading: 'What the pigment ratios imply',
      paragraphs: [
        'The pigment ratios have functional consequences. LHCII’s greater proportion of chlorophyll b strengthens complementary absorption. LHCI contains proportionally more a, including specially coupled pairs that create low-energy “red forms” absorbing beyond 700 nm. These arise from pigment arrangement and protein interactions, not from the ratio alone. Some require thermally assisted uphill transfer to reach the reaction centre: extending spectral capture can therefore slow trapping.',
      ],
      referenceUrls: ['https://doi.org/10.1007/s11120-013-9838-x'],
    },
    {
      heading: 'Two experiments, two discoveries',
      paragraphs: [
        'Two experiments connect this organisation to its discovery. Emerson and Arnold’s 1932 flash experiments helped establish that many chlorophyll molecules cooperate within a photosynthetic unit. Emerson enhancement in 1957 showed that red and far-red light together could produce more photosynthesis than the sum of their separate effects. The first supports collective light harvesting; the second helped reveal two cooperating light reactions, leading into how PSII and PSI drive electron transport together.',
      ],
      referenceUrls: ['https://doi.org/10.1093/aob/mcz171'],
    },
  ],
  references: lightHarvestingReferences,
};
