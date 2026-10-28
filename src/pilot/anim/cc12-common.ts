// C12 · C₄ photosynthesis: the story pieces the stagings (cc12-a …) share. Facts:
// - Hatch & Slack 1966 (Biochem J 101:103; abstract via Europe PMC, Fig. 2 scan on the board): sugarcane leaves in ¹⁴CO₂,
//   after ≈ 1 s more than 93 % of the fixed ¹⁴C in malate, aspartate and oxaloacetate; later in 3-PGA, hexose phosphates,
//   sucrose.
// - Haberlandt 1904 (Physiologische Pflanzenanatomie, 3rd edn, Fig. 105): the "Kranztypus".
// - Sage, Sage & Kocacinar 2012 Fig. 1 (board image): CO₂ ≈ 100 µmol mol⁻¹ in the mesophyll, ≈ 1500 in the bundle sheath.
// - von Caemmerer 2021 (J Exp Bot, full text, phase 1): 2 ATP per PEP regenerated.
// - Ehleringer & Björkman 1977 (Plant Physiol 59:86, phase 1 fact-check): quantum yield in air, C₄ Atriplex rosea 0.053 at
//   12–39 °C; C₃ Encelia californica 0.069 at 14 °C, 0.0524 at 30 °C, 0.042 at 38 °C.
import { draw as drawC12 } from '../figs/cc12';
import { bead, card, clipping, co2G, credit, f1, label, photo, pop, strip, tw, tx, type PanelGeo, type S, type V } from './cc-anim-kit';
import type { Flyer } from './cc11-common';
import { co2 as co2Glyph } from './l2-glyphs';
import hatch from '../../assets/photos/cc-hatch-slack.png';

export { drawC12 };
/** A slide figure of C12 with its id prefix replaced (no clashes with the slide on the page). */
export const fig12 = (id: string, from: string, to: string): string => strip(drawC12(id)).split(from).join(to);
/** The fed line of the Hatch & Slack card, "sugarcane leaves in ¹⁴CO₂, after ≈ 1 s:", with the ¹⁴CO₂ glyph (the isotope a
 *  purple ball, labelled ¹⁴C, as every isotope in the deck) beside its name; the words are the card's own. */
export const fedLine = (x: number, y: number): string => {
  const w = 216; // "sugarcane leaves in" at 23 px Inter (measured 214)
  return `${tx(x, y, 'sugarcane leaves in', 'cca-l', 'start')}<g transform="translate(${f1(x + w + 40)} ${y - 8})">${co2Glyph(0, 0, 11, '¹⁴C')}</g>`
    + tx(x + w + 80, y, '¹⁴CO₂, after ≈ 1 s:', 'cca-l', 'start');
};

/** An ATP tag (stage px): the deck's clay energy-carrier tag (pilot.css tag-atp), the size of figs/chain.ts tagG. */
export const atp = (): string => `<rect class="tag-atp" x="-27" y="-14" width="54" height="28" rx="8"/><text x="0" y="6.5" text-anchor="middle" style="font:600 18px Inter,&quot;Helvetica Neue&quot;,Arial,sans-serif;fill:#2b2a27">ATP</text>`;

/* ---------------------------------------------------------------- Hatch & Slack 1966 card */

/** Their Fig. 2 (scan 694 × 670): the plot runs from x ≈ 122 (0 s) to ≈ 612 (150 s). */
const HX0 = 122, HX1 = 640;
export interface Card { svg: string; draw: (S: S, t: number, vis: number) => void }
/** The card: clipping, the > 93 % readout, and their graph drawing itself (a cover slides off it, left to right). */
export function hatchCard(p: string, o: { reveal: [number, number]; labs: number }): Card {
  const X = 40, Y = 22, W = 1520, H = 696;
  const clip = clipping(p, 74, 46, 640, {
    journal: 'Biochemical Journal · 1966',
    title: ['Photosynthesis by sugar-cane leaves.', 'A new carboxylation reaction and the', 'pathway of sugar formation'],
    authors: 'M. D. Hatch and C. R. Slack', rot: -1.2,
  });
  const GX = 790, GW = 650;
  const g = photo(`${p}-g`, hatch, 694, 670, GX, 32, GW, [0, 0, 694, 670], { mult: true });
  const k = GW / 694, gy0 = 32, gh = 670 * k;
  const ro = `${fedLine(96, 384)}
    ${tx(96, 456, '&gt; 93 %', 'cca-big cca-c4c', 'start')}
    ${tx(96, 496, 'of the fixed ¹⁴C in four-carbon acids', 'cca-l', 'start')}
    ${tx(96, 528, '(malate, aspartate, oxaloacetate)', 'cca-s', 'start')}
    ${tx(96, 586, 'not in 3-PGA, as in C₃ leaves', 'cca-l', 'start')}`;
  const labs = `<g data-k="${p}-gl" opacity="0">${label(1120, 70, 'C₄ acids first', { to: g.at(140, 40), cls: 'cca-pt cca-c4t' })}
    ${label(1300, 300, 'later: 3-PGA, sugars', { to: g.at(560, 440) })}</g>`;
  const cover = `<rect data-k="${p}-cov" class="cca-cover cca-cardfill" x="${f1(GX + HX0 * k)}" y="${gy0}" width="${f1((HX1 - HX0) * k)}" height="${f1(gh - 86 * k)}"/>`;
  const svg = `<g data-k="${p}-card" opacity="0"><rect class="cca-veil" x="0" y="0" width="1600" height="740" opacity=".88"/>${card(p, X, Y, W, H, 43)}
    ${clip.svg}${ro}${g.svg}${cover}${labs}
    ${credit(X + W - 26, Y + H - 16, 'Hatch & Slack 1966, Biochem J 101:103, Fig. 2 (scan; free in PMC1270070)')}</g>`;
  return {
    svg,
    draw(S, t, vis) {
      S.op(S.q(`${p}-card`), vis);
      if (vis < 0.004) return;
      const u = tw(t, o.reveal[0], o.reveal[1]);
      S.set(S.q(`${p}-cov`), 'x', f1(GX + (HX0 + (HX1 - HX0) * u) * k));
      S.set(S.q(`${p}-cov`), 'width', f1((HX1 - HX0) * (1 - u) * k));
      S.op(S.q(`${p}-gl`), pop(t, o.labs));
    },
  };
}

/* ---------------------------------------------------------------- Ehleringer & Björkman 1977, as C12 v6 draws it */

/** The slide's v6 graph in a card over the stage, its curves drawn left to right by a cover. */
export function ebCard(p: string, o: { reveal: [number, number] }): Card {
  const k = 1.08, x0 = 800 - 400 * k, y0 = 370 - 300 * k;
  const v6 = fig12('v6', 'fcc12f', `${p}f`);
  // plot area of v6: x 120 … 760 (10 … 40 °C), y 40 … 470
  const svg = `<g data-k="${p}-card" opacity="0"><rect class="cca-veil" x="0" y="0" width="1600" height="740" opacity=".9"/>${card(p, x0 - 40, y0 - 20, 800 * k + 80, 600 * k + 30, 47)}
    <g transform="translate(${f1(x0)} ${f1(y0)}) scale(${k})" class="fcc">${v6}<rect data-k="${p}-cov" class="cca-cover cca-cardfill" x="122" y="30" width="660" height="436"/></g></g>`;
  return {
    svg,
    draw(S, t, vis) {
      S.op(S.q(`${p}-card`), vis);
      if (vis < 0.004) return;
      const u = tw(t, o.reveal[0], o.reveal[1]);
      S.set(S.q(`${p}-cov`), 'x', f1(122 + 660 * u));
      S.set(S.q(`${p}-cov`), 'width', f1(660 * (1 - u)));
    },
  };
}

/* ---------------------------------------------------------------- the pump on a drawn mesophyll | bundle sheath pair */

export interface PumpGeo { co2From: V; pepc: V; acidTo: V; bsIn: V; rubisco: V[]; back: V[] }

/** The forward pump, `n` rounds from t0: CO₂ (as HCO₃⁻) is fixed by PEP carboxylase; the C₄ acid moves into the bundle
 *  sheath; there it releases CO₂, which RuBisCO fixes. World units of the drawing. */
export function pumpFlyers(p: string, beat: number, g: { co2: V[]; acid: V[]; rel: V[][] }, o: { t0: number; n?: number; gap?: number; r?: number }): Flyer[] {
  const out: Flyer[] = [], n = o.n ?? 3, gap = o.gap ?? 0.9, r = o.r ?? 11;
  for (let i = 0; i < n; i++) {
    const t = o.t0 + i * gap;
    out.push({ k: `${p}-in${i}`, glyph: co2G(r), beat, t0: t, d: 0.75, fade: 0.25, path: g.co2 });
    out.push({ k: `${p}-ac${i}`, glyph: bead('cca-c4a', r * 0.95), beat, t0: t + 0.8, d: 0.8, out: 0.12, path: g.acid });
    out.push({ k: `${p}-co${i}`, glyph: co2G(r), beat, t0: t + 1.62, d: 0.6, fade: 0.4, path: g.rel[i % g.rel.length] });
  }
  return out;
}
/** Pyruvate back to the mesophyll, where PEP is regenerated with 2 ATP each (beads from t0, `gap` apart). */
export function backFlyers(p: string, beat: number, path: V[], o: { t0: number; n?: number; gap?: number; r?: number }): Flyer[] {
  return Array.from({ length: o.n ?? 2 }, (_, i) => ({ k: `${p}-py${i}`, glyph: bead('cca-pyr', (o.r ?? 11) * 0.95), beat, t0: o.t0 + i * (o.gap ?? 0.45), d: 1.05, out: 0.2, path }));
}
/** Two ATP coins appear where pyruvate arrives, then are spent (shrink and fade). */
export function drawAtp(S: S, k: string, at: V, t: number, t0: number): void {
  [0, 1].forEach(j => {
    const el = S.q(`${k}${j}`);
    if (!el) return;
    const u = pop(t, t0 + j * 0.12), spent = tw(t, t0 + 0.75, t0 + 1.15);
    S.op(el, u * (1 - spent));
    S.set(el, 'transform', `translate(${f1(at[0] + (j ? 34 : -34))} ${f1(at[1] - 26 * spent)}) scale(${(1 - 0.4 * spent).toFixed(3)})`);
  });
}

/** The pump's paths on the schema's C₄ panel (read from its markup). */
export function c4PanelPaths(g: PanelGeo): { co2: V[]; acid: V[]; rel: V[][]; acidHalf: V[]; bsIn: V; pepc: V; rub: V[] } {
  const bs = g.rects['fcc-bs'][0];
  const kIn = /M([\d.]+),([\d.]+) H([\d.]+)/.exec(g.paths['fcc-r fcc-r-k fcc-thin'][0])!, ac = /M([\d.]+),([\d.]+) H([\d.]+)/.exec(g.paths['fcc-r fcc-r-m'][0])!;
  const cy = +ac[2], pepc: V = [+ac[1] - 32, cy], bsIn: V = [+ac[3] + 14, cy];
  const out = [...g.co2].sort((a, b) => a[0] - b[0])[0];
  const rub = g.cp.filter(c => c.x > bs[0]).map((c): V => [c.x, c.y]).sort((a, b) => a[1] - b[1]);
  return {
    co2: [out, [+kIn[3], cy], [pepc[0] - 26, cy]],
    acid: [[pepc[0] + 32, cy], [+ac[3], cy], bsIn],
    acidHalf: [[pepc[0] + 32, cy], [(pepc[0] + 32 + +ac[3]) / 2, cy], [+ac[3] - 6, cy]],
    rel: [[bsIn, [rub[0][0] + 4, rub[0][1] + 6]], [bsIn, [rub[1][0] - 4, rub[1][1] - 6]]],
    bsIn, pepc, rub,
  };
}
