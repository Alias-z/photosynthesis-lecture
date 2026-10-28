# Lecture 2 language and layout audit, C1–C15 (lecturer, 28 Oct 2026)

## Why this audit
The lecturer, after reading 10b and C2:

> "You forgot our principle again. Do not use non-scientific invented terms: 'Other valves' is not a scientific term, we're talking about other electron pathways. And C2 got much worse: 'Rubisco, the enzyme that fixes CO₂, works slowly, so the leaf has a large amount of it.' What the fuck is 'slowly'? Students only need the essential information. kcat ≈ 3 per second: not important. Check all the slides from 10b on, so the language is as required on the earlier slides. Only leave the essential information. Be scientific, no invented terms, not wordy. And really think about the layout."

The earlier drafts in `L2_TEXT_DRAFTS.md` (C1–C15 part) were written before this feedback. Use them only as a source of checked numbers and corrections. Re-judge every line against the rules below.

## The standard: lecture-1 electron transport slides
Slide 7, Photosystem II:
- **Lead:** "Light drives electrons from water to plastoquinone; O₂ is released and H⁺ stay in the lumen."
- **Charge separation.** Light sends 1 e⁻ across the membrane to plastoquinone.
- **Water splitting.** Refills the reaction centre; O₂ leaves, H⁺ stay in the lumen · eq: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻.
- **Plastoquinone.** Carries e⁻ and stroma H⁺ through the membrane · eq: PQ + 2 e⁻ + 2 H⁺ (stroma) → PQH₂.

Slide 10, ATP synthase:
- **Lead:** "H⁺ flowing back from the lumen to the stroma drive ATP synthase to make ATP."
- **Proton gradient.**
- **ATP synthase.**
- **Chemiosmosis.**

What these show:
- The lead is 1 sentence: the physical process.
- Each point heading is a textbook term.
- Each point has 1 short line of physical fact.
- Numbers sit in an eq line of at most 2 lines.

## Rules (binding)
1. **Scientific terms only.** No invented or figurative words. Banned examples from this deck: "other valves", "the gap", "close the gap", "flexible", "works slowly", "in bulk", "tells CO₂ from O₂ apart", "recharged", "came in as CO₂", "gains so far", "grabbing". Use the textbook term: specificity, turnover, induction, alternative electron pathways, regeneration.
2. **Essential information only.** For every point, ask: does a student need it to follow the story? If not, cut it. Typical cuts:
   - turnover numbers;
   - secondary percentages;
   - historical trivia that carries no concept;
   - second examples;
   - numbers that do not appear in the figure.
3. **Layout.**
   - A lead plus at most 3 points.
   - Each point: 1 short line of text plus at most 1 eq line (2 lines only for a reaction pair).
   - No eq line wider than the text column.
   - No content repeated on the next slide.
   - The figure should dominate the slide; the text column must never be longer than the figure.
4. **Numbers.**
   - Numerals only.
   - One unit per slide, stated: the cycle per 3 CO₂, photorespiration per 2 O₂, CO₂ in ppm.
   - Physically exact. Check each one against the fact table in `L2_TEXT_DRAFTS.md` or a source.
5. **Each slide's message must fit the new order.** The Rubisco story (C2, C5, C5a–c) is being redone separately: do not draft it. Mention Rubisco's oxygenation only as already known.

## Slides and what each must teach (one message per slide)
| Slide | Message |
|---|---|
| C1 | The Calvin–Benson–Bassham cycle: carboxylation, reduction, regeneration; 3 CO₂ in, 1 triose phosphate out |
| C3 | The energy cost: ATP and NADPH for reduction and regeneration |
| C4 | Sucrose (exported) and starch (stored) |
| C6 | Photorespiration: recycling 2-phosphoglycolate through peroxisome and mitochondrion; carbon and energy cost |
| C7 | Light-response curve |
| C8 | FvCB model: the lowest of 3 limits sets the rate |
| C11 | Refixation of photorespired CO₂ |
| C11a | C₂ photosynthesis |
| C12 | C₄ photosynthesis |
| C13 | CAM |
| C14 | Rising CO₂ |
| C15 | From leaf to yield |
| Optional (lighter touch) | C9 gas exchange, C10 CO₂ diffusion |

Read each slide module (`src/pilot/figs/cb01.ts`, `cb03.ts`, `cb04.ts`, `rf06.ts`, `rf07.ts`, `rf08.ts`, `cc11.ts`, `cc11a.ts`, `cc12.ts`, `cc13.ts`, `cr14.ts`, `cr15.ts`, `cp09.ts`, `cp10.ts`) and its animation captions (`anim/beats-cb.ts`, `beats-rf56.ts`, `beats-rf78.ts`, the cc/cr/cp beats).

## Output
`research/redo-2026-10-28/L2_LANGUAGE_DRAFTS.md`. Per slide:
- a before → after table for title, lead and each point (text and eq);
- the caption lines with any non-scientific or non-essential wording, as before → after;
- 1 line of layout advice if the page is unbalanced.

Do not edit anything under `src/`.

Order: C1, C3, C4, C6 first. Send a note to "main" via SendMessage when those 4 are done. Then C7, C8, C11–C15, then C9 and C10.
