// New lecture proposals remain explicitly unreviewed until the lecturer approves them.
import rawReview from '../../research/review-2026-10-22/review-data.json?raw';
import { paper } from '../lib/canvas';
import type { ContextSection, ContextTopic } from '../lib/context';
import type { Slide } from '../slide';

interface Source {
  id: string;
  title: string;
  authors: string;
  year: number;
  journal?: string;
  url: string;
  use: string;
}

interface Draft {
  id: string;
  kind: 'approved-baseline' | 'draft';
  title: string;
  minutes: number;
  bridgeIn: string;
  takeaway: string;
  context: { heading: string; paragraphs: string[]; refs: string[] }[];
  study: string[];
  history: { title: string; body: string; seconds: number; priority: string; refs: string[] };
  evidence: { point: string; scope: string; refs: string[] }[];
  illustration: { static: string; animation: string; seconds: number; priority: string };
  optional: string[];
  bridgeOut: string;
  sources: string[];
}

const data = JSON.parse(rawReview) as { drafts: Draft[]; sources: Source[] };
const sources = new Map(data.sources.map(source => [source.id, source]));
const escape = (value: string): string => value.replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[c]!);

function sourceFor(id: string): Source {
  const source = sources.get(id);
  if (!source) throw new Error(`Missing draft reference: ${id}`);
  return source;
}

function contextFor(draft: Draft): ContextTopic {
  const urls = (ids: string[]): string[] => ids.map(id => sourceFor(id).url);
  const referenceIds = new Set([
    ...draft.sources,
    ...draft.context.flatMap(section => section.refs),
    ...draft.history.refs,
    ...draft.evidence.flatMap(item => item.refs),
  ]);
  const sections: ContextSection[] = [
    {
      heading: 'UNREVIEWED',
      paragraphs: ['New draft for discussion. The context, display prompt and animation ideas have not yet been approved.'],
    },
    { heading: 'Connection from the previous slide', paragraphs: [draft.bridgeIn] },
    ...draft.context.map(section => ({
      heading: section.heading,
      paragraphs: section.paragraphs,
      referenceUrls: urls(section.refs),
    })),
    { heading: 'Key message', paragraphs: [draft.takeaway] },
    { heading: 'Essential study points', paragraphs: draft.study },
    {
      heading: draft.history.title,
      paragraphs: [draft.history.body, `Story timing: ${draft.history.seconds} seconds. ${draft.history.priority}.`],
      referenceUrls: urls(draft.history.refs),
    },
    ...draft.evidence.map(item => ({
      heading: 'Research context',
      paragraphs: [item.point, item.scope],
      referenceUrls: urls(item.refs),
    })),
    { heading: 'Static display proposal', paragraphs: [draft.illustration.static] },
    {
      heading: 'Animation proposal',
      paragraphs: [
        draft.illustration.animation,
        `Suggested duration: ${draft.illustration.seconds} seconds. ${draft.illustration.priority}.`,
      ],
    },
    ...(draft.optional.length ? [{ heading: 'Optional detail', paragraphs: draft.optional }] : []),
    { heading: 'Connection to the next slide', paragraphs: [draft.bridgeOut] },
  ];
  return {
    title: draft.title,
    sections,
    references: [...referenceIds].map(id => {
      const source = sourceFor(id);
      return {
        label: id,
        citation: `${source.authors} (${source.year})${source.journal ? ` · ${source.journal}` : ''}`,
        title: source.title,
        url: source.url,
        note: source.use,
      };
    }),
  };
}

// Approved opening slides use their original modules and contexts, never these proposals.
export const researchDraftSlides: Slide[] = data.drafts
  .filter(draft => draft.kind === 'draft')
  .map(draft => ({
    title: draft.title,
    kind: 'canvas',
    minutes: draft.minutes,
    reviewStatus: 'unreviewed',
    context: [contextFor(draft)],
    drawStatic: c => paper(c),
    overlay: () => `
      <h2 class="h2" style="left:92px;top:50px;width:1412px">${escape(draft.title)}</h2>
      <article class="brief-stack research-brief hit" aria-label="Unreviewed slide brief" data-draft-id="${escape(draft.id)}">
        <section class="brief-box">
          <h3>Content</h3>
          <p><strong>${escape(draft.takeaway)}</strong></p>
        </section>
        <section class="brief-box">
          <h3>Display prompt</h3>
          <p>${escape(draft.illustration.static)}</p>
          ${draft.illustration.seconds > 0 ? `<p><strong>Animation proposal:</strong> ${escape(draft.illustration.animation)}</p>` : ''}
        </section>
      </article>`,
  }));
