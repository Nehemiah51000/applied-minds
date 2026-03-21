'use client';
import qs from 'query-string';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IconType } from 'react-icons';

interface ICategoryItemProps {
  icon?: IconType;
  label: string;
  value?: string;
}

function CategoryItem({ icon: Icon, label, value }: ICategoryItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  const categoryId = params.get('categoryId');
  const currentTitle = params.get('title');

  const isSelected = categoryId === value;

  function handleClick() {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      },
    );

    router.push(url);
  }
  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-x-1 text-sm py-2 px-3 rounded-full border border-slate-200 hover:border-orange-700 transition',
        isSelected && 'bg-orange-700/20 text-orange-800 border-orange-700',
      )}
      type='button'>
      {Icon && <Icon size={20} />}
      <div className='truncate'>{label}</div>
    </button>
  );
}

export default CategoryItem;
