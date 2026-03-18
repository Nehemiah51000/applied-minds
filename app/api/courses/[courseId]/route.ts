import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { userId } = await auth();
    const values = await req.json();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse('Unauthorized access', { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSES_ID-PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { userId } = await auth();
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

    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    course.chapters.forEach(async (chapter) => {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapter.id,
        },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
      }
    });

    const deletedCourse = await db.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log('[COURSES_ID-DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
