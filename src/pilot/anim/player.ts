// The stepped player shared by the lecture animations: a 1600 × 740 stage on Bristol paper and, under it, the
// beat dots, the caption with its tag, the sources it rests on, and Back / Next. The lecturer steps through;
// each beat's motion plays once and then holds, so they can talk over the still.
import './anim.css';
import type { Animation, Staging } from './types';

export interface PlayerOptions {
  /** Beat to open on. */
  beat?: number;
  /** Draws the beat frozen at this many seconds, for screenshots of its end state. */
  freeze?: number;
}

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

  /** Opens beat i from its start; stepping past the first or last beat does nothing, so the end never replays. */
  function go(i: number, first = false): void {
    const next = Math.max(0, Math.min(a.beats.length - 1, i));
    if (next === beat && !first) return;
    beat = next;
    t0 = performance.now();
    const b = a.beats[beat];
    say.innerHTML = `<b>${b.tag}</b> ${b.say}`;
    cite.innerHTML = b.cite.map(c => `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`).join('<span>·</span>');
    dots.forEach((d, k) => d.setAttribute('aria-current', `${k === beat}`));
  }
  function frame(now: number): void {
    draw(beat, o.freeze ?? (now - t0) / 1000);
    raf = requestAnimationFrame(frame);
  }

  host.addEventListener('click', e => {
    const b = (e.target as Element).closest('button');
    if (b?.dataset.beat) go(Number(b.dataset.beat));
    if (b?.dataset.step) go(beat + Number(b.dataset.step));
  });
  host.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { go(beat + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(beat - 1); e.preventDefault(); }
  });
  go(o.beat ?? 0, true);
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}
