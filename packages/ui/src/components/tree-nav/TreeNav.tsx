'use client';

import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';
import './TreeNav.css';

export interface TreeNavProps extends HTMLAttributes<HTMLUListElement> {
  /** Left indent of the branched group, in pixels. Default 24. */
  indent?: number;
  /** Vertical gap between items, in pixels. Default 2. */
  gap?: number;
}

export const TreeNav = forwardRef<HTMLUListElement, TreeNavProps>(
  ({ indent = 24, gap = 2, className = '', style, children, ...rest }, ref) => {
    const mergedStyle: CSSProperties = {
      ...style,
      ['--royui-treenav-indent' as string]: `${indent}px`,
      ['--royui-treenav-gap' as string]: `${gap}px`,
    };

    const classes = ['royui-treenav', className].filter(Boolean).join(' ');

    return (
      <ul ref={ref} className={classes} style={mergedStyle} {...rest}>
        {children}
      </ul>
    );
  },
);

TreeNav.displayName = 'TreeNav';
