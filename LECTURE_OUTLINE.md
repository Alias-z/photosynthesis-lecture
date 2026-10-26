# Photosynthesis lecture content outline

Two 45-minute lectures for bachelor students. The light-reaction outline includes the additional topics from the reference review. All remain in the draft until the lecturer decides what fits. The carbon-reaction sequence below is a draft for discussion.

Environmental controls on assimilation and sun/shade acclimation belong to another part of the course. Engineering applications, including photorespiratory bypasses, are outside this outline.

## Lecture 1 Light reactions

### Narrative and opening

Begin with **Photosynthesis**, split into **photo** and **synthesis**, following the lecturer's opening brief. Photo introduces light reactions, solar energy and the colour of life on Earth. Synthesis introduces how CO₂ becomes sugars and the bread that feeds us. Each part is a 45-minute lecture. This is a content/display brief for visual variants, not a request for the content planner to design a graphic.

Opening context confirmed on 22 October 2026: sunlight supplies the energy and CO₂ supplies the carbon. ATP and NADPH connect light reactions to carbon assimilation, with their mechanisms explained later. The approximately one-minute opening and its background source are saved in `src/planning/opening.ts`, the slide's Context panel and the handoff.

Slide 2's detailed explanation of scattering, sunset, pigment absorption and green-light use was also confirmed on 22 October 2026. It is saved in `src/planning/skyLeaf.ts`, its Context panel and the handoff. Context is the scientific explanation behind a slide, not a prompt or teaching plan. The opening question still takes approximately one minute; its mechanisms are developed later.

Slide 3's focused lecture context was confirmed on 22 October 2026 and is saved in `src/planning/lightBasics.ts`, its Context panel and the handoff. It connects the human visible range (approximately 380–780 nm), conventional PAR (400–700 nm), far-red's contribution alongside shorter wavelengths, and brief biological effects of UV, infrared and microwaves. The lecturer dropped the extended human-vision evolution discussion. Keep the static prism/spectrum overview and two-minute estimate.

Slide 4's context was confirmed on 22 October 2026 and is saved in `src/planning/photonScattering.ts`, its Context panel and the handoff. It explains photon energy versus intensity, molecular Rayleigh scattering and the longer atmospheric path at sunset, with linked sources. Keep the three-minute estimate, portrait brief and existing animation; visual variants remain for review.

Slide 5's lecture context was confirmed on 22 October 2026 and is saved in `src/planning/pigments.ts`, its Context panel and the handoff. Selective absorption explains green leaf colour, with chlorophyll a/b and carotenoid spectra, deeper green-light use and algal phycoerythrin as the supporting context. Keep the four-minute estimate, existing display brief and PAR as a contextual range. The LHC explanation is also available on slide 6.

Slide 6, **Light-harvesting complexes**, has confirmed context and a confirmed display/animation brief (22 October 2026). Its three-minute slot follows pigments: chlorophyll a/b differences → pigment organisation in LHCII/LHCI → excitation transfer and reaction-centre charge separation. It remains a text-box prompt for a visual variant. The Emerson stories and detailed explanations stay in Context.

The light section follows a question-led sequence:

Sequence correction, 22 October 2026: introduce charge separation and electron transport directly after LHCs. Defer fluorescence and heat dissipation until after proton transport and lumen acidification, so the xanthophyll cycle has its mechanistic foundation. Retain the three-minute energy-fates slot before photoprotection; total lecture time remains 45 minutes. The next context discussion must connect Emerson enhancement to both photosystems before tracing the serial electron pathway.

**Why is the sky blue and a leaf green? → What is sunlight? → Why does air scatter its colours differently? → What happens when light reaches a leaf? → Which pigments absorb it? → What happens after absorption? → How does excitation become photochemistry? → How does electron flow generate ATP and reductant? → How are outputs and protection regulated? → What does this explain about a leaf's light response?**

| Guiding question | Slide content and the reason for the transition |
|---|---|
| What are today's two connected parts? | One overview linking the light reactions to carbon reactions through ATP/NADPH and their recycled carriers. This is the first page. |
| Why is the sky blue, and why are leaves green? | Use the existing two-colour question page to open the light section. The questions establish why the following physics and pigment concepts are needed. |
| What is the light whose colour we see? | A static prism illustration connects sunlight to the visible part of a broader electromagnetic-spectrum scale. Label its regions, including microwaves, and highlight human vision and conventional PAR. Wavelength, energy and scattering follow on the next slide; its detailed prompt is still a proposal. |
| How do those wavelengths explain the blue sky? | Use the existing seven-step animation as a guided explanation: colour mixture and short/long waves → scattering → the observer's blue sky → the longer sunset path and red transmitted light. Its content remains unchanged. |
| Then why is a leaf green? | Return explicitly to the second opening question. Move from scattering by air to selective absorption, reflection, and transmission by a leaf. Introduce pigments and their absorption spectra, with the qualification that green light is also used. |
| How do different pigments work together? | Slide 6: chlorophyll a/b differences, organisation into LHCII/LHCI, and excitation delivery to reaction centres. Distinguish excitation transfer from charge separation. |
| How can photochemistry keep running? | Replace the donated electrons from water; follow PSII → carriers → PSI → Fd/FNR → NADPH. Explain O2 formation and the need for two light-driven boosts. Use the Z scheme as another view of this same route. |
| How does that route also make ATP? | Reveal the sources of lumen-side H+, the proton motive force, and ATP synthase. Embed the Jagendorf–Uribe experiment as a short test of the gradient's role. |
| Do the two outputs match their uses? | Consolidate the photon/electron/proton/ATP/NADPH budget, with coupling assumptions visible. Distinguish supply from metabolic demand, then introduce cyclic routing and its proton-coupling and protective functions. |
| What else can happen to an excitation? | After electron transport and lumen acidification, introduce competing photochemistry, fluorescence and heat dissipation. |
| What if absorbed excitation exceeds its use? | Connect the energy-fate diagram to lumen acidification, PsbS, NPQ and the xanthophyll cycle. Protection follows the energy-conversion mechanism. |
| How can we observe the system's performance? | Revisit fluorescence as a measurement, distinguishing maximum from operating PSII efficiency and estimated ETR from net CO2 assimilation. |
| What does the whole story predict for a leaf? | Finish with the light-response curve, using the preceding mechanisms to explain its initial slope and plateau. Then return verbally to the opening overview to introduce the carbon lecture. |

The current viewer has six slides, all selected text-box content/display briefs for Claude. Slide 4 has confirmed photon-energy/scattering context and a portrait brief awaiting visual review. The sky/leaf question keeps its original title. The original wavelength and scattering animations remain unchanged in their source files, with dated backups and Backup/Return access. Slide 4's Animation button opens the original seven-step sky animation; Close or Escape returns. Its three-minute estimate combines the findings and animation slots. Slide 5 returns to leaf colour and pigment absorption. Context replaces its separate References control, keeping the discussion and linked papers together, including the LHC explanation, which also has its own Context button on slide 6. Teaching-slide variants should use the full canvas for static study content. Printing hides the animation, Context panel and their buttons. This outline does not authorise replacing further slides or creating briefs for the whole deck; work on further slides only when the lecturer selects them.

Agreed workflow: discuss and explain the context with references first. The lecturer confirms the teaching content. Then develop the slide prompt and any animation around the key take-home messages. Follow this sequence one slide at a time and retain the explanation and papers in Context.

For slide 5, the main point is that pigments absorb wavelengths differently and leaves reflect relatively more green light, explaining their green appearance. Show chlorophyll a/b and carotenoid absorption peaks, with PAR as a contextual range. Internal scattering and deeper green-light use, plus algal accessory pigments, are supporting examples within the existing four-minute slot. Keep the PAR boundary discussion subordinate. Paper links and guidance for the next agent are in `src/planning/pigments.ts` and `CLAUDE_HANDOFF.txt`.

### Time distribution

| Minutes | Topic |
| --- | --- |
| 0–1 | Overview: today's light and carbon reactions |
| 1–7 | Open the sky/leaf questions; sky question motivates wavelength, PAR and energy; explain scattering with the existing animation |
| 7–11 | Return to the green-leaf question: pigments, absorption, reflection and transmission |
| 11–14 | Light-harvesting complexes: pigment differences, antenna organisation and excitation transfer |
| 14–22 | Charge separation, two cooperating photosystems and sustained electron flow |
| 22–28 | Proton motive force, ATP synthesis and consolidated energy accounting |
| 28–30 | Cyclic routing and energy/protection functions |
| 30–33 | Competing energy fates and fluorescence, leading into photoprotection |
| 33–38 | Excess excitation, NPQ and xanthophyll cycle |
| 38–40 | Fluorescence measurement |
| 40–43 | Light-response curve, quantum yield and saturation |
| 43–45 | Questions and transition to carbon reactions |

State transitions, D1 repair and NPQ relaxation remain brief optional examples within the photoprotection block. The light-response curve is the final teaching block of lecture 1.

1. **Today's overview:** link light-driven ATP/reductant supply to carbon assimilation in the second lecture, then open the two everyday-colour questions.
2. **Sky question and light basics:** first a static map of sunlight, the electromagnetic spectrum, human vision and PAR. Wavelength, photon energy and wavelength-dependent scattering follow. Introduce photon flux versus energy flux when discussing energy. Do not suggest that higher photon energy is itself the reason for stronger scattering.
3. **Green-leaf question and pigments:** chlorophyll a and b, carotenoids, absorption spectra, and leaf reflection/transmission. Explain what happens to incident light before asking what happens to absorbed energy.
4. **Light-harvesting complexes:** chlorophyll a/b differences before LHCII/LHCI organisation and pigment ratios; excitation-energy transfer versus reaction-centre charge separation. The confirmed slide 6 prompt follows pigments.
5. **Charge separation and linear electron transport:** establish chloroplast/thylakoid compartments and lumen/stroma orientation. Introduce both photosystems and connect their cooperation to Emerson enhancement, then trace water → PSII → PQ → cytochrome b6f → PC → PSI → Fd/FNR → NADPH. Use the Z-scheme to explain the two light-driven excitation steps and identify the source of O2.
6. **Proton motive force and ATP synthesis:** sources of lumenal H+, transport across the membrane and return through ATP synthase to the stroma.
7. **Quantitative accounting:** track photons, electrons, protons, O2, NADPH and ATP consistently. State the assumed H+/ATP coupling when assigning ATP yield, then connect ATP and NADPH supply to carbon assimilation.
8. **Cyclic electron flow:** the route around PSI, proton-coupling potential, and photoprotection. Distinguish energy supply from metabolic ATP/reductant demand; avoid presenting a compulsory fixed ATP-deficit fraction. Instructor context: [energy routes and FvCB](research/light-reactions/ENERGY_ROUTES_AND_FVCB.md).
9. **Chlorophyll excitation and energy fates:** return to excited states and the competing pathways of fluorescence, heat dissipation and photochemistry after electron transport and lumen acidification, immediately before photoprotection.
10. **Photoprotection:** excess excitation, photoinhibition, NPQ, lumen acidification, PsbS and the xanthophyll cycle. Include state transitions, D1 repair and NPQ relaxation under fluctuating light as removable extensions.
11. **Fluorescence as a measurement:** a brief connection between fluorescence and PSII photochemical performance. Separate this application from the earlier explanation of fluorescence itself.
12. **Light-response curve:** close the teaching sequence with photon flux, quantum yield and light saturation, integrating the preceding light-reaction mechanisms. Retain the light compensation point with the net-assimilation discussion in lecture 2.

The additions retained after reference review are the light-response curve, fluorescence measurement, state transitions, D1 repair and NPQ relaxation. Their final depth depends on timing.

## Lecture 2 Carbon reactions

| Minutes | Topic |
| --- | --- |
| 0–2 | Bridge from ATP and NADPH to carbon assimilation |
| 2–12 | Calvin–Benson cycle and carbon/energy accounting |
| 12–16 | Rubisco carboxylation and oxygenation |
| 16–22 | Photorespiration and its costs |
| 22–24 | Evolutionary context and proto-Kranz anatomy |
| 24–28 | C2 glycine shuttle and CO2 recapture |
| 28–33 | C4 CO2 concentration and energy tradeoffs |
| 33–35 | CAM as a provisional brief comparison |
| 35–38 | Net assimilation, gas-exchange measurement and CO2 supply |
| 38–43 | FvCB overview using one CO2-response curve |
| 43–45 | Recap and questions |

CAM has a provisional two-minute slot and can be removed to expand the evolution or model discussion. CO2 compensation points fit within the C3/C2/C4 comparison and the model discussion. The gas-exchange introduction is a brief measurement principle rather than an instrument tutorial.

1. **Connection to lecture 1:** ATP and NADPH supply to carbon assimilation in the chloroplast stroma. Briefly locate CO2 entry and distinguish light regulation from a requirement for darkness.
2. **C3 Calvin–Benson cycle:** carboxylation, reduction and regeneration of RuBP. Follow the carbon through the cycle.
3. **Carbon and energy accounting:** net production of one triose phosphate from 3 CO2 requires 9 ATP and 6 NADPH in the Calvin–Benson cycle. Distinguish triose-phosphate production from subsequent hexose synthesis and from additional photorespiratory costs.
4. **Rubisco carboxylation and oxygenation:** products of each reaction and the influence of local CO2, O2 and temperature.
5. **Photorespiration:** recovery of carbon from 2-phosphoglycolate through chloroplasts, peroxisomes and mitochondria. Track carbon recovery, CO2 release and energy costs. Connect glycine decarboxylation to the next evolutionary section.
6. **Evolutionary context:** environmental conditions favouring CO2 recovery and concentration. Introduce changes in bundle-sheath anatomy and organelle positioning as a bridge from C3 physiology.
7. **C2 photosynthesis:** the photorespiratory glycine shuttle, bundle-sheath localisation of glycine decarboxylation and recapture of released CO2. Use the lecturer's C3 to C2 to C4 narrative, with lineage-specific anatomical and biochemical changes.
8. **C4 photosynthesis:** initial fixation by PEPC, C4-acid transport and decarboxylation, and CO2 concentration around bundle-sheath Rubisco. Compare benefits, additional energy requirements and CO2 compensation points with C3 and C2 physiology.
9. **CAM comparison:** briefly compare temporal separation in CAM with spatial separation in C4. Retain as a provisional, removable topic.
10. **Net assimilation and CO2 supply:** distinguish carboxylation, photorespiratory CO2 release and mitochondrial respiration. Introduce the leaf-chamber gas-exchange measurement principle, then briefly connect stomatal and mesophyll conductance and Ca, Ci and Cc. Place the light compensation point here if retained.
11. **Brief FvCB introduction:** use one C3 CO2-response curve to connect Rubisco-limited assimilation with RuBP-regeneration limitation and the electron transport discussed in lecture 1. Introduce Vcmax, J/Jmax and Rd at a conceptual level. Keep TPU as an optional extension, distinguish Ci from the model's chloroplastic CO2 input, and keep detailed derivation or parameter fitting outside the initial draft.

## Scientific anchors

- [Sage and colleagues 2013, Initial Events during the Evolution of C4 Photosynthesis in C3 Species of Flaveria](https://doi.org/10.1104/pp.113.221119).
- [Khoshravesh and colleagues 2016, C3–C4 intermediacy in grasses and the rise of C2 photosynthesis](https://pubmed.ncbi.nlm.nih.gov/27073202/).
- [Farquhar, von Caemmerer and Berry 1980, A biochemical model of photosynthetic CO2 assimilation in leaves of C3 species](https://link.springer.com/article/10.1007/BF00386231).
- [Yin, Busch, Struik and Sharkey 2021, Evolution of a biochemical model of steady-state photosynthesis](https://doi.org/10.1111/pce.14070), especially Section 3 on alternative electron routes and energy accounting.

## Previous lecture references

- [Lecture D6, carbon balance 1](/Users/zhongyua/Downloads/Ecophysiology_2026/Lecture%20D6.pptx).
- [Lecture D7, carbon balance 2](/Users/zhongyua/Downloads/Ecophysiology_2026/Lecture%20D7.pptx).
- [Santelia 2019, photosynthesis and its limitations for plant productivity](/Users/zhongyua/Downloads/Ecophysiology_2026/SanteliaD_Probevorlesung_20190807.pptx).
