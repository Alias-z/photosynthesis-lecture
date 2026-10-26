// The deck viewer: one 1600 x 900 slide at a time, fitted to the window.
// Arrow keys, Page Up/Down or a swipe change slides; F toggles full screen; the Contents jumper hides at the left edge.
import './styles.css';
import { H, W, paper } from './lib/canvas';
import { renderContext } from './lib/context';
import type { Slide } from './slide';
import { PLAN_STORAGE_KEY, slideMinutes } from './planning/timing';
import { openingBriefSlide } from './slides/brief';
import { titleSlide } from './slides/title';
import { lightBasicsBriefSlide } from './slides/lightBasics';
import { scatteringReviewSlide } from './slides/scatteringReview';
import { pigmentsBriefSlide } from './slides/pigments';
import { lightHarvestingBriefSlide } from './slides/lightHarvesting';
import { mountSkyAnimation } from './slides/skyAnimation';

const app = document.getElementById('app') as HTMLElement;
app.outerHTML = `
  <div class="deck-wrap" id="wrap">
    <div class="deck-stage" id="stage" role="region" aria-roledescription="slide" aria-live="polite">
      <canvas id="cv" aria-hidden="true"></canvas>
      <div class="ov" id="ov"></div>
      <div id="animation-panel" class="animation-panel" role="dialog" aria-modal="true" aria-label="Blue sky and sunset animation" tabindex="-1" hidden>
        <div id="sky"></div>
        <button type="button" class="animation-close" id="animation-close" title="Return to slide (Esc)">Close</button>
      </div>
      <div id="context-panel" class="context-panel" role="dialog" aria-modal="true" aria-labelledby="context-title" hidden>
        <header class="context-header">
          <h2 id="context-title">Context</h2>
          <button type="button" id="context-close" title="Return to slide (Esc)">Close</button>
        </header>
        <div id="context-body" class="context-body" tabindex="0" aria-label="Explanation and linked papers"></div>
      </div>
    </div>
  </div>`;
const wrap = document.getElementById('wrap') as HTMLElement;
const stage = document.getElementById('stage') as HTMLElement;
const cv = document.getElementById('cv') as HTMLCanvasElement;
const ov = document.getElementById('ov') as HTMLElement;
const skyHost = document.getElementById('sky') as HTMLElement;
const animationPanel = document.getElementById('animation-panel') as HTMLElement;
const animationClose = document.getElementById('animation-close') as HTMLButtonElement;
const contextPanel = document.getElementById('context-panel') as HTMLElement;
const contextBody = document.getElementById('context-body') as HTMLElement;
const contextClose = document.getElementById('context-close') as HTMLButtonElement;

const sky = mountSkyAnimation(skyHost);
const SLIDES: Slide[] = [openingBriefSlide, titleSlide, lightBasicsBriefSlide, scatteringReviewSlide, pigmentsBriefSlide, lightHarvestingBriefSlide];

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
let slide = 0, open = false, showingBackup = false, animationOpen = false, contextOpen = false, K = 1, cacheKey = '', fontsReady = 0;
const cache = document.createElement('canvas');
const ctx = cv.getContext('2d') as CanvasRenderingContext2D;

/* ---------- slide text and the hidden jumper ---------- */
function activeSlide(): Slide {
  const current = SLIDES[slide];
  return showingBackup && current.backup ? current.backup : current;
}

function overlay(): void {
  const S = activeSlide(), isSky = S.kind === 'sky';
  const minutes = slideMinutes(slide + 1);
  let h = S.overlay ? S.overlay() : '';
  if (SLIDES[slide].backup) {
    h += `<button type="button" class="backup-toggle hit" style="top:${S.backupButtonTop ?? 783}px" data-backup="1" title="${showingBackup ? 'Return to the current slide (Esc)' : 'Open the original animation'}">${showingBackup ? 'Return' : 'Backup'}</button>`;
  }
  if (S.animation) {
    h += `<button type="button" class="animation-toggle hit" data-animation="1" aria-haspopup="dialog" aria-controls="animation-panel" aria-expanded="${animationOpen}">Animation</button>`;
  }
  if (S.context?.length) {
    const left = S.animation ? 510 : SLIDES[slide].backup ? 280 : 96;
    h += `<button type="button" class="context-toggle hit" style="left:${left}px" data-context="1" aria-haspopup="dialog" aria-controls="context-panel" aria-expanded="${contextOpen}">Context</button>`;
  }
  const chev = (d: string) => `<svg width="18" height="28" viewBox="0 0 18 28" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>`;
  h += `<div class="pg hit" style="right:${96 - 22}px;top:${800 - 17}px${isSky ? ';color:#b9bdd6' : ''}">
      ${minutes !== undefined ? `<span class="teaching-time" title="Estimated teaching time">≈ ${minutes} min</span>` : ''}
      <button type="button" data-nav="prev" aria-label="Previous slide"${slide === 0 ? ' disabled' : ''}>${chev('M15 2L3 14L15 26')}</button>
      <span>${slide + 1} / ${SLIDES.length}</span>
      <button type="button" data-nav="next" aria-label="Next slide"${slide === SLIDES.length - 1 ? ' disabled' : ''}>${chev('M3 2L15 14L3 26')}</button>
    </div>`;
  h += `<div class="jump hit${open ? ' open' : ''}">
      <button class="tab" type="button" data-toc="1" aria-expanded="${open ? 'true' : 'false'}"><svg width="26" height="20" viewBox="0 0 26 20" aria-hidden="true"><path d="M2 3H24M2 10H24M2 17H24" stroke="currentColor" stroke-width="2.6"/></svg>Contents</button>
      ${open ? `<div class="menu" role="menu">${SLIDES.map((p, i) => `<button type="button" role="menuitem" data-go="${i}" aria-current="${i === slide}"><span>${i + 1}</span>${p.title}</button>`).join('')}</div>` : ''}
    </div>`;
  ov.innerHTML = h;
  stage.setAttribute('aria-label', `Slide ${slide + 1} of ${SLIDES.length}${showingBackup ? ' (backup)' : ''}: ${S.title}`);
}
function setAnimationOpen(on: boolean, restoreFocus = true): void {
  if (on && !activeSlide().animation) return;
  if (on && contextOpen) setContextOpen(false, false);
  animationOpen = on;
  open = false;
  overlay();
  ov.inert = on || contextOpen;
  animationPanel.hidden = !on;
  sky.setActive(on);
  if (on) animationPanel.focus();
  else if (restoreFocus) ov.querySelector<HTMLButtonElement>('[data-animation]')?.focus();
}
function setContextOpen(on: boolean, restoreFocus = true): void {
  const topics = activeSlide().context;
  if (on && !topics?.length) return;
  if (on && animationOpen) setAnimationOpen(false, false);
  contextOpen = on;
  open = false;
  if (on) contextBody.innerHTML = renderContext(topics!);
  overlay();
  ov.inert = on || animationOpen;
  contextPanel.hidden = !on;
  if (on) {
    contextBody.scrollTop = 0;
    contextBody.focus();
  } else if (restoreFocus) ov.querySelector<HTMLButtonElement>('[data-context]')?.focus();
}
function toggleBackup(): void {
  if (!SLIDES[slide].backup) return;
  showingBackup = !showingBackup;
  open = false;
  cacheKey = '';
  overlay();
  ov.querySelector<HTMLButtonElement>('[data-backup]')?.focus();
}
function go(i: number): void {
  if (animationOpen) setAnimationOpen(false, false);
  if (contextOpen) setContextOpen(false, false);
  slide = Math.max(0, Math.min(SLIDES.length - 1, i));
  showingBackup = false;
  open = false;
  cacheKey = '';
  overlay();
  try { history.replaceState(null, '', `#${slide + 1}`); } catch { /* ignore */ }
}

/* ---------- sizing and loop ---------- */
function fit(): void {
  const w = wrap.clientWidth, h = wrap.clientHeight, s = Math.min(w / W, h / H);
  stage.style.transform = `translate(${(w - W * s) / 2}px,${(h - H * s) / 2}px) scale(${s})`;
  K = s * Math.min(2, window.devicePixelRatio || 1);
  const bw = Math.max(1, Math.round(W * K)), bh = Math.max(1, Math.round(H * K));
  if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; }
  cacheKey = '';
  sky.resize(); // the animation's canvas sits inside the scaled stage, so it re-measures here
}
let T = 0, last = performance.now();
function frame(now: number): void {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  const S = activeSlide();
  if (!RM) T += dt;
  S.update?.(dt);
  const key = `${slide}:${showingBackup}:${cv.width}x${cv.height}:${fontsReady}`;
  if (key !== cacheKey) {
    cache.width = cv.width; cache.height = cv.height;
    const c = cache.getContext('2d') as CanvasRenderingContext2D;
    c.setTransform(K, 0, 0, K, 0, 0);
    if (S.drawStatic) S.drawStatic(c); else paper(c);
    cacheKey = key;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.drawImage(cache, 0, 0);
  ctx.setTransform(K, 0, 0, K, 0, 0);
  S.drawFrame?.(ctx, T);
  requestAnimationFrame(frame);
}

/* ---------- input ---------- */
ov.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest('button');
  if (!b) return;
  e.stopPropagation();
  if (b.dataset.context) { setContextOpen(true); return; }
  if (b.dataset.animation) { setAnimationOpen(true); return; }
  if (b.dataset.backup) { toggleBackup(); return; }
  if (b.dataset.toc) {
    open = !open;
    overlay();
    const t = ov.querySelector<HTMLElement>(open ? '.menu button[aria-current="true"]' : '.tab');
    t?.focus();
    return;
  }
  if (b.dataset.go !== undefined) { go(Number(b.dataset.go)); return; }
  if (b.dataset.nav) {
    go(slide + (b.dataset.nav === 'next' ? 1 : -1));
    ov.querySelector<HTMLElement>(`[data-nav="${b.dataset.nav}"]:not([disabled])`)?.focus();
    return;
  }
  activeSlide().onButton?.(b);
  overlay();
  if (b.id) document.getElementById(b.id)?.focus();
});
animationClose.addEventListener('click', () => setAnimationOpen(false));
contextClose.addEventListener('click', () => setContextOpen(false));
document.addEventListener('click', () => { if (open) { open = false; overlay(); } });
document.addEventListener('keydown', (e) => {
  if (contextOpen) {
    if (e.key === 'Escape') { setContextOpen(false); e.preventDefault(); return; }
    if (e.key === 'Tab') {
      const items = Array.from(contextPanel.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]'));
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = index < 0 ? (e.shiftKey ? items.length - 1 : 0) : (index + (e.shiftKey ? -1 : 1) + items.length) % items.length;
      items[next]?.focus();
      e.preventDefault();
    }
    // Reading and scrolling context must not advance the teaching slides.
    return;
  }
  if (animationOpen) {
    if (e.key === 'Escape') { setAnimationOpen(false); e.preventDefault(); return; }
    if (e.key === 'Tab') {
      const buttons = Array.from(animationPanel.querySelectorAll<HTMLButtonElement>('button:not([disabled])'));
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const next = index < 0 ? (e.shiftKey ? buttons.length - 1 : 0) : (index + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length;
      buttons[next]?.focus();
      e.preventDefault();
      return;
    }
    // Let focused buttons retain their native Space activation.
    if (e.key === ' ' && e.target instanceof HTMLButtonElement) return;
    if (sky.slide.onKey?.(e)) { e.preventDefault(); return; }
    // At the first/last animation beat, arrows must not move the underlying deck.
    if (['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) e.preventDefault();
    if (e.key !== 'f' && e.key !== 'F') return;
  }
  if (activeSlide().onKey?.(e)) { e.preventDefault(); return; }
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { go(slide + 1); e.preventDefault(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(slide - 1); e.preventDefault(); }
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(SLIDES.length - 1);
  else if (e.key === 'Escape' && open) { open = false; overlay(); }
  else if (e.key === 'Escape' && showingBackup) { toggleBackup(); e.preventDefault(); }
  else if ((e.key === 'f' || e.key === 'F') && !e.metaKey && !e.ctrlKey) {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    else wrap.requestFullscreen?.().catch(() => undefined);
  }
});
let tx: number | null = null;
wrap.addEventListener('touchstart', (e) => { tx = animationOpen || contextOpen ? null : e.touches[0].clientX; }, { passive: true });
wrap.addEventListener('touchend', (e) => {
  if (animationOpen || contextOpen || tx === null) { tx = null; return; }
  const d = e.changedTouches[0].clientX - tx;
  if (Math.abs(d) > 50) go(slide + (d < 0 ? 1 : -1));
  tx = null;
});
new ResizeObserver(fit).observe(wrap);
document.addEventListener('fullscreenchange', fit);
window.addEventListener('storage', e => { if (e.key === PLAN_STORAGE_KEY) overlay(); });
window.addEventListener('focus', overlay);

/* ---------- boot ---------- */
const hm = /^#(\d+)$/.exec(location.hash);
if (hm) slide = Math.max(0, Math.min(SLIDES.length - 1, Number(hm[1]) - 1));
const faces = ['300 20px Spectral', '400 20px Spectral', 'italic 400 20px Spectral', '400 20px "IBM Plex Sans"', '500 20px "IBM Plex Sans"', '600 20px "IBM Plex Sans"'];
Promise.all(faces.map((f) => document.fonts.load(f).catch(() => null))).then(() => { fontsReady++; });
fit();
go(slide);
requestAnimationFrame(frame);
