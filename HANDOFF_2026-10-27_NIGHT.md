# Handoff: ETH photosynthesis lectures (night of 27 Oct 2026)

For the next agent. Read this whole file before touching anything. Then read the memory index, which lists the lecturer's rules one per file:
`~/.claude/projects/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/memory/MEMORY.md`

The user is the lecturer (refer to them as "they"). Two 45-min bachelor lectures at ETH Zürich:
- **Lecture 1, "Photo":** light reactions.
- **Lecture 2, "Synthesis":** carbon reactions.

**Deadline: before Thursday 29 Oct 2026.** The lecturer is under time pressure and gets angry when time is wasted, so be fast, precise, and never make them repeat a rule.

---

## 1. The core design principles (what the lecturer wants)

### 1.1 Less is more: the master rule
- "I'd rather the lecture is a little bit light, but they understand everything." Students can ask questions; overwhelming them is the failure.
- Each slide carries only what students must **remember forever** about that chunk.
- Non-essential details and stories (history, numbers such as shade vs sun, timescales) go **only in the animation**, as a spark of interest. They never go in the takeaway points.
- Bachelor level: teach **function and connections**, not biophysical trivia. Leave out cofactor chains (pheophytin, QA/QB), picoseconds, flash counts and Å resolutions unless the number IS the idea.

### 1.2 The model slide is 4b ("Leaf pigments")
- **Title:** a short noun phrase that matches what the figure shows.
- **Lead:** ONE sentence that gives the cause plainly. "Leaf pigments differ in structure, so they absorb at different wavelengths."
- **Points:** 2–3, each a textbook-term heading plus 1–2 short lines. Each line is one concept; lines are split with `<br>` and render as separate `.p-line` blocks.
- Every slide should look and read like this.

### 1.3 Text rules (all learned the hard way)
- **Every word physically exact.** No vague words ("several pigments", "hundreds", "many"); give the exact number where a number is needed (≈ 300, not "hundreds").
- **Every claim names its object.** "Longer conjugation" was rejected: of what?
- **Headings are textbook terms**, or a term plus a key fact. NEVER "agentic"/slogan language: "Photons count, not their energy", "X, not Y" contrasts, metaphors, "keep it busy", "two jobs". Slides 1–5 are the reference style.
- **No filler sentences.** "Most sunlight never reaches the ground" (false and meaningless) and "The same sunlight falls on both" made the lecturer very angry. Every sentence must teach a fact. When asked to check everywhere, really check everywhere (a deck-wide sentence sweep).
- **No citations in slide text**, except author names when the line tells a discovery as a story ("Emerson & Arnold 1932: …"). Sources go in the sources line.
- **No cross-references** ("(lecture 2)", "next slide").
- **Chl *a* / *b* always italic:** `<i>` in HTML, `<tspan font-style="italic">` in SVG, plain in aria labels. Equation variables italic, units upright.
- **Spell out** "photosystem II (PSII)" and "photosystem I (PSI)".
- **Comparisons labelled on both sides**, organisms named (e.g. "pea", "spinach", "tobacco").
- **No jargon** a first-year student would not know.

### 1.4 Figure rules
- **Variants:** at least 5–6 per new figure, at least 2 per animation, so the lecturer can pick.
- **Labels:** figures show only the takeaway terms, big and sparse. No size numbers, no "different plants at each scale" notes, no taglines.
- **Real images** from strong papers (micrographs, cryo-ET, PDB structures), restyled and credited, mixed with clean drawings. Credits go on the figure (small grey) AND in `src/assets/SOURCES.md`.
- **Balanced layout:** no lopsided empty areas, no label crossing another label or an arrow.
- **Pigment–protein complex:** the lecturer wants the ELONGATED one, the pea PSII–LHCII supercomplex `src/assets/photos/complex-5xnl.jpg` (PDB 5XNL), not the round LHCII trimer.

### 1.5 The whole-chain spotlight (slide 7 onwards)
- ONE schema of the whole light-reaction chain is reused on every slide from 7 on:
  - membrane horizontal, stroma above, lumen below;
  - photosystem II → plastoquinone → cytochrome b₆f → plastocyanin → photosystem I → ferredoxin → FNR → NADPH, plus ATP synthase;
  - H₂O → O₂, H⁺ into the lumen.
- Each slide **lights the part it teaches and dims the rest**, so students always see the overview.
- Order approved (`research/redo-2026-10-27/CHAIN_SPOTLIGHT_PLAN.md`):

| Slide | Lit part |
|---|---|
| 7 | photosystem II |
| 8 | plastoquinone → b₆f → plastocyanin → PSI → Fd → FNR → NADPH |
| 9 | ATP synthase |
| 10 | cyclic flow added |

  Slides 11–13 (photoprotection) are parked.
- The lecturer **picked c2** (protein structures: our own renders of 5XNL, 6RQF, 5L8R, 6FKF at true relative size on a drawn membrane). Variations c2a–c2f are being built; the lecturer will choose one.
- **After the style is chosen, ALL chain animations are remade on exactly that figure:** zoom into the part, show what happens, zoom back out to the whole chain, move to the next part. The animation must match the slide figure exactly.
- Code: `src/pilot/figs/chain.ts` (`chainSvg(style, lit)`, e.g. `LIT_PSII`), `chain.css`, slide 7 figures in `l07c.ts`, renders in `src/assets/chain/*.webp` + `chain-structures.json` (anchors, px per Å), render script `scripts/chain_render.mjs`.

### 1.6 Animation rules
- **Script first** (beats, captions, clicks) as a table, then approval, then build. About 30–40 s, ending on the question the next slide answers.
- **Pace:** brisk motion (each move ≈ 0.8–1.2 s, hop sequences ≈ 2.5 s), never slow motion.
- **Clicks:** a click stop only at a new camera view or a talking point; cause and effect play in ONE click. Readouts are on screen from the start and react instantly.
- **Minimal moving parts.** Portraits, clippings and labels just appear.
- **Style:** halftone portraits of the scientists as avatars, newspaper/journal clippings, Bristol paper, deck fonts. On-screen citations go in the caption band (`cite` in `beats.ts`).
- **Every element named;** comparisons balanced side by side.
- **Lead pages:** most slides need NO lead (question) page. The handout page plus a play button is the normal case. Leads remain only for slides 1, 2 and 5.

---

## 2. How we work (the workflow)

### 2.1 Level by level, top-down
chunk map → plot of one chunk (hook questions, shallow → deep, history stories) → reference board (the lecturer picks real images) → slide text → figures (≥ 5 variants) and animation (≥ 2 stagings).
- Answer only the level asked.
- Settle slides **strictly in order**. Park later-slide topics in one line.

### 2.2 Text changes
- **Always draft first:** a before/after TABLE, then wait for "yes", then apply live at once.
- **The only exception:** exact wording the lecturer dictates.
- **Trims keep the facts.** If a whole point disappears, say so explicitly.

### 2.3 Variant changes and picks
- `research/figure-briefs/picks.json` holds the lecturer's picks. It is **read-only for agents**: never edit or delete entries.
- **A picked variant must stay LISTED** in `VARIANTS`. Before unlisting anything, check picks.json. Never put "unlist <pick>" into an action button for the lecturer either.
- **"Trim" / "make lighter" on a slide with picks** = make trimmed variations OF THE PICKED ONES, kept next to them. NOT new unrelated figures in their place. Violating this was the worst mistake of the night.
- **When the lecturer says "remove unpicked":** take them off the `VARIANTS` list and keep the code.

### 2.4 Proposals
- Use tables of the desired state, not lists of what is wrong.
- **One topic per message;** background status gets one line at most.
- Give 1–2 variants of a wording so the lecturer can steer, with a recommendation.

### 2.5 Building with subagents
- Each subagent works in its own scratch copy and port: rsync the project without `node_modules`/`backups`/`.git`, symlink `node_modules`, run `npx vite --port 51xx --strictPort`.
- Give it a full brief: files, rules, lit sets, labels allowed, QA, "do not touch live files / picks.json".
- Meanwhile, discuss the next slide's logic with the lecturer.
- When it reports: look at its screenshots yourself, diff its files against live (to make sure the live file did not change since it copied), back up the live files to `backups/before-<what>-<date>/`, copy only the reported files, merge `plates.ts` by hand (others may have edited it), run `npx tsc --noEmit -p .`, and verify on the live server.

### 2.6 Land everything live
- The lecturer works ONLY in the live deck on port 5174. Scratch servers are invisible to them: "where are my slides?" happened because work sat in scratch.
- Put approved or new variants live as soon as they compile, then show them in the built-in browser pane (`mcp__ccd_view__show_pane` with pane "preview"). No screenshots in chat.

### 2.7 Commits
- Do not commit unless asked. The repo is `Alias-z/photosynthesis-lecture`; work goes on branch `dev`.
- The last commit is 48635ba; about 180 files are uncommitted now.

---

## 3. Where things are

| What | Where |
|---|---|
| Project | `/Users/zhongyua/.codex/visualizations/2026/10/18/01a14e64-129b-7041-8fab-d6753ae41888/claude-handoff/photosynthesis-lecture-ethz` |
| Live dev server | port 5174, launch name `photosynthesis-lecture-dev` (`.claude/launch.json`); page `pilot.html` |
| One slide | `pilot.html?solo=<n>&v=<id>` (n = slide number such as `4a`, `5`, `7`; `?solo=lead-<n>` for lead pages) |
| One animation | `pilot.html?anim=<key>&v=<staging>&beat=<i>&t=<s>` (keys: sky, life, pig, fates, leaf, antenna, psii) |
| Reference boards / hook questions | `pilot.html?refs=<board>` (`src/assets/refs/<board>/refs.json`) · `?hooks=<chunk>` (`src/pilot/hooks/*.json`) |
| Slide list | `src/pilot/plates.ts`: `PLATES` (`plate(...)`, `withFigures(textModule, figModule)`), `LEADS`, `lines()` for `<br>` → `.p-line`, fitPage tight-1/2/3 levels |
| Slide text / figures | `src/pilot/figs/*.ts`: each has `PLATE` (title, lead, points `{claim, text}`, refs), `VARIANTS`, `draw(id)` |
| Animations | `src/pilot/anim/index.ts` (`ANIMATIONS`, listed stagings), `beats.ts` (captions + cites), `<key>-a/b.ts` stagings (`svg()`, `bind()` → `draw(beat, t)`, `holds` = click stops), assets in `src/assets/anim/<key>/` |
| Credits | `src/assets/SOURCES.md` (append for every new image or render) |
| Picks | `research/figure-briefs/picks.json` (read-only) |
| Plans / drafts | `research/redo-2026-10-27/` (CHUNK_MAP, PLOT_L3/L4/L5, CHAIN_SPOTLIGHT_PLAN, DRAFT_LIGHTER_4A_4B_7, CLARITY_FIXES_5-7) |
| Backups | `backups/before-*-2026-10-27/` |
| Tools | `scripts/` (halftone.py, chain_render.mjs, lhcii_ab_crop.py, fig5_assets.py); `model3d/complex.html` (3Dmol renders); run PIL scripts with `python3 -P` |
| Lecturer's references | `~/Downloads/ERO_PhDcourse2021_ChlFluor.pdf` (Eva Rosenqvist, fluorescence); Rowan Sage papers (C₄, photorespiration) |
| Paper access | the Mac is on the ETH network, so read full texts in the built-in browser (curl gets bot-blocked); ask the lecturer to clear bot checks |

**QA tricks:**
- Headless Chrome: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=1600,1000 --virtual-time-budget=6000 --screenshot=out.png <url>`.
  - Fine for static slides.
  - Animations need the player JS to run. Use the real player or check the agent's "played" frames.
- Text overflow check in the page: elements with `scrollHeight − clientHeight > 2`.
- In the live page you can `await import('/src/pilot/plates.ts')` to list each slide's `variants`.

---

## 4. State right now

| Slide | Text | Figures (listed) | Animation |
|---|---|---|---|
| 1–4 | settled | picks only | sky (e), life (f) |
| 4a Excitation | settled. Points "Red and blue." / "Energy above S₁ is lost." (+ "So every absorbed photon gives the same excitation, whatever its colour") | s | pig (a) |
| 4b Leaf pigments | settled (the model slide) | m, c, d, e | — |
| 5 Where light is captured | settled. Lead "Light is captured by pigment–protein complexes in the thylakoid membranes of chloroplasts." Points: Thylakoid membranes (grana, unstacked membranes, lumen, PSII in stacks / PSI unstacked), Pigment–protein complexes, Stroma | LIVE: o, o1, o2, p, p1, p2, r3, r3a, r3b. Picks o, p, r3 are unchanged; the others are their lighter versions with the elongated 5XNL complex. The lecturer still has to pick. n1–n6 exist in code, unlisted | leaf (a), judged OK; lead page 5 (a) |
| 6 Antenna of photosystem II | settled. Photosynthetic unit ("Of ≈ 300 chlorophylls, only the few in the reaction centre give away electrons; the rest only pass energy on"), Excitation energy transfer (one line), Antenna size | r1, k | antenna (a, b). **New beat 2 live:** patch of ≈ 300 in Emerson's field → zoom → one PSII half labelled antenna / reaction centre |
| 7 Photosystem II | new text live (charge separation, water splitting, plastoquinone) | LIVE: only the lecturer's pick **c2c** (protein structures in a lipid bilayer) and its variations: c2c1 (shaded renders), c2c2 (callouts, larger), c2c3 (glow + silhouettes), c2c4 (PSII core in front of its antenna), c2c5 (detailed bilayer closing the lumen, larger), c2c6 (shaded + callouts). All other chain styles are unlisted (code kept). The credit is only "structures: PDB 5XNL, 6RQF, 5L8R, 6FKF": never add notes like "own renders, one scale". The lecturer still picks the final one | psii: NEW, live. Stagings c (c2c3 look, one flask) and d (c2c look, two flasks), 4 clicks, zoom in/out on the slide's own `chainSvg()` (`src/pilot/anim/psii7-*.ts`). It reads chainSvg markup (`chn-on/off` wrappers, `chn-pq`, `chn-hd`, O₂/H⁺ labels): keep that markup stable. Slide 7 picks: c2c, c2c3 |
| 8 Cytochrome b₆f · 9 Photosystem I · 10 ATP synthase · 10b Cyclic electron flow | approved text LIVE (`s08c`–`s11c.ts`). Slide 9 carries the PSI vs PSII difference (Chl a/b ≈ 11 vs ≈ 2, far-red, light colour unbalances the series) | LIVE, 5 each: a = c2c, b = c2c3, c = c2c3 + zoom inset, d = focus crop + mini-map, e = c2c + callouts (ids 8a–8e, 9a–9e, 10a–10e, 11a–11e; slide 10b uses the 11x ids). Lit sets `LIT_B6F`, `LIT_PSI`, `LIT_ATPS`, `LIT_CYCLIC` in chain.ts | LIVE, each with a play button, 2 stagings each (a = c2c3 glow look, b = c2c bilayer look), scripts in `research/redo-2026-10-27/ANIM_SCRIPTS_8-10b.md`: `b6f` (b6f8-*.ts, 3 beats), `psi` (psi9-*.ts, 4 beats with Emerson 1957 card), `atps` (atps10-*.ts, 4 beats with Jagendorf & Uribe 1966 card + rotor), `cyclic` (cyc10b-*.ts, 4 beats with ATP:NADPH readout + Munekage 2004 card). Known simplifications the lecturer may want changed: one e⁻ shown making NADPH; Emerson graph shows 3 unlabelled curves; 10b readout heading stays "2.6 ATP" after the bar grows to 3; PQ carries one e⁻ in the cycle |
| 11–13 | old text, not yet redone by the new rules (numbers unchanged so their picks stay attached) | old | old |
| Lecture 2 (C1–C13) | built 27 Oct from earlier drafts, NOT yet reviewed under "less is more" | old | — |

The **"fates" animation** (Fates of an excitation) still lists a and b, because it has no pick.

**Older picks still off the list:** slide 3's picks a, e, h and slide 4's picks e, f, h were already unlisted before this session. Ask the lecturer before changing that.

---

## 5. Next steps, in order
1. **Get the lecturer's picks** on slide 7 (the c2c family, which fixes the chain style for slides 7–10 and their animations) and on slide 5 (lighter versions). Both sets are live.
2. **Slide 7 animation: DONE and live** (stagings c and d; the lecturer picks one). The approved script it follows, for reference:

| Beat | Click plays | Caption |
|---|---|---|
| 1 Charge separation | whole chain, PSII lit; energy reaches the reaction centre; an electron jumps across the membrane to plastoquinone | The reaction centre uses the energy to send an electron across the membrane, to plastoquinone. **Where does it get a new electron?** |
| 2 Water or CO₂? | Ruben & Kamen portraits (`src/assets/anim/psii/ruben.png`, `kamen.png`); heavy O₂ appears | 1941, Ruben and Kamen gave algae heavy oxygen, either in the water or in the CO₂. Only heavy water gave heavy O₂: the O₂, and the electrons, come from water. |
| 3 Water splitting | back on the chain; 2 H₂O split at PSII's lumen side; O₂ leaves; electrons refill the reaction centre; H⁺ dots stay in the lumen | Photosystem II splits water: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. The electrons refill the reaction centre; the H⁺ stay in the lumen. |
| 4 Plastoquinone | PQ takes 2 e⁻ + 2 H⁺ from the stroma and moves along the membrane; b₆f starts to light | Plastoquinone takes two electrons, with two H⁺ from the stroma, and carries them on in the membrane. **Where do they go next?** |

   - Two stagings differ in beat 2: (A) one heavy-water flask as a card; (B) two labelled flasks side by side ("heavy oxygen in water" / "heavy oxygen in CO₂"). The lecturer approved the text and asked to build "once the schema is picked". Confirm the zoom-in/zoom-out camera plan with them first, since that came later.
   - Dropped from the old animation: Kok's absorption dip, pheophytin/QA/QB, the energy staircase.
3. **Slides 8, 9, 10, 10b:** text and figures are live. Still to do:
   - the lecturer's figure picks;
   - an animation script for each slide (zoom in on the component, explain, zoom out; one history story where it helps), sent for approval;
   - then 2 stagings each on the picked look, built like `psii7-*.ts`.
   - Slide 6 stays as it is (the lecturer decided).
4. **Slides 11–13 (photoprotection, fluorescence),** then lecture 2. Apply "less is more" and the 4b model to every page; propose before editing.

---

## 6. Mistakes that made the lecturer angry (do not repeat)
- **Unlisting picks** (slide 5 o, p, r3), and earlier deleting picks from picks.json.
- **Replacing instead of trimming:** building new figures when asked to trim the picked ones.
- **Leaving work in scratch** while the lecturer looked at the live deck ("I don't see any of them", "are you lying to me?"). Always put it live, then say where.
- **Applying text edits without a before/after draft;** over-trimming that lost facts.
- **False or empty sentences** ("most sunlight never reaches the ground"); missing a second filler line after being told to check everywhere.
- **Agentic headings and slogans;** vague words ("several", "hundreds"); claims without an object; titles that don't match the figure.
- **Too much information:** cofactor chains, timescales, packed multi-panel figures (the slide 5 s1/s2 "whole story" figure).
- **Animations** that zoomed through unlabelled scales and switched organisms (alga → granum → pea PSII). The lecturer could not tell what the reaction centre was. Label the whole antenna and the reaction centre; keep one scale story.
- **Mixing several topics** in one message; detail at the wrong level; moving to a later slide before the current one was settled.
- **Building without approval** of the idea, or asking needless questions when the instruction was explicit.

---

## 7. Agents at handoff
None are running. The slides 8–10b animations are merged live with their play buttons.

**Merge helper for future animation builds:** `merge_anim.py` in this session's scratch folder. It copies `<prefix>-*` files, appends the beats block from a marker, adds the `index.ts` import and entry, and adds `play` to the slide. Rewrite it if the scratch folder is gone.

Earlier builds, all live:
- the slide 5 lighter picks;
- the slide 7 c2a–c2f.

Their backups are `backups/before-slide5-lighter-picks-2026-10-27/` and `backups/before-chain7-c2-variants-2026-10-27/`.

**The first thing to ask the lecturer:**
- their pick among slide 7's c2 family, which fixes the chain style for slides 7–10 and their animations;
- their picks among slide 5's lighter versions.

**Caveats the builders flagged:**
- **c2a** puts the PSII core in front by layering, not by true depth.
- **c2f's** tight packing is illustrative: in real grana, PSI and ATP synthase stay out of the appressed PSII regions.
- **Slide 7's chain lights plastoquinone's H⁺ uptake from the stroma** (`'pq-h-in'` in `LIT_PSII`), matching text point 3.
