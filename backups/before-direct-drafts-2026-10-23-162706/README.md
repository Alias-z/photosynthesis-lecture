# Photosynthesis lecture, ETH Zurich

Slides and animations for two 45-minute lectures, written in TypeScript and served with Vite.
Slides 1–6 are text-box content/display briefs for Claude to turn into variants. Slide 2 keeps its original title. The original wavelength and scattering animations remain in their source files, with dated backups and previews under `backups/`. The seven-step sky animation opens from slide 4, unchanged. Scope future changes to the slide the lecturer explicitly selects.

Workflow: discuss and explain the context with sources first. The lecturer confirms what will be taught. Then develop the slide prompt and any animation around the key take-home messages. Work one slide at a time. Save the discussion and references together under **Context**. Do not turn unconfirmed discussion into slide content or an animation.

Context is a scientific explanation the lecturer can deliver, focused on the slide's central concepts and biological meaning, with mechanisms, qualifications and sources where needed. Match its depth to the slide; keep it distinct from a display prompt, layout proposal or teaching instructions.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5174. The ‹ › arrows next to the page number, the arrow keys or Page Up/Down change slides, `F` toggles full screen, and a Contents jumper appears when the mouse reaches the left edge. `npm run build` type-checks and writes a static copy to `dist/`.

Each slide shows its estimated teaching time beside the page number. These estimates use the planning tab's values and update when those values change.

Slide 1's **Context** button holds the opening explanation and its source, confirmed by the lecturer on 22 October 2026. Its one-minute introduction connects solar energy and carbon assimilation through ATP and NADPH, using the colour of life and bread as the everyday connections.

Slide 2's **Context** button holds the detailed explanation of sky colour, sunset and green leaves, confirmed on 22 October 2026, with its sources. These background notes support the subsequent mechanism slides; the question-led opening retains its one-minute estimate.

Slide 3's **Context** button holds the solar-spectrum explanation confirmed on 22 October 2026: human vision (approximately 380–780 nm), conventional PAR (400–700 nm), the conditional far-red contribution and brief biological connections for UV, infrared and microwaves. The extended discussion of human-vision evolution was dropped. The static display prompt and two-minute estimate are retained.

Slide 4's **Context** button holds the explanation confirmed on 22 October 2026: photon energy versus intensity, molecular Rayleigh scattering and the longer atmospheric path at sunset, with linked sources. Its portrait display brief and three-minute estimate are retained; visual variants remain for review.

On slides 3 and 4, **Backup** opens the original animation in the same viewer. **Return** or Escape brings back the current slide. Changing slides leaves the backup view. Slide 4's source and preview are saved in `backups/2026-10-22-slide-04/`.

On slide 4, **Animation** opens the original seven-step blue-sky/sunset sequence over the slide. **Close** or Escape returns; arrow keys step through the animation. The animation stops while hidden. It is no longer a separate slide 5. Slide 4's default three-minute estimate includes its two-minute animation slot. Printing hides the animation and its button, keeping the static slide.

Slide 5 is the pigment brief, **Why are leaves green?** Its four-minute slot focuses on pigment absorption and green leaf colour. Its lecture context was confirmed on 22 October 2026. **Context** replaces the separate References button and opens the confirmed pigment explanation and sources first, followed by the recorded LHC explanation and linked papers. The LHC context is also available on slide 6. Close or Escape returns to the slide. The panel stays open when returning from a paper tab, and is hidden when printing. The same text and sources are exported to `CLAUDE_HANDOFF.txt`. PAR is contextual; green-light use and algal pigments are supporting examples.

Slide 6 is **Light-harvesting complexes**, a three-minute prompt slide with its own Context button. Its context and display/animation brief were confirmed on 22 October 2026. It begins with chlorophyll a/b differences, then compares LHCII/LHCI organisation and pigment ratios before distinguishing excitation transfer from charge separation. The 20–30-second animation is specified in the prompt for a later visual variant.

Open http://localhost:5174/planning.html in a separate tab for the full content plan. Each proposed slide has a topic-agreement checkbox, an editable time estimate and its elapsed slot. Each lecture starts with 43 minutes of teaching and 2 minutes for questions. Agreement and time edits save in that browser; this page does not alter the presentation.

## Files

| File | What it is |
|---|---|
| `src/main.ts` | The viewer: fits the 1600 × 900 slide to the window, page number, Contents jumper, keys, swipe. |
| `src/styles.css` | Viewer and slide text styles. |
| `src/slide.ts` | What a slide provides to the viewer. |
| `src/planning/opening.ts` | Opening brief, confirmed context and source for slide 1. |
| `src/planning/skyLeaf.ts` | Slide 2 brief, confirmed scientific context and sources, with its original title. |
| `src/planning/lightBasics.ts` | Slide 3 brief, confirmed lecture context and sources, before scattering. |
| `src/planning/photonScattering.ts` | Slide 4 brief, confirmed lecture context and sources; the existing seven-step sky/sunset animation opens separately. |
| `src/planning/pigments.ts` | Slide 5 brief, confirmed pigment context, linked papers and handoff notes. |
| `src/planning/lightHarvesting.ts` | Slide 6 approved brief, context and linked papers, shared by Context and the handoff. |
| `src/lib/context.ts` | Context types and the shared explanation/source renderer. |
| `planning.html`, `src/planning/plan.ts`, `main.ts`, `planning.css` | Separate overall planning page, with topic agreement and timing. |
| `src/slides/brief.ts` | 1. The opening as plain text boxes. |
| `CLAUDE_HANDOFF.txt` | The agreed workflow, six selected briefs, context explanations and linked papers for Claude. Regenerate with `npm run briefs:export` after editing them. |
| `LECTURE_OUTLINE.md` | The lecture sequence, scope and timing the briefs follow. |
| `src/slides/title.ts` | 2. Why is the sky blue, and why are leaves green? |
| `src/slides/lightBasics.ts` | 3. The solar spectrum as a text brief. |
| `src/slides/wavelengths.ts` | Original wavelength animation, retained unchanged. See the backup folder for restoration instructions. |
| `src/slides/scatteringReview.ts` | 4. Photon energy and scattering as a text brief, with Backup/Return access. |
| `src/slides/pigments.ts` | 5. Why are leaves green? Text brief with a Context control. |
| `src/slides/lightHarvesting.ts` | 6. Light-harvesting complexes. Approved text brief with Context and a three-minute estimate. |
| `src/slides/scattering.ts` | Original Midday/Sunset/Pause scattering demo, retained unchanged. |
| `src/slides/skyAnimation.ts`, `.css` | The original seven-step animation, unchanged, opened by slide 4's Animation button. Arrow keys step through its beats and Space pauses. |
| `src/lib/` | Shared canvas drawing, colour and ink-figure helpers. |

## Style

Plate style: paper and ink, colour only for light. All slide rules (content, layout, type, colour, drawing, motion) are in [STYLE_GUIDE.md](STYLE_GUIDE.md).
