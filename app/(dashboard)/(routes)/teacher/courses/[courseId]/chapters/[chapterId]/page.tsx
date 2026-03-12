import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { ArrowLeft, LayoutDashboard, Video } from 'lucide-react';
import IconBadge from '@/components/IconBadge';

import ChapterTitleForm from './_components/ChapterTitleForm';
import ChapterDescriptionForm from './_components/ChapterDescriptionForm';
import ChapterActions from './_components/ChapterActions';
import Banner from '@/components/Banner';
import ChapterVideoForm from './_components/ChapterVideoForm';

async function ChapterIdPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { userId } = await auth();
  const { courseId, chapterId } = await params;

  if (!userId) {
    return redirect('/');
  }

  const chapter = await db.chapter.findUnique({
    where: {
      courseId,
      id: chapterId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect('/');
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;
  const isComplete = completedFields === totalFields;

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant='warning'
          label='This chapter is not published yet. Please finish adding the required fields and publish it.'
        />
      )}
      {chapter.isPublished && (
        <Banner
          variant='success'
          label='This chapter is published and is ready to be viewed by students'
        />
      )}
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='w-full'>
            <Link
              href={`/teacher/courses/${courseId}`}
              className='flex items-center hover:opacity-75 transition mb-6'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to course setup
            </Link>

            <div className='flex items-center justify-between w-full'>
              <div className='flex flex-col gap-y-2'>
                <h1 className='text-2x font-medium'>Chapter Creation</h1>
                <span className='text-sm text-slate-700'>
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div className='space-y-4'>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={LayoutDashboard} />

                <h2 className='text-xl'>Customize your chapter</h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                chapterId={chapterId}
                courseId={courseId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                chapterId={chapterId}
                courseId={courseId}
              />
            </div>
          </div>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={Video} />
              <h2 className='text-xl'>Add Video</h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              chapterId={chapterId}
              courseId={courseId}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChapterIdPage;
