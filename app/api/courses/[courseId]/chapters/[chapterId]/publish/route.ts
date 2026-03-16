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

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    const muxData = await db.muxData.findFirst({
      where: {
        chapterId,
      },
    });
    if (
      !chapter ||
      !chapter.videoUrl ||
      !chapter.title ||
      !chapter.description ||
      !muxData
    ) {
      return new NextResponse(
        'Please make sure all the required fields are filled and a video is uploaded before publishing.',
        { status: 400 },
      );
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log('[COURSES_CHAPTERS_ID_PUBLISH-PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
