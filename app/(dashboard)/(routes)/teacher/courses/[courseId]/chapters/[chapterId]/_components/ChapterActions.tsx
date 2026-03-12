'use client';

import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

function ChapterActions({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: IChapterActionsProps) {
  return (
    <div className='flex items-center gap-x-2'>
      <Button
        disabled={disabled}
        size='sm'
        onClick={() => {}}
        variant='outline'>
        {!isPublished ? 'Publish' : 'Unpublish'}
      </Button>
      <Button size='sm'>
        <Trash className='h-4 w-4' />
      </Button>
    </div>
  );
}

export default ChapterActions;
