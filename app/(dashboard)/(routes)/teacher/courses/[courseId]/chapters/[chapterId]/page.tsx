import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import ChapterTitleForm from './_components/ChapterTitleForm';

import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import IconBadge from '@/components/IconBadge';

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

  return (
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
              <h1 className='text-2xfont-medium'>Chapter Creation</h1>
              <span className='text-sm text-slate-700'>
                Complete all fields {completionText}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-col-1 md:grid-col-2 gap-6 mt-16'>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChapterIdPage;
