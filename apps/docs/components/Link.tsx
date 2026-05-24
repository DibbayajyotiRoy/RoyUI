'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { forwardRef, type ComponentProps, type MouseEvent } from 'react';

type LinkProps = ComponentProps<typeof NextLink>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { onClick, href, ...rest },
  ref,
) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function') return;

    const target = typeof href === 'string' ? href : href.toString();
    if (target.startsWith('http') || target.startsWith('#')) return;

    e.preventDefault();
    document.startViewTransition(() => {
      router.push(target);
    });
  };

  return <NextLink ref={ref} href={href} onClick={handleClick} {...rest} />;
});
