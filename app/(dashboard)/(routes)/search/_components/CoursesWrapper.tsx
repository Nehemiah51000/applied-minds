// app/(dashboard)/(routes)/search/_components/CoursesWrapper.tsx

import getCourses, {
  TCoursesWithProgressWithCategory,
} from '@/actions/getCourses';
import CoursesList from '@/components/CoursesList';

interface ICoursesWrapperProps {
  userId: string;
  searchParams?: { title?: string; categoryId?: string };
}

export default async function CoursesWrapper({
  userId,
  searchParams,
}: ICoursesWrapperProps) {
  const searchParamsObject = await searchParams;
  const courses = await getCourses({
    userId,
    title: searchParamsObject?.title,
    categoryId: searchParamsObject?.categoryId,
  });

  return <CoursesList items={courses} />;
}
