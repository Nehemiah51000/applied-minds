import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { courseId } = await params;

    if (!courseId) {
      return new NextResponse('Course ID missing', { status: 400 });
    }

    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!existingEnrollment) {
      return new NextResponse('Enrollment not found', { status: 404 });
    }

    const courseChapters = await db.chapter.findMany({
      where: {
        courseId,
      },
      select: {
        id: true,
      },
    });

    const chapterIds = courseChapters.map((chapter) => chapter.id);

    await db.userProgress.deleteMany({
      where: {
        userId,
        chapterId: {
          in: chapterIds,
        },
      },
    });

    await db.enrollment.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return NextResponse.json({ message: 'Unenrolled successfully' });
  } catch (error) {
    console.log('COURSE_ID_CHAPTER_ID_UNENROLL', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
