import { writeFile } from 'node:fs/promises';
import { openingBrief, openingContext } from '../src/planning/opening.ts';
import { skyLeafBrief, skyLeafContext } from '../src/planning/skyLeaf.ts';
import { lightBasicsBrief, lightBasicsContext } from '../src/planning/lightBasics.ts';
import { photonScatteringBrief, photonScatteringContext } from '../src/planning/photonScattering.ts';
import { pigmentsBrief, pigmentsContext } from '../src/planning/pigments.ts';
import { lightHarvestingBrief, lightHarvestingContext } from '../src/planning/lightHarvesting.ts';

const formatContext = topic => `${topic.title}\n\n${topic.sections.map(section => [
  section.heading,
  ...section.paragraphs,
  ...(section.steps ? section.steps.map((step, i) => `${i + 1}. ${step}`) : []),
  ...(section.referenceUrls || []),
].join('\n\n')).join('\n\n')}\n\nPAPERS\n${topic.references.map(ref => [ref.label, ref.citation, ref.title, ref.url, ref.note].join('\n')).join('\n\n')}`;

const instructions = `PHOTOSYNTHESIS: SELECTED SLIDE BRIEFS FOR CLAUDE

The lecturer has selected slides 1–6 for content/display briefs. Work on the slide currently selected by the lecturer. The lecturer controls content and reviews visual variants. Preserve the other existing slides and animations.

WORKFLOW AGREED WITH THE LECTURER
First discuss and explain the context, with linked references. The lecturer confirms what will be taught. Only after that confirmation, develop the slide prompt and any animation around the key take-home messages. Work through the lecture one slide at a time. Save discussion text and sources together under Context. Do not turn unconfirmed discussion into new slide content or an animation.

Context is the scientific explanation the lecturer can deliver: focus on the central concepts, their biological meaning, necessary mechanisms and qualifications, with sources. Use the depth needed for the particular slide, not a fixed length. It is not a display prompt, layout proposal or teaching instructions. Keep the agreed timing separate from the depth of these background notes.

The opening splits PHOTOSYNTHESIS into PHOTO and SYNTHESIS. PHOTO connects light reactions, solar energy and the colour of life on Earth. SYNTHESIS connects carbon reactions, CO2, sugars and the bread that feeds us. Each branch represents a 45-minute lecture.

Slide 1 context was confirmed by the lecturer on 22 October 2026 and is saved under its Context button. Its key connection is that sunlight supplies the energy and CO2 supplies the carbon. ATP and NADPH link the two lectures; explain their mechanisms later. Retain the approximately one-minute opening slot. The existing display prompt remains unchanged.

Slide 2 keeps its original title: Why is the sky blue, and why are leaves green? It establishes the questions; the sky question leads into light basics and scattering, then the lecture returns to the leaf for pigments.

Slide 2's detailed scientific context was confirmed on 22 October 2026 and is available through its Context button. Its prompt, title and one-minute opening role remain as agreed; the full explanation provides background for the later mechanism slides.

Slide 3 is static: sunlight through a prism, connected to the visible portion of a broader electromagnetic-spectrum scale. Locate radio waves, microwaves, infrared, visible light, ultraviolet, X-rays and gamma rays. Highlight human vision (approximately 380–780 nm) and conventional PAR (400–700 nm). Wavelength, photon energy and scattering are reserved for the following slide, whose detailed prompt is still a proposal. Stronger short-wavelength scattering is not caused by the greater energy per photon. The original wavelength animation remains unchanged at src/slides/wavelengths.ts and is backed up with a preview in backups/2026-10-22-slide-03/.

Slide 3's focused lecture context was confirmed on 22 October 2026 and is saved under Context with its sources. It connects human vision, conventional PAR, the conditional contribution of far-red light and brief biological effects of UV, infrared and microwaves. The lecturer dropped the extended human-vision evolution discussion. Keep the existing static display prompt and two-minute slot.

Slide 4 presents Einstein and Rayleigh through black-and-white portraits styled as newspaper cutouts. Each portrait sits with the scientist's finding, equation and one concise takeaway. Max Planck is an optional third portrait. Distinguish Planck's quantized energy exchange from Einstein's light quanta. Keep photon energy and scattering as separate findings, and briefly define the equation symbols in the study content.

Slide 4's small Animation button opens the existing seven-step blue-sky/sunset animation in src/slides/skyAnimation.ts and .css, unchanged. It is no longer a separate slide 5. Close or Escape returns to the static slide. Keep this connection when creating the portrait variant. The original slide 4 Midday/Sunset scattering demo at src/slides/scattering.ts remains available through Backup/Return, with its saved copy in backups/2026-10-22-slide-04/. Backup access and the teaching-animation button have different purposes.

Slide 4's context was confirmed on 22 October 2026: photon energy versus intensity, molecular Rayleigh scattering and the longer atmospheric path at sunset. Its explanation and linked scientific sources appear in its CONTEXT section below. Keep its three-minute estimate and existing display brief. Optional Planck background: https://www.nobelprize.org/prizes/themes/the-nobel-prize-in-physics-1901-2000/

Slide 5 returns to the opening leaf question. The lecturer's main takeaway is selective pigment absorption: leaves reflect relatively more green light and therefore look green. The main figure should show pigment absorption spectra with labelled peaks. PAR is a contextual range annotation. Internal green-light use and algal pigments are supporting examples. Context replaces the old References control and holds discussion text with linked papers. The LHC explanation is recorded there while the next slide is being discussed. Close or Escape returns to the slide. Keep the four-minute estimate. No animation is requested for this slide.

Slide 5's lecture context was confirmed on 22 October 2026 and is saved with its references. The pigment explanation appears first in Context, followed by the previously recorded LHC discussion. Confirmation of the pigment context does not approve a new LHC slide or display prompt.

Slide 6 is Light-harvesting complexes. Its context and display/animation brief were confirmed on 22 October 2026. It follows pigments and has a three-minute estimate. Its Context button holds the approved explanation and linked papers. The visible page is a text-box prompt; the proposed 20–30-second excitation-transfer animation remains a specification for the visual variant.

Sequence correction after slide 6 (22 October 2026): the lecturer deferred the dedicated fluorescence/heat-dissipation discussion until after electron transport and lumen acidification, before photoprotection and the xanthophyll cycle. Charge separation and electron transport come next. The next context discussion should connect Emerson enhancement to both photosystems before tracing the serial electron pathway. Its context and prompt are not yet confirmed. Existing topic durations are retained, keeping each lecture at 45 minutes.

Use the existing TypeScript/Vite viewer on port 5174. Brief sources are src/planning/opening.ts, src/planning/skyLeaf.ts, src/planning/lightBasics.ts, src/planning/photonScattering.ts, src/planning/pigments.ts and src/planning/lightHarvesting.ts. Style guidance is in STYLE_GUIDE.md. Keep one title, minimal visible text and classroom-readable type. The text boxes contain instructions for variants, not text to copy verbatim onto a teaching slide. Keep the teaching-time estimate shown beside the page number.

Teaching slides must work as complete static PDF study pages. Use the full canvas for essential text and images. The Animation overlay and Close control are implemented on slide 4, and print styles hide the overlay and button. Keep animation brief. The PDF must show all static content. Slide 3 needs no animation. The complete deck-to-PDF export is not yet implemented.

`;

const text = instructions + `
SLIDE 1: ${openingBrief.title}

CONTEXT (CONFIRMED 22 OCTOBER 2026)
${formatContext(openingContext)}

CONTENT
${openingBrief.content}

DISPLAY PROMPT
${openingBrief.display}

SLIDE 2: ${skyLeafBrief.title}

CONTEXT (CONFIRMED 22 OCTOBER 2026)
${formatContext(skyLeafContext)}

CONTENT
${skyLeafBrief.content}

DISPLAY PROMPT
${skyLeafBrief.display}

SLIDE 3: ${lightBasicsBrief.title}

CONTEXT (CONFIRMED 22 OCTOBER 2026)
${formatContext(lightBasicsContext)}

CONTENT
${lightBasicsBrief.content}

DISPLAY PROMPT
${lightBasicsBrief.display}

SLIDE 4: ${photonScatteringBrief.title}

CONTEXT (CONFIRMED 22 OCTOBER 2026)
${formatContext(photonScatteringContext)}

CONTENT
${photonScatteringBrief.content}

DISPLAY PROMPT
${photonScatteringBrief.display}

SLIDE 5: ${pigmentsBrief.title}

MAIN TAKEAWAY
${pigmentsBrief.takeaway}

CONTENT
${pigmentsBrief.content}

DISPLAY PROMPT
${pigmentsBrief.display}

HANDOFF NOTES
${pigmentsBrief.handoff.map(note => '- ' + note).join('\n')}

CONTEXT (CONFIRMED 22 OCTOBER 2026)

${formatContext(pigmentsContext)}

SLIDE 6: ${lightHarvestingBrief.title}

CONTEXT (CONFIRMED 22 OCTOBER 2026)

${formatContext(lightHarvestingContext)}

MAIN TAKEAWAY
${lightHarvestingBrief.takeaway}

CONTENT
${lightHarvestingBrief.content}

DISPLAY PROMPT (CONFIRMED 22 OCTOBER 2026)
${lightHarvestingBrief.display}

HANDOFF NOTES
${lightHarvestingBrief.handoff.map(note => '- ' + note).join('\n')}
`;

await writeFile(new URL('../CLAUDE_HANDOFF.txt', import.meta.url), text);
console.log('Exported the six briefs, context explanations, linked papers and agreed workflow to CLAUDE_HANDOFF.txt');
