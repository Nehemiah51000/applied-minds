import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { userId } = await auth();
    const values = await req.json();
    const { courseId } = await params;
    console.log(values);

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
