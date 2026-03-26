'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import MuxPlayer from '@mux/mux-player-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useConfettiStore } from '@/hooks/useConfettiStore';
import { Lock, Loader2 } from 'lucide-react';

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
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const confetti = useConfettiStore();

  async function handleOnEnd() {
    try {
      if (completeOnEnd) {
        setIsLoading(true);

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
        } else {
          toast.success('Moving to the next chapter...');
          window.location.assign(
            `/courses/${courseId}/chapters/${nextChapterId}`,
          );
        }
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLocked) {
    return (
      <div className='relative aspect-video flex items-center justify-center bg-slate-800 rounded-md'>
        <div className='flex flex-col items-center gap-y-2 text-white'>
          <Lock className='h-8 w-8' />
          <p className='text-sm'>This chapter is locked</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative aspect-video bg-slate-900 rounded-md overflow-hidden'>
      {(!isReady || isLoading) && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800 z-10'>
          <Loader2 className='h-8 w-8 animate-spin text-white' />
        </div>
      )}
      <MuxPlayer
        title={title}
        className={`w-full h-full ${!isReady ? 'hidden' : ''}`}
        onCanPlay={() => setIsReady(true)}
        onEnded={handleOnEnd}
        autoPlay
        playbackId={playbackId}
      />
    </div>
  );
}

export default VideoPlayer;
