interface Publication {
  year: number;
  title: string;
  authors: string;
  journal: string;
  arxiv: string | null;
  pdf: string | null;
}

function highlightAuthor(authors: string) {
  const parts = authors.split("Bertrand Deroin");
  if (parts.length === 1) return <span>{authors}</span>;
  return (
    <span>
      {parts[0]}
      <strong className="text-dark">Bertrand Deroin</strong>
      {parts[1]}
    </span>
  );
}

export default function PublicationCard({ pub }: { pub: Publication }) {
  return (
    <article className="py-5 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-base font-semibold leading-snug text-dark">
            {pub.title}
          </h3>
          <p className="mt-1 text-sm text-dark/60">{highlightAuthor(pub.authors)}</p>
          <p className="mt-0.5 text-sm italic text-dark/50">{pub.journal}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-dark/40 font-mono">{pub.year}</span>
          {pub.arxiv && (
            <a
              href={pub.arxiv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs border border-slate_blue/30 text-slate_blue rounded px-2 py-1 hover:bg-slate_blue/5 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
              </svg>
              arXiv
            </a>
          )}
          {pub.pdf && (
            <a
              href={pub.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs border border-slate_blue/30 text-slate_blue rounded px-2 py-1 hover:bg-slate_blue/5 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              PDF
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
