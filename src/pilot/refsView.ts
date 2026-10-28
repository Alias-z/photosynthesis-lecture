// Reference boards on screen: an index of all boards, and one board at a time as a grid of cards (image, kind,
// caption, credit linking to the source, a Pick toggle). A click on an image enlarges it. Picks (image ids) and the
// board's note save through the given pick store under ref-<board-id>. The pilot shows it over the page; refs.html
// shows it as the page itself.
import './refs.css';
import type { PickStore } from './picks';
import { BOARDS, pagesOf, refBoard, refKey, type RefBoard, type RefImage } from './refs';

export interface RefsView {
  /** Shows one board, with the boards in `tabs` as tabs when there are several, or the index when `id` is null. */
  show(id: string | null, tabs?: string[]): void;
  /** Takes the overlay off the page. */
  close(): void;
  /** Shows the store's picks and notes again, as after it has (re)loaded them. */
  sync(): void;
}

interface Options {
  /** Full-screen over the page, with a close button; Escape closes the lightbox first, then the overlay. */
  overlay: boolean;
  /** Called when the reader moves to another board or to the index (refs.html keeps the address in step). */
  onShow?: (id: string | null) => void;
}

const esc = (s: string): string => s.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
/** Only web addresses become links. */
const web = (u?: string): string => (u && /^https?:\/\//i.test(u) ? u : '');
/** A page key as the lecturer reads it: lead-1 is slide 1's lead page. */
const pageName = (k: string): string => (k.startsWith('lead-') ? `Slide ${k.slice(5)} lead page` : `Slide ${k}`);
const about = (b: RefBoard): string => [...pagesOf(b).map(pageName), `${b.images.length} image${b.images.length === 1 ? '' : 's'}`].join(' · ');
const credit = (im: RefImage): string =>
  (web(im.url) ? `<a href="${esc(im.url as string)}" target="_blank" rel="noopener">${esc(im.credit || (im.url as string))}</a>` : esc(im.credit));

export function refsView(root: HTMLElement, store: PickStore, opts: Options): RefsView {
  root.classList.add('refs');
  if (opts.overlay) {
    root.classList.add('refs-overlay');
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'References');
    root.hidden = true;
  }
  root.innerHTML = `<div class="rf-page"></div>
    <div class="rf-box" hidden><img alt=""/><p class="rf-box-cap"></p><button type="button" class="rf-x" data-unzoom aria-label="Close">×</button></div>`;
  const page = root.querySelector('.rf-page') as HTMLElement;
  const box = root.querySelector('.rf-box') as HTMLElement;
  const closeButton = opts.overlay ? '<button type="button" class="rf-x" data-close aria-label="Close">×</button>' : '';
  let current: RefBoard | null = null, tabs: string[] = [];

  const tile = (b: RefBoard): string => {
    const first = b.images.find(im => im.src);
    return `<button type="button" class="rf-tile" data-board="${esc(b.id)}">
      <span class="rf-thumb">${first ? `<img src="${first.src}" alt="" loading="lazy"/>` : ''}</span>
      <span class="rf-tile-t">${esc(b.title)}</span>
      <span class="rf-tile-m">${esc([b.id, about(b)].join(' · '))}<span class="rf-count"></span></span>
    </button>`;
  };
  const card = (im: RefImage): string => `
    <article class="rf-card" data-img="${esc(im.id)}">
      <button type="button" class="rf-img" data-zoom aria-label="Enlarge">${im.src ? `<img src="${im.src}" alt="${esc(im.caption)}" loading="lazy"/>` : `<span class="rf-missing">File not found: ${esc(im.file)}</span>`}</button>
      <div class="rf-row"><span class="rf-kind" data-kind="${esc(im.kind)}">${esc(im.kind)}</span><button type="button" class="rf-pick" aria-pressed="false">Pick</button></div>
      <p class="rf-cap">${esc(im.caption)}</p>
      <p class="rf-credit">${credit(im)}</p>
      ${im.note ? `<p class="rf-said">${esc(im.note)}</p>` : ''}
    </article>`;

  function draw(): void {
    page.innerHTML = current === null
      ? `<header class="rf-head"><div><p class="rf-kicker">References</p><h1>All boards</h1></div>${closeButton}</header>
        ${BOARDS.length ? `<div class="rf-tiles">${BOARDS.map(tile).join('')}</div>` : '<p class="rf-empty">No reference boards yet.</p>'}`
      : `<header class="rf-head"><div>
          <p class="rf-kicker"><button type="button" class="rf-crumb" data-index>All boards</button><span>${esc([current.id, about(current)].join(' · '))}</span></p>
          ${tabs.length > 1 ? `<div class="rf-tabs" role="tablist">${tabs.map(id => `<button type="button" role="tab" data-tab="${esc(id)}" aria-selected="${id === current?.id}" title="${esc(refBoard(id)?.title ?? id)}"><b>${esc(id)}</b> ${esc(refBoard(id)?.title ?? '')}</button>`).join('')}</div>` : ''}
          <h1>${esc(current.title)}</h1>
        </div>${closeButton}</header>
        <textarea class="rf-note" rows="2" placeholder="What to redraw from these"></textarea>
        <div class="rf-grid">${current.images.map(card).join('')}</div>`;
    root.scrollTop = 0;
    sync();
  }

  function sync(): void {
    if (current) {
      const key = refKey(current.id);
      page.querySelectorAll<HTMLElement>('.rf-card').forEach(c => {
        const on = store.has(key, c.dataset.img as string), pick = c.querySelector('.rf-pick') as HTMLElement;
        c.classList.toggle('picked', on);
        pick.setAttribute('aria-pressed', `${on}`);
        pick.textContent = on ? '✓ Picked' : 'Pick';
      });
      const note = page.querySelector('.rf-note') as HTMLTextAreaElement;
      if (document.activeElement !== note) note.value = store.note(key);
    }
    page.querySelectorAll<HTMLElement>('.rf-tile').forEach(t => {
      const b = refBoard(t.dataset.board as string), n = b ? b.images.filter(im => store.has(refKey(b.id), im.id)).length : 0;
      (t.querySelector('.rf-count') as HTMLElement).textContent = n ? ` · ${n} picked` : '';
    });
  }

  function show(id: string | null, among: string[] = []): void {
    current = id === null ? null : refBoard(id) ?? null;
    tabs = current ? (among.includes(current.id) ? among : [current.id]) : [];
    unzoom();
    draw();
    if (opts.overlay) {
      root.hidden = false;
      document.documentElement.classList.add('refs-lock');
    }
  }
  /** A move the reader made, which refs.html records in the address. */
  function go(id: string | null, among?: string[]): void {
    show(id, among);
    opts.onShow?.(current?.id ?? null);
  }
  function close(): void {
    unzoom();
    root.hidden = true;
    document.documentElement.classList.remove('refs-lock');
  }

  function zoom(card: HTMLElement): void {
    const im = current?.images.find(x => x.id === card.dataset.img);
    if (!im?.src) return;
    (box.querySelector('img') as HTMLImageElement).src = im.src;
    (box.querySelector('.rf-box-cap') as HTMLElement).innerHTML = `${esc(im.caption)}<br/><span>${credit(im)}</span>`;
    box.hidden = false;
  }
  function unzoom(): void {
    box.hidden = true;
    (box.querySelector('img') as HTMLImageElement).removeAttribute('src');
  }

  root.addEventListener('click', e => {
    const t = e.target as Element;
    if (t === box || t.closest('[data-unzoom]')) { unzoom(); return; }
    if (t.closest('[data-close]')) { close(); return; }
    if (t.closest('[data-index]')) { go(null); return; }
    const tab = t.closest<HTMLElement>('[data-tab]'), board = t.closest<HTMLElement>('[data-board]');
    if (tab) { go(tab.dataset.tab as string, tabs); return; }
    if (board) { go(board.dataset.board as string); return; }
    const c = t.closest<HTMLElement>('.rf-card');
    if (!c || !current) return;
    if (t.closest('.rf-pick')) {
      const key = refKey(current.id), v = c.dataset.img as string;
      store.set(key, v, !store.has(key, v));
    } else if (t.closest('[data-zoom]')) zoom(c);
  });
  root.addEventListener('input', e => {
    const t = e.target as HTMLTextAreaElement;
    if (t.classList.contains('rf-note') && current) store.setNote(refKey(current.id), t.value);
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!box.hidden) unzoom();
    else if (opts.overlay && !root.hidden) close();
  });

  return { show, close, sync };
}
