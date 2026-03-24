'use client';

import * as React from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const progressVariants = cva('h-full w-full flex-1 bg-primary transition-all', {
  variants: {
    variant: {
      default: 'bg-orange-600',
      success: 'bg-emerald-700',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface IProgressProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {}

type TCombinedProgressProps = IProgressProps &
  React.ComponentProps<typeof ProgressPrimitive.Root>;
function Progress({
  className,
  value,
  variant,
  ...props
}: TCombinedProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot='progress'
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
        className,
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot='progress-indicator'
        className={cn(progressVariants({ variant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
