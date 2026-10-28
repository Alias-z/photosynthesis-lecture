// Lecture 2 animations: the deck's one glyph set (research/redo-2026-10-28/GLYPH_BRIEF.md, lecturer, 28 Oct 2026), for
// the molecules the animation files draw themselves. Atoms are the shared balls (pilot.css `atom atom-O/C/H`, as
// illus.ts `molecule()` and figs/chain.ts glyph mode); an isotope is a purple ball carrying its own label (¹⁴C, ¹³C, ¹⁸O),
// the same purple wherever an isotope experiment appears. H⁺ is illus.ts `hplus()` (white disc ringed red); energy
// carriers are illus.ts `tag()`. Letters carry inline style so that they read the same inside and outside `.fig`.
// Every glyph is drawn round (x, y); pass 0, 0 for a glyph that is placed by a transform.
import { hplus, tag } from '../illus';

export { hplus, tag };

const f1 = (n: number): string => n.toFixed(1);
const FONT = 'font-family:Inter,&quot;Helvetica Neue&quot;,Arial,sans-serif';
/** The isotope purple (¹⁴C, ¹³C, ¹⁸O), ink for molecule names, grey for gas paths, red for H⁺, the e⁻ dot. */
export const ISO_FILL = '#8e63c4', ISO_STROKE = '#5e3d8f', INK = '#141413', GAS = '#6b6a64', H_RED = '#c2401f', E_DOT = '#2b2a27';

type El = 'O' | 'C' | 'H' | 'N';
/** An isotope ball is drawn a little larger, so that its label (e.g. '¹⁴C') fits inside at ≥ 11 px. */
const ISO_K = 1.2;
const circ = (x: number, y: number, el: El, r: number, iso?: string): string => iso
  ? `<circle class="l2g-iso" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * ISO_K)}" style="fill:${ISO_FILL};stroke:${ISO_STROKE};stroke-width:1.4"/>`
  : `<circle class="atom atom-${el}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
const letter = (x: number, y: number, el: El, r: number, iso?: string): string => {
  const fs = iso ? Math.max(11, r * 1.05) : Math.max(11, r * 1.15);
  const fill = iso || el === 'C' ? '#fff' : '#5a4a1a';
  return `<text class="atom-t atom-t-${el}" x="${f1(x)}" y="${f1(y + fs * 0.36)}" text-anchor="middle" style="${FONT};font-size:${f1(fs)}px;font-weight:700;fill:${fill}">${iso ?? el}</text>`;
};
/** One atom ball with its letter. `iso` makes it an isotope: a purple ball labelled e.g. '¹⁴C' (white letters). */
export const ball = (x: number, y: number, el: El, r = 11, iso?: string): string => circ(x, y, el, r, iso) + letter(x, y, el, r, iso);

/** A molecule as touching balls in a row ('OCO', 'OO', 'O'); `iso` = [index, label] marks one atom as the isotope.
 *  All balls first (the isotope on top), then all letters, so no ball hides a letter. */
export function mol(x: number, y: number, atoms: string, r = 11, iso?: [number, string]): string {
  const n = atoms.length, xs = [...atoms].map((_, i) => x + (i - (n - 1) / 2) * r * 1.55);
  const lab = (i: number): string | undefined => (iso && iso[0] === i ? iso[1] : undefined);
  const order = [...atoms].map((_, i) => i).sort((a, b) => Number(!!lab(a)) - Number(!!lab(b)));
  return order.map(i => circ(xs[i], y, atoms[i] as El, r, lab(i))).join('') + [...atoms].map((a, i) => letter(xs[i], y, a as El, r, lab(i))).join('');
}
/** CO₂ as O–C–O balls; `iso` labels the carbon as an isotope (e.g. '¹⁴C'), drawn purple. */
export const co2 = (x: number, y: number, r = 11, iso?: string): string => mol(x, y, 'OCO', r, iso ? [1, iso] : undefined);
/** O₂ as two touching O balls; `iso` labels both oxygens (e.g. '¹⁸O'), set a little apart so both labels read. */
export const o2 = (x: number, y: number, r = 11, iso?: string): string => iso
  ? circ(x - r * 1.1, y, 'O', r, iso) + circ(x + r * 1.1, y, 'O', r, iso) + letter(x - r * 1.1, y, 'O', r, iso) + letter(x + r * 1.1, y, 'O', r, iso)
  : mol(x, y, 'OO', r);
/** Water: one O ball with two small H balls below it (as illus.ts `water()`); `iso` labels its oxygen (e.g. '¹⁸O'). */
export const water = (x: number, y: number, r = 12, iso?: string): string => {
  const h = r * 0.58, dx = r, dy = r * 0.75;
  return `<circle class="atom atom-H" cx="${f1(x - dx)}" cy="${f1(y + dy)}" r="${f1(h)}"/><circle class="atom atom-H" cx="${f1(x + dx)}" cy="${f1(y + dy)}" r="${f1(h)}"/>${ball(x, y, 'O', r, iso)}`;
};
/** An electron: a dark dot. */
export const eDot = (x: number, y: number, r = 6): string => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" style="fill:${E_DOT}"/>`;
/** A molecule's name in ink, beside its glyph. */
export const name = (x: number, y: number, s: string, size = 20, anchor: 'start' | 'middle' | 'end' = 'start', weight = 600): string =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}" style="${FONT};font-size:${size}px;font-weight:${weight};fill:${INK}">${s}</text>`;
