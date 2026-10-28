// cb1, staging story · slide 16 (C₃ photosynthesis), beats CB1V3 (lecturer, 29 Oct 2026, evening: "first Calvin's spots
// to the cycle, the general sketch; then dive into the carbon bookkeeping with 3 CO₂, how the energy is transferred; then
// back to the final sketch, so it is clear why only 1 goes out, why 3 CO₂ is the minimum, and the energy used").
// One story from 2 existing stagings, each in its own layer (its own nested <svg>, so their data-k names never meet),
// cross-faded between the parts; each part keeps its own fixed framing:
// - beats 1–3, staging q (cb1-q.ts): the lollipop; the 5 s film, 3-PGA lit; the cycle drawn after Bassham 1954
//   (q's reduction beat, then its regeneration beat), with no counts on the cycle;
// - beats 4–6, staging k2 (dk-cb1k2.ts): the strip, per 3 CO₂, with ATP and NADPH from the thylakoid and the spent
//   carriers back (k2's beats 2–4; its film card, tracer glow and small line box are left out);
// - beat 7, staging q again: its last beat, the cycle now with its counts; the 2 lines and the question big on the stage.
import { CB1V3 } from './beats-cb1k';
import { STAGING_BASE as Q } from './cb1-q';
import { STAGING_BASE as K2 } from './dk-cb1k2';
import { withKeys } from './stage-keys-cb';
import type { Staging } from './types';

type Part = 'q' | 'k2';
/** The end state of a beat (the player's convention for "seconds into a beat"). */
const END = 3600;
/** Story beat 3 plays q's reduction beat for this long, then q's regeneration beat. */
const Q_RED = 5.4;
/** Story beat 4 enters k2's carboxylation beat at its step B (the film step is beat 2's, on q's stage). */
const K2_B = 2.4;
/** The cross-fade between the parts (s). */
const FADE = 0.5;
/** Story beat 4 waits, still, after the switch to the strip until the lecturer clicks (lecturer, 29 Oct 2026: "add a
 *  pause; do not let the CO₂ start immediately; let me click"): the strip is held at its start for PAUSE s, with a click
 *  stop at HOLD4. */
const PAUSE = 0.9, HOLD4 = 0.8;

/** Which part draws story beat b at t, as which of its own beats and seconds. */
function step(b: number, t: number): { part: Part; beat: number; t: number } {
  if (b <= 1) return { part: 'q', beat: b, t };
  if (b === 2) return t < Q_RED ? { part: 'q', beat: 2, t } : { part: 'q', beat: 3, t: t - Q_RED };
  if (b <= 5) return { part: 'k2', beat: b - 2, t: b === 3 ? K2_B + Math.max(0, t - PAUSE) : t };
  return { part: 'q', beat: 4, t };
}
const ease = (t: number, t0: number, t1: number): number => { const u = Math.max(0, Math.min(1, (t - t0) / (t1 - t0))); return u * u * (3 - 2 * u); };

const layer = (part: Part, inner: string): string =>
  `<svg data-part="${part}" x="0" y="0" width="1600" height="740" viewBox="0 0 1600 740" overflow="visible" style="pointer-events:none">${inner}</svg>`;

const BASE: Staging = {
  id: 'story',
  name: 'Story: spots → cycle → per 3 CO₂ → cycle',
  note: 'Calvin’s lollipop and 5 s film, the cycle drawn after Bassham 1954 without counts; then 3 CO₂ step by step on the strip with ATP, NADPH and the spent carriers; back to the cycle with its counts, 3 RuBP = 15 C = 5 × 3 C and 9 ATP + 6 NADPH used.',
  beats: CB1V3,
  holds: [[], [], [], [HOLD4], [], [], []],
  svg: () => `${layer('q', Q.svg())}${layer('k2', K2.svg())}`,
  bind(stage) {
    const qs = stage.querySelector<SVGSVGElement>('svg[data-part="q"]')!, ks = stage.querySelector<SVGSVGElement>('svg[data-part="k2"]')!;
    const drawQ = Q.bind(qs), drawK = K2.bind(ks);
    const inQ = (k: string): SVGElement[] => Array.from(qs.querySelectorAll<SVGElement>(`[data-k="${k}"]`));
    // q: the counts on the cycle (hidden until beat 7), its small line panel (the lines are big on the stage instead)
    const cntT = ['n-pga-n', 'n-tp-n', 'n-tp-p'].flatMap(inQ), cntG = ['k-back', 'k-out'].flatMap(inQ);
    const ledger = ['ledger', 'lg-3', 'lg-9'].flatMap(inQ);
    const co2Lab = qs.querySelector<SVGTextElement>('[data-k="co2"] text.cq-name');
    // k2: its lollipop and film cards, the tracer's glow and its line box belong to other beats of this story
    const kHide = ['c-lol', 'c-film', 'c-ring', 'p14', 'c14', 'ln', 'ln-why', 'ln-used'].flatMap(k => Array.from(ks.querySelectorAll<SVGElement>(`[data-k="${k}"]`)));
    ledger.forEach(el => { el.style.display = 'none'; });
    kHide.forEach(el => { el.style.display = 'none'; });
    return (beat, t) => {
      const b = Math.round(beat), s = step(b, t);
      // the parts: q in beats 1–3 and 7, k2 in beats 4–6; at each switch the old part holds its end state while it fades
      const qOp = b <= 2 ? 1 : b === 3 ? 1 - ease(t, 0, FADE) : b === 6 ? ease(t, 0, FADE) : 0;
      const kOp = b <= 2 ? 0 : b === 3 ? ease(t, 0, FADE) : b === 6 ? 1 - ease(t, 0, FADE) : 1;
      qs.style.opacity = qOp.toFixed(3); ks.style.opacity = kOp.toFixed(3);
      if (s.part === 'q') drawQ(s.beat, s.t); else if (qOp > 0.004) drawQ(3, END);
      if (s.part === 'k2') drawK(s.beat, s.t); else if (kOp > 0.004) drawK(3, END);
      // the counts: none on the general sketch (beats 1–3); in beat 7 they come in after the switch
      const c = b === 6 ? ease(t, 0.9, 1.4) : 0;
      cntT.forEach(el => { el.style.fillOpacity = c.toFixed(3); el.style.strokeOpacity = c.toFixed(3); });
      cntG.forEach(el => { el.style.opacity = c.toFixed(3); });
      if (co2Lab) co2Lab.textContent = b === 6 && c > 0.5 ? '3 CO₂' : 'CO₂';
    };
  },
};

/** Each beat's key line and the closing question, big on the stage (lecturer, 29 Oct 2026). */
export const STAGING = withKeys(BASE, [
  { beat: 1, lines: ['First product: 3-PGA'], x: 630, y: 360, size: 40, at: 1.5 },
  { beat: 2, lines: ['The path is a cycle'], x: 1218, y: 622, size: 40, at: Q_RED + 3.6 },
  { beat: 3, lines: ['RuBisCO fixes CO₂'], x: 1370, y: 300, size: 38, at: PAUSE + 1.0 },
  { beat: 4, lines: ['ATP and NADPH make', 'triose phosphate'], x: 1370, y: 300, size: 36, at: 1.0 },
  { beat: 5, lines: ['5 back to RuBP, 1 out'], x: 1370, y: 330, size: 36, at: 1.0 },
  { beat: 6, lines: ['3 RuBP = 15 C = 5 × 3 C', '9 ATP + 6 NADPH used'], x: 800, y: 600, size: 40, at: 1.2 },
  // "where does it go? What do you mean, it?" (lecturer, 29 Oct 2026): the question names what leaves the cycle
  { beat: 6, lines: ['Where does the triose phosphate', 'that leaves the cycle go?'], x: 1110, y: 610, size: 44, at: 2.0 },  // under the Bassham card, clear of the cycle
]);
