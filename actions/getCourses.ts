import { Category, Course } from '@/app/generated/prisma';
import { db } from '@/lib/db';
import getProgress from './getProgress';

type TCoursesWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type TGetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};
async function getCourses({
  userId,
  title,
  categoryId,
}: TGetCourses): Promise<TCoursesWithProgressWithCategory[]> {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const courseWithProgress: TCoursesWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          const progressPercentage = await getProgress(userId, course.id);
          return {
            ...course,
            progress: progressPercentage,
          };
        }),
      );

    return courseWithProgress;
  } catch (error) {
    console.log('[GET_COURSES', error);
    return [];
  }
}
export default getCourses;
