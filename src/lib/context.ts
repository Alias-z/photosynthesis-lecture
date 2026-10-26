export interface ContextReference {
  label: string;
  citation: string;
  title: string;
  url: string;
  note: string;
}

export interface ContextSection {
  heading: string;
  paragraphs: string[];
  steps?: string[];
  referenceUrls?: string[];
}

export interface ContextTopic {
  title: string;
  sections: ContextSection[];
  references: ContextReference[];
}

const escape = (value: string): string => value.replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[c]!);

/** Explanations and their sources share one panel and one durable data source. */
export function renderContext(topics: ContextTopic[]): string {
  return topics.map(topic => `
    <article class="context-topic">
      <h3>${escape(topic.title)}</h3>
      ${topic.sections.map(section => `
        <section class="context-section">
          <h4>${escape(section.heading)}</h4>
          ${section.paragraphs.map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}
          ${section.steps ? `<ol>${section.steps.map(step => `<li>${escape(step)}</li>`).join('')}</ol>` : ''}
          ${section.referenceUrls?.length ? `<p class="context-citations">${section.referenceUrls.map(url => {
            const ref = topic.references.find(reference => reference.url === url);
            return ref ? `<a href="${escape(ref.url)}" target="_blank" rel="noopener noreferrer">${escape(ref.citation)}</a>` : '';
          }).join(' · ')}</p>` : ''}
        </section>`).join('')}
      <section class="context-papers" aria-label="Papers for ${escape(topic.title)}">
        <h4>Papers</h4>
        ${topic.references.map(ref => `
          <div class="context-paper">
            <a href="${escape(ref.url)}" target="_blank" rel="noopener noreferrer">${escape(ref.title)}</a>
            <p>${escape(ref.citation)}</p>
            <p>${escape(ref.note)}</p>
          </div>`).join('')}
      </section>
    </article>`).join('');
}
