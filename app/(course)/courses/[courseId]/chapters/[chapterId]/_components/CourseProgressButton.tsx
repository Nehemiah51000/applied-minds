'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useConfettiStore } from '@/hooks/useConfettiStore';

import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ICourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isComplete?: boolean;
}

function CourseProgressButton({
  chapterId,
  courseId,
  nextChapterId,
  isComplete,
}: ICourseProgressButtonProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const Icon = isComplete ? XCircle : CheckCircle;

  const handleClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isComplete: !isComplete,
        },
      );

      if (isComplete && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isComplete && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success(
        `Chapter marked as ${!isComplete ? 'completed' : 'uncompleted'}`,
      );

      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type='button'
      variant={isComplete ? 'outline' : 'success'}
      disabled={isLoading}
      className='w-full md:w-auto'
      onClick={handleClick}>
      {isLoading ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : (
        <>
          {isComplete ? 'Mark as uncompleted' : 'Mark as complete'}
          <Icon className='h-4 w-4 ml-2' />
        </>
      )}
    </Button>
  );
}

export default CourseProgressButton;
