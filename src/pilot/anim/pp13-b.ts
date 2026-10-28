// Slide 13 · Chlorophyll fluorescence, staging B: history-led (beats PP13_HIST). Kautsky and Hirsch's 1931 observation in
// a darkened room, then why the glow changes (open and closed reaction centres), then today's measurement: the real PAM
// trace (figure v3 of the slide, Ruban 2016 Fig. 1A) recorded left to right with the fluorometer's lights, and the Earth
// seen from orbit. The parts: pp13-common.ts.
// - Beat 1: the clipping (portraits); the UV lamp switches on over the dark-kept leaf; the leaf glows red as the induction
//   curve draws itself: low at light-on, peak within a second, decline over minutes.
// - Beat 2: on the curve, "open" at light-on and "closed" at the peak; beside, an open reaction centre (thick arrow to
//   photochemistry, faint fluorescence) and a closed one (no photochemistry, bright fluorescence).
// - Beat 3: the trace: measuring light on (F_o), a saturating pulse (F_m).
// - Beat 4: actinic light on, pulses reach only F_m′ above F_s; actinic light off, the pulse peaks recover.
// - Beat 5: the Earth's SIF map, the US Corn Belt marked; the closing question.
import {
  f1, fade, INK, lab, lerp, markers, setters, wavePath, type V,
} from './pp-stage';
import {
  drawInduction, drawLamps, drawRuban, earthSvg, induction, inductionSvg, inPulse, kautskyCard, lampsSvg, leafSvg, RUBAN_ACT,
  RUBAN_ML, rubanSvg, type Box,
} from './pp13-common';
import { PP13_HIST } from './beats-pp';
import type { Staging } from './types';

const P = 'pp13b';

/* ---------------------------------------------------------------- layout (stage units) */

const KC = kautskyCard(P, 'kc', 36, 90, 430);
const ROOM = { x: 500, y: 70, w: 420, h: 600 };
const LAMP: V = [710, 160], LEAFC: V = [710, 420], LEAF_R = 110;
const IBOX: Box = { x: 1010, y: 160, w: 540, h: 330 };
const IX = (u: number): number => IBOX.x + u * IBOX.w, IY = (g: number): number => IBOX.y + IBOX.h - g * IBOX.h * 0.88;
const RB = rubanSvg(P, 'rb', 30, 4, 980);
const EARTH = earthSvg(`${P}e`, 150, 12, 1300);

function roomSvg(): string {
  const { x, y, w, h } = ROOM;
  const rays = [-60, 0, 60].map(dx => `M${LAMP[0] + dx * 0.25},${LAMP[1] + 34}L${LEAFC[0] + dx},${LEAFC[1] - 70}`).join('');
  return `<rect class="p13-room" x="${x}" y="${y}" width="${w}" height="${h}" rx="18"/>
    ${lab('darkened room', 'p13-w', x + 20, y + 36)}
    <path d="M${LAMP[0] - 46},${LAMP[1] - 20}h92l-16,44h-60z" fill="#6b6a64" stroke="#a8a59a" stroke-width="1.6"/>
    <rect x="${LAMP[0] - 30}" y="${LAMP[1] + 18}" width="60" height="8" rx="3" fill="#7b5cc4"/>
    ${lab('UV lamp', 'p13-w', LAMP[0] + 62, LAMP[1] + 8)}
    <path data-k="rays" d="${rays}" fill="none" stroke="#9a7ee6" stroke-width="4" stroke-dasharray="10 8" stroke-linecap="round" opacity="0" display="none"/>
    ${leafSvg(LEAFC[0], LEAFC[1], LEAF_R, 0)}
    <circle cx="${LEAFC[0]}" cy="${LEAFC[1]}" r="${LEAF_R * 1.6}" fill="#2b2a27" opacity=".55"/>
    <defs><radialGradient id="${P}-glow"><stop offset="0" stop-color="#ff5a3a" stop-opacity=".9"/><stop offset=".55" stop-color="#e2482c" stop-opacity=".55"/><stop offset="1" stop-color="#e2482c" stop-opacity="0"/></radialGradient></defs>
    <g data-k="glow" opacity="0" display="none"><circle cx="${LEAFC[0]}" cy="${LEAFC[1]}" r="${LEAF_R * 1.5}" fill="url(#${P}-glow)"/>${leafSvg(LEAFC[0], LEAFC[1], LEAF_R, 0, 'p13-redleaf')}</g>
    ${lab('dark-kept leaf', 'p13-w', LEAFC[0], y + h - 20, 'middle')}
    <g data-k="l-glow" opacity="0" display="none">${lab('red glow', 'p13-wr', LEAFC[0] + 108, LEAFC[1] - 92)}</g>`;
}

/** An open or a closed reaction centre in a panel at the room's place (top y0): light in, photochemistry out (or not),
 *  fluorescence. */
function centreSvg(k: string, y0: number, open: boolean): string {
  const cx = 670, cy = y0 + 170;
  return `<g data-k="${k}" opacity="0" display="none"><rect class="ppa-box" x="${ROOM.x}" y="${y0}" width="${ROOM.w}" height="280" rx="18"/>
    ${lab(open ? 'open reaction centre' : 'closed reaction centre', `ppa-t${open ? ' ppa-green' : ' ppa-red'}`, ROOM.x + 22, y0 + 40)}
    <path class="ppa-ar" stroke="${INK.amber}" style="stroke-width:3.4" d="${wavePath(cx - 150, y0 + 78, cx - 50, cy - 26, 6, 3.5)}" marker-end="url(#${P}-m-amber)"/>
    ${lab('light', 'ppa-l ppa-amber', cx - 156, y0 + 104, 'end')}
    <rect class="pp-core" x="${cx - 46}" y="${cy - 30}" width="92" height="60" rx="18"/>
    ${open ? `<path class="ppa-ar" stroke="${INK.green}" style="stroke-width:11" d="M${cx + 50},${cy + 8}H${cx + 118}" marker-end="url(#${P}-m-green)"/>`
      : `<path class="ppa-ar" stroke="#b6b2a6" style="stroke-width:3;stroke-dasharray:6 6" d="M${cx + 50},${cy + 8}H${cx + 118}"/><path class="ppa-ar" stroke="${INK.red}" style="stroke-width:3.6" d="M${cx + 74},${cy - 6}l22,26M${cx + 96},${cy - 6}l-22,26"/>`}
    ${lab('photochemistry', `ppa-l ${open ? 'ppa-green' : 'ppa-grey'}`, cx + 34, cy + 72, 'start')}
    <path class="ppa-ar" stroke="${INK.red}" style="stroke-width:${open ? 2.4 : 11}" d="${wavePath(cx + 26, cy - 34, cx + 96, y0 + 74, 6, 3.5)}" marker-end="url(#${P}-m-red)"/>
    ${lab('fluorescence', 'ppa-l ppa-red', cx + 110, y0 + 84, 'start')}</g>`;
}

/* ---------------------------------------------------------------- timing (s into each beat) */

const B1 = { card: 0.05, curve: 0.25, curveD: 2.6, end: 3.0 };
const B2 = { open: 0.1, shut: 0.6, end: 1.0 };
const B3 = { out: 0, in: 0.15, rev: 0.4, revD: 1.2, u0: 30, u1: 128, end: 1.8 };
const B4 = { rev: 0.1, revD: 2.6, u1: 728, end: 2.9 };
const B5 = { out: 0, in: 0.15, cb: 0.4, end: 0.8 };
const TEND = [B1.end, B2.end, B3.end, B4.end, B5.end];

export const STAGING: Staging = {
  id: 'b',
  name: 'B · History: Kautsky to PAM',
  note: 'History-led: Kautsky and Hirsch’s 1931 glowing leaf and its induction curve, open vs closed reaction centres, then the real PAM trace (figure v3) recorded pulse by pulse, ending on the Earth from orbit.',
  beats: PP13_HIST,
  holds: [[0], [], [], [], []],
  svg: () => `${markers(P)}
    <g data-k="hist">${KC.svg}<g data-k="room">${roomSvg()}</g>${inductionSvg('ind', IBOX)}
      <g data-k="mk-open" opacity="0" display="none"><circle class="ppa-o" cx="${f1(IX(0.06))}" cy="${f1(IY(0.18))}" r="8" style="fill:#fffdf8;stroke:#24812f;stroke-width:3"/>${lab('open', 'ppa-l ppa-green ppa-halo', IX(0.06) + 14, IY(0.18) + 28)}</g>
      <g data-k="mk-shut" opacity="0" display="none"><circle cx="${f1(IX(0.2))}" cy="${f1(IY(1))}" r="8" fill="#c8361e" stroke="#fffdf8" stroke-width="2"/>${lab('closed', 'ppa-l ppa-red ppa-halo', IX(0.2), IY(1) - 16, 'middle')}</g>
      ${centreSvg('c-open', ROOM.y, true)}${centreSvg('c-shut', ROOM.y + 320, false)}</g>
    ${RB.svg}
    <g data-k="lamps-g" opacity="0" display="none">${lampsSvg('lamps', 1080, 250)}</g>
    <g data-k="earth" opacity="0" display="none">${EARTH.svg}</g>`,

  bind(stage) {
    const S = setters(stage), { q, op } = S;
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(4, Math.round(beatIn)));
      const tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;

      /* ---- beats 1–2: history and the two states */
      op(q('hist'), b < 2 ? 1 : b === 2 ? 1 - fade(tt, B3.out, 0.15) : 0);
      op(q('kc'), b === 0 ? fade(tt, B1.card, 0.15) : 1);
      const u = b === 0 ? Math.max(0, Math.min(1, (tt - B1.curve) / B1.curveD)) : 1;
      drawInduction(S, 'ind', IBOX, u);
      if (b > 0) op(q('ind-on'), 0);   // the markers "open" and "closed" take its place
      const lampOn = u >= 0.06 ? 1 : 0;
      op(q('rays'), lampOn);
      op(q('glow'), lampOn * induction(u));
      op(q('l-glow'), lampOn);
      op(q('room'), b === 0 ? 1 : b === 1 ? 1 - fade(tt, 0, 0.15) : 0);
      op(q('mk-open'), b === 1 ? fade(tt, B2.open, 0.15) : b > 1 ? 1 : 0);
      op(q('c-open'), b === 1 ? fade(tt, B2.open, 0.15) : b > 1 ? 1 : 0);
      op(q('mk-shut'), b === 1 ? fade(tt, B2.shut, 0.15) : b > 1 ? 1 : 0);
      op(q('c-shut'), b === 1 ? fade(tt, B2.shut, 0.15) : b > 1 ? 1 : 0);

      /* ---- beats 3–4: the PAM trace, recorded */
      const rv = b < 2 ? 0 : b === 2 ? fade(tt, B3.in, 0.15) : b === 3 ? 1 : 1 - fade(tt, B5.out, 0.15);
      op(q('rb'), rv);
      op(q('lamps-g'), rv);
      const ur = b < 2 ? B3.u0 : b === 2 ? lerp(B3.u0, B3.u1, Math.max(0, Math.min(1, (tt - B3.rev) / B3.revD)))
        : b === 3 ? lerp(B3.u1, B4.u1, Math.max(0, Math.min(1, (tt - B4.rev) / B4.revD))) : B4.u1;
      drawRuban(S, 'rb', RB, ur);
      const live = b === 2 || (b === 3 && ur < B4.u1 - 1);
      drawLamps(S, 'lamps', [ur >= RUBAN_ML && b <= 3 ? 1 : 0, live && ur >= RUBAN_ACT[0] && ur <= RUBAN_ACT[1] ? 1 : 0, live && inPulse(ur) ? 1 : 0]);

      /* ---- beat 5: the Earth */
      op(q('earth'), b === 4 ? fade(tt, B5.in, 0.2) : 0);
      op(q('cornbelt'), b === 4 ? fade(tt, B5.cb, 0.2) : 0);
    };
  },
};
