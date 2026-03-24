import { Chapter, Course, UserProgress } from '@/app/generated/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import CourseProgress from '@/components/CourseProgress';
import CourseSidebarItem from './CourseSidebarItem';

interface ICourseSidebarProps {
  course: Course & {
    chapters: (Chapter & { userProgress: UserProgress[] | null })[];
  };
  progressCount: number;
}
async function CourseSidebar({ course, progressCount }: ICourseSidebarProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }
  return (
    <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
      <div className='p-8 border-b flex flex-col'>
        <h1 className='font-semibold'>{course.title}</h1>
        <div className='mt-10'>
          <CourseProgress
            variant={progressCount === 100 ? 'success' : 'default'}
            value={progressCount}
          />
        </div>
      </div>
      <div className='flex flex-col w-full'>
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isComplete={!!chapter.userProgress?.[0]?.isComplete}
            courseId={course.id}
          />
        ))}
      </div>
    </div>
  );
}

export default CourseSidebar;
