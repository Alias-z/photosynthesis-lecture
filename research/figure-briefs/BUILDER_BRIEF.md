# Builder brief: ten figure variants per slide

Read this, then `LECTURE_OVERVIEW.md` (storyline, essentials, equation thread, static vs animation per slide) and `FIGURE_BRIEF.md` (shared visual vocabulary and the earlier slide briefs).

## The loop

The lecturer ticks the variants they like in `gallery.html`. Their picks and notes are saved to `picks.json` and steer the next round. So the ten variants for a slide must be **ten genuinely different ideas**, not one idea re-laid out. Think of them as ten different starting points.

## What the lecturer has said so far

- **Liked:**
  - "Redirect vs remove": one Sun; air redirects blue towards an eye, the leaf removes blue and red and returns green.
  - The RuBP / FvCB scheme in the style of their MSc thesis (Fig. 2b: atoms as coloured balls, a RuBP pentagon, ATP/NADPH tags, coloured braces naming the limits).
  - "Inside a leaf": photons entering leaf tissue. They like it as an animation.
  - Calm, editorial pages (Anthropic/claude.com article feel) combined with the thesis's illustrated elements.
- **Disliked:** numeric "budget" figures, crowding, curves you cannot tell apart, terse labels such as "Several pigments.", heavy textures, layouts where text is fixed and overflows.
- **Rules:** every page must work as a PDF study page, so the figure must carry the take-home on its own. History and stories go to animations. Prefer published-style scientific diagrams over decoration.

## Kinds of idea to spread across the ten

Use the kinds that fit the slide; no two variants of the same kind look alike.

1. Mechanism diagram (the textbook-correct picture, made clear)
2. Analogy or metaphor, mapped label by label to the real parts
3. Data or graph (schematic and labelled as such, unless real data are in the brief)
4. Zoom or scale (leaf → cell → chloroplast → membrane → molecule)
5. Before/after or with/without comparison
6. Step strip (numbered panels)
7. One hero illustration (thesis style)
8. Evidence figure: the key experiment drawn as a static result
9. Equation-anchored (terms of the photosynthesis equation lit up)
10. Minimal icon summary

Set `anim: true` on any variant that is a process unfolding in time (a natural animation storyboard). Its static drawing is then the final frame, with the path shown.

## Page text (`PLATE`)

- **L01–L06 are lecturer-confirmed.** Do not change their PLATE text.
- **Draft slides:** write the PLATE using only facts confirmed in `research/review-2026-10-23-claude/` (the A–F reports and `REVIEW_SUMMARY.md`), applying its corrections. Sources for the draft claims are `research/review-2026-10-22/CONTEXT_REVIEW.md` and `drafts.json`. Never invent a number or a reference. If a claim was not checked, leave it out.
- **Length limits:**
  - title: name the subject; keep the draft title unless it is clearly worse
  - lead: ≤ 2 sentences, ≤ 170 characters
  - 3 points: claim ≤ 7 words and self-explanatory; text ≤ 110 characters
  - 2–4 refs, each with a DOI link
- **Equation thread:**
  - L01 shows the classic equation.
  - L08 upgrades it to 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O (all O₂ from water).
  - C01 makes ATP and NADPH the link.
  - C04 notes that triose phosphate, not glucose, is exported.
  - C13 returns to the equation with every term annotated.
- **Proposed new slots:** C04b (sugar export) and C13 (leaf to loaf) follow `REVIEW_SUMMARY.md` §5b. C07 and C10 may later be folded, but still get variants.

## Technical rules

- **Files:** you own only your slide modules `src/pilot/figs/<slot>.ts` and `.css` (e.g. `l07.ts`, `c04b.ts`). For L01–L06 you also own the matching seed module (`s1`–`s6`). Do not edit `plates.ts`, `main.ts`, `gallery.ts`, `pilot.css`, `types.ts` or anyone else's modules; import from them freely.
- **Interface:** `export const PLATE: PlateText`, `export const VARIANTS: Variant[]` (ids 'a'…'j', names 1–3 words), and `export function draw(id): string` returning an SVG string.
- **Helpers:**
  - `src/pilot/mechanisms.ts`: heads, arrow, wave, text, rcDot, chip, beads
  - `src/pilot/illus.ts`: molecule, water, tag, bolt, illusHeads, bilayer, epath
  - `src/pilot/figures.ts`: spectra, chlorophyll, antenna
  - `src/pilot/carbonFigs.ts`, `src/pilot/fatesFigs.ts`
  - Earlier modules: `figs/s2.ts`, `s5.ts`, `s6.ts`, `s9.ts`, `s12.ts`, `c5.ts`. Reuse a liked drawing by importing it.
- **Styles:**
  - Existing classes live in `pilot.css` under `.theme-editorial`.
  - Put new styles in your own CSS, prefixed `.theme-editorial .f<slot>-…`.
  - Text fill needs `.theme-editorial .fig text.f<slot>-x` to beat the default text rule.
- **SVG:**
  - viewBox `0 0 800 600`; labels 22–27 px (classes `sm`, `lab`); tiny notes ≥ 15 px
  - no overlaps; never colour as the only code
  - prefix every id with the variant (e.g. `fl07c-`)
  - no external images (L02 may use `src/assets/leaf-sky.jpg`)
  - no downloads
- **Verify every variant** with headless Chrome (the dev server is already running; never start or stop it):
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1600,900 --virtual-time-budget=4000 --screenshot=<scratch>/<slot>-<id>.png "http://localhost:5174/pilot.html?solo=<page number>&v=<id>"`
  Page numbers are 1–15 and C1–C13 (C4b for C04b). Read each PNG and fix overlaps until the page is clean, including the right-hand text column (lead plus three points must end above the sources line). Run `npx tsc --noEmit` in the project root.
- **Scratch directory for screenshots:** `/private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/56eefd95-9e0a-474f-ad44-df7918e807f5/scratchpad/`

## Return

At most 200 words. Per slide: the ten variant names with one line each (kind of idea and its point). Then any compromise, any unchecked claim you left out, and which variants carry `anim`.
