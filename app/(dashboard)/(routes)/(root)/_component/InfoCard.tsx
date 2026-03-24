import { type LucideIcon } from 'lucide-react';

import IconBadge from '@/components/IconBadge';

interface IInfoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: 'default' | 'success';
}

function InfoCard({
  icon: Icon,
  label,
  numberOfItems,
  variant,
}: IInfoCardProps) {
  return (
    <div className='border rounded-md flex items-center gap-x-3 p-3'>
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className='font-medium'>{label}</p>
        <p className='text-gray-500 text-sm'>
          {numberOfItems} {numberOfItems === 1 ? 'Course' : 'Courses'}
        </p>
      </div>
    </div>
  );
}

export default InfoCard;
