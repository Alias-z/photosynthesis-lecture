// Figure gallery: every variant of every pilot page (lead pages included) side by side. The lecturer picks any number of
// variants per slide (double-click or tick) and adds a note; picks save to research/figure-briefs/picks.json through /__picks.
import './pilot.css';
import './gallery.css';
import { installPapers } from './papers';
import { pickStore } from './picks';
import { PAGES, fitTitles } from './plates';

const app = document.getElementById('gallery') as HTMLElement;
installPapers(document.documentElement);

app.innerHTML = `
  <header class="g-top">
    <div><h1>Figure gallery</h1><p>Double-click a figure to pick it; double-click again to unpick. Click once to see it on its full page. Add a note per slide. Picks save automatically.</p></div>
    <span class="g-status" aria-live="polite"></span>
  </header>
  ${PAGES.map(pg => { const p = pg.plate; return `
    <section class="g-slide${pg.kind === 'lead' ? ' g-lead' : ''}" data-n="${pg.key}">
      <h2><span>Slide ${p.n}${pg.kind === 'lead' ? ' · lead page' : ''}</span> ${p.title}${p.status === 'draft' ? '<em class="g-draft">draft text</em>' : ''}</h2>
      <div class="g-grid">${pg.variants.map(v => `
        <article class="g-card" data-v="${v.id}">
          <button type="button" class="g-open theme-editorial paper-bristol" aria-label="Open ${p.n}${v.id.toUpperCase()} on its page"><figure class="fig"></figure></button>
          <label class="g-pick"><input type="checkbox" data-pick="${v.id}"/><b>${p.n}${v.id.toUpperCase()}</b> ${v.name}${v.anim ? '<span class="g-anim">animation</span>' : ''}</label>
        </article>`).join('')}
      </div>
      <textarea class="g-note" rows="2" placeholder="Note for slide ${p.n}${pg.kind === 'lead' ? ' lead page' : ''}: what to keep, combine or change"></textarea>
    </section>`; }).join('')}
  <div class="g-modal" hidden><div class="g-stage"><div class="plate"></div></div>
    <div class="g-bar"><label class="g-pick"><input type="checkbox" class="g-modal-pick"/> pick</label><span class="g-modal-name"></span><button type="button" class="g-close">Close</button></div></div>`;

function sync(): void {
  app.querySelectorAll<HTMLElement>('.g-slide').forEach(sec => {
    const n = sec.dataset.n as string;
    sec.querySelectorAll<HTMLInputElement>('[data-pick]').forEach(cb => {
      cb.checked = store.has(n, cb.dataset.pick as string);
      cb.closest('.g-card')?.classList.toggle('picked', cb.checked);
    });
    (sec.querySelector('.g-note') as HTMLTextAreaElement).value = store.note(n);
  });
  if (open) modalPick.checked = store.has(open.n, open.v);
}

// Full-page view of one variant.
const modal = app.querySelector('.g-modal') as HTMLElement;
const stage = modal.querySelector('.g-stage') as HTMLElement;
const plateEl = modal.querySelector('.plate') as HTMLElement;
const modalPick = modal.querySelector('.g-modal-pick') as HTMLInputElement;
let open: { n: string; v: string } | null = null;
const store = pickStore(app.querySelector('.g-status') as HTMLElement, sync);
function fit(): void {
  const k = Math.min(stage.clientWidth / 1600, stage.clientHeight / 900);
  plateEl.style.transform = `scale(${k})`;
  plateEl.style.left = `${(stage.clientWidth - 1600 * k) / 2}px`;
}
function show(n: string, v: string): void {
  const page = PAGES.find(pg => pg.key === n);
  if (!page) return;
  open = { n, v };
  plateEl.className = 'plate theme-editorial lay-figure paper-bristol';
  plateEl.innerHTML = page.html(v);
  (modal.querySelector('.g-modal-name') as HTMLElement).textContent = `${page.plate.n}${v.toUpperCase()}${page.kind === 'lead' ? ' lead' : ''} · ${page.variants.find(x => x.id === v)?.name ?? ''}`;
  modalPick.checked = store.has(n, v);
  modal.hidden = false;
  fit();
  fitTitles(plateEl);
}
const close = (): void => { modal.hidden = true; open = null; };

// One click opens the full page after a short wait; a second click within it makes a double-click,
// which picks or unpicks instead, on a card or on the open page.
let clickTimer = 0;
const flip = (n: string, v: string): void => store.set(n, v, !store.has(n, v));
app.addEventListener('click', e => {
  const t = e.target as HTMLElement;
  const card = t.closest('.g-card') as HTMLElement | null;
  const sec = t.closest('.g-slide') as HTMLElement | null;
  if (t.closest('.g-open') && card && sec) {
    clearTimeout(clickTimer);
    if (e.detail === 1) clickTimer = window.setTimeout(() => show(sec.dataset.n as string, card.dataset.v as string), 300);
  }
  if (t.closest('.g-close')) close();
});
app.addEventListener('dblclick', e => {
  const t = e.target as HTMLElement;
  const card = t.closest('.g-card') as HTMLElement | null;
  const sec = t.closest('.g-slide') as HTMLElement | null;
  if (t.closest('.g-open') && card && sec) { clearTimeout(clickTimer); flip(sec.dataset.n as string, card.dataset.v as string); }
  else if (open && t.closest('.g-stage')) flip(open.n, open.v);
});
app.addEventListener('change', e => {
  const t = e.target as HTMLInputElement;
  if (t.dataset.pick) store.set((t.closest('.g-slide') as HTMLElement).dataset.n as string, t.dataset.pick, t.checked);
  if (t === modalPick && open) store.set(open.n, open.v, t.checked);
});
app.addEventListener('input', e => {
  const t = e.target as HTMLTextAreaElement;
  if (t.classList.contains('g-note')) store.setNote((t.closest('.g-slide') as HTMLElement).dataset.n as string, t.value);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) close(); });
window.addEventListener('resize', () => { if (open) fit(); });

// Figures are drawn when their slide scrolls near the view, so 290 drawings do not all build at once.
const lazy = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const sec = e.target as HTMLElement;
    const page = PAGES.find(pg => pg.key === sec.dataset.n);
    sec.querySelectorAll<HTMLElement>('.g-card').forEach(card => {
      (card.querySelector('.fig') as HTMLElement).innerHTML = page?.figure(card.dataset.v as string) ?? '';
    });
    lazy.unobserve(sec);
  }
}, { rootMargin: '600px 0px' });
app.querySelectorAll('.g-slide').forEach(sec => lazy.observe(sec));
