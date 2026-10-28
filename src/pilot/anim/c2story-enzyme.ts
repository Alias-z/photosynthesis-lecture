// RuBisCO itself, the third factor of the C2 story v3 (lecturer, 29 Oct 2026): today's RuBisCOs differ in their CO₂
// preference over O₂ (specificity factor S, at 25 °C, from dissolved CO₂ and O₂) and in their carboxylation rate per active
// site (kcat). Checked values (fact table: research/redo-2026-10-29/C2STORY_V3_FACTS.md), all from one compilation at
// 25 °C, Tcherkez et al. 2006 PNAS Table 1: Synechococcus PCC 6301, Chlamydomonas reinhardtii, tobacco, the red alga
// Griffithsia monilis. Green-algal kcat (5.8) is a 30 °C value adjusted to 25 °C: show speeds as bars, never as numbers.
// Red algae: many have a CO₂-concentrating mechanism; Griffithsia, the one shown, is not known to (ccm false for it only).
//
// The readout uses S only as a ratio to the land-plant enzyme behind the deck's Γ* (tobacco, Bernacchi et al. 2001; S_PLANT
// is tobacco's in vitro S, on the same scale as the other 3); exact at 25 °C only:
// oxygenations per 100 carboxylations scale as 1/S (Γ* = 0.5 · O / S), so an enzyme with half the plant S takes O₂
// twice as often in the same air, at the same temperature.
import { oxPer100 } from './c2story-model';

export interface Enzyme {
  k: 'cyano' | 'green' | 'plant' | 'red';
  /** Who carries it, as shown on screen. */
  name: string;
  /** Specificity factor S (CO₂ over O₂), 25 °C. */
  s: number;
  /** Carboxylation rate per active site (s⁻¹), 25 °C. */
  kcat: number;
  /** Concentrates CO₂ around RuBisCO (carboxysome, pyrenoid). */
  ccm: boolean;
}

export const ENZYMES: Enzyme[] = [
  { k: 'cyano', name: 'cyanobacteria', s: 43, kcat: 11.6, ccm: true },
  { k: 'green', name: 'green algae', s: 61, kcat: 5.8, ccm: true },
  { k: 'plant', name: 'land plants', s: 82, kcat: 3.4, ccm: false },
  { k: 'red', name: 'a red alga (Griffithsia)', s: 167, kcat: 2.6, ccm: false },
];
/** The land-plant enzyme behind the deck's Γ* (tobacco, in vitro S). */
export const S_PLANT = 82;
export const enzyme = (k: Enzyme['k']): Enzyme => ENZYMES.find(e => e.k === k) as Enzyme;
/** Oxygenations per 100 carboxylations for an enzyme of specificity s, in air (ca ppm, o2 %) at leaf temperature t. */
export const oxPer100S = (s: number, t: number, ca: number, o2?: number, k?: number): number => oxPer100(t, ca, o2, k) * (S_PLANT / s);
