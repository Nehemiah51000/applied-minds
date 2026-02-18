import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const backgroundVariants = cva(
  'rounded-full flex items-center justify-center',
  {
    variants: {
      variant: {
        default: 'bg-orange-100',
        success: 'bg-emerald-100',
      },
      iconVariant: {
        default: 'text-orange-700',
        success: 'text-emerald-700',
      },
      size: {
        default: 'p-2',
        sm: 'p-1',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const iconVariants = cva('', {
  variants: {
    variant: {
      default: 'text-orange-700',
      success: 'text-emerald-700',
    },
    size: {
      default: 'h-8 w-8',
      sm: 'h-4 w-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type TBackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type TIconVariantsProps = VariantProps<typeof iconVariants>;

interface IIconBadgeProps extends TBackgroundVariantsProps, TIconVariantsProps {
  icon: LucideIcon;
}

function IconBadge({ icon: Icon, variant, size }: IIconBadgeProps) {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  );
}

export default IconBadge;
