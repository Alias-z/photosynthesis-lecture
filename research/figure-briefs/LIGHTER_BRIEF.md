# Figure pass: balanced, precise, lighter

## The lecturer's feedback (24 October)

1. **Unbalanced text layout.** Text bunches in one area (often the top) while other areas stay empty.
2. **Inaccurate words.** Example: "Light energy pulls electrons from water and pushes them onto CO₂." What does "onto CO₂" mean? Words must say what physically happens.
3. **Less is more.** Reading should feel light and inviting, not heavy.

The page text (lead and three points) has already been rewritten: see `TEXT_REVISION.md`. Do not edit any `PLATE`. If a figure contradicts the new page text, fix the figure.

Read `BUILDER_BRIEF.md` (vocabulary and technical rules) and `REVIEWER_BRIEF.md` (commands and checks) first.

## Rules for every figure you own

1. **Balance.**
   - Spread the visual weight evenly across the card.
   - Centre the drawing in the card, with even margins.
   - Do not cluster labels at the top. Avoid one crowded side next to an empty quadrant.
   - Align labels on shared baselines or columns, and keep the gaps consistent.
   - Leave the paper breathing room.
2. **Precise words.**
   - Each label names a thing or states what physically happens: absorb vs reflect, fix vs reduce, pump vs move, make vs store, release vs lose.
   - No metaphor whose meaning is unclear ("pushes onto", "building carbon", "feeds" for energy transfer, "charges" without a mapping).
   - Check that every arrow means one thing.
   - Keep units, numbers, subscripts and chemistry correct.
3. **Less text.**
   - Labels, not sentences.
   - Remove any caption that repeats the page text. Keep at most one take-home line, no more than 8 words, and only when the page text does not already say it.
   - Remove labels that repeat a nearby label or the key.
   - Keep "schematic" marks and source credits, set small (15–17 px).
   - Never shrink text below 22 px for labels or 15 px for notes. Fix crowding by removing words or moving things, not by shrinking.
4. **Keep the idea.**
   - Each variant keeps its idea, look and name.
   - Do not add or remove variants.
   - Work on every variant listed in `VARIANTS` of your slides. That list is what the lecturer sees.

## Files

- Edit only the modules listed in your task. Shared files are `mechanisms.ts`, `illus.ts`, `figures.ts`, `plates.ts`, `main.ts`, `gallery.ts`, `qa.ts`, `pilot.css` and `types.ts`: read them, never edit them.
- If a seed module you own (`s2`, `s5`, `s6`, `s12`, `c5`) exports a helper that another slide uses, keep that helper's look unchanged. Check the other slide's pages after any change.
- The dev server is running; never start or stop it. Keep the code compiling between edits, because the lecturer may be looking.

## Verify

- Screenshot every variant of your slides at full page size before and after your changes, and read each PNG. The commands are in `REVIEWER_BRIEF.md`. Lead pages use `?solo=lead-N&v=<id>`.
- Run `qa.html` (no flags on your slides) and `npx tsc --noEmit`.
- Save screenshots to the scratch directory named in your task.

## Return

At most 200 words: per slide, the variants changed and what kind of change (balance, wording, text removed). List any wording you think is scientifically doubtful but left for the lecturer.
