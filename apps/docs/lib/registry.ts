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
    slug: 'upload-files',
    name: 'UploadFiles',
    tagline: 'Drag-and-drop uploader with morphing, shimmering progress.',
    description:
      'A controlled file uploader: a clean dashed dropzone (drag-drop + browse), per-file rows with type-colored badges, complete and uploading states, and a distinctive segmented progress bar. While a file is in flight, its status line morphs through a long, varied upload vocabulary under a Claude-style shimmer sweep — so the wait stays alive. Dark by default, light and auto themes, every surface a CSS variable.',
    category: 'Inputs',
    tags: ['upload', 'file', 'drag-drop', 'progress', 'dropzone', 'form'],
    status: 'available',
    importStatement: `import { UploadFiles } from '@roy-ui/ui';`,
  },
  {
    slug: 'input',
    name: 'Input',
    tagline: 'Baseline text field with a floating label and custom-CSS micro-motion.',
    description:
      'A "bottom line, no base" text field for any value — email, username, password, search. A label rests over the input and lifts up-and-left on focus, an underline draws in from the left, a leading icon tints and pops, and a faint placeholder hint only appears once the label has cleared. Built-in error, success, and async-loading states bring their own micro-motion — a one-time shake on error, a stroke-drawn check on success, a trailing spinner while a live check (like username availability) is in flight. Every surface is a CSS variable, it ships light / dark / auto themes, and every animation is custom CSS that respects prefers-reduced-motion. Forwards refs and spreads every native input attribute.',
    category: 'Inputs',
    tags: ['form', 'input', 'text', 'floating-label', 'email', 'username', 'animation'],
    status: 'available',
    importStatement: `import { Input } from '@roy-ui/ui';`,
  },
  {
    slug: 'form',
    name: 'Form',
    tagline: 'Schema-driven form with built-in validation, sections, and a headless core.',
    description:
      'A complete form from a fields config — text, number, textarea, select, checkbox, radio, and switch controls, built-in validation, titled sections, a responsive grid, an error summary, and submit states. Built on a headless external-store core, so typing in one field only re-renders that field; an optional resolver lets you swap the built-in rules for zod / yup later without touching the field config. RSC-safe and dependency-free.',
    category: 'Inputs',
    tags: ['form', 'schema', 'validation', 'fields', 'sections', 'submit'],
    status: 'available',
    importStatement: `import { Form } from '@roy-ui/ui';`,
  },
  {
    slug: 'dropdown',
    name: 'Dropdown',
    tagline: 'Custom select / action menu with a pill trigger and keyboard nav.',
    description:
      'An accessible listbox dropdown with a soft pill trigger, an optional leading icon, and a floating panel that lights options in the accent on hover or arrow-key focus. Works as an action menu (fixed label) or a value select (shows the chosen option). Full keyboard support — arrows, Home / End, type-ahead, Enter, Escape — and themeable via CSS variables. Powers every single-select field in Form.',
    category: 'Inputs',
    tags: ['dropdown', 'select', 'menu', 'combobox', 'listbox', 'form'],
    status: 'available',
    importStatement: `import { Dropdown } from '@roy-ui/ui';`,
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    tagline: 'Multiline field with floating label, auto-grow, and a character count.',
    description:
      "A multiline companion to Input — the same floating label and underline motion, plus optional auto-grow and a character counter. Built-in error and success states, light / dark / auto themes, zero dependencies.",
    category: 'Inputs',
    tags: ['form', 'textarea', 'multiline', 'input'],
    status: 'available',
    importStatement: `import { Textarea } from '@roy-ui/ui';`,
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    tagline: 'Accessible checkbox with an indeterminate state and a drawn check.',
    description:
      'A single checkbox with an indeterminate (tri-state) mode, a stroke-drawn tick, a focus ring, and inline error / helper text. A real native input under the hood for keyboard and form semantics; light / dark / auto themes.',
    category: 'Inputs',
    tags: ['form', 'checkbox', 'indeterminate'],
    status: 'available',
    importStatement: `import { Checkbox } from '@roy-ui/ui';`,
  },
  {
    slug: 'radio-group',
    name: 'RadioGroup',
    tagline: 'Grouped radios with native keyboard navigation.',
    description:
      'A radiogroup rendered from an options array, with arrow-key selection and roving focus for free via native radios. Vertical or horizontal layout, inline error / helper text, and light / dark / auto themes. Ships a standalone Radio too.',
    category: 'Inputs',
    tags: ['form', 'radio', 'radio-group', 'options'],
    status: 'available',
    importStatement: `import { RadioGroup } from '@roy-ui/ui';`,
  },
  {
    slug: 'number-input',
    name: 'NumberInput',
    tagline: 'Numeric field with steppers, min / max clamping, and precision.',
    description:
      "A number field with Input's floating-label chrome plus stepper buttons, arrow-key and PageUp / PageDown stepping, min / max clamping, and decimal precision. Error and success states, light / dark / auto themes.",
    category: 'Inputs',
    tags: ['form', 'number', 'stepper', 'input'],
    status: 'available',
    importStatement: `import { NumberInput } from '@roy-ui/ui';`,
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
    slug: 'stat-card',
    name: 'StatCard',
    tagline: 'Compact KPI tile with an inline sparkline and trend chip.',
    description:
      'A calm KPI / stat tile: a neutral hero number, a faint tinted icon, and a sentiment-aware trend chip (green for good, red for bad, set per metric with goodDirection). Its optional pure-line sparkline is drawn as inline SVG, so the card pulls in no chart library. Renders a real keyboard-focusable button or anchor when interactive, a shimmer skeleton while loading, and ships its own light / dark tokens. It never fabricates data — omit the series and the chart simply does not draw.',
    category: 'Display',
    tags: ['kpi', 'stat', 'metric', 'sparkline', 'dashboard', 'card'],
    status: 'available',
    importStatement: `import { StatCard } from '@roy-ui/ui';`,
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
    tagline: 'Binary toggle with an animated thumb.',
    description:
      'An accessible on/off switch (role="switch") with an eased thumb slide, a focus ring, an optional start or end label, and inline error / helper text. A native checkbox under the hood for keyboard and form semantics; light / dark / auto themes.',
    category: 'Inputs',
    tags: ['form', 'toggle', 'switch'],
    status: 'available',
    importStatement: `import { Switch } from '@roy-ui/ui';`,
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
