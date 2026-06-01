export type ComponentStatus = 'available' | 'coming-soon';

export type ComponentEntry = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Inputs' | 'Display' | 'Overlay' | 'Feedback';
  tags: string[];
  status: ComponentStatus;
  featured?: boolean;
  importStatement?: string;
};

export const components: ComponentEntry[] = [
  {
    slug: 'gradient-button',
    name: 'GradientButton',
    tagline: 'Animated gradient CTA with built-in loading state.',
    description:
      'A drop-in call-to-action button with an animated blue → cyan → blue gradient, multi-layer glow shadow, accessible focus ring, and a built-in loading spinner. Forwards refs and spreads every native button attribute.',
    category: 'Inputs',
    tags: ['button', 'cta', 'form', 'gradient'],
    status: 'available',
    featured: true,
    importStatement: `import { GradientButton } from '@roy-ui/ui';`,
  },
  {
    slug: 'button',
    name: 'Button',
    tagline: 'Solid button with depth you feel more than see.',
    description:
      'A foundational button that looks flat but is not — a vertical gradient catches light on the top edge, a hairline ring keeps it crisp on any background, and twin inner shadows give it form. Press it and the highlight collapses into the face, so it dips in like a real key. Three sizes, full-width, and a built-in loading spinner. Forwards refs and spreads every native button attribute.',
    category: 'Inputs',
    tags: ['button', 'cta', 'form', 'depth'],
    status: 'available',
    importStatement: `import { Button } from '@roy-ui/ui';`,
  },
  {
    slug: 'popover',
    name: 'Popover',
    tagline: 'Click-toggled info panel with animated tail and dismiss handling.',
    description:
      'A click-toggled anchored panel with an animated entrance, pointer tail, and built-in dismiss handling (outside-click, Escape, re-click). Comes with a default info trigger but accepts any custom trigger via renderTrigger — bell icons, avatars, menu buttons.',
    category: 'Overlay',
    tags: ['popover', 'overlay', 'tooltip', 'info'],
    status: 'available',
    featured: true,
    importStatement: `import { Popover } from '@roy-ui/ui';`,
  },
  {
    slug: 'made-by',
    name: 'MadeBy',
    tagline: 'Floating credit badge with author name and portfolio link.',
    description:
      'A fixed-position pill that floats in any corner of the viewport. Shows a "Made by" prefix and a clickable author name linked to a portfolio or social URL. Italic name by default, but the font and style are fully configurable per author.',
    category: 'Display',
    tags: ['badge', 'credit', 'attribution', 'floating', 'pill'],
    status: 'available',
    featured: true,
    importStatement: `import { MadeBy } from '@roy-ui/ui';`,
  },
  {
    slug: 'text-morph',
    name: 'TextMorph',
    tagline: 'Text that diff-types between values with human-feeling jitter.',
    description:
      'A primitive for any text that swaps from one value to another. Computes the minimal diff, backspaces the differing middle, pauses for a beat, then types in the new middle — with per-character jitter (and extra delay on harder-to-reach chars). Interruptible mid-animation, reduced-motion safe, and accepts a custom renderer for syntax tinting or word-by-word styling.',
    category: 'Display',
    tags: ['text', 'animation', 'typing', 'transition', 'morph'],
    status: 'available',
    featured: true,
    importStatement: `import { TextMorph } from '@roy-ui/ui';`,
  },
  {
    slug: 'tree-nav',
    name: 'TreeNav',
    tagline: 'Sidebar sub-nav with file-explorer L-branch connectors.',
    description:
      'A two-piece nav (TreeNav container + TreeNavItem rows) that draws the L-shaped branch and triangle tip familiar from file explorers. Router-agnostic via asChild, active state driven by aria-current, and every visual surface — branch color, thickness, indent, hover lift — wired to CSS variables.',
    category: 'Display',
    tags: ['nav', 'sidebar', 'tree', 'menu', 'navigation'],
    status: 'available',
    importStatement: `import { TreeNav, TreeNavItem } from '@roy-ui/ui';`,
  },
  {
    slug: 'data-table',
    name: 'DataTable',
    tagline: 'A generic, fully-featured data table — search, range, time, sort, paginate, reorder, resize, hide, import, export.',
    description:
      'A single typed component that wires together search, a multi-month date-range modal, an analog or digital time picker, column reorder via drag, edge-drag resize, hide / restore through a Columns menu, text-only pagination with page numbers, per-zone fonts for headers, row-headers and cells, and one-click CSV / JSON export and import. Built on standalone primitives — Table, TableSearch, DateRangePicker, TimePicker, Pagination — that ship alongside it for use independently.',
    category: 'Display',
    tags: ['table', 'data', 'grid', 'sort', 'filter', 'paginate', 'export'],
    status: 'available',
    importStatement: `import { DataTable } from '@roy-ui/ui';`,
  },
  {
    slug: 'input',
    name: 'Input',
    tagline: 'Accessible text input with built-in label and helper text.',
    description: 'Coming soon.',
    category: 'Inputs',
    tags: ['form', 'text', 'input'],
    status: 'coming-soon',
  },
  {
    slug: 'card',
    name: 'Card',
    tagline: 'Listing card with a swipeable, dot-paginated gallery.',
    description:
      'A listing card: a gallery up top that you swipe or drag through, with pagination dots that stretch into a pill on the active slide and a long, eased slide between photos. Below it, a price line, address, hairline-divided stats, attribution footer, and a full-width action built on the Button. The gallery ships as a standalone ImageCarousel primitive too. Every surface is a CSS variable, dark theme included.',
    category: 'Display',
    tags: ['card', 'gallery', 'carousel', 'listing', 'swipe', 'container'],
    status: 'available',
    importStatement: `import { Card } from '@roy-ui/ui';`,
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    tagline: 'Accessible modal built on Radix primitives.',
    description: 'Coming soon.',
    category: 'Overlay',
    tags: ['modal', 'overlay', 'radix'],
    status: 'coming-soon',
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    tagline: 'Keyboard-navigable tab navigation.',
    description: 'Coming soon.',
    category: 'Display',
    tags: ['navigation', 'radix'],
    status: 'coming-soon',
  },
  {
    slug: 'badge',
    name: 'Badge',
    tagline: 'Small status pill in five variants.',
    description: 'Coming soon.',
    category: 'Display',
    tags: ['label', 'status'],
    status: 'coming-soon',
  },
  {
    slug: 'toast',
    name: 'Toast',
    tagline: 'Stacked notifications with auto-dismiss.',
    description: 'Coming soon.',
    category: 'Feedback',
    tags: ['notification', 'feedback'],
    status: 'coming-soon',
  },
  {
    slug: 'switch',
    name: 'Switch',
    tagline: 'Binary toggle with animated thumb.',
    description: 'Coming soon.',
    category: 'Inputs',
    tags: ['form', 'toggle'],
    status: 'coming-soon',
  },
];

export const categories = ['All', 'Inputs', 'Display', 'Overlay', 'Feedback'] as const;
export type Category = (typeof categories)[number];

export function getComponent(slug: string) {
  return components.find((c) => c.slug === slug);
}

export function getAvailable() {
  return components.filter((c) => c.status === 'available');
}

export function getFeatured() {
  return components.filter((c) => c.featured);
}
