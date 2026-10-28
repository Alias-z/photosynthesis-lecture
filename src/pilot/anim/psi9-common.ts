// Photosystem I on the slide 9 schema (script approved by the lecturer, 28 Oct 2026): the parts both stagings (psi9-a,
// psi9-b) share. The stage IS the slide 9 figure: focusSvg() of figs/chain.ts with LIT_PSI, as figs/l09c.ts draws it
// (9a = look 'bil', c2c; 9b = look 'glow', c2c3), in the slide's figure card. The camera zooms into photosystem I, the
// story plays there, and the camera zooms back out to the whole chain, which ends exactly as on the slide, with ATP
// synthase starting to light.
// - Beat 1 (opens on the slide figure; one click): zoom in; plastocyanin, carrying an electron, docks on photosystem I's
//   lumen side; light arrives; the reaction centre sends its electron across the membrane to ferredoxin on the stroma
//   side and is left with an empty place; plastocyanin's electron refills it.
// - Beat 2: the electron goes on from ferredoxin to FNR and to NADP⁺, which takes an H⁺ from the stroma: NADPH.
// - Beat 3: a card with Emerson's portrait and his 1957 graph (as a newsprint clipping) appears on the right.
// - Beat 4: the card goes; plastocyanin leaves as the camera zooms out to the whole chain; a 650 nm photon reaches
//   photosystem II, a far-red one photosystem I; the slide's own light arrows return; ATP synthase starts to light.
//
// How the slide figure is reused (figs/chain.ts is not modified), as in psii7-common.ts:
// - focusSvg() wraps every part's markup in <g class="chn-on|off">. The part of each wrapper is found by drawing the view
//   once per part with only that part lit; the wrappers are then tagged data-p="<part>", so the story can hide the lit
//   arrows of photosystem I while it tells them, move plastocyanin, and fade in the lit copy of ATP synthase (taken from
//   a second drawing with ATP synthase lit, so both looks light it exactly as the slides that light it).
// - Positions come from chain.ts's GEO (the anchors its own arrows use: P700, F_A/F_B, plastocyanin, ferredoxin, FNR,
//   PSII's oxygen-evolving and Q_B sites) and from the drawing (the plastocyanin label).
// - Plastocyanin docks under P700, against photosystem I's lumenal face (the render's lowest opaque row there is at
//   y ≈ 335 in figure units), as in Nelson & Ben-Shem 2004, Fig. 5. PSII's reaction centre is drawn 36.5 % of the way
//   from the oxygen-evolving site to Q_B, as in psii7-common.ts.
// - The camera scales the whole schema; text, dots and atoms are counter-scaled by (s/s₀)^−0.7.
//
// Images: emerson-nas.png (assets/anim/antenna; source in antenna-common.ts); emerson1957-enhancement.png (Emerson,
// Chalmers & Cederstrand 1957, PNAS 43:133, Figs. 2–3, PMC page scan; reference board L5, image d), shown cropped to the
// plot (the printed caption left out) and printed onto the newsprint by multiply blending.
import '../figs/clipping.css';
import './psi9-common.css';
import emersonImg from '../../assets/anim/antenna/emerson-nas.png';
import graphImg from '../../assets/refs/L5-electron-transport/emerson1957-enhancement.png';
import { focusSvg, GEO, LIT_PSI, type FocusLook, type Part } from '../figs/chain';
import { cutPath, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';
import type { Staging } from './types';

/* ---------------------------------------------------------------- the slide figure, tagged by part */

const PARTS: Part[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];

const view = (id: string, look: FocusLook, lit: Part[]): string => focusSvg(id, { look, lit, say: '' });

interface Wrap { a: number; b: number; inner: string; on: boolean }
/** The part wrappers of a chain drawing, in document order (they never nest; their content may hold other groups). */
function wraps(s: string): Wrap[] {
  const out: Wrap[] = [], re = /<g class="chn-(on|off)">/g, tag = /<g[\s>]|<\/g>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const i0 = m.index + m[0].length;
    let depth = 1, i = i0, t: RegExpExecArray | null;
    tag.lastIndex = i0;
    while (depth && (t = tag.exec(s))) { depth += t[0] === '</g>' ? -1 : 1; i = tag.lastIndex; }
    out.push({ a: m.index, b: i, inner: s.slice(i0, i - 4), on: m[1] === 'on' });
    re.lastIndex = i;
  }
  return out;
}
/** The part of each wrapper: draw the view with one part lit at a time. */
function partsOf(look: FocusLook): Array<Part | null> {
  const out: Array<Part | null> = wraps(view('p9probe', look, [])).map(() => null);
  for (const p of PARTS) wraps(view('p9probe', look, [p])).forEach((w, i) => { if (w.on) out[i] = p; });
  return out;
}
const strip = (s: string): string => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const esc = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NUM = '(-?[\\d.]+)';
function textOf(s: string, cls: string, content: string, dflt: V): V {
  const m = new RegExp(`<text class="${cls}" x="${NUM}" y="${NUM}"[^>]*>${esc(content)}</text>`).exec(s);
  return m ? [Number(m[1]), Number(m[2])] : dflt;
}

interface Scene { svg: string; cls: string; pcLab: V }
function scene(id: string, look: FocusLook): Scene {
  const raw = view(id, look, LIT_PSI), base = strip(raw), lit = strip(view(id, look, [...LIT_PSI, 'atps']));
  const cls = (/^<svg class="([^"]*)"/.exec(raw)?.[1] ?? `chn chn-${look}`).replace('fig-svg', '').trim();
  const parts = partsOf(look), wb = wraps(base), wl = wraps(lit);
  let svg = '', at = 0;
  wb.forEach((w, i) => {
    const p = parts[i] ?? 'x';
    svg += `${base.slice(at, w.a)}<g class="chn-${w.on ? 'on' : 'off'}" data-p="${p}">${w.inner}</g>`;
    if (p === 'atps' && wl[i]) svg += `<g class="chn-on" data-p="atps-lit" opacity="0">${wl[i].inner}</g>`;
    at = w.b;
  });
  svg += base.slice(at);
  // the glow pool of plastocyanin (look c2c3) moves with it
  const pc = GEO.pc;
  svg = svg.replace(new RegExp(`<ellipse cx="${NUM}" cy="${NUM}"([^>]*)fill="url\\(#${esc(id)}-pool2\\)"/>`, 'g'),
    (all, x: string, y: string) => (Math.hypot(Number(x) - pc[0], Number(y) - pc[1]) < 2 ? all.replace('<ellipse', '<ellipse data-k="pcpool"') : all));
  const pcInner = wb.filter((_, i) => parts[i] === 'pc').map(w => w.inner).join('');
  return { svg, cls, pcLab: textOf(pcInner, 'chn-in', 'plastocyanin', [pc[0], pc[1] + 44]) };
}

/* ---------------------------------------------------------------- where the story happens (figure units) */

const P700 = GEO.p700, FAB = GEO.fab, FD = GEO.fd, PC = GEO.pc;
/** Plastocyanin docked under P700, touching photosystem I's lumenal face. */
const DOCK: V = [P700[0] - 2, 352];
/** PSII's reaction centre (beat 4's flash). */
const RC2: V = lerpV(GEO.oec, GEO.qb, 0.365);
/** The electron on FNR (upper left, clear of its label), at NADP⁺, and where NADP⁺ / NADPH are written. */
const ON_FNR: V = [GEO.fnr[0] - 18, GEO.fnr[1] - 8];
const NP: V = [540, 104];
const AT_NP: V = [NP[0] + 4, NP[1] + 9];
/** The H⁺ that NADP⁺ takes from the stroma: where it waits (below left, in open stroma), where it joins. */
const H0: V = [492, 128], H1: V = [NP[0] - 26, NP[1] - 5];
/** The two light paths of the slide (pdbStyle): to PSII (dimmed on slide 9) and to PSI; their labels. */
const L2: [V, V] = [[60, 92], [72, 258]], L1: [V, V] = [[372, 100], [446, 246]];
const L2LAB: V = [76, 90], L1LAB: V = [364, 104];

/* ---------------------------------------------------------------- views */

/** The whole chain: the slide's figure card (860 × 642 px around the 800 × 600 figure drawn at 0.97) fills the stage. */
const B: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** Photosystem I, close: figure x 72–800 and y 60–396, so NADP⁺ (stroma) and the docked plastocyanin with its label
 *  (lumen) both show, and the view stays inside the drawn stroma and lumen; photosystem I sits left of the card's place. */
const ZS = 2.2;
const Z: Tf = { s: ZS, t: [800 - ZS * 436, 370 - ZS * 228] };
/** Text and glyph scale for a camera scale s. */
const kOf = (s: number): number => (s / B.s) ** -0.7;
/** The slide's figure card, in figure units (pilot.css .lay-figure .fig). */
const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };
/** Labels that only the close view needs (the slide's own are out of view there). */
const ZL = { stroma: [90, 150] as V, lumen: [90, 389] as V, psi: [588, 382] as V };

/* ---------------------------------------------------------------- timing (s into each beat) */

/** A move of about 1 s: 0 → 1 from t0 over d, eased at both ends. */
const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** A short pulse: up over 0.12 s from t0, down by t0 + 0.6. */
const pulse = (t: number, t0: number): number => tw(t, t0, t0 + 0.12) * (1 - tw(t, t0 + 0.25, t0 + 0.6));
/** A point on the quadratic Bézier a → c → b. */
const bez = (a: V, c: V, b: V, u: number): V => {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
};

// Beat 1: zoom in (1.1 s) while the lit arrows give way; plastocyanin docks; light; the jump; the refill.
const B1 = { zoom: 0.05, flowsOut: [0.05, 0.4], pcE: 0.35, dock: 0.5, dockD: 0.85, rc: 1.05, light: 1.4, flash: 1.85, jump: 1.95, refill: 2.75, end: 3.45 };
const JUMP = 0.65, REFILL = 0.55;
// Beat 2: NADP⁺ and H⁺ appear; ferredoxin → FNR; FNR → NADP⁺ with the H⁺; NADPH.
const B2 = { nIn: 0.0, fdFnr: 0.15, fdFnrD: 0.75, toN: 1.05, toND: 0.7, merge: 1.8, end: 2.2 };
// Beat 3: the card.
const B3 = { card: 0, end: 0.4 };
// Beat 4: the card goes; zoom out with plastocyanin leaving; the slide's arrows return; two photons; the slide's light;
// ATP synthase starts to light.
const B4 = { cardOut: 0, out: 0.2, outD: 1.2, flowsIn: 1.35, p650: 1.75, pfr: 2.5, reveal: 0.55, back: 3.6, atps: 4.0, end: 4.7 };
const TEND = [B1.end, B2.end, B3.end, B4.end];
/** How lit ATP synthase gets at the end: it starts to light. */
const ATPS_END = 0.6;

/* ---------------------------------------------------------------- glyphs: drawn round their origin at the slide's size */

const glyph = (k: string, inner: string, o = 0): string => `<g data-k="${k}" opacity="${o}">${inner}</g>`;
const lab = (s: string, cls: string, x: number, y: number, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="${a}">${s}</text>`;
const E_DOT = '<circle class="p9-e" r="6"/>';
const H_DOT = '<circle class="chn-hd" r="6.5"/>';

/** Arrowhead with its tip at `tip`, pointing along `dir` (as chain.ts). */
function head(tip: V, dir: V, cls: string, hl = 16, hw = 9): string {
  const L = Math.hypot(dir[0], dir[1]), u: V = [dir[0] / L, dir[1] / L], n: V = [-u[1], u[0]];
  const b: V = [tip[0] - u[0] * hl, tip[1] - u[1] * hl];
  return `<path class="${cls}" d="M${f1(tip[0])},${f1(tip[1])}L${f1(b[0] + n[0] * hw)},${f1(b[1] + n[1] * hw)}L${f1(b[0] - n[0] * hw)},${f1(b[1] - n[1] * hw)}Z"/>`;
}
/** A photon: a wave with a head from a to b, drawn as chain.ts draws light, in its own colour class. */
function photon([a, b]: [V, V], cls: string, n = 4.5, amp = 7): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, pts: string[] = [];
  const stop = 1 - 16 / L;
  for (let i = 0; i <= 80; i++) {
    const t = (i / 80) * stop, w = Math.sin(t * n * 2 * Math.PI) * amp * Math.min(1, (stop - t) * 8);
    pts.push(`${i ? 'L' : 'M'}${f1(a[0] + dx * t - uy * w)},${f1(a[1] + dy * t + ux * w)}`);
  }
  return `<path class="${cls}" d="${pts.join('')}"/>${head(b, [dx, dy], `${cls}h`)}`;
}

function overlaySvg(p: string): string {
  const clip = (k: string): string => `<clipPath id="${p}-${k}"><rect data-k="${k}" x="-200" y="-200" width="1200" height="1000"/></clipPath>`;
  return `<defs><radialGradient id="${p}-rcglow"><stop offset="0" stop-color="#fff4d6"/><stop offset=".4" stop-color="#f6c453" stop-opacity=".9"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
      ${clip('lclip')}${clip('c650')}${clip('cfr')}</defs>
    ${glyph('zl-stroma', lab('stroma', 'chn-zone chn-halo', 0, 0))}${glyph('zl-lumen', lab('lumen', 'chn-zone chn-halo', 0, 0))}
    ${glyph('zl-psi', lab('photosystem I', 'chn-name chn-halo', 0, 0))}
    <g data-k="ph650" opacity="0" clip-path="url(#${p}-c650)">${photon(L2, 'p9-w650')}</g>
    <g data-k="phfr" opacity="0" clip-path="url(#${p}-cfr)">${photon(L1, 'p9-wfr')}</g>
    ${glyph('l-650', lab('650 nm', 'chn-light p9-l650', L2LAB[0], L2LAB[1]))}${glyph('l-fr', lab('far-red', 'chn-light p9-lfr', L1LAB[0], L1LAB[1], 'end'))}
    ${glyph('rcglow', `<circle r="24" fill="url(#${p}-rcglow)"/>`)}${glyph('rcglow2', `<circle r="24" fill="url(#${p}-rcglow)"/>`)}
    ${glyph('rcring', '<circle class="p9-ring" r="7.5"/>')}${glyph('rcdot', E_DOT)}${glyph('pce', E_DOT)}
    ${glyph('nadp', lab('NADP⁺', 'chn-mol', 0, 0, 'middle'))}${glyph('nadph', lab('NADPH', 'chn-mol', 0, 0, 'middle'))}
    ${glyph('hp', H_DOT)}${glyph('l-hp', lab('H⁺', 'chn-hl chn-halo', -10, 7, 'end'))}
    ${glyph('e1', E_DOT)}${glyph('l-e1', lab('e⁻', 'p9-elab chn-halo', -8, -8, 'end'))}`;
}

/* ---------------------------------------------------------------- the card: Emerson, 1957 */

const CD = { x: 1136, y: 22, w: 432, h: 698 };
/** The graph's crop in its page scan (710 × 568 px): the plot with its axis titles, without the printed caption. */
const CROP = [86, 0, 470, 504];
function cardSvg(p: string): string {
  const { x, y, w, h } = CD, pw = 150, ph = 188, px = x + 34, py = y + 30, rx = (px + pw + x + w - 20) / 2;
  const head1 = `<image href="${emersonImg}" x="${px}" y="${py}" width="${pw}" height="${ph}" preserveAspectRatio="xMidYMid slice"/>
    <text class="clip-name p9-cname" x="${f1(rx)}" y="${py + 82}" text-anchor="middle">Emerson</text>
    <text class="clip-find p9-year" x="${f1(rx)}" y="${py + 128}" text-anchor="middle">1957</text>`;
  const gw = 352, gh = (gw * CROP[3]) / CROP[2], m = 14, cw = gw + 2 * m, ch = gh + 2 * m, gx = x + (w - cw) / 2, gy = y + 244;
  const graph = `<g transform="rotate(1.6 ${f1(gx + cw / 2)} ${f1(gy + ch / 2)})">
      <defs><filter id="${p}-gsh" x="-15%" y="-10%" width="130%" height="125%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
      <path class="clip-paper" d="${cutPath(gx, gy, cw, ch, 41)}" filter="url(#${p}-gsh)"/>
      <svg x="${f1(gx + m)}" y="${f1(gy + m)}" width="${gw}" height="${f1(gh)}" viewBox="${CROP.join(' ')}"><image class="p9-mult" href="${graphImg}" width="710" height="568"/></svg>
    </g>`;
  return `<g data-k="card" opacity="0"><g transform="rotate(-1.2 ${x + w / 2} ${y + h / 2})">
    <defs><filter id="${p}-cardsh" x="-10%" y="-6%" width="120%" height="114%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="p9-paper" d="${cutPath(x, y, w, h, 37, 3.2)}" filter="url(#${p}-cardsh)"/>${head1}${graph}</g></g>`;
}

/* ---------------------------------------------------------------- the staging */

export interface Opt { id: string; name: string; note: string; look: FocusLook }

export function makeStaging(o: Opt): Staging {
  const P = `p9${o.id}`;
  const { svg: chain, cls, pcLab } = scene(`${P}c`, o.look);
  // plastocyanin's label: below it, closer in the close view (its text is counter-scaled)
  const LAB_OFF0: V = [pcLab[0] - PC[0], pcLab[1] - PC[1]], LAB_OFFZ: V = [0, 31];

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    holds: [[0]],
    svg: () => `
      <g data-k="cam"><g class="fig">
        <defs><filter id="${P}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
        <rect class="p9-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${P}-sl)"/>
        <g data-k="chain" class="${cls}">${chain}</g>
        ${overlaySvg(P)}
      </g></g>
      ${cardSvg(P)}`,

    bind(stage) {
      const { q, set, op } = setters(stage);
      const chainG = q('chain');
      const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
      const texts = Array.from(chainG.querySelectorAll<SVGTextElement>('text')).map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
      const hds = Array.from(chainG.querySelectorAll<SVGCircleElement>('circle.chn-hd')).map(el => ({ el, r: Number(el.getAttribute('r')) }));
      const light1 = parts('light-psi'), light2 = parts('light-psii');
      light1.forEach(g => g.setAttribute('clip-path', `url(#${P}-lclip)`));
      const flows = ['e-pc-psi', 'e-psi-fd', 'e-fd-fnr', 'e-fnr-nadph', 'nadph'].flatMap(parts);
      const pcW = parts('pc'), pcBody = pcW.filter(g => !g.querySelector('text')), pcText = pcW.filter(g => g.querySelector('text'));
      const pcPool = q('pcpool'), atpsLit = parts('atps-lit');
      // where the word NADPH of the slide's label "NADP⁺ + H⁺ → NADPH" sits (measured once its font is in), so that the
      // story's NADPH can glide there in beat 4 and hand over to the slide's label without a jump
      const nadphText = parts('nadph').map(g => g.querySelector('text')).find(Boolean) ?? null;
      let nadphAt: V = [612, 68];
      const measure = (): void => {
        if (!nadphText) return;
        try {
          const s = nadphText.textContent ?? '', i = s.lastIndexOf('NADPH'), a = nadphText.getStartPositionOfChar(i), z = nadphText.getEndPositionOfChar(i + 4);
          if (z.x > a.x) nadphAt = [(a.x + z.x) / 2, Number(nadphText.getAttribute('y'))];
        } catch { /* not laid out yet */ }
      };
      measure();
      void document.fonts?.ready.then(measure);
      /** A glyph at figure point at, scaled k, at opacity o. */
      const put = (k: string, at: V, sc: number, o: number): void => {
        const el = q(k);
        op(el, o);
        if (o > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
      };
      const shift = (els: Element[], d: V): void => els.forEach(el => set(el, 'transform', `translate(${d[0].toFixed(2)} ${d[1].toFixed(2)})`));
      /** A photon drawn in from above by time u (0 → 1) of its reveal. */
      const reveal = (k: string, top: number, bot: number, u: number): void => set(q(k), 'height', f1(lerp(top, bot, smooth(u)) + 200));

      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        /** Seconds into beat n: −1 before it begins, 99 after it. */
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1), t4 = T(3);

        /* ---- camera: in with beat 1, out in beat 4 */
        const zoom = mv(t1, B1.zoom, 1.1) * (1 - mv(t4, B4.out, B4.outD));
        const cam = tween(B, Z, zoom), k = kOf(cam.s);
        set(q('cam'), 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`));
        hds.forEach(({ el, r }) => set(el, 'r', (r * k).toFixed(2)));
        const zl = tw(t1, 0.95, 1.2) * (1 - tw(t4, B4.out, B4.out + 0.3));
        const cardOp = b === 2 ? tw(tt, B3.card, B3.card + 0.25) : b === 3 ? 1 - tw(tt, B4.cardOut, B4.cardOut + 0.25) : 0;
        put('zl-stroma', ZL.stroma, k, zl);
        put('zl-lumen', ZL.lumen, k, zl);
        put('zl-psi', ZL.psi, k, zl * (1 - cardOp)); // the card covers it

        /* ---- the slide's lit arrows of photosystem I give way while the story tells them, and come back after the zoom out */
        const flowsOp = b === 0 ? 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]) : b < 3 ? 0 : tw(tt, B4.flowsIn, B4.flowsIn + 0.5);
        flows.forEach(g => op(g, flowsOp));
        // light at photosystem I: the slide's wave, cleared, then drawn in from above when light arrives (beat 1); in beat 4
        // the photons take the places of both of the slide's light arrows, which return at the end
        let l1Op = 0, l1Y = 1000;
        if (b === 0) {
          if (tt < B1.light - 0.05) l1Op = 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]);
          else { l1Op = 1 - tw(tt, B1.jump + 0.5, B1.jump + 0.8); l1Y = lerp(88, 250, smooth((tt - B1.light) / 0.45)); }
        } else if (b === 3) l1Op = tw(tt, B4.back, B4.back + 0.5);
        light1.forEach(g => op(g, l1Op));
        set(q('lclip'), 'height', f1(l1Y + 200));
        // light at photosystem II (dimmed on slide 9) would be cut by the close view's edge: it goes as the camera zooms in
        const l2Op = b < 3 ? 1 - tw(t1, B1.zoom, B1.zoom + 0.4) : tw(tt, B4.back, B4.back + 0.5);
        light2.forEach(g => op(g, l2Op));

        /* ---- plastocyanin: docks on photosystem I's lumen side (beat 1), leaves as the camera zooms out (beat 4) */
        const dock = mv(t1, B1.dock, B1.dockD), undock = mv(t4, B4.out, B4.outD);
        const pc = undock > 0 ? lerpV(DOCK, PC, undock) : lerpV(PC, DOCK, dock);
        const dPc: V = [pc[0] - PC[0], pc[1] - PC[1]];
        shift(pcBody, dPc);
        if (pcPool) shift([pcPool], dPc);
        const lo = lerpV(LAB_OFF0, LAB_OFFZ, zoom);
        shift(pcText, [pc[0] + lo[0] - pcLab[0], pc[1] + lo[1] - pcLab[1]]);
        const riders = 1 - tw(t4, B4.out, B4.out + 0.3);

        /* ---- the reaction centre: its electron, the flash, the empty place, the refill */
        const fl = b === 0 ? pulse(tt, B1.flash) : b === 3 ? pulse(tt, B4.pfr + B4.reveal - 0.05) : 0;
        put('rcglow', P700, k, fl);
        put('rcglow2', RC2, k, b === 3 ? pulse(tt, B4.p650 + B4.reveal - 0.05) : 0);
        const back = B1.refill + REFILL; // plastocyanin's electron arrives
        const ring = b === 0 ? tw(tt, B1.jump + 0.05, B1.jump + 0.15) * (1 - tw(tt, back - 0.05, back)) : 0;
        put('rcring', P700, k, ring);
        put('rcdot', P700, k, b === 0 ? tw(tt, B1.rc, B1.rc + 0.2) * (tt < B1.jump ? 1 : 0) : 0);
        // plastocyanin's electron: on it from the start of beat 1, up into the reaction centre, there until the zoom out
        const ur = b === 0 ? (tt - B1.refill) / REFILL : 1;
        const pcE: V = ur <= 0 ? pc : lerpV(DOCK, P700, smooth(ur));
        put('pce', pcE, k, (b === 0 ? tw(tt, B1.pcE, B1.pcE + 0.2) : 1) * riders);

        /* ---- the electron: P700 → across the membrane to ferredoxin (beat 1) → FNR → NADP⁺ (beat 2) */
        let e1: V = P700, e1Op = 0;
        if (b === 0) {
          const u = (tt - B1.jump) / JUMP;
          e1 = bez(P700, [FAB[0] - 8, FAB[1] - 14], FD, smooth(u));
          e1Op = u >= 0 ? 1 : 0;
        } else if (b === 1) {
          const u1 = (tt - B2.fdFnr) / B2.fdFnrD, u2 = (tt - B2.toN) / B2.toND;
          e1 = u2 > 0 ? bez(ON_FNR, [ON_FNR[0] - 4, (ON_FNR[1] + AT_NP[1]) / 2], AT_NP, smoother(u2)) : bez(FD, [FD[0] + 32, FD[1] - 12], ON_FNR, smoother(u1));
          e1Op = 1 - tw(tt, B2.merge, B2.merge + 0.2);
        }
        put('e1', e1, k, e1Op);
        // the e⁻ label: on the reaction centre's electron, then with it to ferredoxin, FNR and NADP⁺
        const eLab = b === 0 ? tw(tt, B1.rc, B1.rc + 0.2) : b === 1 ? 1 - tw(tt, B2.merge - 0.25, B2.merge) : 0;
        const eAt = b === 0 && tt < B1.jump ? P700 : e1;
        put('l-e1', [eAt[0] - 4 * k, eAt[1] - 4 * k], k, eLab);

        /* ---- NADP⁺ + H⁺ → NADPH in the stroma (beat 2); the slide's own label takes over in beat 4 */
        const nIn = tw(t2, B2.nIn, B2.nIn + 0.3), merged = tw(t2, B2.merge + 0.1, B2.merge + 0.3);
        put('nadp', NP, k, nIn * (1 - tw(t2, B2.merge, B2.merge + 0.15)));
        put('nadph', lerpV(NP, nadphAt, mv(t4, B4.out, B4.outD)), k, merged * (b === 3 ? 1 - tw(tt, B4.flowsIn, B4.flowsIn + 0.5) : 1));
        const hAt = lerpV(H0, H1, mv(t2, B2.toN, B2.toND));
        put('hp', hAt, k, nIn * (1 - merged));
        put('l-hp', H0, k, nIn * (1 - tw(t2, B2.toN, B2.toN + 0.2)));

        /* ---- the card (beat 3) */
        op(q('card'), cardOp);

        /* ---- two photons (beat 4): 650 nm to photosystem II, far-red to photosystem I */
        const u650 = (t4 - B4.p650) / B4.reveal, ufr = (t4 - B4.pfr) / B4.reveal, gone = 1 - tw(t4, B4.back, B4.back + 0.4);
        op(q('ph650'), (u650 >= 0 ? 1 : 0) * gone);
        reveal('c650', L2[0][1] - 4, L2[1][1], u650);
        op(q('phfr'), (ufr >= 0 ? 1 : 0) * gone);
        reveal('cfr', L1[0][1] - 4, L1[1][1], ufr);
        op(q('l-650'), tw(u650, 0, 0.3) * gone);
        op(q('l-fr'), tw(ufr, 0, 0.3) * gone);

        /* ---- ATP synthase starts to light */
        atpsLit.forEach(g => op(g, ATPS_END * tw(t4, B4.atps, B4.atps + 0.6)));
      };
    },
  };
}
