import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Header } from '../components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'RoyUI — Open source React components',
  description: 'Drop-in React components for Next.js, TanStack, and Vite.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
