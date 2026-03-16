import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> },
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;

    if (!userId) {
      return new NextResponse('Unauthorized access', { status: 401 });
    }

    const accountOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!accountOwner) {
      return new NextResponse('Unauthorized access', { status: 401 });
    }

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log('[COURSES_CHAPTERS_ID_UNPUBLISH-PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
