# Slide 9 (photosystem I) animation: reorder the Emerson story (lecturer, 29 Oct 2026)

**Scope.** Live staging m4, the only listed one (`anim/psi-m4.ts` + `anim/psim-common.ts`); beats in `anim/beats-psim.ts`.
- **Current order:** 1 Second light reaction · 2 NADPH · 3 Two photosystems in series (the Z-scheme) · 4 Red drop · 5 Emerson's enhancement.

## The lecturer, near verbatim
"Emerson's image should appear the first time you show far-red light, because he found out far-red light alone gives very little. Then red plus far-red make much more: show him later, meaning he did the experiment for the comparison. Then in the end: both systems work together."

## New beat order and content
1. **Second light reaction:** unchanged.
2. **NADPH:** unchanged.
3. **Red drop (Emerson, 1943).**
   - Emerson's portrait clipping (`emerson-nas.png`, as now) appears here, at the moment far-red light is first shown.
   - Far-red light (distinct far-red colour) falls on the leaf or chain; photosystem I is lit, photosystem II nearly dark. An O₂ meter reads "little O₂".
   - Caption: "1943, Emerson: far-red light alone, reaching mostly photosystem I, gives little O₂: the red drop." Cite Emerson & Lewis 1943.
4. **Emerson's enhancement (1957).**
   - The same clipping, now dated 1957, stays on screen.
   - The comparison as 3 lamps or meter readings side by side: red alone (some O₂), far-red alone (little O₂), red + far-red together (more than the 2 added).
   - Caption: "1957, Emerson: red light (for photosystem II) together with far-red light gives more O₂ than the 2 lights apart." Cite Emerson, Chalmers & Cederstrand 1957.
   - **Show no illustrative photon arithmetic:** the lecturer wants this concept-level ("works much better together").
5. **Two photosystems work together (the ending).**
   - The minimal Z-scheme: photosystem II under red (#d4261c), photosystem I under far-red (#6b1d5c), both lifts lit, one electron passing through both.
   - Caption: "Photosystem II and photosystem I work in series: each electron is lifted once by each. <b>What else does the chain make besides NADPH?</b>" Cite Hill & Bendall 1960.

## Rules
- **Unchanged content:** keep the existing visual elements where possible, and only reorder or retime them.
- **Camera:** fixed framing within each beat, no zoom in and then out; at most one slow, eased move per beat.
- **Colours:** red and far-red clearly different, as now.
- **Text:** captions ≤ 3 lines so their sources show; on-screen labels short and inside their boxes. Check every frame for text overflowing a box.
- **Work in a scratch copy:** `$S/psi-emerson/deck`, rsync'd from live. Vite on port 5280; `tsc` must be clean.
  - `$S` = /private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/5ab943f9-d753-4192-bfa6-3efc5cb53ace/scratchpad
- **QA:** take headless Chrome shots of every beat end and mid-motion frames, build a contact sheet with PIL (`python3` without `-I`), and look at every frame yourself.
- **Report:** the files to copy and the contact-sheet path.
