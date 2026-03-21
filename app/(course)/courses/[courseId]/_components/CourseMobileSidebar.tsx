import { Chapter, Course, UserProgress } from '@/app/generated/prisma';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import CourseSidebar from './CourseSidebar';
import { Menu } from 'lucide-react';

interface ICourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}
function CourseMobileSidebar({
  course,
  progressCount,
}: ICourseMobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-white w-72'>
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
}

export default CourseMobileSidebar;
