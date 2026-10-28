# One glyph set for the whole deck (lecturer, 28 Oct 2026)

The lecturer picked slide 7's variant **7m1**. It is the c2c look of `figs/chain.ts` in glyph mode (`{ mol: true }`), and it sets the style for both lectures, figures and animations alike.

> "Everything like molecular should be formed like this … ensure everywhere we have a unified style, including … the dark side as well."

Open `http://localhost:5174/pilot.html?solo=7&v=7m1` (or your scratch port) to see the reference before you start.

## 1. The standard (the desired state)

| Thing | How it is drawn | Code |
|---|---|---|
| Atoms | Balls with their letter: O yellow (`#f4cc4f`, stroke `#b8902a`), C red-orange (`#d9633a` / `#9b3e1e`), H small white (`#fffdf8` / `#a8a59a`) | `illus.ts` `molecule()`, classes `atom atom-O/C/H`, `atom-t` (pilot.css) |
| H₂O | One O ball with two small H balls below it | `illus.ts` `water()`, `chain.ts` `waterG()` |
| O₂ | Two O balls touching | `illus.ts` `o2()`, `chain.ts` `o2G()` |
| CO₂ | O–C–O balls in a row | `illus.ts` `co2()` |
| Isotopes | ¹⁸O is a **purple** ball (`#8e63c4` / `#5e3d8f`), labelled ¹⁸O, the same purple wherever that experiment appears; ¹⁴C (Calvin, Hatch & Slack) likewise purple with its own label. Name it "isotope", never "heavy water". | local helper, same colours |
| H⁺ | A white disc **ringed red** (`#c2401f`) with "H⁺" in red inside. Never a bare dot or a lone "H⁺" word standing for a proton in a drawing. | `illus.ts` `hplus()`, class `tag-h`/`tag-ht`; `chain.ts` `hring()` |
| e⁻ | A dark dot (`#2b2a27`), labelled e⁻ where it first appears | — |
| Energy carriers, products | Rounded tags: ATP and ADP clay (`tag-atp`), NADPH and NADP⁺ blue (`tag-nadph`), Pᵢ an orange disc (`tag-pi`), others plain (`tag-plain`). A reaction is a row of tags: `chain.ts` `rowG()`. | `illus.ts` `tag()`, `chain.ts` `tagG()`/`rowG()` |
| Molecule names | Written in **ink** (`#141413`) next to the glyph. **Never coloured**: no blue O₂, no coloured CO₂ word. | — |
| Gas paths | O₂ and CO₂ arrows in neutral grey (`#6b6a64`), **not blue**. e⁻ arrows solid black; H⁺ paths red dotted (as in chain.ts). | — |
| Dimmed parts | The same glyphs at reduced opacity (chain.ts: `.chn-off .chn-g { opacity: .38 }`) | — |

**What stays as it is:**
- Equations inside running text (slide points, captions) stay text: "2 H₂O → O₂ + 4 H⁺ + 4 e⁻" is fine in a caption.
- Axis labels on data plots ("CO₂ (µmol mol⁻¹)") stay text.
- Real micrographs and paper figures are not redrawn.

## 2. What to change

Change every drawing of a molecule, proton, electron or energy carrier that breaks §1, in every **listed** variant of every slide in your scope and every **listed** staging of its animations.

**Typical fixes:**
- a text label "O₂", "CO₂", "H₂O" or "H⁺" standing for the molecule → the glyph, with the name in ink beside it where the name helps;
- a kit's own atom colours (e.g. `rfs-atom-O`) → the shared classes or exactly the colours above;
- blue or green molecule text → ink;
- dot-protons → ringed H⁺;
- an ATP or NADPH word in a drawing → a tag.

**Order of work:**
1. Fix the shared kit first, so every variant that uses it follows (e.g. `rf-schema.ts`, `cb-common.ts`, `cp-kit.ts`, `cc-kit.ts`, `cr-common.ts`, `pp-kit.ts`, `cc-anim-kit.ts`).
2. Then the one-off modules.

**Keep:** ids, picks and layout. A picked variant keeps its id and composition; only its glyphs change. Never edit `research/figure-briefs/picks.json`. Never unlist a variant.

**Text:** don't change any slide text or caption wording. If a caption must change because a glyph now carries the word, report it as before → after; don't apply it.

**Glyph size:** a glyph must read at slide size. Letters are at least 11 px in the 800 × 600 figure. If a glyph does not fit, make room by moving things, not by shrinking the letters.

## 3. Files you must not edit (shared; report instead)
`src/pilot/illus.ts`, `src/pilot/pilot.css`, `src/pilot/figs/chain.ts`, `src/pilot/figs/chain.css`, `src/pilot/plates.ts`, `src/pilot/anim/index.ts`, `src/pilot/anim/beats.ts`, `src/pilot/types.ts`, `src/pilot/main.ts`, `research/figure-briefs/picks.json`. If you need a helper, write it locally in a file of your scope and import from `illus.ts`.

## 4. Workflow (all builders)
- **Live project (read-only for you):** `L=/Users/zhongyua/.codex/visualizations/2026/10/18/01a14e64-129b-7041-8fab-d6753ae41888/claude-handoff/photosynthesis-lecture-ethz`. Never edit it, never touch port 5174, never commit.
- **Scratch:** `W=/private/tmp/claude-502/-Users-zhongyua--claude-spares-spare-hM1lLo/5ab943f9-d753-4192-bfa6-3efc5cb53ace/scratchpad/<your-name>`.
  1. Copy the live project fresh: `rsync -a --exclude node_modules --exclude backups --exclude .git --exclude dist "$L/" "$W/deck/"`, then `ln -s "$L/node_modules" "$W/deck/node_modules"`.
  2. Start vite in the background on your port: `"$W/deck/node_modules/.bin/vite" "$W/deck" --port <port> --strictPort`.
  3. `cd` is unreliable in this shell: use absolute paths.
- **Type check:** `"$W/deck/node_modules/.bin/tsc" --noEmit -p "$W/deck"` must be clean.
- **Look at every change.** Capture headless with:

  ```
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1600,1000 --virtual-time-budget=8000 --screenshot=OUT.png "http://localhost:<port>/pilot.html?solo=<n>&v=<id>"
  ```

  For animations use `pilot.html?anim=<key>&v=<staging>&beat=<i>&t=<s>`.
  - Capture before (on the live 5174) and after (on your port).
  - Build contact sheets with `python3 -P /private/tmp/claude-502/-Users-zhongyua--claude-spares-spare-hM1lLo/5ab943f9-d753-4192-bfa6-3efc5cb53ace/scratchpad/tools/contact.py OUT.png COLS WIDTH img1 img2 …`.
  - Look at them: legible letters, nothing overlapping, nothing lost.
- **No bot-check circumvention:** no curl with a faked browser agent. Reuse images already in `src/assets/`.
- **The lecturer is busy:** ask no questions; decide sensibly and report.
- **Report in your final message** (the harness may refuse report files):
  1. every file you changed or created, as paths relative to `src/pilot/`;
  2. what changed, per slide or animation, in a table;
  3. the paths of the before/after contact sheets;
  4. caption changes you propose (before → after), not applied;
  5. doubts.
