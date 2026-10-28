// Glyph helpers for the earlier lecture 2 figure modules (c05–c13, k01–k10, l15, c5), 28 Oct 2026: the deck's one glyph
// set (slide 7, variant 7m1). Gas paths (O₂, CO₂) are neutral grey, never blue or coloured by process.
let n = 0;
/** A grey gas arrow (O₂ or CO₂) along path d, with its own grey head; `extra` adds classes such as 'dashed'. */
export function gasAr(p: string, d: string, extra = ''): string {
  const id = `${p}-gas${n++}`;
  return `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path fill="#6b6a64" d="M0,0L10,5L0,10z"/></marker></defs>`
    + `<path class="ar${extra ? ` ${extra}` : ''}" style="stroke:#6b6a64" d="${d}" marker-end="url(#${id})"/>`;
}
/** A glyph whose carbon is the ¹⁴C isotope: the C ball turns purple (the deck's isotope colour, as ¹⁸O). */
export const iso14 = (glyph: string): string =>
  glyph.replace(/<circle class="atom atom-C"/g, '<circle class="atom atom-C" style="fill:#8e63c4;stroke:#5e3d8f"');
