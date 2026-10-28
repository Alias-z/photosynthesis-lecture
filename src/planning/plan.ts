// The overall content plan is separate from the presentation.
// Timing follows LECTURE_OUTLINE.md. Checks mean agreed topic/order, not visual approval.
import { openingBrief } from './opening';
import { lightBasicsBrief } from './lightBasics';
import { photonScatteringBrief } from './photonScattering';
import { pigmentsBrief } from './pigments';
import { lightHarvestingBrief } from './lightHarvesting';

export interface PlannedSlide {
  id: string;
  title: string;
  content: string;
  minutes: number;
  agreed: boolean;
  agreementBasis: string;
  existingSlide?: number;
  optional?: boolean;
}

export interface PlannedLecture {
  id: 'light' | 'carbon';
  title: string;
  reserveLabel: string;
  reserveMinutes: number;
  slides: PlannedSlide[];
}

export const lectures: PlannedLecture[] = [
  {
    id: 'light', title: 'Light reactions',
    reserveLabel: 'Questions and transition', reserveMinutes: 2,
    slides: [
      { id: 'photo-synthesis', title: 'Photosynthesis', content: openingBrief.content,
        minutes: 1, agreed: true, existingSlide: 1,
        agreementBasis: 'Context confirmed on 22 October 2026: sunlight supplies energy, CO₂ supplies carbon; photo and synthesis introduce two 45-minute lectures linked through ATP and NADPH, with colour and bread as the everyday connections.' },
      { id: 'sky-leaf-question', title: 'Why is the sky blue, and why are leaves green?',
        content: 'Open the light section with the two colour questions. Resolve the sky first, then return to the leaf.',
        minutes: 1, agreed: true, existingSlide: 2,
        agreementBasis: 'Detailed scientific context confirmed on 22 October 2026: Rayleigh scattering, sunset path length, selective pigment absorption and green-light use. Keep this one-minute slide as the question-led opening, with mechanisms developed in subsequent slides.' },
      { id: 'light-basics', title: lightBasicsBrief.title,
        content: lightBasicsBrief.content,
        minutes: 2, agreed: true, existingSlide: 3,
        agreementBasis: 'Context confirmed on 22 October 2026: human vision approximately 380–780 nm, conventional PAR 400–700 nm, a conditional far-red contribution, and brief biological connections for UV, infrared and microwaves. Keep the static prism/spectrum overview and two-minute slot. Energy and scattering follow.' },
      { id: 'photon-scattering', title: photonScatteringBrief.title,
        content: photonScatteringBrief.content + ' Includes the existing seven-step blue-sky/sunset animation, opened from this slide.',
        minutes: 3, agreed: true, existingSlide: 4,
        agreementBasis: 'Context confirmed on 22 October 2026: photon energy and intensity, molecular Rayleigh scattering and atmospheric path length explain the blue sky and sunset. Keep the three-minute slot, existing seven-step animation and the agreed portrait brief; context confirmation is separate from visual approval.' },
      { id: 'pigments', title: pigmentsBrief.title,
        content: pigmentsBrief.takeaway + ' ' + pigmentsBrief.content + ' Supporting examples: green light within leaf tissue and accessory pigments in algae.',
        minutes: 4, agreed: true, existingSlide: 5,
        agreementBasis: 'Context confirmed on 22 October 2026: selective pigment absorption explains green leaf colour; chlorophyll a/b and carotenoids have different absorption spectra. Internal green-light use and algal phycoerythrin are supporting examples. Keep PAR contextual, the four-minute estimate and the existing display brief.' },
      { id: 'antenna-reaction-centre', title: lightHarvestingBrief.title,
        content: lightHarvestingBrief.takeaway + ' ' + lightHarvestingBrief.content,
        minutes: 3, agreed: true, existingSlide: 6,
        agreementBasis: 'Context and display/animation brief confirmed on 22 October 2026. Introduce chlorophyll a/b differences before LHCII/LHCI composition and function. Follow pigments with this prompt slide, with the explanation and papers under Context; visual variants remain for review.' },
      { id: 'linear-flow', title: 'Linear electron transport and the Z scheme',
        content: 'Water → PSII → PQ → b₆f → PC → PSI → Fd/FNR → NADPH. Two light-driven boosts; water as the source of O₂.',
        minutes: 8, agreed: true,
        agreementBasis: 'You requested linear electron transport and clear electron accounting. On 22 October 2026 you placed charge separation and electron transport directly after LHCs, before fluorescence and dissipation. Discuss the Emerson enhancement connection and introduce both photosystems before tracing the serial electron pathway; the next slide context remains for review.' },
      { id: 'proton-atp', title: 'Proton motive force and ATP synthesis',
        content: 'Lumen-side H⁺ accumulation and return through ATP synthase. The selected Jagendorf–Uribe story fits within this slot.',
        minutes: 5, agreed: true,
        agreementBasis: 'ATP production and proton accounting are required; the experiment is a draft way to explain them.' },
      { id: 'energy-budget', title: 'ATP, NADPH, H⁺ and electron accounting',
        content: 'One consistent quantitative account. Separate supply from metabolic demand and state the route/coupling assumptions, using the Yin review.',
        minutes: 1, agreed: true,
        agreementBasis: 'You explicitly asked for clear quantities and route-dependent ATP/NADPH accounting.' },
      { id: 'cyclic-flow', title: 'Cyclic electron flow',
        content: 'Electron return around PSI, proton flux and protection, without net NADPH production from that circuit.',
        minutes: 2, agreed: false,
        agreementBasis: 'You proposed cyclic transport as a possible topic; retain it for review.' },
      { id: 'excitation', title: 'Chlorophyll excitation and energy fates',
        content: 'Return to excitation after electron transport and lumen acidification: competing photochemistry, fluorescence and heat dissipation, leading into photoprotection.',
        minutes: 3, agreed: true,
        agreementBasis: 'On 22 October 2026 you deferred this topic until after electron transport and lumen acidification, to establish the mechanism needed for the xanthophyll cycle. Retain its three-minute slot before photoprotection.' },
      { id: 'photoprotection', title: 'Photoprotection and the xanthophyll cycle',
        content: 'Excess excitation, NPQ, ΔpH, PsbS and xanthophylls. State transitions, D1 repair and NPQ relaxation remain removable extensions.',
        minutes: 5, agreed: true,
        agreementBasis: 'You requested photoprotection and the xanthophyll cycle, then retained the reference-review additions.' },
      { id: 'fluorescence', title: 'Fluorescence as a measurement',
        content: 'Maximum versus operating PSII efficiency; fluorescence-derived ETR versus net CO₂ assimilation.',
        minutes: 2, agreed: true,
        agreementBasis: 'You requested fluorescence and retained the added measurement context.' },
      { id: 'light-response', title: 'The light-response curve',
        content: 'Initial slope, quantum yield and saturation, integrating the light-reaction mechanisms. Final teaching slide of this section.',
        minutes: 3, agreed: true,
        agreementBasis: 'You explicitly placed the light-response curve at the end and excluded acclimation.' },
    ],
  },
  {
    id: 'carbon', title: 'Carbon reactions',
    reserveLabel: 'Recap and questions', reserveMinutes: 2,
    slides: [
      { id: 'synthesis-bridge', title: 'Synthesis: CO₂, sugars and food',
        content: 'Return to the opening’s synthesis branch. Connect ATP/NADPH to carbon fixation in the stroma and sugars to the bread that feeds us.',
        minutes: 2, agreed: true,
        agreementBasis: 'Your opening explicitly connects synthesis, CO₂, sugars and bread.' },
      { id: 'calvin-cycle', title: 'The Calvin–Benson cycle',
        content: 'Carboxylation, reduction and RuBP regeneration. Follow carbon and distinguish net triose-phosphate output from later hexose synthesis.',
        minutes: 7, agreed: false,
        agreementBasis: 'Draft from the carbon-reaction outline; the slide’s detail remains for review.' },
      { id: 'carbon-budget', title: 'Carbon and energy accounting',
        content: 'Calvin–Benson account: 3 CO₂, one net triose phosphate, 9 ATP and 6 NADPH. Keep additional photorespiratory costs separate.',
        minutes: 3, agreed: false,
        agreementBasis: 'Draft carbon-cycle accounting slide from the outline.' },
      { id: 'rubisco', title: 'RuBisCO: carboxylation and oxygenation',
        content: 'Compare reaction products and CO₂/O₂ competition, leading directly to photorespiration.',
        minutes: 4, agreed: false,
        agreementBasis: 'Draft supporting slide in the carbon-reaction outline.' },
      { id: 'photorespiration', title: 'Photorespiration',
        content: 'Carbon recovery through chloroplast, peroxisome and mitochondrion; CO₂ release and energy costs; glycine decarboxylation.',
        minutes: 6, agreed: true,
        agreementBasis: 'You explicitly requested photorespiration.' },
      { id: 'evolution-context', title: 'C₃ to C₂ to C₄: evolutionary context',
        content: 'Your Sage-style narrative: CO₂ recapture and concentration, proto-Kranz anatomy and bundle-sheath organelle positioning.',
        minutes: 2, agreed: true,
        agreementBasis: 'You explicitly requested the C₃–C₂–C₄ evolutionary story in Rowan Sage’s approach.' },
      { id: 'c2', title: 'C₂ photosynthesis',
        content: 'The glycine shuttle, bundle-sheath glycine decarboxylation and recapture of photorespired CO₂.',
        minutes: 4, agreed: true,
        agreementBasis: 'C₂ is explicitly part of your requested evolutionary narrative.' },
      { id: 'c4', title: 'C₄ photosynthesis',
        content: 'PEPC fixation, C₄-acid transport, decarboxylation and bundle-sheath CO₂ concentration; benefits and extra energy requirements.',
        minutes: 5, agreed: true,
        agreementBasis: 'C₄ is explicitly part of your requested evolutionary narrative.' },
      { id: 'cam', title: 'CAM comparison',
        content: 'Brief temporal versus spatial separation comparison. Provisional two-minute slot that can be reassigned.',
        minutes: 2, agreed: false, optional: true,
        agreementBasis: 'CAM is marked provisional in the outline, not agreed content.' },
      { id: 'net-assimilation', title: 'Net assimilation, measurement and CO₂ supply',
        content: 'Carboxylation and CO₂ losses; basic gas-exchange principle; Cₐ, Cᵢ and Cc; brief stomatal/mesophyll conductance context.',
        minutes: 3, agreed: false,
        agreementBasis: 'Draft measurement/model context from the outline, still for review.' },
      { id: 'fvcb', title: 'The FvCB model',
        content: 'One C₃ CO₂-response curve: RuBisCO and RuBP-regeneration limitation; Vcmax, J/Jmax and Rd conceptually. TPU stays optional.',
        minutes: 5, agreed: true,
        agreementBasis: 'You explicitly requested a brief FvCB introduction and the Yin review.' },
    ],
  },
];
