'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ICourseEnrollmentButtonProps {
  courseId: string;
  chapterId: string;
  isEnrolled?: boolean;
}

function CourseEnrollmentButton({
  courseId,
  chapterId,
  isEnrolled,
}: ICourseEnrollmentButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);

      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/enroll`);

      toast.success('Successfully enrolled');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnrolled) return null;

  return (
    <Button
      type='button'
      variant='success'
      disabled={isLoading}
      className='w-full md:w-auto'
      onClick={handleClick}>
      {isLoading ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : (
        <>
          Enroll in Course
          <CheckCircle className='h-4 w-4 ml-2' />
        </>
      )}
    </Button>
  );
}

export default CourseEnrollmentButton;
