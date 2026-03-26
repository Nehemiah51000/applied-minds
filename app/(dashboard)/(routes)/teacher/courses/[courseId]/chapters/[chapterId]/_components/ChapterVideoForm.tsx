'use client';

import { useRouter } from 'next/navigation';
import z from 'zod';
import { useState } from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';
import { Pencil, PlusCircle, VideoIcon } from 'lucide-react';
import MuxPlayer from '@mux/mux-player-react';

import { Chapter, MuxData } from '@/app/generated/prisma/client';

import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';

interface IChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  videoUrl: z.string().min(1),
});

function ChapterVideoForm({
  initialData,
  courseId,
  chapterId,
}: IChapterVideoFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);
  const router = useRouter();
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values,
      );

      toast.success('Chapter updated successfully');
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.log(error);

      toast.error('Failed to upload video. Please try again!');
    }
  };
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Chapter video
        <Button variant='ghost' onClick={toggleEdit} className='cursor-pointer'>
          {isEditing && <>cancel</>}

          {!isEditing && !initialData.videoUrl! && (
            <>
              <PlusCircle className='h-4 w-4 mr-1' />
              Add video
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className='h-4 w-4 mr-1' />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <VideoIcon className='h-10 w-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <MuxPlayer
              className='w-full h-full'
              playbackId={initialData?.muxData?.playbackId || ''}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint='chapterVideo'
            onChange={async (url) => {
              if (url) {
                await handleSubmit({ videoUrl: url });
              }
            }}
            media='video'
            maxSize={20}
          />
          <div className='text-sx text-muted-foreground mt-4'>
            Upload this chapter&apos;s video.
          </div>
        </div>
      )}
      {initialData?.videoUrl && !isEditing && (
        <div className='text-xs text-muted-foreground mt-2'>
          Video takes a while to process. If it does not appear, please refresh
          the screen.
        </div>
      )}
    </div>
  );
}

export default ChapterVideoForm;
