import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> },
) {
  try {
    const { userId } = await auth();
    const { isPublished, ...values } = await req.json();
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

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...values,
      },
    });

    //:TODO Add the logic to deal with videos

    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[COURSES_CHAPTERS_ID-PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
