'use client';

import { useState, type CSSProperties, type MouseEvent } from 'react';
import { TreeNav, TreeNavItem } from '@roy-ui/ui';

const card: CSSProperties = {
  background: '#fafafa',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 10,
  padding: 12,
  width: 260,
};

const tokens = {
  ['--royui-treenav-branch']: 'rgba(0,0,0,0.2)',
  ['--royui-treenav-branch-active']: 'rgba(0,0,0,0.55)',
  ['--royui-treenav-label']: 'rgba(0,0,0,0.55)',
  ['--royui-treenav-label-hover']: 'rgba(0,0,0,0.92)',
  ['--royui-treenav-label-active']: '#0a0a0a',
  ['--royui-treenav-hover-bg']: 'rgba(0,0,0,0.04)',
  ['--royui-treenav-active-bg']: 'rgba(0,0,0,0.06)',
} as CSSProperties;

const noNav = (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault();

type Parent = {
  id: string;
  label: string;
  children: { label: string; id: string }[];
};

const groups: Parent[] = [
  {
    id: 'library',
    label: 'Library',
    children: [
      { id: 'library-articles', label: 'Articles' },
      { id: 'library-guides', label: 'Guides' },
      { id: 'library-changelog', label: 'Changelog' },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    children: [
      { id: 'workspace-boards', label: 'Boards' },
      { id: 'workspace-members', label: 'Members' },
      { id: 'workspace-activity', label: 'Activity' },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    children: [
      { id: 'account-profile', label: 'Profile' },
      { id: 'account-sessions', label: 'Sessions' },
    ],
  },
];

export function TreeNavThreeParentsDemo() {
  const [open, setOpen] = useState<Record<string, boolean>>({
    library: true,
    workspace: true,
    account: true,
  });
  const [activeId, setActiveId] = useState<string>('library-guides');

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={card}>
      {groups.map((group) => {
        const isOpen = open[group.id] ?? true;
        return (
          <div key={group.id} className="royui-treenav-demo-group">
            <button
              type="button"
              onClick={() => toggle(group.id)}
              aria-expanded={isOpen}
              className={`royui-treenav-demo-parent${
                isOpen ? ' royui-treenav-demo-parent--open' : ''
              }`}
            >
              {group.label}
            </button>
            <div
              className={`royui-treenav-demo-panel${
                isOpen ? ' royui-treenav-demo-panel--open' : ''
              }`}
            >
              <TreeNav style={tokens}>
                {group.children.map((child) => (
                  <TreeNavItem
                    key={child.id}
                    href="#"
                    active={activeId === child.id}
                    linkProps={{
                      onClick: (e) => {
                        noNav(e);
                        setActiveId(child.id);
                      },
                    }}
                  >
                    {child.label}
                  </TreeNavItem>
                ))}
              </TreeNav>
            </div>
          </div>
        );
      })}
    </div>
  );
}
