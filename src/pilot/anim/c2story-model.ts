// The readout model of the C2 story (dk-c2story.ts), version 2 (brief research/redo-2026-10-29/C2STORY_V2_BRIEF.md).
// Every number in the corner panel comes from these 5 lines:
// - Γ*(T), the CO₂ compensation point without day respiration (ppm, at 20.95 % O₂): Bernacchi et al. 2001,
//   Γ* = exp(19.02 − 37.83 / (R·T_K)), R = 0.008314 kJ mol⁻¹ K⁻¹ (42.9 ppm at 25 °C, 70.4 ppm at 35 °C, + 5.2 % per K);
//   Γ* ∝ O₂, so it is scaled by O₂ / 20.95 % for other O₂ levels.
// - C꜀ = (200/427) × Cₐ (the deck's rule: 200 ppm in the chloroplast at 427 ppm in the air); a dry day lowers C꜀/Cₐ.
// - Oxygenations per 100 carboxylations = 100 × vₒ/v꜀ = 100 × 2Γ*/C꜀ (von Caemmerer & Farquhar 1981).
// - Net CO₂ fixed per 100 carboxylations = 100 − ½ × oxygenations (photorespiration releases 1 CO₂ per 2 oxygenations).
// - Leaf temperature = 25 °C + ΔGMST, the change in global mean surface temperature from 1850–1900 (a stated
//   simplification). CO₂ preference relative to 25 °C = Γ*(25 °C) / Γ*(T_leaf) (= the specificity S꜀/ₒ relative to
//   25 °C, since Γ* = 0.5 × O / S꜀/ₒ).

export const R = 0.008314;
export const CC_CA = 200 / 427;
export const O2_TODAY = 20.95;
/** Γ* (ppm) at leaf temperature t (°C) and O₂ (% of air). */
export const gammaStar = (t: number, o2 = O2_TODAY): number => Math.exp(19.02 - 37.83 / (R * (t + 273.15))) * (o2 / O2_TODAY);
/** Oxygenations per 100 carboxylations at leaf temperature t (°C), air CO₂ ca (ppm), O₂ (%), C꜀/Cₐ k. */
export const oxPer100 = (t: number, ca: number, o2 = O2_TODAY, k = CC_CA): number => (100 * 2 * gammaStar(t, o2)) / (k * ca);
/** Net CO₂ fixed per 100 carboxylations. */
export const netPer100 = (ox: number): number => 100 - ox / 2;
/** RuBisCO's preference for CO₂ over O₂ at leaf temperature t, relative to 25 °C. */
export const prefRel25 = (t: number): number => gammaStar(25) / gammaStar(t);
/** Leaf temperature (°C) from the change in global mean surface temperature. */
export const leafT = (dGmst: number): number => 25 + dGmst;
