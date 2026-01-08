'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Separator as SeparatorPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

const separatorVariants = cva('shrink-0', {
  variants: {
    variant: {
      default: 'bg-border',
      muted: 'bg-border/50',
      gradient: 'bg-gradient-to-r from-transparent via-border to-transparent',
      warm: 'bg-gradient-to-r from-transparent via-amber-200/60 to-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface SeparatorProps
  extends Omit<React.ComponentProps<typeof SeparatorPrimitive.Root>, 'children'>,
    VariantProps<typeof separatorVariants> {}

function Separator({
  className,
  orientation = 'horizontal',
  variant,
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        separatorVariants({ variant }),
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  );
}

export { Separator, separatorVariants };
