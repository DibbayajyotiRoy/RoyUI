import { DocsSidebar } from '../../../components/DocsSidebar';

/* Route-level loading UI. Next.js renders this instantly (via Suspense) the
   moment a component link is clicked, so navigation feels immediate: the
   sidebar stays solid with the clicked item highlighted, and the main column
   shows a skeleton that matches the real detail layout — no flash of blank
   page, no layout shift when the content swaps in. */
export default function ComponentLoading() {
  return (
    <div className="detail">
      <DocsSidebar />

      <main
        className="detail__main detail-skeleton"
        aria-busy="true"
        aria-label="Loading component"
      >
        <div className="sk-breadcrumb" aria-hidden="true">
          <span className="sk" style={{ width: 84 }} />
          <span className="sk" style={{ width: 52 }} />
          <span className="sk" style={{ width: 68 }} />
        </div>

        <header className="detail__hero" aria-hidden="true">
          <div className="detail__hero-meta">
            <span className="sk sk-tag" />
          </div>
          <div className="sk sk-title" />
          <div className="sk sk-line" style={{ width: '58%', height: 18 }} />
          <div className="sk-desc">
            <div className="sk sk-line" style={{ width: '100%' }} />
            <div className="sk sk-line" style={{ width: '94%' }} />
            <div className="sk sk-line" style={{ width: '66%' }} />
          </div>
        </header>

        <div className="detail__preview" aria-hidden="true">
          <span className="sk-spinner" role="status" aria-label="Loading preview">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray="44"
                strokeDashoffset="14"
              />
            </svg>
          </span>
        </div>

        <div className="sk-section" aria-hidden="true">
          <div className="sk sk-line" style={{ width: 140, height: 20 }} />
          <div className="sk sk-block" />
        </div>
        <div className="sk-section" aria-hidden="true">
          <div className="sk sk-line" style={{ width: 110, height: 20 }} />
          <div className="sk sk-block" style={{ height: 132 }} />
        </div>
      </main>
    </div>
  );
}
