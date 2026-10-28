// The CO₂ diffusion pathway, staging D: side by side, on two windows onto the slide's drawn path (C10 v2). Beat 1: both
// windows on the boundary layer; in the right one the wind blows and the layer thins, and its C_s bar rises above the left
// one's; beat 2: both windows glide to the stoma; water streams out of the left (open) one, and the right one's stomata
// close (thin arrows, Cᵢ ↓); beat 3: the windows give way to the whole slide figure with the mesophyll lit (as C10 v12)
// and the concentration readout; beat 4: the stomata close on the whole figure, Cᵢ and C_c fall, and the question.
// Scenes and controls: cp10-common.ts.
import { CP10_D } from './beats-cp';
import { beatClock, clipDefs, f1, FULL, lerp, LIT, litMix, mv, setters, tfStr, tw } from './cp-stage';
import { concCtl, concSvg, pathScene, RO_BARS, sceneCtl } from './cp10-common';
import type { Staging } from './types';

const P = 'cp10d';
const WIN = { w: 700, h: 467, y: 84, xl: 60, xr: 840 };
/** Each window's view box (figure units, 700 : 440): the boundary layer, then the stoma. */
const VB = { bl: [8, 132, 346, 231] as const, st: [140, 152, 346, 231] as const };
const RO = { x: 1286, y: 22 };
const TEND = [2.3, 2.4, 1.3, 2.2];

/** A window's two readout bars under it (stage units): Cₐ and C_s in beat 1, Cₐ and Cᵢ in beat 2. */
function rowsSvg(k: string, x: number, y: number): string {
  const sym = (s: string): string => `<tspan font-style="italic">C</tspan><tspan baseline-shift="sub" font-size="70%">${s}</tspan>`;
  return `<g data-k="${k}">
    <text class="cps-sym" x="${x}" y="${y + 8}">${sym('a')}</text><rect class="cps-bar-in" x="${x + 44}" y="${y - 12}" width="${f1(420 * 1.3)}" height="22" rx="3"/>
    <text class="cps-val" x="${x + 52 + 420 * 1.3}" y="${y + 7}">420</text>
    <text data-k="${k}-s" class="cps-sym" x="${x}" y="${y + 46}">${sym('s')}</text><text data-k="${k}-i" class="cps-sym" x="${x}" y="${y + 46}" opacity="0">${sym('i')}</text>
    <rect data-k="${k}-b" class="cp10-bar" x="${x + 44}" y="${y + 26}" width="0" height="22" rx="3"/>
    <text data-k="${k}-v" class="cps-val" x="0" y="${y + 45}"></text></g>`;
}

export const STAGING: Staging = {
  id: 'd',
  name: 'D · Side by side (still | wind, open | closed)',
  note: 'Two windows onto C10 v2: still air beside wind (the right boundary layer thins, C_s higher), then open beside closed stomata (water out, Cᵢ lower); then the whole figure, mesophyll lit, and the stomata close.',
  beats: CP10_D,
  svg: () => `${clipDefs(P)}
    ${(['l', 'r'] as const).map(sc => `<g data-k="w${sc}">
      <rect class="cps-back" x="${(sc === 'l' ? WIN.xl : WIN.xr) - 8}" y="${WIN.y - 8}" width="${WIN.w + 16}" height="${WIN.h + 16}" rx="16" filter="url(#${P}-clipsh)"/>
      <svg data-k="win${sc}" x="${sc === 'l' ? WIN.xl : WIN.xr}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}" viewBox="${VB.bl.join(' ')}" overflow="hidden"><g class="fig">${pathScene(P, sc)}</g></svg>
      <text data-k="h${sc}0" class="cps-head" x="${(sc === 'l' ? WIN.xl : WIN.xr) + WIN.w / 2}" y="${WIN.y - 26}" text-anchor="middle">${sc === 'l' ? 'still air' : 'wind'}</text>
      <text data-k="h${sc}1" class="cps-head" x="${(sc === 'l' ? WIN.xl : WIN.xr) + WIN.w / 2}" y="${WIN.y - 26}" text-anchor="middle" opacity="0">${sc === 'l' ? 'stomata open' : 'stomata closed'}</text>
      ${rowsSvg(`rw${sc}`, (sc === 'l' ? WIN.xl : WIN.xr) + 10, WIN.y + WIN.h + 52)}</g>`).join('')}
    <g data-k="full" opacity="0"><g data-k="fcam"><g class="fig">${pathScene(P, 'f')}</g></g>${concSvg('ro', RO.x, RO.y)}</g>`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const L = sceneCtl(S, 'l', q('winl')), R = sceneCtl(S, 'r', q('winr')), F = sceneCtl(S, 'f', q('fcam'));
    const ro = concCtl(S, 'ro', RO.y);
    set(q('fcam'), 'transform', tfStr(FULL));
    const kWin = ((WIN.w / VB.bl[2]) / FULL.s) ** -0.7;
    const row = (k: string, sym: 'cs' | 'ci', c: number, label: string, arrow: number): void => {
      op(q(`${k}-s`), sym === 'cs' ? 1 : 0); op(q(`${k}-i`), sym === 'ci' ? 1 : 0);
      const w = c * 1.3, b = q(`${k}-b`), v = q(`${k}-v`);
      set(b, 'width', f1(w));
      set(v, 'x', f1(Number(b.getAttribute('x')) + w + 8));
      set(v, 'text', `${label}${arrow > 0.5 ? (sym === 'cs' ? ' ↑' : ' ↓') : ''}`);
    };
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(3, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const T = beatClock(b, tt), t0 = T(0), t1 = T(1), t2 = T(2), t3 = T(3);

      /* the two windows: boundary layer, then the stoma */
      const g = mv(t1, 0, 1.0);
      const vb = VB.bl.map((v, i) => lerp(v, VB.st[i], g));
      set(q('winl'), 'viewBox', vb.map(f1).join(' ')); set(q('winr'), 'viewBox', vb.map(f1).join(' '));
      const litW = litMix(LIT.bl, LIT.st, tw(t1, 0, 0.8));
      L.lit(litW, 1); R.lit(litW, 1);
      // wind on the right: thins in beat 1, comes back as the windows glide on
      const thin = b === 0 ? tw(t0, 0.4, 1.2) : b === 1 ? 1 - tw(t1, 0, 0.8) : 0;
      L.wind(0, -1, kWin); R.wind(thin, b === 0 ? t0 - 0.5 + 0.9 : -1, kWin);
      // the right one closes, water streams out of the left one
      const clR = tw(t1, 1.2, 2.0);
      L.close(0); R.close(clR);
      L.water(b === 1 ? t1 - 0.8 : -1); R.water(-1);
      L.tracer(null, 0, kWin); R.tracer(null, 0, kWin);
      op(q('hl0'), 1 - tw(t1, 0.3, 0.6)); op(q('hl1'), tw(t1, 0.3, 0.6));
      op(q('hr0'), 1 - tw(t1, 0.3, 0.6)); op(q('hr1'), tw(t1, 0.3, 0.6));
      // readout rows: C_s (still lower, wind higher), then Cᵢ (open 300, closed lower)
      const toCi = tw(t1, 0.3, 0.6);
      if (toCi < 0.5) {
        row('rwl', 'cs', 395, '', 0);
        row('rwr', 'cs', lerp(395, RO_BARS.csWind, thin), '', thin);
      } else {
        row('rwl', 'ci', RO_BARS.ci, '300', 0);
        row('rwr', 'ci', lerp(RO_BARS.ci, RO_BARS.ciClosed, clR), clR > 0.5 ? '' : '300', clR);
      }
      const away = tw(t2, 0, 0.5);
      op(q('wl'), 1 - away); op(q('wr'), 1 - away);

      /* the whole figure: the mesophyll lit, then the stomata close */
      op(q('full'), away);
      const litF = litMix(LIT.me, LIT.all, tw(t3, 0, 0.8));
      F.lit(b < 3 ? LIT.me : litF, b < 3 ? 1 : 1 - tw(t3, 0, 0.8));
      F.wind(0, -1, 1); F.water(-1); F.tracer(null, 0, 1);
      const cl = tw(t3, 1.2, 2.0);
      F.close(cl);
      const hl = b < 3 ? { ci: 1, cc: 1 } : { ci: 1 - cl, cc: 1 - cl };
      ro({ cs: RO_BARS.cs, ci: lerp(RO_BARS.ci, RO_BARS.ciClosed, cl), cc: lerp(RO_BARS.cc, RO_BARS.ccClosed, cl), down: cl, hl });
    };
  },
};
