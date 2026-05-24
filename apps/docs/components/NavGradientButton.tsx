'use client';

import { GradientButton, type GradientButtonProps } from '@roy-ui/ui';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof GradientButton>, 'onClick'> & {
  href: string;
};

export function NavGradientButton({ href, children, ...rest }: Props) {
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
    <GradientButton onClick={handleClick} {...(rest as GradientButtonProps)}>
      {children}
    </GradientButton>
  );
}
