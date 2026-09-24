'use client';

import {
  forwardRef,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useSlidingIndicator } from '../_internal/sliding-indicator';
import './Sidebar.css';

export interface SidebarItem {
  id: string;
  label: string;
  /** Leading icon, sized to 18px. Shown alone in the collapsed rail. */
  icon?: ReactNode;
  /** Renders an anchor (or your router link via renderLink). Without it the item is a button. */
  href?: string;
  /** Trailing count/label. Collapses to a dot on the icon. */
  badge?: ReactNode;
  disabled?: boolean;
}

export interface SidebarSection {
  /** Group heading. Becomes a hairline when collapsed. */
  label?: string;
  items: SidebarItem[];
}

/** Props handed to `renderLink` — spread them onto your router's Link. */
export interface SidebarLinkProps {
  href: string;
  className: string;
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLElement>) => void;
  'aria-current': 'page' | undefined;
  'aria-label': string | undefined;
  'data-royui-item': '';
  'data-tooltip': string | undefined;
}

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  sections: SidebarSection[];
  /** id of the current item. */
  activeId?: string;
  onSelect?: (id: string, item: SidebarItem) => void;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Initial collapsed state when uncontrolled. Defaults to false. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Show the built-in collapse toggle in the header. Defaults to true. */
  collapsible?: boolean;
  /** Top slot (logo, workspace switcher). */
  header?: ReactNode;
  /** Bottom slot (user, settings). */
  footer?: ReactNode;
  /** Render router links (Next Link, etc.) for items with href. */
  renderLink?: (props: SidebarLinkProps, item: SidebarItem) => ReactNode;
  /** aria-label of the nav landmark. Defaults to "Main". */
  navLabel?: string;
  /** Defaults to "auto" (follows prefers-color-scheme). */
  theme?: 'light' | 'dark' | 'auto';
}

const ToggleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M9 4v16" />
  </svg>
);

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    sections,
    activeId,
    onSelect,
    collapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    collapsible = true,
    header,
    footer,
    renderLink,
    navLabel = 'Main',
    theme = 'auto',
    className = '',
    ...rest
  },
  ref,
) {
  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsed !== undefined ? collapsed : innerCollapsed;
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useSlidingIndicator(listRef, indicatorRef, '[aria-current="page"]', activeId, 'both', isCollapsed);

  const toggle = () => {
    const next = !isCollapsed;
    if (collapsed === undefined) setInnerCollapsed(next);
    onCollapsedChange?.(next);
  };

  const cls = [
    'royui-sidebar',
    `royui-sidebar--${theme}`,
    isCollapsed && 'royui-sidebar--collapsed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderItem = (item: SidebarItem) => {
    const active = item.id === activeId;
    const content = (
      <>
        <span className="royui-sidebar__icon" aria-hidden="true">
          {item.icon}
          {item.badge != null && <span className="royui-sidebar__dot" />}
        </span>
        <span className="royui-sidebar__label">{item.label}</span>
        {item.badge != null && <span className="royui-sidebar__badge">{item.badge}</span>}
      </>
    );
    const itemCls = 'royui-sidebar__item';
    const common = {
      className: itemCls,
      'aria-current': active ? ('page' as const) : undefined,
      'aria-label': isCollapsed ? item.label : undefined,
      'data-royui-item': '' as const,
      'data-tooltip': isCollapsed ? item.label : undefined,
    };
    const onClick = (e: MouseEvent<HTMLElement>) => {
      if (item.disabled) {
        e.preventDefault();
        return;
      }
      onSelect?.(item.id, item);
    };

    if (item.href && !item.disabled) {
      const linkProps: SidebarLinkProps = { ...common, href: item.href, onClick, children: content };
      if (renderLink) return <li key={item.id}>{renderLink(linkProps, item)}</li>;
      return (
        <li key={item.id}>
          <a {...linkProps} />
        </li>
      );
    }
    return (
      <li key={item.id}>
        <button type="button" {...common} disabled={item.disabled} onClick={onClick}>
          {content}
        </button>
      </li>
    );
  };

  return (
    <aside ref={ref} className={cls} data-collapsed={isCollapsed ? '' : undefined} {...rest}>
      {(header || collapsible) && (
        <div className="royui-sidebar__header">
          {header && <div className="royui-sidebar__brand">{header}</div>}
          {collapsible && (
            <button
              type="button"
              className="royui-sidebar__toggle"
              onClick={toggle}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!isCollapsed}
              data-tooltip={isCollapsed ? 'Expand' : undefined}
            >
              <ToggleIcon />
            </button>
          )}
        </div>
      )}
      <nav className="royui-sidebar__nav" aria-label={navLabel}>
        <div className="royui-sidebar__list" ref={listRef}>
          <span className="royui-sidebar__indicator" ref={indicatorRef} aria-hidden="true" />
          {sections.map((section, i) => {
            const hasActive = section.items.some((it) => it.id === activeId);
            return (
              <div
                key={section.label ?? i}
                className="royui-sidebar__group"
                data-active={hasActive ? '' : undefined}
              >
                {section.label && (
                  <div className="royui-sidebar__group-label">
                    <span>{section.label}</span>
                  </div>
                )}
                <ul className="royui-sidebar__items">{section.items.map(renderItem)}</ul>
              </div>
            );
          })}
        </div>
      </nav>
      {footer && <div className="royui-sidebar__footer">{footer}</div>}
    </aside>
  );
});
