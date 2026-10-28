# Accuracy review of the whole deck (lecturer, 29 Oct 2026, the lecture is today)

The lecturer: "Please comprehensively review everything and ensure that things are accurate, because we're teaching students; we don't want to make mistakes."

## What to review
Everything a student sees on the live deck (http://localhost:5174, `pilot.html`), in the live `ORDER` in `src/pilot/plates.ts`:
- slide text: title, lead, points, eq blocks and tables;
- every listed figure variant: labels, numbers, keys, credits;
- every listed animation staging: captions, on-screen labels, counters, ledgers;
- source lines.

How to view:
- a slide: `pilot.html?solo=<n>&v=<id>`;
- an animation: `pilot.html?anim=<key>&v=<staging id>&beat=<i>&t=<s>`;
- the variant list per slide: in the browser, `const m = await import('/src/pilot/plates.ts'); m.PLATES.map(p => [p.n, p.variants.map(v => v.id), p.play])`;
- or read the TS sources directly (`src/pilot/figs/*.ts`, `src/pilot/anim/*.ts`).

## What counts as an error (report all)
1. **Wrong or unsourced facts.** Numbers, dates, mechanisms, attributions, units. Check each against a primary source or an authoritative review.
   - The lecturer is on the ETH VPN, so publisher full texts may load with plain curl or WebFetch.
   - No bot-check circumvention: if blocked, use an open source and say so.
2. **Counts that don't add up.** Within a slide, across slide ↔ figure ↔ animation, and across slides (per O₂, per CO₂, per 3 CO₂, per 2 O₂). Arithmetic errors.
3. **Imprecise or misleading wording,** for example:
   - claims that are only true as a net balance but read as atom-level (e.g. "the 1 triose phosphate that leaves holds the 3 new carbons" is false atom-wise; the net balance is true);
   - "makes ATP" where ATP is used;
   - figurative or invented terms ("valves" other than "malate valve", "gap", "pays", "wins");
   - undefined abbreviations at first use;
   - "Rubisco" instead of "RuBisCO";
   - number words instead of numerals.
4. **Inconsistencies.** The same quantity with different values on different slides (e.g. Γ*, Cᵢ, C꜀, today's CO₂, specificity values), and the same term spelled two ways.
5. **Visible defects.** Text overflowing a box, cut labels, overlaps, captions over 3 lines hiding their sources, leftover meta text ("schematic", "cut to fit", slide references such as "→ C4").

## Scope per reviewer
- **R1:** slides 1–10b and 10c (light reactions) with their animations.
- **R2:** C0, C2, C1, C4, C4e, C6 with their animations: bridge, c2story, cb1 (both stagings), cb4, eff, rf6.
- **R3:**
  - C12, C13, C14, C15 with their animations, plus the optional slides 11, 12, 13, C7, C8 and C9.
  - Text only on C10, C11 and C11a; their animations are being rebuilt.
  - The numbers in the C2 history model, `anim/c2story-model.ts` and `beats-c2story.ts`: recompute every displayed value.

## Rules
- **Do not edit any file** under `src/` or `research/figure-briefs/picks.json`. You report, I fix.
- Work fast but carefully. Verify every finding before reporting it, and drop anything you cannot verify.

## Report format (your final message)
- A table: slide / variant or animation beat / exact on-screen text / the problem / the correct text (exact, ready to paste) / source with read depth / severity:
  - **A:** factually wrong;
  - **B:** misleading or imprecise;
  - **C:** cosmetic.
- Then a short list of things you checked and found correct, so I know the coverage.
