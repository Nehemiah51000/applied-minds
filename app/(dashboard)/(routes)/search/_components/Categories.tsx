'use client';

import { Category } from '@/app/generated/prisma';
import { IconType } from 'react-icons';
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from 'react-icons/fc';
import CategoryItem from './CategoryItem';

interface ICategoriesProps {
  items: Category[];
}
function Categories({ items }: ICategoriesProps) {
  const iconMap: Record<Category['name'], IconType> = {
    Music: FcMusic,
    Photography: FcOldTimeCamera,
    Fitness: FcSportsMode,
    Accounting: FcSalesPerformance,
    'Computer Science': FcMultipleDevices,
    'Filming & Editing': FcFilmReel,
    Engineering: FcEngineering,
  };

  return (
    <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          icon={iconMap[item.name]}
          label={item.name}
          value={item.id}
        />
      ))}
    </div>
  );
}

export default Categories;
