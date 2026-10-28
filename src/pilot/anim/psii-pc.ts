// Photosystem II, staging pc: staging pb (the plastoquinone pool, two plastoquinols per O₂, the readout per O₂) with
// Ruben and Kamen's two flasks: ¹⁸O in the water or in the CO₂, only the water gives ¹⁸O₂ (lecturer, 28 Oct 2026).
// The story, the timing and the camera: psiim-common.ts.
import { PSIIPB } from './beats-psiip';
import { makeStaging } from './psiim-common';

export const STAGING = makeStaging({
  id: 'pc',
  name: 'PC · PQ pool, two flasks',
  note: 'As pb (plastoquinone pool, readout per O₂), with the two-flask card: H₂¹⁸O + CO₂ gives ¹⁸O₂, H₂O + C¹⁸O₂ gives ordinary O₂.',
  card: 'two',
  pq: 'pool',
  beats: PSIIPB,
});
