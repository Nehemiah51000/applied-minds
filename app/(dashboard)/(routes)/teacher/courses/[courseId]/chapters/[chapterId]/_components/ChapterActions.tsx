'use client';

import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import ConfirmModal from '@/components/modals/ConfirmModal';

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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);

      toast.success('Chapter deleted successfully');
      router.refresh();

      router.push(`/teacher/courses/${courseId}`);
    } catch {
      toast.error('Failed to delete chapter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className='flex items-center gap-x-2'>
      <Button
        disabled={disabled || isLoading}
        size='sm'
        onClick={() => {}}
        variant='outline'>
        {!isPublished ? 'Publish' : 'Unpublish'}
      </Button>

      <ConfirmModal onConfirm={handleDelete}>
        <Button size='sm' disabled={isLoading}>
          <Trash className='h-4 w-4' />
        </Button>
      </ConfirmModal>
    </div>
  );
}

export default ChapterActions;
