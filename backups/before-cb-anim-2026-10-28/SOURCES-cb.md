# Lecture 2 chunk 1, the Calvin–Benson–Bassham cycle (slides C1–C4, prefix cb, overnight build 28 Oct 2026)

New files are cut from the reference board `refs/C1-cbb-cycle/` with PIL (`python3 -P`). Nothing is painted over except
where stated. Each figure carries its own credit line in small grey type. Published figures are multiplied into the paper
(their white ground disappears); photos and micrographs keep their own ground in a thin frame. Earlier crops that the
new variants reuse are documented in `SOURCES-L2a.md` and listed here only with what is new.

## New image files

`photos/cb-bassham1954.png`: Bassham JA, Benson AA, Kay LD, Harris AZ, Wilson AT, Calvin M (1954) The path of carbon in photosynthesis. XXI. The cyclic regeneration of carbon dioxide acceptor. *J Am Chem Soc* 76: 1760–1770, https://doi.org/10.1021/ja01636a012, **Fig. 7**, the first published drawing of the cycle, as reproduced in Sharkey TD (2019) *Photosynth Res* 140: 235–252, https://doi.org/10.1007/s11120-018-0600-2, **Fig. 2** (board image l).

- Licence: © American Chemical Society 1954 / © Springer Nature 2019; lecture use with credit (lecturer's decision, 27 Oct 2026).
- Processing: Sharkey's later labels ("Aldolase" ×2, "Transketolase" ×2 in purple, and "RuBP" in grey) are removed with a colour mask and white boxes, so the drawing is shown as printed in 1954. The running head and the printed caption are cropped off: crop y 60–900, then x 100–1510, of the 1600 × 1011 board file (result 1410 × 840). Near-white set to white.
- Used: C1 v3 (phase zones coloured under the multiplied scan).

`photos/cb-michelet2013.jpg`: Michelet L, Zaffagnini M, Morisse S, Sparla F, Pérez-Pérez ME, Francia F, Danon A, Marchand CH, Fermani S, Trost P, Lemaire SD (2013) Redox regulation of the Calvin–Benson cycle: something old, something new. *Front Plant Sci* 4: 470, https://doi.org/10.3389/fpls.2013.00470, **Fig. 1**.

- Licence: CC BY.
- Processing: the whole 1600 × 1191 board file, near-white set to white.
- Used: C1 v4 (phase zones coloured under the multiplied figure).

`photos/cb-sharkey2019.jpg`: Sharkey TD (2019) Discovery of the canonical Calvin–Benson cycle. *Photosynth Res* 140: 235–252, https://doi.org/10.1007/s11120-018-0600-2, **Fig. 3** (the cycle per 3 CO₂ with carbon counts).

- Licence: © Springer Nature; lecture use with credit.
- Processing: the whole 1418 × 1189 board file, near-white set to white. C3 v6 shows only its top band (x 40–1418, y 0–520): phosphoribulokinase with 3 ATP, Rubisco with 3 CO₂, PGA kinase and GAP dehydrogenase with 6 ATP and 6 NADPH.

`photos/cb-lollipop-lbl.jpg`: the "lollipop" apparatus, Berkeley Lab photo by Robert M. Couto, colorised by LBNL (LBNL Biosciences, "Calvin cycle continued", https://biosciences.lbl.gov/calvin-cycle-continued/; board image i).

- Licence: © The Regents of the University of California; lecture use with credit.
- Processing: saturation × 0.62, contrast × 1.05, blended 10 % toward the paper colour (243, 238, 226), so the colour photo sits on the Bristol paper. Not cropped (1274 × 884).
- Used: C2 v2.

## Earlier crops reused (see SOURCES-L2a.md)

- `photos/c2-5s.png`, `photos/c2-30s.png`: Calvin M (1961) Nobel lecture, Figs 6 and 5, © The Nobel Foundation 1961, whole scans with label pills and coloured rings beside or over them (C1 v8; C2 v1, v2, v8).
- `photos/c3-light.png`: Calvin 1961, Fig. 15 (J. A. Bassham's light–dark transient in *Chlorella*), whole scan (C3 v1).
- `photos/c2-goodsell.jpg`: D. S. Goodsell, PDB-101 Molecule of the Month 11, CC BY 4.0; C2 v4, v6, v7 show only the spinach L₈S₈ (window x 25–855, y 25–760).
- `photos/c4-graf.jpg`: Graf et al. 2010, PNAS 107: 9458, Fig. 1A, © NAS (C4 v1). The panel letter is hidden by a white box inside the multiplied image.
- `photos/c4-streb.jpg`: Streb & Zeeman 2012, *The Arabidopsis Book* 10: e0160, Fig. 4 C and G, © ASPB (C4 v3, v4), shown below the panel letters. The scale bars are **1 µm** (figure caption, read 28 Oct 2026 in PMC3527087).

## Redrawn data (values read off the published figures; `figs/cb-common.ts`)

- `GRAF_CTRL`, `GRAF_EARLY`: Graf A, Schlereth A, Stitt M, Smith AM (2010) Circadian control of carbohydrate availability for growth in *Arabidopsis* plants at night. *PNAS* 107: 9458–9463, https://doi.org/10.1073/pnas.0914299107, **Fig. 1A**: rosette starch (mg g⁻¹ fresh weight) vs hours after dawn, 12 h light/12 h dark, and with the night begun after 8 h. Read from the board file at 2× (± 0.1 mg g⁻¹, ± 0.2 h). Used in C4 v2 and v4.
- `FIG15_PGA`, `FIG15_RUBP`: Calvin 1961 Nobel lecture **Fig. 15**, ¹⁴C in 3-PGA and RuBP (counts min⁻¹) of *Chlorella*, 0–700 s, light off at 400 s. Read from the scan (± 400 counts min⁻¹, ± 3 s). Used in C3 v2 and v5.
- Leaf nitrogen bars (C2 v5, v6): Evans JR, Clarke VC (2019) The nitrogen cost of photosynthesis. *J Exp Bot* 70: 7–15, https://doi.org/10.1093/jxb/ery366 (full text): Rubisco ≈ 40 % of soluble protein and ≈ 20 % of leaf nitrogen; chloroplasts ≈ 75 % of leaf nitrogen in mature C₃ leaves (so ≈ 55 % for the rest of the chloroplast, my subtraction).
- Turnover number (C2 text, v4): Bar-On YM, Milo R (2019) The global mass and average rate of rubisco. *PNAS* 116: 4738–4743, https://doi.org/10.1073/pnas.1816654116 (full text): characteristic k_cat of terrestrial plants ≈ 3 s⁻¹ at 25 °C.

## Drawn schematics

The wheel of the cycle (`cycleWheel` in `figs/cb-common.ts`) and the carbon-square, chloroplast and cell drawings are our own, after the standard per-3-CO₂ bookkeeping shown in Sharkey 2019 Fig. 3 and Michelet et al. 2013 Fig. 1. The triose phosphate/phosphate exchange (C4 v5, v8) follows Sharkey 2024, *Plant Physiol* 195: 67–78, https://doi.org/10.1093/plphys/kiad601, Fig. 1 (CC BY-NC-ND, so redrawn in our own form, not copied).
