// Cyclic electron flow, staging m2: the slide 10b figure at full size and a fixed camera; the cycle runs as a loop that
// keeps playing until the next click; the H⁺ count is a dial of the 14 slots of ATP synthase's rotor (c-ring), beside the
// ATP : NADPH bars. The figure, the glyphs, the condition icons and the clipping: cyclicm-common.ts.
// - Beat 1, the gap (1 stop): the dial holds the 12 H⁺ of linear flow; the 4 electrons' 3 H⁺ each light up in turn (and
//   the H⁺ from water and from b₆f glow on the figure). Step 2: CO₂ fixation needs 3 : 2; the 2 empty slots and the
//   missing 0.4 ATP are dashed.
// - Beat 2, the cycle (a loop of 10 s, no stops): light at photosystem I; the electron goes to ferredoxin and back to
//   plastoquinone; 2 H⁺ ride on plastoquinone to b₆f and into the lumen, then fill the dial's 2 empty slots (12 → 14);
//   the electron returns through plastocyanin to P700. The round replays: its 2 H⁺ leave the dial again.
// - Beat 3, one full turn (1 stop): the dial is full, 12 + 2 = 14 = 1 turn. Step 2: the rotor is named on the figure,
//   the dial and the rotor turn once, 3 ATP leave ATP synthase's head, the ATP bar grows from 2.6 to 3.
// - Beat 4, when and why (2 stops): the H⁺ lines give way to the condition icons; the consequence on the figure; the
//   Munekage et al. 2004 clipping.
import { GEO, hring, tagG } from '../figs/chain';
import { f1, lerp, lerpV, setters, smooth, tw, type V } from './antenna-common';
import {
  along, B6F, CARD, cardRect, chainScene, clipH, clippingSvg, COND_NAME, condIcon, CONDS, E_DOT, glowAt, glowDefs, glowRing, glyph, H_RING,
  heatPath, leader, mv, sample, turnPath, turnPts, txt,
} from './cyclicm-common';
import type { Staging } from './types';

const P = 'cymm2';
/** The figure: the slide's card at full size, left. */
const FIG = { s: 1, t: [10 - CARD.x, 40 - CARD.y] as V };
const toFig = (q: V): V => [(q[0] - FIG.t[0]) / FIG.s, (q[1] - FIG.t[1]) / FIG.s];

/* ---------------------------------------------------------------- the readout: the dial and the bars (stage units) */

const BOX = { x: 912, y: 26, w: 676, h: 688 };
/** The dial: ATP synthase's rotor (c-ring) seen from above, 14 slots. */
const DC: V = [1058, 220], DR = 108, SLOT = 20;
const slotAt = (i: number): V => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 14; return [DC[0] + DR * Math.cos(a), DC[1] + DR * Math.sin(a)]; };
/** The bars: right column. */
const BX = 1300, UNIT = 88;
const RY = { h3: 70, ratio: 130, atp: 176, nadph: 218, need1: 270, need2: 302, conv: 392, h1: 470, lin: 514, why: 544, cyc: 590, rule: 608, tot: 644 };
const X0 = 940;

function readoutSvg(): string {
  const ring = (x: number, y: number): string => `<g transform="translate(${f1(x)} ${f1(y - 8)})">${hring(0, 0, 12)}</g>`;
  const row = (y: number, lab: string, e: string, n: string): string =>
    `${txt(lab, 'cym-ro-lab', X0, y)}${txt(e, 'cym-ro-e', X0 + 78, y)}${txt(n, 'cym-ro-n', X0 + 190, y, 'end')}${ring(X0 + 210, y)}`;
  const slots = Array.from({ length: 14 }, (_, i) => { const [x, y] = slotAt(i); return `<circle class="cym-slot" cx="${f1(x)}" cy="${f1(y)}" r="${SLOT}"/>`; }).join('');
  const gaps = [12, 13].map(i => { const [x, y] = slotAt(i); return `<circle class="cym-slot-gap" cx="${f1(x)}" cy="${f1(y)}" r="${SLOT - 3}"/>`; }).join('');
  const hs = Array.from({ length: 14 }, (_, i) => { const [x, y] = slotAt(i); return `<g data-k="dh${i}" opacity="0" display="none"><g data-k="dhi${i}" transform="translate(${f1(x)} ${f1(y)})">${hring(0, 0, 14)}</g></g>`; }).join('');
  const grp = [0, 1, 2, 3].map(g => { const a0 = -Math.PI / 2 + ((3 * g - 0.5) * 2 * Math.PI) / 14, a1 = -Math.PI / 2 + ((3 * g + 2.5) * 2 * Math.PI) / 14, r = DR;
    return `<path class="cym-grp" data-k="grp${g}" d="M${f1(DC[0] + r * Math.cos(a0))},${f1(DC[1] + r * Math.sin(a0))}A${r},${r} 0 0 1 ${f1(DC[0] + r * Math.cos(a1))},${f1(DC[1] + r * Math.sin(a1))}" opacity="0" display="none"/>`; }).join('');
  return `<g class="fig cym-ro">
    <defs><filter id="${P}-rosh" x="-6%" y="-6%" width="112%" height="112%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#46321a" flood-opacity=".13"/></filter></defs>
    <rect class="cym-robox" x="${BOX.x}" y="${BOX.y}" width="${BOX.w}" height="${BOX.h}" rx="18" filter="url(#${P}-rosh)"/>
    ${txt('rotor (c-ring): 14 slots', 'cym-ro-h', DC[0], 62, 'middle')}
    <g data-k="dial"><circle class="cym-dial" cx="${DC[0]}" cy="${DC[1]}" r="${DR + SLOT + 8}"/><circle class="cym-hub" cx="${DC[0]}" cy="${DC[1]}" r="${DR - SLOT - 10}"/>
      ${grp}${slots}<g data-k="dgap" opacity="0" display="none">${gaps}</g>${hs}
      <path class="cym-dial-tick" d="M${DC[0]},${DC[1] - DR - SLOT - 14}V${DC[1] - DR - SLOT - 2}"/></g>
    <text class="cym-dial-n" data-k="dn" x="${DC[0]}" y="${DC[1] + 12}" text-anchor="middle">12</text>
    <text class="cym-dial-s" data-k="ds" x="${DC[0]}" y="${DC[1] + 42}" text-anchor="middle">of 14</text>
    <text class="cym-dial-s" data-k="ds2" x="${DC[0]}" y="${DC[1] + 42}" text-anchor="middle" opacity="0" display="none">= 1 turn</text>
    ${txt('14', 'cym-ro-e', X0, RY.conv)}${ring(X0 + 42, RY.conv)}${txt('→ 1 turn →', 'cym-ro-e', X0 + 62, RY.conv)}${txt('3', 'cym-ro-e', X0 + 194, RY.conv)}
    <g transform="translate(${X0 + 236} ${RY.conv - 8})">${tagG(0, 0, 'ATP', 'atp')}</g>
    ${txt('ATP : NADPH', 'cym-ro-h', BX - 76, RY.h3)}
    <g data-k="ro-r26">${txt('<tspan class="cym-c-atp">2.6</tspan> : <tspan class="cym-c-nadph">2</tspan>', 'cym-ro-big', BX - 76, RY.ratio)}</g>
    <g data-k="ro-r3" opacity="0" display="none">${txt('<tspan class="cym-c-atp">3</tspan> : <tspan class="cym-c-nadph">2</tspan>', 'cym-ro-big', BX - 76, RY.ratio)}</g>
    <g transform="translate(${BX - 42} ${RY.atp - 8})">${tagG(0, 0, 'ATP', 'atp')}</g>
    <rect class="cym-bar-atp" data-k="ro-bar" x="${BX}" y="${RY.atp - 19}" width="${f1(2.6 * UNIT)}" height="22" rx="4"/>
    <rect class="cym-gap" data-k="ro-gap" x="${f1(BX + 2.6 * UNIT + 1)}" y="${RY.atp - 18}" width="${f1(0.4 * UNIT - 2)}" height="20" rx="3" opacity="0" display="none"/>
    <g data-k="ro-gapl" opacity="0" display="none">${txt('0.4 missing', 'cym-ro-gapl', BOX.x + BOX.w - 16, RY.atp - 28, 'end')}</g>
    <g transform="translate(${BX - 42} ${RY.nadph - 8})">${tagG(0, 0, 'NADPH', 'nadph')}</g>
    <rect class="cym-bar-nadph" x="${BX}" y="${RY.nadph - 19}" width="${f1(2 * UNIT)}" height="22" rx="4"/>
    <g data-k="ro-need" opacity="0" display="none">${txt('CO₂ fixation needs', 'cym-ro-lab', BX - 76, RY.need1)}
      ${txt('<tspan class="cym-c-atp">3</tspan> : <tspan class="cym-c-nadph">2</tspan>', 'cym-ro-mid', BX - 76, RY.need2)}
      <path class="cym-need-tick" d="M${f1(BX + 3 * UNIT)},${RY.atp - 26}V${RY.atp + 9}"/></g>
    <g data-k="lines">${txt('H⁺ into the lumen', 'cym-ro-h', X0, RY.h1)}
      ${row(RY.lin, 'linear', '4 e⁻ →', '12')}
      <g data-k="ro-why" opacity="0" display="none">${txt('4 from water + 8 at <tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>', 'cym-ro-why', X0 + 78, RY.why)}</g>
      <g data-k="ro-cyc" opacity="0" display="none">${row(RY.cyc, 'cyclic', '1 e⁻ →', '2')}</g>
      <g data-k="ro-tot" opacity="0" display="none"><path class="cym-ro-rule" d="M${X0 + 78},${RY.rule}H${X0 + 226}"/>
        ${txt('14', 'cym-ro-n', X0 + 190, RY.tot, 'end')}${ring(X0 + 210, RY.tot)}${txt('= 1 turn', 'cym-ro-e', X0 + 230, RY.tot)}</g></g>
    <rect class="cym-ro-pulse" data-k="ro-pulse-cyc" x="${X0 - 14}" y="${RY.cyc - 30}" width="300" height="42" rx="10" opacity="0" display="none"/>
    <rect class="cym-ro-pulse" data-k="ro-pulse-tot" x="${X0 - 14}" y="${RY.tot - 30}" width="300" height="42" rx="10" opacity="0" display="none"/>
    <rect class="cym-ro-pulse" data-k="ro-pulse-ratio" x="${BX - 90}" y="${RY.ratio - 44}" width="${BOX.x + BOX.w - BX + 80}" height="100" rx="10" opacity="0" display="none"/>
  </g>`;
}

/* ---------------------------------------------------------------- timing */

const B1 = { why: 0.3, grp: 0.3, grpD: 0.35, hold: 1.8, need: 1.95, end: 3.0 };
/** Beat 2: an intro (names), then rounds of ROUND s; u = seconds into the round. */
const INTRO = 1.4, ROUND = 10;
const R = {
  light: 0, lightD: 0.8, flash: 0.85, gFd: 1.0, jump: 1.25, jumpD: 0.9, gPq: 2.05, route: 2.3, routeD: 1.2,
  hIn: 3.55, hMove: 3.8, hD: 0.8, gB6f: 4.55, go: 4.8, goD: 1.0, rel: 5.9, relD: 0.8, fly: 6.75, flyD: 1.0,
  gPc: 6.1, d: 6.35, dD: 0.9, e: 7.35, eD: 0.8, back: 7.4, backD: 1.0, reset: 9.3, resetD: 0.6,
};
const B3 = { sum: 0.2, hold: 1.0, names: 1.1, turn: 1.6, turnD: 1.8, atp: [2.0, 2.6, 3.2], grow: 2.4, growD: 1.2, end: 4.0 };
const B4 = { lines: 0, icons: 0.4, hold1: 1.9, acid: 2.0, heat: 2.5, prot: 3.0, hold2: 4.0, clip: 4.1, end: 4.8 };

export const STAGING: Staging = {
  id: 'm2',
  name: 'M2 · Loop and rotor dial',
  note: 'The slide figure at full size, no zoom; the cycle loops until the next click; the H⁺ count fills a dial of the 14 slots of ATP synthase’s rotor, next to the ATP : NADPH bars.',
  holds: [[B1.hold], [], [B3.hold], [B4.hold1, B4.hold2]],
  svg: () => {
    const { pq: PQ, hem: HEM, pc: PC, p700: P700, fd: FD, ring: RING } = GEO;
    return `
    <g data-k="cam" transform="matrix(${FIG.s},0,0,${FIG.s},${f1(FIG.t[0])},${f1(FIG.t[1])})"><g class="fig">
      ${cardRect(P)}
      <g data-k="chain" class="chn chn-pdb-bilayer chn-fx">${chainScene(`${P}c`)}</g>
      <defs>${glowDefs(P)}<clipPath id="${P}-lclip"><rect data-k="lclip" x="-200" y="-200" width="1200" height="1200"/></clipPath></defs>
      <rect class="cym-acid" data-k="acid" x="0" y="319" width="800" height="133" opacity="0" display="none"/>
      ${glowRing('g-wh', P, [222, 402], 46)}${glowRing('g-bh', P, [300, 396], 38)}
      ${glowRing('g-p700', P, P700, 30)}${glowRing('g-fd', P, FD, 30)}${glowRing('g-pq', P, PQ, 32)}
      ${glowRing('g-b6f', P, [HEM[0] + 2, HEM[1] + 6], 78)}${glowRing('g-pc', P, PC, 32)}${glowRing('g-rot', P, RING, 40)}
      ${leader('ld-rc', 'reaction centre (P700)', [560, 404], 'start', [566, 391], [P700[0] + 4, P700[1] + 6])}
      ${leader('ld-rot', 'rotor (c-ring)', [632, 380], 'end', [612, 366], [RING[0] - 8, RING[1] + 10])}
      ${glyph('rcglow', `<circle r="24" fill="url(#${P}-rcglow)"/>`)}${glyph('rcring', '<circle class="cym-ring" r="8"/>')}
      <g data-k="turn" opacity="0" display="none"><path class="cym-turn-bg" d="${turnPath(RING)}"/><path class="cym-turn" data-k="turn-arc" d="${turnPath(RING)}" pathLength="100" stroke-dasharray="0 100"/>
        <path class="cym-turnh" data-k="turn-head" d="M0,-7L13,0L0,7Z"/></g>
      ${[0, 1].map(i => glyph(`h${i}`, H_RING)).join('')}${glyph('el', E_DOT)}
      ${glyph('l-e', txt('e⁻', 'cym-elab chn-halo', -9, -9, 'end'))}
      ${[0, 1, 2].map(i => glyph(`atp${i}`, tagG(0, 0, 'ATP', 'atp'))).join('')}
      <g data-k="heat" opacity="0" display="none">${[90, 114, 138].map(x => `<path class="cym-heat" d="${heatPath(x, 254, 204)}"/>`).join('')}</g>
      ${glyph('l-acid', txt('acidic lumen', 'cym-acidl chn-halo', 600, 410, 'middle'))}
      ${glyph('l-heat', txt('heat dissipation', 'cym-cons chn-halo', 112, 534, 'middle'))}
      ${glyph('l-prot', txt('protected', 'cym-cons chn-halo', 499, 534, 'middle'))}
    </g></g>
    ${readoutSvg()}
    ${[0, 1].map(i => glyph(`fh${i}`, `<g class="fig">${hring(0, 0, 14)}</g>`)).join('')}
    ${CONDS.map((c, i) => {
      const y = 470 + i * 66, [a, b2] = COND_NAME[c];
      return `<g data-k="cond${i}" opacity="0" display="none"><g transform="translate(${X0 + 26} ${y})">${condIcon(c, 27)}</g>
        ${txt(a, 'cym-cond2', X0 + 66, b2 ? y - 4 : y + 7)}${b2 ? txt(b2, 'cym-cond2', X0 + 66, y + 19) : ''}</g>`;
    }).join('')}
    ${clippingSvg(P, 'clip', 1262, 714 - clipH(320) - 10, 320, -1)}`;
  },

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const { pq: PQ, hem: HEM, pc: PC, p700: P700, fd: FD, ring: RING } = GEO;
    const chainG = q('chain');
    const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
    const lightW = parts('light-psi');
    lightW.forEach(g => g.setAttribute('clip-path', `url(#${P}-lclip)`));
    const pqW = parts('pq'), pqBody = pqW.filter(g => !g.querySelector('text')), pqText = pqW.filter(g => g.querySelector('text'));
    const load = parts('pq-h-load'), hIn = parts('pq-h-in');
    const outRings = Array.from(chainG.querySelectorAll<SVGGElement>('[data-p="pq-h-out"] g.chn-g'));
    const HOUT: V[] = outRings.length === 2 ? outRings.map(g => { const c = g.querySelector('circle'); return [Number(c?.getAttribute('cx')), Number(c?.getAttribute('cy'))] as V; }) : [[285, 388], [314, 404]];
    const DOCK: V = [HEM[0] - 26, HEM[1] - 3];
    const ON_PQ: V = [4, 1], H_ON_PQ: V[] = [[-11, -19], [11, -19]];
    const H_FROM: V[] = [[PQ[0] - 8, 178], [PQ[0] + 14, 168]];
    const onPq = (c: V): V => [c[0] + ON_PQ[0], c[1] + ON_PQ[1]];
    const path = (p: string, cls: string): SVGPathElement | null => chainG.querySelector<SVGPathElement>(`[data-p="${p}"] path.${cls}`);
    const LEG_A: V[] = [P700, ...sample(path('e-psi-fd', 'chn-e')), FD];
    const LEG_B: V[] = [FD, ...sample(path('e-fd-pq', 'chn-e'), 60), onPq(PQ)];
    const LEG_D: V[] = [onPq(DOCK), HEM, ...sample(path('e-b6f-pc', 'chn-e')), PC];
    const LEG_E: V[] = [PC, ...sample(path('e-pc-psi', 'chn-e')), P700];
    const hPath = sample(path('pq-h-out', 'chn-h'));
    const LEG_H: V[][] = [0, 1].map(i => [[DOCK[0] + H_ON_PQ[i][0], DOCK[1] + H_ON_PQ[i][1]] as V, ...hPath, HOUT[i]]);
    const HEAD: V = [712, 150], ATP_TO: V[] = [[664, 30], [716, 30], [768, 30]];
    const turnArc = q('turn-arc'), turnHead = q('turn-head'), TURN = turnPts(RING);
    const put = (k: string, at: V, sc: number, o2: number): void => {
      const el = q(k);
      op(el, o2);
      if (o2 > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
    };
    const shift = (els: Element[], d: V): void => els.forEach(el => set(el, 'transform', `translate(${d[0].toFixed(2)} ${d[1].toFixed(2)})`));
    const TEND = [B1.end, 1e9, B3.end, B4.end];
    const dn = q('dn');

    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(3, Math.round(beatIn)));
      const tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
      const t1 = T(0), t3 = T(2), t4 = T(3);
      /** Seconds into the round of beat 2 (a large t, Back's end state, shows a round's end). */
      const u = b !== 1 ? (b > 1 ? 99 : -1) : tt > 600 ? 8.6 : tt < INTRO ? -1 : (tt - INTRO) % ROUND;
      const round = b === 1 && tt >= INTRO && tt <= 600 ? Math.floor((tt - INTRO) / ROUND) : 0;

      /* ---- beat 1: the 12 H⁺, 3 per electron; where they come from; the need */
      op(q('g-wh'), glowAt(t1, B1.grp, 1.4));
      op(q('g-bh'), glowAt(t1, B1.grp + 0.5, 1.4));
      [0, 1, 2, 3].forEach(g => op(q(`grp${g}`), glowAt(t1, B1.grp + g * B1.grpD, B1.grpD + 0.3)));

      /* ---- names and glows */
      op(q('ld-rc'), b === 1 ? tw(tt, 0.1, 0.4) * (1 - tw(tt, INTRO + R.jump, INTRO + R.jump + 0.3)) : 0);
      op(q('g-p700'), b === 1 ? glowAt(tt, 0.1, 1.2) : 0);
      op(q('g-fd'), glowAt(u, R.gFd, 0.7));
      op(q('g-pq'), glowAt(u, R.gPq, 0.7));
      op(q('g-b6f'), glowAt(u, R.gB6f, 0.7));
      op(q('g-pc'), glowAt(u, R.gPc, 0.7));
      const n3 = tw(t3, B3.names, B3.names + 0.3) * (1 - tw(t4, 0, 0.3));
      op(q('ld-rot'), n3);
      op(q('g-rot'), glowAt(t3, B3.names, 0.9));

      /* ---- light at photosystem I: redrawn from above at the start of each round */
      let lY = 1000;
      if (b === 1 && u >= 0 && u < R.light + R.lightD) lY = lerp(90, 250, smooth((u - R.light) / R.lightD));
      if (b === 1 && tt < INTRO) lY = 1000;
      set(q('lclip'), 'height', f1(lY + 200));

      /* ---- plastoquinone: to b₆f and back */
      const go = mv(u, R.go, R.goD), back = mv(u, R.back, R.backD);
      const pq = back > 0 ? lerpV(DOCK, PQ, back) : lerpV(PQ, DOCK, go);
      const dPq: V = [pq[0] - PQ[0], pq[1] - PQ[1]];
      shift(pqBody, dPq);
      const aside = b === 1 ? tw(tt, 0, 0.4) : b === 2 ? 1 - tw(tt, 0, 0.4) : 0;
      shift(pqText, [dPq[0] - 98 * aside, dPq[1] - 4 * aside]);
      /** The slide's own H⁺ marks give way to the story's during beat 2. */
      const slideOwn = b === 1 ? 1 - tw(tt, 0, 0.3) : b === 2 ? tw(tt, 0, 0.4) : 1;
      load.forEach(g => op(g, slideOwn));
      outRings.forEach(g => op(g, slideOwn));
      hIn.forEach(g => op(g, b === 3 ? 1 - tw(tt, 0.2, 0.6) : 1 - aside));

      /* ---- the electron */
      const inRound = b === 1 && u >= 0;
      put('rcglow', P700, 1, inRound ? tw(u, R.flash, R.flash + 0.12) * (1 - tw(u, R.flash + 0.25, R.flash + 0.7)) : 0);
      const home = R.e + R.eD;
      put('rcring', P700, 1, inRound ? tw(u, R.jump + 0.1, R.jump + 0.25) * (1 - tw(u, home - 0.05, home)) : 0);
      let e: V = P700;
      if (inRound) {
        if (u < R.jump) e = P700;
        else if (u < R.route) e = along(LEG_A, smooth((u - R.jump) / R.jumpD));
        else if (u < R.d) e = u < R.route + R.routeD ? along(LEG_B, smooth((u - R.route) / R.routeD)) : onPq(pq);
        else if (u < R.e) e = along(LEG_D, smooth((u - R.d) / R.dD));
        else e = along(LEG_E, smooth((u - R.e) / R.eD));
      }
      const eOp = b === 1 ? tw(tt, 0.1, 0.4) : b === 2 ? 1 - tw(tt, 0, 0.4) : 0;
      put('el', e, 1, eOp);
      put('l-e', e, 1, eOp * (inRound ? 1 - tw(u, R.hMove + 0.2, R.hMove + 0.4) * (1 - tw(u, R.d + 0.1, R.d + 0.3)) : 1));

      /* ---- 2 H⁺: stroma → plastoquinone → b₆f → lumen → the dial's last 2 slots */
      const flyN = [0, 1].map(i => (inRound ? mv(u, R.fly + i * 0.2, R.flyD) : 0));
      [0, 1].forEach(i => {
        let h: V = H_FROM[i], hOp = 0;
        const onIt: V = [pq[0] + H_ON_PQ[i][0], pq[1] + H_ON_PQ[i][1]];
        if (inRound) {
          hOp = tw(u, R.hIn + i * 0.1, R.hIn + i * 0.1 + 0.25) * (flyN[i] > 0 ? 0 : 1);
          const r0 = R.rel + i * 0.15;
          if (u < R.hMove + R.hD) h = lerpV(H_FROM[i], onIt, smooth((u - R.hMove - i * 0.1) / (R.hD - 0.1)));
          else if (u < r0) h = onIt;
          else h = along(LEG_H[i], smooth((u - r0) / (R.relD - 0.15)));
        }
        put(`h${i}`, h, 1, hOp);
        // in flight to the dial (stage units), from the lumen at b₆f to slot 12 + i
        const from: V = [FIG.t[0] + FIG.s * HOUT[i][0], FIG.t[1] + FIG.s * HOUT[i][1]], to = slotAt(12 + i);
        const mid: V = [lerp(from[0], to[0], 0.5), Math.min(from[1], to[1]) - 120];
        const f = flyN[i], q1 = lerpV(lerpV(from, mid, f), lerpV(mid, to, f), f);
        put(`fh${i}`, q1, lerp(12 / 14, 1, f), f > 0 && f < 1 ? 1 : 0);
      });

      /* ---- the dial: 12 of linear flow; the 2 of the cycle (in beat 2's round, and from beat 3 on) */
      const reset = inRound ? 1 - tw(u, R.reset, R.reset + R.resetD) : 1;
      const cyc = [0, 1].map(i => (b === 1 ? (u >= 0 ? (flyN[i] >= 1 ? 1 : 0) * reset : 0) : b > 1 ? 1 : 0));
      for (let i = 0; i < 14; i++) op(q(`dh${i}`), i < 12 ? 1 : cyc[i - 12]);
      const nShown = 12 + (cyc[0] > 0.5 ? 1 : 0) + (cyc[1] > 0.5 ? 1 : 0);
      set(dn, 'text', String(nShown));
      op(q('dgap'), b === 0 ? tw(tt, B1.need, B1.need + 0.4) : b === 1 ? 1 : 0);

      /* ---- one full turn: dial and rotor */
      const tu = mv(t3, B3.turn, B3.turnD);
      set(q('dial'), 'transform', `rotate(${(tu * 360).toFixed(2)} ${DC[0]} ${DC[1]})`);
      for (let i = 0; i < 14; i++) { const [x, y] = slotAt(i); set(q(`dhi${i}`), 'transform', `translate(${f1(x)} ${f1(y)}) rotate(${(-tu * 360).toFixed(2)})`); }
      op(q('ds'), 1 - tw(t3, B3.turn + B3.turnD - 0.2, B3.turn + B3.turnD + 0.1));
      op(q('ds2'), tw(t3, B3.turn + B3.turnD - 0.2, B3.turn + B3.turnD + 0.1));
      op(q('turn'), b === 2 ? tw(tt, B3.turn - 0.2, B3.turn) : b === 3 ? 1 - tw(tt, 0, 0.4) : 0);
      set(turnArc, 'stroke-dasharray', `${(tu * 100).toFixed(2)} 100`);
      const th = along(TURN, Math.max(0.01, tu)), th0 = along(TURN, Math.max(0, tu - 0.02));
      set(turnHead, 'transform', `translate(${f1(th[0])} ${f1(th[1])}) rotate(${(Math.atan2(th[1] - th0[1], th[0] - th0[0]) * 180 / Math.PI).toFixed(1)})`);
      op(turnHead, tu > 0.01 ? 1 : 0);
      B3.atp.forEach((a, i) => put(`atp${i}`, lerpV(HEAD, ATP_TO[i], mv(t3, a, 0.8)), 1, b === 2 ? tw(tt, a, a + 0.2) : b === 3 ? 1 - tw(tt, 0, 0.5) : 0));

      /* ---- beat 4 */
      const ca = tw(t4, B4.acid, B4.acid + 0.5), ch = tw(t4, B4.heat, B4.heat + 0.5), cp = tw(t4, B4.prot, B4.prot + 0.5);
      op(q('acid'), ca);
      op(q('l-acid'), ca);
      op(q('heat'), ch);
      op(q('l-heat'), ch);
      op(q('l-prot'), cp);
      op(q('lines'), 1 - tw(t4, B4.lines, B4.lines + 0.35));
      CONDS.forEach((_, i) => op(q(`cond${i}`), tw(t4, B4.icons + i * 0.3, B4.icons + i * 0.3 + 0.3)));
      op(q('clip'), tw(t4, B4.clip, B4.clip + 0.3));

      /* ---- the readout */
      const lines = 1 - tw(t4, B4.lines, B4.lines + 0.35);
      op(q('ro-why'), (b === 0 ? tw(tt, B1.why, B1.why + 0.4) : 1) * lines);
      const need = b === 0 ? tw(tt, B1.need, B1.need + 0.4) : 1;
      op(q('ro-need'), need);
      op(q('ro-cyc'), (b === 1 ? (tt > 600 || round > 0 ? 1 : u >= 0 ? tw(u, R.fly + R.flyD, R.fly + R.flyD + 0.35) : 0) : b > 1 ? 1 : 0) * lines);
      op(q('ro-tot'), (b === 2 ? tw(tt, B3.sum, B3.sum + 0.35) : b > 2 ? 1 : 0) * lines);
      const grow = b === 2 ? mv(tt, B3.grow, B3.growD) : b > 2 ? 1 : 0;
      set(q('ro-bar'), 'width', f1((2.6 + 0.4 * grow) * UNIT));
      op(q('ro-gap'), need * (1 - grow));
      op(q('ro-gapl'), need * (1 - tw(grow, 0, 0.3)));
      op(q('ro-r26'), 1 - tw(grow, 0.7, 1));
      op(q('ro-r3'), tw(grow, 0.7, 1));
      op(q('ro-pulse-cyc'), inRound ? glowAt(u, R.fly + R.flyD, 0.9) * 0.9 : 0);
      op(q('ro-pulse-tot'), b === 2 ? glowAt(tt, B3.sum, 0.9) * 0.9 : 0);
      op(q('ro-pulse-ratio'), b === 2 ? glowAt(tt, B3.grow + 0.6, 1.0) * 0.9 : 0);
      void toFig; void B6F;
    };
  },
};
