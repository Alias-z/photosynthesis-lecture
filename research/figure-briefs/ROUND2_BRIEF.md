# Round 2, slides 1–6: combine what the lecturer picked

The lecturer has picked variants for slides 1–6 (`picks.json`). They like them, but each one is incomplete: it carries part of the slide's message well and leaves the rest out.

Round 2 keeps the picked variants unchanged and adds **five new variants per slide (ids k–o)**. Each new variant combines elements of the picked ones into a figure that is **complete**: it makes all three take-home points of the slide's page text visible, without crowding. Later rounds will narrow down further, so the five should be five genuinely different ways of combining, not one layout shuffled.

Read `BUILDER_BRIEF.md` (technical rules, vocabulary, verification) and `REVIEWER_BRIEF.md` (the science, clarity and layout checks your work will face) first.

## Rules for this round

- **Look before you build.** Screenshot every picked variant of your slide at full page size and study what makes each one work. Then reuse its drawing code (call its helpers, or factor a shared helper inside your module) so the combined figures keep the exact look the lecturer chose. Do not restyle a liked element.
- **Complete, but calm.** All three page points must be readable from the figure alone (it is a PDF study page), but a combination that is crowded fails. Drop secondary detail before you shrink text. Labels 22–27 px; notes no smaller than 15 px.
- **Page text.** L01–L06 page text (`PLATE`) is lecturer-confirmed: never edit it.
- **What the gallery and pilot page show.** Set `VARIANTS` to the picked variants first (same ids and names, in alphabetical order), then the five new ones k–o with 1–3-word names. Keep the code of the unpicked variants: `draw()` must still render them by id. Only the list changes. Mark `anim: true` where a new variant is a process unfolding in time.
- **Science.**
  - Every label, number and arrow must be correct. Use only numbers already on the picked variants, on the page, or in the checked review (`research/review-2026-10-23-claude/`).
  - Mark schematic curves "schematic".
- **Files.** Edit only your slide's module (`src/pilot/figs/l0N.ts` and `.css`) and, if a picked variant lives there, its seed module (`s1`–`s6`). Nothing else.
- **Verify.**
  - Screenshot each new variant at full size and read the PNG.
  - Run the layout check (`qa.html`, see `REVIEWER_BRIEF.md`); your slide must show no flags.
  - Run `npx tsc --noEmit`.
  - The dev server is running; never start or stop it. The lecturer may be looking at the pages, so keep the code compiling.
- **Return.** At most 150 words: the five new variants (id, name, one line on which picked elements they combine and how they cover the three points). Then any compromise.

## Per slide

### Slide 1 · Photosynthesis

- **Picks:**
  - **B Word split:** big "Photo" / "synthesis" words with their Greek roots; sun + leaf and wheat + bread hooks; ATP/NADPH as the link; lecture tags.
  - **F Six steps:** six numbered steps, 1–3 photo and 4–6 synthesis.
  - **H Battery analogy:** solar charger and workshop; charged ATP + NADPH batteries go across and empty ones (ADP + Pᵢ, NADP⁺) come back; the inputs and outputs of each half (light, H₂O, O₂ | CO₂, sugar).
- **Missing from all three:** point 3, "one equation links them". The equation (6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂) is only in the text column. It is the thread that returns at the end of lecture 2.
- **Directions to try:**
  - Word split heading over the battery loop.
  - Battery loop with the equation as a strip whose coloured terms tie to the inputs and outputs of each half.
  - Six steps placed inside the charger (1–3) and the workshop (4–6), with the batteries between steps 3 and 4.
  - Word split columns, each with its three numbered steps, and the equation as a footer.
  - One careful synthesis of all three.

### Slide 2 · Why is the sky blue, and why are leaves green?

- **Picks:**
  - **A Redirect vs remove:** one Sun in the middle; air redirects blue towards an eye; the leaf absorbs blue and red and green comes back to an eye.
  - **J Colour grid:** a 3 × 2 table (blue / green / red × air / leaf) with most / less / least and strongly / less / strongly, and "the sky looks blue" / "the leaf looks green" below.
- **Gaps:**
  - A does not say per colour how strongly each process acts.
  - J has no scene and no eyes.
  - Neither makes point 3 ("scattering keeps the colour: it changes direction, not wavelength") visible on its own.
- **Directions to try:**
  - Scene on top, grid as a key below.
  - The scene with each ray labelled per colour, so the grid lives inside the scene.
  - The grid with the Sun feeding both columns and the eyes as the last row.
  - Rows as colours running through both halves of one scene.
  - The scene plus a small "same wave in, same wave out, new direction" vs "wave ends, energy taken up" inset.

### Slide 3 · The solar spectrum

- **Picks:**
  - **A Prism to scale:** prism → spectrum strip with the "our eyes 380–780 nm", PAR 400–700 nm and far-red brackets → the electromagnetic scale.
  - **E Sunlight curve:** schematic photon distribution, coloured under the curve, with the same brackets.
  - **H Engelmann 1882:** alga filament in a spectrum, bacteria crowding in blue and red, counts as bars, "the first action spectrum".
- **Page points:**
  - a prism separates sunlight
  - vision and PAR overlap
  - the edges matter: far-red adds in mixed light, UV damages and triggers protection, infrared warms
- **Directions to try:**
  - Prism fanning into the sunlight curve, with the EM scale as context.
  - Sunlight curve over Engelmann's strip on one shared nm axis: what sunlight offers vs what photosynthesis uses.
  - Engelmann's own setup (prism spectrum on the filament) with the vision/PAR brackets.
  - Three tiers aligned on one axis: EM scale, sunlight curve, action bars.
  - The curve with its edges explained (UV, far-red, IR), plus Engelmann bars as a faint overlay.
- **Constraint:** keep Engelmann credited as "after Engelmann 1882 · schematic".

### Slide 4 · Photon energy and scattering

- **Picks:**
  - **E Clippings board:** dated newspaper clippings: 1905 light quanta, 1871·1899 sky light, at sunset. Portrait placeholders stay.
  - **F Zoom in:** zoom into the beam (450 nm 2.76 eV vs 650 nm 1.91 eV) and into the air (the field shakes the charges; ∝ 1/λ⁴; blue ≈ 4.4× red).
  - **H Four steps:** four panels: photons, more energy per photon, air redirects, sunset.
- **Gaps:**
  - E is history without mechanism.
  - F is mechanism without history and without the sunset.
  - H is complete but plain.
- **Confirmed display for this slide:** newspaper-cutout portraits of Einstein and Rayleigh beside each finding, its equation and the takeaway. Keep that.
- **Directions to try:**
  - Clippings that each contain F's zoom circle.
  - H's four panels styled as dated clippings.
  - F's two zooms plus a sunset strip, with small clipping portraits.
  - One beam told left to right (sun → photons → air → sunset), with a clipping at each stop.
  - The clippings board completed with each clipping's number and mini-diagram.

### Slide 5 · Why are leaves green?

- **Picks:**
  - **B Inside a leaf:** blue and red absorbed in the top cells; green travels deeper, scatters and is mostly absorbed; some comes back to the eye.
  - **C Pigment palette:** four pigment tiles (Chl a, Chl b, carotenoid, phycoerythrin) and coverage bars for a land plant (green gap) vs a red alga.
  - **D Rows:** stacked absorption spectra of Chl a, Chl b and β-carotene with peak labels and the shaded green gap: "absorbed least, so reflected most".
  - **E Absorbed vs used:** absorption spectra vs action spectrum, "leaves use more green than pigment spectra suggest", after McCree 1971.
- **Page points:**
  - leaves still use green light (50–90 % vs 80–95 %; it reaches deeper cells)
  - each pigment absorbs its own colours
  - red algae catch green with phycoerythrin
- **Directions to try:**
  - D's rows plus a phycoerythrin row, with a small leaf-section inset.
  - E's absorption vs action, with B's leaf section explaining why green still works.
  - B as the hero, with C's coverage bars along the top.
  - C's land plant vs red alga coverage paired with the action spectrum.
  - A minimal three-column layout: rows · leaf · red alga.

### Slide 6 · Light-harvesting complexes

- **Picks:**
  - **A Funnel:** an energy landscape; Chl b high on the rims, Chl a low around the reaction centre; "only energy moves"; "an electron moves" at the centre.
  - **C Top view:** LHCII → PSII (Chl b-rich, a:b ≈ 1.3) and LHCI → PSI (Chl a-rich, a:b ≈ 3.7, red forms beyond 700 nm).
  - **D Two parts:** Chl a / Chl b structures with the –CH₃ / –CHO swap and their absorption spectra; "one destination": antenna → reaction centre → e⁻.
  - **G Why antennas:** ≈ 10 photons per second per chlorophyll in full sun, so an antenna keeps one reaction centre busy.
  - **I Downhill by colour:** energy levels Chl b (642 nm) above Chl a (662 nm) above the reaction centre; energy hops downhill; only there does an electron move.
- **Page points:**
  - Chl a and Chl b differ by one group
  - the antenna moves energy; the reaction centre moves an electron
  - each photosystem has its own antenna
- **Directions to try:**
  - D's structures above A's funnel.
  - I's levels drawn for both photosystems (C).
  - A's funnel with G's photon-rate ticks: why a funnel.
  - C's top view with D's structure key.
  - Three columns, one per page point.
- **Science trap:** LHCI's red forms absorb beyond 700 nm, so they sit **below** P700 in energy. Transfer from them to P700 is uphill, helped by heat. Never draw them as feeding P700 downhill.
