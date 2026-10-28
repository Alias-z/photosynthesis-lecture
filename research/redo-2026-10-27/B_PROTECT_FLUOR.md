# Block B redo: fates, photoprotection, fluorescence (slides 12–14)

Claude, 27 Oct 2026. The plan follows the lecturer's approved order and was drawn up from scratch, not from `l12`–`l15`. The light-response curve has moved to lecture 2.

**Files**
- Figures: `scratchpad/redo/B-protect/`
- Contact sheet: `scratchpad/redo/B-protect/sheet.png` (tile numbers #1–#20 are used below)
- Scratchpad base: `/private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/f6794fc7-2bfb-4414-b287-6cd85fab7db3/scratchpad/`

**Evidence levels**
- A: full text, or the publisher page, read today.
- B: abstract read today.
- P: from the 26 Oct review (`research/review-2026-10-26/D_fates_protection_fluorescence.md`), with the level it had there.
- F: value read off a figure by eye.

**Earlier block.** The reaction-centre slides state PSII quantum efficiency (0.84–0.91). This block does not repeat that number. Slide 14 says only that Fv/Fm measures it.

---

## 1. Slides

| # | Topic | Take-home: one sentence, numbers sourced | Real graph or image: paper, figure, licence, local file | Illustration: what to redraw plainly, and from which source | Latest research (2017+) |
|---|---|---|---|---|---|
| **12** | Fates of an excitation: competing rates; yields add to 1; triplet → singlet O₂ | **The exits of an excitation compete by rate, so their yields add to 1; an open PSII traps the excitation within ≈ 0.3 ns, before fluorescence or heat can act (≈ 2 ns lifetime when PSII is closed); a lingering excitation can become a triplet that makes singlet oxygen (¹O₂), which carotenoids prevent in the antenna but not at P680.** <br>Sources:<br>– 0.3–0.4 ns average trapping, open centres in thylakoids: van Amerongen & Croce 2013, Photosynth Res, [10.1007/s11120-013-9824-3](https://doi.org/10.1007/s11120-013-9824-3) (P-A).<br>– ≈ 2 ns at Fm: Belgio et al. 2012, Biophys J, [10.1016/j.bpj.2012.05.004](https://doi.org/10.1016/j.bpj.2012.05.004) (P-B).<br>– Carotenoids quench > 95 % of antenna triplets (van Amerongen & Croce 2013). β-carotenes cannot quench ³P680 directly: Telfer 2014, Plant Cell Physiol, [10.1093/pcp/pcu040](https://doi.org/10.1093/pcp/pcu040) (P-A). | **#1** Porcar-Castell et al. 2021, *Nature Plants* 7:998, **Fig. 1**: absorbed light → photochemistry, heat (NPQ, non-photochemical quenching), fluorescence, with the leaf emission spectrum. © Springer Nature, not open access; lecture use with credit. File `porcarcastell2021_fig1_fates_to_SIF.png`. The full figure is dense: crop the leaf part (absorptance, partition arrows, red emission). <br>No real data figure of the lifetimes was downloaded. Candidate: the decay curves in Belgio 2012 (not checked). | **#2** A Jablonski diagram with exciton transfer from LHCII (light-harvesting complex II) to P680 and the three exits, each labelled with its time scale. Logic after Rosenqvist, slide 11. Copying her slide needs her permission; a plain redraw credited "after E. Rosenqvist" does not. <br>Add the side branch ¹Chl\* → ³Chl\* → ³O₂ → ¹O₂, after her slide 13. Time scales from van Amerongen & Croce 2013 and Telfer 2014. <br>No yield value for triplet formation: published values disagree (P). | ¹O₂ is also a signal. The chloroplast protein EXECUTER1 senses ¹O₂ by oxidation of Trp643; the envelope protein TOC33 relays the signal to the nucleus. Source: *Mol Plant* 2025, [10.1016/j.molp.2025.08.013](https://doi.org/10.1016/j.molp.2025.08.013) (B). <br>Classic anchor: ¹O₂ is the main reactive oxygen species in photo-oxidative damage. Triantaphylidès et al. 2008, *Plant Physiol* 148:960, [10.1104/pp.108.125690](https://doi.org/10.1104/pp.108.125690) (title, Crossref). |
| **13** | Photoprotection and repair: lumen pH, PsbS, xanthophyll cycle, D1 repair; field evidence, positive and negative | **In excess light the acidic lumen activates PsbS and the violaxanthin → zeaxanthin cycle to dissipate excitation as heat, and PSII damage, proportional to light, is repaired by replacing D1; NPQ relaxes slowly in shade, and speeding it raised field yield in tobacco (+14–20 % dry weight) and soybean (up to +33 % seed in 2020, no significant gain in 2021) but impaired growth in Arabidopsis and rice.** <br>Sources:<br>– PsbS needed for NPQ: Li et al. 2000, *Nature* 403:391, [10.1038/35000131](https://doi.org/10.1038/35000131) (A, abstract and Fig. 1).<br>– Damage rate ∝ light from 6.5 to 1500 µmol m⁻² s⁻¹ (pumpkin, lincomycin): Tyystjärvi & Aro 1996, *PNAS* 93:2213 (A).<br>– Tobacco +14–20 %: Kromdijk et al. 2016, *Science* 354:857, author manuscript (A).<br>– Soybean +33 % in 2020, none in 2021: De Souza et al. 2022, *Science* 377:851 (A).<br>– Arabidopsis impaired: Garcia-Molina & Leister 2020, *Nat Plants*, [10.1038/s41477-019-0572-z](https://doi.org/10.1038/s41477-019-0572-z) (B).<br>– Rice impaired: Zheng et al. 2026, *PCE*, [10.1111/pce.70245](https://doi.org/10.1111/pce.70245) (B). | **#8** Li et al. 2000, *Nature*, **Fig. 1**, after 5 min at 1250 µmol m⁻² s⁻¹ (F):<br>– (a) fluorescence of wild type vs *npq4* (no PsbS);<br>– (b) NPQ ≈ 2.4 in wild type, ≈ 0.8 in *npq1* (no zeaxanthin), ≈ 0.5 in *npq4*;<br>– (c) NPQ image, with PsbS restoring it.<br>© Macmillan; lecture use with credit. File `li2000_fig1_npq4_PsbS.jpg`.<br><br>**#10** Tyystjärvi & Aro 1996, *PNAS*, **Fig. 2A**: damage rate k<sub>PI</sub> vs light (photon flux density), a straight line. PNAS allows noncommercial educational use with citation. File `tyystjarvi_aro1996_fig2_kPI_vs_PPFD.png`, cropped from the PMC page scan (low resolution; take the PNAS PDF for the final version).<br><br>**#13 / #14** De Souza et al. 2022, *Science*:<br>– **Fig. 2A–C**: NPQ relaxation; time constants 37–67 % shorter in VPZ lines, 2021 (A). VPZ lines over-express VDE (violaxanthin de-epoxidase), PsbS and ZEP (zeaxanthin epoxidase).<br>– **Fig. 1B**: seed yield, 2020.<br>© AAAS; the author manuscript is CC BY 4.0 (HHMI policy). Files `desouza2022_fig2_NPQ_relax.jpg`, `desouza2022_fig1_soy_yield.jpg`.<br><br>**Kromdijk 2016, Fig. 5** (field photo and dry weight): **not downloaded**, because science.org showed a Cloudflare check. Get it by hand.<br><br>**#11** Why slow relaxation costs CO₂ uptake: Kaiser et al. 2018, *Plant Physiol* 176:977, **Fig. 1**. Sunflecks logged at 1 s; between sunflecks, light under the canopy is 2.4 % (mustard) and 3.7 % (wheat) of the light above (A). Licence: [OPEN] article; repository copy CC BY-NC-ND. File `kaiser2018_fig1_sunflecks.jpg` (464 px wide). | Redraw one plain pathway: excess light → ΔpH (lumen pH ≈ 5 vs ≈ 7) → PsbS protonated, plus VDE making violaxanthin → antheraxanthin → zeaxanthin → antenna quenches; ZEP reverses this in the stroma. Canonical sources:<br>– Wilhelm & Selmar 2011, *J Plant Physiol* 168:79–87 (Rosenqvist slides 27–29; DOI not verified);<br>– Murchie & Niyogi 2011, *Plant Physiol* 155:86, **Fig. 2** (**#9**, `murchie_niyogi2011_fig2_thylakoid_NPQ.jpg`, © ASPB).<br><br>Redraw the D1 repair cycle as four steps: damage → D1 degraded → new D1 inserted → PSII reassembled. Source: Komenda et al. 2024, *Plant Cell*, [10.1093/plcell/koae082](https://doi.org/10.1093/plcell/koae082); figure number to confirm. | Nicol et al. 2026, *Nat Commun*, [10.1038/s41467-026-74992-z](https://doi.org/10.1038/s41467-026-74992-z) (B): > 70 % of NPQ occurs in LHCII, < 10 % in the minor antenna, and the rest at the PSII core. <br>Neutral or negative VPZ cases:<br>– Singh et al. 2026, *PCE*, [10.1111/pce.70608](https://doi.org/10.1111/pce.70608) (B): the soybean line VPZ-34A used light more efficiently but gained no seed or biomass at ambient or elevated CO₂.<br>– Lehretz et al. 2022, *JIPB*, [10.1111/jipb.13320](https://doi.org/10.1111/jipb.13320) (B, title): potato tuber yield fell in fluctuating light.<br>– Arabidopsis 2020 and rice 2026 (see take-home). |
| **14** | Chlorophyll fluorescence as a tool: saturating pulse, Fo/Fm/Fm′, Fv/Fm, ΦII, NPQ; ΦII + ΦNPQ + ΦNO = 1; scale-up to SIF | **Because fluorescence competes with the other exits, a saturating pulse that closes every PSII turns four fluorescence levels into yields: Fv/Fm = (Fm − Fo)/Fm ≈ 0.83 in healthy dark-adapted leaves; in light, ΦII = (Fm′ − Fs)/Fm′ and NPQ = Fm/Fm′ − 1, and ΦII + ΦNPQ + ΦNO = 1 splits the absorbed light; from orbit the same glow is read as solar-induced fluorescence (SIF), mapped by FLEX since its launch on 15 Sep 2026.** <br>Sources:<br>– Fv/Fm 0.832 ± 0.004 across 37 C₃ species: Björkman & Demmig 1987, *Planta* 170:489, [10.1007/BF00402983](https://doi.org/10.1007/BF00402983) (B). Measured at 77 K, 692 nm; a room-temperature PAM gives ≈ 0.83 in unstressed leaves (Rosenqvist slide 17).<br>– Formulas: Kalaji et al. 2014, *Photosynth Res* 122:121 (A, Fig. 4 caption).<br>– Yield partition: Kramer et al. 2004, [10.1023/B:PRES.0000015391.99477.0d](https://doi.org/10.1023/B:PRES.0000015391.99477.0d), and Hendrickson et al. 2004, [10.1023/B:PRES.0000040446.87305.f4](https://doi.org/10.1023/B:PRES.0000040446.87305.f4) (Crossref; formulas as on Rosenqvist slide 41).<br>– FLEX launch: ESA, 15 Sep 2026 (A). | **#3** Kalaji et al. 2014, *Photosynth Res*, **Fig. 4**: a real PAM trace (PAM-2100) with Fo, Fm, then actinic light at 250 µmol m⁻² s⁻¹ and pulses 1 min apart; qP, ΦII and NPQ are overlaid. CC BY. File `kalaji2014_fig4_PAM_trace_full.png`; only 387 px wide, so redraw the axes for projection.<br><br>**#15** Guanter et al. 2014, *PNAS* 111:E1327, **Fig. 1**: global maximum monthly SIF at 740 nm, 2009. The US Corn Belt shows the highest SIF of all land ecosystems (A, caption). PNAS allows educational use with citation. File `guanter2014_fig1_global_SIF.jpg`.<br><br>**#16** Porcar-Castell et al. 2021, **Fig. 3**: SIF images from a tree to a landscape. © Springer Nature. File `porcarcastell2021_fig3_SIF_imaging.png`.<br><br>**#17** ESA photo of the Vega-C VV30 launch carrying FLEX. ESA Standard Licence; credit "ESA-CNES-AVIO/Optique vidéo du CSG–J. Georget". File `esa2026_vegac_FLEX_launch.jpg`.<br><br>Imaging example: Bown et al. 2002, *Plant Physiol* 129:1430: budworm footsteps show up in fluorescence images (**#20**, placeholder taken from Rosenqvist slide 69). The original was not downloaded: PMC's PDF sits behind a JavaScript check, and OUP behind Cloudflare. | Redraw **dot grids of the PSII population** for Fo, Fm, Fm′ and Fs, each dot open, closed or quenching. Concept: Rosenqvist slide 34 (**#4**), her own graphic. Redraw plainly with credit, or ask her before copying.<br><br>Redraw the **PAM principle**: a weak pulsed measuring beam; the detector registers only the pulsed signal, so actinic light and sunlight are ignored. Sources: Schreiber, Schliwa & Bilger 1986, *Photosynth Res* 10:51, [10.1007/BF00024185](https://doi.org/10.1007/BF00024185) (figure to confirm); Rosenqvist slides 20–21.<br><br>Equation strip: ΦII = 1 − Fs/Fm′; ΦNPQ = Fs/Fm′ − Fs/Fm; ΦNO = Fs/Fm. ΦNO lumps fluorescence and basal heat loss (Hendrickson 2004). | Tang et al. 2026, *Nat Commun*, [10.1038/s41467-026-70076-0](https://doi.org/10.1038/s41467-026-70076-0) (B): fluorescence efficiency (SIF divided by absorbed light) responds to drought within ≈ 3 days, while canopy structure changes after ≈ 12 days. <br>FLEX (A, ESA, read 27 Oct 2026):<br>– lifted off on Vega-C VV30 with Sentinel-3C on 15 Sep 2026, 03:21 (14 Sep, 22:21 local time);<br>– ESA calls it its "first satellite designed specifically to measure photosynthetic activity from space";<br>– the FLEX page lists no first-light or data news. Do not promise data. |

**Optional lead for slide 13, check first.** Murchie & Niyogi 2011, **Fig. 1A** (**#5**): absorbed light vs light used, with the excess between them. This graph is a light-response curve, which now sits in lecture 2. Use it only if lecture 2 does not show the same graph.

---

## 2. Logic and where each key fact lives

**Logic (Rosenqvist's arc, compressed into 3 slides).**
- **12** sets up the competition: exits, rates, sum to 1, triplet danger (her slides 11–14).
- **13** regulates the heat exit and repairs what still breaks (her 25–30, plus D1). It ends with field cost and field evidence.
- **14** shows how one exit, fluorescence, reads all the others: closed vs open PSII, the pulse, the yields (her 15–41). It ends at the satellite scale.

**One known tension.** Slide 13 shows NPQ data before slide 14 defines NPQ. Present the Li 2000 traces on slide 13 in the slide-12 sense: "less fluorescence = more heat". Slide 14 then formalises NPQ.

| Fact | Lives on | Not repeated on |
|---|---|---|
| PSII quantum efficiency 0.84–0.91 | earlier block (reaction centre) | 12, 14 (14 says only "Fv/Fm measures it") |
| Exits compete by rate; yields add to 1 (principle) | 12 | 14 names the three measured yields, not the principle |
| Trapping ≈ 0.3 ns vs ≈ 2 ns closed | 12 | — |
| Triplet → ¹O₂; carotenoids fail at P680 | 12 | 13 says only "damage" |
| Lumen pH → PsbS + zeaxanthin → heat (qE, the fast pH-driven part of NPQ) | 13 | 14 (formula only) |
| Zeaxanthin part relaxes in 10–15 min (Nilkens 2010, P-B; Kromdijk 2016 text, A) | 13 | — |
| D1 damage ∝ light; repair continuous | 13 | — |
| VPZ field results, positive and negative | 13 | — |
| Sunflecks: 2.4–3.7 % shade with flecks lasting seconds | 13 | — |
| Fv/Fm ≈ 0.83 | 14 | 12 |
| ΦII, NPQ formulas; ΦII + ΦNPQ + ΦNO = 1 | 14 | — |
| Leaves re-emit 0.5–3 % of absorbed light as fluorescence (Porcar-Castell 2014, P-A) | 14 | 12 |
| SIF from orbit; FLEX | 14 | — |

---

## 3. Figure register

Licence notes are as recorded on the source pages today.

| # (sheet) | File | Source | Licence | Use |
|---|---|---|---|---|
| 1 | porcarcastell2021_fig1_fates_to_SIF.png | Porcar-Castell 2021 Nat Plants Fig. 1 | © Springer Nature | 12 |
| 2 | eva_s11_jablonski_PERMISSION.png | Rosenqvist slide 11 | **Eva's permission** | 12, logic |
| 3 | kalaji2014_fig4_PAM_trace_full.png | Kalaji 2014 Photosynth Res Fig. 4 | CC BY | 14 |
| 4 | eva_s34_PSII_dot_grid_PERMISSION.png | Rosenqvist slide 34 | **Eva's permission** | 14 redraw |
| 5 | murchie_niyogi2011_fig1_energy_balance.jpg | Murchie & Niyogi 2011 Fig. 1 | © ASPB | optional (lecture 2 overlap) |
| 6 | eva_s25_energy_balance_PERMISSION.png | Rosenqvist slide 25 (no source given) | **Eva's permission** | not used |
| 7 | eva_s56_rodriguez-calcerrada2008_yields.png | Rodríguez-Calcerrada et al. 2008 Tree Physiol 28:761 (Rosenqvist is a co-author) | © OUP; original not downloaded (OUP Cloudflare; CSIC repository has metadata only) | lecture 2 or 14 option: ΦII/ΦNPQ/ΦNO vs light |
| 8 | li2000_fig1_npq4_PsbS.jpg | Li 2000 Nature Fig. 1 | © Macmillan | 13 |
| 9 | murchie_niyogi2011_fig2_thylakoid_NPQ.jpg | Murchie & Niyogi 2011 Fig. 2 | © ASPB | 13 redraw source |
| 10 | tyystjarvi_aro1996_fig2_kPI_vs_PPFD.png | Tyystjärvi & Aro 1996 PNAS Fig. 2 | PNAS educational use | 13 |
| 11 | kaiser2018_fig1_sunflecks.jpg | Kaiser 2018 Plant Physiol Fig. 1 | [OPEN]; repository CC BY-NC-ND | 13 |
| 12 | eva_s50_PPFD_day_2018_PERMISSION.png | Rosenqvist slide 50 (her own 2018 data) | **Eva's permission** | alternative to #11 |
| 13 | desouza2022_fig2_NPQ_relax.jpg | De Souza 2022 Science Fig. 2 | © AAAS; author manuscript CC BY 4.0 | 13 |
| 14 | desouza2022_fig1_soy_yield.jpg | De Souza 2022 Science Fig. 1 | as #13 | 13 |
| 15 | guanter2014_fig1_global_SIF.jpg | Guanter 2014 PNAS Fig. 1 | PNAS educational use | 14 |
| 16 | porcarcastell2021_fig3_SIF_imaging.png | Porcar-Castell 2021 Fig. 3 | © Springer Nature | 14 |
| 17 | esa2026_vegac_FLEX_launch.jpg | ESA, 15 Sep 2026 | ESA Standard Licence | 14 |
| 18 | esa2019_two_peak_fluorescence.png | ESA 2019 "Two-peak fluorescence" | licence not captured | **avoid**: schematic, and the ESA caption says plants "use about 82 %" of absorbed light "for growth", which is wrong |
| 19 | eva_s66_ficus_freezing_PERMISSION.png | Rosenqvist slide 66 (no citation) | **Eva's permission** | 14 imaging option |
| 20 | eva_s69_bown2002_budworm.png | Bown 2002 Plant Physiol, via Rosenqvist slide 69 | original © ASPB; get it by hand | 14 imaging option |

**Rosenqvist material that needs her permission:**
- slides 11, 13, 25, 34 (her diagrams);
- slide 50 (her own PPFD data);
- slide 51 (Dew Sharma, unpublished);
- slides 58–63 and 67–68 (marked unpublished);
- slide 66 (no citation, presumably hers).

**Blocked; I did not work around any of these:**
- academic.oup.com (Cloudflare): Murchie & Lawson 2013, Porcar-Castell 2014, Rodríguez-Calcerrada 2008.
- science.org (Cloudflare) for Kromdijk 2016. The De Souza page loaded.
- Kromdijk PDF copies: OSTI (403) and eScholarship (403). The Lancaster author manuscript downloaded, but it has no figures.
- Bown 2002: the PMC PDF sits behind a JavaScript download check; the Europe PMC render returned 403.
- digital.csic.es: a bot check, which then showed metadata only.
- Björkman & Demmig 1987: the Springer PDF came back as HTML to curl. It needs a browser session on the ETH network.

---

## 4. Current slides

Not used as a basis, per the lecturer. One item carries over as a rule: the old slide 12 repeated "84–91 %", which belongs to the earlier block only.

---

## 5. Hooks (one line each)

- **1931:** Kautsky & Hirsch watched a dark-adapted leaf's red glow rise and then fall by eye under a UV lamp. They read it correctly as competition with photosynthesis. Sources: [10.1007/BF01516164](https://doi.org/10.1007/BF01516164); Schreiber & Lichtenthaler 2025 (P-A).
- **1931 → 1964:** In 1931 Kautsky proposed a diffusible "active" oxygen. It was doubted for decades until Foote & Wexler 1964 confirmed singlet oxygen (P).
- **1957–62:** Sapozhnikov (1957) and Yamamoto (1962) found the light-driven loss of violaxanthin, the xanthophyll cycle (P).
- **1986:** the PAM fluorometer (Schreiber et al.) made fluorescence measurable in daylight. One year later Demmig et al. 1987 linked zeaxanthin to quenching (P-B).
- **2000:** Li et al. found PsbS through a mutant (*npq4*) that cannot quench, and showed its NPQ image (Fig. 1c, A).
- **2016 / 2022:** speeding NPQ relaxation raised field biomass in tobacco by 14–20 % and soybean seed yield by up to 33 % in one of two years (A). Since then, Arabidopsis, potato and rice gained nothing or lost growth (B).
- **2024:** a GWAS of NPQ kinetics in sorghum found NYE1, the stay-green gene behind one of Mendel's pea traits (Sahay et al. 2024, Plant J, P-B).
- **2026:** more than 70 % of NPQ occurs in LHCII (Nicol et al., B).
- **2026:** fluorescence from orbit flags drought within ≈ 3 days (Tang et al., B).
- **15 Sep 2026:** FLEX launched (A).
