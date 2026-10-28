// Slide 13 · Chlorophyll fluorescence, staging D: side by side, a healthy pumpkin leaf and one after 4.6 h at
// 548 µmol m⁻² s⁻¹ with D1 repair blocked (Tyystjärvi & Aro 1996, Fig. 1A: F_v/F_m 0.83 and 0.52), each in a leaf clip
// with its trace and readout (the schematic of figure v2 in motion); then both shrink into the Earth's SIF map
// (beats PP13_PAIR). F_o is drawn the same in both (schematic).
// - Beat 1: measuring light on: both traces at F_o; readouts empty.
// - Beat 2: the same saturating pulse flashes at both clips: the healthy trace jumps to a high F_m, the damaged one to a
//   lower one; the readouts show 0.83 and 0.52.
// - Beat 3: both columns shrink into the US Corn Belt on the SIF map; the closing question.
import { f1, fade, lab, lerp, lerpV, mv, setters, type V } from './pp-stage';
import { clipSvg, drawPulse, earthSvg, flashAt, flashSvg, fmOf, FVFM_HURT, FVFM_OK, leafSvg, pulsePlotSvg, readoutSvg, type Box } from './pp13-common';
import { PP13_PAIR } from './beats-pp';
import type { Staging } from './types';

const P = 'pp13d';
const EARTH = earthSvg(`${P}e`, 150, 12, 1300);
const CB = EARTH.at(190, 86);
const COLS = [{ x: 30, k: 'h', title: 'healthy pumpkin leaf', sub: 'dark-adapted', r: FVFM_OK }, { x: 816, k: 'd', title: 'damaged pumpkin leaf', sub: '4.6 h at 548 µmol m⁻² s⁻¹, D1 repair blocked', r: FVFM_HURT }];
const plotOf = (x: number): Box => ({ x: x + 390, y: 150, w: 320, h: 330 });
const clipOf = (x: number): V => [x + 200, 330];

function colSvg(c: typeof COLS[number]): string {
  const cl = clipOf(c.x);
  return `<rect class="ppa-box" x="${c.x}" y="20" width="754" height="700" rx="20"/>
    ${lab(c.title, `ppa-t${c.r < 0.8 ? ' ppa-red' : ' ppa-green'}`, c.x + 28, 66)}${lab(c.sub, 'ppa-s', c.x + 28, 94)}
    ${leafSvg(c.x + 190, 390, 135, 18)}
    ${clipSvg(cl[0], cl[1], [c.x + 360, 250])}
    ${flashSvg(P, `fl-${c.k}`, cl[0], cl[1], 110)}
    <g data-k="lp-${c.k}" opacity="0" display="none">${lab('saturating pulse', 'ppa-l ppa-amber ppa-halo', cl[0], cl[1] + 70, 'middle')}</g>
    ${pulsePlotSvg(`tr-${c.k}`, plotOf(c.x))}
    ${readoutSvg(`ro-${c.k}`, c.x + 390, 600)}`;
}

const B1 = { run: 0.15, runD: 0.85, end: 1.2 };
const B2 = { run: 0.1, runD: 1.4, end: 1.7 };
const B3 = { cam: 0.1, camD: 1.0, out: 0.75, earth: 0.3, cb: 1.0, end: 1.4 };
const TEND = [B1.end, B2.end, B3.end];
const U_FO = 0.42, U_END = 0.9;

export const STAGING: Staging = {
  id: 'd',
  name: 'D · Side by side: healthy vs damaged leaf',
  note: 'Side by side: a healthy and a light-damaged pumpkin leaf under the same saturating pulse (F_v/F_m 0.83 vs 0.52, Tyystjärvi & Aro 1996), then both shrink into the Earth’s SIF map.',
  beats: PP13_PAIR,
  holds: [[0], [], []],
  svg: () => `<g data-k="earth" opacity="0" display="none">${EARTH.svg}</g>
    <g data-k="cols">${COLS.map(colSvg).join('')}</g>`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(2, Math.round(beatIn)));
      const tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;

      const u = b === 0 ? U_FO * Math.max(0, Math.min(1, (tt - B1.run) / B1.runD)) : b === 1 ? lerp(U_FO, U_END, Math.max(0, Math.min(1, (tt - B2.run) / B2.runD))) : U_END;
      const tf = B2.run + ((0.5 - U_FO) / (U_END - U_FO)) * B2.runD;
      COLS.forEach(c => {
        drawPulse(S, `tr-${c.k}`, plotOf(c.x), Math.max(0.001, u), fmOf(c.r));
        op(q(`fl-${c.k}`), b === 1 ? flashAt(tt, tf) : 0);
        op(q(`lp-${c.k}`), b === 1 && tt >= tf ? 1 : 0);
        set(q(`ro-${c.k}-v`), 'text', u >= 0.6 ? c.r.toFixed(2) : '–');
      });

      /* ---- beat 3: into the map */
      const e = b === 2 ? mv(tt, B3.cam, B3.camD) : 0;
      const sc = lerp(1, 0.04, e), at = lerpV([800, 370], CB, e);
      set(q('cols'), 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)}) translate(-800 -370)`);
      op(q('cols'), b === 2 ? 1 - fade(tt, B3.out, 0.3) : 1);
      op(q('earth'), b === 2 ? fade(tt, B3.earth, 0.4) : 0);
      op(q('cornbelt'), b === 2 ? fade(tt, B3.cb, 0.2) : 0);
    };
  },
};
