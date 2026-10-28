# C1 "C₃ photosynthesis" animation 'cb1', version 2: the storyline, simple, light (lecturer, 29 Oct 2026, evening)

The lecture is today. Quality comes first; the lecturer judges every frame.

## The lecturer, near verbatim
- "Why does the carbon-bookkeeping variant k not tell the storyline?"
- "Reduce the amount of animation, for example on 'why 3'. Make the calculation more clear and simple."
- "Too much text. Keep only the essential."
- "Make 2 more variations, to explain things clearly."

## What exists (live, `src/pilot/`)
- **Staging s,** `anim/dk-cb1.ts`, with beats CB1 in `beats-cb.ts`: the discovery story in the dark-reaction strip. The lecturer picked it; do not touch it.
- **Staging k,** `anim/dk-cb1k.ts`, with beats CB1K: bookkeeping without a story. It has a long "why 3" trial card (1 CO₂ 1⅔ ✗, 2 CO₂ 3⅓ ✗, 3 CO₂ 5 ✓) and a text-heavy side panel. It is replaced by your work and stays in its file, unlisted.

## Captions: `CB1V2` in `anim/beats-cb1k.ts` (exact; 5 beats; do not edit)
1. **Carbon-14:** the experiment: ¹⁴CO₂ fed to algae in light, reactions stopped in alcohol.
2. **Carboxylation of RuBP:** within seconds most ¹⁴C is in 3-PGA. RuBisCO adds CO₂ to RuBP, which splits into 2 3-PGA.
3. **Reduction of 3-PGA:** ATP phosphorylates, NADPH reduces → triose phosphate.
4. **Regeneration of RuBP:** "3 RuBP hold 15 C, exactly 5 triose phosphates", so per 3 CO₂, 5 of the 6 rebuild RuBP and 1 leaves.
5. **Per 3 CO₂:** 9 ATP and 6 NADPH used, then the question that leads to C4.

## Rules for all 3 stagings
- **"Why 3" is one line, not an animation of trials.** "3 RuBP = 15 C = 5 × 3 C" (or the same equality drawn with carbon balls). Show no 1⅔ / 3⅓ trial rows.
- **Minimal on-screen text.** At most 1 short ledger line per beat, e.g.:
  - "3 RuBP + 3 CO₂ → 6 3-PGA";
  - "6 3-PGA → 6 triose phosphates · 6 ATP + 6 NADPH";
  - "5 triose phosphates → 3 RuBP · 3 ATP · 1 out";
  - "per 3 CO₂: 9 ATP + 6 NADPH used".
  No paragraphs in panels, and no repeating the caption on screen.
- **Count every molecule; make no atom-level claims.**
  - Draw carbons plain (not coloured by origin), so nothing reads as "the exported triose phosphate holds the 3 new carbons" (false atom-wise; only the count is true).
  - The ¹⁴C may be shown only where it is true: the label first appears in 3-PGA.
- **ATP and NADPH are used:** spent, as ADP + Pᵢ and NADP⁺, which go back to the thylakoid. They never return as ATP.
- **Style:**
  - the deck's atom balls (`figs/cell-schema.ts` `balls`, `figs/carbon-form.ts`), tags (`figs/chain.ts` `tagG`), protein renders;
  - one fixed framing per beat, at most one slow, eased move, never a zoom in and out;
  - eased motion, no jitter;
  - letters ≥ 12 px; nothing outside its box;
  - captions ≤ 3 lines; no meta text; words before symbols; numerals; RuBisCO;
  - ≤ 40 s in all.
- **Real images:** where a staging uses the experiment, use the deck's existing assets and credits:
  - the Berkeley Lab "lollipop" photo;
  - Calvin's 1961 Nobel lecture Fig. 6, the 5 s autoradiogram;
  - Bassham et al. 1954 Fig. 7, the cycle.
  See `anim/dk-cb1.ts` for the paths and credit lines.

## The 3 stagings (one builder each; new files only)
| Id | File | Idea |
|---|---|---|
| k2 | `anim/dk-cb1k2.ts` | **The strip, with the story.** The dark-reaction strip (`anim/dk1-common.ts`, CYCLE_VIEW) as in k, now telling the 5 beats. Beat 1 is the lollipop photo in a corner card. Beat 2 is the 5 s autoradiogram with the 3-PGA spot lit, then CO₂ 1–3 + RuBP 1–3 into RuBisCO giving 3-PGA 1–6. Beat 3: each 3-PGA with 1 ATP and 1 NADPH → triose phosphate 1–6. Beat 4: 5 triose phosphates into regeneration → RuBP 1–3 back; 1 out through TPT; the line "3 RuBP = 15 C = 5 × 3 C". Beat 5: the small ledger. |
| p | `anim/cb1-p.ts` | **Carbon blocks.** A clean stage with no strip: carbons as the deck's carbon balls in rows. 3 RuBP (3 rows of 5 C) + 3 CO₂ (3 C) → 6 rows of 3 C (6 3-PGA, then 6 triose phosphates, as ATP/NADPH tags join). Then the 18 C slide into 3 rows of 5 + 1 row of 3. This regrouping is the calculation: 15 = 3 × 5 = 5 × 3, with no text needed. Beat 1 opens on the lollipop photo, beat 2 on the autoradiogram. |
| q | `anim/cb1-q.ts` | **From Calvin's spots to the cycle.** Beat 1: the lollipop photo. Beat 2: the 5 s autoradiogram, 3-PGA lit. Beats 3–4: the cycle is drawn step by step over Bassham 1954's own cycle figure, or redrawn after it in the deck's style. Each arrow gets its count per 3 CO₂ (3 CO₂ + 3 RuBP → 6 3-PGA → 6 triose phosphates → 5 back to 3 RuBP, 1 out). Beat 5: ATP and NADPH counts on the arrows that use them. |

## Ownership, setup, QA, report
- **Write only your own new files.**
- **Never edit:**
  - `beats-cb1k.ts`, `beats-cb.ts`, `dk-cb1.ts`, `dk-cb1k.ts` or `dk1-common.ts`; write helpers in your own file;
  - `index.ts` or `plates.ts`; report the line;
  - `research/figure-briefs/picks.json`.
- **Don't commit.**
- **Scratch copy:** `$S/c1-<id>/deck`, made with `rsync -a --exclude node_modules --exclude .git --exclude dist --exclude backups` from `/Users/zhongyua/.codex/visualizations/2026/10/18/01a14e64-129b-7041-8fab-d6753ae41888/claude-handoff/photosynthesis-lecture-ethz/`.
  - Symlink `node_modules`, and run vite on your port: k2 5321, p 5322, q 5323.
  - `$S` = `/private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/5ab943f9-d753-4192-bfa6-3efc5cb53ace/scratchpad`
- **Wire it in your scratch only:** add `{ ...yourStaging, beats: CB1V2 }` to the `cb1` entry in your scratch `anim/index.ts`.
- **Checks:**
  - `tsc --noEmit` clean;
  - headless Chrome shots of every beat, at its end and in mid-motion;
  - a PIL contact sheet (`python3` without `-I`);
  - look at every frame yourself.
- **Report:** the files to copy, the index.ts line, the contact-sheet path and your doubts.
