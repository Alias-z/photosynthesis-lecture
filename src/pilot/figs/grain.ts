// A wheat grain and a slice of bread as glyphs in the 7m1 look (flat colour, dark outline; lecturer, 28 Oct 2026: "make the
// CO₂ turn into bread"). Physically: leaf starch is a night store; bread starch is made in the grain's endosperm from
// sucrose that the leaf exports. Used by slide C0's variant c and the 'bridge' animation's "To bread" beat.
import './grain.css';
import './cell-schema.css';

const f = (v: number): string => (Math.round(v * 100) / 100).toString();
/** Starch granules inside the grain, in grain units (centre, half-axes). */
export const GRANULES: Array<[number, number, number, number]> = [[-18, -6, 7, 5], [-4, -10, 6, 4.5], [10, -7, 7, 5], [22, 2, 6, 4.5], [-14, 8, 6.5, 4.5], [2, 6, 7, 5], [16, 12, 5.5, 4]];
/** A wheat grain (about 74 × 50 at k = 1) centred on (x, y): body, crease, the brush at its tip; `fill` granules shown
 *  (each in its own group, keyed `${key}-g<i>` when `key` is given, for an animation to fade in). */
export function grainG(x: number, y: number, k = 1, fill = GRANULES.length, key = ''): string {
  const g = GRANULES.map(([gx, gy, rx, ry], i) => `<g${key ? ` data-k="${key}-g${i}"` : ''}${i < fill ? '' : ' opacity="0"'}><ellipse class="grn-starch" cx="${gx}" cy="${gy}" rx="${rx}" ry="${ry}"/></g>`).join('');
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})"><path class="grn-body" d="M-36,0C-36,-18 -16,-25 2,-25C22,-25 36,-14 36,0C36,14 22,25 2,25C-16,25 -36,18 -36,0Z"/>
    ${g}<path class="grn-crease" d="M-26,1C-8,-3 12,-3 28,2"/><path class="grn-hair" d="M35,-6l8,-6M36,0l9,0M35,6l8,6"/></g>`;
}
/** A slice of bread (about 86 × 80 at k = 1) centred on (x, y): crust, crumb, a few pores. */
export function breadG(x: number, y: number, k = 1): string {
  const out = 'M-34,36V-6C-48,-10 -48,-40 -24,-40C-14,-52 14,-52 24,-40C48,-40 48,-10 34,-6V36Z';
  const inn = 'M-27,29V-10C-38,-14 -38,-33 -21,-33C-12,-44 12,-44 21,-33C38,-33 38,-14 27,-10V29Z';
  const pores: Array<[number, number, number, number]> = [[-12, -18, 4, 3], [8, -24, 3.5, 2.5], [14, -4, 4, 3], [-6, 4, 3, 2.2], [-16, 16, 3.5, 2.5], [10, 18, 4, 3]];
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})"><path class="brd-crust" d="${out}"/><path class="brd-crumb" d="${inn}"/>
    ${pores.map(([px, py, rx, ry]) => `<ellipse class="brd-pore" cx="${px}" cy="${py}" rx="${rx}" ry="${ry}"/>`).join('')}</g>`;
}
