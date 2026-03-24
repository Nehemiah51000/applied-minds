'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import MuxPlayer from '@mux/mux-player-react';
import { cn } from '@/lib/utils';

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
        onEnded={() => {}}
        autoPlay
        playbackId={playbackId}
      />
    </div>
  );
}

export default VideoPlayer;
