"""Export the review bundle and readable notes; never write lecture sources."""
from pathlib import Path
import json
import re
import html

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent

def clean(value):
    return re.sub(r'<[^>]+>', '', html.unescape(str(value))).strip().rstrip('.')

old = {p['doi'].lower(): p for p in json.loads((ROOT / 'research/light-reactions/papers.json').read_text())['papers']}
new = {p['doi'].lower(): p['records'][0] for p in json.loads((HERE / 'metadata-europepmc.json').read_text()) if p.get('records')}
sources = json.loads((HERE / 'source-selections.json').read_text())
for s in sources:
    doi = s.get('doi', '')
    if doi.lower() in new:
        p = new[doi.lower()]
        s.setdefault('title', clean(p['title']))
        s.setdefault('authors', p['authorString'])
        s.setdefault('year', int(p['pubYear']))
        s.setdefault('journal', p['journalInfo']['journal']['title'])
        s['firstPublicationDate'] = p.get('firstPublicationDate')
        if p.get('pmcid'):
            s['pmcid'] = p['pmcid']
    elif doi.lower() in old:
        p = old[doi.lower()]
        for field, key in [('title','title'), ('authors','citation_label'), ('year','citation_year'), ('journal','journal')]:
            s.setdefault(field, p[key])
        if p.get('zotero_item_key'):
            s['existingZoteroItem'] = p['zotero_item_key']
    if doi:
        s.setdefault('url', 'https://doi.org/' + doi)
    if doi.lower() in old and old[doi.lower()].get('zotero_item_key'):
        s['existingZoteroItem'] = old[doi.lower()]['zotero_item_key']
    for field in ['title', 'journal']:
        if field in s:
            s[field] = clean(s[field])
    assert all(k in s for k in ['title','authors','year','url','basis','use']), s['id']

drafts = json.loads((HERE / 'drafts.json').read_text())
approved = {p['id']: p for p in json.loads((HERE / 'approved-contexts.json').read_text())}
byid = {s['id']: s for s in sources}
assert len(byid) == len(sources)
for d in drafts:
    assert d['proposalStatus'] == 'not-yet-approved'
    if d['id'] in approved:
        d['approvedContext'] = approved[d['id']]
    refs = set(d['sources'])
    for sec in d['context']:
        refs.update(sec.get('refs', []))
    for e in d['evidence']:
        refs.update(e['refs'])
    refs.update(d['history'].get('refs', []))
    for ref in refs:
        assert ref in byid, (d['id'], ref)
    assert len(d['takeaway']) < 240
    assert d['minutes'] > 0
    d['sources'] = list(dict.fromkeys(d['sources'] + sorted(refs)))
for lecture in ['light','carbon']:
    assert sum(d['minutes'] for d in drafts if d['lecture'] == lecture) == 43

bundle = {
    'title': 'Photosynthesis lecture context review',
    'prepared': '2026-10-23',
    'researchCutoff': '2026-10-23',
    'status': 'All new contexts and suggestions are not yet approved. Six previously approved contexts are included unchanged as the baseline.',
    'lectures': [
        {'id':'light','title':'Light reactions','teachingMinutes':43,'discussionMinutes':2},
        {'id':'carbon','title':'Carbon reactions','teachingMinutes':43,'discussionMinutes':2}
    ],
    'drafts': drafts,
    'sources': sources,
}
(HERE / 'review-data.json').write_text(json.dumps(bundle, ensure_ascii=False, indent=2) + '\n')

def citations(ids):
    return ' · '.join(f"[{byid[i]['authors'].split(',')[0]} ({byid[i]['year']})]({byid[i]['url']})" for i in ids)

lines = [
    '# Photosynthesis lecture context review', '',
    'Prepared 23 October 2026. **All new contexts and suggestions are NOT YET APPROVED.** The six agreed opening contexts are copied unchanged for reference; their prior approval is retained. The live lecture and original animations are unchanged.', '',
    'Two 45-minute lectures: each contains 43 minutes of teaching and 2 minutes for questions. Context is the scientific explanation behind a slide, not text to crowd onto it. The suggested static content and illustration notes are separate proposals for later visual work.', '',
    '[Open the review](http://localhost:5174/review.html) · [Existing lecture](http://localhost:5174/#1) · [Research decisions](RESEARCH_NOTES.md) · [Energy accounting](ENERGY_ACCOUNTING.md)', '',
    '## Proposed sequence and time', '', '| Lecture | Slot | Minutes | Topic |', '|---|---|---:|---|'
]
for lecture in ['light','carbon']:
    start=0
    for d in drafts:
        if d['lecture'] != lecture: continue
        end=start+d['minutes']
        lines.append(f"| {lecture.capitalize()} | {start}–{end} | {d['minutes']} | [{d['id']} {d['title']}](#{d['id'].lower()}) |")
        start=end
    lines.append(f'| {lecture.capitalize()} | 43–45 | 2 | Questions and connection |')
lines += ['', 'CAM occupies a provisional two-minute slot. If omitted, give those two minutes to the C₂–C₄ comparison and discussion; the lecture still totals 45 minutes.', '']
for d in drafts:
    lines += [f"<a id=\"{d['id'].lower()}\"></a>", f"## {d['id']} {d['title']}", '', f"**{d['minutes']} minutes · New proposals NOT YET APPROVED**", '', f"**Key message:** {d['takeaway']}", '', f"**Connection from the preceding slide:** {d['bridgeIn']}", '']
    if d.get('approvedContext'):
        a=d['approvedContext']
        lines += ['### Agreed context unchanged', '', f"Source: `{a['source']}`. Previously approved on 22 October 2026.", '']
        for sec in a['context']['sections']:
            lines += [f"#### {sec['heading']}", ''] + [p+'\n' for p in sec['paragraphs']]
        lines += ['Existing context references:'] + [f"- [{r['title']}]({r['url']}) — {r['citation']}" for r in a['context']['references']] + ['']
    else:
        lines += ['### Draft lecture context', '']
    for sec in d['context']:
        lines += [f"#### {sec['heading']}", ''] + [p+'\n' for p in sec['paragraphs']]
        if sec.get('refs'): lines += [citations(sec['refs']), '']
    lines += ['### Proposed static study content', ''] + ['- '+s for s in d['study']] + ['']
    h=d['history']
    lines += ['### Historical connection', '', f"**{h['title']}** — {h['body']}", '', f"Use: {h['priority']}. Spoken allowance: {h['seconds']} seconds, included in the slide time.", '', citations(h.get('refs',[])), '']
    lines += ['### Recent evidence and interpretation', '']
    for e in d['evidence']:
        lines += [e['point'], '', f"Scope: {e['scope']} {citations(e['refs'])}", '']
    v=d['illustration']
    lines += ['### Illustration proposal', '', '**Static:** '+v['static'], '', '**Animation:** '+v['animation'], '', f"Priority: {v['priority']}. Maximum planned playback: {v['seconds']} seconds within the slide time.", '']
    if d['optional']:
        lines += ['### Keep in reserve', ''] + ['- '+p for p in d['optional']] + ['']
    lines += ['**Connection onward:** '+d['bridgeOut'], '', '**Sources:** '+citations(d['sources']), '']
lines += ['## Source register', '', 'The evidence basis is recorded below. An abstract or selected sections do not imply a full-paper appraisal. Existing Zotero keys describe previously saved records. New Zotero saves are pending because collection-item reads timed out before duplicate/PDF verification; the selected papers are recorded in ZOTERO_QUEUE.json.', '']
for s in sources:
    lines += [f"### {s['id']}", '', f"[{s['title']}]({s['url']}) — {s['authors']} ({s['year']}). {s.get('journal','')}", '', f"Use: {s['use']}", '', f"Evidence read: {s['basis']}", '']
(HERE / 'CONTEXT_REVIEW.md').write_text('\n'.join(lines))
print(f"Exported {len(drafts)} review entries, {len(drafts)-len(approved)} new contexts, {len(sources)} sources. Both lectures: 43 + 2 = 45 minutes.")
