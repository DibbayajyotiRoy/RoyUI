import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import localFont from 'next/font/local';
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

export const metadata: Metadata = {
  title: 'RoyUI — The component library for the next React era',
  description:
    'Production-ready React components for Next.js, TanStack, and Vite. Zero-config styling. TypeScript-first. Tree-shakeable.',
  metadataBase: new URL('https://royui.dev'),
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
      </head>
      <body>
        <CommandPalette />
        <Header />
        {children}
        <Footer />
        <MadeBy name="Roy" href="https://dibbayajyoti.com" />
      </body>
    </html>
  );
}
