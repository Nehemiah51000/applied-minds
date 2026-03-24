import { db } from '@/lib/db';

type TTopCourse = {
  courseId: string;
  title: string;
  enrollments: number;
  completions: number;
  completionRate: number;
};

type TAnalytics = {
  totalEnrollments: number;
  totalCompletedCourses: number;
  topCourses: TTopCourse[];
};

export async function getAnalytics(userId: string): Promise<TAnalytics> {
  try {
    const courses = await db.course.findMany({
      where: {
        userId,
        isPublished: true,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
        },
      },
    });

    const courseIds = courses.map((c) => c.id);

    const progress = await db.userProgress.findMany({
      where: {
        chapter: {
          courseId: {
            in: courseIds,
          },
        },
      },
      include: {
        chapter: true,
      },
    });

    const courseUserMap = new Map<
      string,
      Map<string, { completed: number; total: number }>
    >();

    for (const course of courses) {
      courseUserMap.set(course.id, new Map());
    }

    for (const entry of progress) {
      const courseId = entry.chapter.courseId;
      const userId = entry.userId;

      const userMap = courseUserMap.get(courseId)!;

      if (!userMap.has(userId)) {
        const totalChapters =
          courses.find((c) => c.id === courseId)?.chapters.length || 0;

        userMap.set(userId, {
          completed: 0,
          total: totalChapters,
        });
      }

      if (entry.isComplete) {
        userMap.get(userId)!.completed += 1;
      }
    }

    let totalEnrollments = 0;
    let totalCompletedCourses = 0;

    const topCourses: TTopCourse[] = [];

    for (const course of courses) {
      const userMap = courseUserMap.get(course.id)!;

      const enrollments = userMap.size;
      totalEnrollments += enrollments;

      let completions = 0;

      for (const progress of userMap.values()) {
        if (progress.total > 0 && progress.completed === progress.total) {
          completions++;
          totalCompletedCourses++;
        }
      }

      const completionRate = enrollments === 0 ? 0 : completions / enrollments;

      topCourses.push({
        courseId: course.id,
        title: course.title,
        enrollments,
        completions,
        completionRate,
      });
    }

    topCourses.sort(
      (a, b) =>
        b.completionRate * b.enrollments - a.completionRate * a.enrollments,
    );

    const top5Courses = topCourses.slice(0, 5);

    return {
      totalEnrollments,
      totalCompletedCourses,
      topCourses: top5Courses,
    };
  } catch (error) {
    console.log('GET_ANALYTICS_ERROR', error);

    return {
      totalEnrollments: 0,
      totalCompletedCourses: 0,
      topCourses: [],
    };
  }
}
