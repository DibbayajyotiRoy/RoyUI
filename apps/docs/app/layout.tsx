import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { MadeBy } from '@royui/ui';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CommandPalette } from '../components/CommandPalette';
import './globals.css';

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
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
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
