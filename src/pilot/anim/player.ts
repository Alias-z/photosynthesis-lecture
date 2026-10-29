// The stepped player shared by the lecture animations: a 1600 × 740 stage on Bristol paper and, under it, the
// beat dots, the caption with its tag, the sources it rests on, and Back / Next. The lecturer steps through;
// each beat's motion plays once and then holds, so they can talk over the still. A staging with holds plays each beat
// in steps: Next plays to the next hold and stops there; Back returns to the previous stop.
import './anim.css';
import { STAGE_KEYS } from './stage-keys';
import type { Animation, StageKey, Staging } from './types';

export interface PlayerOptions {
  /** Beat to open on. */
  beat?: number;
  /** Draws the beat frozen at this many seconds, for screenshots of its end state. */
  freeze?: number;
}

/** Animations whose molecules are drawn without the white cap behind them (slides 15 and 20 on; slides 1–19 are frozen). */
const NOCAP_KEYS = ['c2story', 'ov', 'lf11a', 'lf12', 'lf13', 'eff'];
const NOCAP_IDS = ['lf10bc'];
/** Animations shown without any closing question, on the stage or in the caption (slides 21 on). */
const NOQ_KEYS = ['lf11a', 'lf12', 'lf13', 'eff', 'cp9', 'ov', 'pp11', 'pp12'];
/** A caption without its bold question(s). */
const noQ = (html: string): string => html.replace(/\s*<b>[^<]*\?\s*<\/b>/g, '').trim();

/** Seconds into a beat that stand for its end state, when Back returns to a beat's end. */
const END = 3600;

/** Text reduced to its words, for comparing a caption with what the stage shows. */
const norm = (s: string): string => s.replace(/<[^>]+>/g, ' ').replace(/[^\p{L}\p{N}₀-₉⁰-⁹⁺⁻\s]/gu, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
/** The caption without what the stage already shows (lecturer, 29 Oct 2026: "if you show it on the animation, you don't
 *  need it in the text under the animation"): a bold question, or any sentence, found in the stage's text is left out. */
function dedupe(html: string, stage: string): string {
  const shown = (t: string): boolean => { const n = norm(t); return n.length >= 10 && stage.includes(n); };
  const out = html.replace(/<b>(.*?)<\/b>/g, (m, inner: string) => (shown(inner) ? '' : m));
  return out.split(/(?<=[.?!])\s+(?=[A-Z0-9<¹])/).filter(p => !shown(p)).join(' ').trim();
}

/** Builds the animation inside host and returns a function that stops it. */
export function mountAnimation(host: HTMLElement, anim: Animation, s: Staging, o: PlayerOptions = {}): () => void {
  const a = { ...anim, beats: s.beats ?? anim.beats };
  const all = s.keys ?? STAGE_KEYS[`${anim.key}:${s.id}`] ?? [];
  // Only the closing questions go on the stage (lecturer, 29 Oct 2026, late: "on the animation I only want the big
  // questions; the other things are descriptions, they stay in the text below"). A line is part of a question when it,
  // or the lower-case lines that continue it, ends with "?".
  const partOfQuestion = (k: StageKey): boolean => {
    // the next lines continue this one when they start in lower case, sit just under it and share its beat and x
    const run = all.filter(o => o.beat === k.beat && o.x === k.x).sort((p, q) => p.y - q.y);
    let j = run.indexOf(k);
    while (j < run.length - 1 && run[j + 1].y - run[j].y <= 1.6 * (run[j].size ?? 42) && /^[a-z]/.test(run[j + 1].text)) j++;
    return /\?\s*$/.test(run[j].text);
  };
  // no closing question on the animations of slide 21 on (lecture day, last: "the animations of C₂, C₄, CAM and every
  // slide after 21 should not have any questions")
  const keys = NOQ_KEYS.includes(anim.key) ? [] : all.filter(partOfQuestion);
  // molecules without their white cap on the slides that are not frozen, and on slide 19's clean variant (lecturer, 30 Oct
  // 2026, late: "cut the CO₂ and other molecules off cleanly, no white background")
  const nocap = NOCAP_KEYS.includes(a.key) || NOCAP_IDS.includes(s.id);
  host.className = `ani theme-editorial paper-bristol ani-${a.key}-${s.id}${nocap ? ' nocap' : ''}`;
  host.tabIndex = 0;
  host.innerHTML = `
    <svg class="ani-stage" viewBox="0 0 1600 740" role="img" aria-label="${a.title}, ${s.name}">${s.svg()}${keys.map((k, i) =>
      `<text class="ani-key" data-key="${i}" x="${k.x}" y="${k.y}" text-anchor="${k.anchor ?? 'middle'}" opacity="0"${k.size ? ` style="font-size:${k.size}px"` : ''}>${k.text}</text>`).join('')}</svg>
    <div class="ani-under">
      <div class="ani-dots">${a.beats.map((b, i) => `<button type="button" data-beat="${i}" aria-label="${b.tag.replace(/<[^>]+>/g, '')}"></button>`).join('')}</div>
      <div class="ani-text"><p class="ani-say"></p><p class="ani-cite"></p></div>
      <div class="ani-nav"><button type="button" data-step="-1" aria-label="Back">‹</button><button type="button" data-step="1" aria-label="Next">›</button></div>
    </div>`;

  const stageSvg = host.querySelector('.ani-stage') as SVGSVGElement;
  const bound = s.bind(stageSvg);
  /** What the stage shows in beat bi, as words: all its text, except the key lines of other beats. */
  const stageText = (bi: number): string => norm(Array.from(stageSvg.querySelectorAll<SVGTextElement>('text'))
    .filter(el => !(el.classList.contains('ani-key') && keys[Number(el.dataset.key)]?.beat !== bi)).map(el => { const ts = el.querySelectorAll('tspan'); return ts.length ? Array.from(ts).map(t => t.textContent ?? '').join(' ') : el.textContent ?? ''; }).join(' '));
  // the key lines: each shows only in its beat, fading in over 0.4 s from its t0
  const keyEls = Array.from(host.querySelectorAll<SVGTextElement>('.ani-key'));
  // A question comes only once the beat's motion has finished (lecturer, 29 Oct 2026: "the question must be at the end,
  // after all the animation finishes"); every key line left is part of one.
  const isQ = keys.map(() => true);
  /** When beat b comes to rest (s): the stage drawn every 0.4 s until it stops changing; 12 s if it never does. */
  const rest0: number[] = [];
  const restAt = (b: number): number => {
    if (rest0[b] !== undefined) return rest0[b];
    let prev = '', same = 0, at = 12;
    for (let t = 0; t <= 24; t += 0.4) {
      bound(b, t);
      const sig = stageSvg.innerHTML;
      if (sig === prev) { if (++same >= 2) { at = t - 0.8; break; } } else same = 0;
      prev = sig;
    }
    return (rest0[b] = Math.max(0, at));
  };
  const draw = (b: number, t: number): void => {
    const rest = keys.some((k, i) => isQ[i] && k.beat === b) ? restAt(b) : 0; // before drawing: it redraws the beat
    bound(b, t);
    // the question takes the place of the beat's take-home (lecturer, 29 Oct 2026: "put the question in the obvious
    // location, in the centre"): when it comes, the take-home of its beat fades out
    const qFrom = keys.some((k, i) => isQ[i] && k.beat === b) ? Math.max(...keys.filter((k, i) => isQ[i] && k.beat === b).map(k => k.t0 ?? 0.8), rest + 0.3) : Infinity;
    keys.forEach((k, i) => {
      const from = isQ[i] && k.beat === b ? Math.max(k.t0 ?? 0.8, rest + 0.3) : k.t0 ?? 0.8;
      const out = !isQ[i] ? 1 - Math.max(0, Math.min(1, (t - qFrom) / 0.3)) : 1;
      keyEls[i].setAttribute('opacity', b === k.beat ? (Math.max(0, Math.min(1, (t - from) / 0.4)) * out).toFixed(3) : '0');
    });
  };
  const say = host.querySelector('.ani-say') as HTMLElement, cite = host.querySelector('.ani-cite') as HTMLElement;
  const dots = Array.from(host.querySelectorAll<HTMLButtonElement>('.ani-dots button'));
  let beat = 0, t0 = performance.now(), raf = 0;
  // The step on show: it runs from `from` to `to` seconds into the beat (from = to: a still), and `at` steps of the beat
  // have begun. A beat with holds h has steps [0, h0], [h0, h1], …, [last hold, end]; without holds, one step [0, end].
  const holds = (b: number): number[] => s.holds?.[b] ?? [];
  let at = 1, from = 0, to = Infinity;

  /** Opens beat i from its start; stepping past the first or last beat does nothing, so the end never replays. */
  function go(i: number, first = false): void {
    const next = Math.max(0, Math.min(a.beats.length - 1, i));
    if (next === beat && !first) return;
    beat = next;
    t0 = performance.now();
    at = 1; from = 0; to = holds(beat)[0] ?? Infinity;
    const b = a.beats[beat];
    caption();
    cite.innerHTML = b.cite.map(c => `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`).join('<span>·</span>');
    dots.forEach((d, k) => d.setAttribute('aria-current', `${k === beat}`));
  }
  /** The caption of the step on show (steps begun: at), or the beat's own when it has no steps. */
  function caption(): void {
    const b = a.beats[beat], st = b.steps?.[Math.min(at, b.steps.length) - 1];
    const text = dedupe((st ?? b).say, stageText(beat));
    say.innerHTML = `<b>${(st ?? b).tag}</b> ${NOQ_KEYS.includes(anim.key) ? noQ(text) : text}`;
  }
  /** Plays step k of the beat: from the hold before it (or the beat's start) to the hold after it (or the end). */
  function play(k: number): void {
    const h = holds(beat);
    at = k + 1; from = k ? h[k - 1] : 0; to = h[k] ?? Infinity; t0 = performance.now();
    caption();
  }
  /** Shows the still after k steps of the beat: the hold that ends step k, or the beat's end after its last step. */
  function rest(k: number): void {
    at = k; from = to = holds(beat)[k - 1] ?? END;
    caption();
  }
  /** Next: the beat's next step; after its last step, the next beat. */
  function forward(): void {
    if (!s.holds) { go(beat + 1); return; }
    if (at <= holds(beat).length) play(at);
    else go(beat + 1);
  }
  /** Back: the stop before the current step, so Next plays that step again; from a beat's first step, the end of the
   *  beat before. */
  function backward(): void {
    if (!s.holds) { go(beat - 1); return; }
    if (at >= 2) rest(at - 1);
    else if (beat > 0) { go(beat - 1); rest(holds(beat).length + 1); }
  }
  function frame(now: number): void {
    draw(beat, o.freeze ?? Math.min(to, from + (now - t0) / 1000));
    raf = requestAnimationFrame(frame);
  }

  host.addEventListener('click', e => {
    const b = (e.target as Element).closest('button');
    if (b?.dataset.beat) go(Number(b.dataset.beat));
    if (b?.dataset.step) (Number(b.dataset.step) > 0 ? forward : backward)();
  });
  host.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { forward(); e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { backward(); e.preventDefault(); }
  });
  go(o.beat ?? 0, true);
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}
