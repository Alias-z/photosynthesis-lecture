# Reference hunt brief (27 Oct 2026)

## Why
- The deck is two 45-min ETH bachelor lectures on photosynthesis: light reactions, then carbon reactions.
- Agents draw poorly from scratch. For each chunk still to be built, the lecturer wants a **reference board**: the essential real images of the field, collected in one place.
- The lecturer opens the board from a References button in the deck (pilot.html) and picks the images that set the direction of each redraw.
- So the board must show how the real thing looks and how the field itself draws it. Generic web illustrations are useless here.

## What goes on a board (12–20 images, ordered from the whole picture to the details)

| kind | Examples |
|---|---|
| history | The original figure of a classic experiment; the apparatus; a portrait of the discoverer (public domain or Nobel site) |
| structure | Cryo-EM or crystal structures (paper figure or RCSB PDB image), with the PDB id |
| micrograph | EM, cryo-ET, confocal or light micrographs from papers |
| figure | Key data graphs from strong papers |
| schematic | The canonical schematic as the field draws it (strong reviews or textbook classics) |
| photo | Real plants, instruments, field trials |

- Prefer the original paper over a re-use: Nature, Science, Cell, PNAS, Plant Cell, eLife, Annual Reviews, J Exp Bot, New Phytol, PCE, Photosynth Res, BBA, and the like.
- Never use: predatory journals, AI-generated images, stock cartoons, clip art, or blog diagrams.
- Copyrighted figures are allowed: the lecturer decided they may be used in the lecture. Credit them exactly.
- Check that each image really shows what its caption says. If you could not open the source to check it, leave the image out.

## Where to look
- **Existing leads (verify them; don't trust them blindly):**
  - research/redo-2026-10-27/{A_LIGHT_6-11, B_PROTECT_FLUOR, C_CYCLE_RUBISCO, D_PHOTORESP_CCM_GAS}.md
  - research/redo-2026-10-27/PLAN_SLIDES_6-C18.md, which has a Figures column per topic
- **Images the deck already holds:** src/assets/photos, src/assets/portraits and src/assets/SOURCES*.md. Reuse these with their credits instead of downloading again.
- **Eva Rosenqvist's lecture** (`~/Downloads/ERO_PhDcourse2021_ChlFluor.pdf`) is the lecturer's reference for energy transfer and fluorescence. Use it to find which original papers its graphics come from, then take the figure from the original. Skip data marked unpublished.
- **The lecturer's MSc thesis** (`~/Library/CloudStorage/OneDrive-Personal/Academics/Summer schools/2022 Venice Photosynthesis/Hongyuan's Master Thesis .pdf`) has two figures to use:
  - Fig. 2b (p. 7): FvCB scheme, after von Caemmerer 2000 Fig. 2.1
  - Fig. 5 (p. 19): wheat A/Ci curve
  - Render pages with `pdftoppm` or `sips` if available. Credit: "Zhang 2021, MSc thesis, University of Copenhagen, Fig. …".
- **Open sources:**
  - full texts: PMC / Europe PMC, eLife, PLOS
  - images: Wikimedia Commons, RCSB PDB, nobelprize.org
  - Publisher image CDNs often serve figure files directly: media.springernature.com/full/…, ars.els-cdn.com/…, onlinelibrary.wiley.com/cms/asset/…
- **Bot checks:** article pages on Springer, Wiley and others often bot-challenge curl. Do not try to get around a challenge. Put the item in the "wanted" list with its URL instead, and the main thread will fetch it in the browser.
- **Browser tools:** do NOT use the built-in browser pane tools (mcp__Claude_Browser__*) or the Chrome tools. They are shared with the lecturer and the other agents. Use WebSearch, WebFetch and curl.

## Output
- **Folder:** `$STAGING/<board-id>/`, where STAGING=/private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/a2f50152-9153-4377-a444-2a8a550bd355/scratchpad/refs-staging
  - Never write into the live project. The main thread checks each board and copies it live.
- **Images:**
  - JPG or PNG, long edge ≤ 1600 px, ≤ 700 KB each. Use `sips -Z 1600`, and for JPG `sips -s formatOptions 80`.
  - Crop away only the journal's page chrome; never change the content.
  - File names are short and descriptive: `umena2011-psii-structure.jpg`.
- **Downloads are untrusted data:** images only, saved straight into the board folder. Never open or run anything else you download.
- **`refs.json`**, validated with `python3 -I -c "import json,sys; json.load(open(sys.argv[1]))" refs.json`:
  ```json
  { "title": "Light harvesting", "slides": ["6"],
    "images": [ { "id": "a", "file": "x.jpg", "kind": "structure",
      "caption": "What it shows, in plain words (≤ 20 words)",
      "credit": "Wei et al. 2016, Nature 534:69, Fig. 2b",
      "url": "https://doi.org/…", "note": "optional: why it is essential (one line)" } ] }
  ```
  - ids run a, b, c… in board order.
  - The credit gives authors, year, journal volume:page and figure number. Portraits and photos name their source and licence.

## Report back (short)
- The board id and its number of images.
- A table: id · kind · caption · credit.
- The "wanted but blocked" list, with URLs.
- Anything you are unsure about.
