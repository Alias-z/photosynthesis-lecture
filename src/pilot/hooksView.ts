// Hook questions over the page: an index of all chunks, and one chunk at a time as cards (the question, the story of
// how it was found out when there is one, the steps that answer it, its concepts, what the students see, what is
// still to check, a Pick toggle). Picks (question ids)
// and the chunk's note save through the given pick store under hook-<chunk-id>. It wears the References look
// (refs.css: paper, header, note box, tabs, index tiles) and adds its cards in hooks.css.
import './refs.css';
import './hooks.css';
import type { PickStore } from './picks';
import { HOOK_SETS, hookKey, hookSet, type HookQuestion, type HookSet } from './hooks';

export interface HooksView {
  /** Shows one chunk, with the chunks in `tabs` as tabs when there are several, or the index when `id` is null. */
  show(id: string | null, tabs?: string[]): void;
  /** Takes the overlay off the page. */
  close(): void;
  /** Shows the store's picks and notes again, as after it has (re)loaded them. */
  sync(): void;
}

/** All text from the JSON files goes through this; none of it is read as HTML. */
const esc = (s: string): string => s.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
/** A page key as the lecturer reads it: lead-1 is slide 1's lead page. */
const pageName = (k: string): string => (k.startsWith('lead-') ? `Slide ${k.slice(5)} lead page` : `Slide ${k}`);
const about = (h: HookSet): string => [...h.slides.map(pageName), `${h.questions.length} question${h.questions.length === 1 ? '' : 's'}`].join(' · ');

export function hooksView(root: HTMLElement, store: PickStore): HooksView {
  root.classList.add('refs', 'hooks-overlay');
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Questions');
  root.hidden = true;
  root.innerHTML = '<div class="rf-page"></div>';
  const page = root.querySelector('.rf-page') as HTMLElement;
  const closeButton = '<button type="button" class="rf-x" data-close aria-label="Close">×</button>';
  let current: HookSet | null = null, tabs: string[] = [];

  const tile = (h: HookSet): string => `<button type="button" class="rf-tile hk-tile" data-chunk="${esc(h.id)}">
      ${h.chunk ? `<span class="hk-tile-k">${esc(h.chunk)}</span>` : ''}
      <span class="rf-tile-t">${esc(h.title)}</span>
      <span class="rf-tile-m">${esc(about(h))}<span class="rf-count"></span></span>
    </button>`;
  const card = (q: HookQuestion): string => `
    <article class="hk-card" data-q="${esc(q.id)}">
      <div class="hk-row"><span class="hk-id">${esc(q.id)}</span><button type="button" class="rf-pick" aria-pressed="false">Pick</button></div>
      <h2 class="hk-q">${esc(q.question)}</h2>
      ${q.story ? `<div class="hk-story"><p class="hk-label">The story</p><p>${esc(q.story)}</p></div>` : ''}
      ${q.steps.length ? `<ol class="hk-steps">${q.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>` : ''}
      ${q.concepts.length ? `<ul class="hk-tags">${q.concepts.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
      ${q.see ? `<p class="hk-see"><b>Students see:</b> ${esc(q.see)}</p>` : ''}
      ${q.status ? `<p class="hk-status">${esc(q.status)}</p>` : ''}
    </article>`;

  function draw(): void {
    page.innerHTML = current === null
      ? `<header class="rf-head"><div><p class="rf-kicker">Questions</p><h1>All chunks</h1></div>${closeButton}</header>
        ${HOOK_SETS.length ? `<div class="rf-tiles">${HOOK_SETS.map(tile).join('')}</div>` : '<p class="rf-empty">No question sets yet.</p>'}`
      : `<header class="rf-head"><div>
          <p class="rf-kicker"><button type="button" class="rf-crumb" data-index>All chunks</button>${current.chunk ? `<span>${esc(current.chunk)}</span>` : ''}</p>
          ${tabs.length > 1 ? `<div class="rf-tabs" role="tablist">${tabs.map(id => `<button type="button" role="tab" data-tab="${esc(id)}" aria-selected="${id === current?.id}" title="${esc(hookSet(id)?.title ?? id)}">${esc(hookSet(id)?.title ?? id)}</button>`).join('')}</div>` : ''}
          <h1>${esc(current.title)}</h1>
        </div>${closeButton}</header>
        <textarea class="rf-note" rows="2" placeholder="Reshape: what to change, or a new question to try"></textarea>
        <div class="hk-grid">${current.questions.map(card).join('')}</div>`;
    root.scrollTop = 0;
    sync();
  }

  function sync(): void {
    if (current) {
      const key = hookKey(current.id);
      page.querySelectorAll<HTMLElement>('.hk-card').forEach(c => {
        const on = store.has(key, c.dataset.q as string), pick = c.querySelector('.rf-pick') as HTMLElement;
        c.classList.toggle('picked', on);
        pick.setAttribute('aria-pressed', `${on}`);
        pick.textContent = on ? '✓ Picked' : 'Pick';
      });
      const note = page.querySelector('.rf-note') as HTMLTextAreaElement;
      if (document.activeElement !== note) note.value = store.note(key);
    }
    page.querySelectorAll<HTMLElement>('.hk-tile').forEach(t => {
      const h = hookSet(t.dataset.chunk as string), picked = h ? h.questions.filter(q => store.has(hookKey(h.id), q.id)) : [];
      (t.querySelector('.rf-count') as HTMLElement).textContent = picked.length ? ` · picked ${picked.map(q => q.id).join(', ')}` : '';
    });
  }

  function show(id: string | null, among: string[] = []): void {
    current = id === null ? null : hookSet(id) ?? null;
    tabs = current ? (among.includes(current.id) ? among : [current.id]) : [];
    draw();
    root.hidden = false;
    document.documentElement.classList.add('hooks-lock');
  }
  function close(): void {
    root.hidden = true;
    document.documentElement.classList.remove('hooks-lock');
  }

  root.addEventListener('click', e => {
    const t = e.target as Element;
    if (t.closest('[data-close]')) { close(); return; }
    if (t.closest('[data-index]')) { show(null); return; }
    const tab = t.closest<HTMLElement>('[data-tab]'), chunk = t.closest<HTMLElement>('[data-chunk]');
    if (tab) { show(tab.dataset.tab as string, tabs); return; }
    if (chunk) { show(chunk.dataset.chunk as string); return; }
    const c = t.closest<HTMLElement>('.hk-card');
    if (c && current && t.closest('.rf-pick')) {
      const key = hookKey(current.id), v = c.dataset.q as string;
      store.set(key, v, !store.has(key, v));
    }
  });
  root.addEventListener('input', e => {
    const t = e.target as HTMLTextAreaElement;
    if (t.classList.contains('rf-note') && current) store.setNote(hookKey(current.id), t.value);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !root.hidden) close(); });

  return { show, close, sync };
}
