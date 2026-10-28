// FvCB model (slide C8), animation rf8, staging C: slide C8 v3's storyboard made live, in the structure look (pdb, figure
// C8 v7). No camera move: the slide's schema is shown as three windows, one per limit (RuBisCO · RuBP regeneration ·
// triose-phosphate use) beside a map of the whole schema; as Cᵢ rises, the spotlight moves from window to window
// (each lights its own part of the schema, its frame turns to the limit's colour) while the A/Cᵢ dot moves on the same
// panel as staging A. Beat 5 lights all three, as the slide does. Beats and captions: beats-rf78.ts (RF8); model, curve
// and panel: rf8-common.ts.
import { LIT_C8, LIT_C8C, LIT_C8J, LIT_C8P, type Look, type Part } from '../figs/rf-schema';
import { sb, T } from '../figs/rf-kit';
import { f1, setters } from './antenna-common';
import { bindScene, litCh, schemaCard, sceneSvg, Timeline, VP, WHOLE, type BeatPlan } from './rf78-common';
import { makePanel } from './rf8-common';
import type { Staging } from './types';

type Lim = 'c' | 'j' | 'p';
const LOOK: Look = 'pdb';
const noLim = (q: Part[]): Part[] => q.filter(p => !p.startsWith('lim-'));
const SET: Record<Lim, Part[]> = { c: noLim(LIT_C8C), j: noLim(LIT_C8J), p: noLim(LIT_C8P) };
/** The windows on the stage [x, y, w, h] and the schema region each shows [x, y, w, h] (figure units). */
const PAD = 14, GAP = 12, WW = (VP.w - 2 * PAD - GAP) / 2, WH = (VP.h - 2 * PAD - GAP) / 2;
const X0 = VP.x + PAD, Y0 = VP.y + PAD, X1 = X0 + WW + GAP, Y1 = Y0 + WH + GAP;
const WIN: Record<Lim | 'm', { box: [number, number, number, number]; view: [number, number, number, number] }> = {
  c: { box: [X0, Y0, WW, WH], view: [124, 286, 424, 313] },
  j: { box: [X1, Y0, WW, WH], view: [118, 40, 450, 333] },
  p: { box: [X0, Y1, WW, WH], view: [196, -52, 470, 347] },
  m: { box: [X1, Y1, WW, WH], view: [0, 0, 800, 600] },
};
const Aa = (k: string): string => `<tspan font-style="italic">A</tspan>${sb(k)}`;
const TITLE: Record<Lim, string> = { c: `${Aa('c')}: RuBisCO`, j: `${Aa('j')}: RuBP regeneration`, p: `${Aa('p')}: triose-phosphate use` };

export const STAGING: Staging = (() => {
  const P = 'r8c';
  const panel = makePanel(P, 'drawn');
  const act = (c: number, j: number, p: number): Record<string, number> => ({ 'a:c': c, 'a:j': j, 'a:p': p });
  const mapLit = (q: Part[]): Record<string, number> => litCh(q);
  const beats: BeatPlan[] = [
    { end: 3.2, moves: [
      { at: 0.05, d: 0.4, to: { ...act(1, 0, 0), ...mapLit(LIT_C8C) } },
      { at: 0.5, d: 0.3, to: { 'o:pc': 1 } },
      { at: 0.6, d: 2.3, to: { ci: 200 } },
      { at: 1.2, d: 0.3, to: { 'o:lc': 1 } },
    ] },
    { end: 2.8, moves: [
      { at: 0.05, d: 0.4, to: { ...act(1, 1, 0), ...mapLit([...LIT_C8C, ...LIT_C8J]) } },
      { at: 0.3, d: 0.3, to: { 'o:pj': 1 } },
      { at: 0.4, d: 1.5, to: { ci: 300 } },
      { at: 1.9, d: 0.3, to: { 'o:today': 1 } },
    ] },
    { end: 3.2, moves: [
      { at: 0.05, d: 0.4, to: { ...act(0, 1, 0), ...mapLit(LIT_C8J) } },
      { at: 0.6, d: 2.3, to: { ci: 560 } },
      { at: 1.2, d: 0.3, to: { 'o:lj': 1 } },
    ] },
    { end: 3.6, moves: [
      { at: 0.05, d: 0.4, to: { ...act(0, 0, 1), ...mapLit(LIT_C8P) } },
      { at: 0.4, d: 0.3, to: { 'o:pp': 1 } },
      { at: 0.6, d: 2.5, to: { ci: 1200 } },
      { at: 1.6, d: 0.3, to: { 'o:lp': 1 } },
    ] },
    { end: 2.2, moves: [
      { at: 0.05, d: 0.5, to: { ...act(1, 1, 1), ...mapLit(LIT_C8) } },
      { at: 0.6, d: 0.25, to: { 'o:ro': 0 } },
      { at: 0.85, d: 0.3, to: { 'o:cards': 1, 'o:low': 1 } },
    ] },
  ];
  const TL = new Timeline({ ci: 60, 'o:ro': 1, ...act(0, 0, 0), ...mapLit(LIT_C8) }, WHOLE, beats);
  const ENDS = TL.ends;

  const win = (k: Lim | 'm'): string => {
    const { box: [x, y, w, h], view } = WIN[k];
    const title = k === 'm' ? T(x + 14, y + 28, 'whole schema', 'rfk-s rfk-halo') : T(x + 14, y + 30, TITLE[k], `rfk-h${k} rfk-halo`);
    return `<g data-k="w-${k}">
      <svg x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" viewBox="${view.join(' ')}" preserveAspectRatio="xMidYMid meet" overflow="hidden" style="overflow:hidden">
        <g class="fig" data-k="s-${k}">${sceneSvg(`${P}${k}`, LOOK)}</g></svg>
      <rect class="rf78-win" data-k="f-${k}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="12"/>
      <g class="fig"><g class="rfk">${title}</g></g></g>`;
  };
  // the three windows' regions, framed on the map
  const mapMarks = (['c', 'j', 'p'] as Lim[]).map(k => {
    const [mx, my, mw, mh] = WIN.m.box, s = Math.min(mw / 800, mh / 600), ox = mx + (mw - 800 * s) / 2, oy = my + (mh - 600 * s) / 2;
    const [vx, vy, vw, vh] = WIN[k].view;
    return `<rect class="rf78-mark rf78-s${k}" data-k="m-${k}" x="${f1(ox + vx * s)}" y="${f1(oy + vy * s)}" width="${f1(vw * s)}" height="${f1(vh * s)}" rx="4"/>`;
  }).join('');

  return {
    id: 'c',
    name: 'C · Three windows, one per limit (structure look)',
    note: 'Slide C8 v3’s storyboard made live (structure look): three windows on the schema, one per limit, beside a map of the whole; the spotlight moves from window to window as Cᵢ rises, with the same A/Cᵢ dot.',
    svg: () => `${schemaCard(P)}${win('c')}${win('j')}${win('p')}${win('m')}${mapMarks}${panel.svg}
      <g class="fig"><g class="rfk">${T(1568, 650, 'schema: structures PDB 8RUC, 5XNL, 6RQF, 5L8R, 6FKF · after Zhang 2021, MSc thesis, Fig. 2b', 'rfk-cr', 'end')}</g></g>`,
    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const scenes = { c: bindScene(q('s-c'), S), j: bindScene(q('s-j'), S), p: bindScene(q('s-p'), S), m: bindScene(q('s-m'), S) };
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(ENDS.length - 1, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, ENDS[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const V_ = (ch: string): number => TL.v(ch, b, tt);
        (['c', 'j', 'p'] as Lim[]).forEach(k => {
          const u = V_(`a:${k}`), on = new Set(SET[k]);
          scenes[k].light(p => (on.has(p) ? u : 0));
          set(q(`f-${k}`), 'class', `rf78-win${u > 0.5 ? ` rf78-win-on rf78-s${k}` : ''}`);
          op(q(`m-${k}`), 0.35 + 0.65 * u);
        });
        scenes.m.light(p => V_(`L:${p}`));
        panel.draw(S, V_);
      };
    },
  };
})();
