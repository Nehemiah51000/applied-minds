'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useConfettiStore } from '@/hooks/useConfettiStore';

import { CheckCircle, XCircle } from 'lucide-react';

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

      if (!isComplete && !nextChapterId) {
        confetti.onOpen();
      }
      if (!isComplete && nextChapterId) {
        router.push(`/api/courses/${courseId}/chapters/${nextChapterId}`);
      }
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
      className='w-full md:w-auto'>
      {isComplete ? 'Not completed' : 'Mark as complete'}
      <Icon className='h-4 w-4 ml-2' />
    </Button>
  );
}

export default CourseProgressButton;
