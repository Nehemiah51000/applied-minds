// app/(dashboard)/(routes)/search/_components/CoursesWrapper.tsx

import getCourses, {
  TCoursesWithProgressWithCategory,
} from '@/actions/getCourses';
import CoursesList from '@/components/CoursesList';

interface ICoursesWrapperProps {
  userId: string;
  searchParams: { title?: string; categoryId?: string };
}

export default async function CoursesWrapper({
  userId,
  searchParams,
}: ICoursesWrapperProps) {
  const courses: TCoursesWithProgressWithCategory[] = await getCourses({
    userId,
    title: searchParams.title,
    categoryId: searchParams.categoryId,
  });

  return <CoursesList items={courses} />;
}
