// C13 · CAM: the story pieces the stagings (cc13-a …) share. Facts:
// - Borland, Griffiths, Hartwell & Smith 2009 (J Exp Bot 60:2879; full text via the phase-1 fact-check): Fig. 3A, CO₂
//   exchange of Kalanchoë fedtschenkoi over 24 h, phases I–IV (after Osmond 1978); Table 2, CO₂ gained per water lost,
//   mmol CO₂ per mol H₂O: C₃ 0.5–1.5, C₄ 1–2, CAM 4–10.
// - Abraham et al. 2016 (Nature Plants 2:16178; Fig. 1c read by eye in phase 1): malic acid in mature Agave americana
//   leaves, lowest by day ≈ 5, highest at the end of the night ≈ 24 mg g⁻¹ fresh weight. Only these two values are shown.
// - Heyne 1815 (Trans Linn Soc Lond 11:213–215, read in full, Internet Archive): leaves of Cotyledon calycina (Bryophyllum
//   calycinum) "in the morning as acid as sorrel, if not more so", tasteless about noon, bitterish toward evening; India.
import { draw as drawC13 } from '../figs/cc13';
import { bead, card, co2G, f1, strip, tw, tx, type PanelGeo, type S } from './cc-anim-kit';
import type { Flyer } from './cc11-common';

export const fig13 = (id: string, from: string, to: string): string => strip(drawC13(id)).split(from).join(to);

export interface Card { svg: string; draw: (S: S, t: number, vis: number) => void }
/** A slide figure (800 × 600) in a card over the stage, drawn at scale k; a cover over `rev` (figure units) slides off it
 *  left to right between reveal[0] and reveal[1]. */
export function figCard(p: string, figSvg: string, o: { k?: number; rev: [number, number, number, number]; reveal: [number, number]; cx?: number }): Card {
  const k = o.k ?? 1.06, x0 = (o.cx ?? 800) - 400 * k, y0 = 368 - 300 * k, [rx, ry, rw, rh] = o.rev;
  const svg = `<g data-k="${p}-card" opacity="0"><rect class="cca-veil" x="0" y="0" width="1600" height="740" opacity=".9"/>
    ${card(p, x0 - 36, y0 - 18, 800 * k + 72, 600 * k + 30, 53)}
    <g transform="translate(${f1(x0)} ${f1(y0)}) scale(${k})" class="fcc">${figSvg}<rect data-k="${p}-cov" class="cca-cover cca-cardfill" x="${rx}" y="${ry}" width="${rw}" height="${rh}"/></g></g>`;
  return {
    svg,
    draw(S, t, vis) {
      S.op(S.q(`${p}-card`), vis);
      if (vis < 0.004) return;
      const u = tw(t, o.reveal[0], o.reveal[1]);
      S.set(S.q(`${p}-cov`), 'x', f1(rx + rw * u));
      S.set(S.q(`${p}-cov`), 'width', f1(rw * (1 - u)));
    },
  };
}

/** The malic acid gauge (stage px): a tube whose fill runs from the day level (≈ 5) to the end-of-night level (≈ 24). */
export function gauge(p: string, x: number, y: number): { svg: string; draw: (S: S, level: number, night: number) => void } {
  const H = 330, W = 74, X = x + 40, Y = y + 120;
  const lv = (u: number): number => Y + H - 8 - (H - 16) * (0.2 + 0.8 * u);
  return {
    svg: `<g data-k="${p}-g"><rect class="cca-ro" x="${x}" y="${y}" width="370" height="${H + 186}" rx="18"/>
      ${tx(x + 24, y + 38, 'malic acid in the leaf', 'cca-ro-h', 'start')}
      ${tx(x + 24, y + 70, 'mg per g fresh weight, <tspan font-style="italic">Agave</tspan>', 'cca-s', 'start')}
      <rect class="cca-tube" x="${X}" y="${Y}" width="${W}" height="${H}" rx="${W / 2}"/>
      <rect data-k="${p}-fill" class="fcc-acid" x="${X + 6}" y="${f1(lv(0))}" width="${W - 12}" height="${f1(Y + H - 6 - lv(0))}" rx="${(W - 12) / 2}"/>
      <path class="cca-tk" d="M${X + W + 6},${f1(lv(1))} h18 M${X + W + 6},${f1(lv(0))} h18"/>
      ${tx(X + W + 32, lv(1) + 8, '≈ 24', 'cca-h cca-malc', 'start')}${tx(X + W + 32, lv(1) + 36, 'end of night', 'cca-s', 'start')}
      ${tx(X + W + 32, lv(0) + 8, '≈ 5', 'cca-h', 'start')}${tx(X + W + 32, lv(0) + 36, 'by day', 'cca-s', 'start')}
      <g data-k="${p}-moon"><circle class="fcc-moon" cx="${x + 300}" cy="${y + 34}" r="16"/></g>
      <g data-k="${p}-sun" opacity="0"><circle class="fcc-sun" cx="${x + 300}" cy="${y + 34}" r="16"/></g>
      ${tx(x + 24, y + H + 166, 'read from Abraham et al. 2016, Fig. 1c', 'cca-cr', 'start')}</g>`,
    draw(S, level, night) {
      const top = lv(level);
      S.set(S.q(`${p}-fill`), 'y', f1(top));
      S.set(S.q(`${p}-fill`), 'height', f1(Y + H - 6 - top));
      S.op(S.q(`${p}-moon`), night);
      S.op(S.q(`${p}-sun`), 1 - night);
    },
  };
}

/** The schema's CAM panel (read from its markup): its night and day cells, vacuoles, acid levels, and the CO₂ / malic acid
 *  flyers of a night (CO₂ in through the open stoma, fixed by PEP carboxylase, malic acid into the vacuole) and of a day
 *  (malic acid out of the vacuole, CO₂ to the chloroplasts). */
export function camPanel(P: string, g: PanelGeo, o: { nightBeat: number; dayBeat: number; tN: number; gapN: number; tD: number; gapD: number }) {
  const walls = [...g.rects['fcc-wall']].sort((a, b) => a[0] - b[0]), vac = [...g.rects['fcc-vac']].sort((a, b) => a[0] - b[0]);
  const acid = [...g.rects['fcc-acid']].sort((a, b) => a[0] - b[0]);
  const [night, day] = walls, sy = night[1] + night[3] / 2;
  const cpDay = g.cp.filter(c => c.x > day[0]).sort((a, b) => a.y - b.y);
  const full = acid[0][3], low = acid[1][3], vBot = vac[0][1] + vac[0][3] - 4;
  const nf: Flyer[] = [], df: Flyer[] = [];
  for (let i = 0; i < 4; i++) {
    const t = o.tN + i * o.gapN, j = [-8, 6, -2, 10][i];
    nf.push({ k: `${P}n-c${i}`, glyph: co2G(11), beat: o.nightBeat, t0: t, d: 0.75, fade: 0.25, path: [[night[0] - 40, sy - 4], [night[0] - 12, sy], [night[0] + 8, sy], [vac[0][0] - 14, sy]] });
    nf.push({ k: `${P}n-m${i}`, glyph: bead('cca-mal', 10), beat: o.nightBeat, t0: t + 0.8, d: 0.6, out: 0.15, path: [[vac[0][0] - 10, sy], [vac[0][0] + 10, sy + 6], [vac[0][0] + vac[0][2] / 2 + j, vBot - 20]] });
    const u = o.tD + i * o.gapD, cp = cpDay[i % 2];
    df.push({ k: `${P}d-m${i}`, glyph: bead('cca-mal', 10), beat: o.dayBeat, t0: u, d: 0.55, out: 0.1, path: [[vac[1][0] + vac[1][2] / 2 + j, vBot - 24], [vac[1][0] + 6, vBot - 30], [vac[1][0] - 8, vBot - 36]] });
    df.push({ k: `${P}d-c${i}`, glyph: co2G(11), beat: o.dayBeat, t0: u + 0.6, d: 0.7, fade: 0.4, path: [[vac[1][0] - 8, vBot - 36], [cp.x + 12, (vBot - 36 + cp.y) / 2], [cp.x + 2, cp.y + (i % 2 ? -6 : 8)]] });
  }
  return { night, day, sy, vac, cpDay, full, low, vBot, nf, df };
}
