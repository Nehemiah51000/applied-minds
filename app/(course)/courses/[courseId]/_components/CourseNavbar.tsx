import { Chapter, Course, UserProgress } from '@/app/generated/prisma';
import NavBarRoutes from '@/components/NavBarRoutes';
import CourseMobileSidebar from './CourseMobileSidebar';

interface ICourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}
function CourseNavbar({ course, progressCount }: ICourseNavbarProps) {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavBarRoutes />
    </div>
  );
}

export default CourseNavbar;
