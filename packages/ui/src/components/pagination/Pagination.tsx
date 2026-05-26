'use client';

import { useMemo, type CSSProperties } from 'react';
import './Pagination.css';

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown adjacent to the current page. Default 1. */
  siblingCount?: number;
  /** Show Prev / Next text buttons. Default true. */
  showPrevNext?: boolean;
  /** Override the Prev / Next labels. */
  prevLabel?: string;
  nextLabel?: string;
  /** Compact summary like "Page 3 of 12" on the left. Default false. */
  showSummary?: boolean;
  summaryRender?: (page: number, pageCount: number) => string;
  className?: string;
  style?: CSSProperties;
}

type Cell = number | 'gap';

function buildRange(page: number, pageCount: number, sibling: number): Cell[] {
  if (pageCount <= 1) return [1];
  const first = 1;
  const last = pageCount;
  const left = Math.max(page - sibling, first + 1);
  const right = Math.min(page + sibling, last - 1);

  const cells: Cell[] = [first];
  if (left > first + 1) cells.push('gap');
  for (let i = left; i <= right; i++) cells.push(i);
  if (right < last - 1) cells.push('gap');
  if (last > first) cells.push(last);
  return cells;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  showPrevNext = true,
  prevLabel = 'Prev',
  nextLabel = 'Next',
  showSummary = false,
  summaryRender,
  className = '',
  style,
}: PaginationProps) {
  const cells = useMemo(
    () => buildRange(page, pageCount, siblingCount),
    [page, pageCount, siblingCount],
  );

  const canPrev = page > 1;
  const canNext = page < pageCount;

  const go = (n: number) => {
    if (n < 1 || n > pageCount || n === page) return;
    onPageChange(n);
  };

  return (
    <nav
      className={['royui-pagination', className].filter(Boolean).join(' ')}
      style={style}
      aria-label="Pagination"
    >
      {showSummary && (
        <span className="royui-pagination__summary">
          {summaryRender
            ? summaryRender(page, pageCount)
            : `Page ${page} of ${pageCount}`}
        </span>
      )}

      <div className="royui-pagination__group">
        {showPrevNext && (
          <button
            type="button"
            className="royui-pagination__step"
            onClick={() => go(page - 1)}
            disabled={!canPrev}
            aria-label="Previous page"
          >
            {prevLabel}
          </button>
        )}

        <ul className="royui-pagination__pages">
          {cells.map((cell, i) =>
            cell === 'gap' ? (
              <li key={`gap-${i}`} className="royui-pagination__gap" aria-hidden>
                ·
              </li>
            ) : (
              <li key={cell}>
                <button
                  type="button"
                  className={[
                    'royui-pagination__page',
                    cell === page && 'royui-pagination__page--current',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => go(cell)}
                  aria-current={cell === page ? 'page' : undefined}
                  aria-label={`Page ${cell}`}
                >
                  {cell}
                </button>
              </li>
            ),
          )}
        </ul>

        {showPrevNext && (
          <button
            type="button"
            className="royui-pagination__step"
            onClick={() => go(page + 1)}
            disabled={!canNext}
            aria-label="Next page"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </nav>
  );
}
