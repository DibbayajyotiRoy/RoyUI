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
    importStatement: `import { GradientButton } from '@royui/ui';`,
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
    importStatement: `import { Popover } from '@royui/ui';`,
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
    importStatement: `import { MadeBy } from '@royui/ui';`,
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
    tagline: 'Composable container with header, body, and footer slots.',
    description: 'Coming soon.',
    category: 'Display',
    tags: ['container', 'layout'],
    status: 'coming-soon',
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
