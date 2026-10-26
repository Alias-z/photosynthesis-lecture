# Lead pages: ask, don't answer

In the live lecture some slides lead. The lead page poses a question and stops there. An animation then answers it, and the slide's study page (the current page with figure and three points) follows as the recap. The after-lecture PDF keeps only the study page. A lead page exists to make students curious and let them guess. It must never give the answer away.

Read `BUILDER_BRIEF.md` for the shared visual vocabulary and the technical rules. The rules below replace its page rules for lead pages.

## The page

- **Format.** One full-page drawing, `viewBox="0 0 1600 900"`, rendered straight onto the paper: no card, no reading column, no sources line. The page number is added at bottom right; keep x > 1440, y > 820 clear.
- **Minimal.**
  - The question or title, set in class `lead-q` (Newsreader), at any size from 60 to 110 px.
  - One image that sets up the puzzle.
  - At most one short prompt line (no more than 8 words, Inter, 26–34 px).
  - Labels only where the image needs them, never ones that explain. Nothing else.
- **Never reveal.**
  - **Slide 1 cover:** no equation, no ATP/NADPH, no "light reactions"/"carbon reactions", no mechanism.
  - **Slide 2:** no scattering, absorbing, reflecting, wavelengths, λ, nm, "redirect"/"remove", and no per-colour rays that hint at the process.
- **Same picture as the answer.** Reuse the study page's drawings and icons, so the recap visibly answers the picture the students puzzled over:
  - sun, leaf, eye, wheat and bread from `l01.ts`/`l02.ts`/`s1.ts`/`s2.ts`
  - the photo `src/assets/leaf-sky.jpg`, slide 2 only. Its credit "Photo: W.carter, CC BY-SA 4.0" must appear at 15–17 px.
- **Calm.** Lots of paper. Lead pages are where the lecture breathes.

## Variants

Draw five genuinely different lead pages per slide (ids a–e, names 1–3 words). Ideas to start from; replace any that do not work:

- **Slide 1 · cover "Photosynthesis":**
  - the split word Photo · synthesis with the sun-and-leaf and wheat-and-bread hooks, plus "lecture 1 · 45 min"
  - one sunlit leaf as hero, with the title and a teaser line
  - the question "How does sunlight become bread?", with sun → ? → bread
  - a puzzle equation with blanks ("? + ? + light → bread + ?")
  - "the colour of life · the bread that feeds us" as two images around the title
- **Slide 2 · "Why is the sky blue, and why are leaves green?":**
  - the leaf-against-sky photo with the question
  - one sun above a split scene (sky half, leaf half), each ending in "?"
  - the two questions stacked, each with its own simple icon
  - "Same sunlight. Two colours." with one white beam reaching a blue sky and a green leaf
  - white sunlight going into two black boxes, "air" and "leaf", with blue and green coming out and a "?" on each box

## Files and checks

- **Your files:**
  - `src/pilot/figs/lead0N.ts` (exports `VARIANTS` and `draw(id)`; it replaces the placeholder) and a new `lead0N.css` imported by it.
  - Prefix classes `.theme-editorial .fld0N-…` and ids with the variant (`fld01a-`).
  - You may import helpers from `l0N.ts`/`sN.ts`. If one is not exported, add the `export` keyword only; change no drawing there.
- **Checks:**
  - Screenshot with `http://localhost:5174/pilot.html?solo=lead-N&v=<id>` (the command is in `REVIEWER_BRIEF.md`) and read every PNG.
  - Run the layout check `qa.html`; it lists your page as `lead-N`, and it must show no flags.
  - Run `npx tsc --noEmit`.
  - Never start or stop the dev server.
- **Return:** at most 120 words, the five variants with one line each.
