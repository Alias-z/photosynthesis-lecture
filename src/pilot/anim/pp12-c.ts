// Slide 12 · Photoprotection and repair, staging C (history-led; beats PP12_HISTORY of beats-pp.ts). It opens on the
// slide 12 chain figure (c2c3 look, LIT12, as pp12-common.ts) and on the puzzle that found PsbS:
// - Beat 1: a clipping of Li et al. 2000, Fig. 1c (NPQ image of Arabidopsis), the row without PsbS ringed.
// - Beat 2: the clipping goes; the camera zooms into the antenna of photosystem II; strong light, the lumen fills with H⁺,
//   two H⁺ bind PsbS, violaxanthin turns into zeaxanthin, heat leaves, the fluorescence dims (pp12-common.ts's story).
// - Beat 3: the repair cycle drawn after Järvi, Suorsa & Aro 2015, Fig. 1 (as figure v8 of pp12f.ts): light damages D1
//   in the grana (hold); photosystem II moves to the unstacked membrane, damaged D1 is removed, a new D1 is inserted,
//   and it returns to the grana.
// - Beat 4: the cycle goes; zoom out to the whole chain; a cloud passes, the H⁺ leave, zeaxanthin and heat stay; the
//   clipping of the VPZ tobacco field trial (Kromdijk et al. 2016, Fig. 5D).
import { PP12_HISTORY } from './beats-pp';
import {
  chainGroup, counterScaler, f1, fade, kOf, lab, lerp, lerpV, mv, putter, setters, slideCard, taggedChain, tfStr, tween, WHOLE,
  type V,
} from './pp-stage';
import { drawStory, fieldCard, LIT12, liCard, MORE, SITES, storySvg, Z, type StoryState } from './pp12-common';
import type { Staging } from './types';

const B1 = { card: 0, ring: 0.25, end: 0.5 };
const B2 = { cardOut: 0, cam: 0.1, camD: 1.1, light: 0.1, h0: 0.35, hDt: 0.07, labs: 1.0, bind: 1.35, bindD: 0.7, conv: 2.05, convD: 0.4, heat: 2.25, end: 2.9 };
const B3 = { card: 0, zap: 0.25, dmg: 0.5, hold: 0.85, go: 0.9, goD: 1.0, rm: 2.0, rmD: 0.3, nw: 2.45, nwD: 0.3, back: 2.9, backD: 1.0, end: 4.1 };
const B4 = { cardOut: 0, labsOut: 0.05, cam: 0.1, camD: 1.2, cloud: 1.3, cloudD: 1.0, lightOut: 1.7, hOut: 1.8, hDt: 0.05, kcard: 2.6, end: 3.0 };
const TEND = [B1.end, B2.end, B3.end, B4.end];

/* ---------------------------------------------------------------- the repair cycle (stage units) */

const CYC = { x: 16, y: 16, w: 1568, h: 708 };
const G: V = [500, 250], U: V = [1080, 500];
/** Photosystem II as a drawn dimer with its D1 marked (states drawn as separate glyphs over one body). */
function ps2Icon(): string {
  return `<rect class="pp-lhc" x="-96" y="-44" width="192" height="88" rx="26"/><rect class="pp-core" x="-60" y="-34" width="120" height="68" rx="18"/>
    <g data-k="d1ok"><rect class="pp12-d1ok" x="-16" y="-26" width="38" height="52" rx="10"/></g>
    <g data-k="d1dmg" opacity="0" display="none"><rect class="pp-core-dmg" x="-16" y="-26" width="38" height="52" rx="10"/></g>
    <g data-k="d1gone" opacity="0" display="none"><rect class="pp12-d1gone" x="-16" y="-26" width="38" height="52" rx="10"/></g>
    <g data-k="d1new" opacity="0" display="none"><rect class="pp12-d1new" x="-16" y="-26" width="38" height="52" rx="10"/></g>
    <text class="ppa-l" x="3" y="7" text-anchor="middle">D1</text>`;
}
function cycleSvg(p: string): string {
  const stack = (c: V): string => [-66, -33, 33, 66].map(d => `<path class="pp-mem" d="M${c[0] - 190},${c[1] + d - 9}h380v18h-380z"/>`).join('')
    + `<path class="pp-mem" d="M${c[0] - 190},${c[1] - 9}h380v18h-380z"/>`;
  const lam = (c: V): string => `<path class="pp-mem" d="M${c[0] - 200},${c[1] - 9}h400v18h-400z"/>`;
  const arrow = (d: string): string => `<path class="ppa-ar" stroke="#3d3d3a" style="stroke-width:3" d="${d}" marker-end="url(#${p}-cyh)"/>`;
  return `<g data-k="cyc" opacity="0" display="none">
    <defs><marker id="${p}-cyh" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10z" fill="#3d3d3a"/></marker>
      <filter id="${p}-cysh" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
    <rect class="pp12-opaque" x="${CYC.x}" y="${CYC.y}" width="${CYC.w}" height="${CYC.h}" rx="22" filter="url(#${p}-cysh)"/>
    ${lab('D1 repair cycle of photosystem II', 'ppa-big', CYC.x + 36, CYC.y + 58)}
    ${stack(G)}${lam(U)}
    ${lab('grana', 'ppa-t', G[0], G[1] + 120, 'middle')}${lab('unstacked membrane', 'ppa-t', U[0], U[1] + 82, 'middle')}
    ${arrow(`M${G[0] + 210},${G[1] + 30} Q${U[0] - 20},${G[1] + 20} ${U[0] + 10},${U[1] - 70}`)}
    ${arrow(`M${U[0] - 220},${U[1] + 10} Q${G[0] - 60},${U[1] + 30} ${G[0] - 120},${G[1] + 140}`)}
    ${lab('damaged photosystem II', 'ppa-l', 800, 226, 'start')}${lab('moves out', 'ppa-l', 800, 252, 'start')}
    ${lab('damaged D1 removed,', 'ppa-l ppa-red', U[0], U[1] + 124, 'middle')}${lab('new D1 inserted', 'ppa-l ppa-green', U[0], U[1] + 150, 'middle')}
    ${lab('back to', 'ppa-l', 330, 560, 'end')}${lab('the grana', 'ppa-l', 330, 586, 'end')}
    ${lab('light damages D1', 'ppa-l ppa-red', G[0] - 210, G[1] - 96, 'start')}
    <g data-k="zap" opacity="0" display="none">${[-40, 0, 40].map(dx => `<path class="ppa-ar" stroke="#e0a21a" style="stroke-width:3.4" d="M${G[0] + dx - 6},${G[1] - 150}l10,24l-12,8l14,30" marker-end="url(#${p}-cyz)"/>`).join('')}</g>
    <defs><marker id="${p}-cyz" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L10,5L0,10z" fill="#e0a21a"/></marker></defs>
    <g data-k="icon">${ps2Icon()}</g>
    <text class="ppa-cr" x="${CYC.x + CYC.w - 20}" y="${CYC.y + CYC.h - 14}" text-anchor="end">drawn after Järvi, Suorsa &amp; Aro 2015, BBA Bioenerg. 1847: 900, Fig. 1</text></g>`;
}

/* ---------------------------------------------------------------- the staging */

export const STAGING: Staging = (() => {
  const P = 'pp12c';
  const chain = taggedChain(`${P}a`, 'glow', LIT12);
  return {
    id: 'c',
    name: 'C · History first (Li 2000)',
    note: 'Opens on the puzzle of the npq4 plants (Li et al. 2000), then the antenna zoom (PsbS, zeaxanthin, heat), the D1 repair cycle drawn after Järvi 2015, and the VPZ field trial.',
    beats: PP12_HISTORY,
    holds: [[0], [], [B3.hold]],
    svg: () => `<g data-k="cam"><g class="fig">${slideCard(P)}${chainGroup('chainA', 'glow', chain)}${storySvg(P)}</g></g>
      ${liCard(P, 'li', 560, 40, 700, 390)}
      ${cycleSvg(P)}
      ${fieldCard(P, 'kr', 1294, 120, 292)}`,
    bind(stage) {
      const S = setters(stage), { q, set, op } = S, put0 = putter(S);
      const cs = counterScaler(q('chainA'), S);
      const uptake = Array.from(q('chainA').querySelectorAll('[data-p="pq-h-in"]'));
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t2 = T(1), t3 = T(2), t4 = T(3);

        const e = mv(t2, B2.cam, B2.camD) * (1 - mv(t4, B4.cam, B4.camD));
        const cam = tween(WHOLE, Z, e), k = kOf(cam.s);
        set(q('cam'), 'transform', tfStr(cam));
        cs(k);
        const close = b === 1 || b === 2 ? 1 : b === 3 ? 1 - fade(tt, B4.labsOut, 0.3) : 0;
        uptake.forEach(g => op(g, b === 0 ? 1 : b === 1 ? 1 - fade(tt, B2.cam, 0.3) : b === 2 ? 0 : fade(tt, B4.cam + B4.camD - 0.3, 0.3)));

        const strong = fade(t2, B2.light, 0.5) * (1 - fade(t4, B4.lightOut, 0.5));
        const bind = mv(t2, B2.bind, B2.bindD), conv = mv(t2, B2.conv, B2.convD);
        const dots = MORE.map((at, i) => {
          const u = fade(t2, B2.h0 + i * B2.hDt, 0.15), out = fade(t4, B4.hOut + i * B4.hDt, 0.25);
          return { p: (i < 2 ? lerpV(at, SITES[i], bind) : at) as V, u, o: u * (1 - out) };
        });
        const st: StoryState = {
          strong, cl: mv(t4, B4.cloud, B4.cloudD), clOn: b === 3 ? fade(tt, B4.cloud, 0.2) : 0, dots, conv,
          heat: fade(t2, B2.heat, 0.3), fl: fade(t2, B2.labs - 0.1, 0.3) * close, lb: fade(t2, B2.labs, 0.25) * close,
          soOn: 0, hit: 0, flash: 0, dmg: 0, swap: 0,
        };
        drawStory(S, put0, st, '', k, 1);

        /* ---- clippings */
        op(q('li'), b === 0 ? fade(tt, B1.card, 0.15) : 0);
        op(q('li-ring'), b === 0 ? fade(tt, B1.ring, 0.15) : 0);
        op(q('kr'), b === 3 ? fade(tt, B4.kcard, 0.15) : 0);

        /* ---- the repair cycle (beat 3) */
        op(q('cyc'), b === 2 ? fade(tt, B3.card, 0.15) : 0);
        const go = mv(t3, B3.go, B3.goD), back = mv(t3, B3.back, B3.backD);
        const mid: V = [U[0] - 40, G[1] + 40], mid2: V = [G[0] - 60, U[1] + 20];
        const bz = (a: V, c: V, z: V, u: number): V => [lerp(lerp(a[0], c[0], u), lerp(c[0], z[0], u), u), lerp(lerp(a[1], c[1], u), lerp(c[1], z[1], u), u)];
        const at = back > 0 ? bz(U, mid2, G, back) : bz(G, mid, U, go);
        set(q('icon'), 'transform', `translate(${f1(at[0])} ${f1(at[1])})`);
        const dmg = fade(t3, B3.dmg, 0.15), rm = mv(t3, B3.rm, B3.rmD), nw = mv(t3, B3.nw, B3.nwD);
        op(q('zap'), b === 2 ? fade(tt, B3.zap, 0.1) * (1 - fade(tt, B3.go, 0.2)) : 0);
        op(q('d1ok'), 1 - dmg);
        op(q('d1dmg'), dmg * (1 - rm));
        op(q('d1gone'), rm * (1 - nw));
        op(q('d1new'), nw);
      };
    },
  };
})();
