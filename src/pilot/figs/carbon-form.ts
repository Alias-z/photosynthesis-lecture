// Carbon form (lecture 2, 28 Oct 2026): a metabolite is drawn so that its carbon count can be read off. One ball per
// carbon (the deck's C ball, #d9633a, letter C), one orange disc per phosphate (tag-pi, letter P), one blue ball per
// amino nitrogen (as rf-kit beads, letter N), in a row on a thin bond. Colours are inline so that the glyph reads the
// same in figures, in the rf schema and in the animations. Letters are at least 11 px.
//   RuBP P–C–C–C–C–C–P · 3-PGA C–C–C–P · triose phosphate C–C–C–P · 2-phosphoglycolate C–C–P · glycolate C–C ·
//   glyoxylate C–C · glycine C–C–N · serine C–C–C–N · glycerate C–C–C · PEP C–C–C–P · pyruvate C–C–C · C₄ acid C–C–C–C ·
//   hexose 6 C · sucrose 12 C (two rings of 6 drawn as two rows of 6).

export type Atom = 'C' | 'P' | 'N';
/** Row formulas, left to right. */
export const FORMULA = {
  RuBP: 'PCCCCCP', PGA: 'CCCP', TP: 'CCCP', PG2: 'CCP', glycolate: 'CC', glyoxylate: 'CC', glycine: 'CCN', serine: 'CCCN',
  glycerate: 'CCC', PEP: 'CCCP', pyruvate: 'CCC', C4acid: 'CCCC', hexose: 'CCCCCC',
} as const;
export type Metab = keyof typeof FORMULA;

const STYLE: Record<Atom, { fill: string; stroke: string; ink: string }> = {
  C: { fill: '#d9633a', stroke: '#9b3e1e', ink: '#fff' },
  P: { fill: '#f3a65f', stroke: '#c7742b', ink: '#2b2a27' },
  N: { fill: '#9dbbdb', stroke: '#3f6f99', ink: '#1f3550' },
};
const FONT = 'font-family:Inter,&quot;Helvetica Neue&quot;,Arial,sans-serif';
const f1 = (v: number): string => (Math.round(v * 10) / 10).toString();
/** Centre-to-centre step of the balls in a row of radius r. */
export const step = (r: number): number => r * 2.15;
/** Width of a row of n balls of radius r. */
export const rowWidth = (n: number, r = 9): number => (n - 1) * step(r) + 2 * r;

/** One ball with its letter. `halo` rings it (amber: the carbon just fixed; rust: a carbon bound for photorespiration). */
export function atomBall(x: number, y: number, a: Atom, r = 9, halo?: 'new' | 'pr' | 'lost'): string {
  const s = STYLE[a], fs = Math.max(11, Math.min(15, r * 1.25));
  const h = halo ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r + 3.4)}" style="fill:${halo === 'new' ? '#f2b705' : halo === 'pr' ? '#c0502c' : '#6b6a64'};opacity:.38"/>` : '';
  return `${h}<circle class="cf-${a}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" style="fill:${s.fill};stroke:${s.stroke};stroke-width:1.3"/>`
    + `<text x="${f1(x)}" y="${f1(y + fs * 0.36)}" text-anchor="middle" style="${FONT};font-size:${f1(fs)}px;font-weight:700;fill:${s.ink}">${a}</text>`;
}

export interface RowOpts {
  r?: number;
  /** Where x sits on the row: its left end, its centre (default) or its right end. */
  anchor?: 'start' | 'middle' | 'end';
  /** Per-ball halos, one character per ball: 'n' new carbon, 'o' photorespiratory carbon, 'x' lost, '.' none. */
  halos?: string;
}
/** A row of atoms from a formula such as 'PCCCCCP', centred (by default) on (x, y), on a thin bond line. */
export function row(x: number, y: number, formula: string, o: RowOpts = {}): string {
  const r = o.r ?? 9, n = formula.length, w = rowWidth(n, r);
  const x0 = (o.anchor === 'start' ? x : o.anchor === 'end' ? x - w : x - w / 2) + r;
  const bond = n > 1 ? `<path d="M${f1(x0)},${f1(y)}H${f1(x0 + (n - 1) * step(r))}" style="stroke:#6b6a64;stroke-width:${f1(Math.max(1.6, r * 0.22))};fill:none"/>` : '';
  const hk = (i: number): 'new' | 'pr' | 'lost' | undefined => ({ n: 'new', o: 'pr', x: 'lost' } as const)[(o.halos ?? '')[i] as 'n' | 'o' | 'x'];
  return bond + [...formula].map((a, i) => atomBall(x0 + i * step(r), y, a as Atom, r, hk(i))).join('');
}
/** A named metabolite (see FORMULA) as its row. */
export const metab = (x: number, y: number, m: Metab, o: RowOpts = {}): string => row(x, y, FORMULA[m], o);
/** Width of a named metabolite's row. */
export const metabWidth = (m: Metab, r = 9): number => rowWidth(FORMULA[m].length, r);
