import './review.css';
import bundleText from '../../research/review-2026-10-22/review-data.json?raw';
import researchText from '../../research/review-2026-10-22/RESEARCH_NOTES.md?raw';
import energyText from '../../research/review-2026-10-22/ENERGY_ACCOUNTING.md?raw';
import fullReviewText from '../../research/review-2026-10-22/CONTEXT_REVIEW.md?raw';

type Status = 'not-yet-approved' | 'changes-requested' | 'approved';
interface Source {
  id: string; title: string; authors: string; year: number; journal?: string;
  doi?: string; url: string; basis: string; use: string; existingZoteroItem?: string;
}
interface Section { heading: string; paragraphs: string[]; refs: string[] }
interface OriginalReference { title: string; citation: string; url: string; note: string }
interface OriginalSection { heading: string; paragraphs: string[]; steps?: string[]; referenceUrls?: string[] }
interface Draft {
  id: string; lecture: 'light' | 'carbon'; minutes: number; title: string;
  kind: 'approved-baseline' | 'draft'; proposalStatus: 'not-yet-approved';
  bridgeIn: string; takeaway: string; context: Section[]; study: string[]; bridgeOut: string;
  sources: string[]; optional: string[];
  history: { title: string; body: string; seconds: number; priority: string; refs: string[] };
  illustration: { static: string; animation: string; seconds: number; priority: string };
  evidence: { point: string; scope: string; refs: string[] }[];
  approvedContext?: {
    source: string; status: string;
    context: { title: string; sections: OriginalSection[]; references: OriginalReference[] };
  };
}
interface Bundle {
  title: string; prepared: string; researchCutoff: string;
  lectures: { id: 'light' | 'carbon'; title: string; teachingMinutes: number; discussionMinutes: number }[];
  drafts: Draft[]; sources: Source[];
}
interface Decision { status: Status; notes: string; updatedAt?: string }
type Decisions = Record<string, Decision>;
const data = JSON.parse(bundleText) as Bundle;
const root = document.querySelector<HTMLDivElement>('#review')!;
const sources = new Map(data.sources.map(s => [s.id, s]));
const storageKey = 'photosynthesis-context-review-2026-10-23-v1';
const statusNames: Record<Status, string> = {
  'not-yet-approved': 'Not yet approved',
  'changes-requested': 'Changes requested',
  approved: 'Approved by you',
};
let storageAvailable = true;
let decisions: Decisions = {};
try {
  const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
  if (saved && typeof saved === 'object') {
    for (const d of data.drafts) {
      const value = (saved as Record<string, unknown>)[d.id];
      if (!value || typeof value !== 'object') continue;
      const item = value as Partial<Decision>;
      if (item.status && item.status in statusNames && typeof item.notes === 'string') {
        decisions[d.id] = { status: item.status, notes: item.notes, updatedAt: item.updatedAt };
      }
    }
  }
} catch { storageAvailable = false; }

const esc = (value: unknown): string => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]!));
const decision = (id: string): Decision => decisions[id] ?? { status: 'not-yet-approved', notes: '' };
const label = (id: string): string => statusNames[decision(id).status];
const badge = (id: string): string => {
  const state = decision(id).status;
  return '<span class="badge ' + (state === 'approved' ? 'approved' : state === 'changes-requested' ? 'changes' : '') + '">' + esc(label(id)) + '</span>';
};
function save(id: string, change: Partial<Decision>): void {
  decisions[id] = { ...decision(id), ...change, updatedAt: new Date().toISOString() };
  try { localStorage.setItem(storageKey, JSON.stringify(decisions)); storageAvailable = true; }
  catch { storageAvailable = false; }
}
const saveMessage = (): string => storageAvailable
  ? 'Review decisions stay in this browser. Export them for a durable copy. The lecture, existing planner and source approval flags are unchanged.'
  : 'Browser storage is unavailable. Export your decisions before leaving this page.';
function citation(ids: string[]): string {
  return '<p class="refs">' + ids.map(id => {
    const s = sources.get(id);
    if (!s) return '';
    const short = s.authors.length > 48 ? s.authors.split(',')[0] + ' et al.' : s.authors;
    return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(short) + ' (' + s.year + ')</a>';
  }).filter(Boolean).join(' · ') + '</p>';
}
function sourceCard(s: Source): string {
  return '<div class="source" id="source-' + esc(s.id) + '"><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
    esc(s.title) + '</a><p class="source-meta">' + esc(s.authors) + ' · ' + s.year + ' · ' + esc(s.journal ?? '') +
    '</p><p>' + esc(s.use) + '</p><p class="source-meta">Evidence read: ' + esc(s.basis) + '</p></div>';
}
function slots(d: Draft): string {
  let start = 0;
  for (const other of data.drafts) {
    if (other.lecture !== d.lecture) continue;
    if (other.id === d.id) return start + '–' + (start + d.minutes);
    start += other.minutes;
  }
  return '';
}
function sidebar(current: string): string {
  return '<aside class="sidebar"><nav aria-label="Review navigation">' +
    '<a href="#overview"' + (current === 'overview' ? ' aria-current="page"' : '') + '>Overview and timing</a>' +
    '<a href="#research">Research and illustration priorities</a><a href="#energy">Energy accounting</a><a href="#sources">Source register</a></nav>' +
    data.lectures.map(l => '<div class="toc-group"><div class="side-heading">' + esc(l.title) +
      '<span>43 min teaching + 2 min questions</span></div><nav aria-label="' + esc(l.title) + '">' +
      data.drafts.filter(d => d.lecture === l.id).map(d =>
        '<a class="toc-item" href="#' + d.id + '"' + (current === d.id ? ' aria-current="page"' : '') + '>' +
        '<span class="toc-id">' + d.id + '</span><span>' + esc(d.title) +
        (decision(d.id).status === 'approved' ? ' <span class="toc-mark" aria-label="approved">✓</span>' : '') +
        '</span><span class="toc-time">' + d.minutes + 'm</span></a>').join('') + '</nav></div>').join('') + '</aside>';
}
function shell(current: string, body: string): void {
  root.innerHTML = '<header class="topbar"><a class="brand" href="#overview">Photosynthesis · Context review</a>' +
    '<div class="toplinks"><a href="/#5" target="_blank" rel="noopener">Existing lecture</a>' +
    '<a href="/planning.html" target="_blank" rel="noopener">Existing planner</a>' +
    '<button type="button" data-action="export">Export review decisions</button></div></header>' +
    '<div class="shell">' + sidebar(current) + '<main class="content"><div class="reading">' + body + '</div></main></div>';
}
function overview(): void {
  const count = data.drafts.filter(d => decision(d.id).status === 'approved').length;
  let body = '<div class="meta"><span>Prepared 23 October 2026</span><span class="badge">New drafts await your review</span></div>' +
    '<h1>Photosynthesis lecture contexts</h1><p class="lead">21 new contexts follow the six agreed opening slides. Each proposal includes its scientific explanation, key message, timing, evidence and illustration ideas.</p>' +
    '<p class="notice">The six approved contexts are included unchanged. The 21 new drafts are also available as <a href="/#7">slides 7–27 in the lecture</a>, each marked <strong>UNREVIEWED</strong>. This page keeps the detailed research review notes.</p>' +
    '<div class="overview-actions"><a class="button" href="#L07">Start with the next context</a><a class="button" href="#C01">Review carbon reactions</a>' +
    '<button data-action="download" type="button">Download all contexts</button></div>' +
    '<p class="status-line">' + count + ' of ' + data.drafts.length + ' new proposals approved. The boxes below concern new proposals; they do not revoke the prior approval of slides 1–6.</p>';
  for (const l of data.lectures) {
    body += '<section class="lecture-overview"><div class="lecture-title"><h2>' + esc(l.title) + '</h2><span>43 + 2 = 45 minutes</span></div>';
    for (const d of data.drafts.filter(x => x.lecture === l.id)) {
      body += '<div class="plan-row"><input class="plan-check" type="checkbox" data-approve="' + d.id +
        '" aria-label="Approve new proposal for ' + esc(d.title) + '"' + (decision(d.id).status === 'approved' ? ' checked' : '') + '>' +
        '<span class="plan-slot">' + slots(d) + ' min</span><div><a class="plan-title" href="#' + d.id + '">' + d.id + ' · ' + esc(d.title) +
        '</a><span class="plan-sub">' + (d.kind === 'approved-baseline' ? 'Agreed context unchanged · new suggestions: ' : '') + esc(label(d.id)) +
        (d.id === 'C10' ? ' · Optional slot' : '') + '</span></div><span class="plan-minute">' + d.minutes + ' min</span></div>';
    }
    body += '<div class="plan-row"><span></span><span class="plan-slot">43–45 min</span><div>Questions and connection</div><span class="plan-minute">2 min</span></div></section>';
  }
  body += '<p class="notice">CAM is a provisional two-minute comparison. If removed, give those two minutes to the C₂/C₄ discussion. Environmental controls, acclimation and applications remain outside this plan.</p>' +
    '<p class="saved">' + saveMessage() + '</p>';
  shell('overview', body);
}
function draftPage(d: Draft): void {
  const isBaseline = Boolean(d.approvedContext);
  let body = '<div class="meta"><span>' + esc(d.lecture === 'light' ? 'Light reactions' : 'Carbon reactions') + ' · ' + d.id +
    '</span><span>' + d.minutes + ' minutes · ' + slots(d) + ' min</span>' + badge(d.id) + '</div><h1>' + esc(d.title) + '</h1>';
  if (isBaseline) body += '<div class="baseline"><p><strong>Agreed context unchanged.</strong> The explanation below is copied from the context approved on 22 October. The review status on this page applies to the additional suggestions.</p></div>';
  body += '<p class="bridge"><strong>Connection:</strong> ' + esc(d.bridgeIn) + '</p>' +
    '<div class="takeaway"><small>Key message · proposal</small><p>' + esc(d.takeaway) + '</p></div>' +
    '<h2>' + (isBaseline ? 'Agreed lecture context' : 'Draft lecture context') + '</h2>';
  if (d.approvedContext) {
    const original = d.approvedContext.context;
    body += original.sections.map(s => '<section class="context-section"><h3>' + esc(s.heading) + '</h3>' +
      s.paragraphs.map(p => '<p>' + esc(p) + '</p>').join('') +
      (s.steps ? '<ol>' + s.steps.map(p => '<li>' + esc(p) + '</li>').join('') + '</ol>' : '') +
      '<p class="refs">' + (s.referenceUrls ?? []).map(url => {
        const ref = original.references.find(r => r.url === url);
        return ref ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(ref.citation) + '</a>' : '';
      }).join(' · ') + '</p></section>').join('');
    body += '<details><summary>References in the agreed context</summary>' + original.references.map(r =>
      '<div class="source"><a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(r.title) +
      '</a><p class="source-meta">' + esc(r.citation) + '</p><p>' + esc(r.note) + '</p></div>').join('') + '</details>';
  }
  body += d.context.map(s => '<section class="context-section"><h3>' + esc(s.heading) + '</h3>' +
    s.paragraphs.map(p => '<p>' + esc(p) + '</p>').join('') + citation(s.refs) + '</section>').join('');
  body += '<details><summary>Proposed static content and illustration</summary><p class="details-note">For a later visual prompt. These are unapproved suggestions; no new teaching graphic or animation has been made.</p><ul>' +
    d.study.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul><h3>Static illustration</h3><p>' + esc(d.illustration.static) +
    '</p><h3>Animation</h3><p>' + esc(d.illustration.animation) + '</p><p class="details-note">' +
    esc(d.illustration.priority) + ' · Playback cap: ' + d.illustration.seconds + ' seconds within the slide time.</p></details>';
  body += '<details><summary>Historical connection · ' + esc(d.history.priority) + '</summary><h3>' + esc(d.history.title) +
    '</h3><p>' + esc(d.history.body) + '</p><p class="details-note">' + d.history.seconds + ' spoken seconds, included in the slide time.</p>' +
    citation(d.history.refs) + '</details>';
  body += '<details><summary>Recent evidence and its limits</summary>' + (d.evidence.length ?
    d.evidence.map(e => '<p>' + esc(e.point) + '</p><p class="details-note"><strong>Scope:</strong> ' + esc(e.scope) + '</p>' + citation(e.refs)).join('') :
    '<p>The established context is retained; no new result is needed to motivate this opening question.</p>') + '</details>';
  if (d.optional.length) body += '<details><summary>Keep in reserve</summary><ul>' + d.optional.map(p => '<li>' + esc(p) + '</li>').join('') + '</ul></details>';
  body += '<details><summary>Linked sources · ' + d.sources.length + '</summary>' +
    d.sources.map(id => sources.get(id)).filter((s): s is Source => Boolean(s)).map(sourceCard).join('') + '</details>';
  if (['L10','L11','C04','C06','C09','C12'].includes(d.id)) body += '<p class="refs"><a href="#energy">Open the full energy and model accounting note</a></p>';
  body += '<p class="bridge"><strong>Next connection:</strong> ' + esc(d.bridgeOut) + '</p>' +
    '<section class="review-controls" aria-label="Review this proposal"><div class="control-row"><label for="status">Your decision on the new proposal</label>' +
    '<select id="status" data-status="' + d.id + '">' +
    (Object.entries(statusNames) as [Status, string][]).map(([value, name]) => '<option value="' + value + '"' +
      (decision(d.id).status === value ? ' selected' : '') + '>' + esc(name) + '</option>').join('') + '</select></div>' +
    '<label class="note-label" for="review-note">Notes for our discussion</label><textarea id="review-note" data-note="' + d.id +
    '" placeholder="What should stay, change or be removed?">' + esc(decision(d.id).notes) + '</textarea><p class="saved" id="save-state" aria-live="polite">' +
    saveMessage() + '</p></section>';
  const index = data.drafts.indexOf(d), prev = data.drafts[index - 1], next = data.drafts[index + 1];
  body += '<nav class="pager" aria-label="Previous and next context">' +
    (prev ? '<a class="button" href="#' + prev.id + '">← ' + prev.id + ' ' + esc(prev.title) + '</a>' : '<a class="button" href="#overview">← Overview</a>') +
    (next ? '<a class="button" href="#' + next.id + '">' + next.id + ' ' + esc(next.title) + ' →</a>' : '<a class="button" href="#overview">Back to overview →</a>') + '</nav>';
  shell(d.id, body);
}
function inline(text: string): string {
  return esc(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|#[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\x60([^\x60]+)\x60/g, '<code>$1</code>');
}
function markdown(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  let paragraph: string[] = [], list = false;
  const flush = (): void => { if (paragraph.length) { out.push('<p>' + inline(paragraph.join(' ')) + '</p>'); paragraph = []; } };
  const closeList = (): void => { if (list) { out.push('</ul>'); list = false; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('|')) {
      flush(); closeList();
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        if (!/^\|[\s:|\-]+\|$/.test(lines[i])) rows.push(lines[i].split('|').slice(1, -1).map(s => s.trim()));
        i++;
      }
      i--;
      out.push('<div class="table-wrap"><table><thead><tr>' + rows[0].map(c => '<th>' + inline(c) + '</th>').join('') +
        '</tr></thead><tbody>' + rows.slice(1).map(r => '<tr>' + r.map(c => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') +
        '</tbody></table></div>');
    } else if (/^#{1,3} /.test(line)) {
      flush(); closeList(); const depth = line.match(/^#+/)![0].length;
      out.push('<h' + depth + '>' + inline(line.slice(depth + 1)) + '</h' + depth + '>');
    } else if (line.startsWith('- ')) {
      flush(); if (!list) { out.push('<ul>'); list = true; } out.push('<li>' + inline(line.slice(2)) + '</li>');
    } else if (!line.trim()) { flush(); closeList(); }
    else { closeList(); paragraph.push(line.trim()); }
  }
  flush(); closeList();
  return out.join('');
}
function render(): void {
  const current = location.hash.slice(1) || 'overview';
  const draft = data.drafts.find(d => d.id === current);
  if (draft) draftPage(draft);
  else if (current === 'research' || current === 'energy') {
    shell(current, '<div class="md">' + markdown(current === 'research' ? researchText : energyText) + '</div><p><a href="#overview">Return to overview</a></p>');
  } else if (current === 'sources') {
    shell(current, '<div class="sources-header"><h1>Source register</h1><input class="filter" id="source-filter" type="search" aria-label="Filter sources" placeholder="Filter by topic, author or year"></div>' +
      '<p class="lead">' + data.sources.length + ' selected sources. Each record states what was read and what the source supports.</p>' +
      '<p class="notice">New Zotero saves are pending: collection reads timed out before duplicate/PDF verification. The selected papers are recorded in ZOTERO_QUEUE.json. Previously saved keys remain in the data.</p>' +
      '<div id="source-list">' + data.sources.map(sourceCard).join('') + '</div>');
  } else overview();
}
function download(name: string, text: string, type: string): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
root.addEventListener('click', e => {
  const button = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
  if (!button) return;
  if (button.dataset.action === 'export') {
    download('photosynthesis-review-decisions.json', JSON.stringify({
      prepared: data.prepared, exportedAt: new Date().toISOString(), scope: 'New proposals only; existing lecture approval is unchanged',
      decisions: data.drafts.map(d => ({ id: d.id, title: d.title, ...decision(d.id) })),
    }, null, 2), 'application/json');
  } else if (button.dataset.action === 'download') download('photosynthesis-context-review.md', fullReviewText, 'text/markdown');
});
root.addEventListener('change', e => {
  const target = e.target as HTMLInputElement | HTMLSelectElement;
  if (target.dataset.status) {
    save(target.dataset.status, { status: target.value as Status });
    const keepY = window.scrollY; render(); window.scrollTo(0, keepY);
    document.querySelector<HTMLSelectElement>('#status')?.focus({ preventScroll: true });
  } else if (target.dataset.approve && target instanceof HTMLInputElement) {
    const id = target.dataset.approve, keepY = window.scrollY;
    save(id, { status: target.checked ? 'approved' : 'not-yet-approved' });
    render(); window.scrollTo(0, keepY);
    root.querySelector<HTMLInputElement>('[data-approve="' + id + '"]')?.focus({ preventScroll: true });
  }
});
root.addEventListener('input', e => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement;
  if (target.dataset.note) {
    save(target.dataset.note, { notes: target.value });
    const state = document.querySelector('#save-state'); if (state) state.textContent = saveMessage();
  } else if (target.id === 'source-filter') {
    const query = target.value.toLowerCase().trim();
    const filtered = data.sources.filter(s => (s.title + ' ' + s.authors + ' ' + s.year + ' ' + s.use + ' ' + s.journal).toLowerCase().includes(query));
    document.querySelector('#source-list')!.innerHTML = filtered.length ? filtered.map(sourceCard).join('') : '<p class="empty">No matching source.</p>';
  }
});
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
window.addEventListener('keydown', e => {
  if ((e.target as HTMLElement).closest('input,textarea,select,button,summary') || e.altKey || e.ctrlKey || e.metaKey) return;
  const index = data.drafts.findIndex(d => d.id === location.hash.slice(1));
  if (index < 0 || !['ArrowLeft','ArrowRight'].includes(e.key)) return;
  const next = data.drafts[index + (e.key === 'ArrowRight' ? 1 : -1)];
  if (next) { e.preventDefault(); location.hash = next.id; }
});
render();

