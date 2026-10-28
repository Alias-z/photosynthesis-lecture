// The stepped player shared by the lecture animations: a 1600 × 740 stage on Bristol paper and, under it, the
// beat dots, the caption with its tag, the sources it rests on, and Back / Next. The lecturer steps through;
// each beat's motion plays once and then holds, so they can talk over the still. A staging with holds plays each beat
// in steps: Next plays to the next hold and stops there; Back returns to the previous stop.
import './anim.css';
import type { Animation, Staging } from './types';

export interface PlayerOptions {
  /** Beat to open on. */
  beat?: number;
  /** Draws the beat frozen at this many seconds, for screenshots of its end state. */
  freeze?: number;
}

/** Seconds into a beat that stand for its end state, when Back returns to a beat's end. */
const END = 3600;

/** Builds the animation inside host and returns a function that stops it. */
export function mountAnimation(host: HTMLElement, anim: Animation, s: Staging, o: PlayerOptions = {}): () => void {
  const a = { ...anim, beats: s.beats ?? anim.beats };
  host.className = `ani theme-editorial paper-bristol ani-${a.key}-${s.id}`;
  host.tabIndex = 0;
  host.innerHTML = `
    <svg class="ani-stage" viewBox="0 0 1600 740" role="img" aria-label="${a.title}, ${s.name}">${s.svg()}</svg>
    <div class="ani-under">
      <div class="ani-dots">${a.beats.map((b, i) => `<button type="button" data-beat="${i}" aria-label="${b.tag}"></button>`).join('')}</div>
      <div class="ani-text"><p class="ani-say"></p><p class="ani-cite"></p></div>
      <div class="ani-nav"><button type="button" data-step="-1" aria-label="Back">‹</button><button type="button" data-step="1" aria-label="Next">›</button></div>
    </div>`;

  const draw = s.bind(host.querySelector('.ani-stage') as SVGSVGElement);
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
    say.innerHTML = `<b>${b.tag}</b> ${b.say}`;
    cite.innerHTML = b.cite.map(c => `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`).join('<span>·</span>');
    dots.forEach((d, k) => d.setAttribute('aria-current', `${k === beat}`));
  }
  /** Plays step k of the beat: from the hold before it (or the beat's start) to the hold after it (or the end). */
  function play(k: number): void {
    const h = holds(beat);
    at = k + 1; from = k ? h[k - 1] : 0; to = h[k] ?? Infinity; t0 = performance.now();
  }
  /** Shows the still after k steps of the beat: the hold that ends step k, or the beat's end after its last step. */
  function rest(k: number): void {
    at = k; from = to = holds(beat)[k - 1] ?? END;
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
