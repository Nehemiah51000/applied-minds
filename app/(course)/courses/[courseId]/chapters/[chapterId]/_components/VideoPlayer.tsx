'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import MuxPlayer from '@mux/mux-player-react';
import toast from 'react-hot-toast';
import { useConfettiStore } from '@/hooks/useConfettiStore';

import { Lock } from 'lucide-react';

interface IVideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId: string;
  playbackId: string;
  completeOnEnd: boolean;
  isLocked: boolean;
}

function VideoPlayer({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  completeOnEnd,
  isLocked,
}: IVideoPlayerProps) {
  const router = useRouter();
  const confetti = useConfettiStore();

  async function handleOnEnd() {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isComplete: true,
          },
        );

        if (!nextChapterId) {
          toast.success('You have successfully completed this course');
          router.refresh();
          confetti.onOpen();
        }

        if (nextChapterId) {
          toast.success('You have successfully completed this chapter');
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error('Something went wrong');
    }
  }

  if (isLocked) {
    return (
      <div className='aspect-video flex items-center justify-center bg-slate-800 rounded-lg'>
        <Lock className='h-10 w-10 text-white' />
      </div>
    );
  }

  return (
    <div className='aspect-video'>
      <MuxPlayer
        title={title}
        onEnded={handleOnEnd}
        autoPlay
        playbackId={playbackId}
      />
    </div>
  );
}

export default VideoPlayer;
