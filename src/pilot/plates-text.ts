// Inline helpers for page text (lead and points), which is set as HTML.

/** A reaction arrow with its condition written over it, as in 6 CO₂ + 6 H₂O –light→ C₆H₁₂O₆ + 6 O₂. */
export const rxn = (over: string): string => `<span class="rxn"><span class="rxn-over">${over}</span><span class="rxn-arrow"></span></span>`;
