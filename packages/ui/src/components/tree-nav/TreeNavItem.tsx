'use client';

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type LiHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

export interface TreeNavItemProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children'> {
  /** Link target. Used when asChild is false (default <a> render). */
  href?: string;
  /** Mark this item active. Adds aria-current="page" to the rendered link. */
  active?: boolean;
  /** Render the consumer's element (e.g. next/link, TanStack Link) instead of an <a>. */
  asChild?: boolean;
  /** Hide the triangle tip at the end of the branch. Default false (tip shown). */
  hideTip?: boolean;
  /** Leading icon slot. */
  icon?: ReactNode;
  /** Anchor / link contents. */
  children?: ReactNode;
  /** Forwarded to the inner link element (className, onClick, etc.). */
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>;
}

type ChildLinkElement = ReactElement<{
  className?: string;
  'aria-current'?: AnchorHTMLAttributes<HTMLAnchorElement>['aria-current'];
  children?: ReactNode;
}>;

export const TreeNavItem = forwardRef<HTMLLIElement, TreeNavItemProps>(
  (
    {
      href,
      active = false,
      asChild = false,
      hideTip = false,
      icon,
      children,
      linkProps,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const itemClasses = [
      'royui-treenav__item',
      hideTip && 'royui-treenav__item--no-tip',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const linkContent = (
      <>
        {icon && (
          <span className="royui-treenav__icon" aria-hidden>
            {icon}
          </span>
        )}
        <span className="royui-treenav__label">{children}</span>
      </>
    );

    let renderedLink: ReactNode;

    if (asChild) {
      const onlyChild = Children.only(children) as ChildLinkElement;
      if (!isValidElement(onlyChild)) {
        throw new Error(
          'TreeNavItem: asChild requires a single React element child.',
        );
      }
      const childClassName = [
        'royui-treenav__link',
        onlyChild.props.className,
      ]
        .filter(Boolean)
        .join(' ');

      renderedLink = cloneElement(onlyChild, {
        className: childClassName,
        ...(active ? { 'aria-current': 'page' as const } : {}),
      });
    } else {
      const { className: linkClassName, ...linkRest } = linkProps ?? {};
      const mergedLinkClass = ['royui-treenav__link', linkClassName]
        .filter(Boolean)
        .join(' ');

      renderedLink = (
        <a
          href={href}
          className={mergedLinkClass}
          {...(active ? { 'aria-current': 'page' as const } : {})}
          {...linkRest}
        >
          {linkContent}
        </a>
      );
    }

    return (
      <li ref={ref} className={itemClasses} {...rest}>
        <svg
          className="royui-treenav__connector"
          viewBox="0 0 20 30"
          preserveAspectRatio="xMinYMid meet"
          aria-hidden
        >
          {hideTip ? (
            <path
              d="M1.25 0 L1.25 7 Q1.25 15.75 11 15.75 L11 14.25 Q2.75 14.25 2.75 7 L2.75 0 Z"
              fill="currentColor"
            />
          ) : (
            <path
              d="M1.25 0 L1.25 7 Q1.25 15.75 10.33 15.75 L10.33 16.94 L14.22 15 L10.33 13.06 L10.33 14.25 Q2.75 14.25 2.75 7 L2.75 0 Z"
              fill="currentColor"
            />
          )}
        </svg>
        {renderedLink}
      </li>
    );
  },
);

TreeNavItem.displayName = 'TreeNavItem';
