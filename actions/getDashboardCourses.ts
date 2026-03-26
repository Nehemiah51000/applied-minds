import { Category, Chapter, Course } from '@/app/generated/prisma';
import { db } from '@/lib/db';
import getProgress from './getProgress';

type TWithCoursesWithCategory = Course & {
  chapters: Chapter[];
  category: Category;
  progress: number | null;
};

type TDashboardCourses = {
  completedCourses: TWithCoursesWithCategory[];
  coursesInProgress: TWithCoursesWithCategory[];
};

export async function getDashboardCourses(
  userId: string,
): Promise<TDashboardCourses> {
  try {
    const enrolledCourses = await db.course.findMany({
      where: {
        isPublished: true,
        enrollments: {
          some: {
            userId,
          },
        },
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
        },
      },
    });

    const coursesWithProgress = (await Promise.all(
      enrolledCourses.map(async (course) => {
        const progress = await getProgress(userId, course.id);

        return {
          ...course,
          progress,
        };
      }),
    )) as TWithCoursesWithCategory[];

    const completedCourses = coursesWithProgress.filter(
      (course) => course.progress === 100,
    );

    const coursesInProgress = coursesWithProgress.filter(
      (course) => (course.progress ?? 0) < 100,
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log('GET_DASHBOARD_COURSES', error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
}
