'use client';

import { Button, type ButtonProps } from '@roy-ui/ui';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  href: string;
};

/** The published @roy-ui/ui Button renders a <button>, so for navigation we
 *  wrap it with the same view-transition push the rest of the site uses. */
export function NavButton({ href, children, ...rest }: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (
      typeof document !== 'undefined' &&
      typeof document.startViewTransition === 'function'
    ) {
      document.startViewTransition(() => router.push(href));
    } else {
      router.push(href);
    }
  };

  return (
    <Button onClick={handleClick} {...(rest as ButtonProps)}>
      {children}
    </Button>
  );
}
