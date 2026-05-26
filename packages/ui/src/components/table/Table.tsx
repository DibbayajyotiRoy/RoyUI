'use client';

import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type TableHTMLAttributes,
} from 'react';
import { Spinner } from './Spinner';
import './Table.css';

export type TableDensity = 'compact' | 'cozy' | 'comfortable';

export type FontSpec =
  | string
  | {
      family?: string;
      size?: string | number;
      weight?: number | string;
      letterSpacing?: string;
      featureSettings?: string;
    };

export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Rows visible before vertical scroll. Default 7. */
  visibleRows?: number;
  /** Approximate row height in px — drives the scroll cap. Default 44. */
  rowHeight?: number;
  /** Header sticks during scroll. Default true. */
  stickyHeader?: boolean;
  /** Padding scale. Default 'cozy'. */
  density?: TableDensity;
  /** Renders an inline spinner overlay on top of rows. */
  loading?: boolean;
  /** Replaces row area when no rows are present. */
  empty?: ReactNode;
  /**
   * Force every column to fit in the container — disables horizontal scroll
   * and lets the browser distribute width across all visible columns.
   * Cell content wraps onto multiple lines instead of clipping.
   */
  fitColumns?: boolean;
  /** Per-zone fonts. */
  headerFont?: FontSpec;
  rowHeaderFont?: FontSpec;
  cellFont?: FontSpec;
  children?: ReactNode;
  tableProps?: TableHTMLAttributes<HTMLTableElement>;
  /** Show the empty slot. Set explicitly by DataTable; defaults to false. */
  isEmpty?: boolean;
}

function fontVars(prefix: string, spec: FontSpec | undefined): CSSProperties {
  if (!spec) return {};
  const out: Record<string, string> = {};
  if (typeof spec === 'string') {
    out[`${prefix}-font`] = spec;
    return out as CSSProperties;
  }
  if (spec.family) out[`${prefix}-font`] = spec.family;
  if (spec.size != null)
    out[`${prefix}-size`] = typeof spec.size === 'number' ? `${spec.size}px` : spec.size;
  if (spec.weight != null) out[`${prefix}-weight`] = String(spec.weight);
  if (spec.letterSpacing) out[`${prefix}-tracking`] = spec.letterSpacing;
  if (spec.featureSettings) out[`${prefix}-features`] = spec.featureSettings;
  return out as CSSProperties;
}

export const Table = forwardRef<HTMLDivElement, TableProps>(function Table(
  {
    visibleRows = 7,
    rowHeight = 44,
    stickyHeader = true,
    density = 'cozy',
    loading = false,
    empty,
    isEmpty = false,
    fitColumns = false,
    headerFont,
    rowHeaderFont,
    cellFont,
    className = '',
    style,
    children,
    tableProps,
    ...rest
  },
  ref,
) {
  const headerH = 40;
  const maxH = rowHeight * visibleRows + (stickyHeader ? headerH : 0);

  const mergedStyle: CSSProperties = {
    ...style,
    ['--royui-table-row-h' as string]: `${rowHeight}px`,
    ['--royui-table-max-h' as string]: `${maxH}px`,
    ...fontVars('--royui-table-header', headerFont),
    ...fontVars('--royui-table-row-header', rowHeaderFont),
    ...fontVars('--royui-table-cell', cellFont),
  };

  const classes = [
    'royui-table',
    `royui-table--${density}`,
    stickyHeader && 'royui-table--sticky',
    loading && 'royui-table--loading',
    fitColumns && 'royui-table--fit',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classes} style={mergedStyle} {...rest}>
      <div className="royui-table__scroll" role="region" aria-label="Table">
        <table className="royui-table__table" {...tableProps}>
          {children}
        </table>
        {isEmpty && !loading && (
          <div className="royui-table__empty" role="status">
            {empty ?? <span>No results</span>}
          </div>
        )}
        {loading && (
          <div className="royui-table__loading" aria-hidden>
            <Spinner size={18} />
          </div>
        )}
      </div>
    </div>
  );
});
