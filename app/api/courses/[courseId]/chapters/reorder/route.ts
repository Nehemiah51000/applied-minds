import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { userId } = await auth();
    const { list } = await req.json();
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

    await db.$transaction(
      list.map((item: { id: string; position: number }) =>
        db.chapter.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      )
    );

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.log('[COURSES_ID_CHAPTERS_REORDER-PUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
