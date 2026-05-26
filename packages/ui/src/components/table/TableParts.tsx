'use client';

import {
  forwardRef,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from 'react';

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableHeader({ className = '', ...rest }, ref) {
  return (
    <thead
      ref={ref}
      className={['royui-table__thead', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className = '', ...rest }, ref) {
  return (
    <tbody
      ref={ref}
      className={['royui-table__tbody', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});

export const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(function TableRow({ className = '', ...rest }, ref) {
  return (
    <tr
      ref={ref}
      className={['royui-table__tr', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});

export interface TableHeadCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right' | 'center';
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadCellProps>(
  function TableHead({ className = '', align = 'left', ...rest }, ref) {
    return (
      <th
        ref={ref}
        scope="col"
        className={[
          'royui-table__th',
          align !== 'left' && `royui-table__th--${align}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
    );
  },
);

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right' | 'center';
  isRowHeader?: boolean;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ className = '', align = 'left', isRowHeader, ...rest }, ref) {
    if (isRowHeader) {
      return (
        <th
          ref={ref}
          scope="row"
          className={[
            'royui-table__row-header',
            align !== 'left' && `royui-table__td--${align}`,
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...(rest as ThHTMLAttributes<HTMLTableCellElement>)}
        />
      );
    }
    return (
      <td
        ref={ref}
        className={[
          'royui-table__td',
          align !== 'left' && `royui-table__td--${align}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
    );
  },
);
