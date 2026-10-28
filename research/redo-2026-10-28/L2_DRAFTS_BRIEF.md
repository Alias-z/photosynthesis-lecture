# Lecture 2 text drafts for the new order (lecturer, 28 Oct 2026)

**Task.** The lecturer said, "start drafting the other slides now." Write before → after text drafts for every lecture-2 slide in the new order. Do not apply any of them: the lecturer approves each slide's text before it changes.

## The new order (live: `src/pilot/plates.ts`, `ORDER`)
| Chunk | Slides | Notes |
|---|---|---|
| Electron transport | 7–10b | 10b ends "Now there is enough ATP and NADPH: how do plants use them?" |
| Bridge | C0 "From light to CO₂ fixation" | ATP and NADPH → Rubisco fixes CO₂ → triose phosphate → bread; ends "What is Rubisco?" Draft, being finished. |
| Rubisco story | C2 "Rubisco" → C5 "carboxylation and oxygenation" → C5a–C5c | C5a–C5c (history, warming, a better Rubisco) are being built by another agent: skip them. Do remove any overlap they create: C5's "Temperature" point now belongs to C5b. |
| Dark side in full | C1 CBB cycle → C3 reduction + regeneration → C4 sucrose and starch → C6 photorespiration → C7 light response → C8 FvCB | |
| Escaping photorespiration | C11 refixation → C11a C₂ (new, skip) → C12 C₄ → C13 CAM | C11's points 2–3 now repeat C11a: propose the trim. |
| Crops | C14 rising CO₂ → C15 from leaf to loaf | |
| Optional block, at the end | C9 gas exchange, C10 CO₂ diffusion | Lighter touch: only fix numbers and units. |

## What to read
- **Slide modules:**
  - `figs/cb01–cb04.ts`, `rf05–rf08.ts`, `cp09.ts`, `cp10.ts`, `cc11–cc13.ts`, `cr14.ts`, `cr15.ts`;
  - `text-c10.ts` (it overrides C10–C15 texts: check which text actually shows);
  - their animation captions: `anim/beats*.ts` for cb1–4, rf5–8, cp9–10, cc11–13, cr14–15;
  - the lead pages in `LEADS` (`plates.ts`) for chunk openers.
- **The new figures each slide now carries:** `figs/cellv.ts` / `cell-schema.ts` (strip m1 counts per 3 CO₂; C5 per reaction; C6 per 2 O₂; cell section m2 without numbers).
- **The held numbers audit:** `research/redo-2026-10-28/reports/REPORT_dark-prep.md`. Its "text proposals" and "lecturer's choices pending" sections are your starting point. Re-check each number you carry over. Example: C5's "≈ 1 oxygenation per 3 carboxylations" vs the audit's "≈ 2 per 5". vₒ/v꜀ = 2Γ*/C꜀ depends on C꜀; say which C꜀ the deck uses elsewhere and pick one consistent statement.
- **The lecturer's rules,** from memory files summarised here:
  - minimal: a lead plus at most 3 short points; light and fully understood beats dense;
  - point headings are a textbook term or an exact fact, never slogans;
  - numerals, never number words; one stated unit per slide; numbers go in `eq` blocks (`Point.eq`), not in the reading text;
  - no repeated content on adjacent slides;
  - each chunk opens with a common, curious hook question (lead pages);
  - physically exact words.

## Output
Write `research/redo-2026-10-28/L2_TEXT_DRAFTS.md`:
- **Per chunk, then per slide:** a table of title / lead / each point (text + eq) / refs changes, as before → after. Mark unchanged rows "same".
- **Per slide, the animation caption changes** (before → after) where numbers, units or the new order require them.
- **A "decisions for the lecturer" list:** at most 6 items, each with your recommendation and 1 line of evidence (e.g. ppm vs µmol mol⁻¹; water per CO₂ basis).
- **A fact table** for every number you change or keep, with source and read depth.

## Sources
- Open access via plain curl/WebFetch.
- No bot-check circumvention. If a page is blocked, say so.

## Rules
- Do not edit any file under `src/` or `research/figure-briefs/picks.json`.
- Aim for about 1 hour. Do the Rubisco story chunk (C2, C5) first, then the dark side, then the rest.
- Send a short note to "main" when the C2/C5 drafts are written, so they can go to the lecturer early.
