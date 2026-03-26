import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
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

  if (existingEnrollment) {
    return NextResponse.json(existingEnrollment);
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course || !course.isPublished) {
    return new NextResponse('Course not found', { status: 404 });
  }

  const enrollment = await db.enrollment.create({
    data: {
      userId,
      courseId,
    },
  });

  return NextResponse.json(enrollment);
}
