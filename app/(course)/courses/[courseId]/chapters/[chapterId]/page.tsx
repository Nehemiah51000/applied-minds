import { getChapter } from '@/actions/getChapter';
import Banner from '@/components/Banner';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { File } from 'lucide-react';
import { Preview } from '@/components/Preview';
import { Separator } from '@/components/ui/separator';
import VideoPlayer from '../../_components/VideoPlayer';

async function ChapterIdPage({
  params,
}: {
  params: { chapterId: string; courseId: string };
}) {
  const { chapterId, courseId } = await params;
  const { userId } = await auth();
  if (!userId) {
    return redirect('/');
  }

  const { chapter, userProgress, nextChapter, muxData, attachments } =
    await getChapter({
      userId,
      chapterId,
      courseId,
    });

  if (!courseId || !chapter) {
    return redirect('/');
  }
  return (
    <div>
      {userProgress?.isComplete && (
        <Banner
          variant='success'
          label='You have already completed this course🎉🎉'
        />
      )}
      <div className='flex flex-col max-w-4xl mx-auto pb-20'>
        <div className='p-4'>
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id || ''}
            playbackId={muxData?.playbackId || ''}
            completeOnEnd={!userProgress?.isComplete}
          />
        </div>
        <div>
          <div className='p-4 flex flex-col md:flex-row items-center'>
            <h2 className='text-2xl font-semibold mb-2 '>{chapter.title}</h2>

            {/*//@TODO:: WHEN YOU ADD PURCHASING OF COURSE ADD AN ENROLL BUTTON*/}
            {/*@TODO: add CourseProgressButton*/}
          </div>
        </div>

        <Separator />
        <div>
          <Preview value={chapter.description!} />
        </div>
        {attachments.length >= 0 && (
          <>
            <Separator />
            <div className='flex flex-col gap-y-2 p-4'>
              {attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target='_black'
                  className='flex items-center p-3 w-ful bg-orange-200 text-orange-700 rounded-md hover:underline'>
                  <File />
                  <p className='line-clamp-1'>{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChapterIdPage;
