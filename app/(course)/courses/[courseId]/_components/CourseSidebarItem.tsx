'use client';

import { cn } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { CheckCircle, PlayCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface ICourseSidebarItemProps {
  id: string;
  label: string;
  isComplete: boolean;
  courseId: string;
}

function CourseSidebarItem({
  id,
  label,
  isComplete,
  courseId,
}: ICourseSidebarItemProps) {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isComplete ? CheckCircle : PlayCircle;

  const isActive = pathname.includes(id);

  const handleClick = () => router.push(`/courses/${courseId}/chapters/${id}`);
  return (
    <button
      type='button'
      onClick={handleClick}
      className={cn(
        'flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-200/20 hover:cursor-pointer',
        isActive &&
          'text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700',
        isComplete && 'text-emerald-700 hover:text-emerald-700 ',
        isComplete && isActive && 'bg-emerald-200/20',
      )}>
      <div className='flex items-center gap-x-2 py-4'>
        <Icon
          size={22}
          className={cn(
            'text-slate-500',
            isActive && 'text-slate-700',
            isComplete && 'text-emerald-700',
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          'ml-auto opacity-0 border-2 border-slate-700 h-full transition-all',
          isActive && 'opacity-100',
          isComplete && 'border-emerald-700',
        )}
      />
    </button>
  );
}

export default CourseSidebarItem;
