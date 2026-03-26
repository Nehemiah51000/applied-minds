import getProgress from '@/actions/getProgress';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import CourseSidebar from './_components/CourseSidebar';
import CourseNavbar from './_components/CourseNavbar';

async function CourseIdPageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { userId } = await auth();
  const { courseId } = await params;

  if (!userId || !courseId) {
    return redirect('/');
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });
  if (!course) {
    return redirect('/');
  }

  const progressCount = await getProgress(userId, course.id);

  return (
    <div className='h-full'>
      <div className='h-20 md:pl-80 fixed inset-y-0 w-full z-50'>
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50'>
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className='md:pl-80 h-full pt-20'>{children}</main>
    </div>
  );
}
export default CourseIdPageLayout;
