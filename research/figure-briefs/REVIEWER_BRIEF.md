# Reviewer brief: second pass over the figure variants

Each slide now has ten figure variants, built by different agents. The lecturer will soon pick favourites in `gallery.html`. Before that, every variant gets an independent review. You are checking someone else's work. Assume errors exist and look for them.

Read `BUILDER_BRIEF.md` (rules the builders followed) and `LECTURE_OVERVIEW.md` (storyline and essentials) in this folder first.

## What to check, in this order

1. **Science.** This matters most.
   - Every label, number, arrow direction, location (lumen or stroma, which organelle, which cell), stoichiometry and name must be correct.
   - Each must agree with the checked review (`research/review-2026-10-23-claude/`: the A–F reports and `REVIEW_SUMMARY.md`) and with the slide's own page text (`PLATE`).
   - If a number in a figure is not supported by the review or by the page's references, either check it against the primary source or remove it. To check, read the abstract or landing page via its DOI; don't save any file. If you remove it, replace it with a qualitative label.
   - Never invent a number or a reference.
2. **Clarity for a student who starts from zero.**
   - Labels explain themselves.
   - Every abbreviation is defined in the figure or on the page.
   - Curves and series are told apart by direct labels, not colour alone.
   - Schematic graphs say "schematic".
   - Arrows have one obvious reading.
3. **Ambiguity hazards.** "C3" or "C4" used as a slide number or a carbon count reads as C₃/C₄ photosynthesis. Write "slide C3", "next slide", "3 C" or "C₅ sugar" instead. Similar hazards: "PS" without I/II, "e" without ⁻, "P" for phosphate vs Pᵢ.
4. **Layout.**
   - No overlapping or clipped text, and no label touching a shape.
   - Keep labels inside the viewBox (0–800 × 0–600) so the PDF and gallery thumbnails do not clip them.
   - Labels 22–27 px; small notes no smaller than 15 px.
   - Nothing crowded.
   - The right-hand text column (lead plus three points) ends above the sources line.
5. **Static rule.** Each variant must carry its take-home on its own as a PDF page. For variants marked `anim: true`, the drawing is the final frame with the path shown.

## Rules

- **Fix errors only.** Keep each variant's idea and look. Do not redesign, add or remove variants, or rename them.
- **Page text:**
  - L01–L06 page text (`PLATE`) is lecturer-confirmed: never edit it. If a figure contradicts it, fix the figure.
  - Draft page text (L07 onwards) may be corrected for errors only, using facts from the review.
  - Respect the length limits in `BUILDER_BRIEF.md`.
- **Files:**
  - Edit only the modules listed for you (`src/pilot/figs/<slot>.ts` and `.css`).
  - Never edit the shared files: `plates.ts`, `main.ts`, `gallery.ts`, `qa.ts`, `pilot.css`, `types.ts`, `mechanisms.ts`, `illus.ts`, `figures.ts`, `carbonFigs.ts`, `fatesFigs.ts`, or the seed modules `s*.ts` / `c5.ts` (unless listed for you).
  - If a shared helper is wrong, report it instead.
- **Environment:**
  - The dev server is already running on port 5174. Never start or stop it.
  - No downloads.
  - Screenshots go in the scratch directory, never in the project.
  - The lecturer may be browsing the gallery while you work, so keep the code compiling between edits.

## Tools

- Full page of one variant (1600 × 900):
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1600,900 --virtual-time-budget=4000 --screenshot=<scratch>/<slot>-<id>.png "http://localhost:5174/pilot.html?solo=<page>&v=<id>"`
  Page numbers are 1–15, C1–C4, C4b, C5–C13. Read every PNG you take.
- Automatic layout check of all 290 variants (label overlaps, labels outside the viewBox, text column overflow):
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --virtual-time-budget=30000 --window-size=1700,1000 --dump-dom "http://localhost:5174/qa.html"`
  The report is JSON inside `<pre id="qa">`. Ignore the `title too wide` check, because titles are now fitted at render time.
- Type check: `npx tsc --noEmit` in the project root, once at the end and whenever you change TypeScript.
- Scratch directory: `/private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/56eefd95-9e0a-474f-ad44-df7918e807f5/scratchpad/review/`

## Return

At most 250 words.
- Per slide, the fixes you made: variant letter plus one line each. Leave out variants that needed nothing.
- Open questions for the lecturer: claims you could not verify, and judgement calls you left alone.
- The variants you consider strongest per slide (one or two letters, with a reason in five words).
