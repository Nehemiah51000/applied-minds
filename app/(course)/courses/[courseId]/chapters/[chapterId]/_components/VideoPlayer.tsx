'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MuxPlayer from '@mux/mux-player-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useConfettiStore } from '@/hooks/useConfettiStore';

import { Loader2 } from 'lucide-react';

interface IVideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId: string;
  playbackId: string;
  completeOnEnd: boolean;
}

function VideoPlayer({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  completeOnEnd,
}: IVideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  console.log(nextChapterId);

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

  return (
    <div className='relative aspect-video'>
      {!isReady && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary'>
          <Loader2 className='h-8 w-8 animate-spin text-secondary ' />
        </div>
      )}

      <MuxPlayer
        title={title}
        className={cn(!isReady && 'hidden')}
        onCanPlay={() => setIsReady(true)}
        onEnded={handleOnEnd}
        autoPlay
        playbackId={playbackId}
      />
    </div>
  );
}

export default VideoPlayer;
