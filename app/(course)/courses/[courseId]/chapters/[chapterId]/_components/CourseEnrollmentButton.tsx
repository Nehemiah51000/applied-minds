'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { CheckCircle, Loader2, XCircle } from 'lucide-react';
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

  const handleEnroll = async () => {
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

  const handleUnenroll = async () => {
    try {
      setIsLoading(true);

      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/unenroll`,
      );

      toast.success('Successfully unenrolled');
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
      variant={isEnrolled ? 'destructive' : 'success'}
      disabled={isLoading}
      className='w-full md:w-auto'
      onClick={isEnrolled ? handleUnenroll : handleEnroll}>
      {isLoading ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : isEnrolled ? (
        <>
          Unenroll
          <XCircle className='h-4 w-4 ml-2' />
        </>
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
