# Overnight build, 28 Oct 2026: animation builders (phase 2)

You build the animations for ONE chunk. That chunk's text and figures (phase 1) are already merged into the live deck.

## Read first
1. `research/redo-2026-10-28/OVERNIGHT_BRIEF.md` §0, §1, §2 and §4, all of them. The rules, the process and the safety apply to you unchanged.
2. Your chunk's phase-1 report, `research/redo-2026-10-28/reports/REPORT_<prefix>.md` in the live project (read-only for you), for the per-slide animation scripts and staging ideas. Check each script against the rules before you build:
   - about 30–40 s;
   - captions in exact words, every element named;
   - ends on the question the next slide answers;
   - no trivia.
   Tighten any script that breaks them, and say so in your report.
3. The engine: `src/pilot/anim/types.ts` (Staging: `svg()`, `bind()` → `draw(beat, t)`, `holds`), `player.ts`, `index.ts`. The model to copy is `b6f8-common.ts` + `b6f8-a.ts` / `b6f8-b.ts`: one common file holds the story; each staging file sets the look and the camera.

## What to build
- **One animation per slide of your chunk.** Key `<prefix><slide>`, e.g. `rf5`, `rf6`, `cc11`, `pp12`. The beats go in `anim/beats-<prefix>.ts`.
- **3–4 stagings per animation, differing in story or camera, not colour.** For example:
  - (A) zoom into the slide's own figure and back out;
  - (B) history-led: the classic experiment's apparatus or data, with halftone portraits and a journal clipping;
  - (C) real-image-led: a micrograph or structure from the reference board, restyled;
  - (D) side-by-side comparison.
- **Where a staging reuses the slide figure,** it must be the slide figure exactly: call the same draw function, as b6f8 does with `focusSvg`.
  - For the rf chunk, zoom on `figs/rf-schema.ts`, lighting the slide's part, and build the stagings in at least two of the schema's looks.
- **Pacing:**
  - one click per camera view or talking point (`holds`);
  - cause and effect in one click;
  - brisk motion: each move ≈ 0.8–1.2 s;
  - readouts on screen from the start;
  - portraits, clippings and labels just appear.
- **If time runs short:** first give every slide 2 stagings, then add the third and fourth.

## Setup, QA, delivery
- **Scratch copy:** `<scratchpad>/<prefix>-anim/deck`, copied FRESH from the live project (rsync as in OVERNIGHT_BRIEF §2, symlink node_modules). Vite on your port, `--strictPort`.
- **New files only:**
  - `anim/<prefix><slide>-common.ts`, `anim/<prefix><slide>-a.ts` … and CSS;
  - assets in `src/assets/anim/<key>/`;
  - sources appended to your chunk's `src/assets/SOURCES-<prefix>.md`.
  - Do not edit `index.ts`, `beats.ts` or `plates.ts`: report the lines instead.
- **QA:**
  - `npx tsc --noEmit -p .` must be clean;
  - screenshot every beat of every staging at its start, at each hold and at its end (`pilot.html?anim=<key>&v=<staging>&beat=<i>&t=<s>`, headless Chrome, 1600×1000), and LOOK at each one: readable labels, nothing overlapping, the end frame matching the slide figure where reused;
  - keep the shots in `<scratchpad>/<prefix>-anim/shots/`.
- **Report:** `<scratchpad>/<prefix>-anim/REPORT.md`, containing:
  - the files created;
  - the exact `index.ts` lines (imports + `ANIMATIONS` entries) and the `play` key for each slide;
  - the final scripts as tables;
  - one line per staging (what it tests);
  - known simplifications and doubts.
- **Final message:** at most 200 words, with the report path. If the Write tool refuses the report file, put the whole report in your final message instead; the word limit does not apply then.
- **Never** touch the live project, port 5174 or picks.json; never commit; ask no questions (the lecturer is asleep). Keep `PROGRESS.md` current.
