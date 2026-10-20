// The deck viewer: one 1600 x 900 slide at a time, fitted to the window.
// Arrow keys, Page Up/Down or a swipe change slides; F toggles full screen; the Contents jumper hides at the left edge.
import './styles.css';
import { H, W, paper } from './lib/canvas';
import type { Slide } from './slide';
import { titleSlide } from './slides/title';
import { wavelengthsSlide } from './slides/wavelengths';
import { scatteringSlide } from './slides/scattering';
import { mountSkyAnimation } from './slides/skyAnimation';

const app = document.getElementById('app') as HTMLElement;
app.outerHTML = `
  <div class="deck-wrap" id="wrap">
    <div class="deck-stage" id="stage" role="region" aria-roledescription="slide" aria-live="polite">
      <canvas id="cv" aria-hidden="true"></canvas>
      <div id="sky" hidden></div>
      <div class="ov" id="ov"></div>
    </div>
  </div>`;
const wrap = document.getElementById('wrap') as HTMLElement;
const stage = document.getElementById('stage') as HTMLElement;
const cv = document.getElementById('cv') as HTMLCanvasElement;
const ov = document.getElementById('ov') as HTMLElement;
const skyHost = document.getElementById('sky') as HTMLElement;

const sky = mountSkyAnimation(skyHost);
const SLIDES: Slide[] = [titleSlide, wavelengthsSlide, scatteringSlide, sky.slide];

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
let slide = 0, open = false, K = 1, cacheKey = '', fontsReady = 0;
const cache = document.createElement('canvas');
const ctx = cv.getContext('2d') as CanvasRenderingContext2D;

/* ---------- slide text and the hidden jumper ---------- */
function overlay(): void {
  const S = SLIDES[slide], isSky = S.kind === 'sky';
  let h = S.overlay ? S.overlay() : '';
  h += `<p class="pg" style="right:96px;top:${isSky ? 846 : 800}px${isSky ? ';color:#b9bdd6' : ''}">${slide + 1} / ${SLIDES.length}</p>`;
  h += `<div class="jump hit${open ? ' open' : ''}">
      <button class="tab" type="button" data-toc="1" aria-expanded="${open ? 'true' : 'false'}"><svg width="26" height="20" viewBox="0 0 26 20" aria-hidden="true"><path d="M2 3H24M2 10H24M2 17H24" stroke="currentColor" stroke-width="2.6"/></svg>Contents</button>
      ${open ? `<div class="menu" role="menu">${SLIDES.map((p, i) => `<button type="button" role="menuitem" data-go="${i}" aria-current="${i === slide}"><span>${i + 1}</span>${p.title}</button>`).join('')}</div>` : ''}
    </div>`;
  ov.innerHTML = h;
  stage.setAttribute('aria-label', `Slide ${slide + 1} of ${SLIDES.length}: ${S.title}`);
}
function go(i: number): void {
  slide = Math.max(0, Math.min(SLIDES.length - 1, i));
  open = false;
  cacheKey = '';
  overlay();
  const isSky = SLIDES[slide].kind === 'sky';
  skyHost.hidden = !isSky;
  sky.setActive(isSky);
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
  const S = SLIDES[slide];
  if (!RM) T += dt;
  S.update?.(dt);
  const key = `${slide}:${cv.width}x${cv.height}:${fontsReady}`;
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
  if (b.dataset.toc) {
    open = !open;
    overlay();
    const t = ov.querySelector<HTMLElement>(open ? '.menu button[aria-current="true"]' : '.tab');
    t?.focus();
    return;
  }
  if (b.dataset.go !== undefined) { go(Number(b.dataset.go)); return; }
  SLIDES[slide].onButton?.(b);
  overlay();
  if (b.id) document.getElementById(b.id)?.focus();
});
document.addEventListener('click', () => { if (open) { open = false; overlay(); } });
document.addEventListener('keydown', (e) => {
  if (SLIDES[slide].onKey?.(e)) { e.preventDefault(); return; }
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { go(slide + 1); e.preventDefault(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(slide - 1); e.preventDefault(); }
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(SLIDES.length - 1);
  else if (e.key === 'Escape' && open) { open = false; overlay(); }
  else if ((e.key === 'f' || e.key === 'F') && !e.metaKey && !e.ctrlKey) {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    else wrap.requestFullscreen?.().catch(() => undefined);
  }
});
let tx: number | null = null;
wrap.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
wrap.addEventListener('touchend', (e) => {
  if (tx === null) return;
  const d = e.changedTouches[0].clientX - tx;
  if (Math.abs(d) > 50) go(slide + (d < 0 ? 1 : -1));
  tx = null;
});
new ResizeObserver(fit).observe(wrap);
document.addEventListener('fullscreenchange', fit);

/* ---------- boot ---------- */
const hm = /^#(\d+)$/.exec(location.hash);
if (hm) slide = Math.max(0, Math.min(SLIDES.length - 1, Number(hm[1]) - 1));
const faces = ['300 20px Spectral', '400 20px Spectral', 'italic 400 20px Spectral', '400 20px "IBM Plex Sans"', '500 20px "IBM Plex Sans"', '600 20px "IBM Plex Sans"'];
Promise.all(faces.map((f) => document.fonts.load(f).catch(() => null))).then(() => { fontsReady++; });
fit();
go(slide);
requestAnimationFrame(frame);
