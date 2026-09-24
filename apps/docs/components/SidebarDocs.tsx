import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';
import { SidebarDemo, SidebarControlledDemo } from './demos/SidebarDemo';

export function SidebarDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. An app-shell sidebar with grouped navigation, one gliding active fill, and a collapsible icon rail. Zero dependencies; it ships its own CSS."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { Sidebar } from '@roy-ui/ui';

// or just this component:
import { Sidebar } from '@roy-ui/ui/sidebar';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Pass sections of items and the current activeId. Selecting an item glides a single shared fill to it; the group holding the active item gets a stronger heading. Items with href render as anchors — or as your router's Link via renderLink."
      >
        <Example
          title="Grouped navigation"
          description="Click items to watch the fill glide between groups. Badges sit on the right and shrink to a dot on the icon when collapsed."
          code={`const sections = [
  {
    label: 'Workspace',
    items: [
      { id: 'home', label: 'Home', icon: <HomeIcon /> },
      { id: 'inbox', label: 'Inbox', icon: <InboxIcon />, badge: 12 },
      { id: 'analytics', label: 'Analytics', icon: <ChartIcon /> },
    ],
  },
  { label: 'Team', items: [/* … */] },
];

const [active, setActive] = useState('inbox');

<Sidebar
  sections={sections}
  activeId={active}
  onSelect={(id) => setActive(id)}
  header={<Logo />}
  footer={<UserMenu />}
/>`}
        >
          <SidebarDemo />
        </Example>

        <Code
          label="Router links — spread renderLink props onto your Link"
          code={`import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pathname = usePathname();

<Sidebar
  sections={sections}           // items carry href
  activeId={idFromPath(pathname)}
  renderLink={(props) => <Link {...props} />}
/>`}
        />
      </DocSection>

      <DocSection
        id="collapsed"
        eyebrow="03"
        title="Collapsed rail"
        description="Collapsed, the sidebar animates down to a 56px icon rail: labels fade, group headings become hairlines, badges become dots, and each item shows a tooltip on hover or keyboard focus. The built-in header toggle handles it uncontrolled (defaultCollapsed), or drive it yourself with collapsed + onCollapsedChange."
      >
        <Example
          title="Controlled collapse"
          description="Toggle from outside; the fill snaps to its new geometry and follows the width transition."
          code={`const [collapsed, setCollapsed] = useState(true);

<Sidebar
  sections={sections}
  activeId={active}
  onSelect={setActive}
  collapsed={collapsed}
  onCollapsedChange={setCollapsed}
/>`}
        >
          <SidebarControlledDemo />
        </Example>
      </DocSection>

      <DocSection
        id="theming"
        eyebrow="04"
        title="Theming"
        description="theme='auto' follows prefers-color-scheme; force 'light' or 'dark' to match your app. Every color, size and timing is a CSS variable. Reduced-motion users get instant state changes with no transitions."
      >
        <Code
          label="CSS variables"
          code={`.royui-sidebar {
  --royui-sidebar-w: 248px;
  --royui-sidebar-w-collapsed: 56px;
  --royui-sidebar-bg: #fbfbfc;
  --royui-sidebar-fg: #18181b;
  --royui-sidebar-muted: rgba(24, 24, 27, 0.6);
  --royui-sidebar-active: #ffffff;
  --royui-sidebar-dot: #3b82f6;
  --royui-sidebar-ring: rgba(59, 130, 246, 0.55);
  --royui-sidebar-duration: 260ms;
}`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="05"
        title="Props"
        description="Other attributes (className, style, data-*, handlers) are spread onto the outer <aside>."
      >
        <PropsTable
          rows={[
            { name: 'sections', type: 'SidebarSection[]', def: '—', desc: '{ label?, items: { id, label, icon?, href?, badge?, disabled? }[] }[]. Required.' },
            { name: 'activeId', type: 'string', def: '—', desc: 'id of the current item; gets aria-current="page" and the shared fill.' },
            { name: 'onSelect', type: '(id, item) => void', def: '—', desc: 'Called when an enabled item is clicked.' },
            { name: 'collapsed', type: 'boolean', def: '—', desc: 'Controlled collapsed state.' },
            { name: 'defaultCollapsed', type: 'boolean', def: 'false', desc: 'Initial collapsed state when uncontrolled.' },
            { name: 'onCollapsedChange', type: '(collapsed: boolean) => void', def: '—', desc: 'Called by the built-in toggle.' },
            { name: 'collapsible', type: 'boolean', def: 'true', desc: 'Show the collapse toggle in the header.' },
            { name: 'header', type: 'ReactNode', def: '—', desc: 'Top slot (logo, workspace switcher). Hidden when collapsed.' },
            { name: 'footer', type: 'ReactNode', def: '—', desc: 'Bottom slot (user, settings).' },
            { name: 'renderLink', type: '(props: SidebarLinkProps, item) => ReactNode', def: '—', desc: 'Render router links for items with href.' },
            { name: 'navLabel', type: 'string', def: `'Main'`, desc: 'aria-label of the nav landmark.' },
            { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Color scheme.' },
          ]}
        />
      </DocSection>
    </>
  );
}
