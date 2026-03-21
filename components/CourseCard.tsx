import Image from 'next/image';
import Link from 'next/link';

import { BookOpen } from 'lucide-react';

import IconBadge from './IconBadge';

interface ICourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chapterLength: number;
  progress: number | null;
  category: string;
}
function CourseCard({
  id,
  title,
  imageUrl,
  chapterLength,
  progress,
  category,
}: ICourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <div className='border group rounded-lg overflow-hidden hover:shadow-sm transition p-3 h-full duration-300'>
        <div className='relative w-full aspect-video overflow-hidden rounded-md '>
          <Image
            fill
            alt={title}
            src={imageUrl}
            className='object-cover group-hover:scale-105 transition-transform duration-300'
          />
        </div>
        <div className='flex flex-col pt-2'>
          <div className='text-lg md:text-base font-medium group-hover:text-orange-700 transition duration-300 line-clamp-2'>
            {title}
          </div>
          <p className='text-xs text-muted-foreground'>{category}</p>
          <div className='flex items-center gap-x-2 my-3 text-sm md:text-xs'>
            <div className='flex items-center gap-x-1 text-muted-foreground'>
              <IconBadge icon={BookOpen} size='sm' />
              <span>
                {chapterLength} {chapterLength === 1 ? 'Chapter' : 'Chapters'}
              </span>
            </div>
          </div>
          {progress !== null && <div>{/*//@todo add progress component*/}</div>}
        </div>
        <p>Progress: {progress !== null ? `${progress}%` : 'Not started'}</p>
      </div>
    </Link>
  );
}

export default CourseCard;
