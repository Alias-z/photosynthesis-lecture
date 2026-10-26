# General rules from slides 1–2

The lecturer settled slides 1 and 2 on 24–26 October 2026. These rules generalise their feedback. They apply to every slide, on top of `LIGHTER_BRIEF.md` (precise, light and balanced pages).

## A. Two versions, each complete on its own

Each slide has a **lecture version**, shown live, and a **handout version**, which is the only one in the PDF.

1. **Slides with a lead page.** The lecture version is the lead page alone: the question and one image, nothing that gives the answer away. The handout shows the answer.
2. **Other slides.** The lecture version is the figure plus the three short claims. The handout is the figure plus the lead and the three explained points.
3. **Each version shows only its own material.**
   - Lecture logistics ("lecture 1 · 45 min") appear in the lecture version only.
   - A credit or source appears only on the version that shows the item. Slide 2's photo credit was listed under the handout, but only the lecture page shows the photo.

## B. Nothing twice on a page

4. **The figure does not repeat the title.**
   - Slide 1's figure spelled out "Photo | synthesis" under the title "Photosynthesis".
   - Remove the repeat from the figure. If the figure's identity *is* the repeated words, offer a no-title variant instead (`noTitle: true` on the variant); the figure then names the topic and takes the freed space.
5. **The figure does not repeat what the text column states.**
   - Slide 1's equation was in the figure and in point 3.
   - A formula, number or sentence that the lead, a point or a claim already gives verbatim leaves the figure. The exception is when it is the figure's subject; then report it.

## C. Space and balance

6. **Use freed space to let things breathe, not to add more.** Spread labels so each has room; slide 1's step labels were packed together.
7. **Balance the page.** No crowding at the top, even bands, even margins. Slide 1's lecture page needed this.
8. **Less is more.** Use labels, not sentences.

## D. Precise, professional language and notation

9. **Use established terms for what physically happens.**
   - "the Calvin–Benson cycle fixes CO₂ into sugar", "convert light energy into ATP and NADPH"
   - not "ATP and NADPH turn CO₂ into sugar", "building carbon", "push electrons onto CO₂"
10. **Use textbook notation.**
    - A reaction's condition goes over the arrow. Write 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂ with *light* over the arrow, not "+ light".
    - In page text use `rxn('light')` from `src/pilot/plates-text.ts` inside a template literal; in figures, draw the word over the arrow.
    - Use real subscripts and superscripts throughout.

## E. Informative, never filler

12. **Every sentence teaches something:** a fact, a mechanism, a number or a definition.
    - Framing that sounds deep but says nothing is out ("the same sunlight meets two kinds of matter").
    - Say what actually happens: light is reflected, transmitted, absorbed or scattered.
13. **Lead with what matters for the topic, not with the apparatus.**
    - Slide 3 is about wavelengths: vision covers 380–780 nm; photosynthesis is counted over 400–700 nm by convention; far-red also counts.
    - "A prism separates sunlight" is not the point.
14. **Spell out every abbreviation at its first use on the page,** e.g. PAR (photosynthetically active radiation). Say when a value is a convention.

## F. Working with the lecturer

15. **When the lecturer asks for a change, offer one or two variations side by side**, so they can steer the direction.
