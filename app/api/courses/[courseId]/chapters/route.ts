import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    const { courseId } = await params;

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

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[COURSES_ID_CHAPTERS-POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
