import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  try {
    const { userId } = await auth();
    const { chapterId } = await params;
    const { isComplete } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized access', { status: 401 });
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isComplete,
      },
      create: {
        userId,
        chapterId,
        isComplete,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log('[COURSES_CHAPTERS_ID_PROGRESS-PUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
