// Style pilot: Figure-first pages on Bristol paper. Each slide switches between its lecture version (its lead
// page if it has one, otherwise the figure with the three claims) and its handout version (the study page the
// PDF keeps). The slide 6 animation runs in two looks. Double-clicking a page picks or unpicks the variant shown.
// In the picking view a page with reference boards (refs.ts) has a References button that opens them over the page,
// and a page with hook questions (hooks.ts) has a ? button in its left margin that opens its question set.
import './pilot.css';
import { grain } from '../lib/canvas';
import { ANIMATIONS } from './anim';
import { mountAnimation } from './anim/player';
import type { Staging } from './anim/types';
import { mountExcitation } from './excitation';
import { hookSet, hooksFor } from './hooks';
import { hooksView } from './hooksView';
import { installPapers } from './papers';
import { pickStore } from './picks';
import { statusStore } from './status';
import { LEADS, PLATES, fitPage, leadHtml, lectureHtml, plateHtml } from './plates';
import { boardsFor, refBoard } from './refs';
import { refsView } from './refsView';

type Mode = 'lecture' | 'handout';
type Kind = 'lead' | 'lecture' | 'handout';

const MODES = [
  { id: 'lecture', name: 'Lecture' },
  { id: 'handout', name: 'Handout' },
] as const;

/** Picking shows the player's title and variant switch (double-click the player to pick); lecture mode hides both, as in class. */
const VIEWS = [
  { id: 'picking', name: 'Picking' },
  { id: 'lecture', name: 'Lecture mode' },
] as const;
let lectureMode = false;

/** A version's label: its place in the list, 1, 2, 3 …, then its name without a letter id in front ("k · …", "m1 · …")
 *  (lecturer, 29 Oct 2026: "stop using letters; just numbers"); the ids stay internal, for URLs and picks. */
const vLabel = (x: { name: string }, i: number): string => `${i + 1} · ${x.name.replace(/^[A-Za-z]{1,3}\d{0,2}[a-z]?\s*·\s*/, '')}`;
const seg = (group: string, items: ReadonlyArray<{ id: string; name: string }>, on = items[0].id): string =>
  `<div class="seg" data-group="${group}">${items.map((x, i) => `<button type="button" data-v="${x.id}" aria-pressed="${x.id === on}">${vLabel(x, i)}</button>`).join('')}</div>`;

/** Only a slide with a lead page (and more than that page) has two versions; on every other slide lecture and handout
 *  are the same page, so it shows one page with its play button and no switch (lecturer, 26 Oct 2026). */
const twoVersions = (p: (typeof PLATES)[number]): boolean => !!LEADS[p.n] && !p.leadOnly;
/** A lead page keeps its own picks and note under lead-<n>; the lecture and handout versions share the slide's figure. */
const pickKey = (i: number, kind: Kind): string => (kind === 'lead' ? `lead-${PLATES[i].n}` : PLATES[i].pick ?? PLATES[i].n);
/** Reference boards and hook questions name pages by the number shown, which a moved slide's pick key is not. */
const pageKey = (i: number, kind: Kind): string => (kind === 'lead' ? `lead-${PLATES[i].n}` : PLATES[i].n);
/** The References button of a page with boards; it sits on the frame, outside the page, and shows only while picking. */
const refsButton = (key: string): string => {
  const boards = boardsFor(key);
  return boards.length ? `<button type="button" class="ref-open" data-refs="${key}" title="${boards.map(b => b.title).join(' · ').replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">References</button>` : '';
};
/** The ? button of a page that a chunk's hook questions are for; it sits on the frame in the page's left margin and
 *  shows only while picking. */
const hooksButton = (key: string): string => {
  const sets = hooksFor(key);
  return sets.length ? `<button type="button" class="hook-open" data-hooks="${key}" aria-label="Questions" title="${sets.map(h => h.title).join(' · ').replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">?</button>` : '';
};
const frame = (i: number, kind: Kind): string =>
  // no reference button on any slide (lecturer, 30 Oct 2026, late: "remove the reference button from all slides")
  `<div class="frame" data-s="${i}" data-kind="${kind}"><div class="plate"></div>${hooksButton(pageKey(i, kind))}</div>`;
const noteBox = (key: string, label: string): string =>
  `<textarea class="pick-note" rows="2" data-n="${key}" placeholder="Note for ${label}: what to keep, combine or change"></textarea>`;

const app = document.getElementById('pilot') as HTMLElement;
// Animations play only from a slide's ▶ button (lecturer, 27 Oct 2026). The page keeps one animation block only for the
// screenshot view ?anim=<key>&v=<id>&beat=<n>&t=<s>.
const animQuery = new URLSearchParams(location.search).get('anim');
app.innerHTML = `
  <!-- nothing above slide 1 (lecturer, 30 Oct 2026, lecture day: "remove everything above slide 1"); the Present button floats -->
  <button type="button" class="present-open" data-present title="Full screen, one slide at a time (P)">▶ Present</button>
  <span class="pick-status" aria-live="polite"></span>
  <section class="block">
    <div class="plates">${PLATES.map((p, i) => {
      const lead = LEADS[p.n];
      return `<section class="slide" data-s="${i}" data-mode="handout">
        <div class="slide-bar"><h3>Slide ${i + 1}${p.status === 'draft' ? ' · draft' : ''}${p.leadOnly ? ' · lecture page only' : ''}</h3><div class="slide-ctl"><span class="st-badge" data-st="${p.n}"></span><button type="button" class="st-freeze" data-freeze="${p.n}">❄ Freeze</button>${twoVersions(p) ? seg(`mode-${i}`, MODES, 'handout') : ''}</div></div>
        <div class="var-rows">
          ${lead && lead.VARIANTS.length > 1 ? `<div class="var-row" data-for="lecture"><span>Lecture</span>${seg(`lead-${i}`, lead.VARIANTS)}</div>` : ''}
          ${p.variants.length > 1 && !p.leadOnly ? `<div class="var-row" data-for="${lead ? 'handout' : 'both'}"><span>${lead ? 'Handout' : 'Figure'}</span>${seg(`variant-${i}`, p.variants)}</div>` : ''}
        </div>
        ${lead ? `<div class="lead-part">${frame(i, 'lead')}${noteBox(`lead-${p.n}`, `slide ${i + 1} lecture page`)}</div>` : ''}
        ${p.leadOnly ? '' : `${frame(i, 'handout')}${noteBox(p.pick ?? p.n, `slide ${i + 1}`)}`}
      </section>`;
    }).join('')}</div>
  </section>
  ${ANIMATIONS.filter(a => a.key === animQuery).map(a => `<section class="block anim-block">
    <div class="frame anim-frame" data-a="${ANIMATIONS.indexOf(a)}"><div></div></div>
  </section>`).join('')}`;

// Paper grain for the animation's Plate look, matching the lecture's canvas texture.
const g = document.createElement('canvas');
g.width = g.height = 160;
const gc = g.getContext('2d');
if (gc) { gc.fillStyle = grain(gc); gc.fillRect(0, 0, 160, 160); }
document.documentElement.style.setProperty('--grain', `url(${g.toDataURL()})`);
installPapers(document.documentElement);

const state = {
  variants: PLATES.map(p => p.variants[0].id),
  leads: PLATES.map(p => LEADS[p.n]?.VARIANTS[0].id ?? ''),
  modes: PLATES.map((p): Mode => (p.leadOnly ? 'lecture' : 'handout')),
};
const shown = (i: number, kind: Kind): string => (kind === 'lead' ? state.leads[i] : state.variants[i]);

// Solo view for screenshots: ?solo=<page>&v=<variant> shows one page at full size. <page> is the slide number
// (1–15, C1–C13) for the handout version, lecture-<n> for the lecture version and lead-<n> for a lead page
// (a slide with a lead page has no separate lecture page).
const query = new URLSearchParams(location.search);
const [, soloPrefix, soloN] = /^(?:(lead|lecture)-)?(.+)$/.exec(query.get('solo') ?? '') ?? [];
/** The slide whose number is <page>, else the plate at index <page> (slide numbers like 4a shift the indices). */
const soloByN = soloN === undefined ? -1 : PLATES.findIndex(p => p.n === soloN);
const solo = soloN === undefined ? -1 : soloByN >= 0 ? soloByN : PLATES.findIndex((_, i) => `${i}` === soloN);
if (solo >= 0) {
  const kind = (soloPrefix === 'lead' || (soloPrefix === 'lecture' && LEADS[PLATES[solo].n]) ? soloPrefix : 'handout') as Kind;
  document.body.classList.add('solo');
  state.modes[solo] = kind === 'handout' ? 'handout' : 'lecture';
  const v = query.get('v');
  if (v && kind === 'lead') state.leads[solo] = v;
  else if (v) state.variants[solo] = v;
  app.querySelector(`.plates .frame[data-s="${solo}"][data-kind="${kind}"]`)?.classList.add('solo-frame');
}

// Animations: each shows one staging variant at a time. ?anim=<key>&v=<id>&beat=<n>&t=<s> shows one beat at full
// size, frozen t seconds in (a large t gives the beat's end state), for screenshots.
const soloAnim = ANIMATIONS.findIndex(a => a.key === query.get('anim'));
const stagings = ANIMATIONS.map((a, i) => (i === soloAnim && a.stagings.find(s => s.id === query.get('v'))?.id) || a.stagings[0].id);
const stopAnim = ANIMATIONS.map(() => (): void => undefined);
if (soloAnim >= 0) {
  document.body.classList.add('solo');
  app.querySelector(`.anim-frame[data-a="${soloAnim}"]`)?.classList.add('solo-frame');
}
function showAnim(i: number): void {
  const a = ANIMATIONS[i], s = a.stagings.find(x => x.id === stagings[i]) ?? a.stagings[0];
  stopAnim[i]();
  const host = app.querySelector(`.anim-frame[data-a="${i}"]`)?.firstElementChild as HTMLElement | null;
  if (!host) return;
  const solo = i === soloAnim;
  stopAnim[i] = mountAnimation(host, a, s, solo ? { beat: Number(query.get('beat') ?? 0), freeze: query.has('t') ? Number(query.get('t')) : undefined } : {});
  app.querySelectorAll<HTMLElement>(`[data-group="anim-${i}"] button`).forEach(b => b.setAttribute('aria-pressed', `${b.dataset.v === s.id}`));
}

// Only the version on show is drawn: the lecture and handout copies of a figure share their SVG ids, and an
// arrowhead found first in a hidden copy would not render in the visible one.
const isShown = (i: number, kind: Kind): boolean => (kind === 'handout') === (state.modes[i] === 'handout');

function render(): void {
  // while presenting, the page's copies stay empty and the presenter redraws (e.g. when the saved picks arrive)
  if (document.body.classList.contains('presenting')) { showPresent(); return; }
  app.querySelectorAll<HTMLElement>('.plates .frame').forEach(fr => {
    const i = Number(fr.dataset.s), kind = fr.dataset.kind as Kind, p = PLATES[i];
    const plate = fr.firstElementChild as HTMLElement;
    plate.className = 'plate theme-editorial lay-figure paper-bristol';
    // A slide without a lead page is one page: the handout with its play button (print hides the button).
    plate.innerHTML = !isShown(i, kind) ? '' : kind === 'lead' ? leadHtml(p, LEADS[p.n].draw(state.leads[i])) : twoVersions(p) ? plateHtml(p, state.variants[i]) : lectureHtml(p, state.variants[i]);
  });
  fitPage(app);
  syncPicks();
}

/** Shows each slide in its chosen version and keeps the switches in step; "All slides" lights up only when they agree. */
function applyModes(): void {
  app.querySelectorAll<HTMLElement>('.plates .slide').forEach(sec => {
    const i = Number(sec.dataset.s);
    sec.dataset.mode = state.modes[i];
    sec.querySelectorAll<HTMLElement>(`[data-group="mode-${i}"] button`).forEach(b => b.setAttribute('aria-pressed', `${b.dataset.v === state.modes[i]}`));
    sec.querySelectorAll<HTMLElement>(`[data-group="variant-${i}"] button`).forEach(b => b.setAttribute('aria-pressed', `${b.dataset.v === state.variants[i]}`));
    sec.querySelectorAll<HTMLElement>(`[data-group="lead-${i}"] button`).forEach(b => b.setAttribute('aria-pressed', `${b.dataset.v === state.leads[i]}`));
  });
  render();
  fit();
}

// Picks: a ✓ on each picked variant's button, an outline on a page whose shown variant is picked, and the notes.
const store = pickStore(app.querySelector('.pick-status') as HTMLElement, () => { syncPicks(); openOnPicks(); refs.sync(); hooks.sync(); });
/** Once the saved picks are in, each slide and animation opens on its first picked variant (in list order), unless the
 *  page was opened on a given variant (?v=…). Runs once, so later picks don't jump the page under the lecturer. */
let pickedDefaults = false;
function openOnPicks(): void {
  if (pickedDefaults || !store.loaded) return;
  pickedDefaults = true;
  if (query.has('v')) return;
  PLATES.forEach((p, i) => {
    const v = p.variants.find(x => store.has(p.pick ?? p.n, x.id)), lv = LEADS[p.n]?.VARIANTS.find(x => store.has(`lead-${p.n}`, x.id));
    if (v) state.variants[i] = v.id;
    if (lv) state.leads[i] = lv.id;
  });
  ANIMATIONS.forEach((a, i) => {
    const sv = a.stagings.find(x => store.has(`anim-${a.key}`, x.id));
    if (sv) stagings[i] = sv.id;
  });
  applyModes();
  ANIMATIONS.forEach((_, i) => { if (soloAnim < 0 || i === soloAnim) showAnim(i); });
}
// Status (lecturer, 29 Oct 2026): a freeze button on each slide; frozen slides are left alone; a slide the assistant is
// building says so. The summary at the top lists both, by slide number.
const status = statusStore(syncStatus);
function syncStatus(): void {
  const frozen: number[] = [], building: string[] = [];
  PLATES.forEach((p, i) => {
    const fz = status.frozen(p.n), bd = status.building(p.n);
    if (fz) frozen.push(i + 1);
    if (bd) building.push(`${i + 1} (${bd})`);
    const sec = app.querySelector<HTMLElement>(`.plates .slide[data-s="${i}"]`);
    sec?.classList.toggle('is-frozen', fz);
    sec?.classList.toggle('is-building', !!bd);
    const badge = sec?.querySelector<HTMLElement>('.st-badge');
    if (badge) badge.textContent = fz ? '❄ frozen' : bd ? `🔧 being built: ${bd}` : '';
    const btn = sec?.querySelector<HTMLElement>('.st-freeze');
    if (btn) btn.textContent = fz ? 'Unfreeze' : '❄ Freeze';
  });
  const sum = app.querySelector<HTMLElement>('.st-sum');
  if (sum) sum.innerHTML = `<b>❄ Frozen:</b> ${frozen.length ? frozen.join(', ') : 'none yet'} · <b>🔧 Being built:</b> ${building.length ? building.join('; ') : 'nothing'}`;
}
app.addEventListener('click', e => {
  const n = (e.target as Element).closest<HTMLElement>('.st-freeze')?.dataset.freeze;
  if (n) status.toggle(n);
});
function syncPicks(): void {
  PLATES.forEach((p, i) => {
    for (const [group, key] of [[`variant-${i}`, p.pick ?? p.n], [`lead-${i}`, `lead-${p.n}`]]) {
      app.querySelectorAll<HTMLElement>(`[data-group="${group}"] button`).forEach(b => b.classList.toggle('picked', store.has(key, b.dataset.v as string)));
    }
  });
  app.querySelectorAll<HTMLElement>('.plates .frame').forEach(fr => {
    const i = Number(fr.dataset.s), kind = fr.dataset.kind as Kind;
    fr.classList.toggle('is-picked', store.has(pickKey(i, kind), shown(i, kind)));
  });
  ANIMATIONS.forEach((a, i) => {
    app.querySelectorAll<HTMLElement>(`[data-group="anim-${i}"] button`).forEach(b => b.classList.toggle('picked', store.has(`anim-${a.key}`, b.dataset.v as string)));
    app.querySelector(`.anim-frame[data-a="${i}"]`)?.classList.toggle('is-picked', store.has(`anim-${a.key}`, stagings[i]));
  });
  app.querySelectorAll<HTMLTextAreaElement>('.pick-note').forEach(box => {
    if (document.activeElement !== box) box.value = store.note(box.dataset.n as string);
  });
}
app.addEventListener('dblclick', e => {
  const af = (e.target as Element).closest('.anim-frame') as HTMLElement | null;
  if (af && !(e.target as Element).closest('button, a')) {
    const i = Number(af.dataset.a), key = `anim-${ANIMATIONS[i].key}`;
    store.set(key, stagings[i], !store.has(key, stagings[i]));
    return;
  }
  const fr = (e.target as Element).closest('.plates .frame') as HTMLElement | null;
  if (!fr || (e.target as Element).closest('.ref-open, .hook-open')) return;
  const i = Number(fr.dataset.s), kind = fr.dataset.kind as Kind;
  store.set(pickKey(i, kind), shown(i, kind), !store.has(pickKey(i, kind), shown(i, kind)));
});
// A double-click on a page picks; it should not also select a word.
app.addEventListener('mousedown', e => { if (e.detail > 1 && (e.target as Element).closest('.plates .frame, .anim-frame')) e.preventDefault(); });
app.addEventListener('input', e => {
  const t = e.target as HTMLTextAreaElement;
  if (t.classList.contains('pick-note')) store.setNote(t.dataset.n as string, t.value);
});


app.addEventListener('click', e => {
  const b = (e.target as Element).closest('button');
  if (!b) return;
  if (b.hasAttribute('data-play-excitation')) { playExcitation(); return; }
  if (b.dataset.play) { play(b.dataset.play); return; }
  if (b.dataset.refs) { const ids = boardsFor(b.dataset.refs).map(x => x.id); refs.show(ids[0], ids); return; }
  if (b.hasAttribute('data-refs-index')) { refs.show(null); return; }
  if (b.dataset.hooks) { const ids = hooksFor(b.dataset.hooks).map(x => x.id); hooks.show(ids[0], ids); return; }
  if (b.hasAttribute('data-hooks-index')) { hooks.show(null); return; }
  const group = (b.closest('.seg') as HTMLElement | null)?.dataset.group;
  const v = b.dataset.v;
  if (!group || !v) return;
  b.parentElement?.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', `${x === b}`));
  if (group === 'view') {
    lectureMode = v === 'lecture';
    document.body.classList.toggle('lecture-mode', lectureMode);
    return;
  }
  if (group.startsWith('mode-')) { state.modes[Number(group.slice(5))] = v as Mode; applyModes(); }
  // A variant opens the version it belongs to: lead variants the lecture version, figure variants the handout
  // (on a slide without a lead page both versions show the figure, so the version stays as it is).
  else if (group.startsWith('variant-')) {
    const i = Number(group.slice(8));
    state.variants[i] = v;
    if (LEADS[PLATES[i].n] && !PLATES[i].leadOnly) state.modes[i] = 'handout';
    applyModes();
  } else if (group.startsWith('lead-')) {
    const i = Number(group.slice(5));
    state.leads[i] = v;
    state.modes[i] = 'lecture';
    applyModes();
  } else if (group.startsWith('anim-')) {
    const i = Number(group.slice(5));
    stagings[i] = v;
    showAnim(i);
    syncPicks();
  }
});

// Every 1600 x 900 frame is scaled to the column width; a hidden version is sized when it is shown.
function fit(): void {
  app.querySelectorAll<HTMLElement>('.frame').forEach(fr => {
    const k = fr.clientWidth / 1600;
    fr.style.height = `${900 * k}px`;
    (fr.firstElementChild as HTMLElement).style.transform = `scale(${k})`;
  });
}
new ResizeObserver(fit).observe(app);
// A slide's play button runs its animation over the page, as in the lecture, fitted to the window. It plays the staging
// picked on this page (else the one shown in its animation block) and names it on the button; the bar over the player
// names it again and switches between the variants. Esc or the close button returns to the slide.
const player = document.createElement('div');
player.className = 'player';
player.hidden = true;
player.innerHTML = `<div class="player-bar"><span class="player-title"></span><div class="seg player-seg"></div></div>
  <div class="player-frame"><div></div></div><button type="button" class="player-close" aria-label="Close">×</button>`;
document.body.append(player);
let stopPlayer = (): void => undefined, playing = -1;
/** The staging a play button runs: the first picked, else the one shown in the animation's block. */
const playStaging = (i: number): Staging => {
  const a = ANIMATIONS[i];
  return a.stagings.find(x => store.has(`anim-${a.key}`, x.id)) ?? a.stagings.find(x => x.id === stagings[i]) ?? a.stagings[0];
};
function fitPlayer(): void {
  const bar = 72, k = Math.min(innerWidth / 1600, (innerHeight - bar) / 900), fr = player.querySelector('.player-frame') as HTMLElement;
  fr.style.width = `${1600 * k}px`;
  fr.style.height = `${900 * k}px`;
  (fr.firstElementChild as HTMLElement).style.transform = `scale(${k})`;
}
/** Takes an animation's block copy off the page (or puts it back): a staging's SVG ids are fixed, and with two copies
 *  mounted the player would pick up the hidden copy's filters and masks (as happened on 26 Oct 2026). */
function blockCopy(i: number, on: boolean): void {
  if (i < 0) return;
  if (on) { showAnim(i); return; }
  stopAnim[i]();
  stopAnim[i] = (): void => undefined;
  const host = app.querySelector(`.anim-frame[data-a="${i}"]`)?.firstElementChild as HTMLElement | null;
  if (host) host.innerHTML = '';
}
function mountPlaying(s: Staging): void {
  const a = ANIMATIONS[playing], host = player.querySelector('.player-frame > div') as HTMLElement;
  stopPlayer();
  blockCopy(playing, false);
  stopPlayer = mountAnimation(host, a, s);
  (player.querySelector('.player-title') as HTMLElement).textContent = a.title;
  player.querySelectorAll<HTMLElement>('.player-seg button').forEach(b => b.setAttribute('aria-pressed', `${b.dataset.v === s.id}`));
  host.focus();
}
function play(key: string): void {
  playing = ANIMATIONS.findIndex(a => a.key === key);
  if (playing < 0) return;
  const a = ANIMATIONS[playing];
  (player.querySelector('.player-seg') as HTMLElement).innerHTML = a.stagings
    .map((x, j) => `<button type="button" data-v="${x.id}" class="${store.has(`anim-${a.key}`, x.id) ? 'picked' : ''}">${vLabel(x, j)}</button>`).join('');
  player.hidden = false;
  fitPlayer();
  mountPlaying(playStaging(playing));
}
/** Slide 6's older "Follow an excitation" animation (its own controls), in the same player. */
function playExcitation(): void {
  playing = -1;
  (player.querySelector('.player-seg') as HTMLElement).innerHTML = '';
  (player.querySelector('.player-title') as HTMLElement).textContent = 'Follow an excitation';
  player.hidden = false;
  fitPlayer();
  stopPlayer();
  const host = player.querySelector('.player-frame > div') as HTMLElement, stage = document.createElement('div');
  host.innerHTML = '';
  host.append(stage);
  stopPlayer = mountExcitation(stage, 'plate');
  stage.focus();
}
function closePlayer(): void {
  stopPlayer();
  stopPlayer = (): void => undefined;
  (player.querySelector('.player-frame > div') as HTMLElement).innerHTML = '';
  player.hidden = true;
  blockCopy(playing, true);
}
player.addEventListener('click', e => {
  const v = (e.target as Element).closest<HTMLElement>('.player-seg button')?.dataset.v;
  if (v) { const s = ANIMATIONS[playing].stagings.find(x => x.id === v); if (s) mountPlaying(s); return; }
  if (e.target === player || (e.target as Element).closest('.player-close')) closePlayer();
});
// In picking mode a double-click on the playing animation picks (or unpicks) its variant; the switch marks it with a ✓.
player.addEventListener('dblclick', e => {
  if (lectureMode || playing < 0 || !(e.target as Element).closest('.player-frame')) return;
  const a = ANIMATIONS[playing], v = (player.querySelector('.player-seg [aria-pressed="true"]') as HTMLElement | null)?.dataset.v;
  if (!v) return;
  store.set(`anim-${a.key}`, v, !store.has(`anim-${a.key}`, v));
  player.querySelectorAll<HTMLElement>('.player-seg button').forEach(b => b.classList.toggle('picked', store.has(`anim-${a.key}`, b.dataset.v as string)));
});
player.addEventListener('mousedown', e => { if (e.detail > 1) e.preventDefault(); });
// Esc closes the animation only (not also the presenter under it)
addEventListener('keydown', e => { if (e.key === 'Escape' && !player.hidden) { closePlayer(); e.stopImmediatePropagation(); } });
addEventListener('resize', () => { if (!player.hidden) fitPlayer(); });

// References over the page: a page's button opens its boards (tabs when several), the top bar the index of all boards.
// ?refs=<board-id> opens that board on load (an unknown id opens the index).
const refsRoot = document.createElement('div');
document.body.append(refsRoot);
const refs = refsView(refsRoot, store, { overlay: true });
if (query.has('refs')) refs.show(refBoard(query.get('refs') as string) ? query.get('refs') : null);

// Hook questions over the page: a page's ? button opens its chunk (tabs when several), the top bar the index of all
// chunks. ?hooks=<chunk-id> opens that chunk on load (an unknown id opens the index).
const hooksRoot = document.createElement('div');
document.body.append(hooksRoot);
const hooks = hooksView(hooksRoot, store);
if (query.has('hooks')) hooks.show(hookSet(query.get('hooks') as string) ? query.get('hooks') : null);

applyModes();
ANIMATIONS.forEach((_, i) => { if (soloAnim < 0 || i === soloAnim) showAnim(i); });

/* ---------------------------------------------------------------- the presenter (lecture day, 30 Oct 2026) */
// Full screen, one slide at a time (lecturer: "make a full-screen mode for it; in lecture mode I can select between the
// lecture and the handout view"). ▶ Present (or P, or ?present=<slide number>) opens it on the slide in view; → / Space /
// PageDown next, ← / PageUp back, Home / End first and last, L lecture view, H handout view, Esc leaves. Each slide shows
// its picked variant (as on the page). Its ▶ plays the animation over it, without the variant switch (lecture mode);
// while the animation is open, the keys belong to it. While presenting, the page's own copies are emptied, so the
// figures' SVG ids exist once.
const pres = document.createElement('div');
pres.className = 'present';
pres.hidden = true;
// on-screen controls (lecturer: "in presentation mode there is no next button, no play button"): ‹ › at the sides, a bar
// with the animation's ▶, lecture/handout, the slide number and ×
pres.innerHTML = `<div class="present-frame"><div class="plate theme-editorial lay-figure paper-bristol"></div></div>
  <button type="button" class="present-step present-prev" data-step="-1" aria-label="Previous slide">‹</button>
  <button type="button" class="present-step present-next" data-step="1" aria-label="Next slide">›</button>
  <div class="present-ui"><button type="button" class="present-play" hidden>▶ Animation</button>
  <div class="seg present-seg">${MODES.map(m => `<button type="button" data-pm="${m.id}">${m.name}</button>`).join('')}</div>
  <span class="present-n"></span><button type="button" class="present-close" aria-label="Leave full screen">×</button></div>`;
document.body.append(pres);
// a laser pointer while presenting (lecturer, lecture day: "a laser pointer instead of the mouse, so it is clearer"): a red
// dot follows the mouse over the slide and the animations; the arrow comes back only on the controls; still for 4 s, it fades
const laser = document.createElement('div');
laser.className = 'laser';
document.body.append(laser);
let laserIdle = 0;
addEventListener('mousemove', e => {
  if (!document.body.classList.contains('presenting')) return;
  const onCtl = !!(e.target as Element).closest('button, .seg, .present-ui, .player-bar');
  laser.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  laser.classList.toggle('on', !onCtl);
  clearTimeout(laserIdle);
  laserIdle = window.setTimeout(() => laser.classList.remove('on'), 4000);
});
document.documentElement.addEventListener('mouseleave', () => laser.classList.remove('on'));
// drawing while presenting (lecturer, lecture day: "if I hold it, I can draw on the slides; it disappears if I press C, or
// 30 s after releasing"): hold the mouse button and drag to draw in red over the slide or the animation; C wipes it at once,
// and it fades by itself 30 s after the last stroke; a drag that drew never counts as a click (no step, no slide change)
const ink = document.createElement('canvas');
ink.className = 'ink';
document.body.append(ink);
const ictx = ink.getContext('2d') as CanvasRenderingContext2D;
let inkAt: { x: number; y: number } | null = null, inkDrew = false, inkClear = 0;
function sizeInk(): void {
  const r = devicePixelRatio || 1;
  ink.width = Math.round(innerWidth * r); ink.height = Math.round(innerHeight * r);
  ictx.setTransform(r, 0, 0, r, 0, 0);
  ictx.lineCap = 'round'; ictx.lineJoin = 'round'; ictx.lineWidth = 4; ictx.strokeStyle = '#e3120b';
  ictx.shadowColor = 'rgba(255,45,30,.45)'; ictx.shadowBlur = 6;
}
sizeInk();
addEventListener('resize', sizeInk);
function wipeInk(now = false): void {
  clearTimeout(inkClear);
  if (now) { ictx.clearRect(0, 0, innerWidth, innerHeight); return; }
  ink.classList.add('fading');
  setTimeout(() => { ictx.clearRect(0, 0, innerWidth, innerHeight); ink.classList.remove('fading'); }, 400);
}
addEventListener('mousedown', e => {
  inkDrew = false;
  if (!document.body.classList.contains('presenting') || e.button !== 0) return;
  if ((e.target as Element).closest('button, .seg, .present-ui, .player-bar')) return;
  inkAt = { x: e.clientX, y: e.clientY };
  clearTimeout(inkClear);
}, true);
addEventListener('mousemove', e => {
  if (!inkAt || !(e.buttons & 1)) return;
  if (!inkDrew && Math.hypot(e.clientX - inkAt.x, e.clientY - inkAt.y) < 4) return;
  ictx.beginPath(); ictx.moveTo(inkAt.x, inkAt.y); ictx.lineTo(e.clientX, e.clientY); ictx.stroke();
  inkAt = { x: e.clientX, y: e.clientY }; inkDrew = true;
});
addEventListener('mouseup', () => {
  if (!inkAt) return;
  inkAt = null;
  if (inkDrew) { clearTimeout(inkClear); inkClear = window.setTimeout(() => wipeInk(), 30000); }
}, true);
addEventListener('click', e => { if (inkDrew) { inkDrew = false; e.stopImmediatePropagation(); e.preventDefault(); } }, true);
addEventListener('dragstart', e => { if (document.body.classList.contains('presenting')) e.preventDefault(); }, true);
addEventListener('keydown', e => {
  if ((e.key === 'c' || e.key === 'C') && document.body.classList.contains('presenting')) { wipeInk(); e.stopImmediatePropagation(); }
}, true);
let pIdx = 0, pMode: Mode = 'lecture';
const pPlate = pres.querySelector('.present-frame > .plate') as HTMLElement;
/** The page on show: lecture = the lead page if the slide has one, else the page with its play button; handout = the
 *  study page, with its play button too (lecturer, lecture day: "if lecture and handout are the same, just show the same,
 *  and add the play button"), so a slide with an animation shows its ▶ in both views. */
function presentHtml(i: number): string {
  const p = PLATES[i], lead = LEADS[p.n];
  if (lead && (p.leadOnly || pMode === 'lecture')) return leadHtml(p, lead.draw(state.leads[i]));
  return lectureHtml(p, state.variants[i]);
}
function fitPresent(): void {
  const k = Math.min(innerWidth / 1600, innerHeight / 900), fr = pres.querySelector('.present-frame') as HTMLElement;
  fr.style.width = `${1600 * k}px`;
  fr.style.height = `${900 * k}px`;
  pPlate.style.transform = `scale(${k})`;
}
function showPresent(): void {
  pPlate.innerHTML = presentHtml(pIdx);
  fitPage(pres);
  (pres.querySelector('.present-n') as HTMLElement).textContent = `${pIdx + 1} / ${PLATES.length}`;
  // the bar's ▶ plays the slide's animation (the same as the ▶ on the page), in both views
  const pl = pres.querySelector('.present-play') as HTMLButtonElement, p = PLATES[pIdx];
  pl.hidden = !p.play && !p.animation;
  pl.dataset.key = p.play ?? '';
  (pres.querySelector('.present-prev') as HTMLButtonElement).disabled = pIdx === 0;
  (pres.querySelector('.present-next') as HTMLButtonElement).disabled = pIdx === PLATES.length - 1;
  // the lecture/handout switch only where the 2 views differ (a slide with a lead page)
  (pres.querySelector('.present-seg') as HTMLElement).hidden = !twoVersions(p);
  pres.querySelectorAll<HTMLElement>('.present-seg button').forEach(b => b.setAttribute('aria-pressed', `${b.dataset.pm === pMode}`));
}
/** The slide whose top is nearest the top of the window. */
function slideInView(): number {
  let best = 0, d = Infinity;
  app.querySelectorAll<HTMLElement>('.plates .slide').forEach(sec => {
    const y = Math.abs(sec.getBoundingClientRect().top);
    if (y < d) { d = y; best = Number(sec.dataset.s); }
  });
  return best;
}
function openPresent(at = slideInView()): void {
  pIdx = Math.max(0, Math.min(PLATES.length - 1, at));
  app.querySelectorAll<HTMLElement>('.plates .frame > .plate').forEach(pl => { pl.innerHTML = ''; });
  lectureMode = true;
  document.body.classList.add('lecture-mode', 'presenting');
  pres.hidden = false;
  fitPresent();
  showPresent();
  void document.documentElement.requestFullscreen?.().catch(() => undefined);
}
function closePresent(): void {
  if (!player.hidden) closePlayer();
  pres.hidden = true;
  pPlate.innerHTML = '';
  lectureMode = false;
  laser.classList.remove('on');
  wipeInk(true);
  document.body.classList.remove('lecture-mode', 'presenting');
  if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
  render();
  fit();
  app.querySelector(`.plates .slide[data-s="${pIdx}"]`)?.scrollIntoView({ block: 'start' });
}
function stepPresent(d: number): void {
  const n = Math.max(0, Math.min(PLATES.length - 1, pIdx + d));
  if (n !== pIdx) { pIdx = n; showPresent(); }
}
app.addEventListener('click', e => { if ((e.target as Element).closest('[data-present]')) openPresent(); });
pres.addEventListener('click', e => {
  const b = (e.target as Element).closest('button');
  if (!b) return;
  if (b.classList.contains('present-close')) { closePresent(); return; }
  if (b.dataset.step) { stepPresent(Number(b.dataset.step)); return; }
  if (b.classList.contains('present-play')) { if (b.dataset.key) play(b.dataset.key); else playExcitation(); return; }
  if (b.dataset.pm) { pMode = b.dataset.pm as Mode; showPresent(); return; }
  if (b.hasAttribute('data-play-excitation')) { playExcitation(); return; }
  if (b.dataset.play) play(b.dataset.play);
});
// A plays the slide's animation, and A again leaves it (lecturer, lecture day: "if I press A, play the animation; A again, exit")
addEventListener('keydown', e => {
  if (pres.hidden || (e.key !== 'a' && e.key !== 'A') || e.metaKey || e.ctrlKey || e.altKey) return;
  e.preventDefault(); e.stopImmediatePropagation();
  if (!player.hidden) { closePlayer(); return; }
  const pl = pres.querySelector('.present-play') as HTMLButtonElement;
  if (pl.hidden) return;
  if (pl.dataset.key) play(pl.dataset.key); else playExcitation();
}, { capture: true });
addEventListener('keydown', e => {
  if (!pres.hidden && player.hidden) {
    const k = e.key;
    if (k === 'ArrowRight' || k === ' ' || k === 'PageDown') stepPresent(1);
    else if (k === 'ArrowLeft' || k === 'PageUp') stepPresent(-1);
    else if (k === 'Home') stepPresent(-PLATES.length);
    else if (k === 'End') stepPresent(PLATES.length);
    else if (k === 'l' || k === 'L') { pMode = 'lecture'; showPresent(); }
    else if (k === 'h' || k === 'H') { pMode = 'handout'; showPresent(); }
    else if (k === 'Escape') closePresent();
    else return;
    e.preventDefault();
    return;
  }
  if (pres.hidden && (e.key === 'p' || e.key === 'P') && !(e.target as Element).closest?.('textarea, input')) openPresent();
}, { capture: true });  // before the player's own Esc, so one Esc closes only the animation
// leaving the browser's full screen (its own Esc) keeps the presenter, fitted to the window
addEventListener('resize', () => { if (!pres.hidden) fitPresent(); });
if (query.has('present')) openPresent(Math.max(0, Number(query.get('present') || 1) - 1));
