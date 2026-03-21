'use client';

import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import ConfirmModal from '@/components/modals/ConfirmModal';
import { useConfettiStore } from '@/hooks/useConfettiStore';

interface IActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

function Actions({ disabled, courseId, isPublished }: IActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  console.log(disabled);

  async function handleDelete() {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);

      toast.success('Course deleted successfully');
      router.refresh();

      router.push(`/teacher/courses`);
    } catch {
      toast.error('Failed to delete course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePublish() {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success('Course unpublished successfully');
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success('Course published successfully');
        confetti.onOpen();
      }
      router.refresh();
    } catch {
      toast.error('Failed to publish course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className='flex items-center gap-x-2'>
      <Button
        disabled={disabled || isLoading}
        size='sm'
        onClick={handlePublish}
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

export default Actions;
