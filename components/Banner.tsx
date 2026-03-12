import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircleIcon } from 'lucide-react';

const bannerVariance = cva(
  'border text-center p-4 text-sm flex items-center w-full',
  {
    variants: {
      variant: {
        warning: 'bg-yellow-300/80 border-yellow-32 text-primary',
        success: 'bg-yellow-300/80 border-yellow-32 text-primary',
      },
    },
    defaultVariants: {
      variant: 'warning',
    },
  },
);

interface IBannerProps extends VariantProps<typeof bannerVariance> {
  label: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};
function Banner({ label, variant }: IBannerProps) {
  const Icon = iconMap[variant || 'warning'];

  return (
    <div className={cn(bannerVariance({ variant }))}>
      <Icon className='w-4 h-4 mr-2' />
      {label}
    </div>
  );
}

export default Banner;
