import { getChapter } from '@/actions/getChapter';
import Banner from '@/components/Banner';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
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
      </div>
    </div>
  );
}

export default ChapterIdPage;
