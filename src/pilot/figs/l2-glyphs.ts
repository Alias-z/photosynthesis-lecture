// Glyph helpers for the earlier lecture 2 figure modules (c05–c13, k01–k10, l15, c5), 28 Oct 2026: the deck's one glyph
// set (slide 7, variant 7m1). Gas paths (O₂, CO₂) are neutral grey, never blue or coloured by process.
let n = 0;
/** A grey gas arrow (O₂ or CO₂) along path d, with its own grey head; `extra` adds classes such as 'dashed'. */
export function gasAr(p: string, d: string, extra = ''): string {
  const id = `${p}-gas${n++}`;
  return `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path fill="#6b6a64" d="M0,0L10,5L0,10z"/></marker></defs>`
    + `<path class="ar${extra ? ` ${extra}` : ''}" style="stroke:#6b6a64" d="${d}" marker-end="url(#${id})"/>`;
}
/* ---------- isotopes: one look deck-wide (as anim/l2-glyphs.ts) ---------- */

/** The isotope purple, the same for ¹⁴C, ¹³C and ¹⁸O wherever an isotope experiment appears. */
export const ISO_FILL = '#8e63c4', ISO_STROKE = '#5e3d8f';
/** An isotope ball is drawn 1.2 × the atom's radius, so that its label fits inside at ≥ 11 px. */
const ISO_K = 1.2;
const f1 = (v: number): string => v.toFixed(1);
const isoLetter = (x: number, y: number, r: number, label: string): string => {
  const fs = Math.max(11, r * 1.05);
  return `<text class="atom-t atom-t-C" x="${f1(x)}" y="${f1(y + fs * 0.36)}" text-anchor="middle" style="font-family:Inter,&quot;Helvetica Neue&quot;,Arial,sans-serif;font-size:${f1(fs)}px;font-weight:700;fill:#fff">${label}</text>`;
};
/** One isotope atom at (x, y) for an atom of radius r: a purple ball 1.2 × larger with its label inside, e.g. '¹⁴C'. */
export const isoBall = (x: number, y: number, r: number, label = '¹⁴C'): string =>
  `<circle class="l2g-iso" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * ISO_K)}" style="fill:${ISO_FILL};stroke:${ISO_STROKE};stroke-width:1.4"/>${isoLetter(x, y, r, label)}`;
/** A molecule glyph (illus.ts `molecule()`, cb-common `co2g`) whose carbon is the isotope: the C ball becomes the purple
 *  isotope ball labelled `label` (default '¹⁴C'), drawn over the other balls; every letter is drawn after every ball, so
 *  no ball hides a letter. */
export const iso14 = (glyph: string, label = '¹⁴C'): string => {
  const balls = glyph.match(/<circle[^>]*\/>/g) ?? [], texts = glyph.match(/<text[^>]*>[^<]*<\/text>/g) ?? [];
  const num = (tag: string, a: string): number => Number(new RegExp(`\\s${a}="([-\\d.]+)"`).exec(tag)?.[1] ?? 0);
  const isC = (b: string): boolean => /class="atom atom-C"/.test(b);
  const cs = balls.filter(isC), rest = balls.filter(b => !isC(b));
  const isos = cs.map(b => `<circle class="l2g-iso" cx="${num(b, 'cx')}" cy="${num(b, 'cy')}" r="${f1(num(b, 'r') * ISO_K)}" style="fill:${ISO_FILL};stroke:${ISO_STROKE};stroke-width:1.4"/>`);
  const letters = texts.map(t => (/atom-t-C/.test(t) ? '' : t));
  const isoLetters = cs.map(b => isoLetter(num(b, 'cx'), num(b, 'cy'), num(b, 'r'), label));
  return rest.join('') + isos.join('') + letters.join('') + isoLetters.join('');
};
