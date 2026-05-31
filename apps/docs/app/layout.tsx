import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { MadeBy } from '@roy-ui/ui';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CommandPalette } from '../components/CommandPalette';
import './globals.css';

const articulatCF = localFont({
  src: '../lib/fonts/articulat-cf/Articulat CF v3.2 OTF/ArticulatCF-Regular.otf',
  variable: '--font-articulat',
  display: 'swap',
  weight: '400',
  style: 'normal',
});

const SITE_URL = 'https://roy-ui-docs.vercel.app';
const SITE_NAME = 'Roy UI';
const SITE_TAGLINE = 'Animated components for React';
const SITE_DESCRIPTION =
  'Animated React components for Next.js, Vite, and Remix. TypeScript. Tree-shakable. Under 12 KB.';

// Explicit so phones render at device width (not a zoomed-out desktop canvas).
// viewportFit: 'cover' lets the layout extend under notches/home indicators.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#050507',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'React component library',
    'React UI library',
    'React UI kit',
    'React UI framework',
    'React components',
    'open source React components',
    'free React components',
    'TypeScript React components',
    'TypeScript-first component library',
    'Next.js component library',
    'Next.js 15 components',
    'Next.js App Router components',
    'React Server Components',
    'RSC-safe components',
    'use client',
    'Vite React components',
    'Remix UI components',
    'Astro React components',
    'TanStack Start components',
    'animated React components',
    'animated UI components',
    'React animation library',
    'micro-interactions',
    'micro-interactive components',
    'tree-shakable React components',
    'ESM React components',
    'zero-config React UI',
    'tiny React component library',
    'lightweight React UI',
    'design system',
    'headless UI',
    'accessible React components',
    'WAI-ARIA',
    'shadcn alternative',
    'shadcn/ui alternative',
    'Aceternity UI alternative',
    'Magic UI alternative',
    'MUI alternative',
    'Material UI alternative',
    'Radix UI alternative',
    'HeroUI alternative',
    'Mantine alternative',
    'Chakra UI alternative',
    'DaisyUI alternative',
    'Tailwind components',
    'Tailwind-friendly',
    'gradient button',
    'animated gradient button',
    'React gradient button',
    'React popover',
    'animated popover',
    'React text animation',
    'text morph',
    'React tree navigation',
    'React sidebar navigation',
    'attribution badge',
    'made by badge',
    'npm React components',
    'React 18',
    'React 19',
    'Roy UI',
    'RoyUI',
    '@roy-ui/ui',
  ],
  authors: [
    {
      name: 'Dibbayajyoti Roy',
      url: 'https://github.com/DibbayajyotiRoy',
    },
  ],
  creator: 'Dibbayajyoti Roy',
  publisher: 'Roy UI',
  category: 'technology',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    creator: '@dibbayajyoti',
    site: '@dibbayajyoti',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${articulatCF.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Synchronous, before paint — marks JS as active so the CSS
            initial-hidden states (.reveal-pre, .hero-stage) gate on .js.
            Without JS the class never lands and content renders fully
            visible, so crawlers + noscript users see real content. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Roy UI',
              alternateName: ['@roy-ui/ui', 'RoyUI'],
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web, Node.js',
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              downloadUrl: 'https://www.npmjs.com/package/@roy-ui/ui',
              softwareVersion: '0.0.3',
              license: 'https://opensource.org/licenses/MIT',
              programmingLanguage: 'TypeScript',
              author: {
                '@type': 'Person',
                name: 'Dibbayajyoti Roy',
                url: 'https://github.com/DibbayajyotiRoy',
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              keywords:
                'React component library, animated React components, Next.js 15, React Server Components, TypeScript, gradient button, popover, text morph, shadcn alternative, Aceternity UI alternative, Magic UI alternative, tree-shakable, ESM, open source',
            }),
          }}
        />
      </head>
      <body>
        <CommandPalette />
        <Header />
        {children}
        <Footer />
        <MadeBy name="Roy" href="https://dibbayajyoti.com" />
        <Analytics />
      </body>
    </html>
  );
}
